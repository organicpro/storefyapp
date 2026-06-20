import React, { useMemo, useState } from 'react';
import {
  Activity,
  CheckCircle,
  Copy,
  ExternalLink,
  Link as LinkIcon,
  Search,
  ShieldCheck,
  Star,
  Tag,
  Users
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
      const supplierProducts = productsWithLinks.filter((product) => product.supplier === supplier.name);
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
      showToast('Nao foi possivel copiar automaticamente. Abra o link e copie pela barra do navegador.');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[11px] font-black uppercase tracking-[0.32em] text-brand-500">Central de fornecedores</p>
          <h1 className="mt-2 text-3xl font-display font-medium tracking-tight text-white">Links de compra para revenda</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-400">
            Acesse os links dos produtos cadastrados, veja custo, preco de venda e margem antes de comprar no fornecedor.
          </p>
        </div>

        <div className="storefy-badge storefy-badge-success select-none">
          <LinkIcon className="h-4 w-4 text-emerald-400" />
          <span>{productsWithLinks.length} links cadastrados</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="storefy-panel rounded-2xl p-4">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Compra pelo fornecedor</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-400">Links ficam no painel interno e nao aparecem no site publicado.</p>
            </div>
          </div>
        </div>

        <div className="storefy-panel rounded-2xl p-4">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-brand-500/20 bg-brand-500/10 p-2.5 text-brand-500">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Margem visivel</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-400">Compare o custo do fornecedor com o valor da sua vitrine.</p>
            </div>
          </div>
        </div>

        <div className="storefy-panel rounded-2xl p-4">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-2.5 text-cyan-300">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Catalogo organizado</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-400">Filtre por nicho, produto, fornecedor ou dominio do link.</p>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="flex items-center gap-2 whitespace-nowrap text-lg font-display font-medium text-white">
            <Users className="h-4 w-4 text-brand-500" />
            Fornecedores ativos
          </h2>
          <div className="h-px w-full bg-white/5" />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {supplierSummaries.map((supplier) => (
            <article key={supplier.id} className="storefy-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] font-display text-xl font-black text-white">
                    {supplier.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-white">{supplier.name}</h3>
                    <p className="mt-0.5 truncate font-mono text-[10px] text-slate-400">{supplier.primaryDomain}</p>
                  </div>
                </div>
                {supplier.featured && <span className="storefy-badge storefy-badge-brand">Verificado</span>}
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-xs">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Avaliacao</p>
                  <p className="mt-1.5 flex items-center gap-1 font-black text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {supplier.rating}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Entrega</p>
                  <p className="mt-1.5 flex items-center gap-1 font-black text-emerald-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {supplier.deliveryRate}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Links</p>
                  <p className="mt-1.5 font-black text-slate-100">{supplier.sourceCount}</p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-slate-400">
                Categoria principal: <strong className="text-brand-500">{supplier.category}</strong>
              </p>

              <a
                href={supplier.primaryUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-xs font-bold text-white transition-all hover:border-brand-500/40 hover:bg-brand-500/10"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Abrir fornecedor
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="storefy-panel rounded-2xl p-5 space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-display font-medium text-white">
                <Tag className="h-4 w-4 text-brand-500" />
                Produtos com link de compra
              </h2>
              <p className="mt-1 text-xs text-slate-400">Use esta lista para comprar o item no fornecedor depois que vender na sua loja.</p>
            </div>

            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Buscar produto, fornecedor ou dominio..."
                className="glass-premium-input w-full rounded-xl border border-white/10 bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-white/5 pt-4">
            {categoryTabs.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  activeCategory === category
                    ? 'storefy-primary-action font-black'
                    : 'border border-white/5 bg-white/[0.04] text-slate-300 hover:border-brand-500/20 hover:bg-white/[0.08]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {filteredProducts.map((product) => {
            const margin = product.salePrice - product.costPrice;
            const marginPercent = product.costPrice > 0 ? Math.round((margin / product.costPrice) * 100) : 0;
            const sourceUrl = product.sourceUrl || '';

            return (
              <article key={product.id} className="storefy-card rounded-2xl p-4">
                <div className="flex gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className={`h-full w-full ${product.category === 'Achados Fisicos' ? 'object-cover' : 'object-contain p-3'}`}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-500">
                        <LinkIcon className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="storefy-badge storefy-badge-muted">{product.category}</span>
                      <span className="storefy-badge storefy-badge-brand">{product.subcategory}</span>
                    </div>
                    <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-white">{product.name}</h3>
                    <p className="mt-1 truncate font-mono text-[10px] text-slate-500">{getDomain(sourceUrl)}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 divide-x divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-black/25 text-xs">
                  <div className="p-3">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Voce paga</p>
                    <p className="mt-1 font-black text-slate-100">{formatMoney(product.costPrice)}</p>
                  </div>
                  <div className="p-3">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Voce vende</p>
                    <p className="mt-1 font-black text-brand-500">{formatMoney(product.salePrice)}</p>
                  </div>
                  <div className="p-3">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">Lucro</p>
                    <p className="mt-1 font-black text-emerald-400">{formatMoney(margin)} ({marginPercent}%)</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="storefy-primary-action inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-black"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Comprar no fornecedor
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopyLink(sourceUrl)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-slate-200 transition-all hover:border-brand-500/30 hover:bg-white/[0.08]"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copiar link
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="storefy-panel rounded-2xl border-dashed p-12 text-center">
            <LinkIcon className="mx-auto h-8 w-8 text-slate-500" />
            <h3 className="mt-3 text-sm font-bold text-white">Nenhum link encontrado</h3>
            <p className="mt-1 text-xs text-slate-400">Tente trocar a categoria ou buscar outro termo.</p>
          </div>
        )}
      </section>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-xl border border-brand-500/20 bg-[#0a0a0f] p-4 shadow-2xl animate-fade-in">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-500/20 bg-brand-500/10 text-brand-500">
            <Activity className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold leading-normal text-white">{toastMessage}</p>
        </div>
      )}
    </div>
  );
}
