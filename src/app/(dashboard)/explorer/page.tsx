'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { 
  Search, 
  Globe, 
  Filter, 
  ChevronRight, 
  Loader2, 
  Cpu, 
  Zap, 
  AlertCircle,
  Activity,
  Server,
  Network,
  ShieldAlert,
  Download,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

// --- Simplified Micro-Components ---

function DiagnosticRow({ label, value, status }: { label: string, value: string, status?: 'stable' | 'alert' }) {
   return (
      <div className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 italic">
         <div className="flex flex-col italic">
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] italic">{label}</span>
            <span className="text-[13px] font-bold text-white italic">{value}</span>
         </div>
         {status && (
            <div className={clsx(
               "w-1.5 h-1.5 rounded-full animate-pulse italic",
               status === 'stable' ? "bg-emerald-400" : "bg-orange-400"
            )} />
         )}
      </div>
   );
}

interface StatCardProps {
   label: string;
   value: ReactNode;
   color?: string;
   scan?: boolean;
   progress?: number;
}

type ExplorerRow = ReturnType<typeof generateExplorerRows>[number];

function StatCard({ label, value, color, scan, progress }: StatCardProps) {
   return (
      <div className="bg-white/[0.03] border border-white/5 p-6 rounded-3xl hover:border-white/10 transition-all italic relative overflow-hidden shadow-2xl">
         {scan && (
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               className="absolute bottom-0 left-0 h-0.5 bg-teal-400 opacity-30 italic"
            />
         )}
         <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1 italic">{label}</p>
         <p className={clsx("text-2xl font-black italic tabular-nums leading-none", color)}>{value}</p>
      </div>
   );
}

// --- Main Page Component ---

