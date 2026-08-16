import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronDown,
  Lock,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  TrendingUp
} from 'lucide-react';
import { Product } from '../types';

const PAGE_SIZE = 20;

type SortMode = 'opportunity' | 'profit' | 'margin' | 'sales' | 'rating';

interface ProductRankingProps {
  products: Product[];
  onToggleAddProduct: (productId: string) => void;
}

function money(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function marginPercent(product: Product) {
  if (product.costPrice <= 0) return 0;
  return Math.round(((product.salePrice - product.costPrice) / product.costPrice) * 100);
}

function scoreProduct(product: Product) {
  const profit = Math.max(0, product.salePrice - product.costPrice);
  const margin = Math.max(0, marginPercent(product));
  const sales = product.ordersCount || 0;
  const rating = product.rating || 0;
  const stock = product.stockQuantity || 0;
  return (sales * 3) + (rating * 14) + Math.min(margin, 180) + Math.min(profit, 250) + Math.min(stock, 100) * 0.35;
}

function sparkline(seed: number) {
  const points = Array.from({ length: 9 }, (_, index) => {
    const value = 18 + ((seed + index * 11) % 24) + index * 2;
    return `${index * 14},${64 - value}`;
  });
  return points.join(' ');
}

export default function ProductRanking({ products, onToggleAddProduct }: ProductRankingProps) {
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('opportunity');
  const [currentPage, setCurrentPage] = useState(1);

  const rankedProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(product => {
      if (product.category !== 'Achados Fisicos') return false;
      if (!q) return true;
      return [
        product.name,
        product.subcategory,
        product.supplier,
        product.brand || '',
        product.sku || ''
      ].join(' ').toLowerCase().includes(q);
    });

    return filtered.sort((a, b) => {
      if (sortMode === 'profit') return (b.salePrice - b.costPrice) - (a.salePrice - a.costPrice);
      if (sortMode === 'margin') return marginPercent(b) - marginPercent(a);
      if (sortMode === 'sales') return (b.ordersCount || 0) - (a.ordersCount || 0);
      if (sortMode === 'rating') return (b.rating || 0) - (a.rating || 0);
      return scoreProduct(b) - scoreProduct(a);
    });
  }, [products, query, sortMode]);

  const totalPages = Math.max(1, Math.ceil(rankedProducts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const visibleProducts = rankedProducts.slice(pageStart, pageStart + PAGE_SIZE);
  const pageNumbers = useMemo(() => {
    const pages = new Set<number>([1, totalPages, safePage - 1, safePage, safePage + 1]);
    return Array.from(pages).filter(page => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  }, [safePage, totalPages]);

  const resetFilters = () => {
    setQuery('');
    setSortMode('opportunity');
    setCurrentPage(1);
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-5 py-6 text-left">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] font-semibold text-amber-900">
        Produtos em alta usam sinais de demanda, margem, avaliacao e estoque para encontrar oportunidades mais rapido.
      </div>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#0f172a] text-white shadow-sm">
              <Trophy className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-[20px] font-black text-gray-950">Produtos em Alta</h1>
              <p className="text-[13px] font-medium text-gray-500">
                Ranking dos produtos vencedores com demanda, margem e avaliacao.
              </p>
            </div>
          </div>
          <div className="flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <span className="border-r border-gray-200 px-4 py-2 text-[12px] font-bold text-gray-500">Produtos listados</span>
            <strong className="px-4 py-2 text-[12px] font-black text-emerald-600">{rankedProducts.length}</strong>
          </div>
        </div>

        <div className="grid gap-3 border-b border-gray-100 p-5 lg:grid-cols-[1fr_auto_auto]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar produtos..."
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-[13px] font-medium text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </label>
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gray-100 px-5 text-[13px] font-bold text-gray-900 transition hover:bg-gray-200"
          >
            <Search className="h-4 w-4" />
            Buscar
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 text-[13px] font-bold text-gray-800 shadow-sm transition hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-gray-100 p-5 lg:flex-row lg:items-center lg:justify-between">
          <label className="inline-flex w-full max-w-[260px] items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-500 shadow-sm">
            Ordenar por
            <select
              value={sortMode}
              onChange={(event) => {
                setSortMode(event.target.value as SortMode);
                setCurrentPage(1);
              }}
              className="min-w-0 flex-1 bg-transparent font-bold text-gray-900 outline-none"
            >
              <option value="opportunity">Ranking Storefy</option>
              <option value="profit">Maior lucro</option>
              <option value="margin">Maior margem</option>
              <option value="sales">Mais vendas</option>
              <option value="rating">Melhor avaliacao</option>
            </select>
          </label>
          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
            <BarChart3 className="h-4 w-4" />
            Pagina {safePage} de {totalPages}
          </div>
        </div>

        <div className="space-y-3 p-5">
          {visibleProducts.map((product, index) => {
            const rank = pageStart + index + 1;
            const profit = product.salePrice - product.costPrice;
            const margin = marginPercent(product);
            const hot = rank <= 3;
            return (
              <article key={product.id} className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-gray-300 hover:shadow-md lg:grid-cols-[56px_64px_1fr_auto] lg:items-center">
                <div className={`grid h-11 w-11 place-items-center rounded-full text-[15px] font-black ${hot ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {rank}
                </div>

                <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-xl bg-gray-100">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  ) : (
                    <Lock className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="line-clamp-1 text-[15px] font-black text-gray-950">{product.name}</h2>
                    {product.addedToStore && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" />
                        Na vitrine
                      </span>
                    )}
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-bold text-gray-700">{product.subcategory}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[12px] font-semibold text-gray-600">
                    <span>Custo: <b className="text-gray-950">{money(product.costPrice)}</b></span>
                    <span>Venda: <b className="text-gray-950">{money(product.salePrice)}</b></span>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-900">{Math.max(1, Math.round(product.salePrice / Math.max(product.costPrice, 1)))}x markup</span>
                    {(product.ordersCount || 0) > 0 && <span>{product.ordersCount} vendas</span>}
                    {(product.rating || 0) > 0 && <span>{product.rating?.toFixed(1)} de avaliacao</span>}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
                  <div className="grid grid-cols-2 gap-4 text-right">
                    <div>
                      <span className="text-[10px] font-black uppercase text-gray-400">Lucro</span>
                      <p className="text-[15px] font-black text-gray-950">{money(profit)}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-gray-400">% Margem</span>
                      <p className="text-[15px] font-black text-gray-950">{margin}%</p>
                    </div>
                  </div>
                  <svg viewBox="0 0 112 44" className="h-10 w-28 text-gray-950">
                    <polyline fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" points={sparkline(rank + Math.round(profit))} />
                    <circle cx="112" cy={8 + (rank % 12)} r="2.5" fill="currentColor" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => onToggleAddProduct(product.id)}
                    className={`rounded-lg px-4 py-2 text-[12px] font-black shadow-sm transition ${product.addedToStore ? 'border border-rose-200 bg-white text-rose-600 hover:bg-rose-50' : 'bg-[#0f172a] text-white hover:bg-[#1e293b]'}`}
                  >
                    {product.addedToStore ? 'Remover' : 'Adicionar'}
                  </button>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </article>
            );
          })}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] font-semibold text-gray-600">
            Mostrando {pageStart + 1}-{pageStart + visibleProducts.length} de {rankedProducts.length} produtos.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
              disabled={safePage === 1}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </button>
            {pageNumbers.map((page, index) => (
              <React.Fragment key={page}>
                {index > 0 && page - pageNumbers[index - 1] > 1 && <span className="px-1 text-[12px] font-bold text-gray-400">...</span>}
                <button
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-9 rounded-lg px-3 py-2 text-[12px] font-bold shadow-sm transition ${safePage === page ? 'bg-[#0f172a] text-white' : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
              disabled={safePage === totalPages}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Proxima
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
