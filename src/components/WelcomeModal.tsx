import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gem, Zap, Shield, Rocket, ChevronRight, X } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

const slides = [
  {
    icon: <Rocket className="text-indigo-400" size={40} />,
    title: "Bienvenido al Futuro",
    description: "Has iniciado tu acceso de prueba a Aetherium Sovereign OS. Prepárate para experimentar la gestión empresarial impulsada por IA.",
    accent: "bg-indigo-500/20"
  },
  {
    icon: <Zap className="text-amber-400" size={40} />,
    title: "Módulos Neurales",
    description: "Explora Auditoría Fiscal, Biblioteca Legal y el Command Center. Todo está interconectado para tu eficiencia.",
    accent: "bg-amber-500/20"
  },
  {
    icon: <Shield className="text-emerald-400" size={40} />,
    title: "Soporte VIP Activo",
    description: "Durante estas 5 horas, tienes acceso directo a nuestro equipo vía WhatsApp. Estamos aquí para resolver tus dudas.",
    accent: "bg-emerald-500/20"
  }
];

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-[#020617]/90 backdrop-blur-xl"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-[#030816] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/20"
      >
        <div className="h-1.5 w-full bg-white/5 flex">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-full transition-all duration-500 ${i <= currentSlide ? "bg-indigo-500" : "bg-transparent"}`} 
              style={{ width: `${100 / slides.length}%` }}
            />
          ))}
        </div>

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-10 text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center ${slides[currentSlide].accent}`}>
                {slides[currentSlide].icon}
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {slides[currentSlide].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10">
            <button
              onClick={handleNext}
              className="w-full group flex items-center justify-center gap-3 p-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              <span>{currentSlide === slides.length - 1 ? "Comenzar Exploración" : "Siguiente"}</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            <Gem size={12} className="text-indigo-500" />
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Aetherium Sovereign OS • Modo Trial</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
