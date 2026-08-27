import { Component } from "react";

// useGLTF suspends on the pending fetch, then rethrows the rejection on the
// next render once it 404s — Suspense alone can't catch that rejection,
// only a real error boundary can. This is what lets WeaponRig attempt
// /models/glock.glb and fall back to the procedural mesh without ever
// crashing the scene, since no .glb ships with this project.
export default class ModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn(
      "[WeaponRig] /models/glock.glb failed to load — using the procedural fallback mesh.",
      error?.message || error
    );
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
