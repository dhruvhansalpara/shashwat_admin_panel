import * as React from 'react';
import { cn } from '@/lib/utils';
import { Destination, Package } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, Search, MoreHorizontal, Edit, Trash2, 
  MapPin, Globe, Image as ImageIcon 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  image: z.string().min(1, "Image is required"),
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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

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
    <>
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-20"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-slate-800 uppercase font-display leading-none italic">Destinations</h2>
          <p className="text-[#009688] mt-2 font-black uppercase tracking-[0.4em] text-[10px] pl-0.5 opacity-100">Manage the destinations where you offer tour packages</p>
        </div>
        <Button 
          onClick={handleAddNew} 
          className="rounded-2xl h-16 px-10 gap-3 bg-[#009688] hover:bg-[#00796b] text-white shadow-2xl shadow-[#009688]/20 transition-all hover:scale-[1.02] active:scale-95 font-black uppercase tracking-[0.25em] text-[11px]"
        >
          <Plus className="w-5 h-5" strokeWidth={3} /> Add New Destination
        </Button>
      </motion.div>

      <motion.div variants={item} className="bg-white rounded-[48px] border-2 border-slate-50 shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-50 bg-slate-50/10 hover:bg-slate-50/10 transition-none">
                <th className="pl-12 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 font-display italic">Destination Info</th>
                <th className="py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 font-display italic">Classification</th>
                <th className="py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 font-display italic">Tours Count</th>
                <th className="py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 font-display italic">URL Path</th>
                <th className="px-12 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 text-right font-display italic">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50/20">
              <AnimatePresence mode="popLayout">
                {filteredDestinations.map((dest, idx) => {
                  const packageCount = packages.filter(pkg => pkg.destination_ids?.includes(dest.id)).length;
                  return (
                    <motion.tr 
                      key={dest.id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-slate-50/60 transition-all duration-300 border-none"
                    >
                      <td className="pl-12 py-10">
                        <div className="flex items-center gap-8">
                          <div className="relative w-24 h-24 rounded-[36px] overflow-hidden shadow-2xl shadow-slate-200 group-hover:rounded-2xl transition-all duration-700 ring-8 ring-slate-50/30">
                            <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform group-hover:scale-125 duration-1000" />
                          </div>
                          <div className="space-y-2">
                            <div className="font-black text-slate-800 text-2xl tracking-tighter group-hover:text-[#009688] transition-colors font-display uppercase italic leading-none">{dest.name}</div>
                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.25em] leading-none font-display">REG-ID: {dest.id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-10">
                        <Badge variant="secondary" className={cn(
                          "px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.25em] border-2 shadow-sm",
                          dest.category === 'international' 
                            ? "bg-rose-500/5 text-rose-500 border-rose-500/10" 
                            : "bg-[#009688]/5 text-[#009688] border-[#009688]/10"
                        )}>
                          {dest.category === 'international' ? 'International' : 'Domestic'}
                        </Badge>
                      </td>
                      <td className="py-10">
                        <div className="flex flex-col">
                          <span className="text-2xl font-black text-slate-800 font-display italic leading-none truncate">{packageCount}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Modules</span>
                        </div>
                      </td>
                      <td className="py-10">
                        <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 w-fit">
                          <code className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">/{dest.slug}</code>
                        </div>
                      </td>
                    <td className="px-12 py-10 text-right">
                      <div className="flex justify-end items-center gap-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                         <Button variant="ghost" size="icon" onClick={() => handleEdit(dest)} className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 hover:bg-[#009688]/10 hover:text-[#009688] transition-all border border-slate-50">
                            <Edit className="w-5 h-5" strokeWidth={3} />
                         </Button>
                         <Button variant="ghost" size="icon" onClick={() => { if(confirm("Terminate territory link?")) onDelete(dest.id) }} className="h-12 w-12 rounded-2xl bg-white shadow-xl shadow-slate-200/50 hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-50">
                           <Trash2 className="w-5 h-5" strokeWidth={3} />
                         </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
              </AnimatePresence>
              {filteredDestinations.length === 0 && (
                <tr className="border-none">
                  <td colSpan={5} className="text-center py-20 border-none">
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
      </motion.div>
    </motion.div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[95vh] flex flex-col p-0 overflow-hidden bg-[#fcfdfe] border-none shadow-2xl rounded-[48px] font-display">
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
            <DialogHeader className="p-12 pb-8 shrink-0 bg-white border-b-2 border-slate-50">
              <DialogTitle className="text-4xl font-black tracking-tighter text-slate-800 uppercase italic leading-none">
                {editingDestination ? 'Modify Territory' : 'Initialize Mapping'}
              </DialogTitle>
              <DialogDescription className="text-[#009688] font-black uppercase tracking-[0.4em] text-[10px] mt-3 pl-1">
                Defining the operational boundaries of the global travel grid.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto p-12 pt-8 scrollbar-hide space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Territory Name</Label>
                  <Input id="name" placeholder="e.g. Rajasthan" {...register('name')} className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-lg shadow-sm focus:ring-[#009688]/20 transition-all" />
                  {errors.name && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-2">{errors.name.message}</p>}
                </div>
                <div className="space-y-3">
                  <Label htmlFor="slug" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">System Slug (URL)</Label>
                  <Input id="slug" placeholder="e.g. rajasthan" {...register('slug')} className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-lg shadow-sm text-[#009688]/60 focus:ring-[#009688]/20 transition-all" />
                  {errors.slug && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-2">{errors.slug.message}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Regional Market Segment</Label>
                <Select 
                  value={categoryValue} 
                  onValueChange={(val: any) => setValue('category', val)}
                >
                  <SelectTrigger id="category" className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-black text-lg shadow-none border-none">
                    <SelectValue placeholder="Identify region type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic Operation</SelectItem>
                    <SelectItem value="international">International Segment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Representative Visual Data</Label>
                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <ImageUpload
                      value={field.value}
                      onChange={field.onChange}
                      label="Atmospheric Thumbnail"
                      folder="destinations"
                    />
                  )}
                />
                {errors.image && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-2">{errors.image.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Narrative Summary</Label>
                <Textarea id="description" placeholder="A compelling description of this territory..." className="min-h-[160px] p-8 rounded-[32px] border-slate-50 bg-slate-50/50 font-medium text-lg leading-relaxed shadow-sm focus:ring-[#009688]/20 transition-all scrollbar-hide" {...register('description')} />
                {errors.description && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-2">{errors.description.message}</p>}
              </div>
            </div>

            <DialogFooter className="p-12 bg-white border-t-2 border-slate-50 shrink-0 flex justify-between gap-6">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsFormOpen(false)} 
                className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-400 hover:bg-slate-50"
              >
                Abort
              </Button>
              <Button 
                type="submit" 
                className="h-16 px-14 rounded-2xl bg-[#009688] hover:bg-[#00796b] text-white font-black uppercase tracking-[0.25em] text-[11px] min-w-[280px] shadow-2xl shadow-[#009688]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {editingDestination ? 'Save Changes' : 'Save Destination'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
