import { useState } from 'react';
import { Banner } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, ImageIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';

interface BannersPageProps {
  banners: Banner[];
  onAdd: (banner: Omit<Banner, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

export function BannersPage({ banners, onAdd, onDelete }: BannersPageProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({ title: '', image: '' });

  const handleAdd = () => {
    if (newBanner.image) {
      onAdd(newBanner);
      setNewBanner({ title: '', image: '' });
      setIsAddOpen(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-display font-black tracking-tight text-slate-900">Portal Banners</h2>
          <p className="text-slate-500 font-medium">Manage images displayed in the main homepage carousel.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-12 shadow-lg shadow-primary/20 font-bold transition-all hover:scale-105 active:scale-95">
          <Plus className="w-5 h-5 mr-1" /> Add New Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {banners.map((banner) => (
          <div key={banner.id} className="border border-slate-200/60 bg-white rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-card group">
            <div className="aspect-[21/9] relative overflow-hidden bg-slate-100">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => onDelete(banner.id)} 
                  className="h-10 w-10 p-0 rounded-2xl bg-white/90 hover:bg-white text-rose-600 shadow-xl hover:scale-110 transition-all"
                >
                   <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-6 border-t border-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-slate-900 truncate pr-4">
                {banner.title || "Untitled Carousel Slide"}
              </h3>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none shadow-none uppercase text-[10px] tracking-widest px-3 py-1 font-bold">Active</Badge>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50">
             <div className="p-5 bg-white shadow-sm inline-block rounded-3xl mb-4">
               <ImageIcon className="w-10 h-10 text-slate-300" />
             </div>
             <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No banners uploaded yet</p>
             <Button onClick={() => setIsAddOpen(true)} variant="link" className="text-primary mt-2">Upload your first slide</Button>
          </div>
        )}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white border-slate-200">
          <DialogHeader className="p-6 pb-2 shrink-0 border-b border-slate-100">
            <DialogTitle className="text-xl font-bold text-slate-800">Add Homepage Banner</DialogTitle>
            <DialogDescription className="text-slate-500">
              Provide an image for the banner. Banners are best in 21:9 aspect ratio.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 pt-2 scrollbar-hide space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700">Banner Title (Optional)</Label>
              <Input 
                id="title" 
                placeholder="e.g. Summer Specials 2024" 
                value={newBanner.title} 
                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <ImageUpload
                value={newBanner.image}
                onChange={(url) => setNewBanner({ ...newBanner, image: url })}
                label="Banner Image"
                folder="banners"
              />
            </div>
          </div>
          <DialogFooter className="p-4 px-6 border-t border-slate-100 bg-slate-50 shrink-0">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="border-slate-300">Cancel</Button>
            <Button onClick={handleAdd} disabled={!newBanner.image} className="bg-primary hover:bg-primary/90 text-white">Upload Banner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
