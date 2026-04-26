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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">Homepage Banners</h2>
        <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Add Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className="border border-slate-200 bg-white rounded-lg overflow-hidden flex flex-col">
            <div className="aspect-[21/9] relative overflow-hidden bg-slate-100">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button variant="destructive" size="sm" onClick={() => onDelete(banner.id)} className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-red-600">
                   <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 truncate">
                {banner.title || "Untitled Banner"}
              </h3>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="col-span-full py-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
             <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
             <p>No banners uploaded yet.</p>
             <Button variant="outline" className="mt-4" onClick={() => setIsAddOpen(true)}>Add your first banner</Button>
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
