import { RANGE_BOUNDS, RANGE_CENTER_Z, RANGE_LENGTH, RANGE_WIDTH, EYE_HEIGHT } from "./rangeConstants";

// The single authored source for anything in the range the player can
// stand on or bump into above the base floor (y=0) — stairs, the
// mezzanine, and the truss/beam structure. RangeEnvironment (the visible
// boxes) and FirstPersonRig (collision) both read these same generated
// values, so what's rendered and what's collidable can never silently
// drift apart — the same copy-pasted-constant bug this project already
// hit twice with GUN_Y_OFFSET (see weaponConstants.js).

// The tallest single rise the player can walk up without it counting as a
// wall.
//
// Maximum rise FirstPersonRig will auto-climb in one frame without
// treating it as a solid wall. Every staircase below sizes its risers to
// exactly this, so climbing reads as smooth stepping, not a wall.
export const STEP_HEIGHT = 0.4;

// Builds the list of stair-tread rectangles (position + height) for one
// staircase, given where it starts and how many steps it has.
//
// One flight of stairs: tread i=0 is shortest and farthest from `edgeZ`,
// growing taller as it approaches `edgeZ` — i.e. the tallest tread sits
// flush against the platform edge it leads onto, and the run climbs
// toward the player as they approach from the +Z (spawn) side.
function buildStairs({ x, edgeZ, stepCount, riserHeight, treadDepth, treadWidth }) {
  return Array.from({ length: stepCount }, (_, i) => {
    const topY = riserHeight * (i + 1);
    const centerZ = edgeZ + treadDepth / 2 + (stepCount - 1 - i) * treadDepth;
    return {
      minX: x - treadWidth / 2,
      maxX: x + treadWidth / 2,
      minZ: centerZ - treadDepth / 2,
      maxZ: centerZ + treadDepth / 2,
      topY,
      rise: riserHeight,
      centerZ
    };
  });
}

// ---- Mezzanine: a full second floor along the back of the range, flush
// against both side walls and the backstop — no gap to see (or fall)
// through on any of those three sides, only the near/stairs edge stays
// open. Reached by the same nine-step staircase run that used to lead up
// to a much smaller "Loft" accent platform — the entry point
// (MEZZANINE_STAIR_X, and the Z edge the stairs meet) is unchanged, the
// floor it leads onto is just far bigger now, big enough to host targets
// 04 and 05.
export const MEZZANINE_Y = 3.6; // walkable surface height
// How thick the mezzanine's floor slab is (top to bottom), in meters.
export const MEZZANINE_THICKNESS = 0.2;
// How wide the mezzanine floor is, left to right.
//
// The side walls' actual inner faces sit 0.2 outside RANGE_BOUNDS (each
// wall: position RANGE_BOUNDS ± 0.35, half-thickness 0.15 → inner face at
// RANGE_BOUNDS ± 0.2). +0.4 reaches both faces; the extra +0.1 overlaps
// slightly past them so there's never a hairline gap or z-fighting at the
// seam, the exact "gaps on each side" this was built to close.
export const MEZZANINE_WIDTH = RANGE_WIDTH + 0.5;
// The X position of the staircase leading up to the mezzanine.
export const MEZZANINE_STAIR_X = RANGE_BOUNDS.maxX - 1.1;

// The Z position of the mezzanine's near edge, i.e. where the top stair
// meets the floor — unchanged from the original Loft's edge.
const MEZZANINE_NEAR_EDGE_Z = RANGE_CENTER_Z - RANGE_LENGTH * 0.18 + 1.8;
// The Z position of the mezzanine's far edge, at the back of the range.
//
// The backstop wall's inner face sits 0.2 past RANGE_BOUNDS.minZ (position
// minZ - 0.4, half-thickness 0.2) — reach 0.05 past that same face so the
// far edge sits flush against the backstop instead of floating short of it.
export const MEZZANINE_FAR_Z = RANGE_BOUNDS.minZ - 0.25;
// The mezzanine's midpoint depth-wise, and its total front-to-back depth —
// both derived from the near/far edges above so they can't drift apart.
export const MEZZANINE_CENTER_Z = (MEZZANINE_NEAR_EDGE_Z + MEZZANINE_FAR_Z) / 2;
export const MEZZANINE_DEPTH = MEZZANINE_NEAR_EDGE_Z - MEZZANINE_FAR_Z;

const MEZZANINE_STEP_COUNT = 9; // 9 * STEP_HEIGHT(0.4) = MEZZANINE_Y(3.6)
// The generated tread list for the staircase leading up to the mezzanine.
export const MEZZANINE_STEPS = buildStairs({
  x: MEZZANINE_STAIR_X,
  edgeZ: MEZZANINE_NEAR_EDGE_Z,
  stepCount: MEZZANINE_STEP_COUNT,
  riserHeight: STEP_HEIGHT,
  treadDepth: 0.32,
  treadWidth: 1.5
});

