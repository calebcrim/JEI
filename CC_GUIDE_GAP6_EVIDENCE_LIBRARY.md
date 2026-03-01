# CC_GUIDE — Gap 6: Primary Source Library (`/evidence`)
## Epstein Files Research Database — UX Improvement Series

**Purpose:** Build a dedicated `/evidence` page — a primary source library organized by document
type rather than topic. Users who distrust the synthesis and want to go straight to documents can
land here, browse by category (court filings, EFTA releases, flight logs, financial records, etc.),
and reach original sources in one click. This is both a research tool and a credibility signal:
every claim on the site traces to something real.

**Estimated implementation time:** 4–5 hours  
**Risk to existing functionality:** None — entirely new route. The footer already links to
`/sources`; this guide creates a separate `/evidence` route with a different purpose (document
library vs. methodology explanation).  
**Build verification:** `npm run build` after each phase. No parse scripts needed — the page
is fully static.

---

## What's Being Added and Why

**Current state:** The site has source tags (CBS, DOJ, GH, etc.) on individual events and
theme sections. There is no page where a user can browse the underlying documents. Users who
want to verify a claim must know what they're looking for — there's no map of available evidence.

**After this guide:** `/evidence` is a searchable, filterable catalog of ~60 primary source
entries grouped into 8 document categories. Each entry has a title, a 1–3 sentence description
of what the document contains, a direct link, a type badge, and where relevant a verification
note. A sidebar filters by category. A search bar filters by keyword within the loaded set.
No backend is needed — the full catalog is a hardcoded static data file.

The gap analysis described this as: "A primary source library... organized not by topic but by
document type — DOJ EFTA releases, court filings, financial records, flight logs, FBI 302s —
with brief descriptions and direct links." That is precisely what this builds.

---

## Phase 0: Route Check

Verify that `src/app/sources/page.tsx` exists and is a separate methodology/about-style page.
The new page goes to `src/app/evidence/page.tsx`. If `/sources` does not yet exist, note it but
do not create it as part of this guide.

Also confirm the Navbar links. After this guide is complete, add "Evidence" to the navbar after
"Themes" and before any other links. The exact Navbar file is `src/components/layout/Navbar.tsx`.

---

## Phase 1: Create `src/data/evidence-library.ts`

This file contains all document entries as a static array. Every URL has been verified from
research source files. Claude Code must not modify entry prose — render it exactly as written.

