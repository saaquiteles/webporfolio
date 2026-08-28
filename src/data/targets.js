import { MEZZANINE_Y } from "../three/levelGeometry";

// Target registry — the single source of truth binding the firing range's
// five holographic targets to the five real resume sections they unlock.
// One entry here = one floating target down the lane = one radar-HUD row =
// one glassmorphism section panel. Positions are world-space coordinates in
// the range (spawn sits near z = 9, looking down -Z toward the backstop).
//
// 04 and 05 float above the mezzanine floor rather than the ground floor —
// their Y is MEZZANINE_Y plus the same "eye-level float" offset the other
// three targets use above y=0, so reaching them means climbing the stairs,
// not just walking down the lane.
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
    position: [2.8, MEZZANINE_Y + 1.9, -10.5]
  },
  {
    id: "contact",
    label: "05 // CONTACT",
    sublabel: "OPEN COMMS",
    position: [0, MEZZANINE_Y + 1.7, -14.5]
  }
];

// A convenience list of just the target IDs, pulled out of TARGETS for code that only needs to check/compare IDs.
export const TARGET_IDS = TARGETS.map((t) => t.id);
