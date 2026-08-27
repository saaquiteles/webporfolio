import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils } from "three";
import useKeyboardControls from "../hooks/useKeyboardControls";
import { EYE_HEIGHT, MOVE_SPEED, RANGE_BOUNDS } from "./rangeConstants";

const JUMP_IMPULSE = 8; // Adjust for jump height
const GRAVITY = 25;       // Adjust for gravity strength

export default function FirstPersonRig({ controlsRef, active }) {
  const { camera } = useThree();
  const keys = useKeyboardControls();
  
  // Track vertical velocity across frames
  const yVelocity = useRef(0);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!active || !controls) return;

    const step = MOVE_SPEED * delta;
    const { forward, backward, left, right, jump } = keys.current;

    // Horizontal Movement
    if (forward) controls.moveForward(step);
    if (backward) controls.moveForward(-step);
    if (right) controls.moveRight(step);
    if (left) controls.moveRight(-step);

    // Jump Impulse (only when on the ground)
    const isGrounded = camera.position.y <= EYE_HEIGHT;
    if (jump && isGrounded) {
      yVelocity.current = JUMP_IMPULSE;
    }

    // Apply Gravity and Update Vertical Position
    if (!isGrounded || yVelocity.current > 0) {
      yVelocity.current -= GRAVITY * delta;
      camera.position.y += yVelocity.current * delta;
    }

    // Ground Collision Floor
    if (camera.position.y < EYE_HEIGHT) {
      camera.position.y = EYE_HEIGHT;
      yVelocity.current = 0;
    }

    // Horizontal Bounds Clamping
    camera.position.x = MathUtils.clamp(camera.position.x, RANGE_BOUNDS.minX, RANGE_BOUNDS.maxX);
    camera.position.z = MathUtils.clamp(camera.position.z, RANGE_BOUNDS.minZ, RANGE_BOUNDS.maxZ);
  });

  return null;
}