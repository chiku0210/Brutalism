# DEVELOPMENT PLAN — nielless.com v3.3

**Created**: 2026-05-26  
**Target release**: `v3.3.0`  
**Total estimated effort**: 20–26 hours  
**Philosophy**: Narrow, finished, fast-track. Depth beats breadth.

---

## Ground Truth Hierarchy

| Priority | Document | Role |
|----------|----------|------|
| 1 | `nielless-v3-build-roadmap.md` | What ships, build order, scroll math, data models, SEO, z-index |
| 2 | `nielless-portfolio-design-spec-v3.html` | Visual + interaction reference (do NOT implement deferred items) |
| 3 | `plan/` (this folder) | Execution-ready breakdown for fast-track agent development |

---

## Milestone Overview

| # | Milestone | Plan File | Status | Est. Hours |
|---|-----------|-----------|--------|------------|
| M0 | Baseline & repo hygiene | — (done) | COMPLETE | — |
| M1 | Design system + layout shell | `M1-design-system.md` | COMPLETE | — |
| M2 | Hero boot → zoom-out → D7500 rear → flash | `M2-hero-boot.md` | IN PROGRESS | 8–10 |
| M3 | The Darkroom (film negative reel) | `M3-darkroom.md` | NOT STARTED | 6–8 |
| M4 | Blueprint (contact sheet + stack) | `M4-blueprint.md` | NOT STARTED | 2–3 |
| M5 | Contact + footer | `M5-contact-footer.md` | NOT STARTED | 1–2 |
| M6 | Release hardening | `M6-release-hardening.md` | NOT STARTED | 2–3 |

**Current state**: See `STATUS.md` for detailed assessment of existing code.

---

## Execution Rules

1. **Sequential only** — complete each milestone's DoD before starting the next
2. **No parallel half-features** — a section either ships complete or doesn't ship
3. **CSS Modules + tokens only** — no Tailwind, no inline styles
4. **Banned libraries** — Framer Motion, GSAP, Lenis, Three.js
5. **Single route** — everything lives on `/`; sections are `#hero`, `#darkroom`, `#blueprint`, `#contact`
6. **Reduced motion** — first-class citizen in every milestone

---

## Fast-Track Execution Strategy

### Phase 1: Foundation Complete (M2)
- Rewrite HeroBoot to D7500 viewfinder boot spec
- Build D7500 rear CSS replica
- Implement scroll-driven zoom-out from viewfinder to full camera body
- Pop-up flash animation + full white screen → darkroom entry
- This is the hardest and largest milestone — viewfinder + camera body + scroll + flash
- Once done, the hero-to-darkroom cinematic transition is complete

### Phase 2: Core Portfolio (M3)
- The heaviest milestone — data layer + UI + scroll scrub + modal
- Break into 4 sub-prompts (data → static UI → scroll → modal)
- Each sub-prompt can be executed independently and verified

### Phase 3: Supporting Sections (M4 + M5)
- Relatively straightforward
- Can be done in a single focused session
- M4 and M5 together take ~3–5 hours

### Phase 4: Ship (M6)
- No new code — only fixes and verification
- Lighthouse audit drives remaining work
- Tag and deploy

---

## File Index

```
plan/
├── README.md              ← This file (master index)
├── STATUS.md              ← Current state assessment
├── M1-design-system.md    ← Complete (reference only)
├── M2-hero-boot.md        ← Active — next execution target
├── M3-darkroom.md         ← Queued
├── M4-blueprint.md        ← Queued
├── M5-contact-footer.md   ← Queued
└── M6-release-hardening.md ← Final gate
```

---

## Quick Reference: Key Technical Decisions

| Decision | Value | Source |
|----------|-------|--------|
| Grain z-index | 50 (not 9999) | Roadmap architecture |
| Modal z-index | 500 | Roadmap z-index table |
| Header z-index | 100 | Roadmap z-index table |
| Film frame width | `clamp(280px, 72vw, 420px)` | Roadmap scroll math |
| Scroll track height | `maxTravel + window.innerHeight` | Roadmap scroll math |
| Hero headline position | `left: 50%, top: 28%, translateX(-50%)` | Roadmap M2.1 |
| AF points | 51 total, only center is red | Roadmap M2.1 |
| Boot duration | ~10s (intentionally slow for presence) | Roadmap M2.1 |
| Zoom-out scroll track | `4 × window.innerHeight` | Roadmap M2.3 |
| D7500 rear aspect ratio | `136 / 104` (real proportions) | Roadmap M2.2 |
| Flash overlay z-index | 9999 | Roadmap z-index table |
| Flash duration | 800ms (`heroFlash` keyframes) | Roadmap M2.4 |
| Modal wipe | 180ms brass gate, content at 160ms | Roadmap architecture |
| Contact | mailto only (no form) | Roadmap M5.1 |
| DoF method | opacity + weight (NO blur) | Roadmap M4.2 |

---

## Agent Usage

Each milestone plan file contains a ready-to-paste **Agent Prompt** section. Copy the prompt directly into a new agent session for execution. The prompts are self-contained with all context needed.

For multi-sub-milestone work (M2 and M3), execute sub-prompts in order (A → B → C → D) with verification between each.
