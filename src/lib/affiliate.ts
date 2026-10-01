import type { Product } from '../types';

export function affiliateMarketplace(rawUrl: string): 'shopee' | 'mercado_livre' | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    const matches = (domain: string) => host === domain || host.endsWith(`.${domain}`);
    if (['shopee.com.br', 'shopee.com', 'shp.ee', 'shope.ee'].some(matches)) return 'shopee';
    if (['mercadolivre.com.br', 'mercadolibre.com', 'meli.la', 'mercadolivre.com'].some(matches)) return 'mercado_livre';
    return null;
  } catch { return null; }
}

export function affiliateLabel(product: Product) {
  return product.affiliateMarketplace === 'shopee' ? 'Shopee' : 'Mercado Livre';
}

export function safeAffiliateUrl(product: Product) {
  const raw = product.affiliateUrl || '';
  return product.salesMode === 'affiliate' && affiliateMarketplace(raw) === product.affiliateMarketplace ? raw : '';
}
