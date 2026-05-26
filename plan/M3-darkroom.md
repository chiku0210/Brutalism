# M3 — The Darkroom (Film Negative Reel)

**Status**: NOT STARTED  
**Spec ref**: Section [04] of `nielless-portfolio-design-spec-v3.html`  
**Estimated effort**: 6–8 hours  
**Complexity**: HIGH  
**Depends on**: M2 complete

---

## Summary

The Darkroom is the portfolio's centerpiece section. Projects are presented as **camera negatives on a horizontal 35mm film strip**. Vertical scroll scrubs the strip leftward on desktop. Each frame shows a concise `negativeSummary`. Clicking `[ DEVELOP ]` opens a full-screen positive print modal with the brass gate wipe animation.

---

## Architecture Diagram

```
#darkroom (section)
└── .darkroom-track (min-height: scrollTrackHeight)
    └── .darkroom-viewport (position: sticky; top: 0; overflow: hidden)
        └── .film-reel (display: flex; transform: translate3d)
            ├── FilmNegative (PROD_001)
            ├── FilmNegative (PROD_002)
            ├── FilmNegative (PROD_003)
            ├── FilmNegative (PROD_004)
            ├── LeaderTape ([PRODUCTION] / [LAB])
            ├── FilmNegative (SYSTEM_001)
            ├── FilmNegative (SYSTEM_002)
            ├── FilmNegative (SYSTEM_003)
            └── FilmNegative (SYSTEM_004)

PositivePrintModal (portal, z-index: 500)
└── .modal-overlay (backdrop)
    ├── .print-wipe (brass gate animation layer, z-index: 2)
    └── .print-content (project details, z-index: 1)
```

---

## Sub-Milestones & Execution Order

### M3.1 — Data Layer (`src/data/projects.ts`)

**Create first — all UI components depend on this.**

#### Type Definitions

```typescript
type ProjectTier = "production" | "pet";
type ProjectStatus = "LIVE" | "REGULATED" | "ACTIVE" | "ARCHIVED";

interface NegativeSummary {
  slug: string;
  tier: ProjectTier;
  sortOrder: number;
  counter: string;           // e.g. "PROD_001"
  title: string;             // e.g. "UHC STORE"
  negativeSummary: string;   // ~120 chars on film frame
  status?: ProjectStatus;
}

interface PrintDetails {
  period?: string;           // e.g. "JUL 2022 — PRESENT · @PUBLICIS"
  bullets: string[];         // 1-3 role bullets
  techTags: string[];        // e.g. ["NEXT.JS", "REDUX", "AWS"]
  watermark?: string;        // optional subtle text
  links?: { label: string; href: string }[];
}

interface Project extends NegativeSummary {
  printDetails: PrintDetails;
}
```

#### Data (8 projects, locked copy)

| # | `slug` | `counter` | `title` | `negativeSummary` |
|---|--------|-----------|---------|-------------------|
| 1 | `uhc-store` | PROD_001 | UHC STORE | Greenfield UHC storefront + admin (Next.js/Redux). 100K+ monthly sessions; LSA/HSA integrations. |
| 2 | `uhc-canary` | PROD_002 | CANARY PIPELINE | Canary deployment pipeline for UHC microservices. Phased rollouts cut critical release risk by 40%. |
| 3 | `wci-backend` | PROD_003 | WCI BACKEND APIs | Carbon cap-and-trade allocation APIs. PostgreSQL transactions enforce 10% annual corporate cap cuts. |
| 4 | `wci-migration` | PROD_004 | WCI MIGRATION | Python/DynamoDB → Node.js/PostgreSQL. Zero-downtime regulated cutover; 100% data consistency. |
| 5 | `orion` | SYSTEM_001 | ORION | Voice-first AI assistant. End-to-end orchestration for low-latency LLM inference and Whisper STT. |
| 6 | `repwise` | SYSTEM_002 | REPWISE | Full-stack workout tracker. Agentic SDLC automated ~80% of PRs; unified TypeScript across Supabase + UI. |
| 7 | `gita-reader` | SYSTEM_003 | GITA READER | Offline-first React Native app. Python/OCR ingests legacy PDFs; FTS5 search over 700+ verse records. |
| 8 | `agentic-sys` | SYSTEM_004 | AGENTIC SYS. | Multi-agent Node.js system. Handoff + Promise.all fan-out/fan-in for parallel LLM task execution. |

