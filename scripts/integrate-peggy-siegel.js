#!/usr/bin/env node
/**
 * Peggy Siegel Probe Update Integration Script
 * Integrates verified EFTA documents from CC_GUIDE_PROBE_UPDATE_PEGGY_SIEGEL.md
 * into site JSON: people, timeline, connections.
 * Fully idempotent — safe to re-run.
 *
 * Source: 10 EFTA PDF files — Bates-stamped primary documents
 * Net change: Peggy Siegel UNVERIFIED → VERIFIED (489 DOJ results)
 * New node: Harvey Weinstein (conservative — single social contact doc)
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const timeline = JSON.parse(fs.readFileSync(path.join(DATA, 'timeline.json'), 'utf8'));
const people = JSON.parse(fs.readFileSync(path.join(DATA, 'people.json'), 'utf8'));
const connections = JSON.parse(fs.readFileSync(path.join(DATA, 'connections.json'), 'utf8'));
const themes = JSON.parse(fs.readFileSync(path.join(DATA, 'themes.json'), 'utf8'));

const SRC = 'DOJ';

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
    summary: opts.summary,
    mentionCount: opts.mentionCount,
    sections: opts.sections || [
      { title: 'Role', content: opts.roleText || opts.summary, sources: opts.sources || [SRC] },
      { title: 'Source', content: 'DOJ EFTA document corpus — Bates-stamped releases\n\n---', sources: [SRC] }
    ],
    timelineEventIds: opts.timelineEventIds || [],
    themeIds: opts.themeIds || [],
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

let addedPeople = 0, addedEvents = 0, addedConnections = 0;

// ============================================================
// PART 1: ADD/UPDATE PEGGY SIEGEL
// ============================================================

console.log('\n=== PART 1: ADD/UPDATE PEGGY SIEGEL ===\n');

const existingSiegel = findPersonById('peggy-siegel');
if (existingSiegel) {
  // Upgrade existing node
  if (!existingSiegel.summary.includes('489')) {
    existingSiegel.summary = 'New York-based Hollywood film publicist known for high-profile film premieres and charity event organization. Documented in 489 EFTA results. Verified EFTA documents show ongoing contact with Epstein from at least August 2009 through February 2012 — spanning his conviction, house arrest, and post-release periods. Contacts include visits to Epstein\'s home, urgent outreach while at a Tina Brown-hosted women\'s conference where press was discussing Epstein, and a documented three-way connection to Harvey Weinstein involving a potential shared flight to Europe.';
    existingSiegel.mentionCount = 489;
    if (!existingSiegel.sources.includes(SRC)) existingSiegel.sources.push(SRC);
    console.log('  UPDATE: peggy-siegel summary + mentionCount upgraded');
  }
} else {
  // Create new node
  if (addPerson(makePerson({
    id: 'peggy-siegel',
    name: 'Peggy Siegel',
    category: 'media',
    mentionCount: 489,
    summary: 'New York-based Hollywood film publicist known for high-profile film premieres and charity event organization. Documented in 489 EFTA results. Verified EFTA documents show ongoing contact with Epstein from at least August 2009 through February 2012 — spanning his conviction, house arrest, and post-release periods. Contacts include visits to Epstein\'s home, urgent outreach while at a Tina Brown-hosted women\'s conference where press was discussing Epstein, and a documented three-way connection to Harvey Weinstein involving a potential shared flight to Europe.',
    sections: [
      {
        title: 'Role',
        content: 'New York-based Hollywood film publicist known for high-profile film premieres and charity event organization. Documented post-conviction social contact with Epstein. Shared social network with Harvey Weinstein and Tina Brown.',
        sources: [SRC]
      },
      {
        title: 'Verified Contact Cluster (2009-2012)',
        content: 'Ten EFTA Bates-stamped documents confirm ongoing contact with Epstein from August 2009 through February 2012:\n\n**August 11, 2009** — Siegel\'s assistant sends Epstein a DVD; Siegel requests a phone call (EFTA_R1_01515305). Lesley Groff references "FSF" as an alternate delivery address.\n\n**November 19-20, 2010** — Two same-day contacts: Siegel visits Epstein\'s house at 4:30 PM, and arranges a return lunch the following day (EFTA_R1_01466989, EFTA_R1_01467831).\n\n**March 11, 2011** — Most contextually significant. Siegel is physically present at Tina Brown\'s "Women in the World" conference where Jeanine Pirro is moderating and press is actively discussing Epstein. She urgently contacts his staff: "Peggy Siegel wants to speak with him asap...the press is there and they are talking about you" (EFTA_R1_00890273, EFTA00436877).\n\n**May 24, 2011** — Siegel returns Epstein\'s phone call (EFTA00433527).\n\n**October 28, 2011** — Siegel calls to speak with Epstein at the house (EFTA_R1_00552834).\n\n**November 7, 2011** — Siegel available to speak after 11:45 (EFTA00424533).\n\n**February 8, 2012** — "Please call peggy Siegel through office or on her cell" (EFTA00929621).\n\nAll contacts occurred during or after Epstein\'s legal jeopardy period (convicted 2008, released from house arrest 2010).',
        verificationStatus: 'verified',
        sources: [SRC],
        efta: ['EFTA_R1_01515305', 'EFTA_R1_01466989', 'EFTA_R1_01467831', 'EFTA_R1_00890273', 'EFTA00436877', 'EFTA00433527', 'EFTA_R1_00552834', 'EFTA00424533', 'EFTA00929621']
      },
      {
        title: 'Harvey Weinstein Connection',
        content: 'An EFTA document (EFTA_R1_00265226) records Harvey Weinstein calling Siegel to ask if she might be flying to Europe that night and whether they could split the ride. Siegel asked her assistant to contact Epstein\'s office on Weinstein\'s behalf. This documents a three-way social and logistical connection but does not establish Weinstein as an Epstein network member, trafficking participant, or client. The exact date is unclear due to OCR degradation.',
        verificationStatus: 'verified',
        sources: [SRC],
        efta: ['EFTA_R1_00265226']
      },
      {
        title: 'Open Research Questions',
        content: '- August 7, 2010 Epstein-Siegel email ("100% Jewish" / JPMorgan response) — claimed in community research but not yet confirmed by Bates-stamped document. Separate probe.\n- "FSF" abbreviation in Epstein staff communications (first appears Aug 2009, EFTA_R1_01515305) — meaning not established.\n- Date of Harvey Weinstein flight-splitting email (EFTA_R1_00265226) — OCR shows "Thu" but month/year unclear.\n- Nature of Siegel\'s March 2011 urgent contact during conference — whether press monitoring, early warning, or social alarm is not specified.',
        sources: [SRC]
      },
      { title: 'Source', content: 'DOJ EFTA document corpus — 10 Bates-stamped documents. DOJ Epstein Library search returns 489 results.\n\n---', sources: [SRC] }
    ],
    timelineEventIds: [
      'siegel-epstein-contact-aug-2009',
      'siegel-visits-epstein-house-nov-2010',
      'siegel-women-in-world-epstein-press-march-2011',
      'weinstein-siegel-epstein-flight-europe'
    ],
    themeIds: ['financial-crimes-money-laundering'],
    connectionIds: ['epstein-peggy-siegel-post-conviction', 'siegel-harvey-weinstein-flight'],
    sources: [SRC]
  }))) addedPeople++;
}

// ============================================================
// PART 2: ADD HARVEY WEINSTEIN
// ============================================================

console.log('\n=== PART 2: ADD HARVEY WEINSTEIN ===\n');

if (addPerson(makePerson({
  id: 'harvey-weinstein',
  name: 'Harvey Weinstein',
  category: 'media',
  summary: 'Hollywood film producer and convicted sex offender (convicted 2020, second conviction 2023). One verified EFTA document (EFTA_R1_00265226) places Weinstein in contact with Peggy Siegel while attempting to arrange a shared private flight to Europe via Epstein. The document does not characterize Weinstein as an Epstein network member, trafficking participant, or client — it is a social and logistical contact between individuals with overlapping social circles. Weinstein\'s own criminal convictions are independently established.',
  sections: [
    {
      title: 'Role',
      content: 'Hollywood film producer. Convicted sex offender (convicted 2020, second conviction 2023). Documented social overlap with Epstein via Peggy Siegel flight arrangement.',
      sources: [SRC]
    },
    {
      title: 'Epstein Connection — Siegel Flight Document',
      content: 'One verified EFTA document (EFTA_R1_00265226) documents the following: Harvey Weinstein called Peggy Siegel and asked whether she might be flying to Europe that night and whether they could split the ride. Siegel then asked her assistant to contact Epstein\'s office with the question.\n\nThis document establishes social and logistical overlap between three individuals — it does not characterize Weinstein as an Epstein trafficking network member or client. Any additional Epstein-Weinstein connection should be verified by separate EFTA document.',
      verificationStatus: 'verified',
      sources: [SRC],
      efta: ['EFTA_R1_00265226']
    },
    {
      title: 'Open Research Questions',
      content: '- Search EFTA for direct Epstein-Weinstein correspondence. Any direct communication would significantly strengthen this connection.\n- Identify the date and destination of the Europe flight (EFTA_R1_00265226). Cross-reference against Epstein flight logs and Weinstein\'s travel schedule.\n- Locate the Daily Beast article on Epstein-Weinstein connection referenced in CC_GUIDE_RICE.',
      sources: [SRC]
    },
    { title: 'Source', content: 'DOJ EFTA document corpus — single Bates-stamped document (EFTA_R1_00265226). Conservative characterization: social overlap only.\n\n---', sources: [SRC] }
  ],
  timelineEventIds: ['weinstein-siegel-epstein-flight-europe'],
  themeIds: [],
  connectionIds: ['weinstein-epstein-social-overlap', 'siegel-harvey-weinstein-flight'],
  sources: [SRC]
}))) addedPeople++;

// ============================================================
// PART 3: ADD TIMELINE EVENTS
// ============================================================

console.log('\n=== PART 3: ADD TIMELINE EVENTS ===\n');

// Event 1: August 2009 — Siegel contact
if (addTimelineEvent(makeTimelineEvent({
  id: 'siegel-epstein-contact-aug-2009',
  date: '2009-08-11',
  dateDisplay: 'August 11, 2009',
  era: '2008-2018',
  title: "Peggy Siegel's Office Contacts Epstein — DVD and Phone Request",
  body: 'Lesley Groff emails Epstein (jeevacation@gmail.com) to relay that Alicia, from Peggy Siegel\'s office, has a DVD to send him and asks whether he prefers it sent to "the house" or to "FSF." Groff also relays that Siegel wants to speak with him. Epstein replies from his iPhone with the word "Dad" — which Groff interprets as a typo, joking that the keys are in the same area of the keyboard.\n\n"FSF" is an abbreviation used by Lesley Groff as an alternate address for Epstein\'s property. The meaning is not established — flagged as open research.',
  summary: "Siegel's assistant sends Epstein a DVD; Siegel requests a phone call. Lesley Groff references 'FSF' as an alternate delivery address.",
  peopleIds: ['jeffrey-epstein', 'peggy-siegel', 'lesley-groff'],
  tags: ['post-conviction', 'social-contact'],
  eftaLinks: [{ number: 'EFTA_R1_01515305', url: '', description: 'Lesley Groff to Epstein — Siegel DVD/phone request, August 11, 2009' }],
  relatedEventIds: ['siegel-visits-epstein-house-nov-2010', 'siegel-women-in-world-epstein-press-march-2011']
}))) addedEvents++;

// Event 2: November 2010 — Siegel visits Epstein's house
if (addTimelineEvent(makeTimelineEvent({
  id: 'siegel-visits-epstein-house-nov-2010',
  date: '2010-11-19',
  dateDisplay: 'November 19-20, 2010',
  era: '2008-2018',
  title: "Peggy Siegel Visits Epstein's Residence; Lunch Planned Next Day",
  body: 'Two EFTA emails from November 19, 2010 document the same day. At 4:42 PM, Lesley Groff emails Epstein, Rich Bame, and the Fontanilla household staff: "Peggy Siegel will come see you today at 4:30 at the house." That evening, an assistant asks Epstein whether Siegel can stop by for lunch the following day at noon. Epstein replies "Yes" from his iPhone.\n\nThis represents two confirmed in-person or planned contacts in a single 24-hour window, post-conviction.',
  summary: "Siegel visits Epstein's home and arranges a return lunch visit the following day. Two confirmed contacts in 24 hours.",
  peopleIds: ['jeffrey-epstein', 'peggy-siegel', 'lesley-groff'],
  tags: ['post-conviction', 'house-visit'],
  eftaLinks: [
    { number: 'EFTA_R1_01466989', url: '', description: 'Groff to Epstein/Bame/Fontanilla — Siegel visit, Nov 19, 2010' },
    { number: 'EFTA_R1_01467831', url: '', description: 'Assistant to Epstein — Siegel lunch next day, Nov 19-20, 2010' }
  ],
  relatedEventIds: ['siegel-epstein-contact-aug-2009', 'siegel-women-in-world-epstein-press-march-2011']
}))) addedEvents++;

// Event 3: March 2011 — Women in the World conference
if (addTimelineEvent(makeTimelineEvent({
  id: 'siegel-women-in-world-epstein-press-march-2011',
  date: '2011-03-11',
  dateDisplay: 'March 11, 2011',
  era: '2008-2018',
  title: "Siegel Urgently Contacts Epstein from Tina Brown Conference as Press Discusses Him",
  body: 'Two EFTA documents from March 11, 2011 document the same event. At 3:54 PM, an assistant emails Epstein that "Peggy Siegel needs to speak with you as soon as possible." Fourteen minutes later, a forwarded chain reads: "M...can you let JE know that Peggy Siegel wants to speak with him asap." The forwarded original provides context: Siegel is "sitting in the audience of a panel discussion Tina Brown is holding titled: Women in the World. The press is there and they are talking about you. Janine Piro is the moderator. Please call Peggy."\n\nThe reason for the urgency — whether she was warning him, relaying press inquiries, or simply wanted to connect — is not specified in the documents. The conference, Tina Brown\'s role, and Jeanine Pirro\'s moderation are independently verifiable public events.',
  summary: "While attending Tina Brown's 'Women in the World' conference — where press is actively discussing Epstein and Jeanine Pirro is moderating — Siegel urgently contacts Epstein's staff.",
  peopleIds: ['jeffrey-epstein', 'peggy-siegel'],
  tags: ['post-conviction', 'press-coverage', 'tina-brown', 'conference'],
  eftaLinks: [
    { number: 'EFTA_R1_00890273', url: '', description: '"Peggy Siegel needs to speak with you asap" — March 11, 2011, 3:54 PM' },
    { number: 'EFTA00436877', url: '', description: 'Forwarded chain with conference context — March 11, 2011, 4:08 PM' }
  ],
  relatedEventIds: ['siegel-epstein-contact-aug-2009', 'siegel-visits-epstein-house-nov-2010']
}))) addedEvents++;

// Event 4: Weinstein flight (undated)
if (addTimelineEvent(makeTimelineEvent({
  id: 'weinstein-siegel-epstein-flight-europe',
  date: '2010-01-01',
  dateDisplay: 'Date unclear (2009-2012)',
  era: '2008-2018',
  title: 'Harvey Weinstein Contacts Siegel About Splitting Epstein Flight to Europe',
  body: 'An EFTA email (EFTA_R1_00265226) sent on a Thursday documents the following: Harvey Weinstein called Peggy Siegel and asked whether she might be flying to Europe that night and whether "he would love to split a ride, or something." Siegel then asked her assistant to contact Epstein\'s office with the question. The assistant\'s email reads: "Harvey Weinstein called Peggy Siegel asking if she might be flying to Europe tonight...he would love to split a ride, or something...Peggy asked her assistant to call and ask you... How shall I respond..."\n\nThe exact date is unclear due to OCR degradation of the original document. This document does not characterize Weinstein as an Epstein trafficking network member or client. It documents social and logistical overlap between three individuals with connected social circles.',
  summary: 'Weinstein calls Siegel to ask if she is flying to Europe via Epstein and whether they can share the flight. Social/logistical overlap documented.',
  peopleIds: ['jeffrey-epstein', 'peggy-siegel', 'harvey-weinstein'],
  tags: ['social-contact', 'flight', 'weinstein', 'europe'],
  eftaLinks: [{ number: 'EFTA_R1_00265226', url: '', description: 'Weinstein-Siegel-Epstein flight arrangement email' }],
  relatedEventIds: ['siegel-epstein-contact-aug-2009', 'siegel-visits-epstein-house-nov-2010']
}))) addedEvents++;

// ============================================================
// PART 4: ADD CONNECTIONS
// ============================================================

console.log('\n=== PART 4: ADD CONNECTIONS ===\n');

// Epstein ↔ Siegel (post-conviction social)
if (addConnection(makeConnection({
  id: 'epstein-peggy-siegel-post-conviction',
  source: 'jeffrey-epstein',
  target: 'peggy-siegel',
  type: 'social',
  strength: 2,
  description: 'Ongoing social contact, August 2009 – February 2012. Multiple EFTA documents show visits to Epstein\'s home, phone-tag via staff (Lesley Groff, Rich Bame), and Siegel\'s urgent contact during a conference where press was discussing Epstein. 489 DOJ EFTA results for "peggy siegel."',
  verification: 'verified',
  activeEras: ['2008-2018']
}))) addedConnections++;

// Siegel ↔ Weinstein
if (addConnection(makeConnection({
  id: 'siegel-harvey-weinstein-flight',
  source: 'peggy-siegel',
  target: 'harvey-weinstein',
  type: 'social',
  strength: 1,
  description: 'Weinstein contacted Siegel about sharing Epstein\'s private flight to Europe. Siegel relayed the request to Epstein\'s office via her assistant. Social and logistical overlap documented; no operational trafficking connection established (EFTA_R1_00265226).',
  verification: 'verified',
  activeEras: ['2008-2018']
}))) addedConnections++;

// Weinstein → Epstein (indirect, via Siegel)
if (addConnection(makeConnection({
  id: 'weinstein-epstein-social-overlap',
  source: 'harvey-weinstein',
  target: 'jeffrey-epstein',
  type: 'social',
  strength: 1,
  description: 'One verified EFTA document shows Weinstein contacted Peggy Siegel to attempt to share Epstein\'s flight to Europe. Social overlap confirmed; operational network membership not established (EFTA_R1_00265226).',
  verification: 'verified',
  activeEras: ['2008-2018']
}))) addedConnections++;

// ============================================================
// PART 5: CROSS-REFERENCES
// ============================================================

console.log('\n=== PART 5: CROSS-REFERENCES ===\n');

// Epstein cross-refs
addPersonEvent('jeffrey-epstein', 'siegel-epstein-contact-aug-2009');
addPersonEvent('jeffrey-epstein', 'siegel-visits-epstein-house-nov-2010');
addPersonEvent('jeffrey-epstein', 'siegel-women-in-world-epstein-press-march-2011');
addPersonEvent('jeffrey-epstein', 'weinstein-siegel-epstein-flight-europe');
addPersonConnection('jeffrey-epstein', 'epstein-peggy-siegel-post-conviction');
addPersonConnection('jeffrey-epstein', 'weinstein-epstein-social-overlap');

// Lesley Groff cross-refs
addPersonEvent('lesley-groff', 'siegel-epstein-contact-aug-2009');
addPersonEvent('lesley-groff', 'siegel-visits-epstein-house-nov-2010');

console.log('  Cross-references added for jeffrey-epstein, lesley-groff');

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

console.log(`\n=== PEGGY SIEGEL PROBE INTEGRATION COMPLETE ===`);
console.log(`  People added:      ${addedPeople}`);
console.log(`  Events added:      ${addedEvents}`);
console.log(`  Connections added:  ${addedConnections}`);
console.log(`  Siegel DOJ count:  489 (upgraded from unverified)`);
console.log(`  Weinstein:         Conservative single-doc node\n`);
