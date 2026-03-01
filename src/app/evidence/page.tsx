// src/app/evidence/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { ExternalLink, AlertTriangle, Search, XCircle } from 'lucide-react';
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
      return new Map<EvidenceCategory, EvidenceEntry[]>([[activeCategory, filtered]]);
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
