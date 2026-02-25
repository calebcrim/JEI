'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Props {
  onReveal?: () => void;
  revealed?: boolean;
  /** If true, renders in "legend" mode (no show/hide toggle) */
  legendMode?: boolean;
}

export default function UnverifiedBanner({ onReveal, revealed = false, legendMode = false }: Props) {
  const [showAnyway, setShowAnyway] = useState(revealed);

  if (legendMode) {
    return (
      <div className="border-l-2 border-status-unverified bg-status-unverified/5 rounded-r px-4 py-3 flex items-start gap-3">
        <span className="text-status-unverified mt-0.5 shrink-0" aria-hidden="true">⚠</span>
        <div>
          <p className="text-sm font-semibold text-status-unverified mb-1">Unverified allegation</p>
          <p className="text-xs text-text-secondary leading-relaxed">
            Information flagged [UNVERIFIED] in source files — typically appearing in a single
            source, in anonymous FBI tips (NTOC reports), or in Epstein&apos;s own emails. FBI 302
            memos document allegations; they are not conclusions. Many NTOC tips were flagged by
            agents themselves as &ldquo;not credible.&rdquo;
          </p>
        </div>
      </div>
    );
  }

  if (!showAnyway) {
    return (
      <div className="border-l-2 border-status-unverified bg-status-unverified/5 rounded-r px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="text-status-unverified mt-0.5 shrink-0" aria-hidden="true">⚠</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-status-unverified mb-1">Unverified allegation</p>
            <p className="text-xs text-text-secondary leading-relaxed mb-2">
              This section contains unverified allegations. Single-source claims marked [UNVERIFIED]
              in the source files.{' '}
              <Link href="/about#verification-flags" className="text-accent-blue hover:text-accent-blueHover underline">
                Learn more
              </Link>
            </p>
            <button
              onClick={() => { setShowAnyway(true); onReveal?.(); }}
              className="text-xs text-status-unverified hover:text-status-unverified/80 underline transition-colors"
            >
              Show anyway &rsaquo;
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-l-2 border-status-unverified/40 bg-status-unverified/5 rounded-r px-4 py-2 mb-3">
      <span className="text-xs text-status-unverified">
        ⚠ Unverified allegation —{' '}
        <Link href="/about#verification-flags" className="underline hover:text-status-unverified/80">
          what does this mean?
        </Link>
      </span>
    </div>
  );
}
