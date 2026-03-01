#!/usr/bin/env node
/**
 * Mogilevich Organization Integration Script
 * Integrates FBI Organized Crime Intelligence Report (1996) data
 * into site JSON: people, timeline, themes, connections.
 * Fully idempotent — safe to re-run.
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const timeline = JSON.parse(fs.readFileSync(path.join(DATA, 'timeline.json'), 'utf8'));
const people = JSON.parse(fs.readFileSync(path.join(DATA, 'people.json'), 'utf8'));
const connections = JSON.parse(fs.readFileSync(path.join(DATA, 'connections.json'), 'utf8'));
const themes = JSON.parse(fs.readFileSync(path.join(DATA, 'themes.json'), 'utf8'));

const SRC = 'FBI-Mogilevich';
const THEME_ID = 'eurasian-organized-crime-mogilevich';

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
    era: opts.era || '1990-2000',
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
    verificationStatus: opts.verificationStatus || 'unverified'
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
    subcategory: opts.subcategory || 'organized-crime',
    summary: opts.summary,
    sections: opts.sections || [
      { title: 'Role', content: opts.roleText || opts.summary, sources: [SRC] },
      { title: 'Source', content: 'FBI Organized Crime Intelligence Report — Semion Mogilevich Organization (1996)\n\n---', sources: [SRC] }
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
    relationshipType: opts.type || 'co-conspirator',
    strength: opts.strength || 2,
    description: opts.description,
    sources: opts.sources || [SRC],
    verificationStatus: opts.verification || 'unverified',
    activeEras: []
  };
}

function enrichThemeContent(themeId, additionalText) {
  const theme = findThemeById(themeId);
  if (!theme) {
    console.log(`  WARN: theme ${themeId} not found`);
    return false;
  }
  if (theme.content.includes('Mogilevich')) {
    console.log(`  SKIP (already enriched): ${themeId}`);
    return false;
  }
  theme.content = theme.content.replace(/\n*---\s*$/, '');
  theme.content += '\n\n### Mogilevich Organization Context\n\n' + additionalText + '\n\n---';
  if (!theme.sources.includes(SRC)) theme.sources.push(SRC);
  console.log(`  ENRICH theme: ${themeId}`);
  return true;
}

let addedPeople = 0, addedEvents = 0, addedConnections = 0, enrichedThemes = 0;

// ============================================================
// PART 1: NEW THEME
// ============================================================

console.log('\n=== PART 1: NEW THEME ===\n');

const newTheme = {
  id: THEME_ID,
  title: 'Eurasian Organized Crime — The Mogilevich Organization',
  sectionNumber: 20,
  summary: 'FBI intelligence report on Semion Mogilevich\'s multinational criminal organization based in Budapest, Hungary. Numbering approximately 250 members, the organization operates across Central Europe, the United States, United Kingdom, Israel, and beyond. Principal activities include weapons trafficking, nuclear materials trafficking, prostitution, drug trafficking, dealing in precious gems, art theft, extortion, counterfeiting, and money laundering through a network of front companies anchored by Arigon Ltd. (Channel Islands).',
  content: `## Organization Overview

The Semion Mogilevich Organization, identified by a 1994 multinational law enforcement working group in Moscow, is a primarily European-based organized crime group engaged in a wide variety of criminal activities. Based in Budapest, Hungary, the organization numbers approximately 50–250 members and operates across Central Europe — Prague, Vienna, Moscow — with tentacles reaching the United States, Ukraine, United Kingdom, France, Israel, and beyond.

Mogilevich began his criminal career in the 1970s with the Lyuberts Mafia group in Russia, engaging in petty crimes and counterfeiting. In the early 1980s, he became affiliated with the Solntsevskaya Organization and profited from the organization of Jewish emigration from Russia, helping emigres smuggle assets out in exchange for fees. After a year in Poland, he moved to Budapest in 1989 and rapidly built a criminal empire.

## Financial Infrastructure

The center of the Mogilevich Organization's financial operations is **Arigon, Ltd.**, registered in Alderney, Channel Islands, United Kingdom. Arigon deals extensively with Ukraine, selling oil products to the Ukrainian state railway administration (Ukrzaliznytsa), selling clothing to the FSU, and holding exclusive rights to insure tourists traveling to Ukraine. Through Arigon, Mogilevich reportedly laundered over $30 million from Europe into the United States. Arigon uses bank accounts in Stockholm, London, New York City, and Geneva.

In the United States, the primary front companies are **FNJ Trade Management Corporation** in Los Angeles, California, and **YBM Magnex, Inc.** in Newtown, Pennsylvania. Bank records revealed 45 wire transfers between January 1993 and April 1995 — 23 transactions to Arigon, and FNJ received 11 payments totaling $748,500 from Arigon. YBM Magnex claimed net sales of $32.5 million and $17.5 million in stockholders' equity, yet surveillance revealed it occupied a small section of a former school building incapable of supporting its stated operations.

In 1993, Mogilevich used Arigon to obtain a 90% interest in **Army Co-op** (701 million forints), which then privatized the state-run **DIGEP machine factory** — making Mogilevich a direct owner of the Hungarian armaments industry. He also controls the **Balchug Group** (bank, furniture company, hotel/casino in Moscow), **Arbat International** (co-owned with Ivankov and Solntsevskaya), and numerous front companies across Europe and North America.

## Criminal Activities

### Weapons Trafficking & Nuclear Materials
Criminal groups under Mogilevich's domain in the Czech Republic are involved in trafficking illegal weapons, radioactive materials, and precious gems. In 1994, Mogilevich purchased a license enabling him to buy and sell weapons through Army Co-op and traditional Hungarian arms export companies.

### Prostitution & Human Trafficking
Mogilevich runs an extensive prostitution operation out of the Black and White Nightclubs in Prague and Budapest. Russian women are recruited in Kiev and Moscow, provided cover jobs, and placed in the market. Bodyguards are provided by Mogilevich and Vitaly Savalovsky.

### Art Theft & Trafficking
In early 1995, Mogilevich and the Solntsevskaya Organization established a joint venture to steal art from Russian churches and museums — including the Hermitage in St. Petersburg — for sale in the West via Budapest. Stolen antiques, including Faberge eggs, were to be "restored" in Budapest then shipped to London for sale through Sotheby's auction house. The Solntsevskaya claimed to have already shipped $3 million worth of antiques out of Russia.

### Drug Trafficking
The organization is indirectly linked to cocaine and heroin trafficking. In February 1994, Mogilevich placed calls from Warsaw to a Vienna number tied to known Cali and Medellin cartel traffickers. He reportedly purchased a bankrupt Georgian airline to facilitate heroin smuggling from Southeast Asia.

### Extortion
Mogilevich and the Solntsevskaya Organization shared proceeds in extortion schemes targeting Austrian businessman Julius Meinl ($50,000/month), financier Alexander Konanykhine, and businessman Andrei Mokhin ($375,000).

### Counterfeit Products
The organization produced 15 million bottles of illicit vodka per month, packaged in Absolut brand bottles, earning $1–2 million per truckload. In May 1995, Hungarian authorities confiscated 24,000 liters of fake Absolut destined for Ukraine.

### Murder
Mogilevich ordered the murder of businessman Oleg Shirokov. Vladimir Berkovich allegedly arranged contract murders through the Palm Terrace Restaurant in Los Angeles, importing hitmen from Russia on tourist visas. Enforcers in Prague were known for torture and stabbing rather than shooting.

## Links to Other Criminal Organizations

The Mogilevich Organization is tied to the **Vyacheslav Ivankov Organization** and the **Solntsevskaya Organization** through meetings, joint investments, and silent partnerships. Mogilevich allegedly secured Ivankov's early release from a Russian prison through payoffs and established over 100 front companies and bank accounts for Solntsevskaya. He also aided Monya Elson's escape from the U.S. after assassination attempts.

Contacts with the **Italian Camorra** (Giuliano clan, via Salvatore DeFalco) were established in Prague. Eduard Garmel met with individuals connected to the **Genovese La Cosa Nostra Family**. Links to **Colombian cartels** (Cali and Medellin) are evidenced through telephone intercepts.

## Police & Public Corruption

Mogilevich's corruptive influence extends to the Russian security services. In 1995, two colonels from Department P of the Russian Presidential Security Service traveled to Hungary under commercial cover to meet with Mogilevich, seeking political intelligence. Israeli associate Shabtai Kalmanovich provides Israeli passports in short order for Mogilevich and Solntsevskaya associates, suggesting Israeli government connections. Two former Hungarian policemen serve as security coordinators, and Mogilevich uses Czech intelligence informants for disinformation campaigns.

## Key Business Entities

Arigon Ltd. (Channel Islands) • YBM Magnex Inc. (Pennsylvania/Budapest) • FNJ Trade Management (Los Angeles) • Army Co-op (Budapest) • DIGEP Machine Works (Miskolc) • Balchug Group (London/Moscow/San Diego) • Arbat International (Moscow) • Black and White Nightclub (Prague/Budapest) • U Holubu Restaurant (Prague) • Palm Terrace Restaurant (Los Angeles) • Ritual Funeral Services (Moscow) • Independent Trade Union Bank (Moscow/Cyprus/Tel Aviv) • Neftanoy Bank (Moscow)

---`,
  peopleIds: [
    'semion-mogilevich', 'alexei-alexandrov-mog', 'vitaly-savalovsky',
    'igor-fisherman', 'jacob-bogatin', 'alexander-roudavsky',
    'vladimir-berkovich-mog', 'oleg-berkovich', 'eduard-garmel',
    'leib-yarmolkin', 'monya-elson', 'shabtai-kalmanovich',
    'vyacheslav-ivankov', 'sergei-mikhailov-sol', 'viktor-averin',
    'viktor-naishuller', 'anatoly-katrich', 'anatoly-kulachenko',
    'vahtang-ubiriya', 'igor-korol'
  ],
  timelineEventIds: [
    '1970s-mogilevich-lyuberts', '1980s-mogilevich-solntsevskaya',
    '1989-mogilevich-moves-hungary', '1990-arigon-registered',
    '1991-mogilevich-prague-operations', '1992-ybm-magnex-established',
    '1992-atrium-hotel-oc-summit', '1993-army-coop-digep-privatization',
    '1993-military-equipment-theft', '1994-11-moscow-oc-working-group',
    '1995-art-theft-scheme', '1995-05-16-arigon-raid',
    '1995-05-31-u-holubu-raid', '1995-06-ivankov-arrested',
    '1995-10-tel-aviv-summit'
  ],
  sources: [SRC],
  tags: ['organized-crime', 'money-laundering', 'trafficking', 'weapons', 'international'],
  efta: [],
  eftaLinks: []
};

if (!findThemeById(THEME_ID)) {
  themes.push(newTheme);
  console.log(`  ADD theme: ${THEME_ID}`);
} else {
  console.log(`  SKIP (exists): ${THEME_ID}`);
}

// ============================================================
// PART 2: PEOPLE
// ============================================================

console.log('\n=== PART 2: PEOPLE ===\n');

const peopleToAdd = [
  makePerson({
    id: 'semion-mogilevich',
    name: 'Semion Mogilevich',
    aliases: ['Seva', 'Senya', 'Sergei Yurievich', 'Semyon Jukovich'],
    category: 'other',
    subcategory: 'organized-crime',
    summary: 'Leader of the Mogilevich Organization, a multinational Eurasian OC group based in Budapest, Hungary, with ~250 members. Israeli citizen of Ukrainian origin. Criminal activities include weapons trafficking, nuclear materials trafficking, prostitution, drug trafficking, money laundering, art theft, and extortion across Europe and the United States. Controls Arigon Ltd. (Channel Islands), YBM Magnex (Pennsylvania), and the Hungarian arms firm DIGEP. Key contact of the Solntsevskaya Organization and Vyacheslav Ivankov.',
    roleText: 'Leader of the Mogilevich Organization, a multinational Eurasian organized crime group based in Budapest, Hungary, numbering approximately 250 members. Born June 30, 1946, in Kiev, Ukraine. Israeli citizen. Began criminal career in the 1970s with the Lyuberts Mafia group. Became affiliated with the Solntsevskaya Organization in the early 1980s, profiting from Jewish emigration asset smuggling. Moved to Budapest in 1989 and built a criminal empire spanning Central Europe, the United States, and Israel.\n\nControls Arigon Ltd. (Channel Islands) — the financial center of the organization — through which he reportedly laundered over $30 million from Europe into the United States. Purchased controlling interest in Army Co-op and privatized DIGEP machine factory, becoming a direct owner of the Hungarian armaments industry. Established over 100 front companies and bank accounts for the Solntsevskaya Organization.\n\nTraveled to Los Angeles at least five times between 1992–1994. Visited New York City, Philadelphia, Toronto, and Miami. Allegedly secured Vyacheslav Ivankov\'s early release from a Russian prison through payoffs to officials.\n\n---',
    sections: [
      {
        title: 'Criminal Activities',
        content: 'Weapons trafficking, nuclear materials trafficking, prostitution, drug trafficking, dealing in precious gems, art theft, extortion, counterfeiting, money laundering. Produced 15 million bottles of illicit vodka per month. Ordered the murder of businessman Oleg Shirokov. Connected to Colombian cartel traffickers via Vienna telephone intercepts.',
        sources: [SRC]
      },
      {
        title: 'Financial Operations',
        content: 'Controls Arigon Ltd. (Channel Islands) with accounts in Stockholm, London, NYC, and Geneva. Front companies: FNJ Trade Management (LA), YBM Magnex (PA), Balchug Group (London/Moscow). Laundered over $30M from Europe to the US. Purchased DIGEP arms factory via Army Co-op for 701 million Hungarian forints.',
        sources: [SRC]
      },
      {
        title: 'Criminal Alliances',
        content: 'Key contact of the Solntsevskaya Organization (Sergei Mikhailov, Viktor Averin). Partner of Vyacheslav Ivankov. Aided Monya Elson\'s escape from the US. Contacts with Italian Camorra (Giuliano clan). Links to Genovese La Cosa Nostra family. Drug trafficking links to Cali and Medellin cartels.',
        sources: [SRC]
      },
      {
        title: 'Source',
        content: 'FBI Organized Crime Intelligence Report — Semion Mogilevich Organization (1996)\n\n---',
        sources: [SRC]
      }
    ],
    timelineEventIds: [
      '1970s-mogilevich-lyuberts', '1980s-mogilevich-solntsevskaya',
      '1989-mogilevich-moves-hungary', '1990-arigon-registered',
      '1991-mogilevich-prague-operations', '1992-ybm-magnex-established',
      '1992-atrium-hotel-oc-summit', '1993-army-coop-digep-privatization',
      '1995-05-16-arigon-raid', '1995-05-31-u-holubu-raid',
      '1995-10-tel-aviv-summit'
    ]
  }),

  makePerson({
    id: 'alexei-alexandrov-mog',
    name: 'Alexei Viktorovich Alexandrov',
    aliases: ['The Plumber'],
    summary: 'Chief negotiator for Semion Mogilevich in Prague, Czech Republic. Ran the Prague subsidiary of Arigon Ltd. Responsible for placing Russian women in prostitution operations. Israeli citizen with degrees in economics and engineering. Former director of BP Tradeproduction (Soviet/West German joint venture). Declared persona non grata by Czech Republic after the May 1995 U Holubu raid. Identified as Mogilevich\'s contact with the Hungarian National Police.',
    timelineEventIds: ['1991-mogilevich-prague-operations', '1995-05-31-u-holubu-raid']
  }),

  makePerson({
    id: 'vitaly-savalovsky',
    name: 'Vitaly Borisovich Savalovsky',
    summary: 'Underboss to Semion Mogilevich. Obtained residence in Hungary through a fraudulent marriage. Handles protection, smuggling, and prostitution for the Mogilevich Organization. Provides bodyguards for the prostitution operations.',
    timelineEventIds: []
  }),

  makePerson({
    id: 'igor-fisherman',
    name: 'Igor L\'vovich Fisherman',
    aliases: ['Igor Fischermann', 'Ygor Fisherman'],
    category: 'financial',
    summary: 'President of YBM Magnex, Inc. (Newtown, Pennsylvania). In charge of Semion Mogilevich\'s international financial operations. Trained mathematician and Israeli citizen. Commercial middleman between Mogilevich and Vahtang Ubiriya, coordinating contacts and criminal activities across Ukraine, Russia, US, UK, Czech Republic, and Hungary. Former consultant to Chase Manhattan Bank. Applied for refugee visa at US Embassy Vienna in 1989.',
    timelineEventIds: ['1992-ybm-magnex-established']
  }),

  makePerson({
    id: 'jacob-bogatin',
    name: 'Jacob Bogatin',
    aliases: ['Yakov Bogatin', 'Dr. Jakob Bogatin'],
    category: 'financial',
    summary: 'Group Vice-President of YBM Magnex, Inc. Former professor of physical metallurgy at Polytechnic Institute, Saratov, Russia. PhD in Metallurgical Sciences. Brother David Bogatin imprisoned in New York for gasoline tax fraud ($5M restitution). Contacted FBI in May 1996 regarding visa denials for YBM employees.',
    timelineEventIds: ['1992-ybm-magnex-established']
  }),

  makePerson({
    id: 'alexander-roudavsky',
    name: 'Alexander Vladimirovich Roudavsky',
    aliases: ['Rezany', 'Slash', 'Sasha Rezany'],
    summary: 'Russian OC leader in Philadelphia, Pennsylvania. Connection between Semion Mogilevich\'s operations in Los Angeles and YBM Magnex in Newtown, PA. Owns MGA Flowers, Inc. in Philadelphia. Met with Vahtang Ubiriya. Mogilevich visited NYC in January 1996 to meet with him.',
    timelineEventIds: []
  }),

  makePerson({
    id: 'vladimir-berkovich-mog',
    name: 'Vladimir Leonidovich Berkovich',
    summary: 'Principal lieutenant of Semion Mogilevich in Los Angeles. No visible means of support. Registered businesses: International Chemical Industries, Presidential Property, Teropack International. Silent partner in the Palm Terrace Restaurant, a gathering place for Russian OC in LA. Allegedly arranges contract murders, importing hitmen from Russia on tourist visas. Involved in racketeering, drug trafficking, and counterfeiting.',
    timelineEventIds: []
  }),

  makePerson({
    id: 'oleg-berkovich',
    name: 'Oleg Berkovich',
    aliases: ['Jan Tibor', 'Tibor Jan', 'Alex Berkowitz'],
    summary: 'Son of Vladimir Berkovich. Associate of Semion Mogilevich in Los Angeles. Business card identifies employer as Magnex Ltd. (Mogilevich\'s company in Hungary). Arrested and convicted in LA for solicitation to commit murder on October 11, 1989 — sentenced to four years, paroled January 1991. Attempted to travel to Austria on false passport as "Tibor Jan" in February 1994.',
    timelineEventIds: []
  }),

  makePerson({
    id: 'eduard-garmel',
    name: 'Eduard Garmel',
    aliases: ['Edik Garmel', 'Edouard Garmel', 'Edward Garmel', 'Angela Davis'],
    summary: 'Lieutenant of Semion Mogilevich in Los Angeles. Attempting to broker shipment of stolen automobiles (Mercedes, BMW) from Eastern Europe via Paralink Union Corporation. Met with Russians connected to the Genovese La Cosa Nostra Family (Boris Davidovsky and "Cyoma"). Allegedly arranging disposal of toxic medical waste in the Chernobyl region of Ukraine through payoffs to decontamination authority.',
    timelineEventIds: []
  }),

  makePerson({
    id: 'leib-yarmolkin',
    name: 'Leib Yarmolkin',
    aliases: ['Leonard Yarmolkin'],
    category: 'financial',
    summary: 'President of FNJ Trade Management Corporation and VP of Milana Trading Co. in Los Angeles. FNJ received 11 payments totaling $748,500 from Arigon Ltd. Former residential burglar and fence. In 1991, attempted to extort Andrey Shelukin for $120,000, threatening to have "Seva" (Mogilevich) collect the money. Three armed Ukrainians subsequently visited the Prague subsidiary demanding $100,000.',
    timelineEventIds: []
  }),

  makePerson({
    id: 'monya-elson',
    name: 'Monya Elson',
    aliases: ['Mandel'],
    summary: 'Major Eurasian organized crime figure. Former bodyguard for NYC Organizatsiya head Marat Balagula. Involved in extortion, drug trafficking, forgery, and murder conspiracy. Controls diamond, gold, and jewelry exports from the US and other countries to Russia. Mogilevich arranged his safe departure from the US in late 1993–1994 after at least four assassination attempts. Arrested in Italy in March 1995, extradited to US for trial on murder, attempted murder, conspiracy, and extortion charges.',
    timelineEventIds: []
  }),

  makePerson({
    id: 'shabtai-kalmanovich',
    name: 'Shabtai Kalmanovich',
    category: 'intelligence',
    subcategory: 'intelligence-linked',
    summary: 'Powerful associate of the Solntsevskaya Organization based in Budapest. Millionaire Russian emigre and Israeli citizen with ties to former KGB agents and high-level Russian, Israeli, and other government officials worldwide. Provides Israeli passports in short order for Mogilevich and Solntsevskaya associates — suggesting Israeli government connections. Manages affairs of incarcerated OC leader Marat Balagula from estate in Sierra Leone. Controls firm Liat Natalie (sole rights to import pharmaceuticals into Russia, ~$5M/month). Co-partner in Moskva Spartak basketball team with Mogilevich.',
    timelineEventIds: ['1995-10-tel-aviv-summit']
  }),

  makePerson({
    id: 'vyacheslav-ivankov',
    name: 'Vyacheslav Ivankov',
    aliases: ['Yaponchik'],
    summary: 'Influential Eurasian OC figure convicted in July 1996 on extortion charges. Mogilevich allegedly secured his early release from a Russian prison through payoffs. Co-owner of Arbat International (Moscow) with Mogilevich and Solntsevskaya. Invested in the Black and White Nightclub. His arrest by the FBI in June 1995 disrupted multiple OC operations. Considered the most influential and powerful Eurasian criminal prior to his arrest.',
    timelineEventIds: ['1992-atrium-hotel-oc-summit', '1995-06-ivankov-arrested']
  }),

  makePerson({
    id: 'sergei-mikhailov-sol',
    name: 'Sergei Mikhailov',
    summary: 'Principal leader of the Solntsevskaya Organization, based in Moscow (~230–1,000 members). Uses Mogilevich to establish financial operations and launder criminal proceeds. Relationship with Mogilevich characterized by fear but not subservience. Co-owned Arbat International. Attended the May 1995 summit at U Holubu and October 1995 summit in Tel Aviv. Alleged $5M extortion of Mogilevich.',
    timelineEventIds: ['1992-atrium-hotel-oc-summit', '1995-05-31-u-holubu-raid', '1995-10-tel-aviv-summit']
  }),

  makePerson({
    id: 'viktor-averin',
    name: 'Viktor Averin',
    summary: 'Co-leader of the Solntsevskaya Organization alongside Sergei Mikhailov. Uses Mogilevich for establishing financial operations. Declared persona non grata by Czech Republic after the 1995 U Holubu raid. Attended OC summits. Co-owner of Arbat International and various joint ventures with Mogilevich.',
    timelineEventIds: ['1992-atrium-hotel-oc-summit', '1995-05-31-u-holubu-raid', '1995-10-tel-aviv-summit']
  }),

  makePerson({
    id: 'viktor-naishuller',
    name: 'Viktor Grigurievich Naishuller',
    category: 'financial',
    summary: 'Controls the Balchug Group — holding company consisting of Balchug Bank (Moscow), Balchug Corporation (furniture, London/Moscow), and Balchug USA (San Diego). Co-owner of Finbrok Ltd. (Nassau, Bahamas) with Dmitry Itkin. Helped Mogilevich finance the purchase of Army Co-op and privatization of DIGEP through a London bank. Ukrainian SBU reported he and Sergei Maximov were murdered in Moscow in October 1993, though recent FBI investigation contradicted this.',
    timelineEventIds: ['1993-army-coop-digep-privatization']
  }),

  makePerson({
    id: 'anatoly-katrich',
    name: 'Anatoly Katrich',
    summary: 'Key figure of the Mogilevich Organization in the Czech Republic, now based in Israel after being banned. Maintained the U Holubu restaurant in Prague — headquarters of Czech operations. Involved in drug trafficking and money laundering in Israel with Alexander Tiutiun and Alexander Feigelson. Behind Mogilevich\'s operations in France (drug trafficking). Partner in Leman and Asma-Fia firms in Prague. Declared persona non grata by Czech Republic after the 1995 raid.',
    timelineEventIds: ['1995-05-31-u-holubu-raid']
  }),

  makePerson({
    id: 'anatoly-kulachenko',
    name: 'Anatoly Mikhailovich Kulachenko',
    category: 'financial',
    summary: 'Close associate of Semion Mogilevich involved in prostitution in Hungary. Director of Arigon Ltd. and Chairman of the Board of YBM Magnex, Inc. Took over management of Arbat International in Moscow following Mogilevich\'s departure to Poland and Hungary.',
    timelineEventIds: ['1992-ybm-magnex-established']
  }),

  makePerson({
    id: 'vahtang-ubiriya',
    name: 'Vahtang Shalvovich Ubiriya',
    category: 'political',
    subcategory: 'government-official',
    summary: 'High-ranking official in Ukrzaliznytsa (Ukrainian state railway). Primary contact for Arigon Ltd.\'s oil sales to Ukrainian railways. Acquainted with Mogilevich for ~20 years, involved in extortion, fraud, and illegal currency operations in Ukraine. Prior conviction for bribery. Owns firm "Vakhtadir" in Kiev and serves as director general of Arigon in Kiev. Photographed at a Republican Party fundraising event in Dallas, Texas, in March 1994. Traveled to the US to meet with "Monya" (believed to be Monya Elson) and met with Alexander Roudavsky in Philadelphia.',
    timelineEventIds: []
  }),

  makePerson({
    id: 'igor-korol',
    name: 'Igor Mikhailovich Korol',
    summary: 'Heads a group of gangsters associated with Semion Mogilevich operating in Budapest and Prague. Attempting to move in on Ukrainian OC operations in Bratislava, Slovakia. Has access to Mogilevich\'s cellular telephones and cars. Brother Sergei Korol also operates with the group.',
    timelineEventIds: []
  })
];

peopleToAdd.forEach(p => { if (addPerson(p)) addedPeople++; });

// ============================================================
// PART 3: TIMELINE EVENTS
// ============================================================

console.log('\n=== PART 3: TIMELINE EVENTS ===\n');

const eventsToAdd = [
  makeTimelineEvent({
    id: '1970s-mogilevich-lyuberts',
    date: '1970',
    dateDisplay: '1970s',
    era: 'pre-1990',
    title: 'Mogilevich Begins Criminal Career with Lyuberts Mafia',
    body: 'Semion Mogilevich begins his criminal career in the 1970s with the Lyuberts Mafia group in Russia. Primary activities are petty crimes and counterfeiting. He also derives profits from funeral arrangements. In 1977, Mogilevich is sentenced by a Kiev court for illegal currency dealings.',
    peopleIds: ['semion-mogilevich'],
    tags: ['organized-crime', 'origins'],
    relatedEventIds: ['1980s-mogilevich-solntsevskaya']
  }),

  makeTimelineEvent({
    id: '1980s-mogilevich-solntsevskaya',
    date: '1980',
    dateDisplay: 'Early 1980s',
    era: 'pre-1990',
    title: 'Mogilevich Affiliates with Solntsevskaya Organization',
    body: 'In the early 1980s, Mogilevich becomes affiliated with the Solntsevskaya Organization. During this period he organizes Jewish emigration from Russia, arranging for emigres to smuggle additional assets out of the country (the Soviet government placed restrictions on what could leave). Mogilevich earns substantial profits from these services, building capital that will finance his later criminal empire.',
    peopleIds: ['semion-mogilevich', 'sergei-mikhailov-sol', 'viktor-averin'],
    tags: ['organized-crime', 'emigration'],
    relatedEventIds: ['1970s-mogilevich-lyuberts', '1989-mogilevich-moves-hungary']
  }),

  makeTimelineEvent({
    id: '1989-mogilevich-moves-hungary',
    date: '1989',
    dateDisplay: '1989',
    era: 'pre-1990',
    title: 'Mogilevich Moves to Budapest, Hungary',
    body: 'After approximately one year in Poland, Semion Mogilevich marries and moves to Budapest, Hungary, in 1989. He purchases the Black and White Nightclub and several other entertainment establishments which serve as bases of operations for criminal activity. Budapest becomes the permanent headquarters of the Mogilevich Organization.',
    peopleIds: ['semion-mogilevich'],
    tags: ['organized-crime', 'budapest'],
    relatedEventIds: ['1991-mogilevich-prague-operations', '1990-arigon-registered']
  }),

  makeTimelineEvent({
    id: '1990-arigon-registered',
    date: '1990',
    dateDisplay: '1990',
    era: '1990-2000',
    title: 'Arigon Ltd. Registered in Channel Islands',
    body: 'Arigon Ltd. is registered in 1990 in Alderney, Channel Islands, United Kingdom — formed from the company Arbat International in Moscow. Arigon becomes the center of the Mogilevich Organization\'s financial operations, dealing extensively with Ukraine (oil sales to Ukrzaliznytsa), selling clothing to the FSU, and holding exclusive insurance rights. Through Arigon, Mogilevich will reportedly launder over $30 million from Europe into the United States. Accounts are identified in Stockholm, New York City, London, and Geneva.',
    peopleIds: ['semion-mogilevich', 'anatoly-kulachenko', 'vahtang-ubiriya'],
    tags: ['money-laundering', 'financial'],
    relatedEventIds: ['1989-mogilevich-moves-hungary', '1992-ybm-magnex-established']
  }),

  makeTimelineEvent({
    id: '1991-mogilevich-prague-operations',
    date: '1991',
    dateDisplay: 'Early 1991',
    era: '1990-2000',
    title: 'Mogilevich Establishes Prague Operations',
    body: 'Mogilevich purchases the Black and White Nightclub and U Holubu restaurant in Prague, Czech Republic. U Holubu becomes the headquarters of the Mogilevich Organization in Czech Republic — an entertainment complex with bar, disco, casino, and Japanese restaurant. It serves as a gathering place for organization members and a site for laundering profits from illegal activities. The prostitution operation expands with Russian women recruited in Kiev and Moscow.',
    peopleIds: ['semion-mogilevich', 'alexei-alexandrov-mog', 'anatoly-katrich'],
    tags: ['organized-crime', 'prague', 'prostitution'],
    relatedEventIds: ['1989-mogilevich-moves-hungary', '1995-05-31-u-holubu-raid']
  }),

  makeTimelineEvent({
    id: '1992-ybm-magnex-established',
    date: '1992',
    dateDisplay: '1992',
    era: '1990-2000',
    title: 'YBM Magnex Established in Budapest',
    body: 'The firm YBM Magnex is established in Budapest in 1992, with Anatoly Kulachenko as chairman. Officers include Igor Fisherman, Alexander Alexandrov, Jacob Bogatin, Frank Greenwald, and Sergei Maximov. YBM becomes a primary front company for money laundering. In 1993, its tax returns showed projected gross sales of $8,573; by 1995 at the time of acquisition by Canadian company PRATECS Technologies, it claimed $32.5 million in net sales. FBI surveillance revealed the Newtown, PA facility occupied a small section of a former school building, incapable of supporting the claimed 165 employees or $20 million in sales.',
    peopleIds: ['semion-mogilevich', 'igor-fisherman', 'jacob-bogatin', 'anatoly-kulachenko'],
    tags: ['money-laundering', 'financial', 'fraud'],
    relatedEventIds: ['1990-arigon-registered', '1993-army-coop-digep-privatization']
  }),

  makeTimelineEvent({
    id: '1992-atrium-hotel-oc-summit',
    date: '1992',
    dateDisplay: '1992',
    era: '1990-2000',
    title: 'Eurasian OC Summit at Atrium Hotel, Budapest',
    body: 'Semion Mogilevich meets with major Eurasian OC figures at the Atrium Hotel in Budapest to discuss $4 million investment in the Black and White nightclub and prostitution operations in Budapest and Prague. Representatives at the meeting include Sergei Mikhailov and Viktor Averin (Solntsevskaya Organization), Eduard Ivankov (representing his father Vyacheslav Ivankov), and Tzigan. Mogilevich controls these operations as manager of both establishments.',
    peopleIds: ['semion-mogilevich', 'sergei-mikhailov-sol', 'viktor-averin', 'vyacheslav-ivankov'],
    tags: ['organized-crime', 'summit', 'prostitution'],
    relatedEventIds: ['1991-mogilevich-prague-operations', '1995-05-31-u-holubu-raid']
  }),

  makeTimelineEvent({
    id: '1993-army-coop-digep-privatization',
    date: '1993',
    dateDisplay: '1993',
    era: '1990-2000',
    title: 'Mogilevich Acquires Hungarian Arms Industry',
    body: 'Through Arigon Ltd., Mogilevich obtains a 90% interest in Army Co-op (701 million Hungarian forints) with the assistance of Viktor Naishuller. Finances come from Balchug Ltd. accounts in London — Sergei Maximov, CEO of Army Co-op and YBM Magnex board member, transports $3.8 million from London to Hungary. Army Co-op then privatizes the state-run DIGEP machine factory, enabling Mogilevich to become a direct owner of the Hungarian armaments industry. In 1994, Mogilevich purchases a license to buy and sell weapons through Army Co-op and traditional Hungarian arms export companies. Maximov is reportedly murdered in Moscow in October 1993.',
    peopleIds: ['semion-mogilevich', 'viktor-naishuller'],
    tags: ['weapons', 'arms-industry', 'privatization'],
    relatedEventIds: ['1990-arigon-registered', '1993-military-equipment-theft']
  }),

  makeTimelineEvent({
    id: '1993-military-equipment-theft',
    date: '1993',
    dateDisplay: '1993',
    era: '1990-2000',
    title: '$18–20M Soviet Military Equipment Theft',
    body: 'Mogilevich is connected to the theft of $18–20 million of military equipment left behind by the former Soviet military\'s Western Group of Forces (WGF) in Germany. The theft involved surplus military equipment from a transaction between the Russian Government and an undisclosed third country. Through bribery of a high-ranking Russian military officer, the perpetrators procured state-of-the-art equipment and resold it at considerable profit. Boris Kandov, a top-level financial operative for the Ivankov and Solntsevskaya organizations in Vienna, was also involved.',
    peopleIds: ['semion-mogilevich', 'vyacheslav-ivankov'],
    tags: ['weapons', 'theft', 'military'],
    relatedEventIds: ['1993-army-coop-digep-privatization']
  }),

  makeTimelineEvent({
    id: '1994-11-moscow-oc-working-group',
    date: '1994-11',
    dateDisplay: 'November 1994',
    era: '1990-2000',
    title: 'Multinational Working Group Identifies Mogilevich Organization',
    body: 'A multinational working group on Eurasian organized crime meets in Moscow, consisting of Russian, German, Italian, and U.S. law enforcement representatives. The group identifies five Eurasian criminal organizations with multinational operations of mutual investigative interest. The Semion Mogilevich Organization is one of these five groups, triggering the comprehensive FBI intelligence report documenting the organization\'s structure, operations, finances, and vulnerabilities.',
    peopleIds: ['semion-mogilevich'],
    tags: ['law-enforcement', 'international'],
    sources: [SRC, 'FBI'],
    relatedEventIds: ['1995-05-16-arigon-raid', '1995-05-31-u-holubu-raid']
  }),

  makeTimelineEvent({
    id: '1995-art-theft-scheme',
    date: '1995',
    dateDisplay: 'Early 1995',
    era: '1990-2000',
    title: 'Mogilevich-Solntsevskaya Art Theft Scheme Targeting Russian Museums',
    body: 'Leaders of the Solntsevskaya Organization reach an agreement with Mogilevich to invest large sums in a joint venture to steal art from Russian churches and museums — including the Hermitage in St. Petersburg. Art objects and antiques are shipped from Moscow to Budapest for "restoration," then Mogilevich ships them to London for sale through Sotheby\'s auction house. Fake Faberge eggs are sent back to Moscow in place of the originals. The Solntsevskaya claims to have already shipped $3 million worth of antiques. A high-level employee of Ritual Funeral Services travels to Budapest in July 1995 with a list of stolen paintings, antiques, and Faberge eggs. The operation slows after Ivankov\'s arrest in June 1995.',
    peopleIds: ['semion-mogilevich', 'sergei-mikhailov-sol', 'viktor-averin'],
    tags: ['art-theft', 'cultural-crimes', 'sothebys'],
    relatedEventIds: ['1995-06-ivankov-arrested', '1992-atrium-hotel-oc-summit']
  }),

  makeTimelineEvent({
    id: '1995-05-16-arigon-raid',
    date: '1995-05-16',
    dateDisplay: 'May 16, 1995',
    era: '1990-2000',
    title: 'British Police Raid Arigon Ltd. Offices',
    body: 'British police raid the offices of Arigon Ltd. in the Channel Islands, arresting Mogilevich associates Adrian Churchward (managing director, married to Mogilevich\'s ex-wife), Galina Grigorieva, and Peter Blake-Turner. The three are interviewed and released on bail pending further investigation. Documents are confiscated from Arigon and the residences of all three suspects. The raid reportedly shakes up the organization — Mogilevich thought the possibility of a raid was inconceivable.',
    peopleIds: ['semion-mogilevich'],
    tags: ['law-enforcement', 'raid', 'uk'],
    relatedEventIds: ['1995-05-31-u-holubu-raid', '1990-arigon-registered']
  }),

  makeTimelineEvent({
    id: '1995-05-31-u-holubu-raid',
    date: '1995-05-31',
    dateDisplay: 'May 31, 1995',
    era: '1990-2000',
    title: 'Czech Police Raid Eurasian OC Summit at U Holubu Restaurant',
    body: 'Czech police raid a summit meeting of Eurasian OC leaders at the U Holubu Restaurant in Prague. The leaders are meeting on the occasion of Sergei Mikhailov\'s birthday to discuss carving up criminal jurisdictions and resolve a dispute between Mogilevich and the Solntsevskaya Organization over the February 1995 murder of Drozhine in Moscow. Mogilevich and his lieutenant Alexei Alexandrov are absent. Police detain participants and take photographs, fingerprints, diaries, and records. Five individuals are declared persona non grata: Mogilevich, Alexei Alexandrov, Anatoly Katrich, Viktor Averin, and Sergei Mikhailov.\n\nAn unidentified Russian had delivered an anonymous letter to Budapest police alleging Mogilevich was to be assassinated at the meeting — possibly Mogilevich himself made the tip as a protective measure. In the aftermath, Mogilevich initiates counteraction using Czech intelligence informants for a disinformation campaign through the media.',
    peopleIds: ['semion-mogilevich', 'alexei-alexandrov-mog', 'sergei-mikhailov-sol', 'viktor-averin', 'anatoly-katrich'],
    tags: ['law-enforcement', 'raid', 'summit', 'prague'],
    relatedEventIds: ['1995-05-16-arigon-raid', '1992-atrium-hotel-oc-summit']
  }),

  makeTimelineEvent({
    id: '1995-06-ivankov-arrested',
    date: '1995-06',
    dateDisplay: 'June 1995',
    era: '1990-2000',
    title: 'Vyacheslav Ivankov Arrested by FBI',
    body: 'The FBI arrests Vyacheslav Ivankov, considered the most influential and powerful Eurasian criminal operating in the world. He is subsequently convicted in July 1996 on extortion charges. His arrest disrupts multiple OC operations, including the Mogilevich-Solntsevskaya art theft scheme. The dynamics of Mogilevich\'s operations and other Eurasian OC groups are expected to change significantly. Mogilevich had allegedly secured Ivankov\'s early release from a Russian prison through payoffs.',
    peopleIds: ['vyacheslav-ivankov', 'semion-mogilevich'],
    tags: ['law-enforcement', 'arrest', 'fbi'],
    relatedEventIds: ['1995-art-theft-scheme', '1992-atrium-hotel-oc-summit']
  }),

  makeTimelineEvent({
    id: '1995-10-tel-aviv-summit',
    date: '1995-10',
    dateDisplay: 'October 10–19, 1995',
    era: '1990-2000',
    title: 'Eurasian OC Summit in Tel Aviv, Israel',
    body: 'Semion Mogilevich attends a summit meeting of Russian OC figures in Tel Aviv. Participants include Sergei Mikhailov, Viktor Averin, Boris Birshtein, Vadim Rabinovich, Leonid Bilounov, and Arnold Tamm. They meet in Boris Birshtein\'s office in the diamond center of Tel Aviv. The subject is the sharing of interests in Ukraine. The group travels around Israel, including a visit to a shooting range. Israeli National Police (INP) obtain telephone coverage of hotel rooms, detecting calls to Russia, Hungary, and Paris.',
    peopleIds: ['semion-mogilevich', 'sergei-mikhailov-sol', 'viktor-averin', 'shabtai-kalmanovich', 'boris-birshtein', 'vadim-rabinovich'],
    tags: ['organized-crime', 'summit', 'israel'],
    relatedEventIds: ['1995-05-31-u-holubu-raid', '1992-atrium-hotel-oc-summit']
  })
];

eventsToAdd.forEach(e => { if (addTimelineEvent(e)) addedEvents++; });

// ============================================================
// PART 4: CONNECTIONS
// ============================================================

console.log('\n=== PART 4: CONNECTIONS ===\n');

const connectionsToAdd = [
  // Mogilevich core relationships
  makeConnection({
    id: 'mog-alexei-alexandrov',
    source: 'semion-mogilevich', target: 'alexei-alexandrov-mog',
    type: 'co-conspirator', strength: 3,
    description: 'Alexei Alexandrov served as Mogilevich\'s chief negotiator in Prague, running the Arigon subsidiary and managing prostitution placement operations.'
  }),
  makeConnection({
    id: 'mog-savalovsky',
    source: 'semion-mogilevich', target: 'vitaly-savalovsky',
    type: 'co-conspirator', strength: 3,
    description: 'Vitaly Savalovsky is the underboss to Mogilevich, handling protection, smuggling, and prostitution operations.'
  }),
  makeConnection({
    id: 'mog-fisherman',
    source: 'semion-mogilevich', target: 'igor-fisherman',
    type: 'financial', strength: 3,
    description: 'Igor Fisherman runs Mogilevich\'s international financial operations as president of YBM Magnex and VP of Arigon Ltd.'
  }),
  makeConnection({
    id: 'mog-bogatin',
    source: 'semion-mogilevich', target: 'jacob-bogatin',
    type: 'financial', strength: 2,
    description: 'Jacob Bogatin serves as Group VP of YBM Magnex, Mogilevich\'s primary US front company.'
  }),
  makeConnection({
    id: 'mog-roudavsky',
    source: 'semion-mogilevich', target: 'alexander-roudavsky',
    type: 'co-conspirator', strength: 2,
    description: 'Alexander Roudavsky is the connection between Mogilevich\'s LA and Philadelphia operations, linking to YBM Magnex.'
  }),
  makeConnection({
    id: 'mog-v-berkovich',
    source: 'semion-mogilevich', target: 'vladimir-berkovich-mog',
    type: 'co-conspirator', strength: 3,
    description: 'Vladimir Berkovich is a principal lieutenant in Los Angeles, running front businesses and allegedly arranging contract murders.'
  }),
  makeConnection({
    id: 'mog-o-berkovich',
    source: 'semion-mogilevich', target: 'oleg-berkovich',
    type: 'co-conspirator', strength: 2,
    description: 'Oleg Berkovich, a relative, is connected to Mogilevich\'s Hungarian operations (Magnex Ltd.) and convicted of solicitation to murder.'
  }),
  makeConnection({
    id: 'mog-garmel',
    source: 'semion-mogilevich', target: 'eduard-garmel',
    type: 'co-conspirator', strength: 2,
    description: 'Eduard Garmel is Mogilevich\'s lieutenant in LA, brokering stolen auto shipments and business sales, with Genovese LCN contacts.'
  }),
  makeConnection({
    id: 'mog-yarmolkin',
    source: 'semion-mogilevich', target: 'leib-yarmolkin',
    type: 'financial', strength: 2,
    description: 'Leib Yarmolkin runs FNJ Trade Management in LA, which received $748,500 from Arigon Ltd. Used Mogilevich\'s name in extortion threats.'
  }),
  makeConnection({
    id: 'mog-kulachenko',
    source: 'semion-mogilevich', target: 'anatoly-kulachenko',
    type: 'co-conspirator', strength: 3,
    description: 'Anatoly Kulachenko is director of Arigon Ltd. and chairman of YBM Magnex. Close associate involved in prostitution in Hungary.'
  }),
  makeConnection({
    id: 'mog-katrich',
    source: 'semion-mogilevich', target: 'anatoly-katrich',
    type: 'co-conspirator', strength: 3,
    description: 'Anatoly Katrich was the key figure in Czech Republic operations, managing U Holubu restaurant and French drug trafficking operations.'
  }),
  makeConnection({
    id: 'mog-korol',
    source: 'semion-mogilevich', target: 'igor-korol',
    type: 'co-conspirator', strength: 2,
    description: 'Igor Korol heads a group of gangsters operating in Budapest and Prague with access to Mogilevich\'s phones and vehicles.'
  }),
  makeConnection({
    id: 'mog-ubiriya',
    source: 'semion-mogilevich', target: 'vahtang-ubiriya',
    type: 'financial', strength: 3,
    description: 'Vahtang Ubiriya is the primary contact for Arigon\'s oil sales to Ukrainian railways. 20-year acquaintance involved in extortion, fraud, and currency operations.'
  }),
  makeConnection({
    id: 'mog-naishuller',
    source: 'semion-mogilevich', target: 'viktor-naishuller',
    type: 'financial', strength: 3,
    description: 'Viktor Naishuller controls the Balchug Group and helped Mogilevich finance the Army Co-op acquisition and DIGEP privatization.'
  }),

  // Cross-organization relationships
  makeConnection({
    id: 'mog-ivankov',
    source: 'semion-mogilevich', target: 'vyacheslav-ivankov',
    type: 'co-conspirator', strength: 3,
    description: 'Mogilevich allegedly secured Ivankov\'s early release from Russian prison. Co-owners of Arbat International and Black and White Nightclub investment. Regular meetings in NYC and Europe.'
  }),
  makeConnection({
    id: 'mog-mikhailov',
    source: 'semion-mogilevich', target: 'sergei-mikhailov-sol',
    type: 'co-conspirator', strength: 3,
    description: 'Mogilevich established 100+ front companies and bank accounts for Mikhailov\'s Solntsevskaya Organization. Relationship "characterized by fear, but not subservience." Shared proceeds from extortion schemes.'
  }),
  makeConnection({
    id: 'mog-averin',
    source: 'semion-mogilevich', target: 'viktor-averin',
    type: 'co-conspirator', strength: 3,
    description: 'Viktor Averin, co-leader of Solntsevskaya, uses Mogilevich to establish financial operations. Co-invested in art theft scheme and multiple business ventures.'
  }),
  makeConnection({
    id: 'mog-elson',
    source: 'semion-mogilevich', target: 'monya-elson',
    type: 'co-conspirator', strength: 2,
    description: 'Mogilevich arranged Elson\'s safe departure from the US after assassination attempts. Connected through Tzigan in LA, who launders money for both.'
  }),
  makeConnection({
    id: 'mog-kalmanovich',
    source: 'semion-mogilevich', target: 'shabtai-kalmanovich',
    type: 'intelligence', strength: 2,
    description: 'Shabtai Kalmanovich provides Israeli passports for Mogilevich associates, leveraging Israeli government connections. Co-partner in Moskva Spartak basketball team.'
  }),

  // Solntsevskaya internal
  makeConnection({
    id: 'mikhailov-averin',
    source: 'sergei-mikhailov-sol', target: 'viktor-averin',
    type: 'co-conspirator', strength: 3,
    description: 'Co-leaders of the Solntsevskaya Organization, Moscow\'s largest OC group (~230–1,000 members).'
  }),
  makeConnection({
    id: 'mikhailov-ivankov',
    source: 'sergei-mikhailov-sol', target: 'vyacheslav-ivankov',
    type: 'co-conspirator', strength: 2,
    description: 'Co-owners of Arbat International in Moscow. Ivankov was the most influential Eurasian criminal before his 1995 arrest.'
  }),

  // US operations
  makeConnection({
    id: 'fisherman-bogatin',
    source: 'igor-fisherman', target: 'jacob-bogatin',
    type: 'co-conspirator', strength: 2,
    description: 'President and Group VP of YBM Magnex — Mogilevich\'s primary US financial front in Newtown, Pennsylvania.'
  }),
  makeConnection({
    id: 'fisherman-ubiriya',
    source: 'igor-fisherman', target: 'vahtang-ubiriya',
    type: 'financial', strength: 2,
    description: 'Fisherman is the commercial middleman between Mogilevich and Ubiriya, coordinating criminal activities across multiple countries.'
  }),
  makeConnection({
    id: 'v-berkovich-o-berkovich',
    source: 'vladimir-berkovich-mog', target: 'oleg-berkovich',
    type: 'co-conspirator', strength: 3,
    description: 'Father and son. Both Mogilevich relatives in Los Angeles involved in criminal activities.'
  }),
  makeConnection({
    id: 'yarmolkin-mog-la',
    source: 'leib-yarmolkin', target: 'vladimir-berkovich-mog',
    type: 'co-conspirator', strength: 1,
    description: 'Both operate in Mogilevich\'s Los Angeles orbit — Yarmolkin at FNJ Trade, Berkovich at Palm Terrace restaurant.'
  })
];

connectionsToAdd.forEach(c => { if (addConnection(c)) addedConnections++; });

// ============================================================
// PART 5: ENRICH EXISTING THEMES
// ============================================================

console.log('\n=== PART 5: ENRICH EXISTING THEMES ===\n');

if (enrichThemeContent('financial-crimes-money-laundering',
  'The 1996 FBI intelligence report on the Semion Mogilevich Organization documents a massive money laundering infrastructure parallel to and predating Epstein\'s financial networks. Mogilevich\'s organization laundered over $30 million from Europe into the United States through Arigon Ltd. (Channel Islands), using bank accounts in Stockholm, London, New York City, and Geneva. The primary U.S. front companies — FNJ Trade Management (Los Angeles) and YBM Magnex (Newtown, Pennsylvania) — received hundreds of thousands of dollars in wire transfers from Arigon between 1993–1995. YBM Magnex claimed $32.5 million in net sales from a facility incapable of supporting its stated operations. The Balchug Group (Moscow/London/San Diego) and Arbat International (Moscow) provided additional laundering channels. Mogilevich\'s couriers delivered large sums of cash using high-quality false Czech or Slovak passports. The Independent Trade Union Bank (Moscow/Cyprus/Tel Aviv) was allegedly used to launder money for both Colombian and Russian OC groups.'
)) enrichedThemes++;

if (enrichThemeContent('intelligence-connections',
  'The Mogilevich Organization demonstrates deep penetration of intelligence and government structures. In 1995, two colonels from Department P of the Russian Presidential Security Service — Gennadi Lavryenko and Ivan Nikolayevich Voloshenko — traveled to Hungary under commercial cover to meet with Mogilevich, seeking political intelligence for the Russian campaign. Shabtai Kalmanovich, a millionaire Russian emigre with ties to former KGB agents and high-level government officials, provides Israeli passports in short order for Mogilevich and Solntsevskaya associates, suggesting Israeli government connections. Mogilevich\'s lieutenants are trained in intelligence operations and counter-surveillance. Two former Hungarian policemen serve as security coordinators. In the Czech Republic, Mogilevich uses former intelligence informants for disinformation campaigns through the media, targeting the parliamentary speaker and deputy interior minister.'
)) enrichedThemes++;

if (enrichThemeContent('the-trafficking-operation',
  'The FBI\'s 1996 Mogilevich intelligence report documents an extensive prostitution and human trafficking operation spanning Central Europe. Mogilevich runs prostitution operations out of the Black and White Nightclubs in Prague and Budapest — documented by foreign law enforcement as the "centerpiece of his operations in Europe." Russian women are recruited in Kiev and Moscow, provided cover jobs by Alexei Alexandrov, and placed in the market. Bodyguards are provided by Mogilevich and underboss Vitaly Savalovsky. The operation intersects with broader trafficking patterns documented in the Epstein files, sharing characteristics of cross-border recruitment, placement in entertainment venues, and protection by organized crime structures.'
)) enrichedThemes++;

if (enrichThemeContent('international-consequences-fallout',
  'The Mogilevich Organization intelligence report illustrates unprecedented multinational law enforcement cooperation in the 1990s. A November 1994 working group in Moscow — comprising Russian, German, Italian, and U.S. representatives — identified the organization as one of five priority targets. Information came from the Czech Internal Security Service (BIS), Hungarian National Police (HNP), Ukrainian Security Service (SBU), Italian Direzione Investigativa Antimafia (DIA), Czech Federal Criminal Police, the U.S. Intelligence Community (USIC), and Israeli National Police (INP). Coordinated actions included the May 1995 British raid on Arigon offices, the Czech raid on the U Holubu summit, and the FBI\'s arrest of Vyacheslav Ivankov. The Italian DIA confirmed Camorra operations in the Czech Republic in concert with Eurasian groups.'
)) enrichedThemes++;

// ============================================================
// PART 6: CONNECTIONS MAP — ADDITIONAL PEOPLE
// (Source: Ryan Middleton investigative connections map)
// ============================================================

console.log('\n=== PART 6: CONNECTIONS MAP — PEOPLE ===\n');

const SRC2 = 'FBI-Mogilevich'; // same source tag, investigative journalism layer

const connectionsMapPeople = [
  makePerson({
    id: 'vladimir-putin',
    name: 'Vladimir Putin',
    category: 'political',
    subcategory: 'head-of-state',
    summary: 'President of Russia. Personal relationship with Semion Mogilevich since the 1990s, documented in the Melnychenko tapes and Alexander Litvinenko\'s testimony before his assassination. Close relationship with Israeli PM Netanyahu (9 meetings 2015–2018). Gazprom/Rosneft energy interests overlap with Mogilevich\'s control of RosUkrEnergo. Chaired supervisory board of Vnesheconombank (VEB) which invested in Bayrock projects connected to Trump.',
    roleText: 'President of Russia. Personal relationship with Semion Mogilevich since the 1990s (Melnychenko tapes, Litvinenko testimony). Close ties to Netanyahu. Energy interests through Gazprom/Rosneft overlap with Mogilevich\'s RosUkrEnergo. VEB supervisory board chair — VEB invested in Bayrock projects.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'intelligence-connections']
  }),

  makePerson({
    id: 'david-bogatin',
    name: 'David Bogatin',
    aliases: ['Yakov Bogatin\'s brother'],
    category: 'financial',
    subcategory: 'organized-crime',
    summary: 'Key member of the Mogilevich Organization. Bought 5 condos in Trump Tower — all seized by the government for money laundering. Brother of Jacob Bogatin (YBM Magnex VP). Imprisoned in New York State for gasoline tax fraud — evaded millions in state fuel taxes, sentenced to 8 years and $5M restitution. Jumped bail, arrested in Austria. UK sought extradition on bank fraud charges. Sergei Mikhailov (Solntsevskaya) took over Bogatin\'s businesses after extradition.',
    roleText: 'Key Mogilevich Organization member. Bought 5 Trump Tower condos, all seized for money laundering. Imprisoned for gasoline tax fraud ($5M restitution). Brother of Jacob Bogatin (YBM Magnex VP). Businesses taken over by Solntsevskaya after his extradition.\n\n---',
    timelineEventIds: ['1992-ybm-magnex-established'],
    themeIds: [THEME_ID, 'trumpepstein-connections', 'financial-crimes-money-laundering']
  }),

  makePerson({
    id: 'felix-sater',
    name: 'Felix Sater',
    category: 'financial',
    subcategory: 'organized-crime',
    summary: 'Son of Mikhail Sheferovsky, a Mogilevich crime syndicate boss (FBI files). Managing director at Bayrock Group. Senior adviser to Donald Trump — business card read "Senior Adviser to Donald Trump." Co-developed Trump SoHo. Childhood friend of Michael Cohen. FBI cooperating witness who provided information "crucial to national security" (per AG Loretta Lynch). Convicted felon: felony assault (stabbed man with broken glass) and stock fraud. "Brought the people up from Moscow" for Trump projects.',
    roleText: 'Son of Mogilevich syndicate boss Mikhail Sheferovsky. Bayrock managing director and senior adviser to Trump. Co-developed Trump SoHo. FBI cooperating witness. Convicted felon. Childhood friend of Michael Cohen. "Brought the people up from Moscow."\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'tevfik-arif',
    name: 'Tevfik Arif',
    category: 'financial',
    subcategory: 'business',
    summary: 'Founder of Bayrock Group. Co-developed Trump SoHo. Offices on 24th floor of Trump Tower. Spent 17 years in USSR Ministry of Commerce (KGB-linked). Co-arrested on yacht in Turkey in 2010 with Kazakh billionaire Alexander Mashkevitch. Connected to Trans-World Group (metals industry, Aluminum Wars). Bayrock received $50M from FL Group (Iceland) — preferred by wealthy Russians favored by Putin — and investment from VEB (Putin-chaired supervisory board).',
    roleText: 'Bayrock Group founder. Co-developed Trump SoHo. 17 years in USSR Ministry of Commerce. Offices in Trump Tower. VEB and FL Group investments in Bayrock.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'roy-cohn',
    name: 'Roy Cohn',
    category: 'legal',
    subcategory: 'mob-attorney',
    summary: 'Personal attorney to Donald Trump from the 1970s. Mob consigliere for both the Gambino and Genovese crime families. Clients included Fat Tony Salerno (Genovese boss), Paul Castellano (Gambino boss), and Carlo Gambino. Brokered the meeting between Trump and Salerno in 1983 that led to S&A Concrete building Trump Tower and Trump Plaza. Former chief counsel to Senator Joseph McCarthy. Personal friend of J. Edgar Hoover. John Cody bragged about dealing with Trump "through Roy Cohn." Attorney for both Fred and Donald Trump.',
    roleText: 'Trump\'s attorney from the 1970s. Mob consigliere for Gambino and Genovese families. Brokered Trump-Salerno meeting (1983). McCarthy chief counsel. Hoover friend. Five Families connections.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'paul-manafort',
    name: 'Paul Manafort',
    category: 'political',
    subcategory: 'political-operative',
    summary: 'Trump campaign chairman June–August 2016. Worked for Viktor Yanukovych\'s Party of Regions 10+ years, earning $17M+. $850M Drake Hotel deal with Dmytro Firtash — described Firtash as a friend. Firtash admitted getting into business with Mogilevich\'s permission (2008). Gave Trump campaign polling data to Russian intelligence-linked Konstantin Kilimnik. Received $7.35M in management fees from Oleg Deripaska. Bank of Cyprus transactions flagged by FinCEN.',
    roleText: 'Trump campaign chairman (2016). Worked for Yanukovych ($17M+). Drake Hotel deal with Firtash (Mogilevich associate). Gave polling data to Kilimnik (Russian intelligence). Bank of Cyprus transactions flagged.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections', 'political-intelligence-network']
  }),

  makePerson({
    id: 'dmytro-firtash',
    name: 'Dmytro Firtash',
    category: 'financial',
    subcategory: 'oligarch',
    summary: 'Ukrainian oligarch. Admitted to U.S. Ambassador in 2008 that he got into business with Mogilevich\'s permission. DOJ designated him "upper-echelon [associate] of Russian organized crime" in a 115-page filing. Controls RosUkrEnergo — exclusive Russian gas intermediary supplying Ukraine via Gazprom. $850M Drake Hotel deal with Paul Manafort. Major financial backer of Viktor Yanukovych. Business partner of Serhiy Lyovochkin in gas sector. Connected to Rudy Giuliani through Lev Parnas/Igor Fruman (Parnas employed by Firtash legal team). Vasily Anisimov helped pay $172M bail.',
    roleText: 'Ukrainian oligarch. Admitted Mogilevich connection to U.S. Ambassador (2008). DOJ: "upper-echelon associate of Russian organized crime." Controls RosUkrEnergo. Drake Hotel deal with Manafort. Yanukovych backer.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'financial-crimes-money-laundering']
  }),

  makePerson({
    id: 'michael-cohen',
    name: 'Michael Cohen',
    category: 'legal',
    subcategory: 'political-operative',
    summary: 'Trump\'s fixer attorney. Family owned El Caribe Country Club in Brooklyn — a known Russian mob hangout. Childhood friend of Felix Sater (son of Mogilevich syndicate boss). Through Sater and Bayrock, Cohen connects the Trump orbit directly to the Mogilevich network.',
    roleText: 'Trump fixer attorney. Family owned El Caribe (Russian mob hangout). Childhood friend of Felix Sater (Mogilevich syndicate connection).\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'fred-trump',
    name: 'Fred Trump',
    category: 'financial',
    subcategory: 'real-estate',
    summary: 'Donald Trump\'s father. 25% partnership with Willie Tomasello in Beach Haven — Tomasello was a Genovese and Gambino associate. Attorney Roy Cohn represented both Trumps and the Five Families. Brooklyn Democratic power broker Meade Esposito called Fred "Tomasello\'s partner." Louis DiBono (Gambino soldier, later murdered) invested in 4 Tomasello projects. FHA fraud: 1954 Senate investigation found Fred overcharged $3.7M from veteran housing funds. Brad Zackson was his exclusive property broker — later partnered with Manafort on Drake Hotel deal.',
    roleText: 'Donald Trump\'s father. Partner with Willie Tomasello (Genovese/Gambino associate). FHA fraud ($3.7M). Roy Cohn attorney. Brad Zackson broker connection to Manafort.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'viktor-orban',
    name: 'Viktor Orbán',
    category: 'political',
    subcategory: 'head-of-state',
    summary: 'Prime Minister of Hungary. Alleged kompromat video from the 1990s held by Mogilevich — who was based in Budapest during this period. Met Putin at 2009 United Russia convention, became key Putin supporter in EU. Interior Minister Sándor Pintér allegedly received 10,000 DM/month from Mogilevich network. Dietmar Clodo witnessed suitcase-of-cash incident and testified under oath. Rosatom Paks II nuclear deal with no bidding process. Political ally of Trump — visited Mar-a-Lago. Andrei Skoch (Solntsevo mafia) funded Russian monuments in Budapest.',
    roleText: 'Hungarian PM. Alleged Mogilevich kompromat. Putin ally. Interior Minister allegedly paid by Mogilevich network. Rosatom nuclear deal. Trump political ally.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'political-intelligence-network']
  }),

  makePerson({
    id: 'fat-tony-salerno',
    name: 'Anthony "Fat Tony" Salerno',
    aliases: ['Fat Tony'],
    category: 'other',
    subcategory: 'organized-crime',
    summary: 'Boss of the Genovese crime family. Client of Roy Cohn. Met with Donald Trump in 1983 through Cohn. Co-owner of S&A Concrete, the mob-controlled company that built Trump Tower and Trump Plaza. S&A Concrete was a joint venture of the Genovese and Gambino families. Connected to Trump through concrete deliveries and construction contracts.',
    roleText: 'Genovese boss. Roy Cohn client. Met Trump 1983. S&A Concrete built Trump Tower and Trump Plaza.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'paul-castellano',
    name: 'Paul Castellano',
    category: 'other',
    subcategory: 'organized-crime',
    summary: 'Boss of the Gambino crime family. Client of Roy Cohn. Co-owner of S&A Concrete alongside Fat Tony Salerno. S&A Concrete built Trump Tower and Trump Plaza. Murdered in 1985 outside Sparks Steak House in Manhattan — succeeded by John Gotti.',
    roleText: 'Gambino boss. Roy Cohn client. Co-owner S&A Concrete (built Trump Tower). Murdered 1985.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'john-cody',
    name: 'John Cody',
    category: 'other',
    subcategory: 'organized-crime',
    summary: 'Mob-connected head of Teamsters Local 282. Controlled concrete deliveries to Trump Tower. Bragged about dealing with Trump "through Roy Cohn." His girlfriend Verina Hixon was given an apartment directly below Trump\'s penthouse in Trump Tower. Previously worked with Fred Trump on construction projects.',
    roleText: 'Teamsters Local 282 boss. Controlled Trump Tower concrete deliveries. Dealt with Trump "through Roy Cohn." Girlfriend housed in Trump Tower.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'tamir-sapir',
    name: 'Tamir Sapir',
    category: 'financial',
    subcategory: 'real-estate',
    summary: 'Trump SoHo co-developer. Business partner of Semion Kislin, who has documented KGB links. Connected to the broader network of Russian-linked investors in Trump properties.',
    roleText: 'Trump SoHo co-developer. Business partner of Semion Kislin (KGB link).\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'alexander-litvinenko',
    name: 'Alexander Litvinenko',
    category: 'intelligence',
    subcategory: 'intelligence-defector',
    summary: 'Russian FSB defector. Held a press conference claiming Russia had been taken over by the mob. Shortly before his assassination, testified that Mogilevich had a "good relationship" with Vladimir Putin from the 1990s. Killed in the UK by the FSB using polonium-210 in 2006 — a clear state-sponsored assassination. His testimony is a primary source connecting Mogilevich to the Russian state.',
    roleText: 'FSB defector. Testified about Mogilevich-Putin relationship. Assassinated by FSB with polonium-210 in UK (2006).\n\n---',
    timelineEventIds: ['2006-litvinenko-assassination'],
    themeIds: [THEME_ID, 'intelligence-connections']
  }),

  makePerson({
    id: 'jan-kuciak',
    name: 'Ján Kuciak',
    category: 'media',
    subcategory: 'investigative-journalist',
    summary: 'Slovak investigative journalist who probed Mogilevich-linked corruption networks involving Slovak politicians and Italian organized crime (\'Ndrangheta). Reported that PM Robert Fico\'s senior aide Mária Trošková had business links with Antonino Vadalà, an Italian entrepreneur tied to \'Ndrangheta schemes in Slovakia. Murdered in 2018 — his death triggered mass protests and Fico\'s resignation. One of three investigators of the Mogilevich network who died: Litvinenko (poisoned), Robert Levin (FBI, died in Iran), and Kuciak (murdered).',
    roleText: 'Slovak investigative journalist. Probed Mogilevich-Fico-\'Ndrangheta connections. Murdered 2018, triggering mass protests and PM resignation.\n\n---',
    timelineEventIds: ['2018-kuciak-murder'],
    themeIds: [THEME_ID, 'media-congressional-investigations']
  }),

  makePerson({
    id: 'robert-fico',
    name: 'Robert Fico',
    category: 'political',
    subcategory: 'head-of-state',
    summary: 'Prime Minister of Slovakia. Connected to Mogilevich network through associates including Anatoly Kulachenko, Igor Fisherman, and other operatives. Senior aide Mária Trošková had business links to \'Ndrangheta-connected Antonino Vadalà. Italian prosecution records showed phone contact between Fico and Vadalà in 2012. Businessman Marián Kočner (linked to Kuciak murder probe) referred to Fico as "the boss." Dozens of Fico-linked officials convicted of corruption since 2018. Upon return to power, abolished Slovakia\'s special anti-corruption prosecutor office.',
    roleText: 'Slovak PM. Linked to Mogilevich operatives. Aide connected to \'Ndrangheta. Kuciak murder investigation linked to his circle. Anti-corruption office abolished upon return to power.\n\n---',
    timelineEventIds: ['2018-kuciak-murder'],
    themeIds: [THEME_ID, 'political-intelligence-network']
  }),

  makePerson({
    id: 'oleg-deripaska',
    name: 'Oleg Deripaska',
    category: 'financial',
    subcategory: 'oligarch',
    summary: 'Russian billionaire. Paid $7.35M in management fees to Paul Manafort. Connected to Putin through aluminum industry and political influence operations. Part of the broader Russian oligarch network overlapping with Mogilevich\'s financial operations.',
    roleText: 'Russian billionaire. $7.35M to Manafort. Putin-connected aluminum magnate.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'financial-crimes-money-laundering']
  }),

  makePerson({
    id: 'konstantin-kilimnik',
    name: 'Konstantin Kilimnik',
    category: 'intelligence',
    subcategory: 'intelligence-linked',
    summary: 'Russian intelligence-linked political operative. Received Trump campaign polling data from Paul Manafort during the 2016 presidential campaign. Connected to the Manafort-Firtash-Mogilevich network through Ukrainian political operations.',
    roleText: 'Russian intelligence-linked operative. Received Trump campaign polling data from Manafort.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'intelligence-connections']
  }),

  makePerson({
    id: 'alexander-mashkevitch',
    name: 'Alexander Mashkevitch',
    category: 'financial',
    subcategory: 'oligarch',
    summary: 'Kazakh billionaire. Co-arrested with Tevfik Arif on a yacht in Turkey in 2010. Funded Bayrock Group, which co-developed Trump SoHo and had offices in Trump Tower. Connected to Trans-World Group and the Aluminum Wars.',
    roleText: 'Kazakh billionaire. Funded Bayrock. Co-arrested with Arif (2010). Connected to Trump SoHo development.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'financial-crimes-money-laundering']
  }),

  makePerson({
    id: 'andrei-skoch',
    name: 'Andrei Skoch',
    category: 'political',
    subcategory: 'oligarch',
    summary: 'Solntsevo mafia associate. Russian Duma member. Funded Russian monuments in Budapest during the period Mogilevich was based there. Part of the Solntsevskaya-Mogilevich network overlap in Hungary.',
    roleText: 'Solntsevo mafia associate. Russian Duma member. Funded Russian monuments in Budapest.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID]
  }),

  makePerson({
    id: 'christopher-wray',
    name: 'Christopher Wray',
    category: 'law-enforcement',
    subcategory: 'fbi-director',
    summary: 'Appointed FBI Director by Donald Trump. Former litigation partner at King & Spalding, which represented Gazprom, Rosneft, Sberbank, Alfa Bank, and ExxonMobil. Personal attorney for Chris Christie during Bridgegate. A Russia-related case was removed from his firm bio in January 2017 before his nomination. King & Spalding\'s client relationship with Gazprom connects Wray to Firtash\'s RosUkrEnergo intermediary, and through Firtash to the Mogilevich network.',
    roleText: 'FBI Director (Trump appointee). Former King & Spalding partner — firm represented Gazprom, Rosneft, Sberbank, Alfa Bank. Russia-related case removed from bio before nomination.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'rex-tillerson',
    name: 'Rex Tillerson',
    category: 'political',
    subcategory: 'cabinet',
    summary: 'Trump\'s Secretary of State. Former CEO of ExxonMobil, which had a pending $500 billion deal with Rosneft (Russia\'s state oil company). King & Spalding (Christopher Wray\'s firm) represented both Rosneft and ExxonMobil. The Rosneft connection links Tillerson to the broader Russian energy network that overlaps with Mogilevich\'s controlled interests through RosUkrEnergo and Gazprom.',
    roleText: 'Trump Secretary of State. Former ExxonMobil CEO with pending $500B Rosneft deal. Energy network overlap with Mogilevich interests.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'viktor-yanukovych',
    name: 'Viktor Yanukovych',
    category: 'political',
    subcategory: 'head-of-state',
    summary: 'Former President of Ukraine. Paul Manafort worked for his Party of Regions for 10+ years, earning $17M+. Major financial backer Dmytro Firtash admitted getting into business with Mogilevich\'s permission. Fled to Russia in 2014 after the Euromaidan revolution. His administration represented the intersection of Ukrainian oligarch money, Russian-aligned politics, and organized crime connections.',
    roleText: 'Former Ukrainian President. Manafort worked for his Party of Regions ($17M+). Backed by Firtash (Mogilevich associate). Fled to Russia 2014.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'political-intelligence-network']
  }),

  makePerson({
    id: 'rudy-giuliani',
    name: 'Rudy Giuliani',
    category: 'legal',
    subcategory: 'political-operative',
    summary: 'Former NYC mayor and Trump personal attorney. Connected to Dmytro Firtash (Mogilevich associate) through Lev Parnas and Igor Fruman, who were employed by Firtash\'s legal team. Parnas and Fruman funneled $50K into Trump\'s inaugural through Sam Patten. The Giuliani-Parnas-Firtash chain connects Trump\'s legal orbit to the Mogilevich network via Firtash\'s admitted organized crime associations.',
    roleText: 'Trump personal attorney. Connected to Firtash (Mogilevich associate) through Parnas/Fruman. Ukrainian venture connections.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'lev-parnas',
    name: 'Lev Parnas',
    category: 'other',
    subcategory: 'political-operative',
    summary: 'Soviet-born associate of Rudy Giuliani. Employed by Dmytro Firtash\'s legal team. Along with Igor Fruman, served as intermediary connecting Giuliani to Ukrainian interests. Funneled $50K into Trump inaugural through Sam Patten. Convicted on campaign finance charges. His employment by Firtash (who admitted Mogilevich connection) links the Trump inaugural to the Mogilevich network.',
    roleText: 'Giuliani associate. Employed by Firtash (Mogilevich associate) legal team. Convicted on campaign finance charges.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'igor-fruman',
    name: 'Igor Fruman',
    category: 'other',
    subcategory: 'political-operative',
    summary: 'Soviet-born associate of Rudy Giuliani and Lev Parnas. Together with Parnas, connected Giuliani to Ukrainian interests and Dmytro Firtash\'s legal orbit. Convicted on campaign finance charges. Part of the intermediary chain linking Trump\'s political network to Firtash and the broader Mogilevich-associated network.',
    roleText: 'Giuliani/Parnas associate. Connected to Firtash orbit. Convicted on campaign finance charges.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'brad-zackson',
    name: 'Brad Zackson',
    category: 'financial',
    subcategory: 'real-estate',
    summary: 'Former exclusive broker for Fred Trump\'s properties. Later partnered with Paul Manafort on the $850M Drake Hotel deal with Dmytro Firtash. This connection creates a direct line from the Trump family\'s real estate operations through Manafort to Firtash, who admitted getting into business with Mogilevich\'s permission.',
    roleText: 'Former exclusive broker for Fred Trump. Drake Hotel partner with Manafort and Firtash (Mogilevich associate).\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'kenneth-shapiro',
    name: 'Kenneth Shapiro',
    category: 'financial',
    subcategory: 'organized-crime',
    summary: 'Financier for the Scarfo crime organization in Atlantic City. Had business dealings with Trump in Atlantic City. Part of the broader organized crime network connected to Trump\'s business operations.',
    roleText: 'Financier for Scarfo crime org. Atlantic City dealings with Trump.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'willie-tomasello',
    name: 'Willie Tomasello',
    category: 'other',
    subcategory: 'organized-crime',
    summary: '25% partner with Fred Trump in Beach Haven housing project. Genovese and Gambino crime family associate. Brooklyn Democratic power broker Meade Esposito (mob-connected) called Fred "Tomasello\'s partner." Louis DiBono, a Gambino soldier later murdered by John Gotti, invested in 4 Tomasello projects. Frank Scalise, a Lucky Luciano drug runner, was a hidden partner in a DiBono company.',
    roleText: 'Fred Trump partner (Beach Haven). Genovese and Gambino associate. 4 projects with Gambino soldier DiBono.\n\n---',
    timelineEventIds: ['1954-fred-trump-fha-fraud'],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'verina-hixon',
    name: 'Verina Hixon',
    category: 'other',
    subcategory: 'associate',
    summary: 'Girlfriend of John Cody, mob-connected Teamsters Local 282 head who controlled concrete deliveries to Trump Tower. Given an apartment directly below Trump\'s penthouse in Trump Tower. Her placement in the building demonstrates the direct physical proximity between Trump and organized crime-connected individuals.',
    roleText: 'John Cody\'s girlfriend. Given Trump Tower apartment directly below Trump\'s penthouse.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'aleksander-torshin',
    name: 'Aleksander Torshin',
    category: 'political',
    subcategory: 'russian-official',
    summary: 'Deputy governor of the Bank of Russia. Documented ties to the Taganskaya organized crime group. A meeting with Trump was planned but ultimately cancelled. Connected to the broader Russian state-OC nexus that includes the Mogilevich network.',
    roleText: 'Deputy governor Bank of Russia. Taganskaya crime ties. Planned Trump meeting (cancelled).\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'intelligence-connections']
  }),

  makePerson({
    id: 'serhiy-lyovochkin',
    name: 'Serhiy Lyovochkin',
    category: 'political',
    subcategory: 'political-operative',
    summary: 'Party of Regions insider and gas sector partner of Dmytro Firtash. Funded the Habsburg Group (Manafort\'s European lobbying operation). Connected to Trump inaugural through Sam Patten. Links the Ukrainian political establishment to the Firtash-Mogilevich financial network.',
    roleText: 'Party of Regions insider. Firtash gas partner. Funded Habsburg Group. Connected to Trump inaugural via Patten.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'political-intelligence-network']
  }),

  makePerson({
    id: 'sam-patten',
    name: 'Sam Patten',
    category: 'other',
    subcategory: 'political-operative',
    summary: 'Funneled $50,000 into Trump\'s inaugural from Serhiy Lyovochkin (Firtash partner, Party of Regions insider). Connected Lyovochkin to the inauguration. Part of the chain linking Ukrainian oligarch money to the Trump political operation.',
    roleText: 'Funneled $50K from Lyovochkin (Firtash partner) into Trump inaugural.\n\n---',
    timelineEventIds: [],
    themeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makePerson({
    id: 'boris-birshtein',
    name: 'Boris Birshtein',
    category: 'financial',
    subcategory: 'oligarch',
    summary: 'Hosted the October 1995 Eurasian OC summit in his office in the diamond center of Tel Aviv. Participants included Semion Mogilevich, Sergei Mikhailov, Viktor Averin, Vadim Rabinovich, Leonid Bilounov, and Arnold Tamm. The meeting discussed sharing of interests in Ukraine. Israeli National Police obtained telephone coverage of hotel rooms.',
    roleText: 'Hosted 1995 Tel Aviv OC summit in diamond center office. Participants: Mogilevich, Mikhailov, Averin.\n\n---',
    timelineEventIds: ['1995-10-tel-aviv-summit'],
    themeIds: [THEME_ID]
  }),

  makePerson({
    id: 'vadim-rabinovich',
    name: 'Vadim Rabinovich',
    category: 'political',
    subcategory: 'oligarch',
    summary: 'Attended the October 1995 Eurasian OC summit in Tel Aviv alongside Mogilevich, Mikhailov, Averin, and Birshtein. The summit discussed sharing of interests in Ukraine. Ukrainian media mogul and politician connected to both Russian and Israeli OC networks.',
    roleText: 'Attended 1995 Tel Aviv OC summit. Ukrainian media mogul/politician.\n\n---',
    timelineEventIds: ['1995-10-tel-aviv-summit'],
    themeIds: [THEME_ID]
  })
];

connectionsMapPeople.forEach(p => { if (addPerson(p)) addedPeople++; });

// Also enrich existing people with connections map context
const trump = findPersonById('donald-trump');
if (trump && !trump.sections.find(s => s.title === 'Mogilevich Network Connections')) {
  trump.sections.push({
    title: 'Mogilevich Network Connections',
    content: 'The Ryan Middleton connections map documents extensive links between Trump and the Mogilevich Organization:\n\n' +
      '**Direct property connections**: David Bogatin (key Mogilevich member) bought 5 Trump Tower condos, all seized for money laundering. Vyacheslav Ivankov (Mogilevich lieutenant) lived at Trump Tower and had Trump Organization phone numbers.\n\n' +
      '**Bayrock Group / Felix Sater**: Felix Sater, whose father Mikhail Sheferovsky was a Mogilevich crime syndicate boss (FBI files), served as senior adviser to Trump and managing director of Bayrock Group. Bayrock co-developed Trump SoHo and had offices in Trump Tower. Sater\'s childhood friend Michael Cohen became Trump\'s fixer attorney. Cohen\'s family owned El Caribe Country Club, a known Russian mob hangout.\n\n' +
      '**Tevfik Arif / Bayrock financing**: Bayrock founder Tevfik Arif spent 17 years in the USSR Ministry of Commerce (KGB-linked). Bayrock received investment from Vnesheconombank (VEB, Putin-chaired supervisory board) and $50M from FL Group (Iceland), preferred by wealthy Russians favored by Putin.\n\n' +
      '**Five Families / Roy Cohn**: Attorney Roy Cohn (mob consigliere for Gambino and Genovese families) brokered Trump\'s meeting with Fat Tony Salerno in 1983. S&A Concrete (Genovese-Gambino joint venture) built Trump Tower and Trump Plaza. John Cody (Teamsters) controlled concrete deliveries and dealt with Trump "through Roy Cohn."\n\n' +
      '**Paul Manafort / Firtash**: Campaign chairman Manafort\'s $850M Drake Hotel deal involved Dmytro Firtash, who admitted getting into business with Mogilevich\'s permission. Manafort gave Trump campaign polling data to Russian intelligence-linked Konstantin Kilimnik.\n\n' +
      '**Fred Trump**: Father Fred Trump was partners with Willie Tomasello (Genovese/Gambino associate) and was investigated by Senate in 1954 for FHA fraud ($3.7M). Brad Zackson, Fred\'s exclusive broker, later partnered with Manafort on the Drake Hotel deal.\n\n---',
    sources: [SRC],
    verificationStatus: 'unverified'
  });
  if (!trump.themeIds.includes(THEME_ID)) trump.themeIds.push(THEME_ID);
  console.log('  ENRICH person: donald-trump (Mogilevich connections section)');
}

const rMaxwell = findPersonById('robert-maxwell');
if (rMaxwell && !rMaxwell.sections.find(s => s.title === 'Mogilevich Passport Connection')) {
  rMaxwell.sections.push({
    title: 'Mogilevich Passport Connection',
    content: 'Robert Maxwell, the British media mogul and Mossad agent, obtained Israeli passports for Semion Mogilevich and his associates in the late 1980s. Maxwell was laundering money for Mossad in the 1980s and his operation became the model for transnational organized crime groups to move money globally.\n\nMaxwell\'s daughter Ghislaine\'s later involvement with Jeffrey Epstein adds another layer: Epstein was a business partner of Ghislaine Maxwell, whose father Robert Maxwell was connected to Mogilevich. This chain connects organized crime, intelligence agencies, and political figures.\n\n---',
    sources: [SRC],
    verificationStatus: 'unverified'
  });
  if (!rMaxwell.themeIds.includes(THEME_ID)) rMaxwell.themeIds.push(THEME_ID);
  console.log('  ENRICH person: robert-maxwell (Mogilevich passport connection)');
}

const wRoss = findPersonById('wilbur-ross');
if (wRoss && !wRoss.sections.find(s => s.title === 'Bank of Cyprus / Russian Money Hub')) {
  wRoss.sections.push({
    title: 'Bank of Cyprus / Russian Money Hub',
    content: 'As Secretary of Commerce under Trump, Wilbur Ross was previously chairman of the Bank of Cyprus — a major hub for Russian organized crime money. Paul Manafort\'s transactions through the bank were flagged by FinCEN. Trump reportedly forbade Ross from answering Senate questions about his Cyprus connections.\n\n---',
    sources: [SRC],
    verificationStatus: 'unverified'
  });
  if (!wRoss.themeIds.includes(THEME_ID)) wRoss.themeIds.push(THEME_ID);
  console.log('  ENRICH person: wilbur-ross (Bank of Cyprus section)');
}

// ============================================================
// PART 7: CONNECTIONS MAP — TIMELINE EVENTS
// ============================================================

console.log('\n=== PART 7: CONNECTIONS MAP — TIMELINE ===\n');

const connectionsMapEvents = [
  makeTimelineEvent({
    id: '1983-trump-salerno-meeting',
    date: '1983',
    dateDisplay: '1983',
    era: 'pre-1990',
    title: 'Roy Cohn Brokers Trump–Fat Tony Salerno Meeting',
    body: 'Attorney Roy Cohn — mob consigliere for both the Gambino and Genovese crime families — brokers a meeting between Donald Trump and Fat Tony Salerno, boss of the Genovese family. This meeting leads to S&A Concrete, a Genovese-Gambino joint venture controlled by Salerno and Paul Castellano (Gambino boss), building Trump Tower and Trump Plaza. John Cody, mob-connected head of Teamsters Local 282, controls concrete deliveries to Trump Tower. Cody\'s girlfriend Verina Hixon is given an apartment directly below Trump\'s penthouse.',
    peopleIds: ['donald-trump', 'roy-cohn', 'fat-tony-salerno', 'paul-castellano', 'john-cody'],
    themeIds: [THEME_ID, 'trumpepstein-connections'],
    tags: ['organized-crime', 'trump-tower', 'five-families'],
    relatedEventIds: [],
    relatedThemeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makeTimelineEvent({
    id: '1984-bogatin-trump-tower-condos',
    date: '1984',
    dateDisplay: '1984',
    era: 'pre-1990',
    title: 'David Bogatin Buys 5 Trump Tower Condos (Seized for Laundering)',
    body: 'David Bogatin, a key member of the Mogilevich Organization and brother of Jacob Bogatin (YBM Magnex VP), purchases five condos in Trump Tower. All five units are later seized by the government for money laundering. Bogatin is imprisoned for gasoline tax fraud — evading millions in state fuel taxes, sentenced to 8 years and $5M restitution. He jumped bail, was arrested in Austria, and the UK sought his extradition on bank fraud charges. After his extradition to the US, Sergei Mikhailov of the Solntsevskaya Organization took over Bogatin\'s businesses.',
    peopleIds: ['david-bogatin', 'donald-trump', 'semion-mogilevich', 'sergei-mikhailov-sol'],
    themeIds: [THEME_ID, 'trumpepstein-connections', 'financial-crimes-money-laundering'],
    tags: ['money-laundering', 'trump-tower', 'seizure'],
    relatedEventIds: ['1992-ybm-magnex-established'],
    relatedThemeIds: [THEME_ID, 'trumpepstein-connections', 'financial-crimes-money-laundering']
  }),

  makeTimelineEvent({
    id: '1990s-ivankov-trump-tower',
    date: '1992',
    dateDisplay: 'Early 1990s',
    era: '1990-2000',
    title: 'Vyacheslav Ivankov Operates from Trump Tower',
    body: 'Vyacheslav Ivankov, Mogilevich\'s lieutenant and the most influential Eurasian criminal in the world, operates from Trump Tower in New York City. He possesses Trump Organization phone numbers. Ivankov co-owns Arbat International with Mogilevich and the Solntsevskaya Organization, and had invested in the Black and White Nightclub prostitution operations. His presence in Trump Tower connects the Mogilevich OC network directly to Trump properties.',
    peopleIds: ['vyacheslav-ivankov', 'donald-trump', 'semion-mogilevich'],
    themeIds: [THEME_ID, 'trumpepstein-connections'],
    tags: ['trump-tower', 'organized-crime'],
    relatedEventIds: ['1995-06-ivankov-arrested', '1984-bogatin-trump-tower-condos'],
    relatedThemeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makeTimelineEvent({
    id: '1954-fred-trump-fha-fraud',
    date: '1954',
    dateDisplay: '1954',
    era: 'pre-1990',
    title: 'Fred Trump Senate Investigation — FHA Fraud',
    body: 'A Senate investigation finds Fred Trump overcharged $3.7 million from veteran housing funds through FHA fraud. Fred Trump\'s 25% partner in Beach Haven was Willie Tomasello, a Genovese and Gambino associate. Brooklyn Democratic power broker Meade Esposito (mob-connected) called Fred "Tomasello\'s partner." Louis DiBono, a Gambino soldier later murdered, invested in 4 Tomasello projects. Fred\'s exclusive property broker Brad Zackson later partnered with Paul Manafort on the Drake Hotel deal with Dmytro Firtash.',
    peopleIds: ['fred-trump', 'donald-trump'],
    themeIds: [THEME_ID, 'trumpepstein-connections'],
    tags: ['fraud', 'five-families'],
    relatedEventIds: ['1983-trump-salerno-meeting'],
    relatedThemeIds: [THEME_ID, 'trumpepstein-connections']
  }),

  makeTimelineEvent({
    id: '1998-ybm-magnex-securities-fraud',
    date: '1998',
    dateDisplay: '1998',
    era: '1990-2000',
    title: 'YBM Magnex $150 Million Securities Fraud Exposed',
    body: 'YBM Magnex International, Mogilevich\'s front company listed on the Toronto Stock Exchange through the PRATECS Technologies acquisition, is exposed as a $150 million securities fraud. FBI surveillance had revealed the Newtown, Pennsylvania facility occupied a small section of a former school building — incapable of supporting the 165 employees or $20 million in sales YBM claimed. The company had grown from $8,573 in projected gross sales in 1993 to claiming $32.5 million in net sales by 1995.',
    peopleIds: ['semion-mogilevich', 'igor-fisherman', 'jacob-bogatin', 'anatoly-kulachenko'],
    themeIds: [THEME_ID, 'financial-crimes-money-laundering'],
    tags: ['securities-fraud', 'ybm-magnex'],
    relatedEventIds: ['1992-ybm-magnex-established'],
    relatedThemeIds: [THEME_ID, 'financial-crimes-money-laundering']
  }),

  makeTimelineEvent({
    id: '1999-bank-of-new-york-laundering',
    date: '1999',
    dateDisplay: '1999',
    era: '1990-2000',
    title: 'Bank of New York $10 Billion Laundering Scheme',
    body: 'The Bank of New York $10 billion money laundering scheme is exposed — one of the largest laundering operations in history. The scheme involved Inkombank and Bank Menatep, Russian financial institutions tied to the broader Mogilevich-Solntsevskaya organized crime financial network. The scale of the operation demonstrates the reach of the financial infrastructure documented in the 1996 FBI intelligence report, which identified Mogilevich\'s bank accounts in New York City, Stockholm, London, and Geneva.',
    peopleIds: ['semion-mogilevich'],
    themeIds: [THEME_ID, 'financial-crimes-money-laundering'],
    tags: ['money-laundering', 'banking', 'bank-of-new-york'],
    relatedEventIds: ['1990-arigon-registered', '1998-ybm-magnex-securities-fraud'],
    relatedThemeIds: [THEME_ID, 'financial-crimes-money-laundering']
  }),

  makeTimelineEvent({
    id: '2006-litvinenko-assassination',
    date: '2006-11-23',
    dateDisplay: 'November 23, 2006',
    era: '2001-2007',
    title: 'Alexander Litvinenko Assassinated with Polonium-210',
    body: 'Former Russian FSB officer Alexander Litvinenko dies in London after being poisoned with polonium-210 — a state-sponsored assassination attributed to the Russian government. Shortly before his death, Litvinenko had testified that Semion Mogilevich had a "good relationship" with Vladimir Putin from the 1990s, and had held a press conference claiming Russia had been taken over by the mob. Litvinenko\'s testimony is a primary source documenting the Mogilevich-Putin relationship. He is one of three known investigators of the Mogilevich network who were killed.',
    peopleIds: ['alexander-litvinenko', 'semion-mogilevich', 'vladimir-putin'],
    themeIds: [THEME_ID, 'intelligence-connections'],
    tags: ['assassination', 'polonium', 'putin', 'witness'],
    relatedEventIds: ['2018-kuciak-murder'],
    relatedThemeIds: [THEME_ID, 'intelligence-connections']
  }),

  makeTimelineEvent({
    id: '2008-firtash-mogilevich-admission',
    date: '2008',
    dateDisplay: '2008',
    era: '2008-2018',
    title: 'Firtash Admits Mogilevich Connection to U.S. Ambassador',
    body: 'Ukrainian oligarch Dmytro Firtash admits to the U.S. Ambassador that he got into business with Mogilevich\'s permission. The DOJ subsequently designates Firtash as an "upper-echelon [associate] of Russian organized crime" in a 115-page filing. Firtash controls RosUkrEnergo, the exclusive Russian gas intermediary supplying Ukraine through Gazprom. He is also connected to Paul Manafort ($850M Drake Hotel deal), Viktor Yanukovych (major backer), and later to Rudy Giuliani through Lev Parnas and Igor Fruman.',
    peopleIds: ['dmytro-firtash', 'semion-mogilevich', 'paul-manafort'],
    themeIds: [THEME_ID, 'financial-crimes-money-laundering'],
    tags: ['firtash', 'mogilevich', 'admission', 'rosukrenergo'],
    relatedEventIds: ['1990-arigon-registered'],
    relatedThemeIds: [THEME_ID, 'financial-crimes-money-laundering']
  }),

  makeTimelineEvent({
    id: '2018-kuciak-murder',
    date: '2018-02-21',
    dateDisplay: 'February 21, 2018',
    era: '2008-2018',
    title: 'Investigative Journalist Ján Kuciak Murdered in Slovakia',
    body: 'Slovak investigative journalist Ján Kuciak is murdered along with his fiancée. Kuciak had been probing alleged fraud and mafia-linked corruption networks involving Slovak PM Robert Fico\'s circle and Italian organized crime (\'Ndrangheta). He reported that Fico\'s senior aide Mária Trošková had business links with Antonino Vadalà, tied to \'Ndrangheta schemes in Slovakia. His murder triggered mass protests and Fico\'s resignation. Kuciak is the third known investigator of the Mogilevich network to be killed, after Alexander Litvinenko (polonium, 2006) and FBI agent Robert Levin (died in Iran under suspicious circumstances).',
    peopleIds: ['jan-kuciak', 'robert-fico', 'semion-mogilevich'],
    themeIds: [THEME_ID, 'media-congressional-investigations'],
    tags: ['murder', 'journalist', 'ndrangheta', 'slovakia'],
    relatedEventIds: ['2006-litvinenko-assassination'],
    relatedThemeIds: [THEME_ID, 'media-congressional-investigations']
  })
];

connectionsMapEvents.forEach(e => { if (addTimelineEvent(e)) addedEvents++; });

// ============================================================
// PART 8: CONNECTIONS MAP — CONNECTIONS
// ============================================================

console.log('\n=== PART 8: CONNECTIONS MAP — CONNECTIONS ===\n');

const connectionsMapConns = [
  // Mogilevich → political/state connections
  makeConnection({
    id: 'mog-putin',
    source: 'semion-mogilevich', target: 'vladimir-putin',
    type: 'intelligence', strength: 3,
    description: 'Personal relationship since 1990s. Documented in Melnychenko tapes and Litvinenko testimony before assassination. Energy interests overlap through Gazprom/RosUkrEnergo.'
  }),
  makeConnection({
    id: 'mog-firtash',
    source: 'semion-mogilevich', target: 'dmytro-firtash',
    type: 'financial', strength: 3,
    description: 'Firtash admitted getting into business with Mogilevich\'s permission (told U.S. Ambassador 2008). DOJ: "upper-echelon associate of Russian organized crime."'
  }),
  makeConnection({
    id: 'mog-orban',
    source: 'semion-mogilevich', target: 'viktor-orban',
    type: 'intelligence', strength: 2,
    description: 'Alleged kompromat video from 1990s. Mogilevich based in Budapest during Orbán\'s rise. Interior Minister Pintér allegedly paid 10,000 DM/month by Mogilevich network.'
  }),
  makeConnection({
    id: 'mog-fico',
    source: 'semion-mogilevich', target: 'robert-fico',
    type: 'intelligence', strength: 2,
    description: 'Connected through organizational operatives. Investigative journalist Kuciak murdered while probing Fico-Mogilevich-\'Ndrangheta corruption networks.'
  }),
  makeConnection({
    id: 'mog-david-bogatin',
    source: 'semion-mogilevich', target: 'david-bogatin',
    type: 'co-conspirator', strength: 3,
    description: 'Key Mogilevich member who bought 5 Trump Tower condos (seized for laundering). Brother of Jacob Bogatin (YBM Magnex VP).'
  }),
  makeConnection({
    id: 'mog-sater',
    source: 'semion-mogilevich', target: 'felix-sater',
    type: 'co-conspirator', strength: 2,
    description: 'Sater\'s father Mikhail Sheferovsky was a Mogilevich crime syndicate boss (FBI files). Sater became Trump adviser through Bayrock Group.'
  }),
  makeConnection({
    id: 'mog-robert-maxwell',
    source: 'semion-mogilevich', target: 'robert-maxwell',
    type: 'intelligence', strength: 2,
    description: 'Robert Maxwell (Mossad agent) obtained Israeli passports for Mogilevich and his associates in the late 1980s. Maxwell\'s money laundering for Mossad became a model for transnational OC.'
  }),

  // Trump → Mogilevich network connections
  makeConnection({
    id: 'trump-bogatin',
    source: 'donald-trump', target: 'david-bogatin',
    type: 'financial', strength: 2,
    description: 'Bogatin (key Mogilevich member) bought 5 condos in Trump Tower, all seized for money laundering.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'trump-ivankov-tower',
    source: 'donald-trump', target: 'vyacheslav-ivankov',
    type: 'social', strength: 2,
    description: 'Ivankov (Mogilevich lieutenant) lived at Trump Tower and possessed Trump Organization phone numbers.'
  }),
  makeConnection({
    id: 'trump-sater',
    source: 'donald-trump', target: 'felix-sater',
    type: 'employer-employee', strength: 3,
    description: 'Sater served as senior adviser to Trump (business card: "Senior Adviser to Donald Trump"). Managing director of Bayrock which co-developed Trump SoHo. Son of Mogilevich syndicate boss.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'trump-arif',
    source: 'donald-trump', target: 'tevfik-arif',
    type: 'financial', strength: 3,
    description: 'Arif\'s Bayrock Group co-developed Trump SoHo. Bayrock offices on 24th floor of Trump Tower. Arif spent 17 years in USSR Ministry of Commerce.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'trump-cohn',
    source: 'donald-trump', target: 'roy-cohn',
    type: 'legal-representation', strength: 3,
    description: 'Personal attorney from 1970s. Mob consigliere for Gambino and Genovese families. Brokered Trump-Salerno meeting (1983).',
    verification: 'verified'
  }),
  makeConnection({
    id: 'trump-manafort',
    source: 'donald-trump', target: 'paul-manafort',
    type: 'employer-employee', strength: 3,
    description: 'Campaign chairman June–August 2016. Connected to Firtash ($850M Drake deal), who admitted Mogilevich connection. Gave polling data to Russian intel-linked Kilimnik.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'trump-salerno',
    source: 'donald-trump', target: 'fat-tony-salerno',
    type: 'financial', strength: 2,
    description: 'Met through Roy Cohn in 1983. S&A Concrete (Salerno/Castellano joint venture) built Trump Tower and Trump Plaza.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'trump-castellano',
    source: 'donald-trump', target: 'paul-castellano',
    type: 'financial', strength: 2,
    description: 'Castellano (Gambino boss) co-owned S&A Concrete which built Trump Tower and Trump Plaza. Connected through Roy Cohn.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'trump-cody',
    source: 'donald-trump', target: 'john-cody',
    type: 'social', strength: 2,
    description: 'Teamsters Local 282 boss controlled concrete deliveries to Trump Tower. Dealt with Trump "through Roy Cohn." Girlfriend given apartment below Trump penthouse.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'trump-cohen-mog',
    source: 'donald-trump', target: 'michael-cohen',
    type: 'employer-employee', strength: 3,
    description: 'Trump fixer attorney. Family owned El Caribe (Russian mob hangout). Childhood friend of Felix Sater (Mogilevich syndicate connection).',
    verification: 'verified'
  }),
  makeConnection({
    id: 'trump-sapir',
    source: 'donald-trump', target: 'tamir-sapir',
    type: 'financial', strength: 2,
    description: 'Trump SoHo co-developer. Business partner of Semion Kislin (KGB link).',
    verification: 'verified'
  }),

  // Manafort network
  makeConnection({
    id: 'manafort-firtash',
    source: 'paul-manafort', target: 'dmytro-firtash',
    type: 'financial', strength: 3,
    description: '$850M Drake Hotel deal. Firtash described as friend. Both defendants in Tymoshenko lawsuit. Firtash admitted Mogilevich connection.'
  }),
  makeConnection({
    id: 'manafort-kilimnik',
    source: 'paul-manafort', target: 'konstantin-kilimnik',
    type: 'intelligence', strength: 3,
    description: 'Manafort shared Trump campaign polling data with Russian intelligence-linked Kilimnik during 2016 campaign.'
  }),
  makeConnection({
    id: 'manafort-deripaska',
    source: 'paul-manafort', target: 'oleg-deripaska',
    type: 'financial', strength: 2,
    description: 'Deripaska paid $7.35M in management fees to Manafort.'
  }),

  // Sater network
  makeConnection({
    id: 'sater-cohen',
    source: 'felix-sater', target: 'michael-cohen',
    type: 'social', strength: 3,
    description: 'Childhood friends. Cohen\'s family owned El Caribe (Russian mob hangout). Together connected Trump to Russian-linked financing through Bayrock.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'sater-arif',
    source: 'felix-sater', target: 'tevfik-arif',
    type: 'employer-employee', strength: 3,
    description: 'Sater was managing director at Bayrock. "Arif was the boss." Together co-developed Trump SoHo.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'arif-mashkevitch',
    source: 'tevfik-arif', target: 'alexander-mashkevitch',
    type: 'financial', strength: 2,
    description: 'Mashkevitch funded Bayrock. Co-arrested on yacht in Turkey 2010.'
  }),

  // Roy Cohn → Five Families
  makeConnection({
    id: 'cohn-salerno',
    source: 'roy-cohn', target: 'fat-tony-salerno',
    type: 'legal-representation', strength: 3,
    description: 'Client relationship. Brokered meeting between Salerno and Trump in 1983.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'cohn-castellano',
    source: 'roy-cohn', target: 'paul-castellano',
    type: 'legal-representation', strength: 3,
    description: 'Client relationship. Castellano co-owned S&A Concrete with Salerno.',
    verification: 'verified'
  }),

  // Fred Trump
  makeConnection({
    id: 'fred-trump-donald',
    source: 'fred-trump', target: 'donald-trump',
    type: 'social', strength: 3,
    description: 'Father and son. Fred\'s mob connections (Tomasello, Cohn, FHA fraud) established the pattern of organized crime associations.',
    verification: 'verified'
  }),

  // Israel / Maxwell chain
  makeConnection({
    id: 'robert-maxwell-ghislaine-mog',
    source: 'robert-maxwell', target: 'ghislaine-maxwell',
    type: 'social', strength: 3,
    description: 'Father and daughter. Robert (Mossad agent) obtained passports for Mogilevich. Ghislaine\'s involvement with Epstein connects organized crime, intelligence, and political figures.',
    verification: 'verified'
  }),

  // Litvinenko
  makeConnection({
    id: 'litvinenko-mogilevich',
    source: 'alexander-litvinenko', target: 'semion-mogilevich',
    type: 'intelligence', strength: 2,
    description: 'Litvinenko testified about Mogilevich-Putin relationship before his assassination with polonium-210. Primary source for the Mogilevich-state connection.'
  }),

  // Firtash → Putin
  makeConnection({
    id: 'firtash-putin',
    source: 'dmytro-firtash', target: 'vladimir-putin',
    type: 'financial', strength: 2,
    description: 'Sweetheart gas deals brokered by Putin associates at Gazprom. RosUkrEnergo intermediary controlled by Firtash.'
  }),

  // Orbán → Putin
  makeConnection({
    id: 'orban-putin',
    source: 'viktor-orban', target: 'vladimir-putin',
    type: 'social', strength: 2,
    description: 'Met at 2009 United Russia convention. Key Putin supporter in EU. Rosatom Paks II nuclear deal. Energy dependency through South Stream/TurkStream.'
  }),

  // Kuciak
  makeConnection({
    id: 'kuciak-fico',
    source: 'jan-kuciak', target: 'robert-fico',
    type: 'social', strength: 2,
    description: 'Kuciak investigated Fico\'s \'Ndrangheta connections. His murder triggered mass protests and Fico\'s resignation.',
    verification: 'verified'
  }),

  // Christopher Wray / King & Spalding
  makeConnection({
    id: 'trump-wray',
    source: 'donald-trump', target: 'christopher-wray',
    type: 'employer-employee', strength: 2,
    description: 'Trump appointed Wray as FBI Director. Wray\'s former firm King & Spalding represented Gazprom, Rosneft, Sberbank, and Alfa Bank.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'trump-tillerson',
    source: 'donald-trump', target: 'rex-tillerson',
    type: 'employer-employee', strength: 2,
    description: 'Trump appointed Tillerson as Secretary of State. Tillerson\'s ExxonMobil had a pending $500B deal with Rosneft.',
    verification: 'verified'
  }),

  // Giuliani / Parnas / Fruman / Firtash chain
  makeConnection({
    id: 'giuliani-parnas',
    source: 'rudy-giuliani', target: 'lev-parnas',
    type: 'co-conspirator', strength: 3,
    description: 'Parnas was Giuliani\'s key associate for Ukrainian ventures. Parnas was also employed by Firtash\'s legal team.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'parnas-fruman',
    source: 'lev-parnas', target: 'igor-fruman',
    type: 'co-conspirator', strength: 3,
    description: 'Parnas and Fruman operated together as intermediaries connecting Giuliani to Ukrainian interests. Both convicted on campaign finance charges.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'parnas-firtash',
    source: 'lev-parnas', target: 'dmytro-firtash',
    type: 'employer-employee', strength: 2,
    description: 'Parnas was employed by Firtash\'s legal team. Firtash admitted getting into business with Mogilevich\'s permission.'
  }),
  makeConnection({
    id: 'trump-giuliani',
    source: 'donald-trump', target: 'rudy-giuliani',
    type: 'legal-representation', strength: 3,
    description: 'Giuliani served as Trump\'s personal attorney. Connected to Firtash (Mogilevich associate) through Parnas/Fruman.',
    verification: 'verified'
  }),

  // Manafort deeper network
  makeConnection({
    id: 'manafort-yanukovych',
    source: 'paul-manafort', target: 'viktor-yanukovych',
    type: 'employer-employee', strength: 3,
    description: 'Manafort worked for Yanukovych\'s Party of Regions 10+ years, earning $17M+.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'manafort-zackson',
    source: 'paul-manafort', target: 'brad-zackson',
    type: 'financial', strength: 2,
    description: 'Drake Hotel deal partners. Zackson was formerly Fred Trump\'s exclusive property broker.'
  }),
  makeConnection({
    id: 'firtash-yanukovych',
    source: 'dmytro-firtash', target: 'viktor-yanukovych',
    type: 'financial', strength: 3,
    description: 'Firtash was a major financial backer of Yanukovych. Both connected to Party of Regions and Ukrainian energy sector.'
  }),
  makeConnection({
    id: 'firtash-lyovochkin',
    source: 'dmytro-firtash', target: 'serhiy-lyovochkin',
    type: 'financial', strength: 2,
    description: 'Business partners in gas sector. Lyovochkin funded Habsburg Group (Manafort\'s European lobbying).'
  }),
  makeConnection({
    id: 'patten-lyovochkin',
    source: 'sam-patten', target: 'serhiy-lyovochkin',
    type: 'financial', strength: 2,
    description: 'Patten funneled $50K from Lyovochkin into Trump inaugural, connecting Ukrainian oligarch money to the inauguration.'
  }),

  // Fred Trump deeper network
  makeConnection({
    id: 'fred-trump-tomasello',
    source: 'fred-trump', target: 'willie-tomasello',
    type: 'financial', strength: 3,
    description: '25% partnership in Beach Haven. Tomasello was a Genovese and Gambino associate.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'fred-trump-cohn',
    source: 'fred-trump', target: 'roy-cohn',
    type: 'legal-representation', strength: 3,
    description: 'Cohn represented both Fred and Donald Trump, while also serving as consigliere for Gambino and Genovese families.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'fred-trump-zackson',
    source: 'fred-trump', target: 'brad-zackson',
    type: 'employer-employee', strength: 2,
    description: 'Zackson was Fred Trump\'s exclusive property broker. Later partnered with Manafort on Drake Hotel deal with Firtash.',
    verification: 'verified'
  }),
  makeConnection({
    id: 'cody-hixon',
    source: 'john-cody', target: 'verina-hixon',
    type: 'social', strength: 3,
    description: 'Hixon was Cody\'s girlfriend. Given apartment directly below Trump\'s penthouse in Trump Tower.',
    verification: 'verified'
  }),

  // Tel Aviv summit attendees
  makeConnection({
    id: 'mog-birshtein',
    source: 'semion-mogilevich', target: 'boris-birshtein',
    type: 'co-conspirator', strength: 2,
    description: 'Birshtein hosted the October 1995 OC summit in his Tel Aviv diamond center office. Summit discussed sharing interests in Ukraine.'
  }),
  makeConnection({
    id: 'mog-rabinovich',
    source: 'semion-mogilevich', target: 'vadim-rabinovich',
    type: 'co-conspirator', strength: 2,
    description: 'Rabinovich attended the 1995 Tel Aviv OC summit alongside Mogilevich, Mikhailov, and Averin.'
  })
];

connectionsMapConns.forEach(c => { if (addConnection(c)) addedConnections++; });

// ============================================================
// PART 9: ENRICH THEME WITH CONNECTIONS MAP CONTEXT
// ============================================================

console.log('\n=== PART 9: CONNECTIONS MAP — THEME ENRICHMENT ===\n');

// Enrich the Mogilevich theme with the connections map context
const mogTheme = findThemeById(THEME_ID);
if (mogTheme && !mogTheme.content.includes('Trump Tower')) {
  mogTheme.content = mogTheme.content.replace(/\n*---\s*$/, '');
  mogTheme.content += '\n\n## Connections Map — Extended Network (Ryan Middleton Investigation)\n\n' +
    '### Trump Tower & Real Estate Nexus\n\n' +
    'David Bogatin, a key Mogilevich Organization member, purchased five condos in Trump Tower — all subsequently seized by the government for money laundering. Vyacheslav Ivankov, Mogilevich\'s lieutenant and the most influential Eurasian criminal of the era, lived at Trump Tower and possessed Trump Organization phone numbers. Felix Sater, whose father Mikhail Sheferovsky was a Mogilevich syndicate boss (FBI files), served as senior adviser to Trump and managing director of Bayrock Group, which co-developed Trump SoHo from offices on the 24th floor of Trump Tower.\n\n' +
    '### Bayrock Group — Russian Financing Pipeline\n\n' +
    'Bayrock Group, founded by Tevfik Arif (17 years in USSR Ministry of Commerce, KGB-linked), channeled Russian money into Trump projects. Bayrock received investment from Vnesheconombank (VEB, Putin-chaired supervisory board) and $50M from FL Group (Iceland). Felix Sater "brought the people up from Moscow." Kazakh billionaire Alexander Mashkevitch also funded Bayrock and was co-arrested with Arif on a yacht in Turkey in 2010.\n\n' +
    '### Five Families — Roy Cohn Bridge\n\n' +
    'Attorney Roy Cohn served as mob consigliere for both the Gambino and Genovese families while simultaneously representing both Fred and Donald Trump. In 1983, Cohn brokered a meeting between Trump and Fat Tony Salerno (Genovese boss), leading to S&A Concrete — a Genovese-Gambino joint venture — building Trump Tower and Trump Plaza. Fred Trump\'s earlier partnership with Willie Tomasello (Genovese/Gambino associate) established the pattern. Mogilevich\'s network connected to all Five Families through Russian OC expansion in the 1990s.\n\n' +
    '### Israel-Mossad-Maxwell Connection\n\n' +
    'Robert Maxwell, the British media mogul and Mossad agent, obtained Israeli passports for Mogilevich and his associates in the late 1980s. Maxwell\'s money laundering for Mossad became the model for transnational OC money movement. His daughter Ghislaine\'s later involvement with Jeffrey Epstein creates a chain: Epstein → Ghislaine Maxwell → Robert Maxwell → Mogilevich, connecting organized crime, intelligence agencies, and political figures. Anatoly Katrich, a senior Mogilevich operative, relocated to Israel after expulsion from the Czech Republic, placing an active arm of the organization in Israel during Netanyahu\'s political rise (PM 1996).\n\n' +
    '### Energy & Banking Network\n\n' +
    'Mogilevich controlled energy interests through RosUkrEnergo. The Bank of New York $10 billion laundering scheme involved Inkombank and Bank Menatep — Russian financial institutions tied to the Mogilevich-Solntsevskaya network. Wilbur Ross (Trump\'s Commerce Secretary) chaired the Bank of Cyprus, a major Russian money hub where Manafort transactions were flagged. Gazprom and Rosneft (both represented by Christopher Wray\'s firm King & Spalding) connect to the network through Firtash and Tillerson.\n\n' +
    '### Dead Investigators\n\n' +
    'Three investigators of the Mogilevich network are known to have died: Alexander Litvinenko (FSB defector, poisoned with polonium-210 in London, 2006 — testified about Mogilevich-Putin relationship), FBI agent Robert Levin (died under suspicious circumstances in Iran while investigating Mogilevich\'s enriched uranium deal), and Slovak journalist Ján Kuciak (murdered 2018 while probing Fico-Mogilevich-\'Ndrangheta connections — triggered mass protests and PM resignation).\n\n---';

  // Add new peopleIds
  const newPeopleForTheme = ['vladimir-putin', 'david-bogatin', 'felix-sater', 'tevfik-arif',
    'roy-cohn', 'paul-manafort', 'dmytro-firtash', 'michael-cohen', 'fred-trump',
    'viktor-orban', 'fat-tony-salerno', 'paul-castellano', 'john-cody', 'alexander-litvinenko',
    'jan-kuciak', 'robert-fico', 'oleg-deripaska', 'konstantin-kilimnik', 'alexander-mashkevitch',
    'christopher-wray', 'rex-tillerson', 'viktor-yanukovych', 'rudy-giuliani',
    'lev-parnas', 'igor-fruman', 'brad-zackson', 'kenneth-shapiro', 'willie-tomasello',
    'verina-hixon', 'aleksander-torshin', 'serhiy-lyovochkin', 'sam-patten',
    'boris-birshtein', 'vadim-rabinovich'];
  newPeopleForTheme.forEach(pid => {
    if (!mogTheme.peopleIds.includes(pid)) mogTheme.peopleIds.push(pid);
  });

  const newEventsForTheme = ['1983-trump-salerno-meeting', '1984-bogatin-trump-tower-condos',
    '1990s-ivankov-trump-tower', '1954-fred-trump-fha-fraud', '1998-ybm-magnex-securities-fraud',
    '1999-bank-of-new-york-laundering', '2006-litvinenko-assassination',
    '2008-firtash-mogilevich-admission', '2018-kuciak-murder'];
  newEventsForTheme.forEach(eid => {
    if (!mogTheme.timelineEventIds.includes(eid)) mogTheme.timelineEventIds.push(eid);
  });

  console.log('  ENRICH theme: ' + THEME_ID + ' (connections map context)');
  enrichedThemes++;
}

// Enrich Trump-Epstein theme with Mogilevich OC connections
enrichThemeContent('trumpepstein-connections',
  'The Ryan Middleton connections map documents how the Mogilevich Organization\'s presence in Trump Tower predates and parallels Epstein\'s social connections to Trump. David Bogatin (key Mogilevich member) purchased 5 Trump Tower condos — all seized for money laundering. Vyacheslav Ivankov (Mogilevich lieutenant, "most influential Eurasian criminal") operated from Trump Tower with Trump Organization phone numbers. Felix Sater, son of Mogilevich syndicate boss Mikhail Sheferovsky, served as "Senior Adviser to Donald Trump" and co-developed Trump SoHo through Bayrock Group. Attorney Roy Cohn bridged Trump to the Five Families (Gambino, Genovese), while Manafort\'s connection to Firtash (who admitted Mogilevich association to the U.S. Ambassador) created another channel between the Trump orbit and Eurasian organized crime.'
);

// ============================================================
// WRITE RESULTS
// ============================================================

console.log('\n=== WRITING FILES ===\n');

fs.writeFileSync(path.join(DATA, 'people.json'), JSON.stringify(people, null, 2));
fs.writeFileSync(path.join(DATA, 'timeline.json'), JSON.stringify(timeline, null, 2));
fs.writeFileSync(path.join(DATA, 'connections.json'), JSON.stringify(connections, null, 2));
fs.writeFileSync(path.join(DATA, 'themes.json'), JSON.stringify(themes, null, 2));

console.log(`\nMogilevich Integration Complete`);
console.log(`  People added:      ${addedPeople}`);
console.log(`  Events added:      ${addedEvents}`);
console.log(`  Connections added:  ${addedConnections}`);
console.log(`  Themes enriched:   ${enrichedThemes}`);
console.log(`  Total people:      ${people.length}`);
console.log(`  Total events:      ${timeline.length}`);
console.log(`  Total connections: ${connections.length}`);
console.log(`  Total themes:      ${themes.length}\n`);
