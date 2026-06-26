import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  Store
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface LoginScreenProps {
  onLocalAccess: () => void;
}

export default function LoginScreen({ onLocalAccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!isSupabaseConfigured || !supabase) {
      setError('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY para ativar o login com Supabase.');
      return;
    }

    if (!email || !password) {
      setError('Informe e-mail e senha para continuar.');
      return;
    }

    setIsLoading(true);

    const result = await supabase.auth.signInWithPassword({ email, password });

    setIsLoading(false);

    if (result.error) {
      setError(result.error.message);
    }
  };

  const highlights = [
    'Escolha um nicho e receba uma operação estruturada',
    'Produtos de fornecedores prontos para a vitrine',
    'Perfil, vídeos, copies e calendário de postagem'
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#030305] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(212,175,55,0.16),transparent_28%),radial-gradient(circle_at_82%_12%,rgba(20,184,166,0.12),transparent_30%),linear-gradient(135deg,#030305,#0a0a0d_55%,#050505)]" />
      <main className="relative z-10 grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between px-6 py-7 sm:px-10 lg:px-14">
          <div className="flex items-center">
            <img src="/storefy-logo.png" alt="" className="h-14 w-auto max-w-[190px] object-contain" />
          </div>

          <div className="max-w-2xl py-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-brand-200">
              <Sparkles size={15} />
              Acesso operacional
            </div>
            <h1 className="font-display text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl xl:text-7xl">
              Entre para criar sua operação de nicho.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              A Storefy conecta fornecedores, produtos, perfil social, vídeos, vitrine e WhatsApp para você começar a divulgar um nicho com velocidade.
            </p>

            <div className="mt-9 grid gap-3">
              {highlights.map(item => (
                <div key={item} className="flex items-center gap-3 text-sm font-semibold text-slate-200">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">
                    <CheckCircle2 size={16} />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

        </section>

        <section className="flex items-center justify-center px-4 py-8 sm:px-8">
          <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-white/[0.055] p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-500">
                  Login
                </p>
                <h2 className="mt-1 font-display text-2xl font-black text-white">
                  Acesse sua conta
                </h2>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/30 text-brand-500">
                <Lock size={20} />
              </div>
            </div>

            {!isSupabaseConfigured && (
              <div className="mb-5 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">
                Supabase ainda nao foi configurado neste ambiente. Preencha o `.env` com as chaves do seu projeto para ativar o login real.
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">E-mail</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-brand-500/60">
                  <Mail size={18} className="text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-600"
                    placeholder="voce@empresa.com"
                    autoComplete="email"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-slate-400">Senha</span>
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 focus-within:border-brand-500/60">
                  <Lock size={18} className="text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:text-slate-600"
                    placeholder="Sua senha"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="text-slate-500 transition hover:text-white"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </label>

              {error && <p className="rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 px-5 py-4 text-sm font-black text-black transition hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? 'Conectando...' : 'Entrar'}
                <ArrowRight size={18} />
              </button>
            </form>

            <div className="mt-5 flex flex-col gap-3 text-center text-sm text-slate-400">
              {!isSupabaseConfigured && (
                <button
                  type="button"
                  onClick={onLocalAccess}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-300 transition hover:bg-white/10"
                >
                  <Store size={15} />
                  Entrar em modo local
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
