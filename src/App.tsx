import React, { useEffect, useMemo, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import {
  CheckCircle2,
  ChevronDown,
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
  X,
  Moon,
  User,
  Globe
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Wizard from './components/Wizard';
import OperationStudio from './components/OperationStudio';
import StoresHub from './components/StoresHub';
import ProductCatalog from './components/ProductCatalog';
import type { MarketplaceImportInput } from './components/MarketplaceImporter';
import ProductRanking from './components/ProductRanking';
import SuppliersList from './components/SuppliersList';
import Academy from './components/Academy';
import MarketingKit from './components/MarketingKit';
import SettingsView from './components/SettingsView';
import StorePreview from './components/StorePreview';
import LoginScreen from './components/LoginScreen';
import AdminCodes from './components/AdminCodes';
import { DEFAULT_STORE_CONFIG, INITIAL_PRODUCTS, INITIAL_SUPPLIERS } from './data';
import { isSupabaseConfigured, supabase } from './lib/supabase';
import { loadPublicStore, PublicStorePayload, savePublicStore } from './lib/publicStores';
import { loadWorkspace, saveWorkspace } from './lib/workspaceSync';
import { loadAccessProfile } from './lib/access';
import { productFallbackImage } from './productImages';
import { Product, StoreConfig, Supplier, UserAccessProfile } from './types';
import { useLanguage } from './i18n/LanguageContext';

const DATA_VERSION = '2026-08-16-velods-846-v2';
const STOREFY_LOGO_URL = '/storefy-logo.png';
const LEGACY_STOREFY_LOGO_URL = 'https://i.imgur.com/nUsczZV.png';

function normalizeStoreLogoUrl(logoUrl?: string) {
  const value = (logoUrl || '').trim();
  if (value === LEGACY_STOREFY_LOGO_URL || value === STOREFY_LOGO_URL) return '';
  return value;
}

function getAccountDisplayName(session: Session | null, localAccountName = '') {
  const localName = localAccountName.trim().replace(/[._-]+/g, ' ');
  if (localName) return localName;

  const metadata = session?.user?.user_metadata || {};
  const candidate =
    metadata.display_name ||
    metadata.full_name ||
    metadata.name ||
    metadata.first_name ||
    session?.user?.email?.split('@')[0] ||
    '';

  const displayName = String(candidate)
    .trim()
    .replace(/[._-]+/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .join(' ');

  return displayName ? displayName.charAt(0).toUpperCase() + displayName.slice(1) : '';
}

const STORAGE_KEYS = {
  products: 'storefy.front.products',
  productsVersion: 'storefy.front.productsVersion',
  sites: 'storefy.front.sites',
  activeSiteId: 'storefy.front.activeSiteId',
  storeConfig: 'storefy.front.config',
  accountName: 'storefy.front.accountName',
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
  const availableIds = new Set(products.map(product => product.id));
  return Array.from(new Set((config.productIds || []).filter((id) => availableIds.has(id))));
}

function applyStoreSelection(products: Product[], productIds: string[]) {
  const selected = new Set(productIds);
  return products.map(product => ({ ...product, addedToStore: selected.has(product.id) }));
}

function isCustomProduct(product: Product) {
  return product.id.startsWith('custom-')
    || product.id.startsWith('imported-')
    || product.supplier === 'Produto próprio'
    || product.supplier.startsWith('Marketplace •');
}

const physicalBaselineById = new Map(
  INITIAL_PRODUCTS
    .filter(product => product.category === 'Achados Fisicos')
    .map(product => [product.id, product])
);

function reconcileProducts(sourceProducts?: Product[]) {
  const storedProducts = Array.isArray(sourceProducts) ? sourceProducts : [];
  const physicalOverrides = new Map(
    storedProducts
      .filter(product => product.category === 'Achados Fisicos' && !isCustomProduct(product))
      .map(product => [product.id, product])
  );
  const customProducts = storedProducts.filter(isCustomProduct);
  const nonPhysicalProducts = storedProducts.filter(product =>
    product.category !== 'Achados Fisicos'
    && !isCustomProduct(product)
  );
  const baselineNonPhysical = INITIAL_PRODUCTS.filter(product => product.category !== 'Achados Fisicos');
  const knownNonPhysicalIds = new Set(nonPhysicalProducts.map(product => product.id));
  const mergedNonPhysical = [
    ...customProducts,
    ...nonPhysicalProducts,
    ...baselineNonPhysical.filter(product => !knownNonPhysicalIds.has(product.id))
  ];

  return [
    ...mergedNonPhysical,
    ...INITIAL_PRODUCTS
      .filter(product => product.category === 'Achados Fisicos')
      .map(product => {
        const override = physicalOverrides.get(product.id);
        return override
          ? {
            ...product,
            salePrice: typeof override.salePrice === 'number' ? override.salePrice : product.salePrice,
            imageUrl: override.imageUrl && override.imageUrl !== product.imageUrl ? override.imageUrl : product.imageUrl,
            addedToStore: Boolean(override.addedToStore)
          }
          : product;
      })
  ];
}

function productsForPersistence(products: Product[]) {
  return products.flatMap(product => {
    if (isCustomProduct(product) || product.category !== 'Achados Fisicos') return [product];

    const baseline = physicalBaselineById.get(product.id);
    if (!baseline) return [];

    const patch: Product = {
      ...baseline,
      images: undefined,
      variants: undefined,
      descriptionHtml: undefined,
      descriptionText: undefined,
      benefits: [],
      salePrice: product.salePrice,
      imageUrl: product.imageUrl,
      addedToStore: product.addedToStore
    };

    const changed = product.addedToStore
      || product.salePrice !== baseline.salePrice
      || product.imageUrl !== baseline.imageUrl;

    return changed ? [patch] : [];
  });
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

function looksLikeGeneratedStoreCopy(value?: string) {
  return !value?.trim() || /pronta para vender|produtos selecionados|produtos organizados|compra rapida|sua audiencia|vitrine pronta|em minutos|loja live/i.test(value);
}

function getAntiAiStorefrontVoice(category?: string) {
  switch (category) {
    case 'Achados Fisicos':
      return {
        label: 'Achados da loja',
        subtitle: (collection: string, count: number, lead: string) => `${count} itens de ${collection.toLowerCase()} com foto, preco e pedido pelo atendimento. Comece por ${lead}.`,
        services: ['Fotos e preco antes do contato', 'Pedido conferido pela loja'],
        collectionTitle: 'Comprar por tipo',
        collectionText: 'Atalhos para comparar os itens sem percorrer o catalogo inteiro.',
        productTitle: 'Catalogo',
        productText: 'Veja o item, confira o valor e envie o pedido para a loja.',
        footerTitle: 'Quer fechar algum item?',
        footerText: 'Envie o resumo para confirmar disponibilidade, variacao e proximo passo.'
      };
    case 'Assinaturas Digitais':
      return {
        label: 'Assinaturas e acessos',
        subtitle: (collection: string, count: number, lead: string) => `${count} opcoes de ${collection.toLowerCase()} para comparar valor e chamar a loja. Destaque de hoje: ${lead}.`,
        services: ['Valor claro antes do contato', 'Ativacao combinada com a loja'],
        collectionTitle: 'Escolha por servico',
        collectionText: 'Separe por plataforma antes de chamar o atendimento.',
        productTitle: 'Planos disponiveis',
        productText: 'Abra o item para ver detalhes e enviar o pedido certo.',
        footerTitle: 'Precisa confirmar um acesso?',
        footerText: 'Mande o resumo para a loja validar disponibilidade e forma de ativacao.'
      };
    case 'Games':
      return {
        label: 'Games e contas',
        subtitle: (collection: string, count: number, lead: string) => `${count} produtos gamer separados por plataforma e preco. Um dos destaques: ${lead}.`,
        services: ['Plataforma e preco visiveis', 'Entrega combinada no atendimento'],
        collectionTitle: 'Filtre por plataforma',
        collectionText: 'Encontre o tipo de produto antes de montar o pedido.',
        productTitle: 'Ofertas gamer',
        productText: 'Compare valores, abra detalhes e chame a loja com o pedido pronto.',
        footerTitle: 'Vai levar qual item?',
        footerText: 'Envie o resumo para a loja confirmar entrega, conta ou ativacao.'
      };
    case 'Redes Sociais':
      return {
        label: 'Servicos digitais',
        subtitle: (collection: string, count: number, lead: string) => `${count} servicos de ${collection.toLowerCase()} com escopo simples antes do atendimento. Destaque: ${lead}.`,
        services: ['Escopo antes do pedido', 'Atendimento para confirmar prazo'],
        collectionTitle: 'Escolha o servico',
        collectionText: 'Veja o tipo de entrega antes de chamar a loja.',
        productTitle: 'Servicos disponiveis',
        productText: 'Confira detalhes e envie o pedido com o item certo.',
        footerTitle: 'Quer validar um servico?',
        footerText: 'Envie o resumo para confirmar prazo, perfil e proximo passo.'
      };
    case 'Infoprodutos':
      return {
        label: 'Guias e materiais',
        subtitle: (collection: string, count: number, lead: string) => `${count} materiais de ${collection.toLowerCase()} em uma vitrine direta. Comece por ${lead}.`,
        services: ['Tema e valor visiveis', 'Entrega digital combinada'],
        collectionTitle: 'Navegue por tema',
        collectionText: 'Escolha o assunto antes de abrir os detalhes.',
        productTitle: 'Materiais digitais',
        productText: 'Veja o conteudo, confira o valor e envie o pedido para a loja.',
        footerTitle: 'Quer receber um material?',
        footerText: 'Envie o resumo para confirmar entrega e forma de acesso.'
      };
    default:
      return {
        label: 'Catalogo da loja',
        subtitle: (collection: string, count: number, lead: string) => `${count} ofertas de ${collection.toLowerCase()} com preco visivel. Destaque: ${lead}.`,
        services: ['Preco antes do contato', 'Pedido enviado para a loja'],
        collectionTitle: 'Comprar por categoria',
        collectionText: 'Use os atalhos para comparar sem perder tempo.',
        productTitle: 'Catalogo',
        productText: 'Abra detalhes ou envie um pedido com os itens escolhidos.',
        footerTitle: 'Quer confirmar algum produto?',
        footerText: 'Envie o resumo para a loja validar disponibilidade e proximo passo.'
      };
  }
}
function buildStoreHtml(config: StoreConfig, products: Product[], userLevel = 1) {
  const activeProducts = getSelectedProductsForStore(config, products);
  const levelBadge = userLevel === 10 ? '&#128293; SOCIO NIVEL 10' : '&#128100; NIVEL 1';
  const categories = Array.from(new Set(activeProducts.map(product => product.category)));
  const collectionLabels = Array.from(new Set(activeProducts.map(product => product.subcategory || product.category).filter(Boolean))).slice(0, 8);
  const pricedProducts = activeProducts.filter(product => product.salePrice > 0);
  const leadProduct = pricedProducts[0] || activeProducts[0];
  const theme = getStoreTheme(config);
  const rawHeroTitle = (config.heroTitle || '').trim();
  const rawHeroSubtitle = (config.heroSubtitle || '').trim();
  const ctaLabel = config.ctaLabel || 'Ver produtos';
  const accentTextColor = getReadableTextColor(config.primaryColor);
  const phone = config.whatsapp.replace(/\D/g, '');
  const normalizedLogoUrl = normalizeStoreLogoUrl(config.logoUrl);
  const formatPrice = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;
  const formatPublicPrice = (value: number) => value > 0 ? formatPrice(value) : 'Consultar';
  const safeJson = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');
  const priceFromValue = pricedProducts.length ? Math.min(...pricedProducts.map(product => product.salePrice)) : 0;
  const priceFrom = priceFromValue.toFixed(2).replace('.', ',');
  const priceFromLabel = priceFromValue > 0 ? `A partir de R$ ${priceFrom}` : 'Valores no atendimento';
  const storefrontVoice = getAntiAiStorefrontVoice(categories[0]);
  const primaryCollection = collectionLabels[0] || categories[0] || config.niche || 'Catalogo';
  const leadProductName = leadProduct?.name || primaryCollection;
  const heroCategoryLabel = storefrontVoice.label;
  const genericStoreName = /^(loja live|storefy loja|storefy digital|minha loja)$/i.test(config.name.trim());
  const heroTitle = looksLikeGeneratedStoreCopy(rawHeroTitle) ? (genericStoreName ? primaryCollection : config.name) : rawHeroTitle;
  const heroSubtitle = looksLikeGeneratedStoreCopy(rawHeroSubtitle)
    ? storefrontVoice.subtitle(primaryCollection, activeProducts.length, leadProductName)
    : rawHeroSubtitle;
  const productCountLabel = activeProducts.length === 1 ? 'produto' : 'produtos';
  const whatsappFor = (product?: Product) => {
    const text = product ? `Ola! Quero comprar: ${product.name} - ${formatPublicPrice(product.salePrice)}` : config.welcomeMessage;
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };
  const getPublicDescription = (product: Product) => {
    const importedDescription = (product.descriptionText || product.descriptionHtml?.replace(/<[^>]*>/g, ' ') || '')
      .replace(/\s+/g, ' ')
      .trim();
    if (importedDescription) return importedDescription.slice(0, 520);
    if (product.category === 'Achados Fisicos') return 'Veja foto, preco e detalhes antes de chamar a loja para confirmar disponibilidade.';
    if (product.category === 'Infoprodutos') return 'Material digital com tema claro, valor visivel e entrega combinada pela loja.';
    if (product.category === 'Assinaturas Digitais') return 'Assinatura ou acesso digital com valor visivel e ativacao confirmada no atendimento.';
    if (product.category === 'Games') return 'Produto gamer com plataforma, valor e entrega confirmados antes do pedido.';
    if (product.category === 'Redes Sociais') return 'Servico digital com escopo e prazo confirmados antes de fechar.';
    return 'Produto com valor visivel e detalhes conferidos antes do pedido.';
  };
  const getPublicBenefits = (product: Product) => {
    const safeBenefits = product.benefits.filter(benefit => !/base:|valor de venda|subcategoria|alta procura|boa opcao/i.test(benefit));
    const fallbackByCategory: Record<string, string[]> = {
      'Achados Fisicos': ['Foto do produto', 'Preco antes do contato', 'Confirmacao pela loja'],
      'Assinaturas Digitais': ['Valor do acesso', 'Ativacao combinada', 'Suporte da loja'],
      'Games': ['Plataforma indicada', 'Entrega combinada', 'Detalhes antes do pedido'],
      'Redes Sociais': ['Escopo do servico', 'Prazo confirmado', 'Pedido conferido'],
      'Infoprodutos': ['Tema definido', 'Entrega digital', 'Acesso combinado']
    };
    return (safeBenefits.length ? safeBenefits : fallbackByCategory[product.category] || ['Preco visivel', 'Detalhes do item', 'Pedido conferido']).slice(0, 3);
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
      priceLabel: formatPublicPrice(product.salePrice),
      description: getPublicDescription(product),
      benefits: getPublicBenefits(product),
      imageUrl: image.source,
      imageClass: image.className,
      isPhysical: product.category === 'Achados Fisicos',
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
          <div><span>Preco</span><strong>${formatPublicPrice(product.salePrice)}</strong></div>
          <div class="card-actions"><button type="button" class="secondary-btn" data-detail="${escapeHtml(product.id)}">Detalhes</button><button type="button" class="buy-btn" data-add="${escapeHtml(product.id)}">Comprar</button></div>
        </div>
      </div>
    </article>
  `).join('');
  const categoryLinks = (collectionLabels.length ? collectionLabels : categories).slice(0, 5).map(category => `<a href="#produtos">${escapeHtml(category)}</a>`).join('');
  const leadProductPriceLabel = leadProduct?.salePrice > 0 ? formatPrice(leadProduct.salePrice) : priceFromLabel;
  const leadProductImage = leadProduct ? buildStoreProductImage(leadProduct) : '<div class="no-image">Nenhum produto selecionado</div>';
  const collectionTiles = collectionLabels.map(label => {
    const collectionProducts = activeProducts.filter(product => (product.subcategory || product.category) === label);
    const featuredProduct = collectionProducts.find(product => getProductImageView(product).source) || collectionProducts[0];
    const collectionPrices = collectionProducts.map(product => product.salePrice).filter(price => price > 0);
    const minPrice = collectionPrices.length ? Math.min(...collectionPrices) : 0;
    return `
      <a class="collection-tile" href="#produtos">
        <div class="collection-thumb">${featuredProduct ? buildStoreProductImage(featuredProduct) : '<div class="no-image">Sem imagem</div>'}</div>
        <div>
          <span>${escapeHtml(label)}</span>
          <strong>${collectionProducts.length} ${collectionProducts.length === 1 ? 'oferta' : 'ofertas'}</strong>
          <small>${minPrice > 0 ? `A partir de ${formatPrice(minPrice)}` : 'Consultar valores'}</small>
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
    .faq{display:grid;gap:10px;margin:18px 0 0}.faq details{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:18px;padding:14px}.faq summary{cursor:pointer;font-weight:800}.faq p{color:var(--sf-muted);margin:10px 0 0;line-height:1.55}.contact{padding:38px 0 96px;border-top:1px solid var(--sf-border);background:linear-gradient(180deg,transparent,rgba(255,255,255,.035))}.contact-box{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:28px;padding:26px;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap}.contact-box h2{margin:0 0 8px}.contact-box p{margin:0;color:var(--sf-muted)}.floating-cart{position:fixed;right:18px;bottom:18px;z-index:30;border:1px solid var(--sf-border);background:var(--sf-surface);color:var(--sf-text);border-radius:999px;padding:10px 12px 10px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 18px 55px rgba(0,0,0,.28);backdrop-filter:blur(16px)}.cart-badge{display:inline-flex;min-width:28px;height:28px;align-items:center;justify-content:center;border-radius:999px;background:var(--sf-accent);color:var(--sf-accent-text);font-weight:1000}.overlay{position:fixed;inset:0;background:rgba(0,0,0,.62);backdrop-filter:blur(5px);z-index:40;opacity:0;pointer-events:none;transition:opacity .18s}.overlay.open{opacity:1;pointer-events:auto}.drawer{position:fixed;right:16px;top:16px;bottom:16px;width:min(420px,calc(100% - 32px));z-index:50;border:1px solid var(--sf-border);background:var(--sf-bg);color:var(--sf-text);border-radius:28px;box-shadow:0 30px 100px rgba(0,0,0,.48);transform:translateX(calc(100% + 32px));transition:transform .22s;display:flex;flex-direction:column;overflow:hidden}.drawer.open{transform:translateX(0)}.drawer-head,.drawer-foot{padding:18px;border-bottom:1px solid var(--sf-border)}.drawer-foot{border-top:1px solid var(--sf-border);border-bottom:0;margin-top:auto}.drawer-head{display:flex;align-items:center;justify-content:space-between;gap:12px}.icon-btn{width:38px;height:38px;border:1px solid var(--sf-border);background:var(--sf-surface);color:var(--sf-text);border-radius:14px;font-weight:1000}.cart-list{padding:14px;overflow:auto;display:grid;gap:10px}.cart-item{display:grid;grid-template-columns:58px 1fr auto;gap:12px;align-items:center;border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:18px;padding:10px}.cart-item img{width:58px;height:58px;object-fit:cover;border-radius:14px;background:#050508}.cart-item img.logo-img{object-fit:contain;padding:9px}.cart-item b{display:block;font-size:13px;line-height:1.25}.cart-item small{color:var(--sf-muted);font-weight:800}.qty{display:flex;align-items:center;gap:6px;margin-top:8px}.qty button{width:28px;height:28px;border-radius:10px;border:1px solid var(--sf-border);background:var(--sf-bg);color:var(--sf-text);font-weight:1000}.empty-cart{padding:28px;text-align:center;color:var(--sf-muted)}.subtotal{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.subtotal strong{font-size:24px}.delivery-note{display:none;margin:0 0 12px;border:1px solid color-mix(in srgb,var(--sf-accent) 42%,var(--sf-border));background:color-mix(in srgb,var(--sf-accent) 12%,var(--sf-surface));border-radius:16px;padding:11px 12px;color:var(--sf-text);font-size:12px;line-height:1.45;font-weight:800}.delivery-note strong{display:block;margin-bottom:3px}.delivery-note.visible{display:block}.modal{position:fixed;inset:16px;z-index:55;display:grid;place-items:center;opacity:0;pointer-events:none;transition:opacity .18s}.modal.open{opacity:1;pointer-events:auto}.modal-card{width:min(980px,100%);max-height:calc(100vh - 32px);overflow:auto;border:1px solid var(--sf-border);background:var(--sf-bg);color:var(--sf-text);border-radius:30px;box-shadow:0 30px 110px rgba(0,0,0,.54);display:grid;grid-template-columns:minmax(260px,.9fr) minmax(0,1.1fr)}.modal-media{min-height:360px;background:#050508;display:flex;align-items:center;justify-content:center}.modal-media img{width:100%;height:100%;min-height:360px;object-fit:cover}.modal-media img.logo-img{object-fit:contain;padding:42px}.modal-body{padding:24px}.modal-body h2{font-size:34px;letter-spacing:-.04em;line-height:1;margin:12px 0}.modal-body p{color:var(--sf-muted);line-height:1.6}.modal-benefits{list-style:none;padding:0;margin:18px 0;display:grid;gap:8px}.modal-benefits li{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:14px;padding:10px;font-size:13px}.modal-price{display:flex;align-items:end;justify-content:space-between;gap:14px;border-top:1px solid var(--sf-border);padding-top:18px;margin-top:18px}.modal-price span{display:block;color:var(--sf-muted);font-size:11px;font-weight:1000;text-transform:uppercase}.modal-price strong{font-size:30px}.modal-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.toast{position:fixed;left:50%;bottom:82px;z-index:80;transform:translateX(-50%) translateY(10px);opacity:0;pointer-events:none;border:1px solid var(--sf-border);background:var(--sf-bg);color:var(--sf-text);border-radius:999px;padding:11px 16px;font-weight:900;box-shadow:0 18px 55px rgba(0,0,0,.34);transition:.18s}.toast.show{opacity:1;transform:translateX(-50%) translateY(0)}@media(max-width:900px){.hero-grid,.mini-banner-inner,.modal-card{grid-template-columns:1fr}.value-grid,.proof-grid{grid-template-columns:repeat(2,1fr)}.hero-panel{display:none}.spotlight{grid-template-columns:1fr}.modal-media,.modal-media img{min-height:260px}}@media(max-width:620px){.top{align-items:flex-start}.brand strong{max-width:160px}.hero{padding-bottom:34px}.hero h1{font-size:42px}.hero p{font-size:15px}.mini-banner{margin-top:0}.value-grid,.proof-grid{grid-template-columns:1fr}.section-title{display:block}.media{height:172px}.contact-box{display:block}.cta{display:inline-flex;margin-top:14px}.grid{grid-template-columns:1fr}.buy-row{align-items:flex-start;flex-direction:column}.card-actions{width:100%;justify-content:stretch}.card-actions button{flex:1}.floating-cart{left:16px;right:16px;justify-content:space-between}.drawer{inset:10px;width:auto}.modal{inset:10px}.modal-body h2{font-size:28px}.modal-price{align-items:flex-start;flex-direction:column}.modal-actions button{width:100%}}
  </style>
  <style data-storefy-reference-polish>
    .hero{padding:0;background:var(--sf-bg)}.storefront-header{position:sticky;top:0;z-index:20;border-bottom:1px solid var(--sf-border);background:color-mix(in srgb,var(--sf-bg) 90%,transparent);backdrop-filter:blur(16px)}.storefront-nav{min-height:72px;display:flex;align-items:center;justify-content:space-between;gap:18px}.storefront-brand{display:flex;align-items:center;gap:12px;min-width:0}.storefront-brand img{width:104px;max-width:28vw;height:auto;object-fit:contain;border-radius:12px;background:#060607;padding:7px 9px;box-shadow:0 8px 24px rgba(0,0,0,.16)}.storefront-brand strong{color:var(--sf-text);font-size:18px;font-weight:900;letter-spacing:-.03em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.storefront-links{display:flex;align-items:center;gap:18px;margin-left:auto}.storefront-links a{color:var(--sf-muted);font-size:13px;font-weight:800}.storefront-nav-cta{box-shadow:none;padding:10px 15px}.retail-hero{border-bottom:1px solid var(--sf-border);background:linear-gradient(180deg,color-mix(in srgb,var(--sf-bg) 94%,white 6%),var(--sf-bg));padding:34px 0 30px}.retail-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,410px);gap:42px;align-items:center}.retail-copy{min-width:0}.retail-kicker{display:inline-flex;align-items:center;border:1px solid var(--sf-border);background:var(--sf-surface);color:var(--sf-muted);border-radius:999px;padding:8px 12px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.12em}.retail-copy h1{margin:16px 0 12px;color:var(--sf-text);font-size:clamp(34px,4.8vw,58px);line-height:1;letter-spacing:-.055em;max-width:720px}.retail-copy p{margin:0;color:var(--sf-muted);font-size:17px;line-height:1.62;max-width:620px}.retail-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:22px}.retail-cats{margin-top:20px}.retail-cats a{background:transparent;border-color:var(--sf-border);font-size:10px}.retail-facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:26px}.retail-facts span{border-top:1px solid var(--sf-border);padding-top:12px;color:var(--sf-muted);font-size:12px;font-weight:800;line-height:1.35}.hero-feature{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:22px;padding:14px;box-shadow:0 22px 70px rgba(0,0,0,.16)}.hero-feature-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}.hero-feature-head span{color:var(--sf-muted);font-size:11px;font-weight:1000;text-transform:uppercase;letter-spacing:.12em}.hero-feature-head strong{color:var(--sf-text);font-size:20px;font-weight:1000;white-space:nowrap}.hero-feature-media{aspect-ratio:4/3;border:1px solid var(--sf-border);border-radius:16px;overflow:hidden;background:#fff;display:grid;place-items:center}.hero-feature-media img{width:100%;height:100%;display:block}.hero-feature-media img.photo{object-fit:cover}.hero-feature-media img.logo-img{object-fit:contain;padding:34px;background:#08080a}.hero-feature-body{padding:14px 2px 2px}.hero-feature-body small{display:block;color:var(--sf-muted);font-size:10px;font-weight:1000;text-transform:uppercase;letter-spacing:.12em}.hero-feature-body b{display:block;margin-top:5px;color:var(--sf-text);font-size:17px;line-height:1.24}.hero-feature-body p{margin:8px 0 0;color:var(--sf-muted);font-size:13px;line-height:1.5}.collection-strip{border-bottom:1px solid var(--sf-border);background:var(--sf-bg);padding:24px 0}.strip-head{display:flex;align-items:end;justify-content:space-between;gap:16px;margin-bottom:14px}.strip-head h2{margin:0;color:var(--sf-text);font-size:22px;letter-spacing:-.035em}.strip-head p{margin:4px 0 0;color:var(--sf-muted);font-size:13px}.collection-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}.collection-tile{display:grid;grid-template-columns:56px 1fr;align-items:center;gap:11px;border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:16px;padding:9px;min-width:0;transition:border-color .18s,transform .18s}.collection-tile:hover{transform:translateY(-2px);border-color:color-mix(in srgb,var(--sf-accent) 45%,var(--sf-border))}.collection-thumb{width:56px;height:56px;border-radius:12px;overflow:hidden;background:#fff;display:grid;place-items:center}.collection-thumb img{width:100%;height:100%;object-fit:cover}.collection-thumb img.logo-img{object-fit:contain;padding:8px;background:#09090b}.collection-tile span{display:block;color:var(--sf-text);font-size:12px;font-weight:1000;text-transform:uppercase;letter-spacing:.055em;line-height:1.15}.collection-tile strong{display:block;margin-top:4px;color:var(--sf-muted);font-size:12px}.collection-tile small{display:block;margin-top:4px;color:var(--sf-accent);font-size:12px;font-weight:1000}.section-title{margin-top:34px}.card{border-radius:18px;box-shadow:0 16px 44px rgba(0,0,0,.14)}.media{height:214px;background:#fff}.media img.logo-img{background:#09090b}.deal-badge{border-radius:8px;box-shadow:none}.contact-box{border-radius:20px;background:var(--sf-surface)}@media(max-width:860px){.storefront-links{display:none}.retail-layout{grid-template-columns:1fr;gap:24px}.retail-facts{grid-template-columns:1fr}.hero-feature{max-width:520px}.storefront-nav{min-height:66px}.storefront-brand strong{max-width:46vw}}@media(max-width:620px){.retail-hero{padding:24px 0}.retail-copy h1{font-size:38px}.retail-copy p{font-size:15px}.retail-actions .cta,.retail-actions .secondary-btn{width:100%;margin-top:0}.collection-grid{grid-template-columns:1fr}.strip-head{display:block}.storefront-nav-cta{display:none}.hero-feature-head{align-items:flex-start;flex-direction:column}.hero-feature-head strong{white-space:normal}.media{height:220px}}
  </style>
  <style data-storefy-commerce-polish>
    .offer-bar{background:var(--sf-accent);color:var(--sf-accent-text);font-size:11px;font-weight:900;text-align:center;padding:9px 16px}.level-badge{display:inline-flex;margin-left:12px;border:1px solid currentColor;border-radius:999px;padding:3px 8px;font-size:9px;vertical-align:middle}.offer-bar span{opacity:.76;margin:0 9px}.storefront-search{position:relative;flex:0 1 280px}.storefront-search input{width:100%;height:40px;border:1px solid var(--sf-border);border-radius:10px;background:var(--sf-surface);color:var(--sf-text);padding:0 42px 0 13px;outline:none}.storefront-search input:focus{border-color:var(--sf-accent)}.storefront-search button{position:absolute;right:4px;top:4px;width:32px;height:32px;border:0;border-radius:8px;background:var(--sf-accent);color:var(--sf-accent-text);font-weight:1000}.category-nav{border-bottom:1px solid var(--sf-border);background:var(--sf-bg)}.category-nav-inner{display:flex;gap:22px;align-items:center;overflow:auto;min-height:44px;scrollbar-width:none}.category-nav a{white-space:nowrap;color:var(--sf-muted);font-size:11px;font-weight:900;text-transform:uppercase}.category-nav a:hover{color:var(--sf-accent)}.commerce-benefits{border-bottom:1px solid var(--sf-border);background:var(--sf-bg);padding:22px 0}.benefit-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;border:1px solid var(--sf-border);border-radius:16px;overflow:hidden;background:var(--sf-border)}.benefit-row div{background:var(--sf-surface);padding:16px}.benefit-row b{display:block;color:var(--sf-text);font-size:13px}.benefit-row span{display:block;margin-top:5px;color:var(--sf-muted);font-size:11px;line-height:1.45}.card{box-shadow:0 10px 32px rgba(0,0,0,.12)}.card:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--sf-accent) 45%,var(--sf-border))}.buy-btn,.secondary-btn{border-radius:10px}.social-proof{padding:46px 0;border-top:1px solid var(--sf-border)}.proof-heading{text-align:center}.proof-heading small{color:var(--sf-accent);font-size:10px;font-weight:1000;text-transform:uppercase}.proof-heading h2{margin:8px 0 5px;color:var(--sf-text);font-size:28px}.proof-heading p{margin:0;color:var(--sf-muted);font-size:13px}.review-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:22px}.review{border:1px solid var(--sf-border);background:var(--sf-surface);border-radius:16px;padding:18px}.review-stars{color:var(--sf-accent);font-size:15px;letter-spacing:2px}.review p{min-height:44px;color:var(--sf-text);font-size:13px;line-height:1.55}.review b{color:var(--sf-muted);font-size:11px}.contact{padding-bottom:34px}.footer-meta{display:flex;justify-content:space-between;gap:18px;padding-top:22px;color:var(--sf-muted);font-size:11px}.footer-meta nav{display:flex;gap:16px}.empty-search{display:none;grid-column:1/-1;padding:36px;text-align:center;border:1px dashed var(--sf-border);border-radius:16px;color:var(--sf-muted)}@media(max-width:900px){.storefront-search{order:4;flex-basis:100%}.storefront-nav{flex-wrap:wrap;padding:12px 0}.benefit-row{grid-template-columns:repeat(2,1fr)}.review-grid{grid-template-columns:1fr}.footer-meta{flex-direction:column}.category-nav-inner{gap:16px}}@media(max-width:620px){.offer-bar{font-size:10px}.offer-bar span{display:none}.benefit-row{grid-template-columns:1fr}.storefront-brand img{width:88px}.review-grid{gap:9px}.footer-meta nav{flex-wrap:wrap}}
  </style>
  <style data-storefy-reference-theme>
    body{background:#f5f6f8;color:#17191d}.wrap{width:min(1240px,calc(100% - 40px))}
    .storefront-header{background:#090a0d;border-color:#24262c}.storefront-nav{min-height:78px}.storefront-brand img{width:112px;max-height:48px;background:transparent;padding:0;border-radius:0;box-shadow:none}.storefront-brand strong{color:#fff;font-size:20px;letter-spacing:0}.storefront-links a{color:#c9ccd3}.storefront-links a:hover{color:#fff}
    .storefront-search{position:relative;flex:1 1 360px;max-width:520px;order:0}.storefront-search input{width:100%;height:44px;border:1px solid #30333b;border-radius:6px;background:#17191e;color:#fff;padding:0 48px 0 15px;outline:none}.storefront-search input::placeholder{color:#8d929c}.storefront-search input:focus{border-color:var(--sf-accent)}.storefront-search button{position:absolute;right:4px;top:4px;width:36px;height:36px;border:0;border-radius:4px;background:var(--sf-accent);color:var(--sf-accent-text);font-size:20px;font-weight:900}.storefront-nav-cta{border-radius:6px;box-shadow:none;padding:12px 16px}
    .category-nav{border-bottom:1px solid #25272d;background:#101115}.category-nav-inner{gap:26px;min-height:46px}.category-nav a{color:#b8bcc5}.category-nav a:first-child,.category-nav a:hover{color:#fff}
    .retail-hero{position:relative;overflow:hidden;border:0;background:${escapeHtml(theme.heroBg)};padding:54px 0}.retail-hero:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(4,5,8,.94) 0%,rgba(4,5,8,.72) 52%,rgba(4,5,8,.3) 100%);pointer-events:none}.retail-layout,.retail-facts{position:relative;z-index:1}.retail-layout{grid-template-columns:minmax(0,1fr) minmax(330px,430px);gap:56px}.retail-kicker{border:0;background:var(--sf-accent);color:var(--sf-accent-text);border-radius:4px;padding:8px 10px;letter-spacing:.08em}.retail-copy h1{color:#fff;font-size:clamp(42px,5.2vw,68px);line-height:1.02;letter-spacing:0;margin:18px 0 14px}.retail-copy p{color:#c8ccd5;max-width:660px}.retail-actions .cta{border-radius:6px;box-shadow:none;padding:14px 20px}.retail-actions .secondary-btn{border-color:#484b54;background:rgba(13,14,18,.72);color:#fff;border-radius:6px;padding:13px 18px}.retail-cats a{border-color:#3b3e46;background:rgba(10,11,14,.62);color:#e8e9ed;border-radius:4px}.retail-facts{border-top:1px solid rgba(255,255,255,.17);margin-top:38px;padding-top:17px}.retail-facts span{border:0;padding:0;color:#d5d7dc}
    .hero-feature{border:1px solid #2d3037;background:#111318;border-radius:8px;padding:12px;box-shadow:0 28px 70px rgba(0,0,0,.42)}.hero-feature-head span{color:#aeb2bb}.hero-feature-head strong{color:#fff}.hero-feature-media{border:0;border-radius:5px;aspect-ratio:16/11}.hero-feature-body{padding:16px 4px 6px}.hero-feature-body small{color:var(--sf-accent)}.hero-feature-body b{color:#fff;letter-spacing:0}.hero-feature-body p{color:#aeb2bb}
    .commerce-benefits{border-bottom:1px solid #e4e5e8;background:#fff;padding:0}.benefit-row{grid-template-columns:repeat(4,1fr);gap:0;border:0;border-radius:0;background:#fff}.benefit-row div{position:relative;background:#fff;padding:24px 20px 23px 58px;border-right:1px solid #e4e5e8}.benefit-row div:last-child{border:0}.benefit-icon{position:absolute;left:20px;top:24px;width:27px;height:27px;display:grid;place-items:center;border:1px solid #d9dbe0;color:var(--sf-accent);font-size:15px;font-style:normal;font-weight:900}.benefit-row b{color:#17191d}.benefit-row span{color:#6d727c}
    .collection-strip{border-bottom:1px solid #e1e3e6;background:#f5f6f8;padding:38px 0 26px}.strip-head h2,.section-title h2{color:#17191d;letter-spacing:0}.strip-head p,.section-title p{color:#717680}.collection-grid{grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}.collection-tile{border:1px solid #e0e2e6;background:#fff;border-radius:6px;padding:10px;box-shadow:0 5px 18px rgba(19,22,28,.05)}.collection-thumb{border-radius:4px}.collection-tile span{color:#17191d;letter-spacing:0}.collection-tile strong{color:#747983}.collection-tile:hover{border-color:var(--sf-accent);transform:translateY(-2px)}
    main.wrap{padding-top:8px}.section-title{margin:38px 0 18px}.section-title h2{font-size:28px}.filters{gap:8px}.filter-btn{border:1px solid #dfe1e5;background:#fff;color:#4b5059;border-radius:5px;padding:10px 14px}.filter-btn.active{background:#17191d;color:#fff;border-color:#17191d}.grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.card{border:1px solid #e0e2e6;background:#fff;border-radius:6px;box-shadow:0 8px 24px rgba(19,22,28,.07)}.card:before{display:none}.card:hover{transform:translateY(-3px);border-color:var(--sf-accent);box-shadow:0 16px 38px rgba(19,22,28,.12)}.media{height:auto;aspect-ratio:4/3;background:#f2f3f5}.media img.logo-img{background:#0b0c0f}.deal-badge{left:10px;top:10px;border-radius:3px;padding:6px 8px;letter-spacing:.04em}.card-body{padding:15px}.pill{border:0;background:#eff0f2;color:#565b64;border-radius:3px;padding:6px 7px;letter-spacing:0}.availability{color:#168b52;letter-spacing:0}.card h3{color:#17191d;font-size:16px;line-height:1.25;letter-spacing:0;margin:11px 0 7px}.card p{color:#727781;font-size:12px;min-height:52px}.card ul{margin:11px 0}.card li{color:#4c515a;font-size:11px}.buy-row{border-color:#e5e6e9;gap:8px;flex-wrap:wrap}.buy-row span{color:#7b8089;letter-spacing:0}.buy-row strong{color:#17191d;font-size:20px}.card-actions{width:100%;margin-top:12px}.card-actions .secondary-btn{display:none}.buy-btn,.secondary-btn{border-radius:5px}.card-actions .buy-btn{width:100%;padding:11px 13px;box-shadow:none}
    .social-proof{padding:54px 0;background:#fff;border-top:1px solid #e4e5e8}.proof-heading small{color:var(--sf-accent);letter-spacing:.08em}.proof-heading h2{margin:8px 0 5px;color:#17191d;font-size:29px;letter-spacing:0}.proof-heading p{color:#747983}.review-grid{gap:14px;margin-top:24px}.review{border:1px solid #e0e2e6;background:#fff;border-radius:6px;padding:20px}.review-stars{color:var(--sf-accent)}.review p{color:#30343a}.review b{color:#777c85}.faq details{border-color:#e0e2e6;background:#fff;color:#17191d;border-radius:6px}.faq p{color:#6e737c}
    .contact{padding:44px 0 34px;border-top:0;background:#0b0c0f}.contact-box{border:1px solid #292c32;background:#121419;border-radius:6px}.contact-box h2{color:#fff}.contact-box p{color:#aaaeb7}.footer-meta{padding-top:24px;color:#8c919b}.footer-meta a:hover{color:#fff}.floating-cart{border-color:#292c32;background:#111318;color:#fff;border-radius:6px}.drawer,.modal-card{border-radius:8px}.empty-search{border-color:#d8dadf;border-radius:6px;color:#737883}
    @media(max-width:1040px){.grid{grid-template-columns:repeat(3,minmax(0,1fr))}.storefront-links{display:none}}@media(max-width:900px){.storefront-search{order:4;flex-basis:100%;max-width:none}.retail-layout{grid-template-columns:1fr;gap:28px}.hero-feature{max-width:560px}.benefit-row{grid-template-columns:repeat(2,1fr)}.benefit-row div:nth-child(2){border-right:0}.benefit-row div:nth-child(-n+2){border-bottom:1px solid #e4e5e8}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:620px){.wrap{width:min(100% - 24px,1240px)}.storefront-brand img{width:88px}.retail-hero{padding:34px 0}.retail-copy h1{font-size:39px}.retail-facts{grid-template-columns:1fr;gap:8px}.benefit-row{grid-template-columns:1fr}.benefit-row div{border-right:0;border-bottom:1px solid #e4e5e8}.grid{grid-template-columns:1fr;gap:12px}.media{aspect-ratio:16/10}}
  </style></head>
<body>
  <div class="offer-bar">Compra segura <span>•</span> Atendimento direto <span>•</span> Ofertas selecionadas <b class="level-badge">${levelBadge}</b></div>
  <header class="storefront-header">
    <div class="wrap storefront-nav">
      <a class="storefront-brand" href="#">${normalizedLogoUrl ? `<img src="${escapeHtml(normalizedLogoUrl)}" alt="${escapeHtml(config.name)}" />` : ''}<strong>${escapeHtml(config.name)}</strong></a>
      <nav class="storefront-links" aria-label="Navegacao"><a href="#produtos">Produtos</a><a href="#contato">Atendimento</a></nav>
      <label class="storefront-search"><input id="storeSearch" type="search" placeholder="Buscar no catalogo" aria-label="Buscar produtos" /><button type="button" aria-label="Buscar">⌕</button></label>
      <a class="cta storefront-nav-cta" href="#produtos">${escapeHtml(ctaLabel)}</a>
    </div>
  </header>
  ${categoryLinks ? `<nav class="category-nav" aria-label="Categorias"><div class="wrap category-nav-inner"><a href="#produtos">Todas as categorias</a>${categoryLinks}</div></nav>` : ''}
  <section class="retail-hero">
    <div class="wrap retail-layout">
      <div class="retail-copy"><span class="retail-kicker">${escapeHtml(heroCategoryLabel)}</span><h1>${escapeHtml(heroTitle)}</h1><p>${escapeHtml(heroSubtitle)}</p><div class="retail-actions"><a class="cta" href="#produtos">Ver produtos</a><button type="button" class="secondary-btn" data-open-cart>Resumo do pedido</button></div><div class="cats retail-cats">${categoryLinks}</div></div>
      <aside class="hero-feature" aria-label="Produto em destaque"><div class="hero-feature-head"><span>${activeProducts.length} ${escapeHtml(productCountLabel)} no catalogo</span><strong>${escapeHtml(leadProductPriceLabel)}</strong></div><div class="hero-feature-media">${leadProductImage}</div><div class="hero-feature-body"><small>Produto em destaque</small><b>${leadProduct ? escapeHtml(leadProduct.name) : 'Selecione produtos para publicar'}</b><p>${leadProduct ? escapeHtml(getPublicDescription(leadProduct)) : 'Escolha os itens no painel para montar a vitrine.'}</p></div></aside>
    </div>
    <div class="wrap retail-facts"><span>${escapeHtml(storefrontVoice.services[0])}</span><span>${escapeHtml(storefrontVoice.services[1])}</span><span>${escapeHtml(priceFromLabel)}</span></div>
  </section>
  <section class="commerce-benefits"><div class="wrap benefit-row"><div><i class="benefit-icon">✓</i><b>Compra protegida</b><span>Confira produto e valor antes de enviar o pedido.</span></div><div><i class="benefit-icon">↗</i><b>Atendimento direto</b><span>Fale com a loja pelo WhatsApp sem intermediarios.</span></div><div><i class="benefit-icon">★</i><b>Catalogo atualizado</b><span>Produtos escolhidos e organizados por categoria.</span></div><div><i class="benefit-icon">+</i><b>Pedido simples</b><span>Monte o resumo e envie tudo em poucos cliques.</span></div></div></section>
  ${collectionTiles ? `<section class="collection-strip"><div class="wrap"><div class="strip-head"><div><h2>${escapeHtml(storefrontVoice.collectionTitle)}</h2><p>${escapeHtml(storefrontVoice.collectionText)}</p></div><a class="secondary-btn" href="#produtos">Ver catalogo</a></div><div class="collection-grid">${collectionTiles}</div></div></section>` : ''}
  <main id="produtos" class="wrap"><div class="section-title"><h2>${escapeHtml(storefrontVoice.productTitle)}</h2><p>${escapeHtml(storefrontVoice.productText)}</p></div>${filterButtons ? `<nav class="filters" aria-label="Filtros de produtos">${filterButtons}</nav>` : ''}<section class="grid" id="productGrid">${productCards || '<p>Nenhum produto selecionado ainda.</p>'}<div class="empty-search" id="emptySearch">Nenhum produto encontrado para esta busca.</div></section>${faqItems ? `<section class="faq"><div class="section-title"><h2>Duvidas rapidas</h2><p>Informacoes importantes antes de comprar.</p></div>${faqItems}</section>` : ''}</main>
  <section class="social-proof"><div class="wrap"><div class="proof-heading"><small>Atendimento que gera confianca</small><h2>Uma compra simples do inicio ao fim</h2><p>Vitrine clara, produtos organizados e contato direto com a loja.</p></div><div class="review-grid"><article class="review"><div class="review-stars">★★★★★</div><p>Encontrei o produto rapido e consegui tirar minha duvida antes de fechar.</p><b>Cliente verificado</b></article><article class="review"><div class="review-stars">★★★★★</div><p>O resumo do pedido facilitou muito o atendimento pelo WhatsApp.</p><b>Compra assistida</b></article><article class="review"><div class="review-stars">★★★★★</div><p>Catalogo organizado, preco visivel e contato sem complicacao.</p><b>Atendimento direto</b></article></div></div></section>
  <footer id="contato" class="contact"><div class="wrap"><div class="contact-box"><div><h2>${escapeHtml(storefrontVoice.footerTitle)}</h2><p>${escapeHtml(storefrontVoice.footerText)}</p></div><button type="button" class="cta" data-open-cart>Ver resumo do pedido</button></div><div class="footer-meta"><span>© ${new Date().getFullYear()} ${escapeHtml(config.name)}. Todos os direitos reservados.</span><nav><a href="#produtos">Produtos</a><a href="#contato">Atendimento</a><a href="${escapeHtml(whatsappFor())}" target="_blank" rel="noreferrer">WhatsApp</a></nav></div></div></footer>
  <button type="button" class="floating-cart" data-open-cart><span>Resumo do pedido</span><span class="cart-badge" id="cartCount">0</span></button>
  <div class="overlay" id="pageOverlay" data-close-panels></div>
  <aside class="drawer" id="cartDrawer" aria-hidden="true" aria-label="Resumo do pedido"><div class="drawer-head"><div><span class="eyebrow">Pedido</span><h2 style="margin:10px 0 0">Resumo da compra</h2></div><button type="button" class="icon-btn" data-close-panels aria-label="Fechar">x</button></div><div class="cart-list" id="cartList"><div class="empty-cart">Adicione produtos para montar seu pedido.</div></div><div class="drawer-foot"><div class="delivery-note" id="deliveryNote"><strong>Entrega dropshipping</strong><span>Produtos fisicos chegam em ate 15 dias uteis apos a confirmacao do pedido.</span></div><div class="subtotal"><span>Total estimado</span><strong id="cartTotal">R$ 0,00</strong></div><button type="button" class="cart-checkout" id="sendOrder" style="width:100%">Enviar pedido para atendimento</button></div></aside>
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
        var cat = document.getElementById('modalCategory');
        var title = document.getElementById('modalTitle');
        var desc = document.getElementById('modalDescription');
        var ben = document.getElementById('modalBenefits');
        var price = document.getElementById('modalPrice');
        var add = document.getElementById('modalAdd');
        var contact = document.getElementById('modalContact');
        media.innerHTML = '';
        if (product.imageUrl || product.imageClass !== 'photo') { var i = document.createElement('img'); i.src = product.imageUrl; i.className = product.imageClass; i.alt = product.name; media.appendChild(i); }
        cat.textContent = product.subcategory; title.textContent = product.name; desc.textContent = product.description; price.textContent = product.priceLabel;
        ben.innerHTML = product.benefits.map(function(b){ return '<li>' + escapeInline(b) + '</li>'; }).join('');
        add.onclick = function(){
          var qty = (cart.get(product.id) || 0) + 1; cart.set(product.id, qty);
          renderCart(); showToast('Produto adicionado ao pedido.');
        };
        contact.onclick = function(){ window.open(product.contactUrl, '_blank'); };
        setPanels(true); modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open');
      }

      // Fix anchor links to scroll smoothly and prevent iframe from navigating the parent
      document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          var id = this.getAttribute('href').substring(1);
          if (id === '') { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
          var target = document.getElementById(id);
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
      });


      function addToCart(id){ var product = findProduct(id); if (!product) return; cart.set(id, (cart.get(id) || 0) + 1); renderCart(); showToast('Adicionado ao resumo do pedido.'); }
      function changeQty(id, delta){ var next = (cart.get(id) || 0) + delta; if (next <= 0) cart.delete(id); else cart.set(id, next); renderCart(); }
      function cartItems(){ return Array.from(cart.entries()).map(function(entry){ return { product: findProduct(entry[0]), qty: entry[1] }; }).filter(function(item){ return item.product; }); }
      function renderCart(){
        var list = document.getElementById('cartList');
        var count = document.getElementById('cartCount');
        var totalNode = document.getElementById('cartTotal');
        var deliveryNote = document.getElementById('deliveryNote');
        var items = cartItems();
        var totalQty = items.reduce(function(sum,item){ return sum + item.qty; }, 0);
        var total = items.reduce(function(sum,item){ return sum + item.product.price * item.qty; }, 0);
        var hasPhysical = items.some(function(item){ return item.product.isPhysical; });
        count.textContent = String(totalQty);
        totalNode.textContent = money(total);
        if (deliveryNote) deliveryNote.classList.toggle('visible', hasPhysical);
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
          var hasPhysical = items.some(function(item){ return item.product.isPhysical; });
          var lines = ['Ola! Tenho interesse nestes produtos da loja ' + data.storeName + ':', ''];
          items.forEach(function(item){ lines.push('- ' + item.qty + 'x ' + item.product.name + ' - ' + money(item.product.price * item.qty)); });
          lines.push(''); lines.push('Total estimado: ' + money(total));
          if (hasPhysical) lines.push('Entrega estimada: ate 15 dias uteis apos a confirmacao do pedido.');
          lines.push('Pode confirmar disponibilidade e proximo passo?');
          message = lines.join('\\n');
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
      var searchInput = document.getElementById('storeSearch');
      if (searchInput) searchInput.addEventListener('input', function(){
        var query = searchInput.value.trim().toLowerCase();
        var visible = 0;
        document.querySelectorAll('[data-product-card]').forEach(function(card){
          var product = findProduct(card.getAttribute('data-product-id'));
          var haystack = product ? (product.name + ' ' + product.category + ' ' + product.subcategory).toLowerCase() : '';
          var matches = !query || haystack.indexOf(query) >= 0;
          card.classList.toggle('is-hidden', !matches);
          if (matches) visible += 1;
        });
        var emptySearch = document.getElementById('emptySearch');
        if (emptySearch) emptySearch.style.display = visible ? 'none' : 'block';
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
  onBackToSaaS,
  onPromotion
}: {
  html: string;
  storeName: string;
  onBackToSaaS: () => void;
  onPromotion: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-900 flex flex-col font-sans">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-0.5">Visualização da Loja</p>
            <h1 className="truncate font-sans text-base font-extrabold text-gray-900">{storeName}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onPromotion}
              className="rounded-xl bg-[#0f172a] px-4 py-2 text-[13px] font-bold text-white transition hover:bg-[#1e293b] shadow-sm"
            >
              Divulgação
            </button>
            <button
              type="button"
              onClick={onBackToSaaS}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-[13px] font-bold text-gray-700 transition hover:bg-gray-50 shadow-sm"
            >
              Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl p-3 sm:p-5 flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-xl">
          <iframe
            title={`Site gerado - ${storeName}`}
            srcDoc={html}
            className="h-[calc(100vh-140px)] w-full bg-white"
            sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          />
        </div>
      </main>
    </div>
  );
}

function App() {
  const { language, setLanguage, t } = useLanguage();
  const [activePage, setActivePage] = useState(() => window.location.pathname === '/admin/codigos' ? 'admin-codes' : window.location.pathname === '/convites' ? 'invites' : 'dashboard');
  const [previewReturnPage, setPreviewReturnPage] = useState('dashboard');
  const [previewWizardStep, setPreviewWizardStep] = useState(1);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [storeSwitcherOpen, setStoreSwitcherOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [appToast, setAppToast] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [accessProfile, setAccessProfile] = useState<UserAccessProfile | null>(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [localAccess, setLocalAccess] = useState(() => readStorage<boolean>(STORAGE_KEYS.localAuth, false));
  const [localAccountName, setLocalAccountName] = useState(() => readStorage<string>(STORAGE_KEYS.accountName, ''));
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
      ? reconcileProducts(readStorage<Product[]>(STORAGE_KEYS.products, INITIAL_PRODUCTS))
      : reconcileProducts(INITIAL_PRODUCTS);
  });
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [sites, setSites] = useState<StoreSite[]>(() => {
    const legacyConfig = readStorage<StoreConfig>(STORAGE_KEYS.storeConfig, DEFAULT_STORE_CONFIG);
    const storedSites = readStorage<StoreSite[]>(STORAGE_KEYS.sites, []);
    return storedSites.length ? storedSites.map((site, index) => makeSite(site, index + 1)) : [makeSite(legacyConfig)];
  });
  const [draftStore, setDraftStore] = useState<StoreSite | null>(null);
  const [activeSiteId, setActiveSiteId] = useState(() => readStorage<string>(STORAGE_KEYS.activeSiteId, ''));

  const storeConfig = useMemo(() => {
    if (activePage === 'wizard' && draftStore) return draftStore;
    return sites.find(site => site.id === activeSiteId) || sites[0] || makeSite(DEFAULT_STORE_CONFIG);
  }, [activeSiteId, sites, activePage, draftStore]);

  const activeStoreProductIds = useMemo(() => {
    return getStoreProductIds(storeConfig, products);
  }, [products, sites.length, storeConfig]);

  const storeProducts = useMemo(() => {
    return applyStoreSelection(products, activeStoreProductIds);
  }, [activeStoreProductIds, products]);

  const dashboardStores = useMemo(() => {
    return sites.map(site => ({
      storeConfig: site,
      products: applyStoreSelection(products, getStoreProductIds(site, products))
    }));
  }, [products, sites]);

  const accountDisplayName = getAccountDisplayName(session, !session ? localAccountName : '');
  const sessionMetadataLevel = Number(session?.user?.user_metadata?.nivel || 1);
  const sessionMetadataAdmin = session?.user?.user_metadata?.is_admin === true;
  const effectiveIsAdmin = Boolean(accessProfile?.isAdmin || sessionMetadataAdmin);
  const effectiveUserLevel = effectiveIsAdmin ? 10 : Math.max(Number(accessProfile?.level || 1), sessionMetadataLevel);

  useEffect(() => {
    document.title = 'Storefy | Operacao de nicho';
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

    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      let verifiedSession = data.session;
      if (verifiedSession) {
        const verified = await supabase.auth.getUser(verifiedSession.access_token);
        if (verified.data.user) verifiedSession = { ...verifiedSession, user: verified.data.user };
      }
      if (!mounted) return;
      setSession(verifiedSession);
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
    if (!session?.user?.id) {
      setAccessProfile(null);
      return;
    }
    let mounted = true;
    loadAccessProfile().then(profile => {
      if (mounted) setAccessProfile(profile);
    }).catch(() => {
      if (mounted) setAccessProfile({ userId: session.user.id, email: session.user.email || '', name: getAccountDisplayName(session), level: 1, partnerCode: null, isAdmin: false });
    });
    return () => { mounted = false; };
  }, [session?.user?.id]);

  useEffect(() => {
    if (!accessProfile) return;
    if ((activePage === 'admin-codes' || activePage === 'invites') && !effectiveIsAdmin && effectiveUserLevel !== 10) {
      setActivePage('dashboard');
      window.history.replaceState({}, '', '/');
    }
  }, [accessProfile, activePage, effectiveIsAdmin, effectiveUserLevel]);
  useEffect(() => {
    if (!session?.user?.id || workspaceReady) return;

    loadWorkspace(session.user.id).then(workspace => {
      if (workspace?.products?.length) {
        setProducts(reconcileProducts(workspace.products));
      } else {
        setProducts(reconcileProducts(INITIAL_PRODUCTS));
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
    try {
      window.localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(productsForPersistence(products)));
      window.localStorage.setItem(STORAGE_KEYS.productsVersion, DATA_VERSION);
    } catch {
      window.localStorage.removeItem(STORAGE_KEYS.products);
      window.localStorage.setItem(STORAGE_KEYS.productsVersion, DATA_VERSION);
    }
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
        products: productsForPersistence(products),
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
    const path = page === 'admin-codes' ? '/admin/codigos' : page === 'invites' ? '/convites' : '/';
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
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
    handleNavigate('operation');
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
    if (!products.some(product => product.id === productId)) return;

    if (draftStore && draftStore.id === storeConfig.id) {
      const currentIds = new Set(draftStore.productIds || []);
      if (currentIds.has(productId)) currentIds.delete(productId); else currentIds.add(productId);
      setDraftStore(makeSite({
        ...draftStore,
        productIds: Array.from(currentIds),
        status: 'draft'
      }, sites.length + 1));
      return;
    }

    setSites(prev => prev.map((site, index) => {
      if (site.id !== storeConfig.id) return site;
      const currentIds = new Set(site.productIds || []);
      if (currentIds.has(productId)) currentIds.delete(productId); else currentIds.add(productId);
      return makeSite({ ...site, productIds: Array.from(currentIds), status: 'draft' }, index + 1);
    }));
  };
  const handleUpdateSalePrice = (productId: string, newPrice: number) => {
    setProducts(prev => prev.map(product => product.id === productId
      ? { ...product, salePrice: newPrice }
      : product
    ));
    showAppToast('Preco de venda atualizado.');
  };

  const handleCreateCustomProduct = (input: Pick<Product, 'name' | 'salePrice' | 'category' | 'subcategory' | 'imageUrl'>) => {
    const productId = `custom-${createId()}`;
    const customProduct: Product = {
      id: productId,
      name: input.name,
      category: input.category,
      subcategory: input.subcategory,
      supplier: 'Produto próprio',
      costPrice: 0,
      salePrice: input.salePrice,
      imageUrl: input.imageUrl,
      benefits: ['Oferta personalizada', 'Atendimento direto', 'Pedido pelo WhatsApp'],
      deliverable: 'Entrega combinada diretamente com a loja.',
      addedToStore: false
    };

    setProducts(current => [customProduct, ...current]);

    if (draftStore && draftStore.id === storeConfig.id) {
      setDraftStore(makeSite({
        ...draftStore,
        productIds: Array.from(new Set([...(draftStore.productIds || []), productId])),
        status: 'draft'
      }, sites.length + 1));
    } else {
      setSites(current => current.map((site, index) => site.id === storeConfig.id
        ? makeSite({
            ...site,
            productIds: Array.from(new Set([...(site.productIds || []), productId])),
            status: 'draft'
          }, index + 1)
        : site
      ));
    }

    showAppToast('Produto próprio adicionado à loja.');
  };

  const handleImportMarketplaceProduct = (input: MarketplaceImportInput) => {
    const existing = products.find(product =>
      product.source === input.marketplace
      && ((input.externalId && product.externalId === input.externalId) || product.sourceUrl === input.sourceUrl)
    );
    const productId = existing?.id || `imported-${createId()}`;
    const importedProduct: Product = {
      ...(existing || {}),
      id: productId,
      productId,
      externalId: input.externalId || productId,
      name: input.name,
      category: 'Achados Fisicos',
      subcategory: input.marketplaceLabel,
      supplier: `Marketplace • ${input.marketplaceLabel}`,
      brand: input.brand || undefined,
      source: input.marketplace,
      costPrice: input.costPrice,
      salePrice: input.salePrice,
      originalPrice: input.costPrice,
      marginPercent: input.marginPercent,
      imageUrl: input.imageUrl,
      images: input.images.map((image, index) => ({
        productId,
        externalId: input.externalId || productId,
        imageNumber: index + 1,
        localPath: '',
        imageUrl: image,
        sourceUrl: image,
        downloadStatus: 'remote',
        fileSizeBytes: 0
      })),
      descriptionText: input.description,
      benefits: [
        `Importado do ${input.marketplaceLabel}`,
        `Margem configurada: ${input.marginPercent}%`,
        'Título, preço e imagem editáveis na Storefy'
      ],
      deliverable: 'Produto físico importado. Prazo e disponibilidade dependem do fornecedor.',
      addedToStore: false,
      sourceUrl: input.sourceUrl,
      productUrl: input.sourceUrl,
      importUrl: input.sourceUrl
    };

    setProducts(current => existing
      ? current.map(product => product.id === productId ? importedProduct : product)
      : [importedProduct, ...current]
    );

    setSites(current => current.map((site, index) => site.id === storeConfig.id
      ? makeSite({
          ...site,
          productIds: Array.from(new Set([...(site.productIds || []), productId])),
          status: 'draft'
        }, index + 1)
      : site
    ));
    showAppToast(existing ? 'Produto importado atualizado na vitrine.' : 'Produto importado e adicionado à vitrine.');
  };

  const handleUpdateProductImage = (productId: string, newUrl: string) => {
    setProducts(prev => prev.map(product => product.id === productId
      ? { ...product, imageUrl: newUrl }
      : product
    ));
    showAppToast('Imagem do produto atualizada.');
  };

  const handleUpdateStoreConfig = (newConfig: StoreConfig) => {
    if (draftStore && newConfig.id === draftStore.id) {
      setDraftStore(newConfig as StoreSite);
    } else {
      setSites(prev => prev.map(site => site.id === newConfig.id ? { ...site, ...newConfig } : site));
      showAppToast('Loja atualizada.');
    }
  };

  const handleUpdateAccountName = async (nextName: string) => {
    const cleanName = nextName.trim().replace(/\s+/g, ' ');

    if (supabase && session) {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          display_name: cleanName,
          full_name: cleanName,
          name: cleanName
        }
      });
      if (error) {
        showAppToast('Nao foi possivel atualizar o nome da conta.');
        return;
      }
      setSession(prev => prev && data.user ? { ...prev, user: data.user } : prev);
    } else {
      setLocalAccountName(cleanName);
      window.localStorage.setItem(STORAGE_KEYS.accountName, JSON.stringify(cleanName));
    }

    showAppToast('Nome de usuario atualizado.');
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
    setDraftStore(newSite);
  };

  const handleCompleteWizard = (publishMode: 'draft' | 'publish') => {
    if (draftStore) {
      setSites(prev => [...prev, draftStore]);
      setActiveSiteId(draftStore.id);
      setDraftStore(null);
      showAppToast(publishMode === 'publish' ? 'Loja criada e publicada!' : 'Loja salva como rascunho.');
    }
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

    const html = buildStoreHtml(publishConfig, products, effectiveUserLevel);
    const filename = `${slugifyStore(targetSite.name || targetSite.subdomain || 'storefy')}-loja.html`;
    const slug = slugifyStore(`${targetSite.subdomain || targetSite.name}-${targetSite.id || activeSiteId || createId('store')}`);
    const publicUrl = getPublicStoreUrl(slug);
    const publishedAt = new Date().toISOString();
    const publicConfig: StoreConfig = {
      ...publishConfig,
      status: 'published',
      publishedUrl: publicUrl,
      publishedAt,
      publicSlug: slug,
      ownerLevel: effectiveUserLevel
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
        <div className="grid min-h-screen place-items-center bg-[#f6f6f7] text-gray-900">
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-2xl backdrop-blur-xl">
            <Sparkles className="animate-pulse text-brand-500" size={20} />
            <span className="text-sm font-bold text-gray-700">Carregando loja...</span>
          </div>
        </div>
      );
    }

    if (!publicStore) {
      return (
        <div className="grid min-h-screen place-items-center bg-[#f6f6f7] px-5 text-gray-900">
          <div className="max-w-md rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center shadow-2xl backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-brand-500">Storefy</p>
            <h1 className="mt-3 font-sans text-3xl font-bold">Loja nao encontrada</h1>
            <p className="mt-2 text-sm text-gray-500">Publique novamente essa vitrine para gerar um link ativo.</p>
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
      <div className="grid min-h-screen place-items-center bg-[#f6f6f7] text-gray-900">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 shadow-2xl backdrop-blur-xl">
          <Sparkles className="animate-pulse text-brand-500" size={20} />
          <span className="text-sm font-bold text-gray-700">Carregando acesso...</span>
        </div>
      </div>
    );
  }

  if (!session && (!localAccess || isSupabaseConfigured)) {
    return <LoginScreen onLocalAccess={handleLocalAccess} />;
  }

  if (activePage === 'shop-preview') {
    return (
      <HtmlStorePreview
        html={buildStoreHtml({ ...storeConfig, productIds: activeStoreProductIds }, products, effectiveUserLevel)}
        storeName={storeConfig.name}
        onBackToSaaS={() => handleNavigate(previewReturnPage)}
        onPromotion={() => handleNavigate('promotion')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-900 font-sans flex flex-col">
      <div className="fixed inset-0 pointer-events-none" />

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
              accountName={accountDisplayName}
              logoUrl={storeConfig.logoUrl}
            userLevel={effectiveUserLevel}
            isAdmin={effectiveIsAdmin}
            />
          </div>
        </div>
      )}

      {/* Global Top Bar (Shopify style) */}
      <header className="sticky top-0 z-50 w-full bg-black px-4 py-2.5 sm:px-6 shadow-sm flex items-center justify-between">
        {/* Left section: Logo */}
        <div className="flex items-center gap-3 flex-1">
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-white/10 text-white transition lg:hidden"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu size={19} />
          </button>
          
          <div className="flex items-center gap-3">
            <img
              src="/storefy-logo.png"
              alt="Storefy"
              className="h-7 w-auto object-contain brightness-0 invert"
            />
          </div>
        </div>

        {/* Center section: Store Selector + Actions */}
        <div className="hidden lg:flex items-center justify-center flex-1 gap-3">
          <div className="relative w-[240px]">
            <button
              type="button"
              onClick={() => setStoreSwitcherOpen(open => !open)}
              className="group flex w-full items-center gap-2 rounded-xl bg-[#282828]/90 backdrop-blur-md border border-white/5 px-2.5 py-1.5 text-left transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.08)] hover:bg-[#323232]/90 hover:shadow-[0_6px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:-translate-y-[1px]"
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center overflow-hidden rounded bg-white">
                <img src={normalizeStoreLogoUrl(storeConfig.logoUrl)} alt="" className="h-4 w-4 object-contain" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-white">{storeConfig.name}</span>
              </span>
              <ChevronDown size={14} className="shrink-0 text-gray-400 transition group-hover:text-white" />
            </button>
            {storeSwitcherOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+8px)] z-50 w-[300px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                <div className="p-1.5">
                  {sites.map(site => (
                    <button
                      key={site.id}
                      type="button"
                      onClick={() => {
                        setActiveSiteId(site.id);
                        setStoreSwitcherOpen(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-gray-100"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded border border-gray-200 bg-white">
                        <img src={normalizeStoreLogoUrl(site.logoUrl)} alt="" className="h-5 w-5 object-contain" />
                      </span>
                      <span className="min-w-0 flex-1 block truncate text-sm font-medium text-gray-900">{site.name}</span>
                    </button>
                  ))}
                  <div className="my-1 border-t border-gray-100"></div>
                  <button
                    type="button"
                    onClick={() => {
                      setStoreSwitcherOpen(false);
                      handleNavigate('operation');
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left hover:bg-gray-100 text-gray-700"
                  >
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-gray-50 border border-gray-200 border-dashed">
                      <Plus size={16} className="text-gray-400" />
                    </span>
                    <span className="text-sm font-medium">Criar loja</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenGeneratedSite(activePage)}
              className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Preview"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        </div>

        {/* Right section: Profile & Theme */}
        <div className="flex items-center gap-2 justify-end flex-1">
          <div className="relative">
            <button
              type="button"
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className="hidden h-8 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition sm:flex items-center gap-1.5 px-2"
              aria-label="Idioma"
            >
              <Globe size={16} strokeWidth={1.5} />
              <span className="text-[12px] font-bold uppercase">{language}</span>
            </button>
            {languageMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-32 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                <div className="p-1.5 flex flex-col">
                  {[
                    { code: 'pt', label: 'Português' },
                    { code: 'en', label: 'English' },
                    { code: 'es', label: 'Español' }
                  ].map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as any);
                        setLanguageMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] font-medium transition-colors ${
                        language === lang.code ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="hidden h-8 rounded-full hover:bg-white/10 text-white transition sm:flex items-center gap-2 pl-1 pr-2 border border-transparent hover:border-white/10"
              aria-label="Perfil de configuração"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center text-[10px] font-bold text-white uppercase overflow-hidden shadow-inner ring-1 ring-white/20">
                {accountDisplayName ? accountDisplayName.substring(0, 2) : 'US'}
              </div>
              <span className="text-[13px] font-medium text-gray-100 hidden md:block tracking-wide">
                {accountDisplayName || 'Usuário'}
              </span>
              <span className={`hidden rounded-full px-2 py-0.5 text-[9px] font-black lg:inline-flex ${effectiveUserLevel === 10 ? 'bg-amber-400 text-black' : 'bg-white/10 text-gray-300'}`}>{effectiveUserLevel === 10 ? 'N10' : 'N1'}</span>
              <ChevronDown size={14} className="text-gray-400 opacity-80" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                <div className="p-1.5 flex flex-col">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      handleNavigate('settings');
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-gray-100 text-[13px] font-medium text-gray-700"
                  >
                    {t('header.editProfile')}
                  </button>
                  {(effectiveIsAdmin || effectiveUserLevel === 10) && (
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        handleNavigate(effectiveIsAdmin ? 'admin-codes' : 'invites');
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-amber-50 text-[13px] font-medium text-amber-800"
                    >
                      Codigos e convites
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      void handleSignOut();
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-red-50 text-[13px] font-medium text-red-600"
                  >
                    {t('header.logout')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Content area below top bar - single white container with rounded top corners (Shopify-style) */}
      <div className="relative z-10 flex flex-1 overflow-hidden rounded-tl-[20px] rounded-tr-[20px] bg-[#f1f1f1]">
        <div className="hidden shrink-0 lg:flex lg:flex-col lg:h-[calc(100vh-56px)] bg-[#e8e8e8] border-r border-gray-200">
          <Sidebar
            activePage={activePage}
            onPageChange={handleNavigate}
            storeName={storeConfig.name}
            storePrimaryColor={storeConfig.primaryColor}
            accountName={accountDisplayName}
            logoUrl={storeConfig.logoUrl}
          userLevel={effectiveUserLevel}
          isAdmin={effectiveIsAdmin}
          />
        </div>

        <main className="min-w-0 flex-1 overflow-y-auto h-[calc(100vh-56px)] main-scrollbar">
          <div key={activePage} className={`page-transition ${activePage === 'academy' ? '' : 'p-4 sm:p-6'}`}>
            {activePage === 'dashboard' && (
              <Dashboard
                storeConfig={storeConfig}
                products={storeProducts}
                onNavigate={handleNavigate}
                metricsScope={session?.user?.id || 'local'}
                accountName={accountDisplayName}
                stores={dashboardStores}
              userLevel={effectiveUserLevel}
              />
            )}

            {activePage === 'operation' && (
              <StoresHub
                sites={sites}
                activeSiteId={activeSiteId}
                storeConfig={storeConfig}
                products={storeProducts}
                suppliers={suppliers}
                onUpdateStoreConfig={handleUpdateStoreConfig}
                onToggleAddProduct={handleToggleAddProduct}
                onPublishStore={handlePublishStore}
                onDeleteStore={handleDeleteSite}
                onNavigate={handleNavigate}
                onEditStore={(siteId) => {
                  setActiveSiteId(siteId);
                }}
                onViewStore={(siteId) => {
                  setActiveSiteId(siteId);
                  handleOpenGeneratedSite('operation');
                }}
                onCreateStore={() => {
                  handleCreateSite();
                  handleNavigate('wizard');
                }}
              />
            )}

            {activePage === 'profile' && (
              <OperationStudio mode="profile" products={storeProducts} storeConfig={storeConfig} onUpdateStoreConfig={handleUpdateStoreConfig} onToggleAddProduct={handleToggleAddProduct} onOpenSection={handleNavigate} onPreview={() => handleOpenGeneratedSite('profile')} onPublish={handlePublishStore} onBuildHtml={() => buildStoreHtml({ ...storeConfig, productIds: activeStoreProductIds }, products, effectiveUserLevel)} />
            )}

            {activePage === 'videos' && (
              <OperationStudio mode="videos" products={storeProducts} storeConfig={storeConfig} onUpdateStoreConfig={handleUpdateStoreConfig} onToggleAddProduct={handleToggleAddProduct} onOpenSection={handleNavigate} onPreview={() => handleOpenGeneratedSite('videos')} onPublish={handlePublishStore} onBuildHtml={() => buildStoreHtml({ ...storeConfig, productIds: activeStoreProductIds }, products, effectiveUserLevel)} />
            )}

            {activePage === 'promotion' && (
              <OperationStudio mode="promotion" products={storeProducts} storeConfig={storeConfig} onUpdateStoreConfig={handleUpdateStoreConfig} onToggleAddProduct={handleToggleAddProduct} onOpenSection={handleNavigate} onPreview={() => handleOpenGeneratedSite('promotion')} onPublish={handlePublishStore} onBuildHtml={() => buildStoreHtml({ ...storeConfig, productIds: activeStoreProductIds }, products, effectiveUserLevel)} />
            )}

            {activePage === 'calendar' && (
              <OperationStudio mode="calendar" products={storeProducts} storeConfig={storeConfig} onUpdateStoreConfig={handleUpdateStoreConfig} onToggleAddProduct={handleToggleAddProduct} onOpenSection={handleNavigate} onPreview={() => handleOpenGeneratedSite('calendar')} onPublish={handlePublishStore} onBuildHtml={() => buildStoreHtml({ ...storeConfig, productIds: activeStoreProductIds }, products, effectiveUserLevel)} />
            )}

            {activePage === 'export' && (
              <OperationStudio mode="export" products={storeProducts} storeConfig={storeConfig} onUpdateStoreConfig={handleUpdateStoreConfig} onToggleAddProduct={handleToggleAddProduct} onOpenSection={handleNavigate} onPreview={() => handleOpenGeneratedSite('export')} onPublish={handlePublishStore} onBuildHtml={() => buildStoreHtml({ ...storeConfig, productIds: activeStoreProductIds }, products, effectiveUserLevel)} />
            )}
            {activePage === 'wizard' && (
              <Wizard
                products={storeProducts}
                storeConfig={storeConfig}
                onUpdateStoreConfig={handleUpdateStoreConfig}
                onToggleAddProduct={handleToggleAddProduct}
                onUpdateSalePrice={handleUpdateSalePrice}
                onCreateCustomProduct={handleCreateCustomProduct}
                onImportProduct={handleImportMarketplaceProduct}
                initialStep={previewWizardStep}
                onNavigateToPreview={(returnStep) => handleOpenGeneratedSite('wizard', returnStep)}
                onPublishStore={handlePublishStore}
                onComplete={handleCompleteWizard}
              />
            )}

            {activePage === 'stores' && (
              <section className="space-y-6">
                <div className="flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-100 p-5 shadow-2xl shadow-black/25 backdrop-blur-2xl sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-500">Multi sites</p>
                    <h2 className="mt-2 font-sans text-2xl font-bold text-gray-900">Gerencie e edite suas lojas</h2>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
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
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold text-gray-900"
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
                          <h3 className="mt-1 truncate font-sans text-2xl font-bold text-gray-900">{storeConfig.name}</h3>
                          <p className="truncate text-xs text-gray-500">/{storeConfig.subdomain}</p>
                        </div>
                      </div>
                      <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-black uppercase text-gray-800">
                        {storeConfig.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Produtos</p>
                        <strong className="mt-1 block text-lg text-gray-900">{getStoreProductIds(storeConfig, products).length}</strong>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Tema</p>
                        <strong className="mt-1 block truncate text-sm text-gray-900">{storeConfig.themePreset || 'obsidian'}</strong>
                      </div>
                      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Netlify</p>
                        <strong className="mt-1 block text-sm text-gray-900">{storeConfig.netlifySiteName ? 'Ativo' : 'Novo'}</strong>
                      </div>
                    </div>

                    {storeConfig.publishedUrl && (
                      <a href={storeConfig.publishedUrl} target="_blank" rel="noreferrer" className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-3 text-xs font-bold text-emerald-200 transition hover:bg-emerald-500/15">
                        <ExternalLink size={14} />
                        <span className="truncate">{storeConfig.publishedUrl}</span>
                      </a>
                    )}

                    <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button type="button" onClick={() => handleEditSite(storeConfig.id || activeSiteId, 3)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-900 transition hover:bg-gray-200">
                        <Edit3 size={14} /> Identidade
                      </button>
                      <button type="button" onClick={() => handleEditSite(storeConfig.id || activeSiteId, 2)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-900 transition hover:bg-gray-200">
                        <PackageOpen size={14} /> Produtos
                      </button>
                      <button type="button" onClick={() => handleEditSite(storeConfig.id || activeSiteId, 4)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-900 transition hover:bg-gray-200">
                        <Store size={14} /> Pagina
                      </button>
                      <button type="button" onClick={() => handlePreviewSite(storeConfig.id || activeSiteId)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-900 transition hover:bg-gray-200">
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
                            ? 'rounded-xl border border-brand-500/60 bg-brand-500/10 p-4 text-left transition'
                            : 'rounded-xl border border-gray-200 bg-gray-100 p-4 text-left transition hover:bg-gray-100'}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <button type="button" onClick={() => setActiveSiteId(site.id)} className="flex min-w-0 items-center gap-3 text-left">
                              <img
                                src={normalizeStoreLogoUrl(site.logoUrl)}
                                alt={site.name}
                                className="h-11 w-11 shrink-0 object-contain"
                              />
                              <span className="min-w-0">
                                <span className="block truncate font-sans text-lg font-bold text-gray-900">{site.name}</span>
                                <span className="block truncate text-xs text-gray-500">/{site.subdomain}</span>
                              </span>
                            </button>
                            {isActive && <CheckCircle2 className="shrink-0 text-brand-500" size={19} />}
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                            <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">{siteProductCount} produtos</span>
                            <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-gray-800">{site.status === 'published' ? 'Publicado' : 'Rascunho'}</span>
                          </div>

                          {site.publishedUrl && (
                            <a href={site.publishedUrl} target="_blank" rel="noreferrer" className="mt-3 block truncate rounded-xl border border-emerald-400/15 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300">
                              {site.publishedUrl}
                            </a>
                          )}

                          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-200 pt-3">
                            <button type="button" onClick={() => setActiveSiteId(site.id)} className={isActive ? 'rounded-xl bg-brand-500 px-3 py-2 text-xs font-black text-black' : 'rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-700 hover:bg-gray-200'}>
                              {isActive ? 'Atual' : 'Abrir'}
                            </button>
                            <button type="button" onClick={() => handleEditSite(site.id, 3)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-700 hover:bg-gray-200">Editar</button>
                            <button type="button" onClick={() => handleEditSite(site.id, 2)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-700 hover:bg-gray-200">Produtos</button>
                            <button type="button" onClick={() => handleEditSite(site.id, 4)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-700 hover:bg-gray-200">Pagina</button>
                            <button type="button" onClick={() => handlePreviewSite(site.id)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-black text-gray-700 hover:bg-gray-200">Visualizar</button>
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
                onImportProduct={handleImportMarketplaceProduct}
              />
            )}

            {activePage === 'ranking' && (
              <ProductRanking
                products={storeProducts}
                onToggleAddProduct={handleToggleAddProduct}
              />
            )}

            {activePage === 'suppliers' && <SuppliersList suppliers={suppliers} products={storeProducts} />}
            {activePage === 'marketing' && <MarketingKit storeConfig={storeConfig} />}
            {activePage === 'academy' && <Academy />}
            {(activePage === 'admin-codes' || activePage === 'invites') && accessProfile && <AdminCodes profile={{ ...accessProfile, isAdmin: effectiveIsAdmin, level: effectiveUserLevel }} onToast={showAppToast} />}
            {activePage === 'settings' && (
              <SettingsView
                storeConfig={storeConfig}
                accountName={accountDisplayName}
                onUpdateStoreConfig={handleUpdateStoreConfig}
                onUpdateAccountName={handleUpdateAccountName}
                userLevel={effectiveUserLevel}
                isAdmin={effectiveIsAdmin}
                onNavigate={handleNavigate}
              />
            )}
          </div>
        </main>
      </div>


      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
        <button
          type="button"
          onClick={() => showAppToast('Configure os dados da loja, selecione produtos e clique em Publicar.')}
          className="grid h-11 w-11 place-items-center rounded-full border border-gray-200 bg-black/70 text-gray-800 shadow-2xl backdrop-blur-xl transition hover:bg-white/10"
          aria-label="Ajuda"
        >
          <HelpCircle size={18} />
        </button>
      </div>

      {appToast && (
        <div className="fixed top-6 right-6 z-[100] flex w-max max-w-sm items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] font-medium text-gray-900 shadow-xl animate-fade-in">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
            <CheckCircle2 size={16} />
          </div>
          <p className="leading-tight flex-1 mr-2">{appToast}</p>
          <button type="button" onClick={() => setAppToast(null)} aria-label="Fechar" className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
