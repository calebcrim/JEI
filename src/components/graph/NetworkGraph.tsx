'use client';

import { useEffect, useRef, useState } from 'react';
import type { Person, Connection } from '@/types';
import type * as d3Types from 'd3';

interface Props {
  people: Person[];
  connections: Connection[];
  filterCategories?: Set<string>;
  filterStrength?: number;
  focusPersonId?: string | null;
  onPersonClick?: (person: Person) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  principal: '#ef4444',
  'inner-circle': '#f97316',
  political: '#3b82f6',
  financial: '#10b981',
  legal: '#8b5cf6',
  intelligence: '#6366f1',
  'academic-scientific': '#06b6d4',
  media: '#ec4899',
  victim: '#94a3b8',
  'law-enforcement': '#64748b',
  other: '#475569',
};

const EDGE_COLORS: Record<string, string> = {
  'co-conspirator': '#ef4444',
  'employer-employee': '#f97316',
  financial: '#10b981',
  social: '#6366f1',
  'flew-together': '#3b82f6',
  'legal-representation': '#8b5cf6',
  intelligence: '#6366f1',
  academic: '#06b6d4',
  'victim-perpetrator': '#94a3b8',
};

const MIN_RADIUS = 8;
const MAX_RADIUS = 30;

interface SimNode extends d3Types.SimulationNodeDatum {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  mentionCount?: number;
  flightLegs?: number;
  currentStatus?: string;
  summary: string;
}

interface SimLink extends d3Types.SimulationLinkDatum<SimNode> {
  relationshipType: string;
  strength: number;
  verificationStatus?: string;
}

