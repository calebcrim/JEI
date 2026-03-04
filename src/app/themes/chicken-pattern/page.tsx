'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Search,
  AlertTriangle,
  Users,
  BookOpen,
} from 'lucide-react';
import dataset from '@/data/chicken-pattern-dataset.json';
import peopleData from '@/data/people.json';
import type { Person } from '@/types';

const allPeople = peopleData as Person[];

// ─── Types for the dataset ───────────────────────────────────────────────

type Classification =
  | 'CONFIRMED_PERSON'
  | 'PERSON_HIGH_CONFIDENCE'
  | 'PERSON_MODERATE_CONFIDENCE'
  | 'AMBIGUOUS'
  | 'CHICKEN_MAN_CLINTON'
  | 'CONFIRMED_FOOD'
  | 'UNREVIEWED';

type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'PENDING';

interface Document {
  id: string;
  batch: number;
  efta: string;
  dataset: string;
  url: string;
  date: string;
  from: string;
  to: string;
  subject: string;
  body_excerpt: string;
  classification: Classification;
  confidence: string;
  significance: string;
  tags: string[];
  research_priority: Priority;
  network_note?: string;
  linked_documents?: string[];
  named_individuals?: string[];
  note?: string;
  investigation_lead?: string;
}

// ─── Classification badge colors ─────────────────────────────────────────

