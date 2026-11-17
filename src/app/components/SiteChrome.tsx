import { useEffect, useState } from 'react';
import { Link, NavLink as RouterNavLink, useLocation } from 'react-router';
import { Menu, User, X } from 'lucide-react';
import { FOOTER_NAV, HEADER_NAV, SITE } from '../lib/site';
import { UK_GUIDANCE } from '../../config/countries';

/** Small uppercase label above headings. One style for every page. */
export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-xs font-semibold uppercase tracking-[0.14em] text-peach-deep mb-3 ${className}`}>
      {children}
    </div>
  );
}

/** "Guidance based on NICE fertility guidelines and HFEA data, last reviewed {date}", from config. */
export function GuidelinesNote({ className = '', tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const link =
    tone === 'dark'
      ? 'hit-area underline underline-offset-2 hover:text-white'
      : 'hit-area font-semibold text-peach-deep underline underline-offset-2';
  const [nice, hfea] = UK_GUIDANCE.sources;
  return (
    <p className={className}>
      Guidance based on{' '}
      <a href={nice.url} target="_blank" rel="noopener noreferrer" className={link}>
        NICE fertility guidelines
      </a>{' '}
      and{' '}
      <a href={hfea.url} target="_blank" rel="noopener noreferrer" className={link}>
        HFEA data
      </a>
      , last reviewed {UK_GUIDANCE.lastReviewed}.
    </p>
  );
}

const headerLinks = HEADER_NAV.filter((l) => l.live);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center min-h-11 px-1 rounded-md ${isActive ? 'text-ink font-semibold' : 'text-muted-ink hover:text-ink'}`;

  return (
    <header className="border-b border-sky/20">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center min-h-11 text-xl font-bold tracking-tight text-ink hover:opacity-80 transition-opacity rounded-md"
        >
          JourneyFertility
        </Link>

        <nav aria-label="Main" className="hidden md:flex items-center gap-6">
          {headerLinks.map((l) => (
            <RouterNavLink key={l.to} to={l.to} className={linkClass}>
              {l.to === '/sign-in' && <User className="w-4 h-4 mr-1" />}
              {l.label}
            </RouterNavLink>
          ))}
        </nav>

        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center w-11 h-11 -mr-2 rounded-md"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Main" className="md:hidden border-t border-sky/20 px-6 py-2 flex flex-col">
          {headerLinks.map((l) => (
            <RouterNavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </RouterNavLink>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink text-stone mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {FOOTER_NAV.map((group) => {
            const links = group.links.filter((l) => l.live);
            if (!links.length) return null;
            return (
              <div key={group.heading}>
                <h2 className="text-base font-semibold mb-3">{group.heading}</h2>
                <ul className="text-stone/80">
                  {links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="inline-flex items-center min-h-11 hover:text-white rounded">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t border-stone/20 pt-8 text-center text-stone/80 text-sm space-y-2">
          <GuidelinesNote tone="dark" />
          <p>
            {SITE.name} is a non-profit comparison service, not a clinic, founded by {SITE.founder}. Nothing
            here is medical advice.
          </p>
          <p>© 2026 {SITE.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/** Scroll to the top on every route change, as a full page load would. */
export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
