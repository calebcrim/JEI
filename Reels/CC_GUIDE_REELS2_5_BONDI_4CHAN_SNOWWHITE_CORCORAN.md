# CC_GUIDE — Reels 2–5: Bondi/Frankel · 4chan/Moot · JPMorgan Snow White · Corcoran Group
## Epstein Files Research Database — New Content Series

---
## ⚠️ CORRECTION — CLUSTER C (Snow White / Sender Identity)

**Date of correction:** 2026-03-04
**Resolved by:** CC_GUIDE_SNOWWHITE_STALEY_RESOLVED.md

The sender identified in this guide as "Jess Stolle" (a community inference from Instagram researcher not.an.official.news.source) has been **corrected** by primary EFTA documents and a federal court filing.

**The sender is Jes Staley** — then-head of JPMorgan Chase's Private Bank, later CEO of Barclays. His name appears in full in the email headers (EFTA00188290 / EFTA00188291), and the full exchange is quoted at paragraph 61 of the USVI v. JPMorgan Second Amended Complaint (Case 1:22-cv-10904-JSR, Document 119, filed April 12, 2023).

**The community researcher's visual comparison to the painting and the "Jess Stolle" identification were incorrect.** This is not a minor correction — Jes Staley is a substantially more significant figure than the community inference suggested. All Cluster C implementation should use the Jes Staley person node, not a Jess Stolle node.

See `CC_GUIDE_SNOWWHITE_STALEY_RESOLVED.md` for the complete corrected implementation.

---

**Sources:** Four Instagram Reels (community investigative analysis)
**Channels:** [unlabeled], ginotheghost, not.an.official.news.source, bubba.bosco
**Reel IDs:** DUlp1H7ki3Y · DUTbNfFCZw_ · DUvFJdmDNlI · DUrQRjDDUFA

**Purpose:** Integrate four distinct content clusters surfaced by community researchers.
Each cluster has a different evidentiary profile — some anchor on specific EFTA documents,
others are editorial analysis or community hypothesis. Verification status is explicitly
tiered throughout per the Verification Wall methodology.

**Estimated implementation time:** 4–7 hours  
**Risk to existing functionality:** Very low — additive people nodes, timeline entries, and
theme enhancements. No schema changes required.  
**Build verification:** `npm run build` after Phase 4 and after Phase 6.

---

## CLUSTER A — Pam Bondi, Keith Frankel & the Body Boxes Email
**Reel ID:** DUlp1H7ki3Y · Channel: unlabeled

### What Was Claimed

The reel alleges the following specific, document-anchored facts:

1. **The body boxes email:** A communication between Keith Frankel and Jeffrey Epstein on
   **February 10, 2010** referenced "body boxes." The reel does not quote the email verbatim
   but implies this phrase appears in the EFTA document set.

2. **Keith Frankel's access:** Frankel allegedly visited Epstein's house "many times."
   This is presented as documented rather than alleged.

3. **Pam Bondi connection:** Attorney General / DOJ official Pam Bondi is shown in an
   image with Frankel. The reel questions whether Epstein victims she publicly sympathized
   with are aware of this relationship.

4. **Ukraine children's home:** The Epstein files contain references to children being
   trafficked out of Ukraine. The reel connects this to the claim that Keith Frankel and
   his family operate a children's home that moves children out of Ukraine.

### Verification Assessment

| Claim | Status | Notes |
|-------|--------|-------|
| Keith Frankel ↔ Epstein email, Feb 10, 2010 | ✅ VERIFIED | EFTA00764733 confirmed. "Body Boxes" is a product name for body sculpting supplement. 460+ EFTA mentions via Jmail. |
| "Body boxes" phrase in Epstein correspondence | ✅ VERIFIED | EFTA00764733 + EFTA00764728 confirm: "THE BODY — 28 DAY BODY SCULPTING SYSTEM" — product packaging, not trafficking terminology. |
| Frankel visited Epstein's house multiple times | ✅ VERIFIED | EFTA02429595 confirms Palm Beach visit March 7, 2010. 460+ EFTA email references confirm regular contact. |
| Ukraine child trafficking reference in EFTA files | ⚠️ PARTIALLY VERIFIED | EFTA00214249 (DataSet 9) — heavily redacted Eastern European victim article confirmed. David Stern/Odessa email (July 2011) source-documented but Bates unknown. |
| Frankel family children's home / Ukraine operations | ✅ CORROBORATED | Tikva Children's Home, Odessa, Ukraine. EIN 22-3779212 (501(c)(3)). Ed Frankel, chairman. Sun Sentinel 2017; NJ Jewish News. Legitimate humanitarian org. |
| Pam Bondi photographed with Frankel | ⚠️ COMMUNITY CLAIM | Image referenced but not linked to an EFTA document. Verify via public record. |

### Phase A-1: New Person Node — Keith Frankel

Add to `src/data/people.json` if not already present:

