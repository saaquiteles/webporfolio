/** @type {import('tailwindcss').Config} */

// Tailwind can only apply the `/opacity` class modifier (e.g. `bg-cyan/70`)
// to colors it can decompose into RGB channels at build time. Since these
// tokens are driven by CSS custom properties (so the same class names keep
// working if the palette ever needs to move), each variable holds
// space-separated "R G B" channels and this helper wraps it in the
// documented Tailwind pattern for opacity-aware custom-property colors.
function withOpacity(variable) {
  return ({ opacityValue }) =>
    opacityValue === undefined ? `rgb(var(${variable}))` : `rgb(var(${variable}) / ${opacityValue})`;
}

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: withOpacity("--color-navy"),
        charcoal: withOpacity("--color-charcoal"),
        crimson: withOpacity("--color-crimson"),
        cyan: withOpacity("--color-cyan"),
        emerald: withOpacity("--color-emerald"),
        offwhite: withOpacity("--color-offwhite")
      },
      fontFamily: {
        display: ["Rajdhani", "Segoe UI", "sans-serif"],
        mono: ["Share Tech Mono", "IBM Plex Mono", "ui-monospace", "monospace"]
      }
    }
  },
  plugins: []
};
