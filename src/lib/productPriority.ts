import type { Product } from '../types';

function productSearchText(product: Product) {
  return [product.name, product.subcategory, product.descriptionText, ...(product.benefits || [])]
    .filter(Boolean)
    .join(' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function gameProductPriority(product: Product) {
  const text = productSearchText(product);
  const isGameCategory = product.category.toLowerCase().includes('game') || product.category.toLowerCase().includes('sport');
  if (!isGameCategory) return 0;

  const isGta6 = /gta\s*6|grand theft auto\s*vi/.test(text);
  const isConsoleGame = /playstation|ps4|ps5|xbox|series x|series s/.test(text);
  const isDigitalGame = /midia digital|m[ií]dia digital|digital|jogo|game|key|chave/.test(text);
  if (isGta6) return 1000;
  if (isDigitalGame && isConsoleGame) return 800;
  if (isDigitalGame) return 600;
  return 200;
}

export function prioritizeGameProducts(products: Product[]) {
  return products
    .map((product, index) => ({ product, index }))
    .sort((left, right) => gameProductPriority(right.product) - gameProductPriority(left.product) || left.index - right.index)
    .map(item => item.product);
}
