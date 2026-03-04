#!/usr/bin/env node
/**
 * integrate-wolff-profile.js
 *
 * Integrates data from EFTA01132579 — Michael Wolff's unpublished draft profile
 * of Jeffrey Epstein (~late 2014/early 2015), DOJ Dataset 11.
 *
 * Adds new people, enriches existing profiles, adds timeline events,
 * enriches themes, and creates connections.
 *
 * Fully idempotent — safe to re-run.
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const timeline = JSON.parse(fs.readFileSync(path.join(DATA, 'timeline.json'), 'utf8'));
const people   = JSON.parse(fs.readFileSync(path.join(DATA, 'people.json'), 'utf8'));
const connections = JSON.parse(fs.readFileSync(path.join(DATA, 'connections.json'), 'utf8'));
const themes   = JSON.parse(fs.readFileSync(path.join(DATA, 'themes.json'), 'utf8'));

const SRC = 'EFTA-Wolff';

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
console.log('║  WOLFF PROFILE INTEGRATION (EFTA01132579)       ║');
console.log('╚══════════════════════════════════════════════════╝\n');

/* ═══════════════════════════════════════════════════════════
   PART 1: NEW PEOPLE
   ═══════════════════════════════════════════════════════════ */

console.log('=== PART 1: NEW PEOPLE ===\n');

// Brock Pierce
if (addPerson(makePerson({
  id: 'brock-pierce',
  name: 'Brock Pierce',
  category: 'financial',
  summary: 'Former child actor, co-founder of Digital Entertainment Network (DEN) — which had a documented underage sex abuse scandal — later reinvented as leading Bitcoin investor. Present in Epstein\'s dining room explaining Bitcoin to Larry Summers during UN week, September 2014.',
  sections: [
    {
      title: 'Role',
      content: 'Former child actor who became a "dotcom high flyer" as a principal in Digital Entertainment Network (DEN), an early internet video company that collapsed amid a documented underage sex abuse scandal involving its co-founders. Pierce subsequently reinvented himself as "the most active investor" in Bitcoin.\n\nIn late September 2014, Pierce was present in Epstein\'s Manhattan dining room as a paying visitor/advisee, explaining Bitcoin to Larry Summers. Wolff describes Pierce as running a Bitcoin explanation meeting that Summers joined.\n\nThe DEN sex scandal connection is buried by Wolff in a subordinate clause — the author\'s choice to minimize this connection to Epstein is notable. Pierce\'s presence in Epstein\'s inner circle, given DEN\'s abuse history, warrants further investigation.\n\n---',
      sources: [SRC],
      verificationStatus: 'verified'
    }
  ],
  timelineEventIds: ['2014-09-late-summers-bitcoin-pierce'],
  themeIds: ['political-intelligence-network'],
  connectionIds: ['pierce-epstein-financial-advisory'],
  sources: [SRC]
}))) addedPeople++;

// Thorbjørn Jagland
if (addPerson(makePerson({
  id: 'thorbjorn-jagland',
  name: 'Thorbjørn Jagland',
  aliases: ['Thorbjorn Jagland'],
  category: 'political',
  summary: 'Head of the Nobel Peace Prize Committee. Attended Epstein cocktail party during UN week 2014. Offered critique of U.S. diplomacy and defended Obama\'s Peace Prize. Epstein offered him a ride back to Europe on his jet.',
  sections: [
    {
      title: 'Role',
      content: 'Thorbjørn Jagland, head of the Nobel Peace Prize Committee, attended a small cocktail party at Epstein\'s Manhattan home during UN week in late September 2014, alongside former Australian PM Kevin Rudd.\n\nJagland offered "affable, but general scathing, critique of U.S. diplomacy" and defended Obama\'s Peace Prize. At the end of the evening, Epstein offered Jagland a ride back to Europe on his private jet — demonstrating the jet-as-leverage/access pattern documented throughout the EFTA files.\n\n---',
      sources: [SRC],
      verificationStatus: 'verified'
    }
  ],
  timelineEventIds: ['2014-09-late-rudd-jagland-cocktail'],
  themeIds: ['political-intelligence-network'],
  connectionIds: ['jagland-epstein-social'],
  sources: [SRC]
}))) addedPeople++;

// Reid Weingarten
if (addPerson(makePerson({
  id: 'reid-weingarten',
  name: 'Reid Weingarten',
  category: 'legal',
  summary: 'Attorney who represented WorldCom\'s Bernie Ebbers and Goldman Sachs\'s Lloyd Blankfein. Regular visitor to Epstein\'s dining room; when asked why powerful people keep returning to Epstein, said: "Why we camp out here? I find that question as mysterious as you do."',
  sections: [
    {
      title: 'Role',
      content: 'High-profile defense attorney who had represented WorldCom\'s Bernie Ebbers and Goldman Sachs\'s Lloyd Blankfein. Joined Epstein for breakfast the morning after the Qatari delegation visit during UN week, late September 2014. He had just returned from unsuccessfully defending Connecticut Governor John Rowland.\n\nWeingarten was asked to remain in the dining room while journalist Michael Wolff was temporarily removed — indicating private business was transacted.\n\nWhen asked why powerful people keep returning to Epstein despite everything: "Why we camp out here? I find that question as mysterious as you do."\n\n---',
      sources: [SRC],
      verificationStatus: 'verified'
    }
  ],
  timelineEventIds: [],
  themeIds: ['political-intelligence-network'],
  connectionIds: ['weingarten-epstein-legal'],
  sources: [SRC]
}))) addedPeople++;

// Kevin Rudd
if (addPerson(makePerson({
  id: 'kevin-rudd',
  name: 'Kevin Rudd',
  category: 'political',
  summary: 'Former Australian Prime Minister. Attended a small cocktail party at Epstein\'s Manhattan home during UN week, late September 2014, alongside Nobel Peace Prize Committee chairman Thorbjørn Jagland.',
  sections: [
    {
      title: 'Role',
      content: 'Former Australian Prime Minister who attended a small cocktail party at Epstein\'s Manhattan home during UN week in late September 2014, alongside Thorbjørn Jagland (Nobel Peace Prize Committee head).\n\n---',
      sources: [SRC],
      verificationStatus: 'verified'
    }
  ],
  timelineEventIds: ['2014-09-late-rudd-jagland-cocktail'],
  themeIds: ['political-intelligence-network'],
  connectionIds: ['rudd-epstein-social'],
  sources: [SRC]
}))) addedPeople++;

