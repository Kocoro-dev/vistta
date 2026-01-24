"use client";

import { PdfExportButton } from "@/components/features/pdf-export";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-12 flex items-center justify-between">
        <p className="text-[12px] text-neutral-400">
          © {new Date().getFullYear()} VISTTA
        </p>
        <div className="flex items-center gap-4">
          <PdfExportButton />
        </div>
      </div>
    </footer>
  );
}
