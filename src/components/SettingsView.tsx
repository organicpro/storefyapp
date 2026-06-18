import React, { useState } from 'react';
import { 
  Settings, 
  Store, 
  MessageSquare, 
  Sliders, 
  HelpCircle, 
  Palette, 
  Globe, 
  FileText, 
  Check, 
  Trash2, 
  Plus, 
  Save,
  Instagram,
  ExternalLink
} from 'lucide-react';
import { StoreConfig } from '../types';

interface SettingsViewProps {
  storeConfig: StoreConfig;
  onUpdateStoreConfig: (newConfig: StoreConfig) => void;
}

export default function SettingsView({ storeConfig, onUpdateStoreConfig }: SettingsViewProps) {
  // Config form states
  const [name, setName] = useState(storeConfig.name);
  const [whatsapp, setWhatsapp] = useState(storeConfig.whatsapp);
  const [subdomain, setSubdomain] = useState(storeConfig.subdomain);
  const [welcomeMessage, setWelcomeMessage] = useState(storeConfig.welcomeMessage);
  const [primaryColor, setPrimaryColor] = useState(storeConfig.primaryColor);
  const [instagram, setInstagram] = useState(storeConfig.instagram || '');
  const [logoUrl, setLogoUrl] = useState(storeConfig.logoUrl || 'https://i.imgur.com/nUsczZV.png');
  const [netlifyApiToken, setNetlifyApiToken] = useState(storeConfig.netlifyApiToken || '');
  const [netlifySiteId, setNetlifySiteId] = useState(storeConfig.netlifySiteId || '');
  const [downloadHtmlFallback, setDownloadHtmlFallback] = useState(storeConfig.downloadHtmlFallback ?? false);
  
  // Custom expandable FAQs list
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>(
    storeConfig.faq || [
      { question: 'Como recebo meu produto após o pagamento?', answer: 'A entrega é feita instantaneamente pelo nosso atendimento no WhatsApp assim que confirmamos o PIX!' },
      { question: 'Os produtos possuem garantia?', answer: 'Sim, oferecemos suporte completo para ativação e reembolso se houver problemas.' }
    ]
  );

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // Colors preset options
  const colorPresets = [
    { name: 'Roxo Violeta', hex: '#7c3aed' },
    { name: 'Azul Elétrico', hex: '#2563eb' },
    { name: 'Verde Gamer', hex: '#10b981' },
    { name: 'Vermelho Vibrante', hex: '#ef4444' },
    { name: 'Rosa Shock', hex: '#db2777' },
    { name: 'Ciano Cyber', hex: '#06b6d4' }
  ];

  const handleUpdateConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStoreConfig({
      ...storeConfig,
      name,
      whatsapp,
      subdomain: subdomain.trim().toLowerCase().replace(/\s+/g, '-'),
      welcomeMessage,
      primaryColor,
      logoUrl,
      instagram,
      netlifyApiToken,
      netlifySiteId,
      downloadHtmlFallback,
      faq: faqs
    });
    
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  const handleAddFaq = () => {
    if (newQuestion.trim() === '' || newAnswer.trim() === '') return;
    setFaqs([...faqs, { question: newQuestion, answer: newAnswer }]);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleRemoveFaq = (idx: number) => {
    setFaqs(faqs.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-medium text-white tracking-tight">Configurações Gerais</h1>
        <p className="text-slate-400 text-sm mt-1">
          Gerencie o subdomínio público, informações de contato, chaves do gateway e design estético da sua vitrine e-commerce.
        </p>
      </div>

      <form onSubmit={handleUpdateConfig} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core details editable panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Store Profile Information */}
          <div className="p-6 glass-premium rounded-2xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Store className="w-4.5 h-4.5 text-slate-400" /> Perfil da Vitrine
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Nome comercial da loja</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 glass-premium-input"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Dominio / Subdominio</label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="w-full pl-4 pr-32 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 font-mono glass-premium-input"
                    required
                  />
                  <span className="absolute right-3 text-xs text-slate-400 font-bold select-none font-mono">
                    .html
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">WhatsApp de contato comercial</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500 font-mono glass-premium-input"
                  required
                />
                <span className="text-[10px] text-slate-500 block font-mono">Código DDI + DDD + Telefone. Ex: 5511999998888</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Instagram comercial (opcional)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-500">
                    <Instagram className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="digitalexpress.shop"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 font-mono glass-premium-input"
                  />
                </div>
              </div>              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Logo da loja</label>
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://exemplo.com/logo.png"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 font-mono glass-premium-input"
                />
              </div>


              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Mensagem padrão de abertura de carrinho</label>
                <textarea
                  rows={3}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500 glass-premium-input"
                  required
                />
              </div>
            </div>
            <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-left">
              <input
                type="checkbox"
                checked={downloadHtmlFallback}
                onChange={(event) => setDownloadHtmlFallback(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black accent-brand-500"
              />
              <span>
                <span className="block text-xs font-bold uppercase tracking-wider text-white">Baixar HTML se a publicação falhar</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-slate-400">
                  Com token ativo, o padrão é publicar direto e mostrar o link netlify.app. Ative isto só se quiser receber o HTML como plano B.
                </span>
              </span>
            </label>
          </div>

          <div className="p-6 glass-premium rounded-2xl space-y-5">
            <div className="flex flex-col gap-3 border-b border-white/5 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Globe className="w-4.5 h-4.5 text-slate-400" /> Publicacao Netlify
              </h3>
              <a
                href="https://app.netlify.com/user/applications#personal-access-tokens"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-500/25 bg-brand-500/10 px-3 py-2 text-xs font-black text-brand-200 transition hover:bg-brand-500/20"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Pegar token
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Netlify API Token</label>
                <input
                  type="password"
                  value={netlifyApiToken}
                  onChange={(e) => setNetlifyApiToken(e.target.value)}
                  placeholder="Cole o token da Netlify"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 font-mono glass-premium-input"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 font-mono uppercase tracking-widest">Netlify Site ID</label>
                <input
                  type="text"
                  value={netlifySiteId}
                  onChange={(e) => setNetlifySiteId(e.target.value)}
                  placeholder="ID do site ou deixe em branco"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20 font-mono glass-premium-input"
                />
              </div>
            </div>
          </div>

          {/* Section: Manage Store FAQs */}
          <div className="p-6 glass-premium rounded-2xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-white/5 pb-3">
              <HelpCircle className="w-4.5 h-4.5 text-slate-400" /> Perguntas Frequentes (FAQs) da Vitrine
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Adicione ou remova perguntas frequentes que aparecem de forma elegante no rodapé da página para sanar objeções rápidas sobre formas de pagamento e retiradas.
            </p>

            {/* FAQs List */}
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 gap-4 text-xs font-sans">
                  <div className="space-y-1 text-left">
                    <p className="font-bold text-slate-200">P: {faq.question}</p>
                    <p className="text-slate-400">R: {faq.answer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFaq(idx)}
                    className="text-slate-400 hover:text-rose-400 p-1 rounded transition-colors self-center shrink-0 cursor-pointer"
                    title="Excluir FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add FAQ form inline */}
            <div className="pt-4 border-t border-white/5 space-y-3 text-xs">
              <p className="font-bold text-slate-300 uppercase font-mono tracking-wider text-[10px]">Criar nova pergunta e resposta</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Ex. Qual o prazo de resgate do PIN?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-brand-500 glass-premium-input"
                />
                <input
                  type="text"
                  placeholder="Ex. Em média de 5 a 10 minutos após o PIX."
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-brand-500 glass-premium-input"
                />
              </div>

              <button
                type="button"
                onClick={handleAddFaq}
                className="py-1.5 px-3 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-brand-500 font-bold text-xs inline-flex items-center gap-1.5 transition-all border border-white/5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar ao FAQ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right palette Preset Choices panel */}
        <div className="space-y-6">
          {/* Visual Aesthetics & colors choices */}
          <div className="p-6 glass-premium rounded-2xl space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-white/5 pb-3">
              <Palette className="w-4.5 h-4.5 text-slate-400" /> Cor de Destaque
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Selecione o esquema de cores que condiz perfeitamente com a identidade visual dos jogos e produtos digitais adicionados.
            </p>

            <div className="grid grid-cols-2 gap-2">
              {colorPresets.map((preset) => {
                const isSelected = primaryColor === preset.hex;
                return (
                  <button
                    type="button"
                    key={preset.hex}
                    onClick={() => setPrimaryColor(preset.hex)}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-2 group transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? 'border-white bg-white/10 font-bold' 
                        : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                    }`}
                  >
                    <span 
                      className="w-6 h-6 rounded-full block border-2 border-white shadow-md transition-transform duration-300 group-hover:scale-105" 
                      style={{ backgroundColor: preset.hex }} 
                    />
                    <span className="text-[10px] text-slate-300 block truncate w-full">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick info status summary */}
          <div className="p-6 glass-premium border border-brand-500/30 text-white rounded-2xl space-y-4 shadow-md relative overflow-hidden select-none">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/[0.02] rounded-bl-full" />
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/20 font-mono uppercase tracking-wider">
              Status Geral
            </span>

            <div className="space-y-2 text-xs text-left">
              <p className="flex justify-between border-b border-white/[0.08] pb-2">
                <span className="text-brand-300">Vitrine:</span>
                <span className="font-bold">No Ar (On-line)</span>
              </p>
              <p className="flex justify-between border-b border-white/[0.08] pb-2">
                <span className="text-brand-300">Domínio Ativo:</span>
                <span className="font-bold font-mono">{subdomain}.storefy</span>
              </p>
              <p className="flex justify-between">
                <span className="text-brand-300">Contato ZAP:</span>
                <span className="font-bold font-mono">{whatsapp}</span>
              </p>
            </div>
          </div>

          {/* Action bottom button */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full py-3 bg-white hover:bg-slate-200 text-black rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-4 h-4 text-black" />
              <span>Salvar Todas Configurações</span>
            </button>

            {showSavedFeedback && (
              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-xs font-semibold rounded-xl text-center animate-pulse flex items-center justify-center gap-1.5 text-emerald-400">
                <Check className="w-4.5 h-4.5 stroke-[3px]" />
                Configurações da vitrine salvas com sucesso!
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

