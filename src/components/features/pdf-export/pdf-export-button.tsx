"use client";

import { FileDown, Loader2 } from "lucide-react";
import { usePdfExport } from "./use-pdf-export";

interface PdfExportButtonProps {
  filename?: string;
  className?: string;
}

export function PdfExportButton({ filename, className }: PdfExportButtonProps) {
  const { exportToPdf, isExporting, error } = usePdfExport({ filename });

  return (
    <button
      onClick={exportToPdf}
      disabled={isExporting}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-[12px] font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className || ""}`}
      title={error || "Exportar página a PDF"}
    >
      {isExporting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <FileDown className="h-3.5 w-3.5" />
      )}
      {isExporting ? "Exportando..." : "Exportar PDF"}
    </button>
  );
}
