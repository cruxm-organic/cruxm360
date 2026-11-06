'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useStoredDomain } from '@/lib/hooks/use-stored-domain';
import type { KeywordRow, ProjectData } from '@/lib/types';
import { 
  Target, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Filter, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe,
  Plus,
  Zap,
  ChevronRight,
  Flame,
  LayoutGrid,
  Loader2,
  Calendar,
  X,
  History,
  MousePointer2,
  Database,
  Link as LinkIcon,
  Tag
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function KeywordEngine() {
   const stored = useStoredDomain();
   const activeDomain = stored === undefined ? '' : (stored || 'cruxm.com');
   const [isLoading, setIsLoading] = useState(true);
   const [projectData, setProjectData] = useState<ProjectData | null>(null);
   const [selectedKeyword, setSelectedKeyword] = useState<KeywordRow | null>(null);
   const [keywordSearch, setKeywordSearch] = useState('');

   useEffect(() => {
     if (!activeDomain) return;
     const fetchKeywords = async () => {
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

     fetchKeywords();
   }, [activeDomain]);

   const firstDifficulty = projectData?.keywords?.[0]?.difficulty ?? null;

   return (
      <div className="relative min-h-screen bg-[#050A0F] text-white p-6 md:p-10 selection:bg-teal-400 selection:text-black italic">
         
         <div className="relative z-10 max-w-[1600px] mx-auto space-y-12 pb-32 italic">
            
            {/* Ahrefs-Style Keyword Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 border-b border-white/5 pb-12 italic">
               <div className="italic">
                  <div className="flex items-center gap-3 mb-4 italic italic">
                     <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/20 italic italic italic">
                        <Tag size={20} />
                     </div>
                     <div className="italic">
                        <span className="text-white/20 text-[10px] font-black uppercase tracking-widest italic italic">Organic Traffic Discovery</span>
                        <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none italic italic">Keywords Explorer</h1>
                     </div>
                  </div>
                  <p className="text-white/40 text-sm font-medium italic italic italic">Deconstructing the semantic footprint and SERP rankings for <span className="text-white font-bold italic italic">{activeDomain}</span></p>
               </div>
               
               <div className="flex gap-4 italic italic">
                  <div className="relative group italic italic italic">
                     <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-purple-400 transition-colors italic italic italic italic" size={16} />
                     <input 
                        type="text" 
                        value={keywordSearch}
                        onChange={(e) => setKeywordSearch(e.target.value)}
                        placeholder="TRACK_NEW_KEYWORD" 
                        className="bg-white/5 border border-white/10 p-4 pl-14 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-purple-400/30 transition-all w-80 italic italic"
                     />
                  </div>
                  <button className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-400 transition-all shadow-xl shadow-white/5 italic italic italic italic">
                     SYNC_RANKINGS
                  </button>
               </div>
            </header>

            <AnimatePresence mode="wait">
               {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-40 italic">
                     <Loader2 className="animate-spin text-purple-400 mb-6" size={48} />
                     <p className="text-[12px] font-black uppercase tracking-[0.5em] text-white/40 italic">Analyzing Semantic Intent Nodes...</p>
                  </div>
               ) : (
                  <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="space-y-12 italic"
                  >
                     {/* Keyword Summary Stats */}
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-6 italic">
                        <KeywordMetricCard label="Organic Keywords" value={projectData?.keywords?.length ?? '—'} />
                        <KeywordMetricCard label="Avg. KD Score" value={firstDifficulty != null ? `${Math.floor(firstDifficulty)}%` : '—'} color="text-purple-400" />
                        <KeywordMetricCard label="CPC Opportunity" value="—" color="text-emerald-400" />
                        <KeywordMetricCard label="Traffic Potential" value="—" color="text-teal-400" />
                     </div>

                     {/* Professional Keywords Index Table */}
                     <div className="bg-white/[0.01] border border-white/5 rounded-[40px] overflow-hidden italic shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center italic">
                           <div className="flex items-center gap-4 italic italic">
                              <h3 className="text-xl font-black uppercase tracking-tighter italic">Organic Ranking Index</h3>
                              <span className="text-[8px] font-black bg-white/5 text-white/20 px-2 py-1 rounded italic italic">V1.0.4 DATASET</span>
                           </div>
                           <div className="flex gap-4 italic italic">
                              <button className="flex items-center gap-2 text-[10px] font-black text-white/20 hover:text-white- transition-all italic italic italic"><Filter size={14} /> FILTER_VOLUME</button>
                              <div className="w-px h-4 bg-white/5 italic italic italic" />
                              <button className="text-[10px] font-black text-purple-400 uppercase italic italic italic">EXPORT_DATASET</button>
                           </div>
                        </div>
                        
                        <div className="overflow-x-auto italic">
                           <table className="w-full text-left italic">
                              <thead className="bg-white/[0.02] border-b border-white/5 italic">
                                 <tr className="italic">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Keyword Entity</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Pos</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Volume</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">KD</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">CPC</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Traffic (%)</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic text-right">Analytic</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 italic">
                                 {projectData?.keywords?.map((kw, i) => (
                                    <tr key={i} className="hover:bg-white/[0.03] transition-all group italic">
                                       <td className="p-8 italic">
                                          <div className="flex flex-col italic">
                                             <span className="font-bold text-white text-sm group-hover:text-purple-400 transition-all cursor-pointer italic">{kw.keyword}</span>
                                          </div>
                                       </td>
                                       <td className="p-8 italic">
                                          <div className="flex items-center gap-2 italic">
                                             <span className="font-black text-emerald-400 text-[12px] italic">{kw.position != null ? `#${kw.position}` : '—'}</span>
                                             {kw.position != null && <TrendingUp size={10} className="text-emerald-400" />}
                                          </div>
                                       </td>
                                       <td className="p-8 italic">
                                          <span className="font-black text-[12px] italic">{kw.volume != null ? kw.volume.toLocaleString() : '—'}</span>
                                       </td>
                                       <td className="p-8 italic">
                                          <div className="flex items-center gap-3 italic">
                                             <span className={clsx("text-[10px] font-black italic", (kw.difficulty ?? 0) > 70 ? "text-orange-400" : "text-emerald-400")}>{kw.difficulty != null ? `${kw.difficulty}%` : '—'}</span>
                                             <div className="w-12 h-1 bg-white/5 rounded-full overflow-hidden italic">
                                                <div
                                                   className={clsx("h-full italic", (kw.difficulty ?? 0) > 70 ? "bg-orange-400" : "bg-emerald-400")}
                                                   style={{ width: `${kw.difficulty ?? 0}%` }}
                                                />
                                             </div>
                                          </div>
                                       </td>
                                       <td className="p-8 italic">
                                          <span className="text-white/40 font-black text-[12px] italic">—</span>
                                       </td>
                                       <td className="p-8 italic">
                                          <div className="flex flex-col italic">
                                             <span className="text-[12px] font-black text-teal-400 italic">—</span>
                                          </div>
                                       </td>
                                       <td className="p-8 text-right italic">
                                          <button 
                                             onClick={() => setSelectedKeyword(kw)}
                                             className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all h-full italic"
                                          >
                                             <BarChart3 size={16} />
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>

                     {/* Trend Matrix Section */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 italic">
                        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-10 italic">
                           <h3 className="text-xl font-black uppercase tracking-tighter mb-8 italic">Volume Trend Analysis</h3>
                           <div className="h-40 flex items-end gap-1.5 italic">
                              {[20, 35, 25, 45, 60, 55, 80, 75, 95, 85, 100, 110].map((v, i) => (
                                 <div key={i} className="flex-1 bg-purple-500/10 rounded-t-lg group relative transition-all hover:bg-purple-400/40 italic" style={{ height: `${v}%` }}>
                                    <div className="absolute top-[-25px] left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all text-[8px] font-black italic">
                                       {v}K
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                        <div className="bg-gradient-to-br from-teal-400/10 to-transparent border border-teal-400/20 rounded-[40px] p-10 italic">
                           <h3 className="text-xl font-black uppercase tracking-tighter mb-8 italic">Keyword Difficulty Audit</h3>
                           <p className="text-sm text-white/40 leading-relaxed italic mb-8">
                              Your domain holds a <span className="text-white font-bold italic">High Keyword Density</span> in technical sectors. KD average is <span className="text-purple-400 font-bold italic">42%</span>, indicating viable opportunity for secondary semantic expansion in the /neural and /intelligence subfolders.
                           </p>
                           <button className="w-full bg-white/5 border border-white/10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all italic">GENERATE_SEMANTIC_REPORT</button>
                        </div>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Ahrefs-Style SERP Detail Modal */}
            <AnimatePresence>
               {selectedKeyword && (
                  <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-3xl flex items-center justify-center p-6 italic"
                  >
                     <motion.div 
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-[#050A0F] border border-white/10 w-full max-w-5xl rounded-[50px] overflow-hidden shadow-2xl relative italic"
                     >
                        <button 
                           onClick={() => setSelectedKeyword(null)}
                           className="absolute top-10 right-10 p-5 bg-white/5 rounded-full hover:bg-white/10 transition-all z-10 italic"
                        >
                           <X size={24} />
                        </button>

                        <div className="p-16 space-y-12 italic">
                           <div className="italic">
                              <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em] mb-4 italic">Neural SERP Analyzer</p>
                              <h2 className="text-5xl font-black italic tracking-tighter uppercase italic">&quot;{selectedKeyword.keyword}&quot; <span className="text-white/20 italic italic italic">— {activeDomain}</span></h2>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-4 gap-6 italic">
                              <MetricBox label="Global Volume" value="1.2M" sub="US/UK/IN" />
                              <MetricBox label="Clicks / Search" value="0.94" color="text-teal-400" />
                              <MetricBox label="Cost / Click" value="$4.21" color="text-emerald-400" />
                              <MetricBox label="Return Rate" value="1.2" />
                           </div>

                           <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden italic shadow-xl">
                              <div className="p-8 border-b border-white/5 italic">
                                 <h3 className="text-xl font-black uppercase tracking-tighter italic">Top 10 SERP Performance</h3>
                              </div>
                              <table className="w-full text-left italic">
                                 <thead className="bg-white/[0.01] border-b border-white/5 italic">
                                    <tr className="italic">
                                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">SERP Result</th>
                                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">DR</th>
                                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">UR</th>
                                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Backlinks</th>
                                       <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Traffic</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-white/5 italic">
                                    <tr className="italic">
                                       <td colSpan={5} className="p-8 text-sm font-bold text-white/40 italic">
                                          SERP results are not measured by this engine, so none are shown for &quot;{selectedKeyword.keyword}&quot;.
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>

         </div>
      </div>
   );
}

interface KeywordMetricCardProps {
   label: string;
   value: ReactNode;
   color?: string;
   trend?: string;
}

function KeywordMetricCard({ label, value, color, trend }: KeywordMetricCardProps) {
   return (
      <div className="bg-white/5 border border-white/10 p-10 rounded-[40px] hover:border-purple-400/30 transition-all group italic shadow-xl">
         <div className="flex justify-between items-start mb-6 italic">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] italic">{label}</p>
            {trend && <span className="text-[10px] font-black text-emerald-400 italic">{trend}</span>}
         </div>
         <p className={clsx("text-5xl font-black italic tracking-tighter italic", color || "text-white")}>{value}</p>
      </div>
   );
}

interface MetricBoxProps {
   label: string;
   value: ReactNode;
   sub?: ReactNode;
   color?: string;
}

function MetricBox({ label, value, sub, color }: MetricBoxProps) {
   return (
      <div className="bg-white/[0.03] p-8 rounded-3xl text-center italic">
         <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1 italic italic italic italic">{label}</p>
         <p className={clsx("text-2xl font-black italic", color || "text-white")}>{value}</p>
         {sub && <p className="text-[8px] font-black text-white/10 mt-1 italic">{sub}</p>}
      </div>
   );
}

