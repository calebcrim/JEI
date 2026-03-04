# CC_GUIDE — Gap 4: Themes as Investigation Threads
## Epstein Files Research Database — UX Improvement Series

**Purpose:** Transform the Themes page from 17 isolated essays into a single interconnected
investigation. Two additions: (1) a "Connects to" section at the bottom of every expanded
theme that explains in prose *why* that thread links to other threads, and (2) a theme
relationship map at the top of the page that makes the network of connections visible before
any theme is opened.

**Estimated implementation time:** 4–6 hours  
**Risk to existing functionality:** Low — entirely additive. The ThemeSectionItem component
is extended, not rewritten. No data pipeline changes required.  
**Build verification:** Run `npm run build` after each phase. All existing themes still
render identically when collapsed.

---

## What's Being Added and Why

**Current state:** The Themes page has 17 accordion sections. Each has a summary, full
markdown body (when expanded), tagged people, and source tags. Each section is functionally
self-contained — there is no signal to the reader that Theme 3 (The Plea Deal) directly
enables Theme 7 (Co-Conspirators), or that Theme 9 (Financial Crimes) and Theme 11
(Intelligence Connections) share the same transactions.

**After this guide:** Every expanded theme ends with a "Connects to" block — 2–3 bridge
sentences for each linked theme that explain the *causal or evidential relationship*, plus
a quick-jump link. At the top of the page, a theme relationship map renders the 17 themes
as nodes in a lightweight SVG diagram with annotated edges, so users can see the
investigative architecture before reading any single section.

The connective tissue is primarily content work. This guide provides all prose bridges as
a static data file — no parsing, no AI generation, just authored text that Claude Code
renders. The components are thin wrappers around the data.

---

## Phase 0: Verify Theme IDs

Before writing any code, run the following in the project root to print the actual
theme IDs from the parsed data:

```bash
node -e "const t = require('./src/data/themes.json'); t.forEach(x => console.log(x.sectionNumber, x.id))"
```

The IDs produced by `parse-themes.ts` are slugified from the theme titles. Copy the
full list of IDs from the output — you will need them to validate the `themeConnections`
data in Phase 1.

The IDs referenced throughout this guide follow expected slugification patterns (e.g.,
`"trafficking-operation"`, `"acosta-plea-legal-history"`). If the actual IDs differ, update
all `themeId` references in `src/data/theme-connections.ts` to match the actual values
before continuing.

---

## Phase 1: Create `src/data/theme-connections.ts`

This file defines the cross-theme bridge data: which themes connect, the strength of the
connection (for the visual map), and the prose bridge sentence(s) that explain the link.

Each theme entry has a `connects` array. Each connection has:
- `themeId` — the target theme
- `strength` — 1 (tangential), 2 (significant), 3 (directly causal)
- `bridge` — 1–3 sentences of analytical prose explaining the link

