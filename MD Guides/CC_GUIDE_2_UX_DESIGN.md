# Claude Code Build Guide — Part 2: UX/UI Design Spec
## Epstein Files Research Database

---

## Design Philosophy

**Principle 1 — Information density on demand.**
Start sparse. Every view begins with a summary/overview layer. Users expand, drill down, or
filter to see more. Never display full article text in a list view.

**Principle 2 — Trust signaling.**
Every piece of information carries its verification status visually. Unverified claims are
never hidden, but they're clearly marked. Users must feel they can trust what they read.

**Principle 3 — Context preservation.**
When a user clicks a cross-link (e.g. a person mentioned in a timeline event), they shouldn't
lose their place. Use slide-over panels for quick-look previews; full page navigation only when
the user explicitly wants it.

**Principle 4 — Journalistic neutrality in presentation.**
The UI tone is clean, factual, institutional. No sensationalism in visual design. Think
investigative journalism tool, not true-crime entertainment app.

---

## Color System (Tailwind custom config)

```javascript
// tailwind.config.js — extend colors with:
colors: {
  surface: {
    DEFAULT: '#0f1117',   // page background
    card: '#161b27',      // card / panel background
    elevated: '#1e2535',  // hovered card / active state
    border: '#2a3347',    // all borders/dividers
  },
  text: {
    primary: '#e8eaf0',
    secondary: '#8b95a8',
    muted: '#535e72',
  },
  accent: {
    blue: '#4a9eff',      // links, active filters, primary CTA
    blueHover: '#6fb3ff',
  },
  status: {
    verified: '#22c55e',      // green
    unverified: '#f59e0b',    // amber
    contested: '#ef4444',     // red
    discrepancy: '#a855f7',   // purple
  },
  category: {
    principal:    '#ef4444',  // red — Epstein himself
    innerCircle:  '#f97316',  // orange
    political:    '#3b82f6',  // blue
    financial:    '#10b981',  // green
    legal:        '#8b5cf6',  // violet
    intelligence: '#6366f1',  // indigo
    academic:     '#06b6d4',  // cyan
    media:        '#ec4899',  // pink
    victim:       '#94a3b8',  // slate — subdued, respectful
    lawEnforcement: '#64748b',
    other:        '#475569',
  }
}
```

**Background:** Near-black (`#0f1117`) feels serious and editorial; it also reduces eye strain
during long research sessions.

---

## Typography

Use system font stack for performance:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

| Usage | Size | Weight | Color |
|---|---|---|---|
| Page titles (H1) | text-2xl | 600 | text-primary |
| Section headers (H2) | text-xl | 600 | text-primary |
| Card titles | text-base | 600 | text-primary |
| Body copy | text-sm | 400 | text-secondary |
| Labels/metadata | text-xs | 500 | text-muted |
| Source tags | text-xs | 600 uppercase | varies |

---

## Global Layout

### Navbar (fixed top, 56px tall)
- Left: Site title `EPSTEIN FILES` in monospace font, small text, muted color
- Center: `<GlobalSearch />` — expands to full-width on focus on mobile
- Right: Nav links — `People` | `Timeline` | `Themes` | `Graph`
- Mobile: hamburger collapses nav links; search always visible

### GlobalSearch Component
- Persistent search bar in navbar
- On keypress, debounce 200ms, query Fuse.js against unified search index
- Results appear in a dropdown below the bar (max 8 results, grouped by type)
- Each result shows: type badge, title, 1-line excerpt
- Pressing Enter or clicking "View all results" goes to `/search?q=...`
- Keyboard navigable (arrow keys + Enter)
- Pressing Escape closes dropdown and returns focus to bar

### Footer
- Minimal: source attribution, compilation date, disclaimer text
- "This database is compiled from public records and reported sources. Unverified allegations
  are clearly marked. This is an informational resource."

---

## Home Page (`/`)

### Structure (top to bottom):
1. **Hero** — full-width, ~40vh tall
   - Headline: `"The Epstein Files"` — large, stark
   - Subhead: `"A searchable database of people, events, and connections from the public record"`
   - Prominent search bar (re-uses GlobalSearch styles, bigger)
   - Below search: three quick-filter pills: `Search people` | `Browse timeline` | `Explore themes`

2. **Stats bar** — four numbers in a horizontal row
   - `50+ People documented`
   - `130+ Timeline events`
   - `17 Thematic investigations`
   - `3.5M+ Source pages`

3. **Entry point cards** — three equal-width cards
   - **People** — "Profiles of individuals named in the files, from inner circle to political
     figures." → link to `/people`
   - **Timeline** — "130+ events from 1953 to 2026, filterable by era and person." → link to `/timeline`
   - **Themes** — "17 investigative threads: trafficking, finance, intelligence, and more." → link to `/themes`

4. **Key figures preview** — horizontal scroll row of 6–8 PersonCards for the highest
   mention-count individuals

---

## People Directory (`/people`)

