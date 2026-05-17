# NIELLESS.COM v3.3 — BUILD ROADMAP
## Production release: single-page optical portfolio

**Status**: `IN PROGRESS` | **Last updated**: 2026-05-18 | **Owner**: Nielless  
**Target release**: `v3.3.0` — one URL, every section works, no placeholder mechanics  

**Permanent docs (only these two)**: this file + `nielless-portfolio-design-spec-v3.html`.  
`cursor-plan.md` is an **ephemeral handoff** for the next coding session — not ground truth; do not treat gaps there as authoritative.

---

## How to use this document

| Role | Rule |
|------|------|
| **This file** | Single source of truth for *what ships* in v3.3, build order (M0–M6), scroll math, data models, SEO copy, z-index |
| **`nielless-portfolio-design-spec-v3.html`** | Visual + interaction reference (Rev 3.3) — do not implement deferred items because they appear in the spec |
| **`cursor-plan.md`** | Optional session handoff only; superseded by this file + spec HTML for formulas, DoD, and copy |
| **Agents / contributors** | Finish the current milestone’s **Definition of Done** before starting the next. No parallel “half features” |

**Release philosophy**: Ship a **narrow, finished** page. Depth beats breadth. If a mechanic cannot be completed and tested in one milestone, it moves to **Deferred**, not into the active step list.

**Naming (v3.3)**: The projects section is **The Darkroom** (`#darkroom`), not “Engine”. Legacy `#engine` and `/engine` redirect to `#darkroom`.

---

## v3.3 scope summary

### Ships in v3.3 (must work in production)

- Design tokens, self-hosted fonts, static film grain, reduced-motion baseline  
- **Single route** (`/`) with four sections: **Hero → Darkroom → Blueprint → Contact**  
- Minimal site chrome: text mark + skip link + anchor `DARKROOM` (**no mode-dial navigation** — deferred)  
- Hero boot sequence (focus hunt + viewfinder brackets) with instant fallback when `prefers-reduced-motion`  
- **The Darkroom**: horizontal camera-negative film strip — vertical scroll scrubs strip (desktop); `[ DEVELOP ]` opens positive print modal; `ScrollHint` sitewide  
- Blueprint: contact-sheet timeline + `$ current --stack` panel driven by `src/data/timeline.ts`  
- Contact: **mailto + LinkedIn/GitHub/resume links** (no backend form in v3.3)  
- Site footer + SEO metadata  
- Responsive layout (320px–1440px), keyboard nav, Lighthouse ≥ 90 (stretch 95)

### Explicitly deferred (do not partially build)

| Item | Reason |
|------|--------|
| Mode-dial nav (P / A / M / ISO) | Replaced later with a proper section nav; anchor jump links only for v3.3 |
| Viewfinder schematic cards (2-col Engine grid) | **Superseded** by film negative reel (Section [04] Darkroom) |
| Scroll-to-DSLR 3D sequence + flash reveal | High complexity; easy to ship broken; not required for a credible portfolio |
| `ApertureRing` / `ExposureMeter` | Decorative scroll chrome; defer until single-page core is stable |
| `ShutterOverlay` section wipes | Defer with mode dial / section transitions |
| Custom reticle cursor | Desktop polish only; defer |
| Mechanical Web Audio | Opt-in layer; defer |
| Hot-shoe “hold to fire” CTA | Defer with shutter overlay |
| Multi-route `/engine`, `/blueprint` | Consolidate to `/`; `/engine` → `/#darkroom` redirect |

Reference deferred designs in spec sections 02–03, 06–07 when planning v3.2+.

---

## Architecture (v3.3)

```
Framework:     Next.js App Router (existing project version)
Language:      TypeScript strict
Styling:       CSS Modules + CSS custom properties only
Animation:     CSS @keyframes (boot, brass gate wipe); JS scroll scrub (useFilmScroll)
Data:          src/data/projects.ts (negativeSummary + printDetails), src/data/timeline.ts
Deploy:        Vercel
```

**Banned**: Tailwind, Framer Motion, GSAP, Lenis, Three.js, inline `style={{}}` (except setting CSS variables on `documentElement` if ever needed).

**Scroll scrub (desktop)** — canonical formulas (copy verbatim into `useFilmScroll.ts`; also in spec Section [04]):

