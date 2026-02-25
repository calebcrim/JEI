import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Person, Connection, TimelineEvent } from '@/types';
import peopleData from '@/data/people.json';
import connectionsData from '@/data/connections.json';
import timelineData from '@/data/timeline.json';
import PersonDetailClient from './PersonDetailClient';

const people = peopleData as Person[];
const connections = connectionsData as Connection[];
const events = timelineData as TimelineEvent[];

export function generateStaticParams() {
  return people.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const person = people.find((p) => p.id === params.slug);
  if (!person) return { title: 'Person Not Found' };
  return {
    title: person.name,
    description: person.summary.slice(0, 160),
  };
}

export default function PersonPage({ params }: { params: { slug: string } }) {
  const person = people.find((p) => p.id === params.slug);
  if (!person) notFound();

  const personConnections = connections.filter(
    (c) => c.sourcePersonId === person.id || c.targetPersonId === person.id
  );

  const personEvents = events.filter((e) => person.timelineEventIds.includes(e.id));

  return (
    <PersonDetailClient
      person={person}
      connections={personConnections}
      events={personEvents}
      allPeople={people}
    />
  );
}
