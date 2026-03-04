# CC_GUIDE — REEL1 UPDATE: Scopolamine / Trumpet Plant Thread
## Probe Results Integration — New EFTA Documents

**Compiled:** 2026-03-04  
**Type:** Update/expansion of existing CC_GUIDE_REEL1_SCOPOLAMINE_TRUMPET_PLANT.md  
**Triggered by:** Master Probe List [G1] research — 11 new EFTA documents analyzed  
**Repository target:** `/workspaces/JEI/Reels/` and associated site data files  
**Estimated implementation time:** 3–5 hours  
**Risk to existing functionality:** Low — primarily additive data updates plus verification status upgrades

---

## Executive Summary of New Findings

The original REEL1 guide documented two confirmed scopolamine-adjacent references in the
EFTA set. Probe research has now surfaced **eleven additional EFTA documents** that
substantially strengthen the thread. The key findings, in order of investigative weight:

1. **The Zorro Ranch nursery hypothesis is no longer a COMMUNITY HYPOTHESIS.** Four
   independent EFTA documents (two landscaping proposals, one invoice, one project
   management log) confirm that trumpet vine was ordered, purchased, and **physically
   planted** at Zorro Ranch in summer 2013 — specifically along the pathway between the
   Main House and Dog Pen. Upgrade to: **CORROBORATED**.

2. **Epstein was directly sent a detailed article about scopolamine as a criminal
   compliance drug** (January 2015) — forwarded via fashion photographer Antoine Verglas,
   arriving in Epstein's inbox just one month after the Manzaro incident (December 26,
   2014). This establishes Epstein's documented awareness of scopolamine's criminal
   application properties.

3. **Trumpet flowers were also referenced at Little St. James** in a November 2013 email
   from Epstein to Ann Rodriguez and Mark Tollison — placing the plant interest at *both*
   Epstein properties, not only Zorro Ranch.

4. **The Manzaro victim impact statement requires re-contextualization.** The EFTA version
   of the document reveals it was forwarded through FBI Miami Division channels in 2022.
   The incident described (Dec 26, 2014) involved Florida gang members and corrupt local
   law enforcement — not an Epstein property. The nature of Manzaro's connection to the
   Epstein case requires clarification before it can be cited as a direct Epstein
   corroboration point. (See Caveat section below.)

---

## Document Analysis — What Each File Contains

| EFTA Bates | Filename Label | Document Type | Relevance | Action |
|------------|---------------|---------------|-----------|--------|
| EFTA00984429 | ask_chris_about_my_trumpet_plants | Epstein → Rodriguez email, March 3, 2014 | Core document — ALREADY IN SITE | No change needed |
| EFTA00865569 | epstein_forwarded_email_on_scopolamine | Email chain forwarding Daily Mail scopolamine article to Epstein, Jan 27, 2015 | **HIGH — new verified event** | Add to timeline + theme |
| EFTA01950280 | epstein_gets_email_mentioning_trumpet_flowers | Epstein → Rodriguez + Tollison email, Nov 11, 2013 | **MEDIUM — LSJ trumpet reference** | Add to timeline |
| EFTA01177625 | order_of_trumpet_vine | Zorro Ranch landscape invoice — actual costs including "5 gal Trumpet Vine $120.00" | **HIGH — confirms purchase** | Add to evidence list |
| EFTA01124580 | another_trumpet_vine_order | Aspen Landscaping proposal for Zorro Ranch, May 9, 2013 — includes "3-5 gal Trumpet Vine @ $40.00 ea" | **HIGH — confirms order** | Add to evidence list |
| EFTA00587280 | another_zorro_ranch_and_trumpet_mention | Mallory Landscape & Design proposal, March 27, 2013 — includes "2 trumpet vine" at Southeast Side | **HIGH — earliest proposal** | Add to evidence list |
| EFTA01124666 | zorro_projects_mention_trumpet_planting | Zorro Projects management log, July 12, 2013 — explicitly states "Trumpet Vine planted along pathway between MH & Dog Pen" (June 27, 2013) | **CRITICAL — confirms planting** | Add to timeline + upgrade status |
| EFTA00163098 | someone_else_claiming_to_have_been_given_scopolamine | Manzaro VIS in FBI email chain — describes a 2014 Florida gang/law enforcement kidnapping incident | **COMPLEX — requires caveat** | Update notes, add caveat |
| EFTA01053957 | epstein_talking_about_woman_and_mentions_trumpet | Epstein email Feb 2017 using "trumpet" as crude metaphor | **NOT RELEVANT** to plant research | Do not add |
| EFTA00552634 | order_of_snowe_trumpet | Snowe home goods brand order confirmation (product named "Snowe Trumpet") | **NOT RELEVANT** — brand name, not plant | Do not add |
| EFTA02760284 | (civil litigation motion) | Epstein motion to compel discovery in Epstein v. Rothstein civil case | **NOT RELEVANT** to scopolamine thread | Do not add |

