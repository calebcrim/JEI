'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

// Lazy-loaded search to avoid importing the full index on every page
export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchDropdownResult[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  const runSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    // Dynamic import so the search index only loads when the user types
    const { search } = await import('@/lib/search');
    const found = await search(q, 8);
    setResults(found as SearchDropdownResult[]);
    setOpen(found.length > 0);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => runSearch(query), 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, runSearch]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      setOpen(false);
      setActiveIdx(-1);
      inputRef.current?.blur();
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    }
    if (e.key === 'Enter') {
      if (activeIdx === results.length || activeIdx === -1) {
        navigateToSearch();
      } else if (results[activeIdx]) {
        navigateToResult(results[activeIdx]);
      }
    }
  }

  function navigateToSearch() {
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search/?q=${encodeURIComponent(query)}`);
  }

  function navigateToResult(result: SearchDropdownResult) {
    setOpen(false);
    setQuery('');
    if (result.type === 'person') router.push(`/people/${result.id}/`);
    else if (result.type === 'event') router.push(`/timeline/#${result.id}`);
    else router.push(`/themes/#${result.id}`);
  }

  const TYPE_LABEL: Record<string, string> = {
    person: 'Person',
    event: 'Event',
    theme: 'Theme',
  };
  const TYPE_COLOR: Record<string, string> = {
    person: 'text-accent-blue',
    event: 'text-category-financial',
    theme: 'text-category-media',
  };

  return (
    <div className="relative w-full" role="search">
      <div className="relative flex items-center">
        <Search size={14} className="absolute left-3 text-text-muted pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (results.length) setOpen(true); }}
          placeholder="Search people, events, themes…"
          aria-label="Search the database"
          aria-autocomplete="list"
          aria-controls="global-search-dropdown"
          aria-expanded={open}
          className="w-full pl-8 pr-8 py-1.5 text-sm bg-surface-elevated border border-surface-border
                     rounded text-text-primary placeholder:text-text-muted
                     focus:outline-none focus:border-accent-blue/50 transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
            className="absolute right-2 text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div
          id="global-search-dropdown"
          ref={dropdownRef}
          role="listbox"
          aria-label="Search results"
          className="absolute top-full mt-1 left-0 right-0 bg-surface-card border border-surface-border
                     rounded shadow-xl z-50 max-h-80 overflow-y-auto"
        >
          {results.map((result, idx) => (
            <button
              key={`${result.type}-${result.id}`}
              role="option"
              aria-selected={idx === activeIdx}
              onClick={() => navigateToResult(result)}
              className={`w-full text-left px-3 py-2.5 flex items-start gap-2 transition-colors ${
                idx === activeIdx ? 'bg-surface-elevated' : 'hover:bg-surface-elevated'
              }`}
            >
              <span className={`text-xs font-semibold shrink-0 mt-0.5 ${TYPE_COLOR[result.type]}`}>
                {TYPE_LABEL[result.type]}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-text-primary truncate">{result.title}</p>
                <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{result.excerpt}</p>
              </div>
            </button>
          ))}
          <button
            role="option"
            aria-selected={activeIdx === results.length}
            onClick={navigateToSearch}
            className={`w-full text-left px-3 py-2 text-xs text-accent-blue hover:text-accent-blueHover
                       border-t border-surface-border transition-colors ${
                         activeIdx === results.length ? 'bg-surface-elevated' : ''
                       }`}
          >
            View all results for &ldquo;{query}&rdquo; →
          </button>
        </div>
      )}
    </div>
  );
}

interface SearchDropdownResult {
  type: 'person' | 'event' | 'theme';
  id: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  score?: number;
}
