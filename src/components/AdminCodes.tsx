import React, { useEffect, useState } from 'react';
import { Check, Copy, Crown, Flame, Plus, ShieldCheck, Sparkles, Trash2, Users, XCircle } from 'lucide-react';
import { deleteInviteCode, deleteRootAdminCode, expireInviteCode, generateInviteCode, generateRootAdminCode, loadInviteCodes, loadRootAdminCode } from '../lib/access';
import { InviteCode, UserAccessProfile } from '../types';

interface Props { profile: UserAccessProfile; onToast: (message: string) => void; }

export default function AdminCodes({ profile, onToast }: Props) {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [totalUsed, setTotalUsed] = useState(0);
  const [canManage, setCanManage] = useState(profile.isAdmin);
  const [adminCode, setAdminCode] = useState<InviteCode | null>(null);
  const isRootAdmin = profile.email.toLowerCase() === 'admin-storefy@example.com';
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

  const generateAdmin = async () => {
    setWorking(true); setError('');
    try { const result = await generateRootAdminCode(); setAdminCode(result.code); onToast(`Codigo administrativo ${result.code.code} gerado.`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Nao foi possivel gerar o codigo administrativo.'); }
    finally { setWorking(false); }
  };
  const removeAdmin = async () => {
    if (!adminCode || !window.confirm(`Excluir o codigo administrativo ${adminCode.code}?`)) return;
    await deleteRootAdminCode(adminCode.id); setAdminCode(null); onToast('Codigo administrativo excluido.');
  };  const copy = async (code: string) => { await navigator.clipboard.writeText(code); onToast('Codigo copiado.'); };
  const generate = async () => {
    setWorking(true); setError('');
    try { const result = await generateInviteCode(5); setCodes(current => [result.code, ...current]); onToast(`Codigo ${result.code.code} gerado.`); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Nao foi possivel gerar o codigo.'); }
    finally { setWorking(false); }
  };
  const remove = async (code: InviteCode) => {
    if (!window.confirm(`Excluir definitivamente o codigo ${code.code}?`)) return;
    await deleteInviteCode(code.id);
    setCodes(current => current.filter(item => item.id !== code.id));
    onToast('Codigo excluido. Agora voce pode gerar um novo.');
  };  const expire = async (code: InviteCode) => {
    if (!window.confirm(`Expirar o codigo ${code.code}?`)) return;
    await expireInviteCode(code.id); setCodes(current => current.map(item => item.id === code.id ? { ...item, status: 'expirado' } : item)); onToast('Codigo expirado.');
  };

  return <div className="mx-auto max-w-7xl space-y-6">
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><p className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">{canManage ? 'Painel administrativo' : 'Area de socio'}</p><h1 className="mt-1 text-3xl font-black text-gray-950">{canManage ? 'Codigos de convite' : 'Seus convites'}</h1><p className="mt-2 text-sm text-gray-600">{canManage ? 'Gere, acompanhe e encerre acessos de socios.' : 'Compartilhe o codigo que liberou seu Nivel 10.'}</p></div>
      <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"><Users className="text-emerald-600" size={22} /><div><p className="text-xs font-bold text-gray-500">Convites usados</p><p className="text-xl font-black text-gray-950">{totalUsed}</p></div></div>
    </header>

    {isRootAdmin && <section className="border-2 border-red-300 bg-red-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xs font-black uppercase tracking-[0.16em] text-red-700">Somente administrador principal</p><h2 className="mt-1 text-lg font-black text-gray-950">Criar outro administrador</h2><p className="mt-1 text-xs text-gray-600">Codigo de uso unico. A conta existente informa este codigo no login e vira administradora.</p></div>
        {!adminCode && <button type="button" disabled={working} onClick={() => void generateAdmin()} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-red-700 px-5 text-xs font-black text-white hover:bg-red-800 disabled:opacity-60"><Plus size={17} /> GERAR CODIGO ADMIN</button>}
      </div>
      {adminCode && <div className="mt-4 flex flex-col gap-3 border-t border-red-200 pt-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-xl font-black text-gray-950">{adminCode.code}</p><p className="text-xs font-bold text-red-700">Uso unico: 0 / 1 administrador</p></div><div className="flex gap-2"><button type="button" onClick={() => void copy(adminCode.code)} className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-black text-gray-800"><Copy size={16} /> Copiar</button><button type="button" onClick={() => void removeAdmin()} title="Excluir codigo administrativo" className="grid h-10 w-10 place-items-center rounded-lg border border-red-300 bg-white text-red-700"><Trash2 size={17} /></button></div></div>}
    </section>}
    {canManage && <section className="flex flex-col gap-4 border-y border-gray-200 bg-white py-5 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-sm font-black text-gray-950">Convite exclusivo</p><p className="mt-1 text-xs text-gray-500">Apenas um codigo por vez, limitado a 5 pessoas.</p></div>
      <button type="button" disabled={working || codes.length > 0} onClick={() => void generate()} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-950 px-5 text-sm font-black text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"><Plus size={18} /> {working ? 'GERANDO...' : codes.length > 0 ? 'CODIGO UNICO JA GERADO' : 'GERAR CODIGO PARA 5 PESSOAS'}</button>
    </section>}

    {error && <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
    <section className="overflow-hidden border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4"><h2 className="font-black text-gray-950">{canManage ? 'Codigos gerados' : 'Codigo compartilhavel'}</h2></div>
      {loading ? <p className="p-6 text-sm text-gray-500">Carregando...</p> : codes.length === 0 ? <p className="p-6 text-sm text-gray-500">Nenhum codigo disponivel.</p> : <div className="divide-y divide-gray-100">{codes.map(code => <article key={code.id} className="grid gap-4 p-5 md:grid-cols-[1.2fr_.7fr_.8fr_1fr_auto] md:items-center">
        <div><p className="font-mono text-lg font-black text-gray-950">{code.code}</p><p className="text-xs text-gray-500">Criado em {new Date(code.createdAt).toLocaleDateString('pt-BR')}</p></div>
        <div><p className="text-xs text-gray-500">Usos</p><p className="font-black text-gray-950">{code.uses} / {code.maxUses}</p></div><div><p className="text-xs text-gray-500">Disponiveis</p><p className="font-black text-emerald-700">{code.remaining}</p></div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase ${code.status === 'ativo' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{code.status}</span>
        <div className="flex gap-2"><button type="button" onClick={() => void copy(code.code)} title="Copiar codigo" className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"><Copy size={17} /></button>{canManage && code.status === 'ativo' && <button type="button" onClick={() => void expire(code)} title="Expirar codigo" className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"><XCircle size={17} /></button>}{canManage && <button type="button" onClick={() => void remove(code)} title="Excluir codigo" className="grid h-10 w-10 place-items-center rounded-lg border border-red-200 text-red-600 hover:bg-red-50"><Trash2 size={17} /></button>}</div>
      </article>)}</div>}
    </section>

    {canManage && <><section className="grid gap-4 md:grid-cols-2">
      <div className="border border-gray-200 bg-white p-6"><div className="flex items-center gap-3"><Users className="text-gray-500" /><h2 className="text-xl font-black">NIVEL 1 (NORMAL)</h2></div><ul className="mt-5 space-y-3 text-sm text-gray-600">{['Vitrine Basica', 'Produtos Limitados', 'Fornecedores Comuns', 'Ayla Essencial: orientacoes e proximos passos', 'Suporte Padrao'].map(item => <li key={item} className="flex gap-2"><Check size={17} className="mt-0.5 shrink-0" />{item}</li>)}</ul></div>
      <div className="border-2 border-amber-400 bg-gray-950 p-6 text-white"><div className="flex items-center gap-3"><Flame className="text-amber-400" /><h2 className="text-xl font-black">NIVEL 10 (SOCIO)</h2></div><p className="mt-4 border-l-2 border-amber-400 pl-3 text-sm font-bold text-amber-300">Ayla com acesso completo a sua operacao.</p><ul className="mt-5 space-y-3 text-sm text-gray-200">{['Vitrine PRO', 'Catalogo Completo', 'Fornecedores PREMIUM', 'Badge SOCIO NIVEL 10', 'Ayla completa: cria, analisa e executa com confirmacao', 'Suporte VIP'].map(item => <li key={item} className="flex gap-2"><Crown size={17} className="mt-0.5 shrink-0 text-amber-400" />{item}</li>)}</ul></div>
    </section>

    <section className="overflow-hidden border border-amber-200 bg-white">
      <div className="grid md:grid-cols-[1.05fr_1.45fr]">
        <div className="bg-amber-50 px-6 py-7">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg border border-amber-300 bg-white text-amber-700"><Sparkles size={20} /></span><p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Ayla no Nivel 10</p></div>
          <h2 className="mt-5 max-w-md text-2xl font-black leading-tight text-gray-950">Sua operacao inteira em uma unica conversa.</h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-gray-600">No Nivel 10, a Ayla trabalha com o contexto completo da sua Storefy. Ela entende a loja atual, o catalogo e suas margens para orientar e preparar cada acao com voce.</p>
        </div>
        <div className="grid gap-px bg-gray-200 sm:grid-cols-3">
          <div className="bg-white p-6"><p className="text-sm font-black text-gray-950">Entende sua loja</p><p className="mt-2 text-sm leading-6 text-gray-600">Considera historico, publico, produtos e preferencias sem misturar operacoes.</p></div>
          <div className="bg-white p-6"><p className="text-sm font-black text-gray-950">Cria com voce</p><p className="mt-2 text-sm leading-6 text-gray-600">Ajuda a montar vitrine, ajustar margens e produzir Reels, influencer IA e divulgacao.</p></div>
          <div className="bg-white p-6"><p className="text-sm font-black text-gray-950">Executa com controle</p><p className="mt-2 text-sm leading-6 text-gray-600">Transforma decisoes em acoes e pede sua confirmacao antes de alterar a operacao.</p></div>
        </div>
      </div>
    </section>

    <section className="bg-amber-50 px-6 py-7"><div className="flex items-center gap-3"><ShieldCheck className="text-amber-700" /><h2 className="text-xl font-black text-gray-950">Por que o Nivel 10 vende mais?</h2></div><div className="mt-5 grid gap-4 text-sm text-gray-700 md:grid-cols-3"><p><b>Fornecedor mais barato</b><br />Margem maior, lucro maior.</p><p><b>Badge de confianca</b><br />O cliente confia e compra mais.</p><p><b>Ayla com acesso completo</b><br />Analisa a operacao e indica a proxima melhor acao.</p></div></section></>}
  </div>;
}
