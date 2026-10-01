import React, { useState } from 'react';
import { ExternalLink, Link2, Plus, Check, Pencil, X, ImagePlus, Eye, Download, Globe } from 'lucide-react';
import type { Product, StoreConfig } from '../types';
import { affiliateMarketplace, affiliateLabel, safeAffiliateUrl } from '../lib/affiliate';

interface Props {
  products: Product[];
  storeConfig: StoreConfig;
  onSave: (product: Product) => void;
  onToggle: (id: string) => void;
  onUpdateStore: (config: StoreConfig) => void;
  onPreview: () => void;
  onNavigate: (page: string) => void;
  onPublish: () => Promise<{ mode: string; url: string; error?: string }>;
  onExport: () => void;
}

const blank = { id: '', name: '', affiliateUrl: '', imageUrl: '', description: '', price: '', commission: '' };
const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export default function AffiliateWorkspace({ products, storeConfig, onSave, onToggle, onUpdateStore, onPreview, onNavigate, onPublish, onExport }: Props) {
  const [form, setForm] = useState(blank);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publicUrl, setPublicUrl] = useState('');
  const affiliateProducts = products.filter(product => product.salesMode === 'affiliate');
  const marketplace = affiliateMarketplace(form.affiliateUrl.trim());
  const selected = new Set(storeConfig.productIds || []);
  const setField = (key: keyof typeof blank, value: string) => { setForm(current => ({ ...current, [key]: value })); setError(''); };
  const changeMode = (mode: 'affiliate' | 'resale') => onUpdateStore({ ...storeConfig, commerceMode: mode });
  const canPublish = storeConfig.commerceMode === 'affiliate' && affiliateProducts.some(product => selected.has(product.id) && safeAffiliateUrl(product));
  const publish = async () => {
    setPublishing(true); setError(''); setPublicUrl('');
    try {
      const result = await onPublish();
      if (result.error) setError(result.error);
      else { setPublicUrl(result.url); setSaved('Vitrine publicada.'); }
    } catch { setError('Nao foi possivel publicar. Verifique sua conexao e a configuracao de publicacao.'); }
    finally { setPublishing(false); }
  };
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const rawUrl = form.affiliateUrl.trim();
    const source = affiliateMarketplace(rawUrl);
    const price = form.price ? Number(form.price.replace(',', '.')) : 0;
    const commission = form.commission ? Number(form.commission.replace(',', '.')) : undefined;
    if (!source) return setError('Cole um link HTTPS da Shopee ou do Mercado Livre, incluindo links encurtados oficiais.');
    if (!form.name.trim()) return setError('Informe o nome do produto.');
    if (!Number.isFinite(price) || price < 0) return setError('Informe um preço válido ou deixe em branco.');
    if (commission !== undefined && (!Number.isFinite(commission) || commission < 0 || commission > 100)) return setError('A comissão deve ficar entre 0% e 100%.');
    if (!form.imageUrl) return setError('Adicione uma imagem do produto.');
    if (!form.imageUrl.startsWith('data:image/') && !/^https:\/\//i.test(form.imageUrl)) return setError('Use uma imagem HTTPS ou envie uma foto.');
    const label = source === 'shopee' ? 'Shopee' : 'Mercado Livre';
    const existing = products.find(product => product.id === form.id);
    onSave({ ...existing, id: form.id || `custom-affiliate-${crypto.randomUUID()}`, name: form.name.trim(), category: 'Achados Fisicos', subcategory: label, supplier: `Afiliados • ${label}`, source: source, costPrice: 0, salePrice: price, imageUrl: form.imageUrl, benefits: ['Compra e pagamento no marketplace', 'Preço e disponibilidade sujeitos a alteração'], descriptionText: form.description.trim(), deliverable: 'Entrega e condições definidas pelo vendedor no marketplace.', addedToStore: false, salesMode: 'affiliate', affiliateUrl: rawUrl, affiliateMarketplace: source, commissionPercent: commission });
    setSaved('Produto salvo na vitrine de afiliados.'); setOpen(false); setForm(blank);
  };
  const edit = (product: Product) => {
    setForm({ id: product.id, name: product.name, affiliateUrl: product.affiliateUrl || '', imageUrl: product.imageUrl, description: product.descriptionText || '', price: product.salePrice ? String(product.salePrice) : '', commission: product.commissionPercent === undefined ? '' : String(product.commissionPercent) });
    setError(''); setOpen(true);
  };
  return <section className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="sf-section-label mb-2">Monetização</p><h1 className="text-[26px] font-semibold">Afiliados</h1><p className="mt-2 text-sm text-gray-500">Sua seleção de produtos. A compra acontece na Shopee ou no Mercado Livre.</p></div>
      <button type="button" onClick={() => { setForm(blank); setError(''); setOpen(true); }} className="inline-flex items-center gap-2 rounded-lg bg-[#191b20] px-4 py-2.5 text-xs font-semibold text-white"><Plus size={15} /> Adicionar produto afiliado</button>
    </header>
    <div className="flex flex-wrap items-center justify-between gap-3 border-y border-gray-200 py-4">
      <div className="flex rounded-lg bg-gray-200/60 p-1" aria-label="Modo da vitrine">
        <button type="button" aria-pressed={storeConfig.commerceMode !== 'affiliate'} onClick={() => changeMode('resale')} className={`rounded-md px-4 py-2 text-xs font-semibold ${storeConfig.commerceMode !== 'affiliate' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Revenda</button>
        <button type="button" aria-pressed={storeConfig.commerceMode === 'affiliate'} onClick={() => changeMode('affiliate')} className={`rounded-md px-4 py-2 text-xs font-semibold ${storeConfig.commerceMode === 'affiliate' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>Afiliados</button>
      </div>
      <div className="flex flex-wrap gap-2"><button type="button" disabled={storeConfig.commerceMode !== 'affiliate'} onClick={onPreview} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium disabled:opacity-40"><Eye size={15} /> Visualizar vitrine</button><button type="button" onClick={() => onNavigate('operation')} className="rounded-lg px-3 py-2 text-xs font-medium text-gray-600">Gerenciar e publicar</button></div>
    </div>
    {saved && <p role="status" className="text-xs text-emerald-700">{saved}</p>}
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" disabled={!canPublish || publishing} onClick={publish} className="inline-flex items-center gap-2 rounded-lg bg-[#191b20] px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-40"><Globe size={15} />{publishing ? 'Publicando...' : 'Publicar vitrine'}</button>
      <button type="button" disabled={!canPublish} onClick={onExport} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs font-medium disabled:opacity-40"><Download size={15} />Exportar HTML</button>
      {publicUrl && <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="break-all text-xs text-emerald-700">Abrir vitrine publicada</a>}
    </div>
    {!open && error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
    {!affiliateProducts.length && <div className="py-16 text-center"><Link2 className="mx-auto mb-4 text-amber-600" size={30} /><h2 className="text-lg font-semibold">Monte sua primeira seleção</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">Use o link comissionado gerado no seu programa de afiliados. Ele será preservado em cada botão da vitrine.</p></div>}
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {affiliateProducts.map(product => <article key={product.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="relative aspect-[16/10] bg-gray-50 p-5"><ImagePlus aria-hidden="true" size={32} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" /><img src={product.imageUrl} alt={product.name} onError={event => { event.currentTarget.style.visibility = 'hidden'; }} className="relative h-full w-full bg-gray-50 object-contain" /><span className="absolute left-3 top-3 rounded bg-white px-2 py-1 text-[10px] font-semibold">{affiliateLabel(product)}</span></div>
        <div className="space-y-4 p-4"><h2 className="text-sm font-semibold">{product.name}</h2><p className="line-clamp-2 text-xs leading-5 text-gray-500">{product.descriptionText}</p>
          <div className="grid grid-cols-2 gap-3 border-y border-gray-100 py-3"><div><span className="block text-[10px] text-gray-500">Preço de referência</span><strong className="text-sm">{product.salePrice ? money(product.salePrice) : 'Ver no marketplace'}</strong></div><div><span className="block text-[10px] text-gray-500">Comissão estimada</span><strong className="text-sm text-emerald-700">{product.commissionPercent === undefined ? 'Não informada' : `${product.commissionPercent}%${product.salePrice ? ` · ${money(product.salePrice * product.commissionPercent / 100)}` : ''}`}</strong></div></div>
          <p className="text-[10px] leading-4 text-gray-400">Comissão informada por você. A aprovação da venda é confirmada no programa de afiliados.</p>
          <a href={safeAffiliateUrl(product)} target="_blank" rel="noopener noreferrer sponsored" className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 py-2.5 text-xs font-medium"><ExternalLink size={14} /> Testar link de afiliado</a>
          <div className="flex gap-2"><button type="button" onClick={() => onToggle(product.id)} className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold ${selected.has(product.id) ? 'bg-emerald-50 text-emerald-800' : 'bg-[#191b20] text-white'}`}>{selected.has(product.id) ? <Check size={14} /> : <Plus size={14} />}{selected.has(product.id) ? 'Remover da vitrine' : 'Adicionar à vitrine'}</button><button type="button" onClick={() => edit(product)} aria-label={`Editar ${product.name}`} className="rounded-lg border border-gray-200 p-2.5"><Pencil size={14} /></button></div>
        </div>
      </article>)}
    </div>
    {open && <div className="fixed inset-0 z-[80] grid place-items-center bg-black/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Produto afiliado">
      <form onSubmit={save} className="max-h-[90dvh] w-full max-w-xl space-y-4 overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{form.id ? 'Editar produto afiliado' : 'Novo produto afiliado'}</h2><button type="button" onClick={() => { setOpen(false); setError(''); }} aria-label="Fechar cadastro" className="p-2"><X size={18} /></button></div>
        <label className="block text-xs font-medium">Link de afiliado<input value={form.affiliateUrl} onChange={event => setField('affiliateUrl', event.target.value)} placeholder="https://..." className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm" required /></label>
        <p className="text-[11px] text-gray-500">{marketplace ? `Destino: ${marketplace === 'shopee' ? 'Shopee' : 'Mercado Livre'}` : 'Cole o link gerado pelo programa de afiliados, com todos os parâmetros.'}</p>
        <label className="block text-xs font-medium">Nome do produto<input value={form.name} onChange={event => setField('name', event.target.value)} className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm" required /></label>
        <label className="block text-xs font-medium">Descrição<textarea value={form.description} onChange={event => setField('description', event.target.value)} rows={3} className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm" /></label>
        <div className="grid grid-cols-2 gap-3"><label className="text-xs font-medium">Preço de referência (R$)<input value={form.price} onChange={event => setField('price', event.target.value)} inputMode="decimal" placeholder="Opcional" className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm" /></label><label className="text-xs font-medium">Comissão (%)<input value={form.commission} onChange={event => setField('commission', event.target.value)} inputMode="decimal" placeholder="Opcional" className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm" /></label></div>
        <label className="block text-xs font-medium">Imagem do produto<input value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl} onChange={event => setField('imageUrl', event.target.value)} placeholder="https://..." className="mt-2 w-full rounded-lg border border-gray-200 p-3 text-sm" /></label>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs"><ImagePlus size={15} /> Enviar foto<input type="file" accept="image/*" className="sr-only" onChange={event => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/') || file.size > 3 * 1024 * 1024) return setError('Escolha uma imagem de até 3 MB.'); const reader = new FileReader(); reader.onload = () => setField('imageUrl', String(reader.result)); reader.readAsDataURL(file); }} /></label>
        {form.imageUrl && <img src={form.imageUrl} alt="Prévia do produto" className="h-24 w-24 rounded-lg border border-gray-100 object-contain" />}
        {error && <p role="alert" className="text-xs text-rose-600">{error}</p>}
        <button type="submit" className="w-full rounded-lg bg-[#191b20] py-3 text-sm font-semibold text-white">Salvar na vitrine de afiliados</button>
      </form>
    </div>}
  </section>;
}
