const fs = require("fs");
const path = require("path");

const MAX_HTML_BYTES = 5 * 1024 * 1024;
const REQUEST_TIMEOUT_MS = 12000;
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.NETLIFY);
const SCRAPER_TIMEOUT_MS = IS_SERVERLESS ? 9000 : 45000;
const PREVIEW_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
const PREVIEW_CACHE_FILE = path.join(__dirname, "..", ".storefy-marketplace-cache.json");
const SCRAPINGBEE_TIERS = [
  { label: "classic", renderJs: false },
  { label: "classic-js", renderJs: true },
  { label: "premium-js", renderJs: true, premiumProxy: true },
  { label: "stealth-js", renderJs: true, stealthProxy: true }
];
const SCRAPINGBEE_FAST_TIERS = [
  { label: "stealth-js", renderJs: true, stealthProxy: true },
  { label: "premium-js", renderJs: true, premiumProxy: true },
  { label: "classic-js", renderJs: true },
  { label: "classic", renderJs: false }
];
const SCRAPINGBEE_SERVERLESS_TIERS = [
  { label: "premium-metadata", renderJs: false, premiumProxy: true }
];

let scrapingBeeKeyCursor = 0;
const previewCache = new Map();

function loadPreviewCache() {
  try {
    if (!fs.existsSync(PREVIEW_CACHE_FILE)) return;
    const entries = JSON.parse(fs.readFileSync(PREVIEW_CACHE_FILE, "utf8"));
    if (!Array.isArray(entries)) return;
    entries.forEach(([key, value]) => {
      if (key && value?.product && value?.createdAt) previewCache.set(key, value);
    });
  } catch {
    previewCache.clear();
  }
}

function persistPreviewCache() {
  try {
    const entries = Array.from(previewCache.entries()).slice(-500);
    fs.writeFileSync(PREVIEW_CACHE_FILE, JSON.stringify(entries), "utf8");
  } catch {
    // Cache is an optimization; import should keep working if disk persistence fails.
  }
}

loadPreviewCache();

const MARKETPLACES = {
  mercado_livre: {
    label: "Mercado Livre",
    hosts: ["mercadolivre.com.br", "mercadolivre.com", "meli.la"]
  },
  shopee: {
    label: "Shopee",
    hosts: ["shopee.com.br", "shopee.com", "shp.ee"]
  }
};

const LOCAL_PRODUCT_FIXTURES = [
  {
    marketplace: "mercado_livre",
    identifiers: ["MLBU3729545771", "MLB6174889696"],
    product: {
      marketplace: "mercado_livre",
      marketplaceLabel: "Mercado Livre",
      externalId: "MLB6174889696",
      sourceUrl: "https://www.mercadolivre.com.br/mini-liquidificador-mixer-juice-garrafa-portatil-usb-3-37v/up/MLBU3729545771?pdp_filters=item_id%3AMLB6174889696",
      name: "Mini Liquidificador Mixer Juice Garrafa Portátil USB 3,7V",
      description: "Mini liquidificador portátil e recarregável via USB para preparar sucos, vitaminas e shakes. Possui copo de 380 ml, seis lâminas de aço inoxidável, bateria recarregável, alça para transporte e formato compacto para usar em casa, no trabalho, na academia ou em viagens. Acompanha cabo USB.",
      price: 37.99,
      images: [
        "https://http2.mlstatic.com/D_NQ_NP_810378-MLA99592659680_122025-O.webp"
      ],
      brand: "Genérica",
      availability: "https://schema.org/InStock"
    }
  }
];

function getLocalProductFixture(rawUrl, marketplaceId) {
  const normalizedUrl = String(rawUrl || "").toUpperCase();
  const fixture = LOCAL_PRODUCT_FIXTURES.find(item => (
    item.marketplace === marketplaceId
    && item.identifiers.some(identifier => normalizedUrl.includes(identifier))
  ));
  if (!fixture) return null;
  return {
    ...fixture.product,
    images: [...fixture.product.images],
    importedAt: new Date().toISOString(),
    localFixture: true,
    cached: true
  };
}

