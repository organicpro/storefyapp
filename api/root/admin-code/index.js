import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createRootAdminCode, rootAdminCode } = require('../../_storefy-levels.cjs');

export default function handler(req, res) {
  if (req.method === 'POST') return createRootAdminCode(req, res);
  if (req.method === 'GET') return rootAdminCode(req, res);
  return res.status(405).json({ error: 'Metodo nao permitido.' });
}
