"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
    maxSize: 10 * 1024 * 1024,
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
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-neutral-200 bg-neutral-100">
        <Image
          src={preview}
          alt="Preview"
          fill
          className="object-contain"
        />
        {!disabled && (
          <button
            onClick={handleClear}
            className="absolute top-4 right-4 h-8 w-8 bg-white hover:bg-neutral-50 border border-neutral-200 flex items-center justify-center transition-all"
          >
            <X className="h-4 w-4 text-neutral-600" />
          </button>
        )}
        {isUploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90">
            <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative aspect-[4/3] w-full cursor-pointer border border-dashed transition-all",
        isDragActive
          ? "border-neutral-900 bg-neutral-50"
          : "border-neutral-300 hover:border-neutral-400",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <input {...getInputProps()} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
        <div className="h-14 w-14 border border-neutral-200 flex items-center justify-center">
          {isDragActive ? (
            <ImageIcon className="h-6 w-6 text-neutral-900" />
          ) : (
            <Upload className="h-6 w-6 text-neutral-400" />
          )}
        </div>
        <div className="text-center">
          <p className="font-medium text-[15px] text-neutral-900">
            {isDragActive ? "Suelta la imagen" : "Arrastra una imagen"}
          </p>
          <p className="text-[14px] text-neutral-500 mt-1">
            o haz clic para seleccionar
          </p>
        </div>
        <p className="text-[13px] text-neutral-400">
          JPG, PNG o WebP · máx. 10MB
        </p>
      </div>
    </div>
  );
}