| Token | Formula / value |
|-------|-----------------|
| `frameWidth` | `clamp(280px, 72vw, 420px)` per negative (incl. gap) — layout only |
| `leaderWidth` | `200px` per `LeaderTape` — layout only |
| `stripWidth` | DOM `scrollWidth` of `.film-reel` (measure after layout) |
| `viewportWidth` | sticky inner width of `.darkroom-viewport` (not `100vw`; subtract page padding) |
| `maxTravel` | `max(0, stripWidth − viewportWidth)` — **horizontal** pixels the reel may move |
| `scrollTrackHeight` | `maxTravel + window.innerHeight` — **vertical** height of `#darkroom` scroll track (CSS `min-height` on track element) |
| `scrubRange` | `scrollTrackHeight − window.innerHeight` — vertical scroll span that maps 0→1 progress |

**Naming lock:** `maxTravel` is horizontal travel (`stripWidth − viewportWidth`). Do **not** reuse the name `trackHeight` for horizontal distance — that causes agents to clamp `scrollY` against pixel widths and produces jank.

While `#darkroom` track is in view (sticky viewport active):

```text
trackTop      = darkroomTrack.getBoundingClientRect().top
progress      = clamp(0, 1, (-trackTop) / scrubRange)
translateX    = -(progress * maxTravel)
```

Equivalent (document coordinates — use only if `trackTop` unavailable):

```text
sectionTop    = darkroomTrack.offsetTop
progress      = clamp(0, 1, (window.scrollY - sectionTop) / scrubRange)
translateX    = -(progress * maxTravel)
```

`clamp(lo, hi, v)` = `Math.min(hi, Math.max(lo, v))`.

**Endpoints:** `progress === 0` → first frame left-aligned in viewport; `progress === 1` → last frame fully in view (strip fully advanced).

**Apply:** `filmReel.style.transform = \`translate3d(${translateX}px, 0, 0)\`` — rAF-throttled `scroll` listener; one write per frame.  
**Resize:** `ResizeObserver` on track + strip recalculates `stripWidth`, `maxTravel`, `scrollTrackHeight`, `scrubRange`.  
**Banned:** CSS `animation-timeline: scroll()` as primary (conflicts with `position: sticky`).

**Brass gate wipe (modal open)** — lock before M3.4 (full keyframes in spec Section [04]):

On `[ DEVELOP ]`, the modal **does not slide in**. The overlay mounts at full size immediately (`z-index: 500`, backdrop `rgba(6,6,8,0.94)`). The positive print (`.print-content`, `z-index: 1`) is already in the DOM beneath the gate but held at `opacity: 0`. A full-viewport `.print-wipe` layer (`z-index: 2`, `pointer-events: none`) animates: a **1px brass vertical bar** at the leading edge of a `scaleX(0→1)` curtain sweeps **left → right** across the viewport in **180ms** (`ease-out`), then the wipe layer fades out (`opacity → 0` by 100% keyframe). **160ms** after open, `.print-content` fades in over **120ms**. The operator sees a projector gate pass, then the developed print — not a drawer or horizontal slide of the panel.

```css
@keyframes brassGateWipe {
  0%   { transform: scaleX(0); transform-origin: left; opacity: 1; }
  70%  { transform: scaleX(1); transform-origin: left; opacity: 1; }
  100% { transform: scaleX(1); opacity: 0; }
}
.print-wipe {
  position: absolute; inset: 0; z-index: 2;
  background: linear-gradient(90deg, var(--brass) 0%, var(--brass) 1px, transparent 1px);
  animation: brassGateWipe 180ms ease-out forwards;
}
.print-content {
  position: relative; z-index: 1; opacity: 0;
  animation: printFadeIn 120ms ease 160ms forwards;
}
@keyframes printFadeIn { from { opacity: 0; } to { opacity: 1; } }
```

`prefers-reduced-motion`: skip wipe; `.print-content { opacity: 1 }` immediately. Distinct from deferred Section [02] shutter overlay (section transitions).

**Z-index stack (v3.3)** — production decision: **grain at 50**, not `9999` and not modal `isolation` as the fix:

