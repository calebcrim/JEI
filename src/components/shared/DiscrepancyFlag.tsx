'use client';

import Link from 'next/link';

interface Props {
  note?: string;
  /** If true, renders in "legend" mode (no interactivity) */
  legendMode?: boolean;
}

export default function DiscrepancyFlag({ note, legendMode = false }: Props) {
  return (
    <div className="border-l-2 border-status-discrepancy bg-status-discrepancy/5 rounded-r px-4 py-3 flex items-start gap-3">
      <span className="text-status-discrepancy mt-0.5 shrink-0" aria-hidden="true">⚡</span>
      <div>
        <p className="text-sm font-semibold text-status-discrepancy mb-1">Discrepancy noted</p>
        {legendMode ? (
          <p className="text-xs text-text-secondary leading-relaxed">
            Two or more sources give conflicting information on this point. Both versions are
            presented. Discrepancies are documented in the source files and preserved here rather
            than resolved editorially.
          </p>
        ) : (
          <>
            <p className="text-xs text-text-secondary leading-relaxed">
              Source files give conflicting information on this point. Both versions are presented.{' '}
              <Link href="/about#verification-flags" className="text-accent-blue hover:text-accent-blueHover underline">
                Learn more
              </Link>
            </p>
            {note && (
              <p className="text-xs text-text-muted mt-1 italic">{note}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
