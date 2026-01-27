"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Zap } from "lucide-react";
import Link from "next/link";

interface NoCreditsModalProps {
  open: boolean;
  onClose: () => void;
}

export function NoCreditsModal({ open, onClose }: NoCreditsModalProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Zap className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-xl">Sin créditos disponibles</DialogTitle>
          <DialogDescription className="text-neutral-600">
            Has utilizado todos tus créditos gratuitos. Adquiere un plan para seguir transformando espacios.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="h-5 w-5 text-neutral-600" />
              <span className="font-medium text-neutral-900">Ventajas de los planes</span>
            </div>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Sin marca de agua en las imágenes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Acceso a todos los estilos de diseño
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Resolución HD para tus imágenes
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Soporte prioritario
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button asChild className="w-full">
            <Link href="/planes">
              Ver planes disponibles
            </Link>
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full">
            Volver al editor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
