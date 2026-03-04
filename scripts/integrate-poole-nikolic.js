#!/usr/bin/env node
/**
 * integrate-poole-nikolic.js
 *
 * Integrates the Epstein ↔ Christopher Poole ("moot") / Boris Nikolic probe.
 * Source: CC_GUIDE_POOLE_NIKOLIC_INTEGRATED.md
 *
 * EFTA-verified: Boris Nikolic brokered introduction Oct 2011.
 * /pol/ launched Oct 23, 2011 — same week as introduction.
 * "The potential for manipulation is huge" — Nikolic's own words (EFTA_R1_00482682).
 *
 * Fully idempotent — safe to re-run.
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const timeline   = JSON.parse(fs.readFileSync(path.join(DATA, 'timeline.json'), 'utf8'));
const people     = JSON.parse(fs.readFileSync(path.join(DATA, 'people.json'), 'utf8'));
const connections = JSON.parse(fs.readFileSync(path.join(DATA, 'connections.json'), 'utf8'));
const themes     = JSON.parse(fs.readFileSync(path.join(DATA, 'themes.json'), 'utf8'));

const SRC = 'DOJ';

/* ── helpers ─────────────────────────────────────────────── */

function findTimelineById(id) { return timeline.find(e => e.id === id); }
function findPersonById(id)   { return people.find(p => p.id === id); }
function findThemeById(id)    { return themes.find(t => t.id === id); }
function findConnectionById(id) { return connections.find(c => c.id === id); }

function addTimelineEvent(event) {
  if (findTimelineById(event.id)) { console.log(`  SKIP (exists): ${event.id}`); return false; }
  timeline.push(event);
  console.log(`  ADD event: ${event.id}`);
  return true;
}

function addPerson(person) {
  if (findPersonById(person.id)) { console.log(`  SKIP (exists): ${person.id}`); return false; }
  people.push(person);
  console.log(`  ADD person: ${person.id}`);
  return true;
}

function addConnection(conn) {
  if (findConnectionById(conn.id)) { console.log(`  SKIP (exists): ${conn.id}`); return false; }
  connections.push(conn);
  console.log(`  ADD connection: ${conn.id}`);
  return true;
}

function enrichPersonSections(personId, newSections) {
  const person = findPersonById(personId);
  if (!person) { console.log(`  WARN: person ${personId} not found`); return false; }
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
    if (!person.sources) person.sources = [];
    if (!person.sources.includes(SRC)) person.sources.push(SRC);
    console.log(`  ENRICH person: ${personId} (+${added} sections)`);
    return true;
  }
  return false;
}

function addPersonTheme(personId, themeId) {
  const person = findPersonById(personId);
  if (person && !person.themeIds.includes(themeId)) person.themeIds.push(themeId);
}

function addPersonEvent(personId, eventId) {
  const person = findPersonById(personId);
  if (person && !person.timelineEventIds.includes(eventId)) person.timelineEventIds.push(eventId);
}

function addPersonConnection(personId, connId) {
  const person = findPersonById(personId);
  if (person && !person.connectionIds.includes(connId)) person.connectionIds.push(connId);
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
    themeIds: opts.themeIds || [],
    sources: opts.sources || [SRC],
    tags: opts.tags || [],
    summary: opts.summary || opts.body.split('\n')[0].substring(0, 300),
    eftaLinks: opts.eftaLinks || [],
    relatedEventIds: opts.relatedEventIds || [],
    relatedThemeIds: opts.relatedThemeIds || [],
    discrepancies: opts.discrepancies || [],
    verificationStatus: opts.verificationStatus || 'verified'
  };
}

function makePerson(opts) {
  return {
    id: opts.id,
    name: opts.name,
    aliases: opts.aliases || [],
    born: opts.born,
    died: opts.died,
    category: opts.category || 'other',
    summary: opts.summary,
    sections: opts.sections || [],
    timelineEventIds: opts.timelineEventIds || [],
    themeIds: opts.themeIds || [],
    connectionIds: opts.connectionIds || [],
    sources: opts.sources || [SRC]
  };
}

function makeConnection(opts) {
  return {
    id: opts.id,
    sourcePersonId: opts.source,
    targetPersonId: opts.target,
    relationshipType: opts.type || 'associate',
    strength: opts.strength || 2,
    description: opts.description,
    sources: opts.sources || [SRC],
    verificationStatus: opts.verification || 'verified',
    activeEras: []
  };
}

