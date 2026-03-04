export type DisclosureLevel = 0 | 1 | 2 | 3;

export type PersonCategory =
  | 'principal'
  | 'inner-circle'
  | 'political'
  | 'financial'
  | 'legal'
  | 'intelligence'
  | 'academic-scientific'
  | 'media'
  | 'victim'
  | 'law-enforcement'
  | 'other';

export type VerificationStatus = 'verified' | 'unverified' | 'contested' | 'discrepancy';

export type SourceTag =
  | 'CBS' | 'NPR' | 'WSJ' | 'NYT' | 'CNN' | 'Bloomberg' | 'AP'
  | 'DOJ' | 'FBI' | 'HO' | 'SJ' | 'JMail' | 'GH' | 'OSINT'
  | 'Maxwell-trial' | 'Giuffre-deposition' | 'Palm-Beach-PD'
  | 'ForensicFinance'
  | 'FBI-Mogilevich'
  | 'EFTA-Science'
  | 'EFTA-Wolff';

export interface Person {
  id: string;
  name: string;
  aliases?: string[];
  born?: string;
  died?: string;
  category: PersonCategory;
  subcategory?: string;
  currentStatus?: string;
  mentionCount?: number;
  flightLegs?: number;
  summary: string;
  sections: PersonSection[];
  timelineEventIds: string[];
  themeIds: string[];
  connectionIds: string[];
  sources: SourceTag[];
}

export interface PersonSection {
  title: string;
  content: string;
  verificationStatus?: VerificationStatus;
  sources: SourceTag[];
  efta?: string[];
  eftaLinks?: Array<{
    number: string;
    url: string;
    description?: string;
    mediaType?: 'pdf' | 'video';
    sensitive?: boolean;
  }>;
}

export interface TimelineEvent {
  id: string;
  date: string;
  dateDisplay: string;
  era: TimelineEra;
  title: string;
  body: string;
  peopleIds: string[];
  themeIds: string[];
  sources: SourceTag[];
  efta?: string[];
  verificationStatus?: VerificationStatus;
  tags: string[];

  // Phase 1 — derived at parse time
  summary: string;

  // Phase 2 — populated by build-event-relations
  eftaLinks?: Array<{
    number: string;
    url: string;
    description?: string;
    mediaType?: 'pdf' | 'video';
    sensitive?: boolean;
  }>;
  relatedEventIds?: string[];
  relatedThemeIds?: string[];
  discrepancies?: Array<{
    sourceA: string;
    sourceB: string;
    claimA: string;
    claimB: string;
  }>;
}

export type TimelineEra =
  | 'pre-1990'
  | '1990-2000'
  | '2001-2007'
  | '2008-2018'
  | '2019'
  | '2020-present';

export interface ThemeSection {
  id: string;
  title: string;
  sectionNumber: number;
  summary: string;
  content: string;
  peopleIds: string[];
  timelineEventIds: string[];
  sources: SourceTag[];
  tags: string[];
  efta?: string[];
  eftaLinks?: Array<{
    number: string;
    url: string;
    description?: string;
    mediaType?: 'pdf' | 'video';
    sensitive?: boolean;
  }>;
}

export interface Connection {
  id: string;
  sourcePersonId: string;
  targetPersonId: string;
  relationshipType:
    | 'co-conspirator'
    | 'employer-employee'
    | 'financial'
    | 'social'
    | 'flew-together'
    | 'legal-representation'
    | 'intelligence'
    | 'academic'
    | 'victim-perpetrator';
  strength: 1 | 2 | 3;
  description: string;
  sources: SourceTag[];
  verificationStatus: VerificationStatus;
  activeEras: TimelineEra[];
}

export interface SearchResult {
  type: 'person' | 'event' | 'theme' | 'investigation';
  id: string;
  title: string;
  excerpt: string;
  category?: string;
  date?: string;
  score?: number;
}

// Extended type used in the search index (includes fields Fuse.js searches)
export interface SearchIndexEntry {
  type: 'person' | 'event' | 'theme' | 'investigation';
  id: string;
  title: string;
  aliases?: string;
  excerpt: string;
  category?: string;
  date?: string;
  era?: string;
  fullText: string;
  sources: string;
}

export interface InvestigationDeepDiveLink {
  label: string;
  href: string;
  type: 'people' | 'timeline' | 'themes' | 'financial';
  description: string;
}

export interface InvestigationKeyFact {
  value: string;
  label: string;
}

export interface InvestigationChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  era: string;
  bodyParagraphs: string[];
  pullQuote?: string;
  pullQuoteSource?: string;
  relatedPeople: string[];
  relatedThemeIds: string[];
  relatedTimelineEra: string;
  deepDiveLinks: InvestigationDeepDiveLink[];
  keyFacts: InvestigationKeyFact[];
}
