# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers evaluating the site owner (Sean Argie A. Quiteles, a Computer Engineering graduate / full-stack developer) for software developer roles, scanning quickly and deciding whether to shortlist for an interview. [Inferred from cvData.js content and prior repo evidence — user's own answer to this question was about project status ("first version, domain purchase planned") rather than audience, so this is not directly confirmed.]

## Product Purpose

A personal portfolio / CV site that presents the owner's experience, education, projects, and skills in a way that gets him shortlisted for full-stack developer roles. This is the first public version of the site, ahead of buying a custom domain for it.

## Positioning

Full-stack (MERN) development background combined with an unusual research/embedded-systems angle: co-authored, internationally published research on an embedded computer-vision system (cockatiel feather/color-mutation recognition on Raspberry Pi using OpenCV + SqueezeNet, 91.17% accuracy). Most junior full-stack portfolios don't have a published research project to point to — that combination is the differentiator, not just another CRUD-app portfolio.

## Operating Context

Single-page personal site, browsed casually by recruiters/reviewers on both desktop and mobile, likely a brief visit (skim, maybe click through to GitHub/LinkedIn/resume) rather than a returning-user tool.

## Capabilities and Constraints

- Existing stack (confirmed, not to be changed): React 19 + Vite 8, Tailwind CSS 3.4 (`darkMode: "class"`), Framer Motion 12, react-icons, plain JS/JSX (no TypeScript), single-page app (no routing).
- Content is data-driven via `src/data/cvData.js` (personal info, summary, experience, education, projects, skills) — real content, not placeholder.
- GitHub project data is pulled live via `src/hooks/useGithub.js` + `src/services/githubService.js`.
- Dark/light theming is a confirmed requirement, implemented via `src/context/ThemeContext.jsx`.
- Must support both desktop and mobile.

## Brand Commitments

None — fully open. No colors, typography, or name treatment are binding; the current "Midnight" purple-accent visual system is prior work, not a constraint, and may be replaced entirely.

## Evidence on Hand

- Real experience, education, project, and skills content already exists in `src/data/cvData.js` (see also `README.md` for stated project intent).
- One real project has a public source: "Recognition of Feather and Color Mutation on Cockatiels..." (published paper link in `cvData.js`).
- The personal CV site itself is listed as a second "project" in `cvData.js` — that self-referential list entry is existing content, not something to invent.
- A real headshot photo and a real resume PDF exist and will be added by the user directly to `public/` (e.g. as `public/headshot.jpg` and `public/resume.pdf` or similar) — the design should reserve real estate for these and reference them by a clearly-named expected path, not fabricate a placeholder photo/PDF.
- No other assets (logos, testimonials, case studies) exist; do not invent any.

## Product Principles

1. Recruiter-first scanability: the most differentiating facts (the published research, core stack) must be legible in seconds, not buried.
2. The research project is the differentiator — give it real visual weight, not the same treatment as a generic "in progress" project.
3. Real content only — no fabricated testimonials, metrics, employers, or photos beyond what's in `cvData.js` and the assets the user provides.
4. First public version — solid and shippable now (this will go on a real domain), not a placeholder that reads as unfinished.

## Accessibility & Inclusion

No product-specific requirement established beyond general web accessibility good practice (contrast, keyboard/focus, semantic structure).