```typescript
// src/data/evidence-library.ts
// Primary source library for the /evidence page.
// All entries are static. URLs were verified from source research files as of March 2026.
// Do not modify entry content — render exactly as written.

export type EvidenceCategory =
  | 'efta-portals'
  | 'efta-documents'
  | 'court-filings'
  | 'flight-logs'
  | 'fbi-documents'
  | 'financial-records'
  | 'community-tools'
  | 'congressional';

export type EvidenceType =
  | 'portal'        // access point / index page
  | 'pdf'           // direct PDF document
  | 'video'         // video file
  | 'database'      // searchable database or tool
  | 'transcript'    // hearing or deposition transcript
  | 'filing'        // court filing
  | 'dataset'       // bulk dataset download
  | 'article';      // investigative journalism (primary source quality)

export interface EvidenceEntry {
  id: string;
  category: EvidenceCategory;
  type: EvidenceType;
  title: string;
  description: string;          // 1–3 sentences: what is it, what's in it, why it matters
  url: string;
  date?: string;                // ISO or readable date of the document / release
  efta?: string;                // EFTA number if applicable
  verificationNote?: string;    // caveat about reliability or completeness
  relatedThemeIds?: string[];   // optional cross-links to themes
  isHighlighted?: boolean;      // pin to top of category
  isMissing?: boolean;          // document referenced but not publicly available
}

export const CATEGORY_LABELS: Record<EvidenceCategory, string> = {
  'efta-portals':     'DOJ EFTA Portals',
  'efta-documents':   'Key EFTA Documents',
  'court-filings':    'Court Filings & Legal Records',
  'flight-logs':      'Flight Logs & Travel Records',
  'fbi-documents':    'FBI Documents',
  'financial-records':'Financial Records',
  'community-tools':  'Community Research Tools',
  'congressional':    'Congressional Records',
};

export const CATEGORY_DESCRIPTIONS: Record<EvidenceCategory, string> = {
  'efta-portals':
    'The Department of Justice\'s official Epstein Files release pages, search tools, and dataset download portals created under the Epstein Files Transparency Act.',
  'efta-documents':
    'Specific individually-numbered EFTA documents flagged by researchers as especially significant. EFTA numbers are unique document identifiers from the DOJ release.',
  'court-filings':
    'Federal court filings, plea agreements, indictments, civil case records, and appellate decisions from the main Epstein-related proceedings.',
  'flight-logs':
    'Flight manifests, FAA records, and customs documentation for Epstein\'s aircraft. Multiple versions exist with different date ranges and sources.',
  'fbi-documents':
    'Pre-EFTA FBI document releases via FOIA, plus FBI 302 interview summaries and investigation records from the EFTA release datasets.',
  'financial-records':
    'Bank records, wire transfer documentation, trust agreements, and financial institution disclosures from DOJ releases, civil litigation, and regulatory proceedings.',
  'community-tools':
    'Researcher-built tools that index, search, and analyze the EFTA releases and related documents. These tools have made the 3.5 million page corpus navigable.',
  'congressional':
    'Congressional hearing transcripts, committee releases, deposition records, and legislative documents from House and Senate investigations.',
};

export const evidenceLibrary: EvidenceEntry[] = [

  // ═══════════════════════════════════════════════════════════════════════
  // CATEGORY: DOJ EFTA PORTALS
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'doj-efta-main',
    category: 'efta-portals',
    type: 'portal',
    title: 'DOJ Epstein Files — Main Portal',
    description: 'The Department of Justice\'s official landing page for all Epstein Files Transparency Act releases, including navigation to disclosures, court records, and the DOJ search tool. Released in batches between December 19, 2025 and January 30, 2026.',
    url: 'https://www.justice.gov/epstein',
    date: 'December 19, 2025',
    isHighlighted: true,
    relatedThemeIds: ['efta-release-framework'],
  },
  {
    id: 'doj-efta-disclosures',
    category: 'efta-portals',
    type: 'portal',
    title: 'DOJ Disclosures Index',
    description: 'The DOJ\'s organized index of all 12 dataset releases, with file counts, size information, and release dates. Datasets 1–7 were released December 19, 2025; Datasets 8–12 on January 30, 2026.',
    url: 'https://www.justice.gov/epstein/doj-disclosures',
    date: 'December 19, 2025',
    relatedThemeIds: ['efta-release-framework'],
  },
  {
    id: 'doj-efta-search',
    category: 'efta-portals',
    type: 'portal',
    title: 'DOJ EFTA Document Search Tool',
    description: 'The official DOJ full-text search interface for the EFTA releases. Allows keyword search across document text, though researchers have noted limitations compared to community-built tools.',
    url: 'https://www.justice.gov/epstein/search',
    relatedThemeIds: ['efta-release-framework', 'community-research-tools'],
  },
  {
    id: 'doj-court-records',
    category: 'efta-portals',
    type: 'portal',
    title: 'DOJ Court Records Portal',
    description: 'The DOJ\'s organized collection of court filings, civil case records, and legal proceedings documents released under EFTA. Separate from the main dataset releases.',
    url: 'https://www.justice.gov/epstein/court-records',
    relatedThemeIds: ['acosta-plea-legal-history', 'co-conspirators-immunity'],
  },
  {
    id: 'doj-dataset-12-download',
    category: 'efta-portals',
    type: 'dataset',
    title: 'Dataset 12 — Direct Download',
    description: 'The 12th and final EFTA dataset (114 MB, 154 files), designated as a supplemental late-production set covering EFTA numbers up to approximately EFTA02731785. The smallest dataset; the most recent production.',
    url: 'https://www.justice.gov/epstein/files/DataSet%2012.zip',
    date: 'January 30, 2026',
    relatedThemeIds: ['efta-release-framework'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CATEGORY: KEY EFTA DOCUMENTS
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'efta-butterfly-trust',
    category: 'efta-documents',
    type: 'pdf',
    title: 'Butterfly Trust / JPMorgan Account Chart (EFTA00029805)',
    description: 'An email containing a chart showing Epstein\'s Butterfly Trust account at JPMorgan Chase. One of the most-cited financial documents in the release; provides direct evidence of the trust structure used to manage Epstein\'s assets.',
    url: 'https://www.justice.gov/epstein/files/DataSet%208/EFTA00029805.pdf',
    efta: 'EFTA00029805',
    date: 'December 22, 2025',
    isHighlighted: true,
    relatedThemeIds: ['financial-crimes'],
  },
  {
    id: 'efta-maxwell-trust-beneficiary',
    category: 'efta-documents',
    type: 'pdf',
    title: 'Trust Agreement — Maxwell as Beneficiary (EFTA01296151)',
    description: 'A trust agreement naming Ghislaine Maxwell as a beneficiary. Recovered via faulty redaction (copy-paste exploit) from Dataset 9\'s 91,646 "bad overlay" documents. This is the primary documentary basis for Maxwell\'s financial relationship to Epstein\'s estate.',
    url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA01296151.pdf',
    efta: 'EFTA01296151',
    verificationNote: 'Recovered via faulty redaction in Dataset 9. The underlying text is extractable but the overlay was intended to redact it.',
    relatedThemeIds: ['maxwell-role-legal', 'financial-crimes'],
  },
  {
    id: 'efta-brunel-maxwell-trust',
    category: 'efta-documents',
    type: 'pdf',
    title: 'Trust Agreement — Brunel and Maxwell as Beneficiaries (EFTA01297516)',
    description: 'A trust agreement naming both Jean-Luc Brunel and Ghislaine Maxwell as beneficiaries. Together with EFTA01296151, this document establishes the financial linkages between Epstein\'s core operational figures through his estate planning.',
    url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA01297516.pdf',
    efta: 'EFTA01297516',
    relatedThemeIds: ['financial-crimes', 'co-conspirators-immunity'],
  },
  {
    id: 'efta-wire-transfer-records',
    category: 'efta-documents',
    type: 'pdf',
    title: 'MoneyGram Wire Transfer Records (EFTA01265800)',
    description: 'Wire transfer records described by community researchers as including identifiable names. Part of the financial records in Dataset 9\'s late-range documents.',
    url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA01265800.pdf',
    efta: 'EFTA01265800',
    relatedThemeIds: ['financial-crimes'],
  },
  {
    id: 'efta-mcc-financial',
    category: 'efta-documents',
    type: 'pdf',
    title: 'Metropolitan Correctional Center Financial Records (EFTA01265978)',
    description: 'MCC New York financial records from the period of Epstein\'s 2019 detention. These records are part of the MCC administrative documentation released in Dataset 9.',
    url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA01265978.pdf',
    efta: 'EFTA01265978',
    relatedThemeIds: ['epsteins-death-mcc'],
  },
  {
    id: 'efta-tecs-customs',
    category: 'efta-documents',
    type: 'pdf',
    title: 'TECS II Customs Processing Documents (EFTA01683110–01683185)',
    description: 'Approximately 75 Treasury Enforcement Communications System (TECS II) customs processing documents covering Epstein aircraft passengers. Among the most comprehensive records of who traveled with Epstein through customs checkpoints.',
    url: 'https://www.justice.gov/epstein/files/DataSet%2010/EFTA01683110.pdf',
    efta: 'EFTA01683110',
    verificationNote: 'Range spans EFTA01683110–01683185; approximately 75 documents. Link goes to first in range.',
    relatedThemeIds: ['trafficking-operation', 'financial-crimes'],
    isHighlighted: true,
  },
  {
    id: 'efta-fbi-chs-mossad',
    category: 'efta-documents',
    type: 'pdf',
    title: 'FBI Confidential Human Source Report — Intelligence Allegations (EFTA00090314)',
    description: 'An FBI FD-1023 format Confidential Human Source report in which an informant claims Epstein was "a co-opted Mossad agent" trained as a spy under Ehud Barak. Also alleges Alan Dershowitz was "co-opted by Mossad." These are unverified informant claims, not corroborated intelligence findings.',
    url: 'https://www.justice.gov/epstein/files/DataSet%209/EFTA00090314.pdf',
    efta: 'EFTA00090314',
    verificationNote: 'Unverified informant claims (FD-1023 format). This document records what an informant alleged — it is not a finding of fact or an intelligence assessment.',
    relatedThemeIds: ['intelligence-connections'],
  },
  {
    id: 'efta-victim-interview-clinton-trump',
    category: 'efta-documents',
    type: 'pdf',
    title: 'FBI Victim Interview — Clinton and Trump References (EFTA00020493)',
    description: 'FBI case file document (Case ID 50D-NY-3027571) containing a victim interview that mentions both Clinton and Trump. Part of the FBI investigation records from Dataset 1–7.',
    url: 'https://www.justice.gov/epstein/files/DataSet%201/EFTA00020493.pdf',
    efta: 'EFTA00020493',
    verificationNote: 'Victim testimony; corroborated against other records in some particulars but not all.',
    relatedThemeIds: ['trafficking-operation', 'trump-epstein-connections'],
  },
  {
    id: 'efta-removed-restored',
    category: 'efta-documents',
    type: 'pdf',
    title: 'Trump-Epstein-Maxwell Photo (EFTA00000468)',
    description: 'One of 15–16 documents removed from the DOJ release on December 20, 2025, then restored after public outcry the following day. CBS News identified the removal by comparing day-one and day-two releases. The Trump-Epstein-Maxwell photograph was among the documents in this category.',
    url: 'https://www.justice.gov/epstein/files/DataSet%201/EFTA00000468.pdf',
    efta: 'EFTA00000468',
    date: 'December 19, 2025',
    verificationNote: 'Removed and restored December 20–21, 2025. Currently available but previously subject to post-publication removal.',
    relatedThemeIds: ['efta-release-framework', 'trump-epstein-connections'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CATEGORY: COURT FILINGS & LEGAL RECORDS
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'maxwell-trial-flight-logs',
    category: 'court-filings',
    type: 'pdf',
    title: 'Maxwell Trial Flight Logs — 118 Pages (GX 662)',
    description: 'The 118-page handwritten flight logs signed by pilot David Rodgers, entered as Government Exhibit 662 in the U.S. v. Maxwell trial. These logs cover 1991–2006 and are the most authoritative flight record source, authenticated through trial proceedings. They show dates, aircraft, destinations, and passengers.',
    url: 'https://www.documentcloud.org/documents/21165424-epstein-flight-logs-released-in-usa-vs-maxwell/',
    date: 'December 2021',
    isHighlighted: true,
    relatedThemeIds: ['trafficking-operation'],
  },
  {
    id: 'giuffre-maxwell-unsealing-404',
    category: 'court-filings',
    type: 'portal',
    title: 'Giuffre v. Maxwell — January 2024 Unsealing (404 Media)',
    description: '404 Media\'s organized download page for the January 3–9, 2024 unsealing of ~4,500 pages from Giuffre v. Maxwell (S.D.N.Y. No. 15-cv-07433). The unsealing produced approximately 150 names and is the most-read primary source from the civil litigation.',
    url: 'https://www.404media.co/download-the-jeffrey-epstein-documents/',
    date: 'January 2024',
    isHighlighted: true,
    relatedThemeIds: ['maxwell-role-legal', 'co-conspirators-immunity'],
  },
  {
    id: 'cbp-customs-records',
    category: 'court-filings',
    type: 'pdf',
    title: 'CBP Customs and Border Protection Records',
    description: 'U.S. Customs and Border Protection records for Epstein\'s aircraft and passengers, released via FOIA. These records complement the Maxwell trial flight logs and cover customs entry events at U.S. border crossings.',
    url: 'https://www.cbp.gov/sites/default/files/assets/documents/2023-Mar/Jeffrey%20Epstein%20records%2002.pdf',
    date: 'March 2023',
    relatedThemeIds: ['trafficking-operation'],
  },
  {
    id: 'flight-logs-gawker-73',
    category: 'court-filings',
    type: 'pdf',
    title: 'Epstein Flight Manifests — 73-Page Version (Epstein v. Edwards)',
    description: 'The earlier 73-page flight manifest version, surfaced via Gawker in 2015 from the Epstein v. Edwards civil litigation. Covers a different date range than the Maxwell trial logs and includes passenger names omitted from other versions.',
    url: 'https://www.documentcloud.org/documents/1507315-epstein-flight-manifests/',
    date: '2015',
    relatedThemeIds: ['trafficking-operation'],
  },
  {
    id: 'internet-archive-flight-logs-black-book',
    category: 'court-filings',
    type: 'portal',
    title: 'Internet Archive — Combined Flight Logs and Black Book',
    description: 'Internet Archive collection combining flight log documents and Epstein\'s black address book (the Alfredo Rodriguez copy). The black book contains ~1,000 contacts and was the basis for the FBI sting of Rodriguez in 2009.',
    url: 'https://archive.org/details/epstein-logs-book',
    relatedThemeIds: ['trafficking-operation', 'political-intelligence-network'],
  },
  {
    id: 'legal-proceedings-npa',
    category: 'court-filings',
    type: 'filing',
    title: 'Non-Prosecution Agreement — September 2007',
    description: 'The 2007 Non-Prosecution Agreement negotiated by Alex Acosta\'s office in the Southern District of Florida. This document granted Epstein and four named co-conspirators federal immunity and has been at the center of the legal controversy for 17 years. Now available through the DOJ Court Records portal.',
    url: 'https://www.justice.gov/epstein/court-records',
    date: 'September 24, 2007',
    isHighlighted: true,
    verificationNote: 'Access via DOJ Court Records portal. Direct link may change as DOJ reorganizes its release.',
    relatedThemeIds: ['acosta-plea-legal-history', 'co-conspirators-immunity'],
  },
  {
    id: 'florida-grand-jury-transcripts',
    category: 'court-filings',
    type: 'pdf',
    title: 'Florida State Grand Jury Transcripts (July 2024)',
    description: 'Florida state grand jury transcripts released July 1, 2024 under HB 117 exemption. Contains testimony from the 2006–2007 Florida investigation that preceded the federal NPA. These were subsequently supplemented by the federal grand jury transcript release of December 2025.',
    url: 'https://www.justice.gov/epstein/court-records',
    date: 'July 1, 2024',
    relatedThemeIds: ['acosta-plea-legal-history', 'trafficking-operation'],
  },
  {
    id: 'sdny-epstein-indictment-2019',
    category: 'court-filings',
    type: 'filing',
    title: 'SDNY Indictment — U.S. v. Epstein (July 2019)',
    description: 'The July 2019 Southern District of New York indictment charging Epstein with sex trafficking conspiracy. This prosecution was independent of the 2008 NPA, which Acosta had negotiated in the Southern District of Florida. Available through PACER and DOJ court records.',
    url: 'https://www.justice.gov/epstein/court-records',
    date: 'July 6, 2019',
    relatedThemeIds: ['acosta-plea-legal-history', 'epsteins-death-mcc'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CATEGORY: FBI DOCUMENTS
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'fbi-vault-epstein',
    category: 'fbi-documents',
    type: 'portal',
    title: 'FBI Vault — Jeffrey Epstein (22 FOIA Batches)',
    description: 'The FBI\'s pre-EFTA FOIA release of 22 batches of Epstein-related documents. These are older releases, heavily redacted, predating the EFTA production. They include FBI 302 interview summaries, case file documents, and investigation records. The EFTA Datasets 1–7 substantially overlap with and expand on this material.',
    url: 'https://vault.fbi.gov/jeffrey-epstein',
    isHighlighted: true,
    verificationNote: 'Pre-EFTA FOIA releases are more heavily redacted than the EFTA Datasets 1–7, which cover overlapping material with fewer redactions.',
    relatedThemeIds: ['trafficking-operation', 'acosta-plea-legal-history'],
  },
  {
    id: 'efta-datasets-1-7-fbi302',
    category: 'fbi-documents',
    type: 'portal',
    title: 'EFTA Datasets 1–7 — FBI 302s and Palm Beach Investigation Records',
    description: 'The first tranche of EFTA releases (December 19, 2025) contained 4,085 PDFs covering FBI 302 interview summaries and Palm Beach Police Department investigation records from 2005–2008. These are the core evidentiary records of the original investigation.',
    url: 'https://www.justice.gov/epstein/doj-disclosures',
    date: 'December 19, 2025',
    relatedThemeIds: ['trafficking-operation', 'acosta-plea-legal-history'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CATEGORY: FINANCIAL RECORDS
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'efta-ds11-financial-ledgers',
    category: 'financial-records',
    type: 'portal',
    title: 'EFTA Dataset 11 — Financial Ledgers and Flight Manifests',
    description: 'Dataset 11 (~26 GB, ~331,655 files) contains financial ledgers, flight manifests, Little St. James logbooks, boat trip logs, Maxwell financial records, and property records. The richest single dataset for financial and operational research; only ~15% analyzed as of February 2026.',
    url: 'https://www.justice.gov/epstein/doj-disclosures',
    date: 'January 30, 2026',
    isHighlighted: true,
    verificationNote: 'Dataset 11 was temporarily removed from DOJ servers in February 2026 alongside Datasets 9 and 10. Community researchers preserved copies via torrent before removal. DOJ subsequently restored the datasets.',
    relatedThemeIds: ['financial-crimes', 'trafficking-operation'],
  },
  {
    id: 'jpmorgan-settlement-docs',
    category: 'financial-records',
    type: 'filing',
    title: 'JPMorgan Chase Civil Settlement ($290M)',
    description: 'In 2023 JPMorgan Chase settled civil claims that the bank facilitated Epstein\'s sex trafficking by maintaining his accounts despite internal warnings from compliance analysts. The $290 million settlement to victims is the largest financial accountability outcome of any civil proceeding in the case.',
    url: 'https://www.justice.gov/epstein/court-records',
    date: '2023',
    relatedThemeIds: ['financial-crimes', 'co-conspirators-immunity'],
  },
  {
    id: 'deutsche-bank-settlement',
    category: 'financial-records',
    type: 'filing',
    title: 'Deutsche Bank Civil Settlement',
    description: 'Deutsche Bank settled civil claims related to maintaining Epstein accounts after the 2008 conviction. The settlement amount was not disclosed in public court filings as of the research compilation date.',
    url: 'https://www.justice.gov/epstein/court-records',
    date: '2023',
    verificationNote: 'Settlement amount not publicly confirmed in available filings.',
    relatedThemeIds: ['financial-crimes'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CATEGORY: COMMUNITY RESEARCH TOOLS
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'jmail-world',
    category: 'community-tools',
    type: 'database',
    title: 'JMail.world — Epstein Email Archive',
    description: 'A Gmail-clone interface indexing 1,038,603 emails from Epstein\'s jeevacation@gmail.com and jeeproject@yahoo.com accounts, plus 1,412,250 total EFTA files. Created by Riley Walz and Luke Igel. Sub-tools include JPhotos, JFlights, JAmazon, JeffTube (1,000+ DOJ-released videos), JDrive, Jwiki, and Jemini (AI cross-document search). As of February 2026: 25+ million unique visitors, 450+ million page views.',
    url: 'https://jmail.world',
    isHighlighted: true,
    relatedThemeIds: ['community-research-tools', 'efta-release-framework'],
  },
  {
    id: 'epstein-exposed',
    category: 'community-tools',
    type: 'database',
    title: 'EpsteinExposed.com — Cross-Referenced Document Database',
    description: 'Semantic search across 264,000+ documents using pgvector embeddings. Indexes 1,122,307+ documents, 1,708 flights, and 1,463 persons with interactive network graphs. Built to cross-reference documents that mention the same names or events.',
    url: 'https://www.epsteinexposed.com',
    isHighlighted: true,
    relatedThemeIds: ['community-research-tools'],
  },
  {
    id: 'rhowardstone-github',
    category: 'community-tools',
    type: 'database',
    title: 'rhowardstone/Epstein-research — Forensic Analysis Repository',
    description: 'Over 100 forensic analysis reports; a 1,536-person entity registry; a knowledge graph of 524 entities and 2,096 mapped connections; full-text indexed database of all 12 datasets; complete media catalog of 419 MCC surveillance videos; 2,587,102 redaction records; 1,530 audio/video transcripts; and a Congressional Reading Guide. The most comprehensive single research index.',
    url: 'https://github.com/rhowardstone/Epstein-research',
    isHighlighted: true,
    relatedThemeIds: ['community-research-tools', 'efta-release-framework'],
  },
  {
    id: 'yung-megafone-github',
    category: 'community-tools',
    type: 'database',
    title: 'yung-megafone/Epstein-Files — Archive with SHA256 Verification',
    description: 'Archive index with torrent magnet links, SHA256 hashes, and community mirrors for all 12 datasets. This repository documented the DOJ\'s removal of Datasets 9–11 in February 2026 and coordinated the community scramble to preserve them before the takedown was complete. The SHA256 hashes allow independent verification of document authenticity.',
    url: 'https://github.com/yung-megafone/Epstein-Files',
    relatedThemeIds: ['community-research-tools', 'efta-release-framework'],
  },
  {
    id: 'paulgp-search-scripts',
    category: 'community-tools',
    type: 'database',
    title: 'paulgp/epstein-document-search — Local Search Infrastructure',
    description: 'Python scripts for downloading, splitting, and indexing all EFTA PDFs into a local Meilisearch instance. Allows researchers to run their own full-text search without depending on DOJ or community tools. Includes bulk download utilities and PDF processing pipelines.',
    url: 'https://github.com/paulgp/epstein-document-search',
    relatedThemeIds: ['community-research-tools'],
  },
  {
    id: 'epstein-osint-database',
    category: 'community-tools',
    type: 'database',
    title: 'Epstein OSINT Database (Notion)',
    description: 'Structured Notion database with categories for People (with role tags), Organizations, Flight Logs, Properties, and Docket Entries. Includes profiles for financial executives, compliance analysts, and figures from modeling networks not covered in other databases. JavaScript-rendered; no static export available.',
    url: 'https://epstein-osint-database.notion.site',
    verificationNote: 'JavaScript-rendered; may require disabling ad blockers. No static export — data is accessible only through the live Notion interface.',
    relatedThemeIds: ['community-research-tools'],
  },
  {
    id: 'tommy-carstensen-videos',
    category: 'community-tools',
    type: 'portal',
    title: 'Tommy Carstensen — DOJ Video Gallery with AI Transcriptions',
    description: 'All DOJ-released video files indexed and presented with AI-generated transcriptions. The EFTA release included over 1,000 videos; the Carstensen gallery makes them searchable and provides timestamps. Includes the MCC surveillance video footage.',
    url: 'https://tommycarstensen.com/epstein/video_gallery.html',
    relatedThemeIds: ['community-research-tools', 'epsteins-death-mcc'],
  },
  {
    id: 'economist-alarm-index',
    category: 'community-tools',
    type: 'article',
    title: 'The Economist — LLM "Alarm Index" of 1.4M Emails',
    description: 'The Economist partnered with the JMail team to produce an LLM-scored "alarm index" of all 1.4 million emails in the archive, flagging the most disturbing threads. This is an example of institutional journalism using community-built infrastructure to do systematic analysis at scale.',
    url: 'https://www.economist.com',
    verificationNote: 'Direct article URL not available in research sources; search The Economist for "Epstein email alarm index."',
    relatedThemeIds: ['community-research-tools', 'media-congressional'],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // CATEGORY: CONGRESSIONAL RECORDS
  // ═══════════════════════════════════════════════════════════════════════

  {
    id: 'acosta-transcript-2025',
    category: 'congressional',
    type: 'transcript',
    title: 'Acosta House Oversight Interview Transcript — September 2025',
    description: 'The 172-page transcript of Alex Acosta\'s closed-door interview before the House Oversight Committee (September 19, 2025), released October 17, 2025. Acosta was questioned about the 2008 NPA, the "belonged to intelligence" statement, and the non-notification of victims. Among the most significant congressional records of the investigation.',
    url: 'https://oversight.house.gov',
    date: 'October 17, 2025',
    isHighlighted: true,
    verificationNote: 'Access via House Oversight Committee website. Direct URL subject to change.',
    relatedThemeIds: ['acosta-plea-legal-history', 'intelligence-connections'],
  },
  {
    id: 'barr-deposition-transcript',
    category: 'congressional',
    type: 'transcript',
    title: 'AG Barr Deposition Transcript — September 2025',
    description: 'The deposition transcript of former Attorney General William Barr, released September 16, 2025. Barr served as AG during Epstein\'s 2019 arrest and death; his father Donald Barr hired Epstein at Dalton School in 1974. The deposition covered Barr\'s decision to call the death a suicide and close the primary prosecution.',
    url: 'https://oversight.house.gov',
    date: 'September 16, 2025',
    verificationNote: 'Access via House Oversight Committee website.',
    relatedThemeIds: ['epsteins-death-mcc', 'acosta-plea-legal-history'],
  },
  {
    id: 'wexner-deposition-2026',
    category: 'congressional',
    type: 'transcript',
    title: 'Les Wexner Deposition — February 18, 2026',
    description: 'Five-hour House Oversight deposition of Leslie Wexner, the billionaire Victoria\'s Secret founder who gave Epstein power of attorney and transferred his Manhattan townhouse. Wexner claimed to have been "duped by a world-class con man" and invoked non-recollection throughout. Video released February 19, 2026. Wexner was labeled "unindicted co-conspirator" in a 2019 FBI Criminal Investigative Division document.',
    url: 'https://oversight.house.gov',
    date: 'February 18, 2026',
    isHighlighted: true,
    verificationNote: 'Video of deposition released February 19, 2026. FBI "unindicted co-conspirator" label confirmed by Rep. Ro Khanna reading six improperly redacted names on the House floor.',
    relatedThemeIds: ['financial-crimes', 'political-intelligence-network'],
  },
  {
    id: 'maxwell-house-oversight-2026',
    category: 'congressional',
    type: 'transcript',
    title: 'Ghislaine Maxwell House Oversight Deposition — February 10, 2026',
    description: 'Maxwell invoked the Fifth Amendment throughout her February 10, 2026 House Oversight deposition. Her attorney made an offer: Maxwell would provide testimony exonerating both Trump and Clinton in exchange for clemency. The offer was rejected. This deposition is the most recent public proceeding in which Maxwell appeared.',
    url: 'https://oversight.house.gov',
    date: 'February 10, 2026',
    verificationNote: 'Clemency offer reported by multiple outlets; Maxwell\'s Fifth Amendment invocations are documented in deposition record.',
    relatedThemeIds: ['maxwell-role-legal', 'co-conspirators-immunity'],
  },
  {
    id: 'bondi-hearing-2026',
    category: 'congressional',
    type: 'transcript',
    title: 'AG Bondi 5+ Hour House Hearing — February 11, 2026',
    description: 'A 5+ hour combined hearing before the House Judiciary and Oversight Committees. Bondi refused to say how many co-conspirators had been indicted and deflected on ties between Epstein and cabinet members. Rep. Lieu accused her of lying under oath. Rep. Massie pressed her on Wexner name redactions.',
    url: 'https://judiciary.house.gov',
    date: 'February 11, 2026',
    relatedThemeIds: ['acosta-plea-legal-history', 'co-conspirators-immunity', 'efta-release-framework'],
  },
  {
    id: 'khanna-massie-doj-review',
    category: 'congressional',
    type: 'transcript',
    title: 'Khanna and Massie DOJ Unredacted File Review — February 9, 2026',
    description: 'Reps. Ro Khanna and Thomas Massie, co-sponsors of EFTA, reviewed unredacted files at DOJ on February 9, 2026. Khanna subsequently read six improperly redacted names on the House floor: Salvatore Nuara, Zurab Mikeladze, Leonic Leonov, Nicola Caputo, Sultan Ahmed bin Sulayem, and Leslie Wexner. The Wexner naming was accompanied by disclosure of the FBI "unindicted co-conspirator" label.',
    url: 'https://oversight.house.gov',
    date: 'February 9, 2026',
    isHighlighted: true,
    relatedThemeIds: ['efta-release-framework', 'financial-crimes'],
  },
  {
    id: 'wyden-senate-finance-treasury',
    category: 'congressional',
    type: 'filing',
    title: 'Wyden Senate Finance Investigation — Treasury "Epstein File" (S.2746)',
    description: 'Senator Ron Wyden introduced S.2746 to compel the Treasury Department to release its locked "Epstein File." The Senate Finance Committee investigation is the primary ongoing financial investigation, tracking Epstein-linked transactions through U.S. banking systems. As of the research compilation date, Treasury had not complied.',
    url: 'https://www.finance.senate.gov',
    verificationNote: 'Pending as of March 2026. Treasury Department has not released the locked file.',
    isMissing: true,
    relatedThemeIds: ['financial-crimes'],
  },
];

// ─── Utility helpers ──────────────────────────────────────────────────────

export function getByCategory(cat: EvidenceCategory): EvidenceEntry[] {
  return evidenceLibrary.filter((e) => e.category === cat);
}

export function getAllCategories(): EvidenceCategory[] {
  return Object.keys(CATEGORY_LABELS) as EvidenceCategory[];
}

export function searchEntries(query: string): EvidenceEntry[] {
  const q = query.toLowerCase();
  return evidenceLibrary.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      (e.efta && e.efta.toLowerCase().includes(q))
  );
}
```

