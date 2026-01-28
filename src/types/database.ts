export type GenerationStatus = "pending" | "processing" | "completed" | "failed";
export type GenerationModule = "enhance" | "vision";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PlanType = "ocasional" | "agencia";
export type SubscriptionStatus = "free" | "active" | "cancelled" | "past_due";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  onboarding_completed: boolean;
  has_purchased: boolean;
  subscription_status: SubscriptionStatus;
  subscription_plan: PlanType | null;
  subscription_expires_at: string | null;
  stripe_customer_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  plan_type: PlanType;
  status: PaymentStatus;
  stripe_session_id: string | null;
  invoice_url: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface Generation {
  id: string;
  user_id: string;
  original_image_url: string;
  original_image_path: string;
  generated_image_url: string | null;
  generated_image_path: string | null;
  prompt: string | null;
  style: string;
  module: GenerationModule;
  has_watermark: boolean;
  replicate_prediction_id: string | null;
  status: GenerationStatus;
  error_message: string | null;
  project_id: string | null;
  created_at: string;
  completed_at: string | null;
}

export type GenerationInsert = {
  user_id: string;
  original_image_url: string;
  original_image_path: string;
  generated_image_url?: string | null;
  generated_image_path?: string | null;
  prompt?: string | null;
  style: string;
  module?: GenerationModule;
  has_watermark?: boolean;
  replicate_prediction_id?: string | null;
  status?: GenerationStatus;
  error_message?: string | null;
  project_id?: string | null;
};

export type GenerationUpdate = Partial<Omit<Generation, "id" | "user_id" | "created_at">>;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at" | "credits" | "onboarding_completed" | "has_purchased" | "subscription_status" | "subscription_plan" | "subscription_expires_at" | "stripe_customer_id"> & {
          credits?: number;
          onboarding_completed?: boolean;
          has_purchased?: boolean;
          subscription_status?: SubscriptionStatus;
          subscription_plan?: PlanType | null;
          subscription_expires_at?: string | null;
          stripe_customer_id?: string | null;
        };
        Update: Partial<Omit<Profile, "id">>;
      };
      generations: {
        Row: Generation;
        Insert: GenerationInsert;
        Update: GenerationUpdate;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Project, "id" | "user_id" | "created_at">>;
      };
      payments: {
        Row: Payment;
        Insert: Omit<Payment, "id" | "created_at">;
        Update: Partial<Omit<Payment, "id" | "user_id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      generation_status: GenerationStatus;
      generation_module: GenerationModule;
      payment_status: PaymentStatus;
      plan_type: PlanType;
    };
  };
}

