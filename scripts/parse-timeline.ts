/**
 * parse-timeline.ts
 * Converts source-data/epstein_master_timeline.md → src/data/timeline.json
 */

import fs from 'fs';
import path from 'path';
import { eftaToUrl } from './efta-dataset-map';

type TimelineEra =
  | 'pre-1990' | '1990-2000' | '2001-2007' | '2008-2018' | '2019' | '2020-present';

type VerificationStatus = 'verified' | 'unverified' | 'contested' | 'discrepancy';

type SourceTag =
  | 'CBS' | 'NPR' | 'WSJ' | 'NYT' | 'CNN' | 'Bloomberg' | 'AP'
  | 'DOJ' | 'FBI' | 'HO' | 'SJ' | 'JMail' | 'GH' | 'OSINT'
  | 'Maxwell-trial' | 'Giuffre-deposition' | 'Palm-Beach-PD';

interface TimelineEvent {
  id: string;
  date: string;
  dateDisplay: string;
  era: TimelineEra;
  title: string;
  body: string;
  peopleIds: string[];
  themeIds: string[];
  sources: SourceTag[];
  efta?: string[];
  verificationStatus?: VerificationStatus;
  tags: string[];
  summary: string;
  eftaLinks: Array<{ number: string; url: string; description?: string }>;
  relatedEventIds: string[];
  relatedThemeIds: string[];
  discrepancies: Array<{ sourceA: string; sourceB: string; claimA: string; claimB: string }>;
}

// ─── Era mapping ───────────────────────────────────────────────────────────
function eraFromHeading(h2Text: string): TimelineEra {
  const t = h2Text.toLowerCase();
  if (t.includes('era 1') || t.includes('before 1990') || t.includes('pre-history')) return 'pre-1990';
  if (t.includes('era 2') || t.includes('1990') || t.includes('building the machine')) return '1990-2000';
  if (t.includes('era 3') || t.includes('2003') || t.includes('plea deal') || t.includes('investigation')) return '2001-2007';
  if (t.includes('era 4') || t.includes('2009') || t.includes('post-conviction')) return '2008-2018';
  if (t.includes('era 5') || t.includes('second arrest') || t.includes('2019')) return '2019';
  if (t.includes('era 6') || t.includes('efta') || t.includes('2025') || t.includes('2026')) return '2020-present';
  return 'pre-1990';
}

// ─── Source tag extraction ─────────────────────────────────────────────────
const VALID_SOURCES = new Set<SourceTag>([
  'CBS', 'NPR', 'WSJ', 'NYT', 'CNN', 'Bloomberg', 'AP',
  'DOJ', 'FBI', 'HO', 'SJ', 'JMail', 'GH', 'OSINT',
  'Maxwell-trial', 'Giuffre-deposition', 'Palm-Beach-PD',
]);

const SOURCE_FILE_MAP: Record<string, SourceTag> = {
  'epstein_themes_synthesis.md': 'DOJ',
  'epstein_research.html': 'DOJ',
  'epstein_deep_research.html': 'DOJ',
  'CBS News': 'CBS',
  'CBS news': 'CBS',
  'NPR': 'NPR',
  'WSJ': 'WSJ',
  'NYT': 'NYT',
  'CNN': 'CNN',
  'Bloomberg': 'Bloomberg',
  'DOJ Files supplement': 'DOJ',
  'DOJ Files': 'DOJ',
  'OSINT Database': 'OSINT',
  'JMail': 'JMail',
  'rhowardstone': 'GH',
  'GitHub': 'GH',
  'House Oversight': 'HO',
  'Maxwell trial': 'Maxwell-trial',
  'Palm Beach Police': 'Palm-Beach-PD',
};

function extractSources(text: string): SourceTag[] {
  const found = new Set<SourceTag>();

  // Inline [TAG] patterns
  for (const m of text.matchAll(/\[([A-Za-z\-,\s]+?)\]/g)) {
    for (const p of m[1].split(/[,\s]+/)) {
      const t = p.trim();
      if (VALID_SOURCES.has(t as SourceTag)) found.add(t as SourceTag);
    }
  }

  // **Source:** line
  const sourceLine = text.match(/\*\*Source:\*\*\s*(.+)/);
  if (sourceLine) {
    const line = sourceLine[1];
    for (const [key, tag] of Object.entries(SOURCE_FILE_MAP)) {
      if (line.includes(key)) found.add(tag);
    }
    // Also check for direct tag names
    for (const part of line.split(/[,;]/)) {
      const t = part.trim();
      if (VALID_SOURCES.has(t as SourceTag)) found.add(t as SourceTag);
    }
  }

  if (found.size === 0) found.add('DOJ'); // default
  return Array.from(found);
}

