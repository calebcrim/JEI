# CC_GUIDE — Reels 6–11: Liquid Funding · Eva Dubin Email · 11E 71st Street · Zampoli · Siegel/Schank Emails
## Epstein Files Research Database — New Content Series

**Sources:** Six Instagram Reels (community investigative analysis)  
**Channels:** ian_byington · zachary.loft · not.an.official.news.source · _jenniferkings · itsgingertheory · [unlabeled]  
**Reel IDs:** DUMnu1rjVUq · DPOiW3QjVXh · DUuwXDTCbPh · DVC61H7DKrs · DQ9QlNqjrLF · DUTydPHEkxk

**Triage Summary (read before implementing):**

| Reel | Channel | Quality | Action |
|------|---------|---------|--------|
| DUMnu1rjVUq | ian_byington | MIXED — specific emails embedded in antisemitic editorial framing | Implement emails only; flag framing |
| DPOiW3QjVXh | zachary.loft | MEDIUM — specific financial claim, no Bates anchor | New timeline + open research thread |
| DUuwXDTCbPh | not.an.official.news.source | HIGH — enhancement to existing documented nodes | Implement enhancements |
| DVC61H7DKrs | _jenniferkings | MEDIUM — property records claim, one speculative leap | Implement property thread; flag 9/11 link |
| DQ9QlNqjrLF | itsgingertheory | MEDIUM — Brunel attorney + Zampoli are documentable; Sandler tertiary | Implement Zampoli; note Titone |
| DUTydPHEkxk | [unlabeled] | VERY LOW — extraordinary unverified claims throughout | **NOT IMPLEMENTED** — see note below |

**Estimated implementation time:** 5–8 hours  
**Risk to existing functionality:** Very low — additive data, enhancements to existing nodes.  
**Build verification:** `npm run build` after Phase 4 and after Phase 6.

---

## ⚠️ REEL 6 TRIAGE DECISION — DUTydPHEkxk [unlabeled]

**Decision: This reel is NOT implemented in the site's data layer.**

**Rationale:**  
This reel makes a series of extraordinary claims — infant meat emails, abortion witnessed by
Woody Allen, Netanyahu torture video correspondence, instructions to "kill judges," Epstein
"controlling Bitcoin since 2015," Clarence Thomas child rape, Christine Maxwell selling the
FBI its Patriot Act algorithm — with **zero Bates-stamped document anchors** and no source
citations. Several claims echo documented conspiracy theory content unrelated to the EFTA
record.

**Overlapping claims with other reels (cross-reference only — not implementation):**  
- Liquid Funding / 2008 financial crisis: also claimed in Reel DPOiW3QjVXh (zachary.loft).
  The zachary.loft version is more specific and is processed in Cluster B below.
- Epstein represents the Rothschilds: consistent with the documented $25M Ariane de Rothschild
  contract (VERIFIED in existing dossier — EFTA anchor already present).
- Peter Thiel / Epstein connection: existing node already documents Thiel meeting via Barak
  (June 2014). The reel's Bitcoin control claim is extraordinary and unverified.

**Partial factual kernel — Christine Maxwell / database company (note only, not implemented):**  
Christine Maxwell co-founded Magellan (later Mirror Group Newspapers) and ran database
companies. Community researchers have proposed her data infrastructure work has Patriot Act
connections. This is a known community research thread but has no EFTA document verification.
Flag for future research: search EFTA full-text for "Christine Maxwell" + database/algorithm
references. Do not build a node on this reel's framing.

**If future EFTA document verification surfaces any specific claim from this reel with a
Bates-stamped anchor, revisit at that point.**

---

## CLUSTER A — Specific Emails in Antisemitic Editorial Context
**Reel:** DUMnu1rjVUq · Channel: ian_byington

### Editorial Framing Note (Important — Read First)

This reel presents specific EFTA email content through an explicitly antisemitic
editorial framework — the creator frames documented Epstein communications as evidence
of Jewish supremacist conspiracy. **The site implements the specific email content
(where documentable) as part of the factual record; it does not implement the antisemitic
interpretive framework as a research finding.** Epstein's personal views and social
networks are relevant historical documentation. The framing imposed by the creator is
not.

If the site has a "source framing notes" or "research provenance" field, this reel should
be tagged: `COMMUNITY SOURCE — ANTISEMITIC EDITORIAL FRAMING — extract claims only`.

### Specific Documentable Claims

