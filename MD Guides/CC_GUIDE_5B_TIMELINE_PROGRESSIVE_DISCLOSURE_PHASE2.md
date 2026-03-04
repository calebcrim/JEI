# Claude Code Build Guide — Part 5B: Timeline Progressive Disclosure (Phase 2)
## Enrich the Data Model

---

## Prerequisites

Phase 1 (Guide 5A) must be complete before starting this phase. Verify:
- [ ] `EventCard` component exists at `src/components/timeline/EventCard.tsx` with 4-level state
- [ ] `timeline.json` contains `summary` field on every event
- [ ] `SourcesEvidencePanel.tsx` stub exists
- [ ] All Phase 1 tests pass

---

## Overview

Phase 2 populates the data fields that Phase 1 left as empty placeholders:
- `eftaLinks` — EFTA document numbers converted to clickable DOJ URLs
- `relatedEventIds` — cross-links between events sharing people or temporal proximity
- `relatedThemeIds` — links from events to relevant theme sections
- `discrepancies` — structured extraction of `[DISCREPANCY]` markers from event bodies

All work happens in `scripts/parse-timeline.ts` and a new cross-referencing step.

---

## Step 1: Parse EFTA Document Numbers into Clickable Links

### 1A: Update the parsing logic in `parse-timeline.ts`

Currently the parser extracts EFTA numbers as plain strings in the `efta` array. Upgrade this
to also generate `eftaLinks` with full URLs.

The DOJ URL pattern for EFTA documents is:
```
https://www.justice.gov/epstein/files/DataSet%20{N}/{EFTA_NUMBER}.pdf
```

Where `{N}` is the dataset number (1–12) and `{EFTA_NUMBER}` is the document ID.

**The challenge:** EFTA numbers don't encode which dataset they belong to. We need a mapping
approach.

### 1B: Build an EFTA-to-dataset mapping

Create a lookup file: `scripts/efta-dataset-map.ts`

```typescript
/**
 * Maps EFTA document number ranges to their dataset numbers.
 * These ranges are approximate based on the DOJ release structure.
 * When a number falls outside known ranges, we construct a URL using
 * the best-guess dataset and note it as approximate.
 */

// Known dataset assignments from the source files
// Format: [minNumber, maxNumber, datasetNumber]
const KNOWN_RANGES: Array<[number, number, number]> = [
  // Dataset 1-7 released Dec 19, 2025
  [1, 999, 1],
  [1000, 9999, 2],
  // ... fill these in based on actual EFTA number ranges observed in source data

  // These specific numbers are confirmed in the source files:
  // EFTA00000468 — Dataset 1 (the removed/restored document)
  // EFTA00040941 — Dataset 9
  // EFTA00056410 — Dataset 9
  // EFTA00063517 — Dataset 9
  // EFTA00080838 — Dataset 9
  // EFTA00089258 — Dataset 9
  // EFTA00105651 — Dataset 9
  // EFTA00123213 — Dataset 9
  // EFTA00141175 — Dataset 9
  // EFTA00161494 — Dataset 9
  // EFTA00165199 — Dataset 9
  // EFTA01227736 — Dataset 9
];

// Explicit overrides for known documents
const EXPLICIT_MAP: Record<string, number> = {
  'EFTA00000468': 1,
  'EFTA00040941': 9,
  'EFTA00056410': 9,
  'EFTA00063517': 9,
  'EFTA00080838': 9,
  'EFTA00089258': 9,
  'EFTA00105651': 9,
  'EFTA00123213': 9,
  'EFTA00141175': 9,
  'EFTA00161494': 9,
  'EFTA00165199': 9,
  'EFTA01227736': 9,
};

export function eftaToUrl(eftaNumber: string): { url: string; approximate: boolean } {
  const clean = eftaNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase();

  // Check explicit map first
  if (EXPLICIT_MAP[clean]) {
    const ds = EXPLICIT_MAP[clean];
    return {
      url: `https://www.justice.gov/epstein/files/DataSet%20${ds}/${clean}.pdf`,
      approximate: false,
    };
  }

  // Try range lookup
  const numPart = parseInt(clean.replace(/^EFTA0*/, ''), 10);
  for (const [min, max, ds] of KNOWN_RANGES) {
    if (numPart >= min && numPart <= max) {
      return {
        url: `https://www.justice.gov/epstein/files/DataSet%20${ds}/${clean}.pdf`,
        approximate: false,
      };
    }
  }

  // Fallback: construct URL without dataset (link to search page)
  return {
    url: `https://www.justice.gov/epstein`,
    approximate: true,
  };
}
```

**IMPORTANT:** Before running, scan the source markdown files (`epstein_research.html` has the
most EFTA links with explicit dataset paths) to populate `EXPLICIT_MAP` as thoroughly as
possible. Every `<a href>` in that HTML file that points to a DOJ EFTA URL tells you the
dataset number for that document. Extract all of them.

### 1C: Integrate into the parser

In `parse-timeline.ts`, after extracting `efta` numbers, generate `eftaLinks`:

```typescript
import { eftaToUrl } from './efta-dataset-map';

