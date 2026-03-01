// src/data/investigation-status.ts
// Active proceedings, FOIA requests, and congressional investigations as of March 2026.
// All proceedings are manually curated from research source files.
// Last updated: March 2026. Update manually after major developments.
// personIds must match actual person IDs in people.json.
// themeIds must match actual theme IDs in themes.json.
// Do not alter proceeding prose — render as written.

export type ProceedingStatus =
  | 'active'      // ongoing, recent activity
  | 'pending'     // filed or requested, awaiting action
  | 'scheduled'   // has a specific future date
  | 'stalled'     // blocked or unresolved with no clear next step
  | 'resolved';   // concluded (include for historical context on recent resolutions)

export type ProceedingType =
  | 'criminal'      // criminal charges or investigation
  | 'civil'         // civil lawsuit or settlement
  | 'congressional' // hearing, deposition, or contempt proceeding
  | 'foia'          // FOIA request or document dispute
  | 'international' // foreign jurisdiction prosecution
  | 'regulatory';   // regulatory or administrative action

export interface Proceeding {
  id: string;
  type: ProceedingType;
  status: ProceedingStatus;
  title: string;          // 4–8 words: what this proceeding is
  description: string;    // 1–2 sentences: what's happening and why it matters
  date?: string;          // next event date, resolution date, or "Pending" / "Ongoing"
  url?: string;           // direct link to filing, hearing, or news coverage
  personIds: string[];    // people directly involved
  themeIds: string[];     // themes this proceeding connects to
  isGlobal?: boolean;     // show in the Timeline page banner regardless of context
}

