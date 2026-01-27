"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Crown, Gift } from "lucide-react";
import { FREE_CREDITS } from "@/lib/constants";

interface WelcomeModalProps {
  open: boolean;
  onComplete: (option: "free" | "plans") => void;
}

export function WelcomeModal({ open, onComplete }: WelcomeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFreeOption = async () => {
    setIsLoading(true);
    await onComplete("free");
    setIsLoading(false);
  };

  const handlePlansOption = () => {
    onComplete("plans");
  };

  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
            <Gift className="h-6 w-6 text-neutral-900" />
          </div>
          <DialogTitle className="text-xl">Bienvenido a Vistta</DialogTitle>
          <DialogDescription className="text-neutral-600">
            Transforma tus espacios con inteligencia artificial. Elige cómo quieres empezar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {/* Opción gratuita */}
          <button
            onClick={handleFreeOption}
            disabled={isLoading}
            className="flex items-start gap-4 rounded-lg border border-neutral-200 p-4 text-left transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
              <Sparkles className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                Probar gratis
              </p>
              <p className="text-sm text-neutral-500 mt-0.5">
                {FREE_CREDITS} imágenes gratuitas para probar la plataforma
              </p>
            </div>
          </button>

          {/* Opción de planes */}
          <button
            onClick={handlePlansOption}
            disabled={isLoading}
            className="flex items-start gap-4 rounded-lg border border-neutral-200 p-4 text-left transition-all hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <Crown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                Ver planes
              </p>
              <p className="text-sm text-neutral-500 mt-0.5">
                Accede a todas las funciones sin marca de agua
              </p>
            </div>
          </button>
        </div>

        <DialogFooter className="sm:justify-center">
          <p className="text-xs text-neutral-400 text-center">
            Las imágenes gratuitas incluyen marca de agua
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
