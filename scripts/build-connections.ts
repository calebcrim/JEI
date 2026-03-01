/**
 * build-connections.ts
 * Reads all three parsed JSON files → produces connections.json
 * Also performs the cross-reference pass to populate *Ids arrays
 */

import fs from 'fs';
import path from 'path';

type VerificationStatus = 'verified' | 'unverified' | 'contested' | 'discrepancy';
type SourceTag =
  | 'CBS' | 'NPR' | 'WSJ' | 'NYT' | 'CNN' | 'Bloomberg' | 'AP'
  | 'DOJ' | 'FBI' | 'HO' | 'SJ' | 'JMail' | 'GH' | 'OSINT'
  | 'Maxwell-trial' | 'Giuffre-deposition' | 'Palm-Beach-PD';

type RelationshipType =
  | 'co-conspirator' | 'employer-employee' | 'financial' | 'social'
  | 'flew-together' | 'legal-representation' | 'intelligence' | 'academic'
  | 'victim-perpetrator';

interface Connection {
  id: string;
  sourcePersonId: string;
  targetPersonId: string;
  relationshipType: RelationshipType;
  strength: 1 | 2 | 3;
  description: string;
  sources: SourceTag[];
  verificationStatus: VerificationStatus;
}

interface Person {
  id: string;
  name: string;
  category: string;
  summary: string;
  sections: Array<{ title: string; content: string; sources: string[] }>;
  timelineEventIds: string[];
  themeIds: string[];
  connectionIds: string[];
  sources: string[];
  [key: string]: unknown;
}

interface TimelineEvent {
  id: string;
  date: string;
  era: string;
  title: string;
  body: string;
  peopleIds: string[];
  themeIds: string[];
  [key: string]: unknown;
}

interface ThemeSection {
  id: string;
  title: string;
  content: string;
  summary: string;
  peopleIds: string[];
  timelineEventIds: string[];
  [key: string]: unknown;
}

// ─── Load data ─────────────────────────────────────────────────────────────
const dataDir = path.join(process.cwd(), 'src', 'data');

const people: Person[] = JSON.parse(
  fs.readFileSync(path.join(dataDir, 'people.json'), 'utf-8')
);
const events: TimelineEvent[] = JSON.parse(
  fs.readFileSync(path.join(dataDir, 'timeline.json'), 'utf-8')
);
const themes: ThemeSection[] = JSON.parse(
  fs.readFileSync(path.join(dataDir, 'themes.json'), 'utf-8')
);

const manualConnections: Connection[] = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), 'scripts', 'connections-manual.json'),
    'utf-8'
  )
);

// ─── Slugify (must match parse-people.ts) ──────────────────────────────────
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ─── Find person ID by name (fuzzy) ────────────────────────────────────────
function findPersonId(name: string): string | null {
  const slug = slugify(name);
  // Exact ID match
  const exact = people.find((p) => p.id === slug);
  if (exact) return exact.id;
  // Partial slug match (name starts-with)
  const partial = people.find(
    (p) => p.id.startsWith(slug.split('-').slice(0, 2).join('-'))
  );
  if (partial) return partial.id;
  // Name contains first name + last name
  const [first, ...rest] = name.toLowerCase().split(' ');
  const lastName = rest.join(' ');
  if (lastName) {
    const byName = people.find(
      (p) => p.name.toLowerCase().includes(first) && p.name.toLowerCase().includes(lastName)
    );
    if (byName) return byName.id;
  }
  return null;
}

// ─── Relationship type inference ────────────────────────────────────────────
function inferRelationshipType(text: string): RelationshipType {
  const t = text.toLowerCase();
  if (/co-conspirator|convicted|charged|npa|sex traffick/.test(t)) return 'co-conspirator';
  if (/attorney|lawyer|legal represent|counsel/.test(t)) return 'legal-representation';
  if (/money manager|accountant|wire transfer|paid|financial advisor|advisor fee/.test(t)) return 'financial';
  if (/flew together|flight leg|passenger|on board/.test(t)) return 'flew-together';
  if (/employer|hired|staff|assistant|employee|executive/.test(t)) return 'employer-employee';
  if (/mossad|intelligence|cia|spy|agent|mi6/.test(t)) return 'intelligence';
  if (/professor|research|academic|donation to university|scientific/.test(t)) return 'academic';
  if (/victim|assaulted|abused|trafficked/.test(t)) return 'victim-perpetrator';
  return 'social';
}

