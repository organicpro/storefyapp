const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

const NETLIFY_API = "https://api.netlify.com/api/v1";

function normalizeNetlifyToken(value) {
  return String(value || "")
    .trim()
    .replace(/^NETLIFY(?:_AUTH)?_TOKEN\s*=\s*/i, "")
    .replace(/^Bearer\s+/i, "")
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function json(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
  if (typeof req.body === "string") {
    try {
      return Promise.resolve(JSON.parse(req.body));
    } catch {
      return Promise.resolve({});
    }
  }

  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > 16 * 1024 * 1024) {
        reject(new Error("Payload muito grande."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("SUPABASE_URL/VITE_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sao obrigatorios no backend.");
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

async function getAuthedUser(req) {
  const auth = req.headers.authorization || req.headers.Authorization || "";
  const token = String(auth).replace(/^Bearer\s+/i, "").trim();

  if (!token) {
    const error = new Error("Sessao ausente.");
    error.statusCode = 401;
    throw error;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data?.user?.id) {
    const authError = new Error("Sessao invalida.");
    authError.statusCode = 401;
    throw authError;
  }

  return { supabase, user: data.user };
}

function getEncryptionKey() {
  const raw = process.env.NETLIFY_TOKEN_ENCRYPTION_KEY;
  if (!raw) throw new Error("NETLIFY_TOKEN_ENCRYPTION_KEY ausente.");

  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("NETLIFY_TOKEN_ENCRYPTION_KEY precisa ter 32 bytes em base64.");
  }
  return key;
}

function encryptSecret(secret) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    encryptedToken: encrypted.toString("base64"),
    tokenIv: iv.toString("base64"),
    tokenTag: tag.toString("base64")
  };
}

function decryptSecret(data) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(data.token_iv || data.tokenIv, "base64")
  );

  decipher.setAuthTag(Buffer.from(data.token_tag || data.tokenTag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(data.encrypted_token || data.encryptedToken, "base64")),
    decipher.final()
  ]).toString("utf8");
}

