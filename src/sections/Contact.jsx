import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";
import { personal } from "../data/cvData";

export default function Contact() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="w-full border-t border-[var(--border)] bg-[var(--bg)] pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold gradient-text mb-2">Let's Connect</h2>
              <p className="text-[var(--text-muted)] max-w-sm italic">
                "Start where you are, use what you have, do what you can. - Arthur Ashe" 
              </p>
            </div>
            
            <div className="flex gap-5 text-xl">
              <a href={personal.github} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                <FaGithub />
              </a>
              <a href={personal.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                <FaLinkedin />
              </a>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="flex flex-col md:items-end gap-4"
          >
            <h3 className="text-sm uppercase tracking-widest text-[var(--text-muted)] font-bold mb-2">Contact Info</h3>
            
            <a href="mailto:seanargieq@gmail.com" className="group flex items-center gap-3 text-lg hover:text-purple-400 transition-colors">
              <span>seanargieq@gmail.com</span>
              <FaEnvelope className="text-purple-400 group-hover:scale-110 transition-transform" />
            </a>

            <div className="group flex items-center gap-3 text-lg">
              <span>+63 921 884 7645</span>
              <FaPhone className="text-purple-400" />
            </div>
          </motion.div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--text-muted)]">
          <p>© {currentYear} {personal.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Built with <span className="text-purple-500">React</span> & <span className="text-indigo-500">Framer Motion</span>
          </p>
        </div>
      </div>
    </footer>
  );
}