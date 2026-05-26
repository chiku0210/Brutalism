# M6 — Release Hardening (a11y, Mobile, Lighthouse)

**Status**: NOT STARTED  
**Spec ref**: Sections [07] Mobile + [08] Quality  
**Estimated effort**: 2–3 hours  
**Complexity**: MEDIUM  
**Depends on**: M5 complete (all features landed)

---

## Summary

M6 is the final quality gate before tagging `v3.3.0`. No new features. This milestone is pure hardening: accessibility audit, responsive QA across all breakpoints, performance optimization, and production deployment verification.

---

## Architecture

No new components. M6 modifies existing files only:
- Fix a11y issues found during audit
- Fix responsive issues found during QA
- Optimize bundle (remove dead imports)
- Deploy and smoke test

---

## Sub-Milestones & Execution Order

### M6.1 — Accessibility Audit

#### Keyboard Navigation (full page traversal)

| Element | Expected Behavior |
|---------|------------------|
| Skip link | Tab first → appears → Enter → focus jumps to `#main` |
| SiteHeader links | Tab reaches each; Enter scrolls to section |
| Hero CTA `[ SCROLL TO DARKROOM ]` | Focusable; Enter scrolls to `#darkroom` |
| Film negatives | Each has `tabindex="0"`; `[ DEVELOP ]` is focusable |
| Modal `[ DEVELOP ]` | Focus trapped inside; Escape/close returns focus to trigger |
| Contact Sheet frames | Each `tabindex="0"`; `:focus-visible` restores full density |
| Contact links | Tab reaches all; Enter opens destination |

#### ARIA Attributes

| Element | Required |
|---------|----------|
| `body::after` (grain) | Not needed — already `pointer-events: none`, not in DOM tree |
| Decorative elements (eyepiece, sprockets, frame corners) | `aria-hidden="true"` |
| Film strip viewport | `aria-label="Film negative strip"` |
| Modal | `role="dialog"`, `aria-modal="true"`, `aria-label="Project details"` |
| Section shells | Semantic `<header>` + `<h2>` — already correct |
| Nav | `aria-label="Site header"` — already set |

#### Color Contrast (WCAG AA)

