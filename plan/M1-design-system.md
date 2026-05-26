# M1 — Design System + Layout Shell

**Status**: COMPLETE  
**Commit**: `b91bf04` — `feat(v3.1): design tokens, layout shell, minimal header`  
**Verified**: 2026-05-18

---

## Summary

M1 established the foundational design system, global CSS infrastructure, layout components, and site chrome. All tasks are complete and verified.

---

## What Was Delivered

### M1.1 — `src/app/globals.css`
- [x] Color tokens: `--void` through `--muted2` (14 tokens)
- [x] Font stacks: `--display`, `--mono`, `--serif`
- [x] Layout tokens: `--page-max`, `--page-pad`, `--section-gap`, `--card-pad`
- [x] `@font-face` declarations for Bebas Neue, JetBrains Mono (300/400/500), Crimson Pro (400/400i/600)
- [x] Global reset + body typography
- [x] Static film grain (`body::after`, z-index 50, `pointer-events: none`)
- [x] `prefers-reduced-motion` blanket reduction
- [x] `.page-wrap`, `.section`, badge/tag utility classes
- [x] Focus-visible ring: 1px brass, 3px offset
- [x] Responsive `--page-pad`: 20px at ≤768px, 16px at ≤360px

### M1.2 — `src/app/layout.tsx`
- [x] `<title>`: NIELLESS — Full-Stack Engineer
- [x] `description`: Backend-first engineer building systems that hold...
- [x] Skip link → `#main`
- [x] Structure: SiteHeader → main#main → Footer
- [x] No Google Fonts CDN

### M1.3 — `SiteHeader.tsx`
- [x] Sticky top bar: NIELLESS left
- [x] Anchor links: DARKROOM · BLUEPRINT · CONTACT
- [x] `aria-label="Site header"`
- [x] No mode dial

### M1.4 — `SectionShell.tsx`
- [x] Props: `label`, `title`, optional `meta`
- [x] Semantic header with spec typography

---

## Definition of Done (ALL MET)

- [x] `page.tsx` renders header + `page-wrap` + footer with grain visible
- [x] Tab → skip link → main works
- [x] Reduced motion: page still readable, no errors

---

## Files Produced

```
src/app/globals.css
src/app/layout.tsx
src/components/SiteHeader.tsx
src/components/SiteHeader.module.css
src/components/SectionShell.tsx
src/components/SectionShell.module.css
src/components/Footer.tsx
src/components/Footer.module.css
```

---

## Downstream Dependencies

M1 output is consumed by every subsequent milestone:
- **M2**: Uses design tokens, `--display`/`--mono`/`--serif` fonts, `.page-wrap`, reduced-motion baseline
- **M3**: Uses `SectionShell`, badge/tag utilities, z-index stack
- **M4**: Uses `SectionShell`, `.tag` class, `--brass`/`--brass-dim` tokens
- **M5**: Uses `SectionShell`, footer already in layout
- **M6**: Grain z-index (50), font-display swap, focus-visible ring all established here

---

## No Action Required

This milestone is locked. Do not modify M1 files unless a downstream milestone reveals a token gap or a bug introduced by later work.
