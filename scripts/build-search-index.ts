/**
 * build-search-index.ts
 * Reads all three parsed JSON files → produces search-index.json for Fuse.js
 */

import fs from 'fs';
import path from 'path';
import { investigations } from '../src/data/investigations';

interface SearchIndexEntry {
  type: 'person' | 'event' | 'theme' | 'investigation';
  id: string;
  title: string;
  aliases?: string;
  excerpt: string;
  category?: string;
  date?: string;
  era?: string;
  fullText: string;
  sources: string;
}

interface Person {
  id: string;
  name: string;
  aliases?: string[];
  category: string;
  summary: string;
  sections: Array<{ title: string; content: string }>;
  sources: string[];
  [key: string]: unknown;
}

interface TimelineEvent {
  id: string;
  title: string;
  body: string;
  summary?: string;
  dateDisplay: string;
  era: string;
  sources: string[];
  [key: string]: unknown;
}

interface ThemeSection {
  id: string;
  title: string;
  summary: string;
  content: string;
  sources: string[];
  [key: string]: unknown;
}

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

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
}

// Strip markdown formatting for fullText search
function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/\|[^\n]+\|/g, ' ')
    .replace(/\n{2,}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const index: SearchIndexEntry[] = [
  // People
  ...people.map((p) => ({
    type: 'person' as const,
    id: p.id,
    title: p.name,
    aliases: p.aliases?.join(' ') ?? '',
    excerpt: truncate(stripMarkdown(p.summary), 200),
    category: p.category,
    fullText: stripMarkdown(
      [p.name, p.summary, ...p.sections.map((s) => `${s.title} ${s.content}`)].join(' ')
    ),
    sources: p.sources.join(' '),
  })),

  // Timeline events
  ...events.map((e) => ({
    type: 'event' as const,
    id: e.id,
    title: e.title,
    excerpt: truncate(stripMarkdown(e.summary || e.body), 200),
    date: e.dateDisplay,
    era: e.era,
    fullText: stripMarkdown(`${e.title} ${e.body}`),
    sources: e.sources.join(' '),
  })),

  // Themes
  ...themes.map((t) => ({
    type: 'theme' as const,
    id: t.id,
    title: t.title,
    excerpt: truncate(stripMarkdown(t.summary), 200),
    fullText: stripMarkdown(`${t.title} ${t.summary} ${t.content}`),
    sources: t.sources.join(' '),
  })),

  // Investigations
  ...investigations.map((ch) => ({
    type: 'investigation' as const,
    id: ch.id,
    title: ch.title,
    excerpt: ch.subtitle,
    category: `Chapter ${ch.chapterNumber}`,
    fullText: `${ch.title} ${ch.subtitle} ${ch.bodyParagraphs.join(' ')}`,
    sources: '',
  })),
];

const outPath = path.join(dataDir, 'search-index.json');
fs.writeFileSync(outPath, JSON.stringify(index, null, 2));

console.log(`\n✓ Search index built:`);
console.log(`  People: ${people.length}`);
console.log(`  Events: ${events.length}`);
console.log(`  Themes: ${themes.length}`);
console.log(`  Investigations: ${investigations.length}`);
console.log(`  Total entries: ${index.length}`);

const fileSize = Math.round(fs.statSync(outPath).size / 1024);
console.log(`  File size: ${fileSize} KB`);
console.log(`✓ Written to ${outPath}\n`);
