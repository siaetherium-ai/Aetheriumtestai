import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Search, 
  CreditCard, 
  TrendingUp, 
  ShieldCheck, 
  FileText,
  DollarSign,
  Briefcase,
  ChevronRight,
  UserPlus
} from 'lucide-react';

interface PayrollViewProps {
  companyId: string;
  apiFetch: (url: string, options?: any) => Promise<any>;
}

export default function PayrollView({ companyId, apiFetch }: PayrollViewProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [payrollHistory, setPayrollHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'employees' | 'payroll'>('employees');
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);

  // Form states
  const [newEmployee, setNewEmployee] = useState({
    fullName: '',
    rnc: '',
    position: '',
    salary: ''
  });

  useEffect(() => {
    fetchData();
  }, [companyId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [empRes, payRes] = await Promise.all([
        apiFetch(`/api/employees?companyId=${companyId}`),
        apiFetch(`/api/payroll?companyId=${companyId}`)
      ]);
      const empData = await empRes.json();
      const payData = await payRes.json();
      setEmployees(Array.isArray(empData) ? empData : []);
      setPayrollHistory(Array.isArray(payData) ? payData : []);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEmployee, companyId })
      });
      if (res.ok) {
        setIsAddEmployeeModalOpen(false);
        setNewEmployee({ fullName: '', rnc: '', position: '', salary: '' });
        fetchData();
      }
    } catch (error) {
      console.error("Error adding employee:", error);
    }
  };

  const calculateTSS = (salary: number) => {
    const sfs = salary * 0.0304;
    const afp = salary * 0.0287;
    // ISR simplified scale
    let isr = 0;
    const taxable = salary - sfs - afp;
    if (taxable > 34685 && taxable <= 52027) isr = (taxable - 34685) * 0.15;
    else if (taxable > 52027 && taxable <= 72260) isr = 2601 + (taxable - 52027) * 0.20;
    else if (taxable > 72260) isr = 6648 + (taxable - 72260) * 0.25;

    return { sfs, afp, isr, net: taxable - isr };
  };

  const handleProcessPayroll = async (employee: any) => {
    const { sfs, afp, isr, net } = calculateTSS(employee.salary);
    try {
      const res = await apiFetch('/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId,
          employeeId: employee.id,
          month: new Date().toLocaleString('es-DO', { month: 'long' }),
          year: new Date().getFullYear(),
          grossSalary: employee.salary,
          sfs,
          afp,
          isr,
          netSalary: net
        })
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error processing payroll:", error);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
               <Users className="text-indigo-400" size={24} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Capital <span className="text-indigo-500">Humano</span></h1>
          </div>
          <p className="text-slate-500 font-medium ml-1">Gestión de nómina, retenciones de TSS y reportes SIRLA.</p>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('employees')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'employees' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
          >
            Personal
          </button>
          <button 
            onClick={() => setActiveTab('payroll')}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'payroll' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
          >
            Nómina Consolidada
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <MetricCard label="Colaboradores" value={employees.length} icon={<Users size={18} />} color="indigo" />
         <MetricCard label="Carga Salarial" value={`$${employees.reduce((acc, e) => acc + (e.salary || 0), 0).toLocaleString()}`} icon={<DollarSign size={18} />} color="emerald" />
         <MetricCard label="Retenciones TSS" value={`$${payrollHistory.reduce((acc, p) => acc + (p.sfs + p.afp), 0).toLocaleString()}`} icon={<ShieldCheck size={18} />} color="amber" />
         <MetricCard label="Efectivo Neto" value={`$${payrollHistory.reduce((acc, p) => acc + (p.netSalary), 0).toLocaleString()}`} icon={<CreditCard size={18} />} color="violet" />
      </div>

      <div className="bg-[#030816]/60 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
         <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">
              {activeTab === 'employees' ? 'Lista de Colaboradores' : 'Historial de Pagos'}
            </h3>
            {activeTab === 'employees' && (
              <button 
                onClick={() => setIsAddEmployeeModalOpen(true)}
                className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-xs font-black uppercase tracking-widest"
              >
                <UserPlus size={16} />
                Agregar Personal
              </button>
            )}
         </div>

         <div className="p-0 overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white/5">
                     <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Nombre / Posición</th>
                     {activeTab === 'employees' ? (
                       <>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Cédula / RNC</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Salario Bruto</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Acciones</th>
                       </>
                     ) : (
                       <>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Periodo</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">ISR</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Neto a Pagar</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Estado</th>
                       </>
                     )}
                  </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr><td colSpan={5} className="p-20 text-center"><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
                  ) : activeTab === 'employees' ? (
                    employees.map(emp => (
                      <tr key={emp.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-white uppercase tracking-tight">{emp.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase">{emp.position}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-400">{emp.rnc}</td>
                        <td className="px-8 py-5 text-xs font-black text-white">${emp.salary.toLocaleString()}</td>
                        <td className="px-8 py-5 text-right">
                           <button 
                             onClick={() => handleProcessPayroll(emp)}
                             className="bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                           >
                             Procesar Pago
                           </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    payrollHistory.map(pay => (
                      <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-white uppercase tracking-tight">{pay.employee?.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">${pay.grossSalary.toLocaleString()} Bruto</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-400 uppercase">{pay.month} {pay.year}</td>
                        <td className="px-8 py-5 text-xs font-bold text-rose-400">-${pay.isr.toLocaleString()}</td>
                        <td className="px-8 py-5 text-xs font-black text-emerald-400">${pay.netSalary.toLocaleString()}</td>
                        <td className="px-8 py-5">
                           <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-lg border border-emerald-500/20">Pagado</span>
                        </td>
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {isAddEmployeeModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f172a] border border-white/10 rounded-[2rem] p-8 w-full max-w-lg shadow-2xl relative"
            >
              <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-8">Nuebo <span className="text-indigo-500">Colaborador</span></h2>
              <form onSubmit={handleAddEmployee} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Nombre Completo</label>
                    <input required type="text" value={newEmployee.fullName} onChange={e => setNewEmployee({...newEmployee, fullName: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Cédula / Pasaporte</label>
                       <input required type="text" value={newEmployee.rnc} onChange={e => setNewEmployee({...newEmployee, rnc: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Salario Mensual</label>
                       <input required type="number" value={newEmployee.salary} onChange={e => setNewEmployee({...newEmployee, salary: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Posición / Cargo</label>
                    <input required type="text" value={newEmployee.position} onChange={e => setNewEmployee({...newEmployee, position: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                 </div>
                 <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-600/20 transition-all">Registrar en Nómina</button>
                 <button type="button" onClick={() => setIsAddEmployeeModalOpen(false)} className="w-full text-slate-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Cancelar</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ label, value, icon, color }: any) {
  const colors: any = {
    indigo: "from-indigo-600/10 to-indigo-600/5 text-indigo-400 border-indigo-500/20",
    emerald: "from-emerald-600/10 to-emerald-600/5 text-emerald-400 border-emerald-500/20",
    amber: "from-amber-600/10 to-amber-600/5 text-amber-400 border-amber-500/20",
    violet: "from-violet-600/10 to-violet-600/5 text-violet-400 border-violet-500/20"
  };

  return (
    <div className={`p-6 bg-gradient-to-br ${colors[color]} border rounded-[2rem] backdrop-blur-3xl`}>
       <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-white/5 rounded-xl">{icon}</div>
          <ChevronRight size={14} className="text-slate-600" />
       </div>
       <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 mb-1">{label}</p>
       <h3 className="text-xl font-black text-white">{value}</h3>
    </div>
  );
}
