import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  LayoutDashboard, 
  FileText, 
  Scale, 
  Zap, 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  User, 
  Gem, 
  ShieldAlert,
  Fingerprint,
  Menu,
  X,
  CreditCard,
  Target,
  Briefcase,
  Database,
  Hash,
  Shield,
  Bot,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LeadForm from './components/LeadForm';

// Modular Pages
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import FiscalAuditView from './pages/fiscal/FiscalAuditView';
import LegalLibraryView from './pages/legal/LegalLibraryView';
import EInvoicingView from './pages/fiscal/EInvoicingView';
import RNCSearch from './pages/RNCSearch';
import VoiceAI from './pages/VoiceAI';
import KnowledgeBase from './pages/KnowledgeBase';

// Specific Fiscal Sub-pages
import PayrollView from './pages/fiscal/PayrollView';
import FixedAssetsView from './pages/fiscal/FixedAssetsView';
import TaxRegistryView from './pages/fiscal/TaxRegistryView';
import NCFManagementView from './pages/fiscal/NCFManagementView';

// Core Core
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Marketplace from './pages/Marketplace';
import NotificationView from './pages/Notifications';
import TrialGuard from './components/TrialGuard';

export default function App() {
  const { user, logout, apiFetch, isAdmin, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      apiFetch('/api/companies')
        .then((res: any) => res.json())
        .then((data: any[]) => setCompanies(data))
        .catch(console.error);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl animate-pulse flex items-center justify-center">
             <Gem className="text-white" size={32} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-white text-xl font-black uppercase tracking-[0.3em] animate-pulse">Aetherium AI</h1>
            <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Neural Fiscal OS v2.0</p>
          </div>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard apiFetch={apiFetch} onNavigate={setCurrentPage} />;
      case 'companies':
        return <Companies apiFetch={apiFetch} onSelect={(id) => { setSelectedCompanyId(id); setCurrentPage('company-detail'); }} />;
      case 'company-detail':
        return <CompanyDetail id={selectedCompanyId!} apiFetch={apiFetch} onBack={() => setCurrentPage('companies')} onNavigate={setCurrentPage} />;
      case 'audit':
        return <FiscalAuditView companyId={selectedCompanyId!} apiFetch={apiFetch} />;
      case 'lex-db':
        return <LegalLibraryView companyId={selectedCompanyId} apiFetch={apiFetch} />;
      case 'e-invoicing':
        return <EInvoicingView companyId={selectedCompanyId!} apiFetch={apiFetch} />;
      case 'rnc-search':
        return <RNCSearch apiFetch={apiFetch} />;
      case 'voice-ai':
        return <VoiceAI apiFetch={apiFetch} companyId={selectedCompanyId} />;
      case 'knowledge-base':
        return <KnowledgeBase apiFetch={apiFetch} companyId={selectedCompanyId} />;
      case 'payroll':
        return <PayrollView companyId={selectedCompanyId!} apiFetch={apiFetch} />;
      case 'assets':
        return <FixedAssetsView companyId={selectedCompanyId!} apiFetch={apiFetch} />;
      case 'registries':
        return <TaxRegistryView companyId={selectedCompanyId!} apiFetch={apiFetch} />;
      case 'ncf':
        return <NCFManagementView companyId={selectedCompanyId!} apiFetch={apiFetch} />;
      case 'admin':
        return <AdminDashboard apiFetch={apiFetch} />;
      case 'profile':
        return <Profile apiFetch={apiFetch} />;
      case 'marketplace':
        return <Marketplace />;
      case 'notifications':
        return <NotificationView apiFetch={apiFetch} />;
      default:
        return <Dashboard apiFetch={apiFetch} onNavigate={setCurrentPage} />;
    }
  };

  const company = selectedCompanyId ? companies.find(c => c.id === selectedCompanyId) : null;

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LeadForm onSuccess={() => {}} />} />
        <Route path="/admin-login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <TrialGuard>
      <div className="min-h-screen bg-[#020617] text-slate-200 font-inter selection:bg-indigo-500/30">
            {/* Dashboard HUD Sidebar */}
            <motion.aside 
              initial={false}
              animate={{ width: isSidebarOpen ? 280 : 80 }}
              className="fixed left-0 top-0 h-full bg-[#030816]/80 backdrop-blur-3xl border-r border-white/5 z-50 flex flex-col shadow-2xl transition-all duration-300"
            >
              <div className="p-6 flex items-center justify-between">
                 <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
                    <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/20">
                       <Gem size={22} className="group-hover:rotate-12 transition-transform" />
                    </div>
                    <div>
                      <h1 className="text-sm font-black tracking-widest text-white uppercase group-hover:tracking-[0.2em] transition-all duration-500">Aetherium</h1>
                      <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest opacity-60">Neural Engine</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2.5 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all shadow-inner border border-white/5"
                 >
                   {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                 </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                 <div className={`px-4 pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ${!isSidebarOpen && 'hidden'}`}>
                    Operativa
                 </div>
                 <NavItem 
                   active={currentPage === 'dashboard'} 
                   onClick={() => setCurrentPage('dashboard')} 
                   icon={<LayoutDashboard size={20} />} 
                   label="Command Center" 
                   collapsed={!isSidebarOpen} 
                 />
                 <NavItem 
                   active={currentPage === 'companies'} 
                   onClick={() => setCurrentPage('companies')} 
                   icon={<Building2 size={20} />} 
                   label="Entidades" 
                   collapsed={!isSidebarOpen} 
                 />
                 
                 <div className={`pt-8 pb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ${!isSidebarOpen && 'hidden'}`}>
                    Cumplimiento
                 </div>
                 
                 <NavItem 
                   active={currentPage === 'audit'} 
                   onClick={() => setCurrentPage('audit')} 
                   icon={<ShieldAlert size={20} />} 
                   label="Auditoría Cruzada" 
                   collapsed={!isSidebarOpen} 
                   locked={!selectedCompanyId}
                 />
                 <NavItem 
                   active={currentPage === 'e-invoicing'} 
                   onClick={() => setCurrentPage('e-invoicing')} 
                   icon={<Fingerprint size={20} />} 
                   label="E-Facturación" 
                   collapsed={!isSidebarOpen} 
                   locked={!selectedCompanyId}
                 />
                 <NavItem 
                   active={currentPage === 'registries'} 
                   onClick={() => setCurrentPage('registries')} 
                   icon={<FileText size={20} />} 
                   label="Libros 606 / 607" 
                   collapsed={!isSidebarOpen} 
                   locked={!selectedCompanyId}
                 />
                 <NavItem 
                   active={currentPage === 'ncf'} 
                   onClick={() => setCurrentPage('ncf')} 
                   icon={<Hash size={20} />} 
                   label="Secuencias NCF" 
                   collapsed={!isSidebarOpen} 
                   locked={!selectedCompanyId}
                 />
                 <NavItem 
                   active={currentPage === 'contracts'} 
                   onClick={() => setCurrentPage('contracts')} 
                   icon={<Scale size={20} />} 
                   label="Legal & LEX-DB" 
                   collapsed={!isSidebarOpen} 
                 />
                 <NavItem 
                   active={currentPage === 'rnc-search'} 
                   onClick={() => setCurrentPage('rnc-search')} 
                   icon={<Search size={20} />} 
                   label="Consulta RNC" 
                   collapsed={!isSidebarOpen} 
                 />

                 <div className={`pt-8 pb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ${!isSidebarOpen && 'hidden'}`}>
                    Cerebro Global
                 </div>
                 {isAdmin && (
                   <NavItem 
                     active={currentPage === 'admin'} 
                     onClick={() => setCurrentPage('admin')} 
                     icon={<ShieldAlert size={20} />} 
                     label="Sovereign Core (Admin)" 
                     collapsed={!isSidebarOpen} 
                   />
                 )}
                 <NavItem 
                   active={currentPage === 'voice-ai'} 
                   onClick={() => setCurrentPage('voice-ai')} 
                   icon={<Bot size={20} />} 
                   label="Neural Call AI" 
                   collapsed={!isSidebarOpen} 
                 />
                 <NavItem 
                   active={currentPage === 'marketplace'} 
                   onClick={() => setCurrentPage('marketplace')} 
                   icon={<ShoppingBag size={20} />} 
                   label="Marketplace Red" 
                   collapsed={!isSidebarOpen} 
                 />
                 <NavItem 
                   active={currentPage === 'knowledge-base'} 
                   onClick={() => setCurrentPage('knowledge-base')} 
                   icon={<Database size={20} />} 
                   label="Base de Conocimiento" 
                   collapsed={!isSidebarOpen} 
                 />

                 <div className={`pt-8 pb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 ${!isSidebarOpen && 'hidden'}`}>
                    Operaciones
                 </div>
                 <NavItem 
                   active={currentPage === 'payroll'} 
                   onClick={() => setCurrentPage('payroll')} 
                   icon={<CreditCard size={20} />} 
                   label="Nómina & TSS" 
                   collapsed={!isSidebarOpen} 
                   locked={!selectedCompanyId}
                 />
                 <NavItem 
                   active={currentPage === 'assets'} 
                   onClick={() => setCurrentPage('assets')} 
                   icon={<Briefcase size={20} />} 
                   label="Activos Fijos" 
                   collapsed={!isSidebarOpen} 
                   locked={!selectedCompanyId}
                 />
              </nav>

              <div className="p-4 border-t border-white/5">
                 <div className={`p-4 bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border border-indigo-500/20 rounded-2xl mb-4 ${!isSidebarOpen && 'hidden'}`}>
                    <div className="flex items-center gap-2 mb-2">
                       <Gem size={14} className="text-indigo-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Elite OS v2.0</span>
                    </div>
                    <p className="text-[9px] text-slate-500 leading-relaxed font-medium">Dominican Fiscal Intelligence active for {user?.fullName}.</p>
                 </div>
                 <button 
                   onClick={logout}
                   className="w-full flex items-center gap-3 p-4 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
                 >
                   <LogOut size={20} />
                   {isSidebarOpen && <span className="font-bold text-xs uppercase tracking-widest">Desconectar</span>}
                 </button>
              </div>
            </motion.aside>

            {/* Main Content */}
            <main className={`transition-all duration-300 min-h-screen ${isSidebarOpen ? 'pl-[280px]' : 'pl-[80px]'}`}>
               {/* Top Header */}
               <header className="h-20 bg-[#020617]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-10 sticky top-0 z-40">
                  <div className="flex items-center gap-6">
                      {company && (
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
                           <Building2 size={14} className="text-indigo-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">{company.name}</span>
                        </div>
                      )}
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="text" placeholder="Comando global..." className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-indigo-500 outline-none w-64" />
                     </div>
                     <button 
                        onClick={() => setCurrentPage('notifications')}
                        className={`relative p-2 transition-colors ${currentPage === 'notifications' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'}`}
                     >
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020617]" />
                     </button>
                     <div className="h-8 w-px bg-white/5" />
                     <div 
                        onClick={() => setCurrentPage('profile')}
                        className={`flex items-center gap-3 p-1.5 pr-4 rounded-2xl border transition-all cursor-pointer group ${currentPage === 'profile' ? 'bg-indigo-600 border-indigo-400 shadow-lg shadow-indigo-600/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                     >
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center border border-white/10 text-indigo-400 group-hover:scale-105 transition-transform">
                           <User size={20} />
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-black text-white">{user?.fullName}</p>
                           <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-indigo-300 transition-colors">{user?.role}</p>
                        </div>
                     </div>
                  </div>
               </header>

               {/* Page Content */}
               <div className="p-10 max-w-7xl mx-auto">
                  <ErrorBoundary>
                     <AnimatePresence mode="wait">
                        <motion.div
                          key={currentPage + (selectedCompanyId || '')}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                        >
                           {renderPage()}
                        </motion.div>
                     </AnimatePresence>
                  </ErrorBoundary>
               </div>
            </main>
          </div>
    </TrialGuard>
  );
}

function NavItem({ active, onClick, icon, label, collapsed, locked }: any) {
  return (
    <button 
      disabled={locked}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-2xl transition-all relative group",
        active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-500 hover:bg-white/5 hover:text-white",
        locked && "opacity-20 cursor-not-allowed filter grayscale"
      )}
    >
      <div className={cn("shrink-0 transition-transform group-hover:scale-110", active && "scale-110")}>
        {icon}
      </div>
      {!collapsed && <span className="font-bold text-xs tracking-wide uppercase">{label}</span>}
      {locked && !collapsed && <span className="ml-auto text-[8px] bg-slate-800 px-1.5 py-0.5 rounded uppercase">Seleccionar</span>}
      {active && (
        <motion.div layoutId="nav-pill" className="absolute right-0 w-1 h-6 bg-white rounded-l-full" />
      )}
    </button>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-rose-500/10 border border-rose-500/20 rounded-[2rem] text-center">
          <ShieldAlert size={48} className="mx-auto text-rose-500 mb-4" />
          <h1 className="text-2xl font-black text-white uppercase tracking-tight mb-2">Colapso de Componente Neural</h1>
          <p className="text-slate-400 mb-6 font-medium text-sm">El subsistema gráfico ha detectado una excepción severa y ha detenido el renderizado para proteger la memoria.</p>
          <div className="bg-slate-900/50 p-4 rounded-xl text-left text-rose-400 text-xs font-mono overflow-auto mb-6">
            {this.state.error?.toString()}
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-rose-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px]"
          >
            Reiniciar Interfaz
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
