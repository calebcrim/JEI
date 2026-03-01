#!/usr/bin/env node
/**
 * COVID Science Network Integration Script
 * Integrates Epstein's Science Network & Pandemic Expertise data
 * from epstein_covid_science_network.md into site JSON.
 * Fully idempotent — safe to re-run.
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const timeline = JSON.parse(fs.readFileSync(path.join(DATA, 'timeline.json'), 'utf8'));
const people = JSON.parse(fs.readFileSync(path.join(DATA, 'people.json'), 'utf8'));
const connections = JSON.parse(fs.readFileSync(path.join(DATA, 'connections.json'), 'utf8'));
const themes = JSON.parse(fs.readFileSync(path.join(DATA, 'themes.json'), 'utf8'));

const SRC = 'EFTA-Science';
const THEME_ID = 'science-network-pandemic-expertise';

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
    era: opts.era || '2020-present',
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
    category: opts.category || 'academic-scientific',
    subcategory: opts.subcategory || undefined,
    summary: opts.summary,
    sections: opts.sections || [
      { title: 'Role', content: opts.roleText || opts.summary, sources: opts.sources || [SRC] },
      { title: 'Source', content: 'EFTA corpus science network analysis — DOJ releases, Harvard/MIT reports, credible journalism\n\n---', sources: [SRC] }
    ],
    timelineEventIds: opts.timelineEventIds || [],
    themeIds: opts.themeIds || [THEME_ID, 'academic-scientific-network'],
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
    relationshipType: opts.type || 'academic',
    strength: opts.strength || 2,
    description: opts.description,
    sources: opts.sources || [SRC],
    verificationStatus: opts.verification || 'verified',
    activeEras: []
  };
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
    // Insert before the last "Source files"/"Source" section if present
    const sourceIdx = person.sections.findIndex(s => s.title === 'Source files' || s.title === 'Source');
    if (sourceIdx >= 0) {
      person.sections.splice(sourceIdx, 0, sec);
    } else {
      person.sections.push(sec);
    }
    added++;
  }
  if (added > 0) {
    if (!person.sources.includes(SRC)) person.sources.push(SRC);
    console.log(`  ENRICH person: ${personId} (+${added} sections)`);
    return true;
  }
  return false;
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

function enrichThemeContent(themeId, additionalText, marker) {
  const theme = findThemeById(themeId);
  if (!theme) {
    console.log(`  WARN: theme ${themeId} not found`);
    return false;
  }
  if (theme.content.includes(marker)) {
    console.log(`  SKIP (already enriched): ${themeId}`);
    return false;
  }
  theme.content = theme.content.replace(/\n*---\s*$/, '');
  theme.content += '\n\n### ' + marker + '\n\n' + additionalText + '\n\n---';
  if (!theme.sources.includes(SRC)) theme.sources.push(SRC);
  console.log(`  ENRICH theme: ${themeId}`);
  return true;
}

let addedPeople = 0, addedEvents = 0, addedConnections = 0, enrichedThemes = 0, enrichedPeople = 0;

// ============================================================
// PART 1: NEW THEME
// ============================================================

console.log('\n=== PART 1: NEW THEME ===\n');

const newTheme = {
  id: THEME_ID,
  title: "Epstein's Science Network & Pandemic-Adjacent Expertise",
  sectionNumber: 21,
  summary: "Epstein systematically infiltrated elite scientific networks at Harvard and MIT, concentrating on genetics, evolutionary biology, and transhumanism. Three scientists in his documented orbit — Nathan Wolfe (virology/pandemic preparedness), George Church (synthetic biology), and Martin Nowak (virus dynamics) — possess expertise directly relevant to pandemic science. However, after exhaustive review of the 3.5 million pages released by the DOJ under the Epstein Files Transparency Act, no evidence connects Epstein to COVID-19 research, gain-of-function work, the Wuhan Institute of Virology, or operational pandemic planning.",
  content: `## The Science Philanthropy Portfolio

Epstein's Jeffrey Epstein VI Foundation concentrated funding in evolutionary biology, mathematics, genetics, neuroscience, AI, and theoretical physics — **not virology, infectious disease, or pandemic preparedness**.

| Recipient | Amount | Field | COVID Relevance |
|---|---|---|---|
| Harvard PED (Martin Nowak) | $6.5M | Evolutionary dynamics, virus modeling | R₀ concept; no direct COVID work |
| George Church / Harvard | $686K + ~$2M brokered | Genetics, CRISPR, synthetic biology | Post-Epstein COVID vaccine work |
| MIT Media Lab (Joi Ito) | ~$850K total | AI, media technology | None |
| Seth Lloyd / MIT | Included in MIT total | Quantum computing | None |
| Edge Foundation (John Brockman) | $638K | Science intellectual salons | Indirect network building |
| Santa Fe Institute | $250K+ | Complex systems | Pandemic modeling (indirect) |
| Lawrence Krauss / ASU Origins | $250K+ | Physics outreach | None |
| Total at Harvard alone | ~$9.1M | Various | See above |

## Nathan Wolfe — The Most Direct Pandemic-to-Epstein Link

Nathan Wolfe — Stanford virologist, pandemic preparedness expert, and author of *The Viral Storm* (2011) — is mentioned **589 times** in DOJ-released documents. He founded the Global Viral Forecasting Initiative (2007) and Metabiota, a biological threat evaluation company. He served on DARPA's Defense Science Research Council and sat on the editorial board of *EcoHealth*.

DOJ emails (Bates ref: EFTA00961409) show Wolfe corresponded with Epstein from 2008 to 2013, visited his homes in New York and Florida, and proposed Epstein fund a study of undergraduate sexual behavior — the "horny virus hypothesis." In December 2010, Wolfe invited Epstein to a dinner party, describing attendees as including "a couple of hottie interns from WEF."

Stanford ended his visiting appointment in February 2026 following DOJ revelations. Wolfe stated he never received Epstein funding, never visited his island, and never flew on his plane.

**The indirect Metabiota–EcoHealth link:** Wolfe's professional overlap with EcoHealth Alliance through the PREDICT program creates a network bridge — but it is a professional association, not a documented Epstein→EcoHealth connection. Claims of a direct Epstein–Peter Daszak link extrapolate through Wolfe without documentary support.

## Martin Nowak — Virus Dynamics & the R₀ Concept

Nowak is the author of *Virus Dynamics: Mathematical Principles of Immunology and Virology* (2000) — a foundational text establishing core concepts including the basic reproductive ratio (R₀) now ubiquitous in COVID-19 epidemiology. Epstein gave Nowak $6.5 million to establish Harvard's Program for Evolutionary Dynamics (PED) in 2003 — the single largest Epstein science gift. Nowak's name appears over 4,000 times in DOJ documents.

Epstein maintained a personal office (Room 610) in the PED building with an unrestricted keycard, visiting over 40 times between 2010–2018. He reviewed Nowak's *Nature* paper page proofs before publication and suggested research topics. A 2014 email (Bates EFTA00748457): Nowak wrote "our spy was captured after completing her mission"; Epstein replied "did you torture her."

## George Church — Genetics, Synthetic Biology & COVID-19 Adjacency

Church received $686,000 directly from the Jeffrey Epstein VI Foundation (2005–2007) plus approximately $2 million through donors Epstein brokered. They co-founded Georgarage in 2014 focused on genetics startups. In 2013, Epstein enrolled in Church's Personal Genome Project, causing internal controversy when a researcher threatened to quit.

**COVID-19 adjacency:** After Epstein's death, Church co-founded RaDVaC (Rapid Deployment Vaccine Collaborative) in 2020 — a DIY nasal COVID-19 vaccine initiative. His lab also developed an mRNA vaccine platform licensed by Harvard. These projects postdate the Epstein relationship by years and are not connected to it.

## Boris Nikolic — Epstein's Will & Pandemic Preparedness Emails

Nikolic — a Harvard-trained immunologist who served as chief science and technology adviser to the Bill & Melinda Gates Foundation — was named successor executor in Epstein's will, signed two days before Epstein's death (August 2019). He said he was "shocked" and declined the role. He co-founded Biomatics Capital, a biotech venture firm investing in gene-editing companies.

**Three pandemic-preparedness documents:**
1. **2011:** Epstein advised JPMorgan's Jes Staley on a Gates-linked donor-advised fund, mentioning "additional money for vaccines" and an "offshore arm — especially for vaccines."
2. **March 2015:** An email forwarded to Epstein contained a "draft agenda for the meeting on preparing for pandemics" (DOJ Data Set 11).
3. **May 2017:** Nikolic emailed Gates and Epstein that donor-advised funds "might be a great path forward for some key areas such as Energy, pandemic, etc."

A separate bgC3 document (Bates EFTA02657725) listed "Strain pandemic simulation" among deliverables. Fact-checkers rated claims connecting this to COVID-19 planning as misleading.

## Epstein's Actual Biology Obsession: Eugenics & Transhumanism

Epstein's documented interest in biological sciences was overwhelmingly focused on genetics, eugenics, transhumanism, and longevity — not infectious disease or biodefense. He planned to "seed the human race with his DNA" by impregnating 20 women at his New Mexico ranch. He donated $20,000+ to the World Transhumanist Association. DOJ emails show him telling Noam Chomsky that "the test score gap amongst African Americans is well documented" in the context of genetic alteration. His Virgin Islands entity, Southern Trust Company, ran DNA-banking operations.

This eugenics fixation drove his relationships with Church (CRISPR), Nowak (evolutionary dynamics), and Thakuria (longevity genetics). **No credible source documents Epstein expressing interest in biological weapons, pathogen engineering, or deliberate pandemic planning.**

## What the Evidence Does NOT Show

Despite extensive searching across DOJ releases, flight logs, the Epstein black book, financial records, and credible journalism, no documented connection exists between Epstein and:
- Peter Daszak (EcoHealth Alliance)
- Ralph Baric (UNC coronavirus researcher)
- Anthony Fauci / NIAID
- Kristian Andersen (Scripps Research)
- Wuhan Institute of Virology scientists

The frequently cited Charles Lieber case (Harvard chemistry professor arrested for concealing work at Wuhan University of Technology) involves a different Wuhan institution, and Lieber received no documented Epstein funding.

## Online Discourse & Fact-Checking

Following the 2025–2026 DOJ file release, Reddit communities rapidly connected the "strain pandemic simulation" document and pandemic-preparedness emails to COVID-19 planning — claims subsequently fact-checked as misleading by CBS News, PolitiFact, Tempo, and Fact Crescendo. Whitney Webb's *One Nation Under Blackmail* covers Epstein's alleged intelligence ties with extensive sourcing but makes significant interpretive leaps beyond what mainstream outlets have verified. Children's Health Defense — sympathetic to pandemic-planning theories — reviewed the files and concluded: "There is no document in the reviewed Epstein materials that demonstrates coordination of COVID-19."

---`,
  peopleIds: [
    'nathan-wolfe', 'martin-nowak', 'george-church', 'boris-nikolic',
    'joseph-thakuria', 'joi-ito', 'seth-lloyd', 'john-brockman',
    'lawrence-krauss', 'eric-lander', 'jeffrey-epstein', 'bill-gates',
    'noam-chomsky'
  ],
  timelineEventIds: [
    '2005-church-epstein-vi-foundation-funding',
    '2008-wolfe-epstein-correspondence-begins',
    '2010-12-wolfe-dinner-party-wef-interns',
    '2013-epstein-personal-genome-project',
    '2014-nowak-spy-captured-email',
    '2016-epstein-chomsky-genetic-alteration',
    '2017-05-nikolic-pandemic-donor-advised-fund',
    '2017-bgc3-strain-pandemic-simulation',
    '2019-08-nikolic-named-epstein-will-executor',
    '2021-03-harvard-sanctions-nowak-ped-closed',
    '2023-03-nowak-sanctions-lifted',
    '2026-02-wolfe-stanford-appointment-ended',
    '2026-02-nowak-administrative-leave-again',
    '2026-02-church-tissue-samples-revealed',
    '2026-02-thakuria-cnn-genetic-testing-revealed'
  ],
  sources: [SRC, 'DOJ'],
  tags: ['science', 'pandemic', 'genetics', 'transhumanism', 'harvard', 'covid-19', 'fact-check'],
  efta: ['EFTA00961409', 'EFTA02411848', 'EFTA00748457', 'EFTA02657725', 'EFTA02408862', 'EFTA02412868', 'EFTA01614010'],
  eftaLinks: []
};

if (!findThemeById(THEME_ID)) {
  themes.push(newTheme);
  console.log(`  ADD theme: ${THEME_ID}`);
} else {
  console.log(`  SKIP (exists): ${THEME_ID}`);
}

// ============================================================
// PART 2: NEW PEOPLE
// ============================================================

console.log('\n=== PART 2: NEW PEOPLE ===\n');

const peopleToAdd = [
  makePerson({
    id: 'nathan-wolfe',
    name: 'Nathan Wolfe',
    category: 'academic-scientific',
    subcategory: 'virology',
    summary: 'Stanford virologist, pandemic preparedness expert, and author of The Viral Storm (2011). Mentioned 589 times in DOJ-released documents — the most pandemic-relevant figure in the entire Epstein archive. Founded the Global Viral Forecasting Initiative (2007) and Metabiota, a biological threat evaluation company later linked to DoD-funded Ukraine biolab monitoring. Served on DARPA\'s Defense Science Research Council and sat on the editorial board of EcoHealth.',
    sections: [
      {
        title: 'Epstein Correspondence (2008–2013)',
        content: 'DOJ emails (Bates ref: EFTA00961409) show Wolfe corresponded with Epstein from 2008 to 2013, visited his homes in New York and Florida, and proposed Epstein fund a study of undergraduate sexual behavior to test what they called the "horny virus hypothesis" — investigating microbial influences on human sexual activity.\n\nIn December 2010, Wolfe invited Epstein to a dinner party, describing attendees as including "a couple of hottie interns from WEF." In email sign-offs, Wolfe urged Epstein to "never let the bastards get you down."\n\nWolfe stated he never received Epstein funding, never visited his island, and never flew on his plane.',
        verificationStatus: 'verified',
        sources: [SRC, 'DOJ'],
        efta: ['EFTA00961409']
      },
      {
        title: 'Pandemic Credentials',
        content: 'Founded the Global Viral Forecasting Initiative (2007), later renamed Metabiota. Metabiota evaluated biological threats and was linked to DoD-funded Ukraine biolab monitoring. Served on DARPA\'s Defense Science Research Council. Sat on the editorial board of EcoHealth, the journal of EcoHealth Alliance (which funded coronavirus research at the Wuhan Institute of Virology).',
        verificationStatus: 'verified',
        sources: [SRC]
      },
      {
        title: 'Metabiota–EcoHealth Indirect Link',
        content: 'Wolfe\'s professional overlap with EcoHealth Alliance through the PREDICT pandemic surveillance program creates a network bridge — but it is a professional association, not a documented Epstein→EcoHealth connection. Claims of a direct Epstein–Peter Daszak link extrapolate through Wolfe without documentary support.',
        verificationStatus: 'contested',
        sources: [SRC]
      },
      {
        title: '2026 Consequences',
        content: 'Following revelations in the 2026 DOJ releases, the Stanford Daily reported that Wolfe planned sexual behavior research with Epstein and described interns to him. Stanford subsequently ended his visiting appointment in February 2026.',
        verificationStatus: 'verified',
        sources: [SRC]
      },
      { title: 'Source', content: 'DOJ EFTA corpus, Stanford Daily (Feb 2026), Nature (Feb 2026), Wikipedia\n\n---', sources: [SRC, 'DOJ'] }
    ],
    timelineEventIds: [
      '2008-wolfe-epstein-correspondence-begins',
      '2010-12-wolfe-dinner-party-wef-interns',
      '2026-02-wolfe-stanford-appointment-ended'
    ],
    connectionIds: ['epstein-wolfe-science', 'wolfe-nowak-science-network', 'wolfe-church-science-network'],
    sources: [SRC, 'DOJ']
  }),

  makePerson({
    id: 'joseph-thakuria',
    name: 'Joseph Thakuria',
    category: 'academic-scientific',
    subcategory: 'genetics',
    summary: 'Harvard geneticist who performed novel genetic testing for Epstein and proposed CRISPR gene-editing of Epstein\'s stem cells "to introduce mutations believed to increase longevity." Invoices totaled $160,000+ for something called "The Venus Project."',
    sections: [
      {
        title: 'Genetic Testing & Venus Project',
        content: 'CNN reported in February 2026 that Epstein paid Harvard geneticist Joseph Thakuria for novel genetic testing and proposed CRISPR gene-editing of his own stem cells "to introduce mutations believed to increase longevity." Invoices totaled $160,000+ for something called "The Venus Project."',
        verificationStatus: 'verified',
        sources: [SRC, 'CNN']
      },
      { title: 'Source', content: 'CNN (Feb 6, 2026) — Epstein genetic testing report\n\n---', sources: [SRC, 'CNN'] }
    ],
    timelineEventIds: ['2026-02-thakuria-cnn-genetic-testing-revealed'],
    connectionIds: ['epstein-thakuria-genetic-testing'],
    sources: [SRC, 'CNN']
  }),

  makePerson({
    id: 'seth-lloyd',
    name: 'Seth Lloyd',
    category: 'academic-scientific',
    subcategory: 'quantum-computing',
    summary: 'MIT professor of quantum-mechanical engineering. Received funding included in MIT\'s total Epstein donations. Listed among scientists attending Edge Foundation events organized by John Brockman.',
    sections: [
      {
        title: 'Epstein Funding',
        content: 'Seth Lloyd received Epstein-related funding as part of MIT\'s total donations. He was listed among scientists attending Edge Foundation science dinners organized by John Brockman, which Epstein funded with $638K. The MIT Fact-Finding Report (January 2020) detailed the scope of Epstein\'s donations to MIT.',
        verificationStatus: 'verified',
        sources: [SRC, 'DOJ']
      },
      { title: 'Source', content: 'MIT Fact-Finding Report (2020), BuzzFeed News investigation\n\n---', sources: [SRC] }
    ],
    timelineEventIds: [],
    connectionIds: ['epstein-lloyd-funding'],
    sources: [SRC]
  }),

  makePerson({
    id: 'lawrence-krauss',
    name: 'Lawrence Krauss',
    category: 'academic-scientific',
    subcategory: 'physics',
    summary: 'Theoretical physicist and former director of the ASU Origins Project. Received $250K+ from Epstein. DOJ documents (Bates EFTA01614010) show Krauss sought Epstein\'s advice when facing his own misconduct allegations.',
    sections: [
      {
        title: 'Epstein Funding & Relationship',
        content: 'Lawrence Krauss received $250K+ from Epstein for the ASU Origins Project. DOJ emails (Bates ref: EFTA01614010) reveal Krauss sought Epstein\'s advice when facing his own misconduct allegations. He was a frequent attendee at Edge Foundation science events organized by John Brockman.',
        verificationStatus: 'verified',
        sources: [SRC, 'DOJ'],
        efta: ['EFTA01614010']
      },
      { title: 'Source', content: 'DOJ EFTA corpus, BuzzFeed News investigation\n\n---', sources: [SRC, 'DOJ'] }
    ],
    timelineEventIds: [],
    connectionIds: ['epstein-krauss-funding'],
    sources: [SRC, 'DOJ']
  }),

  makePerson({
    id: 'eric-lander',
    name: 'Eric Lander',
    category: 'academic-scientific',
    subcategory: 'genomics',
    summary: 'Broad Institute co-founder and former Biden science adviser (OSTP director). Met Epstein twice in 2012; his confirmation as science adviser was delayed due to the meetings. Later resigned from OSTP for unrelated bullying conduct. His pandemic preparedness work postdated and was unrelated to Epstein contact.',
    sections: [
      {
        title: 'Epstein Meetings',
        content: 'Eric Lander met Epstein twice in 2012. His confirmation as Biden\'s science adviser was delayed due to these meetings. He later resigned from the OSTP for unrelated bullying conduct. His pandemic preparedness work as OSTP director postdated and was unrelated to Epstein contact.',
        verificationStatus: 'verified',
        sources: [SRC]
      },
      { title: 'Source', content: 'BuzzFeed News, Science magazine\n\n---', sources: [SRC] }
    ],
    timelineEventIds: ['2012-lander-meets-epstein'],
    connectionIds: ['epstein-lander-meetings'],
    sources: [SRC]
  })
];

peopleToAdd.forEach(p => { if (addPerson(p)) addedPeople++; });

// ============================================================
// PART 3: ENRICH EXISTING PEOPLE
// ============================================================

console.log('\n=== PART 3: ENRICH EXISTING PEOPLE ===\n');

// Martin Nowak
if (enrichPersonSections('martin-nowak', [
  {
    title: 'Virus Dynamics & COVID Relevance',
    content: 'Nowak is the author of *Virus Dynamics: Mathematical Principles of Immunology and Virology* (2000) — a foundational text that established core concepts including the basic reproductive ratio (R₀) now ubiquitous in COVID-19 epidemiology. His name appears over 4,000 times in DOJ documents, making him one of the most referenced scientists in the Epstein corpus.',
    verificationStatus: 'verified',
    sources: [SRC, 'DOJ']
  },
  {
    title: 'Epstein Office & PED Access',
    content: 'Epstein maintained a personal office ("Jeffrey\'s Office," Room 610) in the Program for Evolutionary Dynamics building with an unrestricted keycard. He visited PED over 40 times between 2010–2018, holding meetings with scientists including George Church and Noam Chomsky. He reviewed Nowak\'s *Nature* paper page proofs before publication and suggested research topics including "commercial evolution" and "prelife."',
    verificationStatus: 'verified',
    sources: [SRC, 'DOJ']
  },
  {
    title: '"Spy" Email (2014)',
    content: 'A 2014 email (Bates EFTA00748457): Nowak wrote "our spy was captured after completing her mission"; Epstein replied "did you torture her." The context of the exchange remains unclear.',
    verificationStatus: 'verified',
    sources: [SRC, 'DOJ'],
    efta: ['EFTA00748457']
  },
  {
    title: 'Sanctions Timeline',
    content: 'Harvard shuttered the Program for Evolutionary Dynamics in 2021 and sanctioned Nowak. Sanctions were lifted in March 2023. In February 2026, following new revelations in the DOJ file dumps, Nowak was placed on administrative leave again.',
    verificationStatus: 'verified',
    sources: [SRC]
  }
])) enrichedPeople++;
addPersonTheme('martin-nowak', THEME_ID);

// George Church
if (enrichPersonSections('george-church', [
  {
    title: 'Epstein VI Foundation Funding',
    content: 'Church received $686,000 directly from the Jeffrey Epstein VI Foundation (2005–2007) plus approximately $2 million through donors Epstein brokered.',
    verificationStatus: 'verified',
    sources: [SRC, 'DOJ']
  },
  {
    title: 'Personal Genome Project & Tissue Samples',
    content: 'In 2013, Epstein enrolled in Church\'s Personal Genome Project, causing an internal furor when a staff member attempted to fast-track sequencing his biological sample. The Boston Globe reported in February 2026 that a researcher threatened to quit after discovering Epstein\'s identity. STAT News covered the same story.',
    verificationStatus: 'verified',
    sources: [SRC]
  },
  {
    title: 'COVID-19 Adjacency (Post-Epstein)',
    content: 'After Epstein\'s death, Church co-founded RaDVaC (Rapid Deployment Vaccine Collaborative) in 2020 — a DIY nasal COVID-19 vaccine initiative. His lab also developed an mRNA vaccine platform now licensed by Harvard\'s Office of Technology Development. These projects postdate the Epstein relationship by years and are not connected to it.',
    verificationStatus: 'verified',
    sources: [SRC]
  }
])) enrichedPeople++;
addPersonTheme('george-church', THEME_ID);

// Boris Nikolic
if (enrichPersonSections('boris-nikolic', [
  {
    title: "Epstein's Will — Successor Executor",
    content: 'Nikolic was named successor executor in Epstein\'s will, signed just two days before Epstein\'s death in August 2019. Bloomberg broke the story; Nikolic said he was "shocked" and declined the role.',
    verificationStatus: 'verified',
    sources: [SRC, 'Bloomberg']
  },
  {
    title: 'Biomatics Capital & Gene-Editing Investments',
    content: 'Nikolic co-founded Biomatics Capital, a biotech venture firm that invested in gene-editing companies including eGenesis (co-founded by George Church) and Editas Medicine.',
    verificationStatus: 'verified',
    sources: [SRC]
  },
  {
    title: 'Pandemic Preparedness Emails',
    content: 'In May 2017, Nikolic wrote in an email to Gates and Epstein that donor-advised funds "might be a great path forward for some key areas such as Energy, pandemic, etc." — three years before COVID-19. A separate bgC3 document (Bates EFTA02657725) listed "Strain pandemic simulation" among deliverables. Fact-checkers rated COVID-19 planning claims as misleading.',
    verificationStatus: 'contested',
    sources: [SRC, 'DOJ'],
    efta: ['EFTA02657725']
  }
])) enrichedPeople++;
addPersonTheme('boris-nikolic', THEME_ID);

// Joi Ito
if (enrichPersonSections('joi-ito', [
  {
    title: 'MIT Media Lab — Epstein Funding',
    content: 'Joi Ito, as director of the MIT Media Lab, received approximately $850K total from Epstein. The MIT Fact-Finding Report (January 2020) detailed how these donations were structured. Ito resigned in September 2019 after The New Yorker revealed the extent of Epstein\'s involvement with the Media Lab.',
    verificationStatus: 'verified',
    sources: [SRC]
  }
])) enrichedPeople++;
addPersonTheme('joi-ito', THEME_ID);

// John Brockman
if (enrichPersonSections('john-brockman', [
  {
    title: 'Edge Foundation & Science Dinners',
    content: 'Epstein funded John Brockman\'s Edge Foundation with $638K, gaining access to science dinners attended by Steven Pinker, Richard Dawkins, Daniel Dennett, Seth Lloyd, Lisa Randall, and tech billionaires including Jeff Bezos. Edge events were populated by physicists, cognitive scientists, and AI researchers — not virologists or epidemiologists.',
    verificationStatus: 'verified',
    sources: [SRC]
  }
])) enrichedPeople++;
addPersonTheme('john-brockman', THEME_ID);

// ============================================================
// PART 4: TIMELINE EVENTS
// ============================================================

console.log('\n=== PART 4: TIMELINE EVENTS ===\n');

const eventsToAdd = [
  makeTimelineEvent({
    id: '2005-church-epstein-vi-foundation-funding',
    date: '2005',
    dateDisplay: '2005–2007',
    era: '2001-2007',
    title: 'George Church Receives $686K from Epstein VI Foundation',
    body: 'George Church receives $686,000 directly from the Jeffrey Epstein VI Foundation between 2005 and 2007, plus approximately $2 million through donors Epstein brokered. Church is a Harvard geneticist, synthetic biology pioneer, and a founder of the field of genomics.',
    summary: 'George Church receives $686K directly from the Jeffrey Epstein VI Foundation (2005–2007), plus ~$2M through brokered donors.',
    peopleIds: ['george-church', 'jeffrey-epstein'],
    tags: ['funding', 'genetics', 'harvard'],
    relatedEventIds: ['1998-harvard-donations-91-million-total', '2014-07-georgarage-llc-initiated-by-epstein-and-', '2013-epstein-personal-genome-project']
  }),

  makeTimelineEvent({
    id: '2008-wolfe-epstein-correspondence-begins',
    date: '2008',
    dateDisplay: '2008–2013',
    era: '2008-2018',
    title: 'Nathan Wolfe Begins Correspondence with Epstein',
    body: 'DOJ emails (Bates ref: EFTA00961409) reveal Nathan Wolfe corresponded with Epstein from 2008 to 2013. Wolfe visited Epstein\'s homes in New York and Florida and proposed Epstein fund a study of undergraduate sexual behavior to test the "horny virus hypothesis" — investigating microbial influences on human sexual activity. In email sign-offs, Wolfe urged Epstein to "never let the bastards get you down." Wolfe stated he never received Epstein funding, never visited his island, and never flew on his plane.',
    summary: 'DOJ emails show virologist Nathan Wolfe corresponded with Epstein 2008–2013, proposing the "horny virus hypothesis" study and visiting his homes.',
    peopleIds: ['nathan-wolfe', 'jeffrey-epstein'],
    tags: ['science', 'virology', 'correspondence'],
    sources: [SRC, 'DOJ'],
    eftaLinks: [{ number: 'EFTA00961409', url: 'https://www.justice.gov/epstein/doj-disclosures', description: 'Wolfe "horny virus hypothesis" funding proposal' }],
    relatedEventIds: ['2010-12-wolfe-dinner-party-wef-interns', '2026-02-wolfe-stanford-appointment-ended']
  }),

  makeTimelineEvent({
    id: '2010-12-wolfe-dinner-party-wef-interns',
    date: '2010-12',
    dateDisplay: 'December 2010',
    era: '2008-2018',
    title: 'Wolfe Invites Epstein to Dinner with "Hottie Interns from WEF"',
    body: 'In December 2010, Nathan Wolfe invited Epstein to a dinner party, describing attendees as including "a couple of hottie interns from WEF" (World Economic Forum). This email was among DOJ-released correspondence revealing the social dimension of Wolfe\'s relationship with Epstein.',
    summary: 'Wolfe invites Epstein to a December 2010 dinner, describing attendees as including "a couple of hottie interns from WEF."',
    peopleIds: ['nathan-wolfe', 'jeffrey-epstein'],
    tags: ['science', 'social', 'wef'],
    relatedEventIds: ['2008-wolfe-epstein-correspondence-begins']
  }),

  makeTimelineEvent({
    id: '2012-lander-meets-epstein',
    date: '2012',
    dateDisplay: '2012',
    era: '2008-2018',
    title: 'Eric Lander Meets Epstein Twice',
    body: 'Broad Institute co-founder Eric Lander meets Jeffrey Epstein twice in 2012. These meetings would later delay his confirmation as Biden\'s science adviser (OSTP director). Lander subsequently resigned from the OSTP for unrelated bullying conduct. His pandemic preparedness work as OSTP director postdated and was unrelated to Epstein contact.',
    summary: 'Broad Institute co-founder Eric Lander meets Epstein twice in 2012, later delaying his confirmation as Biden science adviser.',
    peopleIds: ['eric-lander', 'jeffrey-epstein'],
    tags: ['science', 'genomics', 'meetings'],
    relatedEventIds: []
  }),

  makeTimelineEvent({
    id: '2013-epstein-personal-genome-project',
    date: '2013',
    dateDisplay: '2013',
    era: '2008-2018',
    title: 'Epstein Enrolls in Church\'s Personal Genome Project',
    body: 'Jeffrey Epstein enrolls in George Church\'s Personal Genome Project at Harvard, causing internal controversy when a staff member attempts to fast-track sequencing his biological sample. A researcher threatened to quit after discovering Epstein\'s identity. The incident highlighted the tension between Epstein\'s scientific access and institutional ethics.',
    summary: 'Epstein enrolls in George Church\'s Personal Genome Project at Harvard, causing internal controversy when staff discover his identity.',
    peopleIds: ['jeffrey-epstein', 'george-church'],
    tags: ['genetics', 'harvard', 'ethics'],
    relatedEventIds: ['2005-church-epstein-vi-foundation-funding', '2026-02-church-tissue-samples-revealed']
  }),

  makeTimelineEvent({
    id: '2014-nowak-spy-captured-email',
    date: '2014',
    dateDisplay: '2014',
    era: '2008-2018',
    title: 'Nowak–Epstein "Spy Captured" Email Exchange',
    body: 'A 2014 email (Bates EFTA00748457) reveals a disturbing exchange: Martin Nowak wrote to Epstein "our spy was captured after completing her mission"; Epstein replied "did you torture her." The context of the exchange remains unclear but was among documents released by DOJ under the EFTA.',
    summary: 'DOJ email (Bates EFTA00748457): Nowak writes "our spy was captured after completing her mission"; Epstein replies "did you torture her."',
    peopleIds: ['martin-nowak', 'jeffrey-epstein'],
    tags: ['correspondence', 'harvard'],
    sources: [SRC, 'DOJ'],
    eftaLinks: [{ number: 'EFTA00748457', url: 'https://www.justice.gov/epstein/doj-disclosures', description: 'Nowak–Epstein correspondence' }],
    relatedEventIds: ['2003-harvard-program-for-evolutionary-dynamic']
  }),

  makeTimelineEvent({
    id: '2016-epstein-chomsky-genetic-alteration',
    date: '2016',
    dateDisplay: '2016',
    era: '2008-2018',
    title: 'Epstein Emails Chomsky About Genetic Alteration & Race',
    body: 'DOJ emails from 2016 show Epstein telling Noam Chomsky that "the test score gap amongst African Americans is well documented" in the context of discussing genetic alteration. Emails with MIT\'s Joscha Bach revealed Epstein\'s interest in genetically modifying groups to make them "smarter." These exchanges illustrate Epstein\'s eugenics fixation.',
    summary: 'Epstein emails Chomsky about racial "test score gaps" in the context of genetic alteration; emails with Joscha Bach reveal eugenics interest.',
    peopleIds: ['jeffrey-epstein', 'noam-chomsky'],
    tags: ['eugenics', 'genetics', 'correspondence'],
    relatedEventIds: []
  }),

  makeTimelineEvent({
    id: '2017-05-nikolic-pandemic-donor-advised-fund',
    date: '2017-05',
    dateDisplay: 'May 2017',
    era: '2008-2018',
    title: 'Nikolic Emails Gates & Epstein About Pandemic Donor-Advised Fund',
    body: 'Boris Nikolic writes in an email to Bill Gates and Jeffrey Epstein that donor-advised funds "might be a great path forward for some key areas such as Energy, pandemic, etc." — three years before the COVID-19 pandemic. This email was released in DOJ data sets and became a focal point for online speculation about pandemic planning.',
    summary: 'Boris Nikolic emails Gates and Epstein that donor-advised funds could be "a great path forward" for "pandemic" and energy.',
    peopleIds: ['boris-nikolic', 'bill-gates', 'jeffrey-epstein'],
    tags: ['pandemic', 'funding', 'vaccines'],
    verificationStatus: 'verified',
    relatedEventIds: ['2015-03-19-ipi-preparing-for-pandemics-email-sent-t', '2017-bgc3-strain-pandemic-simulation']
  }),

  makeTimelineEvent({
    id: '2017-bgc3-strain-pandemic-simulation',
    date: '2017',
    dateDisplay: '2017',
    era: '2008-2018',
    title: 'bgC3 Document Lists "Strain Pandemic Simulation" Among Deliverables',
    body: 'A document (Bates EFTA02657725) from bgC3, Bill Gates\' private office, lists "Strain pandemic simulation" among deliverables. Fact-checkers (Tempo, Fact Crescendo) rated claims connecting this to COVID-19 planning as misleading. Gates called the claim "false" in February 2026. Children\'s Health Defense reviewed the files and concluded there is no evidence of coordinated COVID-19 planning.',
    summary: 'A bgC3 (Gates private office) document lists "Strain pandemic simulation" among deliverables; fact-checkers rate COVID-19 planning claims as misleading.',
    peopleIds: ['bill-gates', 'jeffrey-epstein'],
    tags: ['pandemic', 'fact-check', 'bgc3'],
    sources: [SRC, 'DOJ'],
    verificationStatus: 'contested',
    eftaLinks: [{ number: 'EFTA02657725', url: 'https://www.justice.gov/epstein/doj-disclosures', description: 'bgC3 deliverables document' }],
    relatedEventIds: ['2017-05-nikolic-pandemic-donor-advised-fund', '2015-03-19-ipi-preparing-for-pandemics-email-sent-t'],
    discrepancies: [{
      sourceA: 'Substack / conspiracy media',
      sourceB: 'Tempo / Fact Crescendo / Gates statement',
      claimA: 'bgC3 document proves Gates and Epstein planned COVID-19 pandemic',
      claimB: 'Document references routine pandemic preparedness simulation, not operational COVID-19 planning; rated misleading'
    }]
  }),

  makeTimelineEvent({
    id: '2019-08-nikolic-named-epstein-will-executor',
    date: '2019-08-08',
    dateDisplay: 'August 8, 2019',
    era: '2019',
    title: 'Boris Nikolic Named Successor Executor in Epstein\'s Will',
    body: 'Boris Nikolic — Harvard-trained immunologist and former chief science/technology adviser to the Bill & Melinda Gates Foundation — is named successor executor in Jeffrey Epstein\'s will, signed just two days before Epstein\'s death on August 10, 2019. Bloomberg breaks the story; Nikolic says he was "shocked" and declines the role.',
    summary: 'Boris Nikolic named successor executor in Epstein\'s will two days before his death; Nikolic says he was "shocked" and declines.',
    peopleIds: ['boris-nikolic', 'jeffrey-epstein'],
    tags: ['will', 'executor', 'gates-foundation'],
    sources: [SRC, 'Bloomberg'],
    relatedEventIds: []
  }),

  makeTimelineEvent({
    id: '2021-03-harvard-sanctions-nowak-ped-closed',
    date: '2021-03',
    dateDisplay: 'March 2021',
    era: '2020-present',
    title: 'Harvard Sanctions Martin Nowak; PED Shuttered',
    body: 'Harvard sanctions Martin Nowak for his involvement with Jeffrey Epstein and shutters the Program for Evolutionary Dynamics (PED) — the $6.5 million institute Epstein funded in 2003. Nowak had given Epstein unrestricted keycard access and an office in the PED building, with over 40 visits between 2010–2018.',
    summary: 'Harvard sanctions Martin Nowak and closes the Program for Evolutionary Dynamics, the $6.5M Epstein-funded institute.',
    peopleIds: ['martin-nowak'],
    tags: ['harvard', 'sanctions', 'consequences'],
    relatedEventIds: ['2003-harvard-program-for-evolutionary-dynamic', '2023-03-nowak-sanctions-lifted', '2026-02-nowak-administrative-leave-again']
  }),

  makeTimelineEvent({
    id: '2023-03-nowak-sanctions-lifted',
    date: '2023-03',
    dateDisplay: 'March 2023',
    era: '2020-present',
    title: 'Harvard Lifts Nowak Sanctions',
    body: 'Harvard lifts the sanctions imposed on Martin Nowak in 2021. The Harvard Crimson reports the decision in May 2023. Nowak is restored to his position, though the Program for Evolutionary Dynamics remains closed.',
    summary: 'Harvard lifts Martin Nowak\'s Epstein-related sanctions, though PED remains closed.',
    peopleIds: ['martin-nowak'],
    tags: ['harvard', 'sanctions'],
    relatedEventIds: ['2021-03-harvard-sanctions-nowak-ped-closed', '2026-02-nowak-administrative-leave-again']
  }),

  makeTimelineEvent({
    id: '2026-02-wolfe-stanford-appointment-ended',
    date: '2026-02-16',
    dateDisplay: 'February 16, 2026',
    era: '2020-present',
    title: 'Stanford Ends Nathan Wolfe\'s Visiting Appointment',
    body: 'Following revelations in the 2026 DOJ file releases, Stanford University ends Nathan Wolfe\'s visiting appointment. The Stanford Daily reports that Wolfe planned sexual behavior research with Epstein and described interns to him. Wolfe is the most pandemic-relevant figure in the Epstein archive with 589 DOJ mentions.',
    summary: 'Stanford ends virologist Nathan Wolfe\'s visiting appointment after DOJ releases reveal his relationship with Epstein.',
    peopleIds: ['nathan-wolfe'],
    tags: ['consequences', 'stanford', 'virology'],
    relatedEventIds: ['2008-wolfe-epstein-correspondence-begins', '2010-12-wolfe-dinner-party-wef-interns']
  }),

  makeTimelineEvent({
    id: '2026-02-nowak-administrative-leave-again',
    date: '2026-02',
    dateDisplay: 'February 2026',
    era: '2020-present',
    title: 'Harvard Places Nowak on Administrative Leave Again',
    body: 'Following new revelations in the DOJ file dumps, Harvard places Martin Nowak on administrative leave again. Harvard Magazine reports the development. This follows the lifting of his 2021 sanctions in March 2023.',
    summary: 'Harvard places Martin Nowak on administrative leave again following new DOJ file revelations, after lifting 2021 sanctions in 2023.',
    peopleIds: ['martin-nowak'],
    tags: ['consequences', 'harvard'],
    relatedEventIds: ['2021-03-harvard-sanctions-nowak-ped-closed', '2023-03-nowak-sanctions-lifted']
  }),

  makeTimelineEvent({
    id: '2026-02-church-tissue-samples-revealed',
    date: '2026-02-24',
    dateDisplay: 'February 24, 2026',
    era: '2020-present',
    title: 'Boston Globe Reveals Epstein Tissue Samples in Church\'s Lab',
    body: 'The Boston Globe reports that Epstein\'s biological samples from the Personal Genome Project remain in George Church\'s Harvard lab. STAT News covers the same story. A researcher had threatened to quit in 2013 after discovering Epstein\'s identity among the enrolled participants.',
    summary: 'Boston Globe and STAT News reveal Epstein\'s tissue samples from Church\'s Personal Genome Project remain at Harvard.',
    peopleIds: ['george-church', 'jeffrey-epstein'],
    tags: ['harvard', 'genetics', 'journalism'],
    relatedEventIds: ['2013-epstein-personal-genome-project', '2005-church-epstein-vi-foundation-funding']
  }),

  makeTimelineEvent({
    id: '2026-02-thakuria-cnn-genetic-testing-revealed',
    date: '2026-02-06',
    dateDisplay: 'February 6, 2026',
    era: '2020-present',
    title: 'CNN Reveals Epstein\'s $160K "Venus Project" Genetic Testing',
    body: 'CNN reports that Epstein paid Harvard geneticist Joseph Thakuria for novel genetic testing and proposed CRISPR gene-editing of his own stem cells "to introduce mutations believed to increase longevity." Invoices totaled $160,000+ for something called "The Venus Project." This confirms Epstein\'s eugenics and transhumanism fixation was operationalized through specific medical procedures.',
    summary: 'CNN reveals Epstein paid Harvard geneticist Joseph Thakuria $160K+ for genetic testing and proposed CRISPR longevity editing ("The Venus Project").',
    peopleIds: ['joseph-thakuria', 'jeffrey-epstein'],
    tags: ['genetics', 'transhumanism', 'eugenics', 'journalism'],
    sources: [SRC, 'CNN'],
    relatedEventIds: ['2013-epstein-personal-genome-project']
  })
];

eventsToAdd.forEach(e => { if (addTimelineEvent(e)) addedEvents++; });

// Add new event IDs to existing people
addPersonEvent('martin-nowak', '2014-nowak-spy-captured-email');
addPersonEvent('martin-nowak', '2021-03-harvard-sanctions-nowak-ped-closed');
addPersonEvent('martin-nowak', '2023-03-nowak-sanctions-lifted');
addPersonEvent('martin-nowak', '2026-02-nowak-administrative-leave-again');
addPersonEvent('george-church', '2005-church-epstein-vi-foundation-funding');
addPersonEvent('george-church', '2013-epstein-personal-genome-project');
addPersonEvent('george-church', '2026-02-church-tissue-samples-revealed');
addPersonEvent('boris-nikolic', '2017-05-nikolic-pandemic-donor-advised-fund');
addPersonEvent('boris-nikolic', '2019-08-nikolic-named-epstein-will-executor');
addPersonEvent('bill-gates', '2017-05-nikolic-pandemic-donor-advised-fund');
addPersonEvent('bill-gates', '2017-bgc3-strain-pandemic-simulation');
addPersonEvent('jeffrey-epstein', '2008-wolfe-epstein-correspondence-begins');
addPersonEvent('jeffrey-epstein', '2013-epstein-personal-genome-project');

// ============================================================
// PART 5: CONNECTIONS
// ============================================================

console.log('\n=== PART 5: CONNECTIONS ===\n');

const connectionsToAdd = [
  makeConnection({
    id: 'epstein-wolfe-science',
    source: 'jeffrey-epstein',
    target: 'nathan-wolfe',
    type: 'social',
    strength: 3,
    description: 'Wolfe corresponded with Epstein 2008–2013, visited his homes in New York and Florida, proposed the "horny virus hypothesis" study, and invited Epstein to a dinner with "hottie interns from WEF." 589 DOJ mentions. Wolfe denies receiving funding or visiting the island.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'epstein-thakuria-genetic-testing',
    source: 'jeffrey-epstein',
    target: 'joseph-thakuria',
    type: 'financial',
    strength: 2,
    description: 'Epstein paid Thakuria $160K+ for novel genetic testing and proposed CRISPR gene-editing of his stem cells for longevity ("The Venus Project").',
    verification: 'verified'
  }),
  makeConnection({
    id: 'epstein-lloyd-funding',
    source: 'jeffrey-epstein',
    target: 'seth-lloyd',
    type: 'financial',
    strength: 2,
    description: 'Seth Lloyd received Epstein-related funding as part of MIT\'s total donations. Attended Edge Foundation science dinners funded by Epstein.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'epstein-krauss-funding',
    source: 'jeffrey-epstein',
    target: 'lawrence-krauss',
    type: 'financial',
    strength: 2,
    description: 'Krauss received $250K+ from Epstein for ASU Origins Project. DOJ emails (EFTA01614010) show Krauss sought Epstein\'s advice when facing his own misconduct allegations.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'epstein-lander-meetings',
    source: 'jeffrey-epstein',
    target: 'eric-lander',
    type: 'social',
    strength: 1,
    description: 'Eric Lander met Epstein twice in 2012. The meetings later delayed his confirmation as Biden\'s science adviser.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'wolfe-nowak-science-network',
    source: 'nathan-wolfe',
    target: 'martin-nowak',
    type: 'academic',
    strength: 1,
    description: 'Both in Epstein\'s documented science orbit — Wolfe (virology/pandemic preparedness) and Nowak (virus dynamics/R₀). No direct collaboration documented.',
    verification: 'unverified'
  }),
  makeConnection({
    id: 'wolfe-church-science-network',
    source: 'nathan-wolfe',
    target: 'george-church',
    type: 'academic',
    strength: 1,
    description: 'Both in Epstein\'s documented science orbit — Wolfe (virology) and Church (synthetic biology/genetics). Both at Stanford/Harvard respectively.',
    verification: 'unverified'
  }),
  makeConnection({
    id: 'nikolic-church-biomatics',
    source: 'boris-nikolic',
    target: 'george-church',
    type: 'financial',
    strength: 2,
    description: 'Nikolic\'s Biomatics Capital invested in eGenesis, a gene-editing company co-founded by George Church.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'nowak-church-ped-meetings',
    source: 'martin-nowak',
    target: 'george-church',
    type: 'academic',
    strength: 2,
    description: 'Church attended meetings at Nowak\'s Program for Evolutionary Dynamics at Harvard, where Epstein maintained an office (Room 610).',
    verification: 'verified'
  }),
  makeConnection({
    id: 'brockman-church-edge',
    source: 'john-brockman',
    target: 'george-church',
    type: 'social',
    strength: 1,
    description: 'Church attended Edge Foundation science dinners organized by Brockman and funded by Epstein ($638K).',
    verification: 'verified'
  }),
  makeConnection({
    id: 'brockman-lloyd-edge',
    source: 'john-brockman',
    target: 'seth-lloyd',
    type: 'social',
    strength: 1,
    description: 'Lloyd attended Edge Foundation science dinners organized by Brockman and funded by Epstein.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'church-thakuria-harvard-genetics',
    source: 'george-church',
    target: 'joseph-thakuria',
    type: 'academic',
    strength: 1,
    description: 'Both Harvard geneticists in Epstein\'s orbit — Church (CRISPR/synthetic biology) and Thakuria (longevity genetics/Venus Project).',
    verification: 'unverified'
  })
];

connectionsToAdd.forEach(c => { if (addConnection(c)) addedConnections++; });

// Wire new connection IDs to existing people
addPersonConnection('jeffrey-epstein', 'epstein-wolfe-science');
addPersonConnection('jeffrey-epstein', 'epstein-thakuria-genetic-testing');
addPersonConnection('jeffrey-epstein', 'epstein-lloyd-funding');
addPersonConnection('jeffrey-epstein', 'epstein-krauss-funding');
addPersonConnection('jeffrey-epstein', 'epstein-lander-meetings');
addPersonConnection('martin-nowak', 'wolfe-nowak-science-network');
addPersonConnection('martin-nowak', 'nowak-church-ped-meetings');
addPersonConnection('george-church', 'wolfe-church-science-network');
addPersonConnection('george-church', 'nikolic-church-biomatics');
addPersonConnection('george-church', 'nowak-church-ped-meetings');
addPersonConnection('george-church', 'brockman-church-edge');
addPersonConnection('george-church', 'church-thakuria-harvard-genetics');
addPersonConnection('boris-nikolic', 'nikolic-church-biomatics');
addPersonConnection('john-brockman', 'brockman-church-edge');
addPersonConnection('john-brockman', 'brockman-lloyd-edge');
addPersonConnection('seth-lloyd', 'epstein-lloyd-funding');
addPersonConnection('seth-lloyd', 'brockman-lloyd-edge');

// ============================================================
// PART 6: ENRICH EXISTING THEMES
// ============================================================

console.log('\n=== PART 6: ENRICH EXISTING THEMES ===\n');

// Enrich the existing academic-scientific-network theme
if (enrichThemeContent(
  'academic-scientific-network',
  `The 2026 DOJ releases revealed deeper pandemic-adjacent expertise in Epstein's science network than previously known. Nathan Wolfe — Stanford virologist, Metabiota founder, and the most pandemic-relevant figure in the Epstein archive (589 DOJ mentions) — corresponded with Epstein 2008–2013 and proposed the "horny virus hypothesis" study. Martin Nowak authored *Virus Dynamics* establishing the R₀ concept now central to COVID-19 epidemiology. George Church's post-Epstein RaDVaC COVID vaccine initiative and mRNA platform development postdate the relationship.

Boris Nikolic's May 2017 email mentioning "pandemic" as a key area for donor-advised funds, and a bgC3 document listing "Strain pandemic simulation," became focal points for online speculation — but fact-checkers rated COVID-19 planning claims as misleading. Children's Health Defense concluded: "There is no document in the reviewed Epstein materials that demonstrates coordination of COVID-19."

**Key Bates references:** EFTA00961409 (Wolfe correspondence), EFTA00748457 (Nowak "spy" email), EFTA02657725 (bgC3 pandemic simulation), EFTA02411848 (scientist list), EFTA01614010 (Krauss misconduct advice).`,
  'Pandemic-Adjacent Expertise & COVID-19 Fact-Checking'
)) enrichedThemes++;

// Add new people to academic-scientific-network theme
const acadTheme = findThemeById('academic-scientific-network');
if (acadTheme) {
  ['nathan-wolfe', 'joseph-thakuria', 'seth-lloyd', 'lawrence-krauss', 'eric-lander'].forEach(id => {
    if (!acadTheme.peopleIds.includes(id)) acadTheme.peopleIds.push(id);
  });
  newTheme.timelineEventIds.forEach(id => {
    if (!acadTheme.timelineEventIds.includes(id)) acadTheme.timelineEventIds.push(id);
  });
}

// Enrich intelligence-connections
if (enrichThemeContent(
  'intelligence-connections',
  `Boris Nikolic served as chief science and technology adviser to the Bill & Melinda Gates Foundation before being named successor executor in Epstein's will two days before his death. Nikolic's Biomatics Capital invested in gene-editing companies co-founded by Epstein-linked scientists. Nathan Wolfe served on DARPA's Defense Science Research Council and founded Metabiota, a biological threat evaluation company linked to DoD-funded Ukraine biolab monitoring.`,
  'Science Network Intelligence Adjacency'
)) enrichedThemes++;

// ============================================================
// PART 7: WRITE FILES
// ============================================================

console.log('\n=== PART 7: WRITING FILES ===\n');

fs.writeFileSync(path.join(DATA, 'people.json'), JSON.stringify(people, null, 2));
fs.writeFileSync(path.join(DATA, 'timeline.json'), JSON.stringify(timeline, null, 2));
fs.writeFileSync(path.join(DATA, 'connections.json'), JSON.stringify(connections, null, 2));
fs.writeFileSync(path.join(DATA, 'themes.json'), JSON.stringify(themes, null, 2));

console.log(`\n=== SUMMARY ===`);
console.log(`  People added:     ${addedPeople}`);
console.log(`  People enriched:  ${enrichedPeople}`);
console.log(`  Events added:     ${addedEvents}`);
console.log(`  Connections added: ${addedConnections}`);
console.log(`  Themes enriched:  ${enrichedThemes}`);
console.log(`  DONE.\n`);
