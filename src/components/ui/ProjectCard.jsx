import { motion } from "framer-motion";
import { fadeIn } from "../../utils/motion";

export default function ProjectCard({ project }) {
  return (
    <motion.div 
      variants={fadeIn}
      className="card flex flex-col h-full relative overflow-hidden" // Removed card-hover and group from here
    >
      <div className="relative flex flex-col h-full z-10">
        <h3 className="transition-colors duration-300">
          {project.title}
        </h3>
        
        <p className="mt-3 text-[var(--text-muted)] flex-grow leading-relaxed">
          {project.description}
        </p>

        {/* Technology Stack Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {project.tech.map((t, i) => (
            <span key={i} className="tag text-[10px] tracking-widest font-bold">
              {t}
            </span>
          ))}
        </div>
        
        {/* Localized Button Glow Implementation */}
        {project.link && (
          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <a
              href={project.link}
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-between w-full px-4 py-2 rounded-lg transition-all duration-300" // Added group here
            >
              {/* This glow only triggers when the 'View Link' area is hovered */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-indigo-600/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
              <div className="absolute inset-0 border border-purple-500/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="relative z-10 text-sm font-medium text-[var(--text-strong)] group-hover:text-purple-400 transition-colors">
                View Link
              </span>
              
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="relative z-10 h-4 w-4 transform group-hover:translate-x-1 transition-transform text-[var(--text-strong)] group-hover:text-purple-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
}