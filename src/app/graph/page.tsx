'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Person, Connection, PersonCategory, ThemeSection } from '@/types';
import peopleData from '@/data/people.json';
import connectionsData from '@/data/connections.json';
import themesData from '@/data/themes.json';
import NetworkGraph from '@/components/graph/NetworkGraph';
import GraphModeToggle from '@/components/graph/GraphModeToggle';
import ThemeHighlightSelector from '@/components/graph/ThemeHighlightSelector';
import PathFinder from '@/components/graph/PathFinder';
import EraScrubber from '@/components/graph/EraScrubber';
import { bfsShortestPath } from '@/lib/graphUtils';
import Badge from '@/components/shared/Badge';
import { RotateCcw, Monitor, DollarSign } from 'lucide-react';

const people = peopleData as Person[];
const connections = connectionsData as Connection[];
const themes = themesData as ThemeSection[];

const ALL_CATEGORIES: PersonCategory[] = [
  'principal', 'inner-circle', 'political', 'financial', 'legal',
  'intelligence', 'academic-scientific', 'media', 'victim', 'law-enforcement', 'other',
];

export default function GraphPage() {
  const [selectedCategories, setSelectedCategories] = useState<Set<PersonCategory>>(new Set());
  const [minStrength, setMinStrength] = useState<1 | 2 | 3>(1);
  const [focusPerson, setFocusPerson] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [financialMode, setFinancialMode] = useState(false);
  const router = useRouter();

  // Gap 3 new state
  const [viewMode, setViewMode] = useState<'network' | 'cluster'>('network');
  const [highlightThemeId, setHighlightThemeId] = useState<string | null>(null);
  const [activeEra, setActiveEra] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string[] | null>(null);

  // In financial mode, show only financial connections and entities with financial connections or shell-entity subcategory
  const financialPersonIds = financialMode
    ? new Set(
        connections
          .filter(c => c.relationshipType === 'financial')
          .flatMap(c => [c.sourcePersonId, c.targetPersonId])
      )
    : null;

  const filteredPeople = financialMode
    ? people.filter(p => (financialPersonIds as Set<string>).has(p.id) || p.subcategory === 'shell-entity')
    : people;

  const filteredConnections = financialMode
    ? connections.filter(c => c.relationshipType === 'financial')
    : connections;

  // Theme highlight: collect peopleIds from selected theme
  const highlightThemePersonIds: Set<string> | null = highlightThemeId
    ? new Set(themes.find((t) => t.id === highlightThemeId)?.peopleIds ?? [])
    : null;

  // Path finding: run BFS when both people are selected
  function handlePathSearch(fromId: string, toId: string) {
    // BFS on ALL connections (not just filtered) for maximum path discovery
    const path = bfsShortestPath(fromId, toId, connections);
    setCurrentPath(path);
  }

  function handlePathClear() {
    setCurrentPath(null);
  }

  function toggleCategory(cat: PersonCategory) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }

  function handlePersonClick(person: Person) {
    setSelectedPerson(person);
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Mobile notice */}
      <div className="lg:hidden bg-surface-card border-b border-surface-border px-4 py-2 flex items-center gap-2">
        <Monitor size={14} className="text-text-muted" />
        <p className="text-xs text-text-muted">Best viewed on desktop for full interactivity.</p>
      </div>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Controls panel */}
        <div className="absolute top-4 right-4 z-20 w-64 bg-surface-card/95 backdrop-blur-sm
                        border border-surface-border rounded-lg p-3 space-y-4 shadow-xl
                        overflow-y-auto max-h-[calc(100vh-120px)]">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Filter by category
            </p>
            <div className="flex flex-wrap gap-1">
              {ALL_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  aria-pressed={selectedCategories.has(cat)}
                  className="mb-0.5"
                >
                  <Badge
                    variant="category"
                    category={cat}
                  >
                    {selectedCategories.has(cat) ? '✓ ' : ''}{cat.replace(/-/g, ' ')}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Minimum connection strength
            </p>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setMinStrength(s)}
                  aria-pressed={minStrength === s}
                  className={`flex-1 text-xs py-1 rounded border transition-colors ${
                    minStrength === s
                      ? 'border-accent-blue text-accent-blue bg-accent-blue/10'
                      : 'border-surface-border text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {s} {s === 1 ? '(all)' : s === 2 ? '(doc.)' : '(core)'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setFinancialMode(!financialMode)}
            aria-pressed={financialMode}
            className={`w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded border transition-colors ${
              financialMode
                ? 'border-[#10b981] text-[#10b981] bg-[#10b981]/10'
                : 'border-surface-border text-text-muted hover:text-text-secondary'
            }`}
          >
            <DollarSign size={12} /> {financialMode ? 'Showing Financial Network' : 'Show Financial Network'}
          </button>

          {/* Divider */}
          <div className="border-t border-surface-border" />

          {/* View mode toggle */}
          <GraphModeToggle viewMode={viewMode} onChange={setViewMode} />

          {/* Theme highlight */}
          <ThemeHighlightSelector
            activeThemeId={highlightThemeId}
            onChange={(id) => {
              setHighlightThemeId(id);
              // Clear path when switching modes
              handlePathClear();
            }}
          />

          {/* Path finder */}
          <PathFinder
            people={filteredPeople as Person[]}
            currentPath={currentPath}
            onSearch={(a, b) => {
              setHighlightThemeId(null); // clear theme highlight
              handlePathSearch(a, b);
            }}
            onClear={handlePathClear}
          />

          <button
            onClick={() => {
              setSelectedCategories(new Set());
              setMinStrength(1);
              setFocusPerson(null);
              setSelectedPerson(null);
              setFinancialMode(false);
              // Gap 3 additions:
              setViewMode('network');
              setHighlightThemeId(null);
              setActiveEra(null);
              handlePathClear();
            }}
            className="w-full flex items-center justify-center gap-1.5 text-xs text-text-muted
                       hover:text-text-secondary border border-surface-border rounded py-1.5 transition-colors"
          >
            <RotateCcw size={12} /> Reset view
          </button>
        </div>

        {/* Graph canvas + era scrubber */}
        <div className="flex-1 relative">
          <div style={{ height: 'calc(100% - 44px)' }}>
            <NetworkGraph
              people={filteredPeople}
              connections={filteredConnections}
              filterCategories={selectedCategories.size > 0 ? selectedCategories : undefined}
              filterStrength={minStrength}
              focusPersonId={focusPerson}
              onPersonClick={handlePersonClick}
              viewMode={viewMode}
              highlightThemePersonIds={highlightThemePersonIds}
              highlightPath={currentPath && currentPath.length >= 2 ? currentPath : null}
              filterEra={activeEra}
            />
          </div>
          <EraScrubber
            activeEra={activeEra}
            onChange={setActiveEra}
          />
        </div>

        {/* Person panel (slide-over style) */}
        {selectedPerson && (
          <div className="absolute left-4 top-4 bottom-4 w-80 bg-surface-card/95 backdrop-blur-sm
                          border border-surface-border rounded-lg overflow-y-auto shadow-xl z-20
                          transition-transform duration-200">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <Badge variant="category" category={selectedPerson.category} />
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="text-text-muted hover:text-text-secondary transition-colors text-xs"
                  aria-label="Close person panel"
                >
                  ✕
                </button>
              </div>

              <h2 className="text-base font-semibold text-text-primary mb-1">
                {selectedPerson.name}
              </h2>
              {selectedPerson.currentStatus && (
                <p className="text-xs text-text-muted mb-2">{selectedPerson.currentStatus}</p>
              )}
              {selectedPerson.mentionCount && (
                <p className="text-xs text-text-secondary mb-1">
                  {selectedPerson.mentionCount.toLocaleString()} DOJ mentions
                </p>
              )}
              {selectedPerson.flightLegs && (
                <p className="text-xs text-text-secondary mb-2">
                  ~{selectedPerson.flightLegs} flight legs
                </p>
              )}
              <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-4">
                {selectedPerson.summary}
              </p>

              <button
                onClick={() => router.push(`/people/${selectedPerson.id}/`)}
                className="w-full text-xs text-accent-blue hover:text-accent-blueHover
                           border border-accent-blue/30 rounded py-2 transition-colors"
              >
                View full profile →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
