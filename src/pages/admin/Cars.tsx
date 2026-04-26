import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Plus, Trash2, Edit2, Car as CarIcon, Users, Briefcase, Check } from 'lucide-react';
import { Car } from '../../types';
import { toast } from 'sonner';

interface CarsPageProps {
  cars: Car[];
  onAdd: (car: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEdit: (id: string, updates: Partial<Car>) => void;
  onDelete: (id: string) => void;
}

export function CarsPage({ cars, onAdd, onEdit, onDelete }: CarsPageProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Car Fleet</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white border-slate-200">
            <DialogHeader className="p-6 pb-2 shrink-0 border-b border-slate-100">
              <DialogTitle className="text-xl font-bold text-slate-800">Add New Vehicle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700">Vehicle Name</Label>
                      <Input id="name" name="name" placeholder="e.g. Toyota Innova Crysta" className="border-slate-200" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-slate-700">Vehicle Type</Label>
                      <Input id="type" name="type" placeholder="e.g. Luxury SUV" className="border-slate-200" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seats" className="text-slate-700">Seats</Label>
                      <Input id="seats" name="seats" type="number" placeholder="7" className="border-slate-200" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="luggage" className="text-slate-700">Luggage Capacity</Label>
                      <Input id="luggage" name="luggage" type="number" placeholder="3" className="border-slate-200" required />
                    </div>
                  </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerKm" className="text-slate-700">Price per KM (₹)</Label>
                    <Input id="pricePerKm" name="pricePerKm" type="number" step="0.1" placeholder="18" className="border-slate-200" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerDay" className="text-slate-700">Price per Day (₹)</Label>
                    <Input id="pricePerDay" name="pricePerDay" type="number" placeholder="4500" className="border-slate-200" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-slate-700">Image URL</Label>
                  <Input id="image" name="image" placeholder="https://..." className="border-slate-200" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="features" className="text-slate-700">Features (comma separated)</Label>
                  <Input id="features" name="features" placeholder="AC, Music System, First Aid, Luggage Carrier" className="border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700">Description</Label>
                  <Textarea id="description" name="description" placeholder="Vehicle details..." className="border-slate-200" />
                </div>
              </div>
              <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 shrink-0">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">Save Vehicle</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <div key={car.id} className="border border-slate-200 bg-white rounded-lg overflow-hidden flex flex-col">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={car.image} 
                alt={car.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button 
                  size="sm" 
                  variant="secondary" 
                  className="bg-white/90 hover:bg-white h-8 w-8 p-0"
                  onClick={() => setEditingCar(car)}
                >
                  <Edit2 className="w-4 h-4 text-slate-700" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  className="bg-white/90 hover:bg-white h-8 w-8 p-0"
                  onClick={() => {
                    if (confirm('Delete this vehicle?')) onDelete(car.id);
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-md font-bold text-slate-800 mb-4">{car.name}</h3>
              <div className="space-y-3 mb-4">
                 <div className="flex justify-between text-sm text-slate-600">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400" /> {car.seats} Seats</span>
                    <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-400" /> {car.luggage} Bags</span>
                 </div>
                 <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100 mt-2">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Rate/KM</p>
                      <p className="text-lg font-bold text-slate-800">₹{car.pricePerKm}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Rate/Day</p>
                      <p className="text-lg font-bold text-slate-800">₹{car.pricePerDay || '--'}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingCar && (
        <Dialog open={!!editingCar} onOpenChange={() => setEditingCar(null)}>
          <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white border-slate-200">
            <DialogHeader className="p-6 pb-2 shrink-0 border-b border-slate-100">
              <DialogTitle className="text-xl font-bold text-slate-800">Edit Vehicle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-slate-700">Vehicle Name</Label>
                    <Input id="edit-name" name="name" defaultValue={editingCar.name} className="border-slate-200" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type" className="text-slate-700">Vehicle Type</Label>
                    <Input id="edit-type" name="type" defaultValue={editingCar.type} className="border-slate-200" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-seats" className="text-slate-700">Seats</Label>
                    <Input id="edit-seats" name="seats" type="number" defaultValue={editingCar.seats} className="border-slate-200" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-luggage" className="text-slate-700">Luggage Capacity</Label>
                    <Input id="edit-luggage" name="luggage" type="number" defaultValue={editingCar.luggage} className="border-slate-200" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-pricePerKm" className="text-slate-700">Price per KM (₹)</Label>
                    <Input id="edit-pricePerKm" name="pricePerKm" type="number" step="0.1" defaultValue={editingCar.pricePerKm} className="border-slate-200" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-pricePerDay" className="text-slate-700">Price per Day (₹)</Label>
                    <Input id="edit-pricePerDay" name="pricePerDay" type="number" defaultValue={editingCar.pricePerDay} className="border-slate-200" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-image" className="text-slate-700">Image URL</Label>
                  <Input id="edit-image" name="image" defaultValue={editingCar.image} className="border-slate-200" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-features" className="text-slate-700">Features (comma separated)</Label>
                  <Input id="edit-features" name="features" defaultValue={editingCar.features?.join(', ')} className="border-slate-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description" className="text-slate-700">Description</Label>
                  <Textarea id="edit-description" name="description" defaultValue={editingCar.description} className="border-slate-200" />
                </div>
              </div>
              <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 shrink-0">
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">Update Vehicle</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
