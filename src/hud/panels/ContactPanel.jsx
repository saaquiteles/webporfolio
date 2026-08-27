import { Download, Mail, Phone, Send } from "lucide-react";
// lucide-react doesn't ship trademarked brand marks (no Github/Linkedin
// icon) — react-icons already covers that gap in this project.
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { personal } from "../../data/cvData";

const mailtoHref = `mailto:${personal.email}?subject=${encodeURIComponent(
  `Portfolio contact — ${personal.name}`
)}&body=${encodeURIComponent(
  `Hi ${personal.name.split(" ")[0]},\n\nI came across your firing-range portfolio and wanted to reach out about...\n\n`
)}`;

export default function ContactPanel() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-offwhite/75">
        Open to full-stack developer roles and collaborations. Email is the fastest route — a reply is
        resolved within a reasonable turnaround.
      </p>

      <div className="space-y-3">
        <a
          href={`mailto:${personal.email}`}
          className="flex items-center gap-3 font-mono text-sm text-offwhite hover:text-cyan transition-colors"
        >
          <Mail size={15} className="text-cyan shrink-0" aria-hidden="true" />
          <span className="break-all">{personal.email}</span>
        </a>
        <a
          href={`tel:${personal.phone}`}
          className="flex items-center gap-3 font-mono text-sm text-offwhite/70 hover:text-cyan transition-colors"
        >
          <Phone size={15} className="text-cyan shrink-0" aria-hidden="true" />
          {personal.phone}
        </a>
        <a
          href={personal.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 font-mono text-sm text-offwhite/70 hover:text-cyan transition-colors"
        >
          <FaLinkedin size={15} className="text-cyan shrink-0" aria-hidden="true" />
          LinkedIn
        </a>
        <a
          href={personal.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 font-mono text-sm text-offwhite/70 hover:text-cyan transition-colors"
        >
          <FaGithub size={15} className="text-cyan shrink-0" aria-hidden="true" />
          GitHub
        </a>
      </div>

      <div className="flex flex-wrap gap-3 pt-1">
        <a href={mailtoHref} className="tactical-btn">
          <Send size={15} aria-hidden="true" />
          Send Transmission
        </a>
        <a href="/resume.pdf" download className="tactical-btn-outline">
          <Download size={14} aria-hidden="true" />
          Download Resume
        </a>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-offwhite/35 pt-1">
        &ldquo;Send Transmission&rdquo; opens your own mail client with this pre-filled &mdash; there&rsquo;s no
        backend behind this range to fake a &ldquo;message sent&rdquo; confirmation.
      </p>
    </div>
  );
}
