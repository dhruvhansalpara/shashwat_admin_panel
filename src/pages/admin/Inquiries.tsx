import { Inquiry, Package, InquiryStatus, InquiryPriority } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, Calendar, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface InquiriesPageProps {
  inquiries: Inquiry[];
  packages: Package[];
  onEdit: (id: string, data: Partial<Inquiry>, token: string) => void;
  onDelete: (id: string, token: string) => void;
}

export function InquiriesPage({ inquiries, packages, onEdit, onDelete }: InquiriesPageProps) {
  const { token } = useAdmin();
  const sortedInquiries = Array.isArray(inquiries) 
    ? [...inquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  const getPackageName = (id?: string) => {
    const pkg = packages.find(p => p.id === id);
    return pkg ? pkg.name : "N/A";
  };

  const EditInquiryDialog = ({ inquiry }: { inquiry: Inquiry }) => {
    const [status, setStatus] = useState<InquiryStatus>(inquiry.status || 'new');
    const [priority, setPriority] = useState<InquiryPriority>(inquiry.priority || 'low');

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary">
                    <Edit2 className="w-4 h-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md font-display">
                <DialogHeader>
                    <DialogTitle>Update Inquiry</DialogTitle>
                    <DialogDescription>Change status and priority for {inquiry.name}'s inquiry</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={(v: InquiryStatus) => setStatus(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="contacted">Contacted</SelectItem>
                                <SelectItem value="negotiation">Negotiation</SelectItem>
                                <SelectItem value="booked">Booked</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select value={priority} onValueChange={(v: InquiryPriority) => setPriority(v)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => { onEdit(inquiry.id, { status, priority }, token || ''); }}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-800 uppercase font-display leading-none italic">Guest Inquiries</h2>
          <p className="text-[#009688] mt-2 font-black uppercase tracking-[0.4em] text-[10px] pl-0.5 opacity-100">Review and respond to messages from your website guests</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-[48px] border-2 border-slate-50 shadow-[0_24px_80px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-50 bg-slate-50/10 hover:bg-slate-50/10 transition-none">
                <th className="pl-12 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 font-display italic">Guest Details</th>
                <th className="px-6 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 font-display italic">Inquiry Details</th>
                <th className="px-6 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 font-display italic">Status & Priority</th>
                <th className="px-6 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 font-display italic">Tour Ref</th>
                <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 text-right font-display italic">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50/20">
              <AnimatePresence mode="popLayout">
                {sortedInquiries.length > 0 ? sortedInquiries.map((inquiry, idx) => (
                  <motion.tr 
                    key={inquiry.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group hover:bg-slate-50/60 transition-all duration-300 border-none"
                  >
                    <td className="pl-12 py-10">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-[22px] bg-[#e0f2f1] text-[#009688] flex items-center justify-center font-black text-sm shadow-inner group-hover:scale-110 transition-transform duration-500 italic">
                          {inquiry.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <div className="font-black text-slate-800 text-xl tracking-tighter group-hover:text-[#009688] transition-colors uppercase italic font-display leading-none">{inquiry.name}</div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-slate-400">
                               <Phone className="w-3.5 h-3.5 text-[#009688]" strokeWidth={3} />
                               <a href={`tel:${inquiry.phone}`} className="text-[10px] font-bold uppercase tracking-tight hover:text-[#009688]">{inquiry.phone}</a>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                               <Mail className="w-3.5 h-3.5 text-[#009688]" strokeWidth={3} />
                               <a href={`mailto:${inquiry.email}`} className="text-[10px] font-bold uppercase tracking-tight hover:text-[#009688]">{inquiry.email}</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-10">
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-600 max-w-[250px] leading-relaxed italic opacity-80">
                          {inquiry.message}
                        </div>
                        <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{format(new Date(inquiry.createdAt), 'MMM dd, yyyy - hh:mm a')}</div>
                      </div>
                    </td>
                    <td className="px-6 py-10">
                        <div className="flex flex-col gap-2">
                           <Badge variant="secondary" className="w-fit capitalize">{inquiry.status || 'new'}</Badge>
                           <Badge variant={inquiry.priority === 'high' ? 'destructive' : 'default'} className="w-fit capitalize">{inquiry.priority || 'low'}</Badge>
                        </div>
                    </td>
                    <td className="px-6 py-10">
                      <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 w-fit">
                        <code className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {getPackageName(inquiry.packageId)}
                        </code>
                      </div>
                    </td>
                    <td className="px-12 py-10 text-right">
                      <div className="flex justify-end gap-2">
                        <EditInquiryDialog inquiry={inquiry} />
                        <Button variant="ghost" size="icon" onClick={() => { if(confirm("Permanently erase this inquiry?")) onDelete(inquiry.id, token || '') }} className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                )) : (
                  <tr className="border-none">
                    <td colSpan={5} className="text-center py-32 text-slate-300 border-none">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-10" />
                      <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400">No inquiries recorded</p>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