function hostMatches(hostname, allowedHost) {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  return host === allowedHost || host.endsWith(`.${allowedHost}`);
}

function detectMarketplace(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return null;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) return null;
  for (const [id, marketplace] of Object.entries(MARKETPLACES)) {
    if (marketplace.hosts.some(host => hostMatches(parsed.hostname, host))) {
      return { id, label: marketplace.label, url: parsed };
    }
  }
  return null;
}

function decodeHtml(value = "") {
  return String(value)
    .replace(/&#(\d+);/g, (_match, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_match, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function cleanText(value = "") {
  return decodeHtml(String(value))
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s+/g, "\n")
    .trim();
}

function parseAttributes(tag) {
  const attributes = {};
  const expression = /([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let match;
  while ((match = expression.exec(tag))) {
    attributes[match[1].toLowerCase()] = decodeHtml(match[2] ?? match[3] ?? match[4] ?? "");
  }
  return attributes;
}

function extractMeta(html) {
  const values = new Map();
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  tags.forEach(tag => {
    const attributes = parseAttributes(tag);
    const key = String(attributes.property || attributes.name || "").toLowerCase();
    const content = attributes.content || "";
    if (!key || !content) return;
    const current = values.get(key) || [];
    current.push(content);
    values.set(key, current);
  });
  return values;
}

function extractJsonLd(html) {
  const documents = [];
  const expression = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = expression.exec(html))) {
    const raw = match[1].trim().replace(/^<!--|-->$/g, "").trim();
    if (!raw) continue;
    try {
      documents.push(JSON.parse(raw));
    } catch {
      // Some marketplace pages publish malformed optional JSON-LD blocks.
    }
  }
  return documents;
}

function flattenJsonLd(value, output = []) {
  if (!value) return output;
  if (Array.isArray(value)) {
    value.forEach(item => flattenJsonLd(item, output));
    return output;
  }
  if (typeof value !== "object") return output;
  output.push(value);
  if (Array.isArray(value["@graph"])) flattenJsonLd(value["@graph"], output);
  return output;
}

function isProductNode(node) {
  const type = node?.["@type"];
  return Array.isArray(type) ? type.includes("Product") : String(type || "").toLowerCase() === "product";
}