| Layer | z-index | Notes |
|-------|---------|--------|
| Skip link | 10000 | Focusable; above all chrome |
| Positive print modal | 500 | Full-screen overlay; focus trap |
| Site header | 100 | Sticky top bar |
| Film grain (`body::after`) | **50** | Decorative; `pointer-events: none`; above page content, below chrome + modal |
| Scroll hint | 90 | Fixed bottom-right |
| Page content | 1 | `.page-wrap`, sections |
| Deferred hero flash | 9999 | Specimen only — not shipped in v3.3 |

Spec HTML `body::after` was `9999` (blocked modals). **Ship grain at 50** in `globals.css` — passive texture over content, always under modal (500) and header (100). Do not rely on `isolation: isolate` on the modal for grain stacking.

**File structure target** (delete or merge legacy files as steps complete):

```
src/
├── app/
│   ├── layout.tsx          # grain, skip link, SiteHeader, Footer, ScrollHint
│   ├── page.tsx            # #hero → #darkroom → #blueprint → #contact
│   └── globals.css         # tokens, keyframes, reduced-motion, brass wipe
├── components/
│   ├── SiteHeader.tsx      # DARKROOM · BLUEPRINT · CONTACT anchors
│   ├── HeroBoot.tsx
│   ├── SectionShell.tsx
│   ├── ScrollHint.tsx
│   ├── projects/
│   │   ├── DarkroomSection.tsx
│   │   ├── FilmStrip.tsx
│   │   ├── FilmNegative.tsx
│   │   ├── LeaderTape.tsx
│   │   ├── PositivePrintModal.tsx
│   │   └── useFilmScroll.ts
│   ├── ContactSheet.tsx
│   ├── StackPanel.tsx
│   ├── ContactSection.tsx
│   └── Footer.tsx
├── data/
│   ├── projects.ts
│   └── timeline.ts
└── lib/
    └── reducedMotion.ts
```

**Deprecate when Darkroom ships**: `ViewfinderCard.tsx`, `SchematicGrid.tsx`, `Visualizations.tsx` (if present).

---

## PROGRESS TRACKER

| Milestone | Deliverable | Status | Commit |
|-----------|-------------|--------|--------|
| M0 | Baseline & repo hygiene | ✅ | `9ad56ea` |
| M1 | Design system + layout shell | ⬜ | |
| M2 | Hero boot (finished) | ⬜ | |
| M3 | The Darkroom — film negative reel | ⬜ | |
| M4 | Blueprint section (finished) | ⬜ | |
| M5 | Contact + footer (finished) | ⬜ | |
| M6 | Release hardening (a11y, mobile, Lighthouse) | ⬜ | |

**Legend**: `🟡` In progress | `✅` Complete | `⬜` Not started | `🚫` Blocked

---

## Milestone M0 — Baseline & repo hygiene

**Goal**: Clean tree, build passes, legacy routes removed from the critical path.

### Tasks

- [x] `npm uninstall framer-motion` (and any other banned deps if present)
- [x] Remove unused legacy components: `PageTransition`, `VibrationChamber`, `Visualizations`, `AnalogPanel`, multi-page-only wrappers — or leave files but ensure **nothing in `app/` imports them**
- [x] Delete or redirect `/engine` → `/#darkroom` and `/blueprint` → `/#blueprint` (301 or remove `page.tsx` under those folders)
- [x] `npm run build` && `npm run lint` pass with zero errors
- [x] Grep gates:
  - `grep -r "framer-motion\|gsap\|lenis" src/` → empty
  - `grep -r "style={{" src/` → empty (use CSS Modules)

### Definition of Done

- [x] Visiting `/` is the only user-facing portfolio route  
- [x] `npm run build` succeeds  
- [x] No banned dependencies in `package.json`

**Commit**: `chore(v3.1): baseline cleanup and single-route prep`  

**Verified**: 2026-05-17 — `npm run build`, `npm run lint`, grep gates, single `app/page.tsx`, redirects in `next.config.ts`. Tracker SHA: `235d372`

---

## Milestone M1 — Design system + layout shell

**Spec ref**: Section 01 (Design System), Section 08 (tokens only)

### M1.1 `src/app/globals.css`