```json
{
  "id": "keith-frankel",
  "name": "Keith Frankel",
  "category": "Associate — Needs Verification",
  "status": "UNVERIFIED — Under Community Investigation",
  "dojMentionCount": 1,
  "summary": "Named in community investigative analysis as a documented correspondent with Jeffrey Epstein. Alleged to have exchanged an email with Epstein on February 10, 2010 referencing 'body boxes.' Alleged to have visited Epstein's properties on multiple occasions. Community researchers have also flagged a familial connection to a children's home operating in Ukraine, in proximity to EFTA references to children being trafficked out of Ukraine. All claims require EFTA document verification. Separately noted as having a documented relationship with former AG Pam Bondi.",
  "role": "Alleged Epstein correspondent and repeat visitor. Specific role unconfirmed in verified EFTA documents as of guide compilation date.",
  "themeIds": ["network-associates", "ukraine-trafficking"],
  "connections": [
    {
      "personId": "jeffrey-epstein",
      "type": "correspondence",
      "description": "Alleged email exchange February 10, 2010 referencing 'body boxes.' Alleged multiple property visits. UNVERIFIED — pending EFTA document cross-reference.",
      "verificationStatus": "UNVERIFIED"
    },
    {
      "personId": "pam-bondi",
      "type": "social",
      "description": "Photographed together per community researcher. Relationship nature unspecified.",
      "verificationStatus": "COMMUNITY CLAIM"
    }
  ],
  "sources": [
    {
      "type": "COMMUNITY",
      "citation": "Instagram Reel DUlp1H7ki3Y — unlabeled creator",
      "verificationStatus": "UNVERIFIED",
      "notes": "Specific claims require EFTA document cross-reference before upgrading verification status. Search Jmail.world for: Frankel, body boxes, February 2010."
    }
  ],
  "openResearchQuestions": [
    "Locate February 10, 2010 Epstein-Frankel email in EFTA set. Confirm Bates number.",
    "Search EFTA set for all Frankel mentions. Compile visit records if present.",
    "Verify Keith Frankel / family Ukraine children's home via NGO registration or corporate records.",
    "Identify EFTA document(s) referencing Ukraine child trafficking. Cross-reference with Frankel.",
    "Confirm or contextualize Bondi-Frankel relationship via public record."
  ]
}
```

### Phase A-2: New Person Node — Pam Bondi

Add to `src/data/people.json` if not already present:

```json
{
  "id": "pam-bondi",
  "name": "Pam Bondi",
  "category": "Government / Legal",
  "status": "Peripheral — Public Official",
  "dojMentionCount": 0,
  "summary": "Former Florida Attorney General (2011–2019), later U.S. Attorney General. As Florida AG, Bondi declined to join a multistate investigation into Jeffrey Epstein in 2013, a decision that was widely criticized by victims' advocates. She later made public statements expressing sympathy for Epstein victims. Community researchers have raised questions about her relationship with Keith Frankel, who is alleged to have had documented Epstein connections.",
  "role": "Government official. Declined to join multistate Epstein investigation (2013) as Florida AG.",
  "themeIds": ["political-influence", "law-enforcement-failures", "florida-network"],
  "connections": [
    {
      "personId": "jeffrey-epstein",
      "type": "government-oversight",
      "description": "Florida AG who declined to join multistate investigation into Epstein in 2013.",
      "verificationStatus": "VERIFIED"
    },
    {
      "personId": "keith-frankel",
      "type": "social",
      "description": "Photographed with Frankel per community researcher. Relationship nature unspecified.",
      "verificationStatus": "COMMUNITY CLAIM"
    }
  ],
  "sources": [
    {
      "type": "NEWS",
      "citation": "Multiple contemporaneous news reports — Bondi declined to join Epstein multistate investigation, 2013",
      "verificationStatus": "VERIFIED"
    }
  ]
}
```

### Phase A-3: Theme Node — Ukraine Trafficking Thread

Check `src/data/themes.json`. If no Ukraine-specific theme exists, add:

```json
{
  "id": "ukraine-trafficking",
  "title": "Eastern European / Ukraine Trafficking References",
  "shortTitle": "Ukraine Thread",
  "summary": "The EFTA document set contains references to children being trafficked out of Ukraine. Community researchers have flagged this in proximity to claims about Keith Frankel's family operating a children's home with Ukraine-extraction activities. These threads require systematic EFTA document search to establish the scope and nature of Ukraine references in the files.",
  "verificationStatus": "PARTIALLY VERIFIED",
  "verificationNotes": "EFTA Ukraine trafficking references are asserted by community researcher but specific Bates-stamped documents have not been surfaced publicly as of guide compilation. Community-level claim pending document verification. Separately, EFTA00214249 (DataSet 9) was noted as a 'heavily redacted article about an alleged Eastern European victim reported to have been purchased from her family' — this may be a related reference.",
  "relatedPersonIds": ["jeffrey-epstein", "keith-frankel"],
  "crossReferenceNote": "See also EFTA00214249 (DataSet 9) — heavily redacted Eastern European victim article. Run full-text EFTA search for: Ukraine, Eastern Europe, trafficking, children's home."
}
```

---

## CLUSTER B — Epstein, Moot (4chan Founder) & the /pol/ Launch
**Reel ID:** DUTbNfFCZw_ · Channel: ginotheghost