// ─── EFTA extraction ───────────────────────────────────────────────────────
function extractEFTA(text: string): string[] {
  const m = text.match(/EFTA\d{8}/g);
  return m ? [...new Set(m)] : [];
}

// ─── Date parsing ──────────────────────────────────────────────────────────
const MONTH_ABBREVS: Record<string, string> = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

function parseDate(rawDate: string): { iso: string; display: string } {
  const s = rawDate.replace(/^~/, '').trim();

  // Full ISO: 1994-05-15
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return {
      iso: s,
      display: dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
  }

  // Year-month: 2007-09
  if (/^\d{4}-\d{2}$/.test(s)) {
    const [y, m] = s.split('-').map(Number);
    const dt = new Date(y, m - 1);
    const approx = rawDate.startsWith('~');
    return {
      iso: s,
      display: `${approx ? '~' : ''}${dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`,
    };
  }

  // Year only: 1974 or 1994
  if (/^\d{4}$/.test(s)) {
    const approx = rawDate.startsWith('~');
    return { iso: s, display: `${approx ? '~' : ''}${s}` };
  }

  // Year range: 1988–1989 or 2002-2003
  const rangeMatch = s.match(/^(\d{4})[–\-](\d{4}|present)$/);
  if (rangeMatch) {
    return { iso: rangeMatch[1], display: s };
  }

  // Year + season/descriptor: ~Early 2000s, ~circa 1991
  const yearMatch = s.match(/(\d{4})/);
  if (yearMatch) {
    const approx = rawDate.startsWith('~');
    return { iso: yearMatch[1], display: `${approx ? '~' : ''}${s}` };
  }

  // Summer/Fall + year: 2000-summer
  const seasonMatch = rawDate.match(/^(\d{4})-(summer|fall|spring|winter)$/i);
  if (seasonMatch) {
    const seasonMonths: Record<string, string> = {
      spring: '04', summer: '07', fall: '10', winter: '01',
    };
    const month = seasonMonths[seasonMatch[2].toLowerCase()] ?? '01';
    return {
      iso: `${seasonMatch[1]}-${month}`,
      display: `${seasonMatch[2].charAt(0).toUpperCase() + seasonMatch[2].slice(1)} ${seasonMatch[1]}`,
    };
  }

  // Month name + year: March 2010
  const monthYear = s.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const monthNum = MONTH_ABBREVS[monthYear[1].toLowerCase().slice(0, 3)] ?? '01';
    return {
      iso: `${monthYear[2]}-${monthNum}`,
      display: `${monthYear[1]} ${monthYear[2]}`,
    };
  }

  return { iso: 'undated', display: rawDate || 'Undated' };
}

// ─── People name extraction ────────────────────────────────────────────────
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractPeopleIds(peopleLine: string): string[] {
  return peopleLine
    .split(/[,;]/)
    .map((n) => slugify(n.trim().replace(/\(.*?\)/g, '').trim()))
    .filter((id) => id.length > 2);
}

// ─── Tag inference ─────────────────────────────────────────────────────────
function inferTags(title: string, body: string): string[] {
  const text = `${title} ${body}`.toLowerCase();
  const tags: string[] = [];
  if (/\btraffi|recruit|victim|abuse|minor|underage\b/.test(text)) tags.push('trafficking');
  if (/\bfinancial|money|wire|account|bank|million|billion|payment|trust\b/.test(text)) tags.push('financial');
  if (/\blegal|indictment|plea|npa|agreement|charge|conviction|trial|court\b/.test(text)) tags.push('legal');
  if (/\bpolitical|president|senator|congress|govern|election|democrat|republican\b/.test(text)) tags.push('political');
  if (/\bmedia|news|journal|report|press|interview\b/.test(text)) tags.push('media');
  if (/\bdeath|died|dead|suicide|murder|hanging|body\b/.test(text)) tags.push('death');
  if (/\bintelligence|mossad|cia|fbi|spy|agent\b/.test(text)) tags.push('intelligence');
  if (/\bflight|pilot|plane|jet|lolita express|manifest\b/.test(text)) tags.push('flight');
  return [...new Set(tags)];
}

