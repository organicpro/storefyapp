const crypto = require("crypto");

const NETLIFY_API = "https://api.netlify.com/api/v1";

function json(statusCode, payload) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  };
}

function slugify(value) {
  return String(value || "storefy-loja")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 38) || "storefy-loja";
}

async function netlifyFetch(pathname, token, options = {}) {
  const response = await fetch(`${NETLIFY_API}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    }
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => "");

  if (!response.ok) {
    const message = typeof payload === "string"
      ? payload
      : payload.message || payload.error || "Netlify API error";
    throw new Error(message);
  }

  return payload;
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Metodo nao permitido." });
  }

  try {
    const { html, site } = JSON.parse(event.body || "{}");
    const token = site?.netlifyApiToken || process.env.NETLIFY_AUTH_TOKEN;

    if (!html || typeof html !== "string") {
      return json(400, { error: "HTML da loja ausente." });
    }

    if (!token) {
      return json(400, { error: "Token Netlify ausente." });
    }

    let siteId = site?.netlifySiteId;
    let siteInfo = null;

    if (!siteId) {
      const name = `${slugify(site?.subdomain || site?.name)}-${Date.now().toString(36)}`;
      siteInfo = await netlifyFetch("/sites", token, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name })
      });
      siteId = siteInfo.id;
    }

    const htmlBuffer = Buffer.from(html, "utf8");
    const sha = crypto.createHash("sha1").update(htmlBuffer).digest("hex");
    const deploy = await netlifyFetch(`/sites/${siteId}/deploys`, token, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files: { "/index.html": sha } })
    });

    const required = deploy.required || deploy.required_functions || [];
    if (required.includes(sha)) {
      await netlifyFetch(`/deploys/${deploy.id}/files/index.html`, token, {
        method: "PUT",
        headers: { "Content-Type": "application/octet-stream" },
        body: htmlBuffer
      });
    }

    return json(200, {
      mode: "netlify",
      siteId,
      deployId: deploy.id,
      url: deploy.deploy_ssl_url || deploy.ssl_url || siteInfo?.ssl_url || siteInfo?.url || deploy.url,
      deployUrl: deploy.deploy_ssl_url || deploy.ssl_url || deploy.url
    });
  } catch (error) {
    return json(500, {
      error: error instanceof Error ? error.message : "Falha ao publicar na Netlify."
    });
  }
};
