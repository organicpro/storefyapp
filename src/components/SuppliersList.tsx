import React, { useState } from 'react';
import { 
  Users, 
  Star, 
  CheckCircle, 
  Flame, 
  Compass, 
  MapPin, 
  MessageSquare, 
  ChevronRight, 
  Activity,
  ShieldCheck,
  Search
} from 'lucide-react';
import { Supplier } from '../types';

interface SuppliersListProps {
  suppliers: Supplier[];
}

export default function SuppliersList({ suppliers }: SuppliersListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => prev === message ? null : prev);
    }, 3500);
  };

  const filteredSuppliers = suppliers.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-medium text-white tracking-tight">Fornecedores Dropshipping</h1>
        <p className="text-slate-400 text-sm mt-1">
          Nossa rede exclusiva de distribuidores de chaves digitais homologados com suporte integrado e entrega automatizada.
        </p>
      </div>

      {/* Top benefits bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 glass-premium rounded-2xl flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Homologação Garantida</p>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Todos os fornecedores passam por auditorias rigorosas de segurança dos PINs.</p>
          </div>
        </div>

        <div className="p-4 glass-premium rounded-2xl flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">APIs de Alta Performance</p>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Latência de resgate inferior a 2 segundos com relatórios em tempo real.</p>
          </div>
        </div>

        <div className="p-4 glass-premium rounded-2xl flex items-start gap-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Preços de Custo Únicos</p>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">Parcerias exclusivas que garantem desconto de atacado mesmo comprando por unidade.</p>
          </div>
        </div>
      </div>

      {/* Filter and listing tools */}
      <div className="p-5 rounded-2xl glass-premium flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Pesquisar fornecedor..."
            className="w-full pl-9 pr-4 py-2 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 glass-premium-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute left-3 inset-y-0 flex items-center text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </span>
        </div>
        <span className="text-xs text-slate-400 font-mono font-medium">{filteredSuppliers.length} integradoras carregadas</span>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSuppliers.map((s) => (
          <div 
            key={s.id} 
            className="p-5 rounded-2xl glass-premium hover:border-brand-500/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            {s.featured && (
              <span className="absolute top-0 right-0 px-3 py-1 bg-brand-500 text-black rounded-bl-xl text-[9px] font-bold uppercase font-mono tracking-wider">
                Verificado Oficial ⭐
              </span>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/[0.05] text-slate-300 border border-white/10 flex items-center justify-center font-display font-black text-xl shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5 leading-snug group-hover:text-brand-500 transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0 text-slate-500" />
                    Distribuição Nacional/Global
                  </p>
                </div>
              </div>

              {/* Key supplier statistics */}
              <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-white/[0.02] text-xs text-slate-300 border border-white/5 font-mono">
                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Avaliação</p>
                  <p className="text-xs font-extrabold text-amber-400 mt-1.5 flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {s.rating}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Taxa Entrega</p>
                  <p className="text-xs font-extrabold text-emerald-400 mt-1.5 flex items-center gap-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {s.deliveryRate}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Catálogo Ativo</p>
                  <p className="text-xs font-extrabold text-slate-200 mt-1.5">
                    {s.productsCount} itens
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed pt-1.5">
                Especialista na categoria <strong className="text-brand-500">{s.category}</strong>. Integração de tokens automatizada via webhook seguro Storefy em tempo de execução.
              </div>
            </div>

            <div className="mt-5 border-t border-white/5 pt-4 flex gap-2.5">
              <button 
                className="flex-1 py-1.5 px-3 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/10 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                onClick={() => showToast(`Iniciando chat com analista de aprovação de ${s.name} para descontos em lote.`)}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Conversar</span>
              </button>
              
              <button 
                className="flex-1 py-1.5 px-3 bg-white hover:bg-slate-200 text-black rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                onClick={() => showToast(`Chave API de ${s.name} ativa em Modo Sandbox pelo backend Storefy!`)}
              >
                <span>Acessar Integração</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-[#0a0a0f] border border-brand-500/20 shadow-2xl flex items-center gap-3 animate-fade-in max-w-xs md:max-w-sm">
          <div className="w-8 h-8 rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20 flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 animate-pulse text-brand-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-normal font-sans">{toastMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
