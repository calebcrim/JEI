# Implementation Prompt: Dalton Hire Year Probe — Research Results
## For Claude Code in /workspaces/JEI

**Date:** 2026-03-04  
**Probe:** Venue 9 (News Archives) — Epstein Dalton hire year: 1973 vs. 1974  
**Source Guide:** `Reels/CC_GUIDE_REEL12_DONALDBARR_DALTON_OSS_CIA.md`  
**Priority:** HIGH (Critical Path #8)  
**Status change:** CONTRADICTION OPEN → RESOLVED: September 1974 is confirmed

---

## RESEARCH FINDINGS SUMMARY

The 1973/1974 discrepancy is now **definitively resolved in favor of September 1974**. Two independent primary-source investigations confirm this, one of which located the original Dalton school newspaper.

---

### Source 1 — New York Times, July 12, 2019

**URL:** https://www.nytimes.com/2019/07/12/nyregion/jeffrey-epstein-dalton-teacher.html  
**Archive:** https://web.archive.org/web/20190717235814/https://www.nytimes.com/2019/07/12/nyregion/jeffrey-epstein-dalton-teacher.html  
**Authors:** Mike Baker and Amy Julia Harris  
**Method:** NYT reviewed Dalton's yearbooks.

**Key finding:** "In September 1974, at age 21, Epstein started working as a calculus and mathematics teacher at the Dalton School on the Upper East Side of Manhattan. The school's newspaper announced the hiring of Epstein."

---

### Source 2 — The Daily Beast (primary source investigation)

**URL:** https://www.thedailybeast.com/jeffrey-epstein-dodged-questions-about-sex-with-his-dalton-prep-school-students/  
**Archive:** https://web.archive.org/web/20260208100846/https://www.thedailybeast.com/jeffrey-epstein-dodged-questions-about-sex-with-his-dalton-prep-school-students/  
**Method:** Author searched the 1973–74 Dalton yearbook and the Dalton school newspaper (*The Daltonian*) directly.

**Key findings:**

"After the summer of 1974, Epstein began working as a teacher of mathematics and physics at the Dalton School in the Upper East Side of Manhattan. It has been reported that he began there in 1973, but this is incorrect. I searched the 1973-74 Dalton yearbook and there is no mention of Jeffrey Epstein. I then searched Dalton's school newspaper and found in the September 1974 issue that '... Mr. Epstein, who will also teach physics, [has] also joined the department this year.' Epstein also confirmed that he taught there between 1974 and 1976 in a deposition."

**On Donald Barr's role in hiring:** "Donald Barr resigned in turmoil in February of 1974 (according to the March 14, 1974 issue of The Daltonian) which was seven months before Jeffrey Epstein began teaching there that fall. While it is possible that Donald Barr may have hired Epstein, if he made personnel decisions long in advance, the Dalton School lost four math teachers (according to The Daltonian) prior to the 1974-75 school year. Therefore the school may have hired Epstein, in part, out of an urgent need to fill vacant positions."

"Peter Branch was the acting headmaster after Barr's departure and he may have hired Epstein." After publication, the author confirmed with Branch directly: his appointment as interim headmaster began July 1, 1974; Barr's contract expired June 30, 1974.

---

### Corroborating sources

- **Donald Barr Wikipedia:** "In February 1974, Barr announced his resignation at the end of the school year. Epstein began working at Dalton in September 1974."
- **Snopes fact-check:** "Epstein began working as a math and physics teacher at Dalton in September 1974, according to a New York Times review of the school's yearbooks."

---

## RESOLVED FACTS

| Claim | Resolved Status | Evidence |
|---|---|---|
| Epstein started at Dalton in 1974 (not 1973) | ✅ VERIFIED | NYT yearbook review + Daily Beast *Daltonian* newspaper search + Epstein deposition |
| Epstein started specifically in **September 1974** | ✅ VERIFIED | September 1974 issue of *The Daltonian* names him as new hire |
| Epstein taught at Dalton from **1974 to 1976** | ✅ VERIFIED | Epstein's own deposition; dismissed June 1976 for "poor performance" |
| Donald Barr **directly hired** Epstein | ❌ UNVERIFIED — LIKELY FALSE | Barr resigned February 1974, seven months before Epstein started. Peter Branch (interim headmaster from July 1, 1974) is the more likely hiring authority |
| Epstein started at Dalton in **1973** | ❌ DEFINITIVELY REFUTED | Daily Beast searched 1973–74 yearbook: no mention of Epstein |

---

## IMPLEMENTATION INSTRUCTIONS FOR CLAUDE CODE

### Step 1 — Update the Dalton/Donald Barr timeline entry

Locate the timeline entry covering Epstein's Dalton tenure (likely id: `"dalton-school-1974-1976"` or similar) in `src/data/timeline.json`.

Update or create with the following:

```json
{
  "id": "dalton-school-1974-1976",
  "date": "1974-09-01",
  "dateDisplay": "September 1974 – June 1976",
  "era": "Early Life",
  "title": "Epstein Hired at the Dalton School — September 1974",
  "summary": "Jeffrey Epstein began teaching calculus, mathematics, and physics at the Dalton School on the Upper East Side of Manhattan in September 1974, at age 21, without a college degree or teaching license. The September 1974 issue of the school newspaper The Daltonian announced his hiring. Epstein also confirmed this timeline in his own deposition. He was dismissed in June 1976 for 'poor performance.' The claim that he began in 1973 is definitively refuted: a search of the 1973–74 Dalton yearbook found no mention of him. Donald Barr (father of Attorney General William Barr) served as Dalton headmaster until his contract expired June 30, 1974 — seven months before Epstein's September 1974 start. Peter Branch was interim headmaster from July 1, 1974 and is the more likely hiring authority, though full confirmation would require Dalton's personnel records. While at Dalton, Epstein tutored Alan Greenberg's children (Greenberg was a senior Bear Stearns partner), leading to a Bear Stearns job offer in 1976.",
  "significance": "HIGH — establishes precise chronology for the Donald Barr / Epstein connection; definitively resolves the 1973 vs. 1974 discrepancy",
  "verificationStatus": "VERIFIED",
  "verificationNote": "NYT reviewed Dalton yearbooks (July 12, 2019). Daily Beast independently searched the 1973–74 yearbook (no Epstein) and found his name in the September 1974 Daltonian. Epstein confirmed 1974–1976 in deposition.",
  "relatedPersonIds": ["jeffrey-epstein", "donald-barr"],
  "relatedThemeIds": ["early-life", "donald-barr-thread"],
  "progressiveDisclosure": {
    "level1": "Epstein began teaching at the elite Dalton School in September 1974 — not 1973 as sometimes reported. He had no college degree.",
    "level2": "The September 1974 issue of Dalton's school newspaper named Epstein as a new hire. He confirmed the 1974–1976 dates in his own deposition. Donald Barr's contract as headmaster expired June 30, 1974 — seven months before Epstein arrived. Peter Branch was the interim headmaster who most likely hired him.",
    "level3": "The 1973 start date claim is definitively refuted: a direct search of the 1973–74 Dalton yearbook found no mention of Epstein. The New York Times independently reviewed Dalton yearbooks and reached the same conclusion. Epstein was dismissed in June 1976. While at Dalton, he tutored the children of Bear Stearns senior partner Alan Greenberg, which led directly to his 1976 Bear Stearns hire.",
    "level4Sources": [
      "New York Times, July 12, 2019 (Baker & Harris): 'Jeffrey Epstein Taught at Dalton. His Behavior Was Noticed.' — Yearbook review confirms September 1974 start. https://www.nytimes.com/2019/07/12/nyregion/jeffrey-epstein-dalton-teacher.html",
      "The Daily Beast (archived Feb 8, 2026): 'Jeffrey Epstein Dodged Questions About Sex With His Dalton Prep-School Students' — Searched 1973-74 yearbook (no Epstein); found September 1974 Daltonian naming him as new hire; quotes Epstein deposition confirming 1974-1976. https://www.thedailybeast.com/jeffrey-epstein-dodged-questions-about-sex-with-his-dalton-prep-school-students/",
      "Donald Barr Wikipedia: 'In February 1974, Barr announced his resignation at the end of the school year. Epstein began working at Dalton in September 1974.'",
      "Snopes fact-check: Confirms September 1974 per NYT yearbook review."
    ]
  }
}
```

---

### Step 2 — Update Donald Barr person node

Locate the Donald Barr entry in `src/data/people.json` and update the hiring claim language. The connection description between Barr and Epstein should be updated to reflect the resolution:

Find the connection between `donald-barr` and `jeffrey-epstein` and update to:

```json
{
  "personId": "jeffrey-epstein",
  "type": "institutional",
  "description": "Barr served as Dalton headmaster until his contract expired June 30, 1974. Epstein began teaching at Dalton in September 1974 — seven months after Barr's departure. Whether Barr made the hiring decision in advance is unconfirmed; Peter Branch (interim headmaster from July 1, 1974) is the more probable hiring authority. The claim that Barr directly hired Epstein is unverified.",
  "verificationStatus": "PARTIALLY VERIFIED — timing makes direct hire unlikely"
}
```

Also update any biographical text in the Barr node that states he hired Epstein, replacing it with appropriately hedged language.

---

### Step 3 — Resolve the open contradiction in the research queue

Locate the contradiction or discrepancy note for the Dalton hire year in `src/data/research-queue.json` (or wherever the site tracks open contradictions) and mark it:

```json
{
  "id": "dalton-hire-year-discrepancy",
  "status": "RESOLVED",
  "resolution": "September 1974 confirmed. 1973 claim definitively refuted. Donald Barr's direct role in hiring unverified — his contract expired June 30, 1974, seven months before Epstein arrived.",
  "resolvedDate": "2026-03-04",
  "sources": [
    "NYT July 12, 2019 (yearbook review)",
    "Daily Beast (Daltonian September 1974 issue + Epstein deposition)"
  ]
}
```

---

### Step 4 — Update search index

In `src/data/search-index.json`, locate the Dalton timeline entry and update its fullText to include the resolved date and the refuted claim:

```json
{
  "type": "event",
  "id": "dalton-school-1974-1976",
  "title": "Epstein at Dalton School (September 1974 – June 1976)",
  "excerpt": "Epstein started at Dalton in September 1974, not 1973. Confirmed by the September 1974 Daltonian school newspaper and Epstein's own deposition.",
  "fullText": "Dalton School 1974 1976 September teacher mathematics physics calculus Donald Barr Peter Branch headmaster hired firing dismissed poor performance Alan Greenberg Bear Stearns tutoring no college degree no teaching license Daltonian school newspaper yearbook 1973 refuted deposition confirmed"
}
```

---

### Step 5 — Update the Donald Barr / Dalton theme or section

If the site has a thematic section covering the Donald Barr / Dalton / OSS / CIA cluster (corresponding to `CC_GUIDE_REEL12`), locate it in `src/data/themes.json` and add a note to the Dalton subsection:

```json
{
  "clarificationNote": "The 1973 vs. 1974 discrepancy is resolved: Epstein began at Dalton in September 1974, confirmed by the September 1974 Daltonian and his own deposition. The 1973 claim is definitively refuted by a direct search of the 1973-74 yearbook. Donald Barr's contract expired June 30, 1974; Peter Branch was interim headmaster when Epstein was actually hired."
}
```

---

## BUILD VERIFICATION

After implementation, run `npm run build` and check:

1. The Dalton timeline entry shows date `"1974-09-01"` and dateDisplay `"September 1974 – June 1976"`
2. The Donald Barr connection description no longer states he directly hired Epstein without caveat
3. The open contradiction for Dalton hire year is marked RESOLVED
4. No remaining references to "1973" as Epstein's Dalton start date in any data file

---

## WHAT REMAINS OPEN IN THE DONALD BARR / REEL12 CLUSTER

| Probe | Status |
|---|---|
| Dalton hire year 1973 vs. 1974 | ✅ RESOLVED — September 1974 |
| Donald Barr directly hired Epstein | ❌ UNVERIFIED — likely Peter Branch |
| William Barr CIA analyst dates 1971–1977 | OPEN — public record confirmation needed |
| Donald Barr OSS service details | OPEN |

---

*Implementation guide compiled 2026-03-04. Primary sources: NYT July 12, 2019 and The Daily Beast (archived). Verification Wall methodology: these are published journalism citing primary documents (yearbook, school newspaper, deposition) — status VERIFIED.*
