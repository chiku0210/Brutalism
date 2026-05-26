# M2 — Hero Boot → Viewfinder Zoom-Out → D7500 Rear → Flash → Darkroom

**Status**: IN PROGRESS (component exists but needs full rewrite + new zoom/flash phases)  
**Spec ref**: Section [03] of `nielless-portfolio-design-spec-v3.html`  
**Estimated effort**: 8–10 hours  
**Complexity**: VERY HIGH

---

## Concept

The user looks through the Nikon D7500 optical viewfinder. The camera boots up (AF points, focus hunt, headline lock). Then, on scroll, the POV pulls back from the eyepiece — the viewfinder shrinks to reveal the full rear of the D7500 camera body (built in CSS). When the zoom-out completes, the built-in pop-up flash flips open, fires (full white screen), and the darkroom section appears beneath. The user just "took a photo" — now they enter the darkroom to develop it.

**Three phases**:
1. **Boot** (auto, 0→10s): viewfinder powers on, focus acquired
2. **Zoom-out** (scroll-driven): POV retreats from eyepiece, D7500 rear reveals
3. **Flash** (auto at zoom completion): pop-up flash opens, fires, white → darkroom

---

## Current State

The existing `HeroBoot.tsx` implements a terminal-style boot. This does NOT match the roadmap spec. Full rewrite required for viewfinder boot + new zoom-out + D7500 rear + flash phases.

---

## Architecture Overview

### Phase A — Boot Sequence (auto-plays on load)

The viewfinder boot is a **camera instrument** with 5 stacked layers filling the entire viewport:

```
┌─────────────────────────────────────────────┐
│  Layer 1: EYEPIECE VIGNETTE                 │  (radial gradient, decorative)
│  ┌─────────────────────────────────────┐    │
│  │  Layer 2: FRAME CORNERS             │    │  (4 L-brackets, warm-white)
│  │  ┌─────────────────────────────┐    │    │
│  │  │  Layer 3: GLASS OVERLAYS    │    │    │  (HUD, 51 AF points, headline)
│  │  │                             │    │    │
│  │  │   [AF GRID — 51 points]    │    │    │
│  │  │   [HEADLINE centered]      │    │    │
│  │  │   [HUD top strip]          │    │    │
│  │  └─────────────────────────────┘    │    │
│  └─────────────────────────────────────┘    │
│  ┌─────────────────────────────────────┐    │
│  │  Layer 4: DATA STRIP (below glass)  │    │  (dark panel, camera metadata)
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
  Layer 5: CAPTION (outside instrument)         (sub-copy + CTA)
```

At t=10000ms, boot completes and zoom-out scroll becomes active.

### Phase B — Zoom-Out (scroll-driven)

**No crop-in**: The zoom starts from exactly what the user sees after boot — the viewfinder at its natural boot size (860px max-width, 3:2 frame). It does NOT first scale up to fill the viewport. The effect is a pure pull-back/shrink.

```
BOOT COMPLETE (what user sees):       AFTER SCROLL:
┌──────────────────────┐              ┌──────────────────────┐
│                      │              │    ┌──D7500 REAR──┐  │
│  ┌──VIEWFINDER───┐   │   scroll    │    │ [eyepiece]   │  │
│  │  at boot size │   │  ─────────► │    │  ┌─VF─┐      │  │
│  │  (860px/3:2)  │   │   shrinks   │    │  └────┘      │  │
│  └───────────────┘   │             │    │  [LCD]       │  │
│  [ SCROLL TO ... ]   │              │    │  [buttons]   │  │
└──────────────────────┘              │    └──────────────┘  │
                                      └──────────────────────┘
```

The viewfinder shrinks from its boot size down to the eyepiece size on the D7500 body. The camera body fades in around it as it shrinks.

### Phase C — Flash (auto-triggered)

```
Zoom complete → Flash unit flips up → Flash fires → White screen → Darkroom
    [0.90]         [0.90-0.93]          [0.95]       [0.95-1.0]     [1.0]
```

