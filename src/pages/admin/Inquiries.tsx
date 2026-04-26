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
  // Sort by latest
  const sortedInquiries = Array.isArray(inquiries) 
    ? [...inquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-800">Customer Inquiries</h2>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedInquiries.map((inquiry) => (
              <tr key={inquiry.id}>
                <td className="px-4 py-3 font-semibold text-slate-800">{inquiry.name}</td>
                <td className="px-4 py-3 text-xs">
                  {inquiry.phone}<br/>{inquiry.email}
                </td>
                <td className="px-4 py-3">{inquiry.packageId || "General"}</td>
                <td className="px-4 py-3 text-slate-500">{format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}</td>
                <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm" onClick={() => onDelete(inquiry.id)} className="text-red-500 h-8 w-8">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { MessageSquare } from 'lucide-react';
