# Landeon Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix three critical builder issues — manual item editing, Unsplash photo integration, and working theme styles across all sections.

**Architecture:** Extend `theme.ts` with style helpers consumed by all 11 section components; add a reusable `ItemListEditor` accordion component used by `SectionPropsEditor`; add Unsplash search via a server-side API proxy and a new picker modal.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, Zod, Zustand, Radix UI, lucide-react. No test framework — use `npx tsc --noEmit` for type verification.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `components/sections/theme.ts` | Modify | Add `cardStyle`, `boldBorderStyle`, `sectionPadding`, `headingStyle`, `itemBorderRadius` |
| `components/sections/HeroSection.tsx` | Modify | Use theme helpers; render imageUrl |
| `components/sections/AboutSection.tsx` | Modify | Use theme helpers; render imageUrl |
| `components/sections/FeaturesSection.tsx` | Modify | Use theme helpers |
| `components/sections/ServicesSection.tsx` | Modify | Use theme helpers |
| `components/sections/HowItWorksSection.tsx` | Modify | Use theme helpers |
| `components/sections/TestimonialsSection.tsx` | Modify | Use theme helpers |
| `components/sections/PricingSection.tsx` | Modify | Use theme helpers |
| `components/sections/FAQSection.tsx` | Modify | Use theme helpers |
| `components/sections/ContactFormSection.tsx` | Modify | Use theme helpers |
| `components/sections/CTASection.tsx` | Modify | Use theme helpers |
| `components/sections/FooterSection.tsx` | Modify | Use theme helpers |
| `types/index.ts` | Modify | Add `imageUrl?`, `imageAlt?`, `imageAttribution?` to Hero and About props |
| `lib/schema/sections.ts` | Modify | Same additions to Zod schemas |
| `components/builder/ItemListEditor.tsx` | Create | Reusable accordion editor for array fields |
| `components/builder/SectionPropsEditor.tsx` | Modify | Replace all "Use AI" stubs; add image fields |
| `components/builder/UnsplashPickerModal.tsx` | Create | Photo search + selection modal |
| `app/api/unsplash/search/route.ts` | Create | Server-side Unsplash API proxy |
| `.env` / `.env.example` | Modify | Add `UNSPLASH_ACCESS_KEY` |

---

## Task 1: Theme Style Helpers

**Files:**
- Modify: `components/sections/theme.ts`

- [ ] **Step 1: Add helpers to the bottom of `theme.ts`**

Append after the existing `cardBg` export:

```ts
// ─── Style-aware helpers ───────────────────────────────────────────────────────

import type { ThemeStyle } from "@/types";

export function cardStyle(dark: boolean, style: ThemeStyle): string {
  switch (style) {
    case "minimal":
      return dark
        ? "bg-transparent border border-zinc-800"
        : "bg-transparent border border-zinc-200";
    case "bold":
      return dark
        ? "bg-zinc-900/80 border-2 border-zinc-700"
        : "bg-white border-2 border-zinc-300";
    case "elegant":
      return dark
        ? "bg-zinc-900/40 border border-zinc-700/60"
        : "bg-white border border-zinc-300";
    default: // modern
      return cardBg(dark);
  }
}

// Returns inline style for bold accent border; undefined for other styles
export function boldBorderStyle(
  style: ThemeStyle,
  accent: string
): { borderColor: string } | undefined {
  return style === "bold" ? { borderColor: accent } : undefined;
}

export function sectionPadding(style: ThemeStyle): string {
  switch (style) {
    case "minimal": return "py-24";
    case "bold":    return "py-16";
    case "elegant": return "py-28";
    default:        return "py-20";
  }
}

export function headingStyle(style: ThemeStyle): string {
  switch (style) {
    case "bold":    return "font-extrabold";
    case "minimal": return "font-semibold";
    case "elegant": return "font-semibold";
    default:        return "font-bold";
  }
}

export function itemBorderRadius(style: ThemeStyle): string {
  switch (style) {
    case "minimal": return "rounded-lg";
    case "bold":    return "rounded-2xl";
    case "elegant": return "rounded";
    default:        return "rounded-xl";
  }
}
```

- [ ] **Step 2: Verify types compile**

```bash
cd /home/harry/asem/landeon && npx tsc --noEmit
```

Expected: no errors (ThemeStyle is already in `types/index.ts`).

- [ ] **Step 3: Commit**

```bash
git add components/sections/theme.ts
git commit -m "feat: add theme style helpers (cardStyle, sectionPadding, headingStyle, itemBorderRadius)"
```

---

## Task 2: Apply Theme Helpers — FeaturesSection, ServicesSection, HowItWorksSection

**Files:**
- Modify: `components/sections/FeaturesSection.tsx`
- Modify: `components/sections/ServicesSection.tsx`
- Modify: `components/sections/HowItWorksSection.tsx`

- [ ] **Step 1: Update `FeaturesSection.tsx`**

Replace the import line at the top:
```ts
// Before:
import { isDark, mutedText, cardBg } from "./theme";
// After:
import { isDark, mutedText, cardStyle, boldBorderStyle, sectionPadding, headingStyle, itemBorderRadius } from "./theme";
```

In the `grid` variant `<section>` className — replace `py-20`:
```tsx
// Before:
className={cn("px-6 py-20", dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900")}
// After:
className={cn("px-6", sectionPadding(theme.style), dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900")}
```

In `grid` variant — heading `font-bold`:
```tsx
// Before:
<h2 className="text-3xl md:text-4xl font-bold tracking-tight">{props.headline}</h2>
// After:
<h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
```

In `grid` variant — each feature card:
```tsx
// Before:
<div key={i} className={cn("rounded-xl p-6", cardBg(dark))}>
// After:
<div key={i} className={cn(itemBorderRadius(theme.style), "p-6", cardStyle(dark, theme.style))} style={boldBorderStyle(theme.style, accent)}>
```

