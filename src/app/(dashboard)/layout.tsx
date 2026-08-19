import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050A0F] text-white selection:bg-teal-400 selection:text-black">
      {/* Persistent Backdrop Elements for High Fidelity */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-500/5 blur-[160px] animate-pulse rounded-full" />
        <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-purple-500/5 blur-[160px] animate-pulse delay-1000 rounded-full" />
        <div className="absolute inset-0 bg-grid opacity-5" />
      </div>

      <Sidebar />
      <main className="relative z-10 flex-1 h-screen overflow-y-auto overflow-x-hidden border-l border-white/5 scroll-smooth">
         {children}
      </main>
    </div>
  );
}
