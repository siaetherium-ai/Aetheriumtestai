import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Plus, Clock, ChevronRight, Hash } from 'lucide-react';

interface Conversation {
  id: string;
  topic: string;
  updatedAt: string;
}

interface Props {
  apiFetch: any;
  onSelect: (id: string) => void;
  activeId: string | null;
  onNew: () => void;
}

export default function ConversationSidebar({ apiFetch, onSelect, activeId, onNew }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const data = await apiFetch('/api/conversations');
      if (Array.isArray(data)) {
        setConversations(data);
      } else {
        console.warn("API returned non-array data for conversations:", data);
        setConversations([]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 border-r border-white/5 bg-black/40 backdrop-blur-3xl flex flex-col h-full overflow-hidden shrink-0">
      <div className="p-6 border-b border-white/5 bg-gradient-to-br from-indigo-900/10 to-red-900/10">
        <button 
          onClick={onNew}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-red-600 hover:from-indigo-500 hover:to-red-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
        >
          <Plus size={16} /> Nueva Consulta
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
          <span>Historial Reciente</span>
          <Clock size={10} />
        </div>

        {loading ? (
          <div className="space-y-2 px-3">
             {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />
             ))}
          </div>
        ) : (!Array.isArray(conversations) || conversations.length === 0) ? (
          <div className="p-8 text-center">
             <MessageSquare size={32} className="mx-auto text-slate-700 mb-4 opacity-20" />
             <p className="text-[10px] text-slate-500 uppercase font-bold">Sin conversaciones previas</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <motion.button
              key={conv.id}
              whileHover={{ x: 4 }}
              onClick={() => onSelect(conv.id)}
              className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all group ${
                activeId === conv.id 
                  ? 'bg-red-600/10 border border-red-600/20' 
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                activeId === conv.id ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-500 group-hover:text-white group-hover:bg-red-600/20'
              }`}>
                <Hash size={14} />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`text-xs font-bold truncate ${activeId === conv.id ? 'text-white' : 'text-slate-400'}`}>
                  {conv.topic}
                </p>
                <p className="text-[9px] text-slate-600 font-medium mt-0.5">
                  {new Date(conv.updatedAt).toLocaleDateString()} • {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {activeId === conv.id && (
                <ChevronRight size={14} className="text-red-500" />
              )}
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