### Layout:
- Sticky filter bar below navbar:
  - Category filter pills (all categories, multi-select)
  - Text input for name filter (instant, client-side)
  - Sort: `Mentions (highest first)` | `Name A–Z` | `Flight legs`
  - Toggle: `Show network graph` — slides up a NetworkGraph panel above the grid

- Card grid: 3 columns on desktop, 2 on tablet, 1 on mobile

### PersonCard Component
```
┌─────────────────────────────────┐
│ [Category Badge]  [Status Badge]│
│                                 │
│ Name (bold, large)              │
│ Role / subcategory (muted)      │
│                                 │
│ Summary text (2–3 lines, clamp) │
│                                 │
│ ── ── ── ── ── ── ── ── ── ──  │
│ [DOJ mentions: 157,613]         │
│ [Flight legs: 364]              │
│ [Sources: CBS DOJ GH]           │
└─────────────────────────────────┘
```
- Click anywhere on card → navigate to `/people/[slug]`
- Hover state: slightly elevated background, subtle border glow in category color

### Category Badge
- Small pill, background = category color at 20% opacity, text = category color
- Text = human-readable label: "Inner Circle", "Political", "Financial", etc.

### Status Badge
- Small pill: "Convicted", "Not charged", "Immunity granted", "Deceased", etc.
- Color: red for convicted, amber for "not charged", green for law enforcement, grey otherwise

---

## Person Detail Page (`/people/[slug]`)

### Layout:
```
┌─ Breadcrumb: People > [Name] ────────────────────────────────────────────┐
│                                                                           │
│  [Category Badge]  [Status]                                  [Mentions]  │
│  Full Name                                                                │
│  Born / Died                            ← only if known                  │
│  Summary paragraph                                                        │
│                                                                           │
├─ Tab bar: [Overview] [Timeline] [Connections] [Sources] ─────────────────┤
│                                                                           │
│  TAB: Overview                                                            │
│  ─ PersonSections rendered as accordion items                            │
│  ─ Each section: title + preview text (3 lines) + [Expand] button        │
│  ─ Sections with UNVERIFIED content show amber banner when expanded      │
│  ─ DISCREPANCY sections show purple banner                                │
│                                                                           │
│  TAB: Timeline                                                            │
│  ─ Filtered TimelineView showing only events where this person appears   │
│                                                                           │
│  TAB: Connections                                                         │
│  ─ Mini NetworkGraph centered on this person (force-directed, 1-hop)     │
│  ─ Below graph: list of connections with relationship type + description  │
│                                                                           │
│  TAB: Sources                                                             │
│  ─ All EFTA document numbers referenced for this person                  │
│  ─ All source tags with descriptions                                      │
└───────────────────────────────────────────────────────────────────────────┘
```

### Progressive disclosure for sections:
- Default state: title visible, first 3 lines of content visible, rest hidden
- "Read more" link expands inline (no page jump)
- UNVERIFIED content is hidden behind an extra click:
  ```
  ┌─────────────────────────────────────────────────────┐
  │ ⚠  This section contains unverified allegations.   │
  │    Single-source claims marked [UNVERIFIED] in      │
  │    the source files.                                 │
  │                                [Show anyway ›]      │
  └─────────────────────────────────────────────────────┘
  ```

---

## Timeline Page (`/timeline`)

### Layout:
- Full-width horizontally scrollable track with era divisions
- Filter controls panel (collapsible on mobile):
  - Era checkboxes (6 eras)
  - Person filter: typeahead multi-select
  - Tag filter pills: financial, legal, trafficking, political, media, death
  - Verification filter: Show unverified? (checkbox, default: on)
- "Jump to era" quick-nav buttons at top

### TimelineEvent Card (vertical, stacked in era columns)
```
[DATE] ──────────────────────────
TITLE OF EVENT (bold)
Body preview (3 lines, clamped)
[Person chips: Maxwell] [Trump] [Wexner]
[Sources: CBS DOJ]  [⚠ Unverified]
[+ Expand]
```

- Clicking [+ Expand] reveals full event text inline (no navigation)
- Person chips are clickable cross-links (slide-over person preview)
- Events with UNVERIFIED status: amber left border
- Events with DISCREPANCY: purple left border
- Verified events: subtle surface-border left border

### Era visual treatment:
- Each era gets a labeled section header in the timeline
- Era dividers are full-width rules with era label centered
- Era color accent is a very subtle background tint change

---

## Themes Page (`/themes`)

### Layout:
- Left sidebar (desktop): sticky list of all 17 theme titles as nav links
- Main content: vertically stacked theme sections
- Mobile: sidebar collapses to a select dropdown

### ThemeSection Component:
```
┌─ Section header ──────────────────────────────────────────────────────────┐
│  ## 2. The Trafficking Operation                                          │
│  [Tag pills: trafficking, victims, recruitment]                          │
├───────────────────────────────────────────────────────────────────────────┤
│  Summary paragraph (first paragraph from markdown)                        │
│                                                                           │
│  [+ Read full section]  ← expands rest of content below                  │
│                                                                           │
│  ── When expanded ─────────────────────────────────────────────────────  │
│  Full markdown content rendered                                           │
│  Tables render as styled HTML tables                                      │
│                                                                           │
│  ── Related ───────────────────────────────────────────────────────────  │
│  People mentioned: [Maxwell chip] [Kellen chip] [Groff chip]             │
│  Timeline events: [Event chip: "2007-07-06 — NPA signed"]                │
└───────────────────────────────────────────────────────────────────────────┘
```

