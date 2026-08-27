import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { Crosshair, Radio } from "lucide-react";
import { personal } from "../data/cvData";

// Minimum on-screen duration for the loading sequence, in ms. This project
// has almost nothing to actually load (one attempted GLTF fetch that 404s
// almost instantly, plus font/SDF setup for the 3D Text labels) — without a
// cosmetic floor, useProgress would flash from 0 to 100 in a single frame
// and the tactical loading screen would never really be seen. The real
// useProgress() value still gates "LOCK IN" — this only sets a minimum, it
// never fakes 100% ahead of the real assets actually settling.
const MIN_DISPLAY_MS = 1500;
const VISUALIZER_BARS = 16;

export default function LoadingScreen({ visible, onEnter }) {
  const { progress: realProgress, active } = useProgress();
  const [floor, setFloor] = useState(0);

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

  if (!visible) return null;

  // Derived directly from the real useProgress() value and the cosmetic
  // floor ramp — both are already monotonically increasing on their own,
  // so no extra state/effect is needed just to combine them.
  const display = Math.min(100, Math.max(realProgress, floor));
  const ready = display >= 100 && realProgress >= 100 && !active;
  const wholePercent = Math.round(display);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-navy text-offwhite px-6">
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
        <div className="hud-eyebrow flex items-center gap-2 mb-3">
          <Radio size={14} className="text-cyan" aria-hidden="true" />
          TACTICAL ACCESS // INITIALIZING
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-[0.05em] mb-1">
          Firing Range
        </h1>
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-offwhite/60 mb-10">
          {personal.name} &middot; {personal.title}
        </p>

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

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-offwhite/40">
          WASD move &middot; mouse look &middot; click to fire
        </p>
      </div>
    </div>
  );
}
