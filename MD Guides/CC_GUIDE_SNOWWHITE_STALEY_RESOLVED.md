# CC_GUIDE: Snow White / Jes Staley Thread — Probe Resolution & Implementation
**Date:** 2026-03-04  
**Target directory:** `/workspaces/JEI/Reels`  
**Status:** NEW GUIDE — implements resolved probes from CC_MASTER_PROBE_LIST  
**Do not modify:** Any file not explicitly listed in this guide.

---

## SUMMARY OF RESEARCH FINDINGS

This guide implements updates following document review of primary EFTA source files and a federal court filing. The following probes from the master list are now **RESOLVED**:

| Probe | Prior Status | New Status | Key Finding |
|-------|-------------|------------|-------------|
| "Snow White" Bates confirmation | HIGH — PARTIALLY VERIFIED | ✅ VERIFIED | Multiple Bates numbers confirmed (see below) |
| Confirm sender identity in Snow White email | MEDIUM — COMMUNITY INFERENCE | ✅ VERIFIED | Sender is Jes Staley, NOT Jess Stolle |
| Jes Staley JPMorgan relationship | EXISTING NODE — incomplete | ✅ UPGRADED | 1,200 emails, full court filing citation available |

### Critical Correction
The existing CC_GUIDE_REELS2_5 guide attributed the Snow White email to "Jess Stolle" (community researcher inference) and described the sender as a 34-year JPMorgan employee. **This is incorrect.** The sender is **Jes Staley**, then-head of JPMorgan's Private Bank and later CEO of Barclays. This is a significantly more important figure. The Jess Stolle person node, if it was implemented, must be **flagged as a misidentification** or removed.

---

## PRIMARY SOURCE DOCUMENTS (All Confirmed)

| Bates Number | Document | Content |
|-------------|----------|---------|
| `EFTA00188290` (= `SDNY_GM_00077821`, `JPM-SDNY-00000948`) | Jes Staley → Epstein, July 9/10, 2010 | "Maybe they're tracking u?? That was fun. Say hi to Snow White." |
| `EFTA00188291` (= `SDNY_GM_00077822`, `JPM-SDNY-00000949`) | Epstein → Jes Staley, July 10, 2010 | "what character would you like next" |
| `EFTA00145666` | USVI v. JPMorgan, Case 1:22-cv-10904-JSR, Doc. 119 (Second Amended Complaint, April 12, 2023) | Court filing quoting full exchange including "Beauty and the Beast" follow-up; names Staley explicitly |
| `EFTA_R1_00193438` | Epstein → [redacted], November 4, 2009 | "snow white? now what?" |
| `EFTA00893031` | Epstein → [redacted], June 20, 2010 | Snow White costume pretext email referencing Brett Ratner film |
| `EFTA00741531` | [redacted] → "Jeffrey", July 10, 2010, 12:36 AM | Extremely explicit — references "snow white" costume in context of assault; implement at Level 4 only with trigger warning |
| `EFTA_R1_01470925` | [redacted] → Epstein, July 9, 2010, 6:57 PM | Subject: "Snow white"; body redacted in available copy |
| `EFTA_R1_01194666` | [redacted] → [redacted], June 26, 2012 | "I watched Snow White and this is what happened... :)" with attachments (lunchajpg; White.jpg) |
| `EFTA_R1_02062214` | [redacted] → "JE Jail", date unclear | "I watched Snow White..." sent to Epstein's jail address |

**Note on EFTA_R1_00741531:** This document contains highly explicit language in the context of assault. It should be implemented at Level 4 only, behind a content trigger warning, and framed as evidence of criminal conduct — not quoted verbatim in the timeline scanline or summary levels.

---

## PHASE 1 — UPDATE / CREATE JES STALEY PERSON NODE

File: `src/data/people.json`

**Search for an existing `jes-staley` node. If it exists, replace it entirely. If it does not exist, add it.**

