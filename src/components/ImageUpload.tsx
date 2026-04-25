import * as React from 'react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Link, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  folder?: string;
}

export function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [url, setUrl] = useState(value);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="space-y-3">
      {label && <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</Label>}
      <div className="bg-muted/30 rounded-xl p-4 border border-dashed border-border/60">
        <Tabs defaultValue="url">
          <TabsList className="grid w-full grid-cols-1 mb-4">
            <TabsTrigger value="url" className="gap-2">
              <Link className="w-3 h-3" /> Image URL
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Input 
                value={url} 
                onChange={handleUrlChange} 
                placeholder="https://images.unsplash.com/..." 
                className="bg-background"
              />
              <p className="text-[10px] text-muted-foreground italic">Paste a direct image link from Unsplash, Pixabay, or your own storage.</p>
            </div>
            
            {value && (
              <div className="relative group">
                <div className="aspect-video rounded-lg overflow-hidden border border-border/50 bg-black/5">
                  <img src={value} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                  onClick={() => { setUrl(''); onChange(''); }}
                >
                  <Upload className="w-4 h-4 rotate-180" />
                </Button>
              </div>
            )}
            
            {!value && (
              <div className="aspect-video rounded-lg border border-dashed border-border flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/20">
                <ImageIcon className="w-8 h-8 opacity-20" />
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Preview Area</span>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
