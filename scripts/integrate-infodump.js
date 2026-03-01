#!/usr/bin/env node
/**
 * Infodump EFTA Integration Script
 * Integrates ~400+ DOJ EFTA links from infodump.md into site JSON data.
 * Pattern follows integrate-trump-misconduct.js — fully idempotent.
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const timeline = JSON.parse(fs.readFileSync(path.join(DATA, 'timeline.json'), 'utf8'));
const people = JSON.parse(fs.readFileSync(path.join(DATA, 'people.json'), 'utf8'));
const connections = JSON.parse(fs.readFileSync(path.join(DATA, 'connections.json'), 'utf8'));
const themes = JSON.parse(fs.readFileSync(path.join(DATA, 'themes.json'), 'utf8'));

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

function addTimelineEvent(event) {
  const existing = findTimelineById(event.id);
  if (existing) {
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
    era: opts.era || '2019',
    title: opts.title,
    body: opts.body + '\n\n---',
    peopleIds: opts.peopleIds || [],
    themeIds: opts.themeIds || [],
    sources: opts.sources || ['DOJ'],
    tags: opts.tags || [],
    summary: opts.summary || opts.body.split('\n')[0].substring(0, 300),
    eftaLinks: opts.eftaLinks || [],
    relatedEventIds: opts.relatedEventIds || [],
    relatedThemeIds: opts.relatedThemeIds || [],
    discrepancies: opts.discrepancies || [],
    verificationStatus: opts.verificationStatus || undefined
  };
}

function enrichTimelineBody(id, additionalText) {
  const event = findTimelineById(id);
  if (!event) {
    console.log(`  WARN: Cannot enrich event ${id} - not found`);
    return false;
  }
  event.body = event.body.replace(/\n*---\s*$/, '');
  event.body += '\n\n' + additionalText + '\n\n---';
  console.log(`  ENRICH event: ${id}`);
  return true;
}

/**
 * Extract EFTA number from a DOJ URL, determine mediaType and sensitive flag.
 */
function makeEftaLink(url, description) {
  // Normalize URL
  let cleanUrl = url.trim();
  if (!cleanUrl.startsWith('http')) {
    cleanUrl = 'https://' + cleanUrl;
  }
  cleanUrl = cleanUrl.replace(/ /g, '%20');

  // Extract EFTA number from URL
  const match = cleanUrl.match(/(EFTA\d{8,})/i);
  const number = match ? match[1].toUpperCase() : '';

  // Determine mediaType from extension
  const ext = cleanUrl.split('.').pop().toLowerCase().split('?')[0];
  const mediaType = (ext === 'mp4' || ext === 'mov') ? 'video' : 'pdf';

  // Flag sensitive from description keywords
  const desc = (description || '').toLowerCase();
  const sensitive = /\b(explicit|voyeur|strip|underage|rape|nude|naked)\b/.test(desc);

  return { number, url: cleanUrl, description: description || '', mediaType, sensitive };
}

/**
 * Merge eftaLinks into an existing timeline event, deduplicating by number.
 */
function addEftaLinksToEvent(eventId, links) {
  const event = findTimelineById(eventId);
  if (!event) {
    console.log(`  WARN: Cannot add eftaLinks to event ${eventId} - not found`);
    return 0;
  }
  if (!event.eftaLinks) event.eftaLinks = [];
  const existing = new Set(event.eftaLinks.map(l => l.number));
  let added = 0;
  for (const link of links) {
    if (link.number && !existing.has(link.number)) {
      event.eftaLinks.push(link);
      existing.add(link.number);
      added++;
    }
  }
  if (added > 0) console.log(`  ADD ${added} eftaLinks to event ${eventId}`);
  return added;
}

/**
 * Find or create a section on a person, then merge eftaLinks.
 */
function addEftaLinksToPersonSection(personId, sectionTitle, links, sectionContent) {
  const person = findPersonById(personId);
  if (!person) {
    console.log(`  WARN: Cannot add eftaLinks to person ${personId} - not found`);
    return 0;
  }
  let section = person.sections.find(s => s.title === sectionTitle);
  if (!section) {
    section = {
      title: sectionTitle,
      content: sectionContent || `EFTA documents related to ${person.name}.`,
      sources: ['DOJ'],
      eftaLinks: []
    };
    person.sections.push(section);
    console.log(`  CREATE section "${sectionTitle}" on ${personId}`);
  }
  if (!section.eftaLinks) section.eftaLinks = [];
  const existing = new Set(section.eftaLinks.map(l => l.number));
  let added = 0;
  for (const link of links) {
    if (link.number && !existing.has(link.number)) {
      section.eftaLinks.push(link);
      existing.add(link.number);
      added++;
    }
  }
  if (added > 0) console.log(`  ADD ${added} eftaLinks to ${personId} / "${sectionTitle}"`);
  return added;
}

/**
 * Merge eftaLinks into a theme's eftaLinks array, deduplicating by number.
 */
function addEftaLinksToTheme(themeId, links) {
  const theme = findThemeById(themeId);
  if (!theme) {
    console.log(`  WARN: Cannot add eftaLinks to theme ${themeId} - not found`);
    return 0;
  }
  if (!theme.eftaLinks) theme.eftaLinks = [];
  const existing = new Set(theme.eftaLinks.map(l => l.number));
  let added = 0;
  for (const link of links) {
    if (link.number && !existing.has(link.number)) {
      theme.eftaLinks.push(link);
      existing.add(link.number);
      added++;
    }
  }
  if (added > 0) console.log(`  ADD ${added} eftaLinks to theme ${themeId}`);
  return added;
}

function addConnection(conn) {
  const exists = connections.find(c => c.id === conn.id);
  if (exists) {
    console.log(`  SKIP connection (exists): ${conn.id}`);
    return false;
  }
  connections.push(conn);
  console.log(`  ADD connection: ${conn.id}`);
  return true;
}

function addSourceToPerson(personId, source) {
  const person = findPersonById(personId);
  if (person && !person.sources.includes(source)) {
    person.sources.push(source);
  }
}

// ============================================================
// PART 1: MCC JAIL SURVEILLANCE VIDEOS
// ============================================================

console.log('\n=== PART 1: MCC JAIL SURVEILLANCE VIDEOS ===\n');

const mccJulyLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033102.mp4', '7/18 at 10pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033105.mp4', '7/20 at 1am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033312.mp4', '7/22 at 11am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033128.mp4', '7/25 at 1am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033129.mp4', '7/25 at 4am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033133.mp4', '7/25 at 7pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00137561.mp4', '7/25 at 10pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128551.mp4', '7/25 at 6am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00137540.mp4', '7/26 at 4pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128556.mp4', '7/26 at 10am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033336.mp4', '7/27 at 1pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033141.mp4', '7/27 at 6pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033143.mp4', '7/28 at 4am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128565.mp4', '7/28 at 5am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033148.mp4', '7/28 at midnight'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033346.mp4', '7/28 at 7pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128569.mp4', '7/29 at midnight'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033347.mp4', '7/29 at 1am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033149.mp4', '7/29 at 1am alt angle'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033349.mp4', '7/29 at 5pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033150.mp4', '7/29 at 6am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128570.mp4', '7/29 at 2am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128572.mp4', '7/29 at 10am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128575.mp4', '7/29 at 7pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033351.mp4', '7/30 at 1am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128578.mp4', '7/30 at 4am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128579.mp4', '7/30 at 9am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033359.mp4', '7/31 at 5pm'),
];

const mccAugLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00028842.mp4', 'Epstein in his jail cell'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033221.mp4', 'Whiteboard video Aug 10 at 5pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00032990.mp4', 'MCC corridor footage'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00032989.mp4', 'MCC corridor footage'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00032991.mp4', 'MCC corridor footage'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00064605.mp4', 'Aug 10 1am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00108926.mp4', 'Aug 10 1am alt'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00064610.mp4', 'Aug 10 6am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00108932.mp4', 'Aug 10 7am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00064614.mp4', 'Aug 10 10am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00064603.mp4', 'Aug 9 11pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00108929.mp4', 'Aug 10 4am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00099789.mp4', 'Aug 10 5am-5:11am sped up'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00029995.mp4', 'Aug 10 at 5am sped up'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00108930.mp4', 'Aug 10 5am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00064609.mp4', 'MCC footage'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00108931.mp4', 'Aug 10 6am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00108925.mp4', 'Aug 10 midnight'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00029997.mp4', 'Aug 10 midnight sped up'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00123083.mov', 'Tour of jail facilities'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128622.mp4', 'Aug 6 21:00'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128625.mp4', 'Aug 7 alt angle'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128626.mp4', 'Aug 12 alt angle'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00164926.mp4', 'Aug 5 two guys'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00010707.mp4', 'Another angle'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033367.mp4', '8/2 at 9am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033392.mp4', '8/7 at 9am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033396.mp4', '8/8 at 10am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033008.mp4', '8/8 at 5pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033374.mp4', '8/3 at 8pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033393.mp4', '8/7 at 2pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033395.mp4', '8/8 at 4am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033211.mp4', '8/8 at 9am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033003.mp4', '8/7 at 11am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00029998.mp4', '8/8 at 3am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033399.mp4', '8/9 at 1am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033401.mp4', '8/9 at 9am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033402.mp4', '8/9 at 2pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033404.mp4', '8/9 at 8pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033220.mp4', '8/9 at 2pm alt'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033014.mp4', '8/9 at 10pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033013.mp4', '8/9 at 3pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033216.mp4', '8/8 at 10pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033204.mp4', '8/6 at 11pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033027.mp4', 'Aug 11 at 9pm'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033029.mp4', 'MCC footage'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033225.mp4', '8/12 at 10am'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00033030.mp4', '8/12 at 7am'),
];

const allMccLinks = [...mccJulyLinks, ...mccAugLinks];

// Create two aggregate timeline events
addTimelineEvent(makeTimelineEvent({
  id: '2019-07-mcc-surveillance-july',
  date: '2019-07',
  dateDisplay: 'July 2019',
  era: '2019',
  title: 'MCC Surveillance Video Batch — July 2019',
  body: 'Batch of MCC jail surveillance videos from July 18-31, 2019, released via EFTA Datasets 8 and 9. Covers the period from Epstein\'s arrest (July 6) through the first injury incident (July 23) and the DVR recording failure (July 29). Multiple camera angles and timestamps document conditions and activity around Epstein\'s housing unit.',
  summary: 'Batch of MCC jail surveillance videos from July 18-31, 2019, covering the period from arrest through first injury incident and DVR failure.',
  peopleIds: ['jeffrey-epstein'],
  themeIds: ['epsteins-death-mcc-anomalies'],
  sources: ['DOJ'],
  tags: ['mcc', 'surveillance', 'video'],
  eftaLinks: mccJulyLinks,
  relatedEventIds: ['2019-07-06-jeffrey-epstein-arrested-second-arrest', '2019-07-23-first-mcc-injury-incident', '2019-07-29-mcc-dvr-recording-failure-detected'],
  relatedThemeIds: ['epsteins-death-mcc-anomalies'],
}));

addTimelineEvent(makeTimelineEvent({
  id: '2019-08-mcc-surveillance-august',
  date: '2019-08',
  dateDisplay: 'August 2019',
  era: '2019',
  title: 'MCC Surveillance Video Batch — August 2019',
  body: 'Batch of MCC jail surveillance videos from August 2-12, 2019, released via EFTA Datasets 8 and 9. Covers the critical period including the cellmate transfer (Aug 9), Epstein\'s death (Aug 10), and immediate aftermath. Includes footage of Epstein in his jail cell (EFTA00028842) and a tour of jail facilities (EFTA00123083).',
  summary: 'Batch of MCC jail surveillance videos from August 2-12, 2019, covering Epstein\'s death and immediate aftermath. Includes cell footage and facility tour.',
  peopleIds: ['jeffrey-epstein'],
  themeIds: ['epsteins-death-mcc-anomalies'],
  sources: ['DOJ'],
  tags: ['mcc', 'surveillance', 'video'],
  eftaLinks: mccAugLinks,
  relatedEventIds: ['2019-08-09-cellmate-transferred-no-replacement-unau', '2019-08-10-doj-draft-death-statement-dated-august-9', '2019-08-11-autopsy-performed', '2019-08-11-cell-scene-anomalies-documented'],
  relatedThemeIds: ['epsteins-death-mcc-anomalies'],
}));

// Also add all MCC links to Theme 10
addEftaLinksToTheme('epsteins-death-mcc-anomalies', allMccLinks);

// Enrich existing MCC events with select eftaLinks
addEftaLinksToEvent('2019-07-23-first-mcc-injury-incident', [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00165199.pdf', 'Account of July 23 incident'),
]);
addEftaLinksToEvent('2019-08-09-cellmate-transferred-no-replacement-unau', [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00080838.pdf', 'Report on issue with Epstein call on 8/9'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00089258.pdf', 'Report on Epstein call 8/9'),
]);

console.log(`  MCC July links: ${mccJulyLinks.length}, August links: ${mccAugLinks.length}`);

// ============================================================
// PART 2: DATASET 10 MEDIA EVIDENCE
// ============================================================

console.log('\n=== PART 2: DATASET 10 MEDIA EVIDENCE ===\n');

