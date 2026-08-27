import { Check, Circle } from "lucide-react";
import { TARGETS } from "../data/targets";

// Persistent side status tracker — always visible once the player has
// entered the range (even mid-modal), listing all five targets with a
// glowing cyan/emerald checkmark for each one already shot.
export default function RadarHUD({ unlockedIds, visible }) {
  if (!visible) return null;

  return (
    <div className="hud-panel hud-corners fixed right-3 top-1/2 z-30 w-52 -translate-y-1/2 px-4 py-4 sm:right-4">
      <p className="hud-eyebrow mb-3">Range Status</p>
      <ol className="space-y-2.5">
        {TARGETS.map((target) => {
          const cleared = unlockedIds.includes(target.id);
          return (
            <li
              key={target.id}
              className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em]"
            >
              {cleared ? (
                <Check size={13} className="shrink-0 text-emerald" aria-hidden="true" />
              ) : (
                <Circle size={9} className="shrink-0 text-offwhite/30" aria-hidden="true" />
              )}
              <span className={cleared ? "text-emerald" : "text-offwhite/60"}>{target.label}</span>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 border-t border-offwhite/10 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-offwhite/40">
        {unlockedIds.length}/{TARGETS.length} sections cleared
      </div>
    </div>
  );
}
