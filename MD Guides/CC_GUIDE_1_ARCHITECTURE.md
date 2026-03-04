# Claude Code Build Guide — Part 1: Architecture & Stack
## Epstein Files Research Database

---

## Project Overview

You are building a public-facing investigative research website that presents three large structured
markdown files as a searchable, browsable, cross-linked database. The three source files are:

- `epstein_people_dossier.md` — ~50+ named individuals across 10 categories
- `epstein_master_timeline.md` — 130+ dated events across 6 chronological eras
- `epstein_themes_synthesis.md` — 17 thematic topic sections

The site must handle users ranging from casual readers to journalists doing deep research. It must
never overwhelm on first load; information is revealed progressively as users drill down.

---

## Technology Stack

### Framework: Next.js 14 (App Router, static export)
- Use `output: 'export'` in `next.config.js` for fully static output
- No server-side logic required; all data is pre-built at compile time
- Deploy target: Vercel (recommended) or GitHub Pages

### Styling: Tailwind CSS
- Use the default Tailwind config with a custom dark/neutral color palette (see UX guide)
- No component libraries — build all UI from scratch per the UX spec

### Search: Fuse.js
- Client-side fuzzy search across all three datasets simultaneously
- Pre-build a unified search index at compile time (see Data Pipeline guide)

### Network Graph: D3.js (v7)
- Force-directed graph for the people connections view
- Nodes = people; edges = documented connections (co-flights, shared events, financial ties)
- Render in an SVG canvas with zoom/pan

