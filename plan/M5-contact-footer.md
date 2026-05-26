# M5 — Contact + Footer (Finished)

**Status**: NOT STARTED  
**Spec ref**: Section [02] Contact (v3.3: mailto + links only)  
**Estimated effort**: 1–2 hours  
**Complexity**: LOW  
**Depends on**: M4 complete (section order)

---

## Summary

The Contact section provides a clear path to reach Nielless — no backend form, no "coming soon", no decorative non-functional UI. Every visible control opens a real destination. The Footer is already built (M1) but may need minor verification for final page integration.

---

## Architecture

```
#contact (section)
├── SectionShell ("[06] CONTACT" / "OPEN CHANNEL")
├── Primary CTA → mailto:nielless.acharya@gmail.com
└── Secondary links (LinkedIn, GitHub, Resume PDF)

Footer (already in layout.tsx)
├── Left: "NIELLESS :: v3.3"
├── Center: "Build until it holds." (Crimson italic)
└── Right: "nielless.com"
```

---

## Sub-Milestones & Execution Order

### M5.1 — `ContactSection.tsx`

#### File: `src/components/ContactSection.tsx` + `.module.css`

#### Structure

```tsx
<section id="contact" className="section">
  <SectionShell label="[06] CONTACT" title="OPEN CHANNEL" />
  
  <div className={styles.contactBody}>
    {/* Primary CTA */}
    <a 
      href="mailto:nielless.acharya@gmail.com" 
      className={styles.primaryCta}
    >
      nielless.acharya@gmail.com
    </a>

    {/* Secondary links */}
    <div className={styles.links}>
      <a 
        href="https://linkedin.com/in/nielless" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.link}
      >
        LinkedIn
      </a>
      <a 
        href="https://github.com/nielless" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.link}
      >
        GitHub
      </a>
      <a 
        href="/resume.pdf" 
        target="_blank" 
        rel="noopener noreferrer"
        className={styles.link}
      >
        Resume
      </a>
    </div>
  </div>
</section>
```

**Note**: Use actual URLs from `assets/resume-content-superset.md`. If exact LinkedIn/GitHub URLs differ, update during implementation.

#### Visual Spec

```css
.contactBody {
  margin-top: 40px;
}

.primaryCta {
  font-family: var(--mono);
  font-size: 16px;
  color: var(--brass);
  text-decoration: none;
  display: inline-block;
  padding: 12px 0;
  border-bottom: 1px solid var(--brass-dim);
  transition: color 0.2s, border-color 0.2s;
}

.primaryCta:hover {
  color: var(--brass-bright);
  border-color: var(--brass-bright);
}

.links {
  display: flex;
  gap: 24px;
  margin-top: 32px;
}

.link {
  font-family: var(--mono);
  font-size: 11px;
  color: var(--muted);
  text-decoration: none;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: color 0.2s;
}

.link:hover {
  color: var(--dust);
  text-decoration: underline;
}
```

#### Accessibility

- All links have visible focus states (brass outline from `globals.css`)
- `target="_blank"` links have `rel="noopener noreferrer"`
- No disabled states — everything is functional
- Tab order: primary CTA → LinkedIn → GitHub → Resume

#### What NOT to Ship

- No submit button
- No Formspree / backend form
- No "coming soon" text
- No hot-shoe hold-to-fire CTA
- No dual mailto + form path
- No decorative non-functional elements

---

### M5.2 — Footer Verification

#### Current State

Footer already exists from M1:

```tsx
// src/components/Footer.tsx
<footer className={styles.footer}>
  <div className={styles.left}>NIELLESS :: v3.3</div>
  <div className={styles.center}>"Build until it holds."</div>
  <div className={styles.right}>nielless.com</div>
</footer>
```

#### Verification Checklist

- [ ] Footer renders on all pages via `layout.tsx` (already true)
- [ ] Quote in Crimson Pro italic with `--muted2` color
- [ ] Footer below all section content
- [ ] No floating/overlapping issues at any breakpoint
- [ ] Footer `left`/`center`/`right` layout works on mobile (stack if needed)

#### Potential Fixes

If footer wraps poorly on mobile ≤360px, add:
```css
@media (max-width: 768px) {
  .footer {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
```

---

### M5.3 — `page.tsx` Final Section Assembly

#### Complete Page Structure

```tsx
export default function Home() {
  return (
    <div className="page-wrap">
      <section id="hero" aria-label="Introduction">
        <HeroBoot />
      </section>

      <DarkroomSection />

      <section id="blueprint" className="section">
        <SectionShell label="[05] DEPLOYMENT HISTORY" title="CONTACT SHEET" />
        <ContactSheet />
        <StackPanel />
      </section>

      <ContactSection />
    </div>
  );
}
```

#### Section Order (LOCKED)

1. `#hero` — Introduction
2. `#darkroom` — Projects (The Darkroom)
3. `#blueprint` — Career timeline (Contact Sheet)
4. `#contact` — How to reach

#### SiteHeader Anchors Must Match

```tsx
<a href="#darkroom">DARKROOM</a>
<a href="#blueprint">BLUEPRINT</a>
<a href="#contact">CONTACT</a>
```

#### Semantic Verification

- Single `<main id="main">` in layout (already true)
- No duplicate `<main>` elements
- Each section has unique `id` for anchor navigation
- `aria-label` on hero section

---

## Definition of Done Checklist

- [ ] User can complete contact intent in < 2 clicks (click mailto → email client opens)
- [ ] All secondary links open real destinations (no 404, no placeholder)
- [ ] Footer renders below all content on every viewport
- [ ] Full page scroll works end-to-end: hero → darkroom → blueprint → contact → footer
- [ ] Header anchor links scroll to correct sections
- [ ] All links have visible focus states
- [ ] Mobile: links stack or wrap gracefully; no horizontal overflow
- [ ] No non-functional UI elements visible
- [ ] `npm run build` passes

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Resume PDF missing from `/public` | LOW | Verify file exists; add placeholder PDF if needed |
| LinkedIn/GitHub URLs wrong | LOW | Verify actual profile URLs during implementation |
| Footer overlaps contact on short viewports | LOW | Ensure `padding-bottom` on page-wrap gives breathing room |

---

## Agent Prompt

```
Implement Milestone M5 (Contact + Footer) per plan/M5-contact-footer.md.

Create:
1. src/components/ContactSection.tsx + .module.css
   - SectionShell: "[06] CONTACT" / "OPEN CHANNEL"
   - Primary CTA: mailto:nielless.acharya@gmail.com (brass, underline)
   - Secondary links: LinkedIn, GitHub, Resume (mono, muted, uppercase)
   - All links functional — no placeholders

2. Update src/app/page.tsx:
   - Replace contact stub with ContactSection
   - Verify final section order: hero → darkroom → blueprint → contact
   - Verify SiteHeader anchors match section IDs

3. Verify Footer.tsx works correctly at all breakpoints
   - Add mobile flex-direction: column if wrapping occurs

Rules:
- CSS Modules only
- Every control opens a real destination
- No form, no Formspree, no submit button
- rel="noopener noreferrer" on external links

Verify: npm run build && npm run lint pass. Full page scroll hero→contact works.
```

---

## Commit Message

```
feat(v3.3): contact section and footer — single-page complete
```