// ─── Discrepancy extraction ─────────────────────────────────────────────────
function extractDiscrepancies(body: string): Array<{
  sourceA: string;
  sourceB: string;
  claimA: string;
  claimB: string;
}> {
  const discrepancies: Array<{sourceA: string; sourceB: string; claimA: string; claimB: string}> = [];

  const discrepancyRegex = /\*?\*?\[DISCREPANCY:?\s*(.+?)\]\*?\*?/gi;
  let match;
  while ((match = discrepancyRegex.exec(body)) !== null) {
    const text = match[1];
    const parts = text.split(/;\s*|\s+vs\.?\s+|\s+but\s+/i);
    if (parts.length >= 2) {
      const sourceMatchA = parts[0].match(/^(.+?)\s+(?:says?|reports?|states?|claims?|gives?)\s+(.+)/i);
      const sourceMatchB = parts[1].match(/^(.+?)\s+(?:says?|reports?|states?|claims?|gives?)\s+(.+)/i);

      discrepancies.push({
        sourceA: sourceMatchA ? sourceMatchA[1].trim() : 'Source A',
        claimA: sourceMatchA ? sourceMatchA[2].trim() : parts[0].trim(),
        sourceB: sourceMatchB ? sourceMatchB[1].trim() : 'Source B',
        claimB: sourceMatchB ? sourceMatchB[2].trim() : parts[1].trim(),
      });
    } else {
      discrepancies.push({
        sourceA: 'Multiple sources',
        claimA: text.trim(),
        sourceB: '',
        claimB: 'See full details above.',
      });
    }
  }

  return discrepancies;
}

