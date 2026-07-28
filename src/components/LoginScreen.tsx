import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Lock, Mail, Sparkles, Store } from 'lucide-react';
import { redeemPartnerCode } from '../lib/access';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface LoginScreenProps { onLocalAccess: () => void; }
function LoginField({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">{label}</span><div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 focus-within:border-brand-500/60">{icon}{children}</div></label>;
}

export default function LoginScreen({ onLocalAccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [partnerCode, setPartnerCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    if (!isSupabaseConfigured || !supabase) { setError('Configure o Supabase para ativar o acesso real.'); return; }
    if (!email || !password) { setError('Preencha os campos obrigatorios.'); return; }
    setIsLoading(true);
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (partnerCode.trim()) {
        try {
          await redeemPartnerCode(partnerCode);
          window.location.reload();
          return;
        } catch (cause) { await supabase.auth.signOut(); throw cause; }
      }
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Nao foi possivel concluir o acesso.';
      setError(/invalid login credentials/i.test(message) ? 'E-mail ou senha invalidos. O codigo administrativo nao substitui a senha da conta.' : message);
    }
    finally { setIsLoading(false); }
  };

  const Field = ({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) => <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-gray-500">{label}</span><div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 focus-within:border-brand-500/60">{icon}{children}</div></label>;
  const inputClass = 'w-full bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder:text-gray-500';
  const highlights = ['Escolha um nicho e receba uma operacao estruturada', 'Produtos de fornecedores prontos para a vitrine', 'Perfil, videos, copies e calendario de postagem'];

  return <div className="min-h-screen overflow-hidden bg-[#050608] text-white">
    <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(212,175,55,0.16),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(20,184,166,0.12),transparent_30%),linear-gradient(135deg,#030305,#0a0a0d_55%,#050505)]" />
    <main className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex flex-col justify-between px-6 py-7 sm:px-10 lg:px-14"><img src="/storefy-logo.png" alt="Storefy" className="h-14 w-auto max-w-[190px] object-contain" /><div className="max-w-2xl py-12"><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-brand-200"><Sparkles size={15} /> Acesso operacional</div><h1 className="font-sans text-5xl font-black leading-[0.92] text-white sm:text-6xl xl:text-7xl">Entre para criar sua operacao de nicho.</h1><p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">Fornecedores, produtos, videos, vitrine e WhatsApp em uma operacao pronta para vender.</p><div className="mt-9 grid gap-3">{highlights.map(item => <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-300"><span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-400/10 text-emerald-300"><CheckCircle2 size={16} /></span>{item}</div>)}</div></div></section>
      <section className="flex items-center justify-center px-4 py-8 sm:px-8"><div className="w-full max-w-md rounded-[28px] border border-gray-200 bg-gray-50 p-5 shadow-2xl shadow-black/40 sm:p-7"><div className="mb-6"><p className="text-xs font-black uppercase tracking-[0.28em] text-brand-500">Login</p><h2 className="mt-1 text-2xl font-black text-gray-900">Acesse sua conta</h2></div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <LoginField label="E-mail" icon={<Mail size={18} className="text-slate-500" />}><input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="voce@empresa.com" autoComplete="email" /></LoginField>
          <LoginField label="Senha" icon={<Lock size={18} className="text-slate-500" />}><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className={inputClass} placeholder="Minimo de 6 caracteres" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword(v => !v)} className="text-slate-500" aria-label="Mostrar senha">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></LoginField>
          {<LoginField label="Codigo de Socio (opcional)" icon={<KeyRound size={18} className="text-amber-600" />}><input value={partnerCode} onChange={e => setPartnerCode(e.target.value.toUpperCase())} className={inputClass} placeholder="STORE4545" autoComplete="off" /></LoginField>}
          {error && <p className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-4 text-sm font-black text-black hover:bg-brand-200 disabled:opacity-60">{isLoading ? 'Aguarde...' : 'Entrar'}<ArrowRight size={18} /></button>
        </form>
        {!isSupabaseConfigured && <button type="button" onClick={onLocalAccess} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-xs font-black text-gray-700"><Store size={15} /> Entrar em modo local</button>}
      </div></section>
    </main>
  </div>;
}