// Key described videos from Dataset 10 for Epstein's personal media section
const dataset10Links = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683331.mp4', 'Epstein in pool with what appears to be child'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621081.mov', 'Personal video'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01616390.mov', 'Crazy vs Hot'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683355.mp4', 'Beauty pageant singer'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621035.mov', 'Epstein lawyer wanted to represent Trump'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621030.mov', 'Article on Harvard professor Jorge Dominguez'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683338.mp4', 'Epstein dancing with someone'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01688324.mp4', 'Under Armour'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01618622.mov', 'Lana Pozhidaeva'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01622053.mov', 'Lana Pozhidaeva'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683468.mp4', 'Personal video'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01614506.mov', 'Penguin Runner'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01615887.mov', 'Border Wall'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01617570.mov', 'Airbnb'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683502.mp4', 'Woman in car - good relationship with cameras'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01688342.mp4', 'Three girls singing'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683529.mp4', 'Someone performing for two people on couches'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683440.mp4', 'Naturalization Oath Ceremony 5/11/2018'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683342.mp4', 'Model poses'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01618739.mov', 'Checking in from rainy Arizona - how is the island'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683421.mp4', 'Private jet - South African Ambassador'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683410.mp4', 'Private jet footage'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683566.mp4', 'Cleaner'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683424.mp4', 'Girl playing with dog in USA sweatshirt'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683320.mp4', '2h44m video mostly black screen'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683412.mp4', 'Strange portrait'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683408.mp4', 'In Europe with redacted woman'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683535.mp4', 'Woman taking video in mirror'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683358.mp4', 'Woman doing yoga'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683496.mp4', 'WE TALK women with microphones'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683388.mp4', 'Woman at beach'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683403.mp4', 'Radiant ecstasy'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683441.mp4', 'Red padded wall bookshelf'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01600798.mp4', 'Epstein Island 10m video Little St James'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648780.mp4', 'Epstein and woman laying on his lap'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621008.mov', '3h26m talking about Obama trusts - Israeli guy eating with Epstein'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621016.mov', 'Epstein with something wrong with his face'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621018.mov', 'Epstein photo'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621029.mov', 'Bill Cosby trial headline'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621062.mov', 'Private jet massage table'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621046.mov', 'Epstein and some guy at Louvre'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621084.mov', 'Private Jet N212JE'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621007.mov', 'Aliens conversation 25min mentions AI machines and Danny'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621106.mov', 'Someone holding a girls head'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621919.mov', 'Roman ruins'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648573.mp4', 'Epstein farting'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648695.mp4', 'Epstein on table chasing a girl'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01688335.mp4', 'Kid Olivia getting jelly beans'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01621104.mov', 'Prince Charles in car'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648644.mp4', 'Thats the best you can do modeling photo'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648662.mp4', 'Baby'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683323.mp4', 'Interview with state attorney Dave Aronberg 11/08/05'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683325.mp4', 'Dave Aronberg interview pt 2'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683330.mp4', 'Dave Aronberg interview pt 3'),
];

// Explicit/sensitive content links
const dataset10Explicit = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683532.mp4', 'explicit: woman in bathroom'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648559.mp4', 'strip pole'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648551.mp4', 'voyeur at beach'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648599.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648598.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648566.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648602.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648532.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648755.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648582.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648519.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648618.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648698.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648542.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648581.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648498.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648659.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648699.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648493.mp4', 'explicit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01648445.mp4', 'explicit'),
];

// Add all Dataset 10 links to jeffrey-epstein person
addEftaLinksToPersonSection('jeffrey-epstein', 'Personal Media Evidence (Dataset 10)',
  [...dataset10Links, ...dataset10Explicit],
  'Personal media files from Epstein\'s electronic devices released in EFTA Dataset 10. Contains videos from properties, private jets, and personal recordings. Some content flagged as sensitive or explicit.'
);

// Cross-post Maxwell interrogation videos
const maxwellInterrogation = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01688339.mp4', 'Maxwell interrogation'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01688337.mp4', 'Maxwell interrogation'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00087285.mov', 'Maxwell interrogation'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00093695.mp4', 'Maxwell interrogation'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00102123.mov', 'Maxwell interrogation'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00093696.mov', 'Maxwell interrogation - mentions Annie Farmer'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01688321.mp4', 'Maxwell interrogation'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00076840.mov', 'Maxwell interrogation - mentions 3-way with Epstein'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01688338.mp4', 'Maxwell interrogation'),
];
addEftaLinksToPersonSection('ghislaine-maxwell', 'Interrogation Videos (EFTA)',
  maxwellInterrogation,
  'Video recordings of Maxwell\'s interrogation/deposition released via EFTA Datasets 9 and 10.'
);

// Cross-post Woody Allen to person
addEftaLinksToPersonSection('woody-allen', 'EFTA Media References', [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01132029.mov', 'Woody Allen video'),
], 'Media evidence from EFTA datasets referencing Woody Allen.');

// Island footage to Theme 2
addEftaLinksToTheme('the-trafficking-operation', [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01600798.mp4', 'Epstein Island 10m video Little St James'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01618739.mov', 'Checking in from rainy Arizona - how is the island'),
]);

// Aronberg interviews to Acosta Plea Deal theme
addEftaLinksToTheme('the-acosta-plea-deal-legal-history', [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683323.mp4', 'Interview with state attorney Dave Aronberg 11/08/05'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683325.mp4', 'Dave Aronberg interview pt 2'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683330.mp4', 'Dave Aronberg interview pt 3'),
]);

console.log(`  Dataset 10 described: ${dataset10Links.length}, explicit: ${dataset10Explicit.length}`);

// ============================================================
// PART 3: MELANIA THREAD
// ============================================================

console.log('\n=== PART 3: MELANIA THREAD ===\n');

const melaniaLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00905956.pdf', 'On cheating trial'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02536428.pdf', 'On cheating trial'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00032417.pdf', 'Ghislaine looks very much like Melania - from Laura Isabel Woods'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00673162.pdf', 'Jonathan Farkas to Epstein - gave someone Jettrey number - going to DC to work for Melania'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02332411.pdf', 'Melania email to Ghislaine - Nice story about JE in NY mag'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02631674.pdf', 'Michael Wolff to Epstein on Trump and personal secretary Westerhout'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00159321.pdf', 'Wolff-Epstein exchange'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00105195.pdf', 'Handwritten notes - mentions someone introducing Melania to Trump'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00263405.pdf', 'Handwritten notes by girls asked to massage'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01615888.pdf', 'Bannon-Epstein texts'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00518081.pdf', 'Bannon-Epstein texts'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00507917.pdf', 'Bannon iMessages - Macron down Boris up'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02553567.pdf', 'Wolff to Epstein - journalists working lead on melania boyfriend'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02552933.pdf', 'Wolff-Epstein on Melania'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02553687.pdf', 'Wolff-Epstein on Melania'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00933498.pdf', 'Melania thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00933486.pdf', 'Melania thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02553498.pdf', 'Melania thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00933470.pdf', 'Melania thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01030600.pdf', 'Wolff to Epstein on Trump and Madeleine Westerhout'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02372654.pdf', 'Farkas to Epstein on Tracey going to DC for Melania'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02666677.pdf', 'Farkas-Epstein thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02651268.pdf', 'Epstein to Boris Nikolic - your friend melania really nuts'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02496013.pdf', 'Bannon and Epstein discuss Trump close to mental breakdown'),
];

