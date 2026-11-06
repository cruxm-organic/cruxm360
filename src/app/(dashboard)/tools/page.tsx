'use client';

import { useState } from 'react';
import { 
  Wrench, 
  Terminal, 
  Search, 
  Cpu, 
  Activity, 
  Zap, 
  Shield, 
  Globe, 
  BarChart, 
  Code, 
  Smartphone, 
  Network, 
  Database, 
  Lock, 
  Share2, 
  FileText, 
  ArrowRight, 
  Play, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCcw,
  Maximize2,
  ChevronRight,
  Filter,
  Command,
  LayoutGrid,
  Box,
  Settings,
  CpuIcon,
  Link,
  Users,
  Download,
  Info,
  Check
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const TOOLS = [
   { 
      id: 'meta', 
      name: 'Metadata Architect', 
      icon: FileText, 
      category: 'Technical', 
      status: 'ready', 
      description: 'Analyze meta-tag distribution, OpenGraph integrity, and hierarchical heading structure.',
      tooltip: 'Used to verify if search engines can correctly interpret your page content and social sharing previews.'
   },
   { 
      id: 'security', 
      name: 'Security Vault', 
      icon: Shield, 
      category: 'Technical', 
      status: 'ready', 
      description: 'Audit SSL certificates, HSTS policies, and X-Frame-Options for server hardening.',
      tooltip: 'Ensures your site meets the security requirements for high-authority ranking and user trust.'
   },
   { 
      id: 'performance', 
      name: 'Velocity Engine', 
      icon: Zap, 
      category: 'Technical', 
      status: 'ready', 
      description: 'Execute deep TTFB, DOM Content Loaded, and First Contentful Paint (FCP) profiling.',
      tooltip: 'Measures page speed bottlenecks that affect Core Web Vitals and search rankings.'
   },
   { 
      id: 'semantic', 
      name: 'Semantic Graph', 
      icon: Network, 
      category: 'Discovery', 
      status: 'ready', 
      description: 'Extract and visualize JSON-LD, Microdata, and Schema.org entity relationships.',
      tooltip: 'Helps search engines understand the context of your data, enabling Rich Snippets in SERPs.'
   },
   { 
      id: 'backlinks', 
      name: 'Link Intersect', 
      icon: Link, 
      category: 'Discovery', 
      status: 'ready', 
      description: 'Identify common referring domains across multiple competitor authority profiles.',
      tooltip: 'Finds link-building opportunities by locating domains that link to your rivals but not to you.'
   },
   { 
      id: 'gap', 
      name: 'Content Gap Detector', 
      icon: Users, 
      category: 'Discovery', 
      status: 'ready', 
      description: 'Cross-reference keyword rankings to locate missed high-intent traffic opportunities.',
      tooltip: 'Discovers the specific topics and keywords your competitors are using to steal your organic traffic.'
   },
   { 
      id: 'volatility', 
      name: 'SERP Volatility', 
      icon: Activity, 
      category: 'SERP', 
      status: 'ready', 
      description: 'Monitor flux in search results and detect algorithmic updates in real-time.',
      tooltip: 'Alerts you to significant shifts in search engine behavior that might affect your ranking stability.'
   },
   { 
      id: 'keywords', 
      name: 'Keyword Forge', 
      icon: Database, 
      category: 'SERP', 
      status: 'ready', 
      description: 'Generate semantic keyword variations and estimate search intent difficulty scores.',
      tooltip: 'Builds a master list of target phrases with predicted ranking difficulty and traffic potential.'
   },
   { 
      id: 'robots', 
      name: 'Bot Protocol', 
      icon: Code, 
      category: 'Technical', 
      status: 'ready', 
      description: 'Validate robots.txt directives and Sitemaps for crawl-budget optimization.',
      tooltip: 'Ensures search bots aren\'t wasting energy on low-value pages of your domain.'
   },
   { 
      id: 'content', 
      name: 'Content Density', 
      icon: BarChart, 
      category: 'Content', 
      status: 'ready', 
      description: 'Measure keyword frequency vs word count ratios across Top 10 ranking SERP nodes.',
      tooltip: 'Identifies if your content is naturally optimized or if you are at risk of over-optimization penalties.'
   }
];

type Tool = (typeof TOOLS)[number];

export default function ToolsArsenal() {
   const [activeTool, setActiveTool] = useState<Tool | null>(null);
   const [running, setRunning] = useState(false);
   const [completedToolId, setCompletedToolId] = useState<string | null>(null);
   const [logs, setLogs] = useState<string[]>([]);
   const [filter, setFilter] = useState('all');
   const [hoveredDescription, setHoveredDescription] = useState<string | null>(null);

   const filteredTools = filter === 'all' 
      ? TOOLS 
      : TOOLS.filter(t => t.category.toLowerCase() === filter.toLowerCase());

   const runTool = async (tool: Tool) => {
      setActiveTool(tool);
      setRunning(true);
      setCompletedToolId(null);
      setLogs([]);
      
      const sequence = [
         `[INFRA] Initializing ${tool.name} Engine...`,
         `[SYNC] Establishing Neural Link with Production node...`,
         `[FETCH] Targeting: ${localStorage.getItem('active_domain') || 'domain.com'}`,
         `[SCAN] Parsing ${tool.category} vectors and data nodes...`,
         `[PROCESS] Executing deep heuristic audit...`,
         `[COMPILE] Synchronizing with local DB instance...`,
         `[DONE] ${tool.name} analysis finalized successfully.`
      ];

      for (const line of sequence) {
         setLogs(prev => [...prev, line]);
         await new Promise(r => setTimeout(r, Math.random() * 500 + 300));
      }
      setRunning(false);
      setCompletedToolId(tool.id);
   };

   const downloadDataset = (toolName: string) => {
      alert(`Downloading raw ${toolName} intelligence dataset (JSON/CSV)... 📥`);
   };

   return (
      <div className="relative min-h-screen bg-[#050A0F] text-white p-6 md:p-10 selection:bg-teal-400 selection:text-black italic">
         
         {/* Background Accents */}
         <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-teal-500/5 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] animate-pulse delay-500" />
            <div className="absolute inset-0 bg-grid opacity-5" />
         </div>

         <div className="relative z-10 max-w-[1700px] mx-auto space-y-12 pb-32 italic">
                      {/* Arsenal Intelligence Status Header */}
            <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16 italic">
               <div className="space-y-4 italic">
                  <div className="flex items-center gap-3 italic">
                     <span className="bg-teal-400 text-black text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded italic">ARSENAL_MODULES</span>
                     <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.2em] italic">CruxM Intelligence Suite</span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none italic">
                     Marketing <span className="text-white/20 italic">Arsenal</span>
                  </h1>
                  <p className="text-white/40 text-[13px] font-medium leading-relaxed max-w-2xl italic">
                     Remote-controlled neural sub-routines to discover hidden SEO vectors and technical infrastructure bottlenecks. 
                     Select a node below to begin deep-analysis.
                  </p>
               </div>

               {/* Professional Filter Bar */}
               <div className="flex flex-wrap items-center gap-2 bg-white/[0.03] border border-white/5 p-2 rounded-[20px] italic">
                  {['all', 'metadata', 'security', 'speed', 'ranking'].map((cat) => (
                     <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={clsx(
                           "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all italic",
                           filter === cat 
                              ? "bg-white text-black shadow-lg" 
                              : "text-white/30 hover:text-white hover:bg-white/5"
                        )}
                     >
                        {cat}
                     </button>
                  ))}
               </div>
            </header>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 italic">
               <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 italic">
                  <AnimatePresence mode='popLayout'>
                    {filteredTools.map((tool, i) => (
                       <motion.div 
                          key={tool.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="group bg-white/[0.02] border border-white/[0.08] p-8 rounded-[32px] flex flex-col justify-between hover:bg-white/[0.04] hover:border-teal-400/30 transition-all cursor-default relative italic shadow-lg"
                       >
                                                 <div className="relative z-10 italic">
                              <div className="flex justify-between items-start mb-6 italic">
                                 <div className="flex items-center gap-4 italic">
                                    <div className="bg-teal-400 text-black p-3 rounded-2xl shadow-lg shadow-teal-400/20 italic">
                                       <tool.icon size={20} />
                                    </div>
                                    <div className="relative italic">
                                       <div 
                                          onMouseEnter={() => setHoveredDescription(tool.id)}
                                          onMouseLeave={() => setHoveredDescription(null)}
                                          className="text-white/20 hover:text-teal-400 cursor-help transition-colors italic"
                                       >
                                          <Info size={14} />
                                       </div>
                                       
                                       <AnimatePresence>
                                          {hoveredDescription === tool.id && (
                                             <motion.div 
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="absolute left-[calc(100%+24px)] top-[-10px] w-80 bg-[#0A0F14] border border-white/10 p-6 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] z-[200] backdrop-blur-3xl italic pointer-events-none"
                                             >
                                                <div className="flex items-center gap-2 mb-3 italic">
                                                   <div className="w-1.5 h-1.5 bg-teal-400 rounded-full italic" />
                                                   <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 italic">Module Insight</span>
                                                </div>
                                                <p className="text-[12px] font-bold text-white/60 leading-relaxed italic">{tool.tooltip}</p>
                                                <div className="absolute left-[-6px] top-[24px] w-3 h-3 bg-[#0A0F14] border-l border-b border-white/10 rotate-45 italic" />
                                             </motion.div>
                                          )}
                                       </AnimatePresence>
                                    </div>
                                 </div>
                                 <span className={clsx(
                                   "text-[9px] font-black px-2 py-0.5 rounded italic",
                                   completedToolId === tool.id ? "bg-emerald-400/20 text-emerald-400" : "bg-white/5 text-white/20"
                                )}>
                                   {completedToolId === tool.id ? 'VERIFIED' : `NODE_0${i+1}`}
                                </span>
                              </div>
                              
                              <h3 className="text-xl font-black italic tracking-tighter uppercase mb-2 text-white italic">{tool.name}</h3>
                              <p className="text-[12px] text-white/30 leading-snug font-medium italic mb-8 italic">{tool.description}</p>
                           </div>

                           <div className="relative z-10 space-y-2 italic">
                              <button 
                                 onClick={() => runTool(tool)}
                                 className={clsx(
                                    "flex items-center justify-between w-full px-5 py-3.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all italic",
                                    activeTool?.id === tool.id && running ? "bg-white/10 text-white cursor-wait" : "bg-white/5 hover:bg-white hover:text-black"
                                 )}
                                 disabled={running}
                              >
                                 {activeTool?.id === tool.id && running ? (
                                    <>ANALYZING... <Loader2 size={12} className="animate-spin" /></>
                                 ) : (
                                    <>Initialize <Play size={12} className="fill-current" /></>
                                 )}
                              </button>

                              {completedToolId === tool.id && !running && (
                                 <motion.button 
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    onClick={() => downloadDataset(tool.name)}
                                    className="flex items-center justify-between w-full bg-teal-400 text-black px-5 py-3.5 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-white transition-all italic"
                                 >
                                    Export Analysis <Download size={12} />
                                 </motion.button>
                              )}
                           </div>
                       </motion.div>
                    ))}
                  </AnimatePresence>
               </div>

               {/* Right Studio Console */}
               <div className="md:col-span-4 space-y-8 italic">
                  <div className="bg-black border border-white/5 rounded-[40px] p-12 sticky top-10 italic shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
                     <div className="flex items-center justify-between mb-12 italic">
                        <div className="flex items-center gap-4 italic">
                           <div className={clsx(
                              "w-3 h-3 rounded-full shadow-lg italic",
                              running ? "bg-teal-400 animate-pulse" : "bg-emerald-400"
                           )} />
                           <span className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40 italic">Neural Log Stream</span>
                        </div>
                        <Settings size={20} className="text-white/20 hover:text-white transition-colors cursor-pointer italic" />
                     </div>
                     
                     <div className="flex-1 space-y-10 italic">
                        {activeTool ? (
                           <div className="space-y-10 italic">
                              <div className="p-8 bg-white/[0.03] rounded-3xl border border-white/10 italic">
                                 <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 mb-4 italic">Active Process Context</p>
                                 <div className="flex items-center gap-6 italic">
                                    <div className="text-teal-400 bg-teal-400/10 p-4 rounded-2xl italic"><activeTool.icon size={24} /></div>
                                    <div className="italic">
                                       <h4 className="text-xl font-black uppercase italic tracking-tighter mb-1">{activeTool.name}</h4>
                                       <p className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">{activeTool.category} CORE</p>
                                    </div>
                                 </div>
                              </div>
                              
                              <div className="bg-black/80 border border-white/5 rounded-3xl p-8 font-mono text-[12px] h-[400px] overflow-y-auto space-y-4 custom-scrollbar italic shadow-inner">
                                 {logs.map((log, li) => (
                                    <motion.div 
                                       initial={{ opacity: 0, x: -10 }}
                                       animate={{ opacity: 1, x: 0 }}
                                       key={li} 
                                       className="flex gap-4 text-emerald-400/70 border-l border-emerald-400/20 pl-4 italic"
                                    >
                                       <span className="opacity-30 italic font-black">0{li}:</span>
                                       <span className="leading-relaxed">{log}</span>
                                    </motion.div>
                                 ))}
                                 {running && (
                                    <div className="flex items-center gap-3 text-teal-400 animate-pulse italic mt-6">
                                       <Loader2 size={12} className="animate-spin italic" />
                                       <span className="font-black uppercase tracking-widest text-[10px]">Processing Data Vectors...</span>
                                    </div>
                                 )}
                                 {!running && logs.length > 0 && (
                                    <div className="flex items-center gap-3 text-emerald-400 font-bold uppercase italic mt-6 bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20">
                                       <Check size={16} />
                                       <span className="tracking-widest text-[10px]">Sequence Finalized</span>
                                    </div>
                                 )}
                              </div>

                              <button 
                                 onClick={() => {
                                    const printWindow = window.open('', '_blank');
                                    if (printWindow) {
                                      printWindow.document.write(`
                                        <html>
                                          <head>
                                            <title>CruxM 360 - Neural Log: ${activeTool.name}</title>
                                            <style>
                                              body { background: #050a0f; color: #10b981; font-family: monospace; padding: 40px; }
                                              .header { border-bottom: 1px solid #10b981; padding-bottom: 20px; margin-bottom: 40px; color: white; }
                                              .log-line { margin-bottom: 12px; font-size: 14px; border-left: 2px solid #10b98122; padding-left: 15px; }
                                              .timestamp { opacity: 0.3; margin-right: 10px; }
                                            </style>
                                          </head>
                                          <body>
                                            <div class="header">
                                              <h2>CRUXM 360 // NEURAL_LOG_STREAM</h2>
                                              <p>TOOL: ${activeTool.name.toUpperCase()} // STATUS: FINALIZED</p>
                                              <p>DATE: ${new Date().toLocaleString()}</p>
                                            </div>
                                            ${logs.map((log, i) => `
                                              <div class="log-line">
                                                <span class="timestamp">0${i}:</span>
                                                <span>${log}</span>
                                              </div>
                                            `).join('')}
                                          </body>
                                        </html>
                                      `);
                                      printWindow.document.close();
                                      printWindow.print();
                                    }
                                 }}
                                 className="w-full bg-white text-black p-6 rounded-2xl font-black uppercase text-[12px] tracking-widest hover:bg-teal-400 transition-all shadow-xl italic"
                              >
                                 PRINT_CONSOLE_LOG
                              </button>
                           </div>
                        ) : (
                           <div className="flex-1 flex flex-col items-center justify-center text-center italic">
                              <div className="relative mb-10 italic">
                                 <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl animate-pulse italic" />
                                 <Box size={80} className="relative z-10 text-white/10 italic" />
                              </div>
                              <p className="text-[12px] font-black uppercase tracking-[0.5em] text-white/10 leading-loose italic">
                                 Awaiting neural <br/>initialization...
                              </p>
                              <p className="mt-8 text-[10px] font-black uppercase text-teal-400/30 tracking-widest italic animate-pulse group-hover:text-teal-400 transition-all">
                                 Select module to begin
                              </p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
   );
}
