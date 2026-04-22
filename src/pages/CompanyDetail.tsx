import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Activity, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  Edit2,
  Trash2,
  TrendingUp,
  AlertCircle,
  FileText,
  DollarSign,
  PieChart,
  BarChart3,
  Scale
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const SLAM_IN = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4 }
};

interface CompanyDetailProps {
  id: string;
  apiFetch: any;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export default function CompanyDetail({ id, apiFetch, onBack, onNavigate }: CompanyDetailProps) {
  const [company, setCompany] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [deadlines, setDeadlines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [compRes, metricsRes, alertsRes, deadlinesRes] = await Promise.all([
          apiFetch(`/api/companies/${id}`),
          apiFetch(`/api/fiscal/metrics/${id}`),
          apiFetch(`/api/fiscal/analysis/${id}`),
          apiFetch(`/api/fiscal/deadlines/${id}`)
        ]);
        const compData = await compRes.json();
        const metricsData = await metricsRes.json();
        const alertsData = await alertsRes.json();
        const deadlinesData = await deadlinesRes.json();

        setCompany(compData);
        setMetrics(metricsData);
        setAlerts(alertsData);
        setDeadlines(deadlinesData);
      } catch (err) { console.error(err); }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  if (isLoading) return <div className="p-20 text-center animate-pulse uppercase font-black tracking-widest text-slate-500">Decriptando Ecosistema...</div>;
  if (!company) return <div>No encontrada</div>;

  return (
    <motion.div {...SLAM_IN} className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex items-center gap-4">
           <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20">
              <Building2 size={32} />
           </div>
           <div>
              <h1 className="text-3xl font-black tracking-tight text-white">{company.name}</h1>
              <p className="text-sm font-mono text-indigo-400">{company.rnc} • {company.sector || 'General'}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-card p-6 border-indigo-500/10">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-500">Perfil Corporativo</h3>
                 <button className="text-indigo-400 hover:text-indigo-300"><Edit2 size={14} /></button>
              </div>
              <div className="space-y-4">
                 <DetailItem icon={<MapPin size={14} />} label="Dirección" value={company.address || 'No registrada'} />
                 <DetailItem icon={<Phone size={14} />} label="Teléfono" value={company.phone || 'No registrado'} />
                 <DetailItem icon={<Mail size={14} />} label="Email" value={company.email || 'No registrado'} />
                 <DetailItem icon={<Users size={14} />} label="Empleados" value={company.employeeCount?.toString() || '1'} />
              </div>
           </div>

           <div className="glass-card p-6 bg-emerald-500/5 border-emerald-500/20">
              <h3 className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-4">Salud Fiscal</h3>
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 rounded-full border-4 border-emerald-500/30 border-t-emerald-500 flex items-center justify-center">
                    <span className="text-lg font-black">{company.taxHealth}%</span>
                 </div>
                 <div>
                    <p className="text-xs font-bold text-white">Status Óptimo</p>
                    <p className="text-[10px] text-slate-500">Ultima auditoría: Hoy</p>
                 </div>
              </div>
           </div>

           <div className="space-y-2">
              <ActionButton onClick={() => onNavigate('audit')} icon={<Activity size={16} />} label="Ejecutar Auditoría" />
              <ActionButton onClick={() => onNavigate('fiscal')} icon={<FileText size={16} />} label="Módulo Fiscal" />
              <ActionButton onClick={() => onNavigate('e-invoicing')} icon={<ShieldCheck size={16} />} label="E-Facturación" />
              <ActionButton onClick={() => onNavigate('contracts')} icon={<Scale size={16} />} label="Legal & Contratos" />
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricStat label="Ingresos Anuales" value={`RD$ ${(metrics.reduce((acc, m) => acc + (m.revenue || 0), 0) / 1000000).toFixed(1)}M`} icon={<DollarSign size={18} />} trend="+15%" />
              <MetricStat label="ITBIS Pagado" value={`RD$ ${(metrics.reduce((acc, m) => acc + (m.taxEstimate || 0), 0) / 1000).toFixed(1)}K`} icon={<BarChart3 size={18} />} />
              <MetricStat label="Gastos Deducibles" value={`RD$ ${(metrics.reduce((acc, m) => acc + (m.expenses || 0), 0) / 1000000).toFixed(1)}M`} icon={<PieChart size={18} />} />
           </div>

           <div className="glass-card p-8 min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="font-black text-xl">Rendimiento Financiero</h3>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Ingresos</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                       <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Proyección</span>
                    </div>
                 </div>
              </div>
              <div className="h-[300px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={metrics.slice().reverse()}>
                       <defs>
                          <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                       />
                       <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorMetric)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card p-6 border-red-500/10 bg-red-500/5">
                 <h3 className="font-bold text-sm text-red-100 mb-4 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-400" />
                    Alertas Críticas de IA
                 </h3>
                 <div className="space-y-4">
                    {alerts.map((alert, i) => (
                      <div key={i} className={`p-4 bg-black/20 rounded-2xl border ${alert.type === 'CRITICAL' ? 'border-red-500/30' : 'border-amber-500/30'} text-xs text-slate-200/90 leading-relaxed`}>
                         <strong className={`block mb-1 ${alert.type === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>{alert.title}</strong>
                         "{alert.content}"
                      </div>
                    ))}
                    {alerts.length === 0 && <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center py-4">No se detectan discrepancias</p>}
                 </div>
              </div>
              <div className="glass-card p-6 border-indigo-500/10">
                 <h3 className="font-bold text-sm text-indigo-100 mb-4 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-indigo-400" />
                    Auditoría de Cumplimiento
                 </h3>
                 <div className="space-y-3">
                    {deadlines.length > 0 ? deadlines.map((d, i) => (
                      <ComplianceManualItem 
                        key={i} 
                        label={d.title} 
                        date={d.formattedDate}
                        status={d.isOverdue ? 'warn' : 'ok'} 
                      />
                    )) : (
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest text-center py-4">Sincronizando Calendario...</p>
                    )}
                 </div>
              </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailItem({ icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-1 text-slate-500">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-xs font-bold text-slate-200">{value}</p>
      </div>
    </div>
  );
}

function MetricStat({ label, value, icon, trend }: any) {
  return (
    <div className="glass-card p-6 border-white/5 hover:bg-white/5 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-indigo-600/10 text-indigo-400 rounded-xl">{icon}</div>
        {trend && <span className="text-[10px] font-black text-emerald-400">{trend}</span>}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-slate-900 border border-white/5 rounded-2xl hover:bg-indigo-600 hover:text-white group transition-all"
    >
      <div className="flex items-center gap-3">
        <span className="text-indigo-400 group-hover:text-white transition-colors">{icon}</span>
        <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      </div>
      <ChevronRight size={14} className="opacity-30 group-hover:opacity-100 transition-all" />
    </button>
  );
}

function ComplianceManualItem({ label, status, date }: any) {
  const styles: any = {
    ok: 'text-emerald-500 bg-emerald-500/10',
    warn: 'text-rose-500 bg-rose-500/10',
    pending: 'text-slate-500 bg-slate-500/10',
  };
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{label}</span>
        <span className="text-[9px] font-bold text-slate-500">{date}</span>
      </div>
      <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${styles[status]}`}>
        {status === 'ok' ? 'ACTIVO' : status === 'warn' ? 'VENCIDO' : 'PENDIENTE'}
      </div>
    </div>
  );
}

function ComplianceItem({ label, status }: any) {
  const styles: any = {
    ok: 'text-emerald-500 bg-emerald-500/10',
    warn: 'text-amber-500 bg-amber-500/10',
    pending: 'text-slate-500 bg-slate-500/10',
  };
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${styles[status]}`}>
        {status === 'ok' ? 'Al día' : status === 'warn' ? 'Alerta' : 'Pendiente'}
      </div>
    </div>
  );
}
