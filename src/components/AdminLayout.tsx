import { AdminSidebar } from './AdminSidebar';
import { Outlet } from 'react-router-dom';

interface AdminLayoutProps {
  onLogout: () => void;
}

export function AdminLayout({ onLogout }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background font-sans selection:bg-primary/10">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8 justify-between shrink-0 sticky top-0 z-10 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800">Dashboard</h2>
          <div className="flex items-center gap-4">
             <ThemeToggle />
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