---

## Network Graph Page (`/graph`)

### Layout:
- Full-page canvas (100vw, calc(100vh - 56px))
- Floating controls panel (top-right):
  - Filter by category (toggle buttons using category colors)
  - Filter by connection strength (1/2/3)
  - "Focus on person" typeahead
  - "Reset view" button

### Graph behavior:
- Nodes: circles, colored by PersonCategory
- Node size: proportional to `mentionCount` (log scale, min 8px, max 32px radius)
- Edges: lines, thickness proportional to connection strength (1/2/3)
- Edge color: matches relationship type (use a separate edge color palette)
- Hover on node: highlights node + all connected edges; shows tooltip with person name + role
- Click on node: locks focus; shows person summary panel on left (SlideOver)
- Click on edge: shows connection description tooltip
- Zoom: scroll wheel; pan: click-drag on background
- Force simulation: moderate repulsion, link distance proportional to 1/strength

### Node tooltip:
```
┌─────────────────────┐
│ Ghislaine Maxwell   │
│ Inner Circle        │
│ ─────────────────── │
│ 13,163 DOJ mentions │
│ ~400 flight legs    │
│ [View full profile] │
└─────────────────────┘
```

---

## Shared Components

### Badge Component
```tsx
<Badge variant="category" category="inner-circle">Inner Circle</Badge>
<Badge variant="status" status="convicted">Convicted</Badge>
<Badge variant="source" source="DOJ">DOJ</Badge>
<Badge variant="verification" status="unverified">⚠ Unverified</Badge>
```
All badges are small pills (text-xs, rounded-full, px-2 py-0.5).

### SourceTag Component
Renders a compact pill for each source abbreviation (CBS, DOJ, GH, etc.) with a tooltip showing
the full source name on hover.

### CrossLink Component
Inline chip used within body text to link to a related entity:
```tsx
<CrossLink type="person" id="ghislaine-maxwell">Ghislaine Maxwell</CrossLink>
<CrossLink type="event" id="2007-npa-signed">2007 NPA</CrossLink>
<CrossLink type="theme" id="intelligence-connections">Intelligence</CrossLink>
```
- Renders as an underlined, accent-colored inline link
- On hover: shows a micro-tooltip with entity summary
- On click: on mobile/tablet → slide-over preview panel; on desktop → right-side preview panel

### UnverifiedBanner Component
```
┌────────────────────────────────────────────────────────────────────────┐
│ ⚠  Unverified allegation                                               │
│ This claim is flagged [UNVERIFIED] in source files. It appears in a   │
│ single source and has not been independently corroborated.             │
└────────────────────────────────────────────────────────────────────────┘
```
Amber left border, amber icon, subdued amber background tint.

### DiscrepancyFlag Component
Similar to UnverifiedBanner but purple, shown when sources conflict:
```
│ ⚡ Discrepancy noted                                                   │
│ Source files give conflicting information on this point.               │
│ Both versions are presented below.                                     │
```

### SlideOver Panel
- A right-side drawer (max-width 420px on desktop, full-width on mobile)
- Used for quick-look previews (person, event) without navigating away
- Animated slide-in from right
- Shows: entity title, summary, key metadata, "View full page →" link
- Backdrop click or Escape key closes it

---

## Mobile Considerations

- Navbar: logo + search icon (expands to full-screen search overlay) + hamburger
- People grid: single column
- Timeline: vertical stacked layout (era sections as collapsible accordions)
- Graph: renders but with a "Best viewed on desktop" note; nodes larger for touch targets
- All cards: full-width with comfortable touch targets (min 44px hit areas)
- Themes: sidebar becomes a select dropdown

---

## Animations & Transitions

Keep all animations minimal and purposeful:
- Card hover: `transition-colors duration-150` (background)
- SlideOver: `transition-transform duration-200 ease-out`
- Accordion expand: `transition-all duration-200`
- Graph node hover: D3 transition 150ms
- No parallax, no scroll animations, no loading skeletons that flash

---

## Empty States

Every filtered view needs an empty state:
```
  🔍
  No results match your filters.
  [Clear filters]
```
Simple, centered, not decorative.

---

## Disclaimer Display

A one-time dismissible banner at the top of every page (stored in sessionStorage):
```
┌────────────────────────────────────────────────────────────────────────┐
│ ℹ  About this database                                                 │
│ This site presents information from public records, court filings,    │
│ and published journalism. Unverified allegations are clearly marked.  │
│ This is an informational resource, not legal documentation.           │
│                                                          [Dismiss ✕]  │
└────────────────────────────────────────────────────────────────────────┘
```
