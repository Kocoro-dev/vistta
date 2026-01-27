"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/actions/profile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteAccountDialogProps {
  trigger?: React.ReactNode;
}

export function DeleteAccountDialog({ trigger }: DeleteAccountDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText !== "ELIMINAR") {
      toast.error("Escribe ELIMINAR para confirmar");
      return;
    }

    setIsDeleting(true);

    try {
      const result = await deleteAccount();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Cuenta eliminada correctamente");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error al eliminar la cuenta");
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="text-[14px] font-medium text-red-600 hover:text-red-700 transition-colors">
            Eliminar cuenta
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <DialogTitle className="text-[18px]">Eliminar cuenta</DialogTitle>
          </div>
          <DialogDescription className="text-[14px] text-neutral-600">
            Esta acción es irreversible. Se eliminarán todos tus datos, incluyendo:
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-2 text-[14px] text-neutral-600 pl-4 list-disc">
          <li>Tu perfil y configuración</li>
          <li>Todas tus generaciones de imágenes</li>
          <li>Tu historial de pagos</li>
          <li>Tus proyectos y carpetas</li>
        </ul>

        <div className="mt-4">
          <label className="block text-[13px] font-medium text-neutral-700 mb-2">
            Escribe <span className="font-bold">ELIMINAR</span> para confirmar
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="ELIMINAR"
            className="w-full px-3 py-2 border border-neutral-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <DialogFooter className="mt-6 gap-3">
          <button
            onClick={() => setOpen(false)}
            disabled={isDeleting}
            className="px-4 py-2 text-[14px] font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== "ELIMINAR"}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[14px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              "Eliminar cuenta"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
