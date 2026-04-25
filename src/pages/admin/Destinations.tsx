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
      description: '',
      image: '',
      category: 'domestic',
    }
  });

  const categoryValue = watch('category');
  const imageUrl = watch('image');

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight">Destinations</h2>
          <p className="text-muted-foreground">Manage travel locations and categories.</p>
        </div>
        <Button onClick={handleAddNew} className="gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Add Destination
        </Button>
      </div>

      <div className="flex items-center gap-2 bg-card p-4 rounded-xl shadow-sm border">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input 
          placeholder="Search destinations..." 
          className="border-none focus-visible:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Location Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDestinations.map((dest) => (
              <TableRow key={dest.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="w-12 h-12 rounded-lg overflow-hidden border shadow-sm">
                    <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-bold">{dest.name}</div>
                  <div className="text-xs text-muted-foreground line-clamp-1 max-w-xs">{dest.description}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={dest.category === 'domestic' ? 'outline' : 'secondary'} className="capitalize gap-1">
                    {dest.category === 'domestic' ? <MapPin className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    {dest.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 border">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuLabel>Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleEdit(dest)} className="gap-2">
                        <Edit className="w-4 h-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(dest.id)}
                        className="text-destructive gap-2 focus:bg-destructive/10 focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredDestinations.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No destinations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingDestination ? 'Edit Destination' : 'Add New Destination'}</DialogTitle>
            <DialogDescription>
              Provide information about this travel location.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Destination Name</Label>
              <Input id="name" placeholder="e.g. Rajasthan, Switzerland" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={categoryValue} 
                onValueChange={(val: any) => setValue('category', val)}
              >
                <SelectTrigger id="category">
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
              {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="A brief about the destination..." className="min-h-[100px]" {...register('description')} />
              {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full">{editingDestination ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
