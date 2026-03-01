# CC_GUIDE — Gap 1: The Narrative Overview Page
## Epstein Files Research Database — UX Improvement Series

**Purpose:** This guide implements a `/investigations` page — a narrative-first entry point that
gives new visitors a coherent causal story before they enter the database's structured views.
The current site presents data well but has no "read this first" surface. This page is the fix.

**Estimated implementation time:** 4–6 hours  
**Risk to existing functionality:** Zero — this is a net-new route with no changes to existing pages  
**Build verification:** Run `npm run build` after each phase. No existing tests should break.

---

## What This Page Does (and Why It Matters)

A first-time visitor arriving at the site today encounters a search bar, three data cards,
and a stats bar. They have no frame for what they're about to read. They don't know if this
is a conspiracy site or a document archive. They don't know which of five nav links to click.

The `/investigations` page solves this by front-loading **a structured narrative argument**
before the user hits any data view. It presents seven chapters, each covering one major arc
of the Epstein story — in causal sequence. Each chapter is ~350 words of synthesis prose,
followed by contextual links into the relevant data views (people profiles, timeline eras,
theme sections).

The result: a user who reads all seven chapters (~10 minutes) arrives at any data page
already knowing the shape of the story. A user who only reads one chapter gets that chapter's
key facts and knows exactly where to go next.

This is the single highest-leverage addition to the site because it **frames everything else**.

---

## Phase 1: Data File

### File: `src/data/investigations.ts`

Create this file as a static TypeScript module (not JSON — the prose content is long and
benefits from template literals). Claude Code should create this file exactly as specified.

