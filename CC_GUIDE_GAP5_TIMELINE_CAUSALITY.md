# CC_GUIDE — Gap 5: Timeline Causality
## Epstein Files Research Database — UX Improvement Series

**Purpose:** Give the timeline a spine. Three additions: (1) Era synthesis paragraphs —
a written analytical paragraph below each era header explaining what that period's events
mean and how they set up what follows, (2) Causal annotations on ~22 specific high-signal
event pairs, rendering as "→ Led to" and "← Enabled by" links inside Level 1 of those
EventCards, and (3) Event-type clustering — an optional toggle within each era that groups
events by type (trafficking, legal, financial, political, death, media) so researchers can
follow a single thread across an era without wading through all event types.

**Estimated implementation time:** 5–7 hours  
**Risk to existing functionality:** Low-medium — the EventCard gains two optional
new data fields; the timeline page gains a new filter toggle and new header content.
The 4-level disclosure system is preserved exactly. No parse script changes.  
**Build verification:** `npm run build` after each phase. Test in browser after Phase 2
and after Phase 3 before proceeding.

---

## What's Being Added and Why

**Current state:** The timeline has 130+ events organized into six era sections, each with
a bold header (e.g. "1990–2000: Building the Machine"). Events within an era are a flat
chronological list. The user can expand any event to four levels of detail and jump between
related events. But there's no synthesis: nothing explains what the era meant, what pattern
was operating, or what its events collectively produced.

**After this guide:** Every era section opens with a 3–5 sentence analytical paragraph.
~22 high-importance events carry "→ This led to" links pointing to their downstream
consequences, and the downstream events carry "← This was enabled by" backlinks. An
optional "Group by type" toggle within each era clusters the flat list into labeled type
groups — so the user can see all the legal moves in an era together, then all the financial
moves, etc.

The causal links and era synthesis are primarily content work. This guide provides all
prose and causal pair data as a static file — no parsing required.

---

## Phase 0: Verify EventCard Level 1 Structure

Before writing new code, confirm that `src/components/timeline/EventCard.tsx` renders
something at Level 1 that includes people chips and a summary paragraph. The causal
annotations will be inserted inside the Level 1 content block, after the summary paragraph
and before the people chips (or after — follow whichever order is cleaner for the
specific layout).

Also confirm the `TimelineEvent` interface in `src/types/index.ts` has `relatedEventIds?`
as an optional field (added in the progressive disclosure work). The causal fields
(`causedByEventId`, `causedEventIds`) are *new* optional fields that follow the same pattern.

---

## Phase 1: Create `src/data/timeline-causality.ts`

This file has two exports: era synthesis paragraphs and causal event pairs. Both are
static authored content — no parsing, no computation.

