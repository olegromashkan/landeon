import { z } from "zod";

// ─── Shared ───────────────────────────────────────────────────────────────────

const iconName = z.string().min(1).max(64);

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const HeroPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(120).optional(),
  description: z.string().min(1).max(400),
  ctaText: z.string().min(1).max(60),
  ctaSecondaryText: z.string().max(60).optional(),
  badge: z.string().max(60).optional(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().max(200).optional(),
  imageAttribution: z.string().max(300).optional(),
  imagePhotographerUrl: z.string().url().optional(),
  imageSuggestion: z.string().max(100).optional(),
});

export const HeroSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("hero"),
  variant: z.enum(["centered", "split"]),
  props: HeroPropsSchema,
});

// ─── About ────────────────────────────────────────────────────────────────────

export const AboutPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  description: z.string().min(1).max(800),
  stats: z
    .array(z.object({ value: z.string().max(20), label: z.string().max(60) }))
    .max(6)
    .optional(),
  highlights: z.array(z.string().max(100)).max(6).optional(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().max(200).optional(),
  imageAttribution: z.string().max(300).optional(),
  imagePhotographerUrl: z.string().url().optional(),
  imageSuggestion: z.string().max(100).optional(),
});

export const AboutSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("about"),
  variant: z.literal("default"),
  props: AboutPropsSchema,
});

// ─── Features ─────────────────────────────────────────────────────────────────

export const FeatureItemSchema = z.object({
  icon: iconName,
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(300),
});

export const FeaturesPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(200).optional(),
  items: z.array(FeatureItemSchema).min(1).max(9),
});

export const FeaturesSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("features"),
  variant: z.enum(["grid", "alternating"]),
  props: FeaturesPropsSchema,
});

// ─── Services ─────────────────────────────────────────────────────────────────

export const ServiceItemSchema = z.object({
  icon: iconName,
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(300),
  price: z.string().max(40).optional(),
});

export const ServicesPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(200).optional(),
  items: z.array(ServiceItemSchema).min(1).max(9),
});

export const ServicesSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("services"),
  variant: z.literal("default"),
  props: ServicesPropsSchema,
});

// ─── How It Works ──────────────────────────────────────────────────────────────

export const HowItWorksStepSchema = z.object({
  number: z.string().max(4),
  title: z.string().min(1).max(80),
  description: z.string().min(1).max(300),
});

export const HowItWorksPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(200).optional(),
  steps: z.array(HowItWorksStepSchema).min(2).max(6),
});

export const HowItWorksSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("how_it_works"),
  variant: z.literal("default"),
  props: HowItWorksPropsSchema,
});

// ─── Testimonials ─────────────────────────────────────────────────────────────

export const TestimonialItemSchema = z.object({
  quote: z.string().min(1).max(400),
  author: z.string().min(1).max(80),
  role: z.string().min(1).max(80),
  company: z.string().max(80).optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

export const TestimonialsPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(200).optional(),
  items: z.array(TestimonialItemSchema).min(1).max(6),
});

export const TestimonialsSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("testimonials"),
  variant: z.literal("default"),
  props: TestimonialsPropsSchema,
});

// ─── Pricing ──────────────────────────────────────────────────────────────────

export const PricingPlanSchema = z.object({
  name: z.string().min(1).max(60),
  price: z.string().min(1).max(40),
  period: z.string().max(40),
  description: z.string().max(200),
  features: z.array(z.string().max(120)).min(1).max(10),
  ctaText: z.string().min(1).max(60),
  highlighted: z.boolean(),
});

export const PricingPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(200).optional(),
  plans: z.array(PricingPlanSchema).min(1).max(4),
});

export const PricingSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("pricing"),
  variant: z.literal("default"),
  props: PricingPropsSchema,
});

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export const FAQItemSchema = z.object({
  question: z.string().min(1).max(200),
  answer: z.string().min(1).max(600),
});

export const FAQPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(200).optional(),
  items: z.array(FAQItemSchema).min(1).max(12),
});

export const FAQSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("faq"),
  variant: z.literal("default"),
  props: FAQPropsSchema,
});

// ─── Contact Form ─────────────────────────────────────────────────────────────

export const ContactFormPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(200).optional(),
  description: z.string().max(400).optional(),
  ctaText: z.string().min(1).max(60),
  showName: z.boolean(),
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  showMessage: z.boolean(),
  showCompany: z.boolean(),
});

export const ContactFormSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("contact_form"),
  variant: z.literal("default"),
  props: ContactFormPropsSchema,
});

// ─── CTA ──────────────────────────────────────────────────────────────────────

export const CTAPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(300).optional(),
  ctaText: z.string().min(1).max(60),
  ctaSecondaryText: z.string().max(60).optional(),
});

export const CTASectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("cta"),
  variant: z.literal("default"),
  props: CTAPropsSchema,
});

// ─── Footer ───────────────────────────────────────────────────────────────────

export const FooterLinkSchema = z.object({
  label: z.string().min(1).max(60),
  href: z.string().max(200),
});

export const FooterPropsSchema = z.object({
  businessName: z.string().min(1).max(100),
  tagline: z.string().max(200).optional(),
  links: z.array(FooterLinkSchema).max(8).optional(),
  copyright: z.string().min(1).max(200),
  contactEmail: z.string().max(100).optional(),
  contactPhone: z.string().max(40).optional(),
});

export const FooterSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("footer"),
  variant: z.literal("default"),
  props: FooterPropsSchema,
});

// ─── Union ────────────────────────────────────────────────────────────────────

export const SectionSchema = z.discriminatedUnion("type", [
  HeroSectionSchema,
  AboutSectionSchema,
  FeaturesSectionSchema,
  ServicesSectionSchema,
  HowItWorksSectionSchema,
  TestimonialsSectionSchema,
  PricingSectionSchema,
  FAQSectionSchema,
  ContactFormSectionSchema,
  CTASectionSchema,
  FooterSectionSchema,
]);
