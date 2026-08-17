import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { handleMarketplacePreview } = require('../_storefy-marketplace-import.cjs');

export const config = {
  maxDuration: 60
};

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Metodo nao permitido.' });
  }
  return handleMarketplacePreview(req, res);
}