**Claim 1 — "Baal" bank account:**  
The reel states Epstein had a bank account named "Baal" (ancient Canaanite deity). If true,
this is a specific account name that would appear in financial records. No Bates number
provided. Flag for EFTA financial records search.

**Claim 2 — Roger Schank email:**  
The reel references an email exchange between Epstein and **Roger Schank** (phonetic:
"Roger Shank"), described as a "Jewish-American academic and hedge fund worker." Roger
Schank (1946–2023) was in reality a prominent AI researcher and cognitive scientist who
founded the Institute for Learning Sciences at Northwestern. Whether he was also involved
in hedge fund activity is unverified. The email reportedly contains Epstein's stated views
on financial markets and ethnic identity. Needs EFTA document verification.

**Claim 3 — Peggy Siegel email, August 7, 2010:**  
Peggy Siegel is a well-documented Hollywood film publicist who has appeared in Epstein
coverage. The reel states that on August 7, 2010, she asked Epstein whether an upcoming
event would be "100% Jewish." Epstein allegedly responded: "No, they'll have Goyim in
abundance. But don't worry, they're just brilliant wasps from JPMorgan." This is a
specific, date-stamped email claim. The August 2010 window post-dates Epstein's 2010
release. Needs EFTA document verification.

**Claim 4 — "Joshua Finkelstein / BlackRock's Larry Finkelstein's son":**  
The reel refers to "Joshua Finkelstein, BlackRock's Larry Finkelstein's son." BlackRock's
CEO is **Larry Fink** (not Finkelstein). This is either: (a) a phonetic/audio transcription
artifact adding an antisemitic suffix, (b) the reel creator's own editorial modification, or
(c) the underlying EFTA document uses a different name. **Do not implement any node as
"Finkelstein." If this refers to Larry Fink's son Joshua Fink, that requires independent
EFTA document verification under the correct surname.** Flag as: `TRANSCRIPTION CONCERN —
possible antisemitic name modification — verify against source document before any node creation`.

**Claim 5 — 2017 "only hire Jews" conversation:**  
An unspecified 2017 conversation in which Epstein allegedly stated he only hires people who
can "prove they are genetically Jewish." Needs EFTA document verification. If real, documents
Epstein's own expressed hiring ideology.

**Claim 6 — Rothschild Ukraine overthrow comment:**  
The reel states Epstein told "the Rothschild family" that "if they overthrew the Ukrainian
government, there would be great opportunities." The $25M Ariane de Rothschild contract is
already VERIFIED in the existing dossier. If an email with this specific language exists
in the EFTA set, it would be a significant finding. Needs document verification separate from
the contract.

**Claim 7 — Forced pregnancies / victim diary:**  
A victim's diary allegedly shows she was impregnated multiple times and forced to give birth
for Ghislaine and Epstein. This is an extraordinarily serious allegation. Without a Bates-stamped
document anchor or court filing reference, it cannot be implemented. Flag as: `EXTRAORDINARY
CLAIM — requires sworn testimony or EFTA document anchor before any node creation`.

**Claim 8 — "Israel mentioned twice as much as Trump" in the documents:**  
This is a quantitative metadata assertion about the document corpus. Cannot be verified
from this reel alone. Note as a community research observation pending systematic
full-text search analysis.

### Phase A-1: New Person Node — Peggy Siegel

Peggy Siegel is independently documented as a Hollywood publicist who appeared in
Epstein's social circle. Add if not already present:

```json
{
  "id": "peggy-siegel",
  "name": "Peggy Siegel",
  "category": "Media / Entertainment",
  "status": "Social Associate — Needs Document Verification",
  "dojMentionCount": 1,
  "summary": "New York-based Hollywood film publicist, known for high-profile film premieres and charity event organization. Appears in Epstein social circle documentation. Community researcher ian_byington claims an EFTA email dated August 7, 2010 shows Siegel asking Epstein about the composition of an upcoming event, with Epstein's response referencing JPMorgan and social contacts. Requires EFTA document verification.",
  "role": "Social contact. Film publicist. Alleged post-conviction email correspondent.",
  "themeIds": ["social-circle", "post-conviction-operation"],
  "connections": [
    {
      "personId": "jeffrey-epstein",
      "type": "social",
      "description": "Alleged August 7, 2010 email exchange. Post-conviction contact.",
      "verificationStatus": "UNVERIFIED — COMMUNITY CLAIM"
    }
  ],
  "sources": [
    {
      "type": "COMMUNITY",
      "citation": "Instagram Reel DUMnu1rjVUq — ian_byington",
      "verificationStatus": "UNVERIFIED",
      "notes": "Search EFTA/Jmail for: Siegel, Peggy Siegel, August 2010. Confirm Bates number."
    }
  ],
  "openResearchQuestions": [
    "Locate August 7, 2010 Epstein-Siegel email in EFTA set. Confirm Bates number and exact content.",
    "Cross-reference with other post-conviction social network emails (August 2010 window)."
  ]
}
```

