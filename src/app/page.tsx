import { getPageContent, LandingContent } from "@/lib/content";
import { LandingPage } from "@/components/landing/landing-page";

export const dynamic = "force-dynamic";

// Default content fallback with new Linear-style structure
const defaultContent: LandingContent = {
  hero: {
    label: "Virtual Home Staging",
    title_line1: "Home Staging virtual",
    title_line2: "de Alta Fidelidad. En segundos.",
    description: "Saca el máximo partido a tus inmuebles con IA. Transforma espacios vacíos o anticuados en renders fotorrealistas que venden más rápido y a mejor precio.",
    cta_primary: "Probar gratis",
    cta_secondary: "Ver demo",
    slider_before_image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    slider_after_image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
  },
  heroBadge: {
    text: "#1 Home Staging AI Solution",
  },
  facePile: {
    count: "Más de 500 agencias",
    suffix: "y propietarios se han unido en {year}",
  },
  trust: {
    label: "Publican en",
    logos: ["idealista", "Airbnb", "fotocasa", "Booking"],
  },
  fork: {
    cards: [
      {
        id: "enhance",
        title: "VISTTA Enhance",
        target: "Alquiler Vacacional",
        tagline: "Mejora la luz, elimina el desorden, mantén la verdad",
        description: "Optimiza tus fotos actuales sin cambiar la realidad. Perfecto para alquileres donde el huésped verá exactamente lo que reserva.",
        before_image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
        after_image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        cta: "Probar Enhance",
      },
      {
        id: "vision",
        title: "VISTTA Vision",
        target: "Venta Inmobiliaria",
        tagline: "Amuebla espacios vacíos. Vende el potencial",
        description: "Transforma espacios vacíos o anticuados en renders con decoración moderna. Ayuda al comprador a visualizar su futuro hogar.",
        before_image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
        after_image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
        cta: "Probar Vision",
      },
    ],
  },
  bento: {
    label: "Tecnología + Confianza",
    title: "Por qué las agencias eligen VISTTA",
    items: [
      {
        id: "privacy",
        icon: "shield",
        title: "Privacidad Total",
        description: "Tus fotos son tuyas. Procesamiento seguro y privado. No entrenamos IA con tus imágenes.",
      },
      {
        id: "speed",
        icon: "zap",
        title: "Velocidad Extrema",
        description: "De 0 a Wow en 10 segundos. Nuestra infraestructura GPU procesa en tiempo real.",
      },
      {
        id: "easy",
        icon: "mouse",
        title: "Sin Curva de Aprendizaje",
        description: "Si sabes arrastrar un archivo, sabes usar VISTTA. Interfaz diseñada para agentes, no para diseñadores.",
      },
      {
        id: "ai",
        icon: "sparkles",
        title: "IA de Vanguardia",
        description: "La mejor tecnología generativa del mercado. Actualizamos modelos constantemente para máxima calidad.",
      },
    ],
  },
  stats: {
    label: "Resultados medibles",
    items: [
      { value: "+40%", label: "en Clics (CTR) en portales inmobiliarios", trend: "up" },
      { value: "+26%", label: "en Precio Medio Diario en reservas", trend: "up" },
      { value: "-30%", label: "en Tiempo de venta de propiedades", trend: "down" },
    ],
    copy: "No es magia, es ROI. Las fotos profesionales venden más caro y más rápido. Datos basados en estudios del sector.",
  },
  styles: {
    label: "Estilos",
    title: "Diseños que conectan con compradores",
    description: "Cada estilo está optimizado para el mercado español. Tendencias actuales que generan más visitas y cierres.",
    styles: [
      { id: "modern", name: "Moderno", description: "Líneas limpias y acabados contemporáneos. El favorito del mercado premium.", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80" },
      { id: "nordic", name: "Nórdico", description: "Funcionalidad escandinava. Maderas claras, textiles naturales, luz difusa.", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80" },
      { id: "industrial", name: "Industrial", description: "Ladrillo visto, metal negro, hormigón pulido. Para lofts y espacios diáfanos.", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80" },
      { id: "mediterranean", name: "Mediterráneo", description: "Blancos cálidos, tonos tierra, cerámica artesanal. Perfecto para costa y zonas turísticas.", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80" },
    ],
  },
  socialProof: {
    quote: "Antes tardaba días en preparar un piso para las fotos. Ahora subo las fotos y en minutos tengo el anuncio con una decoración increíble. Mis reservas subieron un 30%.",
    author_name: "Carlos M.",
    author_role: "Gestor de propiedades · Adeje",
    author_image: "",
    stats_title: "Comunidad creciente",
    stats_count: "500+",
    stats_trend: "+47% este mes",
  },
  pricing: {
    label: "Precios",
    title: "Inversión que se paga sola",
    plans: [
      {
        name: "Pack Ocasional",
        price: "19€",
        period: "",
        description: "Pack de 10 créditos · Sin caducidad",
        features: [
          "VISTTA Enhance + Vision",
          "Todos los estilos disponibles",
          "Resolución 4K",
          "Sin marcas de agua",
          "Soporte por email",
        ],
        cta: "Comprar pack",
        highlighted: false,
      },
      {
        name: "Plan Profesional",
        price: "59€",
        period: "/mes",
        description: "100 imágenes al mes · Cancela cuando quieras",
        features: [
          "Todo del pack Ocasional",
          "100 imágenes mensuales",
          "Prioridad GPU (más rápido)",
          "Soporte prioritario",
          "Facturación automática",
        ],
        cta: "Empezar ahora",
        highlighted: true,
        badge: "Recomendado",
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
      { question: "¿Cuál es la diferencia entre Enhance y Vision?", answer: "Enhance mejora fotos de espacios ya amueblados (mejor luz, sin desorden). Vision amuebla espacios vacíos. Ambos incluidos en todos los planes." },
    ],
  },
  cta: {
    title_line1: "Transforma tu primera",
    title_line2: "propiedad gratis",
    description: "Sin tarjeta de crédito. Sin compromiso. Resultados en segundos.",
    cta: "Comenzar ahora",
  },
  footer: {
    brand_description: "Virtual staging con inteligencia artificial para el mercado inmobiliario español.",
    columns: [
      { title: "Producto", links: [{ label: "Comenzar", href: "/login" }, { label: "Precios", href: "#pricing" }, { label: "FAQ", href: "#faq" }] },
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
    heroBadge: { ...defaultContent.heroBadge, ...(dbContent.heroBadge || {}) },
    facePile: { ...defaultContent.facePile, ...(dbContent.facePile || {}) },
    trust: { ...defaultContent.trust, ...(dbContent.trust || {}) },
    fork: { ...defaultContent.fork, ...(dbContent.fork || {}) },
    bento: { ...defaultContent.bento, ...(dbContent.bento || {}) },
    stats: { ...defaultContent.stats, ...(dbContent.stats || {}) },
    styles: { ...defaultContent.styles, ...(dbContent.styles || {}) },
    socialProof: { ...defaultContent.socialProof, ...(dbContent.socialProof || {}) },
    pricing: { ...defaultContent.pricing, ...(dbContent.pricing || {}) },
    faq: { ...defaultContent.faq, ...(dbContent.faq || {}) },
    cta: { ...defaultContent.cta, ...(dbContent.cta || {}) },
    footer: { ...defaultContent.footer, ...(dbContent.footer || {}) },
  };

  return <LandingPage content={content} />;
}
