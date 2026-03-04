# Claude Code Task: Integrate Trump Sexual Misconduct Allegations into Website

## Source Document

**Wikipedia — "Donald Trump sexual misconduct allegations"**
URL: https://en.wikipedia.org/wiki/Donald_Trump_sexual_misconduct_allegations
Last edited: February 26, 2026

This article documents 28+ women accusing Trump of sexual misconduct since the 1970s, including rape, assault, groping, and non-consensual kissing. It contains a dedicated section on the Trump–Epstein relationship and the 2025–2026 EFTA file releases with NTOC allegations. Much of this content overlaps with and supplements what already exists in the database — but significant material is **new** or provides **additional detail** the site currently lacks.

---

## Scope of This Task

This task has **three parts**:

1. **Timeline entries** — Add new dated events to `src/data/timeline.json` (and the source markdown `epstein_master_timeline.md` if maintaining parity)
2. **People dossier updates** — Enrich the Trump entry in `src/data/people.json` and add new person entries for accusers not yet in the database
3. **Connections data** — Add new edges to `src/data/connections.json` for newly documented relationships

**Guiding principle:** Only integrate material that is (a) relevant to the Epstein case, (b) provides new dated events or factual detail not already in the database, or (c) contextualizes Trump's pattern of behavior in ways relevant to understanding the Epstein allegations. Do NOT turn the Epstein database into a general Trump misconduct catalog — stay focused on Epstein-adjacent material.

---

## PART 1: TIMELINE ENTRIES TO ADD OR ENRICH

For each entry below, check if the event already exists in `src/data/timeline.json`. If it does, **merge new details** (the redundancy rule). If it doesn't, **create a new entry** following the existing format.

### New Timeline Events (Epstein-Relevant)

#### ~1990 — Trump and Epstein Meet / Early Friendship
**Already exists as:** `~1988–1989 — Trump and Epstein Meet`
**Action:** ENRICH with: "Epstein bought a mansion two miles north of Mar-a-Lago, which Trump had purchased in 1985. The proximity of their residences anchored the early friendship."

#### November 1992 — NBC Footage of Trump-Epstein Party with Cheerleaders
**Already exists as:** `1992-11 — "Calendar Girl" Party at Mar-a-Lago`
**Action:** ENRICH with detail from Wikipedia: "In 1992, NBC News cameras saw the two partying with a group of Buffalo Bills cheerleaders. Trump invited NBC News to film a party he threw for himself and Epstein at Mar-a-Lago. NBC News revealed footage of the party in July 2019, showing Trump, Epstein and the cheerleaders. At one point during the video, Trump grabbed a woman around her waist, pulled her against his body, and patted her buttocks. At another point, Trump appears to tell Epstein: 'Look at her, back there... She's hot.' Trump was seen dancing with a crowd of young women and whispering in Epstein's ear." **Source:** NBC News (revealed July 2019); NYT July 19, 2025.

#### December 1992 — Jill Harth Assault Allegation (Dinner)
**Check if exists.** If not, add:
```
People: Donald Trump, Jill Harth, George Houraney
Source: Wikipedia (NYT May 2016 "Crossing the Line"), Harth v. Trump lawsuit (1997)
```
Harth stated that during dinner with Trump and her then-boyfriend George Houraney, Trump attempted to put his hands between her legs. Note: Houraney is the same person who arranged the Trump-Epstein "calendar girl competition" — this connects Harth's allegations directly to the Epstein orbit.

#### January 1993 — Jill Harth Assault at Mar-a-Lago (Ivanka's Bedroom)
**Check if exists.** If not, add:
```
People: Donald Trump, Jill Harth
Source: Wikipedia (NYT "Crossing the Line"), Harth lawsuit
```
Harth and Houraney visited Mar-a-Lago for a contract-signing celebration. Trump allegedly offered a tour, then pushed Harth against a wall in Ivanka's empty bedroom, hands all over her, trying to kiss her. She managed to escape. They left rather than stay the night. **Relevance:** This occurred at Mar-a-Lago, a key Epstein-related location, and involves the same social circle (Houraney organized events for both Trump and Epstein).

#### 1993 — Epstein Attends Trump-Maples Wedding
**Check if exists.** If not, add:
```
People: Jeffrey Epstein, Donald Trump, Marla Maples
Source: Wikipedia; CNN July 22, 2025
```
Epstein attended Trump's wedding to Marla Maples in 1993. Source: CNN exclusive newly discovered photos/video (July 22, 2025).

#### 1993 — Stacey Williams Groping Allegation
**Already exists in people dossier.** Ensure timeline entry exists:
```
People: Donald Trump, Jeffrey Epstein, Stacey Williams
Source: The Guardian Oct 23, 2024; Wikipedia
```
Former Sports Illustrated model alleged Trump groped her in 1993 while Epstein looked on. Williams said Trump and Epstein were "really, really good friends." In 2017, Epstein told journalist Michael Wolff he had been Trump's "closest friend for 10 years." Williams was the 27th person to accuse Trump of sexual misconduct.

#### 1993 — Beatrice Keul Groping Allegation at Plaza Hotel
**Check if exists.** If not, add:
```
People: Donald Trump, Beatrice Keul
Source: Daily Mail Oct 30, 2024; Wikipedia
```
Swiss model Beatrice Keul said Trump groped her in 1993 in his suite at New York's Plaza Hotel. **Relevance:** The Plaza Hotel was a known Epstein social venue.

#### 1994 — "Katie Johnson" / Jane Doe Alleged Rape (Age 13)
**Already exists.** ENRICH with Wikipedia details:
- April 2016: first filing in California
- May 2016: dismissed for not raising valid federal claims
- June 2016: refiled in New York as "Jane Doe"
- September 2016: refiled again
- November 2, 2016: scheduled press conference at Lisa Bloom's office, abruptly canceled due to threats
- November 4, 2016: lawsuit withdrawn
- July 2016 Guardian investigation: lawsuits appeared organized by Norm Lubow, "associated in the past with a range of disputed claims involving celebrities including OJ Simpson and Kurt Cobain"
- August 2024 Snopes: Lubow confirmed to Snopes he played a role, filed under false name "Al Taylor"
- Julie K. Brown (2021 book): Lisa Bloom asserted accuser dropped case on her own, no Trump payoff, accuser has not contacted Bloom since 2016
- Jane Doe's formal declaration: "I loudly pleaded with Defendant Trump to stop, but he did not. Defendant Trump responded to my pleas by violently striking me in the face with his open hand and screaming that he would do whatever he wanted."

#### Mid-1990s — Trump Flights on Epstein's Jet
**Check if exists.** If not, add:
```
People: Donald Trump, Jeffrey Epstein
Source: Court records; NYT July 19, 2025; Wikipedia
```
Court records showed Trump flew on Epstein's private jet at least seven times over four years in the 1990s.

#### 1996 — Lisa Boyne Dinner Allegation
**Check if exists.** Evaluate Epstein relevance — involves modeling agent John Casablancas, who is connected to Epstein's modeling network through MC2/Brunel. If relevant:
```
People: Donald Trump, John Casablancas, Lisa Boyne, Sonja Morgan
Source: HuffPost Oct 13, 2016; Wikipedia
```
Boyne alleged Trump made models walk across a table, looked under their skirts, described their underwear. **Relevance:** Casablancas ties to Epstein's modeling pipeline.

