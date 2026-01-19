"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { uploadImage } from "@/actions/upload-image";
import { generateImage, getGenerationStatus } from "@/actions/generate-image";
import { UploadZone } from "@/components/upload-zone";
import { StyleSelector } from "@/components/style-selector";
import { CompareSlider } from "@/components/compare-slider";
import { toast } from "sonner";
import { Loader2, Sparkles, ArrowLeft, Download } from "lucide-react";
import type { Generation } from "@/types/database";

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const generationId = searchParams.get("id");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(null);

  useEffect(() => {
    if (generationId) {
      loadGeneration(generationId);
    }
  }, [generationId]);

  useEffect(() => {
    if (!currentGeneration) return;
    if (currentGeneration.status === "completed" || currentGeneration.status === "failed") return;

    const interval = setInterval(async () => {
      const result = await getGenerationStatus(currentGeneration.id);
      if (result.generation) {
        setCurrentGeneration(result.generation);
        if (result.generation.status === "completed") {
          toast.success("Imagen generada con éxito");
          setIsGenerating(false);
        } else if (result.generation.status === "failed") {
          toast.error(result.generation.error_message || "Error al generar la imagen");
          setIsGenerating(false);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentGeneration]);

  const loadGeneration = async (id: string) => {
    const result = await getGenerationStatus(id);
    if (result.generation) {
      setCurrentGeneration(result.generation);
      setUploadedImageUrl(result.generation.original_image_url);
      setUploadedImagePath(result.generation.original_image_path);
      setSelectedStyle(result.generation.style);
    }
  };

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadImage(formData);

      if (result.error) {
        toast.error(result.error);
        setSelectedFile(null);
        return;
      }

      if (result.success && result.url && result.path) {
        setUploadedImageUrl(result.url);
        setUploadedImagePath(result.path);
        toast.success("Imagen subida");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error al subir la imagen");
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUploadedImageUrl(null);
    setUploadedImagePath(null);
    setCurrentGeneration(null);
  };

  const handleGenerate = async () => {
    if (!uploadedImageUrl || !uploadedImagePath) {
      toast.error("Sube una imagen primero");
      return;
    }

    setIsGenerating(true);
    toast.info("Generando diseño...");

    try {
      const result = await generateImage({
        originalImageUrl: uploadedImageUrl,
        originalImagePath: uploadedImagePath,
        styleId: selectedStyle,
      });

      if (result.error) {
        toast.error(result.error);
        setIsGenerating(false);
        return;
      }

      if (result.success && result.generationId) {
        const statusResult = await getGenerationStatus(result.generationId);
        if (statusResult.generation) {
          setCurrentGeneration(statusResult.generation);
          router.replace(`/editor?id=${result.generationId}`);
          toast.success("Imagen generada con éxito");
        }
        setIsGenerating(false);
      }
    } catch (error) {
      console.error("Generate error:", error);
      toast.error("Error al generar la imagen");
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!currentGeneration?.generated_image_url) return;

    try {
      const response = await fetch(currentGeneration.generated_image_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vistta-${currentGeneration.style}-${Date.now()}.webp`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Error al descargar");
    }
  };

  const isCompleted = currentGeneration?.status === "completed";
  const showCompareSlider =
    isCompleted &&
    currentGeneration?.original_image_url &&
    currentGeneration?.generated_image_url;

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-[13px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Link>
          <div>
            <span className="text-label text-neutral-400 mb-4 block">Editor</span>
            <h1 className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium text-neutral-900 text-editorial leading-[1.1]">
              Nuevo Diseño
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,380px] gap-8 lg:gap-12">
          {/* Main content */}
          <div className="space-y-6">
            {showCompareSlider ? (
              <div className="space-y-6">
                <CompareSlider
                  beforeImage={currentGeneration.original_image_url}
                  afterImage={currentGeneration.generated_image_url!}
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white h-12 text-[14px] font-medium transition-all"
                  >
                    <Download className="h-4 w-4" />
                    Descargar resultado
                  </button>
                  <button
                    onClick={handleClear}
                    className="inline-flex items-center justify-center border border-neutral-200 hover:border-neutral-300 text-neutral-700 px-6 h-12 text-[14px] font-medium transition-all hover:bg-neutral-50"
                  >
                    Nueva imagen
                  </button>
                </div>
              </div>
            ) : (
              <UploadZone
                onFileSelect={handleFileSelect}
                onClear={handleClear}
                previewUrl={uploadedImageUrl}
                isUploading={isUploading}
                disabled={isGenerating}
              />
            )}

            {/* Processing indicator */}
            {isGenerating && !isCompleted && (
              <div className="border border-neutral-200 bg-white p-6">
                <div className="flex items-center gap-4">
                  <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
                  <div>
                    <p className="font-medium text-[15px] text-neutral-900">Generando diseño...</p>
                    <p className="text-[14px] text-neutral-500">
                      Esto puede tardar entre 15 y 30 segundos
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-neutral-200 bg-white p-6">
              <span className="text-label text-neutral-400 mb-6 block">Configuración</span>

              <StyleSelector
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
                disabled={isGenerating || isCompleted}
              />

              <button
                onClick={handleGenerate}
                disabled={!uploadedImageUrl || isGenerating || isCompleted}
                className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white h-12 text-[14px] font-medium transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Transformar espacio
                  </>
                )}
              </button>
            </div>

            {/* Tips */}
            <div className="border border-neutral-200 bg-white p-6">
              <span className="text-label text-neutral-400 mb-4 block">Consejos</span>
              <ul className="space-y-3 text-[14px] text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 bg-neutral-300 rounded-full mt-2 flex-shrink-0" />
                  Usa fotos bien iluminadas para mejores resultados
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 bg-neutral-300 rounded-full mt-2 flex-shrink-0" />
                  Las imágenes frontales funcionan mejor
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 bg-neutral-300 rounded-full mt-2 flex-shrink-0" />
                  Evita fotos con personas u objetos en movimiento
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
