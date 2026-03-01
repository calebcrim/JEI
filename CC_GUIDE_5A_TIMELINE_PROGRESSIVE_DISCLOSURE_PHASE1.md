# Claude Code Build Guide — Part 5A: Timeline Progressive Disclosure (Phase 1)
## Refactor EventCard to Multi-Level Disclosure

---

## Context

This is Phase 1 of a 3-phase upgrade to the timeline page. Read all three guides (5A, 5B, 5C)
before starting any work so you understand the full picture, but **only implement Phase 1 now.**

### Current state
The timeline page (`src/app/timeline/page.tsx`) displays events with a binary expanded/collapsed
toggle. Collapsed shows a 3-line clamp of plain body text; expanded shows the full markdown body.

### Target state (Phase 1)
Replace the binary toggle with a **4-level progressive disclosure** system. Each click reveals
more detail. In Phase 1, we build the component structure and derive Level 1 summaries from
existing data. Phases 2 and 3 will enrich the data model and build the deepest level.

---

## The Four Disclosure Levels

| Level | Name | What's visible | Trigger to reach |
|-------|------|----------------|------------------|
| 0 | **Scanline** | Date, title, 3-line body preview, tag pills (max 3), verification badge, source tags (max 3) | Default on page load |
| 1 | **Summary** | Everything in Level 0 + a 2–3 sentence summary paragraph, full people chips (clickable), all source tags, EFTA doc numbers, verification/discrepancy banners | Click `"+ Summary"` from Level 0 |
| 2 | **Full Detail** | Everything in Level 1 + complete markdown body with all cross-references, discrepancy notes, and full attribution | Click `"+ Full Details"` from Level 1 |
| 3 | **Sources & Evidence** | Everything in Level 2 + EFTA PDF links, related events, related themes, discrepancy comparison, "See also" links | Click `"+ Sources & Evidence"` from Level 2 |

Any level can collapse directly back to Level 0 via a `"− Collapse"` link.

---

## Step 1: Update TypeScript Types

Edit `src/types/index.ts`. Add the disclosure level type and extend `TimelineEvent`:

```typescript
// Add this new type
export type DisclosureLevel = 0 | 1 | 2 | 3;

// Extend the existing TimelineEvent interface — ADD these fields:
export interface TimelineEvent {
  // ... all existing fields remain unchanged ...

  // NEW fields (Phase 1 — derived at parse time)
  summary: string;                    // 2-3 sentence summary for Level 1

  // NEW fields (Phase 2 — will be empty arrays/undefined until Phase 2)
  eftaLinks?: Array<{
    number: string;
    url: string;
    description?: string;
  }>;
  relatedEventIds?: string[];
  relatedThemeIds?: string[];
  discrepancies?: Array<{
    sourceA: string;
    sourceB: string;
    claimA: string;
    claimB: string;
  }>;
}
```

---

## Step 2: Update `scripts/parse-timeline.ts` to Generate Summaries

Find the section where each `TimelineEvent` object is constructed and add summary generation.

### Summary generation logic

The summary should be the first 2–3 complete sentences of the `body` field, extracted
intelligently. Do NOT just slice at a character count — split on sentence boundaries.

```typescript
function generateSummary(body: string): string {
  // Strip markdown formatting for cleaner sentence detection
  const plain = body
    .replace(/\*\*People.*?\*\*.*?\n/g, '')   // Remove **People:** line
    .replace(/\*\*Source.*?\*\*.*?\n/g, '')    // Remove **Source(s):** line
    .replace(/\*\*EFTA.*?\*\*.*?\n/g, '')      // Remove **EFTA Doc #:** line
    .replace(/\*\*/g, '')                       // Remove remaining bold markers
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')   // Convert links to plain text
    .replace(/\n+/g, ' ')                       // Collapse newlines
    .trim();

  // Split on sentence boundaries (period/question/exclamation followed by space + capital)
  const sentences = plain.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [plain];

  // Take first 2-3 sentences, targeting ~150-300 characters
  let summary = '';
  for (let i = 0; i < Math.min(sentences.length, 3); i++) {
    const candidate = summary + sentences[i].trim() + ' ';
    if (i >= 2 && candidate.length > 300) break;
    summary = candidate;
  }

  return summary.trim() || plain.slice(0, 250) + '…';
}
```

Add `summary: generateSummary(body)` to each event object in the parsing output.

Also add the empty placeholder fields so the type is satisfied:

```typescript
eftaLinks: [],         // Populated in Phase 2
relatedEventIds: [],   // Populated in Phase 2
relatedThemeIds: [],   // Populated in Phase 2
discrepancies: [],     // Populated in Phase 2
```

