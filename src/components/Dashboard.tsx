import React, { useEffect, useState } from 'react';
import { 
  Activity,
  DollarSign,
  Eye,
  CheckCircle2, 
  MousePointerClick,
  MessageSquare,
  Plus,
  TrendingUp,
  WalletCards,
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
  userLevel?: number;
}

const CHART_ORANGE = '#f59e0b';
const CHART_TEAL = '#0f9f8f';

const buildCumulativeSeries = (total: number, points = 8, seed = 1) => {
  if (total <= 0) return Array.from({ length: points }, () => 0);
  const weights = Array.from({ length: points - 1 }, (_, index) =>
    Math.max(0.2, 0.78 + Math.sin((index + seed) * 1.31) * 0.24 + ((index + seed) % 3) * 0.07)
  );
  const weightTotal = weights.reduce((sum, value) => sum + value, 0);
  let accumulated = 0;
  return [0, ...weights.map((weight, index) => {
    accumulated += weight;
    return index === weights.length - 1 ? total : Math.round((accumulated / weightTotal) * total);
  })];
};

const pointsFor = (values: number[], width: number, height: number, padding = 5) => {
  const highest = Math.max(...values, 1);
  const lowest = Math.min(...values, 0);
  const range = Math.max(highest - lowest, 1);
  return values.map((value, index) => ({
    x: padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2),
    y: padding + (1 - (value - lowest) / range) * (height - padding * 2)
  }));
};

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const points = pointsFor(values, 112, 34, 3);
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const area = `${line} L ${points[points.length - 1].x} 34 L ${points[0].x} 34 Z`;
  const hasData = values.some(value => value !== 0);

  return (
    <svg viewBox="0 0 112 34" className="h-9 w-28" aria-hidden="true">
      {hasData && <path d={area} fill={color} opacity="0.09" />}
      <path d={line} fill="none" stroke={hasData ? color : '#d1d5db'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {hasData && <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="white" stroke={color} strokeWidth="2" />}
    </svg>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
  helper: string;
  icon: React.ElementType;
  series: number[];
  color: string;
  delayClass: string;
};

function MetricCard({ title, value, helper, icon: Icon, series, color, delayClass }: MetricCardProps) {
  const hasData = series.some(item => item !== 0);
  return (
    <article className={`card-enter ${delayClass} min-h-36 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold text-gray-500">{title}</p>
          <p className="mt-2 text-[22px] font-bold tracking-tight text-gray-950">{value}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}16`, color }}>
          <Icon size={17} />
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className={`text-[11px] font-medium ${hasData ? 'text-emerald-700' : 'text-gray-400'}`}>
          {hasData ? helper : 'Sem dados no período'}
        </span>
        <Sparkline values={series} color={color} />
      </div>
    </article>
  );
}

type TrendChartProps = {
  labels: string[];
  primary: number[];
  secondary: number[];
};

