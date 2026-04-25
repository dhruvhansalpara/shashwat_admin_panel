import { AdminSidebar } from './AdminSidebar';
import { Outlet } from 'react-router-dom';

interface AdminLayoutProps {
  onLogout: () => void;
}

export function AdminLayout({ onLogout }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background font-sans selection:bg-primary/10 selection:text-primary">
      {/* Sidebar */}
      <AdminSidebar onLogout={onLogout} />
      
      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.4] pointer-events-none" />
        
        <div className="relative z-10 p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