```typescript
// src/data/theme-connections.ts
// Cross-theme connection bridges for the Themes page.
// All themeId values must match the actual IDs in src/data/themes.json.
// Run: node -e "require('./src/data/themes.json').forEach(t => console.log(t.id))"
// to verify IDs before running Claude Code on this file.

export interface ThemeBridge {
  themeId: string;
  strength: 1 | 2 | 3;
  bridge: string;  // 1-3 sentences of analytical prose
}

export interface ThemeConnectionEntry {
  themeId: string;
  connects: ThemeBridge[];
}

// IMPORTANT: themeId values below follow expected slug patterns.
// Claude Code must verify each ID against the actual themes.json before rendering.
// If an ID doesn't exist in themes.json, skip that connection rather than creating a dead link.

export const themeConnections: ThemeConnectionEntry[] = [
  {
    themeId: 'trafficking-operation',
    connects: [
      {
        themeId: 'maxwell-role-legal',
        strength: 3,
        bridge: `Maxwell was not a peripheral figure in the trafficking operation — she was its operational director. Understanding the operation's mechanics (recruitment, management, logistics) requires understanding Maxwell's specific role, which is documented separately in Theme 6.`,
      },
      {
        themeId: 'co-conspirators-immunity',
        strength: 3,
        bridge: `The immunity provisions of the 2008 Non-Prosecution Agreement directly shaped who could be held accountable for the trafficking operation. Kellen, Ross, Groff, and Marcinkova — key operational figures — received blanket immunity, ending any federal accountability for their roles. The trafficking operation cannot be understood without understanding who was protected from prosecution for it.`,
      },
      {
        themeId: 'acosta-plea-legal-history',
        strength: 3,
        bridge: `The 2008 plea deal that allowed the trafficking operation to continue for over a decade with minimal legal consequence is documented in detail in Theme 14. The Acosta NPA is the legal mechanism that transformed documented federal crimes into an 18-month state sentence with daily work release.`,
      },
      {
        themeId: 'jean-luc-brunel-mc2',
        strength: 2,
        bridge: `Brunel's MC2 Model Management served as the international recruitment infrastructure for the trafficking operation — particularly for victims from France, Eastern Europe, and Brazil. His operation extended the network's geographic reach well beyond Palm Beach and New York.`,
      },
    ],
  },

  {
    themeId: 'efta-release-framework',
    connects: [
      {
        themeId: 'community-research-tools',
        strength: 3,
        bridge: `The 3.5 million pages released under EFTA are largely navigable only through community-built tools — JMail.world (indexing Epstein's email archive), EpsteinExposed.com (cross-referencing the full document corpus), and the GitHub repositories built by citizen researchers. The release framework and the community tools for navigating it are effectively one investigation.`,
      },
      {
        themeId: 'epsteins-death-mcc',
        strength: 2,
        bridge: `Dataset 8 and Dataset 9 of the EFTA release contain the MCC surveillance footage and prison records. The "infinite loop" anomaly in Dataset 9 and the confirmed destruction of footage from August 9–10, 2019 are part of the released document architecture — the gaps in the release are direct evidence in the death investigation.`,
      },
      {
        themeId: 'media-congressional',
        strength: 2,
        bridge: `The O'Keefe recording of an ABC News executive suppressing the Epstein story — surfaced through EFTA-adjacent document releases — is a primary document in the media investigation thread. Several congressional referrals and oversight requests cite EFTA compliance failures as the basis for further investigation.`,
      },
    ],
  },

  {
    themeId: 'trump-epstein-connections',
    connects: [
      {
        themeId: 'trafficking-operation',
        strength: 2,
        bridge: `Virginia Giuffre has stated she was first recruited at Mar-a-Lago, where she worked as a locker room attendant at age 16. The Trump-Epstein social and property relationship is directly relevant to how and where victim recruitment occurred.`,
      },
      {
        themeId: 'acosta-plea-legal-history',
        strength: 3,
        bridge: `Alexander Acosta — who negotiated the 2008 NPA — told Trump transition officials that he had been informed Epstein "belonged to intelligence" and was directed to leave the case alone. He was confirmed as Secretary of Labor by the same administration and resigned only after Epstein's 2019 re-arrest. The Acosta appointment is a direct connection between this theme and the plea deal.`,
      },
      {
        themeId: 'maxwell-role-legal',
        strength: 2,
        bridge: `Reporting from The Guardian and subsequent EFTA document analysis indicates Maxwell made overtures to provide testimony implicating Trump in exchange for a sentence reduction, which was reportedly rejected. Maxwell's silence about the Trump relationship is a documented feature of the post-conviction legal landscape.`,
      },
      {
        themeId: 'political-intelligence-network',
        strength: 2,
        bridge: `The Trump-Epstein connection exists within a broader pattern of Epstein cultivating relationships with politically powerful figures across party lines. The political intelligence network theme contextualizes these relationships as systematic rather than incidental.`,
      },
    ],
  },

  {
    themeId: 'political-intelligence-network',
    connects: [
      {
        themeId: 'intelligence-connections',
        strength: 3,
        bridge: `The political network and intelligence dimensions of the Epstein operation are deeply entangled. The same figures who provided political cover — including Barak, whose connection to Israeli intelligence is documented — also appear in the intelligence thread. Several researchers argue the political network was the product of intelligence asset cultivation rather than organic social connection.`,
      },
      {
        themeId: 'financial-crimes',
        strength: 2,
        bridge: `Wexner's financial relationship with Epstein — the primary documented funding source for the political network's infrastructure — is analyzed in depth in the Financial Crimes theme. The movement of money through Epstein's foundations and LLCs is the mechanism that made the political network's hospitality infrastructure possible.`,
      },
      {
        themeId: 'acosta-plea-legal-history',
        strength: 2,
        bridge: `The success of the 2008 NPA is widely attributed to Epstein's political connections. Acosta's reference to Epstein "belonging to intelligence" and his instruction to leave the case alone suggests that at least some of those connections operated at the level of national security rather than mere political influence.`,
      },
    ],
  },

  {
    themeId: 'maxwell-role-legal',
    connects: [
      {
        themeId: 'trafficking-operation',
        strength: 3,
        bridge: `Maxwell's conviction documents the core operational facts of the trafficking operation from her role as primary recruiter and trainer. Her trial record is the most authoritative single source for how the operation functioned day-to-day.`,
      },
      {
        themeId: 'co-conspirators-immunity',
        strength: 3,
        bridge: `Maxwell's ongoing refusal to name additional co-conspirators — and the reported rejection of her offer to implicate Trump in exchange for a reduced sentence — is the central unresolved thread in the immunity theme. Her testimony remains the most significant withheld evidence in the entire case.`,
      },
      {
        themeId: 'intelligence-connections',
        strength: 2,
        bridge: `Maxwell's father Robert was a confirmed Mossad asset who died in disputed circumstances weeks before Ghislaine joined Epstein in New York. The intelligence-connections theme examines whether she brought asset relationships or recruitment methodology with her from that context.`,
      },
    ],
  },

  {
    themeId: 'co-conspirators-immunity',
    connects: [
      {
        themeId: 'acosta-plea-legal-history',
        strength: 3,
        bridge: `The immunity provisions are a product of the NPA — they exist because Acosta's office agreed to them. The full scope of who received immunity (named and unnamed), the illegal non-notification of victims, and the legal challenges to the agreement are all part of the plea deal theme.`,
      },
      {
        themeId: 'trafficking-operation',
        strength: 3,
        bridge: `Kellen, Ross, Groff, and Marcinkova — the four named NPA immunity recipients besides Epstein — were direct participants in the trafficking operation's daily management. Their immunity means the operation's infrastructure was legally insulated from federal prosecution even as its structure became publicly documented.`,
      },
      {
        themeId: 'maxwell-role-legal',
        strength: 2,
        bridge: `Maxwell was not included in the 2008 NPA (she was in the UK at the time) and was eventually prosecuted separately. Her eventual conviction — and her withholding of testimony about additional co-conspirators — is the primary outstanding accountability question following the NPA immunity grants.`,
      },
    ],
  },

  {
    themeId: 'financial-crimes',
    connects: [
      {
        themeId: 'political-intelligence-network',
        strength: 2,
        bridge: `The financial flows that funded the Epstein network — Wexner's transferred wealth, the Gratitude America and Epstein VI Foundation charitable entities, the BNY and JPMorgan accounts — are what made the political hospitality infrastructure possible. Money and influence are not separate systems in this operation; they are the same system.`,
      },
      {
        themeId: 'intelligence-connections',
        strength: 2,
        bridge: `Several forensic researchers have noted that the financial flows between Epstein-linked entities and figures with documented intelligence connections — including the Carbyne investment shared by Epstein and Barak — suggest the financial network may have had an intelligence facilitation dimension beyond simple money management.`,
      },
      {
        themeId: 'co-conspirators-immunity',
        strength: 2,
        bridge: `Darren Indyke, as Epstein's estate trustee, administered the post-death distributions — including $100 million to Marina Shuliak — from the 1953 Trust. His role as both defense-side attorney during the NPA negotiations and estate administrator creates an unresolved question about continuity between the legal protection structure and the financial distribution structure.`,
      },
      {
        themeId: 'international-consequences',
        strength: 2,
        bridge: `Several of the suspicious transactions in the financial record — particularly movements through Austrian entities and accounts linked to Brunel's operations — have international jurisdiction implications. German and French investigators have opened parallel financial investigations that are documented in the international consequences theme.`,
      },
    ],
  },

  {
    themeId: 'intelligence-connections',
    connects: [
      {
        themeId: 'political-intelligence-network',
        strength: 3,
        bridge: `The intelligence and political dimensions of the Epstein network are the hardest to disentangle. Acosta's reference to Epstein "belonging to intelligence" and the Wexner relationship's intelligence-adjacent dimensions both appear in this theme, but their full significance requires the political network context to interpret.`,
      },
      {
        themeId: 'epsteins-death-mcc',
        strength: 2,
        bridge: `The circumstances of Epstein's death — the removed suicide watch, the sleeping guards, the destroyed surveillance footage, the contested autopsy findings — take on additional significance in the context of his alleged intelligence connections. If Epstein was an active or former intelligence asset, the question of who benefits from his death becomes a different kind of question.`,
      },
      {
        themeId: 'maxwell-role-legal',
        strength: 2,
        bridge: `Robert Maxwell's confirmed Mossad relationship, and Ghislaine's trajectory from her father's social world into Epstein's network within months of Robert Maxwell's death, is the most direct documented link between this investigation and intelligence services.`,
      },
      {
        themeId: 'financial-crimes',
        strength: 2,
        bridge: `The Carbyne investment — shared by Epstein and Ehud Barak, former Israeli Prime Minister — and the movement of funds through entities with intelligence-adjacent relationships is analyzed in the financial crimes theme. The forensic financial work provides the evidentiary foundation for claims made in this thread.`,
      },
    ],
  },

  {
    themeId: 'epsteins-death-mcc',
    connects: [
      {
        themeId: 'efta-release-framework',
        strength: 3,
        bridge: `Dataset 8 and Dataset 9 of the EFTA release are the primary documentary source for the MCC death investigation. The destroyed footage, the "infinite loop" in Dataset 9, and the prison records are all part of the released document corpus — the release framework directly shapes what is and isn't available to researchers.`,
      },
      {
        themeId: 'intelligence-connections',
        strength: 2,
        bridge: `The circumstances of the death — multiple institutional failures occurring simultaneously while the most anticipated federal witness of the decade was in custody — are interpreted very differently depending on whether Epstein is understood as a private actor or as an intelligence-adjacent figure. This thread and the intelligence theme must be read together.`,
      },
      {
        themeId: 'media-congressional',
        strength: 2,
        bridge: `Media coverage of the death, and subsequent congressional inquiries into the MCC circumstances, are part of the institutional response documented in the media and congressional investigations theme. The Barr DOJ's handling of the death investigation is a specific subject of congressional scrutiny.`,
      },
    ],
  },

  {
    themeId: 'acosta-plea-legal-history',
    connects: [
      {
        themeId: 'co-conspirators-immunity',
        strength: 3,
        bridge: `The NPA is the instrument that created the immunity structure. They are cause and effect: the plea deal theme documents how the NPA was negotiated; the co-conspirators theme documents what the immunity provisions protected and who received them.`,
      },
      {
        themeId: 'trump-epstein-connections',
        strength: 2,
        bridge: `Acosta's subsequent appointment as Secretary of Labor in the Trump administration, and his comment to transition officials that Epstein "belonged to intelligence," are direct threads linking the 2008 legal history to the Trump connection theme.`,
      },
      {
        themeId: 'political-intelligence-network',
        strength: 2,
        bridge: `The extraordinary terms of the 2008 NPA — federal immunity, state plea, daily work release — are difficult to explain without reference to Epstein's political connections. The political network theme provides the context for understanding why federal prosecutors agreed to terms that defense attorneys called unprecedented.`,
      },
      {
        themeId: 'media-congressional',
        strength: 2,
        bridge: `Congressional investigations into the NPA — particularly the House Judiciary Committee's examination of Acosta and the Biden DOJ's decision not to reopen the immunity question — are documented in the media and congressional investigations theme.`,
      },
    ],
  },

  {
    themeId: 'international-consequences',
    connects: [
      {
        themeId: 'financial-crimes',
        strength: 2,
        bridge: `The French and German financial investigations into Epstein-linked accounts are pursuing the same transaction records analyzed in the financial crimes theme. The international legal proceedings provide an alternative jurisdiction for evidence that U.S. investigators have not pursued.`,
      },
      {
        themeId: 'trafficking-operation',
        strength: 2,
        bridge: `Brunel's operations — the international recruitment networks centered in France, Brazil, and Eastern Europe — are the primary subject of French criminal proceedings. The trafficking operation's international dimensions are most extensively investigated outside the United States.`,
      },
      {
        themeId: 'intelligence-connections',
        strength: 2,
        bridge: `Israeli and British governmental responses to requests for cooperation with the U.S. investigation — particularly regarding Prince Andrew and Barak — are documented in this theme. The degree to which foreign intelligence relationships impede international cooperation is a specific research question this thread pursues.`,
      },
    ],
  },

  {
    themeId: 'media-congressional',
    connects: [
      {
        themeId: 'efta-release-framework',
        strength: 2,
        bridge: `The EFTA itself is a product of congressional action — passed with a veto-proof majority despite opposition from the executive branch. Congressional pressure is the mechanism through which the 3.5 million page release happened, and ongoing congressional investigation is the mechanism through which compliance gaps are being challenged.`,
      },
      {
        themeId: 'acosta-plea-legal-history',
        strength: 2,
        bridge: `Congressional scrutiny of the NPA — including the House Judiciary Committee's 2019 investigation of Acosta and requests for underlying DOJ communications — is the primary accountability mechanism for the 2008 immunity grants. The media coverage and congressional investigations are the institutional response to the NPA that the plea deal theme documents.`,
      },
    ],
  },

  {
    themeId: 'community-research-tools',
    connects: [
      {
        themeId: 'efta-release-framework',
        strength: 3,
        bridge: `The community tools exist to navigate the EFTA releases. JMail.world indexes Epstein's email archive from the release; EpsteinExposed.com cross-references the 1.1+ million documents; the GitHub forensic repositories analyze the financial records. The tools and the document corpus are inseparable.`,
      },
    ],
  },

  {
    themeId: 'whoops-emails',
    connects: [
      {
        themeId: 'trafficking-operation',
        strength: 2,
        bridge: `The "whoops" email chain — in which Epstein forwarded nude photographs of a minor to Jean-Luc Brunel with the annotation "whoops" — is one of the most direct documentary pieces of evidence linking the email archive to the operational trafficking record. It appears in both this theme and the trafficking operation.`,
      },
      {
        themeId: 'efta-release-framework',
        strength: 2,
        bridge: `The "whoops" emails are part of the JMail email archive released under EFTA. Their discovery by community researchers — rather than by DOJ prosecutors — illustrates both the volume of material in the release and the limitations of official document review.`,
      },
      {
        themeId: 'community-research-tools',
        strength: 2,
        bridge: `The "whoops" email chain was surfaced by community researchers using JMail.world, not by official investigators. It exemplifies the community research methodology of systematic keyword and relationship searches through the email archive.`,
      },
    ],
  },

  {
    themeId: 'academic-scientific-network',
    connects: [
      {
        themeId: 'political-intelligence-network',
        strength: 2,
        bridge: `The academic network — MIT Media Lab, Harvard, Rockefeller University — served the same function as the political network: creating a constellation of relationships that provided social legitimacy and insulated Epstein from scrutiny. The donations to academic institutions followed the same pattern as political hospitality: money in exchange for access and credibility.`,
      },
      {
        themeId: 'financial-crimes',
        strength: 1,
        bridge: `Epstein's donations to academic institutions — including a $6.5 million gift to Harvard — were made through the same charitable entities analyzed in the financial crimes theme. Some researchers have examined whether these donations served an additional function in the financial architecture.`,
      },
    ],
  },
];

