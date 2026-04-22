import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Filter, 
  ChevronRight, 
  Star,
  Search,
  ShoppingCart,
  HardDrive,
  Rocket
} from 'lucide-react';

const SLAM_IN = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Marketplace() {
  const [activeCategory, setActiveCategory] = useState('All');

  const assets = [
    { id: 1, name: 'Neural Core v2.4', price: 'RD$ 45,000', category: 'IA', rating: 4.9, icon: <Cpu size={24} /> },
    { id: 2, name: 'Sovereign ERP Bundle', price: 'RD$ 120,000', category: 'Software', rating: 5.0, icon: <HardDrive size={24} /> },
    { id: 3, name: 'Aerospace Logic Unit', price: 'RD$ 850,000', category: 'Hardware', rating: 4.8, icon: <Rocket size={24} /> },
    { id: 4, name: 'Fiscal Automator Pro', price: 'RD$ 15,000', category: 'Fiscal', rating: 4.7, icon: <Zap size={24} /> },
  ];

  return (
    <motion.div {...SLAM_IN} className="space-y-10 pb-32">
      {/* Hero Section Red */}
      <div className="relative h-80 rounded-[3rem] overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-rose-950 -z-10" />
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] mix-blend-overlay opacity-20 group-hover:scale-105 transition-transform duration-1000" />
         <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl"
            >
               <ShoppingBag className="text-white" size={32} />
            </motion.div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">Aetherium <span className="text-red-400">Sovereign Red</span></h1>
            <p className="text-red-100/70 font-bold uppercase tracking-[0.4em] text-xs">Exclusividad en Activos Digitales & Aeroespaciales</p>
         </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-4">
         <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl overflow-x-auto max-w-full">
            {['All', 'IA', 'Software', 'Hardware', 'Fiscal'].map(cat => (
               <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-red-600 text-white shadow-xl shadow-red-600/30' : 'text-slate-500 hover:text-white'}`}
               >
                  {cat}
               </button>
            ))}
         </div>
         <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
               type="text" 
               placeholder="Buscar en el marketplace..." 
               className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-red-600/30 transition-all"
            />
         </div>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {assets.filter(a => activeCategory === 'All' || a.category === activeCategory).map(asset => (
            <motion.div 
               key={asset.id}
               whileHover={{ y: -10 }}
               className="bg-[#030816]/60 border border-white/5 p-6 rounded-[2.5rem] shadow-2xl backdrop-blur-xl group relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 p-10 bg-red-600/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-500 mb-6 border border-red-500/20 group-hover:scale-110 transition-transform duration-500">
                  {asset.icon}
               </div>

               <div className="flex items-center gap-1 mb-2">
                  <Star size={10} className="text-red-500 fill-red-500" />
                  <span className="text-[10px] font-black text-slate-400">{asset.rating}</span>
               </div>

               <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">{asset.name}</h3>
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-6">{asset.category}</p>

               <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Inversión</span>
                     <span className="text-sm font-black text-white">{asset.price}</span>
                  </div>
                  <button className="w-10 h-10 bg-white/5 hover:bg-red-600 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/10">
                     <ShoppingCart size={18} />
                  </button>
               </div>
            </motion.div>
         ))}
      </div>

      {/* Bottom Ad / Banner */}
      <div className="glass-card p-10 border-red-500/10 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-red-600/5 to-transparent">
         <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">¿Tienes Activos Propios?</h3>
            <p className="text-slate-500 font-medium">Publica tus desarrollos y obtén acceso al ecosistema Sovereign Global.</p>
         </div>
         <button className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all shadow-2xl">
            Registrar como Partner
         </button>
      </div>
    </motion.div>
  );
}
