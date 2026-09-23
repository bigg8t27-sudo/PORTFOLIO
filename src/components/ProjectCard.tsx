import { ArrowRight, Github, ExternalLink } from "lucide-react";
import type { Project } from "../data/projects";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden rounded-lg mb-6 relative h-64 md:h-72 bg-surface-light">
        {/* Placeholder Image */}
        <div className="w-full h-full bg-gradient-to-br from-surface-light to-surface flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className="text-text-secondary text-sm font-grotesk">
            {project.title}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Project Number and Title */}
        <div>
          <p className="text-accent text-xs font-grotesk font-semibold tracking-wider mb-2">
            {project.number}
          </p>
          <h3 className="text-xl md:text-2xl font-grotesk font-bold group-hover:text-accent transition-colors">
            {project.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-text-secondary text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-xs px-3 py-1 rounded-full bg-surface-light text-text-secondary font-inter"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-xs px-3 py-1 text-text-secondary">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 pt-2">
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </a>
          )}
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-accent transition-colors"
              aria-label="Live Demo"
            >
              <ExternalLink size={18} />
            </a>
          )}
          <button className="ml-auto text-accent hover:translate-x-1 transition-transform">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
