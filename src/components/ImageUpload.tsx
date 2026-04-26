import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Link, Upload, Image as ImageIcon, FileUp, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { Badge } from './ui/badge';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  folder?: string;
  variant?: 'standard' | 'minimal';
}

export function ImageUpload({ value, onChange, label, variant = 'standard' }: ImageUploadProps) {
  const [url, setUrl] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    onChange(e.target.value);
  };

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
      toast.success('Visual asset synchronized');
    } catch (err) {
      toast.error('Synchronization failed');
    } finally {
      setUploading(false);
    }
  };

  if (variant === 'minimal') {
    return (
      <div className="w-full space-y-4 font-display group/minimal">
        {label && (
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-1 rounded-full bg-[#009688]" />
            <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</Label>
          </div>
        )}
        
        <div className={cn(
          "relative bg-white rounded-[32px] border-2 transition-all duration-500 overflow-hidden",
          isHovered ? "border-[#009688]/30 shadow-xl" : "border-slate-50 shadow-sm"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
          {!value ? (
            <div className="relative h-40">
              <input 
                type="file" 
                onChange={handleFileChange} 
                disabled={uploading} 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-50/30 group-hover/minimal:bg-[#009688]/5 transition-colors duration-500">
                {uploading ? (
                  <div className="w-10 h-10 border-4 border-[#009688]/10 border-t-[#009688] rounded-full animate-spin" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-slate-300 group-hover/minimal:text-[#009688] group-hover/minimal:scale-110 transition-all duration-500">
                      <Upload className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Upload Image</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="relative group/mini-preview h-40 overflow-hidden">
              <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-[2s] group-hover/mini-preview:scale-110" />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/mini-preview:opacity-100 transition-all duration-500 flex items-center justify-center">
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-xl h-10 w-10 bg-white/20 backdrop-blur-md hover:bg-rose-500 transition-all"
                  onClick={() => { setUrl(''); onChange(''); }}
                >
                  <Trash2 className="w-4 h-4" strokeWidth={3} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 font-display group">
      {label && (
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[#009688] animate-pulse" />
          <Label className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-[#009688] transition-colors">{label}</Label>
        </div>
      )}
      
      <div 
        className={cn(
          "relative bg-white rounded-[40px] p-2 border-2 transition-all duration-500 overflow-hidden",
          isHovered ? "border-[#009688]/30 shadow-2xl shadow-[#009688]/5" : "border-slate-100 shadow-sm"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Tabs defaultValue="upload" className="w-full">
          <div className="p-2 pb-0">
            <TabsList className="grid w-full grid-cols-2 p-1.5 bg-slate-50 rounded-[32px] h-auto border border-slate-100/50">
              <TabsTrigger 
                value="upload" 
                className="gap-3 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-[#009688] transition-all duration-500"
              >
                <FileUp className={cn("w-4 h-4 transition-transform duration-500", uploading ? "animate-bounce" : "group-hover:scale-110")} /> 
                Local Filesystem
              </TabsTrigger>
              <TabsTrigger 
                value="url" 
                className="gap-3 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:text-[#009688] transition-all duration-500"
              >
                <Link className="w-4 h-4 transition-transform duration-500 group-hover:rotate-12" /> 
                Remote Endpoint
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="upload" className="space-y-6 focus-visible:outline-none mt-0">
              <div className="relative group/file">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  disabled={uploading} 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className={cn(
                  "h-44 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-5 transition-all duration-700",
                  uploading 
                    ? "bg-slate-50/50 border-slate-200" 
                    : "bg-slate-50/30 border-slate-100 group-hover/file:border-[#009688]/40 group-hover/file:bg-[#009688]/5 group-hover/file:scale-[0.99]"
                )}>
                  {uploading ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 border-4 border-[#009688]/10 border-t-[#009688] rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-2 h-2 bg-[#009688] rounded-full animate-ping" />
                        </div>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#009688] animate-pulse">Synchronizing Data...</p>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-[24px] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-300 group-hover/file:scale-110 group-hover/file:bg-[#009688] group-hover/file:text-white group-hover/file:rotate-6 transition-all duration-700 border border-slate-50">
                        <Upload className="w-7 h-7" strokeWidth={2.5} />
                      </div>
                      <div className="text-center space-y-1.5">
                        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover/file:text-slate-600 transition-colors">Initialize Asset Upload</p>
                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest opacity-60">Max Payload: 5MB</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="url" className="space-y-6 focus-visible:outline-none mt-0">
              <div className="space-y-4">
                <div className="relative group/input">
                  <Input 
                    value={url} 
                    onChange={handleUrlChange} 
                    placeholder="https://content.shashwa.in/v1/assets/..." 
                    className="h-16 px-8 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-base shadow-inner focus:ring-[#009688]/20 focus:bg-white transition-all duration-500 placeholder:text-slate-300 placeholder:font-medium"
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-focus-within/input:opacity-100 transition-opacity">
                    <div className="w-2 h-2 rounded-full bg-[#009688] animate-ping" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-2">
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] opacity-60 italic">Inject secure remote endpoint for asset retrieval</p>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {value && (
          <div className="p-4 pt-0">
            <div className="relative group/preview overflow-hidden rounded-[32px] border border-slate-100 shadow-sm bg-slate-50">
              <div className="aspect-[21/9] overflow-hidden">
                <img 
                  src={value} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover/preview:scale-110" 
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover/preview:opacity-100 transition-all duration-700 flex flex-col justify-end p-8">
                <div className="flex items-center justify-between translate-y-4 group-hover/preview:translate-y-0 transition-transform duration-700">
                  <div className="space-y-1">
                    <Badge className="bg-[#009688] text-white px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-2xl shadow-[#009688]/40 border-none">
                      LIVE_ASSET_READY
                    </Badge>
                    <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest pl-0.5">Verified Visual Buffer</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="destructive" 
                    size="icon" 
                    className="rounded-2xl h-14 w-14 bg-white/10 backdrop-blur-xl hover:bg-rose-500 hover:text-white text-white transition-all duration-500 hover:scale-110 border border-white/20 shadow-2xl"
                    onClick={() => { setUrl(''); onChange(''); }}
                  >
                    <Trash2 className="w-6 h-6" strokeWidth={3} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

