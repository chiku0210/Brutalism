# NIELLESS.COM v3.3 — BUILD ROADMAP
## Production release: single-page optical portfolio

**Status**: `IN PROGRESS` | **Last updated**: 2026-05-18 | **Owner**: Nielless  
**Target release**: `v3.3.0` — one URL, every section works, no placeholder mechanics  

**Permanent docs (only these two)**: this file + `nielless-portfolio-design-spec-v3.html`.  
`plan/` directory contains execution-ready breakdown for agent development — milestone-per-file structure with ready-to-paste prompts.
Professional-content source of truth: `assets/resume-content-superset.md`.

---

## How to use this document

| Role | Rule |
|------|------|
| **This file** | Single source of truth for *what ships* in v3.3, build order (M0–M6), scroll math, data models, SEO copy, z-index |
| **`nielless-portfolio-design-spec-v3.html`** | Visual + interaction reference (Rev 3.3) — do not implement deferred items because they appear in the spec |
| **`plan/`** | Execution-ready breakdown for agent development; milestone-per-file structure |
| **`assets/resume-content-superset.md`** | Source of truth for professional content (summary, experience, production projects, project details, contact links) |
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
- **Viewfinder zoom-out → D7500 rear reveal → pop-up flash → full white screen → darkroom entry** (scroll-driven transition between hero and darkroom)  
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
| ~~Scroll-to-DSLR 3D sequence + flash reveal~~ | **MOVED INTO v3.3** — reimagined as viewfinder zoom-out → D7500 rear reveal → pop-up flash → darkroom entry (see M2) |
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
Animation:     CSS @keyframes (boot, flash, brass gate wipe); JS scroll scrub (useFilmScroll); JS scroll zoom-out (useHeroZoom)
Data:          src/data/projects.ts (negativeSummary + printDetails), src/data/timeline.ts
Content:       assets/resume-content-superset.md (professional copy source)
Deploy:        Vercel
```

**Banned**: Tailwind, Framer Motion, GSAP, Lenis, Three.js, inline `style={{}}` (except setting CSS variables on `documentElement` if ever needed, and `transform` writes from scroll hooks).

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
| Hero flash overlay | 9999 | Full white screen; fires when zoom-out completes |
| Hero zoom-out container | 200 | Sticky container during zoom-out scroll phase |

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
│   ├── D7500Rear.tsx          # CSS replica of camera rear
│   ├── useHeroZoom.ts         # Scroll-driven zoom-out + flash
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

## Milestone M2 — Hero boot → viewfinder zoom-out → flash → darkroom entry

**Spec ref**: Section [03] (boot + viewfinder zoom-out + D7500 rear + pop-up flash)

**Concept**: The user looks through the D7500 optical viewfinder. The camera boots. Focus is acquired. Then, on scroll, the POV pulls back from the eyepiece — the viewfinder shrinks to reveal the full rear of the D7500 camera body (CSS replica). When the zoom-out completes, the built-in pop-up flash flips open, fires (full white screen), and the darkroom section appears. The user just "took a photo" — now they enter the darkroom to develop it.

### M2.1 `HeroBoot.tsx` + module (Viewfinder boot — auto-plays on load)

**Boot timing** (use CSS animation delays or a single `useEffect` timer chain — no Framer):
**Speed lock**: timings are intentionally slowed to ~3x for readability and presence.

| Tick | Event |
|------|-------|
| 0ms | Empty viewfinder. Grain on. AF grid hidden. Lock overlay hidden. |
| 600ms | Frame corner brackets fade in — the viewfinder window opens |
| 800ms | AF grid fades in (neutral points only) |
| 1300ms | Center AF rectangle glows red (`.af-center`) — exactly 500ms after AF appears; hero still hidden |
| 1500ms | Data strip + top HUD strip populate **all-at-once** — one beat, like the real D7500 power-on |
| 1700ms | `SHUTTER: ARMED` appears bottom-right of glass (`--signal`) |
| 1800ms | Hero focus animation starts — 500ms after center red glow (showcase beat) |
| 2400ms | `SHUTTER: ARMED` fades out |
| 9300ms | Focus lock (1800ms + 7.5s hunt): AF cluster completely invisible; L-brackets + crosshair on headline |
| 9600ms | Focus confirm dot fires `.acquired` — green glow, bottom-left of glass |
| 10000ms | Sub-copy + CTA fade in below the instrument. **Zoom-out scroll now enabled.** |

**Content** (from spec — D7500 optical viewfinder, 5 layers):

**Layer 1 — Eyepiece vignette**
- Radial gradient: `ellipse 72% 68% at 50% 50%`, transparent centre 55%, fades to near-black at edges
- Simulates the rubber eyecup shadow when pressing eye to the camera

**Layer 2 — Frame corners**
- Four warm-white L-brackets at the image boundary: `rgba(232,226,213,0.55)`, 28px, 1px line
- NOT brass. NOT a full border. Just the corners — exactly like a real DSLR viewfinder frame line

**Layer 3 — Glass (overlays on the scene)**
- Top HUD strip (absolute, top-left of glass, 9px mono, dim white): `M · ⚡ · AFS · ◉ · WB`
- 51 AF points across the frame (hardcoded positions matching D7500 layout): neutral white rectangles with only the center point red
- Headline `ORDER. / LOGIC. / AMOR FATI.` centered on AF cluster at `left: 50%`, `top: 28%`, `transform: translateX(-50%)`
- `SHUTTER: ARMED` — transient overlay, bottom-right of glass, appears t=1700ms, gone at t=2400ms
- Focus confirm dot — 8px circle, bottom-left of glass, `var(--muted2)` idle → `var(--signal)` + glow on `.acquired` at t=9600ms

**Layer 4 — Data strip (BELOW the glass, its own panel)**
- `background: rgba(6,6,8,0.97)` · `border-top: 1px solid rgba(46,46,49,0.9)` · `height: 52px`
- Layout left → right: `NIELLESS ACHARYA` (9px muted) · `1/∞` (16px) · `F2.0` (15px) · exposure meter (graphic bar, 9 ticks, centered needle) · `ISO 3200` · `08` (16px) · battery icon
- Exposure meter is a graphic element — NOT text characters. A 80px bar with 9 tick marks (center tick taller) and a 2px needle at dead center (0 EV)
- `08` frame count maps to 8 Darkroom projects

**Layer 5 — Caption (outside the instrument entirely)**
- Sub-copy: *Backend-first engineer. I find order in complex systems and ship things that actually hold. Currently building in the open — one deliberate commit at a time.* (Crimson Pro italic, `--muted`)
- CTA: `[ SCROLL TO DARKROOM ]` → triggers zoom-out scroll, ultimately reaches `#darkroom`
- Fades in at t=10000ms (boot complete)