- [x] Tokens: `--void` … `--muted2`, `--display`, `--mono`, `--serif`
- [x] Layout tokens: `--page-max: 1100px`, `--page-pad: 36px`, `--section-gap: 80px`, `--card-pad: 20px`
- [x] `@font-face` for Bebas Neue, JetBrains Mono (300/400/500), Crimson Pro (400/400i/600) — WOFF2 in `public/fonts/`
- [x] Global reset + `body` typography (mono 13px, `--dust` on `--void`)
- [x] Static grain: `body::after` with SVG `feTurbulence`, `opacity: 0.03`, `z-index: 50`, `pointer-events: none` (see z-index table — not 9999)
- [x] `@media (prefers-reduced-motion: reduce)` — collapse animation/transition durations
- [x] Shared utilities: `.page-wrap`, `.section`, badge/tag classes used by Engine + Blueprint
- [x] Focus: `a:focus-visible, button:focus-visible, [tabindex]:focus-visible` — 1px `--brass`, 3px offset
- [x] Mobile: `--page-pad: 20px` at `≤768px`, `16px` at `≤360px`

### M1.2 `src/app/layout.tsx`

- [x] Metadata (locked copy — use verbatim):

| Field | Value |
|-------|--------|
| `<title>` | `NIELLESS — Full-Stack Engineer` |
| `description` | `Backend-first engineer building systems that hold. Node.js, PostgreSQL, AWS, AI-native.` |
| `og:title` | Same as title |
| `og:description` | Same as description |
| `og:image` | **Deferred** — static hero frame export for v3.4 |

- [x] Skip link: `<a href="#main" class="skip-link">Skip to content</a>` (`z-index: 10000`)
- [x] Structure: `<SiteHeader />` → `<main id="main">{children}</main>` → `<Footer />`
- [x] No Google Fonts CDN links

### M1.3 `SiteHeader.tsx` (minimal — **not** mode dial)

- [x] Sticky top bar: `NIELLESS` (or `N/A`) left, mono 11px brass
- [x] **No** P/A/M/ISO dial in v3.3
- [x] Optional v3.3: plain text anchor links `DARKROOM` · `BLUEPRINT` · `CONTACT` (`href="#darkroom"` etc.) — underline on hover, no sliding indicator
- [x] `aria-label="Site header"`

### M1.4 `SectionShell.tsx`

Shared section header for Darkroom, Blueprint, and Contact.

- [x] Props: `label` (e.g. `[04] THE DARKROOM`), `title`, optional `meta` (right-aligned mono)
- [x] Matches spec typography: label 10px brass, title display 42px desktop / 32px mobile

**Markup skeleton** (semantic only — styles in CSS module):

```tsx
<header className={styles.shell}>
  <p className={styles.label}>{label}</p>
  <div className={styles.row}>
    <h2 className={styles.title}>{title}</h2>
    {meta ? <p className={styles.meta}>{meta}</p> : null}
  </div>
</header>
```

(`styles` = CSS module import; not Framer Motion.)

### Definition of Done

- [x] `page.tsx` renders header + `page-wrap` + footer with grain visible  
- [x] Tab → skip link → main works  
- [x] Reduced motion: page still readable, no errors  

**Verified**: 2026-05-18 — `npm run build`, `npm run lint`, grep gates (`next/font/google`, banned animation libs, inline `style={{`). Tracker SHA: `b91bf04`

**Commit**: `feat(v3.1): design tokens, layout shell, minimal header`

---

## Milestone M2 — Hero boot (finished)

**Spec ref**: Section 03 (boot + focus hunt only — **not** scroll-to-DSLR)

### M2.1 `HeroBoot.tsx` + module

**Boot timing** (use CSS animation delays or a single `useEffect` timer chain — no Framer):

| Tick | Event |
|------|-------|
| 0ms | Void, grain on |
| 200ms | `NIELLESS OPTICAL SYSTEMS` visible |
| 400ms | `SENSOR: 35MM FULL-FRAME · MOUNT: AI-NATIVE` |
| 600ms | `APERTURE: f/LOGIC · ISO: MINIMUM` |
| 600ms | `SHUTTER: ARMED` in `--signal` |
| 800ms | Headline focus hunt starts |
| 2200ms | L-brackets + crosshair |
| 2300ms | Center dot signal flash |
| 2500ms | Boot complete |

**Content** (from spec):

