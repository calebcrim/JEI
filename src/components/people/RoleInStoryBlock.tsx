// src/components/people/RoleInStoryBlock.tsx
import { Crosshair } from 'lucide-react';
import { peopleRoles } from '@/data/people-roles';

interface Props {
  personId: string;
  personName: string;
}

export default function RoleInStoryBlock({ personId, personName }: Props) {
  const role = peopleRoles[personId];
  if (!role) return null;

  return (
    <div
      className="border border-surface-border rounded-lg px-4 py-4 mb-5 bg-surface-card"
      aria-label={`${personName}'s role in the investigation`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <Crosshair size={13} className="text-amber-400 shrink-0" aria-hidden />
        <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
          Role in the Investigation
        </span>
      </div>
      <p className="text-sm text-text-secondary leading-relaxed">
        {role.trim()}
      </p>
    </div>
  );
}
