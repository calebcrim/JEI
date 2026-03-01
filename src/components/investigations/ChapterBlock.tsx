import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Users, DollarSign } from 'lucide-react';
import type { InvestigationChapter, InvestigationDeepDiveLink } from '@/types';

interface Props {
  chapter: InvestigationChapter;
}

const typeIcons: Record<InvestigationDeepDiveLink['type'], React.ElementType> = {
  people: Users,
  timeline: Clock,
  themes: BookOpen,
  financial: DollarSign,
};

const typeColors: Record<InvestigationDeepDiveLink['type'], string> = {
  people:    'text-blue-400',
  timeline:  'text-amber-400',
  themes:    'text-emerald-400',
  financial: 'text-purple-400',
};

export default function ChapterBlock({ chapter }: Props) {
  return (
    <article
      id={chapter.id}
      aria-labelledby={`${chapter.id}-title`}
      className="scroll-mt-20"
    >
      {/* Chapter header */}
      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-mono text-xs text-text-muted">
            Chapter {String(chapter.chapterNumber).padStart(2, '0')}
          </span>
          <span className="text-text-muted text-xs">·</span>
          <span className="text-xs text-text-muted">{chapter.era}</span>
        </div>
        <h2
          id={`${chapter.id}-title`}
          className="text-xl font-semibold text-text-primary mb-1.5"
        >
          {chapter.title}
        </h2>
        <p className="text-sm text-text-secondary">{chapter.subtitle}</p>
      </header>

      {/* Key facts bar */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7 p-4
                   bg-surface-card border border-surface-border rounded-lg"
        aria-label="Key statistics"
      >
        {chapter.keyFacts.map((fact, i) => (
          <div key={i} className="text-center">
            <p className="text-lg font-semibold text-text-primary leading-none mb-1">
              {fact.value}
            </p>
            <p className="text-[11px] text-text-muted leading-snug">{fact.label}</p>
          </div>
        ))}
      </div>

      {/* Body prose */}
      <div className="prose prose-sm prose-invert max-w-none space-y-4 mb-7">
        {chapter.bodyParagraphs.map((para, i) => (
          <p key={i} className="text-sm text-text-secondary leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {/* Pull quote */}
      {chapter.pullQuote && (
        <blockquote
          className="border-l-2 border-amber-500/60 pl-4 my-7"
          aria-label="Key quote"
        >
          <p className="text-sm text-text-primary italic leading-relaxed">
            {chapter.pullQuote}
          </p>
          {chapter.pullQuoteSource && (
            <footer className="text-xs text-text-muted mt-2">
              — {chapter.pullQuoteSource}
            </footer>
          )}
        </blockquote>
      )}

      {/* Deep dive links */}
      {chapter.deepDiveLinks.length > 0 && (
        <div className="mt-7">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">
            Go deeper
          </p>
          <div className="space-y-2">
            {chapter.deepDiveLinks.map((link, i) => {
              const Icon = typeIcons[link.type];
              const iconColor = typeColors[link.type];
              return (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-start gap-3 p-3 border border-surface-border rounded
                             hover:bg-surface-elevated hover:border-surface-border/80
                             transition-colors group"
                >
                  <Icon
                    size={14}
                    className={`shrink-0 mt-0.5 ${iconColor}`}
                    aria-hidden
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text-primary group-hover:text-text-primary
                                  leading-snug mb-0.5">
                      {link.label}
                    </p>
                    <p className="text-xs text-text-muted leading-snug">
                      {link.description}
                    </p>
                  </div>
                  <ArrowRight
                    size={12}
                    className="shrink-0 mt-1 text-text-muted
                               group-hover:text-text-secondary transition-colors"
                    aria-hidden
                  />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}