/* ── counters ────────────────────────────────────────────── */

let addedPeople = 0, addedEvents = 0, addedConnections = 0, enrichedPeople = 0;

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║  POOLE / NIKOLIC PROBE INTEGRATION              ║');
console.log('╚══════════════════════════════════════════════════╝\n');

/* ═══════════════════════════════════════════════════════════
   PART 1: NEW PEOPLE
   ═══════════════════════════════════════════════════════════ */

console.log('=== PART 1: NEW PEOPLE ===\n');

// Christopher Poole ("moot")
if (addPerson(makePerson({
  id: 'christopher-poole',
  name: 'Christopher Poole',
  aliases: ['moot'],
  category: 'media',
  summary: 'Founder of 4chan.org (launched 2003), known online as "moot." Introduced to Epstein by Boris Nikolic in October 2011. Nikolic explicitly cited "the potential for manipulation is huge" in EFTA emails. /pol/ launched October 23, 2011 — three days after the introduction email. Poole met Epstein once for "an unmemorable lunch meeting" per his own February 2026 statement. No contact documented after February 2012.',
  sections: [
    {
      title: 'Nikolic Introduction & /pol/ Timeline (October 2011)',
      content: 'Boris Nikolic — Harvard physician, biotech investor, and Chief Advisor for Science and Technology to Bill Gates at bgC3 (Kirkland, WA) — met Christopher Poole in San Francisco and immediately emailed Epstein on October 20, 2011: "There is a cool guy (KID) that you should meet" with a link to Poole\'s Wikipedia page (EFTA_R1_00486371).\n\nThree days later, on **October 23, 2011**, Poole launched 4chan\'s **/pol/ (Politically Incorrect)** board — confirmed by moot\'s own announcement post preserved via WebCite archive.\n\nBy October 24, Nikolic asked Epstein "How did you like moot?" and Epstein replied "I liked him a lot" (EFTA01852812) — confirming an in-person social encounter had occurred around October 22–24.\n\nOn October 25, Nikolic planned a three-way meeting at Epstein\'s NYC townhouse for November 10–12, plus a covert Seattle trip with Poole: "he does NOT know that yet — please keep it confidential" (EFTA_R1_00498434).\n\nOn October 28, Nikolic sent Epstein a Washington Post article about 4chan\'s capacity for anonymous mass manipulation with the message: **"The potential for manipulation is huge"** (EFTA_R1_00482682).\n\nThe community claim that /pol/ launched on "the same day" as the Epstein-Poole meeting is contradicted: /pol/ launched October 23, three days after the introduction email. Same-week proximity is confirmed.\n\n---',
      sources: [SRC],
      verificationStatus: 'verified',
      efta: ['EFTA_R1_00486371', 'EFTA01852812', 'EFTA_R1_00498434', 'EFTA_R1_00482682']
    },
    {
      title: 'Meeting Attempts & Contact Window (Oct 2011 – Feb 2012)',
      content: 'In January 2012, Epstein\'s assistant contacted Poole to schedule a direct meeting ("come see Jeffrey"). Poole confirmed Sunday January 29 at 3pm, then cancelled when a friend passed away (EFTA_R1_00861920/00861921). The assistant\'s response — "We will get you together one of these days" — implies prior scheduling attempts had also failed.\n\nA final meeting attempt is referenced in EFTA00420456 (February 2012), after which contact goes cold. Ryan Broderick (Garbage Day) reports "nearly a hundred emails going back and forth about how Poole kept flaking on them."\n\nNo evidence of Epstein-Poole contact after approximately February 2012 exists in 3.5 million released EFTA pages. Poole does not appear in flight logs or the "little black book."\n\nPoole\'s own statement (The Verge, February 13, 2026): "His assistant reached out to me afterward, and I met with him one time for an unmemorable lunch meeting. I did not meet him again nor maintain contact."\n\n---',
      sources: [SRC, 'OSINT'],
      verificationStatus: 'verified',
      efta: ['EFTA_R1_00861920', 'EFTA_R1_00861921', 'EFTA00420456']
    },
    {
      title: 'Epstein\'s Continued 4chan Interest (Post-Poole)',
      content: 'Despite losing contact with Poole, Epstein\'s interest in 4chan persisted. In 2017, Epstein sent girlfriend Karyna Shuliak a 4chan link with explicit content. That same year, journalist Michael Wolff connected Epstein with Steve Bannon; they subsequently discussed using 4chan and cryptocurrency for populist/nationalist coalition-building. In 2015, Epstein intermediaries corresponded with far-right YouTuber Jean-François Gariépy, offering PR/marketing advice.\n\n---',
      sources: [SRC, 'OSINT'],
      verificationStatus: 'unverified'
    }
  ],
  timelineEventIds: ['2011-10-20-nikolic-introduces-poole', '2012-01-27-poole-meeting-cancelled'],
  themeIds: ['intelligence-connections', 'media-congressional-investigations'],
  connectionIds: ['poole-epstein-scheduled', 'nikolic-poole-broker'],
  sources: [SRC, 'OSINT']
}))) addedPeople++;