Repeat the same 4 changes (section padding, heading, card) for the `alternating` variant.  
In `alternating` the icon container uses `rounded-2xl` — replace with `itemBorderRadius(theme.style)`.

- [ ] **Step 2: Update `ServicesSection.tsx`**

Replace import:
```ts
// Before:
import { isDark, mutedText, cardBg } from "./theme";
// After:
import { isDark, mutedText, cardStyle, boldBorderStyle, sectionPadding, headingStyle, itemBorderRadius } from "./theme";
```

Section padding:
```tsx
// Before:
className={cn("px-6 py-20", dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900")}
// After:
className={cn("px-6", sectionPadding(theme.style), dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900")}
```

Heading:
```tsx
// Before:
<h2 className="text-3xl md:text-4xl font-bold tracking-tight">{props.headline}</h2>
// After:
<h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
```

Card:
```tsx
// Before:
<div key={i} className={cn("rounded-xl p-6 flex flex-col gap-4", cardBg(dark))}>
// After:
<div key={i} className={cn(itemBorderRadius(theme.style), "p-6 flex flex-col gap-4", cardStyle(dark, theme.style))} style={boldBorderStyle(theme.style, accent)}>
```

- [ ] **Step 3: Update `HowItWorksSection.tsx`**

Replace import:
```ts
// Before:
import { isDark, mutedText } from "./theme";
// After:
import { isDark, mutedText, sectionPadding, headingStyle } from "./theme";
```

Section padding:
```tsx
// Before:
className={cn("px-6 py-20", dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900")}
// After:
className={cn("px-6", sectionPadding(theme.style), dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900")}
```

Heading:
```tsx
// Before:
<h2 className="text-3xl md:text-4xl font-bold tracking-tight">{props.headline}</h2>
// After:
<h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
```

- [ ] **Step 4: Verify types**

```bash
cd /home/harry/asem/landeon && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/FeaturesSection.tsx components/sections/ServicesSection.tsx components/sections/HowItWorksSection.tsx
git commit -m "feat: apply theme style helpers to Features, Services, HowItWorks sections"
```

---

## Task 3: Apply Theme Helpers — Testimonials, Pricing, FAQ, ContactForm, CTA, About, Hero

**Files:**
- Modify: `components/sections/TestimonialsSection.tsx`
- Modify: `components/sections/PricingSection.tsx`
- Modify: `components/sections/FAQSection.tsx`
- Modify: `components/sections/ContactFormSection.tsx`
- Modify: `components/sections/CTASection.tsx`
- Modify: `components/sections/AboutSection.tsx`
- Modify: `components/sections/HeroSection.tsx`

- [ ] **Step 1: Update `TestimonialsSection.tsx`**

Replace import:
```ts
// Before:
import { isDark, mutedText, cardBg } from "./theme";
// After:
import { isDark, mutedText, cardStyle, boldBorderStyle, sectionPadding, headingStyle, itemBorderRadius } from "./theme";
```

Section padding (`py-20` → `sectionPadding`):
```tsx
// Before:
className={cn("px-6 py-20", dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900")}
// After:
className={cn("px-6", sectionPadding(theme.style), dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900")}
```

Heading:
```tsx
// Before:
<h2 className="text-3xl md:text-4xl font-bold tracking-tight">{props.headline}</h2>
// After:
<h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
```

Card:
```tsx
// Before:
<div key={i} className={cn("rounded-xl p-6 flex flex-col gap-4", cardBg(dark))}>
// After:
<div key={i} className={cn(itemBorderRadius(theme.style), "p-6 flex flex-col gap-4", cardStyle(dark, theme.style))} style={boldBorderStyle(theme.style, accent)}>
```

- [ ] **Step 2: Update `PricingSection.tsx`**

Replace import:
```ts
// Before:
import { isDark, mutedText, cardBg } from "./theme";
// After:
import { isDark, mutedText, cardStyle, boldBorderStyle, sectionPadding, headingStyle, itemBorderRadius } from "./theme";
```

Section padding:
```tsx
// Before:
className={cn("px-6 py-20", dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900")}
// After:
className={cn("px-6", sectionPadding(theme.style), dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900")}
```

Heading:
```tsx
// Before:
<h2 className="text-3xl md:text-4xl font-bold tracking-tight">{props.headline}</h2>
// After:
<h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
```

Non-highlighted plan card — update `rounded-xl` + `cardBg`:
```tsx
// Before (the plan.highlighted ternary):
plan.highlighted ? "border-2" : cardBg(dark)
// After:
plan.highlighted
  ? cn("border-2", itemBorderRadius(theme.style))
  : cn(cardStyle(dark, theme.style), itemBorderRadius(theme.style))
```

For highlighted plan inline style — keep existing `borderColor: accent, background: ...` — it already overrides the border for highlighted plans.

Non-highlighted plan cards also get boldBorderStyle. Wrap the `<div>` for each plan:
```tsx
// Before:
<div
  key={i}
  className={cn(
    "rounded-xl p-6 flex flex-col gap-5 relative",
    plan.highlighted ? "border-2" : cardBg(dark)
  )}
  style={plan.highlighted ? { borderColor: accent, background: ... } : {}}
>
// After:
<div
  key={i}
  className={cn(
    itemBorderRadius(theme.style),
    "p-6 flex flex-col gap-5 relative",
    plan.highlighted
      ? "border-2"
      : cn(cardStyle(dark, theme.style))
  )}
  style={
    plan.highlighted
      ? { borderColor: accent, background: dark ? `${accent}0a` : `${accent}05` }
      : boldBorderStyle(theme.style, accent)
  }
>
```

