import { AdminSidebar } from './AdminSidebar';
import { Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  onLogout: () => void;
}

export function AdminLayout({ onLogout }: AdminLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background font-sans selection:bg-primary/10 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col h-screen scrollbar-hide">
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center px-16 justify-between shrink-0 sticky top-0 z-30">
          <div className="flex flex-col">
            <h2 className="text-[10px] font-black text-[#009688] uppercase tracking-[0.4em] font-display mb-1 opacity-80">Operational Registry</h2>
            <div className="font-black text-slate-800 uppercase tracking-tighter text-2xl italic font-display leading-none">System Operational</div>
          </div>
          <div className="flex items-center gap-10">
             <div className="hidden lg:flex items-center gap-8">
                <div className="flex flex-col items-end">
                   <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Network Link</p>
                   <p className="text-[10px] font-black text-[#009688] uppercase flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-[#009688] animate-pulse" />
                     ESTABLISHED
                   </p>
                </div>
                <div className="h-10 w-px bg-slate-100" />
             </div>
             <ThemeToggle />
          </div>
        </header>

        <div className="p-12 max-w-[1600px] mx-auto w-full flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: 0.4,
                ease: [0.23, 1, 0.32, 1] 
              }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
