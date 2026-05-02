# NIELLESS.COM — Portfolio Design Specification
**Rev 1.0 | Modern Brutalism × Mechanical Elegance**
*Full-Stack Portfolio for Nielless Acharya — nielless.com*

---

## 00 — Design Philosophy

The site operates as a **system boot sequence**, not a greeting. The visitor doesn't scroll through a portfolio — they *initiate* one. Every interaction should feel like turning a physical dial or pressing a mechanical key: deliberate, weighted, with consequence.

**Core principles encoded into the design:**
- Order. Logic. Amor Fati.
- No smiling headshots. No "Hi, I'm a developer."
- Negative space is structural, not decorative.
- Sound is an opt-in layer, not background noise.
- The system either holds under load, or gets rebuilt until it does.

---

## 01 — Design System

### Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `--void` | `#060608` | Page background, deepest surfaces |
| `--surface` | `#0E0E10` | Card backgrounds, elevated panels |
| `--surface2` | `#161618` | Nested containers, code blocks |
| `--grid` | `#222224` | Subtle grid lines, dividers |
| `--border` | `#2E2E31` | Card borders (default) |
| `--border2` | `#3A3A3D` | Card borders (hover state) |
| `--brass` | `#C8A96E` | Primary accent — active states, labels, CTA |
| `--brass-dim` | `#8A7249` | Brass borders, secondary brass |
| `--brass-bright` | `#E2C48A` | Brass on hover |
| `--signal` | `#39FF14` | Live/active status indicators only |
| `--hot` | `#FF4D1A` | Regulated/warning tags |
| `--ice` | `#A8C8E8` | Cloud/AWS tags |
| `--dust` | `#E8E2D5` | Primary text (warm white, not pure white) |
| `--muted` | `#606068` | Secondary text, descriptions |
| `--muted2` | `#404044` | Tertiary text, timestamps |

> **Rule:** `--brass` is load-bearing. Use it sparingly — active nav states, section counters, CTA borders, and one accent per card. Overusing it kills it.

---

### Typography System

Three fonts with distinct roles. The contrast between them *is* the personality.

```
Display:   Bebas Neue
           → All headings, hero text, project titles
           → Brutalist, industrial, zero warmth
           → Letter-spacing: 0.04–0.06em

Mono:      JetBrains Mono (weights: 300, 400, 500)
           → All UI labels, nav items, tech tags, terminal blocks
           → Letter-spacing: 0.08–0.15em on uppercase labels
           → The "voice" of the system

Serif:     Crimson Pro (400 regular, 400 italic, 600 semibold)
           → Philosophical asides, Analog Soul section descriptions
           → Soft contrast against the cold grid everywhere else
           → The "soul" underneath the system
```

### Type Scale

| Role | Font | Size | Weight | Usage |
|---|---|---|---|---|
| Hero | Bebas Neue | 58–72px | 400 | "ORDER. LOGIC. AMOR FATI." |
| Section title | Bebas Neue | 40px | 400 | Section headers |
| Project title | Bebas Neue | 24px | 400 | Card titles |
| Section label | JetBrains Mono | 10px | 500 | `[02] THE ENGINE`, counters |
| UI label | JetBrains Mono | 9–10px | 400 | Tech tags, timestamps |
| Terminal | JetBrains Mono | 13px | 400 | Boot text, code blocks |
| Body prose | Crimson Pro | 15–17px | 400 italic | Philosophy, analog descriptions |
| Quote | Crimson Pro | 18px | 400 italic | Pull quotes, footer line |

---

### Spacing & Grid

- **Base unit:** 8px
- **Page padding:** 36px horizontal (desktop), 20px (mobile)
- **Section gap:** 80px vertical between sections
- **Card padding:** 20px internal
- **Grid:** 2-column for project cards, 3-column for analog panels
- **Max content width:** 1100px, centered

---

## 02 — Hero / The Boot Sequence