- [ ] **Step 3: Update `FAQSection.tsx`**

Replace import:
```ts
// Before:
import { isDark, mutedText } from "./theme";
// After:
import { isDark, mutedText, sectionPadding, headingStyle } from "./theme";
```

Section padding:
```tsx
// Before:
className={cn("px-6 py-20", dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900")}
// After:
className={cn("px-6", sectionPadding(theme.style), dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900")}
```

Heading:
```tsx
// Before:
<h2 className="text-3xl md:text-4xl font-bold tracking-tight">{props.headline}</h2>
// After:
<h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
```

- [ ] **Step 4: Update `ContactFormSection.tsx`**

Replace import:
```ts
// Before:
import { isDark, mutedText } from "./theme";
// After:
import { isDark, mutedText, sectionPadding, headingStyle, itemBorderRadius } from "./theme";
```

Section padding:
```tsx
// Before:
className={cn("px-6 py-20", dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900")}
// After:
className={cn("px-6", sectionPadding(theme.style), dark ? "bg-[#0a0a0f] text-zinc-100" : "bg-white text-zinc-900")}
```

Heading:
```tsx
// Before:
<h2 className="text-3xl md:text-4xl font-bold tracking-tight">{props.headline}</h2>
// After:
<h2 className={cn("text-3xl md:text-4xl tracking-tight", headingStyle(theme.style))}>{props.headline}</h2>
```

Form container `rounded-2xl` → `itemBorderRadius`:
```tsx
// Before:
className={cn("rounded-2xl p-8", dark ? "bg-zinc-900/60 border border-zinc-800" : "bg-zinc-50 border border-zinc-200")}
// After:
className={cn(itemBorderRadius(theme.style), "p-8", dark ? "bg-zinc-900/60 border border-zinc-800" : "bg-zinc-50 border border-zinc-200")}
```

- [ ] **Step 5: Update `CTASection.tsx`**

Replace import:
```ts
// Before:
import { isDark, mutedText } from "./theme";
// After:
import { isDark, mutedText, sectionPadding, headingStyle } from "./theme";
```

Section padding:
```tsx
// Before:
className={cn("px-6 py-20 relative overflow-hidden", dark ? "bg-[#111118]" : "bg-zinc-50")}
// After:
className={cn("px-6 relative overflow-hidden", sectionPadding(theme.style), dark ? "bg-[#111118]" : "bg-zinc-50")}
```

Heading:
```tsx
// Before:
className={cn("text-3xl md:text-4xl font-bold tracking-tight mb-4", dark ? "text-zinc-100" : "text-zinc-900")}
// After:
className={cn("text-3xl md:text-4xl tracking-tight mb-4", headingStyle(theme.style), dark ? "text-zinc-100" : "text-zinc-900")}
```

- [ ] **Step 6: Update `AboutSection.tsx`**

Replace import:
```ts
// Before:
import { isDark, mutedText, cardBg, borderColor } from "./theme";
// After:
import { isDark, mutedText, cardStyle, boldBorderStyle, sectionPadding, headingStyle, itemBorderRadius } from "./theme";
```

Section padding:
```tsx
// Before:
className={cn("px-6 py-20", dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900")}
// After:
className={cn("px-6", sectionPadding(theme.style), dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900")}
```

Heading:
```tsx
// Before:
<h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">{props.headline}</h2>
// After:
<h2 className={cn("text-3xl md:text-4xl tracking-tight mb-5", headingStyle(theme.style))}>{props.headline}</h2>
```

Stats card `rounded-xl` + `cardBg`:
```tsx
// Before:
className={cn("rounded-xl p-5 text-center", cardBg(dark))}
// After:
className={cn(itemBorderRadius(theme.style), "p-5 text-center", cardStyle(dark, theme.style))}
style={boldBorderStyle(theme.style, accent)}
```

- [ ] **Step 7: Update `HeroSection.tsx`** — heading style only (hero keeps its own padding)

Replace import:
```ts
// Before:
import { isDark, mutedText } from "./theme";
// After:
import { isDark, mutedText, headingStyle, itemBorderRadius } from "./theme";
```

Centered variant heading (`font-extrabold` → `headingStyle`):
```tsx
// Before:
<h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-5">
// After:
<h1 className={cn("text-5xl md:text-6xl tracking-tight leading-[1.05] mb-5", headingStyle(theme.style))}>
```

Split variant heading:
```tsx
// Before:
<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-5">
// After:
<h1 className={cn("text-4xl md:text-5xl tracking-tight leading-[1.1] mb-5", headingStyle(theme.style))}>
```

Split variant placeholder div — `rounded-2xl` → `itemBorderRadius`:
```tsx
// Before:
<div className={cn("rounded-2xl aspect-[4/3] flex items-center justify-center", ...)}>
// After:
<div className={cn(itemBorderRadius(theme.style), "aspect-[4/3] flex items-center justify-center", ...)}>
```

- [ ] **Step 8: Update `FooterSection.tsx`** — business name heading weight only (footer keeps `py-12`)

Replace import:
```ts
// Before:
import { isDark, mutedText } from "./theme";
// After:
import { isDark, mutedText, headingStyle } from "./theme";
```

Business name heading:
```tsx
// Before:
<div className="font-bold text-lg">{props.businessName}</div>
// After:
<div className={cn("text-lg", headingStyle(theme.style))}>{props.businessName}</div>
```

- [ ] **Step 9: Verify types**

```bash
cd /home/harry/asem/landeon && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add components/sections/TestimonialsSection.tsx components/sections/PricingSection.tsx components/sections/FAQSection.tsx components/sections/ContactFormSection.tsx components/sections/CTASection.tsx components/sections/AboutSection.tsx components/sections/HeroSection.tsx components/sections/FooterSection.tsx
git commit -m "feat: apply theme style helpers to all remaining sections"
```