---

## Phase 2: Create the Evidence Page — `src/app/evidence/page.tsx`

This is a client component because of the search input and category filter state.
The data is static — no API calls, no server-side data fetching.

```typescript
// src/app/evidence/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { ExternalLink, FileText, Database, Film, FileSearch, AlertTriangle, Search, XCircle } from 'lucide-react';
import {
  evidenceLibrary,
  getAllCategories,
  getByCategory,
  searchEntries,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  type EvidenceCategory,
  type EvidenceEntry,
  type EvidenceType,
} from '@/data/evidence-library';

// ─── Type badge ───────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<EvidenceType, { label: string; className: string }> = {
  portal:     { label: 'Portal',     className: 'bg-blue-900/40 text-blue-300 border-blue-800/50' },
  pdf:        { label: 'PDF',        className: 'bg-amber-900/40 text-amber-300 border-amber-800/50' },
  video:      { label: 'Video',      className: 'bg-red-900/40 text-red-300 border-red-800/50' },
  database:   { label: 'Database',   className: 'bg-purple-900/40 text-purple-300 border-purple-800/50' },
  transcript: { label: 'Transcript', className: 'bg-green-900/40 text-green-300 border-green-800/50' },
  filing:     { label: 'Filing',     className: 'bg-zinc-700/60 text-zinc-300 border-zinc-600/50' },
  dataset:    { label: 'Dataset',    className: 'bg-indigo-900/40 text-indigo-300 border-indigo-800/50' },
  article:    { label: 'Article',    className: 'bg-teal-900/40 text-teal-300 border-teal-800/50' },
};

function TypeBadge({ type }: { type: EvidenceType }) {
  const cfg = TYPE_CONFIG[type];
  return (
    <span
      className={`inline-flex items-center text-[10px] font-mono px-1.5 py-0.5
                  rounded border uppercase tracking-wider shrink-0 ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Evidence card ────────────────────────────────────────────────────────

