import { Inquiry, Package, InquiryStatus, InquiryPriority } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit2, Trash2, Calendar, Phone, Mail, User, MessageSquare, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InquiriesPageProps {
  inquiries: Inquiry[];
  packages: Package[];
  onEdit: (id: string, data: Partial<Inquiry>, token: string) => void;
  onDelete: (id: string, token: string) => void;
}

export function InquiriesPage({ inquiries, packages, onEdit, onDelete }: InquiriesPageProps) {
  const { token } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');

  const getPackageName = (id?: string) => {
    const pkg = packages.find(p => p.id === id);
    return pkg ? pkg.name : "N/A";
  };

  const filteredInquiries = useMemo(() => {
    const sorted = Array.isArray(inquiries) 
      ? [...inquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      : [];

    if (!searchTerm.trim()) return sorted;

    const term = searchTerm.toLowerCase();
    return sorted.filter(inquiry => {
      const pkgName = getPackageName(inquiry.packageId).toLowerCase();
      const guestName = inquiry.name.toLowerCase();
      const phone = inquiry.phone.toLowerCase();
      
      return pkgName.includes(term) || guestName.includes(term) || phone.includes(term);
    });
  }, [inquiries, packages, searchTerm]);

  const EditInquiryDialog = ({ inquiry }: { inquiry: Inquiry }) => {
    const [status, setStatus] = useState<InquiryStatus>(inquiry.status || 'new');
    const [priority, setPriority] = useState<InquiryPriority>(inquiry.priority || 'low');

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-white shadow-xl shadow-slate-200/50 hover:bg-[#009688] hover:text-white transition-all border border-slate-50">
                    <Edit2 className="w-4 h-4" strokeWidth={3} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] w-[95vw] p-0 overflow-hidden bg-[#fcfdfe] border-none shadow-2xl rounded-[48px] font-display">
                <DialogHeader className="p-12 pb-8 shrink-0 bg-white border-b-2 border-slate-50">
                    <DialogTitle className="text-3xl font-black tracking-tighter text-slate-800 uppercase italic leading-none">
                        Update Inquiry
                    </DialogTitle>
                    <DialogDescription className="text-[#009688] font-black uppercase tracking-[0.4em] text-[10px] mt-3 pl-1">
                        Change status and priority for {inquiry.name}'s inquiry
                    </DialogDescription>
                </DialogHeader>

                <div className="p-12 pt-8 space-y-10">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Inquiry Status</Label>
                        <Select value={status} onValueChange={(v: InquiryStatus) => setStatus(v)}>
                            <SelectTrigger className="h-14 px-6 rounded-2xl border-2 border-slate-100 bg-white shadow-sm focus:border-[#009688] focus:ring-4 focus:ring-[#009688]/5 transition-all text-sm font-bold text-slate-800">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-2 border-slate-50 shadow-2xl p-2">
                                <SelectItem value="new" className="rounded-xl font-bold py-3 text-slate-600 focus:bg-[#009688]/10 focus:text-[#009688]">New Inquiry</SelectItem>
                                <SelectItem value="contacted" className="rounded-xl font-bold py-3 text-slate-600 focus:bg-[#009688]/10 focus:text-[#009688]">Contacted</SelectItem>
                                <SelectItem value="negotiation" className="rounded-xl font-bold py-3 text-slate-600 focus:bg-[#009688]/10 focus:text-[#009688]">Negotiation</SelectItem>
                                <SelectItem value="booked" className="rounded-xl font-bold py-3 text-slate-600 focus:bg-[#009688]/10 focus:text-[#009688]">Booked</SelectItem>
                                <SelectItem value="closed" className="rounded-xl font-bold py-3 text-slate-600 focus:bg-[#009688]/10 focus:text-[#009688]">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Priority Level</Label>
                        <Select value={priority} onValueChange={(v: InquiryPriority) => setPriority(v)}>
                            <SelectTrigger className="h-14 px-6 rounded-2xl border-2 border-slate-100 bg-white shadow-sm focus:border-[#009688] focus:ring-4 focus:ring-[#009688]/5 transition-all text-sm font-bold text-slate-800">
                                <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-2 border-slate-50 shadow-2xl p-2">
                                <SelectItem value="low" className="rounded-xl font-bold py-3 text-slate-600 focus:bg-[#009688]/10 focus:text-[#009688]">Low Priority</SelectItem>
                                <SelectItem value="medium" className="rounded-xl font-bold py-3 text-slate-600 focus:bg-[#009688]/10 focus:text-[#009688]">Medium Priority</SelectItem>
                                <SelectItem value="high" className="rounded-xl font-bold py-3 text-slate-600 focus:bg-[#009688]/10 focus:text-[#009688]">High Priority</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="p-12 pt-0">
                    <Button 
                        className="w-full h-14 rounded-2xl bg-[#009688] hover:bg-[#00796b] text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-[#009688]/20 transition-all active:scale-95"
                        onClick={() => { onEdit(inquiry.id, { status, priority }, token || ''); }}
                    >
                        Save Configuration
                    </Button>
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
          <h2 className="text-xl font-bold tracking-tight text-slate-800 uppercase font-display leading-none">Guest Inquiries</h2>
          <p className="text-[#009688] mt-1.5 font-bold uppercase tracking-widest text-[9px] pl-0.5 opacity-80">Review and respond to messages from your website guests</p>
        </div>
        <div className="relative w-full md:max-w-md group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#009688]">
            <Search className="w-4 h-4" strokeWidth={3} />
          </div>
          <Input 
            placeholder="Search by name, phone or package..." 
            className="h-12 pl-11 pr-4 rounded-[20px] border-2 border-[#009688]/20 bg-white shadow-xl shadow-[#009688]/10 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-[#009688]/5 focus:border-[#009688] transition-all font-display"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <motion.div variants={item} className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredInquiries.length > 0 ? filteredInquiries.map((inquiry, idx) => (
            <motion.div 
              key={inquiry.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "group transition-all duration-500 relative flex items-center p-6 gap-8 border-2",
                "rounded-[40px] select-none",
                "bg-white border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:bg-[#009688]/5 hover:border-[#009688]/30 hover:scale-[1.01]"
              )}
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-[24px] bg-[#e0f2f1] text-[#009688] flex items-center justify-center font-bold text-lg shadow-inner group-hover:bg-[#009688] group-hover:text-white transition-all duration-500 italic">
                  {inquiry.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-800 text-base tracking-tight group-hover:text-[#009688] transition-colors uppercase font-display leading-none">{inquiry.name}</div>
                  <div className="flex flex-col gap-2">
                    <a 
                      href={`tel:${inquiry.phone}`} 
                      className="flex items-center gap-2 text-slate-400 hover:text-[#009688] transition-colors group/link"
                    >
                       <div className="w-6 h-6 rounded-lg bg-[#e0f2f1] flex items-center justify-center group-hover/link:bg-[#009688] group-hover/link:text-white transition-colors">
                         <Phone className="w-3 h-3" strokeWidth={3} />
                       </div>
                       <span className="text-xs font-bold uppercase tracking-tight">{inquiry.phone}</span>
                    </a>
                    <a 
                      href={`mailto:${inquiry.email}`} 
                      className="flex items-center gap-2 text-slate-400 hover:text-[#009688] transition-colors group/link"
                    >
                       <div className="w-6 h-6 rounded-lg bg-[#e0f2f1] flex items-center justify-center group-hover/link:bg-[#009688] group-hover/link:text-white transition-colors">
                         <Mail className="w-3 h-3" strokeWidth={3} />
                       </div>
                       <span className="text-xs font-bold uppercase tracking-tight">{inquiry.email}</span>
                    </a>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-600 leading-relaxed italic opacity-80 line-clamp-2">
                    "{inquiry.message}"
                  </div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}</div>
                </div>

                <div className="flex items-center gap-3">
                   <Badge variant="secondary" className="px-3 py-1 rounded-xl capitalize text-[10px] font-bold bg-white border-slate-100 shadow-sm">{inquiry.status || 'new'}</Badge>
                   <Badge variant={inquiry.priority === 'high' ? 'destructive' : 'default'} className="px-3 py-1 rounded-xl capitalize text-[10px] font-bold shadow-sm">{inquiry.priority || 'low'}</Badge>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6">
                  <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white transition-all">
                    <code className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[100px]">
                      {getPackageName(inquiry.packageId)}
                    </code>
                  </div>

                  <div className="flex items-center gap-2 transition-all duration-500">
                    <EditInquiryDialog inquiry={inquiry} />
                    <Button variant="ghost" size="icon" onClick={() => { if(confirm("Permanently erase this inquiry?")) onDelete(inquiry.id, token || '') }} className="h-10 w-10 rounded-2xl bg-white shadow-xl shadow-slate-200/50 hover:bg-rose-500 hover:text-white transition-all border border-slate-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="py-20 text-center flex flex-col items-center gap-3 text-slate-300">
              <MessageSquare className="w-12 h-12 opacity-20" />
              <p className="font-black uppercase tracking-widest text-xs text-slate-400">No inquiries recorded</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
