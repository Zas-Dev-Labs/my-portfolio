import React from 'react';
import { Briefcase, MapPin } from 'lucide-react';

const experiences = [
  {
    period: '2024 — Present',
    role: 'Founder & Lead Developer',
    company: 'ZasDevLabs',
    location: 'Freelance',
    description:
      'Founded ZasDevLabs to deliver AI-powered web and mobile solutions. Specializing in LLM integration, full-stack development, and modern application architectures for clients across domains.',
    tags: ['AI/LLM', 'React', 'FastAPI', 'MongoDB', 'Freelance'],
    current: true,
  },
  {
    period: '2019 — 2024',
    role: 'Senior Software Developer',
    company: 'Corporate — 5 Years',
    location: 'Full-time',
    description:
      'Led development teams building enterprise-grade MVC applications. Drove adoption of modern frontend frameworks like Angular and React. Mentored junior developers and owned technical architecture decisions.',
    tags: ['Angular', 'React', 'MVC', 'Team Lead', 'Enterprise'],
    current: false,
  },
  {
    period: '2015 — 2019',
    role: 'Full Stack Developer',
    company: 'Corporate — 4 Years',
    location: 'Full-time',
    description:
      'Designed and maintained large-scale web applications across the full stack — from database schema design and REST API development to frontend implementation and performance optimization.',
    tags: ['Full Stack', 'REST APIs', 'JavaScript', 'SQL', 'NoSQL'],
    current: false,
  },
  {
    period: '2012 — 2015',
    role: 'Software Developer',
    company: 'Corporate — 3 Years',
    location: 'Full-time',
    description:
      'Started professional journey in corporate software development. Built foundational expertise in backend systems, software architecture, and collaborative development practices.',
    tags: ['Backend', 'Architecture', 'Databases', 'APIs', 'Agile'],
    current: false,
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      data-testid="experience-section"
      className="py-20 md:py-32 px-6 md:px-12 bg-background"
    >
      <div className="max-w-4xl mx-auto">
        <p className="section-label mb-3">Career Journey</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white mb-14">
          Experience
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-secondary/40 to-transparent" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <div
                key={i}
                data-testid={`experience-item-${i}`}
                className="relative pl-12 md:pl-14"
              >
                {/* Timeline dot */}
                <div
                  className={`absolute left-2 md:left-3 top-5 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    exp.current
                      ? 'bg-primary border-primary shadow-lg shadow-primary/40'
                      : 'bg-surface border-white/20'
                  }`}
                />

                {/* Card */}
                <div className="group bg-surface rounded-3xl p-6 border border-white/5 hover:border-primary/20 hover:scale-[1.01] transition-all duration-300">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-white text-base group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-sm text-gray-400">
                          <Briefcase size={12} />
                          {exp.company}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={11} />
                          {exp.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${
                          exp.current
                            ? 'bg-primary-container/50 text-primary border border-primary/30'
                            : 'bg-surface-container text-gray-400 border border-white/5'
                        }`}
                      >
                        {exp.period}
                      </span>
                      {exp.current && (
                        <span className="text-[10px] bg-secondary-container/40 text-secondary border border-secondary/30 px-2 py-0.5 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{exp.description}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2.5 py-1 rounded-full bg-surface-container text-gray-400 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
