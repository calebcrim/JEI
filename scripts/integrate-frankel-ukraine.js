#!/usr/bin/env node
/**
 * integrate-frankel-ukraine.js
 *
 * Integrates data from the Frankel / Ukraine probe (CC_PROBE_UPDATE_FRANKEL_UKRAINE.md).
 * Resolves the Keith Frankel "body boxes" thread, Tikva Children's Home / Ed Frankel,
 * and the David Stern / Odessa email.
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
console.log('║  FRANKEL / UKRAINE PROBE INTEGRATION            ║');
console.log('╚══════════════════════════════════════════════════╝\n');

/* ═══════════════════════════════════════════════════════════
   PART 1: NEW PEOPLE
   ═══════════════════════════════════════════════════════════ */

console.log('=== PART 1: NEW PEOPLE ===\n');

// Keith Frankel
if (addPerson(makePerson({
  id: 'keith-frankel',
  name: 'Keith Frankel',
  category: 'financial',
  summary: 'New Jersey-based businessman documented in 460+ EFTA email records. Confirmed visitor to Epstein\'s Palm Beach residence (EFTA02429595: March 7, 2010). Maintained regular email contact regarding commercial ventures including a product licensing pitch to Victoria\'s Secret. The widely-flagged "body boxes" phrase refers to product packaging for a body sculpting supplement line — not trafficking terminology. Father Ed Frankel is chairman of Tikva Children\'s Home in Odessa, Ukraine (EIN 22-3779212).',
  sections: [
    {
      title: 'Role & Business Relationship',
      content: 'Businessman who maintained regular email contact with Epstein, documented in 460+ EFTA records (confirmed via Jmail.world full-text search). Confirmed visitor to Epstein\'s Palm Beach residence: EFTA02429595 (DataSet 11) records that "Keith Frankel is confirmed to be at the PB house this Sunday, March 7th" (email from Story Cowles, sent March 5, 2010).\n\nFrankel proposed product licensing deals to Epstein involving Victoria\'s Secret. The relationship was active post-conviction (2010 onward).\n\n---',
      sources: [SRC, 'JMail'],
      verificationStatus: 'verified',
      efta: ['EFTA02429595', 'EFTA02409201', 'EFTA00737715']
    },
    {
      title: '"Body Boxes" Product Pitch (EFTA00764733)',
      content: 'The phrase "body boxes" that community researchers flagged as suspicious is fully explained by two EFTA documents:\n\n- **EFTA00764733** (Feb 10, 2010): Keith Frankel → Jeffrey Epstein. Subject: "FW: The Body Boxes." Body: "SO- NU?" with attachment `The_BODY_Box.pdf`\n- **EFTA00764728** (Feb 10–11, 2010): Multi-message chain. Frankel pitches Epstein on "THE BODY — 28 DAY BODY SCULPTING SYSTEM" — a health/supplement product line modeled on QuickTrim. Epstein replies: "don\'t waste your time with the box. ingredients. concepts. box design and girls would be vs."\n\nFrankel\'s follow-up: "THIS IS THE PRODUCT SUGGESTION: LET ME DO WHAT I KNOW HOW TO DO... CORE ITEM DESIGNED AROUND CLEANSING AND BURNING LIKE QUICK TRIM."\n\nA separate March 2010 chain (EFTA02683530 / EFTA_R1_02001115–02001118) shows Frankel writing: "We are getting hounded, we are going to lose the deal and VS is going to end up buying from a broker." The chain includes a forwarded email from Shelly Marchetti (APA Talent and Literary Agency, Beverly Hills) referencing "the lingerie company... they operate under international intimates for private label with Victoria Secrets."\n\n**Conclusion:** "The Body Boxes" refers to product packaging for a body sculpting supplement line being pitched to Victoria\'s Secret. The phrase has no ambiguous or sinister meaning in context.\n\n---',
      sources: [SRC],
      verificationStatus: 'verified',
      efta: ['EFTA00764733', 'EFTA00764728', 'EFTA02683530']
    },
    {
      title: 'Frankel Family — Tikva Children\'s Home Connection',
      content: 'Keith Frankel\'s father Ed Frankel is chairman of the board of Tikva Children\'s Home, a registered 501(c)(3) Jewish charity (EIN 22-3779212, West Caldwell, NJ) serving at-risk Jewish children in Odessa, Ukraine. Founded in 1996 by Rabbi Shlomo Bakst. Per Sun Sentinel (April 24, 2017), the organization has helped more than 500 children from Tikva\'s homes and schools in Odessa relocate to Israel. Tikva serves approximately 2,500 Jewish children in Odessa who are at risk of homelessness, trafficking, and exploitation.\n\nThe Ed Frankel–Keith Frankel familial relationship is based on community researcher claims and surname match but has not been independently confirmed via public record.\n\nIMPORTANT: Tikva Children\'s Home is a legitimate humanitarian organization. This entry exists to document the factual public record and allow future researchers to independently verify or refute community claims.\n\n---',
      sources: [SRC, 'OSINT'],
      verificationStatus: 'unverified'
    }
  ],
  timelineEventIds: ['2010-02-10-frankel-body-boxes', '2010-03-07-frankel-pb-visit'],
  themeIds: ['the-trafficking-operation', 'international-consequences-fallout'],
  connectionIds: ['frankel-epstein-business', 'frankel-bondi-social', 'frankel-ed-familial'],
  sources: [SRC, 'JMail', 'OSINT']
}))) addedPeople++;

