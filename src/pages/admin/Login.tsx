import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2, ShieldCheck, Lock, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/context/AdminContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Logo } from '@/components/Logo';
import { motion } from 'motion/react';

export function LoginPage() {
  const { login } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const from = location.state?.from?.pathname || "/admin";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        login(data.token, data.user);
        toast.success("Login successful");
        navigate(from, { replace: true });
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (e) {
      toast.error("An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-display bg-[#fcfdfe]">
      {/* Left Section - Aesthetic Visual */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex w-[50%] bg-[#009688] relative overflow-hidden items-center justify-center p-24"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
        <div className="relative z-10 space-y-12 max-w-xl text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <Logo className="scale-[1.8] origin-left" />
            <div className="w-24 h-1.5 bg-white/20 rounded-full" />
          </motion.div>
          <div className="space-y-8">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-7xl font-black tracking-tighter leading-[0.9] uppercase italic"
            >
              Admin <br /> Control <br /> Panel
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl font-medium text-white/70 max-w-md leading-relaxed"
            >
              Managing tours, bookings, and customer inquiries for Shashwat Holidays.
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-10 pt-10 border-t border-white/10"
          >
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Server Status</p>
              <p className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                Online
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Security</p>
              <p className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Protected
              </p>
            </div>
          </motion.div>
        </div>

      </motion.div>

      {/* Right Section - Form */}
      <div className="flex-1 flex items-center justify-center p-12 bg-white">
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[440px] space-y-12"
        >
          <div className="space-y-4">
            <div className="lg:hidden mb-12">
               <Logo className="scale-125 origin-left" variant="dark" />
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Admin <br /> Login</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.25em] pl-1">Enter your admin credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-[#009688] pl-1">Email Address</Label>
                <motion.div whileFocus={{ scale: 1.01 }} className="relative group">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="admin@shashwat.in"
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-16 w-full rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#009688]/20 focus:bg-white px-6 font-bold text-slate-800 placeholder:text-slate-300 transition-all text-lg shadow-sm"
                  />
                </motion.div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-[#009688] pl-1">Password</Label>
                <motion.div whileFocus={{ scale: 1.01 }} className="relative group">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    required 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="h-16 w-full rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#009688]/20 focus:bg-white px-6 font-bold text-slate-800 placeholder:text-slate-300 transition-all text-lg shadow-sm"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#009688] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                  </button>
                </motion.div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-16 rounded-2xl bg-[#009688] hover:bg-[#00796b] text-white font-black text-sm uppercase tracking-[0.25em] shadow-2xl shadow-[#009688]/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5" />
                  <span>Login Now</span>
                </div>
              )}
            </Button>


          </form>
        </motion.div>
      </div>
    </div>
  );
}
