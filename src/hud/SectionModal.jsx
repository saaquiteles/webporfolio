import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { PANELS } from "./panels";
import { modalIn } from "../utils/motion";
import { playUiBlip } from "../audio/audioEngine";

// The glassmorphism credential panel that slides in once a target is hit.
// Pointer lock is already released by the time this mounts (App.jsx exits
// it as part of the hit handler) — closing here (button click or Escape)
// re-engages it via onClose.
export default function SectionModal({ sectionId, onClose }) {
  // Look up which panel (About, Skills, Projects, etc.) to display for the currently active section id.
  const panel = sectionId ? PANELS[sectionId] : null;

  // When a panel opens, play a sound effect and start listening for the Escape key so pressing it closes the modal.
  useEffect(() => {
    if (!panel) return undefined;
    playUiBlip(true);
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [panel, onClose]);

  // Grab the icon component for the current panel, if one is set.
  const Icon = panel?.icon;

  // Animates the modal sliding in and out, only rendering it while a panel is actually selected.
  return (
    <AnimatePresence>
      {panel && (
        <motion.div
          key={sectionId}
          role="dialog"
          aria-modal="true"
          aria-labelledby="section-modal-title"
          className="fixed inset-y-0 right-0 z-40 flex w-full flex-col sm:w-[440px] md:w-[480px]"
          variants={modalIn}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div
            className="hud-corners m-3 flex flex-1 flex-col overflow-hidden border border-cyan/30 backdrop-blur-md sm:m-4"
            style={{ background: "var(--glass)" }}
          >
            {/* Header showing the panel's subtitle, title, and icon. */}
            <div className="flex items-start justify-between gap-4 border-b border-cyan/20 px-5 pb-4 pt-5 sm:px-6">
              <div>
                <p className="hud-eyebrow mb-1">{panel.subtitle}</p>
                <h2 id="section-modal-title" className="text-xl sm:text-2xl">
                  {panel.title}
                </h2>
              </div>
              {Icon && <Icon size={22} className="mt-1 shrink-0 text-crimson" aria-hidden="true" />}
            </div>

            {/* Renders the actual content component for the selected section (About, Skills, Projects, etc.). */}
            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              <panel.Component />
            </div>

            {/* Button that closes the modal, playing a sound and re-engaging pointer lock. */}
            <div className="border-t border-cyan/20 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => {
                  playUiBlip(false);
                  onClose();
                }}
                className="tactical-btn w-full justify-center"
              >
                <X size={16} aria-hidden="true" />
                Resume Training [ESC]
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
