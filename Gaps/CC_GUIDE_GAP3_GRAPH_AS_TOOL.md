# CC_GUIDE — Gap 3: Graph as Investigation Tool
## Epstein Files Research Database — UX Improvement Series

**Purpose:** Transform the `/graph` page from a visually interesting but cognitively
overwhelming blob into an investigation tool that creates genuine "a-ha" moments. Four
additions: Cluster mode (nodes grouped by role), Theme highlight mode (fade non-relevant
nodes by investigation thread), Path finder (shortest documented connection between two
people), and Era scrubber (animate which connections were active per time period).

**Estimated implementation time:** 8–12 hours  
**Risk to existing functionality:** Medium — `NetworkGraph.tsx` is a complex D3 component.
All changes are additive (new props with sensible defaults). Existing behavior is preserved
when all new props are omitted or null. Read this entire guide before starting.  
**Build verification:** Run `npm run build` after each phase. Test in browser after each phase
before moving to the next.

---

## What's Being Added and Why

**Current state:** The graph has a force-directed layout, category/strength filters, a
financial mode toggle, a focus person typeahead, and a person slide-over panel. It's
functional but undirected — users have no way to ask a meaningful investigative question of
the graph. It answers: *Here are all the connections.* It doesn't answer: *Who connected the
trafficking operation to the intelligence world?* or *How did Maxwell and Dershowitz come
to be in the same room?*

**After this guide, the graph answers those questions:**

1. **Cluster mode** — Nodes snap to group positions by category (inner circle, political,
   financial, legal, etc.), making the structural logic of the network instantly visible.
   The question "How many categories does Epstein bridge?" becomes answerable at a glance.

2. **Theme highlight** — Select any of the 17 investigative themes. Non-relevant nodes
   fade to near-invisible; the subgraph relevant to that theme glows. Transforms the graph
   from "all connections" to "the financial subgraph" or "the intelligence subgraph."

3. **Path finder** — Click two people. The shortest documented connection path between
   them highlights in amber. The question "Is there a documented link between X and Y?"
   becomes answerable without reading profiles.

4. **Era scrubber** — A timeline slider at the bottom of the canvas steps through 6 eras.
   Connections that weren't active in a given era fade out. Shows how the network was built
   over time and how it changed after Epstein's 2008 plea.

---

## Phase 0: Data Model — Add `activeEras` to Connections

The era scrubber requires knowing which era(s) each documented connection was active in.
This requires adding `activeEras: string[]` to the `Connection` type and populating it
in `build-connections.ts`.

### Step 0a: Update `src/types/index.ts`

Locate the `Connection` interface. Add one field:

```typescript
export interface Connection {
  id: string;
  sourcePersonId: string;
  targetPersonId: string;
  relationshipType: /* existing union */;
  strength: 1 | 2 | 3;
  description: string;
  sources: SourceTag[];
  verificationStatus: VerificationStatus;
  activeEras: TimelineEra[];   // ← ADD THIS — eras when this connection was documented
}
```

`TimelineEra` is already defined in the types file as:
```typescript
export type TimelineEra =
  | 'pre-1990' | '1990-2000' | '2001-2007' | '2008-2018' | '2019' | '2020-present';
```

### Step 0b: Update `scripts/build-connections.ts`

The `Connection` interface in the script mirrors the types file. Update it to match:

```typescript
// In build-connections.ts — update the local Connection interface
interface Connection {
  id: string;
  sourcePersonId: string;
  targetPersonId: string;
  relationshipType: RelationshipType;
  strength: 1 | 2 | 3;
  description: string;
  sources: SourceTag[];
  verificationStatus: VerificationStatus;
  activeEras: string[];   // ← ADD THIS
}
```

### Step 0c: Populate `activeEras` in the cross-reference pass

In `build-connections.ts`, locate the `crossReference` function (or the section that
computes `connectionIds` on people). After the existing cross-reference logic, add the
following `activeEras` computation:

```typescript
// ─── Populate activeEras on each connection ────────────────────────────────
// Strategy: for each connection, find all timeline events where both people appear.
// Collect the eras of those events. If none found, mark as all eras (connection
// predates our timeline data or is a general relationship without dated events).

const ALL_ERAS = ['pre-1990', '1990-2000', '2001-2007', '2008-2018', '2019', '2020-present'];

// Build a map: personId → Set of timeline event eras
const personEventEras = new Map<string, Set<string>>();
for (const event of events) {
  for (const personId of event.peopleIds ?? []) {
    if (!personEventEras.has(personId)) {
      personEventEras.set(personId, new Set());
    }
    if (event.era) {
      personEventEras.get(personId)!.add(event.era);
    }
  }
}

// Build a map: personId → Set of event IDs (to find co-occurrence)
const personEventIds = new Map<string, Set<string>>();
for (const event of events) {
  for (const personId of event.peopleIds ?? []) {
    if (!personEventIds.has(personId)) {
      personEventIds.set(personId, new Set());
    }
    personEventIds.get(personId)!.add(event.id);
  }
}

// For each connection, find co-occurring events and extract their eras
for (const conn of allConnections) {
  const aEvents = personEventIds.get(conn.sourcePersonId) ?? new Set<string>();
  const bEvents = personEventIds.get(conn.targetPersonId) ?? new Set<string>();

  // Intersection: events where both people appear
  const sharedEventIds = new Set<string>();
  for (const id of aEvents) {
    if (bEvents.has(id)) sharedEventIds.add(id);
  }

  const eras = new Set<string>();
  for (const eventId of sharedEventIds) {
    const event = events.find((e) => e.id === eventId);
    if (event?.era) eras.add(event.era);
  }

  // If no shared events found, infer from individual person event eras
  // (the connection was active whenever either person was active)
  if (eras.size === 0) {
    const aEras = personEventEras.get(conn.sourcePersonId) ?? new Set<string>();
    const bEras = personEventEras.get(conn.targetPersonId) ?? new Set<string>();
    // Use union of their individual eras as a fallback
    for (const e of aEras) eras.add(e);
    for (const e of bEras) eras.add(e);
  }

  // If still nothing, assume all eras (connection exists but isn't dated)
  conn.activeEras = eras.size > 0
    ? ALL_ERAS.filter((e) => eras.has(e))  // preserve era order
    : ALL_ERAS;
}

console.log('✓ Populated activeEras on all connections');
```