function normalizeImages(value) {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  return list
    .flatMap(item => {
      if (typeof item === "string") return [item];
      if (item && typeof item === "object") return [item.url || item.contentUrl || ""];
      return [];
    })
    .filter(item => /^https?:\/\//i.test(item));
}

function parsePrice(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value == null) return null;
  const normalized = String(value)
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  if (!/\d/.test(normalized)) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function firstMeta(meta, ...keys) {
  for (const key of keys) {
    const value = meta.get(key)?.[0];
    if (value) return value;
  }
  return "";
}

function extractMercadoLivreEmbeddedPrice(html, meta) {
  const descriptions = [
    firstMeta(meta, "og:description", "description"),
    firstMeta(meta, "twitter:description")
  ];
  for (const description of descriptions) {
    const match = String(description || "").match(/R\$\s*([\d.]+(?:,\d{1,2})?)/i);
    const parsed = parsePrice(match?.[1]);
    if (parsed != null) return parsed;
  }

  const embeddedPatterns = [
    /"price"\s*:\s*([\d.]+)\s*,\s*"currency_id"\s*:\s*"BRL"/i,
    /"value"\s*:\s*([\d.]+)\s*,\s*"currency_symbol"\s*:\s*"R\$"/i
  ];
  for (const pattern of embeddedPatterns) {
    const parsed = parsePrice(html.match(pattern)?.[1]);
    if (parsed != null) return parsed;
  }
  return null;
}

function extractExternalId(marketplaceId, url, html) {
  if (marketplaceId === "mercado_livre") {
    const match = `${url} ${html.slice(0, 50000)}`.match(/\b(MLB-?\d{6,})\b/i);
    return match ? match[1].replace("-", "").toUpperCase() : "";
  }
  const canonical = url.match(/\/product\/(\d+)\/(\d+)/i);
  if (canonical) return `${canonical[1]}.${canonical[2]}`;
  const compact = url.match(/-i\.(\d+)\.(\d+)/i);
  return compact ? `${compact[1]}.${compact[2]}` : "";
}

function getScrapingBeeKeys() {
  const values = [
    process.env.SCRAPINGBEE_API_KEYS,
    process.env.SCRAPINGBEE_API_KEY
  ]
    .filter(Boolean)
    .flatMap(value => String(value).split(/[,\n;]/))
    .map(value => value.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
  return Array.from(new Set(values));
}

function getOrderedScrapingBeeKeys() {
  const keys = getScrapingBeeKeys();
  if (keys.length <= 1) return keys;
  const start = scrapingBeeKeyCursor % keys.length;
  scrapingBeeKeyCursor = (scrapingBeeKeyCursor + 1) % keys.length;
  return [...keys.slice(start), ...keys.slice(0, start)];
}

function isRetryableScrapingBeeStatus(status) {
  return [401, 402, 403, 408, 409, 425, 429, 500, 502, 503, 504].includes(Number(status));
}

function getScrapingBeeTiers(marketplace) {
  const mode = String(process.env.SCRAPINGBEE_IMPORT_MODE || "").trim().toLowerCase();
  if (IS_SERVERLESS) return SCRAPINGBEE_SERVERLESS_TIERS;
  if (mode === "economy") return SCRAPINGBEE_TIERS;
  if (mode === "fast" || marketplace?.id === "mercado_livre") {
    return SCRAPINGBEE_FAST_TIERS;
  }
  return SCRAPINGBEE_TIERS;
}

function applyScrapingBeeTier(endpoint, tier) {
  endpoint.searchParams.set("render_js", tier.renderJs ? "true" : "false");
  endpoint.searchParams.set("country_code", "br");
  endpoint.searchParams.set("timeout", String(SCRAPER_TIMEOUT_MS));
  if (tier.renderJs) endpoint.searchParams.set("wait", "500");
  if (tier.premiumProxy) endpoint.searchParams.set("premium_proxy", "true");
  if (tier.stealthProxy) endpoint.searchParams.set("stealth_proxy", "true");
}

async function fetchHtmlViaScrapingBeeKey(rawUrl, marketplace, apiKey, tier) {
  const endpoint = new URL("https://app.scrapingbee.com/api/v1");
  endpoint.searchParams.set("api_key", apiKey);
  endpoint.searchParams.set("url", rawUrl);
  applyScrapingBeeTier(endpoint, tier);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SCRAPER_TIMEOUT_MS);
  try {
    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml"
      }
    });
    if (!response.ok) {
      const error = new Error(`O serviço de importação respondeu com erro ${response.status}.`);
      error.providerStatus = response.status;
      error.statusCode = 502;
      throw error;
    }
    const contentLength = Number(response.headers.get("content-length") || 0);
    if (contentLength > MAX_HTML_BYTES) {
      const error = new Error("A página do produto é grande demais para importar.");
      error.statusCode = 413;
      throw error;
    }
    const html = await response.text();
    if (Buffer.byteLength(html, "utf8") > MAX_HTML_BYTES) {
      const error = new Error("A página do produto é grande demais para importar.");
      error.statusCode = 413;
      throw error;
    }
    return { html, marketplace, finalUrl: rawUrl };
  } catch (requestError) {
    const error = new Error(requestError?.name === "AbortError"
      ? "A importação demorou demais para responder. Tente novamente."
      : requestError.message || "Não foi possível consultar o produto agora.");
    error.statusCode = requestError.statusCode || 502;
    error.providerStatus = requestError.providerStatus;
    error.marketplace = marketplace;
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchHtmlViaScrapingBee(rawUrl, marketplace) {
  const keys = getOrderedScrapingBeeKeys();
  if (keys.length === 0) return null;

  const errors = [];
  for (const tier of getScrapingBeeTiers(marketplace)) {
    for (const apiKey of keys) {
      try {
        return await fetchHtmlViaScrapingBeeKey(rawUrl, marketplace, apiKey, tier);
      } catch (error) {
        errors.push(error);
        if (!isRetryableScrapingBeeStatus(error.providerStatus)) throw error;
      }
    }
  }

  const lastError = errors.at(-1);
  const error = new Error(lastError?.message || "Não foi possível consultar o produto agora.");
  error.statusCode = lastError?.statusCode || 502;
  error.providerStatus = lastError?.providerStatus;
  error.marketplace = marketplace;
  throw error;
}

async function fetchMarketplaceHtml(rawUrl) {
  const initial = detectMarketplace(rawUrl);
  if (!initial) {
    const error = new Error("Cole um link válido do Mercado Livre ou da Shopee.");
    error.statusCode = 400;
    throw error;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(initial.url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36 StorefyImporter/1.0",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "pt-BR,pt;q=0.9"
      }
    });
  } catch (requestError) {
    const error = new Error(requestError?.name === "AbortError"
      ? "O marketplace demorou demais para responder. Tente novamente."
      : "Não foi possível acessar o produto agora.");
    error.statusCode = 502;
    error.marketplace = initial;
    throw error;
  } finally {
    clearTimeout(timer);
  }

  const finalMarketplace = detectMarketplace(response.url);
  if (!finalMarketplace || finalMarketplace.id !== initial.id) {
    const error = new Error("O link redirecionou para um endereço não permitido.");
    error.statusCode = 400;
    throw error;
  }
  if (!response.ok) {
    const error = new Error(response.status === 403 || response.status === 429
      ? `${initial.label} bloqueou a consulta automática. Use o preenchimento manual.`
      : `O produto respondeu com erro ${response.status}.`);
    error.statusCode = response.status === 404 ? 404 : 502;
    error.marketplace = initial;
    throw error;
  }

  const contentLength = Number(response.headers.get("content-length") || 0);
  if (contentLength > MAX_HTML_BYTES) {
    const error = new Error("A página do produto é grande demais para importar.");
    error.statusCode = 413;
    throw error;
  }
  const html = await response.text();
  if (Buffer.byteLength(html, "utf8") > MAX_HTML_BYTES) {
    const error = new Error("A página do produto é grande demais para importar.");
    error.statusCode = 413;
    throw error;
  }
  return { html, marketplace: finalMarketplace, finalUrl: response.url };
}