#### Exports

```typescript
export const productionProjects: Project[];  // sorted by sortOrder
export const petProjects: Project[];
export function getProjectsByTier(tier: ProjectTier): Project[];
export function getAllProjects(): Project[];  // full strip order
```

#### Print Details (per project)

Fill `period`, `bullets` (1-3), `techTags` from `assets/resume-content-superset.md`. Example:

```typescript
{
  slug: "uhc-store",
  // ...negativeSummary fields...
  printDetails: {
    period: "JUL 2022 — PRESENT · @PUBLICIS",
    bullets: [
      "Built UnitedHealthCare e-commerce storefront from greenfield (Next.js, Redux).",
      "Architected greenfield internal Admin Application for inventory management.",
      "Maintained 95%+ unit test coverage on critical UI paths."
    ],
    techTags: ["NEXT.JS", "REDUX", "AWS"],
    watermark: "PROD_001"
  }
}
```

---

### M3.2 — Film Strip UI (Static First)

**Goal**: Render the full film strip without scroll scrub. Visual fidelity first.

#### Files to Create

| File | Purpose |
|------|---------|
| `src/components/projects/DarkroomSection.tsx` | Section wrapper with SectionShell |
| `src/components/projects/FilmStrip.tsx` | Container with viewport + reel |
| `src/components/projects/FilmNegative.tsx` | Individual negative frame |
| `src/components/projects/LeaderTape.tsx` | Divider between prod/lab |
| `src/components/projects/DarkroomSection.module.css` | Section styles |
| `src/components/projects/FilmStrip.module.css` | Strip layout |
| `src/components/projects/FilmNegative.module.css` | Frame visuals |
| `src/components/projects/LeaderTape.module.css` | Tape styles |

#### `DarkroomSection.tsx` Structure

```tsx
<section id="darkroom" className={styles.section}>
  <SectionShell 
    label="[04] THE DARKROOM" 
    title="DARKROOM" 
    meta="8 NEGATIVES · 4 PROD · 4 LAB" 
  />
  <FilmStrip projects={getAllProjects()} onDevelop={handleDevelop} />
  <PositivePrintModal project={activeProject} onClose={handleClose} />
</section>
```

#### `FilmNegative.tsx` Visual Spec

```css
.negative {
  flex: 0 0 clamp(280px, 72vw, 420px);  /* includes gap */
  background: #1a1208;                    /* orange mask */
  border: 1px solid var(--brass-dim);
  padding: 14px 16px;
  position: relative;
  box-shadow: inset 0 0 24px rgba(0,0,0,0.4);
}
```

**Sprocket holes**: top and bottom pseudo-elements with repeating-linear-gradient.

**Content per frame**:
- Counter: `PROD_001` (9px mono, brass-dim)
- Title: `UHC STORE` (display font, 22px, muted warm)
- Summary: 10px mono, muted orange, 1.65 line-height
- CTA: `[ DEVELOP ]` button (10px mono, brass on hover)
- Status badge: optional (LIVE / REGULATED / ACTIVE)

**Accessibility**:
- `role="article"`
- `aria-label="{title} {tier} negative"`
- `id="project-{slug}"`
- `tabindex="0"` for keyboard focus

#### `LeaderTape.tsx` Visual Spec

```css
.leader {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px dashed var(--border);
  border-right: 1px dashed var(--border);
}
```

Content: `[ PRODUCTION ]` label + `DEPLOYED SYSTEMS` sub + `[ LAB ]` label + `BUILT SYSTEMS` sub.

---

### M3.3 — Scroll Scrub (`useFilmScroll.ts`)

**This is the most complex piece. Follow roadmap formulas EXACTLY.**

#### File: `src/components/projects/useFilmScroll.ts`

#### Canonical Scroll Math (from roadmap — do NOT deviate)

```typescript
// Measure after layout
const stripWidth = filmReelRef.current.scrollWidth;
const viewportWidth = viewportRef.current.clientWidth;  // NOT 100vw; subtract page padding

// Horizontal travel
const maxTravel = Math.max(0, stripWidth - viewportWidth);

// Vertical dimensions
const scrollTrackHeight = maxTravel + window.innerHeight;
// Set this as min-height on .darkroom-track

const scrubRange = scrollTrackHeight - window.innerHeight;

// On scroll (rAF-throttled):
const trackTop = darkroomTrackRef.current.getBoundingClientRect().top;
const progress = Math.min(1, Math.max(0, (-trackTop) / scrubRange));
const translateX = -(progress * maxTravel);

// Apply:
filmReelRef.current.style.transform = `translate3d(${translateX}px, 0, 0)`;
```

