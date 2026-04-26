import { LayoutDashboard, Package, Image as ImageIcon, MessageSquare, Settings, LogOut, ChevronRight, MapPin, Car as CarIcon, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/context/AdminContext';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Package, label: 'Packages', path: '/admin/packages' },
  { icon: MapPin, label: 'Destinations', path: '/admin/destinations' },
  { icon: CarIcon, label: 'Fleet', path: '/admin/cars' },
  { icon: ImageIcon, label: 'Banners', path: '/admin/banners' },
  { icon: MessageSquare, label: 'Inquiries', path: '/admin/inquiries' },
];

const superAdminItems = [
  { icon: Users, label: 'Manage Admins', path: '/admin/users' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export function AdminSidebar() {
  const { logout, user } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="w-72 bg-[#0f172a] flex flex-col h-screen sticky top-0 z-50">
      <div className="p-8 pb-10">
        <NavLink to="/admin" className="block transform transition-all hover:scale-[1.02] active:scale-95">
          <Logo className="scale-100 origin-left" variant="light" />
        </NavLink>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto scrollbar-hide">
        <div className="px-5 mb-4 mt-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-display opacity-80">Main Menu</p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all text-[11px] font-black uppercase tracking-[0.1em] group relative font-display",
                isActive 
                  ? "bg-primary text-white shadow-[0_12px_24px_rgba(0,150,136,0.2)] z-10 border-l-4 border-white" 
                  : "text-slate-400 hover:text-white hover:bg-white/10 hover:translate-x-1 border-l-4 border-transparent hover:border-[#009688]"
              )
            }
          >
            <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={2.5} />
            <span className="flex-1 leading-none">{item.label}</span>
          </NavLink>
        ))}

        {user?.role === 'super_admin' && (
          <div className="pt-10">
            <div className="px-5 mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-display opacity-80">Administration</p>
            </div>
            {superAdminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all text-[11px] font-black uppercase tracking-[0.1em] group relative font-display",
                    isActive 
                      ? "bg-primary text-white shadow-[0_12px_24px_rgba(0,150,136,0.2)] z-10 border-l-4 border-white" 
                      : "text-slate-400 hover:text-white hover:bg-white/10 hover:translate-x-1 border-l-4 border-transparent hover:border-[#009688]"
                  )
                }
              >
                <item.icon className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={2.5} />
                <span className="flex-1 leading-none">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 shadow-sm mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-xs uppercase">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black truncate text-white uppercase tracking-tight">{user?.name || 'Super Admin'}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[9px] font-black uppercase tracking-tighter text-slate-500">
                  {user?.role === 'super_admin' ? 'SUPER ADMIN' : 'OPERATOR'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-10 px-4 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all font-black uppercase tracking-widest text-[10px]"
          onClick={handleLogout}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
