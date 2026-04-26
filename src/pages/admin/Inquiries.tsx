import { Inquiry } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, ExternalLink, Calendar, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'motion/react';

interface InquiriesPageProps {
  inquiries: Inquiry[];
  onDelete: (id: string) => void;
}

export function InquiriesPage({ inquiries, onDelete }: InquiriesPageProps) {
  // Sort by latest
  const sortedInquiries = Array.isArray(inquiries) 
    ? [...inquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

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
        <div className="px-6 py-3 bg-[#e0f2f1] text-[#009688] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border-2 border-[#009688]/10 shadow-[0_4px_20px_rgba(0,150,136,0.1)] flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#009688] animate-pulse shadow-[0_0_8px_rgba(0,150,136,0.5)]" />
           LIVE UPDATES
        </div>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-[48px] border-2 border-slate-50 shadow-[0_24px_80px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-50 bg-slate-50/10 hover:bg-slate-50/10 transition-none">
                <th className="pl-12 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 font-display italic">Guest Details</th>
                <th className="px-6 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 font-display italic">Inquiry Type</th>
                <th className="px-6 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 font-display italic">Received Date</th>
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
                               <span className="text-[10px] font-bold uppercase tracking-tight">{inquiry.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400">
                               <Mail className="w-3.5 h-3.5 text-[#009688]" strokeWidth={3} />
                               <span className="text-[10px] font-bold uppercase tracking-tight">{inquiry.email}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-10">
                      <div className="space-y-2">
                        <Badge variant="outline" className="rounded-xl border-[#009688]/20 bg-[#009688]/5 text-[#009688] font-black text-[10px] uppercase tracking-widest px-3 py-1 shadow-sm">
                          {inquiry.packageId ? 'Module Intake' : 'General Inquiry'}
                        </Badge>
                        <div className="text-[11px] font-bold text-slate-500 truncate max-w-[220px] leading-relaxed italic opacity-70">
                          {inquiry.message ? `"${inquiry.message.substring(0, 40)}${inquiry.message.length > 40 ? '...' : ''}"` : 'No payload message.'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-10">
                      <div className="space-y-0.5">
                        <div className="font-black text-slate-900 text-sm uppercase tracking-tight italic font-display">{format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}</div>
                        <div className="text-[10px] font-black text-slate-300 tracking-[0.2em] uppercase opacity-60 font-display">{format(new Date(inquiry.createdAt), 'hh:mm a')}</div>
                      </div>
                    </td>
                    <td className="px-6 py-10">
                      <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 w-fit">
                        <code className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {inquiry.packageId || "GEN-ALPHA-0"}
                        </code>
                      </div>
                    </td>
                    <td className="px-12 py-10 text-right">
                      <div className="flex justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                        <Dialog>
                           <DialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 hover:bg-[#009688]/10 hover:text-[#009688] transition-all border border-slate-50">
                               <ExternalLink className="w-5 h-5" strokeWidth={3} />
                             </Button>
                           </DialogTrigger>
                           <DialogContent className="sm:max-w-md bg-[#fcfdfe] rounded-[48px] p-0 border-none overflow-hidden shadow-2xl font-display">
                             <div className="p-12 pb-8 bg-white border-b-2 border-slate-50">
                               <DialogHeader className="space-y-2 text-center">
                                 <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-slate-800 italic">Inquiry Details</DialogTitle>
                                 <DialogDescription className="text-[10px] font-black uppercase tracking-[0.4em] text-[#009688]">RECEIVED ON: {format(new Date(inquiry.createdAt), 'PPP p')}</DialogDescription>
                               </DialogHeader>
                             </div>
                             <div className="p-12 space-y-8 overflow-y-auto max-h-[60vh] scrollbar-hide">
                               <div className="grid gap-6">
                                 <div className="p-8 rounded-[36px] bg-white border-2 border-slate-50 shadow-sm space-y-8">
                                   <div className="space-y-5">
                                     <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                       <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Full Name</span>
                                       <span className="font-black text-slate-800 text-sm tracking-tight uppercase italic">{inquiry.name}</span>
                                     </div>
                                     <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                       <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Phone</span>
                                       <span className="font-black text-slate-800 text-sm tracking-tight uppercase italic">{inquiry.phone}</span>
                                     </div>
                                     <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                                       <span className="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em]">Email</span>
                                       <span className="font-black text-slate-800 text-sm tracking-tight italic opacity-80">{inquiry.email}</span>
                                     </div>
                                   </div>
                                   <div className="space-y-4">
                                     <span className="text-[10px] font-black uppercase text-[#009688] tracking-[0.4em] pl-1">Message Content</span>
                                     <div className="text-sm font-medium text-slate-600 leading-relaxed bg-[#f8fafc] p-8 rounded-[28px] border-2 border-dashed border-slate-100 italic relative overflow-hidden">
                                       <div className="relative z-10">"{inquiry.message || "No message content was included in this inquiry."}"</div>
                                     </div>
                                   </div>
                                 </div>
                               </div>
                               <div className="flex gap-5">
                                 <Button className="flex-1 rounded-2xl h-16 gap-3 bg-[#009688] hover:bg-[#00796b] text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-[#009688]/20 transition-all hover:scale-[1.02]" onClick={() => window.open(`tel:${inquiry.phone}`)}>
                                   <Phone className="w-5 h-5" /> Call Guest
                                 </Button>
                                 <Button variant="outline" className="flex-1 rounded-2xl h-16 gap-3 border-2 border-slate-100 font-black uppercase tracking-[0.2em] text-[11px] hover:bg-slate-50 transition-all" onClick={() => window.open(`mailto:${inquiry.email}`)}>
                                   <Mail className="w-5 h-5" /> Reply by Email
                                 </Button>
                               </div>
                             </div>
                           </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" onClick={() => { if(confirm("Permanently erase this telemetry record?")) onDelete(inquiry.id) }} className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-50">
                          <Trash2 className="w-5 h-5" strokeWidth={3} />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                )) : (
                  <tr className="border-none">
                    <td colSpan={5} className="text-center py-32 text-slate-300 border-none">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-10" />
                      <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400">No telemetry recorded</p>
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
