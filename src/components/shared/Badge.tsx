'use client';

import { PersonCategory, VerificationStatus, SourceTag as SourceTagType } from '@/types';

const CATEGORY_LABELS: Record<PersonCategory, string> = {
  principal: 'Principal',
  'inner-circle': 'Inner Circle',
  political: 'Political',
  financial: 'Financial',
  legal: 'Legal',
  intelligence: 'Intelligence',
  'academic-scientific': 'Academic',
  media: 'Media',
  victim: 'Victim',
  'law-enforcement': 'Law Enforcement',
  other: 'Other',
};

const CATEGORY_COLORS: Record<PersonCategory, string> = {
  principal: 'bg-category-principal/20 text-category-principal',
  'inner-circle': 'bg-category-innerCircle/20 text-category-innerCircle',
  political: 'bg-category-political/20 text-category-political',
  financial: 'bg-category-financial/20 text-category-financial',
  legal: 'bg-category-legal/20 text-category-legal',
  intelligence: 'bg-category-intelligence/20 text-category-intelligence',
  'academic-scientific': 'bg-category-academic/20 text-category-academic',
  media: 'bg-category-media/20 text-category-media',
  victim: 'bg-category-victim/20 text-category-victim',
  'law-enforcement': 'bg-category-lawEnforcement/20 text-category-lawEnforcement',
  other: 'bg-category-other/20 text-category-other',
};

const VERIFICATION_CONFIG: Record<
  VerificationStatus,
  { label: string; className: string; icon: string }
> = {
  verified: {
    label: 'Verified',
    className: 'bg-status-verified/20 text-status-verified',
    icon: '✓',
  },
  unverified: {
    label: 'Unverified',
    className: 'bg-status-unverified/20 text-status-unverified',
    icon: '⚠',
  },
  contested: {
    label: 'Contested',
    className: 'bg-status-contested/20 text-status-contested',
    icon: '⚖',
  },
  discrepancy: {
    label: 'Discrepancy',
    className: 'bg-status-discrepancy/20 text-status-discrepancy',
    icon: '⚡',
  },
};

const STATUS_COLORS: Record<string, string> = {
  convicted: 'bg-status-contested/20 text-status-contested',
  deceased: 'bg-surface-elevated text-text-muted',
  'immunity granted': 'bg-status-unverified/20 text-status-unverified',
  'immunity grantee': 'bg-status-unverified/20 text-status-unverified',
  'not charged': 'bg-surface-elevated text-text-muted',
  imprisoned: 'bg-status-contested/20 text-status-contested',
};

type BadgeProps =
  | { variant: 'category'; category: PersonCategory; children?: React.ReactNode }
  | { variant: 'status'; status: string; children?: React.ReactNode }
  | { variant: 'source'; source: SourceTagType; children?: React.ReactNode }
  | { variant: 'verification'; status: VerificationStatus; children?: React.ReactNode }
  | { variant: 'tag'; children: React.ReactNode };

export default function Badge(props: BadgeProps) {
  const base = 'inline-flex items-center gap-1 text-xs font-medium rounded-full px-2 py-0.5';

  if (props.variant === 'category') {
    return (
      <span className={`${base} ${CATEGORY_COLORS[props.category]}`}>
        {props.children ?? CATEGORY_LABELS[props.category]}
      </span>
    );
  }

  if (props.variant === 'verification') {
    const config = VERIFICATION_CONFIG[props.status];
    return (
      <span
        className={`${base} ${config.className}`}
        title={`${config.label} — tap to learn more`}
      >
        {config.icon} {props.children ?? config.label}
      </span>
    );
  }

  if (props.variant === 'status') {
    const key = props.status.toLowerCase();
    const colorClass =
      Object.entries(STATUS_COLORS).find(([k]) => key.includes(k))?.[1] ??
      'bg-surface-elevated text-text-secondary';
    return (
      <span className={`${base} ${colorClass}`}>
        {props.children ?? props.status}
      </span>
    );
  }

  if (props.variant === 'source') {
    return (
      <span className={`${base} bg-surface-elevated text-text-secondary font-semibold uppercase tracking-wide`}>
        {props.children ?? props.source}
      </span>
    );
  }

  // tag
  return (
    <span className={`${base} bg-surface-elevated text-text-muted`}>
      {props.children}
    </span>
  );
}
