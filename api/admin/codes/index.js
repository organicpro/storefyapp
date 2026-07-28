import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createCode, listCodes } = require('../../_storefy-levels.cjs');

export default function handler(req, res) {
  if (req.method === 'POST') return createCode(req, res);
  if (req.method === 'GET') return listCodes(req, res);
  return res.status(405).json({ error: 'Metodo nao permitido.' });
}