const CLASSIFICATION_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  CONFIRMED_PERSON:            { label: 'Confirmed Person',  bg: 'bg-red-500/15',    text: 'text-red-400',    border: 'border-red-800/40' },
  PERSON_HIGH_CONFIDENCE:      { label: 'High Confidence',   bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-800/40' },
  PERSON_MODERATE_CONFIDENCE:  { label: 'Moderate Confidence', bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-800/40' },
  AMBIGUOUS:                   { label: 'Ambiguous',         bg: 'bg-zinc-500/15',   text: 'text-zinc-400',   border: 'border-zinc-700/40' },
  CHICKEN_MAN_CLINTON:         { label: 'Chicken Man = Clinton', bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-800/40' },
  CONFIRMED_FOOD:              { label: 'Confirmed Food',    bg: 'bg-green-500/15',  text: 'text-green-400',  border: 'border-green-800/40' },
  UNREVIEWED:                  { label: 'Unreviewed',        bg: 'bg-zinc-500/15',   text: 'text-zinc-500',   border: 'border-zinc-700/40' },
};

const PRIORITY_CONFIG: Record<string, { label: string; text: string }> = {
  CRITICAL: { label: 'Critical', text: 'text-red-400' },
  HIGH:     { label: 'High',     text: 'text-orange-400' },
  MEDIUM:   { label: 'Medium',   text: 'text-amber-400' },
  LOW:      { label: 'Low',      text: 'text-zinc-400' },
  PENDING:  { label: 'Pending',  text: 'text-zinc-500' },
};

const NON_FOOD_CLASSIFICATIONS: Classification[] = [
  'CONFIRMED_PERSON',
  'PERSON_HIGH_CONFIDENCE',
  'PERSON_MODERATE_CONFIDENCE',
  'AMBIGUOUS',
  'CHICKEN_MAN_CLINTON',
];

// ─── Helpers ─────────────────────────────────────────────────────────────

function personSlugForName(name: string): string | null {
  const p = allPeople.find(
    (person) =>
      person.name.toLowerCase() === name.toLowerCase() ||
      (person.aliases && person.aliases.some((a) => a.toLowerCase() === name.toLowerCase()))
  );
  return p ? p.id : null;
}

function EftaBadge({ efta, url }: { efta: string; url?: string }) {
  const isLinked = url && url !== 'NOT PROVIDED';
  if (isLinked) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded
                   bg-accent-blue/10 text-accent-blue border border-accent-blue/20
                   hover:bg-accent-blue/20 transition-colors"
      >
        {efta}
        <ExternalLink size={8} aria-hidden />
      </a>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded
                     bg-zinc-800/50 text-zinc-400 border border-zinc-700/40">
      {efta === 'UNKNOWN' ? 'UNKNOWN' : efta}
      {efta === 'UNKNOWN' && <AlertTriangle size={8} className="text-amber-400" aria-hidden />}
    </span>
  );
}

// ─── Component ───────────────────────────────────────────────────────────

export default function ChickenPatternPage() {
  const [findingsOpen, setFindingsOpen] = useState(true);
  const [showFood, setShowFood] = useState(false);
  const [selectedClassifications, setSelectedClassifications] = useState<Set<Classification>>(
    new Set(NON_FOOD_CLASSIFICATIONS)
  );
  const [selectedPriorities, setSelectedPriorities] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'priority' | 'date-asc' | 'date-desc'>('priority');
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());
  const [expandedNetworkNotes, setExpandedNetworkNotes] = useState<Set<string>>(new Set());
  const [methodologyOpen, setMethodologyOpen] = useState(false);

  const documents = dataset.documents as Document[];
  const keyFindings = dataset.key_findings;
  const leads = dataset.investigation_leads;
  const networkNodes = dataset.network_nodes;

  // Filter + sort documents
  const filteredDocs = useMemo(() => {
    let filtered = documents.filter((doc) => {
      if (doc.classification === 'CONFIRMED_FOOD' && !showFood) return false;
      if (doc.classification === 'UNREVIEWED') return false;
      if (selectedClassifications.size > 0 && !selectedClassifications.has(doc.classification as Classification)) {
        if (doc.classification !== 'CONFIRMED_FOOD') return false;
      }
      if (selectedPriorities.size > 0 && !selectedPriorities.has(doc.research_priority)) return false;
      return true;
    });

    if (showFood) {
      const foodDocs = documents.filter(
        (d) => d.classification === 'CONFIRMED_FOOD' && d.classification !== ('UNREVIEWED' as string)
      );
      const nonFoodFiltered = filtered.filter((d) => d.classification !== 'CONFIRMED_FOOD');
      filtered = [...nonFoodFiltered, ...foodDocs.filter((d) => !nonFoodFiltered.find((f) => f.id === d.id))];
    }

    const priorityOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, PENDING: 4 };
    if (sortBy === 'priority') {
      filtered.sort((a, b) => (priorityOrder[a.research_priority] ?? 9) - (priorityOrder[b.research_priority] ?? 9));
    } else if (sortBy === 'date-asc') {
      filtered.sort((a, b) => a.date.localeCompare(b.date));
    } else {
      filtered.sort((a, b) => b.date.localeCompare(a.date));
    }
    return filtered;
  }, [documents, showFood, selectedClassifications, selectedPriorities, sortBy]);

  function toggleClassification(cls: Classification) {
    setSelectedClassifications((prev) => {
      const next = new Set(prev);
      if (next.has(cls)) next.delete(cls);
      else next.add(cls);
      return next;
    });
  }

  function togglePriority(pri: string) {
    setSelectedPriorities((prev) => {
      const next = new Set(prev);
      if (next.has(pri)) next.delete(pri);
      else next.add(pri);
      return next;
    });
  }

  function toggleLead(leadId: string) {
    setExpandedLeads((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) next.delete(leadId);
      else next.add(leadId);
      return next;
    });
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6" aria-label="Breadcrumb">
        <Link href="/themes/" className="hover:text-text-secondary transition-colors">
          Themes
        </Link>
        <span>&rsaquo;</span>
        <span className="text-text-secondary">&ldquo;Chicken&rdquo; Code-Word Pattern</span>
      </nav>

      {/* ═══ 1.1 — Page Header ═══ */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-primary mb-2">
          &ldquo;Chicken&rdquo; Code-Word Pattern Analysis
        </h1>
        <p className="text-sm text-text-secondary mb-3">
          36 DOJ EFTA documents classified by usage type
        </p>
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full
                           bg-green-500/15 text-green-400 border border-green-800/40">
            Verified — Bates-stamped primary sources
          </span>
        </div>
        <p className="text-xs text-text-muted italic">
          All documents: DOJ EFTA releases. Zero inferences drawn beyond document content.
        </p>
      </div>

      {/* ═══ 1.2 — Key Findings ═══ */}
      <div className="mb-8">
        <button
          onClick={() => setFindingsOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3
                     rounded-t-lg border border-surface-border bg-surface-card
                     hover:bg-surface-elevated transition-colors text-left"
          aria-expanded={findingsOpen}
        >
          <span className="text-sm font-semibold text-text-primary">Key Findings</span>
          {findingsOpen ? (
            <ChevronUp size={14} className="text-text-muted" />
          ) : (
            <ChevronDown size={14} className="text-text-muted" />
          )}
        </button>

        {findingsOpen && (
          <div className="border border-t-0 border-surface-border rounded-b-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card A — "Chicken Man" Identity */}
              <div className="rounded-lg border border-purple-800/30 bg-purple-950/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-text-primary">
                    &ldquo;Chicken Man&rdquo; = Bill Clinton
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded
                                   bg-orange-500/15 text-orange-400 border border-orange-800/40">
                    HIGH
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">
                  {keyFindings.chicken_man_identity.basis}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <EftaBadge efta="EFTA00663628" url="https://www.justice.gov/epstein/files/DataSet%209/EFTA00663628.pdf" />
                  <EftaBadge efta="EFTA02333212" url="https://www.justice.gov/epstein/files/DataSet%2011/EFTA02333212.pdf" />
                  <EftaBadge efta="EFTA02333389" url="https://www.justice.gov/epstein/files/DataSet%2011/EFTA02333389.pdf" />
                </div>
                <p className="text-[10px] text-text-muted italic">
                  Inference drawn from three Bates-stamped documents. Corroborated — not independently verified.
                </p>
              </div>

              {/* Card B — "Chicken" (Female Individual) */}
              <div className="rounded-lg border border-red-800/30 bg-red-950/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-text-primary">
                    Managed Individual, 2010–2015
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded
                                   bg-orange-500/15 text-orange-400 border border-orange-800/40">
                    HIGH
                  </span>
                </div>
                <dl className="text-xs space-y-1 mb-3">
                  {Object.entries(keyFindings.chicken_female_profile.attributes).map(([key, val]) => (
                    <div key={key} className="flex gap-2">
                      <dt className="text-text-muted capitalize whitespace-nowrap">
                        {key.replace(/_/g, ' ')}:
                      </dt>
                      <dd className="text-text-secondary">{val as string}</dd>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {keyFindings.chicken_female_profile.highest_confidence_eftAs.map((efta) => {
                    const doc = documents.find((d) => d.efta === efta);
                    return <EftaBadge key={efta} efta={efta} url={doc?.url} />;
                  })}
                </div>
                <p className="text-[10px] text-text-muted italic">
                  Pronoun confirmation from EFTA documents. Identity unknown.
                </p>
              </div>

              {/* Card C — Operational Pipeline */}
              <div className="rounded-lg border border-surface-border bg-surface-card p-4">
                <h3 className="text-sm font-semibold text-text-primary mb-2">
                  Recruitment &amp; Placement Pipeline
                </h3>
                <div className="flex flex-wrap items-center gap-1 text-xs text-text-secondary mb-3">
                  {keyFindings.operational_pipeline.description.split(' → ').map((step, i, arr) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="bg-surface-elevated px-2 py-0.5 rounded text-text-primary">
                        {step}
                      </span>
                      {i < arr.length - 1 && <span className="text-text-muted">&rarr;</span>}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mb-1">Key Actors</p>
                  <ul className="text-xs text-text-secondary space-y-0.5">
                    {keyFindings.operational_pipeline.key_actors.map((actor) => (
                      <li key={actor}>&#x2022; {actor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ 1.3 — October 2014 Cluster Timeline ═══ */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <BookOpen size={13} className="text-text-muted" aria-hidden />
          October 2014 Cluster — 17-Day Movement Window
        </h2>
        <div className="space-y-2">
          {keyFindings.october_2014_cluster.events.map((evt, i) => (
            <div
              key={i}
              className="flex items-start gap-3 border-l-2 border-surface-border pl-4 py-2"
            >
              <span className="text-xs font-mono text-text-muted whitespace-nowrap shrink-0">
                {evt.date}
              </span>
              <EftaBadge
                efta={evt.efta}
                url={
                  evt.efta !== 'UNKNOWN'
                    ? documents.find((d) => d.efta === evt.efta)?.url
                    : undefined
                }
              />
              <p className="text-xs text-text-secondary leading-relaxed">{evt.event}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 1.4 — Document Cards ═══ */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <FileText size={13} className="text-text-muted" aria-hidden />
          Document Cards ({filteredDocs.length} of {documents.filter((d) => d.classification !== 'UNREVIEWED').length})
        </h2>

        {/* Filter controls */}
        <div className="bg-surface-card border border-surface-border rounded-lg p-4 mb-4 space-y-3">
          <div>
            <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-2">
              Classification
            </p>
            <div className="flex flex-wrap gap-2">
              {NON_FOOD_CLASSIFICATIONS.map((cls) => {
                const cfg = CLASSIFICATION_CONFIG[cls];
                return (
                  <button
                    key={cls}
                    onClick={() => toggleClassification(cls)}
                    aria-pressed={selectedClassifications.has(cls)}
                    className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                      selectedClassifications.has(cls)
                        ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                        : 'border-surface-border text-text-muted hover:text-text-secondary'
                    }`}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-xs text-text-secondary">
              <input
                type="checkbox"
                checked={showFood}
                onChange={(e) => setShowFood(e.target.checked)}
                className="accent-green-500"
              />
              Show food references
            </label>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Priority:</span>
              {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((pri) => (
                <button
                  key={pri}
                  onClick={() => togglePriority(pri)}
                  aria-pressed={selectedPriorities.has(pri)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    selectedPriorities.has(pri)
                      ? 'border-accent-blue/50 text-accent-blue bg-accent-blue/10'
                      : 'border-surface-border text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {pri}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted uppercase tracking-wider">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="text-[10px] bg-surface-elevated text-text-secondary border border-surface-border
                           rounded px-2 py-1"
              >
                <option value="priority">Research Priority</option>
                <option value="date-asc">Date (oldest first)</option>
                <option value="date-desc">Date (newest first)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Document grid */}
        <div className="space-y-3">
          {filteredDocs.map((doc) => {
            const clsCfg = CLASSIFICATION_CONFIG[doc.classification] ?? CLASSIFICATION_CONFIG.AMBIGUOUS;
            const priCfg = PRIORITY_CONFIG[doc.research_priority] ?? PRIORITY_CONFIG.LOW;
            const hasNetworkNote = !!doc.network_note;
            const noteExpanded = expandedNetworkNotes.has(doc.id);

            return (
              <div
                key={doc.id}
                className={`rounded-lg border ${clsCfg.border} p-4 relative`}
              >
                {/* Priority indicator */}
                <span
                  className={`absolute top-3 right-3 text-[9px] font-mono uppercase tracking-wider ${priCfg.text}`}
                >
                  {priCfg.label}
                </span>

                {/* EFTA + Dataset + Date row */}
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <EftaBadge efta={doc.efta} url={doc.url !== 'NOT PROVIDED' ? doc.url : undefined} />
                  <span className="text-[10px] text-text-muted">{doc.dataset}</span>
                  <span className="text-[10px] font-mono text-text-muted">{doc.date}</span>
                </div>

                {/* From / To */}
                <div className="flex items-center gap-3 text-xs mb-1 flex-wrap">
                  <span className="text-text-muted">
                    From:{' '}
                    {doc.from === 'Unknown' || doc.from === 'UNKNOWN' ? (
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-500">Unknown</span>
                    ) : (
                      <span className="text-text-secondary">{doc.from}</span>
                    )}
                  </span>
                  <span className="text-text-muted">
                    To:{' '}
                    {doc.to === 'Unknown' || doc.to === 'UNKNOWN' ? (
                      <span className="px-1.5 py-0.5 rounded bg-zinc-800/50 text-zinc-500">Unknown</span>
                    ) : (
                      <span className="text-text-secondary">{doc.to}</span>
                    )}
                  </span>
                </div>

                {/* Subject */}
                <p className="text-xs italic text-text-muted mb-2">
                  {doc.subject || '[No subject]'}
                </p>

                {/* Body excerpt */}
                <blockquote className="border-l-2 border-surface-border pl-3 py-1 mb-2
                                       text-xs text-text-secondary leading-relaxed bg-surface-card/50 rounded-r">
                  {doc.body_excerpt}
                </blockquote>

                {/* Classification + Confidence badges */}
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded
                               ${clsCfg.bg} ${clsCfg.text} border ${clsCfg.border}`}
                  >
                    {clsCfg.label}
                  </span>
                  <span className="text-[10px] text-text-muted">
                    Confidence: <span className={priCfg.text}>{doc.confidence}</span>
                  </span>
                </div>

                {/* Bates unknown warning */}
                {doc.efta === 'UNKNOWN' && (
                  <div className="flex items-center gap-2 text-[10px] text-amber-400 bg-amber-500/10
                                  border border-amber-800/30 rounded px-2 py-1 mb-2">
                    <AlertTriangle size={10} aria-hidden />
                    Bates stamp not recorded — treat as unverified pending source confirmation.
                  </div>
                )}

                {/* Significance */}
                <p className="text-[11px] text-text-muted leading-relaxed mb-2">
                  {doc.significance}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface-elevated
                                 text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Network note */}
                {hasNetworkNote && (
                  <div>
                    <button
                      onClick={() =>
                        setExpandedNetworkNotes((prev) => {
                          const next = new Set(prev);
                          if (next.has(doc.id)) next.delete(doc.id);
                          else next.add(doc.id);
                          return next;
                        })
                      }
                      className="text-[10px] text-accent-blue hover:text-accent-blueHover transition-colors"
                    >
                      {noteExpanded ? '▾ Network significance' : '▸ Network significance'}
                    </button>
                    {noteExpanded && (
                      <p className="text-[11px] text-text-muted leading-relaxed mt-1 pl-3 border-l border-accent-blue/20">
                        {doc.network_note}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ 1.5 — Investigation Leads ═══ */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Search size={13} className="text-text-muted" aria-hidden />
          Investigation Leads ({leads.length})
        </h2>
        <div className="space-y-2">
          {leads.map((lead) => {
            const isOpen = expandedLeads.has(lead.lead_id);
            const priCfg =
              lead.priority === 'CRITICAL'
                ? { text: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-800/40' }
                : lead.priority === 'HIGH'
                ? { text: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-800/40' }
                : { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-800/40' };

            return (
              <div key={lead.lead_id} className="border border-surface-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleLead(lead.lead_id)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left
                             hover:bg-surface-elevated transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-[10px] font-mono text-text-muted shrink-0">
                    {lead.lead_id}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${priCfg.bg} ${priCfg.text} border ${priCfg.border} shrink-0`}
                  >
                    {lead.priority}
                  </span>
                  <span className="text-xs font-medium text-text-primary flex-1">
                    {lead.subject}
                  </span>
                  {isOpen ? (
                    <ChevronUp size={12} className="text-text-muted shrink-0" />
                  ) : (
                    <ChevronDown size={12} className="text-text-muted shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-3 space-y-2">
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {lead.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {lead.relevant_eftAs.map((efta) => {
                        const doc = documents.find((d) => d.efta === efta);
                        return <EftaBadge key={efta} efta={efta} url={doc?.url} />;
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ 1.6 — Network Nodes ═══ */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <Users size={13} className="text-text-muted" aria-hidden />
          Network Nodes
        </h2>

        {/* Confirmed */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Confirmed Nodes
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-surface-border">
                  <th className="text-left py-2 pr-4 text-text-muted font-medium">Name</th>
                  <th className="text-left py-2 pr-4 text-text-muted font-medium">Role</th>
                  <th className="text-left py-2 pr-4 text-text-muted font-medium">Email</th>
                  <th className="text-left py-2 text-text-muted font-medium">Alias</th>
                </tr>
              </thead>
              <tbody>
                {networkNodes.confirmed.map((node, i) => {
                  const slug = personSlugForName(node.name);
                  return (
                    <tr key={i} className="border-b border-surface-border/50">
                      <td className="py-2 pr-4 text-text-primary">
                        {slug ? (
                          <Link
                            href={`/people/${slug}`}
                            className="text-accent-blue hover:text-accent-blueHover transition-colors"
                          >
                            {node.name}
                          </Link>
                        ) : (
                          node.name
                        )}
                      </td>
                      <td className="py-2 pr-4 text-text-secondary">{node.role}</td>
                      <td className="py-2 pr-4 text-text-muted font-mono">
                        {'email' in node ? (node as { email: string }).email : '—'}
                      </td>
                      <td className="py-2 text-text-muted">
                        {'alias' in node ? (node as { alias: string }).alias : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unidentified Priority */}
        <div>
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
            Unidentified Priority Nodes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {networkNodes.unidentified_priority.map((node, i) => (
              <div
                key={i}
                className="rounded-lg border border-amber-800/30 bg-amber-950/5 p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-text-primary">
                    {node.alias}
                  </span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded
                                   bg-amber-500/15 text-amber-400 border border-amber-800/40 flex items-center gap-1">
                    <Search size={8} aria-hidden />
                    Unidentified
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary">{node.role}</p>
                <p className="text-[10px] text-text-muted italic mt-1">
                  Source: DOJ EFTA documents — identity unconfirmed
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 1.7 — Methodology Note ═══ */}
      <div className="mb-8">
        <button
          onClick={() => setMethodologyOpen((o) => !o)}
          className="w-full flex items-center justify-between gap-3 px-4 py-3
                     rounded-lg border border-surface-border bg-surface-card
                     hover:bg-surface-elevated transition-colors text-left"
          aria-expanded={methodologyOpen}
        >
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Methodology &amp; Verification Standard
          </span>
          {methodologyOpen ? (
            <ChevronUp size={12} className="text-text-muted" />
          ) : (
            <ChevronDown size={12} className="text-text-muted" />
          )}
        </button>
        {methodologyOpen && (
          <div className="border border-t-0 border-surface-border rounded-b-lg px-4 py-3">
            <blockquote className="text-xs text-text-secondary leading-relaxed border-l-2 border-surface-border pl-3">
              <strong>Verification standard:</strong> All 36 documents in this dataset carry
              Bates-stamp identifiers from the DOJ EFTA releases. The classification of emails
              as &ldquo;coded person&rdquo; vs. &ldquo;literal food&rdquo; references is based on
              contextual analysis of sender/recipient relationships, subject line modifiers,
              pronoun usage, and cross-document corroboration. No inference is presented as
              established fact. The &ldquo;chicken man&rdquo; = Clinton identification is rated
              HIGH confidence based on a three-document chain (EFTA00663628, EFTA02333212,
              EFTA02333389) but has not been independently corroborated outside the EFTA corpus.
              The identity of the female individual referred to as &ldquo;chicken&rdquo; in
              2010–2015 emails remains unknown.
            </blockquote>
          </div>
        )}
      </div>
    </div>
  );
}
