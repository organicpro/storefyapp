import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Check,
  ChevronRight,
  ExternalLink,
  Globe,
  Lock,
  Save,
  Shield,
  UserRound,
  Camera,
  Users
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { StoreConfig } from '../types';

interface SettingsViewProps {
  storeConfig: StoreConfig;
  accountName: string;
  onUpdateStoreConfig: (newConfig: StoreConfig) => void;
  onUpdateAccountName: (name: string) => void | Promise<void>;
  userLevel?: number;
  isAdmin?: boolean;
  onNavigate?: (page: string) => void;
}

interface NetlifyStatus {
  connected: boolean;
  accountName: string;
  email: string;
  tokenLast4: string;
}

export default function SettingsView({ storeConfig, accountName, onUpdateStoreConfig, onUpdateAccountName, userLevel = 1, isAdmin = false, onNavigate }: SettingsViewProps) {
  const [accountDisplayName, setAccountDisplayName] = useState(accountName);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>('');
  const [netlifyToken, setNetlifyToken] = useState('');
  const [netlifyStatus, setNetlifyStatus] = useState<NetlifyStatus>({ connected: false, accountName: '', email: '', tokenLast4: '' });
  const [netlifyFeedback, setNetlifyFeedback] = useState('');
  const [netlifyLoading, setNetlifyLoading] = useState(false);
  const [netlifyTesting, setNetlifyTesting] = useState(false);
  const [downloadHtmlFallback, setDownloadHtmlFallback] = useState(storeConfig.downloadHtmlFallback ?? false);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAuthHeaders = async () => {
    if (!isSupabaseConfigured || !supabase) throw new Error('Entre com uma conta conectada ao Supabase para salvar a integração.');
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error('Sessão expirada. Entre novamente para configurar a Netlify.');
    return { Authorization: `Bearer ${accessToken}` };
  };

  const parseNetlifyJson = async (response: Response) => {
    const data = await response.json().catch(() => null);
    if (!data) throw new Error('A API Netlify da Storefy não respondeu JSON. Faça redeploy do app e confira se as rotas /api estão ativas.');
    return data;
  };

  const loadNetlifyStatus = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/integrations/netlify', { headers });
      const data = await parseNetlifyJson(response);
      if (response.ok && data?.ok) {
        setNetlifyStatus({
          connected: Boolean(data.connected),
          accountName: data.accountName || '',
          email: data.email || '',
          tokenLast4: data.tokenLast4 || ''
        });
      }
    } catch {
      setNetlifyStatus({ connected: false, accountName: '', email: '', tokenLast4: '' });
    }
  };

  useEffect(() => { void loadNetlifyStatus(); }, []);
  useEffect(() => { setAccountDisplayName(accountName); }, [accountName]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') setProfilePhotoUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleTestNetlifyConnection = async () => {
    setNetlifyTesting(true);
    setNetlifyFeedback('');
    try {
      const response = await fetch('/api/integrations/netlify/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: netlifyToken })
      });
      const data = await parseNetlifyJson(response);
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'Token Netlify inválido.');
      setNetlifyFeedback(`Conexão validada: ${data.email || data.accountName || 'conta Netlify'} (final ${data.tokenLast4}).`);
    } catch (error) {
      setNetlifyFeedback(error instanceof Error ? error.message : 'Falha ao testar conexão.');
    } finally {
      setNetlifyTesting(false);
    }
  };

  const handleSaveNetlifyIntegration = async () => {
    setNetlifyLoading(true);
    setNetlifyFeedback('');
    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch('/api/integrations/netlify/save', {
        method: 'POST',
        headers: { ...authHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: netlifyToken })
      });
      const data = await parseNetlifyJson(response);
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'Não foi possível salvar a integração Netlify.');
      setNetlifyStatus({ connected: true, accountName: data.accountName || '', email: data.email || '', tokenLast4: data.tokenLast4 || '' });
      setNetlifyToken('');
      setNetlifyFeedback('Integração Netlify salva com segurança.');
    } catch (error) {
      setNetlifyFeedback(error instanceof Error ? error.message : 'Falha ao salvar integração.');
    } finally {
      setNetlifyLoading(false);
    }
  };

  const handleDisconnectNetlify = async () => {
    setNetlifyLoading(true);
    setNetlifyFeedback('');
    try {
      const authHeaders = await getAuthHeaders();
      const response = await fetch('/api/integrations/netlify', { method: 'DELETE', headers: authHeaders });
      const data = await parseNetlifyJson(response);
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'Não foi possível remover a integração Netlify.');
      setNetlifyStatus({ connected: false, accountName: '', email: '', tokenLast4: '' });
      setNetlifyToken('');
      setNetlifyFeedback('Netlify desconectada.');
    } catch (error) {
      setNetlifyFeedback(error instanceof Error ? error.message : 'Falha ao desconectar Netlify.');
    } finally {
      setNetlifyLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = accountDisplayName.trim().replace(/\s+/g, ' ');
    if (normalized !== accountName.trim()) {
      await onUpdateAccountName(normalized);
    }
    // Also persist downloadHtmlFallback
    onUpdateStoreConfig({ ...storeConfig, downloadHtmlFallback });
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  const initials = accountDisplayName
    ? accountDisplayName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : 'US';

  return (
    <div className="max-w-[820px] mx-auto py-8 font-sans animate-fade-in text-left space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Configurações</h1>
        <p className="text-[14px] text-gray-500 mt-1 leading-relaxed">
          Gerencie seu perfil pessoal e as integrações da plataforma.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-5">

        {/* â”€â”€â”€ Profile card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="rounded-[24px] border border-gray-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0f172a] flex items-center justify-center">
              <UserRound className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-[15px] font-bold text-gray-900">Perfil da conta</h2>
          </div>

          <div className="p-6">
            {/* Avatar + name side by side */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Avatar upload */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-gray-100 select-none">
                  {profilePhotoUrl
                    ? <img src={profilePhotoUrl} alt="Foto de perfil" className="w-full h-full object-cover" />
                    : <span>{initials}</span>
                  }
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0f172a] border-2 border-white flex items-center justify-center hover:bg-[#1e293b] transition-colors"
                  title="Alterar foto"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Name field */}
              <div className="flex-1 w-full">
                <label className="block text-[13px] font-bold text-gray-900 mb-1.5">
                  Nome de exibição
                </label>
                <input
                  value={accountDisplayName}
                  onChange={(e) => setAccountDisplayName(e.target.value)}
                  placeholder="Ex. Albert Einstein"
                  className="w-full max-w-sm rounded-[12px] border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-[13px] text-gray-900 outline-none focus:border-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all"
                />
                <p className="mt-1.5 text-[12px] text-gray-400">
                  Aparece no cabeçalho e na saudação da dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* â”€â”€â”€ Publish preferences â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <section className="rounded-[24px] border border-gray-200 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0f172a] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-[15px] font-bold text-gray-900">Preferências de publicação</h2>
          </div>
          <div className="p-6">
            <label className="flex items-start gap-3.5 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={downloadHtmlFallback}
                  onChange={(e) => setDownloadHtmlFallback(e.target.checked)}
                  className="peer h-4 w-4 appearance-none rounded border border-gray-300 bg-white checked:border-[#0f172a] checked:bg-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0f172a]/20 transition-all cursor-pointer"
                />
                <Check className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" strokeWidth={3} />
              </div>
              <div>
                <span className="block text-[13px] font-bold text-gray-900 group-hover:text-[#0f172a] transition-colors">
                  Baixar HTML também ao publicar
                </span>
                <span className="mt-0.5 block text-[12px] leading-relaxed text-gray-500">
                  Com a Netlify conectada, o botão "Publicar" envia direto para a web. Ative esta opção para também baixar o HTML como backup local.
                </span>
              </div>
            </label>
          </div>
        </section>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-[14px] bg-[#0f172a] hover:bg-[#1e293b] px-6 py-2.5 text-[13px] font-bold text-white shadow-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Salvar perfil
          </button>
          {showSavedFeedback && (
            <div className="animate-fade-in flex items-center gap-2 rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-emerald-800">
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="text-[13px] font-bold">Salvo com sucesso!</span>
            </div>
          )}
        </div>
      </form>

      {/* â”€â”€â”€ Netlify integration (standalone, not in form) â”€â”€â”€ */}
      <section className="rounded-[24px] border border-gray-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0f172a] flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-[15px] font-bold text-gray-900">Integração Netlify</h2>
          </div>
          <a
            href="https://app.netlify.com/user/applications#personal-access-tokens"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[10px] border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3.5 py-1.5 text-[12px] font-semibold text-gray-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Obter token Netlify
          </a>
        </div>

        <div className="p-6 space-y-5">
          {/* Status indicator */}
          <div className={`rounded-[14px] border p-4 flex items-start gap-3 ${netlifyStatus.connected ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${netlifyStatus.connected ? 'bg-emerald-500' : 'bg-gray-400'}`} />
            <div>
              <p className={`text-[13px] font-bold ${netlifyStatus.connected ? 'text-emerald-800' : 'text-gray-700'}`}>
                {netlifyStatus.connected ? 'Conectado' : 'Não conectado'}
              </p>
              <p className="text-[12.5px] text-gray-500 mt-0.5">
                {netlifyStatus.connected
                  ? `${netlifyStatus.email || netlifyStatus.accountName || 'Conta conectada'} · token final: ···${netlifyStatus.tokenLast4}`
                  : 'Cole um Personal Access Token abaixo para publicar sua loja direto na internet.'}
              </p>
            </div>
          </div>

          {/* Token input */}
          <div>
            <label className="block text-[13px] font-bold text-gray-900 mb-1.5">
              Personal Access Token
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="password"
                value={netlifyToken}
                onChange={(e) => setNetlifyToken(e.target.value)}
                placeholder="Cole seu token aqui"
                autoComplete="off"
                className="w-full rounded-[12px] border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 font-sans text-[12.5px] text-gray-900 outline-none focus:border-gray-400 focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleTestNetlifyConnection}
              disabled={netlifyTesting || !netlifyToken.trim()}
              className="rounded-[12px] border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 text-[12.5px] font-semibold text-gray-700 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {netlifyTesting ? 'Testando...' : 'Testar conexão'}
            </button>
            <button
              type="button"
              onClick={handleSaveNetlifyIntegration}
              disabled={netlifyLoading || !netlifyToken.trim()}
              className="rounded-[12px] bg-[#0f172a] hover:bg-[#1e293b] px-4 py-2 text-[12.5px] font-semibold text-white shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {netlifyLoading ? 'Salvando...' : 'Salvar integração'}
            </button>
            {netlifyStatus.connected && (
              <button
                type="button"
                onClick={handleDisconnectNetlify}
                disabled={netlifyLoading}
                className="rounded-[12px] border border-rose-200 bg-white hover:bg-rose-50 px-4 py-2 text-[12.5px] font-semibold text-rose-600 shadow-sm transition-colors disabled:opacity-40 ml-auto"
              >
                Desconectar
              </button>
            )}
          </div>

          {/* Feedback message */}
          {netlifyFeedback && (
            <div className={`rounded-[12px] p-3 text-[12.5px] font-medium border ${netlifyFeedback.toLowerCase().includes('inválido') || netlifyFeedback.toLowerCase().includes('falha') ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
              {netlifyFeedback}
            </div>
          )}
        </div>
      </section>

      {(isAdmin || userLevel === 10) && (
        <section className="rounded-[16px] border border-amber-200 bg-amber-50 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-400 text-black"><Users size={19} /></div>
            <div><p className="text-[13px] font-black text-gray-950">Convites de socio</p><p className="mt-1 text-[12px] text-gray-600">Copie seu codigo, acompanhe usos e gerencie acessos Nivel 10.</p></div>
          </div>
          <button type="button" onClick={() => onNavigate?.(isAdmin ? 'admin-codes' : 'invites')} className="rounded-lg bg-gray-950 px-4 py-2.5 text-xs font-black text-white">Abrir convites</button>
        </section>
      )}
      {/* â”€â”€â”€ Info banner: store-level settings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="rounded-[20px] border border-gray-200 bg-gray-50 p-5 flex gap-4 items-start">
        <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4 text-gray-600" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-bold text-gray-900">Configurações específicas de cada loja</p>
          <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">
            Nome comercial, cor de destaque, WhatsApp, Instagram, logo, perguntas frequentes e outras opções individuais de cada loja estão disponíveis no menu <strong className="text-gray-700">Loja Virtual â†’ Editar loja</strong>.
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
      </div>

    </div>
  );
}