addEftaLinksToPersonSection('melania-trump', 'EFTA Document Evidence',
  melaniaLinks,
  'EFTA documents referencing Melania Trump including direct communication with Maxwell, third-party references, handwritten notes, and Bannon/Wolff/Epstein text exchanges.'
);
addEftaLinksToTheme('melania-trump-thread', melaniaLinks);
addSourceToPerson('melania-trump', 'DOJ');

// ============================================================
// PART 4: BANNON-EPSTEIN + MIROSLAV LAJCAK
// ============================================================

console.log('\n=== PART 4: BANNON-EPSTEIN + LAJCAK ===\n');

const bannonLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02496013.pdf', 'Bannon-Epstein: Trump close to mental breakdown'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01616076.pdf', 'Bannon-Epstein on China and NSA cybertools'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01615655.pdf', 'Bannon-Epstein on Pence Pompeo Kushner Kelly'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01615048.pdf', 'Bannon-Epstein on Jide and Sultan'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02240153.pdf', 'Bannon Miro Epstein lunch late March 2018'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01615497.pdf', 'Bannon on Belgium govt fell - Epstein on Miro withdrawing resignation'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01615208.pdf', 'Epstein to Bannon: how many people around Donald can have a heart attack'),
];
addEftaLinksToPersonSection('steve-bannon', 'EFTA Document Evidence',
  bannonLinks,
  'EFTA documents from Bannon-Epstein communications including political discussions, Trump intel, and Miroslav Lajcak references.'
);
addSourceToPerson('steve-bannon', 'DOJ');

// Enrich Miroslav Lajcak with eftaLinks
const lajcakLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01619725.pdf', 'Miro mentioned 788 times'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02245731.pdf', 'Dinner with Miro and Steve Bannon April 25 2018'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02231879.pdf', 'Dinner with Miro Woody Allen Soon Yi and Deepak'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01619684.pdf', 'Epstein to Miro on Terje and Thorbjorn'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01616126.pdf', 'Bannon: Im all over Miro'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01619736.pdf', 'Miro and Epstein talking about taking girls and Lavrov'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01619744.pdf', 'Miro and Epstein on Saudis and Borge jokes'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02246469.pdf', 'Miro and Terje dinner with Epstein'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02255321.pdf', 'Snacks or dinner for Miro/Jeffrey'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02459248.pdf', 'Dinner with Miro - should Jugly be in charge'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00868657.pdf', 'Epstein to Ehbarak introducing Miro as president of UN'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00868753.pdf', 'Epstein-Barak-Miro thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01002087.pdf', 'Epstein introducing Miro to Nathan Myhrvold'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02279992.pdf', 'Epstein introducing Miro to Darren Indyke'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00865258.pdf', 'Epstein to Sultan: miro is president of UN'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02668068.pdf', 'Epstein to Tom Pritzker: miro president of UN tonight'),
];
addEftaLinksToPersonSection('miroslav-lajk-miro-lajcak', 'EFTA Document Evidence',
  lajcakLinks,
  'EFTA documents from Epstein communications referencing Miroslav Lajcak ("Miro"), former President of the UN General Assembly. Includes dinner invitations, diplomatic introductions, and Bannon exchanges.'
);
addSourceToPerson('miroslav-lajk-miro-lajcak', 'DOJ');
addEftaLinksToTheme('political-intelligence-network', lajcakLinks);

// ============================================================
// PART 5: TRUMP DOCUMENTS
// ============================================================

console.log('\n=== PART 5: TRUMP DOCUMENTS ===\n');

const trumpDocLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00786704.pdf', 'Epstein messaging about Stormy Daniels referring to Trumps penis'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00822737.pdf', 'Epstein 10k bet with Trump over Marla Maples'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00159140.pdf', 'Informant mentions photos of celebrities - clinton trump pope'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00128994.pdf', 'Tammy Hill-McFadden did review Trump cases'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01785426.pdf', 'Thomas Landon Jr on Duke Buchan III constantly texting Trump'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02669198.pdf', 'Epstein to Lesley Groff: trump related issues occupying my time'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02646817.pdf', 'Epstein email on palm beach doctor article'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02625442.pdf', 'Epstein to Kathy Ruemmler explaining Trump money laundering'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00261546.pdf', 'Jane Doe 3 met Epstein in 1999 at Trumps Mar-a-Lago'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02540523.pdf', 'Thomas Landon Jr on being in Wolffs book'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02394063.pdf', 'Nicholas Ribis: I designed the DJT business comeback'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00782599.pdf', 'Epstein messages with Harry Fish and Joi Ito'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00785194.pdf', 'Lawrence Kraus messaging Epstein May 2019'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01211522.pdf', 'Epstein: Trump aint got a friend - convinced Reid not to be Pelosis bitch'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00095502.pdf', 'FBI report on woman who saw Epstein and Trump together a lot'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683870.pdf', 'Report on allegation of Trump Epstein oral sex and rape'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00129126.pdf', 'Trump-Epstein allegation report'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00284175.pdf', '2007 court filing on Epstein'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01688359.pdf', '15yo who worked at Mar-a-Lago becomes sex slave'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00152984.pdf', 'FBI on Trump party for prostitutes'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01013538.pdf', 'Epstein to Wolff on Harth claim of sexual assault by Trump 1993'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00800982.pdf', 'Court: Trump and Epstein socializing with children - Fifth Amendment'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02478352.pdf', 'Epstein to Landon Thomas: would you like photos of Donald and girls in bikinis in my kitchen'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02647805.pdf', 'Larry Summers referring to Trump as Epsteins friend 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02647847.pdf', 'Summers-Epstein on Trump'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01244937.pdf', 'Capponi sent shuttle buses of underage models to Mar-a-Lago casting parties'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00508805.pdf', 'Terje talking to Epstein about investigation and links to Trump'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02629257.pdf', 'Ken Starr to Epstein'),
];
addEftaLinksToPersonSection('donald-trump', 'EFTA Document Evidence — Trump-Epstein',
  trumpDocLinks,
  'EFTA documents directly referencing Trump-Epstein relationship including FBI reports, court filings, communications, and witness accounts.'
);
addEftaLinksToTheme('trumpepstein-connections', trumpDocLinks);

// Child rape story links
const childRapeLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02462577.pdf', 'Epstein sends Larry Summers HuffPost piece on Trump child rape'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02670963.pdf', 'Epstein sends Ruemmler Forward.com piece on Trump child rape suit'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02639144.pdf', 'Epstein to Nicholas Ribis on Trump and Deutsche Bank'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02670028.pdf', 'Aziza Alahmadi to Epstein on Trump child rape allegation'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01784973.pdf', 'Epstein to Landon Thomas Jr - Thomas says you called it'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02670338.pdf', 'Epstein to Erika Kellerhals on child rape allegation'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01785025.pdf', 'Redacted sending Epstein child rape article'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01784861.pdf', 'Redacted sending Epstein child rape article'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02670018.pdf', 'Redacted on child rape article'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02670123.pdf', 'Faith Kates to Epstein on child rape article'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02669974.pdf', 'Wolff to Epstein on child rape article'),
];
addEftaLinksToPersonSection('donald-trump', 'EFTA Document Evidence — Trump-Epstein',
  childRapeLinks, null
);
addEftaLinksToTheme('trumpepstein-connections', childRapeLinks);

