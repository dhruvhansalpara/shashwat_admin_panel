import React, { useState } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, Link as LinkIcon, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export function ImageUpload({ value, onChange, label, folder = 'uploads' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate if it's an image
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      toast.loading('Starting upload...', { id: 'upload-toast' });
      
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storagePath = `${folder}/${fileName}`;
      const storageRef = ref(storage, storagePath);
      
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(p);
          if (p > 0) {
            toast.loading(`Uploading: ${Math.round(p)}%`, { id: 'upload-toast' });
          }
        },
        (error) => {
          console.error('Firebase Storage Upload error:', error);
          let message = error.message;
          if (error.code === 'storage/unauthorized') {
            message = 'Unauthorized: Storage permissions denied.';
          } else if (error.code === 'storage/retry-limit-exceeded') {
            message = 'Connection timeout.';
          }
          toast.error('Upload failed: ' + message, { id: 'upload-toast' });
          setUploading(false);
          setProgress(0);
          // Reset input so same file can be selected again
          if (fileInputRef.current) fileInputRef.current.value = '';
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onChange(downloadURL);
            setUploading(false);
            setProgress(0);
            toast.success('Image uploaded successfully', { id: 'upload-toast' });
          } catch (err: any) {
            console.error('Error getting download URL:', err);
            toast.error('Failed to get download URL: ' + err.message, { id: 'upload-toast' });
            setUploading(false);
          }
          // Reset input
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      );
    } catch (err: any) {
      console.error('Catch block upload error:', err);
      toast.error('Failed to initiate upload: ' + err.message, { id: 'upload-toast' });
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>}
      
      <div className="border rounded-lg p-2 space-y-4">
        {value ? (
          <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
            <img 
              src={value} 
              alt="Preview" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="upload" className="flex items-center gap-2 text-xs">
                <Upload className="w-3 h-3" /> Upload
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2 text-xs">
                <LinkIcon className="w-3 h-3" /> URL
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="pt-2">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-4 bg-muted/30">
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-xs font-medium">Uploading... {Math.round(progress)}%</p>
                    <div className="w-full max-w-[150px] bg-muted h-1 rounded-full overflow-hidden mt-1">
                      <div 
                        className="bg-primary h-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground mb-1 opacity-50" />
                    <p className="text-[10px] text-muted-foreground mb-3">Click to select file</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs px-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="pt-2">
              <div className="space-y-2">
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={value}
                  className="h-8 text-xs"
                  onChange={(e) => onChange(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground italic">
                  Paste the direct link to an image.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
