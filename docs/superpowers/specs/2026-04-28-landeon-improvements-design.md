# Landeon Improvements Design
**Date:** 2026-04-28  
**Scope:** 3 critical fixes for diploma MVP — manual item editing, Unsplash photos, working theme styles  
**Timeline:** 2–3 days

---

## Problem Summary

Three core issues make the builder feel incomplete:

1. **Items are not manually editable** — Features, Services, HowItWorks, Testimonials, Pricing, FAQ, About all show "Use AI actions to edit items" instead of inline editors. Users cannot change text without AI.
2. **No photos** — Hero split variant has a hardcoded placeholder div. No way to insert copyright-free images.
3. **Theme style is a no-op** — `theme.style` (`modern` / `minimal` / `bold` / `elegant`) exists in types and ThemeEditor UI, but is completely ignored by all 11 section components. All sites look the same regardless of style.

---

## Feature 1: Manual Item Editing

### Goal
Every field of every section item is editable inline in the right panel, without AI.

### Architecture

**New component: `ItemListEditor`**  
A reusable component in `components/builder/ItemListEditor.tsx` that renders an accordion list of items. Each item has:
- A collapsed header showing a label (e.g. item title or index)
- An expand/collapse toggle
- Delete button
- Full field editors when expanded

Accepts:
```ts
interface ItemListEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  renderFields: (item: T, onChange: (item: T) => void) => React.ReactNode;
  getLabel: (item: T, index: number) => string;
  maxItems?: number;
  emptyItem: T;
}
```

**Updates to `SectionPropsEditor`**  
Replace all "Use AI actions to edit items" stubs with `ItemListEditor` calls for:

| Section | Array field | Fields per item |
|---|---|---|
| `features` | `items` | icon (text), title, description |
| `services` | `items` | icon (text), title, description, price? |
| `how_it_works` | `steps` | number, title, description |
| `testimonials` | `items` | quote (multiline), author, role, company?, rating (1–5 select) |
| `pricing` | `plans` | name, price, period, description, features (textarea, one per line), ctaText, highlighted (checkbox) |
| `faq` | `items` | question, answer (multiline) |
| `about` | `stats`, `highlights` | stats: value + label; highlights: single text per item |
| `footer` | `links` | label, href |

**Store:** `updateSectionProps` already handles partial updates — no store changes needed. `ItemListEditor` calls it via the existing `update(key, value)` pattern in `SectionPropsEditor`.

---

## Feature 2: Unsplash Photo Integration

### Goal
Users can search and insert copyright-free photos into Hero and About sections.

### Schema Changes

`HeroSectionProps` (in `types/index.ts` and `lib/schema/sections.ts`):
```ts
imageUrl?: string;
imageAlt?: string;
imageAttribution?: string; // "Photo by X on Unsplash"
```

`AboutSectionProps`:
```ts
imageUrl?: string;
imageAlt?: string;
imageAttribution?: string;
```

### API Route

`/app/api/unsplash/search/route.ts`  
Proxies to `https://api.unsplash.com/search/photos` with `UNSPLASH_ACCESS_KEY` from env.  
Query params forwarded: `query`, `per_page` (default 12).  
Returns simplified shape: `{ id, urls: { small, regular }, alt_description, user: { name, links: { html } } }[]`

### New Component: `UnsplashPickerModal`

`components/builder/UnsplashPickerModal.tsx`

- Triggered by "Choose photo" button in `SectionPropsEditor`
- Search input + Search button
- 2×3 image grid (small previews, `object-cover`)
- Click selects: sets `imageUrl` (regular URL), `imageAlt`, `imageAttribution`
- Loading and empty states
- Close button / click outside to close

**Placement in `SectionPropsEditor`:** For `hero` and `about` sections, render an image field group below existing fields:
```
[current image preview or placeholder]
[Choose photo button] [Clear button if imageUrl set]
[Attribution line if imageUrl set]
```

### Rendering Changes

**`HeroSection` (split variant):**  
Replace the placeholder `<div>` with:
```tsx
{props.imageUrl ? (
  <img src={props.imageUrl} alt={props.imageAlt} className="rounded-2xl aspect-[4/3] object-cover w-full" />
  // attribution below image, small muted text
) : (
  // existing placeholder div — unchanged
)}
```

**`AboutSection`:**  
If `imageUrl` is set, render a two-column layout: image left, text right. If no image, keep existing single-column layout.

### Config

Add to `.env` and `.env.example`:
```
UNSPLASH_ACCESS_KEY=your_key_here
```

---

## Feature 3: Working Theme Styles

### Goal
Selecting `modern` / `minimal` / `bold` / `elegant` in ThemeEditor visually changes all 11 sections consistently — one theme, one look across the whole site.

### Style Definitions

| Style | Cards | Border radius | Border | Padding | Heading weight |
|---|---|---|---|---|---|
| `modern` | bg + subtle border | `rounded-xl` | `border` | `py-20` | `font-bold` |
| `minimal` | transparent bg, thin border | `rounded-lg` | `border` | `py-24` | `font-semibold` |
| `bold` | bg + accent-color border (2px) | `rounded-2xl` | `border-2` accent | `py-16` | `font-extrabold` |
| `elegant` | bg + thin border | `rounded` | `border` | `py-28` | `font-semibold` |

### Architecture

Extend `components/sections/theme.ts` with new helpers:

```ts
export function cardStyle(dark: boolean, style: ThemeStyle, accent?: string): string
export function sectionPadding(style: ThemeStyle): string
export function headingStyle(style: ThemeStyle): string
export function itemBorderRadius(style: ThemeStyle): string
```

All 11 section components (`HeroSection`, `AboutSection`, `FeaturesSection`, `ServicesSection`, `HowItWorksSection`, `TestimonialsSection`, `PricingSection`, `FAQSection`, `ContactFormSection`, `CTASection`, `FooterSection`) replace hardcoded classes with calls to these helpers.

`theme` prop is already passed to all sections — no props changes needed.

**`ThemeEditor`:** no UI changes needed. Style select already exists and saves to store.

---

## File Change Summary

| File | Change |
|---|---|
| `types/index.ts` | Add `imageUrl?`, `imageAlt?`, `imageAttribution?` to Hero and About props |
| `lib/schema/sections.ts` | Same additions to Zod schemas |
| `components/sections/theme.ts` | Add `cardStyle`, `sectionPadding`, `headingStyle`, `itemBorderRadius` |
| `components/sections/*.tsx` (all 11) | Use new theme helpers; Hero/About render image |
| `components/builder/ItemListEditor.tsx` | New reusable accordion item editor |
| `components/builder/SectionPropsEditor.tsx` | Replace stubs with ItemListEditor; add image fields |
| `components/builder/UnsplashPickerModal.tsx` | New photo picker modal |
| `app/api/unsplash/search/route.ts` | New API proxy route |
| `.env` / `.env.example` | Add `UNSPLASH_ACCESS_KEY` |

---

## Out of Scope

- Font family customization (post-diploma)
- Per-section style overrides
- Unsplash for sections other than Hero and About
- Animation / transitions
- Mobile responsive builder UI
