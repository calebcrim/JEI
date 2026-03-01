#!/usr/bin/env node
/**
 * "Whoops" Emails Deep Research Integration Script
 * Integrates comprehensive research findings on the 33 documented "whoops"
 * emails from the EFTA releases into site JSON: themes, people, timeline, connections.
 * Fully idempotent — safe to re-run.
 *
 * Source: Deep research report on EFTA "whoops" email pattern (Theme 11)
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const timeline = JSON.parse(fs.readFileSync(path.join(DATA, 'timeline.json'), 'utf8'));
const people = JSON.parse(fs.readFileSync(path.join(DATA, 'people.json'), 'utf8'));
const connections = JSON.parse(fs.readFileSync(path.join(DATA, 'connections.json'), 'utf8'));
const themes = JSON.parse(fs.readFileSync(path.join(DATA, 'themes.json'), 'utf8'));

const SRC = 'DOJ';
const OSINT = 'OSINT';
const THEME_ID = 'whoops-emails';

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
    category: opts.category || 'other',
    subcategory: opts.subcategory || undefined,
    summary: opts.summary,
    sections: opts.sections || [
      { title: 'Role', content: opts.roleText || opts.summary, sources: opts.sources || [SRC] },
      { title: 'Source', content: 'EFTA corpus "whoops" email research — DOJ releases, credible journalism, OSINT\n\n---', sources: [SRC] }
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
    relationshipType: opts.type || 'associate',
    strength: opts.strength || 2,
    description: opts.description,
    sources: opts.sources || [SRC],
    verificationStatus: opts.verification || 'verified'
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
    const sourceIdx = person.sections.findIndex(s => s.title === 'Source files' || s.title === 'Source');
    if (sourceIdx >= 0) {
      person.sections.splice(sourceIdx, 0, sec);
    } else {
      person.sections.push(sec);
    }
    added++;
  }
  if (added > 0) {
    if (!person.sources.includes(OSINT)) person.sources.push(OSINT);
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

let addedPeople = 0, addedEvents = 0, addedConnections = 0, enrichedPeople = 0;

// ============================================================
// PART 1: ENRICH THEME 11 — "WHOOPS" EMAILS
// ============================================================

console.log('\n=== PART 1: ENRICH WHOOPS THEME ===\n');

const theme = findThemeById(THEME_ID);
if (theme) {
  const MARKER = '## Deep Research: Event Correlation Analysis';
  if (!theme.content.includes(MARKER)) {
    theme.content = theme.content.replace(/\n*---\s*$/, '');
    theme.content += `\n\n${MARKER}

Jeffrey Epstein used the word "whoops" more than 400 times across his email correspondence — in response to death notifications, rape disclosures, classified intelligence documents, and mundane scheduling alike. Released under the Epstein Files Transparency Act (signed November 19, 2025), these emails reveal a man whose single-word response to human tragedy was indistinguishable from his reaction to a misdirected calendar invite.

### Entry-by-Entry Findings

**Entry 1 — Aug 29, 2009 → Maxwell.** Senator Ted Kennedy died August 25, 2009 (brain cancer, age 77). Email sent on Kennedy's funeral day at Arlington National Cemetery. Investigative journalist Dominick Dunne also died August 25 (bladder cancer, age 83). Eunice Kennedy Shriver died August 11. The Kennedy family connection to Epstein runs primarily through RFK Jr., who admitted to flights on Epstein's jet.

**Entry 2 — Aug 1, 2010 → Redacted.** Dominant event: WikiLeaks Afghan War Diary release (July 25, 2010) — 91,000 classified documents. BP Deepwater Horizon crisis ongoing.

**Entry 3 — Apr 11, 2012 → BBC article.** Most relevant context: emerging BBC/Jimmy Savile scandal. The full Savile scandal broke October 2012, but journalist Miles Goslett published the first exposé of the cancelled Newsnight investigation in early 2012.

**Entry 4 — Jun 6, 2012 → Jean-Luc Brunel.** Sent day after Queen Elizabeth II's Diamond Jubilee (Jun 2–5), during which Prince Andrew participated prominently. Brunel later found hanged in La Santé Prison, Paris, at approximately 1:00 AM on February 19, 2022. No CCTV cameras recorded the death. Investigation concluded suicide (March 2023) after 14 months of detention.

**Entry 5 — Dec 12, 2012 → Warren Eisenstein, "Mutty Fukky."** Dr. Warren Eisenstein (1952–2014) was a Dallas optometrist and Epstein's closest childhood friend from Brooklyn's Sea Gate. Obituary listed Epstein as "lifelong friend and soulmate." 1981 SEC deposition revealed Epstein was fined $2,500 by Bear Stearns for improperly loaning money to Eisenstein to purchase stock. Notable deaths in window: Dave Brubeck (Dec 5), Oscar Niemeyer (Dec 5), nurse Jacintha Saldanha (Dec 7), Jenni Rivera (Dec 9).

**Entry 6 — Jul 16, 2013 → Nathan Myhrvold.** Microsoft's first CTO maintained decades-long friendship with Epstein from at least 1996. Flight logs: Dec 9, 1996 (with Maxwell); Jan 11, 1997 (with Dershowitz). In 2003 birthday book: "Somebody asked me, 'Does Jeffrey Epstein manage your money?' I replied, 'No, but he advises me on lifestyle.'" October 2010 email: Myhrvold told Epstein he hosted Putin's wife and daughter on his superyacht. Notable deaths: Cory Monteith overdose (Jul 13), Amar Bose (Jul 12).

**Entry 7 — Jun 30, 2014, "Permission to kill him."** Sender identified: **Susan Mary Hamblin**, interior designer and Epstein's longtime personal assistant. Full exchange: Hamblin wrote "I give you permission to kill him. He is apparently with Olga. He lied to you and he lied to me." Epstein: "whoops." Hamblin: "No one will lie to you and get away with it from me. No one. Whoops is correct." Sent one day after ISIS declared worldwide caliphate (Jun 29). MH17 shot down Jul 17. Former butler Alfredo Rodriguez died of mesothelioma December 2014 after stealing Epstein's "little black book."

**Entry 8 — Oct 13, 2014, "getting sick."** Coincides precisely with peak US Ebola panic. Thomas Eric Duncan died Oct 8. On Oct 13 — exact email date — CDC confirmed nurse Nina Pham contracted Ebola, the first person to get it on American soil.

**Entry 9 — May 11, 2015 → Jon Farkas, death of "Elkman."** "Elkman" identified: **Steven Munro Elkman**, Managing Director at Deutsche Bank's asset and wealth management unit, died of pancreatic cancer May 8, 2015, age 68. NYT obituary published May 11 — exact email date. Elkman graduated from Graham-Eckes School in Palm Beach, Florida (1964). Deutsche Bank connection critical: Epstein was a client 2013–2018 with 40+ accounts; bank later paid $75M to settle class action and was fined $150M by NY regulators.

**Entry 10 — Dec 1, 2015, "safe space for taboo ideas."** Mirrors Epstein's documented pattern of using intellectual programs to access young people. Foundation donated $6.5M to Harvard PED, $850K to MIT Media Lab, funded youth programs including steel orchestras and baseball teams for children ages 10–18 in USVI. Post-conviction: $15,000 to all-girls Hewitt School; $25,000 to Haiti grade school. Visited Harvard 40+ times post-conviction.

**Entry 11 — May 12, 2016 → Soon-Yi Previn.** EFTA reveals extensive Allen-Epstein friendship. Soon-Yi coordinated frequent dinner scheduling ("Woody doesn't email but he texts"). The couple commiserated with Epstein about being "unfairly" accused. September 2016: Soon-Yi forwarded Epstein a story about Anthony Weiner's sexting of a 15-year-old, writing "I hate women who take advantage of guys." Epstein arranged a White House tour for Allen and Previn (Dec 27, 2015).

**Entry 12 — Jul 4, 2016 → Richard Kahn.** Co-executor of Epstein's estate. Appeared 52,781 times in EFTA documents. FBI listed as one of 10 co-conspirators (2019). Kahn and Darren Indyke settled class action for $35M. Notable: Elie Wiesel died July 2; Istanbul Atatürk airport attack June 28 (45 killed).

**Entry 13 — Dec 19, 2016 → Brad Karp, extortion payments.** Karp chaired Paul, Weiss for 18 years. EFTA shows Karp reviewed Epstein's legal filings, calling arguments that "'victims' lied in wait and sat on their rights" effective. Asked Epstein for help getting his son a job on a Woody Allen film. "Extortion" primarily concerns Guzel Ganieva case: Ganieva demanded $100M from Leon Black; Epstein collaborated with Karp to surveil Ganieva using Nardello & Co. Separately, Paul Weiss partner Alan Halperin forwarded Epstein "Extortion Payments as Deductible Losses (and Not Gifts)" — Epstein replied "I know it well." Karp resigned as chair February 2026. Same date: Russian ambassador to Turkey assassinated in Ankara; Berlin Christmas market attack (12 killed).

**Entry 14 — Jan 20, 2017, Inauguration Day.** Epstein bragged about being "in palm with all the trump boys" and told Bill Gates about "new administration people visiting" his island. Networked through Tom Barrack (inaugural committee chairman) and Steve Bannon.

**Entry 15 — Aug 20, 2017, "Ornella was raped."** Most prominent "Ornella" in EFTA: Professor Ornella Corazza, Italian addiction scientist at University of Hertfordshire. The rape context may point to an unidentified victim in the Brunel recruitment pipeline. Notable: Charlottesville rally (Aug 11–12), Barcelona attack (Aug 17, 16 killed), Steve Bannon departed White House (Aug 18).

**Entry 16 — Sep 9, 2017 → Myhrvold (second whoops).** Sent three days after Hurricane Irma devastated USVI as Category 5. Groff described Little Saint James damage: "some structures are gone...trees gone...dock pavilions gone." The gold dome atop Epstein's temple was destroyed.

**Entry 17 — Sep 22, 2017 → Boris Nikolic.** Named backup executor of Epstein's will — claimed he was "shocked." Co-founded Biomatics Capital; controlled $42M stake in gene-editing firm Editas Medicine. Sources told Bloomberg Nikolic "waxed enthusiastic about Epstein's financial advice." Email date fell during Hurricane Maria's devastation of Puerto Rico (Sep 20).

**Entry 18 — Feb 25, 2018 → Ariane de Rothschild.** CEO of Edmond de Rothschild Group. Over a dozen meetings with Epstein (2013–2019). Bought ~$1M in auction items for Epstein; crafted custom candles etched with his favorite mathematical formula. The $25M Southern Trust contract (Oct 5, 2015): payment triggered by Rothschild Group's settlement with US authorities over Swiss banking violations. If DOJ penalty stayed under $75M, Epstein received $25M. Bank entered NPA paying $45M; three days later Benjamin de Rothschild wired $14,999,980 to Southern Trust. Bank initially stated de Rothschild "never met Epstein" — later admitted this was false.

**Entry 19 — Mar 5, 2018, "ice skating story and boy."** Likely reference: Richard Callaghan case. On March 6, 2018 — one day after this email — US Figure Skating suspended Olympic coach Richard Callaghan following sexual abuse allegations involving a male minor. Craig Maurizi alleged abuse from age 13 (1976). Email date suggests possible advance knowledge through Epstein's network.

**Entry 20 — Jul 15, 2018 → Nicole Junkermann.** German-British investor on Epstein's 2002 flight logs. Sent Epstein "Will you have a baby with me?" (Jun 10, 2010). Board of Carbyne (co-founded by Epstein and Ehud Barak). Board included Pinhas Buchris, former director of Israel's Unit 8200. Junkermann appointed to UK NHS HealthTech Advisory Board (Nov 2018), later stepped down. Trump-Putin Helsinki summit occurred the following day (Jul 16).

**Entry 21 — Sep 10, 2018, "how should we celebrate this day."** September 10 = day before 9/11 anniversary and World Suicide Prevention Day. Leslie Moonves stepped down as CBS chief; George Papadopoulos sentenced to 14 days; Christine Blasey Ford's letter circulating privately (leaked Sep 12).

### Undated Email Findings

**Mike Huffman (DIA).** On July 1, 2010, Epstein forwarded email from Huffman@ucia.gov to defense attorney Martin Weinberg: "defense intieligence? classifed. i think sent to me in error whoops?" Huffman identified as faculty at Joint Military Attaché School (JMAS), a DIA training institution preparing officers for overseas assignments as defense attachés — positions involving overt human intelligence collection. Huffman has essentially zero internet footprint, consistent with intelligence community personnel.

**Eva Dubin → Mary Kennedy.** May 16, 2012: Eva Dubin emailed Epstein "Mary Kennedy found dead in her backyard...." Epstein replied at 11:41 PM: "whoops." Mary Richardson Kennedy, estranged wife of RFK Jr., found dead at Bedford, NY home — ruled suicide by hanging. RFK Jr. flew on Epstein's jet at least twice; Maxwell attended Mary Kennedy's funeral.

**Eva Dubin → Sultan's mother-in-law.** Epstein was godfather to the Dubin children (they called him "Uncle F"). EFTA revealed Epstein told associates in 2014 that 19-year-old Celina Dubin was "the only person he wanted to marry." Virginia Giuffre testified Glenn Dubin was the first person Maxwell sent her to. Sultan connection likely Sultan Ahmed bin Sulayem (UAE/DP World) or Sultan of Brunei.

**Peter Mandelson, "bad setback with R."** "R" almost certainly Reinaldo Avila da Silva, Mandelson's partner (married 2023), who discovered texts. While Business Secretary, Mandelson allegedly leaked classified government information to Epstein: early notice of a €500B EU bank bailout, a Downing Street document proposing £20B in asset sales, and details about proposed 50% tax on bankers' bonuses. Mandelson dismissed as UK Ambassador to US (Sep 2025), resigned from Labour (Feb 2026), resigned from House of Lords, arrested for misconduct in public office (Feb 23, 2026).

**Crown Princess Mette-Marit of Norway.** Confirmed by CNN, NBC, PBS. Hundreds of emails; mentioned 1,000+ times in files. Correspondence 2011–2014: called Epstein "sweetheart," wrote "You always make me smile. Because you tickle my brain." Stayed at his Palm Beach estate four days (2013). In 2012 asked Epstein whether it was "inappropriate for a mother to suggest two naked women carrying a surfboard for my 15 yr old son's wallpaper." "In hospital for test" likely relates to her pulmonary fibrosis (publicly disclosed Oct 2018). Norwegian parliament voted Feb 2026: independent Commission of Inquiry.

**Nadia Marcinkova.** Almost certainly the "Nadia" recipient. Epstein allegedly bragged about having "purchased" her from her family; called her his "Yugoslavian sex slave." Brought to US around age 13–15. Pleaded the Fifth 42 times in a 2010 deposition. Visited Epstein 67–70 times during 2008–2009 incarceration. Named as co-conspirator in 2008 NPA with blanket federal immunity. Missing since early January 2024, disappearing when first major Epstein court documents unsealed.

### Interpretation

Three readings compete. The most evidence-supported is that "whoops" was a habitual verbal tic reflecting extreme sociopathic detachment — used identically for Mary Kennedy's death, classified intelligence documents, and scheduling conflicts. The coded-signal theory draws on the Hamblin exchange: "No one will lie to you and get away with it from me. Whoops is correct." The honest assessment: irreducible ambiguity. But the network the word reveals — spanning a Norwegian crown princess and a DIA instructor, a Rothschild banking fortune and a JPMorgan $290M settlement, a UK cabinet minister now arrested and a tech billionaire who hosted Putin's family — is the true revelation.

---`;
    if (!theme.sources.includes(OSINT)) theme.sources.push(OSINT);
    console.log('  ENRICH theme: whoops-emails (deep research content)');
  } else {
    console.log('  SKIP (already enriched): whoops-emails');
  }
} else {
  console.log('  WARN: whoops-emails theme not found');
}

// ============================================================
// PART 2: NEW PEOPLE
// ============================================================

console.log('\n=== PART 2: NEW PEOPLE ===\n');

// Steven Elkman — Deutsche Bank MD
if (addPerson(makePerson({
  id: 'steven-elkman',
  name: 'Steven Munro Elkman',
  category: 'financial',
  subcategory: undefined,
  summary: 'Managing Director at Deutsche Bank\'s asset and wealth management unit. Died of pancreatic cancer May 8, 2015, age 68. Graduated from Graham-Eckes School in Palm Beach, Florida (1964). Referenced as "Elkman" in Epstein\'s May 11, 2015 "whoops" email to Jon Farkas — the NYT obituary was published that exact date. Elkman worked at Deutsche Bank during the precise period Epstein banked there (2013–2018, 40+ accounts). Deutsche Bank later paid $75M to settle a class action by Epstein\'s victims and was fined $150M by NY regulators.',
  sections: [
    { title: 'Deutsche Bank Connection', content: 'Steven Munro Elkman was a Managing Director at Deutsche Bank\'s asset and wealth management unit. He graduated from the Graham-Eckes School in Palm Beach, Florida in 1964, placing him in Epstein\'s geographic orbit. He died of pancreatic cancer on May 8, 2015, at age 68. His New York Times obituary was published on May 11, 2015 — the exact date Epstein sent a "whoops" email to Jonathan Farkas referencing the death of "Elkman."\n\nThe Deutsche Bank connection is critical: Epstein was a Deutsche Bank client from 2013 to 2018 with over 40 accounts, and the bank later paid $75 million to settle a class action by Epstein\'s victims and was fined $150 million by New York regulators for compliance failures. Elkman worked in wealth management at Deutsche Bank during the precise period Epstein banked there.', sources: [SRC, OSINT] },
    { title: 'Source', content: 'EFTA corpus — EFTA02501993 (Farkas "whoops" email), EFTA00627271 (Elkman death reference), New York Times obituary (May 11, 2015)\n\n---', sources: [SRC, OSINT] }
  ],
  timelineEventIds: ['2015-05-08-elkman-death'],
  themeIds: [THEME_ID, 'financial-crimes-money-laundering'],
  connectionIds: ['elkman-epstein'],
  sources: [SRC, OSINT]
}))) addedPeople++;

// Warren Eisenstein
if (addPerson(makePerson({
  id: 'warren-eisenstein',
  name: 'Warren Eisenstein',
  category: 'other',
  subcategory: undefined,
  summary: 'Dallas optometrist (1952–2014) and one of Epstein\'s closest childhood friends from Brooklyn\'s Sea Gate neighborhood. Obituary listed Epstein as a "lifelong friend and soulmate." A 1981 SEC deposition revealed Epstein was fined $2,500 by Bear Stearns for improperly loaning money to Eisenstein to purchase stock. Received a "whoops" email December 12, 2012, about "Mutty Fukky."',
  sections: [
    { title: 'Epstein Relationship', content: 'Dr. Warren Eisenstein (1952–2014) was a Dallas optometrist and one of Epstein\'s closest childhood friends from the Sea Gate neighborhood of Brooklyn, New York. His obituary listed Epstein as a "lifelong friend and soulmate." A 1981 SEC deposition revealed Epstein was fined $2,500 by Bear Stearns for improperly loaning money to Eisenstein to purchase stock — one of the earliest documented financial irregularities in Epstein\'s career.\n\nOn December 12, 2012, Epstein sent Eisenstein a "whoops" email referencing "Mutty Fukky" — a phrase that remains unidentified. Given the crude humor documented in Epstein\'s Brooklyn friend group (including sexually explicit birthday book contributions), it is likely an inside joke or vulgar nickname.', sources: [SRC, OSINT] },
    { title: 'Source', content: 'EFTA corpus — EFTA01910978 (Mutty Fukky email), SEC records, obituary records\n\n---', sources: [SRC, OSINT] }
  ],
  timelineEventIds: [],
  themeIds: [THEME_ID],
  connectionIds: ['eisenstein-epstein'],
  sources: [SRC, OSINT]
}))) addedPeople++;

// Nathan Myhrvold
if (addPerson(makePerson({
  id: 'nathan-myhrvold',
  name: 'Nathan Myhrvold',
  category: 'other',
  subcategory: undefined,
  summary: 'Microsoft\'s first CTO. Maintained a decades-long, intimate friendship with Epstein from at least 1996 through 2018. Appeared on flight logs (Dec 9, 1996, with Maxwell; Jan 11, 1997, with Dershowitz). In 2003 birthday book joked: "He advises me on lifestyle." October 2010 email: Myhrvold told Epstein he hosted Putin\'s wife and daughter on his superyacht. Received multiple "whoops" emails (Jul 16, 2013; Sep 9, 2017).',
  sections: [
    { title: 'Epstein Relationship', content: 'Nathan Myhrvold, Microsoft\'s first Chief Technology Officer, maintained a decades-long, intimate friendship with Jeffrey Epstein from at least 1996 through 2018. He appeared on Epstein\'s flight logs: December 9, 1996 (alongside Ghislaine Maxwell) and January 11, 1997 (with Alan Dershowitz).\n\nIn his contribution to Epstein\'s 2003 birthday book, Myhrvold joked: "Somebody asked me, \'Does Jeffrey Epstein manage your money?\' I replied, \'No, but he advises me on lifestyle.\'" DOJ-released emails show sexually explicit exchanges between Myhrvold and Epstein.', sources: [SRC, OSINT] },
    { title: 'Putin Connection', content: 'In an October 2010 email, Myhrvold told Epstein he had hosted Putin\'s wife and daughter on his superyacht — a claim that has attracted significant attention from investigators exploring Epstein\'s Russian connections.', sources: [SRC] },
    { title: '"Whoops" Emails', content: 'Myhrvold received at least two documented "whoops" emails from Epstein:\n- July 16, 2013 (EFTA00964985)\n- September 9, 2017 (EFTA02634651) — sent three days after Hurricane Irma devastated Epstein\'s Little Saint James in the US Virgin Islands', sources: [SRC] },
    { title: 'Source', content: 'EFTA corpus — EFTA00964985, EFTA02634651, flight logs, Epstein birthday book (2003)\n\n---', sources: [SRC, OSINT] }
  ],
  timelineEventIds: [],
  themeIds: [THEME_ID],
  connectionIds: ['myhrvold-epstein'],
  sources: [SRC, OSINT]
}))) addedPeople++;

// Jonathan Farkas
if (addPerson(makePerson({
  id: 'jonathan-farkas',
  name: 'Jonathan Farkas',
  aliases: ['Jon Farkas'],
  category: 'other',
  subcategory: undefined,
  summary: 'New York socialite and heir to the Alexander\'s department store fortune. Husband of Somers Farkas, recently appointed US Ambassador to Malta. Met Epstein in the Hamptons in the early 1980s and maintained a 35-year social relationship. Received "whoops" email May 11, 2015, on the day of Steven Elkman\'s obituary. Separately emailed Epstein: "I gave [] your Jeffrey number between us I think Somers going to D.C. to work for Melania."',
  sections: [
    { title: 'Epstein Relationship', content: 'Jonathan Farkas is a New York socialite, heir to the Alexander\'s department store fortune, and husband of Somers Farkas (recently appointed US Ambassador to Malta). He met Epstein in the Hamptons in the early 1980s and maintained a 35-year social relationship.\n\nOn May 11, 2015, Epstein sent Farkas a "whoops" email (EFTA02501993) — the same day the New York Times published the obituary of Steven Munro Elkman, referenced in a separate "whoops" email (EFTA00627271) as "Elkman." In a separate email (EFTA00673162), Farkas wrote Epstein: "I gave [] your Jeffrey number between us I think Somers going to D.C. to work for Melania long story."', sources: [SRC, OSINT] },
    { title: 'Source', content: 'EFTA corpus — EFTA02501993, EFTA00627271, EFTA00673162\n\n---', sources: [SRC] }
  ],
  timelineEventIds: ['2015-05-08-elkman-death'],
  themeIds: [THEME_ID],
  connectionIds: ['farkas-epstein'],
  sources: [SRC, OSINT]
}))) addedPeople++;

// Soon-Yi Previn
if (addPerson(makePerson({
  id: 'soon-yi-previn',
  name: 'Soon-Yi Previn',
  category: 'other',
  subcategory: undefined,
  summary: 'Wife of Woody Allen. Present at dinner with Epstein, Miro Lajčák, Woody Allen, and Deepak Chopra (EFTA02231879). Received a "whoops" email May 12, 2016 (EFTA00827695). EFTA releases reveal extensive Allen-Epstein friendship. Coordinated frequent dinner scheduling with Epstein\'s staff. In September 2016, forwarded Epstein a story about Anthony Weiner\'s sexting of a 15-year-old, writing: "I hate women who take advantage of guys." Epstein arranged a White House tour for Allen and Previn (Dec 27, 2015).',
  sections: [
    { title: 'Epstein Relationship', content: 'The EFTA releases reveal an extensive, years-long friendship between the Allens and Epstein. Soon-Yi Previn coordinated frequent dinner scheduling with Epstein\'s staff ("Woody doesn\'t email but he texts"). The couple commiserated with Epstein about being "unfairly" accused of sexual misconduct, comparing their situations to Bill Cosby\'s.\n\nIn September 2016, Soon-Yi forwarded Epstein a story about Anthony Weiner\'s sexting of a 15-year-old and wrote: "I hate women who take advantage of guys and she is definitely one of them." Epstein arranged a White House tour for Allen and Previn on December 27, 2015.\n\nSoon-Yi was present at a dinner with Epstein, UN General Assembly President Miroslav Lajčák, Woody Allen, and Deepak Chopra on November 29, 2017, at Epstein\'s New York townhouse.', sources: [SRC, OSINT] },
    { title: '"Whoops" & "Batman\'s House"', content: 'Received a "whoops" email from Epstein on May 12, 2016 (EFTA00827695). A separate undated "whoops" email thread (EFTA01067377) references "two days before the movie was supposed to wrap she found the infamous pictures" — believed to reference Mia Farrow discovering nude Polaroid photographs of Soon-Yi taken by Woody Allen on January 13, 1992, during filming of "Husbands and Wives." The thread also mentions "Batman\'s house" — "Batman" appears in 112 EFTA documents as an apparent codename for a specific person.', sources: [SRC, OSINT] },
    { title: 'Source', content: 'EFTA corpus — EFTA00827695, EFTA02231879, EFTA01067377\n\n---', sources: [SRC] }
  ],
  timelineEventIds: [],
  themeIds: [THEME_ID],
  connectionIds: ['previn-epstein'],
  sources: [SRC, OSINT]
}))) addedPeople++;

// Nicole Junkermann
if (addPerson(makePerson({
  id: 'nicole-junkermann',
  name: 'Nicole Junkermann',
  category: 'financial',
  subcategory: undefined,
  summary: 'German-British investor who appeared on Epstein\'s 2002 flight logs. Emailed Epstein "Will you have a baby with me?" (Jun 10, 2010). Board member of Carbyne (co-founded by Epstein and Ehud Barak), whose board included Pinhas Buchris, former director of Israel\'s Unit 8200. Received a "whoops" email July 15, 2018 — the day before the Trump-Putin Helsinki summit. Appointed to UK NHS HealthTech Advisory Board (Nov 2018), later stepped down after Epstein revelations.',
  sections: [
    { title: 'Epstein & Carbyne', content: 'Nicole Junkermann is a German-British investor who appeared on Epstein\'s flight logs in 2002 and sent him the email "Will you have a baby with me? Where is the best place to do so?" (June 10, 2010). She sits on the board of Carbyne (formerly Reporty Homeland Security), an emergency services technology company. Epstein invested $1 million via Southern Trust; former Israeli PM Ehud Barak (also former head of Israeli Military Intelligence) chaired its board.\n\nBoard members included Pinhas Buchris, former director of Israel\'s Unit 8200 (signals intelligence, equivalent to the NSA). Junkermann was appointed to the UK NHS HealthTech Advisory Board by Matt Hancock in November 2018, later stepping down after Epstein revelations.', sources: [SRC, OSINT] },
    { title: '"Whoops" Email', content: 'Received a "whoops" email from Epstein on July 15, 2018 (EFTA01005484). The Trump-Putin Helsinki summit occurred the following day (July 16). Widely reported in OSINT circles as connected to Israeli intelligence through Carbyne.', sources: [SRC, OSINT] },
    { title: 'Source', content: 'EFTA corpus — EFTA01005484, flight logs (2002), OSINT reporting on Carbyne\n\n---', sources: [SRC, OSINT] }
  ],
  timelineEventIds: [],
  themeIds: [THEME_ID, 'intelligence-connections'],
  connectionIds: ['junkermann-epstein'],
  sources: [SRC, OSINT]
}))) addedPeople++;

// Mike Huffman (DIA)
if (addPerson(makePerson({
  id: 'mike-huffman-dia',
  name: 'Mike Huffman',
  aliases: ['Huffman (DIA)'],
  category: 'political',
  subcategory: undefined,
  summary: 'Defense Intelligence Agency officer. Faculty at the Joint Military Attaché School (JMAS), a DIA training institution that prepares military officers for overseas assignments as defense attachés — positions involving overt human intelligence collection. Email from Huffman@ucia.gov forwarded by Epstein to defense attorney Martin Weinberg on July 1, 2010: "defense intieligence? classifed. i think sent to me in error whoops?" Huffman has essentially zero internet footprint, consistent with intelligence community personnel.',
  sections: [
    { title: 'DIA Connection', content: 'On July 1, 2010, Epstein forwarded an email from Huffman@ucia.gov to his defense attorney Martin Weinberg with the note: "defense intieligence? classifed. i think sent to me in error whoops?" Huffman\'s signature block identified him as faculty at the Joint Military Attaché School (JMAS), a DIA training institution that prepares military officers for overseas assignments as defense attachés — positions involving overt human intelligence collection. His office was at a DIA facility in Washington, D.C.\n\nHuffman has essentially zero internet footprint, consistent with intelligence community personnel. The email reinforces the contested intelligence theory: in 2017, prosecutor Alexander Acosta reportedly told Trump transition interviewers that Epstein "belonged to intelligence" and the matter was "above his pay grade." Acosta denied this under oath.', sources: [SRC, OSINT] },
    { title: 'Source', content: 'EFTA corpus — EFTA00736184\n\n---', sources: [SRC] }
  ],
  timelineEventIds: [],
  themeIds: [THEME_ID, 'intelligence-connections'],
  connectionIds: ['huffman-epstein'],
  sources: [SRC, OSINT]
}))) addedPeople++;

// Jabor Y / Sheikh Al Thani
if (addPerson(makePerson({
  id: 'jabor-al-thani',
  name: 'Sheikh Jabor Yousef Jassim Al Thani',
  aliases: ['Jabor Y.', 'Jabor Y'],
  category: 'political',
  subcategory: undefined,
  summary: 'Member of Qatar\'s ruling Al Thani family. Received "whoops" email from Epstein regarding a Reuters article on Qatar (EFTA02648688). Epstein served as diplomatic intermediary during the 2017–2021 Qatar blockade, advising: "I think qatar should stop kicking and arguing.. let the heat come down a bit." In December 2018, Epstein brokered a secret meeting between former Qatari PM Hamad bin Jassim and former Israeli PM Ehud Barak at One Hyde Park, London.',
  sections: [
    { title: 'Qatar Connection', content: 'Sheikh Jabor Yousef Jassim Al Thani is a member of Qatar\'s ruling family. Epstein served as a diplomatic intermediary during the 2017–2021 Qatar blockade, advising: "I think qatar should stop kicking and arguing.. let the heat come down a bit." In December 2018, Epstein brokered a secret meeting between former Qatari PM Hamad bin Jassim and former Israeli PM Ehud Barak at One Hyde Park, London.\n\nAl Thani received a "whoops" email from Epstein in connection with a Reuters article about Qatar (EFTA02648688).', sources: [SRC, OSINT] },
    { title: 'Source', content: 'EFTA corpus — EFTA02648688\n\n---', sources: [SRC, OSINT] }
  ],
  timelineEventIds: [],
  themeIds: [THEME_ID],
  connectionIds: ['althani-epstein'],
  sources: [SRC, OSINT]
}))) addedPeople++;

// ============================================================
// PART 3: ENRICH EXISTING PEOPLE
// ============================================================

console.log('\n=== PART 3: ENRICH EXISTING PEOPLE ===\n');

// Jean-Luc Brunel — death details
if (enrichPersonSections('jean-luc-brunel', [
  {
    title: '"Whoops" Email & Death in Custody',
    content: 'Brunel received a "whoops" email from Epstein on June 6, 2012 (EFTA01988549) — the day after the conclusion of Queen Elizabeth II\'s Diamond Jubilee celebrations, during which Prince Andrew participated prominently. Virginia Giuffre testified that Brunel sent 12-year-old girls to Epstein as "birthday gifts."\n\nBrunel was found hanged with bedsheets in his cell at La Santé Prison, Paris, at approximately 1:00 AM on February 19, 2022, while awaiting trial on charges of rape of minors, sexual assault, sexual harassment, human trafficking, and criminal conspiracy. No CCTV cameras recorded the death — French prison cells are not monitored by video under European human rights legislation. Prison guards confirmed their overnight checks were not missed; the death occurred "just after the guard round." An investigation concluded in March 2023 that Brunel committed suicide, though he had made several prior attempts during 14 months of detention. The parallels to Epstein\'s own death — hanging in custody, camera issues — were widely noted.',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// Brad Karp — full research
if (enrichPersonSections('brad-karp', [
  {
    title: '"Whoops" Research: Extortion & Ganieva Case',
    content: 'Brad Karp chaired Paul, Weiss, Rifkind, Wharton & Garrison LLP for 18 years. Despite the firm\'s claim it was "adverse to Epstein," EFTA documents show Karp reviewed and praised Epstein\'s legal filings, writing: "The draft motion is in great shape. It\'s overwhelmingly persuasive." He called arguments that "\'victims\' lied in wait and sat on their rights" effective. Karp asked Epstein for help getting his son a job on a Woody Allen film.\n\nThe "extortion payments" reference in the December 19, 2016 "whoops" email (EFTA02665413) primarily concerns the Guzel Ganieva case involving Leon Black: Ganieva demanded $100 million from Black, and Epstein collaborated with Karp to surveil Ganieva using investigation firm Nardello & Co., urging Karp to "have her arrested" and potentially deported before she could file a lawsuit.\n\nSeparately, Paul Weiss partner Alan Halperin forwarded Epstein an article titled "Extortion Payments as Deductible Losses (and Not Gifts)." Epstein replied: "I know it well."\n\nKarp resigned as Paul Weiss chairman in February 2026.',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// Susan Hamblin — "permission to kill him" sender identified
if (enrichPersonSections('susan-hamblin', [
  {
    title: '"Permission to Kill Him" Exchange',
    content: 'The June 30, 2014 "whoops" email (EFTA01922235) has been partially unredacted. Susan Mary Hamblin — described as an interior designer and Epstein\'s longtime personal assistant — wrote to Epstein: "I give you permission to kill him. He is apparently with Olga. He lied to you and he lied to me." Epstein replied: "whoops." Hamblin responded: "No one will lie to you and get away with it from me. No one. Whoops is correct."\n\nThe email was sent one day after ISIS declared a worldwide caliphate on June 29, 2014. In the weeks following, MH17 was shot down over Ukraine on July 17, killing 298 people including AIDS researcher Joep Lange. Epstein\'s former butler Alfredo Rodriguez — who had stolen Epstein\'s "little black book" and tried to sell it to an undercover FBI agent — died of mesothelioma in December 2014 at age 60.',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// Lesley Groff — additional detail
if (enrichPersonSections('lesley-groff', [
  {
    title: 'EFTA Document Frequency & Legal Status',
    content: 'Lesley Groff was Epstein\'s primary executive assistant for 20 years, appearing 157,613 times in EFTA documents — more than any other individual. Named as a co-conspirator in the 2008 Non-Prosecution Agreement, she received blanket immunity from federal sex trafficking charges.\n\nFBI emails state she was "in charge of making phone calls to set up massage appointments" — Epstein\'s code for sexual encounters with victims. The Southern District of New York investigation concluded in December 2021 without charging her.\n\nIn the "whoops" email context, Groff handled the June 8, 2015 scheduling around Jay Thomas\'s anniversary show at SiriusXM (EFTA00347727). Jay Thomas (1948–2017) was an Emmy-winning actor and beloved SiriusXM radio host who died August 24, 2017, of throat cancer.',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// Crown Princess Mette-Marit
if (enrichPersonSections('crown-princess-mette-marit-norway', [
  {
    title: '"Whoops" Email Research & Norwegian Investigation',
    content: 'Confirmed by CNN, NBC, PBS, and Norwegian media as the "HKH Kronprinsessen" whoops email recipient. The DOJ release included hundreds of emails between Epstein and her royal address; she is mentioned over 1,000 times in the files.\n\nCorrespondence (2011–2014) reveals intimate language: she called Epstein "sweetheart" and wrote "You always make me smile. Because you tickle my brain." She acknowledged Googling him and that it "didn\'t look too good" — proving she knew of his criminal past from the start. She stayed at his Palm Beach estate for four days in 2013.\n\nIn 2012, she asked Epstein whether it was "inappropriate for a mother to suggest two naked women carrying a surfboard for my 15 yr old son\'s wallpaper." The "in hospital for test" email likely relates to her pulmonary fibrosis, publicly disclosed in October 2018 but monitored for years prior.\n\nThe Norwegian parliament voted in February 2026 to establish an independent Commission of Inquiry, and a majority of Norwegians now believe she should not become queen.',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// Nadia Marcinkova — missing since Jan 2024
if (enrichPersonSections('nadia-marcinkova', [
  {
    title: '"Whoops" Email & Disappearance (2024)',
    content: 'Almost certainly the "Nadia" whoops email recipient (EFTA01987274). Born 1986 in Košice, Slovakia. Epstein allegedly bragged about having "purchased" her from her family and referred to her as his "Yugoslavian sex slave." Brought to the US around age 13–15.\n\nVictims testified she encouraged and participated in sexual acts with underage girls at Epstein\'s direction. She visited Epstein 67–70 times during his 2008–2009 incarceration. She pleaded the Fifth Amendment 42 times in a 2010 civil deposition, including when asked about Prince Andrew and Bill Clinton.\n\nNamed as a co-conspirator in the 2008 Non-Prosecution Agreement, she received blanket federal immunity. She later obtained a pilot\'s license, founded the aviation company Aviloop with Epstein\'s financial backing, and branded herself "Global Girl" after Gulfstream sued over trademark infringement.\n\nShe has been missing since early January 2024, disappearing when the first major Epstein court documents were unsealed.',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// Eva Dubin — Mary Kennedy, Celina
if (enrichPersonSections('eva-andersson-dubin-eva-dubin', [
  {
    title: '"Whoops" Research: Mary Kennedy & Celina Dubin',
    content: 'On May 16, 2012, Eva Dubin emailed Epstein: "Mary Kennedy found dead in her backyard...." Epstein replied at 11:41 PM with a single word: "whoops." Mary Richardson Kennedy, estranged wife of RFK Jr., was found dead at her Bedford, New York home — ruled suicide by asphyxiation due to hanging in a barn on the property. She was 52. RFK Jr. flew on Epstein\'s jet at least twice; Maxwell attended Mary Kennedy\'s funeral.\n\nDr. Eva Andersson-Dubin dated Epstein from 1983 to approximately 1991 and remained in his orbit. Epstein was godfather to her children with hedge fund billionaire Glenn Dubin; the children called him "Uncle F." She told Epstein\'s probation officer she was "100% comfortable" with him around her children. She invited Epstein to her Colorado home in 2010 while her 15-year-old daughter hosted five friends — two years after his sex crime conviction.\n\nEFTA documents revealed Epstein told associates in 2014 that 19-year-old Celina Dubin was "the only person he wanted to marry." Virginia Giuffre testified that Glenn Dubin was the first person Maxwell sent her to after finishing her "massage training."',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// Peter Mandelson — arrest
if (enrichPersonSections('peter-mandelson', [
  {
    title: '"Whoops" Email, Leaked Intelligence & Arrest (2026)',
    content: 'Described Epstein as his "best pal" in Epstein\'s 2003 birthday book. Bank documents show three payments totaling $75,000 to accounts linked to Mandelson.\n\nThe "bad setback with R" in his "whoops" email (EFTA00879292) almost certainly refers to Reinaldo Avila da Silva, Mandelson\'s long-term partner (married 2023), who apparently discovered the text correspondence with Epstein.\n\nWhile serving as Business Secretary, Mandelson allegedly leaked sensitive government information to Epstein including: early notice of a €500 billion EU bank bailout, a Downing Street document proposing £20 billion in asset sales, and details about the proposed 50% tax on bankers\' bonuses.\n\nThe fallout has been devastating: Mandelson was dismissed as UK Ambassador to the US in September 2025, resigned from the Labour Party in February 2026, resigned from the House of Lords, and was arrested on suspicion of misconduct in public office on February 23, 2026. Gordon Brown called his actions a "betrayal of his country."',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// Richard Kahn — enriched co-conspirator details
if (enrichPersonSections('richard-kahn', [
  {
    title: '"Whoops" Research: Co-Executor & Co-Conspirator',
    content: 'Kahn was Epstein\'s in-house accountant since 2005 and co-executor of Epstein\'s estate, named in the will signed two days before Epstein\'s death. He appeared 52,781 times in EFTA documents. The FBI listed him as one of 10 co-conspirators in 2019.\n\nA class action accused him of structuring bank accounts for cash access and participating in sham marriages for immigration fraud; Kahn and co-executor Darren Indyke settled for $35 million. Epstein planned to leave Kahn $25 million from the 1953 Trust. Between 2001 and 2019, Epstein entities paid Kahn over $10 million.\n\nReceived a "whoops" email on July 4, 2016 (EFTA02457915). Notable events in the surrounding window: the Istanbul Atatürk airport attack (June 28, 45 killed) and Nobel laureate Elie Wiesel\'s death (July 2).',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// Ariane de Rothschild — enriched $25M contract details
if (enrichPersonSections('ariane-de-rothschild', [
  {
    title: '"Whoops" Research: $25M Contract Mechanism',
    content: 'CEO of the Edmond de Rothschild Group. Maintained over a dozen meetings with Epstein from 2013 to 2019. Bought nearly $1 million in auction items on Epstein\'s behalf and crafted custom candles etched with his favorite mathematical formula.\n\nThe $25 million contract (EFTA00310331, dated October 5, 2015) between Epstein\'s Southern Trust Company and Edmond de Rothschild Holding was structured around "risk analysis" and "application of certain algorithms" — but the payment was triggered by the Rothschild Group\'s settlement with US authorities over Swiss banking violations. If the DOJ penalty stayed under $75 million, Epstein received $25 million; between $75–150 million, he got $10 million.\n\nOn December 18, 2015, the bank entered a non-prosecution agreement paying $45 million to the DOJ. Three days later, Benjamin de Rothschild wired $14,999,980 to Southern Trust. Epstein had connected Ariane to Obama\'s former White House counsel Kathy Ruemmler, who negotiated the deal.\n\nIn 2019, the bank initially stated de Rothschild had "never met Epstein" — later admitting this was false.',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// Michael Wolff — 100+ hours, coaching on Trump leverage
if (enrichPersonSections('michael-wolff', [
  {
    title: '"Whoops" Research: 100+ Hours of Recordings',
    content: 'Michael Wolff spent over 100 hours with Epstein recording 90+ hours of tapes. House Oversight Committee emails revealed Wolff coached Epstein on exploiting leverage over Trump: "If he says he hasn\'t been on the plane or to the house, then that gives you a valuable PR and political currency."\n\nEpstein told Wolff in 2019: "Of course he knew about the girls as he asked ghislaine to stop."\n\nThe "question about Jamie Dimon. whoops" email (EFTA02548441) implicates the full JPMorgan relationship: Epstein banked there from 1998 to 2013, generating over $8 million in revenue and referring billionaire clients including Sergey Brin. Executive Jes Staley exchanged ~1,200 emails with Epstein from his JPMorgan account, visited Little Saint James, and called Epstein a "most cherished" friend. JPMorgan settled for $290 million in June 2023, plus $75 million to the US Virgin Islands. Staley was banned for life from UK financial services.',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// Boris Nikolic — enriched
if (enrichPersonSections('boris-nikolic', [
  {
    title: '"Whoops" Research: Biomatics Capital & Editas',
    content: 'Serbian-born immunologist and former chief adviser for science and technology to Bill Gates. Named backup executor of Epstein\'s will — a designation he claimed left him "shocked." Co-founded Biomatics Capital, a health care venture firm staffed by former Gates Foundation employees, and controlled a stake worth $42 million in gene-editing firm Editas Medicine.\n\nSources told Bloomberg that Nikolic "waxed enthusiastic about Epstein\'s financial advice" to private bankers. The September 22, 2017 "whoops" email (EFTA01009760) fell during Hurricane Maria\'s devastating landfall on Puerto Rico (September 20), which destroyed 100% of the island\'s power grid.',
    sources: [SRC, OSINT]
  }
])) enrichedPeople++;

// ============================================================
// PART 4: TIMELINE EVENTS
// ============================================================

console.log('\n=== PART 4: TIMELINE EVENTS ===\n');

// Elkman death
if (addTimelineEvent(makeTimelineEvent({
  id: '2015-05-08-elkman-death',
  date: '2015-05-08',
  dateDisplay: 'May 8, 2015',
  era: '2008-2019',
  title: 'Death of Steven Elkman — Deutsche Bank Managing Director',
  body: 'Steven Munro Elkman, a Managing Director at Deutsche Bank\'s asset and wealth management unit, died of pancreatic cancer at age 68. His New York Times obituary was published on May 11, 2015 — the exact date Epstein sent a "whoops" email to Jonathan Farkas referencing the death of "Elkman" (EFTA02501993, EFTA00627271). Elkman graduated from the Graham-Eckes School in Palm Beach, Florida (1964), placing him in Epstein\'s geographic orbit. The Deutsche Bank connection is critical: Epstein was a client from 2013 to 2018 with over 40 accounts. Deutsche Bank later paid $75 million to settle a class action and was fined $150 million by NY regulators.',
  summary: 'Steven Elkman, Deutsche Bank Managing Director, dies of pancreatic cancer. Referenced as "Elkman" in Epstein\'s "whoops" email to Jon Farkas the same day his NYT obituary appeared.',
  peopleIds: ['steven-elkman', 'jonathan-farkas', 'jeffrey-epstein'],
  themeIds: [THEME_ID, 'financial-crimes-money-laundering'],
  sources: [SRC, OSINT],
  tags: ['death', 'deutsche-bank'],
  eftaLinks: [
    { number: 'EFTA02501993', url: 'https://www.justice.gov/epstein/files/DataSet%2011/EFTA02501993.pdf', description: 'Whoops email to Jon Farkas', mediaType: 'pdf', sensitive: false },
    { number: 'EFTA00627271', url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA00627271.pdf', description: 'Death of Elkman reference', mediaType: 'pdf', sensitive: false }
  ],
  verificationStatus: 'verified'
}))) addedEvents++;

// Brunel death in custody
if (addTimelineEvent(makeTimelineEvent({
  id: '2022-02-19-brunel-death-custody',
  date: '2022-02-19',
  dateDisplay: 'February 19, 2022',
  era: '2020-present',
  title: 'Jean-Luc Brunel found hanged in La Santé Prison, Paris',
  body: 'Jean-Luc Brunel, French modeling agent who appeared on at least 25 Epstein flight logs and had 10 phone numbers in Epstein\'s black book, was found hanged with bedsheets in his cell at La Santé Prison at approximately 1:00 AM. He was awaiting trial on charges of rape of minors, sexual assault, sexual harassment, human trafficking, and criminal conspiracy. No CCTV cameras recorded the death — French prison cells are not monitored by video under European human rights legislation. Investigation concluded suicide in March 2023 after 14 months of detention. Virginia Giuffre had testified Brunel sent 12-year-old girls to Epstein as "birthday gifts." The parallels to Epstein\'s own death — hanging in custody, camera issues — were widely noted.',
  summary: 'Jean-Luc Brunel found hanged in Paris jail cell while awaiting trial on sex trafficking charges. No CCTV footage. Investigation concluded suicide.',
  peopleIds: ['jean-luc-brunel', 'jeffrey-epstein'],
  themeIds: [THEME_ID, 'the-trafficking-operation'],
  sources: [OSINT],
  tags: ['death', 'custody'],
  verificationStatus: 'verified'
}))) addedEvents++;

// Mandelson arrest
if (addTimelineEvent(makeTimelineEvent({
  id: '2026-02-23-mandelson-arrest',
  date: '2026-02-23',
  dateDisplay: 'February 23, 2026',
  era: '2020-present',
  title: 'Peter Mandelson arrested for misconduct in public office',
  body: 'Former UK Business Secretary Peter Mandelson arrested on suspicion of misconduct in public office. While serving as Business Secretary, Mandelson allegedly leaked sensitive government information to Epstein including: early notice of a €500 billion EU bank bailout, a Downing Street document proposing £20 billion in asset sales, and details about the proposed 50% tax on bankers\' bonuses. He had previously been dismissed as UK Ambassador to the US (September 2025), resigned from the Labour Party (February 2026), and resigned from the House of Lords. Gordon Brown called his actions a "betrayal of his country." Mandelson described Epstein as his "best pal" in the 2003 birthday book. Bank documents show three payments totaling $75,000 to accounts linked to Mandelson.',
  summary: 'Peter Mandelson arrested for misconduct in public office over leaking classified government information to Epstein.',
  peopleIds: ['peter-mandelson', 'jeffrey-epstein'],
  themeIds: [THEME_ID, 'international-consequences-fallout'],
  sources: [OSINT],
  tags: ['arrest', 'uk-politics'],
  verificationStatus: 'verified'
}))) addedEvents++;

// Brad Karp resignation
if (addTimelineEvent(makeTimelineEvent({
  id: '2026-02-karp-resignation',
  date: '2026-02-01',
  dateDisplay: 'February 2026',
  era: '2020-present',
  title: 'Brad Karp resigns as Paul Weiss chairman',
  body: 'Brad Karp resigned as chairman of Paul, Weiss, Rifkind, Wharton & Garrison LLP after 18 years, following EFTA revelations showing his close collaboration with Epstein. Documents showed Karp reviewed and praised Epstein\'s legal filings, called arguments that "victims lied in wait and sat on their rights" effective, and collaborated with Epstein to surveil Guzel Ganieva in connection with the Leon Black extortion case.',
  summary: 'Brad Karp resigns as Paul Weiss chairman after EFTA revelations about his collaboration with Epstein.',
  peopleIds: ['brad-karp', 'jeffrey-epstein'],
  themeIds: [THEME_ID, 'international-consequences-fallout'],
  sources: [OSINT],
  tags: ['resignation', 'legal'],
  verificationStatus: 'verified'
}))) addedEvents++;

// Mette-Marit commission of inquiry
if (addTimelineEvent(makeTimelineEvent({
  id: '2026-02-mette-marit-inquiry',
  date: '2026-02-01',
  dateDisplay: 'February 2026',
  era: '2020-present',
  title: 'Norwegian parliament votes for Commission of Inquiry into Mette-Marit–Epstein relationship',
  body: 'The Norwegian parliament (Storting) voted to establish an independent Commission of Inquiry into Crown Princess Mette-Marit\'s relationship with Jeffrey Epstein. EFTA releases confirmed hundreds of emails between Epstein and her royal address; she is mentioned over 1,000 times in the files. Correspondence (2011–2014) revealed she called Epstein "sweetheart," stayed at his Palm Beach estate for four days (2013), and in 2012 asked him whether it was "inappropriate for a mother to suggest two naked women carrying a surfboard for my 15 yr old son\'s wallpaper." A majority of Norwegians now believe she should not become queen.',
  summary: 'Norwegian parliament establishes Commission of Inquiry into Crown Princess Mette-Marit\'s Epstein relationship after EFTA releases confirmed hundreds of emails.',
  peopleIds: ['crown-princess-mette-marit-norway', 'jeffrey-epstein'],
  themeIds: [THEME_ID, 'international-consequences-fallout'],
  sources: [OSINT],
  tags: ['investigation', 'royalty', 'norway'],
  verificationStatus: 'verified'
}))) addedEvents++;

// Lajčák resignation
if (addTimelineEvent(makeTimelineEvent({
  id: '2026-01-31-lajcak-resignation',
  date: '2026-01-31',
  dateDisplay: 'January 31, 2026',
  era: '2020-present',
  title: 'Miroslav Lajčák resigns after EFTA revelations',
  body: 'Former UN General Assembly President Miroslav Lajčák resigned on January 31, 2026, after EFTA releases showed he asked Epstein to introduce him to "young girls." He had attended a dinner at Epstein\'s New York townhouse on November 29, 2017, alongside Woody Allen, Soon-Yi Previn, and Deepak Chopra (EFTA02231879).',
  summary: 'Former UN GA President Lajčák resigns after EFTA reveals he asked Epstein to introduce him to "young girls."',
  peopleIds: ['jeffrey-epstein', 'soon-yi-previn'],
  themeIds: [THEME_ID, 'international-consequences-fallout'],
  sources: [OSINT],
  tags: ['resignation', 'un'],
  verificationStatus: 'verified'
}))) addedEvents++;

// Nadia Marcinkova disappearance
if (addTimelineEvent(makeTimelineEvent({
  id: '2024-01-marcinkova-disappearance',
  date: '2024-01-01',
  dateDisplay: 'Early January 2024',
  era: '2020-present',
  title: 'Nadia Marcinkova (Marcinko) goes missing',
  body: 'Nadia Marcinkova — born 1986 in Košice, Slovakia, described by Epstein as his "Yugoslavian sex slave," allegedly "purchased" from her family around age 13–15 — disappeared in early January 2024 when the first major Epstein court documents were unsealed. She had pleaded the Fifth Amendment 42 times in a 2010 deposition (including on questions about Prince Andrew and Bill Clinton), visited Epstein 67–70 times during his 2008–2009 incarceration, and received blanket federal immunity under the 2008 NPA. She later obtained a pilot\'s license and founded aviation company Aviloop. Her current whereabouts remain unknown.',
  summary: 'Nadia Marcinkova, Epstein co-conspirator who received federal immunity, goes missing as major court documents are unsealed.',
  peopleIds: ['nadia-marcinkova', 'jeffrey-epstein'],
  themeIds: [THEME_ID, 'the-trafficking-operation'],
  sources: [OSINT],
  tags: ['disappearance', 'co-conspirator'],
  verificationStatus: 'unverified'
}))) addedEvents++;

// Mary Kennedy death / whoops response
if (addTimelineEvent(makeTimelineEvent({
  id: '2012-05-16-mary-kennedy-death-whoops',
  date: '2012-05-16',
  dateDisplay: 'May 16, 2012',
  era: '2008-2019',
  title: 'Mary Kennedy found dead — Epstein responds "whoops"',
  body: 'Mary Richardson Kennedy, estranged wife of RFK Jr., was found dead at her Bedford, New York home at age 52 — ruled suicide by asphyxiation due to hanging in a barn on the property. Eva Dubin emailed Epstein: "Mary Kennedy found dead in her backyard...." Epstein replied at 11:41 PM with a single word: "whoops" (EFTA01884457). The Epstein-Kennedy overlap is documented: RFK Jr. flew on Epstein\'s jet at least twice, and Ghislaine Maxwell described a "very longstanding" friendship with Mary Kennedy, attending her 2012 funeral.',
  summary: 'Mary Richardson Kennedy found dead. Eva Dubin notifies Epstein, who responds "whoops" — one of the most chilling examples of the "whoops" email pattern.',
  peopleIds: ['eva-andersson-dubin-eva-dubin', 'jeffrey-epstein', 'ghislaine-maxwell'],
  themeIds: [THEME_ID],
  sources: [SRC, OSINT],
  tags: ['death', 'whoops'],
  eftaLinks: [
    { number: 'EFTA01884457', url: 'https://www.justice.gov/epstein/files/DataSet%2010/EFTA01884457.pdf', description: 'Whoops email to Eva Dubin on Mary Kennedy', mediaType: 'pdf', sensitive: false }
  ],
  verificationStatus: 'verified'
}))) addedEvents++;

// Huffman DIA email forwarded
if (addTimelineEvent(makeTimelineEvent({
  id: '2010-07-01-huffman-dia-email',
  date: '2010-07-01',
  dateDisplay: 'July 1, 2010',
  era: '2008-2019',
  title: 'Epstein forwards DIA email to defense attorney: "defense intelligence? classified"',
  body: 'Epstein forwarded an email from Huffman@ucia.gov (Mike Huffman, faculty at the DIA\'s Joint Military Attaché School) to defense attorney Martin Weinberg, writing: "defense intieligence? classifed. i think sent to me in error whoops?" Huffman\'s signature block identified him as faculty at JMAS, a DIA training institution preparing military officers for defense attaché positions — overt human intelligence collection roles. The email reinforces the contested intelligence theory and Epstein\'s possession of classified material.',
  summary: 'Epstein forwards classified DIA email to his defense attorney, claiming it was sent "in error." Reinforces intelligence community connections.',
  peopleIds: ['mike-huffman-dia', 'jeffrey-epstein'],
  themeIds: [THEME_ID, 'intelligence-connections'],
  sources: [SRC],
  tags: ['intelligence', 'dia', 'whoops'],
  eftaLinks: [
    { number: 'EFTA00736184', url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA00736184.pdf', description: 'Mike Huffman DIA email', mediaType: 'pdf', sensitive: false }
  ],
  verificationStatus: 'verified'
}))) addedEvents++;

// ============================================================
// PART 5: CONNECTIONS
// ============================================================

console.log('\n=== PART 5: CONNECTIONS ===\n');

if (addConnection(makeConnection({
  id: 'elkman-epstein',
  source: 'jeffrey-epstein',
  target: 'steven-elkman',
  type: 'financial',
  strength: 2,
  description: 'Elkman was a Deutsche Bank Managing Director during the period Epstein banked there (2013–2018). Referenced as "Elkman" in a "whoops" email on the day of his NYT obituary (May 11, 2015).',
  verification: 'verified'
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'eisenstein-epstein',
  source: 'jeffrey-epstein',
  target: 'warren-eisenstein',
  type: 'associate',
  strength: 3,
  description: 'Childhood friends from Brooklyn\'s Sea Gate. Eisenstein\'s obituary listed Epstein as "lifelong friend and soulmate." 1981 SEC deposition: Epstein fined for loaning Eisenstein money at Bear Stearns.',
  verification: 'verified'
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'myhrvold-epstein',
  source: 'jeffrey-epstein',
  target: 'nathan-myhrvold',
  type: 'associate',
  strength: 3,
  description: 'Decades-long friendship from 1996 through 2018. Multiple flight logs, sexually explicit emails, birthday book contribution. Myhrvold hosted Putin\'s wife and daughter on his superyacht (2010 email).',
  verification: 'verified'
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'farkas-epstein',
  source: 'jeffrey-epstein',
  target: 'jonathan-farkas',
  type: 'associate',
  strength: 2,
  description: '35-year social relationship beginning in the Hamptons (early 1980s). Received "whoops" email May 11, 2015 on date of Elkman obituary. Wife Somers Farkas later appointed US Ambassador to Malta.',
  verification: 'verified'
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'previn-epstein',
  source: 'jeffrey-epstein',
  target: 'soon-yi-previn',
  type: 'associate',
  strength: 2,
  description: 'Frequent dinner scheduling correspondence. Previn and Woody Allen commiserated with Epstein about sexual misconduct accusations. Epstein arranged a White House tour for them (Dec 2015).',
  verification: 'verified'
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'junkermann-epstein',
  source: 'jeffrey-epstein',
  target: 'nicole-junkermann',
  type: 'financial',
  strength: 2,
  description: 'On Epstein\'s 2002 flight logs. Emailed "Will you have a baby with me?" (2010). Board of Carbyne (Epstein investment via Southern Trust). "Whoops" email July 15, 2018.',
  verification: 'verified'
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'huffman-epstein',
  source: 'mike-huffman-dia',
  target: 'jeffrey-epstein',
  type: 'associate',
  strength: 1,
  description: 'DIA faculty at Joint Military Attaché School. Epstein received email from Huffman@ucia.gov containing apparently classified material, forwarded to defense attorney (July 1, 2010).',
  verification: 'unverified'
}))) addedConnections++;

if (addConnection(makeConnection({
  id: 'althani-epstein',
  source: 'jeffrey-epstein',
  target: 'jabor-al-thani',
  type: 'political',
  strength: 2,
  description: 'Epstein served as diplomatic intermediary during 2017–2021 Qatar blockade. Brokered Dec 2018 secret meeting between former Qatari PM and Ehud Barak at One Hyde Park, London.',
  verification: 'verified'
}))) addedConnections++;

// ============================================================
// PART 6: UPDATE THEME PEOPLE & EVENT IDS
// ============================================================

console.log('\n=== PART 6: UPDATE THEME REFERENCES ===\n');

const newThemePeople = [
  'steven-elkman', 'warren-eisenstein', 'nathan-myhrvold', 'jonathan-farkas',
  'soon-yi-previn', 'nicole-junkermann', 'mike-huffman-dia', 'jabor-al-thani',
  'ghislaine-maxwell', 'jeffrey-epstein', 'susan-hamblin', 'lesley-groff',
  'crown-princess-mette-marit-norway', 'nadia-marcinkova',
  'eva-andersson-dubin-eva-dubin', 'peter-mandelson'
];

const newThemeEvents = [
  '2015-05-08-elkman-death', '2022-02-19-brunel-death-custody',
  '2026-02-23-mandelson-arrest', '2026-02-karp-resignation',
  '2026-02-mette-marit-inquiry', '2026-01-31-lajcak-resignation',
  '2024-01-marcinkova-disappearance', '2012-05-16-mary-kennedy-death-whoops',
  '2010-07-01-huffman-dia-email'
];

if (theme) {
  for (const pid of newThemePeople) {
    if (!theme.peopleIds.includes(pid)) {
      theme.peopleIds.push(pid);
    }
  }
  for (const eid of newThemeEvents) {
    if (!theme.timelineEventIds.includes(eid)) {
      theme.timelineEventIds.push(eid);
    }
  }
  console.log(`  Updated theme peopleIds: ${theme.peopleIds.length}`);
  console.log(`  Updated theme timelineEventIds: ${theme.timelineEventIds.length}`);
}

// Wire up person → event and person → theme references
for (const pid of newThemePeople) {
  addPersonTheme(pid, THEME_ID);
}

// Wire new people to their events
addPersonEvent('steven-elkman', '2015-05-08-elkman-death');
addPersonEvent('jonathan-farkas', '2015-05-08-elkman-death');
addPersonEvent('jean-luc-brunel', '2022-02-19-brunel-death-custody');
addPersonEvent('peter-mandelson', '2026-02-23-mandelson-arrest');
addPersonEvent('brad-karp', '2026-02-karp-resignation');
addPersonEvent('crown-princess-mette-marit-norway', '2026-02-mette-marit-inquiry');
addPersonEvent('nadia-marcinkova', '2024-01-marcinkova-disappearance');
addPersonEvent('eva-andersson-dubin-eva-dubin', '2012-05-16-mary-kennedy-death-whoops');
addPersonEvent('mike-huffman-dia', '2010-07-01-huffman-dia-email');

// Wire new people to their connections
addPersonConnection('steven-elkman', 'elkman-epstein');
addPersonConnection('warren-eisenstein', 'eisenstein-epstein');
addPersonConnection('nathan-myhrvold', 'myhrvold-epstein');
addPersonConnection('jonathan-farkas', 'farkas-epstein');
addPersonConnection('soon-yi-previn', 'previn-epstein');
addPersonConnection('nicole-junkermann', 'junkermann-epstein');
addPersonConnection('mike-huffman-dia', 'huffman-epstein');
addPersonConnection('jabor-al-thani', 'althani-epstein');

// Also enrich the intelligence-connections theme
const intelTheme = findThemeById('intelligence-connections');
if (intelTheme) {
  const INTEL_MARKER = 'DIA "Whoops" Email Connection';
  if (!intelTheme.content.includes(INTEL_MARKER)) {
    intelTheme.content = intelTheme.content.replace(/\n*---\s*$/, '');
    intelTheme.content += `\n\n### ${INTEL_MARKER}

On July 1, 2010, Epstein forwarded an email from Mike Huffman (Huffman@ucia.gov), faculty at the DIA's Joint Military Attaché School (JMAS), to his defense attorney Martin Weinberg: "defense intieligence? classifed. i think sent to me in error whoops?" JMAS prepares military officers for overseas assignments as defense attachés — positions involving overt human intelligence collection. Huffman has essentially zero internet footprint, consistent with intelligence community personnel. Combined with the FBI FD-1023 report identifying Epstein as a "co-opted Mossad agent" and Acosta's reported claim that Epstein "belonged to intelligence," the Huffman email documents direct correspondence between Epstein and a DIA training instructor.

---`;
    if (!intelTheme.peopleIds.includes('mike-huffman-dia')) {
      intelTheme.peopleIds.push('mike-huffman-dia');
    }
    console.log('  ENRICH theme: intelligence-connections (DIA whoops)');
  }
}

// Enrich international-consequences-fallout theme
const consequencesTheme = findThemeById('international-consequences-fallout');
if (consequencesTheme) {
  const CONSEQ_MARKER = '"Whoops" Email Recipients — Consequences (2025–2026)';
  if (!consequencesTheme.content.includes(CONSEQ_MARKER)) {
    consequencesTheme.content = consequencesTheme.content.replace(/\n*---\s*$/, '');
    consequencesTheme.content += `\n\n### ${CONSEQ_MARKER}

Several recipients of Epstein's documented "whoops" emails have faced significant consequences following the EFTA releases:

- **Peter Mandelson** — Dismissed as UK Ambassador to US (Sep 2025), resigned from Labour Party (Feb 2026), resigned from House of Lords, arrested for misconduct in public office (Feb 23, 2026)
- **Brad Karp** — Resigned as Paul Weiss chairman (Feb 2026) after EFTA showed he reviewed Epstein's legal filings and collaborated on surveilling Guzel Ganieva
- **Crown Princess Mette-Marit** — Norwegian parliament established Commission of Inquiry (Feb 2026) after EFTA confirmed 1,000+ mentions and intimate correspondence
- **Miroslav Lajčák** — Resigned (Jan 31, 2026) after EFTA showed he asked Epstein to introduce him to "young girls"
- **Nadia Marcinkova** — Missing since early January 2024 when first major court documents unsealed
- **Jean-Luc Brunel** — Found hanged in La Santé Prison, Paris (Feb 19, 2022) awaiting trial; no CCTV recorded death

---`;
    for (const pid of ['peter-mandelson', 'brad-karp', 'crown-princess-mette-marit-norway', 'nadia-marcinkova', 'jean-luc-brunel']) {
      if (!consequencesTheme.peopleIds.includes(pid)) {
        consequencesTheme.peopleIds.push(pid);
      }
    }
    console.log('  ENRICH theme: international-consequences-fallout (whoops consequences)');
  }
}

// ============================================================
// WRITE OUTPUT
// ============================================================

console.log('\n=== WRITING FILES ===\n');

fs.writeFileSync(path.join(DATA, 'people.json'), JSON.stringify(people, null, 2));
fs.writeFileSync(path.join(DATA, 'timeline.json'), JSON.stringify(timeline, null, 2));
fs.writeFileSync(path.join(DATA, 'connections.json'), JSON.stringify(connections, null, 2));
fs.writeFileSync(path.join(DATA, 'themes.json'), JSON.stringify(themes, null, 2));

console.log(`\n=== WHOOPS RESEARCH INTEGRATION COMPLETE ===`);
console.log(`  New people: ${addedPeople}`);
console.log(`  Enriched people: ${enrichedPeople}`);
console.log(`  New events: ${addedEvents}`);
console.log(`  New connections: ${addedConnections}`);
console.log('');
