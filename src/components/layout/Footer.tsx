import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-card mt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-text-muted">
              Informational resource compiled from public records. Not legal documentation.
            </p>
            <p className="text-xs text-text-muted">
              Data compiled February 2026. Last updated: February 25, 2026.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <Link href="/about/" className="hover:text-text-secondary transition-colors">
              About
            </Link>
            <Link href="/sources/" className="hover:text-text-secondary transition-colors">
              Sources
            </Link>
            <Link href="/evidence/" className="hover:text-text-secondary transition-colors">
              Evidence
            </Link>
          </div>
        </div>
        <p className="mt-4 text-xs text-text-muted leading-relaxed max-w-2xl">
          This database is compiled from public records and reported sources. Unverified allegations
          are clearly marked. This is an informational resource.
        </p>
      </div>
    </footer>
  );
}