- Headline: `ORDER.` / `LOGIC.` / `AMOR FATI.` (accent on last line)
- Sub: *Full-Stack Engineer. AI-native builder…* (Crimson Pro italic)
- CTA: `[ SCROLL TO DARKROOM ]` (or scroll down) — smooth-scroll to `#darkroom` (working link, not decorative)

**Styles**:

- Headline: 62px desktop → 40px tablet → 28px at 320px
- Focus hunt: `blur` 8px→0 over 2.5s; brackets 20px; crosshair 40px; center dot flash
- `prefers-reduced-motion`: all lines + headline visible immediately, no blur, no bracket animation

### M2.2 `page.tsx` — hero section only

- [ ] `<section id="hero" aria-label="Introduction">` wrapping `HeroBoot`
- [ ] After boot, user can scroll to `#darkroom` anchor without JS errors
- [ ] Remove `body { overflow: hidden }` lock and router push to `/engine`

### Definition of Done

- [ ] Cold load → boot plays → CTA scrolls to `#darkroom`  
- [ ] Reduced motion → static hero, CTA still works  
- [ ] Mobile 320px: no horizontal scroll, headline readable  
- [ ] Lighthouse run on hero-only page: no layout shift from boot (reserve min-height)

**Commit**: `feat(v3.1): hero boot sequence with reduced-motion fallback`

---

## Milestone M3 — The Darkroom (film negative reel)

**Spec ref**: Section [04] (`nielless-portfolio-design-spec-v3.html` Rev 3.3)

### M3.0 Design spec gate (complete before `src/`)

- [x] `nielless-portfolio-design-spec-v3.html` Section [04] → The Darkroom mock + interaction notes + scroll math + modal wipe
- [x] `nielless-v3-build-roadmap.md` M3 updated (this file)
- [ ] `nielless-portfolio-design-spec.md` §03 rewrite (optional parity; HTML is visual source of truth)

### M3.1 Data — `src/data/projects.ts`

| Field | Purpose |
|-------|---------|
| `tier` | `"production"` \| `"pet"` |
| `sortOrder` | Strip order |
| `negativeSummary` | ~120 chars on film frame |
| `printDetails` | `period?`, `bullets[]`, `techTags[]`, `watermark?`, `links?` |

**Strip order** (8 negatives + leader tape):

1. `uhc-store` PROD_001 → 2. `uhc-canary` PROD_002 → 3. `wci-backend` PROD_003 → 4. `wci-migration` PROD_004  
→ **Leader tape** `[PRODUCTION]` / `[LAB]`  
→ 5. `orion` SYSTEM_001 → 6. `repwise` SYSTEM_002 → 7. `gita-reader` SYSTEM_003 → 8. `agentic-sys` SYSTEM_004

Exports: `productionProjects`, `petProjects`, `getProjectsByTier()`.

**`negativeSummary` copy (locked — max ~120 chars each)**:

| `slug` | `negativeSummary` |
|--------|-------------------|
| `uhc-store` | Greenfield UHC storefront + admin (Next.js/Redux). 100K+ monthly sessions; LSA/HSA integrations. |
| `uhc-canary` | Canary deployment pipeline for UHC microservices. Phased rollouts cut critical release risk by 40%. |
| `wci-backend` | Carbon cap-and-trade allocation APIs. PostgreSQL transactions enforce 10% annual corporate cap cuts. |
| `wci-migration` | Python/DynamoDB → Node.js/PostgreSQL. Zero-downtime regulated cutover; 100% data consistency. |
| `orion` | Voice-first AI assistant. End-to-end orchestration for low-latency LLM inference and Whisper STT. |
| `repwise` | Full-stack workout tracker. Agentic SDLC automated ~80% of PRs; unified TypeScript across Supabase + UI. |
| `gita-reader` | Offline-first React Native app. Python/OCR ingests legacy PDFs; FTS5 search over 700+ verse records. |
| `agentic-sys` | Multi-agent Node.js system. Handoff + Promise.all fan-out/fan-in for parallel LLM task execution. |

*(Aligned with `resumes/` — Generalist + AI Engineer variants.)*

### M3.2 Film strip UI (static first, ~2 hr)

