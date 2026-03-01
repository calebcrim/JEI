'use client';

import { useState, useEffect } from 'react';
import type { InvestigationChapter } from '@/types';

interface Props {
  chapters: InvestigationChapter[];
}

export default function InvestigationsMobileNav({ chapters }: Props) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );
    chapters.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <div
      className="lg:hidden sticky top-14 z-40 bg-surface/95 backdrop-blur-sm
                 border-b border-surface-border px-4 py-2 overflow-x-auto"
      role="navigation"
      aria-label="Chapter quick navigation"
    >
      <div className="flex gap-2 w-max">
        {chapters.map((ch) => (
          <a
            key={ch.id}
            href={`#${ch.id}`}
            className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors
                        ${activeId === ch.id
                          ? 'border-text-muted text-text-primary bg-surface-elevated'
                          : 'border-surface-border text-text-muted hover:text-text-secondary'
                        }`}
          >
            <span className="font-mono mr-1.5 text-[10px]">
              {String(ch.chapterNumber).padStart(2, '0')}
            </span>
            {ch.title}
          </a>
        ))}
      </div>
    </div>
  );
}
