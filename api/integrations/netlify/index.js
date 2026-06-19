import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { handleDelete, handleStatus } = require('../../_storefy-netlify.cjs');

export default function handler(req, res) {
  if (req.method === 'DELETE') return handleDelete(req, res);
  return handleStatus(req, res);
}