// The mezzanine floor's own footprint and height, in the same
// {minX, maxX, minZ, maxZ, topY} shape as a stair tread, so it can be
// treated identically by the collision code below.
export const MEZZANINE_PLATFORM = {
  minX: -MEZZANINE_WIDTH / 2,
  maxX: MEZZANINE_WIDTH / 2,
  minZ: MEZZANINE_FAR_Z,
  maxZ: MEZZANINE_NEAR_EDGE_Z,
  topY: MEZZANINE_Y + MEZZANINE_THICKNESS / 2
};

// Generates the wall boxes that flank the stairs on both sides.
//
// A solid wall segment flush against each stair tread's left and right
// edge, sized to that exact tread's height — a stepped "stringer wall"
// that rises with the stairs, in place of open-sided floating treads.
// Reuses MEZZANINE_STEPS' own geometry (not separately authored numbers),
// so the walls can't drift out of sync with the treads they flank.
const STAIR_WALL_THICKNESS = 0.14;
export const STAIR_WALLS = MEZZANINE_STEPS.flatMap((tread) => [
  { minX: tread.minX - STAIR_WALL_THICKNESS, maxX: tread.minX, minY: 0, maxY: tread.topY, minZ: tread.minZ, maxZ: tread.maxZ },
  { minX: tread.maxX, maxX: tread.maxX + STAIR_WALL_THICKNESS, minY: 0, maxY: tread.topY, minZ: tread.minZ, maxZ: tread.maxZ }
]);

// Two wall segments filling the mezzanine's front (near/stairs-facing)
// edge, one on each side of the stair opening. getGroundHeight already
// treats the entire area under the mezzanine's footprint as "3.6m tall"
// regardless of the player's actual height, so a player at floor level
// could never walk past this edge anyway (outside the stair corridor) —
// that was an invisible wall. These panels just make that existing,
// unavoidable boundary visible instead of confusing.
const FRONT_WALL_THICKNESS = 0.15;
export const MEZZANINE_FRONT_WALLS = [
  {
    minX: -MEZZANINE_WIDTH / 2,
    maxX: MEZZANINE_STEPS[0].minX,
    minY: 0,
    maxY: MEZZANINE_Y,
    minZ: MEZZANINE_NEAR_EDGE_Z - FRONT_WALL_THICKNESS / 2,
    maxZ: MEZZANINE_NEAR_EDGE_Z + FRONT_WALL_THICKNESS / 2
  },
  {
    minX: MEZZANINE_STEPS[0].maxX,
    maxX: MEZZANINE_WIDTH / 2,
    minY: 0,
    maxY: MEZZANINE_Y,
    minZ: MEZZANINE_NEAR_EDGE_Z - FRONT_WALL_THICKNESS / 2,
    maxZ: MEZZANINE_NEAR_EDGE_Z + FRONT_WALL_THICKNESS / 2
  }
];

// Every surface in the range the player can stand on top of (all the
// stair treads, plus the mezzanine floor itself).
export const SOLIDS = [...MEZZANINE_STEPS, MEZZANINE_PLATFORM];

// Highest steppable surface at a given (x, z) column, or 0 for the base
// floor. FirstPersonRig snaps the camera's feet to this value each frame.
export function getGroundHeight(x, z) {
  let top = 0;
  for (const solid of SOLIDS) {
    if (x >= solid.minX && x <= solid.maxX && z >= solid.minZ && z <= solid.maxZ && solid.topY > top) {
      top = solid.topY;
    }
  }
  return top;
}

