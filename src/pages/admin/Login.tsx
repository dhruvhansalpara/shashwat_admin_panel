import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdmin } from '@/context/AdminContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/Logo';

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
    <div className="min-h-screen flex bg-background font-sans selection:bg-teal-50">
      {/* Left Decoration Area */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-slate-50/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-100/30 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-50/30 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="relative z-10 text-center space-y-6 max-w-sm">
          <Logo className="scale-150 justify-center mb-8" />
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Shashwat Admin</h2>
          <p className="text-slate-500 leading-relaxed">Most powerful & comprehensive travel management dashboard for Shashwat Holidays.</p>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-[450px] space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-800">Welcome to Shashwat! 👋🏻</h1>
              <p className="text-slate-500 text-sm">Please sign-in to your account and start the adventure</p>
            </div>
          </div>

          <div className="bg-teal-50/50 border border-teal-100 rounded-lg p-3.5 mb-6">
            <p className="text-teal-600 text-[13px] leading-relaxed">
              Email: <span className="font-semibold">info.shashwatholiday@gmail.com</span> / Pass: <span className="font-semibold">kard@2026</span>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5 relative">
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@shashwat.in" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-[52px] rounded-lg border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 pt-5 peer"
                />
                <Label 
                  htmlFor="email" 
                  className="absolute left-3 top-1.5 text-[10px] uppercase tracking-widest font-bold text-teal-500 scale-90 transition-all pointer-events-none"
                >
                  Email
                </Label>
              </div>
              
              <div className="space-y-1.5 relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="h-[52px] rounded-lg border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 pt-5"
                />
                <Label 
                  htmlFor="password" 
                  className="absolute left-3 top-1.5 text-[10px] uppercase tracking-widest font-bold text-teal-500 scale-90 transition-all pointer-events-none"
                >
                  Password
                </Label>
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-1.5 text-slate-400 hover:text-teal-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="rounded border-slate-300 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600" />
                <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer">Remember me</label>
              </div>
              <button type="button" className="text-sm font-medium text-teal-600 hover:text-teal-700">Forgot password?</button>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-[13px] uppercase tracking-widest shadow-lg shadow-teal-100 transition-all" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" />
              ) : (
                "Log In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