**Also:** Update every place in `build-connections.ts` that constructs a `Connection` object
to include `activeEras: []` as an initial placeholder. The computation above will replace
those empty arrays. Search for `verificationStatus:` in the file — every object that has
that field needs `activeEras: []` added as a sibling field.

After this phase, run `npm run parse` and confirm `connections.json` contains `activeEras`
arrays on every entry. Spot-check that the maxwell-epstein connection has multiple eras,
and that a connection between minor figures has fewer.

---

## Phase 1: Update `NetworkGraph.tsx` Props Interface

Open `src/components/graph/NetworkGraph.tsx`. The existing `Props` interface is:

```typescript
interface Props {
  people: Person[];
  connections: Connection[];
  filterCategories?: Set<string>;
  filterStrength?: number;
  focusPersonId?: string | null;
  onPersonClick?: (person: Person) => void;
}
```

Replace it with:

```typescript
interface Props {
  people: Person[];
  connections: Connection[];
  filterCategories?: Set<string>;
  filterStrength?: number;
  focusPersonId?: string | null;
  onPersonClick?: (person: Person) => void;
  // ── Gap 3 additions ───────────────────────────────────────────────────
  viewMode?: 'network' | 'cluster';           // default: 'network'
  highlightThemePersonIds?: Set<string> | null; // person IDs in the highlighted theme
  highlightPath?: string[] | null;            // ordered list of person IDs forming a path
  filterEra?: string | null;                  // era slug to filter connections by, null = all
}
```

Also update the destructuring at the top of the component function:

```typescript
export default function NetworkGraph({
  people,
  connections,
  filterCategories,
  filterStrength = 1,
  focusPersonId,
  onPersonClick,
  viewMode = 'network',
  highlightThemePersonIds = null,
  highlightPath = null,
  filterEra = null,
}: Props) {
```

Add all new props to the `useEffect` dependency array at the end:
```typescript
}, [people, connections, filterCategories, filterStrength, focusPersonId, onPersonClick,
    viewMode, highlightThemePersonIds, highlightPath, filterEra]);
```

---

## Phase 2: Era Filtering in `NetworkGraph.tsx`

Inside the `init()` async function in the `useEffect`, locate where `filteredEdges` is
computed. It currently looks like:

```typescript
const filteredEdges: SimLink[] = connections
  .filter(
    (c) =>
      c.strength >= filterStrength &&
      personIds.has(c.sourcePersonId) &&
      personIds.has(c.targetPersonId)
  )
  .map(/* ... */);
```

Add the era filter to the `.filter()` call:

```typescript
const filteredEdges: SimLink[] = connections
  .filter(
    (c) =>
      c.strength >= filterStrength &&
      personIds.has(c.sourcePersonId) &&
      personIds.has(c.targetPersonId) &&
      (filterEra === null || (c.activeEras ?? []).includes(filterEra))  // ← ADD
  )
  .map((c) => ({
    source: c.sourcePersonId,
    target: c.targetPersonId,
    relationshipType: c.relationshipType,
    strength: c.strength,
    verificationStatus: c.verificationStatus,
    id: c.id,                    // ← make sure id is passed through for path highlighting
  }));
```

---

## Phase 3: Cluster Mode in `NetworkGraph.tsx`

Cluster mode replaces the standard `forceCenter` with `forceX`/`forceY` forces that
pull each node toward a predefined position for its category. The positions form a
2×6 grid layout within the canvas.

### Step 3a: Define cluster target positions

