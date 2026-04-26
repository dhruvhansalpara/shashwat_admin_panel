import { Inquiry } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, ExternalLink, Calendar, Phone, Mail, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface InquiriesPageProps {
  inquiries: Inquiry[];
  onDelete: (id: string) => void;
}

export function InquiriesPage({ inquiries, onDelete }: InquiriesPageProps) {
  // Sort by latest
  const sortedInquiries = Array.isArray(inquiries) 
    ? [...inquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Customer Intelligence</h2>
          <p className="text-slate-500 mt-1 font-bold uppercase tracking-[0.2em] text-[10px]">Tracking potential market demand and user intent</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intent Origin</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Timestamp</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Logic Reference</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedInquiries.length > 0 ? sortedInquiries.map((inquiry) => (
                <tr key={inquiry.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs shadow-sm group-hover:scale-110 transition-transform duration-500">
                        {inquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 text-base tracking-tight group-hover:text-primary transition-colors">{inquiry.name}</div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-slate-400">
                             <Phone className="w-3 h-3" />
                             <span className="text-[9px] font-black uppercase tracking-tight">{inquiry.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400">
                             <Mail className="w-3 h-3" />
                             <span className="text-[9px] font-black uppercase tracking-tight">{inquiry.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-1.5">
                      <Badge variant="outline" className="rounded-lg border-primary/20 bg-primary/[0.03] text-primary font-black text-[9px] uppercase tracking-widest px-2 py-0.5">
                        {inquiry.packageId ? 'Package Intent' : 'General Inquiry'}
                      </Badge>
                      <div className="text-xs font-bold text-slate-500 truncate max-w-[200px] leading-relaxed">
                        {inquiry.message ? `"${inquiry.message.substring(0, 40)}${inquiry.message.length > 40 ? '...' : ''}"` : 'No payload message.'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-0.5">
                      <div className="font-black text-slate-900 text-xs uppercase tracking-tight">{format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}</div>
                      <div className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">{format(new Date(inquiry.createdAt), 'hh:mm a')}</div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <code className="bg-slate-50 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-400 border border-slate-100 uppercase tracking-widest">
                      {inquiry.packageId || "GEN-ALPHA-0"}
                    </code>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                       <Dialog>
                         <DialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                             <ExternalLink className="w-4 h-4" strokeWidth={2.5} />
                           </Button>
                         </DialogTrigger>
                         <DialogContent className="sm:max-w-md bg-[#fcfdfe] rounded-[40px] p-0 border-none overflow-hidden shadow-2xl">
                           <div className="p-10 pb-6 bg-white border-b border-slate-50">
                             <DialogHeader className="space-y-1 text-center">
                               <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-slate-900">Inquiry Intelligence</DialogTitle>
                               <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">ID: {inquiry.id.substring(0, 8)} • Captured {format(new Date(inquiry.createdAt), 'PPP p')}</DialogDescription>
                             </DialogHeader>
                           </div>
                           <div className="p-10 space-y-8 overflow-y-auto max-h-[60vh] scrollbar-hide">
                             <div className="grid gap-6">
                               <div className="p-6 rounded-[24px] bg-white border border-slate-100 shadow-sm space-y-6">
                                 <div className="space-y-4">
                                   <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Client Identity</span>
                                     <span className="font-bold text-slate-900 text-sm tracking-tight">{inquiry.name}</span>
                                   </div>
                                   <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Communications</span>
                                     <span className="font-bold text-slate-900 text-sm tracking-tight">{inquiry.phone}</span>
                                   </div>
                                   <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Portal Access</span>
                                     <span className="font-bold text-slate-900 text-sm tracking-tight">{inquiry.email}</span>
                                   </div>
                                 </div>
                                 <div className="space-y-3">
                                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Captured Message Payload</span>
                                   <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50/50 p-6 rounded-2xl border border-dashed border-slate-200 italic">
                                     "{inquiry.message || "Target provided no additional payload."}"
                                   </p>
                                 </div>
                               </div>
                             </div>
                             <div className="flex gap-4">
                               <Button className="flex-1 rounded-2xl h-14 gap-2 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" onClick={() => window.open(`tel:${inquiry.phone}`)}>
                                 <Phone className="w-4 h-4" /> Initialize Call
                               </Button>
                               <Button variant="outline" className="flex-1 rounded-2xl h-14 gap-2 border-slate-200 font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all" onClick={() => window.open(`mailto:${inquiry.email}`)}>
                                 <Mail className="w-4 h-4" /> Data Sync (Email)
                               </Button>
                             </div>
                           </div>
                         </DialogContent>
                       </Dialog>
                       <Button variant="ghost" size="icon" onClick={() => { if(confirm("Permanently erase this inquiry record?")) onDelete(inquiry.id) }} className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                         <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                       </Button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-32 text-slate-300">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-10" />
                    <p className="font-black uppercase tracking-[0.3em] text-[10px] text-slate-400">No telemetry recorded</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