### Concept
No headshot. No introductory paragraph. The page *boots*.

### Layout
```
┌─────────────────────────────────────────────────────────┐
│  N/A                    ENGINE  ANALOG  BLUEPRINT  [CONTACT] │
│                                                               │
│  [BOOT] nielless.com — v4.0.0-production                    │
│  ▸ Loading systems...                                        │
│  ▸ All systems nominal.              (terminal, brass-green)  │
│                                                               │
│  ORDER.                              NODE.JS                  │
│  LOGIC.                              POSTGRESQL               │
│  AMOR FATI.          (58px Bebas)    TYPESCRIPT               │
│                                      AWS                      │
│  Full-Stack Engineer. AI-native      NEXT.JS          (9px   │
│  builder. Backend-first. Systems     LLM AGENTS        mono, │
│  that hold under load — or are       (scroll loop,  #2E2E31) │
│  rebuilt until they do.              very slow)               │
│                                                               │
│  [ COMPILE → ]                                               │
└─────────────────────────────────────────────────────────┘
```

### Animation Sequence (on load)
1. **0ms** — Page is void black. Nothing visible.
2. **200ms** — Terminal lines type in one by one (30ms per char typewriter effect). Color: `#39FF14` for "All systems nominal."
3. **800ms** — "ORDER." fades + slides up 12px into position.
4. **950ms** — "LOGIC." follows.
5. **1100ms** — "AMOR FATI." follows, in `--brass`.
6. **1300ms** — Subtext fades in (Crimson Pro).
7. **1500ms** — `[ COMPILE → ]` button fades in.
8. **Ongoing** — Right-side tech stack tickers scroll upward on a slow, seamless loop.

### The "COMPILE" Interaction
- On hover: button border transitions from `--brass-dim` → `--brass-bright` (120ms ease). Subtle mechanical click via Web Audio API (80ms sine burst at 180Hz — solenoid feel).
- On click: fullscreen brass-line horizontal wipe (180ms) → scroll lock releases → rest of page reveals.

### Nav
- Sticky top nav. Left: `N/A` in brass mono (10px, 0.15em tracking).
- Right: `ENGINE  ANALOG  BLUEPRINT` in muted mono + `[CONTACT]` with brass border.
- On scroll: nav background transitions from transparent → `rgba(6,6,8,0.92)` with 1px bottom border.
- **Left-edge vertical nav** (fixed): 4 short tick marks (one per section), active tick lit in brass with a slow 2s pulse. No labels.
- **Sound toggle:** speaker SVG icon in nav. Muted by default. One click activates all hover sounds globally.

---

## 03 — The Engine / System Schematics

### Concept
Projects are not portfolio cards. They are **system schematics** — blueprints of what was built and how it runs.

### Layout
2-column grid of schematic cards, 5 total. The 5th card (PRODUCTION_002 — WCI) sits **full-width** at the bottom of the grid to visually distinguish the two production entries from the personal projects above — and because the WCI migration arrow diagram benefits from more horizontal room.

Each card:
- Top-left: `PROJECT_001` / `PRODUCTION_001` counter in 9px brass mono
- Title in 24px Bebas
- Status badge (top-right): `LIVE` in signal green, or a status indicator dot
- A minimal data visualization unique to the project (waveform bars, pipeline flow, progress bar, fan-out diagram, migration arrow)
- 2-line description in 10px muted mono
- Tech stack as bordered tags with `→` or `+` connectors

### Five Schematics

**PROJECT_001 — ORION**
- Unique element: animated waveform bars (12 bars, staggered heights) representing voice input
- Pipeline visualization: `WHISPER → GROQ → TTS` with arrow connectors
- Hover: waveform bars animate (staggered oscillation, 600ms loop)
- Description: *Voice-native AI assistant. End-to-end agent orchestration.*

