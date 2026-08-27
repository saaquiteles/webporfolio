import { useGLTF } from "@react-three/drei";

// Attempts to load a real weapon model from /models/glock.glb. No such file
// ships with this project — useGLTF will suspend while the fetch is
// in-flight (handled by WeaponRig's <Suspense fallback={<ProceduralGlock />}>)
// and then throw the 404 on the next render, which WeaponRig's
// ModelErrorBoundary catches to render the same procedural fallback. If a
// real glock.glb is ever dropped into public/models/, this component picks
// it up automatically with no other code changes required.
export default function GlockModel(props) {
  const { scene } = useGLTF("/models/glock.glb");
  return <primitive object={scene} {...props} />;
}
