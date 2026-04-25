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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Homepage Banners</h2>
          <p className="text-muted-foreground">Manage the visual highlights of your landing page.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden border group shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-[21/9] relative overflow-hidden bg-muted">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="destructive" size="icon" onClick={() => onDelete(banner.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                {banner.title || "Untitled Banner"}
              </CardTitle>
              <CardDescription className="text-xs truncate">
                {banner.image}
              </CardDescription>
            </CardHeader>
          </Card>
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
        <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2 shrink-0">
            <DialogTitle>Add Homepage Banner</DialogTitle>
            <DialogDescription>
              Provide an image for the banner. Banners are best in 21:9 aspect ratio.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6 pt-2 scrollbar-hide space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Banner Title (Optional)</Label>
              <Input 
                id="title" 
                placeholder="e.g. Summer Specials 2024" 
                value={newBanner.title} 
                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
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
          <DialogFooter className="p-4 px-6 border-t bg-muted/30 shrink-0 capitalize">
            <Button variant="outline" onClick={() => setIsAddOpen(false)} className="mr-auto">Cancel</Button>
            <Button onClick={handleAdd} disabled={!newBanner.image}>Upload Banner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
