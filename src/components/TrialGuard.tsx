import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Mail, MessageSquare, Gem, Clock, ExternalLink, Info, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WelcomeModal from './WelcomeModal';

export default function TrialGuard({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (authUser && !isOwner) {
      const welcomeKey = `welcome_shown_${authUser.id}`;
      const hasShown = localStorage.getItem(welcomeKey);
      if (!hasShown) {
        setShowWelcome(true);
        localStorage.setItem(welcomeKey, 'true');
      }
    }
  }, [authUser?.id, isOwner]);

  useEffect(() => {
    const checkTrial = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/trial/check`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        const data = await res.json();
        setIsBlocked(data.isBlocked);
        setTimeLeft(data.timeLeft);
        setIsOwner(data.isOwner || false);
      } catch (error) {
        console.error("Trial check failed", error);
        setIsBlocked(false);
      }
    };

    checkTrial();
    const interval = setInterval(checkTrial, 60000); // Sync with server every minute
    return () => clearInterval(interval);
  }, []);

  // Local live countdown (exact second-by-second)
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !isBlocked && !isOwner) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === null || prev <= 0) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft === null, isBlocked, isOwner]);

  const formatTime = (ms: number) => {
    const h = Math.floor(ms / (1000 * 60 * 60));
    const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((ms % (1000 * 60)) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  // If the user is the owner, they bypass everything and don't see the badge or support button
  if (isOwner) {
    return <>{children}</>;
  }

  const isUrgent = timeLeft !== null && timeLeft <= 30 * 60 * 1000; // Last 30 minutes

  // Floating Timer Badge and WhatsApp Support for Trial Users
  if (!isBlocked) {
    return (
      <>
        {children}
        
        <AnimatePresence>
          {showWelcome && <WelcomeModal onClose={() => setShowWelcome(false)} />}
        </AnimatePresence>

        {/* Floating Timer Badge */}
        {timeLeft !== null && timeLeft > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className={`fixed bottom-6 right-6 z-[100] px-4 py-2 backdrop-blur-xl border rounded-full flex items-center gap-3 shadow-2xl transition-colors duration-500 ${
              isUrgent 
                ? "bg-rose-500/20 border-rose-500/50 shadow-rose-500/20" 
                : "bg-[#030816]/80 border-indigo-500/30"
            }`}
          >
            <div className={`w-2 h-2 rounded-full animate-pulse ${isUrgent ? "bg-rose-500" : "bg-indigo-500"}`} />
            <div className="flex flex-col">
              <span className={`text-[9px] font-black uppercase tracking-widest tabular-nums ${isUrgent ? "text-rose-400" : "text-indigo-400"}`}>
                {isUrgent ? "¡Atención! Tiempo Limitado:" : "Sesión de Prueba:"} {formatTime(timeLeft)}
              </span>
              <span className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em]">Página en Desarrollo</span>
            </div>
          </motion.div>
        )}

        {/* WhatsApp VIP Support Button */}
        <motion.a
          href="https://wa.me/18097294283?text=Hola,%20estoy%20probando%20la%20versión%20de%20Aetherium%20Sovereign%20OS%20y%20necesito%20asistencia."
          target="_blank"
          rel="noopener noreferrer"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          className="fixed bottom-6 left-6 z-[100] group flex items-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white px-5 py-3 rounded-2xl shadow-xl shadow-emerald-500/20 transition-all active:scale-95"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
            <MessageCircle size={22} fill="currentColor" className="relative" />
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-80">Soporte VIP</span>
            <span className="text-xs font-bold">Hablar con Experto</span>
          </div>
        </motion.a>
      </>
    );
  }

  if (isBlocked) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
        {/* Animated Background Overlay */}
        <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-2xl" />
        
        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-lg bg-[#030816] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-500/20"
        >
          {/* Header Accent */}
          <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600" />
          
          <div className="p-10 text-center">
            {/* Icon Group */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-indigo-600 blur-3xl opacity-20 animate-pulse" />
              <div className="relative w-20 h-20 bg-indigo-600/10 border border-indigo-500/30 rounded-3xl flex items-center justify-center text-indigo-500 mx-auto">
                <Clock size={40} className="animate-spin-slow" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
              Periodo de Prueba <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Agotado</span>
            </h1>

            <p className="text-slate-400 font-medium leading-relaxed mb-6 text-sm">
              Tu acceso de prueba de 5 horas a <span className="text-indigo-400 font-bold">Aetherium Sovereign OS</span> ha concluido. 
              La plataforma se encuentra en fase activa de desarrollo. 
            </p>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl mb-8 flex items-start gap-3 text-left">
              <Info className="text-amber-500 shrink-0" size={18} />
              <p className="text-[11px] text-amber-200/70 font-medium leading-tight">
                <strong className="text-amber-400 block mb-1 uppercase tracking-widest">Restricción de Acceso</strong>
                Por seguridad, tu IP ha sido bloqueada temporalmente. Podrás volver a acceder automáticamente en 72 horas para una nueva sesión de prueba.
              </p>
            </div>

            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
              ¿Necesitas acceso ilimitado hoy?
            </p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <a 
                href="https://wa.me/18097294283?text=Hola,%20me%20interesa%20obtener%20la%20versión%20completa%20de%20Aetherium%20Sovereign%20OS."
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full p-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-xl shadow-indigo-600/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Despliegue Inmediato</p>
                    <p className="font-bold text-sm">Contactar vía WhatsApp</p>
                  </div>
                </div>
                <ExternalLink size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>

              <a 
                href="mailto:s.iaetherium@gmail.com?subject=Solicitud de Versión Completa - Aetherium Sovereign OS"
                className="group flex items-center justify-between w-full p-5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-600/10 text-indigo-400 rounded-xl flex items-center justify-center">
                    <Mail size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Soporte Corporativo</p>
                    <p className="font-bold text-sm">Enviar Correo Electrónico</p>
                  </div>
                </div>
                <ExternalLink size={18} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </a>
            </div>

            {/* Footer */}
            <div className="mt-10 pt-8 border-t border-white/5">
              <div className="flex items-center justify-center gap-2">
                <Gem size={12} className="text-indigo-500" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">Aetherium Neural Network © 2026</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}
