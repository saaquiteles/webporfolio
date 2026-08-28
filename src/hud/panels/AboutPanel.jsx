import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { drawerIn, stagger } from "../../utils/motion";
import { personal, summary } from "../../data/cvData";

// summary in cvData.js is authored as an indented template literal for
// readability in the data file — collapse that whitespace into a normal
// paragraph rather than rendering the raw newlines/indentation.
const bio = summary.trim().replace(/\s+/g, " ");

// Renders the About panel: profile photo, name/title/location, and bio text, animated in with a staggered entrance.
export default function AboutPanel() {
  return (
    <motion.div variants={stagger()} initial="hidden" animate="visible" className="space-y-6">
      {/* Profile header: headshot photo plus name, title, and location. */}
      <motion.div variants={drawerIn} className="flex items-start gap-4">
        <div className="w-20 h-20 shrink-0 border border-cyan/30 bg-charcoal overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}headshot.png`}
            alt={personal.name}
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
        <div>
          <h2 className="text-2xl mb-1 leading-tight">{personal.name}</h2>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan mb-1.5">{personal.title}</p>
          <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-offwhite/50">
            <MapPin size={12} aria-hidden="true" />
            {personal.location}
          </p>
        </div>
      </motion.div>

      {/* Displays the cleaned-up bio paragraph. */}
      <motion.p variants={drawerIn} className="text-sm leading-relaxed text-offwhite/80">
        {bio}
      </motion.p>
    </motion.div>
  );
}
