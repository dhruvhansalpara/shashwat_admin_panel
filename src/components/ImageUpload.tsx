import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Link, Upload, Image as ImageIcon, FileUp, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  folder?: string;
  compact?: boolean;
}

export function ImageUpload({ value, onChange, label, compact = false }: ImageUploadProps) {
  const [url, setUrl] = useState(value);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const resp = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData,
      });
      if (!resp.ok) throw new Error('Upload failed');
      const data = await resp.json();
      onChange(data.url);
      setUrl(data.url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const [compactMode, setCompactMode] = useState<'local' | 'url'>('local');

  if (compact) {
    return (
      <div className="w-full h-full group/compact relative overflow-hidden rounded-[24px] border border-slate-100 hover:border-[#009688]/30 transition-all bg-slate-50/50">
        <div className="absolute top-2 right-2 z-20 flex gap-1">
           <Button
             type="button"
             variant="ghost"
             size="icon"
             className={cn(
               "h-7 w-7 rounded-lg transition-all",
               compactMode === 'local' ? "bg-[#009688] text-white" : "bg-white text-slate-300 hover:text-[#009688]"
             )}
             onClick={(e) => { e.stopPropagation(); setCompactMode('local'); }}
           >
             <FileUp className="w-3.5 h-3.5" />
           </Button>
           <Button
             type="button"
             variant="ghost"
             size="icon"
             className={cn(
               "h-7 w-7 rounded-lg transition-all",
               compactMode === 'url' ? "bg-[#009688] text-white" : "bg-white text-slate-300 hover:text-[#009688]"
             )}
             onClick={(e) => { e.stopPropagation(); setCompactMode('url'); }}
           >
             <Link className="w-3.5 h-3.5" />
           </Button>
        </div>

        {value ? (
          <div className="w-full h-full relative group/preview">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/0 group-hover/preview:bg-slate-900/40 transition-colors flex items-center justify-center opacity-0 group-hover/preview:opacity-100 z-10">
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="h-10 w-10 rounded-xl"
                onClick={() => { setUrl(''); onChange(''); }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative p-4">
            {compactMode === 'local' ? (
              <>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  disabled={uploading} 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {uploading ? (
                  <div className="w-8 h-8 border-4 border-[#009688]/20 border-t-[#009688] rounded-full animate-spin" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover/compact:text-[#009688] group-hover/compact:scale-110 transition-all duration-300">
                      <Plus className="w-6 h-6" strokeWidth={3} />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/compact:text-[#009688] transition-colors">Select Asset</span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Input 
                  value={url} 
                  onChange={(e) => {
                    setUrl(e.target.value);
                    onChange(e.target.value);
                  }}
                  placeholder="Paste image URL..." 
                  className="h-10 px-4 rounded-xl border-slate-100 bg-white font-bold text-xs shadow-sm focus:ring-[#009688]/20 transition-all"
                />
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-300 text-center">Remote Endpoint</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="space-y-4 font-display">
      {label && <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#009688] pl-1">{label}</Label>}
      <div className="bg-[#f8fafb] rounded-[32px] p-8 border-2 border-slate-50 shadow-inner group/upload">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 p-1.5 bg-slate-100/50 rounded-2xl h-auto">
            <TabsTrigger value="upload" className="gap-2.5 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-[#009688]">
              <FileUp className="w-4 h-4" /> Machine Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="gap-2.5 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-[#009688]">
              <Link className="w-4 h-4" /> Remote Source
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6 focus-visible:outline-none">
            <div className="relative group/file">
              <input 
                type="file" 
                onChange={handleFileChange} 
                disabled={uploading} 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={cn(
                "h-32 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-500",
                uploading ? "bg-slate-100 border-slate-200" : "bg-white border-slate-200 group-hover/file:border-[#009688] group-hover/file:bg-[#009688]/5"
              )}>
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-4 border-[#009688]/20 border-t-[#009688] rounded-full animate-spin" />
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#009688] animate-pulse">Syncing...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-[16px] bg-slate-50 flex items-center justify-center text-slate-300 group-hover/file:scale-110 group-hover/file:bg-[#009688] group-hover/file:text-white transition-all duration-500">
                      <Upload className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/file:text-[#009688] transition-colors">Select local asset</p>
                      <p className="text-[8px] font-bold text-slate-300 uppercase mt-1 tracking-widest leading-none">Limit: 5MB</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-6 focus-visible:outline-none">
            <div className="space-y-4">
              <Input 
                value={url} 
                onChange={handleUrlChange} 
                placeholder="https://cdn.shashwa.in/assets/v1/..." 
                className="h-16 px-8 rounded-2xl border-slate-100 bg-white font-black text-lg shadow-sm focus:ring-[#009688]/20 transition-all placeholder:text-slate-200"
              />
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pl-2 opacity-60">Input direct endpoint for remote visual data</p>
            </div>
          </TabsContent>
        </Tabs>

        {value && (
          <div className="mt-8 relative group/preview">
            <div className="aspect-video rounded-[24px] overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm relative">
              <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform group-hover/preview:scale-110 duration-1000" />
              <div className="absolute inset-0 bg-slate-900/0 group-hover/preview:bg-slate-900/40 transition-colors duration-500" />
            </div>
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute top-4 right-4 rounded-2xl h-12 w-12 opacity-0 group-hover/preview:opacity-100 transition-all duration-300 hover:scale-110 shadow-2xl"
              onClick={() => { setUrl(''); onChange(''); }}
            >
              <Trash2 className="w-5 h-5" strokeWidth={3} />
            </Button>
            <div className="absolute top-4 left-4">
               <Badge className="bg-[#009688] text-white px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-xl shadow-[#009688]/20 border-none">
                 ACTIVE_BUFFER
               </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

