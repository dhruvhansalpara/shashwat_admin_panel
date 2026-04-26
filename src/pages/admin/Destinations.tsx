import * as React from 'react';
import { cn } from '@/lib/utils';
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
  packages: Package[];
  onAdd: (data: any) => void;
  onEdit: (id: string, data: any) => void;
  onDelete: (id: string) => void;
}

export function DestinationsPage({ destinations, packages, onAdd, onEdit, onDelete }: DestinationsPageProps) {
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
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase font-display leading-none">Geographic Mapping</h2>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-[0.3em] text-[10px] pl-1 font-display opacity-60">Defining global operational boundaries and regional classification</p>
        </div>
        <Button 
          onClick={handleAddNew} 
          className="rounded-[20px] h-14 px-10 gap-3 bg-[#001f3f] hover:bg-[#002f5f] text-white shadow-sm transition-all hover:scale-[1.02] active:scale-95 font-black uppercase tracking-[0.2em] text-[11px] font-display"
        >
          <Plus className="w-5 h-5" strokeWidth={3} /> INITIALIZE MAPPING
        </Button>
      </div>

      <div className="bg-white rounded-[48px] border-2 border-slate-50 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/20 hover:bg-slate-50/20 transition-none">
                <th className="pl-12 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-display">Identity Parameter</th>
                <th className="py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-display">Classification</th>
                <th className="py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-display">Connectivity</th>
                <th className="py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-display">Logic Slug</th>
                <th className="px-12 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-right font-display">Directives</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDestinations.map((dest) => {
                const packageCount = packages.filter(pkg => pkg.destination_ids?.includes(dest.id)).length;
                return (
                  <tr key={dest.id} className="group hover:bg-slate-50/30 transition-all duration-300 border-none">
                    <td className="pl-12 py-8">
                      <div className="flex items-center gap-6">
                        <div className="relative w-20 h-20 rounded-[32px] overflow-hidden shadow-inner ring-4 ring-slate-50 group-hover:rounded-2xl transition-all duration-700">
                          <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="font-black text-slate-900 text-xl tracking-tighter group-hover:text-primary transition-colors font-display uppercase italic">{dest.name}</div>
                          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] leading-none font-display">Ref: {dest.id.substring(0, 12)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-7">
                      <Badge variant="secondary" className={cn(
                        "px-4 py-1.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] border-2",
                        dest.category === 'international' 
                          ? "bg-secondary/10 text-secondary border-secondary/10" 
                          : "bg-primary/10 text-primary border-primary/10"
                      )}>
                        {dest.category === 'international' ? 'International Segment' : 'Domestic Core'}
                      </Badge>
                    </td>
                    <td className="py-7">
                      <div className="flex flex-col">
                        <span className="text-lg font-black text-slate-800">{packageCount}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Tours</span>
                      </div>
                    </td>
                    <td className="py-7">
                      <code className="text-xs font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 uppercase tracking-tighter">/{dest.slug}</code>
                    </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end items-center gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                       <Button variant="ghost" size="icon" onClick={() => handleEdit(dest)} className="h-11 w-11 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all">
                          <Edit className="w-5 h-5" strokeWidth={2.5} />
                       </Button>
                       <Button variant="ghost" size="icon" onClick={() => onDelete(dest.id)} className="h-11 w-11 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                         <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                       </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
              {filteredDestinations.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3 text-slate-300">
                      <MapPin className="w-12 h-12 opacity-20" />
                      <p className="font-black uppercase tracking-widest text-xs">No destinations mapped yet</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[95vh] flex flex-col p-0 overflow-hidden bg-[#fcfdfe] border-none shadow-2xl rounded-[40px]">
          <DialogHeader className="p-10 pb-6 shrink-0 bg-white">
            <DialogTitle className="text-3xl font-black tracking-tighter text-[#001f3f] uppercase">
              {editingDestination ? 'EDIT DESTINATION' : 'NEW MAPPING'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
              Defining the boundaries of adventure
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-10 pt-4 scrollbar-hide space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Display Name</Label>
                  <Input id="name" placeholder="e.g. Rajasthan" {...register('name')} className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-base shadow-sm" />
                  {errors.name && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1">{errors.name.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">URL / Slug</Label>
                  <Input id="slug" placeholder="e.g. rajasthan" {...register('slug')} className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-base shadow-sm text-slate-500" />
                  {errors.slug && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1">{errors.slug.message}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Market Segment</Label>
                <Select 
                  value={categoryValue} 
                  onValueChange={(val: any) => setValue('category', val)}
                >
                  <SelectTrigger id="category" className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-base shadow-sm">
                    <SelectValue placeholder="Identify region type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-2 border-slate-100">
                    <SelectItem value="domestic" className="rounded-xl py-3 font-bold">Domestic India</SelectItem>
                    <SelectItem value="international" className="rounded-xl py-3 font-bold">International Segment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Representative Image</Label>
                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        label="Upload Thumbnail"
                        folder="destinations"
                      />
                    </div>
                  )}
                />
                {errors.image && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1">{errors.image.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Short Narrative</Label>
                <Textarea id="description" placeholder="Capture the essence of this place in a few words..." className="min-h-[140px] p-6 rounded-3xl border-slate-50 bg-slate-50/50 font-medium leading-relaxed shadow-sm" {...register('description')} />
                {errors.description && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1">{errors.description.message}</p>}
              </div>
            </div>

            <DialogFooter className="p-10 bg-white border-t border-slate-50 shrink-0 flex justify-between gap-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsFormOpen(false)} 
                className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-400 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="h-14 px-12 rounded-2xl bg-[#001f3f] hover:bg-[#002f5f] text-white font-black uppercase tracking-[0.2em] text-[11px] min-w-[240px] shadow-sm transition-all"
              >
                {editingDestination ? 'UPDATE DESTINATION' : 'INITIALIZE DESTINATION'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
