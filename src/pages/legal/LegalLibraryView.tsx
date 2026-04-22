import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, 
  Search, 
  BookOpen, 
  Globe, 
  FileText, 
  ExternalLink, 
  Calendar,
  Gavel,
  CheckCircle2,
  AlertCircle,
  Hash
} from 'lucide-react';

const SLAM_IN = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4 }
};

export default function LegalLibraryView() {
  const [norms, setNorms] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNorm, setSelectedNorm] = useState<any>(null);
  const [filterType, setFilterType] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const fetchNorms = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/legal/norms?query=${searchQuery}&type=${filterType === 'All' ? '' : filterType}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setNorms(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNorms();
  }, [filterType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNorms();
  };

  const types = ['All', 'Ley', 'Norma General', 'Aviso', 'Decreto'];

  return (
    <motion.div {...SLAM_IN} className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Biblioteca Legal Aetherium</h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <Scale size={16} className="text-amber-500" />
            Acceso instantáneo al marco legal de la República Dominicana para soporte de IA.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
          {types.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                filterType === t ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20" : "text-slate-500 hover:text-white"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
        {/* Left: Norm List */}
        <div className="lg:col-span-1 flex flex-col gap-4 min-h-0">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por número o nombre..."
              className="w-full bg-slate-900/80 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all"
            />
          </form>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {isLoading ? (
               <div className="p-10 text-center text-slate-500 text-xs animate-pulse font-bold tracking-widest uppercase">Consultando LEX-DB...</div>
            ) : norms.length === 0 ? (
               <div className="p-10 text-center text-slate-600 text-xs italic">No se encontraron registros.</div>
            ) : (
                norms.map(norm => (
                  <button
                    key={norm.id}
                    onClick={() => setSelectedNorm(norm)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl transition-all border group",
                      selectedNorm?.id === norm.id 
                        ? "bg-amber-500/10 border-amber-500/30 shadow-xl" 
                        : "bg-slate-900/40 border-white/5 hover:bg-slate-800/60"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                       <span className={cn(
                         "text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full",
                         norm.type === 'Ley' ? "bg-red-500/20 text-red-400" :
                         norm.type === 'Norma General' ? "bg-amber-500/20 text-amber-400" :
                         "bg-blue-500/20 text-blue-400"
                       )}>
                         {norm.type}
                       </span>
                       <span className="text-[10px] text-slate-600 font-mono">#{norm.lawNumber || 'N/A'}</span>
                    </div>
                    <p className={cn("text-xs font-bold transition-colors mb-1", selectedNorm?.id === norm.id ? "text-amber-400" : "text-slate-300 group-hover:text-white")}>
                      {norm.title}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-widest">
                       <Calendar size={10} />
                       {norm.issueDate ? new Date(norm.issueDate).toLocaleDateString() : 'Pendiente'}
                    </div>
                  </button>
                ))
            )}
          </div>
        </div>

        {/* Right: Norm Reader */}
        <div className="lg:col-span-3 min-h-0 flex flex-col">
          <AnimatePresence mode="wait">
            {!selectedNorm ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex-1 glass-card border-white/5 flex flex-col items-center justify-center text-center p-12 opacity-30"
              >
                <BookOpen size={64} className="mb-4 text-slate-600" />
                <h3 className="text-xl font-bold">Selecciona un documento legal</h3>
                <p className="text-sm max-w-sm mt-2">Explora la base de conocimiento legal dominicana integrada para validaciones de IA.</p>
              </motion.div>
            ) : (
              <motion.div 
                key={selectedNorm.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 glass-card border-amber-500/10 flex flex-col overflow-hidden"
              >
                <div className="p-8 border-b border-white/5 bg-gradient-to-r from-amber-600/5 to-transparent">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-600/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                         <Gavel size={24} />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{selectedNorm.type} {selectedNorm.lawNumber ? `No. ${selectedNorm.lawNumber}` : ''}</span>
                        <h2 className="text-2xl font-bold text-white leading-tight">{selectedNorm.title}</h2>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-slate-400 group">
                          <ExternalLink size={18} className="group-hover:text-white" />
                       </button>
                       <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-slate-400 group">
                          <FileText size={18} className="group-hover:text-white" />
                       </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2">
                       <CheckCircle2 size={14} className="text-emerald-500" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Vigente en RD</span>
                     </div>
                     <div className="flex items-center gap-2">
                       <AlertCircle size={14} className="text-blue-500" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cifrado con Hash: <span className="font-mono">{selectedNorm.id.substring(0,8)}</span></span>
                     </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-slate-950/20">
                  <div className="max-w-4xl mx-auto">
                    <div className="prose prose-invert prose-amber max-w-none">
                      <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/5">
                         <Hash size={32} className="text-slate-700 opacity-20" />
                         <span className="text-slate-500 text-xs italic tracking-wide">Documento legal íntegro para procesamiento de IA Generativa v1.5</span>
                      </div>
                      <div className="whitespace-pre-wrap text-slate-300 leading-relaxed text-sm font-medium">
                        {selectedNorm.content}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
