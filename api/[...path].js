import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  handleDelete,
  handlePublish,
  handleSave,
  handleStatus,
  handleValidate
} = require('./_storefy-netlify.cjs');
const {
  createCode,
  createRootAdminCode,
  deleteCode,
  deleteRootAdminCode,
  expireCode,
  getProfile,
  listCodes,
  redeem,
  rootAdminCode
} = require('./_storefy-levels.cjs');
const { handleMarketplacePreview } = require('./_storefy-marketplace-import.cjs');
const { handleSiaChat, handleSiaReelCaptions } = require('./_storefy-sia.cjs');

export const config = { maxDuration: 60 };

function routePath(req) {
  const queryPath = req.query?.path;
  if (Array.isArray(queryPath)) return queryPath.join('/');
  if (typeof queryPath === 'string' && queryPath) return queryPath;
  return new URL(req.url || '/', 'http://storefy.local').pathname.replace(/^\/api\/?/, '');
}

function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  return res.status(405).json({ error: 'Metodo nao permitido.' });
}

export default function handler(req, res) {
  const path = routePath(req).replace(/^\/+|\/+$/g, '');
  const method = String(req.method || 'GET').toUpperCase();

  if (path === 'access/profile') {
    if (method !== 'GET') return methodNotAllowed(res, ['GET']);
    return getProfile(req, res);
  }
  if (path === 'access/redeem') {
    if (method !== 'POST') return methodNotAllowed(res, ['POST']);
    return redeem(req, res);
  }
  if (path === 'admin/codes') {
    if (method === 'GET') return listCodes(req, res);
    if (method === 'POST') return createCode(req, res);
    return methodNotAllowed(res, ['GET', 'POST']);
  }

  const expireMatch = path.match(/^admin\/codes\/([^/]+)\/expire$/);
  if (expireMatch) {
    if (method !== 'PATCH') return methodNotAllowed(res, ['PATCH']);
    req.params = { ...(req.params || {}), id: decodeURIComponent(expireMatch[1]) };
    return expireCode(req, res);
  }
  const codeMatch = path.match(/^admin\/codes\/([^/]+)$/);
  if (codeMatch) {
    if (method !== 'DELETE') return methodNotAllowed(res, ['DELETE']);
    req.params = { ...(req.params || {}), id: decodeURIComponent(codeMatch[1]) };
    return deleteCode(req, res);
  }

  if (path === 'root/admin-code') {
    if (method === 'GET') return rootAdminCode(req, res);
    if (method === 'POST') return createRootAdminCode(req, res);
    return methodNotAllowed(res, ['GET', 'POST']);
  }
  const rootCodeMatch = path.match(/^root\/admin-code\/([^/]+)$/);
  if (rootCodeMatch) {
    if (method !== 'DELETE') return methodNotAllowed(res, ['DELETE']);
    req.params = { ...(req.params || {}), id: decodeURIComponent(rootCodeMatch[1]) };
    return deleteRootAdminCode(req, res);
  }

  if (path === 'integrations/netlify') {
    if (method === 'GET') return handleStatus(req, res);
    if (method === 'DELETE') return handleDelete(req, res);
    return methodNotAllowed(res, ['GET', 'DELETE']);
  }
  if (path === 'integrations/netlify/save') {
    if (method !== 'POST') return methodNotAllowed(res, ['POST']);
    return handleSave(req, res);
  }
  if (path === 'integrations/netlify/validate') {
    if (method !== 'POST') return methodNotAllowed(res, ['POST']);
    return handleValidate(req, res);
  }

  const publishMatch = path.match(/^projects\/([^/]+)\/publish\/netlify$/);
  if (publishMatch) {
    if (method !== 'POST') return methodNotAllowed(res, ['POST']);
    req.params = { ...(req.params || {}), projectId: decodeURIComponent(publishMatch[1]) };
    return handlePublish(req, res);
  }

  if (path === 'product-import/preview') {
    if (method !== 'POST') return methodNotAllowed(res, ['POST']);
    return handleMarketplacePreview(req, res);
  }
  if (path === 'assistant/chat') {
    if (method !== 'POST') return methodNotAllowed(res, ['POST']);
    return handleSiaChat(req, res);
  }
  if (path === 'assistant/reel-captions') {
    if (method !== 'POST') return methodNotAllowed(res, ['POST']);
    return handleSiaReelCaptions(req, res);
  }

  return res.status(404).json({ error: 'Rota nao encontrada.' });
}
