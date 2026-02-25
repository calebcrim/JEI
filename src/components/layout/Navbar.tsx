'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import GlobalSearch from './GlobalSearch';

const NAV_LINKS = [
  { href: '/people/', label: 'People' },
  { href: '/timeline/', label: 'Timeline' },
  { href: '/themes/', label: 'Themes' },
  { href: '/graph/', label: 'Graph' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-14 bg-surface/95 backdrop-blur-sm
                 border-b border-surface-border"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-screen-xl mx-auto h-full px-4 flex items-center gap-4">
        {/* Site title */}
        <Link
          href="/"
          className="font-mono text-xs text-text-muted hover:text-text-secondary
                     transition-colors tracking-widest uppercase shrink-0"
        >
          EPSTEIN FILES
        </Link>

        {/* Search — center */}
        <div className="flex-1 max-w-xl mx-auto">
          <GlobalSearch />
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm px-3 py-1.5 rounded transition-colors ${
                pathname.startsWith(link.href.replace(/\/$/, ''))
                  ? 'text-text-primary bg-surface-elevated'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/about/"
            className={`text-sm px-3 py-1.5 rounded transition-colors ${
              pathname.startsWith('/about')
                ? 'text-text-secondary'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            About
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-text-muted hover:text-text-secondary transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-card border-t border-surface-border px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm px-3 py-2 rounded transition-colors ${
                pathname.startsWith(link.href.replace(/\/$/, ''))
                  ? 'text-text-primary bg-surface-elevated'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/about/"
            onClick={() => setMobileOpen(false)}
            className="block text-sm px-3 py-2 rounded text-text-muted hover:text-text-secondary transition-colors"
          >
            About
          </Link>
        </div>
      )}
    </nav>
  );
}
