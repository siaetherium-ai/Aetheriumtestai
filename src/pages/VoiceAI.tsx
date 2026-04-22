import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Phone, Mic, Settings, Zap, Volume2, MicOff, Send, MessageSquare, Plus, Loader2, Clock, Crown } from 'lucide-react';
import Markdown from 'react-markdown';
import ConversationSidebar from '../components/ConversationSidebar';
import NeuralCallOverlay from '../components/NeuralCallOverlay';

export default function VoiceAI({ apiFetch, companyId }: { apiFetch: any, companyId: string | null }) {
  // Persistence States
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Mode States
  const [isCalling, setIsCalling] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMicSilent, setIsMicSilent] = useState(false);
  const [lastError, setLastError] = useState<string>('');
  const [audioLevel, setAudioLevel] = useState(0);
  const [currentLang, setCurrentLang] = useState('es-DO');
  const [neuralStatus, setNeuralStatus] = useState<'listening' | 'processing' | 'speaking' | 'idle'>('idle');

  // Mic Selection
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  // AI Usage & Quota
  const [aiUsage, setAiUsage] = useState<any>(null);
  const [resetCountdown, setResetCountdown] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Voice Refs
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<any>(window.speechSynthesis);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isCallingRef = useRef(false);
  const isAiSpeakingRef = useRef(false);
  const vocalInputRef = useRef('');
  const lastTranscriptTimeRef = useRef(Date.now());
  const noiseFloorRef = useRef(0);

  // Sync Refs
  useEffect(() => { isCallingRef.current = isCalling; }, [isCalling]);

  // Initial Load
  useEffect(() => {
    const getDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const devs = await navigator.mediaDevices.enumerateDevices();
        const audioDevs = devs.filter(d => d.kind === 'audioinput');
        setDevices(audioDevs);
        if (audioDevs.length > 0) setSelectedDeviceId(audioDevs[0].deviceId);
      } catch (err) { console.error("Mic permission denied:", err); }
    };
    getDevices();
  }, []);

  // Fetch AI Usage Stats
  const fetchUsage = async () => {
    try {
      const res = await apiFetch('/api/ai/usage');
      if (res.ok) { const data = await res.json(); setAiUsage(data); }
    } catch (e) { /* silent */ }
  };

  useEffect(() => { fetchUsage(); }, []);

  // Countdown timer to daily reset (midnight UTC)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nextMidnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
      const diff = Math.floor((nextMidnight.getTime() - now.getTime()) / 1000);
      const h = Math.floor(diff / 3600).toString().padStart(2, '0');
      const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const s = Math.floor(diff % 60).toString().padStart(2, '0');
      setResetCountdown(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Conversation Management
  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    setIsLoadingMessages(true);
    try {
      const res = await apiFetch(`/api/conversations/${id}/messages`);
      const data = await res.json();
      setMessages(data.map((m: any) => ({
        role: m.role,
        content: m.content
      })));
    } catch (err) { console.error("Error loading messages:", err); }
    finally { setIsLoadingMessages(false); }
  };

  const handleNewConversation = async () => {
    try {
      const res = await apiFetch('/api/conversations', { 
        method: 'POST', 
        body: JSON.stringify({ topic: `Consulta ${new Date().toLocaleTimeString()}`, companyId })
      });
      const conv = await res.json();
      setActiveConversationId(conv.id);
      setMessages([]);
    } catch (err) { console.error("Error creating conversation:", err); }
  };

  // --- Neural Voice Logic 2.0 (Whisper / Cross-Browser / Bilingual) ---
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const processingRef = useRef(false);

  const startRecording = () => {
    if (!streamRef.current) return;
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
    const recorder = new MediaRecorder(streamRef.current, { mimeType });
    audioChunksRef.current = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
    recorder.onstop = async () => {
      if (audioChunksRef.current.length === 0 || processingRef.current) return;
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      if (audioBlob.size < 1000) return;
      await processTranscription(audioBlob);
    };
    mediaRecorderRef.current = recorder;
    recorder.start();
    setIsListening(true);
    setNeuralStatus('listening');
  };

  const stopAndProcess = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const processTranscription = async (blob: Blob) => {
    if (processingRef.current) return;
    processingRef.current = true;
    setNeuralStatus('processing');
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      const res = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      if (!res.ok) throw new Error('Transcription failed');
      const data = await res.json();
      if (data.text && data.text.trim().length > 1) {
        console.log("📝 Whisper Received:", data.text);
        setInput(data.text);
        vocalInputRef.current = data.text;
        handleSend(data.text);
      } else {
        setNeuralStatus('listening');
        if (isCallingRef.current) startRecording();
      }
    } catch (err) {
      console.error("Whisper Error:", err);
      setNeuralStatus('listening');
      if (isCallingRef.current) startRecording();
    } finally {
      processingRef.current = false;
    }
  };

  // VAD Effect (Watchdog for Whisper)
  useEffect(() => {
    if (!streamRef.current || !isCalling) { setAudioLevel(0); return; }
    try {
      const visualizerStream = streamRef.current.clone();
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = ctx.createMediaStreamSource(visualizerStream);
      const gainNode = ctx.createGain(); gainNode.gain.value = 4.0;
      const analyzer = ctx.createAnalyser(); analyzer.fftSize = 256;
      source.connect(gainNode); gainNode.connect(analyzer);
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      let animationId: number;
      let silentTicks = 0;
      let isTalking = false;
      const update = () => {
        if (isAiSpeakingRef.current) { setAudioLevel(0); animationId = requestAnimationFrame(update); return; }
        analyzer.getByteFrequencyData(dataArray);
        let sum = 0; for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const average = sum / bufferLength;
        const level = average * 5;
        setAudioLevel(level);
        if (noiseFloorRef.current === 0 || average < noiseFloorRef.current) noiseFloorRef.current = average;
        else noiseFloorRef.current = noiseFloorRef.current * 0.995 + average * 0.005;
        const threshold = (noiseFloorRef.current + 1.5) * 5;
        if (level > threshold + 10) { isTalking = true; silentTicks = 0; }
        else { if (isTalking) { silentTicks++; if (silentTicks > 45) { isTalking = false; silentTicks = 0; stopAndProcess(); } } }
        animationId = requestAnimationFrame(update);
      };
      update();
      startRecording();
      return () => {
        cancelAnimationFrame(animationId);
        source.disconnect(); gainNode.disconnect();
        ctx.close();
        visualizerStream.getTracks().forEach(t => t.stop());
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') mediaRecorderRef.current.stop();
      };
    } catch (err) { console.error("Neural Acoustic Link Error:", err); }
  }, [isCalling]);

  // Interaction Logic
  const handleSend = async (overrideText?: string) => {
    const text = overrideText || input;
    if (!text.trim()) return;

    setInput(''); // Clear input box immediately for good UX
    setIsTyping(true);
    setNeuralStatus('processing');

    try {
      let convId = activeConversationId;
      
      // 1. Initialize Conversation if needed
      if (!convId) {
        const res = await apiFetch('/api/conversations', { 
          method: 'POST', 
          body: JSON.stringify({ topic: text.substring(0, 30) + "...", companyId })
        });
        
        if (!res.ok) {
          throw new Error(`Conversation creation failed with status: ${res.status}`);
        }
        
        const newConv = await res.json();
        convId = newConv.id;
        setActiveConversationId(convId);
      }

      // Add user message to UI
      const userMsg = { role: 'user', content: text };
      setMessages(prev => [...prev, userMsg]);

      // 2. Send Message to AI
      const resChat = await apiFetch('/api/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, companyId, conversationId: convId })
      });

      // Handle Quota Exceeded (429)
      if (resChat.status === 429) {
        const quotaData = await resChat.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: quotaData.text || '### ⚠️ Cuota Diaria Agotada\nTus créditos se renuevan automáticamente a medianoche (UTC).',
          isQuotaError: true
        }]);
        setShowUpgrade(true);
        fetchUsage();
        return;
      }

      if (!resChat.ok) {
        throw new Error(`AI Chat failed with status: ${resChat.status}`);
      }
      
      const response = await resChat.json();
      fetchUsage(); // Refresh quota counter
      const aiMsg = { 
        role: 'assistant', 
        content: response.text || "No obtuve respuesta del núcleo.",
        actionExecuted: !!response.actionExecuted 
      };
      
      setMessages(prev => [...prev, aiMsg]);
      
      // 3. Audio Handshake for Voice — use REF (not state) to avoid stale closure
      if (isCallingRef.current) {
        speak(aiMsg.content);
      }

    } catch (err) {
      console.error("Neural Link Master Error:", err);
      // Guarantee the user sees why it failed and it doesn't freeze
      setMessages(prev => [
        ...prev, 
        { role: 'user', content: text }, // ensure user text is visible if it failed before adding
        { role: 'assistant', content: '### ⚠️ Fallo del Enlace Neural\nHubo una interrupción en mi motor de comunicaciones. Por favor presiona el botón "Zap" (Reiniciar Hilo) o verifica tu conexión.' }
      ].reduce((acc, curr) => { // Deduplicate user msg if it was already added
        if (acc.length > 0 && acc[acc.length - 1].content === curr.content && curr.role === 'user') return acc;
        acc.push(curr); return acc;
      }, [] as any[]));
    } finally {
      setIsTyping(false);
      // Use REF to avoid stale closure — only go idle if NOT in voice call mode
      if (!isCallingRef.current) {
        setNeuralStatus('idle');
      } else {
        // Return to listening state if in call after processing (speak() overrides with 'speaking')
        setNeuralStatus('listening');
      }
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;
    
    // STOP RECORDING before speaking to prevent feedback loops
    stopAndProcess();

    synthRef.current.cancel();
    // Set TRUE immediately so mic doesn't pre-activate before TTS onstart fires
    isAiSpeakingRef.current = true;

    // Strip markdown, emojis, and action blocks — TTS chokes on them
    const cleanText = text
      .replace(/@@ACTION:.*?@@/gs, '')
      .replace(/[#*_`>|]/g, '')
      .replace(/[\u26A0\uFE0F\u2705\u274C\u{1F4A1}\u{1F6A8}]/gu, '')
      .replace(/\n{3,}/g, '\n')
      .trim();
    if (!cleanText) { isAiSpeakingRef.current = false; return; }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-MX';
    utterance.rate = 1.0;
    utterance.pitch = 0.95;
    
    utterance.onstart = () => { 
      isAiSpeakingRef.current = true; 
      setNeuralStatus('speaking');
    };
    utterance.onend = () => { 
      isAiSpeakingRef.current = false; 
      setNeuralStatus('listening');
      // RE-ACTIVATE recording after speaking
      if (isCallingRef.current) startRecording();
    };
    utterance.onerror = () => { 
      isAiSpeakingRef.current = false; 
      setNeuralStatus('listening');
      if (isCallingRef.current) startRecording();
    };

    setTimeout(() => { 
      if (isAiSpeakingRef.current && isCallingRef.current) {
        isAiSpeakingRef.current = false;
        startRecording();
      }
    }, 30000);

    synthRef.current.speak(utterance);
  };

  const toggleCall = async () => {
    if (isCalling) {
      setIsCalling(false);
      stopAndProcess();
      if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
      if (synthRef.current) synthRef.current.cancel();
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: selectedDeviceId ? { deviceId: { ideal: selectedDeviceId } } : true });
        streamRef.current = stream;
        setIsCalling(true);
        speak("Conexión neural establecida. El Socio Senior está a la escucha.");
      } catch (err) { console.error("Call failed:", err); }
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[#0a0a0a] overflow-hidden">
      {/* 1. History Sidebar */}
      <ConversationSidebar 
        apiFetch={apiFetch} 
        onSelect={handleSelectConversation} 
        activeId={activeConversationId}
        onNew={handleNewConversation}
      />

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="h-auto px-8 py-3 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-xl flex-wrap gap-3">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 flex items-center justify-center border border-red-600/30">
                 <Bot size={16} className="text-red-500" />
              </div>
              <h1 className="text-sm font-black uppercase tracking-[0.3em] text-white">Socio <span className="text-red-500">Senior</span></h1>
              {aiUsage && (
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                  aiUsage.role === 'Owner' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                  aiUsage.role === 'Premium' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                  aiUsage.role === 'Admin' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                  'bg-white/5 border-white/10 text-slate-400'
                }`}>
                  {aiUsage.label}
                </span>
              )}
           </div>

           <div className="flex items-center gap-3 flex-wrap">
              {/* AI Usage Widget */}
              {aiUsage && !aiUsage.unlimited && (
                <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Neural Calls Today</span>
                      <span className={`text-[10px] font-black tabular-nums ${aiUsage.remaining === 0 ? 'text-red-400' : aiUsage.remaining < 5 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                        {aiUsage.usedToday} / {aiUsage.dailyLimit}
                      </span>
                    </div>
                    <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full transition-all duration-500 ${
                          (aiUsage.usedToday / aiUsage.dailyLimit) < 0.6 ? 'bg-emerald-500' :
                          (aiUsage.usedToday / aiUsage.dailyLimit) < 0.85 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, (aiUsage.usedToday / aiUsage.dailyLimit) * 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={8} className="text-slate-500" />
                      <span className="text-[8px] text-slate-500 font-mono">Se renueva en {resetCountdown}</span>
                    </div>
                  </div>
                  {aiUsage.role === 'Free' && (
                    <button
                      onClick={() => setShowUpgrade(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg text-white text-[9px] font-black uppercase tracking-widest hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-red-900/30"
                    >
                      <Crown size={9} />
                      Premium
                    </button>
                  )}
                </div>
              )}

              {/* Unlimited Badge */}
              {aiUsage?.unlimited && (
                <div className="flex items-center gap-1.5 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <Crown size={10} className="text-yellow-400" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400">Ilimitado</span>
                </div>
              )}

              <button 
                onClick={toggleCall}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-[10px] uppercase tracking-widest ${
                  isCalling 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40' 
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Phone size={14} className={isCalling ? 'animate-pulse' : ''} />
                {isCalling ? 'Llamada Activa' : 'Iniciar Llamada'}
              </button>
           </div>
        </div>

        {/* Upgrade Modal */}
        <AnimatePresence>
          {showUpgrade && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/80 backdrop-blur-xl flex items-center justify-center p-8"
              onClick={() => setShowUpgrade(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#0d0d0d] border border-white/10 rounded-3xl p-8 max-w-lg w-full shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                    <Crown size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Acceso Premium</h2>
                    <p className="text-slate-500 text-xs">Desbloquea el Socio Senior al máximo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 mb-6">
                  {/* Free */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-3">
                      <div><p className="text-white font-black text-sm">Free</p><p className="text-slate-500 text-xs">Plan actual</p></div>
                      <p className="text-2xl font-black text-slate-400">$0</p>
                    </div>
                    <ul className="space-y-1">{['20 consultas/día','Modelo rápido (8B)','Solo chat de texto'].map(f => (
                      <li key={f} className="text-slate-500 text-xs flex items-center gap-2"><span className="text-slate-600">→</span>{f}</li>
                    ))}</ul>
                  </div>
                  {/* Premium */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-600/30 relative overflow-hidden">
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Recomendado</div>
                    <div className="flex justify-between items-start mb-3">
                      <div><p className="text-white font-black text-sm">Premium</p><p className="text-slate-400 text-xs">Acceso completo</p></div>
                      <p className="text-2xl font-black text-red-400">$99<span className="text-sm text-slate-400">/mes</span></p>
                    </div>
                    <ul className="space-y-1">{['500 consultas/día','Modelo poderoso 70B','Voz + Chat bidireccional','Análisis fiscal profundo','Acciones en base de datos'].map(f => (
                      <li key={f} className="text-slate-300 text-xs flex items-center gap-2"><span className="text-emerald-400">✓</span>{f}</li>
                    ))}</ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setShowUpgrade(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-slate-400 text-sm font-bold hover:bg-white/10 transition-all">
                    Más tarde
                  </button>
                  <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white text-sm font-black hover:opacity-90 transition-all shadow-lg shadow-red-900/30">
                    Activar Premium — $99/mes
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
          {isLoadingMessages ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-500">
               <Loader2 className="animate-spin" size={32} />
               <p className="text-[10px] font-bold uppercase tracking-widest">Sincronizando Archivos Neurales...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full max-w-xl mx-auto text-center">
               <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600/10 to-red-600/10 flex items-center justify-center mb-8 border border-white/5">
                  <Bot size={40} className="text-red-500/50" />
               </div>
               <h2 className="text-2xl font-black text-white mb-4 tracking-tight">Capa de Inteligencia Soberana</h2>
               <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Bienvenido al centro de mando. Como tu Socio Senior, estoy listo para auditar tus finanzas, gestionar tu personal o blindar tus contratos legales.
               </p>
               <div className="grid grid-cols-2 gap-3 w-full">
                  {['Auditoría Fiscal 606', 'Generar Contrato Legal', 'Estado de Nómina', 'Consultar RNC'].map(tag => (
                    <button key={tag} onClick={() => setInput(tag)} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] uppercase font-black tracking-widest text-slate-400 hover:text-white hover:bg-red-600/20 hover:border-red-600/30 transition-all">
                      {tag}
                    </button>
                  ))}
               </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl shrink-0 border flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-indigo-600/20 border-indigo-600/30 text-indigo-400' : 'bg-red-600/20 border-red-600/30 text-red-400'
                }`}>
                  {msg.role === 'user' ? <Zap size={18} /> : <Bot size={18} />}
                </div>
                <div className={`max-w-2xl px-6 py-4 rounded-3xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-blue-600/10 text-white rounded-tr-none border border-blue-600/20 shadow-lg shadow-blue-900/10' 
                    : 'bg-white/5 text-slate-200 rounded-tl-none border border-white/5'
                }`}>
                  <div className="prose prose-invert prose-sm max-w-none prose-headings:text-red-400 prose-strong:text-white prose-p:leading-relaxed">
                    <Markdown>
                      {msg.content}
                    </Markdown>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          {isTyping && (
             <div className="flex gap-6 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center"><Bot size={18} className="text-slate-600" /></div>
                <div className="h-12 w-24 bg-white/5 rounded-2xl rounded-tl-none" />
             </div>
          )}
        </div>

        {/* Chat Input Area */}
        <div className="p-8 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-4xl mx-auto relative group">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Escribe una instrucción táctica..."
              className="w-full bg-[#111] border border-white/10 rounded-3xl p-6 pr-24 text-sm focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-all resize-none min-h-[100px] shadow-2xl text-white placeholder:text-slate-600"
            />
            <div className="absolute right-5 bottom-5 flex items-center gap-3">
              <button 
                onClick={() => handleSend()}
                className="w-12 h-12 bg-red-600 hover:bg-red-500 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-red-900/40 active:scale-95"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Neural Call Telephony Overlay */}
      <NeuralCallOverlay 
        isActive={isCalling}
        onEnd={toggleCall}
        audioLevel={audioLevel}
        isMicSilent={isMicSilent}
        lastError={lastError}
        isSecureContext={!!window.isSecureContext}
        onReset={() => window.location.reload()}
        status={neuralStatus}
        transcript={input}
      />
    </div>
  );
}