Add this constant above the component function (outside, so it doesn't re-create on render):

```typescript
// Cluster positions as fractions of canvas width/height.
// Arranged in a 2-column layout: operational left, support right.
const CLUSTER_POSITIONS: Record<string, { col: number; row: number }> = {
  'principal':           { col: 0.5, row: 0.15 },  // top center — Epstein
  'inner-circle':        { col: 0.25, row: 0.32 }, // upper left — Maxwell etc.
  'victim':              { col: 0.75, row: 0.32 }, // upper right — victims
  'co-conspirator':      { col: 0.20, row: 0.50 }, // mid left
  'financial':           { col: 0.80, row: 0.50 }, // mid right
  'political':           { col: 0.30, row: 0.68 }, // lower left
  'intelligence':        { col: 0.70, row: 0.68 }, // lower right
  'legal':               { col: 0.20, row: 0.82 }, // bottom left
  'academic-scientific': { col: 0.50, row: 0.85 }, // bottom center
  'media':               { col: 0.80, row: 0.82 }, // bottom right
  'law-enforcement':     { col: 0.50, row: 0.95 }, // bottom
  'other':               { col: 0.50, row: 0.50 }, // center fallback
};
```

### Step 3b: Conditionally apply cluster forces

In the simulation setup section, find where forces are applied:

```typescript
sim = d3.forceSimulation<SimNode>(filteredPeople)
  .force('link', d3.forceLink<SimNode, SimLink>(filteredEdges)...)
  .force('charge', d3.forceManyBody().strength(-120))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide<SimNode>()...);
```

Replace this block with the following (which conditionally swaps forces):

```typescript
const baseSimulation = d3.forceSimulation<SimNode>(filteredPeople)
  .force(
    'link',
    d3.forceLink<SimNode, SimLink>(filteredEdges)
      .id((d) => d.id)
      .distance((d) => 80 / d.strength)
  )
  .force('collision', d3.forceCollide<SimNode>().radius((d) => nodeRadius(d.mentionCount ?? 1) + 4));

if (viewMode === 'cluster') {
  baseSimulation
    .force('charge', d3.forceManyBody().strength(-60))
    .force(
      'x',
      d3.forceX<SimNode>((d) => {
        const pos = CLUSTER_POSITIONS[d.category] ?? CLUSTER_POSITIONS['other'];
        return pos.col * width;
      }).strength(0.4)
    )
    .force(
      'y',
      d3.forceY<SimNode>((d) => {
        const pos = CLUSTER_POSITIONS[d.category] ?? CLUSTER_POSITIONS['other'];
        return pos.row * height;
      }).strength(0.4)
    );
} else {
  baseSimulation
    .force('charge', d3.forceManyBody().strength(-120))
    .force('center', d3.forceCenter(width / 2, height / 2));
}

sim = baseSimulation;
```

### Step 3c: Add cluster labels overlay (cluster mode only)

After the node group is built and before `sim.on('tick', ...)`, add cluster labels that
appear only in cluster mode:

```typescript
if (viewMode === 'cluster') {
  const labelData = Object.entries(CLUSTER_POSITIONS).map(([cat, pos]) => ({
    category: cat,
    x: pos.col * width,
    y: pos.row * height - 35, // above the cluster center
    label: cat.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  g.append('g')
    .attr('class', 'cluster-labels')
    .selectAll('text')
    .data(labelData)
    .enter()
    .append('text')
    .attr('x', (d) => d.x)
    .attr('y', (d) => d.y)
    .attr('text-anchor', 'middle')
    .attr('font-size', '10px')
    .attr('font-family', 'monospace')
    .attr('fill', '#475569')
    .attr('letter-spacing', '0.08em')
    .attr('pointer-events', 'none')
    .text((d) => d.label.toUpperCase());
}
```

---

## Phase 4: Theme Highlight Mode in `NetworkGraph.tsx`

When `highlightThemePersonIds` is non-null, nodes in the set should be full opacity
with a highlight ring, and all other nodes/edges should fade to ~0.07 opacity.

### Step 4a: After nodes and edges are appended, apply highlight opacity

Find the section just before `sim.on('tick', ...)`. Insert:

```typescript
// ── Theme highlight mode ───────────────────────────────────────────────
if (highlightThemePersonIds && highlightThemePersonIds.size > 0) {
  // Fade all edges
  link.attr('stroke-opacity', (d: SimLink) => {
    const srcId = typeof d.source === 'string' ? d.source : (d.source as SimNode).id;
    const tgtId = typeof d.target === 'string' ? d.target : (d.target as SimNode).id;
    const srcIn = highlightThemePersonIds.has(srcId);
    const tgtIn = highlightThemePersonIds.has(tgtId);
    return (srcIn && tgtIn) ? 0.8 : (srcIn || tgtIn) ? 0.3 : 0.04;
  });

  // Fade non-highlighted nodes; add glow ring to highlighted ones
  nodeG.each(function(this: SVGGElement, d: SimNode) {
    const inTheme = highlightThemePersonIds.has(d.id);
    d3.select(this).select('.node-shape')
      .attr('fill-opacity', inTheme ? 1 : 0.07)
      .attr('stroke-opacity', inTheme ? 1 : 0.04);
    // Add highlight ring for in-theme nodes
    if (inTheme) {
      const r = nodeRadius(d.mentionCount ?? 1);
      d3.select(this).append('circle')
        .attr('r', r + 4)
        .attr('fill', 'none')
        .attr('stroke', '#f59e0b')
        .attr('stroke-width', 1.5)
        .attr('stroke-opacity', 0.7)
        .attr('pointer-events', 'none')
        .classed('theme-ring', true);
    }
    // Fade labels for non-highlighted nodes
    d3.select(this).select('text')
      .attr('fill-opacity', inTheme ? 1 : 0.05);
  });
}
```

### Step 4b: Path highlight mode

When `highlightPath` is a non-empty array of person IDs, highlight the path nodes
and the edges between consecutive pairs. This runs after the theme highlight block:

```typescript
// ── Path highlight mode ────────────────────────────────────────────────
if (highlightPath && highlightPath.length >= 2) {
  const pathSet = new Set(highlightPath);

  // Build set of path edge pairs (as "a|b" and "b|a" for undirected)
  const pathEdgePairs = new Set<string>();
  for (let i = 0; i < highlightPath.length - 1; i++) {
    const a = highlightPath[i];
    const b = highlightPath[i + 1];
    pathEdgePairs.add(`${a}|${b}`);
    pathEdgePairs.add(`${b}|${a}`);
  }

  // Fade non-path nodes
  nodeG.each(function(this: SVGGElement, d: SimNode) {
    const onPath = pathSet.has(d.id);
    d3.select(this).select('.node-shape')
      .attr('fill-opacity', onPath ? 1 : 0.08)
      .attr('stroke-opacity', onPath ? 1 : 0.04);
    d3.select(this).select('text')
      .attr('fill-opacity', onPath ? 1 : 0.04);

    // Add amber ring to path nodes
    if (onPath) {
      const r = nodeRadius(d.mentionCount ?? 1);
      const isEndpoint = d.id === highlightPath[0] || d.id === highlightPath[highlightPath.length - 1];
      d3.select(this).append('circle')
        .attr('r', r + 5)
        .attr('fill', 'none')
        .attr('stroke', isEndpoint ? '#f59e0b' : '#fbbf24')
        .attr('stroke-width', isEndpoint ? 2.5 : 1.5)
        .attr('stroke-opacity', 0.9)
        .attr('pointer-events', 'none')
        .classed('path-ring', true);

      // Add step number label for non-endpoints
      const stepIdx = highlightPath.indexOf(d.id);
      if (stepIdx > 0 && stepIdx < highlightPath.length - 1) {
        d3.select(this).append('text')
          .attr('dy', -r - 6)
          .attr('text-anchor', 'middle')
          .attr('font-size', '9px')
          .attr('fill', '#fbbf24')
          .attr('pointer-events', 'none')
          .text(String(stepIdx + 1));
      }
    }
  });

  // Highlight path edges; fade others
  link.attr('stroke-opacity', (d: SimLink) => {
    const srcId = typeof d.source === 'string' ? d.source : (d.source as SimNode).id;
    const tgtId = typeof d.target === 'string' ? d.target : (d.target as SimNode).id;
    const key1 = `${srcId}|${tgtId}`;
    const key2 = `${tgtId}|${srcId}`;
    if (pathEdgePairs.has(key1) || pathEdgePairs.has(key2)) return 1;
    return 0.04;
  }).attr('stroke', (d: SimLink) => {
    const srcId = typeof d.source === 'string' ? d.source : (d.source as SimNode).id;
    const tgtId = typeof d.target === 'string' ? d.target : (d.target as SimNode).id;
    const key1 = `${srcId}|${tgtId}`;
    if (pathEdgePairs.has(key1) || pathEdgePairs.has(`${tgtId}|${srcId}`)) return '#f59e0b';
    return EDGE_COLORS[(d as SimLink).relationshipType as string] ?? '#2a3347';
  }).attr('stroke-width', (d: SimLink) => {
    const srcId = typeof d.source === 'string' ? d.source : (d.source as SimNode).id;
    const tgtId = typeof d.target === 'string' ? d.target : (d.target as SimNode).id;
    if (pathEdgePairs.has(`${srcId}|${tgtId}`) || pathEdgePairs.has(`${tgtId}|${srcId}`)) return 3;
    return (d as SimLink).strength;
  });
}
```

---

## Phase 5: New Control Components

Create the following components in `src/components/graph/`.

### Component 1: `GraphModeToggle.tsx`

The view mode toggle — Network vs. Cluster.

```typescript
// src/components/graph/GraphModeToggle.tsx
import { Network, Grid } from 'lucide-react';

interface Props {
  viewMode: 'network' | 'cluster';
  onChange: (mode: 'network' | 'cluster') => void;
}

export default function GraphModeToggle({ viewMode, onChange }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
        Layout
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onChange('network')}
          aria-pressed={viewMode === 'network'}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded
                      border transition-colors
                      ${viewMode === 'network'
                        ? 'border-accent-blue text-accent-blue bg-accent-blue/10'
                        : 'border-surface-border text-text-muted hover:text-text-secondary'
                      }`}
        >
          <Network size={12} aria-hidden /> Network
        </button>
        <button
          onClick={() => onChange('cluster')}
          aria-pressed={viewMode === 'cluster'}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded
                      border transition-colors
                      ${viewMode === 'cluster'
                        ? 'border-accent-blue text-accent-blue bg-accent-blue/10'
                        : 'border-surface-border text-text-muted hover:text-text-secondary'
                      }`}
        >
          <Grid size={12} aria-hidden /> Cluster
        </button>
      </div>
    </div>
  );
}
```

