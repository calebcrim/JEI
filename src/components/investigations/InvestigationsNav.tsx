'use client';

import { useState, useEffect } from 'react';
import type { InvestigationChapter } from '@/types';

interface Props {
  chapters: InvestigationChapter[];
}

export default function InvestigationsNav({ chapters }: Props) {
  const [activeId, setActiveId] = useState<string>(chapters[0]?.id ?? '');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );

    chapters.forEach((ch) => {
      const el = document.getElementById(ch.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [chapters]);

  return (
    <nav aria-label="Chapter navigation">
      <ol className="space-y-1">
        {chapters.map((ch) => (
          <li key={ch.id}>
            <a
              href={`#${ch.id}`}
              className={`flex items-start gap-2.5 px-2 py-2 rounded text-xs
                          transition-colors leading-snug group
                          ${activeId === ch.id
                            ? 'text-text-primary bg-surface-elevated'
                            : 'text-text-muted hover:text-text-secondary hover:bg-surface-elevated'
                          }`}
              aria-current={activeId === ch.id ? 'true' : undefined}
            >
              <span
                className={`shrink-0 font-mono text-[10px] mt-0.5 transition-colors
                            ${activeId === ch.id ? 'text-text-secondary' : 'text-text-muted'}`}
              >
                {String(ch.chapterNumber).padStart(2, '0')}
              </span>
              <span className="leading-snug">{ch.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
