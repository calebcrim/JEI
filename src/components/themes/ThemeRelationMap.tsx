'use client';

import { useState } from 'react';
import { getAllConnectionPairs } from '@/data/theme-connections';
import type { ThemeSection } from '@/types';
import themesData from '@/data/themes.json';

const themes = themesData as ThemeSection[];
const connectionPairs = getAllConnectionPairs();

// Pre-computed node positions as (x%, y%) fractions of the SVG viewBox.
// Layout groups: operational core (center), legal/institutional (bottom),
// evidence/documents (top right), political/intelligence (left).
// Keys use actual theme IDs from themes.json (verified via Phase 0).
const NODE_POSITIONS: Record<string, { x: number; y: number; short: string }> = {
  // Operational core — center cluster
  'the-trafficking-operation':                    { x: 42, y: 38, short: 'Trafficking' },
  'maxwell-role-legal-history-current-status':    { x: 34, y: 28, short: 'Maxwell' },
  'the-co-conspirators-immunity-grantees':        { x: 52, y: 28, short: 'Immunity' },

  // Legal/institutional — bottom center
  'the-acosta-plea-deal-legal-history':           { x: 38, y: 55, short: 'Plea Deal' },

  // Financial/intelligence — left arc
  'financial-crimes-money-laundering':            { x: 18, y: 42, short: 'Financial' },
  'intelligence-connections':                     { x: 18, y: 28, short: 'Intelligence' },
  'political-intelligence-network':               { x: 26, y: 18, short: 'Political Net.' },

  // Political connections — lower left
  'trumpepstein-connections':                     { x: 12, y: 55, short: 'Trump-Epstein' },
  'melania-trump-thread':                         { x: 8,  y: 68, short: 'Melania' },

  // Document/evidence — top right
  'efta-release-framework-document-architecture': { x: 72, y: 18, short: 'EFTA' },
  'community-research-tools-architecture':        { x: 82, y: 32, short: 'Comm. Tools' },
  'whoops-emails':                                { x: 82, y: 48, short: '"Whoops"' },
  'baby-stuff-thread':                            { x: 90, y: 62, short: 'Baby Stuff' },

  // Death/MCC — right center
  'epsteins-death-mcc-anomalies':                 { x: 68, y: 42, short: 'Death / MCC' },

  // International/media — bottom right
  'international-consequences-fallout':           { x: 60, y: 65, short: 'International' },
  'media-congressional-investigations':           { x: 48, y: 72, short: 'Media / Congress' },

  // Academic/other — top arc
  'academic-scientific-network':                  { x: 52, y: 10, short: 'Academic' },

  // Financial analysis — bottom left
  'cross-network-financial-analysis-epstein-as-financial-hub': { x: 22, y: 72, short: 'Fin. Analysis' },

  // Rothschild — bottom
  'the-rothschild-dynasty-25-million-access-brokerage-intelligence-nexus': { x: 34, y: 82, short: 'Rothschild' },
};

// Fallback positions for themes not explicitly positioned
const DEFAULT_POSITIONS = [
  { x: 20, y: 72 }, { x: 30, y: 82 }, { x: 70, y: 78 }, { x: 78, y: 65 },
];

const EDGE_COLORS: Record<number, string> = {
  3: '#7f1d1d88',   // dark red, semi-transparent
  2: '#1e3a5f88',   // dark blue
  1: '#1e293b88',   // surface
};

const EDGE_STROKE: Record<number, number> = {
  3: 2,
  2: 1.5,
  1: 1,
};

