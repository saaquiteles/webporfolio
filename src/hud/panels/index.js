import { BriefcaseBusiness, FolderGit2, Radio, User, Cpu } from "lucide-react";
import AboutPanel from "./AboutPanel";
import SkillsPanel from "./SkillsPanel";
import ProjectsPanel from "./ProjectsPanel";
import ExperiencePanel from "./ExperiencePanel";
import ContactPanel from "./ContactPanel";

// One entry per target id (see src/data/targets.js) — SectionModal looks
// the active target up here for its title/icon/content component.
export const PANELS = {
  about: {
    title: "01 // About Me",
    subtitle: "Field Dossier",
    icon: User,
    Component: AboutPanel
  },
  skills: {
    title: "02 // Technical Skills",
    subtitle: "Loadout",
    icon: Cpu,
    Component: SkillsPanel
  },
  projects: {
    title: "03 // Featured Projects",
    subtitle: "Operations Log",
    icon: FolderGit2,
    Component: ProjectsPanel
  },
  experience: {
    title: "04 // Work Experience",
    subtitle: "Service Record",
    icon: BriefcaseBusiness,
    Component: ExperiencePanel
  },
  contact: {
    title: "05 // Contact",
    subtitle: "Open Comms",
    icon: Radio,
    Component: ContactPanel
  }
};
