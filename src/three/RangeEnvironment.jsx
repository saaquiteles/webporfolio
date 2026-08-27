import { Grid, Text } from "@react-three/drei";
import { DoubleSide } from "three";
import { RANGE_BOUNDS, RANGE_LENGTH, RANGE_WIDTH, RANGE_CENTER_Z } from "./rangeConstants";

// Warm industrial warehouse shell — a practice-range hangar with an exposed
// wood-truss roof, tan stucco walls, crates, arched windows, and a raised
// loft, replacing the earlier dark-navy tactical-corridor pass per
// reference photos of a real training-range interior. The scoreboard prop
// is the one place the old tactical cyan survives, deliberately: it reads
// as a distinct tech fixture bolted into a warm room, not the room's own
// palette, matching how the reference photo itself contrasts a cool digital
// display against warm wood and plaster.
const WALL_HEIGHT = 6.4;
const TIE_BEAM_Y = WALL_HEIGHT * 0.62;
const FLOOR_W = RANGE_WIDTH + 1.5;
const FLOOR_L = RANGE_LENGTH + 3;

const WOOD = "#7a4f2c";
const WOOD_DARK = "#5c3a20";
const GUSSET = "#241d16";
const PLASTER = "#c7ad86";
const PLASTER_TRIM = "#a08862";
const CONCRETE = "#a3937a";
const GUIDE_LINE = "#e8963c";

const TRUSS_SPACING = 3.4;
const TRUSS_COUNT = Math.floor(RANGE_LENGTH / TRUSS_SPACING);
const TRUSS_Z = Array.from({ length: TRUSS_COUNT }, (_, i) => RANGE_BOUNDS.maxZ - 1.7 - i * TRUSS_SPACING);
const LANE_X = [-2.6, 0, 2.6];

const ARCHED_WINDOW_Z = [RANGE_BOUNDS.maxZ - 5, RANGE_BOUNDS.maxZ - 8.2];

const CRATE_POSITIONS = [
  { position: [RANGE_BOUNDS.minX + 0.7, 0, RANGE_BOUNDS.maxZ - 2.2], rotation: 0.3 },
  { position: [RANGE_BOUNDS.maxX - 0.7, 0, RANGE_BOUNDS.maxZ - 1.2], rotation: -0.5 },
  { position: [RANGE_BOUNDS.minX + 0.6, 0, RANGE_CENTER_Z + 2], rotation: 0.15 },
  { position: [RANGE_BOUNDS.minX + 0.65, 0, RANGE_BOUNDS.minZ + 1.4], rotation: -0.25 }
];

