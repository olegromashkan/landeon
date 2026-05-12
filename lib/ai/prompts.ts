import type { AdvancedBrief, Section, PageTheme, AIActionType } from "@/types";

// ─── System Context ────────────────────────────────────────────────────────────

const SYSTEM_CONTEXT = `You are an expert landing page strategist, copywriter, and UX architect.
Your role is to generate high-quality, persuasive, and conversion-focused landing page content.

Rules you must always follow:
- Return ONLY valid JSON. No markdown, no explanations, no code fences.
- Use only the allowed section types listed.
- Write copy that is persuasive, concise, and professional — not generic.
- Avoid clichés like "Unlock your potential" or "Take your business to the next level".
- Avoid made-up statistics unless they are clearly illustrative placeholders.
- Match the tone and style specified in the brief.
- Keep headlines punchy (under 10 words ideally). Keep descriptions clear and benefit-focused.
- Icon names must be valid lucide-react icon names (e.g., "Zap", "Shield", "Star", "Check", "ArrowRight").`;

// ─── Allowed section types doc ────────────────────────────────────────────────

const SECTION_TYPES_DOC = `Allowed section types and their variants:
- "hero" — variants: "centered" | "split"
- "about" — variants: "default"
- "features" — variants: "grid" | "alternating"
- "services" — variants: "default"
- "how_it_works" — variants: "default"
- "testimonials" — variants: "default"
- "pricing" — variants: "default"
- "faq" — variants: "default"
- "contact_form" — variants: "default"
- "cta" — variants: "default"
- "footer" — variants: "default"`;

// ─── Full Page Generation Prompt ───────────────────────────────────────────────

export function buildGenerationPrompt(brief: AdvancedBrief): string {
  const briefLines = [
    brief.prompt && `User prompt: "${brief.prompt}"`,
    brief.businessName && `Business name: ${brief.businessName}`,
    brief.businessDescription && `Business description: ${brief.businessDescription}`,
    brief.targetAudience && `Target audience: ${brief.targetAudience}`,
    brief.goal && `Landing page goal: ${brief.goal}`,
    brief.tone && `Brand tone: ${brief.tone}`,
    brief.visualStyle && `Visual style: ${brief.visualStyle}`,
    brief.primaryAccent && `Primary accent color (hex): ${brief.primaryAccent}`,
    brief.language && `Language: ${brief.language}`,
    brief.ctaText && `Preferred CTA text: ${brief.ctaText}`,
    brief.contactInfo && `Contact info: ${brief.contactInfo}`,
    brief.requiredSections?.length &&
      `Required sections: ${brief.requiredSections.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `${SYSTEM_CONTEXT}

${SECTION_TYPES_DOC}

---
BRIEF:
${briefLines}

---
TASK:
Generate a complete, polished landing page JSON for this business.

Requirements:
- Include 5–9 sections total (always include "hero" and "footer")
- Choose sections that best serve the landing page goal
- Make the copy feel real, specific, and professional — tailored to this business
- Use the accent color ${brief.primaryAccent || "#a855f7"} in the theme
- Set theme.mode to "dark" unless the brief specifies light
- Each section must have a unique string id (e.g. "hero-1", "features-2")
- For hero, write a compelling headline under 10 words
- For hero, prefer variant "split" and always include imageSuggestion: a 2-4 word Unsplash search query that matches the business visually (e.g. "modern tech office", "coffee shop barista", "fitness gym workout")
- For about sections, include imageSuggestion: a relevant Unsplash search query
- For features/services, include 3–6 items with appropriate lucide icon names
- For testimonials, write 2–4 realistic testimonials (use placeholder names)
- For pricing (if included), write 2–3 plans with the highlighted plan being middle
- For footer, use business info from the brief

Return ONLY this JSON structure (no markdown, no explanation):

{
  "pageTitle": "...",
  "pageDescription": "...",
  "theme": {
    "mode": "dark",
    "accent": "#a855f7",
    "style": "modern"
  },
  "sections": [
    {
      "id": "hero-1",
      "type": "hero",
      "variant": "split",
      "props": {
        "headline": "...",
        "description": "...",
        "ctaText": "...",
        "badge": "...",
        "imageSuggestion": "2-4 word Unsplash search query matching the business, e.g. 'modern office team' or 'coffee barista'"
      }
    }
  ]
}`;
}

// ─── Section Rewrite Prompt ───────────────────────────────────────────────────

export function buildSectionActionPrompt(
  actionType: AIActionType,
  section: Section,
  pageContext: { pageTitle: string; theme: PageTheme; businessDescription?: string }
): string {
  const actionInstructions: Record<AIActionType, string> = {
    generate_page: "", // not used here
    rewrite_section: `Rewrite the section content with fresh, compelling copy. Keep the same structure and fields, but improve the writing significantly. Make it more specific, benefit-driven, and persuasive.`,
    make_shorter: `Make all text content in this section significantly shorter and more concise. Cut filler words. Keep only the essential message. Reduce description lengths by at least 40%.`,
    make_premium: `Rewrite all text in this section to feel more premium, sophisticated, and high-end. Use elevated language. Suggest exclusivity and quality without being pretentious.`,
    make_formal: `Rewrite all text in this section in a formal, professional tone. Remove any casual language. Write as if addressing C-suite executives or serious business buyers.`,
    regenerate_section: `Completely regenerate this section from scratch with new copy and angles. Keep the same section type and variant. Be creative and try a different approach to the content.`,
    suggest_cta: `Improve all CTA text (buttons, call-to-action labels) in this section. Make them more action-oriented, specific, and compelling. Return the full section with improved CTA text.`,
  };

  return `${SYSTEM_CONTEXT}

${SECTION_TYPES_DOC}

---
PAGE CONTEXT:
- Page title: ${pageContext.pageTitle}
- Theme style: ${pageContext.theme.style}
- Business: ${pageContext.businessDescription || "Not specified"}

---
CURRENT SECTION (JSON):
${JSON.stringify(section, null, 2)}

---
TASK:
${actionInstructions[actionType]}

Return ONLY the updated section JSON with the exact same structure (id, type, variant must remain unchanged).
Return a single JSON object, not an array.`;
}