async function netlifyJson(pathname, token, options = {}) {
  const cleanToken = normalizeNetlifyToken(token);
  const response = await fetch(`${NETLIFY_API}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || data?.error || JSON.stringify(data) || "Erro na API Netlify.";
    throw new Error(message);
  }

  return data;
}

async function validateNetlifyToken(token) {
  const cleanToken = normalizeNetlifyToken(token);
  if (!cleanToken || cleanToken.length < 12) {
    throw new Error("Token Netlify invalido.");
  }

  try {
    const data = await netlifyJson("/user", cleanToken);
    return {
      accountName: data.full_name || data.name || data.login || data.slug || "",
      email: data.email || "",
      token: cleanToken,
      raw: data
    };
  } catch {
    try {
      await netlifyJson("/sites?per_page=1", cleanToken);
      return {
        accountName: "Netlify",
        email: "",
        token: cleanToken,
        raw: { fallbackValidated: true }
      };
    } catch {
      throw new Error("Token Netlify invalido.");
    }
  }
}

function slugify(value) {
  return String(value || "storefy-loja")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "storefy-loja";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getStoreProductIds(config, products) {
  const ids = Array.isArray(config?.productIds)
    ? [...new Set(config.productIds.filter(Boolean))]
    : [];

  if (!ids.length) return [];

  const productById = new Map((products || []).map(product => [product.id, product]));
  const lastSelectedCategory = [...ids].reverse()
    .map(id => productById.get(id)?.category)
    .find(Boolean);

  if (!lastSelectedCategory) return ids;
  return ids.filter(id => productById.get(id)?.category === lastSelectedCategory);
}

function getSelectedProductsForStore(config, products) {
  const selectedIds = new Set(getStoreProductIds(config, products));
  return (products || [])
    .filter(product => selectedIds.has(product.id))
    .map(product => ({ ...product, addedToStore: true }));
}

function buildStoreHtml(config, products) {
  const activeProducts = getSelectedProductsForStore(config, products);
  const phone = String(config.whatsapp || "").replace(/\D/g, "");
  const whatsappFor = product => {
    const text = product
      ? `Ola! Quero comprar: ${product.name} - R$ ${Number(product.salePrice || 0).toFixed(2).replace(".", ",")}`
      : config.welcomeMessage || "Ola! Tenho interesse nos produtos.";
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };
  const categories = [...new Set(activeProducts.map(product => product.category).filter(Boolean))];
  const productCards = activeProducts.map(product => `
    <article class="card">
      <div class="media">${product.imageUrl ? `<img src="${escapeHtml(product.imageUrl)}" alt="${escapeHtml(product.name)}" loading="lazy" />` : `<div class="no-image">Imagem indisponivel</div>`}</div>
      <div class="body">
        <span>${escapeHtml(product.category || product.subcategory || "Oferta")}</span>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.deliverable || "Produto selecionado para entrega combinada.")}</p>
        <strong>R$ ${Number(product.salePrice || 0).toFixed(2).replace(".", ",")}</strong>
        <a href="${escapeHtml(whatsappFor(product))}" target="_blank" rel="noreferrer">Comprar</a>
      </div>
    </article>
  `).join("");

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(config.name || "Storefy")}</title>
  <style>
    *{box-sizing:border-box}body{margin:0;background:#050507;color:#fff;font-family:Inter,Arial,sans-serif}a{text-decoration:none;color:inherit}.wrap{width:min(1160px,calc(100% - 32px));margin:0 auto}.hero{padding:34px 0 48px;background:radial-gradient(circle at 20% 0%,${escapeHtml(config.primaryColor || "#d4af37")}55,transparent 30%),linear-gradient(135deg,#050507,#101014)}.top{display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{display:flex;align-items:center;gap:12px}.brand img{width:52px;height:52px;object-fit:contain;border-radius:14px;background:#fff1;padding:6px}.hero h1{font-size:clamp(38px,7vw,74px);line-height:.92;letter-spacing:-.06em;margin:42px 0 16px;max-width:860px}.hero p{color:#cbd5e1;font-size:18px;line-height:1.6;max-width:680px}.cats{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.cats span,.body span{border:1px solid #ffffff22;background:#ffffff12;border-radius:999px;padding:8px 12px;font-size:11px;font-weight:900;text-transform:uppercase}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px;padding:32px 0 54px}.card{overflow:hidden;border:1px solid #ffffff18;background:linear-gradient(180deg,#ffffff12,#ffffff08);border-radius:22px;box-shadow:0 24px 70px #0008}.media{height:186px;background:#101014;display:flex;align-items:center;justify-content:center}.media img{width:100%;height:100%;object-fit:cover}.no-image{color:#94a3b8;font-size:12px;font-weight:800}.body{padding:16px}.body h3{font-size:18px;line-height:1.15;margin:14px 0 8px}.body p{min-height:40px;color:#b6c2d2;font-size:13px;line-height:1.45}.body strong{display:block;font-size:24px;margin:16px 0}.body a,.cta{display:inline-flex;justify-content:center;align-items:center;border-radius:999px;background:${escapeHtml(config.primaryColor || "#d4af37")};color:#050505;font-weight:900;padding:12px 16px}.footer{border-top:1px solid #ffffff14;padding:32px 0 46px;color:#cbd5e1}@media(max-width:720px){.top{align-items:flex-start}.media{height:156px}}
  </style>
</head>
<body>
  <header class="hero"><div class="wrap">
    <div class="top">
      <div class="brand">${config.logoUrl ? `<img src="${escapeHtml(config.logoUrl)}" alt="${escapeHtml(config.name)}" />` : ""}<strong>${escapeHtml(config.name || "Storefy")}</strong></div>
      <a class="cta" href="#produtos">Ver produtos</a>
    </div>
    <h1>${escapeHtml(config.name || "Storefy")} pronta para vender.</h1>
    <p>Produtos organizados, atendimento direto e compra rapida. Escolha sua oferta e fale com a loja para finalizar.</p>
    <div class="cats">${categories.map(category => `<span>${escapeHtml(category)}</span>`).join("")}</div>
  </div></header>
  <main id="produtos" class="wrap"><section class="grid">${productCards || "<p>Nenhum produto selecionado.</p>"}</section></main>
  <footer class="footer"><div class="wrap">Entre em contato com a loja para finalizar o pedido.</div></footer>
</body>
</html>`;
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function dosDateTime(date = new Date()) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, date: dosDate };
}

function createZip(files) {
  const locals = [];
  const centrals = [];
  let offset = 0;
  const stamp = dosDateTime();

  for (const file of files) {
    const name = Buffer.from(file.name, "utf8");
    const content = Buffer.isBuffer(file.content) ? file.content : Buffer.from(String(file.content), "utf8");
    const crc = crc32(content);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(stamp.time, 10);
    local.writeUInt16LE(stamp.date, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(content.length, 18);
    local.writeUInt32LE(content.length, 22);
    local.writeUInt16LE(name.length, 26);
    locals.push(local, name, content);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x0800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(stamp.time, 12);
    central.writeUInt16LE(stamp.date, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(content.length, 20);
    central.writeUInt32LE(content.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    centrals.push(central, name);
    offset += local.length + name.length + content.length;
  }

  const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralSize, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, ...centrals, end]);
}

async function createNetlifySite(token, name) {
  return netlifyJson("/sites", token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  });
}