// Graydon Carter
if (addPerson(makePerson({
  id: 'graydon-carter',
  name: 'Graydon Carter',
  category: 'media',
  summary: 'Vanity Fair editor who allegedly seeded the "Epstein secretly films his guests" rumor. Warned Wolff against visiting Epstein\'s house. Told Epstein: "Then you should live in a two bedroom apartment in Queens" when Epstein expressed second thoughts about being a public figure.',
  sections: [
    {
      title: 'Role',
      content: 'Editor of Vanity Fair. According to Wolff\'s profile (EFTA01132579), Carter deliberately seeded the "Epstein secretly films his guests" rumor and warned Wolff against going to Epstein\'s house or riding in his car: "least I risk being blackmailed." Carter told Wolff: "For you have no idea" regarding what blackmail material might exist.\n\nWhen Epstein called Carter to say he was having second thoughts about being a public figure, Carter responded: "Then you should live in a two bedroom apartment in Queens."\n\nCarter is framed by Wolff as both an antagonist and someone with knowledge of Epstein\'s methods. He previously oversaw the spiking of Vicki Ward\'s investigative Vanity Fair piece on Epstein, which removed allegations from three named sources.\n\n---',
      sources: [SRC, 'OSINT'],
      verificationStatus: 'verified'
    }
  ],
  timelineEventIds: [],
  themeIds: ['political-intelligence-network', 'media-congressional-investigations'],
  connectionIds: ['carter-epstein-media'],
  sources: [SRC, 'OSINT']
}))) addedPeople++;

// Larry Page
if (addPerson(makePerson({
  id: 'larry-page',
  name: 'Larry Page',
  category: 'financial',
  summary: 'Google co-founder who visited Epstein\'s Boeing 727 at TED conference 2002 with Sergey Brin, when Google was still in its infancy. Pitched Epstein on a "Google bras" brand extension.',
  sections: [
    {
      title: 'Role',
      content: 'Google co-founder who visited Epstein\'s Boeing 727 at the TED conference in 2002, alongside co-founder Sergey Brin. Google was "still in its infancy" at the time. Per Wolff\'s account (EFTA01132579), both Page and Brin ran "whooping" from one end of the plane to the other and pitched Epstein on a "Google bras" brand extension — Wolff notes uncertainty whether this was a joke or genuine pitch. They claimed the name "Google" was chosen because men focus on words with two O\'s.\n\nThis is the earliest documented Google/Epstein connection in the EFTA files.\n\n---',
      sources: [SRC],
      verificationStatus: 'verified'
    }
  ],
  timelineEventIds: ['2002-ted-google-founders-epstein-727'],
  themeIds: ['political-intelligence-network'],
  connectionIds: ['page-epstein-social'],
  sources: [SRC]
}))) addedPeople++;

// Elisa New
if (addPerson(makePerson({
  id: 'elisa-new',
  name: 'Elisa New',
  category: 'academic-scientific',
  summary: 'Harvard American poetry professor and wife of Larry Summers. Present at Epstein\'s during UN week September 2014, seeking Epstein\'s advice on finding funding for a WGBH poetry series.',
  sections: [
    {
      title: 'Role',
      content: 'Harvard professor of American poetry and wife of Larry Summers. Present at Epstein\'s Manhattan townhouse during UN week in late September 2014, seeking Epstein\'s advice on finding funding for a WGBH poetry series. Per Wolff\'s account (EFTA01132579), Epstein "makes mince meat of her budget."\n\n---',
      sources: [SRC],
      verificationStatus: 'verified'
    }
  ],
  timelineEventIds: ['2014-09-late-summers-bitcoin-pierce'],
  themeIds: ['political-intelligence-network'],
  connectionIds: ['new-epstein-academic'],
  sources: [SRC]
}))) addedPeople++;

// Eric Holder
if (addPerson(makePerson({
  id: 'eric-holder',
  name: 'Eric Holder',
  category: 'political',
  summary: 'U.S. Attorney General (2009–2015). Epstein told Wolff that Holder would resign by end of week during UN week September 2014 — which proved accurate. Demonstrates Epstein\'s real-time political intelligence network.',
  sections: [
    {
      title: 'Role',
      content: 'U.S. Attorney General under President Obama (2009–2015). After attorney Reid Weingarten left Epstein\'s dining room during UN week (late September 2014), Epstein told journalist Michael Wolff that Eric Holder would resign by the end of the week — which he did (announced September 25, 2014).\n\nThis is a concrete example of Epstein\'s political intelligence network operating in real time. Epstein had advance knowledge of a sitting U.S. Attorney General\'s resignation before it was publicly announced. The source of this information warrants investigation.\n\n---',
      sources: [SRC],
      verificationStatus: 'verified'
    }
  ],
  timelineEventIds: ['2014-09-late-holder-resignation-prediction'],
  themeIds: ['political-intelligence-network'],
  connectionIds: [],
  sources: [SRC]
}))) addedPeople++;

// Sheikh Hamad (Qatar FM)
if (addPerson(makePerson({
  id: 'sheikh-hamad-qatar-fm',
  name: 'Sheikh Hamad bin Jassim bin Jaber Al Thani',
  aliases: ['Sheikh Hamad', 'HBJ'],
  category: 'political',
  summary: 'Qatar\'s former Prime Minister and Foreign Minister. Lived directly across the street from Epstein\'s Manhattan townhouse; shared the same interior decorator. Hosted by Epstein during UN week 2014; pressed on ISIS financing and World Cup bribery allegations.',
  sections: [
    {
      title: 'Role',
      content: 'Qatar\'s former Prime Minister and Foreign Minister. Per Wolff\'s account (EFTA01132579), Sheikh Hamad lived directly across the street from Epstein\'s Manhattan townhouse — they shared the same interior decorator, resulting in identically furnished houses facing each other.\n\nEpstein hosted a Qatari delegation including Hamad the evening of UN week (late September 2014). Epstein pressed Hamad directly: "Why are you financing the bad guys? What do you get out of that?" The Qataris present were most concerned about World Cup bribery allegations potentially compromising their bid.\n\nThe cross-street residential/operational proximity between a sitting foreign minister and Epstein warrants investigation into the nature and duration of this relationship.\n\n---',
      sources: [SRC],
      verificationStatus: 'verified'
    }
  ],
  timelineEventIds: ['2014-09-late-qatar-delegation'],
  themeIds: ['political-intelligence-network', 'intelligence-connections'],
  connectionIds: ['hamad-epstein-political'],
  sources: [SRC]
}))) addedPeople++;


