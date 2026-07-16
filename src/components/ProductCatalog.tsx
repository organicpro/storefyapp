import React, { useState } from 'react';
import { 
  Search, 
  Check, 
  Plus, 
  Trash2, 
  Edit3, 
  Link as LinkIcon, 
  Upload, 
  Tag, 
  Users, 
  CheckCircle,
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
    <div className="space-y-6 animate-fade-in text-left max-w-[1400px] mx-auto py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Catálogo de Produtos</h1>
          <p className="text-[14px] text-gray-500 mt-1 leading-relaxed">
            Escolha as melhores ofertas dos fornecedores, veja quanto você paga e defina o valor de venda da sua vitrine.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg select-none whitespace-nowrap shadow-sm">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span className="text-[13px] font-bold text-emerald-800">{products.filter(p => p.addedToStore).length} ativos na vitrine</span>
        </div>
      </div>

      {/* Main Filter Panel */}
      <div className="sticky top-2 z-40 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-sm rounded-xl p-5 space-y-4 transition-all">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Pesquisar por produto, categoria ou fornecedor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Filter by Supplier */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm transition-all focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-200">
              <span className="text-[12px] font-bold text-gray-500 whitespace-nowrap">Fornecedor:</span>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="text-[13px] font-medium text-gray-900 bg-transparent cursor-pointer focus:outline-none w-full appearance-none outline-none"
              >
                <option value="all">Todos</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm transition-all focus-within:border-gray-400 focus-within:ring-1 focus-within:ring-gray-200">
              <span className="text-[12px] font-bold text-gray-500 whitespace-nowrap">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="text-[13px] font-medium text-gray-900 bg-transparent cursor-pointer focus:outline-none w-full appearance-none outline-none"
              >
                <option value="all">Todos</option>
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
                className="text-[13px] text-[#0f172a] hover:text-black font-semibold hover:underline cursor-pointer px-2"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Navigation */}
        <div className="border-t border-gray-100 pt-4 flex flex-wrap gap-2">
          {(['Todos', 'Games', 'Redes Sociais', 'Assinaturas Digitais', 'Infoprodutos', 'Achados Fisicos'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#0f172a] text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Catalog Grouped Grid */}
      {sortedSubcategories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center space-y-3">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-500 border border-gray-200">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-[15px] font-bold text-gray-900">Nenhum produto correspondente</h3>
          <p className="text-[13px] text-gray-500 max-w-sm mx-auto leading-relaxed">
            Nossa busca não localizou produtos com esses critérios. Tente redefinir seus filtros ou pesquisar termos diferentes.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {sortedSubcategories.map(subcategory => {
            const items = subcategoriesMap[subcategory];
            return (
              <div key={subcategory} className="space-y-4">
                {/* Subcategory Divider */}
                <div className="flex items-center gap-4">
                  <h2 className="text-[16px] font-bold text-gray-900 whitespace-nowrap flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    {subcategory}
                  </h2>
                  <div className="w-full h-[1px] bg-gray-200" />
                  <span className="text-[12px] font-semibold text-gray-500 whitespace-nowrap">
                    {items.length} {items.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                {/* Subcategory Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                      
                    const marginColors = profitPercentNumber >= 100
                      ? 'bg-[#0f172a] text-white border-[#0f172a]'
                      : 'bg-gray-100 text-gray-700 border-gray-200';

                    return (
                      <div 
                        key={product.id}
                        className={`bg-white rounded-xl border transition-all duration-300 flex flex-col justify-between group relative ${
                          product.addedToStore ? 'border-[#0f172a] shadow-md ring-1 ring-[#0f172a]' : 'border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md'
                        }`}
                      >
                        {/* Upper image and status header */}
                        <div className="relative h-48 w-full overflow-hidden select-none bg-gray-50 rounded-t-xl border-b border-gray-100">
                          {product.imageUrl && !brokenImageIds.has(product.id) ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              onError={(event) => handleProductImageError(event, product)}
                              className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                                product.category === 'Achados Fisicos'
                                  ? 'object-cover'
                                  : 'object-contain p-6'
                              }`}
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                              <FileImage className="w-8 h-8 mb-2 opacity-60" />
                              <span className="text-[11px] font-bold uppercase tracking-wider">sem imagem</span>
                            </div>
                          )}

                          {/* Category and Deliverable Badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 pointer-events-none">
                            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-[11px] font-bold px-2 py-1 rounded shadow-sm border border-gray-200">
                              {product.subcategory}
                            </span>
                          </div>

                          <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-none">
                            {product.addedToStore && (
                              <span className="bg-[#0f172a] text-white px-2 py-1 rounded text-[11px] font-bold shadow-sm uppercase tracking-wider">
                                Ativo na Vitrine
                              </span>
                            )}
                            <span className={`${marginColors} border px-2 py-1 rounded text-[11px] font-bold shadow-sm`}>
                              {marginLabel}
                            </span>
                          </div>

                          {/* Image Switcher Floating Button */}
                          <button
                            onClick={() => {
                              setTempImageUrl(product.imageUrl);
                              setEditingImageId(product.id);
                            }}
                            className="absolute bottom-3 right-3 p-2 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg shadow-sm border border-gray-200 transition-all active:scale-95 cursor-pointer backdrop-blur-sm opacity-0 group-hover:opacity-100"
                            title="Trocar Imagem"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Added state tint */}
                          {product.addedToStore && (
                            <div className="absolute inset-0 bg-[#0f172a]/[0.02] pointer-events-none" />
                          )}
                        </div>

                        {/* Card Info Body */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[12px] font-medium text-gray-500">
                              <span className="flex items-center gap-1.5 truncate">
                                <Users className="w-3.5 h-3.5" />
                                {product.supplier}
                              </span>
                              <span className="shrink-0 bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-semibold text-[11px]">
                                {product.deliverable}
                              </span>
                            </div>

                            <h3 className="text-[15px] font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-black transition-colors">
                              {product.name}
                            </h3>
                          </div>

                          {/* Benefits */}
                          {product.benefits.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-[12px] font-bold text-gray-900">Vantagens & Benefícios</p>
                              <ul className="space-y-1.5">
                                {product.benefits.slice(0, 3).map((benefit, bIdx) => (
                                  <li key={bIdx} className="text-[12px] text-gray-600 flex items-center gap-2">
                                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    <span className="truncate">{benefit}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Price & Margin Matrix */}
                          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                            <div className="grid grid-cols-2 divide-x divide-gray-200">
                              <div className="p-3.5 bg-gray-50">
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Custo</p>
                                <p className="text-[15px] font-bold text-gray-900">
                                  R$ {product.costPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                              </div>

                              <div className="p-3.5 bg-white">
                                <p className="text-[11px] text-gray-900 font-bold uppercase tracking-wider flex items-center gap-1 mb-1">
                                  Venda
                                  <Edit3 className="w-3 h-3 text-gray-400" />
                                </p>
                                {editingPriceId === product.id ? (
                                  <div className="flex items-center gap-1">
                                    <span className="text-[15px] font-bold text-gray-900">R$</span>
                                    <input
                                      type="text"
                                      value={tempPriceString}
                                      onChange={(e) => setTempPriceString(e.target.value)}
                                      className="w-full max-w-[80px] px-1.5 py-0.5 bg-gray-50 border border-gray-300 rounded text-[15px] font-bold text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all"
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
                                    className="text-[15px] font-bold text-[#0f172a] hover:text-black flex items-center gap-1 text-left transition-colors cursor-pointer group/price"
                                    title="Clique para alterar o valor de venda"
                                  >
                                    R$ {product.salePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    <Edit3 className="w-3 h-3 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 border-t border-emerald-100 bg-emerald-50">
                              <span className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">Lucro</span>
                              <span className="font-bold text-emerald-700 flex items-center gap-1 text-[13px]">
                                <Percent className="w-3 h-3" />
                                R$ {profitMargin.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({profitPercentage}%)
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-2 pt-2">
                            {product.sourceUrl && (
                              <a
                                href={product.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-2.5 rounded-lg font-semibold text-[13px] flex items-center justify-center gap-2 transition-colors border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                                <span>Página do fornecedor</span>
                              </a>
                            )}

                            <button
                              onClick={() => onToggleAddProduct(product.id)}
                              className={`w-full py-2.5 rounded-lg font-semibold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                                product.addedToStore
                                  ? 'border border-rose-200 bg-white hover:bg-rose-50 text-rose-600'
                                  : 'bg-[#0f172a] hover:bg-[#1e293b] text-white border border-transparent'
                              }`}
                            >
                              {product.addedToStore ? (
                                <>
                                  <Trash2 className="w-4 h-4" />
                                  <span>Remover da Vitrine</span>
                                </>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4" />
                                  <span>Adicionar à Vitrine</span>
                                </>
                              )}
                            </button>
                          </div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-[18px] font-bold text-gray-900">Customizar Imagem</h3>
              <button 
                onClick={() => setEditingImageId(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-[13px] text-gray-500 leading-relaxed">
              Você pode enviar uma foto real do produto ou colar a URL de uma imagem para adequar perfeitamente a identidade da sua loja digital.
            </p>

            <div className="space-y-5 text-center">
              {/* File upload zone */}
              <div className="border border-dashed border-gray-300 hover:border-[#0f172a] hover:bg-gray-50 rounded-xl p-8 transition-colors">
                <input 
                  type="file" 
                  id="modal-file-upload" 
                  className="hidden" 
                  onChange={(event) => handleFileUpload(editingImageId, event.target.files?.[0])}
                  disabled={simulatedFileUploading}
                />
                <label htmlFor="modal-file-upload" className="cursor-pointer space-y-3 block">
                  <div className="w-12 h-12 rounded-full bg-white text-gray-700 border border-gray-200 shadow-sm flex items-center justify-center mx-auto">
                    {simulatedFileUploading ? (
                      <span className="w-5 h-5 rounded-full border-2 border-[#0f172a] border-t-transparent animate-spin" />
                    ) : (
                      <Upload className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900">Arraste ou clique para enviar</p>
                    <p className="text-[11px] text-gray-500 mt-1">Compatível com PNG, JPG ou WEBP</p>
                  </div>
                </label>
              </div>

              {/* URL input */}
              <div className="space-y-1.5 text-left">
                <label className="text-[13px] font-bold text-gray-900 block">Ou colar URL da imagem</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
                    <LinkIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={tempImageUrl}
                    onChange={(e) => setTempImageUrl(e.target.value)}
                    placeholder="https://exemplo.com/imagem-produto.png"
                    className="w-full pl-9 pr-3.5 py-2.5 text-[13px] bg-white border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setEditingImageId(null)}
                className="flex-1 py-2.5 text-[13px] font-semibold text-gray-700 hover:text-gray-900 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSaveImageUrl(editingImageId)}
                className="flex-1 py-2.5 text-[13px] font-semibold text-white bg-[#0f172a] hover:bg-[#1e293b] rounded-lg transition-colors shadow-sm cursor-pointer"
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


