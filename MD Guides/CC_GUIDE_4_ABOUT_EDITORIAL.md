# Claude Code Build Guide — Part 4: About Page & Editorial Framing
## Epstein Files Research Database

---

## Purpose of This Guide

This guide covers:
1. The `/about` page — its full content, structure, and UX
2. A site-wide editorial framing layer — how the About page connects to the rest of the site
3. A source legend page at `/sources`
4. Integration points: where and how editorial context surfaces throughout the UI

---

## Why This Page Matters

This database presents contested, politically sensitive, and deeply serious material about real
people — some convicted, many not charged, some alleging unverified claims. The About page
accomplishes four things that the data views alone cannot:

1. **Establishes legitimacy** — explains the compilation methodology before users encounter claims
2. **Sets the reliability framework** — teaches users how to read the verification flags they'll
   see throughout the site
3. **Discloses limitations** — is honest about what the database doesn't know and can't verify
4. **Separates the database from advocacy** — makes clear this is an informational tool, not
   a prosecutorial one

Without this page, a casual user encountering an [UNVERIFIED] flag on a serious allegation has
no context for what that means. With it, they arrive at every other page already calibrated.

---

## Route & Navigation

- Route: `/about`
- Also add: `/sources` (source legend — detailed breakdown of every source abbreviation)
- Add both to the main navbar: `People | Timeline | Themes | Graph | About`
- The About link should be visually subdued (text-muted color) relative to the primary nav
  items — it's contextual, not a primary destination

---

## About Page: Full Content Spec

The page renders as a long-form document. Use a centered, readable column (max-width: 720px)
with generous line-height. This is the one page where prose density is appropriate.

Structure: 7 sections, each with an H2 heading. All sections visible on load with no
progressive disclosure — this is a document meant to be read, not explored.

---

### Section 1: What This Is

**Heading:** `What This Database Is`

**Content to render:**

> This is a structured, searchable reference database compiled from public records released
> under the Epstein Files Transparency Act (EFTA), court documents, congressional testimony,
> and published journalism. It is designed to help researchers, journalists, and members of
> the public navigate a large and fragmented body of material about Jeffrey Epstein, the
> people documented in his files, and the events surrounding his crimes and death.
>
> The database does not add original reporting. It synthesizes, organizes, and cross-links
> information that already exists in the public record. Every entry traces back to a
> documentable source.

---

### Section 2: The Source Material

**Heading:** `The Source Material`

**Content to render — explain each of the four pillars and then primary journalism sources:**

> **Pillar I — DOJ EFTA Releases**
> The Epstein Files Transparency Act was passed 427–1 in the House and unanimously in the
> Senate, and signed into law November 19, 2025. It required the Department of Justice to
> release all files related to Epstein within 30 days. The DOJ released approximately
> 3.5 million pages, 2,000 videos, and 180,000 images across 12 datasets between
> December 19, 2025 and January 30, 2026. The DOJ identified approximately 6 million
> qualifying pages before filtering — roughly half remain unreleased.
>
> **Pillar II — Court Records**
> Filings and testimony from United States v. Maxwell (S.D.N.Y.), Giuffre v. Maxwell
> (deposition transcripts unsealed January 2024), Doe v. Indyke, and related civil and
> criminal proceedings.
>
> **Pillar III — House Oversight Committee**
> 8,624 documents released by the House Oversight Committee as part of its parallel
> investigation, including FBI 302 interview summaries and internal DOJ communications
> about the 2007–2008 non-prosecution agreement.
>
> **Pillar IV — FBI Vault / FOIA**
> Pre-EFTA FOIA releases published by the FBI, covering 22 document batches — heavily
> redacted and partially superseded by the EFTA releases.
>
> **Published Journalism**
> Reporting from CBS News, NPR, The New York Times, The Wall Street Journal, CNN,
> Bloomberg, and others — cited where used, particularly for analysis and context that
> does not appear in the raw government documents.
>
> **Community Research Archives**
> JMail (jmail.world — full-text indexed search of 1,038,603 Epstein emails),
> rhowardstone/Epstein-research (GitHub — 100+ forensic analysis reports, 1,536-person
> entity registry, 2,096 mapped connections), the Epstein OSINT Database (Notion), and
> related community research tools. These sources are cited where used and clearly labeled.
> Community-derived findings that have not been corroborated by institutional sources
> are flagged [UNVERIFIED].

---

### Section 3: How Information Is Verified (The Reliability Spectrum)

