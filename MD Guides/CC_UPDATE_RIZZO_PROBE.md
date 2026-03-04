# Claude Code Update Instructions
## Probe: Rinaldo Rizzo — Housekeeper Testimony
**Status:** PROBE COMPLETED  
**Date:** 2026-03-04  
**Source document:** `EFTA02785156` (Bates-stamped, sworn deposition)  
**Case:** *Giuffre v. Maxwell*, 1:15-cv-07433-LAP, Document 1201-4, Filed 01/27/21  
**Deposition date:** June 10, 2016  
**Location:** Boies Schiller & Flexner, 333 Main Street, Armonk, NY  
**Court reporter:** Leslie Fagin, Notary Public, State of New York (Magna Legal Services)  
**Marked:** CONFIDENTIAL / File Under Seal  

---

## Summary of What Was Found

The Rinaldo Rizzo deposition was listed in the master probe list as HIGH priority because:
- It was referenced in REELS6-11 (Eva Dubin guide) without its own Bates anchor
- It is a potential third corroboration point for the scopolamine/chemical drugging thread (REEL1)
- The Swedish girl amnesia-transit gap was the specific detail requiring confirmation

**Probe resolution:**
- ✅ Sworn testimony confirmed (videotaped deposition under oath)
- ✅ Bates number confirmed: EFTA02785156
- ✅ Full Swedish girl testimony extracted (pages 52–57 of deposition)
- ✅ Passport confiscation detail confirmed in sworn testimony
- ✅ Amnesia-transit gap confirmed: "I don't know how I got from the island to here"
- ✅ Rizzo listed as Witness #22 in Florida civil case (EFTA02781079), c/o Robert [REDACTED], Freeman LLP, 228 East 45th St, 17th Floor, New York, NY 10017

---

## FILE CHANGES REQUIRED

### 1. `src/data/people.json` — Rinaldo Rizzo Entry

Locate the existing entry with `"id": "rinaldo-rizzo"`. If the entry is sparse (as suggested by project knowledge showing only a stub entry referencing "Category 2"), **replace or expand** the `sections` array and update metadata as follows:

```json
{
  "id": "rinaldo-rizzo",
  "name": "Rinaldo Rizzo",
  "category": "witness",
  "summary": "Housekeeper employed at a residence associated with the Epstein-Maxwell network. Testified under oath in Giuffre v. Maxwell (June 10, 2016) about witnessing a distressed 15-year-old Swedish girl who reported passport confiscation, sexual abuse on Epstein's island, and had no memory of how she traveled from the Virgin Islands to the US mainland. Also testified about witnessing a recurring event known as 'the kissing game' involving 11–12 girls ages approximately 14–19.",
  "verificationStatus": "verified",
  "sources": ["DOJ"],
  "sections": [
    {
      "title": "Role",
      "content": "Housekeeper at a residence connected to the Epstein-Maxwell network. Listed as Witness #22 in the Seventh Amended Witness List in Florida civil litigation (*Jeffrey Epstein v. Scott Rothstein et al.*, Case No. 502009CA040800XXXXMBAG), described as having 'knowledge of Ghislaine Maxwell and Jeffrey Epstein's sexual trafficking conduct and interaction with underage minors.' Contact address of record: c/o Robert [REDACTED], Freeman LLP, 228 East 45th Street, 17th Floor, New York, NY 10017.\n\n---",
      "sources": ["DOJ"]
    },
    {
      "title": "Sworn Deposition — June 10, 2016",
      "content": "Rizzo gave a videotaped deposition on June 10, 2016 in *Giuffre v. Maxwell* (1:15-cv-07433-LAP), at the offices of Boies Schiller & Flexner, 333 Main Street, Armonk, NY. Court reporter: Leslie Fagin, Notary Public, State of New York (Magna Legal Services). The deposition is filed as Document 1201-4 (01/27/21), marked Confidential and File Under Seal. Bates number: **EFTA02785156**.\n\n---",
      "sources": ["DOJ"]
    },
    {
      "title": "Testimony: 15-Year-Old Swedish Girl",
      "content": "Rizzo testified about a 15-year-old Swedish girl brought to Eva Dubin's residence by Ghislaine Maxwell and Jeffrey Epstein. The girl exhibited acute distress and 'blurted out' incoherently. Key statements documented in sworn testimony:\n\n- The girl said: *'I was on the island...there was Ghislaine, there was Sarah, they asked me for sex, I said no.'*\n- Regarding her travel: *'I don't know how I got from the island to here. Last afternoon...I was on the island and now I'm here.'*\n- Ghislaine Maxwell had confiscated the girl's passport: *'Ghislaine took my passport...Sarah took her passport and phone and gave it to Ghislaine Maxwell.'*\n- The girl had been threatened: she was told by Maxwell not to discuss what had occurred.\n- The girl stated she 'can't remember a thing' about transit from the Virgin Islands to the US mainland.\n\n**Cross-reference:** The complete amnesia covering the transit period — with the last memory being on Epstein's island — is the specific detail connecting to the scopolamine/chemical drugging thread (see REEL1, `manzaro-scopolamine-2014` and `trumpet-plant-email-2014`). Angel trumpet (*Brugmansia* spp.) grows throughout the Virgin Islands. Scopolamine-induced amnesia reliably erases episodic memory and cannot be detected on standard toxicology screens.\n\n---",
      "sources": ["DOJ"]
    },
    {
      "title": "Testimony: 'The Kissing Game'",
      "content": "Rizzo also testified about witnessing a recurring event referred to by the household nanny as 'the kissing game.' Rizzo observed approximately 11–12 girls, estimated ages 14–19, at the residence. Ghislaine Maxwell gave instructions to the girls and directed them to the living room. The girls engaged in sexual behavior (described as 'grinding on each other, lifting up their tops'). Maxwell sat next to Epstein during these activities. The nanny confirmed this was a recurring event. This testimony is relevant to establishing Maxwell's operational role in organizing and directing abuse, and supports Rule 404(b) and Rule 415 pattern-of-conduct arguments made in related litigation.\n\n---",
      "sources": ["DOJ"]
    }
  ],
  "timelineEventIds": [
    "rizzo-swedish-girl-testimony",
    "rizzo-kissing-game-testimony"
  ],
  "themeIds": [
    "chemical-drugging",
    "trafficking-methodology",
    "maxwell-operational-role",
    "victim-testimonies"
  ],
  "connectionIds": [
    "jeffrey-epstein",
    "ghislaine-maxwell",
    "eva-andersson-dubin"
  ]
}
```

