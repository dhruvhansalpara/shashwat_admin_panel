import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface InquiryFormProps {
  packageId?: string;
  packageName?: string;
  onSubmit?: (data: any) => void;
}

export function InquiryForm({ packageId, packageName, onSubmit }: InquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: packageName ? `I'm interested in the ${packageName} tour.` : ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (onSubmit) {
        await onSubmit({ ...formData, packageId });
      } else {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, packageId })
        });
        
        if (res.ok) {
          toast.success("Thank you! Your inquiry has been sent.");
          setFormData({ name: '', email: '', phone: '', message: '' });
        } else {
          toast.error("Failed to send inquiry. Please try again.");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Full Name</Label>
        <Input 
          id="name" 
          required 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          placeholder="Enter your full name"
          className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-black text-slate-800 placeholder:text-slate-300 transition-all focus:ring-4 focus:ring-primary/5"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            required 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            placeholder="example@mail.com"
            className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-black text-slate-800 placeholder:text-slate-300 transition-all focus:ring-4 focus:ring-primary/5"
          />
        </div>
        <div className="space-y-3">
          <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Phone / WhatsApp Number</Label>
          <Input 
            id="phone" 
            type="tel" 
            required 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            placeholder="+91 Phone Number"
            className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-black text-slate-800 placeholder:text-slate-300 transition-all focus:ring-4 focus:ring-primary/5"
          />
        </div>
      </div>
      <div className="space-y-3">
        <Label htmlFor="message" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Your Requirements / Message</Label>
        <Textarea 
          id="message" 
          required 
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
          placeholder="Tell us about your travel plans (number of people, dates, specific interests)..."
          className="min-h-[140px] p-6 rounded-[28px] border-slate-100 bg-slate-50/50 font-bold text-slate-800 placeholder:text-slate-300 transition-all focus:ring-4 focus:ring-primary/5 leading-relaxed"
        />
      </div>
      <Button 
        type="submit" 
        className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-950 text-white font-black text-[12px] uppercase tracking-[0.25em] shadow-2xl shadow-slate-200/50 transition-all hover:scale-[1.02] active:scale-[0.98] border-none group/submit" 
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-4">
            <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            SENDING...
          </span>
        ) : (
          <span className="flex items-center gap-3">
             <span className="opacity-60 group-hover/submit:opacity-100 transition-opacity">Submit Inquiry</span>
             <span className="w-1.5 h-1.5 rounded-full bg-[#009688] animate-pulse" />
          </span>
        )}
      </Button>
    </form>
  );
}
