import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Plus, 
  TrendingDown, 
  Shield, 
  Calendar, 
  DollarSign,
  Download,
  Search,
  ChevronRight,
  HardDrive
} from 'lucide-react';

interface FixedAssetsViewProps {
  companyId: string;
  apiFetch: (url: string, options?: any) => Promise<any>;
}

export default function FixedAssetsView({ companyId, apiFetch }: FixedAssetsViewProps) {
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAssets();
  }, [companyId]);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      // In a real scenario, we'd have a specific endpoint, 
      // but we can also infer assets from FiscalPurchases of type 'Activos Fijos'
      const res = await apiFetch(`/api/fiscal/purchases?companyId=${companyId}`);
      const data = await res.json();
      // Filter for assets if the backend supports categories, otherwise show placeholders for "What was there"
      const filtered = Array.isArray(data) ? data.filter((p: any) => p.purchaseType?.includes('Activos')) : [];
      setAssets(filtered);
    } catch (error) {
      console.error("Error fetching assets:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDepreciation = (amount: number, date: string) => {
    const buyDate = new Date(date);
    const now = new Date();
    const months = (now.getFullYear() - buyDate.getFullYear()) * 12 + now.getMonth() - buyDate.getMonth();
    const rate = 0.25 / 12; // 25% anual (Cat 2)
    const accumulated = Math.min(amount, amount * rate * Math.max(0, months));
    return {
      accumulated,
      current: amount - accumulated,
      percentage: (accumulated / amount) * 100
    };
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
               <Briefcase className="text-indigo-400" size={24} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Activos <span className="text-indigo-500">Fijos</span></h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Control de depreciación acumulada y categorías DGII de activos corporativos.</p>
        </div>

        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 transition-all">
          <Plus size={18} />
          Registrar Activo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <AssetStatCard label="Valor en Libros" value={`$${assets.reduce((acc, a) => acc + a.amount, 0).toLocaleString()}`} subValue="Costo de Adquisición Total" icon={<DollarSign size={20} />} color="indigo" />
         <AssetStatCard label="Depreciación del Mes" value={`$${(assets.reduce((acc, a) => acc + a.amount, 0) * (0.25/12)).toLocaleString()}`} subValue="Calculado según Ley 11-92" icon={<TrendingDown size={20} />} color="rose" />
         <AssetStatCard label="Protección Fiscal" value={`$${(assets.reduce((acc, a) => acc + a.amount, 0) * 0.27 * (0.25/12)).toLocaleString()}`} subValue="Escudo fiscal estimado" icon={<Shield size={20} />} color="emerald" />
      </div>

      <div className="bg-[#030816]/60 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
         <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <div className="relative w-64">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                 type="text" 
                 placeholder="Buscar activo..." 
                 className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:ring-1 focus:ring-indigo-500"
               />
            </div>
            <div className="flex gap-2">
               <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500"><Download size={18} /></button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white/5">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Activo / Categoría</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fecha Adq.</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Valor Inicial</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Depreciación Acum.</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Valor Actual</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr><td colSpan={5} className="p-20 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                  ) : assets.length === 0 ? (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">No hay activos registrados en este periodo</td></tr>
                  ) : assets.map(asset => {
                    const dep = getDepreciation(asset.amount, asset.issueDate);
                    return (
                      <tr key={asset.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
                                 <HardDrive size={18} className="text-slate-400" />
                              </div>
                              <div className="flex flex-col">
                                 <span className="text-xs font-black text-white uppercase tracking-tight">{asset.supplierName || 'Equipos de Oficina'}</span>
                                 <span className="text-[10px] text-indigo-400 font-bold uppercase mt-0.5 tracking-tighter">Categoría II (25%)</span>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <div className="flex items-center gap-2 text-slate-400">
                              <Calendar size={12} />
                              <span className="text-xs font-bold">{new Date(asset.issueDate).toLocaleDateString('es-DO')}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-xs font-black text-white">${asset.amount.toLocaleString()}</span>
                        </td>
                        <td className="px-8 py-5 text-rose-400">
                           <div className="flex flex-col gap-1">
                              <span className="text-xs font-black">-${dep.accumulated.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                              <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-rose-500" style={{ width: `${dep.percentage}%` }} />
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-5">
                           <span className="text-xs font-black text-emerald-400">${dep.current.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </td>
                      </tr>
                    );
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}

function AssetStatCard({ label, value, subValue, icon, color }: any) {
  const colors: any = {
    indigo: "from-indigo-600/10 to-indigo-600/5 text-indigo-400 border-indigo-500/20",
    emerald: "from-emerald-600/10 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
    rose: "from-rose-600/10 to-rose-600/5 text-rose-400 border-rose-500/20"
  };

  return (
    <div className={`p-6 bg-gradient-to-br ${colors[color]} border rounded-[2rem] backdrop-blur-3xl`}>
       <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
          <ChevronRight size={14} className="text-slate-600" />
       </div>
       <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-1">{label}</p>
       <h3 className="text-xl font-black text-white">{value}</h3>
       <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">{subValue}</p>
    </div>
  );
}