---

## Task 4: ItemListEditor Component

**Files:**
- Create: `components/builder/ItemListEditor.tsx`

- [ ] **Step 1: Create the file with full implementation**

```tsx
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemListEditorProps<T extends object> {
  items: T[];
  onChange: (items: T[]) => void;
  renderFields: (item: T, onChange: (updated: T) => void) => ReactNode;
  getLabel: (item: T, index: number) => string;
  maxItems?: number;
  emptyItem: T;
}

export function ItemListEditor<T extends object>({
  items,
  onChange,
  renderFields,
  getLabel,
  maxItems = 12,
  emptyItem,
}: ItemListEditorProps<T>) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function updateItem(index: number, updated: T) {
    onChange(items.map((item, i) => (i === index ? updated : item)));
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index));
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex !== null && openIndex > index) setOpenIndex(openIndex - 1);
  }

  function addItem() {
    onChange([...items, { ...emptyItem }]);
    setOpenIndex(items.length);
  }

  return (
    <div className="flex flex-col gap-1">
      {items.map((item, i) => (
        <div key={i} className="border border-zinc-800 rounded-lg overflow-hidden">
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between px-2.5 py-2 text-left hover:bg-zinc-800/40 transition-colors"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="text-xs font-medium text-zinc-300 truncate pr-2">
                {getLabel(item, i)}
              </span>
              <ChevronDown
                className={cn(
                  "w-3 h-3 text-zinc-500 flex-shrink-0 transition-transform duration-150",
                  openIndex === i && "rotate-180"
                )}
              />
            </button>
            <button
              onClick={() => removeItem(i)}
              className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          {openIndex === i && (
            <div className="px-2.5 pb-2.5 pt-2 border-t border-zinc-800 flex flex-col gap-2">
              {renderFields(item, (updated) => updateItem(i, updated))}
            </div>
          )}
        </div>
      ))}
      {items.length < maxItems && (
        <button
          onClick={addItem}
          className="flex items-center gap-1.5 px-2.5 py-2 text-xs text-zinc-500 hover:text-zinc-300 border border-dashed border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors mt-1"
        >
          <Plus className="w-3 h-3" />
          Add item
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

```bash
cd /home/harry/asem/landeon && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/builder/ItemListEditor.tsx
git commit -m "feat: add reusable ItemListEditor accordion component"
```

---

## Task 5: SectionPropsEditor — Replace All Item Stubs

**Files:**
- Modify: `components/builder/SectionPropsEditor.tsx`

- [ ] **Step 1: Add import for ItemListEditor**

Add to the top of `SectionPropsEditor.tsx` after existing imports:
```tsx
import { ItemListEditor } from "./ItemListEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
```

- [ ] **Step 2: Replace `features` case**

```tsx
// Before:
case "features":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
      <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} multiline />
      <div className="text-xs text-zinc-500 mt-1">
        <span className="text-zinc-400 font-medium">{section.props.items.length} items</span> — Use AI actions to edit items
      </div>
    </div>
  );

// After:
case "features":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
      <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} multiline />
      <p className="text-xs font-medium text-zinc-400 mt-1">Items</p>
      <ItemListEditor
        items={section.props.items}
        onChange={(items) => update("items", items)}
        maxItems={9}
        emptyItem={{ icon: "Sparkles", title: "New Feature", description: "" }}
        getLabel={(item) => item.title || "Untitled"}
        renderFields={(item, onChange) => (
          <>
            <Field label="Icon (Lucide name)" value={item.icon} onChange={(v) => onChange({ ...item, icon: v })} placeholder="Sparkles" />
            <Field label="Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
            <Field label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} multiline />
          </>
        )}
      />
    </div>
  );
```

- [ ] **Step 3: Replace `services` case**

```tsx
// Before:
case "services":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" ... />
      <Field label="Subheadline" ... />
      <div className="text-xs text-zinc-500 mt-1">
        <span className="text-zinc-400 font-medium">{section.props.items.length} services</span> — Use AI actions to edit items
      </div>
    </div>
  );

// After:
case "services":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
      <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} multiline />
      <p className="text-xs font-medium text-zinc-400 mt-1">Services</p>
      <ItemListEditor
        items={section.props.items}
        onChange={(items) => update("items", items)}
        maxItems={9}
        emptyItem={{ icon: "Briefcase", title: "New Service", description: "", price: "" }}
        getLabel={(item) => item.title || "Untitled"}
        renderFields={(item, onChange) => (
          <>
            <Field label="Icon (Lucide name)" value={item.icon} onChange={(v) => onChange({ ...item, icon: v })} placeholder="Briefcase" />
            <Field label="Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
            <Field label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} multiline />
            <Field label="Price (optional)" value={item.price ?? ""} onChange={(v) => onChange({ ...item, price: v })} placeholder="$99/mo" />
          </>
        )}
      />
    </div>
  );
```

- [ ] **Step 4: Replace `how_it_works` case**

```tsx
// Before:
case "how_it_works":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" ... />
      <Field label="Subheadline" ... />
      <div className="text-xs text-zinc-500">
        <span ...>{section.props.steps.length} steps</span> — Use AI actions to edit steps
      </div>
    </div>
  );

// After:
case "how_it_works":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
      <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} />
      <p className="text-xs font-medium text-zinc-400 mt-1">Steps</p>
      <ItemListEditor
        items={section.props.steps}
        onChange={(steps) => update("steps", steps)}
        maxItems={6}
        emptyItem={{ number: String(section.props.steps.length + 1), title: "New Step", description: "" }}
        getLabel={(item, i) => `${item.number || i + 1}. ${item.title || "Untitled"}`}
        renderFields={(item, onChange) => (
          <>
            <Field label="Number" value={item.number} onChange={(v) => onChange({ ...item, number: v })} placeholder="01" />
            <Field label="Title" value={item.title} onChange={(v) => onChange({ ...item, title: v })} />
            <Field label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} multiline />
          </>
        )}
      />
    </div>
  );
