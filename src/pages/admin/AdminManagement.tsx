import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, UserCog, UserMinus, Shield, ShieldCheck, Mail, User } from 'lucide-react';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  status: 'active' | 'disabled';
  createdAt: string;
}

export default function AdminManagement() {
  const { token, user: currentUser } = useAdmin();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as 'admin' | 'super_admin',
    status: 'active' as 'active' | 'disabled'
  });

  const fetchAdmins = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdmins(data);
      }
    } catch (e) {
      toast.error("Failed to load admins");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Admin added successfully");
        setIsAddOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'admin', status: 'active' });
        fetchAdmins();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to add admin");
      }
    } catch (e) {
      toast.error("An error occurred");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    try {
      const res = await fetch(`/api/admin/users/${selectedAdmin.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success("Admin updated successfully");
        setIsEditOpen(false);
        fetchAdmins();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update admin");
      }
    } catch (e) {
      toast.error("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Admin deleted");
        fetchAdmins();
      }
    } catch (e) {
      toast.error("Failed to delete admin");
    }
  };

  const openEdit = (adm: AdminUser) => {
    setSelectedAdmin(adm);
    setFormData({
      name: adm.name,
      email: adm.email,
      password: '',
      role: adm.role,
      status: adm.status
    });
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-12 pb-20 font-display">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tighter text-slate-800 uppercase leading-none">Security Node</h2>
          <p className="text-slate-400 font-medium text-sm opacity-80 pl-1">Hierarchical permission layering for system operators.</p>
        </div>
        <Button 
          onClick={() => setIsAddOpen(true)} 
          className="rounded-2xl h-14 px-10 gap-3 bg-[#009688] hover:bg-[#00796b] text-white shadow-xl shadow-[#009688]/20 transition-all hover:scale-[1.02] active:scale-95 font-black uppercase tracking-[0.2em] text-[11px]"
        >
          <UserPlus className="w-5 h-5" strokeWidth={3} /> Synchronize Agent
        </Button>
      </div>

      <div className="bg-white rounded-[32px] border-2 border-slate-50 shadow-[0_8px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b border-slate-100/50">
                <TableHead className="pl-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Identity Details</TableHead>
                <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Security Clearance</TableHead>
                <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Status</TableHead>
                <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Registry Date</TableHead>
                <TableHead className="text-right pr-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Directives</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((adm) => (
                <TableRow key={adm.id} className="group hover:bg-slate-50/30 transition-all duration-300 border-b border-slate-50/50 last:border-none">
                  <TableCell className="pl-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs shadow-sm shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                        adm.role === 'super_admin' ? 'bg-[#e0f2f1] text-[#009688]' : 'bg-slate-100 text-slate-400'
                      )}>
                        <User className="w-6 h-6" strokeWidth={3} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-black text-slate-800 text-lg tracking-tight group-hover:text-[#009688] transition-colors italic uppercase leading-none">{adm.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wide">
                          {adm.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "px-4 py-1 rounded-full font-black text-[9px] uppercase tracking-widest border-2",
                      adm.role === 'super_admin' 
                        ? "bg-[#009688]/5 text-[#009688] border-[#009688]/10" 
                        : "bg-slate-50 text-slate-400 border-slate-100"
                    )}>
                      {adm.role === 'super_admin' ? "ROOT ACCESS" : "OPERATOR"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]",
                        adm.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                      )} />
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        adm.status === 'active' ? 'text-emerald-600' : 'text-rose-500'
                      )}>
                        {adm.status === 'active' ? 'Active' : 'Restricted'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {new Date(adm.createdAt).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' })}
                  </TableCell>
                  <TableCell className="text-right pr-10">
                    <div className="flex justify-end gap-2 opacity-100 group-hover:opacity-100 transition-all duration-300">
                       <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-[#009688]/10 hover:text-[#009688] text-slate-300 transition-all font-display" onClick={() => openEdit(adm)}>
                         <UserCog className="w-5 h-5" strokeWidth={2.5} />
                       </Button>
                       {adm.email !== 'Dhansalpara13@gmail.com' && adm.email !== currentUser?.email && (
                         <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-500 text-slate-300 transition-all font-display" onClick={() => handleDelete(adm.id)}>
                           <UserMinus className="w-5 h-5" strokeWidth={2.5} />
                         </Button>
                       )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-slate-200">
                    <div className="flex flex-col items-center gap-4">
                       <Shield className="w-12 h-12 animate-pulse opacity-10" />
                       <p className="font-black uppercase tracking-widest text-[9px] opacity-20">Syncing registry...</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-[32px] font-display">
          <form onSubmit={handleAdd}>
            <DialogHeader className="p-10 pb-6">
              <DialogTitle className="text-3xl font-black tracking-tighter text-slate-800 uppercase leading-none">Authorize Agent</DialogTitle>
              <DialogDescription className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Granting mission-critical system clearance.</DialogDescription>
            </DialogHeader>
            <div className="p-10 pt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Identity Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" required className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-base focus:ring-[#009688]/20 transition-all" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Terminal</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="agent@shashwa.in" required className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-base focus:ring-[#009688]/20 transition-all" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Access Protocol</Label>
                <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" required className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-black text-lg focus:ring-[#009688]/20 transition-all" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Authorization Tier</Label>
                <Select value={formData.role} onValueChange={(val: any) => setFormData({...formData, role: val})}>
                  <SelectTrigger className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-base shadow-none">
                    <SelectValue placeholder="Select Tier" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100">
                    <SelectItem value="admin" className="rounded-xl py-3 font-bold uppercase text-[11px] tracking-widest">Standard Operator</SelectItem>
                    <SelectItem value="super_admin" className="rounded-xl py-3 font-black text-[#009688] uppercase text-[11px] tracking-widest">Core Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="p-10 pt-4 bg-slate-50/50 border-t border-slate-50">
              <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-400">Abort</Button>
              <Button type="submit" className="rounded-2xl h-14 px-10 bg-[#009688] hover:bg-[#00796b] text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-[#009688]/20">Establish Node</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-[32px] font-display">
          <form onSubmit={handleEdit}>
            <DialogHeader className="p-10 pb-6">
              <DialogTitle className="text-3xl font-black tracking-tighter text-slate-800 uppercase leading-none">Modify Clearance</DialogTitle>
              <DialogDescription className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Adjusting operational parameters for agent.</DialogDescription>
            </DialogHeader>
            <div className="p-10 pt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Identity Name</Label>
                <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-base focus:ring-[#009688]/20 transition-all" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Terminal</Label>
                <Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-base focus:ring-[#009688]/20 transition-all" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Revise Protocol (Optional)</Label>
                <Input id="edit-password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Leave blank to retain current" className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-base focus:ring-[#009688]/20 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="edit-role" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Access Level</Label>
                  <Select value={formData.role} onValueChange={(val: any) => setFormData({...formData, role: val})}>
                    <SelectTrigger className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-base shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100">
                      <SelectItem value="admin" className="rounded-xl py-3 font-bold uppercase text-[10px] tracking-widest">Operator</SelectItem>
                      <SelectItem value="super_admin" className="rounded-xl py-3 font-black text-[#009688] uppercase text-[10px] tracking-widest">Root</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">System State</Label>
                  <Select value={formData.status} onValueChange={(val: any) => setFormData({...formData, status: val})}>
                    <SelectTrigger className="h-14 px-6 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-base shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100">
                      <SelectItem value="active" className="rounded-xl py-3 font-bold text-emerald-500 uppercase text-[10px] tracking-widest">Operational</SelectItem>
                      <SelectItem value="disabled" className="rounded-xl py-3 font-bold text-rose-500 uppercase text-[10px] tracking-widest">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="p-10 pt-4 bg-slate-50/50 border-t border-slate-50">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="rounded-xl font-black uppercase tracking-widest text-[10px] text-slate-400">Discard</Button>
              <Button type="submit" className="rounded-2xl h-14 px-10 bg-slate-800 hover:bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-slate-200/50">Apply Synchronization</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
