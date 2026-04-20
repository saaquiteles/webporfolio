import SectionWrapper from "../components/layout/SectionWrapper";
import ProjectCard from "../components/ui/ProjectCard";
import { projects } from "../data/cvData";

export default function Projects() {
  return (
    <SectionWrapper id="projects">
      <h2 className="section-title">Projects and Publications</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <ProjectCard key={i} project={project} />
        ))}
      </div>
    </SectionWrapper>
  );
}