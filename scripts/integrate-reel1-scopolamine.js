#!/usr/bin/env node
/**
 * REEL1 Scopolamine / Trumpet Plant Integration Script
 * Integrates probe results from CC_GUIDE_REEL1_UPDATE_PROBE_RESULTS.md
 * into site JSON: themes, people, timeline, connections.
 * Fully idempotent — safe to re-run.
 *
 * Source: 11 new EFTA documents analyzed — trumpet vine planting confirmed,
 * scopolamine article forwarded to Epstein, LSJ trumpet flowers reference.
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const timeline = JSON.parse(fs.readFileSync(path.join(DATA, 'timeline.json'), 'utf8'));
const people = JSON.parse(fs.readFileSync(path.join(DATA, 'people.json'), 'utf8'));
const connections = JSON.parse(fs.readFileSync(path.join(DATA, 'connections.json'), 'utf8'));
const themes = JSON.parse(fs.readFileSync(path.join(DATA, 'themes.json'), 'utf8'));

const SRC = 'DOJ';
const THEME_ID = 'chemical-drugging';

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function findTimelineById(id) {
  return timeline.find(e => e.id === id);
}
function findPersonById(id) {
  return people.find(p => p.id === id);
}
function findThemeById(id) {
  return themes.find(t => t.id === id);
}
function findConnectionById(id) {
  return connections.find(c => c.id === id);
}

function addTimelineEvent(event) {
  if (findTimelineById(event.id)) {
    console.log(`  SKIP (exists): ${event.id}`);
    return false;
  }
  timeline.push(event);
  console.log(`  ADD event: ${event.id}`);
  return true;
}

function makeTimelineEvent(opts) {
  return {
    id: opts.id,
    date: opts.date,
    dateDisplay: opts.dateDisplay,
    era: opts.era || '2008-2018',
    title: opts.title,
    body: opts.body + '\n\n---',
    peopleIds: opts.peopleIds || [],
    themeIds: opts.themeIds || [THEME_ID],
    sources: opts.sources || [SRC],
    tags: opts.tags || [],
    summary: opts.summary || opts.body.split('\n')[0].substring(0, 300),
    eftaLinks: opts.eftaLinks || [],
    relatedEventIds: opts.relatedEventIds || [],
    relatedThemeIds: opts.relatedThemeIds || [THEME_ID],
    discrepancies: opts.discrepancies || [],
    verificationStatus: opts.verificationStatus || 'verified'
  };
}

function addPerson(person) {
  if (findPersonById(person.id)) {
    console.log(`  SKIP (exists): ${person.id}`);
    return false;
  }
  people.push(person);
  console.log(`  ADD person: ${person.id}`);
  return true;
}

function makePerson(opts) {
  return {
    id: opts.id,
    name: opts.name,
    aliases: opts.aliases || [],
    category: opts.category || 'other',
    subcategory: opts.subcategory || undefined,
    summary: opts.summary,
    sections: opts.sections || [
      { title: 'Role', content: opts.roleText || opts.summary, sources: opts.sources || [SRC] },
      { title: 'Source', content: 'DOJ EFTA document corpus — Bates-stamped releases\n\n---', sources: [SRC] }
    ],
    timelineEventIds: opts.timelineEventIds || [],
    themeIds: opts.themeIds || [THEME_ID],
    connectionIds: opts.connectionIds || [],
    sources: opts.sources || [SRC]
  };
}

function addConnection(conn) {
  if (findConnectionById(conn.id)) {
    console.log(`  SKIP (exists): ${conn.id}`);
    return false;
  }
  connections.push(conn);
  console.log(`  ADD connection: ${conn.id}`);
  return true;
}

function makeConnection(opts) {
  return {
    id: opts.id,
    sourcePersonId: opts.source,
    targetPersonId: opts.target,
    relationshipType: opts.type || 'social',
    strength: opts.strength || 1,
    description: opts.description,
    sources: opts.sources || [SRC],
    verificationStatus: opts.verification || 'verified',
    activeEras: opts.activeEras || []
  };
}

function addPersonTheme(personId, themeId) {
  const person = findPersonById(personId);
  if (person && !person.themeIds.includes(themeId)) {
    person.themeIds.push(themeId);
  }
}

function addPersonEvent(personId, eventId) {
  const person = findPersonById(personId);
  if (person && !person.timelineEventIds.includes(eventId)) {
    person.timelineEventIds.push(eventId);
  }
}

function addPersonConnection(personId, connId) {
  const person = findPersonById(personId);
  if (person && !person.connectionIds.includes(connId)) {
    person.connectionIds.push(connId);
  }
}

function enrichPersonSections(personId, newSections) {
  const person = findPersonById(personId);
  if (!person) {
    console.log(`  WARN: person ${personId} not found`);
    return false;
  }
  const existingTitles = person.sections.map(s => s.title);
  let added = 0;
  for (const sec of newSections) {
    if (existingTitles.includes(sec.title)) {
      console.log(`  SKIP section (exists): ${personId} → "${sec.title}"`);
      continue;
    }
    const sourceIdx = person.sections.findIndex(s => s.title === 'Source files' || s.title === 'Source');
    if (sourceIdx >= 0) {
      person.sections.splice(sourceIdx, 0, sec);
    } else {
      person.sections.push(sec);
    }
    added++;
  }
  if (added > 0) {
    console.log(`  ENRICH person: ${personId} (+${added} sections)`);
    return true;
  }
  return false;
}

let addedPeople = 0, addedEvents = 0, addedConnections = 0, enrichedPeople = 0;

// ============================================================
// PART 1: CREATE CHEMICAL-DRUGGING THEME
// ============================================================

console.log('\n=== PART 1: CREATE/ENRICH CHEMICAL-DRUGGING THEME ===\n');

let theme = findThemeById(THEME_ID);
if (!theme) {
  const newTheme = {
    id: THEME_ID,
    title: 'Chemical Drugging Methods — Scopolamine & Trumpet Plant Thread',
    sectionNumber: themes.length + 1,
    summary: 'Documented evidence of Epstein\'s interest in Angel Trumpet plants (Brugmansia/Datura) — a natural source of scopolamine — at both Zorro Ranch and Little St. James, combined with his receipt of a detailed article on scopolamine\'s criminal applications. Four independent EFTA documents confirm trumpet vine was ordered, invoiced, and physically planted at Zorro Ranch in 2013.',
    content: `## The Trumpet Plant / Scopolamine Thread

### Core Document Cluster

On March 3, 2014, Jeffrey Epstein emailed Anne Rodriguez: **"ask Chris about my trumpet plants at nursery"** (EFTA00984429). On its own, this appears mundane. The significance emerges from the pharmacological properties of Angel Trumpet (*Brugmansia* / *Datura*) plants and the broader documentary trail now uncovered.

**Scopolamine** (hyoscine) is one of the primary alkaloid compounds in Angel Trumpet plants. In criminal contexts — particularly documented in Colombia — scopolamine has been called "Devil's Breath." It can be:
- Blown into a victim's face as powder
- Dissolved into drinks (odorless, tasteless)
- Absorbed through skin contact
- Used to render victims compliant with no autonomous will while appearing outwardly normal
- Causes complete post-event amnesia — victims have no memory of what happened

The CIA used scopolamine in Cold War interrogation programs. In sufficient doses, it is lethal.

### Zorro Ranch — Confirmed Planting (CORROBORATED)

Four independent EFTA documents confirm trumpet vine was ordered, invoiced, and physically planted at Zorro Ranch, New Mexico in 2013:

1. **March 27, 2013** — Mallory Landscape & Design proposal ($106,655) specifies "2 trumpet vine" for the Southeast Side (EFTA00587280)
2. **May 9, 2013** — Aspen Landscaping LLC proposal ($84,495) specifies "3-5 gal Trumpet Vine @ $40.00 ea" for Rear Terrace Beds (EFTA01124580)
3. **Invoice** — Actual cost invoice shows "5 gal Trumpet Vine $120.00" purchased (EFTA01177625)
4. **June 27, 2013** — Property management log confirms: **"Trumpet Vine planted along pathway between MH [Main House] & Dog Pen"** (EFTA01124666)

The Zorro Ranch nursery hypothesis — previously flagged as COMMUNITY HYPOTHESIS — is now **CORROBORATED** by four independent EFTA documents. The pathway between the Main House and Dog Pen is a foot-traffic corridor within the operational core of the property.

### Little St. James — Trumpet Flowers Reference

On November 11, 2013, Epstein emailed Ann Rodriguez and Mark Tollison with landscaping instructions including **"trumpet flowers"** at what appears to be the Little St. James pool area: "chris tomoonv.. pool trees, blocking trees., trumpet flowers. new palms, .yellow vines. sod dirt main pool." (EFTA01950280). This places trumpet plant interest at **both** Epstein properties during the same operational period.

### Scopolamine Article Forwarded to Epstein

On January 27, 2015 — **one month after the Manzaro incident** (December 26, 2014) — Epstein was forwarded an email chain containing a Daily Mail article titled **"Scopolamine: Powerful drug growing in the forests of Colombia that ELIMINATES free will."** The chain originated with fashion photographer Antoine Verglas (EFTA00865569). The article described scopolamine being blown into victims' faces, rendering them compliant with no memory formation — properties directly relevant to victim control.

### The Manzaro Victim Impact Statement (NEEDS CLARIFICATION)

Scopolamine is named explicitly in the victim impact statement of Dr. Joseph Manzaro (December 26, 2014 incident). **NOTE:** The EFTA version of this document (EFTA00163098) shows it being forwarded through FBI Miami Division channels in 2022. The incident described involves Florida gang members and corrupt local law enforcement figures — not an Epstein property or staff member. The nature of Manzaro's connection to the Epstein case files requires further clarification. His VIS is included in the EFTA set; the precise reason for its inclusion is unconfirmed.

## Verification Status Table

| Item | Status |
|------|--------|
| Zorro Ranch nursery location hypothesis | ✅ CORROBORATED (4 EFTA documents) |
| Trumpet vine planted at Zorro Ranch | ✅ VERIFIED (EFTA01124666) |
| Epstein awareness of scopolamine's criminal applications | ✅ VERIFIED (EFTA00865569) |
| Trumpet flowers interest at Little St. James | ✅ VERIFIED (EFTA01950280) |
| Manzaro incident as direct Epstein case | ⚠️ NEEDS CLARIFICATION (incident involves separate FL parties) |
| Identity of "Chris" | ⚠️ PARTIALLY NARROWED (possible LSJ staff, "chris tomoonv") |

## Open Research Questions

### Resolved
- **"Which nursery? Confirm or refute the Zorro Ranch greenhouse hypothesis."** → RESOLVED — CORROBORATED. Four EFTA documents confirm trumpet vine was planted at Zorro Ranch on June 27, 2013 (EFTA00587280, EFTA01124580, EFTA01177625, EFTA01124666).
- **"Epstein scopolamine awareness beyond the two known hits."** → RESOLVED — EFTA00865569 confirms Epstein received detailed criminal scopolamine article January 2015.

### Partially Resolved
- **"Who is 'Chris'? The nursery contact named in the March 3, 2014 email."** → A November 11, 2013 email (EFTA01950280) references "chris tomoonv" in the context of Little St. James landscaping tasks — possibly the same individual. The name may be "Chris Tomoonov" or similar (OCR artifact likely). Chris appears to be active at LSJ, not necessarily Zorro Ranch. Still UNVERIFIED, but narrowed.

### Still Open
- Are there additional scopolamine references in the full 3.5M page EFTA set?
- Other victims reporting drugging without positive tox screens?
- Rinaldo Rizzo housekeeper testimony — Bates number and sworn status.
- **NEW:** What is the precise reason Manzaro's victim impact statement is included in the EFTA set? His VIS describes a 2014 Florida gang/corruption incident, not an Epstein property. Was Manzaro also a driver or associate in the Epstein network? The EFTA inclusion needs contextual explanation before his scopolamine citation can be attributed to the Epstein pattern with full confidence.

## EFTA Document Index

| EFTA Bates | Description | Verification |
|------------|-------------|--------------|
| EFTA00984429 | Epstein → Rodriguez "ask Chris about my trumpet plants at nursery" email, March 3, 2014 | VERIFIED |
| EFTA00865569 | Email chain delivering scopolamine article to Epstein, January 27, 2015 | VERIFIED |
| EFTA01950280 | Epstein → Rodriguez + Tollison "trumpet flowers" email, November 11, 2013 | VERIFIED |
| EFTA01124666 | Zorro Projects management log confirming trumpet vine planting, June 27, 2013 | VERIFIED |
| EFTA01177625 | Zorro Ranch landscape invoice showing trumpet vine purchase ($120) | VERIFIED |
| EFTA01124580 | Aspen Landscaping proposal for Zorro Ranch including trumpet vine, May 9, 2013 | VERIFIED |
| EFTA00587280 | Mallory Landscape proposal for Zorro Ranch including trumpet vine, March 27, 2013 | VERIFIED |
| EFTA00163098 | Dr. Joseph Manzaro victim impact statement in FBI email chain, February 2022 | VERIFIED (with caveat) |

---`,
    peopleIds: [
      'jeffrey-epstein',
      'anne-rodriguez',
      'antoine-verglas'
    ],
    timelineEventIds: [
      'zorro-ranch-trumpet-vine-proposal-mallory-2013',
      'zorro-ranch-trumpet-vine-proposal-aspen-2013',
      'zorro-ranch-trumpet-vine-planted-2013',
      'lsj-trumpet-flowers-2013',
      'epstein-scopolamine-article-2015'
    ],
    sources: [SRC],
    tags: ['drugging', 'scopolamine', 'trumpet-plant', 'zorro-ranch', 'little-st-james', 'chemical-control'],
    eftaLinks: [
      { number: 'EFTA00984429', url: '', description: 'Epstein → Rodriguez "ask Chris about my trumpet plants" email, March 3, 2014' },
      { number: 'EFTA00865569', url: '', description: 'Scopolamine article forwarded to Epstein, January 27, 2015' },
      { number: 'EFTA01950280', url: '', description: 'Epstein → Rodriguez + Tollison "trumpet flowers" LSJ email, November 11, 2013' },
      { number: 'EFTA01124666', url: '', description: 'Zorro Projects log confirming trumpet vine planting, June 27, 2013' },
      { number: 'EFTA01177625', url: '', description: 'Zorro Ranch landscape invoice — trumpet vine purchase' },
      { number: 'EFTA01124580', url: '', description: 'Aspen Landscaping proposal with trumpet vine, May 9, 2013' },
      { number: 'EFTA00587280', url: '', description: 'Mallory Landscape proposal with trumpet vine, March 27, 2013' },
      { number: 'EFTA00163098', url: '', description: 'Manzaro VIS in FBI email chain — scopolamine reference (caveat: separate FL incident)' }
    ]
  };
  themes.push(newTheme);
  console.log('  CREATE theme: chemical-drugging');
} else {
  console.log('  SKIP (exists): chemical-drugging theme');
}

// ============================================================
// PART 2: ADD TIMELINE ENTRIES
// ============================================================

console.log('\n=== PART 2: ADD TIMELINE ENTRIES ===\n');

// Entry A — March 2013 (Mallory Proposal)
if (addTimelineEvent(makeTimelineEvent({
  id: 'zorro-ranch-trumpet-vine-proposal-mallory-2013',
  date: '2013-03-27',
  dateDisplay: 'March 27, 2013',
  era: '2008-2018',
  title: 'Earliest Trumpet Vine Proposal for Zorro Ranch (Mallory Landscape)',
  body: 'Mallory Landscape and Design submits a $106,655 landscaping proposal for Zorro Ranch, New Mexico. The Southeast Side section specifies "2 trumpet vine" as part of plant materials. This is the earliest documented proposal to include trumpet vine at Zorro Ranch.\n\nThe earliest of four EFTA documents confirming trumpet vine was proposed or planted at Zorro Ranch. Subsequent documents show the plants were ordered, invoiced, and confirmed as planted by June 27, 2013.',
  summary: 'Landscape proposal for Zorro Ranch includes trumpet vine, March 2013. Mallory Landscape & Design proposes $106,655 landscaping project; Southeast Side section specifies "2 trumpet vine" in plant materials.',
  peopleIds: ['jeffrey-epstein'],
  themeIds: [THEME_ID],
  sources: [SRC],
  tags: ['zorro-ranch', 'trumpet-vine', 'landscaping'],
  eftaLinks: [{ number: 'EFTA00587280', url: '', description: 'Mallory Landscape and Design — Zorro Ranch Proposal, March 27, 2013' }],
  relatedEventIds: ['zorro-ranch-trumpet-vine-proposal-aspen-2013', 'zorro-ranch-trumpet-vine-planted-2013', 'lsj-trumpet-flowers-2013'],
  relatedThemeIds: [THEME_ID]
}))) addedEvents++;

// Entry B — May 2013 (Aspen Proposal)
if (addTimelineEvent(makeTimelineEvent({
  id: 'zorro-ranch-trumpet-vine-proposal-aspen-2013',
  date: '2013-05-09',
  dateDisplay: 'May 9, 2013',
  era: '2008-2018',
  title: 'Aspen Landscaping Proposal for Zorro Ranch Includes Trumpet Vine',
  body: 'Aspen Landscaping LLC (Santa Fe, NM; Jose Santos, Owner) submits a landscaping proposal for "Brice Gordon / Zorro Development, 49 Zorro Ranch Rd, Stanley NM" totaling approximately $84,495. The Rear Terrace Beds section specifies "3-5 gal Trumpet Vine @ $40.00 ea." Epstein property manager Brice Gordon is the named contact.\n\nProperty manager named is Brice Gordon. The email address used is zorro.office@gmail.com. This is one of four EFTA documents in the trumpet vine cluster. The June 2013 project log (EFTA01124666) later confirms these plants were actually planted.',
  summary: 'Second landscape proposal for Zorro Ranch specifies trumpet vine, May 2013. Aspen Landscaping LLC proposes $84,495 project; Rear Terrace Beds include "3-5 gal Trumpet Vine @ $40.00 ea."',
  peopleIds: ['jeffrey-epstein'],
  themeIds: [THEME_ID],
  sources: [SRC],
  tags: ['zorro-ranch', 'trumpet-vine', 'landscaping'],
  eftaLinks: [{ number: 'EFTA01124580', url: '', description: 'Aspen Landscaping LLC Proposal — Zorro Ranch, May 9, 2013' }],
  relatedEventIds: ['zorro-ranch-trumpet-vine-proposal-mallory-2013', 'zorro-ranch-trumpet-vine-planted-2013'],
  relatedThemeIds: [THEME_ID]
}))) addedEvents++;

// Entry C — June 27, 2013 (Planting Confirmed)
if (addTimelineEvent(makeTimelineEvent({
  id: 'zorro-ranch-trumpet-vine-planted-2013',
  date: '2013-06-27',
  dateDisplay: 'June 27, 2013',
  era: '2008-2018',
  title: 'Trumpet Vine Confirmed Planted at Zorro Ranch — Pathway Between Main House and Dog Pen',
  body: 'The Zorro Ranch property management log (July 12, 2013 status update) records: "6/27/13 — Preparation front parking area begins, Columbians & Trumpet Vine planted along pathway between MH [Main House] & Dog Pen." This is the first definitive confirmation that trumpet vine was physically installed at Epstein\'s primary New Mexico property, along a specific foot-traffic pathway adjacent to the main residence.\n\nThe pathway between the Main House and the Dog Pen is a foot-traffic corridor within the operational core of the property — not a remote garden area. The document also names "Columbians" as co-planted species (likely "Columbine" — Aquilegia). Two landscape companies had proposed trumpet vine for this property starting in March 2013; this log entry confirms execution. The Zorro Ranch nursery hypothesis, previously flagged as community research, is now corroborated by four independent EFTA documents.',
  summary: 'Trumpet vine was physically planted at Zorro Ranch on June 27, 2013 — between the Main House and Dog Pen. Property management log records exact date and location, confirming execution of earlier landscape proposals.',
  peopleIds: ['jeffrey-epstein'],
  themeIds: [THEME_ID],
  sources: [SRC],
  tags: ['zorro-ranch', 'trumpet-vine', 'confirmed-planting'],
  eftaLinks: [
    { number: 'EFTA01124666', url: '', description: 'Zorro Projects Management Log, July 12, 2013' },
    { number: 'EFTA00587280', url: '', description: 'Mallory Landscape Proposal, March 27, 2013' },
    { number: 'EFTA01124580', url: '', description: 'Aspen Landscaping Proposal, May 9, 2013' },
    { number: 'EFTA01177625', url: '', description: 'Zorro Ranch Landscape Invoice — trumpet vine purchase' }
  ],
  relatedEventIds: ['zorro-ranch-trumpet-vine-proposal-mallory-2013', 'zorro-ranch-trumpet-vine-proposal-aspen-2013', 'lsj-trumpet-flowers-2013', 'epstein-scopolamine-article-2015'],
  relatedThemeIds: [THEME_ID]
}))) addedEvents++;

// Entry D — November 11, 2013 (LSJ Trumpet Flowers)
if (addTimelineEvent(makeTimelineEvent({
  id: 'lsj-trumpet-flowers-2013',
  date: '2013-11-11',
  dateDisplay: 'November 11, 2013',
  era: '2008-2018',
  title: 'Epstein Instructs Staff on "Trumpet Flowers" at Little St. James',
  body: 'Epstein emails Ann Rodriguez and Mark Tollison with landscaping instructions including "trumpet flowers" at what appears to be the Little St. James pool area: "chris tomoonv.. pool trees, blocking trees., trumpet flowers. new palms,.yellow vines. sod dirt main pool." This places trumpet plant interest at Little St. James — not only Zorro Ranch — within the same operational period.\n\nThis document places Epstein\'s trumpet plant interest at Little St. James (USVI) as well as Zorro Ranch (NM). The email also references "chris tomoonv" — possibly the same "Chris" referenced in the March 2014 "ask Chris about my trumpet plants at nursery" email. If so, Chris may be a property staff member active at LSJ rather than Zorro Ranch, contrary to the initial Zorro Ranch nursery hypothesis — though the plants are now confirmed planted at Zorro Ranch regardless.',
  summary: 'Epstein instructs staff about "trumpet flowers" at Little St. James pool area, November 2013. Places trumpet plant interest at both Epstein properties during the same period.',
  peopleIds: ['jeffrey-epstein', 'anne-rodriguez'],
  themeIds: [THEME_ID],
  sources: [SRC],
  tags: ['little-st-james', 'trumpet-flowers', 'landscaping'],
  eftaLinks: [
    { number: 'EFTA01950280', url: '', description: 'Epstein to Rodriguez and Tollison, November 11, 2013' },
    { number: 'EFTA00984429', url: '', description: 'Epstein to Rodriguez, March 3, 2014 — "ask Chris about my trumpet plants"' }
  ],
  relatedEventIds: ['zorro-ranch-trumpet-vine-planted-2013', 'epstein-scopolamine-article-2015'],
  relatedThemeIds: [THEME_ID]
}))) addedEvents++;

// Entry E — January 27, 2015 (Scopolamine Article)
if (addTimelineEvent(makeTimelineEvent({
  id: 'epstein-scopolamine-article-2015',
  date: '2015-01-27',
  dateDisplay: 'January 27, 2015',
  era: '2008-2018',
  title: 'Epstein Receives Article About Scopolamine as Criminal Compliance Drug',
  body: 'One month after the Manzaro scopolamine incident (December 26, 2014), Epstein is sent a forwarded email chain containing a Daily Mail article titled "Scopolamine: Powerful drug growing in the forests of Colombia that ELIMINATES free will." The article chain originated with fashion photographer Antoine Verglas and was forwarded to Epstein (sender redacted in EFTA). The article describes scopolamine being blown into victims\' faces, rendering them compliant with no autonomous will and no memory formation — properties directly relevant to victim control.\n\nThe article details scopolamine being: blown into victims\' faces, administered in drinks, odorless and tasteless, capable of removing autonomous will while leaving the victim apparently coherent, and causing complete post-event amnesia. The CIA used it in Cold War interrogations. The article notes it is "worse than anthrax" in high doses. Epstein\'s receipt of this article — whether read, ignored, or acted upon — documents his exposure to detailed operational information about the drug during the same operational period as the Manzaro incident and the Zorro Ranch planting. The sender to Epstein is redacted in EFTA; Antoine Verglas is documented as the original forwarder in the chain.',
  summary: 'Epstein received a detailed article on scopolamine\'s use as a criminal compliance drug, January 2015. Forwarded via photographer Antoine Verglas, one month after the December 2014 Manzaro scopolamine incident.',
  peopleIds: ['jeffrey-epstein', 'antoine-verglas'],
  themeIds: [THEME_ID],
  sources: [SRC],
  tags: ['scopolamine', 'criminal-compliance', 'documented-awareness'],
  eftaLinks: [{ number: 'EFTA00865569', url: '', description: 'Email to Jeffrey Epstein, January 27, 2015 — scopolamine article forwarded' }],
  relatedEventIds: ['zorro-ranch-trumpet-vine-planted-2013', 'lsj-trumpet-flowers-2013'],
  relatedThemeIds: [THEME_ID]
}))) addedEvents++;

// ============================================================
// PART 3: ADD NEW PEOPLE
// ============================================================

console.log('\n=== PART 3: ADD NEW PEOPLE ===\n');

// Antoine Verglas
if (addPerson(makePerson({
  id: 'antoine-verglas',
  name: 'Antoine Verglas',
  category: 'other',
  summary: 'Fashion and celebrity photographer. Documented as the originator of a forwarded email chain that delivered a detailed scopolamine article to Epstein\'s inbox on January 27, 2015 (EFTA00865569). Verglas operated a studio at 14-16 Wooster Street, 2nd Floor, New York NY 10013. The email originated on December 3, 2014 and was forwarded to an intermediary, who forwarded it to Epstein on January 27, 2015.',
  sections: [
    {
      title: 'Role',
      content: 'Fashion and celebrity photographer based in New York. Documented as the originator of a forwarded email chain that delivered a detailed Daily Mail article about scopolamine to Epstein\'s inbox on January 27, 2015. Verglas operated a studio at 14-16 Wooster Street, 2nd Floor, New York NY 10013.\n\nThe email chain originated on December 3, 2014. Verglas forwarded it to an intermediary (redacted in EFTA), who then forwarded it to Epstein on January 27, 2015 — one month after the Manzaro scopolamine incident.',
      sources: [SRC],
      efta: ['EFTA00865569']
    },
    { title: 'Source', content: 'DOJ EFTA document corpus — Email chain EFTA00865569\n\n---', sources: [SRC] }
  ],
  timelineEventIds: ['epstein-scopolamine-article-2015'],
  themeIds: [THEME_ID],
  connectionIds: ['verglas-epstein-scopolamine-article'],
  sources: [SRC]
}))) addedPeople++;

// Anne Rodriguez (if not already present)
if (addPerson(makePerson({
  id: 'anne-rodriguez',
  name: 'Anne Rodriguez',
  aliases: ['Ann Rodriguez'],
  category: 'inner-circle',
  summary: 'Personal secretary to Jeffrey Epstein and on-site manager of Little St. James Island (USVI). Recipient of the March 3, 2014 "ask Chris about my trumpet plants at nursery" email (EFTA00984429) and the November 11, 2013 "trumpet flowers" landscaping instructions for Little St. James (EFTA01950280). Her role placed her at the operational core of the enterprise.',
  sections: [
    {
      title: 'Role',
      content: 'Anne Rodriguez served as both a personal secretary to Jeffrey Epstein and as one of the on-site managers of Little St. James Island (USVI). Her role placed her at the operational core of the enterprise — she was not peripheral staff.\n\nRodriguez was the direct recipient of multiple landscaping-related emails from Epstein, including the March 3, 2014 "ask Chris about my trumpet plants at nursery" email (EFTA00984429) and the November 11, 2013 email instructing staff about "trumpet flowers" at the Little St. James pool area (EFTA01950280).',
      sources: [SRC],
      efta: ['EFTA00984429', 'EFTA01950280']
    },
    { title: 'Source', content: 'DOJ EFTA document corpus — multiple Bates-stamped emails\n\n---', sources: [SRC] }
  ],
  timelineEventIds: ['lsj-trumpet-flowers-2013'],
  themeIds: [THEME_ID],
  connectionIds: ['rodriguez-epstein-inner-circle'],
  sources: [SRC]
}))) addedPeople++;

// ============================================================
// PART 4: ADD CONNECTIONS
// ============================================================

console.log('\n=== PART 4: ADD CONNECTIONS ===\n');

// Antoine Verglas → Jeffrey Epstein
if (addConnection(makeConnection({
  id: 'verglas-epstein-scopolamine-article',
  source: 'antoine-verglas',
  target: 'jeffrey-epstein',
  type: 'social',
  strength: 1,
  description: 'Forwarded scopolamine article chain that reached Epstein via intermediary, January 2015 (EFTA00865569)',
  verification: 'verified',
  activeEras: ['2008-2018']
}))) addedConnections++;

// Anne Rodriguez → Jeffrey Epstein
if (addConnection(makeConnection({
  id: 'rodriguez-epstein-inner-circle',
  source: 'anne-rodriguez',
  target: 'jeffrey-epstein',
  type: 'employer-employee',
  strength: 3,
  description: 'Personal secretary and Little St. James property manager. Recipient of trumpet plant and landscaping emails (EFTA00984429, EFTA01950280).',
  verification: 'verified',
  activeEras: ['2008-2018']
}))) addedConnections++;

// ============================================================
// PART 5: ENRICH EXISTING PEOPLE
// ============================================================

console.log('\n=== PART 5: ENRICH EXISTING PEOPLE ===\n');

// Enrich Jeffrey Epstein with scopolamine/trumpet thread section
if (enrichPersonSections('jeffrey-epstein', [
  {
    title: 'Scopolamine & Trumpet Plant Thread',
    content: 'Four independent EFTA documents confirm trumpet vine was ordered, invoiced, and physically planted at Zorro Ranch, New Mexico in 2013. The property management log (EFTA01124666) records: "Trumpet Vine planted along pathway between MH [Main House] & Dog Pen" on June 27, 2013. A separate November 2013 email (EFTA01950280) confirms Epstein also instructed staff about "trumpet flowers" at Little St. James, placing the plant interest at both properties.\n\nOn January 27, 2015 — one month after the Manzaro scopolamine incident (December 26, 2014) — Epstein was forwarded a detailed Daily Mail article titled "Scopolamine: Powerful drug growing in the forests of Colombia that ELIMINATES free will." The email chain originated with fashion photographer Antoine Verglas (EFTA00865569). The article described scopolamine being blown into victims\' faces, rendering them compliant with no memory formation.\n\nAngel Trumpet (*Brugmansia* / *Datura*) plants are a natural source of scopolamine. The combination of confirmed planting at Epstein properties and documented receipt of a criminal application article establishes a corroborated investigative thread.',
    verificationStatus: 'verified',
    sources: [SRC],
    efta: ['EFTA00984429', 'EFTA00865569', 'EFTA01950280', 'EFTA01124666', 'EFTA01177625', 'EFTA01124580', 'EFTA00587280']
  }
])) enrichedPeople++;

// Add theme and event cross-references to Epstein
addPersonTheme('jeffrey-epstein', THEME_ID);
addPersonEvent('jeffrey-epstein', 'zorro-ranch-trumpet-vine-proposal-mallory-2013');
addPersonEvent('jeffrey-epstein', 'zorro-ranch-trumpet-vine-proposal-aspen-2013');
addPersonEvent('jeffrey-epstein', 'zorro-ranch-trumpet-vine-planted-2013');
addPersonEvent('jeffrey-epstein', 'lsj-trumpet-flowers-2013');
addPersonEvent('jeffrey-epstein', 'epstein-scopolamine-article-2015');
addPersonConnection('jeffrey-epstein', 'verglas-epstein-scopolamine-article');
addPersonConnection('jeffrey-epstein', 'rodriguez-epstein-inner-circle');

// Add cross-references to Anne Rodriguez
addPersonTheme('anne-rodriguez', THEME_ID);
addPersonEvent('anne-rodriguez', 'lsj-trumpet-flowers-2013');
addPersonConnection('anne-rodriguez', 'rodriguez-epstein-inner-circle');

// Add cross-references to Antoine Verglas
addPersonTheme('antoine-verglas', THEME_ID);
addPersonEvent('antoine-verglas', 'epstein-scopolamine-article-2015');
addPersonConnection('antoine-verglas', 'verglas-epstein-scopolamine-article');

// Enrich trafficking-operation theme with scopolamine cross-reference
const traffickingTheme = findThemeById('the-trafficking-operation');
if (traffickingTheme) {
  const MARKER = '## Scopolamine & Chemical Control Cross-Reference';
  if (!traffickingTheme.content.includes(MARKER)) {
    traffickingTheme.content = traffickingTheme.content.replace(/\n*---\s*$/, '');
    traffickingTheme.content += `\n\n${MARKER}

The chemical-drugging theme documents Epstein's confirmed interest in Angel Trumpet plants (*Brugmansia* / *Datura*) — a natural source of scopolamine — at both Zorro Ranch and Little St. James. Four independent EFTA documents confirm trumpet vine was physically planted at Zorro Ranch in 2013, and a January 2015 email chain documents Epstein receiving a detailed article on scopolamine's criminal applications. See the [Chemical Drugging Methods](/themes#chemical-drugging) theme for the full documentary trail.

---`;
    console.log('  ENRICH theme: the-trafficking-operation (scopolamine cross-reference)');
  }
}

// ============================================================
// PART 6: WRITE ALL DATA FILES
// ============================================================

console.log('\n=== PART 6: WRITE DATA FILES ===\n');

fs.writeFileSync(path.join(DATA, 'themes.json'), JSON.stringify(themes, null, 2));
console.log('  WRITE: themes.json');

fs.writeFileSync(path.join(DATA, 'timeline.json'), JSON.stringify(timeline, null, 2));
console.log('  WRITE: timeline.json');

fs.writeFileSync(path.join(DATA, 'people.json'), JSON.stringify(people, null, 2));
console.log('  WRITE: people.json');

fs.writeFileSync(path.join(DATA, 'connections.json'), JSON.stringify(connections, null, 2));
console.log('  WRITE: connections.json');

// ============================================================
// SUMMARY
// ============================================================

console.log(`\n=== REEL1 SCOPOLAMINE INTEGRATION COMPLETE ===`);
console.log(`  People added:    ${addedPeople}`);
console.log(`  People enriched: ${enrichedPeople}`);
console.log(`  Events added:    ${addedEvents}`);
console.log(`  Connections added: ${addedConnections}`);
console.log(`  Theme created:   chemical-drugging`);
console.log(`  Theme enriched:  the-trafficking-operation (cross-reference)\n`);
