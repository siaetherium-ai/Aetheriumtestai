import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Hash, 
  Plus, 
  ToggleRight, 
  AlertTriangle, 
  Layers, 
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface NCFManagementViewProps {
  companyId: string;
  apiFetch: (url: string, options?: any) => Promise<any>;
}

export default function NCFManagementView({ companyId, apiFetch }: NCFManagementViewProps) {
  const [sequences, setSequences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchSequences();
  }, [companyId]);

  const fetchSequences = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch(`/api/fiscal/ncf-sequences?companyId=${companyId}`);
      const data = await res.json();
      setSequences(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching NCF sequences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatus = (seq: any) => {
    const remains = seq.limit - seq.current;
    if (remains < 50) return { label: 'Crítico', color: 'text-rose-500 bg-rose-500/10' };
    if (remains < 200) return { label: 'Bajo', color: 'text-amber-500 bg-amber-500/10' };
    return { label: 'Óptimo', color: 'text-emerald-500 bg-emerald-500/10' };
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
               <Hash className="text-indigo-400" size={24} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Secuencias <span className="text-indigo-500">NCF</span></h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Administración de comprobantes fiscales y alertas de vencimiento SIRLA.</p>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus size={18} />
          Solicitar Nueva Serie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <NCFStatCard label="Series Activas" value={sequences.filter(s => s.isActive).length} color="indigo" />
         <NCFStatCard label="Consumo Promedio" value={sequences.length > 0 ? `${Math.round(sequences.reduce((acc, s) => acc + s.current, 0) / sequences.length)}/mes` : '0/mes'} color="emerald" />
         <NCFStatCard label="Vencimiento Cercano" value={sequences.length > 0 ? new Date(sequences[0].expiryDate).toLocaleDateString('es-DO', {month: 'short', year: 'numeric'}).toUpperCase() : '--'} color="amber" />
         <NCFStatCard label="Alertas" value={sequences.filter(s => (s.limit - s.current) < 50).length} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {isLoading ? (
           <div className="col-span-full p-20 text-center"><div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
         ) : sequences.length === 0 ? (
           <div className="col-span-full p-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[2rem]">
              <Layers size={48} className="mx-auto text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No hay secuencias NCF registradas</p>
           </div>
         ) : sequences.map((seq) => {
           const status = getStatus(seq);
           const progress = (seq.current / seq.limit) * 100;
           
           return (
             <motion.div 
               key={seq.id}
               whileHover={{ y: -5 }}
               className="bg-[#030816]/60 border border-white/5 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl relative overflow-hidden group"
             >
                <div className={`absolute top-8 right-8 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${status.color}`}>
                   {status.label}
                </div>

                <div className="flex items-center gap-4 mb-6">
                   <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                      <span className="text-xl font-black text-indigo-400">{seq.prefix}</span>
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight">{seq.type}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Serie de Comprobantes</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest">
                      <span className="text-slate-500">Progreso de Consumo</span>
                      <span className="text-white">{seq.current} / {seq.limit}</span>
                   </div>
                   <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={`h-full ${progress > 90 ? 'bg-rose-500' : 'bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]'}`}
                      />
                   </div>

                   <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                         <p className="text-[9px] font-black text-slate-600 uppercase mb-1">NCF Inicial</p>
                         <p className="text-sm font-black text-white tracking-widest">{seq.prefix}00000001</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                         <p className="text-[9px] font-black text-slate-600 uppercase mb-1">NCF Actual</p>
                         <p className="text-sm font-black text-indigo-400 tracking-widest">{seq.prefix}{seq.current.toString().padStart(8, '0')}</p>
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                      <div className="flex items-center gap-2">
                         <Calendar size={14} className="text-indigo-400" />
                         <span className="text-[10px] font-black text-slate-400 uppercase">Expira: {seq.expiryDate ? new Date(seq.expiryDate).toLocaleDateString('es-DO') : 'N/A'}</span>
                      </div>
                      <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Detalles Serie</button>
                   </div>
                </div>
             </motion.div>
           );
         })}
      </div>
    </div>
  );
}

function NCFStatCard({ label, value, color }: any) {
  const colors: any = {
    indigo: "from-indigo-600/10 to-indigo-600/5 text-indigo-400 border-indigo-500/20",
    emerald: "from-emerald-600/10 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
    amber: "from-amber-600/10 to-amber-600/5 text-amber-400 border-amber-500/20",
    rose: "from-rose-600/10 to-rose-600/5 text-rose-400 border-rose-500/20"
  };

  return (
    <div className={`p-6 bg-gradient-to-br ${colors[color]} border rounded-[2rem] backdrop-blur-3xl`}>
       <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-1">{label}</p>
       <h3 className="text-xl font-black text-white">{value}</h3>
    </div>
  );
}
