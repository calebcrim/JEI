import type { Metadata } from 'next';
import { investigations } from '@/data/investigations';
import InvestigationsNav from '@/components/investigations/InvestigationsNav';
import InvestigationsMobileNav from '@/components/investigations/InvestigationsMobileNav';
import ChapterBlock from '@/components/investigations/ChapterBlock';

export const metadata: Metadata = {
  title: 'Investigations',
  description:
    'A narrative guide to the Epstein case in seven chapters — from the trafficking operation through the document release and open investigations.',
};

export default function InvestigationsPage() {
  return (
    <div className="min-h-screen">
      {/* Page header */}
      <header className="border-b border-surface-border bg-surface-card px-4 py-10">
        <div className="max-w-screen-md mx-auto">
          <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">
            Narrative Overview
          </p>
          <h1 className="text-2xl font-semibold text-text-primary mb-3">
            The Investigation
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
            Seven chapters covering the Epstein case from beginning to present —
            the operation, the protection network, the plea deal, the death, the
            document release, the financial trail, and what remains unknown.
            Each chapter connects to the detailed data in People, Timeline, and Themes.
          </p>
          <p className="text-xs text-text-muted mt-4">
            Read time: approximately 10 minutes for all seven chapters.
          </p>
        </div>
      </header>

      {/* Mobile chapter nav */}
      <InvestigationsMobileNav chapters={investigations} />

      {/* Two-column layout: sticky chapter nav + content */}
      <div className="max-w-screen-xl mx-auto flex gap-0">
        {/* Sticky chapter navigator — desktop only */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto
                          border-r border-surface-border py-6 px-4">
            <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-4">
              Chapters
            </p>
            <InvestigationsNav chapters={investigations} />
          </div>
        </aside>

        {/* Chapter content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-screen-md mx-auto px-4 py-8 space-y-20">
            {investigations.map((chapter) => (
              <ChapterBlock key={chapter.id} chapter={chapter} />
            ))}
          </div>

          {/* Footer CTA */}
          <div className="border-t border-surface-border bg-surface-card px-4 py-10 mt-8">
            <div className="max-w-screen-md mx-auto text-center">
              <p className="text-sm text-text-secondary mb-4">
                The narrative above is a synthesis. All claims trace to verifiable sources
                available throughout this database.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href="/people/"
                  className="text-xs px-4 py-2 border border-surface-border rounded
                             text-text-secondary hover:text-text-primary hover:bg-surface-elevated
                             transition-colors"
                >
                  Browse all people →
                </a>
                <a
                  href="/timeline/"
                  className="text-xs px-4 py-2 border border-surface-border rounded
                             text-text-secondary hover:text-text-primary hover:bg-surface-elevated
                             transition-colors"
                >
                  View full timeline →
                </a>
                <a
                  href="/themes/"
                  className="text-xs px-4 py-2 border border-surface-border rounded
                             text-text-secondary hover:text-text-primary hover:bg-surface-elevated
                             transition-colors"
                >
                  Explore all themes →
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