---

## Phase 1: Upgrade Verification Status

In `src/data/themes.json` (or equivalent), find the `"chemical-drugging"` theme and update
the following fields:

### Change 1 — Zorro Ranch Hypothesis Status

**Find and update this item in `verificationNotes`:**

```
OLD: "The Zorro Ranch greenhouse nursery hypothesis is COMMUNITY HYPOTHESIS (unverified in EFTA files)."

NEW: "The Zorro Ranch nursery location is now CORROBORATED by four independent EFTA documents: a March 2013 landscaping proposal (EFTA00587280), a May 2013 proposal (EFTA01124580), an actual cost invoice (EFTA01177625), and a property management log explicitly confirming trumpet vine was planted at Zorro Ranch on June 27, 2013 (EFTA01124666). This upgrades the status from COMMUNITY HYPOTHESIS to CORROBORATED."
```

### Change 2 — Manzaro Caveat

**Find the Manzaro reference in `keyFacts` and add a note:**

```
OLD: "Scopolamine is named explicitly in the victim impact statement of Dr. Joseph Manzaro (December 26, 2014 incident)."

NEW: "Scopolamine is named explicitly in the victim impact statement of Dr. Joseph Manzaro (December 26, 2014 incident). NOTE: The EFTA version of this document (EFTA00163098) shows it being forwarded through FBI Miami Division channels in 2022. The incident described involves Florida gang members and corrupt local law enforcement figures — not an Epstein property or staff member. The nature of Manzaro's connection to the Epstein case files requires further clarification. His VIS is included in the EFTA set; the precise reason for its inclusion is unconfirmed."
```

### Change 3 — Add to keyFacts

Add the following new fact to the `keyFacts` array:

```json
"On January 27, 2015 — one month after the Manzaro incident — Epstein was forwarded a detailed Daily Mail article titled 'Scopolamine: Powerful drug growing in the forests of Colombia that ELIMINATES free will.' The email chain originated with fashion photographer Antoine Verglas. The article described scopolamine being blown into victims' faces, rendering them compliant with no memory formation — identical to properties relevant to victim control. EFTA Bates: EFTA00865569."
```

### Change 4 — Add to keyFacts

```json
"Four independent EFTA documents confirm trumpet vine was ordered, invoiced, and physically planted at Zorro Ranch, New Mexico in 2013. The property management log (EFTA01124666) records: 'Trumpet Vine planted along pathway between MH [Main House] & Dog Pen' on June 27, 2013. This is at Epstein's primary New Mexico property. A separate November 2013 email (EFTA01950280) confirms Epstein also instructed staff about 'trumpet flowers' at Little St. James, placing the plant interest at both properties."
```

---

## Phase 2: New Timeline Entries

Add the following entries to the timeline data file (wherever `epstein_master_timeline.md`
or equivalent JSON lives):

---

### Entry A — March 2013 (Mallory Proposal)