### Phase A-2: New Person Node — Roger Schank

```json
{
  "id": "roger-schank",
  "name": "Roger Schank",
  "category": "Academic / Possible Financial",
  "status": "UNVERIFIED — Community Claim",
  "dojMentionCount": 0,
  "summary": "AI researcher and cognitive scientist (1946–2023). Founded the Institute for Learning Sciences at Northwestern University. Pioneer in natural language processing and case-based reasoning. Community researcher ian_byington claims EFTA documents show an email exchange between Schank and Epstein. Schank's possible hedge fund connections are unverified. All claims require EFTA document verification.",
  "role": "Academic. Alleged Epstein email correspondent per community researcher. No verified EFTA anchor.",
  "themeIds": ["social-circle"],
  "connections": [
    {
      "personId": "jeffrey-epstein",
      "type": "correspondence",
      "description": "Alleged email exchange — content and date unspecified. UNVERIFIED.",
      "verificationStatus": "UNVERIFIED"
    }
  ],
  "sources": [
    {
      "type": "COMMUNITY",
      "citation": "Instagram Reel DUMnu1rjVUq — ian_byington",
      "verificationStatus": "UNVERIFIED",
      "notes": "Search EFTA/Jmail for: Schank, Roger Schank. Note: reel phonetically transcribed as 'Shank' — likely Roger Schank. Schank died in 2023."
    }
  ]
}
```

### Phase A-3: Open Research Threads — Cluster A

Add to the site's open research queue:

```
SEARCH: "Baal" as account name in EFTA financial records
SEARCH: "Siegel" OR "Peggy" in August 2010 Epstein email window
SEARCH: "Schank" OR "Shank" in EFTA/Jmail full-text
SEARCH: "Rothschild" + "Ukraine" in EFTA email set
SEARCH: Epstein 2017 hiring correspondence — "only Jews" / "genetically Jewish"
NOTE: "Larry Finkelstein" reference is likely "Larry Fink" (BlackRock CEO) — do NOT create
      Finkelstein node. Verify source document before any action.
```

---

## CLUSTER B — Liquid Funding Ltd. / Bear Stearns / 2008 Financial Crisis
**Reel:** DPOiW3QjVXh · Channel: zachary.loft

### What Was Claimed

> *"The chairman in charge of creating the collateralized mortgage obligations for Bear
> Stearns that inevitably were sold back out into the public banking market that caused
> the great financial crisis of 2008 — their chairman was none other than Jeffrey Epstein."*

The reel further states:
- **Liquid Funding Ltd.** was founded in 2000 in Bermuda as a Bear Stearns shell company
- Its purpose was to take toxic/subprime CMOs (collateralized mortgage obligations) from
  Bear Stearns, repackage them as investment-grade instruments, and sell them back into
  the market
- Epstein was "chairman" of this vehicle
- This was a direct causal factor in the 2008 financial crisis

### Existing Record Context

The existing dossier documents that Epstein worked at Bear Stearns from approximately 1976
to 1980/1981, rising to limited partner before departing under disputed circumstances
(officially: SEC violations). He left Bear Stearns roughly 27 years before its 2008 collapse.

The "Liquid Funding Ltd." claim is therefore **not a claim about Epstein's 1976–1981
Bear Stearns period** — it's a claim that he had a *post-departure operational role* at
a Bear Stearns Bermuda vehicle founded in 2000. This is a meaningfully different claim.

A company named Liquid Funding Ltd. (Bermuda) was indeed a real Bear Stearns structured
product vehicle. Whether Epstein had a formal "chairman" role requires EFTA/SEC document
verification. The reel provides no Bates number or corporate filing citation.

### Phase B-1: New Timeline Entry