### ✅ PROBE FULLY RESOLVED — 2026-03-04

**Documents Found:** 4 EFTA PDFs (6 Bates pages) + supplementary EFTA references
**Status Upgrade:** UNVERIFIED COMMUNITY CLAIM → PARTIALLY VERIFIED (factual anchor); COMMUNITY HYPOTHESIS (interpretive framework)
**Key Findings:**
- Boris Nikolic is the confirmed bridge; "the potential for manipulation is huge" (EFTA_R1_00482682, Oct 28, 2011) is in the EFTA record
- /pol/ launched October 23, 2011 — NOT same day as introduction; same-week proximity confirmed
- WaPo article = "4chan users seize Internet's power for mass disruptions" (Cha, Aug 10, 2010) — documented 4chan as anonymous mass manipulation engine
- Seattle trip almost certainly a Gates/bgC3 introduction; unconfirmed whether trip occurred
- No post-February 2012 Epstein–Poole contact across 3.5M released pages; Poole's own statement: "I did not meet him again nor maintain contact"

**Bates Anchors:** EFTA_R1_00486371, EFTA_R1_00498434, EFTA_R1_00482682, EFTA_R1_00861920, EFTA_R1_00861921, EFTA01852812
**Integration Guide:** CC_GUIDE_POOLE_NIKOLIC_INTEGRATED.md

### What Was Claimed

The reel makes one highly specific factual claim that anchors the rest of the editorial analysis:

> *"Jeffrey Epstein sets up a meeting between him and Moot, who is the founder of 4chan.
> On that same day the meeting is set, [/pol] is launched."*

"Moot" is the online handle of **Christopher Poole**, founder of 4chan.org. He stepped down
from 4chan in January 2015 and later joined Google in 2016.

The reel then argues, editorially, that:
- /pol/ ("Politically Incorrect") was "the birthplace of the modern alt-right"
- QAnon originated on /pol/
- Pizzagate was a "right-wing psyop to distract from Trump and Epstein"
- The implication is that Epstein's connection to 4chan's founder represents an intelligence
  asset seeding disinformation infrastructure

The rest of the reel is opinion/interpretation, not document citation.

### Verification Assessment

| Claim | Status | Notes |
|-------|--------|-------|
| Epstein ↔ Christopher Poole ("moot") meeting was scheduled | ✅ VERIFIED | EFTA-confirmed: Boris Nikolic introduced Poole Oct 20, 2011. Epstein met Poole ~Oct 22–24. Meeting scheduled Jan 2012 (cancelled). 4 EFTA PDFs. |
| Meeting date ↔ /pol/ launch date are the same day | ❌ CONTRADICTED (same week confirmed) | /pol/ launched Oct 23, 2011 — three days after intro email, ~1 day before in-person meeting. "Same day" claim contradicted; same-week confirmed. |
| QAnon originated on /pol/ | ✅ PUBLIC RECORD | Q first posted on /pol/ in October 2017. Not disputed. |
| Pizzagate as political psyop | ⚠️ EDITORIAL / OPINION | Community interpretation — not document-sourced. Flag as commentary. |
| Epstein as architect of online radicalization | ⚠️ SPECULATIVE | Inferential argument based on the meeting claim. Not independently sourced. |

### Phase B-1: New Person Node — Christopher Poole ("moot")

```json
{
  "id": "christopher-poole",
  "name": "Christopher Poole",
  "aliases": ["moot"],
  "category": "Tech / Media",
  "status": "UNVERIFIED CONNECTION — Needs Document Cross-Reference",
  "dojMentionCount": 0,
  "summary": "Founder of 4chan.org, the imageboard launched in 2003. Known online as 'moot.' Under his ownership, 4chan launched the /pol/ (Politically Incorrect) board in October 2011, which became a significant node in online radicalization and later hosted early QAnon posts. Poole stepped down from 4chan in January 2015 and joined Google in 2016. Community researcher ginotheghost claims an EFTA document shows Epstein scheduling a meeting with Poole on the same day /pol/ was launched. This claim requires EFTA document verification.",
  "role": "4chan founder. Alleged scheduled meeting with Epstein — date alignment with /pol/ launch asserted but unverified in EFTA documents.",
  "themeIds": ["intelligence-connections", "digital-psyop-hypothesis"],
  "connections": [
    {
      "personId": "jeffrey-epstein",
      "type": "alleged-meeting",
      "description": "Community researcher claims EFTA document shows Epstein scheduling meeting with Poole on same day /pol/ launched (October 2011). UNVERIFIED — no Bates number provided.",
      "verificationStatus": "UNVERIFIED"
    }
  ],
  "sources": [
    {
      "type": "COMMUNITY",
      "citation": "Instagram Reel DUTbNfFCZw_ — ginotheghost",
      "verificationStatus": "UNVERIFIED",
      "notes": "Search EFTA/Jmail for: moot, 4chan, Christopher Poole, Poole. Cross-reference with October 2011 calendar entries if email metadata is available."
    }
  ],
  "openResearchQuestions": [
    "Locate specific EFTA document referencing Poole or 4chan. Confirm Bates number.",
    "Confirm /pol/ launch date. Compare to email/calendar date in EFTA document if found.",
    "Establish whether meeting occurred or was only proposed."
  ]
}
```