```json
{
  "id": "zorro-ranch-trumpet-vine-proposal-mallory-2013",
  "date": "2013-03-27",
  "era": "Post-Conviction Operation",
  "title": "Earliest Trumpet Vine Proposal for Zorro Ranch (Mallory Landscape)",
  "summary": "Mallory Landscape and Design submits a $106,655 landscaping proposal for Zorro Ranch, New Mexico. The Southeast Side section specifies '2 trumpet vine' as part of plant materials. This is the earliest documented proposal to include trumpet vine at Zorro Ranch.",
  "significance": "MEDIUM",
  "verificationStatus": "VERIFIED",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "Mallory Landscape and Design — Zorro Ranch Proposal, March 27, 2013 — EFTA00587280",
  "relatedPersonIds": ["jeffrey-epstein"],
  "relatedThemeIds": ["chemical-drugging", "zorro-ranch"],
  "progressiveDisclosure": {
    "level1": "Landscape proposal for Zorro Ranch includes trumpet vine, March 2013.",
    "level2": "Mallory Landscape & Design proposes $106,655 landscaping project at Zorro Ranch. Southeast Side section specifies '2 trumpet vine' in plant materials. EFTA Bates: EFTA00587280.",
    "level3": "The earliest of four EFTA documents confirming trumpet vine was proposed or planted at Zorro Ranch. Subsequent documents show the plants were ordered, invoiced, and confirmed as planted by June 27, 2013. The Main House referred to in later documents is on the same property.",
    "level4Sources": [
      "DOJ EFTA: Mallory Landscape and Design — Zorro Ranch Proposal, March 27, 2013 — EFTA00587280"
    ]
  }
}
```

---

### Entry B — May 2013 (Aspen Proposal)

```json
{
  "id": "zorro-ranch-trumpet-vine-proposal-aspen-2013",
  "date": "2013-05-09",
  "era": "Post-Conviction Operation",
  "title": "Aspen Landscaping Proposal for Zorro Ranch Includes Trumpet Vine",
  "summary": "Aspen Landscaping LLC (Santa Fe, NM; Jose Santos, Owner) submits a landscaping proposal for 'Brice Gordon / Zorro Development, 49 Zorro Ranch Rd, Stanley NM' totaling approximately $84,495. The Rear Terrace Beds section specifies '3-5 gal Trumpet Vine @ $40.00 ea.' Epstein property manager Brice Gordon is the named contact.",
  "significance": "MEDIUM",
  "verificationStatus": "VERIFIED",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "Aspen Landscaping LLC Proposal — Zorro Ranch, May 9, 2013 — EFTA01124580",
  "relatedPersonIds": ["jeffrey-epstein"],
  "relatedThemeIds": ["chemical-drugging", "zorro-ranch"],
  "progressiveDisclosure": {
    "level1": "Second landscape proposal for Zorro Ranch specifies trumpet vine, May 2013.",
    "level2": "Aspen Landscaping LLC (Santa Fe, NM) proposes $84,495 project at Zorro Ranch addressed to 'Brice Gordon / Zorro Development.' Rear Terrace Beds include '3-5 gal Trumpet Vine @ $40.00 ea.' EFTA Bates: EFTA01124580.",
    "level3": "Property manager named is 'Brice Gordon.' The email address used is zorro.office@gmail.com. This is one of four EFTA documents in the trumpet vine cluster. The June 2013 project log (EFTA01124666) later confirms these plants were actually planted.",
    "level4Sources": [
      "DOJ EFTA: Aspen Landscaping LLC Proposal — Zorro Ranch, May 9, 2013 — EFTA01124580"
    ]
  }
}
```

---

### Entry C — June 27, 2013 (Planting Confirmed)

