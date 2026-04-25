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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Car Fleet</h2>
          <p className="text-muted-foreground">Manage your vehicle inventory and rental rates.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>
                Add a new car or traveller to your fleet.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input id="name" name="name" placeholder="e.g. Toyota Innova Crysta" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Vehicle Type</Label>
                  <Input id="type" name="type" placeholder="e.g. Luxury SUV" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seats">Seats</Label>
                  <Input id="seats" name="seats" type="number" placeholder="7" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="luggage">Luggage Capacity</Label>
                  <Input id="luggage" name="luggage" type="number" placeholder="3" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerKm">Price per KM (₹)</Label>
                  <Input id="pricePerKm" name="pricePerKm" type="number" step="0.1" placeholder="18" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricePerDay">Price per Day (₹)</Label>
                  <Input id="pricePerDay" name="pricePerDay" type="number" placeholder="4500" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" placeholder="https://..." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features">Features (comma separated)</Label>
                <Input id="features" name="features" placeholder="AC, Music System, First Aid, Luggage Carrier" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" placeholder="Vehicle details..." />
              </div>
              <Button type="submit" className="w-full">Save Vehicle</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <Card key={car.id} className="overflow-hidden group">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={car.image} 
                alt={car.name} 
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="h-8 w-8"
                  onClick={() => setEditingCar(car)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="h-8 w-8"
                  onClick={() => {
                    if (confirm('Delete this vehicle?')) onDelete(car.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute bottom-2 left-2 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded">
                  {car.type}
                </span>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{car.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground border-b pb-2">
                <div className="flex items-center gap-1.5 font-medium">
                  <Users className="w-4 h-4 text-primary" /> {car.seats} Seats
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Briefcase className="w-4 h-4 text-primary" /> {car.luggage} Bags
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Rate/KM</p>
                  <p className="text-lg font-bold">₹{car.pricePerKm}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Rate/Day</p>
                  <p className="text-lg font-bold">₹{car.pricePerDay || '--'}</p>
                </div>
              </div>

              {car.features && car.features.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {car.features.map((feature, i) => (
                    <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded flex items-center gap-1">
                      <Check className="w-2 h-2 text-primary" /> {feature}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {editingCar && (
        <Dialog open={!!editingCar} onOpenChange={() => setEditingCar(null)}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Vehicle</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Vehicle Name</Label>
                  <Input id="edit-name" name="name" defaultValue={editingCar.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Vehicle Type</Label>
                  <Input id="edit-type" name="type" defaultValue={editingCar.type} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-seats">Seats</Label>
                  <Input id="edit-seats" name="seats" type="number" defaultValue={editingCar.seats} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-luggage">Luggage Capacity</Label>
                  <Input id="edit-luggage" name="luggage" type="number" defaultValue={editingCar.luggage} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-pricePerKm">Price per KM (₹)</Label>
                  <Input id="edit-pricePerKm" name="pricePerKm" type="number" step="0.1" defaultValue={editingCar.pricePerKm} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-pricePerDay">Price per Day (₹)</Label>
                  <Input id="edit-pricePerDay" name="pricePerDay" type="number" defaultValue={editingCar.pricePerDay} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image">Image URL</Label>
                <Input id="edit-image" name="image" defaultValue={editingCar.image} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-features">Features (comma separated)</Label>
                <Input id="edit-features" name="features" defaultValue={editingCar.features?.join(', ')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea id="edit-description" name="description" defaultValue={editingCar.description} />
              </div>
              <Button type="submit" className="w-full">Update Vehicle</Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
