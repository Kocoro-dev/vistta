import { getPageContent, LandingContent } from "@/lib/content";
import { LandingPage } from "@/components/landing/landing-page";

export const dynamic = "force-dynamic";

// Default content fallback
const defaultContent: LandingContent = {
  hero: {
    label: "Virtual Home Staging",
    title_line1: "Transforma espacios.",
    title_line2: "Vende visiones.",
    description: "Tecnología de inteligencia artificial para rediseñar propiedades en segundos. Ideal para Idealista, Airbnb y Fotocasa.",
    cta_primary: "Probar gratis",
    cta_secondary: "Ver demo",
    slider_before_image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    slider_after_image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
  },
  trust: {
    label: "Publican en",
    logos: ["idealista", "Airbnb", "fotocasa", "Booking"],
  },
  problem: {
    label: "El problema",
    title: "Propiedades con potencial que pasan desapercibidas",
    description: "Muebles antiguos, espacios vacíos o decoración desactualizada. Los compradores no pueden imaginar el potencial.",
    cards: [
      { number: "01", title: "Staging físico prohibitivo", description: "Más de 2.000€ y semanas de trabajo. Logística imposible en muchas zonas." },
      { number: "02", title: "Fotos que no venden", description: "Sin staging, las propiedades reciben hasta un 40% menos de visitas." },
    ],
    solution: {
      label: "Solución",
      title: "VISTTA digitaliza la reforma",
      description: "Muestra el potencial sin mover un ladrillo. Resultados en segundos, no semanas.",
    },
  },
  steps: {
    label: "Proceso",
    title_line1: "Tres pasos.",
    title_line2: "Menos de un minuto.",
    steps: [
      { number: "01", title: "Sube tu foto", description: "Arrastra cualquier imagen desde tu móvil o ordenador. No necesitas fotógrafo profesional." },
      { number: "02", title: "Elige el estilo", description: "Nórdico, minimalista, moderno... La IA respeta la estructura del espacio." },
      { number: "03", title: "Descarga y publica", description: "En segundos tienes un render fotorrealista listo para tu anuncio." },
    ],
  },
  styles: {
    label: "Estilos",
    title: "Diseños que conectan con compradores",
    description: "Cada estilo está optimizado para el mercado español. Tendencias actuales que generan más visitas y cierres.",
    styles: [
      { id: "nordic", name: "Nórdico", description: "Limpio y funcional. Ideal para el comprador europeo.", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80" },
      { id: "boho", name: "Boho-Chic", description: "Cálido y acogedor. Perfecto para Airbnb.", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80" },
      { id: "minimal", name: "Minimalista", description: "Espacioso y moderno. Para pisos urbanos.", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80" },
    ],
  },
  testimonial: {
    label: "Testimonios",
    quote: "Antes tardaba días en preparar un piso para las fotos. Ahora subo las fotos y en minutos tengo el anuncio con una decoración increíble.",
    highlight: " Mis reservas subieron un 30%.",
    author_name: "Carlos M.",
    author_role: "Gestor de propiedades · Adeje",
    author_image: "",
  },
  pricing: {
    label: "Precios",
    title: "Inversión que se paga sola",
    plans: [
      {
        name: "Ocasional",
        price: "19€",
        period: "",
        description: "Pack de 10 imágenes · ~1.90€ por transformación",
        features: ["Todos los estilos", "Sin marcas de agua", "Calidad 4K", "Soporte por email"],
        cta: "Comprar pack",
        highlighted: false,
      },
      {
        name: "Agencia",
        price: "49€",
        period: "/mes",
        description: "Imágenes ilimitadas · Cancela cuando quieras",
        features: ["Todo del plan Ocasional", "Sin límite de imágenes", "Soporte prioritario", "Facturación automática"],
        cta: "Empezar ahora",
        highlighted: true,
        badge: "Popular",
      },
    ],
  },
  faq: {
    label: "FAQ",
    title: "Preguntas frecuentes",
    items: [
      { question: "¿Es legal usar estas fotos en Idealista/Airbnb?", answer: "Sí, siempre que indiques que es una \"Recreación Virtual\" o \"Propuesta de Decoración\". VISTTA incluye una pequeña marca de agua opcional que dice \"Virtual Staging\" para que seas transparente con los compradores." },
      { question: "¿La IA cambia la estructura de la casa?", answer: "No. Nuestra tecnología respeta las paredes, ventanas, suelos y techos. Solo cambiamos el mobiliario y la decoración. El comprador reconocerá el espacio al visitarlo." },
      { question: "¿Qué calidad tienen las imágenes?", answer: "Las imágenes se generan en alta resolución (hasta 4K) con calidad fotorrealista. Son perfectas para publicar en portales inmobiliarios o redes sociales." },
      { question: "¿Cuánto tiempo tarda en generarse?", answer: "Normalmente entre 10 y 20 segundos. Sube tu foto, elige el estilo, y en menos de medio minuto tienes tu render listo para publicar." },
      { question: "¿Cómo funciona la facturación?", answer: "Utilizamos una pasarela de pago segura que emite facturas válidas para tu contabilidad. Puedes cancelar tu suscripción en cualquier momento." },
    ],
  },
  cta: {
    title_line1: "Transforma tu primera",
    title_line2: "propiedad gratis",
    description: "Sin tarjeta de crédito. Sin compromiso. Resultados en segundos.",
    cta: "Comenzar ahora",
  },
  footer: {
    brand_description: "Virtual staging con inteligencia artificial para el mercado inmobiliario.",
    columns: [
      { title: "Producto", links: [{ label: "Comenzar", href: "/login" }, { label: "Precios", href: "#" }, { label: "FAQ", href: "#" }] },
      { title: "Cobertura", links: [{ label: "Home Staging Tenerife", href: "#" }, { label: "Home Staging Gran Canaria", href: "#" }, { label: "Decoración Virtual", href: "#" }] },
      { title: "Legal", links: [{ label: "Términos", href: "#" }, { label: "Privacidad", href: "#" }] },
    ],
    copyright: "VISTTA · Hecho en Canarias",
  },
};

export default async function HomePage() {
  // Fetch content from database
  const dbContent = await getPageContent<Partial<LandingContent>>("landing");

  // Merge with defaults
  const content: LandingContent = {
    hero: { ...defaultContent.hero, ...(dbContent.hero || {}) },
    trust: { ...defaultContent.trust, ...(dbContent.trust || {}) },
    problem: { ...defaultContent.problem, ...(dbContent.problem || {}) },
    steps: { ...defaultContent.steps, ...(dbContent.steps || {}) },
    styles: { ...defaultContent.styles, ...(dbContent.styles || {}) },
    testimonial: { ...defaultContent.testimonial, ...(dbContent.testimonial || {}) },
    pricing: { ...defaultContent.pricing, ...(dbContent.pricing || {}) },
    faq: { ...defaultContent.faq, ...(dbContent.faq || {}) },
    cta: { ...defaultContent.cta, ...(dbContent.cta || {}) },
    footer: { ...defaultContent.footer, ...(dbContent.footer || {}) },
  };

  return <LandingPage content={content} />;
}
