# CC_GUIDE — Gap 2: People Pages as Investigation Nodes
## Epstein Files Research Database — UX Improvement Series

**Purpose:** Transform person detail pages from biographical profiles into active investigation
nodes — entries that answer *what this person did in the operation, when, and who else was
involved*, rather than just who they are. Four targeted additions: a "Role in the Story" block,
a Thematic Involvement row, a compact person mini-timeline in the Overview tab, and a
first-degree ego graph in the Connections tab.

**Estimated implementation time:** 6–8 hours  
**Risk to existing functionality:** Low — modifications are additive; existing tab content is
preserved and extended, not replaced. One cross-reference script modifies JSON output.  
**Build verification:** Run `npm run build` after each phase. All existing people pages
continue to work — these are enhancements, not rewrites.

---

## What's Being Added and Why

**Current state:** The person detail page shows category badge, status, DOJ mention count,
summary paragraph, born/died dates, and four tabs (Overview, Timeline, Connections, Sources).
The page answers: *Who is this person?*

**After this guide:** The page answers: *What did this person do in the operation? Which
investigative threads do they appear in? What does their timeline look like? Who are their
direct documented connections?* — all visible without leaving the page or clicking through tabs.

The four additions:

1. **Role in the Story block** — A dedicated prose paragraph explaining this person's
   *functional role* in the Epstein network, placed immediately below the summary paragraph
   in the page header. Different from `summary` (which is biographical); this is operational.

2. **Thematic Involvement row** — A horizontal row of pill-links showing which of the 17
   themes this person appears in. Currently `themeIds` is populated as `[]` for every person
   by the parse script. A cross-reference step will populate it properly. The row renders
   above the tab bar so it's always visible, not buried in a tab.

3. **Person mini-timeline** — A compact chronological event list in the Overview tab showing
   only this person's events. Distinct from the full Timeline tab (which uses the full
   EventCard component). This is 2–4 lines per event, always visible without clicking,
   and encourages the user to drill into the Timeline tab for detail.

4. **Ego graph** — A small D3 force-directed graph in the Connections tab showing this
   person as a center node with first-degree connections radiating outward. Currently the
   Connections tab shows a list (ConnectionList). The ego graph sits above the list as a
   visual orientation layer.

---

## Phase 1: Populate `themeIds` via Cross-Reference Script

The parse script sets `themeIds: []` on every person. Themes have a `peopleIds` array
that lists which people appear in each theme. The cross-reference is bidirectional — we
need to propagate theme → person links in both directions.

### Step 1a: Add a cross-reference step to `scripts/build-connections.ts`

Open `scripts/build-connections.ts`. At the **end** of the file, after the connections are
written to disk, add:

```typescript
// ─── Cross-reference: populate themeIds on each person ────────────────────
import path from 'path';
import fs from 'fs';

const peoplePath = path.join(process.cwd(), 'src', 'data', 'people.json');
const themesPath = path.join(process.cwd(), 'src', 'data', 'themes.json');

// Only run if both files exist (themes may not exist on first parse run)
if (fs.existsSync(peoplePath) && fs.existsSync(themesPath)) {
  const people: Array<{ id: string; themeIds: string[]; [key: string]: unknown }> =
    JSON.parse(fs.readFileSync(peoplePath, 'utf-8'));
  const themes: Array<{ id: string; peopleIds: string[] }> =
    JSON.parse(fs.readFileSync(themesPath, 'utf-8'));

  // Build person → themes map
  const personThemeMap = new Map<string, Set<string>>();
  for (const theme of themes) {
    for (const personId of theme.peopleIds) {
      if (!personThemeMap.has(personId)) {
        personThemeMap.set(personId, new Set());
      }
      personThemeMap.get(personId)!.add(theme.id);
    }
  }

  // Apply to people
  let updated = 0;
  for (const person of people) {
    const themeIds = personThemeMap.get(person.id);
    if (themeIds && themeIds.size > 0) {
      person.themeIds = Array.from(themeIds);
      updated++;
    }
  }

  fs.writeFileSync(peoplePath, JSON.stringify(people, null, 2));
  console.log(`✓ Cross-referenced themeIds: ${updated} people updated with theme associations`);
} else {
  console.warn('⚠ Cross-reference skipped: people.json or themes.json not found');
}
```

**Important:** This step must run AFTER both `parse-people.ts` and `parse-themes.ts` have
produced their JSON outputs. Update `package.json` to ensure correct ordering:

```json
"parse": "npx ts-node --project tsconfig.scripts.json scripts/parse-people.ts && npx ts-node --project tsconfig.scripts.json scripts/parse-timeline.ts && npx ts-node --project tsconfig.scripts.json scripts/parse-themes.ts && npx ts-node --project tsconfig.scripts.json scripts/build-connections.ts"
```

The cross-reference runs inside `build-connections.ts` which already runs last — this ordering
is already correct. Confirm this is the case before proceeding.

### Step 1b: Also populate `timelineEventIds` if not already done

While in `build-connections.ts`, add a symmetric cross-reference for timeline events:

