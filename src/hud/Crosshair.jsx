// Fixed central crosshair — only rendered while the player is actively
// locked into the range (hidden during the loading screen, pause overlay,
// and section modal, where the real cursor takes over instead).
export default function Crosshair({ visible }) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center" aria-hidden="true">
      <div className="relative h-6 w-6">
        <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan" />
        <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-cyan/70" />
        <span className="absolute bottom-0 left-1/2 h-2 w-px -translate-x-1/2 bg-cyan/70" />
        <span className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-cyan/70" />
        <span className="absolute right-0 top-1/2 h-px w-2 -translate-y-1/2 bg-cyan/70" />
      </div>
    </div>
  );
}
