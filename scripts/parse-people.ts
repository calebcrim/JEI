/**
 * parse-people.ts
 * Converts source-data/epstein_people_dossier.md → src/data/people.json
 */

import fs from 'fs';
import path from 'path';

// ─── Types (inline to avoid module resolution issues in ts-node) ───────────
type PersonCategory =
  | 'principal' | 'inner-circle' | 'political' | 'financial'
  | 'legal' | 'intelligence' | 'academic-scientific' | 'media'
  | 'victim' | 'law-enforcement' | 'other';

type VerificationStatus = 'verified' | 'unverified' | 'contested' | 'discrepancy';

type SourceTag =
  | 'CBS' | 'NPR' | 'WSJ' | 'NYT' | 'CNN' | 'Bloomberg'
  | 'DOJ' | 'FBI' | 'HO' | 'SJ' | 'JMail' | 'GH' | 'OSINT'
  | 'Maxwell-trial' | 'Giuffre-deposition' | 'Palm-Beach-PD';

interface PersonSection {
  title: string;
  content: string;
  verificationStatus?: VerificationStatus;
  sources: SourceTag[];
  efta?: string[];
}

interface Person {
  id: string;
  name: string;
  aliases?: string[];
  born?: string;
  died?: string;
  category: PersonCategory;
  subcategory?: string;
  currentStatus?: string;
  mentionCount?: number;
  flightLegs?: number;
  summary: string;
  sections: PersonSection[];
  timelineEventIds: string[];
  themeIds: string[];
  connectionIds: string[];
  sources: SourceTag[];
}

// ─── Category mapping ──────────────────────────────────────────────────────
function categoryFromHeading(h2Text: string): PersonCategory {
  const t = h2Text.toLowerCase();
  if (t.includes('principal')) return 'principal';
  if (t.includes('inner circle') || t.includes('operational')) return 'inner-circle';
  if (t.includes('npa') || t.includes('legal structure')) return 'legal';
  if (t.includes('political')) return 'political';
  if (t.includes('financial network') || t.includes('financial')) return 'financial';
  if (t.includes('academic') || t.includes('scientific')) return 'academic-scientific';
  if (t.includes('media') || t.includes('media & legal')) return 'media';
  if (t.includes('royalt') || t.includes('intelligence')) return 'intelligence';
  if (t.includes('victim') || t.includes('accuser')) return 'victim';
  if (t.includes('law enforcement') || t.includes('law-enforcement')) return 'law-enforcement';
  if (t.includes('other')) return 'other';
  return 'other';
}

// ─── Source tag extraction ─────────────────────────────────────────────────
const VALID_SOURCES = new Set<SourceTag>([
  'CBS', 'NPR', 'WSJ', 'NYT', 'CNN', 'Bloomberg',
  'DOJ', 'FBI', 'HO', 'SJ', 'JMail', 'GH', 'OSINT',
  'Maxwell-trial', 'Giuffre-deposition', 'Palm-Beach-PD',
]);

function extractSources(text: string): SourceTag[] {
  const found = new Set<SourceTag>();
  // Match [TAG] or [TAG, TAG] patterns
  const matches = text.matchAll(/\[([A-Za-z\-,\s]+?)\]/g);
  for (const m of matches) {
    const parts = m[1].split(/[,\s]+/);
    for (const p of parts) {
      const trimmed = p.trim();
      if (VALID_SOURCES.has(trimmed as SourceTag)) {
        found.add(trimmed as SourceTag);
      }
      // Handle variants like "Maxwell-trial", "Giuffre-deposition"
      const normalized = trimmed.replace(/_/g, '-');
      if (VALID_SOURCES.has(normalized as SourceTag)) {
        found.add(normalized as SourceTag);
      }
    }
  }
  // Also check for source file references in **Source files:** lines
  if (text.includes('Maxwell trial') || text.includes('Maxwell-trial')) found.add('Maxwell-trial');
  if (text.includes('Giuffre') && text.includes('deposition')) found.add('Giuffre-deposition');
  if (text.includes('Palm Beach') && text.includes('Police')) found.add('Palm-Beach-PD');
  return Array.from(found);
}

// ─── EFTA reference extraction ─────────────────────────────────────────────
function extractEFTA(text: string): string[] {
  const matches = text.match(/EFTA\d{8}/g);
  return matches ? [...new Set(matches)] : [];
}