---

## Execution Steps

### Step 1: Rewrite `HeroBoot.tsx` (Viewfinder boot — 5 layers)

Same as roadmap M2.1 spec. Replace the current terminal boot with the D7500 viewfinder simulation.

**JSX structure:**

```tsx
<div className={styles.viewfinder}>
  {/* Layer 1: Eyepiece vignette */}
  <div className={styles.eyepiece} aria-hidden="true" />

  <div className={styles.frame}>
    {/* Layer 2: Frame corners */}
    <div className={styles.frameCorners} aria-hidden="true">
      <span className={`${styles.corner} ${styles.cornerTL}`} />
      <span className={`${styles.corner} ${styles.cornerTR}`} />
      <span className={`${styles.corner} ${styles.cornerBL}`} />
      <span className={`${styles.corner} ${styles.cornerBR}`} />
    </div>

    {/* Layer 3: Glass */}
    <div className={styles.glass}>
      <div className={styles.hudStrip} aria-hidden="true">M · ⚡ · AFS · ◉ · WB</div>
      <div className={styles.afGrid} aria-hidden="true">{/* 51 AF rectangles */}</div>
      <h1 className={styles.headline}>ORDER.<br/>LOGIC.<br/><span className={styles.accent}>AMOR FATI.</span></h1>
      <div className={styles.shutterArmed} aria-hidden="true">SHUTTER: ARMED</div>
      <div className={styles.focusDot} aria-hidden="true" />
    </div>

    {/* Layer 4: Data strip */}
    <div className={styles.dataStrip} aria-hidden="true">
      <span className={styles.ownerTag}>NIELLESS ACHARYA</span>
      <span className={styles.shutter}>1/∞</span>
      <span className={styles.aperture}>F2.0</span>
      <div className={styles.exposureMeter}>{/* 9-tick bar + needle */}</div>
      <span className={styles.iso}>ISO 3200</span>
      <span className={styles.frameCount}>08</span>
      <span className={styles.battery}>{/* SVG battery icon */}</span>
    </div>
  </div>

  {/* Layer 5: Caption */}
  <p className={styles.subline}>Backend-first engineer. I find order in complex systems...</p>
  <a href="#darkroom" className={styles.cta}>[ SCROLL TO DARKROOM ]</a>
</div>
```

**Boot timing chain** (same as roadmap table):

| Tick | Event | State Toggle |
|------|-------|-------------|
| 0ms | Empty viewfinder | default |
| 600ms | Frame corners fade in | `cornersVisible` |
| 800ms | AF grid fades in | `afVisible` |
| 1300ms | Center AF rect glows red | `afCenterGlow` |
| 1500ms | Data strip + HUD populate | `dataVisible` |
| 1700ms | SHUTTER: ARMED appears | `armedVisible` |
| 1800ms | Headline focus hunt starts | `heroFocusStart` |
| 2400ms | SHUTTER: ARMED fades out | `armedHidden` |
| 9300ms | Focus lock: AF invisible, brackets on headline | `afInvisible` + `lockOverlayVisible` |
| 9600ms | Focus confirm dot green | `dotAcquired` |
| 10000ms | Caption fades in; **zoom-out enabled** | `captionVisible` + `zoomReady` |

### Step 2: Build `D7500Rear.tsx` (CSS camera replica)

CSS-only replica of the Nikon D7500 rear. Reference images are in the project assets folder. **The implementation must be faithful to the reference photos** — LCD, viewfinder eyepiece, button clusters, grip texture, mode dial, and pop-up flash unit should all be recognizable as a D7500 rear. This is a centerpiece visual; don't over-simplify.

**Component structure:**