export type StylePreset = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  prompt: string;
  atmosphere: string;
  thumbnail?: string;
  examplesCount?: number;
};

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "modern",
    name: "Moderno",
    nameEn: "Contemporary Modern Luxury",
    description: "Sofisticación Urbana. Lujo contemporáneo con siluetas limpias y acabados de alta gama.",
    prompt: `Style: Contemporary Modern Luxury.
Furniture: Low-profile Italian design furniture, sleek silhouettes, clean geometric lines.
Materials: Polished marble coffee tables, velvet or high-quality fabric sofas, matte black metal accents, walnut wood details, glass elements.
Palette: Greige (gray+beige), charcoal, warm white, occasional gold or brass accents.`,
    atmosphere: "Sophisticated, expensive, uncluttered, gallery-like. Recessed lighting ambiance with dramatic but soft contrasts. Every piece feels intentional and curated.",
    examplesCount: 4,
  },
  {
    id: "minimalist",
    name: "Minimalista",
    nameEn: "Warm Minimalism",
    description: "Serenidad Orgánica. Espacios despejados estilo Japandi con tonos neutros y texturas cálidas.",
    prompt: `Style: Warm Minimalism (Japandi fusion).
Furniture: Curvy organic shapes, low-height furniture, floating shelves, simple forms.
Materials: Microcement or textured plaster wall effects, light oak wood, bouclé fabric (textured wool), linen curtains, travertine stone accents.
Palette: Monochrome beige, cream, off-white, soft clay tones, sand.`,
    atmosphere: "Zen, serene, organic, spa-like. Soft diffused daylight, no harsh shadows. Less is more - every object has purpose and breathing room around it.",
    examplesCount: 4,
  },
  {
    id: "industrial",
    name: "Industrial",
    nameEn: "Refined Urban Industrial",
    description: "Carácter Loft. Estética neoyorquina refinada con estructuras vistas y cueros.",
    prompt: `Style: Refined Urban Industrial (NYC Loft).
Furniture: Chesterfield or leather sofas (cognac or distressed leather), heavy solid wood tables, metal frame furniture.
Materials: Exposed steel structures, iron fixtures, raw reclaimed wood, polished concrete textures, large Persian or faded vintage rugs to soften hardness.
Palette: Brick red, iron black, cognac brown, slate gray, aged brass.`,
    atmosphere: "Masculine, bold, character-rich, with history. Edison bulb pendant lights, warm tungsten glow, floor lamps with metal shades. Raw but refined.",
    examplesCount: 4,
  },
  {
    id: "scandinavian",
    name: "Nórdico",
    nameEn: "Timeless Scandinavian",
    description: "Confort Atemporal. Luminosidad, maderas claras y textiles suaves. Acogedor y funcional.",
    prompt: `Style: Timeless Scandinavian (Nordic).
Furniture: Functional clean lines, tapered legs, mid-century modern influence, ergonomic design.
Materials: Pale birch or pine wood, cotton textiles, wool throws and blankets, rattan accents, abundance of indoor green plants (Monstera, Ficus, trailing plants).
Palette: White dominance, soft gray, pastel accents (sage green or dusty pink), light natural wood tones.`,
    atmosphere: "Hygge, cozy, airy, inviting, family-friendly. Bright natural light flooding the space, paper lanterns or fabric pendant lights. Warm despite the light palette.",
    examplesCount: 4,
  },
  {
    id: "mediterranean",
    name: "Mediterráneo",
    nameEn: "Modern Organic Mediterranean",
    description: "Calma Costera. Esencia ibicenca con tonos tierra, paredes encaladas y fibras vegetales.",
    prompt: `Style: Modern Organic Mediterranean (Ibiza/Greek Island Style).
Furniture: Low seating, rustic wooden furniture, built-in masonry bench look (if contextually appropriate).
Materials: Jute and sisal rugs, raw linen textiles in natural tones, olive wood accents, terracotta pottery, dried palm leaves and pampas grass, irregular handmade ceramic vases.
Palette: Earthy tones - sand, terracotta, olive green, whitewashed surfaces, ocean blue accents.`,
    atmosphere: "Breezy, sun-drenched, relaxed, vacation vibe, slow living. Golden hour sunlight, warm and glowing. Feels like a boutique hotel on the coast.",
    examplesCount: 4,
  },
  {
    id: "boho",
    name: "Boho-Chic",
    nameEn: "Boho-Chic Eclectic",
    description: "Espíritu Viajero. Ecléctico y vibrante con capas de texturas, ratán y plantas.",
    prompt: `Style: Boho-Chic Eclectic (Bohemian).
Furniture: Rattan or wicker furniture (peacock chairs), low-profile sofas with abundance of throw pillows and cushions, leather poufs, hanging chairs or swing chairs.
Materials: Macramé wall hangings, layered rugs (Kilim or Persian over Jute), velvet accents, bamboo, abundance of indoor plants (hanging pothos, palms, succulents).
Palette: Warm earth tones, terracotta, deep forest green, mustard yellow, mixed patterns and textures.`,
    atmosphere: "Artistic, free-spirited, textured, traveler vibe, relaxed and collected over time. Warm string lights, woven basket pendant lamps, Moroccan lanterns. Curated chaos that feels personal.",
    examplesCount: 4,
  },
];

export type RoomType = {
  id: string;
  name: string;
  description: string;
  instruction: string;
};

export type LightingType = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  prompt: string;
};

