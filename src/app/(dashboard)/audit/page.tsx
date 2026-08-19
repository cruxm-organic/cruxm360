'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  Timer, 
  Activity, 
  Globe, 
  AlertTriangle,
  Monitor,
  Search,
  BookOpen,
  ArrowRight,
  Target,
  Layout,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuditHub() {
   const [filter, setFilter] = useState('ALL');
   const [activeDomain, setActiveDomain] = useState('');
   const [isLoading, setIsLoading] = useState(true);
   const [auditData, setAuditData] = useState<any>(null);

   useEffect(() => {
      const domain = localStorage.getItem('active_domain') || 'cruxm.com';
      setActiveDomain(domain);

      const fetchAudit = async () => {
         setIsLoading(true);
         try {
            const res = await fetch(`/api/project-data?domain=${domain}`);
            const data = await res.json();
            setAuditData(data);
         } catch (e) {
            console.error('Audit Fetch Error');
         } finally {
            setIsLoading(false);
         }
      };

      fetchAudit();
   }, []);

   return (
      <div className="relative min-h-screen bg-[#050A0F] text-white p-6 md:p-10 selection:bg-teal-400 selection:text-black italic">
         
         <div className="relative z-10 max-w-[1600px] mx-auto space-y-12 pb-32 italic">
            
            {/* Audit Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10 italic">
               <div className="italic">
                  <div className="flex items-center gap-3 mb-4 italic italic">
                     <span className="bg-emerald-400/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border border-emerald-400/20 italic italic italic">On-Page Optimizer</span>
                     <span className="text-white/20 text-[10px] uppercase font-black tracking-widest italic italic italic">Neural Audit Suite</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none italic italic">
                     Technical <span className="text-white/40 italic italic italic">SEO Audit</span>
                  </h1>
                  <p className="text-white/40 text-sm font-medium mt-4 italic italic italic italic">Analyzing core web vitals and on-page SEO compliance for <span className="text-white font-bold italic italic">{activeDomain}</span></p>
               </div>
               
               <div className="flex gap-4 italic italic">
                  <button className="bg-white text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-teal-400 transition-all shadow-xl shadow-white/5 italic italic italic">
                     <Activity size={14} /> EXPORT_AUDIT_REPORT
                  </button>
               </div>
            </header>

            <AnimatePresence mode="wait">
               {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-40 italic">
                     <Loader2 className="animate-spin text-teal-400 mb-4" size={48} />
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 italic">Synthesizing Neural Findings...</p>
                  </div>
               ) : (
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-12 italic italic italic italic"
                  >
                     {/* Health Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 italic">
                        <HealthCard label="Performance Score" value={auditData?.project?.score || 0} color="text-teal-400" icon={<Zap />} />
                        <HealthCard label="SEO Accessibility" value={auditData?.project?.score > 80 ? 94 : 61} color="text-purple-400" icon={<Search />} />
                        <HealthCard label="Compliance Grade" value={auditData?.issues?.length > 10 ? 68 : 92} color="text-orange-400" icon={<Monitor />} />
                     </div>

                     {/* Findings List */}
                     <div className="space-y-6 italic">
                        <div className="flex justify-between items-end italic italic">
                           <div className="italic italic italic">
                              <h3 className="text-2xl font-black uppercase tracking-tighter italic italic italic italic">Prioritized Fixes</h3>
                              <p className="text-white/40 text-sm italic italic italic italic italic">Technical SEO fractures detected on {activeDomain}</p>
                           </div>
                           <div className="flex gap-3 italic italic italic italic">
                              {['ALL', 'ERROR', 'WARNING'].map(f => (
                                 <button 
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={clsx(
                                       "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all",
                                       filter === f ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white"
                                    )}
                                 >{f}</button>
                              ))}
                           </div>
                        </div>

                        <div className="space-y-4 italic italic">
                           {auditData?.issues?.filter((i:any) => filter === 'ALL' || i.type.toUpperCase() === filter).map((issue: any) => (
                              <div key={issue.id} className="group flex flex-col md:flex-row items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/5 transition-all italic italic italic italic">
                                 <div className="flex items-center gap-8 italic italic italic italic italic">
                                    <div className={clsx(
                                       "w-14 h-14 rounded-2xl flex items-center justify-center italic italic italic italic italic italic",
                                       issue.type === 'error' ? "bg-orange-400/10 text-orange-400" : "bg-purple-400/10 text-purple-400"
                                    )}>
                                       {issue.type === 'error' ? <ShieldAlert size={28} /> : <AlertTriangle size={28} />}
                                    </div>
                                    <div className="italic italic italic italic italic italic">
                                       <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1 italic italic italic italic italic italic italic">CATEGORY: {issue.category}</p>
                                       <h4 className="text-xl font-black uppercase tracking-tighter italic italic italic italic italic italic italic italic italic">{issue.message}</h4>
                                       <p className="text-sm text-white/40 font-medium italic italic italic italic italic italic italic italic italic">Target: <span className="text-white italic italic italic italic italic italic italic italic italic italic italic">{activeDomain}</span></p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-8 mt-6 md:mt-0 italic italic italic italic italic italic">
                                    <div className="text-right italic italic italic italic italic italic italic">
                                       <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1 italic italic italic italic italic italic italic italic">NEURAL FIX RECOMMENDED</p>
                                       <p className="text-sm font-bold italic italic italic italic italic italic italic italic italic italic max-w-xs">{issue.fix}</p>
                                    </div>
                                    <button className="p-4 bg-white/5 group-hover:bg-white group-hover:text-black rounded-2xl transition-all h-full italic italic italic italic italic italic italic italic">
                                       <ChevronRight size={20} />
                                    </button>
                                 </div>
                              </div>
                           ))}
                           {(!auditData?.issues || auditData.issues.length === 0) && (
                              <div className="text-center py-20 italic">
                                 <CheckCircle2 size={48} className="mx-auto text-teal-400 mb-4 italic" />
                                 <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/20 italic">Zero Critical Issues Detected</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

         </div>
      </div>
   );
}

function HealthCard({ label, value, color, icon }: any) {
   return (
      <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-white/10 transition-all italic italic italic">
         <div className="absolute top-[-10px] left-[-10px] opacity-10 italic italic italic italic">
            <div className={clsx("text-[120px] italic italic italic italic italic", color)}>{icon}</div>
         </div>
         <div className="relative z-10 italic italic italic italic">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6 italic italic italic italic italic">{label}</p>
            <div className="flex items-end gap-3 italic italic italic italic italic italic">
               <span className={clsx("text-5xl font-black italic italic italic italic italic italic italic italic italic", color)}>{value}</span>
               <span className={clsx("text-lg font-black opacity-40 mb-2 italic italic italic italic italic italic italic italic italic italic")}>/100</span>
            </div>
            <div className="mt-8 h-2 bg-white/5 rounded-full overflow-hidden italic italic italic italic italic italic italic">
               <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={clsx("h-full italic italic italic italic italic italic italic italic italic italic", color === 'text-teal-400' ? 'bg-teal-400 shadow-[0_0_15px_#2DD4BF]' : color === 'text-purple-400' ? 'bg-purple-400 shadow-[0_0_15px_#A855F7]' : 'bg-orange-400 shadow-[0_0_15px_#FB923C]')}
               />
            </div>
         </div>
      </div>
   );
}