```tsx
<div className={styles.cameraBody}>
  {/* Top section: pentaprism housing + flash unit */}
  <div className={styles.topHousing}>
    <div className={styles.modeDial} aria-hidden="true">
      <span className={styles.dialMark}>S</span>
      <span className={styles.dialMark}>Cl</span>
      <span className={styles.dialMark}>Ch</span>
    </div>
    <div className={styles.flashUnit} aria-hidden="true">
      <div className={styles.flashHead} />
    </div>
    <div className={styles.viewfinderMount}>
      {/* This is where the zoomed-out viewfinder content lands */}
      <div className={styles.eyepieceWindow} />
    </div>
  </div>

  {/* Left button column */}
  <div className={styles.leftButtons} aria-hidden="true">
    <div className={styles.cameraBtn}>MENU</div>
    <div className={styles.cameraBtn}>WB</div>
    <div className={styles.cameraBtn}>QUAL</div>
    <div className={styles.cameraBtnIcon}>🔍</div>
    <div className={styles.cameraBtnIcon}>info</div>
  </div>

  {/* LCD screen */}
  <div className={styles.lcdScreen} aria-hidden="true">
    <span className={styles.nikonLogo}>Nikon</span>
  </div>

  {/* Right controls */}
  <div className={styles.rightControls} aria-hidden="true">
    <div className={styles.aeLockBtn}>AE-L<br/>AF-L</div>
    <div className={styles.dpad}>
      <div className={styles.dpadCenter}>OK</div>
    </div>
    <div className={styles.iBtn}>i</div>
    <div className={styles.lvBtn}>Lv</div>
  </div>

  {/* Grip */}
  <div className={styles.grip} aria-hidden="true" />
</div>
```

**Key CSS for camera body:**

```css
.cameraBody {
  position: relative;
  max-width: 560px;
  aspect-ratio: 136 / 104;
  background: linear-gradient(165deg, #1e1e20 0%, #0e0e10 40%, #161618 100%);
  border-radius: 8px;
  border: 1.5px solid rgba(58,58,61,0.6);
  box-shadow:
    inset 0 1px 3px rgba(255,255,255,0.03),
    inset 0 -2px 4px rgba(0,0,0,0.3),
    0 20px 80px rgba(0,0,0,0.6);
}

.lcdScreen {
  position: absolute;
  left: 18%;
  top: 35%;
  width: 52%;
  height: 48%;
  background: #050507;
  border: 1.5px solid rgba(46,46,49,0.7);
  border-radius: 4px;
  box-shadow: inset 0 2px 8px rgba(0,0,0,0.5);
}

.eyepieceWindow {
  width: 50px;
  height: 36px;
  background: #0a0a0c;
  border: 2px solid rgba(46,46,49,0.8);
  border-radius: 3px;
}

.grip {
  position: absolute;
  right: 0;
  top: 20%;
  width: 14%;
  height: 65%;
  background: repeating-linear-gradient(
    to bottom, #161618 0px, #161618 3px, #1e1e20 3px, #1e1e20 6px
  );
  border-radius: 0 8px 8px 0;
  border-left: 1px solid rgba(46,46,49,0.4);
}

.flashUnit {
  position: relative;
  width: 60px;
  height: 8px;
  background: linear-gradient(to bottom, #2e2e31, #1a1a1c);
  border-radius: 2px 2px 0 0;
  transform-origin: bottom center;
  transition: transform 300ms ease-out;
}

.flashUnit.open {
  transform: rotateX(-75deg);
}
```

### Step 3: Build `useHeroZoom.ts` (scroll-driven zoom-out)

**Hook API:**

```typescript
interface UseHeroZoomOptions {
  trackRef: RefObject<HTMLDivElement>;
  viewportRef: RefObject<HTMLDivElement>;
  viewfinderRef: RefObject<HTMLDivElement>;
  cameraRef: RefObject<HTMLDivElement>;
  eyepieceRef: RefObject<HTMLDivElement>;
  flashOverlayRef: RefObject<HTMLDivElement>;
  flashUnitRef: RefObject<HTMLDivElement>;
  enabled: boolean;  // false during boot, true after t=10000ms
  onFlashComplete: () => void;  // callback to normalize scroll
}
```

**Key principle — no crop-in**: The viewfinder starts at whatever size it was during the boot (its natural 860px/3:2 frame). The zoom ONLY shrinks. It does not first scale up to fill the viewport and then shrink. The effect is a pure pull-back from the current view.

