import type { Connection } from '@/types';

/**
 * BFS shortest path between two person IDs in the connections graph.
 * Returns an ordered array of person IDs from `startId` to `endId`, inclusive.
 * Returns [startId] (length 1) if no path exists.
 * Returns [] if either ID doesn't exist in the graph.
 */
export function bfsShortestPath(
  startId: string,
  endId: string,
  connections: Connection[]
): string[] {
  if (startId === endId) return [startId];

  // Build adjacency list (undirected)
  const adj = new Map<string, Set<string>>();
  for (const conn of connections) {
    if (!adj.has(conn.sourcePersonId)) adj.set(conn.sourcePersonId, new Set());
    if (!adj.has(conn.targetPersonId)) adj.set(conn.targetPersonId, new Set());
    adj.get(conn.sourcePersonId)!.add(conn.targetPersonId);
    adj.get(conn.targetPersonId)!.add(conn.sourcePersonId);
  }

  if (!adj.has(startId) || !adj.has(endId)) return [];

  // BFS
  const queue: string[] = [startId];
  const visited = new Set<string>([startId]);
  const parent = new Map<string, string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current === endId) {
      // Reconstruct path
      const path: string[] = [];
      let node: string | undefined = endId;
      while (node !== undefined) {
        path.unshift(node);
        node = parent.get(node);
      }
      return path;
    }
    for (const neighbor of Array.from(adj.get(current) ?? [])) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent.set(neighbor, current);
        queue.push(neighbor);
      }
    }
  }

  // No path found — return sentinel
  return [startId];
}
