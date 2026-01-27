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
