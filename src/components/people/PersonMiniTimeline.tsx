// src/components/people/PersonMiniTimeline.tsx
import Link from 'next/link';
import { Clock, AlertTriangle } from 'lucide-react';
import type { TimelineEvent } from '@/types';

interface Props {
  events: TimelineEvent[];
  personName: string;
}

const ERA_LABELS: Record<string, string> = {
  'pre-1990':     'Pre-1990',
  '1990-2000':    '1990–2000',
  '2001-2007':    '2001–2007',
  '2008-2018':    '2008–2018',
  '2019':         '2019',
  '2020-present': '2020–Present',
};

export default function PersonMiniTimeline({ events, personName }: Props) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-text-muted py-2">
        No timeline events indexed for {personName}.
      </p>
    );
  }

  // Sort by date
  const sorted = [...events].sort((a, b) => {
    const aDate = a.date ?? '0000';
    const bDate = b.date ?? '0000';
    return aDate.localeCompare(bDate);
  });

  // Group by era
  const byEra = new Map<string, TimelineEvent[]>();
  for (const event of sorted) {
    const era = event.era ?? 'pre-1990';
    if (!byEra.has(era)) byEra.set(era, []);
    byEra.get(era)!.push(event);
  }

  const eraOrder = ['pre-1990', '1990-2000', '2001-2007', '2008-2018', '2019', '2020-present'];
  const presentEras = eraOrder.filter((e) => byEra.has(e));

  return (
    <div aria-label={`Timeline events for ${personName}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-text-muted" aria-hidden />
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
            Timeline ({events.length} event{events.length !== 1 ? 's' : ''})
          </span>
        </div>
        <Link
          href={`/timeline/?person=${encodeURIComponent(personName)}`}
          className="text-xs text-text-muted hover:text-text-secondary transition-colors"
        >
          View full timeline →
        </Link>
      </div>

      <div className="space-y-5">
        {presentEras.map((era) => {
          const eraEvents = byEra.get(era)!;
          return (
            <div key={era}>
              <p className="text-[10px] font-mono text-text-muted uppercase tracking-widest
                            mb-2 pb-1 border-b border-surface-border">
                {ERA_LABELS[era] ?? era}
              </p>
              <div className="space-y-0">
                {eraEvents.map((event, i) => (
                  <Link
                    key={event.id}
                    href={`/timeline/#${event.id}`}
                    className={`flex gap-3 py-2.5 group
                                ${i < eraEvents.length - 1 ? 'border-b border-surface-border/50' : ''}`}
                    aria-label={`${event.date ?? 'Undated'}: ${event.title}`}
                  >
                    {/* Date column */}
                    <span className="shrink-0 w-24 text-[11px] font-mono text-text-muted
                                     group-hover:text-text-secondary transition-colors mt-0.5">
                      {event.date ?? 'Undated'}
                    </span>

                    {/* Content column */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-1.5">
                        {event.verificationStatus === 'unverified' && (
                          <AlertTriangle
                            size={11}
                            className="shrink-0 text-amber-500 mt-0.5"
                            aria-label="Unverified"
                          />
                        )}
                        <p className="text-xs text-text-secondary leading-snug line-clamp-2
                                      group-hover:text-text-primary transition-colors">
                          {event.title}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {events.length > 8 && (
        <div className="mt-3 pt-3 border-t border-surface-border">
          <Link
            href={`/timeline/?person=${encodeURIComponent(personName)}`}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            See all {events.length} events in full timeline →
          </Link>
        </div>
      )}
    </div>
  );
}