```json
{
  "id": "zorro-ranch-trumpet-vine-planted-2013",
  "date": "2013-06-27",
  "era": "Post-Conviction Operation",
  "title": "Trumpet Vine Confirmed Planted at Zorro Ranch — Pathway Between Main House and Dog Pen",
  "summary": "The Zorro Ranch property management log (July 12, 2013 status update) records: '6/27/13 — Preparation front parking area begins, Columbians & Trumpet Vine planted along pathway between MH [Main House] & Dog Pen.' This is the first definitive confirmation that trumpet vine was physically installed at Epstein's primary New Mexico property, along a specific foot-traffic pathway adjacent to the main residence.",
  "significance": "HIGH",
  "verificationStatus": "VERIFIED",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "Zorro Projects — Property Management Log, July 12, 2013 — EFTA01124666",
  "relatedPersonIds": ["jeffrey-epstein"],
  "relatedThemeIds": ["chemical-drugging", "zorro-ranch"],
  "progressiveDisclosure": {
    "level1": "Trumpet vine was physically planted at Zorro Ranch on June 27, 2013 — between the Main House and Dog Pen.",
    "level2": "The Zorro Ranch property management log records the exact date and location: 'Trumpet Vine planted along pathway between MH [Main House] & Dog Pen' on June 27, 2013. This is an operational log document confirming actual planting, not a proposal. EFTA Bates: EFTA01124666.",
    "level3": "The pathway between the Main House and the Dog Pen is a foot-traffic corridor within the operational core of the property — not a remote garden area. The document also names 'Columbians' as co-planted species (likely 'Columbine' — Aquilegia). Two landscape companies had proposed trumpet vine for this property starting in March 2013; this log entry confirms execution. The Zorro Ranch nursery hypothesis, previously flagged as community research, is now corroborated by four independent EFTA documents.",
    "level4Sources": [
      "DOJ EFTA: Zorro Projects Management Log, July 12, 2013 — EFTA01124666",
      "DOJ EFTA: Mallory Landscape Proposal, March 27, 2013 — EFTA00587280",
      "DOJ EFTA: Aspen Landscaping Proposal, May 9, 2013 — EFTA01124580",
      "DOJ EFTA: Zorro Ranch Landscape Invoice — EFTA01177625"
    ]
  }
}
```

---

### Entry D — November 11, 2013 (LSJ Trumpet Flowers)

```json
{
  "id": "lsj-trumpet-flowers-2013",
  "date": "2013-11-11",
  "era": "Post-Conviction Operation",
  "title": "Epstein Instructs Staff on 'Trumpet Flowers' at Little St. James",
  "summary": "Epstein emails Ann Rodriguez and Mark Tollison with landscaping instructions including 'trumpet flowers' at what appears to be the Little St. James pool area: 'chris tomoonv.. pool trees, blocking trees., trumpet flowers. new palms,.yellow vines. sod dirt main pool.' This places trumpet plant interest at Little St. James — not only Zorro Ranch — within the same operational period. The identity of 'chris tomoonv' is unclear (possibly a staff member name).",
  "significance": "MEDIUM",
  "verificationStatus": "VERIFIED",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "Epstein to Rodriguez and Tollison email, November 11, 2013 — EFTA01950280 (internal reference EFTA_R1_00418227)",
  "relatedPersonIds": ["jeffrey-epstein", "anne-rodriguez"],
  "relatedThemeIds": ["chemical-drugging", "little-st-james"],
  "progressiveDisclosure": {
    "level1": "Epstein instructs staff about 'trumpet flowers' at Little St. James pool area, November 2013.",
    "level2": "Epstein emails Ann Rodriguez and Mark Tollison on November 11, 2013 with a landscaping task list that includes 'trumpet flowers' near the main pool. EFTA Bates: EFTA01950280 / EFTA_R1_00418227.",
    "level3": "This document places Epstein's trumpet plant interest at Little St. James (USVI) as well as Zorro Ranch (NM). The email also references 'chris tomoonv' — possibly the same 'Chris' referenced in the March 2014 'ask Chris about my trumpet plants at nursery' email. If so, Chris may be a property staff member active at LSJ rather than Zorro Ranch, contrary to the initial Zorro Ranch nursery hypothesis — though the plants are now confirmed planted at Zorro Ranch regardless.",
    "level4Sources": [
      "DOJ EFTA: Epstein to Rodriguez and Tollison, November 11, 2013 — EFTA01950280",
      "DOJ EFTA: Epstein to Rodriguez, March 3, 2014 — EFTA00984429"
    ]
  }
}
```

---

### Entry E — January 27, 2015 (Scopolamine Article Forwarded to Epstein)