// Convenience lookup: given a themeId, return all themes it connects to
export function getConnections(themeId: string): ThemeBridge[] {
  return themeConnections.find((t) => t.themeId === themeId)?.connects ?? [];
}

// Build the full bidirectional connection map for the relationship diagram
export function getAllConnectionPairs(): Array<{
  sourceId: string;
  targetId: string;
  strength: 1 | 2 | 3;
}> {
  const pairs: Array<{ sourceId: string; targetId: string; strength: 1 | 2 | 3 }> = [];
  const seen = new Set<string>();
  for (const entry of themeConnections) {
    for (const conn of entry.connects) {
      const key = [entry.themeId, conn.themeId].sort().join('|');
      if (!seen.has(key)) {
        seen.add(key);
        pairs.push({
          sourceId: entry.themeId,
          targetId: conn.themeId,
          strength: conn.strength,
        });
      }
    }
  }
  return pairs;
}
```

---

## Phase 2: Create `ThemeConnectsTo.tsx`

This component renders the "Connects to" section at the bottom of an expanded theme.
It takes the current theme's ID, looks up its connections, and renders each bridge with
a quick-jump link.

```typescript
// src/components/themes/ThemeConnectsTo.tsx
import Link from 'next/link';
import { ArrowRight, Link2 } from 'lucide-react';
import { getConnections } from '@/data/theme-connections';
import type { ThemeSection } from '@/types';
import themesData from '@/data/themes.json';

