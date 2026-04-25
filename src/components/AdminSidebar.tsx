import { LayoutDashboard, Package, Image as ImageIcon, MessageSquare, Settings, LogOut, ChevronRight, MapPin, Car as CarIcon, Users } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/context/AdminContext';
import { Logo } from './Logo';

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
    <div className="w-64 border-r bg-card/50 backdrop-blur-xl flex flex-col h-screen sticky top-0">
      <div className="p-8 pb-4">
        <NavLink to="/admin" className="block transform transition-transform hover:scale-[1.02]">
          <Logo className="scale-110 origin-left" />
        </NavLink>
      </div>
      
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        <div className="px-4 mb-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Operations</p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium text-sm flex-1">{item.label}</span>
            <ChevronRight className={cn(
              "w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1",
              "group-[.bg-primary]:opacity-100 group-[.bg-primary]:translate-x-0"
            )} />
          </NavLink>
        ))}

        {user?.role === 'super_admin' && (
          <div className="pt-4 pb-2">
            <div className="px-4 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">System</p>
            </div>
            {superAdminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )
                }
              >
                <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                <span className="font-medium text-sm flex-1">{item.label}</span>
                <ChevronRight className={cn(
                  "w-4 h-4 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1",
                  "group-[.bg-primary]:opacity-100 group-[.bg-primary]:translate-x-0"
                )} />
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="p-6 mt-auto">
        <div className="bg-muted/30 rounded-2xl p-4 mb-6">
          <p className="text-xs font-bold truncate">{user?.name || 'Admin User'}</p>
          <p className="text-[10px] text-muted-foreground/60 mt-1 uppercase tracking-widest font-bold">
            {user?.role === 'super_admin' ? 'Super Admin' : 'Administrator'}
          </p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-xl transition-colors h-11"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log out</span>
        </Button>
      </div>
    </div>
  );
}
