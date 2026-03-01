#!/usr/bin/env node
/**
 * Trump Misconduct Integration Script
 * Executes Parts 1-10 of CC_TASK_TRUMP_MISCONDUCT_INTEGRATION
 */

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, '..', 'src', 'data');
const timeline = JSON.parse(fs.readFileSync(path.join(DATA, 'timeline.json'), 'utf8'));
const people = JSON.parse(fs.readFileSync(path.join(DATA, 'people.json'), 'utf8'));
const connections = JSON.parse(fs.readFileSync(path.join(DATA, 'connections.json'), 'utf8'));

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function findTimelineById(id) {
  return timeline.find(e => e.id === id);
}

function findTimelineByDate(date) {
  return timeline.filter(e => e.date === date || e.date.startsWith(date));
}

function addTimelineEvent(event) {
  // Check for duplicate
  const existing = findTimelineById(event.id);
  if (existing) {
    console.log(`  SKIP (exists): ${event.id}`);
    return false;
  }
  timeline.push(event);
  console.log(`  ADD: ${event.id}`);
  return true;
}

function enrichTimelineBody(id, additionalText) {
  const event = findTimelineById(id);
  if (!event) {
    console.log(`  WARN: Cannot enrich ${id} - not found`);
    return false;
  }
  // Remove trailing ---
  event.body = event.body.replace(/\n*---\s*$/, '');
  event.body += '\n\n' + additionalText + '\n\n---';
  // Update summary if it's just the body
  if (event.summary && event.summary.length < event.body.length / 2) {
    // Keep existing summary
  }
  console.log(`  ENRICH: ${id}`);
  return true;
}

function addPeopleToEvent(id, newPeopleIds) {
  const event = findTimelineById(id);
  if (!event) return;
  newPeopleIds.forEach(pid => {
    if (!event.peopleIds.includes(pid)) {
      event.peopleIds.push(pid);
    }
  });
}

function addSourcesToEvent(id, newSources) {
  const event = findTimelineById(id);
  if (!event) return;
  newSources.forEach(s => {
    if (!event.sources.includes(s)) {
      event.sources.push(s);
    }
  });
}

function makeTimelineEvent(opts) {
  return {
    id: opts.id,
    date: opts.date,
    dateDisplay: opts.dateDisplay,
    era: opts.era,
    title: opts.title,
    body: opts.body + '\n\n---',
    peopleIds: opts.peopleIds || [],
    themeIds: opts.themeIds || ['trumpepstein-connections'],
    sources: opts.sources || [],
    tags: opts.tags || [],
    summary: opts.summary || opts.body.split('\n')[0].substring(0, 300),
    eftaLinks: opts.eftaLinks || [],
    relatedEventIds: opts.relatedEventIds || [],
    relatedThemeIds: opts.relatedThemeIds || ['trumpepstein-connections'],
    discrepancies: opts.discrepancies || [],
    verificationStatus: opts.verificationStatus || undefined
  };
}

function findPersonById(id) {
  return people.find(p => p.id === id);
}

function makePersonEntry(opts) {
  return {
    id: opts.id,
    name: opts.name,
    category: opts.category || 'victim',
    summary: opts.summary,
    sections: opts.sections || [
      { title: 'Category', content: opts.categoryText || 'Alleged victim / public accuser', sources: [] },
      { title: 'Source files', content: opts.sourceText || 'Trump-Epstein\n\n' + opts.summary + '\n\n---', sources: [] }
    ],
    timelineEventIds: opts.timelineEventIds || [],
    themeIds: opts.themeIds || ['trumpepstein-connections'],
    connectionIds: opts.connectionIds || ['donald-trump'],
    sources: opts.sources || []
  };
}

// ============================================================
// PART 1: TIMELINE ENTRIES
// ============================================================

console.log('\n=== PART 1: TIMELINE ENTRIES ===\n');

// 1. Enrich Trump-Epstein Meet (~1988)
enrichTimelineBody('1988-trump-and-epstein-meet',
  'Epstein bought a mansion two miles north of Mar-a-Lago, which Trump had purchased in 1985. The proximity of their residences anchored the early friendship. (NYT July 19, 2025)'
);
addSourcesToEvent('1988-trump-and-epstein-meet', ['NYT']);

// 2. Enrich 1992 Calendar Girl Party
enrichTimelineBody('1992-mar-a-lago-calendar-girl-competition',
  'In November 1992, NBC News cameras saw Trump and Epstein partying with a group of Buffalo Bills cheerleaders. Trump invited NBC News to film a party he threw for himself and Epstein at Mar-a-Lago. NBC News revealed footage of the party in July 2019, showing Trump, Epstein and the cheerleaders. At one point during the video, Trump grabbed a woman around her waist, pulled her against his body, and patted her buttocks. At another point, Trump appears to tell Epstein: "Look at her, back there... She\'s hot." Trump was seen dancing with a crowd of young women and whispering in Epstein\'s ear. (NBC News, revealed July 2019; NYT July 19, 2025)'
);
addSourcesToEvent('1992-mar-a-lago-calendar-girl-competition', ['NYT', 'CNN']);

// 3. Jill Harth Assault (December 1992 dinner)
addTimelineEvent(makeTimelineEvent({
  id: '1992-12-jill-harth-assault-allegation-dinner',
  date: '1992-12',
  dateDisplay: 'December 1992',
  era: '1990-2000',
  title: 'Jill Harth Assault Allegation (Dinner)',
  body: 'Jill Harth stated that during dinner with Trump and her then-boyfriend George Houraney, Trump attempted to put his hands between her legs. Houraney is the same person who arranged the Trump-Epstein "calendar girl competition" at Mar-a-Lago, connecting Harth\'s allegations directly to the Epstein orbit. (NYT "Crossing the Line" May 2016; Harth v. Trump lawsuit, 1997)',
  peopleIds: ['donald-trump', 'jill-harth', 'george-houraney'],
  sources: ['NYT'],
  tags: ['misconduct', 'mar-a-lago'],
  verificationStatus: 'contested'
}));

// 4. Jill Harth Assault at Mar-a-Lago (January 1993)
addTimelineEvent(makeTimelineEvent({
  id: '1993-01-jill-harth-assault-mar-a-lago',
  date: '1993-01',
  dateDisplay: 'January 1993',
  era: '1990-2000',
  title: 'Jill Harth Assault Allegation at Mar-a-Lago',
  body: 'Harth and Houraney visited Mar-a-Lago for a contract-signing celebration. Trump allegedly offered a tour, then pushed Harth against a wall in Ivanka\'s empty bedroom, "hands all over her," trying to kiss her. She managed to escape. They left rather than stay the night. This occurred at Mar-a-Lago, a key Epstein-related location, and involves the same social circle — Houraney organized events for both Trump and Epstein. (NYT "Crossing the Line" May 2016; Harth v. Trump lawsuit)',
  peopleIds: ['donald-trump', 'jill-harth'],
  sources: ['NYT'],
  tags: ['misconduct', 'mar-a-lago'],
  verificationStatus: 'contested'
}));

// 5. Epstein attends Trump-Maples Wedding (1993)
addTimelineEvent(makeTimelineEvent({
  id: '1993-epstein-attends-trump-maples-wedding',
  date: '1993',
  dateDisplay: '1993',
  era: '1990-2000',
  title: 'Epstein Attends Trump-Maples Wedding',
  body: 'Epstein attended Trump\'s wedding to Marla Maples in 1993. CNN exclusive footage and newly discovered photos/video confirmed Epstein\'s attendance. (CNN exclusive, July 22, 2025)',
  peopleIds: ['jeffrey-epstein', 'donald-trump'],
  sources: ['CNN'],
  tags: ['social']
}));

// 6. Stacey Williams groping (1993)
addTimelineEvent(makeTimelineEvent({
  id: '1993-stacey-williams-groping-allegation',
  date: '1993',
  dateDisplay: '1993',
  era: '1990-2000',
  title: 'Stacey Williams Groping Allegation',
  body: 'Former Sports Illustrated model Stacey Williams alleged Trump groped her in 1993 while Epstein looked on. Williams said Trump and Epstein were "really, really good friends." In 2017, Epstein told journalist Michael Wolff he had been Trump\'s "closest friend for 10 years." Williams was the 27th person to accuse Trump of sexual misconduct. (The Guardian, October 23, 2024)',
  peopleIds: ['donald-trump', 'jeffrey-epstein', 'stacey-williams'],
  sources: ['OSINT'],
  tags: ['misconduct', 'victim']
}));

// 7. Beatrice Keul (1993)
addTimelineEvent(makeTimelineEvent({
  id: '1993-beatrice-keul-groping-allegation',
  date: '1993',
  dateDisplay: '1993',
  era: '1990-2000',
  title: 'Beatrice Keul Groping Allegation at Plaza Hotel',
  body: 'Swiss model Beatrice Keul said Trump groped her in 1993 in his suite at New York\'s Plaza Hotel. The Plaza Hotel was a known Epstein social venue. (Daily Mail, October 30, 2024)',
  peopleIds: ['donald-trump', 'beatrice-keul'],
  sources: ['OSINT'],
  tags: ['misconduct'],
  verificationStatus: 'unverified'
}));