After editing the parse script, **re-run the parse pipeline** to regenerate `src/data/timeline.json`:

```bash
npx ts-node --project tsconfig.scripts.json scripts/parse-timeline.ts
```

Verify the output: every event in timeline.json should now have a `summary` string that is
2–3 sentences and reads as a coherent standalone description of the event. Spot-check at least
5 events across different eras.

---

## Step 3: Refactor `EventCard` Component

### 3A: Extract EventCard into its own file

Move the `EventCard` function out of `src/app/timeline/page.tsx` into a dedicated component:

**Create: `src/components/timeline/EventCard.tsx`**

### 3B: Implement the multi-level state machine

Replace the boolean `expanded` state with a numeric `level` state:

```tsx
'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TimelineEvent, DisclosureLevel } from '@/types';
import Badge from '@/components/shared/Badge';
import SourceTag from '@/components/shared/SourceTag';
import { ChevronDown, ChevronUp, FileText, Database } from 'lucide-react';

// Button labels for each transition
const EXPAND_LABELS: Record<DisclosureLevel, string | null> = {
  0: '+ Summary',
  1: '+ Full Details',
  2: '+ Sources & Evidence',
  3: null, // no further expansion at max level
};

interface EventCardProps {
  event: TimelineEvent;
  initialLevel?: DisclosureLevel;
}

export default function EventCard({ event, initialLevel = 0 }: EventCardProps) {
  const [level, setLevel] = useState<DisclosureLevel>(initialLevel);

  const expand = () => {
    if (level < 3) setLevel((level + 1) as DisclosureLevel);
  };

  const collapse = () => setLevel(0);

  // Border color based on verification status
  const borderClass =
    event.verificationStatus === 'unverified'
      ? 'border-l-2 border-status-unverified'
      : event.verificationStatus === 'discrepancy'
      ? 'border-l-2 border-status-discrepancy'
      : 'border-l-2 border-surface-border';

  return (
    <div className={`${borderClass} pl-4 py-3`} id={event.id}>

      {/* ═══ LEVEL 0: Scanline (always visible) ═══ */}
      <p className="text-xs text-text-muted mb-1 font-mono">{event.dateDisplay}</p>
      <h3 className="text-sm font-semibold text-text-primary mb-1 leading-snug">
        {event.title}
      </h3>

      {/* 3-line body preview — only show at Level 0 */}
      {level === 0 && (
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {event.body.slice(0, 300)}{event.body.length > 300 ? '…' : ''}
        </p>
      )}

      {/* Tag pills + verification badge — always visible */}
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {event.sources.slice(0, level >= 1 ? undefined : 3).map((src) => (
          <SourceTag key={src} source={src} />
        ))}
        {event.verificationStatus === 'unverified' && (
          <Badge variant="verification" status="unverified" />
        )}
        {event.verificationStatus === 'discrepancy' && (
          <Badge variant="verification" status="discrepancy" />
        )}
        {event.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="tag">{tag}</Badge>
        ))}
      </div>

      {/* ═══ LEVEL 1: Summary ═══ */}
      {level >= 1 && (
        <div className="mt-3 pt-3 border-t border-surface-border">
          <p className="text-sm text-text-secondary leading-relaxed">
            {event.summary}
          </p>

          {/* People chips */}
          {event.peopleIds.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-xs text-text-muted">People:</span>
              {event.peopleIds.map((pid) => (
                <a
                  key={pid}
                  href={`/people/${pid}`}
                  className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-accent-blue hover:text-accent-blueHover transition-colors"
                >
                  {pid.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </a>
              ))}
            </div>
          )}

          {/* EFTA doc numbers (if any exist yet) */}
          {event.efta && event.efta.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-xs text-text-muted">EFTA:</span>
              {event.efta.map((doc) => (
                <span key={doc} className="text-xs font-mono text-text-secondary bg-surface-elevated px-1.5 py-0.5 rounded">
                  {doc}
                </span>
              ))}
            </div>
          )}

          {/* Verification/discrepancy banners at Level 1+ */}
          {event.verificationStatus === 'unverified' && (
            <div className="mt-2 px-3 py-2 rounded border border-status-unverified/30 bg-status-unverified/5 text-xs text-status-unverified">
              ⚠ Unverified allegation — single-source claim not independently corroborated.
            </div>
          )}
          {event.verificationStatus === 'discrepancy' && (
            <div className="mt-2 px-3 py-2 rounded border border-status-discrepancy/30 bg-status-discrepancy/5 text-xs text-status-discrepancy">
              ⚡ Discrepancy noted — source files give conflicting information on this point.
            </div>
          )}
        </div>
      )}

      {/* ═══ LEVEL 2: Full Detail ═══ */}
      {level >= 2 && (
        <div className="mt-3 pt-3 border-t border-surface-border">
          <div className="prose-dark text-sm text-text-secondary leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.body}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* ═══ LEVEL 3: Sources & Evidence ═══ */}
      {/* Phase 1 placeholder — will be built out in Phase 3 */}
      {level >= 3 && (
        <div className="mt-3 pt-3 border-t border-surface-border">
          <SourcesEvidencePanel event={event} />
        </div>
      )}

      {/* ═══ CONTROLS ═══ */}
      <div className="flex items-center gap-3 mt-3">
        {/* Expand button — shows next level label */}
        {EXPAND_LABELS[level] && (
          <button
            onClick={expand}
            className="flex items-center gap-1 text-xs text-accent-blue hover:text-accent-blueHover transition-colors"
          >
            {level === 0 && <ChevronDown size={12} />}
            {level === 1 && <FileText size={12} />}
            {level === 2 && <Database size={12} />}
            {EXPAND_LABELS[level]}
          </button>
        )}

        {/* Collapse button — only visible when level > 0 */}
        {level > 0 && (
          <button
            onClick={collapse}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            <ChevronUp size={12} />
            Collapse
          </button>
        )}
      </div>
    </div>
  );
}
```