// Inside the event construction:
const eftaLinks = (efta || []).map(num => {
  const { url, approximate } = eftaToUrl(num);
  return {
    number: num,
    url,
    description: approximate ? '(dataset unconfirmed)' : undefined,
  };
});
```

---

## Step 2: Compute Related Events

After all events are parsed, run a cross-referencing pass to find related events.

### 2A: Create `scripts/build-event-relations.ts`

This script reads `timeline.json` and computes related events based on two signals:

**Signal 1 — Shared people (strongest signal)**
If two events share 2+ people in their `peopleIds`, they are related.

**Signal 2 — Temporal proximity + shared tags**
If two events are within 30 days of each other AND share at least 1 tag, they are related.

```typescript
import fs from 'fs';
import path from 'path';

interface TimelineEvent {
  id: string;
  date: string;
  peopleIds: string[];
  tags: string[];
  relatedEventIds?: string[];
}

function daysBetween(dateA: string, dateB: string): number {
  const a = new Date(dateA);
  const b = new Date(dateB);
  if (isNaN(a.getTime()) || isNaN(b.getTime())) return Infinity;
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

function computeRelations(events: TimelineEvent[]): Map<string, string[]> {
  const relations = new Map<string, Set<string>>();
  for (const e of events) relations.set(e.id, new Set());

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const a = events[i];
      const b = events[j];

      // Signal 1: shared people (2+ people in common)
      const sharedPeople = a.peopleIds.filter(p => b.peopleIds.includes(p));
      if (sharedPeople.length >= 2) {
        relations.get(a.id)!.add(b.id);
        relations.get(b.id)!.add(a.id);
        continue; // Don't double-count
      }

      // Signal 2: temporal proximity + shared tags
      const sharedTags = a.tags.filter(t => b.tags.includes(t));
      if (sharedTags.length >= 1 && daysBetween(a.date, b.date) <= 30) {
        relations.get(a.id)!.add(b.id);
        relations.get(b.id)!.add(a.id);
      }
    }
  }

  // Cap at 8 related events per event (sort by relevance: more shared people first)
  const result = new Map<string, string[]>();
  for (const [id, related] of relations) {
    const scored = [...related].map(relId => {
      const event = events.find(e => e.id === id)!;
      const relEvent = events.find(e => e.id === relId)!;
      const sharedPeople = event.peopleIds.filter(p => relEvent.peopleIds.includes(p)).length;
      const sharedTags = event.tags.filter(t => relEvent.tags.includes(t)).length;
      return { id: relId, score: sharedPeople * 3 + sharedTags };
    });
    scored.sort((a, b) => b.score - a.score);
    result.set(id, scored.slice(0, 8).map(s => s.id));
  }

  return result;
}

// Main
const timelinePath = path.join(process.cwd(), 'src', 'data', 'timeline.json');
const events: TimelineEvent[] = JSON.parse(fs.readFileSync(timelinePath, 'utf-8'));

