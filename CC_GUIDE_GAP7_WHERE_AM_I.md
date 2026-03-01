# CC_GUIDE — Gap 7: "Where Am I in the Story?" Persistent Context
## Epstein Files Research Database — UX Improvement Series

**Purpose:** Add the connective membrane that makes the site feel like a living investigation
rather than a static archive. Three additions: (1) theme pills inside EventCard at Level 1 —
so reading a timeline event always surfaces which investigation threads it belongs to,
(2) an Active Investigation Panel on both person pages and EventCard Level 1 — showing
current legal proceedings, congressional actions, and FOIA requests relevant to what you're
reading, and (3) a collapsible Active Investigation Banner at the top of the Timeline page
showing the 5 most recent active proceedings across the whole investigation.

**Estimated implementation time:** 5–6 hours  
**Risk to existing functionality:** Low — entirely additive. Two new components, one new data
file, targeted insertions into EventCard and PersonDetailClient. No parse scripts change. No
existing data interfaces change.  
**Prerequisite:** Gap 2 must be implemented first (ThematicInvolvementRow is already on
person pages; build-connections.ts already populates `event.themeIds` via its cross-reference
pass). If Gap 2 was not implemented, `event.themeIds` may be empty arrays — verify before
proceeding (Phase 0 below).

---

## What's Being Added and Why

**Current state after Gaps 1–6:**
- Person pages have: RoleInStoryBlock, ThematicInvolvementRow, PersonMiniTimeline, PersonEgoGraph.
- EventCard at Level 1 has: summary, people chips, EFTA numbers, verification banners, CausalAnnotation.
- Neither surface answers: *Is there an active investigation into this person right now?
  Which themes does this specific event belong to? What should I follow next?*

**After this guide, three questions are answered everywhere a user lands:**

1. **Which investigation threads does this event belong to?** — EventThemeLinks appears
   inside EventCard at Level 1, showing pills that link directly to the relevant theme sections.
   Reading about the 2008 NPA now shows "→ Acosta Plea Deal · Legal History · Co-Conspirators"
   without leaving the event.

2. **Is anything happening NOW related to this person?** — ActiveInvestigationPanel appears
   above the tab bar on person pages and inside EventCard at Level 1 for events with active
   proceedings. It shows a compact status-coded list of current legal proceedings, congressional
   actions, and FOIA requests — with dates, status badges, and external links.

3. **What's the live state of the overall investigation?** — A collapsible
   ActiveInvestigationBanner at the top of the Timeline page surfaces the 5 most significant
   current proceedings. First-time users landing on Timeline see immediately that this is an
   ongoing story with new developments as recently as February 2026.

The data powering all three additions is a single static file (`investigation-status.ts`)
that maps proceedings to the people and themes they involve. No API, no parsing.

---

## Phase 0: Verify `event.themeIds` Population

Before writing any components, confirm that `event.themeIds` arrays are non-empty in
`src/data/timeline.json`. Run:

```bash
node -e "
  const t = require('./src/data/timeline.json');
  const withThemes = t.filter(e => e.themeIds && e.themeIds.length > 0);
  console.log('Events with themeIds:', withThemes.length, 'of', t.length);
  console.log('Sample:', t[0].id, t[0].themeIds);
"
```

Expected: at least 60–80% of events should have 1+ themeIds (computed by `build-connections.ts`
cross-reference pass).

**If most events have empty themeIds:** The cross-reference pass from Gap 2 was not run.
Before continuing, run `npm run parse` (which should call `build-connections.ts` last) and
re-verify.

Also verify `event.relatedThemeIds` vs `event.themeIds` — the codebase may use either field
name depending on which guide was implemented first. The `EventThemeLinks` component below uses
`themeIds`; adjust the field name in the component if the actual JSON uses `relatedThemeIds`.

---

## Phase 1: Create `src/data/investigation-status.ts`

This file is the single source of truth for all active proceedings. Render it exactly as
written. Do not alter proceeding prose.

