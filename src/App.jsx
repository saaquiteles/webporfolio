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
  const [entered, setEntered] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [unlockedIds, setUnlockedIds] = useState([]);
  const [activeModalId, setActiveModalId] = useState(null);
  const controlsRef = useRef(null);

  const handleEnter = useCallback(() => {
    // Web Audio requires a real user gesture to unmute — this click is it.
    unlockAudio();
    setEntered(true);
    controlsRef.current?.lock();
  }, []);

  const handleLockChange = useCallback((locked) => {
    setIsLocked(locked);
  }, []);

  const handleTargetHit = useCallback((id) => {
    setUnlockedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    controlsRef.current?.unlock();
    setActiveModalId(id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModalId(null);
    controlsRef.current?.lock();
  }, []);

  const handleResume = useCallback(() => {
    controlsRef.current?.lock();
  }, []);

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