// 8. Enrich Katie Johnson / Jane Doe entry
enrichTimelineBody('2016-04-katie-johnson-lawsuit-filed-and-forwarde',
  'Additional details: April 2016 first filing in California; May 2016 dismissed for not raising valid federal claims; June 2016 refiled in New York as "Jane Doe"; September 2016 refiled again. July 2016 Guardian investigation found lawsuits appeared organized by Norm Lubow, "associated in the past with a range of disputed claims involving celebrities including OJ Simpson and Kurt Cobain." August 2024: Lubow confirmed to Snopes he played a role, filed under false name "Al Taylor." Jane Doe\'s formal declaration: "I loudly pleaded with Defendant Trump to stop, but he did not. Defendant Trump responded to my pleas by violently striking me in the face with his open hand and screaming that he would do whatever he wanted." (Guardian July 2016; Snopes August 2024; court filings)'
);
addPeopleToEvent('2016-04-katie-johnson-lawsuit-filed-and-forwarde', ['norm-lubow']);

// Enrich Katie Johnson dismissal
enrichTimelineBody('2016-11-04-katie-johnson-lawsuit-dismissed',
  'November 2, 2016: a press conference was scheduled at Lisa Bloom\'s office but abruptly canceled due to threats. November 4, 2016: lawsuit withdrawn. Julie K. Brown (2021 book "Perversion of Justice"): Lisa Bloom asserted accuser dropped case on her own, no Trump payoff, and accuser has not contacted Bloom since 2016. (Julie K. Brown, 2021; court records)'
);
addPeopleToEvent('2016-11-04-katie-johnson-lawsuit-dismissed', ['lisa-bloom']);

// 9. Trump flights on Epstein's jet (mid-1990s)
addTimelineEvent(makeTimelineEvent({
  id: '1995-trump-flights-on-epstein-jet',
  date: '1995',
  dateDisplay: 'Mid-1990s',
  era: '1990-2000',
  title: 'Trump Flights on Epstein\'s Private Jet',
  body: 'Court records showed Trump flew on Epstein\'s private jet at least seven times over four years in the 1990s. This is in addition to individual documented flight legs already in the timeline. (Court records; NYT July 19, 2025)',
  peopleIds: ['donald-trump', 'jeffrey-epstein'],
  sources: ['DOJ', 'NYT'],
  tags: ['flight']
}));

// 10. Lisa Boyne dinner allegation (1996)
addTimelineEvent(makeTimelineEvent({
  id: '1996-lisa-boyne-dinner-allegation',
  date: '1996',
  dateDisplay: '1996',
  era: '1990-2000',
  title: 'Lisa Boyne Dinner Allegation',
  body: 'Lisa Boyne alleged Trump made models walk across a table at a dinner, looked under their skirts, and described their underwear. Also present was modeling agent John Casablancas, who is connected to Epstein\'s modeling network through MC2/Jean-Luc Brunel. (HuffPost, October 13, 2016)',
  peopleIds: ['donald-trump'],
  sources: ['OSINT'],
  tags: ['misconduct'],
  verificationStatus: 'unverified'
}));

// 11. Victoria's Secret party (1997)
addTimelineEvent(makeTimelineEvent({
  id: '1997-trump-epstein-victorias-secret-party',
  date: '1997',
  dateDisplay: '1997',
  era: '1990-2000',
  title: 'Trump and Epstein at Victoria\'s Secret "Angels" Party',
  body: 'Trump and Epstein were spotted at a 1997 Victoria\'s Secret "Angels" party in Manhattan. Victoria\'s Secret was owned by Les Wexner, Epstein\'s primary financial patron. The NTOC allegations later named both Trump and Clinton in connection with Victoria\'s Secret models. (NYT July 19, 2025)',
  peopleIds: ['donald-trump', 'jeffrey-epstein', 'leslie-wexner-les-wexner'],
  sources: ['NYT'],
  tags: ['social', 'financial']
}));

// 12. Amy Dorris (1997)
addTimelineEvent(makeTimelineEvent({
  id: '1997-amy-dorris-assault-allegation',
  date: '1997',
  dateDisplay: '1997',
  era: '1990-2000',
  title: 'Amy Dorris Assault Allegation at U.S. Open',
  body: 'Former model Amy Dorris alleged Trump groped and forcibly kissed her at the 1997 U.S. Open. She attended with boyfriend Jason Binn, who described Trump as "his best friend." The Guardian confirmed she told her mother and a friend immediately after the incident. (The Guardian, September 17, 2020)',
  peopleIds: ['donald-trump', 'amy-dorris'],
  sources: ['OSINT'],
  tags: ['misconduct'],
  verificationStatus: 'contested'
}));

// 13. 2002 Trump quote in NY Mag
addTimelineEvent(makeTimelineEvent({
  id: '2002-trump-quote-about-epstein-ny-magazine',
  date: '2002',
  dateDisplay: '2002',
  era: '2001-2007',
  title: 'Trump Quote About Epstein in New York Magazine',
  body: 'Trump told New York Magazine: "I\'ve known Jeff for fifteen years. Terrific guy. He\'s a lot of fun to be with. It is even said that he likes beautiful women as much as I do, and many of them are on the younger side. No doubt about it, Jeffrey enjoys his social life." This quote has been widely cited as evidence Trump was aware of Epstein\'s preference for young women. (New York Magazine, 2002)',
  peopleIds: ['donald-trump', 'jeffrey-epstein'],
  sources: ['NYT'],
  tags: ['social']
}));

// 14. Enrich Trump-Epstein falling out (2004)
enrichTimelineBody('2004-trump-outbids-epstein-for-maison-de-lami',
  'They reportedly became rivals when they both wanted to purchase the same oceanfront mansion in Florida. In another account, they parted ways when Epstein made advances towards the daughter of a Mar-a-Lago member. On July 29, 2025, Trump stated that Epstein "hired away spa attendants from Mar-a-Lago\'s spa," and when asked if one was Virginia Giuffre, stated: "I think so. I think that was one of the people. He stole her." (NYT July 19, 2025; media reports July 29, 2025)'
);
addSourcesToEvent('2004-trump-outbids-epstein-for-maison-de-lami', ['NYT']);
addPeopleToEvent('2004-trump-outbids-epstein-for-maison-de-lami', ['virginia-giuffre-ne-roberts']);

// 15. Access Hollywood tape (2005)
addTimelineEvent(makeTimelineEvent({
  id: '2005-09-access-hollywood-tape-recorded',
  date: '2005-09',
  dateDisplay: 'September 2005',
  era: '2001-2007',
  title: 'Access Hollywood Tape Recorded',
  body: 'Recording of Trump telling Billy Bush: "when you\'re a star, they let you do it. You can do anything... Grab \'em by the pussy." The tape was released publicly on October 8, 2016 by the Washington Post. Multiple subsequent accusers in both Trump misconduct cases and Epstein-related matters cited this tape as their motivation to speak publicly. (Washington Post, October 8, 2016)',
  peopleIds: ['donald-trump'],
  sources: ['OSINT'],
  tags: ['misconduct'],
  verificationStatus: 'verified'
}));

// 16-23. E. Jean Carroll timeline entries
addTimelineEvent(makeTimelineEvent({
  id: '2019-11-04-e-jean-carroll-defamation-lawsuit',
  date: '2019-11-04',
  dateDisplay: 'November 4, 2019',
  era: '2019',
  title: 'E. Jean Carroll Files Defamation Lawsuit Against Trump',
  body: 'Writer E. Jean Carroll filed a defamation lawsuit against Trump after he denied her rape allegation and suggested she was "not my type." Carroll alleged Trump raped her in a Bergdorf Goodman dressing room in 1995 or 1996. (Court records; NYT)',
  peopleIds: ['donald-trump', 'e-jean-carroll'],
  sources: ['NYT'],
  tags: ['legal']
}));

addTimelineEvent(makeTimelineEvent({
  id: '2022-11-e-jean-carroll-battery-suit',
  date: '2022-11',
  dateDisplay: 'November 2022',
  era: '2020-present',
  title: 'E. Jean Carroll Files Battery Suit Under Adult Survivors Act',
  body: 'Carroll filed a battery suit against Trump under New York\'s Adult Survivors Act, which temporarily lifted the statute of limitations for sexual assault claims. (Court records)',
  peopleIds: ['donald-trump', 'e-jean-carroll'],
  sources: ['NYT'],
  tags: ['legal']
}));

addTimelineEvent(makeTimelineEvent({
  id: '2023-05-09-carroll-jury-verdict',
  date: '2023-05-09',
  dateDisplay: 'May 9, 2023',
  era: '2020-present',
  title: 'Jury Finds Trump Liable for Sexual Abuse of E. Jean Carroll',
  body: 'A jury found Trump liable for sexually abusing E. Jean Carroll in 1995 or 1996 and defaming her, awarding $5 million in damages. This is a court-adjudicated finding of sexual abuse by Trump during the same timeframe as the Epstein friendship. (Court records; Reuters; NYT)',
  peopleIds: ['donald-trump', 'e-jean-carroll'],
  sources: ['NYT'],
  tags: ['legal'],
  verificationStatus: 'verified'
}));

