"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  previewUrl?: string | null;
  isUploading?: boolean;
  disabled?: boolean;
}

export function UploadZone({
  onFileSelect,
  onClear,
  previewUrl,
  isUploading = false,
  disabled = false,
}: UploadZoneProps) {
  const [preview, setPreview] = useState<string | null>(previewUrl ?? null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0 && !disabled) {
        const file = acceptedFiles[0];
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onFileSelect(file);
      }
    },
    [onFileSelect, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: disabled || isUploading,
  });

  const handleClear = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onClear?.();
  };

  if (preview) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border bg-muted">
        <Image
          src={preview}
          alt="Preview"
          fill
          className="object-contain"
        />
        {!disabled && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative aspect-[4/3] w-full cursor-pointer rounded-xl border-2 border-dashed transition-colors",
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input {...getInputProps()} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
          {isDragActive ? (
            <ImageIcon className="h-8 w-8 text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
        </div>
        <div className="text-center">
          <p className="font-medium">
            {isDragActive ? "Suelta la imagen aquí" : "Arrastra una imagen"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            o haz clic para seleccionar
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          JPG, PNG o WebP (máx. 10MB)
        </p>
      </div>
    </div>
  );
}
