/**
 * parse-themes.ts
 * Converts source-data/epstein_themes_synthesis.md → src/data/themes.json
 */

import fs from 'fs';
import path from 'path';

type SourceTag =
  | 'CBS' | 'NPR' | 'WSJ' | 'NYT' | 'CNN' | 'Bloomberg'
  | 'DOJ' | 'FBI' | 'HO' | 'SJ' | 'JMail' | 'GH' | 'OSINT'
  | 'Maxwell-trial' | 'Giuffre-deposition' | 'Palm-Beach-PD';

interface ThemeSection {
  id: string;
  title: string;
  sectionNumber: number;
  summary: string;
  content: string;
  peopleIds: string[];
  timelineEventIds: string[];
  sources: SourceTag[];
  tags: string[];
}

// ─── Source tag extraction ─────────────────────────────────────────────────
const VALID_SOURCES = new Set<SourceTag>([
  'CBS', 'NPR', 'WSJ', 'NYT', 'CNN', 'Bloomberg',
  'DOJ', 'FBI', 'HO', 'SJ', 'JMail', 'GH', 'OSINT',
  'Maxwell-trial', 'Giuffre-deposition', 'Palm-Beach-PD',
]);

const SOURCE_FILE_MAP: Record<string, SourceTag> = {
  'CBS News': 'CBS',
  'CBS news': 'CBS',
  'NPR': 'NPR',
  'WSJ': 'WSJ',
  'NYT': 'NYT',
  'CNN': 'CNN',
  'Bloomberg': 'Bloomberg',
  'DOJ': 'DOJ',
  'OSINT': 'OSINT',
  'JMail': 'JMail',
  'jmail': 'JMail',
  'rhowardstone': 'GH',
  'GitHub': 'GH',
  'House Oversight': 'HO',
  'HO': 'HO',
  'Maxwell trial': 'Maxwell-trial',
  'Palm Beach Police': 'Palm-Beach-PD',
  'FBI': 'FBI',
};

function extractSources(text: string): SourceTag[] {
  const found = new Set<SourceTag>();

  for (const m of text.matchAll(/\[([A-Za-z\-,\s]+?)\]/g)) {
    for (const p of m[1].split(/[,\s]+/)) {
      const t = p.trim();
      if (VALID_SOURCES.has(t as SourceTag)) found.add(t as SourceTag);
    }
  }

  for (const [key, tag] of Object.entries(SOURCE_FILE_MAP)) {
    if (text.includes(key)) found.add(tag);
  }

  if (found.size === 0) found.add('DOJ');
  return Array.from(found);
}

// ─── Slugify ───────────────────────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ─── Tag inference ─────────────────────────────────────────────────────────
function inferTags(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];
  if (/traffi|recruit|victim|abuse|minor|underage/.test(text)) tags.push('trafficking');
  if (/financ|money|wire|account|bank|million|billion/.test(text)) tags.push('financial');
  if (/legal|indictment|plea|npa|charge|conviction|trial/.test(text)) tags.push('legal');
  if (/political|president|senator|congress/.test(text)) tags.push('political');
  if (/intelligence|mossad|cia|fbi|spy/.test(text)) tags.push('intelligence');
  if (/media|news|journal|report/.test(text)) tags.push('media');
  if (/death|died|dead|suicide|murder/.test(text)) tags.push('death');
  if (/academic|university|professor|research|science/.test(text)) tags.push('academic');
  if (/trump/.test(text)) tags.push('trump');
  if (/maxwell/.test(text)) tags.push('maxwell');
  return [...new Set(tags)];
}

