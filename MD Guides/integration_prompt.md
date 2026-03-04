# Claude Code Integration Prompt: February 27, 2026 Intel Sweep

## Context

You are working on a Next.js website (Tailwind CSS, D3.js for network viz, Fuse.js for search) that presents comprehensive Epstein case research. The site has three main organizational structures: **topics/themes**, **people dossiers**, and **chronological timeline**. All data lives in JSON files under `src/data/`.

The data model uses these files:
- `src/data/people.json` — Individual profiles with sections, connectionIds, themeIds, sources
- `src/data/themes.json` — Topic/theme entries with content, peopleIds, tags, sources
- `src/data/timeline.json` — Chronological events with date, body, peopleIds, themeIds, tags
- `src/data/connections.json` — Relationship edges between people (type, strength, description)
- `src/data/search-index.json` — Flattened search entries for Fuse.js client-side search

Below is the new intelligence to integrate. For each section, I've marked what needs to go where.

---

## 1. NEW PEOPLE ENTRIES

Add or update these entries in `people.json`:

### Randall Scott Taylor (NEW)
```json
{
  "id": "randall-scott-taylor",
  "name": "Randall Scott Taylor",
  "category": "researcher",
  "summary": "Finance professional who built the most systematic computational forensic accounting analysis of the EFTA corpus (epstein-forensic-finance GitHub repo).",
  "sections": [
    {
      "title": "Forensic Finance Repository",
      "content": "Published February 2026. Processes 10,964 unique transactions across 39 relational database tables containing 26.6 million rows. Identifies $2.146B net flowing through eight shell entities. Establishes the 'Bates stamp or it didn't happen' verification standard — 94.8% of NLP-extracted fund flow records are low-confidence noise. Celebrity names (Trump $64.7M, Gates $36.6M, Clinton $17.6M, Prince Andrew $13.9M) produce zero verified bank documents. Verified flows: Leon Black $310.5M across 42 wire transfers from five Black-controlled entities (Black Family Partners LP, BV70 LLC, Narrow Holdings LLC, Elysium Management). Shell entities: Southern Trust Company ($692M inflows), Haze Trust ($618M), Southern Financial LLC ($606.9M with unexplained $412.3M net positive surplus). Darren Indyke processed $320.1M, Eileen Alexanderson $294M with $285M gap, Lyle Casriel routed $92.5M to Maxwell across 176 payments. Eight inter-shell transfers totaling $260.4M with no visible external economic purpose.",
      "sources": ["GitHub"]
    }
  ],
  "timelineEventIds": [],
  "themeIds": ["financial-crimes-money-laundering", "community-research-tools-architecture"],
  "connectionIds": ["darren-indyke", "leon-black", "ghislaine-maxwell"],
  "sources": ["GitHub"]
}
```

### Børge Brende (NEW)
```json
{
  "id": "borge-brende",
  "name": "Børge Brende",
  "category": "political",
  "summary": "Former WEF President/CEO. Resigned February 26, 2026 after EFTA files revealed three business dinners with Epstein (one 2018, two 2019), all arranged by Terje Rød-Larsen.",
  "sections": [
    {
      "title": "WEF Connection",
      "content": "Attended three dinners with Epstein — one in 2018, two in 2019. In a 2018 email, Epstein wrote: 'Davos can really replace the UN. cyber, crypto, genetics... intl coordination.' Brende responded: 'Exactly — we need a new global architecture.' The second 2019 meeting was planned weeks before Epstein's July arrest. All three introductions made by Terje Rød-Larsen. Independent WEF review by outside counsel found 'no additional concerns beyond what has been previously disclosed.' Resigned February 26, 2026. Confirmed by AP, Bloomberg, CNN, Al Jazeera.",
      "sources": ["AP", "CNN", "Bloomberg", "Al Jazeera"]
    }
  ],
  "timelineEventIds": ["2026-02-26-brende-wef-resignation"],
  "themeIds": ["international-consequences-fallout", "political-intelligence-network"],
  "connectionIds": ["terje-rod-larsen", "jeffrey-epstein"],
  "sources": ["AP", "CNN", "Bloomberg"]
}
```

### Walter Kemp (NEW)
```json
{
  "id": "walter-kemp",
  "name": "Walter Kemp",
  "category": "political",
  "summary": "IPI Director for Europe. First recipient of the Epstein-funded Rick Hooper Distinguished Fellowship. Sent March 19, 2015 'Preparing for Pandemics' email to Rød-Larsen, forwarded to Epstein next day.",
  "sections": [
    {
      "title": "Pandemic Planning Email",
      "content": "March 19, 2015 email to Terje Rød-Larsen attached draft agenda titled 'Preparing for Pandemics' proposing co-branding with WHO and ICRC. Closing line: 'I hope we can pull this off.' Forwarded to Epstein the next day. The email reads as routine philanthropic-policy coordination; pandemic preparedness was standard post-Ebola. Conspiracy theorists have amplified this as COVID foreknowledge — not supported by evidence. First recipient of Epstein-funded Rick Hooper Distinguished Fellowship at IPI.",
      "sources": ["IBTimes UK", "EFTA emails"]
    }
  ],
  "timelineEventIds": [],
  "themeIds": ["political-intelligence-network", "academic-scientific-network"],
  "connectionIds": ["terje-rod-larsen", "jeffrey-epstein"],
  "sources": ["IBTimes UK"]
}
```

### Eileen Alexanderson (NEW)
```json
{
  "id": "eileen-alexanderson",
  "name": "Eileen Alexanderson",
  "category": "financial",
  "summary": "Epstein financial operator. Processed $294M with a $285M gap between outflows and documented inflows per forensic finance analysis.",
  "sections": [
    {
      "title": "Financial Role",
      "content": "Identified in the randallscott25-star forensic finance repository as processing $294M total, with a $285M unexplained gap between outflows and documented inflows. This gap is one of the largest unresolved discrepancies in the financial analysis. Verification level: moderate — based on EFTA bank documents but not all individually Bates-stamped.",
      "sources": ["GitHub"]
    }
  ],
  "timelineEventIds": [],
  "themeIds": ["financial-crimes-money-laundering"],
  "connectionIds": ["jeffrey-epstein", "darren-indyke"],
  "sources": ["GitHub"]
}
```

