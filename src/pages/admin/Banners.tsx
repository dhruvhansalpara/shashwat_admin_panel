import { useState } from 'react';
import { Banner } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-20"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 uppercase font-display leading-none">Home Banners</h2>
          <p className="text-[#009688] mt-1.5 font-bold uppercase tracking-widest text-[9px] pl-0.5 opacity-80">Manage the large rotating images on your homepage</p>
        </div>
        <Button 
          onClick={() => setIsAddOpen(true)} 
          className="rounded-2xl h-12 px-8 gap-3 bg-[#009688] hover:bg-[#00796b] text-white shadow-2xl shadow-[#009688]/20 transition-all hover:scale-[1.02] active:scale-95 font-bold uppercase tracking-widest text-[10px]"
        >
          <Plus className="w-4 h-4" strokeWidth={3} /> Add New Banner
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <AnimatePresence mode="popLayout">
          {banners.map((banner) => (
            <motion.div 
              key={banner.id} 
              variants={item}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group bg-white rounded-[48px] border-2 border-slate-50 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden hover:shadow-[0_24px_60px_rgba(0,0,0,0.05)] hover:-translate-y-2 transition-all duration-700"
            >
              <div className="aspect-[21/9] relative overflow-hidden bg-slate-50 border-b-2 border-slate-50">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform group-hover:scale-125 duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="absolute top-6 right-6 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    onClick={() => { if(confirm("Delete this banner?")) onDelete(banner.id) }} 
                    className="h-12 w-12 rounded-2xl bg-white shadow-2xl text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-slate-50"
                  >
                     <Trash2 className="w-5 h-5" strokeWidth={3} />
                  </Button>
                </div>
              </div>
              <div className="p-10">
                <div className="flex justify-between items-center gap-6">
                  <div className="space-y-2 flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight truncate font-display group-hover:text-[#009688] transition-colors leading-none">
                      {banner.title || "Banner Title"}
                    </h3>
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-[#009688] animate-pulse shadow-[0_0_8px_rgba(0,150,136,1)]" />
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] font-display opacity-60">LIVE ON SITE</p>
                    </div>
                  </div>
                  <div className="bg-[#e0f2f1] p-5 rounded-[28px] text-[#009688] group-hover:bg-[#009688] group-hover:text-white transition-all shadow-inner relative overflow-hidden group/icon transition-all duration-500">
                    <ImageIcon className="w-7 h-7 relative z-10" strokeWidth={3} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {banners.length === 0 && (
          <motion.div 
            variants={item}
            className="col-span-full py-24 border-2 border-dashed border-slate-100 rounded-[40.0px] flex flex-col items-center justify-center bg-slate-50/50 group hover:border-primary/20 hover:bg-primary/[0.02] transition-colors"
          >
             <div className="bg-white p-5 rounded-[24px] shadow-sm mb-4">
               <ImageIcon className="w-10 h-10 text-slate-200" strokeWidth={1.5} />
             </div>
             <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No banners found</p>
             <Button variant="link" className="mt-2 text-primary font-bold uppercase tracking-widest text-[10px]" onClick={() => setIsAddOpen(true)}>Add your first banner</Button>
          </motion.div>
        )}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[650px] w-[95vw] max-h-[95vh] flex flex-col p-0 overflow-hidden bg-[#fcfdfe] border-none shadow-2xl rounded-[48px] font-display">
          <DialogHeader className="p-12 pb-8 shrink-0 bg-white border-b-2 border-slate-50">
            <DialogTitle className="text-4xl font-black tracking-tighter text-slate-800 uppercase italic leading-none">Add Homepage Banner</DialogTitle>
            <DialogDescription className="text-[#009688] font-black uppercase tracking-[0.4em] text-[10px] mt-2 pl-1">
               For best results, use wide images (landscape) for the homepage slider.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-12 pt-8 scrollbar-hide space-y-10">
            <div className="space-y-4">
              <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Banner Name</Label>
              <Input 
                id="title" 
                placeholder="e.g. Summer Specials 2024" 
                value={newBanner.title} 
                onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                className="h-16 px-8 rounded-2xl border-slate-50 bg-slate-50/50 font-bold text-lg shadow-sm"
              />
            </div>
            <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Banner Image</Label>
              <div className="bg-white rounded-[36px] p-8 border-2 border-slate-50 shadow-sm transition-all hover:border-[#009688]/20">
                <ImageUpload
                  value={newBanner.image}
                  onChange={(url) => setNewBanner({ ...newBanner, image: url })}
                  label="Upload Banner"
                  folder="banners"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-12 bg-white border-t-2 border-slate-50 shrink-0 flex justify-between gap-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsAddOpen(false)} 
              className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[11px] text-slate-400 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAdd} 
              disabled={!newBanner.image} 
              className="h-16 px-14 rounded-2xl bg-[#009688] hover:bg-[#00796b] text-white font-black uppercase tracking-[0.25em] text-[11px] min-w-[280px] shadow-2xl shadow-[#009688]/20 transition-all opacity-100 disabled:opacity-50"
            >
              Save Banner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
