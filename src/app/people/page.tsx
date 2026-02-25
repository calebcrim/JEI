'use client';

import { useState, useMemo } from 'react';
import type { Person, PersonCategory } from '@/types';
import peopleData from '@/data/people.json';
import PersonCard from '@/components/people/PersonCard';
import CategoryFilter from '@/components/people/CategoryFilter';
import { Search } from 'lucide-react';

const people = peopleData as Person[];

const ALL_CATEGORIES: PersonCategory[] = [
  'principal', 'inner-circle', 'political', 'financial', 'legal',
  'intelligence', 'academic-scientific', 'media', 'victim', 'law-enforcement', 'other',
];

type SortKey = 'mentions' | 'name' | 'flights';

export default function PeopleDirectory() {
  const [selectedCats, setSelectedCats] = useState<Set<PersonCategory>>(new Set());
  const [nameFilter, setNameFilter] = useState('');
  const [sort, setSort] = useState<SortKey>('mentions');

  const categoryCounts = useMemo(() => {
    const map = new Map<PersonCategory, number>();
    for (const p of people) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return map;
  }, []);

  const visibleCategories = ALL_CATEGORIES.filter((c) => categoryCounts.has(c));

  function toggleCategory(cat: PersonCategory) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const filtered = useMemo(() => {
    let result = people;

    if (selectedCats.size > 0) {
      result = result.filter((p) => selectedCats.has(p.category));
    }

    if (nameFilter.trim()) {
      const q = nameFilter.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.aliases?.some((a) => a.toLowerCase().includes(q))
      );
    }

    return [...result].sort((a, b) => {
      if (sort === 'mentions') return (b.mentionCount ?? 0) - (a.mentionCount ?? 0);
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'flights') return (b.flightLegs ?? 0) - (a.flightLegs ?? 0);
      return 0;
    });
  }, [selectedCats, nameFilter, sort]);

  const hasFilters = selectedCats.size > 0 || nameFilter.trim().length > 0;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">People</h1>
        <p className="text-sm text-text-secondary">
          {people.length} individuals documented across 11 categories
        </p>
      </div>

      {/* Sticky filter bar */}
      <div className="sticky top-14 z-30 bg-surface/95 backdrop-blur-sm border-b border-surface-border
                      py-3 mb-6 -mx-4 px-4">
        <div className="flex flex-col gap-3">
          {/* Row 1: search + sort */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              <input
                type="search"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Filter by name…"
                aria-label="Filter people by name"
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-surface-elevated border border-surface-border
                           rounded text-text-primary placeholder:text-text-muted
                           focus:outline-none focus:border-accent-blue/50 transition-colors"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort order"
              className="text-xs bg-surface-elevated border border-surface-border rounded px-2 py-1.5
                         text-text-secondary focus:outline-none focus:border-accent-blue/50"
            >
              <option value="mentions">Mentions (highest)</option>
              <option value="name">Name A–Z</option>
              <option value="flights">Flight legs</option>
            </select>
          </div>

          {/* Row 2: category filters */}
          <CategoryFilter
            categories={visibleCategories}
            selected={selectedCats}
            counts={categoryCounts}
            onChange={toggleCategory}
          />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-text-muted">
          Showing {filtered.length} of {people.length} people
          {hasFilters && ' (filtered)'}
        </p>
        {hasFilters && (
          <button
            onClick={() => { setSelectedCats(new Set()); setNameFilter(''); }}
            className="text-xs text-accent-blue hover:text-accent-blueHover transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Card grid or empty state */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-3xl mb-4">🔍</p>
          <p className="text-sm text-text-secondary mb-3">No results match your filters.</p>
          <button
            onClick={() => { setSelectedCats(new Set()); setNameFilter(''); }}
            className="text-sm text-accent-blue hover:text-accent-blueHover transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
