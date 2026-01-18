"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { uploadImage } from "@/actions/upload-image";
import { generateImage, getGenerationStatus } from "@/actions/generate-image";
import { UploadZone } from "@/components/upload-zone";
import { StyleSelector } from "@/components/style-selector";
import { CompareSlider } from "@/components/compare-slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Loader2, Sparkles, ArrowLeft, Download } from "lucide-react";
import type { Generation } from "@/types/database";

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const generationId = searchParams.get("id");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedImagePath, setUploadedImagePath] = useState<string | null>(
    null
  );
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState<Generation | null>(
    null
  );

  // Load existing generation if ID is provided
  useEffect(() => {
    if (generationId) {
      loadGeneration(generationId);
    }
  }, [generationId]);

  // Check for generation status updates (for loading existing generations)
  useEffect(() => {
    if (!currentGeneration) return;
    if (
      currentGeneration.status === "completed" ||
      currentGeneration.status === "failed"
    )
      return;

    // Only poll if status is still processing (for backward compatibility)
    const interval = setInterval(async () => {
      const result = await getGenerationStatus(currentGeneration.id);
      if (result.generation) {
        setCurrentGeneration(result.generation);
        if (result.generation.status === "completed") {
          toast.success("¡Imagen generada con éxito!");
          setIsGenerating(false);
        } else if (result.generation.status === "failed") {
          toast.error(
            result.generation.error_message || "Error al generar la imagen"
          );
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
        toast.success("Imagen subida correctamente");
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
      toast.error("Por favor, sube una imagen primero");
      return;
    }

    setIsGenerating(true);
    toast.info("Generando tu diseño. Esto puede tardar unos segundos...");

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

      // Gemini returns the result immediately (synchronous)
      if (result.success && result.generationId) {
        // Load the completed generation
        const statusResult = await getGenerationStatus(result.generationId);
        if (statusResult.generation) {
          setCurrentGeneration(statusResult.generation);
          // Update URL without reload
          router.replace(`/editor?id=${result.generationId}`);
          toast.success("¡Imagen generada con éxito!");
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
      toast.error("Error al descargar la imagen");
    }
  };

  const isCompleted = currentGeneration?.status === "completed";
  const showCompareSlider =
    isCompleted &&
    currentGeneration?.original_image_url &&
    currentGeneration?.generated_image_url;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Dashboard
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Editor de Diseño</h1>
        <p className="text-muted-foreground mt-1">
          Sube una imagen y transforma su estilo con IA
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        {/* Main content - Image viewer */}
        <div className="space-y-6">
          {showCompareSlider ? (
            <div className="space-y-4">
              <CompareSlider
                beforeImage={currentGeneration.original_image_url}
                afterImage={currentGeneration.generated_image_url!}
              />
              <div className="flex gap-3">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Descargar resultado
                </Button>
                <Button variant="outline" onClick={handleClear}>
                  Nueva imagen
                </Button>
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
            <Card>
              <CardContent className="flex items-center gap-4 py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <div>
                  <p className="font-medium">Generando tu diseño...</p>
                  <p className="text-sm text-muted-foreground">
                    Esto puede tardar entre 15 y 30 segundos
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <StyleSelector
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
                disabled={isGenerating || isCompleted}
              />

              <Button
                onClick={handleGenerate}
                disabled={!uploadedImageUrl || isGenerating || isCompleted}
                className="w-full h-12"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Transformar espacio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Tips card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Consejos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>• Usa fotos bien iluminadas para mejores resultados</p>
              <p>• Las imágenes frontales funcionan mejor</p>
              <p>• Evita fotos con personas u objetos en movimiento</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
