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
import { Plus, Trash2, Edit2, Car as CarIcon, Users, Briefcase, Check, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Car } from '../../types';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ImageUpload';

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
          <h2 className="text-5xl font-black tracking-tighter text-slate-800 uppercase font-display leading-none italic">Car Rental Fleet</h2>
          <p className="text-[#009688] mt-2 font-black uppercase tracking-[0.4em] text-[10px] pl-0.5 opacity-100">Manage your rental vehicles and transport services</p>
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl h-16 px-10 gap-3 bg-[#009688] hover:bg-[#00796b] text-white shadow-2xl shadow-[#009688]/20 transition-all hover:scale-[1.02] active:scale-95 font-black uppercase tracking-[0.25em] text-[11px]">
              <Plus className="w-5 h-5" strokeWidth={3} /> Add New Vehicle
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {cars.map((car) => (
            <motion.div 
              key={car.id} 
              variants={item}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group bg-white rounded-[48px] border-2 border-slate-50 shadow-[0_16px_48px_rgba(0,0,0,0.03)] overflow-hidden hover:shadow-2xl hover:shadow-[#009688]/10 hover:border-[#009688]/10 transition-all duration-500"
            >
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-50 border-b-2 border-slate-50">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-125 duration-1000"
                />
                <div className="absolute top-6 right-6 flex gap-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-12 w-12 rounded-2xl bg-white/95 backdrop-blur shadow-2xl text-slate-700 hover:bg-[#009688] hover:text-white transition-all border border-slate-50"
                    onClick={() => setEditingCar(car)}
                  >
                    <Edit2 className="w-5 h-5" strokeWidth={3} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-12 w-12 rounded-2xl bg-white/95 backdrop-blur shadow-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-slate-50"
                    onClick={() => {
                      if (confirm('Permanently remove this vehicle from fleet records?')) onDelete(car.id);
                    }}
                  >
                    <Trash2 className="w-5 h-5" strokeWidth={3} />
                  </Button>
                </div>
                <div className="absolute top-6 left-6">
                   <Badge className="bg-[#009688] text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-[#009688]/20 border-none">
                     {car.type}
                   </Badge>
                </div>
              </div>
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="space-y-3">
                    <h3 className="text-3xl font-black text-slate-800 tracking-tighter leading-none group-hover:text-[#009688] transition-colors font-display uppercase italic">{car.name}</h3>
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] font-display opacity-60 italic">ASSET-SERIAL: {car.id.substring(0, 8)}</div>
                  </div>
                  <div className="bg-[#e0f2f1] p-5 rounded-[28px] text-[#009688] group-hover:bg-[#009688] group-hover:text-white transition-all shadow-inner relative overflow-hidden group/icon">
                    <CarIcon className="w-7 h-7 relative z-10" strokeWidth={3} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                   <div className="bg-slate-50/50 p-4 rounded-[20px] flex items-center gap-3 border border-slate-50 transition-colors group-hover:bg-primary/[0.03]">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-slate-300 uppercase">Seating</div>
                        <div className="font-black text-slate-700 text-sm">{car.seats} Capacity</div>
                      </div>
                   </div>
                   <div className="bg-slate-50/50 p-4 rounded-[20px] flex items-center gap-3 border border-slate-50 transition-colors group-hover:bg-primary/[0.03]">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[9px] font-black text-slate-300 uppercase">Baggage</div>
                        <div className="font-black text-slate-700 text-sm">{car.luggage} Slots</div>
                      </div>
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Starting Price</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900">₹{car.pricePerKm}</span>
                      <span className="text-[10px] font-black text-slate-300 uppercase">/ KM</span>
                    </div>
                  </div>
                  {car.pricePerDay > 0 && (
                    <div className="space-y-0.5 text-right">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daily Lease</div>
                      <div className="font-black text-slate-700 text-base">₹{car.pricePerDay}</div>
                    </div>
                  )}
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
                   className="h-14 px-12 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-black uppercase tracking-[0.2em] text-[11px] min-w-[240px] shadow-xl shadow-secondary/20 transition-all"
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
