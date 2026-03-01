'use client';

import { Network, Grid } from 'lucide-react';

interface Props {
  viewMode: 'network' | 'cluster';
  onChange: (mode: 'network' | 'cluster') => void;
}

export default function GraphModeToggle({ viewMode, onChange }: Props) {
  return (
    <div>
      <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
        Layout
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onChange('network')}
          aria-pressed={viewMode === 'network'}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded
                      border transition-colors
                      ${viewMode === 'network'
                        ? 'border-accent-blue text-accent-blue bg-accent-blue/10'
                        : 'border-surface-border text-text-muted hover:text-text-secondary'
                      }`}
        >
          <Network size={12} aria-hidden /> Network
        </button>
        <button
          onClick={() => onChange('cluster')}
          aria-pressed={viewMode === 'cluster'}
          className={`flex-1 flex items-center justify-center gap-1.5 text-xs py-1.5 rounded
                      border transition-colors
                      ${viewMode === 'cluster'
                        ? 'border-accent-blue text-accent-blue bg-accent-blue/10'
                        : 'border-surface-border text-text-muted hover:text-text-secondary'
                      }`}
        >
          <Grid size={12} aria-hidden /> Cluster
        </button>
      </div>
    </div>
  );
}
