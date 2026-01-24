import { createClient } from "@/lib/supabase/server";

// Cache for content to avoid repeated database calls during a single render
const contentCache = new Map<string, any>();

export async function getContent<T = any>(page: string, section: string): Promise<T | null> {
  const cacheKey = `${page}:${section}`;

  // Check cache first
  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey) as T;
  }

  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("site_content")
      .select("content")
      .eq("page", page)
      .eq("section", section)
      .single();

    if (error || !data) {
      return null;
    }

    const result = data as unknown as { content: any };

    // Store in cache
    contentCache.set(cacheKey, result.content);

    return result.content as T;
  } catch {
    return null;
  }
}

// Helper to get all content for a page at once
export async function getPageContent<T = Record<string, any>>(page: string): Promise<T> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("site_content")
      .select("section, content")
      .eq("page", page);

    if (error || !data) {
      return {} as T;
    }

    const items = data as unknown as Array<{ section: string; content: any }>;
    const result: Record<string, any> = {};
    items.forEach((item) => {
      result[item.section] = item.content;
    });

    return result as T;
  } catch {
    return {} as T;
  }
}

// Type definitions for landing page content
export interface HeroContent {
  label: string;
  title_line1: string;
  title_line2: string;
  description: string;
  cta_primary: string;
  cta_secondary: string;
  slider_before_image: string;
  slider_after_image: string;
}

export interface TrustContent {
  label: string;
  logos: string[];
}

export interface ProblemCard {
  number: string;
  title: string;
  description: string;
}

export interface ProblemContent {
  label: string;
  title: string;
  description: string;
  cards: ProblemCard[];
  solution: {
    label: string;
    title: string;
    description: string;
  };
}

export interface Step {
  number: string;
  title: string;
  description: string;
}

export interface StepsContent {
  label: string;
  title_line1: string;
  title_line2: string;
  steps: Step[];
}

export interface Style {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface StylesContent {
  label: string;
  title: string;
  description: string;
  styles: Style[];
}

export interface TestimonialContent {
  label: string;
  quote: string;
  highlight: string;
  author_name: string;
  author_role: string;
  author_image?: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  badge?: string;
}

export interface PricingContent {
  label: string;
  title: string;
  plans: PricingPlan[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQContent {
  label: string;
  title: string;
  items: FAQItem[];
}

export interface CTAContent {
  title_line1: string;
  title_line2: string;
  description: string;
  cta: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterContent {
  brand_description: string;
  columns: FooterColumn[];
  copyright: string;
}

export interface LandingContent {
  hero: HeroContent;
  heroBadge: HeroBadgeContent;
  facePile: FacePileContent;
  trust: TrustContent;
  fork: ForkContent;
  bento: BentoContent;
  stats: StatsContent;
  styles: StylesContent;
  socialProof: SocialProofContent;
  pricing: PricingContent;
  faq: FAQContent;
  cta: CTAContent;
  footer: FooterContent;
}

// Dashboard content types
export interface DashboardContent {
  alpha_label: string;
  alpha_description: string;
  gallery_label: string;
  gallery_title: string;
  empty_title: string;
  empty_description: string;
  empty_cta: string;
  new_design_cta: string;
}

// Editor content types
export interface EditorContent {
  label: string;
  title: string;
  back_button: string;
  config_label: string;
  style_label: string;
  generate_button: string;
  generating_text: string;
  generating_description: string;
  download_button: string;
  new_image_button: string;
  tips_label: string;
  tips: string[];
}

// Login content types
export interface LoginContent {
  title: string;
  description: string;
  form_label: string;
  form_title: string;
  google_button: string;
  github_button: string;
  terms_text: string;
  terms_link: string;
  privacy_link: string;
}

// Upload zone content types
export interface UploadZoneContent {
  drag_text: string;
  drop_text: string;
  click_text: string;
  formats_text: string;
}

// New Linear-style landing page types

export interface HeroBadgeContent {
  text: string;
}

export interface FacePileContent {
  count: string;
  suffix: string;
}

export interface ForkCard {
  id: string;
  title: string;
  target: string;
  tagline: string;
  description: string;
  before_image: string;
  after_image: string;
  cta: string;
}

export interface ForkContent {
  cards: ForkCard[];
}

export interface BentoItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface BentoContent {
  label: string;
  title: string;
  items: BentoItem[];
}

export interface StatItem {
  value: string;
  label: string;
  trend: "up" | "down";
}

export interface StatsContent {
  label: string;
  items: StatItem[];
  copy: string;
}

export interface SocialProofContent {
  quote: string;
  author_name: string;
  author_role: string;
  author_image?: string;
  stats_title: string;
  stats_count: string;
  stats_trend: string;
}