```typescript
// src/data/investigations.ts
// Static narrative content for the /investigations page.
// Each chapter corresponds to one major arc of the Epstein story.

export interface InvestigationChapter {
  id: string;               // URL slug, e.g. "the-operation"
  chapterNumber: number;    // 1–7
  title: string;            // Display title
  subtitle: string;         // One-line description shown in chapter nav
  era: string;              // Primary time period, e.g. "1991–2007"
  bodyParagraphs: string[]; // Array of paragraph strings (render as <p> tags)
  pullQuote?: string;       // Optional highlighted quote or key fact
  pullQuoteSource?: string; // Attribution for pull quote
  relatedPeople: string[];  // person IDs from people.json
  relatedThemeIds: string[]; // theme IDs from themes.json
  relatedTimelineEra: string; // matches TimelineEra type from src/types/index.ts
  deepDiveLinks: {
    label: string;
    href: string;
    type: 'people' | 'timeline' | 'themes' | 'financial';
    description: string;
  }[];
  keyFacts: {              // 3–4 stats/facts shown in a fact bar under the chapter title
    value: string;
    label: string;
  }[];
}

export const investigations: InvestigationChapter[] = [
  {
    id: 'the-operation',
    chapterNumber: 1,
    title: 'The Operation',
    subtitle: 'How a systematic trafficking network was built and run',
    era: '1991–2007',
    keyFacts: [
      { value: '80+', label: 'victims identified by journalists' },
      { value: '$200', label: 'per-victim payment to recruiters' },
      { value: '27', label: 'victims interviewed by Palm Beach PD' },
      { value: '6', label: 'properties used as abuse sites' },
    ],
    bodyParagraphs: [
      `Jeffrey Epstein's trafficking operation was not a series of isolated incidents — it was a structured, hierarchical system built over more than a decade. At its core was a three-tier recruitment pyramid: Maxwell and a small group of core assistants identified vulnerable targets, a second tier of paid recruiters (some themselves prior victims) brought girls to Epstein directly, and some victims were then used to recruit others. The payment structure was consistent: $200 per session to the victim, with recruiters receiving a bonus for each new person they brought in.`,
      `Geographically, the operation centered on Palm Beach, New York, and the U.S. Virgin Islands, with significant international activity through the MC2 modeling agency run by Jean-Luc Brunel — which allegedly served as a procurement pipeline for girls from Eastern Europe and Brazil. Brunel's agency enabled Epstein to bypass domestic recruitment patterns while offering the cover of a legitimate business. FBI records indicate Brunel provided Epstein "3 twelve year old girls as a birthday present from France."`,
      `The scale the Palm Beach Police Department documented in 2005 — 27 victims in a single investigation of a single property — was understood at the time to represent a fraction of the total. The SDNY prosecution memo later identified 24 minor victims and 14 adult victims in its direct evidence. Julie K. Brown's 2018 investigation for the Miami Herald identified more than 80 victims who spoke on the record. The full scope may never be known: hundreds of FBI 302 interview forms exist in the EFTA release, many still substantially redacted.`,
      `Understanding the trafficking operation is the prerequisite for understanding everything else. The financial structures, the political connections, the intelligence links, the legal maneuvers — all of them exist in direct relationship to this crime. The co-conspirators had roles in the operational pipeline. The plea deal was engineered to protect it. The financial network laundered its proceeds. The rest of this database traces how the operation survived for as long as it did.`,
    ],
    pullQuote: `"The operation wasn't just Epstein — it was a machine with defined roles, consistent payment structures, and a management layer that insulated him from direct exposure."`,
    pullQuoteSource: 'DOJ SDNY prosecution memo analysis',
    relatedPeople: ['jeffrey-epstein', 'ghislaine-maxwell', 'jean-luc-brunel'],
    relatedThemeIds: ['trafficking-operation', 'co-conspirators-immunity'],
    relatedTimelineEra: '1990-2000',
    deepDiveLinks: [
      {
        label: 'Trafficking Operation — Full Analysis',
        href: '/themes/#trafficking-operation',
        type: 'themes',
        description: 'Four-tier deep dive: briefing, analysis, evidence tables, primary sources',
      },
      {
        label: 'Co-Conspirators & Immunity Grantees',
        href: '/themes/#co-conspirators-immunity',
        type: 'themes',
        description: 'Who else was charged, who received immunity, and what they knew',
      },
      {
        label: 'Timeline: 1990–2000 Era',
        href: '/timeline/?era=1990-2000',
        type: 'timeline',
        description: 'Early operation-building events in chronological order',
      },
    ],
  },
  {
    id: 'the-protection-network',
    chapterNumber: 2,
    title: 'The Protection Network',
    subtitle: 'The political, financial, and institutional relationships that shielded Epstein',
    era: '1991–2019',
    keyFacts: [
      { value: '10+', label: 'co-conspirators named in federal filings' },
      { value: '$1.5B+', label: 'in suspicious transactions documented' },
      { value: '3', label: 'major intelligence agency connections alleged' },
      { value: '2', label: 'U.S. presidents with documented contact' },
    ],
    bodyParagraphs: [
      `Epstein's operation survived for over a decade of documented law enforcement awareness — not through concealment, but through relationships. The protection network was not a coordinated conspiracy so much as a convergence of interests: powerful people who had attended his dinner parties, flown on his aircraft, and accepted his introductions had strong reasons to ensure that investigations went quietly away.`,
      `The financial dimension was arguably the most important structural element. Epstein managed money for some of the wealthiest individuals in the world — most centrally Les Wexner, whose $1 billion+ financial relationship with Epstein remains the largest undocumented wealth transfer in the case. Wexner gave Epstein power of attorney, access to his properties, and what amounted to a blank check for decades. A February 2026 congressional deposition — described by observers as five hours of Wexner claiming not to remember basic facts while his lawyer was caught whispering answers — has not resolved the core question of what Wexner knew.`,
      `The intelligence dimension remains contested but documented at the evidentiary level. Alexander Acosta, who negotiated the 2008 non-prosecution agreement as U.S. Attorney, told Trump transition officials that Epstein "belonged to intelligence." Ari Ben-Menashe, a former Israeli intelligence officer, has stated that Epstein and Maxwell worked for Israeli intelligence. Robert Maxwell (Ghislaine's father) was a confirmed Mossad asset. Epstein held an Austrian passport in a false name listing a Saudi Arabian address, discovered in a safe during his 2019 arrest. A CIA email from October 2005 is present in the EFTA release and has not been publicly explained.`,
      `The political network served as the outermost protective layer — not necessarily through active intervention, but through the chilling effect of proximity. Epstein maintained documented relationships with Bill Clinton (26+ flights on the Lolita Express), Donald Trump (co-attendee at multiple social events, 1992 party footage with underage victims), Prince Andrew (photographed with Virginia Giuffre, subject of UK civil proceedings), and dozens of senators, academics, and billionaires. The significance is not that all of these people were participants — most were not charged — but that their presence in his orbit gave investigators reason to proceed cautiously.`,
    ],
    pullQuote: `Acosta told Trump transition officials that he had been told Epstein "belonged to intelligence" and to back off.`,
    pullQuoteSource: 'Reported by Vicky Ward, confirmed in congressional testimony context',
    relatedPeople: ['les-wexner', 'ghislaine-maxwell', 'alexander-acosta', 'jean-luc-brunel'],
    relatedThemeIds: ['intelligence-connections', 'political-intelligence-network', 'financial-crimes'],
    relatedTimelineEra: '2001-2007',
    deepDiveLinks: [
      {
        label: 'Intelligence Connections — Full Analysis',
        href: '/themes/#intelligence-connections',
        type: 'themes',
        description: 'The Austrian passport, CIA email, Mossad connections, Carbyne technology',
      },
      {
        label: 'Financial Crimes & Money Laundering',
        href: '/themes/#financial-crimes',
        type: 'themes',
        description: '$1.5B+ in suspicious transactions across four major banks',
      },
      {
        label: 'Political Intelligence Network',
        href: '/themes/#political-intelligence-network',
        type: 'themes',
        description: 'The dinner party circuit, the flight logs, and documented political access',
      },
      {
        label: 'Financial Records Deep Dive',
        href: '/financial/',
        type: 'financial',
        description: 'Interactive visualization of transaction flows and entity networks',
      },
    ],
  },
  {
    id: 'the-plea-deal',
    chapterNumber: 3,
    title: 'The Plea Deal',
    subtitle: 'How federal prosecutors secretly negotiated immunity for Epstein and his associates',
    era: '2005–2008',
    keyFacts: [
      { value: '2008', label: 'NPA signed, shielding Epstein from federal charges' },
      { value: '18 months', label: 'sentence served, with 12-hour daily work release' },
      { value: '10+', label: 'unnamed co-conspirators granted blanket immunity' },
      { value: '11th Circuit', label: 'ruled victims\' rights were violated — but too late' },
    ],
    bodyParagraphs: [
      `By 2006, federal prosecutors in the Southern District of Florida had assembled a 53-page federal indictment against Epstein charging him with multiple counts of sex trafficking. The FBI had identified at least 34 victims. Palm Beach Police had already referred the case to federal authorities after their 2005 investigation was undermined at the local level. A prosecution of historic proportions was within reach.`,
      `What followed is the most documented instance of prosecutorial failure in the case. Alexander Acosta, then U.S. Attorney for the Southern District of Florida, negotiated a Non-Prosecution Agreement (NPA) with Epstein's defense team — which included Ken Starr, Jay Lefkowitz, and Alan Dershowitz — in secret. Critically, the NPA was not disclosed to Epstein's victims, in direct violation of the Crime Victims' Rights Act. Epstein pleaded to two Florida state charges, was sentenced to 18 months in Palm Beach County Jail, and served his sentence largely on work release — leaving the jail 12 hours a day, six days a week, to work from his private office.`,
      `The NPA's immunity provisions extended beyond Epstein himself. The agreement granted immunity from federal prosecution to "any potential co-conspirators" — a category that was left unnamed and undefined, potentially covering Maxwell, Brunel, and others. An 86-page co-conspirators memo was reportedly posted to the DOJ website briefly after the EFTA release before being removed. Its contents remain publicly unknown. In 2019, U.S. District Judge Kenneth Marra ruled that the CVRA had been violated and that prosecutors had "essentially abandon[ed] the prosecution" — but by then, Epstein had served his sentence and died.`,
      `Acosta resigned as Secretary of Labor in July 2019, three weeks after Epstein's arrest. He has said publicly that the case was "properly handled" and that he was influenced by representations that Epstein was an intelligence asset. The full documentary record of the NPA negotiation — including correspondence between Acosta, Epstein's lawyers, and other DOJ officials — is contained in EFTA Datasets 1–7 and has not been fully analyzed publicly.`,
    ],
    pullQuote: `"I was told Epstein 'belonged to intelligence' and to leave it alone."`,
    pullQuoteSource: 'Alexander Acosta, reported by Vicky Ward',
    relatedPeople: ['jeffrey-epstein', 'alexander-acosta', 'alan-dershowitz', 'ken-starr'],
    relatedThemeIds: ['acosta-plea-legal-history', 'co-conspirators-immunity'],
    relatedTimelineEra: '2008-2018',
    deepDiveLinks: [
      {
        label: 'The Acosta Plea Deal — Full Legal History',
        href: '/themes/#acosta-plea-legal-history',
        type: 'themes',
        description: 'Complete legal timeline from 1996 FBI complaint through current proceedings',
      },
      {
        label: 'Timeline: 2008–2018 Era',
        href: '/timeline/?era=2008-2018',
        type: 'timeline',
        description: 'The NPA, work release, CVRA challenge, and Julie K. Brown investigation',
      },
    ],
  },
  {
    id: 'the-arrest-and-death',
    chapterNumber: 4,
    title: 'The Arrest and Death',
    subtitle: 'The 2019 re-prosecution and the circumstances of Epstein\'s death at MCC New York',
    era: '2019',
    keyFacts: [
      { value: 'Aug 10, 2019', label: 'Epstein found dead at MCC New York' },
      { value: '2', label: 'guards on duty — both asleep, failed to check' },
      { value: '577+', label: 'surveillance footage files released in EFTA' },
      { value: '1', label: 'master copy destroyed by FBI before discovery' },
    ],
    bodyParagraphs: [
      `On July 6, 2019, Jeffrey Epstein was arrested at Teterboro Airport after returning from a trip to Paris. The SDNY indictment charged him with sex trafficking of minors and conspiracy — based substantially on evidence the government had possessed since 2007. Attorney General William Barr, whose father had given Epstein his first job at the Dalton School in 1974, oversaw the prosecution. Epstein pleaded not guilty and was remanded to the Metropolitan Correctional Center in lower Manhattan.`,
      `On July 23, 2019, Epstein was found unresponsive in his cell with marks on his neck. He was taken off suicide watch. On August 10, 2019, he was found dead. The official cause of death was ruled suicide by hanging. The two guards assigned to check on him every 30 minutes were both asleep during the relevant window and had falsified their log entries. A third bunk bed that had been in his cell was removed without explanation prior to the night of his death. The mattress was described as too thin to have supported a hanging from the bunk — a finding noted by the medical examiner retained by Epstein's brother, Dr. Michael Baden, who concluded the injuries were "more consistent with homicidal strangulation."`,
      `The surveillance footage has been one of the most contested evidentiary questions in the case. The EFTA release contained 577 video files from MCC cameras. Investigators discovered that the FBI had taken the master copy of the hallway footage — then accidentally destroyed it, claiming it was the wrong recording. A reconstructed copy was later made from a secondary source. Analysis of available footage by community researchers has identified several anomalies, including a period of apparent gap in the footage from the relevant corridor.`,
      `The official suicide determination has not been universally accepted. The New York City Medical Examiner's office ruled the manner of death "undetermined" — a designation that is unusually rare and typically applied when evidence is insufficient to support a definitive conclusion. The two guards were charged with falsifying records, then received deferred prosecution agreements. No prosecution has been brought for the death itself.`,
    ],
    pullQuote: `"The evidence, in my opinion, points toward homicidal strangulation rather than suicidal hanging."`,
    pullQuoteSource: 'Dr. Michael Baden, forensic pathologist retained by Epstein\'s estate',
    relatedPeople: ['jeffrey-epstein', 'william-barr'],
    relatedThemeIds: ['epsteins-death-mcc', 'efta-release-framework'],
    relatedTimelineEra: '2019',
    deepDiveLinks: [
      {
        label: 'Death & MCC Anomalies — Full Analysis',
        href: '/themes/#epsteins-death-mcc',
        type: 'themes',
        description: 'Surveillance footage, guard conduct, medical examiner findings, open questions',
      },
      {
        label: 'Timeline: 2019',
        href: '/timeline/?era=2019',
        type: 'timeline',
        description: 'Arrest, bail hearing, suicide attempt, removal from watch, death',
      },
    ],
  },
  {
    id: 'the-document-release',
    chapterNumber: 5,
    title: 'The Document Release',
    subtitle: 'The 3.5 million page EFTA release — what it contains, what\'s missing, and why',
    era: '2025–2026',
    keyFacts: [
      { value: '3.5M', label: 'pages released under EFTA' },
      { value: '~3M', label: 'pages still withheld from the 6M collected' },
      { value: '91,646', label: 'over-redactions identified by community researchers' },
      { value: '31', label: 'victims\' identities exposed by DOJ redaction failures' },
    ],
    bodyParagraphs: [
      `The Epstein Files Transparency Act passed the House 427–1 and the Senate unanimously in November 2025. Trump signed it — without reporters present — after reporting indicated he had personally lobbied members to oppose it. The Act required DOJ to release all qualifying files within 30 days. The result was the largest single document release in the history of a sex trafficking investigation.`,
      `Approximately 3.5 million pages were released across 12 datasets, along with roughly 2,000 videos and 180,000 images. But the DOJ had collected 6 million qualifying pages before the release — meaning approximately half of the qualifying material was withheld. Community researchers identified specific EFTA document numbers that appear in cross-references but were never uploaded. Sixteen documents disappeared from the DOJ portal after initial posting and were later restored without explanation. An Inspector General complaint filed by the Democracy Defenders Fund alleged that DOJ had altered several documents post-publication.`,
      `The quality of the release has been widely criticized on two contradictory grounds: the DOJ simultaneously over-redacted and under-redacted. On the over-redaction side, 91,646 instances have been identified where the black redaction overlay failed to fully obscure the underlying text — meaning the "redacted" content is still recoverable by community researchers. On the under-redaction side, the identities of at least 31 victims — people entitled to protection under federal law — were exposed in documents that should have had those names removed.`,
      `The twelve datasets are not of equal quality or completeness. Dataset 9 (Epstein's emails, accessible via JMail.world) contains over 1 million indexed messages and has been the single richest source of new information. Dataset 10 (video files) contained evidence that some videos were deliberately mislabeled — adult content given filenames suggesting minors, and vice versa. Datasets 1–7 (Palm Beach and SDNY investigation files) contain the core evidentiary record of the trafficking operation and the plea deal negotiation. Community tools have been essential: without JMail, the CBS Pinpoint database, the NPR serial number analysis, and the rhowardstone GitHub forensic repository, most researchers would have no navigable access to the release at all.`,
    ],
    pullQuote: `The DOJ collected 6 million qualifying pages — then released 3.5 million and withheld the rest.`,
    pullQuoteSource: 'DOJ EFTA release documentation, analyzed by community researchers',
    relatedPeople: [],
    relatedThemeIds: ['efta-release-framework', 'community-research-tools'],
    relatedTimelineEra: '2020-present',
    deepDiveLinks: [
      {
        label: 'EFTA Release Framework — Full Analysis',
        href: '/themes/#efta-release-framework',
        type: 'themes',
        description: 'Dataset-by-dataset breakdown, redaction failures, missing documents',
      },
      {
        label: 'Community Research Tools',
        href: '/themes/#community-research-tools',
        type: 'themes',
        description: 'JMail, CBS Pinpoint, rhowardstone, and other tools for navigating the release',
      },
      {
        label: 'Timeline: 2020–Present',
        href: '/timeline/?era=2020-present',
        type: 'timeline',
        description: 'EFTA passage, document releases, congressional hearings, current proceedings',
      },
    ],
  },
  {
    id: 'the-financial-trail',
    chapterNumber: 6,
    title: 'The Financial Trail',
    subtitle: 'Over $1.5 billion in suspicious transactions — and the banks that filed almost nothing',
    era: '1991–2019',
    keyFacts: [
      { value: '$1B+', label: 'in transactions at JPMorgan alone' },
      { value: '$577M', label: 'estate value vs. no credible documented income source' },
      { value: '7', label: 'SARs filed by JPMorgan while Epstein was alive' },
      { value: '$1B+', label: 'covered in single retroactive SAR filed after his death' },
    ],
    bodyParagraphs: [
      `Jeffrey Epstein's declared occupation was "money manager," but the source of his wealth was never credibly established during his lifetime. His estate at death was valued at approximately $577 million. His documented income — from the few financial advisory relationships that are on record, most notably his arrangement with Les Wexner — cannot plausibly account for this figure. The gap between documented income and estate value is one of the central unresolved questions in the case.`,
      `The banking record, now substantially available through EFTA documents and civil litigation discovery, tells a story of institutional complicity through willful blindness. JPMorgan processed over $1 billion in Epstein-related transactions across approximately 4,700 individual wires, filing only 7 Suspicious Activity Reports during his lifetime — covering a combined $4.3 million. After his death, JPMorgan filed a single retroactive SAR covering more than $1 billion in transactions it had processed over decades. The bank settled civil suits brought by the governments of the U.S. Virgin Islands and an Epstein victim for a combined $365 million. Deutsche Bank settled with the NYDFS for $150 million over similar failures.`,
      `The entity structure was deliberately complex. Epstein operated through at least 40 shell companies and charitable foundations across multiple jurisdictions. The Southern Trust Company in the U.S. Virgin Islands — which reported $250 million or more in revenues while claiming a 90% tax exemption and conducting no apparent legitimate business — appears to have been purpose-built as a tax and financial vehicle. The 1953 Trust, with Epstein's attorney Darren Indyke as trustee, distributed $50 million to individuals including $100 million to Marina Shuliak, whose identity and relationship to Epstein remain unexplained.`,
      `The Butterfly Trust is one of the most documented sub-structures: EFTA document EFTA00029805 shows 120+ wire transfers totaling $2.65 million sent to women with Eastern European surnames, consistent with the MC2 international trafficking pipeline. Deutsche Bank records show structured cash withdrawals at $7,500 — just below the $10,000 currency transaction reporting threshold — consistent with deliberate smurfing. The full financial map has not been assembled by any single authority. Senator Wyden's Finance Committee investigation and Senator Raskin's letters to four major banks represent the most serious current official inquiry into the financial dimension.`,
    ],
    pullQuote: `JPMorgan processed $1 billion in Epstein transactions, filed 7 SARs while he was alive, then filed one retroactive SAR after his death covering the entire billion.`,
    pullQuoteSource: 'USVI civil litigation discovery, DOJ EFTA release',
    relatedPeople: ['jeffrey-epstein', 'les-wexner', 'darren-indyke'],
    relatedThemeIds: ['financial-crimes'],
    relatedTimelineEra: '2001-2007',
    deepDiveLinks: [
      {
        label: 'Financial Crimes & Money Laundering — Full Analysis',
        href: '/themes/#financial-crimes',
        type: 'themes',
        description: 'Bank-by-bank breakdown, entity network, income gap analysis',
      },
      {
        label: 'Financial Records Visualization',
        href: '/financial/',
        type: 'financial',
        description: 'Interactive transaction network and entity structure maps',
      },
    ],
  },
  {
    id: 'what-remains-unknown',
    chapterNumber: 7,
    title: 'What Remains Unknown',
    subtitle: 'The open questions, the withheld documents, and the ongoing investigations',
    era: '2026',
    keyFacts: [
      { value: '~2.5M', label: 'pages collected by DOJ but not released' },
      { value: '86', label: 'pages in co-conspirators memo, reportedly posted then removed' },
      { value: '0', label: 'additional prosecutions brought since Epstein\'s 2008 plea' },
      { value: '2026', label: 'Clinton deposition scheduled; Wexner deposed Feb 18' },
    ],
    bodyParagraphs: [
      `After 3.5 million pages, two congressional investigations, one criminal trial (Maxwell), and 18 years of journalism, the Epstein case has more documented facts than any comparable investigation in recent memory — and more significant unresolved questions than almost any other. The gap between what is known and what is provable in a courtroom remains enormous.`,
      `The most consequential unknowns center on identity and immunity. The Non-Prosecution Agreement granted blanket immunity to unnamed co-conspirators. An 86-page memo detailing those co-conspirators was reportedly posted to the DOJ EFTA portal, then removed. Its contents are unknown. The 2019 SDNY indictment, had it proceeded to trial, would have required the government to name those individuals. It did not proceed. No immunity agreement in American legal history has been more consequential and less publicly scrutinized.`,
      `The withheld documents represent a known unknown. The DOJ collected approximately 6 million qualifying pages. It released approximately 3.5 million. The criteria for what was withheld, and why, have not been fully explained. Community researchers have identified specific EFTA document numbers — cross-referenced in released materials — that were never uploaded. Treasury Department and DEA records that would illuminate the financial network are subject to FOIA requests that have not been fulfilled. The Senate Finance Committee has formally requested records from four banks; responses are pending.`,
      `The investigation is ongoing in ways that are easy to miss. The February 2026 deposition of Les Wexner — five hours, under oath, before congressional investigators — produced no major public disclosures but represented the first time Wexner has been compelled to answer questions under oath. Clinton depositions were scheduled for late February 2026. The FBI has not closed its investigation. The USVI has ongoing legal proceedings. International prosecutions — including UK proceedings related to Prince Andrew and a Norwegian investigation — are at various stages. This database will continue to update as those proceedings develop.`,
    ],
    pullQuote: `The 86-page co-conspirators memo was reportedly uploaded to the DOJ portal, then removed. Its contents remain unknown.`,
    pullQuoteSource: 'Community researcher analysis of EFTA portal access logs',
    relatedPeople: ['les-wexner'],
    relatedThemeIds: ['acosta-plea-legal-history', 'efta-release-framework', 'media-congressional-investigations'],
    relatedTimelineEra: '2020-present',
    deepDiveLinks: [
      {
        label: 'Media & Congressional Investigations',
        href: '/themes/#media-congressional-investigations',
        type: 'themes',
        description: 'Current hearings, depositions, and outstanding FOIA requests',
      },
      {
        label: 'International Consequences & Fallout',
        href: '/themes/#international-consequences',
        type: 'themes',
        description: 'UK, Norway, and other international proceedings',
      },
      {
        label: 'Timeline: 2020–Present',
        href: '/timeline/?era=2020-present',
        type: 'timeline',
        description: 'All documented events from Epstein\'s death through current investigations',
      },
    ],
  },
];

