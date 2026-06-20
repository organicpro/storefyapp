import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Store, 
  ShoppingBag, 
  Users, 
  Share2, 
  Settings, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  CircleDot
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  storeName: string;
  storePrimaryColor: string;
}

export default function Sidebar({ activePage, onPageChange, storeName, storePrimaryColor }: SidebarProps) {
  const categories = [
    {
      title: 'Operação',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'wizard', label: 'Criar Loja', icon: Sparkles, badge: 'Novo' },
        { id: 'stores', label: 'Minhas Lojas', icon: Store }
      ]
    },
    {
      title: 'Catálogo',
      items: [
        { id: 'products', label: 'Produtos SaaS', icon: ShoppingBag },
        { id: 'suppliers', label: 'Fornecedores & Links', icon: Users }
      ]
    },
    {
      title: 'Crescimento',
      items: [
        { id: 'marketing', label: 'Divulgação', icon: Share2 },
        { id: 'settings', label: 'Configurações', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 flex flex-col h-screen border-r border-white/10 bg-white/[0.01] backdrop-blur-2xl text-slate-300 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="min-w-0">
          <img
            src="/storefy-logo.png"
            alt=""
            className="h-12 w-auto max-w-[172px] object-contain"
          />
        </div>
        <div className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </div>
      </div>

      {/* Nav Items */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        {categories.map((group) => (
          <div key={group.title} className="space-y-2">
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest font-mono">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onPageChange(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative ${
                        isActive
                          ? 'bg-white/[0.06] text-white shadow-[0_0_15px_rgba(255,255,255,0.02)]'
                          : 'hover:bg-white/[0.03] hover:text-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon 
                          className={`w-[18px] h-[18px] transition-colors duration-300 ${
                            isActive ? 'text-brand-500' : 'text-slate-500'
                          }`} 
                          style={{ color: isActive ? storePrimaryColor : undefined }}
                        />
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-brand-500/10 text-brand-500 rounded-md font-medium border border-brand-500/20">
                            {item.badge}
                          </span>
                        )}
                        {isActive && (
                          <div 
                            className="w-1.5 h-1.5 rounded-full" 
                            style={{ backgroundColor: storePrimaryColor }}
                          />
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Store Profiler Widget */}
      <div className="p-4 border-t border-white/10 bg-white/[0.02]">
        <div className="flex items-center p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-inner select-none transition-transform active:scale-95" 
               style={{ backgroundColor: storePrimaryColor }}>
            {storeName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{storeName}</p>
            <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
              <CircleDot className="w-2.5 h-2.5 animate-pulse" />
              vitrine ativa
            </p>
          </div>
        </div>

        {/* Action shortcut to open mockup shop */}
        <button
          onClick={() => onPageChange('shop-preview')}
          className="mt-3 w-full py-2 px-3 rounded-lg bg-brand-500/10 hover:bg-brand-500/20 text-brand-500 text-xs font-semibold flex items-center justify-center gap-2 border border-brand-500/20 transition-all active:scale-[0.98] cursor-pointer"
        >
          <span>Visualizar Minha Loja</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
