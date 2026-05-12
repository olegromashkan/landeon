import { getGenerationModel, getSectionModel } from "./client";
import { buildGenerationPrompt, buildSectionActionPrompt } from "./prompts";
import { LandingPageSchema } from "@/lib/schema/landingPage";
import { SectionSchema } from "@/lib/schema/sections";
import type { AdvancedBrief, Section, PageTheme, LandingPage, AIActionType, SectionType } from "@/types";
import { v4 as uuidv4 } from "uuid";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractJSON(raw: string): string {
  // Strip any accidental markdown code fences
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  // Find the outermost JSON object
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start !== -1 && end !== -1) return raw.slice(start, end + 1);

  return raw.trim();
}

function ensureSectionIds(sections: Section[]): Section[] {
  const seen = new Set<string>();
  return sections.map((section) => {
    let id = section.id || `${section.type}-${uuidv4().slice(0, 8)}`;
    // Ensure uniqueness
    while (seen.has(id)) {
      id = `${section.type}-${uuidv4().slice(0, 8)}`;
    }
    seen.add(id);
    return { ...section, id };
  });
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback: string, maxLength?: number): string {
  const text = typeof value === "string" && value.trim() ? value.trim() : fallback;
  return maxLength ? text.slice(0, maxLength) : text;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asStringArray(value: unknown, fallback: string[], maxItems: number): string[] {
  const items = Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : fallback;
  return items.slice(0, maxItems);
}

function normalizeAccent(value: unknown, fallback: string): string {
  return typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

function normalizeTheme(value: unknown, brief: AdvancedBrief): LandingPage["theme"] {
  const theme = asRecord(value);
  const mode = theme.mode === "light" || brief.visualStyle?.toLowerCase().includes("light") ? "light" : "dark";
  const styleOptions = ["modern", "minimal", "bold", "elegant"] as const;
  const style = styleOptions.includes(theme.style as (typeof styleOptions)[number])
    ? (theme.style as LandingPage["theme"]["style"])
    : "modern";

  return {
    mode,
    accent: normalizeAccent(theme.accent, normalizeAccent(brief.primaryAccent, "#a855f7")),
    style,
  };
}

const sectionTypes: SectionType[] = [
  "hero",
  "about",
  "features",
  "services",
  "how_it_works",
  "testimonials",
  "pricing",
  "faq",
  "contact_form",
  "cta",
  "footer",
];

function normalizeSection(rawSection: unknown, index: number, brief: AdvancedBrief): Section | null {
  const section = asRecord(rawSection);
  const props = asRecord(section.props);
  const rawType = section.type;
  if (typeof rawType !== "string" || !sectionTypes.includes(rawType as SectionType)) return null;

  const type = rawType as SectionType;
  const id = asString(section.id, `${type}-${index + 1}`, 80);
  const businessName = brief.businessName || "Your Business";
  const ctaText = brief.ctaText || "Get started";

  switch (type) {
    case "hero":
      return {
        id,
        type,
        variant: section.variant === "split" ? "split" : "centered",
        props: {
          headline: asString(props.headline, businessName, 120),
          subheadline: typeof props.subheadline === "string" ? props.subheadline.slice(0, 120) : undefined,
          description: asString(props.description, brief.businessDescription || brief.prompt || `A focused landing page for ${businessName}.`, 400),
          ctaText: asString(props.ctaText, ctaText, 60),
          ctaSecondaryText: typeof props.ctaSecondaryText === "string" ? props.ctaSecondaryText.slice(0, 60) : undefined,
          badge: typeof props.badge === "string" ? props.badge.slice(0, 60) : undefined,
          imageSuggestion: typeof props.imageSuggestion === "string" ? props.imageSuggestion.slice(0, 100) : undefined,
        },
      };
    case "about":
      return {
        id,
        type,
        variant: "default",
        props: {
          headline: asString(props.headline, `About ${businessName}`, 120),
          description: asString(props.description, brief.businessDescription || `${businessName} helps customers solve important problems with a clear, practical offer.`, 800),
          highlights: asStringArray(props.highlights, [], 6),
          imageSuggestion: typeof props.imageSuggestion === "string" ? props.imageSuggestion.slice(0, 100) : undefined,
        },
      };
    case "features":
    case "services": {
      const rawItems = Array.isArray(props.items) ? props.items : [];
      const items = rawItems.length ? rawItems : [{ icon: "Check", title: "Clear value", description: "A practical benefit tailored to the customer's goal." }];
      const normalizedItems = items.slice(0, 6).map((item, itemIndex) => {
        const record = asRecord(item);
        return {
          icon: asString(record.icon, "Check", 64),
          title: asString(record.title, itemIndex === 0 ? "Clear value" : "Reliable delivery", 80),
          description: asString(record.description, "A practical benefit tailored to the customer's goal.", 300),
          ...(type === "services" && typeof record.price === "string" ? { price: record.price.slice(0, 40) } : {}),
        };
      });

      return {
        id,
        type,
        variant: type === "features" && section.variant === "alternating" ? "alternating" : type === "features" ? "grid" : "default",
        props: {
          headline: asString(props.headline, type === "features" ? "Why customers choose us" : "What we offer", 120),
          subheadline: typeof props.subheadline === "string" ? props.subheadline.slice(0, 200) : undefined,
          items: normalizedItems,
        },
      } as Section;
    }
    case "how_it_works": {
      const rawSteps = Array.isArray(props.steps) ? props.steps : [];
      const steps = (rawSteps.length >= 2
        ? rawSteps
        : [
            { number: "1", title: "Tell us what you need", description: "Share your goal and a few details." },
            { number: "2", title: "Get a clear plan", description: "Receive a focused next step." },
          ]
      )
        .slice(0, 6)
        .map((step, stepIndex) => {
          const record = asRecord(step);
          return {
            number: asString(record.number, String(stepIndex + 1), 4),
            title: asString(record.title, `Step ${stepIndex + 1}`, 80),
            description: asString(record.description, "A simple step in the customer journey.", 300),
          };
        });

      return {
        id,
        type,
        variant: "default",
        props: {
          headline: asString(props.headline, "How it works", 120),
          subheadline: typeof props.subheadline === "string" ? props.subheadline.slice(0, 200) : undefined,
          steps,
        },
      };
    }
    case "testimonials": {
      const rawItems = Array.isArray(props.items) ? props.items : [];
      const items = (rawItems.length
        ? rawItems
        : [{ quote: "The process was clear, fast, and genuinely useful.", author: "Alex Morgan", role: "Customer" }]
      )
        .slice(0, 6)
        .map((item) => {
          const record = asRecord(item);
          return {
            quote: asString(record.quote, "The process was clear, fast, and genuinely useful.", 400),
            author: asString(record.author, "Alex Morgan", 80),
            role: asString(record.role, "Customer", 80),
            company: typeof record.company === "string" ? record.company.slice(0, 80) : undefined,
            rating: typeof record.rating === "number" ? Math.min(5, Math.max(1, Math.round(record.rating))) : undefined,
          };
        });

      return {
        id,
        type,
        variant: "default",
        props: {
          headline: asString(props.headline, "What customers say", 120),
          subheadline: typeof props.subheadline === "string" ? props.subheadline.slice(0, 200) : undefined,
          items,
        },
      };
    }
    case "pricing": {
      const rawPlans = Array.isArray(props.plans) ? props.plans : [];
      const plans = (rawPlans.length
        ? rawPlans
        : [{ name: "Starter", price: "Custom", period: "", description: "A practical starting point.", features: ["Clear scope"], ctaText, highlighted: true }]
      )
        .slice(0, 4)
        .map((plan, planIndex) => {
          const record = asRecord(plan);
          return {
            name: asString(record.name, planIndex === 0 ? "Starter" : "Growth", 60),
            price: asString(record.price, "Custom", 40),
            period: asString(record.period, "", 40),
            description: asString(record.description, "A practical option for this offer.", 200),
            features: asStringArray(record.features, ["Clear scope"], 10),
            ctaText: asString(record.ctaText, ctaText, 60),
            highlighted: asBoolean(record.highlighted, planIndex === 1 || rawPlans.length === 1),
          };
        });

      return {
        id,
        type,
        variant: "default",
        props: {
          headline: asString(props.headline, "Simple pricing", 120),
          subheadline: typeof props.subheadline === "string" ? props.subheadline.slice(0, 200) : undefined,
          plans,
        },
      };
    }
    case "faq": {
      const rawItems = Array.isArray(props.items) ? props.items : [];
      const items = (rawItems.length
        ? rawItems
        : [{ question: "How do I get started?", answer: "Contact us and we will help you choose the right next step." }]
      )
        .slice(0, 12)
        .map((item) => {
          const record = asRecord(item);
          return {
            question: asString(record.question, "How do I get started?", 200),
            answer: asString(record.answer, "Contact us and we will help you choose the right next step.", 600),
          };
        });

      return {
        id,
        type,
        variant: "default",
        props: {
          headline: asString(props.headline, "Questions", 120),
          subheadline: typeof props.subheadline === "string" ? props.subheadline.slice(0, 200) : undefined,
          items,
        },
      };
    }
    case "contact_form":
      return {
        id,
        type,
        variant: "default",
        props: {
          headline: asString(props.headline, "Start the conversation", 120),
          subheadline: typeof props.subheadline === "string" ? props.subheadline.slice(0, 200) : undefined,
          description: typeof props.description === "string" ? props.description.slice(0, 400) : undefined,
          ctaText: asString(props.ctaText, "Send message", 60),
          showName: asBoolean(props.showName, true),
          showEmail: asBoolean(props.showEmail, true),
          showPhone: asBoolean(props.showPhone, false),
          showMessage: asBoolean(props.showMessage, true),
          showCompany: asBoolean(props.showCompany, false),
        },
      };
    case "cta":
      return {
        id,
        type,
        variant: "default",
        props: {
          headline: asString(props.headline, "Ready to get started?", 120),
          subheadline: typeof props.subheadline === "string" ? props.subheadline.slice(0, 300) : undefined,
          ctaText: asString(props.ctaText, ctaText, 60),
          ctaSecondaryText: typeof props.ctaSecondaryText === "string" ? props.ctaSecondaryText.slice(0, 60) : undefined,
        },
      };
    case "footer":
      return {
        id,
        type,
        variant: "default",
        props: {
          businessName: asString(props.businessName, businessName, 100),
          tagline: typeof props.tagline === "string" ? props.tagline.slice(0, 200) : undefined,
          links: Array.isArray(props.links)
            ? props.links.slice(0, 8).map((link) => {
                const record = asRecord(link);
                return {
                  label: asString(record.label, "Home", 60),
                  href: asString(record.href, "#", 200),
                };
              })
            : undefined,
          copyright: asString(props.copyright, `(c) ${new Date().getFullYear()} ${businessName}. All rights reserved.`, 200),
          contactEmail: typeof props.contactEmail === "string" ? props.contactEmail.slice(0, 100) : undefined,
          contactPhone: typeof props.contactPhone === "string" ? props.contactPhone.slice(0, 40) : undefined,
        },
      };
  }
}

function normalizeLandingPage(parsed: unknown, brief: AdvancedBrief): LandingPage {
  const page = asRecord(parsed);
  const businessName = brief.businessName || "Landing Page";
  const rawSections = Array.isArray(page.sections) ? page.sections : [];
  const sections = rawSections
    .map((section, index) => normalizeSection(section, index, brief))
    .filter((section): section is Section => Boolean(section));

  if (!sections.some((section) => section.type === "hero")) {
    sections.unshift(
      normalizeSection({ type: "hero", props: { headline: businessName, description: brief.businessDescription || brief.prompt } }, 0, brief)!
    );
  }

  if (!sections.some((section) => section.type === "footer")) {
    sections.push(normalizeSection({ type: "footer", props: { businessName } }, sections.length, brief)!);
  }

  return {
    pageTitle: asString(page.pageTitle, businessName, 120),
    pageDescription: asString(page.pageDescription, brief.businessDescription || brief.prompt || `Landing page for ${businessName}.`, 300),
    theme: normalizeTheme(page.theme, brief),
    sections: ensureSectionIds(sections.slice(0, 20)),
  };
}

function buildLocalFallbackLandingPage(brief: AdvancedBrief): LandingPage {
  const businessName = asString(brief.businessName, "Your Business", 100);
  const description = asString(
    brief.businessDescription || brief.prompt,
    `${businessName} helps customers understand the offer and take the next step.`,
    300
  );
  const audience = asString(brief.targetAudience, "customers who need a clear solution", 120);
  const goal = asString(brief.goal, "turn visitors into qualified leads", 120);
  const ctaText = asString(brief.ctaText, "Get started", 60);
  const imageSuggestion = asString(
    brief.businessName || brief.prompt || brief.businessDescription,
    "modern business team",
    100
  );
  const requestedTypes = Array.isArray(brief.requiredSections)
    ? brief.requiredSections.filter((type): type is SectionType => sectionTypes.includes(type as SectionType))
    : [];
  const baseTypes: SectionType[] = ["hero", "about", "features", "how_it_works", "cta", "contact_form", "footer"];
  const orderedTypes: SectionType[] = [
    ...Array.from(new Set([...baseTypes, ...requestedTypes])).filter((type) => type !== "footer"),
    "footer",
  ];

  const rawSections = orderedTypes.map((type) => {
    switch (type) {
      case "hero":
        return {
          type,
          variant: "split",
          props: {
            headline: `${businessName}: a clearer way to move forward`,
            subheadline: brief.tone ? `Tone: ${brief.tone}` : undefined,
            description,
            ctaText,
            ctaSecondaryText: "Learn more",
            badge: "Generated backup page",
            imageSuggestion,
          },
        };
      case "about":
        return {
          type,
          props: {
            headline: `About ${businessName}`,
            description,
            highlights: [
              `Designed for ${audience}`,
              `Focused on the goal: ${goal}`,
              "Built as a clear first version that can be edited",
            ],
            imageSuggestion,
          },
        };
      case "features":
        return {
          type,
          props: {
            headline: "Why this offer works",
            subheadline: "A concise structure based on the brief, ready for manual editing.",
            items: [
              {
                icon: "Target",
                title: "Clear audience",
                description: `The page speaks to ${audience} instead of staying generic.`,
              },
              {
                icon: "Sparkles",
                title: "Focused message",
                description: `The content is organized around the main goal: ${goal}.`,
              },
              {
                icon: "Pencil",
                title: "Editable structure",
                description: "Every section can be changed, moved, rewritten, or exported.",
              },
            ],
          },
        };
      case "services":
        return {
          type,
          props: {
            headline: "Services",
            subheadline: "Core parts of the offer can be adjusted in the editor.",
            items: [
              { icon: "Check", title: "Main offer", description: description.slice(0, 250) },
              { icon: "MessageCircle", title: "Consultation", description: "A simple first step for visitors who need more details." },
            ],
          },
        };
      case "how_it_works":
        return {
          type,
          props: {
            headline: "How it works",
            steps: [
              { number: "1", title: "Share the request", description: "The visitor explains what they need and leaves contact details." },
              { number: "2", title: "Get a clear response", description: `${businessName} reviews the request and suggests the best next step.` },
              { number: "3", title: "Move forward", description: "Both sides agree on scope, timing, and the practical details." },
            ],
          },
        };
      case "testimonials":
        return {
          type,
          props: {
            headline: "What customers value",
            items: [
              {
                quote: "The process was clear from the first message, and the next step was easy to understand.",
                author: "Customer",
                role: "Client",
              },
            ],
          },
        };
      case "pricing":
        return {
          type,
          props: {
            headline: "Simple pricing",
            plans: [
              {
                name: "Starter",
                price: "Custom",
                period: "",
                description: "A practical first option based on the customer request.",
                features: ["Clear scope", "Editable details", "Fast first step"],
                ctaText,
                highlighted: true,
              },
            ],
          },
        };
      case "faq":
        return {
          type,
          props: {
            headline: "Questions",
            items: [
              {
                question: "How do I get started?",
                answer: `Use the form and describe what you need. ${businessName} will reply with a practical next step.`,
              },
              {
                question: "Can this page be changed?",
                answer: "Yes. Texts, sections, order, theme, and images can be edited in the builder.",
              },
            ],
          },
        };
      case "contact_form":
        return {
          type,
          props: {
            headline: "Start the conversation",
            description: brief.contactInfo ? `Contact details: ${brief.contactInfo}` : "Send a short message and get a clear next step.",
            ctaText: "Send message",
            showName: true,
            showEmail: true,
            showPhone: true,
            showMessage: true,
            showCompany: false,
          },
        };
      case "cta":
        return {
          type,
          props: {
            headline: `Ready to talk to ${businessName}?`,
            subheadline: description,
            ctaText,
          },
        };
      case "footer":
        return {
          type,
          props: {
            businessName,
            tagline: description.slice(0, 180),
            links: [
              { label: "Home", href: "#" },
              { label: "Contact", href: "#contact" },
            ],
            copyright: `(c) ${new Date().getFullYear()} ${businessName}. All rights reserved.`,
          },
        };
    }
  });

  return normalizeLandingPage(
    {
      pageTitle: businessName,
      pageDescription: description,
      theme: normalizeTheme({}, brief),
      sections: rawSections,
    },
    brief
  );
}

// ─── Page Generation ──────────────────────────────────────────────────────────

export async function generateLandingPage(brief: AdvancedBrief): Promise<LandingPage> {
  const prompt = buildGenerationPrompt(brief);

  let raw: string;
  try {
    const result = await getGenerationModel().generateContent(prompt);
    raw = result.response.text();
  } catch (err) {
    console.warn("OpenRouter generation failed, using local fallback:", err);
    const fallback = buildLocalFallbackLandingPage(brief);
    const validatedFallback = LandingPageSchema.safeParse(fallback);
    if (validatedFallback.success) return validatedFallback.data as LandingPage;
    throw new Error(`OpenRouter API error: ${err instanceof Error ? err.message : String(err)}`);
  }

  const jsonStr = extractJSON(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("AI returned malformed JSON. Please try again.");
  }

  const normalized = normalizeLandingPage(parsed, brief);
  const validated = LandingPageSchema.safeParse(normalized);
  if (!validated.success) {
    console.error("Validation errors:", validated.error.flatten());
    throw new Error(
      `AI output validation failed: ${validated.error.errors[0]?.message || "Invalid structure"}`
    );
  }

  const page = validated.data as LandingPage;
  return page;
}

// ─── Section AI Actions ───────────────────────────────────────────────────────

export async function applyAISectionAction(
  actionType: AIActionType,
  section: Section,
  pageContext: { pageTitle: string; theme: PageTheme; businessDescription?: string }
): Promise<Section> {
  const prompt = buildSectionActionPrompt(actionType, section, pageContext);

  let raw: string;
  try {
    const result = await getSectionModel().generateContent(prompt);
    raw = result.response.text();
  } catch (err) {
    console.warn("OpenRouter section action failed, keeping original section:", err);
    return section;
  }

  const jsonStr = extractJSON(raw);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    throw new Error("AI returned malformed JSON for section. Please try again.");
  }

  // Enforce that the section type and id remain unchanged
  if (typeof parsed === "object" && parsed !== null) {
    (parsed as Record<string, unknown>).id = section.id;
    (parsed as Record<string, unknown>).type = section.type;
  }

  const validated = SectionSchema.safeParse(parsed);
  if (!validated.success) {
    console.error("Section validation errors:", validated.error.flatten());
    // Graceful fallback: return original section if AI output is invalid
    return section;
  }

  return validated.data as Section;
}
