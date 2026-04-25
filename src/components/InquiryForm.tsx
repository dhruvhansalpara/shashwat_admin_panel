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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          required 
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
          placeholder="Your name"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            required 
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            placeholder="your@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            type="tel" 
            required 
            value={formData.phone}
            onChange={e => setFormData({...formData, phone: e.target.value})}
            placeholder="+91 ..."
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">How can we help you?</Label>
        <Textarea 
          id="message" 
          required 
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
          placeholder="Share your travel requirements..."
          className="min-h-[120px]"
        />
      </div>
      <Button type="submit" className="w-full h-12" disabled={loading}>
        {loading ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}
