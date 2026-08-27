// Target registry — the single source of truth binding the firing range's
// five holographic targets to the five real resume sections they unlock.
// One entry here = one floating target down the lane = one radar-HUD row =
// one glassmorphism section panel. Positions are world-space coordinates in
// the range (spawn sits near z = 9, looking down -Z toward the backstop).
export const TARGETS = [
  {
    id: "about",
    label: "01 // ABOUT ME",
    sublabel: "FIELD DOSSIER",
    position: [-2.6, 1.6, 3]
  },
  {
    id: "skills",
    label: "02 // TECHNICAL SKILLS",
    sublabel: "LOADOUT",
    position: [2.6, 1.85, -1.5]
  },
  {
    id: "projects",
    label: "03 // FEATURED PROJECTS",
    sublabel: "OPERATIONS LOG",
    position: [-2.8, 1.55, -6]
  },
  {
    id: "experience",
    label: "04 // WORK EXPERIENCE",
    sublabel: "SERVICE RECORD",
    position: [2.8, 1.9, -10.5]
  },
  {
    id: "contact",
    label: "05 // CONTACT",
    sublabel: "OPEN COMMS",
    position: [0, 1.7, -14.5]
  }
];

export const TARGET_IDS = TARGETS.map((t) => t.id);