- [ ] `FilmStrip.tsx`, `FilmNegative.tsx`, `LeaderTape.tsx` + CSS modules
- [ ] Negative visual: orange-mask `#1a1208` or spec inversion; sprocket pseudo-elements
- [ ] `DarkroomSection.tsx`: label `[04] THE DARKROOM`, title `DARKROOM`, meta `8 NEGATIVES · 4 PROD · 4 LAB`
- [ ] `[ DEVELOP ]` CTA per frame; `role="article"`, `aria-label`, `id="project-{slug}"`
- [ ] Status badges: LIVE / REGULATED / ACTIVE

### M3.3 Scroll scrub (~3–4 hr)

- [ ] `useFilmScroll.ts`: rAF-throttled; formulas in **Architecture → Scroll scrub** above
- [ ] Sticky desktop viewport; `scrollTrackHeight = maxTravel + window.innerHeight`
- [ ] `ResizeObserver` recalc
- [ ] Mobile `≤768px`: no sticky scrub; horizontal `overflow-x` + snap; hint `[ swipe → ]`
- [ ] `prefers-reduced-motion`: stacked negatives or horizontal overflow only; no scrub

### M3.4 Positive print modal (~1.5 hr)

- [ ] `PositivePrintModal.tsx`: full-screen overlay, body scroll lock, focus trap
- [ ] Brass gate wipe 180ms (see spec); reduced-motion instant content
- [ ] Triggered only from `[ DEVELOP ]` — not from scroll

### M3.5 Page integration

- [ ] `ScrollHint.tsx` sitewide; hidden when modal open
- [ ] `<section id="darkroom">` after hero; redirect `/#engine` and `/engine` → `/#darkroom`
- [ ] Header nav: `DARKROOM` replaces `ENGINE`

### Definition of Done

- [ ] Vertical scroll through `#darkroom` (desktop) scrubs film per spec math  
- [ ] Mobile: horizontal strip scroll; no nested scroll trap  
- [ ] Each negative shows `negativeSummary`; modal shows full `printDetails`  
- [ ] `ScrollHint` visible until modal open  
- [ ] No prev/next carousel; no Framer in darkroom components  
- [ ] `npm run build` passes  

**Commit**: `feat(v3.3): darkroom film negative reel with develop modal`

---

## Milestone M4 — Blueprint section (finished)

**Spec ref**: Section 05

### M4.1 Data — `src/data/timeline.ts`

```ts
type DoFClass = "frame-near" | "frame-mid" | "frame-far" | "frame-past";

interface TimelineEntry {
  id: string;
  period: string;       // e.g. "NOW — ACTIVE"
  role: string;         // e.g. "PRODUCT ENGINEERING MODE"
  company?: string;     // e.g. "PUBLICIS SAPIENT" — omit for current-mode frame
  bullets: string[];    // 1–3 lines shown in frame body
  dofClass: DoFClass;   // maps to ContactSheet opacity/weight CSS
  isCurrent?: boolean;  // true only for the NOW frame
  sortOrder: number;
}
```

**DoF assignment**: `frame-near` = present (`isCurrent`); `frame-mid` = recent role; `frame-far` = earlier role; `frame-past` = education. Do not use `filter: blur()`.

**Frames** (spec order):

1. **NOW — ACTIVE** — Product Engineering Mode (`frame-near`, `isCurrent: true`)
2. **JUL 2022 — PRESENT** — PUBLICIS SAPIENT (`frame-mid`)
3. **FEB 2022 — JUN 2022** — PAYPAL INDIA (`frame-far`)
4. **2018 — 2022** — BITS PILANI (`frame-past`)

### M4.2 `ContactSheet.tsx`

- [ ] Film strip: left border + sprocket pseudo-elements (hidden `≤768px`)
- [ ] DoF classes: `frame-near` / `frame-mid` / `frame-far` / `frame-past` per spec opacities and weights
- [ ] `:hover` / `:focus-visible` → full density (no `filter: blur()`)
- [ ] Each frame `tabindex="0"` for keyboard

### M4.3 `StackPanel.tsx`

- [ ] `$ current --stack` header (mono 9px)
- [ ] Tags: NODE.JS, TYPESCRIPT, POSTGRESQL, NEXT.JS, `[LLM AGENTS]`, `[AGENTIC SDLC]`, AWS, DOCKER, PYTHON
- [ ] **Brass highlight rule**: only tags whose label is wrapped in square brackets (`[LLM AGENTS]`, `[AGENTIC SDLC]`) use `color: var(--brass)` + `border-color: var(--brass-dim)`. Plain tags stay default dust/mono styling.

