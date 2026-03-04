# Claude Code Build Guide — Part 5C: Timeline Progressive Disclosure (Phase 3)
## Build the Full Sources & Evidence Panel

---

## Prerequisites

Phases 1 and 2 (Guides 5A and 5B) must be complete before starting this phase. Verify:
- [ ] EventCard has 4-level disclosure working
- [ ] `timeline.json` has populated `eftaLinks`, `relatedEventIds`, `relatedThemeIds`, `discrepancies`
- [ ] `SourcesEvidencePanel.tsx` stub exists and renders available data
- [ ] All Phase 1 and Phase 2 tests pass

---

## Overview

Phase 3 replaces the `SourcesEvidencePanel` stub with a polished, fully-featured evidence
panel. It also adds cross-link interactivity (clicking related events scrolls + expands them)
and finalizes the print/export behavior.

---

## Step 1: Rewrite `SourcesEvidencePanel.tsx`

Replace the stub at `src/components/timeline/SourcesEvidencePanel.tsx` with the full
implementation. The panel has four sections displayed as a vertical stack:

### Section Layout

```
┌─ Sources & Evidence ───────────────────────────────────────────────────┐
│                                                                         │
│  📄 EFTA Documents                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ EFTA00040941  Medical evaluation after death 1    [Open PDF ↗] │   │
│  │ EFTA00123213  Medical evaluation after death 2    [Open PDF ↗] │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  📰 Source Attributions                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [CBS]  CBS News — Searchable via Journalist Studio Pinpoint     │   │
│  │ [DOJ]  DOJ EFTA Releases — Datasets 1–12                       │   │
│  │ [NPR]  NPR Investigation — February 2026                       │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  🔗 Related Events                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ → Dec 19, 2025 — Datasets 1–7 Released                         │   │
│  │ → Dec 22, 2025 — Dataset 8 Released                             │   │
│  │ → Jan 30, 2026 — Datasets 9–12 Released                        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  🔍 Related Themes                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ → Financial Architecture                                        │   │
│  │ → Legal Proceedings                                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ⚡ Source Discrepancies (if any)                                        │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ epstein_themes_synthesis.md says:                                │   │
│  │   "$1.1 billion in assets"                                      │   │
│  │ OSINT Database says:                                             │   │
│  │   "$1.1–1.3 billion in assets"                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Full Component Implementation

```tsx
'use client';

import { useCallback } from 'react';
import type { TimelineEvent } from '@/types';
import timelineData from '@/data/timeline.json';
import themesData from '@/data/themes.json';
import { ExternalLink, Link2, BookOpen, AlertTriangle } from 'lucide-react';

const allEvents = timelineData as TimelineEvent[];

// Source tag descriptions for the attribution section
const SOURCE_DESCRIPTIONS: Record<string, string> = {
  CBS: 'CBS News investigation — searchable via Google Journalist Studio Pinpoint',
  NPR: 'NPR investigative reporting',
  WSJ: 'Wall Street Journal reporting',
  NYT: 'New York Times reporting',
  CNN: 'CNN reporting',
  Bloomberg: 'Bloomberg News reporting',
  DOJ: 'DOJ EFTA document releases (Datasets 1–12)',
  FBI: 'FBI investigative records (302 interviews, field reports)',
  HO: 'House Oversight Committee releases',
  SJ: 'Court filings and judicial records',
  JMail: 'JMail.World email database (1M+ indexed emails)',
  GH: 'GitHub community analysis (rhowardstone/Epstein-research)',
  OSINT: 'OSINT Database (Notion-based community research)',
  'Maxwell-trial': 'United States v. Ghislaine Maxwell trial exhibits',
  'Giuffre-deposition': 'Giuffre v. Maxwell deposition transcripts',
  'Palm-Beach-PD': 'Palm Beach Police Department investigative records',
};

interface Props {
  event: TimelineEvent;
  onNavigateToEvent?: (eventId: string) => void;
}