### Phase B-2: New Theme Node — Digital Psyop / Disinformation Infrastructure Hypothesis

This is a **COMMUNITY HYPOTHESIS** theme — it should be clearly marked as such. It surfaces
an important analytical frame that multiple community researchers have explored, but it has
no standalone EFTA document verification independent of the Poole meeting claim.

```json
{
  "id": "digital-psyop-hypothesis",
  "title": "Digital Disinformation Infrastructure — Community Hypothesis",
  "shortTitle": "Psyop Hypothesis",
  "summary": "Community researchers have proposed that Epstein's network had connections to the infrastructure of online radicalization and disinformation, specifically 4chan and its /pol/ board. The theory holds that Pizzagate — which directed public suspicion toward a Democratic pizza restaurant rather than documented Epstein connections — functioned as political misdirection. The anchor claim is an alleged EFTA document showing Epstein scheduling a meeting with 4chan founder Christopher Poole ('moot') on the same day /pol/ launched. This hypothesis has not been verified in EFTA documents as of guide compilation.",
  "verificationStatus": "COMMUNITY HYPOTHESIS",
  "verificationNotes": "The core claim (Epstein-Poole meeting / /pol/ date alignment) is specific and checkable but has not been EFTA-verified. The broader psyop interpretation is editorial analysis, not document evidence. Display with appropriate caveat in UI.",
  "relatedPersonIds": ["jeffrey-epstein", "christopher-poole"],
  "displayFlag": "COMMUNITY HYPOTHESIS — not verified in EFTA documents"
}
```

### Phase B-3: Timeline Entry

```json
{
  "id": "epstein-moot-meeting-alleged-2011",
  "date": "2011-10-01",
  "dateDisplay": "October 2011 (approximate — date unconfirmed)",
  "era": "Post-Plea Operation",
  "title": "Alleged Epstein Meeting with 4chan Founder Christopher Poole",
  "summary": "Community researcher ginotheghost claims an EFTA document shows Epstein scheduling a meeting with Christopher Poole ('moot'), the founder of 4chan, on the same day 4chan's /pol/ board was launched in October 2011. /pol/ later became the origin point of QAnon posts. The claim has not been EFTA-document-verified. No Bates number has been provided. Displayed as an open research thread pending document confirmation.",
  "significance": "MEDIUM — if verified, represents a potentially significant network connection",
  "verificationStatus": "UNVERIFIED — COMMUNITY CLAIM",
  "relatedPersonIds": ["jeffrey-epstein", "christopher-poole"],
  "relatedThemeIds": ["digital-psyop-hypothesis", "intelligence-connections"],
  "progressiveDisclosure": {
    "level1": "Alleged: Epstein scheduled meeting with 4chan founder on same day /pol/ launched.",
    "level2": "Community researcher claims EFTA document links Epstein to Christopher Poole ('moot') in October 2011. /pol/ is the board where QAnon later originated.",
    "level3": "UNVERIFIED. No Bates number provided. This is a community claim requiring EFTA document search to confirm or refute. Search terms: moot, 4chan, Christopher Poole. If confirmed, this would represent a connection between Epstein's network and the infrastructure of online radicalization.",
    "level4Sources": [
      "COMMUNITY: Instagram Reel DUTbNfFCZw_ — ginotheghost (unverified claim)",
      "PUBLIC RECORD: /pol/ board launched October 2011 on 4chan",
      "PUBLIC RECORD: QAnon first posted on /pol/ October 2017",
      "PUBLIC RECORD: Christopher Poole founded 4chan 2003, stepped down January 2015"
    ]
  }
}
```

---

## CLUSTER C — The JPMorgan Painting, "Snow White" Email & Jess Stolle
**Reel ID:** DUvFJdmDNlI · Channel: not.an.official.news.source

### What Was Claimed

The reel analyzes an artwork reportedly connected to the Epstein case and surfaces a
specific email from the EFTA/Epstein library:

**The painting:** Depicts a man in boxers, shirtless, holding a finger to his lips (shh),
standing near a bed with a girl dressed as Snow White. JPMorgan Chase currency is visible.
A mirror faces the bed.

**The email (July 9, 2010):**
- **From:** "Jess" (identified as Jess Stolle by the creator)
- **To:** Jeffrey Epstein
- **Message:** *"That was fun. Say hi to Snow White."*
- **Epstein's reply:** *"What character do you want next?"*

**The JPMorgan connection:** Jess Stolle (if correctly identified) worked at JPMorgan Chase
from approximately 1990 to 2013 — 34 years. JPMorgan Chase is a central institutional thread
in the Epstein financial crimes case (the bank was fined $290M in 2023 for Epstein-related
compliance failures and paid a separate $75M settlement to USVI).

**The image match:** The creator notes that Stolle's publicly available Google Images results
include a photo of him with his finger over his mouth — mirroring the pose of the figure in
the painting. The creator suggests the painting may be a deliberate coded reference.

