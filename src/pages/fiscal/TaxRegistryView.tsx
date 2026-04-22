import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Filter, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  DollarSign,
  Building2,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface TaxRegistryViewProps {
  companyId: string;
  apiFetch: (url: string, options?: any) => Promise<any>;
}

export default function TaxRegistryView({ companyId, apiFetch }: TaxRegistryViewProps) {
  const [activeTab, setActiveTab] = useState<'606' | '607'>('606');
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [period, setPeriod] = useState(new Date().toISOString().substring(0, 7).replace('-', ''));

  // Form State
  const [formData, setFormData] = useState({
    rnc: '',
    ncf: '',
    amount: '',
    itbis: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Gastos de Personal' // For 606
  });

  useEffect(() => {
    fetchRecords();
  }, [companyId, activeTab]);

  const fetchRecords = async () => {
    setIsLoading(true);
    try {
      const endpoint = activeTab === '606' ? `/api/fiscal/purchases?companyId=${companyId}` : `/api/fiscal/invoices?companyId=${companyId}`;
      const res = await apiFetch(endpoint);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = activeTab === '606' ? '/api/fiscal/purchases' : '/api/fiscal/invoices';
      const body = activeTab === '606' ? {
        companyId,
        supplierRnc: formData.rnc,
        ncf: formData.ncf,
        amount: parseFloat(formData.amount),
        itbis: parseFloat(formData.itbis),
        issueDate: formData.date,
        purchaseType: formData.type
      } : {
        companyId,
        customerRnc: formData.rnc,
        ncf: formData.ncf,
        amount: parseFloat(formData.amount),
        itbis: parseFloat(formData.itbis),
        issueDate: formData.date
      };

      const res = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setFormData({ rnc: '', ncf: '', amount: '', itbis: '', date: new Date().toISOString().split('T')[0], type: 'Gastos de Personal' });
        fetchRecords();
      }
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const handleExport = async () => {
    try {
      const res = await apiFetch(`/api/dgii/export/${activeTab}?companyId=${companyId}&period=${period}`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeTab}_${period}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const filteredRecords = records.filter(r => 
    (r.ncf?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.supplierRnc?.includes(searchTerm)) ||
    (r.customerRnc?.includes(searchTerm))
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header Interactivo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
               <FileText className="text-indigo-400" size={24} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Libros Fiscales <span className="text-indigo-500">DGII</span></h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Gestión integral de formatos 606 y 607 para cumplimiento tributario.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveTab('606')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === '606' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
            >
              Compras (606)
            </button>
            <button 
              onClick={() => setActiveTab('607')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === '607' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
            >
              Ventas (607)
            </button>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus size={18} />
            Nuevo Registro
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatCard 
            label={`Total ${activeTab === '606' ? 'Compras' : 'Ventas'}`} 
            value={records.length} 
            subValue={`Periodo: ${period}`} 
            icon={activeTab === '606' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
            color="indigo"
         />
         <StatCard 
            label="Monto Gravado" 
            value={`$${records.reduce((acc, r) => acc + (r.amount || 0), 0).toLocaleString()}`} 
            subValue="Base Imponible Acumulada" 
            icon={<DollarSign size={20} />}
            color="emerald"
         />
         <StatCard 
            label="ITBIS Estimado" 
            value={`$${records.reduce((acc, r) => acc + (r.itbis || 0), 0).toLocaleString()}`} 
            subValue="Sujeto a validación DGII" 
            icon={<AlertCircle size={20} />}
            color="amber"
         />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-xl">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por NCF o RNC..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
               <Calendar size={16} className="text-slate-500" />
               <input 
                 type="text" 
                 value={period}
                 onChange={(e) => setPeriod(e.target.value)}
                 className="bg-transparent border-none outline-none text-xs font-bold text-white w-20"
                 placeholder="YYYYMM"
               />
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
            >
              <Download size={18} />
              Exportar TXT
            </button>
         </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#030816]/60 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fecha</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">NCF</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{activeTab === '606' ? 'Proveedor (RNC)' : 'Cliente (RNC)'}</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Monto</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">ITBIS</th>
                     <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Estado</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                           <span className="text-xs font-black uppercase tracking-widest text-slate-500">Sincronizando registros...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                         <div className="flex flex-col items-center gap-4 text-slate-600">
                            <FileText size={48} strokeWidth={1} />
                            <p className="text-sm font-medium">No se encontraron registros para este periodo.</p>
                         </div>
                      </td>
                    </tr>
                  ) : filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-white/5 transition-colors group">
                       <td className="px-8 py-5">
                          <span className="text-xs font-bold text-slate-300">
                             {new Date(record.issueDate).toLocaleDateString('es-DO')}
                          </span>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <span className="text-xs font-black text-white tracking-widest">{record.ncf}</span>
                             {record.status === 'Signed' && <CheckCircle2 size={12} className="text-emerald-500" />}
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-white">{record.supplierRnc || record.customerRnc}</span>
                             <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">Entidad Validada</span>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <span className="text-xs font-black text-white">${record.amount.toLocaleString()}</span>
                       </td>
                       <td className="px-8 py-5">
                          <span className="text-xs font-bold text-slate-400">${record.itbis.toLocaleString()}</span>
                       </td>
                       <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            record.status === 'Signed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {record.status || 'Reportado'}
                          </span>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f172a] border border-white/10 rounded-[2rem] p-8 w-full max-w-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 to-violet-600" />
              
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-white uppercase tracking-tight">Nuevo Registro <span className="text-indigo-500">{activeTab}</span></h2>
                 <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-slate-400"><Trash2 size={20} /></button>
              </div>

              <form onSubmit={handleAddRecord} className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">RNC Entidad</label>
                    <input 
                      required
                      type="text" 
                      value={formData.rnc}
                      onChange={(e) => setFormData({...formData, rnc: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Número de Comprobante (NCF)</label>
                    <input 
                      required
                      type="text" 
                      value={formData.ncf}
                      onChange={(e) => setFormData({...formData, ncf: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Monto Gravado</label>
                    <input 
                      required
                      type="number" 
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">ITBIS (18%)</label>
                    <input 
                      required
                      type="number" 
                      value={formData.itbis}
                      onChange={(e) => setFormData({...formData, itbis: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Fecha de Emisión</label>
                    <input 
                      required
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                 </div>
                 {activeTab === '606' && (
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tipo de Gasto</label>
                        <select 
                          value={formData.type}
                          onChange={(e) => setFormData({...formData, type: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                        >
                            <option value="Gastos de Personal">Gastos de Personal</option>
                            <option value="Gastos por Trabajos, Suministros y Servicios">Sum. y Servicios</option>
                            <option value="Arrendamientos">Arrendamientos</option>
                            <option value="Gastos de Activos Fijos">Activos Fijos</option>
                        </select>
                    </div>
                 )}

                 <div className="col-span-2 pt-4">
                    <button 
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-600/20 transition-all"
                    >
                      Guardar en Registro Fiscal
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ label, value, subValue, icon, color }: any) {
  const colors: any = {
    indigo: "from-indigo-600/20 to-violet-600/20 border-indigo-500/20 text-indigo-400",
    emerald: "from-emerald-600/20 to-teal-600/20 border-emerald-500/20 text-emerald-400",
    amber: "from-amber-600/20 to-orange-600/20 border-amber-500/20 text-amber-400"
  };

  return (
    <div className={`p-6 bg-gradient-to-br ${colors[color]} border rounded-3xl backdrop-blur-md`}>
       <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
          <ChevronRight size={16} className="text-slate-600" />
       </div>
       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
       <h3 className="text-2xl font-black text-white">{value}</h3>
       <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-widest">{subValue}</p>
    </div>
  );
}
