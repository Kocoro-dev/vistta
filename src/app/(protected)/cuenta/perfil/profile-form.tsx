"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, requestEmailChange } from "@/actions/profile";
import { AvatarUpload } from "@/components/avatar-upload";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Loader2, Mail, Calendar, AlertTriangle } from "lucide-react";
import type { Profile } from "@/types/database";

interface ProfileFormProps {
  profile: Profile;
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  const hasNameChanged = fullName !== (profile.full_name || "");
  const hasEmailChanged = email !== (profile.email || "");

  const handleSaveProfile = async () => {
    if (!hasNameChanged) return;

    setIsSaving(true);

    try {
      const result = await updateProfile({ full_name: fullName });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Perfil actualizado");
        router.refresh();
      }
    } catch (error) {
      toast.error("Error al actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!hasEmailChanged || !email) return;

    setIsChangingEmail(true);

    try {
      const result = await requestEmailChange(email);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success) {
        toast.success(result.message);
      }
    } catch (error) {
      toast.error("Error al cambiar el email");
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleAvatarChange = (newUrl: string) => {
    setAvatarUrl(newUrl);
    router.refresh();
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Avatar section */}
      <section className="border border-neutral-200 bg-white p-6">
        <h2 className="text-[16px] font-medium text-neutral-900 mb-6">
          Foto de perfil
        </h2>
        <AvatarUpload
          currentAvatarUrl={avatarUrl}
          userName={profile.full_name}
          userEmail={profile.email}
          onAvatarChange={handleAvatarChange}
        />
      </section>

      {/* Personal info section */}
      <section className="border border-neutral-200 bg-white p-6">
        <h2 className="text-[16px] font-medium text-neutral-900 mb-6">
          Información personal
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
              Nombre completo
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-3 py-2.5 border border-neutral-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={!hasNameChanged || isSaving}
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 text-[14px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </section>

      {/* Email section */}
      <section className="border border-neutral-200 bg-white p-6">
        <h2 className="text-[16px] font-medium text-neutral-900 mb-1">
          Email
        </h2>
        <p className="text-[13px] text-neutral-500 mb-6">
          Se enviará un enlace de verificación a tu nuevo email.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-neutral-700 mb-1.5">
              Dirección de email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full pl-10 pr-3 py-2.5 border border-neutral-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleChangeEmail}
            disabled={!hasEmailChanged || !email || isChangingEmail}
            className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 text-[14px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChangingEmail ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Cambiar email"
            )}
          </button>
        </div>
      </section>

      {/* Account info section */}
      <section className="border border-neutral-200 bg-white p-6">
        <h2 className="text-[16px] font-medium text-neutral-900 mb-6">
          Información de la cuenta
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[14px]">
            <Calendar className="h-4 w-4 text-neutral-400" />
            <span className="text-neutral-600">Cuenta creada:</span>
            <span className="text-neutral-900 font-medium">
              {format(new Date(profile.created_at), "d MMMM yyyy", {
                locale: es,
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="border border-red-200 bg-red-50/50 p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-[16px] font-medium text-red-900">
              Zona de peligro
            </h2>
            <p className="text-[13px] text-red-700 mt-1">
              Estas acciones son irreversibles. Procede con precaución.
            </p>
          </div>
        </div>

        <DeleteAccountDialog
          trigger={
            <button className="inline-flex items-center gap-2 border border-red-300 hover:bg-red-100 text-red-700 px-4 py-2 text-[14px] font-medium transition-all">
              Eliminar mi cuenta
            </button>
          }
        />
      </section>
    </div>
  );
}
