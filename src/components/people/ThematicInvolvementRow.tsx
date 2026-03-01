// src/components/people/ThematicInvolvementRow.tsx
import Link from 'next/link';
import { Tag } from 'lucide-react';
import type { ThemeSection } from '@/types';
import themesData from '@/data/themes.json';

const themes = themesData as ThemeSection[];

interface Props {
  themeIds: string[];
  personName: string;
}

// Map theme IDs to display labels (shortened for pill display)
// Keys adjusted to match actual slugified IDs from parse-themes.ts
const THEME_SHORT_LABELS: Record<string, string> = {
  'efta-release-framework-document-architecture': 'EFTA Release',
  'the-trafficking-operation':                    'Trafficking',
  'trumpepstein-connections':                     'Trump–Epstein',
  'melania-trump-thread':                         'Melania Thread',
  'political-intelligence-network':               'Political Network',
  'maxwell-role-legal-history-current-status':     'Maxwell',
  'the-co-conspirators-immunity-grantees':         'Co-Conspirators',
  'financial-crimes-money-laundering':             'Financial Crimes',
  'intelligence-connections':                      'Intelligence',
  'epsteins-death-mcc-anomalies':                  'Death / MCC',
  'whoops-emails':                                 '"Whoops" Emails',
  'baby-stuff-thread':                             '"Baby Stuff"',
  'academic-scientific-network':                   'Academic Network',
  'the-acosta-plea-deal-legal-history':            'Plea Deal',
  'international-consequences-fallout':            'International',
  'media-congressional-investigations':            'Media / Congress',
  'community-research-tools-architecture':         'Community Tools',
  'cross-network-financial-analysis-epstein-as-financial-hub': 'Financial Hub',
  'the-rothschild-dynasty-25-million-access-brokerage-intelligence-nexus': 'Rothschild',
  'eurasian-organized-crime-mogilevich':           'Mogilevich',
  'science-network-pandemic-expertise':            'Science Network',
};

// Assign a subtle color accent to each theme category
const THEME_ACCENT: Record<string, string> = {
  'the-trafficking-operation':              'border-red-800/60 text-red-300',
  'financial-crimes-money-laundering':      'border-purple-800/60 text-purple-300',
  'intelligence-connections':               'border-blue-800/60 text-blue-300',
  'the-acosta-plea-deal-legal-history':     'border-amber-800/60 text-amber-300',
  'epsteins-death-mcc-anomalies':           'border-zinc-600 text-zinc-300',
  'the-co-conspirators-immunity-grantees':  'border-red-800/60 text-red-300',
};

const DEFAULT_ACCENT = 'border-surface-border text-text-muted';

export default function ThematicInvolvementRow({ themeIds, personName }: Props) {
  if (!themeIds || themeIds.length === 0) return null;

  // Sort by theme section number for consistent ordering
  const sortedThemeIds = [...themeIds].sort((a, b) => {
    const themeA = themes.find((t) => t.id === a);
    const themeB = themes.find((t) => t.id === b);
    return (themeA?.sectionNumber ?? 99) - (themeB?.sectionNumber ?? 99);
  });

  return (
    <div
      className="mb-5 pb-5 border-b border-surface-border"
      aria-label={`Themes ${personName} appears in`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <Tag size={12} className="text-text-muted shrink-0" aria-hidden />
        <span className="text-xs text-text-muted">Appears in {themeIds.length} investigative thread{themeIds.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="flex flex-wrap gap-1.5" role="list" aria-label="Related themes">
        {sortedThemeIds.map((themeId) => {
          const theme = themes.find((t) => t.id === themeId);
          const label = THEME_SHORT_LABELS[themeId] ?? theme?.title ?? themeId;
          const accent = THEME_ACCENT[themeId] ?? DEFAULT_ACCENT;

          return (
            <Link
              key={themeId}
              href={`/themes/#${themeId}`}
              role="listitem"
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors
                          hover:bg-surface-elevated hover:text-text-primary
                          ${accent}`}
              title={theme?.title ?? label}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
