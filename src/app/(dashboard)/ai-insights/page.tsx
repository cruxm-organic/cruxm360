'use client';

import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  Search, 
  Zap, 
  BarChart3, 
  Plus, 
  ChevronRight, 
  CheckCircle2, 
  ArrowUpRight, 
  MessageSquare,
  Globe,
  Star,
  Flame,
  Layout,
  FileText,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import { useStoredDomain } from '@/lib/hooks/use-stored-domain';
import type { ProjectData } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIInsights() {
   const stored = useStoredDomain();
   const activeDomain = stored === undefined ? '' : (stored || 'cruxm.com');
   const [isLoading, setIsLoading] = useState(true);
   const [projectData, setProjectData] = useState<ProjectData | null>(null);

   useEffect(() => {
     if (!activeDomain) return;
     const fetchStrategy = async () => {
        setIsLoading(true);
        try {
           const res = await fetch(`/api/project-data?domain=${encodeURIComponent(activeDomain)}`);
           const data: ProjectData = await res.json();
           setProjectData(data);
        } catch {
           console.error('Fetch Failed');
        } finally {
           setIsLoading(false);
        }
     };

     fetchStrategy();
   }, [activeDomain]);

   return (
      <div className="relative min-h-screen bg-[#050A0F] text-white p-6 md:p-10 selection:bg-teal-400 selection:text-black italic">
         
         <div className="relative z-10 max-w-[1600px] mx-auto space-y-12 pb-32 italic">
            
            {/* Strategy Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/5 pb-10 italic">
               <div className="italic">
                  <div className="flex items-center gap-3 mb-4 italic italic">
                     <span className="bg-fuchsia-400/10 text-fuchsia-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border border-fuchsia-400/20 italic italic italic">Predictive Intelligence</span>
                     <span className="text-white/20 text-[10px] uppercase font-black tracking-widest italic italic italic">Neural Strategy roadmap</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none italic italic">
                     Growth <span className="text-white/40 italic italic italic">Strategy roadmap</span>
                  </h1>
                  <p className="text-white/40 text-sm font-medium mt-4 italic italic italic italic">AI-driven projections and competitive content gap analysis for <span className="text-white font-bold italic italic">{activeDomain}</span></p>
               </div>
               
               <div className="flex gap-4 italic italic">
                  <button className="bg-white text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-teal-400 transition-all shadow-xl shadow-white/5 italic italic italic">
                     <Sparkles size={14} /> GENERATE_GROWTH_PLAN
                  </button>
               </div>
            </header>

            <AnimatePresence mode="wait">
               {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-40 italic">
                     <Loader2 className="animate-spin text-fuchsia-400 mb-4" size={48} />
                     <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Architecting Growth Vectors...</p>
                  </div>
               ) : (
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="grid grid-cols-1 md:grid-cols-12 gap-12 italic"
                  >
                     {/* Action List */}
                     <div className="md:col-span-8 space-y-8 italic">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Strategic Growth Milestones</h3>
                        
                        <div className="space-y-4 italic">
                           {/* Real specific insight based on audit results if available */}
                           <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/5 transition-all italic">
                              <div className="flex items-start gap-8 italic">
                                 <div className="w-16 h-16 bg-fuchsia-400/10 text-fuchsia-400 rounded-2xl flex items-center justify-center italic">
                                    <Target size={32} />
                                 </div>
                                 <div className="space-y-2 italic">
                                    <div className="flex items-center gap-2 italic">
                                       <span className="text-[9px] font-black bg-fuchsia-500 text-white px-2 py-0.5 rounded italic">CORE STRATEGY</span>
                                       <span className="text-[9px] font-black text-white/20 uppercase italic">ETA: 48 HOURS</span>
                                    </div>
                                    <h4 className="text-xl font-black uppercase tracking-tighter italic">Neural Insight: Content Authority Shift</h4>
                                    <p className="text-sm text-white/40 leading-relaxed italic">
                                       {projectData?.ai?.insight || `Analyzing ${activeDomain} architecture to identify high-impact organic vectors.`}
                                    </p>
                                 </div>
                              </div>
                           </div>

                           <div className="group p-8 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/5 transition-all italic">
                              <div className="flex items-start gap-8 italic">
                                 <div className="w-16 h-16 bg-teal-400/10 text-teal-400 rounded-2xl flex items-center justify-center italic">
                                    <Zap size={32} />
                                 </div>
                                 <div className="space-y-2 italic">
                                    <div className="flex items-center gap-2 italic">
                                       <span className="text-[9px] font-black bg-teal-500 text-white px-2 py-0.5 rounded italic">TECHNICAL GROWTH</span>
                                       <span className="text-[9px] font-black text-white/20 uppercase italic">ETA: IMMEDIATE</span>
                                    </div>
                                    <h4 className="text-xl font-black uppercase tracking-tighter italic">Optimization: Neural Page Velocity</h4>
                                    <p className="text-sm text-white/40 leading-relaxed italic">
                                       {projectData?.ai?.actionable || "Fixing the core technical fractures would yield an estimated +12% traffic lift."}
                                    </p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Sidebar Metrics */}
                     <div className="md:col-span-4 space-y-8 italic">
                        <div className="bg-gradient-to-br from-purple-400/10 to-transparent border border-purple-400/20 p-8 rounded-3xl italic">
                           <h4 className="text-xs font-black uppercase text-purple-400 tracking-widest mb-6 italic">Growth Projection</h4>
                           <div className="space-y-6 italic">
                              <div className="flex justify-between items-end italic">
                                 <p className="text-sm text-white/40 italic">Organic Score</p>
                                 <p className="text-3xl font-black italic">{projectData?.project?.score || 0}%</p>
                              </div>
                              <div className="h-2 bg-white/5 rounded-full overflow-hidden italic">
                                 <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${projectData?.project?.score || 0}%` }}
                                    className="h-full bg-purple-400 shadow-[0_0_15px_#A855F7] italic"
                                 />
                              </div>
                              <p className="text-[10px] text-white/20 italic italic">Current performance baseline for {activeDomain}. Projections indicate +25% growth after technical remediation.</p>
                           </div>
                        </div>

                        <div className="bg-white/[0.01] border border-white/5 p-8 rounded-3xl italic">
                           <div className="flex items-center gap-2 mb-4 italic">
                              <Flame size={16} className="text-orange-400 italic" />
                              <h4 className="text-xs font-black uppercase tracking-widest italic">Anomalous Detection</h4>
                           </div>
                           <p className="text-sm text-white/40 leading-relaxed italic">
                              Competitor activity detected in your primary content silos. Neural engine recommends immediate authority sync.
                           </p>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
   );
}
