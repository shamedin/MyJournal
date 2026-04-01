'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ChartImageUploadProps {
  timeframe: '1D' | '4H' | '15M';
  imageSrc?: string;
  onImageChange: (base64: string) => void;
}

export function ChartImageUpload({ timeframe, imageSrc, onImageChange }: ChartImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onImageChange(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        ref={fileInputRef}
        className="hidden"
      />
      
      {imageSrc ? (
        <div className="relative group w-full">
          <img 
            src={imageSrc} 
            alt={`${timeframe} chart`}
            className="w-full h-40 object-contain bg-muted rounded"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-40 border-2 border-dashed border-border rounded flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer"
        >
          <Upload className="w-5 h-5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground text-center px-2">
            Upload {timeframe}
          </span>
        </button>
      )}
    </div>
  );
}
