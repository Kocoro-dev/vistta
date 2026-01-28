"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail, ArrowLeft, CheckCircle2, User, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

type ViewState = "form" | "email-sent";

interface FieldErrors {
  fullName?: string;
  email?: string;
  terms?: string;
}

export default function RegistroPage() {
  const [isLoading, setIsLoading] = useState<"google" | "email" | null>(null);
  const [view, setView] = useState<ViewState>("form");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (field: string, value: string | boolean): string | undefined => {
    switch (field) {
      case "fullName":
        if (!String(value).trim()) return "Introduce tu nombre";
        return undefined;
      case "email":
        if (!value) return "Introduce tu email";
        if (!emailRegex.test(String(value))) return "Email no válido";
        return undefined;
      case "terms":
        if (!value) return "Debes aceptar los términos";
        return undefined;
      default:
        return undefined;
    }
  };

  const handleFieldChange = (field: keyof FieldErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleOAuthLogin = async (provider: "google") => {
    // For Google registration, only terms are required (name comes from Google)
    const termsError = validateField("terms", acceptedTerms);
    if (termsError) {
      setErrors((prev) => ({ ...prev, terms: termsError }));
      setTouched((prev) => ({ ...prev, terms: true }));
      toast.error("Debes aceptar los términos y la política de privacidad");
      return;
    }

    setIsLoading(provider);
    try {
      // Mark as pending registration for analytics tracking
      localStorage.setItem("vistta_pending_registration", "true");

      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      });
    } catch (error) {
      console.error("OAuth error:", error);
      localStorage.removeItem("vistta_pending_registration");
      setIsLoading(null);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: FieldErrors = {
      fullName: validateField("fullName", fullName),
      email: validateField("email", email),
      terms: validateField("terms", acceptedTerms),
    };

    setErrors(newErrors);
    setTouched({ fullName: true, email: true, terms: true });

    const hasErrors = newErrors.fullName || newErrors.email || newErrors.terms;
    if (hasErrors) {
      const firstError = newErrors.fullName || newErrors.email || newErrors.terms;
      if (firstError) {
        toast.error(firstError);
      }
      return;
    }

    setIsLoading("email");

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (!error) {
        // Mark as pending registration for analytics tracking
        localStorage.setItem("vistta_pending_registration", "true");
      }

      if (error) {
        if (error.message.includes("rate limit")) {
          toast.error("Has solicitado demasiados enlaces. Espera unos minutos.");
        } else {
          toast.error(error.message);
        }
      } else {
        setView("email-sent");
      }
    } catch (error) {
      console.error("Magic link error:", error);
      toast.error("Ha ocurrido un error. Inténtalo de nuevo.");
    } finally {
      setIsLoading(null);
    }
  };

  const handleBack = () => {
    setView("form");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '64px 64px'
          }} />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-block">
            <img src="/logo-blanco-Vistta.svg" alt="Vistta" className="h-5" />
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-medium text-display leading-[0.95] mb-6">
            Transforma satisfacción con IA
          </h1>
          <p className="text-[17px] text-neutral-400 leading-relaxed">
            Virtual staging profesional para agentes inmobiliarios y gestores de propiedades.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-[13px] text-neutral-600">
            © {new Date().getFullYear()} Vistta
          </p>
        </div>
      </div>

      {/* Right panel - Registration form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden mb-12 block">
            <img src="/logo-negro-Vistta.svg" alt="Vistta" className="h-5" />
          </Link>

          {view === "form" ? (
            <>
              <div className="mb-8">
                <span className="text-label text-neutral-400 mb-4 block">
                  Registro
                </span>
                <h2 className="text-[28px] font-medium text-neutral-900 text-editorial leading-[1.1]">
                  Crea tu cuenta gratis
                </h2>
                <p className="text-[15px] text-neutral-500 mt-3">
                  Empieza a transformar tus propiedades con IA en minutos.
                </p>
              </div>

              {/* Magic Link Form */}
              <form onSubmit={handleMagicLink} className="space-y-4 mb-6">
                <div>
                  <label
                    htmlFor="fullName"
                    className={`block text-[13px] font-medium mb-2 transition-colors ${
                      errors.fullName && touched.fullName ? "text-red-600" : "text-neutral-700"
                    }`}
                  >
                    Nombre completo
                  </label>
                  <div className="relative">
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        handleFieldChange("fullName");
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, fullName: true }));
                        const error = validateField("fullName", fullName);
                        if (error) setErrors((prev) => ({ ...prev, fullName: error }));
                      }}
                      placeholder="María García"
                      className={`w-full h-12 px-4 pl-11 border outline-none transition-all text-[14px] placeholder:text-neutral-400 ${
                        errors.fullName && touched.fullName
                          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/30"
                          : "border-neutral-200 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
                      }`}
                      disabled={isLoading !== null}
                      autoFocus
                      aria-invalid={errors.fullName && touched.fullName ? "true" : "false"}
                      aria-describedby={errors.fullName ? "fullName-error" : undefined}
                    />
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                      errors.fullName && touched.fullName ? "text-red-400" : "text-neutral-400"
                    }`} />
                    {errors.fullName && touched.fullName && (
                      <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors.fullName && touched.fullName && (
                    <p id="fullName-error" className="mt-1.5 text-[12px] text-red-600 flex items-center gap-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className={`block text-[13px] font-medium mb-2 transition-colors ${
                      errors.email && touched.email ? "text-red-600" : "text-neutral-700"
                    }`}
                  >
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        handleFieldChange("email");
                      }}
                      onBlur={() => {
                        setTouched((prev) => ({ ...prev, email: true }));
                        const error = validateField("email", email);
                        if (error) setErrors((prev) => ({ ...prev, email: error }));
                      }}
                      placeholder="tu@email.com"
                      className={`w-full h-12 px-4 pl-11 border outline-none transition-all text-[14px] placeholder:text-neutral-400 ${
                        errors.email && touched.email
                          ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100 bg-red-50/30"
                          : "border-neutral-200 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-100"
                      }`}
                      disabled={isLoading !== null}
                      aria-invalid={errors.email && touched.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                      errors.email && touched.email ? "text-red-400" : "text-neutral-400"
                    }`} />
                    {errors.email && touched.email && (
                      <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                    )}
                  </div>
                  {errors.email && touched.email && (
                    <p id="email-error" className="mt-1.5 text-[12px] text-red-600 flex items-center gap-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div>
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={acceptedTerms}
                      aria-invalid={errors.terms && touched.terms ? "true" : "false"}
                      onClick={() => {
                        setAcceptedTerms(!acceptedTerms);
                        if (errors.terms) {
                          setErrors((prev) => ({ ...prev, terms: undefined }));
                        }
                      }}
                      className={`mt-0.5 flex-shrink-0 h-5 w-5 border rounded transition-all flex items-center justify-center ${
                        acceptedTerms
                          ? "bg-neutral-900 border-neutral-900"
                          : errors.terms && touched.terms
                          ? "border-red-400 bg-red-50/50"
                          : "border-neutral-300 hover:border-neutral-400"
                      }`}
                      disabled={isLoading !== null}
                    >
                      {acceptedTerms && <Check className="h-3 w-3 text-white" />}
                    </button>
                    <label className={`text-[13px] leading-relaxed transition-colors ${
                      errors.terms && touched.terms ? "text-red-600" : "text-neutral-600"
                    }`}>
                      He leído y acepto los{" "}
                      <Link href="/terminos" target="_blank" className="text-neutral-900 hover:underline font-medium">
                        términos de servicio
                      </Link>{" "}
                      y la{" "}
                      <Link href="/privacidad" target="_blank" className="text-neutral-900 hover:underline font-medium">
                        política de privacidad
                      </Link>
                    </label>
                  </div>
                  {errors.terms && touched.terms && (
                    <p className="mt-1.5 text-[12px] text-red-600 flex items-center gap-1 ml-8">
                      {errors.terms}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading !== null}
                  className="w-full flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white h-12 text-[14px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === "email" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : null}
                  Crear cuenta
                </button>
              </form>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200" />
                </div>
                <div className="relative flex justify-center text-[12px]">
                  <span className="bg-white px-4 text-neutral-400">o regístrate con</span>
                </div>
              </div>

              {/* OAuth buttons */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={() => handleOAuthLogin("google")}
                  disabled={isLoading !== null}
                  className="w-full flex items-center justify-center gap-3 border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 h-12 text-[14px] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading === "google" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <GoogleIcon className="h-4 w-4" />
                  )}
                  Continuar con Google
                </button>
              </div>

              {/* Login link */}
              <p className="text-center text-[14px] text-neutral-500">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-neutral-900 hover:underline font-medium">
                  Accede a tu dashboard
                </Link>
              </p>
            </>
          ) : (
            /* Email Sent View */
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>

              <h2 className="text-[24px] font-medium text-neutral-900 text-editorial leading-[1.1] mb-3">
                ¡Revisa tu email, {fullName.split(" ")[0]}!
              </h2>

              <p className="text-[15px] text-neutral-500 mb-2">
                Hemos enviado un enlace mágico a:
              </p>

              <p className="text-[15px] font-medium text-neutral-900 mb-6">
                {email}
              </p>

              <div className="bg-neutral-50 border border-neutral-200 p-4 mb-8 text-left">
                <p className="text-[13px] text-neutral-600 leading-relaxed">
                  Haz clic en el enlace del email para acceder a tu cuenta. El enlace expira en 1 hora.
                </p>
              </div>

              <p className="text-[13px] text-neutral-500 mb-4">
                ¿No ves el email? Revisa tu carpeta de spam.
              </p>

              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-[14px] font-medium text-neutral-700 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al formulario
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="currentColor"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="currentColor"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="currentColor"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="currentColor"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