```typescript
// src/data/timeline-causality.ts
// Era synthesis paragraphs and causal event pair annotations for the Timeline.
// Era IDs must match the TimelineEra type in src/types/index.ts.
// Causal event IDs must match actual event IDs in src/data/timeline.json.
// Run: node -e "require('./src/data/timeline.json').map(e => console.log(e.id, e.date))"
// to verify event IDs before Claude Code uses this file.

export type TimelineEra =
  | 'pre-1990' | '1990-2000' | '2001-2007'
  | '2008-2018' | '2019' | '2020-present';

// ─── Era Synthesis Paragraphs ─────────────────────────────────────────────

export interface EraSynthesis {
  era: TimelineEra;
  headline: string;        // 6-10 words: the era's defining pattern
  synthesis: string;       // 3-5 sentences of analytical prose
  keyShift: string;        // 1 sentence: what changed at the end of this era
}

export const eraSyntheses: EraSynthesis[] = [
  {
    era: 'pre-1990',
    headline: 'Before the Machine: Origins and Early Access',
    synthesis: `The pre-1990 record establishes the biographical preconditions for everything
      that followed — Epstein's entry into Bear Stearns in 1976 without a college degree,
      his relationship with Les Wexner that would eventually produce a multi-hundred-million-dollar
      transfer of wealth and property, and his departure from Bear Stearns under circumstances
      that have never been fully explained. The Dalton School hiring — brokered by Donald Barr,
      father of future Attorney General William Barr — is a small fact that becomes significant
      only in retrospect. The key pattern of this period is Epstein gaining access to powerful
      institutions and wealthy individuals through an unusual combination of financial acumen
      and cultivated social presentation, without the credentials or background those institutions
      typically required.`,
    keyShift: `By the late 1980s, Epstein had established the Wexner relationship and the
      financial infrastructure that would fund the network's expansion in the following decade.`,
  },
  {
    era: '1990-2000',
    headline: 'Building the Machine: Infrastructure and Recruitment',
    synthesis: `The 1990s are when the operation became systematic. The Manhattan townhouse
      transferred from Wexner (1989–1993), the Palm Beach estate, the private island, the
      New Mexico Zorro Ranch — the property infrastructure of the network was established in
      this decade. Ghislaine Maxwell arrived in New York following her father Robert Maxwell's
      death in 1991 and became the operational director of the recruitment and management
      system. Jean-Luc Brunel's MC2 Model Management extended the recruitment infrastructure
      internationally. The 1990s events show a deliberate buildout: not one predator acting
      opportunistically, but a system with logistics, staff, properties across multiple
      jurisdictions, and international reach — all funded by wealth whose origins remain only
      partially explained.`,
    keyShift: `By 2000, the trafficking infrastructure was fully operational across at least
      four major properties, with an international recruitment arm and a management layer
      that insulated Epstein from direct contact with victims during initial recruitment.`,
  },
  {
    era: '2001-2007',
    headline: 'Exposure and Evasion: The Florida Investigation',
    synthesis: `This era is defined by the Palm Beach Police Department investigation that
      began in 2005 and the extraordinary legal maneuvering that followed. Detective Joseph
      Recarey's investigation documented the trafficking operation at the Palm Beach estate
      with a level of evidentiary specificity that should have led to serious federal charges.
      Instead, Alexander Acosta's office in the Southern District of Florida negotiated an
      Non-Prosecution Agreement in 2007–2008 that gave Epstein an 18-month state plea, daily
      work release, and — most critically — blanket immunity for unnamed co-conspirators,
      without notifying victims as required by the Crime Victims' Rights Act. The legal
      record from this era is among the most extensively documented parts of the case, precisely
      because the 2019 prosecution and Maxwell trial later scrutinized these years in detail.`,
    keyShift: `The 2008 NPA ended federal accountability for the trafficking operation and
      granted immunity to an undetermined number of unnamed co-conspirators — the most
      significant legal outcome of the case, before any conviction.`,
  },
  {
    era: '2008-2018',
    headline: 'Post-Conviction Networking: Immunity and Continued Access',
    synthesis: `This is the era that most confounds intuition. Epstein served 13 months
      of an 18-month sentence — with daily work release — and emerged to resume his
      social and professional network almost immediately. The flight logs document him
      traveling to New York and his other properties almost continuously following release.
      The political and academic relationships documented in this period — visits from
      prominent figures, continued funding of academic institutions, new relationships
      built despite the 2008 conviction — suggest that the NPA's immunity provisions had
      effectively quarantined the legal consequences without producing social consequences.
      Efforts by victims' attorneys to challenge the NPA, and Julie Brown's Miami Herald
      investigation beginning in 2018, mark the beginning of the end of this period.`,
    keyShift: `Julie Brown's November 2018 Miami Herald series "Perversion of Justice" broke
      the sealed NPA documents into public consciousness and triggered the federal
      investigation that would lead to Epstein's 2019 re-arrest.`,
  },
  {
    era: '2019',
    headline: 'Second Arrest, Death, and Unanswered Questions',
    synthesis: `The 2019 era spans six months and contains the densest cluster of
      consequential events in the entire timeline. Epstein was arrested at Teterboro Airport
      on July 6, 2019, on charges that overlapped substantially with the original Florida
      investigation. He was denied bail, placed at the Metropolitan Correctional Center in
      Manhattan, placed on suicide watch following an incident on July 23, removed from
      suicide watch on July 29, and found dead on August 10. The MCC surveillance footage
      from August 9–10 was subsequently confirmed destroyed. Two guards on duty that night
      were found to have been asleep and falsified their logs. The medical examiner ruled
      the death a suicide; the private examiner retained by Epstein's estate ruled the
      evidence more consistent with homicide. Attorney General William Barr — whose father
      hired Epstein at Dalton in 1974 — called the death a suicide and closed the
      primary prosecution.`,
    keyShift: `Epstein's death without trial ended the federal prosecution before any
      co-conspirators were named in court, produced no public testimony about the
      network's full scope, and left the most significant accountability question
      in the case permanently open.`,
  },
  {
    era: '2020-present',
    headline: 'The EFTA Era: Documents, Trials, and Ongoing Investigation',
    synthesis: `The post-2019 period is defined by two tracks running in parallel: the
      Maxwell prosecution (arrested December 2020, convicted December 2021, sentenced June 2022)
      and the document release track that culminated in the Epstein Files Transparency Act.
      Maxwell's trial produced the most authoritative courtroom record of the trafficking
      operation's mechanics, but her refusal to name additional co-conspirators — and the
      reportedly rejected offer to implicate Donald Trump in exchange for sentence reduction
      — meant the trial's accountability was bounded. The EFTA, passed with a veto-proof
      majority in 2025 despite executive opposition, produced 3.5 million pages across
      12 datasets. Community researchers using tools built for the purpose — JMail.world,
      EpsteinExposed.com, multiple GitHub repositories — are systematically working through
      the release. Congressional investigations and international prosecutions (France,
      Germany) continue. The Wexner congressional deposition in February 2026 — the first
      time he testified under oath — produced five hours of claimed non-recollection.`,
    keyShift: `As of early 2026, the accountability record consists of one conviction
      (Maxwell), no named co-conspirators beyond those identified by victims' lawsuits,
      and 3.5 million pages of documents that remain largely unanalyzed.`,
  },
];