// One post-and-beam truss bay: two vertical posts rising from floor to
// ceiling, a horizontal tie beam between them, and a big X cross-brace in
// the upper wall — the repeating unit that gives the reference photo's
// hangar its rhythm. Small dark "gusset" cubes mark each joint, standing in
// for the bolted steel plates in the photo.
function TrussFrame({ z }) {
  const halfSpan = RANGE_WIDTH / 2 + 0.15;
  const braceLength = Math.hypot(halfSpan * 2, WALL_HEIGHT - TIE_BEAM_Y);
  const braceAngle = Math.atan2(WALL_HEIGHT - TIE_BEAM_Y, halfSpan * 2);

  return (
    <group position={[0, 0, z]}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * halfSpan, WALL_HEIGHT / 2, 0]} raycast={() => null}>
          <boxGeometry args={[0.32, WALL_HEIGHT, 0.32]} />
          <meshStandardMaterial color={WOOD} roughness={0.85} />
        </mesh>
      ))}

      <mesh position={[0, TIE_BEAM_Y, 0]} raycast={() => null}>
        <boxGeometry args={[halfSpan * 2 + 0.3, 0.26, 0.26]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.85} />
      </mesh>
      <mesh position={[0, WALL_HEIGHT - 0.13, 0]} raycast={() => null}>
        <boxGeometry args={[halfSpan * 2 + 0.3, 0.22, 0.22]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.85} />
      </mesh>

      {/* the X cross-brace, one steel-grey diagonal each way */}
      <mesh position={[0, (TIE_BEAM_Y + WALL_HEIGHT) / 2, 0]} rotation={[0, 0, braceAngle]} raycast={() => null}>
        <boxGeometry args={[braceLength, 0.09, 0.09]} />
        <meshStandardMaterial color="#3a3630" roughness={0.5} metalness={0.5} />
      </mesh>
      <mesh position={[0, (TIE_BEAM_Y + WALL_HEIGHT) / 2, 0]} rotation={[0, 0, -braceAngle]} raycast={() => null}>
        <boxGeometry args={[braceLength, 0.09, 0.09]} />
        <meshStandardMaterial color="#3a3630" roughness={0.5} metalness={0.5} />
      </mesh>

      {[-1, 1].map((side) => (
        <mesh key={`gusset-${side}`} position={[side * halfSpan, TIE_BEAM_Y, 0]} raycast={() => null}>
          <boxGeometry args={[0.4, 0.4, 0.05]} />
          <meshStandardMaterial color={GUSSET} roughness={0.4} metalness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function LaneMarkers() {
  return (
    <group>
      {LANE_X.map((x, i) => (
        <mesh key={i} position={[x, 0.015, RANGE_CENTER_Z]} raycast={() => null}>
          <boxGeometry args={[0.09, 0.01, RANGE_LENGTH - 1]} />
          <meshBasicMaterial color={GUIDE_LINE} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

// A modest crate stack — two boxes, fixed authored offsets rather than
// randomized, since this is static set dressing rendered once, not
// something that benefits from per-visit variation.
function CrateStack({ position, rotation = 0 }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.35, 0]} raycast={() => null}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color={WOOD} roughness={0.9} />
      </mesh>
      <mesh position={[0.45, 0.22, 0.12]} rotation={[0, 0.35, 0]} raycast={() => null}>
        <boxGeometry args={[0.44, 0.44, 0.44]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.9} />
      </mesh>
    </group>
  );
}

// A round-topped window: a rectangular opening capped by a half-cylinder
// arch, framed in the darker plaster trim, glazed with a faint warm-white
// panel standing in for daylight through the glass.
function ArchedWindow({ z }) {
  const x = RANGE_BOUNDS.minX - 0.16;
  return (
    <group position={[x, 2.5, z]} rotation={[0, Math.PI / 2, 0]}>
      <mesh raycast={() => null}>
        <planeGeometry args={[1, 1.7]} />
        <meshBasicMaterial color="#f2e6c9" transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.5, 0.5, 0.02, 16, 1, false, 0, Math.PI]} />
        <meshBasicMaterial color="#f2e6c9" transparent opacity={0.5} toneMapped={false} side={DoubleSide} />
      </mesh>
      {/* frame */}
      <mesh position={[-0.52, 0, 0.01]} raycast={() => null}>
        <boxGeometry args={[0.08, 1.7, 0.08]} />
        <meshStandardMaterial color={PLASTER_TRIM} roughness={0.8} />
      </mesh>
      <mesh position={[0.52, 0, 0.01]} raycast={() => null}>
        <boxGeometry args={[0.08, 1.7, 0.08]} />
        <meshStandardMaterial color={PLASTER_TRIM} roughness={0.8} />
      </mesh>
    </group>
  );
}

// A raised loft platform with a short run of stepped stairs — the second
// storey visible in the reference photo, rendered as simple boxes rather
// than a modeled staircase asset.
function Loft() {
  const platformZ = RANGE_CENTER_Z - RANGE_LENGTH * 0.18;
  const x = RANGE_BOUNDS.maxX - 1.1;
  const platformY = 2.4;
  const stepCount = 6;

  return (
    <group>
      <mesh position={[x, platformY, platformZ]} raycast={() => null}>
        <boxGeometry args={[2.1, 0.18, 3.6]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.85} />
      </mesh>
      {/* railing */}
      <mesh position={[x, platformY + 0.55, platformZ - 1.8]} raycast={() => null}>
        <boxGeometry args={[2.1, 0.9, 0.06]} />
        <meshStandardMaterial color={WOOD} roughness={0.85} transparent opacity={0.5} />
      </mesh>

      {Array.from({ length: stepCount }, (_, i) => (
        <mesh
          key={i}
          position={[
            x,
            (platformY / stepCount) * (i + 1) - platformY / stepCount / 2,
            platformZ + 1.9 + i * 0.32
          ]}
          raycast={() => null}
        >
          <boxGeometry args={[1.5, platformY / stepCount, 0.32]} />
          <meshStandardMaterial color={WOOD} roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
}

// The one deliberately cool-toned prop in the room: a suspended digital
// scoreboard, cables to the ceiling, glowing tactical-cyan readout — a
// distinct fixture against the warm shell, not a palette shift for the room
// itself.
function Scoreboard() {
  const z = RANGE_BOUNDS.maxZ - 3.5;
  return (
    <group position={[0, WALL_HEIGHT - 1.5, z]}>
      <mesh position={[-0.9, 0.55, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.015, 0.015, 1.1, 6]} />
        <meshStandardMaterial color="#12100c" roughness={0.6} />
      </mesh>
      <mesh position={[0.9, 0.55, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.015, 0.015, 1.1, 6]} />
        <meshStandardMaterial color="#12100c" roughness={0.6} />
      </mesh>

      <mesh raycast={() => null}>
        <boxGeometry args={[2.3, 0.7, 0.12]} />
        <meshStandardMaterial color="#141822" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.065]} raycast={() => null}>
        <planeGeometry args={[2.1, 0.5]} />
        <meshBasicMaterial color="#062227" toneMapped={false} />
      </mesh>

      <Text
        position={[-0.55, 0.03, 0.075]}
        fontSize={0.16}
        color="#00F0FF"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        SCORE
      </Text>
      <Text
        position={[0.55, 0.03, 0.075]}
        fontSize={0.16}
        color="#00F0FF"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.04}
      >
        REMAINING
      </Text>
      <pointLight position={[0, 0, 0.4]} intensity={2.2} color="#00F0FF" distance={3.5} decay={2} />
    </group>
  );
}

export default function RangeEnvironment() {
  return (
    <group>
      <fog attach="fog" args={["#3a3021", 12, 34]} />
      <color attach="background" args={["#241d14"]} />

      <hemisphereLight args={["#f0d9a8", "#2a2013", 0.85]} />
      <ambientLight intensity={0.22} color="#f2d9a3" />
      <pointLight position={[0, WALL_HEIGHT - 0.6, 6]} intensity={20} color="#ffdca0" distance={17} decay={2} />
      <pointLight position={[0, WALL_HEIGHT - 0.6, -4]} intensity={16} color="#ffe8bf" distance={16} decay={2} />
      <pointLight position={[0, WALL_HEIGHT - 0.6, -12]} intensity={14} color="#ffdca0" distance={15} decay={2} />

      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, RANGE_CENTER_Z]} raycast={() => null}>
        <planeGeometry args={[FLOOR_W, FLOOR_L]} />
        <meshStandardMaterial color={CONCRETE} roughness={0.95} />
      </mesh>
      <Grid
        position={[0, 0.01, RANGE_CENTER_Z]}
        args={[FLOOR_W, FLOOR_L]}
        cellSize={0.9}
        cellThickness={0.35}
        cellColor="#8a795d"
        sectionSize={4.5}
        sectionThickness={0.5}
        sectionColor="#6d5f47"
        fadeDistance={26}
        fadeStrength={1.6}
        followCamera={false}
        infiniteGrid={false}
        raycast={() => null}
      />
      <LaneMarkers />

      {/* side walls */}
      <mesh position={[RANGE_BOUNDS.minX - 0.35, WALL_HEIGHT / 2, RANGE_CENTER_Z]} raycast={() => null}>
        <boxGeometry args={[0.3, WALL_HEIGHT, RANGE_LENGTH + 2]} />
        <meshStandardMaterial color={PLASTER} roughness={0.92} />
      </mesh>
      <mesh position={[RANGE_BOUNDS.maxX + 0.35, WALL_HEIGHT / 2, RANGE_CENTER_Z]} raycast={() => null}>
        <boxGeometry args={[0.3, WALL_HEIGHT, RANGE_LENGTH + 2]} />
        <meshStandardMaterial color={PLASTER} roughness={0.92} />
      </mesh>
      {/* low plaster-trim skirting */}
      <mesh position={[RANGE_BOUNDS.minX - 0.19, 0.35, RANGE_CENTER_Z]} raycast={() => null}>
        <boxGeometry args={[0.05, 0.7, RANGE_LENGTH + 2]} />
        <meshStandardMaterial color={PLASTER_TRIM} roughness={0.85} />
      </mesh>
      <mesh position={[RANGE_BOUNDS.maxX + 0.19, 0.35, RANGE_CENTER_Z]} raycast={() => null}>
        <boxGeometry args={[0.05, 0.7, RANGE_LENGTH + 2]} />
        <meshStandardMaterial color={PLASTER_TRIM} roughness={0.85} />
      </mesh>

      {ARCHED_WINDOW_Z.map((z) => (
        <ArchedWindow key={z} z={z} />
      ))}

      {CRATE_POSITIONS.map((crate, i) => (
        <CrateStack key={i} position={crate.position} rotation={crate.rotation} />
      ))}

      <Loft />

      {/* backstop behind the last target, and a wall behind spawn */}
      <mesh position={[0, WALL_HEIGHT / 2, RANGE_BOUNDS.minZ - 0.4]} raycast={() => null}>
        <boxGeometry args={[RANGE_WIDTH + 1, WALL_HEIGHT, 0.4]} />
        <meshStandardMaterial color={PLASTER} roughness={0.92} />
      </mesh>
      <mesh position={[0, WALL_HEIGHT / 2, RANGE_BOUNDS.maxZ + 0.4]} raycast={() => null}>
        <boxGeometry args={[RANGE_WIDTH + 1, WALL_HEIGHT, 0.4]} />
        <meshStandardMaterial color={PLASTER} roughness={0.92} />
      </mesh>

      {/* wood-plank roof deck above the trusses */}
      <mesh position={[0, WALL_HEIGHT + 0.35, RANGE_CENTER_Z]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[FLOOR_W, FLOOR_L]} />
        <meshStandardMaterial color={WOOD_DARK} roughness={0.95} side={DoubleSide} />
      </mesh>
      {TRUSS_Z.map((z) => (
        <TrussFrame key={z} z={z} />
      ))}

      <Scoreboard />
    </group>
  );
}
