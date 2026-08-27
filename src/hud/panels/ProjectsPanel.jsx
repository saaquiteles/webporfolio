import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { drawerIn, stagger } from "../../utils/motion";
import { projects } from "../../data/cvData";

export default function ProjectsPanel() {
  return (
    <motion.div variants={stagger()} initial="hidden" animate="visible" className="space-y-5">
      {projects.map((project) => (
        <motion.article
          key={project.accession}
          variants={drawerIn}
          className="border border-offwhite/15 bg-offwhite/[0.03] p-4"
        >
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-offwhite/40">
              Acc. {project.accession}
            </span>
            <span
              className={`tactical-tag ${
                project.status === "PUBLISHED" ? "border-emerald text-emerald" : "border-cyan text-cyan"
              }`}
            >
              {project.status}
            </span>
          </div>

          <h3 className="text-lg mb-1 leading-snug">{project.title}</h3>

          {project.selfReferential && (
            <p className="font-mono text-[11px] italic text-offwhite/50 mb-2">{project.displayNote}</p>
          )}

          <p className="text-sm text-offwhite/75 whitespace-pre-line mb-3">{project.description}</p>

          {project.highlights && (
            <ul className="space-y-1 mb-3">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2 text-xs text-offwhite/70">
                  <span className="text-crimson shrink-0">&rsaquo;</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}

          {project.stats && (
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              {project.stats.map((stat) => (
                <div key={stat.label} className="border-t border-offwhite/15 pt-1.5">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-offwhite/40">{stat.label}</dt>
                  <dd className="stat-readout mt-0.5">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.tech.map((tech) => (
              <span key={tech} className="tactical-tag">
                {tech}
              </span>
            ))}
          </div>

          {project.link && project.link !== "#" && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="tactical-btn-outline">
              {project.linkLabel || "View project"}
              <ExternalLink size={12} aria-hidden="true" />
            </a>
          )}
        </motion.article>
      ))}
    </motion.div>
  );
}
