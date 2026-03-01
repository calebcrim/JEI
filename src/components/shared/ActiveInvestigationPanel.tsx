// src/components/shared/ActiveInvestigationPanel.tsx
'use client';

import { useState } from 'react';
import { Scale, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { STATUS_CONFIG, TYPE_LABELS } from '@/data/investigation-status';
import type { Proceeding } from '@/data/investigation-status';

interface Props {
  proceedings: Proceeding[];
  /** compact: renders as a single-line collapsed toggle (for EventCard) */
  compact?: boolean;
  /** label: customize the collapsed header text */
  label?: string;
}

export default function ActiveInvestigationPanel({
  proceedings,
  compact = false,
  label,
}: Props) {
  const [expanded, setExpanded] = useState(!compact);

  if (proceedings.length === 0) return null;

  const activeCount = proceedings.filter(
    (p) => p.status === 'active' || p.status === 'scheduled'
  ).length;

  const headerLabel =
    label ??
    (activeCount > 0
      ? `${activeCount} active proceeding${activeCount !== 1 ? 's' : ''}`
      : `${proceedings.length} proceeding${proceedings.length !== 1 ? 's' : ''}`);

  return (
    <div
      className={`rounded-lg border overflow-hidden
                  ${compact ? 'border-surface-border' : 'border-green-900/30 bg-green-950/10'}`}
      aria-label="Active investigation status"
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left
                   hover:bg-surface-elevated transition-colors"
        aria-expanded={expanded}
      >
        <Scale size={11} className="text-green-400/70 shrink-0" aria-hidden />
        <span className="text-[11px] font-mono text-green-400/80 uppercase tracking-wider flex-1">
          {headerLabel}
        </span>
        {compact && (
          expanded
            ? <ChevronUp size={11} className="text-text-muted" aria-hidden />
            : <ChevronDown size={11} className="text-text-muted" aria-hidden />
        )}
      </button>

      {/* Proceedings list */}
      {expanded && (
        <div className="px-3 pb-3 space-y-2.5">
          {proceedings.map((proc) => {
            const cfg = STATUS_CONFIG[proc.status];
            return (
              <div
                key={proc.id}
                className={`rounded border px-2.5 py-2 ${cfg.borderClass}`}
              >
                {/* Status dot + type + date */}
                <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                  <div className="flex items-center gap-1.5">
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
                  </div>
                  {proc.date && (
                    <span className="text-[10px] text-text-muted shrink-0">
                      {proc.date}
                    </span>
                  )}
                </div>

                {/* Title */}
                <p className="text-xs font-medium text-text-primary leading-snug mb-0.5">
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
                  ) : (
                    proc.title
                  )}
                </p>

                {/* Description */}
                <p className="text-[11px] text-text-muted leading-relaxed">
                  {proc.description.trim()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
