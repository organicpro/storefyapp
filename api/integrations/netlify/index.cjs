const { handleDelete, handleStatus } = require("../../../_storefy-netlify.cjs");

module.exports = (req, res) => {
  if (req.method === "DELETE") return handleDelete(req, res);
  return handleStatus(req, res);
};
