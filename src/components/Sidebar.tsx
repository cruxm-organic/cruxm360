'use client';

import { 
  BarChart3, 
  Globe, 
  Key, 
  ShieldCheck, 
  Sparkles, 
  Settings, 
  LayoutDashboard,
  Menu,
  ChevronLeft,
  Terminal,
  Cpu,
  Zap,
  Box,
  Target,
  Command,
  Activity,
  LogOut,
  ChevronRight,
  Search,
  Link as LinkIcon,
  Users,
  Download,
  Info
} from 'lucide-react';
import LinkItem from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { 
    name: 'Market Overview', 
    icon: LayoutDashboard, 
    href: '/dashboard', 
    tag: 'DASHBOARD',
    tooltip: 'Real-time high-level SEO performance metrics and health score.'
  },
  { 
    name: 'Site Explorer', 
    icon: Search, 
    href: '/explorer', 
    tag: 'EXPLORER',
    tooltip: 'Deep-dive into indexed pages, response codes, and content load times.'
  },
  { 
    name: 'Backlink Profile', 
    icon: LinkIcon, 
    href: '/backlinks', 
    tag: 'LINKING',
    tooltip: 'Analyze referring domains, authority scores (DR), and anchor text distribution.'
  },
  { 
    name: 'Ranking Engine', 
    icon: Target, 
    href: '/keywords', 
    tag: 'TRACKING',
    tooltip: 'Track keyword ranking positions, search volume, and SERP history.'
  },
  { 
    name: 'Domain Compare', 
    icon: Users, 
    href: '/compare', 
    tag: 'BENCHMARK',
    tooltip: 'Compare technical and organic metrics against competitor domains.'
  },
  { 
    name: 'Content Health', 
    icon: ShieldCheck, 
    href: '/audit', 
    tag: 'SITE-AUDIT',
    tooltip: 'Technical SEO health check, crawler issues, and prioritization roadmap.'
  },
  { 
    name: 'Growth Roadmap', 
    icon: Sparkles, 
    href: '/ai-insights', 
    tag: 'AI-STRAT',
    tooltip: 'Neural AI-generated growth strategies and content optimization pivots.'
  },
  { 
    name: 'Marketing Arsenal', 
    icon: Box, 
    href: '/tools', 
    tag: 'SUB-ROUTINES',
    tooltip: 'Execute specialized intelligence tools for deep technical audits.'
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const downloadReport = () => {
     const domain = localStorage.getItem('active_domain') || 'domain';
     alert(`Preparing High-Fidelity SEO Intelligence Report for ${domain}.pdf... 🚀`);
  };

  return (
    <motion.aside 
      animate={{ width: collapsed ? 100 : 340 }}
      layout
      className="relative z-50 h-screen bg-[#050A0F] border-r border-white/5 flex flex-col p-6 transition-all overflow-hidden italic shadow-2xl"
    >
      {/* Top Header / Logo */}
      <div className="flex items-center justify-between mb-16 relative z-10">
        {!collapsed ? (
          <LinkItem href="/" className="flex items-center gap-4 group italic">
            <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center p-2 shadow-xl shadow-white/5 transition-all group-hover:scale-110 group-hover:rotate-6">
               <Globe size={24} strokeWidth={2.5} className="text-teal-500" />
            </div>
            <div className="flex flex-col italic">
               <span className="text-2xl font-black text-white leading-none tracking-tighter italic italic uppercase">CruxM<span className="text-teal-400">360</span></span>
               <span className="text-[8px] font-black text-white/30 tracking-[0.4em] uppercase mt-1 italic italic italic">Intelligence Suite</span>
            </div>
          </LinkItem>
        ) : (
          <div className="mx-auto w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 italic italic italic italic transition-all hover:border-teal-400/50">
             <Globe size={24} className="text-teal-500/50" />
          </div>
        )}
      </div>

      {/* Nav Section */}
      <nav className="space-y-3 flex-1 relative z-10 italic">
        {!collapsed && (
           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-8 pl-4 italic">Core SEO Services</p>
        )}
        
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <div key={item.name} className="relative italic">
               <LinkItem 
                  href={item.href}
                  className={clsx(
                  "group relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all outline-none italic",
                  isActive ? "bg-white/[0.06] text-white shadow-xl shadow-black/20" : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                  )}
               >
                  <div className={clsx(
                  "relative z-10 transition-all",
                  isActive ? "text-teal-400 scale-110" : "group-hover:text-white group-hover:scale-110"
                  )}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>

                  {!collapsed && (
                  <div className="flex-1 flex items-center justify-between italic">
                     <span className="text-[14px] font-black tracking-tight uppercase italic">{item.name}</span>
                     {!isActive && (
                        <div 
                           onMouseEnter={() => setHoveredItem(item.name)}
                           onMouseLeave={() => setHoveredItem(null)}
                           className="text-white/5 hover:text-teal-400 transition-colors p-1"
                        >
                           <Info size={14} />
                        </div>
                     )}
                     {isActive && (
                        <div className="flex items-center gap-2 italic">
                           <span className="text-[8px] font-black bg-teal-400/20 text-teal-400 px-2 py-0.5 rounded border border-teal-400/20 italic">LIVE</span>
                        </div>
                     )}
                  </div>
                  )}

                  {isActive && (
                  <motion.div 
                     layoutId="sidebar-active"
                     className="absolute inset-0 border-r-4 border-r-teal-400 rounded-2xl bg-gradient-to-r from-transparent to-teal-400/5" 
                  />
                  )}
               </LinkItem>

               {/* Professional Tooltip */}
               {!collapsed && hoveredItem === item.name && (
                  <motion.div 
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="absolute left-[280px] top-1/2 -translate-y-1/2 w-48 bg-[#0A0F14] border border-white/10 px-6 py-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[100] backdrop-blur-3xl italic pointer-events-none"
                  >
                     <p className="text-[10px] font-bold text-white/50 leading-relaxed italic tracking-tight">{item.tooltip}</p>
                     <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#0A0F14] border-l border-b border-white/10 rotate-45 italic" />
                  </motion.div>
               )}
            </div>
          );
        })}
      </nav>

      {/* Bottom Footer Section */}
      <div className="pt-8 mt-8 border-t border-white/5 relative z-10 italic">
        <button 
           onClick={downloadReport}
           className="w-full flex items-center gap-4 px-5 py-4 bg-teal-400 border border-teal-500 rounded-2xl text-black font-black uppercase text-[12px] tracking-widest hover:bg-white hover:border-white transition-all shadow-xl shadow-teal-400/20 mb-6 italic"
        >
           <Download size={18} />
           {!collapsed && <span>Master Report</span>}
        </button>

        <LinkItem 
          href="/settings"
          className={clsx(
            "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all text-white/40 hover:text-white hover:bg-white/[0.03] group italic",
            collapsed && "justify-center"
          )}
        >
          <div className="transition-all group-hover:rotate-90 group-hover:scale-110 italic">
             <Settings size={22} strokeWidth={2} />
          </div>
          {!collapsed && <span className="text-[14px] font-black uppercase tracking-tight italic">Campaign Config</span>}
        </LinkItem>
        
        {!collapsed && (
           <div className="mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-3xl relative overflow-hidden group hover:border-teal-400/30 transition-all italic">
              <Zap size={40} className="absolute -right-4 -top-4 text-teal-400 opacity-10 group-hover:rotate-12 transition-transform italic" />
              <div className="flex items-center gap-2 mb-2 italic">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse italic" />
                 <p className="text-[10px] font-black uppercase opacity-40 tracking-widest italic">Neural Engine Status</p>
              </div>
              <p className="text-[11px] font-black uppercase tracking-tighter text-white italic">Active Research Mode</p>
           </div>
        )}

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="mt-8 w-full flex items-center justify-center p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white/20 hover:text-white hover:bg-white/[0.06] transition-all italic"
        >
          {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2 italic"><ChevronLeft size={20} /> <span className="text-[10px] font-black uppercase tracking-widest">Collapse View</span></div>}
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex flex-col items-center justify-center gap-2 italic">
         <div className="flex items-center gap-2 italic">
            <Activity size={12} className="text-teal-400 italic" />
            {!collapsed && <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em] italic">Agency Pro v1.0.4</span>}
         </div>
      </div>
    </motion.aside>
  );
}
