/**
 * Social Proof Data - Vistta
 *
 * Este archivo contiene los datos para las notificaciones de actividad.
 * Modifica los arrays para personalizar los mensajes.
 *
 * IMPORTANTE: Este archivo se usa server-side para que los datos
 * no sean inspeccionables desde el navegador.
 */

// ===========================================
// NOMBRES (50 nombres españoles comunes)
// ===========================================
export const names = [
  // Mujeres
  "María G.",
  "Ana M.",
  "Laura T.",
  "Elena P.",
  "Carmen D.",
  "Isabel V.",
  "Lucía B.",
  "Sara N.",
  "Paula I.",
  "Marta E.",
  "Cristina R.",
  "Patricia H.",
  "Raquel S.",
  "Beatriz L.",
  "Silvia F.",
  "Nuria C.",
  "Rosa A.",
  "Alicia J.",
  "Eva M.",
  "Inés O.",
  "Sonia P.",
  "Teresa G.",
  "Mónica V.",
  "Clara R.",
  "Adriana T.",
  // Hombres
  "Carlos R.",
  "Pedro S.",
  "Jorge L.",
  "Miguel A.",
  "Antonio F.",
  "Francisco J.",
  "David H.",
  "Pablo C.",
  "Raúl O.",
  "Sergio K.",
  "Javier M.",
  "Alberto G.",
  "Alejandro P.",
  "Daniel S.",
  "Fernando R.",
  "Manuel L.",
  "José A.",
  "Andrés V.",
  "Roberto T.",
  "Ignacio B.",
  "Marcos D.",
  "Víctor N.",
  "Álvaro H.",
  "Diego F.",
  "Óscar C.",
];

// ===========================================
// LOCALIZACIONES (Localidad, Provincia)
// Zonas con alto turismo, alquiler vacacional
// y mercado inmobiliario activo en España
// ===========================================
export const locations = [
  // Canarias
  "Adeje, Tenerife",
  "Arona, Tenerife",
  "Puerto de la Cruz, Tenerife",
  "Santa Cruz, Tenerife",
  "La Laguna, Tenerife",
  "Los Cristianos, Tenerife",
  "Costa Adeje, Tenerife",
  "Granadilla, Tenerife",
  "Las Palmas, Gran Canaria",
  "Maspalomas, Gran Canaria",
  "Playa del Inglés, Gran Canaria",
  "San Bartolomé, Gran Canaria",
  "Puerto del Carmen, Lanzarote",
  "Corralejo, Fuerteventura",

  // Baleares
  "Palma, Mallorca",
  "Calvià, Mallorca",
  "Alcúdia, Mallorca",
  "Sóller, Mallorca",
  "Ibiza, Ibiza",
  "Santa Eulalia, Ibiza",
  "Sant Antoni, Ibiza",
  "Mahón, Menorca",
  "Ciutadella, Menorca",

  // Costa del Sol (Málaga)
  "Marbella, Málaga",
  "Málaga, Málaga",
  "Estepona, Málaga",
  "Fuengirola, Málaga",
  "Torremolinos, Málaga",
  "Benalmádena, Málaga",
  "Mijas, Málaga",
  "Nerja, Málaga",

  // Costa Blanca (Alicante)
  "Alicante, Alicante",
  "Benidorm, Alicante",
  "Dénia, Alicante",
  "Jávea, Alicante",
  "Altea, Alicante",
  "Calpe, Alicante",
  "Torrevieja, Alicante",
  "Orihuela Costa, Alicante",

  // Costa Brava (Girona)
  "Lloret de Mar, Girona",
  "Roses, Girona",
  "L'Escala, Girona",
  "Cadaqués, Girona",
  "Tossa de Mar, Girona",

  // Barcelona
  "Barcelona, Barcelona",
  "Sitges, Barcelona",
  "Castelldefels, Barcelona",
  "Gavà Mar, Barcelona",

  // Valencia
  "Valencia, Valencia",
  "Gandía, Valencia",
  "Cullera, Valencia",

  // Madrid
  "Madrid, Madrid",
  "Pozuelo, Madrid",
  "Las Rozas, Madrid",
  "Majadahonda, Madrid",
  "Alcobendas, Madrid",

  // País Vasco
  "San Sebastián, Guipúzcoa",
  "Bilbao, Vizcaya",
  "Getxo, Vizcaya",

  // Andalucía (otras zonas)
  "Sevilla, Sevilla",
  "Granada, Granada",
  "Cádiz, Cádiz",
  "Chiclana, Cádiz",
  "Conil, Cádiz",
  "Tarifa, Cádiz",
  "Almería, Almería",
  "Mojácar, Almería",
  "Roquetas de Mar, Almería",

  // Galicia
  "Sanxenxo, Pontevedra",
  "Vigo, Pontevedra",
  "A Coruña, A Coruña",

  // Asturias y Cantabria
  "Gijón, Asturias",
  "Oviedo, Asturias",
  "Santander, Cantabria",
  "Castro Urdiales, Cantabria",

  // Murcia
  "La Manga, Murcia",
  "Cartagena, Murcia",
  "Águilas, Murcia",
];

// ===========================================
// ACCIONES / MENSAJES
// ===========================================
export const actions = [
  // Acciones de transformación
  { text: "acaba de transformar un salón", emoji: "living_room" },
  { text: "ha renovado un dormitorio", emoji: "bedroom" },
  { text: "ha transformado una cocina", emoji: "kitchen" },
  { text: "ha rediseñado un baño", emoji: "bathroom" },
  { text: "ha amueblado un estudio", emoji: "studio" },
  { text: "ha decorado un ático", emoji: "penthouse" },

  // Acciones de publicación
  { text: "ha publicado en Idealista", emoji: "publish" },
  { text: "ha subido fotos a Fotocasa", emoji: "publish" },
  { text: "ha actualizado su anuncio", emoji: "update" },

  // Acciones de descarga
  { text: "acaba de descargar en HD", emoji: "download" },
  { text: "ha exportado 3 imágenes", emoji: "download" },

  // Acciones de estilo
  { text: "ha probado el estilo Moderno", emoji: "style" },
  { text: "ha usado el estilo Nórdico", emoji: "style" },
  { text: "ha elegido estilo Mediterráneo", emoji: "style" },

  // Acciones de Enhance
  { text: "ha mejorado fotos con Enhance", emoji: "enhance" },
  { text: "está usando Vistta Enhance", emoji: "enhance" },
  { text: "ha optimizado fotos para Airbnb", emoji: "airbnb" },
  { text: "ha mejorado su anuncio vacacional", emoji: "vacation" },

  // Acciones múltiples
  { text: "ha generado 5 diseños", emoji: "multiple" },
  { text: "ha creado 3 variaciones", emoji: "multiple" },
];

// ===========================================
// FUNCIÓN PARA GENERAR MENSAJE ALEATORIO
// (Server-side only)
// ===========================================
export function generateRandomActivity() {
  const name = names[Math.floor(Math.random() * names.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const timeAgo = Math.floor(Math.random() * 5) + 1;

  return {
    name,
    location,
    action: action.text,
    emoji: action.emoji,
    timeAgo: `hace ${timeAgo} min`,
  };
}
