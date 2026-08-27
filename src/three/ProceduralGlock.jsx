// The always-available fallback weapon mesh, built from primitive
// box/cylinder geometry — no imported model, no texture. This is what
// renders while /models/glock.glb is loading and permanently once it 404s
// (there is no such file in this project).
//
// Local -Z is "forward" (away from the player, into the screen) — WeaponRig
// nests this directly under the camera, which uses the same convention, so
// the barrel tip sits at negative Z and lines up with MuzzleFlash's own
// muzzle-tip position without any extra compensating rotation.
export default function ProceduralGlock() {
  return (
    <group>
      {/* slide */}
      <mesh position={[0, 0.035, -0.02]} castShadow={false}>
        <boxGeometry args={[0.055, 0.06, 0.24]} />
        <meshStandardMaterial color="#1b1e26" metalness={0.75} roughness={0.35} />
      </mesh>
      {/* frame / grip */}
      <mesh position={[0, -0.07, 0.06]} rotation={[-0.22, 0, 0]}>
        <boxGeometry args={[0.05, 0.16, 0.055]} />
        <meshStandardMaterial color="#101318" metalness={0.5} roughness={0.55} />
      </mesh>
      {/* trigger guard */}
      <mesh position={[0, -0.01, -0.01]}>
        <torusGeometry args={[0.028, 0.006, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#101318" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* barrel tip */}
      <mesh position={[0, 0.035, -0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.05, 14]} />
        <meshStandardMaterial color="#22262f" metalness={0.85} roughness={0.2} />
      </mesh>
      {/* tactical cyan rail accent — the only emissive element on the gun */}
      <mesh position={[0, 0.067, -0.02]}>
        <boxGeometry args={[0.014, 0.006, 0.22]} />
        <meshStandardMaterial color="#00F0FF" emissive="#00F0FF" emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      {/* rear sight */}
      <mesh position={[0, 0.072, 0.09]}>
        <boxGeometry args={[0.03, 0.012, 0.014]} />
        <meshStandardMaterial color="#33394a" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}
