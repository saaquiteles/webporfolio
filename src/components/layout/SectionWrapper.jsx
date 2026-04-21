import { motion } from "framer-motion";

const sectionVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1], 
      staggerChildren: 0.2,       
      delayChildren: 0.1,
    }
  }
};

export default function SectionWrapper({ children, id, className = "" }) {
  return (
    <motion.section
      id={id}
      className={`section relative ${className}`}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }} 
    >
      {children}
    </motion.section>
  );
}