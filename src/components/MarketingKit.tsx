import React, { useState } from 'react';
import { 
  Instagram, 
  MessageSquare, 
  Copy, 
  Share2, 
  TrendingUp, 
  Cpu, 
  CheckCircle2, 
  Megaphone,
  Smartphone,
  Facebook,
  QrCode,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { StoreConfig } from '../types';

interface MarketingKitProps {
  storeConfig: StoreConfig;
}

export default function MarketingKit({ storeConfig }: MarketingKitProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => prev === message ? null : prev);
    }, 3500);
  };

  const fullDomain = `https://${storeConfig.subdomain}.storefy.app`;

  const kits = [
    {
      title: 'Biografia do Instagram e TikTok',
      icon: Instagram,
      description: 'Ideal para colocar na secao "Link na Bio" das suas redes sociais de vendas.',
      text: `Chaves digitais, gift cards, assinaturas e achados com ofertas selecionadas. Confira a vitrine oficial:\n${fullDomain}`,
      copiedId: 1
    },
    {
      title: 'Mensagem de Grupo WhatsApp (Oferta do Dia)',
      icon: MessageSquare,
      description: 'Perfeito para compartilhar em grupos locais de ofertas, games e servicos.',
      text: `Atencao, pessoal! Montei um catalogo com produtos selecionados, recargas, assinaturas e ofertas especiais.\n\nConfira a vitrine e escolha seu produto:\n${fullDomain}`,
      copiedId: 2
    },
    {
      title: 'Script de Vendas Direct',
      icon: Share2,
      description: 'Responda clientes no Instagram ou WhatsApp que perguntaram sobre precos ou disponibilidade.',
      text: `Ola! Fico feliz pelo contato. Aqui esta a vitrine com os produtos atualizados, valores e ofertas disponiveis: ${fullDomain}`,
      copiedId: 3
    }
  ];

  const handleCopyText = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-medium text-white tracking-tight">Kit de Divulgação</h1>
        <p className="text-slate-400 text-sm mt-1">
          Acelere seu faturamento copiando nossos modelos premium de copy, bio social e templates estruturados para conversão.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left main copies listings */}
        <div className="lg:col-span-2 space-y-6">
          {kits.map((kit) => {
            const IconComp = kit.icon;
            const isCopied = copiedIndex === kit.copiedId;
            return (
              <div key={kit.copiedId} className="p-6 rounded-2xl glass-premium space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/5 text-slate-300 shrink-0">
                      <IconComp className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{kit.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{kit.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyText(kit.text, kit.copiedId)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                      isCopied 
                        ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
                        : 'bg-white text-black hover:bg-slate-200'
                    }`}
                  >
                    {isCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopied ? 'Copiado!' : 'Copiar Copy'}</span>
                  </button>
                </div>

                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-slate-300 font-mono whitespace-pre-wrap select-all leading-relaxed">
                  {kit.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right guide cards - Traffic and QR Code generator */}
        <div className="space-y-6">
          {/* QR Code generator mock */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0b0b0f] via-[#121217] to-[#181824] border border-white/15 text-white text-center space-y-5 relative overflow-hidden shadow-lg select-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-bl-full" />
            <span className="text-[9px] font-bold tracking-widest font-mono text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20 uppercase inline-block">
              QR Code do E-commerce
            </span>

            <div className="p-4 bg-white rounded-3xl w-40 h-40 mx-auto flex items-center justify-center shadow-lg relative group">
              <QrCode className="w-32 h-32 text-slate-800 transition-transform duration-300 group-hover:scale-105" />
              {/* Abs hover click to action */}
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-3xl opacity-0 hover:opacity-100 transition-all flex items-center justify-center p-3 text-[10px] font-bold text-white leading-tight cursor-pointer">
                Baixar QR Code de Impressão (Adesivo/Cartão)
              </div>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-white">Imprima e espalhe fisicamente</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Ótima tática para colar em faculdades, padarias e pontos de encontros gamers de amigos. O código leva direto ao link do subdomain: {storeConfig.subdomain}.storefy.app
              </p>
            </div>
            
            <button
              onClick={() => showToast('Download do QR Code de alta resolução iniciado! Verifique sua pasta de downloads em instantes.')}
              className="mt-2 w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/10 transition-all cursor-pointer"
            >
              Baixar PNG High-Res
            </button>
          </div>

          {/* Social Bio Strategies */}
          <div className="p-6 rounded-2xl glass-premium space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 uppercase font-mono tracking-wider">
              <Megaphone className="w-4 h-4 text-brand-500" /> Estratégias de Conversão
            </h3>
            
            <div className="space-y-3 font-sans text-xs text-slate-300">
              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono font-bold text-[10px] text-slate-300 shrink-0">1</div>
                <p><strong>Grupos de Jogos:</strong> Participe de grupos de Free Fire, Valorant e Discord locais e use a copy sugerida no lado esquerdo.</p>
              </div>

              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono font-bold text-[10px] text-slate-300 shrink-0">2</div>
                <p><strong>Trafego Organico:</strong> Crie pequenos videos (Reels, TikTok, Shorts) mostrando as recargas sendo feitas e coloque o link na bio.</p>
              </div>

              <div className="flex gap-2">
                <div className="h-5 w-5 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono font-bold text-[10px] text-slate-300 shrink-0">3</div>
                <p><strong>Meta Ads / Pixel:</strong> Se for investir em anúncios pagos, configure o pixel do Facebook na guia Configurações para rastrear os cliques de compras no WhatsApp!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Elegant Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#0a0a0f]/95 backdrop-blur-md border border-white/10 shadow-2xl flex items-center gap-3 animate-fade-in max-w-xs md:max-w-sm">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-normal font-sans">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
