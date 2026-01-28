"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-auto">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-negro-Vistta.svg" alt="Vistta" className="h-4" />
          <span className="text-[12px] text-neutral-400">
            © {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/terminos" className="text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors">
            Términos
          </Link>
          <Link href="/privacidad" className="text-[12px] text-neutral-400 hover:text-neutral-600 transition-colors">
            Privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
