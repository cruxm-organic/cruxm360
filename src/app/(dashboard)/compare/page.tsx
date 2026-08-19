'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  ArrowRight, 
  ExternalLink, 
  TrendingUp, 
  Zap, 
  Target, 
  CheckCircle2, 
  ShieldAlert, 
  ChevronRight,
  Loader2,
  Lock,
  MessageSquare
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function DomainCompare() {
   const [targetA, setTargetA] = useState('');
   const [targetB, setTargetB] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [comparison, setComparison] = useState<any>(null);

   useEffect(() => {
     setTargetA(localStorage.getItem('active_domain') || 'cruxm.com');
   }, []);

   const runComparison = () => {
      setIsLoading(true);
      setTimeout(() => {
         setIsLoading(false);
         setComparison({
            scoreA: 82,
            scoreB: 74,
            trafficA: '142K',
            trafficB: '95K',
            drA: 64,
            drB: 58,
            keywordsA: 520,
            keywordsB: 380,
            gaps: [
               { title: 'Cloud Infrastructure', keyword: 'cloud computing for enterprise', diff: 'HIGH', impact: '+320 visits/mo' },
               { title: 'Security Protocols', keyword: 'iso 27001 implementation', diff: 'MED', impact: '+140 visits/mo' },
               { title: 'DevOps Lifecycle', keyword: 'ci/cd pipeline optimization', diff: 'LOW', impact: '+90 visits/mo' },
            ]
         });
      }, 2000);
   };

   return (
      <div className="relative min-h-screen bg-[#050A0F] text-white p-6 md:p-10 selection:bg-teal-400 selection:text-black italic">
         
         <div className="relative z-10 max-w-[1600px] mx-auto space-y-12 pb-32 italic">
            
            {/* Compare Header */}
            <header className="space-y-8 italic">
               <div className="italic">
                  <div className="flex items-center gap-3 mb-4 italic italic">
                     <span className="bg-orange-400/10 text-orange-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded border border-orange-400/20 italic italic italic">Domain Comparison</span>
                     <span className="text-white/20 text-[10px] uppercase font-black tracking-widest italic italic italic">Neural Market intelligence hub</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none italic italic">
                     Market <span className="text-white/40 italic italic italic">Benchmarking</span>
                  </h1>
                  <p className="text-white/40 text-sm font-medium mt-4 italic italic italic italic">Identifying performance deltas and content gaps between competitors.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-6 italic">
                  <div className="md:col-span-4 italic">
                     <input 
                        type="text" 
                        value={targetA}
                        onChange={(e) => setTargetA(e.target.value)}
                        placeholder="Target Domain A..." 
                        className="w-full bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-lg font-bold outline-none focus:border-teal-400/30 transition-all italic italic"
                     />
                  </div>
                  <div className="md:col-span-1 flex justify-center italic">
                     <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-full flex items-center justify-center font-black text-white/20 italic">VS</div>
                  </div>
                  <div className="md:col-span-4 italic">
                     <input 
                        type="text" 
                        value={targetB}
                        onChange={(e) => setTargetB(e.target.value)}
                        placeholder="Target Domain B..." 
                        className="w-full bg-white/[0.03] border border-white/10 p-6 rounded-2xl text-lg font-bold outline-none focus:border-orange-400/30 transition-all italic italic"
                     />
                  </div>
                  <div className="md:col-span-2 italic">
                     <button 
                        onClick={runComparison}
                        className="w-full bg-white text-black px-8 py-6 rounded-2xl font-black uppercase tracking-widest hover:bg-teal-400 transition-all shadow-xl shadow-white/5 italic italic"
                     >
                        ANALYZE_DELTA
                     </button>
                  </div>
               </div>
            </header>

            <AnimatePresence mode="wait">
               {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-40 italic">
                     <Loader2 className="animate-spin text-orange-400 mb-4" size={48} />
                     <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic">Processing Market Deltas...</p>
                  </div>
               ) : comparison ? (
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.98 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="space-y-12 italic"
                  >
                     {/* Head to Head Table */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 italic">
                        <ComparisonCard label="Organic Vitality" valA={comparison.scoreA} valB={comparison.scoreB} colorA="text-teal-400" colorB="text-orange-400" unit="%" />
                        <ComparisonCard label="Traffic Flow" valA={comparison.trafficA} valB={comparison.trafficB} colorA="text-teal-400" colorB="text-orange-400" />
                        <ComparisonCard label="Link Strength (DR)" valA={comparison.drA} valB={comparison.drB} colorA="text-teal-400" colorB="text-orange-400" />
                     </div>

                     {/* Content Gap Analysis */}
                     <div className="space-y-6 italic">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Neural Content Gap Discovery</h3>
                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden italic">
                           <table className="w-full text-left italic">
                              <thead className="bg-white/[0.02] border-b border-white/5 italic">
                                 <tr className="italic">
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Missed Opportunity</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Primary Keyword</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Complexity</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 italic">Est. Impact</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 italic text-right">Action</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5 italic">
                                 {comparison.gaps.map((gap: any, i: number) => (
                                    <tr key={i} className="hover:bg-white/[0.03] transition-colors group italic">
                                       <td className="p-6 font-bold text-white italic">{gap.title}</td>
                                       <td className="p-6 text-white/40 italic">"{gap.keyword}"</td>
                                       <td className="p-6 italic">
                                          <span className={clsx(
                                             "px-3 py-1 rounded text-[10px] font-black italic",
                                             gap.diff === 'HIGH' ? "bg-orange-400/20 text-orange-400" : "bg-teal-400/20 text-teal-400"
                                          )}>{gap.diff}</span>
                                       </td>
                                       <td className="p-6 text-emerald-400 font-bold italic">{gap.impact}</td>
                                       <td className="p-6 text-right italic">
                                          <button className="p-3 bg-white/5 hover:bg-white hover:text-black rounded-xl transition-all italic">
                                             <ChevronRight size={16} />
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </motion.div>
               ) : (
                  <div className="py-40 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center italic text-center italic">
                     <Users size={48} className="text-white/10 mb-6 italic" />
                     <h3 className="text-xl font-black uppercase tracking-widest text-white/20 italic">Benchmarking Engine Offline</h3>
                     <p className="text-sm text-white/20 font-medium mt-2 italic">Enter two domains to project comparative growth vectors.</p>
                  </div>
               )}
            </AnimatePresence>

         </div>
      </div>
   );
}

function ComparisonCard({ label, valA, valB, colorA, colorB, unit = '' }: any) {
   return (
      <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl space-y-8 italic">
         <p className="text-[10px] font-black text-white/40 uppercase tracking-widest italic">{label}</p>
         <div className="flex items-center justify-between italic">
            <div className="italic">
               <p className={clsx("text-4xl font-black italic", colorA)}>{valA}{unit}</p>
               <p className="text-[9px] font-black text-white/20 uppercase italic">Target A</p>
            </div>
            <div className="italic">
               <p className={clsx("text-4xl font-black italic", colorB)}>{valB}{unit}</p>
               <p className="text-[9px] font-black text-white/20 uppercase italic text-right">Target B</p>
            </div>
         </div>
      </div>
   );
}