| Pair | Ratio | Status |
|------|-------|--------|
| `--dust` (#E8E2D5) on `--void` (#060608) | ~14:1 | PASS |
| `--brass` (#C8A96E) on `--void` (#060608) | ~7.5:1 | PASS |
| `--muted` (#606068) on `--void` (#060608) | ~3.4:1 | BORDERLINE — verify context (decorative/secondary text) |
| `--muted2` (#404044) on `--void` (#060608) | ~2.1:1 | FAIL for body text — acceptable only for decorative |
| `--signal` (#39FF14) on `--void` (#060608) | ~10:1 | PASS |

**Action items**:
- `--muted` text must not be primary content; only secondary labels
- `--muted2` must only be used for tertiary/decorative text (frame counters, timestamps on past entries)
- If any primary readable text uses `--muted2`, bump to `--muted`

#### `prefers-reduced-motion` Full Check

| Section | Expected |
|---------|----------|
| Hero boot | All layers immediately visible; AF grid not rendered; no blur; no interval |
| Darkroom scroll | No sticky scrub; horizontal overflow or stacked |
| Modal wipe | No brass gate animation; content at `opacity: 1` immediately |
| Contact sheet | Transition durations effectively 0 (from global rule) |
| Grain | Remains (static, not motion) |

---

### M6.2 — Responsive QA Checklist

#### Breakpoint Testing Matrix

| Breakpoint | Hero | Darkroom | Blueprint | Contact | Footer |
|------------|------|----------|-----------|---------|--------|
| 1440px (desktop) | 3:2 frame, 62px headline | Sticky scrub works | Full DoF + sprockets | Inline links | 3-col |
| 1024px (laptop) | Same as desktop | Scrub works | Same | Same | Same |
| 768px (tablet) | 4:3 frame, 40px headline, no eyepiece | No sticky; overflow-x + snap | Sprockets hidden | Links wrap | May stack |
| 375px (iPhone) | 4:3, 28-40px | Snap scroll | Same as 768 | Stack | Stack |
| 320px (SE) | 4:3, 28px headline | Snap, 85vw frames | Compact | Full stack | Stack |

#### Critical Mobile Rules

```css
/* Must NOT exist on any breakpoint */
/* - Horizontal page-level overflow */
/* - Text smaller than 11px for readable content */
/* - Touch targets smaller than 44×44px */
```

**Touch targets audit**:
- `[ DEVELOP ]` buttons → ensure min 44px tap area (padding if needed)
- Header nav links → ensure sufficient spacing/size
- Contact links → check tap area
- `[ SCROLL TO DARKROOM ]` CTA → adequate size

**Tap highlight**:
```css
* {
  -webkit-tap-highlight-color: transparent;
}
```
Add to `globals.css` if not present.

#### Darkroom Mobile Specifics

- No nested scroll trap (user can escape horizontal scroll by scrolling vertically)
- `overscroll-behavior: contain` on the film reel
- `scroll-snap-type: x mandatory` on reel
- Leader tape: `min(85vw, 280px)`, centered snap
- ScrollHint text: `[ swipe → ]` below 768px

---

### M6.3 — Performance & SEO

#### Font Loading

- All fonts self-hosted in `public/fonts/` with `font-display: swap` — already done in M1
- Verify no Google Fonts CDN in HTML output (`grep` for `fonts.googleapis.com`)
- Verify WOFF2 files exist and are referenced correctly

#### Bundle Analysis

```bash
npm run build
# Check .next/analyze or build output for:
# - Dead imports (components imported but not rendered)
# - Large dependencies accidentally included
# - Client-only code that could be server-rendered
```

**Things to verify**:
- No `framer-motion` in bundle (banned in M0)
- No unused legacy components imported
- `useFilmScroll` only runs client-side (use `"use client"` directive)
- Data files (`projects.ts`, `timeline.ts`) are statically imported — no runtime fetch

#### Client-Side Boundaries

Only these components need `"use client"`:
- `HeroBoot.tsx` (useEffect timer chain)
- `DarkroomSection.tsx` or `FilmStrip.tsx` (scroll listener)
- `PositivePrintModal.tsx` (state management, body lock)
- `ScrollHint.tsx` (if it reads modal state)

Everything else can be server-rendered:
- `SiteHeader`, `Footer`, `SectionShell`, `ContactSheet`, `StackPanel`, `ContactSection`

#### Lighthouse Target

Run in Chrome Incognito, mobile emulation:

| Category | Target | Stretch |
|----------|--------|---------|
| Performance | ≥ 90 | 95 |
| Accessibility | ≥ 90 | 95 |
| Best Practices | ≥ 90 | 95 |
| SEO | ≥ 90 | 95 |

**Common issues to prevent**:
- Layout shift from hero boot → reserve `min-height` on frame
- Large images → none in v3.3 (no images, only CSS/SVG)
- Render-blocking resources → fonts are `swap`, no external CSS
- Missing meta description → already set in layout metadata

#### SEO Metadata (verify)

```tsx
// layout.tsx — already implemented
metadata = {
  title: "NIELLESS — Full-Stack Engineer",
  description: "Backend-first engineer building systems that hold. Node.js, PostgreSQL, AWS, AI-native.",
  openGraph: {
    title: "NIELLESS — Full-Stack Engineer",
    description: "Backend-first engineer building systems that hold...",
  }
}
```

- Verify `<title>` renders in HTML
- Verify `<meta name="description">` present
- Verify `<meta property="og:title">` and `og:description` present
- `og:image` is deferred to v3.4 — acceptable to omit

---

### M6.4 — Production Deploy & Smoke Test

#### Pre-Deploy Checklist

- [ ] `npm run build` succeeds with zero errors
- [ ] `npm run lint` passes
- [ ] No console.log / console.error in production code
- [ ] No TODO comments in shipped components
- [ ] All `placeholder` / `stub` classes removed from page.tsx
- [ ] Legacy files in `/deprecated` not imported anywhere

#### Deploy Preview

Deploy to Vercel preview URL and run through:

| Step | Action | Expected |
|------|--------|----------|
| 1 | Load `/` cold | Hero boot sequence plays (or instant with reduced-motion) |
| 2 | Wait for boot complete | Caption + CTA visible |
| 3 | Click `[ SCROLL TO DARKROOM ]` | Smooth scroll to darkroom |
| 4 | Scroll through darkroom (desktop) | Film strip scrubs left |
| 5 | Click `[ DEVELOP ]` on any frame | Modal opens with brass wipe |
| 6 | Press Escape | Modal closes; focus returns |
| 7 | Continue scrolling to Blueprint | Contact sheet with DoF recession |
| 8 | Hover/focus a past frame | Full density restored |
| 9 | Scroll to Contact | Email CTA visible |
| 10 | Click email | Mail client opens |
| 11 | Check footer | Visible below contact |

#### Cross-Browser Verification

| Browser | Priority |
|---------|----------|
| Chrome (desktop) | P0 — primary |
| Safari (iPhone) | P0 — iOS rendering |
| Firefox (desktop) | P1 — secondary |
| Chrome (Android) | P1 — mobile Chrome |
| Edge (desktop) | P2 — low priority |

**Safari-specific concerns**:
- `-webkit-overflow-scrolling: touch` for darkroom mobile scroll
- Sticky positioning behavior
- `dvh` unit support (already using `100dvh` with `100vh` fallback)
- Film grain SVG rendering

#### Tag Release

```bash
git add -A
git commit -m "chore(v3.3): release hardening and v3.3.0 tag"
git tag v3.3.0
git push origin main --tags
```

---

## Definition of Done Checklist

- [ ] Every interactive control is keyboard-operable (full Tab traversal)
- [ ] `aria-hidden="true"` on all decorative elements
- [ ] Color contrast passes WCAG AA for all readable text
- [ ] `prefers-reduced-motion`: hero static, no broken scroll, modal instant
- [ ] No horizontal overflow on any breakpoint (320px → 1440px)
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] `-webkit-tap-highlight-color: transparent` applied
- [ ] Self-hosted fonts with `font-display: swap` (no CDN)
- [ ] No client-only blocking of entire page
- [ ] Bundle clean: no dead imports, no banned dependencies
- [ ] Lighthouse ≥ 90 all categories (stretch 95)
- [ ] Production URL loads all sections; no console errors
- [ ] iPhone Safari + desktop Chrome smoke pass
- [ ] Deploy preview: full flow hero → darkroom → blueprint → contact
- [ ] Tag `v3.3.0` on release commit

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Lighthouse perf < 90 due to hero animation | MEDIUM | Hero reserves min-height; animations are CSS-only (compositor) |
| Safari sticky scroll quirk in darkroom | HIGH | Test early in M3; fallback to no-sticky if broken |
| Accessibility audit reveals structural issues | MEDIUM | Fix is usually adding aria attributes; rarely structural |
| `--muted2` contrast fails audit | LOW | Only used for decorative; document exception |

---

## Agent Prompt (execute as 3 passes)

### Pass 1 — Accessibility Fix Pass
```
Run an accessibility audit on the full page (src/app/page.tsx and all components).

Check:
1. All decorative elements have aria-hidden="true"
2. Modal has role="dialog", aria-modal="true", aria-label
3. All interactive elements are keyboard-reachable
4. Focus trap works in modal
5. Color contrast for readable text meets WCAG AA
6. prefers-reduced-motion works correctly everywhere

Fix any issues found. Run npm run lint after.
```

### Pass 2 — Responsive Fix Pass
```
Test all components at 320px, 375px, 768px, 1024px, 1440px.

Check:
1. No horizontal overflow on any breakpoint
2. Touch targets ≥ 44×44px
3. Darkroom mobile: horizontal scroll with snap, no nested trap
4. Footer stacks on mobile if wrapping
5. Hero frame uses 4/3 aspect on mobile, 3/2 on desktop
6. Add -webkit-tap-highlight-color: transparent if missing

Fix any issues. Run npm run build after.
```

### Pass 3 — Performance + Deploy
```
Final pre-release checks:

1. Verify no console.log in production code
2. Verify no unused imports
3. Verify fonts are self-hosted (no CDN references)
4. Verify "use client" only on components that need it
5. Run npm run build — report bundle size
6. Remove any .stub classes or placeholder sections
7. Verify metadata renders in HTML output

Report Lighthouse-relevant findings and any remaining issues.
```

---

## Commit Message

```
chore(v3.3): release hardening and v3.3.0 tag
```