export const proceedings: Proceeding[] = [

  // ─── Criminal proceedings ────────────────────────────────────────────────

  {
    id: 'maxwell-appeals',
    type: 'criminal',
    status: 'active',
    title: 'Maxwell Sentence Appeals',
    description: `Maxwell is appealing her 20-year sentence. Her attorney has offered testimony
      exonerating both Trump and Clinton in exchange for clemency — an offer that was rejected
      by House Oversight in February 2026. The appeals represent the last active criminal
      proceeding in U.S. federal court directly connected to the trafficking operation.`,
    date: 'Ongoing',
    personIds: ['ghislaine-maxwell'],
    themeIds: ['maxwell-role-legal-history-current-status', 'the-co-conspirators-immunity-grantees'],
  },
  {
    id: 'prince-andrew-uk-criminal',
    type: 'international',
    status: 'active',
    title: 'Prince Andrew UK Arrest',
    description: `Arrested February 19, 2026 — the first arrest of a senior British royal
      in approximately 400 years — on suspicion of sharing confidential trade reports with
      Epstein while serving as UK trade envoy. UK police are leading; formal charges pending.`,
    date: 'Active — charges pending',
    personIds: ['prince-andrew-duke-of-york'],
    themeIds: ['international-consequences-fallout', 'intelligence-connections'],
    isGlobal: true,
  },
  {
    id: 'mandelson-uk-criminal',
    type: 'international',
    status: 'active',
    title: 'Peter Mandelson UK Arrest',
    description: `Arrested February 23, 2026 on suspicion of passing market-sensitive
      government information to Epstein while serving as Business Secretary. Emails show
      Mandelson told Epstein "finally got him to go today" on May 10, 2010, the day before
      PM Brown resigned.`,
    date: 'Active — charges pending',
    personIds: ['peter-mandelson'],
    themeIds: ['international-consequences-fallout', 'intelligence-connections'],
    isGlobal: true,
  },
  {
    id: 'jagland-norway-criminal',
    type: 'international',
    status: 'active',
    title: 'Jagland Norway Corruption Charges',
    description: `Former Norwegian PM and Council of Europe Secretary General Thorbjørn Jagland
      was charged with gross corruption by Norway's Økokrim on February 24, 2026. He was
      subsequently hospitalized after an apparent suicide attempt. Norway's PM ordered a
      separate national investigation.`,
    date: 'Active',
    personIds: ['thorbjrn-jagland'],
    themeIds: ['international-consequences-fallout'],
    isGlobal: true,
  },
  {
    id: 'nm-criminal-investigation',
    type: 'criminal',
    status: 'active',
    title: 'New Mexico AG Criminal Investigation Reopened',
    description: `New Mexico AG Raúl Torrez reopened the criminal investigation into Epstein's
      Zorro Ranch in February 2026. The state legislature passed legislation for a full
      bipartisan truth commission with subpoena power. DOJ files contain anonymous allegations
      of bodies buried on the property — unverified.`,
    date: 'Active',
    personIds: [],
    themeIds: ['the-trafficking-operation'],
    isGlobal: true,
  },
  {
    id: 'fbi-investigation-open',
    type: 'criminal',
    status: 'stalled',
    title: 'FBI Investigation — Not Formally Closed',
    description: `The FBI has not formally closed its investigation. FBI Director Kash Patel
      refused to answer nine direct questions at September 2025 congressional hearings,
      including whether he told AG Bondi that Trump's name appeared in the files. No new
      charges have been filed; no co-conspirators beyond Maxwell have been prosecuted.`,
    date: 'No announced timeline',
    personIds: ['fbi-director-kash-patel'],
    themeIds: ['the-co-conspirators-immunity-grantees', 'the-acosta-plea-deal-legal-history'],
  },

  // ─── Civil proceedings ───────────────────────────────────────────────────

  {
    id: 'leon-black-bank-of-america-trial',
    type: 'civil',
    status: 'scheduled',
    title: 'Leon Black / Bank of America Civil Trial',
    description: `Civil trial scheduled May 11, 2026. Black paid Epstein approximately $158 million
      in advisory fees — the largest known payment from any single individual. The trial may
      produce testimony about the nature of those payments and Black's knowledge of the
      trafficking operation.`,
    date: 'May 11, 2026',
    url: 'https://www.justice.gov/epstein/court-records',
    personIds: ['leon-black'],
    themeIds: ['financial-crimes-money-laundering'],
    isGlobal: true,
  },
  {
    id: 'usvi-proceedings',
    type: 'civil',
    status: 'active',
    title: 'U.S. Virgin Islands Civil Proceedings',
    description: `USVI has ongoing civil proceedings stemming from Epstein's use of Little
      St. James Island as a trafficking site. The USVI attorney general reached a settlement
      with JPMorgan and is continuing to pursue other claims. Little St. James logbooks
      referenced in FBI evidence inventory have not been fully released.`,
    date: 'Ongoing',
    personIds: [],
    themeIds: ['the-trafficking-operation', 'financial-crimes-money-laundering'],
  },

  // ─── Congressional proceedings ───────────────────────────────────────────

  {
    id: 'clinton-depositions',
    type: 'congressional',
    status: 'scheduled',
    title: 'Clinton House Oversight Depositions',
    description: `Bill and Hillary Clinton were scheduled for House Oversight depositions
      February 26–27, 2026, after bipartisan contempt proceedings were initiated. As of
      the research compilation date, the depositions had not yet taken place.`,
    date: 'February 26–27, 2026 (scheduled)',
    personIds: ['bill-clinton'],
    themeIds: ['media-congressional-investigations', 'political-intelligence-network'],
    isGlobal: true,
  },
  {
    id: 'lutnick-congressional',
    type: 'congressional',
    status: 'pending',
    title: 'Howard Lutnick Commerce Secretary Scrutiny',
    description: `Commerce Secretary Howard Lutnick faces bipartisan calls for resignation
      after AG Bondi deflected questions about his Epstein ties during the February 11, 2026
      hearing. Rep. Balint pressed Bondi specifically on Lutnick, Phelan, and Feinberg.
      No formal action has been taken as of compilation date.`,
    date: 'Pending',
    personIds: ['howard-lutnick'],
    themeIds: ['political-intelligence-network'],
  },
  {
    id: 'wexner-wyden-investigation',
    type: 'congressional',
    status: 'active',
    title: 'Wexner / Wyden Senate Finance Investigation',
    description: `Senator Ron Wyden's Senate Finance Committee investigation tracking Epstein's
      financial network includes Wexner as a central figure. Wexner was labeled "unindicted
      co-conspirator" in a 2019 FBI Criminal Investigative Division document. Wyden's S.2746
      would compel Treasury to release its locked "Epstein File" — the financial investigation
      DOJ has declined to conduct.`,
    date: 'Ongoing',
    personIds: ['leslie-wexner-les-wexner'],
    themeIds: ['financial-crimes-money-laundering', 'media-congressional-investigations'],
  },
  {
    id: 'bondi-contempt-possible',
    type: 'congressional',
    status: 'pending',
    title: 'AG Bondi Congressional Accountability',
    description: `Rep. Lieu accused AG Bondi of lying under oath during the February 11, 2026
      hearing. Bondi refused to say how many co-conspirators have been indicted, declined to
      elaborate on her "client list" claim, and deflected on Lutnick, Phelan, and Feinberg
      ties. No contempt resolution has been filed as of compilation date.`,
    date: 'Pending',
    personIds: ['pam-bondi'],
    themeIds: ['the-co-conspirators-immunity-grantees', 'media-congressional-investigations'],
  },

  // ─── FOIA proceedings ────────────────────────────────────────────────────

  {
    id: 'wyden-treasury-foia',
    type: 'foia',
    status: 'pending',
    title: 'Wyden S.2746 — Treasury "Epstein File"',
    description: `Senator Ron Wyden introduced S.2746 to compel the Treasury Department to
      release its locked "Epstein File." The Senate Finance Committee has formally requested
      records from four banks. Treasury has not complied. This is the primary unresolved
      financial accountability action.`,
    date: 'Pending — no compliance deadline set',
    url: 'https://www.finance.senate.gov',
    personIds: [],
    themeIds: ['financial-crimes-money-laundering'],
    isGlobal: true,
  },
  {
    id: 'faa-flight-plans-foia',
    type: 'foia',
    status: 'pending',
    title: 'FAA Flight Plans — 835 Post-2013 Flights',
    description: `No passenger manifests exist for any of Epstein's 835 documented flights
      after August 2013, despite those flights continuing through his 2019 arrest. FOIA
      requests to FAA for flight plans filed for aircraft N908JE, N212JE, and N491GM
      (2013–2019) remain unfulfilled. Business Insider's 2020 FOIA uncovered 704 unknown
      flights; the post-2013 passenger data has not been recovered.`,
    date: 'Pending',
    personIds: [],
    themeIds: ['the-trafficking-operation'],
  },
  {
    id: 'fbi-evidence-index-foia',
    type: 'foia',
    status: 'pending',
    title: 'FBI Evidence Index — Seized Electronic Materials',
    description: `The FBI seized 40+ computers, 26 storage drives, 70+ CDs, and 6 recording
      devices from Epstein's properties. A three-page evidence index has been referenced in
      source files but not released under EFTA. The seized media may include surveillance
      footage from Epstein's hidden camera system. FOIA requests pending to FBI New York
      Field Office.`,
    date: 'Pending',
    personIds: [],
    themeIds: ['the-trafficking-operation', 'epsteins-death-mcc-anomalies'],
  },
  {
    id: 'doi-oig-complaint',
    type: 'regulatory',
    status: 'pending',
    title: 'Democracy Defenders Fund OIG Complaint',
    description: `The Democracy Defenders Fund filed an OIG complaint alleging the DOJ
      altered documents after initial publication of the EFTA release. The O'Keefe recording
      of DOJ acting Deputy Chief Joseph Schnitt alleging political interference in redactions
      was cited. DOJ has not responded publicly.`,
    date: 'Pending',
    personIds: [],
    themeIds: ['efta-release-framework-document-architecture'],
  },
];

