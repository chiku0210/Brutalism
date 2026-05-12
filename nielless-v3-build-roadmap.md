# NIELLESS.COM — V3 BUILD ROADMAP (VINTAGE DSLR)
### Transforming the portfolio into a precision optical instrument

---

## SITUATION ASSESSMENT

| Item | Status |
|---|---|
| Repo | Next.js scaffold · v2 components may exist · Clean v3 start preferred |
| v3 spec | North Star — `nielless-portfolio-design-spec-v3.html` |
| Theme | Vintage DSLR Interface — Optical Truth over Simulation |
| Foundation | CSS tokens, font subsets, mechanical audio map |
| Risk | Minimal — v3 provides exhaustive technical specs for all mechanisms |

**The v3 transition is a shift from "analog personality" to "precision instrument."**  
We are removing the diesel/music analogies in favor of a strict DSLR mechanical metaphor.

---

## STEP 0 — REPO PREPARATION
### Do this before writing a single line of component code.

**1. Reference the v3 spec:**
Ensure `nielless-portfolio-design-spec-v3.html` is in the root.

**2. Update CLAUDE.md — your standing order.**  
Open `CLAUDE.md` and replace its contents with the following structure:

```markdown
# CLAUDE.md — nielless.com Build Instructions (v3)

## GROUND TRUTH
The design spec is `nielless-portfolio-design-spec-v3.html`.  
Read it fully before writing any code. It contains:
- Complete CSS token system (Section 01)
- Camera Experience Layer mechanisms (Section 02)
- Implementation order you must follow (Section 08)

## RULES
1. CSS Custom Properties + CSS Modules ONLY. No Tailwind. No inline styles.
2. All colors reference `var(--token-name)`.
3. Fonts: Bebas Neue (display), JetBrains Mono (mono), Crimson Pro italic (serif).
4. No animation libraries (e.g., Framer Motion). Use CSS @keyframes and native Web Animation API for timing.
5. Respect `prefers-reduced-motion` everywhere (Section 07/08).
6. Follow the implementation order in Section 08 strictly. 
7. Every component gets its own CSS Module file (`ComponentName.module.css`).
8. Target: Lighthouse 95+ on all metrics.

## IMPLEMENTATION ORDER (from spec Section 08)
01. globals.css (Tokens, reset, static grain)
02. ShutterOverlay.tsx (Fixed wipe layer)
03. ApertureRing.tsx + ExposureMeter.tsx (Scroll-driven SVG)
04. ViewfinderCard.tsx (Bracket shell)
05. HeroBoot.tsx (Camera boot + hot shoe)
06. SchematicGrid.tsx (Engine section)
07. ContactSheet.tsx (Timeline with DoF classes)
08. CustomCursor.tsx (Reticle ring)
09. AudioToggle.tsx + lib/audio.ts (Mechanical oscillators)
10. Performance + Accessibility pass
```

**3. Set up self-hosted fonts:**
Verify `public/fonts` contains WOFF2 subsets for Bebas Neue, JetBrains Mono, and Crimson Pro.

---

## PHASE 1 — THE FOUNDATION
### `app/globals.css`
**Spec reference:** Section 01 (Design System) & Section 08 (Implementation 01)

**Open Claude Code and say:**
> "Read CLAUDE.md and nielless-portfolio-design-spec-v3.html fully.  
> Build the complete CSS token system from Section 01.  
> Include:
> - All custom properties (--void through --serif)
> - @font-face for the three WOFF2 fonts
> - Global body reset
> - STATIC film grain layer (body::after pseudo-element with SVG feTurbulence)
> - Reduced-motion overrides (gut all transforms/transitions)
> - Skip link (Section 00)
> No components yet. Just the system foundation."

**Gate:**
- [ ] Background is `#060608`. Static grain visible (3% opacity).
- [ ] Fonts load correctly. Skip link works.
- [ ] `git commit -m "feat: globals.css — v3 tokens + static grain + accessibility"`

---

## PHASE 2 — THE SHUTTER
### `components/ShutterOverlay.tsx`
**Spec reference:** Section 02 (Shutter Wipe) & Section 08 (Implementation 02)

**Open Claude Code and say:**
> "Build `components/ShutterOverlay.tsx`.  
> - Fixed root overlay at z-index 200.
> - pointer-events: none.
> - Implementation: CSS @keyframes for `scaleX(0) → scaleX(1) → scaleX(0)`.
> - Shutter duration: 180ms sweep.
> - Provide a way to trigger it globally (e.g., via a simple helper or custom event)."

**Gate:**
- [ ] Shutter sweeps cleanly across the screen without affecting layout.
- [ ] `git commit -m "feat: ShutterOverlay — mechanical wipe mechanism"`

---

## PHASE 3 — OPTICAL CONTROLS
### `components/ApertureRing.tsx` + `components/ExposureMeter.tsx` + `hooks/useScrollProgress.ts`
**Spec reference:** Section 02 (Aperture Ring & Exposure Meter)

