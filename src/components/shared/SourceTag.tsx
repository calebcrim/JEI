'use client';

import Link from 'next/link';
import { SourceTag as SourceTagType } from '@/types';

const SOURCE_LABELS: Record<SourceTagType, string> = {
  DOJ: 'U.S. Department of Justice EFTA releases',
  FBI: 'FBI 302 interview summaries and Vault FOIA releases',
  HO: 'House Oversight Committee (8,624 documents)',
  SJ: 'Senate Judiciary Committee',
  CBS: 'CBS News investigative reporting',
  NPR: 'NPR reporting',
  NYT: 'The New York Times',
  WSJ: 'The Wall Street Journal',
  CNN: 'CNN reporting',
  Bloomberg: 'Bloomberg reporting',
  AP: 'Associated Press',
  JMail: 'jmail.world — 1,038,603 Epstein emails indexed',
  GH: 'rhowardstone/Epstein-research (GitHub)',
  OSINT: 'Epstein OSINT Database; community research',
  'Maxwell-trial': 'United States v. Maxwell — trial exhibits and testimony',
  'Giuffre-deposition': 'Giuffre v. Maxwell deposition transcripts (unsealed Jan 2024)',
  'Palm-Beach-PD': 'Palm Beach Police Department investigation records (2005–2006)',
  ForensicFinance: 'epstein-forensic-finance by Randall Scott Taylor (CC BY 4.0) — computational forensic accounting of EFTA corpus',
  'FBI-Mogilevich': 'FBI Organized Crime Intelligence Report — Semion Mogilevich Organization (1996)',
  'EFTA-Science': 'EFTA corpus science network analysis — DOJ releases, Harvard/MIT reports, and credible journalism documenting Epstein\'s scientific philanthropy and pandemic-adjacent connections',
};

interface Props {
  source: SourceTagType;
  /** Render as a plain span instead of a link (use when nested inside another anchor). */
  plain?: boolean;
}

export default function SourceTag({ source, plain }: Props) {
  const label = SOURCE_LABELS[source] ?? source;
  const className =
    'inline-flex items-center text-xs font-semibold uppercase tracking-wide bg-surface-elevated text-text-secondary hover:text-accent-blue rounded px-1.5 py-0.5 transition-colors';

  if (plain) {
    return (
      <span className={className} title={label}>
        {source}
      </span>
    );
  }

  return (
    <Link
      href={`/sources#${source.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
      className={className}
      title={label}
    >
      {source}
    </Link>
  );
}
