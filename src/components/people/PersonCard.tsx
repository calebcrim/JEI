'use client';

import Link from 'next/link';
import type { Person } from '@/types';
import Badge from '@/components/shared/Badge';
import SourceTag from '@/components/shared/SourceTag';

interface Props {
  person: Person;
}

export default function PersonCard({ person }: Props) {
  const borderColorMap: Record<string, string> = {
    principal: 'hover:border-category-principal/40',
    'inner-circle': 'hover:border-category-innerCircle/40',
    political: 'hover:border-category-political/40',
    financial: 'hover:border-category-financial/40',
    legal: 'hover:border-category-legal/40',
    intelligence: 'hover:border-category-intelligence/40',
    'academic-scientific': 'hover:border-category-academic/40',
    media: 'hover:border-category-media/40',
    victim: 'hover:border-category-victim/40',
    'law-enforcement': 'hover:border-category-lawEnforcement/40',
    other: 'hover:border-category-other/40',
  };

  const hoverBorder = borderColorMap[person.category] ?? 'hover:border-surface-border';

  return (
    <Link
      href={`/people/${person.id}/`}
      className={`block bg-surface-card border border-surface-border rounded-lg p-4
                 transition-colors duration-150 hover:bg-surface-elevated ${hoverBorder}`}
      aria-label={`View profile for ${person.name}`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge variant="category" category={person.category} />
        {person.currentStatus && (
          <Badge variant="status" status={person.currentStatus}>
            {person.currentStatus.length > 20
              ? person.currentStatus.slice(0, 18) + '…'
              : person.currentStatus}
          </Badge>
        )}
      </div>

      <h3 className="text-base font-semibold text-text-primary mb-0.5 leading-snug">
        {person.name}
      </h3>
      {person.subcategory && (
        <p className="text-xs text-text-muted mb-2 capitalize">
          {person.subcategory.replace(/-/g, ' ')}
        </p>
      )}

      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-3">
        {person.summary}
      </p>

      <div className="border-t border-surface-border pt-3 space-y-1.5">
        {person.mentionCount !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">DOJ mentions</span>
            <span className="text-xs font-semibold text-text-secondary">
              {person.mentionCount.toLocaleString()}
            </span>
          </div>
        )}
        {person.flightLegs !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted">Flight legs</span>
            <span className="text-xs font-semibold text-text-secondary">
              {person.flightLegs}
            </span>
          </div>
        )}
        {person.sources.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap pt-1">
            {person.sources.slice(0, 5).map((src) => (
              <SourceTag key={src} source={src} plain />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
