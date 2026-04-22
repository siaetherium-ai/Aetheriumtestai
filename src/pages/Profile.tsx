import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Shield, 
  Key, 
  Bell, 
  LogOut, 
  Camera, 
  Globe,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile({ apiFetch }: { apiFetch: any }) {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState<any>({
     aiVoiceEnabled: true,
     developerMode: false,
     twoFactorAuth: true,
     neuralLock: false,
     newDeviceAlerts: true,
     taxAlerts: true,
     marketAlerts: true,
     coreUpdates: false
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
     // Fetch configuraciones globales/locales si existieran en el backend
     // Por ahora, simulamos una carga de DB para que los toggles se comporten funcionalmente
     const loadUserPrefs = async () => {
        try {
           const res = await apiFetch('/api/settings');
           const data = await res.json();
           if (data && !data.error) {
              setSettings(prev => ({...prev, aiVoiceEnabled: data.aiVoiceEnabled}));
           }
        } catch(e) {
           console.error("No se pudo cargar setting de DB");
        }
     }
     loadUserPrefs();
  }, [apiFetch]);

  const updateSetting = async (key: string, value: boolean) => {
     setSettings(prev => ({...prev, [key]: value}));
     // Aqui se integraría el patch a la DB del usuario
     try {
         setIsSaving(true);
         // Simulate DB delay
         await new Promise(r => setTimeout(r, 600));
     } catch (e) {
         console.error(e);
     } finally {
         setIsSaving(false);
     }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Mini */}
        <div className="w-full md:w-64 space-y-2">
           <ProfileTab active={activeTab === 'account'} onClick={() => setActiveTab('account')} label="Mi Cuenta" icon={<User size={18} />} />
           <ProfileTab active={activeTab === 'security'} onClick={() => setActiveTab('security')} label="Seguridad" icon={<Shield size={18} />} />
           <ProfileTab active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} label="Notificaciones" icon={<Bell size={18} />} />
           <div className="pt-4">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-6 py-3 text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px]"
              >
                 <LogOut size={18} /> Cerrar Sesión
              </button>
           </div>
        </div>

         {/* Main Content */}
         <div className="flex-1 space-y-6">
           {activeTab === 'account' && (
             <>
               <div className="glass-card p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-10 bg-indigo-500/5 blur-[80px] -z-10 rounded-full" />
                  
                  <div className="flex items-center gap-6 mb-10">
                     <div className="relative group">
                        <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-600/20">
                           {user?.fullName?.[0].toUpperCase() || user?.email?.[0].toUpperCase()}
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-slate-900 border border-white/10 rounded-xl text-slate-400 hover:text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all">
                           <Camera size={16} />
                        </button>
                     </div>
                     <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">{user?.fullName || user?.email?.split('@')[0]}</h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{user?.role} Access</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ProfileField label="Email Corporativo" value={user?.email} icon={<Mail size={16} />} />
                        <ProfileField label="ID de Usuario" value={user?.id.substring(0, 12)} icon={<Key size={16} />} />
                     </div>
                     
                     <div className="pt-6 border-t border-white/5 space-y-6">
                        <div className="flex items-center justify-between">
                           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Ajustes Neurales</h3>
                           {isSaving && <span className="text-[10px] text-emerald-500 font-bold animate-pulse">Sincronizando con Core DB...</span>}
                        </div>
                        <div className="space-y-4">
                           <ToggleSetting 
                              label="Respuestas de IA por Voz" 
                              description="Activa la síntesis de voz en el Neural Call." 
                              active={settings.aiVoiceEnabled} 
                              onToggle={() => updateSetting('aiVoiceEnabled', !settings.aiVoiceEnabled)} 
                           />
                           <ToggleSetting 
                              label="Modo Desarrollador" 
                              description="Acceso a logs de API avanzados." 
                              active={settings.developerMode} 
                              onToggle={() => updateSetting('developerMode', !settings.developerMode)} 
                           />
                        </div>
                     </div>
                  </div>
               </div>

               <div className="glass-card p-8 border-indigo-500/10">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-sm font-black text-white uppercase tracking-tight">Región & Ecosistema</h3>
                     <Globe size={18} className="text-indigo-400" />
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                     <div>
                        <p className="text-xs font-bold text-white uppercase">Sovereign OS Local Mode</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Servidor Local Conectado</p>
                     </div>
                     <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20">Aprobado</span>
                  </div>
               </div>
             </>
           )}

           {activeTab === 'security' && (
             <div className="glass-card p-8 relative overflow-hidden space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                   <h2 className="text-xl font-black text-white uppercase tracking-tight">Seguridad Biometrica & Accesos</h2>
                   <Shield size={24} className="text-indigo-500" />
                </div>
                
                {isSaving && <span className="text-[10px] text-emerald-500 font-bold animate-pulse absolute right-8 top-24">Sincronizando...</span>}

                <div className="space-y-4">
                   <ToggleSetting 
                     label="Autenticación de 2 Factores (2FA)" 
                     description="Añade una capa de criptografía militar a tu cuenta." 
                     active={settings.twoFactorAuth} 
                     onToggle={() => updateSetting('twoFactorAuth', !settings.twoFactorAuth)} 
                   />
                   <ToggleSetting 
                     label="Bloqueo Neural" 
                     description="Cierra sesión si te alejas de tu dispositivo." 
                     active={settings.neuralLock} 
                     onToggle={() => updateSetting('neuralLock', !settings.neuralLock)}
                   />
                   <ToggleSetting 
                     label="Alertas de Nuevo Dispositivo" 
                     description="Te notificaremos si The Sovereign Core detecta actividad inusual." 
                     active={settings.newDeviceAlerts} 
                     onToggle={() => updateSetting('newDeviceAlerts', !settings.newDeviceAlerts)}
                   />
                </div>
                
                <div className="pt-6">
                   <button className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-xs font-black uppercase tracking-widest text-white transition-all w-full">
                      Actualizar Código de Acceso (Contraseña)
                   </button>
                </div>
             </div>
           )}

           {activeTab === 'notifications' && (
             <div className="glass-card p-8 relative overflow-hidden space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                   <h2 className="text-xl font-black text-white uppercase tracking-tight">Centro de Alertas</h2>
                   <Bell size={24} className="text-indigo-500" />
                </div>

                {isSaving && <span className="text-[10px] text-emerald-500 font-bold animate-pulse absolute right-8 top-24">Sincronizando...</span>}
                
                <div className="space-y-4">
                   <ToggleSetting 
                     label="Alertas de Vencimiento de Impuestos" 
                     description="DGII Form 606 y 607 resúmenes mensuales." 
                     active={settings.taxAlerts} 
                     onToggle={() => updateSetting('taxAlerts', !settings.taxAlerts)}
                   />
                   <ToggleSetting 
                     label="Actividad del MarketPlace" 
                     description="Notificaciones si alguien compra tus activos." 
                     active={settings.marketAlerts} 
                     onToggle={() => updateSetting('marketAlerts', !settings.marketAlerts)}
                   />
                   <ToggleSetting 
                     label="Actualizaciones de The Sovereign Core" 
                     description="Recibe intel sobre nuevas funciones de IA." 
                     active={settings.coreUpdates} 
                     onToggle={() => updateSetting('coreUpdates', !settings.coreUpdates)}
                   />
                </div>
             </div>
           )}
         </div>
      </div>
    </motion.div>
  );
}

function ProfileTab({ active, onClick, label, icon }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase tracking-widest text-[10px] ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
    >
       {icon} {label}
    </button>
  );
}

function ProfileField({ label, value, icon }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{label}</label>
      <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-slate-300">
         <span className="text-slate-500">{icon}</span>
         {value}
      </div>
    </div>
  );
}

function ToggleSetting({ label, description, active, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors" onClick={onToggle}>
      <div>
         <p className="text-xs font-bold text-white uppercase">{label}</p>
         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{description}</p>
      </div>
      <div className={`w-12 h-6 rounded-full p-1 transition-all ${active ? 'bg-indigo-600' : 'bg-slate-800'}`}>
         <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
    </div>
  );
}