```

- [ ] **Step 5: Replace `testimonials` case**

```tsx
// Before:
case "testimonials":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" ... />
      <Field label="Subheadline" ... />
      <div className="text-xs text-zinc-500">
        <span ...>{section.props.items.length} testimonials</span>
      </div>
    </div>
  );

// After:
case "testimonials":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
      <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} />
      <p className="text-xs font-medium text-zinc-400 mt-1">Testimonials</p>
      <ItemListEditor
        items={section.props.items}
        onChange={(items) => update("items", items)}
        maxItems={6}
        emptyItem={{ quote: "", author: "Name", role: "Role", company: "", rating: 5 }}
        getLabel={(item) => item.author || "Untitled"}
        renderFields={(item, onChange) => (
          <>
            <Field label="Quote" value={item.quote} onChange={(v) => onChange({ ...item, quote: v })} multiline />
            <Field label="Author" value={item.author} onChange={(v) => onChange({ ...item, author: v })} />
            <Field label="Role" value={item.role} onChange={(v) => onChange({ ...item, role: v })} />
            <Field label="Company (optional)" value={item.company ?? ""} onChange={(v) => onChange({ ...item, company: v })} />
            <div className="flex flex-col gap-1.5">
              <Label>Rating</Label>
              <Select
                value={String(item.rating ?? 5)}
                onValueChange={(v) => onChange({ ...item, rating: Number(v) })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n} star{n > 1 ? "s" : ""}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      />
    </div>
  );
```

- [ ] **Step 6: Replace `pricing` case**

```tsx
// Before:
case "pricing":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" ... />
      <Field label="Subheadline" ... />
      <div className="text-xs text-zinc-500">
        <span ...>{section.props.plans.length} plans</span>
      </div>
    </div>
  );

// After:
case "pricing":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
      <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} />
      <p className="text-xs font-medium text-zinc-400 mt-1">Plans</p>
      <ItemListEditor
        items={section.props.plans}
        onChange={(plans) => update("plans", plans)}
        maxItems={4}
        emptyItem={{ name: "New Plan", price: "$0", period: "/mo", description: "", features: ["Feature 1"], ctaText: "Get Started", highlighted: false }}
        getLabel={(item) => item.name || "Untitled"}
        renderFields={(item, onChange) => (
          <>
            <Field label="Plan Name" value={item.name} onChange={(v) => onChange({ ...item, name: v })} />
            <Field label="Price" value={item.price} onChange={(v) => onChange({ ...item, price: v })} placeholder="$49" />
            <Field label="Period" value={item.period} onChange={(v) => onChange({ ...item, period: v })} placeholder="/mo" />
            <Field label="Description" value={item.description} onChange={(v) => onChange({ ...item, description: v })} multiline />
            <Field
              label="Features (one per line)"
              value={item.features.join("\n")}
              onChange={(v) => onChange({ ...item, features: v.split("\n").filter(Boolean) })}
              multiline
            />
            <Field label="CTA Text" value={item.ctaText} onChange={(v) => onChange({ ...item, ctaText: v })} />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`highlighted-${item.name}`}
                checked={item.highlighted}
                onChange={(e) => onChange({ ...item, highlighted: e.target.checked })}
                className="w-3.5 h-3.5 accent-purple-500"
              />
              <label htmlFor={`highlighted-${item.name}`} className="text-xs text-zinc-400">
                Highlighted (most popular)
              </label>
            </div>
          </>
        )}
      />
    </div>
  );
```

- [ ] **Step 7: Replace `faq` case**

```tsx
// Before:
case "faq":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" ... />
      <Field label="Subheadline" ... />
      <div className="text-xs text-zinc-500">
        <span ...>{section.props.items.length} Q&As</span>
      </div>
    </div>
  );

// After:
case "faq":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
      <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} />
      <p className="text-xs font-medium text-zinc-400 mt-1">Questions</p>
      <ItemListEditor
        items={section.props.items}
        onChange={(items) => update("items", items)}
        maxItems={12}
        emptyItem={{ question: "New Question?", answer: "" }}
        getLabel={(item) => item.question || "Untitled"}
        renderFields={(item, onChange) => (
          <>
            <Field label="Question" value={item.question} onChange={(v) => onChange({ ...item, question: v })} />
            <Field label="Answer" value={item.answer} onChange={(v) => onChange({ ...item, answer: v })} multiline />
          </>
        )}
      />
    </div>
  );
```

- [ ] **Step 8: Add stats and highlights editors to `about` case**

The existing `about` case only has Headline and Description. Add stats and highlights after:

```tsx
case "about":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
      <Field label="Description" value={section.props.description} onChange={(v) => update("description", v)} multiline />

      <p className="text-xs font-medium text-zinc-400 mt-1">Highlights</p>
      <ItemListEditor
        items={(section.props.highlights ?? []).map((h) => ({ text: h }))}
        onChange={(items) => update("highlights", items.map((i) => i.text))}
        maxItems={6}
        emptyItem={{ text: "" }}
        getLabel={(item, i) => item.text || `Highlight ${i + 1}`}
        renderFields={(item, onChange) => (
          <Field label="Text" value={item.text} onChange={(v) => onChange({ text: v })} />
        )}
      />

      <p className="text-xs font-medium text-zinc-400 mt-1">Stats</p>
      <ItemListEditor
        items={section.props.stats ?? []}
        onChange={(items) => update("stats", items)}
        maxItems={6}
        emptyItem={{ value: "0", label: "Label" }}
        getLabel={(item) => `${item.value} — ${item.label}`}
        renderFields={(item, onChange) => (
          <>
            <Field label="Value" value={item.value} onChange={(v) => onChange({ ...item, value: v })} placeholder="99%" />
            <Field label="Label" value={item.label} onChange={(v) => onChange({ ...item, label: v })} placeholder="Satisfaction" />
          </>
        )}
      />
    </div>
  );
