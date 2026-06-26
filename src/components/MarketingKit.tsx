import React, { useState } from 'react';
import { CheckCircle2, Copy, Facebook, Sparkles } from 'lucide-react';
import { Product, StoreConfig } from '../types';

interface MarketingKitProps {
  storeConfig: StoreConfig;
  products: Product[];
}

export default function MarketingKit({ storeConfig, products }: MarketingKitProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((prev) => prev === message ? null : prev);
    }, 3000);
  };

  const fullDomain = storeConfig.publishedUrl?.startsWith('http')
    ? storeConfig.publishedUrl
    : 'Publique a loja para gerar o link ao vivo';

  const selectedProducts = products.filter(product => product.addedToStore);
  const selectedProductsText = selectedProducts
    .map(product => `${product.name} ${product.subcategory}`.toLowerCase())
    .join(' ');
  const productNames = selectedProducts.slice(0, 4).map(product => product.name).join(', ');
  const productLine = productNames
    ? `\nTem: ${productNames}${selectedProducts.length > 4 ? ' e mais ofertas' : ''}.`
    : '';

  const getFacebookSearchTerm = () => {
    const nicheName = (storeConfig.niche || '').toLowerCase();

    if (nicheName.includes('gamer') || selectedProductsText.includes('free fire') || selectedProductsText.includes('roblox')) {
      if (selectedProductsText.includes('roblox')) return 'pais roblox contas robux ofertas jogos infantis';
      if (selectedProductsText.includes('free fire')) return 'free fire diamantes guildas jogadores ofertas';
      if (selectedProductsText.includes('steam')) return 'pc gamer steam promocoes jogos baratos';
      return 'pc gamer jogos baratos ofertas';
    }

    if (nicheName.includes('assinaturas') || selectedProductsText.includes('netflix') || selectedProductsText.includes('spotify')) {
      if (selectedProductsText.includes('netflix') || selectedProductsText.includes('disney') || selectedProductsText.includes('prime')) return 'filmes series streaming ofertas assinatura';
      if (selectedProductsText.includes('spotify') || selectedProductsText.includes('youtube')) return 'musica premium estudantes assinatura barata';
      return 'assinaturas digitais apps premium ofertas';
    }

    if (nicheName.includes('infoprodutos') || selectedProductsText.includes('renda') || selectedProductsText.includes('emagrec')) {
      if (selectedProductsText.includes('emagrec') || selectedProductsText.includes('fitness')) return 'receitas saudaveis treino em casa emagrecimento';
      if (selectedProductsText.includes('renda') || selectedProductsText.includes('finan')) return 'renda extra trabalho em casa empreendedores iniciantes';
      return 'melhorar rotina ganhar dinheiro aprender online';
    }

    if (nicheName.includes('achados') || selectedProductsText.includes('casa') || selectedProductsText.includes('cozinha')) {
      if (selectedProductsText.includes('cozinha') || selectedProductsText.includes('casa')) return 'donas de casa decoracao cozinha achadinhos uteis';
      if (selectedProductsText.includes('beleza') || selectedProductsText.includes('make')) return 'beleza feminina skincare maquiagem achadinhos';
      return 'achadinhos uteis casa ofertas';
    }

    return `${storeConfig.niche || storeConfig.name} ofertas produtos baratos interessados`;
  };

  const facebookCopies = [
    {
      title: 'Copy direta para grupos',
      description: 'Texto simples para postar em grupos de oferta e comunidade do nicho.',
      text: `Pessoal, montei uma vitrine com ofertas de ${storeConfig.niche || storeConfig.name}.${productLine}\n\nDa para ver os produtos, valores e chamar direto no WhatsApp pelo link:\n${fullDomain}`
    },
    {
      title: 'Copy de curiosidade',
      description: 'Boa para grupos onde posts muito vendedores performam pior.',
      text: `Achei algumas ofertas que podem ajudar quem curte ${storeConfig.niche || 'esse tipo de produto'}.${productLine}\n\nDeixei tudo organizado numa vitrine com valores e atendimento pelo WhatsApp:\n${fullDomain}`
    },
    {
      title: 'Copy com urgencia leve',
      description: 'Use quando quiser dar sensação de oportunidade sem parecer spam.',
      text: `Passando para avisar: separei algumas ofertas que estao valendo a pena hoje.${productLine}\n\nQuem quiser ver os produtos e chamar no WhatsApp, deixei a vitrine aqui:\n${fullDomain}`
    },
    {
      title: 'Copy curta',
      description: 'Para grupos mais movimentados ou publicações rápidas.',
      text: `Ofertas selecionadas de ${storeConfig.niche || storeConfig.name} em uma vitrine simples, com valores e WhatsApp:\n${fullDomain}`
    }
  ];

  const handleCopyText = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    showToast('Copy do Facebook copiada.');
    window.setTimeout(() => setCopiedIndex(null), 2200);
  };

  const handleOpenFacebookGroups = async () => {
    await handleCopyText(facebookCopies[0].text, 100);
    window.open(`https://www.facebook.com/search/groups/?q=${encodeURIComponent(getFacebookSearchTerm())}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-7 animate-fade-in text-left">
      <header className="rounded-3xl border border-brand-500/25 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,.16),transparent_34%),rgba(255,255,255,.035)] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[.28em] text-brand-500">Anuncio gratis</p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">Copys para divulgar no Facebook.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Escolha um texto, copie e publique em grupos. Se quiser, use o botão abaixo para copiar a primeira copy e abrir a busca de grupos.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleOpenFacebookGroups}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-sm font-black text-white transition hover:bg-blue-400"
          >
            <Facebook className="h-4 w-4" />
            Buscar grupos e copiar texto
          </button>
          <span className="rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs font-bold text-slate-300">
            Busca sugerida: {getFacebookSearchTerm()}
          </span>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        {facebookCopies.map((copyItem, index) => {
          const copied = copiedIndex === index || copiedIndex === 100 && index === 0;

          return (
            <article key={copyItem.title} className="rounded-3xl border border-white/10 bg-white/[.035] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[.22em] text-blue-300">Facebook</p>
                  <h2 className="mt-2 font-display text-xl font-bold text-white">{copyItem.title}</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{copyItem.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyText(copyItem.text, index)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-black transition ${
                    copied ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-slate-200'
                  }`}
                >
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-slate-200 whitespace-pre-wrap">
                {copyItem.text}
              </div>
            </article>
          );
        })}
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-[#0a0a0f]/95 p-4 shadow-2xl backdrop-blur-md">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold leading-normal text-white">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
