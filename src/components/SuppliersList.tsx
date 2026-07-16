import React, { useMemo, useState } from 'react';
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Search,
  ShieldCheck,
  Star,
  Truck,
  X,
  ChevronRight,
  Package
} from 'lucide-react';
import { MainCategory, Product, Supplier } from '../types';

interface SuppliersListProps {
  suppliers: Supplier[];
  products: Product[];
}

const categoryTabs: Array<MainCategory | 'Todos'> = [
  'Todos',
  'Games',
  'Redes Sociais',
  'Assinaturas Digitais',
  'Infoprodutos',
  'Achados Fisicos'
];

const formatMoney = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return 'link do fornecedor';
  }
};

const categoryColors: Record<string, string> = {
  'Games': 'bg-purple-50 text-purple-700 border-purple-100',
  'Redes Sociais': 'bg-blue-50 text-blue-700 border-blue-100',
  'Assinaturas Digitais': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Infoprodutos': 'bg-orange-50 text-orange-700 border-orange-100',
  'Achados Fisicos': 'bg-green-50 text-green-700 border-green-100',
};

export default function SuppliersList({ suppliers, products }: SuppliersListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<MainCategory | 'Todos'>('Todos');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const productsWithLinks = useMemo(
    () => products.filter((product) => Boolean(product.sourceUrl)),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return productsWithLinks.filter((product) => {
      if (activeCategory !== 'Todos' && product.category !== activeCategory) return false;
      if (!query) return true;
      return [product.name, product.supplier, product.category, product.subcategory, product.sourceUrl || '']
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [activeCategory, productsWithLinks, searchQuery]);

  const supplierSummaries = useMemo(() => {
    return suppliers.map((supplier) => {
      const supplierProducts = productsWithLinks.filter((p) => p.supplier === supplier.name);
      const primaryUrl = supplierProducts[0]?.sourceUrl || 'https://gamemarket.com.br/';
      return {
        ...supplier,
        sourceCount: supplierProducts.length,
        primaryUrl,
        primaryDomain: getDomain(primaryUrl)
      };
    });
  }, [productsWithLinks, suppliers]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link do fornecedor copiado.');
    } catch {
      showToast('Não foi possível copiar. Abra o link e copie pela barra do navegador.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Fornecedores</h1>
        <p className="text-[14px] text-gray-500 mt-1 leading-relaxed max-w-xl">
          Acesse os links de compra dos seus produtos, compare margens e gerencie seus fornecedores.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[20px] border border-gray-200 bg-white p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#0f172a] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900">Compra segura</p>
            <p className="text-[12px] text-gray-500 mt-0.5">Links internos, invisíveis no site</p>
          </div>
        </div>

        <div className="rounded-[20px] border border-gray-200 bg-white p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#0f172a] flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900">Margem visível</p>
            <p className="text-[12px] text-gray-500 mt-0.5">Custo vs. preço de venda claro</p>
          </div>
        </div>

        <div className="rounded-[20px] border border-gray-200 bg-white p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#0f172a] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-gray-900">{productsWithLinks.length} produtos</p>
            <p className="text-[12px] text-gray-500 mt-0.5">Com link de compra cadastrado</p>
          </div>
        </div>
      </div>

      {/* Suppliers grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-bold text-gray-900">Fornecedores parceiros</h2>
          <span className="text-[12px] text-gray-400 font-medium">{supplierSummaries.length} ativos</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {supplierSummaries.map((supplier) => (
            <article
              key={supplier.id}
              className="group rounded-[24px] border border-gray-200 bg-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5 [box-shadow:0_2px_8px_rgba(0,0,0,0.04)] hover:[box-shadow:0_8px_24px_rgba(0,0,0,0.12)]"
            >
              {/* Top colored band */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#0f172a] to-[#334155]" />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-[14px] bg-gray-100 border border-gray-200 flex items-center justify-center text-[18px] font-black text-gray-700 shrink-0">
                      {supplier.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-gray-900 leading-tight">{supplier.name}</h3>
                      <p className="text-[11px] text-gray-400 font-sans mt-0.5">{supplier.primaryDomain}</p>
                    </div>
                  </div>
                  {supplier.featured && (
                    <span className="shrink-0 bg-[#0f172a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Verificado
                    </span>
                  )}
                </div>

                {/* Metrics row */}
                <div className="grid grid-cols-3 gap-2 rounded-[14px] border border-gray-100 bg-gray-50 p-3 mb-4">
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Avaliação</p>
                    <p className="text-[13px] font-bold text-gray-900 flex items-center justify-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {supplier.rating}
                    </p>
                  </div>
                  <div className="text-center border-x border-gray-200">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Entrega</p>
                    <p className="text-[11px] font-bold text-gray-900">{supplier.deliveryRate}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Links</p>
                    <p className="text-[13px] font-bold text-gray-900">{supplier.sourceCount}</p>
                  </div>
                </div>

                <p className="text-[12px] text-gray-500 mb-4">
                  Categoria: <span className="font-semibold text-gray-700">{supplier.category}</span>
                </p>

                <a
                  href={supplier.primaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-between gap-2 rounded-[14px] border border-gray-200 bg-gray-50 px-4 py-2.5 text-[13px] font-semibold text-gray-800 transition-all hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] group/btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Abrir fornecedor
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Products section */}
      <div>
        {/* Search & filters */}
        <div className="sticky top-2 z-40 rounded-[24px] border border-gray-200 bg-white/80 backdrop-blur-xl p-5 mb-5 shadow-sm transition-all">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div>
              <h2 className="text-[16px] font-bold text-gray-900">Produtos com link de compra</h2>
              <p className="text-[12px] text-gray-500 mt-0.5">Use esta lista para comprar o item após vender na sua loja.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produto ou fornecedor..."
                className="w-full rounded-[12px] border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-[13px] text-gray-900 placeholder-gray-400 focus:border-gray-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all"
              />
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
            {categoryTabs.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all ${
                  activeCategory === category
                    ? 'bg-[#0f172a] text-white'
                    : 'border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product cards */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredProducts.map((product) => {
            const margin = product.salePrice - product.costPrice;
            const marginPercent = product.costPrice > 0 ? Math.round((margin / product.costPrice) * 100) : 0;
            const sourceUrl = product.sourceUrl || '';
            const catColor = categoryColors[product.category] || 'bg-gray-50 text-gray-600 border-gray-200';

            return (
              <article
                key={product.id}
                className="rounded-[24px] border border-gray-200 bg-white overflow-hidden transition-all duration-200 hover:[box-shadow:0_4px_16px_rgba(0,0,0,0.08)]"
              >
                <div className="p-4 flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-20 shrink-0 rounded-[14px] border border-gray-100 bg-gray-50 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className={`h-full w-full ${product.category === 'Achados Fisicos' ? 'object-cover' : 'object-contain p-2'}`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300">
                        <LinkIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${catColor}`}>
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2">{product.name}</h3>
                    <p className="text-[11px] font-sans text-gray-400 mt-1 truncate">{getDomain(sourceUrl)}</p>
                  </div>
                </div>

                {/* Price row */}
                <div className="mx-4 mb-4 grid grid-cols-3 rounded-[14px] border border-gray-100 bg-gray-50 overflow-hidden">
                  <div className="p-3 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Você paga</p>
                    <p className="text-[12px] font-bold text-gray-700">{formatMoney(product.costPrice)}</p>
                  </div>
                  <div className="p-3 text-center border-x border-gray-200">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Você vende</p>
                    <p className="text-[12px] font-bold text-gray-900">{formatMoney(product.salePrice)}</p>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Lucro</p>
                    <p className="text-[12px] font-bold text-gray-900">{marginPercent}%</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 pb-4 flex gap-2">
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-[12px] bg-[#0f172a] text-white px-3 py-2.5 text-[12px] font-semibold hover:bg-[#1e293b] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Comprar no fornecedor
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(sourceUrl)}
                    className="flex items-center justify-center gap-2 rounded-[12px] border border-gray-200 bg-gray-50 px-3 py-2.5 text-[12px] font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="rounded-[24px] border border-dashed border-gray-200 bg-white p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Truck className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-[15px] font-bold text-gray-900 mb-1">Nenhum produto encontrado</h3>
            <p className="text-[13px] text-gray-500">Tente trocar a categoria ou buscar outro termo.</p>
          </div>
        )}
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[100] flex w-max max-w-sm items-center gap-3 rounded-[16px] border border-gray-100 bg-white px-4 py-3 text-[13px] font-medium text-gray-900 shadow-xl animate-fade-in">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-900 text-white">
            <CheckCircle size={14} />
          </div>
          <p className="leading-tight flex-1 mr-2">{toastMessage}</p>
          <button type="button" onClick={() => setToastMessage(null)} aria-label="Fechar" className="text-gray-400 hover:text-gray-700 transition-colors">
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

