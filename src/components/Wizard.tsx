import React, { useState, useRef } from 'react';
import { 
  Camera,
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
import MarketplaceImporter, { MarketplaceImportInput } from './MarketplaceImporter';

interface WizardProps {
  products: Product[];
  storeConfig: StoreConfig;
  onUpdateStoreConfig: (newConfig: StoreConfig) => void;
  onToggleAddProduct: (productId: string) => void;
  onUpdateSalePrice: (productId: string, newPrice: number) => void;
  onCreateCustomProduct: (product: Pick<Product, 'name' | 'salePrice' | 'category' | 'subcategory' | 'imageUrl'>) => void;
  onImportProduct: (product: MarketplaceImportInput) => void;
  initialStep?: number;
  onNavigateToPreview: (returnStep: number) => void;
  onPublishStore: () => Promise<{ mode: string; url: string; error?: string }>;
  onComplete?: (publishMode: 'draft' | 'publish') => void;
}

export default function Wizard({ 
  products, 
  storeConfig, 
  onUpdateStoreConfig, 
  onToggleAddProduct,
  onUpdateSalePrice,
  onCreateCustomProduct,
  onImportProduct,
  initialStep = 1,
  onNavigateToPreview,
  onPublishStore,
  onComplete
}: WizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedNicheId, setSelectedNicheId] = useState(NICHES[0].id);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishStatusText, setPublishStatusText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedFacebookPost, setCopiedFacebookPost] = useState(false);
  const [publishedResult, setPublishedResult] = useState<{ mode: string; url: string; error?: string } | null>(null);
  const [customProductName, setCustomProductName] = useState('');
  const [customProductPrice, setCustomProductPrice] = useState('');
  const [customProductImageUrl, setCustomProductImageUrl] = useState('');
  const [customProductError, setCustomProductError] = useState('');
  const [customProductAdded, setCustomProductAdded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const customProductImageInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        setStoreLogoUrl(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCustomProductImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setCustomProductError('Escolha um arquivo de imagem.');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setCustomProductError('A imagem deve ter no máximo 3 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomProductImageUrl(reader.result);
        setCustomProductError('');
      }
    };
    reader.onerror = () => setCustomProductError('Não foi possível carregar a imagem.');
    reader.readAsDataURL(file);
  };

  // Form states initialized with current config
  const [storeLogoUrl, setStoreLogoUrl] = useState(storeConfig.logoUrl);
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
  const selectedProductCategory: Product['category'] = ({
    games: 'Games',
    'redes-sociais': 'Redes Sociais',
    'assinaturas-digitais': 'Assinaturas Digitais',
    infoprodutos: 'Infoprodutos',
    'physical-finds': 'Achados Fisicos'
  } as Record<string, Product['category']>)[selectedNiche.id] || 'Games';

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
    || (p.supplier === 'Produto próprio' && p.category === selectedProductCategory)
  );

  const handleCreateCustomProduct = (event: React.FormEvent) => {
    event.preventDefault();
    const name = customProductName.trim();
    const price = Number(customProductPrice.replace(',', '.'));

    if (!name) {
      setCustomProductError('Informe o nome do produto.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setCustomProductError('Informe um preço maior que zero.');
      return;
    }

    onCreateCustomProduct({
      name,
      salePrice: price,
      category: selectedProductCategory,
      subcategory: selectedNiche.name,
      imageUrl: customProductImageUrl.trim()
    });
    setCustomProductName('');
    setCustomProductPrice('');
    setCustomProductImageUrl('');
    setCustomProductError('');
    setCustomProductAdded(true);
    window.setTimeout(() => setCustomProductAdded(false), 2400);
  };

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
        heroTitle: nextHeroTitle,
        logoUrl: storeLogoUrl
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
      handlePublishProcess('publish');
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePublishProcess = async (mode: 'draft' | 'publish') => {
    setIsPublishing(true);

    if (mode === 'draft') {
      setPublishProgress(50);
      setPublishStatusText('Salvando loja como rascunho...');
      await new Promise(resolve => setTimeout(resolve, 800));
      setPublishProgress(100);
      setPublishStatusText('Loja salva com sucesso.');
      await new Promise(resolve => setTimeout(resolve, 550));
      setIsPublishing(false);
      if (onComplete) onComplete('draft');
      setCurrentStep(6);
      return;
    }

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
    if (onComplete) onComplete('publish');
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
    <div className="bg-white border border-gray-200 shadow-sm w-full min-w-0 space-y-6 rounded-xl p-4 animate-fade-in sm:space-y-8 sm:rounded-3xl sm:p-6 xl:p-8">
      {/* Progress wizard header */}
      <div className="space-y-4 border-b border-gray-100 pb-6 text-left">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-gray-500">
              ASSISTENTE DE CONFIGURAÇÃO
            </span>
            <h2 className="mt-2 font-sans text-lg font-semibold text-gray-900 sm:text-xl">Crie sua Vitrine em Minutos</h2>
          </div>
          <span className="text-xs font-sans font-bold text-gray-800 bg-gray-50 border border-gray-200 px-3 py-1 rounded-xl">
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
                      ? 'bg-[#0f172a] border-[#0f172a] text-white shadow-sm'
                      : st.num === currentStep
                      ? 'bg-[#0f172a] border-[#0f172a] text-white font-extrabold shadow-sm'
                      : 'bg-white border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {st.num < currentStep ? <Check className="w-3.5 h-3.5 stroke-[3px]" /> : st.num}
                </button>
                <span className={`text-[10px] font-semibold mt-1.5 font-sans truncate max-w-full ${
                  st.num === currentStep ? 'text-gray-900 font-bold' : 'text-slate-500'
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
                  index < currentStep - 1 ? 'bg-[#0f172a]' : 'bg-gray-100'
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
            <h3 className="text-lg font-sans font-medium text-gray-900">1. Escolha seu nicho de atuação</h3>
            <p className="text-xs text-gray-500">
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
                  className={`flex cursor-pointer gap-3 rounded-xl border p-4 text-left group sm:gap-4 sm:p-5 transition-all ${
                    isSelected ? 'border-[#0f172a] bg-gray-50 ring-1 ring-[#0f172a] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                    isSelected ? 'bg-[#0f172a] text-white shadow-md' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {renderNicheIcon(niche.icon)}
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{niche.name}</p>
                      {isSelected && (
                        <span className="w-4.5 h-4.5 rounded-full bg-[#0f172a] flex items-center justify-center p-0.5 shadow-sm">
                          <Check className="w-3 h-3 stroke-[3.5px] text-white" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 leading-snug line-clamp-2">{niche.description}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {niche.recommendedSubcategories.slice(0, 3).map((sub, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-gray-50 text-gray-800 border border-gray-100 px-1.5 py-0.5 rounded font-sans font-medium">
                          {sub}
                        </span>
                      ))}
                      {niche.recommendedSubcategories.length > 3 && (
                        <span className="text-[9px] text-gray-500 self-center font-semibold pl-0.5">
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
            <h3 className="text-lg font-sans font-medium text-gray-900">2. Adicione os produtos iniciais</h3>
            <p className="text-xs text-gray-500">
              Recomendamos colocar pelo menos 3 ofertas de <span className="font-semibold text-gray-800">{selectedNiche.name}</span> para a loja parecer encorpada e atrativa.
            </p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-xl flex items-center justify-between text-xs text-gray-800 font-sans">
            <span className="font-semibold text-gray-900">Sugestões baseadas no nicho: {selectedNiche.name}</span>
            <span className="font-sans text-gray-500">Exibindo {recommendedProducts.length} recomendações</span>
          </div>

          <MarketplaceImporter onImportProduct={onImportProduct} variant="setup" />

          <form onSubmit={handleCreateCustomProduct} className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-left shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#0f172a] text-white">
                <Plus className="h-5 w-5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Adicionar produto próprio</h4>
                <p className="mt-1 text-xs text-gray-500">Cadastre uma oferta personalizada para esta loja.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px_auto]">
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-500">Nome do produto</span>
                <input
                  value={customProductName}
                  onChange={(event) => { setCustomProductName(event.target.value); setCustomProductError(''); }}
                  placeholder="Ex. Consultoria personalizada"
                  maxLength={90}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0f172a]"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-500">Preço de venda</span>
                <div className="flex h-11 items-center rounded-lg border border-gray-300 bg-white px-3 focus-within:border-[#0f172a]">
                  <span className="mr-2 text-xs font-bold text-gray-500">R$</span>
                  <input
                    value={customProductPrice}
                    onChange={(event) => { setCustomProductPrice(event.target.value); setCustomProductError(''); }}
                    inputMode="decimal"
                    placeholder="0,00"
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-gray-900 outline-none"
                  />
                </div>
              </label>
              <button type="submit" className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-4 text-xs font-semibold text-white hover:bg-[#1e293b]">
                <Plus className="h-4 w-4" />
                Adicionar
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-end">
              <div className="grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                {customProductImageUrl
                  ? <img src={customProductImageUrl} alt="Prévia do produto" className="h-full w-full object-cover" />
                  : <Camera className="h-5 w-5 text-gray-400" />
                }
              </div>
              <label className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-gray-500">Foto do produto</span>
                <input
                  value={customProductImageUrl.startsWith('data:') ? '' : customProductImageUrl}
                  onChange={(event) => { setCustomProductImageUrl(event.target.value); setCustomProductError(''); }}
                  placeholder="Cole o link da imagem ou envie uma foto"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#0f172a]"
                />
              </label>
              <button type="button" onClick={() => customProductImageInputRef.current?.click()} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-xs font-semibold text-gray-700 hover:bg-gray-100">
                <Camera className="h-4 w-4" />
                Escolher foto
              </button>
              <input ref={customProductImageInputRef} type="file" accept="image/*" onChange={handleCustomProductImageChange} className="hidden" />
            </div>
            {(customProductError || customProductAdded) && (
              <p className={`mt-3 text-xs font-semibold ${customProductError ? 'text-rose-600' : 'text-emerald-600'}`}>
                {customProductError || 'Produto adicionado e selecionado na loja.'}
              </p>
            )}
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[32rem] overflow-y-auto pr-1">
            {recommendedProducts.map((p) => {
              const profit = p.salePrice - p.costPrice;
              return (
                <div 
                  key={p.id}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    p.addedToStore ? 'border-[#0f172a] bg-gray-50 ring-1 ring-[#0f172a] shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-lg object-cover shrink-0 select-none bg-gray-50"
                        />
                      ) : (
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gray-100 text-gray-500">
                          <ShoppingBag className="h-5 w-5" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900 truncate" title={p.name}>{p.name}</p>
                        <p className="text-[10px] text-gray-500 font-sans mt-0.5">{p.subcategory} - Forn: {p.supplier}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => onToggleAddProduct(p.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-[11px] flex items-center gap-1 shrink-0 cursor-pointer shadow-sm transition-colors ${
                        p.addedToStore
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                          : 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
                      }`}
                    >
                      {p.addedToStore ? <Trash2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{p.addedToStore ? 'Remover' : 'Adicionar'}</span>
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-2">
                      <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Voce paga</p>
                      <p className="mt-1 text-xs font-bold text-gray-700">R$ {p.costPrice.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <label className="rounded-lg border border-brand-500/20 bg-brand-500/10 px-2.5 py-2">
                      <span className="text-[9px] font-black uppercase tracking-wider text-brand-200">Voce vende</span>
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        value={p.salePrice}
                        onChange={(event) => onUpdateSalePrice(p.id, Number(event.target.value))}
                        className="mt-1 w-full bg-transparent text-xs font-bold text-gray-900 outline-none"
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
            <h3 className="text-lg font-sans font-medium text-gray-900">3. Configure sua identidade de loja</h3>
            <p className="text-xs text-gray-500">
              Insira o nome da sua vitrine e o WhatsApp que receberá as mensagens prontas do carrinho.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto text-left">
            {/* Store Profile Photo / Logo */}
            <div className="md:col-span-2 flex items-center gap-6 bg-white border border-gray-200 p-5 rounded-2xl shadow-sm mb-2">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400 font-bold border border-gray-200 shadow-inner select-none">
                  {storeLogoUrl
                    ? <img src={storeLogoUrl} alt="Logo" className="w-full h-full object-cover" />
                    : <span>Logo</span>
                  }
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#0f172a] border-[3px] border-white flex items-center justify-center hover:bg-[#1e293b] transition-colors cursor-pointer shadow-sm"
                  title="Alterar logo da loja"
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
              <div className="flex-1 min-w-0">
                <h4 className="text-[14px] font-bold text-gray-900">Logo ou Foto de Perfil</h4>
                <p className="text-[12px] text-gray-500 mt-0.5 max-w-sm mb-3">
                  Faça o upload da imagem que aparecerá no cabeçalho do site.
                </p>
                <input
                  type="text"
                  placeholder="Ou cole o link da imagem aqui..."
                  value={storeLogoUrl || ''}
                  onChange={(e) => setStoreLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-slate-500 focus:outline-none focus:border-[#0f172a] focus:ring-1 focus:ring-[#0f172a]/20"
                />
              </div>
            </div>

            {/* Store Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Nome da Loja</label>
              <input
                type="text"
                placeholder="Ex. Elite Gamer Premium"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 bg-white border border-gray-200 shadow-sm-input font-sans"
              />
            </div>

            {/* WhatsApp Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans flex items-center gap-1">
                WhatsApp de Recebimento
              </label>
              <input
                type="text"
                placeholder="Ex. 5511999998888"
                value={storeWhatsapp}
                onChange={(e) => setStoreWhatsapp(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 bg-white border border-gray-200 shadow-sm-input font-sans"
              />
              <span className="text-[10px] text-slate-500 block font-sans">DDI (55) + DDD + Telefone, somente números</span>
            </div>

            {/* Subdomain Input */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Nome do arquivo / loja</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="nomedaloja"
                  value={storeSubdomain}
                  onChange={(e) => setStoreSubdomain(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 bg-white border border-gray-200 shadow-sm-input font-sans"
                />
              </div>
            </div>

            {/* Welcome message draft */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Mensagem padrão no WhatsApp</label>
              <textarea
                rows={2}
                value={storeWelcomeMessage}
                onChange={(e) => setStoreWelcomeMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 bg-white border border-gray-200 shadow-sm-input font-sans"
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
            <h3 className="text-lg font-sans font-medium text-gray-900">4. Escolha o visual da vitrine</h3>
            <p className="text-xs text-gray-500">
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
                      : 'border-gray-200 bg-white/[0.025] hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative overflow-hidden rounded-xl border border-gray-200" style={{ backgroundColor: theme.bg }}>
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
                        <div key={item} className="rounded-xl border border-gray-200 p-2" style={{ backgroundColor: theme.surface }}>
                          <div className="h-10 rounded-lg" style={{ backgroundColor: item === 1 ? storeColor : theme.hero }} />
                          <div className="mt-2 h-2 w-4/5 rounded-full" style={{ backgroundColor: theme.text, opacity: 0.85 }} />
                          <div className="mt-1 h-2 w-1/2 rounded-full" style={{ backgroundColor: theme.muted }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 px-1">
                    <div>
                      <p className="text-sm font-black text-gray-900">{theme.name}</p>
                      <p className="text-[11px] text-gray-500">Preview visual da loja final</p>
                    </div>
                    {isSelected && <Check className="h-5 w-5 text-brand-500" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-5 max-w-5xl mx-auto text-left">
            <div className="bg-white border border-gray-200 shadow-sm space-y-3 rounded-3xl p-5">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans flex items-center gap-1.5">
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
                      className={`relative h-12 rounded-xl border transition-all ${isSel ? 'border-white ring-2 ring-white/20' : 'border-gray-200 hover:border-white/30'}`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {isSel && <Check className="absolute inset-0 m-auto h-4 w-4 text-black drop-shadow" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm space-y-4 rounded-3xl p-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Titulo principal</label>
                <input
                  type="text"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-slate-600 focus:outline-none focus:border-brand-500 font-sans"
                  placeholder="Ex. Achados inteligentes para comprar hoje"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Subtitulo da vitrine</label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900 placeholder-slate-600 focus:outline-none focus:border-brand-500 font-sans"
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
          <div className="w-16 h-16 bg-gray-100 text-gray-900 border border-gray-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Sparkles className="w-8 h-8 animate-pulse text-brand-500" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-sans font-medium text-gray-900">Finalizar criação da loja</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Você pode salvar apenas como rascunho para editar depois, ou já enviar direto para a Netlify e gerar o link ao vivo da sua vitrine.</p>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button
              onClick={() => handlePublishProcess('publish')}
              className="w-full py-3 bg-[#0f172a] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-[#1e293b] active:scale-95 shadow-sm cursor-pointer"
            >
              <span>Publicar na Netlify</span>
              <ChevronRight className="w-4.5 h-4.5 text-white" />
            </button>
            <button
              onClick={() => handlePublishProcess('draft')}
              className="w-full py-3 bg-white text-[#0f172a] border border-gray-200 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors hover:bg-gray-50 active:scale-95 shadow-sm cursor-pointer"
            >
              <span>Salvar como Rascunho</span>
            </button>
          </div>
        </div>
      )}

      {/* PUBLISHING POPUP / OVERLAY PROGRESS */}
      {isPublishing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white text-gray-900 rounded-2xl shadow-xl p-8 text-center space-y-6 border border-gray-100 transform transition-all">
            <div className="w-14 h-14 bg-gray-50 text-[#0f172a] rounded-full flex items-center justify-center mx-auto border border-gray-200 shadow-sm">
              <span className="w-6 h-6 rounded-full border-2 border-[#0f172a] border-t-transparent animate-spin" />
            </div>

            <div className="space-y-2">
              <h4 className="text-[16px] font-bold text-gray-900">Publicando sua vitrine</h4>
              <p className="text-[13px] text-gray-500 font-medium">{publishStatusText}</p>
            </div>

            {/* Custom progress visual bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner mt-4">
              <div 
                className="h-full bg-[#0f172a] rounded-full transition-all duration-300"
                style={{ width: `${publishProgress}%` }}
              />
            </div>

            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Progresso: {publishProgress}%</p>
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
            <h3 className="text-xl font-sans text-gray-900 mt-3 font-semibold">Tudo certo! Loja configurada.</h3>
            <p className="text-xs text-gray-500">
              Sua vitrine foi estruturada. {publishedUrl ? 'Agora é hora de divulgar nas suas redes para faturar!' : 'Você pode editar o catálogo ou publicá-la a qualquer momento em "Multi sites".'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm p-5 rounded-xl max-w-md mx-auto text-center space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans">Link da sua vitrine publicada</p>
            
            {/* Display domain link */}
            <div className="flex items-center gap-2 p-2 px-3 bg-gray-50 border border-gray-200 rounded-xl relative">
              <span className="text-xs font-bold text-gray-900 truncate flex-1 block text-left">
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
              className="w-full py-2.5 bg-[#0f172a] text-white hover:bg-[#1e293b] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>Visualizar site gerado</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Marketing Kits widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-4 text-left">
            {/* Bio pitch template */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans flex items-center gap-1">
                <Instagram className="w-3.5 h-3.5 text-pink-500" /> Bio do Instagram
              </h4>
              <p className="text-xs text-slate-450">Coloque isso no link da sua bio do Instagram:</p>
              <div className="p-3 bg-white rounded-xl text-gray-800 text-[11px] font-sans select-all border border-gray-200">
                Chaves digitais, gift cards e ofertas selecionadas. Garanta as novidades aqui: {publishedUrl || 'publique a loja para gerar o link ao vivo'}
              </div>
            </div>

            {/* Direct message templates */}
            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-2">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Direct Link
              </h4>
              <p className="text-xs text-slate-450">Texto pronto para mandar em grupos de ofertas:</p>
              <div className="p-3 bg-white rounded-xl text-gray-800 text-[11px] font-sans select-all border border-gray-200">
                Fala galera! Montei meu catálogo exclusivo com ótimos preços! Dá uma olhada na vitrine: {publishedUrl || 'publique a loja para gerar o link ao vivo'}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3 md:col-span-2">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider font-sans flex items-center gap-1">
                    <Facebook className="w-3.5 h-3.5 text-blue-500" /> Grupos do Facebook
                  </h4>
                  <p className="text-xs text-slate-450 mt-1">Busca grupos com alta chance de interesse nos produtos selecionados e copia uma mensagem pronta para publicar.</p>
                </div>
                <button
                  onClick={handleOpenFacebookGroups}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-gray-900 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>{copiedFacebookPost ? 'Mensagem copiada' : 'Buscar grupos e copiar texto'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="p-3 bg-white rounded-xl text-gray-800 text-[11px] font-sans select-all border border-gray-200">
                {getFacebookPostText()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Button navigation triggers */}
      {currentStep < 5 && (
        <div className="flex items-center justify-between border-t border-gray-100 pt-6 text-left">
          <button
            disabled={currentStep === 1}
            onClick={handleBack}
            className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer ${
              currentStep === 1
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>Avançar</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}




