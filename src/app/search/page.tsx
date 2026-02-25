'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SearchResult } from '@/types';
import Badge from '@/components/shared/Badge';
import type { PersonCategory } from '@/types';
import { Search } from 'lucide-react';

function SearchResults({ query }: { query: string }) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    import('@/lib/search').then(({ search }) =>
      search(query, 50).then((r) => {
        setResults(r);
        setLoading(false);
      })
    );
  }, [query]);

  if (!query || query.trim().length < 2) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-text-muted">Enter a search term to get started.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-text-muted">Searching…</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-3xl mb-4">🔍</p>
        <p className="text-sm text-text-secondary mb-1">
          No results found for &ldquo;{query}&rdquo;.
        </p>
        <p className="text-xs text-text-muted">Try a broader search term.</p>
      </div>
    );
  }

  const people = results.filter((r) => r.type === 'person');
  const events = results.filter((r) => r.type === 'event');
  const themes = results.filter((r) => r.type === 'theme');

  const HREF = (r: SearchResult) => {
    if (r.type === 'person') return `/people/${r.id}/`;
    if (r.type === 'event') return `/timeline/#${r.id}`;
    return `/themes/#${r.id}`;
  };

  const TYPE_LABEL = { person: 'Person', event: 'Event', theme: 'Theme' };
  const TYPE_COLOR: Record<string, string> = {
    person: 'text-accent-blue',
    event: 'text-category-financial',
    theme: 'text-category-media',
  };

  function ResultGroup({ title, items }: { title: string; items: SearchResult[] }) {
    if (items.length === 0) return null;
    return (
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
          {title} ({items.length})
        </h2>
        <div className="space-y-2">
          {items.map((r) => (
            <Link
              key={`${r.type}-${r.id}`}
              href={HREF(r)}
              className="flex items-start gap-3 p-3 bg-surface-card border border-surface-border
                         rounded-lg hover:bg-surface-elevated transition-colors"
            >
              <span className={`text-xs font-semibold shrink-0 mt-0.5 ${TYPE_COLOR[r.type]}`}>
                {TYPE_LABEL[r.type]}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="text-sm font-semibold text-text-primary">{r.title}</p>
                  {r.type === 'person' && r.category && (
                    <Badge variant="category" category={r.category as PersonCategory} />
                  )}
                  {r.date && (
                    <span className="text-xs text-text-muted">{r.date}</span>
                  )}
                </div>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {r.excerpt}
                </p>
              </div>
              {r.score !== undefined && (
                <span className="text-xs text-text-muted shrink-0">
                  {Math.round((1 - (r.score ?? 0)) * 100)}% match
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-text-secondary mb-6">
        {results.length} results for &ldquo;<span className="text-text-primary">{query}</span>&rdquo;
      </p>
      <ResultGroup title="People" items={people} />
      <ResultGroup title="Timeline Events" items={events} />
      <ResultGroup title="Themes" items={themes} />
    </div>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search/?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Search</h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative max-w-xl">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search people, events, themes…"
            aria-label="Search the database"
            className="w-full pl-10 pr-4 py-3 text-sm bg-surface-elevated border border-surface-border
                       rounded-lg text-text-primary placeholder:text-text-muted
                       focus:outline-none focus:border-accent-blue/50 transition-colors"
          />
        </div>
      </form>

      <SearchResults query={initialQuery} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-screen-lg mx-auto px-4 py-8">
        <p className="text-sm text-text-muted">Loading…</p>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}