**Scroll math (canonical — from roadmap):**

```typescript
const scrollTrackHeight = 4 * window.innerHeight;
const scrubRange = scrollTrackHeight - window.innerHeight;

// Measure viewfinder at its current boot size (NOT the viewport)
const bootWidth = viewfinderRef.current.getBoundingClientRect().width;
// Measure the eyepiece target on the D7500 body
const eyepieceWidth = eyepieceRef.current.getBoundingClientRect().width; // ~50px
// Scale goes from 1 (boot size) DOWN to minScale (eyepiece size)
const minScale = eyepieceWidth / bootWidth;

// On scroll (rAF-throttled):
const trackTop = trackRef.current.getBoundingClientRect().top;
const progress = Math.min(1, Math.max(0, (-trackTop) / scrubRange));
```

**Phase mapping:**

```typescript
// Caption fade-out (0.00→0.10)
const captionOpacity = 1 - Math.min(1, progress / 0.10);

// Data strip fade-out (0.05→0.15)
const dataStripOpacity = 1 - Math.min(1, Math.max(0, (progress - 0.05) / 0.10));

// Viewfinder shrinks from boot size to eyepiece size (0.10→0.85)
const zoomProgress = Math.min(1, Math.max(0, (progress - 0.10) / 0.75));
const currentScale = 1 - (zoomProgress * (1 - minScale));  // 1 → minScale

// Camera body fade-in (0.15→0.50)
const cameraOpacity = Math.min(1, Math.max(0, (progress - 0.15) / 0.35));

// Flash trigger at progress ≥ 0.90
if (progress >= 0.90 && !hasFlashed) {
  triggerFlashSequence();
}
```

**Flash sequence:**

```typescript
function triggerFlashSequence() {
  hasFlashed = true;
  // 1. Pop-up flash opens (CSS animation, 300ms)
  flashUnitRef.current.classList.add('open');
  // 2. Brief pause (200ms)
  setTimeout(() => {
    // 3. Flash fires (white overlay)
    flashOverlayRef.current.classList.add('active');
    // 4. Camera body fades out during flash
    cameraRef.current.style.opacity = '0';
    // 5. After flash clears, normalize scroll
    setTimeout(() => {
      onFlashComplete();
    }, 800);
  }, 500);
}
```

**DOM structure:**

```html
<div class="hero-track" style="min-height: {scrollTrackHeight}px">
  <div class="hero-viewport">  <!-- position: sticky; top: 0; height: 100vh -->
    <!-- D7500 rear body (fades in during zoom) -->
    <div class="camera-body" style="opacity: {cameraOpacity}">
      ...camera elements...
    </div>
    <!-- Viewfinder content (scales down during zoom) -->
    <div class="viewfinder-zoom" style="transform: scale({currentScale})">
      ...5 viewfinder layers...
    </div>
    <!-- Flash overlay (z-index 9999) -->
    <div class="flash-overlay"></div>
  </div>
</div>
```

### Step 4: Focus Hunt Animation

Same as roadmap spec. 7.5s blur hunt (1800ms→9300ms).

```css
@keyframes focusHunt {
  0%   { opacity: 0.3; filter: blur(8px); }
  100% { opacity: 1; filter: blur(0); }
}
```

### Step 5: Flash Animation

```css
@keyframes flashPopUp {
  0%   { transform: rotateX(0deg); }
  100% { transform: rotateX(-75deg); }
}

@keyframes heroFlash {
  0%   { opacity: 0; }
  5%   { opacity: 1; }
  30%  { opacity: 0.95; }
  60%  { opacity: 0.4; }
  100% { opacity: 0; }
}

.flashOverlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: white;
  opacity: 0;
  pointer-events: none;
}

.flashOverlay.active {
  animation: heroFlash 800ms ease-out forwards;
}
```

### Step 6: Reduced Motion Fallback

