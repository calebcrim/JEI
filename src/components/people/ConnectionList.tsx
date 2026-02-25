'use client';

import Link from 'next/link';
import type { Connection, Person } from '@/types';
import Badge from '@/components/shared/Badge';
import SourceTag from '@/components/shared/SourceTag';

interface Props {
  personId: string;
  connections: Connection[];
  people: Person[];
}

const REL_LABELS: Record<Connection['relationshipType'], string> = {
  'co-conspirator': 'Co-conspirator',
  'employer-employee': 'Employer / Employee',
  financial: 'Financial',
  social: 'Social',
  'flew-together': 'Flew Together',
  'legal-representation': 'Legal Representation',
  intelligence: 'Intelligence',
  academic: 'Academic',
  'victim-perpetrator': 'Victim / Perpetrator',
};

export default function ConnectionList({ personId, connections, people }: Props) {
  const personConnections = connections.filter(
    (c) => c.sourcePersonId === personId || c.targetPersonId === personId
  );

  if (personConnections.length === 0) {
    return (
      <p className="text-sm text-text-muted py-4">No documented connections in the database.</p>
    );
  }

  // Sort by strength desc
  const sorted = [...personConnections].sort((a, b) => b.strength - a.strength);

  return (
    <div className="space-y-3">
      {sorted.map((conn) => {
        const otherId =
          conn.sourcePersonId === personId ? conn.targetPersonId : conn.sourcePersonId;
        const other = people.find((p) => p.id === otherId);
        const otherName = other?.name ?? otherId;

        return (
          <div
            key={conn.id}
            className="bg-surface-card border border-surface-border rounded-lg p-3 flex gap-3"
          >
            <div className="w-1 rounded-full shrink-0 self-stretch"
              style={{
                backgroundColor: `rgba(74, 158, 255, ${conn.strength * 0.33})`,
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {other ? (
                  <Link
                    href={`/people/${other.id}/`}
                    className="text-sm font-semibold text-accent-blue hover:text-accent-blueHover transition-colors"
                  >
                    {otherName}
                  </Link>
                ) : (
                  <span className="text-sm font-semibold text-text-primary">{otherName}</span>
                )}
                <Badge variant="tag">
                  {REL_LABELS[conn.relationshipType]}
                </Badge>
                <Badge variant="verification" status={conn.verificationStatus}>
                  {conn.verificationStatus}
                </Badge>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed mb-2">
                {conn.description}
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                {conn.sources.map((src) => (
                  <SourceTag key={src} source={src} />
                ))}
                <span className="text-xs text-text-muted ml-1">
                  Strength: {conn.strength}/3
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
