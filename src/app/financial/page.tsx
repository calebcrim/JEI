'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Person, Connection } from '@/types';
import peopleData from '@/data/people.json';
import connectionsData from '@/data/connections.json';
import Badge from '@/components/shared/Badge';
import SourceTag from '@/components/shared/SourceTag';
import { ChevronDown, ChevronUp, ArrowRight, ExternalLink } from 'lucide-react';

const people = peopleData as Person[];
const connections = connectionsData as Connection[];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function personName(id: string): string {
  return people.find(p => p.id === id)?.name ?? id;
}

function parseAmount(desc: string): number {
  const m = desc.match(/\$([\d,]+)/);
  return m ? parseInt(m[1].replace(/,/g, ''), 10) : 0;
}

/* ------------------------------------------------------------------ */
/* Shell hierarchy data                                                */
/* ------------------------------------------------------------------ */

interface ShellEntity {
  id: string;
  name: string;
  tier: number;
  tierLabel: string;
  color: string;
}

const SHELL_ENTITIES: ShellEntity[] = [
  { id: 'southern-trust-company', name: 'Southern Trust Company Inc.', tier: 1, tierLabel: 'Tier 1 — Holding', color: '#ef4444' },
  { id: 'caterpillar-trust-2017', name: 'The 2017 Caterpillar Trust', tier: 1, tierLabel: 'Tier 1 — Holding', color: '#ef4444' },
  { id: 'haze-trust', name: 'The Haze Trust', tier: 2, tierLabel: 'Tier 2 — Distribution', color: '#f97316' },
  { id: 'southern-financial-llc', name: 'Southern Financial LLC', tier: 2, tierLabel: 'Tier 2 — Distribution', color: '#f97316' },
  { id: 'jeepers-inc', name: 'Jeepers Inc.', tier: 3, tierLabel: 'Tier 3 — Operating', color: '#10b981' },
  { id: 'plan-d-llc', name: 'Plan D LLC', tier: 3, tierLabel: 'Tier 3 — Operating', color: '#10b981' },
  { id: 'gratitude-america', name: 'Gratitude America', tier: 3, tierLabel: 'Tier 3 — Operating', color: '#10b981' },
  { id: 'nes-llc', name: 'NES LLC', tier: 3, tierLabel: 'Tier 3 — Operating', color: '#10b981' },
  { id: 'bv70-llc', name: 'BV70 LLC', tier: 3, tierLabel: 'Tier 3 — Operating', color: '#10b981' },
  { id: 'honeycomb-partners', name: 'Honeycomb Partners LP', tier: 3, tierLabel: 'Tier 3 — Operating', color: '#10b981' },
  { id: 'boothbay-fund', name: 'Boothbay Fund', tier: 3, tierLabel: 'Tier 3 — Operating', color: '#10b981' },
];

/* ------------------------------------------------------------------ */
/* Confidence tier data                                                */
/* ------------------------------------------------------------------ */

const CONFIDENCE_TIERS = [
  { label: 'T1 — Epstein-Controlled', amount: '$1,610,000,000', color: '#ef4444', pct: 75 },
  { label: 'T2 — Known Associates', amount: '$343,000,000', color: '#f97316', pct: 16 },
  { label: 'T3 — Extended Network', amount: '$7,600,000', color: '#eab308', pct: 0.4 },
  { label: 'T4 — Unclassified', amount: '$185,000,000', color: '#6b7280', pct: 8.6 },
];

/* ------------------------------------------------------------------ */
/* Page component                                                      */
/* ------------------------------------------------------------------ */

type SortField = 'amount' | 'from' | 'to' | 'verification';
type SortDir = 'asc' | 'desc';

