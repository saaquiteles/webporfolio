import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import SectionWrapper from "../components/layout/SectionWrapper";
import { personal } from "../data/cvData";

export default function Hero() {
  return (
    <SectionWrapper id="home" className="min-h-[90vh] flex items-center justify-center pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
        
        {/* Left Column: Framed Image Container */}
        <motion.div 
          variants={fadeIn}
          className="lg:col-span-5 flex justify-center lg:justify-end relative"
        >
          <div className="relative group w-64 h-80 md:w-80 md:h-[700px] lg:w-[400px] lg:h-[500px]">
            
            {/* 1. The Deep Glow (Behind everything) */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 blur-[80px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
            
            {/* 2. The Glass Frame */}
            <div className="relative w-full h-full rounded-[2rem] border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden shadow-2xl flex items-end justify-center">
              
              {/* Decorative Gradient inside the frame for depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-purple-500/10 z-0" />

              {/* 3. The PNG Image */}
              <img 
                src="src/assets/Corporate.png" 
                alt={personal.name}
                className="relative z-10 w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-110 origin-bottom group-hover:scale-100"
              />

              {/* 4. The "Internal Shadow" (Helps blend the bottom of the photo) */}
              <div className="absolute inset-0 z-20 pointer-events-none shadow-[inset_0_-40px_60px_-10px_rgba(11,11,15,0.8)]" />
            </div>

            {/* 5. Floating Accent (Subtle detail) */}
            <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-purple-500/30 rounded-tl-xl" />
          </div>
        </motion.div>

        {/* Right Column: Text Content (Spans 7 columns) */}
        <motion.div 
          variants={fadeIn}
          className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start"
        >
          {/* Status Badge */}
          <div className="mb-6 flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-300/80">
              Open for opportunities • 2026
            </span>
          </div>
          
          {/* Main Heading */}
          <h1 className="leading-[1.1] tracking-[-0.03em]">
            Sean Argie Quiteles <br /> 
          </h1>
          <h2 className="text-3xl md:text-3xl mt-3">
           Aspiring Full-Stack Developer
          </h2>

        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-[var(--text-muted)]">Discover</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-purple-500 to-transparent" />
      </motion.div>
    </SectionWrapper>
  );
}