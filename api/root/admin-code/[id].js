import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { deleteRootAdminCode } = require('../../_storefy-levels.cjs');

export default function handler(req, res) {
  if (req.method === 'DELETE') return deleteRootAdminCode(req, res);
  return res.status(405).json({ error: 'Metodo nao permitido.' });
}