```typescript
const timelinePath = path.join(process.cwd(), 'src', 'data', 'timeline.json');

if (fs.existsSync(peoplePath) && fs.existsSync(timelinePath)) {
  // Reload people (may have been updated above)
  const people: Array<{ id: string; timelineEventIds: string[]; [key: string]: unknown }> =
    JSON.parse(fs.readFileSync(peoplePath, 'utf-8'));
  const events: Array<{ id: string; personIds: string[] }> =
    JSON.parse(fs.readFileSync(timelinePath, 'utf-8'));

  const personEventMap = new Map<string, Set<string>>();
  for (const event of events) {
    for (const personId of (event.personIds ?? [])) {
      if (!personEventMap.has(personId)) {
        personEventMap.set(personId, new Set());
      }
      personEventMap.get(personId)!.add(event.id);
    }
  }

  let updated = 0;
  for (const person of people) {
    const eventIds = personEventMap.get(person.id);
    if (eventIds && eventIds.size > 0) {
      const merged = new Set([...person.timelineEventIds, ...Array.from(eventIds)]);
      person.timelineEventIds = Array.from(merged);
      updated++;
    }
  }

  fs.writeFileSync(peoplePath, JSON.stringify(people, null, 2));
  console.log(`✓ Cross-referenced timelineEventIds: ${updated} people updated`);
}
```

---

## Phase 2: Supplemental Narrative Data File

The `person.summary` field contains biographical text. The "Role in the Story" block needs
*operational* prose — a different register that answers what this person did, not who they are.