### Verification Assessment

| Claim | Status | Notes |
|-------|--------|-------|
| Email from "Jess" to Epstein, July 9, 2010, "Snow White" | ⚠️ PARTIALLY VERIFIED | "Snow White" search in Epstein Library reportedly returns this result. Confirm exact Bates number/source doc. |
| Epstein reply "What character do you want next?" | ⚠️ NEEDS VERIFICATION | Confirm in same email thread. |
| "Jess" = Jess Stolle | ⚠️ COMMUNITY IDENTIFICATION | Creator infers identity from email + JPMorgan employment + image match. Not confirmed in EFTA docs. |
| Jess Stolle worked at JPMorgan Chase 1990–2013 | ⚠️ NEEDS VERIFICATION | Plausible per LinkedIn/public record. Confirm independently. |
| Painting depicts figures resembling Stolle + Snow White | ⚠️ COMMUNITY INTERPRETATION | Visual analysis. Note as community hypothesis. |
| "Snow White" = coded reference to a victim | ⚠️ SPECULATIVE | Contextually plausible given "What character do you want next?" reply. Not document-confirmed. |

### Phase C-1: New Person Node — Jess Stolle

```json
{
  "id": "jess-stolle",
  "name": "Jess Stolle",
  "category": "Financial — JPMorgan Chase",
  "status": "UNVERIFIED CONNECTION — Needs Document Cross-Reference",
  "dojMentionCount": 1,
  "summary": "Alleged correspondent with Jeffrey Epstein. A July 9, 2010 email in the Epstein Library from a sender identified as 'Jess' reads: 'That was fun. Say hi to Snow White.' Epstein replied: 'What character do you want next?' Community researcher not.an.official.news.source identifies this sender as Jess Stolle, who reportedly worked at JPMorgan Chase from approximately 1990 to 2013 (34 years). JPMorgan Chase was fined $290M in 2023 for Epstein-related compliance failures. The 'Jess' identification is community inference — not confirmed in the EFTA document set by name.",
  "role": "Alleged Epstein email correspondent. Alleged long-term JPMorgan Chase employee. Identity as 'Jess' in Snow White email is community inference.",
  "themeIds": ["financial-crimes", "jpmorgan-thread", "coded-communications"],
  "connections": [
    {
      "personId": "jeffrey-epstein",
      "type": "correspondence",
      "description": "July 9, 2010 email exchange referencing 'Snow White.' Sender identified as 'Jess.' COMMUNITY IDENTIFICATION — not confirmed by full name in EFTA document.",
      "verificationStatus": "PARTIALLY VERIFIED"
    }
  ],
  "sources": [
    {
      "type": "DOJ-EFTA",
      "citation": "Epstein Library — 'Snow White' search result — Jess to Epstein, July 9, 2010",
      "verificationStatus": "PARTIALLY VERIFIED",
      "notes": "Email content is reportedly in the Epstein Library search index. Full Bates number needed. Sender identified only as 'Jess' in document — Stolle surname is community inference based on JPMorgan employment records and image comparison."
    },
    {
      "type": "COMMUNITY",
      "citation": "Instagram Reel DUvFJdmDNlI — not.an.official.news.source",
      "verificationStatus": "COMMUNITY CLAIM"
    }
  ],
  "openResearchQuestions": [
    "Confirm Bates number for the July 9, 2010 'Snow White' email in Epstein Library.",
    "Confirm full sender name in document — does it include Stolle surname or only 'Jess'?",
    "Verify Jess Stolle JPMorgan employment record via LinkedIn/public sources.",
    "Search EFTA set for any other 'Jess' or 'Stolle' references.",
    "Identify the artwork referenced in the reel and its provenance/current location."
  ]
}
```

### Phase C-2: Timeline Entry

```json
{
  "id": "snow-white-email-2010",
  "date": "2010-07-09",
  "era": "Post-Conviction Operation",
  "title": "Snow White Email: 'That Was Fun. Say Hi to Snow White.'",
  "summary": "An email dated July 9, 2010 in the Epstein Library shows a sender identified as 'Jess' writing to Epstein: 'That was fun. Say hi to Snow White.' Epstein replied: 'What character do you want next?' Community researcher not.an.official.news.source identifies 'Jess' as Jess Stolle, an alleged 34-year JPMorgan Chase employee, based on employment records and a visual comparison to an artwork. The email was sent post-conviction, during the period when Epstein was supposed to be operating under restrictions.",
  "significance": "MEDIUM — if sender identity confirmed, represents a JPMorgan employee in coded post-conviction correspondence",
  "verificationStatus": "PARTIALLY VERIFIED — sender identity unconfirmed",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "Epstein Library — Snow White search result, July 9, 2010",
  "relatedPersonIds": ["jeffrey-epstein", "jess-stolle"],
  "relatedThemeIds": ["financial-crimes", "jpmorgan-thread", "coded-communications", "post-conviction-operation"],
  "progressiveDisclosure": {
    "level1": "Email to Epstein, July 9, 2010: 'That was fun. Say hi to Snow White.'",
    "level2": "Epstein's reply: 'What character do you want next?' Sender identified only as 'Jess' in the document. Community researcher links this to a JPMorgan Chase employee. Email was sent two years after Epstein's 2008 conviction.",
    "level3": "Community identification: Creator identifies 'Jess' as Jess Stolle (alleged JPMorgan Chase, 1990–2013) based on employment record and visual comparison to an artwork depicting a figure with similar appearance and JPMorgan currency. COMMUNITY INFERENCE — sender surname not confirmed in document. JPMorgan paid $290M fine in 2023 for Epstein-related compliance failures.",
    "level4Sources": [
      "DOJ EFTA: Epstein Library, Snow White search — July 9, 2010 (Bates number pending)",
      "COMMUNITY: Instagram Reel DUvFJdmDNlI — not.an.official.news.source",
      "PUBLIC RECORD: JPMorgan Chase $290M DOJ settlement, 2023 (Epstein compliance failures)"
    ]
  }
}
```

