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
    <div className="w-64 border-r border-slate-800 bg-slate-900 text-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center justify-between border-b border-slate-800">
        <NavLink to="/admin" className="block transform transition-transform hover:scale-[1.02]">
          <Logo className="scale-90 origin-left" />
        </NavLink>
      </div>
      
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Operations</p>
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                isActive 
                  ? "bg-primary text-white" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            <span className="flex-1">{item.label}</span>
          </NavLink>
        ))}

        {user?.role === 'super_admin' && (
          <div className="pt-4 pb-2">
            <div className="px-3 mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">System</p>
            </div>
            {superAdminItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium",
                    isActive 
                      ? "bg-primary text-white" 
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold truncate text-white">{user?.name || 'Admin User'}</p>
          <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">
            {user?.role === 'super_admin' ? 'Super Admin' : 'Administrator'}
          </p>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-slate-400 hover:text-red-400 hover:bg-red-900/20 text-sm mt-1"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
}
