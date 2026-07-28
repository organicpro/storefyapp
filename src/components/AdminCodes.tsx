import React, { useEffect, useState } from 'react';
import { Check, Copy, Crown, Flame, Plus, ShieldCheck, Users, XCircle } from 'lucide-react';
import { expireInviteCode, generateInviteCode, loadInviteCodes } from '../lib/access';
import { InviteCode, UserAccessProfile } from '../types';

interface Props { profile: UserAccessProfile; onToast: (message: string) => void; }

export default function AdminCodes({ profile, onToast }: Props) {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [totalUsed, setTotalUsed] = useState(0);
  const [canManage, setCanManage] = useState(profile.isAdmin);
  const [maxUses, setMaxUses] = useState(5);
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');

  const refresh = async () => {
    setLoading(true); setError('');
    try { const data = await loadInviteCodes(); setCodes(data.codes); setTotalUsed(data.totalUsed); setCanManage(data.canManage); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Nao foi possivel carregar os codigos.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void refresh(); }, []);

  const copy = async (code: string) => { await navigator.clipboard.writeText(code); onToast('Codigo copiado.'); };
  const generate = async () => {
    setWorking(true); setError('');
    try { const result = await generateInviteCode(maxUses, expiresAt || undefined); setCodes(current => [result.code, ...current]); onToast(`Codigo ${result.code.code} gerado.`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Nao foi possivel gerar o codigo.'); }
    finally { setWorking(false); }
  };
  const expire = async (code: InviteCode) => {
    if (!window.confirm(`Expirar o codigo ${code.code}?`)) return;
    await expireInviteCode(code.id); setCodes(current => current.map(item => item.id === code.id ? { ...item, status: 'expirado' } : item)); onToast('Codigo expirado.');
  };

  return <div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">{canManage ? 'Painel administrativo' : 'Area de socio'}</p><h1 className="mt-1 text-3xl font-black text-gray-950">{canManage ? 'Codigos de convite' : 'Seus convites'}</h1><p className="mt-2 text-sm text-gray-600">{canManage ? 'Gere, acompanhe e encerre acessos de socios.' : 'Compartilhe o codigo que liberou seu Nivel 10.'}</p></div>
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"><Users className="text-emerald-600" size={22} /><div><p className="text-xs font-bold text-gray-500">Convites usados</p><p className="text-xl font-black text-gray-950">{totalUsed}</p></div></div>
    </header>

    {canManage && <section className="grid gap-3 border-y border-gray-200 bg-white py-5 sm:grid-cols-[140px_220px_1fr] sm:items-end">
      <label className="text-xs font-bold text-gray-600">Maximo de usos<input type="number" min={1} max={100} value={maxUses} onChange={event => setMaxUses(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-amber-500" /></label>
      <label className="text-xs font-bold text-gray-600">Expira em (opcional)<input type="datetime-local" value={expiresAt} onChange={event => setExpiresAt(event.target.value)} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-amber-500" /></label>
      <button type="button" disabled={working} onClick={() => void generate()} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 text-sm font-black text-white hover:bg-black disabled:opacity-60"><Plus size={18} /> {working ? 'GERANDO...' : 'GERAR NOVO CODIGO'}</button>
    </section>}

    {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
    <section className="overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-black text-gray-950">{canManage ? 'Codigos gerados' : 'Codigo compartilhavel'}</h2></div>
      {loading ? <p className="p-6 text-sm text-gray-500">Carregando...</p> : codes.length === 0 ? <p className="p-6 text-sm text-gray-500">Nenhum codigo disponivel.</p> : <div className="divide-y divide-gray-100">{codes.map(code => <article key={code.id} className="grid gap-4 p-5 md:grid-cols-[1.2fr_.7fr_.8fr_1fr_auto] md:items-center">
        <div><p className="font-mono text-lg font-black text-gray-950">{code.code}</p><p className="text-xs text-gray-500">Criado em {new Date(code.createdAt).toLocaleDateString('pt-BR')}</p></div>
        <div><p className="text-xs text-gray-500">Usos</p><p className="font-black text-gray-950">{code.uses} / {code.maxUses}</p></div><div><p className="text-xs text-gray-500">Disponiveis</p><p className="font-black text-emerald-700">{code.remaining}</p></div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase ${code.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{code.status}</span>
        <div className="flex gap-2"><button type="button" onClick={() => void copy(code.code)} title="Copiar codigo" className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"><Copy size={17} /></button>{canManage && code.status === 'ativo' && <button type="button" onClick={() => void expire(code)} title="Expirar codigo" className="grid h-10 w-10 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"><XCircle size={17} /></button>}</div>
      </article>)}</div>}
    </section>

    {canManage && <><section className="grid gap-4 md:grid-cols-2">
      <div className="border border-gray-200 bg-white p-6"><div className="flex items-center gap-3"><Users className="text-gray-500" /><h2 className="text-xl font-black">NIVEL 1 (NORMAL)</h2></div><ul className="mt-5 space-y-3 text-sm text-gray-600">{['Vitrine Basica', 'Produtos Limitados', 'Fornecedores Comuns', 'Sem Badge', 'Suporte Padrao'].map(item => <li key={item} className="flex gap-2"><Check size={17} />{item}</li>)}</ul></div>
      <div className="border-2 border-amber-400 bg-gray-950 p-6 text-white"><div className="flex items-center gap-3"><Flame className="text-amber-400" /><h2 className="text-xl font-black">NIVEL 10 (SOCIO)</h2></div><ul className="mt-5 space-y-3 text-sm text-gray-200">{['Vitrine PRO', 'Catalogo Completo', 'Fornecedores PREMIUM', 'Badge SOCIO NIVEL 10', 'Suporte VIP'].map(item => <li key={item} className="flex gap-2"><Crown size={17} className="text-amber-400" />{item}</li>)}</ul></div>
    </section><section className="bg-amber-50 px-6 py-7"><div className="flex items-center gap-3"><ShieldCheck className="text-amber-700" /><h2 className="text-xl font-black text-gray-950">Por que o Nivel 10 vende mais?</h2></div><div className="mt-5 grid gap-4 text-sm text-gray-700 md:grid-cols-3"><p><b>Fornecedor mais barato</b><br />Margem maior, lucro maior.</p><p><b>Badge de confianca</b><br />O cliente confia e compra mais.</p><p><b>Suporte VIP</b><br />Problemas resolvidos mais rapido.</p></div></section></>}
  </div>;
}