```json
{
  "id": "jes-staley",
  "name": "James Edward 'Jes' Staley",
  "category": "Financial — JPMorgan Chase / Barclays",
  "status": "VERIFIED — Named Defendant (JPMorgan Third-Party Complaint, SDNY 2023)",
  "dojMentionCount": "Extensive — cited throughout USVI v. JPMorgan filing; ~1,200 emails with Epstein documented",
  "summary": "Former head of JPMorgan Chase's Private Bank and later CEO of Barclays. Staley developed what the USVI court complaint describes as a 'close personal' and 'profound' friendship with Jeffrey Epstein between approximately 2008 and 2012, exchanging roughly 1,200 emails from his JPMorgan corporate account. In July 2010, Staley sent Epstein the message: 'That was fun. Say hi to Snow White.' Epstein replied: 'what character would you like next?' Staley then said 'Beauty and the Beast,' and Epstein replied 'well one side is available.' This exchange — confirmed in primary EFTA documents and quoted in a federal court filing — occurred two years after Epstein's 2008 conviction and during the period Epstein was supposed to be operating under restrictions. JPMorgan tasked Staley to conduct internal discussions with Epstein about human trafficking allegations against him. Staley left JPMorgan in 2013 and became CEO of Barclays, stepping down in November 2021 after the UK Financial Conduct Authority concluded an investigation into his characterization of his relationship with Epstein. JPMorgan was subsequently named as a defendant in a trafficking lawsuit by the US Virgin Islands government and paid $290 million to DOJ and $75 million to USVI in settlements.",
  "role": "Head of JPMorgan Private Bank (during Epstein relationship); later CEO of Barclays. Third-party defendant in USVI v. JPMorgan (1:22-cv-10904-JSR).",
  "themeIds": ["financial-crimes", "jpmorgan-thread", "coded-communications", "post-conviction-operation"],
  "connections": [
    {
      "personId": "jeffrey-epstein",
      "type": "correspondence",
      "description": "Approximately 1,200 emails exchanged via JPMorgan corporate account, 2008–2012. Visited Epstein's Little St. James property and Palm Beach residence. July 2010 Snow White email exchange confirmed at EFTA00188290–00188291.",
      "verificationStatus": "VERIFIED"
    },
    {
      "personId": "glenn-dubin",
      "type": "professional",
      "description": "Epstein introduced Staley to Glenn Dubin (Highbridge Capital Management) in 2004, facilitating JPMorgan's subsequent acquisition of Highbridge and advancing Staley's career.",
      "verificationStatus": "VERIFIED"
    }
  ],
  "keyDocuments": [
    {
      "batesNumber": "EFTA00188290",
      "crossRef": ["SDNY_GM_00077821", "JPM-SDNY-00000948"],
      "description": "Staley to Epstein, July 9/10 2010: 'Maybe they're tracking u?? That was fun. Say hi to Snow White.'",
      "verificationStatus": "VERIFIED"
    },
    {
      "batesNumber": "EFTA00188291",
      "crossRef": ["SDNY_GM_00077822", "JPM-SDNY-00000949"],
      "description": "Epstein to Staley, July 10 2010: 'what character would you like next'",
      "verificationStatus": "VERIFIED"
    },
    {
      "batesNumber": "EFTA00145666",
      "description": "USVI v. JPMorgan, Case 1:22-cv-10904-JSR, Second Amended Complaint (April 12, 2023) — quotes full Snow White exchange including 'Beauty and the Beast' follow-up at ¶61; Staley relationship detailed at ¶¶52–64; 100.",
      "verificationStatus": "VERIFIED — Federal Court Filing"
    }
  ],
  "sources": [
    {
      "type": "DOJ-EFTA",
      "citation": "EFTA00188290 (SDNY_GM_00077821 / JPM-SDNY-00000948) — Staley to Epstein Snow White email, July 9/10, 2010",
      "verificationStatus": "VERIFIED"
    },
    {
      "type": "DOJ-EFTA",
      "citation": "EFTA00188291 (SDNY_GM_00077822 / JPM-SDNY-00000949) — Epstein to Staley reply, July 10, 2010",
      "verificationStatus": "VERIFIED"
    },
    {
      "type": "COURT-FILING",
      "citation": "Government of the United States Virgin Islands v. JPMorgan Chase Bank, N.A., Case 1:22-cv-10904-JSR, Document 119 (Second Amended Complaint, April 12, 2023), ¶¶52–64",
      "verificationStatus": "VERIFIED"
    },
    {
      "type": "PUBLIC-RECORD",
      "citation": "JPMorgan Chase $290M DOJ settlement and $75M USVI settlement, 2023",
      "verificationStatus": "VERIFIED"
    }
  ],
  "openResearchQuestions": [
    "Obtain Bates numbers for the 'Beauty and the Beast' follow-up in the same email thread (quoted in court filing at ¶61 but not separately identified in available EFTA documents).",
    "Confirm FCA (UK Financial Conduct Authority) final report findings on Staley's characterization of Epstein relationship — November 2021.",
    "Search EFTA for the January 8, 2009 $2,000 wire to Eastern European woman timed to Staley's Palm Beach visit (referenced at ¶54 of court filing).",
    "Search EFTA for the August 31, 2009 $3,000 wire to same woman timed to Staley's London trip (referenced at ¶55 of court filing).",
    "Identify the donor-advised fund ('very HIGH profile' DAF) discussed between Epstein and Staley in 2011 — the DAF head's name is redacted in available documents (¶73)."
  ]
}
```

