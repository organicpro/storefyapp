import { Product } from './types';

const escapeSvg = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;'
    };
    return map[char] || char;
  });

export function productFallbackImage(product: Product) {
  const title = escapeSvg(product.name).slice(0, 54);
  const subcategory = escapeSvg(product.subcategory).slice(0, 28).toUpperCase();
  const isPhysical = product.category === 'Achados Fisicos';
  const accent = isPhysical ? '#facc15' : '#d4af37';
  const second = isPhysical ? '#10b981' : '#2563eb';
  const label = isPhysical ? 'Achado fisico' : product.category;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="585" viewBox="0 0 900 585"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07070a"/><stop offset=".55" stop-color="#111827"/><stop offset="1" stop-color="${second}"/></linearGradient></defs><rect width="900" height="585" rx="34" fill="url(#g)"/><circle cx="735" cy="80" r="180" fill="${accent}" opacity=".18"/><circle cx="120" cy="510" r="220" fill="#fff" opacity=".08"/><rect x="48" y="42" width="804" height="501" rx="30" fill="#000" opacity=".28" stroke="#fff" stroke-opacity=".16"/><text x="78" y="104" fill="${accent}" font-family="Arial,sans-serif" font-size="24" font-weight="900" letter-spacing="4">${subcategory}</text><rect x="78" y="152" width="238" height="238" rx="34" fill="#fff" opacity=".09"/><path d="M132 300h132l-18 52h-96l-18-52Z" fill="#f8fafc" opacity=".92"/><path d="M162 208h72l38 92H124l38-92Z" fill="${accent}"/><circle cx="174" cy="366" r="13" fill="#f8fafc"/><circle cx="222" cy="366" r="13" fill="#f8fafc"/><text x="360" y="232" fill="#fff" font-family="Arial,sans-serif" font-size="48" font-weight="900"><tspan x="360" dy="0">${title.slice(0, 24)}</tspan><tspan x="360" dy="58">${title.slice(24, 48)}</tspan><tspan x="360" dy="58">${title.slice(48)}</tspan></text><rect x="360" y="430" width="245" height="44" rx="22" fill="#fff" opacity=".12"/><text x="386" y="459" fill="#fff" font-family="Arial,sans-serif" font-size="18" font-weight="800">${escapeSvg(label)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
