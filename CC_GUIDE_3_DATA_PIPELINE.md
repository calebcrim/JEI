# Claude Code Build Guide — Part 3: Data Pipeline
## Epstein Files Research Database

---

## Overview

The three source markdown files are richly structured but were written for human readability,
not machine parsing. This guide explains how to convert them into the JSON data files the
application consumes. **All parsing happens at build time via scripts in `/scripts/`.**

The output files are:
- `src/data/people.json`      → Array of `Person` objects
- `src/data/timeline.json`    → Array of `TimelineEvent` objects
- `src/data/themes.json`      → Array of `ThemeSection` objects
- `src/data/connections.json` → Array of `Connection` objects
- `src/data/search-index.json` → Flat array of `SearchResult` objects for Fuse.js

---

## Build Order

Run scripts in this order (dependencies flow downward):

```
1. parse-people.ts      → produces people.json
2. parse-timeline.ts    → produces timeline.json
3. parse-themes.ts      → produces themes.json
4. build-connections.ts → reads all three, produces connections.json
5. build-search-index.ts → reads all three, produces search-index.json
```

---

## Script 1: `scripts/parse-people.ts`

### Source file structure to parse:
`source-data/epstein_people_dossier.md`

**File structure:**
- Top-level H1: document title (skip)
- "How to Use" section (skip)
- "Quick-Reference" table: mention frequencies — **parse this table**
- H2 sections = categories (e.g. `## Category 1: The Principal — Jeffrey Epstein`)
- H3 entries within each category = individual people (e.g. `### Jeffrey Epstein`)
- Each person entry has:
  - Bold metadata fields (Name, Born, Died, Category, Current status, Source files, etc.)
  - Body paragraphs with `**bold headers:**` introducing sub-sections
  - Inline flags: `**[UNVERIFIED]**`, `**[DISCREPANCY: ...]**`
  - Inline source tags in brackets: `[CBS]`, `[DOJ]`, `[GH]`, etc.
  - EFTA document numbers: `EFTA00090314` pattern

### Parsing logic:

```typescript
// scripts/parse-people.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CATEGORY_MAP: Record<string, PersonCategory> = {
  'category 1': 'principal',
  'category 2': 'inner-circle',
  'category 3': 'political',
  'category 4': 'financial',
  'category 5': 'legal',
  'category 6': 'intelligence',
  'category 7': 'academic-scientific',
  'category 8': 'media',
  'category 9': 'victim',
  'category 10': 'law-enforcement',
};

// Regex patterns
const PERSON_H3 = /^### (.+)$/m;
const CATEGORY_H2 = /^## Category (\d+):/im;
const BOLD_FIELD = /^\*\*(.+?):\*\*\s*(.+)$/m;
const SOURCE_TAGS = /\[(CBS|NPR|WSJ|NYT|CNN|Bloomberg|DOJ|FBI|HO|SJ|JMail|GH|OSINT|DOJ,\s*[A-Z]+)\]/g;
const EFTA_REFS = /EFTA\d{8}/g;
const UNVERIFIED_FLAG = /\*\*\[UNVERIFIED[^\]]*\]\*\*/;
const DISCREPANCY_FLAG = /\*\*\[DISCREPANCY:[^\]]*\]\*\*/;

// Parse the mention-frequency table at the top of the file
function parseMentionFrequencyTable(content: string): Record<string, number> { ... }

// Split content into per-person blocks by H3 heading
function splitIntoPersonBlocks(content: string): Array<{category: string, name: string, content: string}> { ... }

// For each person block, extract PersonSection[] by splitting on **Bold header:** patterns
function extractSections(personContent: string): PersonSection[] { ... }

// Extract first paragraph as summary
function extractSummary(content: string): string { ... }

// Extract all source tags from a string
function extractSources(text: string): SourceTag[] { ... }

// Extract EFTA document numbers
function extractEFTA(text: string): string[] { ... }

// Generate URL-safe ID from name
function slugify(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
```

