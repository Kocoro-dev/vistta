"use client";

import { useState } from "react";
import { convertImageFormat } from "@/actions/download-image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Download, ChevronDown, Loader2, Image, FileImage } from "lucide-react";

type ImageFormat = "webp" | "jpeg" | "png";

interface DownloadDropdownProps {
  imageUrl: string;
  fileName?: string;
  className?: string;
}

const formats: { value: ImageFormat; label: string; description: string }[] = [
  {
    value: "webp",
    label: "WebP",
    description: "Menor tamaño, alta calidad",
  },
  {
    value: "jpeg",
    label: "JPEG",
    description: "Compatible con todo",
  },
  {
    value: "png",
    label: "PNG",
    description: "Sin pérdida de calidad",
  },
];

export function DownloadDropdown({
  imageUrl,
  fileName = "vistta-design",
  className = "",
}: DownloadDropdownProps) {
  const [isDownloading, setIsDownloading] = useState<ImageFormat | null>(null);

  const handleDownload = async (format: ImageFormat) => {
    if (!imageUrl) return;

    setIsDownloading(format);

    try {
      // Check if it's a data URL or needs conversion
      if (imageUrl.startsWith("data:")) {
        // Direct download for data URLs
        const result = await convertImageFormat(imageUrl, format);

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        downloadDataUrl(result.image.dataUrl, `${fileName}.${result.image.extension}`);
      } else {
        // For remote URLs, convert on server
        const result = await convertImageFormat(imageUrl, format);

        if ("error" in result) {
          toast.error(result.error);
          return;
        }

        downloadDataUrl(result.image.dataUrl, `${fileName}.${result.image.extension}`);
      }

      toast.success("Imagen descargada");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Error al descargar la imagen");
    } finally {
      setIsDownloading(null);
    }
  };

  const downloadDataUrl = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          disabled={!!isDownloading}
          className={`inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white h-12 px-5 text-[14px] font-medium transition-all disabled:opacity-70 ${className}`}
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Descargando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Descargar
              <ChevronDown className="h-4 w-4 ml-1" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {formats.map((format) => (
          <DropdownMenuItem
            key={format.value}
            onClick={() => handleDownload(format.value)}
            disabled={!!isDownloading}
            className="cursor-pointer flex items-start gap-3 py-2.5"
          >
            <FileImage className="h-5 w-5 text-neutral-400 mt-0.5" />
            <div>
              <div className="text-[14px] font-medium text-neutral-900">
                {format.label}
              </div>
              <div className="text-[12px] text-neutral-500">
                {format.description}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple download button without dropdown
export function DownloadButton({
  imageUrl,
  fileName = "vistta-design",
  format = "webp",
  className = "",
}: {
  imageUrl: string;
  fileName?: string;
  format?: ImageFormat;
  className?: string;
}) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!imageUrl) return;

    setIsDownloading(true);

    try {
      const result = await convertImageFormat(imageUrl, format);

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      const link = document.createElement("a");
      link.href = result.image.dataUrl;
      link.download = `${fileName}.${result.image.extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Imagen descargada");
    } catch (error) {
      toast.error("Error al descargar la imagen");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className={`inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white h-12 px-5 text-[14px] font-medium transition-all disabled:opacity-70 ${className}`}
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Descargando...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Descargar
        </>
      )}
    </button>
  );
}
