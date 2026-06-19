import React, { useEffect, useState } from 'react';
import { Check, ExternalLink, Globe, HelpCircle, Instagram, Save, Store, Trash2 } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { StoreConfig } from '../types';

interface SettingsViewProps {
  storeConfig: StoreConfig;
  onUpdateStoreConfig: (newConfig: StoreConfig) => void;
}

interface NetlifyStatus {
  connected: boolean;
  accountName: string;
  email: string;
  tokenLast4: string;
}

export default function SettingsView({ storeConfig, onUpdateStoreConfig }: SettingsViewProps) {
  const [name, setName] = useState(storeConfig.name);
  const [whatsapp, setWhatsapp] = useState(storeConfig.whatsapp);
  const [subdomain, setSubdomain] = useState(storeConfig.subdomain);
  const [welcomeMessage, setWelcomeMessage] = useState(storeConfig.welcomeMessage);
  const [primaryColor, setPrimaryColor] = useState(storeConfig.primaryColor);
  const [instagram, setInstagram] = useState(storeConfig.instagram || '');
  const [logoUrl, setLogoUrl] = useState(storeConfig.logoUrl || 'https://i.imgur.com/nUsczZV.png');
  const [downloadHtmlFallback, setDownloadHtmlFallback] = useState(storeConfig.downloadHtmlFallback ?? false);
  const [netlifyToken, setNetlifyToken] = useState('');
  const [netlifyStatus, setNetlifyStatus] = useState<NetlifyStatus>({ connected: false, accountName: '', email: '', tokenLast4: '' });
  const [netlifyFeedback, setNetlifyFeedback] = useState('');
  const [netlifyLoading, setNetlifyLoading] = useState(false);
  const [netlifyTesting, setNetlifyTesting] = useState(false);
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    storeConfig.faq || [
      { question: 'Como recebo meu produto apos o pagamento?', answer: 'A entrega e combinada pelo atendimento assim que confirmamos o pedido.' },
      { question: 'Os produtos possuem garantia?', answer: 'Sim, oferecemos suporte para ativacao e orientacao de uso.' }
    ]
  );
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const colorPresets = [
    { name: 'Roxo Violeta', hex: '#7c3aed' },
    { name: 'Azul Eletrico', hex: '#2563eb' },
    { name: 'Verde Gamer', hex: '#10b981' },
    { name: 'Vermelho Vibrante', hex: '#ef4444' },
    { name: 'Rosa Shock', hex: '#db2777' },
    { name: 'Ciano Cyber', hex: '#06b6d4' }
  ];

  const getAuthHeaders = async () => {
    if (!isSupabaseConfigured || !supabase) throw new Error('Entre com uma conta conectada ao Supabase para salvar a integracao.');
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) throw new Error('Sessao expirada. Entre novamente para configurar a Netlify.');
    return { Authorization: `Bearer ${accessToken}` };
  };

  const loadNetlifyStatus = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const headers = await getAuthHeaders();
      const response = await fetch('/api/integrations/netlify', { headers });
      const data = await response.json().catch(() => null);
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

  useEffect(() => {
    void loadNetlifyStatus();
  }, []);

  const handleTestNetlifyConnection = async () => {
    setNetlifyTesting(true);
    setNetlifyFeedback('');
    try {
      const response = await fetch('/api/integrations/netlify/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: netlifyToken })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'Token Netlify invalido.');
      setNetlifyFeedback(`Conexao validada: ${data.email || data.accountName || 'conta Netlify'} (final ${data.tokenLast4}).`);
    } catch (error) {
      setNetlifyFeedback(error instanceof Error ? error.message : 'Falha ao testar conexao.');
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
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'Nao foi possivel salvar a integracao Netlify.');
      setNetlifyStatus({ connected: true, accountName: data.accountName || '', email: data.email || '', tokenLast4: data.tokenLast4 || '' });
      setNetlifyToken('');
      setNetlifyFeedback('Integracao Netlify salva com seguranca.');
    } catch (error) {
      setNetlifyFeedback(error instanceof Error ? error.message : 'Falha ao salvar integracao.');
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
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) throw new Error(data?.error || 'Nao foi possivel remover a integracao Netlify.');
      setNetlifyStatus({ connected: false, accountName: '', email: '', tokenLast4: '' });
      setNetlifyToken('');
      setNetlifyFeedback('Netlify desconectada.');
    } catch (error) {
      setNetlifyFeedback(error instanceof Error ? error.message : 'Falha ao desconectar Netlify.');
    } finally {
      setNetlifyLoading(false);
    }
  };

  const handleUpdateConfig = (event: React.FormEvent) => {
    event.preventDefault();
    onUpdateStoreConfig({
      ...storeConfig,
      name,
      whatsapp,
      subdomain: subdomain.trim().toLowerCase().replace(/\s+/g, '-'),
      welcomeMessage,
      primaryColor,
      logoUrl,
      instagram,
      downloadHtmlFallback,
      faq: faqs
    });
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  const handleAddFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    setFaqs(prev => [...prev, { question: newQuestion, answer: newAnswer }]);
    setNewQuestion('');
    setNewAnswer('');
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div>
        <h1 className="text-3xl font-display font-medium tracking-tight text-white">Configuracoes Gerais</h1>
        <p className="mt-1 text-sm text-slate-400">Gerencie identidade, integracoes e publicacao da vitrine.</p>
      </div>

      <form onSubmit={handleUpdateConfig} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="glass-premium space-y-5 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 border-b border-white/5 pb-3 font-mono text-sm font-bold uppercase tracking-wider text-white">
              <Store className="h-4 w-4 text-slate-400" /> Perfil da Vitrine
            </h3>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">Nome comercial</span>
                <input value={name} onChange={(event) => setName(event.target.value)} className="glass-premium-input w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none" required />
              </label>
              <label className="space-y-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">Nome do link</span>
                <input value={subdomain} onChange={(event) => setSubdomain(event.target.value)} className="glass-premium-input w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 font-mono text-xs text-white focus:border-brand-500 focus:outline-none" required />
              </label>
              <label className="space-y-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">WhatsApp</span>
                <input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} className="glass-premium-input w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 font-mono text-xs text-white focus:border-brand-500 focus:outline-none" required />
              </label>
              <label className="space-y-1.5">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">Instagram</span>
                <div className="relative">
                  <Instagram className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                  <input value={instagram} onChange={(event) => setInstagram(event.target.value)} className="glass-premium-input w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 pl-9 pr-4 font-mono text-xs text-white focus:border-brand-500 focus:outline-none" />
                </div>
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">Logo da loja</span>
                <input type="url" value={logoUrl} onChange={(event) => setLogoUrl(event.target.value)} className="glass-premium-input w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 font-mono text-xs text-white focus:border-brand-500 focus:outline-none" />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">Mensagem padrao</span>
                <textarea rows={3} value={welcomeMessage} onChange={(event) => setWelcomeMessage(event.target.value)} className="glass-premium-input w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none" required />
              </label>
            </div>
            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <input type="checkbox" checked={downloadHtmlFallback} onChange={(event) => setDownloadHtmlFallback(event.target.checked)} className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black accent-brand-500" />
              <span>
                <span className="block text-xs font-bold uppercase tracking-wider text-white">Baixar HTML tambem ao publicar</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-slate-400">Com Netlify conectada, o botao Publicar envia direto para a Netlify. O HTML vira backup opcional.</span>
              </span>
            </label>
          </section>

          <section className="glass-premium space-y-5 rounded-2xl p-6">
            <div className="flex flex-col gap-3 border-b border-white/5 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-white">
                <Globe className="h-4 w-4 text-slate-400" /> Integracoes / Netlify
              </h3>
              <a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-500/25 bg-brand-500/10 px-3 py-2 text-xs font-black text-brand-200 transition hover:bg-brand-500/20">
                <ExternalLink className="h-3.5 w-3.5" /> Pegar token
              </a>
            </div>
            <div className={`rounded-2xl border p-4 ${netlifyStatus.connected ? 'border-emerald-400/20 bg-emerald-500/10' : 'border-white/10 bg-white/[0.025]'}`}>
              <p className="text-xs font-black uppercase tracking-wider text-white">{netlifyStatus.connected ? 'Conectado' : 'Desconectado'}</p>
              <p className="mt-1 text-xs text-slate-400">
                {netlifyStatus.connected
                  ? `${netlifyStatus.email || netlifyStatus.accountName || 'Conta Netlify'} - token final ${netlifyStatus.tokenLast4}`
                  : 'Cole um Personal Access Token para publicar sites HTML direto na Netlify.'}
              </p>
            </div>
            <label className="space-y-1.5">
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400">Personal Access Token</span>
              <input type="password" value={netlifyToken} onChange={(event) => setNetlifyToken(event.target.value)} placeholder="Cole o token da Netlify" className="glass-premium-input w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 font-mono text-xs text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none" autoComplete="off" />
            </label>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleTestNetlifyConnection} disabled={netlifyTesting || !netlifyToken.trim()} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-slate-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50">
                {netlifyTesting ? 'Testando...' : 'Testar conexao'}
              </button>
              <button type="button" onClick={handleSaveNetlifyIntegration} disabled={netlifyLoading || !netlifyToken.trim()} className="rounded-xl bg-brand-500 px-4 py-2 text-xs font-black text-black transition hover:bg-brand-200 disabled:cursor-not-allowed disabled:opacity-50">
                {netlifyLoading ? 'Salvando...' : 'Salvar integracao'}
              </button>
              {netlifyStatus.connected && (
                <button type="button" onClick={handleDisconnectNetlify} disabled={netlifyLoading} className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-xs font-black text-rose-300 disabled:opacity-50">
                  Desconectar
                </button>
              )}
            </div>
            {netlifyFeedback && <p className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-slate-300">{netlifyFeedback}</p>}
          </section>

          <section className="glass-premium space-y-5 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 border-b border-white/5 pb-3 font-mono text-sm font-bold uppercase tracking-wider text-white">
              <HelpCircle className="h-4 w-4 text-slate-400" /> Perguntas Frequentes
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={`${faq.question}-${index}`} className="flex items-start justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-200">P: {faq.question}</p>
                    <p className="text-slate-400">R: {faq.answer}</p>
                  </div>
                  <button type="button" onClick={() => setFaqs(prev => prev.filter((_, itemIndex) => itemIndex !== index))} className="shrink-0 rounded p-1 text-slate-400 transition hover:text-rose-400" title="Excluir FAQ">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 border-t border-white/5 pt-4 md:grid-cols-2">
              <input value={newQuestion} onChange={(event) => setNewQuestion(event.target.value)} placeholder="Nova pergunta" className="glass-premium-input rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none" />
              <input value={newAnswer} onChange={(event) => setNewAnswer(event.target.value)} placeholder="Resposta curta" className="glass-premium-input rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:border-brand-500 focus:outline-none" />
              <button type="button" onClick={handleAddFaq} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black text-white md:col-span-2">Adicionar FAQ</button>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="glass-premium space-y-4 rounded-2xl p-6">
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-white">Cor de destaque</h3>
            <div className="space-y-2">
              {colorPresets.map(color => (
                <button key={color.hex} type="button" onClick={() => setPrimaryColor(color.hex)} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-2 text-xs text-slate-300 transition hover:bg-white/[0.05]">
                  <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: color.hex }} />{color.name}</span>
                  {primaryColor === color.hex && <Check className="h-3.5 w-3.5 text-brand-500" />}
                </button>
              ))}
            </div>
          </section>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-500 px-5 py-3 text-sm font-black text-black shadow-lg shadow-brand-500/20 transition hover:bg-brand-200">
            <Save className="h-4 w-4" /> Salvar configuracoes
          </button>
          {showSavedFeedback && <p className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-center text-xs font-bold text-emerald-300">Configuracoes salvas.</p>}
        </aside>
      </form>
    </div>
  );
}