**Styles** (production — `HeroBoot.module.css`):

- Viewfinder frame: `aspect-ratio: 3 / 2`, `max-width: 860px`, centred, `flex-direction: column`
- Glass: `position: relative`, `overflow: hidden`, fills frame above data strip
- Headline: `font-family: var(--display)`, `62px` desktop → `40px` tablet → `28px` 320px
- Focus hunt: `blur` 8px→0 over 7.5s, exactly 2 hunt passes (no third loop)
- AF points: `width: 22px`, `height: 15px`, `border: 2px solid rgba(232,226,213,0.85)`, `border-radius: 4px`; row gap `18px`, block gap `18px`, row spacing `28px`; only `.af-center` is red with subtle glow
- AF grid only — no side enclosure braces/rails in v3.3 hero boot
- AF sequence states: `afHidden` → `afVisible` → `afCenterGlow` (500ms showcase) → `heroFocusStart` → `afInvisible` (`opacity: 0; visibility: hidden`) + `lockOverlayVisible`
- Data strip: `display: flex`, `justify-content: space-between`, `align-items: center`
- Meter needle: `position: absolute`, `left: 50%`, `transform: translate(-50%,-50%)`, `width: 2px`, `height: 13px`
- `prefers-reduced-motion`: all elements immediately visible; AF pattern remains static; no interval behavior required

**Mobile (≤768px):**
- Frame: `aspect-ratio: 4 / 3`; eyepiece vignette hidden (too claustrophobic on small screens)
- Data strip: `font-size: 11px`; meter hidden (`display: none`); owner tag hidden
- Headline: `40px`

**Mobile (≤360px):** headline `28px`, data strip `10px`

### M2.2 D7500 rear body (CSS replica)

CSS-only replica of the Nikon D7500 rear, built from reference images. No raster images — pure CSS art. **Implementation must be faithful to the reference photos** (see project assets) — LCD, viewfinder eyepiece, button clusters, grip texture, mode dial, and flash unit should all be recognizable.

**Camera body** (`D7500Rear.tsx` + `D7500Rear.module.css`):
- Body: `max-width: 560px`, `aspect-ratio: 136 / 104` (real D7500 proportions), dark matte gradient
- LCD screen: large dark rectangle, centre-bottom area (~60% of body width), `border-radius: 4px`, subtle inner shadow
- Viewfinder eyepiece: raised rectangular bump at top-center, rubber surround texture (dark gradient + subtle border), this is where the viewfinder content zooms INTO
- Left button column: MENU, WB, ?/On, QUAL, magnify/trash, info — small rounded rectangles with mono labels
- Right controls: multi-selector D-pad with OK center, AE-L/AF-L button, `i` button, Lv button
- Mode dial: top-left area, circular with knurled edge (conic-gradient), S/Cl/Ch/D markings
- Grip: textured rubber area on right side (repeating-linear-gradient stripes)
- Nikon logo: below LCD, `font-style: italic`, `color: var(--brass-dim)`
- Pop-up flash unit: closed position at top-center (flush with camera body), hinged — animates open

