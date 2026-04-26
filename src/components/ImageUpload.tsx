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
      <div className="w-full space-y-3 font-display group/minimal">
        {label && (
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-1 h-1 rounded-full bg-[#009688]" />
            <Label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</Label>
          </div>
        )}
        
        <div className={cn(
          "relative bg-white rounded-[32px] border-2 transition-all duration-700 overflow-hidden",
          isHovered ? "border-[#009688]/30 shadow-2xl shadow-[#009688]/10" : "border-slate-100 shadow-sm"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
          {!value ? (
            <div className="relative h-44">
              <input 
                type="file" 
                onChange={handleFileChange} 
                disabled={uploading} 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-slate-50/20 group-hover/minimal:bg-[#009688]/5 transition-all duration-700">
                {uploading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#009688]/10 border-t-[#009688] rounded-full animate-spin" />
                    <p className="text-[8px] font-black uppercase tracking-widest text-[#009688] animate-pulse">Syncing...</p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-[20px] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center text-slate-300 group-hover/minimal:text-[#009688] group-hover/minimal:scale-110 group-hover/minimal:rotate-3 transition-all duration-700 border border-slate-50">
                      <FileUp className="w-7 h-7" strokeWidth={2.5} />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/minimal:text-slate-600 transition-colors">Capture Asset</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="relative group/mini-preview h-44 overflow-hidden">
              <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform duration-[3s] ease-out group-hover/mini-preview:scale-110" />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/mini-preview:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-2xl h-12 w-12 bg-white/20 backdrop-blur-xl hover:bg-rose-500 transition-all duration-500 hover:scale-110 border border-white/20 shadow-2xl"
                  onClick={() => { setUrl(''); onChange(''); }}
                >
                  <Trash2 className="w-5 h-5" strokeWidth={3} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const [mode, setMode] = useState<'upload' | 'url'>('upload');

  return (
    <div className="w-full space-y-6 font-display group/uploader">
      {label && (
        <div className="flex items-center gap-3 mb-1">
          <div className="w-2 h-2 rounded-full bg-[#009688] shadow-lg shadow-[#009688]/50 animate-pulse" />
          <Label className="text-[12px] font-black uppercase tracking-[0.4em] text-slate-400 group-hover/uploader:text-[#009688] transition-colors duration-500">{label}</Label>
        </div>
      )}
      
      <div 
        className={cn(
          "relative bg-white rounded-[48px] p-3 border-2 transition-all duration-1000",
          isHovered ? "border-[#009688]/40 shadow-[0_32px_64px_-16px_rgba(0,150,136,0.1)]" : "border-slate-100 shadow-sm"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-[40px] bg-slate-50/50">
          {!value ? (
            <div className="flex flex-col">
              {/* Main Interaction Zone */}
              <div className="relative p-10 flex flex-col items-center justify-center min-h-[300px] border-b border-slate-100/50">
                {mode === 'upload' ? (
                  <>
                    <input 
                      type="file" 
                      onChange={handleFileChange} 
                      disabled={uploading} 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    />
                    <div className="flex flex-col items-center gap-8 z-10">
                      <div className="relative group/icon-box">
                        <div className="absolute inset-0 bg-[#009688] blur-3xl opacity-0 group-hover/uploader:opacity-10 transition-opacity duration-1000 rounded-full" />
                        <div className={cn(
                          "w-24 h-24 rounded-[32px] bg-white shadow-2xl flex items-center justify-center transition-all duration-700 border border-slate-50",
                          isHovered ? "scale-110 rotate-3 text-[#009688] shadow-[#009688]/20" : "text-slate-300"
                        )}>
                          {uploading ? (
                            <div className="w-10 h-10 border-4 border-[#009688]/10 border-t-[#009688] rounded-full animate-spin" />
                          ) : (
                            <Upload className="w-10 h-10" strokeWidth={2.5} />
                          )}
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-lg font-black uppercase tracking-widest text-slate-800">
                          {uploading ? 'Synchronizing Visuals' : 'Initialize Asset Portal'}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                          Drag & Drop or Tap to Browse Filesystem
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full max-w-md space-y-6 z-10 p-4">
                    <div className="flex flex-col items-center gap-6 mb-2">
                      <div className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-[#009688] border border-slate-50">
                        <Link className="w-7 h-7" strokeWidth={2.5} />
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-800">Inject Remote Endpoint</h3>
                      </div>
                    </div>
                    <div className="relative group/input">
                      <Input 
                        value={url} 
                        onChange={handleUrlChange} 
                        placeholder="https://cdn.shashwat.com/assets/..." 
                        className="h-16 px-8 rounded-3xl border-slate-200 bg-white font-bold text-base shadow-xl shadow-slate-200/20 focus:ring-4 focus:ring-[#009688]/10 focus:border-[#009688] transition-all duration-500 placeholder:text-slate-300"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mode Toggle Bar */}
              <div className="bg-white p-4 flex items-center justify-center gap-8">
                <button 
                  type="button"
                  onClick={() => setMode('upload')}
                  className={cn(
                    "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-500 px-6 py-3 rounded-2xl",
                    mode === 'upload' ? "bg-[#009688]/10 text-[#009688] shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Upload className="w-3.5 h-3.5" /> Local Upload
                </button>
                <div className="w-1 h-1 rounded-full bg-slate-200" />
                <button 
                  type="button"
                  onClick={() => setMode('url')}
                  className={cn(
                    "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-500 px-6 py-3 rounded-2xl",
                    mode === 'url' ? "bg-[#009688]/10 text-[#009688] shadow-sm" : "text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Link className="w-3.5 h-3.5" /> Remote URL
                </button>
              </div>
            </div>
          ) : (
            <div className="relative group/preview-master overflow-hidden min-h-[400px]">
              <img 
                src={value} 
                alt="Asset Preview" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[4s] ease-out group-hover/preview-master:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-12">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 translate-y-6 group-hover/preview-master:translate-y-0 transition-transform duration-1000">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#009688] animate-ping" />
                      <Badge className="bg-[#009688] text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-[#009688]/50 border-none">
                        ASSET_SYNCHRONIZED
                      </Badge>
                    </div>
                    <div className="pl-1">
                      <h4 className="text-white text-2xl font-black tracking-tight uppercase italic drop-shadow-2xl">Production Ready Buffer</h4>
                      <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.4em] mt-1">Verified High-Resolution Visual Payload</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="rounded-[24px] h-16 w-16 bg-white/10 backdrop-blur-3xl hover:bg-rose-500 hover:text-white text-white transition-all duration-700 hover:scale-110 border border-white/10 shadow-2xl shadow-black/50"
                      onClick={() => { setUrl(''); onChange(''); }}
                    >
                      <Trash2 className="w-7 h-7" strokeWidth={3} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