export default function SourcesEvidencePanel({ event, onNavigateToEvent }: Props) {
  const hasEftaLinks = event.eftaLinks && event.eftaLinks.length > 0;
  const hasEfta = event.efta && event.efta.length > 0;
  const hasRelatedEvents = event.relatedEventIds && event.relatedEventIds.length > 0;
  const hasRelatedThemes = event.relatedThemeIds && event.relatedThemeIds.length > 0;
  const hasDiscrepancies = event.discrepancies && event.discrepancies.length > 0;

  // Look up related event titles for display
  const relatedEvents = (event.relatedEventIds || [])
    .map(id => allEvents.find(e => e.id === id))
    .filter(Boolean) as TimelineEvent[];

  // Look up related theme titles
  const relatedThemes = (event.relatedThemeIds || [])
    .map(id => {
      const theme = (themesData as any[]).find(t => t.id === id);
      return theme ? { id: theme.id, title: theme.title } : null;
    })
    .filter(Boolean) as Array<{ id: string; title: string }>;

  const handleEventClick = useCallback((eventId: string) => {
    if (onNavigateToEvent) {
      onNavigateToEvent(eventId);
    } else {
      // Fallback: scroll to event and update hash
      const el = document.getElementById(eventId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `#${eventId}`);
      }
    }
  }, [onNavigateToEvent]);

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
        <BookOpen size={12} />
        Sources & Evidence
      </h4>

      {/* ─── EFTA Documents ─── */}
      <div>
        <p className="text-xs font-medium text-text-secondary mb-2">EFTA Documents</p>
        {hasEftaLinks ? (
          <div className="rounded border border-surface-border bg-surface-card divide-y divide-surface-border">
            {event.eftaLinks!.map((link) => (
              <a
                key={link.number}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 px-3 py-2 text-xs hover:bg-surface-elevated transition-colors group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-mono text-text-primary shrink-0">{link.number}</span>
                  {link.description && (
                    <span className="text-text-muted truncate">{link.description}</span>
                  )}
                </div>
                <span className="flex items-center gap-1 text-accent-blue group-hover:text-accent-blueHover shrink-0">
                  Open PDF <ExternalLink size={10} />
                </span>
              </a>
            ))}
          </div>
        ) : hasEfta ? (
          <div className="flex flex-wrap gap-1.5">
            {event.efta!.map((doc) => (
              <span key={doc} className="text-xs font-mono text-text-secondary bg-surface-elevated px-2 py-1 rounded border border-surface-border">
                {doc}
              </span>
            ))}
            <p className="w-full text-xs text-text-muted mt-1 italic">
              Direct PDF links not yet mapped for these documents.
            </p>
          </div>
        ) : (
          <p className="text-xs text-text-muted italic">
            No EFTA documents directly referenced for this event.
          </p>
        )}
      </div>

      {/* ─── Source Attributions ─── */}
      <div>
        <p className="text-xs font-medium text-text-secondary mb-2">Source Attributions</p>
        <div className="rounded border border-surface-border bg-surface-card divide-y divide-surface-border">
          {event.sources.map((src) => (
            <div key={src} className="flex items-start gap-2 px-3 py-2 text-xs">
              <span className="font-mono text-text-primary bg-surface-elevated px-1.5 py-0.5 rounded shrink-0">
                {src}
              </span>
              <span className="text-text-muted">
                {SOURCE_DESCRIPTIONS[src] || src}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Related Events ─── */}
      {hasRelatedEvents && (
        <div>
          <p className="text-xs font-medium text-text-secondary mb-2 flex items-center gap-1.5">
            <Link2 size={11} />
            Related Events
          </p>
          <div className="rounded border border-surface-border bg-surface-card divide-y divide-surface-border">
            {relatedEvents.map((rel) => (
              <button
                key={rel.id}
                onClick={() => handleEventClick(rel.id)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs hover:bg-surface-elevated transition-colors text-left"
              >
                <span className="font-mono text-text-muted shrink-0 w-24">
                  {rel.dateDisplay}
                </span>
                <span className="text-accent-blue hover:text-accent-blueHover truncate">
                  {rel.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Related Themes ─── */}
      {hasRelatedThemes && relatedThemes.length > 0 && (
        <div>
          <p className="text-xs font-medium text-text-secondary mb-2">Related Themes</p>
          <div className="flex flex-wrap gap-1.5">
            {relatedThemes.map((theme) => (
              <a
                key={theme.id}
                href={`/themes#${theme.id}`}
                className="text-xs px-2.5 py-1 rounded-full border border-surface-border bg-surface-card text-accent-blue hover:text-accent-blueHover hover:bg-surface-elevated transition-colors"
              >
                {theme.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ─── Discrepancies ─── */}
      {hasDiscrepancies && (
        <div>
          <p className="text-xs font-medium text-status-discrepancy mb-2 flex items-center gap-1.5">
            <AlertTriangle size={11} />
            Source Discrepancies
          </p>
          <div className="space-y-2">
            {event.discrepancies!.map((d, i) => (
              <div
                key={i}
                className="rounded border border-status-discrepancy/20 bg-status-discrepancy/5 overflow-hidden"
              >
                <div className="px-3 py-2 text-xs border-b border-status-discrepancy/10">
                  <span className="font-medium text-text-primary">{d.sourceA}</span>
                  <span className="text-text-muted"> says:</span>
                  <p className="text-text-secondary mt-0.5">{d.claimA}</p>
                </div>
                {d.sourceB && (
                  <div className="px-3 py-2 text-xs">
                    <span className="font-medium text-text-primary">{d.sourceB}</span>
                    <span className="text-text-muted"> says:</span>
                    <p className="text-text-secondary mt-0.5">{d.claimB}</p>
                  </div>
                )}
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

## Step 2: Wire Up Related Event Navigation

When a user clicks a related event in Level 3, the page should:
1. Scroll to that event
2. Expand it to Level 1 (so the user can see the summary immediately)

### 2A: Add navigation callback to `EventCard`

Update `EventCard.tsx` to accept and pass through an `onNavigateToEvent` callback:

```tsx
interface EventCardProps {
  event: TimelineEvent;
  initialLevel?: DisclosureLevel;
  onNavigateToEvent?: (eventId: string) => void;
}

// ... pass it to SourcesEvidencePanel:
{level >= 3 && (
  <SourcesEvidencePanel
    event={event}
    onNavigateToEvent={onNavigateToEvent}
  />
)}
```

### 2B: Implement navigation handler in `TimelinePage`

In `src/app/timeline/page.tsx`, create a handler that expands the target event and scrolls to it:

```tsx
// Track individually-expanded events
const [expandedEvents, setExpandedEvents] = useState<Map<string, DisclosureLevel>>(new Map());

function handleNavigateToEvent(eventId: string) {
  // Set the target event to Level 1
  setExpandedEvents(prev => {
    const next = new Map(prev);
    next.set(eventId, 1);
    return next;
  });

  // Scroll to it
  setTimeout(() => {
    document.getElementById(eventId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${eventId}`);
  }, 50);
}
```

Update the EventCard rendering to use per-event overrides:

```tsx
{eraEvents.map((event) => {
  const overrideLevel = expandedEvents.get(event.id);
  const eraLevel = eraLevels.get(event.era);
  const effectiveLevel = overrideLevel ?? eraLevel ?? 0;

  return (
    <EventCard
      key={`${event.id}-${effectiveLevel}`}
      event={event}
      initialLevel={effectiveLevel as DisclosureLevel}
      onNavigateToEvent={handleNavigateToEvent}
    />
  );
})}
```

---

## Step 3: Add Print Styles

When the page is printed or exported to PDF, all events should expand to Level 2 (full detail)
automatically. Level 3 source data can be optionally included.

### 3A: Add a print stylesheet

Create or update `src/app/globals.css` to add print-specific rules:

```css
@media print {
  /* Hide interactive controls */
  .print\\:hidden,
  button,
  .filter-panel,
  nav {
    display: none !important;
  }

  /* Remove clamp — show all text */
  .line-clamp-3 {
    -webkit-line-clamp: unset !important;
    overflow: visible !important;
  }

  /* Ensure readable contrast on white paper */
  body {
    background: white !important;
    color: #1a1a1a !important;
  }

  .text-text-primary { color: #1a1a1a !important; }
  .text-text-secondary { color: #444 !important; }
  .text-text-muted { color: #666 !important; }

  /* Each event starts on its own section for clarity */
  [id] {
    break-inside: avoid;
  }
}
```

### 3B: Add a "Print-friendly view" button

Add a button to the timeline page header that expands all events to Level 2 and triggers print:

```tsx
function handlePrintView() {
  // Expand all eras to Level 2
  const allEras = new Map<TimelineEra, DisclosureLevel>();
  for (const era of ERAS) allEras.set(era, 2);
  setEraLevels(allEras);

  // Give React time to re-render, then print
  setTimeout(() => window.print(), 300);
}
```

Add the button near the filter controls:

```tsx
<button
  onClick={handlePrintView}
  className="text-xs text-text-muted hover:text-text-secondary transition-colors print:hidden"
>
  🖨 Print-friendly
</button>
```

---

## Step 4: Animate Transitions Between Levels

Add smooth height transitions when expanding/collapsing levels. Use CSS transitions rather than
JavaScript animation to keep things lightweight.

### 4A: Wrap expandable sections in a transition container

In `EventCard.tsx`, wrap each level's content in an animated container:

```tsx
function ExpandableSection({ show, children }: { show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <div className="animate-in fade-in slide-in-from-top-1 duration-200">
      {children}
    </div>
  );
}
```

Then wrap each level section:

```tsx
<ExpandableSection show={level >= 1}>
  {/* Level 1 content */}
</ExpandableSection>

<ExpandableSection show={level >= 2}>
  {/* Level 2 content */}
</ExpandableSection>

<ExpandableSection show={level >= 3}>
  {/* Level 3 content */}
</ExpandableSection>
```

### 4B: Add the animation utilities to Tailwind config

If not already present, add these animation utilities to `tailwind.config.js`:

```javascript
// In extend:
keyframes: {
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  'slide-in-from-top-1': {
    '0%': { transform: 'translateY(-4px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
},
animation: {
  'in': 'fade-in 200ms ease-out, slide-in-from-top-1 200ms ease-out',
},
```

**Note:** If `tailwindcss-animate` plugin is already installed, these may already be available
as `animate-in fade-in slide-in-from-top-1`. Check `tailwind.config.js` first.

---

## Step 5: Accessibility Polish

### 5A: ARIA attributes

Update `EventCard` outer div:

```tsx
<div
  className={`${borderClass} pl-4 py-3`}
  id={event.id}
  role="article"
  aria-label={`Timeline event: ${event.title}, ${event.dateDisplay}`}
  aria-expanded={level > 0}
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
```

### 5B: Screen reader announcements for level changes

Add a visually-hidden live region that announces level changes:

```tsx
<div className="sr-only" role="status" aria-live="polite">
  {level === 0 && 'Event collapsed'}
  {level === 1 && 'Showing event summary'}
  {level === 2 && 'Showing full event details'}
  {level === 3 && 'Showing sources and evidence'}
</div>
```

### 5C: Focus management

When expanding to a new level, the newly-revealed content should receive focus for keyboard
users. Add a ref to each level section and focus it on transition:

```tsx
import { useRef, useEffect } from 'react';

const level1Ref = useRef<HTMLDivElement>(null);
const level2Ref = useRef<HTMLDivElement>(null);
const level3Ref = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (level === 1) level1Ref.current?.focus();
  if (level === 2) level2Ref.current?.focus();
  if (level === 3) level3Ref.current?.focus();
}, [level]);
```

Add `ref={level1Ref} tabIndex={-1}` to each level's container div.

---

## Step 6: Mobile Optimization

On small screens (< 640px), Level 3 can be quite long. Consider two approaches:

### Option A: Inline (recommended for simplicity)
Level 3 renders inline as it does on desktop, but with slightly tighter padding. The
existing implementation handles this naturally with responsive Tailwind classes.

### Option B: SlideOver (optional enhancement)
If the SlideOver component exists from the person detail pages, you could trigger Level 3
content in a SlideOver on mobile. This keeps the timeline position stable.

**For Phase 3, implement Option A.** If the SlideOver already exists as a shared component,
adapting it for Level 3 on mobile is a future enhancement.

Ensure the following mobile-specific adjustments:

```tsx
// In SourcesEvidencePanel, make the EFTA table scroll horizontally on small screens:
<div className="rounded border border-surface-border bg-surface-card divide-y divide-surface-border overflow-x-auto">
```

```tsx
// In EventCard, stack the control buttons vertically on very small screens:
<div className="flex items-center gap-3 mt-3 flex-wrap">
```

---

## Step 7: Final Integration Test

Run the full build and test all disclosure levels end-to-end:

```bash
npm run parse
npm run dev
```

### Test Checklist

**Level 0 (Scanline):**
- [ ] Date, title, 3-line body preview visible
- [ ] Tag pills (max 3) visible
- [ ] Verification badge visible when applicable
- [ ] Source tags (max 3) visible
- [ ] "+ Summary" button visible

**Level 1 (Summary):**
- [ ] Summary paragraph renders (2-3 sentences)
- [ ] All source tags now visible (not capped at 3)
- [ ] People chips render and are clickable (link to `/people/[slug]`)
- [ ] EFTA document numbers display
- [ ] Verification/discrepancy banners appear
- [ ] "+ Full Details" and "− Collapse" buttons visible

**Level 2 (Full Detail):**
- [ ] Full markdown body renders with proper formatting
- [ ] Tables, links, bold text all render correctly
- [ ] "+ Sources & Evidence" and "− Collapse" buttons visible
- [ ] Body text doesn't duplicate the summary

**Level 3 (Sources & Evidence):**
- [ ] EFTA links render as clickable rows opening PDFs in new tabs
- [ ] Source attributions show tag + description
- [ ] Related events render with dates and titles
- [ ] Clicking a related event scrolls to it and expands to Level 1
- [ ] Related themes render as pill links to `/themes#[id]`
- [ ] Discrepancies render in side-by-side comparison format
- [ ] "− Collapse" button visible, no expand button

**Cross-cutting:**
- [ ] "Expand all summaries" per-era button works (all events go to Level 1)
- [ ] URL hash updates on expand, auto-expands on page load
- [ ] Keyboard: Enter expands, Escape collapses
- [ ] Tab key moves between events
- [ ] Animations are smooth and not jarring
- [ ] Print view: all events expand to Level 2, controls hidden
- [ ] Mobile (375px): all levels readable, no horizontal overflow
- [ ] Filters still work correctly with all disclosure levels
- [ ] Era quick-jump still scrolls to correct positions
- [ ] No performance issues with 130+ events (check for unnecessary re-renders)

---

## Files Modified (Summary)

| File | Action |
|------|--------|
| `src/components/timeline/SourcesEvidencePanel.tsx` | **REWRITTEN** — full implementation |
| `src/components/timeline/EventCard.tsx` | Add `onNavigateToEvent` prop, animation wrapper, accessibility |
| `src/app/timeline/page.tsx` | Add navigation handler, per-event expand tracking, print button |
| `src/app/globals.css` | Add print styles |
| `tailwind.config.js` | Add animation keyframes (if needed) |

---

## Post-Phase 3: What's Done

After completing all three phases, the timeline page supports:

1. **4-level progressive disclosure** — users can drill from scanline → summary → full detail → source evidence
2. **Rich cross-linking** — clicking people, related events, and themes navigates within the site
3. **EFTA document access** — direct PDF links to DOJ-hosted documents
4. **Source transparency** — every claim is attributed with expandable source descriptions
5. **Discrepancy visibility** — conflicting source information is presented side-by-side
6. **Keyboard accessible** — full keyboard navigation through events and levels
7. **Print-ready** — one-click expansion for print/PDF export
8. **URL-shareable** — deep links to specific events at specific disclosure levels

The design philosophy of "information density on demand" from CC_GUIDE_2 is now fully realized
in the timeline view.