### M4.4 Wire into `page.tsx`

- [ ] `<section id="blueprint">` with `SectionShell`: `[05] DEPLOYMENT HISTORY` / `CONTACT SHEET`

### Definition of Done

- [ ] Timeline readable; past frames visibly recede; hover/focus restores density  
- [ ] Stack panel matches spec tags  
- [ ] Header anchor `#blueprint` works from SiteHeader  

**Commit**: `feat(v3.1): blueprint timeline and stack panel`

---

## Milestone M5 — Contact + footer (finished)

**Spec ref**: Section 02 (contact) — **v3.3: mailto + links only** (no Formspree/backend form)

### M5.1 `ContactSection.tsx`

- [ ] `SectionShell`: `[06] CONTACT` / `OPEN CHANNEL`
- [ ] Primary CTA → `mailto:nielless.acharya@gmail.com` (real address from resume)
- [ ] Secondary links: LinkedIn, GitHub, resume PDF with `rel="noopener noreferrer"`, visible focus states
- [ ] No submit button, no Formspree, no “coming soon” — every control must open a real destination

**Do not ship**: non-functional submit, hot-shoe hold-to-fire, or dual mailto+form paths.

### M5.2 `Footer.tsx`

- [ ] Left: `NIELLESS :: v3.3` · Right: `nielless.com`
- [ ] Center quote: *"Build until it holds."* (Crimson italic, `--muted2`)

### M5.3 `page.tsx` complete

- [ ] Section order: `#hero` → `#darkroom` → `#blueprint` → `#contact`
- [ ] `SiteHeader` anchors match section ids
- [ ] Semantic landmarks only; no duplicate `main`

### Definition of Done

- [ ] User can complete contact intent in &lt; 2 clicks (mailto or successful form)  
- [ ] Footer on all pages via layout  
- [ ] Full page scroll works end-to-end on mobile + desktop  

**Commit**: `feat(v3.1): contact section and footer — single-page complete`

---

## Milestone M6 — Release hardening

**Spec ref**: Sections 07–08 (mobile + quality)

### M6.1 Accessibility

- [ ] Every interactive control keyboard-operable  
- [ ] `aria-hidden="true"` on decorative grain only  
- [ ] Color contrast: text on `--void` / `--surface` passes WCAG AA  
- [ ] `prefers-reduced-motion`: hero static; bracket transitions instant; no broken scroll  

### M6.2 Responsive checklist

| Breakpoint | Rule |
|------------|------|
| ≤768px | Darkroom: horizontal film strip (no sticky scrub); blueprint sprockets hidden; page pad 20px |
| ≤360px | Hero 28px; page pad 16px; no horizontal overflow |
| Touch | Targets ≥ 44×44px; `-webkit-tap-highlight-color: transparent` |

### M6.3 Performance & SEO

- [ ] Self-hosted fonts with `font-display: swap`  
- [ ] No client-only blocking of entire page  
- [ ] `npm run build` → analyze bundle; remove dead imports  
- [ ] Lighthouse (incognito): **≥ 90** all categories (document scores in session log)

### M6.4 Production deploy

- [ ] Deploy preview smoke test: hero → darkroom (scrub + develop modal) → blueprint → contact  
- [ ] `git tag v3.3.0`

### Definition of Done

- [ ] Production URL loads all sections; no console errors  
- [ ] iPhone Safari + desktop Chrome smoke pass  
- [ ] Tag `v3.3.0` on release commit  

**Commit**: `chore(v3.3): release hardening and v3.3.0 tag`

---

## Agent instructions (`CLAUDE.md` snippet)

When creating/updating `CLAUDE.md`, use:

```markdown
# CLAUDE.md — nielless.com v3.3

## Ground truth
- Build roadmap: `nielless-v3-build-roadmap.md` (what ships, M0–M6, scroll math, data, SEO, z-index)
- Visual reference: `nielless-portfolio-design-spec-v3.html` Rev 3.3 (do not implement Deferred items)

## Rules
1. CSS Modules + `var(--token)` only. No Tailwind. No inline styles.
2. No Framer Motion, GSAP, Lenis, Three.js.
3. Single page `/` — sections `#hero`, `#darkroom`, `#blueprint`, `#contact`.
4. No mode-dial nav in v3.3. Contact = mailto + links only.
5. Finish the current milestone Definition of Done before starting the next.