export default investigations;
```

---

## Phase 2: TypeScript Types

Add the `InvestigationChapter` interface to your existing types file. Open
`src/types/index.ts` and append the following at the end of the file:

```typescript
// src/types/index.ts — APPEND (do not replace existing content)

export interface InvestigationDeepDiveLink {
  label: string;
  href: string;
  type: 'people' | 'timeline' | 'themes' | 'financial';
  description: string;
}

export interface InvestigationKeyFact {
  value: string;
  label: string;
}

export interface InvestigationChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  era: string;
  bodyParagraphs: string[];
  pullQuote?: string;
  pullQuoteSource?: string;
  relatedPeople: string[];
  relatedThemeIds: string[];
  relatedTimelineEra: string;
  deepDiveLinks: InvestigationDeepDiveLink[];
  keyFacts: InvestigationKeyFact[];
}
```

---

## Phase 3: Page Route

### File: `src/app/investigations/page.tsx`

Create this file. It is a standard Next.js App Router page.

```typescript
// src/app/investigations/page.tsx
import type { Metadata } from 'next';
import { investigations } from '@/data/investigations';
import InvestigationsNav from '@/components/investigations/InvestigationsNav';
import ChapterBlock from '@/components/investigations/ChapterBlock';

export const metadata: Metadata = {
  title: 'Investigations',
  description:
    'A narrative guide to the Epstein case in seven chapters — from the trafficking operation through the document release and open investigations.',
};