// ─── Method A: Flight co-occurrence from person sections ──────────────────
function deriveFlightConnections(): Connection[] {
  const connections: Connection[] = [];

  for (const person of people) {
    const allText = person.sections.map((s) => s.content).join(' ');

    // Pattern: "X and Y flew together N times"
    const flyMatches = allText.matchAll(
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+and\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+flew\s+together\s+approximately\s+(\d+)/g
    );
    for (const m of flyMatches) {
      const id1 = findPersonId(m[1]);
      const id2 = findPersonId(m[2]);
      if (id1 && id2 && id1 !== id2) {
        const count = parseInt(m[3], 10);
        connections.push({
          id: `flight-${id1}-${id2}`,
          sourcePersonId: id1,
          targetPersonId: id2,
          relationshipType: 'flew-together',
          strength: count >= 10 ? 3 : 2,
          description: `Flew together approximately ${m[3]} times.`,
          sources: ['DOJ'],
          verificationStatus: 'verified',
        });
      }
    }

    // Pattern: "X appears on N flight legs" or "N documented flight legs with/together"
    const flightLegsMatch = allText.match(/(\d+)\s+documented flight(?:\s+legs?)?\s+with\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
    if (flightLegsMatch) {
      const count = parseInt(flightLegsMatch[1], 10);
      const targetName = flightLegsMatch[2];
      const id1 = person.id;
      const id2 = findPersonId(targetName);
      if (id2 && id1 !== id2) {
        connections.push({
          id: `flight-${id1}-${id2}-legs`,
          sourcePersonId: id1,
          targetPersonId: id2,
          relationshipType: 'flew-together',
          strength: count >= 20 ? 3 : 2,
          description: `${count} documented flight legs together.`,
          sources: ['DOJ'],
          verificationStatus: 'verified',
        });
      }
    }
  }

  return connections;
}

// ─── Method B: Explicit relationship statements ────────────────────────────
function deriveExplicitConnections(): Connection[] {
  const connections: Connection[] = [];

  const RELATIONSHIP_PATTERNS: Array<{
    pattern: RegExp;
    type: RelationshipType;
    strength: 1 | 2 | 3;
    extractTarget?: () => string;
  }> = [
    { pattern: /Epstein's primary attorney/i, type: 'legal-representation', strength: 3,
      extractTarget: () => 'alan-dershowitz' },
    { pattern: /Epstein's money manager/i, type: 'financial', strength: 3,
      extractTarget: () => 'leslie-wexner-les-wexner' },
    { pattern: /convicted.*Maxwell/i, type: 'co-conspirator', strength: 3,
      extractTarget: () => 'ghislaine-maxwell' },
    { pattern: /power of attorney.*Epstein|Epstein.*power of attorney/i, type: 'financial', strength: 3,
      extractTarget: () => 'jeffrey-epstein' },
  ];

  for (const person of people) {
    const allText = person.sections.map((s) => s.content).join(' ') + ' ' + person.summary;

    for (const rp of RELATIONSHIP_PATTERNS) {
      if (rp.pattern.test(allText)) {
        const targetId = rp.extractTarget ? rp.extractTarget() : null;
        if (targetId && targetId !== person.id && people.find((p) => p.id === targetId)) {
          connections.push({
            id: `explicit-${person.id}-${targetId}-${rp.type}`,
            sourcePersonId: person.id,
            targetPersonId: targetId,
            relationshipType: rp.type,
            strength: rp.strength,
            description: `Documented ${rp.type} relationship.`,
            sources: person.sources as SourceTag[],
            verificationStatus: 'verified',
          });
        }
      }
    }
  }

  return connections;
}

// ─── Method C: Timeline co-occurrence (3+ shared events = strength 1) ──────
function deriveTimelineCooccurrences(): Connection[] {
  // Build a map: personId → Set of event IDs
  const personEvents: Map<string, Set<string>> = new Map();

  for (const event of events) {
    for (const pid of event.peopleIds) {
      const found = people.find((p) => p.id === pid || p.id.startsWith(pid.split('-').slice(0, 2).join('-')));
      if (!found) continue;
      if (!personEvents.has(found.id)) personEvents.set(found.id, new Set());
      personEvents.get(found.id)!.add(event.id);
    }
  }

  const connections: Connection[] = [];
  const personIds = Array.from(personEvents.keys());

  for (let i = 0; i < personIds.length; i++) {
    for (let j = i + 1; j < personIds.length; j++) {
      const a = personIds[i];
      const b = personIds[j];
      const aEvents = personEvents.get(a)!;
      const bEvents = personEvents.get(b)!;

      const shared: string[] = [];
      for (const eid of aEvents) {
        if (bEvents.has(eid)) shared.push(eid);
      }

      if (shared.length >= 2) {
        connections.push({
          id: `cooccur-${a}-${b}`,
          sourcePersonId: a,
          targetPersonId: b,
          relationshipType: 'social',
          strength: shared.length >= 6 ? 2 : 1,
          description: `Co-appear in ${shared.length} documented events.`,
          sources: ['DOJ'],
          verificationStatus: 'verified',
        });
      }
    }
  }

  return connections;
}

// ─── Method D: Financial connections ──────────────────────────────────────
function deriveFinancialConnections(): Connection[] {
  const connections: Connection[] = [];

  for (const person of people) {
    const allText = person.sections.map((s) => s.content).join(' ');

    // Wire transfer patterns: "$X million from A to B"
    const wireMatches = allText.matchAll(
      /\$[\d.,]+\s+(?:million|billion)?\s+(?:moved|transferred|wire[d]?)\s+from\s+([A-Z][a-z]+(?:'s)?(?:\s+[A-Za-z]+)?)\s+(?:account|funds)?\s+to\s+([A-Z][a-z]+(?:'s)?(?:\s+[A-Za-z]+)?)/gi
    );

    for (const m of wireMatches) {
      const srcId = findPersonId(m[1].replace(/'s$/, ''));
      const tgtId = findPersonId(m[2].replace(/'s$/, ''));
      if (srcId && tgtId && srcId !== tgtId) {
        connections.push({
          id: `financial-wire-${srcId}-${tgtId}`,
          sourcePersonId: srcId,
          targetPersonId: tgtId,
          relationshipType: 'financial',
          strength: 3,
          description: `Documented wire transfer between accounts.`,
          sources: ['DOJ'],
          verificationStatus: 'verified',
        });
      }
    }
  }

  return connections;
}

// ─── Method E: Name mentions in person profiles ────────────────────────────
// For every pair where person A's profile explicitly mentions person B's name,
// create a connection. Only do this for non-principal people to avoid Epstein
// appearing in every single connection (he's mentioned everywhere).
function deriveProfileMentionConnections(): Connection[] {
  const connections: Connection[] = [];

  for (const person of people) {
    if (person.category === 'principal') continue; // skip Epstein — he's in everyone's profile

    const allText = [
      person.summary,
      ...person.sections.map((s) => `${s.title} ${s.content}`),
    ].join(' ');

    for (const other of people) {
      if (other.id === person.id) continue;
      if (other.category === 'principal') continue; // skip Epstein as target too

      // Check if other person's name appears in this person's profile
      const [first, ...rest] = other.name.split(' ');
      const last = rest.join(' ');
      if (!first || !last) continue;
      if (first.length < 3 || last.length < 2) continue;

      if (allText.includes(other.name) || (allText.includes(first) && allText.includes(last))) {
        const relType = inferRelationshipType(allText);
        connections.push({
          id: `mention-${person.id}-${other.id}`,
          sourcePersonId: person.id,
          targetPersonId: other.id,
          relationshipType: relType,
          strength: 1,
          description: `${other.name} mentioned in ${person.name}'s documented profile.`,
          sources: person.sources.slice(0, 2) as SourceTag[],
          verificationStatus: 'verified',
        });
      }
    }
  }

  return connections;
}

// ─── Cross-reference pass ──────────────────────────────────────────────────
function crossReference(
  people: Person[],
  events: TimelineEvent[],
  themes: ThemeSection[],
  connections: Connection[]
): void {
  console.log('\n  Running cross-reference pass...');

  // 1. Populate person.timelineEventIds
  for (const person of people) {
    person.timelineEventIds = events
      .filter((e) =>
        e.peopleIds.some(
          (pid) =>
            pid === person.id ||
            person.id.startsWith(pid.split('-').slice(0, 2).join('-')) ||
            pid.startsWith(person.id.split('-').slice(0, 2).join('-'))
        )
      )
      .map((e) => e.id);
  }

  // 2. Populate person.themeIds — match by person name in theme content
  for (const person of people) {
    const firstName = person.name.split(' ')[0];
    const lastName = person.name.split(' ').slice(1).join(' ');
    person.themeIds = themes
      .filter((t) => {
        const text = `${t.title} ${t.summary} ${t.content}`;
        return (
          text.includes(person.name) ||
          (firstName.length > 3 && lastName.length > 3 &&
           text.includes(firstName) && text.includes(lastName))
        );
      })
      .map((t) => t.id);
  }

  // 3. Populate person.connectionIds
  for (const person of people) {
    const connected = new Set<string>();
    for (const conn of connections) {
      if (conn.sourcePersonId === person.id) connected.add(conn.targetPersonId);
      if (conn.targetPersonId === person.id) connected.add(conn.sourcePersonId);
    }
    person.connectionIds = Array.from(connected);
  }

  // 4. Populate theme.peopleIds (names appearing in theme content)
  for (const theme of themes) {
    const text = `${theme.title} ${theme.summary} ${theme.content}`;
    theme.peopleIds = people
      .filter((p) => {
        if (text.includes(p.name)) return true;
        const [first, ...rest] = p.name.split(' ');
        const last = rest.join(' ');
        return first.length > 3 && last.length > 3 &&
               text.includes(first) && text.includes(last);
      })
      .map((p) => p.id);
  }

  // 5. Populate event.themeIds
  for (const event of events) {
    event.themeIds = themes
      .filter((t) => {
        const themeText = `${t.title} ${t.content}`;
        return themeText.includes(event.title) || (
          event.peopleIds.some((pid) => t.peopleIds.includes(pid))
        );
      })
      .map((t) => t.id);
  }

  console.log('  ✓ Cross-reference pass complete');
  console.log(`    People with timeline events: ${people.filter((p) => p.timelineEventIds.length > 0).length}`);
  console.log(`    People with theme references: ${people.filter((p) => p.themeIds.length > 0).length}`);
  console.log(`    People with connections: ${people.filter((p) => p.connectionIds.length > 0).length}`);
  console.log(`    Events with theme links: ${events.filter((e) => e.themeIds.length > 0).length}`);
  console.log(`    Themes with people: ${themes.filter((t) => t.peopleIds.length > 0).length}`);
}

// ─── Deduplicate connections ───────────────────────────────────────────────
function deduplicateConnections(connections: Connection[]): Connection[] {
  const seen = new Set<string>();
  return connections.filter((c) => {
    // Normalize edge key (undirected)
    const key = [c.sourcePersonId, c.targetPersonId, c.relationshipType].sort().join('::');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Validate connections ──────────────────────────────────────────────────
function validateConnections(connections: Connection[], people: Person[]): void {
  const personIds = new Set(people.map((p) => p.id));
  const issues: string[] = [];

  // Remove connections where either person doesn't exist
  const valid = connections.filter((c) => {
    if (!personIds.has(c.sourcePersonId)) {
      issues.push(`Unknown sourcePersonId: ${c.sourcePersonId}`);
      return false;
    }
    if (!personIds.has(c.targetPersonId)) {
      issues.push(`Unknown targetPersonId: ${c.targetPersonId}`);
      return false;
    }
    return true;
  });

  if (issues.length > 0) {
    console.warn(`⚠ ${issues.length} connection validation issues (unknown person IDs):`);
    issues.slice(0, 10).forEach((i) => console.warn('  ' + i));
    if (issues.length > 10) console.warn(`  ... and ${issues.length - 10} more`);
  }

  // Filter in place
  connections.length = 0;
  connections.push(...valid);
}

// ─── Run ───────────────────────────────────────────────────────────────────

console.log('\nBuilding connections...');

const autoConnections: Connection[] = [
  ...deriveFlightConnections(),
  ...deriveExplicitConnections(),
  ...deriveTimelineCooccurrences(),
  ...deriveFinancialConnections(),
  ...deriveProfileMentionConnections(),
];

console.log(`  Auto-derived: ${autoConnections.length} connections`);
console.log(`  Manual: ${manualConnections.length} connections`);

const allConnections = deduplicateConnections([...manualConnections, ...autoConnections]);

// Validate against actual person IDs (filter out connections with unknown IDs)
validateConnections(allConnections, people);

console.log(`  After dedup + validation: ${allConnections.length} connections`);

// Cross-reference pass
crossReference(people, events, themes, allConnections);

// Write updated data files (with populated *Ids arrays)
fs.writeFileSync(
  path.join(dataDir, 'people.json'),
  JSON.stringify(people, null, 2)
);
fs.writeFileSync(
  path.join(dataDir, 'timeline.json'),
  JSON.stringify(events, null, 2)
);
fs.writeFileSync(
  path.join(dataDir, 'themes.json'),
  JSON.stringify(themes, null, 2)
);

const connectionsOut = path.join(dataDir, 'connections.json');
fs.writeFileSync(connectionsOut, JSON.stringify(allConnections, null, 2));
console.log(`\n✓ Written ${allConnections.length} connections to ${connectionsOut}`);
console.log('✓ Updated people.json, timeline.json, themes.json with cross-references\n');