```typescript
// src/data/investigation-status.ts
// Active proceedings, FOIA requests, and congressional investigations as of March 2026.
// All proceedings are manually curated from research source files.
// personIds must match actual person IDs in people.json.
// themeIds must match actual theme IDs in themes.json.
// Do not alter proceeding prose — render as written.

export type ProceedingStatus =
  | 'active'      // ongoing, recent activity
  | 'pending'     // filed or requested, awaiting action
  | 'scheduled'   // has a specific future date
  | 'stalled'     // blocked or unresolved with no clear next step
  | 'resolved';   // concluded (include for historical context on recent resolutions)

export type ProceedingType =
  | 'criminal'      // criminal charges or investigation
  | 'civil'         // civil lawsuit or settlement
  | 'congressional' // hearing, deposition, or contempt proceeding
  | 'foia'          // FOIA request or document dispute
  | 'international' // foreign jurisdiction prosecution
  | 'regulatory';   // regulatory or administrative action

export interface Proceeding {
  id: string;
  type: ProceedingType;
  status: ProceedingStatus;
  title: string;          // 4–8 words: what this proceeding is
  description: string;    // 1–2 sentences: what's happening and why it matters
  date?: string;          // next event date, resolution date, or "Pending" / "Ongoing"
  url?: string;           // direct link to filing, hearing, or news coverage
  personIds: string[];    // people directly involved
  themeIds: string[];     // themes this proceeding connects to
  isGlobal?: boolean;     // show in the Timeline page banner regardless of context
}

export const proceedings: Proceeding[] = [

  // ─── Criminal proceedings ────────────────────────────────────────────────

  {
    id: 'maxwell-appeals',
    type: 'criminal',
    status: 'active',
    title: 'Maxwell Sentence Appeals',
    description: `Maxwell is appealing her 20-year sentence. Her attorney has offered testimony
      exonerating both Trump and Clinton in exchange for clemency — an offer that was rejected
      by House Oversight in February 2026. The appeals represent the last active criminal
      proceeding in U.S. federal court directly connected to the trafficking operation.`,
    date: 'Ongoing',
    personIds: ['ghislaine-maxwell'],
    themeIds: ['maxwell-role-legal-history-current-status', 'the-co-conspirators-immunity-grantees'],
  },
  {
    id: 'prince-andrew-uk-criminal',
    type: 'international',
    status: 'active',
    title: 'Prince Andrew UK Arrest',
    description: `Arrested February 19, 2026 — the first arrest of a senior British royal
      in approximately 400 years — on suspicion of sharing confidential trade reports with
      Epstein while serving as UK trade envoy. UK police are leading; formal charges pending.`,
    date: 'Active — charges pending',
    personIds: ['prince-andrew'],
    themeIds: ['international-consequences-fallout', 'intelligence-connections'],
    isGlobal: true,
  },
  {
    id: 'mandelson-uk-criminal',
    type: 'international',
    status: 'active',
    title: 'Peter Mandelson UK Arrest',
    description: `Arrested February 23, 2026 on suspicion of passing market-sensitive
      government information to Epstein while serving as Business Secretary. Emails show
      Mandelson told Epstein "finally got him to go today" on May 10, 2010, the day before
      PM Brown resigned.`,
    date: 'Active — charges pending',
    personIds: ['peter-mandelson'],
    themeIds: ['international-consequences-fallout', 'intelligence-connections'],
    isGlobal: true,
  },
  {
    id: 'jagland-norway-criminal',
    type: 'international',
    status: 'active',
    title: 'Jagland Norway Corruption Charges',
    description: `Former Norwegian PM and Council of Europe Secretary General Thorbjørn Jagland
      was charged with gross corruption by Norway's Økokrim on February 24, 2026. He was
      subsequently hospitalized after an apparent suicide attempt. Norway's PM ordered a
      separate national investigation.`,
    date: 'Active',
    personIds: ['thorbjorn-jagland'],
    themeIds: ['international-consequences-fallout'],
    isGlobal: true,
  },
  {
    id: 'nm-criminal-investigation',
    type: 'criminal',
    status: 'active',
    title: 'New Mexico AG Criminal Investigation Reopened',
    description: `New Mexico AG Raúl Torrez reopened the criminal investigation into Epstein's
      Zorro Ranch in February 2026. The state legislature passed legislation for a full
      bipartisan truth commission with subpoena power. DOJ files contain anonymous allegations
      of bodies buried on the property — unverified.`,
    date: 'Active',
    personIds: [],
    themeIds: ['the-trafficking-operation', 'epsteins-properties'],
    isGlobal: true,
  },
  {
    id: 'fbi-investigation-open',
    type: 'criminal',
    status: 'stalled',
    title: 'FBI Investigation — Not Formally Closed',
    description: `The FBI has not formally closed its investigation. FBI Director Kash Patel
      refused to answer nine direct questions at September 2025 congressional hearings,
      including whether he told AG Bondi that Trump's name appeared in the files. No new
      charges have been filed; no co-conspirators beyond Maxwell have been prosecuted.`,
    date: 'No announced timeline',
    personIds: ['fbi-director-kash-patel'],
    themeIds: ['the-co-conspirators-immunity-grantees', 'acosta-plea-legal-history'],
  },

  // ─── Civil proceedings ───────────────────────────────────────────────────

  {
    id: 'leon-black-bank-of-america-trial',
    type: 'civil',
    status: 'scheduled',
    title: 'Leon Black / Bank of America Civil Trial',
    description: `Civil trial scheduled May 11, 2026. Black paid Epstein approximately $158 million
      in advisory fees — the largest known payment from any single individual. The trial may
      produce testimony about the nature of those payments and Black's knowledge of the
      trafficking operation.`,
    date: 'May 11, 2026',
    url: 'https://www.justice.gov/epstein/court-records',
    personIds: ['leon-black'],
    themeIds: ['financial-crimes-money-laundering'],
    isGlobal: true,
  },
  {
    id: 'usvi-proceedings',
    type: 'civil',
    status: 'active',
    title: 'U.S. Virgin Islands Civil Proceedings',
    description: `USVI has ongoing civil proceedings stemming from Epstein's use of Little
      St. James Island as a trafficking site. The USVI attorney general reached a settlement
      with JPMorgan and is continuing to pursue other claims. Little St. James logbooks
      referenced in FBI evidence inventory have not been fully released.`,
    date: 'Ongoing',
    personIds: [],
    themeIds: ['the-trafficking-operation', 'financial-crimes-money-laundering'],
  },

  // ─── Congressional proceedings ───────────────────────────────────────────

  {
    id: 'clinton-depositions',
    type: 'congressional',
    status: 'scheduled',
    title: 'Clinton House Oversight Depositions',
    description: `Bill and Hillary Clinton were scheduled for House Oversight depositions
      February 26–27, 2026, after bipartisan contempt proceedings were initiated. As of
      the research compilation date, the depositions had not yet taken place.`,
    date: 'February 26–27, 2026 (scheduled)',
    personIds: ['bill-clinton', 'hillary-clinton'],
    themeIds: ['media-congressional-investigations', 'political-intelligence-network'],
    isGlobal: true,
  },
  {
    id: 'lutnick-congressional',
    type: 'congressional',
    status: 'pending',
    title: 'Howard Lutnick Commerce Secretary Scrutiny',
    description: `Commerce Secretary Howard Lutnick faces bipartisan calls for resignation
      after AG Bondi deflected questions about his Epstein ties during the February 11, 2026
      hearing. Rep. Balint pressed Bondi specifically on Lutnick, Phelan, and Feinberg.
      No formal action has been taken as of compilation date.`,
    date: 'Pending',
    personIds: ['howard-lutnick'],
    themeIds: ['political-intelligence-network'],
  },
  {
    id: 'wexner-wyden-investigation',
    type: 'congressional',
    status: 'active',
    title: 'Wexner / Wyden Senate Finance Investigation',
    description: `Senator Ron Wyden's Senate Finance Committee investigation tracking Epstein's
      financial network includes Wexner as a central figure. Wexner was labeled "unindicted
      co-conspirator" in a 2019 FBI Criminal Investigative Division document. Wyden's S.2746
      would compel Treasury to release its locked "Epstein File" — the financial investigation
      DOJ has declined to conduct.`,
    date: 'Ongoing',
    personIds: ['leslie-wexner'],
    themeIds: ['financial-crimes-money-laundering', 'media-congressional-investigations'],
  },
  {
    id: 'bondi-contempt-possible',
    type: 'congressional',
    status: 'pending',
    title: 'AG Bondi Congressional Accountability',
    description: `Rep. Lieu accused AG Bondi of lying under oath during the February 11, 2026
      hearing. Bondi refused to say how many co-conspirators have been indicted, declined to
      elaborate on her "client list" claim, and deflected on Lutnick, Phelan, and Feinberg
      ties. No contempt resolution has been filed as of compilation date.`,
    date: 'Pending',
    personIds: ['pam-bondi'],
    themeIds: ['the-co-conspirators-immunity-grantees', 'media-congressional-investigations'],
  },

  // ─── FOIA proceedings ────────────────────────────────────────────────────

  {
    id: 'wyden-treasury-foia',
    type: 'foia',
    status: 'pending',
    title: 'Wyden S.2746 — Treasury "Epstein File"',
    description: `Senator Ron Wyden introduced S.2746 to compel the Treasury Department to
      release its locked "Epstein File." The Senate Finance Committee has formally requested
      records from four banks. Treasury has not complied. This is the primary unresolved
      financial accountability action.`,
    date: 'Pending — no compliance deadline set',
    url: 'https://www.finance.senate.gov',
    personIds: [],
    themeIds: ['financial-crimes-money-laundering'],
    isGlobal: true,
  },
  {
    id: 'faa-flight-plans-foia',
    type: 'foia',
    status: 'pending',
    title: 'FAA Flight Plans — 835 Post-2013 Flights',
    description: `No passenger manifests exist for any of Epstein's 835 documented flights
      after August 2013, despite those flights continuing through his 2019 arrest. FOIA
      requests to FAA for flight plans filed for aircraft N908JE, N212JE, and N491GM
      (2013–2019) remain unfulfilled. Business Insider's 2020 FOIA uncovered 704 unknown
      flights; the post-2013 passenger data has not been recovered.`,
    date: 'Pending',
    personIds: [],
    themeIds: ['the-trafficking-operation'],
  },
  {
    id: 'fbi-evidence-index-foia',
    type: 'foia',
    status: 'pending',
    title: 'FBI Evidence Index — Seized Electronic Materials',
    description: `The FBI seized 40+ computers, 26 storage drives, 70+ CDs, and 6 recording
      devices from Epstein's properties. A three-page evidence index has been referenced in
      source files but not released under EFTA. The seized media may include surveillance
      footage from Epstein's hidden camera system. FOIA requests pending to FBI New York
      Field Office.`,
    date: 'Pending',
    personIds: [],
    themeIds: ['the-trafficking-operation', 'epsteins-death-mcc'],
  },
  {
    id: 'doi-oig-complaint',
    type: 'regulatory',
    status: 'pending',
    title: 'Democracy Defenders Fund OIG Complaint',
    description: `The Democracy Defenders Fund filed an OIG complaint alleging the DOJ
      altered documents after initial publication of the EFTA release. The O'Keefe recording
      of DOJ acting Deputy Chief Joseph Schnitt alleging political interference in redactions
      was cited. DOJ has not responded publicly.`,
    date: 'Pending',
    personIds: [],
    themeIds: ['efta-release-framework-document-architecture'],
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────

/** Get all proceedings involving a specific person */
export function getProceedingsForPerson(personId: string): Proceeding[] {
  return proceedings.filter((p) => p.personIds.includes(personId));
}

/** Get all proceedings connected to a specific theme */
export function getProceedingsForTheme(themeId: string): Proceeding[] {
  return proceedings.filter((p) => p.themeIds.includes(themeId));
}

/** Get the N most significant global proceedings for the timeline banner */
export function getGlobalProceedings(limit = 5): Proceeding[] {
  const priority: Record<ProceedingStatus, number> = {
    active: 0, scheduled: 1, pending: 2, stalled: 3, resolved: 4,
  };
  return proceedings
    .filter((p) => p.isGlobal)
    .sort((a, b) => priority[a.status] - priority[b.status])
    .slice(0, limit);
}

/** Status label and color for rendering */
export const STATUS_CONFIG: Record<ProceedingStatus, {
  label: string;
  dotClass: string;
  textClass: string;
  borderClass: string;
}> = {
  active:    { label: 'Active',    dotClass: 'bg-green-500',  textClass: 'text-green-400',  borderClass: 'border-green-800/40' },
  scheduled: { label: 'Scheduled', dotClass: 'bg-blue-400',   textClass: 'text-blue-400',   borderClass: 'border-blue-800/40' },
  pending:   { label: 'Pending',   dotClass: 'bg-amber-400',  textClass: 'text-amber-400',  borderClass: 'border-amber-800/40' },
  stalled:   { label: 'Stalled',   dotClass: 'bg-zinc-500',   textClass: 'text-zinc-400',   borderClass: 'border-zinc-700/40' },
  resolved:  { label: 'Resolved',  dotClass: 'bg-zinc-600',   textClass: 'text-zinc-500',   borderClass: 'border-zinc-700/40' },
};

export const TYPE_LABELS: Record<ProceedingType, string> = {
  criminal:     'Criminal',
  civil:        'Civil',
  congressional:'Congressional',
  foia:         'FOIA',
  international:'International',
  regulatory:   'Regulatory',
};
```

