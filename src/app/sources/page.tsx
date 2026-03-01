import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sources',
  description: 'Full legend of all source abbreviations used in the Epstein Files Database.',
};

const SOURCES = [
  {
    abbr: 'DOJ',
    full: 'U.S. Department of Justice EFTA releases (Datasets 1–12)',
    type: 'Government',
    notes: 'justice.gov/epstein — primary source',
  },
  {
    abbr: 'FBI',
    full: 'FBI 302 interview summaries and Vault FOIA releases',
    type: 'Government',
    notes: '302 memos document allegations, not conclusions',
  },
  {
    abbr: 'HO',
    full: 'House Oversight Committee (8,624 documents)',
    type: 'Congressional',
    notes: '',
  },
  {
    abbr: 'SJ',
    full: 'Senate Judiciary Committee',
    type: 'Congressional',
    notes: '',
  },
  {
    abbr: 'CBS',
    full: 'CBS News investigative reporting',
    type: 'Journalism',
    notes: '',
  },
  {
    abbr: 'NPR',
    full: 'NPR reporting',
    type: 'Journalism',
    notes: '',
  },
  {
    abbr: 'NYT',
    full: 'The New York Times',
    type: 'Journalism',
    notes: '',
  },
  {
    abbr: 'WSJ',
    full: 'The Wall Street Journal',
    type: 'Journalism',
    notes: '',
  },
  {
    abbr: 'CNN',
    full: 'CNN reporting',
    type: 'Journalism',
    notes: '',
  },
  {
    abbr: 'Bloomberg',
    full: 'Bloomberg reporting',
    type: 'Journalism',
    notes: '',
  },
  {
    abbr: 'AP',
    full: 'Associated Press',
    type: 'Journalism',
    notes: '',
  },
  {
    abbr: 'JMail',
    full: 'jmail.world — 1,038,603 Epstein emails indexed',
    type: 'Community',
    notes: "Emails are self-serving statements",
  },
  {
    abbr: 'GH',
    full: 'rhowardstone/Epstein-research (GitHub)',
    type: 'Community',
    notes: '100+ forensic reports, 1,536-person entity registry',
  },
  {
    abbr: 'OSINT',
    full: 'Epstein OSINT Database (Notion); epsteinexposed.com; community research',
    type: 'Community',
    notes: 'Verify against primary sources',
  },
  {
    abbr: 'Maxwell-trial',
    full: 'United States v. Maxwell, S.D.N.Y., trial exhibits and testimony',
    type: 'Court',
    notes: 'High reliability — cross-examined testimony',
  },
  {
    abbr: 'Giuffre-deposition',
    full: 'Giuffre v. Maxwell deposition transcripts (unsealed Jan 2024)',
    type: 'Court',
    notes: 'Sworn testimony',
  },
  {
    abbr: 'Palm-Beach-PD',
    full: 'Palm Beach Police Department investigation records (2005–2006)',
    type: 'Law enforcement',
    notes: '',
  },
  {
    abbr: 'ForensicFinance',
    full: 'epstein-forensic-finance by Randall Scott Taylor — computational forensic accounting of 1.48M EFTA documents (CC BY 4.0)',
    type: 'Community',
    notes: 'All amounts are automated extractions (Unverified). Only Bates-stamped bank documents constitute verified evidence.',
  },
] as const;

const TYPE_COLORS: Record<string, string> = {
  Government: 'text-category-political',
  Congressional: 'text-category-intelligence',
  Journalism: 'text-category-media',
  Community: 'text-status-unverified',
  Court: 'text-status-verified',
  'Law enforcement': 'text-category-lawEnforcement',
};

export default function SourcesPage() {
  return (
    <article className="max-w-[720px] mx-auto px-6 py-16">
      <div className="mb-2">
        <Link href="/about/" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
          ← About
        </Link>
      </div>
      <h1 className="text-3xl font-semibold text-text-primary mb-2">
        Sources &amp; Abbreviations
      </h1>
      <p className="text-sm text-text-secondary leading-relaxed mb-10">
        Every source abbreviation used throughout the database is defined below. Click any
        source tag in the database to jump to its entry here.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider
                             border-b border-surface-border px-3 py-2 bg-surface-card w-28">
                Abbreviation
              </th>
              <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider
                             border-b border-surface-border px-3 py-2 bg-surface-card">
                Full Source
              </th>
              <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider
                             border-b border-surface-border px-3 py-2 bg-surface-card w-28">
                Type
              </th>
              <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider
                             border-b border-surface-border px-3 py-2 bg-surface-card">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {SOURCES.map((src, idx) => (
              <tr
                key={src.abbr}
                id={src.abbr.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                className={idx % 2 === 0 ? 'bg-surface' : 'bg-surface-card'}
              >
                <td className="px-3 py-2.5 border-b border-surface-border">
                  <span className="font-mono text-xs font-semibold text-text-primary">
                    {src.abbr}
                  </span>
                </td>
                <td className="px-3 py-2.5 border-b border-surface-border text-text-secondary text-xs">
                  {src.full}
                </td>
                <td className="px-3 py-2.5 border-b border-surface-border">
                  <span className={`text-xs font-medium ${TYPE_COLORS[src.type] ?? 'text-text-muted'}`}>
                    {src.type}
                  </span>
                </td>
                <td className="px-3 py-2.5 border-b border-surface-border text-text-muted text-xs">
                  {src.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 border-l-2 border-surface-border pl-4 text-xs text-text-secondary leading-relaxed">
        Source reliability varies significantly. Court testimony (cross-examined, under oath) is
        the highest-reliability source in this database. Anonymous FBI tip reports (NTOC) are the
        lowest. Community research tools are valuable for navigation and discovery but should be
        cross-referenced against primary DOJ documents before citation.
      </div>
    </article>
  );
}
