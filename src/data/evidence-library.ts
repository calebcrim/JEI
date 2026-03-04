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
    description: 'The deposition transcript of former Attorney General William Barr, released September 16, 2025. Barr served as AG during Epstein\'s 2019 arrest and death; his father Donald Barr was headmaster of the Dalton School until June 30, 1974 — seven months before Epstein began teaching there in September 1974. Whether Barr made the hiring decision in advance is unverified; Peter Branch (interim headmaster from July 1, 1974) is the more likely hiring authority. The deposition covered Barr\'s decision to call the death a suicide and close the primary prosecution.',
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
