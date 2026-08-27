import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import ProceduralGlock from "./ProceduralGlock";
import MuzzleFlash from "./MuzzleFlash";
import Hands from "./Hands";
import { GUN_Y_OFFSET } from "./weaponConstants";

// Anchored to the camera at [0.225, -0.18, -0.5] relative to camera — this
// component is rendered as a JSX child of <PerspectiveCamera>, so its own
// local position IS that camera-relative offset for free, no manual
// per-frame sync required.
//
// X moved from 0.3 to 0.225 (25% closer to center) — shifts the whole
// gun+hands assembly left together, same amount for both since they share
// this one REST_POSITION.
//
// Y raised from -0.28 to -0.18 for a real reason, not cosmetics: at 75°
// FOV, the visible frustum's half-height at this depth (z≈-0.5) is
// z*tan(37.5°)≈0.384. With the old -0.28 plus GUN_Y_OFFSET's -0.06, any
// hand-local Y below about -0.044 rendered BELOW the bottom edge of the
// screen — not misplaced, literally off-frame. That's why the hand kept
// showing as a thin sliver no matter how it was resized: there was only
// 0.044 units of vertical room to work with. Raising this frees up
// roughly 0.144 units instead, enough room for both hands to actually be
// visible in a real two-handed grip.
const REST_POSITION = [0.225, -0.18, -0.5];

// Recoil reads on three independent axes, each damped back to rest at its
// own rate. Pure +Z translation (toward/away from the camera) was the
// original recoil axis and is nearly imperceptible up close: motion along
// the view axis barely changes an object's screen position, only its
// apparent size. Kick is now dominated by pitch rotation (muzzle rise) and
// a vertical dip — both move the gun across the screen, not through it —
// with the Z pull now toward the viewer (a real recoil cue: the gun
// visibly grows/jumps back) instead of away, which is also the
// physically-backwards direction the previous version used.
const RECOIL_KICK_Z = 0.16;
const RECOIL_KICK_PITCH = 0.34;
const RECOIL_KICK_DIP = 0.07;

// A further gun-only nudge, on top of GUN_Y_OFFSET — the gun and hands
// now share that offset's group (see the note below), so GUN_Y_OFFSET
// alone moves them together and can't close a gap between them. This
// wraps just the gun/muzzle-flash in their own inner group instead, to
// lower the gun toward the (unmoved) hands. Five successive adjustments
// so far: +10%, +15%, +15%, +15%, +15% more of GUN_Y_OFFSET's own
// magnitude, for a running total of 70%.
const GUN_TO_HAND_NUDGE = GUN_Y_OFFSET * 0.7;

// GUN_Y_OFFSET drops the gun mesh (and its muzzle flash, so the flash
// stays aligned with the now-lower barrel tip) relative to the hands,
// which stay put — screenshots showed a visible gap between the grip and
// the hand block sitting on it. Imported from weaponConstants.js rather
// than declared locally: Hands.jsx needs this exact same value to center
// its blocks on the gun's actual (offset) position, and a copy-pasted,
// unsynced second copy is exactly what caused the grip to keep
// reappearing below the hand across several fix attempts.

const WeaponRig = forwardRef(function WeaponRig(_props, ref) {
  const groupRef = useRef();
  const muzzleRef = useRef();
  const recoilZ = useRef(0);
  const recoilPitch = useRef(0);
  const recoilDip = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      fire() {
        recoilZ.current = RECOIL_KICK_Z;
        recoilPitch.current = RECOIL_KICK_PITCH;
        recoilDip.current = RECOIL_KICK_DIP;
        muzzleRef.current?.trigger();
      },
      // Lets RangeScene anchor a bullet tracer's start point exactly where
      // the muzzle flash renders, rather than approximating from the
      // camera's own position.
      getMuzzleWorldPosition(target) {
        return muzzleRef.current?.getWorldPosition(target) ?? target;
      }
    }),
    []
  );

  useFrame((_, delta) => {
    // Exponential decay back to rest — the same damp-to-zero pattern as
    // the crosshair/emissive lerps elsewhere in the scene, just applied to
    // the weapon's local transform instead of a material property. Faster
    // lambdas than before for a snappier, more "felt" snap-back.
    recoilZ.current = MathUtils.damp(recoilZ.current, 0, 12, delta);
    recoilPitch.current = MathUtils.damp(recoilPitch.current, 0, 9, delta);
    recoilDip.current = MathUtils.damp(recoilDip.current, 0, 12, delta);

    const group = groupRef.current;
    if (!group) return;
    group.position.z = REST_POSITION[2] + recoilZ.current;
    group.position.y = REST_POSITION[1] - recoilDip.current;
    group.rotation.x = recoilPitch.current;
  });

  return (
    <group ref={groupRef} position={REST_POSITION}>
      <group position={[0, GUN_Y_OFFSET, 0]}>
        {/* Both attempted real .glb assets (glock.glb, hands.glb) caused
            more problems than they solved — glock.glb's auto-fit couldn't
            know its facing/pivot with certainty, and hands.glb turned out
            to be an unposed T-pose skeleton with no baked animation. Both
            removed; the procedural, hand-authored meshes are the real
            weapon now, not a fallback for a missing asset. */}
        <group position={[0, GUN_TO_HAND_NUDGE, 0]}>
          <ProceduralGlock />
          <MuzzleFlash ref={muzzleRef} />
        </group>
        {/* Hands.jsx lives INSIDE this same GUN_Y_OFFSET group, not as a
            sibling — it needs the exact same shift the gun/flash get, and a
            separate manually-added copy of that offset (tried once) is
            exactly what caused the grip to drift out of alignment: easy to
            apply, easy to apply wrong, easy to leave stale after a later
            edit. Sharing the actual parent transform makes that whole class
            of bug structurally impossible instead of just documented.
            Hands.jsx's own coordinates are ProceduralGlock's raw,
            un-offset ones as a result — no extra arithmetic needed there. */}
        <Hands />
      </group>
    </group>
  );
});

export default WeaponRig;
