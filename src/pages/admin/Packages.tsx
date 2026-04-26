import * as React from 'react';
import { useState } from 'react';
import { Package, Destination } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Search, MoreHorizontal, Edit, Trash2, 
  Image as ImageIcon, ListPlus, MapPin, 
  CheckCircle2, XCircle, PlusCircle, Trash, X,
  Map as MapIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/ImageUpload';

const itinerarySchema = z.object({
  day: z.preprocess((val) => Number(val), z.number().int().min(1)),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

const packageSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  price: z.preprocess((val) => Number(val), z.number().min(0, "Price must be positive")),
  days: z.preprocess((val) => Number(val), z.number().int().min(1, "Duration must be at least 1 day")),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  image: z.string().min(1, "Image is required"),
  bannerImage: z.string().optional().or(z.literal('')),
  gallery: z.string().optional(), // We'll handle CSV splitting in onSubmit
  inclusions: z.string().optional(),
  exclusions: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  destination_ids: z.array(z.string()).min(1, "At least one destination is required"),
  groupSize: z.string().optional(),
  languages: z.string().optional(),
  itinerary: z.array(itinerarySchema).optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface PackagesPageProps {
  packages: Package[];
  destinations: Destination[];
  onAdd: (pkg: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEdit: (id: string, pkg: Partial<Package>) => void;
  onDelete: (id: string) => void;
}

export function PackagesPage({ packages, destinations, onAdd, onEdit, onDelete }: PackagesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { register, handleSubmit, reset, setValue, formState: { errors }, watch, control } = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema) as any,
    defaultValues: {
      name: '',
      price: 0,
      days: 1,
      category: '',
      description: '',
      image: '',
      bannerImage: '',
      gallery: '',
      inclusions: '',
      exclusions: '',
      location: '',
      destination_ids: [],
      groupSize: '',
      languages: '',
      itinerary: [],
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "itinerary"
  });

  const onSubmit = (values: any) => {
    const formattedData = {
      ...values,
      price: Number(values.price),
      days: Number(values.days),
      itinerary: values.itinerary?.map((item: any) => ({
        ...item,
        day: Number(item.day)
      })) || [],
      gallery: values.gallery ? values.gallery.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      inclusions: values.inclusions ? values.inclusions.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
      exclusions: values.exclusions ? values.exclusions.split('\n').map((s: string) => s.trim()).filter(Boolean) : [],
    };

    if (editingPackage) {
      onEdit(editingPackage.id, formattedData);
    } else {
      onAdd(formattedData as any);
    }
    setIsFormOpen(false);
    setEditingPackage(null);
    reset();
  };

  const handleEditClick = (pkg: Package) => {
    setEditingPackage(pkg);
    reset({
      name: pkg.name,
      price: pkg.price,
      days: pkg.days,
      category: pkg.category || '',
      description: pkg.description,
      image: pkg.image,
      bannerImage: pkg.bannerImage || '',
      gallery: pkg.gallery ? pkg.gallery.join(', ') : '',
      inclusions: pkg.inclusions ? pkg.inclusions.join('\n') : '',
      exclusions: pkg.exclusions ? pkg.exclusions.join('\n') : '',
      location: pkg.location || '',
      destination_ids: pkg.destination_ids || [],
      groupSize: pkg.groupSize || '',
      languages: pkg.languages || '',
      itinerary: pkg.itinerary || [],
    });
    setIsFormOpen(true);
  };

  const imageUrl = watch('image');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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
          <h2 className="text-5xl font-black tracking-tighter text-slate-800 uppercase font-display leading-none italic">Tour Packages</h2>
          <p className="text-[#009688] mt-2 font-black uppercase tracking-[0.4em] text-[10px] pl-0.5 opacity-100">Managing travel packages and guest experiences</p>
        </div>
        <Button 
          onClick={() => { setEditingPackage(null); reset(); setIsFormOpen(true); }} 
          className="rounded-2xl h-16 px-10 gap-3 bg-[#009688] hover:bg-[#00796b] text-white shadow-2xl shadow-[#009688]/20 transition-all hover:scale-[1.02] active:scale-95 font-black uppercase tracking-[0.25em] text-[11px]"
        >
          <Plus className="w-5 h-5" strokeWidth={3} /> Add New Package
        </Button>
      </motion.div>
      
      <motion.div variants={item} className="flex items-center gap-5 bg-white p-4 rounded-[32px] border-2 border-slate-50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] focus-within:ring-4 focus-within:ring-[#009688]/5 transition-all group overflow-hidden">
        <div className="pl-6 text-slate-300 group-focus-within:text-[#009688] transition-colors">
          <Search className="w-6 h-6" strokeWidth={3} />
        </div>
        <Input 
          placeholder="Search packages by name, location or details..." 
          className="border-0 focus-visible:ring-0 text-lg py-7 h-16 bg-transparent placeholder:text-slate-300 font-bold tracking-tight shadow-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      <motion.div variants={item} className="space-y-4">
        {/* Header Row */}
        <div className="flex items-center px-10 py-4 hidden lg:flex">
          <div className="w-[120px] text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-display italic">Package Image</div>
          <div className="flex-1 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-display italic">Details</div>
          <div className="w-[200px] text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-display italic">Destinations</div>
          <div className="w-[200px] text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-display italic text-right pr-20">Price & Duration</div>
          <div className="w-[100px] text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-display italic text-right">Actions</div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredPackages.length > 0 ? filteredPackages.map((pkg, idx) => (
              <motion.div 
                key={pkg.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative bg-white hover:bg-[#009688]/[0.02] rounded-[32px] p-6 border border-slate-100 hover:border-[#009688]/30 hover:border-l-[12px] hover:border-l-[#009688] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row lg:items-center gap-8"
              >
                <div className="w-[120px] shrink-0">
                  <div className="relative w-24 h-24 rounded-[30px] overflow-hidden shadow-xl shadow-slate-200 group-hover:rounded-2xl transition-all duration-700 ring-4 ring-white group-hover:ring-[#009688]/10">
                    <img src={pkg.image} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" alt="" />
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  <div className="font-black text-slate-800 text-2xl tracking-tighter group-hover:text-[#009688] transition-colors leading-none italic uppercase font-display">{pkg.name}</div>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 px-2.5 bg-[#e0f2f1] rounded-lg">
                      <MapPin className="w-3 h-3 text-[#009688]" strokeWidth={3} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{pkg.location}</span>
                  </div>
                </div>

                <div className="w-[200px] flex flex-wrap gap-2">
                  {pkg.destination_ids?.map(id => {
                    const dest = destinations.find(d => d.id === id);
                    return dest ? (
                      <Badge key={`dest-${id}`} variant="outline" className="bg-white/80 text-[#009688] text-[8px] font-black uppercase tracking-widest py-1 px-3 rounded-lg border-[#009688]/10 shadow-sm">
                        {dest.name}
                      </Badge>
                    ) : null;
                  })}
                </div>

                <div className="w-[200px] lg:text-right pr-0 lg:pr-20 space-y-1.5">
                  <div className="font-black text-slate-900 text-3xl tracking-tighter leading-none italic font-display">₹{pkg.price}</div>
                  <div className="text-[10px] font-black text-[#009688] uppercase tracking-[0.3em] opacity-60">DURATION: {pkg.days}D</div>
                </div>

                <div className="w-full lg:w-[100px] flex justify-end items-center gap-3">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(pkg)} className="h-12 w-12 rounded-2xl bg-white shadow-lg shadow-slate-200/50 hover:bg-[#009688] hover:text-white transition-all border border-slate-50">
                     <Edit className="w-5 h-5" strokeWidth={3} />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteConfirmId(pkg.id)} className="h-12 w-12 rounded-2xl bg-white shadow-lg shadow-slate-200/50 hover:bg-rose-500 hover:text-white transition-all border border-slate-50">
                    <Trash2 className="w-5 h-5" strokeWidth={3} />
                  </Button>
                </div>
              </motion.div>
            )) : (
              <div className="bg-white rounded-[40px] py-32 text-center border-2 border-dashed border-slate-100 flex flex-col items-center gap-4">
                <Search className="w-12 h-12 text-slate-200" strokeWidth={1.5} />
                <p className="font-black uppercase tracking-widest text-xs text-slate-300">No matching packages found</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[950px] w-[98vw] max-h-[95vh] flex flex-col p-0 overflow-hidden bg-[#fcfdfe] border-none shadow-2xl rounded-[40px]">
          <DialogHeader className="p-8 pb-4 shrink-0 bg-white">
            <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 uppercase">
              {editingPackage ? 'Edit Experience' : 'New Package Entry'}
            </DialogTitle>
            <DialogDescription className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
              Crafting unforgettable memories for your clients
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden">
              <div className="px-8 border-b border-slate-100 bg-white shrink-0">
                <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-8">
                  <TabsTrigger value="basic" className="rounded-none border-b-4 border-transparent data-[state=active]:border-[#009688] data-[state=active]:bg-transparent px-0 py-4 text-slate-400 data-[state=active]:text-[#009688] shadow-none text-xs font-black uppercase tracking-widest transition-all">
                    01. Basic Info
                  </TabsTrigger>
                  <TabsTrigger value="media" className="rounded-none border-b-4 border-transparent data-[state=active]:border-[#009688] data-[state=active]:bg-transparent px-0 py-4 text-slate-400 data-[state=active]:text-[#009688] shadow-none text-xs font-black uppercase tracking-widest transition-all">
                    02. Photos
                  </TabsTrigger>
                  <TabsTrigger value="itinerary" className="rounded-none border-b-4 border-transparent data-[state=active]:border-[#009688] data-[state=active]:bg-transparent px-0 py-4 text-slate-400 data-[state=active]:text-[#009688] shadow-none text-xs font-black uppercase tracking-widest transition-all">
                    03. Itinerary
                  </TabsTrigger>
                  <TabsTrigger value="details" className="rounded-none border-b-4 border-transparent data-[state=active]:border-[#009688] data-[state=active]:bg-transparent px-0 py-4 text-slate-400 data-[state=active]:text-[#009688] shadow-none text-xs font-black uppercase tracking-widest transition-all">
                    04. Inclusions
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-8 pt-6 space-y-8 scrollbar-hide">
                <TabsContent value="basic" className="space-y-6 mt-0">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Package Title</Label>
                        <Input id="name" placeholder="e.g. Exotic Bali Adventure" {...register('name')} className="h-14 px-5 rounded-2xl border-slate-100 bg-slate-50/50 shadow-sm focus:ring-primary/20 text-base font-bold placeholder:font-medium placeholder:text-slate-300" />
                        {errors.name && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1">{errors.name.message}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Display Price (₹)</Label>
                          <Input id="price" type="number" {...register('price')} className="h-14 px-5 rounded-2xl border-slate-100 bg-slate-50/50 shadow-sm text-base font-bold" />
                          {errors.price && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1">{errors.price.message}</p>}
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="days" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Duration (Days)</Label>
                          <Input id="days" type="number" {...register('days')} className="h-14 px-5 rounded-2xl border-slate-100 bg-slate-50/50 shadow-sm text-base font-bold" />
                          {errors.days && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1">{errors.days.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="category" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Classification</Label>
                        <Controller
                          control={control}
                          name="category"
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="category" className="h-14 px-5 rounded-2xl border-slate-100 bg-slate-50/50 shadow-sm text-base font-bold">
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="HERITAGE">HERITAGE</SelectItem>
                                <SelectItem value="HILL STATION">HILL STATION</SelectItem>
                                <SelectItem value="SPIRITUAL">SPIRITUAL</SelectItem>
                                <SelectItem value="BEACH & LEISURE">BEACH & LEISURE</SelectItem>
                                <SelectItem value="WILDLIFE & DESERT">WILDLIFE & DESERT</SelectItem>
                                <SelectItem value="ADVENTURE">ADVENTURE</SelectItem>
                                <SelectItem value="HOLIDAY">HOLIDAY</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.category && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1">{errors.category.message}</p>}
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="location" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Primary Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-5 top-5 w-4 h-4 text-slate-300" />
                          <Input id="location" className="h-14 pl-12 pr-5 rounded-2xl border-slate-100 bg-slate-50/50 shadow-sm text-base font-bold" placeholder="e.g. Bali, Indonesia" {...register('location')} />
                        </div>
                        {errors.location && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1">{errors.location.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tagline & Summary</Label>
                        <Textarea id="description" placeholder="Craft a compelling summary..." className="min-h-[168px] p-5 rounded-2xl border-slate-100 bg-slate-50/50 shadow-sm text-base font-medium leading-relaxed placeholder:text-slate-300" {...register('description')} />
                        {errors.description && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1">{errors.description.message}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="groupSize" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Group Capacity</Label>
                          <Input id="groupSize" placeholder="e.g. Up to 12" {...register('groupSize')} className="h-14 px-5 rounded-2xl border-slate-100 bg-slate-50/50 shadow-sm text-base font-bold" />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="languages" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Supported Languages</Label>
                          <Input id="languages" placeholder="e.g. EN, FR" {...register('languages')} className="h-14 px-5 rounded-2xl border-slate-100 bg-slate-50/50 shadow-sm text-base font-bold" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <Label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-800">
                       <MapIcon className="w-5 h-5 text-[#009688]" /> Multi-Select Destinations
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-6 border rounded-[32px] bg-slate-50/50 border-slate-100 shadow-inner">
                      {destinations.map((dest) => (
                        <div key={dest.id} className="flex items-center space-x-3 p-1">
                          <Controller
                            control={control}
                            name="destination_ids"
                            render={({ field }) => (
                              <Checkbox 
                                id={`dest-${dest.id}`}
                                checked={field.value?.includes(dest.id)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, dest.id]);
                                  } else {
                                    field.onChange(current.filter(id => id !== dest.id));
                                  }
                                }}
                                className="w-5 h-5 rounded-md border-slate-200 data-[state=checked]:bg-[#009688]"
                              />
                            )}
                          />
                          <Label htmlFor={`dest-${dest.id}`} className="text-xs font-bold uppercase tracking-tight cursor-pointer truncate text-slate-600 transition-colors hover:text-slate-900">
                            {dest.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.destination_ids && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1">{errors.destination_ids.message}</p>}
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-8 mt-0">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Primary Thumbnail</Label>
                      <Controller
                        control={control}
                        name="image"
                        render={({ field }) => (
                          <div className="h-48 w-full bg-white rounded-[32px] p-2 border border-slate-100 shadow-sm relative group overflow-hidden">
                            <ImageUpload
                              value={field.value}
                              onChange={field.onChange}
                              folder="packages"
                              compact={true}
                            />
                          </div>
                        )}
                      />
                      {errors.image && <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide px-1 pt-2">{errors.image.message}</p>}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Header Background</Label>
                      <Controller
                        control={control}
                        name="bannerImage"
                        render={({ field }) => (
                          <div className="h-48 w-full bg-white rounded-[32px] p-2 border border-slate-100 shadow-sm relative group overflow-hidden">
                            <ImageUpload
                              value={field.value || ''}
                              onChange={field.onChange}
                              folder="packages/banners"
                              compact={true}
                            />
                          </div>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-6 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-xl font-black tracking-tight text-slate-900 uppercase">Gallery Slots</Label>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Add up to 12 supplementary images</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        disabled={(watch('gallery') || '').split(',').length >= 12}
                        onClick={() => {
                          const current = watch('gallery') || '';
                          const list = current ? current.split(',').map(s => s.trim()) : [];
                          if (list.length < 12) {
                            setValue('gallery', [...list, ''].join(', '));
                          }
                        }}
                        className="rounded-xl h-10 px-5 gap-2 border-slate-200 font-bold text-xs uppercase tracking-widest hover:bg-[#009688] hover:text-white hover:border-[#009688] transition-all"
                      >
                        <Plus className="w-4 h-4" strokeWidth={3} /> Add Slot
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {(watch('gallery') || '').split(',').map((url, index) => {
                        const trimmedUrl = url.trim();
                        const allUrls = (watch('gallery') || '').split(',').map(s => s.trim());

                        return (
                          <div key={index} className="aspect-square relative group">
                            <ImageUpload
                              value={trimmedUrl}
                              onChange={(newUrl) => {
                                const newList = [...allUrls];
                                newList[index] = newUrl;
                                setValue('gallery', newList.join(', '));
                              }}
                              folder={`packages/gallery/${index}`}
                              compact={true}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-rose-500 text-white shadow-lg hover:bg-rose-600 transition-all opacity-0 group-hover:opacity-100 z-20"
                              onClick={() => {
                                const newList = [...allUrls];
                                newList.splice(index, 1);
                                setValue('gallery', newList.join(', '));
                              }}
                            >
                              <X className="w-3 h-3" strokeWidth={4} />
                            </Button>
                          </div>
                        );
                      })}
                      
                      {(!(watch('gallery') || '')) && (
                         <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/50 flex flex-col items-center gap-3">
                            <ImageIcon className="w-8 h-8 text-slate-200" strokeWidth={1.5} />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No gallery slots yet</p>
                            <Button 
                              type="button" 
                              variant="link" 
                              onClick={() => setValue('gallery', '')}
                              className="text-[#009688] font-bold text-xs uppercase tracking-widest h-auto p-0"
                            >
                              Add your first slot
                            </Button>
                         </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="mt-0 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-xl font-black tracking-tight text-slate-900 uppercase">Day-by-Day Journey</Label>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Map out the full experience</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ day: fields.length + 1, title: '', description: '' })} className="rounded-xl h-10 px-5 gap-2 border-slate-200 font-bold text-xs uppercase tracking-widest">
                      <PlusCircle className="w-4 h-4" /> Next Day
                    </Button>
                  </div>
                  
                  <div className="grid gap-6">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm relative group hover:shadow-md transition-all">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-6 right-6 h-10 w-10 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100"
                          onClick={() => remove(index)}
                        >
                          <Trash className="w-4 h-4" strokeWidth={2.5} />
                        </Button>
                        
                        <div className="flex gap-8">
                          <div className="flex flex-col items-center">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl mb-2">
                              {watch(`itinerary.${index}.day` as const) || index + 1}
                            </div>
                            <div className="w-0.5 flex-1 bg-slate-50 group-last:hidden" />
                          </div>
                          
                          <div className="flex-1 space-y-6">
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Primary Activity / Theme</Label>
                              <Input placeholder="Theme of the day..." {...register(`itinerary.${index}.title` as const)} className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-base shadow-sm" />
                            </div>
                            <div className="space-y-3">
                              <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">Detailed Itinerary Description</Label>
                              <Textarea placeholder="Morning exploration, afternoon relaxation, evening dining experience..." {...register(`itinerary.${index}.description` as const)} className="min-h-[120px] p-6 rounded-2xl border-slate-50 bg-slate-50/50 font-medium leading-relaxed shadow-sm" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {fields.length === 0 && (
                      <div className="py-24 text-center border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50 flex flex-col items-center gap-4">
                        <div className="bg-white p-5 rounded-[24px] shadow-sm">
                          <MapIcon className="w-10 h-10 text-slate-300" strokeWidth={1.5} />
                        </div>
                        <div className="space-y-1">
                          <p className="font-black text-slate-300 uppercase tracking-[0.2em] text-xs">Journey is currently empty</p>
                          <Button type="button" variant="link" onClick={() => append({ day: 1, title: '', description: '' })} className="text-primary font-bold text-sm uppercase tracking-widest">Start with Day 1</Button>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-0 space-y-12 pb-8">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-xl font-black tracking-tight text-slate-900 uppercase">Inclusions</Label>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">What's covered in the price</p>
                        </div>
                      </div>
                      <Textarea id="inclusions" placeholder="Hotel accommodation&#10;Daily breakfast&#10;Private transfers..." className="min-h-[300px] p-6 rounded-[32px] border-slate-100 bg-slate-50/50 shadow-inner font-medium leading-loose placeholder:text-slate-300" {...register('inclusions')} />
                      <p className="text-[9px] font-black text-slate-300 uppercase px-2 tracking-[0.2em]">TIP: Use one point per line for optimal display</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                          <XCircle className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-xl font-black tracking-tight text-slate-900 uppercase">Exclusions</Label>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items at guest's expense</p>
                        </div>
                      </div>
                      <Textarea id="exclusions" placeholder="International flights&#10;Travel insurance&#10;Personal tips..." className="min-h-[300px] p-6 rounded-[32px] border-slate-100 bg-slate-50/50 shadow-inner font-medium leading-loose placeholder:text-slate-300" {...register('exclusions')} />
                      <p className="text-[9px] font-black text-slate-300 uppercase px-2 tracking-[0.2em]">TIP: Clarity here builds long-term trust</p>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="p-8 bg-white border-t border-slate-50 shrink-0 flex justify-between gap-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setIsFormOpen(false)} 
                className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-400 hover:bg-slate-50"
              >
                Cancel & Exit
              </Button>
              <Button 
                type="submit" 
                className="h-14 px-12 rounded-2xl bg-[#009688] hover:bg-[#00796b] text-white font-black uppercase tracking-[0.2em] text-[11px] min-w-[240px] shadow-xl shadow-[#009688]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {editingPackage ? 'Update Package' : 'Save Package'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-md bg-white border-none rounded-[40px] p-0 overflow-hidden shadow-2xl">
          <div className="p-10 space-y-8">
            <div className="w-20 h-20 rounded-[32px] bg-rose-50 text-rose-500 flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
              <Trash2 className="w-10 h-10" strokeWidth={2.5} />
            </div>
            <div className="text-center space-y-2">
              <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Warning</DialogTitle>
              <DialogDescription className="text-slate-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed">
                This package will be permanently erased. <br />
                This action is irreversible.
              </DialogDescription>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                variant="destructive" 
                onClick={() => { if (deleteConfirmId) onDelete(deleteConfirmId); setDeleteConfirmId(null); }} 
                className="h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-[0.2em] text-[11px]"
              >
                Confirm Deletion
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setDeleteConfirmId(null)} 
                className="h-14 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-400"
              >
                Nevermind, keep it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