addTimelineEvent(makeTimelineEvent({
  id: '2023-07-19-judge-kaplan-clarifies-carroll-verdict',
  date: '2023-07-19',
  dateDisplay: 'July 19, 2023',
  era: '2020-present',
  title: 'Judge Kaplan Clarifies Carroll Jury Found Trump Raped Her',
  body: 'Judge Lewis Kaplan clarified that the jury found Trump raped E. Jean Carroll per the common definition of the word — forcible, nonconsensual digital penetration of her vagina. New York\'s statutory definition at the time defined rape as solely penile penetration. (Court records)',
  peopleIds: ['donald-trump', 'e-jean-carroll'],
  sources: ['NYT'],
  tags: ['legal'],
  verificationStatus: 'verified'
}));

addTimelineEvent(makeTimelineEvent({
  id: '2024-01-26-carroll-defamation-damages',
  date: '2024-01-26',
  dateDisplay: 'January 26, 2024',
  era: '2020-present',
  title: 'Trump Ordered to Pay $83.3M in Carroll Defamation Case',
  body: 'Trump ordered to pay additional $83.3 million in defamation damages to E. Jean Carroll. (Court records; Reuters)',
  peopleIds: ['donald-trump', 'e-jean-carroll'],
  sources: ['NYT'],
  tags: ['legal'],
  verificationStatus: 'verified'
}));

addTimelineEvent(makeTimelineEvent({
  id: '2024-12-30-carroll-5m-verdict-upheld',
  date: '2024-12-30',
  dateDisplay: 'December 30, 2024',
  era: '2020-present',
  title: 'Carroll $5M Sexual Abuse Verdict Upheld on Appeal',
  body: 'The $5 million sexual abuse verdict against Trump in the E. Jean Carroll case was upheld on appeal. (Court records)',
  peopleIds: ['donald-trump', 'e-jean-carroll'],
  sources: ['NYT'],
  tags: ['legal'],
  verificationStatus: 'verified'
}));

addTimelineEvent(makeTimelineEvent({
  id: '2025-06-13-second-circuit-declines-carroll-reconsideration',
  date: '2025-06-13',
  dateDisplay: 'June 13, 2025',
  era: '2020-present',
  title: 'Second Circuit Declines to Reconsider Carroll Verdict',
  body: 'The Second Circuit Court of Appeals declined to reconsider the E. Jean Carroll sexual abuse verdict against Trump. (Court records)',
  peopleIds: ['donald-trump', 'e-jean-carroll'],
  sources: ['NYT'],
  tags: ['legal'],
  verificationStatus: 'verified'
}));

addTimelineEvent(makeTimelineEvent({
  id: '2025-09-08-carroll-83m-upheld-immunity-rejected',
  date: '2025-09-08',
  dateDisplay: 'September 8, 2025',
  era: '2020-present',
  title: 'Carroll $83.3M Upheld; Presidential Immunity Rejected',
  body: 'The $83.3 million defamation verdict against Trump was upheld on appeal. Trump\'s presidential immunity argument was rejected. Interest continues to accrue on unpaid amounts. (Court records)',
  peopleIds: ['donald-trump', 'e-jean-carroll'],
  sources: ['NYT'],
  tags: ['legal'],
  verificationStatus: 'verified'
}));

// 24. Underage sex party allegations (October 25, 2016)
addTimelineEvent(makeTimelineEvent({
  id: '2016-10-25-underage-sex-party-allegations',
  date: '2016-10-25',
  dateDisplay: 'October 25, 2016',
  era: '2008-2018',
  title: 'Underage Sex Party Allegations Against Trump',
  body: 'Two men alleged Trump attended sex parties with underage girls (as young as 15) who were induced with promises of career advancement. Illegal drugs allegedly provided to minors. Andy Lucchesi said he saw Trump engage in sexual activity with the girls. Girls were described as "14, look 24." Verification status: UNVERIFIED — testimony of two named/anonymous sources only. (news.com.au; Times of Israel; NY Daily News)',
  peopleIds: ['donald-trump', 'andy-lucchesi'],
  sources: ['OSINT'],
  tags: ['misconduct'],
  verificationStatus: 'unverified'
}));

// 25. Musk post (June 6, 2025)
addTimelineEvent(makeTimelineEvent({
  id: '2025-06-06-musk-post-trump-epstein-files',
  date: '2025-06-06',
  dateDisplay: 'June 6, 2025',
  era: '2020-present',
  title: 'Musk Posts That Trump Appears in Epstein Files',
  body: 'Elon Musk posted (as part of Trump-Musk feud) that Trump appeared in files related to Epstein and that this was "the real reason why the files have not been made public." (Musk social media post)',
  peopleIds: ['donald-trump'],
  sources: ['OSINT'],
  tags: ['political'],
  verificationStatus: 'unverified'
}));

// 26. Enrich Bondi memo entry
enrichTimelineBody('2025-07-ag-bondi-claims-client-list-on-my-desk',
  'On July 7, 2025, Bondi released a memo stating there was no evidence Epstein had a "client list" or blackmailed prominent individuals. The memo also confirmed Epstein committed suicide. This caused significant backlash among MAGA supporters who had anticipated revelations from the files. (DOJ memo; media reports July 2025)'
);

// 27. Trump calls supporters "stupid" (July 16, 2025)
addTimelineEvent(makeTimelineEvent({
  id: '2025-07-16-trump-calls-supporters-stupid-over-epstein',
  date: '2025-07-16',
  dateDisplay: 'July 16, 2025',
  era: '2020-present',
  title: 'Trump Calls Supporters "Stupid" Over Epstein Demands',
  body: 'In social media posts, Trump called continuing demands for Epstein file release "a hoax perpetrated by Democrats" and said supporters pressing for release were "stupid," "foolish," and "past supporters." (ABC News July 16, 2025; NBC News July 16, 2025)',
  peopleIds: ['donald-trump'],
  sources: ['NYT'],
  tags: ['political']
}));

// 28. Enrich birthday letter
enrichTimelineBody('2025-07-17-wsj-birthday-letter-story-published',
  'Additional detail: "The letter, which bore Trump\'s signature, featured several lines of typewritten text framed by the outline of a naked woman, apparently hand-drawn with a heavy marker. The WSJ described Trump\'s \'squiggly\' signature below the woman\'s waist as mimicking pubic hair. The letter concluded: \'Happy Birthday — and may every day be another wonderful secret.\'" The letter was in a leather-bound photo album collected by Maxwell. (WSJ, Safdar & Palazzolo, July 20, 2025)'
);

// 29. Fix Trump WSJ lawsuit to $20B
{
  const wsj = findTimelineById('2025-07-18-trump-files-10-billion-lawsuit-against-w');
  if (wsj) {
    wsj.title = 'Trump Files $20 Billion Lawsuit Against WSJ';
    wsj.body = wsj.body.replace(/\$10 billion/g, '$20 billion (two counts of defamation for $10 billion each)');
    console.log('  FIX: Updated WSJ lawsuit to $20B');
  }
}

// 30. Trump "He Stole Her" (July 29, 2025)
addTimelineEvent(makeTimelineEvent({
  id: '2025-07-29-trump-he-stole-her-giuffre-comment',
  date: '2025-07-29',
  dateDisplay: 'July 29, 2025',
  era: '2020-present',
  title: 'Trump: "He Stole Her" Comment About Giuffre',
  body: 'When asked about the Trump-Epstein falling out, Trump said Epstein "hired away spa attendants from Mar-a-Lago\'s spa." Asked if one was Virginia Giuffre: "I think so. I think that was one of the people. He stole her." This is significant — it is an on-the-record Trump statement connecting Giuffre to both Mar-a-Lago and Epstein\'s recruitment pipeline. (Media reports, July 29, 2025)',
  peopleIds: ['donald-trump', 'jeffrey-epstein', 'virginia-giuffre-ne-roberts'],
  sources: ['NYT'],
  tags: ['victim', 'mar-a-lago']
}));

// 31. Enrich photo removed/restored entry
enrichTimelineBody('2025-12-20-efta00000468-removed-from-doj-website',
  'Additional detail: EFTA file #468, which showed a photograph of Trump and Epstein together, was removed less than one day after its release. The file was later restored after public outcry.'
);

// 32. Enrich Nassar letter in Dataset 8
enrichTimelineBody('2025-12-22-dataset-8-released',
  'Additional detail on fake Nassar letter: The DOJ confirmed the letter was fabricated, citing "several irregularities with the note and envelope": writing doesn\'t match Epstein\'s; return address didn\'t list jail or inmate number; envelope postmarked from northern Virginia while Epstein was detained in New York; postmarked three days after Epstein died. (DOJ; Snopes December 2025)'
);