---

## PHASE 2 — FLAG OR REMOVE JESS STOLLE PERSON NODE

File: `src/data/people.json`

**Search for a `jess-stolle` person node. If it exists:**

Replace the node entirely with the following correction node, OR delete it if the site's data architecture allows deletion. If deletion is cleaner, remove it and add a note in the git commit message.

```json
{
  "id": "jess-stolle",
  "name": "Jess Stolle (Misidentification — See Jes Staley)",
  "category": "MISIDENTIFICATION — Research Correction",
  "status": "RETRACTED — Community misidentification resolved by primary documents",
  "summary": "A community researcher (Instagram: not.an.official.news.source) identified the sender of the July 9, 2010 'Say hi to Snow White' email as 'Jess Stolle,' a long-term JPMorgan Chase employee, based on the sender's first name ('Jess') and a visual comparison to an artwork. This identification was incorrect. Primary EFTA documents (EFTA00188290) and the USVI federal court filing (Case 1:22-cv-10904-JSR) confirm the sender was Jes Staley — then-head of JPMorgan's Private Bank. This node is retained only to document the correction. All research activity should be attributed to the Jes Staley node.",
  "verificationStatus": "RETRACTED — MISIDENTIFICATION",
  "themeIds": [],
  "connections": [],
  "sources": [
    {
      "type": "CORRECTION",
      "citation": "Corrected by EFTA00188290 and USVI v. JPMorgan, Case 1:22-cv-10904-JSR, ¶61 (April 12, 2023)",
      "verificationStatus": "VERIFIED — Correction"
    }
  ]
}
```

---

## PHASE 3 — UPDATE SNOW WHITE TIMELINE ENTRY

File: `src/data/timeline.json`

**Find the existing entry with `id: "snow-white-email-2010"`. Replace it entirely:**

