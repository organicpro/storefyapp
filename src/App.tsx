import React, { useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import {
  CheckCircle2,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  HelpCircle,
  Menu,
  PackageOpen,
  Plus,
  Rocket,
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
const LEGACY_STOREFY_LOGO_URL = 'https://i.imgur.com/nUsczZV.png';

function normalizeStoreLogoUrl(logoUrl?: string) {
  const value = (logoUrl || '').trim();
  if (!value || value === LEGACY_STOREFY_LOGO_URL) return STOREFY_LOGO_URL;
  return value;
}

function getAccountFirstName(session: Session | null) {
  const metadata = session?.user?.user_metadata || {};
  const candidate =
    metadata.first_name ||
    metadata.full_name ||
    metadata.name ||
    metadata.display_name ||
    session?.user?.email?.split('@')[0] ||
    '';

  const firstName = String(candidate)
    .trim()
    .replace(/[._-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)[0] || '';

  return firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : '';
}

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
    logoUrl: normalizeStoreLogoUrl(config.logoUrl),
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
  const heroSubtitle = config.heroSubtitle || 'Produtos selecionados, atendimento direto e compra rapida. Escolha sua oferta e fale com a loja para finalizar.';
  const ctaLabel = config.ctaLabel || 'Ver produtos';
  const accentTextColor = getReadableTextColor(config.primaryColor);
  const phone = config.whatsapp.replace(/\D/g, '');
  const normalizedLogoUrl = normalizeStoreLogoUrl(config.logoUrl);
  const formatPrice = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
  const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
  const priceFrom = activeProducts.length ? Math.min(...activeProducts.map(product => product.salePrice)).toFixed(2).replace('.', ',') : '0,00';
  const heroCategoryLabel = categories.slice(0, 2).join(' + ') || 'Ofertas selecionadas';
  const productCountLabel = activeProducts.length === 1 ? 'produto selecionado' : 'produtos selecionados';
  const whatsappFor = (product?: Product) => {
    const text = product ? `Ola! Quero comprar: ${product.name} - ${formatPrice(product.salePrice)}` : config.welcomeMessage;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };
  const getPublicDescription = (product: Product) => {
    if (product.category === 'Achados Fisicos') return 'Produto escolhido para pedido sob demanda, com confirmacao de disponibilidade pelo atendimento.';
    if (product.category === 'Infoprodutos') return 'Material digital organizado para acesso rapido, com orientacao de uso apos o pedido.';
    if (product.category === 'Assinaturas Digitais') return 'Acesso digital com orientacao de ativacao e suporte direto pelo atendimento da loja.';
    return 'Oferta digital selecionada para compra rapida, com atendimento direto para finalizar o pedido.';
  };
  const getPublicBenefits = (product: Product) => {
    const safeBenefits = product.benefits.filter(benefit => !/base:|valor de venda|subcategoria/i.test(benefit));
    const fallbackByCategory: Record<string, string[]> = {
      'Achados Fisicos': ['Oferta selecionada', 'Pedido sob demanda', 'Atendimento direto'],
      'Assinaturas Digitais': ['Ativacao orientada', 'Acesso digital', 'Suporte no atendimento'],
      'Games': ['Entrega combinada', 'Produto gamer', 'Suporte de compra'],
      'Redes Sociais': ['Servico orientado', 'Pedido conferido', 'Acompanhamento direto'],
      'Infoprodutos': ['Material digital', 'Acesso rapido', 'Conteudo organizado']
    };
    return (safeBenefits.length ? safeBenefits : fallbackByCategory[product.category] || ['Oferta selecionada', 'Atendimento direto', 'Compra rapida']).slice(0, 3);
  };
  const getProductImageView = (product: Product) => {
    const isPhysical = product.category === 'Achados Fisicos';
    const fallback = isPhysical ? '' : product.fallbackImageUrl || productFallbackImage(product);
    return { source: product.imageUrl || fallback, fallback, className: isPhysical ? 'photo' : 'logo-img' };
  };
  const buildStoreProductImage = (product: Product) => {
    const image = getProductImageView(product);
    if (!image.source) return '<div class="no-image">Imagem indisponivel</div>';
    const onError = image.fallback ? `this.onerror=null;this.src='${escapeHtml(image.fallback)}'` : 'this.remove()';
    return `<img class="${image.className}" src="${escapeHtml(image.source)}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="${onError}" />`;
  };
  const storefrontProducts = activeProducts.map(product => {
    const image = getProductImageView(product);
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || product.category,
      price: product.salePrice,
      priceLabel: formatPrice(product.salePrice),
      description: getPublicDescription(product),
      benefits: getPublicBenefits(product),
      imageUrl: image.source,
      imageClass: image.className,
      contactUrl: whatsappFor(product)
    };
  });
  const firstShareImage = storefrontProducts.find(product => product.imageUrl && !product.imageUrl.startsWith('data:'))?.imageUrl || normalizedLogoUrl;
  const seoDescription = heroSubtitle || `Catalogo da loja ${config.name} com produtos selecionados e atendimento direto.`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.name,
    description: seoDescription,
    itemListElement: storefrontProducts.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        image: product.imageUrl && !product.imageUrl.startsWith('data:') ? product.imageUrl : normalizedLogoUrl,
        description: product.description,
        category: product.category,
        offers: { '@type': 'Offer', priceCurrency: 'BRL', price: product.price.toFixed(2), availability: 'https://schema.org/InStock' }
      }
    }))
  };
  const productCards = activeProducts.map(product => `
    <article class="card" data-product-card data-product-id="${escapeHtml(product.id)}" data-category="${escapeHtml(product.category)}">
      <div class="media"><span class="deal-badge">Oferta</span>${buildStoreProductImage(product)}</div>
      <div class="card-body">
        <div class="meta-row"><span class="pill">${escapeHtml(product.subcategory || product.category)}</span><span class="availability">Disponivel</span></div>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(getPublicDescription(product))}</p>
        <ul>${getPublicBenefits(product).map(benefit => `<li>${escapeHtml(benefit)}</li>`).join('')}</ul>
        <div class="buy-row">
          <div><span>Preco</span><strong>${formatPrice(product.salePrice)}</strong></div>
          <div class="card-actions"><button type="button" class="secondary-btn" data-detail="${escapeHtml(product.id)}">Detalhes</button><button type="button" class="buy-btn" data-add="${escapeHtml(product.id)}">Comprar</button></div>
        </div>
      </div>
    </article>
  `).join('');
  const collectionLabels = Array.from(new Set(activeProducts.map(product => product.subcategory || product.category).filter(Boolean))).slice(0, 8);
  const heroProducts = activeProducts.filter(product => getProductImageView(product).source).slice(0, 5);
  const leadProduct = activeProducts[0];
  const categoryLinks = (collectionLabels.length ? collectionLabels : categories).slice(0, 5).map(category => `<a href="#produtos">${escapeHtml(category)}</a>`).join('');
  const heroMosaic = heroProducts.length
    ? heroProducts.map((product, index) => `
      <a class="mosaic-card mosaic-card-${index + 1}" href="#produtos" aria-label="${escapeHtml(product.name)}">
        ${buildStoreProductImage(product)}
        <span>${escapeHtml(product.name)}</span>
      </a>
    `).join('')
    : '<div class="mosaic-empty">Selecione produtos com imagem para montar a vitrine visual.</div>';
  const collectionTiles = collectionLabels.map(label => {
    const collectionProducts = activeProducts.filter(product => (product.subcategory || product.category) === label);
    const featuredProduct = collectionProducts.find(product => getProductImageView(product).source) || collectionProducts[0];
    const minPrice = collectionProducts.length ? Math.min(...collectionProducts.map(product => product.salePrice)) : 0;
    return `
      <a class="collection-tile" href="#produtos">
        <div class="collection-thumb">${featuredProduct ? buildStoreProductImage(featuredProduct) : '<div class="no-image">Sem imagem</div>'}</div>
        <div>
          <span>${escapeHtml(label)}</span>
          <strong>${collectionProducts.length} ${collectionProducts.length === 1 ? 'oferta' : 'ofertas'}</strong>
          <small>A partir de ${formatPrice(minPrice)}</small>
        </div>
      </a>
    `;
  }).join('');
  const filterButtons = ['Todos', ...categories].map((category, index) => `<button type="button" class="filter-btn${index === 0 ? ' active' : ''}" data-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join('');
  const faqItems = (config.faq || []).slice(0, 3).map(item => `<details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join('');
  const storefrontData = { storeName: config.name, phone, welcomeMessage: config.welcomeMessage || `Ola! Vim pela vitrine ${config.name} e gostaria de fazer um pedido.`, products: storefrontProducts };
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(config.name)}</title>
  <meta name="description" content="${escapeHtml(seoDescription)}" />
  <meta property="og:title" content="${escapeHtml(config.name)}" />
  <meta property="og:description" content="${escapeHtml(seoDescription)}" />
  <meta property="og:image" content="${escapeHtml(firstShareImage)}" />
  <meta property="og:type" content="website" />
  <script type="application/ld+json">${safeJson(structuredData)}</script>
  <style>
    :root{--sf-bg:${escapeHtml(theme.pageBg)};--sf-text:${escapeHtml(theme.text)};--sf-muted:${escapeHtml(theme.muted)};--sf-border:${escapeHtml(theme.border)};--sf-surface:${escapeHtml(theme.surface)};--sf-card:${escapeHtml(theme.card)};--sf-accent:${escapeHtml(config.primaryColor)};--sf-accent-text:${escapeHtml(accentTextColor)}}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--sf-bg);color:var(--sf-text);font-family:Inter,Arial,sans-serif;-webkit-font-smoothing:antialiased}body.modal-open{overflow:hidden}button,input{font:inherit}button{cursor:pointer}a{color:inherit;text-decoration:none}.wrap{width:min(1180px,calc(100% - 32px));margin:0 auto}.hero{position:relative;overflow:hidden;padding:22px 0 34px;background:${escapeHtml(theme.heroBg)};border-bottom:1px solid var(--sf-border)}.hero:before{content:"";position:absolute;inset:0;background:linear-gradient(110deg,rgba(255,255,255,.08),transparent 24%,transparent 68%,rgba(255,255,255,.05));pointer-events:none}.top{position:relative;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{display:flex;align-items:center;gap:12px;min-width:0}.brand img{width:104px;max-width:34vw;height:auto;object-fit:contain;border:0;background:transparent;padding:0;filter:drop-shadow(0 2px 8px rgba(0,0,0,.38))}.brand strong{font-size:20px;letter-spacing:-.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.cta,.buy-btn,.cart-checkout{display:inline-flex;align-items:center;justify-content:center;border:0;background:var(--sf-accent);color:var(--sf-accent-text);border-radius:999px;padding:12px 16px;font-weight:900;box-shadow:0 18px 42px ${escapeHtml(config.primaryColor)}3d;transition:transform .18s,filter .18s}.cta:hover,.buy-btn:hover,.cart-checkout:hover{transform:translateY(-1px);filter:saturate(1.05)}.secondary-btn{display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--sf-border);background:var(--sf-surface);color:var(--sf-text);border-radius:999px;padding:11px 14px;font-weight:900}.hero-grid{position:relative;z-index:2;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(300px,.95fr);gap:34px;align-items:end;margin-top:46px}.eyebrow{display:inline-flex;border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:999px;padding:8px 12px;color:var(--sf-text);box-shadow:0 10px 24px rgba(0,0,0,.08);font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.12em}.hero h1{font-size:clamp(40px,7vw,82px);line-height:.88;margin:16px 0 16px;max-width:850px;letter-spacing:-.06em}.hero p{max-width:690px;color:var(--sf-muted);font-size:18px;line-height:1.65}.cats{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}.cats a,.pill{border:1px solid var(--sf-border);background:var(--sf-surface);color:var(--sf-text);border-radius:999px;padding:8px 12px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.hero-panel{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:28px;padding:22px;backdrop-filter:blur(18px);box-shadow:0 28px 90px rgba(0,0,0,.38)}.hero-panel strong{display:block;font-size:40px;letter-spacing:-.05em}.hero-panel span{display:block;color:var(--sf-muted);font-size:13px;line-height:1.55}.trust{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px}.trust div{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:16px;padding:12px;color:var(--sf-muted);font-size:12px}.trust b{display:block;color:var(--sf-text);margin-bottom:4px}.mini-banner{position:relative;z-index:3;margin-top:-20px}.mini-banner-inner{border:1px solid var(--sf-border);background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(255,255,255,.05));border-radius:28px;padding:18px;display:grid;grid-template-columns:1.15fr .85fr;gap:18px;box-shadow:0 24px 80px rgba(0,0,0,.28);backdrop-filter:blur(16px)}.mini-banner h2{margin:6px 0 6px;font-size:28px;letter-spacing:-.04em}.mini-banner p{margin:0;color:var(--sf-muted);line-height:1.55}.banner-badges{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.banner-badges span{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:999px;padding:8px 10px;color:var(--sf-text);font-size:11px;font-weight:800}.spotlight{display:grid;gap:10px}.spotlight-item{text-align:left;border:1px solid var(--sf-border);background:var(--sf-surface);color:var(--sf-text);border-radius:18px;padding:12px}.spotlight-item span{display:block;color:var(--sf-muted);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.1em}.spotlight-item strong{display:block;margin-top:5px;font-size:13px;line-height:1.25}.spotlight-item small{display:block;margin-top:6px;color:var(--sf-accent);font-weight:900}.value-grid,.proof-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:28px auto}.value-card,.proof-card{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:22px;padding:16px}.value-card span{display:inline-flex;width:30px;height:30px;align-items:center;justify-content:center;border-radius:12px;background:var(--sf-accent);color:var(--sf-accent-text);font-weight:900}.value-card b,.proof-card b{display:block;margin-top:12px}.value-card p,.proof-card p{margin:5px 0 0;color:var(--sf-muted);font-size:13px;line-height:1.5}.proof-card small{display:inline-flex;color:var(--sf-accent);font-weight:1000;text-transform:uppercase;letter-spacing:.12em;font-size:10px}.section-title{display:flex;align-items:end;justify-content:space-between;gap:20px;margin:38px 0 18px}.section-title h2{margin:0;font-size:32px;letter-spacing:-.04em}.section-title p{margin:0;color:var(--sf-muted);font-size:14px}.filters{display:flex;gap:10px;overflow:auto;padding:2px 0 18px}.filter-btn{white-space:nowrap;border:1px solid var(--sf-border);background:var(--sf-surface);color:var(--sf-text);border-radius:999px;padding:10px 14px;font-size:12px;font-weight:900}.filter-btn.active{background:var(--sf-accent);color:var(--sf-accent-text);border-color:transparent}.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(268px,1fr));gap:18px;padding:0 0 34px}.card{position:relative;display:flex;flex-direction:column;min-height:100%;border:1px solid var(--sf-border);background:var(--sf-card);border-radius:24px;overflow:hidden;box-shadow:0 24px 72px rgba(0,0,0,.32);transition:transform .2s,border-color .2s}.card.is-hidden{display:none}.card:before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(135deg,rgba(255,255,255,.12),transparent 34%,rgba(255,255,255,.04));opacity:0;transition:opacity .22s}.card:hover{transform:translateY(-4px);border-color:rgba(255,255,255,.25)}.card:hover:before{opacity:1}.media{position:relative;height:202px;background:linear-gradient(135deg,rgba(255,255,255,.045),rgba(255,255,255,.01)),#050507;display:flex;align-items:center;justify-content:center;overflow:hidden}.media img{width:100%;height:100%;transition:transform .25s}.card:hover .media img{transform:scale(1.035)}.media img.photo{object-fit:cover}.media img.logo-img{object-fit:contain;padding:30px;background:#050508}.deal-badge{position:absolute;left:12px;top:12px;z-index:2;background:var(--sf-accent);color:var(--sf-accent-text);border-radius:999px;padding:7px 10px;font-size:10px;font-weight:1000;text-transform:uppercase;letter-spacing:.08em}.no-image{color:#94a3b8;font-weight:800;font-size:12px}.card-body{padding:17px;display:flex;flex-direction:column;flex:1}.meta-row{display:flex;align-items:center;justify-content:space-between;gap:8px}.availability{color:var(--sf-accent);font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.card h3{font-size:18px;line-height:1.16;margin:13px 0 8px;letter-spacing:-.03em;color:var(--sf-text)}.card p{color:var(--sf-muted);font-size:13px;line-height:1.45;min-height:56px;margin:0}.card ul{list-style:none;margin:14px 0;padding:0;display:grid;gap:7px}.card li{font-size:12px;color:var(--sf-text)}.card li:before{content:"+";color:var(--sf-accent);font-weight:900;margin-right:6px}.buy-row{display:flex;align-items:end;justify-content:space-between;border-top:1px solid var(--sf-border);padding-top:14px;margin-top:auto;gap:12px}.buy-row span{display:block;color:var(--sf-muted);font-size:10px;font-weight:900;text-transform:uppercase}.buy-row strong{display:block;font-size:22px;line-height:1;color:var(--sf-text)}.card-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
    .faq{display:grid;gap:10px;margin:18px 0 0}.faq details{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:18px;padding:14px}.faq summary{cursor:pointer;font-weight:800}.faq p{color:var(--sf-muted);margin:10px 0 0;line-height:1.55}.contact{padding:38px 0 96px;border-top:1px solid var(--sf-border);background:linear-gradient(180deg,transparent,rgba(255,255,255,.035))}.contact-box{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:28px;padding:26px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}.contact-box h2{margin:0 0 8px}.contact-box p{margin:0;color:var(--sf-muted)}.floating-cart{position:fixed;right:18px;bottom:18px;z-index:30;border:1px solid var(--sf-border);background:var(--sf-surface);color:var(--sf-text);border-radius:999px;padding:10px 12px 10px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 18px 55px rgba(0,0,0,.28);backdrop-filter:blur(16px)}.cart-badge{display:inline-flex;min-width:28px;height:28px;align-items:center;justify-content:center;border-radius:999px;background:var(--sf-accent);color:var(--sf-accent-text);font-weight:1000}.overlay{position:fixed;inset:0;background:rgba(0,0,0,.62);backdrop-filter:blur(5px);z-index:40;opacity:0;pointer-events:none;transition:opacity .18s}.overlay.open{opacity:1;pointer-events:auto}.drawer{position:fixed;right:16px;top:16px;bottom:16px;width:min(420px,calc(100% - 32px));z-index:50;border:1px solid var(--sf-border);background:var(--sf-bg);color:var(--sf-text);border-radius:28px;box-shadow:0 30px 100px rgba(0,0,0,.48);transform:translateX(calc(100% + 32px));transition:transform .22s;display:flex;flex-direction:column;overflow:hidden}.drawer.open{transform:translateX(0)}.drawer-head,.drawer-foot{padding:18px;border-bottom:1px solid var(--sf-border)}.drawer-foot{border-top:1px solid var(--sf-border);border-bottom:0;margin-top:auto}.drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.icon-btn{width:38px;height:38px;border:1px solid var(--sf-border);background:var(--sf-surface);color:var(--sf-text);border-radius:14px;font-weight:1000}.cart-list{padding:14px;overflow:auto;display:grid;gap:10px}.cart-item{display:grid;grid-template-columns:58px 1fr auto;gap:12px;align-items:center;border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:18px;padding:10px}.cart-item img{width:58px;height:58px;object-fit:cover;border-radius:14px;background:#050508}.cart-item img.logo-img{object-fit:contain;padding:9px}.cart-item b{display:block;font-size:13px;line-height:1.25}.cart-item small{color:var(--sf-muted);font-weight:800}.qty{display:flex;align-items:center;gap:6px;margin-top:8px}.qty button{width:28px;height:28px;border-radius:10px;border:1px solid var(--sf-border);background:var(--sf-bg);color:var(--sf-text);font-weight:1000}.empty-cart{padding:28px;text-align:center;color:var(--sf-muted)}.subtotal{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.subtotal strong{font-size:24px}.modal{position:fixed;inset:16px;z-index:55;display:grid;place-items:center;opacity:0;pointer-events:none;transition:opacity .18s}.modal.open{opacity:1;pointer-events:auto}.modal-card{width:min(980px,100%);max-height:calc(100vh - 32px);overflow:auto;border:1px solid var(--sf-border);background:var(--sf-bg);color:var(--sf-text);border-radius:30px;box-shadow:0 30px 110px rgba(0,0,0,.54);display:grid;grid-template-columns:minmax(260px,.9fr) minmax(0,1.1fr)}.modal-media{min-height:360px;background:#050508;display:flex;align-items:center;justify-content:center}.modal-media img{width:100%;height:100%;min-height:360px;object-fit:cover}.modal-media img.logo-img{object-fit:contain;padding:42px}.modal-body{padding:24px}.modal-body h2{font-size:34px;letter-spacing:-.04em;line-height:1;margin:12px 0}.modal-body p{color:var(--sf-muted);line-height:1.6}.modal-benefits{list-style:none;padding:0;margin:18px 0;display:grid;gap:8px}.modal-benefits li{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:14px;padding:10px;font-size:13px}.modal-price{display:flex;align-items:end;justify-content:space-between;gap:14px;border-top:1px solid var(--sf-border);padding-top:18px;margin-top:18px}.modal-price span{display:block;color:var(--sf-muted);font-size:11px;font-weight:1000;text-transform:uppercase}.modal-price strong{font-size:30px}.modal-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.toast{position:fixed;left:50%;bottom:82px;z-index:80;transform:translateX(-50%) translateY(10px);opacity:0;pointer-events:none;border:1px solid var(--sf-border);background:var(--sf-bg);color:var(--sf-text);border-radius:999px;padding:11px 16px;font-weight:900;box-shadow:0 18px 55px rgba(0,0,0,.34);transition:.18s}.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}@media(max-width:900px){.hero-grid,.mini-banner-inner,.modal-card{grid-template-columns:1fr}.value-grid,.proof-grid{grid-template-columns:repeat(2,1fr)}.hero-panel{display:none}.spotlight{grid-template-columns:1fr}.modal-media,.modal-media img{min-height:260px}}@media(max-width:620px){.top{align-items:flex-start}.brand strong{max-width:160px}.hero{padding-bottom:34px}.hero h1{font-size:42px}.hero p{font-size:15px}.mini-banner{margin-top:0}.value-grid,.proof-grid{grid-template-columns:1fr}.section-title{display:block}.media{height:172px}.contact-box{display:block}.cta{display:inline-flex;margin-top:14px}.grid{grid-template-columns:1fr}.buy-row{align-items:flex-start;flex-direction:column}.card-actions{width:100%;justify-content:stretch}.card-actions button{flex:1}.floating-cart{left:16px;right:16px;justify-content:space-between}.drawer{inset:10px;width:auto}.modal{inset:10px}.modal-body h2{font-size:28px}.modal-price{align-items:flex-start;flex-direction:column}.modal-actions button{width:100%}}
  </style>
  <style data-storefy-reference-polish>
    .promo-bar{position:relative;z-index:5;border-bottom:1px solid var(--sf-border);background:rgba(0,0,0,.22);backdrop-filter:blur(18px)}.promo-bar-inner{display:flex;align-items:center;justify-content:center;gap:14px;min-height:42px;color:var(--sf-text);font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em}.promo-bar span{color:var(--sf-accent)}.promo-bar strong{white-space:nowrap}.promo-bar a{color:var(--sf-muted)}.commerce-hero{padding-top:0;padding-bottom:48px}.commerce-hero .top{padding-top:22px}.commerce-grid{grid-template-columns:minmax(0,.92fr) minmax(360px,1.08fr);align-items:center;margin-top:42px}.hero-copy{min-width:0}.hero-actions{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:24px}.service-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:24px;max-width:760px}.service-row span{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:18px;padding:12px;color:var(--sf-text);font-size:12px;font-weight:900;box-shadow:0 14px 34px rgba(0,0,0,.14)}.hero-showcase{position:relative;z-index:2;border:1px solid var(--sf-border);background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.045));border-radius:30px;padding:16px;box-shadow:0 30px 90px rgba(0,0,0,.36);backdrop-filter:blur(22px);overflow:hidden}.hero-showcase:before{content:"";position:absolute;inset:auto -20% -34% -20%;height:58%;background:radial-gradient(circle,var(--sf-accent),transparent 62%);opacity:.18;pointer-events:none}.showcase-top{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.showcase-top span{color:var(--sf-muted);font-size:11px;font-weight:1000;text-transform:uppercase;letter-spacing:.14em}.showcase-top strong{color:var(--sf-text);font-size:26px;letter-spacing:-.04em}.mosaic{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-rows:132px;gap:10px}.mosaic-card{position:relative;min-width:0;overflow:hidden;border:1px solid var(--sf-border);border-radius:20px;background:#050507;box-shadow:0 18px 44px rgba(0,0,0,.24)}.mosaic-card-1{grid-column:span 2;grid-row:span 2}.mosaic-card img{width:100%;height:100%;display:block;object-fit:cover;background:#050507}.mosaic-card img.logo-img{object-fit:contain;padding:30px}.mosaic-card span{position:absolute;left:10px;right:10px;bottom:10px;display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;border:1px solid rgba(255,255,255,.16);background:rgba(0,0,0,.58);color:#fff;border-radius:999px;padding:7px 10px;font-size:11px;font-weight:900;backdrop-filter:blur(12px)}.mosaic-empty{grid-column:1/-1;display:grid;place-items:center;min-height:240px;border:1px dashed var(--sf-border);border-radius:22px;color:var(--sf-muted);font-weight:900;text-align:center;padding:24px}.showcase-feature{position:relative;z-index:1;margin-top:12px;border:1px solid var(--sf-border);background:rgba(0,0,0,.18);border-radius:22px;padding:14px;display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center}.showcase-feature span{color:var(--sf-muted);font-size:10px;font-weight:1000;text-transform:uppercase;letter-spacing:.14em}.showcase-feature b{display:block;margin-top:4px;color:var(--sf-text);font-size:15px;line-height:1.2}.showcase-feature strong{color:var(--sf-accent);font-size:22px;white-space:nowrap}.collection-strip{border-bottom:1px solid var(--sf-border);background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015));padding:22px 0}.strip-head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:16px}.strip-head h2{margin:0;color:var(--sf-text);font-size:24px;letter-spacing:-.04em}.strip-head p{margin:0;color:var(--sf-muted);font-size:13px}.collection-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}.collection-tile{display:grid;grid-template-columns:58px 1fr;align-items:center;gap:12px;border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:20px;padding:10px;min-width:0;transition:transform .18s,border-color .18s}.collection-tile:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.28)}.collection-thumb{width:58px;height:58px;border-radius:16px;overflow:hidden;background:#050507;display:grid;place-items:center}.collection-thumb img{width:100%;height:100%;object-fit:cover}.collection-thumb img.logo-img{object-fit:contain;padding:8px}.collection-tile span{display:block;color:var(--sf-text);font-size:12px;font-weight:1000;text-transform:uppercase;letter-spacing:.06em;line-height:1.15}.collection-tile strong{display:block;margin-top:4px;color:var(--sf-muted);font-size:12px}.collection-tile small{display:block;margin-top:4px;color:var(--sf-accent);font-size:12px;font-weight:1000}.card{border-radius:20px}.media{height:214px}.deal-badge{box-shadow:0 10px 24px rgba(0,0,0,.26)}.card h3{font-size:17px}.card p{min-height:50px}.card-actions .buy-btn{min-width:92px}.secondary-btn{min-width:90px}.contact-box{background:linear-gradient(135deg,var(--sf-surface),rgba(255,255,255,.045))}@media(max-width:980px){.commerce-grid{grid-template-columns:1fr}.hero-showcase{margin-top:4px}.service-row{grid-template-columns:1fr 1fr}.mosaic{grid-auto-rows:118px}}@media(max-width:700px){.promo-bar-inner{justify-content:flex-start;overflow:auto;padding:0 16px}.promo-bar strong{white-space:nowrap}.commerce-hero .top{align-items:center}.commerce-grid{margin-top:30px}.hero-actions .secondary-btn{width:100%}.service-row{grid-template-columns:1fr}.mosaic{grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:132px}.mosaic-card-1{grid-column:span 2;grid-row:span 1}.showcase-feature{grid-template-columns:1fr}.showcase-feature strong{white-space:normal}.strip-head{display:block}.collection-grid{grid-template-columns:1fr}.collection-strip{padding:18px 0}.media{height:220px}}
  </style></head>
<body>
  <header class="hero commerce-hero">
    <div class="promo-bar"><div class="wrap promo-bar-inner"><span>${escapeHtml(heroCategoryLabel)}</span><strong>Vitrine pronta para vender</strong><a href="#contato">Atendimento direto</a></div></div>
    <div class="wrap">
      <div class="top"><div class="brand"><img src="${escapeHtml(normalizedLogoUrl)}" alt="${escapeHtml(config.name)}" /><strong>${escapeHtml(config.name)}</strong></div><a class="cta" href="#produtos">${escapeHtml(ctaLabel)}</a></div>
      <div class="hero-grid commerce-grid">
        <div class="hero-copy"><span class="eyebrow">${escapeHtml(heroCategoryLabel)}</span><h1>${escapeHtml(heroTitle)}</h1><p>${escapeHtml(heroSubtitle)}</p><div class="cats">${categoryLinks}</div><div class="hero-actions"><a class="cta" href="#produtos">Ver ofertas</a><button type="button" class="secondary-btn" data-open-cart>Resumo do pedido</button></div><div class="service-row"><span>Produtos selecionados por nicho</span><span>Compra guiada pelo atendimento</span><span>A partir de R$ ${priceFrom}</span></div></div>
        <aside class="hero-showcase" aria-label="Destaques da vitrine"><div class="showcase-top"><span>${activeProducts.length} ${escapeHtml(productCountLabel)}</span><strong>${leadProduct ? formatPrice(leadProduct.salePrice) : `R$ ${priceFrom}`}</strong></div><div class="mosaic">${heroMosaic}</div><div class="showcase-feature"><div><span>Oferta em destaque</span><b>${leadProduct ? escapeHtml(leadProduct.name) : 'Selecione produtos para publicar'}</b></div><strong>${leadProduct ? formatPrice(leadProduct.salePrice) : `R$ ${priceFrom}`}</strong></div></aside>
      </div>
    </div>
  </header>
  ${collectionTiles ? `<section class="collection-strip"><div class="wrap"><div class="strip-head"><div><h2>Colecoes selecionadas</h2><p>Organizadas pelo tipo de produto para facilitar a escolha.</p></div><a class="secondary-btn" href="#produtos">Ver catalogo</a></div><div class="collection-grid">${collectionTiles}</div></div></section>` : ''}
  <main id="produtos" class="wrap"><div class="section-title"><h2>Produtos em destaque</h2><p>Filtre por categoria, veja detalhes ou monte um pedido com varios itens.</p></div>${filterButtons ? `<nav class="filters" aria-label="Filtros de produtos">${filterButtons}</nav>` : ''}<section class="grid" id="productGrid">${productCards || '<p>Nenhum produto selecionado ainda.</p>'}</section>${faqItems ? `<section class="faq"><div class="section-title"><h2>Duvidas rapidas</h2><p>Informacoes importantes antes de comprar.</p></div>${faqItems}</section>` : ''}</main>
  <footer id="contato" class="contact"><div class="wrap"><div class="contact-box"><div><h2>Pronto para pedir?</h2><p>Monte seu resumo ou chame a loja para confirmar a melhor oferta disponivel agora.</p></div><button type="button" class="cta" data-open-cart>Ver resumo do pedido</button></div></div></footer>
  <button type="button" class="floating-cart" data-open-cart><span>Resumo do pedido</span><span class="cart-badge" id="cartCount">0</span></button>
  <div class="overlay" id="pageOverlay" data-close-panels></div>
  <aside class="drawer" id="cartDrawer" aria-hidden="true" aria-label="Resumo do pedido"><div class="drawer-head"><div><span class="eyebrow">Pedido</span><h2 style="margin:10px 0 0">Resumo da compra</h2></div><button type="button" class="icon-btn" data-close-panels aria-label="Fechar">x</button></div><div class="cart-list" id="cartList"><div class="empty-cart">Adicione produtos para montar seu pedido.</div></div><div class="drawer-foot"><div class="subtotal"><span>Total estimado</span><strong id="cartTotal">R$ 0,00</strong></div><button type="button" class="cart-checkout" id="sendOrder" style="width:100%">Enviar pedido para atendimento</button></div></aside>
  <section class="modal" id="productModal" aria-hidden="true" aria-label="Detalhes do produto"><article class="modal-card"><div class="modal-media" id="modalMedia"></div><div class="modal-body"><button type="button" class="icon-btn" data-close-panels aria-label="Fechar" style="float:right">x</button><span class="eyebrow" id="modalCategory"></span><h2 id="modalTitle"></h2><p id="modalDescription"></p><ul class="modal-benefits" id="modalBenefits"></ul><div class="modal-price"><div><span>Preco</span><strong id="modalPrice"></strong></div><div class="modal-actions"><button type="button" class="secondary-btn" id="modalAdd">Comprar</button><button type="button" class="buy-btn" id="modalContact">Chamar atendimento</button></div></div></div></article></section>
  <div class="toast" id="toast">Produto adicionado ao pedido.</div>
  <script>
    (function(){
      var data = ${safeJson(storefrontData)};
      var products = data.products || [];
      var cart = new Map();
      var overlay = document.getElementById('pageOverlay');
      var drawer = document.getElementById('cartDrawer');
      var modal = document.getElementById('productModal');
      var toast = document.getElementById('toast');
      var toastTimer = null;
      function money(value){ return 'R$ ' + Number(value || 0).toFixed(2).replace('.', ','); }
      function findProduct(id){ return products.find(function(product){ return product.id === id; }); }
      function escapeInline(value){ return String(value || '').replace(/[&<>"']/g, function(char){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]; }); }
      function showToast(message){ if (!toast) return; toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(function(){ toast.classList.remove('show'); }, 1800); }
      function setPanels(open){ document.body.classList.toggle('modal-open', open); if (!open) { overlay.classList.remove('open'); drawer.classList.remove('open'); modal.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); modal.setAttribute('aria-hidden','true'); } }
      function openDrawer(){ overlay.classList.add('open'); drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); }
      function openModal(product){
        if (!product) return;
        var media = document.getElementById('modalMedia');
        var category = document.getElementById('modalCategory');
        var title = document.getElementById('modalTitle');
        var description = document.getElementById('modalDescription');
        var benefits = document.getElementById('modalBenefits');
        var price = document.getElementById('modalPrice');
        var add = document.getElementById('modalAdd');
        var contact = document.getElementById('modalContact');
        media.innerHTML = product.imageUrl ? '<img class="' + escapeInline(product.imageClass) + '" src="' + escapeInline(product.imageUrl) + '" alt="' + escapeInline(product.name) + '">' : '<div class="no-image">Imagem indisponivel</div>';
        category.textContent = product.subcategory || product.category;
        title.textContent = product.name;
        description.textContent = product.description;
        benefits.innerHTML = (product.benefits || []).map(function(item){ return '<li>' + escapeInline(item) + '</li>'; }).join('');
        price.textContent = product.priceLabel;
        add.setAttribute('data-add', product.id);
        contact.setAttribute('data-contact', product.id);
        overlay.classList.add('open'); modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
      }
      function addToCart(id){ var product = findProduct(id); if (!product) return; cart.set(id, (cart.get(id) || 0) + 1); renderCart(); showToast('Adicionado ao resumo do pedido.'); }
      function changeQty(id, delta){ var next = (cart.get(id) || 0) + delta; if (next <= 0) cart.delete(id); else cart.set(id, next); renderCart(); }
      function cartItems(){ return Array.from(cart.entries()).map(function(entry){ return { product: findProduct(entry[0]), qty: entry[1] }; }).filter(function(item){ return item.product; }); }
      function renderCart(){
        var list = document.getElementById('cartList');
        var count = document.getElementById('cartCount');
        var totalNode = document.getElementById('cartTotal');
        var items = cartItems();
        var totalQty = items.reduce(function(sum,item){ return sum + item.qty; }, 0);
        var total = items.reduce(function(sum,item){ return sum + item.product.price * item.qty; }, 0);
        count.textContent = String(totalQty);
        totalNode.textContent = money(total);
        if (!items.length) { list.innerHTML = '<div class="empty-cart">Adicione produtos para montar seu pedido.</div>'; return; }
        list.innerHTML = items.map(function(item){
          var product = item.product;
          var image = product.imageUrl ? '<img class="' + escapeInline(product.imageClass) + '" src="' + escapeInline(product.imageUrl) + '" alt="' + escapeInline(product.name) + '">' : '<div class="no-image">Sem imagem</div>';
          return '<div class="cart-item"><div>' + image + '</div><div><b>' + escapeInline(product.name) + '</b><small>' + escapeInline(product.priceLabel) + '</small><div class="qty"><button type="button" data-dec="' + escapeInline(product.id) + '">-</button><strong>' + item.qty + '</strong><button type="button" data-inc="' + escapeInline(product.id) + '">+</button></div></div><button type="button" class="icon-btn" data-remove="' + escapeInline(product.id) + '" aria-label="Remover">x</button></div>';
        }).join('');
      }
      function sendOrder(productId){
        var directProduct = productId ? findProduct(productId) : null;
        var items = directProduct ? [{ product: directProduct, qty: 1 }] : cartItems();
        var message;
        if (!items.length) {
          message = data.welcomeMessage || ('Ola! Vim pela vitrine ' + data.storeName + ' e gostaria de fazer um pedido.');
        } else {
          var total = items.reduce(function(sum,item){ return sum + item.product.price * item.qty; }, 0);
          var lines = ['Ola! Tenho interesse nestes produtos da loja ' + data.storeName + ':', ''];
          items.forEach(function(item){ lines.push('- ' + item.qty + 'x ' + item.product.name + ' - ' + money(item.product.price * item.qty)); });
          lines.push(''); lines.push('Total estimado: ' + money(total)); lines.push('Pode confirmar disponibilidade e proximo passo?');
          message = lines.join('\n');
        }
        window.open('https://wa.me/' + data.phone + '?text=' + encodeURIComponent(message), '_blank', 'noopener');
      }
      document.addEventListener('click', function(event){
        var target = event.target.closest('[data-add],[data-detail],[data-open-cart],[data-close-panels],[data-inc],[data-dec],[data-remove],[data-contact],[data-filter]');
        if (!target) return;
        if (target.hasAttribute('data-add')) addToCart(target.getAttribute('data-add'));
        if (target.hasAttribute('data-detail')) openModal(findProduct(target.getAttribute('data-detail')));
        if (target.hasAttribute('data-open-cart')) openDrawer();
        if (target.hasAttribute('data-close-panels')) setPanels(false);
        if (target.hasAttribute('data-inc')) changeQty(target.getAttribute('data-inc'), 1);
        if (target.hasAttribute('data-dec')) changeQty(target.getAttribute('data-dec'), -1);
        if (target.hasAttribute('data-remove')) { cart.delete(target.getAttribute('data-remove')); renderCart(); }
        if (target.hasAttribute('data-contact')) sendOrder(target.getAttribute('data-contact'));
        if (target.hasAttribute('data-filter')) {
          var filter = target.getAttribute('data-filter');
          document.querySelectorAll('[data-filter]').forEach(function(button){ button.classList.toggle('active', button === target); });
          document.querySelectorAll('[data-product-card]').forEach(function(card){ card.classList.toggle('is-hidden', filter !== 'Todos' && card.getAttribute('data-category') !== filter); });
        }
      });
      document.getElementById('sendOrder').addEventListener('click', function(){ sendOrder(); });
      document.addEventListener('keydown', function(event){ if (event.key === 'Escape') setPanels(false); });
      renderCart();
    })();
  </script>
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

  const handleEditSite = (siteId: string, wizardStep: number) => {
    setActiveSiteId(siteId);
    setPreviewWizardStep(wizardStep);
    handleNavigate('wizard');
  };

  const handlePreviewSite = (siteId: string) => {
    setActiveSiteId(siteId);
    handleOpenGeneratedSite('stores');
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
  const handlePublishStore = async (siteId = storeConfig.id): Promise<{ mode: string; url: string; error?: string }> => {
    const targetSite = sites.find(site => site.id === siteId) || storeConfig;
    const targetProductIds = getStoreProductIds(targetSite, products);
    const publishConfig: StoreConfig = { ...targetSite, productIds: targetProductIds };
    const selectedProducts = getSelectedProductsForStore(publishConfig, products);

    if (!selectedProducts.length) {
      const message = 'Selecione pelo menos um produto para publicar esta loja.';
      showAppToast(message);
      return { mode: 'error', url: '', error: message };
    }

    const html = buildStoreHtml(publishConfig, products);
    const filename = `${slugifyStore(targetSite.name || targetSite.subdomain || 'storefy')}-loja.html`;
    const slug = slugifyStore(`${targetSite.subdomain || targetSite.name}-${targetSite.id || activeSiteId || createId('store')}`);
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
      const sitesForSave = sites.map((site, index) => site.id === targetSite.id
        ? makeSite({ ...site, productIds: targetProductIds }, index + 1)
        : site
      );

      await saveWorkspace(session.user.id, {
        products,
        sites: sitesForSave,
        activeSiteId: targetSite.id || activeSiteId
      });

      const authHeaders = await getAuthHeaders();
      const response = await fetch(`/api/projects/${encodeURIComponent(targetSite.id || slug)}/publish/netlify`, {
        method: 'POST',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          siteName: targetSite.name || targetSite.subdomain,
          html
        })
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || 'Nao foi possivel publicar na Netlify.');
      }

      const netlifyUrl = data.url || publicUrl;
      setSites(prev => prev.map(site => site.id === targetSite.id
        ? {
            ...site,
            status: 'published',
            publishedUrl: netlifyUrl,
            publishedAt,
            publicSlug: slug,
            productIds: targetProductIds,
            netlifySiteId: data.siteId || site.netlifySiteId,
            netlifySiteName: data.siteName || site.netlifySiteName,
            lastNetlifyDeployId: data.deployId || site.lastNetlifyDeployId
          }
        : site
      ));

      if (targetSite.downloadHtmlFallback) {
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

      <div className="relative z-10 flex min-h-screen overflow-x-hidden">
        <div className="hidden shrink-0 lg:sticky lg:top-0 lg:block lg:h-screen">
          <Sidebar
            activePage={activePage}
            onPageChange={handleNavigate}
            storeName={storeConfig.name}
            storePrimaryColor={storeConfig.primaryColor}
          />
        </div>

        <main className="min-w-0 flex-1">
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
                      src={normalizeStoreLogoUrl(storeConfig.logoUrl)}
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
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-brand-500 px-3 text-sm font-black text-black shadow-lg shadow-brand-500/25 transition hover:bg-brand-200 sm:px-4"
                >
                  <Sparkles size={16} />
                  <span className="hidden sm:inline">Publicar</span>
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
                accountName={getAccountFirstName(session)}
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
              <section className="space-y-6">
                <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-500">Multi sites</p>
                    <h2 className="mt-2 font-display text-2xl font-bold text-white">Gerencie e edite suas lojas</h2>
                    <p className="mt-1 max-w-2xl text-sm text-slate-400">
                      Cada loja tem produtos, identidade, pagina e publicacao separados. Abra uma loja para editar sem misturar catalogos.
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
                      Duplicar atual
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 xl:grid-cols-[0.92fr_1.35fr]">
                  <aside className="rounded-3xl border border-brand-500/30 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.14),transparent_32%),rgba(255,255,255,0.035)] p-5 text-left shadow-2xl shadow-black/25">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={normalizeStoreLogoUrl(storeConfig.logoUrl)}
                          alt={storeConfig.name}
                          className="h-14 w-14 shrink-0 object-contain"
                        />
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-brand-500">Loja ativa</p>
                          <h3 className="mt-1 truncate font-display text-2xl font-bold text-white">{storeConfig.name}</h3>
                          <p className="truncate text-xs text-slate-400">/{storeConfig.subdomain}</p>
                        </div>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] font-black uppercase text-slate-300">
                        {storeConfig.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Produtos</p>
                        <strong className="mt-1 block text-lg text-white">{getStoreProductIds(storeConfig, products).length}</strong>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tema</p>
                        <strong className="mt-1 block truncate text-sm text-white">{storeConfig.themePreset || 'obsidian'}</strong>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Netlify</p>
                        <strong className="mt-1 block text-sm text-white">{storeConfig.netlifySiteName ? 'Ativo' : 'Novo'}</strong>
                      </div>
                    </div>

                    {storeConfig.publishedUrl && (
                      <a href={storeConfig.publishedUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-3 text-xs font-bold text-emerald-200 transition hover:bg-emerald-500/15">
                        <ExternalLink size={14} />
                        <span className="truncate">{storeConfig.publishedUrl}</span>
                      </a>
                    )}

                    <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button type="button" onClick={() => handleEditSite(storeConfig.id || activeSiteId, 3)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-white transition hover:bg-white/[0.08]">
                        <Edit3 size={14} /> Identidade
                      </button>
                      <button type="button" onClick={() => handleEditSite(storeConfig.id || activeSiteId, 2)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-white transition hover:bg-white/[0.08]">
                        <PackageOpen size={14} /> Produtos
                      </button>
                      <button type="button" onClick={() => handleEditSite(storeConfig.id || activeSiteId, 4)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-white transition hover:bg-white/[0.08]">
                        <Store size={14} /> Pagina
                      </button>
                      <button type="button" onClick={() => handlePreviewSite(storeConfig.id || activeSiteId)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-white transition hover:bg-white/[0.08]">
                        <Eye size={14} /> Visualizar
                      </button>
                    </div>

                    <button type="button" onClick={() => void handlePublishStore(storeConfig.id)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-black text-black shadow-[0_18px_42px_rgba(212,175,55,0.22)] transition hover:bg-brand-200">
                      <Rocket size={16} /> Publicar loja ativa
                    </button>
                  </aside>

                  <div className="grid gap-4 md:grid-cols-2">
                    {sites.map(site => {
                      const isActive = site.id === storeConfig.id;
                      const siteProductCount = getStoreProductIds(site, products).length;
                      return (
                        <article
                          key={site.id}
                          className={isActive
                            ? 'rounded-2xl border border-brand-500/60 bg-brand-500/10 p-4 text-left transition'
                            : 'rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:bg-white/[0.06]'}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <button type="button" onClick={() => setActiveSiteId(site.id)} className="flex min-w-0 items-center gap-3 text-left">
                              <img
                                src={normalizeStoreLogoUrl(site.logoUrl)}
                                alt={site.name}
                                className="h-11 w-11 shrink-0 object-contain"
                              />
                              <span className="min-w-0">
                                <span className="block truncate font-display text-lg font-bold text-white">{site.name}</span>
                                <span className="block truncate text-xs text-slate-400">/{site.subdomain}</span>
                              </span>
                            </button>
                            {isActive && <CheckCircle2 className="shrink-0 text-brand-500" size={19} />}
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                            <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-slate-300">{siteProductCount} produtos</span>
                            <span className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-slate-300">{site.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                          </div>

                          {site.publishedUrl && (
                            <a href={site.publishedUrl} target="_blank" rel="noreferrer" className="mt-3 block truncate rounded-xl border border-emerald-400/15 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300">
                              {site.publishedUrl}
                            </a>
                          )}

                          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                            <button type="button" onClick={() => setActiveSiteId(site.id)} className={isActive ? 'rounded-xl bg-brand-500 px-3 py-2 text-xs font-black text-black' : 'rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/[0.08]'}>
                              {isActive ? 'Atual' : 'Abrir'}
                            </button>
                            <button type="button" onClick={() => handleEditSite(site.id, 3)} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/[0.08]">Editar</button>
                            <button type="button" onClick={() => handleEditSite(site.id, 2)} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/[0.08]">Produtos</button>
                            <button type="button" onClick={() => handleEditSite(site.id, 4)} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/[0.08]">Pagina</button>
                            <button type="button" onClick={() => handlePreviewSite(site.id)} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-black text-slate-200 hover:bg-white/[0.08]">Visualizar</button>
                            <button type="button" onClick={() => void handlePublishStore(site.id)} className="rounded-xl bg-brand-500 px-3 py-2 text-xs font-black text-black">Publicar</button>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteSite(site.id)}
                            disabled={sites.length <= 1}
                            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
                            title={sites.length <= 1 ? 'Crie outra loja antes de apagar esta.' : 'Apagar loja'}
                          >
                            <Trash2 size={14} />
                            Apagar loja
                          </button>
                        </article>
                      );
                    })}
                  </div>
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
