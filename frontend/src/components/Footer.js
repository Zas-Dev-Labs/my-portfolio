import React from 'react';
import { Mail, Globe, ArrowUp } from 'lucide-react';

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer
      data-testid="footer"
      className="bg-surface-container border-t border-white/5 px-6 md:px-12 py-14"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-1">
            <p className="font-heading font-bold text-primary text-xl mb-3">ZasDevLabs</p>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Building AI-powered web &amp; mobile solutions. Crafting with code and creativity.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-medium">
              Quick Links
            </p>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    data-testid={`footer-link-${link.label.toLowerCase()}`}
                    onClick={() => scrollTo(link.href)}
                    className="text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-4 font-medium">
              Contact
            </p>
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
            &copy; {new Date().getFullYear()} Sashi Kiran Rao · ZasDevLabs. All rights reserved.
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
