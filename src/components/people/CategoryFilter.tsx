'use client';

import type { PersonCategory } from '@/types';

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
  principal: 'border-category-principal text-category-principal bg-category-principal/10',
  'inner-circle': 'border-category-innerCircle text-category-innerCircle bg-category-innerCircle/10',
  political: 'border-category-political text-category-political bg-category-political/10',
  financial: 'border-category-financial text-category-financial bg-category-financial/10',
  legal: 'border-category-legal text-category-legal bg-category-legal/10',
  intelligence: 'border-category-intelligence text-category-intelligence bg-category-intelligence/10',
  'academic-scientific': 'border-category-academic text-category-academic bg-category-academic/10',
  media: 'border-category-media text-category-media bg-category-media/10',
  victim: 'border-category-victim text-category-victim bg-category-victim/10',
  'law-enforcement': 'border-category-lawEnforcement text-category-lawEnforcement bg-category-lawEnforcement/10',
  other: 'border-category-other text-category-other bg-category-other/10',
};

const CATEGORY_INACTIVE = 'border-surface-border text-text-muted hover:text-text-secondary hover:border-surface-border';

interface Props {
  categories: PersonCategory[];
  selected: Set<PersonCategory>;
  counts: Map<PersonCategory, number>;
  onChange: (cat: PersonCategory) => void;
}

export default function CategoryFilter({ categories, selected, counts, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
      {categories.map((cat) => {
        const active = selected.has(cat);
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            aria-pressed={active}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors duration-150 font-medium
                       ${active ? CATEGORY_COLORS[cat] : CATEGORY_INACTIVE}`}
          >
            {CATEGORY_LABELS[cat]}
            {counts.has(cat) && (
              <span className="ml-1 opacity-70">({counts.get(cat)})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