// 33. Flight records email (December 23, 2025)
addTimelineEvent(makeTimelineEvent({
  id: '2025-12-23-flight-records-email-released',
  date: '2025-12-23',
  dateDisplay: 'December 23, 2025',
  era: '2020-present',
  title: 'Flight Records Email Released',
  body: 'A Manhattan AUSA email was released stating that Epstein\'s flight records revealed "that Donald Trump traveled on Epstein\'s private jet many more times than previously has been reported (or that we were aware), including during the period we would expect to charge in a Maxwell case." (EFTA release; media reports)',
  peopleIds: ['donald-trump', 'jeffrey-epstein'],
  sources: ['DOJ'],
  tags: ['flight'],
  efta: ['EFTA01660651']
}));

// 34. Enrich NTOC Names in Datasets 9-12 entry
enrichTimelineBody('2026-01-30-datasets-912-released',
  'Key document: "NTOC Names" email containing multiple allegations against Trump:\n\n1. 1984 Lake Michigan allegation — woman claimed uncle trafficked her to Epstein at age 13 while pregnant; Trump allegedly witnessed baby murder and dumping in Lake Michigan; claimed Trump "participated regularly in paying money to force me to perform sex acts with him." Snopes: dates don\'t align with established Trump-Epstein timeline.\n\n2. ~1990 oral rape allegation — complaint alleges Trump forced 13-14 year old to perform oral sex; girl bit Trump during act, he allegedly hit her. Complainant is female friend of alleged victim. Unlike many NTOC tips, this lead was sent to FBI\'s Washington office and accuser was interviewed by FBI four times. Only one interview released; per log of Maxwell discovery material, eight documents totaling 53 pages are missing from public release. Described in internal FBI PowerPoint deck about "prominent names."\n\n3. 1995 limousine allegation — driver heard Trump reference "Epstein" and "abusing some girl"; woman said "he raped me" and "Donald J. Trump had raped her along with Jeffrey Epstein." Woman later "found with her head \'blown off\' in Kiefer, OK" — police said "definitely not a suicide" while coroner ruled it was. January 30 release added: driver was taking Trump to Dallas-Fort Worth International Airport; driver spoke about being "a few seconds from pulling the limousine over on the median."\n\n4. 1995-1996 Trump Golf Course allegation — woman accused Trump of being client for sex-trafficking at Trump Golf Course in Rancho Palos Verdes, CA; claims Maxwell acted as broker for sex parties for Epstein, Trump, and Robin Leach; claims Trump\'s head of security threatened her. Heard rumors of girls going missing, murdered and buried at facility. Report indicates complainant was spoken to and deemed not credible.\n\n5. Victoria\'s Secret Models allegation — alleged victim claims at 16, herself and other young girls/older Victoria\'s Secret models were in "big orgy parties" with Trump and Bill Clinton at Epstein\'s NYC residence.\n\n6. Mar-a-Lago allegation — complainant alleges Trump raped her at 13 at Mar-a-Lago party; accuses Trump of inserting fingers into vaginas/vulvas of children to "rate them on tightness" for auction; alleges Elon Musk, Donald Trump Jr., Ivanka Trump, Eric Trump, Alan Dershowitz, and Robert Shapiro attended. NOTE: The presence of Elon Musk is anachronistic for the alleged time period and should be flagged as a credibility concern.\n\n7. 1987 Trump Plaza allegation — caller\'s friend allegedly drugged and raped by Trump at Trump Plaza; woke up sore with $300 and no clothes; friend eventually disappeared and was declared deceased.\n\nAll NTOC allegations are unverified anonymous tips to law enforcement. (NYT "Feds Release Document of Tips" January 30, 2026; Snopes; EFTA release)'
);
addPeopleToEvent('2026-01-30-datasets-912-released', ['donald-trump', 'jeffrey-epstein', 'ghislaine-maxwell', 'bill-clinton', 'alan-dershowitz']);
addSourcesToEvent('2026-01-30-datasets-912-released', ['NYT', 'DOJ']);

console.log(`\nTimeline total: ${timeline.length} events`);

// ============================================================
// PART 2: TRUMP DOSSIER SECTIONS (Epstein-adjacent)
// ============================================================

console.log('\n=== PART 2: TRUMP DOSSIER — EPSTEIN SECTIONS ===\n');

const trump = findPersonById('donald-trump');
if (!trump) {
  console.error('FATAL: donald-trump not found in people.json');
  process.exit(1);
}

// Add "Broader Sexual Misconduct Pattern" section
trump.sections.push({
  title: 'Broader Sexual Misconduct Pattern',
  content: 'At least 28 women have accused Trump of sexual misconduct since the 1970s, including rape, assault, groping, and non-consensual kissing. Key legal outcomes: E. Jean Carroll jury found Trump liable for sexual abuse (May 2023, $5M damages) and defamation ($83.3M, January 2024); both upheld on appeal. Judge Kaplan stated the jury found Trump raped Carroll per the common definition. Former wife Ivana described an incident in a 1990 deposition as "rape" but later recanted. Jill Harth filed a 1997 lawsuit alleging non-consensual groping of "intimate private parts" at Mar-a-Lago — the same venue central to Epstein allegations. Steve Bannon said Trump lawyer Marc Kasowitz "took care of 100 women" during the 2016 campaign. In the 2005 Access Hollywood tape, Trump stated: "when you\'re a star, they let you do it. You can do anything... Grab \'em by the pussy." Multiple Epstein-related accusers cited this tape as motivation to come forward.\n\nRelevance to Epstein case: The pattern establishes (a) court-adjudicated sexual abuse during the Epstein friendship period, (b) multiple allegations involving Mar-a-Lago and pageant/modeling settings that overlap with Epstein\'s recruitment pipeline, (c) the Harth allegations directly involve the Houraney-organized events that included Epstein, and (d) allegations of underage sex parties in the mid-1990s parallel the timeframe of the "Katie Johnson" / Jane Doe lawsuit.',
  sources: ['NYT', 'DOJ'],
  verificationStatus: 'contested'
});
console.log('  ADD section: Broader Sexual Misconduct Pattern');

// Add "E. Jean Carroll Verdict" section
trump.sections.push({
  title: 'E. Jean Carroll Verdict',
  content: 'On May 9, 2023, a jury found Trump liable for sexually abusing writer E. Jean Carroll in 1995 or 1996 and defaming her. Awarded $5M. Judge Kaplan later clarified: the jury found Trump raped Carroll per the common definition (forcible, nonconsensual digital penetration of her vagina). New York\'s statutory definition at the time defined rape as solely penile penetration. January 26, 2024: additional $83.3M in defamation damages. Both verdicts upheld on appeal (December 30, 2024 and September 8, 2025). Trump\'s presidential immunity argument was rejected. Interest continues to accrue on unpaid amounts.',
  sources: ['NYT', 'DOJ'],
  verificationStatus: 'verified'
});
console.log('  ADD section: E. Jean Carroll Verdict');

// Add "November 2025 — 'Quiet, Piggy' Incident" section
trump.sections.push({
  title: "November 2025 — 'Quiet, Piggy' Incident",
  content: 'In November 2025, Trump said "quiet, piggy" to a female reporter, described by The Boston Globe as the second personal attack on a female reporter within a week. (Boston Globe, November 19, 2025)',
  sources: ['OSINT'],
  verificationStatus: 'verified'
});
console.log("  ADD section: November 2025 — 'Quiet, Piggy' Incident");

// ============================================================
// PART 7: COMPLETE MISCONDUCT ALLEGATION CATALOG
// ============================================================

console.log('\n=== PART 7: COMPLETE MISCONDUCT CATALOG ===\n');