---

## Phase 2: Create `EventThemeLinks.tsx`

Renders inside EventCard at Level 1+. Shows which investigation themes the event belongs to,
as pill-links navigating to `/themes/#themeId`.

```typescript
// src/components/timeline/EventThemeLinks.tsx
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import themesData from '@/data/themes.json';
import type { ThemeSection } from '@/types';

const allThemes = themesData as ThemeSection[];

interface Props {
  themeIds: string[];
}

export default function EventThemeLinks({ themeIds }: Props) {
  // Filter to only themeIds that actually exist in themes.json
  const validThemes = themeIds
    .map((id) => allThemes.find((t) => t.id === id))
    .filter((t): t is ThemeSection => t !== undefined);

  if (validThemes.length === 0) return null;

  return (
    <div className="flex items-start gap-2 mt-3" aria-label="Related investigation themes">
      <BookOpen
        size={11}
        className="text-text-muted shrink-0 mt-0.5"
        aria-hidden
      />
      <div className="flex flex-wrap gap-1.5">
        {validThemes.map((theme) => (
          <Link
            key={theme.id}
            href={`/themes/#${theme.id}`}
            className="text-[11px] px-2 py-0.5 rounded-full border border-surface-border
                       text-text-muted hover:text-accent-blue hover:border-accent-blue/40
                       transition-colors"
            aria-label={`View theme: ${theme.title}`}
          >
            {theme.sectionNumber}. {theme.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

## Phase 3: Create `ActiveInvestigationPanel.tsx`

Shared component used in both EventCard and PersonDetailClient. Accepts an array of
`Proceeding` objects and renders a compact collapsible panel. The caller is responsible
for fetching the right proceedings via the lookup helpers.

```typescript
// src/components/shared/ActiveInvestigationPanel.tsx
'use client';

import { useState } from 'react';
import { Scale, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { STATUS_CONFIG, TYPE_LABELS } from '@/data/investigation-status';
import type { Proceeding } from '@/data/investigation-status';

interface Props {
  proceedings: Proceeding[];
  /** compact: renders as a single-line collapsed toggle (for EventCard) */
  compact?: boolean;
  /** label: customize the collapsed header text */
  label?: string;
}

export default function ActiveInvestigationPanel({
  proceedings,
  compact = false,
  label,
}: Props) {
  const [expanded, setExpanded] = useState(!compact);

  if (proceedings.length === 0) return null;

  const activeCount = proceedings.filter(
    (p) => p.status === 'active' || p.status === 'scheduled'
  ).length;

  const headerLabel =
    label ??
    (activeCount > 0
      ? `${activeCount} active proceeding${activeCount !== 1 ? 's' : ''}`
      : `${proceedings.length} proceeding${proceedings.length !== 1 ? 's' : ''}`);

  return (
    <div
      className={`rounded-lg border overflow-hidden
                  ${compact ? 'border-surface-border' : 'border-green-900/30 bg-green-950/10'}`}
      aria-label="Active investigation status"
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left
                   hover:bg-surface-elevated transition-colors"
        aria-expanded={expanded}
      >
        <Scale size={11} className="text-green-400/70 shrink-0" aria-hidden />
        <span className="text-[11px] font-mono text-green-400/80 uppercase tracking-wider flex-1">
          {headerLabel}
        </span>
        {compact && (
          expanded
            ? <ChevronUp size={11} className="text-text-muted" aria-hidden />
            : <ChevronDown size={11} className="text-text-muted" aria-hidden />
        )}
      </button>

      {/* Proceedings list */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2.5">
          {proceedings.map((proc) => {
            const cfg = STATUS_CONFIG[proc.status];
            return (
              <div
                key={proc.id}
                className={`rounded border px-2.5 py-2 ${cfg.borderClass}`}
              >
                {/* Status dot + type + date */}
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dotClass}`}
                      aria-hidden
                    />
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${cfg.textClass}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      · {TYPE_LABELS[proc.type]}
                    </span>
                  </div>
                  {proc.date && (
                    <span className="text-[10px] text-text-muted shrink-0">
                      {proc.date}
                    </span>
                  )}
                </div>

                {/* Title */}
                <p className="text-xs font-medium text-text-primary leading-snug mb-0.5">
                  {proc.url ? (
                    <a
                      href={proc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-accent-blue transition-colors inline-flex items-center gap-1"
                    >
                      {proc.title}
                      <ExternalLink size={9} aria-hidden />
                    </a>
                  ) : (
                    proc.title
                  )}
                </p>

                {/* Description */}
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {proc.description.trim()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

---

## Phase 4: Create `ActiveInvestigationBanner.tsx` (for Timeline page)

A top-of-page widget showing the N most significant global proceedings. Collapsed by default.

```typescript
// src/components/timeline/ActiveInvestigationBanner.tsx
'use client';

import { useState } from 'react';
import { Scale, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { getGlobalProceedings, STATUS_CONFIG, TYPE_LABELS } from '@/data/investigation-status';

export default function ActiveInvestigationBanner() {
  const [expanded, setExpanded] = useState(false);
  const globalProceedings = getGlobalProceedings(6);

  if (globalProceedings.length === 0) return null;

  const activeCount = globalProceedings.filter(
    (p) => p.status === 'active' || p.status === 'scheduled'
  ).length;

  return (
    <div
      className="mb-6 rounded-lg border border-green-900/30 bg-green-950/10 overflow-hidden"
      aria-label="Active investigation proceedings"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between gap-4 px-4 py-3
                   text-left hover:bg-green-950/20 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <Scale size={13} className="text-green-400/70 shrink-0" aria-hidden />
          <div>
            <span className="text-xs font-mono text-green-400/80 uppercase tracking-wider">
              Investigation Status
            </span>
            <span className="text-xs text-text-muted ml-2">
              {activeCount} active · compiled March 2026
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-green-400/60">
            {expanded ? 'Collapse' : 'Show proceedings'}
          </span>
          {expanded
            ? <ChevronUp size={12} className="text-text-muted" aria-hidden />
            : <ChevronDown size={12} className="text-text-muted" aria-hidden />
          }
        </div>
      </button>

      {/* Proceedings grid */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-green-900/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
            {globalProceedings.map((proc) => {
              const cfg = STATUS_CONFIG[proc.status];
              return (
                <div
                  key={proc.id}
                  className={`rounded border px-3 py-2 ${cfg.borderClass} bg-surface-card/50`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dotClass}`}
                      aria-hidden
                    />
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${cfg.textClass}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      · {TYPE_LABELS[proc.type]}
                    </span>
                    {proc.date && (
                      <span className="text-[10px] text-text-muted ml-auto">
                        {proc.date}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-text-primary leading-snug">
                    {proc.url ? (
                      <a
                        href={proc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent-blue transition-colors inline-flex items-center gap-1"
                      >
                        {proc.title}
                        <ExternalLink size={9} aria-hidden />
                      </a>
                    ) : proc.title}
                  </p>
                  <p className="text-[11px] text-text-muted leading-relaxed mt-0.5 line-clamp-2">
                    {proc.description.trim()}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-text-muted mt-3 italic">
            Proceedings compiled from research sources as of March 2026. This section updates
            with each site rebuild; confirm current status via linked sources.
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## Phase 5: Wire `EventThemeLinks` and `ActiveInvestigationPanel` into `EventCard`

Open `src/components/timeline/EventCard.tsx`. Make three targeted changes.

### Step 5a: Add imports

```typescript
import EventThemeLinks from '@/components/timeline/EventThemeLinks';
import ActiveInvestigationPanel from '@/components/shared/ActiveInvestigationPanel';
import { getProceedingsForPerson } from '@/data/investigation-status';
```

### Step 5b: Compute active proceedings at render time

Inside the `EventCard` function body, before the return statement, add:

```typescript
// Collect proceedings for all people mentioned in this event
const eventProceedings = useMemo(() => {
  const seen = new Set<string>();
  const result = [];
  for (const pid of event.peopleIds) {
    for (const proc of getProceedingsForPerson(pid)) {
      if (!seen.has(proc.id)) {
        seen.add(proc.id);
        result.push(proc);
      }
    }
  }
  // Sort: active first, then scheduled, then pending
  const order: Record<string, number> = { active: 0, scheduled: 1, pending: 2, stalled: 3, resolved: 4 };
  return result.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
}, [event.peopleIds]);
```

**Note:** This requires `useMemo` import — confirm it's already imported at the top of the
file. If not, add it: `import { useState, useEffect, useRef, useMemo } from 'react';`

### Step 5c: Insert both components inside the Level 1 content block

Find the Level 1 `<ExpandableSection>` block. After the existing Level 1 content (people
chips, EFTA numbers, causal annotations from Gap 5) and before the collapse controls,
insert:

```tsx
{/* Theme links — which investigation threads this event belongs to */}
<EventThemeLinks
  themeIds={event.themeIds ?? event.relatedThemeIds ?? []}
/>

{/* Active proceedings for people mentioned in this event */}
{eventProceedings.length > 0 && (
  <div className="mt-3">
    <ActiveInvestigationPanel
      proceedings={eventProceedings}
      compact={true}
      label={`${eventProceedings.length} active proceeding${eventProceedings.length !== 1 ? 's' : ''} — people in this event`}
    />
  </div>
)}
```

**Important:** Use `event.themeIds ?? event.relatedThemeIds ?? []` to handle whichever
field name the actual `timeline.json` uses (verify from Phase 0).

---

## Phase 6: Wire `ActiveInvestigationPanel` into `PersonDetailClient`

Open `src/app/people/[slug]/PersonDetailClient.tsx`. Make two targeted changes.

### Step 6a: Add imports

```typescript
import ActiveInvestigationPanel from '@/components/shared/ActiveInvestigationPanel';
import { getProceedingsForPerson } from '@/data/investigation-status';
```

### Step 6b: Compute proceedings for this person

Inside the `PersonDetailClient` function body, before the return statement:

```typescript
const personProceedings = useMemo(
  () => getProceedingsForPerson(person.id),
  [person.id]
);
```

If `useMemo` is not already imported in this file, add it to the `useState` import line.

### Step 6c: Insert `ActiveInvestigationPanel` between `ThematicInvolvementRow` and the legal status note

Gap 2 added `ThematicInvolvementRow` before the legal status note. Insert the panel
immediately after `ThematicInvolvementRow` (and before the `{isNotCharged && (...)}` block):

```tsx
{/* Thematic involvement — from Gap 2 */}
<ThematicInvolvementRow
  themeIds={person.themeIds ?? []}
  personName={person.name}
/>

{/* Active investigation status — Gap 7 */}
{personProceedings.length > 0 && (
  <div className="mb-4">
    <ActiveInvestigationPanel
      proceedings={personProceedings}
      compact={false}
    />
  </div>
)}

{/* Legal status note — existing code, unchanged */}
{isNotCharged && (
  ...
)}
```

If Gap 2 was not implemented (ThematicInvolvementRow doesn't exist), insert the
`ActiveInvestigationPanel` block directly before the `{isNotCharged && (...)}` block.

---

## Phase 7: Add `ActiveInvestigationBanner` to the Timeline page

Open `src/app/timeline/page.tsx`. Make two targeted changes.

### Step 7a: Add import

```typescript
import ActiveInvestigationBanner from '@/components/timeline/ActiveInvestigationBanner';
```

### Step 7b: Insert banner above the filter controls

Find the page's main content area — the section that contains the filter toggle button
and the `<p>` showing "Showing N of M events". Insert the banner above the filter controls:

```tsx
{/* Active investigation banner */}
<ActiveInvestigationBanner />

{/* Filter toggle — existing code below, unchanged */}
<div className="flex items-center justify-between mb-4 print:hidden">
  ...
</div>
```

The banner should be the first meaningful element in the timeline page body, below the
page title/header but above everything else. Users landing on Timeline immediately see
that the investigation is ongoing.

---

## Phase 8: TypeScript Verification

No changes to `src/types/index.ts`. All new types are in `src/data/investigation-status.ts`.

Verify that `Proceeding` is properly exported and that the import paths are correct.
If TypeScript requires `export type` syntax for isolated modules:

```typescript
// At the bottom of investigation-status.ts, add:
export type { Proceeding, ProceedingStatus, ProceedingType };
```

Run:
```bash
npx tsc --noEmit
```

Common issues:
- `useMemo` in `EventCard.tsx` — if the component doesn't already use `useMemo`, add
  it to the import and ensure the dependency array is correct (`[event.peopleIds]`)
- `event.themeIds` may be typed as `string[] | undefined` in the `TimelineEvent` interface —
  the `??` fallback handles this but TypeScript may need `(event.themeIds ?? [])` explicitly

---

## Phase 9: Build Verification

**Step 1:**
```bash
npx tsc --noEmit
```

**Step 2:**
```bash
npm run build
```

**Step 3:** Dev server — test all three surfaces:

**EventCard — Level 1 (`/timeline`):**
- [ ] Expand any event to Level 1 — EventThemeLinks renders theme pills below people chips
- [ ] Theme pills use section numbers and titles (e.g. "14. Acosta Plea Deal & Legal History")
- [ ] Clicking a theme pill navigates to `/themes/#themeId` and scrolls to that section
- [ ] Events with no `themeIds` show no EventThemeLinks (null return)
- [ ] For events mentioning people with active proceedings: ActiveInvestigationPanel renders
- [ ] Panel shows status dot + type + date row, then title + description per proceeding
- [ ] "Active" proceedings show green dot; "Scheduled" blue; "Pending" amber; "Stalled" gray
- [ ] Panel is collapsed by default (compact mode) — click to expand
- [ ] Events mentioning people with no active proceedings show no panel

**Person pages (`/people/[slug]`):**
- [ ] Navigate to `/people/ghislaine-maxwell` — ActiveInvestigationPanel shows Maxwell Appeals
- [ ] Navigate to `/people/leslie-wexner` — shows Wexner/Wyden investigation proceeding
- [ ] Navigate to `/people/leon-black` — shows Leon Black / BofA trial (May 2026, scheduled)
- [ ] Navigate to `/people/prince-andrew` — shows UK Criminal proceeding (active)
- [ ] Navigate to `/people/thorbjorn-jagland` — shows Norway charges (active)
- [ ] Panel is expanded by default (non-compact mode) on person pages
- [ ] Person with no proceedings in the data shows no panel
- [ ] Panel renders above the tab bar, between ThematicInvolvementRow and legal status note

**Timeline page banner (`/timeline`):**
- [ ] ActiveInvestigationBanner renders at top of timeline, above filter controls
- [ ] Banner is collapsed by default — shows "Investigation Status · N active · compiled March 2026"
- [ ] Clicking "Show proceedings" expands a 2-column grid of global proceedings
- [ ] Grid shows: Prince Andrew UK arrest, Mandelson UK arrest, Jagland Norway, Clinton
      depositions, Leon Black trial, Wyden/Treasury FOIA
- [ ] Status dots and type labels render correctly
- [ ] "Collapse" button closes the panel
- [ ] Footer note about March 2026 compilation date appears at bottom

**No regressions:**
- [ ] All existing EventCard disclosure levels (0–3) still work
- [ ] ThematicInvolvementRow (Gap 2) still renders on person pages
- [ ] CausalAnnotation (Gap 5) still renders inside EventCard
- [ ] Timeline filters still work
- [ ] Person page tabs still work
- [ ] `npm run build` produces no TypeScript errors

---

## Files Created / Modified Summary

| Action | File |
|--------|------|
| **CREATE** | `src/data/investigation-status.ts` |
| **CREATE** | `src/components/timeline/EventThemeLinks.tsx` |
| **CREATE** | `src/components/shared/ActiveInvestigationPanel.tsx` |
| **CREATE** | `src/components/timeline/ActiveInvestigationBanner.tsx` |
| **MODIFY** | `src/components/timeline/EventCard.tsx` — import + insert EventThemeLinks + ActiveInvestigationPanel at Level 1 |
| **MODIFY** | `src/app/people/[slug]/PersonDetailClient.tsx` — import + insert ActiveInvestigationPanel above tabs |
| **MODIFY** | `src/app/timeline/page.tsx` — import + insert ActiveInvestigationBanner above filters |

---

## Design Notes for Claude Code

**`ActiveInvestigationPanel` is shared** between EventCard (compact mode) and person pages
(non-compact mode). The `compact` prop controls: default expanded state, and header visual
weight. On EventCards it defaults collapsed (compact=true); on person pages it defaults
expanded (compact=false). The proceeding cards render identically in both modes.

**`useMemo` for proceedings lookup.** The `getProceedingsForPerson` call in EventCard and
PersonDetailClient is O(n) over the ~16 proceedings in the static array — fast enough that
memoization isn't strictly necessary. It's included for correctness (stable reference across
re-renders) but can be replaced with a simple function call if TypeScript or React version
constraints make `useMemo` awkward.

**`event.themeIds` field name.** Phase 0 requires verifying the actual field name in
`timeline.json`. The code uses `event.themeIds ?? event.relatedThemeIds ?? []` as a
defensive fallback. Once the correct field name is confirmed, simplify to just that field.

**Proceedings are static and will go stale.** The investigation-status.ts file was accurate
as of March 2026. When the site is rebuilt after major developments (e.g., Clinton deposition
resolution, Leon Black trial outcome), this file should be updated manually. Add a comment
near the top of the file: `// Last updated: March 2026. Update manually after major developments.`

**The banner doesn't show on `/people` pages.** It's only on `/timeline`. Person pages get
the ActiveInvestigationPanel inline above their tabs. The two surfaces are complementary:
the banner gives the global picture; the person panel gives the person-specific picture.

**PersonIds in `proceedings` must match actual person IDs.** Run:
```bash
node -e "require('./src/data/people.json').forEach(p => console.log(p.id))" | sort
```
Compare against the `personIds` arrays in the data file. Unknown IDs are silently filtered
by `getProceedingsForPerson` — they produce no visual error, just missing panels. Fix any
mismatches before the build.
