// Drawer-glide easing: slow to start, decisive settle — reused everywhere
// something in the HUD "deploys" into view (a section modal sliding in, a
// list row inside a panel), so the whole interface shares one motion
// signature instead of every component inventing its own timing curve.
export const drawerEase = [0.16, 1, 0.3, 1];

// A Framer Motion variant that fades an element in while it slides up slightly, from hidden to visible.
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: drawerEase }
  }
};

// Used for rows/tags/cards inside a panel — slides in from the left like a
// drawer being drawn out, rather than just fading up.
export const drawerIn = {
  hidden: { opacity: 0, x: -18, y: 6 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.55, ease: drawerEase }
  }
};

// The section modal itself — slides in from the right edge of the HUD, the
// same drawer-glide curve applied to the panel as a whole.
export const modalIn = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: drawerEase }
  },
  exit: {
    opacity: 0,
    x: 40,
    transition: { duration: 0.25, ease: drawerEase }
  }
};

// Builds a Framer Motion variant that staggers its children's entrance animations one after another instead of all at once.
export const stagger = (staggerChildren = 0.08, delayChildren = 0.1) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren }
  }
});
