import Link from "next/link";
import { ArrowRight, Sparkles, Upload, Palette, Download, Check, Play } from "lucide-react";
import { HeroSlider } from "@/components/landing/hero-slider";
import { StyleTabs } from "@/components/landing/style-tabs";
import { FAQ } from "@/components/landing/faq";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white antialiased">
      {/* Header - Glass morphism style */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="text-[22px] font-semibold tracking-tight text-gray-900">
            VISTTA
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[15px] text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-full hover:bg-gray-100 transition-all duration-200"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/login"
              className="bg-gradient-to-b from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white px-5 py-2.5 rounded-full text-[15px] font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Comenzar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-[140px] pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-50 to-orange-50 text-rose-600 px-4 py-2 rounded-full text-[13px] font-medium mb-8 border border-rose-100">
              <Sparkles className="h-3.5 w-3.5" />
              Home Staging Virtual con IA
            </div>

            {/* Main headline */}
            <h1 className="text-[52px] sm:text-[64px] lg:text-[72px] font-semibold text-gray-900 leading-[1.05] tracking-tight mb-6">
              Vende la visión,
              <br />
              <span className="bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent">
                no los muebles viejos.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-[19px] sm:text-[21px] text-gray-500 leading-relaxed max-w-2xl mx-auto mb-10 font-normal">
              Transforma cualquier espacio en segundos. Sube una foto y deja que
              la IA rediseñe tu propiedad para Idealista, Airbnb o Fotocasa.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2.5 bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white px-8 py-4 rounded-full text-[17px] font-semibold transition-all duration-300 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02]"
              >
                Probar gratis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <button className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 px-6 py-4 rounded-full text-[17px] font-medium hover:bg-gray-100 transition-all duration-200">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <Play className="h-4 w-4 ml-0.5" fill="currentColor" />
                </div>
                Ver demo
              </button>
            </div>

            <p className="text-[13px] text-gray-400 font-medium">
              Sin tarjeta de crédito · 5 imágenes gratis · Resultado en segundos
            </p>
          </div>

          {/* Hero Slider */}
          <div className="max-w-5xl mx-auto">
            <HeroSlider
              beforeImage="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"
              afterImage="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80"
            />
          </div>
        </div>
      </section>

      {/* Logos/Trust Section */}
      <section className="py-12 px-6 border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[13px] text-gray-400 font-medium uppercase tracking-wider mb-6">
            Perfecto para publicar en
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-50">
            <span className="text-2xl font-bold text-gray-400">idealista</span>
            <span className="text-2xl font-bold text-gray-400">Airbnb</span>
            <span className="text-2xl font-bold text-gray-400">fotocasa</span>
            <span className="text-2xl font-bold text-gray-400">Booking</span>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[40px] sm:text-[48px] font-semibold text-gray-900 leading-tight tracking-tight mb-4">
              El problema que resolvemos
            </h2>
            <p className="text-[19px] text-gray-500 max-w-xl mx-auto">
              Pisos con potencial que se pierden en el scroll infinito de los portales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Problem 1 */}
            <div className="group bg-gray-50 hover:bg-gray-100/80 rounded-3xl p-8 transition-all duration-300">
              <div className="text-4xl mb-6">🏚️</div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-3">
                El "piso de la abuela"
              </h3>
              <p className="text-[16px] text-gray-500 leading-relaxed">
                Buena ubicación, pero los muebles de los 90 espantan a compradores
                jóvenes e inquilinos extranjeros.
              </p>
            </div>

            {/* Problem 2 */}
            <div className="group bg-gray-50 hover:bg-gray-100/80 rounded-3xl p-8 transition-all duration-300">
              <div className="text-4xl mb-6">💸</div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-3">
                Staging físico imposible
              </h3>
              <p className="text-[16px] text-gray-500 leading-relaxed">
                Más de 2.000€ y semanas de trabajo. En las islas, la logística
                lo convierte en una pesadilla.
              </p>
            </div>

            {/* Solution */}
            <div className="group bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl p-8 text-white shadow-xl shadow-rose-500/20">
              <div className="text-4xl mb-6">✨</div>
              <h3 className="text-[20px] font-semibold mb-3">
                La solución VISTTA
              </h3>
              <p className="text-[16px] text-white/90 leading-relaxed">
                Digitaliza la reforma. Muestra el potencial sin mover un ladrillo.
                <span className="font-semibold text-white"> +40% más clics en tu anuncio.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[40px] sm:text-[48px] font-semibold text-gray-900 leading-tight tracking-tight mb-4">
              Así de simple
            </h2>
            <p className="text-[19px] text-gray-500">
              Tres pasos. Menos de un minuto.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="relative inline-block mb-8">
                <div className="h-24 w-24 rounded-3xl bg-white shadow-sm flex items-center justify-center mx-auto border border-gray-100">
                  <Upload className="h-10 w-10 text-gray-900" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gray-900 text-white text-[14px] font-semibold flex items-center justify-center">
                  1
                </div>
              </div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-3">
                Sube tu foto
              </h3>
              <p className="text-[16px] text-gray-500 leading-relaxed">
                Arrastra cualquier foto desde tu móvil. No necesitas fotógrafo profesional.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="relative inline-block mb-8">
                <div className="h-24 w-24 rounded-3xl bg-white shadow-sm flex items-center justify-center mx-auto border border-gray-100">
                  <Palette className="h-10 w-10 text-gray-900" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gray-900 text-white text-[14px] font-semibold flex items-center justify-center">
                  2
                </div>
              </div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-3">
                Elige el estilo
              </h3>
              <p className="text-[16px] text-gray-500 leading-relaxed">
                Nórdico, minimalista, lujo... La IA respeta paredes y ventanas.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="relative inline-block mb-8">
                <div className="h-24 w-24 rounded-3xl bg-white shadow-sm flex items-center justify-center mx-auto border border-gray-100">
                  <Download className="h-10 w-10 text-gray-900" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-gray-900 text-white text-[14px] font-semibold flex items-center justify-center">
                  3
                </div>
              </div>
              <h3 className="text-[20px] font-semibold text-gray-900 mb-3">
                Descarga y publica
              </h3>
              <p className="text-[16px] text-gray-500 leading-relaxed">
                En 15 segundos tienes un render fotorrealista listo para publicar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Styles Demo Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[40px] sm:text-[48px] font-semibold text-gray-900 leading-tight tracking-tight mb-4">
              Estilos que venden
            </h2>
            <p className="text-[19px] text-gray-500 max-w-xl mx-auto">
              Diseñados para el mercado local. Lo que buscan los compradores.
            </p>
          </div>

          <StyleTabs />
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[32px] p-10 md:p-14 shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-[24px] sm:text-[28px] text-gray-900 font-medium leading-relaxed mb-8">
              "Antes tardaba días en preparar un piso para las fotos. Ahora subo las fotos vacías y en 5 minutos tengo el anuncio con decoración increíble.
              <span className="text-rose-500"> Mis reservas subieron un 30%.</span>"
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-orange-400" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Carlos M.</p>
                <p className="text-[14px] text-gray-500">Gestor de propiedades · Adeje</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[40px] sm:text-[48px] font-semibold text-gray-900 leading-tight tracking-tight mb-4">
              Precios simples
            </h2>
            <p className="text-[19px] text-gray-500">
              Rentabilidad desde la primera foto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Plan Ocasional */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:border-gray-300 transition-colors">
              <div className="mb-6">
                <span className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">
                  Ocasional
                </span>
              </div>
              <div className="mb-2">
                <span className="text-[48px] font-semibold text-gray-900">19€</span>
              </div>
              <p className="text-[15px] text-gray-500 mb-8">
                Pack de 10 fotos · ~1.90€ por imagen
              </p>
              <ul className="space-y-4 mb-8">
                {["Todos los estilos", "Sin marcas de agua", "Calidad 4K", "Soporte por email"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-gray-600">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-2xl font-semibold text-[15px] transition-colors"
              >
                Comprar pack
              </Link>
            </div>

            {/* Plan Agencia */}
            <div className="bg-gray-900 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-6 right-6 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Popular
              </div>
              <div className="mb-6">
                <span className="text-[13px] font-semibold text-gray-400 uppercase tracking-wider">
                  Agencia
                </span>
              </div>
              <div className="mb-2">
                <span className="text-[48px] font-semibold text-white">49€</span>
                <span className="text-[16px] text-gray-400 ml-1">/mes</span>
              </div>
              <p className="text-[15px] text-gray-400 mb-8">
                Fotos ilimitadas · Cancela cuando quieras
              </p>
              <ul className="space-y-4 mb-8">
                {["Todo del plan Ocasional", "Fotos ilimitadas", "Soporte prioritario", "Factura automática"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-gray-300">
                    <Check className="h-5 w-5 text-rose-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block w-full text-center bg-white hover:bg-gray-100 text-gray-900 py-3.5 rounded-2xl font-semibold text-[15px] transition-colors"
              >
                Empezar ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[40px] sm:text-[48px] font-semibold text-gray-900 leading-tight tracking-tight mb-4">
              Preguntas frecuentes
            </h2>
          </div>

          <FAQ />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[40px] sm:text-[52px] font-semibold text-gray-900 leading-tight tracking-tight mb-6">
            ¿Listo para transformar<br />tus propiedades?
          </h2>
          <p className="text-[19px] text-gray-500 mb-10 max-w-xl mx-auto">
            Únete a los profesionales que ya venden más rápido con VISTTA.
          </p>
          <Link
            href="/login"
            className="group inline-flex items-center gap-2.5 bg-gradient-to-b from-gray-900 to-black hover:from-gray-800 hover:to-gray-900 text-white px-8 py-4 rounded-full text-[17px] font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            Empezar gratis
            <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <span className="text-[20px] font-semibold text-gray-900 tracking-tight">
                VISTTA
              </span>
              <p className="text-[14px] text-gray-500 mt-3 leading-relaxed">
                Home Staging Virtual con IA para el mercado inmobiliario.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-[14px]">Producto</h4>
              <ul className="space-y-3 text-[14px]">
                <li><Link href="/login" className="text-gray-500 hover:text-gray-900 transition-colors">Comenzar</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Precios</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-[14px]">Cobertura</h4>
              <ul className="space-y-3 text-[14px]">
                <li><Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Home Staging Tenerife</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Home Staging Gran Canaria</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Decoración Virtual</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 text-[14px]">Legal</h4>
              <ul className="space-y-3 text-[14px]">
                <li><Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Términos de Servicio</Link></li>
                <li><Link href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Política de Privacidad</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-[13px] text-gray-400">
            <p>Hecho con cariño en Canarias · © {new Date().getFullYear()} VISTTA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