**Heading:** `How to Read the Verification Flags`

**This is the most important section for user calibration. Render as explanatory prose +
a visual legend of the four flags used throughout the site.**

**Prose content:**

> Not all information in the public record carries equal weight. The source files underlying
> this database include sworn trial testimony, FBI interview summaries, anonymous tips,
> and Epstein's own self-serving emails — a spectrum from high to low reliability. Every
> entry in this database displays one or more of the following flags to help you assess
> what you're reading.

**Rendered flag legend (use the actual Badge/Banner components, not placeholder text):**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✓  Verified                                                            │
│  Information that appears in sworn testimony, trial exhibits, official  │
│  court findings, or is corroborated by multiple independent sources.    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  ⚠  Unverified                                                          │
│  Information flagged [UNVERIFIED] in source files — typically appearing │
│  in a single source, in anonymous FBI tips (NTOC reports), or in        │
│  Epstein's own emails. FBI 302 memos document allegations; they are     │
│  not conclusions. Many NTOC tips were flagged by agents themselves as   │
│  "not credible."                                                        │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  ⚡  Discrepancy                                                         │
│  Two or more sources give conflicting information on this point. Both   │
│  versions are presented. Discrepancies are documented in the source     │
│  files and preserved here rather than resolved editorially.            │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  ⚖  Contested                                                           │
│  A claim that a named individual has publicly disputed, denied, or that │
│  is the subject of active legal proceedings. The denial is included     │
│  alongside the original claim.                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Reliability spectrum visual (render as a horizontal gradient bar with labels):**

```
Low reliability ◄─────────────────────────────────────► High reliability
Anonymous tips    FBI 302 memos    Depositions    Trial testimony
(NTOC reports)    (allegations)    (sworn)        (cross-examined)
```

---

### Section 4: What This Database Does Not Do

**Heading:** `What This Database Does Not Do`

> **It does not determine guilt.** The presence of a person's name in Epstein's files — on
> a flight log, in an email, or in an FBI tip — does not constitute evidence of wrongdoing.
> Many people in this database were social acquaintances of Epstein's who had no documented
> knowledge of or involvement in his crimes. The database presents documented associations;
> it does not adjudicate them.
>
> **It does not add original journalism.** No independent reporting was conducted to produce
> this database. All information originates in the source documents listed above.
>
> **It does not represent the complete picture.** Approximately 3 million pages identified
> by the DOJ have not been released. The database reflects the public record as of its
> compilation date (February 2026). It is incomplete by definition.
>
> **It does not adjudicate ongoing legal proceedings.** Several matters documented here
> involve active litigation. Nothing in this database should be read as a legal conclusion.
>
> **It is not the primary source.** Wherever possible, original EFTA document numbers are
> provided so users can retrieve and read the underlying documents directly at
> justice.gov/epstein. This database is a navigational tool, not a replacement for the
> primary record.

---

### Section 5: A Note on Victims

**Heading:** `A Note on Victims`

> The people harmed by Jeffrey Epstein are at the center of this story. Their accounts —
> given in depositions, trial testimony, FBI interviews, and civil court filings — are the
> evidentiary foundation on which his conviction and Maxwell's conviction rest.
>
> Named victims (Jane Does #1–#19 in the 32-count draft indictment; Virginia Giuffre;
> Carolyn; and others) are treated in this database with particular care. Where victims
> have chosen to be identified publicly, their names appear. Where they have not, they
> are referred to by their legal designation. No victim information beyond what appears
> in public court records is included.
>
> The DOJ's handling of victim data in the EFTA releases was imperfect: blanket visual
> redactions were applied inconsistently, and at least 31 victim identities were
> inadvertently exposed in the releases. This database does not reproduce any information
> that would identify a victim who has not chosen public identification.

---

### Section 6: Known Limitations of the Source Data

**Heading:** `Known Limitations of the Source Data`

