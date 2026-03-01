// src/components/people/PersonEgoGraph.tsx
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { Person, Connection } from '@/types';

interface Props {
  person: Person;
  connections: Connection[];
  allPeople: Person[];
}

// Map relationship types to edge colors
const EDGE_COLORS: Record<Connection['relationshipType'], string> = {
  'co-conspirator':       '#ef4444',   // red
  'employer-employee':    '#f97316',   // orange
  'financial':            '#a855f7',   // purple
  'social':               '#6b7280',   // gray
  'flew-together':        '#3b82f6',   // blue
  'legal-representation': '#eab308',   // yellow
  'intelligence':         '#06b6d4',   // cyan
  'academic':             '#22c55e',   // green
  'victim-perpetrator':   '#dc2626',   // dark red
};

// Map PersonCategory to node fill colors (matching existing graph page palette)
const NODE_COLORS: Record<string, string> = {
  'principal':             '#ef4444',
  'inner-circle':          '#f97316',
  'political':             '#3b82f6',
  'financial':             '#a855f7',
  'legal':                 '#eab308',
  'intelligence':          '#06b6d4',
  'academic-scientific':   '#22c55e',
  'media':                 '#ec4899',
  'victim':                '#94a3b8',
  'law-enforcement':       '#64748b',
  'other':                 '#475569',
};

