import React from 'react';
import { ArrowDown, Code2, Printer, Sparkles } from 'lucide-react';

export default function Hero() {
  const scrollTo = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      data-testid="hero-section"
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Ambient gradient orbs */}
      <div
        className="absolute top-1/4 -left-48 w-[600px] h-[600px] rounded-full opacity-30 animate-pulse-slow pointer-events-none"
        style={{ background: 'radial-gradient(circle, #004A77 0%, transparent 70%)' }}
      />
      <div
        className="absolute bottom-1/4 -right-48 w-[500px] h-[500px] rounded-full opacity-20 animate-pulse-slow pointer-events-none"
        style={{ background: 'radial-gradient(circle, #005234 0%, transparent 70%)', animationDelay: '1.5s' }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px opacity-20 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #A8C7FA, #7DDA9A, transparent)' }}
      />

      <div className="relative z-10 w-full mx-auto px-6 md:px-12 pt-28 pb-20">
        <div className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">

          {/* Left — text content */}
          <div className="flex-1 animate-fadeInUp">
            {/* Available badge */}
            <div
              data-testid="hero-available-badge"
              className="inline-flex items-center gap-2 bg-surface/80 border border-white/10 rounded-full px-4 py-1.5 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs text-gray-400 tracking-widest uppercase font-medium">
                Available for Freelance
              </span>
            </div>

            {/* Brand line */}
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-3 font-medium">
              ZasDevLabs
            </p>

            {/* Name */}
            <h1 className="font-heading text-5xl sm:text-6xl font-bold leading-tight mb-5">
              <span className="text-white">Sashi Kiran </span>
              <span className="gradient-text">Rao</span>
            </h1>

            {/* Role pills */}
            <div className="flex flex-wrap gap-3 mb-7">
              <span
                data-testid="hero-role-dev"
                className="flex items-center gap-2 bg-primary-container/40 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-medium"
              >
                <Code2 size={13} />
                Web &amp; Mobile Developer
              </span>
              <span
                data-testid="hero-role-3d"
                className="flex items-center gap-2 bg-secondary-container/40 text-secondary border border-secondary/20 px-4 py-1.5 rounded-full text-sm font-medium"
              >
                <Printer size={13} />
                3D Print Designer
              </span>
              <span
                data-testid="hero-role-ai"
                className="flex items-center gap-2 bg-surface-container/60 text-gray-300 border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium"
              >
                <Sparkles size={13} />
                AI-First Builder
              </span>
            </div>

            {/* Bio */}
            <p className="text-gray-300 text-lg leading-relaxed max-w-xl mb-10">
              12+ years of corporate experience in software development — now building the future through{' '}
              <span className="text-primary font-medium">AI-powered web &amp; mobile solutions</span> at ZasDevLabs,
              with a creative passion for{' '}
              <span className="text-secondary font-medium">3D design &amp; printing</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                data-testid="hero-view-projects-btn"
                onClick={() => scrollTo('#projects')}
                className="px-8 py-3.5 rounded-full bg-primary text-primary-fg font-semibold hover:brightness-110 transition-all duration-200 shadow-lg shadow-primary/25 text-sm"
              >
                View Projects
              </button>
              <button
                data-testid="hero-get-in-touch-btn"
                onClick={() => scrollTo('#contact')}
                className="px-8 py-3.5 rounded-full border border-white/20 text-gray-300 hover:bg-surface hover:text-primary hover:border-primary/40 transition-all duration-200 text-sm"
              >
                Get in Touch
              </button>
            </div>
          </div>

          {/* Right — profile photo */}
          <div className="shrink-0 flex justify-center md:justify-end animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              {/* Glow ring */}
              <div
                className="absolute inset-0 rounded-full opacity-40 blur-2xl scale-110 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, #004A77, #005234)' }}
              />
              {/* Border ring */}
              <div
                className="absolute -inset-1 rounded-full opacity-60 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, #A8C7FA 0%, #7DDA9A 100%)', padding: '2px' }}
              >
                <div className="w-full h-full rounded-full bg-background" />
              </div>
              {/* Photo */}
              <img
                src="/profile.webp"
                alt="Sashi Kiran Rao"
                data-testid="hero-profile-photo"
                className="relative w-52 h-52 md:w-72 md:h-72 rounded-full object-cover object-top border-2 border-white/10"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-surface-container border border-white/10 rounded-full px-4 py-1.5 whitespace-nowrap shadow-xl">
                <span className="text-xs font-medium text-gray-300">
                  <span className="text-primary font-semibold">12+</span> Yrs Experience
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-600 animate-bounce pointer-events-none">
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <ArrowDown size={14} />
      </div>
    </section>
  );
}
