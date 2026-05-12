# Landeon — AI Landing Page Builder

A diploma-project MVP: an AI-powered landing page generator for small businesses.
Users describe their business, the AI generates a structured JSON landing page,
and the app renders it using a controlled React component library.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui primitives |
| AI | OpenRouter Free Models Router |
| State | Zustand |
| Database | PostgreSQL via Prisma |
| DnD | dnd-kit |
| Export | JSZip |
| Validation | Zod |

---

## Setup Instructions

### 1. Clone and install

```bash
git clone <repo>
cd landeon
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/landeon"
OPENROUTER_API_KEY="your-openrouter-api-key"
OPENROUTER_MODELS="openrouter/free,google/gemma-4-26b-a4b-it:free,qwen/qwen3-next-80b-a3b-instruct:free"
OPENROUTER_APP_NAME="Landeon"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Create a free OpenRouter API key at: https://openrouter.ai/keys

### 3. Set up the database

```bash
npm run db:generate     # generates Prisma client
npm run db:push         # creates tables
npm run db:seed         # loads demo project (optional)
```

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000

### PM2 production run

The app can run under PM2 as two managed processes:

```bash
npm run pm2:start      # build and start landeon-postgres + landeon-web
npm run pm2:restart    # rebuild and reload both processes
npm run pm2:stop       # stop both processes
npm run pm2:logs       # show logs
```

Runtime endpoints:
- Web app: http://localhost:3004
- Local PostgreSQL: 127.0.0.1:55432

After changing the PM2 process list, save it:

```bash
pm2 save
```

To enable restore after reboot, run the command printed by:

```bash
pm2 startup systemd -u harry --hp /home/harry
```

---

## Architecture Decisions

### JSON-first rendering

The AI never generates raw HTML or React code. Instead, it outputs a
**structured JSON** (`LandingPage`) that is validated with Zod and rendered
by a finite library of predefined React section components. This ensures:
- Predictable, sanitisable AI output
- Full control over the visual result
- Export independence (same JSON → static HTML)

### Section component system

Each section type lives in `components/sections/`:

```
hero           → HeroSection.tsx        (2 variants: centered, split)
about          → AboutSection.tsx
features       → FeaturesSection.tsx    (2 variants: grid, alternating)
services       → ServicesSection.tsx
how_it_works   → HowItWorksSection.tsx
testimonials   → TestimonialsSection.tsx
pricing        → PricingSection.tsx
faq            → FAQSection.tsx
contact_form   → ContactFormSection.tsx
cta            → CTASection.tsx
footer         → FooterSection.tsx
```

`SectionRenderer.tsx` is the single dispatch point — it receives a `Section`
and a `PageTheme` and picks the right component.

### AI prompts

All prompt templates live in `lib/ai/prompts.ts`:
- `buildGenerationPrompt(brief)` — full page generation from brief
- `buildSectionActionPrompt(actionType, section, context)` — section-level actions

The AI is instructed to return **only valid JSON**, requested via OpenRouter `response_format`.
Output is extracted, parsed, and validated against the Zod schema.
On validation failure, the original content is returned (graceful fallback).

### AI actions available

| Action | Description |
|---|---|
| `rewrite_section` | Fresh persuasive copy, same structure |
| `make_shorter` | Cut text by ~40%, keep the message |
| `make_premium` | Elevated, luxury tone |
| `make_formal` | Professional B2B tone |
| `regenerate_section` | Completely new approach to the section |
| `suggest_cta` | Improve CTA button text only |

### Export pipeline

1. User clicks Export → `GET /api/export/[id]`
2. Server fetches project, validates `pageJson` against Zod schema
3. `lib/export/htmlGenerator.ts` renders each section to static HTML strings
4. `lib/export/zipBuilder.ts` packages into a ZIP with JSZip:
   - `index.html` — the full page
   - `styles.css` — self-contained CSS (uses CSS custom properties for theming)
   - `site.json` — the raw page JSON
   - `README.txt` — usage notes
5. ZIP is streamed back as `application/zip`

The exported HTML is deterministic — same JSON always produces the same HTML.
It requires no build step and works by opening `index.html` in any browser.

### State management

Zustand store in `store/builderStore.ts` holds:
- The full project + pageJson
- Selected section ID
- Dirty/saving/AI-loading flags

All section mutations (edit, delete, duplicate, reorder, replace) are pure
functions — they copy the arrays and return new state objects, avoiding mutation.

---

## Project Structure

```
landeon/
├── app/
│   ├── page.tsx                  # Home / prompt screen
│   ├── layout.tsx
│   ├── globals.css
│   ├── builder/[id]/page.tsx     # Builder screen
│   └── api/
│       ├── projects/             # CRUD
│       ├── ai/generate/          # Full page generation
│       ├── ai/section/           # Section AI actions
│       └── export/[id]/          # ZIP export
├── components/
│   ├── builder/                  # Builder UI panels
│   ├── home/                     # Home screen components
│   ├── sections/                 # Section renderers
│   └── ui/                       # Shared UI primitives
├── lib/
│   ├── ai/                       # OpenRouter client + prompts + generation
│   ├── export/                   # HTML + ZIP generators
│   ├── schema/                   # Zod schemas
│   ├── db.ts                     # Prisma singleton
│   └── utils.ts                  # Utilities
├── store/
│   └── builderStore.ts           # Zustand builder state
├── types/
│   └── index.ts                  # All TypeScript types
└── prisma/
    ├── schema.prisma
    └── seed.ts
```

---

## Database Models

### Project
Stores the full landing page JSON alongside all brief fields.

### AIGenerationLog
Audit trail of every AI call — input brief, output JSON, action type.

### ExportRecord
Logs every ZIP export with metadata.

---

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENROUTER_MODELS` | Comma-separated fallback list, max 3 models per request |
| `OPENROUTER_MODEL` | Optional single OpenRouter model id |
| `OPENROUTER_APP_NAME` | Optional app title sent to OpenRouter |
| `UNSPLASH_APPLICATION_ID` | Unsplash app id |
| `UNSPLASH_ACCESS_KEY` | Unsplash access key used by server API routes |
| `UNSPLASH_SECRET_KEY` | Unsplash secret key, stored server-side only |
| `NEXT_PUBLIC_APP_URL` | Public app URL (used for metadata) |
