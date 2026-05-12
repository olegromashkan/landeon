// ─── Landing Page JSON Types ─────────────────────────────────────────────────

export type ThemeMode = "dark" | "light";
export type ThemeStyle = "modern" | "minimal" | "bold" | "elegant";

export interface PageTheme {
  mode: ThemeMode;
  accent: string; // hex color e.g. "#a855f7"
  style: ThemeStyle;
}

// ─── Section Props ────────────────────────────────────────────────────────────

export interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  description: string;
  ctaText: string;
  ctaSecondaryText?: string;
  badge?: string;
  imageUrl?: string;
  imageAlt?: string;
  imageAttribution?: string;
  imagePhotographerUrl?: string;
  imageSuggestion?: string;
}

export interface AboutSectionProps {
  headline: string;
  description: string;
  stats?: Array<{ value: string; label: string }>;
  highlights?: string[];
  imageUrl?: string;
  imageAlt?: string;
  imageAttribution?: string;
  imagePhotographerUrl?: string;
  imageSuggestion?: string;
}

export interface FeatureItem {
  icon: string; // lucide icon name
  title: string;
  description: string;
}

export interface FeaturesSectionProps {
  headline: string;
  subheadline?: string;
  items: FeatureItem[];
}

export interface ServiceItem {
  icon: string;
  title: string;
  description: string;
  price?: string;
}

export interface ServicesSectionProps {
  headline: string;
  subheadline?: string;
  items: ServiceItem[];
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export interface HowItWorksSectionProps {
  headline: string;
  subheadline?: string;
  steps: HowItWorksStep[];
}

export interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company?: string;
  rating?: number; // 1-5
}

export interface TestimonialsSectionProps {
  headline: string;
  subheadline?: string;
  items: TestimonialItem[];
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
  highlighted: boolean;
}

export interface PricingSectionProps {
  headline: string;
  subheadline?: string;
  plans: PricingPlan[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSectionProps {
  headline: string;
  subheadline?: string;
  items: FAQItem[];
}

export interface ContactFormSectionProps {
  headline: string;
  subheadline?: string;
  description?: string;
  ctaText: string;
  showName: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showMessage: boolean;
  showCompany: boolean;
}

export interface CTASectionProps {
  headline: string;
  subheadline?: string;
  ctaText: string;
  ctaSecondaryText?: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSectionProps {
  businessName: string;
  tagline?: string;
  links?: FooterLink[];
  copyright: string;
  contactEmail?: string;
  contactPhone?: string;
}

// ─── Discriminated Union of Section Types ─────────────────────────────────────

export type SectionType =
  | "hero"
  | "about"
  | "features"
  | "services"
  | "how_it_works"
  | "testimonials"
  | "pricing"
  | "faq"
  | "contact_form"
  | "cta"
  | "footer";

export type Section =
  | { id: string; type: "hero"; variant: "centered" | "split"; props: HeroSectionProps }
  | { id: string; type: "about"; variant: "default"; props: AboutSectionProps }
  | { id: string; type: "features"; variant: "grid" | "alternating"; props: FeaturesSectionProps }
  | { id: string; type: "services"; variant: "default"; props: ServicesSectionProps }
  | { id: string; type: "how_it_works"; variant: "default"; props: HowItWorksSectionProps }
  | { id: string; type: "testimonials"; variant: "default"; props: TestimonialsSectionProps }
  | { id: string; type: "pricing"; variant: "default"; props: PricingSectionProps }
  | { id: string; type: "faq"; variant: "default"; props: FAQSectionProps }
  | { id: string; type: "contact_form"; variant: "default"; props: ContactFormSectionProps }
  | { id: string; type: "cta"; variant: "default"; props: CTASectionProps }
  | { id: string; type: "footer"; variant: "default"; props: FooterSectionProps };

// ─── Full Landing Page ─────────────────────────────────────────────────────────

export interface LandingPage {
  pageTitle: string;
  pageDescription: string;
  theme: PageTheme;
  sections: Section[];
}

// ─── Project (Database Entity) ─────────────────────────────────────────────────

export interface Project {
  id: string;
  name: string;
  prompt: string | null;
  businessName: string | null;
  businessDescription: string | null;
  targetAudience: string | null;
  goal: string | null;
  tone: string | null;
  visualStyle: string | null;
  primaryAccent: string | null;
  language: string;
  pageJson: LandingPage;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Advanced Brief Form ───────────────────────────────────────────────────────

export interface AdvancedBrief {
  prompt?: string;
  businessName?: string;
  businessDescription?: string;
  targetAudience?: string;
  goal?: string;
  tone?: string;
  visualStyle?: string;
  primaryAccent?: string;
  language?: string;
  requiredSections?: SectionType[];
  ctaText?: string;
  contactInfo?: string;
}

// ─── AI Action Types ───────────────────────────────────────────────────────────

export type AIActionType =
  | "generate_page"
  | "rewrite_section"
  | "make_shorter"
  | "make_premium"
  | "make_formal"
  | "regenerate_section"
  | "suggest_cta";

export interface SectionAIRequest {
  actionType: AIActionType;
  projectId: string;
  sectionId: string;
  section: Section;
  pageContext: {
    pageTitle: string;
    theme: PageTheme;
    businessDescription?: string;
  };
}

// ─── API Response Types ────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