// ─── Causal Event Pairs ───────────────────────────────────────────────────
// Each entry defines a directional causal relationship between two events.
// causeId: the event that produced the consequence
// consequenceId: the event that was produced
// description: 1 sentence explaining the causal mechanism
// IMPORTANT: verify both IDs against actual timeline.json before rendering.
// Unknown IDs are filtered out silently at render time.

export interface CausalPair {
  causeId: string;          // upstream event ID
  consequenceId: string;    // downstream event ID
  description: string;      // 1 sentence causal mechanism
}

export const causalPairs: CausalPair[] = [
  // ── Pre-1990 → 1990-2000 ───────────────────────────────────────────────
  {
    causeId: 'wexner-power-of-attorney',
    consequenceId: 'manhattan-townhouse-transfer',
    description: `Wexner's grant of power of attorney over his finances gave Epstein the
      legal authority to execute the townhouse transfer and other asset movements.`,
  },
  {
    causeId: 'robert-maxwell-death-1991',
    consequenceId: 'ghislaine-maxwell-joins-epstein-new-york',
    description: `Robert Maxwell's death in November 1991 left Ghislaine without her primary
      financial patron and social anchor; she relocated to New York and began her operational
      role in the Epstein network within months.`,
  },

  // ── 1990-2000 → 2001-2007 ─────────────────────────────────────────────
  {
    causeId: 'mc2-model-management-founded',
    consequenceId: 'brunel-international-recruitment',
    description: `Brunel's MC2, backed by funding from Epstein, created the international
      model scouting infrastructure that facilitated recruitment from France, Eastern Europe,
      and Brazil throughout the 2000s.`,
  },
  {
    causeId: 'palm-beach-estate-acquired',
    consequenceId: 'palm-beach-police-investigation-begins',
    description: `The Palm Beach estate was the primary site of the documented trafficking
      activity that triggered the 2005 Palm Beach Police Department investigation.`,
  },

  // ── 2001-2007 causal chains ───────────────────────────────────────────
  {
    causeId: 'palm-beach-police-investigation-begins',
    consequenceId: 'federal-investigation-referred-to-acosta',
    description: `The Palm Beach PD investigation produced the evidentiary record —
      victim testimony, DNA evidence, surveillance — that was referred to the Southern
      District of Florida under Acosta's leadership.`,
  },
  {
    causeId: 'federal-investigation-referred-to-acosta',
    consequenceId: 'npa-signed-2008',
    description: `Acosta's office received the referral and, instead of proceeding with
      federal charges, negotiated the Non-Prosecution Agreement that gave Epstein an
      18-month state sentence and blanket immunity for unnamed co-conspirators.`,
  },
  {
    causeId: 'npa-signed-2008',
    consequenceId: 'victims-not-notified-cvra-violation',
    description: `The NPA was executed without notifying victims as required by the Crime
      Victims' Rights Act — a violation that became the basis for a decade of legal
      challenges and was later confirmed by federal courts.`,
  },
  {
    causeId: 'npa-signed-2008',
    consequenceId: 'co-conspirators-receive-immunity',
    description: `The NPA's blanket immunity provisions covered unnamed co-conspirators —
      including Kellen, Ross, Groff, and Marcinkova — ending their federal exposure
      for participation in the trafficking operation.`,
  },
  {
    causeId: 'npa-signed-2008',
    consequenceId: 'acosta-appointed-labor-secretary',
    description: `Despite the NPA's controversial terms, Acosta was confirmed as Secretary
      of Labor in 2017 without the agreement receiving significant Senate scrutiny —
      a confirmation that became politically significant only after Epstein's 2019 arrest.`,
  },

  // ── 2008-2018 causal chains ───────────────────────────────────────────
  {
    causeId: 'victims-not-notified-cvra-violation',
    consequenceId: 'cvra-lawsuit-filed-victims-attorneys',
    description: `Victims' attorneys Brad Edwards and Paul Cassell filed suit challenging
      the NPA's non-notification as a CVRA violation — the lawsuit that would eventually
      result in the NPA being declared illegal.`,
  },
  {
    causeId: 'epstein-released-2009',
    consequenceId: 'epstein-resumes-social-network-post-release',
    description: `Epstein's release, with the immunity grants intact, allowed him to
      immediately resume political and academic relationships that his conviction should
      have foreclosed — a pattern documented extensively in the post-2009 flight logs.`,
  },
  {
    causeId: 'julie-brown-investigation-begins',
    consequenceId: 'miami-herald-perversion-of-justice-published',
    description: `Brown's multi-year investigation of the NPA and its victims — which
      required locating and interviewing over 80 victims — produced the November 2018
      Miami Herald series that forced the NPA back into public and prosecutorial attention.`,
  },
  {
    causeId: 'miami-herald-perversion-of-justice-published',
    consequenceId: 'sdny-federal-investigation-reopens',
    description: `The Miami Herald series prompted the Southern District of New York —
      separately from the Southern District of Florida that had negotiated the NPA — to
      open a new investigation that did not consider itself bound by the original agreement.`,
  },

  // ── 2019 causal chains ────────────────────────────────────────────────
  {
    causeId: 'sdny-federal-investigation-reopens',
    consequenceId: 'epstein-arrested-teterboro-2019',
    description: `The SDNY investigation produced the July 2019 indictment and Epstein's
      arrest at Teterboro Airport on his return from Paris.`,
  },
  {
    causeId: 'epstein-arrested-teterboro-2019',
    consequenceId: 'acosta-resigns-labor-secretary',
    description: `Epstein's arrest immediately renewed scrutiny of the 2008 NPA Acosta
      had negotiated; within three weeks he resigned as Secretary of Labor.`,
  },
  {
    causeId: 'epstein-suicide-watch-removed',
    consequenceId: 'epstein-found-dead-mcc',
    description: `Epstein was removed from suicide watch on July 29, despite a prior
      incident on July 23; he was found dead on August 10 without a cellmate and with
      guards who had falsified their monitoring logs.`,
  },
  {
    causeId: 'mcc-surveillance-footage-destroyed',
    consequenceId: 'death-circumstances-unresolved',
    description: `The destruction of surveillance footage from the relevant period means
      the core evidentiary question — what happened in Epstein's cell between lights-out
      and when guards found him — cannot be answered from the documentary record.`,
  },
  {
    causeId: 'epstein-found-dead-mcc',
    consequenceId: 'sdny-prosecution-dropped',
    description: `Epstein's death terminated the SDNY prosecution before any co-conspirators
      were charged or named in court — the primary consequence of his death for accountability.`,
  },

  // ── 2019 → 2020-present ────────────────────────────────────────────────
  {
    causeId: 'epstein-found-dead-mcc',
    consequenceId: 'maxwell-federal-investigation-accelerates',
    description: `With Epstein dead, federal prosecutors redirected investigative resources
      to Maxwell as the most senior living figure with operational knowledge of the network.`,
  },
  {
    causeId: 'cvra-lawsuit-filed-victims-attorneys',
    consequenceId: 'npa-declared-illegal-federal-court',
    description: `The decade-long CVRA lawsuit ultimately produced a federal court ruling
      that the NPA had been illegally negotiated due to non-notification of victims —
      though the ruling came too late to affect Epstein's prosecution directly.`,
  },
  {
    causeId: 'miami-herald-perversion-of-justice-published',
    consequenceId: 'efta-legislation-introduced',
    description: `The sustained public attention generated by Brown's reporting — and the
      subsequent Epstein arrest, death, and Maxwell trial — created the political conditions
      for the Epstein Files Transparency Act's passage with a veto-proof majority.`,
  },
  {
    causeId: 'maxwell-convicted-2021',
    consequenceId: 'maxwell-appeals-sentence-reduction',
    description: `Maxwell's conviction on five counts did not produce the testimony about
      additional co-conspirators that investigators had sought; her subsequent appeals and
      reported offer to implicate Trump in exchange for a reduction were rejected.`,
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────

/** Get all events that this event caused (downstream) */
export function getCausedBy(eventId: string): CausalPair[] {
  return causalPairs.filter((p) => p.consequenceId === eventId);
}

/** Get all events this event led to (upstream consequence) */
export function getLeadsTo(eventId: string): CausalPair[] {
  return causalPairs.filter((p) => p.causeId === eventId);
}

/** Get synthesis for a given era */
export function getEraSynthesis(era: string): EraSynthesis | undefined {
  return eraSyntheses.find((s) => s.era === era);
}
```

---

## Phase 2: Create `EraSynthesisBlock.tsx`

Renders below the era header, above the events list. Collapsed by default to avoid
overwhelming users who just want to scan events; expandable with one click.

```typescript
// src/components/timeline/EraSynthesisBlock.tsx
import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import type { EraSynthesis } from '@/data/timeline-causality';

interface Props {
  synthesis: EraSynthesis;
}

export default function EraSynthesisBlock({ synthesis }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="mb-5 rounded-lg border border-surface-border bg-surface-card overflow-hidden"
      aria-label={`Era synthesis: ${synthesis.headline}`}
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3
                   text-left hover:bg-surface-elevated transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <BookOpen
            size={13}
            className="text-text-muted shrink-0"
            aria-hidden
          />
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest truncate">
            {synthesis.headline}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-accent-blue">
            {expanded ? 'Collapse' : 'Analysis'}
          </span>
          {expanded
            ? <ChevronUp size={12} className="text-text-muted" aria-hidden />
            : <ChevronDown size={12} className="text-text-muted" aria-hidden />
          }
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-surface-border">
          <p className="text-sm text-text-secondary leading-relaxed mt-3 mb-3">
            {synthesis.synthesis.trim()}
          </p>

          {/* Key shift callout */}
          <div
            className="flex items-start gap-2.5 bg-surface rounded border-l-2
                       border-amber-600/60 px-3 py-2.5"
            aria-label="Key transition to next era"
          >
            <ArrowRight
              size={12}
              className="text-amber-500 shrink-0 mt-0.5"
              aria-hidden
            />
            <p className="text-xs text-text-secondary leading-relaxed">
              <span className="text-amber-400 font-medium">Transition: </span>
              {synthesis.keyShift.trim()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Phase 3: Create `CausalAnnotation.tsx`

Renders inside EventCard at Level 1 (and above), showing which events this event
caused and which events caused it. Uses the lookup helpers from `timeline-causality.ts`.

```typescript
// src/components/timeline/CausalAnnotation.tsx
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getCausedBy, getLeadsTo } from '@/data/timeline-causality';
import timelineData from '@/data/timeline.json';
import type { TimelineEvent } from '@/types';

const allEvents = timelineData as TimelineEvent[];

interface Props {
  eventId: string;
  onNavigate?: (eventId: string) => void;
}

export default function CausalAnnotation({ eventId, onNavigate }: Props) {
  const leadsTo = getLeadsTo(eventId);
  const causedBy = getCausedBy(eventId);

  // Filter to only pairs where the related event actually exists in timeline.json
  const validLeadsTo = leadsTo.filter((p) =>
    allEvents.some((e) => e.id === p.consequenceId)
  );
  const validCausedBy = causedBy.filter((p) =>
    allEvents.some((e) => e.id === p.causeId)
  );

  if (validLeadsTo.length === 0 && validCausedBy.length === 0) return null;

  function getTitle(id: string) {
    return allEvents.find((e) => e.id === id)?.title ?? id;
  }

  function handleClick(e: React.MouseEvent, targetId: string) {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(targetId);
    } else {
      // Fallback: scroll to target event
      const el = document.getElementById(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  return (
    <div
      className="mt-3 pt-3 border-t border-surface-border/50 space-y-2"
      aria-label="Causal connections"
    >
      {/* "Caused by" entries */}
      {validCausedBy.map((pair) => (
        <div key={pair.causeId} className="flex items-start gap-2">
          <ArrowLeft
            size={11}
            className="text-blue-400/70 shrink-0 mt-0.5"
            aria-hidden
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-blue-400/70 uppercase tracking-widest">
                Enabled by
              </span>
              <button
                onClick={(e) => handleClick(e, pair.causeId)}
                className="text-xs text-accent-blue hover:text-accent-blueHover
                           transition-colors text-left leading-snug"
                aria-label={`Navigate to: ${getTitle(pair.causeId)}`}
              >
                {getTitle(pair.causeId)}
              </button>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed mt-0.5">
              {pair.description.trim()}
            </p>
          </div>
        </div>
      ))}

      {/* "Leads to" entries */}
      {validLeadsTo.map((pair) => (
        <div key={pair.consequenceId} className="flex items-start gap-2">
          <ArrowRight
            size={11}
            className="text-amber-400/70 shrink-0 mt-0.5"
            aria-hidden
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest">
                Led to
              </span>
              <button
                onClick={(e) => handleClick(e, pair.consequenceId)}
                className="text-xs text-accent-blue hover:text-accent-blueHover
                           transition-colors text-left leading-snug"
                aria-label={`Navigate to: ${getTitle(pair.consequenceId)}`}
              >
                {getTitle(pair.consequenceId)}
              </button>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed mt-0.5">
              {pair.description.trim()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Phase 4: Update `EventCard.tsx` to Render Causal Annotations

Open `src/components/timeline/EventCard.tsx`. Make two targeted additions:

### Step 4a: Import `CausalAnnotation`

```typescript
import CausalAnnotation from '@/components/timeline/CausalAnnotation';
```

### Step 4b: Insert `CausalAnnotation` inside the Level 1 content block

Find the Level 1 expanded content section (where the `summary` paragraph renders and
people chips appear). At the end of that Level 1 section — after the summary paragraph
and people chips, before the Level 1 collapse trigger — insert:

```tsx
{/* Causal annotations — only at Level 1+ */}
{level >= 1 && (
  <CausalAnnotation
    eventId={event.id}
    onNavigate={onNavigateToEvent}
  />
)}
```

The `onNavigateToEvent` prop already exists on `EventCard` — pass it through to
`CausalAnnotation` so the navigation callback chain is maintained.

---

## Phase 5: Event-Type Clustering Toggle

Within each era section in `timeline/page.tsx`, add a "Group by type" toggle. When active,
events are grouped by tag type (trafficking, legal, financial, political, intelligence, media,
death, flight) rather than shown in pure chronological order. Within each type group, events
remain chronological.

### Step 5a: Define type groups and display labels

Add this constant to `src/app/timeline/page.tsx` near the top:

```typescript
// Event type cluster groups — ordered by default display sequence
const TYPE_CLUSTER_GROUPS: Array<{ key: string; label: string; icon: string }> = [
  { key: 'trafficking', label: 'Trafficking',   icon: '⚠' },
  { key: 'legal',       label: 'Legal',          icon: '⚖' },
  { key: 'financial',   label: 'Financial',      icon: '$' },
  { key: 'political',   label: 'Political',      icon: '◈' },
  { key: 'intelligence',label: 'Intelligence',   icon: '◉' },
  { key: 'death',       label: 'Death / Prison', icon: '✕' },
  { key: 'media',       label: 'Media',          icon: '◎' },
  { key: 'flight',      label: 'Flight / Travel',icon: '→' },
];

// Events not matching any type group tag fall into "Other"
const UNCLUSTERED_LABEL = 'Other';
```

### Step 5b: Add cluster toggle state

After the existing state declarations, add:

```typescript
const [clusterByType, setClusterByType] = useState(false);
```

### Step 5c: Render the toggle in the era header

Locate the era section header block. Currently it looks like:

```tsx
{/* Era divider */}
<div className="flex items-center gap-4 mb-6">
  <div className="flex-1 h-px bg-surface-border" />
  <h2 id={`era-${era}`} ...>{ERA_LABELS[era]}</h2>
  <div className="flex-1 h-px bg-surface-border" />
</div>

{/* Bulk expand button */}
<div className="flex justify-end mb-3 print:hidden">
  <button onClick={() => setEraExpandLevel(era, 1)}>Expand all summaries</button>
</div>
```

Update the bulk-expand row to include the cluster toggle on the left:

```tsx
<div className="flex items-center justify-between mb-3 print:hidden">
  <button
    onClick={() => setClusterByType((c) => !c)}
    aria-pressed={clusterByType}
    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border
                transition-colors
                ${clusterByType
                  ? 'border-accent-blue/50 text-accent-blue bg-accent-blue/8'
                  : 'border-surface-border text-text-muted hover:text-text-secondary'
                }`}
  >
    <span aria-hidden>⊞</span>
    {clusterByType ? 'Grouped by type' : 'Group by type'}
  </button>
  <button
    onClick={() => setEraExpandLevel(era, 1)}
    className="text-xs text-text-muted hover:text-text-secondary transition-colors"
  >
    Expand all summaries
  </button>
</div>
```

**Note:** The `clusterByType` toggle is a single global state that applies to all eras
simultaneously. This is simpler to implement and the UX is acceptable — users who want
clustering generally want it across the whole timeline. If per-era clustering is desired,
this state can be changed to `Map<TimelineEra, boolean>`.

### Step 5d: Implement clustered rendering inside each era

Replace the flat event list rendering within each era. The current code is approximately:

```tsx
<div className="space-y-4">
  {eraEvents.map((event) => (
    <EventCard key={...} event={event} ... />
  ))}
</div>
```

Replace with:

```tsx
{clusterByType ? (
  // Grouped rendering
  <div className="space-y-6">
    {(() => {
      // Assign each event to its primary type group
      const grouped = new Map<string, TimelineEvent[]>();
      const unkeyed: TimelineEvent[] = [];

      for (const event of eraEvents) {
        const matchedGroup = TYPE_CLUSTER_GROUPS.find((g) =>
          event.tags.includes(g.key)
        );
        if (matchedGroup) {
          if (!grouped.has(matchedGroup.key)) grouped.set(matchedGroup.key, []);
          grouped.get(matchedGroup.key)!.push(event);
        } else {
          unkeyed.push(event);
        }
      }

      const sections: Array<{ key: string; label: string; icon: string; events: TimelineEvent[] }> = [];
      for (const group of TYPE_CLUSTER_GROUPS) {
        const groupEvents = grouped.get(group.key);
        if (groupEvents && groupEvents.length > 0) {
          sections.push({ ...group, events: groupEvents });
        }
      }
      if (unkeyed.length > 0) {
        sections.push({ key: 'other', label: UNCLUSTERED_LABEL, icon: '·', events: unkeyed });
      }

      if (sections.length === 0) return null;

      return sections.map((section) => (
        <div key={section.key}>
          {/* Type group header */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] text-text-muted" aria-hidden>
              {section.icon}
            </span>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
              {section.label}
            </span>
            <span className="text-[10px] text-text-muted">
              ({section.events.length})
            </span>
            <div className="flex-1 h-px bg-surface-border/50 ml-1" />
          </div>
          {/* Events in this type group */}
          <div className="space-y-4">
            {section.events.map((event) => {
              const overrideLevel = expandedEvents.get(event.id);
              const eraLevel = eraLevels.get(event.era);
              const hashLevel = initialExpandId === event.id ? 1 : undefined;
              const effectiveLevel = (overrideLevel ?? hashLevel ?? eraLevel ?? 0) as DisclosureLevel;
              return (
                <EventCard
                  key={`${event.id}-${effectiveLevel}`}
                  event={event}
                  initialLevel={effectiveLevel}
                  onNavigateToEvent={handleNavigateToEvent}
                />
              );
            })}
          </div>
        </div>
      ));
    })()}
  </div>
) : (
  // Flat rendering — original behavior
  <div className="space-y-4">
    {eraEvents.map((event) => {
      const overrideLevel = expandedEvents.get(event.id);
      const eraLevel = eraLevels.get(event.era);
      const hashLevel = initialExpandId === event.id ? 1 : undefined;
      const effectiveLevel = (overrideLevel ?? hashLevel ?? eraLevel ?? 0) as DisclosureLevel;
      return (
        <EventCard
          key={`${event.id}-${effectiveLevel}`}
          event={event}
          initialLevel={effectiveLevel}
          onNavigateToEvent={handleNavigateToEvent}
        />
      );
    })}
  </div>
)}
```

---

## Phase 6: Update `timeline/page.tsx` — Import and Wire Era Synthesis

### Step 6a: Add imports

```typescript
import EraSynthesisBlock from '@/components/timeline/EraSynthesisBlock';
import { getEraSynthesis } from '@/data/timeline-causality';
```

### Step 6b: Insert synthesis block in each era section

Inside the era section's render loop, after the era header `<div>` and before the
bulk-expand/cluster-toggle row, insert:

```tsx
{/* Era synthesis — collapsed by default */}
{(() => {
  const synthesis = getEraSynthesis(era);
  return synthesis ? <EraSynthesisBlock synthesis={synthesis} /> : null;
})()}
```

The full era section structure now reads:

```tsx
<section key={era} ref={...} aria-labelledby={`era-${era}`} className="mb-12">
  {/* Era divider */}
  <div className="flex items-center gap-4 mb-4"> ... </div>

  {/* Era synthesis — NEW */}
  {getEraSynthesis(era) && (
    <EraSynthesisBlock synthesis={getEraSynthesis(era)!} />
  )}

  {/* Bulk-expand + cluster toggle row */}
  <div className="flex items-center justify-between mb-3 print:hidden"> ... </div>

  {/* Events (clustered or flat) */}
  {clusterByType ? ( ... ) : ( ... )}
</section>
```

---

## Phase 7: TypeScript — No Data Model Changes Required

The causal pair data is static and lives in `timeline-causality.ts`. No new fields
are added to the `TimelineEvent` interface — the `CausalAnnotation` component looks up
causal relationships by `event.id` from the static data file, not from the event object
itself.

Verify that `src/types/index.ts` does NOT need changes. The causal data is decoupled
from the event objects by design — this allows causal annotations to be updated without
regenerating `timeline.json`.

**Check that `EraSynthesis` and `CausalPair` are properly exported** from
`src/data/timeline-causality.ts` and importable from the component files. TypeScript
may require explicit `export type` syntax for the types if isolatedModules is enabled:

```typescript
export type { EraSynthesis, CausalPair, TimelineEra };
```

---

## Phase 8: Verify Event IDs in `causalPairs`

The `causalPairs` array uses event IDs that follow expected slug patterns. Before rendering,
run:

```bash
node -e "const t = require('./src/data/timeline.json'); t.forEach(e => console.log(e.id, e.date ?? ''))" | sort
```

Compare the output against the `causeId` and `consequenceId` values in `causalPairs`.
The `CausalAnnotation` component filters out pairs where the referenced event doesn't
exist in `timeline.json` — so mismatched IDs fail silently. But they mean the annotation
won't render at all.

For each ID mismatch, update the `causalPairs` entry to use the correct ID. The description
prose is correct regardless of ID — only the ID needs to match the actual parsed slug.

Common slug patterns from `parse-timeline.ts`:
- Dates in IDs: `npa-signed-2008` → could be `non-prosecution-agreement-signed` or `2008-npa-epstein`
- The parse script slugifies the event `title`, so look up the title-based slug

If the majority of IDs don't match (e.g., the parse script produces date-prefixed IDs like
`2008-07-06-npa-signed`), update the ID format in `causalPairs` to match the actual pattern.
Check 5–6 IDs first to establish the pattern before updating all 22 entries.

---

## Phase 9: Build Verification

**Step 1:** TypeScript check:
```bash
npx tsc --noEmit
```
Fix any errors. Common issues:
- `getEraSynthesis` return type needs to be `EraSynthesis | undefined`; non-null assertion
  needed at call site (or optional rendering with `&&`)
- `clusterByType` in the IIFE rendering needs explicit `TimelineEvent` type annotation

**Step 2:** Build:
```bash
npm run build
```

**Step 3:** Dev server — navigate to `/timeline/`:

**Era synthesis:**
- [ ] Every era section shows a collapsed "Analysis" bar below the era divider
- [ ] Clicking "Analysis" expands a 3–5 sentence synthesis paragraph
- [ ] The "Transition:" callout renders with amber left border and amber "Transition:" label
- [ ] "Collapse" button returns to collapsed state
- [ ] All 6 eras have synthesis (pre-1990 through 2020-present)
- [ ] Synthesis renders correctly at 375px mobile width

**Causal annotations:**
- [ ] Events with causal relationships show "Led to" or "Enabled by" rows at Level 1+
- [ ] Events with no causal relationships show nothing (null return)
- [ ] Arrow icons: blue ← for "Enabled by", amber → for "Led to"
- [ ] Clicking a causal link fires the `onNavigateToEvent` callback (if present)
  and scrolls to the target event
- [ ] Target event expands to Level 1 on navigation (existing `handleNavigateToEvent` behavior)
- [ ] Causal links don't appear at Level 0 (collapsed state)
- [ ] No causal annotations render for events with IDs not in `causalPairs`
  (confirm by opening a minor event like a flight log entry)

**Type clustering:**
- [ ] "Group by type" button appears left of "Expand all summaries" in each era header
- [ ] Clicking it groups events by type within that era
- [ ] Type group headers render with icon, label, and count
- [ ] Events without matching type tags appear in "Other" group
- [ ] Events within each type group remain in chronological order
- [ ] Toggle state applies to all eras simultaneously
- [ ] "Grouped by type" label shows when active; "Group by type" when inactive
- [ ] Switching back to flat view restores chronological order
- [ ] Bulk-expand still works in clustered mode
- [ ] URL hash navigation still works in clustered mode (event is found regardless of grouping)

**No regressions:**
- [ ] All existing 4-level EventCard disclosure still works
- [ ] Era filters still work (select specific eras, events in other eras hidden)
- [ ] Tag filters still work
- [ ] Verification filter still works
- [ ] Hash-based auto-expand on page load still works
- [ ] "Expand all summaries" per era still works
- [ ] `npm run build` produces no TypeScript errors

---

## Files Created / Modified Summary

| Action | File |
|--------|------|
| **CREATE** | `src/data/timeline-causality.ts` |
| **CREATE** | `src/components/timeline/EraSynthesisBlock.tsx` |
| **CREATE** | `src/components/timeline/CausalAnnotation.tsx` |
| **MODIFY** | `src/components/timeline/EventCard.tsx` — import + insert CausalAnnotation at Level 1 |
| **MODIFY** | `src/app/timeline/page.tsx` — import EraSynthesisBlock, getEraSynthesis; add clusterByType state; update era section render; add type-cluster IIFE |

---

## Design Notes for Claude Code

**Causal annotation placement:** The `CausalAnnotation` renders at `level >= 1` inside
`EventCard`. In the current EventCard structure, Level 1 shows: summary paragraph, people
chips, source tags, EFTA doc numbers. Insert `CausalAnnotation` after people chips and
before the bottom controls (the expand/collapse buttons). If the component file structure
makes this ambiguous, place it immediately before the Level 2 trigger button.

**ID verification is essential.** The `causalPairs` data has 22 entries with event IDs
following expected slug patterns. The `CausalAnnotation` component filters silently —
mismatched IDs produce no visible error, just missing annotations. Phase 8 verification
is not optional; run it and fix mismatches before finalizing the implementation.

**`clusterByType` is global, not per-era.** This is a deliberate simplification. A user
toggling "group by type" is making a decision about how they want to read the whole timeline,
not just one era. Making it per-era would require `Map<TimelineEra, boolean>` state and
per-era toggle buttons, which adds UI complexity for marginal benefit.

**`EraSynthesisBlock` collapsed by default.** The synthesis paragraphs are analytical
overlays on the timeline, not the primary content. Users who just want to scan events
shouldn't have to scroll past 5-sentence paragraphs on every era. The collapsed default
makes the synthesis an opt-in deepening rather than a mandatory reading.

**The IIFE pattern in JSX.** The clustered event rendering uses an immediately-invoked
function expression (`{(() => { ... })()}`) inside JSX to handle the grouping logic.
This is a common React pattern for inline logic that can't be expressed as a simple
`.map()`. If TypeScript complains about the return type, add `as React.ReactNode` to
the IIFE or extract the logic into a helper function called inside the JSX.
