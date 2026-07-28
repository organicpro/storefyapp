import { InviteCode, UserAccessProfile } from '../types';
import { supabase } from './supabase';

async function authHeaders() {
  const { data } = await supabase!.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Sessao expirada. Entre novamente.');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

async function readResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Nao foi possivel concluir a operacao.');
  return data as T;
}

export async function registerAccount(input: { name: string; email: string; password: string; partnerCode?: string }) {
  return readResponse<{ ok: boolean; level: number }>(await fetch('/api/auth/register', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input)
  }));
}

export async function loadAccessProfile() {
  return readResponse<UserAccessProfile>(await fetch('/api/access/profile', { headers: await authHeaders() }));
}

export async function loadInviteCodes() {
  return readResponse<{ codes: InviteCode[]; totalUsed: number; canManage: boolean }>(
    await fetch('/api/admin/codes', { headers: await authHeaders() })
  );
}

export async function generateInviteCode(maxUses = 5, expiresAt?: string) {
  return readResponse<{ code: InviteCode }>(await fetch('/api/admin/codes', {
    method: 'POST', headers: await authHeaders(), body: JSON.stringify({ maxUses, expiresAt })
  }));
}

export async function expireInviteCode(id: number | string) {
  return readResponse<{ ok: boolean }>(await fetch(`/api/admin/codes/${id}/expire`, {
    method: 'PATCH', headers: await authHeaders()
  }));
}

export async function redeemPartnerCode(code: string) {
  return readResponse<{ ok: boolean; level: number }>(await fetch('/api/access/redeem', {
    method: 'POST', headers: await authHeaders(), body: JSON.stringify({ code })
  }));
}
export async function deleteInviteCode(id: number | string) {
  return readResponse<{ ok: boolean }>(await fetch(`/api/admin/codes/${encodeURIComponent(id)}`, {
    method: 'DELETE', headers: await authHeaders()
  }));
}
export async function loadRootAdminCode() {
  return readResponse<{ code: InviteCode | null }>(await fetch('/api/root/admin-code', { headers: await authHeaders() }));
}

export async function generateRootAdminCode() {
  return readResponse<{ code: InviteCode }>(await fetch('/api/root/admin-code', { method: 'POST', headers: await authHeaders() }));
}

export async function deleteRootAdminCode(id: number | string) {
  return readResponse<{ ok: boolean }>(await fetch(`/api/root/admin-code/${encodeURIComponent(id)}`, { method: 'DELETE', headers: await authHeaders() }));
}