/* ═══════════════════════════════════════════════════════════
   PART 2: ENRICH EXISTING PEOPLE
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 2: ENRICH EXISTING PEOPLE ===\n');

// Michael Wolff
if (enrichPersonSections('michael-wolff', [
  {
    title: 'Wolff Profile of Epstein (EFTA01132579)',
    content: 'Wolff authored a sympathetic, long-form access profile of Jeffrey Epstein for what appears to be *New York* magazine, at Epstein\'s invitation, as part of a Gates-backed rehabilitation push (summer 2014). Wolff had been a regular visitor to Epstein\'s home for more than ten years prior to this writing, keeping off-the-record everything he heard there by his own account.\n\nThe origin of the Wolff–Epstein relationship was the 2002 TED conference: Wolff participated in an Epstein-hosted flight on Epstein\'s 727, alongside Google founders Larry Page and Sergey Brin. This is the foundation document for the intelligence-exchange relationship documented in later EFTA emails.\n\nWolff acknowledges that Vanity Fair editor Graydon Carter specifically seeded the "Epstein secretly films guests" rumor and warned Wolff against visiting; Wolff went anyway. The profile was suppressed when the Daily Mail ran the Dershowitz/Prince Andrew "sex slave" filing in early January 2015 — which Epstein had correctly predicted would become "quite a show."\n\nThe article ends with Wolff expressing hope to be invited back to Epstein\'s house — capturing the transactional access dynamic that continued for years afterward.\n\n---',
    sources: [SRC],
    verificationStatus: 'verified',
    efta: ['EFTA01132579']
  }
])) enrichedPeople++;

// Bill Gates
if (enrichPersonSections('bill-gates', [
  {
    title: 'Gates-Backed Rehabilitation Push (EFTA01132579)',
    content: 'Wolff\'s draft profile (EFTA01132579) explicitly states: "it is Gates who at the end of the summer began prodding Epstein to begin a process of public rehabilitation" (summer 2014). Gates\'s public association with Epstein was the stated impetus for commissioning the Wolff profile — Epstein wanted to get "out in front" of any negative press when the Gates connection became public.\n\nAt this time, Epstein was advising Gates on a Gates Foundation expansion model: adding funds from other wealthy individuals to be deployed through Gates infrastructure but directed to separate causes. The Gates Foundation employed 1,200 people at this time.\n\n---',
    sources: [SRC],
    verificationStatus: 'verified',
    efta: ['EFTA01132579']
  }
])) enrichedPeople++;

// Kathy Ruemmler
if (enrichPersonSections('kathy-ruemmler', [
  {
    title: 'AG Withdrawal & Epstein Breakfast (EFTA01132579)',
    content: 'Wolff\'s draft profile (EFTA01132579) explicitly states Ruemmler "will withdraw from consideration [for Attorney General] in part to work with Epstein." At the time of writing, she had "just left her job as White House Counsel" and was already being discussed as a possible next Attorney General.\n\nRuemmler joined an Epstein breakfast meeting alongside Ehud Barak during UN week (late September 2014). This is the clearest contemporaneous documentation of her decision to work with Epstein being directly connected to withdrawing from AG consideration.\n\n---',
    sources: [SRC],
    verificationStatus: 'verified',
    efta: ['EFTA01132579']
  }
])) enrichedPeople++;

// Larry Summers
if (enrichPersonSections('larry-summers', [
  {
    title: 'UN Week & Bitcoin Discussion (EFTA01132579)',
    content: 'Present at Epstein\'s Manhattan townhouse during UN week (late September 2014). Arrived during a Bitcoin explanation meeting with Brock Pierce. Summers expressed reluctance to invest in Bitcoin citing reputational risk — compared losing money vs. losing credibility as his primary decision calculus.\n\nHis wife Elisa New (Harvard American poetry professor) was also present, seeking Epstein\'s advice on finding funding for a WGBH poetry series — Epstein "makes mince meat of her budget."\n\n---',
    sources: [SRC],
    verificationStatus: 'verified',
    efta: ['EFTA01132579']
  }
])) enrichedPeople++;

// Ehud Barak
if (enrichPersonSections('ehud-barak', [
  {
    title: 'UN Week Breakfast (EFTA01132579)',
    content: 'Present for breakfast at Epstein\'s Manhattan townhouse during UN week (late September / early October 2014), described as "able to defend both Obama and Putin." The casual breakfast setting and first-name-only reference ("it\'s Ehud Barack") underscores the normalization and regularity of contact.\n\nRuemmler joined this breakfast meeting, demonstrating the cross-pollination of Epstein\'s political, legal, and intelligence contacts.\n\n---',
    sources: [SRC],
    verificationStatus: 'verified',
    efta: ['EFTA01132579']
  }
])) enrichedPeople++;

// Bill Richardson
if (enrichPersonSections('bill-richardson', [
  {
    title: 'New Mexico Connection Quote (EFTA01132579)',
    content: 'At lunch in Epstein\'s dining room during the period described in Wolff\'s profile (late 2014), Richardson explained how they met: "Jeffrey is the biggest landowner in New Mexico" — stated as self-evident, requiring no further explanation. This is a direct contemporaneous quote confirming the New Mexico/Richardson connection.\n\n---',
    sources: [SRC],
    verificationStatus: 'verified',
    efta: ['EFTA01132579']
  }
])) enrichedPeople++;

// Eva Andersson-Dubin
if (enrichPersonSections('eva-andersson-dubin-eva-dubin', [
  {
    title: 'Wolff Profile Details (EFTA01132579)',
    content: 'Described in Wolff\'s profile as a former Epstein girlfriend, "a Swedish model and Miss Universe finalist" who went on to become a doctor and married hedge fund manager Glenn Dubin. She and Glenn Dubin jointly finance the Dubin Breast Center at Mount Sinai Hospital.\n\n---',
    sources: [SRC],
    verificationStatus: 'verified',
    efta: ['EFTA01132579']
  }
])) enrichedPeople++;

// Sergey Brin
if (enrichPersonSections('sergey-brin', [
  {
    title: 'TED 2002 Epstein 727 Visit (EFTA01132579)',
    content: 'Co-founder of Google. Visited Epstein\'s Boeing 727 at the TED conference in 2002, alongside Larry Page. Google was "still in its infancy" at the time. Per Wolff\'s account, both Brin and Page ran "whooping" from one end of the plane to the other and pitched Epstein on a "Google bras" brand extension — Wolff notes uncertainty whether this was a joke or genuine pitch. They claimed the name "Google" was chosen because men focus on words with two O\'s.\n\nThis is the earliest documented Google/Epstein connection in the EFTA files.\n\n---',
    sources: [SRC],
    verificationStatus: 'verified',
    efta: ['EFTA01132579']
  }
])) enrichedPeople++;

// Jeffrey Epstein — operational details
if (enrichPersonSections('jeffrey-epstein', [
  {
    title: 'Wolff Profile: Operational & Financial Details (EFTA01132579)',
    content: 'Wolff\'s draft profile (EFTA01132579, ~late 2014/early 2015) provides intimate access-journalism detail of Epstein\'s daily operations at his Manhattan townhouse. Epstein operated from a windowless dining room, hosting world leaders, finance ministers, and billionaires on an hourly appointment basis.\n\nKey operational and financial details from the profile:\n- Purchased the largest private house in Manhattan from Les Wexner (confirmed)\n- Paris apartment: 10,000 square feet on Avenue Foch, with a stuffed baby elephant as décor\n- Described as the "biggest landowner in New Mexico" (Bill Richardson quote)\n- Paid $200 per massage — the stated payment figure (own account)\n- Volunteered to invest $20 million in *New York* magazine when it was for sale in 2004\n\nEpstein\'s own account of the 2008 plea deal mechanics describes the process as "ass-backwards": his lawyers had to persuade Palm Beach authorities to charge him with an offense that would produce sex offender status. A mere solicitation charge would not. He agreed to procurement/pimping charges (despite having paid rather than received money) and agreed to pay legal fees for any girl who sued him and not to contest their civil suits, resulting in high six-figure settlements per victim.\n\nEpstein\'s advance predictions on oil, yen, ruble, and euro prices all bore out between September 2014 and January 2015, suggesting access to information beyond what was publicly available.\n\n---',
    sources: [SRC],
    verificationStatus: 'verified',
    efta: ['EFTA01132579']
  }
])) enrichedPeople++;


/* ═══════════════════════════════════════════════════════════
   PART 3: TIMELINE EVENTS
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 3: TIMELINE EVENTS ===\n');

// 1. TED 2002 — Google founders on Epstein's 727
if (addTimelineEvent(makeTimelineEvent({
  id: '2002-ted-google-founders-epstein-727',
  date: '2002',
  dateDisplay: '2002',
  era: '2001-2007',
  title: 'Google founders Page and Brin visit Epstein\'s 727 at TED conference',
  body: 'At the TED conference in 2002, Google co-founders Larry Page and Sergey Brin — with Google "still in its infancy" — visited Epstein\'s Boeing 727. Per Michael Wolff\'s account (EFTA01132579), they ran "whooping" from one end of the plane to the other and pitched Epstein on a "Google bras" brand extension. This is the earliest documented Google/Epstein connection in the EFTA files. Wolff\'s own relationship with Epstein originated on this same flight.',
  peopleIds: ['jeffrey-epstein', 'larry-page', 'sergey-brin', 'michael-wolff'],
  themeIds: ['political-intelligence-network'],
  sources: [SRC],
  tags: ['media', 'financial'],
  summary: 'Google founders Larry Page and Sergey Brin visit Epstein\'s Boeing 727 at TED conference 2002; earliest documented Google/Epstein connection.',
  eftaLinks: [{
    number: 'EFTA01132579',
    url: 'https://www.justice.gov/epstein/files/DataSet%2011/EFTA01132579.pdf',
    description: 'Michael Wolff draft profile of Jeffrey Epstein',
    mediaType: 'pdf',
    sensitive: false
  }],
  relatedEventIds: [],
  relatedThemeIds: ['political-intelligence-network']
}))) addedEvents++;

// 2. Summer 2014 — Gates rehabilitation push
if (addTimelineEvent(makeTimelineEvent({
  id: '2014-summer-gates-rehabilitation-push',
  date: '2014-07',
  dateDisplay: 'Summer 2014',
  era: '2008-2018',
  title: 'Bill Gates pushes Epstein to begin public rehabilitation; commissions Wolff profile',
  body: 'Bill Gates personally pushed Epstein to begin a public rehabilitation effort at the end of summer 2014. The Wolff profile was commissioned to get Epstein "out in front" of any negative press when the Gates–Epstein association became public. At this time, Epstein was advising Gates on a Gates Foundation expansion model: adding funds from other wealthy individuals to be deployed through Gates infrastructure but directed to separate causes. Gates\'s public association was the stated impetus for commissioning the profile.',
  peopleIds: ['jeffrey-epstein', 'bill-gates', 'michael-wolff'],
  themeIds: ['political-intelligence-network', 'media-congressional-investigations'],
  sources: [SRC],
  tags: ['media', 'financial'],
  summary: 'Bill Gates pushes Epstein to begin public rehabilitation process and commissions Wolff profile as PR strategy.',
  eftaLinks: [{
    number: 'EFTA01132579',
    url: 'https://www.justice.gov/epstein/files/DataSet%2011/EFTA01132579.pdf',
    description: 'Michael Wolff draft profile of Jeffrey Epstein',
    mediaType: 'pdf',
    sensitive: false
  }],
  relatedEventIds: ['2015-01-dershowitz-prince-andrew-filing'],
  relatedThemeIds: ['political-intelligence-network', 'media-congressional-investigations']
}))) addedEvents++;

// 3. Late Sept 2014 — Qatar delegation
if (addTimelineEvent(makeTimelineEvent({
  id: '2014-09-late-qatar-delegation',
  date: '2014-09-22',
  dateDisplay: 'Late September 2014',
  era: '2008-2018',
  title: 'Epstein hosts Qatar FM Sheikh Hamad delegation; presses on ISIS financing',
  body: 'During UN General Assembly week, Epstein hosted a Qatari delegation including Foreign Minister Sheikh Hamad bin Jassim bin Jaber Al Thani at his Manhattan townhouse. Epstein pressed Hamad directly: "Why are you financing the bad guys? What do you get out of that?" The Qataris present were most concerned about World Cup bribery allegations potentially compromising their bid. Sheikh Hamad lived directly across the street from Epstein and shared the same interior decorator.',
  peopleIds: ['jeffrey-epstein', 'sheikh-hamad-qatar-fm'],
  themeIds: ['political-intelligence-network', 'intelligence-connections'],
  sources: [SRC],
  tags: ['intelligence', 'political'],
  summary: 'Epstein hosts Qatar FM Sheikh Hamad delegation during UN week; presses on ISIS financing and World Cup bribery.',
  eftaLinks: [{
    number: 'EFTA01132579',
    url: 'https://www.justice.gov/epstein/files/DataSet%2011/EFTA01132579.pdf',
    description: 'Michael Wolff draft profile of Jeffrey Epstein',
    mediaType: 'pdf',
    sensitive: false
  }],
  relatedEventIds: ['2014-09-late-holder-resignation-prediction'],
  relatedThemeIds: ['political-intelligence-network', 'intelligence-connections']
}))) addedEvents++;

// 4. Late Sept 2014 — Summers/Pierce Bitcoin discussion
if (addTimelineEvent(makeTimelineEvent({
  id: '2014-09-late-summers-bitcoin-pierce',
  date: '2014-09-23',
  dateDisplay: 'Late September 2014',
  era: '2008-2018',
  title: 'Larry Summers and Brock Pierce discuss Bitcoin at Epstein\'s; Elisa New seeks funding advice',
  body: 'Former Treasury Secretary Larry Summers attended Epstein\'s Manhattan dining room during UN week, arriving during a Bitcoin explanation meeting with Brock Pierce. Summers expressed reluctance to invest in Bitcoin citing reputational risk — compared losing money vs. losing credibility as his primary decision calculus. Summers\' wife Elisa New (Harvard American poetry professor) was also present, seeking Epstein\'s advice on finding funding for a WGBH poetry series — Epstein "makes mince meat of her budget."',
  peopleIds: ['jeffrey-epstein', 'larry-summers', 'brock-pierce', 'elisa-new'],
  themeIds: ['political-intelligence-network'],
  sources: [SRC],
  tags: ['financial', 'political'],
  summary: 'Larry Summers present at Epstein dining room for Bitcoin discussion with Brock Pierce; wife Elisa New seeks funding advice.',
  eftaLinks: [{
    number: 'EFTA01132579',
    url: 'https://www.justice.gov/epstein/files/DataSet%2011/EFTA01132579.pdf',
    description: 'Michael Wolff draft profile of Jeffrey Epstein',
    mediaType: 'pdf',
    sensitive: false
  }],
  relatedEventIds: ['2014-09-late-qatar-delegation', '2014-09-late-ruemmler-barak-breakfast'],
  relatedThemeIds: ['political-intelligence-network']
}))) addedEvents++;

// 5. Late Sept 2014 — Ruemmler/Barak breakfast
if (addTimelineEvent(makeTimelineEvent({
  id: '2014-09-late-ruemmler-barak-breakfast',
  date: '2014-09-24',
  dateDisplay: 'Late September 2014',
  era: '2008-2018',
  title: 'Kathy Ruemmler joins Epstein breakfast with Ehud Barak; reportedly withdrew from AG consideration to work with Epstein',
  body: 'Former White House Counsel Kathy Ruemmler joined an Epstein breakfast meeting alongside former Israeli PM Ehud Barak during UN week. Wolff\'s profile explicitly states Ruemmler "will withdraw from consideration [for Attorney General] in part to work with Epstein." She had "just left her job as White House Counsel" and was being discussed as a possible next AG. This is the clearest contemporaneous documentation of her decision to work with Epstein being directly connected to withdrawing from AG consideration.',
  peopleIds: ['jeffrey-epstein', 'kathy-ruemmler', 'ehud-barak'],
  themeIds: ['political-intelligence-network', 'the-acosta-plea-deal-legal-history'],
  sources: [SRC],
  tags: ['legal', 'political', 'intelligence'],
  summary: 'Kathy Ruemmler joins Epstein breakfast with Ehud Barak; reportedly withdrew from AG consideration to work with Epstein.',
  eftaLinks: [{
    number: 'EFTA01132579',
    url: 'https://www.justice.gov/epstein/files/DataSet%2011/EFTA01132579.pdf',
    description: 'Michael Wolff draft profile of Jeffrey Epstein',
    mediaType: 'pdf',
    sensitive: false
  }],
  relatedEventIds: ['2014-09-late-qatar-delegation', '2014-09-late-holder-resignation-prediction'],
  relatedThemeIds: ['political-intelligence-network', 'the-acosta-plea-deal-legal-history']
}))) addedEvents++;

// 6. Late Sept 2014 — Rudd/Jagland cocktail
if (addTimelineEvent(makeTimelineEvent({
  id: '2014-09-late-rudd-jagland-cocktail',
  date: '2014-09-25',
  dateDisplay: 'Late September 2014',
  era: '2008-2018',
  title: 'Kevin Rudd and Thorbjørn Jagland attend Epstein cocktail party; Epstein offers Jagland jet ride to Europe',
  body: 'Former Australian PM Kevin Rudd and Nobel Peace Prize Committee chairman Thorbjørn Jagland attended a small cocktail party at Epstein\'s Manhattan home during UN week. Jagland offered "affable, but general scathing, critique of U.S. diplomacy" and defended Obama\'s Peace Prize. Epstein offered Jagland a ride back to Europe on his private jet — demonstrating the jet-as-leverage/access pattern documented throughout the EFTA files.',
  peopleIds: ['jeffrey-epstein', 'kevin-rudd', 'thorbjorn-jagland'],
  themeIds: ['political-intelligence-network'],
  sources: [SRC],
  tags: ['political', 'intelligence'],
  summary: 'Kevin Rudd and Thorbjørn Jagland attend Epstein cocktail party; Epstein offers Jagland jet ride to Europe.',
  eftaLinks: [{
    number: 'EFTA01132579',
    url: 'https://www.justice.gov/epstein/files/DataSet%2011/EFTA01132579.pdf',
    description: 'Michael Wolff draft profile of Jeffrey Epstein',
    mediaType: 'pdf',
    sensitive: false
  }],
  relatedEventIds: ['2014-09-late-qatar-delegation'],
  relatedThemeIds: ['political-intelligence-network']
}))) addedEvents++;

// 7. Late Sept 2014 — Holder resignation prediction
if (addTimelineEvent(makeTimelineEvent({
  id: '2014-09-late-holder-resignation-prediction',
  date: '2014-09-25',
  dateDisplay: 'Late September 2014',
  era: '2008-2018',
  title: 'Epstein tells Wolff Eric Holder will resign by end of week — confirmed accurate',
  body: 'After attorney Reid Weingarten left Epstein\'s dining room, Epstein told journalist Michael Wolff that Attorney General Eric Holder would resign by the end of the week — which he did (announced September 25, 2014). This is a concrete example of Epstein\'s political intelligence network operating in real time: advance knowledge of a Cabinet-level resignation before it was publicly announced. The source of Epstein\'s advance intelligence warrants investigation.',
  peopleIds: ['jeffrey-epstein', 'michael-wolff', 'eric-holder', 'reid-weingarten'],
  themeIds: ['political-intelligence-network', 'intelligence-connections'],
  sources: [SRC],
  tags: ['intelligence', 'political'],
  summary: 'Epstein accurately predicts Eric Holder resignation before public announcement — demonstrates real-time political intelligence network.',
  eftaLinks: [{
    number: 'EFTA01132579',
    url: 'https://www.justice.gov/epstein/files/DataSet%2011/EFTA01132579.pdf',
    description: 'Michael Wolff draft profile of Jeffrey Epstein',
    mediaType: 'pdf',
    sensitive: false
  }],
  relatedEventIds: ['2014-09-late-ruemmler-barak-breakfast', '2014-09-late-qatar-delegation'],
  relatedThemeIds: ['political-intelligence-network', 'intelligence-connections']
}))) addedEvents++;

// 8. Early Jan 2015 — Dershowitz/Prince Andrew filing; profile suppressed
if (addTimelineEvent(makeTimelineEvent({
  id: '2015-01-dershowitz-prince-andrew-filing',
  date: '2015-01-02',
  dateDisplay: 'Early January 2015',
  era: '2008-2018',
  title: 'Dershowitz/Prince Andrew "sex slave" filing published; Wolff profile suppressed',
  body: 'The Daily Mail published the Dershowitz/Prince Andrew "sex slave" filing, which Epstein had predicted would become "quite a show." The publication overtook Wolff\'s sympathetic profile before it could be published, effectively suppressing it. Wolff confirmed Epstein\'s prediction proved correct. The profile was recovered years later as part of the DOJ EFTA release (Dataset 11, EFTA01132579).',
  peopleIds: ['jeffrey-epstein', 'michael-wolff', 'alan-dershowitz'],
  themeIds: ['political-intelligence-network', 'media-congressional-investigations', 'the-acosta-plea-deal-legal-history'],
  sources: [SRC],
  tags: ['media', 'legal'],
  summary: 'Dershowitz/Prince Andrew "sex slave" filing in Daily Mail suppresses Wolff\'s planned sympathetic Epstein profile.',
  eftaLinks: [{
    number: 'EFTA01132579',
    url: 'https://www.justice.gov/epstein/files/DataSet%2011/EFTA01132579.pdf',
    description: 'Michael Wolff draft profile of Jeffrey Epstein',
    mediaType: 'pdf',
    sensitive: false
  }],
  relatedEventIds: ['2014-summer-gates-rehabilitation-push'],
  relatedThemeIds: ['political-intelligence-network', 'media-congressional-investigations']
}))) addedEvents++;


/* ═══════════════════════════════════════════════════════════
   PART 4: CONNECTIONS
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 4: CONNECTIONS ===\n');

if (addConnection(makeConnection({
  id: 'pierce-epstein-financial-advisory',
  source: 'brock-pierce',
  target: 'jeffrey-epstein',
  type: 'financial',
  strength: 2,
  description: 'Brock Pierce was present in Epstein\'s dining room as a paying visitor/advisee, explaining Bitcoin to Larry Summers during UN week September 2014. Former DEN co-founder with documented sex abuse scandal history.',
  sources: [SRC]
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'jagland-epstein-social',
  source: 'thorbjorn-jagland',
  target: 'jeffrey-epstein',
  type: 'social',
  strength: 2,
  description: 'Nobel Peace Prize Committee chairman attended Epstein cocktail party during UN week 2014. Epstein offered him a ride back to Europe on his private jet.',
  sources: [SRC]
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'weingarten-epstein-legal',
  source: 'reid-weingarten',
  target: 'jeffrey-epstein',
  type: 'associate',
  strength: 2,
  description: 'High-profile defense attorney who regularly visited Epstein\'s dining room; when asked why powerful people keep returning to Epstein, said: "Why we camp out here? I find that question as mysterious as you do."',
  sources: [SRC]
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'rudd-epstein-social',
  source: 'kevin-rudd',
  target: 'jeffrey-epstein',
  type: 'social',
  strength: 1,
  description: 'Former Australian PM attended Epstein cocktail party during UN week, September 2014.',
  sources: [SRC]
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'carter-epstein-media',
  source: 'graydon-carter',
  target: 'jeffrey-epstein',
  type: 'associate',
  strength: 2,
  description: 'Vanity Fair editor who allegedly seeded the "Epstein secretly films guests" rumor; warned Wolff against visiting. Previously oversaw spiking of Vicki Ward\'s investigative piece on Epstein.',
  sources: [SRC, 'OSINT']
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'page-epstein-social',
  source: 'larry-page',
  target: 'jeffrey-epstein',
  type: 'social',
  strength: 2,
  description: 'Google co-founder visited Epstein\'s Boeing 727 at TED conference 2002; pitched "Google bras" brand extension. Earliest documented Google/Epstein connection.',
  sources: [SRC]
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'new-epstein-academic',
  source: 'elisa-new',
  target: 'jeffrey-epstein',
  type: 'academic',
  strength: 1,
  description: 'Harvard poetry professor and wife of Larry Summers; sought Epstein\'s advice on WGBH poetry series funding during UN week 2014.',
  sources: [SRC]
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'hamad-epstein-political',
  source: 'sheikh-hamad-qatar-fm',
  target: 'jeffrey-epstein',
  type: 'social',
  strength: 3,
  description: 'Qatar FM lived directly across the street from Epstein\'s Manhattan townhouse; shared the same interior decorator. Hosted by Epstein during UN week 2014; Epstein pressed on ISIS financing.',
  sources: [SRC]
}))) addedConnections++;

// Page–Brin connection (both on the 727)
if (addConnection(makeConnection({
  id: 'page-brin-google-epstein-727',
  source: 'larry-page',
  target: 'sergey-brin',
  type: 'associate',
  strength: 3,
  description: 'Google co-founders both visited Epstein\'s 727 at TED conference 2002 and pitched "Google bras" to Epstein.',
  sources: [SRC]
}))) addedConnections++;

// Pierce–Summers (Bitcoin meeting)
if (addConnection(makeConnection({
  id: 'pierce-summers-bitcoin-meeting',
  source: 'brock-pierce',
  target: 'larry-summers',
  type: 'associate',
  strength: 1,
  description: 'Pierce explained Bitcoin to Summers in Epstein\'s dining room during UN week September 2014.',
  sources: [SRC]
}))) addedConnections++;


/* ═══════════════════════════════════════════════════════════
   PART 5: ENRICH THEMES
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 5: ENRICH THEMES ===\n');

// Enrich "political-intelligence-network"
const polIntelTheme = findThemeById('political-intelligence-network');
if (polIntelTheme) {
  const MARKER = 'Wolff Profile: UN Week Intelligence Window';
  if (!polIntelTheme.content.includes(MARKER)) {
    polIntelTheme.content = polIntelTheme.content.replace(/\n*---\s*$/, '');
    polIntelTheme.content += `\n\n## ${MARKER}\n\nThe Wolff draft profile (EFTA01132579) provides a rare real-time window into Epstein's intelligence-gathering operation. During a single week in late September 2014 — UN General Assembly week — Epstein hosted Qatar's foreign minister Sheikh Hamad (pressing him on ISIS financing and World Cup bribery), former Australian Prime Minister Kevin Rudd, Nobel Peace Prize Committee chairman Thorbjørn Jagland, former Treasury Secretary Larry Summers, former Israeli PM Ehud Barak, and incoming Epstein associate Kathy Ruemmler. Epstein told journalist Michael Wolff that Eric Holder would resign by the end of the week — a prediction that proved accurate (announced September 25, 2014). Wolff writes that Epstein's advance predictions on oil, yen, ruble, and euro prices all bore out between September 2014 and January 2015, suggesting access to information beyond what was publicly available.\n\n---`;
    if (!polIntelTheme.sources.includes(SRC)) polIntelTheme.sources.push(SRC);
    // Add new people to theme
    const newThemePeople = ['brock-pierce', 'thorbjorn-jagland', 'reid-weingarten', 'kevin-rudd',
      'graydon-carter', 'larry-page', 'elisa-new', 'eric-holder', 'sheikh-hamad-qatar-fm'];
    for (const pid of newThemePeople) {
      if (!polIntelTheme.peopleIds.includes(pid)) polIntelTheme.peopleIds.push(pid);
    }
    const newThemeEvents = ['2002-ted-google-founders-epstein-727', '2014-summer-gates-rehabilitation-push',
      '2014-09-late-qatar-delegation', '2014-09-late-summers-bitcoin-pierce',
      '2014-09-late-ruemmler-barak-breakfast', '2014-09-late-rudd-jagland-cocktail',
      '2014-09-late-holder-resignation-prediction', '2015-01-dershowitz-prince-andrew-filing'];
    for (const eid of newThemeEvents) {
      if (!polIntelTheme.timelineEventIds.includes(eid)) polIntelTheme.timelineEventIds.push(eid);
    }
    console.log('  ENRICH theme: political-intelligence-network');
  } else {
    console.log('  SKIP theme (exists): political-intelligence-network');
  }
}

// Enrich "media-congressional-investigations" (closest to "Media Manipulation")
const mediaTheme = findThemeById('media-congressional-investigations');
if (mediaTheme) {
  const MARKER2 = 'Wolff Profile as Media Manipulation Instrument';
  if (!mediaTheme.content.includes(MARKER2)) {
    mediaTheme.content = mediaTheme.content.replace(/\n*---\s*$/, '');
    mediaTheme.content += `\n\n## ${MARKER2}\n\nThe Wolff profile was itself a media manipulation instrument. Per the document (EFTA01132579), Bill Gates personally pushed Epstein to begin a public rehabilitation effort in the summer of 2014, and the profile was commissioned to get "out in front" of the Gates–Epstein association becoming public. Wolff — who had been a regular visitor to Epstein's home for a decade and kept everything off-the-record voluntarily — agreed to write a sympathetic profile. The article characterizes Epstein's 2008 conviction framing as "prostitution" and minimizes the age of victims. Graydon Carter (Vanity Fair) is described by Wolff as having seeded the "secret filming" rumor. The profile was suppressed when the Daily Mail ran the Dershowitz/Prince Andrew story in early January 2015 — which Epstein correctly predicted. The Wolff–Epstein relationship then continued as a political intelligence exchange documented in later EFTA emails through 2019.\n\n---`;
    if (!mediaTheme.sources.includes(SRC)) mediaTheme.sources.push(SRC);
    const mediaPeople = ['graydon-carter', 'michael-wolff', 'bill-gates'];
    for (const pid of mediaPeople) {
      if (!mediaTheme.peopleIds.includes(pid)) mediaTheme.peopleIds.push(pid);
    }
    const mediaEvents = ['2014-summer-gates-rehabilitation-push', '2015-01-dershowitz-prince-andrew-filing'];
    for (const eid of mediaEvents) {
      if (!mediaTheme.timelineEventIds.includes(eid)) mediaTheme.timelineEventIds.push(eid);
    }
    console.log('  ENRICH theme: media-congressional-investigations');
  } else {
    console.log('  SKIP theme (exists): media-congressional-investigations');
  }
}

// Enrich "the-acosta-plea-deal-legal-history"
const acostaTheme = findThemeById('the-acosta-plea-deal-legal-history');
if (acostaTheme) {
  const MARKER3 = 'Epstein\'s Own Account of Plea Deal Mechanics';
  if (!acostaTheme.content.includes(MARKER3)) {
    acostaTheme.content = acostaTheme.content.replace(/\n*---\s*$/, '');
    acostaTheme.content += `\n\n## ${MARKER3}\n\nThe Wolff profile (EFTA01132579) contains Epstein's own account of the 2008 plea deal structure, describing it as "ass-backwards": Epstein's lawyers had to persuade Palm Beach authorities to charge him with an offense that would produce sex offender status; a mere solicitation charge would not. He therefore agreed to procurement/pimping charges (despite having paid rather than received money). He also agreed to pay legal fees for any girl who sued him and not to contest their civil suits, resulting in high six-figure settlements per victim. Epstein's massage-network account describes $200 payments, girls recommending other girls, and the referral chain that produced the investigation's initial subjects.\n\n---`;
    if (!acostaTheme.sources.includes(SRC)) acostaTheme.sources.push(SRC);
    const acostaEvents = ['2014-09-late-ruemmler-barak-breakfast', '2015-01-dershowitz-prince-andrew-filing'];
    for (const eid of acostaEvents) {
      if (!acostaTheme.timelineEventIds.includes(eid)) acostaTheme.timelineEventIds.push(eid);
    }
    console.log('  ENRICH theme: the-acosta-plea-deal-legal-history');
  } else {
    console.log('  SKIP theme (exists): the-acosta-plea-deal-legal-history');
  }
}

// Enrich "intelligence-connections"
const intelTheme = findThemeById('intelligence-connections');
if (intelTheme) {
  const MARKER4 = 'Qatar Cross-Street Proximity & Holder Advance Knowledge';
  if (!intelTheme.content.includes(MARKER4)) {
    intelTheme.content = intelTheme.content.replace(/\n*---\s*$/, '');
    intelTheme.content += `\n\n## ${MARKER4}\n\nThe Wolff profile (EFTA01132579) documents two intelligence-adjacent patterns: (1) Qatar's Foreign Minister Sheikh Hamad lived directly across the street from Epstein's Manhattan townhouse, sharing the same interior decorator — a residential/operational proximity that facilitated regular contact and intelligence gathering on Middle Eastern affairs including ISIS financing; (2) Epstein accurately predicted Eric Holder's resignation as Attorney General before it was publicly announced during UN week September 2014, demonstrating real-time access to Cabinet-level political intelligence.\n\n---`;
    if (!intelTheme.sources.includes(SRC)) intelTheme.sources.push(SRC);
    const intelPeople = ['sheikh-hamad-qatar-fm', 'eric-holder'];
    for (const pid of intelPeople) {
      if (!intelTheme.peopleIds.includes(pid)) intelTheme.peopleIds.push(pid);
    }
    const intelEvents = ['2014-09-late-qatar-delegation', '2014-09-late-holder-resignation-prediction'];
    for (const eid of intelEvents) {
      if (!intelTheme.timelineEventIds.includes(eid)) intelTheme.timelineEventIds.push(eid);
    }
    console.log('  ENRICH theme: intelligence-connections');
  } else {
    console.log('  SKIP theme (exists): intelligence-connections');
  }
}


/* ═══════════════════════════════════════════════════════════
   PART 6: WIRE UP REFERENCES
   ═══════════════════════════════════════════════════════════ */

