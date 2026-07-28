const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");
if (typeof global.WebSocket === "undefined") global.WebSocket = require("ws");

function json(res, status, payload) { res.status(status).json(payload); }
function adminClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase nao configurado no servidor.");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
async function authenticated(req) {
  const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
  if (!token) { const error = new Error("Sessao ausente."); error.statusCode = 401; throw error; }
  const supabase = adminClient();
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) { const authError = new Error("Sessao invalida."); authError.statusCode = 401; throw authError; }
  return { supabase, user: data.user };
}
function configuredAdmin(user, profile) {
  const configured = String(process.env.STOREFY_ADMIN_EMAILS || "").split(",").map(value => value.trim().toLowerCase()).filter(Boolean);
  return Boolean(profile?.is_admin || configured.includes(String(user.email || "").toLowerCase()));
}
async function profileFor(supabase, user) {
  const { data, error } = await supabase.from("storefy_profiles").select("user_id,nome,nivel,codigo_socio,is_admin").eq("user_id", user.id).maybeSingle();
  if (error) throw error;
  if (data) return data;
  const { data: created, error: createError } = await supabase.from("storefy_profiles").upsert({ user_id: user.id, nome: user.user_metadata?.display_name || user.email?.split("@")[0] || "Usuario", nivel: 1 }).select("user_id,nome,nivel,codigo_socio,is_admin").single();
  if (createError) throw createError;
  return created;
}
function publicProfile(user, profile) {
  const isAdmin = configuredAdmin(user, profile);
  return { userId: user.id, email: user.email || "", name: profile.nome || user.user_metadata?.display_name || "", level: isAdmin ? 10 : Number(profile.nivel || 1), partnerCode: profile.codigo_socio || null, isAdmin };
}
function isMissingCodesTable(error) {
  return error?.code === "42P01" || /codigos_convite|schema cache/i.test(error?.message || "");
}
function publicCode(row) {
  const source = row.store_config?.__storefyInvite ? row.store_config : row;
  const maxUses = Number(source.max_usos || 5);
  const uses = Number(source.usos || 0);
  return { id: row.id ?? row.slug, code: source.codigo, uses, maxUses, status: source.status || "ativo", createdAt: source.criado_em || row.updated_at, expiresAt: source.expira_em || null, remaining: Math.max(0, maxUses - uses) };
}
async function fallbackCodeRows(supabase) {
  const { data, error } = await supabase.from("storefy_public_stores").select("slug,store_config,updated_at").like("slug", "__storefy_invite__%").order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}
