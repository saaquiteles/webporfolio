import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import SectionWrapper from "../components/layout/SectionWrapper";
import { summary, 
  experience, 
  education } from "../data/cvData";
import Timeline from "../components/ui/Timeline";

export default function About() {
  return (
    <SectionWrapper id="about">

      <motion.div variants={fadeIn} className="mb-16">
        <h2 className="gradient-text text-center" >About Me</h2>
        <p className="mx-auto text-[var(--text)] text-justify text-lg max-w-3xl">
          {summary}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full">
        
        <motion.div variants={fadeIn} className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold">Professional Journey</h3>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div className="card h-full">
            <Timeline items={experience} />
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-semibold">Education</h3>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <div className="card h-full space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="group">
                <h4 className="text-[var(--text-strong)] group-hover:text-purple-400 transition-colors">
                  {edu.degree}
                </h4>
                <p className="text-sm font-medium text-purple-500/80 tracking-wider">
                  {edu.institution}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {edu.specialization}
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  {edu.duration}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}