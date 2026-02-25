import type { Metadata } from 'next';
import Link from 'next/link';
import UnverifiedBanner from '@/components/shared/UnverifiedBanner';
import DiscrepancyFlag from '@/components/shared/DiscrepancyFlag';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About the Epstein Files Database — methodology, sources, verification standards, and editorial framing.',
};

export default function AboutPage() {
  return (
    <article className="max-w-[720px] mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold text-text-primary mb-2">
        About This Database
      </h1>
      <p className="text-sm text-text-muted mb-12">
        Compiled February 2026 from public records, court filings, and published journalism.
      </p>

      {/* ── Section 1 ──────────────────────────────────────────────── */}
      <section aria-labelledby="what-this-is">
        <hr className="border-t border-surface-border mb-12" />
        <h2 id="what-this-is" className="text-xl font-semibold text-text-primary mt-12 mb-4">
          What This Database Is
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
          <p>
            This is a structured, searchable reference database compiled from public records
            released under the Epstein Files Transparency Act (EFTA), court documents,
            congressional testimony, and published journalism. It is designed to help researchers,
            journalists, and members of the public navigate a large and fragmented body of material
            about Jeffrey Epstein, the people documented in his files, and the events surrounding
            his crimes and death.
          </p>
          <p>
            The database does not add original reporting. It synthesizes, organizes, and
            cross-links information that already exists in the public record. Every entry traces
            back to a documentable source.
          </p>
        </div>
      </section>

      {/* ── Section 2 ──────────────────────────────────────────────── */}
      <section aria-labelledby="source-material">
        <hr className="border-t border-surface-border mb-12 mt-12" />
        <h2 id="source-material" className="text-xl font-semibold text-text-primary mt-12 mb-4">
          The Source Material
        </h2>
        <div className="space-y-6 text-sm leading-relaxed text-text-secondary">
          <div>
            <p className="font-semibold text-text-primary mb-1">Pillar I — DOJ EFTA Releases</p>
            <p>
              The Epstein Files Transparency Act was passed 427–1 in the House and unanimously in
              the Senate, and signed into law November 19, 2025. It required the Department of
              Justice to release all files related to Epstein within 30 days. The DOJ released
              approximately 3.5 million pages, 2,000 videos, and 180,000 images across 12 datasets
              between December 19, 2025 and January 30, 2026. The DOJ identified approximately
              6 million qualifying pages before filtering — roughly half remain unreleased.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text-primary mb-1">Pillar II — Court Records</p>
            <p>
              Filings and testimony from United States v. Maxwell (S.D.N.Y.), Giuffre v. Maxwell
              (deposition transcripts unsealed January 2024), Doe v. Indyke, and related civil and
              criminal proceedings.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text-primary mb-1">
              Pillar III — House Oversight Committee
            </p>
            <p>
              8,624 documents released by the House Oversight Committee as part of its parallel
              investigation, including FBI 302 interview summaries and internal DOJ communications
              about the 2007–2008 non-prosecution agreement.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text-primary mb-1">Pillar IV — FBI Vault / FOIA</p>
            <p>
              Pre-EFTA FOIA releases published by the FBI, covering 22 document batches — heavily
              redacted and partially superseded by the EFTA releases.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text-primary mb-1">Published Journalism</p>
            <p>
              Reporting from CBS News, NPR, The New York Times, The Wall Street Journal, CNN,
              Bloomberg, and others — cited where used, particularly for analysis and context that
              does not appear in the raw government documents.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text-primary mb-1">Community Research Archives</p>
            <p>
              JMail (jmail.world — full-text indexed search of 1,038,603 Epstein emails),
              rhowardstone/Epstein-research (GitHub — 100+ forensic analysis reports, 1,536-person
              entity registry, 2,096 mapped connections), the Epstein OSINT Database (Notion), and
              related community research tools. These sources are cited where used and clearly
              labeled. Community-derived findings that have not been corroborated by institutional
              sources are flagged [UNVERIFIED].
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 3 ──────────────────────────────────────────────── */}
      <section aria-labelledby="verification-flags">
        <hr className="border-t border-surface-border mb-12 mt-12" />
        <h2
          id="verification-flags"
          className="text-xl font-semibold text-text-primary mt-12 mb-4"
        >
          How to Read the Verification Flags
        </h2>
        <p className="text-sm leading-relaxed text-text-secondary mb-8">
          Not all information in the public record carries equal weight. The source files
          underlying this database include sworn trial testimony, FBI interview summaries,
          anonymous tips, and Epstein&apos;s own self-serving emails — a spectrum from high to low
          reliability. Every entry in this database displays one or more of the following flags to
          help you assess what you&apos;re reading.
        </p>

        {/* Flag legend */}
        <div className="space-y-6 mb-10">
          {/* Verified */}
          <div className="border-l-2 border-status-verified bg-status-verified/5 rounded-r px-4 py-3 flex items-start gap-3">
            <span className="text-status-verified mt-0.5 shrink-0">✓</span>
            <div>
              <p className="text-sm font-semibold text-status-verified mb-1">Verified</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                Information that appears in sworn testimony, trial exhibits, official court
                findings, or is corroborated by multiple independent sources.
              </p>
            </div>
          </div>

          {/* Unverified */}
          <UnverifiedBanner legendMode />

          {/* Discrepancy */}
          <DiscrepancyFlag legendMode />

          {/* Contested */}
          <div className="border-l-2 border-status-contested bg-status-contested/5 rounded-r px-4 py-3 flex items-start gap-3">
            <span className="text-status-contested mt-0.5 shrink-0">⚖</span>
            <div>
              <p className="text-sm font-semibold text-status-contested mb-1">Contested</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                A claim that a named individual has publicly disputed, denied, or that is the
                subject of active legal proceedings. The denial is included alongside the original
                claim.
              </p>
            </div>
          </div>
        </div>

        {/* Reliability spectrum bar */}
        <div className="mb-2">
          <div className="flex rounded overflow-hidden h-2 mb-3">
            <div className="flex-1 bg-status-unverified/70" />
            <div className="flex-1 bg-status-unverified/50" />
            <div className="flex-1 bg-status-verified/50" />
            <div className="flex-1 bg-status-verified/80" />
          </div>
          <div className="flex text-xs text-text-muted">
            <div className="flex-1 text-left">
              <p className="font-medium">Anonymous tips</p>
              <p>(NTOC reports)</p>
            </div>
            <div className="flex-1 text-center">
              <p className="font-medium">FBI 302 memos</p>
              <p>(allegations)</p>
            </div>
            <div className="flex-1 text-center">
              <p className="font-medium">Depositions</p>
              <p>(sworn)</p>
            </div>
            <div className="flex-1 text-right">
              <p className="font-medium">Trial testimony</p>
              <p>(cross-examined)</p>
            </div>
          </div>
          <div className="flex justify-between text-xs text-text-muted mt-2">
            <span>Low reliability</span>
            <span>High reliability</span>
          </div>
        </div>
      </section>

      {/* ── Section 4 ──────────────────────────────────────────────── */}
      <section aria-labelledby="what-it-does-not-do">
        <hr className="border-t border-surface-border mb-12 mt-12" />
        <h2
          id="what-it-does-not-do"
          className="text-xl font-semibold text-text-primary mt-12 mb-4"
        >
          What This Database Does Not Do
        </h2>
        <div className="space-y-5 text-sm leading-relaxed text-text-secondary">
          <p>
            <span className="font-semibold text-text-primary">It does not determine guilt.</span>{' '}
            The presence of a person&apos;s name in Epstein&apos;s files — on a flight log, in an
            email, or in an FBI tip — does not constitute evidence of wrongdoing. Many people in
            this database were social acquaintances of Epstein&apos;s who had no documented
            knowledge of or involvement in his crimes. The database presents documented
            associations; it does not adjudicate them.
          </p>
          <p>
            <span className="font-semibold text-text-primary">
              It does not add original journalism.
            </span>{' '}
            No independent reporting was conducted to produce this database. All information
            originates in the source documents listed above.
          </p>
          <p>
            <span className="font-semibold text-text-primary">
              It does not represent the complete picture.
            </span>{' '}
            Approximately 3 million pages identified by the DOJ have not been released. The
            database reflects the public record as of its compilation date (February 2026). It is
            incomplete by definition.
          </p>
          <p>
            <span className="font-semibold text-text-primary">
              It does not adjudicate ongoing legal proceedings.
            </span>{' '}
            Several matters documented here involve active litigation. Nothing in this database
            should be read as a legal conclusion.
          </p>
          <p>
            <span className="font-semibold text-text-primary">
              It is not the primary source.
            </span>{' '}
            Wherever possible, original EFTA document numbers are provided so users can retrieve
            and read the underlying documents directly at justice.gov/epstein. This database is a
            navigational tool, not a replacement for the primary record.
          </p>
        </div>
      </section>

      {/* ── Section 5 ──────────────────────────────────────────────── */}
      <section aria-labelledby="note-on-victims">
        <hr className="border-t border-surface-border mb-12 mt-12" />
        <h2 id="note-on-victims" className="text-xl font-semibold text-text-primary mt-12 mb-4">
          A Note on Victims
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
          <p>
            The people harmed by Jeffrey Epstein are at the center of this story. Their accounts —
            given in depositions, trial testimony, FBI interviews, and civil court filings — are the
            evidentiary foundation on which his conviction and Maxwell&apos;s conviction rest.
          </p>
          <p>
            Named victims (Jane Does #1–#19 in the 32-count draft indictment; Virginia Giuffre;
            Carolyn; and others) are treated in this database with particular care. Where victims
            have chosen to be identified publicly, their names appear. Where they have not, they
            are referred to by their legal designation. No victim information beyond what appears
            in public court records is included.
          </p>
          <p>
            The DOJ&apos;s handling of victim data in the EFTA releases was imperfect: blanket
            visual redactions were applied inconsistently, and at least 31 victim identities were
            inadvertently exposed in the releases. This database does not reproduce any information
            that would identify a victim who has not chosen public identification.
          </p>
        </div>
      </section>

      {/* ── Section 6 ──────────────────────────────────────────────── */}
      <section aria-labelledby="known-limitations">
        <hr className="border-t border-surface-border mb-12 mt-12" />
        <h2
          id="known-limitations"
          className="text-xl font-semibold text-text-primary mt-12 mb-4"
        >
          Known Limitations of the Source Data
        </h2>
        <p className="text-sm leading-relaxed text-text-secondary mb-5">
          Users should be aware of several documented issues with the underlying source material:
        </p>
        <div className="space-y-5 text-sm leading-relaxed text-text-secondary">
          <p>
            <span className="font-semibold text-text-primary">Dataset 9 pagination anomaly.</span>{' '}
            The DOJ&apos;s pagination for Dataset 9 operates as an &ldquo;infinite loop&rdquo; —
            pages beyond approximately 13,000 contain no new documents. Community researchers have
            flagged the dataset as incomplete at source.
          </p>
          <p>
            <span className="font-semibold text-text-primary">Post-publication redactions.</span>{' '}
            The Democracy Defenders Fund identified that the DOJ quietly altered previously released
            documents after initial publication, adding additional redactions after January 15, 2026.
          </p>
          <p>
            <span className="font-semibold text-text-primary">Faulty redactions.</span>{' '}
            Dataset 9 contains approximately 91,646 &ldquo;bad overlays&rdquo; — redactions where
            underlying text is recoverable by copy-pasting. Some content in this database was
            discovered through this method; such content is noted in its source citations.
          </p>
          <p>
            <span className="font-semibold text-text-primary">Removed documents.</span>{' '}
            Several files were removed from the DOJ website after initial publication, including
            EFTA00000468 (a photo of Trump, Epstein, and Maxwell), an FBI-compiled list of tips
            (EFTA01660679), and three large video files totaling approximately 15 GB. Removed
            documents are noted where relevant.
          </p>
          <p>
            <span className="font-semibold text-text-primary">
              Epstein&apos;s emails as a source.
            </span>{' '}
            Approximately 1,038,603 emails from Epstein&apos;s accounts (jeevacation@gmail.com and
            jeeproject@yahoo.com) are publicly searchable via JMail. These emails are
            self-serving statements by a convicted sex offender and should be evaluated accordingly.
            Email content is used in this database but always flagged with its source.
          </p>
          <p>
            <span className="font-semibold text-text-primary">FBI NTOC tips.</span>{' '}
            Many of the most dramatic allegations in the EFTA releases originate in FBI National
            Threat Operations Center tip reports — anonymous public submissions that agents
            themselves frequently flagged as &ldquo;not credible&rdquo; or
            &ldquo;sensationalist.&rdquo; These are distinguished from investigative findings in
            this database and carry the [UNVERIFIED] flag.
          </p>
        </div>
      </section>

      {/* ── Section 7 ──────────────────────────────────────────────── */}
      <section aria-labelledby="about-compilation">
        <hr className="border-t border-surface-border mb-12 mt-12" />
        <h2
          id="about-compilation"
          className="text-xl font-semibold text-text-primary mt-12 mb-4"
        >
          About This Compilation
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
          <p>
            This database was compiled in February 2026 from nine underlying research files
            synthesizing the complete EFTA release, court records, congressional materials, and
            published journalism available through that date.
          </p>
          <div className="bg-surface-card border border-surface-border rounded px-4 py-4 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Compilation date</span>
              <span className="text-text-primary font-medium">February 25, 2026</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Source pages synthesized</span>
              <span className="text-text-primary font-medium">
                ~3.5 million (DOJ) + court records + congressional documents
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">People documented</span>
              <span className="text-text-primary font-medium">55+</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Timeline events</span>
              <span className="text-text-primary font-medium">130+</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Thematic investigations</span>
              <span className="text-text-primary font-medium">17</span>
            </div>
          </div>
          <p>
            The database reflects the public record as of its compilation date. It has not been
            updated to reflect developments after February 2026. For current developments, consult
            primary news sources.
          </p>
          <p>
            This is a non-commercial informational resource. All source documents referenced are
            publicly available. EFTA documents link directly to justice.gov/epstein, the sole
            legally authorized distribution point.
          </p>
          <p className="pt-2">
            See the full source legend →{' '}
            <Link href="/sources/" className="text-accent-blue hover:text-accent-blueHover underline">
              Sources &amp; Abbreviations
            </Link>
          </p>
        </div>
      </section>
    </article>
  );
}
