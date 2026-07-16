import React from 'react';
import {
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
  storeName: string;
  storePrimaryColor: string;
  accountName?: string;
  logoUrl?: string;
}

type NavItemConfig = {
  id: string;
  label: React.ReactNode;
  iconUrl: string;
  badge?: string;
};


// Helper: renders a polaris icon using CSS mask
const PolarisIcon = ({ url, className = '' }: { url: string; className?: string }) => (
  <span 
    className={`inline-block ${className}`}
    style={{
      maskImage: `url(${url})`,
      WebkitMaskImage: `url(${url})`,
      maskSize: 'contain',
      WebkitMaskSize: 'contain',
      maskRepeat: 'no-repeat',
      WebkitMaskRepeat: 'no-repeat',
      maskPosition: 'center',
      WebkitMaskPosition: 'center',
    }}
  />
);

export default function Sidebar({ activePage, onPageChange, storeName, storePrimaryColor, accountName, logoUrl }: SidebarProps) {
  const { t } = useLanguage();

  const mainItems: NavItemConfig[] = [
    { id: 'dashboard', label: t('sidebar.dashboard'), iconUrl: 'https://unpkg.com/@shopify/polaris-icons@latest/dist/svg/HomeFilledIcon.svg' },
    { id: 'operation', label: t('sidebar.operation'), iconUrl: 'https://unpkg.com/@shopify/polaris-icons@latest/dist/svg/StoreFilledIcon.svg' },
    { id: 'promotion', label: t('sidebar.promotion'), iconUrl: 'https://unpkg.com/@shopify/polaris-icons@latest/dist/svg/MegaphoneFilledIcon.svg' },
    { id: 'academy', label: 'Academy', iconUrl: 'https://unpkg.com/@shopify/polaris-icons@latest/dist/svg/BookOpenIcon.svg' },
  ];

  const productItems: NavItemConfig[] = [
    { id: 'products', label: t('sidebar.products'), iconUrl: 'https://unpkg.com/@shopify/polaris-icons@latest/dist/svg/ProductFilledIcon.svg' },
    { id: 'suppliers', label: t('sidebar.suppliers'), iconUrl: 'https://unpkg.com/@shopify/polaris-icons@latest/dist/svg/DeliveryFilledIcon.svg' },
  ];

  const NavItem: React.FC<{ item: NavItemConfig }> = ({ item }) => {
    const isActive = activePage === item.id;
    return (
      <li>
        <button
          onClick={() => onPageChange(item.id)}
          className={`w-full flex items-center gap-3 px-3 py-[7px] rounded-lg text-[13.5px] transition-all duration-150 text-left ${
            isActive
              ? 'bg-white text-[#333333] font-medium shadow-sm border border-gray-200/80'
              : 'text-[#333333] hover:bg-white/50 font-normal'
          }`}
        >
          <PolarisIcon
            url={item.iconUrl}
            className={`w-5 h-5 bg-[#4A4A4A] ${isActive ? 'nav-icon-active' : ''}`}
          />
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-700 rounded font-medium leading-none">
              {item.badge}
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <aside className="w-[270px] flex flex-col h-full select-none rounded-tl-[20px] border-r border-gray-200/60" style={{ backgroundColor: '#e8e8e8' }}>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">

        {/* Main items */}
        <ul className="space-y-0.5">
          {mainItems.map(item => <NavItem key={item.id} item={item} />)}
        </ul>

        {/* Produtos section */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 px-3 mb-1.5 mt-2">
            <span className="text-[13px] font-bold text-[#333333]">{t('sidebar.productsHeader')}</span>
            <ChevronRight size={14} className="text-[#333333] opacity-70" />
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
          <PolarisIcon
            url="https://unpkg.com/@shopify/polaris-icons@latest/dist/svg/SettingsFilledIcon.svg"
            className="w-5 h-5 bg-[#4A4A4A]"
          />
          <span>{t('sidebar.settings')}</span>
        </button>

        {/* Store pill with Account Name */}
        <div className="rounded-xl overflow-hidden bg-white border border-gray-200 shadow-sm">
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


