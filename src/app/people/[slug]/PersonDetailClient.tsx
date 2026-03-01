'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Person, Connection, TimelineEvent } from '@/types';
import Badge from '@/components/shared/Badge';
import SourceTag from '@/components/shared/SourceTag';
import UnverifiedBanner from '@/components/shared/UnverifiedBanner';
import DiscrepancyFlag from '@/components/shared/DiscrepancyFlag';
import ConnectionList from '@/components/people/ConnectionList';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

type Tab = 'overview' | 'timeline' | 'connections' | 'sources';

interface Props {
  person: Person;
  connections: Connection[];
  events: TimelineEvent[];
  allPeople: Person[];
}

function SectionAccordion({ section }: { section: Person['sections'][number] }) {
  const [expanded, setExpanded] = useState(false);
  const [unverifiedRevealed, setUnverifiedRevealed] = useState(false);

  const isUnverified = section.verificationStatus === 'unverified';
  const isDiscrepancy = section.verificationStatus === 'discrepancy';

  return (
    <div className="border border-surface-border rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between px-4 py-3 bg-surface-card
                   hover:bg-surface-elevated transition-colors text-left"
        aria-expanded={expanded}
      >
        <span className="text-sm font-semibold text-text-primary">{section.title}</span>
        <div className="flex items-center gap-2 shrink-0">
          {isUnverified && (
            <Badge variant="verification" status="unverified" />
          )}
          {isDiscrepancy && (
            <Badge variant="verification" status="discrepancy" />
          )}
          {expanded ? (
            <ChevronUp size={16} className="text-text-muted" />
          ) : (
            <ChevronDown size={16} className="text-text-muted" />
          )}
        </div>
      </button>

      {!expanded && (
        <div className="px-4 py-2 text-sm text-text-secondary line-clamp-3 leading-relaxed">
          {section.content.slice(0, 200)}…
        </div>
      )}

      {expanded && (
        <div className="px-4 py-3 space-y-3">
          {isUnverified && (
            <UnverifiedBanner
              revealed={unverifiedRevealed}
              onReveal={() => setUnverifiedRevealed(true)}
            />
          )}
          {isDiscrepancy && <DiscrepancyFlag />}

          {(!isUnverified || unverifiedRevealed) && (
            <div className="prose-dark">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {section.content}
              </ReactMarkdown>
            </div>
          )}

          {section.sources.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap pt-2 border-t border-surface-border">
              <span className="text-xs text-text-muted mr-1">Sources:</span>
              {section.sources.map((src) => (
                <SourceTag key={src} source={src} />
              ))}
            </div>
          )}

          {section.eftaLinks && section.eftaLinks.length > 0 ? (
            <div className="pt-2 border-t border-surface-border">
              <p className="text-xs font-medium text-text-secondary mb-2">EFTA Documents ({section.eftaLinks.length})</p>
              <div className="rounded border border-surface-border bg-surface-card divide-y divide-surface-border max-h-60 overflow-y-auto">
                {section.eftaLinks.map((link) => (
                  <a
                    key={link.number}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 px-3 py-2 text-xs hover:bg-surface-elevated transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono text-text-primary shrink-0">{link.number}</span>
                      {link.description && (
                        <span className="text-text-muted truncate">{link.description}</span>
                      )}
                      {link.sensitive && (
                        <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded shrink-0">sensitive</span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-accent-blue group-hover:text-accent-blueHover shrink-0">
                      {link.mediaType === 'video' ? 'Open Video' : 'Open PDF'}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ) : section.efta && section.efta.length > 0 ? (
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-xs text-text-muted mr-1">EFTA docs:</span>
              {section.efta.map((doc) => (
                <span key={doc} className="text-xs font-mono text-accent-blue/80">{doc}</span>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function PersonDetailClient({ person, connections, events, allPeople }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const isNotCharged = person.currentStatus?.toLowerCase().includes('not charged') ||
                       person.currentStatus?.toLowerCase().includes('immunity');

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: `Timeline (${events.length})` },
    { id: 'connections', label: `Connections (${connections.length})` },
    { id: 'sources', label: 'Sources' },
  ];

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6" aria-label="Breadcrumb">
        <Link href="/people/" className="hover:text-text-secondary transition-colors">
          People
        </Link>
        <span>›</span>
        <span className="text-text-secondary">{person.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="category" category={person.category} />
            {person.currentStatus && (
              <Badge variant="status" status={person.currentStatus}>
                {person.currentStatus}
              </Badge>
            )}
          </div>
          {person.mentionCount !== undefined && (
            <span className="text-xs text-text-muted">
              {person.mentionCount.toLocaleString()} DOJ mentions
            </span>
          )}
        </div>

        <h1 className="text-2xl font-semibold text-text-primary mb-1">{person.name}</h1>
        {person.aliases && person.aliases.length > 0 && (
          <p className="text-xs text-text-muted mb-1">
            Also known as: {person.aliases.join(', ')}
          </p>
        )}
        {(person.born || person.died) && (
          <p className="text-xs text-text-muted mb-3">
            {person.born && `Born: ${person.born}`}
            {person.born && person.died && ' · '}
            {person.died && `Died: ${person.died}`}
          </p>
        )}

        <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
          {person.summary}
        </p>
      </div>

      {/* Legal status note */}
      {isNotCharged && (
        <div className="flex items-start gap-3 bg-accent-blue/5 border border-accent-blue/20
                        rounded-lg px-4 py-3 mb-6">
          <Info size={16} className="text-accent-blue mt-0.5 shrink-0" />
          <p className="text-xs text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-primary">{person.name}</span> was not charged
            in connection with the Epstein investigation. Their presence in this database reflects
            documented associations in the public record, not a finding of wrongdoing.
          </p>
        </div>
      )}

      {/* Tab bar */}
      <div className="flex border-b border-surface-border mb-6 overflow-x-auto" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-accent-blue text-text-primary'
                : 'border-transparent text-text-muted hover:text-text-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div id={`tab-panel-overview`} role="tabpanel" hidden={activeTab !== 'overview'}>
        {activeTab === 'overview' && (
          <div className="space-y-3">
            {person.sections.map((section, i) => (
              <SectionAccordion key={`${section.title}-${i}`} section={section} />
            ))}
          </div>
        )}
      </div>

      <div id={`tab-panel-timeline`} role="tabpanel" hidden={activeTab !== 'timeline'}>
        {activeTab === 'timeline' && (
          <div>
            {events.length === 0 ? (
              <p className="text-sm text-text-muted py-4">No timeline events found for this person.</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    id={event.id}
                    className={`border-l-2 pl-4 py-2 ${
                      event.verificationStatus === 'unverified'
                        ? 'border-status-unverified'
                        : event.verificationStatus === 'discrepancy'
                        ? 'border-status-discrepancy'
                        : 'border-surface-border'
                    }`}
                  >
                    <p className="text-xs text-text-muted mb-1">{event.dateDisplay}</p>
                    <p className="text-sm font-semibold text-text-primary mb-1">{event.title}</p>
                    <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                      {event.body}
                    </p>
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {event.sources.slice(0, 3).map((src) => (
                        <SourceTag key={src} source={src} />
                      ))}
                      {event.verificationStatus === 'unverified' && (
                        <Badge variant="verification" status="unverified" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div id={`tab-panel-connections`} role="tabpanel" hidden={activeTab !== 'connections'}>
        {activeTab === 'connections' && (
          <ConnectionList
            personId={person.id}
            connections={connections}
            people={allPeople}
          />
        )}
      </div>

      <div id={`tab-panel-sources`} role="tabpanel" hidden={activeTab !== 'sources'}>
        {activeTab === 'sources' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">Source Files</h3>
              <div className="flex items-center gap-2 flex-wrap">
                {person.sources.map((src) => (
                  <SourceTag key={src} source={src} />
                ))}
              </div>
            </div>

            {/* EFTA documents */}
            {person.sections.some((s) => s.efta && s.efta.length > 0) && (
              <div>
                <h3 className="text-sm font-semibold text-text-primary mb-3">
                  EFTA Document References
                </h3>
                <div className="space-y-1">
                  {person.sections
                    .filter((s) => s.efta && s.efta.length > 0)
                    .flatMap((s) => s.efta!)
                    .filter((doc, i, arr) => arr.indexOf(doc) === i)
                    .map((doc) => (
                      <div key={doc} className="text-xs">
                        <span className="font-mono text-accent-blue/80 mr-2">{doc}</span>
                        <span className="text-text-muted text-xs">→ DOJ Epstein files</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
