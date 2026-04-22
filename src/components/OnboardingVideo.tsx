import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Gem } from 'lucide-react';

export default function OnboardingVideo() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenVideo = localStorage.getItem('aetherium_onboarding_seen');
    if (!hasSeenVideo) {
      // Pequeño delay para que la interfaz cargue primero
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('aetherium_onboarding_seen', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#020617]/90 backdrop-blur-2xl" 
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-5xl bg-[#030816] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/20"
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* Sidebar del Video */}
              <div className="w-full md:w-80 bg-indigo-600/5 p-8 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-600/30">
                    <Gem size={24} />
                  </div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">Bienvenido a Aetherium</h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                    Hemos preparado este breve video para que domines el **Sistema Operativo Neural** en menos de 2 minutos.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                      <ShieldCheck size={14} /> Enlace de Seguridad Activo
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleClose}
                  className="mt-8 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all"
                >
                  Omitir e ir al Panel
                </button>
              </div>

              {/* Contenedor del Video (YouTube) */}
              <div className="flex-1 bg-black relative aspect-video overflow-hidden group">
                <iframe 
                  className="w-full h-full border-0"
                  src="https://www.youtube.com/embed/-QsiyaqdHH0?autoplay=1&modestbranding=1&rel=0"
                  title="Aetherium Onboarding"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
                
                <button 
                  onClick={handleClose}
                  className="absolute top-6 right-6 p-3 bg-black/50 hover:bg-red-600/80 backdrop-blur-md rounded-full text-white transition-all z-10 shadow-xl"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