interface SimNode {
  id: string;
  name: string;
  category: string;
  isCenter: boolean;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimLink {
  source: string | SimNode;
  target: string | SimNode;
  strength: number;
  relationshipType: Connection['relationshipType'];
  description: string;
}

export default function PersonEgoGraph({ person, connections, allPeople }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const router = useRouter();

  const handleNodeClick = useCallback(
    (personId: string) => {
      if (personId !== person.id) {
        router.push(`/people/${personId}/`);
      }
    },
    [person.id, router]
  );

  useEffect(() => {
    if (!svgRef.current || connections.length === 0) return;

    // Dynamically import D3 to keep it client-side only
    import('d3').then((d3) => {
      const svg = d3.select(svgRef.current!);
      svg.selectAll('*').remove();

      const width = svgRef.current!.clientWidth || 560;
      const height = 300;

      svg.attr('viewBox', `0 0 ${width} ${height}`);

      // Build node list: center person + first-degree connections
      const connectedIds = new Set<string>();
      connections.forEach((c) => {
        connectedIds.add(c.sourcePersonId);
        connectedIds.add(c.targetPersonId);
      });
      connectedIds.delete(person.id); // center node handled separately

      const nodes: SimNode[] = [
        { id: person.id, name: person.name, category: person.category, isCenter: true },
        ...Array.from(connectedIds)
          .map((id) => allPeople.find((p) => p.id === id))
          .filter((p): p is Person => p !== undefined)
          .map((p) => ({ id: p.id, name: p.name, category: p.category, isCenter: false })),
      ];

      const links: SimLink[] = connections.map((c) => ({
        source: c.sourcePersonId,
        target: c.targetPersonId,
        strength: c.strength,
        relationshipType: c.relationshipType,
        description: c.description,
      }));

      // Force simulation
      const simulation = d3
        .forceSimulation<SimNode>(nodes)
        .force(
          'link',
          d3
            .forceLink<SimNode, SimLink>(links)
            .id((d) => d.id)
            .distance((l) => 90 - l.strength * 15)
            .strength(0.4)
        )
        .force('charge', d3.forceManyBody().strength(-180))
        .force('center', d3.forceCenter(width / 2, height / 2))
        .force('collision', d3.forceCollide(28));

      // Fix center node
      const centerNode = nodes.find((n) => n.isCenter)!;
      centerNode.fx = width / 2;
      centerNode.fy = height / 2;

      // Defs: arrowhead marker
      const defs = svg.append('defs');
      defs
        .append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -4 8 8')
        .attr('refX', 18)
        .attr('refY', 0)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L8,0L0,4')
        .attr('fill', '#475569');

      // Edge group
      const linkGroup = svg.append('g').attr('class', 'links');
      const linkEls = linkGroup
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', (l) => EDGE_COLORS[l.relationshipType] ?? '#475569')
        .attr('stroke-opacity', 0.5)
        .attr('stroke-width', (l) => l.strength * 1.2)
        .attr('marker-end', 'url(#arrowhead)');

      // Tooltip div
      const tooltip = d3
        .select('body')
        .append('div')
        .style('position', 'fixed')
        .style('pointer-events', 'none')
        .style('background', '#1e293b')
        .style('border', '1px solid #334155')
        .style('border-radius', '6px')
        .style('padding', '8px 12px')
        .style('font-size', '11px')
        .style('color', '#cbd5e1')
        .style('max-width', '200px')
        .style('line-height', '1.4')
        .style('z-index', '9999')
        .style('opacity', '0')
        .style('transition', 'opacity 0.15s');

      // Node group
      const nodeGroup = svg.append('g').attr('class', 'nodes');
      const nodeEls = nodeGroup
        .selectAll<SVGGElement, SimNode>('g')
        .data(nodes)
        .join('g')
        .attr('cursor', (d) => (d.isCenter ? 'default' : 'pointer'))
        .on('click', (_, d) => handleNodeClick(d.id))
        .on('mouseover', (event: MouseEvent, d: SimNode) => {
          if (d.isCenter) return;
          tooltip
            .style('opacity', '1')
            .html(`<strong>${d.name}</strong><br/><span style="color:#94a3b8">${d.category.replace(/-/g, ' ')}</span><br/><span style="color:#64748b;font-size:10px">Click to view profile</span>`);
        })
        .on('mousemove', (event: MouseEvent) => {
          tooltip
            .style('left', `${event.clientX + 12}px`)
            .style('top', `${event.clientY - 10}px`);
        })
        .on('mouseout', () => {
          tooltip.style('opacity', '0');
        });

      // Circle
      nodeEls
        .append('circle')
        .attr('r', (d) => (d.isCenter ? 18 : 12))
        .attr('fill', (d) => NODE_COLORS[d.category] ?? '#475569')
        .attr('fill-opacity', (d) => (d.isCenter ? 1 : 0.75))
        .attr('stroke', (d) => (d.isCenter ? '#fff' : 'transparent'))
        .attr('stroke-width', 2);

      // Label
      nodeEls
        .append('text')
        .attr('dy', (d) => (d.isCenter ? 32 : 26))
        .attr('text-anchor', 'middle')
        .attr('fill', '#94a3b8')
        .attr('font-size', '10px')
        .attr('pointer-events', 'none')
        .text((d) => {
          const parts = d.name.split(' ');
          return parts.length > 1 ? parts[parts.length - 1] : d.name;
        });

      // Drag behavior
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const drag = d3
        .drag<SVGGElement, SimNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          if (!d.isCenter) {
            d.fx = event.x;
            d.fy = event.y;
          }
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          if (!d.isCenter) {
            d.fx = null;
            d.fy = null;
          }
        });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      nodeEls.call(drag as any);

      // Tick
      simulation.on('tick', () => {
        linkEls
          .attr('x1', (l) => (l.source as SimNode).x ?? 0)
          .attr('y1', (l) => (l.source as SimNode).y ?? 0)
          .attr('x2', (l) => (l.target as SimNode).x ?? 0)
          .attr('y2', (l) => (l.target as SimNode).y ?? 0);

        nodeEls.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
      });

      // Cleanup
      return () => {
        simulation.stop();
        tooltip.remove();
      };
    });
  }, [person, connections, allPeople, handleNodeClick]);

  if (connections.length === 0) {
    return (
      <p className="text-sm text-text-muted py-4">
        No documented connections in the database.
      </p>
    );
  }

  return (
    <div className="mb-6">
      <p className="text-xs font-mono text-text-muted uppercase tracking-widest mb-3">
        Connection Map — {connections.length} documented connection{connections.length !== 1 ? 's' : ''}
      </p>
      <div
        className="border border-surface-border rounded-lg bg-surface-card overflow-hidden"
        aria-label={`Network graph of ${person.name}'s connections`}
      >
        <svg
          ref={svgRef}
          className="w-full"
          style={{ height: '300px' }}
          role="img"
          aria-label={`Force-directed graph showing ${person.name}'s first-degree connections`}
        />
        <div className="px-3 py-2 border-t border-surface-border bg-surface/50
                        flex flex-wrap gap-3">
          {Object.entries(EDGE_COLORS)
            .filter(([type]) =>
              connections.some((c) => c.relationshipType === type)
            )
            .map(([type, color]) => (
              <span key={type} className="flex items-center gap-1.5 text-[10px] text-text-muted">
                <span
                  className="inline-block w-3 h-0.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {type.replace(/-/g, ' ')}
              </span>
            ))}
        </div>
      </div>
      <p className="text-[10px] text-text-muted mt-1.5">
        Click any node to navigate to that person's profile. Drag to rearrange.
      </p>
    </div>
  );
}