export default function NetworkGraph({
  people,
  connections,
  filterCategories,
  filterStrength = 1,
  focusPersonId,
  onPersonClick,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<{
    x: number; y: number; person: SimNode;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let sim: any = null;

    async function init() {
      const d3 = await import('d3');
      if (cancelled || !svgRef.current || !containerRef.current) return;

      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 600;

      const filteredPeople: SimNode[] = (
        filterCategories && filterCategories.size > 0
          ? people.filter((p) => filterCategories.has(p.category))
          : people
      ).map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        subcategory: p.subcategory,
        mentionCount: p.mentionCount,
        flightLegs: p.flightLegs,
        currentStatus: p.currentStatus,
        summary: p.summary,
      }));

      const personIds = new Set(filteredPeople.map((p) => p.id));
      const filteredEdges: SimLink[] = connections
        .filter(
          (c) =>
            c.strength >= filterStrength &&
            personIds.has(c.sourcePersonId) &&
            personIds.has(c.targetPersonId)
        )
        .map((c) => ({
          source: c.sourcePersonId,
          target: c.targetPersonId,
          relationshipType: c.relationshipType,
          strength: c.strength,
          verificationStatus: c.verificationStatus,
        }));

      const mentionCounts = filteredPeople.map((p) => p.mentionCount ?? 1);
      const maxM = Math.max(...mentionCounts, 1);
      const minM = Math.min(...mentionCounts, 1);
      const logRange = Math.log(Math.max(maxM, 2)) - Math.log(Math.max(minM, 1));

      function nodeRadius(m: number): number {
        if (logRange === 0) return (MIN_RADIUS + MAX_RADIUS) / 2;
        const t = (Math.log(Math.max(m, 1)) - Math.log(Math.max(minM, 1))) / logRange;
        return MIN_RADIUS + t * (MAX_RADIUS - MIN_RADIUS);
      }

      d3.select(svgRef.current).selectAll('*').remove();
      if (sim) sim.stop();

      const svg = d3.select(svgRef.current)
        .attr('width', width)
        .attr('height', height);

      const g = svg.append('g');

      // Zoom
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .on('zoom', (event: any) => { g.attr('transform', event.transform); });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (svg as any).call(zoom);

      // Edges — verified financial connections get solid green, unverified get dashed
      const link = g.append('g').selectAll<SVGLineElement, SimLink>('line')
        .data(filteredEdges)
        .enter()
        .append('line')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('stroke', (d: any) => EDGE_COLORS[d.relationshipType] ?? '#2a3347')
        .attr('stroke-opacity', 0.5)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('stroke-width', (d: any) => d.relationshipType === 'financial' && d.verificationStatus === 'verified' ? Math.max(d.strength, 2) : d.strength)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .attr('stroke-dasharray', (d: any) => d.relationshipType === 'financial' && d.verificationStatus !== 'verified' ? '4,4' : 'none');

      // Nodes
      const nodeG = g.append('g').selectAll<SVGGElement, SimNode>('g')
        .data(filteredPeople)
        .enter()
        .append('g')
        .attr('cursor', 'pointer');

      // Drag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const drag = d3.drag<SVGGElement, SimNode>() as any;
      drag
        .on('start', (_ev: unknown, d: SimNode) => {
          if (sim) sim.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (ev: { x: number; y: number }, d: SimNode) => {
          d.fx = ev.x; d.fy = ev.y;
        })
        .on('end', (_ev: unknown, d: SimNode) => {
          if (sim) sim.alphaTarget(0);
          d.fx = undefined; d.fy = undefined;
        });
      nodeG.call(drag);

      // Node shapes — circles for people, diamonds for shell entities
      nodeG.each(function (this: SVGGElement, d: SimNode) {
        const el = d3.select(this);
        const r = nodeRadius(d.mentionCount ?? 1);
        const isShell = d.subcategory === 'shell-entity';
        const fillColor = isShell ? '#FFB020' : (CATEGORY_COLORS[d.category] ?? '#475569');
        const strokeColor = focusPersonId === d.id ? '#e8eaf0' : fillColor;
        const strokeW = focusPersonId === d.id ? 2 : 0.5;

        if (isShell) {
          // Diamond shape (rotated square)
          const s = r * 1.1;
          el.append('rect')
            .attr('width', s * 2)
            .attr('height', s * 2)
            .attr('x', -s)
            .attr('y', -s)
            .attr('rx', 2)
            .attr('transform', `rotate(45)`)
            .attr('fill', fillColor)
            .attr('fill-opacity', 0.85)
            .attr('stroke', strokeColor)
            .attr('stroke-width', strokeW)
            .attr('stroke-opacity', 0.5)
            .classed('node-shape', true);
        } else {
          el.append('circle')
            .attr('r', r)
            .attr('fill', fillColor)
            .attr('fill-opacity', 0.85)
            .attr('stroke', strokeColor)
            .attr('stroke-width', strokeW)
            .attr('stroke-opacity', 0.5)
            .classed('node-shape', true);
        }
      });

      // Labels
      nodeG.append('text')
        .text((d: SimNode) => {
          if (nodeRadius(d.mentionCount ?? 1) < 12) return '';
          const parts = d.name.split(' ');
          return parts[parts.length - 1];
        })
        .attr('text-anchor', 'middle')
        .attr('dy', (d: SimNode) => nodeRadius(d.mentionCount ?? 1) + 11)
        .attr('font-size', '9px')
        .attr('fill', '#8b95a8')
        .attr('pointer-events', 'none');

      // Events
      nodeG
        .on('mouseover', function (this: SVGGElement, ev: MouseEvent, d: SimNode) {
          d3.select(this).select('.node-shape').attr('fill-opacity', 1);
          const b = containerRef.current?.getBoundingClientRect();
          if (b) setTooltip({ x: ev.clientX - b.left, y: ev.clientY - b.top, person: d });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          link.attr('stroke-opacity', (c: any) =>
            (c.source as SimNode).id === d.id || (c.target as SimNode).id === d.id ? 1 : 0.1
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ).attr('stroke-width', (c: any) =>
            (c.source as SimNode).id === d.id || (c.target as SimNode).id === d.id
              ? (c as SimLink).strength * 2
              : (c as SimLink).strength
          );
        })
        .on('mousemove', (ev: MouseEvent) => {
          const b = containerRef.current?.getBoundingClientRect();
          if (b) setTooltip((p) => p ? { ...p, x: ev.clientX - b.left, y: ev.clientY - b.top } : null);
        })
        .on('mouseout', function (this: SVGGElement) {
          d3.select(this).select('.node-shape').attr('fill-opacity', 0.85);
          setTooltip(null);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          link.attr('stroke-opacity', 0.5).attr('stroke-width', (c: any) => (c as SimLink).strength);
        })
        .on('click', (_: MouseEvent, d: SimNode) => {
          const p = people.find((x) => x.id === d.id);
          if (p) onPersonClick?.(p);
        });

      // Simulation
      sim = d3.forceSimulation<SimNode>(filteredPeople)
        .force(
          'link',
          d3.forceLink<SimNode, SimLink>(filteredEdges)
            .id((d) => d.id)
            .distance((d) => 80 / d.strength)
        )
        .force('charge', d3.forceManyBody().strength(-120))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide<SimNode>().radius((d) => nodeRadius(d.mentionCount ?? 1) + 4));

      sim.on('tick', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        link
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .attr('x1', (d: any) => ((d.source as SimNode).x ?? 0))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .attr('y1', (d: any) => ((d.source as SimNode).y ?? 0))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .attr('x2', (d: any) => ((d.target as SimNode).x ?? 0))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .attr('y2', (d: any) => ((d.target as SimNode).y ?? 0));
        nodeG.attr('transform', (d: SimNode) => `translate(${d.x ?? 0},${d.y ?? 0})`);
      });
    }

    init();
    return () => {
      cancelled = true;
      if (sim) sim.stop();
    };
  }, [people, connections, filterCategories, filterStrength, focusPersonId, onPersonClick]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" aria-label="People connections network graph" />
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-surface-card border border-surface-border
                     rounded-lg p-3 shadow-xl z-10 max-w-[200px]"
          style={{
            left: Math.min(tooltip.x + 12, (containerRef.current?.clientWidth ?? 400) - 220),
            top: Math.min(tooltip.y - 10, (containerRef.current?.clientHeight ?? 400) - 140),
          }}
        >
          <p className="text-sm font-semibold text-text-primary">{tooltip.person.name}</p>
          <p className="text-xs text-text-muted capitalize mb-1">
            {tooltip.person.category.replace(/-/g, ' ')}
          </p>
          {tooltip.person.mentionCount && (
            <p className="text-xs text-text-secondary">
              {tooltip.person.mentionCount.toLocaleString()} DOJ mentions
            </p>
          )}
          {tooltip.person.flightLegs && (
            <p className="text-xs text-text-secondary">~{tooltip.person.flightLegs} flight legs</p>
          )}
          <p className="text-xs text-accent-blue mt-1">Click to view profile →</p>
        </div>
      )}
    </div>
  );
}