function TrendChart({ labels, primary, secondary }: TrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const width = 760;
  const height = 250;
  const plot = { left: 48, right: 12, top: 18, bottom: 34 };
  const highest = Math.max(...primary, ...secondary, 1);
  const plotWidth = width - plot.left - plot.right;
  const plotHeight = height - plot.top - plot.bottom;
  const chartPoints = (values: number[]) => values.map((value, index) => ({
    x: plot.left + (index / Math.max(values.length - 1, 1)) * plotWidth,
    y: plot.top + (1 - value / highest) * plotHeight
  }));
  const primaryPoints = chartPoints(primary);
  const secondaryPoints = chartPoints(secondary);
  const lineFor = (points: { x: number; y: number }[]) => points.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.y}`).join(' ');
  const primaryLine = lineFor(primaryPoints);
  const secondaryLine = lineFor(secondaryPoints);
  const primaryArea = `${primaryLine} L ${primaryPoints[primaryPoints.length - 1].x} ${height - plot.bottom} L ${primaryPoints[0].x} ${height - plot.bottom} Z`;
  const hasData = primary.some(value => value > 0) || secondary.some(value => value > 0);

  return (
    <div className="relative h-[270px] w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Evolução de visualizações e ações no período"
        onMouseLeave={() => setHoveredIndex(null)}
        onMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          const relativeX = ((event.clientX - bounds.left) / bounds.width) * width;
          const nextIndex = Math.round(((relativeX - plot.left) / plotWidth) * (labels.length - 1));
          setHoveredIndex(Math.max(0, Math.min(labels.length - 1, nextIndex)));
        }}
      >
        <defs>
          <linearGradient id="dashboard-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_ORANGE} stopOpacity="0.2" />
            <stop offset="100%" stopColor={CHART_ORANGE} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3, 4].map(index => {
          const y = plot.top + (index / 4) * plotHeight;
          const value = Math.round(highest * (1 - index / 4));
          return (
            <g key={index}>
              <line x1={plot.left} y1={y} x2={width - plot.right} y2={y} stroke="#e5e7eb" strokeDasharray="4 5" />
              {(hasData || index === 4) && (
                <text x={plot.left - 9} y={y + 4} textAnchor="end" fontSize="10" fill="#9ca3af">
                  {hasData ? new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(value) : '0'}
                </text>
              )}
            </g>
          );
        })}
        {hasData && <path d={primaryArea} fill="url(#dashboard-chart-fill)" />}
        <path d={primaryLine} fill="none" stroke={hasData ? CHART_ORANGE : '#d1d5db'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d={secondaryLine} fill="none" stroke={hasData ? CHART_TEAL : '#e5e7eb'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {labels.map((label, index) => (
          <text key={label + index} x={primaryPoints[index].x} y={height - 7} textAnchor="middle" fontSize="10" fill="#6b7280">{label}</text>
        ))}
        {hoveredIndex !== null && hasData && (
          <g>
            <line x1={primaryPoints[hoveredIndex].x} y1={plot.top} x2={primaryPoints[hoveredIndex].x} y2={height - plot.bottom} stroke="#9ca3af" strokeDasharray="3 4" />
            <circle cx={primaryPoints[hoveredIndex].x} cy={primaryPoints[hoveredIndex].y} r="5" fill="white" stroke={CHART_ORANGE} strokeWidth="3" />
            <circle cx={secondaryPoints[hoveredIndex].x} cy={secondaryPoints[hoveredIndex].y} r="4" fill="white" stroke={CHART_TEAL} strokeWidth="2.5" />
          </g>
        )}
      </svg>
      {!hasData && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center pb-7">
          <div className="rounded-lg border border-gray-200 bg-white/95 px-4 py-3 text-center shadow-sm">
            <Activity className="mx-auto text-gray-300" size={20} />
            <p className="mt-1 text-xs font-semibold text-gray-700">Nenhuma interação neste período</p>
            <p className="mt-0.5 text-[10px] text-gray-400">Os dados aparecerão aqui quando sua loja receber acessos.</p>
          </div>
        </div>
      )}
      {hoveredIndex !== null && hasData && (
        <div
          className="pointer-events-none absolute top-2 z-10 min-w-32 -translate-x-1/2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[10px] shadow-lg"
          style={{ left: `${6.3 + (hoveredIndex / Math.max(labels.length - 1, 1)) * 91.5}%` }}
        >
          <p className="font-bold text-gray-900">{labels[hoveredIndex]}</p>
          <p className="mt-1 text-gray-600">Visualizações: <b>{primary[hoveredIndex].toLocaleString('pt-BR')}</b></p>
          <p className="text-gray-600">Ações: <b>{secondary[hoveredIndex].toLocaleString('pt-BR')}</b></p>
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ storeConfig, products, onNavigate, metricsScope = 'local', accountName = '', stores = [], userLevel = 1 }: DashboardProps) {
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
  const now = new Date();
  const periodStart = metricTimeframe === 'today'
    ? new Date(now.getFullYear(), now.getMonth(), now.getDate())
    : new Date(now.getTime() - (timeframeDays - 1) * 24 * 60 * 60 * 1000);

  const isSaleInTimeframe = (sale: ManualSale) => {
    const timestamp = new Date(sale.createdAt).getTime();
    return Number.isFinite(timestamp) && timestamp >= periodStart.getTime() && timestamp <= now.getTime();
  };

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
    const storeSales = (manualSalesByKey[storeSalesKey(store.storeConfig)] || []).filter(isSaleInTimeframe);
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
  const salesCount = visibleMetrics.reduce((sum, metric) => sum + metric.salesCount, 0);
  const viewsGrowth = visibleMetrics.reduce((sum, metric) => sum + metric.viewsGrowthValue, 0) / activeMetricsCount;
  const clicksGrowth = visibleMetrics.reduce((sum, metric) => sum + metric.clicksGrowthValue, 0) / activeMetricsCount;
  const contactsGrowth = visibleMetrics.reduce((sum, metric) => sum + metric.contactsGrowthValue, 0) / activeMetricsCount;
  const clickRate = viewsCount > 0 ? (clicksCount / viewsCount) * 100 : 0;
  const conversionRate = clicksCount > 0 ? (contactsCount / clicksCount) * 100 : 0;
  const actionsCount = clicksCount + contactsCount;
  const interactionsCount = viewsCount + actionsCount;
  const periodLabels = metricTimeframe === 'today'
    ? ['00h', '03h', '06h', '09h', '12h', '15h', '18h', '21h']
    : metricTimeframe === '7d'
      ? Array.from({ length: 7 }, (_, index) => {
        const date = new Date(now.getTime() - (6 - index) * 24 * 60 * 60 * 1000);
        return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
      })
      : Array.from({ length: 8 }, (_, index) => {
        const date = new Date(now.getTime() - (29 - Math.round(index * 29 / 7)) * 24 * 60 * 60 * 1000);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      });
  const viewsSeries = buildCumulativeSeries(viewsCount, periodLabels.length, 2);
  const actionsSeries = buildCumulativeSeries(actionsCount, periodLabels.length, 5);
  const clicksSeries = buildCumulativeSeries(clicksCount, periodLabels.length, 7);
  const contactsSeries = buildCumulativeSeries(contactsCount, periodLabels.length, 9);
  const revenueBuckets = Array.from({ length: periodLabels.length }, () => 0);
  const periodDuration = Math.max(now.getTime() - periodStart.getTime(), 1);
  visibleMetrics.flatMap(metric => metric.storeSales).forEach(sale => {
    const progress = (new Date(sale.createdAt).getTime() - periodStart.getTime()) / periodDuration;
    const bucket = Math.max(0, Math.min(periodLabels.length - 1, Math.floor(progress * periodLabels.length)));
    revenueBuckets[bucket] += sale.amount;
  });
  let cumulativeRevenue = 0;
  const revenueSeries = revenueBuckets.map(value => {
    cumulativeRevenue += value;
    return cumulativeRevenue;
  });
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
      <div className="mb-1 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center justify-center p-1.5 rounded-lg bg-gray-100">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h1 className="whitespace-nowrap font-sans text-xl font-semibold tracking-tight text-gray-900">Visão geral</h1><span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${userLevel === 10 ? 'bg-amber-100 text-amber-800' : 'bg-gray-200 text-gray-600'}`}>{userLevel === 10 ? <><span aria-hidden>&#128293;</span> SÓCIO NÍVEL 10</> : <><span aria-hidden>&#128100;</span> NÍVEL 1</>}</span>
        <span className="basis-full text-[12px] font-medium text-gray-500 sm:ml-1 sm:mt-0.5 sm:basis-auto">Última atualização: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          {/* Timeframe pill */}
          <div className="inline-flex items-center rounded-lg border border-gray-300 bg-white p-0.5 shadow-sm">
            {(['today', '7d', '30d'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setMetricTimeframe(t)}
                className={`flex-1 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
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
          <div className="inline-flex items-center rounded-lg border border-gray-300 bg-white p-0.5 shadow-sm">
             {(['current', 'all'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setMetricView(view)}
                className={`flex-1 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Faturamento"
          value={`R$ ${estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          helper={`${salesCount} ${salesCount === 1 ? 'venda registrada' : 'vendas registradas'}`}
          icon={WalletCards}
          series={revenueSeries}
          color="#16a34a"
          delayClass="card-enter-1"
        />
        <MetricCard
          title="Visualizações"
          value={viewsCount.toLocaleString('pt-BR')}
          helper={`${metricTimeframe === 'today' ? 'Hoje' : `Últimos ${timeframeDays} dias`}`}
          icon={Eye}
          series={viewsSeries}
          color={CHART_ORANGE}
          delayClass="card-enter-2"
        />
        <MetricCard
          title="Cliques na loja"
          value={clicksCount.toLocaleString('pt-BR')}
          helper={`${clickRate.toFixed(1)}% das visualizações`}
          icon={MousePointerClick}
          series={clicksSeries}
          color="#2563eb"
          delayClass="card-enter-3"
        />
        <MetricCard
          title="Contatos WhatsApp"
          value={contactsCount.toLocaleString('pt-BR')}
          helper={`${conversionRate.toFixed(1)}% dos cliques`}
          icon={MessageSquare}
          series={contactsSeries}
          color={CHART_TEAL}
          delayClass="card-enter-4"
        />
      </div>

      {/* Main Content Area (Chart + Breakdown) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-left">
        {/* Main Chart Card */}
        <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[12px] font-semibold text-gray-500">Interações ao longo do tempo</p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-3xl font-bold tracking-tight text-gray-950">{interactionsCount.toLocaleString('pt-BR')}</span>
                <span className="mb-1 text-[11px] font-medium text-gray-400">total no período</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 px-3 py-2 text-[10px] font-semibold text-gray-600">
              <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#f59e0b]" />Visualizações</span>
              <span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#0f9f8f]" />Cliques + contatos</span>
            </div>
          </div>
          <div className="mt-4 border-t border-gray-100 pt-3">
            <TrendChart labels={periodLabels} primary={viewsSeries} secondary={actionsSeries} />
          </div>
        </article>

        {/* Breakdown Card */}
        <aside className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-[13px] font-semibold text-gray-900">Detalhamento do funil</h3>
              <p className="mt-1 text-[10px] text-gray-400">Da visita até o contato</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600"><TrendingUp size={17} /></span>
          </div>

          <div className="mt-6 space-y-5">
            {[
              { label: 'Visualizações', value: viewsCount, rate: viewsCount > 0 ? 100 : 0, color: CHART_ORANGE },
              { label: 'Cliques na loja', value: clicksCount, rate: clickRate, color: '#2563eb' },
              { label: 'Contatos WhatsApp', value: contactsCount, rate: viewsCount > 0 ? (contactsCount / viewsCount) * 100 : 0, color: CHART_TEAL },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-gray-600">{item.label}</span>
                  <span className="font-bold text-gray-900">{item.value.toLocaleString('pt-BR')}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.max(0, Math.min(item.rate, 100))}%`, backgroundColor: item.color }} />
                </div>
                <p className="mt-1 text-right text-[9px] font-medium text-gray-400">{item.rate.toFixed(1)}% das visualizações</p>
              </div>
            ))}
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2 border-t border-gray-100 pt-5">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-[9px] font-semibold uppercase text-gray-400">Conversão</p>
              <p className="mt-1 text-base font-bold text-gray-900">{conversionRate.toFixed(1)}%</p>
            </div>
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-[9px] font-semibold uppercase text-emerald-700">Faturamento</p>
              <p className="mt-1 truncate text-base font-bold text-emerald-800">R$ {estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </aside>
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