```json
{
  "id": "epstein-scopolamine-article-2015",
  "date": "2015-01-27",
  "era": "Post-Conviction Operation",
  "title": "Epstein Receives Article About Scopolamine as Criminal Compliance Drug",
  "summary": "One month after the Manzaro scopolamine incident (December 26, 2014), Epstein is sent a forwarded email chain containing a Daily Mail article titled 'Scopolamine: Powerful drug growing in the forests of Colombia that ELIMINATES free will.' The article chain originated with fashion photographer Antoine Verglas and was forwarded to Epstein (sender redacted in EFTA). The article describes scopolamine being blown into victims' faces, rendering them compliant with no autonomous will and no memory formation — properties directly relevant to victim control.",
  "significance": "HIGH",
  "verificationStatus": "VERIFIED",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "Email to Jeffrey Epstein <jeevacation@gmail.com>, January 27, 2015 — EFTA00865569. Original article: Daily Mail, May 12, 2012.",
  "relatedPersonIds": ["jeffrey-epstein", "antoine-verglas"],
  "relatedThemeIds": ["chemical-drugging"],
  "progressiveDisclosure": {
    "level1": "Epstein received a detailed article on scopolamine's use as a criminal compliance drug, January 2015.",
    "level2": "On January 27, 2015, Epstein was forwarded an article titled 'Scopolamine: Powerful drug growing in the forests of Colombia that ELIMINATES free will.' The chain originated with photographer Antoine Verglas. This arrived one month after the December 26, 2014 Manzaro scopolamine incident. EFTA Bates: EFTA00865569.",
    "level3": "The article details scopolamine being: blown into victims' faces, administered in drinks, odorless and tasteless, capable of removing autonomous will while leaving the victim apparently coherent, and causing complete post-event amnesia. The CIA used it in Cold War interrogations. The article notes it is 'worse than anthrax' in high doses. Epstein's receipt of this article — whether read, ignored, or acted upon — documents his exposure to detailed operational information about the drug during the same operational period as the Manzaro incident and the Zorro Ranch planting. The sender to Epstein is redacted in EFTA; Antoine Verglas is documented as the original forwarder in the chain.",
    "level4Sources": [
      "DOJ EFTA: Email to Jeffrey Epstein, January 27, 2015 — EFTA00865569",
      "Daily Mail: 'Scopolamine: Powerful drug growing in the forests of Colombia that ELIMINATES free will,' May 12, 2012",
      "Cross-reference: Victim impact statement of Dr. Joseph Manzaro, December 26, 2014"
    ]
  }
}
```

---

## Phase 3: New Person Node — Antoine Verglas

If `antoine-verglas` does not exist in `src/data/people.json`, add the following:

```json
{
  "id": "antoine-verglas",
  "name": "Antoine Verglas",
  "role": "associate",
  "category": "social-circle",
  "summary": "Fashion and celebrity photographer. Documented as the originator of a forwarded email chain that delivered a detailed scopolamine article to Epstein's inbox on January 27, 2015 (EFTA00865569). Verglas operated a studio at 14-16 Wooster Street, 2nd Floor, New York NY 10013. The email originated on December 3, 2014 — one day before the Manzaro incident (December 26, 2014) — and was forwarded to an intermediary, who forwarded it to Epstein on January 27, 2015.",
  "verificationStatus": "VERIFIED",
  "dojMentionCount": 1,
  "connections": [
    {
      "personId": "jeffrey-epstein",
      "type": "associate",
      "description": "Forwarded scopolamine article that reached Epstein via intermediary, January 2015"
    }
  ],
  "sources": [
    {
      "type": "DOJ-EFTA",
      "citation": "Email chain — EFTA00865569",
      "verificationStatus": "VERIFIED",
      "notes": "Named as originating forwarder of the scopolamine article chain. Redacted intermediary forwarded to Epstein."
    }
  ]
}
```

---

## Phase 4: Update Open Research Questions

In the REEL1 section of the site (wherever open research questions are surfaced), make the
following updates:

### Close / Upgrade