### Phase C-3: Theme Enhancement — JPMorgan Thread

Check `src/data/themes.json` for a JPMorgan theme. If it exists, add the Snow White email
as a cross-reference. If not, add:

```json
{
  "id": "jpmorgan-thread",
  "title": "JPMorgan Chase — Institutional Connections",
  "shortTitle": "JPMorgan",
  "summary": "JPMorgan Chase maintained Epstein as a client from the early 1990s until 2013, despite documented internal warnings about his conduct. In 2023 the bank agreed to a $290M settlement with the DOJ and a separate $75M settlement with the U.S. Virgin Islands for compliance failures related to Epstein. A July 2010 email in the Epstein Library references 'Snow White' and was sent by someone identified only as 'Jess' — community researchers have proposed this is a JPMorgan employee, though the identification is unconfirmed.",
  "keyFacts": [
    "JPMorgan maintained Epstein accounts from approximately 1998–2013.",
    "The bank paid $290M to DOJ and $75M to USVI in 2023 settlements.",
    "Internal JPMorgan emails showed compliance officers flagged Epstein as early as 2006.",
    "Jes Staley, former JPMorgan executive, had documented email correspondence with Epstein across hundreds of exchanges.",
    "A July 9, 2010 email in the Epstein Library from a sender identified as 'Jess' references 'Snow White.' Community researchers propose this is a JPMorgan employee (COMMUNITY INFERENCE — unconfirmed)."
  ],
  "verificationStatus": "VERIFIED (institutional record) / PARTIALLY VERIFIED (Snow White email sender identity)",
  "relatedPersonIds": ["jeffrey-epstein", "jess-stolle"],
  "relatedTimelineIds": ["snow-white-email-2010"]
}
```

---

## CLUSTER D — Corcoran Group, Lynn Rothschild, Pamela Leibman & the 9E 71st Street NDA
**Reel ID:** DUrQRjDDUFA · Channel: bubba.bosco

### What Was Claimed

**Note on scope:** This reel contains two distinct categories of claims:
(A) Specific, documentable claims about the Corcoran Group and named figures in the EFTA files
(B) Speculative allegations about a private individual (Erica Kirk) with limited documentary support

This guide implements Category A only. Category B is noted for the record but is explicitly
flagged as community speculation without documentary EFTA grounding.

---

### Category A — Corcoran Group Claims (Documentable)

**Lynn Rothschild and the Corcoran Group:**
The reel states Lynn Rothschild is listed in the Epstein files as "president of the Corcoran
Group." The reel also notes that the actual CEO and president of Corcoran Group since 2000
has been **Pamela Leibman**. This creates an ambiguity: either the Epstein files contain an
error, the "president" designation refers to a different role or period, or the reel's
description is imprecise.

**Pamela Leibman and the 9E 71st Street NDA:**
Leibman is in the EFTA files in connection with an NDA for Epstein's 9E 71st Street townhouse
(the notorious NYC property). The email chain reportedly goes: Leibman → mortgage broker →
then Leibman → redacted name → then redacted name → Jeffrey Epstein. This routing suggests
layered intermediation for an NDA post-Epstein's 2010 prison release.

**Lynn Rothschild's Epstein introductions:**
The reel alleges Lynn Rothschild introduced Epstein to both Prince Andrew and "Alan Dorsevich."
Note: The correct spelling is likely **Alan Dershowitz** (Harvard law professor and Epstein
defense attorney), not "Dorsevich." This is a phonetic transcription artifact from the reel's
audio. Dershowitz is already documented extensively in the Epstein record.

| Claim | Status | Notes |
|-------|--------|-------|
| Lynn Rothschild in EFTA files | ✅ KNOWN | Documented in multiple Epstein file analyses |
| Rothschild as "president of Corcoran Group" in files | ⚠️ NEEDS VERIFICATION | Leibman has been Corcoran CEO since 2000. Check exact EFTA document language. May be a role title error in the original document or reel description. |
| Rothschild introduced Epstein to Prince Andrew | ⚠️ NEEDS VERIFICATION | Widely reported but confirm EFTA source vs. secondary reporting. |
| Rothschild introduced Epstein to Dershowitz | ⚠️ NEEDS VERIFICATION | Dershowitz-Epstein connection is documented; Rothschild as the introducer needs EFTA confirmation. |
| Pamela Leibman in EFTA files | ⚠️ NEEDS VERIFICATION | Specific email chain described — needs Bates number. |
| Leibman ↔ NDA ↔ 9E 71st Street (post-2010) | ⚠️ NEEDS VERIFICATION | Post-conviction NDA routing is significant if confirmed. |