**PROJECT_002 — REPWISE**
- Unique element: progress bar at 80% with label "80% PR automation · 0 manual code"
- Status badge: `LIVE` in signal green
- Description: *AI-architected workout logger. Agentic SDLC from schema → deploy.*
- External link: repwise.in

**PROJECT_003 — AGENTIC SYSTEMS**
- Unique element: minimalist fan-out diagram (1 source node → 3 worker nodes → 1 aggregator)
- Description: *Promise.all fan-out/fan-in. Handoff + parallel execution.*

**PRODUCTION_001 — UHC (UnitedHealthCare)**
- Counter label: `PRODUCTION_001` in brass mono
- Unique element: session volume meter — a horizontal bar labeled `100K+ SESSIONS / MONTH` partially filled in `--brass`, with a secondary bar for `95%+ TEST COVERAGE` in `#2E2E31`
- Status badges: `LIVE` (signal green) · `NEXT.JS` (ice blue) · `COPILOT` (`#404044`)
- Watermark: `@PUBLICIS` in `#2E2E31` (barely visible)
- Description: *E-commerce store from greenfield. Canary pipeline. LSA/HSA integrations.*
- Expanded view bullet points:
  - Greenfield Next.js/Redux e-commerce serving 100K+ monthly sessions
  - Canary deployment pipeline → 40% reduction in critical release risk
  - Architecting Admin Portal + complex LSA/HSA payment integrations
  - GitHub Copilot-accelerated feature development
- Tech tags: `NEXT.JS → REDUX → AWS → GITHUB ACTIONS`

**PRODUCTION_002 — WCI (Carbon Trading)**
- Counter label: `PRODUCTION_002` in brass mono
- Unique element: a minimal migration flow diagram showing `PYTHON / DYNAMODB` → (arrow) → `NODE.JS / POSTGRESQL` with a small `100% CONSISTENCY` badge underneath. The left side (`PYTHON / DYNAMODB`) is rendered in `#2E2E31` (legacy/dead), the right side in `--dust` (live). The arrow is in `--brass`.
- Status badges: `REGULATED` (hot red) · `ZERO DOWNTIME` (`#404044`) · `AWS` (ice blue)
- Watermark: `@PUBLICIS` in `#2E2E31`
- Description: *Legacy Python/DynamoDB → Node.js/PostgreSQL. Carbon cap enforcement APIs.*
- Expanded view bullet points:
  - Re-architected data flow across 3 microservices (Privilege Mgmt, Users, Action Logging)
  - Transformation scripts ensuring 100% data consistency during zero-downtime cutover
  - Core allocation APIs for Carbon Emissions Cap-and-Trade system
  - Programmatically enforced 10% annual reduction in corporate carbon caps via PostgreSQL transactions
  - Strict audit compliance — regulated financial/environmental logic
- Tech tags: `NODE.JS → POSTGRESQL → PYTHON → AWS RDS`
- Note: The migration arrow visual is the signature of this card — it tells the whole story without a single word of explanation.

### Card Hover State
- Border: `#2E2E31` → `#C8A96E` (120ms ease)
- Background: `#0E0E10` → `#111113`
- Mechanical click sound on click

### Card Expanded State (on click)
Card expands to full-width modal/panel showing:
- Full architecture diagram (drawn in SVG)
- Tech stack breakdown table
- Key decisions and tradeoffs (3–4 bullet lines)
- Links (GitHub / Live URL where applicable)
- Close: `[ × ]` top right, same click sound

---

## 04 — The Analog Soul

### Concept
A stark section that grounds the digital persona in physical reality. The aesthetic deliberately shifts — warmer, slower, Crimson Pro italic takes over from JetBrains Mono.

### Layout
3-column panel grid, each with a 2px top accent border in its own color:

