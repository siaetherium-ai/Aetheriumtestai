import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Activity, 
  MapPin, 
  Users,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';

const SLAM_IN = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 }
};

export default function Companies({ apiFetch, onSelect }: { apiFetch: any, onSelect: (id: string) => void }) {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [rncResults, setRncResults] = useState<any[]>([]);
  const [isSearchingRNC, setIsSearchingRNC] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({
    name: '',
    rnc: '',
    taxType: 'Normal',
    sector: ''
  });

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/companies');
      const data = await res.json();
      if (Array.isArray(data)) {
        setCompanies(data);
      } else {
        console.error("Respuesta inesperada de empresas:", data);
        setCompanies([]);
      }
    } catch (e) { 
      console.error(e); 
      setCompanies([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = Array.isArray(companies) ? companies.filter(c => 
    (c.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
    (c.rnc || '').includes(searchQuery)
  ) : [];

  return (
    <motion.div {...SLAM_IN} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Ecosistema Corporativo</h1>
          <p className="text-slate-400 mt-2">Gestión centralizada de grupos empresariales y entidades legales.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2"
        >
          <Plus size={18} /> Registrar Nueva Empresa
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/5 bg-slate-900/20 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, RNC o sector..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <button className="p-3 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors">
            <Filter size={18} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">
                <th className="px-8 py-5 font-black">Empresa / RNC</th>
                <th className="px-8 py-5 font-black">Salud Fiscal</th>
                <th className="px-8 py-5 font-black">Sector / Tipo</th>
                <th className="px-8 py-5 font-black">Impacto Económico</th>
                <th className="px-8 py-5 font-black">Estado</th>
                <th className="px-8 py-5 font-black text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr><td colSpan={6} className="p-20 text-center text-slate-500 uppercase font-bold text-xs tracking-widest animate-pulse">Sincronizando Core Aetherium...</td></tr>
              ) : filteredCompanies.length === 0 ? (
                <tr><td colSpan={6} className="p-20 text-center text-slate-500 uppercase font-bold text-xs tracking-widest italic opacity-30">No se encontraron entidades registradas</td></tr>
              ) : (
                filteredCompanies.map(comp => (
                  <tr 
                    key={comp.id} 
                    onClick={() => onSelect(comp.id)}
                    className="hover:bg-indigo-600/5 cursor-pointer transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-indigo-600 group-hover:text-white transition-all text-slate-500">
                          <Building2 size={24} />
                        </div>
                        <div>
                          <p className="font-black text-slate-200 group-hover:text-white transition-colors">{comp.name}</p>
                          <p className="text-xs font-mono text-indigo-500">{comp.rnc}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${comp.taxHealth > 80 ? 'bg-emerald-500' : comp.taxHealth > 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${comp.taxHealth}%` }} 
                          />
                        </div>
                        <span className="text-xs font-black">{comp.taxHealth}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-300">{comp.sector || 'General'}</span>
                        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">{comp.taxType}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col">
                          <span className="text-sm font-black text-white">RD$ {(comp.revenue || 0).toLocaleString()}</span>
                          <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                             <TrendingUp size={10} /> +5.4% YoY
                          </span>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${comp.status === 'ACTIVO' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {comp.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-500 group-hover:text-white">
                          <ChevronRight size={18} />
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg glass-card border-white/10 p-8 shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Nueva Entidad Legal</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
              </div>
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await apiFetch('/api/companies', { 
                    method: 'POST', 
                    body: JSON.stringify(newCompanyData) 
                  });
                  if (res.ok) {
                    setShowAddModal(false);
                    setNewCompanyData({ name: '', rnc: '', taxType: 'Normal', sector: '' });
                    fetchCompanies();
                  } else {
                    const err = await res.json();
                    alert(err.error || "Error al crear empresa");
                  }
                } catch (e) { console.error(e); }
              }} className="space-y-6">
                
                <div className="relative">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1.5 block">Buscar en Registro Central (RNC o Nombre)</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      autoFocus
                      className="w-full bg-slate-900 border border-white/5 rounded-xl p-3 pl-10 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="Escribe el nombre o RNC..."
                      onChange={async (e) => {
                        const val = e.target.value;
                        if (val.length >= 3) {
                          setIsSearchingRNC(true);
                          try {
                            const res = await apiFetch(`/api/rnc/search?query=${val}`);
                            const data = await res.json();
                            setRncResults(data);
                          } catch (err) { console.error(err); }
                          setIsSearchingRNC(false);
                        } else {
                          setRncResults([]);
                        }
                      }}
                    />
                    {isSearchingRNC && <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-indigo-500"><Activity size={14} /></div>}
                  </div>
                  
                  {/* Resultados de Búsqueda Reactivos */}
                  <AnimatePresence>
                    {rncResults.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 z-50 bg-[#0d1117] border border-white/10 rounded-xl mt-2 max-h-60 overflow-y-auto shadow-2xl"
                      >
                        {rncResults.map((item: any) => (
                          <button 
                            key={item.rnc}
                            type="button" 
                            className="w-full text-left p-4 hover:bg-indigo-600/20 border-b border-white/5 transition-colors group"
                            onClick={() => {
                              setNewCompanyData({
                                name: item.name,
                                rnc: item.rnc,
                                taxType: item.paymentRegime || 'Normal',
                                sector: item.activity || ''
                              });
                              setRncResults([]);
                            }}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-white group-hover:text-indigo-400 transition-colors">{item.name}</span>
                              <span className="font-mono text-xs text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded">{item.rnc}</span>
                            </div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-bold">{item.activity || 'Sin Actividad Clasificada'}</div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-white/5 my-4" />

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1.5 block">Nombre Comercial / Razón Social</label>
                  <input 
                    name="name" 
                    required 
                    value={newCompanyData.name}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, name: e.target.value })}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none" 
                    placeholder="Aetherium Tech SRL" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1.5 block">RNC</label>
                    <input 
                      name="rnc" 
                      required 
                      value={newCompanyData.rnc}
                      onChange={(e) => setNewCompanyData({ ...newCompanyData, rnc: e.target.value })}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none font-mono" 
                      placeholder="130123456" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1.5 block">Régimen</label>
                    <select 
                      name="taxType" 
                      value={newCompanyData.taxType}
                      onChange={(e) => setNewCompanyData({ ...newCompanyData, taxType: e.target.value })}
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                       <option value="Normal">Normal</option>
                       <option value="RST">RST</option>
                       <option value="Exento">Exento</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1.5 block">Sector / Actividad</label>
                  <input 
                    name="sector" 
                    value={newCompanyData.sector}
                    onChange={(e) => setNewCompanyData({ ...newCompanyData, sector: e.target.value })}
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none" 
                    placeholder="Servicios" 
                  />
                </div>

                <div className="pt-6">
                   <button type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/30">
                      Crear Nueva Entidad
                   </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