### Output validation:
- Every Person must have: id, name, category, summary, sources
- Log a warning (don't throw) for any person missing a summary
- Log a count: "Parsed N people across M categories"

---

## Script 2: `scripts/parse-timeline.ts`

### Source file structure to parse:
`source-data/epstein_master_timeline.md`

**File structure:**
- H2 sections = eras (e.g. `## Era 1: Pre-History & Early Network (Before 1990)`)
- Each event is a H3 entry:
  ```
  ### ~1974 — Epstein Hired at Dalton School
  **People:** Jeffrey Epstein
  **Source:** epstein_themes_synthesis.md
  
  Body text...
  ```
- The H3 title format is: `### [DATE] — [TITLE]`
- Date formats vary: `~1974`, `1974-03-15`, `2019-08-10`, `~Early 2000s`, etc.
- "**People:**" line lists person names (comma-separated)
- "**Source:**" line lists sources

### Parsing logic:

```typescript
// Date parsing: normalize various formats to ISO or partial ISO
function parseDate(rawDate: string): { iso: string; display: string } {
  // Strip leading ~ (approximate marker)
  // Handle: "1974", "March 2010", "2010-03-15", "~Early 2000s", "~circa 1991"
  // Return: iso = best ISO approximation, display = human-readable
  // Approximate dates: "1974" → iso: "1974", display: "~1974"
  // Known exact dates: "2019-08-10" → iso: "2019-08-10", display: "August 10, 2019"
}

// Map era H2 text to TimelineEra enum value
function parseEra(h2Text: string): TimelineEra { ... }

// Extract people names from "**People:** X, Y, Z" line
// Then cross-reference against people.json to get IDs
// For names not found in people.json, add as free-text (still useful for search)
function extractPeopleIds(peopleLine: string, knownPeople: Person[]): string[] { ... }
```

### Special sections to handle:
- **Appendix A** (Undated events): parse these as events with `date: 'undated'`
- **Appendix C** (Legal proceedings): parse as events with tag `legal`
- **Appendix D** (Financial transactions): parse as events with tag `financial`
- **Appendix E** (Discrepancies): parse as a separate discrepancy record, linked to relevant events

### Output validation:
- Every event must have: id, date, era, title, body, sources
- Log count: "Parsed N timeline events across M eras"
- Log undated event count separately

---

## Script 3: `scripts/parse-themes.ts`

### Source file structure to parse:
`source-data/epstein_themes_synthesis.md`

**File structure:**
- Table of contents H2 (skip as content, but parse for section ordering)
- H2 sections = theme sections (e.g. `## 1. EFTA Release Framework & Document Architecture`)
- H3 subsections within each theme
- Tables (markdown format) — preserve as markdown strings for rendering
- Inline person name references throughout

### Parsing logic:

```typescript
// Split on H2 headings
// Extract section number from heading (e.g. "## 3. Trump–Epstein Connections" → 3)
// ID = slugified title (e.g. "trump-epstein-connections")
// Summary = first paragraph of the section
// Content = everything from second paragraph onward

// Person name extraction from theme content:
// After themes.json is built and people.json exists, cross-reference all person
// names that appear in theme content to build themeSection.peopleIds[]
// Use a greedy name-match: check for any Person.name substring in the text
function extractPersonMentions(text: string, allPeople: Person[]): string[] {
  return allPeople
    .filter(p => text.includes(p.name))
    .map(p => p.id);
}
```

### Tables in theme content:
- Preserve markdown table syntax in the `content` field as-is
- The React renderer will use a markdown-to-HTML library (use `react-markdown` with
  `remark-gfm` plugin) to render tables correctly

---

## Script 4: `scripts/build-connections.ts`

### Purpose:
Derive the edges of the network graph by cross-referencing all three parsed datasets.
**This script must run AFTER the three parse scripts.**

### Connection derivation logic:

**Method A — Flight co-occurrence (strength: 2)**
The people dossier lists flight leg counts and frequent co-passengers. Parse statements like:
"Maxwell and Kellen flew together approximately 39 times in 2003 alone" and
"Her initials ('GM') appear on each of Clinton's 26 flight legs."
Create connections for any pair of people described as flying together.

**Method B — Explicit relationship statements (strength: 2–3)**
Parse relationship language in person profiles:
- "Epstein's primary attorney" → legal-representation connection
- "Epstein's money manager" → financial connection
- "convicted... of five federal charges" + Maxwell → co-conspirator
- "hired as a math teacher... met... Greenberg's son" → social

**Method C — Timeline co-occurrence (strength: 1)**
Any two people who appear together in 3+ timeline events get a social connection of strength 1.

**Method D — Financial connections (strength: 3)**
Explicit dollar amounts transferred between people → financial connection of strength 3.
Example: "wire transfer showed $7.4 million moved from Epstein's BNY account to Maxwell's
JPMorgan account"

### Relationship type classification rules:

| Keyword patterns in source text | Relationship type |
|---|---|
| "co-conspirator", "convicted", "charged", "NPA" | co-conspirator |
| "attorney", "lawyer", "legal representation" | legal-representation |
| "money manager", "accountant", "wire transfer", "paid" | financial |
| "flew together", "flight leg", "passenger" | flew-together |
| "friend", "social", "dinner", "party", "dinner" | social |
| "employer", "hired", "staff", "assistant" | employer-employee |
| "Mossad", "intelligence", "CIA", "spy" | intelligence |
| "professor", "research", "academic", "donation to" | academic |

### Output format:
```json
[
  {
    "id": "maxwell-epstein-co-conspirator",
    "sourcePersonId": "jeffrey-epstein",
    "targetPersonId": "ghislaine-maxwell",
    "relationshipType": "co-conspirator",
    "strength": 3,
    "description": "Maxwell convicted as Epstein's primary operational partner. ~400 documented flight legs together.",
    "sources": ["DOJ", "Maxwell-trial"],
    "verificationStatus": "verified"
  }
]
```

### Manual override file:
Create `scripts/connections-manual.json` for any connections that parsing can't reliably derive.
This file is merged with auto-derived connections. Format is the same as connections.json.
Claude Code should pre-populate this with the most critical known connections.

---

## Script 5: `scripts/build-search-index.ts`

### Purpose:
Produce a single flat array of searchable records that Fuse.js can index.

### Index construction:

```typescript
const index: SearchIndexEntry[] = [
  // From people.json: one entry per person
  ...people.map(p => ({
    type: 'person' as const,
    id: p.id,
    title: p.name,
    aliases: p.aliases?.join(' ') ?? '',
    excerpt: p.summary,
    category: p.category,
    // Concatenate all section content for full-text search
    fullText: p.sections.map(s => s.content).join(' '),
    sources: p.sources.join(' '),
  })),

  // From timeline.json: one entry per event
  ...events.map(e => ({
    type: 'event' as const,
    id: e.id,
    title: e.title,
    excerpt: e.body.slice(0, 200),
    date: e.dateDisplay,
    era: e.era,
    fullText: e.body,
    sources: e.sources.join(' '),
  })),

  // From themes.json: one entry per theme section
  ...themes.map(t => ({
    type: 'theme' as const,
    id: t.id,
    title: t.title,
    excerpt: t.summary,
    fullText: t.content,
    sources: t.sources.join(' '),
  })),
];
```

### Fuse.js configuration (in `src/lib/search.ts`):

```typescript
import Fuse from 'fuse.js';
import searchIndex from '@/data/search-index.json';

const fuse = new Fuse(searchIndex, {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'aliases', weight: 0.3 },
    { name: 'excerpt', weight: 0.2 },
    { name: 'fullText', weight: 0.1 },
  ],
  threshold: 0.35,        // 0 = perfect match, 1 = match anything
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,   // search entire string, not just beginning
});

export function search(query: string, limit = 20): SearchResult[] {
  if (!query || query.trim().length < 2) return [];
  return fuse.search(query, { limit }).map(result => ({
    type: result.item.type,
    id: result.item.id,
    title: result.item.title,
    excerpt: result.item.excerpt,
    category: result.item.category,
    date: result.item.date,
    score: result.score,
  }));
}
```

---

## Cross-Referencing Pass

After all five scripts have run, do a cross-reference pass to populate the `*Ids` arrays
that link entities to each other:

1. For each `Person`, scan `timeline.json` for events where `event.peopleIds` includes
   `person.id` → populate `person.timelineEventIds`

2. For each `Person`, scan `themes.json` for sections where `section.peopleIds` includes
   `person.id` → populate `person.themeIds`

3. For each `Person`, scan `connections.json` for connections where
   `sourcePersonId === person.id || targetPersonId === person.id`
   → populate `person.connectionIds`

4. For each `TimelineEvent`, scan `themes.json` for sections that reference event dates
   or event titles → populate `event.themeIds`

This pass can be the last step in `build-connections.ts` after connection derivation.

---

## Handling Special Markdown Patterns

### [UNVERIFIED] flags
When this pattern appears in source content, set `verificationStatus: 'unverified'` on the
containing section/event. Strip the `**[UNVERIFIED]**` text from the rendered content —
instead surface it via the UnverifiedBanner component.

### [DISCREPANCY: ...] flags
Parse the discrepancy description from within the brackets. Set `verificationStatus: 'discrepancy'`.
Store the discrepancy description separately in the section/event object as `discrepancyNote`.

### Inline source tags [CBS], [DOJ] etc.
Strip from rendered content. Collect all unique source tags for the entry and store in `sources[]`.

### EFTA document numbers (EFTA00090314)
Strip from rendered content. Collect as `efta[]` array. In the UI, render as clickable links
to `https://www.justice.gov/epstein/files/` (DOJ Epstein files portal).

### Bold field headers (**Background and early career:**)
These become `PersonSection.title` values. The content between two bold headers becomes the
section body.

### Tables
Preserve as raw markdown. Use `react-markdown` + `remark-gfm` to render.

### Dollar amounts and numbers
Do NOT parse/transform — preserve as-is in text. The UI can optionally highlight them with
a CSS class but parsing financial data for computation is out of scope for v1.

---

## Data Quality Checks

Add a validation step at the end of each parse script:

```typescript
function validatePeople(people: Person[]): void {
  const issues: string[] = [];
  const ids = new Set<string>();

  people.forEach(p => {
    if (ids.has(p.id)) issues.push(`Duplicate ID: ${p.id}`);
    ids.add(p.id);
    if (!p.summary) issues.push(`Missing summary: ${p.name}`);
    if (p.sections.length === 0) issues.push(`No sections: ${p.name}`);
  });

  if (issues.length > 0) {
    console.warn('⚠ People validation issues:\n' + issues.join('\n'));
  } else {
    console.log(`✓ ${people.length} people validated successfully`);
  }
}
```

Run similar validation for timeline events and themes.

---

## File Size Estimates

Based on the source markdown, expect approximate output sizes:

| File | Estimated entries | Estimated size |
|---|---|---|
| people.json | ~55 people | ~400–600 KB |
| timeline.json | ~145 events | ~300–400 KB |
| themes.json | ~17 sections | ~200–300 KB |
| connections.json | ~80–120 edges | ~50–80 KB |
| search-index.json | ~217 entries | ~600–900 KB |

Total: ~1.5–2.3 MB of JSON data loaded on first page visit (only search-index at global
level; other files loaded per-page). This is well within acceptable client-side bounds.

For the graph page, lazy-load connections.json and people.json only when `/graph` is visited.

---

## Development Workflow

1. Copy source markdown files to `source-data/`
2. Run `npm run parse` to generate all JSON files
3. Run `npm run dev` to start the dev server
4. All JSON files are committed to the repo (they are generated assets, not source)
5. When source markdown is updated, re-run `npm run parse` and commit updated JSON

---

## Error Handling in Scripts

- Parse scripts should **never throw** on malformed input — log warnings and skip
- Always write partial output even if some entries fail
- Use `try/catch` around each entity parse block
- Final console output should always show a summary: N parsed, M warnings, K errors
