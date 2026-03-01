'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import type { TimelineEvent, TimelineEra, DisclosureLevel } from '@/types';
import timelineData from '@/data/timeline.json';
import EventCard from '@/components/timeline/EventCard';
import { Filter } from 'lucide-react';

const events = timelineData as TimelineEvent[];

const ERA_LABELS: Record<TimelineEra, string> = {
  'pre-1990': 'Pre-1990: Origins',
  '1990-2000': '1990–2000: Building the Machine',
  '2001-2007': '2001–2007: Investigation & Plea Deal',
  '2008-2018': '2008–2018: Post-Conviction Networking',
  '2019': '2019: Second Arrest & Death',
  '2020-present': '2020–Present: EFTA Era',
};

const ERAS: TimelineEra[] = [
  'pre-1990', '1990-2000', '2001-2007', '2008-2018', '2019', '2020-present',
];

const TAG_FILTERS = ['trafficking', 'financial', 'legal', 'political', 'media', 'death', 'intelligence', 'flight'];

export default function TimelinePage() {
  const [selectedEras, setSelectedEras] = useState<Set<TimelineEra>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [showUnverified, setShowUnverified] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const eraRefs = useRef<Record<string, HTMLElement | null>>({});

  // Bulk-expand per era
  const [eraLevels, setEraLevels] = useState<Map<TimelineEra, DisclosureLevel>>(new Map());

  // Per-event expand overrides (for related event navigation)
  const [expandedEvents, setExpandedEvents] = useState<Map<string, DisclosureLevel>>(new Map());

  // Hash-based auto-expand
  const [initialExpandId, setInitialExpandId] = useState<string | null>(null);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setInitialExpandId(hash);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, []);

  function setEraExpandLevel(era: TimelineEra, level: DisclosureLevel) {
    setEraLevels(prev => {
      const next = new Map(prev);
      next.set(era, level);
      return next;
    });
  }

  function handleNavigateToEvent(eventId: string) {
    setExpandedEvents(prev => {
      const next = new Map(prev);
      next.set(eventId, 1);
      return next;
    });
    setTimeout(() => {
      document.getElementById(eventId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${eventId}`);
    }, 50);
  }

  function handlePrintView() {
    const allEras = new Map<TimelineEra, DisclosureLevel>();
    for (const era of ERAS) allEras.set(era, 2);
    setEraLevels(allEras);
    setTimeout(() => window.print(), 300);
  }

  function toggleEra(era: TimelineEra) {
    setSelectedEras((prev) => {
      const next = new Set(prev);
      if (next.has(era)) next.delete(era); else next.add(era);
      return next;
    });
  }

  function toggleTag(tag: string) {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag); else next.add(tag);
      return next;
    });
  }

  function scrollToEra(era: TimelineEra) {
    eraRefs.current[era]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (selectedEras.size > 0 && !selectedEras.has(e.era)) return false;
      if (selectedTags.size > 0 && !e.tags.some((t) => selectedTags.has(t))) return false;
      if (!showUnverified && e.verificationStatus === 'unverified') return false;
      return true;
    });
  }, [selectedEras, selectedTags, showUnverified]);

  const hasFilters = selectedEras.size > 0 || selectedTags.size > 0 || !showUnverified;

  // Group by era, preserve era order
  const byEra = useMemo(() => {
    const map = new Map<TimelineEra, TimelineEvent[]>();
    for (const era of ERAS) map.set(era, []);
    for (const e of filtered) {
      const list = map.get(e.era);
      if (list) list.push(e);
    }
    return map;
  }, [filtered]);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Timeline</h1>
        <p className="text-sm text-text-secondary">
          {events.length} events across 6 chronological eras
        </p>
      </div>

      {/* Era quick-jump + filter toggle */}
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-text-muted">Jump to:</span>
          {ERAS.map((era) => (
            <button
              key={era}
              onClick={() => scrollToEra(era)}
              className="text-xs text-accent-blue hover:text-accent-blueHover transition-colors"
            >
              {era}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintView}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors print:hidden"
          >
            Print-friendly
          </button>
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary
                       border border-surface-border rounded px-3 py-1.5 transition-colors"
            aria-expanded={filterOpen}
          >
            <Filter size={12} />
            Filters
            {hasFilters && <span className="text-accent-blue">(active)</span>}
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {filterOpen && (
        <div className="bg-surface-card border border-surface-border rounded-lg p-4 mb-6 space-y-4 filter-panel">
          {/* Era filters */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Eras</p>
            <div className="flex flex-wrap gap-2">
              {ERAS.map((era) => (
                <button
                  key={era}
                  onClick={() => toggleEra(era)}
                  aria-pressed={selectedEras.has(era)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors ${
                    selectedEras.has(era)
                      ? 'border-accent-blue text-accent-blue bg-accent-blue/10'
                      : 'border-surface-border text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>

          {/* Tag filters */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {TAG_FILTERS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={selectedTags.has(tag)}
                  className={`text-xs px-2.5 py-1 rounded border transition-colors capitalize ${
                    selectedTags.has(tag)
                      ? 'border-accent-blue text-accent-blue bg-accent-blue/10'
                      : 'border-surface-border text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Verification filter */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="show-unverified"
              checked={showUnverified}
              onChange={(e) => setShowUnverified(e.target.checked)}
              className="accent-accent-blue"
            />
            <label htmlFor="show-unverified" className="text-xs text-text-secondary">
              Show unverified events
            </label>
          </div>

          {hasFilters && (
            <button
              onClick={() => {
                setSelectedEras(new Set());
                setSelectedTags(new Set());
                setShowUnverified(true);
              }}
              className="text-xs text-accent-blue hover:text-accent-blueHover transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      <p className="text-xs text-text-muted mb-6">
        Showing {filtered.length} of {events.length} events
        {hasFilters && ' (filtered)'}
      </p>

      {/* Era sections */}
      {ERAS.map((era) => {
        const eraEvents = byEra.get(era) ?? [];
        if (eraEvents.length === 0) return null;

        return (
          <section
            key={era}
            ref={(el) => { eraRefs.current[era] = el; }}
            className="mb-12"
            aria-labelledby={`era-${era}`}
          >
            {/* Era divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-surface-border" />
              <h2
                id={`era-${era}`}
                className="text-xs font-semibold text-text-muted uppercase tracking-widest whitespace-nowrap"
              >
                {ERA_LABELS[era]}
              </h2>
              <div className="flex-1 h-px bg-surface-border" />
            </div>

            {/* Bulk expand button */}
            <div className="flex justify-end mb-3 print:hidden">
              <button
                onClick={() => setEraExpandLevel(era, 1)}
                className="text-xs text-text-muted hover:text-text-secondary transition-colors"
              >
                Expand all summaries
              </button>
            </div>

            <div className="space-y-4">
              {eraEvents.map((event) => {
                const overrideLevel = expandedEvents.get(event.id);
                const eraLevel = eraLevels.get(event.era);
                const hashLevel = initialExpandId === event.id ? 1 : undefined;
                const effectiveLevel = (overrideLevel ?? hashLevel ?? eraLevel ?? 0) as DisclosureLevel;

                return (
                  <EventCard
                    key={`${event.id}-${effectiveLevel}`}
                    event={event}
                    initialLevel={effectiveLevel}
                    onNavigateToEvent={handleNavigateToEvent}
                  />
                );
              })}
            </div>
          </section>
        );
      })}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-3xl mb-4">🔍</p>
          <p className="text-sm text-text-secondary mb-3">No events match your filters.</p>
          <button
            onClick={() => {
              setSelectedEras(new Set());
              setSelectedTags(new Set());
              setShowUnverified(true);
            }}
            className="text-sm text-accent-blue hover:text-accent-blueHover transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