const themes = themesData as ThemeSection[];

interface Props {
  themeId: string;
}

const STRENGTH_LABEL: Record<number, string> = {
  3: 'Directly linked',
  2: 'Significantly connected',
  1: 'Tangentially related',
};

const STRENGTH_ACCENT: Record<number, string> = {
  3: 'border-l-red-700/70',
  2: 'border-l-blue-700/70',
  1: 'border-l-surface-border',
};

export default function ThemeConnectsTo({ themeId }: Props) {
  const connections = getConnections(themeId);
  if (connections.length === 0) return null;

  // Filter to only connections where target theme actually exists in themes.json
  const valid = connections.filter((c) => themes.some((t) => t.id === c.themeId));
  if (valid.length === 0) return null;

  // Sort by strength descending
  const sorted = [...valid].sort((a, b) => b.strength - a.strength);

  return (
    <div
      className="mt-6 pt-6 border-t border-surface-border"
      aria-label="Connected investigation threads"
    >
      <div className="flex items-center gap-2 mb-4">
        <Link2 size={13} className="text-text-muted shrink-0" aria-hidden />
        <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
          Connects to {sorted.length} other thread{sorted.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {sorted.map((conn) => {
          const target = themes.find((t) => t.id === conn.themeId);
          if (!target) return null;

          return (
            <div
              key={conn.themeId}
              className={`border-l-2 pl-4 py-1 ${STRENGTH_ACCENT[conn.strength]}`}
            >
              <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                    {STRENGTH_LABEL[conn.strength]}
                  </span>
                  <span className="text-[10px] text-text-muted">·</span>
                  <span className="text-xs font-mono text-text-muted">
                    §{target.sectionNumber}
                  </span>
                </div>
                <a
                  href={`#${conn.themeId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(conn.themeId);
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-1 text-xs text-accent-blue
                             hover:text-accent-blueHover transition-colors shrink-0"
                  aria-label={`Jump to ${target.title}`}
                >
                  {target.title}
                  <ArrowRight size={10} aria-hidden />
                </a>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {conn.bridge}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

## Phase 3: Create `ThemeRelationMap.tsx`

A static SVG diagram showing the 17 themes as nodes with connecting edges.
Positioned at the top of the themes page above the accordion list.
Clicking a node scrolls to that theme section.

This component does NOT use D3 — it uses a pre-computed layout with hardcoded
SVG coordinates. This is intentional: unlike the graph page which needs dynamic
force layout for variable data, the theme relationship map has a fixed set of 17
nodes and can be laid out statically for maximum rendering predictability.

```typescript
// src/components/themes/ThemeRelationMap.tsx
'use client';

import { useState } from 'react';
import { getAllConnectionPairs } from '@/data/theme-connections';
import type { ThemeSection } from '@/types';
import themesData from '@/data/themes.json';

const themes = themesData as ThemeSection[];
const connectionPairs = getAllConnectionPairs();

// Pre-computed node positions as (x%, y%) fractions of the SVG viewBox.
// Layout groups: operational core (center), legal/institutional (bottom),
// evidence/documents (top right), political/intelligence (left).
// IMPORTANT: keys must match actual theme IDs in themes.json.
// Claude Code: run Phase 0 verification and update keys if slugs differ.
const NODE_POSITIONS: Record<string, { x: number; y: number; short: string }> = {
  // Operational core — center cluster
  'trafficking-operation':          { x: 42, y: 38, short: 'Trafficking' },
  'maxwell-role-legal':             { x: 34, y: 28, short: 'Maxwell' },
  'co-conspirators-immunity':       { x: 52, y: 28, short: 'Immunity' },

  // Legal/institutional — bottom
  'acosta-plea-legal-history':      { x: 34, y: 55, short: 'Plea Deal' },
  'co-conspirators-immunity':       { x: 52, y: 55, short: 'Co-Conspirators' },

  // Financial/intelligence — left arc
  'financial-crimes':               { x: 18, y: 42, short: 'Financial' },
  'intelligence-connections':       { x: 18, y: 28, short: 'Intelligence' },
  'political-intelligence-network': { x: 26, y: 18, short: 'Political Net.' },

  // Political connections — top left  
  'trump-epstein-connections':      { x: 12, y: 55, short: 'Trump–Epstein' },

  // Document/evidence — top right
  'efta-release-framework':         { x: 72, y: 18, short: 'EFTA' },
  'community-research-tools':       { x: 82, y: 32, short: 'Comm. Tools' },
  'whoops-emails':                  { x: 82, y: 48, short: '"Whoops"' },

  // Death/MCC — right center
  'epsteins-death-mcc':             { x: 68, y: 42, short: 'Death / MCC' },

  // International/media — bottom right
  'international-consequences':     { x: 60, y: 65, short: 'International' },
  'media-congressional':            { x: 48, y: 72, short: 'Media / Congress' },

  // Academic/other — top arc
  'academic-scientific-network':    { x: 52, y: 10, short: 'Academic' },

  // Catch-all for any themes not positioned above
};

// Fallback positions for themes not explicitly positioned
const DEFAULT_POSITIONS = [
  { x: 20, y: 72 }, { x: 30, y: 82 }, { x: 70, y: 78 }, { x: 78, y: 65 },
];

const EDGE_COLORS: Record<number, string> = {
  3: '#7f1d1d88',   // dark red, semi-transparent
  2: '#1e3a5f88',   // dark blue
  1: '#1e293b88',   // surface
};

const EDGE_STROKE: Record<number, number> = {
  3: 2,
  2: 1.5,
  1: 1,
};

export default function ThemeRelationMap() {
  const [hoveredThemeId, setHoveredThemeId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  function getPos(themeId: string, idx: number) {
    return NODE_POSITIONS[themeId] ?? DEFAULT_POSITIONS[idx % DEFAULT_POSITIONS.length];
  }

  function scrollToTheme(themeId: string) {
    const el = document.getElementById(themeId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // Only render connections that involve themes that exist in NODE_POSITIONS
  const validPairs = connectionPairs.filter(
    (p) =>
      (NODE_POSITIONS[p.sourceId] || themes.find((t) => t.id === p.sourceId)) &&
      (NODE_POSITIONS[p.targetId] || themes.find((t) => t.id === p.targetId))
  );

  if (!isExpanded) {
    return (
      <div className="border border-surface-border rounded-lg overflow-hidden mb-6">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm
                     text-text-muted hover:text-text-secondary hover:bg-surface-elevated
                     transition-colors"
          aria-expanded={false}
        >
          <span className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest">
              Theme Relationship Map
            </span>
            <span className="text-xs text-text-muted">
              — {themes.length} threads · {validPairs.length} documented connections
            </span>
          </span>
          <span className="text-xs text-accent-blue">+ Show map</span>
        </button>
      </div>
    );
  }

  const svgW = 900;
  const svgH = 520;

  return (
    <div className="border border-surface-border rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-surface-border bg-surface-card">
        <div>
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
            Theme Relationship Map
          </span>
          <span className="text-xs text-text-muted ml-3">
            Click any node to jump to that section
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          aria-label="Collapse theme map"
        >
          − Collapse
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-2 border-b border-surface-border bg-surface/50">
        {([3, 2, 1] as const).map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <span
              className="inline-block rounded-full"
              style={{
                width: EDGE_STROKE[s] * 16 + 'px',
                height: '2px',
                backgroundColor: EDGE_COLORS[s].slice(0, 7),
                opacity: 0.8,
              }}
            />
            {s === 3 ? 'Direct' : s === 2 ? 'Significant' : 'Tangential'}
          </span>
        ))}
      </div>

      {/* SVG map */}
      <div className="overflow-x-auto bg-surface">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full"
          style={{ minWidth: '480px', maxHeight: '420px' }}
          role="img"
          aria-label="Theme relationship diagram showing connections between 17 investigative threads"
        >
          {/* Edges */}
          <g>
            {validPairs.map((pair, i) => {
              const srcIdx = themes.findIndex((t) => t.id === pair.sourceId);
              const tgtIdx = themes.findIndex((t) => t.id === pair.targetId);
              const src = getPos(pair.sourceId, srcIdx);
              const tgt = getPos(pair.targetId, tgtIdx);
              const x1 = (src.x / 100) * svgW;
              const y1 = (src.y / 100) * svgH;
              const x2 = (tgt.x / 100) * svgW;
              const y2 = (tgt.y / 100) * svgH;

              // Highlight edges connected to hovered node
              const isHighlighted =
                hoveredThemeId === pair.sourceId || hoveredThemeId === pair.targetId;

              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={EDGE_COLORS[pair.strength]}
                  strokeWidth={isHighlighted ? EDGE_STROKE[pair.strength] * 2 : EDGE_STROKE[pair.strength]}
                  strokeOpacity={
                    hoveredThemeId === null ? 0.6
                    : isHighlighted ? 1
                    : 0.08
                  }
                  style={{ transition: 'stroke-opacity 0.15s, stroke-width 0.15s' }}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {themes.map((theme, idx) => {
              const pos = getPos(theme.id, idx);
              const cx = (pos.x / 100) * svgW;
              const cy = (pos.y / 100) * svgH;
              const label = NODE_POSITIONS[theme.id]?.short ?? theme.title.split(' ')[0];
              const isHovered = hoveredThemeId === theme.id;
              const isDimmed = hoveredThemeId !== null && !isHovered &&
                !validPairs.some(
                  (p) =>
                    (p.sourceId === hoveredThemeId && p.targetId === theme.id) ||
                    (p.targetId === hoveredThemeId && p.sourceId === theme.id)
                );

              return (
                <g
                  key={theme.id}
                  transform={`translate(${cx},${cy})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredThemeId(theme.id)}
                  onMouseLeave={() => setHoveredThemeId(null)}
                  onClick={() => scrollToTheme(theme.id)}
                  role="button"
                  aria-label={`Jump to ${theme.title}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      scrollToTheme(theme.id);
                    }
                  }}
                >
                  {/* Node circle */}
                  <circle
                    r={isHovered ? 9 : 7}
                    fill={isHovered ? '#3b82f6' : '#1e293b'}
                    stroke={isHovered ? '#3b82f6' : '#334155'}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={isDimmed ? 0.15 : 1}
                    style={{ transition: 'r 0.15s, opacity 0.15s, fill 0.15s' }}
                  />

                  {/* Section number inside circle */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="7"
                    fontFamily="monospace"
                    fill={isHovered ? '#fff' : '#94a3b8'}
                    opacity={isDimmed ? 0.15 : 1}
                    style={{ pointerEvents: 'none', transition: 'opacity 0.15s' }}
                  >
                    {theme.sectionNumber}
                  </text>

                  {/* Label below node */}
                  <text
                    y={16}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="monospace"
                    fill={isHovered ? '#e2e8f0' : '#64748b'}
                    opacity={isDimmed ? 0.1 : 1}
                    style={{ pointerEvents: 'none', transition: 'opacity 0.15s, fill 0.15s' }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
```

---

## Phase 4: Update `ThemeSectionItem` in `src/app/themes/page.tsx`

The `ThemeSectionItem` component currently renders a summary, tag pills, an expand toggle,
and the full markdown content when expanded. It also shows mentioned people and source tags.

Make **two targeted additions** to the expanded content section:

### Step 4a: Import the new component at the top of the file

```typescript
// Add to existing imports in src/app/themes/page.tsx:
import ThemeConnectsTo from '@/components/themes/ThemeConnectsTo';
```

### Step 4b: Add `ThemeConnectsTo` at the end of the expanded content

Find the section inside `ThemeSectionItem` that renders when `expanded` is true.
It currently ends with the source tags section. After the source tags section (inside
the expanded conditional block, before its closing `</div>`), add:

```tsx
{/* Cross-theme connections — only shown when expanded */}
<ThemeConnectsTo themeId={theme.id} />
```

The expanded block should now end with something like:

```tsx
{expanded && (
  <div className="px-5 py-4 border-t border-surface-border">
    {/* ... existing: full markdown content, people chips, source tags ... */}
    
    {/* ADD at the end: */}
    <ThemeConnectsTo themeId={theme.id} />
  </div>
)}
```

---

## Phase 5: Add `ThemeRelationMap` to the themes page

In `src/app/themes/page.tsx`, locate the `ThemesPage` component. Find the section
header block (the `<div className="mb-6">` with the h1 and count):

```tsx
<div className="mb-6">
  <h1 className="text-2xl font-semibold text-text-primary mb-1">Themes</h1>
  <p className="text-sm text-text-secondary">
    {themes.length} investigative threads across the Epstein files
  </p>
</div>
```

After this block and **before** the `<div className="flex gap-8">` that contains the
sidebar and main content, insert:

```tsx
{/* Theme relationship map — collapsed by default, expandable */}
<ThemeRelationMap />
```

Also add the import at the top of the file:

```typescript
import ThemeRelationMap from '@/components/themes/ThemeRelationMap';
```

---

## Phase 6: Sidebar Enhancement — Connection Counts

The existing sidebar shows theme titles as nav links. Add a subtle connection count
indicator to each theme in the sidebar so users can see at a glance which themes
are most connected to others.

Find the existing sidebar button rendering inside `ThemesPage`:

```tsx
{themes.map((theme) => (
  <button
    key={theme.id}
    onClick={() => scrollToTheme(theme.id)}
    ...
  >
    <span className="font-mono mr-1.5">{theme.sectionNumber}.</span>
    {theme.title}
  </button>
))}
```

Update the import at the top of the file to also import `getConnections`:

```typescript
import { getConnections } from '@/data/theme-connections';
```

Then update the button content to show a connection count dot:

```tsx
{themes.map((theme) => {
  const connCount = getConnections(theme.id).length;
  return (
    <button
      key={theme.id}
      onClick={() => scrollToTheme(theme.id)}
      className={`w-full text-left text-xs px-3 py-2 rounded transition-colors flex
                  items-center justify-between gap-1
                  ${activeId === theme.id
                    ? 'text-accent-blue bg-accent-blue/10'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-elevated'
                  }`}
    >
      <span className="flex items-center min-w-0">
        <span className="font-mono mr-1.5 shrink-0">{theme.sectionNumber}.</span>
        <span className="truncate">{theme.title}</span>
      </span>
      {connCount > 0 && (
        <span
          className="shrink-0 text-[10px] text-text-muted px-1.5 py-0.5
                     rounded-full border border-surface-border ml-1"
          title={`${connCount} connected threads`}
          aria-label={`${connCount} connections`}
        >
          {connCount}
        </span>
      )}
    </button>
  );
})}
```

---

## Phase 7: TypeScript — No Changes Required

The `ThemeSection` interface in `src/types/index.ts` does not need new fields.
The bridge data lives in `src/data/theme-connections.ts` as a supplemental static
file, exactly as `people-roles.ts` does for person operational descriptions.
No parse script changes are needed.

Verify `src/types/index.ts` exports `ThemeSection` with at least these fields
(all should already exist):
- `id: string`
- `title: string`
- `sectionNumber: number`
- `summary: string`
- `content: string`
- `peopleIds: string[]`
- `timelineEventIds: string[]`
- `tags: string[]`

---

## Phase 8: Build Verification

**Step 1:** TypeScript check:
```bash
npx tsc --noEmit
```
Fix any errors. Common issues:
- `ThemeBridge` and `ThemeConnectionEntry` might need to be exported from `theme-connections.ts`
  if TypeScript complains about type resolution.
- `getAllConnectionPairs` return type might need explicit annotation.

**Step 2:** Build:
```bash
npm run build
```

**Step 3:** Dev server verification — navigate to `/themes/`:

**Theme Relation Map:**
- [ ] Map renders as a collapsed "show map" button by default
- [ ] Clicking "Show map" expands the SVG diagram
- [ ] All 17 (or however many) themes appear as labeled nodes
- [ ] Section numbers are visible inside each node
- [ ] Edge lines connect related themes with varying thickness
- [ ] Hovering a node fades unrelated nodes and highlights connected edges
- [ ] Clicking a node scrolls to that theme section
- [ ] Keyboard navigation works (Tab to node, Enter to scroll)
- [ ] "Collapse" button hides the map
- [ ] Legend shows three connection strength levels

**Cross-theme bridges:**
- [ ] Expanding any theme with connections shows "Connects to N other threads" section
- [ ] Each connection shows strength label (Directly linked / Significantly connected / Tangentially related)
- [ ] Bridge prose renders correctly
- [ ] "Jump to [theme name]" link scrolls to the correct theme section
- [ ] Themes without connections in `theme-connections.ts` don't show the section
- [ ] Connection IDs that don't exist in themes.json are gracefully filtered out

**Sidebar:**
- [ ] Connection count pills appear next to themes that have connections
- [ ] Themes with 0 connections show no pill
- [ ] Pill count matches the number of entries in `getConnections(theme.id)`
- [ ] Active state still highlights correctly when scrolled to a theme

**No regressions:**
- [ ] All existing theme sections still expand/collapse correctly
- [ ] People chips still render when expanded
- [ ] Source tags still render
- [ ] Markdown content still renders correctly
- [ ] Sidebar scroll-to navigation still works
- [ ] Mobile dropdown still works
- [ ] `npm run build` produces no TypeScript errors

---

## Files Created / Modified Summary

| Action | File |
|--------|------|
| **CREATE** | `src/data/theme-connections.ts` |
| **CREATE** | `src/components/themes/ThemeConnectsTo.tsx` |
| **CREATE** | `src/components/themes/ThemeRelationMap.tsx` |
| **MODIFY** | `src/app/themes/page.tsx` — add ThemeRelationMap above accordion, ThemeConnectsTo inside expanded sections, connection counts in sidebar |

---

## Design Notes for Claude Code

**Theme ID verification is mandatory.** The `theme-connections.ts` file uses theme IDs
that follow expected slugification patterns. Before rendering, the `ThemeConnectsTo`
component filters to only connections where the target theme ID exists in `themes.json`.
This means phantom IDs fail silently rather than causing errors — but it also means
bridge text for non-matching IDs will simply not appear. Run the Phase 0 verification
command and update IDs as needed.

**The SVG map uses hardcoded positions.** `NODE_POSITIONS` maps theme IDs to `(x%, y%)`
coordinates. Themes not explicitly listed fall back to `DEFAULT_POSITIONS`. If the actual
theme IDs don't match the keys in `NODE_POSITIONS`, those nodes will fall back to default
positions clustered in one area. After running Phase 0 verification, update the
`NODE_POSITIONS` keys to match the actual IDs.

**`ThemeRelationMap` is collapsed by default.** The map is complex and takes up vertical
space. Hiding it behind a single click ensures the themes page doesn't feel front-loaded
for users who just want to browse. The count metadata ("17 threads · 28 connections") in
the collapsed state gives users enough information to decide whether to open it.

**The `ThemeConnectsTo` scroll handler.** The `onClick` on each "jump" link uses a
`scrollTo` call rather than a simple anchor `href`. This is because the theme sections
are identified by ID on the container element, and native anchor behavior doesn't account
for the sticky navbar offset. The same scroll offset (80px) used in `scrollToTheme` in
`ThemesPage` should be used in `ThemeConnectsTo` for consistency.