// Prison/death evidence → Theme 10
const prisonDeathLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00077513.pdf', 'FBI seeking commissary info on Indyke Schantz Tali Kahn Reyes'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00027386.pdf', 'Redacted FBI file on commissary receipts'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00062649.pdf', 'Officer interviewed after Epsteins death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00063613.pdf', 'Officer interviewed after Epsteins death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00058522.pdf', 'Officer interviewed after Epsteins death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00111284.pdf', 'Officer interviewed after Epsteins death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00123433.pdf', 'Officer interviewed after Epsteins death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00064519.pdf', 'Officer interviewed after Epsteins death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00060373.pdf', 'Officer interviewed after Epsteins death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00068273.pdf', 'Officer interviewed after Epsteins death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00027732.pdf', 'Materials seized after death included 4chan materials'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00040941.pdf', 'Medical evaluation after Epsteins death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00123213.pdf', 'Medical evaluation after death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00105651.pdf', 'Medical evaluation after death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00141175.pdf', 'Medical evaluation after death'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00056410.pdf', 'Suicide watch chronological log'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00105705.pdf', 'NYTimes vs Fed Bureau of Prisons'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00130643.pdf', 'Digital forensic evidence collected from Epstein'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01227736.pdf', 'Texts from prison guards - Epstein wasnt suicidal'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01837996.pdf', 'Epstein to redacted: feeling suicidal'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00137914.pdf', 'Epstein prison visitors log'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00161494.pdf', 'Timeline of prison events autopsy photos'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00063517.pdf', 'Prison event timeline'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01615508.pdf', 'Epstein 12/13/2018: Trump talking to people he hasnt in years'),
];
addEftaLinksToTheme('epsteins-death-mcc-anomalies', prisonDeathLinks);

// Money laundering → Theme 8
const moneyLaunderingLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02462117.pdf', 'Epstein to Wolff: Trumps dad bought casino chips brothers loan'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02628214.pdf', 'Epstein on Trump buying house selling to Rybolovlev for 3x'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02625442.pdf', 'Epstein to Ruemmler on Trump money laundering'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02628984.pdf', 'Wolff to Epstein on Trump renting mansion - real owner Rybolovlev'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00316512.pdf', 'Rybolovlev connection'),
];
addEftaLinksToTheme('financial-crimes-money-laundering', moneyLaunderingLinks);
addEftaLinksToPersonSection('donald-trump', 'EFTA Document Evidence — Trump-Epstein',
  moneyLaunderingLinks, null
);

// Baby Stuff → Theme 12
const babyStuffLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02646618.pdf', 'Baby smell from Barnaby Marsh to Epstein'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02302410.pdf', 'Epstein sent baby link to Karyna Shuliak'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00702932.pdf', 'Epstein wanting baby blankets - Shelley says not on gods earth'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00989890.pdf', 'Baby blankets plan'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01414279.pdf', 'Baby girl 2013 Taylor'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01249616.pdf', 'Kidnapped as baby'),
];
addEftaLinksToTheme('baby-stuff-thread', babyStuffLinks);

// Additional Trump-specific
const trumpMiscLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02225586.pdf', 'Epstein asking for candy from oval office while Trump was president'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%208/EFTA00032998.pdf', 'Epstein to Nassau on Trump liking nubile girls'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00131726.pdf', 'Epstein on Trump liking nubile girls'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02468224.pdf', 'Epstein to Richard Kahn on Trump abortion article'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02660014.pdf', 'Ruemmler to Epstein: Acosta plea deal article was fed by David Boies'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02628843.pdf', 'Kuwaiti gifts discussion - MBS breakthrough'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02636395.pdf', 'Summers-Epstein on speaking face to face instead of notes'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00528713.pdf', 'JE angels emails sent to Karyna Shuliak'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01652971.pdf', 'Stalking claims - royals and Maxwell'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01652134.pdf', 'Stalking claims'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02649038.pdf', 'Epstein to Landon Thomas on Tom Barrack tax evasion'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02649063.pdf', 'Epstein to Terje on Barrack tax evasion'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02649049.pdf', 'Epstein to Jabor Y on Barrack tax evasion'),
];
addEftaLinksToPersonSection('donald-trump', 'EFTA Document Evidence — Trump-Epstein',
  trumpMiscLinks, null
);
addEftaLinksToTheme('trumpepstein-connections', trumpMiscLinks);
addSourceToPerson('donald-trump', 'DOJ');

// "Buddy" reference links - cross-post to relevant people
const buddyRefs = {
  'deepak-chopra': [
    makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02356079.pdf', 'Deepak Chopra referred to as Epstein buddy'),
    makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00467360.pdf', 'Deepak Chopra correspondence'),
    makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02561422.pdf', 'Chopra correspondence'),
  ],
  'peter-thiel': [
    makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02640733.pdf', 'Epstein to Peter Thiel: Trump is vindictive'),
  ],
};
for (const [pid, links] of Object.entries(buddyRefs)) {
  addEftaLinksToPersonSection(pid, 'EFTA Document Evidence', links,
    `EFTA documents referencing ${findPersonById(pid)?.name || pid}.`
  );
  addSourceToPerson(pid, 'DOJ');
}

console.log('  Trump docs added');

// ============================================================
// PART 6: "WHOOPS" EMAILS
// ============================================================

console.log('\n=== PART 6: WHOOPS EMAILS ===\n');

const whoopsLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01922235.pdf', 'Permission to kill him June 30 2014'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01988549.pdf', 'To Jean-Luc Brunel June 6 2012'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01815587.pdf', 'To redacted 8/1/2010'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01056353.pdf', 'Ornella was raped when she was just 18'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00739120.pdf', 'Epstein to gmax Aug 29 2009 - The Bear attachment'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02501993.pdf', 'Epstein to Jon Farkas 5/11/2015'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02662769.pdf', 'Epstein to redacted 1/20/2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01767863.pdf', 'Response to BBC article 4/11/2012'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02648688.pdf', 'To Jabor Y on Reuters article on Qatar'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02457915.pdf', 'To Richard Kahn July 4 2016'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02634651.pdf', 'To Nathan Myhrvold Sept 9 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00827695.pdf', 'To Soon Yi Previn May 12 2016'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01009760.pdf', 'To Boris Nikolic Sep 22 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01910978.pdf', 'To Warren Eisenstein on Mutty Fukky 12/12/2012'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00964985.pdf', 'To Nathan Myhrvold July 16 2013'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02548441.pdf', 'To Wolff: question about Jamie Dimon whoops'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02591804.pdf', 'To redacted on someone getting sick 10/13/2014'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00655647.pdf', 'To Eva Dubin about sultans mother in law dying'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01884457.pdf', 'To Eva Dubin on Mary Kennedy found dead'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00996597.pdf', 'Kristina White took revenge on boyfriend in Bahamas'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02624636.pdf', 'To redacted Sept 10 2018 - how should we celebrate this day'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02624671.pdf', 'Celebration day follow-up'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02363491.pdf', 'To Boris Nikolic Sept 22 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02607847.pdf', 'Nikolic thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01987274.pdf', 'To Nadia'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00736184.pdf', 'Mike Huffman from DIA email'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00869349.pdf', 'After ice skating story and boy March 5 2018'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00627271.pdf', 'Death of Elkman 5/11/2015'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02637845.pdf', 'To Wolff: Tillerson leaving Ivanka wants Haley Aug 20 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02445763.pdf', 'On Hillarys email scandal'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01911934.pdf', 'To HKH Kronprinsessen in hospital for test'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00875978.pdf', 'HKH Kronprinsessen thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00879292.pdf', 'To Peter Mandelson - bad setback with R who got into texts'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02428008.pdf', 'Mandelson thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01824951.pdf', 'Mandelson thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02665413.pdf', 'To Brad S Karp about extortion payments Dec 19 2016'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01732108.pdf', 'Searching for smart kids for safe space to explore taboo ideas Dec 1 2015'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01005484.pdf', 'To Nicole Junkermann July 15 2018'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00347727.pdf', 'Jay Thomas anniversary show at SiriusXM June 8 2015'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00876362.pdf', 'To Ariane de Rothschild Feb 25 2018'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01067377.pdf', 'Infamous pictures - movie husbands and wives - batmans house'),
];
addEftaLinksToTheme('whoops-emails', whoopsLinks);

// Cross-post select whoops links to relevant people
addEftaLinksToPersonSection('eva-andersson-dubin-eva-dubin', 'EFTA Document Evidence', [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00655647.pdf', 'Epstein whoops to Eva Dubin about sultans mother in law'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01884457.pdf', 'Epstein whoops to Eva Dubin on Mary Kennedy'),
], 'EFTA documents from Epstein "whoops" emails to Eva Dubin.');

addEftaLinksToPersonSection('peter-mandelson', 'EFTA Document Evidence', [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00879292.pdf', 'Epstein whoops to Mandelson - bad setback'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02428008.pdf', 'Mandelson thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01824951.pdf', 'Mandelson thread'),
], 'EFTA documents from Epstein "whoops" emails to Peter Mandelson.');

console.log(`  Whoops links: ${whoopsLinks.length}`);

// ============================================================
// PART 7: GARY GINSBERG
// ============================================================

console.log('\n=== PART 7: GARY GINSBERG ===\n');

if (!findPersonById('gary-ginsberg')) {
  people.push({
    id: 'gary-ginsberg',
    name: 'Gary Ginsberg',
    category: 'media',
    summary: 'Media executive. Wrote to Maxwell in September 2003: "the enigma is still as alluring as ever. When can I further probe the mystery?"',
    sections: [
      { title: 'Category', content: 'Media executive', sources: [] },
      {
        title: 'Source files',
        content: 'Gary Ginsberg to Maxwell in Sept 24, 2003: "the enigma is still as alluring as ever. When can I further probe the mystery? Do let me know."\n\n---',
        sources: ['DOJ'],
        eftaLinks: [
          makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02334045.pdf', 'Gary Ginsberg to Maxwell Sept 24 2003'),
        ],
      },
    ],
    timelineEventIds: [],
    themeIds: [],
    connectionIds: ['ghislaine-maxwell'],
    sources: ['DOJ'],
  });
  console.log('  ADD person: gary-ginsberg');

  addConnection({
    id: 'ginsberg-maxwell-social',
    sourcePersonId: 'gary-ginsberg',
    targetPersonId: 'ghislaine-maxwell',
    relationshipType: 'social',
    strength: 1,
    description: 'Wrote flirtatious email to Maxwell in 2003.',
    sources: ['DOJ'],
    verificationStatus: 'verified',
  });
} else {
  console.log('  SKIP (exists): gary-ginsberg');
}

// ============================================================
// PART 8: BATMAN / TED WAITT & MELUSINE RUSPOLI
// ============================================================

console.log('\n=== PART 8: BATMAN/TED WAITT & RUSPOLI ===\n');

// Enrich Ted Waitt
const waittLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02333073.pdf', 'Epstein refers to Tom Waitt as batman Oct 12 2004'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00822913.pdf', 'Email about Batman giving per month - Epstein: wants to keep you short'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01067377.pdf', 'Going to batmans house in Paris - infamous pictures'),
];
addEftaLinksToPersonSection('ted-waitt', 'EFTA Document Evidence — Batman References',
  waittLinks,
  'EFTA documents where Epstein refers to Ted Waitt as "Batman." Includes financial control dynamics and Paris house reference.'
);
addSourceToPerson('ted-waitt', 'DOJ');

// Enrich Melusine Ruspoli
const ruspoliLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01744278.pdf', 'Argument mentioning lie to batman - her brothers - Olimpia - Aug 28 2015'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00847636.pdf', 'Less redacted version - Margots flirt - messages he sent me'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01139023.pdf', 'Promise not to do what you did to the Bulgaris'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01743944.pdf', 'Ruspoli-Epstein exchange'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00847488.pdf', 'Ruspoli-Epstein exchange'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00847504.pdf', 'Ruspoli-Epstein exchange'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00847717.pdf', 'Ruspoli-Epstein exchange'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00847509.pdf', 'Ruspoli-Epstein exchange'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00847631.pdf', 'Ruspoli-Epstein exchange'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02476005.pdf', 'Unredacted - Marangoni school difference'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00848390.pdf', 'Same person Aug 18/19 2015 thread'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02475162.pdf', 'Same person Jan 16 2016'),
];
addEftaLinksToPersonSection('mlusine-ruspoli', 'EFTA Document Evidence',
  ruspoliLinks,
  'EFTA documents from Epstein-Ruspoli email exchanges including grooming dynamics, school funding (AUP), and conflicts over "Batman" (Ted Waitt) and Bulgari family.'
);
addSourceToPerson('mlusine-ruspoli', 'DOJ');

// ============================================================
// PART 9: ADDITIONAL TRUMP-EPSTEIN COMMUNICATIONS
// ============================================================

console.log('\n=== PART 9: ADDITIONAL TRUMP-EPSTEIN ===\n');

const additionalTrumpLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01777190.pdf', 'Richard Merkin to Epstein: Donald is 100% behind Jimmy Cayne June 3 2011'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01777184.pdf', 'Merkin-Epstein on Trump'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01060982.pdf', 'Epstein to Chopra: Donald is here in palm beach Nov 24 2016'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01060990.pdf', 'Chopra responds: can you get him in trouble please'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA02210938.pdf', 'Donald front door stained May 11 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00431011.pdf', 'Donald is here July 8 2011'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02640733.pdf', 'Epstein to Peter Thiel: Trump is vindictive Aug 7 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02606388.pdf', 'Epstein to Ruemmler: I know how dirty Donald is - fixer flip'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01209136.pdf', 'Woody Allen to Epstein: Swiss bank account comment'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00786005.pdf', 'Donald has a soft spot for Montenegro'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02647764.pdf', 'Epstein to Ribis: Donald said I betrayed him 15 years ago June 3 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02647612.pdf', 'Ribis: Trump wants to discredit you'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01615208.pdf', 'Epstein to Bannon: how many people can have a heart attack 7/17/2018'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02625442.pdf', 'Epstein to Ruemmler Jan 2019: how to take down Trump'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA00786056.pdf', 'Marla - guy under the lifeguard chair'),
];
addEftaLinksToPersonSection('donald-trump', 'EFTA Document Evidence — Trump-Epstein',
  additionalTrumpLinks, null
);
addEftaLinksToTheme('trumpepstein-connections', additionalTrumpLinks);

// Cross-post to specific people
addEftaLinksToPersonSection('peter-thiel', 'EFTA Document Evidence', [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02640733.pdf', 'Epstein to Peter Thiel: Trump is vindictive Aug 7 2017'),
], 'EFTA documents referencing Peter Thiel.');

addEftaLinksToPersonSection('deepak-chopra', 'EFTA Document Evidence', [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01060982.pdf', 'Epstein to Chopra: Donald is here in palm beach'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01060990.pdf', 'Chopra: can you get him in trouble please'),
], null);

addEftaLinksToPersonSection('woody-allen', 'EFTA Media References', [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01209136.pdf', 'Woody Allen to Epstein: Swiss bank account comment - secret society'),
], null);

console.log('  Additional Trump-Epstein links added');

// ============================================================
// PART 10: ARIANE DE ROTHSCHILD BANKING
// ============================================================

console.log('\n=== PART 10: ARIANE DE ROTHSCHILD ===\n');

const rothschildLinks = [
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02648079.pdf', 'Ader and Epstein hosted by Castro family June 7 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02479357.pdf', 'Ader: Yves told me DOJ asked for more documents on various accounts'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02561152.pdf', 'Epstein suggests merger between Ader and JB or being bought by CS Nov 29 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02480093.pdf', 'Epstein to Ader: how did Oliver go Nov 21 2015'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02478207.pdf', 'Ader: transfer monies before meeting - Epstein: separate payments deduct penalty Dec 15 2015'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02593970.pdf', 'Ader: Jacob is coming to extort from me Oct 6 2014'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02561008.pdf', 'Epstein: cleaning the bank was brilliant Dec 3 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02459026.pdf', 'Ader: police throughout the bank - full search people locked out June 29 2016'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01918634.pdf', 'Ader: hope you have NOT given info to justice June 30 2014'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01916862.pdf', 'Ader: I restructure bank you restructure my things July 21 2014'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02342688.pdf', 'Ader wants to meet Leonard Fisher informally Jan 2 2015'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02590201.pdf', 'Epstein: I would negotiate with David for you Sept 20 2014'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01918688.pdf', 'Epstein: Yves calling Slaughter and May - Ader: mitigation procedure 7/3/2014'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02341138.pdf', 'Ader: avoid these emails all my assistants read them April 5 2017'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02480120.pdf', 'Ader: received letter from David Nov 18 2015'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2010/EFTA01967168.pdf', 'Ader asks about Ehud Barak - wants to out-jew David June 29 2013'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02365448.pdf', 'Ader on Baron Rothschild indicted over fraud March 15 2016'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02516685.pdf', 'Ader: do you know Prince Andrew Oct 1 2014'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02337209.pdf', 'Ader on Lux regulator politically exposed clients'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02469116.pdf', 'Epstein on Luxembourg and Henri Rockefeller March 18 2016'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02597435.pdf', 'Ader: the good news is B is not here Dec 22 2014'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02512852.pdf', 'Ader and Epstein disparaging Christophe Jan 22 2015'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%2011/EFTA02461805.pdf', 'Ader on Davids merger with Martin Maurel June 7 2016'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01060183.pdf', 'Ader emails Epstein on Pictet - Epstein: six years at least Nov 30 2016'),
  makeEftaLink('https://www.justice.gov/epstein/files/DataSet%209/EFTA01055068.pdf', 'Epstein to Johnny El Hachem: Donald loves the Rothschild name Feb 18 2017'),
];
addEftaLinksToPersonSection('ariane-de-rothschild', 'EFTA Document Evidence — Infodump',
  rothschildLinks,
  'EFTA documents from Epstein-Ariane de Rothschild ("Ader") communications including DOJ document requests, police raids, bank restructuring, merger discussions, and strategic advisory.'
);
addEftaLinksToTheme('the-rothschild-dynasty-25-million-access-brokerage-intelligence-nexus', rothschildLinks);
addSourceToPerson('ariane-de-rothschild', 'DOJ');

console.log(`  Rothschild links: ${rothschildLinks.length}`);

// ============================================================
// BONUS PASS: RESOLVE EXISTING RAW EFTA REFS → eftaLinks
// ============================================================

console.log('\n=== BONUS PASS: RESOLVE RAW EFTA → eftaLinks ===\n');