// ─── Lookup helpers ──────────────────────────────────────────────────────

/** Get all proceedings involving a specific person */
export function getProceedingsForPerson(personId: string): Proceeding[] {
  return proceedings.filter((p) => p.personIds.includes(personId));
}

/** Get all proceedings connected to a specific theme */
export function getProceedingsForTheme(themeId: string): Proceeding[] {
  return proceedings.filter((p) => p.themeIds.includes(themeId));
}

/** Get the N most significant global proceedings for the timeline banner */
export function getGlobalProceedings(limit = 5): Proceeding[] {
  const priority: Record<ProceedingStatus, number> = {
    active: 0, scheduled: 1, pending: 2, stalled: 3, resolved: 4,
  };
  return proceedings
    .filter((p) => p.isGlobal)
    .sort((a, b) => priority[a.status] - priority[b.status])
    .slice(0, limit);
}

/** Status label and color for rendering */
export const STATUS_CONFIG: Record<ProceedingStatus, {
  label: string;
  dotClass: string;
  textClass: string;
  borderClass: string;
}> = {
  active:    { label: 'Active',    dotClass: 'bg-green-500',  textClass: 'text-green-400',  borderClass: 'border-green-800/40' },
  scheduled: { label: 'Scheduled', dotClass: 'bg-blue-400',   textClass: 'text-blue-400',   borderClass: 'border-blue-800/40' },
  pending:   { label: 'Pending',   dotClass: 'bg-amber-400',  textClass: 'text-amber-400',  borderClass: 'border-amber-800/40' },
  stalled:   { label: 'Stalled',   dotClass: 'bg-zinc-500',   textClass: 'text-zinc-400',   borderClass: 'border-zinc-700/40' },
  resolved:  { label: 'Resolved',  dotClass: 'bg-zinc-600',   textClass: 'text-zinc-500',   borderClass: 'border-zinc-700/40' },
};

export const TYPE_LABELS: Record<ProceedingType, string> = {
  criminal:     'Criminal',
  civil:        'Civil',
  congressional:'Congressional',
  foia:         'FOIA',
  international:'International',
  regulatory:   'Regulatory',
};