**Pop-up flash unit**:
- Closed: narrow rectangular strip flush with the pentaprism housing, `height: ~8px`
- Open: rotates upward around bottom hinge, `transform-origin: bottom`, `rotateX(-75deg)`, reveals flash head
- Flash head: small white/light rectangle at the tip of the opened unit

### M2.3 Zoom-out scroll sequence (`useHeroZoom.ts`)

After boot completes (t=10000ms), scroll-driven zoom-out begins. The viewfinder content was filling the viewport — now it scales down to reveal the D7500 rear body around it.

**Key principle — no crop-in**: The zoom-out starts from exactly what the user sees after boot. The viewfinder is already displayed at its natural boot size (max-width 860px, 3:2 frame). The zoom ONLY shrinks — it does not first scale up to fill the viewport. The effect is a pure pull-back from the current view.

**Scroll math** (canonical — copy verbatim into `useHeroZoom.ts`):

| Token | Formula / value |
|-------|-----------------|
| `scrollTrackHeight` | `4 × window.innerHeight` — total height of hero scroll track |
| `scrubRange` | `scrollTrackHeight − window.innerHeight` — vertical scroll distance for 0→1 progress |
| `bootWidth` | measured width of `.vf-frame` at boot completion (the viewfinder's current rendered size) |
| `eyepieceWidth` | measured width of `.camera-eyepiece-window` on the D7500 body (~50px) |
| `minScale` | `eyepieceWidth / bootWidth` — the final scale when viewfinder reaches eyepiece size |

While hero scroll track is in view (sticky viewport active):

```text
trackTop      = heroTrack.getBoundingClientRect().top
progress      = clamp(0, 1, (-trackTop) / scrubRange)
```

**Phase mapping** (progress 0→1):

| Progress | Event |
|----------|-------|
| 0.00→0.10 | Caption (sub-copy + CTA) fades out (`opacity 1→0`) |
| 0.05→0.15 | Data strip fades out (`opacity 1→0`) |
| 0.10→0.85 | Viewfinder shrinks from boot size to eyepiece size: `scale(1 → minScale)`. Simultaneously translates from its boot position to the eyepiece position on the D7500 body |
| 0.15→0.50 | Camera body fades in (`opacity 0→1`), centered in viewport |
| 0.85→0.90 | Viewfinder reaches eyepiece size and locks into position on the camera |
| 0.90 | Full D7500 rear visible with viewfinder nested in eyepiece. **Pop-up flash triggers.** |
| 0.90→0.95 | Flash unit rotates open (300ms CSS animation, `transform-origin: bottom`) |
| 0.95 | Flash fires: full white overlay (`z-index: 9999`, 800ms) |
| 0.95→1.00 | White screen holds, camera body fades out behind it |
| 1.00 | Flash clears. Darkroom section below is now visible. Scroll position normalizes. |

**Apply:** `viewfinderContent.style.transform = \`scale(${currentScale}) translate(${tx}px, ${ty}px)\`` — rAF-throttled scroll listener.
**Resize:** `ResizeObserver` recalculates `bootWidth`, `eyepieceWidth`, `minScale`, positions.
**Banned:** CSS `animation-timeline: scroll()` as primary.

**DOM structure:**

```html
<div class="hero-track" style="min-height: {scrollTrackHeight}px">
  <div class="hero-viewport">  <!-- position: sticky; top: 0; height: 100vh -->
    <div class="camera-body">  <!-- D7500 rear, opacity 0→1 -->
      <div class="camera-eyepiece">  <!-- where viewfinder lands -->
      <div class="camera-lcd"></div>
      <div class="camera-buttons-left">...</div>
      <div class="camera-controls-right">...</div>
      <div class="camera-grip"></div>
      <div class="camera-flash-unit"></div>  <!-- pop-up, rotates open -->
    </div>
    <div class="viewfinder-zoom-content">  <!-- scales from maxScale→1 -->
      <!-- All 5 viewfinder layers from boot -->
    </div>
  </div>
  <div class="flash-overlay"></div>  <!-- z-index: 9999, full white -->
</div>
```

### M2.4 Flash pop-up + fire → darkroom entry

At progress ≈ 0.90 (zoom-out complete):

1. **Pop-up flash opens** (300ms): flash unit rotates from closed (flush with body) to open (angled up). `transform-origin: bottom center`, `rotateX(0 → -75deg)`. CSS `@keyframes flashPopUp`.
2. **200ms pause**: mechanical delay — the flash capacitor is charging.
3. **Flash fires**: full-viewport white overlay animates in. `z-index: 9999`.

```css
@keyframes heroFlash {
  0%   { opacity: 0; }
  5%   { opacity: 1; }
  30%  { opacity: 0.95; }
  60%  { opacity: 0.4; }
  100% { opacity: 0; }
}
```

4. During flash peak: camera body fades to `opacity: 0`.
5. Flash clears → `#darkroom` section is visible below in normal scroll flow.
6. Hero scroll track collapses or scroll normalizes so user continues into darkroom naturally.

**Reduced motion**: skip zoom-out entirely. After boot completes, user scrolls directly to `#darkroom`. No flash, no zoom, no camera body. CTA `[ SCROLL TO DARKROOM ]` works as a simple anchor.

**Mobile (≤768px)**: zoom-out still works but camera body scales to fit mobile viewport. Scroll track reduces to `3 × window.innerHeight`. Flash sequence unchanged. On very small screens (≤360px), consider simplifying camera body detail (hide some buttons).

### M2.5 `page.tsx` — hero section

- [ ] `<section id="hero" aria-label="Introduction">` wrapping entire boot + zoom sequence
- [ ] Hero scroll track div provides the `min-height` for zoom-out progress
- [ ] After flash clears, user can scroll to `#darkroom` anchor naturally
- [ ] Remove `body { overflow: hidden }` lock and router push to `/engine`
- [ ] No scroll lock during boot — user can scroll early but zoom-out begins from boot state

### Definition of Done

- [ ] Cold load → empty VF → AF appears → center red glow → hero focus starts → AF invisible at lock → brackets/cross replace AF → focus dot green → caption fades in
- [ ] Data strip is BELOW the frame line, in its own dark panel
- [ ] Headline is center-locked inside the glass (`left: 50%`, `top: 28%`, `transform: translateX(-50%)`)
- [ ] AF pattern matches D7500 reference: only center AF rectangle is red
- [ ] AF-to-lock handoff strict: AF invisible before lock brackets appear
- [ ] `SHUTTER: ARMED` appears and disappears (never permanent)
- [ ] **Zoom-out**: scroll after boot → viewfinder scales down → D7500 rear body fades in around it
- [ ] **D7500 rear** is recognizable: LCD, viewfinder eyepiece, button clusters, grip, mode dial, Nikon logo
- [ ] **Pop-up flash**: unit flips open at zoom-out completion, visible mechanical animation
- [ ] **Flash fire**: full white screen, 800ms, clears to reveal `#darkroom`
- [ ] Reduced motion: all layers immediately visible; no zoom-out; no flash; simple scroll to `#darkroom`
- [ ] Mobile 320px: no horizontal scroll, headline readable, camera body fits viewport
- [ ] Lighthouse: no layout shift from boot (reserve `min-height` on frame + scroll track)

**Commit**: `feat(v3.3): hero boot + viewfinder zoom-out + D7500 rear + flash → darkroom`

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

*(Aligned with `assets/resume-content-superset.md`.)*

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
- [ ] Primary CTA → `mailto:nielless.acharya@gmail.com` (real address from `assets/resume-content-superset.md`)
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
2. Aperture ring + exposure meter (Section 02)  
4. Shutter overlay transitions (Section 02 / 06)  
5. Custom cursor (Section 06)  
6. Mechanical audio toggle (Section 02)  
6. Hot-shoe CTA with two-stage shutter (Section 06)  
7. Per-negative custom illustrations; sound on develop; `?print=slug` deep-link  
8. CSS `animation-timeline: scroll()` as primary scrub (only if sticky conflict solved)  

---

## SESSION LOG

### Session: 2026-05-26 — Hero zoom-out redesign
**Completed**: Rewrote M2 to include viewfinder zoom-out → D7500 rear (CSS replica) → pop-up flash → full white screen → darkroom entry. Moved scroll-to-DSLR + flash from deferred to active scope (reimagined as zoom-out, not rotation). Added `D7500Rear.tsx`, `useHeroZoom.ts` to file structure. Updated z-index stack (flash 9999, zoom container 200). Removed `cursor-plan.md` (redundant with `plan/` directory). Updated all plan files, spec HTML, and roadmap.  
**Blocks**: None  
**Next action**: M2 implementation (viewfinder boot + zoom-out + D7500 rear + flash)  
**Commit**: N/A (docs)

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