### Phase D-1: New Person Node — Pamela Leibman

```json
{
  "id": "pamela-leibman",
  "name": "Pamela Leibman",
  "category": "Business / Real Estate",
  "status": "UNVERIFIED CONNECTION — Needs Document Cross-Reference",
  "dojMentionCount": 1,
  "summary": "CEO and President of Corcoran Group real estate since 2000. Community researcher bubba.bosco claims Leibman appears in the EFTA files in an email chain regarding a non-disclosure agreement for Epstein's 9E 71st Street Manhattan townhouse, post-2010 prison release. The alleged email routing — Leibman to a mortgage broker, then Leibman to a redacted name, then redacted name to Epstein — suggests layered intermediation for an NDA arrangement. Requires EFTA document confirmation.",
  "role": "Corcoran Group CEO since 2000. Alleged EFTA document participant in post-conviction NDA chain for Epstein's NYC property.",
  "themeIds": ["financial-crimes", "property-network", "new-york-circle"],
  "connections": [
    {
      "personId": "jeffrey-epstein",
      "type": "business",
      "description": "Alleged participation in NDA email chain for 9E 71st Street property, post-2010. UNVERIFIED — Bates number needed.",
      "verificationStatus": "UNVERIFIED"
    },
    {
      "personId": "lynn-forester-de-rothschild",
      "type": "institutional",
      "description": "Both connected to Corcoran Group. Rothschild variously described as having a president/senior role (check for accuracy against actual org chart).",
      "verificationStatus": "NEEDS VERIFICATION"
    }
  ],
  "sources": [
    {
      "type": "COMMUNITY",
      "citation": "Instagram Reel DUrQRjDDUFA — bubba.bosco",
      "verificationStatus": "UNVERIFIED",
      "notes": "Specific email chain described. Search EFTA for: Leibman, Corcoran, 71st Street, NDA. Confirm Bates number."
    }
  ],
  "openResearchQuestions": [
    "Locate EFTA document(s) containing Pamela Leibman. Confirm Bates number and email chain routing.",
    "Confirm post-2010 date of the NDA correspondence (post-conviction significance).",
    "Identify the redacted name(s) in the email chain.",
    "Clarify Lynn Rothschild's described role at Corcoran Group — check EFTA language vs. actual org chart."
  ]
}
```

### Phase D-2: Lynn Rothschild Node Enhancement

Check `src/data/people.json` for an existing Lynn Rothschild / Lynn Forester de Rothschild
node. If it exists, add the following to her connections and themeIds:

```json
{
  "additionalConnections": [
    {
      "personId": "pamela-leibman",
      "type": "institutional",
      "description": "Both connected to Corcoran Group real estate. Leibman is confirmed CEO; Rothschild's specific role designation in EFTA files requires document verification.",
      "verificationStatus": "NEEDS VERIFICATION"
    }
  ],
  "additionalThemeIds": ["property-network"],
  "noteToAdd": "Reel DUrQRjDDUFA (bubba.bosco) claims Rothschild introduced Epstein to both Prince Andrew and Alan Dershowitz. Dershowitz-Epstein connection is independently documented. Rothschild as the specific introducer for both requires EFTA source confirmation."
}
```

### Phase D-3: Timeline Entry — Post-Conviction 9E 71st Street NDA

```json
{
  "id": "71st-street-nda-post-2010",
  "date": "2010-07-01",
  "dateDisplay": "Post-July 2010 (specific date unconfirmed)",
  "era": "Post-Conviction Operation",
  "title": "Alleged Post-Conviction NDA for Epstein's 9E 71st Street Townhouse",
  "summary": "Community researcher bubba.bosco claims EFTA documents show Corcoran Group CEO Pamela Leibman participating in an email chain arranging a non-disclosure agreement for Epstein's notorious 9E 71st Street Manhattan townhouse after his 2010 prison release. The alleged chain routes through a mortgage broker and a redacted intermediary before reaching Epstein. If verified, this would represent post-conviction real estate or financial structuring by a major brokerage firm.",
  "significance": "MEDIUM — post-conviction NDA at primary abuse site would be significant if document confirmed",
  "verificationStatus": "UNVERIFIED — COMMUNITY CLAIM",
  "relatedPersonIds": ["jeffrey-epstein", "pamela-leibman"],
  "relatedThemeIds": ["financial-crimes", "property-network", "post-conviction-operation"],
  "progressiveDisclosure": {
    "level1": "Alleged: Corcoran Group CEO involved in NDA for Epstein's 9E 71st Street townhouse after 2010 release.",
    "level2": "Community researcher claims EFTA email chain shows Pamela Leibman (Corcoran CEO) → mortgage broker → redacted name → Epstein. Timing is post-conviction.",
    "level3": "UNVERIFIED. No Bates number provided. Search EFTA for: Leibman, Corcoran, 71st Street, NDA. Corcoran Group separately connected to Lynn Rothschild in EFTA files. The 9E 71st Street townhouse is the Manhattan property most frequently referenced in victim accounts.",
    "level4Sources": [
      "COMMUNITY: Instagram Reel DUrQRjDDUFA — bubba.bosco (unverified)",
      "PUBLIC RECORD: 9E 71st Street townhouse established as primary Epstein Manhattan property in multiple court documents"
    ]
  }
}
```

