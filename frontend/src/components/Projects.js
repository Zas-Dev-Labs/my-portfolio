import React, { useState, useEffect } from 'react';
import { ExternalLink, Code2, Printer, Tag, Shield } from 'lucide-react';
import { subscribeProjects, INITIAL_DEV_PROJECTS, INITIAL_3D_PROJECTS } from '../services/projectService';

function ProjectCard({ project, index }) {
  const isPublishingSoon = project.status === 'Publishing Soon';
  const isLive = project.status === 'Live' || project.status === 'Completed';

  return (
    <div
      data-testid={`project-card-${index}`}
      className="group bg-surface rounded-3xl overflow-hidden border border-white/5 hover:border-primary/25 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Image */}
        <div className="relative h-44 overflow-hidden bg-surface-container">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?crop=entropy&cs=srgb&fm=jpg&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
          <span
            className={`absolute top-3 right-3 text-[10px] font-semibold px-3 py-1 rounded-full border backdrop-blur-sm ${
              isLive
                ? 'bg-emerald-500/80 text-white border-emerald-400/40'
                : isPublishingSoon
                ? 'bg-secondary-container/80 text-secondary border-secondary/30'
                : 'bg-primary-container/80 text-primary border-primary/30'
            }`}
          >
            {project.status || 'In Development'}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-heading font-semibold text-white text-base mb-2 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>

          {/* Tags */}
          {Array.isArray(project.tags) && project.tags.length > 0 && (
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
          )}
        </div>
      </div>

      {/* Links row */}
      <div className="px-5 pb-5 pt-0 flex items-center gap-4">
        {project.externalLink ? (
          <a
            href={project.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`project-external-link-${index}`}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-secondary transition-colors font-medium group/btn"
          >
            <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
            View Project
          </a>
        ) : (
          <button
            data-testid={`project-link-${index}`}
            className="flex items-center gap-1.5 text-xs text-primary/70 cursor-default font-medium"
            disabled
          >
            <ExternalLink size={12} />
            Coming Soon
          </button>
        )}

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
  );
}

export default function Projects() {
  const [activeTab, setActiveTab] = useState('dev');
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeProjects(
      (items) => {
        setAllProjects(items);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading projects from Firestore:', err);
        // Fallback to static lists if offline or error
        setAllProjects([...INITIAL_DEV_PROJECTS, ...INITIAL_3D_PROJECTS]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const projects = allProjects
    .filter((p) => p.type === activeTab)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

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
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-surface-container rounded-3xl h-80 animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-surface-container/50 rounded-3xl border border-white/5">
            No projects found in this category yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, i) => (
              <ProjectCard key={project.id || project.title} project={project} index={i} />
            ))}
          </div>
        )}

        <p className="text-center text-gray-600 text-sm mt-10">
          Projects are managed live via database — updates sync in real time.
        </p>
      </div>
    </section>
  );
}
