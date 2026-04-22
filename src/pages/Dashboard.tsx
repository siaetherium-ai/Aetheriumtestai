import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  Plus, 
  Search, 
  ArrowUpRight, 
  Users, 
  ShieldCheck, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const SLAM_IN = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Dashboard({ apiFetch, onNavigate }: { apiFetch: any, onNavigate: (page: string) => void }) {
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalRevenue: 0,
    avgHealth: 0,
    pendingObligations: 0
  });

  useEffect(() => {
    // Fetch global master stats
    apiFetch('/api/stats/global')
      .then((res: any) => res.json())
      .then((data: any) => {
        if (!data.error) {
          setStats({
            totalCompanies: data.totalCompanies || 0,
            totalRevenue: data.totalRevenue || 0,
            avgHealth: data.avgHealth || 0,
            pendingObligations: data.pendingObligations || 0
          });
        }
      })
      .catch(console.error);
  }, []);

  return (
    <motion.div {...SLAM_IN} className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">Global Command Center</h1>
          <p className="text-slate-400 mt-2">Visión 360 del ecosistema corporativo y cumplimiento fiscal.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => onNavigate('companies')} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold text-xs transition-all shadow-xl shadow-indigo-600/30 flex items-center gap-2">
            <Plus size={16} /> Nueva Entidad
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Entidades Activas" value={stats.totalCompanies.toString()} icon={<Building2 size={20} />} trend="+2" />
        <StatCard title="Revenue Agregado" value={`RD$ ${(stats.totalRevenue/1000000).toFixed(1)}M`} icon={<DollarSign size={20} />} trend="+12%" />
        <StatCard title="Salud Fiscal Promedio" value={`${stats.avgHealth}%`} icon={<Activity size={20} />} color={stats.avgHealth > 80 ? 'emerald' : 'amber'} />
        <StatCard title="Pendientes DGII" value={stats.pendingObligations.toString()} icon={<ShieldCheck size={20} />} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8 min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg">Proyección de Ingresos & Impuestos</h3>
              <p className="text-xs text-slate-500 font-medium">Histórico acumulado de los últimos 6 meses</p>
            </div>
            <select className="bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs font-bold text-slate-400">
              <option>Últimos 6 meses</option>
              <option>Año Actual</option>
            </select>
          </div>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.revenueHistory || []}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="rev" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="tax" stroke="#10b981" strokeWidth={3} fill="transparent" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8">
           <h3 className="font-bold mb-6 flex items-center gap-2">
             <Calendar size={18} className="text-indigo-400" />
             Próximos Vencimientos
           </h3>
           <div className="space-y-4">
              {(stats.deadlines || []).map((d: any, i: number) => (
                <DeadlineItem key={i} title={d.title} date={d.date} severity={d.severity} onClick={() => onNavigate('fiscal')} />
              ))}
              {(!stats.deadlines || stats.deadlines.length === 0) && <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center py-10 italic">No hay vencimientos próximos</p>}
           </div>
           <button onClick={() => onNavigate('fiscal')} className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5 flex items-center justify-center gap-2">
             Ir al Calendario Fiscal <ArrowUpRight size={14} />
           </button>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon, trend, color = 'indigo' }: any) {
  const colors: any = {
    indigo: 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-600/10 text-amber-400 border-amber-500/20',
    red: 'bg-red-600/10 text-red-400 border-red-500/20',
  };

  return (
    <div className={`glass-card p-6 border ${colors[color]} relative overflow-hidden group hover:scale-[1.02] transition-all`}>
      <div className="flex justify-between items-start relative z-10">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {trend && (
          <span className="text-[10px] font-black px-2 py-1 bg-white/10 rounded-full">{trend}</span>
        )}
      </div>
      <div className="mt-6 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">{title}</p>
        <p className="text-3xl font-black">{value}</p>
      </div>
      <div className="absolute -bottom-6 -right-6 p-10 opacity-[0.03] group-hover:opacity-[0.05] transition-all">
        {icon}
      </div>
    </div>
  );
}

function DeadlineItem({ title, date, severity, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className={`w-1.5 h-8 rounded-full ${severity === 'high' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'}`} />
        <div>
          <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{title}</p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{date}</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
    </div>
  );
}
