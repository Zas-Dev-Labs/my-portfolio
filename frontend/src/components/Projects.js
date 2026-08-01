import React, { useState } from 'react';
import { ExternalLink, Code2, Printer, Tag, Shield } from 'lucide-react';

const devProjects = [
  {
    title: 'AI-Powered Web Platform',
    description:
      'A full-stack web application leveraging large language models for intelligent automation and seamless user interactions. Built with React and FastAPI.',
    tags: ['React', 'FastAPI', 'AI/LLM', 'MongoDB'],
    status: 'In Development',
    image: 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
  },
  {
    title: 'Expense Tracker',
    description:
      'A personal finance Android app to track expenses across multiple bank accounts and payment apps. Features camera-based receipt capture, offline mode, and smart categorisation.',
    tags: ['Android', 'Kotlin', 'Camera API', 'Offline', 'Finance'],
    status: 'Publishing Soon',
    image: 'https://images.unsplash.com/photo-1782898669120-53aac9b0464e?crop=entropy&cs=srgb&fm=jpg&w=600&q=85',
    privacyPolicyLink: '/expense-tracker-privacy.html',
  },
  {
    title: 'Smart Dashboard Suite',
    description:
      'Enterprise-grade analytics dashboard with real-time data visualization and AI-powered business intelligence insights.',
    tags: ['Angular', 'Data Viz', 'Enterprise', 'AI'],
    status: 'In Development',
    image: 'https://images.pexels.com/photos/6424583/pexels-photo-6424583.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

const printProjects = [
  {
    title: 'Mechanical Gear Assembly',
    description:
      'Precision-engineered interlocking gear system designed for educational demonstrations. Optimized for FDM printing with minimal support structures.',
    tags: ['Mechanical', 'FDM', 'CAD', 'Educational'],
    status: 'In Development',
    image: 'https://images.unsplash.com/photo-1698807390276-725f3a7e41cf?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
  },
  {
    title: 'Custom Enclosure Design',
    description:
      'Functional protective housing for electronic components, designed with ventilation and cable management in mind. Material-optimized for durability.',
    tags: ['Enclosure', 'Electronics', 'Functional', 'CAD'],
    status: 'In Development',
    image: 'https://images.unsplash.com/photo-1566410824233-a8011929225c?crop=entropy&cs=srgb&fm=jpg&w=600&q=80',
  },
  {
    title: 'Artistic Sculpture Series',
    description:
      'A collection of abstract geometric sculptures exploring the creative limits of additive manufacturing and mathematical form generation.',
    tags: ['Art', 'Geometric', 'Abstract', 'Sculpture'],
    status: 'In Development',
    image: 'https://images.pexels.com/photos/13156181/pexels-photo-13156181.jpeg?auto=compress&cs=tinysrgb&w=600',
  },
];

function ProjectCard({ project, index }) {
  const isPublishingSoon = project.status === 'Publishing Soon';

  return (
    <div
      data-testid={`project-card-${index}`}
      className="group bg-surface rounded-3xl overflow-hidden border border-white/5 hover:border-primary/25 hover:scale-[1.02] transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        <span className={`absolute top-3 right-3 text-[10px] font-semibold px-3 py-1 rounded-full border backdrop-blur-sm ${
          isPublishingSoon
            ? 'bg-secondary-container/80 text-secondary border-secondary/30'
            : 'bg-primary-container/80 text-primary border-primary/30'
        }`}>
          {project.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-heading font-semibold text-white text-base mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-surface-container text-gray-400 border border-white/5"
            >
              <Tag size={9} />
              {tag}
            </span>
          ))}
        </div>

        {/* Links row */}
        <div className="flex items-center gap-4">
          <button
            data-testid={`project-link-${index}`}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-secondary transition-colors font-medium group/btn"
            disabled
          >
            <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
            Coming Soon
          </button>

          {project.privacyPolicyLink && (
            <a
              href={project.privacyPolicyLink}
              data-testid={`project-privacy-link-${index}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-secondary transition-colors font-medium"
            >
              <Shield size={11} />
              Privacy Policy
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [activeTab, setActiveTab] = useState('dev');
  const projects = activeTab === 'dev' ? devProjects : printProjects;

  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="py-20 md:py-32 px-6 md:px-12 bg-surface"
    >
      <div className="max-w-6xl mx-auto">
        <p className="section-label mb-3">What I'm Building</p>
        <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white mb-8">
          Projects
        </h2>

        {/* Tab toggle */}
        <div
          data-testid="projects-tab-container"
          className="inline-flex items-center bg-surface-container rounded-full p-1 mb-10 border border-white/5"
        >
          <button
            data-testid="tab-dev"
            onClick={() => setActiveTab('dev')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === 'dev'
                ? 'bg-primary text-primary-fg shadow-md shadow-primary/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Code2 size={14} />
            Dev Projects
          </button>
          <button
            data-testid="tab-3d"
            onClick={() => setActiveTab('3d')}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === '3d'
                ? 'bg-secondary text-secondary-fg shadow-md shadow-secondary/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <Printer size={14} />
            3D Printing
          </button>
        </div>

        {/* Project grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        <p className="text-center text-gray-600 text-sm mt-10">
          Projects are currently in development — links will be added upon launch.
        </p>
      </div>
    </section>
  );
}
