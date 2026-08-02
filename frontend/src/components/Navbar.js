import React, { useState, useEffect } from 'react';
import { Menu, X, Github, Instagram } from 'lucide-react';
import Logo from './Logo';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

// TODO: Replace # with actual GitHub and Instagram URLs when ready
const socialLinks = [
  { icon: <Github size={16} />, href: '#', label: 'GitHub', testId: 'nav-github' },
  { icon: <Instagram size={16} />, href: '#', label: 'Instagram', testId: 'nav-instagram' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    setOpen(false);
    if (href === '#') return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav data-testid="navbar" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl md:w-auto">
      <div
        className={`flex items-center justify-between md:justify-start gap-3 px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
          scrolled
            ? 'bg-[#282828]/95 backdrop-blur-xl border border-white/10 shadow-black/40'
            : 'bg-[#282828]/80 backdrop-blur-xl border border-white/5'
        }`}
      >
        {/* Always-visible Logo + Brand Name */}
        <button
          data-testid="nav-brand"
          onClick={() => scrollTo('#home')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0"
        >
          <Logo size={26} />
          <span className="font-heading font-bold text-primary text-base whitespace-nowrap">
            ZasDevLabs
          </span>
        </button>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-0.5 ml-2">
          {navLinks.map((link) => (
            <button
              key={link.href}
              data-testid={`nav-link-${link.label.toLowerCase()}`}
              onClick={() => scrollTo(link.href)}
              className="px-3.5 py-1.5 rounded-full text-sm text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-200 font-medium whitespace-nowrap"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Social icons */}
        <div className="hidden lg:flex items-center gap-1 ml-1">
          {socialLinks.map((s) => (
            <a
              key={s.testId}
              href={s.href}
              data-testid={s.testId}
              aria-label={s.label}
              target={s.href !== '#' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-200 shrink-0"
              title={s.href === '#' ? `${s.label} — Coming Soon` : s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>

        {/* Hire Me CTA */}
        <button
          data-testid="nav-hire-btn"
          onClick={() => scrollTo('#contact')}
          className="hidden md:block px-5 py-2 rounded-full bg-primary text-primary-fg text-sm font-semibold hover:brightness-110 transition-all duration-200 shadow-md shadow-primary/20 shrink-0"
        >
          Hire Me
        </button>

        {/* Mobile toggle */}
        <button
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen(!open)}
          className="md:hidden ml-auto p-1 text-gray-300 hover:text-primary transition-colors shrink-0"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-2 bg-[#282828]/95 backdrop-blur-xl rounded-3xl px-4 py-4 shadow-xl border border-white/10 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button
              key={link.href}
              data-testid={`nav-mobile-link-${link.label.toLowerCase()}`}
              onClick={() => scrollTo(link.href)}
              className="text-left px-4 py-2.5 rounded-xl text-sm text-gray-300 hover:text-primary hover:bg-primary/10 transition-all"
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-2 px-4 pt-2">
            {socialLinks.map((s) => (
              <a
                key={s.testId}
                href={s.href}
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/40 transition-all"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <button
            data-testid="nav-mobile-hire-btn"
            onClick={() => scrollTo('#contact')}
            className="mt-2 px-5 py-2.5 rounded-full bg-primary text-primary-fg text-sm font-semibold hover:brightness-110 transition-all"
          >
            Hire Me
          </button>
        </div>
      )}
    </nav>
  );
}
