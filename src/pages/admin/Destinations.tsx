import * as React from 'react';
import { Destination } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, Search, MoreHorizontal, Edit, Trash2, 
  MapPin, Globe, Image as ImageIcon 
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ImageUpload';

const destinationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().url("Please enter a valid image URL"),
  category: z.enum(['domestic', 'international']),
});

type DestinationFormValues = z.infer<typeof destinationSchema>;

interface DestinationsPageProps {
  destinations: Destination[];
  onAdd: (data: any) => void;
  onEdit: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export function DestinationsPage({ destinations, onAdd, onEdit, onDelete }: DestinationsPageProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingDestination, setEditingDestination] = React.useState<Destination | null>(null);

  const filteredDestinations = destinations.filter(dest => 
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { register, handleSubmit, reset, setValue, control, formState: { errors }, watch } = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      image: '',
      category: 'domestic',
    }
  });

  const categoryValue = watch('category');
  const imageUrl = watch('image');
  const nameValue = watch('name');

  React.useEffect(() => {
    if (!editingDestination && nameValue) {
      const generatedSlug = nameValue.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setValue('slug', generatedSlug);
    }
  }, [nameValue, editingDestination, setValue]);

  const onSubmit = (values: DestinationFormValues) => {
    if (editingDestination) {
      onEdit(editingDestination.id, values);
    } else {
      onAdd(values);
    }
    setIsFormOpen(false);
    setEditingDestination(null);
    reset();
  };

  const handleEdit = (dest: Destination) => {
    setEditingDestination(dest);
    setValue('name', dest.name);
    setValue('slug', dest.slug || '');
    setValue('description', dest.description);
    setValue('image', dest.image);
    setValue('category', dest.category);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingDestination(null);
    reset();
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Destinations</h2>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Destination
        </Button>
      </div>

      <div className="border border-slate-200 bg-white p-4 rounded-lg flex items-center gap-4">
        <Search className="w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Search destinations..." 
          className="border-0 focus-visible:ring-0 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Location Details</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDestinations.map((dest) => (
              <tr key={dest.id}>
                <td className="px-4 py-3">
                  <img src={dest.image} alt={dest.name} className="w-12 h-12 rounded object-cover" />
                </td>
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-800">{dest.name}</div>
                </td>
                <td className="px-4 py-3 capitalize">{dest.category}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(dest)} className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 h-8 w-8 p-0">
                       <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(dest.id)} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-8 w-8 p-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white border-slate-200">
          <DialogHeader className="p-6 pb-2 shrink-0 border-b border-slate-100">
            <DialogTitle className="text-xl font-bold text-slate-800">{editingDestination ? 'Edit Destination' : 'Add New Destination'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 pt-2 scrollbar-hide space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700">Destination Name</Label>
                  <Input id="name" placeholder="e.g. Rajasthan" {...register('name')} className="border-slate-200" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-slate-700">Slug</Label>
                  <Input id="slug" placeholder="e.g. rajasthan" {...register('slug')} className="border-slate-200" />
                  {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-slate-700">Category</Label>
                <Select 
                  value={categoryValue} 
                  onValueChange={(val: any) => setValue('category', val)}
                >
                  <SelectTrigger id="category" className="border-slate-200">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic (India)</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      label="Destination Image"
                      folder="destinations"
                    />
                  )}
                />
                {errors.image && <p className="text-xs text-red-500">{errors.image.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700">Description</Label>
                <Textarea id="description" placeholder="A brief about the destination..." className="min-h-[100px] border-slate-200" {...register('description')} />
                {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
              </div>
            </div>

            <DialogFooter className="p-4 px-6 border-t border-slate-100 bg-slate-50 shrink-0 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="border-slate-300 text-slate-700 hover:bg-slate-100">Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">{editingDestination ? 'Update Destination' : 'Create Destination'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
