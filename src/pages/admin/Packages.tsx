import * as React from 'react';
import { useState } from 'react';
import { Package } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, Search, MoreHorizontal, Edit, Trash2, 
  Image as ImageIcon, ListPlus, MapPin, 
  CheckCircle2, XCircle, PlusCircle, Trash, X
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
  groupSize: z.string().optional(),
  languages: z.string().optional(),
  itinerary: z.array(itinerarySchema).optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

interface PackagesPageProps {
  packages: Package[];
  onAdd: (pkg: Omit<Package, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEdit: (id: string, pkg: Partial<Package>) => void;
  onDelete: (id: string) => void;
}

export function PackagesPage({ packages, onAdd, onEdit, onDelete }: PackagesPageProps) {
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
      groupSize: pkg.groupSize || '',
      languages: pkg.languages || '',
      itinerary: pkg.itinerary || [],
    });
    setIsFormOpen(true);
  };

  const imageUrl = watch('image');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tour Packages</h2>
          <p className="text-muted-foreground">Manage your travel destinations and pricing.</p>
        </div>
        <Button onClick={() => { setEditingPackage(null); reset(); setIsFormOpen(true); }} className="gap-2">
          <Plus className="w-4 h-4" /> Add Package
        </Button>
      </div>

      <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search packages by name or description..." 
          className="max-w-md bg-transparent border-none focus-visible:ring-0 shadow-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-xl bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Package Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPackages.length > 0 ? filteredPackages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell>
                  <img src={pkg.image} className="w-12 h-12 rounded object-cover border" alt="" />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{pkg.name}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[250px]">{pkg.description}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">${pkg.price}</Badge>
                </TableCell>
                <TableCell>{pkg.days} Days</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditClick(pkg)} className="gap-2">
                        <Edit className="w-4 h-4" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteConfirmId(pkg.id)} className="gap-2 text-destructive">
                        <Trash2 className="w-4 h-4" /> Delete Package
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                  No packages found matching your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[800px] w-[95vw] h-[85vh] sm:h-[80vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
            <DialogDescription>
              Fill in the details for the tour package. Use tabs to navigate through different sections.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <Tabs defaultValue="basic" className="flex-1 flex flex-col min-h-0">
              <div className="px-6 shrink-0">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
              </div>

              <div className="flex-1 overflow-y-auto p-6 pt-4 min-h-0 scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40 pb-20">
                <TabsContent value="basic" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="name">Package Name</Label>
                    <Input id="name" placeholder="e.g. Exotic Bali Adventure" {...register('name')} />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input id="price" type="number" {...register('price')} />
                      {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="days">Duration (Days)</Label>
                      <Input id="days" type="number" {...register('days')} />
                      {errors.days && <p className="text-xs text-destructive">{errors.days.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input id="location" className="pl-9" placeholder="e.g. Bali, Indonesia" {...register('location')} />
                    </div>
                    {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="groupSize">Group Size</Label>
                      <Input id="groupSize" placeholder="e.g. 10+ People" {...register('groupSize')} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages</Label>
                      <Input id="languages" placeholder="e.g. English, Hindi" {...register('languages')} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea id="description" placeholder="Describe the overview of the tour..." className="min-h-[100px]" {...register('description')} />
                    {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
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
                    {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
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
                    {errors.bannerImage && <p className="text-xs text-destructive">{errors.bannerImage.message}</p>}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Gallery Images</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const current = watch('gallery') || '';
                          const list = current ? current.split(',').map(s => s.trim()).filter(Boolean) : [];
                          setValue('gallery', [...list, ''].join(', '));
                        }}
                      >
                        Add Image Slot
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(watch('gallery') || '').split(',').map((url, index) => {
                        const trimmedUrl = url.trim();
                        const allUrls = (watch('gallery') || '').split(',').map(s => s.trim());

                        return (
                          <div key={index} className="relative group border rounded-xl p-3 bg-muted/20">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-medium text-muted-foreground">Image {index + 1}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
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
                        <div className="col-span-full py-8 text-center border-2 border-dashed rounded-xl bg-muted/10 text-muted-foreground">
                          <p className="text-sm">No gallery images added yet.</p>
                          <Button 
                            type="button" 
                            variant="link" 
                            onClick={() => setValue('gallery', '')}
                            className="mt-2"
                          >
                            Add your first image
                          </Button>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">
                      Tip: You can upload local files or paste external image URLs for each slot.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="mt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Tour Itinerary</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ day: fields.length + 1, title: '', description: '' })} className="gap-2">
                      <PlusCircle className="w-4 h-4" /> Add Day
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="p-4 border rounded-lg bg-muted/20 relative space-y-3">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 h-7 w-7 text-destructive"
                          onClick={() => remove(index)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                        <div className="grid grid-cols-6 gap-3">
                          <div className="col-span-1">
                            <Label className="text-[10px] uppercase">Day</Label>
                            <Input type="number" {...register(`itinerary.${index}.day` as const)} />
                          </div>
                          <div className="col-span-5">
                            <Label className="text-[10px] uppercase">Title</Label>
                            <Input placeholder="Day Title..." {...register(`itinerary.${index}.title` as const)} />
                          </div>
                        </div>
                        <div>
                          <Label className="text-[10px] uppercase">Activities</Label>
                          <Textarea placeholder="What will happen on this day?" {...register(`itinerary.${index}.description` as const)} />
                        </div>
                      </div>
                    ))}
                    {fields.length === 0 && (
                      <div className="text-center py-10 border-2 border-dashed rounded-lg bg-muted/10">
                        <ListPlus className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                        <p className="text-sm text-muted-foreground">No itinerary items yet.</p>
                        <Button type="button" variant="link" onClick={() => append({ day: 1, title: '', description: '' })}>Add Day 1</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-0 space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="inclusions" className="flex items-center gap-2 text-emerald-600 font-bold">
                      <CheckCircle2 className="w-4 h-4" /> Inclusions (One per line)
                    </Label>
                    <Textarea id="inclusions" placeholder="Hotel accommodation&#10;Daily breakfast&#10;English speaking guide..." className="min-h-[120px]" {...register('inclusions')} />
                  </div>
                  
                  <Separator />

                  <div className="space-y-3">
                    <Label htmlFor="exclusions" className="flex items-center gap-2 text-rose-600 font-bold">
                      <XCircle className="w-4 h-4" /> Exclusions (One per line)
                    </Label>
                    <Textarea id="exclusions" placeholder="Flight tickets&#10;Personal expenses&#10;Entry visas..." className="min-h-[120px]" {...register('exclusions')} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="p-6 bg-muted/30 border-t">
              <Button type="submit" className="w-[200px]">{editingPackage ? 'Update Package' : 'Create Package'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the package and remove it from your website.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { if (deleteConfirmId) onDelete(deleteConfirmId); setDeleteConfirmId(null); }}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
