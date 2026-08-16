import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  MessageSquare, 
  Check, 
  HelpCircle, 
  Plus, 
  Minus, 
  ArrowLeft,
  X,
  Sparkles,
  ShieldCheck,
  Zap,
  Smartphone,
  Monitor,
  Heart,
  ChevronDown
} from 'lucide-react';
import { Product, StoreConfig, MainCategory } from '../types';
import { productFallbackImage } from '../productImages';

const STOREFY_LOGO_URL = '/storefy-logo.png';
const LEGACY_STOREFY_LOGO_URL = 'https://i.imgur.com/nUsczZV.png';

function normalizeStoreLogoUrl(logoUrl?: string) {
  const value = (logoUrl || '').trim();
  if (value === LEGACY_STOREFY_LOGO_URL || value === STOREFY_LOGO_URL) return '';
  return value;
}

function isColorDark(hex: string): boolean {
  if (!hex || hex.startsWith('var')) return true;
  const rgb = hex.replace('#', '');
  if (rgb.length < 6) return true;
  const r = parseInt(rgb.substring(0, 2), 16);
  const g = parseInt(rgb.substring(2, 4), 16);
  const b = parseInt(rgb.substring(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 150;
}

interface StorePreviewProps {
  storeConfig: StoreConfig;
  products: Product[];
  onBackToSaaS?: () => void;
}

export default function StorePreview({ storeConfig, products, onBackToSaaS }: StorePreviewProps) {
  const [activeCategory, setActiveCategory] = useState<MainCategory | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [brokenImageIds, setBrokenImageIds] = useState<Set<string>>(new Set());
  
  // Tabulated FAQ State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Cart State
  const [cart, setCart] = useState<Array<{ product: Product; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'details' | 'success'>('cart');
  
  // Checkout Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerContact, setCustomerContact] = useState('');

  // Added products
  const activeProducts = products.filter(p => p.addedToStore);
  const activeCategories = ['Todos', ...Array.from(new Set(activeProducts.map(p => p.category)))] as Array<MainCategory | 'Todos'>;

  // Filter storefront query
  const displayProducts = activeProducts.filter(p => {
    if (activeCategory !== 'Todos' && p.category !== activeCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.subcategory.toLowerCase().includes(q);
    }
    return true;
  });

  // Unique subcategories inside active products list
  const activeSubcategories = Array.from(new Set(activeProducts.map(p => p.subcategory)));

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
    setCheckoutStep('cart');
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const nextQ = item.quantity + delta;
        return nextQ > 0 ? { ...item, quantity: nextQ } : null;
      }
      return item;
    }).filter(Boolean) as any);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleProductImageError = (event: React.SyntheticEvent<HTMLImageElement>, product: Product) => {
    if (product.category === 'Achados Fisicos') {
      setBrokenImageIds(prev => new Set(prev).add(product.id));
      return;
    }

    const fallback = product.fallbackImageUrl || productFallbackImage(product);
    if (event.currentTarget.src !== fallback) {
      event.currentTarget.src = fallback;
      return;
    }

    setBrokenImageIds(prev => new Set(prev).add(product.id));
  };

  // Calculations
  const cartTotalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalPrice = cart.reduce((acc, item) => acc + (item.product.salePrice * item.quantity), 0);
  const hasPhysicalCartItem = cart.some(item => item.product.category === 'Achados Fisicos');

  // Mapped hex lighter color for gradients
  const primaryColorHex = storeConfig.primaryColor;

  // Generate WhatsApp Message
  const getWhatsAppMessageLink = () => {
    let itemsStr = cart.map(item => `- *${item.product.name}* (Qtd: ${item.quantity}) - R$ ${(item.product.salePrice * item.quantity).toFixed(2)}`).join('%0A');
    let buyerStr = `%0A%0A*Dados do Comprador:*%0AðŸ‘¤ Nome: ${customerName}%0AðŸ“± Contato: ${customerContact}`;
    let totalStr = `%0A%0AðŸ’µ *Preço Total:* R$ ${cartTotalPrice.toFixed(2)}`;
    let deliveryStr = hasPhysicalCartItem ? `%0A%0A*Entrega:* ate 15 dias uteis apos a confirmacao do pedido.` : '';
    let footerStr = `%0A%0A_Enviado via Vitrine Storefy_ ⚡`;
    
    const text = `${storeConfig.welcomeMessage}%0A%0A${itemsStr}${buyerStr}${totalStr}${deliveryStr}${footerStr}`;
    return `https://api.whatsapp.com/send?phone=${storeConfig.whatsapp}&text=${text}`;
  };

  // Launch simulated check
  const handleSimulateCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerName.trim() === '' || customerContact.trim() === '') return;
    setCheckoutStep('success');
  };

  const defaultFaqs = storeConfig.faq || [
    { question: 'Como recebo meu produto apos o pagamento?', answer: 'A entrega e combinada pelo atendimento assim que confirmamos o pagamento.' },
    { question: 'Os Gift Cards possuem prazo de validade?', answer: 'Não. Os códigos de ativação PIN fornecidos são válidos por tempo indeterminado até que sejam devidamente resgatados na plataforma desejada (Steam, Roblox, Free fire, etc).' },
    { question: 'Quais métodos de pagamento são aceitos no WhatsApp?', answer: 'Aceitamos preferencialmente PIX para liberação automatizada imediata, mas também aceitamos links de cartão de crédito.' }
  ];

  return (
    <div className="space-y-6 animate-fade-in relative min-h-screen bg-transparent pb-16">
      {/* Top Simulator Control Bar */}
      {onBackToSaaS && (
        <div className="flex flex-wrap items-center justify-between p-4 bg-gray-100 border border-gray-200 text-gray-900 rounded-xl shadow-lg gap-4 select-none backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToSaaS}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar ao SaaS</span>
            </button>
            <div className="w-[1px] h-6 bg-white/10" />
            <div className="text-left">
              <p className="text-xs text-gray-500 font-sans">Modo de Visualização da Vitrine</p>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                {storeConfig.name} 
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-sans">
                  ATIVO NO WHATSAPP
                </span>
              </p>
            </div>
          </div>

          {/* Toggle Device Container to highlight desktop vs mobile responsive feel */}
          <div className="p-1 bg-gray-200 rounded-xl inline-flex gap-1 border border-gray-100">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                deviceMode === 'desktop' ? 'bg-white text-black shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                deviceMode === 'mobile' ? 'bg-white text-black shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Simulator</span>
            </button>
          </div>
        </div>
      )}

      {/* RENDER BODY WITH SELECTED DEVICE WRAPPER */}
      <div className={`mx-auto transition-all duration-300 ${
        deviceMode === 'mobile' ? 'max-w-[430px] border-[12px] border-neutral-900 rounded-[50px] shadow-2xl overflow-hidden bg-[#050508] h-[830px] overflow-y-auto relative' : 'w-full'
      }`}>
        <div className="bg-[#050508] text-gray-700 font-sans min-h-screen text-left">
          {/* Store Navbar */}
          <header className="sticky top-0 z-30 bg-[#07070a]/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-900 font-bold font-sans text-base shadow-sm shrink-0 select-none overflow-hidden"
                style={{ backgroundColor: primaryColorHex }}
              >
                {normalizeStoreLogoUrl(storeConfig.logoUrl) ? (
                  <img src={normalizeStoreLogoUrl(storeConfig.logoUrl)} alt={storeConfig.name} className="h-5 w-auto max-w-[92px] object-contain drop-shadow" referrerPolicy="no-referrer" />
                ) : (
                  storeConfig.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="font-sans font-bold text-base text-gray-900 tracking-tight truncate max-w-40">{storeConfig.name}</span><span className={`hidden rounded-full px-2 py-1 text-[9px] font-black sm:inline-flex ${storeConfig.ownerLevel === 10 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>{storeConfig.ownerLevel === 10 ? <><span aria-hidden>&#128293;</span>&nbsp;SOCIO NIVEL 10</> : <><span aria-hidden>&#128100;</span>&nbsp;NIVEL 1</>}</span>
            </div>

            {/* Float cart indicator */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-white/[0.1] text-gray-900 border border-gray-200 transition-all active:scale-95 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
                {cartTotalItemCount > 0 && (
                  <span 
                    className={`absolute -top-1.5 -right-1.5 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-black ${
                      isColorDark(primaryColorHex) ? 'text-gray-900' : 'text-black'
                    }`}
                    style={{ backgroundColor: primaryColorHex }}
                  >
                    {cartTotalItemCount}
                  </span>
                )}
              </div>
            </div>
          </header>

          {/* STRONG HERO */}
          <div className="relative overflow-hidden py-16 px-6 text-center select-none bg-gradient-to-br from-[#0c0c16] via-[#040408] to-brand-500/10 text-gray-900 border-b border-gray-100">
            {/* Ambient liquid glass lights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px]" style={{ backgroundColor: `${primaryColorHex}15` }} />
            
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <span 
                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest font-sans inline-block text-gray-900 border border-gray-300 bg-white/5"
              >
                ðŸ”¥ PRODUTOS DIGITAIS OFICIAIS
              </span>
              <h1 className="text-3xl md:text-4xl font-sans font-medium tracking-tight text-gray-900 leading-tight">
                Adquira chaves digitais e gift cards de forma confiável e pague via <span className="font-bold underline text-emerald-400">PIX</span>
              </h1>
              <p className="text-gray-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                Escolha o plano ou recarga, adicione ao carrinho e resgate seu código instantaneamente no WhatsApp após o pagamento!
              </p>

              {/* Float mini feature badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs font-semibold text-gray-800">
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-50 border border-gray-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Garantia Anti-Bloqueio
                </span>
                <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-50 border border-gray-200">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Entrega Instantanea
                </span>
              </div>
            </div>
          </div>

          {/* CATALOG MAIN CONTENT AREA */}
          <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Popular categories filter */}
              <div className="flex flex-wrap gap-2 select-none">
                {activeCategories.map((cat) => {
                  const isAct = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
                        isAct 
                          ? `${isColorDark(primaryColorHex) ? 'text-gray-900' : 'text-black'} shadow-sm font-bold` 
                          : 'bg-gray-100 text-gray-800 hover:bg-white/[0.1] border border-gray-100'
                      }`}
                      style={{ backgroundColor: isAct ? primaryColorHex : undefined }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Simple Search */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Buscar na vitrine..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-100 text-xs text-gray-900 placeholder-slate-500 focus:outline-none focus:border-brand-500 font-sans"
                />
                <span className="absolute left-3 inset-y-0 flex items-center text-gray-500">
                  <ShoppingBag className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Cards Grid */}
            {activeProducts.length === 0 ? (
              <div className="storefy-panel p-12 text-center rounded-xl space-y-3">
                <p className="text-gray-500 text-sm">Este e-commerce digital ainda está vazio.</p>
                <p className="text-xs text-gray-500">Adicione produtos pelo painel do SaaS Storefy para visualizá-los aqui.</p>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="storefy-panel p-12 text-center rounded-xl">
                <p className="text-gray-500 text-sm">Nenhum produto correspondente nesta categoria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {displayProducts.map((p) => (
                  <div 
                    key={p.id}
                    className="storefy-card rounded-xl overflow-hidden flex flex-col justify-between group backdrop-blur-xl"
                  >
                    {/* Header Image */}
                    <div className="storefy-image-frame relative h-44 overflow-hidden select-none">
                      {p.imageUrl && !brokenImageIds.has(p.id) ? (
                        <img 
                          src={p.imageUrl} 
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          onError={(event) => handleProductImageError(event, p)}
                          className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                            p.category === 'Achados Fisicos'
                              ? 'object-cover'
                              : 'object-contain p-7 bg-gray-100'
                          }`}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                          <ShoppingBag className="w-8 h-8 mb-1.5 opacity-40" />
                          <span className="text-[10px] uppercase font-bold tracking-widest font-sans">sem imagem cadastrada</span>
                        </div>
                      )}
                      
                      <span className="storefy-badge storefy-badge-muted absolute bottom-3 left-3 backdrop-blur-sm">
                        {p.subcategory}
                      </span>
                    </div>

                    {/* Card Info Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-gray-500 font-sans tracking-widest flex items-center justify-between">
                          <span>ENTREGA IMEDIATA</span>
                          <span className="text-slate-500">{p.deliverable}</span>
                        </p>
                        <h3 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 h-8 group-hover:text-brand-500 transition-colors">
                          {p.name}
                        </h3>
                      </div>

                      {/* Benefits preview ticks */}
                      <ul className="space-y-1 text-[11px] text-gray-800 bg-gray-50 border border-gray-200 rounded-xl p-2.5">
                        {p.benefits.slice(0, 2).map((b, bIdx) => (
                          <li key={bIdx} className="flex items-center gap-1 text-gray-800">
                            <span className="h-1 w-1 bg-brand-500 rounded-full shrink-0" />
                            <span className="truncate">{b}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Purchase interaction drawer */}
                      <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                        <div>
                          <p className="text-[9px] font-sans font-bold text-gray-500 uppercase tracking-widest">Valor Único</p>
                          <p className="text-sm font-extrabold text-gray-900 font-sans">
                            R$ {p.salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        <button
                          onClick={() => handleAddToCart(p)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-1 cursor-pointer ${
                            isColorDark(primaryColorHex) ? 'text-gray-900' : 'text-black'
                          }`}
                          style={{ backgroundColor: primaryColorHex }}
                        >
                          <Plus className="w-3.5 h-3.5 shrink-0" />
                          <span>Comprar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CUSTOMIZED Accordion FAQ section */}
            <div className="max-w-3xl mx-auto pt-16 space-y-6">
              <div className="text-center space-y-1">
                <HelpCircle className="w-8 h-8 mx-auto" style={{ color: primaryColorHex }} />
                <h3 className="text-lg font-sans font-semibold text-gray-900">Perguntas Frequentes (FAQ)</h3>
                <p className="text-xs text-gray-500">Tire todas as suas dúvidas sobre o resgate imediato via chat</p>
              </div>

              <div className="space-y-3.5 select-none">
                {defaultFaqs.map((faq, fIdx) => {
                  const isOpen = openFaqIndex === fIdx;
                  return (
                    <div 
                      key={fIdx} 
                      className="storefy-panel rounded-xl overflow-hidden transition-all hover:border-brand-500/20"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                        className="w-full p-4 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                      >
                        <span className="text-xs font-bold text-gray-900">{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 border-t border-gray-100 pt-3 text-xs text-gray-800 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </main>

          {/* CLIENT SHOP FOOTER */}
          <footer className="border-t border-gray-100 bg-[#040406] py-10 px-6 mt-16 text-center text-gray-500 text-xs font-medium space-y-3">
            <p className="font-semibold text-gray-800">© 2026 {storeConfig.name}. Todos os direitos reservados.</p>
            <p className="text-[10px] text-gray-500 font-sans">Plataforma E-commerce integrada via WhatsApp.</p>
            <div className="inline-flex items-center gap-1 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full text-[10px] text-brand-200 font-semibold font-sans">
              <Sparkles className="w-3 h-3 text-brand-500" />
              Powered by Storefy SaaS
            </div>
          </footer>

          {/* DYNAMIC CART SLIDE DRAWER OVERLAY */}
          {isCartOpen && (
            <div className="fixed inset-0 bg-[#030303]/80 backdrop-blur-sm z-50 flex justify-end">
              <div className="w-full max-w-md bg-[#08080c] h-full shadow-2xl flex flex-col justify-between overflow-hidden relative border-l border-gray-200">
                {/* Header item */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-gray-900" />
                    <span className="font-sans font-bold text-base text-gray-900">Carrinho de Pedidos</span>
                    <span className="text-[11px] font-sans px-2 py-0.5 rounded-full bg-gray-50 text-gray-800 border border-gray-200">
                      {cartTotalItemCount}
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-full hover:bg-gray-50 text-gray-500 hover:text-gray-900 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart steps rendering */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* STEP A: ITEM LIST */}
                  {checkoutStep === 'cart' && (
                    <>
                      {cart.length === 0 ? (
                        <div className="p-12 text-center space-y-4">
                          <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto" />
                          <p className="text-gray-500 text-sm">Seu carrinho está vazio.</p>
                          <button
                            onClick={() => setIsCartOpen(false)}
                            className="text-xs font-bold text-brand-500 underline cursor-pointer"
                          >
                            Voltar a explorar vitrine
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div key={item.product.id} className="flex items-center justify-between gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50">
                              {item.product.imageUrl && !brokenImageIds.has(item.product.id) ? (
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.name}
                                  referrerPolicy="no-referrer"
                                  onError={(event) => handleProductImageError(event, item.product)}
                                  className={`w-11 h-11 rounded-lg bg-gray-50 shrink-0 border border-gray-200 ${
                                    item.product.category === 'Achados Fisicos' ? 'object-cover' : 'object-contain p-1.5'
                                  }`}
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-lg bg-gray-50 shrink-0 border border-gray-200" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-gray-900 truncate">{item.product.name}</p>
                                <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                                  R$ {item.product.salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} un
                                </p>
                              </div>

                              <div className="flex items-center gap-2.5 bg-[#0e0e15] border border-gray-200 rounded-lg p-1.5">
                                <button
                                  onClick={() => handleUpdateCartQuantity(item.product.id, -1)}
                                  className="text-gray-500 hover:text-gray-900 cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="text-xs font-bold font-sans text-gray-900 w-4 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => handleUpdateCartQuantity(item.product.id, 1)}
                                  className="text-gray-500 hover:text-gray-900 cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <button
                                onClick={() => handleRemoveFromCart(item.product.id)}
                                className="text-gray-500 hover:text-rose-400 p-1 rounded-lg cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 shrink-0" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* STEP B: BUYER DETAILS FORM */}
                  {checkoutStep === 'details' && (
                    <form onSubmit={handleSimulateCheckout} className="space-y-5 text-left">
                      <div className="text-center space-y-1 pb-4">
                        <Smartphone className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                        <h4 className="text-sm font-bold text-gray-900">Finalizar pedido pelo WhatsApp</h4>
                        <p className="text-xs text-gray-500">Insira seus dados para formularmos os detalhes do seu PIX/Entrega</p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-sans">Seu Nome Completo</label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="Ex. Gabriel Almeida"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e15] border border-gray-200 text-gray-900 placeholder-slate-600 text-xs focus:outline-none focus:border-brand-500 font-sans"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-sans">Seu Whats/E-mail para suporte</label>
                        <input
                          type="text"
                          required
                          value={customerContact}
                          onChange={(e) => setCustomerContact(e.target.value)}
                          placeholder="Ex. (11) 99999-5555"
                          className="w-full px-4 py-2.5 rounded-xl bg-[#0e0e15] border border-gray-200 text-gray-900 placeholder-slate-600 text-xs focus:outline-none focus:border-brand-500 font-sans"
                        />
                      </div>

                      <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1 text-gray-500 text-[11px] leading-relaxed">
                        <span className="font-bold text-gray-800">ðŸ”’ Privacidade Garantida:</span>
                        <p>Nenhum dado é compartilhado publicamente. Seus dados chegam formatados de forma direta e segura no WhatsApp comercial do vendedor.</p>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-white hover:bg-slate-200 text-black rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <span>Confirmar e Formular WhatsApp</span>
                        <Check className="w-4.5 h-4.5 text-emerald-500 stroke-[3px]" />
                      </button>
                    </form>
                  )}

                  {/* STEP C: SIMULATED SUCCESS INFO OVERLAY */}
                  {checkoutStep === 'success' && (
                    <div className="text-center space-y-5 py-6">
                      <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm border border-emerald-500/20">
                        <Check className="w-8 h-8 stroke-[3.5px]" />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-base font-bold text-gray-900">Pedido Formulado com Sucesso!</h4>
                        <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                          Para faturar a comissão, clique no link oficial abaixo para simular o redirecionamento com mensagens prontas para compras via WhatsApp.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0e0e15] border border-gray-100 text-[11px] text-gray-800 space-y-1.5 text-left font-sans">
                        <p><strong>Destino Whats:</strong> {storeConfig.whatsapp}</p>
                        <p><strong>Mensagem Enviada:</strong></p>
                        <textarea 
                          rows={4} 
                          readOnly 
                          value={decodeURIComponent(getWhatsAppMessageLink().split('&text=')[1] || '')} 
                          className="w-full p-2 text-[10px] bg-[#0c0c14] border border-gray-100 rounded text-gray-800 focus:outline-none select-all"
                        />
                      </div>

                      <a
                        href={getWhatsAppMessageLink()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-gray-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/20 transition-all font-sans"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Abrir WhatsApp Exemplo</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer and calculations */}
                {checkoutStep === 'cart' && cart.length > 0 && (
                  <div className="p-6 border-t border-gray-100 bg-white space-y-4">
                    {hasPhysicalCartItem && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-left text-[11px] leading-relaxed text-amber-900">
                        <p className="font-black uppercase tracking-wider">Entrega dropshipping</p>
                        <p>Produtos fisicos chegam em ate 15 dias uteis apos a confirmacao do pedido.</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-gray-800">
                      <p className="text-xs font-semibold">Subtotal:</p>
                      <p className="text-sm font-extrabold text-gray-900 font-sans">
                        R$ {cartTotalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>

                    <button
                      onClick={() => setCheckoutStep('details')}
                      className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-opacity-95 transition-all text-center cursor-pointer ${
                        isColorDark(primaryColorHex) ? 'text-gray-900' : 'text-black'
                      }`}
                      style={{ backgroundColor: primaryColorHex }}
                    >
                      <MessageSquare className={`w-4 h-4 shrink-0 ${
                        isColorDark(primaryColorHex) ? 'text-gray-900' : 'text-black'
                      }`} />
                      <span>Comprar via WhatsApp</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


