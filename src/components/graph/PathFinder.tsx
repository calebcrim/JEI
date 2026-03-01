'use client';

import { useState } from 'react';
import { Route, X, ArrowRight } from 'lucide-react';
import type { Person } from '@/types';

interface Props {
  people: Person[];
  currentPath: string[] | null;
  onSearch: (fromId: string, toId: string) => void;
  onClear: () => void;
}

export default function PathFinder({ people, currentPath, onSearch, onClear }: Props) {
  const [fromId, setFromId] = useState<string>('');
  const [toId, setToId] = useState<string>('');
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  const fromPerson = people.find((p) => p.id === fromId);
  const toPerson = people.find((p) => p.id === toId);

  function filterPeople(query: string) {
    if (!query.trim()) return [];
    return people
      .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 8);
  }

  function handleSearch() {
    if (fromId && toId && fromId !== toId) {
      onSearch(fromId, toId);
    }
  }

  return (
    <div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
        Path Finder
      </p>

      {/* From person */}
      <div className="relative mb-1.5">
        <input
          type="text"
          placeholder="From person..."
          value={fromPerson ? fromPerson.name : fromQuery}
          onChange={(e) => {
            setFromQuery(e.target.value);
            setFromId('');
            setFromOpen(true);
          }}
          onFocus={() => setFromOpen(true)}
          onBlur={() => setTimeout(() => setFromOpen(false), 150)}
          className="w-full text-xs bg-surface border border-surface-border rounded
                     px-2.5 py-1.5 text-text-secondary placeholder:text-text-muted
                     focus:outline-none focus:border-accent-blue/50"
          aria-label="Path finder: starting person"
          aria-autocomplete="list"
        />
        {fromId && (
          <button
            onClick={() => { setFromId(''); setFromQuery(''); }}
            className="absolute right-2 top-1/2 -translate-y-1/2
                       text-text-muted hover:text-text-secondary"
            aria-label="Clear from person"
          >
            <X size={10} />
          </button>
        )}
        {fromOpen && filterPeople(fromQuery).length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-0.5 bg-surface-card border
                          border-surface-border rounded shadow-xl z-50">
            {filterPeople(fromQuery).map((p) => (
              <button
                key={p.id}
                onClick={() => { setFromId(p.id); setFromQuery(''); setFromOpen(false); }}
                className="w-full text-left text-xs px-2.5 py-1.5 text-text-secondary
                           hover:bg-surface-elevated transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* To person */}
      <div className="relative mb-2">
        <input
          type="text"
          placeholder="To person..."
          value={toPerson ? toPerson.name : toQuery}
          onChange={(e) => {
            setToQuery(e.target.value);
            setToId('');
            setToOpen(true);
          }}
          onFocus={() => setToOpen(true)}
          onBlur={() => setTimeout(() => setToOpen(false), 150)}
          className="w-full text-xs bg-surface border border-surface-border rounded
                     px-2.5 py-1.5 text-text-secondary placeholder:text-text-muted
                     focus:outline-none focus:border-accent-blue/50"
          aria-label="Path finder: destination person"
          aria-autocomplete="list"
        />
        {toId && (
          <button
            onClick={() => { setToId(''); setToQuery(''); }}
            className="absolute right-2 top-1/2 -translate-y-1/2
                       text-text-muted hover:text-text-secondary"
            aria-label="Clear to person"
          >
            <X size={10} />
          </button>
        )}
        {toOpen && filterPeople(toQuery).length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-0.5 bg-surface-card border
                          border-surface-border rounded shadow-xl z-50">
            {filterPeople(toQuery).map((p) => (
              <button
                key={p.id}
                onClick={() => { setToId(p.id); setToQuery(''); setToOpen(false); }}
                className="w-full text-left text-xs px-2.5 py-1.5 text-text-secondary
                           hover:bg-surface-elevated transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSearch}
        disabled={!fromId || !toId || fromId === toId}
        className="w-full flex items-center justify-center gap-1.5 text-xs py-1.5 rounded
                   border transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                   border-accent-blue/50 text-accent-blue hover:bg-accent-blue/10"
        aria-label="Find shortest path between selected people"
      >
        <Route size={11} aria-hidden /> Find path
      </button>

      {/* Path result */}
      {currentPath && currentPath.length > 0 && (
        <div className="mt-2 pt-2 border-t border-surface-border">
          {currentPath.length === 1 ? (
            <p className="text-xs text-amber-400">No path found between these two people.</p>
          ) : (
            <>
              <p className="text-[10px] text-text-muted mb-1.5">
                {currentPath.length - 1} step{currentPath.length - 1 !== 1 ? 's' : ''}:
              </p>
              <div className="flex flex-col gap-1">
                {currentPath.map((id, i) => {
                  const p = people.find((x) => x.id === id);
                  return (
                    <div key={id} className="flex items-center gap-1.5">
                      <span className="text-xs text-amber-300 font-medium leading-snug">
                        {p?.name ?? id}
                      </span>
                      {i < currentPath.length - 1 && (
                        <ArrowRight size={9} className="text-text-muted shrink-0" aria-hidden />
                      )}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={onClear}
                className="mt-2 text-[10px] text-text-muted hover:text-text-secondary transition-colors"
              >
                Clear path
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