> **Note:** Also remove or merge the stub entry `"id": "rinaldo-rizzo-listed-also-in-category-2"` — it exists only as a duplicate reference. If merging would break connection IDs, update the connection `mention-rinaldo-rizzo-listed-also-in-category-2-rinaldo-rizzo` to point to `"rinaldo-rizzo"` directly.

---

### 2. `src/data/timeline.json` (or equivalent) — Add Two New Entries

#### Entry A — Swedish Girl Incident (c. 2005–2008, precise date unknown)

```json
{
  "id": "rizzo-swedish-girl-testimony",
  "date": "2005-2008",
  "dateDisplay": "c. 2005–2008 (precise date not established)",
  "era": "Pre-Arrest Operation",
  "title": "Housekeeper Witnesses Distressed 15-Year-Old Swedish Girl at Dubin Residence",
  "summary": "Rinaldo Rizzo, housekeeper, testified under oath that a 15-year-old Swedish girl was brought to Eva Dubin's residence by Ghislaine Maxwell and Jeffrey Epstein. The girl was incoherent with distress. She reported being taken to Epstein's island where Ghislaine Maxwell and another woman named 'Sarah' demanded sexual acts (which she refused). Her passport had been confiscated by Maxwell. She had no memory of her transit from the Virgin Islands to the US mainland — 'I don't know how I got from the island to here. Last afternoon I was on the island and now I'm here.' She stated she 'can't remember a thing.'",
  "significance": "HIGH",
  "verificationStatus": "VERIFIED",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "Deposition of Rinaldo Rizzo, June 10, 2016 — Giuffre v. Maxwell, 1:15-cv-07433-LAP, Doc. 1201-4 (01/27/21) — EFTA02785156 (pp. 52–57)",
  "relatedPersonIds": [
    "rinaldo-rizzo",
    "jeffrey-epstein",
    "ghislaine-maxwell",
    "eva-andersson-dubin"
  ],
  "relatedThemeIds": [
    "chemical-drugging",
    "trafficking-methodology",
    "passport-confiscation",
    "victim-testimonies"
  ],
  "progressiveDisclosure": {
    "level1": "Housekeeper Rizzo testifies about a 15-year-old Swedish girl with no memory of leaving Epstein's island — her passport had been confiscated by Ghislaine Maxwell.",
    "level2": "The girl reported being brought to the island by Epstein and Maxwell, asked for sex by Maxwell and a woman named 'Sarah,' and threatened not to speak. She arrived at Eva Dubin's residence in an acute state of distress with a complete memory gap covering her transit from the Virgin Islands.",
    "level3": "Rizzo's sworn testimony is one of three documented corroboration points for the chemical drugging thread: (1) Rizzo's testimony — Swedish girl has complete transit amnesia after being on Epstein's island; (2) Manzaro victim impact statement — explicit scopolamine allegation, December 26, 2014 (EFTA verified); (3) Epstein's March 3, 2014 email referencing 'trumpet plants' at Little St. James. Angel trumpet (Brugmansia) — native to the Virgin Islands — is the primary plant source of scopolamine, which reliably erases episodic memory and is undetectable on standard toxicology screens. The transit amnesia pattern (last memory: island; next memory: US mainland) is pharmacologically consistent with scopolamine exposure.",
    "level4Sources": [
      "DOJ EFTA: Deposition of Rinaldo Rizzo, June 10, 2016 — Bates EFTA02785156 (pp. 52–57)",
      "DOJ EFTA: Victim impact statement of Dr. Joseph Manzaro — explicit scopolamine allegation",
      "DOJ EFTA: Epstein to Rodriguez, March 3, 2014 — 'trumpet plants' email",
      "Hawaiian Medical Journal (1995): Angel Trumpet ingestion — normal labs despite acute intoxication",
      "CROSS-REFERENCE: REEL1 guide (CC_GUIDE_REEL1_SCOPOLAMINE_TRUMPET_PLANT.md)"
    ]
  }
}
```