// Ed Frankel
if (addPerson(makePerson({
  id: 'ed-frankel',
  name: 'Ed Frankel',
  category: 'other',
  summary: 'Chairman of the board of Tikva Children\'s Home (EIN 22-3779212), a registered 501(c)(3) Jewish charity serving at-risk children in Odessa, Ukraine. Believed to be Keith Frankel\'s father. Ed Frankel himself does not appear in the EFTA document set. Inclusion is for research context only — no evidence of wrongdoing.',
  sections: [
    {
      title: 'Role',
      content: 'Chairman of the board of Tikva Children\'s Home, a registered 501(c)(3) Jewish charity (EIN 22-3779212, West Caldwell, NJ) serving at-risk Jewish children in Odessa, Ukraine. Founded in 1996 by Rabbi Shlomo Bakst. Per Sun Sentinel (April 24, 2017), Ed Frankel stated the organization has helped more than 500 children relocate to Israel. A 2016 Newswire press release lists "Ed & Leah Frankel" as sponsors of Tikva\'s 20th Anniversary Gala.\n\nEd Frankel does not appear in the EFTA document set. His inclusion in this database is solely because of the familial relationship to confirmed Epstein associate Keith Frankel (460+ EFTA mentions). There is NO evidence that Ed Frankel, Tikva Children\'s Home, or the Frankel family\'s Ukraine philanthropy is connected to trafficking or wrongdoing.\n\n---',
      sources: ['OSINT'],
      verificationStatus: 'unverified'
    }
  ],
  timelineEventIds: [],
  themeIds: ['international-consequences-fallout'],
  connectionIds: ['frankel-ed-familial'],
  sources: ['OSINT']
}))) addedPeople++;

// David Stern (Epstein contact)
if (addPerson(makePerson({
  id: 'david-stern-epstein',
  name: 'David Stern (Epstein contact)',
  category: 'other',
  summary: 'Sender of a July 15, 2011 email to Jeffrey Epstein discussing a potential trip, referencing "filling a boat with P" and asking "when are we going to Odessa?" Identity unknown — multiple public figures share this name. Bates number unknown.',
  sections: [
    {
      title: 'Odessa Email (July 2011)',
      content: 'Sender of a July 15, 2011 email to Jeffrey Epstein (jeevacation@gmail.com). Subject: "Re: [no subject]." Full body:\n\n> "OK. Wed 3rd would be great. we can then go down to the south, take a big boat and I fill it with P for you..... You don\'t like boats so it can stay at the port... and also the South is not our type of place. But the P is unbelievable... Talking about P: when are we going to Odessa?"\n\nThis is a reply to a prior Epstein email (parent thread not yet reviewed). "Odessa" is a major port city in Ukraine. The meaning of "P" and the significance of the Odessa reference are ambiguous without additional email thread context.\n\nMultiple public figures named David Stern exist. This person has not been identified. Bates number unknown — search Jmail for "Stern" + "Odessa" to confirm.\n\n---',
      sources: [SRC],
      verificationStatus: 'unverified'
    }
  ],
  timelineEventIds: ['2011-07-15-stern-odessa-email'],
  themeIds: ['the-trafficking-operation'],
  connectionIds: ['stern-epstein-correspondence'],
  sources: [SRC]
}))) addedPeople++;


