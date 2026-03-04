#!/usr/bin/env node
// integrate-chicken-pattern.js
// Injects chicken pattern theme and timeline events into the site data.
// Runs after other integrations, before search index rebuild.

const fs = require('fs');
const path = require('path');

const PEOPLE_PATH = path.join(__dirname, '..', 'src', 'data', 'people.json');
const TIMELINE_PATH = path.join(__dirname, '..', 'src', 'data', 'timeline.json');
const THEMES_PATH = path.join(__dirname, '..', 'src', 'data', 'themes.json');

const people = JSON.parse(fs.readFileSync(PEOPLE_PATH, 'utf-8'));
const timeline = JSON.parse(fs.readFileSync(TIMELINE_PATH, 'utf-8'));
const themes = JSON.parse(fs.readFileSync(THEMES_PATH, 'utf-8'));

console.log('\n=== CHICKEN PATTERN INTEGRATION ===\n');

// ── PART 1: Add theme ────────────────────────────────────────────────────

const THEME_ID = 'chicken-pattern-analysis';

if (!themes.find(t => t.id === THEME_ID)) {
  const maxSection = Math.max(...themes.map(t => t.sectionNumber));
  themes.push({
    id: THEME_ID,
    title: '"Chicken" Code-Word Pattern Analysis',
    sectionNumber: maxSection + 1,
    summary: 'Forensic classification of 36 DOJ EFTA emails containing \'chicken\' language. Analysis identifies two distinct usages: a high-confidence identification of \'chicken man\' as Bill Clinton across a Maxwell\u2013Pritzker correspondence chain, and a tracked individual \u2014 a young woman managed within Epstein\'s operation between 2010 and 2015 \u2014 whose movements, travel logistics, and employment placement are documented across 15+ Bates-stamped emails.',
    content: 'See dedicated page at /themes/chicken-pattern for full document cards, October 2014 event cluster, investigation leads, and network node analysis. All 36 source documents are Bates-stamped DOJ EFTA releases. Classification categories: CONFIRMED_PERSON, PERSON_HIGH_CONFIDENCE, PERSON_MODERATE_CONFIDENCE, AMBIGUOUS, CHICKEN_MAN_CLINTON, CONFIRMED_FOOD.',
    peopleIds: [
      'ghislaine-maxwell',
      'jeffrey-epstein',
      'bill-clinton',
      'tom-pritzker',
      'lesley-groff',
      'jean-luc-brunel',
      'peter-mandelson'
    ],
    timelineEventIds: [
      'chicken-man-globe-article-2002',
      'chicken-paris-oct-2014',
      'chicken-driving-school-oct-2014',
      'chicken-cv-placement-march-2015',
      'chicken-travel-readiness-oct-2014'
    ],
    sources: ['DOJ'],
    tags: ['trafficking', 'coded-language', 'maxwell', 'clinton', 'operational-pipeline', 'verified-primary-source']
  });
  console.log(`  ADD theme: ${THEME_ID} (section ${maxSection + 1})`);
} else {
  console.log(`  SKIP theme: ${THEME_ID} (already exists)`);
}

// ── PART 2: Add timeline events ──────────────────────────────────────────