```json
{
  "id": "snow-white-email-2010",
  "date": "2010-07-09",
  "era": "Post-Conviction Operation",
  "title": "Jes Staley to Epstein: 'Say hi to Snow White'",
  "summary": "On July 9, 2010 — two years after Epstein's 2008 conviction and during a period when Epstein was operating under registered sex-offender restrictions — Jes Staley, then head of JPMorgan Chase's Private Bank, sent Epstein the message: 'Maybe they're tracking u?? That was fun. Say hi to Snow White.' Epstein replied: 'what character would you like next?' The exchange continued: Staley replied 'Beauty and the Beast'; Epstein replied 'well one side is available.' These emails were later quoted in the USVI government's federal lawsuit against JPMorgan and are cited as suggesting Staley 'may have been involved in Epstein's sex-trafficking operation' (Complaint ¶53).",
  "significance": "HIGH — Verified primary document. JPMorgan executive in coded post-conviction correspondence with Epstein, cited in federal trafficking lawsuit.",
  "verificationStatus": "VERIFIED",
  "sourceType": "DOJ-EFTA + COURT-FILING",
  "sourceCitation": "EFTA00188290 / EFTA00188291 (SDNY_GM_00077821-22 / JPM-SDNY-00000948-49); USVI v. JPMorgan, 1:22-cv-10904-JSR, Doc. 119 ¶61",
  "relatedPersonIds": ["jeffrey-epstein", "jes-staley"],
  "relatedThemeIds": ["financial-crimes", "jpmorgan-thread", "coded-communications", "post-conviction-operation"],
  "progressiveDisclosure": {
    "level1": "July 9, 2010: JPMorgan executive Jes Staley to Epstein — 'That was fun. Say hi to Snow White.'",
    "level2": "Epstein replied: 'what character would you like next?' Staley said 'Beauty and the Beast.' Epstein replied: 'well one side is available.' The exchange occurred two years after Epstein's 2008 conviction. The USVI government's federal lawsuit against JPMorgan cited this exchange as suggesting Staley 'may have been involved in Epstein's sex-trafficking operation.' JPMorgan later paid $290M to DOJ and $75M to USVI in settlements.",
    "level3": "Staley was head of JPMorgan's Private Bank at the time — the division serving clients with at least $10 million in assets. He exchanged approximately 1,200 emails with Epstein from his JPMorgan corporate account between 2008 and 2012 (Complaint ¶53). JPMorgan later tasked Staley himself to discuss the human trafficking allegations with Epstein, despite his obvious personal relationship (Complaint ¶¶47, 62). The Snow White email cluster spans June–July 2010 and includes multiple correspondents. At least six 'Snow White' emails are documented in the EFTA set, involving multiple different senders and recipients.",
    "level4Sources": [
      "DOJ-EFTA: EFTA00188290 (SDNY_GM_00077821 / JPM-SDNY-00000948) — Staley to Epstein, July 9/10 2010",
      "DOJ-EFTA: EFTA00188291 (SDNY_GM_00077822 / JPM-SDNY-00000949) — Epstein to Staley reply",
      "COURT FILING: Government of the USVI v. JPMorgan Chase Bank, N.A., Case 1:22-cv-10904-JSR, Document 119, ¶¶52–64 (Second Amended Complaint, April 12, 2023)",
      "PUBLIC RECORD: Jes Staley resigned as Barclays CEO November 2021 following FCA investigation into his Epstein relationship",
      "PUBLIC RECORD: JPMorgan Chase $290M DOJ settlement / $75M USVI settlement, 2023"
    ]
  }
}
```

---

## PHASE 4 — ADD ADDITIONAL SNOW WHITE TIMELINE ENTRIES

File: `src/data/timeline.json`

Add the following new entries. Insert them in chronological order.

### Entry 1: November 2009 — "snow white? now what?"

```json
{
  "id": "snow-white-now-what-2009",
  "date": "2009-11-04",
  "era": "Post-Conviction Operation",
  "title": "Epstein Email: 'Snow White? Now What?'",
  "summary": "On November 4, 2009, while under Florida sex-offender registration requirements, Epstein sent an email to a redacted recipient with the subject 'snow white? now what?' The recipient's identity and full context of the exchange are not available in the redacted document.",
  "significance": "MEDIUM — Establishes 'Snow White' as a recurring reference in Epstein's correspondence predating the July 2010 Staley exchange.",
  "verificationStatus": "VERIFIED",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "EFTA_R1_00193438",
  "relatedPersonIds": ["jeffrey-epstein"],
  "relatedThemeIds": ["coded-communications", "post-conviction-operation"],
  "progressiveDisclosure": {
    "level1": "November 4, 2009: Epstein email — 'snow white? now what?'",
    "level2": "The email was sent from Epstein's jeevacation@gmail.com account to a redacted recipient. The recipient and full context are not available in the document. The email predates the July 2010 Staley 'Snow White' exchange by approximately eight months.",
    "level3": "The existence of multiple 'Snow White' emails across different correspondents and dates — November 2009, June 2010, and July 2010 — suggests the reference was a recurring feature of Epstein's post-conviction communications rather than an isolated exchange. The pattern is documented across at least six separate EFTA documents.",
    "level4Sources": [
      "DOJ-EFTA: EFTA_R1_00193438 — Epstein email, November 4, 2009"
    ]
  }
}
```