> Users should be aware of several documented issues with the underlying source material:
>
> **Dataset 9 pagination anomaly.** The DOJ's pagination for Dataset 9 operates as an
> "infinite loop" — pages beyond approximately 13,000 contain no new documents. Community
> researchers have flagged the dataset as incomplete at source.
>
> **Post-publication redactions.** The Democracy Defenders Fund identified that the DOJ
> quietly altered previously released documents after initial publication, adding additional
> redactions after January 15, 2026.
>
> **Faulty redactions.** Dataset 9 contains approximately 91,646 "bad overlays" — redactions
> where underlying text is recoverable by copy-pasting. Some content in this database was
> discovered through this method; such content is noted in its source citations.
>
> **Removed documents.** Several files were removed from the DOJ website after initial
> publication, including EFTA00000468 (a photo of Trump, Epstein, and Maxwell), an
> FBI-compiled list of tips (EFTA01660679), and three large video files totaling
> approximately 15 GB. Removed documents are noted where relevant.
>
> **Epstein's emails as a source.** Approximately 1,038,603 emails from Epstein's accounts
> (jeevacation@gmail.com and jeeproject@yahoo.com) are publicly searchable via JMail.
> These emails are self-serving statements by a convicted sex offender and should be
> evaluated accordingly. Email content is used in this database but always flagged
> with its source.
>
> **FBI NTOC tips.** Many of the most dramatic allegations in the EFTA releases originate
> in FBI National Threat Operations Center tip reports — anonymous public submissions that
> agents themselves frequently flagged as "not credible" or "sensationalist." These are
> distinguished from investigative findings in this database and carry the [UNVERIFIED] flag.

---

### Section 7: Compilation & Maintenance

**Heading:** `About This Compilation`

> This database was compiled in February 2026 from nine underlying research files
> synthesizing the complete EFTA release, court records, congressional materials, and
> published journalism available through that date.
>
> **Compilation date:** February 25, 2026
> **Source pages synthesized:** ~3.5 million (DOJ) + court records + congressional documents
> **People documented:** 55+
> **Timeline events:** 130+
> **Thematic investigations:** 17
>
> The database reflects the public record as of its compilation date. It has not been
> updated to reflect developments after February 2026. For current developments, consult
> primary news sources.
>
> This is a non-commercial informational resource. All source documents referenced are
> publicly available. EFTA documents link directly to justice.gov/epstein, the sole
> legally authorized distribution point.

---

## The Sources Page (`/sources`)

A companion reference page listing every source abbreviation used throughout the site.
Rendered as a clean two-column table.

**Route:** `/sources`  
**Nav placement:** Linked from the About page ("See the full source legend →") and from
the footer. Not in the primary navbar.

**Content:**

| Abbreviation | Full Source | Type | Notes |
|---|---|---|---|
| DOJ | U.S. Department of Justice EFTA releases (Datasets 1–12) | Government | justice.gov/epstein — primary source |
| FBI | FBI 302 interview summaries and Vault FOIA releases | Government | 302 memos document allegations, not conclusions |
| HO | House Oversight Committee (8,624 documents) | Congressional | |
| SJ | Senate Judiciary Committee | Congressional | |
| CBS | CBS News investigative reporting | Journalism | |
| NPR | NPR reporting | Journalism | |
| NYT | The New York Times | Journalism | |
| WSJ | The Wall Street Journal | Journalism | |
| CNN | CNN reporting | Journalism | |
| Bloomberg | Bloomberg reporting | Journalism | |
| JMail | jmail.world — 1,038,603 Epstein emails indexed | Community | Emails are self-serving statements |
| GH | rhowardstone/Epstein-research (GitHub) | Community | 100+ forensic reports, 1,536-person entity registry |
| OSINT | Epstein OSINT Database (Notion); epsteinexposed.com; community research | Community | Verify against primary sources |
| Maxwell-trial | United States v. Maxwell, S.D.N.Y., trial exhibits and testimony | Court | High reliability — cross-examined testimony |
| Giuffre-deposition | Giuffre v. Maxwell deposition transcripts (unsealed Jan 2024) | Court | Sworn testimony |
| Palm-Beach-PD | Palm Beach Police Department investigation records (2005–2006) | Law enforcement | |

**Below the table, add a note:**

> Source reliability varies significantly. Court testimony (cross-examined, under oath) is
> the highest-reliability source in this database. Anonymous FBI tip reports (NTOC) are the
> lowest. Community research tools are valuable for navigation and discovery but should be
> cross-referenced against primary DOJ documents before citation.

---

## Site-Wide Editorial Framing Integration Points

### 1. The Disclaimer Banner (site-wide)
Described in Guide 2. The banner links to `/about` rather than simply being dismissible:
```
[Learn more about this database →]   [Dismiss for this session ✕]
```

### 2. Inline verification flag tooltips
Throughout the site, wherever an [UNVERIFIED], [DISCREPANCY], or [CONTESTED] badge appears,
it should have a `title` tooltip (and a `?` icon) that shows a one-line explanation and
links to `/about#verification-flags`. This means a user who encounters their first
[UNVERIFIED] flag anywhere in the site can immediately understand what it means without
navigating away.

