"use client";

import { useState, useRef } from "react";
import { uploadAvatar } from "@/actions/profile";
import { UserAvatar } from "@/components/user-avatar";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";

interface AvatarUploadProps {
  currentAvatarUrl: string | null;
  userName: string | null;
  userEmail: string | null;
  onAvatarChange?: (newUrl: string) => void;
}

export function AvatarUpload({
  currentAvatarUrl,
  userName,
  userEmail,
  onAvatarChange,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAvatar(formData);

      if (result.error) {
        toast.error(result.error);
        setPreviewUrl(null);
      } else if (result.success && result.avatarUrl) {
        toast.success("Avatar actualizado");
        onAvatarChange?.(result.avatarUrl);
      }
    } catch (error) {
      toast.error("Error al subir el avatar");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <UserAvatar
          src={displayUrl}
          name={userName}
          email={userEmail}
          size="lg"
        />
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="absolute inset-0 flex items-center justify-center bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 text-white animate-spin" />
          ) : (
            <Camera className="h-6 w-6 text-white" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      <div>
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="text-[14px] font-medium text-neutral-900 hover:text-neutral-700 transition-colors disabled:opacity-50"
        >
          {isUploading ? "Subiendo..." : "Cambiar foto"}
        </button>
        <p className="text-[13px] text-neutral-500 mt-1">
          JPG, PNG o WebP. Máx 5MB.
        </p>
      </div>
    </div>
  );
}
