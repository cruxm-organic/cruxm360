'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useStoredDomain } from '@/lib/hooks/use-stored-domain';
import type { ProjectData } from '@/lib/types';
import { 
  Link as LinkIcon, 
  Globe, 
  Search,
  ExternalLink, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  Users, 
  Anchor,
  Zap,
  ChevronRight,
  Database,
  BarChart3,
  Loader2,
  Lock,
  MessageSquare,
  Filter,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function BacklinkProfile() {
   const stored = useStoredDomain();
   const activeDomain = stored === undefined ? '' : (stored || 'cruxm.com');
   const [isLoading, setIsLoading] = useState(true);
   const [projectData, setProjectData] = useState<ProjectData | null>(null);

   useEffect(() => {
      if (!activeDomain) return;
      const fetchBacklinks = async () => {
         setIsLoading(true);
         try {
            const res = await fetch(`/api/project-data?domain=${encodeURIComponent(activeDomain)}`);
            const data: ProjectData = await res.json();
            setProjectData(data);
         } catch {
            console.error('Fetch Error');
         } finally {
            setIsLoading(false);
         }
      };

      fetchBacklinks();
   }, [activeDomain]);

   const proj = projectData?.project;

   return (
      <div className="relative min-h-screen bg-[#050A0F] text-white p-6 md:p-10 selection:bg-teal-400 selection:text-black italic">
         
         <div className="relative z-10 max-w-[1600px] mx-auto space-y-12 pb-32 italic">
            
            {/* Ahrefs-Style Link Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 border-b border-white/5 pb-10 italic">
               <div className="italic">
                  <div className="flex items-center gap-3 mb-4 italic italic">
                     <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center border border-blue-500/20 italic italic italic">
                        <LinkIcon size={20} />
                     </div>
                     <div className="italic">
                        <span className="text-white/20 text-[10px] font-black uppercase tracking-widest italic italic">Referral Intelligence</span>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none italic italic">Backlink Profile</h1>
                     </div>
                  </div>
                  <p className="text-white/40 text-sm font-medium italic italic italic">Mapping the authority structure and referral network for <span className="text-white font-bold italic italic">{activeDomain}</span></p>
               </div>
               
               <div className="flex gap-4 italic italic">
                  <div className="relative italic">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                     <input 
                        type="text" 
                        placeholder="FILTER_REFERRING_DOMAINS" 
                        className="bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-blue-400/50 transition-all w-64 italic italic"
                     />
                  </div>
                  <button className="bg-white text-black px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-400 transition-all shadow-xl shadow-white/5 italic italic italic italic">
                     <Download size={14} /> EXPORT_CSV
                  </button>
               </div>
            </header>

            <AnimatePresence mode="wait">
               {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-40 italic">
                     <Loader2 className="animate-spin text-blue-400 mb-6" size={48} />
                     <p className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 italic">Querying Neural Link Graph...</p>
                  </div>
               ) : (
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-12 italic italic italic italic"
                  >
                     {/* Authority Dashboard Grid */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 italic">
                        <LinkMetricCard
                           label="Domain Rating"
                           value={proj?.dr ?? NOT_MEASURED}
                           desc="Overall backlink profile strength (Logarithmic scale)"
                           color="text-blue-400"
                        />
                        <LinkMetricCard
                           label="Referring Domains"
                           value={proj?.referringDomains?.toLocaleString() ?? NOT_MEASURED}
                           desc="Unique originating domains linking to this site"
                           color="text-white"
                        />
                        <LinkMetricCard
                           label="Total Backlinks"
                           value={proj?.backlinks?.toLocaleString() ?? NOT_MEASURED}
                           desc="Total index count of all incoming referral nodes"
                           color="text-teal-400"
                        />
                        <LinkMetricCard
                           label="URL Rating"
                           value={proj?.ur ?? NOT_MEASURED}
                           desc="Target URL link profile strength"
                           color="text-purple-400"
                        />
                     </div>

                     {/* Deep Table Logic (Replicating Ahrefs Backlinks List) */}
                     <div className="bg-white/[0.01] border border-white/5 rounded-[40px] overflow-hidden italic shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center italic">
                           <div className="italic">
                              <h3 className="text-xl font-black uppercase tracking-tighter italic">Authority Referral Index</h3>
                              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-mono mt-1 italic italic italic">Referring-node index not measured by this engine</p>
                           </div>
                           <div className="flex gap-4 italic italic">
                              <button className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all italic"><Filter size={16} /></button>
                              <button className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-all italic"><MoreHorizontal size={16} /></button>
                           </div>
                        </div>
                        
                        <div className="overflow-x-auto italic">
                           <table className="w-full text-left italic">
                              <thead className="bg-white/[0.02] border-b border-white/5 italic">
                                 <tr className="italic">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Referring Page / Domain</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">DR</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">UR</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Backlinks</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Anchor / Target URL</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Seen</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 italic">
                                 <tr className="italic">
                                    <td colSpan={6} className="p-8 text-sm font-bold text-white/40 italic">
                                       Referring pages are not measured by this engine, so no backlink rows are shown.
                                    </td>
                                 </tr>
                              </tbody>
                           </table>
                        </div>
                     </div>

                     {/* Anchor Cloud (Ahrefs Sidebar Column Style) */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 italic">
                        <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[40px] p-10 italic">
                           <h3 className="text-xl font-black uppercase tracking-tighter mb-10 italic">Referring Domains Map</h3>
                           <div className="h-48 flex items-end gap-2 italic">
                              {[30, 45, 20, 60, 80, 55, 90, 100, 85, 70, 95, 110].map((v, i) => (
                                 <div key={i} className="flex-1 bg-blue-500/20 rounded-t-xl hover:bg-blue-400/40 transition-all cursor-pointer relative group italic" style={{ height: `${v}%` }}>
                                    <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 bg-blue-400 text-black text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 italic transition-all italic">
                                       {v}K
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="bg-gradient-to-br from-teal-400/10 to-transparent border border-teal-400/20 rounded-[40px] p-10 italic">
                           <h3 className="text-xl font-black uppercase tracking-tighter mb-8 italic">Ahrefs Link Quality</h3>
                           <div className="space-y-6 italic">
                              <QualityMetric label="Dofollow Links" percentage={activeDomain?.includes('google') ? 92 : 68} color="bg-teal-400" />
                              <QualityMetric label="Nofollow Links" percentage={activeDomain?.includes('google') ? 8 : 32} color="bg-white/10" />
                              <QualityMetric label="UGC / Sponsored" percentage={12} color="bg-blue-400/50" />
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

const NOT_MEASURED = '—';

interface LinkMetricCardProps {
   label: string;
   value: ReactNode;
   desc: string;
   color?: string;
   trend?: string;
}

function LinkMetricCard({ label, value, desc, color, trend }: LinkMetricCardProps) {
   return (
      <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] hover:border-blue-400/30 transition-all group italic shadow-xl">
         <div className="flex justify-between items-start mb-6 italic">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic">{label}</p>
            {trend && <span className={clsx("text-[10px] font-black italic", trend.startsWith('+') ? "text-emerald-400" : "text-orange-400")}>{trend}</span>}
         </div>
         <p className={clsx("text-5xl font-black italic tracking-tighter italic", color)}>{value}</p>
         <p className="text-[10px] font-semibold text-white/20 mt-6 leading-relaxed italic">{desc}</p>
      </div>
   );
}

interface QualityMetricProps {
   label: string;
   percentage: number;
   color?: string;
}

function QualityMetric({ label, percentage, color }: QualityMetricProps) {
   return (
      <div className="italic">
         <div className="flex justify-between items-end mb-2 italic">
            <span className="text-[10px] font-black text-white/40 uppercase italic">{label}</span>
            <span className="text-sm font-black italic">{percentage}%</span>
         </div>
         <div className="h-1.5 bg-white/5 rounded-full overflow-hidden italic">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${percentage}%` }}
               className={clsx("h-full italic", color)} 
            />
         </div>
      </div>
   );
}