### Timeline: Custom React component
- Horizontal scrollable timeline with D3 for scale/zoom
- No third-party timeline library (they're too opinionated)

### Icons: Lucide React

### Markdown/Data parsing: gray-matter + remark (used at build time only, in scripts)

---

## Project Directory Structure

```
/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← root layout with nav + search bar
│   │   ├── page.tsx             ← Home (landing page)
│   │   ├── people/
│   │   │   ├── page.tsx         ← People directory (filterable grid)
│   │   │   └── [slug]/
│   │   │       └── page.tsx     ← Person detail page
│   │   ├── timeline/
│   │   │   └── page.tsx         ← Filterable timeline view
│   │   ├── themes/
│   │   │   └── page.tsx         ← Themes accordion browser
│   │   ├── graph/
│   │   │   └── page.tsx         ← Network connection graph (full page)
│   │   └── search/
│   │       └── page.tsx         ← Search results page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── GlobalSearch.tsx
│   │   │   └── Footer.tsx
│   │   ├── people/
│   │   │   ├── PersonCard.tsx
│   │   │   ├── PersonDetail.tsx
│   │   │   ├── CategoryFilter.tsx
│   │   │   └── ConnectionList.tsx
│   │   ├── timeline/
│   │   │   ├── TimelineView.tsx
│   │   │   ├── TimelineEvent.tsx
│   │   │   └── EraFilter.tsx
│   │   ├── themes/
│   │   │   ├── ThemeAccordion.tsx
│   │   │   └── ThemeSection.tsx
│   │   ├── graph/
│   │   │   └── NetworkGraph.tsx
│   │   └── shared/
│   │       ├── Badge.tsx         ← Category/status badge
│   │       ├── UnverifiedBanner.tsx
│   │       ├── DiscrepancyFlag.tsx
│   │       ├── SourceTag.tsx
│   │       └── CrossLink.tsx     ← Internal link chip (person/event/theme)
│   ├── data/
│   │   ├── people.json          ← parsed from epstein_people_dossier.md
│   │   ├── timeline.json        ← parsed from epstein_master_timeline.md
│   │   ├── themes.json          ← parsed from epstein_themes_synthesis.md
│   │   ├── connections.json     ← derived relationship graph edges
│   │   └── search-index.json    ← unified Fuse.js search corpus
│   ├── lib/
│   │   ├── search.ts            ← Fuse.js configuration and query helpers
│   │   ├── graph.ts             ← D3 graph data prep helpers
│   │   └── utils.ts             ← slugify, date formatting, etc.
│   └── types/
│       └── index.ts             ← TypeScript interfaces for all data shapes
├── scripts/
│   ├── parse-people.ts          ← converts epstein_people_dossier.md → people.json
│   ├── parse-timeline.ts        ← converts epstein_master_timeline.md → timeline.json
│   ├── parse-themes.ts          ← converts epstein_themes_synthesis.md → themes.json
│   └── build-connections.ts    ← cross-references all files to derive connections.json
├── source-data/
│   ├── epstein_people_dossier.md
│   ├── epstein_master_timeline.md
│   └── epstein_themes_synthesis.md
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Data Models (TypeScript interfaces)

These are the canonical shapes for all data in the application. All parsing scripts must
produce output conforming to these interfaces.

```typescript
// src/types/index.ts

export type PersonCategory =
  | 'principal'           // Jeffrey Epstein
  | 'inner-circle'        // Maxwell, Kellen, Groff, etc.
  | 'political'           // Trump, Clinton, etc.
  | 'financial'           // Wexner, Black, Gates (financial connection)
  | 'legal'               // Dershowitz, Indyke, Acosta
  | 'intelligence'        // Barak, Mossad allegations
  | 'academic-scientific' // Chomsky, Nowak, etc.
  | 'media'               // Wolff, Thomas, etc.
  | 'victim'              // Named victims
  | 'law-enforcement'     // FBI/DOJ investigators
  | 'other';

export type VerificationStatus = 'verified' | 'unverified' | 'contested' | 'discrepancy';

export type SourceTag =
  | 'CBS' | 'NPR' | 'WSJ' | 'NYT' | 'CNN' | 'Bloomberg'
  | 'DOJ' | 'FBI' | 'HO' | 'SJ' | 'JMail' | 'GH' | 'OSINT'
  | 'Maxwell-trial' | 'Giuffre-deposition' | 'Palm-Beach-PD';

export interface Person {
  id: string;                         // slugified name, e.g. "ghislaine-maxwell"
  name: string;
  aliases?: string[];
  born?: string;
  died?: string;
  category: PersonCategory;
  subcategory?: string;               // e.g. "immunity-grantee", "co-conspirator"
  currentStatus?: string;
  mentionCount?: number;              // from DOJ files mention frequency table
  flightLegs?: number;
  summary: string;                    // 2–3 sentence lead (shown on card)
  sections: PersonSection[];          // full detail, shown on person detail page
  timelineEventIds: string[];         // IDs of timeline events this person appears in
  themeIds: string[];                 // IDs of theme sections this person appears in
  connectionIds: string[];            // IDs of other Person records (edges)
  sources: SourceTag[];
}

export interface PersonSection {
  title: string;                      // e.g. "Background", "Operational Role", "Finances"
  content: string;                    // markdown text
  verificationStatus?: VerificationStatus;
  sources: SourceTag[];
  efta?: string[];                    // EFTA document numbers referenced
}

export interface TimelineEvent {
  id: string;
  date: string;                       // ISO 8601 or partial: "1974", "1974-03", "1974-03-15"
  dateDisplay: string;                // human-readable: "~1974", "March 15, 1974"
  era: TimelineEra;
  title: string;
  body: string;                       // full markdown content
  peopleIds: string[];                // Person IDs mentioned
  themeIds: string[];                 // Theme section IDs
  sources: SourceTag[];
  efta?: string[];
  verificationStatus?: VerificationStatus;
  tags: string[];                     // free-form tags: "financial", "legal", "trafficking", etc.
}

export type TimelineEra =
  | 'pre-1990'
  | '1990-2000'
  | '2001-2007'
  | '2008-2018'
  | '2019'
  | '2020-present';

export interface ThemeSection {
  id: string;                         // slugified title, e.g. "trafficking-operation"
  title: string;
  sectionNumber: number;
  summary: string;                    // first paragraph / lead text
  content: string;                    // full markdown (with subsections)
  peopleIds: string[];
  timelineEventIds: string[];
  sources: SourceTag[];
  tags: string[];
}

export interface Connection {
  id: string;
  sourcePersonId: string;
  targetPersonId: string;
  relationshipType:
    | 'co-conspirator'
    | 'employer-employee'
    | 'financial'
    | 'social'
    | 'flew-together'
    | 'legal-representation'
    | 'intelligence'
    | 'academic'
    | 'victim-perpetrator';
  strength: 1 | 2 | 3;               // 1=weak/social, 2=documented, 3=central/operational
  description: string;
  sources: SourceTag[];
  verificationStatus: VerificationStatus;
}

export interface SearchResult {
  type: 'person' | 'event' | 'theme';
  id: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  score?: number;
}
```

---

## Page Route Map

| Route | Component | Data source |
|---|---|---|
| `/` | Home | static |
| `/people` | PeopleDirectory | `people.json` |
| `/people/[slug]` | PersonDetail | `people.json` + `connections.json` |
| `/timeline` | TimelinePage | `timeline.json` |
| `/themes` | ThemesPage | `themes.json` |
| `/graph` | GraphPage | `connections.json` + `people.json` |
| `/search?q=...` | SearchPage | `search-index.json` via Fuse.js |

---

## Static Data Loading Pattern

All data is imported at build time. Use Next.js `generateStaticParams` for dynamic routes.

```typescript
// Example: src/app/people/[slug]/page.tsx
import people from '@/data/people.json';

export function generateStaticParams() {
  return people.map((p) => ({ slug: p.id }));
}

export default function PersonPage({ params }: { params: { slug: string } }) {
  const person = people.find((p) => p.id === params.slug);
  // ...
}
```

---

## next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
```

---

## package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "npm run parse && next build",
    "parse": "npx ts-node --project tsconfig.scripts.json scripts/parse-people.ts && npx ts-node --project tsconfig.scripts.json scripts/parse-timeline.ts && npx ts-node --project tsconfig.scripts.json scripts/parse-themes.ts && npx ts-node --project tsconfig.scripts.json scripts/build-connections.ts",
    "start": "next start",
    "export": "next build"
  }
}
```

---

## Key Constraints for Claude Code

1. **All data is read-only.** Never mutate the source markdown files.
2. **No backend, no API routes, no database.** Everything runs in the browser from pre-built JSON.
3. **TypeScript throughout.** Strict mode enabled.
4. **No `any` types.** All data must conform to the interfaces in `src/types/index.ts`.
5. **Build the parsing scripts first.** No UI work should begin until `src/data/*.json` files exist
   and are validated.
6. **Mobile-responsive.** All layouts must work at 375px width minimum.
7. **Accessibility.** All interactive elements need proper ARIA labels. Color is never the sole
   indicator of meaning (always pair with text/icon).
