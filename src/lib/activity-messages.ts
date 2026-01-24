// Activity messages for live toast notifications
// Locations focused on Canary Islands

export const locations = [
  "Las Palmas",
  "Santa Cruz de Tenerife",
  "Adeje",
  "Puerto de la Cruz",
  "Maspalomas",
  "Los Realejos",
  "Arrecife",
  "Corralejo",
  "La Laguna",
  "San Bartolomé de Tirajana",
  "Costa Adeje",
  "Playa del Inglés",
  "Puerto del Carmen",
  "Los Cristianos",
  "Telde",
  "Arona",
  "Granadilla",
  "La Orotava",
  "Icod de los Vinos",
  "Gáldar",
];

export const actions = [
  { text: "acaba de transformar un salón", emoji: "living_room" },
  { text: "ha renovado un dormitorio", emoji: "bedroom" },
  { text: "ha publicado en Idealista", emoji: "publish" },
  { text: "acaba de descargar en 4K", emoji: "download" },
  { text: "ha probado el estilo Nórdico", emoji: "style" },
  { text: "ha mejorado un apartamento", emoji: "apartment" },
  { text: "ha transformado una cocina", emoji: "kitchen" },
  { text: "está usando VISTTA Enhance", emoji: "enhance" },
  { text: "ha generado 5 imágenes", emoji: "multiple" },
  { text: "ha optimizado fotos para Airbnb", emoji: "airbnb" },
];

export const names = [
  "María G.",
  "Carlos R.",
  "Ana M.",
  "Pedro S.",
  "Laura T.",
  "Jorge L.",
  "Elena P.",
  "Miguel A.",
  "Carmen D.",
  "Antonio F.",
  "Isabel V.",
  "Francisco J.",
  "Lucia B.",
  "David H.",
  "Sara N.",
  "Pablo C.",
  "Marta E.",
  "Raúl O.",
  "Paula I.",
  "Sergio K.",
];

export function getRandomActivityMessage() {
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

export function getRandomInterval(min: number = 15000, max: number = 45000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
