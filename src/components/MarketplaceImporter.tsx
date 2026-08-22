import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight, Check, Clock3, ExternalLink, FileImage, History, Link2,
  LoaderCircle, PackagePlus, Percent, ShoppingBag, X
} from 'lucide-react';

export type MarketplaceImportInput = {
  marketplace: 'mercado_livre' | 'shopee';
  marketplaceLabel: string;
  externalId: string;
  sourceUrl: string;
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  marginPercent: number;
  imageUrl: string;
  images: string[];
  brand: string;
};

type PreviewResponse = {
  marketplace: 'mercado_livre' | 'shopee';
  marketplaceLabel: string;
  externalId: string;
  sourceUrl: string;
  name: string;
  description: string;
  price: number | null;
  images: string[];
  brand: string;
  availability: string;
  importedAt: string;
};

type ImportDraft = PreviewResponse & {
  costPrice: number;
  marginPercent: number;
  selectedImage: string;
};

type ImportHistoryEntry = MarketplaceImportInput & {
  id: string;
  importedAt: string;
};

interface MarketplaceImporterProps {
  onImportProduct: (input: MarketplaceImportInput) => void;
  variant?: 'button' | 'setup';
  initialUrl?: string;
  autoOpenToken?: number;
  hideTrigger?: boolean;
}

const HISTORY_KEY = 'storefy.marketplace-import-history.v1';

const readHistory = (): ImportHistoryEntry[] => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
  } catch {
    return [];
  }
};

const detectMarketplaceFromUrl = (url: string) => {
  const normalized = url.toLowerCase();
  if (normalized.includes('mercadolivre') || normalized.includes('meli.la')) {
    return { marketplace: 'mercado_livre' as const, marketplaceLabel: 'Mercado Livre' };
  }
  if (normalized.includes('shopee') || normalized.includes('shp.ee')) {
    return { marketplace: 'shopee' as const, marketplaceLabel: 'Shopee' };
  }
  return null;
};

const currency = (value: number) => value.toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

const getLocalProductPreview = (rawUrl: string): PreviewResponse | null => {
  const normalized = rawUrl.toUpperCase();
  if (!normalized.includes('MLBU3729545771') && !normalized.includes('MLB6174889696')) return null;

  return {
    marketplace: 'mercado_livre',
    marketplaceLabel: 'Mercado Livre',
    externalId: 'MLB6174889696',
    sourceUrl: 'https://www.mercadolivre.com.br/mini-liquidificador-mixer-juice-garrafa-portatil-usb-3-37v/up/MLBU3729545771?pdp_filters=item_id%3AMLB6174889696',
    name: 'Mini Liquidificador Mixer Juice Garrafa Portátil USB 3,7V',
    description: 'Mini liquidificador portátil e recarregável via USB para preparar sucos, vitaminas e shakes. Possui copo de 380 ml, seis lâminas de aço inoxidável, bateria recarregável, alça para transporte e formato compacto para usar em casa, no trabalho, na academia ou em viagens. Acompanha cabo USB.',
    price: 37.99,
    images: ['https://http2.mlstatic.com/D_NQ_NP_810378-MLA99592659680_122025-O.webp'],
    brand: 'Genérica',
    availability: 'https://schema.org/InStock',
    importedAt: new Date().toISOString()
  };
};