### Lyle Casriel (NEW)
```json
{
  "id": "lyle-casriel",
  "name": "Lyle Casriel",
  "category": "financial",
  "summary": "Epstein financial operator. Routed $92.5M to Ghislaine Maxwell across 176 payments per forensic finance analysis.",
  "sections": [
    {
      "title": "Financial Role",
      "content": "Identified as routing $92.5M to Ghislaine Maxwell across 176 separate payments. This positions Casriel as a key financial conduit between Epstein's shell entity structure and Maxwell's personal finances.",
      "sources": ["GitHub"]
    }
  ],
  "timelineEventIds": [],
  "themeIds": ["financial-crimes-money-laundering"],
  "connectionIds": ["ghislaine-maxwell", "jeffrey-epstein"],
  "sources": ["GitHub"]
}
```

### UPDATE existing entries:

**Terje Rød-Larsen** — Add: "Introduced Børge Brende to Epstein at all three dinners. Norwegian Økokrim has filed charges against Rød-Larsen and his wife Mona Juul. IPI allegedly brought in young unqualified women from Eastern Europe on short internships — pattern parallels trafficking methodology."

**Thorbjørn Jagland** — Add: "Charged with aggravated corruption by Norway's Økokrim in connection with Epstein relationship."

**Leon Black** — Add: "$310.5M verified across 42 wire transfers from five Black-controlled entities (Black Family Partners LP, BV70 LLC, Narrow Holdings LLC, Elysium Management), backed by specific Bates-stamped bank documents (DB-SDNY-0002962 through DB-SDNY-0006113 and EFTA01075607). Single October 2008 wire from Epstein to Black Family Partners LP transferred $50M (EFTA01075607). Identified as 'Human Trafficking Subject' in SDNY emails from June 2023 (EFTA02731636, EFTA00156644)."

**Darren Indyke** — Add: "Forensic finance analysis shows Indyke processed $320.1M through Epstein's shell entity network."

**Susan Hamblin** — Add or create: "Identified through partially visible redactions as sender of June 30, 2014 email to Epstein: 'I give you permission to kill him… He lied to both of us.' Also sent the 'your littlest girl was a little naughty' email following a David Heyman celebration. Successfully sued The Sun in UK High Court in 2022 (via Carter-Ruck solicitors), securing retraction and compensation. Congresswoman Anna Paulina Luna called on DOJ to investigate Hamblin. Reddit posts identifying Hamblin were among the first viral Epstein file discoveries; the original poster's account was subsequently deleted."

**Ro Khanna** — Add or update: "Co-sponsored EFTA with Thomas Massie. Reviewed unredacted files at DOJ on February 9, 2026. Read six improperly redacted names on House floor: Salvatore Nuara, Zurab Mikeladze, Leonic Leonov, Nicola Caputo, Sultan Ahmed bin Sulayem, Leslie Wexner."

---

## 2. NEW TIMELINE ENTRIES

Add to `timeline.json`:

```json
{
  "id": "2015-03-19-pandemic-planning-email",
  "date": "2015-03-19",
  "dateDisplay": "March 19, 2015",
  "era": "2008-2019",
  "title": "IPI 'Preparing for Pandemics' Email Sent to Rød-Larsen, Forwarded to Epstein",
  "body": "Walter Kemp (IPI Director for Europe) emailed Terje Rød-Larsen a draft agenda titled 'Preparing for Pandemics' proposing co-branding with WHO and ICRC. Forwarded to Epstein the next day. Kemp's closing: 'I hope we can pull this off.' Routine post-Ebola policy coordination; conspiratorial framing as COVID foreknowledge is not supported.",
  "peopleIds": ["walter-kemp", "terje-rod-larsen", "jeffrey-epstein"],
  "themeIds": ["political-intelligence-network", "academic-scientific-network"],
  "sources": ["IBTimes UK", "EFTA emails"],
  "tags": ["intelligence", "media"]
}
```

```json
{
  "id": "2026-02-09-khanna-massie-unredacted-review",
  "date": "2026-02-09",
  "dateDisplay": "February 9, 2026",
  "era": "2020-present",
  "title": "Khanna and Massie Review Unredacted Files at DOJ",
  "body": "Reps. Ro Khanna and Thomas Massie, co-sponsors of EFTA, reviewed unredacted files at DOJ. Khanna subsequently read six improperly redacted names on the House floor: Salvatore Nuara, Zurab Mikeladze, Leonic Leonov, Nicola Caputo, Sultan Ahmed bin Sulayem, and Leslie Wexner. Wexner was labeled by FBI as a 'co-conspirator' in an August 15, 2019 Criminal Investigative Division document.",
  "peopleIds": ["ro-khanna", "thomas-massie", "leslie-wexner", "sultan-ahmed-bin-sulayem"],
  "themeIds": ["media-congressional-investigations"],
  "sources": ["CBS News", "New Republic", "Democracy Now!"],
  "tags": ["legal", "media"]
}
```

```json
{
  "id": "2026-02-24-npr-missing-fbi-interviews",
  "date": "2026-02-24",
  "dateDisplay": "February 24, 2026",
  "era": "2020-present",
  "title": "NPR/CNN Confirm 90+ FBI Interview Records Missing from EFTA Database",
  "body": "NPR's Stephen Fowler identified 53 pages of missing FBI interviews related to a Trump accuser from ~1983. Of 15 documents listed in Maxwell discovery for this accuser, only 7 are public. CNN independently confirmed 90+ of approximately 325 FBI witness interview records (over 25%) are missing from the DOJ website. Community researcher separately identified 151 unreleased FD-302 documents from case 31E-NY-3027571/50D-NY-3027571 via serial number cross-referencing of EFTA01684300.pdf. Case50d.com now catalogs 617 FBI documents, 88 investigative stories, and 93 identified victims. Rep. Garcia: DOJ 'appears to have illegally withheld FBI interviews.'",
  "peopleIds": ["pam-bondi", "donald-trump"],
  "themeIds": ["media-congressional-investigations", "trumpepstein-connections"],
  "sources": ["NPR", "CNN", "OPB"],
  "tags": ["legal", "media", "trump"]
}
```

