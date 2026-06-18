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

interface DashboardProps {
  storeConfig: StoreConfig;
  products: Product[];
  onNavigate: (page: string) => void;
}

export default function Dashboard({ storeConfig, products, onNavigate }: DashboardProps) {
  // Simple state for filtering feed
  const [metricTimeframe, setMetricTimeframe] = useState<'7d' | '30d' | 'today'>('7d');
  const salesStorageKey = `storefy.sales.${storeConfig.id || storeConfig.subdomain}`;
  const [manualSales, setManualSales] = useState<Array<{ id: string; amount: number; note: string; createdAt: string }>>(() => {
    try {
      const raw = window.localStorage.getItem(`storefy.sales.${storeConfig.id || storeConfig.subdomain}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [saleAmount, setSaleAmount] = useState('');
  const [saleNote, setSaleNote] = useState('');

  const productsInStore = products.filter(p => p.addedToStore);
  
  // Simulated data for metrics based on products count or standard premium SaaS specs
  const viewsCount = metricTimeframe === 'today' ? 142 : metricTimeframe === '7d' ? 1240 : 4980;
  const clicksCount = metricTimeframe === 'today' ? 38 : metricTimeframe === '7d' ? 312 : 1120;
  const conversionsCount = metricTimeframe === 'today' ? 11 : metricTimeframe === '7d' ? 84 : 290;
  const manualSalesTotal = manualSales.reduce((sum, sale) => sum + sale.amount, 0);
  const manualSalesCount = manualSales.length;
  
  // Estimated sales is direct profit or total volume. Suppose conversion rate x average item price
  const estimatedRevenue = (metricTimeframe === 'today' ? 345.90 : metricTimeframe === '7d' ? 2450.00 : 8920.00) + manualSalesTotal;

  useEffect(() => {
    window.localStorage.setItem(salesStorageKey, JSON.stringify(manualSales));
  }, [manualSales, salesStorageKey]);

  const handleAddManualSale = () => {
    const amount = Number(saleAmount.replace(',', '.'));
    if (!Number.isFinite(amount) || amount <= 0) return;

    setManualSales(prev => [
      {
        id: `${Date.now()}`,
        amount,
        note: saleNote.trim() || 'Venda manual',
        createdAt: new Date().toISOString()
      },
      ...prev
    ]);
    setSaleAmount('');
    setSaleNote('');
  };
  
  // Calculate potential margin (since we have the costPrice vs salePrice)
  let totalPotentialMargin = 0;
  productsInStore.forEach(p => {
    totalPotentialMargin += (p.salePrice - p.costPrice);
  });

  const simulatedActivities = [
    { id: 1, time: 'Há 5 minutos', event: 'Novo contato via WhatsApp', detail: 'Cliente Lucas D. perguntou sobre "Recarga Free Fire"', type: 'conversion', icon: MessageSquare, color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 2, time: 'Há 22 minutos', event: 'Visualização de Produto', detail: 'Visitante acessou "Spotify Premium Individual - Plano 1 Mês"', type: 'view', icon: Eye, color: 'text-cyan-400 bg-cyan-500/10' },
    { id: 3, time: 'Há 1 hora', event: 'Preço Voador Editado', detail: 'Você atualizou o preço de venda da licença "Canva Pro Convite"', type: 'edit', icon: ShoppingBag, color: 'text-violet-400 bg-violet-500/10' },
    { id: 4, time: 'Há 4 horas', event: 'Conversão de Venda Iniciada', detail: 'Cliente Maria S. clicou em Comprar no "Super Pack Templates Notion"', type: 'conversion', icon: MessageSquare, color: 'text-emerald-400 bg-emerald-500/10' },
    { id: 5, time: 'Há 1 dia', event: 'Sincronização de Catálogo', detail: 'Gamerhub Brasil Ltda atualizou estoque de 8 categorias', type: 'system', icon: Sparkles, color: 'text-amber-400 bg-amber-500/10' }
  ];

  // Dynamic values for progress indicator
  const hasProducts = productsInStore.length > 0;
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div>
          <h1 className="text-3xl font-display font-medium text-white tracking-tight flex items-center gap-2">
            Olá, Gabriel <span className="text-wave">👋</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sua loja <span className="font-semibold text-indigo-400">{storeConfig.name}</span> está no ar e pronta para vender.
          </p>
        </div>

        {/* Timeframe picker */}
        <div className="p-1 rounded-xl bg-white/[0.03] border border-white/10 inline-flex self-start md:self-center backdrop-blur-xl">
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
            <span className="text-emerald-400 font-bold font-mono">↑ 14.2%</span> em relação ao período anterior
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
            <span className="text-emerald-400 font-bold font-mono">↑ 8.3%</span> Taxa de clique: <span className="font-semibold text-white">{(clicksCount/viewsCount * 100).toFixed(1)}%</span>
          </p>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-2xl glass-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-600/10 to-transparent rounded-bl-full opacity-60 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Contatos WhatsApp</p>
              <h3 className="text-2xl font-display font-bold text-white mt-2">{(conversionsCount + manualSalesCount).toLocaleString()}</h3>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.05] text-brand-500 border border-brand-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5 font-sans">
            <span className="text-emerald-400 font-bold font-mono">↑ 21.0%</span> Conversão total: <span className="font-semibold text-white">{((conversionsCount + manualSalesCount)/clicksCount * 100).toFixed(1)}%</span>
          </p>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-2xl glass-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-brand-500/10 to-transparent rounded-bl-full opacity-60 group-hover:scale-110 transition-transform duration-500" />
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Vendas Estimadas</p>
              <h3 className="text-2xl font-display font-bold text-white mt-2">
                R$ {estimatedRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
            </div>
            <div className="p-3 rounded-xl bg-brand-500/10 text-brand-500 border border-brand-500/20" style={{ color: storeConfig.primaryColor, backgroundColor: `${storeConfig.primaryColor}12` }}>
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5 font-sans">
            Margem acumulada: <span className="font-semibold text-brand-500 font-mono">R$ {(estimatedRevenue * 0.35).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} (35%)</span>
          </p>
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
                d="M 10 180 Q 80 150 120 120 T 220 80 T 320 110 T 420 50 T 490 35 L 490 180 Z"
                fill="url(#chartGrad)"
              />

              {/* Dynamic Line Accent */}
              <path
                d="M 10 180 Q 80 150 120 120 T 220 80 T 320 110 T 420 50 T 490 35"
                fill="none"
                stroke={storeConfig.primaryColor}
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Interactive Dots */}
              <circle cx="120" cy="120" r="5" fill="#030305" stroke={storeConfig.primaryColor} strokeWidth="3" />
              <circle cx="220" cy="80" r="5" fill="#030305" stroke={storeConfig.primaryColor} strokeWidth="3" />
              <circle cx="420" cy="50" r="5" fill="#030305" stroke={storeConfig.primaryColor} strokeWidth="3" />
              <circle cx="490" cy="35" r="5" fill="#030305" stroke={storeConfig.primaryColor} strokeWidth="3" />

              {/* Guidelines or Tooltips labels */}
              <text x="120" y="102" fontSize="9" fontWeight="600" fill="#64748b" textAnchor="middle" fontFamily="monospace">Dom</text>
              <text x="220" y="62" fontSize="9" fontWeight="600" fill="#64748b" textAnchor="middle" fontFamily="monospace">Ter</text>
              <text x="420" y="32" fontSize="9" fontWeight="600" fill="#64748b" textAnchor="middle" fontFamily="monospace">Sex</text>
              <text x="490" y="18" fontSize="9" fontWeight="600" fill="#d4af37" textAnchor="end" fontFamily="monospace">Hoje</text>
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
            
            <h3 className="text-lg font-display font-medium text-white">Sua vitrine pronta para faturar</h3>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Complete os passos abaixo de forma rápida para faturar ainda hoje enviando produtos digitais pelo WhatsApp.
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
              Produtos na vitrine: <span className="text-white font-bold">{productsInStore.length} itens</span>
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
            {simulatedActivities.map((act) => {
              const IconComp = act.icon;
              return (
                <div key={act.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.015] transition-all duration-200 border border-transparent hover:border-white/5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${act.id === 5 ? 'text-amber-400 bg-amber-500/10' : act.color}`}>
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

      <div className="pt-4 opacity-20 hover:opacity-100 transition-opacity duration-300">
        <div className="max-w-xl ml-auto p-4 rounded-2xl border border-white/5 bg-white/[0.015] text-left">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono font-bold">Atualizar vendas da loja</p>
              <p className="text-[11px] text-slate-500">Use só quando quiser refletir vendas fechadas manualmente no dashboard.</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {manualSalesCount} vendas • R$ {manualSalesTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