```css
@media (prefers-reduced-motion: reduce) {
  /* Boot: all layers immediately visible; no AF; no blur */
  /* Zoom-out: skip entirely — no scale animation, no camera body */
  /* Flash: skip — no white overlay */
  /* User scrolls directly from hero caption to #darkroom */
}
```

In the component: check `window.matchMedia('(prefers-reduced-motion: reduce)')`. If true:
- Boot: skip timer chain, render everything in final state
- Zoom-out: do not set up scroll listener, do not render camera body
- Flash: skip entirely
- CTA `[ SCROLL TO DARKROOM ]` works as a simple anchor scroll

### Step 7: Mobile Adaptations

| Breakpoint | Adaptation |
|------------|-----------|
| ≤768px | Viewfinder frame `aspect-ratio: 4/3`; eyepiece hidden; data strip 11px; meter/owner hidden; headline 40px. Camera body scales to fit; hide some button labels. Scroll track `3 × vh`. |
| ≤360px | Headline 28px; data strip 10px; camera body simplified (fewer button details). |

### Step 8: Page Integration (M2.5)

```tsx
// page.tsx
<section id="hero" aria-label="Introduction">
  <HeroBoot />  {/* Contains boot + zoom-out + camera + flash */}
</section>
```

- No `body { overflow: hidden }` lock
- After flash clears, `#darkroom` section below is in normal scroll flow
- No router push
- Hero scroll track provides `min-height` for zoom-out

---

## File Deliverables

| File | Purpose |
|------|---------|
| `src/components/HeroBoot.tsx` | Viewfinder boot + zoom-out orchestration |
| `src/components/HeroBoot.module.css` | Boot styling (viewfinder layers) |
| `src/components/D7500Rear.tsx` | CSS replica of D7500 rear |
| `src/components/D7500Rear.module.css` | Camera body styling |
| `src/components/useHeroZoom.ts` | Scroll-driven zoom-out + flash hook |
| `src/app/page.tsx` | Hero section integration |

---

## Definition of Done Checklist

### Boot Phase
- [ ] Cold load → empty VF → AF appears → center red glow → hero focus starts → AF invisible at lock → brackets/cross replace AF → focus dot green → caption fades in
- [ ] Data strip is BELOW the frame line, in its own dark panel
- [ ] Headline center-locked inside glass (`left: 50%`, `top: 28%`, `transform: translateX(-50%)`)
- [ ] AF pattern: only center rectangle is red; all others neutral
- [ ] AF-to-lock handoff strict: AF invisible before lock brackets appear
- [ ] `SHUTTER: ARMED` appears and disappears (never permanent)

### Zoom-Out Phase
- [ ] Scroll after boot → viewfinder scales down smoothly
- [ ] D7500 rear body fades in around the shrinking viewfinder
- [ ] Caption + data strip fade out at the start of zoom
- [ ] Viewfinder content lands at the eyepiece position on the camera
- [ ] Camera body is recognizable: LCD, eyepiece, buttons, grip, mode dial, Nikon logo

### Flash Phase
- [ ] Pop-up flash unit flips open with visible mechanical animation
- [ ] Flash fires: full white screen (800ms)
- [ ] Camera body fades out during flash peak
- [ ] Flash clears → `#darkroom` section visible
- [ ] Scroll normalizes after flash (user continues into darkroom)

### Cross-Cutting
- [ ] Reduced motion: all boot layers immediate; no zoom-out; no flash; simple anchor scroll
- [ ] Mobile 320px: no horizontal scroll, headline readable, camera body fits viewport
- [ ] Lighthouse: no layout shift (reserve `min-height` on scroll track)
- [ ] `npm run build` && `npm run lint` pass

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Scale math produces jank at large zoom ratios | HIGH | Test on 1440px and 320px; cap maxScale to prevent absurd values |
| D7500 CSS art looks off | MEDIUM | Focus on key recognizable features (LCD, eyepiece, buttons, grip); don't over-detail |
| Flash feels too abrupt | LOW | 200ms delay between flash-open and flash-fire; 800ms flash duration |
| Scroll track height fight with darkroom scroll | MEDIUM | Hero flash clears and track collapses before darkroom track begins |
| 10s boot + zoom feels too long | LOW | Boot is intentionally slow for presence; zoom is user-controlled scroll |
| Timer chain leaks on unmount | HIGH | Clean up all setTimeout refs in useEffect return |
| Camera body not visible on mobile | MEDIUM | Scale camera proportionally; hide minor buttons on small screens |