Rather than adding this to the parse script (which would require source markdown changes),
create a supplemental static file. Persons not in this file fall back gracefully to displaying
nothing (the block simply doesn't render for them).

### File: `src/data/people-roles.ts`

```typescript
// src/data/people-roles.ts
// Supplemental "role in the story" prose for key individuals.
// These paragraphs answer: what did this person DO in the Epstein network?
// They are operational descriptions, distinct from the biographical summary.
// Persons not listed here simply don't show the Role in the Story block.

export const peopleRoles: Record<string, string> = {
  'jeffrey-epstein': `Epstein was the operational center of the network — the financier, 
    the connector, and the primary abuser. His functional role was to use his wealth and 
    social access to recruit, maintain, and exploit victims while cultivating political and 
    financial relationships that created structural disincentives for prosecution. He managed 
    money for some of the wealthiest people in the world, a role that gave him leverage and 
    a plausible cover identity. His death in August 2019 — while in federal custody, awaiting 
    trial — closed the primary prosecution before any co-conspirators were named in court.`,

  'ghislaine-maxwell': `Maxwell was Epstein's primary operational partner and the individual 
    who transformed his predatory behavior from opportunistic to systematic. She recruited 
    victims directly, trained some to recruit others, managed the household logistics at 
    multiple properties, and maintained the social network that gave Epstein access to 
    powerful figures. She was convicted in December 2021 on five counts including sex 
    trafficking of a minor and remains incarcerated. Her ongoing refusal to name additional 
    co-conspirators — and a reportedly rejected offer to provide testimony in exchange for 
    exonerating Trump — is one of the central unresolved threads in the case.`,

  'jean-luc-brunel': `Brunel ran MC2 Model Management, which served as the international 
    procurement arm of the trafficking operation, enabling recruitment of girls from Eastern 
    Europe, France, and Brazil. FBI records allege he provided Epstein with underage girls as 
    a "gift." He was arrested in Paris in December 2020 on charges of rape of minors. He was 
    found dead in his cell at La Santé Prison in February 2022 — officially ruled a suicide, 
    four months before his trial was scheduled to begin. Like Epstein, he died before 
    testifying.`,

  'les-wexner': `Wexner was Epstein's primary known financial patron and the source of the 
    wealth that funded the operation's infrastructure. He gave Epstein power of attorney over 
    his finances, transferred his Manhattan townhouse to him, and maintained an unexplained 
    financial relationship estimated at over $1 billion. In a congressional deposition in 
    February 2026 — the first time he has been questioned under oath — Wexner claimed not to 
    remember basic facts about the relationship over five hours of testimony. He has described 
    Epstein as "a con man" but has not explained how a con man came to control his finances 
    for decades.`,

  'alexander-acosta': `As U.S. Attorney for the Southern District of Florida, Acosta 
    negotiated the 2008 Non-Prosecution Agreement that shielded Epstein from federal 
    prosecution, gave him a state-level plea to charges carrying an 18-month sentence with 
    daily work release, and — critically — extended blanket immunity to unnamed 
    co-conspirators without notifying victims, in violation of the Crime Victims' Rights Act. 
    He later told Trump transition officials that he had been informed Epstein "belonged to 
    intelligence" and had been directed to leave the case alone. He resigned as Secretary of 
    Labor in July 2019, three weeks after Epstein's re-arrest.`,

  'alan-dershowitz': `Dershowitz was a member of Epstein's defense team in the 2008 NPA 
    negotiations. He is also named in civil proceedings by Virginia Giuffre, who alleged she 
    was trafficked to him. He has denied the allegations and engaged in extensive public 
    litigation against accusers and their attorneys. His presence in the case is notable both 
    as a defense attorney who negotiated the immunity provisions and as a named alleged 
    participant in the operation he helped legally protect.`,

  'prince-andrew': `Prince Andrew is named in Virginia Giuffre's civil suit as someone she 
    was trafficked to on multiple occasions. He settled the suit in February 2022 for a 
    reported sum believed to be in the millions of dollars, without admitting liability. He 
    has never spoken to the FBI or U.S. investigators. He was photographed with Giuffre and 
    Maxwell in London. The UK government has resisted formal cooperation with U.S. 
    investigators, and his royal patronages and military affiliations were revoked in 2022.`,

  'darren-indyke': `Indyke was Epstein's longtime personal attorney and served as the 
    trustee of the 1953 Trust — the primary vehicle through which post-death distributions 
    were made, including $100 million to Marina Shuliak. He has been named in civil suits 
    alleging he had knowledge of the trafficking operation. He administered Epstein's estate 
    and managed the compensation fund established after Epstein's death.`,

  'ghislaine-maxwell-father-robert': `Robert Maxwell — Ghislaine's father — was a British 
    media magnate who was confirmed by multiple intelligence sources to have worked as a 
    Mossad asset. His relationship to the Epstein-intelligence connection is circumstantial 
    but repeatedly cited: Ghislaine Maxwell, who was reportedly recruited into the operation 
    shortly after her father's death in 1991, may have brought intelligence-adjacent 
    relationships with her. Robert Maxwell died in unexplained circumstances falling from his 
    yacht in November 1991 — shortly before Ghislaine joined Epstein in New York.`,

  'virginia-giuffre': `Giuffre is the most publicly prominent survivor of the trafficking 
    operation and the individual whose testimony has driven the most consequential legal 
    actions. She was recruited to Epstein at Mar-a-Lago at age 16 by Maxwell. She testified 
    in the Maxwell trial and in civil depositions, naming multiple high-profile individuals. 
    Her civil suit against Prince Andrew was settled in 2022. Her original civil suit against 
    Epstein (Giuffre v. Epstein) produced the document releases that named numerous 
    individuals. She dropped her suit against Dershowitz in 2024 citing a "mistake" but has 
    not retracted her allegations.`,

  'william-barr': `As U.S. Attorney General, Barr oversaw the 2019 prosecution and was the 
    senior DOJ official responsible for Epstein's pretrial detention conditions. His father, 
    Donald Barr, hired Epstein to teach at the Dalton School in 1974 without a college 
    degree, decades before Epstein's wealth or prominence. Barr recused himself from the 
    investigation but later contradicted that recusal in public statements. He has called the 
    death a suicide and rejected conspiracy theories, but the circumstances under his watch — 
    the removal from suicide watch, the sleeping guards, the destroyed surveillance footage — 
    remain unresolved.`,

  'ehud-barak': `Barak, former Israeli Prime Minister and Defense Minister, was documented 
    visiting Epstein's properties on multiple occasions, including his New York apartment 
    building. He received approximately $2.5 million from Epstein-linked entities, 
    purportedly for investment in Carbyne, a 911 emergency response technology company that 
    Epstein also funded. Barak has acknowledged knowing Epstein but denied any involvement 
    with trafficking. The Carbyne investment and the apartment visits are documented; their 
    significance to the intelligence dimension of the case remains a subject of research.`,

  'sarah-kellen': `Kellen was one of Maxwell's key lieutenants in managing day-to-day 
    operations at Epstein's properties, including scheduling victims and managing logistics. 
    She was named as a potential co-conspirator in multiple filings but received immunity 
    under the 2008 NPA. She later changed her name, married NASCAR driver Brian Vickers, 
    and has not cooperated with investigators. She is one of the named NPA immunity 
    recipients whose continued public life without accountability represents one of the most 
    visible consequences of the 2008 agreement.`,

  'nadia-marcinkova': `Marcinkova was brought to the United States from Eastern Europe as a 
    teenager and was described in FBI records as Epstein's "sex slave." She was trained by 
    Maxwell and allegedly participated in trafficking other victims. She received immunity 
    under the 2008 NPA. She later became a commercial pilot and changed her name. Like 
    Kellen, her post-NPA trajectory without accountability is cited as evidence of the 
    agreement's scope.`,
};

export default peopleRoles;
```

---

## Phase 3: New Components

Create the following components in `src/components/people/`.

### Component 1: `RoleInStoryBlock.tsx`

Renders the operational role paragraph if one exists for this person.
Sits between the existing `summary` paragraph and the legal status note.

```typescript
// src/components/people/RoleInStoryBlock.tsx
import { Crosshair } from 'lucide-react';
import { peopleRoles } from '@/data/people-roles';

interface Props {
  personId: string;
  personName: string;
}

