import { forwardRef, useImperativeHandle, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const FLASH_LIFETIME = 0.07;

// A point light + a small flash mesh anchored at the barrel tip, fired
// imperatively (via ref) rather than through React state — a shot needs to
// be instantaneous and shouldn't wait on a render cycle. Decays to nothing
// over ~70ms every frame.
const MuzzleFlash = forwardRef(function MuzzleFlash(_props, ref) {
  const lightRef = useRef();
  const meshRef = useRef();
  const materialRef = useRef();
  const life = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      trigger() {
        life.current = FLASH_LIFETIME;
      },
      // The light sits exactly at the local muzzle-tip offset, so it doubles
      // as a convenient anchor for reading that point's world position (used
      // by RangeScene to start a bullet tracer at the true muzzle, not an
      // approximation).
      getWorldPosition(target) {
        if (lightRef.current) lightRef.current.getWorldPosition(target);
        return target;
      }
    }),
    []
  );

  useFrame((_, delta) => {
    if (life.current <= 0) {
      if (lightRef.current && lightRef.current.intensity !== 0) lightRef.current.intensity = 0;
      if (meshRef.current && meshRef.current.visible) meshRef.current.visible = false;
      return;
    }

    life.current = Math.max(0, life.current - delta);
    const t = life.current / FLASH_LIFETIME;

    if (lightRef.current) lightRef.current.intensity = t * 6;
    if (meshRef.current) {
      meshRef.current.visible = true;
      const scale = 0.5 + t * 0.9;
      meshRef.current.scale.setScalar(scale);
    }
    if (materialRef.current) materialRef.current.opacity = t;
  });

  return (
    // Just beyond ProceduralGlock's barrel-tip mesh (z = -0.15, radius
    // 0.025) — negative Z is forward here too, matching WeaponRig's convention.
    <group position={[0, 0.035, -0.18]}>
      <pointLight ref={lightRef} color="#00F0FF" intensity={0} distance={3} decay={2} />
      <mesh ref={meshRef} visible={false}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial ref={materialRef} color="#ECE8E1" transparent opacity={0} toneMapped={false} />
      </mesh>
    </group>
  );
});

export default MuzzleFlash;
