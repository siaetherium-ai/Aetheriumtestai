import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Trash2, 
  Clock, 
  ShieldAlert,
  ChevronRight,
  Filter
} from 'lucide-react';

interface NotificationViewProps {
  apiFetch: (url: string, options?: any) => Promise<any>;
}

export default function NotificationView({ apiFetch }: NotificationViewProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/api/notifications');
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'POST' });
      fetchNotifications();
    } catch (error) {
       console.error(error);
    }
  };

  const clearAll = async () => {
    try {
      await apiFetch('/api/notifications/read-all', { method: 'POST' });
      fetchNotifications();
    } catch (error) {
       console.error(error);
    }
  };

  const filtered = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
               <Bell className="text-indigo-400" size={24} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase tracking-widest">Centro de <span className="text-indigo-500">Notificaciones</span></h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Alertas de cumplimiento, actualizaciones de IA y eventos del sistema en tiempo real.</p>
        </div>

        <button 
          onClick={clearAll}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border border-white/5"
        >
          <CheckCircle2 size={16} />
          Marcar todo como leído
        </button>
      </div>

      <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl w-fit">
         {['all', 'info', 'success', 'warning', 'alert'].map(t => (
            <button 
               key={t}
               onClick={() => setFilter(t)}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
            >
               {t === 'all' ? 'Todas' : t === 'alert' ? 'Críticas' : t}
            </button>
         ))}
      </div>

      <div className="space-y-4">
         {isLoading ? (
            <div className="p-20 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
         ) : filtered.length === 0 ? (
            <div className="p-20 text-center bg-white/5 border border-dashed border-white/10 rounded-[2.5rem]">
               <ShieldAlert size={48} className="mx-auto text-slate-700 mb-4" />
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No hay notificaciones pendientes</p>
            </div>
         ) : (
            <AnimatePresence>
               {filtered.map((notif) => (
                  <motion.div 
                    key={notif.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-6 border rounded-[2rem] flex items-start gap-4 cursor-pointer transition-all ${notif.isRead ? 'bg-white/[0.02] border-white/5 opacity-60' : 'bg-white/5 border-indigo-500/20 shadow-xl shadow-indigo-600/5'}`}
                    onClick={() => !notif.isRead && markAsRead(notif.id)}
                  >
                     <div className={`mt-1 p-2 rounded-xl border ${
                        notif.type === 'alert' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                        notif.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                        notif.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                        'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                     }`}>
                        {notif.type === 'alert' ? <ShieldAlert size={18} /> :
                         notif.type === 'warning' ? <AlertCircle size={18} /> :
                         notif.type === 'success' ? <CheckCircle2 size={18} /> :
                         <Info size={18} />}
                     </div>
                     
                     <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                           <h3 className="font-bold text-white text-sm">{notif.title}</h3>
                           <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                              <Clock size={10} /> {new Date(notif.createdAt).toLocaleTimeString()}
                           </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium">{notif.message}</p>
                     </div>
                     <ChevronRight size={16} className="text-slate-600 self-center" />
                  </motion.div>
               ))}
            </AnimatePresence>
         )}
      </div>
    </div>
  );
}
