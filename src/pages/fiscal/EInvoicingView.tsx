import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck, 
  ShieldCheck, 
  Lock, 
  Fingerprint, 
  FileUp, 
  Stamp, 
  CheckCircle2, 
  Clock, 
  Search,
  Plus,
  Zap,
  Info,
  Calendar,
  Eye,
  Settings
} from 'lucide-react';

const SLAM_IN = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4 }
};

interface EInvoicingViewProps {
  companyId: string;
}

export default function EInvoicingView({ companyId }: EInvoicingViewProps) {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stamps, setStamps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSignModal, setShowSignModal] = useState<any>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [invRes, stampRes] = await Promise.all([
        fetch(`/api/fiscal/invoices?companyId=${companyId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch(`/api/settings`, { // Using settings for stamps simulation/query
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      const invData = await invRes.json();
      setInvoices(invData || []);
      
      // Fetching stamps specifically
      const stampResActual = await fetch(`/api/companies/${companyId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const compData = await stampResActual.json();
      setStamps(compData.electronicStamps || []);

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchData();
  }, [companyId]);

  const handleSign = async (invoiceId: string) => {
    try {
      const res = await fetch(`/api/fiscal/e-invoice/sign`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ invoiceId, companyId })
      });
      if (res.ok) {
        setShowSignModal(null);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div {...SLAM_IN} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-4">
            E-Facturación 
            <span className="text-[10px] bg-indigo-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest animate-pulse">DGII Certified Node</span>
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            Gestión de comprobantes fiscales electrónicos (e-CF) bajo Norma General 01-2020.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-white/10 hover:bg-slate-800 rounded-2xl font-bold text-xs transition-all text-slate-300">
             <Settings size={14} /> Gestionar Certificados
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-xs transition-all shadow-xl shadow-indigo-600/30">
             <FileUp size={14} /> Importar XML/JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Certificate Card */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card p-6 bg-gradient-to-br from-slate-900 to-indigo-950 border-indigo-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Fingerprint size={120} />
              </div>
              <h3 className="text-xs uppercase font-black tracking-[0.2em] text-indigo-400 mb-6 flex items-center gap-2">
                 <Stamp size={14} /> Certificado Digital
              </h3>
              
              {stamps.length === 0 ? (
                <div className="py-8 text-center">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-white/5">
                      <Lock size={20} className="text-slate-600" />
                   </div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">No hay firma activa</p>
                   <button className="w-full py-2.5 bg-white text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                      Subir Certificado
                   </button>
                </div>
              ) : (
                stamps.map(s => (
                  <div key={s.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                       <span className="text-lg font-black text-white">Valid SSL-V3</span>
                       <CheckCircle2 size={18} className="text-emerald-500" />
                    </div>
                    <div>
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Tipo de Firma</p>
                       <p className="text-xs font-bold text-slate-300">{s.certType}</p>
                    </div>
                    <div>
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Vence en</p>
                       <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                          <Clock size={12} className="text-indigo-400" />
                          {new Date(s.expiryDate).toLocaleDateString()}
                       </div>
                    </div>
                    <div className="pt-2">
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: '85%' }} />
                       </div>
                    </div>
                  </div>
                ))
              )}
           </div>

           <div className="glass-card p-6 border-white/5 bg-slate-900/30">
              <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                 <Zap size={12} className="text-amber-500" /> Estadísticas de Emisión
              </h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-end border-b border-white/5 pb-3">
                    <span className="text-xs text-slate-400 font-bold">Sin Enviar</span>
                    <span className="text-xl font-black text-red-400">{invoices.filter(i => i.status === 'Valid').length}</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-white/5 pb-3">
                    <span className="text-xs text-slate-400 font-bold">Certificadas</span>
                    <span className="text-xl font-black text-emerald-400">{invoices.filter(i => i.status === 'Signed').length}</span>
                 </div>
                 <div className="flex justify-between items-end">
                    <span className="text-xs text-slate-400 font-bold">Errores DGII</span>
                    <span className="text-xl font-black text-slate-600">0</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Invoice List */}
        <div className="lg:col-span-3 space-y-6">
           <div className="glass-card overflow-hidden">
              <div className="p-6 border-b border-white/5 bg-slate-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-xs">
                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-3.5 h-3.5" />
                       <input type="text" placeholder="Buscar por NCF o Cliente..." className="w-full bg-slate-950/50 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-1 focus:ring-indigo-500 outline-none" />
                    </div>
                    <select className="bg-slate-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-slate-400 outline-none focus:ring-1 focus:ring-indigo-500">
                       <option>Todos los Periodos</option>
                       <option>2024-04</option>
                    </select>
                 </div>
                 <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all group">
                    <Plus size={14} className="group-hover:rotate-90 transition-transform" /> Nueva Factura E-CF
                 </button>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-white/5">
                          <th className="px-6 py-4 font-black">Emisión</th>
                          <th className="px-6 py-4 font-black">Receptor</th>
                          <th className="px-6 py-4 font-black">E-NCF / Secuencia</th>
                          <th className="px-6 py-4 font-black">Monto Total</th>
                          <th className="px-6 py-4 font-black">Estado</th>
                          <th className="px-6 py-4 font-black text-right">Acciones</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {invoices.length === 0 ? (
                          <tr><td colSpan={6} className="p-20 text-center opacity-20 text-xs font-bold uppercase tracking-widest">No hay facturas registradas</td></tr>
                       ) : (
                          invoices.map((inv, i) => (
                             <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                      <Calendar size={12} className="text-slate-600" />
                                      {new Date(inv.issueDate).toLocaleDateString()}
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex flex-col">
                                      <span className="text-xs font-black text-white">{inv.customerName || 'Cliente Genérico'}</span>
                                      <span className="text-[10px] font-mono text-indigo-500">{inv.customerRnc}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                      <span className={cn(
                                         "text-[10px] font-black px-2 py-0.5 rounded border",
                                         inv.status === 'Signed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-500 border-white/10"
                                      )}>E-CF</span>
                                      <span className="text-xs font-mono font-bold text-slate-300">{inv.status === 'Signed' ? inv.ncfModified : inv.ncf}</span>
                                   </div>
                                </td>
                                <td className="px-6 py-4">
                                   <span className="text-sm font-black text-white">RD$ {inv.amount.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                   <span className={cn(
                                      "text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter transition-all",
                                      inv.status === 'Signed' ? "bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                   )}>
                                      {inv.status === 'Signed' ? 'Firmada & Enviada' : 'Pendiente Firma'}
                                   </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                   <button className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-500 hover:text-white inline-block">
                                      <Eye size={16} />
                                   </button>
                                   {inv.status !== 'Signed' ? (
                                      <button 
                                         onClick={() => setShowSignModal(inv)}
                                         className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all text-white shadow-lg shadow-indigo-600/30 inline-block group"
                                      >
                                         <FileCheck size={16} className="group-hover:scale-110 transition-transform" />
                                      </button>
                                   ) : (
                                      <button className="p-2 bg-emerald-600/10 text-emerald-400 rounded-xl cursor-default inline-block">
                                         <CheckCircle2 size={16} />
                                      </button>
                                   )}
                                </td>
                             </tr>
                          ))
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           <div className="glass-card p-6 border-amber-500/10 bg-amber-500/5 flex items-center gap-6">
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 shrink-0 border border-amber-500/20">
                 <Info size={24} />
              </div>
              <div className="flex-1">
                 <h4 className="font-black text-xs uppercase tracking-widest text-amber-500 mb-1">RECORDATORIO LEGAL</h4>
                 <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    "Las facturas emitidas bajo el régimen electrónico tienen la misma validez legal y tributaria que las facturas físicas pre-impresas o de impresora fiscal."
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Signing Modal */}
      <AnimatePresence>
         {showSignModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSignModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-sm glass-card p-8 border-indigo-500/20 text-center">
                  <div className="w-20 h-20 bg-indigo-600/10 rounded-full mx-auto flex items-center justify-center mb-6 border-2 border-indigo-500/30">
                     <Lock size={32} className="text-indigo-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-black mb-2">Firmar Comprobante</h3>
                  <p className="text-xs text-slate-400 mb-8 px-4">Estás a punto de aplicar el sello digital de 2048 bits a la factura <span className="text-indigo-400 font-mono font-bold">{showSignModal.ncf}</span>. Esta acción es irreversible y se grabará en la cadena de custodia fiscal.</p>
                  
                  <div className="flex gap-3">
                     <button onClick={() => setShowSignModal(null)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">Cancelar</button>
                     <button 
                        onClick={() => handleSign(showSignModal.id)}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/40 flex items-center justify-center gap-2"
                     >
                        <Zap size={14} /> Aplicar Firma
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </motion.div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