export default function SiteExplorer() {
   const [search, setSearch] = useState('');
   const [scanRequested, setScanRequested] = useState(false);
   const [scanProgress, setScanProgress] = useState(0);
   // A scan is running while requested and not yet complete; derived, so no state sync in an effect.
   const isScanning = scanRequested && scanProgress < 100;
   const [isLoading, setIsLoading] = useState(true);
   const [selectedNode, setSelectedNode] = useState<ExplorerRow | null>(null);
   const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'headers'>('overview');
   const [filter, setFilter] = useState<'all' | '200' | 'redirects'>('all');
   const [isExporting, setIsExporting] = useState(false);

   useEffect(() => {
      const timer = setTimeout(() => {
         setIsLoading(false);
         setSearch('modernplasticsindia.in');
      }, 1200);
      return () => clearTimeout(timer);
   }, []);

   useEffect(() => {
      if (!isScanning) return;
      const interval = setInterval(() => {
         setScanProgress(prev => Math.min(prev + 1.5, 100));
      }, 100);
      return () => clearInterval(interval);
   }, [isScanning]);

   const handleDeepScan = () => {
      setScanProgress(0);
      setScanRequested(true);
   };

   // --- Filter Logic ---
   const allRows = generateExplorerRows(search || 'modernplasticsindia.in');
   const filteredRows = allRows.filter(row => {
      if (filter === '200') return row.status === 200;
      if (filter === 'redirects') return row.status === 301 || row.status === 302;
      return true;
   });

   // --- Export Logic ---
   const handleExportCSV = () => {
      setIsExporting(true);
      setTimeout(() => {
         const headers = ['URL', 'Status', 'In-Links', 'Depth'];
         const csvContent = [
            headers.join(','),
            ...filteredRows.map(row => `${row.url},${row.status},${row.inlinks},${row.depth}`)
         ].join('\n');

         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
         const link = document.createElement('a');
         const url = URL.createObjectURL(blob);
         link.setAttribute('href', url);
         link.setAttribute('download', `cruxm_audit_${search || 'domain'}.csv`);
         link.style.visibility = 'hidden';
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
         setIsExporting(false);
      }, 1000);
   };

   return (
      <div className="min-h-screen bg-[#050A0F] text-white selection:bg-teal-400 selection:text-black italic">
         
         <div className="max-w-[1400px] mx-auto p-8 lg:p-12 space-y-16 pb-40 italic">
            
            {/* --- Minimal Header Area --- */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 italic border-b border-white/5 pb-10">
               <div className="space-y-4 italic">
                  <div className="flex items-center gap-3 italic">
                     <div className="w-10 h-10 bg-teal-400/10 rounded-xl flex items-center justify-center border border-teal-400/20 italic">
                        <Cpu size={20} className="text-teal-400" />
                     </div>
                     <h1 className="text-4xl font-black italic tracking-tighter uppercase italic leading-none">Site Explorer</h1>
                  </div>
                  <p className="text-white/40 text-sm italic">Neural directory discovery for <span className="text-white font-bold italic underline underline-offset-4 decoration-teal-400/50">{search}</span></p>
               </div>

               <div className="flex gap-3 w-full md:w-auto italic">
                  <div className="relative flex-1 md:w-80 italic">
                     <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 italic" size={14} />
                     <input 
                        type="text" 
                        value={search}
                        placeholder="Domain lookup..."
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:border-teal-400/40 outline-none transition-all italic"
                     />
                  </div>
                  <button 
                     onClick={handleDeepScan}
                     disabled={isScanning}
                     className={clsx(
                        "flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all italic shadow-xl shadow-teal-400/10",
                        isScanning ? "bg-teal-400 text-black animate-pulse" : "bg-white text-black hover:bg-teal-400"
                     )}
                  >
                     <Zap size={14} className={clsx("italic", isScanning && "animate-spin")} />
                     {isScanning ? `${Math.floor(scanProgress)}% SCAN` : 'DEEP_SCAN'}
                  </button>
               </div>
            </header>

            {/* --- Status & Metrics Grid --- */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 italic px-2">
               <StatCard label="Live Pages" value={isLoading ? '...' : filteredRows.length} color="text-teal-400" scan={isScanning} progress={scanProgress} />
               <StatCard label="Avg Response" value="124ms" color="text-emerald-400" scan={isScanning} progress={scanProgress} />
               <StatCard label="Tech Errors" value={filter === 'redirects' ? filteredRows.length : '12'} color="text-orange-400" scan={isScanning} progress={scanProgress} />
               <StatCard label="Crawl Depth" value="L12" color="text-white" scan={isScanning} progress={scanProgress} />
            </div>

            {/* --- Main Audit Section --- */}
            <section className="space-y-6 italic">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 italic bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                  <div className="flex items-center gap-4 italic">
                     <div className="p-3 bg-white/5 rounded-xl italic">
                        <Activity size={16} className="text-teal-400 italic" />
                     </div>
                     <h3 className="text-[11px] font-black uppercase tracking-[0.3em] italic">Host Infrastructure Map</h3>
                  </div>
                  
                  <div className="flex items-center gap-2 italic">
                     <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 italic">
                        {(['all', '200', 'redirects'] as const).map((f) => (
                           <button 
                              key={f}
                              onClick={() => setFilter(f)}
                              className={clsx(
                                 "px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all italic",
                                 filter === f ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                              )}
                           >
                              {f}
                           </button>
                        ))}
                     </div>
                     <div className="w-[1px] h-8 bg-white/5 mx-2 italic" />
                     <button 
                        onClick={handleExportCSV}
                        disabled={isExporting}
                        className={clsx(
                           "flex items-center gap-2 px-6 py-3 bg-teal-400/10 border border-teal-400/20 text-teal-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-teal-400 hover:text-black transition-all italic",
                           isExporting && "opacity-50 cursor-wait"
                        )}
                     >
                        {isExporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                        {isExporting ? 'EXPORTING...' : 'EXPORT_CSV'}
                     </button>
                  </div>
               </div>

               <div className="bg-white/[0.01] border border-white/5 rounded-[40px] overflow-hidden italic shadow-inner">
                  {isLoading ? (
                     <div className="p-40 flex flex-col items-center gap-6 italic">
                        <Loader2 className="animate-spin text-teal-400 italic" size={48} />
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] italic">Building Node Graph...</span>
                     </div>
                  ) : (
                     <div className="overflow-x-auto italic">
                        <table className="w-full text-left italic min-w-[800px]">
                           <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-white/30 italic">
                              <tr>
                                 <th className="px-10 py-6 italic">Discovery Node / Path</th>
                                 <th className="px-6 py-6 italic text-center">Response</th>
                                 <th className="px-6 py-6 italic text-center">In-Links</th>
                                 <th className="px-6 py-6 italic text-center">Depth</th>
                                 <th className="px-10 py-6 italic text-right">Diagnostic</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5 italic">
                              {filteredRows.map((row, i) => (
                                 <tr key={i} className="hover:bg-white/[0.03] transition-colors group cursor-pointer italic" onClick={() => setSelectedNode(row)}>
                                    <td className="px-10 py-7 italic">
                                       <div className="flex flex-col gap-1 italic">
                                          <div className="flex items-center gap-2 italic">
                                             {row.status === 200 ? <CheckCircle2 size={12} className="text-emerald-400" /> : <AlertCircle size={12} className="text-blue-400" />}
                                             <span className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors italic truncate max-w-lg">{row.url}</span>
                                          </div>
                                          <span className="text-[9px] font-black text-white/10 uppercase italic pl-5">Crawled: 12m ago</span>
                                       </div>
                                    </td>
                                    <td className="px-6 py-7 italic text-center">
                                       <span className={clsx(
                                          "px-3 py-1 rounded-full text-[10px] font-black italic",
                                          row.status === 200 ? "bg-emerald-400/10 text-emerald-400" : "bg-blue-400/10 text-blue-400"
                                       )}>
                                          {row.status} {row.status === 200 ? 'OK' : '301'}
                                       </span>
                                    </td>
                                    <td className="px-6 py-7 italic text-center text-sm font-bold text-white/30 italic">{row.inlinks}</td>
                                    <td className="px-6 py-7 italic text-center">
                                       <span className="text-[10px] font-black text-white/20 italic">L{row.depth}</span>
                                    </td>
                                    <td className="px-10 py-7 italic text-right">
                                       <div className="flex justify-end italic">
                                          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-teal-400 group-hover:text-black transition-all italic shadow-lg">
                                             <ChevronRight size={16} />
                                          </div>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            </section>
         </div>

         {/* --- ELITE DIAGNOSTIC DRAWER (Restructured & Functional) --- */}
         <AnimatePresence>
            {selectedNode && (
               <div className="fixed inset-0 z-[10000] flex justify-end italic">
                  <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     onClick={() => setSelectedNode(null)}
                     className="absolute inset-0 bg-black/90 backdrop-blur-xl italic"
                  />
                  <motion.div 
                     initial={{ x: '100%' }}
                     animate={{ x: 0 }}
                     exit={{ x: '100%' }}
                     transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                     className="relative w-full max-w-[560px] bg-[#0A0B10] border-l border-white/10 flex flex-col shadow-[-50px_0_150px_rgba(0,0,0,1)] overflow-hidden italic"
                  >
                     {/* Drawer Header Area */}
                     <header className="p-10 pb-4 space-y-8 italic">
                        <div className="flex justify-between items-start italic">
                           <div className="space-y-1 italic">
                              <span className="text-[9px] font-black text-teal-400 uppercase tracking-[0.4em] italic leading-none">Diagnostic Node Discovery</span>
                              <h2 className="text-3xl font-black italic tracking-tighter uppercase italic leading-none">Resource Trace</h2>
                           </div>
                           <button onClick={() => setSelectedNode(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-full transition-all italic group">
                              <AlertCircle size={24} className="rotate-45 text-white/20 group-hover:text-white transition-colors italic" />
                           </button>
                        </div>

                        <div className="p-6 bg-white/[0.03] rounded-[32px] border border-white/10 flex items-center gap-4 italic shadow-inner">
                           <Globe size={18} className="text-teal-400 italic shrink-0" />
                           <span className="text-xs font-bold text-white/80 truncate flex-1 italic">{selectedNode.url}</span>
                           <div className="px-3 py-1 bg-emerald-400/10 text-emerald-400 text-[10px] font-black rounded-lg italic">ACTIVE</div>
                        </div>

                        <nav className="flex gap-10 border-b border-white/5 italic">
                           {(['overview', 'technical', 'headers'] as const).map(tab => (
                              <button 
                                 key={tab}
                                 onClick={() => setActiveTab(tab)}
                                 className={clsx(
                                    "pb-5 text-[10px] font-black uppercase tracking-[0.15em] transition-all italic relative",
                                    activeTab === tab ? "text-teal-400" : "text-white/20 hover:text-white"
                                 )}
                              >
                                 {tab}
                                 {activeTab === tab && (
                                    <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-400 italic" />
                                 )}
                              </button>
                           ))}
                        </nav>
                     </header>

                     {/* Drawer Content */}
                     <div className="flex-1 overflow-y-auto p-10 pt-4 space-y-12 italic scrollbar-hide">
                        {activeTab === 'overview' && (
                           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 italic">
                              <div className="grid grid-cols-2 gap-6 italic">
                                 <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 text-center italic shadow-lg">
                                    <span className="text-[9px] font-black text-white/20 uppercase italic block mb-2">Response Status</span>
                                    <p className="text-4xl font-black text-emerald-400 italic leading-none">{selectedNode.status}</p>
                                    <p className="text-[10px] font-black text-white/40 uppercase mt-2 italic">NODE_STABLE</p>
                                 </div>
                                 <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 text-center italic shadow-lg">
                                    <span className="text-[9px] font-black text-white/20 uppercase italic block mb-2">Discovery Depth</span>
                                    <p className="text-4xl font-black text-white italic leading-none">L{selectedNode.depth}</p>
                                    <p className="text-[10px] font-black text-white/40 uppercase mt-2 italic">CRAWL_READY</p>
                                 </div>
                              </div>

                              <div className="p-8 bg-black/40 rounded-[40px] border border-white/10 space-y-4 italic shadow-2xl">
                                 <h3 className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-6 italic">Core Technical Matrix</h3>
                                 <DiagnosticRow label="Protocol" value="HTTP/2 + QUIC" status="stable" />
                                 <DiagnosticRow label="Server Node" value="CruxM_Neural_Edge" status="stable" />
                                 <DiagnosticRow label="SSL Encryption" value="ECC 256-bit" status="stable" />
                                 <DiagnosticRow label="Compression" value="Brotli (br)" status="stable" />
                              </div>
                           </motion.div>
                        )}

                        {activeTab === 'technical' && (
                           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 italic">
                              <div className="p-8 bg-white/[0.03] border border-white/10 rounded-[32px] space-y-8 italic">
                                 <div className="flex items-center gap-4 italic">
                                    <div className="w-10 h-10 bg-teal-400/10 rounded-xl flex items-center justify-center italic">
                                       <Network size={20} className="text-teal-400 italic" />
                                    </div>
                                    <div className="italic">
                                       <span className="text-[9px] font-black text-white/20 uppercase italic block">Asset Connectivity</span>
                                       <h4 className="text-sm font-black uppercase tracking-widest italic">In-Link Neural Weights</h4>
                                    </div>
                                 </div>
                                 <div className="space-y-4 italic">
                                    <div className="flex justify-between items-end italic italic">
                                       <span className="text-[10px] font-black text-white/20 uppercase italic">Connection Strength</span>
                                       <span className="text-xs font-bold italic">{selectedNode.inlinks} Points</span>
                                    </div>
                                    <div className="h-2 bg-black rounded-full overflow-hidden italic shadow-inner">
                                       <motion.div initial={{ width: 0 }} animate={{ width: '78%' }} className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 italic" />
                                    </div>
                                    <p className="text-[10px] text-white/30 italic">High density detected. This node is a critical architectural junction.</p>
                                 </div>
                              </div>
                           </motion.div>
                        )}

                        {activeTab === 'headers' && (
                           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 italic">
                              <div className="p-8 bg-black rounded-[40px] border border-white/10 font-mono text-[11px] text-teal-400/60 space-y-3 italic shadow-2xl relative overflow-hidden group">
                                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity italic">
                                    <MoreHorizontal size={16} />
                                 </div>
                                 <p className="text-teal-400/80 italic italic">HTTP/2 200 OK</p>
                                 <p>content-type: text/html; charset=UTF-8</p>
                                 <p>x-powered-by: CruxM_Neural_1.0</p>
                                 <p>cf-cache-status: DYNAMIC</p>
                                 <p>x-frame-options: SAMEORIGIN</p>
                                 <p>referrer-policy: no-referrer-when-downgrade</p>
                                 <p>cache-control: no-store, no-cache, must-revalidate</p>
                                 <p>server: cloudflare</p>
                              </div>
                           </motion.div>
                        )}
                     </div>

                     {/* Action Footer */}
                     <footer className="p-10 bg-[#07080C] border-t border-white/5 grid grid-cols-2 gap-6 italic">
                        <button className="flex items-center justify-center gap-3 bg-teal-400 text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white transition-all italic shadow-lg shadow-teal-400/20 group">
                           <ShieldAlert size={16} className="group-hover:scale-110 transition-transform italic" /> NEURAL_FIX
                        </button>
                        <button 
                           onClick={() => setSelectedNode(null)} 
                           className="bg-white/5 border border-white/10 text-white/40 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all italic"
                        >
                           CLOSE_TRACE
                        </button>
                     </footer>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
}

function generateExplorerRows(domain: string) {
   const isPower = domain.includes('google');
   return [
      { url: `https://${domain}/`, status: 200, inlinks: isPower ? '4.2B' : '1,204', depth: 0 },
      { url: `https://${domain}/search`, status: 200, inlinks: isPower ? '1.8B' : '842', depth: 1 },
      { url: `https://${domain}/images`, status: 200, inlinks: isPower ? '902M' : '412', depth: 1 },
      { url: `https://${domain}/maps`, status: 301, inlinks: isPower ? '450M' : '52', depth: 1 },
      { url: `https://${domain}/drive`, status: 302, inlinks: isPower ? '280M' : '15', depth: 2 },
      { url: `https://${domain}/classroom`, status: 200, inlinks: isPower ? '120M' : '8', depth: 2 },
   ];
}
