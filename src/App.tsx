/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AdminLayout } from './components/AdminLayout';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/admin/Dashboard';
import { PackagesPage } from './pages/admin/Packages';
import { BannersPage } from './pages/admin/Banners';
import { InquiriesPage } from './pages/admin/Inquiries';
import { SettingsPage } from './pages/admin/Settings';
import { LoginPage } from './pages/admin/Login';
import { PublicHome } from './pages/PublicHome';
import { TourDetails } from './pages/TourDetails';
import { DestinationsPage as PublicDestinations } from './pages/Destinations';
import { DestinationsPage as AdminDestinations } from './pages/admin/Destinations';
import { Package, Banner, Inquiry, Settings, Destination, OperationType, Car } from './types';
import { CarsPage } from './pages/admin/Cars';
import { PublicCarRental } from './pages/PublicCarRental';
import { toast } from 'sonner';
import { auth, db, handleFirestoreError } from './lib/firebase';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { io } from 'socket.io-client';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  query, 
  orderBy,
  setDoc,
  getDoc
} from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [settings, setSettings] = useState<Settings>({
    whatsappNumber: '919876543210',
    defaultMessage: 'Hello Shashwa Holidays,',
    updatedAt: new Date().toISOString()
  });
  const [loginError, setLoginError] = useState<string | null>(null);

  // Auth Listener
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoadingAuth(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(timeout);
      setUser(currentUser);
      setIsLoadingAuth(false);
    });
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  // API Data Fetching
  const fetchData = async () => {
    try {
      const responses = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/banners'),
        fetch('/api/destinations'),
        fetch('/api/settings'),
        fetch('/api/cars')
      ]);

      const [pkgs, bnrs, dests, sets, crs] = await Promise.all(responses.map(r => r.json()));
      
      setPackages(Array.isArray(pkgs) ? pkgs : []);
      setBanners(Array.isArray(bnrs) ? bnrs : []);
      setDestinations(Array.isArray(dests) ? dests : []);
      setCars(Array.isArray(crs) ? crs : []);
      if (sets && sets.whatsappNumber) setSettings(sets);
    } catch (err) {
      console.error("Error fetching data from MySQL API:", err);
    }
  };

  const fetchInquiries = async () => {
    if (!user) return;
    try {
      const res = await fetch('/api/inquiries');
      const inqs = await res.json();
      setInquiries(Array.isArray(inqs) ? inqs : []);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    }
  };

  useEffect(() => {
    fetchData();
    if (user) fetchInquiries();

    const socket = io();
    
    const handleSync = () => fetchData();
    const handleInquirySync = () => fetchInquiries();

    socket.on("package_added", handleSync);
    socket.on("package_updated", handleSync);
    socket.on("package_deleted", handleSync);
    socket.on("banner_added", handleSync);
    socket.on("banner_deleted", handleSync);
    socket.on("destination_added", handleSync);
    socket.on("destination_updated", handleSync);
    socket.on("destination_deleted", handleSync);
    socket.on("settings_updated", handleSync);
    
    socket.on("car_added", handleSync);
    socket.on("car_updated", handleSync);
    socket.on("car_deleted", handleSync);
    
    socket.on("inquiry_added", handleInquirySync);
    socket.on("inquiry_deleted", handleInquirySync);

    const interval = setInterval(fetchData, 60000); // Fallback polling every 60s

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [user]);

  // Auth Handler
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setLoginError(null);
      toast.success("Welcome, Admin!");
    } catch (error) {
      console.error(error);
      setLoginError("Failed to sign in with Google.");
      toast.error("Auth Error");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast.info("Logged out successfully");
  };

  // CRUD Handlers (MySQL Version)
  const addPackage = async (newPkg: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPkg)
      });
      if (res.ok) {
        toast.success("Package added to MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to add package");
    }
  };

  const editPackage = async (id: string, updates: Partial<Package>) => {
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        toast.success("Package updated in MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update package");
    }
  };

  const deletePackage = async (id: string) => {
    try {
      const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Package deleted from MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete package");
    }
  };

  const addBanner = async (newBanner: Omit<Banner, 'id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner)
      });
      if (res.ok) {
        toast.success("Banner added to MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to add banner");
    }
  };

  const deleteBanner = async (id: string) => {
    try {
      const res = await fetch(`/api/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Banner deleted from MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const addDestination = async (newDest: Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDest)
      });
      if (res.ok) {
        toast.success("Destination added to MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to add destination");
    }
  };

  const editDestination = async (id: string, updates: Partial<Destination>) => {
    try {
      const res = await fetch(`/api/destinations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        toast.success("Destination updated in MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update destination");
    }
  };

  const deleteDestination = async (id: string) => {
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Destination deleted from MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete destination");
    }
  };

  const addCar = async (newCar: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCar)
      });
      if (res.ok) {
        toast.success("Vehicle added to MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to add vehicle");
    }
  };

  const editCar = async (id: string, updates: Partial<Car>) => {
    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        toast.success("Vehicle updated in MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update vehicle");
    }
  };

  const deleteCar = async (id: string) => {
    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Vehicle deleted from MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete vehicle");
    }
  };

  const deleteInquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.info("Inquiry deleted from MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete inquiry");
    }
  };

  const updateSettings = async (updates: Partial<Settings>) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        toast.success("Settings updated in MySQL");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to update settings");
    }
  };

  const postInquiry = async (values: any, pkg?: Package) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          packageId: pkg?.name || "General"
        })
      });
      if (res.ok) {
        toast.success("Inquiry sent successfully!");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to send inquiry");
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <>
            <Navbar whatsappNumber={settings.whatsappNumber} />
            <div className="pt-20">
              <PublicHome 
                packages={packages} 
                banners={banners} 
                destinations={destinations}
                whatsappNumber={settings.whatsappNumber}
                defaultMessage={settings.defaultMessage}
                onInquiry={postInquiry}
              />
            </div>
          </>
        } />

        <Route path="/tour/:id" element={
          <>
            <Navbar whatsappNumber={settings.whatsappNumber} />
            <div className="pt-20">
              <TourDetails 
                packages={packages} 
                whatsappNumber={settings.whatsappNumber}
                onInquiry={postInquiry}
              />
            </div>
          </>
        } />
        
        <Route path="/destinations" element={
          <>
            <Navbar whatsappNumber={settings.whatsappNumber} />
            <div className="pt-20">
              <PublicDestinations destinations={destinations} />
            </div>
          </>
        } />

        <Route path="/car-rental" element={
          <>
            <Navbar whatsappNumber={settings.whatsappNumber} />
            <div className="pt-20">
              <PublicCarRental cars={cars} whatsappNumber={settings.whatsappNumber} />
            </div>
          </>
        } />

        {/* Admin Login */}
        <Route path="/admin/login" element={
          user ? <Navigate to="/admin/dashboard" /> : <LoginPage onLogin={handleLogin} error={loginError} />
        } />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin" 
          element={user ? <AdminLayout onLogout={handleLogout} /> : <Navigate to="/admin/login" />}
        >
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={
            <Dashboard 
              stats={{
                totalPackages: packages.length,
                totalBanners: banners.length,
                totalInquiries: inquiries.length,
                totalDestinations: destinations.length
              }}
              recentInquiries={inquiries.slice(0, 5)}
              topPackages={packages.slice(0, 3)}
            />
          } />
          <Route path="packages" element={
            <PackagesPage 
              packages={packages} 
              onAdd={addPackage}
              onEdit={editPackage}
              onDelete={deletePackage}
            />
          } />
          <Route path="banners" element={
            <BannersPage 
              banners={banners} 
              onAdd={addBanner}
              onDelete={deleteBanner}
            />
          } />
          <Route path="destinations" element={
            <AdminDestinations 
              destinations={destinations} 
              onAdd={addDestination}
              onEdit={editDestination}
              onDelete={deleteDestination}
            />
          } />
          <Route path="cars" element={
            <CarsPage 
              cars={cars} 
              onAdd={addCar}
              onEdit={editCar}
              onDelete={deleteCar}
            />
          } />
          <Route path="inquiries" element={
            <InquiriesPage 
              inquiries={inquiries} 
              onDelete={deleteInquiry}
            />
          } />
          <Route path="settings" element={
            <SettingsPage 
              settings={settings} 
              onUpdate={updateSettings}
            />
          } />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