// ---- Truss/beam structure — shared with RangeEnvironment's rendering so
// the beams a player can now bump their head on (reachable by jumping near
// the mezzanine, or just walking the mezzanine floor itself) are exactly
// the ones drawn, not a separately-guessed approximation of them.
//
// TIE_BEAM_Y is anchored to the mezzanine rather than a fixed fraction of
// WALL_HEIGHT (the original single-story ratio) — that had left only
// ~0.3m of clearance between a standing player's head on the mezzanine
// and the tie beam, reading as a cramped, too-low ceiling. MEZZANINE_HEADROOM
// is the clear space actually being tuned; WALL_HEIGHT follows from it
// rather than the other way around.
const MEZZANINE_HEADROOM = 2.3;
// The height of each truss bay's horizontal tie beam, and the overall
// ceiling height — both worked out from the headroom above so there's
// always a comfortable gap above a standing player's head.
export const TIE_BEAM_Y = MEZZANINE_Y + EYE_HEIGHT + MEZZANINE_HEADROOM;
const ROOF_TRUSS_DEPTH = 3; // space above the tie beam for the diagonal bracing/roofline
export const WALL_HEIGHT = TIE_BEAM_Y + ROOF_TRUSS_DEPTH;
// How far apart the repeating truss bays are along the length of the
// range, and how many of them fit.
export const TRUSS_SPACING = 3.4;
export const TRUSS_COUNT = Math.floor(RANGE_LENGTH / TRUSS_SPACING);
// The Z position of every truss bay, spaced out along the range.
export const TRUSS_Z = Array.from({ length: TRUSS_COUNT }, (_, i) => RANGE_BOUNDS.maxZ - 1.7 - i * TRUSS_SPACING);
// Half the width a truss bay's tie beam spans, and the length/angle of its
// diagonal cross-braces (derived so the braces run neatly corner to
// corner between the tie beam and the roofline).
export const TRUSS_HALF_SPAN = RANGE_WIDTH / 2 + 0.15;
export const BRACE_LENGTH = Math.hypot(TRUSS_HALF_SPAN * 2, WALL_HEIGHT - TIE_BEAM_Y);
export const BRACE_ANGLE = Math.atan2(WALL_HEIGHT - TIE_BEAM_Y, TRUSS_HALF_SPAN * 2);

// How thick (in each direction) a tie beam and a cross-brace are, for
// collision purposes.
const TIE_BEAM_HALF_THICK = 0.13;
const BRACE_HALF_THICK = 0.045;

// One axis-aligned box per truss bay's horizontal tie beam.
const TIE_BEAMS = TRUSS_Z.map((z) => ({
  minX: -(TRUSS_HALF_SPAN + 0.15),
  maxX: TRUSS_HALF_SPAN + 0.15,
  minY: TIE_BEAM_Y - TIE_BEAM_HALF_THICK,
  maxY: TIE_BEAM_Y + TIE_BEAM_HALF_THICK,
  minZ: z - TIE_BEAM_HALF_THICK,
  maxZ: z + TIE_BEAM_HALF_THICK
}));

// Builds the list of diagonal cross-braces (as tilted line segments, not
// boxes) for every truss bay.
//
// Two diagonal cross-braces per bay, tilted in the X/Y plane — tested by
// rotating the query point into the brace's own local frame rather than
// as an axis-aligned box, since an AABB around a shallow diagonal spanning
// the full room width would over-block almost the entire upper truss
// volume instead of just the thin beam itself.
const BRACES = TRUSS_Z.flatMap((z) => {
  const centerY = (TIE_BEAM_Y + WALL_HEIGHT) / 2;
  return [BRACE_ANGLE, -BRACE_ANGLE].map((angle) => ({ z, centerY, angle }));
});

// True if world point (x, y, z) falls inside one particular tilted brace,
// by rotating the point into the brace's own straight-up-and-down frame
// first and then doing a plain rectangle check.
function pointInBrace(x, y, z, brace) {
  if (Math.abs(z - brace.z) > BRACE_HALF_THICK) return false;
  const dy = y - brace.centerY;
  const localX = x * Math.cos(brace.angle) + dy * Math.sin(brace.angle);
  const localY = dy * Math.cos(brace.angle) - x * Math.sin(brace.angle);
  return Math.abs(localX) <= BRACE_LENGTH / 2 && Math.abs(localY) <= BRACE_HALF_THICK;
}

// Every fixed obstruction that can be tested as a simple axis-aligned box
// (tie beams and stair-side walls together).
const AABB_OBSTRUCTIONS = [...TIE_BEAMS, ...STAIR_WALLS];

// True if world point (x, y, z) falls inside a given axis-aligned box.
function inAABB(x, y, z, box) {
  return x >= box.minX && x <= box.maxX && z >= box.minZ && z <= box.maxZ && y >= box.minY && y <= box.maxY;
}

// True if a player standing with feet at `feetY` at (x, z) would have
// their feet or head (feetY + EYE_HEIGHT) inside a tie beam, cross-brace,
// or stair-side wall. Sampled at those two points rather than a full
// vertical-segment intersection — thin, fixed obstructions relative to a
// person's height, so a two-point sample reliably catches walking into
// one without needing a full segment/rotated-box solver.
export function isBlockedByStructure(x, feetY, z) {
  const headY = feetY + EYE_HEIGHT;
  const inBox = (y) => AABB_OBSTRUCTIONS.some((box) => inAABB(x, y, z, box));
  const inBrace = (y) => BRACES.some((brace) => pointInBrace(x, y, z, brace));
  return inBox(feetY) || inBox(headY) || inBrace(feetY) || inBrace(headY);
}
