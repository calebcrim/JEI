import { ArrowRight, Link2 } from 'lucide-react';
import { getConnections } from '@/data/theme-connections';
import type { ThemeSection } from '@/types';
import themesData from '@/data/themes.json';

const themes = themesData as ThemeSection[];

interface Props {
  themeId: string;
}

const STRENGTH_LABEL: Record<number, string> = {
  3: 'Directly linked',
  2: 'Significantly connected',
  1: 'Tangentially related',
};

const STRENGTH_ACCENT: Record<number, string> = {
  3: 'border-l-red-700/70',
  2: 'border-l-blue-700/70',
  1: 'border-l-surface-border',
};

export default function ThemeConnectsTo({ themeId }: Props) {
  const connections = getConnections(themeId);
  if (connections.length === 0) return null;

  // Filter to only connections where target theme actually exists in themes.json
  const valid = connections.filter((c) => themes.some((t) => t.id === c.themeId));
  if (valid.length === 0) return null;

  // Sort by strength descending
  const sorted = [...valid].sort((a, b) => b.strength - a.strength);

  return (
    <div
      className="mt-6 pt-6 border-t border-surface-border"
      aria-label="Connected investigation threads"
    >
      <div className="flex items-center gap-2 mb-4">
        <Link2 size={13} className="text-text-muted shrink-0" aria-hidden />
        <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
          Connects to {sorted.length} other thread{sorted.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {sorted.map((conn) => {
          const target = themes.find((t) => t.id === conn.themeId);
          if (!target) return null;

          return (
            <div
              key={conn.themeId}
              className={`border-l-2 pl-4 py-1 ${STRENGTH_ACCENT[conn.strength]}`}
            >
              <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
                    {STRENGTH_LABEL[conn.strength]}
                  </span>
                  <span className="text-[10px] text-text-muted">·</span>
                  <span className="text-xs font-mono text-text-muted">
                    §{target.sectionNumber}
                  </span>
                </div>
                <a
                  href={`#${conn.themeId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(conn.themeId);
                    if (el) {
                      const top = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top, behavior: 'smooth' });
                    }
                  }}
                  className="flex items-center gap-1 text-xs text-accent-blue
                             hover:text-accent-blueHover transition-colors shrink-0"
                  aria-label={`Jump to ${target.title}`}
                >
                  {target.title}
                  <ArrowRight size={10} aria-hidden />
                </a>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                {conn.bridge}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