#### 1997 — Trump and Epstein at Victoria's Secret "Angels" Party
**Check if exists.** If not, add:
```
People: Donald Trump, Jeffrey Epstein
Source: NYT July 19, 2025; Wikipedia
```
Trump and Epstein were spotted at a 1997 Victoria's Secret "Angels" party in Manhattan. **Relevance:** Victoria's Secret/Wexner connection is a core Epstein thread.

#### 1997 — Amy Dorris Assault Allegation at U.S. Open
**Check if exists.** If not, add:
```
People: Donald Trump, Amy Dorris, Jason Binn, Jeffrey Epstein (contextual)
Source: The Guardian Sep 17, 2020; Wikipedia
```
Former model alleged Trump groped and forcibly kissed her at the 1997 U.S. Open. She attended with boyfriend Jason Binn, who described Trump as "his best friend." The Guardian confirmed she told her mother and a friend immediately after.

#### 2002 — Trump Quote About Epstein in New York Magazine
**Likely exists.** Ensure exact quote is present: "I've known Jeff for fifteen years. Terrific guy. He's a lot of fun to be with. It is even said that he likes beautiful women as much as I do, and many of them are on the younger side. No doubt about it, Jeffrey enjoys his social life."

#### 2004 — Trump-Epstein Falling Out
**Likely exists.** ENRICH with: "They reportedly became rivals when they both wanted to purchase the same oceanfront mansion in Florida. In another account, they parted ways when Epstein made advances towards the daughter of a Mar-a-Lago member." Also add Trump's July 29, 2025 statement that Epstein "hired away spa attendants from Mar-a-Lago's spa," and when asked if one was Virginia Giuffre, stated: "I think so. I think that was one of the people. He stole her."

#### 2005 — Access Hollywood Tape Recorded
**Check if timeline entry exists.** This is contextual but important — many Epstein-related accusers cited this tape as their motivation to come forward. Brief entry:
```
People: Donald Trump, Billy Bush
Source: Washington Post Oct 8, 2016; Wikipedia
```
Recording of Trump saying "when you're a star, they let you do it. You can do anything... Grab 'em by the pussy." Multiple subsequent accusers in both Trump misconduct cases and Epstein-related matters cited this tape as motivation to speak publicly.

#### 2016 — E. Jean Carroll Rape Lawsuit & Verdicts (1995/1996 incident)
**Relevant as legal context.** Timeline entries for:
- November 4, 2019: Carroll files defamation lawsuit
- November 2022: Carroll files battery suit under Adult Survivors Act
- May 9, 2023: Jury finds Trump liable for sexual abuse, awards $5M
- July 19, 2023: Judge Kaplan clarifies jury found Trump raped Carroll per common definition
- January 26, 2024: Trump ordered to pay additional $83.3M
- December 30, 2024: $5M verdict upheld on appeal
- June 13, 2025: Second Circuit declines to reconsider
- September 8, 2025: $83.3M upheld; presidential immunity argument rejected

**Relevance:** The Carroll case establishes a court-adjudicated finding of sexual abuse by Trump in the same timeframe as the Epstein friendship.

#### October 25, 2016 — Underage Sex Party Allegations
**Check if exists.** If not, add:
```
People: Donald Trump, Andy Lucchesi, [unnamed photographer]
Source: news.com.au, Times of Israel, NY Daily News; Wikipedia
```
Two men alleged Trump attended sex parties with underage girls (as young as 15) who were induced with promises of career advancement. Illegal drugs allegedly provided to minors. Lucchesi said he saw Trump engage in sexual activity with the girls. Girls were described as "14, look 24." **Verification status: UNVERIFIED — testimony of two named/anonymous sources only.**

#### June 6, 2025 — Musk Post About Trump in Epstein Files
**Check if exists.** If not, add:
```
People: Elon Musk, Donald Trump
Source: Musk social media post; Wikipedia
```
Elon Musk posted (as part of Trump–Musk feud) that Trump appeared in files related to Epstein and that this was "the real reason why the files have not been made public."

#### July 7, 2025 — Bondi Memo: No Epstein "Client List"
**Likely exists.** Ensure it notes: Bondi stated no evidence Epstein had a client list or blackmailed prominent individuals. Also confirmed Epstein committed suicide. Caused uproar among MAGA supporters.

#### July 16, 2025 — Trump Calls Supporters "Stupid" Over Epstein Demands
**Check if exists.** If not, add:
```
People: Donald Trump
Source: ABC News Jul 16, 2025; NBC News Jul 16, 2025; Wikipedia
```
In social media posts, Trump called continuing demands for file release "a hoax perpetrated by Democrats" and said supporters pressing for release were "stupid," "foolish," and "past supporters."

#### July 17, 2025 — WSJ Birthday Letter Story
**Likely exists.** ENRICH with detail: "The letter, which bore Trump's signature, featured several lines of typewritten text framed by the outline of a naked woman, apparently hand-drawn with a heavy marker. The WSJ described Trump's 'squiggly' signature below the woman's waist as mimicking pubic hair. The letter concluded: 'Happy Birthday — and may every day be another wonderful secret.'" Letter was in a leather-bound photo album collected by Maxwell.

#### July 18, 2025 — Trump Files $20B Libel Lawsuit vs. WSJ
**Check if exists.** Current data references $10B — Wikipedia says: "Trump filed a libel lawsuit against The Wall Street Journal in the Southern District of Florida for two counts of defamation for $10 billion each, for a total of $20 billion." Verify and correct if needed.

#### July 29, 2025 — Trump "He Stole Her" Comment About Giuffre
**Check if exists.** If not, add:
```
People: Donald Trump, Jeffrey Epstein, Virginia Giuffre
Source: Wikipedia; media reports Jul 29, 2025
```
When asked about the Trump-Epstein falling out, Trump said Epstein "hired away spa attendants from Mar-a-Lago's spa." Asked if one was Virginia Giuffre: "I think so. I think that was one of the people. He stole her." **This is significant** — it's an on-the-record Trump statement connecting Giuffre to both Mar-a-Lago and Epstein's recruitment pipeline.

#### December 19–20, 2025 — Trump Photo Removed and Restored from DOJ Files
**Likely exists.** Ensure the detail: "Less than one day later, file #468, which showed a photograph of Trump and Epstein together, was removed from the website. The file was later restored." EFTA doc: EFTA00000468.

#### December 23, 2025 — "Epstein Letter to Nassar" Release
**Likely exists.** ENRICH with: DOJ said letter was fake — "several irregularities with the note and envelope": writing doesn't match Epstein's; return address didn't list jail or inmate number; envelope postmarked from northern Virginia while Epstein detained in New York; postmarked three days after Epstein died.

#### December 23, 2025 — Flight Records Email Released
**Check if exists.** Manhattan AUSA email stated Epstein's flight records revealed "that Donald Trump traveled on Epstein's private jet many more times than previously has been reported (or that we were aware), including during the period we would expect to charge in a Maxwell case."

#### January 30, 2026 — "NTOC Names" Email Released
**Likely exists.** ENRICH with Wikipedia's comprehensive breakdown of all NTOC allegations:

1. **1984 Lake Michigan allegation** — woman claimed uncle trafficked her to Epstein at age 13 while pregnant; Trump allegedly witnessed baby murder and dumping in Lake Michigan; claimed Trump "participated regularly in paying money to force me to perform sex acts with him." Snopes: dates don't align with established Trump-Epstein timeline.

