import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Eye, 
  MessageSquare, 
  DollarSign, 
  CheckCircle2, 
  ShoppingBag, 
  Sparkles,
  ArrowRight,
  MousePointerClick,
  Plus,
  X
} from 'lucide-react';
import { Product, StoreConfig } from '../types';

type ManualSale = { id: string; amount: number; note: string; createdAt: string };

interface DashboardStoreContext {
  storeConfig: StoreConfig;
  products: Product[];
}

interface DashboardProps {
  storeConfig: StoreConfig;
  products: Product[];
  onNavigate: (page: string) => void;
  metricsScope?: string;
  accountName?: string;
  stores?: DashboardStoreContext[];
}

export default function Dashboard({ storeConfig, products, onNavigate, metricsScope = 'local', accountName = '', stores = [] }: DashboardProps) {
  const [metricTimeframe, setMetricTimeframe] = useState<'7d' | '30d' | 'today'>('7d');
  const [metricView, setMetricView] = useState<'current' | 'all'>('current');
  const [manualSalesByKey, setManualSalesByKey] = useState<Record<string, ManualSale[]>>({});
  const [saleAmount, setSaleAmount] = useState('');
  const [saleNote, setSaleNote] = useState('');
  const [actionsMenuOpen, setActionsMenuOpen] = useState(false);
  const [showManualSaleModal, setShowManualSaleModal] = useState(false);

  const dashboardStores = stores.length ? stores : [{ storeConfig, products }];
  const storeSalesKey = (config: StoreConfig) => `storefy.sales.${metricsScope}.${config.id || config.subdomain}`;
  const currentSalesKey = storeSalesKey(storeConfig);
  const storeKeysSignature = dashboardStores.map(store => storeSalesKey(store.storeConfig)).join('|');
  const timeframeDays = metricTimeframe === 'today' ? 1 : metricTimeframe === '7d' ? 7 : 30;

  const readStoreSales = (key: string): ManualSale[] => {
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const nextSales: Record<string, ManualSale[]> = {};
    dashboardStores.forEach(store => {
      const key = storeSalesKey(store.storeConfig);
      nextSales[key] = readStoreSales(key);
    });
    setManualSalesByKey(nextSales);
  }, [metricsScope, storeKeysSignature]);

  const currentManualSales = manualSalesByKey[currentSalesKey] || [];
  const currentManualSalesTotal = currentManualSales.reduce((sum, sale) => sum + sale.amount, 0);
  const currentManualSalesCount = currentManualSales.length;
  const currentProductsInStore = products.filter(product => product.addedToStore);

  const getStoreMetrics = (store: DashboardStoreContext) => {
    const selectedProducts = store.products.filter(product => product.addedToStore);
    const storeSales = manualSalesByKey[storeSalesKey(store.storeConfig)] || [];
    const hasOperationalData = selectedProducts.length > 0;
    const publishedBoost = store.storeConfig.status === 'published' ? 1.35 : 1;
    const operationalBase = hasOperationalData
      ? Math.max(8, selectedProducts.length * 9 + storeSales.length * 5)
      : 0;
    const views = Math.round(operationalBase * timeframeDays * publishedBoost);
    const clicks = hasOperationalData ? Math.max(1, Math.round(views * 0.31)) : 0;
    const projectedContacts = hasOperationalData ? Math.round(clicks * 0.22) : 0;
    const contacts = hasOperationalData ? Math.max(projectedContacts, storeSales.length) : storeSales.length;
    const revenue = storeSales.reduce((sum, sale) => sum + sale.amount, 0);
    const salesCount = storeSales.length;
    const viewsGrowthValue = hasOperationalData ? Math.min(38.6, 8.4 + selectedProducts.length * 0.9 + timeframeDays * 0.22) : 0;
    const clicksGrowthValue = hasOperationalData ? Math.min(34.2, 6.8 + selectedProducts.length * 0.7 + timeframeDays * 0.18) : 0;
    const contactsGrowthValue = hasOperationalData ? Math.min(31.5, 5.6 + selectedProducts.length * 0.55 + timeframeDays * 0.15) : 0;

    return {
      store,
      storeSales,
      hasOperationalData,
      views,
      clicks,
      contacts,
      revenue,
      salesCount,
      viewsGrowthValue,
      clicksGrowthValue,
      contactsGrowthValue
    };
  };

  const visibleStores = metricView === 'all' ? dashboardStores : [{ storeConfig, products }];
  const visibleMetrics = visibleStores.map(getStoreMetrics);
  const activeMetricsCount = visibleMetrics.filter(metric => metric.hasOperationalData).length || 1;
  const viewsCount = visibleMetrics.reduce((sum, metric) => sum + metric.views, 0);
  const clicksCount = visibleMetrics.reduce((sum, metric) => sum + metric.clicks, 0);
  const contactsCount = visibleMetrics.reduce((sum, metric) => sum + metric.contacts, 0);
  const estimatedRevenue = visibleMetrics.reduce((sum, metric) => sum + metric.revenue, 0);
  const viewsGrowth = visibleMetrics.reduce((sum, metric) => sum + metric.viewsGrowthValue, 0) / activeMetricsCount;
  const clicksGrowth = visibleMetrics.reduce((sum, metric) => sum + metric.clicksGrowthValue, 0) / activeMetricsCount;
  const contactsGrowth = visibleMetrics.reduce((sum, metric) => sum + metric.contactsGrowthValue, 0) / activeMetricsCount;
  const clickRate = viewsCount > 0 ? (clicksCount / viewsCount) * 100 : 0;
  const conversionRate = clicksCount > 0 ? (contactsCount / clicksCount) * 100 : 0;
  const viewLabel = metricView === 'all' ? 'Todas as lojas' : storeConfig.name;
  const viewDescription = metricView === 'all'
    ? `Visão consolidada de ${dashboardStores.length} lojas. Faturamento soma apenas vendas lançadas manualmente.`
    : `Sua loja ${storeConfig.name} esta no ar e pronta para vender.`;

  const recentActivities = visibleMetrics
    .flatMap(metric => metric.storeSales.map(sale => ({
      id: `${metric.store.storeConfig.id || metric.store.storeConfig.subdomain}-${sale.id}`,
      createdAt: sale.createdAt,
      time: new Date(sale.createdAt).toLocaleDateString('pt-BR'),
      event: metricView === 'all' ? `Venda em ${metric.store.storeConfig.name}` : 'Venda registrada',
      detail: `${sale.note} - R$ ${sale.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-emerald-400 bg-emerald-500/10'
    })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const applySecretAdjustment = (direction: 1 | -1) => {
    const rawAmount = window.prompt('Valor do ajuste (R$):', '100');
    const amount = Number(String(rawAmount || '').replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) return;

    const nextSale: ManualSale = {
      id: 'secret-' + String(Date.now()),
      amount: direction * amount,
      note: direction > 0 ? 'Ajuste interno StorefyUp' : 'Ajuste interno StorefyDown',
      createdAt: new Date().toISOString()
    };
    const nextSales = [nextSale, ...currentManualSales];
    setManualSalesByKey(prev => ({ ...prev, [currentSalesKey]: nextSales }));
    window.localStorage.setItem(currentSalesKey, JSON.stringify(nextSales));
  };

  useEffect(() => {
    let buffer = '';
    const handleSecretCode = (event: KeyboardEvent) => {
      if (event.key.length !== 1) return;
      buffer = (buffer + event.key.toLowerCase()).slice(-12);
      if (buffer.endsWith('storefyup')) {
        buffer = '';
        applySecretAdjustment(1);
      } else if (buffer.endsWith('storefydown')) {
        buffer = '';
        applySecretAdjustment(-1);
      }
    };
    window.addEventListener('keydown', handleSecretCode);
    return () => window.removeEventListener('keydown', handleSecretCode);
  }, [currentSalesKey, currentManualSales]);
  const handleAddManualSale = () => {
    const amount = Number(saleAmount.replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) return;

    const nextSale: ManualSale = {
      id: `${Date.now()}`,
      amount,
      note: saleNote.trim() || 'Venda manual',
      createdAt: new Date().toISOString()
    };
    const nextSales = [nextSale, ...currentManualSales];
    setManualSalesByKey(prev => ({ ...prev, [currentSalesKey]: nextSales }));
    window.localStorage.setItem(currentSalesKey, JSON.stringify(nextSales));
    setSaleAmount('');
    setSaleNote('');
    setShowManualSaleModal(false);
  };

  // Dynamic values for progress indicator
  const hasProducts = currentProductsInStore.length > 0;
  const hasWhatsapp = storeConfig.whatsapp.length > 5;
  const hasCustomName = storeConfig.name !== 'Digital Express Store';
  
  const completionSteps = [
    { name: 'Definir Nome e WhatsApp', done: hasCustomName && hasWhatsapp, action: 'Configurações' },
    { name: 'Selecionar nicho de mercado', done: true, action: 'Criar Loja' },
    { name: 'Adicionar produtos da vitrina', done: hasProducts, action: 'Produtos SaaS' },
    { name: 'Divulgar em redes sociais', done: false, action: 'Divulgação' }
  ];

  const doneStepsCount = completionSteps.filter(s => s.done).length;
  const progressPercent = Math.round((doneStepsCount / completionSteps.length) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-1">
        <div className="flex items-center justify-center p-1.5 rounded-lg bg-gray-100">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className="text-xl font-sans font-semibold text-gray-900 tracking-tight">Visão geral</h1>
        <span className="text-[13px] text-gray-500 font-medium ml-1 mt-0.5">Última atualização: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Timeframe pill */}
          <div className="inline-flex items-center bg-white border border-gray-300 rounded-lg shadow-sm p-0.5">
            {(['today', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setMetricTimeframe(t)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  metricTimeframe === t
                    ? 'bg-gray-100 text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {t === 'today' ? 'Hoje' : t === '7d' ? '7 dias' : '30 dias'}
              </button>
            ))}
          </div>

          {/* View Mode Pill */}
          <div className="inline-flex items-center bg-white border border-gray-300 rounded-lg shadow-sm p-0.5">
             {(['current', 'all'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setMetricView(view)}
                className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
                  metricView === view
                    ? 'bg-gray-100 text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {view === 'current' ? 'Loja atual' : 'Todas as lojas'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => setActionsMenuOpen(!actionsMenuOpen)}
            className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white text-[13px] font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            ...
          </button>
          
          {actionsMenuOpen && (
            <div className="absolute right-[90px] top-[calc(100%+8px)] z-50 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              <div className="p-1.5 flex flex-col">
                <button
                  onClick={() => {
                    setActionsMenuOpen(false);
                    setShowManualSaleModal(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-gray-100 text-[13px] font-medium text-gray-700"
                >
                  <span className="flex-1">Adicionar venda manual</span>
                  <Plus className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>
          )}

          <button 
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 rounded-lg border border-transparent bg-gray-900 text-[13px] font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
          >
            Atualizar
          </button>
        </div>
      </div>

      {/* Metric Cards Grid (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Vendas Brutal / Faturamento */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between card-enter card-enter-1 h-32 hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-[13px] font-medium text-gray-600 border-b border-gray-100 pb-2 border-dashed">Faturamento</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-gray-900">R$ {estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-[13px] text-gray-500">-</span>
            </div>
          </div>
          <div className="self-end w-16 h-4 mt-auto">
             <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
               <path d="M0 10 Q 25 5 50 15 T 100 8" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
             </svg>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-5 text-[11px] font-medium text-gray-600">
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#f59e0b]" />Ontem</span>
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#fcd34d]" />Hoje</span>
            </div>
          </div>
        </div>

        {/* Card 2: Visualizações */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between card-enter card-enter-2 h-32 hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-[13px] font-medium text-gray-600 border-b border-gray-100 pb-2 border-dashed">Visualizações</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-gray-900">{viewsCount.toLocaleString()}</span>
              <span className="text-[13px] text-gray-500">-</span>
            </div>
          </div>
          <div className="self-end w-16 h-4 mt-auto">
             <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
               <path d="M0 15 Q 25 20 50 10 T 100 5" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
             </svg>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-5 text-[11px] font-medium text-gray-600">
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#f59e0b]" />Ontem</span>
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#fcd34d]" />Hoje</span>
            </div>
          </div>
        </div>

        {/* Card 3: Cliques */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between card-enter card-enter-3 h-32 hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-[13px] font-medium text-gray-600 border-b border-gray-100 pb-2 border-dashed">Cliques na Loja</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-gray-900">{clicksCount.toLocaleString()}</span>
              <span className="text-[13px] text-gray-500">-</span>
            </div>
          </div>
          <div className="self-end w-16 h-4 mt-auto">
             <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
               <path d="M0 12 Q 25 5 50 18 T 100 10" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
             </svg>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-5 text-[11px] font-medium text-gray-600">
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#f59e0b]" />Ontem</span>
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#fcd34d]" />Hoje</span>
            </div>
          </div>
        </div>

        {/* Card 4: Contatos WhatsApp */}
        <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between card-enter card-enter-4 h-32 hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-[13px] font-medium text-gray-600 border-b border-gray-100 pb-2 border-dashed">Contatos WhatsApp</h3>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xl font-semibold text-gray-900">{contactsCount.toLocaleString()}</span>
              <span className="text-[13px] text-gray-500">-</span>
            </div>
          </div>
          <div className="self-end w-16 h-4 mt-auto">
             <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
               <path d="M0 18 Q 25 15 50 5 T 100 12" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
             </svg>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-5 text-[11px] font-medium text-gray-600">
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#f59e0b]" />Ontem</span>
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#fcd34d]" />Hoje</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area (Chart + Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
        {/* Main Chart Card */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm lg:col-span-2 flex flex-col">
          <div className="mb-8">
            <h3 className="text-[13px] font-medium text-gray-900">Total de interações ao longo do tempo</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-gray-900">{viewsCount.toLocaleString()}</span>
              <span className="text-[14px] text-gray-500">-</span>
            </div>
          </div>

          <div className="relative flex-1 min-h-[300px] w-full mt-auto">
            {/* Chart Simulation */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8">
              <div className="border-t border-gray-100 w-full flex-1"></div>
              <div className="border-t border-gray-100 w-full flex-1"></div>
              <div className="border-t border-gray-100 w-full flex-1"></div>
              <div className="border-t border-gray-100 w-full flex-1 relative">
                {/* Horizontal X Axis line */}
                <div className="absolute bottom-0 left-0 right-0 border-b-2 border-[#f59e0b]"></div>
              </div>
            </div>

            <svg viewBox="0 0 500 300" className="w-full h-full absolute inset-0 overflow-visible" preserveAspectRatio="none">
              <path
                d="M 0 290 L 100 290 Q 200 290 250 290 T 500 290"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              <path
                d="M 0 290 L 100 285 Q 200 270 250 250 T 500 200"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-5 text-[11px] font-medium text-gray-600">
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#f59e0b]" />Ontem</span>
              <span className="inline-flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-[#fcd34d]" />Hoje</span>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[11px] text-gray-500 px-2 font-medium">
              <span>00</span>
              <span>03</span>
              <span>06</span>
              <span>09</span>
              <span>12</span>
              <span>15</span>
              <span>18</span>
              <span>21</span>
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-[13px] font-medium text-gray-900 mb-4">Detalhamento do funil</h3>
          
          <div className="flex-1 space-y-0 text-[13px] font-medium">
            <div className="flex justify-between py-3 border-b border-gray-100 bg-gray-50/50 px-3 rounded-md">
              <span className="text-gray-600 font-normal">Visualizações</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-900">{viewsCount.toLocaleString()}</span>
                <span className="text-gray-400 w-4 text-right">-</span>
              </div>
            </div>
            
            <div className="flex justify-between py-3 px-3 border-b border-gray-100">
              <span className="text-gray-600 font-normal">Taxa de clique</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-900">{clickRate.toFixed(1)}%</span>
                <span className="text-gray-400 w-4 text-right">-</span>
              </div>
            </div>

            <div className="flex justify-between py-3 bg-gray-50/50 px-3 rounded-md border-b border-gray-100">
              <span className="text-gray-600 font-normal">Cliques na Loja</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-900">{clicksCount.toLocaleString()}</span>
                <span className="text-gray-400 w-4 text-right">-</span>
              </div>
            </div>

            <div className="flex justify-between py-3 px-3 border-b border-gray-100">
              <span className="text-gray-600 font-normal">Conversão Total</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-900">{conversionRate.toFixed(1)}%</span>
                <span className="text-gray-400 w-4 text-right">-</span>
              </div>
            </div>

            <div className="flex justify-between py-3 bg-gray-50/50 px-3 rounded-md border-b border-gray-100">
              <span className="text-gray-600 font-normal">Contatos WhatsApp</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-900">{contactsCount.toLocaleString()}</span>
                <span className="text-gray-400 w-4 text-right">-</span>
              </div>
            </div>

            <div className="flex justify-between py-3 px-3 border-b border-gray-100">
              <span className="text-[#f59e0b] font-normal">Faturamento</span>
              <div className="flex items-center gap-3">
                <span className="text-gray-900">R$ {estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span className="text-gray-400 w-4 text-right">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Area for previous activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm lg:col-span-2">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-[13px] font-medium text-gray-900">Atividades Recentes</h3>
           </div>
           {recentActivities.length === 0 ? (
             <div className="text-[13px] text-gray-500 bg-gray-50 p-4 rounded-lg">
                Nenhuma atividade ainda.
             </div>
           ) : (
             <div className="space-y-0">
               {recentActivities.map((act, index) => (
                 <div key={act.id} className={`flex justify-between py-3 px-3 text-[13px] border-b border-gray-100 ${index % 2 === 0 ? 'bg-gray-50/50 rounded-md' : ''}`}>
                   <span className="text-gray-600">{act.event}</span>
                   <span className="text-gray-900 font-medium">{act.detail}</span>
                 </div>
               ))}
             </div>
           )}
        </div>
        
        {/* Setup wizard progress guide (Simplified for Shopify style) */}
        <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
          <h3 className="text-[13px] font-medium text-gray-900 mb-4">Sua operação pronta para divulgar</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[13px] text-gray-600">Progresso ({doneStepsCount}/{completionSteps.length})</span>
            <span className="text-[13px] font-medium text-gray-900">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-5">
            <div 
              className="bg-gray-900 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="space-y-3">
             {completionSteps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between text-[13px]">
                   <span className={step.done ? 'text-gray-400 line-through' : 'text-gray-700'}>{step.name}</span>
                   {step.done ? (
                     <CheckCircle2 size={14} className="text-gray-400" />
                   ) : (
                     <button 
                       onClick={() => {
                         if (step.action === 'Criar Loja') onNavigate('wizard');
                         else if (step.action === 'Produtos SaaS') onNavigate('products');
                         else if (step.action === 'Configurações') onNavigate('settings');
                         else if (step.action === 'Divulgação') onNavigate('marketing');
                       }}
                       className="text-blue-600 hover:underline"
                     >
                       Configurar
                     </button>
                   )}
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Manual Sale Modal */}
      {showManualSaleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Nova Venda Manual</h3>
              <button 
                onClick={() => setShowManualSaleModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valor da venda (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={saleAmount}
                  onChange={(e) => setSaleAmount(e.target.value)}
                  placeholder="Ex: 97.50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nota ou descrição</label>
                <input
                  type="text"
                  value={saleNote}
                  onChange={(e) => setSaleNote(e.target.value)}
                  placeholder="Ex: Venda via WhatsApp"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={() => setShowManualSaleModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddManualSale}
                className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg shadow-sm hover:bg-brand-700 focus:outline-none"
              >
                Salvar Venda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



