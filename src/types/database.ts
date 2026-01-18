export type GenerationStatus = "pending" | "processing" | "completed" | "failed";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
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
  replicate_prediction_id: string | null;
  status: GenerationStatus;
  error_message: string | null;
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
  replicate_prediction_id?: string | null;
  status?: GenerationStatus;
  error_message?: string | null;
};

export type GenerationUpdate = Partial<Omit<Generation, "id" | "user_id" | "created_at">>;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id">>;
      };
      generations: {
        Row: Generation;
        Insert: GenerationInsert;
        Update: GenerationUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      generation_status: GenerationStatus;
    };
  };
}

export type StylePreset = {
  id: string;
  name: string;
  prompt: string;
  thumbnail?: string;
};

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "modern",
    name: "Moderno",
    prompt:
      "modern interior design, clean lines, neutral colors, minimalist furniture, large windows, natural light, contemporary style, high-end finishes",
  },
  {
    id: "minimalist",
    name: "Minimalista",
    prompt:
      "minimalist interior design, white walls, simple furniture, decluttered space, zen aesthetic, subtle textures, monochromatic palette, serene atmosphere",
  },
  {
    id: "industrial",
    name: "Industrial",
    prompt:
      "industrial interior design, exposed brick, metal fixtures, wooden beams, concrete floors, vintage furniture, edison bulbs, loft style",
  },
  {
    id: "scandinavian",
    name: "Escandinavo",
    prompt:
      "scandinavian interior design, hygge style, light wood, cozy textiles, white and gray palette, functional furniture, plants, natural materials",
  },
  {
    id: "mediterranean",
    name: "Mediterráneo",
    prompt:
      "mediterranean interior design, terracotta tiles, arched doorways, warm earth tones, rustic wood, wrought iron details, coastal vibes",
  },
];