**Panel 1 — AUDIOPHILE** (brass top border)
- Visual: 8 EQ-style bars at varying heights in brass
- Hover: bars animate (staggered, 600ms loop — an actual EQ response)
- Hover sound: 300ms harmonium-like tone (Raag Bhairav Sa — Web Audio oscillator shaped to a harmonium timbre). *This is the audiophile easter egg.*
- Text (Crimson Pro italic, `--muted`): *Guitar · Ukulele · Keyboard · Bina No.8 · Hindustani Classical*
- Micro-label: `HOVER → PLAY RAAG BHAIRAV` in `#2E2E31` (barely visible — reward for curious visitors)

**Panel 2 — THE LENS** (`--border` top border)
- Visual: SVG lens/aperture diagram — concentric circles, aperture blades suggested
- Hover sound: 60ms shutter click (layered low thud + high transient via Web Audio)
- Text (Crimson Pro italic, `--muted`): *Optical truth over simulation. DSLR. Raw.*

**Panel 3 — DIESEL SOUL** (hot red top border)
- Visual: RPM bar meter, needle at 65% with `4500 RPM` label
- Hover sound: ~200ms low-frequency engine idle pulse (20–60Hz rumble via Web Audio)
- Text (Crimson Pro italic, `--muted`): *Ford EcoSport. Mechanical grunt. The honest machine.*

### Philosophy Strip (below panels)
Full-width, minimal border box:
> *"Memento Mori. The system will halt. Build well."*

Text: 18px Crimson Pro italic, `--dust`. Right side: `STOIC FRAMEWORK` in 9px mono `#2E2E31`.

---

## 05 — The Blueprint / Deployment History

### Concept
A timeline styled as a system log / deployment history. Clean, vertical, no decoration except the branch line and indicator dots.

### Layout
```
│  [04] THE BLUEPRINT
│  DEPLOYMENT HISTORY
│
│  │
│  ● NOW → ACTIVE
│  │  PRODUCT ENGINEERING MODE
│  │  Building AI-native systems. Full ownership...
│  │
│  ○  2022 → PRESENT
│  │  PUBLICIS SAPIENT — 4 YOE
│  │  Node.js/PostgreSQL backend. UHC 100K+...
│  │
│  ○  FEB–JUN 2022
│  │  PAYPAL INDIA — INTERN
│  │  Emerging Markets. Interoperability dashboard...
│  │
│  ○  2018–2022
│     BITS PILANI — B.E. CS
│     Hyderabad Campus. The foundation.
```

- Branch line: 1px `#2E2E31` vertical left border
- Active dot: 8px filled brass circle
- Past dots: 8px `#404044` circle
- Oldest dot: 8px `#2E2E31` circle
- Entry titles: 18px Bebas
- Timestamps: 9px brass mono for active, `#404044` for past
- Descriptions: 10px `--muted` mono

### Current Stack Snapshot (below timeline)
Terminal-style block:
```
$ current --stack
NODE.JS  TYPESCRIPT  POSTGRESQL  NEXT.JS  [LLM AGENTS]  [AGENTIC SDLC]  AWS  DOCKER
```
Brass-bordered tags for AI/agentic items. Muted-bordered tags for the rest.

---

## 06 — Micro-Details & Interactions

### Custom Cursor
- Default: 12×12 brass ring (no fill, 1px stroke in `--brass-dim`)
- On interactive element hover: ring fills to `--brass` solid
- On click: brief 120ms scale-up burst (1.0 → 1.4 → 1.0)
- Over text: collapses to 2px tall I-beam in brass
- On void/background: ring strokes down to `#2E2E31`

### Sound Design (Web Audio API — no libraries)
All sounds are **muted by default**, activated globally via the nav speaker toggle.

| Trigger | Sound | Technique |
|---|---|---|
| Button hover | Solenoid click | 80ms sine at 180Hz, fast decay |
| Card click | Mechanical thud | 60ms layered sine 120Hz + 800Hz transient |
| Shutter hover | DSLR shutter | 60ms low thud (90Hz) + high transient (3kHz) |
| Harmonium hover | Raag Bhairav Sa | 300ms oscillator bank with harmonics simulating harmonium |
| Diesel hover | Engine idle | 200ms 20–60Hz sine with tremolo |