/* ═══════════════════════════════════════════════════════════
   PART 2: TIMELINE EVENTS
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 2: TIMELINE EVENTS ===\n');

// 1. Body Boxes email
if (addTimelineEvent(makeTimelineEvent({
  id: '2010-02-10-frankel-body-boxes',
  date: '2010-02-10',
  dateDisplay: 'February 10, 2010',
  era: '2008-2018',
  title: 'Keith Frankel sends "The Body Boxes" product pitch to Epstein',
  body: 'Keith Frankel emails Jeffrey Epstein forwarding a product called "The Body Boxes" — a body sculpting supplement pitch. Epstein replies the same day: "don\'t waste your time with the box. ingredients. concepts. box design and girls would be vs." Frankel\'s follow-up on Feb 11 outlines "THE BODY — 28 DAY BODY SCULPTING SYSTEM / CORE ITEM DESIGNED AROUND CLEANSING AND BURNING LIKE QUICK TRIM." The deal was for a Victoria\'s Secret private label product.\n\nClarifies a widely-misunderstood phrase in community analysis. "Body boxes" is product packaging for a health supplement line, not trafficking terminology. Confirms commercial relationship between Frankel and Epstein post-conviction (2010).',
  peopleIds: ['keith-frankel', 'jeffrey-epstein'],
  themeIds: ['the-trafficking-operation'],
  sources: [SRC],
  tags: ['financial'],
  summary: 'Keith Frankel pitches "The Body Boxes" — a body sculpting supplement — to Epstein for Victoria\'s Secret. Not trafficking terminology.',
  eftaLinks: [
    {
      number: 'EFTA00764733',
      url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA00764733.pdf',
      description: 'Initial "Body Boxes" email, Feb 10, 2010',
      mediaType: 'pdf',
      sensitive: false
    },
    {
      number: 'EFTA00764728',
      url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA00764728.pdf',
      description: 'Body Boxes follow-up chain, Feb 10–11, 2010',
      mediaType: 'pdf',
      sensitive: false
    }
  ],
  relatedEventIds: ['2010-03-07-frankel-pb-visit'],
  relatedThemeIds: ['the-trafficking-operation'],
  discrepancies: [{
    description: 'Community researchers widely interpreted "body boxes" as potential trafficking terminology. EFTA documents confirm it refers to product packaging for a body sculpting supplement line pitched to Victoria\'s Secret.',
    resolution: 'Resolved — product name confirmed via EFTA00764733 and EFTA00764728.'
  }]
}))) addedEvents++;

// 2. Frankel Palm Beach visit
if (addTimelineEvent(makeTimelineEvent({
  id: '2010-03-07-frankel-pb-visit',
  date: '2010-03-07',
  dateDisplay: 'March 7, 2010',
  era: '2008-2018',
  title: 'Keith Frankel confirmed at Epstein\'s Palm Beach house',
  body: 'An EFTA email (EFTA02429595, DataSet 11) from "Story Cowles" (sent March 5, 2010) records: "Keith Frankel is confirmed to be at the PB house this Sunday, March 7th." This is independent confirmation of a physical visit to Epstein\'s Palm Beach residence, post-conviction (Epstein convicted 2008, served sentence 2008–2009).',
  peopleIds: ['keith-frankel', 'jeffrey-epstein'],
  themeIds: ['the-trafficking-operation'],
  sources: [SRC],
  tags: ['financial'],
  summary: 'Keith Frankel confirmed at Epstein\'s Palm Beach house per EFTA02429595. Post-conviction visit (2010).',
  eftaLinks: [
    {
      number: 'EFTA02429595',
      url: 'https://www.justice.gov/epstein/files/DataSet%2011/EFTA02429595.pdf',
      description: 'Keith Frankel confirmed at Palm Beach house, March 7, 2010',
      mediaType: 'pdf',
      sensitive: false
    }
  ],
  relatedEventIds: ['2010-02-10-frankel-body-boxes'],
  relatedThemeIds: ['the-trafficking-operation']
}))) addedEvents++;

// 3. David Stern Odessa email
if (addTimelineEvent(makeTimelineEvent({
  id: '2011-07-15-stern-odessa-email',
  date: '2011-07-15',
  dateDisplay: 'July 15, 2011',
  era: '2008-2018',
  title: 'David Stern emails Epstein asking "when are we going to Odessa?"',
  body: 'An EFTA email from David Stern to Jeffrey Epstein (jeevacation@gmail.com), July 15, 2011 3:10 PM, Subject: "Re: [no subject]." Body: "OK. Wed 3rd would be great. we can then go down to the south, take a big boat and I fill it with P for you..... You don\'t like boats so it can stay at the port... and also the South is not our type of place. But the P is unbelievable... Talking about P: when are we going to Odessa?"\n\nOdessa is a major port city in Ukraine. The meaning of "P" and the Odessa reference are unresolved pending full thread review. Identity of "David Stern" unconfirmed — multiple public figures share this name. Bates number unknown.',
  peopleIds: ['david-stern-epstein', 'jeffrey-epstein'],
  themeIds: ['the-trafficking-operation'],
  sources: [SRC],
  tags: ['intelligence'],
  summary: 'David Stern emails Epstein referencing "filling a boat with P" and asking "when are we going to Odessa?" — identity and meaning unresolved.',
  eftaLinks: [],
  relatedEventIds: [],
  relatedThemeIds: ['the-trafficking-operation'],
  verificationStatus: 'unverified',
  discrepancies: [{
    description: 'Bates number unknown. Identity of "David Stern" unconfirmed. Meaning of "P" unresolved. Search Jmail: "David Stern" + "Odessa" to locate.',
    resolution: null
  }]
}))) addedEvents++;


/* ═══════════════════════════════════════════════════════════
   PART 3: CONNECTIONS
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 3: CONNECTIONS ===\n');

// Frankel ↔ Epstein
if (addConnection(makeConnection({
  id: 'frankel-epstein-business',
  source: 'keith-frankel',
  target: 'jeffrey-epstein',
  type: 'financial',
  strength: 3,
  description: '460+ EFTA email references. Confirmed Palm Beach house visitor (March 7, 2010, EFTA02429595). Discussed product licensing deal with Victoria\'s Secret ("The Body Boxes" email chain, Feb–Mar 2010).',
  sources: [SRC, 'JMail'],
  verification: 'verified'
}))) addedConnections++;

// Frankel ↔ Bondi
if (addConnection(makeConnection({
  id: 'frankel-bondi-social',
  source: 'keith-frankel',
  target: 'pam-bondi',
  type: 'social',
  strength: 1,
  description: 'Photographed together per community researcher. Relationship nature unspecified.',
  sources: ['OSINT'],
  verification: 'unverified'
}))) addedConnections++;

// Keith Frankel ↔ Ed Frankel
if (addConnection(makeConnection({
  id: 'frankel-ed-familial',
  source: 'keith-frankel',
  target: 'ed-frankel',
  type: 'associate',
  strength: 2,
  description: 'Believed to be father-son relationship based on community researcher claims and surname match. Ed Frankel is chairman of Tikva Children\'s Home (Odessa, Ukraine). Not independently confirmed via public record.',
  sources: ['OSINT'],
  verification: 'unverified'
}))) addedConnections++;

// David Stern ↔ Epstein
if (addConnection(makeConnection({
  id: 'stern-epstein-correspondence',
  source: 'david-stern-epstein',
  target: 'jeffrey-epstein',
  type: 'associate',
  strength: 1,
  description: 'July 15, 2011 email to Epstein referencing a planned meeting, "filling a boat with P," and asking "when are we going to Odessa?" Identity of sender unknown.',
  sources: [SRC],
  verification: 'unverified'
}))) addedConnections++;


/* ═══════════════════════════════════════════════════════════
   PART 4: ENRICH THEMES
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 4: ENRICH THEMES ===\n');

// Enrich "the-trafficking-operation" with Eastern European / Ukraine thread
const traffTheme = findThemeById('the-trafficking-operation');
if (traffTheme) {
  const MARKER = 'Eastern European / Ukraine Thread';
  if (!traffTheme.content.includes(MARKER)) {
    traffTheme.content = traffTheme.content.replace(/\n*---\s*$/, '');
    traffTheme.content += `\n\n## ${MARKER}\n\nMultiple independent threads connect the Epstein network to Ukraine and Odessa specifically:\n\n1. **Keith Frankel / Tikva Children's Home:** Ed Frankel, believed father of confirmed Epstein associate Keith Frankel (460+ EFTA mentions), is chairman of Tikva Children's Home in Odessa, Ukraine — a registered 501(c)(3) Jewish charity (EIN 22-3779212) serving at-risk children. This is a legitimate humanitarian organization. The widely-flagged "body boxes" phrase from Frankel's emails (EFTA00764733) refers to product packaging for a body sculpting supplement line pitched to Victoria's Secret — not trafficking terminology.\n\n2. **David Stern / Odessa Email (July 2011):** A separate EFTA email from David Stern to Epstein asks "when are we going to Odessa?" and references "filling a boat with P." The meaning of "P," the identity of Stern, and the Odessa reference are unresolved pending full thread review.\n\n3. **EFTA00214249 (DataSet 9):** A heavily redacted article about an alleged Eastern European victim reportedly purchased from her family. This is independent of the Frankel and Stern threads.\n\nThese three Ukraine-adjacent threads are documented separately and should not be conflated.\n\n---`;
    if (!traffTheme.sources.includes(SRC)) traffTheme.sources.push(SRC);
    const newPids = ['keith-frankel', 'ed-frankel', 'david-stern-epstein'];
    for (const pid of newPids) {
      if (!traffTheme.peopleIds.includes(pid)) traffTheme.peopleIds.push(pid);
    }
    const newEids = ['2010-02-10-frankel-body-boxes', '2010-03-07-frankel-pb-visit', '2011-07-15-stern-odessa-email'];
    for (const eid of newEids) {
      if (!traffTheme.timelineEventIds.includes(eid)) traffTheme.timelineEventIds.push(eid);
    }
    console.log('  ENRICH theme: the-trafficking-operation');
  } else {
    console.log('  SKIP theme (exists): the-trafficking-operation');
  }
}

// Enrich "international-consequences-fallout" for Tikva context
const intlTheme = findThemeById('international-consequences-fallout');
if (intlTheme) {
  const MARKER2 = 'Tikva Children\'s Home — Odessa, Ukraine';
  if (!intlTheme.content.includes(MARKER2)) {
    intlTheme.content = intlTheme.content.replace(/\n*---\s*$/, '');
    intlTheme.content += `\n\n## ${MARKER2}\n\nEd Frankel, believed father of confirmed Epstein associate Keith Frankel, is chairman of Tikva Children's Home — a registered 501(c)(3) Jewish charity (EIN 22-3779212) serving at-risk Jewish children in Odessa, Ukraine. The organization, founded in 1996, has helped more than 500 children relocate to Israel. Community researchers flagged this connection but Tikva is a legitimate humanitarian organization with verifiable IRS registration and independent news coverage (Sun Sentinel, NJ Jewish News). No evidence connects the charity to Epstein's activities.\n\n---`;
    if (!intlTheme.sources.includes('OSINT')) intlTheme.sources.push('OSINT');
    const intlPids = ['keith-frankel', 'ed-frankel'];
    for (const pid of intlPids) {
      if (!intlTheme.peopleIds.includes(pid)) intlTheme.peopleIds.push(pid);
    }
    console.log('  ENRICH theme: international-consequences-fallout');
  } else {
    console.log('  SKIP theme (exists): international-consequences-fallout');
  }
}


/* ═══════════════════════════════════════════════════════════
   PART 5: WIRE UP REFERENCES
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 5: WIRE UP REFERENCES ===\n');

// Wire Epstein to new events
addPersonEvent('jeffrey-epstein', '2010-02-10-frankel-body-boxes');
addPersonEvent('jeffrey-epstein', '2010-03-07-frankel-pb-visit');
addPersonEvent('jeffrey-epstein', '2011-07-15-stern-odessa-email');

// Wire Epstein to new connections
addPersonConnection('jeffrey-epstein', 'frankel-epstein-business');
addPersonConnection('jeffrey-epstein', 'stern-epstein-correspondence');

// Wire Pam Bondi to Frankel connection
addPersonConnection('pam-bondi', 'frankel-bondi-social');

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
console.log(`║  FRANKEL / UKRAINE PROBE INTEGRATION COMPLETE   ║`);
console.log(`╠══════════════════════════════════════════════════╣`);
console.log(`║  New people:      ${String(addedPeople).padStart(3)}                          ║`);
console.log(`║  Enriched people: ${String(enrichedPeople).padStart(3)}                          ║`);
console.log(`║  New events:      ${String(addedEvents).padStart(3)}                          ║`);
console.log(`║  New connections: ${String(addedConnections).padStart(3)}                          ║`);
console.log(`╚══════════════════════════════════════════════════╝\n`);