function getCacheKey(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    parsed.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach(param => parsed.searchParams.delete(param));
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

function getExternalCacheKey(marketplaceId, externalId) {
  return marketplaceId && externalId ? `${marketplaceId}:${externalId}` : "";
}

function getCachedPreview(rawUrl) {
  const detected = detectMarketplace(rawUrl);
  const externalKey = detected
    ? getExternalCacheKey(detected.id, extractExternalId(detected.id, rawUrl, ""))
    : "";
  const keys = [externalKey, getCacheKey(rawUrl)].filter(Boolean);
  const cacheKey = keys.find(key => previewCache.has(key));
  const cached = cacheKey ? previewCache.get(cacheKey) : null;
  if (!cached) return null;
  if (Date.now() - cached.createdAt > PREVIEW_CACHE_TTL_MS) {
    keys.forEach(key => previewCache.delete(key));
    persistPreviewCache();
    return null;
  }
  return cached.product;
}

function setCachedPreview(rawUrl, product) {
  const createdAt = Date.now();
  const keys = [
    getCacheKey(rawUrl),
    getExternalCacheKey(product.marketplace, product.externalId)
  ].filter(Boolean);
  keys.forEach(key => previewCache.set(key, { product, createdAt }));
  if (previewCache.size > 500) {
    const oldestKey = previewCache.keys().next().value;
    previewCache.delete(oldestKey);
  }
  persistPreviewCache();
}

async function handleMarketplacePreview(req, res) {
  const rawUrl = String(req.body?.url || "").trim();
  if (!rawUrl) return res.status(400).json({ error: "Cole o link de um produto." });

  try {
    const detected = detectMarketplace(rawUrl);
    if (!detected) return res.status(400).json({ error: "Cole um link válido do Mercado Livre ou da Shopee." });

    const localProduct = getLocalProductFixture(rawUrl, detected.id);
    if (localProduct) return res.json({ product: localProduct, creditsUsed: 0 });

    const cachedProduct = getCachedPreview(rawUrl);
    if (cachedProduct) return res.json({ product: { ...cachedProduct, cached: true } });

    let pageResult = null;
    if (detected.id === "mercado_livre" || process.env.SCRAPINGBEE_API_KEYS || process.env.SCRAPINGBEE_API_KEY) {
      try {
        pageResult = await fetchHtmlViaScrapingBee(rawUrl, detected);
      } catch (scraperError) {
        if (getScrapingBeeKeys().length > 0) throw scraperError;
      }
    }
    const { html, marketplace, finalUrl } = pageResult || await fetchMarketplaceHtml(rawUrl);
    const meta = extractMeta(html);
    const nodes = extractJsonLd(html).flatMap(document => flattenJsonLd(document));
    const productNode = nodes.find(isProductNode) || {};
    const offers = Array.isArray(productNode.offers) ? productNode.offers[0] : (productNode.offers || {});
    const metaImages = [
      ...(meta.get("og:image") || []),
      ...(meta.get("og:image:url") || []),
      ...(meta.get("twitter:image") || [])
    ];
    const images = Array.from(new Set([
      ...normalizeImages(productNode.image),
      ...normalizeImages(metaImages)
    ])).slice(0, 12);
    const name = cleanText(productNode.name || firstMeta(meta, "og:title", "twitter:title") || "");
    const description = cleanText(productNode.description || firstMeta(meta, "og:description", "description", "twitter:description") || "");
    const structuredPrice = parsePrice(
      offers.price
      ?? offers.lowPrice
      ?? firstMeta(meta, "product:price:amount", "og:price:amount")
    );
    const price = structuredPrice ?? (marketplace.id === "mercado_livre"
      ? extractMercadoLivreEmbeddedPrice(html, meta)
      : null);

    if (!name && images.length === 0 && price == null) {
      return res.status(422).json({
        error: `Não encontramos dados públicos nesse link do ${marketplace.label}. Você pode preencher manualmente.`,
        marketplace: marketplace.id,
        marketplaceLabel: marketplace.label,
        manualFallback: true
      });
    }

    const product = {
      marketplace: marketplace.id,
      marketplaceLabel: marketplace.label,
      externalId: extractExternalId(marketplace.id, finalUrl, html),
      sourceUrl: finalUrl,
      name,
      description,
      price,
      images,
      brand: cleanText(typeof productNode.brand === "string" ? productNode.brand : productNode.brand?.name || ""),
      availability: cleanText(offers.availability || ""),
      importedAt: new Date().toISOString()
    };
    setCachedPreview(rawUrl, product);
    return res.json({ product });
  } catch (error) {
    const fallbackMarketplace = error.marketplace || detectMarketplace(rawUrl);
    return res.status(error.statusCode || 500).json({
      error: error.message || "Não foi possível importar o produto.",
      marketplace: fallbackMarketplace?.id || null,
      marketplaceLabel: fallbackMarketplace?.label || null,
      manualFallback: Boolean(fallbackMarketplace)
    });
  }
}

module.exports = { handleMarketplacePreview };
