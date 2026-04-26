import { Inquiry } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, ExternalLink, Calendar, Phone, Mail, User } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface InquiriesPageProps {
  inquiries: Inquiry[];
  onDelete: (id: string) => void;
}

export function InquiriesPage({ inquiries, onDelete }: InquiriesPageProps) {
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  // Sort by latest
  const sortedInquiries = Array.isArray(inquiries) 
    ? [...inquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-display font-black tracking-tight text-slate-900">Customer Inquiries</h2>
          <p className="text-slate-500 font-medium">Keep track of customer leads and service requests.</p>
        </div>
        <div className="flex items-center gap-2 bg-white shadow-sm p-1.5 rounded-2xl border border-slate-100">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-none shadow-none px-4 py-2 rounded-xl">{sortedInquiries.length} Total</Badge>
        </div>
      </div>

      <div className="border border-slate-200/60 rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-[0.2em] border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Customer Identity</th>
              <th className="px-8 py-5">Contact Details</th>
              <th className="px-8 py-5">Requested Interest</th>
              <th className="px-8 py-5">Date Received</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedInquiries.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{inquiry.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Customer Lead
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-slate-600 font-semibold group-hover:text-slate-900 transition-colors">
                      <Phone className="w-3 h-3" /> {inquiry.phone}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 font-medium text-xs">
                      <Mail className="w-3 h-3" /> {inquiry.email}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-primary/5 group-hover:border-primary/10 transition-colors">
                    <MessageSquare className="w-3 h-3 text-primary" />
                    <span className="font-bold text-slate-800 text-xs">{inquiry.packageId || "General Inquiry"}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-slate-500 font-bold text-xs uppercase tracking-wider">
                  {format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setViewingInquiry(inquiry)} 
                        className="h-10 w-10 p-0 rounded-xl bg-slate-50 text-blue-600 hover:bg-blue-100 transition-all hover:scale-110 shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onDelete(inquiry.id)} 
                        className="h-10 w-10 p-0 rounded-xl bg-slate-50 text-rose-600 hover:bg-rose-100 transition-all hover:scale-110 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                </td>
              </tr>
            ))}
            {sortedInquiries.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-20">
                   <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <MessageSquare className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No inquiries received yet</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={!!viewingInquiry} onOpenChange={() => setViewingInquiry(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] bg-white border-slate-200 p-0 overflow-hidden">
          <DialogHeader className="p-8 pb-4 border-b border-slate-50">
            <DialogTitle className="text-2xl font-display font-bold text-slate-900">Inquiry Details</DialogTitle>
            <DialogDescription className="font-medium text-slate-500">Customer message and contact info.</DialogDescription>
          </DialogHeader>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Customer</p>
                <p className="font-bold text-slate-900">{viewingInquiry?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Received On</p>
                <p className="font-bold text-slate-900">{viewingInquiry && format(new Date(viewingInquiry.createdAt), 'PPpp')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Email</p>
                <p className="font-bold text-slate-900">{viewingInquiry?.email || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Phone</p>
                <p className="font-bold text-slate-900">{viewingInquiry?.phone}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Message Content</p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm leading-relaxed text-slate-700 font-medium">
                {viewingInquiry?.message}
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
            <Button onClick={() => setViewingInquiry(null)} className="rounded-xl px-8 font-bold">Close Details</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from 'react';