// ─── Main parsing ──────────────────────────────────────────────────────────
function parseThemes(): ThemeSection[] {
  const filePath = path.join(process.cwd(), 'source-data', 'epstein_themes_synthesis.md');
  const raw = fs.readFileSync(filePath, 'utf-8');

  const themes: ThemeSection[] = [];
  const warnings: string[] = [];

  // Split on H2 headings that have a number prefix
  const blocks = raw.split(/(?=^## \d+\. )/m).filter((b) =>
    /^## \d+\. /.test(b.split('\n')[0])
  );

  for (const block of blocks) {
    try {
      const firstLine = block.split('\n')[0];

      // Extract section number and title: "## 3. Trump–Epstein Connections"
      const headingMatch = firstLine.match(/^## (\d+)\.\s+(.+)$/);
      if (!headingMatch) {
        warnings.push(`Could not parse H2: ${firstLine}`);
        continue;
      }

      const sectionNumber = parseInt(headingMatch[1], 10);
      const title = headingMatch[2].trim();
      const id = slugify(title);

      const bodyRaw = block.slice(firstLine.length + 1).trim();

      // Extract summary: first substantial paragraph (skip H3 headings)
      const lines = bodyRaw.split('\n');
      let summaryLines: string[] = [];
      let inFirstParagraph = false;
      let summaryDone = false;

      for (const line of lines) {
        if (summaryDone) break;
        const trimmed = line.trim();
        if (trimmed.startsWith('#')) {
          if (inFirstParagraph) summaryDone = true;
          continue;
        }
        if (trimmed === '' || trimmed === '---') {
          if (inFirstParagraph && summaryLines.join('').trim().length > 50) {
            summaryDone = true;
          }
          continue;
        }
        // Skip table rows
        if (trimmed.startsWith('|')) {
          if (inFirstParagraph) summaryDone = true;
          continue;
        }
        inFirstParagraph = true;
        summaryLines.push(trimmed);
      }

      const summary = summaryLines
        .join(' ')
        .replace(/\*\*\[UNVERIFIED[^\]]*\]\*\*/g, '')
        .replace(/\[(?:CBS|NPR|WSJ|NYT|CNN|Bloomberg|DOJ|FBI|HO|SJ|JMail|GH|OSINT)[^\]]*\]/g, '')
        .replace(/\*\*/g, '')
        .slice(0, 400)
        .trim();

      // Content = everything from second paragraph onward
      // We keep all markdown including tables and H3 subsections
      const summaryLength = summaryLines.join('\n').length;
      let contentStart = 0;
      let charsFound = 0;
      for (let i = 0; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        if (lines[i].trim().startsWith('#')) continue;
        if (lines[i].trim().startsWith('|')) continue;
        charsFound += lines[i].length;
        if (charsFound >= summaryLength) {
          // Find next blank line to start content
          let j = i + 1;
          while (j < lines.length && lines[j].trim()) j++;
          contentStart = j;
          break;
        }
      }

      const content = lines.slice(contentStart).join('\n').trim();

      // People ID extraction happens in build-connections, but do a basic one here
      // by looking for known name patterns — full cross-reference done later
      const peopleIds: string[] = [];

      const sources = extractSources(block);
      const tags = inferTags(title, bodyRaw);

      if (!summary) {
        warnings.push(`Missing summary for theme: ${title}`);
      }

      themes.push({
        id,
        title,
        sectionNumber,
        summary: summary || title,
        content,
        peopleIds,
        timelineEventIds: [],
        sources,
        tags,
      });
    } catch (err) {
      warnings.push(`Error parsing theme block: ${String(err)}`);
    }
  }

  // ── Validation ─────────────────────────────────────────────────────────────
  const issues: string[] = [];
  for (const t of themes) {
    if (!t.summary) issues.push(`Missing summary: ${t.title}`);
    if (!t.content) issues.push(`Empty content: ${t.title}`);
  }

  if (warnings.length > 0) {
    console.warn('⚠ Warnings:\n' + warnings.join('\n'));
  }
  if (issues.length > 0) {
    console.warn('⚠ Validation issues:\n' + issues.join('\n'));
  }

  return themes;
}

// ─── Run ───────────────────────────────────────────────────────────────────
const themes = parseThemes();

console.log(`\n✓ Parsed ${themes.length} theme sections`);
for (const t of themes) {
  console.log(`  ${t.sectionNumber}. ${t.title} (${t.content.length} chars)`);
}

const outPath = path.join(process.cwd(), 'src', 'data', 'themes.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(themes, null, 2));
console.log(`✓ Written to ${outPath}\n`);