### Component 2: `ThemeHighlightSelector.tsx`

A dropdown to select a theme to highlight on the graph.

```typescript
// src/components/graph/ThemeHighlightSelector.tsx
import { useState } from 'react';
import { Layers, X } from 'lucide-react';
import type { ThemeSection } from '@/types';
import themesData from '@/data/themes.json';

const themes = themesData as ThemeSection[];

interface Props {
  activeThemeId: string | null;
  onChange: (themeId: string | null) => void;
}

export default function ThemeHighlightSelector({ activeThemeId, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const active = themes.find((t) => t.id === activeThemeId);

  return (
    <div className="relative">
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
        Highlight Theme
      </p>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 text-xs py-1.5 px-2.5
                    rounded border transition-colors text-left
                    ${activeThemeId
                      ? 'border-amber-500/50 text-amber-300 bg-amber-500/10'
                      : 'border-surface-border text-text-muted hover:text-text-secondary'
                    }`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <Layers size={11} className="shrink-0" aria-hidden />
          <span className="truncate">
            {active ? active.title : 'None selected'}
          </span>
        </span>
        {activeThemeId && (
          <button
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="shrink-0 text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Clear theme highlight"
          >
            <X size={10} />
          </button>
        )}
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-surface-card border
                     border-surface-border rounded-lg shadow-xl z-50 max-h-64
                     overflow-y-auto"
          role="listbox"
          aria-label="Select theme to highlight"
        >
          <button
            role="option"
            aria-selected={activeThemeId === null}
            onClick={() => { onChange(null); setOpen(false); }}
            className="w-full text-left text-xs px-3 py-2 text-text-muted
                       hover:bg-surface-elevated transition-colors"
          >
            None (show all)
          </button>
          {themes.map((theme) => (
            <button
              key={theme.id}
              role="option"
              aria-selected={activeThemeId === theme.id}
              onClick={() => { onChange(theme.id); setOpen(false); }}
              className={`w-full text-left text-xs px-3 py-2 transition-colors leading-snug
                          ${activeThemeId === theme.id
                            ? 'bg-amber-500/10 text-amber-300'
                            : 'text-text-secondary hover:bg-surface-elevated'
                          }`}
            >
              <span className="font-mono text-text-muted mr-1.5">
                {String(theme.sectionNumber).padStart(2, '0')}
              </span>
              {theme.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Component 3: `PathFinder.tsx`

UI for selecting two people and triggering the path search. The actual BFS
computation happens in `graph/page.tsx` and the result is passed in as `currentPath`.

```typescript
// src/components/graph/PathFinder.tsx
import { useState } from 'react';
import { Route, X, ArrowRight } from 'lucide-react';
import type { Person } from '@/types';

interface Props {
  people: Person[];
  currentPath: string[] | null;       // ordered person IDs from BFS result
  onSearch: (fromId: string, toId: string) => void;
  onClear: () => void;
}

export default function PathFinder({ people, currentPath, onSearch, onClear }: Props) {
  const [fromId, setFromId] = useState<string>('');
  const [toId, setToId] = useState<string>('');
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const fromPerson = people.find((p) => p.id === fromId);
  const toPerson = people.find((p) => p.id === toId);

  function filterPeople(query: string) {
    if (!query.trim()) return [];
    return people
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }

  function handleSearch() {
    if (fromId && toId && fromId !== toId) {
      onSearch(fromId, toId);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
        Path Finder
      </p>

      {/* From person */}
      <div className="relative mb-1.5">
        <input
          type="text"
          placeholder="From person..."
          value={fromPerson ? fromPerson.name : fromQuery}
          onChange={(e) => {
            setFromQuery(e.target.value);
            setFromId('');
            setFromOpen(true);
          }}
          onFocus={() => setFromOpen(true)}
          onBlur={() => setTimeout(() => setFromOpen(false), 150)}
          className="w-full text-xs bg-surface border border-surface-border rounded
                     px-2.5 py-1.5 text-text-secondary placeholder:text-text-muted
                     focus:outline-none focus:border-accent-blue/50"
          aria-label="Path finder: starting person"
          aria-autocomplete="list"
        />
        {fromId && (
          <button
            onClick={() => { setFromId(''); setFromQuery(''); }}
            className="absolute right-2 top-1/2 -translate-y-1/2
                       text-text-muted hover:text-text-secondary"
            aria-label="Clear from person"
          >
            <X size={10} />
          </button>
        )}
        {fromOpen && filterPeople(fromQuery).length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-0.5 bg-surface-card border
                          border-surface-border rounded shadow-xl z-50">
            {filterPeople(fromQuery).map((p) => (
              <button
                key={p.id}
                onClick={() => { setFromId(p.id); setFromQuery(''); setFromOpen(false); }}
                className="w-full text-left text-xs px-2.5 py-1.5 text-text-secondary
                           hover:bg-surface-elevated transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Arrow + To person */}
      <div className="relative mb-2">
        <input
          type="text"
          placeholder="To person..."
          value={toPerson ? toPerson.name : toQuery}
          onChange={(e) => {
            setToQuery(e.target.value);
            setToId('');
            setToOpen(true);
          }}
          onFocus={() => setToOpen(true)}
          onBlur={() => setTimeout(() => setToOpen(false), 150)}
          className="w-full text-xs bg-surface border border-surface-border rounded
                     px-2.5 py-1.5 text-text-secondary placeholder:text-text-muted
                     focus:outline-none focus:border-accent-blue/50"
          aria-label="Path finder: destination person"
          aria-autocomplete="list"
        />
        {toId && (
          <button
            onClick={() => { setToId(''); setToQuery(''); }}
            className="absolute right-2 top-1/2 -translate-y-1/2
                       text-text-muted hover:text-text-secondary"
            aria-label="Clear to person"
          >
            <X size={10} />
          </button>
        )}
        {toOpen && filterPeople(toQuery).length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-0.5 bg-surface-card border
                          border-surface-border rounded shadow-xl z-50">
            {filterPeople(toQuery).map((p) => (
              <button
                key={p.id}
                onClick={() => { setToId(p.id); setToQuery(''); setToOpen(false); }}
                className="w-full text-left text-xs px-2.5 py-1.5 text-text-secondary
                           hover:bg-surface-elevated transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSearch}
        disabled={!fromId || !toId || fromId === toId}
        className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded
                   border transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                   border-accent-blue/50 text-accent-blue hover:bg-accent-blue/10"
        aria-label="Find shortest path between selected people"
      >
        <Route size={11} aria-hidden /> Find path
      </button>

      {/* Path result */}
      {currentPath && currentPath.length > 0 && (
        <div className="mt-2 pt-2 border-t border-surface-border">
          {currentPath.length === 1 ? (
            <p className="text-xs text-amber-400">No path found between these two people.</p>
          ) : (
            <>
              <p className="text-[10px] text-text-muted mb-1.5">
                {currentPath.length - 1} step{currentPath.length - 2 !== 1 ? 's' : ''}:
              </p>
              <div className="flex flex-col gap-1">
                {currentPath.map((id, i) => {
                  const p = people.find((x) => x.id === id);
                  return (
                    <div key={id} className="flex items-center gap-1.5">
                      <span className="text-xs text-amber-300 font-medium leading-snug">
                        {p?.name ?? id}
                      </span>
                      {i < currentPath.length - 1 && (
                        <ArrowRight size={9} className="text-text-muted shrink-0" aria-hidden />
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={onClear}
                className="mt-2 text-[10px] text-text-muted hover:text-text-secondary transition-colors"
              >
                Clear path
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
```

### Component 4: `EraScrubbber.tsx`

A horizontal slider at the bottom of the graph canvas that steps through eras.
Renders as a full-width bar pinned to the bottom of the graph container.

```typescript
// src/components/graph/EraScrubber.tsx
import { Play, Pause, SkipBack } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export const ERAS = [
  { id: null,            label: 'All eras' },
  { id: 'pre-1990',      label: 'Pre-1990' },
  { id: '1990-2000',     label: '1990–2000' },
  { id: '2001-2007',     label: '2001–2007' },
  { id: '2008-2018',     label: '2008–2018' },
  { id: '2019',          label: '2019' },
  { id: '2020-present',  label: '2020–Present' },
] as const;

type EraId = typeof ERAS[number]['id'];

interface Props {
  activeEra: string | null;
  onChange: (era: string | null) => void;
}

export default function EraScrubber({ activeEra, onChange }: Props) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-play: step through non-null eras every 2.5s
  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const nonNullEras = ERAS.filter((e) => e.id !== null);
    intervalRef.current = setInterval(() => {
      const currentIdx = nonNullEras.findIndex((e) => e.id === activeEra);
      const nextIdx = (currentIdx + 1) % nonNullEras.length;
      onChange(nonNullEras[nextIdx].id as string);
    }, 2500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, activeEra, onChange]);

  const activeLabel = ERAS.find((e) => e.id === activeEra)?.label ?? 'All eras';

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 bg-surface/90 backdrop-blur-sm
                 border-t border-surface-border px-4 py-2"
      aria-label="Era scrubber"
    >
      <div className="flex items-center gap-3 max-w-screen-xl mx-auto">
        {/* Play/pause + reset buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => { onChange(null); setPlaying(false); }}
            className="p-1.5 text-text-muted hover:text-text-secondary transition-colors rounded"
            aria-label="Reset to all eras"
          >
            <SkipBack size={12} />
          </button>
          <button
            onClick={() => {
              if (!playing && activeEra === null) onChange('pre-1990');
              setPlaying((p) => !p);
            }}
            className="p-1.5 text-text-muted hover:text-text-secondary transition-colors rounded"
            aria-label={playing ? 'Pause playback' : 'Play through eras'}
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>

        {/* Era label */}
        <span className="text-xs font-mono text-text-muted w-28 shrink-0">
          {activeLabel}
        </span>

        {/* Era buttons */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {ERAS.map((era) => (
            <button
              key={String(era.id)}
              onClick={() => { onChange(era.id as string | null); setPlaying(false); }}
              aria-pressed={activeEra === era.id}
              className={`shrink-0 text-[10px] px-2.5 py-1 rounded border transition-colors
                          whitespace-nowrap
                          ${activeEra === era.id
                            ? 'border-accent-blue text-accent-blue bg-accent-blue/10'
                            : 'border-surface-border text-text-muted hover:text-text-secondary'
                          }`}
            >
              {era.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 6: BFS Path-Finding Utility

Create a utility function in `src/lib/graphUtils.ts`:

```typescript
// src/lib/graphUtils.ts
import type { Connection } from '@/types';

/**
 * BFS shortest path between two person IDs in the connections graph.
 * Returns an ordered array of person IDs from `startId` to `endId`, inclusive.
 * Returns [startId] (length 1) if no path exists.
 * Returns [] if either ID doesn't exist in the graph.
 */
export function bfsShortestPath(
  startId: string,
  endId: string,
  connections: Connection[]
): string[] {
  if (startId === endId) return [startId];

  // Build adjacency list (undirected)
  const adj = new Map<string, Set<string>>();
  for (const conn of connections) {
    if (!adj.has(conn.sourcePersonId)) adj.set(conn.sourcePersonId, new Set());
    if (!adj.has(conn.targetPersonId)) adj.set(conn.targetPersonId, new Set());
    adj.get(conn.sourcePersonId)!.add(conn.targetPersonId);
    adj.get(conn.targetPersonId)!.add(conn.sourcePersonId);
  }

  if (!adj.has(startId) || !adj.has(endId)) return [];

  // BFS
  const queue: string[] = [startId];
  const visited = new Set<string>([startId]);
  const parent = new Map<string, string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === endId) {
      // Reconstruct path
      const path: string[] = [];
      let node: string | undefined = endId;
      while (node !== undefined) {
        path.unshift(node);
        node = parent.get(node);
      }
      return path;
    }
    for (const neighbor of adj.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }

  // No path found — return sentinel
  return [startId];
}
```

---

## Phase 7: Update `src/app/graph/page.tsx`

This is the main integration step. Open `src/app/graph/page.tsx` and make the
following additions. **Do not remove any existing state or UI** — add to it.

### Step 7a: Add new imports

```typescript
// Add to existing imports at top of file:
import GraphModeToggle from '@/components/graph/GraphModeToggle';
import ThemeHighlightSelector from '@/components/graph/ThemeHighlightSelector';
import PathFinder from '@/components/graph/PathFinder';
import EraScrubber from '@/components/graph/EraScrubber';
import { bfsShortestPath } from '@/lib/graphUtils';
import type { ThemeSection } from '@/types';
import themesData from '@/data/themes.json';

const themes = themesData as ThemeSection[];
```

### Step 7b: Add new state variables

After the existing state declarations, add:

```typescript
// Gap 3 new state
const [viewMode, setViewMode] = useState<'network' | 'cluster'>('network');
const [highlightThemeId, setHighlightThemeId] = useState<string | null>(null);
const [activeEra, setActiveEra] = useState<string | null>(null);
const [pathPersonA, setPathPersonA] = useState<string | null>(null);
const [pathPersonB, setPathPersonB] = useState<string | null>(null);
const [currentPath, setCurrentPath] = useState<string[] | null>(null);
```

### Step 7c: Compute derived values

After the existing `financialPersonIds`/`filteredPeople`/`filteredConnections` block, add:

```typescript
// Theme highlight: collect peopleIds from selected theme
const highlightThemePersonIds: Set<string> | null = highlightThemeId
  ? new Set(themes.find((t) => t.id === highlightThemeId)?.peopleIds ?? [])
  : null;

// Path finding: run BFS when both people are selected
function handlePathSearch(fromId: string, toId: string) {
  setPathPersonA(fromId);
  setPathPersonB(toId);
  // BFS on ALL connections (not just filtered) for maximum path discovery
  const path = bfsShortestPath(fromId, toId, connectionsData as Connection[]);
  setCurrentPath(path);
}

function handlePathClear() {
  setPathPersonA(null);
  setPathPersonB(null);
  setCurrentPath(null);
}
```

### Step 7d: Add new controls to the controls panel

Locate the existing controls panel `<div>` (the floating top-right panel). After all
existing controls and before the final Reset button, insert:

```tsx
{/* Divider */}
<div className="border-t border-surface-border" />

{/* View mode toggle */}
<GraphModeToggle viewMode={viewMode} onChange={setViewMode} />

{/* Theme highlight */}
<ThemeHighlightSelector
  activeThemeId={highlightThemeId}
  onChange={(id) => {
    setHighlightThemeId(id);
    // Clear path when switching modes
    handlePathClear();
  }}
/>

{/* Path finder */}
<PathFinder
  people={filteredPeople as Person[]}
  currentPath={currentPath}
  onSearch={(a, b) => {
    setHighlightThemeId(null); // clear theme highlight
    handlePathSearch(a, b);
  }}
  onClear={handlePathClear}
/>
```

Update the existing Reset button's `onClick` to also clear new state:

```tsx
onClick={() => {
  setSelectedCategories(new Set());
  setMinStrength(1);
  setFocusPerson(null);
  setSelectedPerson(null);
  setFinancialMode(false);
  // Gap 3 additions:
  setViewMode('network');
  setHighlightThemeId(null);
  setActiveEra(null);
  handlePathClear();
}}
```

### Step 7e: Pass new props to `<NetworkGraph>`

Locate the `<NetworkGraph ... />` component usage. Update it to pass the new props:

```tsx
<NetworkGraph
  people={filteredPeople}
  connections={filteredConnections}
  filterCategories={selectedCategories.size > 0 ? selectedCategories : undefined}
  filterStrength={minStrength}
  focusPersonId={focusPerson}
  onPersonClick={handlePersonClick}
  viewMode={viewMode}
  highlightThemePersonIds={highlightThemePersonIds}
  highlightPath={currentPath && currentPath.length >= 2 ? currentPath : null}
  filterEra={activeEra}
/>
```

### Step 7f: Add `EraScrubber` below the graph canvas

The graph canvas is inside a `<div className="flex-1">` wrapper. The `EraScrubber`
needs to be inside the same relative-positioned parent as the canvas. Find the
`{/* Graph canvas */}` section:

```tsx
{/* Graph canvas */}
<div className="flex-1">
  <NetworkGraph ... />
</div>
```

Change it to:

```tsx
{/* Graph canvas + era scrubber */}
<div className="flex-1 relative">
  {/* Add bottom padding so graph doesn't overlap scrubber */}
  <div style={{ height: 'calc(100% - 44px)' }}>
    <NetworkGraph ... />
  </div>
  <EraScrubber
    activeEra={activeEra}
    onChange={setActiveEra}
  />
</div>
```

---

## Phase 8: Controls Panel Scroll

The controls panel will now be taller with the new sections. Ensure it's scrollable:

Find the controls panel `<div>` with `className` containing `w-64 bg-surface-card/95`.
Add `overflow-y-auto max-h-[calc(100vh-120px)]` to its className:

```tsx
<div className="absolute top-4 right-4 z-20 w-64 bg-surface-card/95 backdrop-blur-sm
                border border-surface-border rounded-lg p-3 space-y-4 shadow-xl
                overflow-y-auto max-h-[calc(100vh-120px)]">   {/* ← ADD overflow + max-h */}
```

---

## Phase 9: Build Verification

**Step 1:** Regenerate data (for `activeEras`):
```bash
npm run parse
```
Confirm output includes: `✓ Populated activeEras on all connections`

Open `src/data/connections.json` and verify a sample connection has `activeEras` with at
least one era value.

**Step 2:** TypeScript check:
```bash
npx tsc --noEmit
```
Fix any type errors. Common issues:
- `SimLink` may need an `id` field added if it's referenced in path highlighting
- `Connection` import in `graph/page.tsx` may need updating if types changed

**Step 3:** Build:
```bash
npm run build
```

**Step 4:** Manual verification — navigate to `/graph/` in the dev server:

**Network vs Cluster mode:**
- [ ] "Network" button is active by default; graph shows free-form force layout
- [ ] Clicking "Cluster" reorganizes nodes into category groups
- [ ] Category label overlays appear in cluster mode ("INNER CIRCLE", "POLITICAL", etc.)
- [ ] Switching back to "Network" returns to free-form layout
- [ ] All existing filters still work in both modes

**Theme highlight:**
- [ ] Dropdown shows all 17 themes
- [ ] Selecting "Trafficking Operation" fades non-relevant nodes to near-invisible
- [ ] Relevant nodes get amber highlight rings
- [ ] Edges between relevant nodes remain bright; others fade
- [ ] Clearing theme returns to normal display
- [ ] Switching themes works without needing to clear first

**Path finder:**
- [ ] Typing in "From" field shows matching person names in dropdown
- [ ] Same for "To" field
- [ ] "Find path" button disabled until both fields are filled
- [ ] After search, path is shown as a list in the controls panel
- [ ] Corresponding nodes on graph have amber rings; edges between them are amber
- [ ] Non-path nodes and edges fade
- [ ] "No path found" shows correctly for disconnected nodes
- [ ] "Clear path" removes highlight
- [ ] Path search clears when theme highlight is selected

**Era scrubber:**
- [ ] Scrubber bar appears at bottom of graph canvas
- [ ] "All eras" button selected by default
- [ ] Clicking "1990–2000" fades connections not active in that era
- [ ] Edge count visibly decreases for narrow era selections
- [ ] Play button steps through eras automatically
- [ ] Pause button stops playback
- [ ] Reset button (⏮) returns to "All eras"
- [ ] Era selection clears when "Reset view" is clicked in controls

**No regressions:**
- [ ] Existing category filters still work
- [ ] Strength filter still works
- [ ] Financial mode still works
- [ ] Focus person typeahead still works
- [ ] Person click still opens slide-over panel
- [ ] Zoom and pan still work
- [ ] "Reset view" button resets all new state in addition to existing state

---

## Files Created / Modified Summary

| Action | File |
|--------|------|
| **MODIFY** | `src/types/index.ts` — add `activeEras: TimelineEra[]` to Connection |
| **MODIFY** | `scripts/build-connections.ts` — add `activeEras` computation in cross-reference pass |
| **MODIFY** | `src/components/graph/NetworkGraph.tsx` — add 4 new props + cluster/highlight/path/era logic |
| **CREATE** | `src/components/graph/GraphModeToggle.tsx` |
| **CREATE** | `src/components/graph/ThemeHighlightSelector.tsx` |
| **CREATE** | `src/components/graph/PathFinder.tsx` |
| **CREATE** | `src/components/graph/EraScrubber.tsx` |
| **CREATE** | `src/lib/graphUtils.ts` — BFS utility |
| **MODIFY** | `src/app/graph/page.tsx` — new state, new controls, new props to NetworkGraph, EraScrubber |

---

## Implementation Notes for Claude Code

**D3 + React state:** The `NetworkGraph` component re-runs its entire `useEffect` whenever
any prop changes. This is intentional — D3 imperatively redraws on change. The new props
(`viewMode`, `highlightThemePersonIds`, `highlightPath`, `filterEra`) are all included in
the dependency array. This means changing any of them triggers a full D3 re-render, which
is the correct behavior for a force simulation that needs to restart with new forces.

**SimLink `id` field:** The path-highlighting code references `d.id` on SimLink objects.
Ensure the `.map()` that builds `filteredEdges` passes through the connection `id`:
```typescript
.map((c) => ({
  source: c.sourcePersonId,
  target: c.targetPersonId,
  relationshipType: c.relationshipType,
  strength: c.strength,
  verificationStatus: c.verificationStatus,
  id: c.id,     // ← must be present for path highlighting
}));
```

**ThemeHighlightSelector closes on blur:** The dropdown uses `onBlur` with a `setTimeout`
trick to allow the option buttons to register clicks before the blur closes the menu. If
clicking options doesn't work, check that the timeout is at least 150ms.

**Cluster mode and financial mode interaction:** If `financialMode` is enabled, `filteredPeople`
is already pre-filtered to financial nodes. Cluster mode still works — it just clusters
the financial subgraph. The CLUSTER_POSITIONS object has a 'financial' entry that will be
the primary cluster in this mode.

**Era scrubber and existing filters:** The era filter (`filterEra`) filters `filteredEdges`
inside `NetworkGraph`. It does NOT filter `filteredPeople` — all nodes remain visible, but
connections not active in that era are hidden. This is intentional: a person like Les Wexner
was "in the network" even in eras where his specific edge to Epstein may not have a dated event.

**BFS on all connections:** The `bfsShortestPath` function runs on `connectionsData` (all
connections), not `filteredConnections`. This ensures the path finder works even when
category/strength filters are active. If the path goes through a filtered-out node, it's
still displayed on the graph temporarily while the path is active.
