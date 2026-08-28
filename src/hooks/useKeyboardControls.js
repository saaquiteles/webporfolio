import { useEffect, useRef } from "react";

// Maps raw keyboard event codes to the movement action they trigger (e.g. "KeyW" and "ArrowUp" both mean "forward").
const KEY_MAP = {
  KeyW: "forward",
  ArrowUp: "forward",
  KeyS: "backward",
  ArrowDown: "backward",
  KeyA: "left",
  ArrowLeft: "left",
  KeyD: "right",
  ArrowRight: "right",
  Space: "jump"
};

// A ref-backed WASD/arrow-key tracker — deliberately not React state, since
// it's read every animation frame by FirstPersonRig and doesn't need to
// trigger re-renders on every keystroke.
export default function useKeyboardControls() {
  // Stores the current pressed/released state of each movement key, mutated directly instead of via setState.
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false
  });

  // Registers window-level keyboard/blur listeners on mount and removes them again on unmount.
  useEffect(() => {
    // Marks the matching action as "pressed" when its key goes down.
    const handleKeyDown = (event) => {
      const action = KEY_MAP[event.code];
      if (action) keys.current[action] = true;
    };
    // Marks the matching action as "released" when its key goes up.
    const handleKeyUp = (event) => {
      const action = KEY_MAP[event.code];
      if (action) keys.current[action] = false;
    };
    // Also release all keys if the window loses focus mid-press (e.g. the
    // browser's own pointer-lock-exit prompt stealing focus), so a stuck
    // "forward" key can't keep the camera drifting.
    const handleBlur = () => {
      keys.current.forward = false;
      keys.current.backward = false;
      keys.current.left = false;
      keys.current.right = false;
      keys.current.jump = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return keys;
}