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
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-display font-black tracking-tight text-slate-900">Destinations</h2>
          <p className="text-slate-500 font-medium">Manage the regions and cities your tour packages cover.</p>
        </div>
        <Button onClick={handleAddNew} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-12 shadow-lg shadow-primary/20 font-bold transition-all hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5 mr-1" /> Add New Destination
        </Button>
      </div>

      <div className="border border-slate-200/60 bg-white p-2 rounded-2xl flex items-center gap-3 shadow-sm hover-card">
        <div className="p-3 bg-slate-50 rounded-xl">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <Input 
          placeholder="Search destinations..." 
          className="border-0 focus-visible:ring-0 text-base font-medium placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border border-slate-200/60 rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-[0.2em] border-b border-slate-100">
            <tr>
              <th className="px-6 py-5">Thumbnail</th>
              <th className="px-6 py-5">Location Details</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredDestinations.map((dest) => (
              <tr key={dest.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-6 py-5">
                  <div className="relative w-16 h-12 overflow-hidden rounded-xl bg-slate-100">
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{dest.name}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> /{dest.slug}
                  </div>
                </td>
                <td className="px-6 py-5 capitalize">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {dest.category}
                  </Badge>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEdit(dest)} 
                      className="h-10 w-10 p-0 rounded-xl bg-slate-50 text-amber-600 hover:bg-amber-100 transition-all hover:scale-110 shadow-sm"
                    >
                       <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(dest.id)} 
                      className="h-10 w-10 p-0 rounded-xl bg-slate-50 text-rose-600 hover:bg-rose-100 transition-all hover:scale-110 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDestinations.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-20">
                   <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No destinations found</p>
                   </div>
                </td>
              </tr>
            )}
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
