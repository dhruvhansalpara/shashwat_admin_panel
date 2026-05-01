import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Plus, Trash2, Edit2, Car as CarIcon, Users, Briefcase, Check, MoreHorizontal, Search, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Car } from '../../types';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ImageUpload';
import { cn } from '@/lib/utils';

interface CarsPageProps {
  cars: Car[];
  onAdd: (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEdit: (id: string, updates: Partial<Car>) => void;
  onDelete: (id: string) => void;
}

export function CarsPage({ cars, onAdd, onEdit, onDelete }: CarsPageProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCars = React.useMemo(() => {
    if (!searchTerm.trim()) return cars;
    const term = searchTerm.toLowerCase();
    return cars.filter(car => 
      car.name.toLowerCase().includes(term) || 
      car.type.toLowerCase().includes(term) ||
      car.description.toLowerCase().includes(term)
    );
  }, [cars, searchTerm]);

  React.useEffect(() => {
    if (editingCar) {
      setImageUrl(editingCar.image);
    } else {
      setImageUrl('');
    }
  }, [editingCar]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      seats: parseInt(formData.get('seats') as string),
      luggage: parseInt(formData.get('luggage') as string),
      pricePerKm: parseFloat(formData.get('pricePerKm') as string),
      pricePerDay: parseFloat(formData.get('pricePerDay') as string) || 0,
      image: formData.get('image') as string,
      description: formData.get('description') as string,
      features: (formData.get('features') as string).split(',').map(f => f.trim()),
      isAvailable: true
    };

    if (editingCar) {
      onEdit(editingCar.id, data);
      setEditingCar(null);
    } else {
      onAdd(data);
      setIsAddOpen(false);
    }
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
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-20"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 uppercase font-display leading-none">Car Rental Fleet</h2>
          <p className="text-[#009688] mt-1.5 font-bold uppercase tracking-widest text-[9px] pl-0.5 opacity-80">Manage your rental vehicles and transport services</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-12 px-8 gap-3 bg-[#009688] hover:bg-[#00796b] text-white shadow-2xl shadow-[#009688]/20 transition-all hover:scale-[1.02] active:scale-95 font-bold uppercase tracking-widest text-[10px]">
              <Plus className="w-4 h-4" strokeWidth={3} /> Add New Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] w-[95vw] max-h-[95vh] flex flex-col p-0 overflow-hidden bg-[#fcfdfe] border-none shadow-2xl rounded-[48px] font-display">
            <DialogHeader className="p-12 pb-8 shrink-0 bg-white border-b-2 border-slate-50">
              <DialogTitle className="text-4xl font-black tracking-tighter text-slate-800 uppercase italic">Add New Vehicle</DialogTitle>
              <DialogDescription className="text-[#009688] font-black uppercase tracking-[0.4em] text-[10px] mt-2 pl-1">
                 Enter the details for the new car or traveler in your fleet.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-10 pt-4 scrollbar-hide space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Vehicle Model</Label>
                      <Input id="name" name="name" placeholder="e.g. Toyota Innova Crysta" className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-base shadow-sm" required />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="type" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Class Type</Label>
                      <Input id="type" name="type" placeholder="e.g. Luxury SUV" className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-base shadow-sm text-primary" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="seats" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Seating</Label>
                      <Input id="seats" name="seats" type="number" placeholder="7" className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-center text-lg" required />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="luggage" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Baggage</Label>
                      <Input id="seats" name="luggage" type="number" placeholder="3" className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-center text-lg" required />
                    </div>
                    <div className="space-y-3 col-span-2">
                       <Label htmlFor="pricePerKm" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Rate / KM</Label>
                       <div className="relative">
                         <span className="absolute left-5 top-4.5 font-bold text-slate-300">₹</span>
                         <Input id="pricePerKm" name="pricePerKm" type="number" step="0.1" placeholder="18" className="h-14 pl-10 pr-6 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-lg" required />
                       </div>
                    </div>
                  </div>
                                    <div className="space-y-3">
                      <Label htmlFor="image" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Vehicle Photo</Label>
                      <div className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-sm">
                        <ImageUpload
                          value={imageUrl}
                          onChange={(url) => setImageUrl(url)}
                          label="Main Vehicle Image"
                          folder="cars"
                        />
                        <input type="hidden" name="image" value={imageUrl} />
                      </div>
                    </div>
                
                <div className="space-y-3">
                  <Label htmlFor="features" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Key Features (comma separated)</Label>
                  <Input id="features" name="features" placeholder="AC, Wi-Fi, First Aid, DVD Player" className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-sm" />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Vehicle Description</Label>
                  <Textarea id="description" name="description" placeholder="Short summary of the vehicle..." className="min-h-[120px] p-6 rounded-3xl border-slate-50 bg-slate-50/50 font-medium leading-relaxed shadow-sm" />
                </div>
              </div>
              <div className="p-12 bg-white border-t-2 border-slate-50 shrink-0 flex justify-between gap-6">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsAddOpen(false)} 
                  className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-400 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="h-16 px-14 rounded-2xl bg-[#009688] hover:bg-[#00796b] text-white font-black uppercase tracking-[0.25em] text-[11px] min-w-[280px] shadow-2xl shadow-[#009688]/20 transition-all hover:scale-[1.02]"
                >
                  Save Vehicle
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
      <motion.div variants={item} className="relative mb-12 max-w-xl group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#009688]">
          <Search className="w-5 h-5" strokeWidth={3} />
        </div>
        <Input 
          placeholder="Search fleet by vehicle name, type or features..." 
          className="h-14 pl-14 pr-8 rounded-[24px] border-2 border-[#009688]/20 bg-white shadow-xl shadow-[#009688]/10 text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-[#009688]/5 focus:border-[#009688] transition-all font-display"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      <div className="flex flex-col gap-6">
        {/* Column Titles */}
        <div className="hidden md:grid grid-cols-[112px_1fr_1fr_1fr_1.2fr] gap-8 px-12 py-4">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Vehicle Image</div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Model & Class</div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Fleet Specs</div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Pricing Structure</div>
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right pr-20">Technical Actions</div>
        </div>
        <AnimatePresence mode="popLayout">
          {filteredCars.map((car, idx) => (
            <motion.div 
              key={car.id} 
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
                <div className="relative w-24 h-24 rounded-[32px] overflow-hidden shadow-lg ring-8 ring-slate-50/50 group-hover:ring-[#009688]/10 transition-all duration-500">
                  <img src={car.image} alt={car.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" />
                </div>
              </div>

              <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
                <div className="space-y-1.5">
                  <div className="font-bold text-slate-800 text-base tracking-tight group-hover:text-[#009688] transition-colors font-display uppercase leading-none">{car.name}</div>
                  <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none">SERIAL: {car.id.substring(0, 8)}</div>
                </div>

                <div className="flex items-center gap-6">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Capacity</span>
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-[#009688]" strokeWidth={3} />
                        <span className="text-sm font-bold text-slate-700">{car.seats} Seats</span>
                      </div>
                   </div>
                   <div className="flex flex-col border-l border-slate-100 pl-6">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Baggage</span>
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-[#009688]" strokeWidth={3} />
                        <span className="text-sm font-bold text-slate-700">{car.luggage} Slots</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-black text-[#009688] uppercase tracking-widest opacity-60">STARTING PRICE</div>
                  <div className="text-lg font-bold text-slate-900 leading-none font-display">₹{car.pricePerKm} <span className="text-[10px] text-slate-400">/ KM</span></div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-5">
                   <Badge className="bg-[#e0f2f1] text-[#009688] px-3 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-widest border-2 border-[#009688]/10 shadow-sm hidden lg:block">
                     {car.type}
                   </Badge>
                   <div className="flex items-center gap-3">
                     <Button 
                       size="icon" 
                       variant="ghost" 
                       className="h-10 w-10 rounded-2xl bg-white shadow-xl shadow-slate-200/50 text-slate-700 hover:bg-[#009688] hover:text-white transition-all border border-slate-50"
                       onClick={() => setEditingCar(car)}
                     >
                       <Edit2 className="w-4 h-4" strokeWidth={3} />
                     </Button>
                     <Button 
                       size="icon" 
                       variant="ghost" 
                       className="h-10 w-10 rounded-2xl bg-white shadow-xl shadow-slate-200/50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-slate-50"
                       onClick={() => {
                         if (confirm('Permanently remove this vehicle?')) onDelete(car.id);
                       }}
                     >
                       <Trash2 className="w-4 h-4" strokeWidth={3} />
                     </Button>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {cars.length === 0 && (
          <motion.div 
            variants={item}
            className="col-span-full py-32 text-center flex flex-col items-center gap-4 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[40px]"
          >
             <CarIcon className="w-16 h-16 text-slate-200" strokeWidth={1} />
             <p className="font-black uppercase tracking-widest text-xs text-slate-300">Fleet database is empty</p>
             <Button variant="link" onClick={() => setIsAddOpen(true)} className="text-primary font-black uppercase tracking-widest text-[10px]">Add First Vehicle</Button>
          </motion.div>
        )}
      </div>

      {editingCar && (
        <Dialog open={!!editingCar} onOpenChange={() => setEditingCar(null)}>
          <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[92vh] flex flex-col p-0 overflow-hidden bg-[#fcfdfe] border-none shadow-2xl rounded-[40px]">
            <DialogHeader className="p-10 pb-6 shrink-0 bg-white">
              <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Update Registry</DialogTitle>
              <DialogDescription className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                 Modify technical specifications for {editingCar.name}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-10 pt-4 scrollbar-hide space-y-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle Imaging</Label>
                  <div className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-sm">
                    <ImageUpload
                      value={imageUrl}
                      onChange={(url) => setImageUrl(url)}
                      label="Update Vehicle Photo"
                      folder="cars"
                    />
                    <input type="hidden" name="image" value={imageUrl} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="edit-name" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle Name</Label>
                    <Input id="edit-name" name="name" defaultValue={editingCar.name} className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-base" required />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="edit-type" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Vehicle Type</Label>
                    <Input id="edit-type" name="type" defaultValue={editingCar.type} className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-base text-primary" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="edit-seats" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seats</Label>
                    <Input id="edit-seats" name="seats" type="number" defaultValue={editingCar.seats} className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-center" required />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="edit-luggage" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Baggage</Label>
                    <Input id="edit-luggage" name="luggage" type="number" defaultValue={editingCar.luggage} className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-center" required />
                  </div>
                  <div className="space-y-3 col-span-2">
                     <Label htmlFor="edit-pricePerKm" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price per KM (₹)</Label>
                     <Input id="edit-pricePerKm" name="pricePerKm" type="number" step="0.1" defaultValue={editingCar.pricePerKm} className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-lg" required />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="edit-pricePerDay" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price per Day (₹)</Label>
                  <Input id="edit-pricePerDay" name="pricePerDay" type="number" defaultValue={editingCar.pricePerDay || ''} className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-lg" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="edit-features" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amenities (comma list)</Label>
                  <Input id="edit-features" name="features" defaultValue={editingCar.features?.join(', ')} className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-bold" />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="edit-description" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Logistical Notes</Label>
                  <Textarea id="edit-description" name="description" defaultValue={editingCar.description} className="min-h-[120px] p-6 rounded-3xl border-slate-50 bg-slate-50/50 font-medium" />
                </div>
              </div>
              <div className="p-10 bg-white border-t border-slate-50 shrink-0 flex justify-between gap-4">
                <Button 
                   type="button"
                   variant="ghost" 
                   onClick={() => setEditingCar(null)} 
                   className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-400"
                >
                  Discard Changes
                </Button>
                <Button 
                   type="submit" 
                   className="h-14 px-12 rounded-2xl bg-[#009688] hover:bg-[#00796b] text-white font-black uppercase tracking-[0.2em] text-[11px] min-w-[240px] shadow-xl shadow-[#009688]/20 transition-all active:scale-95"
                >
                  Apply System Update
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </motion.div>
  );
}