async function createNetlifySiteWithPreferredName(token, preferredName) {
  const baseName = slugify(preferredName);
  const suffix = Date.now().toString(36).slice(-5);
  const candidates = [baseName, `${baseName}-2`, `${baseName}-3`, `${baseName}-${suffix}`];
  let lastError;

  for (const candidate of candidates) {
    try {
      const site = await createNetlifySite(token, candidate);
      return { ...site, storefySiteName: site.name || candidate };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Nao foi possivel criar o site na Netlify.");
}

async function updateNetlifySiteName(token, siteId, preferredName) {
  const name = slugify(preferredName);
  try {
    const site = await netlifyJson(`/sites/${encodeURIComponent(siteId)}`, token, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    return { ...site, storefySiteName: site.name || name };
  } catch {
    return null;
  }
}

async function deployHtmlToNetlify({ token, siteId, html, title }) {
  const cleanToken = normalizeNetlifyToken(token);
  const url = new URL(`${NETLIFY_API}/sites/${siteId}/deploys`);
  url.searchParams.set("production", "true");
  if (title) url.searchParams.set("title", title);

  const zip = createZip([
    { name: "index.html", content: html },
    { name: "_redirects", content: "/* /index.html 200\n" }
  ]);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      "Content-Type": "application/zip"
    },
    body: zip
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || JSON.stringify(data) || "Erro ao publicar na Netlify.");
  }

  return {
    deployId: data.id,
    url: data.ssl_url || data.url || data.deploy_ssl_url || data.deploy_url,
    raw: data
  };
}