#### Entry B — 'The Kissing Game' (date range unknown)

```json
{
  "id": "rizzo-kissing-game-testimony",
  "date": "2000-2008",
  "dateDisplay": "c. 2000–2008 (precise date not established; recurring event)",
  "era": "Pre-Arrest Operation",
  "title": "Housekeeper Testifies to Recurring 'Kissing Game' Event Directed by Ghislaine Maxwell",
  "summary": "Rinaldo Rizzo testified that Ghislaine Maxwell organized a recurring event at the residence referred to by the household nanny as 'the kissing game.' Maxwell gave instructions to approximately 11–12 girls (estimated ages 14–19), directing them to the living room where they engaged in sexual behavior while Maxwell sat next to Epstein.",
  "significance": "HIGH",
  "verificationStatus": "VERIFIED",
  "sourceType": "DOJ-EFTA",
  "sourceCitation": "Deposition of Rinaldo Rizzo, June 10, 2016 — Giuffre v. Maxwell, 1:15-cv-07433-LAP, Doc. 1201-4 (01/27/21) — EFTA02785156",
  "relatedPersonIds": [
    "rinaldo-rizzo",
    "jeffrey-epstein",
    "ghislaine-maxwell"
  ],
  "relatedThemeIds": [
    "maxwell-operational-role",
    "organized-abuse",
    "victim-testimonies"
  ],
  "progressiveDisclosure": {
    "level1": "Housekeeper Rizzo testifies that Ghislaine Maxwell regularly organized sexual activity involving 11–12 girls estimated ages 14–19 at the residence — referred to by household staff as 'the kissing game.'",
    "level2": "Maxwell gave explicit instructions to the girls and directed them to the living room. She sat next to Epstein during the events. The household nanny confirmed this was recurring, not a one-time incident.",
    "level3": "This testimony is directly relevant to the legal pattern-of-conduct arguments advanced in related litigation. Under Federal Rule of Evidence 415 (and the related Rule 404(b) framework used in civil cases), evidence of prior sexual misconduct with minors is admissible to show propensity. Multiple courts in the Epstein litigation cited the need to establish pattern and modus operandi — Rizzo's testimony about recurring organized events, with Maxwell directing participants, is one of the clearer pieces of sworn evidence for Maxwell's active operational role as organizer rather than passive participant.",
    "level4Sources": [
      "DOJ EFTA: Deposition of Rinaldo Rizzo, June 10, 2016 — Bates EFTA02785156",
      "LEGAL CONTEXT: FRE 415 / FRE 404(b) arguments in Epstein civil litigation — pattern-of-conduct admissibility"
    ]
  }
}
```

---

### 3. `src/data/people.json` — Eva Andersson Dubin Entry: Cross-Reference Addition

