import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Phone, Briefcase, Send, Gem, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface LeadFormProps {
  onSuccess: () => void;
}

export default function LeadForm({ onSuccess }: LeadFormProps) {
  const { login } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL || '';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al enviar los datos');
      
      // Auto-login with the returned token and user
      if (data.token && data.user) {
        console.log("[LeadForm] Login successful, updating React state...");
        // This will instantly update AuthContext and trigger App.tsx to render PrivateRoutes
        login(data.token, data.user);
        return; 
      } else {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 overflow-y-auto">
      <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="relative w-full max-w-xl bg-[#030816] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-500/10"
      >
        <div className="h-2 w-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600" />
        
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-6 border border-indigo-500/30">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-3">
              Acceso a la Infraestructura
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-sm mx-auto">
              Bienvenido a <span className="text-indigo-400 font-bold">Aetherium AI</span>. 
              Por favor, completa tus credenciales para iniciar tu periodo de prueba de 5 horas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Nombre</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Apellido</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Tu apellido"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@empresa.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Teléfono</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (809) 000-0000"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-4">Empresa / Negocio</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="Nombre de tu empresa"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-bold text-center bg-red-400/10 py-3 rounded-xl border border-red-400/20">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full relative group p-5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              <div className="relative flex items-center justify-center gap-3">
                <span>{loading ? 'Redirigiendo...' : 'Iniciar prueba limitada'}</span>
                <Send size={18} className={`transition-transform ${loading ? 'translate-x-2 opacity-0' : 'group-hover:translate-x-1 group-hover:-translate-y-1'}`} />
              </div>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Gem size={14} className="text-indigo-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Aetherium Software Innovations - Trial System</span>
            </div>
            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-4">
              Plataforma en Desarrollo • 5 Horas de Acceso Limitado
            </p>
            <Link 
              to="/admin-login" 
              className="text-slate-500 hover:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] transition-colors"
            >
              Acceso Administrativo
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
