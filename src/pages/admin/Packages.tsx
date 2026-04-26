import * as React from 'react';
import { useState } from 'react';
import { Package, Destination } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  description: z.string().min(20, "Description must be at least 20 characters"),
  image: z.string().url("Please enter a valid image URL"),
  bannerImage: z.string().url("Please enter a valid banner image URL").optional().or(z.literal('')),
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

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-display font-black tracking-tight text-slate-900">Tour Packages</h2>
          <p className="text-slate-500 font-medium">Manage and organize your holiday offerings.</p>
        </div>
        <Button onClick={() => { setEditingPackage(null); reset(); setIsFormOpen(true); }} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-12 shadow-lg shadow-primary/20 font-bold transition-all hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5 mr-1" /> Add New Package
        </Button>
      </div>
      
      <div className="border border-slate-200/60 bg-white p-2 rounded-2xl flex items-center gap-3 shadow-sm hover-card">
        <div className="p-3 bg-slate-50 rounded-xl">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <Input 
          placeholder="Search packages by name or description..." 
          className="border-0 focus-visible:ring-0 text-base font-medium placeholder:text-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border border-slate-200/60 rounded-[2rem] overflow-hidden bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold tracking-[0.2em] border-b border-slate-100">
            <tr>
              <th className="px-6 py-5">Visual</th>
              <th className="px-6 py-5">Package Identity</th>
              <th className="px-6 py-5">Value</th>
              <th className="px-6 py-5">Duration</th>
              <th className="px-6 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredPackages.length > 0 ? filteredPackages.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-6 py-5">
                  <div className="relative w-16 h-12 overflow-hidden rounded-xl bg-slate-100">
                    <img src={pkg.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="font-bold text-slate-900 group-hover:text-primary transition-colors">{pkg.name}</div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{pkg.location}</div>
                </td>
                <td className="px-6 py-5">
                  <span className="font-bold text-slate-900">₹{pkg.price}</span>
                </td>
                <td className="px-6 py-5">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none group-hover:bg-primary/10 group-hover:text-primary transition-colors">{pkg.days} Days</Badge>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-3">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleEditClick(pkg)} 
                      className="h-10 w-10 p-0 rounded-xl bg-slate-50 text-amber-600 hover:bg-amber-100 transition-all hover:scale-110 shadow-sm"
                    >
                       <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setDeleteConfirmId(pkg.id)} 
                      className="h-10 w-10 p-0 rounded-xl bg-slate-50 text-rose-600 hover:bg-rose-100 transition-all hover:scale-110 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="text-center py-20">
                   <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-50 rounded-full">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No packages found</p>
                   </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[900px] w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white border-slate-200">
          <DialogHeader className="p-6 pb-2 shrink-0 border-b border-slate-100">
            <DialogTitle className="text-xl font-bold text-slate-800">{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            <DialogDescription className="text-slate-500">
              Fill in the details for the tour package.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col overflow-hidden">
            <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 shrink-0 border-b border-slate-100 bg-slate-50">
                <TabsList className="w-full justify-start bg-transparent h-auto p-0 gap-6">
                  <TabsTrigger value="basic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 text-slate-600 data-[state=active]:text-slate-900 shadow-none font-bold text-xs uppercase tracking-widest transition-all">Basic Info</TabsTrigger>
                  <TabsTrigger value="media" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 text-slate-600 data-[state=active]:text-slate-900 shadow-none font-bold text-xs uppercase tracking-widest transition-all">Media</TabsTrigger>
                  <TabsTrigger value="itinerary" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 text-slate-600 data-[state=active]:text-slate-900 shadow-none font-bold text-xs uppercase tracking-widest transition-all">Itinerary</TabsTrigger>
                  <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 text-slate-600 data-[state=active]:text-slate-900 shadow-none font-bold text-xs uppercase tracking-widest transition-all">Details</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <TabsContent value="basic" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">Package Name</Label>
                    <Input id="name" placeholder="e.g. Exotic Bali Adventure" {...register('name')} className="border-slate-200" />
                    {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-slate-700">Price ($)</Label>
                      <Input id="price" type="number" {...register('price')} className="border-slate-200" />
                      {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="days" className="text-slate-700">Duration (Days)</Label>
                      <Input id="days" type="number" {...register('days')} className="border-slate-200" />
                      {errors.days && <p className="text-xs text-red-500">{errors.days.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-700">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input id="location" className="pl-9 border-slate-200" placeholder="e.g. Bali, Indonesia" {...register('location')} />
                    </div>
                    {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="groupSize" className="text-slate-700">Group Size</Label>
                      <Input id="groupSize" placeholder="e.g. 10+ People" {...register('groupSize')} className="border-slate-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="languages" className="text-slate-700">Languages</Label>
                      <Input id="languages" placeholder="e.g. English, Hindi" {...register('languages')} className="border-slate-200" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700">Short Description</Label>
                    <Textarea id="description" placeholder="Describe the overview of the tour..." className="min-h-[100px] border-slate-200" {...register('description')} />
                    {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2 text-slate-700">
                       <MapIcon className="w-4 h-4 text-primary" /> Multi-Select Destinations
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border rounded-lg bg-slate-50 border-slate-200">
                      {destinations.map((dest) => (
                        <div key={dest.id} className="flex items-center space-x-2">
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
                              />
                            )}
                          />
                          <Label htmlFor={`dest-${dest.id}`} className="text-sm font-normal cursor-pointer truncate text-slate-600">
                            {dest.name}
                          </Label>
                        </div>
                      ))}
                      {destinations.length === 0 && (
                        <p className="col-span-full text-xs text-slate-400 italic">
                           No destinations created yet.
                        </p>
                      )}
                    </div>
                    {errors.destination_ids && <p className="text-xs text-red-500">{errors.destination_ids.message}</p>}
                  </div>
                </TabsContent>

                <TabsContent value="media" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Controller
                      control={control}
                      name="image"
                      render={({ field }) => (
                        <ImageUpload
                          value={field.value}
                          onChange={field.onChange}
                          label="Card Image"
                          folder="packages"
                        />
                      )}
                    />
                    {errors.image && <p className="text-xs text-red-500">{errors.image.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Controller
                      control={control}
                      name="bannerImage"
                      render={({ field }) => (
                        <ImageUpload
                          value={field.value || ''}
                          onChange={field.onChange}
                          label="Header Banner Image"
                          folder="packages/banners"
                        />
                      )}
                    />
                    {errors.bannerImage && <p className="text-xs text-red-500">{errors.bannerImage.message}</p>}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold text-slate-800">Gallery Images</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const current = watch('gallery') || '';
                          const list = current ? current.split(',').map(s => s.trim()).filter(Boolean) : [];
                          setValue('gallery', [...list, ''].join(', '));
                        }}
                        className="border-slate-300"
                      >
                        Add Image Slot
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(watch('gallery') || '').split(',').map((url, index) => {
                        const trimmedUrl = url.trim();
                        const allUrls = (watch('gallery') || '').split(',').map(s => s.trim());

                        return (
                          <div key={index} className="relative group border border-slate-200 rounded-lg p-3 bg-slate-50">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-medium text-slate-500">Image {index + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-slate-400 hover:text-red-500"
                                onClick={() => {
                                  const newList = [...allUrls];
                                  newList.splice(index, 1);
                                  setValue('gallery', newList.join(', '));
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                            <ImageUpload
                              value={trimmedUrl}
                              onChange={(newUrl) => {
                                const newList = [...allUrls];
                                newList[index] = newUrl;
                                setValue('gallery', newList.join(', '));
                              }}
                              folder={`packages/gallery/${index}`}
                            />
                          </div>
                        );
                      })}

                      {!(watch('gallery') || '') && (
                        <div className="col-span-full py-8 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-400">
                          <p className="text-sm">No gallery images added yet.</p>
                          <Button 
                            type="button" 
                            variant="link" 
                            onClick={() => setValue('gallery', '')}
                            className="mt-2 text-primary"
                          >
                            Add your first image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="mt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-800 font-semibold">Tour Itinerary</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ day: fields.length + 1, title: '', description: '' })} className="gap-2 border-slate-300">
                      <PlusCircle className="w-4 h-4" /> Add Day
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative space-y-3">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 h-7 w-7 text-slate-400 hover:text-red-500"
                          onClick={() => remove(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                        <div className="grid grid-cols-6 gap-3">
                          <div className="col-span-1">
                            <Label className="text-[10px] uppercase text-slate-500">Day</Label>
                            <Input type="number" {...register(`itinerary.${index}.day` as const)} className="border-slate-200" />
                          </div>
                          <div className="col-span-5">
                            <Label className="text-[10px] uppercase text-slate-500">Title</Label>
                            <Input placeholder="Day Title..." {...register(`itinerary.${index}.title` as const)} className="border-slate-200" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-[10px] uppercase text-slate-500">Activities</Label>
                          <Textarea placeholder="What will happen on this day?" {...register(`itinerary.${index}.description` as const)} className="border-slate-200 min-h-[80px]" />
                        </div>
                      </div>
                    ))}
                    {fields.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                        <ListPlus className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm text-slate-500">No itinerary items yet.</p>
                        <Button type="button" variant="link" onClick={() => append({ day: 1, title: '', description: '' })} className="text-primary">Add Day 1</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-0 space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="inclusions" className="flex items-center gap-2 text-slate-800 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Inclusions (One per line)
                    </Label>
                    <Textarea id="inclusions" placeholder="Hotel accommodation&#10;Daily breakfast..." className="min-h-[120px] border-slate-200" {...register('inclusions')} />
                  </div>
                  
                  <Separator className="bg-slate-100" />

                  <div className="space-y-3">
                    <Label htmlFor="exclusions" className="flex items-center gap-2 text-slate-800 font-semibold">
                      <XCircle className="w-4 h-4 text-rose-600" /> Exclusions (One per line)
                    </Label>
                    <Textarea id="exclusions" placeholder="Flight tickets&#10;Personal expenses..." className="min-h-[120px] border-slate-200" {...register('exclusions')} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="p-4 px-6 bg-slate-50 border-t shrink-0">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="border-slate-300">Cancel</Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-white min-w-[150px]">{editingPackage ? 'Update Package' : 'Create Package'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-md bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Are you absolutely sure?</DialogTitle>
            <DialogDescription className="text-slate-500">
              This action cannot be undone. This will permanently delete the package and remove it from your website.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} className="border-slate-300">Cancel</Button>
            <Button variant="destructive" onClick={() => { if (deleteConfirmId) onDelete(deleteConfirmId); setDeleteConfirmId(null); }} className="bg-red-600 hover:bg-red-700">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