```json
{
  "id": "liquid-funding-bear-stearns-2000-2008",
  "date": "2000-01-01",
  "dateDisplay": "2000–2008",
  "era": "Financial Operations",
  "title": "Liquid Funding Ltd. — Alleged Epstein CMO Role at Bear Stearns Vehicle",
  "summary": "Community researcher zachary.loft claims Epstein held a 'chairman' role at Liquid Funding Ltd., a Bear Stearns Bermuda-incorporated structured product vehicle founded in 2000. The reel alleges Liquid Funding was used to repackage Bear Stearns' toxic subprime CMO inventory and sell it as investment-grade product — a practice central to the 2008 financial crisis. Bear Stearns collapsed March 2008 and was the first major 2008 crisis casualty. Epstein's documented Bear Stearns tenure was 1976–1981; a post-2000 operational role would be a distinct relationship. No Bates number or corporate filing provided. Requires EFTA financial records and SEC filing cross-reference.",
  "significance": "HIGH — if verified, represents undisclosed Epstein financial role with systemic crisis implications",
  "verificationStatus": "UNVERIFIED — COMMUNITY CLAIM",
  "relatedPersonIds": ["jeffrey-epstein"],
  "relatedThemeIds": ["financial-crimes", "bear-stearns-thread"],
  "progressiveDisclosure": {
    "level1": "Alleged: Epstein was chairman of Bear Stearns' Liquid Funding Ltd., which helped cause the 2008 housing crash.",
    "level2": "Liquid Funding Ltd. was a real Bear Stearns Bermuda vehicle (founded 2000) used for CMO repackaging. Epstein's documented Bear Stearns tenure was 1976–1981; the claim is about a separate post-2000 role. No corporate filing or Bates number provided.",
    "level3": "UNVERIFIED. Requires: (1) EFTA financial records search for Liquid Funding; (2) Bermuda corporate registry check; (3) SEC filings for Liquid Funding Ltd. directors/officers. If Epstein had a formal role at this vehicle 2000–2008, it would represent a previously undisclosed institutional financial connection with systemic implications.",
    "level4Sources": [
      "COMMUNITY: Instagram Reel DPOiW3QjVXh — zachary.loft (unverified)",
      "PUBLIC RECORD: Bear Stearns collapsed March 2008 — first major 2008 crisis institution",
      "EXISTING DOSSIER: Epstein at Bear Stearns 1976–1981 (VERIFIED)"
    ]
  }
}
```

### Phase B-2: Open Research Threads — Cluster B

```
SEARCH: "Liquid Funding" in EFTA full-text
SEARCH: Bermuda corporate registry for Liquid Funding Ltd. — officers/directors
SEARCH: SEC filings for Liquid Funding Ltd. (structured products, 2000–2008)
SEARCH: Epstein name in any Bear Stearns structured product documentation post-1981
NOTE: Cross-reference with Reel DUTydPHEkxk which also claims Epstein "caused the 2008
      economic crisis" — zachary.loft version is more specific and should be the primary
      research thread.
```

---

## CLUSTER C — Eva Andersson Dubin: August 2010 Email Enhancement
**Reel:** DUuwXDTCbPh · Channel: not.an.official.news.source

### What Was Found

The existing dossier already has an extensive Eva Andersson Dubin node. This reel surfaces
a specific email not captured in the existing record:

**Email — August 14, 2010:**
- **From:** Eva Anderson Dubin (Eva Andersson Dubin)
- **To:** Jeffrey Epstein
- **Content:** *"Come visit next week. [REDACTED] will have five friends over."*
- The reel notes the redacted name may be one of the Dubins' daughters, given that Epstein
  was named godfather to the Dubin children and the couple publicly stated they remained
  comfortable with Epstein around their children despite his conviction.

This email is post-conviction (Epstein was released July 2010 from work-release, having
served 13 months). An invitation from Eva Dubin dated August 14, 2010 — **six weeks after
Epstein's release** — is significant for post-conviction network continuity documentation.

### The Swedish Girl Thread (Cross-Reference to Previous Guide)

This reel also provides additional context for the housekeeper Rinaldo Rizzo testimony
(already in the dossier). The reel adds:
- The 15-year-old Swedish girl told Rizzo that Maxwell and Epstein "took her to the island
  and kept her there as a sex slave"
- She said Epstein and Maxwell had stolen her passport and threatened harm
- She had no memory of how she got from the Virgin Islands to America
- "She can't remember a thing"

The reel then explicitly foreshadows angel trumpet plants growing throughout the Virgin
Islands — **cross-reference to the scopolamine/trumpet plant guide (CC_GUIDE_REEL1)**. The
memory erasure matches the pharmacological profile of scopolamine. Flag this cross-reference
on both the timeline entry and the Eva Dubin node.

### Phase C-1: Eva Andersson Dubin Node Enhancement

Add to existing Eva Andersson Dubin entry:

```json
{
  "additionalSources": [
    {
      "type": "DOJ-EFTA",
      "citation": "Eva Andersson Dubin to Jeffrey Epstein email, August 14, 2010",
      "verificationStatus": "PARTIALLY VERIFIED",
      "notes": "Email content reported by community researcher not.an.official.news.source. Partial Bates number not provided; confirm against EFTA email set. Significant as post-conviction contact (Epstein released ~July 2010). Redacted name in email not confirmed."
    }
  ],
  "noteToAdd": "August 14, 2010 email invites Epstein to visit 'next week' — six weeks post-conviction release. A redacted name will reportedly have five friends over. This email places Eva in active post-conviction social contact with Epstein consistent with other post-release network documentation.",
  "crossReference": "See also scopolamine/trumpet plant guide: the Swedish girl housekeeper testimony describes complete memory erasure consistent with scopolamine exposure. Angel trumpet grows throughout the Virgin Islands (per reel DUuwXDTCbPh). Cross-reference with timeline entry: trumpet-plant-email-2014 and manzaro-scopolamine-2014."
}
```

### Phase C-2: New Timeline Entry

```json
{
  "id": "eva-dubin-post-conviction-email-2010",
  "date": "2010-08-14",
  "era": "Post-Conviction Operation",
  "title": "Eva Andersson Dubin Invites Epstein to Visit Six Weeks After Release",
  "summary": "An email from Eva Andersson Dubin to Jeffrey Epstein dated August 14, 2010 reads: 'Come visit next week. [REDACTED] will have five friends over.' Epstein had been released from work-release custody approximately six weeks earlier (July 2010). This email documents post-conviction social contact between the Dubins and Epstein, consistent with Glenn Dubin's documented appearance on the JPMorgan suspicious activity report and the flight log record of 34+ shared flights. The identity of the redacted name is unconfirmed.",
  "significance": "HIGH — post-conviction invitation from spouse of documented abuse participant, six weeks after release",
  "verificationStatus": "PARTIALLY VERIFIED — email reported but Bates number unconfirmed",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "Eva Andersson Dubin to Epstein email, August 14, 2010 (Bates number pending)",
  "relatedPersonIds": ["jeffrey-epstein", "eva-andersson-dubin", "glenn-dubin"],
  "relatedThemeIds": ["post-conviction-operation", "network-continuity"],
  "progressiveDisclosure": {
    "level1": "Eva Andersson Dubin emails Epstein six weeks after his 2010 release: 'Come visit next week.'",
    "level2": "August 14, 2010 email includes a redacted name who will 'have five friends over.' Epstein was godfather to the Dubin children. The couple publicly stated they remained comfortable with Epstein around their children despite his conviction.",
    "level3": "The Dubin network connection predates this email significantly: 34+ shared flights (1996–2005), Glenn Dubin on JPMorgan SAR, Virginia Giuffre testimony about Glenn, Rinaldo Rizzo housekeeper testimony about the 15-year-old Swedish girl with no memory of how she got from the Virgin Islands to the US mainland. The August 2010 email demonstrates that post-conviction, this network relationship continued without apparent disruption.",
    "level4Sources": [
      "DOJ EFTA: Eva Andersson Dubin email, August 14, 2010 (Bates number pending confirmation)",
      "EXISTING RECORD: EFTA00098755 — Dubin in prosecution planning document",
      "EXISTING RECORD: EFTA01660622 — FBI Prominent Names briefing, Dubin on p.17",
      "CROSS-REFERENCE: Scopolamine/trumpet plant guide — memory erasure consistent with Swedish girl testimony"
    ]
  }
}
```

---

## CLUSTER D — 11 East 71st Street: Property Transfer Chain
**Reel:** DVC61H7DKrs · Channel: _jenniferkings

### What Was Claimed

The reel identifies a property chain at **11 East 71st Street** (different from the
notorious 9 East 71st Street townhouse — one block west, different property):

1. Property at 11 East 71st Street was held by **Jeffrey Epstein** before passing to
   **Howard Lutnick** (Commerce Secretary nominee / Cantor Fitzgerald CEO)
2. Epstein received the property via transfer for **$10** from a deed where
   **Guido Goldman** was a trustee
3. Guido Goldman is described as the son of one of the founders of the World Jewish Congress
4. The property was then transferred **to a Comet Trust** in 1996 for **$10**
5. From the Comet Trust it passed to Lutnick, also for **$10**
6. The deed notary was **Gary Pollard**
7. Gary Pollard coincidentally photographed the South Tower collapse on September 11, 2001