trump.sections.push({
  title: 'Complete Misconduct Allegation Catalog',
  content: 'The following is a chronological catalog of all documented sexual misconduct allegations against Trump. This catalog establishes a behavioral pattern spanning decades that contextualizes the Epstein-specific allegations. The pattern of conduct — particularly involving young women, models, pageant contestants, and abuse of power dynamics — is directly relevant to evaluating the credibility and context of the Epstein-related claims.\n\n---\n\nIvana Trump (1989): In a 1990 divorce deposition, Ivana stated Donald attacked her sexually after visiting her plastic surgeon — ripping out hair from her scalp. Harry Hurt III\'s book "Lost Tycoon" (1993) described the incident as a "violent assault" and sexual attack. Ivana later issued a statement: she "referred to this as a \'rape,\' but I do not want my words to be interpreted in a literal or criminal sense." Divorce granted December 1990 on grounds of "cruel and inhuman" treatment. Settlement included a confidentiality clause. In 2015 campaign endorsement, Ivana said: "The story is totally without merit." (Deposition; Hurt 1993; NBC October 2016; People December 1990)\n\n---\n\nJessica Leeds (~Early 1980s): Businesswoman on a flight from the Midwest. A flight attendant offered her a first-class seat next to Trump. After approximately 45 minutes, Trump allegedly lifted the armrest, grabbed her breasts, and tried to put his hand up her skirt. "He was like an octopus. His hands were everywhere." Published by NYT October 2016. Trump threatened to sue the NYT; never followed through. A claimed witness (Anthony Gilberthorpe, former British Conservative councillor) said he saw "nothing untoward" — but Gilberthorpe has a history of making false allegations against politicians. (NYT October 12, 2016; Guardian October 15, 2016)\n\n---\n\nKristin Anderson (~Early 1990s): Alleged Trump groped her beneath her skirt in a Manhattan nightclub (believed to be the China Club, described by Newsday as "Donald\'s Monday-night nest"). She was an aspiring model at the time. She told friends and came forward after reading other women\'s accounts. (WaPo October 14, 2016)\n\n---\n\nJill Harth (1992-1993): December 1992: alleged Trump attempted to put his hands between her legs during dinner with Houraney present. January 1993: alleged Trump pushed her against a wall in Ivanka\'s bedroom at Mar-a-Lago during a contract-signing visit, "hands all over her," trying to kiss her. Filed 1997 lawsuit alleging non-consensual groping of "intimate private parts" and "relentless" sexual harassment. Suit withdrawn after Houraney settled a separate business dispute with Trump. Harth received therapy for "a couple years" afterward. In 2015, contacted Trump\'s campaign for makeup artist work. Epstein connection: Her boyfriend George Houraney organized the "calendar girl competition" where Trump and Epstein were the only two guests. (NYT "Crossing the Line" May 2016; Guardian October 2016)\n\n---\n\nLisa Boyne (1996): Alleged Trump made models walk across a table, looked under their skirts, described their underwear. Also present was modeling agent John Casablancas, connected to Epstein\'s modeling network through MC2/Brunel. (HuffPost October 13, 2016)\n\n---\n\nE. Jean Carroll (1995/1996): Writer. Jury found Trump liable for sexual abuse and defamation (May 2023, $5M). Judge Kaplan clarified jury found Trump raped Carroll per common definition. Additional $83.3M defamation damages (January 2024). Both upheld on appeal. Presidential immunity rejected. Court-adjudicated sexual abuse during the Epstein friendship period. (Court records; Reuters; NYT)\n\n---\n\nCathy Heller (1997): Alleged Trump grabbed and kissed her at a Mother\'s Day brunch at Mar-a-Lago. Her in-laws were members. When she avoided a kiss, Trump became angry, "grabbed" her and kissed her on the side of the mouth "for a little too long." Husband and children corroborated. Members of her mahjong group heard the account in summer 2015, before she went public. Mar-a-Lago venue. (Guardian October 15, 2016; People October 16, 2016)\n\n---\n\nTemple Taggart McDowell (1997): Miss Utah USA 1997. Accused Trump of unwanted kisses and embraces that left her and her chaperone uncomfortable enough that she was told never to be left alone with him again. Trump\'s first year of Miss USA ownership. She is a Republican and did not come forward to support Clinton. (NYT "Crossing the Line" May 2016; NBC October 2016)\n\n---\n\nAmy Dorris (1997): Former model alleged Trump groped and forcibly kissed her at the 1997 U.S. Open. She attended with boyfriend Jason Binn, who described Trump as "his best friend." The Guardian confirmed she told her mother and a friend immediately after. (The Guardian September 17, 2020)\n\n---\n\nKarena Virginia (1998): Alleged Trump grabbed her arm and touched her breast while she waited for a ride after the U.S. Open in Queens. She was 27, had not met Trump previously. Trump approached with a group of men, commented on her legs, grabbed her right arm, touched her breast. "Don\'t you know who I am?" Attorney Gloria Allred represented her. (Guardian October 20, 2016; CBS October 20, 2016)\n\n---\n\nKaren Johnson (~Early 2000s): Alleged Trump grabbed her by her genitals, pulled her behind a tapestry, and forcibly kissed her at a New Year\'s Eve party at Mar-a-Lago. Johnson alleged Trump repeatedly called her afterward (without her giving him her number), offering to fly her to meet him. She rejected all offers. A friend corroborated she told this story years before Trump ran for president. Mar-a-Lago venue. (All the President\'s Women, Levine & El-Faizy 2019; Vox October 2019)\n\n---\n\nBridget Sullivan (2000): Miss New Hampshire USA 2000. Alleged Trump walked into the dressing room as contestants prepared. "He was coming to wish the contestants good luck, but they were all naked." (BuzzFeed October 2016)\n\n---\n\nTasha Dixon (2001): Miss Arizona USA 2001. "He just came strolling right in. There was no second to put a robe on or any sort of clothing or anything. Some girls were topless, other girls were naked." She said being walked in on put them in "a very physically vulnerable position, and then to have the pressure of the people that work for him telling us to go fawn all over him." (CBS LA October 2016)\n\n---\n\nMindy McGillivray (2003): Alleged Trump groped her at Mar-a-Lago in January 2003 (age 23). "All of a sudden I felt a grab, a little nudge." Photographer Ken Davidoff corroborated: she told him immediately after, "Donald just grabbed my ass!" Ken\'s brother Darryl, also present, said he believes she is lying. Mar-a-Lago venue. (Palm Beach Post October 2016)\n\n---\n\nRachel Crooks (2005): Receptionist at Bayrock Group in Trump Tower. Encountered Trump in an elevator, introduced herself, shook hands — Trump wouldn\'t let go, began kissing her cheeks, then directly on the mouth. "It was so inappropriate. I was so upset that he thought I was so insignificant that he could do that." (NYT October 12, 2016)\n\n---\n\nNatasha Stoynoff (2005): Canadian journalist for People magazine. Went to Mar-a-Lago in December 2005 to interview Trump and Melania. During a tour, Trump allegedly pushed her against a wall and forced his tongue into her mouth. Trump\'s butler allegedly "burst in" interrupting. Six witnesses corroborated she told them about the incident at the time. Mar-a-Lago venue. (People October 12, 2016; NYT October 18, 2016)\n\n---\n\nJuliet Huddy (2005 or 2006): Reporter. Said Trump kissed her on the lips in an elevator in Trump Tower with his security guard present. "I was surprised that he went for the lips. But I didn\'t feel threatened." (The Hill December 2017; The Independent December 2017)\n\n---\n\nSummer Zervos (2007): Apprentice contestant (Season 5). Contacted Trump about a job post-show. At the Beverly Hills Hotel, Trump allegedly kissed her open-mouthed, touched her breasts, thrust his genitals on her. She described the behavior as "aggressive and not consensual." Filed defamation lawsuit January 2017 after Trump called her a liar. Withdrew case November 2021 — attorneys said Trump did not pay her to withdraw. During the Apprentice, Trump was described by 20+ crew members as rating female contestants by breast size and discussing which women he wanted to have sex with. (Rolling Stone October 2016; WaPo November 2021; BBC January 2017; AP investigation)\n\n---\n\nJessica Drake (2006): Adult film actress and sex education advocate. Met Trump at a charity golf tournament at Lake Tahoe. Invited to his suite with two friends. "He grabbed each of us tightly, in a hug and kissed each one of us without asking permission." Later received calls offering $10,000 and a flight on his jet to join him. She declined. Trump appeared to dismiss the allegation because of her profession, saying: "Oh, I\'m sure she\'s never been grabbed before." (CBS October 22, 2016; Guardian October 23, 2016)\n\n---\n\nNinni Laaksonen (2006): Miss Finland 2006. Appeared with Trump on Late Show with David Letterman on July 26, 2006. Before air, Trump allegedly grabbed her buttocks. "He really grabbed my butt. I don\'t think anybody saw it but I flinched and thought: \'What is happening?\'" Someone later told her Trump liked her because she looked like a younger Melania. (Ilta-Sanomat October 27, 2016; Slate October 27, 2016)\n\n---\n\nSamantha Holvey (2006): Miss North Carolina USA 2006. Said Trump\'s conduct was "creepy," that he "eyed me like a piece of meat," and that she saw Trump enter the dressing room where contestants were naked. Later wrote: "You can\'t work in Hollywood if you\'re a sexual predator, but you can become the commander-in-chief?" (NBC December 2017; original October 2016 reporting)\n\n---\n\nCassandra Searles (2013): Miss Washington USA 2013. Alleged Trump was "continually" groping her buttocks during the Miss USA pageant and asked her to go "to his hotel room." Said Trump "treated us like cattle." Trump and his campaign have not specifically responded. (Rolling Stone October 2016; NPR October 2016; Yahoo News June 2016)\n\n---\n\nAlva Johnson (2016): Alleged Trump forcibly kissed her at a Florida rally in August 2016 while she worked on his campaign. Two witnesses, including then-Florida AG Pam Bondi, denied seeing the kiss. Also alleged race and gender discrimination through unequal pay. Lawsuit dismissed; Johnson chose not to refile, citing a hostile judge and ongoing threats to her safety. (Vox February 2019; Teen Vogue March 2019)',
  sources: ['NYT', 'CBS', 'OSINT'],
  verificationStatus: 'contested'
});
console.log('  ADD section: Complete Misconduct Allegation Catalog');

// ============================================================
// PART 8: PAGEANT DRESSING ROOM VISITS
// ============================================================

console.log('\n=== PART 8: PAGEANT DRESSING ROOM VISITS ===\n');

