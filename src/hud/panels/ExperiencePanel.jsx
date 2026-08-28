import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { drawerIn, stagger } from "../../utils/motion";
import { experience, education, certifications, accomplishments } from "../../data/cvData";

// Renders one entry (a job, degree, certification, etc.) as a single item in a timeline-style list.
function RecordEntry({ item, dateKey = "duration" }) {
  // Pick whichever field applies to this kind of entry (a job's role, a degree's name, or a generic title).
  const title = item.role || item.degree || item.title;
  // Pick whichever "organization" field applies (company, school, issuer, or venue).
  const org = item.company || item.institution || item.issuer || item.venue;

  return (
    <motion.div variants={drawerIn} className="border-l-2 border-crimson/40 pl-4 py-0.5">
      {/* Basic entry info: date, title, and any optional organization/specialization/location details. */}
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-offwhite/40 mb-1">{item[dateKey]}</p>
      <h4 className="text-base leading-snug mb-0.5">{title}</h4>
      {org && <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-cyan mb-1">{org}</p>}
      {item.specialization && <p className="text-xs text-offwhite/60 mb-1">{item.specialization}</p>}
      {item.location && <p className="text-xs text-offwhite/50 mb-1">{item.location}</p>}

      {/* Optional bullet list of highlights for this entry. */}
      {item.highlights && (
        <ul className="mt-1.5 space-y-1">
          {item.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-2 text-xs text-offwhite/70">
              <span className="text-crimson shrink-0">&rsaquo;</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Optional link to view the credential/source, shown only when a real link exists. */}
      {item.link && item.link !== "#" && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.08em] text-cyan mt-2 hover:underline"
        >
          {item.linkLabel || "View credential"}
          <ExternalLink size={11} aria-hidden="true" />
        </a>
      )}
    </motion.div>
  );
}

// Renders a titled group of RecordEntry items (e.g. all jobs, or all certifications), or nothing if the list is empty.
function RecordSection({ title, items, dateKey }) {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="hud-eyebrow mb-3">{title}</h3>
      <div className="space-y-4">
        {items.map((item, i) => (
          <RecordEntry key={`${title}-${i}`} item={item} dateKey={dateKey} />
        ))}
      </div>
    </div>
  );
}

// Renders the Experience panel: four labeled sections built from the CV data.
// The brief's "04 // WORK EXPERIENCE" target unlocks one panel, but the
// real CV data has four distinct buckets (experience, education,
// certifications, the Japan site-visit accomplishment) — folded here as
// sub-sections of one "Service Record" rather than dropping any of it.
export default function ExperiencePanel() {
  return (
    <motion.div variants={stagger(0.05, 0.05)} initial="hidden" animate="visible" className="space-y-7">
      <RecordSection title="Deployments" items={experience} />
      <RecordSection title="Training" items={education} />
      <RecordSection title="Credentials" items={certifications} />
      <RecordSection title="Field Operations" items={accomplishments} dateKey="duration" />
    </motion.div>
  );
}
