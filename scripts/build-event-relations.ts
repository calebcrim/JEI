/**
 * build-event-relations.ts
 * Reads timeline.json and themes.json, computes relatedEventIds and relatedThemeIds,
 * then writes the enriched data back to timeline.json.
 */

import fs from 'fs';
import path from 'path';

interface TimelineEvent {
  id: string;
  date: string;
  peopleIds: string[];
  tags: string[];
  relatedEventIds?: string[];
  relatedThemeIds?: string[];
  [key: string]: unknown;
}

interface ThemeSection {
  id: string;
  title: string;
  peopleIds: string[];
  tags: string[];
  [key: string]: unknown;
}

// ─── Related Events ─────────────────────────────────────────────────────────

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
        continue;
      }

      // Signal 2: temporal proximity + shared tags
      const sharedTags = a.tags.filter(t => b.tags.includes(t));
      if (sharedTags.length >= 1 && daysBetween(a.date, b.date) <= 30) {
        relations.get(a.id)!.add(b.id);
        relations.get(b.id)!.add(a.id);
      }
    }
  }

  // Cap at 8 related events per event, scored by relevance
  const result = new Map<string, string[]>();
  for (const [id, related] of relations) {
    const event = events.find(e => e.id === id)!;
    const scored = [...related].map(relId => {
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

// ─── Related Themes ─────────────────────────────────────────────────────────

// Map event tags to theme IDs (based on actual theme IDs in themes.json)
const TAG_TO_THEME: Record<string, string[]> = {
  'trafficking': ['the-trafficking-operation'],
  'financial': ['financial-crimes-money-laundering', 'cross-network-financial-analysis-epstein-as-financial-hub'],
  'legal': ['the-acosta-plea-deal-legal-history', 'the-co-conspirators-immunity-grantees'],
  'political': ['political-intelligence-network', 'trumpepstein-connections'],
  'intelligence': ['intelligence-connections'],
  'death': ['epsteins-death-mcc-anomalies'],
  'flight': [],
  'media': ['media-congressional-investigations'],
};

function computeThemeRelations(events: TimelineEvent[], themes: ThemeSection[]): Map<string, string[]> {
  const result = new Map<string, string[]>();

  for (const event of events) {
    const relatedThemes = new Set<string>();

    // Tag-based matching
    for (const tag of event.tags) {
      const themeIds = TAG_TO_THEME[tag] || [];
      themeIds.forEach(t => relatedThemes.add(t));
    }

    // People-based matching: if event shares people with a theme
    for (const theme of themes) {
      if (theme.peopleIds && event.peopleIds.some(p => theme.peopleIds.includes(p))) {
        relatedThemes.add(theme.id);
      }
    }

    result.set(event.id, [...relatedThemes]);
  }

  return result;
}

// ─── Main ───────────────────────────────────────────────────────────────────

const dataDir = path.join(process.cwd(), 'src', 'data');
const timelinePath = path.join(dataDir, 'timeline.json');
const themesPath = path.join(dataDir, 'themes.json');

const events: TimelineEvent[] = JSON.parse(fs.readFileSync(timelinePath, 'utf-8'));
const themes: ThemeSection[] = JSON.parse(fs.readFileSync(themesPath, 'utf-8'));

// Compute event-to-event relations
const eventRelations = computeRelations(events);

// Compute event-to-theme relations
const themeRelations = computeThemeRelations(events, themes);

// Merge back into timeline data
let eventsWithRelations = 0;
let eventsWithThemes = 0;
for (const event of events) {
  const related = eventRelations.get(event.id) || [];
  const relatedThemes = themeRelations.get(event.id) || [];
  event.relatedEventIds = related;
  event.relatedThemeIds = relatedThemes;
  if (related.length > 0) eventsWithRelations++;
  if (relatedThemes.length > 0) eventsWithThemes++;
}

fs.writeFileSync(timelinePath, JSON.stringify(events, null, 2));

console.log(`\n✓ Computed event relations:`);
console.log(`  Events with related events: ${eventsWithRelations}/${events.length}`);
console.log(`  Events with related themes: ${eventsWithThemes}/${events.length}`);
console.log(`✓ Written enriched timeline to ${timelinePath}\n`);
