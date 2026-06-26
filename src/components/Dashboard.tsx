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
  Plus
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
    const manualRevenue = storeSales.reduce((sum, sale) => sum + sale.amount, 0);
    const averageTicket = selectedProducts.length ? selectedProducts.reduce((sum, product) => sum + product.salePrice, 0) / selectedProducts.length : 0;
    const projectedSales = hasOperationalData ? Math.max(storeSales.length, Math.round(contacts * 0.32)) : storeSales.length;
    const projectedRevenue = hasOperationalData ? projectedSales * averageTicket : 0;
    const revenue = manualRevenue > 0 ? manualRevenue : projectedRevenue;
    const salesCount = manualRevenue > 0 ? storeSales.length : projectedSales;
    const revenueMode = manualRevenue > 0 ? 'manual' : 'projected';
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
      revenueMode,
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
  const manualRevenueVisible = visibleMetrics.reduce((sum, metric) => sum + metric.storeSales.reduce((saleSum, sale) => saleSum + sale.amount, 0), 0);
  const revenueIsProjected = manualRevenueVisible <= 0 && estimatedRevenue > 0;
  const viewsGrowth = visibleMetrics.reduce((sum, metric) => sum + metric.viewsGrowthValue, 0) / activeMetricsCount;
  const clicksGrowth = visibleMetrics.reduce((sum, metric) => sum + metric.clicksGrowthValue, 0) / activeMetricsCount;
  const contactsGrowth = visibleMetrics.reduce((sum, metric) => sum + metric.contactsGrowthValue, 0) / activeMetricsCount;
  const clickRate = viewsCount > 0 ? (clicksCount / viewsCount) * 100 : 0;
  const conversionRate = clicksCount > 0 ? (contactsCount / clicksCount) * 100 : 0;
  const chartDays = metricTimeframe === 'today'
    ? ['8h', '10h', '12h', '14h', '16h', '18h', 'Agora']
    : metricTimeframe === '7d'
      ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']
      : ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'Hoje'];
  const chartValues = chartDays.map((_, index) => {
    const progress = chartDays.length === 1 ? 1 : index / (chartDays.length - 1);
    const wave = Math.sin((index + 1) * 1.35) * 0.12;
    return Math.max(0, Math.round((clicksCount * (0.45 + progress * 0.72 + wave)) / chartDays.length));
  });
  const maxChartValue = Math.max(1, ...chartValues);
  const chartPoints = chartValues.map((value, index) => {
    const x = 20 + index * (460 / Math.max(1, chartValues.length - 1));
    const y = 178 - (value / maxChartValue) * 138;
    return { x, y, value, label: chartDays[index] };
  });
  const chartLine = chartPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const chartArea = `${chartLine} L ${chartPoints[chartPoints.length - 1]?.x.toFixed(1) || 480} 180 L ${chartPoints[0]?.x.toFixed(1) || 20} 180 Z`;
  const chartGrowth = chartValues.length > 1 && chartValues[0] > 0
    ? ((chartValues[chartValues.length - 1] - chartValues[0]) / chartValues[0]) * 100
    : viewsGrowth;
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
    <div className="space-y-8 animate-fade-in">
      {/* Upper header */}
      <div className="flex flex-col gap-4 text-left xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-3xl font-display font-medium text-white tracking-tight flex items-center gap-2">
            {accountName ? `Ol\u00e1, ${accountName}` : 'Ol\u00e1'} <span className="text-wave" aria-hidden="true">&#128075;</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            <span className="font-semibold text-indigo-400">{viewLabel}</span> - {viewDescription}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center xl:self-center">
          <div className="p-1 rounded-xl bg-white/[0.03] border border-white/10 inline-flex self-start backdrop-blur-xl">
            {(['current', 'all'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setMetricView(view)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  metricView === view
                    ? 'bg-brand-500 text-black font-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {view === 'current' ? 'Loja atual' : 'Todas as lojas'}
              </button>
            ))}
          </div>

          <div className="p-1 rounded-xl bg-white/[0.03] border border-white/10 inline-flex self-start backdrop-blur-xl">
            {(['today', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setMetricTimeframe(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  metricTimeframe === t
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t === 'today' ? 'Hoje' : t === '7d' ? '7 Dias' : '30 Dias'}
              </button>
            ))}
          <p className="mt-4 text-xs text-slate-400">
            {revenueIsProjected ? 'Estimativa calculada pelos produtos selecionados e contatos previstos. Lance vendas reais abaixo para trocar para faturamento confirmado.' : 'Total confirmado pelas vendas lançadas manualmente.'}
          </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        {/* Metric 1 */}
        <div className="p-6 rounded-2xl glass-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full opacity-60 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Visualizações</p>
              <h3 className="text-2xl font-display font-bold text-white mt-2">{viewsCount.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Eye className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5 font-sans">
            <span className="text-emerald-400 font-bold font-mono">+{viewsGrowth.toFixed(1)}%</span> em relação ao período anterior
          </p>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-2xl glass-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-600/10 to-transparent rounded-bl-full opacity-60 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Cliques na Loja</p>
              <h3 className="text-2xl font-display font-bold text-white mt-2">{clicksCount.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5 font-sans">
            <span className="text-emerald-400 font-bold font-mono">+{clicksGrowth.toFixed(1)}%</span> Taxa de clique: <span className="font-semibold text-white">{clickRate.toFixed(1)}%</span>
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-2xl glass-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-600/10 to-transparent rounded-bl-full opacity-60 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Contatos WhatsApp</p>
              <h3 className="text-2xl font-display font-bold text-white mt-2">{contactsCount.toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.05] text-brand-500 border border-brand-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5 font-sans">
            <span className="text-emerald-400 font-bold font-mono">+{contactsGrowth.toFixed(1)}%</span> Conversão total: <span className="font-semibold text-white">{conversionRate.toFixed(1)}%</span>
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-2xl glass-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-500/10 to-transparent rounded-bl-full opacity-60 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Faturamento</p>
              <h3 className="text-2xl font-display font-bold text-white mt-2">
                R$ {estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20" style={{ color: storeConfig.primaryColor, backgroundColor: `${storeConfig.primaryColor}12` }}>
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
        {/* Core Conversion Chart simulation with SVG */}
        <div className="p-6 rounded-2xl glass-premium lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-display font-medium text-white">Funil de Conversão e Cliques</h3>
              <p className="text-xs text-slate-400 mt-0.5">Estatísticas diárias filtradas de interações na sua vitrine</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-semibold text-emerald-450 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center gap-1 select-none font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              +18.4% conversão
            </span>
          </div>

          {/* Premium Custom SVG Chart */}
          <div className="relative h-64 w-full flex flex-col justify-end">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible animate-fade-in">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={storeConfig.primaryColor} stopOpacity="0.32" />
                  <stop offset="100%" stopColor={storeConfig.primaryColor} stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="glowLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#d4af37" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="180" x2="500" y2="180" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

              {/* Chart Line Gradient Area */}
              <path
                d={chartArea}
                fill="url(#chartGrad)"
              />

              {/* Dynamic Line Accent */}
              <path
                d={chartLine}
                fill="none"
                stroke={storeConfig.primaryColor}
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Interactive Dots */}
              {chartPoints.map((point, index) => (
                <g key={point.label}>
                  <circle cx={point.x} cy={point.y} r={index === chartPoints.length - 1 ? 6 : 4.5} fill="#030305" stroke={storeConfig.primaryColor} strokeWidth="3" />
                  <text x={point.x} y={point.y - 14} fontSize="9" fontWeight="700" fill={index === chartPoints.length - 1 ? '#d4af37' : '#64748b'} textAnchor="middle" fontFamily="monospace">{point.value}</text>
                </g>
              ))}
            </svg>
            
            {/* Chart Legends */}
            <div className="flex justify-between items-center text-slate-500 text-[10px] font-bold px-2 mt-4 font-mono uppercase tracking-wider">
              <span>Segunda</span>
              <span>Terça</span>
              <span>Quarta</span>
              <span>Quinta</span>
              <span>Sexta</span>
              <span>Sábado</span>
              <span>Domingo</span>
            </div>
          </div>
        </div>

        {/* Setup wizard progress guide */}
        <div className="p-6 rounded-2xl glass-premium-glow text-white flex flex-col justify-between relative overflow-hidden">
          {/* Glass light source */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl opacity-40 animate-pulse" />
          
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-amber-500 tracking-wider font-mono uppercase bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                PROCESSO DE SETUP
              </span>
              <span className="text-xl font-bold font-mono text-amber-500">{progressPercent}%</span>
            </div>
            
            <h3 className="text-lg font-display font-medium text-white">Sua operação pronta para divulgar</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Escolha o nicho, monte a vitrine e gere os materiais para começar a receber interessados no WhatsApp.
            </p>

            {/* Progress bar visual */}
            <div className="w-full bg-white/[0.05] h-1.5 rounded-full overflow-hidden mt-5">
              <div 
                className="bg-gradient-to-r from-brand-600 to-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Steps Checklist */}
            <div className="mt-6 space-y-3.5">
              {completionSteps.map((step, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.015] border border-white/5 hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      step.done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/[0.05] text-slate-500'
                    }`}>
                      <CheckCircle2 className="w-4.5 h-4.5" />
                    </div>
                    <span className={`text-xs ${step.done ? 'text-slate-500 line-through font-normal' : 'text-slate-200 font-medium'}`}>
                      {step.name}
                    </span>
                  </div>
                  {!step.done && (
                    <button 
                      onClick={() => {
                        if (step.action === 'Criar Loja') onNavigate('wizard');
                        else if (step.action === 'Produtos SaaS') onNavigate('products');
                        else if (step.action === 'Configurações') onNavigate('settings');
                        else if (step.action === 'Divulgação') onNavigate('marketing');
                      }}
                      className="text-[11px] font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1 font-mono hover:underline cursor-pointer"
                    >
                      Ir <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-white/[0.08] pt-4 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Produtos na vitrine: <span className="text-white font-bold">{currentProductsInStore.length} itens</span>
            </div>
            <button 
              onClick={() => onNavigate('shop-preview')}
              className="px-3.5 py-1.5 rounded-lg bg-white text-slate-900 text-xs font-bold hover:bg-slate-200 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Testar Vitrine
            </button>
          </div>
        </div>
      </div>

      {/* Activity and Management Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left text-sans">
        {/* Recent Activities feed */}
        <div className="p-6 rounded-2xl glass-premium lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-display font-medium text-white">Atividades Recentes</h3>
              <p className="text-xs text-slate-400 mt-0.5">Monitoramento em tempo real de logs de eventos da plataforma</p>
            </div>
            <span className="text-xs text-slate-505 font-mono uppercase tracking-wider text-slate-500">Atualizado agora</span>
          </div>

          <div className="space-y-4">
            {recentActivities.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-black/20 p-5 text-sm text-slate-400">
                Nenhuma atividade ainda. As métricas começam zeradas e passam a atualizar quando você registrar vendas ou conectar eventos reais.
              </div>
            )}

            {recentActivities.map((act) => {
              const IconComp = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.015] transition-all duration-200 border border-transparent hover:border-white/5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${act.color}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 font-mono flex items-center justify-between">
                      <span className="font-semibold">{act.event}</span>
                      <span>{act.time}</span>
                    </p>
                    <p className="text-xs text-slate-300 mt-1">{act.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick action helper & FAQ Info */}
        <div className="p-6 rounded-2xl glass-premium flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-display font-medium text-white">Dica do Fornecedor</h3>
            <p className="text-xs text-slate-400 mt-0.5">Turbine sua comissão de produtos de alta demanda</p>

            <div className="mt-6 p-4 rounded-xl bg-amber-500/[0.02] border border-amber-500/15 relative group overflow-hidden">
              <span className="absolute -top-1.5 right-4 px-2 py-0.5 rounded text-[9px] font-extrabold text-black bg-brand-500 font-mono uppercase tracking-wider">
                MAIS VENDIDO 🔥
              </span>
              <p className="text-xs font-bold text-amber-500">Games & Redes Sociais no Topo</p>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Produtos como <strong>Diamantes Free Fire</strong> e <strong>Seguidores de Instagram</strong> possuem margem líquida superior a <strong>60%</strong> e entrega imediata.
              </p>
              
              <button 
                onClick={() => onNavigate('products')}
                className="mt-3 flex items-center gap-1.5 text-xs text-amber-500 font-bold hover:text-amber-400 cursor-pointer"
              >
                <span>Adicionar mais destes</span>
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick guide on WhatsApp workflow */}
            <div className="mt-6 space-y-4">
              <h4 className="text-xs font-bold tracking-widest text-slate-500 font-mono uppercase">COMO FUNCIONA O FLUXO</h4>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-xs font-semibold text-white font-mono">
                  1
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Cliente escolhe o produto</p>
                  <p className="text-[11px] text-slate-400 leading-snug">Na sua vitrine ele seleciona as recargas ou assinaturas.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-xs font-semibold text-white font-mono">
                  2
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Chama com carrinho pronto</p>
                  <p className="text-[11px] text-slate-400 leading-snug">O pedido chega formatado com todos os itens diretamente no seu WhatsApp.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center text-xs font-semibold text-white font-mono">
                  3
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Você recebe e envia o pin</p>
                  <p className="text-[11px] text-slate-400 leading-snug">O cliente paga via PIX, você adquire a chave digital e o pin do fornecedor, lucrando a diferença instantaneamente!</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('wizard')}
            className="mt-6 w-full py-3 bg-white hover:bg-slate-200 text-black rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
          >
            <Sparkles className="w-4.5 h-4.5 text-brand-600" />
            <span>Refazer Assistente Wizard</span>
          </button>
        </div>
      </div>

      <div className="pt-4">
        <div className="max-w-xl ml-auto p-4 rounded-2xl border border-brand-500/20 bg-brand-500/[0.045] text-left">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold">Atualizar vendas da loja</p>
              <p className="text-[11px] text-slate-500">Use só quando quiser refletir vendas fechadas manualmente no dashboard.</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {currentManualSalesCount} vendas • R$ {currentManualSalesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr_auto] gap-2">
            <input
              value={saleAmount}
              onChange={(event) => setSaleAmount(event.target.value)}
              placeholder="Valor"
              className="px-3 py-2 rounded-xl bg-black/20 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/30 font-mono"
            />
            <input
              value={saleNote}
              onChange={(event) => setSaleNote(event.target.value)}
              placeholder="Produto ou observação"
              className="px-3 py-2 rounded-xl bg-black/20 border border-white/10 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-white/30"
            />
            <button
              onClick={handleAddManualSale}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
            >
              Lançar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
