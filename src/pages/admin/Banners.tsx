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
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 uppercase font-display leading-none">Visual Infrastructure</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] pl-1 font-display opacity-60">High-fidelity hero asset configuration</p>
        </div>
        <Button 
          onClick={() => setIsAddOpen(true)} 
          className="rounded-[20px] h-14 px-10 gap-3 bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 font-black uppercase tracking-[0.2em] text-[11px] font-display"
        >
          <Plus className="w-5 h-5" strokeWidth={3} /> Synchronize Visuals
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {banners.map((banner) => (
          <div key={banner.id} className="relative group bg-white rounded-[48px] border-2 border-slate-50 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden hover:shadow-[0_24px_60px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-700">
            <div className="aspect-[21/9] relative overflow-hidden bg-slate-50">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="absolute top-6 right-6 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={() => onDelete(banner.id)} 
                  className="h-12 w-12 rounded-[20px] bg-white shadow-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all border-none"
                >
                   <Trash2 className="w-5 h-5" strokeWidth={2.5} />
                </Button>
              </div>
            </div>
            <div className="p-10">
              <div className="flex justify-between items-center gap-6">
                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight truncate font-display">
                    {banner.title || "Experimental Layer"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] font-display">ACTIVE_CORE</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-50 text-slate-200 group-hover:text-primary group-hover:bg-primary/5 group-hover:border-primary/10 transition-all duration-500">
                  <ImageIcon className="w-6 h-6" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="col-span-full py-24 border-2 border-dashed border-slate-100 rounded-[40.0px] flex flex-col items-center justify-center bg-slate-50/50 group hover:border-primary/20 hover:bg-primary/[0.02] transition-colors">
             <div className="bg-white p-5 rounded-[24px] shadow-sm mb-4">
               <ImageIcon className="w-10 h-10 text-slate-200" strokeWidth={1.5} />
             </div>
             <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No visual markers found</p>
             <Button variant="link" className="mt-2 text-primary font-bold uppercase tracking-widest text-[10px]" onClick={() => setIsAddOpen(true)}>Initialize your first asset</Button>
          </div>
        )}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[95vh] flex flex-col p-0 overflow-hidden bg-[#fcfdfe] border-none shadow-2xl rounded-[40px]">
          <DialogHeader className="p-10 pb-6 shrink-0 bg-white">
            <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900 uppercase">Banner Registry</DialogTitle>
            <DialogDescription className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
               Optimal performance requires 21:9 aspect ratios
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-10 pt-4 scrollbar-hide space-y-8">
            <div className="space-y-3">
              <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Identifiable Label</Label>
              <Input 
                id="title" 
                placeholder="e.g. Summer Specials 2024" 
                value={newBanner.title} 
                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                className="h-14 px-6 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-base shadow-sm"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Raw Visual Data</Label>
              <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm transition-all hover:border-primary/20">
                <ImageUpload
                  value={newBanner.image}
                  onChange={(url) => setNewBanner({ ...newBanner, image: url })}
                  label="Upload Hero Image"
                  folder="banners"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-10 bg-white border-t border-slate-50 shrink-0 flex justify-between gap-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsAddOpen(false)} 
              className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-400"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAdd} 
              disabled={!newBanner.image} 
              className="h-14 px-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-[11px] min-w-[240px] shadow-xl shadow-primary/20 transition-all opacity-100 disabled:opacity-50"
            >
              Sync With Cloud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