```json
{
  "id": "2026-02-26-brende-wef-resignation",
  "date": "2026-02-26",
  "dateDisplay": "February 26, 2026",
  "era": "2020-present",
  "title": "WEF President Børge Brende Resigns Over Epstein Connections",
  "body": "Børge Brende resigned as WEF President/CEO after EFTA files revealed three business dinners with Epstein (one 2018, two 2019), all arranged by Terje Rød-Larsen. In a 2018 email Epstein proposed 'Davos can really replace the UN.' Second 2019 meeting planned weeks before Epstein's July arrest. Brende joins growing list of EFTA-triggered departures including Tom Pritzker, Kathy Ruemmler, Casey Wasserman, Peter Attia, Larry Summers, and Brad Karp.",
  "peopleIds": ["borge-brende", "terje-rod-larsen", "jeffrey-epstein"],
  "themeIds": ["international-consequences-fallout"],
  "sources": ["AP", "CNN", "Bloomberg", "Al Jazeera"],
  "tags": ["media"]
}
```

```json
{
  "id": "2026-02-25-bondi-perjury-special-counsel-demand",
  "date": "2026-02-25",
  "dateDisplay": "February 25, 2026",
  "era": "2020-present",
  "title": "Democrats Demand Special Counsel Investigation of Bondi for Perjury",
  "body": "Reps. Lieu and Goldman demanded special counsel investigation of AG Pam Bondi for potential perjury after her February 11 testimony that 'there is no evidence that Donald Trump has committed a crime.' Bondi refused to provide the 86-page SDNY prosecution memo ('Investigation into Potential Co-Conspirators') sent to US Attorney Geoffrey Berman December 19, 2019, or a draft Florida indictment against co-conspirators. Rep. Garcia, having reviewed unredacted files, stated the only remaining explanation under EFTA exemption categories is that 'President Trump is under a federal investigation.' HuffPost reported Democrats directly asked Bondi whether Trump is under active investigation related to Epstein.",
  "peopleIds": ["pam-bondi", "donald-trump"],
  "themeIds": ["media-congressional-investigations", "trumpepstein-connections"],
  "sources": ["The Hill", "Salon", "HuffPost", "House Judiciary Democrats"],
  "tags": ["legal", "trump", "media"]
}
```

---

## 3. NEW/UPDATED THEME CONTENT

### Update: "Financial Crimes & Money Laundering" theme
Append this section:

**Forensic Finance Repository (February 2026)**

The randallscott25-star/epstein-forensic-finance GitHub repository represents the most systematic computational forensic accounting of the EFTA corpus. Key findings: $2.146B net flows through eight shell entities (Southern Trust $692M, Haze Trust $618M, Southern Financial LLC $606.9M). Southern Financial LLC shows unexplained $412.3M net positive surplus. Banking tier: Deutsche Bank $851.9M, JPMorgan $670.8M, Bank of America $486.4M (all unverified aggregates). Operator tier: Darren Indyke $320.1M, Eileen Alexanderson $294M ($285M gap), Lyle Casriel $92.5M to Maxwell (176 payments). Eight inter-shell transfers totaling $260.4M circulated funds internally. Leon Black: $310.5M verified across 42 wire transfers from five entities (Bates stamps DB-SDNY-0002962 through DB-SDNY-0006113, EFTA01075607). Single October 2008 wire: $50M (EFTA01075607). Critical caveat: 94.8% of NLP-extracted records are low-confidence noise. Celebrity names produce $0 verified: Trump ($64.7M claimed), Gates ($36.6M), Clinton ($17.6M), Prince Andrew ($13.9M).

### Update: "Community Research Tools & Architecture" theme
Append this section:

**New Research Databases (February 2026)**