---

## Agent Prompts (execute in order)

### Prompt A — Viewfinder Boot (HeroBoot.tsx rewrite)

```
Rewrite src/components/HeroBoot.tsx and HeroBoot.module.css to implement the D7500 optical viewfinder boot per plan/M2-hero-boot.md Step 1.

Requirements:
- 5-layer viewfinder: eyepiece vignette → frame corners → glass (HUD, 51 AF points, headline, ARMED, focus dot) → data strip → caption
- Boot timing per table (0ms → 10000ms)
- Focus hunt: blur 8px→0 over 7.5s, exactly 2 passes
- AF-to-lock handoff: AF invisible BEFORE lock brackets appear
- Data strip BELOW glass with exposure meter graphic
- Reduced motion: everything visible immediately, no AF, no blur
- Mobile ≤768px: 4/3 aspect, no eyepiece, headline 40px
- CSS Modules only, no inline style={{}}

At this stage, the viewfinder should fill the viewport. Zoom-out comes next.
Do NOT implement zoom-out or camera body yet.
```

### Prompt B — D7500 Rear Body (CSS replica)

```
Create src/components/D7500Rear.tsx and D7500Rear.module.css — a CSS-only replica of the Nikon D7500 camera rear per plan/M2-hero-boot.md Step 2.

Reference images are in the project assets. Key features to replicate:
- Camera body: dark matte, aspect-ratio 136/104, rounded corners
- LCD screen: large dark rectangle, center area
- Viewfinder eyepiece: raised rectangular bump, top center
- Left buttons: MENU, WB, QUAL, magnify, info (small labeled rectangles)
- Right controls: D-pad with OK, AE-L/AF-L, i, Lv buttons
- Mode dial: top-left, circular with knurled edge
- Grip: textured right side
- Pop-up flash unit: closed position at top, flush with body
- Nikon logo: below LCD

All elements aria-hidden="true" (decorative).
Pop-up flash must support .open class that rotates it upward.
CSS Modules only.
```

### Prompt C — Zoom-Out + Flash (useHeroZoom.ts)

```
Create src/components/useHeroZoom.ts and wire it into HeroBoot per plan/M2-hero-boot.md Steps 3-5.

Requirements:
- Scroll-driven zoom-out: viewfinder scales from viewport-filling to natural eyepiece size
- D7500 body fades in as viewfinder shrinks
- Caption + data strip fade out early in zoom
- At progress 0.90: pop-up flash opens (300ms CSS animation)
- At progress 0.95: flash fires (full white overlay, 800ms, z-index 9999)
- Flash clears → darkroom section visible below
- Scroll track: 4 × innerHeight
- rAF-throttled scroll listener
- ResizeObserver for recalc
- Reduced motion: skip zoom and flash entirely
- Mobile: scroll track 3 × vh, camera scales to fit

Flash keyframes in HeroBoot.module.css.
Wire D7500Rear component into HeroBoot.
```

### Prompt D — Page Integration

```
Wire the complete hero (boot + zoom-out + flash) into src/app/page.tsx per plan/M2-hero-boot.md Step 8.

Requirements:
- <section id="hero" aria-label="Introduction"> wrapping HeroBoot
- After flash clears, #darkroom section is in normal scroll flow
- No body overflow:hidden lock
- No router push
- Verify anchor navigation works (#hero → #darkroom)
- Run npm run build && npm run lint
```

---

## Commit Message

```
feat(v3.3): hero boot + viewfinder zoom-out + D7500 rear + flash → darkroom
```
