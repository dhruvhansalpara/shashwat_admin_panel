import React, { useState, useEffect } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  
  // Form states
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
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Admin Management</h2>
          <p className="text-muted-foreground mt-1">Manage platform administrators and permissions.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="rounded-xl gap-2 shadow-lg shadow-primary/20">
          <UserPlus className="w-4 h-4" /> Add Admin
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50 border-none">
                <TableHead className="pl-8 py-5 text-[10px] font-bold uppercase tracking-widest">Admin User</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Role</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-widest">Joined</TableHead>
                <TableHead className="text-right pr-8 text-[10px] font-bold uppercase tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((adm) => (
                <TableRow key={adm.id} className="group border-none hover:bg-muted/20 transition-colors">
                  <TableCell className="pl-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                        adm.role === 'super_admin' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm tracking-tight">{adm.name}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {adm.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={adm.role === 'super_admin' ? 'default' : 'secondary'} className="rounded-md px-2 py-0.5 font-bold text-[10px] uppercase tracking-wide">
                      {adm.role === 'super_admin' ? (
                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Super Admin</span>
                      ) : (
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Admin</span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${adm.status === 'active' ? 'bg-emerald-500' : 'bg-red-400'}`} />
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${adm.status === 'active' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {adm.status}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {new Date(adm.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex justify-end gap-2">
                       <Button size="icon" variant="ghost" className="rounded-lg h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => openEdit(adm)}>
                         <UserCog className="w-4 h-4" />
                       </Button>
                       {adm.email !== 'Dhansalpara13@gmail.com' && adm.email !== currentUser?.email && (
                         <Button size="icon" variant="ghost" className="rounded-lg h-8 w-8 hover:bg-red-50 hover:text-red-500" onClick={() => handleDelete(adm.id)}>
                           <UserMinus className="w-4 h-4" />
                         </Button>
                       )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                    Loading administrators...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[450px] w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <form onSubmit={handleAdd} className="flex flex-col h-full overflow-hidden">
            <DialogHeader className="p-6 pb-2 shrink-0">
              <DialogTitle className="text-2xl font-bold">Add Administrator</DialogTitle>
              <DialogDescription>Create a new administrative account for the portal.</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-widest font-bold">Full Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="John Doe" required className="rounded-xl h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-widest font-bold">Email Address</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" required className="rounded-xl h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-widest font-bold">Password</Label>
                <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" required className="rounded-xl h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-xs uppercase tracking-widest font-bold">Account Role</Label>
                <Select value={formData.role} onValueChange={(val: any) => setFormData({...formData, role: val})}>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="super_admin">Super Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="p-4 px-6 border-t bg-muted/30 shrink-0">
              <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-widest mr-auto">Cancel</Button>
              <Button type="submit" className="rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Create Admin</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[450px] w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <form onSubmit={handleEdit} className="flex flex-col h-full overflow-hidden">
            <DialogHeader className="p-6 pb-2 shrink-0">
              <DialogTitle className="text-2xl font-bold">Edit Administrator</DialogTitle>
              <DialogDescription>Modify permissions or account status.</DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="edit-name" className="text-xs uppercase tracking-widest font-bold">Full Name</Label>
                <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="rounded-xl h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email" className="text-xs uppercase tracking-widest font-bold">Email Address</Label>
                <Input id="edit-email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="rounded-xl h-11" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password" className="text-xs uppercase tracking-widest font-bold">New Password (Optional)</Label>
                <Input id="edit-password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Leave blank to keep current" className="rounded-xl h-11" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-role" className="text-xs uppercase tracking-widest font-bold">Role</Label>
                  <Select value={formData.role} onValueChange={(val: any) => setFormData({...formData, role: val})}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status" className="text-xs uppercase tracking-widest font-bold">Status</Label>
                  <Select value={formData.status} onValueChange={(val: any) => setFormData({...formData, status: val})}>
                    <SelectTrigger className="rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="p-4 px-6 border-t bg-muted/30 shrink-0">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-widest mr-auto">Cancel</Button>
              <Button type="submit" className="rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