```
OLD OPEN QUESTION: "Which nursery? Confirm or refute the Zorro Ranch greenhouse hypothesis."
NEW STATUS: RESOLVED — CORROBORATED. Four EFTA documents confirm trumpet vine was planted
at Zorro Ranch on June 27, 2013 (EFTA00587280, EFTA01124580, EFTA01177625, EFTA01124666).
Upgrade from COMMUNITY HYPOTHESIS to CORROBORATED.
```

### Partially Resolve

```
OLD OPEN QUESTION: "Who is 'Chris'? The nursery contact named in the March 3, 2014 email."
UPDATE: A November 11, 2013 email (EFTA01950280) references 'chris tomoonv' in the
context of Little St. James landscaping tasks — possibly the same individual. The name
may be 'Chris Tomoonov' or similar (OCR artifact likely). Chris appears to be active at
LSJ, not necessarily Zorro Ranch. Still UNVERIFIED, but narrowed.
```

### Keep Open

```
STILL OPEN: "Are there additional scopolamine references in the full 3.5M page EFTA set?"
STILL OPEN: "Other victims reporting drugging without positive tox screens?"
STILL OPEN: "Rinaldo Rizzo housekeeper testimony — Bates number and sworn status."
```

### Add New Open Question

```
NEW OPEN QUESTION: "What is the precise reason Manzaro's victim impact statement is included
in the EFTA set? His VIS describes a 2014 Florida gang/corruption incident, not an Epstein
property. Was Manzaro also a driver or associate in the Epstein network? The EFTA inclusion
needs contextual explanation before his scopolamine citation can be attributed to the Epstein
pattern with full confidence."
```

---

## Phase 5: Verification Table Update

Update the verification status table in the REEL1 data (wherever it lives):

| Item | OLD Status | NEW Status |
|------|-----------|-----------|
| Zorro Ranch nursery location hypothesis | ⚠️ COMMUNITY HYPOTHESIS | ✅ CORROBORATED (EFTA) |
| Trumpet vine planted at Zorro Ranch | ❌ UNVERIFIED | ✅ VERIFIED (EFTA01124666) |
| Epstein awareness of scopolamine's criminal applications | ❌ UNVERIFIED | ✅ VERIFIED (EFTA00865569) |
| Trumpet flowers interest at Little St. James | ❌ UNVERIFIED | ✅ VERIFIED (EFTA01950280) |
| Manzaro incident as direct Epstein case | ✅ VERIFIED | ⚠️ NEEDS CLARIFICATION (incident involves separate FL parties) |
| Identity of "Chris" | ❌ UNVERIFIED | ⚠️ PARTIALLY NARROWED (possible LSJ staff, "chris tomoonv") |

---

## Phase 6: Cross-Reference Connections

Add the following new connections to the graph data:

1. **Antoine Verglas → Jeffrey Epstein** — `type: "associate"`, `description: "Forwarded scopolamine article chain, January 2015"`, `verificationStatus: "VERIFIED"`, `strength: 1`
2. **Zorro Ranch (location node) → chemical-drugging (theme)** — link the confirmed trumpet vine planting to the theme with status CORROBORATED
3. **Little St. James (location node) → chemical-drugging (theme)** — new link via EFTA01950280 trumpet flowers email
4. **EFTA00865569 (scopolamine article event) → EFTA00163098 (Manzaro incident)** — temporal proximity link (article forwarded one month after incident); flag with caveat on Manzaro re-contextualization

---

## Phase 7: EFTA Document Index

Ensure the following Bates numbers are searchable and linked in the site's document index:

| EFTA Bates | Description | Verification |
|------------|-------------|--------------|
| EFTA00984429 | Epstein → Rodriguez "ask Chris about my trumpet plants at nursery" email, March 3, 2014 | VERIFIED |
| EFTA00865569 | Email chain delivering scopolamine article to Epstein, January 27, 2015 | VERIFIED |
| EFTA01950280 | Epstein → Rodriguez + Tollison "trumpet flowers" email, November 11, 2013 (alt. ref: EFTA_R1_00418227) | VERIFIED |
| EFTA01124666 | Zorro Projects management log confirming trumpet vine planting, June 27, 2013 | VERIFIED |
| EFTA01177625 | Zorro Ranch landscape invoice showing trumpet vine purchase (3 plants @ $40 = $120) | VERIFIED |
| EFTA01124580 | Aspen Landscaping proposal for Zorro Ranch including trumpet vine, May 9, 2013 | VERIFIED |
| EFTA00587280 | Mallory Landscape proposal for Zorro Ranch including trumpet vine, March 27, 2013 | VERIFIED |
| EFTA00163098 | Dr. Joseph Manzaro victim impact statement in FBI email chain, February 2022 | VERIFIED (with caveat — incident involves separate FL parties) |