2. **~1990 oral rape allegation** — complaint alleges Trump forced 13–14 year old to perform oral sex; girl bit Trump during act, he allegedly hit her. Complainant is female friend of alleged victim. Unlike many NTOC tips, this lead was sent to FBI's Washington office and accuser was **interviewed by FBI four times**. Only one interview released; per log of Maxwell discovery material, **eight documents totaling 53 pages are missing** from public release. Described in internal FBI PowerPoint deck about "prominent names."

3. **1995 limousine allegation** — driver heard Trump reference "Epstein" and "abusing some girl"; woman said "he raped me" and "Donald J. Trump had raped her along with Jeffrey Epstein." Woman later "found with her head 'blown off' in Kiefer, OK" — police said "definitely not a suicide" while coroner ruled it was. January 30 release added: driver was taking Trump to Dallas-Fort Worth International Airport; driver spoke about being "a few seconds from pulling the limousine over on the median."

4. **1995–1996 Trump Golf Course allegation** — woman accused Trump of being client for sex-trafficking at Trump Golf Course in Rancho Palos Verdes, CA; claims Maxwell acted as broker for sex parties for Epstein, Trump, and Robin Leach; claims Trump's head of security threatened her. Heard rumors of girls going missing, murdered and buried at facility. **Report indicates complainant was spoken to and deemed not credible.**

5. **Victoria's Secret Models allegation** — alleged victim claims at 16, herself and other young girls/older Victoria's Secret models were in "big orgy parties" with Trump and Bill Clinton at Epstein's NYC residence.

6. **Mar-a-Lago allegation** — complainant alleges Trump raped her at 13 at Mar-a-Lago party; accuses Trump of inserting fingers into vaginas/vulvas of children to "rate them on tightness" for auction; alleges Elon Musk, Donald Trump Jr., Ivanka Trump, Eric Trump, Alan Dershowitz, and Robert Shapiro attended. **Note the presence of Elon Musk is anachronistic for the alleged time period and should be flagged.**

7. **1987 Trump Plaza allegation** — caller's friend allegedly drugged and raped by Trump at Trump Plaza; woke up sore with $300 and no clothes; friend eventually disappeared and was declared deceased.

---

## PART 2: PEOPLE DOSSIER UPDATES

### Enrich Existing Entry: Donald Trump

Add a new section to Trump's people.json entry:

#### Section: "Broader Sexual Misconduct Pattern"
```
At least 28 women have accused Trump of sexual misconduct since the 1970s, 
including rape, assault, groping, and non-consensual kissing. Key legal 
outcomes: E. Jean Carroll jury found Trump liable for sexual abuse (May 2023, 
$5M damages) and defamation ($83.3M, January 2024); both upheld on appeal. 
Judge Kaplan stated the jury found Trump raped Carroll per the common definition. 
Former wife Ivana described an incident in a 1990 deposition as "rape" but later 
recanted. Jill Harth filed a 1997 lawsuit alleging non-consensual groping of 
"intimate private parts" at Mar-a-Lago — the same venue central to Epstein 
allegations. Steve Bannon said Trump lawyer Marc Kasowitz "took care of 100 
women" during the 2016 campaign. In the 2005 Access Hollywood tape, Trump 
stated: "when you're a star, they let you do it. You can do anything... 
Grab 'em by the pussy." Multiple Epstein-related accusers cited this tape 
as motivation to come forward.

**Relevance to Epstein case:** The pattern establishes (a) court-adjudicated 
sexual abuse during the Epstein friendship period, (b) multiple allegations 
involving Mar-a-Lago and pageant/modeling settings that overlap with Epstein's 
recruitment pipeline, (c) the Harth allegations directly involve the 
Houraney-organized events that included Epstein, and (d) allegations of 
underage sex parties in the mid-1990s parallel the timeframe of the 
"Katie Johnson" / Jane Doe lawsuit.
```
**Sources:** Wikipedia, NYT, WaPo, court records
**Verification status:** Mixed — Carroll verdict is court-adjudicated; NTOC tips are unverified; Harth lawsuit was withdrawn after settlement of related claim.

#### Section: "E. Jean Carroll Verdict"
```
On May 9, 2023, a jury found Trump liable for sexually abusing writer E. Jean 
Carroll in 1995 or 1996 and defaming her. Awarded $5M. Judge Kaplan later 
clarified: the jury found Trump raped Carroll per the common definition 
(forcible, nonconsensual digital penetration of her vagina). New York's 
statutory definition at the time defined rape as solely penile penetration. 
January 26, 2024: additional $83.3M in defamation damages. Both verdicts 
upheld on appeal (December 30, 2024 and September 8, 2025). Trump's 
presidential immunity argument was rejected. Interest continues to accrue on 
unpaid amounts.
```
**Sources:** Court records, Reuters, NYT
**Verification status:** Court-adjudicated

#### Section: "November 2025 — 'Quiet, Piggy' Incident"
```
In November 2025, Trump said "quiet, piggy" to a female reporter, described 
by The Boston Globe as the second personal attack on a female reporter within 
a week. [Wikipedia; Boston Globe Nov 19, 2025]
```

### New People Entries (Epstein-Adjacent Only)

Only create entries for individuals who have direct Epstein relevance. The following qualify:

#### Jill Harth
```json
{
  "id": "jill-harth",
  "name": "Jill Harth",
  "category": "accuser",
  "summary": "Filed 1997 lawsuit against Trump alleging sexual harassment and groping at Mar-a-Lago. Her boyfriend George Houraney organized the Trump-Epstein 'calendar girl competition.'",
  "sections": [
    {
      "title": "Allegations",
      "content": "December 1992: alleged Trump attempted to put his hands between her legs during dinner with Houraney present. January 1993: alleged Trump pushed her against a wall in Ivanka's bedroom at Mar-a-Lago during a contract-signing visit, hands all over her, trying to kiss her. Filed 1997 lawsuit alleging non-consensual groping of 'intimate private parts' and 'relentless' sexual harassment. Suit withdrawn after Houraney settled a separate business dispute with Trump. Harth received therapy for 'a couple years' afterward. In 2015, contacted Trump's campaign for makeup artist work. [Wikipedia; NYT 'Crossing the Line' May 2016; Guardian Oct 2016]",
      "sources": ["Wikipedia", "NYT", "Guardian"],
      "verificationStatus": "partial"
    },
    {
      "title": "Epstein Connection",
      "content": "Her boyfriend George Houraney organized the 'calendar girl competition' at Mar-a-Lago where Trump and Epstein were the only two guests. The Harth assault allegations stem from events in the same social orbit and venue as the Trump-Epstein relationship.",
      "sources": ["NYT", "Wikipedia"],
      "verificationStatus": "verified"
    }
  ],
  "connectionIds": ["donald-trump", "jeffrey-epstein"],
  "sources": ["Wikipedia", "NYT", "Guardian"]
}
```