const newEvents = [
  {
    id: 'chicken-man-globe-article-2002',
    date: '2002-01-01',
    dateDisplay: 'Early 2002',
    era: '2001-2007',
    title: 'Pritzker Identifies Clinton as "Chicken Man" via Globe Article',
    body: 'Tom Pritzker emails Ghislaine Maxwell summarizing a Boston Globe article featuring Maxwell and Clinton at a social event. Pritzker directly references asking Clinton if he \'ever screwed a chicken.\' Three days later, Pritzker refers to the article subject as \'chicken man\' and asks Maxwell to get his autograph. Maxwell responds offering Pritzker drinks with \'chicken man.\' Source: EFTA00663628, EFTA02333212, EFTA02333389.',
    summary: 'Three-document chain identifies Bill Clinton as "chicken man" through Maxwell-Pritzker correspondence about a Boston Globe article.',
    verificationStatus: 'verified',
    peopleIds: ['bill-clinton', 'ghislaine-maxwell', 'tom-pritzker'],
    themeIds: ['chicken-pattern-analysis', 'political-intelligence-network'],
    sources: ['DOJ'],
    tags: ['coded-language', 'clinton', 'maxwell', 'pritzker', 'chicken-man'],
    efta: ['EFTA00663628', 'EFTA02333212', 'EFTA02333389']
  },
  {
    id: 'chicken-paris-oct-2014',
    date: '2014-10-01',
    dateDisplay: 'October 1, 2014',
    era: '2008-2018',
    title: '"Chicken" Arrives in Paris with Handler; European Meetings Coordinated',
    body: 'Email documents an individual referred to as \'chicken\' arriving in Paris with a handler. Daniel (European meetings coordinator) contacted for logistics. Part of a 17-day documented movement cluster. Source: EFTA00998146.',
    summary: 'Email documents "chicken" arriving in Paris with a handler; Daniel coordinating European meetings during October 2014 cluster.',
    verificationStatus: 'verified',
    peopleIds: ['jeffrey-epstein'],
    themeIds: ['chicken-pattern-analysis', 'the-trafficking-operation'],
    sources: ['DOJ'],
    tags: ['chicken-female', 'travel-logistics', 'paris', 'october-2014-cluster', 'operational-pipeline'],
    efta: ['EFTA00998146']
  },
  {
    id: 'chicken-driving-school-oct-2014',
    date: '2014-10-17',
    dateDisplay: 'October 17, 2014',
    era: '2008-2018',
    title: '"Chicken" Awaiting Driving School Exam Result',
    body: 'Email documents individual referred to as \'chicken\' waiting on the result of a driving school examination. Confirms young adult profile. Part of October 2014 movement cluster. Source: EFTA00676207.',
    summary: '"Chicken" waiting on driving school exam result — confirms young adult profile. Part of October 2014 cluster.',
    verificationStatus: 'verified',
    peopleIds: ['jeffrey-epstein'],
    themeIds: ['chicken-pattern-analysis', 'the-trafficking-operation'],
    sources: ['DOJ'],
    tags: ['chicken-female', 'october-2014-cluster', 'driving-school', 'age-indicator'],
    efta: ['EFTA00676207']
  },
  {
    id: 'chicken-cv-placement-march-2015',
    date: '2015-03-19',
    dateDisplay: 'March 19, 2015',
    era: '2008-2018',
    title: 'Jennie Drafts CV for "Chicken"; Epstein Orders Immediate Placement',
    body: 'Two emails on the same date document \'Jennie\' (unidentified placement coordinator) drafting a CV for the individual referred to as \'chicken.\' Epstein demands ASAP employment placement. Confirms the operational pipeline: handler \u2192 CV preparation \u2192 employment placement. Sources: EFTA02507347, EFTA02506281.',
    summary: 'Jennie drafts CV for "chicken" while Epstein demands immediate employment placement — confirms operational pipeline.',
    verificationStatus: 'verified',
    peopleIds: ['jeffrey-epstein'],
    themeIds: ['chicken-pattern-analysis', 'the-trafficking-operation'],
    sources: ['DOJ'],
    tags: ['chicken-female', 'placement-pipeline', 'jennie-unidentified', 'cv-preparation', 'epstein-direct'],
    efta: ['EFTA02507347', 'EFTA02506281']
  },
  {
    id: 'chicken-travel-readiness-oct-2014',
    date: '2014-10-15',
    dateDisplay: '~October 15, 2014',
    era: '2008-2018',
    title: 'Epstein Asks About "Chicken" Travel Readiness; Flying Together Confirmed',
    body: 'Epstein directly asks \'will chicken travel?\' Reply confirms she was ill but has recovered and they will fly together. This is Epstein\'s own words. Confirms female pronoun, travel logistics, and direct Epstein involvement. Source document EFTA number unknown \u2014 Bates stamp not recorded in dataset.',
    summary: 'Epstein asks about "chicken" travel readiness — reply confirms female pronoun and flying together. Bates stamp not recorded.',
    verificationStatus: 'unverified',
    peopleIds: ['jeffrey-epstein'],
    themeIds: ['chicken-pattern-analysis', 'the-trafficking-operation'],
    sources: ['DOJ'],
    tags: ['chicken-female', 'epstein-direct', 'october-2014-cluster', 'travel-logistics', 'confirmed-female', 'bates-unknown'],
    efta: []
  }
];

let eventsAdded = 0;
for (const evt of newEvents) {
  if (!timeline.find(e => e.id === evt.id)) {
    timeline.push(evt);
    console.log(`  ADD event: ${evt.id}`);
    eventsAdded++;
  } else {
    console.log(`  SKIP event: ${evt.id} (already exists)`);
  }
}

// Sort timeline by date
timeline.sort((a, b) => a.date.localeCompare(b.date));

// ── PART 3: Update people themeIds cross-references ──────────────────────

const themePeopleIds = ['ghislaine-maxwell', 'jeffrey-epstein', 'bill-clinton', 'tom-pritzker', 'lesley-groff', 'jean-luc-brunel', 'peter-mandelson'];
let peopleUpdated = 0;
for (const pid of themePeopleIds) {
  const person = people.find(p => p.id === pid);
  if (person && !person.themeIds.includes(THEME_ID)) {
    person.themeIds.push(THEME_ID);
    peopleUpdated++;
  }
}
console.log(`  Updated ${peopleUpdated} people with theme cross-reference`);

// ── WRITE FILES ──────────────────────────────────────────────────────────

fs.writeFileSync(THEMES_PATH, JSON.stringify(themes, null, 2));
fs.writeFileSync(TIMELINE_PATH, JSON.stringify(timeline, null, 2));
fs.writeFileSync(PEOPLE_PATH, JSON.stringify(people, null, 2));

console.log(`\n=== CHICKEN PATTERN INTEGRATION COMPLETE ===`);
console.log(`  Theme added:    1`);
console.log(`  Events added:   ${eventsAdded}`);
console.log(`  People updated: ${peopleUpdated}`);
console.log(`  Total themes:   ${themes.length}`);
console.log(`  Total events:   ${timeline.length}`);
console.log('');