/* ═══════════════════════════════════════════════════════════
   PART 2: ENRICH EXISTING PEOPLE
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 2: ENRICH EXISTING PEOPLE ===\n');

// Boris Nikolic — 4chan/Poole brokerage
if (enrichPersonSections('boris-nikolic', [
  {
    title: '4chan / Christopher Poole Introduction (Oct 2011)',
    content: 'In October 2011, while serving as Chief Advisor for Science and Technology to Bill Gates at bgC3 (Kirkland, WA), Nikolic met 4chan founder Christopher Poole ("moot") in San Francisco and immediately flagged him to Epstein: "There is a cool guy (KID) that you should meet" (EFTA_R1_00486371, Oct 20, 2011).\n\nNikolic orchestrated a planned three-way meeting at Epstein\'s NYC townhouse for November 10–12 and a covert Seattle trip with Poole that Poole did not know about: "he does NOT know that yet — please keep it confidential" (EFTA_R1_00498434, Oct 25). The Seattle trip — to Nikolic\'s own base at bgC3 — may have been a planned introduction to Bill Gates.\n\nEight days after the introduction, Nikolic sent Epstein a Washington Post article documenting 4chan\'s capacity for anonymous mass manipulation with the explicit assessment: **"The potential for manipulation is huge"** (EFTA_R1_00482682, Oct 28, 2011).\n\nThe WaPo article ("4chan users seize Internet\'s power for mass disruptions," Ariana Eunjung Cha, Aug 10, 2010) documented 4chan coordinating market manipulation, hoax events, and information ecosystem gaming — all at zero cost with complete anonymity.\n\n---',
    sources: [SRC],
    verificationStatus: 'verified',
    efta: ['EFTA_R1_00486371', 'EFTA_R1_00498434', 'EFTA_R1_00482682']
  }
])) enrichedPeople++;

// Jeffrey Epstein — 4chan interest thread
if (enrichPersonSections('jeffrey-epstein', [
  {
    title: '4chan / Christopher Poole Thread (2011–2017)',
    content: 'In October 2011, Boris Nikolic introduced Epstein to 4chan founder Christopher Poole ("moot"), explicitly citing "the potential for manipulation is huge" (EFTA_R1_00482682). 4chan\'s /pol/ board launched October 23, 2011 — three days after the introduction email. Epstein met Poole at a social event around October 22–24 and told Nikolic "I liked him a lot" (EFTA01852812). Meeting scheduling continued through early 2012 but Poole "kept flaking." No contact documented after February 2012.\n\nEpstein\'s 4chan interest persisted: in 2017 he sent girlfriend Karyna Shuliak a 4chan link with explicit content, and that same year discussed using 4chan and cryptocurrency for populist/nationalist coalition-building with Steve Bannon (introduced via Michael Wolff).\n\n---',
    sources: [SRC, 'OSINT'],
    verificationStatus: 'verified',
    efta: ['EFTA_R1_00486371', 'EFTA01852812', 'EFTA_R1_00498434', 'EFTA_R1_00482682']
  }
])) enrichedPeople++;


/* ═══════════════════════════════════════════════════════════
   PART 3: TIMELINE EVENTS
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 3: TIMELINE EVENTS ===\n');

// Task 2: Oct 20, 2011 introduction
if (addTimelineEvent(makeTimelineEvent({
  id: '2011-10-20-nikolic-introduces-poole',
  date: '2011-10-20',
  dateDisplay: 'October 20, 2011',
  era: '2008-2018',
  title: 'Boris Nikolic introduces Epstein to 4chan founder Christopher Poole ("moot"); /pol/ launches 3 days later',
  body: 'Boris Nikolic — Chief Advisor for Science and Technology to Bill Gates at bgC3, Kirkland WA — meets 4chan founder Christopher Poole ("moot") in San Francisco and emails Epstein: "There is a cool guy (KID) that you should meet," sharing Poole\'s Wikipedia page (EFTA_R1_00486371).\n\nThree days later, on October 23, Poole launches 4chan\'s /pol/ (Politically Incorrect) board. By October 24, Epstein tells Nikolic "I liked him a lot" after meeting Poole at a social event (EFTA01852812). On October 25, Nikolic plans a group meeting at Epstein\'s NYC townhouse for November 10–12, plus a covert Seattle trip with Poole: "he does NOT know that yet — please keep it confidential" (EFTA_R1_00498434). On October 28, Nikolic sends Epstein a Washington Post article about 4chan\'s anonymous mass manipulation capacity with the message: "The potential for manipulation is huge" (EFTA_R1_00482682).\n\nThe community claim that /pol/ launched on "the same day" as the Epstein-Poole meeting is contradicted. /pol/ launched October 23 — three days after the introduction email and approximately one day before the in-person social encounter. Same-week proximity is confirmed.',
  peopleIds: ['jeffrey-epstein', 'boris-nikolic', 'christopher-poole'],
  themeIds: ['intelligence-connections', 'media-congressional-investigations'],
  sources: [SRC],
  tags: ['intelligence', 'media'],
  summary: 'Boris Nikolic introduces 4chan founder Christopher Poole to Epstein. /pol/ launches 3 days later. Nikolic: "The potential for manipulation is huge."',
  eftaLinks: [
    {
      number: 'EFTA_R1_00486371',
      url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA01992938.pdf',
      description: 'Boris Nikolic → Epstein: introduces Christopher Poole, Oct 20, 2011',
      mediaType: 'pdf',
      sensitive: false
    },
    {
      number: 'EFTA_R1_00498434',
      url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA02001495.pdf',
      description: 'Nikolic plans NYC meeting + covert Seattle trip, Oct 25, 2011',
      mediaType: 'pdf',
      sensitive: false
    },
    {
      number: 'EFTA_R1_00482682',
      url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA01990136.pdf',
      description: '"The potential for manipulation is huge" — Nikolic to Epstein, Oct 28, 2011',
      mediaType: 'pdf',
      sensitive: false
    }
  ],
  relatedEventIds: ['2012-01-27-poole-meeting-cancelled'],
  relatedThemeIds: ['intelligence-connections', 'media-congressional-investigations'],
  discrepancies: [{
    description: 'Community claim: /pol/ launched same day as Epstein-Poole meeting. CONTRADICTED: /pol/ launched Oct 23, three days after the introduction email. Poole met Epstein ~Oct 24. Same-week proximity confirmed.',
    resolution: 'Resolved via moot\'s own announcement post (WebCite archive) and EFTA date stamps.'
  }]
}))) addedEvents++;

// Task 3: Jan 27, 2012 direct scheduling
if (addTimelineEvent(makeTimelineEvent({
  id: '2012-01-27-poole-meeting-cancelled',
  date: '2012-01-27',
  dateDisplay: 'January 27, 2012',
  era: '2008-2018',
  title: 'Epstein\'s office schedules direct meeting with 4chan founder Poole; cancelled due to bereavement',
  body: 'Three months after Boris Nikolic\'s introduction, Epstein\'s assistant contacts Chris Poole to schedule a meeting ("come see Jeffrey"). Poole confirms Sunday January 29 at 3pm, then cancels: "A friend passed away today and I don\'t think I\'ll make it out of my house this weekend." The assistant\'s response — "We will get you together one of these days" — implies prior scheduling attempts had also failed (EFTA_R1_00861920/00861921).\n\nA final meeting attempt is referenced in EFTA00420456 (February 2012), after which contact goes cold. No evidence of Epstein-Poole contact after approximately February 2012 exists in 3.5 million released EFTA pages.\n\nPoole\'s own statement (The Verge, February 13, 2026): "I met with him one time for an unmemorable lunch meeting. I did not meet him again nor maintain contact."',
  peopleIds: ['jeffrey-epstein', 'christopher-poole'],
  themeIds: ['intelligence-connections'],
  sources: [SRC],
  tags: ['media'],
  summary: 'Epstein\'s office directly schedules meeting with 4chan founder Poole; cancelled due to friend\'s death. Last known contact ~Feb 2012.',
  eftaLinks: [
    {
      number: 'EFTA_R1_00861920',
      url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA02175440.pdf',
      description: 'Epstein assistant ↔ Chris Poole scheduling, Jan 27, 2012',
      mediaType: 'pdf',
      sensitive: false
    }
  ],
  relatedEventIds: ['2011-10-20-nikolic-introduces-poole'],
  relatedThemeIds: ['intelligence-connections']
}))) addedEvents++;


/* ═══════════════════════════════════════════════════════════
   PART 4: CONNECTIONS
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 4: CONNECTIONS ===\n');

// Nikolic → Poole (broker)
if (addConnection(makeConnection({
  id: 'nikolic-poole-broker',
  source: 'boris-nikolic',
  target: 'christopher-poole',
  type: 'associate',
  strength: 3,
  description: 'Nikolic met Poole in San Francisco and introduced him to Epstein in October 2011, sharing his Wikipedia bio and explicitly citing "the potential for manipulation is huge." Planned coordinated meetings at Epstein\'s NYC townhouse and a covert Seattle trip. EFTA-verified.',
  sources: [SRC],
  verification: 'verified'
}))) addedConnections++;

// Poole → Epstein (scheduled meeting)
if (addConnection(makeConnection({
  id: 'poole-epstein-scheduled',
  source: 'christopher-poole',
  target: 'jeffrey-epstein',
  type: 'associate',
  strength: 2,
  description: 'Boris Nikolic brokered introduction Oct 2011. Epstein met Poole at a social event ~Oct 22–24 and "liked him a lot." Direct meeting scheduled via Epstein\'s office Jan 2012 (cancelled). No confirmed contact after ~Feb 2012. Poole: "I met with him one time for an unmemorable lunch meeting."',
  sources: [SRC, 'OSINT'],
  verification: 'verified'
}))) addedConnections++;


/* ═══════════════════════════════════════════════════════════
   PART 5: ENRICH THEMES
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 5: ENRICH THEMES ===\n');

// Enrich "intelligence-connections" with 4chan/manipulation thread
const intelTheme = findThemeById('intelligence-connections');
if (intelTheme) {
  const MARKER = '4chan / Digital Manipulation Thread';
  if (!intelTheme.content.includes(MARKER)) {
    intelTheme.content = intelTheme.content.replace(/\n*---\s*$/, '');
    intelTheme.content += `\n\n## ${MARKER}\n\nEFTA-verified: Boris Nikolic introduced Epstein to 4chan founder Christopher Poole ("moot") in October 2011. /pol/ launched October 23, 2011 — three days after the introduction email and approximately one day before the Epstein-Poole social encounter. In EFTA documents, Nikolic explicitly cited **"the potential for manipulation is huge"** (EFTA_R1_00482682) when flagging Poole to Epstein, alongside a Washington Post article documenting 4chan's capacity for anonymous mass manipulation (market manipulation, information ecosystem gaming, cascading amplification at zero cost).\n\nNikolic at the time was Chief Advisor for Science and Technology to Bill Gates at bgC3 in Seattle. He planned a covert Seattle trip with Poole ("he does NOT know that yet — keep it confidential") that may have been a Gates introduction. The connection between Epstein and Poole is EFTA-documented. Claimed downstream effects on political radicalization are community analysis and should not be conflated with the verified factual anchor.\n\nPoole stepped down from 4chan in January 2015 and joined Google in 2016. No Epstein-Poole contact is documented after February 2012.\n\n---`;
    if (!intelTheme.sources.includes(SRC)) intelTheme.sources.push(SRC);
    if (!intelTheme.peopleIds.includes('christopher-poole')) intelTheme.peopleIds.push('christopher-poole');
    const intelEvents = ['2011-10-20-nikolic-introduces-poole', '2012-01-27-poole-meeting-cancelled'];
    for (const eid of intelEvents) {
      if (!intelTheme.timelineEventIds.includes(eid)) intelTheme.timelineEventIds.push(eid);
    }
    console.log('  ENRICH theme: intelligence-connections');
  } else {
    console.log('  SKIP theme (exists): intelligence-connections');
  }
}

// Enrich "media-congressional-investigations" with digital manipulation context
const mediaTheme = findThemeById('media-congressional-investigations');
if (mediaTheme) {
  const MARKER2 = '4chan / Anonymous Mass Manipulation';
  if (!mediaTheme.content.includes(MARKER2)) {
    mediaTheme.content = mediaTheme.content.replace(/\n*---\s*$/, '');
    mediaTheme.content += `\n\n## ${MARKER2}\n\nIn October 2011, Boris Nikolic introduced Epstein to 4chan founder Christopher Poole and explicitly framed the interest as "the potential for manipulation is huge" (EFTA_R1_00482682). The accompanying Washington Post article documented 4chan users coordinating market manipulation, hoaxes triggering airport evacuations, hacking political figures' email, and gaming media narratives — all anonymously and at zero cost. Epstein's interest in 4chan persisted after losing contact with Poole: in 2017, he discussed using 4chan and cryptocurrency for populist/nationalist coalition-building with Steve Bannon.\n\n---`;
    if (!mediaTheme.sources.includes(SRC)) mediaTheme.sources.push(SRC);
    if (!mediaTheme.peopleIds.includes('christopher-poole')) mediaTheme.peopleIds.push('christopher-poole');
    if (!mediaTheme.timelineEventIds.includes('2011-10-20-nikolic-introduces-poole')) {
      mediaTheme.timelineEventIds.push('2011-10-20-nikolic-introduces-poole');
    }
    console.log('  ENRICH theme: media-congressional-investigations');
  } else {
    console.log('  SKIP theme (exists): media-congressional-investigations');
  }
}


/* ═══════════════════════════════════════════════════════════
   PART 6: WIRE UP REFERENCES
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 6: WIRE UP REFERENCES ===\n');

// Wire Epstein to new events
addPersonEvent('jeffrey-epstein', '2011-10-20-nikolic-introduces-poole');
addPersonEvent('jeffrey-epstein', '2012-01-27-poole-meeting-cancelled');

// Wire Nikolic to new events
addPersonEvent('boris-nikolic', '2011-10-20-nikolic-introduces-poole');

// Wire Epstein to new connections
addPersonConnection('jeffrey-epstein', 'poole-epstein-scheduled');

// Wire Nikolic to new connections
addPersonConnection('boris-nikolic', 'nikolic-poole-broker');

// Wire themes
addPersonTheme('christopher-poole', 'intelligence-connections');
addPersonTheme('christopher-poole', 'media-congressional-investigations');

console.log('  Wired all people ↔ events, themes, and connections');


/* ═══════════════════════════════════════════════════════════
   WRITE FILES
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== WRITING FILES ===\n');

fs.writeFileSync(path.join(DATA, 'people.json'),      JSON.stringify(people, null, 2));
fs.writeFileSync(path.join(DATA, 'timeline.json'),     JSON.stringify(timeline, null, 2));
fs.writeFileSync(path.join(DATA, 'connections.json'),   JSON.stringify(connections, null, 2));
fs.writeFileSync(path.join(DATA, 'themes.json'),        JSON.stringify(themes, null, 2));

console.log(`\n╔══════════════════════════════════════════════════╗`);
console.log(`║  POOLE / NIKOLIC PROBE INTEGRATION COMPLETE     ║`);
console.log(`╠══════════════════════════════════════════════════╣`);
console.log(`║  New people:      ${String(addedPeople).padStart(3)}                          ║`);
console.log(`║  Enriched people: ${String(enrichedPeople).padStart(3)}                          ║`);
console.log(`║  New events:      ${String(addedEvents).padStart(3)}                          ║`);
console.log(`║  New connections: ${String(addedConnections).padStart(3)}                          ║`);
console.log(`╚══════════════════════════════════════════════════╝\n`);
