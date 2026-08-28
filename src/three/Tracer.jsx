import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Quaternion, Vector3 } from "three";

// How long a tracer streak stays visible (seconds), how thick it is, and
// the reference "up" direction used to orient it.
const LIFETIME = 0.09;
const RADIUS = 0.006;
const UP = new Vector3(0, 1, 0);

// Draws a quick, fading bright streak from the muzzle to wherever the
// shot ended up, then removes itself.
//
// A short-lived bright streak from the muzzle to wherever the shot landed
// (a target's center on a hit, or a far point along the aim direction on a
// miss — see computeTracerEnd in RangeScene). Same imperative,
// self-removing lifecycle as HitSpark: spawned into RangeScene's `tracers`
// array on fire, calls onDone once its lifetime elapses so the parent can
// drop it.
export default function Tracer({ start, end, onDone }) {
  const materialRef = useRef();
  const elapsed = useRef(0);

  // Works out the streak's midpoint, length, and rotation needed to
  // stretch a simple cylinder from `start` to `end` — recalculated only
  // when those two points change.
  const { midpoint, length, quaternion } = useMemo(() => {
    const s = new Vector3(...start);
    const e = new Vector3(...end);
    const delta = new Vector3().subVectors(e, s);
    const len = Math.max(delta.length(), 0.001);
    const dir = delta.clone().normalize();
    return {
      midpoint: new Vector3().addVectors(s, e).multiplyScalar(0.5),
      length: len,
      quaternion: new Quaternion().setFromUnitVectors(UP, dir)
    };
  }, [start, end]);

  // Tells the parent (via onDone) to remove this tracer once its lifetime
  // has elapsed.
  useEffect(() => {
    const timer = setTimeout(() => onDone?.(), LIFETIME * 1000 + 40);
    return () => clearTimeout(timer);
  }, [onDone]);

  // Every frame, fades the tracer's opacity out over its lifetime.
  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = Math.min(1, elapsed.current / LIFETIME);
    if (materialRef.current) materialRef.current.opacity = 0.85 * (1 - t);
  });

  // Renders the streak itself: a thin cylinder stretched and rotated to
  // connect the start and end points.
  return (
    <group position={midpoint} quaternion={quaternion}>
      <mesh>
        <cylinderGeometry args={[RADIUS, RADIUS, length, 6, 1, true]} />
        <meshBasicMaterial
          ref={materialRef}
          color="#ffd7da"
          transparent
          opacity={0.85}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
