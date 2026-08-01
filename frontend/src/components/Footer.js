import React from 'react';
import { Mail, Globe, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const quickLinks = [
  { label: 'About', href: '#about', external: false },
  { label: 'Skills', href: '#skills', external: false },
  { label: 'Projects', href: '#projects', external: false },
  { label: 'Experience', href: '#experience', external: false },
  { label: 'Contact', href: '#contact', external: false },
  { label: 'Privacy Policy', href: '/privacy-policy', external: true },
];

// TODO: Replace # with actual social profile URLs when ready
const socialLinks = [
  {
    label: 'GitHub',
    href: '#',
    testId: 'footer-github',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    testId: 'footer-instagram',
    icon: (
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer data-testid="footer" className="bg-surface-container border-t border-white/5 px-6 md:px-12 py-14">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <button onClick={scrollTop} className="flex items-center gap-2.5 mb-3 hover:opacity-80 transition-opacity">
              <Logo size={32} />
              <span className="font-heading font-bold text-primary text-lg">ZasDevLabs</span>
            </button>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-5">
              Building AI-powered web &amp; mobile solutions. Crafting with code and creativity.
            </p>
            {/* Social icons */}
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.testId}
                  href={s.href}
                  data-testid={s.testId}
                  aria-label={`${s.label}${s.href === '#' ? ' — Coming Soon' : ''}`}
                  title={s.href === '#' ? `${s.label} — Coming Soon` : s.label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary/30 hover:bg-primary/10 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-medium">Quick Links</p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  {link.external ? (
                    <Link
                      to={link.href}
                      data-testid={`footer-link-${link.label.toLowerCase().replace(/ /g, '-')}`}
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      data-testid={`footer-link-${link.label.toLowerCase()}`}
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-medium">Contact</p>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:skr@zasdevlabs.tech"
                  data-testid="footer-email"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
                >
                  <Mail size={13} />
                  skr@zasdevlabs.tech
                </a>
              </li>
              <li>
                <a
                  href="https://zasdevlabs.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-website"
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-secondary transition-colors"
                >
                  <Globe size={13} />
                  zasdevlabs.tech
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Sashi Kiran Rao &middot; ZasDevLabs. All rights reserved.
          </p>
          <button
            data-testid="scroll-to-top-btn"
            onClick={scrollTop}
            className="group flex items-center gap-2 text-xs text-gray-500 hover:text-primary transition-colors"
          >
            Back to top
            <span className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/10 transition-all">
              <ArrowUp size={12} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
