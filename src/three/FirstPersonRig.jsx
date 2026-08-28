import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";
import useKeyboardControls from "../hooks/useKeyboardControls";
import { EYE_HEIGHT, MOVE_SPEED, RANGE_BOUNDS } from "./rangeConstants";
import { STEP_HEIGHT, getGroundHeight, isBlockedByStructure } from "./levelGeometry";

const JUMP_IMPULSE = 8; // Adjust for jump height
const GRAVITY = 25;       // Adjust for gravity strength
// A small tolerance used when comparing heights, so tiny floating-point
// rounding differences don't get mistaken for a real gap or step.
const GROUND_EPSILON = 0.02;
// Exponential-decay rate for easing the camera's rendered Y up onto a
// stair tread/platform edge — the same MathUtils.damp pattern used for
// recoil/emissive elsewhere in the scene, applied here so climbing a step
// reads as a smooth rise instead of an instant teleport.
const STEP_EASE = 18;

// Checks whether a given spot on the floor is "blocked" — either because
// the surface there is more than one step higher than the player's feet,
// or because a beam/wall occupies that same space.
//
// True if standing at (x, z) with feet at `feetY` would mean being more
// than one step above the surface there, or inside a beam/stair-side wall
// — see the per-axis resolution below for why this is tested for X and Z
// separately rather than on the combined move.
//
// The STEP_HEIGHT comparison needs the same GROUND_EPSILON slop as the
// isGrounded check, not a bare `>` — consecutive stair treads are built
// as `riserHeight * (i + 1)`, and repeated floating-point multiplication
// of 0.4 doesn't produce bit-exact multiples (tread 5's height minus
// tread 4's comes out to 0.40000000000000036, not exactly 0.4). Without
// slop, that stray ~4e-16 was enough to make a perfectly legal one-step
// rise register as "too tall," permanently blocking that specific tread
// transition — which is exactly why climbing always got stuck at the
// same point (tread 5 of 9, i.e. almost precisely "halfway up").
function isPositionBlocked(x, feetY, z) {
  return getGroundHeight(x, z) - feetY > STEP_HEIGHT + GROUND_EPSILON || isBlockedByStructure(x, feetY, z);
}

// Moves the camera around the range every frame based on WASD/jump input,
// handling walking, climbing stairs, jumping, gravity, and collision —
// this component renders nothing itself, it only moves the camera.
export default function FirstPersonRig({ controlsRef, active }) {
  const { camera } = useThree();
  const keys = useKeyboardControls();

  // Track vertical velocity across frames
  const yVelocity = useRef(0);
  // The player's LOGICAL foot height, resolved exactly every frame — kept
  // separate from the camera's own (deliberately lagging/eased) rendered
  // Y. Deriving priorFeetY from the damped camera position caused a real
  // bug: holding W across several stair treads let the visual lag behind
  // the true tread height accumulate frame over frame, until the gap
  // exceeded STEP_HEIGHT and the "too tall, treat as a wall" check below
  // started reverting the player's forward movement — climbing stairs by
  // holding W would just get stuck partway up. feetY is always snapped to
  // the exact resolved ground/fall height each frame, so next frame's
  // step check is never fooled by easing lag; only the camera's rendered
  // Y (set from feetY below) is allowed to visually lag for smoothness.
  const feetY = useRef(0);

  // Runs once per rendered frame: reads the current key state, moves the
  // camera, resolves collisions, and applies gravity/jumping.
  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!active || !controls) return;

    const step = MOVE_SPEED * delta;
    const { forward, backward, left, right, jump } = keys.current;

    const prevX = camera.position.x;
    const prevZ = camera.position.z;
    const priorFeetY = feetY.current;

    // Horizontal Movement
    if (forward) controls.moveForward(step);
    if (backward) controls.moveForward(-step);
    if (right) controls.moveRight(step);
    if (left) controls.moveRight(-step);

    // Clamps the intended new position to the range's outer walls.
    const desiredX = MathUtils.clamp(camera.position.x, RANGE_BOUNDS.minX, RANGE_BOUNDS.maxX);
    const desiredZ = MathUtils.clamp(camera.position.z, RANGE_BOUNDS.minZ, RANGE_BOUNDS.maxZ);

    // Resolve X and Z as two separate axis-aligned sweeps from this
    // frame's starting position, instead of testing the full diagonal
    // move and reverting BOTH axes together the moment either one fails.
    // The combined test was the actual cause of getting stuck partway up
    // the stairs: mouse-look is rarely aimed perfectly straight, so
    // climbing a run of 1.5m-wide treads would drift a little sideways
    // each frame; testing X and Z together meant that sideways drift also
    // cancelled the frame's forward progress, and once drifted off a
    // tread's edge, stepping back toward it from the side re-triggered
    // the "too tall, treat as a wall" check — net result, no forward
    // progress at all. Resolving each axis independently lets forward
    // motion keep working even while sideways drift alone is rejected,
    // the same "slide along the wall" behavior most FPS collision uses.
    camera.position.x = desiredX;
    camera.position.z = prevZ;
    if (isPositionBlocked(camera.position.x, priorFeetY, camera.position.z)) {
      camera.position.x = prevX;
    }

    camera.position.z = desiredZ;
    if (isPositionBlocked(camera.position.x, priorFeetY, camera.position.z)) {
      camera.position.z = prevZ;
    }

    // The height of whatever surface is directly under the player's
    // (now-resolved) X/Z position.
    const groundY = getGroundHeight(camera.position.x, camera.position.z);

    // Grounded means standing at or below the surface under the player's
    // (possibly just-updated) feet — true on flat floor, true one stair
    // tread higher after a legal step-up above, and false the instant a
    // ledge is walked off (the surface underfoot drops away faster than
    // gravity has pulled the camera down yet).
    const isGrounded = priorFeetY <= groundY + GROUND_EPSILON;

    // Jump Impulse (only when on the ground)
    if (jump && isGrounded) {
      yVelocity.current = JUMP_IMPULSE;
    }

    if (!isGrounded || yVelocity.current > 0) {
      // Falling or jumping: integrate real physics into the logical foot
      // height, and never let it sink through whatever surface (base
      // floor, stair tread, or platform) it lands on.
      yVelocity.current -= GRAVITY * delta;
      feetY.current += yVelocity.current * delta;
      if (feetY.current < groundY) {
        feetY.current = groundY;
        yVelocity.current = 0;
      }
      camera.position.y = feetY.current + EYE_HEIGHT;
    } else {
      // Grounded and not launching a jump: snap the logical foot height
      // straight to the surface (exact, no lag — see the feetY comment
      // above), while the camera's rendered Y eases toward it, so a stair
      // tread's rise still reads as a quick smooth lift rather than an
      // instant teleport.
      feetY.current = groundY;
      camera.position.y = MathUtils.damp(camera.position.y, groundY + EYE_HEIGHT, STEP_EASE, delta);
    }
  });

  // This component only moves the camera as a side effect — it has no
  // visuals of its own to render.
  return null;
}
