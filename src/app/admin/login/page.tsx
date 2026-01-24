"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { loginAction } from "@/actions/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (!result.success) {
      setError(result.error || "Error al iniciar sesión");
      setIsLoading(false);
    }
    // If successful, the action will redirect
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-12 w-12 bg-neutral-900 border border-neutral-800 mb-6">
            <Lock className="h-5 w-5 text-neutral-400" />
          </div>
          <h1 className="text-[24px] font-medium text-white mb-2">
            Admin Vistta
          </h1>
          <p className="text-[14px] text-neutral-500">
            Accede al panel de administración
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[14px] px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-[13px] font-medium text-neutral-400 mb-2">
              Usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full h-11 px-4 bg-neutral-900 border border-neutral-800 text-white text-[14px] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 transition-colors"
              placeholder="Nombre de usuario"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[13px] font-medium text-neutral-400 mb-2">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full h-11 px-4 bg-neutral-900 border border-neutral-800 text-white text-[14px] placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-white hover:bg-neutral-100 text-neutral-900 text-[14px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Accediendo...
              </>
            ) : (
              "Acceder"
            )}
          </button>
        </form>

        <p className="text-center text-[13px] text-neutral-600 mt-8">
          Panel de administración restringido
        </p>
      </div>
    </div>
  );
}