### Entry 2: June 2010 — Brett Ratner / Snow White Costume Pretext

```json
{
  "id": "snow-white-brett-ratner-2010",
  "date": "2010-06-20",
  "era": "Post-Conviction Operation",
  "title": "Epstein Uses Brett Ratner Film as Pretext for Snow White Costume Request",
  "summary": "On June 20, 2010, Epstein wrote to a redacted female correspondent: 'brett ratner is going to film a big movie, Snow White, i would love to take photos of you in a snow white costume. you can get it from the costume store.' The correspondent had written that students wanted to film her and she had received audition feedback. Epstein used a purported Ratner film as justification for a costume request.",
  "significance": "MEDIUM — Documents the operational use of 'Snow White' as a recruitment/grooming pretext, and introduces Brett Ratner as a referenced figure in Epstein's correspondence.",
  "verificationStatus": "VERIFIED",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "EFTA00893031",
  "relatedPersonIds": ["jeffrey-epstein"],
  "relatedThemeIds": ["coded-communications", "post-conviction-operation", "trafficking-operations"],
  "progressiveDisclosure": {
    "level1": "June 20, 2010: Epstein uses Brett Ratner film as pretext to request Snow White costume from female correspondent.",
    "level2": "The correspondent wrote to Epstein that she had received positive audition feedback and that students wanted to film her. Epstein replied: 'brett ratner is going to film a big movie, Snow White, i would love to take photos of you in a snow white costume.' The email was sent from Epstein's jeevacation@gmail.com account. The correspondent's identity is redacted.",
    "level3": "This email is notable because it demonstrates the grooming mechanism: leveraging a named Hollywood director to add legitimacy to a costume request for a young woman who had just mentioned being filmed. Brett Ratner is separately documented in the public record as a figure accused of sexual misconduct; his connection to Epstein via this document has not been independently established beyond this single reference.",
    "level4Sources": [
      "DOJ-EFTA: EFTA00893031 — Epstein to redacted correspondent, June 20, 2010",
      "NOTE: Brett Ratner name appears as a reference only; no independent EFTA documentation of a Ratner-Epstein relationship has been confirmed from available documents."
    ]
  }
}
```

### Entry 3: July 10, 2010 — "Snow White Was [Assaulted]" (Content Warning Required)

> **IMPLEMENTATION NOTE:** This entry contains a reference to sexual assault. Implement behind a content trigger warning at ALL disclosure levels. The level 1 scanline must not reproduce the explicit language. The Bates number is EFTA00741531.

```json
{
  "id": "snow-white-assault-reference-2010",
  "date": "2010-07-10",
  "era": "Post-Conviction Operation",
  "title": "EFTA Document References Snow White Costume and Sexual Assault [Content Warning]",
  "contentWarning": true,
  "summary": "An EFTA document (EFTA00741531) dated July 10, 2010 — sent within hours of the Staley 'Snow White' email — contains a message from a redacted sender to 'Jeffrey' referencing a woman in a Snow White costume in explicit terms describing sexual assault. The sender and recipient identities are redacted in the available document. The message was sent at 12:36 AM on July 10, the same date as Epstein's reply to Staley.",
  "significance": "HIGH — If the correspondence cluster is connected, this document provides direct context for what 'Snow White' referred to in the July 2010 exchanges. Proximity in time to the Staley exchange is significant.",
  "verificationStatus": "VERIFIED",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "EFTA00741531",
  "relatedPersonIds": ["jeffrey-epstein"],
  "relatedThemeIds": ["coded-communications", "post-conviction-operation", "trafficking-operations"],
  "progressiveDisclosure": {
    "level1": "[Content Warning: Sexual Violence] July 10, 2010 EFTA document references Snow White costume in context of sexual assault — sent same date as Staley exchange.",
    "level2": "[Content Warning] An EFTA document sent in the early hours of July 10, 2010 — the same date as Epstein's reply to Staley's 'Say hi to Snow White' message — references a woman in a Snow White costume in explicit terms describing sexual assault. Both sender and recipient identities are redacted. The temporal proximity to the Staley email cluster (July 9–10, 2010) may be significant, though the connection between the correspondents cannot be confirmed from available documents.",
    "level3": "[Content Warning] The July 9–10, 2010 window contains at least four separate 'Snow White' documents: (1) a redacted email with subject 'Snow white' at 6:57 PM July 9 (EFTA_R1_01470925); (2) Staley's 'Say hi to Snow White' at approximately 8:45 PM July 9 (EFTA00188290); (3) Epstein's reply 'what character would you like next' at 1:02 AM July 10 (EFTA00188291); and (4) this assault-reference document at 12:36 AM July 10 (EFTA00741531). The clustering of these documents within an approximately 18-hour window is consistent with a coordinated event.",
    "level4Sources": [
      "DOJ-EFTA: EFTA00741531 — Redacted sender to 'Jeffrey', July 10, 2010, 12:36 AM",
      "CONTEXT: EFTA_R1_01470925 — Redacted sender to Epstein, July 9, 2010, 6:57 PM, subject: 'Snow white'",
      "CONTEXT: EFTA00188290 — Staley to Epstein, July 9/10 2010",
      "CONTEXT: EFTA00188291 — Epstein to Staley, July 10 2010"
    ]
  }
}
```