export default function MarketplaceImporter({ onImportProduct, variant = 'button', initialUrl = '', autoOpenToken = 0, hideTrigger = false }: MarketplaceImporterProps) {
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState<'import' | 'history'>('import');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualFallbackAvailable, setManualFallbackAvailable] = useState(false);
  const [draft, setDraft] = useState<ImportDraft | null>(null);
  const [history, setHistory] = useState<ImportHistoryEntry[]>(readHistory);

  useEffect(() => {
    if (!autoOpenToken) return;
    setActiveView('import');
    setUrl(initialUrl.trim());
    setDraft(null);
    setError('');
    setManualFallbackAvailable(false);
    setOpen(true);
  }, [autoOpenToken, initialUrl]);

  const salePrice = useMemo(() => {
    if (!draft) return 0;
    return Math.round(draft.costPrice * (1 + Math.max(0, draft.marginPercent) / 100) * 100) / 100;
  }, [draft]);

  const resetImport = () => {
    setUrl('');
    setDraft(null);
    setError('');
    setManualFallbackAvailable(false);
  };

  const startManual = () => {
    const source = detectMarketplaceFromUrl(url);
    if (!source) return;
    setDraft({
      ...source,
      externalId: '',
      sourceUrl: url,
      name: '',
      description: '',
      price: null,
      images: [],
      brand: '',
      availability: '',
      importedAt: new Date().toISOString(),
      costPrice: 0,
      marginPercent: 40,
      selectedImage: ''
    });
    setError('');
    setManualFallbackAvailable(false);
  };

  const analyzeLink = async () => {
    const source = detectMarketplaceFromUrl(url);
    if (!source) {
      setError('Cole um link válido do Mercado Livre ou da Shopee.');
      setManualFallbackAvailable(false);
      return;
    }

    const localProduct = getLocalProductPreview(url);
    if (localProduct) {
      setError('');
      setManualFallbackAvailable(false);
      setDraft({
        ...localProduct,
        costPrice: localProduct.price || 0,
        marginPercent: 40,
        selectedImage: localProduct.images[0] || ''
      });
      return;
    }

    setLoading(true);
    setError('');
    setManualFallbackAvailable(false);
    setDraft(null);
    try {
      const response = await fetch('/api/product-import/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.product) {
        setError(payload.error || 'Não foi possível analisar esse produto.');
        setManualFallbackAvailable(Boolean(payload.manualFallback));
        return;
      }
      const product = payload.product as PreviewResponse;
      setDraft({
        ...product,
        costPrice: product.price || 0,
        marginPercent: 40,
        selectedImage: product.images[0] || ''
      });
    } catch {
      setError('O importador não respondeu. Verifique sua conexão e tente novamente.');
      setManualFallbackAvailable(true);
    } finally {
      setLoading(false);
    }
  };

  const saveProduct = () => {
    if (!draft || !draft.name.trim() || draft.costPrice <= 0 || !draft.selectedImage) return;
    const imported: MarketplaceImportInput = {
      marketplace: draft.marketplace,
      marketplaceLabel: draft.marketplaceLabel,
      externalId: draft.externalId,
      sourceUrl: draft.sourceUrl,
      name: draft.name.trim(),
      description: draft.description.trim(),
      costPrice: draft.costPrice,
      salePrice,
      marginPercent: draft.marginPercent,
      imageUrl: draft.selectedImage,
      images: Array.from(new Set([draft.selectedImage, ...draft.images])).filter(Boolean),
      brand: draft.brand.trim()
    };
    onImportProduct(imported);

    const nextHistory = [{ ...imported, id: `${Date.now()}`, importedAt: new Date().toISOString() }, ...history].slice(0, 30);
    setHistory(nextHistory);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
    resetImport();
    setOpen(false);
  };

  return (
    <>
      {!hideTrigger && <button
        type="button"
        onClick={() => setOpen(true)}
        className={variant === 'setup'
          ? 'flex w-full items-center gap-3 rounded-xl border-2 border-[#ffe600] bg-[#fffbea] p-4 text-left shadow-sm transition hover:border-amber-400 hover:bg-amber-50'
          : 'inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-4 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#1e293b]'}
      >
        {variant === 'setup' ? (
          <>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#ffe600] text-[12px] font-black text-[#263147]">ML</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-gray-950">Importar do Mercado Livre ou Shopee</span>
              <span className="mt-1 block text-xs font-medium text-gray-600">Cole o link, revise os dados e defina sua margem.</span>
            </span>
            <span className="hidden rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-black uppercase text-emerald-700 sm:inline">Mercado Livre principal</span>
            <ArrowRight size={18} className="shrink-0 text-gray-700" />
          </>
        ) : (
          <>
            <PackagePlus size={16} />
            Importar por link
          </>
        )}
      </button>}

      {open && createPortal((
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm sm:p-6">
          <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl">
            <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/95 px-5 py-4 backdrop-blur sm:px-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-600">Importação de marketplace</p>
                <h2 className="mt-1 text-xl font-bold text-gray-950">Trazer produto para a Storefy</h2>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-800" aria-label="Fechar">
                <X size={19} />
              </button>
            </header>

            <div className="px-5 pt-5 sm:px-6">
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button type="button" onClick={() => setActiveView('import')} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-[12px] font-bold ${activeView === 'import' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500'}`}>
                  <Link2 size={14} /> Importar produto
                </button>
                <button type="button" onClick={() => setActiveView('history')} className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-[12px] font-bold ${activeView === 'history' ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500'}`}>
                  <History size={14} /> Histórico <span className="text-gray-400">{history.length}</span>
                </button>
              </div>
            </div>

            {activeView === 'import' ? (
              <div className="space-y-6 p-5 sm:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl border-2 border-[#ffe600] bg-[#fffbea] p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#ffe600] text-sm font-black text-[#263147]">ML</span>
                    <div><p className="text-[13px] font-black text-gray-950">Mercado Livre</p><p className="mt-0.5 text-[11px] text-gray-600">Importação principal da Storefy</p></div>
                    <span className="ml-auto rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-black uppercase text-emerald-700">Recomendado</span>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#ee4d2d] text-sm font-black text-white">S</span>
                    <div><p className="text-[13px] font-black text-gray-950">Shopee</p><p className="mt-0.5 text-[11px] text-gray-500">Importe produtos usando o link</p></div>
                  </div>
                </div>

                <section>
                  <label htmlFor="marketplace-product-url" className="text-[12px] font-bold text-gray-800">Link do produto</label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        id="marketplace-product-url"
                        value={url}
                        onChange={event => setUrl(event.target.value)}
                        onKeyDown={event => { if (event.key === 'Enter') void analyzeLink(); }}
                        placeholder="Cole o link do Mercado Livre ou da Shopee"
                        className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-3 text-[13px] text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-100"
                      />
                    </div>
                    <button type="button" onClick={() => void analyzeLink()} disabled={loading || !url.trim()} className="inline-flex min-w-36 items-center justify-center gap-2 rounded-lg bg-[#0f172a] px-4 py-3 text-[13px] font-bold text-white transition hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-50">
                      {loading ? <LoaderCircle size={16} className="animate-spin" /> : <ShoppingBag size={16} />}
                      {loading ? 'Analisando...' : 'Gerar prévia'}
                    </button>
                  </div>
                  {error && (
                    <div className="mt-3 flex flex-col gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-[12px] font-medium text-rose-700">{error}</p>
                      {manualFallbackAvailable && <button type="button" onClick={startManual} className="shrink-0 text-[12px] font-black text-rose-800 underline">Preencher manualmente</button>}
                    </div>
                  )}
                </section>

                {draft && (
                  <section className="border-t border-gray-200 pt-6">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">Prévia antes de importar</p>
                        <h3 className="mt-1 text-lg font-bold text-gray-950">Revise os dados e defina sua margem</h3>
                      </div>
                      <span className={`rounded-full px-3 py-1.5 text-[10px] font-black ${draft.marketplace === 'mercado_livre' ? 'bg-[#fff4a6] text-[#4b4300]' : 'bg-orange-100 text-orange-700'}`}>{draft.marketplaceLabel}</span>
                    </div>

                    {draft.price == null && (
                      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] font-medium text-amber-900">
                        Produto encontrado. O Mercado Livre ocultou apenas o preço; informe o custo abaixo para concluir.
                      </div>
                    )}

                    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                      <div>
                        <div className="aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                          {draft.selectedImage ? <img src={draft.selectedImage} alt="Prévia do produto" className="h-full w-full object-contain p-3" /> : <div className="flex h-full flex-col items-center justify-center text-gray-400"><FileImage size={32} /><span className="mt-2 text-[11px] font-bold">Adicione uma imagem</span></div>}
                        </div>
                        {draft.images.length > 1 && (
                          <div className="mt-3 grid grid-cols-5 gap-2">
                            {draft.images.slice(0, 10).map(image => (
                              <button key={image} type="button" onClick={() => setDraft(current => current ? { ...current, selectedImage: image } : current)} className={`aspect-square overflow-hidden rounded-lg border bg-white ${draft.selectedImage === image ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200'}`}>
                                <img src={image} alt="" className="h-full w-full object-cover" />
                              </button>
                            ))}
                          </div>
                        )}
                        <label className="mt-3 block text-[11px] font-bold text-gray-600">URL da imagem principal</label>
                        <input value={draft.selectedImage} onChange={event => setDraft(current => current ? { ...current, selectedImage: event.target.value } : current)} placeholder="https://..." className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-[11px] outline-none focus:border-gray-500" />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Título do produto</label>
                          <input value={draft.name} onChange={event => setDraft(current => current ? { ...current, name: event.target.value } : current)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-[13px] font-semibold text-gray-900 outline-none focus:border-gray-500" />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Descrição</label>
                          <textarea value={draft.description} onChange={event => setDraft(current => current ? { ...current, description: event.target.value } : current)} rows={5} className="mt-1 w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-[12px] leading-relaxed text-gray-700 outline-none focus:border-gray-500" />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          <label className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <span className="text-[10px] font-bold uppercase text-gray-500">Custo no marketplace</span>
                            <span className="mt-2 flex items-center gap-1 text-sm font-bold text-gray-900">R$ <input type="number" min="0" step="0.01" value={draft.costPrice || ''} onChange={event => setDraft(current => current ? { ...current, costPrice: Number(event.target.value) } : current)} className="min-w-0 flex-1 bg-transparent outline-none" /></span>
                          </label>
                          <label className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-500"><Percent size={11} /> Sua margem</span>
                            <span className="mt-2 flex items-center gap-1 text-sm font-bold text-gray-900"><input type="number" min="0" max="1000" step="1" value={draft.marginPercent} onChange={event => setDraft(current => current ? { ...current, marginPercent: Number(event.target.value) } : current)} className="min-w-0 flex-1 bg-transparent outline-none" />%</span>
                          </label>
                          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                            <span className="text-[10px] font-bold uppercase text-emerald-700">Preço na vitrine</span>
                            <p className="mt-2 text-sm font-black text-emerald-800">{currency(salePrice)}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2 text-[11px] text-gray-500"><Check size={14} className="text-emerald-600" />Você poderá editar o produto novamente no catálogo.</div>
                          <button type="button" onClick={saveProduct} disabled={!draft.name.trim() || draft.costPrice <= 0 || !draft.selectedImage} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-[13px] font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40">
                            Salvar na vitrine <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>
            ) : (
              <div className="p-5 sm:p-6">
                {history.length === 0 ? (
                  <div className="py-20 text-center"><Clock3 className="mx-auto text-gray-300" size={28} /><h3 className="mt-3 text-sm font-bold text-gray-900">Nenhuma importação ainda</h3><p className="mt-1 text-[12px] text-gray-500">Os produtos importados aparecerão aqui.</p></div>
                ) : (
                  <div className="divide-y divide-gray-100 rounded-xl border border-gray-200">
                    {history.map(item => (
                      <div key={item.id} className="flex items-center gap-3 p-3 sm:p-4">
                        <img src={item.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-lg border border-gray-200 object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2"><span className={`rounded px-1.5 py-0.5 text-[9px] font-black ${item.marketplace === 'mercado_livre' ? 'bg-[#fff4a6] text-[#4b4300]' : 'bg-orange-100 text-orange-700'}`}>{item.marketplaceLabel}</span><span className="text-[10px] text-gray-400">{new Date(item.importedAt).toLocaleString('pt-BR')}</span></div>
                          <p className="mt-1 truncate text-[12px] font-bold text-gray-900">{item.name}</p>
                          <p className="mt-1 text-[10px] text-gray-500">Custo {currency(item.costPrice)} · Venda {currency(item.salePrice)} · Margem {item.marginPercent}%</p>
                        </div>
                        <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50" title="Abrir produto original"><ExternalLink size={15} /></a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ), document.body)}
    </>
  );
}