Locate the existing Eva Andersson Dubin entry. In the section already referencing the Swedish girl (added per the REELS6-11 guide), **upgrade the verification status** of the Rizzo cross-reference from `PARTIALLY VERIFIED` to `VERIFIED` and add the Bates number. 

Find the existing note text that says:
> "Rinaldo Rizzo housekeeper testimony about the 15-year-old Swedish girl..."

Update the `verificationStatus` on that note from `PARTIALLY VERIFIED` to `VERIFIED` and add:
```
"sourceCitation": "Deposition of Rinaldo Rizzo, June 10, 2016 — EFTA02785156 (pp. 52–57)"
```

Also update the `level4Sources` array in the Eva Dubin post-conviction email timeline entry (`"id": "eva-dubin-post-conviction-email-2010"`) to reflect:
```json
"VERIFIED RECORD: Deposition of Rinaldo Rizzo, June 10, 2016 — EFTA02785156 (pp. 52–57). Swedish girl brought to Dubin residence by Epstein and Maxwell. Full amnesia covering transit from Epstein's island."
```

---

### 4. `src/data/themes.json` (or equivalent) — Chemical Drugging Theme: Add Third Corroboration Point

Locate the existing `"chemical-drugging"` theme entry. In its evidence array or content, add Rizzo's testimony as the third corroboration point:

```json
{
  "corroborationPoint": 3,
  "label": "Rizzo Deposition — Swedish Girl Transit Amnesia",
  "date": "c. 2005–2008 (incident); testimony June 10, 2016",
  "description": "Rinaldo Rizzo's sworn deposition testimony describes a 15-year-old Swedish girl brought to the Dubin residence by Epstein and Maxwell with no memory of her transit from the Virgin Islands to the US mainland. Last memory: on Epstein's island. Next memory: at the Dubin residence. Her passport had been confiscated. This complete transit amnesia is pharmacologically consistent with scopolamine exposure.",
  "verificationStatus": "VERIFIED",
  "sourceCitation": "Deposition of Rinaldo Rizzo, June 10, 2016 — EFTA02785156 (pp. 52–57)",
  "note": "This is indirect corroboration: the testimony documents amnesia consistent with scopolamine pharmacology but does not name scopolamine directly. The two direct scopolamine references remain Manzaro (EFTA verified) and the trumpet plant email (EFTA verified). Rizzo strengthens the pattern without independently confirming the method."
}
```

---

## Probe Status Update

Update the master probe verification table (if maintained in the codebase or a separate status file):

| Probe | Was | Now |
|-------|-----|-----|
| Rinaldo Rizzo — Bates + sworn status | ❌ UNVERIFIED | ✅ VERIFIED — EFTA02785156 |
| Swedish girl — full statement | ❌ UNVERIFIED | ✅ VERIFIED — EFTA02785156 pp. 52–57 |
| Scopolamine — third corroboration point | ⚠️ HYPOTHESIS | ⚠️ STRENGTHENED — indirect corroboration via transit amnesia (Rizzo); direct corroboration count remains 2 |

---

## Cautions and Verification Wall Notes

1. **Passport confiscation** — sworn testimony, VERIFIED. Safe to present as established fact.
2. **"Kissing game"** — sworn testimony, VERIFIED. Safe to present as established fact.
3. **Swedish girl identity** — never established in deposition. Do not speculate or add a person node.
4. **"Sarah"** — named in the girl's reported statement but identity not confirmed in deposition. Do not create a person node for "Sarah" based solely on this reference.
5. **Scopolamine connection** — remains CIRCUMSTANTIAL/HYPOTHESIS for the Swedish girl specifically. The amnesia is consistent with scopolamine pharmacology but Rizzo's testimony does not name a drug. Label accordingly in all Level 3 and Level 4 disclosures.
6. **Eva Dubin residential address** — Rizzo's deposition confirms a Dubin residence was the location but does not specify whether this was the Palm Beach property (1090 N. Lake Way) or the New York residence (1040 5th Avenue). Do not assign a specific property to this event without further confirmation.

---

*Compiled from: Deposition of Rinaldo Rizzo, EFTA02785156, June 10, 2016 — Giuffre v. Maxwell (1:15-cv-07433-LAP). Supplementary documents: EFTA02781079 (Seventh Amended Witness List), EFTA02792453, EFTA02792483, EFTA02794377 (additional Florida civil case filings). Cross-referenced against CC_GUIDE_REEL1 (scopolamine thread) and CC_GUIDE_REELS6-11 (Eva Dubin node). Verification Wall methodology applied throughout.*
