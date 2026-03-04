// src/data/timeline-causality.ts
// Era synthesis paragraphs and causal event pair annotations for the Timeline.
// Era IDs must match the TimelineEra type in src/types/index.ts.
// Causal event IDs must match actual event IDs in src/data/timeline.json.
// Verified via: node -e "require('./src/data/timeline.json').forEach(e => console.log(e.id))"

export type TimelineEra =
  | 'pre-1990' | '1990-2000' | '2001-2007'
  | '2008-2018' | '2019' | '2020-present';

// ─── Era Synthesis Paragraphs ─────────────────────────────────────────────

export interface EraSynthesis {
  era: TimelineEra;
  headline: string;        // 6-10 words: the era's defining pattern
  synthesis: string;       // 3-5 sentences of analytical prose
  keyShift: string;        // 1 sentence: what changed at the end of this era
}

export const eraSyntheses: EraSynthesis[] = [
  {
    era: 'pre-1990',
    headline: 'Before the Machine: Origins and Early Access',
    synthesis: `The pre-1990 record establishes the biographical preconditions for everything that followed — Epstein's entry into Bear Stearns in 1976 without a college degree, his relationship with Les Wexner that would eventually produce a multi-hundred-million-dollar transfer of wealth and property, and his departure from Bear Stearns under circumstances that have never been fully explained. The Dalton School hiring in September 1974 — sometimes attributed to Donald Barr, father of future Attorney General William Barr, though Barr's contract expired June 30, 1974 and interim headmaster Peter Branch is the more likely hiring authority — is a small fact that becomes significant only in retrospect. The key pattern of this period is Epstein gaining access to powerful institutions and wealthy individuals through an unusual combination of financial acumen and cultivated social presentation, without the credentials or background those institutions typically required.`,
    keyShift: `By the late 1980s, Epstein had established the Wexner relationship and the financial infrastructure that would fund the network's expansion in the following decade.`,
  },
  {
    era: '1990-2000',
    headline: 'Building the Machine: Infrastructure and Recruitment',
    synthesis: `The 1990s are when the operation became systematic. The Manhattan townhouse transferred from Wexner (1989–1993), the Palm Beach estate, the private island, the New Mexico Zorro Ranch — the property infrastructure of the network was established in this decade. Ghislaine Maxwell arrived in New York following her father Robert Maxwell's death in 1991 and became the operational director of the recruitment and management system. Jean-Luc Brunel's MC2 Model Management extended the recruitment infrastructure internationally. The 1990s events show a deliberate buildout: not one predator acting opportunistically, but a system with logistics, staff, properties across multiple jurisdictions, and international reach — all funded by wealth whose origins remain only partially explained.`,
    keyShift: `By 2000, the trafficking infrastructure was fully operational across at least four major properties, with an international recruitment arm and a management layer that insulated Epstein from direct contact with victims during initial recruitment.`,
  },
  {
    era: '2001-2007',
    headline: 'Exposure and Evasion: The Florida Investigation',
    synthesis: `This era is defined by the Palm Beach Police Department investigation that began in 2005 and the extraordinary legal maneuvering that followed. Detective Joseph Recarey's investigation documented the trafficking operation at the Palm Beach estate with a level of evidentiary specificity that should have led to serious federal charges. Instead, Alexander Acosta's office in the Southern District of Florida negotiated a Non-Prosecution Agreement in 2007–2008 that gave Epstein an 18-month state plea, daily work release, and — most critically — blanket immunity for unnamed co-conspirators, without notifying victims as required by the Crime Victims' Rights Act. The legal record from this era is among the most extensively documented parts of the case, precisely because the 2019 prosecution and Maxwell trial later scrutinized these years in detail.`,
    keyShift: `The 2008 NPA ended federal accountability for the trafficking operation and granted immunity to an undetermined number of unnamed co-conspirators — the most significant legal outcome of the case, before any conviction.`,
  },
  {
    era: '2008-2018',
    headline: 'Post-Conviction Networking: Immunity and Continued Access',
    synthesis: `This is the era that most confounds intuition. Epstein served 13 months of an 18-month sentence — with daily work release — and emerged to resume his social and professional network almost immediately. The flight logs document him traveling to New York and his other properties almost continuously following release. The political and academic relationships documented in this period — visits from prominent figures, continued funding of academic institutions, new relationships built despite the 2008 conviction — suggest that the NPA's immunity provisions had effectively quarantined the legal consequences without producing social consequences. Efforts by victims' attorneys to challenge the NPA, and Julie Brown's Miami Herald investigation beginning in 2018, mark the beginning of the end of this period.`,
    keyShift: `Julie Brown's November 2018 Miami Herald series "Perversion of Justice" broke the sealed NPA documents into public consciousness and triggered the federal investigation that would lead to Epstein's 2019 re-arrest.`,
  },
  {
    era: '2019',
    headline: 'Second Arrest, Death, and Unanswered Questions',
    synthesis: `The 2019 era spans six months and contains the densest cluster of consequential events in the entire timeline. Epstein was arrested at Teterboro Airport on July 6, 2019, on charges that overlapped substantially with the original Florida investigation. He was denied bail, placed at the Metropolitan Correctional Center in Manhattan, placed on suicide watch following an incident on July 23, removed from suicide watch on July 29, and found dead on August 10. The MCC surveillance footage from August 9–10 was subsequently confirmed destroyed. Two guards on duty that night were found to have been asleep and falsified their logs. The medical examiner ruled the death a suicide; the private examiner retained by Epstein's estate ruled the evidence more consistent with homicide. Attorney General William Barr — whose father was headmaster at Dalton when Epstein was hired in September 1974, though the direct hiring claim is unverified — called the death a suicide and closed the primary prosecution.`,
    keyShift: `Epstein's death without trial ended the federal prosecution before any co-conspirators were named in court, produced no public testimony about the network's full scope, and left the most significant accountability question in the case permanently open.`,
  },
  {
    era: '2020-present',
    headline: 'The EFTA Era: Documents, Trials, and Ongoing Investigation',
    synthesis: `The post-2019 period is defined by two tracks running in parallel: the Maxwell prosecution (arrested December 2020, convicted December 2021, sentenced June 2022) and the document release track that culminated in the Epstein Files Transparency Act. Maxwell's trial produced the most authoritative courtroom record of the trafficking operation's mechanics, but her refusal to name additional co-conspirators — and the reportedly rejected offer to implicate Donald Trump in exchange for sentence reduction — meant the trial's accountability was bounded. The EFTA, passed with a veto-proof majority in 2025 despite executive opposition, produced 3.5 million pages across 12 datasets. Community researchers using tools built for the purpose — JMail.world, EpsteinExposed.com, multiple GitHub repositories — are systematically working through the release. Congressional investigations and international prosecutions (France, Germany) continue. The Wexner congressional deposition in February 2026 — the first time he testified under oath — produced five hours of claimed non-recollection.`,
    keyShift: `As of early 2026, the accountability record consists of one conviction (Maxwell), no named co-conspirators beyond those identified by victims' lawsuits, and 3.5 million pages of documents that remain largely unanalyzed.`,
  },
];

