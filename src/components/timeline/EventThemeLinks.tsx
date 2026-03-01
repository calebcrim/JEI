// src/components/timeline/EventThemeLinks.tsx
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import themesData from '@/data/themes.json';
import type { ThemeSection } from '@/types';

const allThemes = themesData as ThemeSection[];

interface Props {
  themeIds: string[];
}

export default function EventThemeLinks({ themeIds }: Props) {
  // Filter to only themeIds that actually exist in themes.json
  const validThemes = themeIds
    .map((id) => allThemes.find((t) => t.id === id))
    .filter((t): t is ThemeSection => t !== undefined);

  if (validThemes.length === 0) return null;

  return (
    <div className="flex items-start gap-2 mt-3" aria-label="Related investigation themes">
      <BookOpen
        size={11}
        className="text-text-muted shrink-0 mt-0.5"
        aria-hidden
      />
      <div className="flex flex-wrap gap-1.5">
        {validThemes.map((theme) => (
          <Link
            key={theme.id}
            href={`/themes/#${theme.id}`}
            className="text-[11px] px-2 py-0.5 rounded-full border border-surface-border
                       text-text-muted hover:text-accent-blue hover:border-accent-blue/40
                       transition-colors"
            aria-label={`View theme: ${theme.title}`}
          >
            {theme.sectionNumber}. {theme.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
