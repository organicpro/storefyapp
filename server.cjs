const express = require("express");
const path = require("path");

const app = express();
const port = Number(process.env.PORT || 3000);
const dist = path.join(__dirname, "dist");

app.use((_req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

app.use(express.static(dist, { etag: false, maxAge: 0 }));
app.get("*", (_req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Storefy front running at http://localhost:${port}`);
});