// ─── Causal Event Pairs ───────────────────────────────────────────────────
// Each entry defines a directional causal relationship between two events.
// causeId: the event that produced the consequence
// consequenceId: the event that was produced
// description: 1 sentence explaining the causal mechanism
// All IDs verified against actual timeline.json (Phase 0/8 verification).
// Unknown IDs are filtered out silently at render time.

export interface CausalPair {
  causeId: string;          // upstream event ID
  consequenceId: string;    // downstream event ID
  description: string;      // 1 sentence causal mechanism
}

export const causalPairs: CausalPair[] = [
  // ── Pre-1990 → 1990-2000 ───────────────────────────────────────────────
  {
    causeId: '1985-wexner-epstein-money-management-relation',
    consequenceId: '1991-wexner-power-of-attorney-granted',
    description: `The money management relationship that began in 1985 deepened into full power of attorney by 1991, giving Epstein legal authority over Wexner's finances and enabling the property acquisitions that built the network's infrastructure.`,
  },
  {
    causeId: '1991-wexner-power-of-attorney-granted',
    consequenceId: '1992-little-st-james-island-purchased',
    description: `Wexner's grant of power of attorney over his finances gave Epstein the legal authority and financial resources to acquire Little St. James Island, which became the network's most notorious operational site.`,
  },

  // ── 1990-2000 → 2001-2007 ─────────────────────────────────────────────
  {
    causeId: '1990-palm-beach-mansion-acquired',
    consequenceId: '2005-palm-beach-police-investigation-opens',
    description: `The Palm Beach estate was the primary site of the documented trafficking activity that triggered the 2005 Palm Beach Police Department investigation.`,
  },

  // ── 2001-2007 causal chains ───────────────────────────────────────────
  {
    causeId: '2005-palm-beach-police-investigation-opens',
    consequenceId: '2007-09-24-non-prosecution-agreement-signed',
    description: `The Palm Beach PD investigation produced the evidentiary record — victim testimony, DNA evidence, surveillance — that was referred to the Southern District of Florida, where Acosta's office negotiated the Non-Prosecution Agreement instead of proceeding with federal charges.`,
  },
  {
    causeId: '2007-09-24-non-prosecution-agreement-signed',
    consequenceId: '2008-epstein-convicted-sentenced-to-18-months',
    description: `The NPA's terms required Epstein to plead guilty to state prostitution charges in exchange for federal immunity — transforming what should have been serious federal trafficking charges into an 18-month state sentence with daily work release.`,
  },

  // ── 2008-2018 causal chains ───────────────────────────────────────────
  {
    causeId: '2008-epstein-convicted-sentenced-to-18-months',
    consequenceId: '2009-07-04-epstein-released-from-jail',
    description: `Epstein served 13 months of his 18-month state sentence — with daily 12-hour work release — and was released on July 4, 2009 with the NPA's immunity provisions intact.`,
  },
  {
    causeId: '2009-07-04-epstein-released-from-jail',
    consequenceId: '2010-12-first-gates-epstein-meeting-post-convict',
    description: `Epstein's release, with the immunity grants intact, allowed him to immediately resume political and academic relationships that his conviction should have foreclosed — including meetings with Bill Gates beginning in late 2010, documented in the post-conviction flight and meeting record.`,
  },

  // ── 2019 causal chains ────────────────────────────────────────────────
  {
    causeId: '2019-07-06-jeffrey-epstein-arrested-second-arrest',
    consequenceId: '2019-07-23-first-mcc-injury-incident',
    description: `Epstein was arrested at Teterboro Airport on July 6, denied bail, and placed at the Metropolitan Correctional Center, where 17 days later he was found with injuries in his cell — the incident that triggered suicide watch placement.`,
  },
  {
    causeId: '2019-07-23-first-mcc-injury-incident',
    consequenceId: '2019-08-09-cellmate-transferred-no-replacement-unau',
    description: `Despite the July 23 injury incident that had prompted suicide watch, Epstein was removed from suicide watch on July 29 and by August 9 his cellmate was transferred with no replacement — leaving the highest-profile federal detainee in the country alone in his cell with guards who would later admit to falsifying their logs.`,
  },
  {
    causeId: '2019-08-09-cellmate-transferred-no-replacement-unau',
    consequenceId: '2019-08-10-doj-draft-death-statement-dated-august-9',
    description: `With no cellmate and guards who had fallen asleep and falsified monitoring logs, Epstein was found dead the morning of August 10. The DOJ had prepared a draft death statement dated August 9 — the day before.`,
  },
  {
    causeId: '2024-06-fbi-destroys-mcc-master-surveillance-vid',
    consequenceId: '2025-07-06-dojfbi-two-page-memo-no-client-list-suic',
    description: `The FBI's confirmed destruction of the MCC master surveillance video means the core evidentiary question — what happened in Epstein's cell between lights-out and when guards found him — cannot be answered from the documentary record, contributing to the DOJ's two-page memo dismissing further investigation.`,
  },
  {
    causeId: '2019-08-10-doj-draft-death-statement-dated-august-9',
    consequenceId: '2026-02-02-blanche-states-no-additional-prosecution',
    description: `Epstein's death terminated the SDNY prosecution before any co-conspirators were charged or named in court — the primary consequence of his death for accountability, formalized years later in Blanche's announcement of no additional prosecutions.`,
  },
  {
    causeId: '2019-08-10-doj-draft-death-statement-dated-august-9',
    consequenceId: '2020-07-02-ghislaine-maxwell-arrested',
    description: `With Epstein dead, federal prosecutors redirected investigative resources to Maxwell as the most senior living figure with operational knowledge of the network, leading to her arrest in July 2020.`,
  },

  // ── 2019 → 2020-present ────────────────────────────────────────────────
  {
    causeId: '2020-07-02-ghislaine-maxwell-arrested',
    consequenceId: '2021-maxwell-trial',
    description: `Maxwell's arrest in July 2020 led to a trial that produced the most authoritative courtroom record of the trafficking operation's mechanics, though her refusal to name additional co-conspirators bounded the trial's accountability.`,
  },
  {
    causeId: '2021-maxwell-trial',
    consequenceId: '2022-06-28-maxwell-sentenced-to-20-years',
    description: `Maxwell's conviction on five counts of sex trafficking and conspiracy in December 2021 resulted in a 20-year sentence — but did not produce the testimony about additional co-conspirators that investigators had sought.`,
  },
  {
    causeId: '2025-11-18-efta-passes-house-4271-and-senate-unanim',
    consequenceId: '2025-12-19-datasets-17-released',
    description: `The EFTA's passage with a veto-proof majority — 427-1 in the House and unanimous in the Senate — compelled the DOJ to begin releasing the 3.5 million page document corpus, starting with Datasets 1-7 in December 2025.`,
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────

/** Get all events that caused this event (upstream) */
export function getCausedBy(eventId: string): CausalPair[] {
  return causalPairs.filter((p) => p.consequenceId === eventId);
}

/** Get all events this event led to (downstream consequences) */
export function getLeadsTo(eventId: string): CausalPair[] {
  return causalPairs.filter((p) => p.causeId === eventId);
}

/** Get synthesis for a given era */
export function getEraSynthesis(era: string): EraSynthesis | undefined {
  return eraSyntheses.find((s) => s.era === era);
}