Example tooltip text:
- UNVERIFIED: "Single-source claim not independently corroborated. Tap to learn more."
- DISCREPANCY: "Sources conflict on this point. Both versions are shown. Tap to learn more."
- CONTESTED: "The named individual has publicly disputed this claim. Tap to learn more."

### 3. Source tag tooltips
Every [DOJ], [CBS], [GH] etc. source tag throughout the site should have a tooltip showing
the full source name. The tag is also a link to the relevant entry in `/sources`.

### 4. Person detail pages — legal status callout
For any person whose `currentStatus` includes "not charged" or "immunity grantee," add a
small callout box at the top of their profile:

```
┌────────────────────────────────────────────────────────────────────────┐
│ ℹ  Legal status note                                                   │
│ [Name] was not charged in connection with the Epstein investigation.   │
│ Their presence in this database reflects documented associations in    │
│ the public record, not a finding of wrongdoing.                       │
└────────────────────────────────────────────────────────────────────────┘
```

Use a neutral blue, not amber (amber = warning; this is informational, not caution).

### 5. Footer — permanent links
The footer should permanently display (on every page):
- Link to `/about`
- Link to `/sources`
- One-line disclaimer: "Informational resource compiled from public records. Not legal documentation."
- Compilation date: "Data compiled February 2026"

---

## UX Design for the About Page

### Layout
- Centered single column, max-width: 720px, auto margins
- Generous padding: px-6 py-16 on desktop, px-4 py-10 on mobile
- No sidebars, no filters, no interactive elements beyond the nav
- Section anchors: each H2 gets an `id` attribute for deep-linking (e.g. `#verification-flags`)

### Typography
- H1 (page title): text-3xl, font-semibold, text-primary
- H2 (section headings): text-xl, font-semibold, text-primary, mt-12 mb-4
- Body text: text-sm, leading-relaxed (line-height: 1.75), text-secondary
- This is the ONE page where text-secondary for body is appropriate — it creates the right
  quiet, documentary register

### Section dividers
- Thin horizontal rules (border-t border-surface-border) between sections
- No decorative elements, no icons in headings on this page

### Flag legend (Section 3)
- Render the four verification flags using the actual `UnverifiedBanner` / `DiscrepancyFlag`
  components from the component library (see Guide 2)
- They appear here in a "legend" context, not attached to real data
- Each has a short descriptive paragraph below it

### Reliability spectrum bar
A simple HTML/CSS horizontal bar:
- Full-width of the content column
- Four labeled segments from left (low reliability) to right (high reliability)
- Color: gradient from amber (left) to green (right)
- Label below each segment in text-xs, text-muted
- This is purely CSS — no D3 needed

### No progressive disclosure on this page
Unlike the rest of the site, the About page should show all content immediately. Users arrive
here specifically to read it. Accordion/expand patterns would be counterproductive.

---

## Page Data Requirements

The About page is **fully static** — no data files needed. All content is hardcoded in the
page component. The Sources page (`/sources`) is similarly static.

```typescript
// src/app/about/page.tsx
// No data imports — fully static page
export default function AboutPage() {
  return (
    <main className="max-w-[720px] mx-auto px-6 py-16">
      {/* Section 1: What This Is */}
      {/* Section 2: The Source Material */}
      {/* Section 3: Verification Flags — uses actual Badge/Banner components */}
      {/* Section 4: What This Does Not Do */}
      {/* Section 5: A Note on Victims */}
      {/* Section 6: Known Limitations */}
      {/* Section 7: Compilation & Maintenance */}
    </main>
  );
}
```

---

## Build Order Note

The About and Sources pages should be built **first** — before any data-driven views.
They are:
- The simplest pages to build (no data dependencies)
- The best way to establish the shared component library (Badge, Banner, SourceTag)
  in a low-stakes context before those components are used everywhere
- A good smoke test for the overall layout, navbar, and footer

**Recommended build sequence:**
1. Project setup, dependencies, Tailwind config (Guide 1)
2. Root layout: Navbar + Footer (Guide 2)
3. `/about` and `/sources` pages ← **start here for content pages**
4. Run data parsing scripts (Guide 3)
5. `/people` directory and person detail pages
6. `/timeline` page
7. `/themes` page
8. `/graph` page
9. Global search + `/search` results page