## Order
M0 → M1 → M2 → M3 → M4 → M5 → M6
```

---

## v3.4+ backlog (from spec — not v3.3)

Track here; do not start until v3.3.0 is tagged:

1. Mode-dial navigation with considered IA (replace text anchors)  
2. Scroll-to-DSLR + flash + scroll reset (Section 03 hero — deferred)  
3. Aperture ring + exposure meter (Section 02)  
4. Shutter overlay transitions (Section 02 / 06)  
5. Custom cursor (Section 06)  
6. Mechanical audio toggle (Section 02)  
7. Hot-shoe CTA with two-stage shutter (Section 06)  
8. Per-negative custom illustrations; sound on develop; `?print=slug` deep-link  
9. CSS `animation-timeline: scroll()` as primary scrub (only if sticky conflict solved)  

---

## SESSION LOG

### Session: 2026-05-17 — M3 blocker lock (scroll / z-index / wipe)
**Completed**: Canonical scroll scrub (`maxTravel` vs `scrollTrackHeight`, `scrubRange`, `trackTop` formula); grain **z-index 50** (not 9999); brass gate wipe behavior paragraph + keyframes; spec HTML `body::after` fixed  
**Blocks**: None  
**Next action**: M0 baseline cleanup  
**Commit**: N/A (docs)

### Session: 2026-05-17 — Spec/roadmap gap closure
**Completed**: Scroll scrub math + modal brass wipe + z-index stack + SEO copy + all 8 `negativeSummary` lines + `TimelineEntry` model + mailto-only contact + M0–M6 implementation order in spec [08]; `cursor-plan.md` demoted to ephemeral handoff  
**Blocks**: None (superseded by M3 blocker lock above for formula/z-index/wipe detail)  
**Next action**: M0 baseline cleanup  
**Commit**: N/A (docs)

### Session: 2026-05-17 — Darkroom design documentation
**Completed**: Spec HTML Section [04] → The Darkroom (film reel mock, interaction notes); roadmap M3 rewritten for v3.3 film negative reel  
**Blocks**: None (superseded by gap-closure session above)  
**Next action**: M0  
**Commit**: N/A (docs)

### Session: 2026-05-17 — Roadmap redesign
**Completed**: Roadmap rewritten for production v3.1 (single-page, deferred experimental mechanics) — **superseded by v3.3 Darkroom**  
**Blocks**: None  
**Next action**: See session above  
**Commit**: N/A (planning)

---

### Session: 2026-05-13 — Init
**Completed**: Original 9-step roadmap drafted  
**Superseded by**: 2026-05-17 milestone model above  

---

## APPENDIX — Quick reference

### Color tokens

| Token | Hex | Use |
|-------|-----|-----|
| `--void` | `#060608` | Body |
| `--surface` | `#0E0E10` | Cards |
| `--surface2` | `#161618` | Nested |
| `--grid` | `#1A1A1C` | Dividers |
| `--border` | `#2E2E31` | Borders |
| `--border2` | `#3A3A3D` | Subtle |
| `--brass` | `#C8A96E` | Accent |
| `--brass-dim` | `#8A7249` | Secondary |
| `--brass-bright` | `#E2C48A` | Hover |
| `--signal` | `#39FF14` | Live |
| `--hot` | `#FF4D1A` | Warning |
| `--ice` | `#A8C8E8` | Cloud |
| `--dust` | `#E8E2D5` | Text |
| `--muted` | `#606068` | Secondary text |
| `--muted2` | `#404044` | Tertiary |

### Z-index tokens (v3.3)

| Token / layer | Value | Use |
|---------------|-------|-----|
| Skip link | 10000 | Focus ring above all UI |
| Print modal | 500 | `PositivePrintModal` overlay |
| Site header | 100 | Sticky `SiteHeader` |
| Scroll hint | 90 | `ScrollHint` fixed |
| Film grain | **50** | `body::after` — never 9999 |
| Page content | 1 | Sections, `.page-wrap` |

See **Architecture → Z-index stack**. Deferred hero flash overlay may use 9999 in spec HTML only.
