import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import type { EraSynthesis } from '@/data/timeline-causality';

interface Props {
  synthesis: EraSynthesis;
}

export default function EraSynthesisBlock({ synthesis }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="mb-5 rounded-lg border border-surface-border bg-surface-card overflow-hidden"
      aria-label={`Era synthesis: ${synthesis.headline}`}
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3
                   text-left hover:bg-surface-elevated transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <BookOpen
            size={13}
            className="text-text-muted shrink-0"
            aria-hidden
          />
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest truncate">
            {synthesis.headline}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-accent-blue">
            {expanded ? 'Collapse' : 'Analysis'}
          </span>
          {expanded
            ? <ChevronUp size={12} className="text-text-muted" aria-hidden />
            : <ChevronDown size={12} className="text-text-muted" aria-hidden />
          }
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-surface-border">
          <p className="text-sm text-text-secondary leading-relaxed mt-3 mb-3">
            {synthesis.synthesis.trim()}
          </p>

          {/* Key shift callout */}
          <div
            className="flex items-start gap-2.5 bg-surface rounded border-l-2
                       border-amber-600/60 px-3 py-2.5"
            aria-label="Key transition to next era"
          >
            <ArrowRight
              size={12}
              className="text-amber-500 shrink-0 mt-0.5"
              aria-hidden
            />
            <p className="text-xs text-text-secondary leading-relaxed">
              <span className="text-amber-400 font-medium">Transition: </span>
              {synthesis.keyShift.trim()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
