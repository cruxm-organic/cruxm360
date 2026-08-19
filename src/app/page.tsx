'use client';

import { useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  Globe, 
  Sparkles, 
  Target,
  ShieldCheck,
  BarChart3,
  Cpu,
  Activity,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Home() {
   const [domain, setDomain] = useState('');
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [error, setError] = useState('');
   const router = useRouter();

   const handleStartAnalysis = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!domain) return;
      
      setIsAnalyzing(true);
      setError('');

      try {
         // 1. Trigger the real-time audit engine
         const res = await fetch('/api/run-audit', {
            method: 'POST',
            body: JSON.stringify({ url: domain }),
            headers: { 'Content-Type': 'application/json' }
         });
         
         const data = await res.json();
         
         if (data.error && !data.domain) {
            setError(data.error);
            setIsAnalyzing(false);
            return;
         }

         // 2. Store active domain and redirect
         localStorage.setItem('active_domain', data.domain || domain);
         router.push(`/dashboard?domain=${data.domain || domain}`);
      } catch (err) {
         setError('Connection to CRUXM Engine timed out. Try again.');
         setIsAnalyzing(false);
      }
   };

   return (
      <div className="relative min-h-screen bg-[#050A0F] text-white selection:bg-teal-400 selection:text-black italic overflow-hidden">
         
         {/* Premium Backdrop */}
         <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-[20%] left-[-10%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[160px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[160px] animate-pulse delay-700" />
            <div className="absolute inset-0 bg-grid opacity-5" />
         </div>

         {/* Navigation Bar */}
         <nav className="relative z-50 flex items-center justify-between px-10 py-8 border-b border-white/5 italic">
            <div className="flex items-center gap-4 group italic">
               <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center p-2 shadow-xl shadow-white/5 transition-all group-hover:rotate-12 italic italic italic">
                  <Globe size={20} className="text-teal-500" />
               </div>
               <span className="text-2xl font-black text-white italic italic italic uppercase tracking-tighter">CruxM<span className="text-teal-400">360</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-10 italic italic italic">
               <a href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all italic italic italic italic">Solutions</a>
               <a href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all italic italic italic italic">Intelligence</a>
               <a href="#" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white transition-all italic italic italic italic">Scale</a>
            </div>

            <Link href="/dashboard" className="bg-white/5 border border-white/10 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all italic italic italic italic">
               Login to Console
            </Link>
         </nav>

         {/* Hero Section */}
         <main className="relative z-10 container mx-auto px-10 pt-32 pb-48 italic">
            <div className="max-w-[1200px] mx-auto text-center space-y-12 italic italic italic">
               
               {/* Headline Cluster */}
               <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6 italic italic italic italic"
               >
                  <div className="inline-flex items-center gap-2 bg-teal-400/10 text-teal-400 px-4 py-2 rounded-full border border-teal-400/20 mb-6 italic italic italic italic italic">
                     <Sparkles size={14} className="animate-pulse italic italic italic italic italic italic" />
                     <span className="text-[10px] font-black uppercase tracking-widest italic italic italic italic italic italic italic">Powered by CruxM.com</span>
                  </div>
                  <h1 className="text-7xl md:text-[140px] font-black italic tracking-tighter uppercase leading-[0.85] italic italic italic italic italic">
                     Find What is <br />
                     <span className="bg-gradient-to-r from-teal-400 via-white to-teal-400 bg-clip-text text-transparent italic italic italic italic italic italic">Holding You Back</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-white/40 font-medium max-w-2xl mx-auto uppercase tracking-tight italic italic italic italic italic italic">
                     The 360 degree SEO Intelligence Solution for Professionals.
                  </p>
               </motion.div>

               {/* Core Action: Domain Input */}
               <motion.form 
                  onSubmit={handleStartAnalysis}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="relative max-w-3xl mx-auto group italic italic italic italic"
               >
                  <div className="absolute -inset-2 bg-teal-400/20 blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none italic italic italic italic italic" />
                  <div className="relative flex flex-col md:flex-row gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-[32px] backdrop-blur-xl italic italic italic italic italic">
                     <div className="flex-1 relative italic italic italic italic italic italic">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-white/20 italic italic italic italic italic italic italic" size={24} />
                        <input 
                           type="text" 
                           value={domain}
                           onChange={(e) => setDomain(e.target.value)}
                           disabled={isAnalyzing}
                           placeholder="Enter target domain URL"
                           className="w-full bg-transparent p-6 pl-20 rounded-2xl text-xl font-bold outline-none focus:placeholder:opacity-10 transition-all placeholder:opacity-30 placeholder:uppercase placeholder:text-xs placeholder:tracking-widest italic italic italic italic italic italic italic"
                        />
                     </div>
                     <button 
                        type="submit"
                        disabled={isAnalyzing}
                        className="bg-white text-black px-12 py-6 rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-teal-400 transition-all shadow-2xl shadow-white/5 active:scale-95 disabled:opacity-50 italic italic italic italic italic italic"
                     >
                        {isAnalyzing ? <><Loader2 className="animate-spin" size={18} /> Analyzing...</> : <><Target size={18} /> Start analysis <ArrowRight size={18} /></>}
                     </button>
                  </div>
                  {error && <p className="mt-4 text-orange-400 font-bold text-xs uppercase tracking-widest animate-bounce italic">{error}</p>}
               </motion.form>

               {/* Philosophy Banner */}
               <div className="flex flex-wrap justify-center gap-12 pt-20 italic italic italic italic">
                  <FeatureLink icon={<Cpu size={16} />} text="Deep Neural Crawl" />
                  <FeatureLink icon={<Activity size={16} />} text="Live SERP Tracking" />
                  <FeatureLink icon={<ShieldCheck size={16} />} text="Technical Health Audit" />
                  <FeatureLink icon={<BarChart3 size={16} />} text="Predictive Strategy" />
               </div>
            </div>
         </main>

         {/* Final CTA Footer */}
         <footer className="relative z-10 border-t border-white/5 p-20 text-center italic italic">
            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.6em] mb-10 italic italic italic italic">CruxM 360 — Built for the next generation of marketing engineers.</p>
            <div className="flex justify-center gap-10 opacity-30 italic italic italic italic italic">
               <span className="font-black italic italic italic italic italic italic italic uppercase tracking-widest">CruxM.com</span>
               <span className="font-black italic italic italic italic italic italic italic uppercase tracking-widest">360 SEO ENGINE</span>
               <span className="font-black italic italic italic italic italic italic italic uppercase tracking-widest">Neural Suite</span>
            </div>
         </footer>

      </div>
   );
}

function FeatureLink({ icon, text }: any) {
   return (
      <div className="flex items-center gap-3 text-white/30 hover:text-teal-400 transition-all cursor-crosshair group italic italic italic">
         <div className="group-hover:scale-125 transition-transform italic italic italic italic">{icon}</div>
         <span className="text-[10px] font-black uppercase tracking-widest italic italic italic italic">{text}</span>
      </div>
   );
}
