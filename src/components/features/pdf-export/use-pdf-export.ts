"use client";

import { useState, useCallback } from "react";

interface UsePdfExportOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

interface UsePdfExportReturn {
  exportToPdf: () => Promise<void>;
  isExporting: boolean;
  error: string | null;
}

export function usePdfExport(options: UsePdfExportOptions = {}): UsePdfExportReturn {
  const {
    filename = "vistta-export",
    quality = 0.95,
    scale = 2,
  } = options;

  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPdf = useCallback(async () => {
    setIsExporting(true);
    setError(null);

    try {
      const [html2canvasModule, jsPDFModule] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const html2canvas = html2canvasModule.default;
      const { jsPDF } = jsPDFModule;

      const element = document.body;

      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/jpeg", quality);
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;

      // Calculate dimensions to fit the page
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;

      // Use landscape if content is wider than tall
      const orientation = imgWidth > imgHeight ? "landscape" : "portrait";

      const pdf = new jsPDF({
        orientation,
        unit: "mm",
        format: "a4",
      });

      const pageWidth = orientation === "landscape" ? pdfHeight : pdfWidth;
      const pageHeight = orientation === "landscape" ? pdfWidth : pdfHeight;

      // Center the image on the page
      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;

      pdf.addImage(imgData, "JPEG", x, y, finalWidth, finalHeight);

      const timestamp = new Date().toISOString().split("T")[0];
      pdf.save(`${filename}-${timestamp}.pdf`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al exportar PDF";
      setError(message);
      console.error("PDF Export error:", err);
    } finally {
      setIsExporting(false);
    }
  }, [filename, quality, scale]);

  return { exportToPdf, isExporting, error };
}