**Open Claude Code and say:**
> "Build the left-edge optical controls.
> 1. `hooks/useScrollProgress.ts` — Throttled listener that writes scroll 0-1 to a CSS custom property `--scroll-progress`.
> 2. `components/ApertureRing.tsx` — Fixed left SVG. Rotation and iris opening (f/16 to f/1.4) driven by `--scroll-progress`.
> 3. `components/ExposureMeter.tsx` — 2px vertical bar. Height scales 0-100% with scroll.
> 4. Detent pulses: Section boundaries trigger 20ms scale pulse on the ring."

**Gate:**
- [ ] Ring rotates and iris opens on scroll.
- [ ] Zero layout cost (transform only).
- [ ] `git commit -m "feat: ApertureRing + ExposureMeter — optical scroll linkage"`

---

## PHASE 4 — VIEWFINDER SHELL
### `components/ViewfinderCard.tsx`
**Spec reference:** Section 02 (Viewfinder Brackets)

**Open Claude Code and say:**
> "Build the `ViewfinderCard` shell component.
> - Wraps children in a container with four corner brackets (14px L-shapes).
> - Brackets are absolutely positioned fragments, NOT SVG.
> - Brackets opacity 0 → 1 on :hover and :focus-visible (200ms).
> - Instant transition if prefers-reduced-motion is active."

**Gate:**
- [ ] Brackets appear precisely at corners.
- [ ] Keyboard focus triggers brackets.
- [ ] `git commit -m "feat: ViewfinderCard — DSLR focus confirmation shell"`

---

## PHASE 5 — THE BOOT
### `components/HeroBoot.tsx`
**Spec reference:** Section 03 (Hero — Sensor Calibration)

**Open Claude Code and say:**
> "Build the v3 Hero section.
> - Camera boot terminal: metadata lines type in (SENSOR READY, SHUTTER ARMED).
> - Headline develops with logarithmic opacity curve.
> - Hot Shoe CTA: '[ RELEASE SHUTTER ]' button.
> - Trigger shutter wipe on click with 200ms mechanical delay."

**Gate:**
- [ ] Boot sequence matches v3 spec timing.
- [ ] Shutter release delay feels mechanical.
- [ ] `git commit -m "feat: HeroBoot — v3 camera boot + hot shoe cta"`

---

## PHASE 6 — SYSTEM SCHEMATICS
### `components/SchematicGrid.tsx`
**Spec reference:** Section 04 (Engine)

**Open Claude Code and say:**
> "Build the Engine section using ViewfinderCards.
> - 2-column grid. WCI renders full-width.
> - Project data includes badges (LIVE, HOT, ICE).
> - Static HTML/CSS. No heavy visualizations.
> - Focus on precision alignment and typography."

**Gate:**
- [ ] Grid matches spec layout. All badges correctly colored.
- [ ] `git commit -m "feat: SchematicGrid — engine projects in viewfinder cards"`

---

## PHASE 7 — THE CONTACT SHEET
### `components/ContactSheet.tsx`
**Spec reference:** Section 05 (Blueprint)

**Open Claude Code and say:**
> "Build the Blueprint section as a vertical film strip.
> - Apply DoF classes: frame-near, frame-mid, frame-far, frame-past.
> - Opacity and font-weight reduction for past entries.
> - Hover/Focus restores full density (0.3s).
> - Tap-to-focus for mobile."

**Gate:**
- [ ] Visual recession into the past is clear and optical.
- [ ] `git commit -m "feat: ContactSheet — film strip timeline with DoF weight"`

---

## PHASE 8 — THE RETICLE
### `components/CustomCursor.tsx`
**Spec reference:** Section 06 (Micro-interactions)

**Open Claude Code and say:**
> "Build the CustomCursor (Reticle).
> - 12px brass ring.
> - Crosshair appears over interactive elements.
> - Track position via rAF for performance.
> - Hidden on touch and reduced-motion."

**Gate:**
- [ ] Cursor is responsive and precise. Crosshair state works.
- [ ] `git commit -m "feat: CustomCursor — v3 reticle with crosshair state"`

---

## PHASE 9 — MECHANICAL AUDIO
### `components/AudioToggle.tsx` + `lib/audio.ts`
**Spec reference:** Section 02 (Audio)

**Open Claude Code and say:**
> "Build the mechanical audio system.
> - Web Audio API oscillators.
> - Sounds: Aperture detent, Shutter curtain, Film advance.
> - Opt-in toggle in the nav. Lazy-loaded context."

**Gate:**
- [ ] Audio is silent until enabled.
- [ ] Sounds are short, mechanical, and non-musical.
- [ ] `git commit -m "feat: AudioEngine — mechanical oscillator cues"`

---

## PHASE 10 — THE SHIP GATE
### Performance & Accessibility

**Lighthouse Checklist:**
- [ ] Performance: 95+ (Check scroll jank).
- [ ] Accessibility: 95+ (ARIA labels, skip link, reduced motion).
- [ ] Best Practices: 95+ (HTTPS, console errors).
- [ ] SEO: 95+ (Meta tags).

**Final Step:**
```bash
git tag v3.0.0
```

---

*Spec: nielless-portfolio-design-spec-v3.html · Theme: Vintage DSLR*