Three complementary tools have emerged: (1) **justice.geeken.dev** tracks DOJ deletions using SHA256 hashes and HTTP ETags, identified 10.1GB removed video files including EFTA00276494.ts (4.29GB) and EFTA01244748.wmv (3.90GB), community upvoting ranks deleted documents by significance. (2) **tommycarstensen.com/epstein/** maintained by bioinformatician Tommy Carstensen, contains 313,000+ extracted images with OpenCV facial recognition (388 individuals identified), Whisper-transcribed videos, decoded victim diaries using rail fence cipher, identifies Leon Black as "Human Trafficking Subject" in SDNY emails (EFTA02731636, EFTA00156644), documents rape accusations against Jes Staley in forensically-verified diary (EFTA02731465), names Ted Leonsis and AOL executives. (3) **epsteinalysis.com** indexes 1.05M documents/2.08M pages, uses MinHash LSH for redaction inconsistency detection — identifying same document with different redactions across releases. (4) **case50d.com** catalogs 617 FBI documents, 88 stories, 93 victims from the primary case file (50D-NY-3027571). (5) **GitHub yung-megafone/Epstein-Files** provides public archive index for all 12 DOJ dataset releases with torrent magnets and integrity verification. (6) **epsteinexposed.com** cross-references searchable database with people summaries and connection mapping.

### Update: "International Consequences & Fallout" theme
Append Norwegian prosecution cluster:

**Norwegian Network Prosecutions**

The EFTA releases exposed a concentrated Norwegian cluster connected through intermediary Terje Rød-Larsen (former diplomat, IPI president, described Epstein as "best friend"). Criminal charges filed: Thorbjørn Jagland (former PM, Council of Europe SG) charged with aggravated corruption by Økokrim; Rød-Larsen and wife Mona Juul both charged; Børge Brende resigned as WEF President February 26, 2026; Crown Princess Mette-Marit issued public apology. IPI allegedly brought in young unqualified women from Eastern Europe on short internships — pattern parallels documented trafficking methodology.

---

## 4. NEW CONNECTIONS

Add to `connections.json`:

```json
[
  {
    "id": "brende-rod-larsen",
    "sourcePersonId": "borge-brende",
    "targetPersonId": "terje-rod-larsen",
    "relationshipType": "associate",
    "strength": 3,
    "description": "Rød-Larsen introduced Brende to Epstein at all three documented dinners (2018-2019).",
    "sources": ["AP", "CNN"],
    "verificationStatus": "verified"
  },
  {
    "id": "brende-epstein",
    "sourcePersonId": "borge-brende",
    "targetPersonId": "jeffrey-epstein",
    "relationshipType": "associate",
    "strength": 2,
    "description": "Three business dinners (one 2018, two 2019). Email exchange about 'Davos replacing the UN.'",
    "sources": ["AP", "EFTA emails"],
    "verificationStatus": "verified"
  },
  {
    "id": "kemp-rod-larsen",
    "sourcePersonId": "walter-kemp",
    "targetPersonId": "terje-rod-larsen",
    "relationshipType": "professional",
    "strength": 2,
    "description": "IPI Director for Europe under Rød-Larsen's IPI presidency. Sent 'Preparing for Pandemics' email.",
    "sources": ["IBTimes UK"],
    "verificationStatus": "verified"
  },
  {
    "id": "casriel-maxwell",
    "sourcePersonId": "lyle-casriel",
    "targetPersonId": "ghislaine-maxwell",
    "relationshipType": "financial",
    "strength": 3,
    "description": "Routed $92.5M to Maxwell across 176 payments per forensic finance analysis.",
    "sources": ["GitHub"],
    "verificationStatus": "partially-verified"
  },
  {
    "id": "alexanderson-indyke",
    "sourcePersonId": "eileen-alexanderson",
    "targetPersonId": "darren-indyke",
    "relationshipType": "financial",
    "strength": 2,
    "description": "Both identified as operator-tier financial conduits in Epstein shell entity network.",
    "sources": ["GitHub"],
    "verificationStatus": "partially-verified"
  }
]
```

---

## 5. SEARCH INDEX ENTRIES

Add flattened entries to `search-index.json` for each new person, event, and theme update above. Each entry should follow the existing pattern:

```json
{
  "type": "person|event|theme",
  "id": "<matching id from source file>",
  "title": "<name or event title>",
  "excerpt": "<first 200 chars of content>",
  "fullText": "<complete searchable text>",
  "date": "<if event>",
  "era": "<if event>",
  "sources": "<comma-separated>"
}
```

---

## 6. KEY EFTA DOCUMENT NUMBERS TO INDEX

Ensure these are searchable and linked throughout the site:

| EFTA Number | Description |
|---|---|
| EFTA01684300.pdf | Serial number master list (serials 1-700+) for case 3027571 |
| EFTA01245620 | First interview with ~1983 Trump accuser (July 24, 2019) — only public one |
| EFTA01245486 | Accuser's mother interview mentioning "a prince and DONALD TRUMP" — still offline |
| EFTA00158473 | Trump-related interview removed Dec 2025, restored Feb 19, 2026 |
| EFTA01660651 | FBI allegations involving Trump |
| EFTA01660622 | Internal "prominent names" PowerPoint |
| EFTA00095751 | Non-testifying witness material list |
| EFTA01075607 | $50M October 2008 wire from Epstein to Black Family Partners LP |
| EFTA02731636 | SDNY email identifying Leon Black as "Human Trafficking Subject" |
| EFTA00156644 | Additional SDNY Leon Black reference |
| EFTA02731465 | Forensically-verified victim diary with Jes Staley rape accusations |
| DB-SDNY-0002962 to DB-SDNY-0006113 | Leon Black verified wire transfer bank documents |
| EFTA_R1_00605090 | 2016 email from redacted Republican politician to Epstein (speculated: Rubio) |

---

## 7. NEW EXTERNAL RESOURCE LINKS

Add to any resources/links page:

| Resource | URL | Description |
|---|---|---|
| Forensic Finance Repo | https://github.com/randallscott25-star/epstein-forensic-finance | $2.1B forensic accounting of EFTA corpus |
| Grand Opus Narrative | https://randallscott25-star.github.io/epstein-forensic-finance/narratives/19_grand_opus_narrative.html | Full financial narrative |
| Verification Wall | https://randallscott25-star.github.io/epstein-forensic-finance/narratives/20_the_verification_wall.html | Methodology and confidence ratings |
| Case 50D | https://case50d.com/ | 617 FBI docs, 93 victims from primary case file |
| Deleted Docs Tracker | https://justice.geeken.dev/deleted-docs-top-upvoted | DOJ deletion tracking with SHA256 verification |
| Tommy Carstensen Archive | https://tommycarstensen.com/epstein/ | 313K images, video transcriptions, diary decoding |
| Epsteinalysis | https://epsteinalysis.com/ | 1.05M docs, MinHash redaction detection |
| Epstein Files Archive | https://github.com/yung-megafone/Epstein-Files | Torrent magnets and integrity hashes for all 12 datasets |
| EpsteinExposed | https://epsteinexposed.com/ | Cross-referenced searchable database with people summaries |

---

## Implementation Notes

1. **Run `npm run build` after all JSON changes** to verify no schema violations
2. **Regenerate the D3 network graph** — new nodes for Brende, Kemp, Alexanderson, Casriel, Taylor; new edges for Norwegian cluster
3. **Update the Fuse.js index** by regenerating search-index.json entries
4. **The Norwegian prosecution cluster** should be visually prominent in the network viz — it's a tight 5-node subgraph (Brende → Rød-Larsen → Epstein, Jagland → Rød-Larsen, Kemp → Rød-Larsen) that demonstrates how a single intermediary connected an entire national political establishment to Epstein
5. **Confidence ratings**: Mark forensic finance data as "partially-verified" except for Bates-stamped Leon Black transactions (verified). Mark Norwegian criminal charges as "verified" (multiple wire services). Mark the 151 missing FD-302 methodology as "unverified-methodology" until independently confirmed — NPR's 53-page and CNN's 90+ findings are verified.

## Context

You are working on a Next.js website (Tailwind CSS, D3.js for network viz, Fuse.js for search) that presents comprehensive Epstein case research. The site has three main organizational structures: **topics/themes**, **people dossiers**, and **chronological timeline**. All data lives in JSON files under `src/data/`.

The data model uses these files:
- `src/data/people.json` — Individual profiles with sections, connectionIds, themeIds, sources
- `src/data/themes.json` — Topic/theme entries with content, peopleIds, tags, sources
- `src/data/timeline.json` — Chronological events with date, body, peopleIds, themeIds, tags
- `src/data/connections.json` — Relationship edges between people (type, strength, description)
- `src/data/search-index.json` — Flattened search entries for Fuse.js client-side search

Below is the new intelligence to integrate. For each section, I've marked what needs to go where.

---

## 1. NEW PEOPLE ENTRIES

Add or update these entries in `people.json`:

### Randall Scott Taylor (NEW)
```json
{
  "id": "randall-scott-taylor",
  "name": "Randall Scott Taylor",
  "category": "researcher",
  "summary": "Finance professional who built the most systematic computational forensic accounting analysis of the EFTA corpus (epstein-forensic-finance GitHub repo).",
  "sections": [
    {
      "title": "Forensic Finance Repository",
      "content": "Published February 2026. Processes 10,964 unique transactions across 39 relational database tables containing 26.6 million rows. Identifies $2.146B net flowing through eight shell entities. Establishes the 'Bates stamp or it didn't happen' verification standard — 94.8% of NLP-extracted fund flow records are low-confidence noise. Celebrity names (Trump $64.7M, Gates $36.6M, Clinton $17.6M, Prince Andrew $13.9M) produce zero verified bank documents. Verified flows: Leon Black $310.5M across 42 wire transfers from five Black-controlled entities (Black Family Partners LP, BV70 LLC, Narrow Holdings LLC, Elysium Management). Shell entities: Southern Trust Company ($692M inflows), Haze Trust ($618M), Southern Financial LLC ($606.9M with unexplained $412.3M net positive surplus). Darren Indyke processed $320.1M, Eileen Alexanderson $294M with $285M gap, Lyle Casriel routed $92.5M to Maxwell across 176 payments. Eight inter-shell transfers totaling $260.4M with no visible external economic purpose.",
      "sources": ["GitHub"]
    }
  ],
  "timelineEventIds": [],
  "themeIds": ["financial-crimes-money-laundering", "community-research-tools-architecture"],
  "connectionIds": ["darren-indyke", "leon-black", "ghislaine-maxwell"],
  "sources": ["GitHub"]
}
```

### Børge Brende (NEW)
```json
{
  "id": "borge-brende",
  "name": "Børge Brende",
  "category": "political",
  "summary": "Former WEF President/CEO. Resigned February 26, 2026 after EFTA files revealed three business dinners with Epstein (one 2018, two 2019), all arranged by Terje Rød-Larsen.",
  "sections": [
    {
      "title": "WEF Connection",
      "content": "Attended three dinners with Epstein — one in 2018, two in 2019. In a 2018 email, Epstein wrote: 'Davos can really replace the UN. cyber, crypto, genetics... intl coordination.' Brende responded: 'Exactly — we need a new global architecture.' The second 2019 meeting was planned weeks before Epstein's July arrest. All three introductions made by Terje Rød-Larsen. Independent WEF review by outside counsel found 'no additional concerns beyond what has been previously disclosed.' Resigned February 26, 2026. Confirmed by AP, Bloomberg, CNN, Al Jazeera.",
      "sources": ["AP", "CNN", "Bloomberg", "Al Jazeera"]
    }
  ],
  "timelineEventIds": ["2026-02-26-brende-wef-resignation"],
  "themeIds": ["international-consequences-fallout", "political-intelligence-network"],
  "connectionIds": ["terje-rod-larsen", "jeffrey-epstein"],
  "sources": ["AP", "CNN", "Bloomberg"]
}
```

### Walter Kemp (NEW)
```json
{
  "id": "walter-kemp",
  "name": "Walter Kemp",
  "category": "political",
  "summary": "IPI Director for Europe. First recipient of the Epstein-funded Rick Hooper Distinguished Fellowship. Sent March 19, 2015 'Preparing for Pandemics' email to Rød-Larsen, forwarded to Epstein next day.",
  "sections": [
    {
      "title": "Pandemic Planning Email",
      "content": "March 19, 2015 email to Terje Rød-Larsen attached draft agenda titled 'Preparing for Pandemics' proposing co-branding with WHO and ICRC. Closing line: 'I hope we can pull this off.' Forwarded to Epstein the next day. The email reads as routine philanthropic-policy coordination; pandemic preparedness was standard post-Ebola. Conspiracy theorists have amplified this as COVID foreknowledge — not supported by evidence. First recipient of Epstein-funded Rick Hooper Distinguished Fellowship at IPI.",
      "sources": ["IBTimes UK", "EFTA emails"]
    }
  ],
  "timelineEventIds": [],
  "themeIds": ["political-intelligence-network", "academic-scientific-network"],
  "connectionIds": ["terje-rod-larsen", "jeffrey-epstein"],
  "sources": ["IBTimes UK"]
}
```

### Eileen Alexanderson (NEW)
```json
{
  "id": "eileen-alexanderson",
  "name": "Eileen Alexanderson",
  "category": "financial",
  "summary": "Epstein financial operator. Processed $294M with a $285M gap between outflows and documented inflows per forensic finance analysis.",
  "sections": [
    {
      "title": "Financial Role",
      "content": "Identified in the randallscott25-star forensic finance repository as processing $294M total, with a $285M unexplained gap between outflows and documented inflows. This gap is one of the largest unresolved discrepancies in the financial analysis. Verification level: moderate — based on EFTA bank documents but not all individually Bates-stamped.",
      "sources": ["GitHub"]
    }
  ],
  "timelineEventIds": [],
  "themeIds": ["financial-crimes-money-laundering"],
  "connectionIds": ["jeffrey-epstein", "darren-indyke"],
  "sources": ["GitHub"]
}
```

### Lyle Casriel (NEW)
```json
{
  "id": "lyle-casriel",
  "name": "Lyle Casriel",
  "category": "financial",
  "summary": "Epstein financial operator. Routed $92.5M to Ghislaine Maxwell across 176 payments per forensic finance analysis.",
  "sections": [
    {
      "title": "Financial Role",
      "content": "Identified as routing $92.5M to Ghislaine Maxwell across 176 separate payments. This positions Casriel as a key financial conduit between Epstein's shell entity structure and Maxwell's personal finances.",
      "sources": ["GitHub"]
    }
  ],
  "timelineEventIds": [],
  "themeIds": ["financial-crimes-money-laundering"],
  "connectionIds": ["ghislaine-maxwell", "jeffrey-epstein"],
  "sources": ["GitHub"]
}
```

### UPDATE existing entries:

**Terje Rød-Larsen** — Add: "Introduced Børge Brende to Epstein at all three dinners. Norwegian Økokrim has filed charges against Rød-Larsen and his wife Mona Juul. IPI allegedly brought in young unqualified women from Eastern Europe on short internships — pattern parallels trafficking methodology."

**Thorbjørn Jagland** — Add: "Charged with aggravated corruption by Norway's Økokrim in connection with Epstein relationship."

**Leon Black** — Add: "$310.5M verified across 42 wire transfers from five Black-controlled entities (Black Family Partners LP, BV70 LLC, Narrow Holdings LLC, Elysium Management), backed by specific Bates-stamped bank documents (DB-SDNY-0002962 through DB-SDNY-0006113 and EFTA01075607). Single October 2008 wire from Epstein to Black Family Partners LP transferred $50M (EFTA01075607). Identified as 'Human Trafficking Subject' in SDNY emails from June 2023 (EFTA02731636, EFTA00156644)."

**Darren Indyke** — Add: "Forensic finance analysis shows Indyke processed $320.1M through Epstein's shell entity network."

**Susan Hamblin** — Add or create: "Identified through partially visible redactions as sender of June 30, 2014 email to Epstein: 'I give you permission to kill him… He lied to both of us.' Also sent the 'your littlest girl was a little naughty' email following a David Heyman celebration. Successfully sued The Sun in UK High Court in 2022 (via Carter-Ruck solicitors), securing retraction and compensation. Congresswoman Anna Paulina Luna called on DOJ to investigate Hamblin. Reddit posts identifying Hamblin were among the first viral Epstein file discoveries; the original poster's account was subsequently deleted."

**Ro Khanna** — Add or update: "Co-sponsored EFTA with Thomas Massie. Reviewed unredacted files at DOJ on February 9, 2026. Read six improperly redacted names on House floor: Salvatore Nuara, Zurab Mikeladze, Leonic Leonov, Nicola Caputo, Sultan Ahmed bin Sulayem, Leslie Wexner."

---

## 2. NEW TIMELINE ENTRIES

Add to `timeline.json`:

```json
{
  "id": "2015-03-19-pandemic-planning-email",
  "date": "2015-03-19",
  "dateDisplay": "March 19, 2015",
  "era": "2008-2019",
  "title": "IPI 'Preparing for Pandemics' Email Sent to Rød-Larsen, Forwarded to Epstein",
  "body": "Walter Kemp (IPI Director for Europe) emailed Terje Rød-Larsen a draft agenda titled 'Preparing for Pandemics' proposing co-branding with WHO and ICRC. Forwarded to Epstein the next day. Kemp's closing: 'I hope we can pull this off.' Routine post-Ebola policy coordination; conspiratorial framing as COVID foreknowledge is not supported.",
  "peopleIds": ["walter-kemp", "terje-rod-larsen", "jeffrey-epstein"],
  "themeIds": ["political-intelligence-network", "academic-scientific-network"],
  "sources": ["IBTimes UK", "EFTA emails"],
  "tags": ["intelligence", "media"]
}
```

```json
{
  "id": "2026-02-09-khanna-massie-unredacted-review",
  "date": "2026-02-09",
  "dateDisplay": "February 9, 2026",
  "era": "2020-present",
  "title": "Khanna and Massie Review Unredacted Files at DOJ",
  "body": "Reps. Ro Khanna and Thomas Massie, co-sponsors of EFTA, reviewed unredacted files at DOJ. Khanna subsequently read six improperly redacted names on the House floor: Salvatore Nuara, Zurab Mikeladze, Leonic Leonov, Nicola Caputo, Sultan Ahmed bin Sulayem, and Leslie Wexner. Wexner was labeled by FBI as a 'co-conspirator' in an August 15, 2019 Criminal Investigative Division document.",
  "peopleIds": ["ro-khanna", "thomas-massie", "leslie-wexner", "sultan-ahmed-bin-sulayem"],
  "themeIds": ["media-congressional-investigations"],
  "sources": ["CBS News", "New Republic", "Democracy Now!"],
  "tags": ["legal", "media"]
}
```

```json
{
  "id": "2026-02-24-npr-missing-fbi-interviews",
  "date": "2026-02-24",
  "dateDisplay": "February 24, 2026",
  "era": "2020-present",
  "title": "NPR/CNN Confirm 90+ FBI Interview Records Missing from EFTA Database",
  "body": "NPR's Stephen Fowler identified 53 pages of missing FBI interviews related to a Trump accuser from ~1983. Of 15 documents listed in Maxwell discovery for this accuser, only 7 are public. CNN independently confirmed 90+ of approximately 325 FBI witness interview records (over 25%) are missing from the DOJ website. Community researcher separately identified 151 unreleased FD-302 documents from case 31E-NY-3027571/50D-NY-3027571 via serial number cross-referencing of EFTA01684300.pdf. Case50d.com now catalogs 617 FBI documents, 88 investigative stories, and 93 identified victims. Rep. Garcia: DOJ 'appears to have illegally withheld FBI interviews.'",
  "peopleIds": ["pam-bondi", "donald-trump"],
  "themeIds": ["media-congressional-investigations", "trumpepstein-connections"],
  "sources": ["NPR", "CNN", "OPB"],
  "tags": ["legal", "media", "trump"]
}
```

```json
{
  "id": "2026-02-26-brende-wef-resignation",
  "date": "2026-02-26",
  "dateDisplay": "February 26, 2026",
  "era": "2020-present",
  "title": "WEF President Børge Brende Resigns Over Epstein Connections",
  "body": "Børge Brende resigned as WEF President/CEO after EFTA files revealed three business dinners with Epstein (one 2018, two 2019), all arranged by Terje Rød-Larsen. In a 2018 email Epstein proposed 'Davos can really replace the UN.' Second 2019 meeting planned weeks before Epstein's July arrest. Brende joins growing list of EFTA-triggered departures including Tom Pritzker, Kathy Ruemmler, Casey Wasserman, Peter Attia, Larry Summers, and Brad Karp.",
  "peopleIds": ["borge-brende", "terje-rod-larsen", "jeffrey-epstein"],
  "themeIds": ["international-consequences-fallout"],
  "sources": ["AP", "CNN", "Bloomberg", "Al Jazeera"],
  "tags": ["media"]
}
```

```json
{
  "id": "2026-02-25-bondi-perjury-special-counsel-demand",
  "date": "2026-02-25",
  "dateDisplay": "February 25, 2026",
  "era": "2020-present",
  "title": "Democrats Demand Special Counsel Investigation of Bondi for Perjury",
  "body": "Reps. Lieu and Goldman demanded special counsel investigation of AG Pam Bondi for potential perjury after her February 11 testimony that 'there is no evidence that Donald Trump has committed a crime.' Bondi refused to provide the 86-page SDNY prosecution memo ('Investigation into Potential Co-Conspirators') sent to US Attorney Geoffrey Berman December 19, 2019, or a draft Florida indictment against co-conspirators. Rep. Garcia, having reviewed unredacted files, stated the only remaining explanation under EFTA exemption categories is that 'President Trump is under a federal investigation.' HuffPost reported Democrats directly asked Bondi whether Trump is under active investigation related to Epstein.",
  "peopleIds": ["pam-bondi", "donald-trump"],
  "themeIds": ["media-congressional-investigations", "trumpepstein-connections"],
  "sources": ["The Hill", "Salon", "HuffPost", "House Judiciary Democrats"],
  "tags": ["legal", "trump", "media"]
}
```

---

## 3. NEW/UPDATED THEME CONTENT

### Update: "Financial Crimes & Money Laundering" theme
Append this section:

**Forensic Finance Repository (February 2026)**

The randallscott25-star/epstein-forensic-finance GitHub repository represents the most systematic computational forensic accounting of the EFTA corpus. Key findings: $2.146B net flows through eight shell entities (Southern Trust $692M, Haze Trust $618M, Southern Financial LLC $606.9M). Southern Financial LLC shows unexplained $412.3M net positive surplus. Banking tier: Deutsche Bank $851.9M, JPMorgan $670.8M, Bank of America $486.4M (all unverified aggregates). Operator tier: Darren Indyke $320.1M, Eileen Alexanderson $294M ($285M gap), Lyle Casriel $92.5M to Maxwell (176 payments). Eight inter-shell transfers totaling $260.4M circulated funds internally. Leon Black: $310.5M verified across 42 wire transfers from five entities (Bates stamps DB-SDNY-0002962 through DB-SDNY-0006113, EFTA01075607). Single October 2008 wire: $50M (EFTA01075607). Critical caveat: 94.8% of NLP-extracted records are low-confidence noise. Celebrity names produce $0 verified: Trump ($64.7M claimed), Gates ($36.6M), Clinton ($17.6M), Prince Andrew ($13.9M).

### Update: "Community Research Tools & Architecture" theme
Append this section:

**New Research Databases (February 2026)**

Three complementary tools have emerged: (1) **justice.geeken.dev** tracks DOJ deletions using SHA256 hashes and HTTP ETags, identified 10.1GB removed video files including EFTA00276494.ts (4.29GB) and EFTA01244748.wmv (3.90GB), community upvoting ranks deleted documents by significance. (2) **tommycarstensen.com/epstein/** maintained by bioinformatician Tommy Carstensen, contains 313,000+ extracted images with OpenCV facial recognition (388 individuals identified), Whisper-transcribed videos, decoded victim diaries using rail fence cipher, identifies Leon Black as "Human Trafficking Subject" in SDNY emails (EFTA02731636, EFTA00156644), documents rape accusations against Jes Staley in forensically-verified diary (EFTA02731465), names Ted Leonsis and AOL executives. (3) **epsteinalysis.com** indexes 1.05M documents/2.08M pages, uses MinHash LSH for redaction inconsistency detection — identifying same document with different redactions across releases. (4) **case50d.com** catalogs 617 FBI documents, 88 stories, 93 victims from the primary case file (50D-NY-3027571). (5) **GitHub yung-megafone/Epstein-Files** provides public archive index for all 12 DOJ dataset releases with torrent magnets and integrity verification. (6) **epsteinexposed.com** cross-references searchable database with people summaries and connection mapping.

### Update: "International Consequences & Fallout" theme
Append Norwegian prosecution cluster:

**Norwegian Network Prosecutions**

The EFTA releases exposed a concentrated Norwegian cluster connected through intermediary Terje Rød-Larsen (former diplomat, IPI president, described Epstein as "best friend"). Criminal charges filed: Thorbjørn Jagland (former PM, Council of Europe SG) charged with aggravated corruption by Økokrim; Rød-Larsen and wife Mona Juul both charged; Børge Brende resigned as WEF President February 26, 2026; Crown Princess Mette-Marit issued public apology. IPI allegedly brought in young unqualified women from Eastern Europe on short internships — pattern parallels documented trafficking methodology.

---

## 4. NEW CONNECTIONS

Add to `connections.json`:

```json
[
  {
    "id": "brende-rod-larsen",
    "sourcePersonId": "borge-brende",
    "targetPersonId": "terje-rod-larsen",
    "relationshipType": "associate",
    "strength": 3,
    "description": "Rød-Larsen introduced Brende to Epstein at all three documented dinners (2018-2019).",
    "sources": ["AP", "CNN"],
    "verificationStatus": "verified"
  },
  {
    "id": "brende-epstein",
    "sourcePersonId": "borge-brende",
    "targetPersonId": "jeffrey-epstein",
    "relationshipType": "associate",
    "strength": 2,
    "description": "Three business dinners (one 2018, two 2019). Email exchange about 'Davos replacing the UN.'",
    "sources": ["AP", "EFTA emails"],
    "verificationStatus": "verified"
  },
  {
    "id": "kemp-rod-larsen",
    "sourcePersonId": "walter-kemp",
    "targetPersonId": "terje-rod-larsen",
    "relationshipType": "professional",
    "strength": 2,
    "description": "IPI Director for Europe under Rød-Larsen's IPI presidency. Sent 'Preparing for Pandemics' email.",
    "sources": ["IBTimes UK"],
    "verificationStatus": "verified"
  },
  {
    "id": "casriel-maxwell",
    "sourcePersonId": "lyle-casriel",
    "targetPersonId": "ghislaine-maxwell",
    "relationshipType": "financial",
    "strength": 3,
    "description": "Routed $92.5M to Maxwell across 176 payments per forensic finance analysis.",
    "sources": ["GitHub"],
    "verificationStatus": "partially-verified"
  },
  {
    "id": "alexanderson-indyke",
    "sourcePersonId": "eileen-alexanderson",
    "targetPersonId": "darren-indyke",
    "relationshipType": "financial",
    "strength": 2,
    "description": "Both identified as operator-tier financial conduits in Epstein shell entity network.",
    "sources": ["GitHub"],
    "verificationStatus": "partially-verified"
  }
]
```

---

## 5. SEARCH INDEX ENTRIES

Add flattened entries to `search-index.json` for each new person, event, and theme update above. Each entry should follow the existing pattern:

```json
{
  "type": "person|event|theme",
  "id": "<matching id from source file>",
  "title": "<name or event title>",
  "excerpt": "<first 200 chars of content>",
  "fullText": "<complete searchable text>",
  "date": "<if event>",
  "era": "<if event>",
  "sources": "<comma-separated>"
}
```

---

## 6. KEY EFTA DOCUMENT NUMBERS TO INDEX

Ensure these are searchable and linked throughout the site:

| EFTA Number | Description |
|---|---|
| EFTA01684300.pdf | Serial number master list (serials 1-700+) for case 3027571 |
| EFTA01245620 | First interview with ~1983 Trump accuser (July 24, 2019) — only public one |
| EFTA01245486 | Accuser's mother interview mentioning "a prince and DONALD TRUMP" — still offline |
| EFTA00158473 | Trump-related interview removed Dec 2025, restored Feb 19, 2026 |
| EFTA01660651 | FBI allegations involving Trump |
| EFTA01660622 | Internal "prominent names" PowerPoint |
| EFTA00095751 | Non-testifying witness material list |
| EFTA01075607 | $50M October 2008 wire from Epstein to Black Family Partners LP |
| EFTA02731636 | SDNY email identifying Leon Black as "Human Trafficking Subject" |
| EFTA00156644 | Additional SDNY Leon Black reference |
| EFTA02731465 | Forensically-verified victim diary with Jes Staley rape accusations |
| DB-SDNY-0002962 to DB-SDNY-0006113 | Leon Black verified wire transfer bank documents |
| EFTA_R1_00605090 | 2016 email from redacted Republican politician to Epstein (speculated: Rubio) |

---

## 7. NEW EXTERNAL RESOURCE LINKS

Add to any resources/links page:

| Resource | URL | Description |
|---|---|---|
| Forensic Finance Repo | https://github.com/randallscott25-star/epstein-forensic-finance | $2.1B forensic accounting of EFTA corpus |
| Grand Opus Narrative | https://randallscott25-star.github.io/epstein-forensic-finance/narratives/19_grand_opus_narrative.html | Full financial narrative |
| Verification Wall | https://randallscott25-star.github.io/epstein-forensic-finance/narratives/20_the_verification_wall.html | Methodology and confidence ratings |
| Case 50D | https://case50d.com/ | 617 FBI docs, 93 victims from primary case file |
| Deleted Docs Tracker | https://justice.geeken.dev/deleted-docs-top-upvoted | DOJ deletion tracking with SHA256 verification |
| Tommy Carstensen Archive | https://tommycarstensen.com/epstein/ | 313K images, video transcriptions, diary decoding |
| Epsteinalysis | https://epsteinalysis.com/ | 1.05M docs, MinHash redaction detection |
| Epstein Files Archive | https://github.com/yung-megafone/Epstein-Files | Torrent magnets and integrity hashes for all 12 datasets |
| EpsteinExposed | https://epsteinexposed.com/ | Cross-referenced searchable database with people summaries |

---

## Implementation Notes

1. **Run `npm run build` after all JSON changes** to verify no schema violations
2. **Regenerate the D3 network graph** — new nodes for Brende, Kemp, Alexanderson, Casriel, Taylor; new edges for Norwegian cluster
3. **Update the Fuse.js index** by regenerating search-index.json entries
4. **The Norwegian prosecution cluster** should be visually prominent in the network viz — it's a tight 5-node subgraph (Brende → Rød-Larsen → Epstein, Jagland → Rød-Larsen, Kemp → Rød-Larsen) that demonstrates how a single intermediary connected an entire national political establishment to Epstein
5. **Confidence ratings**: Mark forensic finance data as "partially-verified" except for Bates-stamped Leon Black transactions (verified). Mark Norwegian criminal charges as "verified" (multiple wire services). Mark the 151 missing FD-302 methodology as "unverified-methodology" until independently confirmed — NPR's 53-page and CNN's 90+ findings are verified.
6. **The 2016 politician email (EFTA_R1_00605090)**: Do NOT attribute to Rubio — only note it as "redacted Republican politician" with community speculation. The attribution is unconfirmed.
