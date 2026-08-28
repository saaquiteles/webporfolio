import { useCallback, useEffect, useRef, useState } from "react";
import { PerspectiveCamera, PointerLockControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import FirstPersonRig from "./FirstPersonRig";
import RangeEnvironment from "./RangeEnvironment";
import WeaponRig from "./WeaponRig";
import Target from "./Target";
import HitSpark from "./HitSpark";
import Tracer from "./Tracer";
import { TARGETS } from "../data/targets";
import { SPAWN_POSITION } from "./rangeConstants";
import { playGunshot, playImpact } from "../audio/audioEngine";

// Purely for the tracer's visual endpoint — a lightweight ray-sphere test
// against each target's known position, treated as a sphere a little wider
// than its actual icosahedron radius (0.55) so the streak reads as landing
// cleanly on a target it visually overlaps. This does NOT drive hit
// detection/unlocking — that stays owned by each Target's own onClick, as
// before. On a miss, the ray just keeps going to TRACER_FALLBACK_DISTANCE.
const TRACER_TARGET_RADIUS = 0.6;
const TRACER_FALLBACK_DISTANCE = 40;

// Works out where a fired shot's tracer streak should visually end: the
// nearest target it's aimed at, or a far-off point along the aim direction
// if it doesn't hit anything.
function computeTracerEnd(origin, dir) {
  let nearest = null;
  for (const target of TARGETS) {
    const [cx, cy, cz] = target.position;
    const ocX = cx - origin.x;
    const ocY = cy - origin.y;
    const ocZ = cz - origin.z;
    const tca = ocX * dir.x + ocY * dir.y + ocZ * dir.z;
    if (tca < 0) continue;
    const d2 = ocX * ocX + ocY * ocY + ocZ * ocZ - tca * tca;
    const r2 = TRACER_TARGET_RADIUS * TRACER_TARGET_RADIUS;
    if (d2 > r2) continue;
    const thc = Math.sqrt(r2 - d2);
    const t0 = tca - thc;
    if (t0 > 0 && (nearest === null || t0 < nearest)) nearest = t0;
  }
  const t = nearest ?? TRACER_FALLBACK_DISTANCE;
  return new Vector3(origin.x + dir.x * t, origin.y + dir.y * t, origin.z + dir.z * t);
}

// Renders and coordinates everything inside the 3D <Canvas>: the camera
// and gun, the pointer-lock/WASD movement rig, the room itself, all five
// targets, and short-lived hit-spark/tracer effects.
//
// The full Canvas-side world: camera + weapon, pointer-lock + WASD rig,
// range shell, all five targets, and ephemeral hit-spark particles. Locking
// is deliberately NOT bound through PointerLockControls' own built-in
// document-click listener (selector matches nothing on purpose) — App.jsx
// calls controlsRef.current.lock()/.unlock() explicitly from the "LOCK IN"
// and "RESUME TRAINING" buttons instead, so a stray click anywhere on the
// page (e.g. a link inside the glassmorphism modal) can never accidentally
// request pointer lock.
export default function RangeScene({ entered, isLocked, unlockedIds, onLockChange, onTargetHit, controlsRef }) {
  const { camera } = useThree();
  const weaponRef = useRef(null);
  // Currently-playing hit-spark particle bursts and bullet tracers, each
  // removed from this list once its own onDone fires.
  const [sparks, setSparks] = useState([]);
  const [tracers, setTracers] = useState([]);

  // Removes one spark from the list once it's finished playing.
  const removeSpark = useCallback((key) => {
    setSparks((prev) => prev.filter((spark) => spark.key !== key));
  }, []);

  // Removes one tracer from the list once it's finished playing.
  const removeTracer = useCallback((key) => {
    setTracers((prev) => prev.filter((tracer) => tracer.key !== key));
  }, []);

  // Called when a target is actually hit: plays the impact sound, spawns
  // a hit-spark burst there, and tells the parent (App.jsx) that this
  // section is now unlocked.
  const handleHit = useCallback(
    (id) => {
      const target = TARGETS.find((t) => t.id === id);
      if (target) {
        playImpact();
        setSparks((prev) => [...prev, { key: `${id}-${Date.now()}`, position: target.position }]);
      }
      onTargetHit(id);
    },
    [onTargetHit]
  );

  // Listens for every left-click while pointer-locked and fires the gun
  // (recoil, muzzle flash, gunshot sound, and a new tracer) no matter
  // where on screen was clicked.
  //
  // Any left-click while pointer-locked fires the weapon (recoil, muzzle
  // flash, gunshot, tracer) regardless of whether it lands on a target —
  // target hit consequences are handled separately by each Target's own
  // onClick, via R3F's own (separate) event system.
  //
  // Attached to `window`, not gl.domElement or any element under the
  // Canvas — this has already broken twice from chasing "which nested
  // element is the right one": first document.pointerLockElement turned out
  // to be the wrapping <div> R3F's event system connects to by default (not
  // gl.domElement), and even after fixing that comparison, gl.domElement
  // itself is not guaranteed to be the exact element every click reaches
  // first, since R3F's own raycasting/event pipeline is connected to that
  // same wrapping <div>, a DIFFERENT node in the tree. `window` sidesteps
  // the whole question: every click in the document reaches it, on every
  // element, in every configuration, full stop. Capture phase means it
  // fires before any descendant handler (including R3F's) gets a chance to
  // call stopPropagation(), so hit and miss clicks are handled identically
  // — this is what actually makes "fire anywhere, not just on targets" true
  // regardless of what R3F/drei do internally with their own listeners.
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (event.button !== 0) return;
      if (!isLocked) return;
      weaponRef.current?.fire();
      playGunshot();

      const origin = weaponRef.current?.getMuzzleWorldPosition(new Vector3()) ?? camera.position.clone();
      const dir = new Vector3();
      camera.getWorldDirection(dir);
      const end = computeTracerEnd(origin, dir);
      setTracers((prev) => [
        ...prev,
        { key: `${Date.now()}-${Math.random()}`, start: origin.toArray(), end: end.toArray() }
      ]);
    };
    window.addEventListener("pointerdown", handlePointerDown, { capture: true });
    return () => window.removeEventListener("pointerdown", handlePointerDown, { capture: true });
  }, [camera, isLocked]);

  // Targets only respond to hover/click once the player has both entered
  // the range and locked the pointer.
  const interactive = entered && isLocked;
  const handleLock = useCallback(() => onLockChange(true), [onLockChange]);
  const handleUnlock = useCallback(() => onLockChange(false), [onLockChange]);

  // Renders the camera+gun, the movement controls, the room, every target,
  // and any currently-active hit-spark/tracer effects.
  return (
    <>
      <PerspectiveCamera makeDefault position={SPAWN_POSITION} fov={75} near={0.01} far={60}>
        <WeaponRig ref={weaponRef} />
      </PerspectiveCamera>

      <PointerLockControls
        ref={controlsRef}
        selector="[data-pointer-lock-disabled]"
        onLock={handleLock}
        onUnlock={handleUnlock}
      />
      <FirstPersonRig controlsRef={controlsRef} active={entered} />

      <RangeEnvironment />

      {TARGETS.map((target, i) => (
        <Target
          key={target.id}
          id={target.id}
          label={target.label}
          sublabel={target.sublabel}
          position={target.position}
          unlocked={unlockedIds.includes(target.id)}
          interactive={interactive}
          onHit={handleHit}
          seed={i * 1.7}
        />
      ))}

      {sparks.map((spark) => (
        <HitSpark key={spark.key} position={spark.position} onDone={() => removeSpark(spark.key)} />
      ))}

      {tracers.map((tracer) => (
        <Tracer
          key={tracer.key}
          start={tracer.start}
          end={tracer.end}
          onDone={() => removeTracer(tracer.key)}
        />
      ))}
    </>
  );
}
