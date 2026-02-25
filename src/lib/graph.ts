import type { Person, Connection } from '@/types';

export interface GraphNode {
  id: string;
  name: string;
  category: Person['category'];
  mentionCount: number;
  radius: number;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  source: string;
  target: string;
  relationshipType: Connection['relationshipType'];
  strength: 1 | 2 | 3;
  description: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphEdge[];
}

const MIN_RADIUS = 8;
const MAX_RADIUS = 32;

function logScale(value: number, min: number, max: number): number {
  if (value <= 0) return MIN_RADIUS;
  const logMin = Math.log(Math.max(min, 1));
  const logMax = Math.log(Math.max(max, 2));
  const logVal = Math.log(value);
  const t = logMax === logMin ? 0.5 : (logVal - logMin) / (logMax - logMin);
  return MIN_RADIUS + t * (MAX_RADIUS - MIN_RADIUS);
}

export function buildGraphData(people: Person[], connections: Connection[]): GraphData {
  const mentionCounts = people.map((p) => p.mentionCount ?? 1);
  const maxMentions = Math.max(...mentionCounts, 1);
  const minMentions = Math.min(...mentionCounts, 1);

  const nodes: GraphNode[] = people.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    mentionCount: p.mentionCount ?? 1,
    radius: logScale(p.mentionCount ?? 1, minMentions, maxMentions),
  }));

  const nodeIds = new Set(nodes.map((n) => n.id));

  const links: GraphEdge[] = connections
    .filter((c) => nodeIds.has(c.sourcePersonId) && nodeIds.has(c.targetPersonId))
    .map((c) => ({
      source: c.sourcePersonId,
      target: c.targetPersonId,
      relationshipType: c.relationshipType,
      strength: c.strength,
      description: c.description,
    }));

  return { nodes, links };
}
