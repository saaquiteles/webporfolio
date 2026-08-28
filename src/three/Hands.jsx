import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";

// Roblox-FPS-style viewmodel arms — deliberately simple: one continuous
// slab per arm, no separate hand-block + forearm + cuff pieces. Earlier
// passes tried to fake an anatomical grip out of multiple stacked boxes
// (a hand mass, a forearm, a cuff band) and the seams between them read as
// broken/disconnected rather than detailed — box primitives can't produce
// real anatomical realism no matter how precisely they're positioned, so
// the fix isn't more precision, it's committing to the simpler form this
// technique actually supports. One uniform slab per arm, thick enough to
// read as substantial, its near end sitting directly at the grip rather
// than approaching it, extending back to a natural elbow position.
//
// Rendered as a child of WeaponRig's GUN_Y_OFFSET group (see
// WeaponRig.jsx), so coordinates are ProceduralGlock's own raw, un-offset
// geometry. WeaponRig's REST_POSITION was raised to give real vertical
// room here — see its comment for the frustum math.

// The arm's skin tone, and the cyan color used for its cuff band.
const SKIN = "#e8b894";
const CUFF_ACCENT = "#00F0FF";

// The arm slab's cross-section size, and how long its cuff band is.
const ARM_WIDTH = 0.095;
const ARM_HEIGHT = 0.085;
const CUFF_LENGTH = 0.045;

// Right (primary) arm: near end sits directly on the grip, not near it.
const RIGHT_ARM = {
  near: [0.015, -0.06, 0.03],
  far: [0.16, -0.32, 0.28]
};

// Left (support) arm: near end sits at the front-lower grip, by the
// trigger guard — the classic two-handed pistol cup, just below and in
// front of the primary hand's position.
const LEFT_ARM = {
  near: [-0.02, -0.075, -0.005],
  far: [-0.22, -0.35, 0.26]
};

// A reusable "straight up" reference vector, used below to work out how
// far to rotate a slab so it points from one given point to another.
const UP = new Vector3(0, 1, 0);

// Given two points, works out the midpoint, length, and rotation needed to
// stretch a single box so it spans exactly from one point to the other.
function useAlignedSlab(near, far) {
  return useMemo(() => {
    const start = new Vector3(...near);
    const end = new Vector3(...far);
    const delta = new Vector3().subVectors(end, start);
    const length = delta.length();
    const direction = delta.clone().normalize();
    return {
      midpoint: new Vector3().addVectors(start, end).multiplyScalar(0.5),
      length,
      quaternion: new Quaternion().setFromUnitVectors(UP, direction)
    };
  }, [near, far]);
}

// Renders one arm as a single stretched box (using useAlignedSlab above)
// plus a small glowing cuff band near its grip end.
//
// One slab: the arm itself (sharp-edged box) plus a thin cyan cuff band
// near the grip end, the one tie-in to the site's tactical accent
// palette. No other pieces — one continuous mass, no seams.
function Arm({ near, far }) {
  const { midpoint, length, quaternion } = useAlignedSlab(near, far);
  // Local +Y points from `near` toward `far` (grip end toward elbow end),
  // so the grip-side cuff sits at the NEGATIVE Y end.
  const cuffOffset = -(length / 2 - CUFF_LENGTH / 2);

  return (
    <group position={midpoint} quaternion={quaternion}>
      <mesh>
        <boxGeometry args={[ARM_WIDTH, length, ARM_HEIGHT]} />
        <meshStandardMaterial color={SKIN} roughness={0.6} metalness={0} />
      </mesh>
      <mesh position={[0, cuffOffset, 0]}>
        <boxGeometry args={[ARM_WIDTH + 0.004, CUFF_LENGTH, ARM_HEIGHT + 0.004]} />
        <meshStandardMaterial
          color={CUFF_ACCENT}
          emissive={CUFF_ACCENT}
          emissiveIntensity={0.6}
          roughness={0.4}
          metalness={0.2}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// Renders both viewmodel arms (right/primary and left/support) gripping
// the gun.
export default function Hands() {
  return (
    <group>
      <Arm near={RIGHT_ARM.near} far={RIGHT_ARM.far} />
      <Arm near={LEFT_ARM.near} far={LEFT_ARM.far} />
    </group>
  );
}
