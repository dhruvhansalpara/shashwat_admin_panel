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
  const sortedInquiries = [...inquiries].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customer Inquiries</h2>
        <p className="text-muted-foreground">Review and manage interest from potential travelers.</p>
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Date Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedInquiries.length > 0 ? sortedInquiries.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">
                      {inquiry.name.charAt(0).toUpperCase()}
                    </div>
                    {inquiry.name}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3 h-3" /> {inquiry.phone}
                  </div>
                  {inquiry.email && (
                    <div className="text-xs flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3 h-3" /> {inquiry.email}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                   <Badge variant="secondary">{inquiry.packageId || "General Inquiry"}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                   {format(new Date(inquiry.createdAt), 'MMM dd, yyyy HH:mm')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon"><ExternalLink className="w-4 h-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Inquiry Details</DialogTitle>
                          <DialogDescription>
                            Received on {format(new Date(inquiry.createdAt), 'PPPP p')}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6 pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                                <User className="w-3 h-3" /> Customer
                              </p>
                              <p className="font-semibold">{inquiry.name}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                                <Phone className="w-3 h-3" /> Phone
                              </p>
                              <p className="font-semibold">{inquiry.phone}</p>
                            </div>
                          </div>
                          <div className="space-y-1">
                             <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1">
                               <MessageSquare className="w-3 h-3" /> Message
                             </p>
                             <div className="bg-muted p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap">
                               {inquiry.message}
                             </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(inquiry.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                  No inquiries received yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

import { MessageSquare } from 'lucide-react';
