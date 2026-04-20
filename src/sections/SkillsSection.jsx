import SectionWrapper from "../components/layout/SectionWrapper";
import Skills from "../components/ui/Skills";

import { skills } from "../data/cvData";

export default function SkillsSection() {
  return (
    <SectionWrapper id="skills">
      <h2 className="section-title">Skills</h2>
      <Skills data={skills} />
    </SectionWrapper>
  );
}