trump.sections.push({
  title: 'Pageant Dressing Room Visits',
  content: 'Trump owned the Miss Universe franchise (including Miss USA and Miss Teen USA) from 1996 to 2015 — overlapping exactly with the period of his Epstein friendship and the alleged trafficking activity.\n\nTrump\'s Own Admission (Howard Stern, April 11, 2005):\n\n"Well, I\'ll tell you the funniest is that before a show, I\'ll go backstage and everyone\'s getting dressed, and everything else, and you know, no men are anywhere, and I\'m allowed to go in because I\'m the owner of the pageant and therefore I\'m inspecting it. You know, I\'m inspecting because I want to make sure that everything is good. [...] You know, the dresses. \'Is everyone okay?\' You know, they\'re standing there with no clothes. \'Is everybody okay?\' And you see these incredible looking women, and so, I sort of get away with things like that."\n\nWhen Stern asked if he had ever had sex with a contestant, Trump said: "I never comment on things like that." Stern then imitated a foreign contestant ("Mr. Trump, in my country, we say hello with vagina"), and Trump responded: "Well, you could also say, as the owner of the pageant, it\'s your obligation to do that."\n\nImportant clarification (per Snopes, July 2025): In this interview, Trump was referring to Miss USA/Miss Universe (contestants 18+). He did not reference Miss Teen USA in these comments. However, multiple Miss Teen USA contestants independently alleged he entered their dressing room as well.\n\n---\n\nMiss Teen USA Dressing Room Allegations (1997):\n\nMariah Billado (Miss Vermont Teen USA 1997): "I remember putting on my dress really quick, because I was like, \'Oh my god, there\'s a man in here.\' Trump said something like, \'Don\'t worry, ladies, I\'ve seen it all before.\'" Billado recalled telling Ivanka Trump, who responded: "Yeah, he does that."\n\nVictoria Hughes (Miss New Mexico Teen USA 1997): Confirmed Trump conducted a dressing room visit; stated the youngest contestant there was 15 years old.\n\nFour other women also alleged the 1997 dressing room visit. Eleven contestants said they did not see Trump enter, though some said it was possible he entered while they were elsewhere. The dressing room had 51 contestant stations.\n\n---\n\nMiss USA Dressing Room Allegations:\n\nBridget Sullivan (2000, Miss New Hampshire USA): Trump walked in to "wish good luck" but "they were all naked."\n\nTasha Dixon (2001, Miss Arizona USA): "He just came strolling right in. There was no second to put a robe on." Described pressure from staff to "go fawn all over him."\n\nUnnamed contestants (2001): Told The Guardian that Trump "just barged right in, didn\'t say anything, stood there and stared."\n\nSamantha Holvey (2006, Miss North Carolina USA): Saw Trump enter dressing room where contestants were naked. Described being "eyed like a piece of meat."\n\nTrump\'s campaign stated the allegations "have no merit and have already been disproven by many other individuals who were present."\n\n---\n\nRelevance to Epstein Investigation:\n\n1. Modeling pipeline: Epstein\'s associate Jean-Luc Brunel ran MC2 Model Management, which supplied young women/girls to Epstein. Trump\'s pageant empire operated in the same modeling/beauty industry ecosystem.\n\n2. Shared social venues: Multiple pageant events and after-parties occurred at the same locations (Mar-a-Lago, Manhattan hotels) where Epstein-related events took place.\n\n3. Victoria\'s Secret connection: Trump and Epstein were spotted at a 1997 Victoria\'s Secret "Angels" party. Victoria\'s Secret was owned by Les Wexner, Epstein\'s primary financial patron. The NTOC "Victoria\'s Secret Models" allegation names both Trump and Clinton.\n\n4. Pattern of access to young women: Trump\'s self-described practice of entering dressing rooms of contestants (including minors per multiple accounts) parallels the access-based grooming and exploitation patterns documented in the Epstein trafficking operation.',
  sources: ['NYT', 'CBS', 'OSINT'],
  verificationStatus: 'contested'
});
console.log('  ADD section: Pageant Dressing Room Visits');

// ============================================================
// PART 9: HOWARD STERN SHOW RECORD
// ============================================================

console.log('\n=== PART 9: HOWARD STERN RECORD ===\n');

trump.sections.push({
  title: 'Howard Stern Show Record',
  content: 'Trump appeared on The Howard Stern Show over 17 years (~1993-2015), accumulating 15+ hours of recorded conversation and over 104,000 words. In 2017, an anonymous source sent audio files of 35 full Trump-Stern interviews to the archive site Factba.se. These interviews constitute the most extensive unfiltered record of Trump\'s attitudes toward women and sexuality.\n\n---\n\nComments About Daughter Ivanka:\n\n2004: Stern asked, "Can I say this? A piece of ass?" Trump replied: "Yeah." Trump also admitted promising Ivanka (when she was 17 in 1999) that he\'d never date a girl younger than her.\n\n2006: Stern remarked Ivanka "looks more voluptuous than ever" and asked about breast implants. Trump: "She\'s actually always been very voluptuous... She\'s tall, she\'s almost 6 feet tall and she\'s been, she\'s an amazing beauty." Trump described Ivanka as having "the best body."\n\nStern\'s own assessment (2019, Colbert interview): "He was completely unfiltered, he was talking about his daughter was the most attractive woman he ever met and how much he thought she was hot."\n\n---\n\nComments About Minors / Young Women:\n\n2003 (about Paris Hilton): "I\'ve known Paris Hilton from the time she\'s 12, her parents are friends of mine, and the first time I saw her she walked into the room and I said, \'Who the hell is that?\' At 12, I wasn\'t interested... but she was beautiful."\n\n~2006: When Stern asked if Trump "could now be banging 24-year-olds," Trump said: "Oh, absolutely. I\'d have no problem." In an earlier exchange, Trump was asked about his age floor for dating and fumbled: "I don\'t want to be like Congressman Foley, with, you know, 12-year-olds" — a reference to the Mark Foley congressional page scandal. Note: This clip resurfaced in July 2025 amid the Epstein file releases.\n\n2002: Called 30 "a perfect age" for a woman. "What is it at 35, Howard? It\'s called checkout time."\n\n---\n\nPageant Ownership and Contestants:\n\nApril 11, 2005: The dressing room admission — "I sort of get away with things like that" (see Pageant Dressing Room Visits section for full quote).\n\n2005: When asked if he\'d ever had sex with a Miss USA/Universe contestant: "I never comment on things like that." When pressed: "It could be a conflict of interest."\n\nOn changing pageants after purchase: "They said, \'how are you going to change the pageant?\' I said, \'I\'m going to get the bathing suits to be smaller and the heels to be higher.\'" He told Katie Couric: "If you\'re looking for a rocket scientist, don\'t turn in tonight. But if you\'re looking for a really beautiful woman, you should watch."\n\nOn selecting contestants: After taking over, Trump emphasized appearance over education. "They had a person who was extremely proud that a number of the women had become doctors. And I wasn\'t interested."\n\n---\n\nRating Women and Sexual Boasting:\n\nRoutinely rated women on a scale of 1-10 on the show. Rated Tiger Woods\' then-wife Elin Nordegren "a solid nine."\n\n2008: "Some incredible beautiful women. They\'ll walk up and they\'ll flip their top, and they\'ll flip their panties." Claimed women threw themselves at him.\n\nDiscussed Princess Diana: said he was "pretty sure" she would have slept with him. Made these comments weeks after her death. In a later interview said he would have slept with her "without even hesitation."\n\n1997: Discussed having sex with women on their menstrual cycles. "I\'ve been there, Howard, as we all have."\n\nAdmitted he was asked by Stern to rate 15 supermodels and revealed whether he\'d slept with them — while married.\n\nConceded he had groped Melania in public.\n\nWhen asked if he\'d slept with two or three women in one day: "I have no comment. Look, I like sex, so do you."\n\n---\n\nSelf-Awareness and Context:\n\n1993: "I like Howard, but I have to be crazy to be here."\n\n1998 (Chris Matthews interview): "Can you imagine how controversial I\'d be?... You think about Bill Clinton with the women. How about me with the women?"\n\nMelania on the Stern interviews (2016, CNN): "I didn\'t agree to do all the tapes on Howard Stern, with Billy Bush. Because I know those people. They hook him on, they try to get from him some inappropriate and dirty language."\n\nTrump\'s defense (April 2016): "I never anticipated running for office or being a politician, so I could have fun with Howard on the radio and everyone would love it."\n\n---\n\nRelevance to Epstein Investigation:\n\n1. Self-admitted behavior pattern: The Stern interviews document Trump describing, in his own words, the same categories of behavior alleged by Epstein-related accusers: entering rooms where women are undressed, pursuing very young women, treating women as objects to be rated and ranked.\n\n2. Contemporaneous timeline: Many of these interviews occurred during the active Epstein friendship period (1990s-2004).\n\n3. Paris Hilton comment (2003): Trump\'s comment about noticing Paris Hilton\'s appearance at age 12 is relevant context for NTOC allegations involving girls aged 13-16.\n\n4. The "Foley" exchange: Trump\'s fumbled reference to age limits for sexual partners, resurfacing in July 2025 alongside the Epstein file releases, drew direct public comparisons to the NTOC allegations.\n\n5. "Got away with things like that": Trump\'s dressing room admission uses the same language framework ("I sort of get away with things like that") as the Access Hollywood tape ("when you\'re a star, they let you do it"), establishing a self-described pattern of exploiting power imbalance for sexual access.',
  sources: ['NYT', 'CBS', 'OSINT'],
  verificationStatus: 'verified'
});
console.log('  ADD section: Howard Stern Show Record');