// ─── Summary generation ─────────────────────────────────────────────────────
function generateSummary(body: string): string {
  // Strip markdown formatting for cleaner sentence detection
  const plain = body
    .replace(/\*\*People.*?\*\*.*?\n/g, '')
    .replace(/\*\*Source.*?\*\*.*?\n/g, '')
    .replace(/\*\*EFTA.*?\*\*.*?\n/g, '')
    .replace(/\*\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  // Split on sentence boundaries
  const sentences = plain.match(/[^.!?]+[.!?]+(?:\s|$)/g) || [plain];

  // Take first 2-3 sentences, targeting ~150-300 characters
  let summary = '';
  for (let i = 0; i < Math.min(sentences.length, 3); i++) {
    const candidate = summary + sentences[i].trim() + ' ';
    if (i >= 2 && candidate.length > 300) break;
    summary = candidate;
  }

  return summary.trim() || plain.slice(0, 250) + '…';
}

// ─── ID generation ─────────────────────────────────────────────────────────
function makeEventId(date: string, title: string): string {
  const slugTitle = slugify(title).slice(0, 40);
  return `${date.replace(/[^a-z0-9]/g, '-')}-${slugTitle}`.replace(/-+/g, '-');
}

// ─── Main parsing ──────────────────────────────────────────────────────────
function parseTimeline(): TimelineEvent[] {
  const filePath = path.join(process.cwd(), 'source-data', 'epstein_master_timeline.md');
  const raw = fs.readFileSync(filePath, 'utf-8');

  const events: TimelineEvent[] = [];
  const warnings: string[] = [];

  // Stop before appendices
  const mainContent = raw.split(/^## Appendix /m)[0];

  // Split into era blocks
  const eraBlocks = mainContent.split(/(?=^## Era \d+:)/m).filter((b) =>
    /^## Era \d+:/i.test(b.split('\n')[0])
  );

  for (const eraBlock of eraBlocks) {
    const eraLine = eraBlock.split('\n')[0];
    const era = eraFromHeading(eraLine);

    // Split into event entries (H3)
    const eventBlocks = eraBlock.split(/(?=^### )/m).slice(1);

    for (const evBlock of eventBlocks) {
      try {
        const evLines = evBlock.split('\n');
        const h3Line = evLines[0];

        // Format: ### ~DATE — TITLE
        const h3Match = h3Line.match(/^### ([^—]+)\s*—\s*(.+)$/);
        if (!h3Match) {
          warnings.push(`Could not parse H3: ${h3Line}`);
          continue;
        }

        const rawDate = h3Match[1].trim();
        const title = h3Match[2].trim();
        const { iso, display } = parseDate(rawDate);

        const body = evBlock.slice(h3Line.length + 1).trim();

        // Extract **People:** line
        const peopleLine = body.match(/^\*\*People:\*\*\s*(.+)/m);
        const peopleIds = peopleLine ? extractPeopleIds(peopleLine[1]) : [];

        // Extract **Source:** line
        const sourceLine = body.match(/^\*\*Source:\*\*\s*(.+)/m);
        const sourceText = sourceLine ? sourceLine[1] : '';

        // Extract **EFTA Doc:** line
        const eftaLine = body.match(/^\*\*EFTA Doc:\*\*\s*(.+)/m);
        const efta = [
          ...extractEFTA(body),
          ...(eftaLine ? extractEFTA(eftaLine[1]) : []),
        ];

        // Clean body: remove metadata lines
        const cleanBody = body
          .replace(/^\*\*People:\*\*\s*.+\n?/m, '')
          .replace(/^\*\*Source:\*\*\s*.+\n?/m, '')
          .replace(/^\*\*EFTA Doc:\*\*\s*.+\n?/m, '')
          .replace(/\n{3,}/g, '\n\n')
          .trim();

        const sources = extractSources(`${body} ${sourceText}`);

        const verificationStatus: VerificationStatus | undefined =
          body.includes('[UNVERIFIED') ? 'unverified' :
          body.includes('[DISCREPANCY') ? 'discrepancy' :
          body.includes('[CONTESTED') ? 'contested' :
          undefined;

        const tags = inferTags(title, cleanBody);

        const id = makeEventId(iso, title);

        // Generate EFTA links from extracted numbers
        const uniqueEfta = [...new Set(efta)];
        const eftaLinks = uniqueEfta.map(num => {
          const { url, approximate } = eftaToUrl(num);
          return {
            number: num,
            url,
            description: approximate ? '(dataset unconfirmed)' : undefined,
          };
        });

        const event: TimelineEvent = {
          id,
          date: iso,
          dateDisplay: display,
          era,
          title,
          body: cleanBody,
          peopleIds,
          themeIds: [],
          sources,
          tags,
          summary: generateSummary(cleanBody),
          eftaLinks,
          relatedEventIds: [],
          relatedThemeIds: [],
          discrepancies: extractDiscrepancies(body),
        };

        if (verificationStatus) event.verificationStatus = verificationStatus;
        if (efta.length > 0) event.efta = [...new Set(efta)];

        events.push(event);
      } catch (err) {
        warnings.push(`Error parsing event: ${String(err)}`);
      }
    }
  }

  // Also parse Appendix A (undated events) as a table
  const appendixA = raw.match(/## Appendix A: Undated Events[^#]*/);
  if (appendixA) {
    const rows = appendixA[0].split('\n').filter((l) => l.startsWith('|') && !l.includes('Event') && !l.includes('---'));
    for (const row of rows) {
      try {
        const cols = row.split('|').map((c) => c.trim()).filter(Boolean);
        if (cols.length < 2) continue;
        const title = cols[0];
        const peopleText = cols[1] ?? '';
        const sourceText = cols[2] ?? '';

        const id = makeEventId('undated', title);
        const sources = extractSources(`[${sourceText}]`);

        events.push({
          id,
          date: 'undated',
          dateDisplay: 'Undated',
          era: 'pre-1990',
          title,
          body: title,
          peopleIds: extractPeopleIds(peopleText),
          themeIds: [],
          sources: sources.length ? sources : ['DOJ'],
          tags: inferTags(title, title),
          summary: generateSummary(title),
          eftaLinks: [],
          relatedEventIds: [],
          relatedThemeIds: [],
          discrepancies: [],
        });
      } catch {
        // skip malformed rows
      }
    }
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const e of events) {
    if (ids.has(e.id)) {
      // Make unique
      let i = 2;
      while (ids.has(`${e.id}-${i}`)) i++;
      e.id = `${e.id}-${i}`;
    }
    ids.add(e.id);
    if (!e.title) issues.push(`Missing title for event with date ${e.date}`);
    if (!e.body) issues.push(`Missing body for event: ${e.title}`);
  }

  if (warnings.length > 0) {
    console.warn('⚠ Warnings:\n' + warnings.slice(0, 10).join('\n'));
    if (warnings.length > 10) console.warn(`  ... and ${warnings.length - 10} more`);
  }
  if (issues.length > 0) {
    console.warn('⚠ Validation issues:\n' + issues.join('\n'));
  }

  return events;
}

// ─── Run ───────────────────────────────────────────────────────────────────
const events = parseTimeline();

const eraCounts: Record<string, number> = {};
for (const e of events) eraCounts[e.era] = (eraCounts[e.era] ?? 0) + 1;

console.log(`\n✓ Parsed ${events.length} timeline events`);
console.log(`  Era breakdown:`);
for (const [era, count] of Object.entries(eraCounts)) {
  console.log(`    ${era}: ${count}`);
}
console.log(`  Undated: ${events.filter((e) => e.date === 'undated').length}`);

const outPath = path.join(process.cwd(), 'src', 'data', 'timeline.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(events, null, 2));
console.log(`✓ Written to ${outPath}\n`);
