import { Crosshair } from "lucide-react";

// Shown whenever the player is inside the range but not pointer-locked and
// no section modal is open — e.g. they pressed the browser's own Escape to
// exit pointer lock mid-walk rather than hitting a target. Re-locking must
// come from a fresh click (browsers require a real user gesture), so this
// is the "click to resume" affordance for that path.
export default function PauseOverlay({ onResume }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy/70 backdrop-blur-sm">
      <div className="hud-panel hud-corners flex max-w-xs flex-col items-center px-8 py-8 text-center">
        <p className="hud-eyebrow mb-3">Training Paused</p>
        <h2 className="mb-3 text-xl">Pointer Unlocked</h2>
        <p className="mb-6 font-mono text-xs text-offwhite/60">
          Mouse look is disengaged. Resume to keep clearing targets down the range.
        </p>
        <button type="button" onClick={onResume} className="tactical-btn">
          <Crosshair size={16} aria-hidden="true" />
          Resume Training
        </button>
      </div>
    </div>
  );
}
