import React, { useState } from 'react';
import {
  Instagram,
  Copy,
  Share2,
  CheckCircle2,
  Facebook,
  QrCode,
  Sparkles,
  TrendingUp,
  Eye,
  MousePointerClick,
  ChevronDown,
  ExternalLink,
  X
} from 'lucide-react';
import { StoreConfig } from '../types';

interface MarketingKitProps {
  storeConfig: StoreConfig;
}

export default function MarketingKit({ storeConfig }: MarketingKitProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [expandedKit, setExpandedKit] = useState<number | null>(1);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => prev === message ? null : prev);
    }, 3500);
  };

  const fullDomain = storeConfig.publishedUrl?.startsWith('http')
    ? storeConfig.publishedUrl
    : null;

  const kits = [
    {
      title: 'Biografia do Instagram e TikTok',
      icon: Instagram,
      platform: 'Redes Sociais',
      description: 'Texto para a seção "Link na Bio" das suas redes sociais.',
      text: `Chaves digitais, gift cards, assinaturas e achados com ofertas selecionadas. Confira a vitrine oficial:\n${fullDomain || '[publique sua loja para gerar o link]'}`,
      copiedId: 1
    },
    {
      title: 'Anúncio para grupos do Facebook',
      icon: Facebook,
      platform: 'Facebook',
      description: 'Publique em grupos de ofertas, comunidades locais e nichos.',
      text: `Atenção, pessoal! Montei um catálogo com produtos selecionados, recargas, assinaturas e ofertas especiais.\n\nConfira a vitrine e escolha seu produto:\n${fullDomain || '[publique sua loja para gerar o link]'}`,
      copiedId: 2
    },
    {
      title: 'Script de vendas por mensagem',
      icon: Share2,
      platform: 'WhatsApp / DM',
      description: 'Responda clientes que perguntaram sobre preços ou disponibilidade.',
      text: `Olá! Fico feliz pelo contato. Aqui está a vitrine com os produtos atualizados, valores e ofertas disponíveis: ${fullDomain || '[publique sua loja para gerar o link]'}`,
      copiedId: 3
    }
  ];

  const strategies = [
    {
      icon: Eye,
      title: 'Grupos de jogos e Discord',
      desc: 'Participe de grupos de Free Fire, Valorant e Discord locais e publique os textos prontos acima.',
      cta: 'Ver exemplos',
    },
    {
      icon: TrendingUp,
      title: 'Tráfego orgânico com vídeos',
      desc: 'Crie vídeos curtos (Reels, TikTok, Shorts) mostrando recargas sendo feitas e coloque o link na bio.',
      cta: 'Saiba mais',
    },
    {
      icon: MousePointerClick,
      title: 'Meta Ads e Pixel de rastreio',
      desc: 'Configure o Pixel do Facebook nas Configurações para rastrear cliques e conversões na sua loja.',
      cta: 'Configurar',
    },
  ];

  const handleCopyText = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    showToast('Texto copiado para a área de transferência!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const domainShort = storeConfig.publishedUrl
    ? storeConfig.publishedUrl.replace(/^https?:\/\//, '')
    : null;

  return (
    <div className="max-w-[1000px] mx-auto py-8 font-sans animate-fade-in">

      {/* â”€â”€ Header â”€â”€ */}
      <div className="mb-6">
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Divulgação</h1>
        <p className="text-[14px] text-gray-500 mt-1 leading-relaxed max-w-xl">
          Textos prontos para copiar e divulgar sua loja nas redes sociais, grupos e mensagens diretas.
        </p>
      </div>

      {/* â”€â”€ Hero compact card with store preview â”€â”€ */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-5">
        {/* Mini store preview thumbnail */}
        <div className="w-full sm:w-[200px] h-[110px] rounded-lg overflow-hidden shrink-0 relative" style={{ background: `linear-gradient(135deg, #d4af37 0%, #b8901c 100%)` }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-black/20" />
          <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
            <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest mb-1">Sua loja</p>
            <h3 className="text-white text-[16px] font-bold leading-tight">{storeConfig.name}</h3>
            {domainShort && (
              <p className="text-white/70 text-[10px] mt-1 truncate max-w-full">{domainShort}</p>
            )}
          </div>
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${storeConfig.publishedUrl ? 'bg-emerald-400' : 'bg-gray-300'}`} />
            <span className="text-[13px] font-semibold text-gray-900">
              {storeConfig.publishedUrl ? 'Loja publicada' : 'Loja não publicada'}
            </span>
          </div>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            {storeConfig.publishedUrl
              ? 'Copie os textos abaixo e compartilhe o link da sua vitrine nos seus canais de venda.'
              : 'Publique sua loja primeiro para ativar o link nos textos de divulgação.'}
          </p>
          {storeConfig.publishedUrl && (
            <a href={storeConfig.publishedUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2.5 text-[12px] font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              Abrir loja
            </a>
          )}
        </div>
        {/* Stats mini */}
        <div className="flex sm:flex-col gap-4 sm:gap-3 shrink-0 sm:border-l sm:border-gray-100 sm:pl-5">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Textos</p>
            <p className="text-[20px] font-bold text-gray-900 leading-tight">{kits.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Canais</p>
            <p className="text-[20px] font-bold text-gray-900 leading-tight">3</p>
          </div>
        </div>
      </div>

      {/* â”€â”€ Copy Kits (Polaris resource list) â”€â”€ */}
      <div className="mb-6">
        <h2 className="text-[15px] font-bold text-gray-900 mb-3">Textos para copiar</h2>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
          {kits.map((kit) => {
            const IconComp = kit.icon;
            const isCopied = copiedIndex === kit.copiedId;
            const isExpanded = expandedKit === kit.copiedId;
            return (
              <div key={kit.copiedId} className="transition-colors">
                <div
                  className="flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-gray-50/70 transition-colors"
                  onClick={() => setExpandedKit(isExpanded ? null : kit.copiedId)}
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200/80 flex items-center justify-center shrink-0 text-gray-500">
                    <IconComp className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[13px] font-semibold text-gray-900 leading-tight">{kit.title}</h3>
                    <p className="text-[12px] text-gray-500 mt-0.5 leading-snug">{kit.description}</p>
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase bg-gray-50 border border-gray-200/80 px-2 py-0.5 rounded-md shrink-0 hidden sm:inline">
                    {kit.platform}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyText(kit.text, kit.copiedId);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-all border shrink-0 ${
                      isCopied
                        ? 'bg-[#0f172a] border-[#0f172a] text-white'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm'
                    }`}
                  >
                    {isCopied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {isCopied ? 'Copiado!' : 'Copiar'}
                  </button>
                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>

                {/* Expanded text preview */}
                <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-5 pb-4 pt-0">
                    <div className="p-3.5 bg-gray-50 border border-gray-100 rounded-lg text-[12.5px] text-gray-700 whitespace-pre-wrap select-all leading-relaxed font-sans">
                      {kit.text}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* â”€â”€ Bottom: QR Code + Estratégias (symmetric layout) â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* QR Code card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-gray-900">QR Code da loja</h2>
          </div>
          <div className="p-5 flex items-start gap-5">
            <div className="p-3 bg-gray-50 rounded-xl w-[120px] h-[120px] flex items-center justify-center border border-gray-100 relative group shrink-0 cursor-pointer"
              onClick={() => showToast('Download do QR Code iniciado!')}
            >
              <QrCode className="w-[90px] h-[90px] text-gray-800 transition-transform duration-300 ease-out group-hover:scale-105" strokeWidth={1.5} />
              <div className="absolute inset-0 bg-[#0f172a]/75 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="text-[11px] font-semibold text-white">Baixar</span>
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <p className="text-[13px] text-gray-600 leading-relaxed">
                Imprima em adesivos, cartões de visita ou panfletos. O código direciona o cliente para a sua loja publicada.
              </p>
              <button
                onClick={() => showToast('Download do QR Code de alta resolução iniciado!')}
                className="w-full py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg text-[12px] font-semibold transition-colors shadow-sm"
              >
                Baixar PNG
              </button>
            </div>
          </div>
        </div>

        {/* Estratégias card (symmetric with QR) */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-gray-900">Estratégias de conversão</h2>
          </div>
          <div className="p-5 space-y-3">
            {strategies.map((s, i) => {
              const SIcon = s.icon;
              return (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-50/60 hover:shadow-sm transition-all duration-150 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 border border-gray-200/80 flex items-center justify-center shrink-0 text-gray-500 group-hover:border-gray-300 group-hover:text-gray-700 transition-all">
                    <SIcon className="w-4 h-4" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-gray-900 leading-tight">{s.title}</p>
                    <p className="text-[12px] text-gray-500 leading-relaxed mt-0.5">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* â”€â”€ Toast â”€â”€ */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] flex w-max max-w-sm items-center gap-3 rounded-xl border border-gray-800 bg-[#0f172a] px-4 py-3 text-[13px] font-medium text-white shadow-2xl animate-fade-in">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20">
            <Sparkles className="w-4 h-4 animate-pulse text-[#d4af37]" />
          </div>
          <p className="leading-tight flex-1 mr-2">{toastMessage}</p>
          <button type="button" onClick={() => setToastMessage(null)} aria-label="Fechar" className="text-gray-400 hover:text-white transition-colors">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

