const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");

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
  const configured = String(process.env.STOREFY_ADMIN_EMAILS || "").split(",").map(v => v.trim().toLowerCase()).filter(Boolean);
  return Boolean(profile?.is_admin || configured.includes(String(user.email || "").toLowerCase()));
}
async function profileFor(supabase, user) {
  const { data, error } = await supabase.from("storefy_profiles").select("user_id,nome,nivel,codigo_socio,is_admin").eq("user_id", user.id).maybeSingle();
  if (error) throw error;
  if (data) return data;
  const { data: created, error: createError } = await supabase.from("storefy_profiles").upsert({
    user_id: user.id, nome: user.user_metadata?.display_name || user.email?.split("@")[0] || "Usuario", nivel: 1
  }).select("user_id,nome,nivel,codigo_socio,is_admin").single();
  if (createError) throw createError;
  return created;
}
function publicProfile(user, profile) {
  return { userId: user.id, email: user.email || "", name: profile.nome || user.user_metadata?.display_name || "", level: Number(profile.nivel || 1), partnerCode: profile.codigo_socio || null, isAdmin: configuredAdmin(user, profile) };
}
function publicCode(row) {
  return { id: Number(row.id), code: row.codigo, uses: Number(row.usos || 0), maxUses: Number(row.max_usos || 5), status: row.status, createdAt: row.criado_em, expiresAt: row.expira_em, remaining: Math.max(0, Number(row.max_usos || 5) - Number(row.usos || 0)) };
}
async function register(req, res) {
  let createdUserId = "";
  try {
    const name = String(req.body?.name || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const partnerCode = String(req.body?.partnerCode || "").trim().toUpperCase();
    if (name.length < 2 || !email.includes("@") || password.length < 6) return json(res, 400, { error: "Informe nome, e-mail valido e senha com pelo menos 6 caracteres." });
    const supabase = adminClient();
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { display_name: name } });
    if (error || !data.user) throw error || new Error("Nao foi possivel criar a conta.");
    createdUserId = data.user.id;
    const { data: profile, error: profileError } = await supabase.rpc("storefy_register_profile", { p_user_id: createdUserId, p_nome: name, p_codigo: partnerCode || null });
    if (profileError) throw profileError;
    const level = Number(Array.isArray(profile) ? profile[0]?.nivel : profile?.nivel) || (partnerCode ? 10 : 1);
    return json(res, 201, { ok: true, level });
  } catch (error) {
    if (createdUserId) { try { await adminClient().auth.admin.deleteUser(createdUserId); } catch {} }
    const message = /codigo|convite|expirado/i.test(error?.message || "") ? "C�digo inv�lido ou expirado" : (error?.message || "Nao foi possivel criar a conta.");
    return json(res, 400, { error: message });
  }
}
async function getProfile(req, res) {
  try { const { supabase, user } = await authenticated(req); return json(res, 200, publicProfile(user, await profileFor(supabase, user))); }
  catch (error) { return json(res, error.statusCode || 500, { error: error.message }); }
}
async function listCodes(req, res) {
  try {
    const { supabase, user } = await authenticated(req); const profile = await profileFor(supabase, user); const isAdmin = configuredAdmin(user, profile);
    if (!isAdmin && Number(profile.nivel) !== 10) return json(res, 403, { error: "Area disponivel apenas para socios Nivel 10." });
    let query = supabase.from("codigos_convite").select("id,codigo,usos,max_usos,status,criado_em,expira_em").order("criado_em", { ascending: false });
    if (!isAdmin) query = query.eq("codigo", profile.codigo_socio || "");
    const { data, error } = await query; if (error) throw error;
    const codes = (data || []).map(publicCode);
    return json(res, 200, { codes, totalUsed: codes.reduce((total, code) => total + code.uses, 0), canManage: isAdmin });
  } catch (error) { return json(res, error.statusCode || 500, { error: error.message }); }
}
async function createCode(req, res) {
  try {
    const { supabase, user } = await authenticated(req); const profile = await profileFor(supabase, user);
    if (!configuredAdmin(user, profile)) return json(res, 403, { error: "Apenas administradores podem gerar codigos." });
    const maxUses = Math.min(100, Math.max(1, Number(req.body?.maxUses || 5)));
    const expiresAt = req.body?.expiresAt ? new Date(req.body.expiresAt).toISOString() : null;
    let inserted;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const code = `STORE${crypto.randomInt(1000, 10000)}`;
      const { data, error } = await supabase.from("codigos_convite").insert({ codigo: code, max_usos: maxUses, criado_por: user.id, expira_em: expiresAt }).select("id,codigo,usos,max_usos,status,criado_em,expira_em").single();
      if (!error) { inserted = data; break; }
      if (error.code !== "23505") throw error;
    }
    if (!inserted) throw new Error("Nao foi possivel gerar um codigo unico.");
    return json(res, 201, { code: publicCode(inserted) });
  } catch (error) { return json(res, error.statusCode || 500, { error: error.message }); }
}
async function expireCode(req, res) {
  try {
    const { supabase, user } = await authenticated(req); const profile = await profileFor(supabase, user);
    if (!configuredAdmin(user, profile)) return json(res, 403, { error: "Apenas administradores podem expirar codigos." });
    const { error } = await supabase.from("codigos_convite").update({ status: "expirado" }).eq("id", Number(req.params.id));
    if (error) throw error; return json(res, 200, { ok: true });
  } catch (error) { return json(res, error.statusCode || 500, { error: error.message }); }
}
async function redeem(req, res) {
  try {
    const { supabase, user } = await authenticated(req);
    const code = String(req.body?.code || '').trim().toUpperCase();
    if (!code) return json(res, 400, { error: 'Informe o codigo de socio.' });
    const { data, error } = await supabase.rpc('storefy_redeem_code', { p_user_id: user.id, p_codigo: code });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return json(res, 200, { ok: true, level: Number(row?.nivel || 10) });
  } catch (error) {
    const message = /codigo|convite|expirado/i.test(error?.message || '') ? 'Código inválido ou expirado' : (error?.message || 'Nao foi possivel validar o codigo.');
    return json(res, error.statusCode || 400, { error: message });
  }
}
module.exports = { createCode, expireCode, getProfile, listCodes, redeem, register };
