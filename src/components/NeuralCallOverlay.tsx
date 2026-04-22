import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneOff, MicOff, Mic, Bot, Shield, Zap, Cpu, Loader2, Volume2 } from 'lucide-react';

interface Props {
  isActive: boolean;
  onEnd: () => void;
  audioLevel: number;
  isMicSilent: boolean;
  lastError: string;
  isSecureContext: boolean;
  onReset: () => void;
  status: 'listening' | 'processing' | 'speaking' | 'idle';
  transcript: string;
}

export default function NeuralCallOverlay({ isActive, onEnd, audioLevel, isMicSilent, lastError, isSecureContext, onReset, status, transcript }: Props) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[100px]" />

          {/* Header Info */}
          <div className="absolute top-12 flex flex-col items-center gap-2">
            <AnimatePresence mode="wait">
              <motion.div 
                key={status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className={`flex items-center gap-3 px-6 py-2 border rounded-full backdrop-blur-xl shadow-2xl transition-all duration-500 ${
                  status === 'listening' ? 'bg-indigo-600/20 border-indigo-500/30 text-indigo-400' :
                  status === 'processing' ? 'bg-purple-600/20 border-purple-500/30 text-purple-400' :
                  status === 'speaking' ? 'bg-red-600/20 border-red-500/30 text-red-400' :
                  'bg-emerald-600/20 border-emerald-500/30 text-emerald-400'
                }`}
              >
                {status === 'listening' && <Mic size={14} className="animate-pulse" />}
                {status === 'processing' && <Loader2 size={14} className="animate-spin" />}
                {status === 'speaking' && <Volume2 size={14} className="animate-bounce" />}
                {status === 'idle' && <Shield size={14} />}
                
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  {status === 'listening' ? 'Escuchando Voz...' :
                   status === 'processing' ? 'Procesando Estrategia...' :
                   status === 'speaking' ? 'Emitiendo Respuesta...' :
                   'Enlace Establecido'}
                </span>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-4 mt-2">
               <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${isSecureContext ? 'bg-white/5 text-slate-400' : 'bg-red-500 text-white'}`}>
                 {isSecureContext ? 'SSL SECURE' : 'SECURE CONTEXT ERROR'}
               </span>
               <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">ERR_ID: {lastError || '0x00'}</span>
            </div>
          </div>

          {/* Main Visualizer Core */}
          <div className="relative group">
            {/* Ambient Background Aura */}
            <motion.div 
               animate={{ 
                 scale: [1, 1.2, 1],
                 opacity: [0.3, 0.6, 0.3]
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute inset-[-100px] bg-red-600/10 rounded-full blur-[80px] pointer-events-none"
            />

            <motion.div 
              className="w-48 h-48 rounded-full flex items-center justify-center relative z-10"
              animate={{ 
                scale: 1 + (audioLevel / 200),
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="absolute inset-0 rounded-full bg-black shadow-[0_0_100px_rgba(255,255,255,0.05)] overflow-hidden">
                {/* Neural Fluid Layers */}
                <AnimatePresence>
                  {status !== 'idle' && (
                    <>
                      {/* Layer 1: Core Glow */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-purple-900/40 to-red-900/40 blur-xl"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      />
                      
                      {/* Layer 2: Pulse Ring */}
                      <motion.div 
                        className="absolute inset-4 rounded-full border border-white/5 bg-gradient-to-br from-red-600/10 to-transparent mix-blend-overlay"
                        animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />

                      {/* Layer 3: Dynamic Audio Waves (Orb Style) */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute rounded-full border-2 ${
                              status === 'speaking' ? 'border-red-500/30' : 
                              status === 'processing' ? 'border-purple-500/30' : 
                              'border-indigo-500/30'
                            }`}
                            animate={{
                              width: ['40%', '90%', '40%'],
                              height: ['40%', '90%', '40%'],
                              rotate: [0, 180, 360],
                              borderRadius: ["40%", "60%", "40%"],
                              opacity: [0.1, 0.4, 0.1],
                            }}
                            transition={{
                              duration: 3 + i,
                              repeat: Infinity,
                              delay: i * 0.5,
                              ease: "easeInOut"
                            }}
                            style={{ 
                              scale: 1 + (audioLevel / (100 * (i + 1))),
                              filter: `blur(${i * 2}px)`
                            }}
                          />
                        ))}
                      </div>

                      {/* Center Bot Logo */}
                      <div className="relative z-20 flex items-center justify-center">
                         <motion.div
                           animate={{ 
                             opacity: status === 'processing' ? [0.4, 1, 0.4] : 0.8,
                             y: status === 'speaking' ? [0, -5, 0] : 0
                           }}
                           transition={{ duration: 1, repeat: Infinity }}
                         >
                           <Bot size={60} className="text-white/40 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                         </motion.div>
                      </div>
                    </>
                  )}
                </AnimatePresence>
                
                {status === 'idle' && (
                  <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
                    <Shield size={60} className="text-slate-700" />
                  </div>
                )}
              </div>

              {/* Orbital External Rings */}
              <div className="absolute inset-[-10px] border border-white/5 rounded-full animate-spin-slow opacity-20" />
              <div className="absolute inset-[-30px] border border-red-500/10 rounded-full animate-pulse opacity-20" />
            </motion.div>

            {/* Silent Mic Alert */}
            <AnimatePresence>
              {isMicSilent && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-red-600 rounded-2xl shadow-xl shadow-red-900/40 z-20"
                >
                  <MicOff size={18} className="text-white animate-pulse" />
                  <div className="text-left">
                    <p className="text-white text-[10px] font-black uppercase tracking-widest leading-none">Micrófono Silente</p>
                    <p className="text-white/60 text-[9px] mt-1 font-medium">No se detecta señal de audio</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Transcript Preview */}
          <div className="absolute top-[65%] left-1/2 -translate-x-1/2 w-full max-w-md px-12 text-center">
            <AnimatePresence mode="wait">
              {transcript && (
                <motion.p 
                  key={transcript}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-medium text-slate-400 italic tracking-wide line-clamp-3"
                >
                  "{transcript}"
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Controls Footer */}
          <div className="absolute bottom-16 flex items-center gap-8">
            <button 
              onClick={onReset}
              className="w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-slate-400 transition-all active:scale-90"
              title="Reiniciar Enlace"
            >
              <Zap size={20} />
            </button>

            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onEnd}
              className="w-20 h-20 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-red-900/60 ring-4 ring-red-900/40 transition-all"
            >
              <PhoneOff size={32} />
            </motion.button>

            <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-slate-400">
               <Cpu size={20} className="animate-pulse" />
            </div>
          </div>

          {/* Background Text Overlay */}
          <div className="absolute bottom-8 text-[12px] font-black text-white/5 uppercase tracking-[1em] select-none pointer-events-none">
            Aetherium Sovereign OS • Neural Core Active
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