#### George Houraney
```json
{
  "id": "george-houraney",
  "name": "George Houraney",
  "category": "associate",
  "summary": "Event organizer who arranged the Trump-Epstein 'calendar girl competition' at Mar-a-Lago where Trump and Epstein were the only guests.",
  "sections": [
    {
      "title": "Role",
      "content": "Organized events for Trump including the 'calendar girl competition' at Mar-a-Lago. According to Houraney, Trump and Epstein were the only guests at this event. Houraney's then-girlfriend Jill Harth filed a sexual harassment lawsuit against Trump stemming from these events. Houraney settled a separate business dispute with Trump for an undisclosed amount. [Wikipedia; NYT July 19, 2025]",
      "sources": ["Wikipedia", "NYT"],
      "verificationStatus": "verified"
    }
  ],
  "connectionIds": ["donald-trump", "jeffrey-epstein", "jill-harth"],
  "sources": ["Wikipedia", "NYT"]
}
```

#### Andy Lucchesi
```json
{
  "id": "andy-lucchesi",
  "name": "Andy Lucchesi",
  "category": "witness",
  "summary": "Model/actor who alleged in October 2016 that Trump attended underage sex parties. Self-described acquaintance of Trump during 'his Trump days.'",
  "sections": [
    {
      "title": "Allegations",
      "content": "In October 2016, alleged Trump attended and partook in sex parties with underage minor females as young as 15 who were induced with promises of career advancement. Said he saw Trump engage in sexual activity with the girls but did not witness drug use. Regarding ages: 'a lot of girls, aged 14, look 24.' [Wikipedia; news.com.au Oct 25, 2016; NY Daily News]",
      "sources": ["Wikipedia", "news.com.au"],
      "verificationStatus": "unverified"
    }
  ],
  "connectionIds": ["donald-trump"],
  "sources": ["Wikipedia"]
}
```

#### Lisa Bloom
```json
{
  "id": "lisa-bloom",
  "name": "Lisa Bloom",
  "category": "legal",
  "summary": "Attorney who represented 'Katie Johnson'/Jane Doe in the 2016 Trump-Epstein rape lawsuit. Confirmed accuser dropped case on her own, no payoff.",
  "sections": [
    {
      "title": "Role in Doe v. Trump",
      "content": "Represented Jane Doe in the 2016 civil lawsuit alleging rape by Trump and Epstein. Scheduled November 2, 2016 press conference but Doe abruptly canceled due to 'multiple threats.' Bloom stated: 'I was trying to go in the direction of airing her story publicly, and it was frankly embarrassing for me to cancel it. I took her out the back stairway and she instructed me to drop the case.' Bloom said Johnson/Doe disappeared and 'I don't know where she is and haven't spoken to her since 2016.' Confirmed Trump's people never reached out — no payoff. [Wikipedia; Julie K. Brown 'Perversion of Justice' (2021)]",
      "sources": ["Wikipedia", "Julie K. Brown book"],
      "verificationStatus": "verified"
    }
  ],
  "connectionIds": ["katie-johnson-jane-doe", "donald-trump"],
  "sources": ["Wikipedia"]
}
```

#### Norm Lubow
```json
{
  "id": "norm-lubow",
  "name": "Norm Lubow",
  "category": "associate",
  "summary": "Former Jerry Springer producer who played a role in filing the 'Katie Johnson' lawsuit against Trump and Epstein under the false name 'Al Taylor.'",
  "sections": [
    {
      "title": "Role",
      "content": "Guardian investigation (July 2016) found lawsuits appeared to be organized by Lubow, 'who has been associated in the past with a range of disputed claims involving celebrities including OJ Simpson and Kurt Cobain.' Confirmed to Snopes (August 2024) that he played a role in filing the lawsuit under false name 'Al Taylor.' Snopes noted: 'Lubow's involvement does not disprove that Johnson is a real person, but it does show that those claims were aggressively promoted and aided by someone who has a professional history of using individuals to create fictional salacious drama.' [Wikipedia; Guardian Jul 2016; Snopes Aug 2024]",
      "sources": ["Wikipedia", "Guardian", "Snopes"],
      "verificationStatus": "verified"
    }
  ],
  "connectionIds": ["katie-johnson-jane-doe"],
  "sources": ["Wikipedia", "Guardian", "Snopes"]
}
```

---

## PART 3: CONNECTIONS TO ADD

Add these edges to `src/data/connections.json`:

```json
[
  {
    "sourcePersonId": "jill-harth",
    "targetPersonId": "donald-trump",
    "relationshipType": "accuser-accused",
    "strength": 2,
    "description": "Filed 1997 lawsuit alleging sexual harassment and groping at Mar-a-Lago.",
    "sources": ["Wikipedia", "NYT"],
    "verificationStatus": "partial"
  },
  {
    "sourcePersonId": "george-houraney",
    "targetPersonId": "donald-trump",
    "relationshipType": "business",
    "strength": 2,
    "description": "Organized events for Trump including the calendar girl competition.",
    "sources": ["Wikipedia", "NYT"],
    "verificationStatus": "verified"
  },
  {
    "sourcePersonId": "george-houraney",
    "targetPersonId": "jeffrey-epstein",
    "relationshipType": "social",
    "strength": 1,
    "description": "Organized the calendar girl competition where Trump and Epstein were the only guests.",
    "sources": ["Wikipedia", "NYT"],
    "verificationStatus": "verified"
  },
  {
    "sourcePersonId": "jill-harth",
    "targetPersonId": "george-houraney",
    "relationshipType": "personal",
    "strength": 2,
    "description": "Then-boyfriend/girlfriend during the Mar-a-Lago events.",
    "sources": ["Wikipedia"],
    "verificationStatus": "verified"
  },
  {
    "sourcePersonId": "lisa-bloom",
    "targetPersonId": "katie-johnson-jane-doe",
    "relationshipType": "legal-representation",
    "strength": 2,
    "description": "Attorney who represented Jane Doe in the 2016 Trump-Epstein rape lawsuit.",
    "sources": ["Wikipedia"],
    "verificationStatus": "verified"
  },
  {
    "sourcePersonId": "norm-lubow",
    "targetPersonId": "katie-johnson-jane-doe",
    "relationshipType": "associated",
    "strength": 1,
    "description": "Played a role in filing the lawsuit under false name 'Al Taylor'. Former Jerry Springer producer.",
    "sources": ["Wikipedia", "Guardian", "Snopes"],
    "verificationStatus": "verified"
  },
  {
    "sourcePersonId": "andy-lucchesi",
    "targetPersonId": "donald-trump",
    "relationshipType": "witness",
    "strength": 1,
    "description": "Alleged witnessing Trump at underage sex parties in the 1990s.",
    "sources": ["Wikipedia"],
    "verificationStatus": "unverified"
  }
]
```

---

## PART 4: VERIFICATION STATUS GUIDELINES

Apply these verification labels consistently:

