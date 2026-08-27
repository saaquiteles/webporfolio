import { motion } from "framer-motion";
import { drawerIn, stagger } from "../../utils/motion";
import { skills, skillCategoryLabels } from "../../data/cvData";

export default function SkillsPanel() {
  return (
    <motion.div variants={stagger()} initial="hidden" animate="visible" className="space-y-6">
      {Object.entries(skills).map(([category, list]) => (
        <motion.div key={category} variants={drawerIn}>
          <h3 className="hud-eyebrow mb-2.5">{skillCategoryLabels?.[category] || category}</h3>
          <div className="flex flex-wrap gap-2">
            {list.map((skill) => (
              <span key={skill} className="tactical-tag">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
