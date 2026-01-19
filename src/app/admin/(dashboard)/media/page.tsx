"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Upload, Trash2, Copy, Loader2, Image as ImageIcon, X } from "lucide-react";

interface MediaFile {
  name: string;
  id: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
  url: string;
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);

  const supabase = createClient();

  const loadFiles = async () => {
    setIsLoading(true);

    const { data, error } = await supabase.storage
      .from("admin-media")
      .list("", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      // If bucket doesn't exist, show empty state
      if (error.message.includes("not found")) {
        setFiles([]);
        setIsLoading(false);
        return;
      }
      toast.error("Error al cargar archivos");
      console.error(error);
    } else {
      // Get public URLs for each file
      const filesWithUrls = await Promise.all(
        (data || [])
          .filter((file) => file.name !== ".emptyFolderPlaceholder")
          .map(async (file) => {
            const { data: urlData } = supabase.storage
              .from("admin-media")
              .getPublicUrl(file.name);

            return {
              ...file,
              url: urlData.publicUrl,
            } as MediaFile;
          })
      );

      setFiles(filesWithUrls);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("admin-media")
      .upload(fileName, file);

    if (error) {
      toast.error("Error al subir archivo");
      console.error(error);
    } else {
      toast.success("Archivo subido correctamente");
      loadFiles();
    }

    setIsUploading(false);
    e.target.value = "";
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm("¿Eliminar este archivo?")) return;

    const { error } = await supabase.storage
      .from("admin-media")
      .remove([fileName]);

    if (error) {
      toast.error("Error al eliminar archivo");
      console.error(error);
    } else {
      toast.success("Archivo eliminado");
      setSelectedFile(null);
      loadFiles();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copiada al portapapeles");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-[28px] font-medium text-white mb-2">
            Media
          </h1>
          <p className="text-[15px] text-neutral-500">
            Gestiona las imágenes subidas al sistema
          </p>
        </div>

        <label className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-neutral-900 px-5 h-10 text-[13px] font-medium cursor-pointer transition-colors">
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Subir Imagen
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </label>
      </div>

      {/* Content */}
      <div className="flex gap-6">
        {/* Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-6 w-6 text-neutral-500 animate-spin" />
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-neutral-900 border border-neutral-800">
              <ImageIcon className="h-10 w-10 text-neutral-700 mb-4" />
              <p className="text-[14px] text-neutral-500 mb-2">
                No hay imágenes
              </p>
              <p className="text-[12px] text-neutral-600">
                Sube tu primera imagen usando el botón de arriba
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`relative aspect-square bg-neutral-900 border overflow-hidden transition-all ${
                    selectedFile?.id === file.id
                      ? "border-white"
                      : "border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        {selectedFile && (
          <div className="w-80 bg-neutral-900 border border-neutral-800 p-6 sticky top-8 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[14px] font-medium text-white">
                Detalles
              </h3>
              <button
                onClick={() => setSelectedFile(null)}
                className="h-6 w-6 flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Preview */}
            <div className="aspect-square bg-neutral-800 mb-4 overflow-hidden">
              <img
                src={selectedFile.url}
                alt={selectedFile.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="text-[11px] text-neutral-500 uppercase tracking-wider">
                  Nombre
                </label>
                <p className="text-[13px] text-white truncate">
                  {selectedFile.name}
                </p>
              </div>
              {selectedFile.metadata?.size && (
                <div>
                  <label className="text-[11px] text-neutral-500 uppercase tracking-wider">
                    Tamaño
                  </label>
                  <p className="text-[13px] text-white">
                    {formatFileSize(selectedFile.metadata.size)}
                  </p>
                </div>
              )}
              <div>
                <label className="text-[11px] text-neutral-500 uppercase tracking-wider">
                  Fecha
                </label>
                <p className="text-[13px] text-white">
                  {new Date(selectedFile.created_at).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* URL */}
            <div className="mb-6">
              <label className="text-[11px] text-neutral-500 uppercase tracking-wider mb-2 block">
                URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={selectedFile.url}
                  readOnly
                  className="flex-1 h-9 px-3 bg-neutral-800 border border-neutral-700 text-white text-[12px] truncate"
                />
                <button
                  onClick={() => copyUrl(selectedFile.url)}
                  className="h-9 px-3 bg-neutral-700 hover:bg-neutral-600 text-white transition-colors"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => handleDelete(selectedFile.name)}
              className="w-full flex items-center justify-center gap-2 h-10 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[13px] font-medium transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </button>
          </div>
        )}
      </div>

      {/* Setup Notice */}
      <div className="mt-10 p-6 bg-orange-500/10 border border-orange-500/20">
        <h3 className="text-[14px] font-medium text-orange-400 mb-2">
          Configuración Requerida
        </h3>
        <p className="text-[13px] text-orange-300/70 mb-3">
          Asegúrate de crear el bucket &quot;admin-media&quot; en Supabase Storage con acceso público.
        </p>
        <code className="block bg-neutral-900 p-4 text-[12px] text-neutral-300 overflow-x-auto">
          {`-- En Supabase SQL Editor:
INSERT INTO storage.buckets (id, name, public) VALUES ('admin-media', 'admin-media', true);

CREATE POLICY "Public read admin-media"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'admin-media');

CREATE POLICY "Service role upload admin-media"
ON storage.objects FOR INSERT TO service_role
USING (bucket_id = 'admin-media');`}
        </code>
      </div>
    </div>
  );
}
