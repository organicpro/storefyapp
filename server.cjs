require("dotenv").config({ path: ".env.local" });
require("dotenv").config();
const express = require("express");
const path = require("path");
const {
  handleDelete,
  handlePublish,
  handleSave,
  handleStatus,
  handleValidate
} = require("./api/_storefy-netlify.cjs");
const { createCode, createRootAdminCode, deleteCode, deleteRootAdminCode, expireCode, getProfile, listCodes, redeem, rootAdminCode } = require("./api/_storefy-levels.cjs");

const app = express();
const port = Number(process.env.PORT || 3000);
const dist = path.join(__dirname, "dist");

app.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use(express.json({ limit: "16mb" }));

app.get("/api/integrations/netlify", handleStatus);
app.delete("/api/integrations/netlify", handleDelete);
app.post("/api/integrations/netlify/validate", handleValidate);
app.post("/api/integrations/netlify/save", handleSave);
app.post("/api/projects/:projectId/publish/netlify", handlePublish);

app.get("/api/access/profile", getProfile);
app.post("/api/access/redeem", redeem);
app.get("/api/admin/codes", listCodes);
app.post("/api/admin/codes", createCode);
app.patch("/api/admin/codes/:id/expire", expireCode);
app.delete("/api/admin/codes/:id", deleteCode);
app.get("/api/root/admin-code", rootAdminCode);
app.post("/api/root/admin-code", createRootAdminCode);
app.delete("/api/root/admin-code/:id", deleteRootAdminCode);

app.post("/api/netlify-publish", (_req, res) => {
  res.status(410).json({
    error: "Use /api/projects/:projectId/publish/netlify com token salvo no backend."
  });
});

app.use(express.static(dist, { etag: false, maxAge: 0 }));
app.get("*", (_req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Storefy front running at http://localhost:${port}`);
});