// Update Trump sources
['NYT', 'CBS', 'OSINT', 'DOJ', 'CNN'].forEach(s => {
  if (!trump.sources.includes(s)) trump.sources.push(s);
});

// ============================================================
// PART 2 (continued): NEW PEOPLE ENTRIES — EPSTEIN-ADJACENT
// ============================================================

console.log('\n=== PART 2 (cont): NEW EPSTEIN-ADJACENT PEOPLE ===\n');

// Jill Harth
if (!findPersonById('jill-harth')) {
  people.push({
    id: 'jill-harth',
    name: 'Jill Harth',
    category: 'victim',
    summary: 'Filed 1997 lawsuit against Trump alleging sexual harassment and groping at Mar-a-Lago. Her boyfriend George Houraney organized the Trump-Epstein "calendar girl competition."',
    sections: [
      { title: 'Category', content: 'Alleged victim / public accuser', sources: [] },
      {
        title: 'Allegations',
        content: 'December 1992: alleged Trump attempted to put his hands between her legs during dinner with Houraney present. January 1993: alleged Trump pushed her against a wall in Ivanka\'s bedroom at Mar-a-Lago during a contract-signing visit, hands all over her, trying to kiss her. Filed 1997 lawsuit alleging non-consensual groping of "intimate private parts" and "relentless" sexual harassment. Suit withdrawn after Houraney settled a separate business dispute with Trump. Harth received therapy for "a couple years" afterward. In 2015, contacted Trump\'s campaign for makeup artist work. (NYT "Crossing the Line" May 2016; Guardian October 2016)\n\n---',
        sources: ['NYT'],
        verificationStatus: 'contested'
      },
      {
        title: 'Epstein Connection',
        content: 'Her boyfriend George Houraney organized the "calendar girl competition" at Mar-a-Lago where Trump and Epstein were the only two guests. The Harth assault allegations stem from events in the same social orbit and venue as the Trump-Epstein relationship.\n\n---',
        sources: ['NYT'],
        verificationStatus: 'verified'
      }
    ],
    timelineEventIds: ['1992-12-jill-harth-assault-allegation-dinner', '1993-01-jill-harth-assault-mar-a-lago'],
    themeIds: ['trumpepstein-connections'],
    connectionIds: ['donald-trump', 'jeffrey-epstein', 'george-houraney'],
    sources: ['NYT']
  });
  console.log('  ADD person: jill-harth');
}

// George Houraney
if (!findPersonById('george-houraney')) {
  people.push({
    id: 'george-houraney',
    name: 'George Houraney',
    category: 'other',
    summary: 'Event organizer who arranged the Trump-Epstein "calendar girl competition" at Mar-a-Lago where Trump and Epstein were the only guests.',
    sections: [
      { title: 'Category', content: 'Associate / event organizer', sources: [] },
      {
        title: 'Role',
        content: 'Organized events for Trump including the "calendar girl competition" at Mar-a-Lago. According to Houraney, Trump and Epstein were the only guests at this event. Houraney\'s then-girlfriend Jill Harth filed a sexual harassment lawsuit against Trump stemming from these events. Houraney settled a separate business dispute with Trump for an undisclosed amount. (NYT July 19, 2025)\n\n---',
        sources: ['NYT'],
        verificationStatus: 'verified'
      }
    ],
    timelineEventIds: ['1992-mar-a-lago-calendar-girl-competition'],
    themeIds: ['trumpepstein-connections'],
    connectionIds: ['donald-trump', 'jeffrey-epstein', 'jill-harth'],
    sources: ['NYT']
  });
  console.log('  ADD person: george-houraney');
}

// Andy Lucchesi
if (!findPersonById('andy-lucchesi')) {
  people.push({
    id: 'andy-lucchesi',
    name: 'Andy Lucchesi',
    category: 'other',
    summary: 'Model/actor who alleged in October 2016 that Trump attended underage sex parties. Self-described acquaintance of Trump.',
    sections: [
      { title: 'Category', content: 'Witness / accuser', sources: [] },
      {
        title: 'Allegations',
        content: 'In October 2016, alleged Trump attended and partook in sex parties with underage minor females as young as 15 who were induced with promises of career advancement. Said he saw Trump engage in sexual activity with the girls but did not witness drug use. Regarding ages: "a lot of girls, aged 14, look 24." (news.com.au October 25, 2016; NY Daily News)\n\n---',
        sources: ['OSINT'],
        verificationStatus: 'unverified'
      }
    ],
    timelineEventIds: ['2016-10-25-underage-sex-party-allegations'],
    themeIds: ['trumpepstein-connections'],
    connectionIds: ['donald-trump'],
    sources: ['OSINT']
  });
  console.log('  ADD person: andy-lucchesi');
}

// Lisa Bloom
if (!findPersonById('lisa-bloom')) {
  people.push({
    id: 'lisa-bloom',
    name: 'Lisa Bloom',
    category: 'legal',
    summary: 'Attorney who represented "Katie Johnson"/Jane Doe in the 2016 Trump-Epstein rape lawsuit. Confirmed accuser dropped case on her own, no payoff.',
    sections: [
      { title: 'Category', content: 'Legal representative', sources: [] },
      {
        title: 'Role in Doe v. Trump',
        content: 'Represented Jane Doe in the 2016 civil lawsuit alleging rape by Trump and Epstein. Scheduled November 2, 2016 press conference but Doe abruptly canceled due to "multiple threats." Bloom stated: "I was trying to go in the direction of airing her story publicly, and it was frankly embarrassing for me to cancel it. I took her out the back stairway and she instructed me to drop the case." Bloom said Johnson/Doe disappeared and "I don\'t know where she is and haven\'t spoken to her since 2016." Confirmed Trump\'s people never reached out — no payoff. (Julie K. Brown "Perversion of Justice" 2021)\n\n---',
        sources: ['NYT'],
        verificationStatus: 'verified'
      }
    ],
    timelineEventIds: ['2016-11-04-katie-johnson-lawsuit-dismissed'],
    themeIds: ['trumpepstein-connections'],
    connectionIds: ['katie-johnson-jane-doe', 'donald-trump'],
    sources: ['NYT']
  });
  console.log('  ADD person: lisa-bloom');
}

// Norm Lubow
if (!findPersonById('norm-lubow')) {
  people.push({
    id: 'norm-lubow',
    name: 'Norm Lubow',
    category: 'other',
    summary: 'Former Jerry Springer producer who played a role in filing the "Katie Johnson" lawsuit against Trump and Epstein under the false name "Al Taylor."',
    sections: [
      { title: 'Category', content: 'Associate / disputed figure', sources: [] },
      {
        title: 'Role',
        content: 'Guardian investigation (July 2016) found lawsuits appeared to be organized by Lubow, "who has been associated in the past with a range of disputed claims involving celebrities including OJ Simpson and Kurt Cobain." Confirmed to Snopes (August 2024) that he played a role in filing the lawsuit under false name "Al Taylor." Snopes noted: "Lubow\'s involvement does not disprove that Johnson is a real person, but it does show that those claims were aggressively promoted and aided by someone who has a professional history of using individuals to create fictional salacious drama." (Guardian July 2016; Snopes August 2024)\n\n---',
        sources: ['OSINT'],
        verificationStatus: 'verified'
      }
    ],
    timelineEventIds: ['2016-04-katie-johnson-lawsuit-filed-and-forwarde'],
    themeIds: ['trumpepstein-connections'],
    connectionIds: ['katie-johnson-jane-doe'],
    sources: ['OSINT']
  });
  console.log('  ADD person: norm-lubow');
}

// ============================================================
// PART 10: ALL OTHER ACCUSER ENTRIES
// ============================================================

console.log('\n=== PART 10: ACCUSER PEOPLE ENTRIES ===\n');