console.log('\n=== PART 6: WIRE UP REFERENCES ===\n');

// Wire new people to their themes
const allNewPeople = ['brock-pierce', 'thorbjorn-jagland', 'reid-weingarten', 'kevin-rudd',
  'graydon-carter', 'larry-page', 'elisa-new', 'eric-holder', 'sheikh-hamad-qatar-fm'];
for (const pid of allNewPeople) {
  addPersonTheme(pid, 'political-intelligence-network');
}
addPersonTheme('graydon-carter', 'media-congressional-investigations');
addPersonTheme('sheikh-hamad-qatar-fm', 'intelligence-connections');

// Wire existing people to new events
addPersonEvent('jeffrey-epstein', '2002-ted-google-founders-epstein-727');
addPersonEvent('jeffrey-epstein', '2014-summer-gates-rehabilitation-push');
addPersonEvent('jeffrey-epstein', '2014-09-late-qatar-delegation');
addPersonEvent('jeffrey-epstein', '2014-09-late-summers-bitcoin-pierce');
addPersonEvent('jeffrey-epstein', '2014-09-late-ruemmler-barak-breakfast');
addPersonEvent('jeffrey-epstein', '2014-09-late-rudd-jagland-cocktail');
addPersonEvent('jeffrey-epstein', '2014-09-late-holder-resignation-prediction');
addPersonEvent('jeffrey-epstein', '2015-01-dershowitz-prince-andrew-filing');

