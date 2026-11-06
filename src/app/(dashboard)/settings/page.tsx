'use client';

import { useState } from 'react';
import { useStoredDomain } from '@/lib/hooks/use-stored-domain';
import { 
  Settings, 
  Shield, 
  Database, 
  Globe, 
  User, 
  Lock, 
  Bell, 
  Zap, 
  Cpu, 
  Activity, 
  Terminal, 
  Save, 
  Trash2, 
  RefreshCcw,
  CheckCircle2,
  ChevronRight,
  Monitor,
  Cloud,
  Key,
  Box,
  Layout,
  Command,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
   const stored = useStoredDomain();
   // Typed input wins; until the user edits it, show the saved active domain.
   const [domainInput, setDomain] = useState<string | null>(null);
   const domain = domainInput ?? stored ?? '';
   const [saving, setSaving] = useState(false);
   const [activeTab, setActiveTab] = useState('General');

   const saveSettings = () => {
      setSaving(true);
      setTimeout(() => {
         setSaving(false);
         localStorage.setItem('active_domain', domain);
      }, 1500);
   };

   return (
      <div className="relative min-h-screen bg-[#050A0F] text-white p-6 md:p-10 selection:bg-teal-400 selection:text-black italic">
         {/* Background Accents */}
         <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-500" />
            <div className="absolute inset-0 bg-grid opacity-5" />
         </div>

         <div className="relative z-10 max-w-[1600px] mx-auto space-y-12 pb-32 italic">
            {/* Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/10 pb-12 italic">
               <div>
                  <div className="flex items-center gap-3 mb-4 italic">
                     <span className="bg-white/10 text-white/40 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border border-white/10 italic italic">Config v4.2</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none mb-4 italic italic">
                     System <span className="bg-gradient-to-r from-white/40 to-white bg-clip-text text-transparent italic italic italic">Configuration</span>
                  </h1>
                  <p className="text-white/40 text-sm font-medium italic italic italic">Manage operational parameters and identity nodes.</p>
               </div>
               
               <div className="flex gap-4 italic">
                  <button 
                     onClick={saveSettings}
                     disabled={saving}
                     className="bg-white text-black px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-teal-400 transition-all shadow-xl shadow-white/5 italic italic italic"
                  >
                     {saving ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />} 
                     {saving ? 'SYNCING_NODES' : 'SAVE_CHANGES'}
                  </button>
               </div>
            </header>

            {/* Settings Layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 italic">
               
               {/* Sidebar Nav */}
               <div className="md:col-span-3 space-y-2 italic">
                  <h4 className="text-[10px] font-black uppercase opacity-20 tracking-[0.4em] mb-6 block italic italic italic">Config Modules</h4>
                  {['General', 'Security', 'Database', 'Api Sync', 'Infrastructure'].map((tab) => (
                     <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(
                           "w-full flex items-center justify-between px-6 py-4 rounded-xl transition-all font-black text-[11px] uppercase tracking-widest italic italic",
                           activeTab === tab ? "bg-white text-black shadow-lg" : "bg-white/[0.02] border border-white/10 text-white/40 hover:bg-white/5 hover:text-white"
                        )}
                     >
                        {tab} <ChevronRight size={14} className={activeTab === tab ? "opacity-100" : "opacity-0"} />
                     </button>
                  ))}
               </div>

               {/* Main Form */}
               <div className="md:col-span-9 space-y-12 italic">
                  
                  {/* General Config Section */}
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 italic italic">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 italic italic italic">
                        <ConfigInput 
                           label="Discovery Target Domain" 
                           description="Primary operational URL for neural crawling."
                           value={domain}
                           onChange={setDomain}
                           placeholder="domain.com"
                        />
                        <ConfigInput 
                           label="Identity Alias" 
                           description="Custom label for the discovery session."
                           placeholder="CruxM_Session_01"
                        />
                     </div>

                     <div className="pt-12 border-t border-white/5 grid grid-cols-1 lg:grid-cols-2 gap-10 italic italic italic">
                        <ConfigToggle 
                           label="Neural Proxy Sync" 
                           description="Use distributed nodes to bypass regional crawling blocks."
                           enabled
                        />
                        <ConfigToggle 
                           label="Recursive Discovery" 
                           description="Follow internal links to map sub-node architecture automatically."
                           enabled
                        />
                        <ConfigToggle 
                           label="Realtime Analytics" 
                           description="Maintain persistent WebSocket connection for live telemetry."
                           enabled
                        />
                         <ConfigToggle 
                           label="Edge Caching" 
                           description="Optimize report stability using global edge caching nodes."
                           enabled={false}
                        />
                     </div>
                  </div>

                  {/* Danger Zone */}
                  {activeTab === 'General' && (
                     <div className="pt-12 border-t border-white/5 space-y-6 italic">
                        <div className="flex items-start gap-6 border border-orange-400/20 bg-orange-400/5 p-8 rounded-2xl italic italic italic">
                           <div className="bg-orange-400 text-white p-3 rounded-xl shadow-lg shadow-orange-400/20 italic italic italic italic">
                              <Trash2 size={24} />
                           </div>
                           <div>
                              <h4 className="text-xl font-black italic tracking-tighter uppercase italic italic italic italic italic">Purge Operational Data</h4>
                              <p className="text-sm text-white/40 mt-2 font-medium italic italic italic italic italic">This will permanently delete all discovery nodes, keyword SERP maps, and integrity logs for {domain}.</p>
                              <button className="mt-6 bg-orange-500 hover:bg-orange-400 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic italic italic italic italic">
                                Initialize Purge Sequence
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

               </div>
            </div>

         </div>
      </div>
   );
}

interface ConfigInputProps {
   label: string;
   description: string;
   value?: string;
   onChange?: (value: string) => void;
   placeholder?: string;
}

function ConfigInput({ label, description, value, onChange, placeholder }: ConfigInputProps) {
   return (
      <div className="space-y-4 group italic italic italic">
         <div className="space-y-1">
            <h4 className="text-sm font-black uppercase tracking-tight group-hover:text-teal-400 transition-colors italic italic italic italic">{label}</h4>
            <p className="text-xs text-white/40 font-medium italic italic italic italic italic">{description}</p>
         </div>
         <div className="relative">
            <input 
               type="text" 
               value={value}
               onChange={(e) => onChange?.(e.target.value)}
               placeholder={placeholder}
               className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-xl text-sm font-bold outline-none focus:border-teal-400/30 transition-all placeholder:opacity-20 italic italic italic italic italic italic"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 italic italic italic italic italic italic italic">
               <Command size={14} />
            </div>
         </div>
      </div>
   );
}

interface ConfigToggleProps {
   label: string;
   description: string;
   enabled?: boolean;
}

function ConfigToggle({ label, description, enabled = false }: ConfigToggleProps) {
   const [isOn, setIsOn] = useState(enabled);

   return (
      <div className="flex items-center justify-between group cursor-pointer italic italic italic" onClick={() => setIsOn(!isOn)}>
         <div className="space-y-1 max-w-[80%] italic italic italic italic">
            <h4 className="text-sm font-black uppercase tracking-tight group-hover:text-teal-400 transition-colors italic italic italic italic italic">{label}</h4>
            <p className="text-xs text-white/40 font-medium italic italic italic italic italic italic">{description}</p>
         </div>
         <div className={clsx(
            "w-12 h-6 rounded-full relative transition-all duration-300 italic italic italic italic italic italic italic",
            isOn ? "bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.3)]" : "bg-white/10"
         )}>
            <motion.div 
               animate={{ x: isOn ? 24 : 2 }}
               transition={{ type: "spring", stiffness: 500, damping: 30 }}
               className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
            />
         </div>
      </div>
   );
}