```

- [ ] **Step 9: Add links editor to `footer` case**

Append links editor to the existing footer case, after the Copyright field:

```tsx
case "footer":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Business Name" value={section.props.businessName} onChange={(v) => update("businessName", v)} />
      <Field label="Tagline" value={section.props.tagline ?? ""} onChange={(v) => update("tagline", v)} />
      <Field label="Email" value={section.props.contactEmail ?? ""} onChange={(v) => update("contactEmail", v)} />
      <Field label="Phone" value={section.props.contactPhone ?? ""} onChange={(v) => update("contactPhone", v)} />
      <Field label="Copyright" value={section.props.copyright} onChange={(v) => update("copyright", v)} />

      <p className="text-xs font-medium text-zinc-400 mt-1">Links</p>
      <ItemListEditor
        items={section.props.links ?? []}
        onChange={(items) => update("links", items)}
        maxItems={8}
        emptyItem={{ label: "Link", href: "#" }}
        getLabel={(item) => item.label || "Untitled"}
        renderFields={(item, onChange) => (
          <>
            <Field label="Label" value={item.label} onChange={(v) => onChange({ ...item, label: v })} />
            <Field label="URL" value={item.href} onChange={(v) => onChange({ ...item, href: v })} placeholder="https://..." />
          </>
        )}
      />
    </div>
  );
```

- [ ] **Step 10: Verify types**

```bash
cd /home/harry/asem/landeon && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 11: Commit**

```bash
git add components/builder/SectionPropsEditor.tsx
git commit -m "feat: replace AI-only item stubs with manual ItemListEditor for all sections"
```

---

## Task 6: Schema Changes for Image Fields

**Files:**
- Modify: `types/index.ts`
- Modify: `lib/schema/sections.ts`

- [ ] **Step 1: Add image fields to `HeroSectionProps` in `types/index.ts`**

```ts
// Before:
export interface HeroSectionProps {
  headline: string;
  subheadline?: string;
  description: string;
  ctaText: string;
  ctaSecondaryText?: string;
  badge?: string;
}

// After:
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
}
```

- [ ] **Step 2: Add image fields to `AboutSectionProps` in `types/index.ts`**

```ts
// Before:
export interface AboutSectionProps {
  headline: string;
  description: string;
  stats?: Array<{ value: string; label: string }>;
  highlights?: string[];
}

// After:
export interface AboutSectionProps {
  headline: string;
  description: string;
  stats?: Array<{ value: string; label: string }>;
  highlights?: string[];
  imageUrl?: string;
  imageAlt?: string;
  imageAttribution?: string;
}
```

- [ ] **Step 3: Update `HeroPropsSchema` in `lib/schema/sections.ts`**

```ts
// Before:
export const HeroPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(120).optional(),
  description: z.string().min(1).max(400),
  ctaText: z.string().min(1).max(60),
  ctaSecondaryText: z.string().max(60).optional(),
  badge: z.string().max(60).optional(),
});

// After:
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
});
```

- [ ] **Step 4: Update `AboutPropsSchema` in `lib/schema/sections.ts`**

```ts
// Before:
export const AboutPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  description: z.string().min(1).max(800),
  stats: z.array(z.object({ value: z.string().max(20), label: z.string().max(60) })).max(6).optional(),
  highlights: z.array(z.string().max(100)).max(6).optional(),
});

// After:
export const AboutPropsSchema = z.object({
  headline: z.string().min(1).max(120),
  description: z.string().min(1).max(800),
  stats: z.array(z.object({ value: z.string().max(20), label: z.string().max(60) })).max(6).optional(),
  highlights: z.array(z.string().max(100)).max(6).optional(),
  imageUrl: z.string().url().optional(),
  imageAlt: z.string().max(200).optional(),
  imageAttribution: z.string().max(300).optional(),
});
```

- [ ] **Step 5: Verify types**

```bash
cd /home/harry/asem/landeon && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add types/index.ts lib/schema/sections.ts
git commit -m "feat: add imageUrl/imageAlt/imageAttribution fields to Hero and About schemas"
```

---

## Task 7: Unsplash API Route + Env Config

**Files:**
- Create: `app/api/unsplash/search/route.ts`
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: Add env key**

In `.env`, append:
```
UNSPLASH_ACCESS_KEY=your_key_here
```

In `.env.example`, append:
```
# Unsplash (free tier — get key at unsplash.com/developers)
UNSPLASH_ACCESS_KEY=your_key_here
```

Get a free key at `https://unsplash.com/developers` — takes 2 minutes, no approval needed for demo usage.

- [ ] **Step 2: Create the API route**

