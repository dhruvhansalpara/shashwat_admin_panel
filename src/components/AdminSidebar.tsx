import { LayoutDashboard, Package, Image as ImageIcon, MessageSquare, Settings, LogOut, ChevronRight, MapPin, Car as CarIcon, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdmin } from '@/context/AdminContext';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'motion/react';

const superAdminItems = [
  { icon: Users, label: 'Manage Admins', path: '/admin/users' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export function AdminSidebar({ className, packages = [], destinations = [], cars = [], banners = [], inquiries = [] }: { 
  className?: string,
  packages?: any[], 
  destinations?: any[], 
  cars?: any[], 
  banners?: any[], 
  inquiries?: any[] 
}) {
  const { logout, user } = useAdmin();
  const navigate = useNavigate();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Packages', path: '/admin/packages', count: packages.length },
    { icon: MapPin, label: 'Destinations', path: '/admin/destinations', count: destinations.length },
    { icon: CarIcon, label: 'Fleet', path: '/admin/cars', count: cars.length },
    { icon: ImageIcon, label: 'Banners', path: '/admin/banners', count: banners.length },
    { icon: MessageSquare, label: 'Inquiries', path: '/admin/inquiries', count: inquiries.length },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className={cn("w-72 bg-gradient-to-b from-[#001a1a] via-[#002b2b] to-[#001a1a] flex flex-col h-screen sticky top-0 z-50 border-r border-white/5 shadow-2xl", className)}>
      <div className="p-10 pb-12">
        <NavLink to="/admin" className="block transform transition-all active:scale-95">
          <Logo className="scale-[1.2] origin-left brightness-0 invert" variant="light" />
        </NavLink>
      </div>
      
      <nav className="flex-1 px-6 py-2 space-y-2 overflow-y-auto scrollbar-hide">
        <div className="px-5 mb-6 mt-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-display opacity-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,150,136,0.5)]" />
            Core Modules
          </p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-5 px-6 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.15em] group relative font-display overflow-hidden",
                isActive 
                  ? "text-white bg-white/10 shadow-xl border border-white/10" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              )
            }
          >
            {({ isActive }) => (
              <div className="flex items-center gap-5 w-full h-full z-10 relative">
                <item.icon className={cn(
                  "w-4 h-4 transition-all duration-300", 
                  isActive ? "scale-110 text-primary" : "group-hover:scale-110 group-hover:text-primary"
                )} strokeWidth={3} />
                <span className="flex-1 leading-none">{item.label}</span>
                {item.count !== undefined && (
                  <Badge className={cn(
                    "px-3 py-1 rounded-full text-[12px] font-black border-none transition-all shadow-md min-w-[32px] flex justify-center", 
                    isActive 
                      ? "bg-primary text-white shadow-primary/20" 
                      : "bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white"
                  )}>
                    {item.count}
                  </Badge>
                )}
                {isActive && (
                  <>
                    <div className="absolute -left-6 w-1.5 h-full bg-primary rounded-r-full shadow-[4px_0_15px_rgba(0,150,136,0.5)]" />
                    <div className="absolute inset-0 bg-primary/10 -z-10 blur-xl" />
                  </>
                )}
              </div>
            )}
          </NavLink>
        ))}

        {user?.role === 'super_admin' && (
          <div className="pt-12">
            <div className="px-5 mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 font-display opacity-100 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary shadow-[0_0_8px_rgba(233,30,99,0.5)]" />
                System Control
              </p>
            </div>
            {superAdminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-5 px-6 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.15em] group relative font-display overflow-hidden",
                    isActive 
                      ? "text-white bg-white/10 shadow-xl border border-white/10" 
                      : "text-slate-500 hover:text-white hover:bg-white/5"
                  )
                }
              >
                {({ isActive }) => (
                  <div className="flex items-center gap-5 w-full h-full z-10 relative">
                    <item.icon className={cn(
                      "w-4 h-4 transition-all duration-300", 
                      isActive ? "scale-110 text-secondary" : "group-hover:scale-110 group-hover:text-secondary"
                    )} strokeWidth={3} />
                    <span className="flex-1 leading-none">{item.label}</span>
                    {isActive && (
                      <>
                        <div className="absolute -left-6 w-1.5 h-full bg-secondary rounded-r-full shadow-[4px_0_15px_rgba(233,30,99,0.5)]" />
                        <div className="absolute inset-0 bg-secondary/10 -z-10 blur-xl" />
                      </>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 mt-auto space-y-3 border-t border-white/5">
        <div className="p-4 rounded-2xl bg-white/[0.08] border border-white/10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-black text-sm uppercase shadow-lg shadow-primary/20">
            {user?.name?.charAt(0) || 'S'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black truncate text-white uppercase tracking-tight leading-none mb-1.5">{user?.name || 'Super Admin'}</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-300">
                {user?.role === 'super_admin' ? 'System Master' : 'Operator'}
              </p>
            </div>
          </div>
        </div>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-12 px-5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-400/5 transition-all font-black uppercase tracking-[0.2em] text-[10px]"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
