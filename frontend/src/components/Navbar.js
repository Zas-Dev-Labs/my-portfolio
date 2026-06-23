import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav data-testid="navbar" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] md:w-auto">
      <div
        className={`flex items-center gap-4 px-5 py-2.5 rounded-full shadow-lg transition-all duration-300 ${
          scrolled
            ? 'bg-[#282828]/95 backdrop-blur-xl border border-white/10 shadow-black/40'
            : 'bg-[#282828]/80 backdrop-blur-xl border border-white/5'
        }`}
      >
        <button
          data-testid="nav-brand"
          onClick={() => scrollTo('#home')}
          className="font-heading font-bold text-primary text-base whitespace-nowrap hover:opacity-80 transition-opacity"
        >
          ZasDevLabs
        </button>

        <div className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <button
              key={link.href}
              data-testid={`nav-link-${link.label.toLowerCase()}`}
              onClick={() => scrollTo(link.href)}
              className="px-4 py-1.5 rounded-full text-sm text-gray-400 hover:text-primary hover:bg-primary/10 transition-all duration-200 font-medium"
            >
              {link.label}
            </button>
          ))}
        </div>

        <button
          data-testid="nav-hire-btn"
          onClick={() => scrollTo('#contact')}
          className="hidden md:block px-5 py-2 rounded-full bg-primary text-primary-fg text-sm font-semibold hover:brightness-110 transition-all duration-200 shadow-md shadow-primary/20 ml-1"
        >
          Hire Me
        </button>

        <button
          data-testid="nav-mobile-toggle"
          onClick={() => setOpen(!open)}
          className="md:hidden ml-auto p-1 text-gray-300 hover:text-primary transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

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