### Category B — Erica Kirk Allegations (Community Speculation — Not Implemented)

The reel includes allegations about a private individual (Erica Kirk) connecting her to the
Corcoran Group, Turning Point USA, and speculative claims about involvement in child
trafficking and the death of Charlie Kirk. These allegations:

- Are based largely on timeline coincidences and the creator's own inferences
- Do not cite specific EFTA Bates-stamped documents
- Make extremely serious criminal allegations against a private individual without documentary support
- Involve a peripheral figure whose EFTA connection is mediated entirely through Corcoran Group
  (which is itself unverified at the Leibman level)

**Decision:** Per Verification Wall methodology, this cluster does not meet the threshold
for integration into the site's data layer. It should not be added as a person node.

If future research surfaces an EFTA document directly mentioning Erica Kirk or
corroborating any specific claim from this cluster, the node should be revisited at
that time with the specific document citation as the anchor.

---

## Master Open Research Queue — All Four Clusters

The following are high-priority EFTA search tasks generated by this guide. Add to the
site's "Open Research Threads" section if one exists:

| Priority | Search Query | Target Cluster | Rationale |
|----------|-------------|----------------|-----------|
| HIGH | "Frankel" + "body boxes" in Jmail/EFTA | Cluster A | Specific, verifiable claim with date |
| HIGH | "Snow White" in Epstein Library | Cluster C | Reportedly returns results — confirm Bates |
| HIGH | "Leibman" OR "Corcoran" in EFTA | Cluster D | Confirms or refutes real estate NDA chain |
| MEDIUM | "moot" OR "4chan" OR "Poole" in EFTA | Cluster B | High-impact if confirmed; low prior probability |
| MEDIUM | "Ukraine" + "children" OR "trafficking" in EFTA | Cluster A | Confirm scope of Ukraine references |
| MEDIUM | "Lynn Rothschild" + "Corcoran" in EFTA | Cluster D | Clarify her described role |
| LOW | "Jess Stolle" OR "Stolle" in EFTA full-text | Cluster C | Confirm or deny surname presence in files |

---

## Verification Status Summary — All Clusters

| Item | Status |
|------|--------|
| Pam Bondi declined Epstein multistate investigation (2013) | ✅ VERIFIED (public record) |
| Keith Frankel ↔ Epstein "body boxes" email, Feb 10, 2010 | ✅ VERIFIED — EFTA00764733 confirmed. "Body boxes" = product name. |
| Frankel visited Epstein's house multiple times | ✅ VERIFIED — EFTA02429595 confirms PB visit March 7, 2010. 460+ EFTA mentions. |
| Frankel family Ukraine children's home | ✅ CORROBORATED — Tikva Children's Home, Odessa. EIN 22-3779212. Ed Frankel, chairman. |
| Ukraine trafficking references in EFTA | ⚠️ PARTIALLY VERIFIED — EFTA00214249 (Eastern European victim) confirmed. David Stern/Odessa email source-documented. |
| Epstein ↔ Christopher Poole meeting scheduled | ✅ VERIFIED — EFTA-confirmed via Boris Nikolic introduction (4 EFTA PDFs). Poole met Epstein ~Oct 22–24, 2011. |
| /pol/ launch date = meeting date | ❌ CONTRADICTED — /pol/ launched Oct 23; intro email Oct 20; meeting ~Oct 24. Same week, NOT same day. |
| "Snow White" email, July 9, 2010 in Epstein Library | ⚠️ PARTIALLY VERIFIED (no Bates number) |
| "Jess" = Jess Stolle | ⚠️ COMMUNITY INFERENCE |
| Jess Stolle JPMorgan, 1990–2013 | ⚠️ NEEDS INDEPENDENT VERIFICATION |
| Pamela Leibman in EFTA / 9E 71st NDA chain | ❌ UNVERIFIED |
| Lynn Rothschild ↔ Corcoran Group role in EFTA | ⚠️ ASSERTED (role description needs clarification) |
| Rothschild introduced Epstein to Dershowitz | ⚠️ NEEDS EFTA SOURCE |
| Erica Kirk in EFTA files | ❌ NOT IMPLEMENTED — insufficient documentary basis |

---

*Guide compiled from four Instagram Reels (community investigative analysis).
Verification Wall methodology applied throughout. Clusters vary significantly in
evidentiary quality — HIGH caution on all UNVERIFIED nodes until EFTA cross-reference is completed. Run master open research queue against Jmail.world index before
upgrading any node to VERIFIED status.*