// EFTA→URL resolution logic (ported from efta-dataset-map.ts)
const EXPLICIT_MAP = {
  'EFTA00000468': 1, 'EFTA00027732': 8, 'EFTA00028842': 8, 'EFTA00029805': 8,
  'EFTA00032417': 8, 'EFTA00032998': 8, 'EFTA00033221': 8, 'EFTA00056410': 9,
  'EFTA00063517': 9, 'EFTA00064603': 9, 'EFTA00076840': 9, 'EFTA00077513': 9,
  'EFTA00080838': 9, 'EFTA00087285': 9, 'EFTA00093695': 9, 'EFTA00093696': 9,
  'EFTA00095502': 9, 'EFTA00102123': 9, 'EFTA00105195': 9, 'EFTA00130643': 9,
  'EFTA00137914': 9, 'EFTA00152984': 9, 'EFTA00161494': 9, 'EFTA00261546': 9,
  'EFTA00507917': 9, 'EFTA00508805': 9, 'EFTA00528713': 9, 'EFTA00673162': 9,
  'EFTA00702932': 9, 'EFTA00736184': 9, 'EFTA00739120': 9, 'EFTA00800982': 9,
  'EFTA00822737': 9, 'EFTA00822913': 9, 'EFTA00827695': 9, 'EFTA00865258': 9,
  'EFTA00868657': 9, 'EFTA00869349': 9, 'EFTA00876362': 9, 'EFTA00964985': 9,
  'EFTA00989890': 9, 'EFTA01005484': 9, 'EFTA01009760': 9, 'EFTA01010444': 9,
  'EFTA01030600': 9, 'EFTA01056353': 9, 'EFTA01060982': 9, 'EFTA01060990': 9,
  'EFTA01209136': 9, 'EFTA01211522': 9, 'EFTA01227736': 9, 'EFTA01244937': 9,
  'EFTA01249188': 9, 'EFTA01249616': 9, 'EFTA01262782': 9, 'EFTA01414279': 10,
  'EFTA01615048': 10, 'EFTA01615208': 10, 'EFTA01615497': 10, 'EFTA01615508': 10,
  'EFTA01615655': 10, 'EFTA01615888': 10, 'EFTA01616076': 10, 'EFTA01616126': 10,
  'EFTA01619725': 10, 'EFTA01619736': 10, 'EFTA01619744': 10, 'EFTA01660651': 10,
  'EFTA01660679': 10, 'EFTA01683323': 10, 'EFTA01684300': 10, 'EFTA01688321': 10,
  'EFTA01688337': 10, 'EFTA01688338': 10, 'EFTA01688339': 10, 'EFTA01688359': 10,
  'EFTA01732108': 10, 'EFTA01744278': 10, 'EFTA01767863': 10, 'EFTA01777190': 10,
  'EFTA01815587': 10, 'EFTA01837996': 10, 'EFTA01910978': 10, 'EFTA01916862': 10,
  'EFTA01918634': 10, 'EFTA01918688': 10, 'EFTA01922235': 10, 'EFTA01967168': 10,
  'EFTA01988549': 10, 'EFTA02225586': 11, 'EFTA02231879': 11, 'EFTA02240153': 11,
  'EFTA02245731': 11, 'EFTA02302410': 11, 'EFTA02332411': 11, 'EFTA02333073': 11,
  'EFTA02341138': 11, 'EFTA02365448': 11, 'EFTA02457915': 11, 'EFTA02459026': 11,
  'EFTA02478207': 11, 'EFTA02478352': 11, 'EFTA02496013': 11, 'EFTA02501993': 11,
  'EFTA02516685': 11, 'EFTA02548441': 11, 'EFTA02553567': 11, 'EFTA02561008': 11,
  'EFTA02561152': 11, 'EFTA02591804': 11, 'EFTA02606388': 11, 'EFTA02624636': 11,
  'EFTA02625442': 11, 'EFTA02629257': 11, 'EFTA02631674': 11, 'EFTA02634651': 11,
  'EFTA02637845': 11, 'EFTA02640733': 11, 'EFTA02646618': 11, 'EFTA02647612': 11,
  'EFTA02647764': 11, 'EFTA02647805': 11, 'EFTA02648079': 11, 'EFTA02651268': 11,
  'EFTA02662769': 11, 'EFTA02665413': 11, 'EFTA02668068': 11, 'EFTA02669198': 11,
};

const KNOWN_RANGES = [
  [1, 26999, 1],
  [27000, 55999, 8],
  [56000, 1413999, 9],
  [1414000, 2224999, 10],
  [2225000, 9999999, 11],
];

function eftaToUrl(eftaNumber) {
  const clean = eftaNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  if (EXPLICIT_MAP[clean]) {
    return `https://www.justice.gov/epstein/files/DataSet%20${EXPLICIT_MAP[clean]}/${clean}.pdf`;
  }
  const numPart = parseInt(clean.replace(/^EFTA0*/, ''), 10);
  for (const [min, max, ds] of KNOWN_RANGES) {
    if (numPart >= min && numPart <= max) {
      return `https://www.justice.gov/epstein/files/DataSet%20${ds}/${clean}.pdf`;
    }
  }
  return `https://www.justice.gov/epstein`;
}

// Walk all people sections and resolve raw efta[] → eftaLinks[]
let bonusResolved = 0;
for (const person of people) {
  for (const section of person.sections) {
    if (section.efta && section.efta.length > 0) {
      if (!section.eftaLinks) section.eftaLinks = [];
      const existing = new Set(section.eftaLinks.map(l => l.number));
      for (const ref of section.efta) {
        const clean = ref.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        if (clean && !existing.has(clean)) {
          section.eftaLinks.push({
            number: clean,
            url: eftaToUrl(clean),
            description: '',
            mediaType: 'pdf',
            sensitive: false,
          });
          existing.add(clean);
          bonusResolved++;
        }
      }
    }
  }
}

// Walk all timeline events and resolve raw efta[] → eftaLinks[]
for (const event of timeline) {
  if (event.efta && event.efta.length > 0) {
    if (!event.eftaLinks) event.eftaLinks = [];
    const existing = new Set(event.eftaLinks.map(l => l.number));
    for (const ref of event.efta) {
      const clean = ref.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      if (clean && !existing.has(clean)) {
        event.eftaLinks.push({
          number: clean,
          url: eftaToUrl(clean),
          description: '',
          mediaType: 'pdf',
          sensitive: false,
        });
        existing.add(clean);
        bonusResolved++;
      }
    }
  }
}

// Walk all themes and resolve raw efta[] → eftaLinks[]
for (const theme of themes) {
  if (theme.efta && theme.efta.length > 0) {
    if (!theme.eftaLinks) theme.eftaLinks = [];
    const existing = new Set(theme.eftaLinks.map(l => l.number));
    for (const ref of theme.efta) {
      const clean = ref.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      if (clean && !existing.has(clean)) {
        theme.eftaLinks.push({
          number: clean,
          url: eftaToUrl(clean),
          description: '',
          mediaType: 'pdf',
          sensitive: false,
        });
        existing.add(clean);
        bonusResolved++;
      }
    }
  }
}

console.log(`  Bonus pass resolved: ${bonusResolved} raw EFTA refs → eftaLinks`);

// ============================================================
// WRITE OUTPUT
// ============================================================

console.log('\n=== WRITING OUTPUT FILES ===\n');

// Sort timeline by date
timeline.sort((a, b) => {
  const ad = a.date.replace(/^~/, '');
  const bd = b.date.replace(/^~/, '');
  if (ad.startsWith('undated')) return 1;
  if (bd.startsWith('undated')) return -1;
  return ad.localeCompare(bd);
});

fs.writeFileSync(path.join(DATA, 'timeline.json'), JSON.stringify(timeline, null, 2));
console.log('  Written: timeline.json (' + timeline.length + ' events)');

fs.writeFileSync(path.join(DATA, 'people.json'), JSON.stringify(people, null, 2));
console.log('  Written: people.json (' + people.length + ' people)');

fs.writeFileSync(path.join(DATA, 'connections.json'), JSON.stringify(connections, null, 2));
console.log('  Written: connections.json (' + connections.length + ' connections)');

fs.writeFileSync(path.join(DATA, 'themes.json'), JSON.stringify(themes, null, 2));
console.log('  Written: themes.json (' + themes.length + ' themes)');

console.log('\nDone! Run `npm run build` to validate.');
