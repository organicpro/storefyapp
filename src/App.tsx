import React, { useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  HelpCircle,
  Menu,
  Plus,
  Sparkles,
  Store,
  LogOut,
  Trash2,
  X
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Wizard from './components/Wizard';
import ProductCatalog from './components/ProductCatalog';
import SuppliersList from './components/SuppliersList';
import MarketingKit from './components/MarketingKit';
import SettingsView from './components/SettingsView';
import StorePreview from './components/StorePreview';
import LoginScreen from './components/LoginScreen';
import { DEFAULT_STORE_CONFIG, INITIAL_PRODUCTS, INITIAL_SUPPLIERS } from './data';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { loadPublicStore, PublicStorePayload, savePublicStore } from './lib/publicStores';
import { loadWorkspace, saveWorkspace } from './lib/workspaceSync';
import { productFallbackImage } from './productImages';
import { Product, StoreConfig, Supplier } from './types';

const DATA_VERSION = '2026-06-18-ai-subscriptions-v1';
const STOREFY_LOGO_URL = '/storefy-logo.png';

const STORAGE_KEYS = {
  products: 'storefy.front.products',
  productsVersion: 'storefy.front.productsVersion',
  sites: 'storefy.front.sites',
  activeSiteId: 'storefy.front.activeSiteId',
  storeConfig: 'storefy.front.config',
  localAuth: 'storefy.auth.local',
  publicStores: 'storefy.publicStores'
};

type StoreSite = StoreConfig & { id: string };

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

function createId(prefix = 'site') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function slugifyStore(value: string) {
  return String(value || 'loja')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'loja';
}

function getPublicStorePath(slug: string) {
  return `/store/${encodeURIComponent(slug)}`;
}

function getPublicStoreUrl(slug: string) {
  return `${window.location.origin}${getPublicStorePath(slug)}`;
}

function readPublicStoresLocal(): Record<string, PublicStorePayload> {
  return readStorage<Record<string, PublicStorePayload>>(STORAGE_KEYS.publicStores, {});
}

function savePublicStoreLocal(payload: PublicStorePayload) {
  const stores = readPublicStoresLocal();
  stores[payload.slug] = payload;
  window.localStorage.setItem(STORAGE_KEYS.publicStores, JSON.stringify(stores));
}

function makeSite(config: StoreConfig, index = 1): StoreSite {
  const id = config.id || createId();
  return {
    ...DEFAULT_STORE_CONFIG,
    ...config,
    id,
    logoUrl: config.logoUrl || STOREFY_LOGO_URL,
    name: config.name || `Storefy Loja ${index}`,
    subdomain: config.subdomain || `storefy-${index}`,
    productIds: Array.isArray(config.productIds) ? config.productIds : []
  };
}

function getStoreProductIds(config: StoreConfig, products: Product[]) {
  const ids = Array.isArray(config.productIds)
    ? Array.from(new Set(config.productIds.filter(Boolean)))
    : [];

  if (!ids.length) return [];

  const productById = new Map(products.map(product => [product.id, product]));
  const lastSelectedCategory = [...ids].reverse()
    .map(id => productById.get(id)?.category)
    .find(Boolean);

  if (!lastSelectedCategory) return ids;
  return ids.filter(id => productById.get(id)?.category === lastSelectedCategory);
}

function applyStoreSelection(products: Product[], productIds: string[]) {
  const selected = new Set(productIds);
  return products.map(product => ({ ...product, addedToStore: selected.has(product.id) }));
}

function getSelectedProductsForStore(config: StoreConfig, products: Product[]) {
  const productIds = getStoreProductIds(config, products);
  return applyStoreSelection(products, productIds).filter(product => product.addedToStore);
}

function escapeHtml(value: string | number | undefined) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getReadableTextColor(hexColor?: string) {
  const hex = (hexColor || '').replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return '#050505';

  const red = parseInt(hex.slice(0, 2), 16);
  const green = parseInt(hex.slice(2, 4), 16);
  const blue = parseInt(hex.slice(4, 6), 16);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;

  return luminance > 0.58 ? '#050505' : '#ffffff';
}
function getStoreTheme(config: StoreConfig) {
  const accent = config.primaryColor || '#d4af37';
  switch (config.themePreset) {
    case 'clean':
      return {
        accent,
        pageBg: '#f8fafc',
        text: '#0f172a',
        muted: '#475569',
        border: 'rgba(15,23,42,.12)',
        heroBg: `radial-gradient(circle at 16% 4%,${accent}26,transparent 28%),linear-gradient(135deg,#ffffff,#e2e8f0 58%,#f8fafc)`,
        surface: 'rgba(255,255,255,.82)',
        card: 'linear-gradient(180deg,rgba(255,255,255,.96),rgba(241,245,249,.92))'
      };
    case 'aurora':
      return {
        accent,
        pageBg: '#050312',
        text: '#ffffff',
        muted: '#c4b5fd',
        border: 'rgba(196,181,253,.18)',
        heroBg: `radial-gradient(circle at 18% 0%,${accent}77,transparent 28%),radial-gradient(circle at 78% 10%,rgba(34,211,238,.28),transparent 30%),linear-gradient(135deg,#050312,#1e1b4b 62%,#020617)`,
        surface: 'rgba(255,255,255,.08)',
        card: 'linear-gradient(180deg,rgba(124,58,237,.16),rgba(15,23,42,.74))'
      };
    case 'market':
      return {
        accent,
        pageBg: '#09090b',
        text: '#fff7ed',
        muted: '#fed7aa',
        border: 'rgba(251,146,60,.2)',
        heroBg: `radial-gradient(circle at 15% 0%,${accent}66,transparent 30%),linear-gradient(135deg,#09090b,#7c2d12 58%,#111827)`,
        surface: 'rgba(255,237,213,.08)',
        card: 'linear-gradient(180deg,rgba(251,146,60,.16),rgba(24,24,27,.86))'
      };
    default:
      return {
        accent,
        pageBg: '#050507',
        text: '#f8fafc',
        muted: '#cbd5e1',
        border: 'rgba(255,255,255,.12)',
        heroBg: `radial-gradient(circle at 16% 4%,${accent}66,transparent 28%),radial-gradient(circle at 86% 10%,rgba(20,184,166,.22),transparent 26%),linear-gradient(135deg,#050505,#0b0d10 58%,#050505)`,
        surface: 'rgba(255,255,255,.07)',
        card: 'linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035))'
      };
  }
}
function buildProductImageMarkup(product: Product) {
  const isPhysical = product.category === 'Achados Fisicos';
  const fallback = isPhysical ? '' : product.fallbackImageUrl || productFallbackImage(product);
  const source = product.imageUrl || fallback;

  if (!source) {
    return '<div class="no-image">Imagem indisponivel</div>';
  }

  const onError = fallback
    ? `this.onerror=null;this.src='${escapeHtml(fallback)}'`
    : 'this.remove()';
  const className = isPhysical ? 'photo' : 'logo-img';

  return `<img class="${className}" src="${escapeHtml(source)}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="${onError}" />`;
}

function buildStoreHtml(config: StoreConfig, products: Product[]) {
  const activeProducts = getSelectedProductsForStore(config, products);
  const categories = Array.from(new Set(activeProducts.map(product => product.category)));
  const theme = getStoreTheme(config);
  const heroTitle = config.heroTitle || `${config.name} pronta para vender.`;
  const heroSubtitle = config.heroSubtitle || 'Produtos organizados, atendimento direto e compra rapida. Escolha sua oferta e fale com a loja para finalizar.';
  const ctaLabel = config.ctaLabel || 'Ver produtos';
  const accentTextColor = getReadableTextColor(config.primaryColor);
  const phone = config.whatsapp.replace(/\D/g, '');
  const whatsappFor = (product?: Product) => {
    const text = product
      ? `Ola! Quero comprar: ${product.name} - R$ ${product.salePrice.toFixed(2).replace('.', ',')}`
      : config.welcomeMessage;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  const productCards = activeProducts.map(product => `
    <article class="card">
      <div class="media">${buildProductImageMarkup(product)}</div>
      <div class="card-body">
        <div class="meta-row">
          <span class="pill">${escapeHtml(product.category)}</span>
          <span class="supplier">${escapeHtml(product.supplier)}</span>
        </div>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.deliverable)}</p>
        <ul>
          ${product.benefits.slice(0, 3).map(benefit => `<li>${escapeHtml(benefit)}</li>`).join('')}
        </ul>
        <div class="buy-row">
          <div>
            <span>Preco</span>
            <strong>R$ ${product.salePrice.toFixed(2).replace('.', ',')}</strong>
          </div>
          <a href="${escapeHtml(whatsappFor(product))}" target="_blank" rel="noreferrer">Comprar</a>
        </div>
      </div>
    </article>
  `).join('');

  const categoryLinks = categories.map(category => `<span>${escapeHtml(category)}</span>`).join('');
  const faqItems = (config.faq || []).slice(0, 3).map(item => `
    <details>
      <summary>${escapeHtml(item.question)}</summary>
      <p>${escapeHtml(item.answer)}</p>
    </details>
  `).join('');

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(config.name)}</title>
  <style>
    :root{--sf-bg:${escapeHtml(theme.pageBg)};--sf-text:${escapeHtml(theme.text)};--sf-muted:${escapeHtml(theme.muted)};--sf-border:${escapeHtml(theme.border)};--sf-surface:${escapeHtml(theme.surface)};--sf-card:${escapeHtml(theme.card)};}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--sf-bg);color:var(--sf-text);font-family:Inter,Arial,sans-serif}a{color:inherit;text-decoration:none}.wrap{width:min(1180px,calc(100% - 32px));margin:0 auto}.hero{position:relative;overflow:hidden;padding:28px 0 46px;background:${escapeHtml(theme.heroBg)}}.hero:after{content:"";position:absolute;inset:auto -10% -45% -10%;height:280px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent);transform:rotate(-6deg)}.top{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand{display:flex;align-items:center;gap:12px}.brand img{width:54px;height:54px;object-fit:contain;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);padding:6px}.brand strong{font-size:22px;letter-spacing:-.03em}.cta,.buy-row a{display:inline-flex;align-items:center;justify-content:center;background:${escapeHtml(config.primaryColor)};color:${escapeHtml(accentTextColor)};border-radius:999px;padding:12px 16px;font-weight:900;box-shadow:0 16px 38px ${escapeHtml(config.primaryColor)}33}.hero-grid{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(280px,.92fr);gap:34px;align-items:end;margin-top:52px}.eyebrow{display:inline-flex;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.07);border-radius:999px;padding:8px 12px;color:#dbeafe;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.12em}.hero h1{font-size:clamp(38px,7vw,78px);line-height:.9;margin:18px 0 16px;max-width:850px;letter-spacing:-.06em}.hero p{max-width:680px;color:#cbd5e1;font-size:18px;line-height:1.65}.hero-panel{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.07);border-radius:28px;padding:22px;backdrop-filter:blur(18px);box-shadow:0 28px 90px rgba(0,0,0,.35)}.hero-panel strong{display:block;font-size:34px;letter-spacing:-.04em}.hero-panel span{display:block;color:#cbd5e1;font-size:13px;line-height:1.55}.cats{display:flex;flex-wrap:wrap;gap:10px;margin-top:28px}.cats span,.pill{border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.08);border-radius:999px;padding:8px 12px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.section-title{display:flex;align-items:end;justify-content:space-between;gap:20px;margin:38px 0 18px}.section-title h2{margin:0;font-size:30px;letter-spacing:-.04em}.section-title p{margin:0;color:#94a3b8;font-size:14px}.trust{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:22px 0 0}.trust div{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);border-radius:18px;padding:14px;color:#cbd5e1;font-size:13px}.trust b{display:block;color:#fff;margin-bottom:3px}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(268px,1fr));gap:18px;padding:0 0 34px}.card{border:1px solid rgba(255,255,255,.12);background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.035));border-radius:22px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.28);transition:transform .2s,border-color .2s}.card:hover{transform:translateY(-3px);border-color:rgba(255,255,255,.24)}.media{height:184px;background:#101010;display:flex;align-items:center;justify-content:center}.media img{width:100%;height:100%}.media img.photo{object-fit:cover}.media img.logo-img{object-fit:contain;padding:30px;background:#050508}.no-image{color:#94a3b8;font-weight:800;font-size:12px}.card-body{padding:16px}.meta-row{display:flex;align-items:center;justify-content:space-between;gap:8px}.supplier{color:#94a3b8;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.card h3{font-size:18px;line-height:1.16;margin:13px 0 8px;letter-spacing:-.03em}.card p{color:#b6c2d2;font-size:13px;line-height:1.45;min-height:38px}.card ul{list-style:none;margin:12px 0;padding:0;display:grid;gap:7px}.card li{font-size:12px;color:var(--sf-text)}.card li:before{content:"+";color:${escapeHtml(config.primaryColor)};font-weight:900;margin-right:6px}.buy-row{display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,.1);padding-top:14px;margin-top:14px;gap:12px}.buy-row span{display:block;color:#94a3b8;font-size:10px;font-weight:900;text-transform:uppercase}.buy-row strong{display:block;font-size:22px;line-height:1}.contact{padding:38px 0 52px;border-top:1px solid rgba(255,255,255,.1);background:radial-gradient(circle at 50% 0%,rgba(255,255,255,.06),transparent 34%)}.contact-box{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);border-radius:28px;padding:26px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}.faq{display:grid;gap:10px;margin:18px 0 0}.faq details{border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);border-radius:18px;padding:14px}.faq summary{cursor:pointer;font-weight:800}.faq p{color:#cbd5e1;margin:10px 0 0;line-height:1.55}.sticky-buy{position:fixed;right:18px;bottom:18px;z-index:5}@media(max-width:760px){.hero-grid{grid-template-columns:1fr;margin-top:34px}.hero-panel{display:none}.trust{grid-template-columns:1fr}.top{align-items:flex-start}.media{height:156px}.contact-box{display:block}.cta{display:inline-flex;margin-top:14px}.section-title{display:block}.sticky-buy{left:16px;right:16px}.sticky-buy .cta{width:100%}}
      body{background:var(--sf-bg);color:var(--sf-text)}.hero p,.section-title p,.card p{color:var(--sf-muted)}.hero-panel,.contact-box{background:var(--sf-surface);border-color:var(--sf-border)}.card{position:relative;display:flex;flex-direction:column;min-height:100%;background:var(--sf-card);border-color:var(--sf-border);box-shadow:0 24px 72px rgba(0,0,0,.32)}.card:before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.1),transparent 35%,rgba(255,255,255,.04));opacity:0;transition:opacity .22s}.card:hover:before{opacity:1}.card-body{display:flex;flex-direction:column;flex:1}.card h3,.card li,.buy-row strong{color:var(--sf-text)}.supplier,.buy-row span{color:var(--sf-muted)}.buy-row{margin-top:auto}.media{height:196px;background:linear-gradient(135deg,rgba(255,255,255,.045),rgba(255,255,255,.01)),#050507}.pill{background:var(--sf-surface);border-color:var(--sf-border);color:var(--sf-text)}.trust div,.faq details{background:var(--sf-surface);border-color:var(--sf-border)}
  </style>
</head>
<body>
  <header class="hero">
    <div class="wrap">
      <div class="top">
        <div class="brand"><img src="${escapeHtml(config.logoUrl || STOREFY_LOGO_URL)}" alt="${escapeHtml(config.name)}" /><strong>${escapeHtml(config.name)}</strong></div>
        <a class="cta" href="#produtos">${escapeHtml(ctaLabel)}</a>
      </div>
      <div class="hero-grid">
        <div>
          <span class="eyebrow">Vitrine selecionada</span>
          <h1>${escapeHtml(heroTitle)}</h1>
          <p>${escapeHtml(heroSubtitle)}</p>
          <div class="cats">${categoryLinks}</div>
        </div>
        <aside class="hero-panel">
          <strong>${activeProducts.length}</strong>
          <span>produtos ativos nesta vitrine, separados por nicho e com atendimento direto.</span>
          <div class="trust">
            <div><b>Entrega combinada</b>Receba orientacao pelo atendimento.</div>
            <div><b>Compra direta</b>Pedido rapido pelo WhatsApp.</div>
            <div><b>Ofertas curadas</b>Catalogo enxuto e objetivo.</div>
          </div>
        </aside>
      </div>
    </div>
  </header>
  <main id="produtos" class="wrap">
    <div class="section-title">
      <h2>Produtos em destaque</h2>
      <p>Escolha uma oferta e chame a loja para confirmar disponibilidade.</p>
    </div>
    <section class="grid">${productCards || '<p>Nenhum produto selecionado ainda.</p>'}</section>
    ${faqItems ? `<section class="faq"><div class="section-title"><h2>Duvidas rapidas</h2><p>Informacoes importantes antes de comprar.</p></div>${faqItems}</section>` : ''}
  </main>
  <footer id="contato" class="contact">
    <div class="wrap">
      <div class="contact-box">
        <div>
          <h2>Gostou de algum produto?</h2>
          <p>Entre em contato com a loja para finalizar o pedido.</p>
        </div>
        <a class="cta" href="${escapeHtml(whatsappFor())}" target="_blank" rel="noreferrer">Chamar loja</a>
      </div>
    </div>
  </footer>
  <div class="sticky-buy"><a class="cta" href="${escapeHtml(whatsappFor())}" target="_blank" rel="noreferrer">Comprar pelo atendimento</a></div>
</body>
</html>`;
}

function downloadHtml(filename: string, html: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function HtmlStorePreview({
  html,
  storeName,
  onBackToSaaS
}: {
  html: string;
  storeName: string;
  onBackToSaaS: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#030305] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050508]/90 px-4 py-3 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-500">Site gerado</p>
            <h1 className="truncate font-display text-lg font-bold text-white">{storeName}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onBackToSaaS}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-slate-200 transition hover:bg-white/[0.08]"
            >
              Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-3 sm:p-5">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/40">
          <iframe
            title={`Site gerado - ${storeName}`}
            srcDoc={html}
            className="h-[calc(100vh-116px)] w-full bg-white"
            sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        </div>
      </main>
    </div>
  );
}

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [previewReturnPage, setPreviewReturnPage] = useState('dashboard');
  const [previewWizardStep, setPreviewWizardStep] = useState(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [appToast, setAppToast] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [localAccess, setLocalAccess] = useState(() => readStorage<boolean>(STORAGE_KEYS.localAuth, false));
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const publicStoreSlug = useMemo(() => {
    const match = window.location.pathname.match(/^\/store\/([^/?#]+)/);
    return match ? decodeURIComponent(match[1]) : '';
  }, []);
  const [publicStore, setPublicStore] = useState<PublicStorePayload | null>(() => {
    if (!publicStoreSlug) return null;
    return readPublicStoresLocal()[publicStoreSlug] || null;
  });
  const [publicStoreLoading, setPublicStoreLoading] = useState(Boolean(publicStoreSlug && !publicStore));

  const [products, setProducts] = useState<Product[]>(() => {
    const storedVersion = window.localStorage.getItem(STORAGE_KEYS.productsVersion);
    return storedVersion === DATA_VERSION
      ? readStorage<Product[]>(STORAGE_KEYS.products, INITIAL_PRODUCTS)
      : INITIAL_PRODUCTS;
  });
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [sites, setSites] = useState<StoreSite[]>(() => {
    const legacyConfig = readStorage<StoreConfig>(STORAGE_KEYS.storeConfig, DEFAULT_STORE_CONFIG);
    const storedSites = readStorage<StoreSite[]>(STORAGE_KEYS.sites, []);
    return storedSites.length ? storedSites.map((site, index) => makeSite(site, index + 1)) : [makeSite(legacyConfig)];
  });
  const [activeSiteId, setActiveSiteId] = useState(() => readStorage<string>(STORAGE_KEYS.activeSiteId, ''));

  const storeConfig = useMemo(() => {
    return sites.find(site => site.id === activeSiteId) || sites[0] || makeSite(DEFAULT_STORE_CONFIG);
  }, [activeSiteId, sites]);

  const activeStoreProductIds = useMemo(() => {
    return getStoreProductIds(storeConfig, products);
  }, [products, sites.length, storeConfig]);

  const storeProducts = useMemo(() => {
    return applyStoreSelection(products, activeStoreProductIds);
  }, [activeStoreProductIds, products]);

  useEffect(() => {
    document.title = 'Storefy | Premium SaaS';
  }, []);

  useEffect(() => {
    if (!publicStoreSlug) return;

    let mounted = true;
    const localStore = readPublicStoresLocal()[publicStoreSlug];

    if (localStore) {
      setPublicStore(localStore);
      setPublicStoreLoading(false);
    }

    loadPublicStore(publicStoreSlug).then(remoteStore => {
      if (!mounted) return;
      if (remoteStore) {
        savePublicStoreLocal(remoteStore);
        setPublicStore(remoteStore);
      }
      setPublicStoreLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [publicStoreSlug]);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthReady(true);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        window.localStorage.removeItem(STORAGE_KEYS.localAuth);
        setLocalAccess(false);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user?.id || workspaceReady) return;

    loadWorkspace(session.user.id).then(workspace => {
      if (workspace?.products?.length) {
        setProducts(workspace.products);
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
      if (workspace?.sites?.length) {
        setSites(workspace.sites.map((site, index) => makeSite(site, index + 1)));
      } else {
        const cleanSite = makeSite(DEFAULT_STORE_CONFIG);
        setSites([cleanSite]);
        setActiveSiteId(cleanSite.id);
      }
      if (workspace?.activeSiteId) {
        setActiveSiteId(workspace.activeSiteId);
      }
      setWorkspaceReady(true);
    });
  }, [session?.user?.id, workspaceReady]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    window.localStorage.setItem(STORAGE_KEYS.productsVersion, DATA_VERSION);
  }, [products]);

  useEffect(() => {
    if (!activeSiteId && sites[0]?.id) {
      setActiveSiteId(sites[0].id);
    }
  }, [activeSiteId, sites]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.sites, JSON.stringify(sites));
    window.localStorage.setItem(STORAGE_KEYS.activeSiteId, storeConfig.id || '');
    window.localStorage.setItem(STORAGE_KEYS.storeConfig, JSON.stringify(storeConfig));
  }, [sites, storeConfig]);

  useEffect(() => {
    if (!session?.user?.id || !workspaceReady) return;

    const timer = window.setTimeout(() => {
      void saveWorkspace(session.user.id, {
        products,
        sites,
        activeSiteId: storeConfig.id || activeSiteId
      });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [activeSiteId, products, session?.user?.id, sites, storeConfig.id, workspaceReady]);

  const showAppToast = (message: string) => {
    setAppToast(message);
    window.setTimeout(() => setAppToast(null), 3200);
  };

  const handleNavigate = (page: string) => {
    setActivePage(page);
    setMobileSidebarOpen(false);
  };

  const handleOpenGeneratedSite = (returnPage = activePage, wizardStep?: number) => {
    setPreviewReturnPage(returnPage);
    if (wizardStep) {
      setPreviewWizardStep(wizardStep);
    }
    handleNavigate('shop-preview');
  };

  const handleLocalAccess = () => {
    window.localStorage.setItem(STORAGE_KEYS.localAuth, JSON.stringify(true));
    setLocalAccess(true);
  };

  const handleSignOut = async () => {
    if (supabase && session) {
      await supabase.auth.signOut();
    }
    window.localStorage.removeItem(STORAGE_KEYS.localAuth);
    setLocalAccess(false);
    setSession(null);
    setWorkspaceReady(false);
  };

  const handleToggleAddProduct = (productId: string) => {
    const targetProduct = products.find(product => product.id === productId);
    if (!targetProduct) return;

    setSites(prev => prev.map((site, index) => {
      if (site.id !== storeConfig.id) return site;

      const currentIds = getStoreProductIds(site, products);
      const isSelected = currentIds.includes(productId);
      const sameCategoryIds = currentIds.filter(id => {
        const product = products.find(item => item.id === id);
        return product?.category === targetProduct.category;
      });
      const nextIds = isSelected
        ? sameCategoryIds.filter(id => id !== productId)
        : [...sameCategoryIds, productId];

      return makeSite({ ...site, productIds: nextIds, niche: targetProduct.category, status: 'draft' }, index + 1);
    }));
  };

  const handleUpdateSalePrice = (productId: string, newPrice: number) => {
    setProducts(prev => prev.map(product => product.id === productId
      ? { ...product, salePrice: newPrice }
      : product
    ));
    showAppToast('Preco de venda atualizado.');
  };

  const handleUpdateProductImage = (productId: string, newUrl: string) => {
    setProducts(prev => prev.map(product => product.id === productId
      ? { ...product, imageUrl: newUrl }
      : product
    ));
    showAppToast('Imagem do produto atualizada.');
  };

  const handleUpdateStoreConfig = (newConfig: StoreConfig) => {
    setSites(prev => prev.map(site => site.id === storeConfig.id
      ? makeSite({ ...site, ...newConfig, id: site.id })
      : site
    ));
    showAppToast('Loja atualizada.');
  };

  const handleCreateSite = () => {
    const nextIndex = sites.length + 1;
    const newSite = makeSite({
      ...DEFAULT_STORE_CONFIG,
      name: `Storefy Loja ${nextIndex}`,
      subdomain: `storefy-${nextIndex}`,
      logoUrl: STOREFY_LOGO_URL,
      productIds: []
    }, nextIndex);
    setSites(prev => [...prev, newSite]);
    setActiveSiteId(newSite.id);
    showAppToast('Nova loja criada.');
  };

  const handleDuplicateSite = () => {
    const nextIndex = sites.length + 1;
    const duplicated = makeSite({
      ...storeConfig,
      id: createId(),
      name: `${storeConfig.name} Copia`,
      subdomain: `${storeConfig.subdomain}-${nextIndex}`,
      status: 'draft',
      publishedUrl: undefined,
      publishedAt: undefined,
      productIds: []
    }, nextIndex);
    setSites(prev => [...prev, duplicated]);
    setActiveSiteId(duplicated.id);
    showAppToast('Loja duplicada.');
  };

  const handleDeleteSite = (siteId: string) => {
    const targetSite = sites.find(site => site.id === siteId);
    if (!targetSite) return;

    if (sites.length <= 1) {
      showAppToast('Crie outra loja antes de apagar esta.');
      return;
    }

    const confirmed = window.confirm(`Apagar a loja "${targetSite.name}"? Esta acao nao pode ser desfeita.`);
    if (!confirmed) return;

    setSites(prev => {
      const remainingSites = prev.filter(site => site.id !== siteId);
      if (siteId === storeConfig.id && remainingSites[0]) {
        setActiveSiteId(remainingSites[0].id);
      }
      return remainingSites;
    });
    showAppToast('Loja apagada.');
  };
  const getAuthHeaders = async () => {
    if (!supabase || !session) {
      throw new Error('Entre com sua conta para publicar pela Netlify.');
    }

    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) {
      throw new Error('Sessao expirada. Entre novamente para publicar pela Netlify.');
    }

    return { Authorization: `Bearer ${accessToken}` };
  };
  const handlePublishStore = async (): Promise<{ mode: string; url: string; error?: string }> => {
    const publishConfig: StoreConfig = { ...storeConfig, productIds: activeStoreProductIds };
    const selectedProducts = getSelectedProductsForStore(publishConfig, products);

    if (!selectedProducts.length) {
      const message = 'Selecione pelo menos um produto para publicar esta loja.';
      showAppToast(message);
      return { mode: 'error', url: '', error: message };
    }

    const html = buildStoreHtml(publishConfig, products);
    const filename = `${slugifyStore(storeConfig.name || storeConfig.subdomain || 'storefy')}-loja.html`;
    const slug = slugifyStore(`${storeConfig.subdomain || storeConfig.name}-${storeConfig.id || activeSiteId || createId('store')}`);
    const publicUrl = getPublicStoreUrl(slug);
    const publishedAt = new Date().toISOString();
    const publicConfig: StoreConfig = {
      ...publishConfig,
      status: 'published',
      publishedUrl: publicUrl,
      publishedAt,
      publicSlug: slug
    };
    const payload: PublicStorePayload = {
      slug,
      storeConfig: publicConfig,
      products: selectedProducts.map(product => ({ ...product, addedToStore: true })),
      updatedAt: publishedAt
    };

    savePublicStoreLocal(payload);
    await savePublicStore(session?.user?.id, payload);

    if (!session?.user?.id) {
      const message = 'Conecte sua conta e configure a Netlify antes de publicar.';
      showAppToast(message);
      return { mode: 'error', url: '', error: message };
    }

    try {
      const sitesForSave = sites.map((site, index) => site.id === storeConfig.id
        ? makeSite({ ...site, productIds: activeStoreProductIds }, index + 1)
        : site
      );

      await saveWorkspace(session.user.id, {
        products,
        sites: sitesForSave,
        activeSiteId: storeConfig.id || activeSiteId
      });

      const authHeaders = await getAuthHeaders();
      const response = await fetch(`/api/projects/${encodeURIComponent(storeConfig.id || slug)}/publish/netlify`, {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          siteName: storeConfig.name || storeConfig.subdomain,
          html
        })
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Nao foi possivel publicar na Netlify.');
      }

      const netlifyUrl = data.url || publicUrl;
      setSites(prev => prev.map(site => site.id === storeConfig.id
        ? {
            ...site,
            status: 'published',
            publishedUrl: netlifyUrl,
            publishedAt,
            publicSlug: slug,
            productIds: activeStoreProductIds,
            netlifySiteId: data.siteId || site.netlifySiteId,
            netlifySiteName: data.siteName || site.netlifySiteName,
            lastNetlifyDeployId: data.deployId || site.lastNetlifyDeployId
          }
        : site
      ));

      if (storeConfig.downloadHtmlFallback) {
        downloadHtml(filename, html);
      }

      showAppToast('Loja publicada na Netlify.');
      return { mode: 'netlify', url: netlifyUrl };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Conecte a Netlify nas configuracoes antes de publicar.';
      showAppToast(message);
      return { mode: 'error', url: '', error: message };
    }
  };
  if (publicStoreSlug) {
    if (publicStoreLoading) {
      return (
        <div className="grid min-h-screen place-items-center bg-[#030305] text-white">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-2xl backdrop-blur-xl">
            <Sparkles className="animate-pulse text-brand-500" size={20} />
            <span className="text-sm font-bold text-slate-200">Carregando loja...</span>
          </div>
        </div>
      );
    }

    if (!publicStore) {
      return (
        <div className="grid min-h-screen place-items-center bg-[#030305] px-5 text-white">
          <div className="max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-500">Storefy</p>
            <h1 className="mt-3 font-display text-3xl font-bold">Loja nao encontrada</h1>
            <p className="mt-2 text-sm text-slate-400">Publique novamente essa vitrine para gerar um link ativo.</p>
            <a href="/" className="mt-6 inline-flex rounded-xl bg-brand-500 px-4 py-2 text-sm font-black text-black">
              Voltar para Storefy
            </a>
          </div>
        </div>
      );
    }

    return <StorePreview storeConfig={publicStore.storeConfig} products={publicStore.products} />;
  }

  if (!authReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#030305] text-white">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 shadow-2xl backdrop-blur-xl">
          <Sparkles className="animate-pulse text-brand-500" size={20} />
          <span className="text-sm font-bold text-slate-200">Carregando acesso...</span>
        </div>
      </div>
    );
  }

  if (!session && !localAccess) {
    return <LoginScreen onLocalAccess={handleLocalAccess} />;
  }

  if (activePage === 'shop-preview') {
    return (
      <HtmlStorePreview
        html={buildStoreHtml({ ...storeConfig, productIds: activeStoreProductIds }, products)}
        storeName={storeConfig.name}
        onBackToSaaS={() => handleNavigate(previewReturnPage)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#030305] text-slate-100">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_0%,rgba(212,175,55,0.10),transparent_32%),radial-gradient(circle_at_75%_15%,rgba(20,184,166,0.08),transparent_28%)]" />

      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Fechar menu"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative h-full w-72 max-w-[88vw]">
            <Sidebar
              activePage={activePage}
              onPageChange={handleNavigate}
              storeName={storeConfig.name}
              storePrimaryColor={storeConfig.primaryColor}

            />
          </div>
        </div>
      )}

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar
            activePage={activePage}
            onPageChange={handleNavigate}
            storeName={storeConfig.name}
            storePrimaryColor={storeConfig.primaryColor}
          />
        </div>

        <main className="flex-1 lg:ml-72">
          <header className="sticky top-0 z-30 px-4 py-3 backdrop-blur-2xl sm:px-6">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#08080b]/82 px-3 py-2.5 shadow-2xl shadow-black/20 ring-1 ring-white/[0.03]">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.08] lg:hidden"
                  onClick={() => setMobileSidebarOpen(true)}
                  aria-label="Abrir menu"
                >
                  <Menu size={19} />
                </button>

                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-500/20 bg-brand-500/10">
                    <img
                      src={storeConfig.logoUrl || STOREFY_LOGO_URL}
                      alt={storeConfig.name}
                      className="h-7 w-7 object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-500">Loja ativa</p>
                      <span className={`hidden rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] sm:inline-flex ${
                        storeConfig.status === 'published'
                          ? 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20'
                          : 'bg-white/[0.05] text-slate-400 ring-1 ring-white/10'
                      }`}>
                        {storeConfig.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                    <h1 className="truncate font-display text-base font-bold leading-tight text-white sm:text-lg">
                      {storeConfig.name}
                    </h1>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenGeneratedSite(activePage)}
                  className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 text-sm font-bold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08] sm:flex"
                >
                  <ExternalLink size={16} />
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => void handlePublishStore()}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-black text-black shadow-lg shadow-brand-500/25 transition hover:bg-brand-200"
                >
                  <Sparkles size={16} />
                  Publicar
                </button>
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="hidden h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-300 transition hover:border-white/20 hover:bg-white/[0.08] sm:grid"
                  aria-label="Sair"
                  title={session?.user?.email || 'Sair'}
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </header>

          <div className="p-4 sm:p-6">
            {activePage === 'dashboard' && (
              <Dashboard
                storeConfig={storeConfig}
                products={storeProducts}
                onNavigate={handleNavigate}
                metricsScope={session?.user?.id || 'local'}
              />
            )}

            {activePage === 'wizard' && (
              <Wizard
                products={storeProducts}
                storeConfig={storeConfig}
                onUpdateStoreConfig={handleUpdateStoreConfig}
                onToggleAddProduct={handleToggleAddProduct}
                onUpdateSalePrice={handleUpdateSalePrice}
                initialStep={previewWizardStep}
                onNavigateToPreview={(returnStep) => handleOpenGeneratedSite('wizard', returnStep)}
                onPublishStore={handlePublishStore}
              />
            )}

            {activePage === 'stores' && (
              <section className="space-y-5">
                <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-500">Multi sites</p>
                    <h2 className="mt-2 font-display text-2xl font-bold text-white">Gerencie suas lojas</h2>
                    <p className="mt-1 max-w-2xl text-sm text-slate-400">
                      Crie vitrines separadas por nicho, configure o link publico e publique cada loja dentro da Storefy.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleCreateSite}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-black text-black"
                    >
                      <Plus size={16} />
                      Nova loja
                    </button>
                    <button
                      type="button"
                      onClick={handleDuplicateSite}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-bold text-white"
                    >
                      <Copy size={16} />
                      Duplicar
                    </button>
                    <button
                      type="button"
                      onClick={() => void handlePublishStore()}
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-3 py-2 text-sm font-black text-black"
                    >
                      Publicar
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {sites.map(site => {
                    const isActive = site.id === storeConfig.id;
                    const siteProductCount = getStoreProductIds(site, products).length;
                    return (
                      <article
                        key={site.id}
                        className={`rounded-2xl border p-4 text-left transition ${
                          isActive
                            ? 'border-brand-500/60 bg-brand-500/10'
                            : 'border-white/10 bg-white/[0.035] hover:bg-white/[0.06]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={site.logoUrl || STOREFY_LOGO_URL}
                              alt={site.name}
                              className="h-11 w-11 shrink-0 object-contain"
                            />
                            <div className="min-w-0">
                              <h3 className="truncate font-display text-lg font-bold text-white">{site.name}</h3>
                              <p className="truncate text-xs text-slate-400">/{site.subdomain}</p>
                            </div>
                          </div>
                          {isActive && <CheckCircle2 className="text-brand-500" size={19} />}
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                          <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-slate-300">
                            {siteProductCount} produtos
                          </span>
                          <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-slate-300">
                            {site.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </div>
                        {site.publishedUrl && (
                          <p className="mt-3 truncate text-xs text-emerald-300">{site.publishedUrl}</p>
                        )}
                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setActiveSiteId(site.id)}
                              className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                                isActive
                                  ? 'bg-brand-500 text-black'
                                  : 'border border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]'
                              }`}
                            >
                              {isActive ? 'Atual' : 'Abrir loja'}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteSite(site.id)}
                            disabled={sites.length <= 1}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                            title={sites.length <= 1 ? 'Crie outra loja antes de apagar esta.' : 'Apagar loja'}
                          >
                            <Trash2 size={14} />
                            Apagar
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {activePage === 'products' && (
              <ProductCatalog
                products={storeProducts}
                suppliers={suppliers}
                onToggleAddProduct={handleToggleAddProduct}
                onUpdateSalePrice={handleUpdateSalePrice}
                onUpdateProductImage={handleUpdateProductImage}
              />
            )}

            {activePage === 'suppliers' && <SuppliersList suppliers={suppliers} products={storeProducts} />}
            {activePage === 'marketing' && <MarketingKit storeConfig={storeConfig} />}
            {activePage === 'settings' && (
              <SettingsView
                storeConfig={storeConfig}
                onUpdateStoreConfig={handleUpdateStoreConfig}
              />
            )}
          </div>
        </main>
      </div>

      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => showAppToast('Configure os dados da loja, selecione produtos e clique em Publicar.')}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-black/70 text-slate-300 shadow-2xl backdrop-blur-xl transition hover:bg-white/10"
          aria-label="Ajuda"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {appToast && (
        <div className="fixed left-1/2 top-5 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-white/10 bg-black/90 px-4 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur-xl">
          <CheckCircle2 size={18} className="text-emerald-400" />
          {appToast}
          <button type="button" onClick={() => setAppToast(null)} aria-label="Fechar">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
