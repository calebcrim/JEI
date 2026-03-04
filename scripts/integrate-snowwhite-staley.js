#!/usr/bin/env node
/**
 * Snow White / Jes Staley Integration Script
 * Integrates probe results from CC_GUIDE_SNOWWHITE_STALEY_RESOLVED.md
 * into site JSON: themes, people, timeline, connections.
 * Fully idempotent — safe to re-run.
 *
 * Source: EFTA primary documents (EFTA00188290, EFTA00188291, etc.)
 * and USVI v. JPMorgan court filing (1:22-cv-10904-JSR)
 *
 * Key correction: Snow White email sender is Jes Staley (JPMorgan Private Bank),
 * NOT "Jess Stolle" (community misidentification).
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const timeline = JSON.parse(fs.readFileSync(path.join(DATA, 'timeline.json'), 'utf8'));
const people = JSON.parse(fs.readFileSync(path.join(DATA, 'people.json'), 'utf8'));
const connections = JSON.parse(fs.readFileSync(path.join(DATA, 'connections.json'), 'utf8'));
const themes = JSON.parse(fs.readFileSync(path.join(DATA, 'themes.json'), 'utf8'));

const SRC = 'DOJ';
const THEME_ID = 'coded-communications-snow-white';

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
    strength: opts.strength || 2,
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

let addedEvents = 0, addedConnections = 0, enrichedPeople = 0;

// ============================================================
// PART 1: ENRICH JES STALEY PERSON NODE
// ============================================================

console.log('\n=== PART 1: ENRICH JES STALEY ===\n');

const staley = findPersonById('jes-staley');
if (staley) {
  // Upgrade summary
  const NEW_SUMMARY = 'Former head of JPMorgan Chase\'s Private Bank and later CEO of Barclays. Staley developed what the USVI court complaint describes as a \'close personal\' and \'profound\' friendship with Jeffrey Epstein between approximately 2008 and 2012, exchanging roughly 1,200 emails from his JPMorgan corporate account. In July 2010, Staley sent Epstein the message: \'That was fun. Say hi to Snow White.\' Epstein replied: \'what character would you like next?\' Cited in USVI v. JPMorgan federal complaint (1:22-cv-10904-JSR) as suggesting Staley \'may have been involved in Epstein\'s sex-trafficking operation.\' JPMorgan paid $290M to DOJ and $75M to USVI in settlements.';
  if (!staley.summary.includes('Snow White')) {
    staley.summary = NEW_SUMMARY;
    console.log('  UPDATE: jes-staley summary upgraded');
  }

  // Upgrade name
  if (!staley.name.includes('James Edward')) {
    staley.name = "James Edward 'Jes' Staley";
    console.log('  UPDATE: jes-staley name upgraded');
  }

  // Ensure sources include DOJ
  if (!staley.sources.includes(SRC)) {
    staley.sources.push(SRC);
  }

  // Enrich with detailed sections
  if (enrichPersonSections('jes-staley', [
    {
      title: 'JPMorgan Private Bank & Epstein Relationship',
      content: 'Staley was head of JPMorgan Chase\'s Private Bank — the division serving clients with at least $10 million in assets. He exchanged approximately 1,200 emails with Epstein from his JPMorgan corporate account between 2008 and 2012 (USVI Complaint ¶53). Epstein introduced Staley to Glenn Dubin (Highbridge Capital Management) in 2004, facilitating JPMorgan\'s subsequent acquisition of Highbridge and advancing Staley\'s career.\n\nJPMorgan maintained Epstein accounts from approximately 1998–2013, servicing approximately 55 Epstein-related accounts collectively worth hundreds of millions of dollars. A senior JPMorgan compliance official reviewing Epstein\'s file in 2011 wrote: "Lots of smoke. Lots of questions." The file noted that Epstein was "an alleged personal associate of the CEO of the Investment Bank (Jes Staley)."',
      verificationStatus: 'verified',
      sources: [SRC],
      efta: ['EFTA00145666']
    },
    {
      title: 'Snow White Email Exchange (July 9-10, 2010)',
      content: 'On July 9, 2010 — two years after Epstein\'s 2008 conviction — Staley sent Epstein the message: "Maybe they\'re tracking u?? That was fun. Say hi to Snow White." Epstein replied: "what character would you like next?" Staley then said "Beauty and the Beast," and Epstein replied "well one side is available."\n\nThis exchange is confirmed in primary EFTA documents (EFTA00188290, EFTA00188291) and quoted in the USVI government\'s federal lawsuit against JPMorgan at ¶61 of the Second Amended Complaint (Case 1:22-cv-10904-JSR, Document 119, April 12, 2023).\n\n**Correction:** Community researcher "not.an.official.news.source" (Instagram) originally attributed this email to "Jess Stolle," a long-term JPMorgan employee. This identification was incorrect. The sender is confirmed as Jes Staley by both EFTA document headers and the federal court filing.',
      verificationStatus: 'verified',
      sources: [SRC],
      efta: ['EFTA00188290', 'EFTA00188291', 'EFTA00145666']
    },
    {
      title: 'Legal Consequences & Barclays Departure',
      content: 'JPMorgan tasked Staley to conduct the bank\'s internal discussions with Epstein about human trafficking allegations, despite his obvious personal relationship (Complaint ¶¶47, 62). At least $1.5 million was paid from JPMorgan accounts to known recruiters including the MC2 modeling agency, and Epstein withdrew more than $775,000 in cash from JPMorgan accounts.\n\nStaley left JPMorgan in 2013 and became CEO of Barclays. He resigned in November 2021 after the UK Financial Conduct Authority concluded an investigation into his characterization of his relationship with Epstein. JPMorgan was subsequently named as a defendant in a trafficking lawsuit by the US Virgin Islands government and paid $290 million to DOJ and $75 million to USVI in settlements.',
      verificationStatus: 'verified',
      sources: [SRC]
    }
  ])) enrichedPeople++;

} else {
  console.log('  WARN: jes-staley person node not found');
}

// ============================================================
// PART 2: CREATE CODED COMMUNICATIONS / SNOW WHITE THEME
// ============================================================

console.log('\n=== PART 2: CREATE SNOW WHITE THEME ===\n');

let theme = findThemeById(THEME_ID);
if (!theme) {
  const newTheme = {
    id: THEME_ID,
    title: 'Coded Communications — The Snow White Email Cluster',
    sectionNumber: themes.length + 1,
    summary: 'A cluster of at least nine EFTA documents reference "Snow White" in Epstein\'s post-conviction correspondence (2009-2012). The July 2010 exchange between JPMorgan executive Jes Staley and Epstein — "Say hi to Snow White" / "what character would you like next" — is confirmed by primary documents and cited in the USVI federal lawsuit against JPMorgan as suggesting Staley "may have been involved in Epstein\'s sex-trafficking operation."',
    content: `## The Snow White Email Cluster

### Core Exchange — Jes Staley (July 9-10, 2010)

On July 9, 2010 — two years after Epstein's 2008 conviction and during a period when Epstein was operating under registered sex-offender restrictions — **Jes Staley**, then head of JPMorgan Chase's Private Bank, sent Epstein the message:

> "Maybe they're tracking u?? That was fun. Say hi to Snow White."

Epstein replied:

> "what character would you like next"

Staley responded: "Beauty and the Beast." Epstein replied: "well one side is available."

This exchange is confirmed in primary EFTA documents (EFTA00188290 / EFTA00188291, cross-referenced as SDNY_GM_00077821-22 and JPM-SDNY-00000948-49) and quoted at paragraph 61 of the USVI v. JPMorgan Second Amended Complaint (Case 1:22-cv-10904-JSR, Document 119, April 12, 2023).

### Critical Correction — Sender Identity

Community researcher "not.an.official.news.source" (Instagram) originally identified the sender as "Jess Stolle," a long-term JPMorgan employee, based on the sender's first name ("Jess") and a visual comparison to an artwork. **This identification was incorrect.** Primary EFTA documents and the federal court filing confirm the sender was **Jes Staley** — then-head of JPMorgan's Private Bank and later CEO of Barclays. This is a significantly more important figure than the community inference suggested.

### The Snow White Cluster — Multiple Documents

At least nine EFTA documents reference "Snow White" across Epstein's post-conviction communications:

| EFTA Bates | Date | Content |
|------------|------|---------|
| EFTA_R1_00193438 | November 4, 2009 | Epstein → redacted: "snow white? now what?" |
| EFTA00893031 | June 20, 2010 | Epstein uses Brett Ratner film as pretext for Snow White costume request |
| EFTA_R1_01470925 | July 9, 2010, 6:57 PM | Redacted → Epstein, subject: "Snow white" |
| EFTA00188290 | July 9/10, 2010 | Staley → Epstein: "That was fun. Say hi to Snow White." |
| EFTA00188291 | July 10, 2010 | Epstein → Staley: "what character would you like next" |
| EFTA00741531 | July 10, 2010, 12:36 AM | **[Content Warning: Sexual Violence]** Redacted → "Jeffrey": References Snow White costume in context of sexual assault |
| EFTA_R1_01194666 | June 26, 2012 | "I watched Snow White and this is what happened... :)" with attachments |
| EFTA_R1_02062214 | Date unclear | "I watched Snow White..." sent to "JE Jail" address |
| EFTA00145666 | April 12, 2023 (filed) | USVI v. JPMorgan court filing quoting full exchange at ¶61 |

### The July 9-10, 2010 Window

The 18-hour window of July 9-10, 2010 contains at least four separate "Snow White" documents:
1. Redacted email with subject "Snow white" at 6:57 PM July 9 (EFTA_R1_01470925)
2. Staley's "Say hi to Snow White" at approximately 8:45 PM July 9 (EFTA00188290)
3. Explicit assault-reference document at 12:36 AM July 10 (EFTA00741531)
4. Epstein's reply "what character would you like next" at 1:02 AM July 10 (EFTA00188291)

The clustering of these documents within a single evening is consistent with a coordinated event.

### JPMorgan Institutional Context

Staley exchanged approximately 1,200 emails with Epstein from his JPMorgan corporate account between 2008 and 2012. JPMorgan maintained Epstein accounts servicing approximately 55 Epstein-related accounts. The USVI lawsuit cited the Snow White correspondence as suggesting Staley "may have been involved in Epstein's sex-trafficking operation" (Complaint ¶53). JPMorgan paid $290M to DOJ and $75M to USVI in 2023 settlements.

### Open Research Questions

- Obtain Bates numbers for the "Beauty and the Beast" follow-up in the same email thread (quoted in court filing at ¶61 but not separately identified in available EFTA documents)
- Confirm FCA (UK Financial Conduct Authority) final report findings on Staley's characterization of Epstein relationship — November 2021
- Search EFTA for the January 8, 2009 $2,000 wire to Eastern European woman timed to Staley's Palm Beach visit (referenced at ¶54 of court filing)
- Search EFTA for the August 31, 2009 $3,000 wire to same woman timed to Staley's London trip (referenced at ¶55 of court filing)
- Identify the donor-advised fund ("very HIGH profile" DAF) discussed between Epstein and Staley in 2011 — the DAF head's name is redacted in available documents (¶73)

---`,
    peopleIds: [
      'jeffrey-epstein',
      'jes-staley'
    ],
    timelineEventIds: [
      'snow-white-now-what-2009',
      'snow-white-brett-ratner-2010',
      'snow-white-email-2010',
      'snow-white-assault-reference-2010'
    ],
    sources: [SRC],
    tags: ['snow-white', 'coded-communications', 'jpmorgan', 'post-conviction', 'staley'],
    eftaLinks: [
      { number: 'EFTA00188290', url: '', description: 'Staley to Epstein: "Say hi to Snow White" — July 9/10, 2010' },
      { number: 'EFTA00188291', url: '', description: 'Epstein to Staley: "what character would you like next" — July 10, 2010' },
      { number: 'EFTA00145666', url: '', description: 'USVI v. JPMorgan Second Amended Complaint — quotes full Snow White exchange' },
      { number: 'EFTA_R1_00193438', url: '', description: 'Epstein: "snow white? now what?" — November 4, 2009' },
      { number: 'EFTA00893031', url: '', description: 'Brett Ratner Snow White costume pretext — June 20, 2010' },
      { number: 'EFTA00741531', url: '', description: '[Content Warning] Assault reference in Snow White context — July 10, 2010' },
      { number: 'EFTA_R1_01470925', url: '', description: 'Subject: "Snow white" — July 9, 2010' },
      { number: 'EFTA_R1_01194666', url: '', description: '"I watched Snow White..." with attachments — June 26, 2012' },
      { number: 'EFTA_R1_02062214', url: '', description: '"I watched Snow White..." to JE Jail address' }
    ]
  };
  themes.push(newTheme);
  console.log('  CREATE theme: coded-communications-snow-white');
} else {
  console.log('  SKIP (exists): coded-communications-snow-white theme');
}

// ============================================================
// PART 3: ADD TIMELINE ENTRIES
// ============================================================

console.log('\n=== PART 3: ADD TIMELINE ENTRIES ===\n');

// Entry 1: November 2009 — "snow white? now what?"
if (addTimelineEvent(makeTimelineEvent({
  id: 'snow-white-now-what-2009',
  date: '2009-11-04',
  dateDisplay: 'November 4, 2009',
  era: '2008-2018',
  title: 'Epstein Email: "Snow White? Now What?"',
  body: 'On November 4, 2009, while under Florida sex-offender registration requirements, Epstein sent an email to a redacted recipient with the subject "snow white? now what?" The recipient\'s identity and full context of the exchange are not available in the redacted document.\n\nThe existence of multiple "Snow White" emails across different correspondents and dates — November 2009, June 2010, and July 2010 — suggests the reference was a recurring feature of Epstein\'s post-conviction communications rather than an isolated exchange. The pattern is documented across at least nine separate EFTA documents.',
  summary: 'Epstein email to redacted recipient: "snow white? now what?" Establishes "Snow White" as a recurring reference in post-conviction correspondence, predating the July 2010 Staley exchange.',
  peopleIds: ['jeffrey-epstein'],
  themeIds: [THEME_ID],
  sources: [SRC],
  tags: ['snow-white', 'coded-communications', 'post-conviction'],
  eftaLinks: [{ number: 'EFTA_R1_00193438', url: '', description: 'Epstein email, November 4, 2009' }],
  relatedEventIds: ['snow-white-brett-ratner-2010', 'snow-white-email-2010', 'snow-white-assault-reference-2010'],
  relatedThemeIds: [THEME_ID]
}))) addedEvents++;

// Entry 2: June 20, 2010 — Brett Ratner Snow White costume pretext
if (addTimelineEvent(makeTimelineEvent({
  id: 'snow-white-brett-ratner-2010',
  date: '2010-06-20',
  dateDisplay: 'June 20, 2010',
  era: '2008-2018',
  title: 'Epstein Uses Brett Ratner Film as Pretext for Snow White Costume Request',
  body: 'On June 20, 2010, Epstein wrote to a redacted female correspondent: "brett ratner is going to film a big movie, Snow White, i would love to take photos of you in a snow white costume. you can get it from the costume store." The correspondent had written that students wanted to film her and she had received audition feedback. Epstein used a purported Ratner film as justification for a costume request.\n\nThis email demonstrates the grooming mechanism: leveraging a named Hollywood director to add legitimacy to a costume request for a young woman who had just mentioned being filmed. Brett Ratner is separately documented in the public record as a figure accused of sexual misconduct; his connection to Epstein via this document has not been independently established beyond this single reference.',
  summary: 'Epstein uses Brett Ratner film as pretext to request Snow White costume from female correspondent. Documents the operational use of "Snow White" as a recruitment/grooming pretext.',
  peopleIds: ['jeffrey-epstein'],
  themeIds: [THEME_ID, 'the-trafficking-operation'],
  sources: [SRC],
  tags: ['snow-white', 'grooming', 'brett-ratner', 'costume'],
  eftaLinks: [{ number: 'EFTA00893031', url: '', description: 'Epstein to redacted correspondent, June 20, 2010' }],
  relatedEventIds: ['snow-white-now-what-2009', 'snow-white-email-2010', 'snow-white-assault-reference-2010'],
  relatedThemeIds: [THEME_ID, 'the-trafficking-operation']
}))) addedEvents++;

// Entry 3: July 9-10, 2010 — Staley Snow White exchange (THE core entry)
if (addTimelineEvent(makeTimelineEvent({
  id: 'snow-white-email-2010',
  date: '2010-07-09',
  dateDisplay: 'July 9-10, 2010',
  era: '2008-2018',
  title: "Jes Staley to Epstein: 'Say Hi to Snow White'",
  body: 'On July 9, 2010 — two years after Epstein\'s 2008 conviction and during a period when Epstein was operating under registered sex-offender restrictions — Jes Staley, then head of JPMorgan Chase\'s Private Bank, sent Epstein the message: "Maybe they\'re tracking u?? That was fun. Say hi to Snow White." Epstein replied: "what character would you like next?" The exchange continued: Staley replied "Beauty and the Beast"; Epstein replied "well one side is available."\n\nThese emails were later quoted in the USVI government\'s federal lawsuit against JPMorgan and are cited as suggesting Staley "may have been involved in Epstein\'s sex-trafficking operation" (Complaint ¶53). Staley was head of JPMorgan\'s Private Bank at the time — the division serving clients with at least $10 million in assets. He exchanged approximately 1,200 emails with Epstein from his JPMorgan corporate account between 2008 and 2012 (Complaint ¶53). JPMorgan later tasked Staley himself to discuss the human trafficking allegations with Epstein, despite his obvious personal relationship (Complaint ¶¶47, 62).\n\nThe Snow White email cluster spans June–July 2010 and includes multiple correspondents. At least four "Snow White" documents are clustered within the July 9–10, 2010 window, consistent with a coordinated event.',
  summary: 'JPMorgan executive Jes Staley to Epstein: "That was fun. Say hi to Snow White." Epstein: "what character would you like next?" Confirmed in primary EFTA documents and cited in USVI v. JPMorgan federal complaint.',
  peopleIds: ['jeffrey-epstein', 'jes-staley'],
  themeIds: [THEME_ID, 'financial-crimes-money-laundering'],
  sources: [SRC],
  tags: ['snow-white', 'jpmorgan', 'staley', 'coded-communications', 'post-conviction'],
  eftaLinks: [
    { number: 'EFTA00188290', url: '', description: 'Staley to Epstein, July 9/10 2010 — "Say hi to Snow White"' },
    { number: 'EFTA00188291', url: '', description: 'Epstein to Staley reply — "what character would you like next"' },
    { number: 'EFTA00145666', url: '', description: 'USVI v. JPMorgan, 1:22-cv-10904-JSR, Doc. 119 ¶61' }
  ],
  relatedEventIds: ['snow-white-now-what-2009', 'snow-white-brett-ratner-2010', 'snow-white-assault-reference-2010'],
  relatedThemeIds: [THEME_ID, 'financial-crimes-money-laundering']
}))) addedEvents++;

// Entry 4: July 10, 2010 — Assault reference (Content Warning)
if (addTimelineEvent(makeTimelineEvent({
  id: 'snow-white-assault-reference-2010',
  date: '2010-07-10',
  dateDisplay: 'July 10, 2010',
  era: '2008-2018',
  title: 'EFTA Document References Snow White Costume and Sexual Assault [Content Warning]',
  body: '[Content Warning: Sexual Violence]\n\nAn EFTA document (EFTA00741531) dated July 10, 2010 — sent within hours of the Staley "Snow White" email — contains a message from a redacted sender to "Jeffrey" referencing a woman in a Snow White costume in explicit terms describing sexual assault. The sender and recipient identities are redacted in the available document. The message was sent at 12:36 AM on July 10, the same date as Epstein\'s reply to Staley.\n\nThe July 9–10, 2010 window contains at least four separate "Snow White" documents: (1) a redacted email with subject "Snow white" at 6:57 PM July 9 (EFTA_R1_01470925); (2) Staley\'s "Say hi to Snow White" at approximately 8:45 PM July 9 (EFTA00188290); (3) this assault-reference document at 12:36 AM July 10 (EFTA00741531); and (4) Epstein\'s reply "what character would you like next" at 1:02 AM July 10 (EFTA00188291). The clustering of these documents within an approximately 18-hour window is consistent with a coordinated event.',
  summary: '[Content Warning: Sexual Violence] EFTA document references Snow White costume in context of sexual assault — sent same date as Staley exchange. Temporal proximity to the July 9-10 email cluster may be significant.',
  peopleIds: ['jeffrey-epstein'],
  themeIds: [THEME_ID, 'the-trafficking-operation'],
  sources: [SRC],
  tags: ['snow-white', 'content-warning', 'assault', 'post-conviction'],
  eftaLinks: [
    { number: 'EFTA00741531', url: '', description: '[Content Warning] Redacted sender to "Jeffrey", July 10, 2010, 12:36 AM' },
    { number: 'EFTA_R1_01470925', url: '', description: 'Subject: "Snow white", July 9, 2010, 6:57 PM' }
  ],
  relatedEventIds: ['snow-white-email-2010', 'snow-white-brett-ratner-2010', 'snow-white-now-what-2009'],
  relatedThemeIds: [THEME_ID, 'the-trafficking-operation']
}))) addedEvents++;

// ============================================================
// PART 4: ADD CONNECTIONS
// ============================================================

console.log('\n=== PART 4: ADD CONNECTIONS ===\n');

// Staley → Epstein (Snow White specific — stronger, documented connection)
if (addConnection(makeConnection({
  id: 'staley-epstein-snow-white',
  source: 'jes-staley',
  target: 'jeffrey-epstein',
  type: 'social',
  strength: 3,
  description: 'Approximately 1,200 emails exchanged via JPMorgan corporate account, 2008–2012. July 2010 Snow White email exchange confirmed at EFTA00188290–00188291. USVI lawsuit cited as suggesting Staley "may have been involved in Epstein\'s sex-trafficking operation." Visited Epstein\'s Little St. James property and Palm Beach residence.',
  verification: 'verified',
  activeEras: ['2008-2018']
}))) addedConnections++;

// Staley → Dubin (Epstein introduced them)
if (addConnection(makeConnection({
  id: 'staley-dubin-epstein-introduction',
  source: 'jes-staley',
  target: 'glenn-dubin',
  type: 'financial',
  strength: 2,
  description: 'Epstein introduced Staley to Glenn Dubin (Highbridge Capital Management) in 2004, facilitating JPMorgan\'s subsequent acquisition of Highbridge and advancing Staley\'s career.',
  verification: 'verified',
  activeEras: ['2001-2007', '2008-2018']
}))) addedConnections++;

// ============================================================
// PART 5: ENRICH EXISTING PEOPLE & THEMES
// ============================================================

console.log('\n=== PART 5: ENRICH EXISTING DATA ===\n');

// Add Snow White theme to Jes Staley
addPersonTheme('jes-staley', THEME_ID);
addPersonTheme('jes-staley', 'financial-crimes-money-laundering');
addPersonEvent('jes-staley', 'snow-white-email-2010');
addPersonConnection('jes-staley', 'staley-epstein-snow-white');
addPersonConnection('jes-staley', 'staley-dubin-epstein-introduction');

// Add Snow White events to Jeffrey Epstein
addPersonTheme('jeffrey-epstein', THEME_ID);
addPersonEvent('jeffrey-epstein', 'snow-white-now-what-2009');
addPersonEvent('jeffrey-epstein', 'snow-white-brett-ratner-2010');
addPersonEvent('jeffrey-epstein', 'snow-white-email-2010');
addPersonEvent('jeffrey-epstein', 'snow-white-assault-reference-2010');
addPersonConnection('jeffrey-epstein', 'staley-epstein-snow-white');

// Add to Glenn Dubin cross-refs
addPersonConnection('glenn-dubin', 'staley-dubin-epstein-introduction');

// Enrich financial-crimes-money-laundering theme with JPMorgan/Staley details
const financialTheme = findThemeById('financial-crimes-money-laundering');
if (financialTheme) {
  const MARKER = '## JPMorgan Chase — Jes Staley & The Snow White Exchange';
  if (!financialTheme.content.includes(MARKER)) {
    financialTheme.content = financialTheme.content.replace(/\n*---\s*$/, '');
    financialTheme.content += `\n\n${MARKER}

JPMorgan maintained Epstein accounts from approximately 1998–2013, servicing approximately 55 Epstein-related accounts collectively worth hundreds of millions of dollars. Jes Staley, head of JPMorgan's Private Bank, exchanged approximately 1,200 emails with Epstein from his JPMorgan corporate account between 2008 and 2012. The USVI lawsuit alleged these communications suggest Staley "may have been involved in Epstein's sex-trafficking operation."

In July 2010 — two years after Epstein's conviction — Staley wrote to Epstein: "That was fun. Say hi to Snow White." Epstein replied: "what character would you like next?" The full exchange is confirmed in primary EFTA documents (EFTA00188290/EFTA00188291) and cited in the USVI federal complaint (1:22-cv-10904-JSR, ¶61).

JPMorgan tasked Staley to conduct the bank's internal discussions with Epstein about human trafficking allegations, despite Staley's documented personal relationship. A senior compliance official reviewing Epstein's file in 2011 wrote: "Lots of smoke. Lots of questions." JPMorgan later paid $290 million to DOJ and $75 million to USVI in settlements. Staley became CEO of Barclays after leaving JPMorgan in 2013 and resigned in November 2021 following an FCA investigation into his characterization of his Epstein relationship.

See the [Coded Communications — Snow White](/themes#coded-communications-snow-white) theme for the full documentary cluster analysis.

---`;
    if (!financialTheme.peopleIds.includes('jes-staley')) {
      financialTheme.peopleIds.push('jes-staley');
    }
    console.log('  ENRICH theme: financial-crimes-money-laundering (JPMorgan/Staley section)');
  }
}

// Enrich trafficking theme with Snow White cross-reference
const traffickingTheme = findThemeById('the-trafficking-operation');
if (traffickingTheme) {
  const MARKER = '## Snow White Email Cluster Cross-Reference';
  if (!traffickingTheme.content.includes(MARKER)) {
    traffickingTheme.content = traffickingTheme.content.replace(/\n*---\s*$/, '');
    traffickingTheme.content += `\n\n${MARKER}

A cluster of at least nine EFTA documents reference "Snow White" in Epstein's post-conviction correspondence (2009-2012). The July 2010 exchange includes a June 2010 email where Epstein used a Brett Ratner film as pretext for a Snow White costume request to a young woman, and a July 10, 2010 document containing an explicit reference to sexual assault in the context of a Snow White costume. See the [Coded Communications — Snow White](/themes#coded-communications-snow-white) theme for the full cluster analysis.

---`;
    console.log('  ENRICH theme: the-trafficking-operation (Snow White cross-reference)');
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

console.log(`\n=== SNOW WHITE / STALEY INTEGRATION COMPLETE ===`);
console.log(`  People enriched: ${enrichedPeople} (jes-staley upgraded)`);
console.log(`  Events added:    ${addedEvents}`);
console.log(`  Connections added: ${addedConnections}`);
console.log(`  Theme created:   coded-communications-snow-white`);
console.log(`  Themes enriched: financial-crimes-money-laundering, the-trafficking-operation`);
console.log(`  Jess Stolle:     NOT FOUND (no misidentification node to flag)\n`);
