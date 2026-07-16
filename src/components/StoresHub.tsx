import React, { useState } from 'react';
import { StoreSite, StoreConfig, Product, Supplier } from '../types';
import { ExternalLink, Lock, Store, ChevronDown, Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import StoreEditor from './StoreEditor';

interface StoresHubProps {
  sites: StoreSite[];
  activeSiteId?: string;
  storeConfig?: StoreConfig;
  products?: Product[];
  suppliers?: Supplier[];
  onUpdateStoreConfig?: (config: StoreConfig) => void;
  onToggleAddProduct?: (productId: string) => void;
  onPublishStore?: () => void;
  onNavigate: (page: string) => void;
  onEditStore: (siteId: string) => void;
  onViewStore: (siteId: string) => void;
  onCreateStore: () => void;
  onDeleteStore?: (siteId: string) => void;
}

export default function StoresHub({ 
  sites, 
  activeSiteId, 
  storeConfig,
  products = [],
  suppliers = [],
  onUpdateStoreConfig,
  onToggleAddProduct,
  onPublishStore,
  onNavigate, 
  onEditStore, 
  onViewStore, 
  onCreateStore,
  onDeleteStore 
}: StoresHubProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Use activeSiteId to determine the main active site, falling back to sites[0] if not found
  const activeSite = activeSiteId 
    ? sites.find(s => s.id === activeSiteId) || (sites.length > 0 ? sites[0] : null)
    : (sites.length > 0 ? sites[0] : null);

  // Modern clean defaults
  let headerBg = 'bg-white border-b border-gray-100 text-gray-900';
  let heroBg = 'bg-gray-50/50';

  if (isEditing && storeConfig && onUpdateStoreConfig && onToggleAddProduct && onPublishStore) {
    return (
      <StoreEditor
        storeConfig={storeConfig}
        products={products}
        suppliers={suppliers}
        onUpdateStoreConfig={onUpdateStoreConfig}
        onToggleAddProduct={onToggleAddProduct}
        onPublishStore={onPublishStore}
        onBack={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto py-8 font-sans animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Suas Lojas
          </h1>
          <p className="text-gray-500 mt-2 text-[14px]">
            Gerencie sua loja atual ou acesse outras lojas que você administra.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeSite) onViewStore(activeSite.id);
            }}
            className="px-4 py-2 text-[13px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Ver loja
          </button>
          <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {activeSite ? (
        <>
          {/* Main Active Store Card */}
          <div className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm mb-12">
            {/* Mockup Area */}
            <div className="bg-[#f8f9fa] w-full h-[360px] flex items-center justify-center p-8 relative overflow-hidden group">
              
              {/* Desktop Mockup */}
              <div className="w-[640px] h-[360px] bg-white rounded-t-xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] translate-y-6 relative overflow-hidden flex flex-col transition-transform duration-500 ease-out group-hover:translate-y-4 group-hover:scale-[1.02] border border-gray-200">
                <div className={`h-11 flex items-center px-6 gap-6 absolute top-0 left-0 right-0 z-10 ${headerBg}`}>
                  {activeSite.logoUrl ? (
                    <img src={activeSite.logoUrl} alt="Logo" className="w-6 h-6 object-cover rounded shadow-sm" />
                  ) : (
                    <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold" style={{ color: activeSite.primaryColor }}>
                      {activeSite.name.charAt(0)}
                    </div>
                  )}
                  <div className="text-[13px] font-bold text-gray-900">{activeSite.name}</div>
                  <div className="text-[12px] flex gap-5 ml-auto font-medium text-gray-500">
                    <span className="text-gray-900">Início</span>
                    <span>Catálogo</span>
                    <span>Contato</span>
                  </div>
                </div>
                {/* Hero area mockup */}
                <div className={`flex-1 w-full relative pt-11 ${heroBg}`}>
                  <div className="relative h-full flex items-center justify-center flex-col px-12 text-center mt-[-10px]">
                     <h2 className="text-[34px] leading-[1.15] font-extrabold tracking-tight mb-4 max-w-lg text-gray-900">
                       {activeSite.heroTitle || activeSite.name}
                     </h2>
                     <p className="text-[14px] mb-8 max-w-sm text-gray-500 font-medium leading-relaxed">
                       {activeSite.heroSubtitle || 'Encontre os melhores produtos com rapidez e facilidade. Seu catálogo direto no WhatsApp.'}
                     </p>
                     <div className="px-6 py-2.5 rounded-xl font-bold text-[13px] text-white shadow-sm transition-transform hover:scale-105" style={{ backgroundColor: activeSite.primaryColor }}>
                       {activeSite.ctaLabel || 'Ver produtos'}
                     </div>
                  </div>
                </div>
              </div>

              {/* Mobile Mockup */}
              <div className="absolute right-[8%] bottom-0 w-[200px] h-[340px] bg-white rounded-t-[28px] shadow-[0_16px_50px_rgba(0,0,0,0.15)] border-[6px] border-gray-900 translate-y-6 overflow-hidden flex flex-col transition-transform duration-500 ease-out group-hover:translate-y-3 group-hover:scale-[1.03] origin-bottom">
                <div className="h-10 border-b border-gray-100 flex items-center justify-center px-4 shrink-0 bg-white z-10">
                   {activeSite.logoUrl ? (
                     <img src={activeSite.logoUrl} alt="Logo" className="h-4 max-w-full object-contain" />
                   ) : (
                     <span className="text-[11px] font-bold text-gray-900">{activeSite.name}</span>
                   )}
                </div>
                <div className={`h-[140px] w-full relative shrink-0 ${heroBg}`}>
                  <div className="relative w-full h-full flex flex-col items-center justify-center text-center p-4">
                     <h2 className="text-[15px] leading-snug font-extrabold mb-3 text-gray-900 tracking-tight">
                       {activeSite.heroTitle || activeSite.name}
                     </h2>
                     <div className="px-4 py-2 rounded-lg font-bold text-[10px] text-white shadow-sm" style={{ backgroundColor: activeSite.primaryColor }}>
                       {activeSite.ctaLabel || 'Ver produtos'}
                     </div>
                  </div>
                </div>
                <div className="p-4 flex-1 bg-white">
                   <h3 className="text-[11px] font-bold text-gray-900 mb-3">Destaques</h3>
                   <div className="flex gap-2">
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="w-full aspect-square bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden p-1.5">
                          <div className="w-full h-full rounded-lg opacity-40" style={{ backgroundColor: activeSite.primaryColor }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-center mt-1">R$ 199,90</span>
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="w-full aspect-square bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden p-1.5">
                          <div className="w-full h-full rounded-lg opacity-40" style={{ backgroundColor: activeSite.primaryColor }}></div>
                        </div>
                        <span className="text-[9px] font-bold text-center mt-1">R$ 299,90</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Store Actions */}
            <div className="px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{activeSite.name}</h3>
                <a href="#" className="text-[13px] text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 mt-0.5 mb-1.5">
                  {slugify(activeSite.name)}.netlify <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setIsEditing(true);
                  }}
                  className="px-6 py-2.5 bg-[#0f172a] text-white text-[14px] font-semibold rounded-lg shadow-sm hover:bg-[#1e293b] transition-colors"
                >
                  Editar loja
                </button>
              </div>
            </div>
          </div>

          {/* Grid of Other Stores */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Suas lojas</h2>
            <button 
              onClick={onCreateStore}
              className="px-4 py-2 bg-[#0f172a] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1e293b] transition-colors"
            >
              Criar nova loja
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sites.map((site) => {
              const isCurrent = activeSite ? site.id === activeSite.id : false;
              const isMenuOpen = openMenuId === site.id;
              const avatarColor = site.primaryColor || '#d4af37';
              
              return (
                <div 
                  key={site.id} 
                  onClick={() => {
                    onEditStore(site.id);
                  }}
                  className={`bg-white rounded-xl p-4 cursor-pointer transition-all relative
                    ${isCurrent ? 'border-2 shadow-sm ring-4 ring-[#d4af37]/10' : 'border border-gray-200 hover:border-gray-300 hover:shadow-sm'}
                  `}
                  style={{ borderColor: isCurrent ? '#d4af37' : undefined }}
                >
                  {isCurrent && (
                    <span className="absolute top-3 right-3 bg-[#fdf8f0] text-[#d4af37] text-[10px] font-bold px-2 py-0.5 rounded">
                      Atual
                    </span>
                  )}
                  
                  {/* Three dots menu */}
                  <div className="absolute top-3 right-3">
                    {!isCurrent && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(isMenuOpen ? null : site.id);
                        }}
                        className="p-1 text-gray-400 hover:bg-gray-50 rounded border border-gray-100"
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </button>
                    )}
                    {isMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-40" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(null);
                          }} 
                        />
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                          {onDeleteStore && sites.length > 1 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(null);
                                if (window.confirm('Tem certeza que deseja excluir esta loja?')) {
                                  onDeleteStore(site.id);
                                }
                              }}
                              className="w-full text-left px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="w-3 h-3" /> Excluir
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {site.name.charAt(0).toUpperCase()}
                  </div>
                  
                  <h3 className="font-bold text-gray-900 text-[14px] mb-0.5 truncate pr-8">{site.name}</h3>
                  <p className="text-[12px] text-gray-500 mb-2 truncate">{slugify(site.name)}.netlify</p>
                </div>
              );
            })}

            {/* Create New Store Card */}
            <div 
              onClick={onCreateStore}
              className="bg-[#fafafa] rounded-xl p-4 border-2 border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center cursor-pointer min-h-[180px]"
            >
              <Plus className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-[13px] font-semibold text-gray-600">Criar nova loja</span>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-[24px] border border-gray-200 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#fdf8f0] rounded-full flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Crie sua primeira loja</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto text-[14px]">
            Sua jornada começa aqui. Descreva o que você quer vender e nossa IA montará a estrutura completa da sua loja em segundos.
          </p>
          <button
            onClick={onCreateStore}
            className="px-6 py-2.5 bg-[#0f172a] text-white font-bold rounded-lg hover:bg-[#1e293b] transition-colors inline-flex items-center gap-2"
          >
            Criar loja agora
          </button>
        </div>
      )}
    </div>
  );
}

// Utility to mock the slug
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