export default function ThemeRelationMap() {
  const [hoveredThemeId, setHoveredThemeId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  function getPos(themeId: string, idx: number) {
    return NODE_POSITIONS[themeId] ?? DEFAULT_POSITIONS[idx % DEFAULT_POSITIONS.length];
  }

  function scrollToTheme(themeId: string) {
    const el = document.getElementById(themeId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  // Only render connections that involve themes that exist in themes.json
  const validPairs = connectionPairs.filter(
    (p) =>
      themes.some((t) => t.id === p.sourceId) &&
      themes.some((t) => t.id === p.targetId)
  );

  if (!isExpanded) {
    return (
      <div className="border border-surface-border rounded-lg overflow-hidden mb-6">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between px-5 py-3 text-sm
                     text-text-muted hover:text-text-secondary hover:bg-surface-elevated
                     transition-colors"
          aria-expanded={false}
        >
          <span className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest">
              Theme Relationship Map
            </span>
            <span className="text-xs text-text-muted">
              — {themes.length} threads · {validPairs.length} documented connections
            </span>
          </span>
          <span className="text-xs text-accent-blue">+ Show map</span>
        </button>
      </div>
    );
  }

  const svgW = 900;
  const svgH = 520;

  return (
    <div className="border border-surface-border rounded-lg overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-surface-border bg-surface-card">
        <div>
          <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
            Theme Relationship Map
          </span>
          <span className="text-xs text-text-muted ml-3">
            Click any node to jump to that section
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          aria-label="Collapse theme map"
        >
          &minus; Collapse
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-2 border-b border-surface-border bg-surface/50">
        {([3, 2, 1] as const).map((s) => (
          <span key={s} className="flex items-center gap-1.5 text-[10px] text-text-muted">
            <span
              className="inline-block rounded-full"
              style={{
                width: EDGE_STROKE[s] * 16 + 'px',
                height: '2px',
                backgroundColor: EDGE_COLORS[s].slice(0, 7),
                opacity: 0.8,
              }}
            />
            {s === 3 ? 'Direct' : s === 2 ? 'Significant' : 'Tangential'}
          </span>
        ))}
      </div>

      {/* SVG map */}
      <div className="overflow-x-auto bg-surface">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full"
          style={{ minWidth: '480px', maxHeight: '420px' }}
          role="img"
          aria-label={`Theme relationship diagram showing connections between ${themes.length} investigative threads`}
        >
          {/* Edges */}
          <g>
            {validPairs.map((pair, i) => {
              const srcIdx = themes.findIndex((t) => t.id === pair.sourceId);
              const tgtIdx = themes.findIndex((t) => t.id === pair.targetId);
              const src = getPos(pair.sourceId, srcIdx);
              const tgt = getPos(pair.targetId, tgtIdx);
              const x1 = (src.x / 100) * svgW;
              const y1 = (src.y / 100) * svgH;
              const x2 = (tgt.x / 100) * svgW;
              const y2 = (tgt.y / 100) * svgH;

              // Highlight edges connected to hovered node
              const isHighlighted =
                hoveredThemeId === pair.sourceId || hoveredThemeId === pair.targetId;

              return (
                <line
                  key={i}
                  x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={EDGE_COLORS[pair.strength]}
                  strokeWidth={isHighlighted ? EDGE_STROKE[pair.strength] * 2 : EDGE_STROKE[pair.strength]}
                  strokeOpacity={
                    hoveredThemeId === null ? 0.6
                    : isHighlighted ? 1
                    : 0.08
                  }
                  style={{ transition: 'stroke-opacity 0.15s, stroke-width 0.15s' }}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {themes.map((theme, idx) => {
              const pos = getPos(theme.id, idx);
              const cx = (pos.x / 100) * svgW;
              const cy = (pos.y / 100) * svgH;
              const label = NODE_POSITIONS[theme.id]?.short ?? theme.title.split(' ')[0];
              const isHovered = hoveredThemeId === theme.id;
              const isDimmed = hoveredThemeId !== null && !isHovered &&
                !validPairs.some(
                  (p) =>
                    (p.sourceId === hoveredThemeId && p.targetId === theme.id) ||
                    (p.targetId === hoveredThemeId && p.sourceId === theme.id)
                );

              return (
                <g
                  key={theme.id}
                  transform={`translate(${cx},${cy})`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredThemeId(theme.id)}
                  onMouseLeave={() => setHoveredThemeId(null)}
                  onClick={() => scrollToTheme(theme.id)}
                  role="button"
                  aria-label={`Jump to ${theme.title}`}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      scrollToTheme(theme.id);
                    }
                  }}
                >
                  {/* Node circle */}
                  <circle
                    r={isHovered ? 9 : 7}
                    fill={isHovered ? '#3b82f6' : '#1e293b'}
                    stroke={isHovered ? '#3b82f6' : '#334155'}
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={isDimmed ? 0.15 : 1}
                    style={{ transition: 'r 0.15s, opacity 0.15s, fill 0.15s' }}
                  />

                  {/* Section number inside circle */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="7"
                    fontFamily="monospace"
                    fill={isHovered ? '#fff' : '#94a3b8'}
                    opacity={isDimmed ? 0.15 : 1}
                    style={{ pointerEvents: 'none', transition: 'opacity 0.15s' }}
                  >
                    {theme.sectionNumber}
                  </text>

                  {/* Label below node */}
                  <text
                    y={16}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="monospace"
                    fill={isHovered ? '#e2e8f0' : '#64748b'}
                    opacity={isDimmed ? 0.1 : 1}
                    style={{ pointerEvents: 'none', transition: 'opacity 0.15s, fill 0.15s' }}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
