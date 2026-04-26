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
    <div className={cn("w-72 bg-[#001a1a] flex flex-col h-screen sticky top-0 z-50 border-r border-white/5", className)}>
      <div className="p-10 pb-12">
        <NavLink to="/admin" className="block transform transition-all active:scale-95">
          <Logo className="scale-[1.2] origin-left brightness-0 invert" variant="light" />
        </NavLink>
      </div>
      
      <nav className="flex-1 px-6 py-2 space-y-2 overflow-y-auto scrollbar-hide">
        <div className="px-5 mb-6 mt-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#009688] font-display opacity-100">Core Modules</p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-5 px-6 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.15em] group relative font-display overflow-hidden active:scale-95",
                isActive 
                  ? "text-white" 
                  : "text-slate-500 hover:text-white hover:bg-white/5"
              )
            }
          >
            {({ isActive }) => (
              <motion.div 
                whileHover={{ x: 6 }} 
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex items-center gap-5 w-full h-full z-10"
              >
                <item.icon className={cn("w-4 h-4 transition-all", isActive ? "scale-110 text-[#009688]" : "group-hover:scale-110")} strokeWidth={3} />
                <span className="flex-1 leading-none">{item.label}</span>
                {item.count !== undefined && (
                  <Badge variant="secondary" className="px-2 py-0.5 rounded-full text-[9px] bg-white/10 text-white font-black">
                    {item.count}
                  </Badge>
                )}
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-[#009688]/15 border-l-4 border-[#009688] -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.div>
            )}
          </NavLink>
        ))}

        {user?.role === 'super_admin' && (
          <div className="pt-12">
            <div className="px-5 mb-6">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#009688] font-display opacity-100">System Control</p>
            </div>
            {superAdminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-5 px-6 py-4 rounded-2xl transition-all text-[11px] font-black uppercase tracking-[0.15em] group relative font-display overflow-hidden active:scale-95",
                    isActive 
                      ? "text-white" 
                      : "text-slate-500 hover:text-white hover:bg-white/5"
                  )
                }
              >
                {({ isActive }) => (
                  <motion.div 
                    whileHover={{ x: 6 }} 
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex items-center gap-5 w-full h-full z-10"
                  >
                    <item.icon className={cn("w-4 h-4 transition-all", isActive ? "scale-110 text-[#009688]" : "group-hover:scale-110")} strokeWidth={3} />
                    <span className="flex-1 leading-none">{item.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="active-nav"
                        className="absolute inset-0 bg-[#009688]/15 border-l-4 border-[#009688] -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="p-6 mt-auto space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#009688] flex items-center justify-center text-white font-black text-sm uppercase shadow-lg shadow-[#009688]/20">
              {user?.name?.charAt(0) || 'S'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-black truncate text-white uppercase tracking-tight leading-none mb-1.5">{user?.name || 'Super Admin'}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#009688] animate-pulse shadow-[0_0_8px_rgba(0,150,136,1)]" />
                <p className="text-[9px] font-black uppercase tracking-widest text-[#009688]">
                  {user?.role === 'super_admin' ? 'Level 5' : 'Operator'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 h-14 px-6 rounded-2xl text-slate-500 hover:text-rose-400 hover:bg-rose-400/5 transition-all font-black uppercase tracking-[0.2em] text-[10px]"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </Button>
      </div>

    </div>
  );
}