### Scroll Behavior
- Scroll-triggered reveals: panels slide up 16px + fade 0→1 over 300ms (Framer Motion `useInView`)
- Section-to-section navigation: brass horizontal line wipe (180ms) before content swap
- Parallax: very subtle (max 20px shift) on hero text layers only

### Page Transitions
Horizontal line wipe: a brass `1px` horizontal line sweeps left→right across the full viewport in 180ms, then content fades in. Not a standard fade — closer to a film projector gate wipe.

---

## 07 — Next.js Build Architecture

### Stack
```
Framework:    Next.js 14 (App Router)
Language:     TypeScript (strict)
Animation:    Framer Motion
Sound:        Web Audio API (raw — no library)
Styling:      CSS Custom Properties + CSS Modules
Fonts:        Self-hosted (Google Fonts subset, WOFF2)
Deploy:       Vercel
Performance:  Target Lighthouse 95+ all metrics
```

### File Structure
```
nielless.com/
├── app/
│   ├── page.tsx              ← Hero + compile gate
│   ├── layout.tsx            ← Cursor + audio provider + nav
│   └── globals.css           ← Full token system
├── components/
│   ├── HeroBoot.tsx          ← Terminal typewriter + compile button
│   ├── Nav.tsx               ← Sticky top + left tick nav
│   ├── SchematicCard.tsx     ← Engine project cards
│   ├── EngineSection.tsx     ← Section container
│   ├── AnalogPanel.tsx       ← Audiophile / Lens / Diesel panels
│   ├── Timeline.tsx          ← Blueprint deployment history
│   ├── CustomCursor.tsx      ← Brass ring cursor
│   └── AudioEngine.ts        ← Web Audio API singleton
├── lib/
│   └── sounds.ts             ← Oscillator presets (solenoid, shutter, harmonium, diesel)
├── data/
│   └── projects.ts           ← Project schematic data (typed)
└── public/
    └── fonts/                ← Self-hosted Bebas Neue, JetBrains Mono, Crimson Pro
```

### Implementation Order (recommended)
1. `globals.css` — Lock the full token system first. Everything else references it.
2. `AudioEngine.ts` — Build and test sounds early. They're easy to break late.
3. `CustomCursor.tsx` — Install globally, verify all states work before building sections.
4. `HeroBoot.tsx` — The boot sequence animation is the most complex. Do it early.
5. `SchematicCard.tsx` — Most reusable component. Build once, use four times.
6. `AnalogPanel.tsx` + `Timeline.tsx` — Straightforward once the token system is solid.
7. Performance pass — Font subsetting, image optimization, bundle analysis.

---

## 08 — Footer

6-cell minimal grid:

```
┌───────────────────────────────────────────────────────────┐
│  N/A :: nielless.com          BUILD 2025.XX.XX    GH  LI  │
│                                                            │
│             "Build until it holds."                       │
└───────────────────────────────────────────────────────────┘
```

- Left: `N/A :: nielless.com` in 10px brass mono
- Center: build timestamp in `#2E2E31`
- Right: GitHub + LinkedIn as monoline SVG icons, `--muted`
- Bottom line: Crimson Pro italic, 13px, `--muted` — *"Build until it holds."*

---

## 09 — Mobile Considerations

- Hero: font scales to 40px Bebas. Left-edge tick nav hides.
- Engine: 1-column stack instead of 2-column grid.
- Analog: 1-column stack, panels full-width.
- Sound: disabled by default on mobile (respect battery / context).
- Custom cursor: disabled on touch devices (falls back to default).
- Transitions: reduced motion respected via `@media (prefers-reduced-motion: reduce)`.

---

*End of Design Specification — Rev 1.0*
*"Build until it holds."*