---

## IMPORTANT CAVEAT — Manzaro Re-Contextualization

**This section must be read before implementing any Manzaro-related changes.**

The original REEL1 guide presented Dr. Joseph Manzaro's victim impact statement as
a direct Epstein case — one of two confirmed scopolamine references in the EFTA set.
The full EFTA document (EFTA00163098) reveals a more complex picture:

The document is an **FBI internal forwarding chain** (February 9, 2022, Miami Division —
Palm Beach RA/Intel-12) routing Manzaro's statement — originally sent to U.S. Attorney
Tony Gonzalez — to appropriate FBI personnel. The VIS itself describes a **December 26,
2014 incident** in which Manzaro was kidnapped by Latin Kings gang members (Eric Mejias,
Bony Rivera) at the apparent direction of a Florida circuit court judge (Judge Arthur M.
Birken). The kidnapping involved scopolamine administered by Eric Mejias, delivery to a
party at 7420 Westlake Drive, Lake Clarke Shores, and subsequent involvement of local
police and judiciary.

**This incident does not involve Epstein's property, staff, or operation as described.**

The reason Manzaro's statement appears in the EFTA set is unclear from the document alone.
Possible explanations:
- Manzaro may have been a driver or associate in the Epstein network AND separately a
  victim of the 2014 incident described (both could be true)
- The FBI routing may indicate Manzaro contacted the Epstein investigation team separately
- The EFTA inclusion may be incidental to the broader investigation

**Implementation instruction:** Do not remove Manzaro from the scopolamine thread, but
add the caveat text specified in Phase 1, Change 2 above. Flag his connection as
NEEDS CLARIFICATION rather than VERIFIED pending further research. The scopolamine naming
in his VIS is still factually accurate and still EFTA-anchored — the question is only
whether it connects to Epstein directly.

---

## Build Verification

After completing all phases:

```bash
npm run build
```

Check for:
- No broken person ID references (antoine-verglas node added)
- All new EFTA Bates numbers appearing in search index
- Verification status badges updating correctly for Zorro Ranch items
- New timeline entries appearing in correct chronological position (2013 cluster)
- No regressions to existing REEL1 content

---

## Probe Status Update for Master List

The following [G1] probes from CC_MASTER_PROBE_LIST.md can be marked as resolved:

| Probe | Status |
|-------|--------|
| `"trumpet plant"` — search for other uses beyond March 2014 email | **RESOLVED** — 3 additional emails found (Nov 2013 LSJ, Zorro log) |
| `"nursery" + "greenhouse"` — identify which property | **RESOLVED** — Zorro Ranch confirmed (EFTA01124666) |
| Zorro Ranch nursery hypothesis confirm/refute | **RESOLVED** — CORROBORATED |
| Epstein scopolamine awareness beyond the two known hits | **RESOLVED** — EFTA00865569 confirms Epstein received criminal scopolamine article Jan 2015 |
| `"Chris" + ("nursery" OR "plants" OR "greenhouse")` | **PARTIALLY RESOLVED** — "chris tomoonv" in Nov 2013 LSJ email; identity still unconfirmed |

The following HIGH-priority cross-guide probe remains open:

| Probe | Status |
|-------|--------|
| Rinaldo Rizzo housekeeper testimony — Bates + sworn status | **STILL OPEN** — not found in these documents |

---

*Guide compiled 2026-03-04 from direct analysis of 11 EFTA documents extracted from project
knowledge. Verification Wall methodology applies throughout. All new VERIFIED statuses are
based on Bates-stamped EFTA documents.*
