'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TimelineEvent, DisclosureLevel } from '@/types';
import Badge from '@/components/shared/Badge';
import SourceTag from '@/components/shared/SourceTag';
import SourcesEvidencePanel from '@/components/timeline/SourcesEvidencePanel';
import CausalAnnotation from '@/components/timeline/CausalAnnotation';
import EventThemeLinks from '@/components/timeline/EventThemeLinks';
import ActiveInvestigationPanel from '@/components/shared/ActiveInvestigationPanel';
import { getProceedingsForPerson } from '@/data/investigation-status';
import { ChevronDown, ChevronUp, FileText, Database } from 'lucide-react';

const EXPAND_LABELS: Record<DisclosureLevel, string | null> = {
  0: '+ Summary',
  1: '+ Full Details',
  2: '+ Sources & Evidence',
  3: null,
};

function ExpandableSection({ show, children, sectionRef }: {
  show: boolean;
  children: React.ReactNode;
  sectionRef?: React.RefObject<HTMLDivElement | null>;
}) {
  if (!show) return null;
  return (
    <div ref={sectionRef as React.RefObject<HTMLDivElement>} tabIndex={-1} className="animate-disclosure-in">
      {children}
    </div>
  );
}

interface EventCardProps {
  event: TimelineEvent;
  initialLevel?: DisclosureLevel;
  onNavigateToEvent?: (eventId: string) => void;
}

