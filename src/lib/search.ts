import Fuse from 'fuse.js';
import type { SearchResult, SearchIndexEntry } from '@/types';

let fuseInstance: Fuse<SearchIndexEntry> | null = null;

async function getFuse(): Promise<Fuse<SearchIndexEntry>> {
  if (fuseInstance) return fuseInstance;
  // Dynamic import so the 600-900 KB index only loads when search is used
  const searchIndex = (await import('@/data/search-index.json')).default as SearchIndexEntry[];
  fuseInstance = new Fuse(searchIndex, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'aliases', weight: 0.3 },
      { name: 'excerpt', weight: 0.2 },
      { name: 'fullText', weight: 0.1 },
    ],
    threshold: 0.35,
    includeScore: true,
    includeMatches: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
  });
  return fuseInstance;
}

export async function search(query: string, limit = 20): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  const fuse = await getFuse();
  return fuse.search(query, { limit }).map((result) => ({
    type: result.item.type,
    id: result.item.id,
    title: result.item.title,
    excerpt: result.item.excerpt,
    category: result.item.category,
    date: result.item.date,
    score: result.score,
  }));
}