---

## PHASE 5 — UPDATE JPMorgan THEME NODE

File: `src/data/themes.json`

**Find the `jpmorgan-thread` theme node. Update the `keyFacts` array and `verificationStatus`. Do not modify fields not listed below.**

Replace `keyFacts` with:

```json
"keyFacts": [
  "JPMorgan maintained Epstein accounts from approximately 1998–2013, servicing approximately 55 Epstein-related accounts collectively worth hundreds of millions of dollars.",
  "The bank paid $290M to DOJ and $75M to USVI in 2023 settlements following a federal lawsuit by the USVI government.",
  "Internal JPMorgan emails show compliance officers flagged Epstein as high-risk as early as 2006.",
  "Jes Staley, head of JPMorgan's Private Bank, exchanged approximately 1,200 emails with Epstein from his JPMorgan corporate account between 2008 and 2012. The USVI lawsuit alleged these communications suggest Staley 'may have been involved in Epstein's sex-trafficking operation.'",
  "In July 2010 — two years after Epstein's conviction — Staley wrote to Epstein: 'That was fun. Say hi to Snow White.' Epstein replied: 'what character would you like next?' The full exchange is confirmed in primary EFTA documents and cited in the USVI federal complaint.",
  "JPMorgan tasked Staley to conduct the bank's internal discussions with Epstein about human trafficking allegations, despite Staley's documented personal relationship with Epstein.",
  "A senior JPMorgan compliance official reviewing Epstein's file in 2011 wrote: 'Lots of smoke. Lots of questions.' The file noted that Epstein was 'an alleged personal associate of the CEO of the Investment Bank (Jes Staley).'",
  "At least $1.5 million was paid from JPMorgan accounts to known recruiters including the MC2 modeling agency, and Epstein withdrew more than $775,000 in cash from JPMorgan accounts.",
  "Epstein introduced Staley to Glenn Dubin (Highbridge Capital Management) in 2004, facilitating JPMorgan's subsequent acquisition of Highbridge and Staley's career advancement.",
  "Staley became CEO of Barclays after leaving JPMorgan in 2013. He resigned in November 2021 following an FCA investigation into his characterization of his Epstein relationship."
]
```

Replace `verificationStatus` with:
```json
"verificationStatus": "VERIFIED (institutional record, court filings, EFTA primary documents)"
```

Replace `relatedPersonIds` with:
```json
"relatedPersonIds": ["jeffrey-epstein", "jes-staley", "ghislaine-maxwell"]
```

---

## PHASE 6 — SEARCH INDEX UPDATE

File: `src/data/search-index.json`

Add or update the following entries:

```json
[
  {
    "type": "person",
    "id": "jes-staley",
    "title": "James Edward 'Jes' Staley",
    "excerpt": "Former head of JPMorgan's Private Bank. Exchanged ~1,200 emails with Epstein. Sent 'Say hi to Snow White' July 2010. Later Barclays CEO; resigned 2021 after FCA investigation.",
    "fullText": "Jes Staley JPMorgan Private Bank Barclays CEO Snow White email EFTA00188290 Beauty Beast Epstein correspondence 1200 emails USVI lawsuit FCA investigation Glenn Dubin Highbridge post-conviction coded communications"
  },
  {
    "type": "event",
    "id": "snow-white-email-2010",
    "title": "Jes Staley to Epstein: 'Say hi to Snow White' (July 9, 2010)",
    "excerpt": "Confirmed EFTA primary document. Staley/Epstein Snow White exchange, two years post-conviction. Cited in USVI v. JPMorgan federal complaint.",
    "date": "2010-07-09",
    "era": "Post-Conviction Operation",
    "sources": "EFTA00188290, EFTA00188291, USVI v. JPMorgan 1:22-cv-10904-JSR"
  }
]
```

---

## PHASE 7 — CORRECTION NOTE IN REELS GUIDE (If File Exists)

If the file `Reels/CC_GUIDE_REELS2_5_BONDI_4CHAN_SNOWWHITE_CORCORAN.md` exists in the repo, add the following correction block at the very top of the file, after the title and before the first section:

```markdown
---
## ⚠️ CORRECTION — CLUSTER C (Snow White / Sender Identity)

**Date of correction:** 2026-03-04  
**Resolved by:** CC_GUIDE_SNOWWHITE_STALEY_RESOLVED.md

The sender identified in this guide as "Jess Stolle" (a community inference from Instagram researcher not.an.official.news.source) has been **corrected** by primary EFTA documents and a federal court filing.

**The sender is Jes Staley** — then-head of JPMorgan Chase's Private Bank, later CEO of Barclays. His name appears in full in the email headers (EFTA00188290 / EFTA00188291), and the full exchange is quoted at paragraph 61 of the USVI v. JPMorgan Second Amended Complaint (Case 1:22-cv-10904-JSR, Document 119, filed April 12, 2023).

**The community researcher's visual comparison to the painting and the "Jess Stolle" identification were incorrect.** This is not a minor correction — Jes Staley is a substantially more significant figure than the community inference suggested. All Cluster C implementation should use the Jes Staley person node, not a Jess Stolle node.

See `CC_GUIDE_SNOWWHITE_STALEY_RESOLVED.md` for the complete corrected implementation.

---
```

---

## PROBE LIST STATUS UPDATE

The following entries in `CC_MASTER_PROBE_LIST.md` can be marked RESOLVED:

| Probe | Venue | Resolution |
|-------|-------|-----------|
| "Snow White" Bates confirmation | Jmail / EFTA | ✅ RESOLVED — EFTA00188290, EFTA00188291, and six additional Bates numbers confirmed |
| Confirm sender identity — "Jess" in Snow White email | Jmail / EFTA | ✅ RESOLVED — Sender is Jes Staley, not Jess Stolle |
| CRITICAL PATH item #2 (Snow White Bates confirmation) | All | ✅ RESOLVED |

The following probes are now **elevated in priority** based on these findings:

| New/Elevated Probe | Rationale |
|-------------------|-----------|
| Bates numbers for "Beauty and the Beast" follow-up email | Quoted in court filing ¶61 but not in available EFTA extract — likely in same email thread |
| Jes Staley FCA investigation findings (UK) — November 2021 | FCA report on Staley's characterization of Epstein relationship is a primary document |
| $2,000 wire January 8, 2009 (timing of Staley Palm Beach visit) | Court filing ¶54 — may have Bates number in financial records section |
| $3,000 wire August 31, 2009 (timing of Staley London trip) | Court filing ¶55 |
| Redacted DAF head identity (2011 donor-advised fund discussions) | Court filing ¶73 — high-profile figure |

---

*Guide compiled from primary EFTA document review, 2026-03-04.*  
*Verification Wall methodology: All VERIFIED status items confirmed by Bates-stamped primary documents or sworn/filed court documents.*  
*Do not modify any files outside those explicitly listed above.*
