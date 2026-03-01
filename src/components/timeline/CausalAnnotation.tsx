import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getCausedBy, getLeadsTo } from '@/data/timeline-causality';
import timelineData from '@/data/timeline.json';
import type { TimelineEvent } from '@/types';

const allEvents = timelineData as TimelineEvent[];

interface Props {
  eventId: string;
  onNavigate?: (eventId: string) => void;
}

export default function CausalAnnotation({ eventId, onNavigate }: Props) {
  const leadsTo = getLeadsTo(eventId);
  const causedBy = getCausedBy(eventId);

  // Filter to only pairs where the related event actually exists in timeline.json
  const validLeadsTo = leadsTo.filter((p) =>
    allEvents.some((e) => e.id === p.consequenceId)
  );
  const validCausedBy = causedBy.filter((p) =>
    allEvents.some((e) => e.id === p.causeId)
  );

  if (validLeadsTo.length === 0 && validCausedBy.length === 0) return null;

  function getTitle(id: string) {
    return allEvents.find((e) => e.id === id)?.title ?? id;
  }

  function handleClick(e: React.MouseEvent, targetId: string) {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(targetId);
    } else {
      // Fallback: scroll to target event
      const el = document.getElementById(targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }
  }

  return (
    <div
      className="mt-3 pt-3 border-t border-surface-border/50 space-y-2"
      aria-label="Causal connections"
    >
      {/* "Caused by" entries */}
      {validCausedBy.map((pair) => (
        <div key={pair.causeId} className="flex items-start gap-2">
          <ArrowLeft
            size={11}
            className="text-blue-400/70 shrink-0 mt-0.5"
            aria-hidden
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-blue-400/70 uppercase tracking-widest">
                Enabled by
              </span>
              <button
                onClick={(e) => handleClick(e, pair.causeId)}
                className="text-xs text-accent-blue hover:text-accent-blueHover
                           transition-colors text-left leading-snug"
                aria-label={`Navigate to: ${getTitle(pair.causeId)}`}
              >
                {getTitle(pair.causeId)}
              </button>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed mt-0.5">
              {pair.description.trim()}
            </p>
          </div>
        </div>
      ))}

      {/* "Leads to" entries */}
      {validLeadsTo.map((pair) => (
        <div key={pair.consequenceId} className="flex items-start gap-2">
          <ArrowRight
            size={11}
            className="text-amber-400/70 shrink-0 mt-0.5"
            aria-hidden
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-amber-400/70 uppercase tracking-widest">
                Led to
              </span>
              <button
                onClick={(e) => handleClick(e, pair.consequenceId)}
                className="text-xs text-accent-blue hover:text-accent-blueHover
                           transition-colors text-left leading-snug"
                aria-label={`Navigate to: ${getTitle(pair.consequenceId)}`}
              >
                {getTitle(pair.consequenceId)}
              </button>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed mt-0.5">
              {pair.description.trim()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
