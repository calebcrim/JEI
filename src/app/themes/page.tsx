'use client';

import { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ThemeSection, Person } from '@/types';
import themesData from '@/data/themes.json';
import peopleData from '@/data/people.json';
import Badge from '@/components/shared/Badge';
import SourceTag from '@/components/shared/SourceTag';
import { ChevronDown, ChevronUp } from 'lucide-react';

const themes = themesData as ThemeSection[];
const people = peopleData as Person[];

function ThemeSectionItem({ theme }: { theme: ThemeSection }) {
  const [expanded, setExpanded] = useState(false);

  const mentionedPeople = people.filter((p) => theme.peopleIds.includes(p.id));

  return (
    <section
      id={theme.id}
      aria-labelledby={`theme-title-${theme.id}`}
      className="border border-surface-border rounded-lg overflow-hidden"
    >
      {/* Section header */}
      <div className="bg-surface-card px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-xs font-mono text-text-muted mt-0.5 shrink-0 w-6">
            {theme.sectionNumber}.
          </span>
          <div className="flex-1">
            <h2
              id={`theme-title-${theme.id}`}
              className="text-base font-semibold text-text-primary mb-2 leading-snug"
            >
              {theme.title}
            </h2>
            <div className="flex items-center gap-1 flex-wrap mb-3">
              {theme.tags.map((tag) => (
                <Badge key={tag} variant="tag">{tag}</Badge>
              ))}
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">
              {theme.summary}
            </p>
          </div>
        </div>
      </div>

      {/* Expand/collapse */}
      <div className="border-t border-surface-border">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="w-full flex items-center justify-between px-5 py-2.5 text-xs
                     text-accent-blue hover:text-accent-blueHover transition-colors hover:bg-surface-elevated"
          aria-expanded={expanded}
        >
          <span>{expanded ? 'Collapse section' : '+ Read full section'}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {expanded && (
          <div className="px-5 pb-5 space-y-5">
            {/* Full content */}
            <div className="prose-dark border-t border-surface-border pt-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {theme.content}
              </ReactMarkdown>
            </div>

            {/* Related people */}
            {mentionedPeople.length > 0 && (
              <div className="border-t border-surface-border pt-4">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  People mentioned
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {mentionedPeople.slice(0, 20).map((p) => (
                    <a
                      key={p.id}
                      href={`/people/${p.id}/`}
                      className="text-xs px-2 py-0.5 bg-surface-elevated rounded-full
                                 text-text-secondary hover:text-accent-blue transition-colors"
                    >
                      {p.name}
                    </a>
                  ))}
                  {mentionedPeople.length > 20 && (
                    <span className="text-xs text-text-muted">
                      +{mentionedPeople.length - 20} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Sources */}
            {theme.sources.length > 0 && (
              <div className="border-t border-surface-border pt-3">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-xs text-text-muted mr-1">Sources:</span>
                  {theme.sources.map((src) => (
                    <SourceTag key={src} source={src} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default function ThemesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  function scrollToTheme(id: string) {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // navbar height
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary mb-1">Themes</h1>
        <p className="text-sm text-text-secondary">
          {themes.length} investigative threads across the Epstein files
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — sticky on desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 space-y-1">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Sections
            </p>
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => scrollToTheme(theme.id)}
                className={`w-full text-left text-xs px-3 py-2 rounded transition-colors ${
                  activeId === theme.id
                    ? 'text-accent-blue bg-accent-blue/10'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-elevated'
                }`}
              >
                <span className="font-mono mr-1.5">{theme.sectionNumber}.</span>
                {theme.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile dropdown */}
        <div className="lg:hidden w-full mb-4">
          <select
            onChange={(e) => scrollToTheme(e.target.value)}
            value={activeId ?? ''}
            aria-label="Jump to theme section"
            className="w-full text-sm bg-surface-elevated border border-surface-border rounded
                       px-3 py-2 text-text-secondary focus:outline-none focus:border-accent-blue/50"
          >
            <option value="" disabled>Jump to section…</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.sectionNumber}. {theme.title}
              </option>
            ))}
          </select>
        </div>

        {/* Main content */}
        <div ref={mainRef} className="flex-1 min-w-0 space-y-4">
          {themes.map((theme) => (
            <ThemeSectionItem key={theme.id} theme={theme} />
          ))}
        </div>
      </div>
    </div>
  );
}
