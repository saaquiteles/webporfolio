import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Color, MathUtils } from "three";

const IDLE_COLOR = new Color("#FF4655");
const UNLOCKED_COLOR = new Color("#00FF87");

// A single floating holographic target. Hover/click use React Three
// Fiber's own built-in pointer events rather than a hand-rolled raycaster:
// PointerLockControls (see RangeScene) patches R3F's event pipeline to
// always compute the pointer at screen-center while mounted, which is
// exactly the "raycast from [0,0]" behaviour the brief calls for — clicking
// or hovering over a target under pointer lock is really a center-screen
// raycast under the hood, just via the framework's own plumbing instead of
// a second, redundant THREE.Raycaster.
export default function Target({ id, label, sublabel, position, unlocked, interactive, onHit, seed = 0 }) {
  const bobRef = useRef();
  const materialRef = useRef();
  const hoverRef = useRef(false);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (bobRef.current) {
      bobRef.current.position.y = Math.sin(t * 0.9 + seed) * 0.06;
      bobRef.current.rotation.y += delta * 0.3;
    }
    if (materialRef.current) {
      const targetIntensity = unlocked ? 0.6 : hoverRef.current ? 2.6 : 1.1;
      materialRef.current.emissiveIntensity = MathUtils.damp(
        materialRef.current.emissiveIntensity,
        targetIntensity,
        8,
        delta
      );
    }
  });

  const color = unlocked ? UNLOCKED_COLOR : IDLE_COLOR;

  return (
    <group position={position}>
      <group ref={bobRef}>
        <mesh
          onPointerOver={(event) => {
            event.stopPropagation();
            if (interactive) hoverRef.current = true;
          }}
          onPointerOut={(event) => {
            event.stopPropagation();
            hoverRef.current = false;
          }}
          onClick={(event) => {
            event.stopPropagation();
            if (interactive) onHit(id);
          }}
        >
          <icosahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            ref={materialRef}
            color={color}
            emissive={color}
            emissiveIntensity={1.1}
            wireframe
            toneMapped={false}
          />
        </mesh>
        {/* faint holographic core — decorative only, excluded from raycasting
            so it never interferes with the hit-mesh above */}
        <mesh scale={0.6} raycast={() => null}>
          <icosahedronGeometry args={[0.55, 0]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} toneMapped={false} />
        </mesh>
      </group>

      <Text
        position={[0, 1.05, 0]}
        fontSize={0.22}
        color="#00F0FF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.006}
        outlineColor="#0B0E14"
        raycast={() => null}
      >
        {label}
      </Text>
      <Text
        position={[0, 0.78, 0]}
        fontSize={0.1}
        color="#ECE8E1"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
        raycast={() => null}
      >
        {sublabel}
      </Text>
      {unlocked && (
        <Text
          position={[0, 1.32, 0]}
          fontSize={0.12}
          color="#00FF87"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
          raycast={() => null}
        >
          ✓ UNLOCKED
        </Text>
      )}
    </group>
  );
}
