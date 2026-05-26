# PROJECT STATUS — nielless.com v3.3

**Assessed**: 2026-05-26  
**Current Milestone**: M2 (Hero Boot) — IN PROGRESS  
**Build passes**: Yes (last verified at M1 commit `b91bf04`)

---

## Milestone Completion Matrix

| Milestone | Status | Notes |
|-----------|--------|-------|
| M0 — Baseline & repo hygiene | COMPLETE | SHA `9ad56ea` → `235d372` |
| M1 — Design system + layout shell | COMPLETE | SHA `b91bf04` |
| M2 — Hero boot → zoom-out → D7500 rear → flash | IN PROGRESS | Component exists but needs full rewrite: viewfinder boot + zoom-out + camera CSS + flash |
| M3 — The Darkroom (film negative reel) | NOT STARTED | Stub section only |
| M4 — Blueprint section | NOT STARTED | Stub section only |
| M5 — Contact + footer | NOT STARTED | Footer exists; contact is stub |
| M6 — Release hardening | NOT STARTED | — |

---

## What Currently Exists in `src/`

### Completed Infrastructure (M0 + M1)

| File | Status | Notes |
|------|--------|-------|
| `app/globals.css` | DONE | Tokens, fonts, grain, reset, reduced-motion, utilities |
| `app/layout.tsx` | DONE | Metadata, skip link, SiteHeader, Footer, main |
| `app/page.tsx` | PARTIAL | Hero section wired; darkroom/blueprint/contact are stubs |
| `components/SiteHeader.tsx` | DONE | Sticky nav with DARKROOM/BLUEPRINT/CONTACT anchors |
| `components/SiteHeader.module.css` | DONE | Styling complete |
| `components/SectionShell.tsx` | DONE | Reusable section header |
| `components/SectionShell.module.css` | DONE | Styling complete |
| `components/Footer.tsx` | DONE | v3.3 mark + quote + domain |
| `components/Footer.module.css` | DONE | Styling complete |

### M2 Hero (Partially Built — Needs Full Rewrite)

| File | Status | Notes |
|------|--------|-------|
| `components/HeroBoot.tsx` | EXISTS — WRONG | Terminal boot style, NOT D7500 viewfinder per roadmap spec |
| `components/HeroBoot.module.css` | EXISTS — WRONG | Matches old terminal approach, not viewfinder layers |
| `components/D7500Rear.tsx` | DOES NOT EXIST | CSS replica of D7500 rear — new requirement |
| `components/D7500Rear.module.css` | DOES NOT EXIST | Camera body styling — new requirement |
| `components/useHeroZoom.ts` | DOES NOT EXIST | Scroll-driven zoom-out + flash hook — new requirement |

---

## Current HeroBoot vs. Required HeroBoot

### What exists now:
- Simple terminal-style boot (text lines appear sequentially)
- Focus hunt on headline with blur animation
- L-brackets, crosshair, center dot
- Subline + CTA
- Reduced motion handled

### What the roadmap requires (3-phase hero sequence):

**Phase A — Boot (5-layer D7500 viewfinder):**
1. **Eyepiece vignette** — radial gradient simulating rubber eyecup
2. **Frame corners** — warm-white L-brackets (NOT brass), 28px, at image boundary
3. **Glass overlays** — HUD strip, 51 AF points (D7500 layout), headline centered at `left:50% top:28%`, SHUTTER: ARMED transient, focus confirm dot
4. **Data strip** — dark panel BELOW glass: owner tag, shutter speed, aperture, exposure meter (graphic), ISO, frame count, battery
5. **Caption** — sub-copy + CTA outside the instrument entirely

**Phase B — Zoom-Out (scroll-driven):**
- Viewfinder scales from viewport-filling to natural eyepiece size
- D7500 rear body (CSS replica) fades in around shrinking viewfinder
- Caption + data strip fade out at start of zoom

**Phase C — Flash (auto-triggered):**
- Pop-up flash unit on D7500 flips open (mechanical animation)
- Flash fires (full white screen, 800ms)
- White clears → darkroom section visible below

### Gap Analysis:
- Missing: entire 5-layer viewfinder, D7500 rear body, zoom-out scroll, flash sequence
- Current: terminal boot lines (not in spec), no camera body, no zoom, no flash
- Timing: current uses simplified delays; roadmap specifies D7500-style 10s boot + scroll zoom

---

## Blocked On Nothing

The project has no external dependencies or blockers. M2 can be completed immediately followed by M3–M6 in sequence. Project/timeline implementation details are defined in the roadmap, and professional content copy should be sourced from `assets/resume-content-superset.md`.

---

## File Structure Gap (current vs. target)

```
HAVE:                           NEED (by M6):
src/                            src/
├── app/                        ├── app/
│   ├── layout.tsx ✓            │   ├── layout.tsx ✓
│   ├── page.tsx (partial)      │   ├── page.tsx (complete)
│   └── globals.css ✓           │   └── globals.css ✓
├── components/                 ├── components/
│   ├── SiteHeader.tsx ✓        │   ├── SiteHeader.tsx ✓
│   ├── HeroBoot.tsx (rewrite)  │   ├── HeroBoot.tsx (rewrite)
│                               │   ├── D7500Rear.tsx ← NEW
│                               │   ├── useHeroZoom.ts ← NEW
│   ├── SectionShell.tsx ✓      │   ├── SectionShell.tsx ✓
│   ├── Footer.tsx ✓            │   ├── ScrollHint.tsx ← NEW
│   └── ...modules ✓           │   ├── Footer.tsx ✓
│                               │   ├── projects/
│                               │   │   ├── DarkroomSection.tsx ← NEW
│                               │   │   ├── FilmStrip.tsx ← NEW
│                               │   │   ├── FilmNegative.tsx ← NEW
│                               │   │   ├── LeaderTape.tsx ← NEW
│                               │   │   ├── PositivePrintModal.tsx ← NEW
│                               │   │   └── useFilmScroll.ts ← NEW
│                               │   ├── ContactSheet.tsx ← NEW
│                               │   ├── StackPanel.tsx ← NEW
│                               │   └── ContactSection.tsx ← NEW
│                               ├── data/
│                               │   ├── projects.ts ← NEW
│                               │   └── timeline.ts ← NEW
│                               └── lib/
│                                   └── reducedMotion.ts ← NEW (optional)
```

---

## Velocity Estimate

| Milestone | Estimated Effort | Complexity |
|-----------|-----------------|------------|
| M2 rewrite | 8–10 hrs | VERY HIGH (5-layer viewfinder, D7500 CSS, zoom-out scroll, flash) |
| M3 | 6–8 hrs | HIGH (scroll scrub math, modal wipe, data layer) |
| M4 | 2–3 hrs | MEDIUM (timeline data, DoF CSS, stack panel) |
| M5 | 1–2 hrs | LOW (mailto links, section wiring) |
| M6 | 2–3 hrs | MEDIUM (a11y audit, responsive QA, Lighthouse) |

**Total remaining**: ~20–26 hours of focused development.
