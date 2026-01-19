// Admin Types

export interface SiteContent {
  id: string;
  page: string;
  section: string;
  content: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Landing Page Content Types
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

export interface StyleItem {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface StylesContent {
  label: string;
  title: string;
  description: string;
  styles: StyleItem[];
}

export interface TestimonialContent {
  label: string;
  quote: string;
  highlight: string;
  author_name: string;
  author_role: string;
  author_image: string;
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

// Dashboard Content Types
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

// Editor Content Types
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

// Login Content Types
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

// Upload Zone Content Types
export interface UploadZoneContent {
  drag_text: string;
  drop_text: string;
  click_text: string;
  formats_text: string;
}

// All Landing Page Content
export interface LandingPageContent {
  hero: HeroContent;
  trust: TrustContent;
  problem: ProblemContent;
  steps: StepsContent;
  styles: StylesContent;
  testimonial: TestimonialContent;
  pricing: PricingContent;
  faq: FAQContent;
  cta: CTAContent;
  footer: FooterContent;
}