export default function InvestigationsPage() {
  return (
    <div className="min-h-screen">
      {/* Page header */}
      <header className="border-b border-surface-border bg-surface-card px-4 py-10">
        <div className="max-w-screen-md mx-auto">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">
            Narrative Overview
          </p>
          <h1 className="text-2xl font-semibold text-text-primary mb-3">
            The Investigation
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
            Seven chapters covering the Epstein case from beginning to present —
            the operation, the protection network, the plea deal, the death, the
            document release, the financial trail, and what remains unknown.
            Each chapter connects to the detailed data in People, Timeline, and Themes.
          </p>
          <p className="text-xs text-text-muted mt-4">
            Read time: approximately 10 minutes for all seven chapters.
          </p>
        </div>
      </header>

      {/* Two-column layout: sticky chapter nav + content */}
      <div className="max-w-screen-xl mx-auto flex gap-0">
        {/* Sticky chapter navigator — desktop only */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto
                          border-r border-surface-border py-6 px-4">
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
              Chapters
            </p>
            <InvestigationsNav chapters={investigations} />
          </div>
        </aside>

        {/* Chapter content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-screen-md mx-auto px-4 py-8 space-y-20">
            {investigations.map((chapter) => (
              <ChapterBlock key={chapter.id} chapter={chapter} />
            ))}
          </div>

          {/* Footer CTA */}
          <div className="border-t border-surface-border bg-surface-card px-4 py-10 mt-8">
            <div className="max-w-screen-md mx-auto text-center">
              <p className="text-sm text-text-secondary mb-4">
                The narrative above is a synthesis. All claims trace to verifiable sources
                available throughout this database.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href="/people/"
                  className="text-xs px-4 py-2 border border-surface-border rounded
                             text-text-secondary hover:text-text-primary hover:bg-surface-elevated
                             transition-colors"
                >
                  Browse all people →
                </a>
                <a
                  href="/timeline/"
                  className="text-xs px-4 py-2 border border-surface-border rounded
                             text-text-secondary hover:text-text-primary hover:bg-surface-elevated
                             transition-colors"
                >
                  View full timeline →
                </a>
                <a
                  href="/themes/"
                  className="text-xs px-4 py-2 border border-surface-border rounded
                             text-text-secondary hover:text-text-primary hover:bg-surface-elevated
                             transition-colors"
                >
                  Explore all themes →
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
```

---

## Phase 4: Components

Create the following three components. All go in `src/components/investigations/`.

### Component 1: `InvestigationsNav.tsx`

This is the sticky left sidebar that shows chapter numbers, titles, and a subtle
active-state indicator as the user scrolls.

```typescript
// src/components/investigations/InvestigationsNav.tsx
'use client';

import { useState, useEffect } from 'react';
import type { InvestigationChapter } from '@/types';

interface Props {
  chapters: InvestigationChapter[];
}

export default function InvestigationsNav({ chapters }: Props) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    chapters.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav aria-label="Chapter navigation">
      <ol className="space-y-1">
        {chapters.map((ch) => (
          <li key={ch.id}>
            <a
              href={`#${ch.id}`}
              className={`flex items-start gap-2.5 px-2 py-2 rounded text-xs
                          transition-colors leading-snug group
                          ${activeId === ch.id
                            ? 'text-text-primary bg-surface-elevated'
                            : 'text-text-muted hover:text-text-secondary hover:bg-surface-elevated'
                          }`}
              aria-current={activeId === ch.id ? 'true' : undefined}
            >
              <span
                className={`shrink-0 font-mono text-[10px] mt-0.5 transition-colors
                            ${activeId === ch.id ? 'text-text-secondary' : 'text-text-muted'}`}
              >
                {String(ch.chapterNumber).padStart(2, '0')}
              </span>
              <span className="leading-snug">{ch.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### Component 2: `ChapterBlock.tsx`

The main content block for each chapter. Renders the chapter heading, key facts bar,
body prose, pull quote (if present), and deep dive links.

```typescript
// src/components/investigations/ChapterBlock.tsx
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Users, FileText, DollarSign } from 'lucide-react';
import type { InvestigationChapter, InvestigationDeepDiveLink } from '@/types';

interface Props {
  chapter: InvestigationChapter;
}

const typeIcons: Record<InvestigationDeepDiveLink['type'], React.ElementType> = {
  people: Users,
  timeline: Clock,
  themes: BookOpen,
  financial: DollarSign,
};

const typeColors: Record<InvestigationDeepDiveLink['type'], string> = {
  people:    'text-blue-400',
  timeline:  'text-amber-400',
  themes:    'text-emerald-400',
  financial: 'text-purple-400',
};

export default function ChapterBlock({ chapter }: Props) {
  return (
    <article
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-20"
    >
      {/* Chapter header */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs text-text-muted">
            Chapter {String(chapter.chapterNumber).padStart(2, '0')}
          </span>
          <span className="text-text-muted text-xs">·</span>
          <span className="text-xs text-text-muted">{chapter.era}</span>
        </div>
        <h2
          id={`${chapter.id}-title`}
          className="text-xl font-semibold text-text-primary mb-1.5"
        >
          {chapter.title}
        </h2>
        <p className="text-sm text-text-secondary">{chapter.subtitle}</p>
      </header>

      {/* Key facts bar */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7 p-4
                   bg-surface-card border border-surface-border rounded-lg"
        aria-label="Key statistics"
      >
        {chapter.keyFacts.map((fact, i) => (
          <div key={i} className="text-center">
            <p className="text-lg font-semibold text-text-primary leading-none mb-1">
              {fact.value}
            </p>
            <p className="text-[11px] text-text-muted leading-snug">{fact.label}</p>
          </div>
        ))}
      </div>

      {/* Body prose */}
      <div className="prose prose-sm prose-invert max-w-none space-y-4 mb-7">
        {chapter.bodyParagraphs.map((para, i) => (
          <p key={i} className="text-sm text-text-secondary leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Pull quote */}
      {chapter.pullQuote && (
        <blockquote
          className="border-l-2 border-amber-500/60 pl-4 my-7"
          aria-label="Key quote"
        >
          <p className="text-sm text-text-primary italic leading-relaxed">
            {chapter.pullQuote}
          </p>
          {chapter.pullQuoteSource && (
            <footer className="text-xs text-text-muted mt-2">
              — {chapter.pullQuoteSource}
            </footer>
          )}
        </blockquote>
      )}

      {/* Deep dive links */}
      {chapter.deepDiveLinks.length > 0 && (
        <div className="mt-7">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">
            Go deeper
          </p>
          <div className="space-y-2">
            {chapter.deepDiveLinks.map((link, i) => {
              const Icon = typeIcons[link.type];
              const iconColor = typeColors[link.type];
              return (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-start gap-3 p-3 border border-surface-border rounded
                             hover:bg-surface-elevated hover:border-surface-border/80
                             transition-colors group"
                >
                  <Icon
                    size={14}
                    className={`shrink-0 mt-0.5 ${iconColor}`}
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary group-hover:text-text-primary
                                  leading-snug mb-0.5">
                      {link.label}
                    </p>
                    <p className="text-xs text-text-muted leading-snug">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight
                    size={12}
                    className="shrink-0 mt-1 text-text-muted
                               group-hover:text-text-secondary transition-colors"
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
```

### Component 3: `InvestigationsMobileNav.tsx`

Mobile-only chapter selector. Rendered as a horizontal scrollable pill bar.
Inject this below the page header on mobile screens.

```typescript
// src/components/investigations/InvestigationsMobileNav.tsx
'use client';

import { useState, useEffect } from 'react';
import type { InvestigationChapter } from '@/types';

interface Props {
  chapters: InvestigationChapter[];
}

export default function InvestigationsMobileNav({ chapters }: Props) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    chapters.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <div
      className="lg:hidden sticky top-14 z-40 bg-surface/95 backdrop-blur-sm
                 border-b border-surface-border px-4 py-2 overflow-x-auto"
      role="navigation"
      aria-label="Chapter quick navigation"
    >
      <div className="flex gap-2 w-max">
        {chapters.map((ch) => (
          <a
            key={ch.id}
            href={`#${ch.id}`}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors
                        ${activeId === ch.id
                          ? 'border-text-muted text-text-primary bg-surface-elevated'
                          : 'border-surface-border text-text-muted hover:text-text-secondary'
                        }`}
          >
            <span className="font-mono mr-1.5 text-[10px]">
              {String(ch.chapterNumber).padStart(2, '0')}
            </span>
            {ch.title}
          </a>
        ))}
      </div>
    </div>
  );
}
```

To include `InvestigationsMobileNav` in the page, update `investigations/page.tsx` to:
1. Import `InvestigationsMobileNav`
2. Add `<InvestigationsMobileNav chapters={investigations} />` immediately after the `<header>` block and before the two-column layout `<div>`

---

## Phase 5: Navbar Integration

Open `src/components/layout/Navbar.tsx`. The current `NAV_LINKS` array is:

```typescript
const NAV_LINKS = [
  { href: '/people/', label: 'People' },
  { href: '/timeline/', label: 'Timeline' },
  { href: '/themes/', label: 'Themes' },
  { href: '/graph/', label: 'Graph' },
  { href: '/financial/', label: 'Financial' },
];
```

Add the `Investigations` link **at the beginning** of this array so it appears first:

```typescript
const NAV_LINKS = [
  { href: '/investigations/', label: 'Investigations' },  // ← ADD THIS
  { href: '/people/', label: 'People' },
  { href: '/timeline/', label: 'Timeline' },
  { href: '/themes/', label: 'Themes' },
  { href: '/graph/', label: 'Graph' },
  { href: '/financial/', label: 'Financial' },
];
```

The visual treatment should match the other primary nav links — not the subdued About link style.

---

## Phase 6: Home Page Integration

The existing home page (`src/app/page.tsx`) has three entry point cards linking to People,
Timeline, and Themes. Add a fourth "feature card" above those three that promotes the
Investigations page as the recommended starting point.

Locate the "Entry point cards" section in `src/app/page.tsx`. Before the existing three-card
grid, insert this featured card:

```tsx
{/* Featured: Investigations narrative entry point */}
<div className="mb-6">
  <Link
    href="/investigations/"
    className="flex items-center justify-between p-5 border border-surface-border
               rounded-lg hover:bg-surface-elevated hover:border-surface-border/80
               transition-colors group bg-surface-card"
    aria-label="Read the narrative overview — recommended starting point"
  >
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">
          Start here
        </span>
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">
        The Investigation — A Narrative Overview
      </h3>
      <p className="text-xs text-text-secondary max-w-md">
        Seven chapters covering the Epstein case in sequence: the operation, 
        the protection network, the plea deal, the death, the document release, 
        the financial trail, and what remains unknown. ~10 minutes.
      </p>
    </div>
    <ArrowRight
      size={18}
      className="shrink-0 ml-4 text-text-muted group-hover:text-text-secondary transition-colors"
      aria-hidden
    />
  </Link>
</div>
```

Make sure `ArrowRight` is imported from `lucide-react` at the top of `page.tsx` if not already present.

---

## Phase 7: Search Index Integration

Open `scripts/build-search-index.ts` (or equivalent search index builder). Add the
investigations to the search index so chapter titles and subtitles are searchable.

Find the section where timeline events, people, and themes are indexed. Add:

```typescript
// In scripts/build-search-index.ts — add alongside existing entity indexing

import { investigations } from '../src/data/investigations';

// Inside the main indexing function:
const investigationEntries: SearchResult[] = investigations.map((ch) => ({
  type: 'investigation' as const,
  id: ch.id,
  title: ch.title,
  excerpt: ch.subtitle,
  category: `Chapter ${ch.chapterNumber}`,
}));

// Add investigationEntries to the unified allEntries array before writing the index
```

You will also need to add `'investigation'` to the `SearchResult` type union in
`src/types/index.ts`:

```typescript
// Update existing SearchResult type
export interface SearchResult {
  type: 'person' | 'event' | 'theme' | 'investigation'; // ← add 'investigation'
  id: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  score?: number;
}
```

And update `GlobalSearch.tsx` to include an "Investigation" badge variant (alongside
the existing Person/Event/Theme badges) if the search results renderer uses type-based
badge colors.

---

## Phase 8: Build Verification

After completing all phases, verify the build succeeds and the page functions correctly.

**Step 1:** Run the TypeScript compiler check:
```bash
npx tsc --noEmit
```
Fix any type errors before proceeding.

**Step 2:** Run the full build:
```bash
npm run build
```
Confirm no build errors. The static export should include `/investigations/index.html`.

**Step 3:** Run the dev server and manually verify:
```bash
npm run dev
```

**Checklist:**
- [ ] `/investigations` loads without errors
- [ ] All 7 chapters render with correct content
- [ ] Key facts bars show 4 stats per chapter
- [ ] Pull quotes render with amber left border
- [ ] Deep dive links render with correct type icons and colors
- [ ] Desktop sticky sidebar shows all 7 chapter titles
- [ ] Sidebar active state updates as user scrolls through chapters
- [ ] Mobile pill nav renders below the header (lg:hidden works)
- [ ] Mobile pill nav active state updates on scroll
- [ ] Clicking a chapter link in the nav scrolls to correct section
- [ ] All deep dive links point to correct hrefs
- [ ] "Start here" feature card appears on home page above the three existing cards
- [ ] `Investigations` appears as first item in the navbar
- [ ] Navbar active state highlights `/investigations` when on that page
- [ ] Search includes investigation chapter entries
- [ ] Page is readable at 375px mobile width (no horizontal overflow)
- [ ] All aria labels and heading hierarchy are correct
- [ ] `npm run build` produces no TypeScript errors

---

## Content Notes for Claude Code

The chapter prose in `src/data/investigations.ts` is finalized and should be rendered
exactly as written — no summarizing, truncating, or paraphrasing by the implementation.
The `bodyParagraphs` array renders each string as a separate `<p>` tag.

The `relatedPeople` and `relatedThemeIds` arrays contain IDs that must match the actual
IDs in `people.json` and `themes.json`. Before completing implementation, verify these
IDs exist in the data files:
- `jeffrey-epstein`, `ghislaine-maxwell`, `jean-luc-brunel`, `les-wexner`,
  `alexander-acosta`, `alan-dershowitz`, `ken-starr`, `darren-indyke`, `william-barr`
- Theme IDs: `trafficking-operation`, `co-conspirators-immunity`, `intelligence-connections`,
  `political-intelligence-network`, `financial-crimes`, `acosta-plea-legal-history`,
  `epsteins-death-mcc`, `efta-release-framework`, `community-research-tools`,
  `media-congressional-investigations`, `international-consequences`

If any IDs don't match exactly, adjust them to match what's in the actual data files.
Do not create phantom links to IDs that don't exist.

---

## Files Created / Modified Summary

| Action | File |
|--------|------|
| **CREATE** | `src/data/investigations.ts` |
| **CREATE** | `src/app/investigations/page.tsx` |
| **CREATE** | `src/components/investigations/InvestigationsNav.tsx` |
| **CREATE** | `src/components/investigations/ChapterBlock.tsx` |
| **CREATE** | `src/components/investigations/InvestigationsMobileNav.tsx` |
| **MODIFY** | `src/types/index.ts` — add InvestigationChapter types + update SearchResult union |
| **MODIFY** | `src/components/layout/Navbar.tsx` — add Investigations to NAV_LINKS |
| **MODIFY** | `src/app/page.tsx` — add feature card above entry point cards |
| **MODIFY** | `scripts/build-search-index.ts` — add investigation entries to index |
