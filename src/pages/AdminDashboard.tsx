import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Users, Activity, Settings, CheckCircle2, XCircle, 
  Trash2, Zap, Globe, Bell, Cpu, ChevronRight, UserCheck,
  Brain, Plus, BookOpen, MessageSquare, Database, Search,
  AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
  apiFetch: (url: string, options?: any) => Promise<any>;
}

export default function AdminDashboard({ apiFetch }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'leads' | 'logs' | 'neural' | 'settings'>('users');
  const [users, setUsers] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [knowledge, setKnowledge] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    aiModel: 'sovereign-local-v1',
    notificationsEnabled: true,
    aiVoiceEnabled: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Neural Training Form state
  const [trainMode, setTrainMode] = useState<'qa' | 'doc'>('qa');
  const [trainQ, setTrainQ] = useState('');
  const [trainA, setTrainA] = useState('');
  const [trainDoc, setTrainDoc] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await apiFetch('/api/admin/users');
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else if (activeTab === 'logs') {
        const res = await apiFetch('/api/logs');
        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } else if (activeTab === 'settings') {
        const res = await apiFetch('/api/settings');
        const data = await res.json();
        if (data && !data.error) setSettings(data);
      } else if (activeTab === 'leads') {
        const res = await apiFetch('/api/leads');
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      } else if (activeTab === 'neural') {
        const res = await apiFetch('/api/ai/knowledge');
        const data = await res.json();
        setKnowledge(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Admin fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await apiFetch(`/api/admin/users/${id}/approve`, { method: 'POST' });
      showToast('Usuario aprobado exitosamente.');
      fetchData();
    } catch (error) {
      showToast('Error al aprobar usuario.', 'error');
    }
  };

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      await apiFetch(`/api/admin/users/${id}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      showToast('Rol actualizado.');
      fetchData();
    } catch (error) {
      showToast('Error al cambiar rol.', 'error');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('¿Eliminar este usuario permanentemente?')) return;
    try {
      await apiFetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      showToast('Usuario eliminado.');
      fetchData();
    } catch (error) {
      showToast('Error al eliminar usuario.', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      showToast('Configuración guardada en el Core.');
    } catch (error) {
      showToast('Error al guardar configuración.', 'error');
    }
  };

  const handleTrainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const body = trainMode === 'qa'
        ? { question: trainQ, answer: trainA }
        : { docContent: trainDoc };
      const res = await apiFetch('/api/ai/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error('Failed');
      showToast('✅ IA entrenada exitosamente. Aplicado de inmediato.');
      setTrainQ(''); setTrainA(''); setTrainDoc('');
      fetchData();
    } catch {
      showToast('❌ Error al entrenar la IA.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteKnowledge = async (id: string) => {
    try {
      await apiFetch(`/api/ai/knowledge/${id}`, { method: 'DELETE' });
      showToast('Entrada de conocimiento eliminada.');
      fetchData();
    } catch {
      showToast('Error al eliminar.', 'error');
    }
  };

  return (
    <div className="space-y-8 pb-20 relative">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[999] px-6 py-4 rounded-2xl text-sm font-bold shadow-2xl border ${
              toast.type === 'success'
                ? 'bg-emerald-900/90 border-emerald-500/30 text-emerald-300'
                : 'bg-red-900/90 border-red-500/30 text-red-300'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20">
               <Shield className="text-red-500" size={24} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Sovereign <span className="text-red-500">Core</span></h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Centro de mando administrativo. Entrena la IA y gestiona el sistema.</p>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl flex-wrap gap-1">
          <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={15} />} label="Usuarios" />
          <TabButton active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} icon={<Globe size={15} />} label="Leads" />
          <TabButton active={activeTab === 'neural'} onClick={() => setActiveTab('neural')} icon={<Brain size={15} />} label="Neural Training" highlight />
          <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Activity size={15} />} label="Sistema" />
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={15} />} label="Config" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminStatCard label="Usuarios" value={users.length} icon={<Users size={20} />} color="indigo" />
        <AdminStatCard label="Pendientes" value={users.filter(u => !u.isApproved).length} icon={<UserCheck size={20} />} color="amber" />
        <AdminStatCard label="Conocimiento IA" value={knowledge.length} icon={<Brain size={20} />} color="violet" />
        <AdminStatCard label="Logs del Sistema" value={logs.length} icon={<Zap size={20} />} color="emerald" />
      </div>

      <AnimatePresence mode="wait">

        {/* ===== USERS TAB ===== */}
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-[#030816]/60 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
            <div className="p-8 border-b border-white/5 bg-white/5">
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Gestión de Acceso Neural</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Identidad</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Rol</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Registro</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Estado</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr><td colSpan={5} className="p-20 text-center">
                      <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td></tr>
                  ) : users.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-slate-500 text-sm">No hay usuarios registrados.</td></tr>
                  ) : users.map(user => (
                    <tr key={user.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-white">{user.fullName || 'Usuario'}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <select
                          value={user.role || 'Free'}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 outline-none"
                        >
                          <option value="Free">Free</option>
                          <option value="Premium">Premium</option>
                          <option value="Admin">Admin</option>
                          <option value="Owner">Owner</option>
                        </select>
                      </td>
                      <td className="px-8 py-5 text-[10px] font-bold text-slate-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-DO') : '—'}
                      </td>
                      <td className="px-8 py-5">
                        {user.isApproved ? (
                          <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase">
                            <CheckCircle2 size={12} /> Aprobado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-amber-500 text-[10px] font-black uppercase animate-pulse">
                            <Activity size={12} /> Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right flex items-center justify-end gap-2">
                        {!user.isApproved && (
                          <button onClick={() => handleApprove(user.id)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg transition-all">
                            Aprobar
                          </button>
                        )}
                        <button onClick={() => handleDeleteUser(user.id)}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/20">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ===== LEADS TAB ===== */}
        {activeTab === 'leads' && (
          <motion.div key="leads" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-[#030816]/60 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
            <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-tight">Leads Registrados</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Personas que han completado el formulario de prueba</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-widest">
                  Total: {leads.length}
                </span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Persona</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Contacto</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Empresa</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Uso Trial</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">IP / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr><td colSpan={5} className="p-20 text-center">
                      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    </td></tr>
                  ) : leads.length === 0 ? (
                    <tr><td colSpan={5} className="p-10 text-center text-slate-500 text-sm">No hay leads registrados.</td></tr>
                  ) : leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-white uppercase">{lead.firstName} {lead.lastName}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{new Date(lead.createdAt).toLocaleDateString('es-DO')}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-300">{lead.email}</span>
                          <span className="text-[10px] text-slate-500 font-bold">{lead.phone || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lead.businessName || '—'}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                           <div className="w-full max-w-[100px] h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                              <div 
                                className={`h-full transition-all ${lead.totalMinutesUsed >= 300 ? 'bg-red-500' : 'bg-indigo-500'}`}
                                style={{ width: `${Math.min(100, (lead.totalMinutesUsed / 300) * 100)}%` }}
                              />
                           </div>
                           <span className="text-[10px] font-black text-slate-400">{Math.floor(lead.totalMinutesUsed / 60)}h {lead.totalMinutesUsed % 60}m</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-slate-600">{lead.ipAddress}</span>
                          {lead.isBlocked ? (
                            <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1">
                              <XCircle size={10} /> Bloqueado
                            </span>
                          ) : (
                            <span className="text-[9px] font-black text-emerald-500 uppercase flex items-center gap-1">
                              <CheckCircle2 size={10} /> Activo
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ===== NEURAL TRAINING TAB ===== */}
        {activeTab === 'neural' && (
          <motion.div key="neural" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">

            {/* Training Form */}
            <div className="bg-[#030816]/60 border border-violet-500/20 rounded-[2.5rem] p-8 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 blur-[100px] rounded-full -z-10" />
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                <div className="w-10 h-10 bg-violet-600/20 rounded-2xl flex items-center justify-center border border-violet-500/20">
                  <Brain size={20} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white uppercase tracking-tight">Entrenar al Socio Senior</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Agrega conocimiento y la IA lo usará de inmediato en todos los chats</p>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2 mb-8">
                <button onClick={() => setTrainMode('qa')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${trainMode === 'qa' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
                  <MessageSquare size={14} /> Pregunta & Respuesta
                </button>
                <button onClick={() => setTrainMode('doc')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${trainMode === 'doc' ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-white/5 text-slate-500 hover:text-white'}`}>
                  <BookOpen size={14} /> Documento Libre
                </button>
              </div>

              <form onSubmit={handleTrainSubmit} className="space-y-5">
                {trainMode === 'qa' ? (
                  <>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Pregunta que hará el usuario</label>
                      <input
                        value={trainQ}
                        onChange={e => setTrainQ(e.target.value)}
                        placeholder="Ej: ¿Cuál es el plazo para presentar el 606?"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-violet-500/30 placeholder:text-slate-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Respuesta de la IA (soporta Markdown)</label>
                      <textarea
                        value={trainA}
                        onChange={e => setTrainA(e.target.value)}
                        placeholder="Ej: El plazo para presentar el Formato 606 es los primeros **20 días** del mes siguiente..."
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-violet-500/30 resize-none placeholder:text-slate-600"
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 mb-2 block">Contenido del Documento (la IA aprenderá todo esto)</label>
                    <textarea
                      value={trainDoc}
                      onChange={e => setTrainDoc(e.target.value)}
                      placeholder="Pega aquí leyes, procedimientos, manuales, políticas o cualquier texto que quieres que la IA conozca..."
                      rows={8}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-violet-500/30 resize-none placeholder:text-slate-600"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-2xl shadow-violet-600/30 transition-all flex items-center justify-center gap-3"
                >
                  {isSaving
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sincronizando con Motor Neural...</>
                    : <><Brain size={16} /> Entrenar IA Ahora</>
                  }
                </button>
              </form>
            </div>

            {/* Knowledge Base List */}
            <div className="bg-[#030816]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-6">
                <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <Database size={16} className="text-violet-400" />
                  Base de Conocimiento ({knowledge.length} entradas)
                </h3>
                <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
                  Live DB
                </span>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : knowledge.length === 0 ? (
                <div className="text-center py-10">
                  <Brain size={40} className="text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm font-bold">La IA aún no ha sido entrenada.</p>
                  <p className="text-slate-600 text-xs mt-1">Agrega tu primera Pregunta & Respuesta arriba.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {knowledge.map((entry: any) => {
                    const meta = entry.metadata as any;
                    return (
                      <div key={entry.id}
                        className="flex items-start justify-between p-5 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                              entry.type === 'KnowledgeQA'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {entry.type === 'KnowledgeQA' ? '🧠 Q&A' : '📄 Documento'}
                            </span>
                            <span className="text-[10px] text-slate-600 font-bold">
                              {new Date(entry.date).toLocaleDateString('es-DO')}
                            </span>
                          </div>
                          {entry.type === 'KnowledgeQA' && meta ? (
                            <>
                              <p className="text-sm font-black text-white mb-1">❓ {meta.question}</p>
                              <p className="text-xs text-slate-400 font-medium line-clamp-2">💬 {meta.answer?.substring(0, 120)}...</p>
                            </>
                          ) : (
                            <p className="text-xs text-slate-400 font-medium line-clamp-2">{entry.content?.substring(0, 150)}...</p>
                          )}
                        </div>
                        <button onClick={() => handleDeleteKnowledge(entry.id)}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all border border-red-500/20 shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== LOGS TAB ===== */}
        {activeTab === 'logs' && (
          <motion.div key="logs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="bg-[#030816]/60 border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Registro de Operaciones</h2>
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  Live
                </div>
              </div>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : logs.length === 0 ? (
                <p className="text-center text-slate-500 py-10">Sin logs de sistema aún.</p>
              ) : (
                <div className="space-y-3">
                  {logs.map((log, i) => (
                    <div key={log.id || i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-red-500 transition-colors">
                          <Zap size={15} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white uppercase tracking-tighter">{log.action}</p>
                          <p className="text-[10px] text-slate-500 font-bold">{log.user?.fullName || 'Sistema'} • {log.createdAt ? new Date(log.createdAt).toLocaleTimeString('es-DO') : '—'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== SETTINGS TAB ===== */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto">
            <div className="bg-[#030816]/60 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-20 bg-red-600/5 blur-[120px] -z-10 rounded-full" />
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-10 border-b border-white/5 pb-6">Configuración del Motor Neural</h2>
              
              <form onSubmit={handleSaveSettings} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Modelo de Lenguaje Activo</label>
                    <input
                      type="text"
                      value={settings.aiModel || 'sovereign-local-v1'}
                      onChange={(e) => setSettings({...settings, aiModel: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-red-600/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ToggleRow
                    label="Voz Dinámica Activa"
                    description="Síntesis de voz en Neural Call"
                    active={settings.aiVoiceEnabled}
                    onToggle={() => setSettings({...settings, aiVoiceEnabled: !settings.aiVoiceEnabled})}
                  />
                  <ToggleRow
                    label="Notificaciones Globales"
                    description="Push & sistema"
                    active={settings.notificationsEnabled}
                    onToggle={() => setSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
                  />
                </div>

                <button type="submit"
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-5 rounded-2xl uppercase tracking-[0.3em] text-xs shadow-2xl shadow-red-600/30 transition-all flex items-center justify-center gap-3">
                  <Settings size={16} /> Desplegar Cambios en el Core
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, highlight }: any) {
  return (
    <button onClick={onClick}
      className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
        active
          ? highlight ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-red-600 text-white shadow-lg shadow-red-600/20'
          : 'text-slate-500 hover:text-white'
      }`}
    >
      {icon}{label}
    </button>
  );
}

function AdminStatCard({ label, value, icon, color }: any) {
  const colors: any = {
    indigo: "from-indigo-600/20 to-indigo-600/5 text-indigo-400 border-indigo-500/10",
    amber: "from-amber-600/20 to-amber-600/5 text-amber-400 border-amber-500/10",
    emerald: "from-emerald-600/20 to-emerald-600/5 text-emerald-400 border-emerald-500/10",
    violet: "from-violet-600/20 to-violet-600/5 text-violet-400 border-violet-500/10",
    red: "from-red-600/20 to-red-600/5 text-red-500 border-red-500/10"
  };
  return (
    <div className={`p-6 bg-gradient-to-br ${colors[color]} border rounded-[2rem] backdrop-blur-3xl relative overflow-hidden group`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
        <ChevronRight size={14} className="text-slate-600" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
      <h3 className="text-2xl font-black text-white">{value}</h3>
    </div>
  );
}

function ToggleRow({ label, description, active, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 transition-colors" onClick={onToggle}>
      <div>
        <p className="text-xs font-black text-white uppercase">{label}</p>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{description}</p>
      </div>
      <div className={`w-14 h-8 rounded-full p-1 transition-all ${active ? 'bg-red-600' : 'bg-slate-800'}`}>
        <div className={`w-6 h-6 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}
