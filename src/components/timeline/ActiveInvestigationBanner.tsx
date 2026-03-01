// src/components/timeline/ActiveInvestigationBanner.tsx
'use client';

import { useState } from 'react';
import { Scale, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { getGlobalProceedings, STATUS_CONFIG, TYPE_LABELS } from '@/data/investigation-status';

export default function ActiveInvestigationBanner() {
  const [expanded, setExpanded] = useState(false);
  const globalProceedings = getGlobalProceedings(6);

  if (globalProceedings.length === 0) return null;

  const activeCount = globalProceedings.filter(
    (p) => p.status === 'active' || p.status === 'scheduled'
  ).length;

  return (
    <div
      className="mb-6 rounded-lg border border-green-900/30 bg-green-950/10 overflow-hidden"
      aria-label="Active investigation proceedings"
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between gap-4 px-4 py-3
                   text-left hover:bg-green-950/20 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-2.5">
          <Scale size={13} className="text-green-400/70 shrink-0" aria-hidden />
          <div>
            <span className="text-xs font-mono text-green-400/80 uppercase tracking-wider">
              Investigation Status
            </span>
            <span className="text-xs text-text-muted ml-2">
              {activeCount} active · compiled March 2026
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] text-green-400/60">
            {expanded ? 'Collapse' : 'Show proceedings'}
          </span>
          {expanded
            ? <ChevronUp size={12} className="text-text-muted" aria-hidden />
            : <ChevronDown size={12} className="text-text-muted" aria-hidden />
          }
        </div>
      </button>

      {/* Proceedings grid */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-green-900/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
            {globalProceedings.map((proc) => {
              const cfg = STATUS_CONFIG[proc.status];
              return (
                <div
                  key={proc.id}
                  className={`rounded border px-3 py-2 ${cfg.borderClass} bg-surface-card/50`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dotClass}`}
                      aria-hidden
                    />
                    <span className={`text-[10px] font-mono uppercase tracking-wider ${cfg.textClass}`}>
                      {cfg.label}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      · {TYPE_LABELS[proc.type]}
                    </span>
                    {proc.date && (
                      <span className="text-[10px] text-text-muted ml-auto">
                        {proc.date}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-text-primary leading-snug">
                    {proc.url ? (
                      <a
                        href={proc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-accent-blue transition-colors inline-flex items-center gap-1"
                      >
                        {proc.title}
                        <ExternalLink size={9} aria-hidden />
                      </a>
                    ) : proc.title}
                  </p>
                  <p className="text-[11px] text-text-muted leading-relaxed mt-0.5 line-clamp-2">
                    {proc.description.trim()}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-text-muted mt-3 italic">
            Proceedings compiled from research sources as of March 2026. This section updates
            with each site rebuild; confirm current status via linked sources.
          </p>
        </div>
      )}
    </div>
  );
}