const accuserEntries = [
  { id: 'jessica-leeds', name: 'Jessica Leeds', summary: 'Businesswoman who alleged Trump groped her on a first-class flight in the early 1980s. "He was like an octopus. His hands were everywhere."', sources: ['NYT'] },
  { id: 'kristin-anderson', name: 'Kristin Anderson', summary: 'Alleged Trump groped her beneath her skirt at a Manhattan nightclub in the early 1990s. She was an aspiring model at the time.', sources: ['OSINT'] },
  { id: 'cathy-heller', name: 'Cathy Heller', summary: 'Alleged Trump grabbed and kissed her at a Mother\'s Day brunch at Mar-a-Lago in 1997. Husband and children corroborated.', sources: ['OSINT'] },
  { id: 'temple-taggart-mcdowell', name: 'Temple Taggart McDowell', summary: 'Miss Utah USA 1997. Accused Trump of unwanted kisses and embraces; chaperone instructed she never be left alone with him.', sources: ['NYT'] },
  { id: 'karena-virginia', name: 'Karena Virginia', summary: 'Alleged Trump grabbed her arm and touched her breast while waiting for a ride after the 1998 U.S. Open.', sources: ['CBS'] },
  { id: 'karen-johnson', name: 'Karen Johnson', summary: 'Alleged Trump grabbed her genitals and forcibly kissed her at a Mar-a-Lago New Year\'s Eve party in the early 2000s.', sources: ['OSINT'] },
  { id: 'rachel-crooks', name: 'Rachel Crooks', summary: 'Receptionist at Trump Tower who alleged Trump kissed her on the mouth without consent in an elevator in 2005.', sources: ['NYT'] },
  { id: 'natasha-stoynoff', name: 'Natasha Stoynoff', summary: 'People magazine journalist who alleged Trump pushed her against a wall and forced his tongue into her mouth at Mar-a-Lago in December 2005. Six witnesses corroborated.', sources: ['OSINT'] },
  { id: 'summer-zervos', name: 'Summer Zervos', summary: 'Apprentice contestant who alleged sexual assault in 2007 at the Beverly Hills Hotel. Filed defamation lawsuit; withdrew in 2021.', sources: ['OSINT'] },
  { id: 'jessica-drake', name: 'Jessica Drake', summary: 'Alleged Trump kissed her without permission at a 2006 charity golf event and later offered $10,000 and a jet ride to join him.', sources: ['CBS'] },
  { id: 'ninni-laaksonen', name: 'Ninni Laaksonen', summary: 'Miss Finland 2006. Alleged Trump grabbed her buttocks backstage before a Letterman taping.', sources: ['OSINT'] },
  { id: 'cassandra-searles', name: 'Cassandra Searles', summary: 'Miss Washington USA 2013. Alleged Trump continually groped her buttocks and asked her to his hotel room during Miss USA pageant.', sources: ['NPR'] },
  { id: 'mariah-billado', name: 'Mariah Billado', summary: 'Miss Vermont Teen USA 1997. Reported Trump entered the teen dressing room; told Ivanka, who said "Yeah, he does that."', sources: ['OSINT'] },
  { id: 'tasha-dixon', name: 'Tasha Dixon', summary: 'Miss Arizona USA 2001. Reported Trump entered dressing room where contestants were topless/naked.', sources: ['CBS'] },
  { id: 'samantha-holvey', name: 'Samantha Holvey', summary: 'Miss North Carolina USA 2006. Described Trump entering dressing room and "eyeing me like a piece of meat."', sources: ['CBS'] },
  { id: 'e-jean-carroll', name: 'E. Jean Carroll', summary: 'Writer. Jury found Trump liable for sexual abuse (1995/1996) and defamation. Awarded $5M + $83.3M. Both upheld on appeal. Court-adjudicated.', sources: ['NYT'] },
  { id: 'alva-johnson', name: 'Alva Johnson', summary: 'Former Trump campaign worker who alleged forcible kiss at a 2016 Florida rally. Lawsuit dismissed; she dropped it citing threats.', sources: ['OSINT'] },
  { id: 'juliet-huddy', name: 'Juliet Huddy', summary: 'Reporter who said Trump kissed her on the lips in an elevator at Trump Tower in 2005 or 2006.', sources: ['OSINT'] },
  { id: 'amy-dorris', name: 'Amy Dorris', summary: 'Former model who alleged Trump groped and forcibly kissed her at the 1997 U.S. Open. Mother and friend corroborated.', sources: ['OSINT'] },
  { id: 'beatrice-keul', name: 'Beatrice Keul', summary: 'Swiss model who alleged Trump groped her in his Plaza Hotel suite in 1993.', sources: ['OSINT'] }
];

accuserEntries.forEach(a => {
  if (!findPersonById(a.id)) {
    people.push(makePersonEntry({
      id: a.id,
      name: a.name,
      category: 'victim',
      summary: a.summary,
      categoryText: 'Alleged victim / public accuser',
      sourceText: 'Trump-Epstein\n\n' + a.summary + '\n\n---',
      sources: a.sources,
      connectionIds: ['donald-trump'],
      themeIds: ['trumpepstein-connections']
    }));
    console.log('  ADD person: ' + a.id);
  } else {
    console.log('  SKIP (exists): ' + a.id);
  }
});

// ============================================================
// PART 3: CONNECTIONS
// ============================================================

console.log('\n=== PART 3: CONNECTION EDGES ===\n');

const newConnections = [
  {
    id: 'harth-trump-victim-perpetrator',
    sourcePersonId: 'jill-harth',
    targetPersonId: 'donald-trump',
    relationshipType: 'victim-perpetrator',
    strength: 2,
    description: 'Filed 1997 lawsuit alleging sexual harassment and groping at Mar-a-Lago.',
    sources: ['NYT'],
    verificationStatus: 'contested',
    activeEras: []
  },
  {
    id: 'houraney-trump-financial',
    sourcePersonId: 'george-houraney',
    targetPersonId: 'donald-trump',
    relationshipType: 'financial',
    strength: 2,
    description: 'Organized events for Trump including the calendar girl competition.',
    sources: ['NYT'],
    verificationStatus: 'verified',
    activeEras: []
  },
  {
    id: 'houraney-epstein-social',
    sourcePersonId: 'george-houraney',
    targetPersonId: 'jeffrey-epstein',
    relationshipType: 'social',
    strength: 1,
    description: 'Organized the calendar girl competition where Trump and Epstein were the only guests.',
    sources: ['NYT'],
    verificationStatus: 'verified',
    activeEras: []
  },
  {
    id: 'harth-houraney-social',
    sourcePersonId: 'jill-harth',
    targetPersonId: 'george-houraney',
    relationshipType: 'social',
    strength: 2,
    description: 'Then-boyfriend/girlfriend during the Mar-a-Lago events.',
    sources: ['NYT'],
    verificationStatus: 'verified',
    activeEras: []
  },
  {
    id: 'bloom-doe-legal-representation',
    sourcePersonId: 'lisa-bloom',
    targetPersonId: 'katie-johnson-jane-doe',
    relationshipType: 'legal-representation',
    strength: 2,
    description: 'Attorney who represented Jane Doe in the 2016 Trump-Epstein rape lawsuit.',
    sources: ['NYT'],
    verificationStatus: 'verified',
    activeEras: []
  },
  {
    id: 'lubow-doe-social',
    sourcePersonId: 'norm-lubow',
    targetPersonId: 'katie-johnson-jane-doe',
    relationshipType: 'social',
    strength: 1,
    description: 'Played a role in filing the lawsuit under false name "Al Taylor". Former Jerry Springer producer.',
    sources: ['OSINT'],
    verificationStatus: 'verified',
    activeEras: []
  },
  {
    id: 'lucchesi-trump-social',
    sourcePersonId: 'andy-lucchesi',
    targetPersonId: 'donald-trump',
    relationshipType: 'social',
    strength: 1,
    description: 'Alleged witnessing Trump at underage sex parties in the 1990s.',
    sources: ['OSINT'],
    verificationStatus: 'unverified',
    activeEras: []
  }
];

// Add accuser->trump connections for all new accusers
accuserEntries.forEach(a => {
  const connId = `accuser-${a.id}-donald-trump`;
  newConnections.push({
    id: connId,
    sourcePersonId: a.id,
    targetPersonId: 'donald-trump',
    relationshipType: 'victim-perpetrator',
    strength: 1,
    description: `${a.name}: ${a.summary.substring(0, 100)}`,
    sources: a.sources,
    verificationStatus: 'contested',
    activeEras: []
  });
});

newConnections.forEach(conn => {
  const exists = connections.find(c => c.id === conn.id);
  if (!exists) {
    connections.push(conn);
    console.log('  ADD connection: ' + conn.id);
  } else {
    console.log('  SKIP (exists): ' + conn.id);
  }
});

// Also update Trump's connectionIds and timelineEventIds
const newTimelineIds = timeline.filter(e => e.peopleIds.includes('donald-trump')).map(e => e.id);
newTimelineIds.forEach(tid => {
  if (!trump.timelineEventIds.includes(tid)) {
    trump.timelineEventIds.push(tid);
  }
});

// Update Trump connectionIds
const trumpConnIds = connections
  .filter(c => c.sourcePersonId === 'donald-trump' || c.targetPersonId === 'donald-trump')
  .map(c => c.sourcePersonId === 'donald-trump' ? c.targetPersonId : c.sourcePersonId);
trumpConnIds.forEach(cid => {
  if (!trump.connectionIds.includes(cid)) {
    trump.connectionIds.push(cid);
  }
});

console.log(`\nConnections total: ${connections.length}`);
console.log(`People total: ${people.length}`);

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

console.log('\nDone! Run `npm run build` to validate.');