addPersonEvent('michael-wolff', '2002-ted-google-founders-epstein-727');
addPersonEvent('michael-wolff', '2014-summer-gates-rehabilitation-push');
addPersonEvent('michael-wolff', '2014-09-late-holder-resignation-prediction');
addPersonEvent('michael-wolff', '2015-01-dershowitz-prince-andrew-filing');

addPersonEvent('bill-gates', '2014-summer-gates-rehabilitation-push');

addPersonEvent('kathy-ruemmler', '2014-09-late-ruemmler-barak-breakfast');

addPersonEvent('larry-summers', '2014-09-late-summers-bitcoin-pierce');

addPersonEvent('ehud-barak', '2014-09-late-ruemmler-barak-breakfast');

addPersonEvent('sergey-brin', '2002-ted-google-founders-epstein-727');

// Wire people to connections
addPersonConnection('brock-pierce', 'pierce-epstein-financial-advisory');
addPersonConnection('jeffrey-epstein', 'pierce-epstein-financial-advisory');

addPersonConnection('thorbjorn-jagland', 'jagland-epstein-social');
addPersonConnection('jeffrey-epstein', 'jagland-epstein-social');

addPersonConnection('reid-weingarten', 'weingarten-epstein-legal');
addPersonConnection('jeffrey-epstein', 'weingarten-epstein-legal');