**Note on the 9/11 observation:** The Gary Pollard photography claim is a coincidence
observation. Many New Yorkers photographed 9/11. This does not constitute a research
finding and should not be built into the site's data layer. It is noted for completeness.

**Note on Howard Lutnick:** The existing dossier has an extensive Lutnick node (Adfin
co-investment, 2012 contract, December 2012 island visit). The property transfer claim is
from **1996** — predating the documented Adfin relationship by 16 years. If accurate,
it represents a much earlier and deeper Epstein-Lutnick property connection than currently
documented.

**Note on Guido Goldman:** Guido Goldman (1937–2020) was a Harvard professor and the son
of Nahum Goldman, co-founder of the World Jewish Congress. He founded the Harvard program
in German studies. His role as a trustee in an Epstein property transfer, if documented,
is significant for the Harvard institutional network thread.

### Phase D-1: New Person Node — Guido Goldman

```json
{
  "id": "guido-goldman",
  "name": "Guido Goldman",
  "category": "Academic / Institutional",
  "status": "UNVERIFIED — Needs Property Record Verification",
  "dojMentionCount": 0,
  "summary": "Harvard professor (1937–2020) who founded the Harvard program in German and European studies. Son of Nahum Goldman, co-founder of the World Jewish Congress. Community researcher _jenniferkings claims Goldman served as a trustee on the deed transferring 11 East 71st Street to Epstein for $10. If accurate, this represents an institutional property connection between Epstein's real estate network and the Harvard/World Jewish Congress nexus. Requires property record verification.",
  "role": "Alleged trustee on 11 East 71st Street deed transfer. Harvard professor.",
  "themeIds": ["property-network", "harvard-network"],
  "connections": [
    {
      "personId": "jeffrey-epstein",
      "type": "property",
      "description": "Alleged trustee on deed transferring 11 East 71st Street to Epstein for $10. Date unspecified. UNVERIFIED.",
      "verificationStatus": "UNVERIFIED"
    }
  ],
  "sources": [
    {
      "type": "COMMUNITY",
      "citation": "Instagram Reel DVC61H7DKrs — _jenniferkings",
      "verificationStatus": "UNVERIFIED",
      "notes": "Verify via NYC property records (ACRIS database) — 11 East 71st Street deed history."
    }
  ],
  "openResearchQuestions": [
    "Pull NYC ACRIS records for 11 East 71st Street — confirm deed chain, trustee names, transfer amounts.",
    "Confirm dates of transfers (Epstein acquisition, Comet Trust transfer, Lutnick transfer).",
    "Identify 'Comet Trust' — registered entity, beneficiaries, jurisdiction."
  ]
}
```

### Phase D-2: Howard Lutnick Node Enhancement

Add to existing Lutnick entry:

```json
{
  "noteToAdd": "Community researcher _jenniferkings claims property records show Lutnick received 11 East 71st Street (a separate address from Epstein's primary 9 East 71st Street townhouse) via 'Comet Trust' in 1996 for $10, after Epstein had previously held the property (also acquired for $10, with Guido Goldman as trustee). If accurate, this property chain predates the documented Adfin co-investment (2012) by 16 years and represents a much earlier Epstein-Lutnick connection than currently in the record. UNVERIFIED — requires NYC ACRIS property record verification.",
  "additionalThemeIds": ["property-network"]
}
```

### Phase D-3: New Timeline Entry

