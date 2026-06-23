import React from 'react';
import { Brain, Layers, Globe, Smartphone, Box, Cpu } from 'lucide-react';

const categories = [
  {
    category: 'AI & Machine Learning',
    icon: <Brain size={18} />,
    iconClass: 'text-primary',
    tagBg: 'bg-primary-container/30 text-primary border border-primary/20',
    skills: ['Large Language Models', 'AI Integration', 'Prompt Engineering', 'RAG Systems', 'OpenAI APIs', 'AI-first Architecture'],
  },
  {
    category: 'Full Stack Development',
    icon: <Layers size={18} />,
    iconClass: 'text-secondary',
    tagBg: 'bg-secondary-container/30 text-secondary border border-secondary/20',
    skills: ['MVC Architecture', 'REST APIs', 'MongoDB', 'PostgreSQL', 'Node.js', 'FastAPI / Python'],
  },
  {
    category: 'Frontend Frameworks',
    icon: <Globe size={18} />,
    iconClass: 'text-primary',
    tagBg: 'bg-primary-container/30 text-primary border border-primary/20',
    skills: ['React.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Material Design', 'Component Design'],
  },
  {
    category: 'Mobile Development',
    icon: <Smartphone size={18} />,
    iconClass: 'text-secondary',
    tagBg: 'bg-secondary-container/30 text-secondary border border-secondary/20',
    skills: ['Mobile-First Design', 'Progressive Web Apps', 'Cross-Platform', 'App Optimization', 'Responsive UI'],
  },
  {
    category: '3D Design & Printing',
    icon: <Box size={18} />,
    iconClass: 'text-primary',
    tagBg: 'bg-primary-container/30 text-primary border border-primary/20',
    skills: ['3D Modeling', 'CAD Design', 'FDM Printing', 'Prototype Design', 'Slicer Software', 'Material Science'],
  },
  {
    category: 'Dev Tools & Practices',
    icon: <Cpu size={18} />,
    iconClass: 'text-secondary',
    tagBg: 'bg-secondary-container/30 text-secondary border border-secondary/20',
    skills: ['Git & Version Control', 'Docker', 'Agile / Scrum', 'CI/CD Pipelines', 'API Design', 'Code Review'],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      data-testid="skills-section"
      className="py-20 md:py-32 px-6 md:px-12 bg-background"
    >
      <div className="max-w-6xl mx-auto">
        <p className="section-label mb-3">What I Do</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white mb-14">
          Skills &amp; Expertise
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.category}
              data-testid={`skill-card-${cat.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className="group bg-surface rounded-3xl p-6 border border-white/5 hover:border-primary/20 hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`${cat.iconClass} group-hover:scale-110 transition-transform duration-200`}>
                  {cat.icon}
                </div>
                <span className="font-heading font-semibold text-white text-sm">{cat.category}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    data-testid={`skill-tag-${skill.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                    className={`text-xs px-3 py-1 rounded-full ${cat.tagBg} transition-all duration-200`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
