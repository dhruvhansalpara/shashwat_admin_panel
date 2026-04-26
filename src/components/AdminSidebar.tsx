import { LayoutDashboard, Package, Image as ImageIcon, MessageSquare, Settings, LogOut, ChevronRight, MapPin, Car as CarIcon, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
    <div className="w-64 border-r border-white/5 bg-[#0F172A] text-slate-200 flex flex-col h-screen sticky top-0 shadow-2xl">
      <div className="p-6 flex items-center justify-between border-b border-white/5">
        <NavLink to="/admin" className="block transform transition-transform hover:scale-[1.02]">
          <Logo className="scale-90 origin-left" variant="light" />
        </NavLink>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Main Menu</p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )
            }
          >
            <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="flex-1">{item.label}</span>
            <ChevronRight className={cn("w-3 h-3 opacity-0 transition-all -translate-x-2", "group-hover:opacity-100 group-hover:translate-x-0")} />
          </NavLink>
        ))}

        {user?.role === 'super_admin' && (
          <div className="pt-6">
            <div className="px-3 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Administration</p>
            </div>
            {superAdminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold",
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )
                }
              >
                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className={cn("w-3 h-3 opacity-0 transition-all -translate-x-2", "group-hover:opacity-100 group-hover:translate-x-0")} />
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5 bg-black/20">
        <div className="px-4 py-3 bg-white/5 rounded-xl mb-3">
          <p className="text-xs font-bold truncate text-white">{user?.name || 'Admin User'}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
              {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-sm rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="font-semibold">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