export default function RoleInStoryBlock({ personId, personName }: Props) {
  const role = peopleRoles[personId];
  if (!role) return null;

  return (
    <div
      className="border border-surface-border rounded-lg px-4 py-4 mb-5 bg-surface-card"
      aria-label={`${personName}'s role in the investigation`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <Crosshair size={13} className="text-amber-400 shrink-0" aria-hidden />
        <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
          Role in the Investigation
        </span>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">
        {role.trim()}
      </p>
    </div>
  );
}
```

### Component 2: `ThematicInvolvementRow.tsx`

A horizontal row of theme pills. Renders between the header and the tab bar,
so it's always visible regardless of active tab.

```typescript
// src/components/people/ThematicInvolvementRow.tsx
import Link from 'next/link';
import { Tag } from 'lucide-react';
import type { ThemeSection } from '@/types';
import themesData from '@/data/themes.json';

const themes = themesData as ThemeSection[];

interface Props {
  themeIds: string[];
  personName: string;
}

// Map theme IDs to display labels (shortened for pill display)
const THEME_SHORT_LABELS: Record<string, string> = {
  'efta-release-framework':         'EFTA Release',
  'trafficking-operation':          'Trafficking',
  'trump-epstein-connections':      'Trump–Epstein',
  'melania-trump-thread':           'Melania Thread',
  'political-intelligence-network': 'Political Network',
  'maxwell-role-legal':             'Maxwell',
  'co-conspirators-immunity':       'Co-Conspirators',
  'financial-crimes':               'Financial Crimes',
  'intelligence-connections':       'Intelligence',
  'epsteins-death-mcc':             'Death / MCC',
  'whoops-emails':                  '"Whoops" Emails',
  'baby-stuff-thread':              '"Baby Stuff"',
  'academic-scientific-network':    'Academic Network',
  'acosta-plea-legal-history':      'Plea Deal',
  'international-consequences':     'International',
  'media-congressional':            'Media / Congress',
  'community-research-tools':       'Community Tools',
};

// Assign a subtle color accent to each theme category
const THEME_ACCENT: Record<string, string> = {
  'trafficking-operation':          'border-red-800/60 text-red-300',
  'financial-crimes':               'border-purple-800/60 text-purple-300',
  'intelligence-connections':       'border-blue-800/60 text-blue-300',
  'acosta-plea-legal-history':      'border-amber-800/60 text-amber-300',
  'epsteins-death-mcc':             'border-zinc-600 text-zinc-300',
  'co-conspirators-immunity':       'border-red-800/60 text-red-300',
};

const DEFAULT_ACCENT = 'border-surface-border text-text-muted';

export default function ThematicInvolvementRow({ themeIds, personName }: Props) {
  if (!themeIds || themeIds.length === 0) return null;

  // Sort by theme section number for consistent ordering
  const sortedThemeIds = [...themeIds].sort((a, b) => {
    const themeA = themes.find((t) => t.id === a);
    const themeB = themes.find((t) => t.id === b);
    return (themeA?.sectionNumber ?? 99) - (themeB?.sectionNumber ?? 99);
  });

  return (
    <div
      className="mb-5 pb-5 border-b border-surface-border"
      aria-label={`Themes ${personName} appears in`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <Tag size={12} className="text-text-muted shrink-0" aria-hidden />
        <span className="text-xs text-text-muted">Appears in {themeIds.length} investigative thread{themeIds.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex flex-wrap gap-1.5" role="list" aria-label="Related themes">
        {sortedThemeIds.map((themeId) => {
          const theme = themes.find((t) => t.id === themeId);
          const label = THEME_SHORT_LABELS[themeId] ?? theme?.title ?? themeId;
          const accent = THEME_ACCENT[themeId] ?? DEFAULT_ACCENT;

          return (
            <Link
              key={themeId}
              href={`/themes/#${themeId}`}
              role="listitem"
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors
                          hover:bg-surface-elevated hover:text-text-primary
                          ${accent}`}
              title={theme?.title ?? label}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
```

### Component 3: `PersonMiniTimeline.tsx`

A compact read-only chronological list of this person's timeline events.
Renders inside the Overview tab to surface temporal context without requiring
the user to click to the Timeline tab. Each event is 2 lines max; clicking
navigates to the full Timeline with this event pre-highlighted.

```typescript
// src/components/people/PersonMiniTimeline.tsx
import Link from 'next/link';
import { Clock, AlertTriangle } from 'lucide-react';
import type { TimelineEvent } from '@/types';

interface Props {
  events: TimelineEvent[];
  personName: string;
}

const ERA_LABELS: Record<string, string> = {
  'pre-1990':     'Pre-1990',
  '1990-2000':    '1990–2000',
  '2001-2007':    '2001–2007',
  '2008-2018':    '2008–2018',
  '2019':         '2019',
  '2020-present': '2020–Present',
};

export default function PersonMiniTimeline({ events, personName }: Props) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-text-muted py-2">
        No timeline events indexed for {personName}.
      </p>
    );
  }

  // Sort by date
  const sorted = [...events].sort((a, b) => {
    const aDate = a.date ?? '0000';
    const bDate = b.date ?? '0000';
    return aDate.localeCompare(bDate);
  });

  // Group by era
  const byEra = new Map<string, TimelineEvent[]>();
  for (const event of sorted) {
    const era = event.era ?? 'pre-1990';
    if (!byEra.has(era)) byEra.set(era, []);
    byEra.get(era)!.push(event);
  }

  const eraOrder = ['pre-1990', '1990-2000', '2001-2007', '2008-2018', '2019', '2020-present'];
  const presentEras = eraOrder.filter((e) => byEra.has(e));

  return (
    <div aria-label={`Timeline events for ${personName}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-text-muted" aria-hidden />
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
            Timeline ({events.length} event{events.length !== 1 ? 's' : ''})
          </span>
        </div>
        <Link
          href={`/timeline/?person=${encodeURIComponent(personName)}`}
          className="text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          View full timeline →
        </Link>
      </div>

      <div className="space-y-5">
        {presentEras.map((era) => {
          const eraEvents = byEra.get(era)!;
          return (
            <div key={era}>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest
                            mb-2 pb-1 border-b border-surface-border">
                {ERA_LABELS[era] ?? era}
              </p>
              <div className="space-y-0">
                {eraEvents.map((event, i) => (
                  <Link
                    key={event.id}
                    href={`/timeline/#${event.id}`}
                    className={`flex gap-3 py-2.5 group
                                ${i < eraEvents.length - 1 ? 'border-b border-surface-border/50' : ''}`}
                    aria-label={`${event.date ?? 'Undated'}: ${event.title}`}
                  >
                    {/* Date column */}
                    <span className="shrink-0 w-24 text-[11px] font-mono text-text-muted
                                     group-hover:text-text-secondary transition-colors mt-0.5">
                      {event.date ?? 'Undated'}
                    </span>

                    {/* Content column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-1.5">
                        {event.verificationStatus === 'unverified' && (
                          <AlertTriangle
                            size={11}
                            className="shrink-0 text-amber-500 mt-0.5"
                            aria-label="Unverified"
                          />
                        )}
                        <p className="text-xs text-text-secondary leading-snug line-clamp-2
                                      group-hover:text-text-primary transition-colors">
                          {event.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {events.length > 8 && (
        <div className="mt-3 pt-3 border-t border-surface-border">
          <Link
            href={`/timeline/?person=${encodeURIComponent(personName)}`}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            See all {events.length} events in full timeline →
          </Link>
        </div>
      )}
    </div>
  );
}
```

### Component 4: `PersonEgoGraph.tsx`

A D3 force-directed mini-graph showing this person as a center node with
first-degree connections. Sits at the top of the Connections tab, above
the existing ConnectionList. Clicking a node navigates to that person's page.

This is a CLIENT component (requires `'use client'`) because D3 runs in the browser.

```typescript
// src/components/people/PersonEgoGraph.tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Person, Connection } from '@/types';

interface Props {
  person: Person;
  connections: Connection[];
  allPeople: Person[];
}

// Map relationship types to edge colors
const EDGE_COLORS: Record<Connection['relationshipType'], string> = {
  'co-conspirator':       '#ef4444',   // red
  'employer-employee':    '#f97316',   // orange
  'financial':            '#a855f7',   // purple
  'social':               '#6b7280',   // gray
  'flew-together':        '#3b82f6',   // blue
  'legal-representation': '#eab308',   // yellow
  'intelligence':         '#06b6d4',   // cyan
  'academic':             '#22c55e',   // green
  'victim-perpetrator':   '#dc2626',   // dark red
};

// Map PersonCategory to node fill colors (matching existing graph page palette)
const NODE_COLORS: Record<string, string> = {
  'principal':             '#ef4444',
  'inner-circle':          '#f97316',
  'political':             '#3b82f6',
  'financial':             '#a855f7',
  'legal':                 '#eab308',
  'intelligence':          '#06b6d4',
  'academic-scientific':   '#22c55e',
  'media':                 '#ec4899',
  'victim':                '#94a3b8',
  'law-enforcement':       '#64748b',
  'other':                 '#475569',
};

interface SimNode {
  id: string;
  name: string;
  category: string;
  isCenter: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimLink {
  source: string | SimNode;
  target: string | SimNode;
  strength: number;
  relationshipType: Connection['relationshipType'];
  description: string;
}

export default function PersonEgoGraph({ person, connections, allPeople }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  const handleNodeClick = useCallback(
    (personId: string) => {
      if (personId !== person.id) {
        router.push(`/people/${personId}/`);
      }
    },
    [person.id, router]
  );

  useEffect(() => {
    if (!svgRef.current || connections.length === 0) return;

    // Dynamically import D3 to keep it client-side only
    import('d3').then((d3) => {
      const svg = d3.select(svgRef.current!);
      svg.selectAll('*').remove();

      const width = svgRef.current!.clientWidth || 560;
      const height = 300;

      svg.attr('viewBox', `0 0 ${width} ${height}`);

      // Build node list: center person + first-degree connections
      const connectedIds = new Set<string>();
      connections.forEach((c) => {
        connectedIds.add(c.sourcePersonId);
        connectedIds.add(c.targetPersonId);
      });
      connectedIds.delete(person.id); // center node handled separately

      const nodes: SimNode[] = [
        { id: person.id, name: person.name, category: person.category, isCenter: true },
        ...Array.from(connectedIds)
          .map((id) => allPeople.find((p) => p.id === id))
          .filter((p): p is Person => p !== undefined)
          .map((p) => ({ id: p.id, name: p.name, category: p.category, isCenter: false })),
      ];

      const links: SimLink[] = connections.map((c) => ({
        source: c.sourcePersonId,
        target: c.targetPersonId,
        strength: c.strength,
        relationshipType: c.relationshipType,
        description: c.description,
      }));

      // Force simulation
      const simulation = d3
        .forceSimulation<SimNode>(nodes)
        .force(
          'link',
          d3
            .forceLink<SimNode, SimLink>(links)
            .id((d) => d.id)
            .distance((l) => 90 - l.strength * 15)
            .strength(0.4)
        )
        .force('charge', d3.forceManyBody().strength(-180))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide(28));

      // Fix center node
      const centerNode = nodes.find((n) => n.isCenter)!;
      centerNode.fx = width / 2;
      centerNode.fy = height / 2;

      // Defs: arrowhead marker
      const defs = svg.append('defs');
      defs
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -4 8 8')
        .attr('refX', 18)
        .attr('refY', 0)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L8,0L0,4')
        .attr('fill', '#475569');

      // Edge group
      const linkGroup = svg.append('g').attr('class', 'links');
      const linkEls = linkGroup
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', (l) => EDGE_COLORS[l.relationshipType] ?? '#475569')
        .attr('stroke-opacity', 0.5)
        .attr('stroke-width', (l) => l.strength * 1.2)
        .attr('marker-end', 'url(#arrowhead)');

      // Tooltip div
      const tooltip = d3
        .select('body')
        .append('div')
        .style('position', 'fixed')
        .style('pointer-events', 'none')
        .style('background', '#1e293b')
        .style('border', '1px solid #334155')
        .style('border-radius', '6px')
        .style('padding', '8px 12px')
        .style('font-size', '11px')
        .style('color', '#cbd5e1')
        .style('max-width', '200px')
        .style('line-height', '1.4')
        .style('z-index', '9999')
        .style('opacity', '0')
        .style('transition', 'opacity 0.15s');

      // Node group
      const nodeGroup = svg.append('g').attr('class', 'nodes');
      const nodeEls = nodeGroup
        .selectAll<SVGGElement, SimNode>('g')
        .data(nodes)
        .join('g')
        .attr('cursor', (d) => (d.isCenter ? 'default' : 'pointer'))
        .on('click', (_, d) => handleNodeClick(d.id))
        .on('mouseover', (event: MouseEvent, d: SimNode) => {
          if (d.isCenter) return;
          tooltip
            .style('opacity', '1')
            .html(`<strong>${d.name}</strong><br/><span style="color:#94a3b8">${d.category.replace(/-/g, ' ')}</span><br/><span style="color:#64748b;font-size:10px">Click to view profile</span>`);
        })
        .on('mousemove', (event: MouseEvent) => {
          tooltip
            .style('left', `${event.clientX + 12}px`)
            .style('top', `${event.clientY - 10}px`);
        })
        .on('mouseout', () => {
          tooltip.style('opacity', '0');
        });

      // Circle
      nodeEls
        .append('circle')
        .attr('r', (d) => (d.isCenter ? 18 : 12))
        .attr('fill', (d) => NODE_COLORS[d.category] ?? '#475569')
        .attr('fill-opacity', (d) => (d.isCenter ? 1 : 0.75))
        .attr('stroke', (d) => (d.isCenter ? '#fff' : 'transparent'))
        .attr('stroke-width', 2);

      // Label
      nodeEls
        .append('text')
        .attr('dy', (d) => (d.isCenter ? 32 : 26))
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('pointer-events', 'none')
        .text((d) => {
          const parts = d.name.split(' ');
          return parts.length > 1 ? parts[parts.length - 1] : d.name;
        });

      // Drag behavior
      const drag = d3
        .drag<SVGGElement, SimNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          if (!d.isCenter) {
            d.fx = event.x;
            d.fy = event.y;
          }
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          if (!d.isCenter) {
            d.fx = null;
            d.fy = null;
          }
        });

      nodeEls.call(drag as never);

      // Tick
      simulation.on('tick', () => {
        linkEls
          .attr('x1', (l) => (l.source as SimNode).x ?? 0)
          .attr('y1', (l) => (l.source as SimNode).y ?? 0)
          .attr('x2', (l) => (l.target as SimNode).x ?? 0)
          .attr('y2', (l) => (l.target as SimNode).y ?? 0);

        nodeEls.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
      });

      // Cleanup
      return () => {
        simulation.stop();
        tooltip.remove();
      };
    });
  }, [person, connections, allPeople, handleNodeClick]);

  if (connections.length === 0) {
    return (
      <p className="text-sm text-text-muted py-4">
        No documented connections in the database.
      </p>
    );
  }

  return (
    <div className="mb-6">
      <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">
        Connection Map — {connections.length} documented connection{connections.length !== 1 ? 's' : ''}
      </p>
      <div
        className="border border-surface-border rounded-lg bg-surface-card overflow-hidden"
        aria-label={`Network graph of ${person.name}'s connections`}
      >
        <svg
          ref={svgRef}
          className="w-full"
          style={{ height: '300px' }}
          role="img"
          aria-label={`Force-directed graph showing ${person.name}'s first-degree connections`}
        />
        <div className="px-3 py-2 border-t border-surface-border bg-surface/50
                        flex flex-wrap gap-3">
          {Object.entries(EDGE_COLORS)
            .filter(([type]) =>
              connections.some((c) => c.relationshipType === type)
            )
            .map(([type, color]) => (
              <span key={type} className="flex items-center gap-1.5 text-[10px] text-text-muted">
                <span
                  className="inline-block w-3 h-0.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {type.replace(/-/g, ' ')}
              </span>
            ))}
        </div>
      </div>
      <p className="text-[10px] text-text-muted mt-1.5">
        Click any node to navigate to that person's profile. Drag to rearrange.
      </p>
    </div>
  );
}
```

---

## Phase 4: Update `PersonDetailClient.tsx`

Open `src/app/people/[slug]/PersonDetailClient.tsx`. Make the following targeted changes.
**Do not rewrite the entire file** — make surgical additions only.

### Step 4a: Add imports at the top

Add these imports alongside the existing imports:

```typescript
import RoleInStoryBlock from '@/components/people/RoleInStoryBlock';
import ThematicInvolvementRow from '@/components/people/ThematicInvolvementRow';
import PersonMiniTimeline from '@/components/people/PersonMiniTimeline';
import PersonEgoGraph from '@/components/people/PersonEgoGraph';
```

### Step 4b: Insert `RoleInStoryBlock` after the summary paragraph

Find this block in the header section (after `person.summary` renders):

```tsx
<p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
  {person.summary}
</p>
```

Immediately after that `<p>` tag (and before the closing `</div>` of the header), insert:

```tsx
<RoleInStoryBlock personId={person.id} personName={person.name} />
```

### Step 4c: Insert `ThematicInvolvementRow` between the header and the legal status note

Find the `{/* Legal status note */}` comment and the block below it. Insert the
`ThematicInvolvementRow` BEFORE that block:

```tsx
{/* Thematic involvement */}
<ThematicInvolvementRow
  themeIds={person.themeIds ?? []}
  personName={person.name}
/>

{/* Legal status note — existing code below, unchanged */}
{isNotCharged && (
  ...
)}
```

### Step 4d: Add `PersonMiniTimeline` to the Overview tab

Find the Overview tab panel. It currently renders `SectionAccordion` components.
After the final `SectionAccordion` (i.e., at the end of the Overview tab panel div,
before the closing tag), add:

```tsx
{/* Compact timeline preview — always visible in Overview */}
{events.length > 0 && (
  <div className="mt-6 pt-6 border-t border-surface-border">
    <PersonMiniTimeline events={events} personName={person.name} />
  </div>
)}
```

### Step 4e: Add `PersonEgoGraph` to the Connections tab

Find the Connections tab panel. It currently renders `ConnectionList`.
**Before** the `<ConnectionList ... />` component, insert:

```tsx
<PersonEgoGraph
  person={person}
  connections={connections}
  allPeople={allPeople}
/>
```

The full Connections tab panel should now look like:

```tsx
<div id="tab-panel-connections" role="tabpanel" hidden={activeTab !== 'connections'}>
  {activeTab === 'connections' && (
    <div>
      <PersonEgoGraph
        person={person}
        connections={connections}
        allPeople={allPeople}
      />
      <ConnectionList
        personId={person.id}
        connections={connections}
        people={allPeople}
      />
    </div>
  )}
</div>
```

---

## Phase 5: Update `page.tsx` to pass `themes` data

Currently `src/app/people/[slug]/page.tsx` imports and passes `people`, `connections`,
and `events` to `PersonDetailClient`. The `ThematicInvolvementRow` imports `themes.json`
directly (to look up theme titles), so no changes to `page.tsx` are needed for that.

However, verify that `person.themeIds` is populated after Phase 1 runs. Add a
console assertion in `page.tsx` (dev mode only) to confirm:

```typescript
// dev-only check — remove before production
if (process.env.NODE_ENV === 'development') {
  const samplePerson = people.find((p) => p.id === 'ghislaine-maxwell');
  if (samplePerson && samplePerson.themeIds.length === 0) {
    console.warn('⚠ themeIds appear unpopulated — run npm run parse to cross-reference');
  }
}
```

---

## Phase 6: Update `Person` TypeScript type

Open `src/types/index.ts`. The `Person` interface likely has `themeIds: string[]` already
(added in the parse script). Verify it exists. If not, add it:

```typescript
// In the Person interface — verify or add:
themeIds: string[];          // populated by build-connections cross-reference step
timelineEventIds: string[];  // populated by build-connections cross-reference step
```

Also add a `roleInStory` optional field if you want to include it in the type
(though `RoleInStoryBlock` reads from the separate `people-roles.ts` lookup,
not from the Person object directly — so this is optional):

```typescript
// Optional — not strictly required since people-roles.ts is a separate lookup:
roleInStory?: string;
```

---

## Phase 7: `people-roles.ts` — Additional Entries

The file in Phase 2 covers the most prominent individuals. For completeness, Claude Code
should also check `people.json` after parsing and identify any persons with `category`
of `'principal'` or `'inner-circle'` who are NOT yet in `people-roles.ts`, then add
brief role descriptions for them (2–4 sentences) following the same operational voice.

Minimum additional entries to add beyond those in Phase 2:

- `mark-epstein` (Jeffrey's brother — estate beneficiary, relationship to financial structures)
- `gwendolyn-beck` (assistant, presence at properties)
- `lesley-groff` (scheduler/assistant, NPA immunity recipient)
- `adriana-ross` (NPA immunity recipient, passport handler)
- `peter-listerman` (Russian model scout, FBI diagram reference)

For each, write 2–3 sentences answering: what was their documented role, and what is their
current accountability status?

---

## Phase 8: Build Verification

**Step 1:** Regenerate all JSON data:
```bash
npm run parse
```
Confirm the output includes:
- `✓ Cross-referenced themeIds: N people updated`
- `✓ Cross-referenced timelineEventIds: N people updated`

**Step 2:** TypeScript check:
```bash
npx tsc --noEmit
```

**Step 3:** Build:
```bash
npm run build
```

**Step 4:** Dev server verification:
```bash
npm run dev
```

**Checklist — visit `/people/ghislaine-maxwell/`:**
- [ ] `RoleInStoryBlock` renders below the summary paragraph with amber icon and prose
- [ ] `ThematicInvolvementRow` renders above the tab bar with theme pills
- [ ] Each theme pill links to `/themes/#[theme-id]`
- [ ] Theme pills are colored by category (trafficking = red, financial = purple, etc.)
- [ ] Legal status disclaimer note still renders for non-charged persons
- [ ] Overview tab: `PersonMiniTimeline` renders below the section accordions
- [ ] Mini timeline groups events by era
- [ ] Each event row links to `/timeline/#[event-id]`
- [ ] Connections tab: `PersonEgoGraph` renders above `ConnectionList`
- [ ] Ego graph shows person as center node (larger, white outline)
- [ ] Connected persons are visible as smaller colored nodes
- [ ] Nodes labeled with person last names
- [ ] Edge colors match relationship types shown in the legend
- [ ] Clicking a non-center node navigates to that person's page
- [ ] Dragging nodes works
- [ ] Graph is contained within its border (no overflow)

**Checklist — visit `/people/les-wexner/`:**
- [ ] `RoleInStoryBlock` renders (entry exists in `people-roles.ts`)
- [ ] ThematicInvolvementRow shows correct themes (financial-crimes at minimum)

**Checklist — visit a person NOT in `people-roles.ts` (e.g., a minor figure):**
- [ ] No `RoleInStoryBlock` renders (graceful null return)
- [ ] `ThematicInvolvementRow` still renders if they have themeIds
- [ ] Page doesn't break

**Checklist — mobile (375px):**
- [ ] `ThematicInvolvementRow` wraps pills to multiple lines gracefully
- [ ] `PersonMiniTimeline` is readable — date column doesn't cause overflow
- [ ] `PersonEgoGraph` SVG scales correctly in its container
- [ ] All existing tab content still renders correctly

**Checklist — no regressions:**
- [ ] `/people/` directory page still loads and filters correctly
- [ ] All existing PersonCard components unchanged
- [ ] ConnectionList still renders below ego graph in Connections tab
- [ ] Sources tab unaffected
- [ ] `npm run build` produces no TypeScript errors

---

## Files Created / Modified Summary

| Action | File |
|--------|------|
| **CREATE** | `src/data/people-roles.ts` |
| **CREATE** | `src/components/people/RoleInStoryBlock.tsx` |
| **CREATE** | `src/components/people/ThematicInvolvementRow.tsx` |
| **CREATE** | `src/components/people/PersonMiniTimeline.tsx` |
| **CREATE** | `src/components/people/PersonEgoGraph.tsx` |
| **MODIFY** | `scripts/build-connections.ts` — add themeIds + timelineEventIds cross-reference |
| **MODIFY** | `src/app/people/[slug]/PersonDetailClient.tsx` — insert 4 targeted additions |
| **MODIFY** | `src/types/index.ts` — verify/confirm themeIds field exists on Person |

---

## Design Notes for Claude Code

**`PersonEgoGraph`:** D3 must be imported dynamically (`import('d3').then(...)`) to
prevent SSR errors in Next.js static export mode. The component is wrapped in `'use client'`.
If the D3 import pattern causes issues, fall back to `dynamic(() => import(...), { ssr: false })`
wrapping the entire component from its parent.

**`ThematicInvolvementRow`:** The `THEME_SHORT_LABELS` record maps theme IDs to display
labels. These IDs must match the actual IDs generated by `parse-themes.ts`. After running
`npm run parse`, check `src/data/themes.json` and verify the first few IDs match what's
in the map. Adjust the map keys if the slugification logic produces different IDs.

**`PersonMiniTimeline`:** The link `href` for "View full timeline" passes a `?person=` query
param. This assumes the Timeline page supports filtering by person name via that parameter.
If the current implementation uses a different filter mechanism, adjust the href accordingly
to match whatever query param the Timeline page already uses.

**Cross-reference script ordering:** The cross-reference step at the end of
`build-connections.ts` reads `people.json` and `themes.json` after they've been written by
their respective parse scripts. If the build order is ever changed such that
`build-connections.ts` runs before these, the cross-reference will silently produce empty
arrays. The warning log (`console.warn('⚠ Cross-reference skipped...')`) will surface this.
