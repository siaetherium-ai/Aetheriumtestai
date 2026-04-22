import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, FileText, ShieldCheck, Zap, Upload, Globe, Database, Cpu } from 'lucide-react';

const SLAM_IN = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.4 }
};

export default function KnowledgeBase({ apiFetch, companyId }: { apiFetch: any, companyId: string | null }) {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
     apiFetch('/api/training/logs')
      .then((res: any) => res.json())
      .then((logs: any[]) => setSources(logs));
  }, []);

  const handleQuery = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/knowledge/query', {
        method: 'POST',
        body: JSON.stringify({ query, companyId })
      });
      const data = await res.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('typeLabel', 'Empresa Data');
      
      try {
        const res = await apiFetch('/api/training/upload', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
           alert("Información indexada. La Red Neuronal se ha actualizado.");
           // Refetch logs
           apiFetch('/api/training/logs').then((r: any) => r.json()).then(setSources);
        }
      } catch (err) { console.error(err); }
      setIsUploading(false);
    };
    fileInput.click();
  };

  return (
    <motion.div {...SLAM_IN} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-3">
             <Database className="text-indigo-500" size={32} />
             Cerebro Corporativo
          </h1>
          <p className="text-slate-400 mt-2">Base de conocimientos privada alimentada por documentos y leyes reales.</p>
        </div>
        <button 
          onClick={handleUpload}
          disabled={isUploading}
          className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
        >
          <Upload size={16} /> {isUploading ? 'Procesando...' : 'Indexar Documento'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card p-6">
              <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                 <Cpu size={14} className="text-indigo-400" /> Neural Assets
              </h3>
              <div className="space-y-3">
                 {sources.length === 0 ? (
                    <p className="text-[10px] text-slate-600 italic">No hay fuentes cargadas.</p>
                 ) : (
                    sources.map(s => (
                       <SourceItem key={s.id} icon={<FileText size={14} />} name={s.content.substring(0, 20) + '...'} status="Sync" />
                    ))
                 )}
                 <SourceItem icon={<Globe size={14} />} name="DGII Core 2024" status="Master" />
                 <SourceItem icon={<Globe size={14} />} name="TSS API Hook" status="Live" />
              </div>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
           <div className="glass-card p-8 border-indigo-500/20 bg-indigo-500/5">
              <div className="relative mb-8">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                 <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                    placeholder="Realiza una consulta profunda a tu cerebro corporativo..." 
                    className="w-full bg-slate-900/60 border border-white/10 rounded-3xl py-6 pl-16 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium text-white"
                 />
                 <button 
                    onClick={handleQuery}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl shadow-indigo-600/30"
                 >
                    {isLoading ? 'Analizando...' : 'Consultar'}
                 </button>
              </div>

              {answer && (
                 <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-3xl bg-slate-900 border border-white/5 shadow-2xl"
                 >
                    <div className="flex items-center gap-3 text-indigo-400 mb-6 pb-4 border-b border-white/5">
                       <ShieldCheck size={20} />
                       <span className="text-xs font-black uppercase tracking-[0.2em]">Respuesta Verificada por Aetherium AI</span>
                    </div>
                    <div className="text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-medium">
                       {answer}
                    </div>
                    <div className="mt-8 flex gap-4">
                       <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Copiar Cita Legal</button>
                       <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Exportar Informe</button>
                    </div>
                 </motion.div>
              )}
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function SourceItem({ icon, name, status }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
      <div className="flex items-center gap-2">
        <span className="text-slate-500 group-hover:text-indigo-400 transition-colors">{icon}</span>
        <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-all overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px]">{name}</span>
      </div>
      <span className="text-[8px] font-black uppercase tracking-tighter bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">{status}</span>
    </div>
  );
}
