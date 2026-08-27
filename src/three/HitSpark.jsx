import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const PARTICLE_COUNT = 14;
const LIFETIME = 0.45;
const PARTICLE_INDICES = Array.from({ length: PARTICLE_COUNT }, (_, i) => i);

// A short-lived, self-removing particle burst spawned at a target's
// position on a confirmed hit. Mounted imperatively by RangeScene (added
// to a small `sparks` array on hit, removed via onDone once its lifetime
// elapses) rather than kept as a persistent scene object.
//
// The random per-particle directions are rolled in a layout effect (not a
// render-phase useMemo) — Math.random is an impure call, and React's
// render body/useMemo factories are expected to stay pure; effects are the
// documented escape hatch for that kind of one-time randomized setup.
export default function HitSpark({ position, color = "#00FF87", onDone }) {
  const groupRef = useRef();
  const elapsed = useRef(0);
  const directionsRef = useRef(null);

  useLayoutEffect(() => {
    directionsRef.current = PARTICLE_INDICES.map(() => {
      const v = new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
      return v.normalize().multiplyScalar(0.5 + Math.random() * 0.9);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => onDone?.(), LIFETIME * 1000 + 60);
    return () => clearTimeout(timer);
  }, [onDone]);

  useFrame((_, delta) => {
    const directions = directionsRef.current;
    const group = groupRef.current;
    if (!directions || !group) return;

    elapsed.current += delta;
    const t = Math.min(1, elapsed.current / LIFETIME);
    group.children.forEach((child, i) => {
      const dir = directions[i];
      child.position.set(dir.x * t, dir.y * t, dir.z * t);
      child.scale.setScalar(Math.max(0.001, 1 - t));
    });
  });

  return (
    <group ref={groupRef} position={position}>
      {PARTICLE_INDICES.map((i) => (
        <mesh key={i}>
          <boxGeometry args={[0.05, 0.05, 0.05]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
