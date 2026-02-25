import Link from 'next/link';
import type { Person } from '@/types';
import peopleData from '@/data/people.json';
import PersonCard from '@/components/people/PersonCard';
import { Users, Calendar, BookOpen, Database } from 'lucide-react';

const people = peopleData as Person[];

// Key figures: sort by mention count desc, take top 8
const keyFigures = [...people]
  .sort((a, b) => (b.mentionCount ?? 0) - (a.mentionCount ?? 0))
  .slice(0, 8);

const STATS = [
  { label: 'People documented', value: `${people.length}+`, icon: Users },
  { label: 'Timeline events', value: '200+', icon: Calendar },
  { label: 'Thematic investigations', value: '17', icon: BookOpen },
  { label: 'Source pages', value: '3.5M+', icon: Database },
];

const ENTRY_POINTS = [
  {
    href: '/people/',
    title: 'People',
    description:
      'Profiles of individuals named in the files — from inner circle to political figures.',
    icon: Users,
  },
  {
    href: '/timeline/',
    title: 'Timeline',
    description: '200+ events from 1953 to 2026, filterable by era, person, and topic.',
    icon: Calendar,
  },
  {
    href: '/themes/',
    title: 'Themes',
    description: '17 investigative threads: trafficking, finance, intelligence, and more.',
    icon: BookOpen,
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-surface border-b border-surface-border px-4 py-16 md:py-24">
        <div className="max-w-screen-lg mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold text-text-primary mb-4 tracking-tight">
            The Epstein Files
          </h1>
          <p className="text-base md:text-lg text-text-secondary mb-10 max-w-xl mx-auto leading-relaxed">
            A searchable database of people, events, and connections from the public record
          </p>

          {/* Search bar */}
          <div className="max-w-lg mx-auto mb-8">
            <form action="/search/" method="get">
              <div className="relative">
                <input
                  type="search"
                  name="q"
                  placeholder="Search people, events, themes…"
                  aria-label="Search the database"
                  className="w-full px-5 py-3.5 text-sm bg-surface-card border border-surface-border
                             rounded-lg text-text-primary placeholder:text-text-muted
                             focus:outline-none focus:border-accent-blue/50 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-accent-blue
                             hover:text-accent-blueHover transition-colors px-2 py-1"
                  aria-label="Submit search"
                >
                  Search →
                </button>
              </div>
            </form>
          </div>

          {/* Quick-filter pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/people/"
              className="text-xs text-text-secondary hover:text-text-primary border border-surface-border
                         rounded-full px-4 py-1.5 hover:bg-surface-elevated transition-colors"
            >
              Search people
            </Link>
            <Link
              href="/timeline/"
              className="text-xs text-text-secondary hover:text-text-primary border border-surface-border
                         rounded-full px-4 py-1.5 hover:bg-surface-elevated transition-colors"
            >
              Browse timeline
            </Link>
            <Link
              href="/themes/"
              className="text-xs text-text-secondary hover:text-text-primary border border-surface-border
                         rounded-full px-4 py-1.5 hover:bg-surface-elevated transition-colors"
            >
              Explore themes
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-surface-border bg-surface-card" aria-label="Database statistics">
        <div className="max-w-screen-lg mx-auto px-4 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="flex items-center gap-3">
                  <Icon size={18} className="text-text-muted shrink-0" />
                  <div>
                    <p className="text-lg font-semibold text-text-primary leading-none">
                      {stat.value}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Entry point cards */}
      <section className="max-w-screen-lg mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-text-primary mb-6">Explore the database</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ENTRY_POINTS.map((ep) => {
            const Icon = ep.icon;
            return (
              <Link
                key={ep.href}
                href={ep.href}
                className="block bg-surface-card border border-surface-border rounded-lg p-5
                           hover:bg-surface-elevated hover:border-accent-blue/20 transition-colors group"
              >
                <Icon size={20} className="text-accent-blue mb-3" />
                <h3 className="text-base font-semibold text-text-primary mb-2 group-hover:text-accent-blue transition-colors">
                  {ep.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {ep.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Key figures preview */}
      <section className="max-w-screen-lg mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary">Key Figures</h2>
          <Link href="/people/" className="text-sm text-accent-blue hover:text-accent-blueHover transition-colors">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-4 pb-2" style={{ width: 'max-content' }}>
            {keyFigures.map((person) => (
              <div key={person.id} className="w-64">
                <PersonCard person={person} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
