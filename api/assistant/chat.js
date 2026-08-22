import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { handleSiaChat } = require('../_storefy-sia.cjs');

export const config = {
  maxDuration: 25
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Metodo nao permitido.' });
  }
  return handleSiaChat(req, res);
}