addPersonConnection('kevin-rudd', 'rudd-epstein-social');
addPersonConnection('jeffrey-epstein', 'rudd-epstein-social');

addPersonConnection('graydon-carter', 'carter-epstein-media');
addPersonConnection('jeffrey-epstein', 'carter-epstein-media');

addPersonConnection('larry-page', 'page-epstein-social');
addPersonConnection('jeffrey-epstein', 'page-epstein-social');

addPersonConnection('elisa-new', 'new-epstein-academic');
addPersonConnection('jeffrey-epstein', 'new-epstein-academic');

addPersonConnection('sheikh-hamad-qatar-fm', 'hamad-epstein-political');
addPersonConnection('jeffrey-epstein', 'hamad-epstein-political');

addPersonConnection('larry-page', 'page-brin-google-epstein-727');
addPersonConnection('sergey-brin', 'page-brin-google-epstein-727');

addPersonConnection('brock-pierce', 'pierce-summers-bitcoin-meeting');
addPersonConnection('larry-summers', 'pierce-summers-bitcoin-meeting');

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
console.log(`║  WOLFF PROFILE INTEGRATION COMPLETE             ║`);
console.log(`╠══════════════════════════════════════════════════╣`);
console.log(`║  New people:      ${String(addedPeople).padStart(3)}                          ║`);
console.log(`║  Enriched people: ${String(enrichedPeople).padStart(3)}                          ║`);
console.log(`║  New events:      ${String(addedEvents).padStart(3)}                          ║`);
console.log(`║  New connections: ${String(addedConnections).padStart(3)}                          ║`);
console.log(`╚══════════════════════════════════════════════════╝\n`);
