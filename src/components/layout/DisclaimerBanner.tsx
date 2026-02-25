'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Info, X } from 'lucide-react';

const STORAGE_KEY = 'epstein-db-disclaimer-dismissed';

export default function DisclaimerBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed top-14 left-0 right-0 z-40 bg-surface-card border-b border-surface-border
                 px-4 py-3"
      role="banner"
      aria-label="Site disclaimer"
    >
      <div className="max-w-screen-xl mx-auto flex items-start gap-3">
        <Info size={16} className="text-accent-blue mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-xs text-text-secondary leading-relaxed flex-1">
          This site presents information from public records, court filings, and published
          journalism. Unverified allegations are clearly marked. This is an informational resource,
          not legal documentation.{' '}
          <Link href="/about/" className="text-accent-blue hover:text-accent-blueHover underline">
            Learn more about this database →
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="shrink-0 text-text-muted hover:text-text-secondary transition-colors"
          aria-label="Dismiss disclaimer for this session"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
