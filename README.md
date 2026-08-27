***

# 🎯 Web Portfolio v3.0

A personal portfolio reimagined as a 3D first-person tactical firing range, inspired by Valorant's Range/Practice Facility. Visitors walk the range, mouse-look and shoot floating holographic targets to unlock real resume sections — built to showcase full-stack development work, led by a published, internationally peer-reviewed research project in embedded computer vision.

## 🚀 Technical Stack

* **Framework**: [React 19](https://reactjs.org/) on [Vite](https://vitejs.dev/)
* **3D / Engine**: [Three.js](https://threejs.org/) via [React Three Fiber](https://r3f.docs.pmnd.rs/) and [drei](https://github.com/pmndrs/drei) — all geometry is primitive/procedural, no imported 3D model or texture assets
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) with a custom design-token system for the tactical HUD
* **Animations**: [Framer Motion](https://www.framer.com/motion/) for HUD transitions (loading screen, modals, theme-style swaps)
* **Icons**: [Lucide](https://lucide.dev/)
* **Audio**: procedural Web Audio (gunshots, impacts, UI cues) — no external audio files

## ✨ The Range

* **Tactical loading screen**: an asset-progress readout with a "LOCK IN" button that engages pointer lock and unmutes audio.
* **First-person controls**: WASD movement with floor-bound clamping, mouse-look via Pointer Lock, and a fixed crosshair.
* **Weapon system**: a procedurally modeled sidearm with per-shot recoil (kick + dip), a muzzle flash, a bullet tracer streaking to wherever the shot lands, and a procedural gunshot cue — fires anywhere in the range, not just on a target.
* **Interactive targets**: five floating holographic targets down the range, each mapped to a real resume section. Shooting one unlocks it, marks it on the radar HUD, and opens a glassmorphism panel with real content.
* **The range itself**: a warm industrial warehouse shell — exposed wood-truss roof with cross-bracing, tan plaster walls, crates, arched windows, a raised loft, amber floor guide lines, and a suspended tactical-cyan scoreboard prop.

## 🗂️ Resume Sections (shoot to unlock)

* **01 // About Me** — bio, name, title, location.
* **02 // Technical Skills** — categorized skill badges.
* **03 // Featured Projects** — real projects, including the published research below, with links.
* **04 // Work Experience** — deployments, education, credentials, and field excursions.
* **05 // Contact** — real email, phone, LinkedIn, GitHub, resume download, and a `mailto:`-based quick-message action.

## 🛠️ Featured Project

* **[Recognition of Feather and Color Mutation on Cockatiels via Raspberry Pi Using OpenCV and SqueezeNet](https://ebooks.iospress.nl/doi/10.3233/ATDE251126)** — a real-time image classification system (91.17% accuracy) ensembling Haar Cascade and SqueezeNet CNN for embedded, resource-constrained inference. Internationally published research.

## 🔧 Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/saaquiteles/webporfolio.git
    ```
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Run in development mode**:
    ```bash
    npm run dev
    ```
4.  **Build for production**:
    ```bash
    npm run build
    ```

> Note: this is a desktop, mouse-and-keyboard experience (Pointer Lock API) — there's no mobile/touch fallback.

---

**Sean Argie A. Quiteles** *Computer Engineering @ Mapúa University (Class of 2026)*
[LinkedIn](https://www.linkedin.com/in/saaquiteles) · [GitHub](https://github.com/saaquiteles)
