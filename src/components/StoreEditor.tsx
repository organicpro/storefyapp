import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Palette, 
  ShoppingBag, 
  Layout, 
  Send,
  MessageSquare,
  Link as LinkIcon,
  Search,
  Check,
  Plus,
  Trash2,
  Camera
} from 'lucide-react';
import { StoreConfig, Product, Supplier } from '../types';

interface StoreEditorProps {
  storeConfig: StoreConfig;
  products: Product[];
  suppliers: Supplier[];
  onUpdateStoreConfig: (config: StoreConfig) => void;
  onToggleAddProduct: (productId: string) => void;
  onBack: () => void;
  onPublishStore: () => void;
}

export default function StoreEditor({
  storeConfig,
  products,
  suppliers,
  onUpdateStoreConfig,
  onToggleAddProduct,
  onBack,
  onPublishStore
}: StoreEditorProps) {
  const [activeTab, setActiveTab] = useState<'appearance' | 'products' | 'publish'>('appearance');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyAdded, setShowOnlyAdded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localConfig, setLocalConfig] = useState<StoreConfig>(storeConfig);
  const [localProductIds, setLocalProductIds] = useState<Set<string>>(
    new Set(storeConfig.productIds || products.filter(p => p.addedToStore).map(p => p.id))
  );

  const updateConfig = (updates: Partial<StoreConfig>) => {
    setLocalConfig(prev => ({ ...prev, ...updates }));
  };

  const handleToggleProduct = (productId: string) => {
    setLocalProductIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const handlePublish = () => {
    onUpdateStoreConfig({ ...localConfig, productIds: Array.from(localProductIds) });
    onPublishStore();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') {
        updateConfig({ logoUrl: ev.target.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const localProductsList = products.map(product => ({
    ...product,
    addedToStore: localProductIds.has(product.id)
  }));

  const filteredProducts = localProductsList.filter(product => {
    if (showOnlyAdded && !product.addedToStore) return false;
    
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(q);
      const matchesSub = product.subcategory.toLowerCase().includes(q);
      const matchesSupplier = product.supplier.toLowerCase().includes(q);
      if (!matchesName && !matchesSub && !matchesSupplier) return false;
    }
    return true;
  });

  return (
    <div className="max-w-[1200px] mx-auto py-8 font-sans animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-gray-900 shadow-sm transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Editar Loja: {localConfig.name}
            </h1>
            <p className="text-gray-500 mt-1 text-[13px]">
              Gerencie a aparência e os produtos da sua loja virtual.
            </p>
          </div>
        </div>
        
        <button
          onClick={handlePublish}
          className="px-5 py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-[13px] font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Publicar Atualizações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-bold transition-colors flex items-center gap-3 ${
              activeTab === 'appearance' ? 'bg-white border-gray-200 shadow-sm border text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Palette className={`w-4 h-4 ${activeTab === 'appearance' ? 'text-brand-500' : ''}`} />
            Aparência e Dados
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-bold transition-colors flex items-center gap-3 ${
              activeTab === 'products' ? 'bg-white border-gray-200 shadow-sm border text-gray-900' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${activeTab === 'products' ? 'text-brand-500' : ''}`} />
            Catálogo de Produtos
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {activeTab === 'appearance' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-8 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Informações Principais</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2 flex items-center gap-6 mb-2">
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-tr from-gray-700 to-gray-900 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-gray-100 select-none">
                        {localConfig.logoUrl
                          ? <img src={localConfig.logoUrl} alt="Logo da Loja" className="w-full h-full object-cover" />
                          : <span>{localConfig.name ? localConfig.name.charAt(0).toUpperCase() : 'S'}</span>
                        }
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0f172a] border-2 border-white flex items-center justify-center hover:bg-[#1e293b] transition-colors cursor-pointer"
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
                    <div>
                      <h4 className="text-[14px] font-bold text-gray-900">Foto de Perfil da Loja</h4>
                      <p className="text-[12px] text-gray-500 mt-0.5 max-w-sm">Esta imagem aparecerá como o logo ou foto de perfil da sua loja virtual.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-900">Nome da Loja</label>
                    <input
                      type="text"
                      value={localConfig.name}
                      onChange={(e) => updateConfig({ name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-900">Subdomínio</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 right-3 flex items-center text-[12px] text-gray-400 font-medium">.netlify</span>
                      <input
                        type="text"
                        value={localConfig.subdomain}
                        onChange={(e) => updateConfig({ subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                        className="w-full pl-3.5 pr-14 py-2.5 rounded-lg border border-gray-300 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-900 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4 text-emerald-500" />
                      Número de WhatsApp
                    </label>
                    <input
                      type="text"
                      value={localConfig.whatsapp}
                      onChange={(e) => updateConfig({ whatsapp: e.target.value })}
                      placeholder="Ex: 5511999999999"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all font-sans"
                    />
                    <p className="text-[11px] text-gray-500">Formato: DDI + DDD + Número. Ex: 5511999999999</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-900">Cor Primária</label>
                    <div className="flex gap-2">
                      <div 
                        className="w-10 h-10 rounded-lg border border-gray-300 shadow-sm shrink-0"
                        style={{ backgroundColor: localConfig.primaryColor }}
                      />
                      <input
                        type="text"
                        value={localConfig.primaryColor}
                        onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                        className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all font-sans uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Layout e Copywriting</h3>
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-900">Estilo de Layout</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(['obsidian', 'aurora', 'clean', 'market'] as const).map(theme => {
                      let previewStyle = '';
                      let headerStyle = '';
                      let bodyStyle = '';
                      
                      switch (theme) {
                        case 'obsidian':
                          previewStyle = 'bg-[#0f172a]';
                          headerStyle = 'bg-[#1e293b]';
                          bodyStyle = 'bg-[#d4af37]/20';
                          break;
                        case 'aurora':
                          previewStyle = 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500';
                          headerStyle = 'bg-white/20';
                          bodyStyle = 'bg-white/10';
                          break;
                        case 'clean':
                          previewStyle = 'bg-white border border-gray-200';
                          headerStyle = 'bg-gray-50 border-b border-gray-100';
                          bodyStyle = 'bg-gray-100';
                          break;
                        case 'market':
                          previewStyle = 'bg-gray-50';
                          headerStyle = 'bg-[#0f172a]';
                          bodyStyle = 'bg-white border border-gray-200';
                          break;
                      }

                      return (
                        <button
                          key={theme}
                          onClick={() => updateConfig({ themePreset: theme })}
                          className={`p-3 rounded-xl border flex flex-col gap-3 transition-all cursor-pointer ${
                            storeConfig.themePreset === theme
                              ? 'border-[#0f172a] bg-gray-50 text-gray-900 shadow-sm ring-1 ring-[#0f172a]'
                              : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {/* Mini Wireframe Preview */}
                          <div className={`w-full aspect-video rounded-md overflow-hidden flex flex-col shadow-inner ${previewStyle}`}>
                            <div className={`h-1/4 w-full ${headerStyle}`} />
                            <div className="flex-1 p-2 flex flex-col items-center justify-center gap-1">
                              <div className={`w-3/4 h-2 rounded-full ${bodyStyle}`} />
                              <div className={`w-1/2 h-1.5 rounded-full ${bodyStyle}`} />
                            </div>
                          </div>
                          
                          <span className="text-[12px] font-bold capitalize block text-center w-full">{theme}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-900">Título Principal (Hero)</label>
                  <input
                    type="text"
                    value={storeConfig.heroTitle}
                    onChange={(e) => updateConfig({ heroTitle: e.target.value })}
                    placeholder="Ex: Descubra Nossos Produtos Incríveis"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-900">Subtítulo (Hero)</label>
                  <textarea
                    value={storeConfig.heroSubtitle}
                    onChange={(e) => updateConfig({ heroSubtitle: e.target.value })}
                    placeholder="Sua descrição persuasiva aqui..."
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Gerenciar Catálogo</h3>
                  <p className="text-[13px] text-gray-500">Selecione quais produtos aparecerão nesta loja.</p>
                </div>
                
                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
                  <input 
                    type="checkbox" 
                    checked={showOnlyAdded}
                    onChange={(e) => setShowOnlyAdded(e.target.checked)}
                    className="rounded border-gray-300 text-[#0f172a] focus:ring-[#0f172a]"
                  />
                  <span className="text-[12px] font-bold text-gray-700">Apenas adicionados ({products.filter(p => p.addedToStore).length})</span>
                </label>
              </div>

              <div className="relative mb-6">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Pesquisar produtos por nome, categoria..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-[13px] text-gray-900 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 shadow-sm transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredProducts.map(product => (
                  <div 
                    key={product.id}
                    className={`flex gap-3 p-3 rounded-xl border transition-all ${
                      product.addedToStore 
                        ? 'border-[#0f172a] bg-gray-50 shadow-sm' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/150'} />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <h4 className="text-[13px] font-bold text-gray-900 line-clamp-1">{product.name}</h4>
                        <p className="text-[11px] text-gray-500 font-medium">{product.subcategory}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[14px] font-black text-emerald-600">R$ {product.salePrice.toFixed(2)}</span>
                        
                        <button
                          onClick={() => handleToggleProduct(product.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer ${
                            product.addedToStore
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
                              : 'bg-[#0f172a] text-white hover:bg-[#1e293b]'
                          }`}
                          title={product.addedToStore ? 'Remover' : 'Adicionar'}
                        >
                          {product.addedToStore ? <Trash2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredProducts.length === 0 && (
                  <div className="col-span-1 sm:col-span-2 py-12 text-center border border-dashed border-gray-200 rounded-xl">
                    <p className="text-[13px] font-bold text-gray-500">Nenhum produto encontrado.</p>
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