export const LIGHTING_OPTIONS: LightingType[] = [
  {
    id: "natural",
    name: "Natural",
    nameEn: "Natural Daylight",
    description: "Luz del día realista entrando por ventanas",
    prompt: "natural daylight streaming through windows, realistic sun position, authentic shadows",
  },
  {
    id: "golden_hour",
    name: "Hora Dorada",
    nameEn: "Golden Hour",
    description: "Luz cálida de atardecer, tonos dorados",
    prompt: "warm golden hour lighting, soft amber tones, long shadows, sunset atmosphere",
  },
  {
    id: "soft_diffuse",
    name: "Difusa Suave",
    nameEn: "Soft Diffused",
    description: "Iluminación uniforme sin sombras duras",
    prompt: "soft diffused lighting, even illumination, minimal harsh shadows, overcast day feel",
  },
  {
    id: "bright_airy",
    name: "Luminoso/Aireado",
    nameEn: "Bright & Airy",
    description: "Máxima luminosidad, sensación espaciosa",
    prompt: "bright airy lighting, high key, maximized natural light, spacious feel",
  },
  {
    id: "warm_ambient",
    name: "Cálido Ambiental",
    nameEn: "Warm Ambient",
    description: "Ambiente acogedor con tonos cálidos",
    prompt: "warm ambient lighting, cozy atmosphere, soft warm tones, inviting mood",
  },
  {
    id: "cool_neutral",
    name: "Frío/Neutro",
    nameEn: "Cool Neutral",
    description: "Tonos fríos, aspecto moderno y limpio",
    prompt: "cool neutral lighting, clean modern feel, balanced white tones, contemporary mood",
  },
];

