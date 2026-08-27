import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";
import useKeyboardControls from "../hooks/useKeyboardControls";
import { EYE_HEIGHT, MOVE_SPEED, RANGE_BOUNDS } from "./rangeConstants";

// WASD movement with simple AABB position clamping — no rigid-body physics.
// three-stdlib's PointerLockControls already exposes moveForward/moveRight
// helpers that flatten to the horizontal plane using the camera's own
// right/up vectors, so we lean on those instead of re-deriving basis
// vectors by hand, then clamp the result to the range floor each frame.
export default function FirstPersonRig({ controlsRef, active }) {
  const { camera } = useThree();
  const keys = useKeyboardControls();

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!active || !controls) return;

    const step = MOVE_SPEED * delta;
    const { forward, backward, left, right } = keys.current;

    if (forward) controls.moveForward(step);
    if (backward) controls.moveForward(-step);
    if (right) controls.moveRight(step);
    if (left) controls.moveRight(-step);

    camera.position.x = MathUtils.clamp(camera.position.x, RANGE_BOUNDS.minX, RANGE_BOUNDS.maxX);
    camera.position.z = MathUtils.clamp(camera.position.z, RANGE_BOUNDS.minZ, RANGE_BOUNDS.maxZ);
    camera.position.y = EYE_HEIGHT;
  });

  return null;
}
