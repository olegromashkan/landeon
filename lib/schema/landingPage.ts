import { z } from "zod";
import { SectionSchema } from "./sections";

export const PageThemeSchema = z.object({
  mode: z.enum(["dark", "light"]),
  accent: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color")
    .default("#a855f7"),
  style: z.enum(["modern", "minimal", "bold", "elegant"]).default("modern"),
});

export const LandingPageSchema = z.object({
  pageTitle: z.string().min(1).max(120),
  pageDescription: z.string().min(1).max(300),
  theme: PageThemeSchema,
  sections: z.array(SectionSchema).min(1).max(20),
});

// More lenient schema for AI output — we sanitise after parsing
export const LandingPageLooseSchema = LandingPageSchema.extend({
  sections: z
    .array(SectionSchema)
    .min(1)
    .max(20)
    .transform((sections) =>
      sections.map((s, i) => ({
        ...s,
        id: s.id || `${s.type}-${i}`,
      }))
    ),
});

export type LandingPageData = z.infer<typeof LandingPageSchema>;
