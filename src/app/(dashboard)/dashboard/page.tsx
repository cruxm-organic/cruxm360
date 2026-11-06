'use client';

import { Suspense, useState, useEffect, type ReactNode } from 'react';
import { useStoredDomain } from '@/lib/hooks/use-stored-domain';
import type { ProjectData } from '@/lib/types';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  TrendingUp,
  Search,
  Globe,
  Target,
  ShieldCheck,
  ArrowRight,
  Loader2,
  ExternalLink,
  ChevronRight,
  Activity,
  Zap,
  Layout,
  Link,
  Users,
  BarChart3,
  Flame,
  MousePointer2,
  DollarSign
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function MarketingDashboardPage() {
  return (
    <Suspense fallback={null}>
      <MarketingDashboard />
    </Suspense>
  );
}

function MarketingDashboard() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const stored = useStoredDomain();
   const queryDomain = searchParams.get('domain');
   // Until hydration finishes `stored` is undefined: we do not know yet whether a domain is saved.
   const storageReady = stored !== undefined;
   const activeDomain = queryDomain || stored || null;
   const [isLoading, setIsLoading] = useState(true);
   const [projectData, setProjectData] = useState<ProjectData | null>(null);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      if (!activeDomain) {
         if (storageReady) router.push('/');
         return;
      }

      const fetchProjectState = async () => {
         setIsLoading(true);
         setError(null);
         try {
            const res = await fetch(`/api/project-data?domain=${encodeURIComponent(activeDomain)}`);
            const data: ProjectData = await res.json();

            if (data.error) {
               const auditRes = await fetch('/api/run-audit', {
                  method: 'POST',
                  body: JSON.stringify({ url: activeDomain }),
                  headers: { 'Content-Type': 'application/json' }
               });
               const auditData: { error?: string; domain?: string } = await auditRes.json();
               if (auditData.error) {
                  setError(auditData.error);
               } else {
                  // The engine normalizes the domain (e.g. strips "www."), so reload by the stored name.
                  const savedDomain = auditData.domain ?? activeDomain;
                  const retryRes = await fetch(`/api/project-data?domain=${encodeURIComponent(savedDomain)}`);
                  setProjectData(await retryRes.json());
               }
            } else {
               setProjectData(data);
            }
         } catch {
            setError('Failed to sync with CruxM Neural Engine.');
         } finally {
            setIsLoading(false);
         }
      };

      fetchProjectState();
   }, [activeDomain, storageReady, router]);

   if (error) {
      return (
         <div className="min-h-screen bg-[#050A0F] text-white flex flex-col items-center justify-center p-10 italic">
            <ShieldCheck size={64} className="text-orange-400 mb-6 italic" />
            <h2 className="text-3xl font-black uppercase italic italic">Audit Connection Failure</h2>
            <p className="text-white/40 mt-4 italic italic italic">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-8 bg-white text-black px-10 py-4 rounded-xl font-black text-xs uppercase italic italic italic">RETRY_NEURAL_LINK</button>
         </div>
      );
   }

   const proj = projectData?.project;

   return (
      <div className="relative min-h-screen bg-[#050A0F] text-white p-6 md:p-10 selection:bg-teal-400 selection:text-black italic">
         
         <div className="relative z-10 max-w-[1600px] mx-auto space-y-10 pb-32 italic">
            
            {/* Real-time Identity Header (Ahrefs Site Overview Style) */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 border-b border-white/5 pb-10 italic">
               <div className="italic">
                  <div className="flex items-center gap-3 mb-4 italic italic">
                     <span className="bg-teal-400/10 text-teal-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border border-teal-400/20 italic italic italic">Premium Intelligence</span>
                     <span className="text-white/20 text-[10px] uppercase font-black tracking-widest italic italic italic">Real-time Site Overview</span>
                  </div>
                  <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase leading-none mb-4 italic italic">
                     {activeDomain?.split('.')[0]} <span className="text-white/40 italic italic italic">.{activeDomain?.split('.')[1] || 'COM'}</span>
                  </h1>
                  <div className="flex items-center gap-4 italic italic italic">
                     <p className="text-white/40 text-sm font-medium flex items-center gap-2 italic italic italic italic">
                        <Globe size={14} className="text-teal-400" /> Target URL: <span className="text-white font-bold italic italic">{activeDomain}</span>
                        {isLoading && <Loader2 className="animate-spin text-teal-400 ml-2" size={14} />}
                     </p>
                  </div>
               </div>
               
               <div className="flex gap-4 italic italic">
                  <button onClick={() => router.push('/')} className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-black transition-all italic italic italic italic">
                     <Search size={14} /> NEW_AUDIT
                  </button>
                  <button className="bg-teal-400 text-black px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white transition-all italic italic italic italic shadow-xl shadow-teal-400/20">
                     <TrendingUp size={14} /> GENERATE_REPORT
                  </button>
               </div>
            </header>

            <AnimatePresence mode="wait">
               {isLoading ? (
                  <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="flex flex-col items-center justify-center py-40 italic italic italic"
                  >
                     <Loader2 className="w-16 h-16 text-teal-400 animate-spin mb-6 italic" />
                     <p className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40 animate-pulse italic">Synchronizing Neural Vectors...</p>
                  </motion.div>
               ) : (
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-12 italic italic italic"
                  >
                     {/* Ahrefs Top Ribbon Metrics */}
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-0.5 bg-white/5 border border-white/10 rounded-3xl overflow-hidden italic shadow-2xl">
                        <RibbonMetric label="Ahrefs Rank" value="—" />
                        <RibbonMetric label="UR" value={proj?.ur ?? '—'} color="text-teal-400" />
                        <RibbonMetric label="DR" value={proj?.dr ?? '—'} color="text-purple-400" />
                        <RibbonMetric label="Backlinks" value={proj?.backlinks?.toLocaleString() ?? '—'} color="text-blue-400" />
                        <RibbonMetric label="Ref. Domains" value={proj?.referringDomains?.toLocaleString() ?? '—'} />
                        <RibbonMetric label="Keywords" value={projectData?.keywords?.length || 0} />
                     </div>

                     {/* Traffic Value Matrix (Ahrefs Overview Style) */}
                     <div className="grid grid-cols-1 md:grid-cols-12 gap-8 italic">
                        <div className="md:col-span-8 space-y-8 italic">
                           {/* Organic Traffic Graph Placeholder */}
                           <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 italic">
                             <div className="flex justify-between items-end mb-10 italic">
                               <div className="italic">
                                 <p className="text-[10px] font-black uppercase text-teal-400 tracking-widest mb-1 italic">Organic Traffic Lifecycle</p>
                                 <h3 className="text-3xl font-black uppercase italic tracking-tighter italic">Growth Velocity</h3>
                               </div>
                               <div className="flex gap-4 italic">
                                 <div className="flex flex-col items-end italic">
                                   <span className="text-[10px] font-black text-white/20 italic">MONTHLY TRAFFIC</span>
                                   <span className="text-2xl font-black text-white italic">{proj?.organicTraffic ?? '—'}</span>
                                 </div>
                                 <div className="flex flex-col items-end italic">
                                   <span className="text-[10px] font-black text-white/20 italic">TRAFFIC VALUE</span>
                                   <span className="text-2xl font-black text-emerald-400 italic">{proj?.trafficValue ?? '—'}</span>
                                 </div>
                               </div>
                             </div>
                             
                             <div className="h-64 flex items-center justify-center italic">
                               <p className="text-sm font-bold text-white/30 text-center italic">
                                 Monthly traffic history is not measured by this engine, so no chart is shown.
                               </p>
                             </div>
                           </div>

                           <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 italic">
                             <h3 className="text-xl font-black uppercase tracking-tighter mb-8 italic">Search Intent Keywords</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 italic italic">
                               {projectData?.keywords?.slice(0, 8).map((kw, i) => (
                                  <div key={i} className="flex items-center justify-between p-5 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-teal-400/30 transition-all italic italic">
                                     <div className="flex items-center gap-4 italic italic">
                                        <MousePointer2 size={16} className="text-white/20 italic italic" />
                                        <span className="font-bold text-sm italic italic text-white group-hover:text-teal-400">{kw.keyword}</span>
                                     </div>
                                     <div className="flex items-center gap-4 italic">
                                       <span className="text-[10px] font-black text-white/40 italic">VOL: {kw.volume?.toLocaleString() || '--'}</span>
                                       <span className="text-[10px] font-black bg-white/5 text-teal-400 px-2 py-1 rounded italic italic">{kw.position != null ? `#${kw.position}` : '—'}</span>
                                     </div>
                                  </div>
                               ))}
                             </div>
                           </div>
                        </div>

                        <div className="md:col-span-4 space-y-8 italic">
                           <div className="bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 rounded-[40px] p-10 italic">
                              <h3 className="text-xl font-black uppercase tracking-tighter mb-6 italic italic">Backlink Profile</h3>
                              <div className="space-y-6 italic">
                                 <div className="italic">
                                    <div className="flex justify-between mb-2 italic">
                                       <span className="text-[10px] font-black text-white/30 italic">REFERRING DOMAINS</span>
                                       <span className="text-[10px] font-black text-white italic">{proj?.referringDomains ?? '—'}</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden italic">
                                       <div className="h-full bg-purple-400 w-[70%] italic" />
                                    </div>
                                 </div>
                                 <div className="italic">
                                    <div className="flex justify-between mb-2 italic">
                                       <span className="text-[10px] font-black text-white/30 italic">DR RANKING</span>
                                       <span className="text-[10px] font-black text-teal-400 italic">—</span>
                                    </div>
                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden italic">
                                       <div className="h-full bg-teal-400 w-[40%] italic" />
                                    </div>
                                 </div>
                                 <button onClick={() => router.push('/backlinks')} className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all italic mt-4">BACKLINK_EXPLORER</button>
                              </div>
                           </div>

                           <div className="bg-white/[0.01] border border-white/5 rounded-[40px] p-10 italic">
                              <h3 className="text-xl font-black uppercase tracking-tighter mb-6 italic">Growth Roadmap</h3>
                              <p className="text-sm text-white/40 leading-relaxed italic mb-8">
                                 {projectData?.ai?.insight || "Extracting strategic signals from production engine..."}
                              </p>
                              <div className="flex flex-col gap-3 italic">
                                 <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl italic">
                                    <span className="text-[10px] font-black text-white/20 italic">PRIORITY</span>
                                    <span className="text-[10px] font-black text-teal-400 italic">{projectData?.ai?.priority?.toUpperCase() || 'READY'}</span>
                                 </div>
                                 <button onClick={() => router.push('/ai-insights')} className="w-full bg-teal-400 text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic shadow-lg shadow-teal-400/20">VIEW_ROADMAP</button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

         </div>
      </div>
   );
}

interface RibbonMetricProps {
   label: string;
   value: ReactNode;
   color?: string;
   change?: string;
}

function RibbonMetric({ label, value, color, change }: RibbonMetricProps) {
   return (
      <div className="bg-black/60 p-8 flex flex-col justify-center items-center border-r border-white/5 last:border-r-0 hover:bg-black/40 transition-all italic">
         <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 italic text-center">{label}</p>
         <div className="flex items-baseline gap-2 italic">
            <span className={clsx("text-4xl font-extrabold italic tracking-tighter font-mono italic", color || "text-white")}>{value}</span>
            {change && <span className={clsx("text-[10px] font-black italic", change.startsWith('+') ? "text-emerald-400" : "text-orange-400")}>{change}</span>}
         </div>
      </div>
   );
}