const relations = computeRelations(events);

// Merge back into timeline.json
for (const event of events) {
  event.relatedEventIds = relations.get(event.id) || [];
}

fs.writeFileSync(timelinePath, JSON.stringify(events, null, 2));
console.log(`✅ Computed relations for ${events.length} events`);
```

### 2B: Compute related themes

Similarly, link events to themes via shared people and keyword matching.

Create or extend `scripts/build-event-relations.ts` to also read `themes.json` and:

1. For each event, check if any `peopleIds` appear in a theme's `peopleIds`
2. For each event, check if any `tags` map to a theme's `id` or title keywords

```typescript
// Theme relation rules:
const TAG_TO_THEME: Record<string, string[]> = {
  'trafficking': ['trafficking-operation', 'victim-accounts'],
  'financial': ['financial-architecture', 'financial-crimes'],
  'legal': ['legal-proceedings', 'npa-plea-deal'],
  'political': ['political-connections'],
  'intelligence': ['intelligence-connections'],
  'death': ['death-investigation', 'mcc-custody'],
  'flight': ['flight-logs', 'travel-patterns'],
  'media': ['media-coverage', 'investigative-journalism'],
};

// For each event:
const relatedThemes = new Set<string>();
for (const tag of event.tags) {
  const themes = TAG_TO_THEME[tag] || [];
  themes.forEach(t => relatedThemes.add(t));
}
event.relatedThemeIds = [...relatedThemes];
```

**Note:** The actual theme IDs need to match what's in `themes.json`. Check the output of
`parse-themes.ts` and adjust the `TAG_TO_THEME` mapping accordingly. If theme IDs use a
different format, update the mapping.

---

## Step 3: Extract Structured Discrepancy Data

### 3A: Parse `[DISCREPANCY]` markers from event bodies

In `parse-timeline.ts`, after generating the body text, scan for discrepancy markers:

```typescript
function extractDiscrepancies(body: string): Array<{
  sourceA: string;
  sourceB: string;
  claimA: string;
  claimB: string;
}> {
  const discrepancies: Array<{sourceA: string; sourceB: string; claimA: string; claimB: string}> = [];

  // Pattern 1: Explicit [DISCREPANCY] blocks in the source markdown
  // Format: **[DISCREPANCY: source A says X; source B says Y]**
  const discrepancyRegex = /\*?\*?\[DISCREPANCY:?\s*(.+?)\]\*?\*?/gi;
  let match;
  while ((match = discrepancyRegex.exec(body)) !== null) {
    const text = match[1];
    // Try to split on common delimiters
    const parts = text.split(/;\s*|\s+vs\.?\s+|\s+but\s+/i);
    if (parts.length >= 2) {
      // Try to extract source names from each part
      const sourceMatchA = parts[0].match(/^(.+?)\s+(?:says?|reports?|states?|claims?|gives?)\s+(.+)/i);
      const sourceMatchB = parts[1].match(/^(.+?)\s+(?:says?|reports?|states?|claims?|gives?)\s+(.+)/i);

      discrepancies.push({
        sourceA: sourceMatchA ? sourceMatchA[1].trim() : 'Source A',
        claimA: sourceMatchA ? sourceMatchA[2].trim() : parts[0].trim(),
        sourceB: sourceMatchB ? sourceMatchB[1].trim() : 'Source B',
        claimB: sourceMatchB ? sourceMatchB[2].trim() : parts[1].trim(),
      });
    } else {
      // Can't split — store as single discrepancy note
      discrepancies.push({
        sourceA: 'Multiple sources',
        claimA: text.trim(),
        sourceB: '',
        claimB: 'See full details above.',
      });
    }
  }

  return discrepancies;
}
```

Add this to the event construction:

```typescript
discrepancies: extractDiscrepancies(body),
```

---

## Step 4: Update the Build Pipeline

### 4A: Update `package.json` scripts

Add the new relations script to the parse pipeline. The relations script must run AFTER
`parse-timeline.ts` and `parse-themes.ts` since it reads their outputs:

```json
{
  "scripts": {
    "parse": "npx ts-node --project tsconfig.scripts.json scripts/parse-people.ts && npx ts-node --project tsconfig.scripts.json scripts/parse-timeline.ts && npx ts-node --project tsconfig.scripts.json scripts/parse-themes.ts && npx ts-node --project tsconfig.scripts.json scripts/build-event-relations.ts && npx ts-node --project tsconfig.scripts.json scripts/build-connections.ts && npx ts-node --project tsconfig.scripts.json scripts/build-search-index.ts"
  }
}
```

Build order is now:
```
1. parse-people.ts         → people.json
2. parse-timeline.ts       → timeline.json (with summaries, eftaLinks, discrepancies)
3. parse-themes.ts         → themes.json
4. build-event-relations.ts → mutates timeline.json (adds relatedEventIds, relatedThemeIds)
5. build-connections.ts    → connections.json
6. build-search-index.ts   → search-index.json
```

### 4B: Update `build-search-index.ts`

The search index should now also index the `summary` field for better search results:

```typescript
// In the timeline event mapping:
...events.map(e => ({
  type: 'event' as const,
  id: e.id,
  title: e.title,
  excerpt: e.summary,   // Changed: use summary instead of body.slice(0,200)
  date: e.dateDisplay,
  era: e.era,
  fullText: e.body,
  sources: e.sources.join(' '),
})),
```

---

## Step 5: Verify Data Enrichment

Run the full pipeline:

```bash
npm run parse
```

Then verify the enriched `timeline.json`:

1. **EFTA Links:** Open the JSON and search for `"eftaLinks"`. At least the events that reference
   EFTA documents in their body should have populated link arrays. Spot-check that URLs resolve
   to actual DOJ pages (open a few in a browser).

2. **Related Events:** Check that events with overlapping people have `relatedEventIds` populated.
   For example:
   - Any event involving both Epstein and Maxwell should link to other Epstein+Maxwell events
   - EFTA-era events about document releases should link to each other

3. **Related Themes:** Verify that events tagged `financial` link to finance-related theme IDs,
   events tagged `legal` link to legal theme IDs, etc.

4. **Discrepancies:** Search the JSON for events with non-empty `discrepancies` arrays. Verify
   that the structured data captures the essence of the `[DISCREPANCY]` markers in the source
   markdown.

5. **Summary field:** Should still be present and correct (was added in Phase 1, just verifying
   it survived the pipeline changes).

**Checklist:**
- [ ] EFTA links have valid URLs for known documents
- [ ] Related events are bidirectional (if A links to B, B links to A)
- [ ] No event has more than 8 related events
- [ ] Discrepancy extraction captures all `[DISCREPANCY]` markers
- [ ] Search index uses `summary` as excerpt
- [ ] `npm run dev` — site still builds and renders correctly
- [ ] Level 1 people chips still render
- [ ] Level 3 stub now shows EFTA links and related events instead of empty state

---

## Files Modified (Summary)

| File | Action |
|------|--------|
| `scripts/efta-dataset-map.ts` | **NEW** — EFTA number → DOJ URL mapping |
| `scripts/parse-timeline.ts` | Add EFTA link generation, discrepancy extraction |
| `scripts/build-event-relations.ts` | **NEW** — cross-references events and themes |
| `scripts/build-search-index.ts` | Use `summary` field as excerpt |
| `package.json` | Add `build-event-relations` to parse pipeline |
| `src/data/timeline.json` | Regenerated with all enriched fields |

---

## What NOT To Do in Phase 2

- Do NOT modify any React components — the Phase 1 components already handle the new data
  fields gracefully (they check for existence before rendering)
- Do NOT modify the source markdown files
- Do NOT change the TypeScript types — they were already extended in Phase 1
- Do NOT touch people or themes parsing beyond reading their outputs
