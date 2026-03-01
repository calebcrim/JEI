'use client';

import { useCallback } from 'react';
import type { TimelineEvent } from '@/types';
import timelineData from '@/data/timeline.json';
import themesData from '@/data/themes.json';
import { ExternalLink, Link2, BookOpen, AlertTriangle } from 'lucide-react';

const allEvents = timelineData as TimelineEvent[];

const SOURCE_DESCRIPTIONS: Record<string, string> = {
  CBS: 'CBS News investigation — searchable via Google Journalist Studio Pinpoint',
  NPR: 'NPR investigative reporting',
  WSJ: 'Wall Street Journal reporting',
  NYT: 'New York Times reporting',
  CNN: 'CNN reporting',
  Bloomberg: 'Bloomberg News reporting',
  AP: 'Associated Press reporting',
  DOJ: 'DOJ EFTA document releases (Datasets 1–12)',
  FBI: 'FBI investigative records (302 interviews, field reports)',
  HO: 'House Oversight Committee releases',
  SJ: 'Court filings and judicial records',
  JMail: 'JMail.World email database (1M+ indexed emails)',
  GH: 'GitHub community analysis (rhowardstone/Epstein-research)',
  OSINT: 'OSINT Database (Notion-based community research)',
  'Maxwell-trial': 'United States v. Ghislaine Maxwell trial exhibits',
  'Giuffre-deposition': 'Giuffre v. Maxwell deposition transcripts',
  'Palm-Beach-PD': 'Palm Beach Police Department investigative records',
};

interface Props {
  event: TimelineEvent;
  onNavigateToEvent?: (eventId: string) => void;
}

export default function SourcesEvidencePanel({ event, onNavigateToEvent }: Props) {
  const hasEftaLinks = event.eftaLinks && event.eftaLinks.length > 0;
  const hasEfta = event.efta && event.efta.length > 0;
  const hasRelatedEvents = event.relatedEventIds && event.relatedEventIds.length > 0;
  const hasRelatedThemes = event.relatedThemeIds && event.relatedThemeIds.length > 0;
  const hasDiscrepancies = event.discrepancies && event.discrepancies.length > 0;

  // Look up related event titles for display
  const relatedEvents = (event.relatedEventIds || [])
    .map(id => allEvents.find(e => e.id === id))
    .filter(Boolean) as TimelineEvent[];

  // Look up related theme titles
  const relatedThemes = (event.relatedThemeIds || [])
    .map(id => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const theme = (themesData as any[]).find(t => t.id === id);
      return theme ? { id: theme.id, title: theme.title } : null;
    })
    .filter(Boolean) as Array<{ id: string; title: string }>;

  const handleEventClick = useCallback((eventId: string) => {
    if (onNavigateToEvent) {
      onNavigateToEvent(eventId);
    } else {
      const el = document.getElementById(eventId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.replaceState(null, '', `#${eventId}`);
      }
    }
  }, [onNavigateToEvent]);

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
        <BookOpen size={12} />
        Sources & Evidence
      </h4>

      {/* ─── EFTA Documents ─── */}
      <div>
        <p className="text-xs font-medium text-text-secondary mb-2">EFTA Documents</p>
        {hasEftaLinks ? (
          <div className="rounded border border-surface-border bg-surface-card divide-y divide-surface-border overflow-x-auto">
            {event.eftaLinks!.map((link) => (
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
                </div>
                <span className="flex items-center gap-1 text-accent-blue group-hover:text-accent-blueHover shrink-0">
                  {link.mediaType === 'video' ? 'Open Video' : 'Open PDF'} <ExternalLink size={10} />
                </span>
              </a>
            ))}
          </div>
        ) : hasEfta ? (
          <div className="flex flex-wrap gap-1.5">
            {event.efta!.map((doc) => (
              <span key={doc} className="text-xs font-mono text-text-secondary bg-surface-elevated px-2 py-1 rounded border border-surface-border">
                {doc}
              </span>
            ))}
            <p className="w-full text-xs text-text-muted mt-1 italic">
              Direct PDF links not yet mapped for these documents.
            </p>
          </div>
        ) : (
          <p className="text-xs text-text-muted italic">
            No EFTA documents directly referenced for this event.
          </p>
        )}
      </div>

      {/* ─── Source Attributions ─── */}
      <div>
        <p className="text-xs font-medium text-text-secondary mb-2">Source Attributions</p>
        <div className="rounded border border-surface-border bg-surface-card divide-y divide-surface-border">
          {event.sources.map((src) => (
            <div key={src} className="flex items-start gap-2 px-3 py-2 text-xs">
              <span className="font-mono text-text-primary bg-surface-elevated px-1.5 py-0.5 rounded shrink-0">
                {src}
              </span>
              <span className="text-text-muted">
                {SOURCE_DESCRIPTIONS[src] || src}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Related Events ─── */}
      {hasRelatedEvents && (
        <div>
          <p className="text-xs font-medium text-text-secondary mb-2 flex items-center gap-1.5">
            <Link2 size={11} />
            Related Events
          </p>
          <div className="rounded border border-surface-border bg-surface-card divide-y divide-surface-border">
            {relatedEvents.map((rel) => (
              <button
                key={rel.id}
                onClick={() => handleEventClick(rel.id)}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs hover:bg-surface-elevated transition-colors text-left"
              >
                <span className="font-mono text-text-muted shrink-0 w-24">
                  {rel.dateDisplay}
                </span>
                <span className="text-accent-blue hover:text-accent-blueHover truncate">
                  {rel.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Related Themes ─── */}
      {hasRelatedThemes && relatedThemes.length > 0 && (
        <div>
          <p className="text-xs font-medium text-text-secondary mb-2">Related Themes</p>
          <div className="flex flex-wrap gap-1.5">
            {relatedThemes.map((theme) => (
              <a
                key={theme.id}
                href={`/themes#${theme.id}`}
                className="text-xs px-2.5 py-1 rounded-full border border-surface-border bg-surface-card text-accent-blue hover:text-accent-blueHover hover:bg-surface-elevated transition-colors"
              >
                {theme.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ─── Discrepancies ─── */}
      {hasDiscrepancies && (
        <div>
          <p className="text-xs font-medium text-status-discrepancy mb-2 flex items-center gap-1.5">
            <AlertTriangle size={11} />
            Source Discrepancies
          </p>
          <div className="space-y-2">
            {event.discrepancies!.map((d, i) => (
              <div
                key={i}
                className="rounded border border-status-discrepancy/20 bg-status-discrepancy/5 overflow-hidden"
              >
                <div className="px-3 py-2 text-xs border-b border-status-discrepancy/10">
                  <span className="font-medium text-text-primary">{d.sourceA}</span>
                  <span className="text-text-muted"> says:</span>
                  <p className="text-text-secondary mt-0.5">{d.claimA}</p>
                </div>
                {d.sourceB && (
                  <div className="px-3 py-2 text-xs">
                    <span className="font-medium text-text-primary">{d.sourceB}</span>
                    <span className="text-text-muted"> says:</span>
                    <p className="text-text-secondary mt-0.5">{d.claimB}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
