'use client';

import { useState } from 'react';
import { Layers, X } from 'lucide-react';
import type { ThemeSection } from '@/types';
import themesData from '@/data/themes.json';

const themes = themesData as ThemeSection[];

interface Props {
  activeThemeId: string | null;
  onChange: (themeId: string | null) => void;
}

export default function ThemeHighlightSelector({ activeThemeId, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const active = themes.find((t) => t.id === activeThemeId);

  return (
    <div className="relative">
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
        Highlight Theme
      </p>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-2 text-xs py-1.5 px-2.5
                    rounded border transition-colors text-left
                    ${activeThemeId
                      ? 'border-amber-500/50 text-amber-300 bg-amber-500/10'
                      : 'border-surface-border text-text-muted hover:text-text-secondary'
                    }`}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <Layers size={11} className="shrink-0" aria-hidden />
          <span className="truncate">
            {active ? active.title : 'None selected'}
          </span>
        </span>
        {activeThemeId && (
          <button
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="shrink-0 text-text-muted hover:text-text-secondary transition-colors"
            aria-label="Clear theme highlight"
          >
            <X size={10} />
          </button>
        )}
      </button>

      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-surface-card border
                     border-surface-border rounded-lg shadow-xl z-50 max-h-64
                     overflow-y-auto"
          role="listbox"
          aria-label="Select theme to highlight"
        >
          <button
            role="option"
            aria-selected={activeThemeId === null}
            onClick={() => { onChange(null); setOpen(false); }}
            className="w-full text-left text-xs px-3 py-2 text-text-muted
                       hover:bg-surface-elevated transition-colors"
          >
            None (show all)
          </button>
          {themes.map((theme) => (
            <button
              key={theme.id}
              role="option"
              aria-selected={activeThemeId === theme.id}
              onClick={() => { onChange(theme.id); setOpen(false); }}
              className={`w-full text-left text-xs px-3 py-2 transition-colors leading-snug
                          ${activeThemeId === theme.id
                            ? 'bg-amber-500/10 text-amber-300'
                            : 'text-text-secondary hover:bg-surface-elevated'
                          }`}
            >
              <span className="font-mono text-text-muted mr-1.5">
                {String(theme.sectionNumber).padStart(2, '0')}
              </span>
              {theme.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