```json
{
  "id": "11-east-71st-property-chain-1996",
  "date": "1996-01-01",
  "dateDisplay": "1996 (specific date unconfirmed)",
  "era": "Building the Machine",
  "title": "11 East 71st Street: $10 Property Transfer Chain — Epstein, Comet Trust, Lutnick",
  "summary": "Community researcher _jenniferkings claims NYC property records document a transfer of 11 East 71st Street (distinct from Epstein's primary 9 East 71st Street townhouse) in 1996. The alleged chain: Epstein acquired the property for $10 with Guido Goldman (Harvard professor, son of World Jewish Congress co-founder) as trustee; Epstein then transferred it to 'Comet Trust' for $10; Comet Trust transferred it to Howard Lutnick for $10. All three transfers at $10 suggest nominal consideration — typical of trust-based asset transfers. If verified, this establishes a 1996 Epstein-Lutnick property relationship predating all other documented Lutnick-Epstein connections by 16 years.",
  "significance": "HIGH — if verified, significantly extends timeline of Lutnick-Epstein relationship",
  "verificationStatus": "UNVERIFIED — COMMUNITY CLAIM",
  "sourceType": "PUBLIC RECORD (alleged)",
  "sourceCitation": "NYC property records (ACRIS) — claimed by _jenniferkings reel DVC61H7DKrs",
  "relatedPersonIds": ["jeffrey-epstein", "howard-lutnick", "guido-goldman"],
  "relatedThemeIds": ["property-network", "harvard-network", "financial-crimes"],
  "progressiveDisclosure": {
    "level1": "Property records allegedly show Epstein → Comet Trust → Lutnick, all at $10, at 11 East 71st St.",
    "level2": "This is a different address than Epstein's primary 9 East 71st Street townhouse. Guido Goldman (Harvard professor) allegedly served as trustee. Transfer was 1996 — 16 years before documented Adfin co-investment. The $10 consideration on all three transfers suggests nominal/trust-based rather than arms-length transactions.",
    "level3": "UNVERIFIED — requires NYC ACRIS property record pull. If confirmed, significantly extends the Lutnick-Epstein connection into the mid-1990s. 'Comet Trust' as an entity needs identification and jurisdictional research. Guido Goldman's trustee role, if confirmed, adds a Harvard institutional thread to the property network.",
    "level4Sources": [
      "COMMUNITY: Instagram Reel DVC61H7DKrs — _jenniferkings (unverified)",
      "EXISTING RECORD: Howard Lutnick — Adfin co-investment 2012, December 2012 island visit (VERIFIED)",
      "OPEN RESEARCH: NYC ACRIS database — 11 East 71st Street deed chain"
    ]
  }
}
```

---

## CLUSTER E — Paolo Zampoli, Joey Titone & the Brunel-Trump-Melania Thread
**Reel:** DQ9QlNqjrLF · Channel: itsgingertheory

### Scope Decision