export default function EventCard({ event, initialLevel = 0, onNavigateToEvent }: EventCardProps) {
  const [level, setLevel] = useState<DisclosureLevel>(initialLevel);

  const level1Ref = useRef<HTMLDivElement>(null);
  const level2Ref = useRef<HTMLDivElement>(null);
  const level3Ref = useRef<HTMLDivElement>(null);

  const expand = () => {
    if (level < 3) setLevel((level + 1) as DisclosureLevel);
  };

  const collapse = () => setLevel(0);

  // Update URL hash when expanding
  useEffect(() => {
    if (level >= 1) {
      window.history.replaceState(null, '', `#${event.id}`);
    }
  }, [level, event.id]);

  // Focus management on level change
  useEffect(() => {
    if (level === 1) level1Ref.current?.focus();
    if (level === 2) level2Ref.current?.focus();
    if (level === 3) level3Ref.current?.focus();
  }, [level]);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      expand();
    } else if (e.key === 'Escape') {
      collapse();
    }
  }

  // Collect proceedings for all people mentioned in this event
  const eventProceedings = useMemo(() => {
    const seen = new Set<string>();
    const result = [];
    for (const pid of event.peopleIds) {
      for (const proc of getProceedingsForPerson(pid)) {
        if (!seen.has(proc.id)) {
          seen.add(proc.id);
          result.push(proc);
        }
      }
    }
    // Sort: active first, then scheduled, then pending
    const order: Record<string, number> = { active: 0, scheduled: 1, pending: 2, stalled: 3, resolved: 4 };
    return result.sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  }, [event.peopleIds]);

  const borderClass =
    event.verificationStatus === 'unverified'
      ? 'border-l-2 border-status-unverified'
      : event.verificationStatus === 'discrepancy'
      ? 'border-l-2 border-status-discrepancy'
      : 'border-l-2 border-surface-border';

  return (
    <div
      className={`${borderClass} pl-4 py-3`}
      id={event.id}
      role="article"
      aria-label={`Timeline event: ${event.title}, ${event.dateDisplay}`}
      aria-expanded={level > 0}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Screen reader announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {level === 0 && 'Event collapsed'}
        {level === 1 && 'Showing event summary'}
        {level === 2 && 'Showing full event details'}
        {level === 3 && 'Showing sources and evidence'}
      </div>

      {/* ═══ LEVEL 0: Scanline (always visible) ═══ */}
      <p className="text-xs text-text-muted mb-1 font-mono">{event.dateDisplay}</p>
      <h3 className="text-sm font-semibold text-text-primary mb-1 leading-snug">
        {event.title}
      </h3>

      {/* 3-line body preview — only show at Level 0 */}
      {level === 0 && (
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
          {event.body.slice(0, 300)}{event.body.length > 300 ? '…' : ''}
        </p>
      )}

      {/* Tag pills + verification badge — always visible */}
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        {event.sources.slice(0, level >= 1 ? undefined : 3).map((src) => (
          <SourceTag key={src} source={src} />
        ))}
        {event.verificationStatus === 'unverified' && (
          <Badge variant="verification" status="unverified" />
        )}
        {event.verificationStatus === 'discrepancy' && (
          <Badge variant="verification" status="discrepancy" />
        )}
        {event.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="tag">{tag}</Badge>
        ))}
      </div>

      {/* ═══ LEVEL 1: Summary ═══ */}
      <ExpandableSection show={level >= 1} sectionRef={level1Ref}>
        <div className="mt-3 pt-3 border-t border-surface-border">
          <p className="text-sm text-text-secondary leading-relaxed">
            {event.summary}
          </p>

          {/* People chips */}
          {event.peopleIds.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-xs text-text-muted">People:</span>
              {event.peopleIds.map((pid) => (
                <a
                  key={pid}
                  href={`/people/${pid}`}
                  className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-accent-blue hover:text-accent-blueHover transition-colors"
                >
                  {pid.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </a>
              ))}
            </div>
          )}

          {/* EFTA doc numbers */}
          {event.efta && event.efta.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-xs text-text-muted">EFTA:</span>
              {event.efta.map((doc) => (
                <span key={doc} className="text-xs font-mono text-text-secondary bg-surface-elevated px-1.5 py-0.5 rounded">
                  {doc}
                </span>
              ))}
            </div>
          )}

          {/* Verification/discrepancy banners at Level 1+ */}
          {event.verificationStatus === 'unverified' && (
            <div className="mt-2 px-3 py-2 rounded border border-status-unverified/30 bg-status-unverified/5 text-xs text-status-unverified">
              Unverified allegation — single-source claim not independently corroborated.
            </div>
          )}
          {event.verificationStatus === 'discrepancy' && (
            <div className="mt-2 px-3 py-2 rounded border border-status-discrepancy/30 bg-status-discrepancy/5 text-xs text-status-discrepancy">
              Discrepancy noted — source files give conflicting information on this point.
            </div>
          )}

          {/* Causal annotations — only at Level 1+ */}
          <CausalAnnotation
            eventId={event.id}
            onNavigate={onNavigateToEvent}
          />

          {/* Theme links — which investigation threads this event belongs to */}
          <EventThemeLinks
            themeIds={event.themeIds ?? []}
          />

          {/* Active proceedings for people mentioned in this event */}
          {eventProceedings.length > 0 && (
            <div className="mt-3">
              <ActiveInvestigationPanel
                proceedings={eventProceedings}
                compact={true}
                label={`${eventProceedings.length} active proceeding${eventProceedings.length !== 1 ? 's' : ''} — people in this event`}
              />
            </div>
          )}
        </div>
      </ExpandableSection>

      {/* ═══ LEVEL 2: Full Detail ═══ */}
      <ExpandableSection show={level >= 2} sectionRef={level2Ref}>
        <div className="mt-3 pt-3 border-t border-surface-border">
          <div className="prose-dark text-sm text-text-secondary leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{event.body}</ReactMarkdown>
          </div>
        </div>
      </ExpandableSection>

      {/* ═══ LEVEL 3: Sources & Evidence ═══ */}
      <ExpandableSection show={level >= 3} sectionRef={level3Ref}>
        <div className="mt-3 pt-3 border-t border-surface-border">
          <SourcesEvidencePanel event={event} onNavigateToEvent={onNavigateToEvent} />
        </div>
      </ExpandableSection>

      {/* ═══ CONTROLS ═══ */}
      <div className="flex items-center gap-3 mt-3 flex-wrap">
        {EXPAND_LABELS[level] && (
          <button
            onClick={expand}
            className="flex items-center gap-1 text-xs text-accent-blue hover:text-accent-blueHover transition-colors"
          >
            {level === 0 && <ChevronDown size={12} />}
            {level === 1 && <FileText size={12} />}
            {level === 2 && <Database size={12} />}
            {EXPAND_LABELS[level]}
          </button>
        )}

        {level > 0 && (
          <button
            onClick={collapse}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            <ChevronUp size={12} />
            Collapse
          </button>
        )}
      </div>
    </div>
  );
}
