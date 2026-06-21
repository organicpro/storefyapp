import React, { useState } from 'react';
import { 
  Gamepad2, 
  Tv, 
  TrendingUp, 
  Cpu, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Sparkles, 
  Store, 
  MessageSquare, 
  Paintbrush, 
  Compass, 
  ShoppingBag,
  ExternalLink,
  Smartphone,
  Facebook,
  Instagram,
  Copy,
  Plus,
  Trash2,
  Gift,
  HelpCircle,
  HelpCircle as FaqIcon,
  BookOpen
} from 'lucide-react';
import { Niche, Product, StoreConfig } from '../types';
import { NICHES } from '../data';

interface WizardProps {
  products: Product[];
  storeConfig: StoreConfig;
  onUpdateStoreConfig: (newConfig: StoreConfig) => void;
  onToggleAddProduct: (productId: string) => void;
  onUpdateSalePrice: (productId: string, newPrice: number) => void;
  initialStep?: number;
  onNavigateToPreview: (returnStep: number) => void;
  onPublishStore: () => Promise<{ mode: string; url: string; error?: string }>;
}

export default function Wizard({ 
  products, 
  storeConfig, 
  onUpdateStoreConfig, 
  onToggleAddProduct,
  onUpdateSalePrice,
  initialStep = 1,
  onNavigateToPreview,
  onPublishStore
}: WizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedNicheId, setSelectedNicheId] = useState(NICHES[0].id);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishStatusText, setPublishStatusText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedFacebookPost, setCopiedFacebookPost] = useState(false);
  const [publishedResult, setPublishedResult] = useState<{ mode: string; url: string; error?: string } | null>(null);

  // Form states initialized with current config
  const [storeName, setStoreName] = useState(storeConfig.name);
  const [storeWhatsapp, setStoreWhatsapp] = useState(storeConfig.whatsapp);
  const [storeSubdomain, setStoreSubdomain] = useState(storeConfig.subdomain);
  const [storeWelcomeMessage, setStoreWelcomeMessage] = useState(storeConfig.welcomeMessage);
  const [storeColor, setStoreColor] = useState(storeConfig.primaryColor);
  const [storeThemePreset, setStoreThemePreset] = useState<NonNullable<StoreConfig['themePreset']>>(storeConfig.themePreset || 'obsidian');
  const [heroTitle, setHeroTitle] = useState(storeConfig.heroTitle || storeConfig.name);
  const [heroSubtitle, setHeroSubtitle] = useState(storeConfig.heroSubtitle || 'Escolha o produto, veja detalhes e envie o pedido para a loja.');

  const stepsList = [
    { num: 1, label: 'Nicho' },
    { num: 2, label: 'Produtos' },
    { num: 3, label: 'Identidade' },
    { num: 4, label: 'Página' },
    { num: 5, label: 'Publicar' },
    { num: 6, label: 'Divulgação' }
  ];

  const selectedNiche = NICHES.find(n => n.id === selectedNicheId) || NICHES[0];

  // Colors list for visual editor
  const colorsList = [
    { name: 'Ouro SaaS', hex: '#d4af37' },
    { name: 'Roxo Violeta', hex: '#7c3aed' },
    { name: 'Azul Eletrico', hex: '#2563eb' },
    { name: 'Verde Oferta', hex: '#10b981' },
    { name: 'Vermelho Venda', hex: '#ef4444' },
    { name: 'Rosa Pop', hex: '#db2777' },
    { name: 'Ciano Cyber', hex: '#06b6d4' },
    { name: 'Laranja Achado', hex: '#f97316' },
    { name: 'Lima Neon', hex: '#84cc16' },
    { name: 'Preto Luxo', hex: '#f8fafc' }
  ];

  const themePresets = [
    { id: 'obsidian', name: 'Dark premium', bg: '#050507', hero: '#111827', surface: '#18181b', text: '#ffffff', muted: '#94a3b8' },
    { id: 'aurora', name: 'Neon glass', bg: '#050312', hero: '#312e81', surface: '#111827', text: '#ffffff', muted: '#a5b4fc' },
    { id: 'clean', name: 'Clean claro', bg: '#f8fafc', hero: '#ffffff', surface: '#e2e8f0', text: '#0f172a', muted: '#64748b' },
    { id: 'market', name: 'Oferta pop', bg: '#09090b', hero: '#7c2d12', surface: '#1f2937', text: '#fff7ed', muted: '#fed7aa' }
  ] as const;

  // Filter products matching recommendation for selected niche
  const recommendedProducts = products.filter(p => 
    selectedNiche.recommendedSubcategories.includes(p.subcategory)
  );

  const publishedUrl = publishedResult?.url?.startsWith('http')
    ? publishedResult.url
    : '';
  const displayStoreLink = publishedUrl || 'Publique para gerar o link da loja';

  const handleNext = () => {
    const normalizedSubdomain = storeSubdomain.toLowerCase().replace(/\s+/g, '-');

    if (currentStep === 3) {
      const defaultHeroTitle = storeConfig.name;
      const nextHeroTitle = heroTitle.trim() && heroTitle !== defaultHeroTitle
        ? heroTitle
        : (storeName || storeConfig.name);

      if (nextHeroTitle !== heroTitle) {
        setHeroTitle(nextHeroTitle);
      }

      // Save identity config intermediate
      onUpdateStoreConfig({
        ...storeConfig,
        name: storeName,
        whatsapp: storeWhatsapp,
        subdomain: normalizedSubdomain,
        welcomeMessage: storeWelcomeMessage,
        heroTitle: nextHeroTitle
      });
    }

    if (currentStep === 4) {
      // Save customized color & details
      onUpdateStoreConfig({
        ...storeConfig,
        name: storeName,
        whatsapp: storeWhatsapp,
        subdomain: normalizedSubdomain,
        welcomeMessage: storeWelcomeMessage,
        primaryColor: storeColor,
        themePreset: storeThemePreset,
        heroTitle: heroTitle.trim() || (storeName || storeConfig.name),
        heroSubtitle
      });
    }

    if (currentStep === 5) {
      handlePublishProcess();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePublishProcess = async () => {
    setIsPublishing(true);
    setPublishProgress(15);
    setPublishStatusText('Gerando vitrine publica...');

    await new Promise(resolve => setTimeout(resolve, 350));
    setPublishProgress(45);
    setPublishStatusText(`Preparando WhatsApp (${storeWhatsapp}) e catalogo selecionado...`);

    await new Promise(resolve => setTimeout(resolve, 350));
    setPublishProgress(70);
    setPublishStatusText('Publicando a loja na Netlify...');

    const result = await onPublishStore();
    setPublishedResult(result);

    if (result.mode === 'error') {
      setPublishProgress(100);
      setPublishStatusText(result.error || 'Falha ao publicar a vitrine.');
      await new Promise(resolve => setTimeout(resolve, 850));
      setIsPublishing(false);
      return;
    }

    setPublishProgress(100);
    setPublishStatusText('Loja publicada na Netlify.');

    await new Promise(resolve => setTimeout(resolve, 550));
    setIsPublishing(false);
    setCurrentStep(6);
  };
  const handleCopyLink = () => {
    if (!publishedUrl) return;
    navigator.clipboard.writeText(publishedUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getFacebookSearchTerm = () => {
    const nicheName = selectedNiche.name.toLowerCase();
    const selectedProducts = products
      .filter(product => product.addedToStore)
      .map(product => `${product.name} ${product.subcategory}`.toLowerCase())
      .join(' ');

    if (nicheName.includes('gamer') || nicheName.includes('esports')) {
      if (selectedProducts.includes('roblox')) return 'pais roblox contas robux ofertas jogos infantis';
      if (selectedProducts.includes('free fire')) return 'free fire diamantes guildas jogadores ofertas';
      if (selectedProducts.includes('call of duty') || selectedProducts.includes('cod')) return 'call of duty warzone jogadores brasileiros ofertas';
      if (selectedProducts.includes('steam')) return 'pc gamer steam promoções jogos baratos';
      return 'pc gamer playstation xbox nintendo jogos baratos ofertas';
    }

    if (nicheName.includes('assinaturas')) {
      if (selectedProducts.includes('disney') || selectedProducts.includes('netflix') || selectedProducts.includes('prime')) return 'filmes series streaming familias ofertas assinatura';
      if (selectedProducts.includes('spotify') || selectedProducts.includes('youtube')) return 'musica premium estudantes assinatura barata';
      if (selectedProducts.includes('canva') || selectedProducts.includes('chatgpt') || selectedProducts.includes('ia')) return 'empreendedores social media canva chatgpt ferramentas ia';
      return 'economizar assinaturas digitais apps premium ofertas';
    }

    if (nicheName.includes('infoprodutos')) {
      if (selectedProducts.includes('emagrec') || selectedProducts.includes('fitness')) return 'receitas saudaveis treino em casa emagrecimento mulheres';
      if (selectedProducts.includes('renda') || selectedProducts.includes('finan')) return 'renda extra trabalho em casa empreendedores iniciantes';
      if (selectedProducts.includes('desenvolvimento') || selectedProducts.includes('mente')) return 'produtividade desenvolvimento pessoal habitos disciplina';
      return 'melhorar rotina ganhar dinheiro aprender online';
    }

    if (nicheName.includes('achados')) {
      if (selectedProducts.includes('cozinha') || selectedProducts.includes('casa')) return 'donas de casa decoração cozinha achadinhos úteis';
      if (selectedProducts.includes('beleza') || selectedProducts.includes('make')) return 'beleza feminina skincare maquiagem achadinhos';
      if (selectedProducts.includes('pet')) return 'tutores pets cachorros gatos produtos úteis';
      if (selectedProducts.includes('carro') || selectedProducts.includes('auto')) return 'carros acessórios automotivos motoristas ofertas';
      return 'achadinhos úteis casa presentes baratos ofertas';
    }

    return `${selectedNiche.name} ofertas produtos baratos interessados`;
  };

  const getFacebookPostText = () =>
    `Pessoal, montei uma vitrine com ofertas de ${selectedNiche.name}. Tem produtos selecionados, atendimento e pedido direto pelo link: ${publishedUrl || 'link da vitrine em breve'}`;

  const handleOpenFacebookGroups = async () => {
    await navigator.clipboard.writeText(getFacebookPostText());
    setCopiedFacebookPost(true);
    window.open(`https://www.facebook.com/search/groups/?q=${encodeURIComponent(getFacebookSearchTerm())}`, '_blank', 'noopener,noreferrer');
    setTimeout(() => setCopiedFacebookPost(false), 2500);
  };

  // Get matching icon relative to string
  const renderNicheIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2': return <Gamepad2 className="w-6 h-6" />;
      case 'Tv': return <Tv className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'Cpu': return <Cpu className="w-6 h-6" />;
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6" />;
      default: return <Compass className="w-6 h-6" />;
    }
  };

  return (
    <div className="storefy-panel w-full min-w-0 space-y-6 rounded-2xl p-4 animate-fade-in sm:space-y-8 sm:rounded-3xl sm:p-6 xl:p-8">
      {/* Progress wizard header */}
      <div className="space-y-4 border-b border-white/5 pb-6 text-left">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="storefy-badge storefy-badge-brand">
              ASSISTENTE DE CONFIGURACAO
            </span>
            <h2 className="mt-2 font-display text-lg font-semibold text-white sm:text-xl">Crie sua Vitrine em Minutos</h2>
          </div>
          <span className="text-xs font-mono font-bold text-slate-300 bg-white/[0.05] border border-white/10 px-3 py-1 rounded-xl">
            Passo {currentStep} de 6
          </span>
        </div>

        {/* Visual stepper */}
        <div className="pt-2 space-y-3">
          <div className="grid grid-cols-6 gap-2">
            {stepsList.map((st) => (
              <div key={st.num} className="flex flex-col items-center min-w-0">
                <button
                  disabled={st.num > currentStep && currentStep !== 6}
                  onClick={() => st.num <= currentStep && setCurrentStep(st.num)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all border shrink-0 z-10 cursor-pointer ${
                    st.num < currentStep
                      ? 'bg-brand-500 border-brand-500 text-black shadow-[0_0_24px_rgba(212,175,55,0.18)]'
                      : st.num === currentStep
                      ? 'bg-brand-500/15 border-brand-500/55 text-brand-100 font-extrabold shadow-[0_0_24px_rgba(212,175,55,0.12)]'
                      : 'bg-[#0f0f15] border-white/10 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {st.num < currentStep ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : st.num}
                </button>
                <span className={`text-[10px] font-semibold mt-1.5 font-mono truncate max-w-full ${
                  st.num === currentStep ? 'text-white font-bold' : 'text-slate-500'
                }`}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-2 px-1">
            {stepsList.slice(1).map((st, index) => (
              <div
                key={st.num}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index < currentStep - 1 ? 'bg-brand-500 shadow-[0_0_18px_rgba(212,175,55,0.22)]' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* STEP 1: CHOOSE NICHE */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h3 className="text-lg font-display font-medium text-white">1. Escolha seu nicho de atuação</h3>
            <p className="text-xs text-slate-400">
              Isso nos ajudará a pré-configurar os produtos digitais com maior potencial de venda para sua audiência inicial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {NICHES.map((niche) => {
              const isSelected = selectedNicheId === niche.id;
              return (
                <div
                  key={niche.id}
                  onClick={() => setSelectedNicheId(niche.id)}
                  className={`storefy-card flex cursor-pointer gap-3 rounded-2xl p-4 text-left group sm:gap-4 sm:p-5 ${
                    isSelected ? 'storefy-card-selected' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                    isSelected ? 'bg-brand-500 text-black shadow-md' : 'bg-white/[0.05] text-slate-300'
                  }`}>
                    {renderNicheIcon(niche.icon)}
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{niche.name}</p>
                      {isSelected && (
                        <span className="w-4.5 h-4.5 rounded-full bg-brand-500 text-black flex items-center justify-center p-0.5">
                          <Check className="w-3 h-3 stroke-[3.5px] text-black" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 leading-snug line-clamp-2">{niche.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {niche.recommendedSubcategories.slice(0, 3).map((sub, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-white/[0.05] text-slate-300 border border-white/5 px-1.5 py-0.5 rounded font-mono font-medium">
                          {sub}
                        </span>
                      ))}
                      {niche.recommendedSubcategories.length > 3 && (
                        <span className="text-[9px] text-slate-400 self-center font-semibold pl-0.5">
                          +{niche.recommendedSubcategories.length - 3} mais
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: SELECT PRODUCTS */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h3 className="text-lg font-display font-medium text-white">2. Adicione os produtos iniciais</h3>
            <p className="text-xs text-slate-400">
              Recomendamos colocar pelo menos 3 ofertas de <span className="font-semibold text-slate-300">{selectedNiche.name}</span> para a loja parecer encorpada e atrativa.
            </p>
          </div>

          <div className="storefy-panel p-4 rounded-2xl flex items-center justify-between text-xs text-slate-300 font-sans">
            <span className="font-semibold text-white">Sugestões baseadas no nicho: {selectedNiche.name}</span>
            <span className="font-mono text-slate-400">Exibindo {recommendedProducts.length} recomendações</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[32rem] overflow-y-auto pr-1">
            {recommendedProducts.map((p) => {
              const profit = p.salePrice - p.costPrice;
              return (
                <div 
                  key={p.id}
                  className={`storefy-card p-4 rounded-xl text-left ${
                    p.addedToStore ? 'storefy-card-selected' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={p.imageUrl} 
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover shrink-0 select-none bg-white/[0.05]"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-white truncate" title={p.name}>{p.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{p.subcategory} - Forn: {p.supplier}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleAddProduct(p.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] flex items-center gap-1 shrink-0 cursor-pointer ${
                        p.addedToStore
                          ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20'
                          : 'storefy-primary-action'
                      }`}
                    >
                      {p.addedToStore ? <Trash2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{p.addedToStore ? 'Remover' : 'Adicionar'}</span>
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-white/10 bg-black/20 px-2.5 py-2">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Voce paga</p>
                      <p className="mt-1 text-xs font-bold text-slate-200">R$ {p.costPrice.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <label className="rounded-lg border border-brand-500/20 bg-brand-500/10 px-2.5 py-2">
                      <span className="text-[9px] font-black uppercase tracking-wider text-brand-200">Voce vende</span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={p.salePrice}
                        onChange={(event) => onUpdateSalePrice(p.id, Number(event.target.value))}
                        className="mt-1 w-full bg-transparent text-xs font-bold text-white outline-none"
                      />
                    </label>
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-2">
                      <p className="text-[9px] font-black uppercase tracking-wider text-emerald-200">Lucro</p>
                      <p className="mt-1 text-xs font-bold text-emerald-300">R$ {profit.toFixed(2).replace('.', ',')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: CONFIGURE STORE */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h3 className="text-lg font-display font-medium text-white">3. Configure sua identidade de loja</h3>
            <p className="text-xs text-slate-400">
              Insira o nome da sua vitrine e o WhatsApp que receberá as mensagens prontas do carrinho.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
            {/* Store Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Nome da Loja</label>
              <input
                type="text"
                placeholder="Ex. Elite Gamer Premium"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 glass-premium-input font-sans"
              />
            </div>

            {/* WhatsApp Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                WhatsApp de Recebimento
              </label>
              <input
                type="text"
                placeholder="Ex. 5511999998888"
                value={storeWhatsapp}
                onChange={(e) => setStoreWhatsapp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 glass-premium-input font-mono"
              />
              <span className="text-[10px] text-slate-500 block font-mono">DDI (55) + DDD + Telefone, somente números</span>
            </div>

            {/* Subdomain Input */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Nome do arquivo / loja</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="nomedaloja"
                  value={storeSubdomain}
                  onChange={(e) => setStoreSubdomain(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 glass-premium-input font-mono"
                />
              </div>
            </div>

            {/* Welcome message draft */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Mensagem padrão no WhatsApp</label>
              <textarea
                rows={2}
                value={storeWelcomeMessage}
                onChange={(e) => setStoreWelcomeMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 glass-premium-input font-sans"
                placeholder="Olá! Gostaria de comprar o produto do catálogo..."
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: EDIT PAGE DESIGN */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-lg font-display font-medium text-white">4. Escolha o visual da vitrine</h3>
            <p className="text-xs text-slate-400">
              Selecione pela miniatura, ajuste a cor e escreva a primeira chamada que o cliente vai ver.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {themePresets.map((theme) => {
              const isSelected = storeThemePreset === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setStoreThemePreset(theme.id)}
                  className={`group overflow-hidden rounded-3xl border p-3 text-left transition-all duration-300 ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/10 shadow-2xl shadow-brand-500/10 ring-1 ring-brand-500/30'
                      : 'border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-2xl border border-white/10" style={{ backgroundColor: theme.bg }}>
                    <div className="p-4" style={{ background: `linear-gradient(135deg, ${theme.hero}, ${theme.bg})` }}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-lg border border-white/15" style={{ backgroundColor: storeColor }} />
                          <span className="h-2 w-20 rounded-full" style={{ backgroundColor: theme.text, opacity: 0.85 }} />
                        </div>
                        <span className="h-6 w-16 rounded-full" style={{ backgroundColor: storeColor }} />
                      </div>
                      <div className="mt-8 max-w-[72%] space-y-2">
                        <span className="block h-2 w-20 rounded-full" style={{ backgroundColor: theme.muted }} />
                        <span className="block h-5 w-full rounded-lg" style={{ backgroundColor: theme.text }} />
                        <span className="block h-5 w-3/4 rounded-lg" style={{ backgroundColor: theme.text }} />
                        <span className="block h-2 w-2/3 rounded-full" style={{ backgroundColor: theme.muted }} />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 p-3">
                      {[0, 1, 2].map((item) => (
                        <div key={item} className="rounded-xl border border-white/10 p-2" style={{ backgroundColor: theme.surface }}>
                          <div className="h-10 rounded-lg" style={{ backgroundColor: item === 1 ? storeColor : theme.hero }} />
                          <div className="mt-2 h-2 w-4/5 rounded-full" style={{ backgroundColor: theme.text, opacity: 0.85 }} />
                          <div className="mt-1 h-2 w-1/2 rounded-full" style={{ backgroundColor: theme.muted }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 px-1">
                    <div>
                      <p className="text-sm font-black text-white">{theme.name}</p>
                      <p className="text-[11px] text-slate-400">Preview visual da loja final</p>
                    </div>
                    {isSelected && <Check className="h-5 w-5 text-brand-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-5 max-w-5xl mx-auto text-left">
            <div className="storefy-panel space-y-3 rounded-3xl p-5">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Paintbrush className="w-3.5 h-3.5 text-brand-500" /> Cor de destaque
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {colorsList.map((color) => {
                  const isSel = storeColor === color.hex;
                  return (
                    <button
                      key={color.hex}
                      type="button"
                      onClick={() => setStoreColor(color.hex)}
                      title={color.name}
                      className={`relative h-12 rounded-2xl border transition-all ${isSel ? 'border-white ring-2 ring-white/20' : 'border-white/10 hover:border-white/30'}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSel && <Check className="absolute inset-0 m-auto h-4 w-4 text-black drop-shadow" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="storefy-panel space-y-4 rounded-3xl p-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Titulo principal</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 font-sans"
                  placeholder="Ex. Achados inteligentes para comprar hoje"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Subtitulo da vitrine</label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-brand-500 font-sans"
                  placeholder="Explique a promessa da loja em uma frase curta."
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: PRE-PUBLISH PROGRESS */}
      {currentStep === 5 && (
        <div className="space-y-6 max-w-md mx-auto text-center py-6">
          <div className="w-16 h-16 bg-white/[0.03] text-white border border-white/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8 animate-pulse text-brand-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-display font-medium text-white">Pronto para gerar sua vitrine?</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Com a Netlify conectada, a Storefy envia o site direto para a Netlify e retorna o link publicado. Se ativar nas configurações, também baixa o HTML como backup.</p>
          </div>

          <button
            onClick={handlePublishProcess}
            className="storefy-primary-action w-full py-3 text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <span>Publicar</span>
            <ChevronRight className="w-4.5 h-4.5 text-black" />
          </button>
        </div>
      )}

      {/* PUBLISHING POPUP / OVERLAY PROGRESS */}
      {isPublishing && (
        <div className="fixed inset-0 bg-[#030303]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#08080c] text-white rounded-3xl shadow-2xl p-6 text-center space-y-5 border border-white/15">
            <div className="w-12 h-12 bg-white/[0.05] text-brand-500 rounded-full flex items-center justify-center mx-auto border border-white/10">
              <span className="w-6 h-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-semibold text-white">Publicando sua Vitrine...</h4>
              <p className="text-xs text-slate-400 font-mono italic">{publishStatusText}</p>
            </div>

            {/* Custom progress visual bar */}
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-brand-500 rounded-full transition-all duration-300 shadow-[0_0_22px_rgba(212,175,55,0.35)]"
                style={{ width: `${publishProgress}%` }}
              />
            </div>

            <p className="text-[10px] font-mono text-slate-400">Progresso: {publishProgress}%</p>
          </div>
        </div>
      )}

      {/* STEP 6: CONGRATS & MARKETING DIVULGATION */}
      {currentStep === 6 && (
        <div className="space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm border border-emerald-500/20 select-none">
              <Check className="w-8 h-8 stroke-[3.5px]" />
            </div>
            <h3 className="text-xl font-display text-white mt-3 font-semibold">Parabéns! Sua vitrine está no ar.</h3>
            <p className="text-xs text-slate-400">
              O e-commerce completo foi gerado. Agora é hora de divulgar nas suas redes para faturar!
            </p>
          </div>

          <div className="storefy-panel p-5 rounded-2xl max-w-md mx-auto text-center space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Link da sua vitrine publicada</p>
            
            {/* Display domain link */}
            <div className="flex items-center gap-2 p-2 px-3 bg-white/[0.02] border border-white/10 rounded-xl relative">
              <span className="text-xs font-bold text-white truncate flex-1 block text-left">
                {displayStoreLink}
              </span>
              
              <button 
                onClick={handleCopyLink}
                disabled={!publishedUrl}
                className="p-1 px-2.5 rounded-lg bg-white text-black text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <Copy className="w-3 h-3 text-black" />
                <span>{copiedLink ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            {publishedResult?.mode === 'netlify' && (
              <p className="text-[11px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">Site publicado na Netlify. Copie o link e use o preview para conferir o site gerado dentro da Storefy.</p>
            )}

            <button
              onClick={() => onNavigateToPreview(currentStep)}
              className="w-full py-2.5 storefy-primary-action text-black text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>Visualizar site gerado</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Marketing Kits widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4 text-left">
            {/* Bio pitch template */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <Instagram className="w-3.5 h-3.5 text-pink-500" /> Bio do Instagram
              </h4>
              <p className="text-xs text-slate-450">Coloque isso no link da sua bio do Instagram:</p>
              <div className="p-3 bg-[#06060c] rounded-xl text-slate-300 text-[11px] font-mono select-all border border-white/5">
                Chaves digitais, gift cards e ofertas selecionadas. Garanta as novidades aqui: {publishedUrl || 'publique a loja para gerar o link ao vivo'}
              </div>
            </div>

            {/* Direct message templates */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Direct Link
              </h4>
              <p className="text-xs text-slate-450">Texto pronto para mandar em grupos de ofertas:</p>
              <div className="p-3 bg-[#06060c] rounded-xl text-slate-300 text-[11px] font-mono select-all border border-white/5">
                Fala galera! Montei meu catálogo exclusivo com ótimos preços! Dá uma olhada na vitrine: {publishedUrl || 'publique a loja para gerar o link ao vivo'}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3 md:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1">
                    <Facebook className="w-3.5 h-3.5 text-blue-500" /> Grupos do Facebook
                  </h4>
                  <p className="text-xs text-slate-450 mt-1">Busca grupos com alta chance de interesse nos produtos selecionados e copia uma mensagem pronta para publicar.</p>
                </div>
                <button
                  onClick={handleOpenFacebookGroups}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>{copiedFacebookPost ? 'Mensagem copiada' : 'Buscar grupos e copiar texto'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3 bg-[#06060c] rounded-xl text-slate-300 text-[11px] font-mono select-all border border-white/5">
                {getFacebookPostText()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Button navigation triggers */}
      {currentStep < 5 && (
        <div className="flex items-center justify-between border-t border-white/5 pt-6 text-left">
          <button
            disabled={currentStep === 1}
            onClick={handleBack}
            className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer ${
              currentStep === 1
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-white hover:bg-slate-200 text-black font-bold rounded-xl text-xs font-semibold flex items-center gap-1 shadow transition-all active:scale-95 cursor-pointer"
          >
            <span>Avançar</span>
            <ChevronRight className="w-4 h-4 text-black" />
          </button>
        </div>
      )}
    </div>
  );
}



