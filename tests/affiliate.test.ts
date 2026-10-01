import assert from 'node:assert/strict';
import { affiliateMarketplace, safeAffiliateUrl } from '../src/lib/affiliate';
import type { Product } from '../src/types';

for (const url of ['https://shopee.com.br/product/123?tag=abc', 'https://s.shopee.com.br/123', 'https://shope.ee/123', 'https://shp.ee/123']) {
  assert.equal(affiliateMarketplace(url), 'shopee');
}
for (const url of ['https://produto.mercadolivre.com.br/MLB-123', 'https://meli.la/123']) {
  assert.equal(affiliateMarketplace(url), 'mercado_livre');
}
for (const url of ['javascript:alert(1)', 'http://shopee.com.br/x', 'https://shopee.com.br.evil.test/x', 'https://evilshopee.com.br/x', 'https://user:password@shopee.com.br/x', 'not-a-url']) {
  assert.equal(affiliateMarketplace(url), null);
}
const raw = 'https://s.shopee.com.br/abc?sub_id=a%2Bb&campaign=x%2Fy#detail';
const product = { salesMode: 'affiliate', affiliateMarketplace: 'shopee', affiliateUrl: raw } as Product;
assert.equal(safeAffiliateUrl(product), raw);
assert.equal(safeAffiliateUrl({ ...product, salesMode: 'resale' }), '');
assert.equal(safeAffiliateUrl({ ...product, affiliateMarketplace: 'mercado_livre' }), '');
console.log('Affiliate URL validation and exact tracking preservation passed.');