#### Critical Rules

1. **`maxTravel`** is HORIZONTAL (strip − viewport). Never name it `trackHeight`.
2. **`scrollTrackHeight`** is the VERTICAL min-height of the track element.
3. **`scrubRange`** = `scrollTrackHeight − innerHeight` — this is the vertical scroll distance that maps to 0→1 progress.
4. **Endpoints**: `progress === 0` → first frame left-aligned; `progress === 1` → last frame fully visible.
5. **Apply**: `translate3d` — GPU composited, one write per rAF.
6. **Banned**: CSS `animation-timeline: scroll()` as primary (conflicts with sticky).

#### Hook API

```typescript
interface UseFilmScrollOptions {
  trackRef: RefObject<HTMLDivElement>;
  viewportRef: RefObject<HTMLDivElement>;
  reelRef: RefObject<HTMLDivElement>;
  enabled: boolean;  // false on mobile / reduced-motion
}

function useFilmScroll(opts: UseFilmScrollOptions): void {
  // Sets up:
  // 1. scroll listener (rAF-throttled)
  // 2. ResizeObserver on track + strip
  // 3. Cleanup on unmount
}
```

#### ResizeObserver Recalc

On resize of track or strip, recalculate:
- `stripWidth`
- `viewportWidth`
- `maxTravel`
- `scrollTrackHeight` (update CSS min-height on track)
- `scrubRange`

#### DOM Structure for Scroll Scrub

```html
<div class="darkroom-track" style="min-height: {scrollTrackHeight}px">
  <div class="darkroom-viewport">  <!-- position: sticky; top: 0; height: 100vh; overflow: hidden -->
    <div class="film-reel">  <!-- transform: translate3d({translateX}px, 0, 0) -->
      <!-- negatives + leader -->
    </div>
  </div>
</div>
```

#### Mobile (≤768px)

- **No sticky scrub**
- `.film-reel`: `overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch`
- Frame size: `min(85vw, 320px)` + `scroll-snap-align: start`
- Leader tape: `min(85vw, 280px)` + `scroll-snap-align: center`
- Hint text changes to `[ swipe → ]`
- Track height: `auto` (no artificial height)

#### Reduced Motion

- Stacked negatives or horizontal overflow only — no scroll scrub
- No sticky behavior

---

### M3.4 — Positive Print Modal (`PositivePrintModal.tsx`)

#### File: `src/components/projects/PositivePrintModal.tsx`

#### Behavior (from roadmap — LOCKED)

1. Modal does NOT slide in
2. Overlay mounts at full size immediately (z-index 500, backdrop `rgba(6,6,8,0.94)`)
3. `.print-content` (z-index 1) already in DOM at `opacity: 0`
4. `.print-wipe` layer (z-index 2, `pointer-events: none`) animates:
   - 1px brass vertical bar at leading edge
   - `scaleX(0→1)` sweep LEFT → RIGHT in 180ms (`ease-out`)
   - Then wipe layer fades out (`opacity → 0` at 100% keyframe)
5. At 160ms after open, `.print-content` fades in over 120ms
6. Result: projector gate pass → developed print appears

#### CSS Keyframes (production — from roadmap)

