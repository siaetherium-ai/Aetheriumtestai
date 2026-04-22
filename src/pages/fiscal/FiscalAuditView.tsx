import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  TrendingDown, 
  Zap, 
  ArrowRight,
  Filter,
  Download,
  Info
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const SLAM_IN = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

interface FiscalAuditViewProps {
  companyId: string;
}

export default function FiscalAuditView({ companyId }: FiscalAuditViewProps) {
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [healthScore, setHealthScore] = useState(100);

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/audit/silent/${companyId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setResults(data);
      
      // Calculate a dynamic health score based on results
      const totalDiscrepancies = data.reduce((acc: number, curr: any) => acc + curr.discrepancyAmt, 0);
      const score = Math.max(0, 100 - (data.length * 5) - (totalDiscrepancies > 50000 ? 20 : 0));
      setHealthScore(score);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) runAudit();
  }, [companyId]);

  return (
    <motion.div {...SLAM_IN} className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
            Auditoría de Integridad Cruzada
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <ShieldAlert size={16} className="text-indigo-400" />
            Motor de validación proactiva contra discrepancias en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/50 border border-white/5 px-6 py-3 rounded-2xl flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500">Global Health Score</span>
              <span className={cn(
                "text-2xl font-black",
                healthScore > 80 ? "text-emerald-400" : healthScore > 50 ? "text-amber-400" : "text-red-400"
              )}>
                {healthScore}/100
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
               <svg className="w-full h-full -rotate-90">
                 <circle
                   cx="24" cy="24" r="20"
                   fill="transparent"
                   stroke="currentColor"
                   strokeWidth="4"
                   className="text-indigo-500/20"
                 />
                 <circle
                   cx="24" cy="24" r="20"
                   fill="transparent"
                   stroke="currentColor"
                   strokeWidth="4"
                   strokeDasharray={126}
                   strokeDashoffset={126 - (126 * healthScore) / 100}
                   className={cn(
                     "transition-all duration-1000",
                     healthScore > 80 ? "text-emerald-400" : healthScore > 50 ? "text-amber-400" : "text-red-400"
                   )}
                 />
               </svg>
            </div>
          </div>
          <button 
            onClick={runAudit}
            disabled={isLoading}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-2xl font-bold transition-all shadow-2xl shadow-indigo-600/30 flex items-center gap-2 group"
          >
            <Zap size={18} className={isLoading ? "animate-spin" : "group-hover:scale-125 transition-transform"} />
            {isLoading ? "Escaneando Ecosistema..." : "Ejecutar Auditoría"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Alerts & Findings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card overflow-hidden border-indigo-500/10">
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Search size={18} className="text-indigo-400" />
                <h3 className="font-bold text-sm uppercase tracking-widest">Hallazgos de Integridad</h3>
              </div>
              <div className="flex gap-2">
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-bold">
                  {results.filter(r => r.severity === 'Critical' || r.severity === 'High').length} Prioridad Alta
                </span>
              </div>
            </div>
            
            <div className="divide-y divide-white/5">
              {results.length === 0 ? (
                <div className="p-20 text-center opacity-30">
                  <CheckCircle2 size={48} className="mx-auto mb-4 text-emerald-400" />
                  <p className="text-lg font-bold">No se detectaron discrepancias</p>
                  <p className="text-sm">Tu integridad fiscal está alineada con el ecosistema Aetherium.</p>
                </div>
              ) : (
                results.map((finding, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 hover:bg-white/5 transition-colors flex gap-6"
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border",
                      finding.severity === 'Critical' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                      finding.severity === 'Medium' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                      "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    )}>
                      {finding.severity === 'Critical' ? <AlertTriangle size={24} /> : <Info size={24} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">{finding.type}</span>
                        <span className="text-xs font-mono text-slate-400">{new Date().toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-slate-200 mb-1">{finding.description}</h4>
                      {finding.discrepancyAmt > 0 && (
                        <p className="text-red-400 text-xs font-bold font-mono">Diferencia proyectada: RD$ {finding.discrepancyAmt.toLocaleString()}</p>
                      )}
                      <div className="mt-4 flex items-center gap-3">
                        <button className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1">
                          Resolver sugerencia <ArrowRight size={12} />
                        </button>
                        <button className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"> Ignorar por este mes </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Stats */}
        <div className="space-y-6">
          <div className="glass-card p-6 border-indigo-500/10">
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2">
              <TrendingDown size={14} className="text-red-400" />
              Impacto de Riesgo Acumulado
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Facturas', val: results.length },
                  { name: 'ITBIS', val: results.reduce((acc, r) => acc + (r.type === 'ITBIS' ? 1 : 0), 0) },
                  { name: 'RNC', val: results.reduce((acc, r) => acc + (r.type === 'RNC-Invalid' ? 1 : 0), 0) },
                ]}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                    <Cell fill="#6366f1" />
                    <Cell fill="#f43f5e" />
                    <Cell fill="#f59e0b" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border-indigo-500/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Zap size={80} className="text-indigo-500" />
             </div>
             <div className="relative z-10">
               <h3 className="font-bold text-sm text-indigo-300 mb-2">Recomendación Sugerida de IA</h3>
               <p className="text-xs text-slate-400 leading-relaxed italic">
                 "Hemos detectado que el RNC del proveedor X no está actualizado en tu base de datos local. Esto podría invalidar el crédito fiscal de ITBIS en tu próximo formulario 606."
               </p>
               <button className="mt-4 w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                 Corregir Automáticamente con AI
               </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
