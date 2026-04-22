import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchCode, Plus, X } from 'lucide-react';

const SLAM_IN = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

export default function RNCSearch({ apiFetch }: { apiFetch: any }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const res = await apiFetch(`/api/rnc/search?query=${query}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAll = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/rnc/search?all=true');
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div {...SLAM_IN} className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Consulta Central de RNC</h1>
        <p className="text-slate-400">Valida datos fiscales de clientes y proveedores al instante.</p>
      </div>

      <div className="glass-card p-8">
        <div className="relative max-w-2xl mx-auto">
          <SearchCode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Introduce RNC o Razón Social..." 
            className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
          />
          <button 
            onClick={handleSearch}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-500 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Buscando...' : 'Consultar'}
          </button>
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <button onClick={handleViewAll} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors font-mono">
            Ver base de datos completa
          </button>
          <button onClick={() => setShowAddModal(true)} className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors flex items-center gap-1 font-mono">
            <Plus size={10} /> Agregar nuevo RNC
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-12 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 py-4 font-black">RNC</th>
                  <th className="px-6 py-4 font-black">Razón Social</th>
                  <th className="px-6 py-4 font-black">Estado</th>
                  <th className="px-6 py-4 font-black">Actividad</th>
                  <th className="px-6 py-4 font-black">Régimen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((item, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-indigo-400">{item.rnc}</td>
                    <td className="px-6 py-4 text-sm font-bold text-white">{item.name}</td>
                    <td className="px-6 py-4">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 uppercase tracking-widest">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-slate-400">{item.activity}</td>
                    <td className="px-6 py-4 text-[11px] text-slate-400">{item.paymentRegime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md glass-card border-white/10 p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-xl font-bold">Manual RNC Entry</h2>
                 <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/5 rounded-full"><X size={18} /></button>
              </div>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget as HTMLFormElement);
                const data = Object.fromEntries(form.entries());
                try {
                  const res = await apiFetch('/api/rnc', { method: 'POST', body: JSON.stringify({ ...data, activity: 'Manual Entry' }) });
                  if (res.ok) {
                    setShowAddModal(false);
                    handleSearch();
                  }
                } catch (e) { console.error(e); }
              }} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1 block">RNC</label>
                  <input name="rnc" required className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none font-mono" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1 block">Razón Social</label>
                  <input name="name" required className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none font-mono" />
                </div>
                <button type="submit" className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest mt-4">Guardar Registro</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
