import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { Crosshair, Radio } from "lucide-react";
import { personal } from "../data/cvData";

// Minimum on-screen duration for the loading sequence, in ms. This project
// has no real assets to load anymore — no GLTF models, no textures,
// everything is procedural geometry — so Three.js's loading manager never
// has anything registered with it, and useProgress() never reports 100%
// (there's nothing to finish). It's still read below for display/flavor
// (in case the 3D Text labels' font loading ever registers with it), but
// the actual "ready" gate is this cosmetic timer alone. It used to also
// require useProgress() to hit 100%, back when glock.glb's fetch-then-404
// was the one thing that ever completed and opened that gate — removing
// that file removed the only thing making that condition ever become true,
// which is what got the loading screen stuck.
const MIN_DISPLAY_MS = 1500;
// How many animated bars to draw in the decorative audio-visualizer row.
const VISUALIZER_BARS = 16;

// Full-screen loading screen shown before the player enters the range; fills a progress bar and reveals an "Enter" button once ready.
export default function LoadingScreen({ visible, onEnter }) {
  // Reads Three.js's real asset-loading progress (mostly unused here, see the note above).
  const { progress: realProgress } = useProgress();
  // Tracks the cosmetic "floor" progress value driven purely by a timer, so the bar always fills up over MIN_DISPLAY_MS.
  const [floor, setFloor] = useState(0);

  // While the loading screen is visible, animate the cosmetic floor value up to 100% over MIN_DISPLAY_MS using requestAnimationFrame.
  useEffect(() => {
    if (!visible) return undefined;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      setFloor(Math.min(100, (elapsed / MIN_DISPLAY_MS) * 100));
      if (elapsed < MIN_DISPLAY_MS) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  // Don't render the loading screen at all once it's no longer needed.
  if (!visible) return null;

  // Derived directly from the real useProgress() value and the cosmetic
  // floor ramp — both are already monotonically increasing on their own,
  // so no extra state/effect is needed just to combine them.
  const display = Math.min(100, Math.max(realProgress, floor));
  // Gated on the cosmetic floor alone, not realProgress/active — with no
  // real assets left to load, those never resolve to "done" on their own.
  const ready = floor >= 100;
  // Round the display percentage to a whole number for the on-screen label.
  const wholePercent = Math.round(display);

  // Renders the full loading screen layout: background grid, title, visualizer, progress bar, and enter button.
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy text-offwhite px-6">
      {/* Decorative faint grid pattern in the background. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(#00F0FF 1px, transparent 1px), linear-gradient(90deg, #00F0FF 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        {/* Small status label shown above the main title. */}
        <div className="hud-eyebrow flex items-center gap-2 mb-3">
          <Radio size={14} className="text-cyan" aria-hidden="true" />
          TACTICAL ACCESS // INITIALIZING
        </div>

        {/* Site title and the person's name/title. */}
        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-[0.05em] mb-1">
          Firing Range
        </h1>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-offwhite/60 mb-10">
          {personal.name} &middot; {personal.title}
        </p>

        {/* Row of animated bars that light up progressively as loading progress increases — purely decorative. */}
        <div className="w-full flex items-end justify-center gap-[3px] h-10 mb-6" aria-hidden="true">
          {Array.from({ length: VISUALIZER_BARS }, (_, i) => (
            <span
              key={i}
              className="w-1.5 bg-cyan/70"
              style={{
                height: `${18 + ((i * 37) % 82)}%`,
                animation: `range-ping 1.1s ease-in-out ${(i % 8) * 0.09}s infinite`,
                opacity: display > (i / VISUALIZER_BARS) * 100 ? 1 : 0.15
              }}
            />
          ))}
        </div>

        {/* Numeric percentage label and the actual progress bar that fills according to `display`. */}
        <div className="w-full mb-2 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-offwhite/70">
          <span>Loading assets</span>
          <span className="text-cyan tabular-nums">{wholePercent}%</span>
        </div>
        <div className="w-full h-2 border border-cyan/30 bg-charcoal/80 mb-10 overflow-hidden">
          <div
            className="h-full bg-cyan transition-[width] duration-150 ease-out"
            style={{ width: `${display}%` }}
          />
        </div>

        {/* Show an active "Enter Range" button once ready, otherwise a disabled-looking "Standby" placeholder. */}
        {ready ? (
          <button
            type="button"
            onClick={onEnter}
            className="tactical-btn text-base px-8 py-3.5"
          >
            <Crosshair size={18} aria-hidden="true" />
            Lock In / Enter Range
          </button>
        ) : (
          <div className="tactical-btn text-base px-8 py-3.5 opacity-30 pointer-events-none select-none">
            <Crosshair size={18} aria-hidden="true" />
            Standby
          </div>
        )}

        {/* Quick reminder of the game controls. */}
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-offwhite/40">
          WASD move &middot; mouse look &middot; click to fire
        </p>
      </div>
    </div>
  );
}