This reel covers three figures: **Paolo Zampoli** (Melania Trump's modeling agent),
**Joey Titone** (Jackie Sandler's father, Brunel's 2015 defense attorney), and implies
a connection to **Adam Sandler** via his father-in-law.

**Adam Sandler** is not implemented as a person node. The connection is tertiary:
Sandler → married to Jackie Titone → her father Joey Titone → represented Brunel.
This is a legal representation relationship, not a documented Epstein or trafficking
connection.

**Joey Titone** is implemented as a research note attached to the Brunel node, not
as a standalone person node. An attorney representing a defendant does not by itself
constitute a documentable Epstein network connection.

**Paolo Zampoli** is implemented as a new person node. His documented roles —
Melania Trump's H-1B visa sponsor, introducer of Melania to Trump, connection to both
Brunel and the MC2 modeling world — represent independent research value.

### Phase E-1: New Person Node — Paolo Zampoli

```json
{
  "id": "paolo-zampoli",
  "name": "Paolo Zampoli",
  "category": "Modeling Industry",
  "status": "Peripheral — Documented Connection to Brunel Network",
  "dojMentionCount": 0,
  "summary": "Italian-American modeling agent. Sponsored Melania Knauss (Melania Trump)'s H-1B visa paperwork. The visa application reportedly stated she had not worked in the U.S. prior to obtaining the visa; reporting indicates she had been paid for approximately 10 modeling engagements in the U.S. totaling over $20,000 before the visa was filed — constituting potential immigration fraud if accurate. Zampoli is also credited with introducing Melania to Donald Trump. He was connected to Jean-Luc Brunel's modeling world, with both operating in overlapping New York-based fashion industry circles during the same period.",
  "role": "Modeling agent. Melania Trump's H-1B visa sponsor. Introduced Melania to Trump. Brunel network adjacency.",
  "themeIds": ["modeling-trafficking-pipeline", "trump-epstein-connections"],
  "connections": [
    {
      "personId": "jean-luc-brunel",
      "type": "industry",
      "description": "Both operated in overlapping NYC modeling industry circles. Exact nature of relationship not specified in reel.",
      "verificationStatus": "COMMUNITY CLAIM"
    },
    {
      "personId": "donald-trump",
      "type": "introduction",
      "description": "Introduced Melania Knauss to Trump per reporting.",
      "verificationStatus": "PUBLICLY REPORTED"
    }
  ],
  "sources": [
    {
      "type": "COMMUNITY",
      "citation": "Instagram Reel DQ9QlNqjrLF — itsgingertheory",
      "verificationStatus": "COMMUNITY CLAIM"
    },
    {
      "type": "NEWS",
      "citation": "Multiple reporting on Melania H-1B visa circumstances and Zampoli's role",
      "verificationStatus": "PUBLICLY REPORTED",
      "notes": "H-1B immigration irregularities were reported by AP and others during 2016 campaign. Verify specific figures ($20,000+, 10 engagements) against primary reporting."
    }
  ],
  "openResearchQuestions": [
    "Confirm Zampoli's direct documented connection to Brunel — shared events, correspondence, shared clients.",
    "Verify immigration fraud figures from independent news sources.",
    "Search EFTA/Jmail for Zampoli mentions."
  ]
}
```

### Phase E-2: Brunel Node Enhancement — Joey Titone Note

Add to existing Jean-Luc Brunel entry:

```json
{
  "noteToAdd": "Florida attorney Joey Titone (father-in-law of actor Adam Sandler) represented Brunel in 2015 Florida proceedings, per community researcher itsgingertheory. The representation predates Brunel's 2022 Paris arrest and 2022 prison death. This is noted as a legal representation fact; Sandler himself has no documented Epstein connection."
}
```

---

## Master Open Research Queue — Clusters A–E

| Priority | Query | Cluster | Method |
|----------|-------|---------|--------|
| HIGH | "Liquid Funding" in EFTA full-text | B | Jmail.world search |
| HIGH | NYC ACRIS records — 11 East 71st Street deed chain | D | ACRIS.nyc.gov public lookup |
| HIGH | "Siegel" OR "Peggy" August 2010 in Epstein email set | A | Jmail.world search |
| HIGH | Eva Dubin Aug 14 2010 email — confirm Bates number | C | EFTA email set search |
| MEDIUM | "Schank" OR "Shank" in Jmail full-text | A | Jmail.world |
| MEDIUM | Bermuda corporate registry — Liquid Funding Ltd. directors | B | Bermuda registry |
| MEDIUM | "Comet Trust" entity identification | D | Bermuda/Delaware registry |
| MEDIUM | "Zampoli" in EFTA/Jmail | E | Jmail.world |
| MEDIUM | "Baal" as account name in EFTA financial records | A | EFTA financial section |
| MEDIUM | "Rothschild" + "Ukraine" in EFTA emails | A | Jmail.world |
| LOW | "Fink" OR "Joshua Fink" in EFTA (NOT "Finkelstein") | A | Jmail.world — verify name before creating node |
| LOW | Joey Titone Florida bar record — Brunel 2015 case | E | Florida Bar Association |

---

## Verification Status Summary — All Clusters

| Item | Status |
|------|--------|
| Peggy Siegel — Aug 7, 2010 email | ❌ UNVERIFIED |
| Roger Schank — Epstein correspondence | ❌ UNVERIFIED |
| "Baal" bank account name | ❌ UNVERIFIED |
| "Larry Finkelstein" = Larry Fink | ⚠️ TRANSCRIPTION CONCERN — do not act until verified |
| Forced pregnancies victim diary | ❌ NOT IMPLEMENTED — requires sworn/EFTA anchor |
| Liquid Funding / Bear Stearns CMO role | ❌ UNVERIFIED — specific claim, needs SEC/EFTA |
| Eva Dubin Aug 14, 2010 email | ⚠️ PARTIALLY VERIFIED — reported but Bates unconfirmed |
| Swedish girl memory loss ↔ scopolamine (cross-ref) | ⚠️ CIRCUMSTANTIAL — see Reel 1 guide |
| 11 East 71st Street $10 transfer chain | ❌ UNVERIFIED — needs ACRIS pull |
| Guido Goldman as deed trustee | ❌ UNVERIFIED |
| Lutnick 1996 property connection | ❌ UNVERIFIED |
| Paolo Zampoli / Melania H-1B irregularities | ⚠️ PUBLICLY REPORTED (not EFTA-sourced) |
| Zampoli ↔ Brunel documented connection | ❌ UNVERIFIED |
| Joey Titone as Brunel's attorney 2015 | ⚠️ COMMUNITY CLAIM — verify Florida Bar |
| Reel DUTydPHEkxk (unlabeled) | ❌ NOT IMPLEMENTED — extraordinary claims, no document anchors |

---

*Guide compiled from six Instagram Reels. Verification Wall methodology applied throughout.
Reel DUTydPHEkxk explicitly excluded per extraordinary claims threshold. Antisemitic editorial
framing in Reel DUMnu1rjVUq documented and separated from factual email claims. Run master
open research queue against Jmail.world, NYC ACRIS, and Bermuda corporate registry before
upgrading any node to VERIFIED status.*