async function insertFallbackCode(supabase, userId, code, maxUses, expiresAt) {
  const createdAt = new Date().toISOString();
  const row = { slug: `__storefy_invite__${code.toLowerCase()}`, user_id: userId, store_config: { __storefyInvite: true, codigo: code, usos: 0, max_usos: maxUses, status: "ativo", criado_em: createdAt, expira_em: expiresAt }, products: [], updated_at: createdAt };
  const { data, error } = await supabase.from("storefy_public_stores").insert(row).select("slug,store_config,updated_at").single();
  if (error) throw error;
  return data;
}
async function getProfile(req, res) {
  try { const { supabase, user } = await authenticated(req); return json(res, 200, publicProfile(user, await profileFor(supabase, user))); }
  catch (error) { return json(res, error.statusCode || 500, { error: error.message }); }
}
async function listCodes(req, res) {
  try {
    const { supabase, user } = await authenticated(req); const profile = await profileFor(supabase, user); const isAdmin = configuredAdmin(user, profile);
    if (!isAdmin && Number(profile.nivel) !== 10) return json(res, 403, { error: "Area disponivel apenas para socios Nivel 10." });
    let rows;
    let query = supabase.from("codigos_convite").select("id,codigo,usos,max_usos,status,criado_em,expira_em").order("criado_em", { ascending: false });
    if (!isAdmin) query = query.eq("codigo", profile.codigo_socio || "");
    const primary = await query;
    if (primary.error && !isMissingCodesTable(primary.error)) throw primary.error;
    if (primary.error) {
      rows = await fallbackCodeRows(supabase);
      if (!isAdmin) rows = rows.filter(row => row.store_config?.codigo === profile.codigo_socio);
    } else rows = primary.data || [];
    const codes = rows.map(publicCode);
    return json(res, 200, { codes, totalUsed: codes.reduce((total, code) => total + code.uses, 0), canManage: isAdmin });
  } catch (error) { return json(res, error.statusCode || 500, { error: error.message }); }
}
async function createCode(req, res) {
  try {
    const { supabase, user } = await authenticated(req); const profile = await profileFor(supabase, user);
    if (!configuredAdmin(user, profile)) return json(res, 403, { error: "Apenas administradores podem gerar codigos." });
    const existingPrimary = await supabase.from("codigos_convite").select("id").limit(1);
    const existingRows = existingPrimary.error && isMissingCodesTable(existingPrimary.error) ? await fallbackCodeRows(supabase) : (existingPrimary.data || []);
    if (existingPrimary.error && !isMissingCodesTable(existingPrimary.error)) throw existingPrimary.error;
    if (existingRows.length) return json(res, 409, { error: "Ja existe um codigo. Exclua-o antes de gerar outro." });
    const maxUses = 5;
    const expiresAt = null;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const code = `STORE${crypto.randomInt(1000, 10000)}`;
      const primary = await supabase.from("codigos_convite").insert({ codigo: code, max_usos: maxUses, criado_por: user.id, expira_em: expiresAt }).select("id,codigo,usos,max_usos,status,criado_em,expira_em").single();
      if (!primary.error) return json(res, 201, { code: publicCode(primary.data) });
      if (!isMissingCodesTable(primary.error) && primary.error.code !== "23505") throw primary.error;
      if (isMissingCodesTable(primary.error)) {
        try { return json(res, 201, { code: publicCode(await insertFallbackCode(supabase, user.id, code, maxUses, expiresAt)) }); }
        catch (fallbackError) { if (fallbackError.code !== "23505") throw fallbackError; }
      }
    }
    throw new Error("Nao foi possivel gerar um codigo unico.");
  } catch (error) { return json(res, error.statusCode || 500, { error: error.message }); }
}
async function deleteCode(req, res) {
  try {
    const { supabase, user } = await authenticated(req); const profile = await profileFor(supabase, user);
    if (!configuredAdmin(user, profile)) return json(res, 403, { error: "Apenas administradores podem excluir codigos." });
    const numericId = Number(req.params.id);
    if (Number.isFinite(numericId)) {
      const primary = await supabase.from("codigos_convite").delete().eq("id", numericId);
      if (!primary.error) return json(res, 200, { ok: true });
      if (!isMissingCodesTable(primary.error)) throw primary.error;
    }
    const { error } = await supabase.from("storefy_public_stores").delete().eq("slug", req.params.id);
    if (error) throw error;
    return json(res, 200, { ok: true });
  } catch (error) { return json(res, error.statusCode || 500, { error: error.message }); }
}async function expireCode(req, res) {
  try {
    const { supabase, user } = await authenticated(req); const profile = await profileFor(supabase, user);
    if (!configuredAdmin(user, profile)) return json(res, 403, { error: "Apenas administradores podem expirar codigos." });
    const primary = await supabase.from("codigos_convite").update({ status: "expirado" }).eq("id", Number(req.params.id));
    if (primary.error && !isMissingCodesTable(primary.error)) throw primary.error;
    if (primary.error) {
      const { data: row, error } = await supabase.from("storefy_public_stores").select("store_config").eq("slug", req.params.id).single();
      if (error) throw error;
      const { error: updateError } = await supabase.from("storefy_public_stores").update({ store_config: { ...row.store_config, status: "expirado" }, updated_at: new Date().toISOString() }).eq("slug", req.params.id);
      if (updateError) throw updateError;
    }
    return json(res, 200, { ok: true });
  } catch (error) { return json(res, error.statusCode || 500, { error: error.message }); }
}
async function redeemFallback(supabase, user, profile, code) {
  if (Number(profile.nivel) === 10 || configuredAdmin(user, profile)) return 10;
  const slug = `__storefy_invite__${code.toLowerCase()}`;
  const { data: row, error } = await supabase.from("storefy_public_stores").select("store_config").eq("slug", slug).maybeSingle();
  if (error || !row) throw new Error("Codigo invalido ou expirado");
  const config = row.store_config || {};
  if (config.status !== "ativo" || Number(config.usos || 0) >= Number(config.max_usos || 5) || (config.expira_em && new Date(config.expira_em) <= new Date())) throw new Error("Codigo invalido ou expirado");
  const uses = Number(config.usos || 0) + 1;
  const { error: codeError } = await supabase.from("storefy_public_stores").update({ store_config: { ...config, usos: uses, status: uses >= Number(config.max_usos || 5) ? "expirado" : "ativo" }, updated_at: new Date().toISOString() }).eq("slug", slug);
  if (codeError) throw codeError;
  const { error: profileError } = await supabase.from("storefy_profiles").update({ nivel: 10, codigo_socio: code, atualizado_em: new Date().toISOString() }).eq("user_id", user.id);
  if (profileError) throw profileError;
  return 10;
}
async function redeem(req, res) {
  try {
    const { supabase, user } = await authenticated(req); const profile = await profileFor(supabase, user);
    const code = String(req.body?.code || "").trim().toUpperCase();
    if (!code) return json(res, 400, { error: "Informe o codigo de socio." });
    const primary = await supabase.rpc("storefy_redeem_code", { p_user_id: user.id, p_codigo: code });
    if (!primary.error) { const row = Array.isArray(primary.data) ? primary.data[0] : primary.data; return json(res, 200, { ok: true, level: Number(row?.nivel || 10) }); }
    const level = await redeemFallback(supabase, user, profile, code);
    return json(res, 200, { ok: true, level });
  } catch (error) {
    const message = /codigo|convite|expirado/i.test(error?.message || "") ? "Codigo invalido ou expirado" : (error?.message || "Nao foi possivel validar o codigo.");
    return json(res, error.statusCode || 400, { error: message });
  }
}
module.exports = { createCode, deleteCode, expireCode, getProfile, listCodes, redeem };