### 3C: Create the Level 3 placeholder component

**Create: `src/components/timeline/SourcesEvidencePanel.tsx`**

This is a stub for Phase 1 that will be fully built in Phase 3:

```tsx
import type { TimelineEvent } from '@/types';
import { ExternalLink } from 'lucide-react';

interface Props {
  event: TimelineEvent;
}

export default function SourcesEvidencePanel({ event }: Props) {
  const hasEftaLinks = event.eftaLinks && event.eftaLinks.length > 0;
  const hasRelated = event.relatedEventIds && event.relatedEventIds.length > 0;
  const hasDiscrepancies = event.discrepancies && event.discrepancies.length > 0;

  // Phase 1: show what data we have, indicate what's coming
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
        Sources & Evidence
      </h4>

      {/* EFTA Document Links */}
      {hasEftaLinks ? (
        <div>
          <p className="text-xs text-text-muted mb-1">EFTA Documents:</p>
          <div className="space-y-1">
            {event.eftaLinks!.map((link) => (
              <a
                key={link.number}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-accent-blue hover:text-accent-blueHover transition-colors"
              >
                <ExternalLink size={10} />
                {link.number}
                {link.description && (
                  <span className="text-text-muted">— {link.description}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      ) : event.efta && event.efta.length > 0 ? (
        <div>
          <p className="text-xs text-text-muted mb-1">Referenced EFTA Documents:</p>
          <div className="flex flex-wrap gap-1.5">
            {event.efta.map((doc) => (
              <span key={doc} className="text-xs font-mono text-text-secondary bg-surface-elevated px-1.5 py-0.5 rounded">
                {doc}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-text-muted italic">No EFTA documents directly referenced for this event.</p>
      )}

      {/* Source files */}
      <div>
        <p className="text-xs text-text-muted mb-1">Source attributions:</p>
        <div className="flex flex-wrap gap-1.5">
          {event.sources.map((src) => (
            <span key={src} className="text-xs px-2 py-0.5 rounded bg-surface-elevated text-text-secondary">
              {src}
            </span>
          ))}
        </div>
      </div>

      {/* Related Events — Phase 2 data */}
      {hasRelated && (
        <div>
          <p className="text-xs text-text-muted mb-1">Related events:</p>
          <div className="space-y-1">
            {event.relatedEventIds!.map((eid) => (
              <a
                key={eid}
                href={`#${eid}`}
                className="block text-xs text-accent-blue hover:text-accent-blueHover transition-colors"
              >
                → {eid.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Discrepancies — Phase 2 data */}
      {hasDiscrepancies && (
        <div>
          <p className="text-xs text-text-muted mb-1">Source discrepancies:</p>
          <div className="space-y-2">
            {event.discrepancies!.map((d, i) => (
              <div key={i} className="rounded border border-status-discrepancy/20 bg-status-discrepancy/5 px-3 py-2 text-xs">
                <div className="text-text-secondary"><strong>{d.sourceA}:</strong> {d.claimA}</div>
                <div className="text-text-secondary mt-1"><strong>{d.sourceB}:</strong> {d.claimB}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Step 4: Update the Timeline Page

Edit `src/app/timeline/page.tsx`:

1. **Remove** the inline `EventCard` function definition.
2. **Import** the new component: `import EventCard from '@/components/timeline/EventCard';`
3. **Add a "Expand all to Level 1" button** per era section. This lets researchers scan all
   summaries in an era without clicking each one individually.

Add this to each era section header area:

```tsx
<button
  onClick={() => setEraExpandLevel(era, 1)}
  className="text-xs text-text-muted hover:text-text-secondary transition-colors"
>
  Expand all summaries
</button>
```

To support this, the page needs to manage a `Map<TimelineEra, DisclosureLevel>` for bulk-expand
state, and pass `initialLevel` to each EventCard when the era has a bulk level set. Use a
key that includes the level to force re-render when bulk level changes.

**Implementation approach for bulk expand:**

```tsx
const [eraLevels, setEraLevels] = useState<Map<TimelineEra, DisclosureLevel>>(new Map());

function setEraExpandLevel(era: TimelineEra, level: DisclosureLevel) {
  setEraLevels(prev => {
    const next = new Map(prev);
    next.set(era, level);
    return next;
  });
}
```

Then in the render loop:

```tsx
{eraEvents.map((event) => (
  <EventCard
    key={`${event.id}-${eraLevels.get(event.era) ?? 0}`}
    event={event}
    initialLevel={eraLevels.get(event.era) ?? 0}
  />
))}
```

---

## Step 5: URL Hash Support

When a user expands an event to Level 1+, update the URL hash so the event can be deep-linked:

In `EventCard`, add a `useEffect`:

```tsx
import { useEffect } from 'react';

useEffect(() => {
  if (level >= 1) {
    window.history.replaceState(null, '', `#${event.id}`);
  }
}, [level, event.id]);
```

On page load, check if a hash is present and auto-expand that event to Level 1:

In `TimelinePage`, add initialization logic:

```tsx
const [initialExpandId, setInitialExpandId] = useState<string | null>(null);

useEffect(() => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    setInitialExpandId(hash);
    // Scroll to element after a brief delay for render
    setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}, []);
```

Pass `initialLevel={initialExpandId === event.id ? 1 : eraLevels.get(event.era) ?? 0}` to EventCard.

---

## Step 6: Keyboard Navigation

Add keyboard handlers to `EventCard`:

```tsx
function handleKeyDown(e: React.KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    expand();
  } else if (e.key === 'Escape') {
    collapse();
  }
}
```

Add `tabIndex={0}` and `onKeyDown={handleKeyDown}` and `role="article"` to the outer div.

---

## Step 7: Verify and Test

After implementing all steps:

1. Run the parse pipeline: `npm run parse`
2. Verify `src/data/timeline.json` — every event should have a `summary` field
3. Run `npm run dev` and test:
   - [ ] Level 0 shows date, title, 3-line body preview, tags, verification badges
   - [ ] Clicking "+ Summary" transitions to Level 1 with summary paragraph, people chips, EFTA numbers, banners
   - [ ] Clicking "+ Full Details" transitions to Level 2 with full markdown body
   - [ ] Clicking "+ Sources & Evidence" transitions to Level 3 with the stub panel
   - [ ] "− Collapse" returns to Level 0 from any level
   - [ ] "Expand all summaries" button on era header opens all events in that era to Level 1
   - [ ] URL hash updates on expand and auto-expands on page load
   - [ ] Keyboard: Enter expands, Escape collapses
   - [ ] Mobile: all levels render correctly at 375px width
4. No regressions: filters, era quick-jump, and existing functionality all still work

---

## Files Modified (Summary)

| File | Action |
|------|--------|
| `src/types/index.ts` | Add `DisclosureLevel` type, extend `TimelineEvent` |
| `scripts/parse-timeline.ts` | Add `generateSummary()`, add new fields to output |
| `src/data/timeline.json` | Regenerated with new fields |
| `src/components/timeline/EventCard.tsx` | **NEW** — extracted, rewritten with 4-level state |
| `src/components/timeline/SourcesEvidencePanel.tsx` | **NEW** — Level 3 stub |
| `src/app/timeline/page.tsx` | Import new EventCard, remove inline version, add bulk-expand, add hash support |

---

## What NOT To Do in Phase 1

- Do NOT modify the source markdown files
- Do NOT add new fields to the parse script beyond `summary` and the empty placeholders
- Do NOT build the full SourcesEvidencePanel — that's Phase 3
- Do NOT add the related events computation — that's Phase 2
- Do NOT change the data model for people or themes
- Do NOT modify any other pages
