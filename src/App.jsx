import { useCallback, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import RangeScene from "./three/RangeScene";
import LoadingScreen from "./hud/LoadingScreen";
import Crosshair from "./hud/Crosshair";
import RadarHUD from "./hud/RadarHUD";
import SectionModal from "./hud/SectionModal";
import PauseOverlay from "./hud/PauseOverlay";
import { unlockAudio } from "./audio/audioEngine";

// The whole site is one persistent 3D firing range — no scroll sections.
// The Canvas mounts immediately (so useProgress/useGLTF have real work to
// report on) but stays hidden behind the tactical loading screen until the
// visitor clicks "LOCK IN", at which point pointer lock engages and the
// HUD (crosshair, radar, section modals) takes over.
function App() {
  // Tracks whether the visitor has clicked past the loading screen into the 3D scene.
  const [entered, setEntered] = useState(false);
  // Tracks whether the mouse pointer is currently locked to the canvas (i.e. actively aiming/moving).
  const [isLocked, setIsLocked] = useState(false);
  // Tracks which target IDs have been shot so far, so the radar and section list know what's unlocked.
  const [unlockedIds, setUnlockedIds] = useState([]);
  // Tracks which section's modal (if any) is currently open after a target hit.
  const [activeModalId, setActiveModalId] = useState(null);
  // Holds a reference to the pointer-lock controls so they can be locked/unlocked imperatively from outside the 3D scene.
  const controlsRef = useRef(null);

  // Runs when the visitor clicks "LOCK IN": unmutes audio, marks the app as entered, and engages pointer lock.
  const handleEnter = useCallback(() => {
    // Web Audio requires a real user gesture to unmute — this click is it.
    unlockAudio();
    setEntered(true);
    controlsRef.current?.lock();
  }, []);

  // Keeps isLocked in sync whenever the browser's pointer lock state changes.
  const handleLockChange = useCallback((locked) => {
    setIsLocked(locked);
  }, []);

  // Runs when a target is shot: records it as unlocked, releases the pointer lock, and opens its section modal.
  const handleTargetHit = useCallback((id) => {
    setUnlockedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    controlsRef.current?.unlock();
    setActiveModalId(id);
  }, []);

  // Closes the currently open section modal and re-engages pointer lock to return to the range.
  const handleCloseModal = useCallback(() => {
    setActiveModalId(null);
    controlsRef.current?.lock();
  }, []);

  // Re-engages pointer lock when the visitor resumes from the pause overlay.
  const handleResume = useCallback(() => {
    controlsRef.current?.lock();
  }, []);

  // True only when the visitor has entered but isn't actively locked-in or viewing a modal, i.e. when the pause overlay should show.
  const showPause = entered && !isLocked && !activeModalId;

  return (
    <div className="relative h-full w-full overflow-hidden bg-navy">
      <Canvas shadows={false} dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <RangeScene
          entered={entered}
          isLocked={isLocked}
          unlockedIds={unlockedIds}
          onLockChange={handleLockChange}
          onTargetHit={handleTargetHit}
          controlsRef={controlsRef}
        />
      </Canvas>

      <LoadingScreen visible={!entered} onEnter={handleEnter} />
      <Crosshair visible={entered && isLocked} />
      <RadarHUD unlockedIds={unlockedIds} visible={entered && !activeModalId} />
      <SectionModal sectionId={activeModalId} onClose={handleCloseModal} />
      {showPause && <PauseOverlay onResume={handleResume} />}
    </div>
  );
}

export default App;
