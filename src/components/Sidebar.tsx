import React from 'react';
import {
  Sparkles, LayoutDashboard, Store, Megaphone, BookOpen,
  Package, BarChart3, Truck, Settings
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { PHYSICAL_PRODUCTS_ENABLED } from '../config/features';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  storeName: string;
  storePrimaryColor: string;
  accountName?: string;
  logoUrl?: string;
  userLevel?: number;
  isAdmin?: boolean;
}

type NavItemConfig = {
  id: string;
  label: React.ReactNode;
  icon: React.ElementType;
  badge?: string;
};


export default function Sidebar({ activePage, onPageChange, storeName, storePrimaryColor, accountName, logoUrl, userLevel = 1, isAdmin = false }: SidebarProps) {
  const { t } = useLanguage();

  const mainItems: NavItemConfig[] = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { id: 'sia', label: 'Ayla', icon: Sparkles, badge: 'IA' },
    { id: 'operation', label: t('sidebar.operation'), icon: Store },
    { id: 'promotion', label: t('sidebar.promotion'), icon: Megaphone },
    { id: 'academy', label: 'Academy', icon: BookOpen },
  ];

  const productItems: NavItemConfig[] = [
    ...(PHYSICAL_PRODUCTS_ENABLED ? [
      { id: 'ranking', label: 'Ranking', icon: BarChart3 },
    ] : []),
    { id: 'products', label: t('sidebar.products'), icon: Package },
    ...(PHYSICAL_PRODUCTS_ENABLED ? [
      { id: 'suppliers', label: t('sidebar.suppliers'), icon: Truck },
    ] : []),
  ];

  const NavItem: React.FC<{ item: NavItemConfig }> = ({ item }) => {
    const isActive = activePage === item.id;
    return (
      <li>
        <button
          onClick={() => onPageChange(item.id)}
          aria-current={isActive ? 'page' : undefined}
          className={`sf-nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-colors duration-150 text-left ${
            isActive
              ? 'bg-[#eeeeef] text-[#191b20] font-semibold'
              : 'text-[#646871] hover:bg-[#f0f0f1] hover:text-[#191b20] font-medium'
          }`}
        >
          <item.icon size={18} strokeWidth={isActive ? 2 : 1.7} className={`shrink-0 ${item.id === 'sia' ? 'text-[#a17b00]' : ''}`} />
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="px-1.5 py-1 text-[9px] bg-[#fff1b3] text-[#886500] rounded font-semibold leading-none">
              {item.badge}
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <aside className="sf-sidebar flex flex-col h-full select-none">

      {/* Nav */}
      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto px-3 py-6 space-y-7">

        {/* Main items */}
        <p className="sf-section-label px-3 mb-3">Workspace</p>
        <ul className="space-y-1">
          {mainItems.map(item => <NavItem key={item.id} item={item} />)}
        </ul>

        {/* Produtos section */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 px-3 mb-1.5 mt-2">
            <span className="sf-section-label">{t('sidebar.productsHeader')}</span>
          </div>
          <ul className="space-y-0.5">
            {productItems.map(item => <NavItem key={item.id} item={item} />)}
          </ul>
        </div>
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-4 space-y-1 mt-auto">

        {/* Configurações */}
        <button
          onClick={() => onPageChange('settings')}
          className={`w-full flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13.5px] transition-all duration-150 text-left mb-3 ${
            activePage === 'settings'
              ? 'bg-white text-[#333333] font-medium shadow-sm border border-gray-200/80'
              : 'text-[#333333] hover:bg-white/50 font-normal'
          }`}
        >
          <Settings size={18} strokeWidth={1.7} className="text-gray-500" />
          <span>{t('sidebar.settings')}</span>
        </button>

        {/* Store pill with Account Name */}
        <div className="rounded-lg overflow-hidden bg-white border border-gray-200">
          <div className="px-3 py-3 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold text-white shrink-0 shadow-inner overflow-hidden bg-white border border-gray-100"
              style={{ backgroundColor: logoUrl ? 'transparent' : storePrimaryColor }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={storeName} className="w-full h-full object-cover" />
              ) : (
                storeName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium text-gray-900 truncate leading-tight">{storeName}</p>
              {accountName && (
                <p className="text-[11px] text-gray-500 truncate mt-0.5">{accountName}</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </aside>
  );
}