// ─── Mention frequency table ───────────────────────────────────────────────
function parseMentionFrequencyTable(content: string): Record<string, number> {
  const result: Record<string, number> = {};
  const tableSection = content.match(/## Quick-Reference[\s\S]*?(?=\n## )/);
  if (!tableSection) return result;

  const rows = tableSection[0].split('\n').filter((l) => l.startsWith('|'));
  for (const row of rows) {
    const cols = row.split('|').map((c) => c.trim()).filter(Boolean);
    if (cols.length < 2 || cols[0].toLowerCase() === 'name') continue;
    const name = cols[0];
    const firstNum = cols[1].match(/[\d,]+/);
    const count = firstNum ? parseInt(firstNum[0].replace(/,/g, ''), 10) : NaN;
    if (!isNaN(count) && count > 0) {
      result[name.toLowerCase()] = count;
    }
  }
  return result;
}

// ─── Flight leg extraction ─────────────────────────────────────────────────
function extractFlightLegs(text: string): number | undefined {
  const m = text.match(/(\d+)\s+documented flight(?:\s+leg)?s?/i) ||
            text.match(/appears on[^.]*?(\d+)[^.]*?flight leg/i) ||
            text.match(/~?(\d+)\s+flight legs/i);
  return m ? parseInt(m[1], 10) : undefined;
}

// ─── Person section extraction ─────────────────────────────────────────────
function extractSections(content: string): PersonSection[] {
  const sections: PersonSection[] = [];

  // Split on bold headers that look like section titles
  // Pattern: **Bold text that ends with :** at start of line or after newline
  const parts = content.split(/\n(?=\*\*[A-Z][^*\n]{3,60}:\*\*)/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Extract section title if present
    const titleMatch = trimmed.match(/^\*\*([^*\n]{3,60}):\*\*\s*/);

    const title = titleMatch ? titleMatch[1].trim() : 'Overview';
    const rawContent = titleMatch ? trimmed.slice(titleMatch[0].length) : trimmed;

    // Clean the content
    const cleaned = rawContent
      .replace(/\*\*\[UNVERIFIED[^\]]*\]\*\*/g, '')
      .replace(/\*\*\[DISCREPANCY:[^\]]*\]\*\*/g, '')
      .replace(/\[(?:CBS|NPR|WSJ|NYT|CNN|Bloomberg|DOJ|FBI|HO|SJ|JMail|GH|OSINT|Maxwell-trial|Giuffre-deposition|Palm-Beach-PD)[^\]]*\]/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleaned) continue;

    const verificationStatus: VerificationStatus | undefined =
      part.includes('[UNVERIFIED') ? 'unverified' :
      part.includes('[DISCREPANCY') ? 'discrepancy' :
      part.includes('[CONTESTED') ? 'contested' :
      undefined;

    const section: PersonSection = {
      title,
      content: cleaned,
      sources: extractSources(part),
      efta: extractEFTA(part),
    };
    if (verificationStatus) section.verificationStatus = verificationStatus;
    if (!section.efta?.length) delete section.efta;

    sections.push(section);
  }

  if (sections.length === 0 && content.trim()) {
    // Fallback: single overview section
    sections.push({
      title: 'Overview',
      content: content.trim().slice(0, 2000),
      sources: extractSources(content),
    });
  }

  return sections;
}

// ─── Slugify ───────────────────────────────────────────────────────────────
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// ─── Extract summary ───────────────────────────────────────────────────────
function extractSummary(content: string): string {
  // Skip bold metadata lines (Born:, Died:, Category:, etc.)
  const lines = content.split('\n');
  const paragraphs: string[] = [];
  let currentPara = '';

  for (const line of lines) {
    const stripped = line.trim();
    // Skip bold metadata fields
    if (/^\*\*(?:Born|Died|Category|Current status|Source files?|Aliases?)\*\*:/.test(stripped)) continue;
    // Skip horizontal rules
    if (stripped === '---') continue;

    if (stripped === '') {
      if (currentPara.trim()) {
        paragraphs.push(currentPara.trim());
        currentPara = '';
      }
    } else {
      currentPara += (currentPara ? ' ' : '') + stripped;
    }
  }
  if (currentPara.trim()) paragraphs.push(currentPara.trim());

  // Find first substantial paragraph (>30 chars, not a bold section header)
  for (const p of paragraphs) {
    // Skip lines that are just bold headers
    if (/^\*\*[^*]+:\*\*$/.test(p)) continue;
    if (p.length < 30) continue;
    // Clean up
    return p
      .replace(/\*\*\[UNVERIFIED[^\]]*\]\*\*/g, '')
      .replace(/\*\*\[DISCREPANCY:[^\]]*\]\*\*/g, '')
      .replace(/\[(?:CBS|NPR|WSJ|NYT|CNN|Bloomberg|DOJ|FBI|HO|SJ|JMail|GH|OSINT)[^\]]*\]/g, '')
      .replace(/\*\*/g, '')
      .slice(0, 300)
      .trim();
  }
  return '';
}

// ─── Parse bold metadata from person block ─────────────────────────────────
interface PersonMeta {
  born?: string;
  died?: string;
  currentStatus?: string;
  aliases?: string[];
}

function parsePersonMeta(content: string): PersonMeta {
  const meta: PersonMeta = {};

  const born = content.match(/\*\*Born:\*\*\s*(.+)/);
  if (born) meta.born = born[1].trim().split('\n')[0].trim();

  const died = content.match(/\*\*Died:\*\*\s*(.+)/);
  if (died) meta.died = died[1].trim().split('\n')[0].trim();

  const status = content.match(/\*\*Current status:\*\*\s*(.+)/);
  if (status) meta.currentStatus = status[1].trim().split('\n')[0].trim();

  const aliases = content.match(/\*\*(?:Aliases?|Also known as):\*\*\s*(.+)/i);
  if (aliases) {
    meta.aliases = aliases[1].split(/[,;]/).map((a) => a.trim()).filter(Boolean);
  }

  return meta;
}