Create directory and file `app/api/unsplash/search/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";

export interface UnsplashPhoto {
  id: string;
  urls: { small: string; regular: string };
  alt_description: string | null;
  user: { name: string; links: { html: string } };
}

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("query");
  if (!query) {
    return NextResponse.json({ error: "query is required" }, { status: 400 });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json({ error: "UNSPLASH_ACCESS_KEY not configured" }, { status: 500 });
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", "12");
  url.searchParams.set("orientation", "landscape");

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Client-ID ${accessKey}` },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Unsplash request failed" }, { status: res.status });
  }

  const data = await res.json();
  const photos: UnsplashPhoto[] = data.results.map((p: UnsplashPhoto) => ({
    id: p.id,
    urls: { small: p.urls.small, regular: p.urls.regular },
    alt_description: p.alt_description,
    user: { name: p.user.name, links: { html: p.user.links.html } },
  }));

  return NextResponse.json({ photos });
}
```

- [ ] **Step 3: Verify types**

```bash
cd /home/harry/asem/landeon && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/api/unsplash/search/route.ts .env.example
git commit -m "feat: add Unsplash search API proxy route"
```

---

## Task 8: UnsplashPickerModal Component

**Files:**
- Create: `components/builder/UnsplashPickerModal.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { Search, Loader2, X, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { UnsplashPhoto } from "@/app/api/unsplash/search/route";

interface PickedImage {
  imageUrl: string;
  imageAlt: string;
  imageAttribution: string;
}

interface Props {
  onSelect: (image: PickedImage) => void;
  onClose: () => void;
}

export function UnsplashPickerModal({ onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/unsplash/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setPhotos(data.photos);
      setSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(photo: UnsplashPhoto) {
    onSelect({
      imageUrl: photo.urls.regular,
      imageAlt: photo.alt_description ?? "",
      imageAttribution: `Photo by ${photo.user.name} on Unsplash`,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-lg mx-4 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <p className="text-sm font-semibold text-zinc-200">Choose a photo</p>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pt-3 pb-2 flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search photos…"
            className="h-8 text-xs flex-1"
          />
          <Button size="sm" onClick={handleSearch} disabled={loading} className="h-8 gap-1.5">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
            Search
          </Button>
        </div>

        {/* Results */}
        <div className="px-4 pb-4 min-h-[200px]">
          {error && (
            <p className="text-xs text-red-400 py-4 text-center">{error}</p>
          )}
          {!error && searched && photos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
              <ImageOff className="w-8 h-8 mb-2" />
              <p className="text-xs">No photos found</p>
            </div>
          )}
          {!error && photos.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {photos.slice(0, 12).map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => handleSelect(photo)}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden group border-2 border-transparent hover:border-purple-500 transition-all"
                  >
                    <img
                      src={photo.urls.small}
                      alt={photo.alt_description ?? ""}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </button>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-3 text-center">
                Photos from{" "}
                <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="underline hover:text-zinc-400">
                  Unsplash
                </a>
              </p>
            </>
          )}
          {!searched && !loading && (
            <div className="flex items-center justify-center py-8">
              <p className="text-xs text-zinc-600">Search for free, copyright-free photos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

```bash
cd /home/harry/asem/landeon && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/builder/UnsplashPickerModal.tsx
git commit -m "feat: add UnsplashPickerModal for copyright-free photo search"
```

---

## Task 9: Wire Images into SectionPropsEditor + Hero/About Rendering

**Files:**
- Modify: `components/builder/SectionPropsEditor.tsx`
- Modify: `components/sections/HeroSection.tsx`
- Modify: `components/sections/AboutSection.tsx`

- [ ] **Step 1: Add image picker to `SectionPropsEditor` for `hero` and `about` cases**

Add import at the top of `SectionPropsEditor.tsx`:
```tsx
import { useState } from "react";
import { UnsplashPickerModal } from "./UnsplashPickerModal";
import { Image, X } from "lucide-react";
```

Add a helper component at the top of the file (above `Field`):

```tsx
function ImageField({
  imageUrl,
  imageAttribution,
  onPick,
  onClear,
}: {
  imageUrl?: string;
  imageAttribution?: string;
  onPick: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>Image</Label>
      {imageUrl ? (
        <div className="relative">
          <img src={imageUrl} alt="" className="w-full aspect-[16/9] object-cover rounded-lg" />
          <button
            onClick={onClear}
            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white hover:bg-black transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
          {imageAttribution && (
            <p className="text-xs text-zinc-600 mt-1 truncate">{imageAttribution}</p>
          )}
        </div>
      ) : (
        <button
          onClick={onPick}
          className="flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 border border-dashed border-zinc-700 rounded-lg hover:border-zinc-600 transition-colors"
        >
          <Image className="w-3.5 h-3.5" />
          Choose photo from Unsplash
        </button>
      )}
      {imageUrl && (
        <button
          onClick={onPick}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors text-left"
        >
          Change photo
        </button>
      )}
    </div>
  );
}
```

Update the `SectionPropsEditor` function signature to use `useState`:
```tsx
export function SectionPropsEditor({ section }: Props) {
  const { updateSectionProps } = useBuilderStore();
  const [showUnsplash, setShowUnsplash] = useState(false);

  function update(key: string, value: unknown) {
    updateSectionProps(section.id, { [key]: value });
  }
  // ... rest of function
```

Add image picker at the end of the `hero` case (after the Badge field):
```tsx
case "hero":
  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline" value={section.props.headline} onChange={(v) => update("headline", v)} />
      <Field label="Subheadline" value={section.props.subheadline ?? ""} onChange={(v) => update("subheadline", v)} />
      <Field label="Description" value={section.props.description} onChange={(v) => update("description", v)} multiline />
      <Field label="CTA Button Text" value={section.props.ctaText} onChange={(v) => update("ctaText", v)} placeholder="Get Started" />
      <Field label="Secondary CTA" value={section.props.ctaSecondaryText ?? ""} onChange={(v) => update("ctaSecondaryText", v)} placeholder="Learn more" />
      <Field label="Badge Text" value={section.props.badge ?? ""} onChange={(v) => update("badge", v)} placeholder="New" />
      <ImageField
        imageUrl={section.props.imageUrl}
        imageAttribution={section.props.imageAttribution}
        onPick={() => setShowUnsplash(true)}
        onClear={() => update("imageUrl", undefined)}
      />
      {showUnsplash && (
        <UnsplashPickerModal
          onSelect={(img) => {
            update("imageUrl", img.imageUrl);
            update("imageAlt", img.imageAlt);
            update("imageAttribution", img.imageAttribution);
            setShowUnsplash(false);
          }}
          onClose={() => setShowUnsplash(false)}
        />
      )}
    </div>
  );
```

Add image picker at the end of the `about` case:
```tsx
// Inside about case, after the Stats ItemListEditor, append:
<ImageField
  imageUrl={section.props.imageUrl}
  imageAttribution={section.props.imageAttribution}
  onPick={() => setShowUnsplash(true)}
  onClear={() => update("imageUrl", undefined)}
/>
{showUnsplash && (
  <UnsplashPickerModal
    onSelect={(img) => {
      update("imageUrl", img.imageUrl);
      update("imageAlt", img.imageAlt);
      update("imageAttribution", img.imageAttribution);
      setShowUnsplash(false);
    }}
    onClose={() => setShowUnsplash(false)}
  />
)}
```

- [ ] **Step 2: Update `HeroSection.tsx` — render image in split variant**

Replace the placeholder `<div>` (the one with "Visual / Screenshot" text) with:

```tsx
{/* Visual / image */}
{props.imageUrl ? (
  <div className="flex flex-col gap-1.5">
    <img
      src={props.imageUrl}
      alt={props.imageAlt ?? ""}
      className={cn(
        "aspect-[4/3] object-cover w-full",
        itemBorderRadius(theme.style)
      )}
    />
    {props.imageAttribution && (
      <p className={cn("text-xs", mutedText(dark))}>{props.imageAttribution}</p>
    )}
  </div>
) : (
  <div
    className={cn(
      "aspect-[4/3] flex items-center justify-center",
      itemBorderRadius(theme.style),
      dark ? "bg-zinc-900/80 border border-zinc-800" : "bg-zinc-100 border border-zinc-200"
    )}
  >
    <div className="text-center">
      <div
        className="w-16 h-16 rounded-2xl mx-auto mb-3 flex items-center justify-center"
        style={{ background: `${accent}20` }}
      >
        <div className="w-8 h-8 rounded-full" style={{ background: accent }} />
      </div>
      <p className={cn("text-sm", mutedText(dark))}>Visual / Screenshot</p>
    </div>
  </div>
)}
```

- [ ] **Step 3: Update `AboutSection.tsx` — render image in two-column layout**

In `AboutSection`, after closing the existing `<div className="max-w-3xl">` block and before the stats grid, insert the image layout:

```tsx
// Full updated AboutSection return:
return (
  <section
    className={cn("px-6", sectionPadding(theme.style), dark ? "bg-[#111118] text-zinc-100" : "bg-zinc-50 text-zinc-900")}
  >
    <div className="max-w-5xl mx-auto">
      <div className={cn(props.imageUrl ? "grid md:grid-cols-2 gap-12 items-start" : "")}>
        <div className="max-w-3xl">
          <h2 className={cn("text-3xl md:text-4xl tracking-tight mb-5", headingStyle(theme.style))}>
            {props.headline}
          </h2>
          <p className={cn("text-base leading-relaxed", mutedText(dark))}>{props.description}</p>

          {props.highlights && props.highlights.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-3">
              {props.highlights.map((h, i) => (
                <li
                  key={i}
                  className={cn(
                    "flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg",
                    dark ? "bg-zinc-800/60 text-zinc-300" : "bg-white text-zinc-700 border border-zinc-200"
                  )}
                >
                  <Check className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
                  {h}
                </li>
              ))}
            </ul>
          )}
        </div>

        {props.imageUrl && (
          <div className="flex flex-col gap-2">
            <img
              src={props.imageUrl}
              alt={props.imageAlt ?? ""}
              className={cn("w-full object-cover aspect-[4/3]", itemBorderRadius(theme.style))}
            />
            {props.imageAttribution && (
              <p className={cn("text-xs", mutedText(dark))}>{props.imageAttribution}</p>
            )}
          </div>
        )}
      </div>

      {props.stats && props.stats.length > 0 && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {props.stats.map((stat, i) => (
            <div
              key={i}
              className={cn(itemBorderRadius(theme.style), "p-5 text-center", cardStyle(dark, theme.style))}
              style={boldBorderStyle(theme.style, accent)}
            >
              <div className="text-3xl font-extrabold mb-1" style={{ color: accent }}>
                {stat.value}
              </div>
              <div className={cn("text-xs", mutedText(dark))}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  </section>
);
```

- [ ] **Step 4: Verify types**

```bash
cd /home/harry/asem/landeon && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Verify build**

```bash
cd /home/harry/asem/landeon && npm run build
```

Expected: build completes without errors.

- [ ] **Step 6: Final commit**

```bash
git add components/builder/SectionPropsEditor.tsx components/sections/HeroSection.tsx components/sections/AboutSection.tsx
git commit -m "feat: wire Unsplash image picker into SectionPropsEditor, render images in Hero and About"
```

---

## Verification Checklist

After all tasks complete, manually verify in the browser (`npm run dev`):

- [ ] Change theme style → all sections update simultaneously (padding, heading weight, card radius)
- [ ] Click a Features section → items expand/collapse, fields editable, add/delete work
- [ ] Click a Pricing section → plan name/price/features editable, highlighted checkbox works
- [ ] Hero (split variant) → "Choose photo from Unsplash" button appears in right panel
- [ ] Search "mountain" in Unsplash picker → grid of photos appears, click selects and shows in hero
- [ ] Clear button removes image, placeholder div returns
- [ ] `npm run lint` passes with no errors