async function getIntegration(supabase, userId) {
  const { data, error } = await supabase
    .from("storefy_user_integrations")
    .select("encrypted_token,token_iv,token_tag,token_last4,account_email,account_name")
    .eq("user_id", userId)
    .eq("provider", "netlify")
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function handleStatus(req, res) {
  try {
    if (req.method !== "GET") return json(res, 405, { error: "Metodo nao permitido." });
    const { supabase, user } = await getAuthedUser(req);
    const integration = await getIntegration(supabase, user.id);
    return json(res, 200, {
      ok: true,
      connected: Boolean(integration),
      accountName: integration?.account_name || "",
      email: integration?.account_email || "",
      tokenLast4: integration?.token_last4 || ""
    });
  } catch (error) {
    return json(res, error.statusCode || 500, { ok: false, error: error.message || "Erro ao consultar integracao." });
  }
}

async function handleValidate(req, res) {
  try {
    if (req.method !== "POST") return json(res, 405, { error: "Metodo nao permitido." });
    const { token } = await readBody(req);
    const account = await validateNetlifyToken(token);
    return json(res, 200, {
      ok: true,
      accountName: account.accountName,
      email: account.email,
      tokenLast4: account.token.slice(-4)
    });
  } catch (error) {
    return json(res, 400, { ok: false, error: error.message || "Token Netlify invalido." });
  }
}

async function handleSave(req, res) {
  try {
    if (req.method !== "POST") return json(res, 405, { error: "Metodo nao permitido." });
    const { supabase, user } = await getAuthedUser(req);
    const { token } = await readBody(req);
    const account = await validateNetlifyToken(token);
    const cleanToken = account.token;
    const encrypted = encryptSecret(cleanToken);

    const { error } = await supabase
      .from("storefy_user_integrations")
      .upsert({
        user_id: user.id,
        provider: "netlify",
        encrypted_token: encrypted.encryptedToken,
        token_iv: encrypted.tokenIv,
        token_tag: encrypted.tokenTag,
        token_last4: cleanToken.slice(-4),
        account_email: account.email,
        account_name: account.accountName,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id,provider" });

    if (error) throw error;

    return json(res, 200, {
      ok: true,
      connected: true,
      accountName: account.accountName,
      email: account.email,
      tokenLast4: cleanToken.slice(-4)
    });
  } catch (error) {
    return json(res, error.statusCode || 500, { ok: false, error: error.message || "Erro ao salvar integracao." });
  }
}

async function handleDelete(req, res) {
  try {
    if (req.method !== "DELETE") return json(res, 405, { error: "Metodo nao permitido." });
    const { supabase, user } = await getAuthedUser(req);
    const { error } = await supabase
      .from("storefy_user_integrations")
      .delete()
      .eq("user_id", user.id)
      .eq("provider", "netlify");
    if (error) throw error;
    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, error.statusCode || 500, { ok: false, error: error.message || "Erro ao remover integracao." });
  }
}

async function handlePublish(req, res) {
  try {
    if (req.method !== "POST") return json(res, 405, { error: "Metodo nao permitido." });
    const { supabase, user } = await getAuthedUser(req);
    const body = await readBody(req);
    const projectId = req.query?.projectId || req.params?.projectId || req.url?.split("/api/projects/")[1]?.split("/")[0];
    if (!projectId) return json(res, 400, { ok: false, error: "Project ID ausente." });

    const integration = await getIntegration(supabase, user.id);
    if (!integration) return json(res, 409, { ok: false, code: "NETLIFY_NOT_CONNECTED", error: "Conecte a Netlify nas configuracoes antes de publicar." });

    const token = decryptSecret(integration);
    const { data: workspace, error: workspaceError } = await supabase
      .from("storefy_workspaces")
      .select("products,sites,active_site_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (workspaceError) throw workspaceError;
    const sites = Array.isArray(workspace?.sites) ? workspace.sites : [];
    const products = Array.isArray(workspace?.products) ? workspace.products : [];
    const decodedProjectId = decodeURIComponent(String(projectId));
    const siteIndex = sites.findIndex(site => (
      site.id === decodedProjectId ||
      site.publicSlug === decodedProjectId ||
      site.subdomain === decodedProjectId
    ));

    if (siteIndex < 0 && !body.html) {
      return json(res, 404, { ok: false, error: "Projeto nao encontrado." });
    }

    const siteConfig = siteIndex >= 0 ? sites[siteIndex] : { name: body.siteName || "Storefy", subdomain: body.siteName || "storefy" };
    const html = typeof body.html === "string" && body.html.trim()
      ? body.html
      : buildStoreHtml(siteConfig, products);
    const desiredSiteName = slugify(body.siteName || siteConfig.name || siteConfig.subdomain || "storefy");
    let siteId = body.siteId || siteConfig.netlifySiteId;
    let netlifySiteName = siteConfig.netlifySiteName || "";

    if (!siteId) {
      const created = await createNetlifySiteWithPreferredName(token, desiredSiteName);
      siteId = created.id;
      netlifySiteName = created.storefySiteName || desiredSiteName;
    } else if (netlifySiteName !== desiredSiteName) {
      const renamed = await updateNetlifySiteName(token, siteId, desiredSiteName);
      if (renamed?.storefySiteName) netlifySiteName = renamed.storefySiteName;
    }

    const deploy = await deployHtmlToNetlify({
      token,
      siteId,
      html,
      title: siteConfig.name || desiredSiteName
    });

    const publishedAt = new Date().toISOString();
    const nextSiteConfig = {
      ...siteConfig,
      status: "published",
      netlifySiteId: siteId,
      netlifySiteName,
      productIds: getStoreProductIds(siteConfig, products),
      publishedUrl: deploy.url,
      publishedAt,
      lastNetlifyDeployId: deploy.deployId
    };

    if (siteIndex >= 0) {
      const nextSites = [...sites];
      nextSites[siteIndex] = nextSiteConfig;
      await supabase
        .from("storefy_workspaces")
        .upsert({
          user_id: user.id,
          products,
          sites: nextSites,
          active_site_id: workspace?.active_site_id || nextSiteConfig.id,
          updated_at: publishedAt
        }, { onConflict: "user_id" });

      if (nextSiteConfig.publicSlug) {
        await supabase
          .from("storefy_public_stores")
          .update({
            store_config: nextSiteConfig,
            products: getSelectedProductsForStore(nextSiteConfig, products),
            updated_at: publishedAt
          })
          .eq("slug", nextSiteConfig.publicSlug)
          .eq("user_id", user.id);
      }
    }

    return json(res, 200, {
      ok: true,
      url: deploy.url,
      deployId: deploy.deployId,
      siteId,
      siteName: netlifySiteName || desiredSiteName
    });
  } catch (error) {
    return json(res, error.statusCode || 500, { ok: false, error: error.message || "Erro ao publicar na Netlify." });
  }
}

module.exports = {
  handleStatus,
  handleValidate,
  handleSave,
  handleDelete,
  handlePublish,
  encryptSecret,
  decryptSecret,
  validateNetlifyToken,
  deployHtmlToNetlify
};