// ─── Main parsing ──────────────────────────────────────────────────────────
function parsePeople(): Person[] {
  const filePath = path.join(process.cwd(), 'source-data', 'epstein_people_dossier.md');
  const raw = fs.readFileSync(filePath, 'utf-8');

  const mentionFreqs = parseMentionFrequencyTable(raw);

  const people: Person[] = [];
  const warnings: string[] = [];

  // Split on H2 headings, stopping before appendices
  const categoryBlocks = raw.split(/(?=^## )/m).filter((b) => {
    const firstLine = b.split('\n')[0];
    return /^## Category \d+:/i.test(firstLine);
  });

  for (const block of categoryBlocks) {
    const lines = block.split('\n');
    const categoryLine = lines[0];
    const category = categoryFromHeading(categoryLine);

    // Split block into person entries (H3 → H3)
    const personBlocks = block.split(/(?=^### )/m).slice(1); // skip category header

    for (const pBlock of personBlocks) {
      try {
        const pLines = pBlock.split('\n');
        const h3Line = pLines[0];

        // Extract person name from H3
        const nameMatch = h3Line.match(/^### (.+)/);
        if (!nameMatch) continue;
        const rawName = nameMatch[1].trim();

        // Skip appendix-style headers
        if (rawName.startsWith('Appendix') || rawName.startsWith('Category')) continue;

        // Clean name (handle "Name (now Other Name)" — keep primary name)
        const name = rawName.replace(/\s*\(now\s+[^)]+\)\s*/i, '').trim();
        const id = slugify(name);

        const content = pBlock.slice(h3Line.length + 1); // body after H3

        const meta = parsePersonMeta(content);
        const summary = extractSummary(content);
        const sections = extractSections(content);
        const sources = extractSources(content);

        // Look up mention count
        let mentionCount: number | undefined;
        // Try exact name match first, then fuzzy
        const nameLower = name.toLowerCase();
        for (const [key, val] of Object.entries(mentionFreqs)) {
          if (nameLower.includes(key.split(' ')[0].toLowerCase()) ||
              key.includes(nameLower.split(' ')[0])) {
            mentionCount = val;
            break;
          }
        }

        const flightLegs = extractFlightLegs(content);

        // Determine subcategory from status
        let subcategory: string | undefined;
        if (meta.currentStatus?.toLowerCase().includes('immunity')) subcategory = 'immunity-grantee';
        else if (meta.currentStatus?.toLowerCase().includes('co-conspirator')) subcategory = 'co-conspirator';
        else if (meta.currentStatus?.toLowerCase().includes('convicted')) subcategory = 'convicted';

        if (!summary) {
          warnings.push(`Missing summary: ${name}`);
        }

        if (sections.length === 0) {
          warnings.push(`No sections: ${name}`);
        }

        people.push({
          id,
          name,
          ...(meta.aliases?.length ? { aliases: meta.aliases } : {}),
          ...(meta.born ? { born: meta.born } : {}),
          ...(meta.died ? { died: meta.died } : {}),
          category,
          ...(subcategory ? { subcategory } : {}),
          ...(meta.currentStatus ? { currentStatus: meta.currentStatus } : {}),
          ...(mentionCount ? { mentionCount } : {}),
          ...(flightLegs ? { flightLegs } : {}),
          summary: summary || `${name} — documented individual in the Epstein files.`,
          sections,
          timelineEventIds: [],
          themeIds: [],
          connectionIds: [],
          sources,
        });
      } catch (err) {
        warnings.push(`Error parsing person block: ${String(err)}`);
      }
    }
  }

  // ── Validation ────────────────────────────────────────────────────────────
  const ids = new Set<string>();
  const issues: string[] = [];
  for (const p of people) {
    if (ids.has(p.id)) {
      // Disambiguate duplicate IDs
      const dupIdx = people.filter((x) => x.id === p.id).length;
      p.id = `${p.id}-${dupIdx}`;
    }
    ids.add(p.id);
    if (!p.summary) issues.push(`Missing summary: ${p.name}`);
    if (p.sections.length === 0) issues.push(`No sections: ${p.name}`);
  }

  if (warnings.length > 0) {
    console.warn('⚠ Warnings:\n' + warnings.join('\n'));
  }
  if (issues.length > 0) {
    console.warn('⚠ Validation issues:\n' + issues.join('\n'));
  }

  return people;
}

// ─── Run ───────────────────────────────────────────────────────────────────
const people = parsePeople();

const categories = new Set(people.map((p) => p.category));
console.log(`\n✓ Parsed ${people.length} people across ${categories.size} categories`);
console.log(`  Category breakdown:`);
const catCounts: Record<string, number> = {};
for (const p of people) catCounts[p.category] = (catCounts[p.category] ?? 0) + 1;
for (const [cat, count] of Object.entries(catCounts)) {
  console.log(`    ${cat}: ${count}`);
}

const outPath = path.join(process.cwd(), 'src', 'data', 'people.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(people, null, 2));
console.log(`✓ Written to ${outPath}\n`);
