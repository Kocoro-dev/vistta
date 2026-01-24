import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vistta | Transformación Visual Inmobiliaria",
  description:
    "Transforma espacios con inteligencia artificial. Redecora y renueva habitaciones virtualmente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
