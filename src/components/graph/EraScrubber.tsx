'use client';

import { Play, Pause, SkipBack } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export const ERAS = [
  { id: null,            label: 'All eras' },
  { id: 'pre-1990',      label: 'Pre-1990' },
  { id: '1990-2000',     label: '1990\u20132000' },
  { id: '2001-2007',     label: '2001\u20132007' },
  { id: '2008-2018',     label: '2008\u20132018' },
  { id: '2019',          label: '2019' },
  { id: '2020-present',  label: '2020\u2013Present' },
] as const;

interface Props {
  activeEra: string | null;
  onChange: (era: string | null) => void;
}

export default function EraScrubber({ activeEra, onChange }: Props) {
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-play: step through non-null eras every 2.5s
  useEffect(() => {
    if (!playing) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const nonNullEras = ERAS.filter((e) => e.id !== null);
    intervalRef.current = setInterval(() => {
      const currentIdx = nonNullEras.findIndex((e) => e.id === activeEra);
      const nextIdx = (currentIdx + 1) % nonNullEras.length;
      onChange(nonNullEras[nextIdx].id as string);
    }, 2500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, activeEra, onChange]);

  const activeLabel = ERAS.find((e) => e.id === activeEra)?.label ?? 'All eras';

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 bg-surface/90 backdrop-blur-sm
                 border-t border-surface-border px-4 py-2"
      aria-label="Era scrubber"
    >
      <div className="flex items-center gap-3 max-w-screen-xl mx-auto">
        {/* Play/pause + reset buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => { onChange(null); setPlaying(false); }}
            className="p-1.5 text-text-muted hover:text-text-secondary transition-colors rounded"
            aria-label="Reset to all eras"
          >
            <SkipBack size={12} />
          </button>
          <button
            onClick={() => {
              if (!playing && activeEra === null) onChange('pre-1990');
              setPlaying((p) => !p);
            }}
            className="p-1.5 text-text-muted hover:text-text-secondary transition-colors rounded"
            aria-label={playing ? 'Pause playback' : 'Play through eras'}
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
          </button>
        </div>

        {/* Era label */}
        <span className="text-xs font-mono text-text-muted w-28 shrink-0">
          {activeLabel}
        </span>

        {/* Era buttons */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {ERAS.map((era) => (
            <button
              key={String(era.id)}
              onClick={() => { onChange(era.id as string | null); setPlaying(false); }}
              aria-pressed={activeEra === era.id}
              className={`shrink-0 text-[10px] px-2.5 py-1 rounded border transition-colors
                          whitespace-nowrap
                          ${activeEra === era.id
                            ? 'border-accent-blue text-accent-blue bg-accent-blue/10'
                            : 'border-surface-border text-text-muted hover:text-text-secondary'
                          }`}
            >
              {era.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
