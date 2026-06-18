const express = require("express");
const path = require("path");
const crypto = require("crypto");

const app = express();
const port = Number(process.env.PORT || 3000);
const dist = path.join(__dirname, "dist");
const NETLIFY_API = "https://api.netlify.com/api/v1";

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
    const message = typeof payload === "string" ? payload : payload.message || payload.error || "Netlify API error";
    throw new Error(message);
  }

  return payload;
}

app.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use(express.json({ limit: "12mb" }));

app.post("/api/netlify-publish", async (req, res) => {
  try {
    const { html, site } = req.body || {};
    const token = site?.netlifyApiToken || process.env.NETLIFY_AUTH_TOKEN;

    if (!html || typeof html !== "string") {
      return res.status(400).json({ error: "HTML da loja ausente." });
    }

    if (!token) {
      return res.status(400).json({ error: "Token Netlify ausente." });
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

    res.json({
      mode: "netlify",
      siteId,
      deployId: deploy.id,
      url: deploy.deploy_ssl_url || deploy.ssl_url || siteInfo?.ssl_url || siteInfo?.url || deploy.url,
      deployUrl: deploy.deploy_ssl_url || deploy.ssl_url || deploy.url
    });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Falha ao publicar na Netlify." });
  }
});

app.use(express.static(dist, { etag: false, maxAge: 0 }));
app.get("*", (_req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Storefy front running at http://localhost:${port}`);
});