export default function FinancialPage() {
  const [expandedShell, setExpandedShell] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('amount');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // All financial connections from ForensicFinance
  const financialConns = useMemo(() =>
    connections.filter(c =>
      c.relationshipType === 'financial' &&
      c.sources.includes('ForensicFinance')
    ),
  []);

  const sortedConns = useMemo(() => {
    const sorted = [...financialConns].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      switch (sortField) {
        case 'amount': return mul * (parseAmount(a.description) - parseAmount(b.description));
        case 'from': return mul * personName(a.sourcePersonId).localeCompare(personName(b.sourcePersonId));
        case 'to': return mul * personName(a.targetPersonId).localeCompare(personName(b.targetPersonId));
        case 'verification': return mul * a.verificationStatus.localeCompare(b.verificationStatus);
        default: return 0;
      }
    });
    return sorted;
  }, [financialConns, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <article className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold text-text-primary mb-2">
        Forensic Financial Analysis
      </h1>
      <p className="text-sm text-text-secondary leading-relaxed mb-2">
        Computational forensic accounting of the EFTA corpus — 481 audited wire transfers,
        14 shell entities, 8+ banking institutions. All amounts are automated extractions
        and have not been independently verified. Appearance does not imply wrongdoing.
      </p>
      <p className="text-xs text-text-muted mb-8">
        Financial analysis data from{' '}
        <a
          href="https://github.com/randallscott25-star/epstein-forensic-finance"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-blue hover:underline inline-flex items-center gap-0.5"
        >
          epstein-forensic-finance <ExternalLink size={10} />
        </a>{' '}
        by Randall Scott Taylor (CC BY 4.0).
      </p>

      {/* ── Confidence Tier Breakdown ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Publication Ledger — Confidence Tier Breakdown
        </h2>
        <p className="text-xs text-text-muted mb-3">
          $2,146,000,000 total across 6,310 transactions. T1–T3 auditable subtotal: $1,960,600,000 (104.4% of $1.878B FinCEN SAR benchmark).
        </p>
        <div className="space-y-2">
          {CONFIDENCE_TIERS.map(tier => (
            <div key={tier.label}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className="text-text-secondary">{tier.label}</span>
                <span className="text-text-primary font-mono">{tier.amount}</span>
              </div>
              <div className="h-3 bg-surface-elevated rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{ width: `${Math.max(tier.pct, 1)}%`, backgroundColor: tier.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Verification Wall ── */}
      <section className="mb-12 border border-amber-500/30 bg-amber-500/5 rounded-lg p-5">
        <h2 className="text-lg font-semibold text-amber-400 mb-2">
          The Verification Wall
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          94.8% of NLP-extracted fund flow records are low-confidence noise. Only Bates-stamped
          bank documents from court exhibits constitute verified evidence.
        </p>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="bg-surface-card rounded p-3 border border-surface-border">
            <p className="font-semibold text-green-400 mb-1">Verified (Bates-Stamped)</p>
            <p className="text-text-muted">Court-exhibit authenticated wire transfers with
              specific DB-SDNY Bates numbers. 185 verified wires in the EFTA corpus.</p>
          </div>
          <div className="bg-surface-card rounded p-3 border border-surface-border">
            <p className="font-semibold text-red-400 mb-1">Unverified (NLP-Extracted)</p>
            <p className="text-text-muted">Automated entity-amount associations from OCR text.
              Celebrity names produce $0 verified bank documents despite large NLP-claimed amounts.</p>
          </div>
        </div>
      </section>

      {/* ── 4-Tier Shell Hierarchy ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          4-Tier Shell Trust Hierarchy
        </h2>
        <p className="text-xs text-text-muted mb-4">
          14 entities across 4 functional tiers. Click any entity to see details.
        </p>

        <div className="space-y-2">
          {SHELL_ENTITIES.map(shell => {
            const person = people.find(p => p.id === shell.id);
            const isExpanded = expandedShell === shell.id;
            const shellConns = connections.filter(
              c => (c.sourcePersonId === shell.id || c.targetPersonId === shell.id) &&
                   c.relationshipType === 'financial'
            );

            return (
              <div
                key={shell.id}
                className="border border-surface-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedShell(isExpanded ? null : shell.id)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-elevated/50 transition-colors text-left"
                >
                  <div
                    className="w-3 h-3 rotate-45 rounded-sm shrink-0"
                    style={{ backgroundColor: shell.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-text-primary">{shell.name}</span>
                    <span className="text-xs text-text-muted ml-2">{shell.tierLabel}</span>
                  </div>
                  <span className="text-xs text-text-muted">{shellConns.length} connections</span>
                  {isExpanded ? <ChevronUp size={14} className="text-text-muted" /> : <ChevronDown size={14} className="text-text-muted" />}
                </button>

                {isExpanded && person && (
                  <div className="px-4 pb-4 border-t border-surface-border pt-3">
                    <p className="text-sm text-text-secondary leading-relaxed mb-3">
                      {person.summary}
                    </p>
                    {shellConns.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">Financial Connections</p>
                        {shellConns.map(c => (
                          <div key={c.id} className="flex items-center gap-2 text-xs text-text-secondary">
                            <span className={`w-2 h-2 rounded-full ${c.verificationStatus === 'verified' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                            <Link href={`/people/${c.sourcePersonId}/`} className="text-accent-blue hover:underline">
                              {personName(c.sourcePersonId)}
                            </Link>
                            <ArrowRight size={10} className="text-text-muted" />
                            <Link href={`/people/${c.targetPersonId}/`} className="text-accent-blue hover:underline">
                              {personName(c.targetPersonId)}
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-3">
                      <Link
                        href={`/people/${shell.id}/`}
                        className="text-xs text-accent-blue hover:underline"
                      >
                        View full profile →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Wire Transfer Table ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Financial Connections (Wire Transfers)
        </h2>
        <p className="text-xs text-text-muted mb-4">
          {financialConns.length} financial connections derived from the wire ledger.
          Click column headers to sort.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr>
                <th
                  onClick={() => toggleSort('from')}
                  className="text-left font-semibold text-text-muted uppercase tracking-wider
                             border-b border-surface-border px-3 py-2 bg-surface-card cursor-pointer hover:text-text-secondary"
                >
                  From <SortIcon field="from" />
                </th>
                <th className="w-6" />
                <th
                  onClick={() => toggleSort('to')}
                  className="text-left font-semibold text-text-muted uppercase tracking-wider
                             border-b border-surface-border px-3 py-2 bg-surface-card cursor-pointer hover:text-text-secondary"
                >
                  To <SortIcon field="to" />
                </th>
                <th
                  onClick={() => toggleSort('amount')}
                  className="text-right font-semibold text-text-muted uppercase tracking-wider
                             border-b border-surface-border px-3 py-2 bg-surface-card cursor-pointer hover:text-text-secondary"
                >
                  Details <SortIcon field="amount" />
                </th>
                <th
                  onClick={() => toggleSort('verification')}
                  className="text-center font-semibold text-text-muted uppercase tracking-wider
                             border-b border-surface-border px-3 py-2 bg-surface-card cursor-pointer hover:text-text-secondary w-20"
                >
                  Status <SortIcon field="verification" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedConns.map((c, idx) => (
                <tr
                  key={c.id}
                  className={idx % 2 === 0 ? 'bg-surface' : 'bg-surface-card'}
                >
                  <td className="px-3 py-2 border-b border-surface-border">
                    <Link href={`/people/${c.sourcePersonId}/`} className="text-accent-blue hover:underline">
                      {personName(c.sourcePersonId)}
                    </Link>
                  </td>
                  <td className="text-text-muted text-center border-b border-surface-border">→</td>
                  <td className="px-3 py-2 border-b border-surface-border">
                    <Link href={`/people/${c.targetPersonId}/`} className="text-accent-blue hover:underline">
                      {personName(c.targetPersonId)}
                    </Link>
                  </td>
                  <td className="px-3 py-2 border-b border-surface-border text-right text-text-secondary font-mono">
                    {c.description.split('.')[0]}
                  </td>
                  <td className="px-3 py-2 border-b border-surface-border text-center">
                    <Badge
                      variant="verification"
                      status={c.verificationStatus as 'verified' | 'unverified'}
                    >
                      {c.verificationStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Key Bates Numbers ── */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-text-primary mb-3">Key Bates Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {[
            { bates: 'DB-SDNY-0002962 – DB-SDNY-0006113', desc: 'Leon Black wire transfers' },
            { bates: 'EFTA01075607', desc: '$50M Oct 2008 wire (Epstein → Black Family Partners)' },
            { bates: 'DB-SDNY-0005003', desc: '$23M Kellerhals → Epstein NOW/SuperNow' },
            { bates: 'DB-SDNY-0006153', desc: '$36M Haze Trust internal (Brokerage → Checking)' },
            { bates: 'DB-SDNY-0008063', desc: '$24.6M Haze Trust → Southern Financial LLC' },
            { bates: 'DB-SDNY-0004009', desc: '$20M Narrow Holdings → Southern Trust' },
            { bates: 'DB-SDNY-0005457', desc: '$20M Southern Trust → Honeycomb Partners' },
            { bates: 'DB-SDNY-0006113', desc: '$22.5M BV70 LLC → Plan D LLC' },
            { bates: 'DB-SDNY-0005122', desc: 'Rothschild $15M + Black $10M → Southern Trust (same day cluster)' },
            { bates: 'DB-SDNY-0006982', desc: '$10.5M Blockchain Capital → 2017 Caterpillar Trust' },
          ].map(b => (
            <div key={b.bates} className="flex items-start gap-2 bg-surface-card rounded px-3 py-2 border border-surface-border">
              <span className="font-mono text-accent-blue shrink-0">{b.bates}</span>
              <span className="text-text-muted">{b.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Source attribution ── */}
      <div className="border-t border-surface-border pt-4 flex items-center gap-2">
        <SourceTag source="ForensicFinance" plain />
        <span className="text-xs text-text-muted">
          All data on this page originates from the epstein-forensic-finance repository (CC BY 4.0).
        </span>
      </div>
    </article>
  );
}
