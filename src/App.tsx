import * as React from 'react';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Types
import { Package, Banner, Destination, Car, Inquiry, Settings } from './types';

// Context
import { AdminProvider, useAdmin } from './context/AdminContext';

// Public Pages
import { PublicHome } from './pages/PublicHome';
import { DestinationsPage } from './pages/Destinations';
import { TourDetails } from './pages/TourDetails';
import { PublicCarRental } from './pages/PublicCarRental';

// Admin Components & Pages
import { AdminSidebar } from './components/AdminSidebar';
import { Dashboard } from './pages/admin/Dashboard';
import { PackagesPage } from './pages/admin/Packages';
import { BannersPage } from './pages/admin/Banners';
import { DestinationsPage as DestinationsAdminPage } from './pages/admin/Destinations';
import { CarsPage } from './pages/admin/Cars';
import { InquiriesPage } from './pages/admin/Inquiries';
import { SettingsPage } from './pages/admin/Settings';
import AdminManagement from './pages/admin/AdminManagement';
import { LoginPage } from './pages/admin/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/banners'),
        fetch('/api/destinations'),
        fetch('/api/cars'),
        fetch('/api/inquiries'),
        fetch('/api/settings')
      ]);

      const [pkgs, bnrs, dests, crs, inqs, sets] = await Promise.all(
        responses.map(async (r) => {
          if (!r.ok) throw new Error(`Failed to fetch: ${r.statusText}`);
          return r.json();
        })
      );

      setPackages(pkgs);
      setBanners(bnrs);
      setDestinations(dests);
      setCars(crs);
      setInquiries(inqs);
      setSettings(sets);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Admin Wrapper
  const AdminLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Decorative background blobs - matching website aesthetics */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto relative z-10 scrollbar-hide">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );

  // Authenticated Actions
  const handleAuthAction = async (url: string, method: string, body: any, successMsg: string, token: string | null) => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        toast.success(successMsg);
        fetchData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || `Failed to ${method.toLowerCase()}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-secondary rounded-full animate-ping" />
            </div>
          </div>
          <p className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 animate-pulse">Shashwat Holidays</p>
        </div>
      </div>
    );
  }

  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          {/* Launch directly to Admin Login */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          
          {/* Public Routes */}
          <Route path="/home" element={
            <PublicHome 
              banners={banners} 
              destinations={destinations} 
              packages={packages} 
              onInquiry={(inq) => handleAuthAction('/api/inquiries', 'POST', inq, "Inquiry sent", null)}
              whatsappNumber={settings?.whatsappNumber || '919876543210'}
              defaultMessage={settings?.defaultMessage || 'Hello'}
            />
          } />
          <Route path="/destinations" element={<DestinationsPage destinations={destinations} />} />
          <Route path="/tours/:id" element={
            <TourDetails 
              packages={packages} 
              onInquiry={(inq) => handleAuthAction('/api/inquiries', 'POST', inq, "Inquiry sent", null)}
              whatsappNumber={settings?.whatsappNumber || '919876543210'}
            />
          } />
          <Route path="/rentals" element={
            <PublicCarRental 
              cars={cars} 
              whatsappNumber={settings?.whatsappNumber || '919876543210'}
            />
          } />

          {/* Admin Auth */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard 
                  stats={{
                    totalPackages: packages.length,
                    totalBanners: banners.length,
                    totalInquiries: inquiries.length,
                    totalDestinations: destinations.length
                  }}
                  recentInquiries={Array.isArray(inquiries) ? inquiries.slice(0, 5) : []}
                  topPackages={packages.slice(0, 4)}
                />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/packages" element={
            <ProtectedRoute>
              <AuthPageWrapper 
                fetchData={fetchData} 
                component={PackagesPage} 
                props={{ packages, destinations }} 
                actionHandlers={{ 
                  onAdd: (pkg: any, token: string) => handleAuthAction('/api/packages', 'POST', pkg, "Package added", token),
                  onEdit: (id: string, pkg: any, token: string) => handleAuthAction(`/api/packages/${id}`, 'PUT', pkg, "Package updated", token),
                  onDelete: (id: string, token: string) => handleAuthAction(`/api/packages/${id}`, 'DELETE', null, "Package deleted", token)
                }} 
              />
            </ProtectedRoute>
          } />

          <Route path="/admin/banners" element={
            <ProtectedRoute>
              <AuthPageWrapper 
                fetchData={fetchData} 
                component={BannersPage} 
                props={{ banners }} 
                actionHandlers={{ 
                  onAdd: (bnr: any, token: string) => handleAuthAction('/api/banners', 'POST', bnr, "Banner added", token),
                  onDelete: (id: string, token: string) => handleAuthAction(`/api/banners/${id}`, 'DELETE', null, "Banner deleted", token)
                }} 
              />
            </ProtectedRoute>
          } />

          <Route path="/admin/destinations" element={
            <ProtectedRoute>
              <AuthPageWrapper 
                fetchData={fetchData} 
                component={DestinationsAdminPage} 
                props={{ destinations, packages }} 
                actionHandlers={{ 
                  onAdd: (dest: any, token: string) => handleAuthAction('/api/destinations', 'POST', dest, "Destination added", token),
                  onEdit: (id: string, dest: any, token: string) => handleAuthAction(`/api/destinations/${id}`, 'PUT', dest, "Destination updated", token),
                  onDelete: (id: string, token: string) => handleAuthAction(`/api/destinations/${id}`, 'DELETE', null, "Destination deleted", token)
                }} 
              />
            </ProtectedRoute>
          } />

          <Route path="/admin/cars" element={
            <ProtectedRoute>
              <AuthPageWrapper 
                fetchData={fetchData} 
                component={CarsPage} 
                props={{ cars }} 
                actionHandlers={{ 
                  onAdd: (car: any, token: string) => handleAuthAction('/api/cars', 'POST', car, "Car added", token),
                  onEdit: (id: string, car: any, token: string) => handleAuthAction(`/api/cars/${id}`, 'PUT', car, "Car updated", token),
                  onDelete: (id: string, token: string) => handleAuthAction(`/api/cars/${id}`, 'DELETE', null, "Car deleted", token)
                }} 
              />
            </ProtectedRoute>
          } />

          <Route path="/admin/inquiries" element={
            <ProtectedRoute>
              <AdminLayout>
                <InquiriesPage 
                  inquiries={inquiries} 
                  onDelete={(id) => handleAuthAction(`/api/inquiries/${id}`, 'DELETE', null, "Inquiry deleted", null)}
                />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/settings" element={
            <ProtectedRoute superAdminOnly>
              <AuthPageWrapper 
                fetchData={fetchData} 
                component={SettingsPage} 
                props={{ settings: settings || { whatsappNumber: '', defaultMessage: '', allowLogin: true, allowedEmails: [], siteName: 'Shashwat Holidays' } }} 
                actionHandlers={{ 
                  onUpdate: (sets: any, token: string) => handleAuthAction('/api/settings', 'PUT', sets, "Settings updated", token)
                }} 
              />
            </ProtectedRoute>
          } />

          <Route path="/admin/users" element={
            <ProtectedRoute superAdminOnly>
              <AdminLayout><AdminManagement /></AdminLayout>
            </ProtectedRoute>
          } />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AdminProvider>
  );
}

// Helper to pass token to action handlers
function AuthPageWrapper({ component: Component, props, actionHandlers }: any) {
  const { token } = useAdmin();
  
  const wrappedHandlers = Object.keys(actionHandlers).reduce((acc: any, key: string) => {
    acc[key] = (...args: any[]) => actionHandlers[key](...args, token);
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto relative z-10 scrollbar-hide">
        <div className="max-w-7xl mx-auto">
          <Component {...props} {...wrappedHandlers} />
        </div>
      </main>
    </div>
  );
}