export const ROOM_TYPES: RoomType[] = [
  {
    id: "living_room",
    name: "Salón",
    description: "Sala de estar principal",
    instruction: `ROOM TYPE: LIVING ROOM / SALÓN
Primary furniture: Sofa (2-3 seater), armchairs, coffee table, TV unit or console.
Secondary elements: Side tables, floor lamp, table lamp, decorative cushions, throw blanket, area rug, wall art, plants, bookshelf or shelving.
Layout priority: Create conversation area, ensure clear pathways, TV viewing angle if space suggests it.`,
  },
  {
    id: "bedroom_master",
    name: "Dormitorio Principal",
    description: "Habitación principal con cama doble",
    instruction: `ROOM TYPE: MASTER BEDROOM / DORMITORIO PRINCIPAL
Primary furniture: King or Queen size bed with headboard, two nightstands with lamps.
Secondary elements: Dresser or chest of drawers, bench at foot of bed (if space allows), area rug under bed, decorative pillows, artwork above bed, curtains, plant.
Layout priority: Bed as focal point, symmetrical nightstand arrangement, clear access to windows and closet.`,
  },
  {
    id: "bedroom_single",
    name: "Dormitorio Individual",
    description: "Habitación con cama individual o de invitados",
    instruction: `ROOM TYPE: SINGLE BEDROOM / DORMITORIO INDIVIDUAL
Primary furniture: Single or double bed with headboard, one nightstand with lamp.
Secondary elements: Small desk with chair (if space allows), wardrobe or dresser, area rug, wall art, plant, bookshelf.
Layout priority: Maximize floor space, functional layout for daily use.`,
  },
  {
    id: "bedroom_kids",
    name: "Dormitorio Infantil",
    description: "Habitación para niños",
    instruction: `ROOM TYPE: KIDS BEDROOM / DORMITORIO INFANTIL
Primary furniture: Single bed or bunk bed, desk with chair for studying.
Secondary elements: Toy storage (shelves or bins), small bookcase, area rug (playful), wall decorations (age-appropriate), soft lighting.
Layout priority: Safe layout with play area, study zone, and sleep zone clearly defined. Keep furniture edges soft.
Note: Adapt style colors to be more playful while maintaining the overall design aesthetic.`,
  },
  {
    id: "kitchen",
    name: "Cocina",
    description: "Cocina con zona de comedor opcional",
    instruction: `ROOM TYPE: KITCHEN / COCINA
Primary furniture: Dining table with chairs (if eat-in kitchen), bar stools (if counter/island exists).
Secondary elements: Decorative items on counters (cutting board, fruit bowl, plants, cookbook), pendant lights over island/table, small appliances tastefully arranged.
Layout priority: Keep counters mostly clear, highlight functionality, ensure kitchen triangle flow is visible.
Note: DO NOT add cabinets, appliances, or countertops that don't exist. Only add movable furniture and decor.`,
  },
  {
    id: "bathroom",
    name: "Baño",
    description: "Baño con accesorios decorativos",
    instruction: `ROOM TYPE: BATHROOM / BAÑO
Primary furniture: None (bathrooms typically have fixed elements only).
Secondary elements: Towels (neatly folded or hung), bath mat, small plant, decorative tray with toiletries, mirror decorations, candles, small storage basket.
Layout priority: Minimal staging, focus on cleanliness and spa-like atmosphere.
Note: DO NOT add toilet, sink, bathtub, or shower if not present. Only add soft furnishings and decorative elements.`,
  },
  {
    id: "dining_room",
    name: "Comedor",
    description: "Comedor formal o semi-formal",
    instruction: `ROOM TYPE: DINING ROOM / COMEDOR
Primary furniture: Dining table (size appropriate to room), dining chairs (4-8 depending on table size).
Secondary elements: Sideboard or buffet, pendant light or chandelier over table, table centerpiece (candles, vase with flowers), area rug under table, wall art, mirror.
Layout priority: Table centered in space, chairs with room to pull out, clear pathway around table.`,
  },
  {
    id: "home_office",
    name: "Oficina / Despacho",
    description: "Espacio de trabajo en casa",
    instruction: `ROOM TYPE: HOME OFFICE / DESPACHO
Primary furniture: Desk (executive or writing desk), ergonomic office chair.
Secondary elements: Bookshelf or shelving unit, desk lamp, small plant, filing cabinet or storage, wall art or diplomas, area rug, comfortable reading chair (if space allows).
Layout priority: Desk facing window or with good lighting, organized and professional appearance.`,
  },
  {
    id: "studio",
    name: "Estudio / Loft",
    description: "Espacio abierto multifuncional",
    instruction: `ROOM TYPE: STUDIO / ESTUDIO (Open Plan Single Room)
Primary furniture: Sofa or daybed (doubles as seating/sleeping), coffee table, small dining table or breakfast bar.
Secondary elements: Room divider or bookshelf to create zones, area rugs to define spaces, multi-functional furniture, plants, wall art.
Layout priority: Create distinct zones (sleep, work, living) without physical walls. Use furniture placement and rugs to define areas.`,
  },
  {
    id: "terrace",
    name: "Terraza / Balcón",
    description: "Espacio exterior con mobiliario",
    instruction: `ROOM TYPE: TERRACE / BALCONY / TERRAZA
Primary furniture: Outdoor sofa or lounge chairs, outdoor dining set (if space allows), coffee table.
Secondary elements: Outdoor rug, potted plants, string lights, lanterns, outdoor cushions, small side table, umbrella or shade (if appropriate).
Layout priority: Create comfortable outdoor living space, consider sun/shade patterns, ensure railing visibility for safety.
Note: Use OUTDOOR furniture only. Weather-resistant materials.`,
  },
  {
    id: "entryway",
    name: "Entrada / Recibidor",
    description: "Zona de entrada a la vivienda",
    instruction: `ROOM TYPE: ENTRYWAY / FOYER / RECIBIDOR
Primary furniture: Console table, mirror above console.
Secondary elements: Table lamp or wall sconces, decorative bowl or tray for keys, small plant or flowers, coat hooks or small bench (if space allows), area rug.
Layout priority: Welcoming first impression, functional for daily use (keys, mail), clear pathway into home.`,
  },
  {
    id: "open_plan",
    name: "Espacio Abierto",
    description: "Salón-comedor o salón-cocina integrado",
    instruction: `ROOM TYPE: OPEN PLAN / ESPACIO ABIERTO (Living + Dining or Living + Kitchen)
Primary furniture: Sofa and coffee table in living zone, dining table with chairs in dining zone.
Secondary elements: Area rugs to define each zone, consistent style across zones, plants as natural dividers, cohesive lighting scheme.
Layout priority: Create flow between zones while maintaining distinct areas. Use furniture arrangement and rugs to separate functions without walls.`,
  },
  {
    id: "empty_room",
    name: "Auto-detectar",
    description: "Dejar que la IA determine el uso óptimo",
    instruction: `ROOM TYPE: ANALYZE AND DETERMINE
Analyze the room's architectural features (windows, doors, proportions, natural light) to determine the most likely function.
Furnish appropriately based on your analysis.
If unclear, default to a versatile LIVING ROOM setup.`,
  },
];
