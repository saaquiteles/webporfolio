import { forwardRef, Suspense, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import ModelErrorBoundary from "./ModelErrorBoundary";
import GlockModel from "./GlockModel";
import ProceduralGlock from "./ProceduralGlock";
import MuzzleFlash from "./MuzzleFlash";

// Anchored to the camera at [0.3, -0.28, -0.5] relative to camera — this
// component is rendered as a JSX child of <PerspectiveCamera>, so its own
// local position IS that camera-relative offset for free, no manual
// per-frame sync required.
const REST_POSITION = [0.3, -0.28, -0.5];

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
      <ModelErrorBoundary fallback={<ProceduralGlock />}>
        <Suspense fallback={<ProceduralGlock />}>
          <GlockModel scale={0.9} />
        </Suspense>
      </ModelErrorBoundary>
      <MuzzleFlash ref={muzzleRef} />
    </group>
  );
});

export default WeaponRig;