```css
@keyframes brassGateWipe {
  0%   { transform: scaleX(0); transform-origin: left; opacity: 1; }
  70%  { transform: scaleX(1); transform-origin: left; opacity: 1; }
  100% { transform: scaleX(1); opacity: 0; }
}

.printWipe {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(90deg, var(--brass) 0%, var(--brass) 1px, transparent 1px);
  animation: brassGateWipe 180ms ease-out forwards;
}

.printContent {
  position: relative;
  z-index: 1;
  opacity: 0;
  animation: printFadeIn 120ms ease 160ms forwards;
}

@keyframes printFadeIn { from { opacity: 0; } to { opacity: 1; } }
```

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .printWipe { display: none; }
  .printContent { opacity: 1; animation: none; }
}
```

#### Modal Features

- **Body scroll lock**: set `document.body.style.overflow = 'hidden'` on open, restore on close
- **Focus trap**: trap Tab within modal; return focus to trigger on close
- **Close**: `[ × ]` button + Escape key + backdrop click
- **Content layout**:
  - Project title (display font, large)
  - Period (mono, muted)
  - Bullets (serif or mono, list)
  - Tech tags (tag utility classes)
  - Links (if available)
  - Watermark (subtle corner text)

---

### M3.5 — Page Integration

#### `ScrollHint.tsx`

```tsx
// Fixed bottom-right; 9-10px mono; color: var(--muted2); pointer-events: none
// Hidden when print modal is open
// Desktop: "scroll down" or "↓"
// Mobile ≤768px in darkroom: "[ swipe → ]"
```

- Z-index: 90
- Static only — no pulse animation

#### `page.tsx` Update

Replace the darkroom stub with:
```tsx
<DarkroomSection />
```

#### Header Nav

Verify `DARKROOM` anchor link works: `href="#darkroom"` → scrolls to section.

#### Legacy Redirects

Ensure `/#engine` and `/engine` redirect to `/#darkroom` (should already be handled in M0 via `next.config.ts`).

---

## Definition of Done Checklist

- [ ] Vertical scroll through `#darkroom` (desktop) scrubs film strip per spec math
- [ ] `progress === 0` → first frame left-aligned; `progress === 1` → last frame fully visible
- [ ] Mobile ≤768px: horizontal strip scroll with snap; no nested scroll trap
- [ ] Each negative shows `negativeSummary` text; modal shows full `printDetails`
- [ ] `[ DEVELOP ]` button triggers modal with brass gate wipe
- [ ] Modal: body scroll locked, focus trapped, Escape closes, backdrop click closes
- [ ] Brass gate wipe: 180ms scaleX sweep, then content fades in at 160ms
- [ ] `ScrollHint` visible until modal open
- [ ] No prev/next carousel; no Framer Motion in darkroom components
- [ ] ResizeObserver recalculates on viewport/strip resize
- [ ] Reduced motion: no scrub; horizontal overflow or stacked; modal content instant
- [ ] `npm run build` passes
- [ ] No horizontal page-level overflow on any breakpoint

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Scroll math off-by-one causes jank at endpoints | HIGH | Test progress at 0 and 1; verify first/last frames fully visible |
| Sticky + overflow conflict | MEDIUM | Use `overflow: hidden` on viewport only, not on track |
| Modal focus trap incomplete | MEDIUM | Use native `<dialog>` element or manual trap with known library pattern |
| Mobile scroll snap interferes with page scroll | HIGH | Ensure single axis scroll; `overscroll-behavior: contain` on reel |
| Leader tape breaks flex layout | LOW | Fixed width (200px desktop, 280px mobile); test in strip |

---

## Agent Prompts (execute in order)

### Prompt A — Data Layer
```
Create src/data/projects.ts with the full project data model per M3.1 in plan/M3-darkroom.md.
Include all 8 projects with complete negativeSummary and printDetails.
Export productionProjects, petProjects, getProjectsByTier(), getAllProjects().
Type-strict TypeScript. No placeholder data.
```

### Prompt B — Static Film Strip
```
Build the static film strip UI (M3.2): DarkroomSection, FilmStrip, FilmNegative, LeaderTape.
All in src/components/projects/ with CSS Modules.
Use data from src/data/projects.ts.
Match visual spec: orange-mask background, sprocket pseudo-elements, locked typography.
No scroll scrub yet — just the static horizontal strip.
```

### Prompt C — Scroll Scrub
```
Implement useFilmScroll.ts hook per the canonical scroll math in plan/M3-darkroom.md.
Wire into FilmStrip: .darkroom-track (min-height), .darkroom-viewport (sticky), .film-reel (translate3d).
ResizeObserver for recalc. rAF-throttled scroll listener.
Mobile ≤768px: overflow-x auto + scroll-snap, no sticky.
Reduced motion: no scrub.
```

### Prompt D — Modal + Integration
```
Build PositivePrintModal.tsx with brass gate wipe animation.
Wire [ DEVELOP ] buttons to open modal with correct project data.
Add ScrollHint.tsx (hidden when modal open).
Integrate DarkroomSection into page.tsx replacing the stub.
Body scroll lock, focus trap, Escape/backdrop close.
```

---

## Commit Message

```
feat(v3.3): darkroom film negative reel with develop modal
```
