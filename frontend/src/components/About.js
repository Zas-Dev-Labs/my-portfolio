import React from 'react';
import { Layers, Cpu, Code2, Zap } from 'lucide-react';

const stats = [
  { value: '12+', label: 'Years of Experience', icon: <Layers size={18} /> },
  { value: 'AI-First', label: 'Development Approach', icon: <Cpu size={18} /> },
  { value: 'MVC & SPA', label: 'Architecture Expertise', icon: <Code2 size={18} /> },
  { value: 'Open', label: 'For Freelance Work', icon: <Zap size={18} /> },
];

export default function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="py-20 md:py-32 px-6 md:px-12 bg-surface"
    >
      <div className="max-w-6xl mx-auto">
        <p className="section-label mb-3">Who I Am</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white mb-14">
          Developer. Designer. Creator.
        </h2>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Bio text */}
          <div className="space-y-5 text-gray-300 leading-relaxed">
            <p>
              I'm{' '}
              <span className="text-primary font-semibold">Sashi Kiran Rao</span>, a passionate
              Web &amp; Mobile Developer with over{' '}
              <span className="text-primary font-medium">12 years of corporate experience</span>{' '}
              in the software development sector.
            </p>
            <p>
              I'm currently channeling that expertise into{' '}
              <span className="text-secondary font-semibold">ZasDevLabs</span> — my freelance
              venture dedicated to building AI-first web and mobile solutions that deliver real
              business value.
            </p>
            <p>
              My technical focus spans AI integration, full-stack MVC architectures, and modern
              frontend frameworks like React and Angular. Beyond the screen, I'm a hobbyist in{' '}
              <span className="text-secondary font-medium">3D design and printing</span> — where
              software precision meets physical creativity.
            </p>
            <p className="text-gray-400 text-sm pt-2 border-t border-white/5">
              Based on an AI-first approach, I bring both technical depth and creative perspective
              to every project.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                data-testid={`about-stat-${stat.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                className="group bg-surface-container rounded-3xl p-6 border border-white/5 hover:border-primary/30 hover:scale-[1.03] transition-all duration-300 cursor-default"
              >
                <div className="text-primary mb-3 group-hover:scale-110 transition-transform duration-200">
                  {stat.icon}
                </div>
                <div className="font-heading text-xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs text-gray-500 leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
