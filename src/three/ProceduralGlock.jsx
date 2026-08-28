// The weapon mesh — built from primitive box/cylinder geometry, no
// imported model, no texture. Previously a fallback for glock.glb; both
// that model and hands.glb caused more problems than they solved (an
// auto-fit that couldn't know a real model's facing/pivot with certainty,
// and an unposed T-pose skeleton respectively) and have been removed. This
// hand-authored mesh is the real, permanent weapon now.
//
// Local -Z is "forward" (away from the player, into the screen) — WeaponRig
// nests this directly under the camera, which uses the same convention, so
// the barrel tip sits at negative Z and lines up with MuzzleFlash's own
// muzzle-tip position without any extra compensating rotation.

// The gun's three main colors: army green (body), a darker army green
// (grip), and steel (bare metal parts).
const ARMY_GREEN = "#4b5320";
const ARMY_GREEN_DARK = "#3a4019";
const STEEL = "#3a3d3a";

// Renders the whole pistol as a group of simple shapes — a slide, grip,
// magazine plate, trigger guard, barrel tip, glowing rail accent, and
// rear sight.
export default function ProceduralGlock() {
  return (
    <group>
      {/* slide */}
      <mesh position={[0, 0.035, -0.02]} castShadow={false}>
        <boxGeometry args={[0.055, 0.06, 0.24]} />
        <meshStandardMaterial color={ARMY_GREEN} metalness={0.45} roughness={0.55} />
      </mesh>
      {/* frame / grip */}
      <mesh position={[0, -0.07, 0.06]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[0.05, 0.16, 0.055]} />
        <meshStandardMaterial color={ARMY_GREEN_DARK} metalness={0.2} roughness={0.7} />
      </mesh>
      {/* magazine base plate — a small steel lip peeking out beneath the
          grip, the one detail that reads as "this is a real object with a
          bottom," not just a box */}
      <mesh position={[0, -0.155, 0.075]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[0.054, 0.012, 0.06]} />
        <meshStandardMaterial color={STEEL} metalness={0.7} roughness={0.35} />
      </mesh>
      {/* trigger guard */}
      <mesh position={[0, -0.01, -0.01]}>
        <torusGeometry args={[0.028, 0.006, 8, 16, Math.PI]} />
        <meshStandardMaterial color={ARMY_GREEN_DARK} metalness={0.2} roughness={0.65} />
      </mesh>
      {/* barrel tip — bare steel, distinct from the coated body */}
      <mesh position={[0, 0.035, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.05, 14]} />
        <meshStandardMaterial color={STEEL} metalness={0.85} roughness={0.2} />
      </mesh>
      {/* tactical cyan rail accent — the only emissive element on the gun */}
      <mesh position={[0, 0.067, -0.02]}>
        <boxGeometry args={[0.014, 0.006, 0.22]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      {/* rear sight */}
      <mesh position={[0, 0.072, 0.09]}>
        <boxGeometry args={[0.03, 0.012, 0.014]} />
        <meshStandardMaterial color={STEEL} metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}