function EvidenceCard({ entry }: { entry: EvidenceEntry }) {
  return (
    <div
      className={`group relative rounded-lg border bg-surface-card p-4 transition-colors
                  hover:bg-surface-elevated
                  ${entry.isMissing ? 'border-amber-800/30' : 'border-surface-border'}
                  ${entry.isHighlighted ? 'border-l-2 border-l-accent-blue' : ''}`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <TypeBadge type={entry.type} />
          {entry.efta && (
            <span className="text-[10px] font-mono text-text-muted shrink-0">
              {entry.efta}
            </span>
          )}
          {entry.date && (
            <span className="text-[10px] text-text-muted shrink-0">
              {entry.date}
            </span>
          )}
        </div>
        {entry.isMissing ? (
          <span
            className="flex items-center gap-1 text-[10px] text-amber-400/80 shrink-0"
            title="Document not yet publicly available"
          >
            <AlertTriangle size={10} aria-hidden />
            Pending release
          </span>
        ) : (
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-accent-blue hover:text-accent-blueHover
                       transition-colors shrink-0 opacity-0 group-hover:opacity-100"
            aria-label={`Open ${entry.title} (opens in new tab)`}
          >
            Open
            <ExternalLink size={11} aria-hidden />
          </a>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-text-primary leading-snug mb-1.5">
        {entry.isMissing ? (
          entry.title
        ) : (
          <a
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-blue transition-colors"
          >
            {entry.title}
          </a>
        )}
      </h3>

      {/* Description */}
      <p className="text-xs text-text-secondary leading-relaxed mb-2">
        {entry.description}
      </p>

      {/* Verification note */}
      {entry.verificationNote && (
        <div
          className="flex items-start gap-1.5 mt-2 pt-2 border-t border-surface-border/50"
          aria-label="Verification note"
        >
          <AlertTriangle
            size={10}
            className="text-amber-400/70 shrink-0 mt-0.5"
            aria-hidden
          />
          <p className="text-[11px] text-text-muted leading-relaxed">
            {entry.verificationNote}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Category section ─────────────────────────────────────────────────────

function CategorySection({
  category,
  entries,
}: {
  category: EvidenceCategory;
  entries: EvidenceEntry[];
}) {
  if (entries.length === 0) return null;

  const highlighted = entries.filter((e) => e.isHighlighted);
  const rest = entries.filter((e) => !e.isHighlighted);
  const sorted = [...highlighted, ...rest];

  return (
    <section
      id={category}
      aria-labelledby={`cat-${category}`}
      className="mb-10"
    >
      <div className="mb-4">
        <div className="flex items-baseline gap-3">
          <h2
            id={`cat-${category}`}
            className="text-sm font-semibold text-text-primary"
          >
            {CATEGORY_LABELS[category]}
          </h2>
          <span className="text-xs text-text-muted">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>
        <p className="text-xs text-text-muted leading-relaxed mt-1 max-w-2xl">
          {CATEGORY_DESCRIPTIONS[category]}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {sorted.map((entry) => (
          <EvidenceCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────

const ALL_CATEGORIES = getAllCategories();
const TOTAL_COUNT = evidenceLibrary.length;

export default function EvidencePage() {
  const [activeCategory, setActiveCategory] = useState<EvidenceCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (searchQuery.trim()) {
      return searchEntries(searchQuery.trim());
    }
    if (activeCategory === 'all') {
      return evidenceLibrary;
    }
    return getByCategory(activeCategory);
  }, [searchQuery, activeCategory]);

  // Group for rendering (respect activeCategory when not searching)
  const grouped = useMemo(() => {
    if (searchQuery.trim()) {
      // Show all categories that have results
      const map = new Map<EvidenceCategory, EvidenceEntry[]>();
      for (const entry of filtered) {
        if (!map.has(entry.category)) map.set(entry.category, []);
        map.get(entry.category)!.push(entry);
      }
      return map;
    }
    if (activeCategory !== 'all') {
      return new Map([[activeCategory, filtered]]);
    }
    const map = new Map<EvidenceCategory, EvidenceEntry[]>();
    for (const cat of ALL_CATEGORIES) {
      map.set(cat, getByCategory(cat));
    }
    return map;
  }, [filtered, activeCategory, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const hasResults = filtered.length > 0;

  function scrollToCategory(cat: EvidenceCategory) {
    setActiveCategory(cat);
    setSearchQuery('');
    const el = document.getElementById(cat);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">
          Evidence Library
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          Primary source documents organized by type — not by topic. For users who want to
          go straight to original materials rather than synthesized analysis.
          {' '}{TOTAL_COUNT} sources across {ALL_CATEGORIES.length} categories.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs text-text-muted">
        {ALL_CATEGORIES.map((cat) => {
          const count = getByCategory(cat).length;
          return (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className="hover:text-text-secondary transition-colors"
            >
              {CATEGORY_LABELS[cat]}{' '}
              <span className="font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-8">
        {/* Sidebar — sticky on desktop */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-20 space-y-1">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Categories
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className={`w-full text-left text-xs px-3 py-2 rounded transition-colors flex
                          items-center justify-between
                          ${activeCategory === 'all' && !isSearching
                            ? 'text-accent-blue bg-accent-blue/10'
                            : 'text-text-muted hover:text-text-secondary hover:bg-surface-elevated'
                          }`}
            >
              <span>All sources</span>
              <span className="text-[10px] font-mono">{TOTAL_COUNT}</span>
            </button>

            {ALL_CATEGORIES.map((cat) => {
              const count = getByCategory(cat).length;
              const isActive = activeCategory === cat && !isSearching;
              return (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className={`w-full text-left text-xs px-3 py-2 rounded transition-colors flex
                              items-center justify-between gap-1
                              ${isActive
                                ? 'text-accent-blue bg-accent-blue/10'
                                : 'text-text-muted hover:text-text-secondary hover:bg-surface-elevated'
                              }`}
                >
                  <span className="truncate">{CATEGORY_LABELS[cat]}</span>
                  <span className="text-[10px] font-mono shrink-0">{count}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Search bar */}
          <div className="relative mb-6">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setActiveCategory('all');
              }}
              placeholder="Search titles, descriptions, EFTA numbers…"
              className="w-full pl-9 pr-9 py-2 text-sm bg-surface-elevated border border-surface-border
                         rounded text-text-primary placeholder:text-text-muted
                         focus:outline-none focus:border-accent-blue/50 transition-colors"
              aria-label="Search evidence library"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted
                           hover:text-text-secondary transition-colors"
                aria-label="Clear search"
              >
                <XCircle size={14} aria-hidden />
              </button>
            )}
          </div>

          {/* Mobile category pills */}
          <div className="lg:hidden flex overflow-x-auto gap-2 pb-2 mb-5 no-scrollbar">
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap shrink-0
                          transition-colors
                          ${activeCategory === 'all' && !isSearching
                            ? 'border-accent-blue/50 text-accent-blue bg-accent-blue/10'
                            : 'border-surface-border text-text-muted'
                          }`}
            >
              All
            </button>
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => scrollToCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full border whitespace-nowrap shrink-0
                            transition-colors
                            ${activeCategory === cat && !isSearching
                              ? 'border-accent-blue/50 text-accent-blue bg-accent-blue/10'
                              : 'border-surface-border text-text-muted'
                            }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>

          {/* Search status */}
          {isSearching && (
            <p className="text-xs text-text-muted mb-4">
              {hasResults
                ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${searchQuery}"`
                : `No results for "${searchQuery}"`}
            </p>
          )}

          {/* Empty state */}
          {!hasResults && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-3xl mb-4">🔍</p>
              <p className="text-sm text-text-secondary mb-3">
                No documents match your search.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-accent-blue hover:text-accent-blueHover transition-colors"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Category sections */}
          {Array.from(grouped.entries()).map(([cat, entries]) => (
            <CategorySection
              key={cat}
              category={cat}
              entries={entries}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 3: Add "Evidence" to the Navbar

Open `src/components/layout/Navbar.tsx`. Add a navigation link to `/evidence` in the
desktop nav links, positioned after "Themes" and before "Graph":

```tsx
// In the desktop nav links array or JSX:
<NavLink href="/evidence">Evidence</NavLink>
```

Or, if the Navbar uses a links array:

```typescript
const NAV_LINKS = [
  { href: '/people',       label: 'People'    },
  { href: '/timeline',     label: 'Timeline'  },
  { href: '/themes',       label: 'Themes'    },
  { href: '/evidence',     label: 'Evidence'  },   // ← ADD THIS
  { href: '/graph',        label: 'Graph'     },
  { href: '/investigations', label: 'Investigation' }, // if Gap 1 was implemented
];
```

Match the existing NavLink styling exactly — do not introduce new styles.

---

## Phase 4: Add "Evidence" to the Footer

Open `src/components/layout/Footer.tsx`. The footer currently has About and Sources links.
Add Evidence:

```tsx
<Link href="/evidence/" className="hover:text-text-secondary transition-colors">
  Evidence
</Link>
```

---

## Phase 5: TypeScript Verification

No new types are needed in `src/types/index.ts`. All types (`EvidenceCategory`,
`EvidenceType`, `EvidenceEntry`) live in `src/data/evidence-library.ts`.

Run:
```bash
npx tsc --noEmit
```

Common issues:
- `useMemo` dependency array may need explicit types if TypeScript infers `never`
- The `Map` constructor return type may need `<EvidenceCategory, EvidenceEntry[]>`
  annotation

---

## Phase 6: Build Verification

**Step 1:** TypeScript check:
```bash
npx tsc --noEmit
```

**Step 2:** Build:
```bash
npm run build
```
Confirm that `/evidence` appears in the static export output.

**Step 3:** Dev server — navigate to `/evidence/`:

**Page structure:**
- [ ] Page header shows "Evidence Library" h1 with count of sources
- [ ] Stats bar shows all 8 category names with counts, as clickable links
- [ ] Desktop sidebar shows all 8 categories with entry counts
- [ ] Sidebar "All sources" is active by default
- [ ] Mobile category pills render and scroll horizontally

**Search:**
- [ ] Search input appears and is focusable
- [ ] Typing in search filters entries across all categories
- [ ] Search results show count text ("N results for 'X'")
- [ ] Clear button (×) appears when text is entered and clears on click
- [ ] Empty state renders when no results match

**Category filter:**
- [ ] Clicking a sidebar category scrolls to that section
- [ ] Active category is highlighted in sidebar
- [ ] Mobile pills work the same as sidebar
- [ ] "All sources" shows all categories

**Entry cards:**
- [ ] Type badge renders for every entry
- [ ] EFTA numbers show in monospace when present
- [ ] Dates show when present
- [ ] Description renders in full
- [ ] Verification note shows with ⚠ icon when present
- [ ] Highlighted entries have blue left border
- [ ] Missing/pending entries show "Pending release" badge and no link
- [ ] "Open" link appears on hover for non-missing entries
- [ ] "Open" links open in new tab

**Navigation:**
- [ ] "Evidence" appears in Navbar after "Themes"
- [ ] Navbar active state highlights `/evidence` when on that page
- [ ] "Evidence" appears in Footer links
- [ ] No regressions in existing nav links

**No regressions:**
- [ ] `/` still loads correctly
- [ ] `/themes` still loads correctly
- [ ] `npm run build` produces no TypeScript errors

---

## Files Created / Modified Summary

| Action | File |
|--------|------|
| **CREATE** | `src/data/evidence-library.ts` |
| **CREATE** | `src/app/evidence/page.tsx` |
| **MODIFY** | `src/components/layout/Navbar.tsx` — add Evidence link |
| **MODIFY** | `src/components/layout/Footer.tsx` — add Evidence link |

---

## Design Notes for Claude Code

**No scrollbar on mobile pills.** Add `no-scrollbar` Tailwind utility to the mobile
category pills container. If the project's Tailwind config doesn't have this utility,
add it to `globals.css`:

```css
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
```

**Card open link on hover.** The "Open" + external link icon is opacity-0 by default and
fades to opacity-100 on `group-hover`. This prevents the UI from looking cluttered at
rest — the title itself is also a link, so the hover action is a secondary affordance.

**Highlighted entries use border-l-accent-blue.** The `isHighlighted` flag adds a left
blue border accent (`border-l-2 border-l-accent-blue`) in addition to the normal card
border. This visually signals the ~10 entries that are most important for first-time
researchers. Don't change which entries are highlighted — the selection was deliberate.

**Missing entries (isMissing: true) never get links.** The Wyden S.2746 Treasury file
is an example. Show the amber "Pending release" badge and render no `<a>` tag. The
description still explains what the document is and why it matters.

**The search is client-side and fast.** The `searchEntries` function in the data file
does a simple `toLowerCase().includes()` match across title, description, and EFTA number.
This is sufficient for ~60 entries and requires no external search library. Do not add
Fuse.js to this page.