| Status | Criteria | Example |
|--------|----------|---------|
| `court-adjudicated` | Jury verdict or judicial finding | Carroll sexual abuse finding |
| `verified` | Confirmed by multiple independent sources or official records | NBC party footage; flight records |
| `partial` | Some corroboration but disputed elements | Harth lawsuit (filed, then withdrawn after settlement) |
| `unverified` | Single source, anonymous tip, or uncorroborated | NTOC allegations |
| `discrepancy` | Conflicting information between sources | DOJ "untrue" label vs. NPR missing pages finding |
| `debunked` | Specific evidence contradicts claim | Nassar letter (postmarked after Epstein's death) |

---

## PART 5: SOURCE ATTRIBUTION

When adding these entries, cite as follows:

```
Source: Wikipedia ("Donald Trump sexual misconduct allegations," 
last edited Feb 26, 2026), citing [original source]
```

Always trace back to the **original reporting source** listed in Wikipedia's references rather than citing Wikipedia as a primary source. Key original sources from this article:

- NYT "Crossing the Line" (May 14, 2016) — Barbaro & Twohey
- NYT "Inside the Long Friendship" (July 19, 2025) — Feuer & Goldstein
- NYT "How Trump Appears in the Epstein Files" (February 1, 2026) — Eder, Bender, Enrich
- NYT "Feds Release Document of Tips" (January 30, 2026) — Confessore
- WSJ Birthday Letter story (July 20, 2025) — Safdar & Palazzolo
- CNN exclusive photos/video (July 22, 2025) — Kaczynski
- The Guardian assault allegations (multiple dates)
- NBC News Mar-a-Lago party footage (July 2019)
- Snopes fact-checks (August 2024, December 2025)
- NPR investigation (February 24, 2026) — Fowler
- EFTA document numbers: EFTA00000468, EFTA01660679, EFTA01660651, EFTA00025010, EFTA02158332

---

## PART 6: SEARCH INDEX UPDATES

After adding the above entries, rebuild the search index (`src/data/search-index.json`) to include new terms:

**New searchable terms to ensure are indexed:**
- "Jill Harth"
- "George Houraney"  
- "calendar girl competition"
- "Access Hollywood tape"
- "E. Jean Carroll"
- "Lisa Bloom"
- "Norm Lubow" / "Al Taylor"
- "Andy Lucchesi"
- "Beatrice Keul"
- "Amy Dorris"
- "Stacey Williams"
- "underage sex parties"
- "NTOC Names"
- "quiet piggy"
- "birthday letter"
- "he stole her"

---

## EXECUTION ORDER

1. Read existing `src/data/timeline.json`, `src/data/people.json`, and `src/data/connections.json`
2. For each timeline entry in Part 1, check for duplicates → merge or create new
3. Apply people dossier updates (Part 2)
4. Add connection edges (Part 3)
5. Run `npm run build` to verify no data schema errors
6. Rebuild search index
7. Verify all new entries render correctly on `/timeline`, `/people/donald-trump`, and `/search`

---

## WHAT NOT TO ADD

- Full text of legal filings — link to sources instead
- Editorializing or characterizing the allegations beyond what sources state
- Michelle Obama's speech, political reactions, #WhyWomenDontReport — these are aftermath/culture, not investigative data
- Partisan political commentary or campaign-related reactions (Fox News/MSNBC takes, etc.)

---

## PART 7: NON-EPSTEIN SEXUAL MISCONDUCT ALLEGATIONS (FULL CATALOG)

**Rationale for inclusion:** These allegations establish a documented behavioral pattern spanning decades that contextualizes the Epstein-specific allegations. The pattern of conduct — particularly involving young women, models, pageant contestants, and abuse of power dynamics — is directly relevant to evaluating the credibility and context of the Epstein-related claims. The site should present these as a dedicated subsection within Trump's people dossier and as timeline entries where dated.

### Section for Trump People Dossier: "Complete Misconduct Allegation Catalog"

Add this as a new section in Trump's `people.json` entry. Organize chronologically.

#### Ivana Trump (1989)
In a 1990 divorce deposition, Ivana stated Donald attacked her sexually after visiting her plastic surgeon — ripping out hair from her scalp. Harry Hurt III's book *Lost Tycoon* (1993) described the incident as a "violent assault" and sexual attack. Ivana later issued a statement: she "referred to this as a 'rape,' but I do not want my words to be interpreted in a literal or criminal sense." Divorce granted December 1990 on grounds of "cruel and inhuman" treatment. Settlement included a confidentiality clause. In 2015 campaign endorsement, Ivana said: "The story is totally without merit." **Sources:** Deposition; Hurt (1993); NBC Oct 2016; People Dec 1990.

#### Jessica Leeds (~Early 1980s)
Businesswoman on a flight from the Midwest. A flight attendant offered her a first-class seat next to Trump. After ~45 minutes, Trump allegedly lifted the armrest, grabbed her breasts, and tried to put his hand up her skirt. "He was like an octopus. His hands were everywhere." Published by NYT October 2016. Trump threatened to sue the NYT; never followed through. A claimed witness (Anthony Gilberthorpe, former British Conservative councillor) said he saw "nothing untoward" — but Gilberthorpe has a history of making false allegations against politicians. **Sources:** NYT Oct 12, 2016; Guardian Oct 15, 2016.

#### Kristin Anderson (~Early 1990s)
Alleged Trump groped her beneath her skirt in a Manhattan nightclub (believed to be the China Club, described by Newsday as "Donald's Monday-night nest"). She was an aspiring model at the time. She told friends and came forward after reading other women's accounts. **Sources:** WaPo Oct 14, 2016.

#### Jill Harth (1992–1993)
**[See Part 1 — this entry has Epstein connections through Houraney]**

#### Lisa Boyne (1996)
**[See Part 1 — Casablancas connection to Epstein modeling network]**

#### E. Jean Carroll (1995/1996)
**[See Part 1 — court-adjudicated sexual abuse during Epstein friendship period]**

#### Cathy Heller (1997)
Alleged Trump grabbed and kissed her at a Mother's Day brunch at Mar-a-Lago. Her in-laws were members. When she avoided a kiss, Trump became angry, "grabbed" her and kissed her on the side of the mouth "for a little too long." Husband and children corroborated her account. Members of her mahjong group heard the account in summer 2015, before she went public. **Sources:** Guardian Oct 15, 2016; People Oct 16, 2016. **Relevance:** Mar-a-Lago venue; pattern of non-consensual physical contact at the same location as Epstein-related events.

#### Temple Taggart McDowell (1997)
Miss Utah USA 1997. Accused Trump of unwanted kisses and embraces that left her and her chaperone uncomfortable enough that she was told never to be left alone with him again. This was Trump's first year of Miss USA ownership. She is a Republican and did not come forward to support Clinton. **Sources:** NYT "Crossing the Line" May 2016; NBC Oct 2016.

#### Amy Dorris (1997)
**[See Part 1 — U.S. Open allegation]**

#### Karena Virginia (1998)
Alleged Trump grabbed her arm and touched her breast while she waited for a ride after the U.S. Open in Queens. She was 27, had not met Trump previously. Trump approached with a group of men, commented on her legs, grabbed her right arm, touched her breast. "Don't you know who I am?" Attorney Gloria Allred represented her. **Sources:** Guardian Oct 20, 2016; CBS Oct 20, 2016.

#### Karen Johnson (~Early 2000s)
Alleged Trump grabbed her by her genitals, pulled her behind a tapestry, and forcibly kissed her at a New Year's Eve party at Mar-a-Lago. Johnson alleged Trump repeatedly called her afterward (without her giving him her number), offering to fly her to meet him. She rejected all offers. A friend corroborated she told this story years before Trump ran for president. **Sources:** *All the President's Women* (Levine & El-Faizy, 2019); Vox Oct 2019. **Relevance:** Mar-a-Lago venue.

#### Bridget Sullivan (2000)
Miss New Hampshire USA 2000. Alleged Trump walked into the dressing room as contestants prepared. "He was coming to wish the contestants good luck, but they were all naked." **Sources:** BuzzFeed Oct 2016. **[See also Part 8: Pageant Dressing Room Visits]**

#### Tasha Dixon (2001)
Miss Arizona USA 2001. "He just came strolling right in. There was no second to put a robe on or any sort of clothing or anything. Some girls were topless, other girls were naked." She said being walked in on put them in "a very physically vulnerable position, and then to have the pressure of the people that work for him telling us to go fawn all over him." **Sources:** CBS LA Oct 2016. **[See also Part 8]**

#### Mindy McGillivray (2003)
Alleged Trump groped her at Mar-a-Lago in January 2003 (age 23). "All of a sudden I felt a grab, a little nudge." Photographer Ken Davidoff corroborated: she told him immediately after, "Donald just grabbed my ass!" Ken's brother Darryl, also present, said he believes she is lying. **Sources:** Palm Beach Post Oct 2016. **Relevance:** Mar-a-Lago venue.

#### Rachel Crooks (2005)
Receptionist at Bayrock Group in Trump Tower. Encountered Trump in an elevator, introduced herself, shook hands — Trump wouldn't let go, began kissing her cheeks, then directly on the mouth. "It was so inappropriate. I was so upset that he thought I was so insignificant that he could do that." Published by NYT October 2016. **Sources:** NYT Oct 12, 2016.

#### Natasha Stoynoff (2005)
Canadian journalist for *People* magazine. Went to Mar-a-Lago in December 2005 to interview Trump and Melania. During a tour, Trump allegedly pushed her against a wall and forced his tongue into her mouth. Trump's butler allegedly "burst in" interrupting. Six witnesses corroborated she told them about the incident at the time. Melania's lawyer demanded an apology from *People*. A friend (Liza Herz) corroborated a subsequent sidewalk encounter between Stoynoff and Melania that Melania denied. **Sources:** People Oct 12, 2016; NYT Oct 18, 2016. **Relevance:** Mar-a-Lago venue.

#### Juliet Huddy (2005 or 2006)
Reporter. Said Trump kissed her on the lips in an elevator in Trump Tower with his security guard present. "I was surprised that he went for the lips. But I didn't feel threatened." **Sources:** The Hill Dec 2017; The Independent Dec 2017.

#### Summer Zervos (2007)
*Apprentice* contestant (Season 5). Contacted Trump about a job post-show. At the Beverly Hills Hotel, Trump allegedly kissed her open-mouthed, touched her breasts, thrust his genitals on her. She described the behavior as "aggressive and not consensual." Filed defamation lawsuit January 2017 after Trump called her a liar. Withdrew case November 2021 — attorneys said Trump did not pay her to withdraw. **Sources:** Rolling Stone Oct 2016; WaPo Nov 2021; BBC Jan 2017. **Note:** During the *Apprentice*, Trump was described by 20+ crew members as rating female contestants by breast size and discussing which women he wanted to have sex with (AP investigation).

#### Jessica Drake (2006)
Adult film actress and sex education advocate. Met Trump at a charity golf tournament at Lake Tahoe. Invited to his suite with two friends. "He grabbed each of us tightly, in a hug and kissed each one of us without asking permission." Later received calls offering $10,000 and a flight on his jet to join him. She declined. Trump appeared to dismiss the allegation because of her profession, saying: "Oh, I'm sure she's never been grabbed before." **Sources:** CBS Oct 22, 2016; Guardian Oct 23, 2016.

#### Ninni Laaksonen (2006)
Miss Finland 2006. Appeared with Trump on *Late Show with David Letterman* on July 26, 2006. Before air, Trump allegedly grabbed her buttocks. "He really grabbed my butt. I don't think anybody saw it but I flinched and thought: 'What is happening?'" Someone later told her Trump liked her because she looked like a younger Melania. **Sources:** Ilta-Sanomat Oct 27, 2016; Slate Oct 27, 2016.

#### Samantha Holvey (2006)
Miss North Carolina USA 2006. Said Trump's conduct was "creepy," that he "eyed me like a piece of meat," and that she saw Trump enter the dressing room where contestants were naked. Later wrote: "You can't work in Hollywood if you're a sexual predator, but you can become the commander-in-chief?" **Sources:** NBC Dec 2017; original Oct 2016 reporting.

#### Cassandra Searles (2013)
Miss Washington USA 2013. Alleged Trump was "continually" groping her buttocks during the Miss USA pageant and asked her to go "to his hotel room." Said Trump "treated us like cattle." Trump and his campaign have not specifically responded. **Sources:** Rolling Stone Oct 2016; NPR Oct 2016; Yahoo News Jun 2016.

#### Alva Johnson (2016)
Alleged Trump forcibly kissed her at a Florida rally in August 2016 while she worked on his campaign. Two witnesses, including then-Florida AG Pam Bondi, denied seeing the kiss. Also alleged race and gender discrimination through unequal pay. Lawsuit dismissed; Johnson chose not to refile, citing a hostile judge and ongoing threats to her safety. **Sources:** Vox Feb 2019; Teen Vogue Mar 2019.

---

## PART 8: PAGEANT DRESSING ROOM VISITS

Trump owned the Miss Universe franchise (including Miss USA and Miss Teen USA) from 1996 to 2015 — overlapping exactly with the period of his Epstein friendship and the alleged trafficking activity.

### Trump's Own Admission (Howard Stern, April 11, 2005)

This is a first-person, on-the-record admission. Include the full quote in the Trump dossier:

> "Well, I'll tell you the funniest is that before a show, I'll go backstage and everyone's getting dressed, and everything else, and you know, no men are anywhere, and I'm allowed to go in because I'm the owner of the pageant and therefore I'm inspecting it. You know, I'm inspecting because I want to make sure that everything is good. [...] You know, the dresses. 'Is everyone okay?' You know, they're standing there with no clothes. 'Is everybody okay?' And you see these incredible looking women, and so, I sort of get away with things like that."

When Stern asked if he had ever had sex with a contestant, Trump said: "I never comment on things like that." Stern then imitated a foreign contestant ("Mr. Trump, in my country, we say hello with vagina"), and Trump responded: "Well, you could also say, as the owner of the pageant, it's your obligation to do that."

**Important clarification (per Snopes, July 2025):** In this interview, Trump was referring to Miss USA/Miss Universe (contestants 18+). He did not reference Miss Teen USA in these comments. However, multiple Miss Teen USA contestants independently alleged he entered *their* dressing room as well (see below).

### Miss Teen USA Dressing Room Allegations (1997)

**Mariah Billado** (Miss Vermont Teen USA 1997): "I remember putting on my dress really quick, because I was like, 'Oh my god, there's a man in here.' Trump said something like, 'Don't worry, ladies, I've seen it all before.'" Billado recalled telling Ivanka Trump, who responded: "Yeah, he does that."

**Victoria Hughes** (Miss New Mexico Teen USA 1997): Confirmed Trump conducted a dressing room visit; stated the youngest contestant there was **15 years old**.

Four other women also alleged the 1997 dressing room visit. Eleven contestants said they did not see Trump enter, though some said it was possible he entered while they were elsewhere. The dressing room had 51 contestant stations.

### Miss USA Dressing Room Allegations

- **Bridget Sullivan** (2000, Miss New Hampshire USA): Trump walked in to "wish good luck" but "they were all naked."
- **Tasha Dixon** (2001, Miss Arizona USA): "He just came strolling right in. There was no second to put a robe on." Described pressure from staff to "go fawn all over him."
- **Unnamed contestants** (2001): Told *The Guardian* that Trump "just barged right in, didn't say anything, stood there and stared."
- **Samantha Holvey** (2006, Miss North Carolina USA): Saw Trump enter dressing room where contestants were naked. Described being "eyed like a piece of meat."

Trump's campaign stated the allegations "have no merit and have already been disproven by many other individuals who were present."

### Relevance to Epstein Investigation

The pageant ownership (1996–2015) overlaps precisely with the active Epstein friendship (~1990–2004) and the period when Epstein's trafficking operation was most active. Key connections:

1. **Modeling pipeline:** Epstein's associate Jean-Luc Brunel ran MC2 Model Management, which supplied young women/girls to Epstein. Trump's pageant empire operated in the same modeling/beauty industry ecosystem.
2. **Shared social venues:** Multiple pageant events and after-parties occurred at the same locations (Mar-a-Lago, Manhattan hotels) where Epstein-related events took place.
3. **Victoria's Secret connection:** Trump and Epstein were spotted at a 1997 Victoria's Secret "Angels" party. Victoria's Secret was owned by Les Wexner, Epstein's primary financial patron. The NTOC "Victoria's Secret Models" allegation names both Trump and Clinton.
4. **Pattern of access to young women:** Trump's self-described practice of entering dressing rooms of contestants (including minors per multiple accounts) parallels the access-based grooming and exploitation patterns documented in the Epstein trafficking operation.

---

## PART 9: HOWARD STERN SHOW — COMPREHENSIVE INAPPROPRIATE BEHAVIOR RECORD

Trump appeared on *The Howard Stern Show* over 17 years (~1993–2015), accumulating 15+ hours of recorded conversation and over 104,000 words. In 2017, an anonymous source sent audio files of 35 full Trump-Stern interviews to the archive site Factba.se. These interviews constitute the most extensive unfiltered record of Trump's attitudes toward women and sexuality.

### Add to Trump People Dossier: "Howard Stern Show Record"

#### Comments About Daughter Ivanka

- **2004:** Stern asked, "Can I say this? A piece of ass?" Trump replied: "Yeah." Trump also admitted promising Ivanka (when she was 17 in 1999) that he'd never date a girl younger than her.
- **2006:** Stern remarked Ivanka "looks more voluptuous than ever" and asked about breast implants. Trump: "She's actually always been very voluptuous... She's tall, she's almost 6 feet tall and she's been, she's an amazing beauty." Trump described Ivanka as having "the best body."
- **Stern's own assessment (2019, Colbert interview):** "He was completely unfiltered, he was talking about his daughter was the most attractive woman he ever met and how much he thought she was hot."

#### Comments About Minors / Young Women

- **2003 (about Paris Hilton):** "I've known Paris Hilton from the time she's 12, her parents are friends of mine, and the first time I saw her she walked into the room and I said, 'Who the hell is that?' At 12, I wasn't interested... but she was beautiful."
- **~2006:** When Stern asked if Trump "could now be banging 24-year-olds," Trump said: "Oh, absolutely. I'd have no problem." In an earlier exchange, Trump was asked about his age floor for dating and fumbled: "I don't want to be like Congressman Foley, with, you know, 12-year-olds" — a reference to the Mark Foley congressional page scandal. **Note:** This clip resurfaced in July 2025 amid the Epstein file releases.
- **2002:** Called 30 "a perfect age" for a woman. "What is it at 35, Howard? It's called checkout time."

#### Pageant Ownership and Contestants

- **April 11, 2005:** The dressing room admission (see Part 8 above for full quote).
- **2005:** When asked if he'd ever had sex with a Miss USA/Universe contestant: "I never comment on things like that." When pressed: "It could be a conflict of interest."
- **On changing pageants after purchase:** "They said, 'how are you going to change the pageant?' I said, 'I'm going to get the bathing suits to be smaller and the heels to be higher.'" He told Katie Couric: "If you're looking for a rocket scientist, don't turn in tonight. But if you're looking for a really beautiful woman, you should watch."
- **On selecting contestants:** After taking over, Trump emphasized appearance over education. "They had a person who was extremely proud that a number of the women had become doctors. And I wasn't interested."

#### Rating Women and Sexual Boasting

- Routinely rated women on a scale of 1–10 on the show. Rated Tiger Woods' then-wife Elin Nordegren "a solid nine."
- **2008:** "Some incredible beautiful women. They'll walk up and they'll flip their top, and they'll flip their panties." Claimed women threw themselves at him.
- Discussed Princess Diana: said he was "pretty sure" she would have slept with him. Made these comments weeks after her death. In a later interview said he would have slept with her "without even hesitation."
- **1997:** Discussed having sex with women on their menstrual cycles. "I've been there, Howard, as we all have."
- Admitted he was asked by Stern to rate 15 supermodels and revealed whether he'd slept with them — while married.
- Conceded he had groped Melania in public.
- When asked if he'd slept with two or three women in one day: "I have no comment. Look, I like sex, so do you."

#### Self-Awareness and Campaigns

- **1993:** "I like Howard, but I have to be crazy to be here."
- **1998 (Chris Matthews interview, not Stern but related):** "Can you imagine how controversial I'd be?... You think about Bill Clinton with the women. How about me with the women?"
- **Melania on the Stern interviews (2016, CNN):** "I didn't agree to do all the tapes on Howard Stern, with Billy Bush. Because I know those people. They hook him on, they try to get from him some inappropriate and dirty language."
- **Trump's defense (April 2016):** "I never anticipated running for office or being a politician, so I could have fun with Howard on the radio and everyone would love it."

### Relevance to Epstein Investigation

1. **Self-admitted behavior pattern:** The Stern interviews document Trump describing, in his own words, the same categories of behavior alleged by Epstein-related accusers: entering rooms where women are undressed, pursuing very young women, treating women as objects to be rated and ranked.
2. **Contemporaneous timeline:** Many of these interviews occurred during the active Epstein friendship period (1990s–2004).
3. **Paris Hilton comment (2003):** Trump's comment about noticing Paris Hilton's appearance at age 12 is relevant context for NTOC allegations involving girls aged 13–16.
4. **The "Foley" exchange:** Trump's fumbled reference to age limits for sexual partners, resurfacing in July 2025 alongside the Epstein file releases, drew direct public comparisons to the NTOC allegations.
5. **"Got away with things like that":** Trump's dressing room admission uses the same language framework ("I sort of get away with things like that") as the Access Hollywood tape ("when you're a star, they let you do it"), establishing a self-described pattern of exploiting power imbalance for sexual access.

---

## PART 10: ADDITIONAL PEOPLE ENTRIES (NON-EPSTEIN ACCUSERS)

Create entries for all named accusers. These are briefer than the Epstein-adjacent entries but should exist in the database for completeness and cross-referencing.

```json
[
  {
    "id": "jessica-leeds",
    "name": "Jessica Leeds",
    "category": "accuser",
    "summary": "Businesswoman who alleged Trump groped her on a first-class flight in the early 1980s.",
    "sources": ["NYT"]
  },
  {
    "id": "kristin-anderson",
    "name": "Kristin Anderson",
    "category": "accuser",
    "summary": "Alleged Trump groped her beneath her skirt at a Manhattan nightclub in the early 1990s.",
    "sources": ["WaPo"]
  },
  {
    "id": "cathy-heller",
    "name": "Cathy Heller",
    "category": "accuser",
    "summary": "Alleged Trump grabbed and kissed her at a Mother's Day brunch at Mar-a-Lago in 1997. Husband and children corroborated.",
    "sources": ["Guardian"]
  },
  {
    "id": "temple-taggart-mcdowell",
    "name": "Temple Taggart McDowell",
    "category": "accuser",
    "summary": "Miss Utah USA 1997. Accused Trump of unwanted kisses and embraces; chaperone instructed she never be left alone with him.",
    "sources": ["NYT"]
  },
  {
    "id": "karena-virginia",
    "name": "Karena Virginia",
    "category": "accuser",
    "summary": "Alleged Trump grabbed her arm and touched her breast while waiting for a ride after the 1998 U.S. Open.",
    "sources": ["Guardian"]
  },
  {
    "id": "karen-johnson",
    "name": "Karen Johnson",
    "category": "accuser",
    "summary": "Alleged Trump grabbed her genitals and forcibly kissed her at a Mar-a-Lago New Year's Eve party.",
    "sources": ["All the President's Women (2019)"]
  },
  {
    "id": "rachel-crooks",
    "name": "Rachel Crooks",
    "category": "accuser",
    "summary": "Receptionist at Trump Tower who alleged Trump kissed her on the mouth without consent in an elevator in 2005.",
    "sources": ["NYT"]
  },
  {
    "id": "natasha-stoynoff",
    "name": "Natasha Stoynoff",
    "category": "accuser",
    "summary": "People magazine journalist who alleged Trump pushed her against a wall and forced his tongue into her mouth at Mar-a-Lago in December 2005. Six witnesses corroborated.",
    "sources": ["People"]
  },
  {
    "id": "summer-zervos",
    "name": "Summer Zervos",
    "category": "accuser",
    "summary": "Apprentice contestant who alleged sexual assault in 2007 at the Beverly Hills Hotel. Filed defamation lawsuit; withdrew in 2021.",
    "sources": ["Rolling Stone", "WaPo", "BBC"]
  },
  {
    "id": "jessica-drake",
    "name": "Jessica Drake",
    "category": "accuser",
    "summary": "Alleged Trump kissed her without permission at a 2006 charity golf event and later offered $10,000 and a jet ride to join him.",
    "sources": ["CBS", "Guardian"]
  },
  {
    "id": "ninni-laaksonen",
    "name": "Ninni Laaksonen",
    "category": "accuser",
    "summary": "Miss Finland 2006. Alleged Trump grabbed her buttocks backstage before a Letterman taping.",
    "sources": ["Ilta-Sanomat"]
  },
  {
    "id": "cassandra-searles",
    "name": "Cassandra Searles",
    "category": "accuser",
    "summary": "Miss Washington USA 2013. Alleged Trump continually groped her buttocks and asked her to his hotel room during Miss USA pageant.",
    "sources": ["Rolling Stone", "NPR"]
  },
  {
    "id": "mariah-billado",
    "name": "Mariah Billado",
    "category": "accuser",
    "summary": "Miss Vermont Teen USA 1997. Reported Trump entered the teen dressing room; told Ivanka, who said 'Yeah, he does that.'",
    "sources": ["BuzzFeed"]
  },
  {
    "id": "tasha-dixon",
    "name": "Tasha Dixon",
    "category": "accuser",
    "summary": "Miss Arizona USA 2001. Reported Trump entered dressing room where contestants were topless/naked.",
    "sources": ["CBS LA"]
  },
  {
    "id": "samantha-holvey",
    "name": "Samantha Holvey",
    "category": "accuser",
    "summary": "Miss North Carolina USA 2006. Described Trump entering dressing room and 'eyeing me like a piece of meat.'",
    "sources": ["NBC"]
  },
  {
    "id": "e-jean-carroll",
    "name": "E. Jean Carroll",
    "category": "accuser",
    "summary": "Writer. Jury found Trump liable for sexual abuse (1995/1996) and defamation. Awarded $5M + $83.3M. Both upheld on appeal.",
    "sources": ["Court records", "Reuters", "NYT"]
  },
  {
    "id": "alva-johnson",
    "name": "Alva Johnson",
    "category": "accuser",
    "summary": "Former Trump campaign worker who alleged forcible kiss at a 2016 Florida rally. Lawsuit dismissed; she dropped it citing threats.",
    "sources": ["Vox", "Teen Vogue"]
  },
  {
    "id": "juliet-huddy",
    "name": "Juliet Huddy",
    "category": "accuser",
    "summary": "Reporter who said Trump kissed her on the lips in an elevator at Trump Tower in 2005 or 2006.",
    "sources": ["The Hill"]
  },
  {
    "id": "amy-dorris",
    "name": "Amy Dorris",
    "category": "accuser",
    "summary": "Former model who alleged Trump groped and forcibly kissed her at the 1997 U.S. Open.",
    "sources": ["Guardian"]
  },
  {
    "id": "beatrice-keul",
    "name": "Beatrice Keul",
    "category": "accuser",
    "summary": "Swiss model who alleged Trump groped her in his Plaza Hotel suite in 1993.",
    "sources": ["Daily Mail"]
  }
]
```

---

## PART 11: UPDATED SEARCH INDEX TERMS

Add to the search index rebuild (supplements Part 6):

**New terms from Parts 7–9:**
- "Ivana Trump" (as accuser, distinct from family role)
- "Jessica Leeds"
- "Kristin Anderson"
- "Cathy Heller"
- "Temple Taggart McDowell"
- "Karena Virginia"
- "Karen Johnson"
- "Rachel Crooks"
- "Natasha Stoynoff"
- "Summer Zervos"
- "Jessica Drake"
- "Ninni Laaksonen"
- "Cassandra Searles"
- "Mariah Billado"
- "Tasha Dixon"
- "Samantha Holvey"
- "Juliet Huddy"
- "Alva Johnson" (accuser)
- "E. Jean Carroll"
- "Howard Stern"
- "Howard Stern Show"
- "Miss Teen USA dressing room"
- "Miss USA dressing room"
- "pageant dressing room"
- "piece of ass"
- "Paris Hilton" (Trump comment about)
- "Princess Diana" (Trump comments about)
- "voluptuous" (Ivanka comments)
- "octopus" (Leeds quote)
- "checkout time"
- "All the President's Women"
- "Factba.se" (Stern archive)
- "locker room talk"
- "Access Hollywood"
- "Billy Bush"
- "Marc Kasowitz" / "took care of 100 women"

---

## UPDATED EXECUTION ORDER

1. Read existing `src/data/timeline.json`, `src/data/people.json`, and `src/data/connections.json`
2. For each timeline entry in Part 1, check for duplicates → merge or create new
3. Apply Epstein-adjacent people dossier updates (Part 2)
4. Add connection edges (Part 3)
5. Add non-Epstein misconduct catalog to Trump dossier (Part 7)
6. Add pageant dressing room section to Trump dossier (Part 8)
7. Add Howard Stern record to Trump dossier (Part 9)
8. Create new accuser people entries (Part 10)
9. Run `npm run build` to verify no data schema errors
10. Rebuild search index with all terms from Parts 6 and 11
11. Verify all new entries render correctly on `/timeline`, `/people/donald-trump`, `/search`
