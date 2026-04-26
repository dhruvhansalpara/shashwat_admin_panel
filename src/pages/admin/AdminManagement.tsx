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
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-800 uppercase font-display leading-none italic">Admin Users</h2>
          <p className="text-[#009688] mt-2 font-black uppercase tracking-[0.4em] text-[10px] pl-0.5 opacity-100">Add or remove team members who can manage the website content</p>
        </div>
        <Button 
          onClick={() => setIsAddOpen(true)} 
          className="rounded-2xl h-16 px-10 gap-3 bg-[#009688] hover:bg-[#00796b] text-white shadow-2xl shadow-[#009688]/20 transition-all hover:scale-[1.02] active:scale-95 font-black uppercase tracking-[0.25em] text-[11px]"
        >
          <UserPlus className="w-5 h-5" strokeWidth={3} /> Add New Admin
        </Button>
      </div>

      <div className="bg-white rounded-[32px] border-2 border-slate-50 shadow-[0_8px_40px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="hover:bg-transparent border-b border-slate-100/50">
                <TableHead className="pl-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">User Details</TableHead>
                <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Access Role</TableHead>
                <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Status</TableHead>
                <TableHead className="py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Joined Date</TableHead>
                <TableHead className="text-right pr-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Actions</TableHead>
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
                      {adm.role === 'super_admin' ? "SUPER ADMIN" : "STAFF ADMIN"}
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
        <DialogContent className="sm:max-w-[550px] w-[95vw] p-0 overflow-hidden bg-[#fcfdfe] border-none shadow-2xl rounded-[48px] font-display">
          <form onSubmit={handleAdd}>
            <DialogHeader className="p-12 pb-8 bg-white border-b-2 border-slate-50">
              <DialogTitle className="text-4xl font-black tracking-tighter text-slate-800 uppercase italic leading-none">Add Admin User</DialogTitle>
              <DialogDescription className="text-[#009688] font-black uppercase tracking-[0.4em] text-[10px] mt-2 pl-1">Give a team member access to the admin panel.</DialogDescription>
            </DialogHeader>
            <div className="p-12 pt-8 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Subject Identity</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Agent Smith" required className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-lg focus:ring-[#009688]/20 transition-all shadow-sm" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Communication Terminal (Email)</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="agent@shashwa.in" required className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-lg focus:ring-[#009688]/20 transition-all shadow-sm" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Access Key (Password)</Label>
                <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" required className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-xl focus:ring-[#009688]/20 transition-all shadow-sm" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Access Role</Label>
                <Select value={formData.role} onValueChange={(val: any) => setFormData({...formData, role: val})}>
                  <SelectTrigger className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-lg shadow-none border-none">
                    <SelectValue placeholder="Select Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Standard Operator</SelectItem>
                    <SelectItem value="super_admin">Root Level Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="p-12 pt-6 bg-white border-t-2 border-slate-50 flex justify-between gap-6">
              <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-400 hover:bg-slate-50">Abort</Button>
              <Button type="submit" className="h-16 px-12 rounded-2xl bg-[#009688] hover:bg-[#00796b] text-white font-black uppercase tracking-[0.25em] text-[11px] min-w-[260px] shadow-2xl shadow-[#009688]/20">Establish Presence</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[550px] w-[95vw] p-0 overflow-hidden bg-[#fcfdfe] border-none shadow-2xl rounded-[48px] font-display">
          <form onSubmit={handleEdit}>
            <DialogHeader className="p-12 pb-8 bg-white border-b-2 border-slate-50">
              <DialogTitle className="text-4xl font-black tracking-tighter text-slate-800 uppercase italic leading-none">Edit Access</DialogTitle>
              <DialogDescription className="text-[#009688] font-black uppercase tracking-[0.4em] text-[10px] mt-2 pl-1">Adjusting user permissions and access levels.</DialogDescription>
            </DialogHeader>
            <div className="p-12 pt-8 space-y-8">
              <div className="space-y-3">
                <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Subject Identity</Label>
                <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-lg focus:ring-[#009688]/20 transition-all shadow-sm" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="edit-email" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Communication Terminal (Email)</Label>
                <Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-lg focus:ring-[#009688]/20 transition-all shadow-sm" />
              </div>
              <div className="space-y-3">
                <Label htmlFor="edit-password" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Revise Protocol (Optional Password)</Label>
                <Input id="edit-password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Leave blank to retain current" className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-xl focus:ring-[#009688]/20 transition-all shadow-sm" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="edit-role" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Access Level</Label>
                  <Select value={formData.role} onValueChange={(val: any) => setFormData({...formData, role: val})}>
                    <SelectTrigger className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-lg shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Operator</SelectItem>
                      <SelectItem value="super_admin">Root Node</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="edit-status" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">System State</Label>
                  <Select value={formData.status} onValueChange={(val: any) => setFormData({...formData, status: val})}>
                    <SelectTrigger className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-lg shadow-none border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Operational</SelectItem>
                      <SelectItem value="disabled">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="p-12 pt-6 bg-white border-t-2 border-slate-50 flex justify-between gap-6">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-400 hover:bg-slate-50">Abort</Button>
              <Button type="submit" className="h-16 px-12 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black uppercase tracking-[0.25em] text-[11px] min-w-[260px] shadow-2xl shadow-slate-200/50">Apply Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
