import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  Check, 
  Plus, 
  Trash2, 
  DollarSign, 
  Edit3, 
  Link as LinkIcon, 
  Upload, 
  Tag, 
  Users, 
  CheckCircle,
  HelpCircle,
  TrendingDown,
  Percent,
  X,
  FileImage,
  ExternalLink
} from 'lucide-react';
import { Product, MainCategory, Supplier } from '../types';
import { productFallbackImage } from '../productImages';

interface ProductCatalogProps {
  products: Product[];
  suppliers: Supplier[];
  onToggleAddProduct: (productId: string) => void;
  onUpdateSalePrice: (productId: string, newPrice: number) => void;
  onUpdateProductImage: (productId: string, newUrl: string) => void;
}

export default function ProductCatalog({ 
  products, 
  suppliers, 
  onToggleAddProduct, 
  onUpdateSalePrice, 
  onUpdateProductImage 
}: ProductCatalogProps) {
  // Filters state
  const [activeTab, setActiveTab] = useState<MainCategory | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'added' | 'not-added'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'margin' | 'price'>('name');

  // Edit states
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPriceString, setTempPriceString] = useState('');

  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [simulatedFileUploading, setSimulatedFileUploading] = useState(false);
  const [brokenImageIds, setBrokenImageIds] = useState<Set<string>>(new Set());

  // Filter products logic
  const filteredProducts = products.filter(product => {
    // Tab category filter
    if (activeTab !== 'Todos' && product.category !== activeTab) return false;
    
    // Search query filter (name, subcategory, benefits)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(q);
      const matchesSub = product.subcategory.toLowerCase().includes(q);
      const matchesSupplier = product.supplier.toLowerCase().includes(q);
      if (!matchesName && !matchesSub && !matchesSupplier) return false;
    }

    // Supplier filter
    if (selectedSupplier !== 'all' && product.supplier !== selectedSupplier) return false;

    // Status filter
    if (selectedStatus === 'added' && !product.addedToStore) return false;
    if (selectedStatus === 'not-added' && product.addedToStore) return false;

    return true;
  });

  // Group by subcategory
  const subcategoriesMap: { [key: string]: Product[] } = {};
  filteredProducts.forEach(product => {
    if (!subcategoriesMap[product.subcategory]) {
      subcategoriesMap[product.subcategory] = [];
    }
    subcategoriesMap[product.subcategory].push(product);
  });

  // Sort subcategories and their products
  const sortedSubcategories = Object.keys(subcategoriesMap).sort();

  // Handle price commit
  const handleSavePrice = (productId: string) => {
    const val = parseFloat(tempPriceString.replace(',', '.'));
    if (!isNaN(val) && val >= 0) {
      onUpdateSalePrice(productId, val);
    }
    setEditingPriceId(null);
  };

  // Handle manual image url input
  const handleSaveImageUrl = (productId: string) => {
    if (tempImageUrl.trim() !== '') {
      onUpdateProductImage(productId, tempImageUrl);
    }
    setEditingImageId(null);
  };

  const handleFileUpload = (productId: string, file?: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSimulatedFileUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpdateProductImage(productId, reader.result);
      }
      setSimulatedFileUploading(false);
      setEditingImageId(null);
    };
    reader.onerror = () => setSimulatedFileUploading(false);
    reader.readAsDataURL(file);
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

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-white tracking-tight">Catalogo de Produtos</h1>
          <p className="text-slate-400 text-sm mt-1">
            Escolha as melhores ofertas dos fornecedores, veja quanto voce paga e defina o valor de venda da sua vitrine.
          </p>
        </div>
        <div className="storefy-badge storefy-badge-success select-none">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{products.filter(p => p.addedToStore).length} produtos ativos na sua vitrine</span>
        </div>
      </div>

      {/* Main Filter Panel */}
      <div className="storefy-panel rounded-2xl p-5 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
              <Search className="w-4.5 h-4.5" />
            </span>
            <input
              type="text"
              placeholder="Pesquisar por produto, subcategoria ou fornecedor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-500/20 focus:border-brand-500 transition-all font-sans glass-premium-input"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Filter by Supplier */}
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1">
              <span className="text-[11px] font-bold text-slate-400 font-mono uppercase mr-1">Forn:</span>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="text-xs font-semibold text-slate-300 bg-transparent py-1 cursor-pointer focus:outline-none [&>option]:bg-neutral-950 [&>option]:text-white"
              >
                <option value="all">Todos Fornecedores</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-1">
              <span className="text-[11px] font-bold text-slate-400 font-mono uppercase mr-1">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="text-xs font-semibold text-slate-300 bg-transparent py-1 cursor-pointer focus:outline-none [&>option]:bg-neutral-950 [&>option]:text-white"
              >
                <option value="all">Todos os Status</option>
                <option value="added">Adicionados à Vitrine</option>
                <option value="not-added">Não Adicionados</option>
              </select>
            </div>

            {/* Reset Filters */}
            {(searchQuery || selectedSupplier !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSupplier('all');
                  setSelectedStatus('all');
                }}
                className="text-xs text-brand-500 hover:text-brand-400 font-semibold hover:underline cursor-pointer"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Navigation */}
        <div className="border-t border-white/5 pt-4 flex flex-wrap gap-2">
          {(['Todos', 'Games', 'Redes Sociais', 'Assinaturas Digitais', 'Infoprodutos', 'Achados Fisicos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? 'storefy-primary-action font-bold shadow-sm'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.1] border border-white/5 hover:border-brand-500/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grouped Grid */}
      {sortedSubcategories.length === 0 ? (
        <div className="storefy-panel p-16 rounded-2xl border-dashed text-center space-y-3">
          <div className="w-12 h-12 bg-white/[0.05] rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Nenhum produto correspondente</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            Nossa busca nao localizou produtos com esses criterios. Tente redefinir seus filtros ou pesquisar termos diferentes.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {sortedSubcategories.map(subcategory => {
            const items = subcategoriesMap[subcategory];
            return (
              <div key={subcategory} className="space-y-4">
                {/* Subcategory Divider */}
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-display font-medium text-white whitespace-nowrap flex items-center gap-2">
                    <Tag className="w-4 h-4 text-brand-500" />
                    {subcategory}
                  </h2>
                  <div className="w-full h-[1px] bg-white/5" />
                  <span className="storefy-badge storefy-badge-muted whitespace-nowrap">
                    {items.length} {items.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                {/* Subcategory Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {items.map(product => {
                    // Margin calculations
                    const profitMargin = product.salePrice - product.costPrice;
                    const profitPercentNumber = product.costPrice > 0
                      ? Math.round((profitMargin / product.costPrice) * 100)
                      : 0;
                    const profitPercentage = profitPercentNumber.toFixed(0);
                    const marginLabel = profitPercentNumber >= 100
                      ? 'Margem alta'
                      : profitPercentNumber >= 45
                      ? 'Boa margem'
                      : 'Margem segura';

                    return (
                      <div 
                        key={product.id}
                        className={`storefy-card rounded-2xl overflow-hidden flex flex-col justify-between group ${
                          product.addedToStore ? 'storefy-card-selected' : ''
                        }`}
                      >
                        {/* Upper image and status header */}
                        <div className="storefy-image-frame relative h-48 w-full overflow-hidden select-none">
                          {product.imageUrl && !brokenImageIds.has(product.id) ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              onError={(event) => handleProductImageError(event, product)}
                              className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                                product.category === 'Achados Fisicos'
                                  ? 'object-cover'
                                  : 'object-contain p-8 bg-black/30'
                              }`}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-white/[0.03]">
                              <FileImage className="w-8 h-8 mb-1.5 opacity-60" />
                              <span className="text-[11px] font-semibold tracking-wider uppercase font-mono">sem imagem cadastrada</span>
                            </div>
                          )}

                          {/* Category and Deliverable Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                            <span className="storefy-badge storefy-badge-muted backdrop-blur-sm">
                              {product.subcategory}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none">
                            {product.addedToStore && (
                              <span className="storefy-badge storefy-badge-success">Selecionado</span>
                            )}
                            <span className="storefy-badge storefy-badge-brand">{marginLabel}</span>
                          </div>

                          {/* Image Switcher Floating Button */}
                          <button
                            onClick={() => {
                              setTempImageUrl(product.imageUrl);
                              setEditingImageId(product.id);
                            }}
                            className="absolute bottom-3 right-3 p-2 bg-black/70 text-white hover:bg-brand-500 hover:text-black rounded-xl shadow-sm border border-white/10 transition-all active:scale-95 cursor-pointer backdrop-blur-md"
                            title="Trocar Imagem"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Added state tint */}
                          {product.addedToStore && (
                            <div className="absolute inset-0 bg-brand-500/[0.06] pointer-events-none" />
                          )}
                        </div>

                        {/* Card Info Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                              <span className="flex items-center gap-1 font-semibold truncate hover:text-white">
                                <Users className="w-3 h-3 text-slate-500" />
                                {product.supplier}
                              </span>
                              <span className="text-slate-400 font-medium">
                                {product.deliverable}
                              </span>
                            </div>

                            <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug group-hover:text-brand-500 transition-colors">
                              {product.name}
                            </h3>
                          </div>

                          {/* Benefits Bullets */}
                          <div className="space-y-1.5 p-3 rounded-xl bg-black/20 border border-white/10">
                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">Vantagens & Beneficios</p>
                            <ul className="space-y-1">
                              {product.benefits.slice(0, 3).map((benefit, bIdx) => (
                                <li key={bIdx} className="text-xs text-slate-300 flex items-center gap-1.5">
                                  <div className="w-1 h-1 rounded-full bg-brand-500 shrink-0" />
                                  <span className="truncate">{benefit}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Price & Margin Matrix */}
                          <div className="rounded-2xl bg-black/30 border border-white/10 overflow-hidden shadow-inner">
                            <div className="grid grid-cols-2 divide-x divide-white/10">
                              <div className="p-3">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Voce paga</p>
                                <p className="text-base font-black text-slate-200 mt-1">
                                  R$ {product.costPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-[10px] text-slate-500 mt-0.5">custo fornecedor</p>
                              </div>

                              <div className="p-3 bg-brand-500/5">
                                <p className="text-[10px] text-brand-500 uppercase tracking-widest font-mono flex items-center gap-1">
                                  Voce vende
                                  <Edit3 className="w-2.5 h-2.5" />
                                </p>
                                {editingPriceId === product.id ? (
                                  <div className="flex items-center gap-1 mt-1">
                                    <span className="text-sm font-black text-white">R$</span>
                                    <input
                                      type="text"
                                      value={tempPriceString}
                                      onChange={(e) => setTempPriceString(e.target.value)}
                                      className="w-24 px-2 py-1.5 bg-[#0f0f15] border border-brand-500 rounded-lg text-sm font-black text-white focus:outline-none"
                                      autoFocus
                                      onBlur={() => handleSavePrice(product.id)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSavePrice(product.id);
                                        if (e.key === 'Escape') setEditingPriceId(null);
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setTempPriceString(product.salePrice.toFixed(2));
                                      setEditingPriceId(product.id);
                                    }}
                                    className="text-base font-black text-white hover:text-brand-500 flex items-center gap-1 mt-1 text-left transition-colors cursor-pointer"
                                    title="Clique para alterar o valor de venda"
                                  >
                                    R$ {product.salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    <Edit3 className="w-3 h-3 opacity-70" />
                                  </button>
                                )}
                                <p className="text-[10px] text-slate-500 mt-0.5">preco da sua loja</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 px-3 py-2 border-t border-white/10 bg-emerald-500/5">
                              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Lucro estimado</span>
                              <span className="font-black text-emerald-400 flex items-center gap-1 font-mono text-xs">
                                <Percent className="w-3.5 h-3.5" />
                                R$ {profitMargin.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({profitPercentage}%)
                              </span>
                            </div>
                          </div>

                          {product.sourceUrl && (
                            <a
                              href={product.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-300 border border-white/10 bg-white/[0.04] text-slate-200 hover:border-brand-500/40 hover:bg-brand-500/10 active:scale-[0.98]"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Abrir link do fornecedor</span>
                            </a>
                          )}

                          {/* Switch toggle action */}
                          <button
                            onClick={() => onToggleAddProduct(product.id)}
                            className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all duration-300 border active:scale-[0.98] cursor-pointer ${
                              product.addedToStore
                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300'
                                : 'storefy-primary-action border-transparent font-black'
                            }`}
                          >
                            {product.addedToStore ? (
                              <>
                                <Trash2 className="w-4 h-4" />
                                <span>Remover da Minha Vitrine</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                <span>Adicionar a Minha Vitrine</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Modal for Editing Product Image */}
      {editingImageId && (
        <div className="fixed inset-0 bg-[#030303]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#08080c] rounded-3xl shadow-2xl border border-white/10 overflow-hidden transform transition-all p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-semibold text-white">Customizar Imagem do Produto</h3>
              <button 
                onClick={() => setEditingImageId(null)}
                className="p-1 rounded-full hover:bg-white/[0.05] text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Você pode enviar uma foto real do produto ou colocar a URL de uma marca para adequar perfeitamente a identidade da sua loja digital.
            </p>

            {/* Simulated file upload */}
            <div className="space-y-4 text-center">
              <div className="border border-dashed border-white/10 hover:border-brand-500 hover:bg-white/[0.02] rounded-2xl p-6 transition-all">
                <input 
                  type="file" 
                  id="modal-file-upload" 
                  className="hidden" 
                  onChange={(event) => handleFileUpload(editingImageId, event.target.files?.[0])}
                  disabled={simulatedFileUploading}
                />
                <label htmlFor="modal-file-upload" className="cursor-pointer space-y-2 block">
                  <div className="w-10 h-10 rounded-full bg-white/[0.05] text-slate-300 border border-white/10 flex items-center justify-center mx-auto">
                    {simulatedFileUploading ? (
                      <span className="w-5 h-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">Arraste ou Clique para enviar do PC</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Compatível com PNG, JPG ou WEBP</p>
                  </div>
                </label>
              </div>

              {/* URL input */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider block">Colar URL da imagem alternativamente</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                    <LinkIcon className="w-3.5 h-3.5" />
                  </span>
                  <input
                    type="text"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    placeholder="https://exemplo.com/imagem-produto.png"
                    className="w-full pl-9 pr-4 py-2 text-xs bg-[#0a0a0f] border border-white/10 text-white placeholder-slate-600 rounded-xl focus:outline-none focus:border-brand-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setEditingImageId(null)}
                className="flex-1 py-2 text-xs font-semibold text-slate-400 hover:text-white border border-white/10 hover:bg-white/[0.05] rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSaveImageUrl(editingImageId)}
                className="flex-1 py-2 text-xs font-semibold text-black bg-white hover:bg-slate-200 rounded-xl transition-all shadow cursor-pointer"
              >
                Salvar URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
