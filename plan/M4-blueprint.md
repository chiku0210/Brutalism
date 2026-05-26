# M4 — Blueprint Section (Contact Sheet + Stack Panel)

**Status**: NOT STARTED  
**Spec ref**: Section [05] of `nielless-portfolio-design-spec-v3.html`  
**Estimated effort**: 2–3 hours  
**Complexity**: MEDIUM  
**Depends on**: M3 complete (section order matters for page flow)

---

## Summary

The Blueprint section presents career history as a **contact sheet** — a vertical strip of film frames where the present retains full optical density and past frames progressively lose exposure through opacity and typographic weight (NOT blur). Adjacent is a `$ current --stack` panel showing technology tags.

---

## Architecture Diagram

```
#blueprint (section)
├── SectionShell ("[05] DEPLOYMENT HISTORY" / "CONTACT SHEET")
├── ContactSheet.tsx
│   ├── .film-frame.frame-near  (NOW — ACTIVE)
│   ├── .film-frame.frame-mid   (PUBLICIS SAPIENT)
│   ├── .film-frame.frame-far   (PAYPAL INDIA)
│   └── .film-frame.frame-past  (BITS PILANI)
└── StackPanel.tsx
    └── Tag cloud (9 tags, 2 brass-highlighted)
```

---

## Sub-Milestones & Execution Order

### M4.1 — Data Layer (`src/data/timeline.ts`)

#### Type Definition

```typescript
type DoFClass = "frame-near" | "frame-mid" | "frame-far" | "frame-past";

interface TimelineEntry {
  id: string;
  period: string;
  role: string;
  company?: string;
  bullets: string[];
  dofClass: DoFClass;
  isCurrent?: boolean;
  sortOrder: number;
}
```

#### Data (4 frames, locked from spec)

```typescript
export const timeline: TimelineEntry[] = [
  {
    id: "now",
    period: "NOW — ACTIVE",
    role: "PRODUCT ENGINEERING MODE",
    bullets: [
      "Building AI-native systems with full ownership.",
      "Exiting the consultancy model.",
      "Targeting international remote product roles."
    ],
    dofClass: "frame-near",
    isCurrent: true,
    sortOrder: 1
  },
  {
    id: "publicis",
    period: "JUL 2022 — PRESENT",
    role: "PUBLICIS SAPIENT",
    company: "PUBLICIS SAPIENT",
    bullets: [
      "Full-Stack Software Engineer. Node.js/PostgreSQL.",
      "UHC 100K+ sessions. WCI carbon cap APIs.",
      "Canary pipeline. Zero-downtime DB migration."
    ],
    dofClass: "frame-mid",
    sortOrder: 2
  },
  {
    id: "paypal",
    period: "FEB 2022 — JUN 2022",
    role: "PAYPAL INDIA",
    company: "PAYPAL INDIA",
    bullets: [
      "Rapid Emerging Markets Team.",
      "Interoperability Dashboard. REST APIs + React.",
      "First exposure to production-scale distributed payments."
    ],
    dofClass: "frame-far",
    sortOrder: 3
  },
  {
    id: "bits",
    period: "2018 — 2022",
    role: "BITS PILANI",
    company: "BITS PILANI",
    bullets: [
      "Hyderabad Campus. B.E. Computer Science.",
      "CGPA 7.44. The foundation."
    ],
    dofClass: "frame-past",
    sortOrder: 4
  }
];
```

#### DoF Class Assignment Rule

| Class | Meaning | Condition |
|-------|---------|-----------|
| `frame-near` | Present | `isCurrent: true` |
| `frame-mid` | Recent role | Most recent past employment |
| `frame-far` | Earlier role | Older employment |
| `frame-past` | Education/archival | Historical |

---

### M4.2 — `ContactSheet.tsx`

#### File: `src/components/ContactSheet.tsx` + `.module.css`

#### Visual Spec (from design spec Section [05])

**Film strip border**: Left border + sprocket pseudo-elements (hidden ≤768px)

```css
.contactSheet {
  border-left: 1px solid var(--border);
  padding-left: 20px;
}

.filmFrame {
  position: relative;
  padding: 18px 0 18px 28px;
  border-bottom: 1px solid var(--grid);
  transition: opacity 0.2s, font-weight 0.2s;
  cursor: default;
}

/* Sprocket hole pseudo-element */
.filmFrame::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 12px;
  border: 1px solid var(--border);
  border-radius: 2px;
  opacity: 0.4;
}
```

#### Depth-of-Field Classes (LOCKED from spec)

```css
.frameNear {
  opacity: 1.0;
  font-weight: 400;
  color: var(--dust);
}

.frameMid {
  opacity: 0.82;
  font-weight: 400;
  color: var(--dust);
}

.frameFar {
  opacity: 0.60;
  font-weight: 300;
  color: var(--muted);
}

.framePast {
  opacity: 0.40;
  font-weight: 300;
  color: var(--muted2);
}

/* Hover/Focus override — ALL frames restore to full density */
.filmFrame:hover,
.filmFrame:focus-visible {
  opacity: 1.0;
  font-weight: 400;
  color: var(--dust);
}
```

**NO `filter: blur()` anywhere in the pipeline.**

#### Frame Content Structure

```tsx
<div className={`${styles.filmFrame} ${styles[entry.dofClass]}`} tabindex="0">
  <div className={styles.frameTs}>{entry.period}</div>
  <div className={styles.frameTitle}>{entry.role}</div>
  <div className={styles.frameDesc}>
    {entry.bullets.join(' ')}
  </div>
</div>
```

**Typography per frame part**:
- `.frameTs`: mono 9px, period text (brass for current, muted for others)
- `.frameTitle`: mono 13px, bold/display treatment
- `.frameDesc`: mono 11px, descriptive text

#### Keyboard Accessibility

- Each frame has `tabindex="0"`
- `:focus-visible` triggers same override as `:hover` (full density)
- Tab order follows chronological order (present first)

#### Mobile (≤768px)

- Sprocket holes hidden (`display: none` on `::before`)
- Vertical strip maintained
- DoF recession remains (opacity/weight only)
- Tap-to-focus works as hover substitute

---

### M4.3 — `StackPanel.tsx`

#### File: `src/components/StackPanel.tsx` + `.module.css`

#### Visual Spec

```css
.stackPanel {
  background: var(--surface);
  border: 1px solid var(--grid);
  padding: 16px 18px;
  margin-top: 20px;
}

.stackHeader {
  font-family: var(--mono);
  font-size: 9px;
  color: var(--muted2);
  letter-spacing: 0.1em;
  margin-bottom: 10px;
}

.tagGrid {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
```

#### Tags (9 total, 2 brass-highlighted)

| Tag | Style |
|-----|-------|
| NODE.JS | default (dust/mono) |
| TYPESCRIPT | default |
| POSTGRESQL | default |
| NEXT.JS | default |
| [LLM AGENTS] | **brass** (`color: var(--brass); border-color: var(--brass-dim)`) |
| [AGENTIC SDLC] | **brass** (`color: var(--brass); border-color: var(--brass-dim)`) |
| AWS | default |
| DOCKER | default |
| PYTHON | default |

**Brass highlight rule**: ONLY tags whose label is wrapped in square brackets use brass styling. This is not arbitrary — it represents the current focus/specialization.

#### Implementation

```tsx
const STACK_TAGS = [
  { label: "NODE.JS", brass: false },
  { label: "TYPESCRIPT", brass: false },
  { label: "POSTGRESQL", brass: false },
  { label: "NEXT.JS", brass: false },
  { label: "[LLM AGENTS]", brass: true },
  { label: "[AGENTIC SDLC]", brass: true },
  { label: "AWS", brass: false },
  { label: "DOCKER", brass: false },
  { label: "PYTHON", brass: false },
];
```

Use the global `.tag` utility class from `globals.css`, adding brass color via a conditional class.

---

### M4.4 — Page Integration

#### `page.tsx` Update

Replace the blueprint stub with:
```tsx
<section id="blueprint" className="section">
  <SectionShell label="[05] DEPLOYMENT HISTORY" title="CONTACT SHEET" />
  <ContactSheet />
  <StackPanel />
</section>
```

Or wrap in a `BlueprintSection.tsx` if preferred for encapsulation.

#### Header Anchor

Verify `href="#blueprint"` in SiteHeader scrolls correctly to the section.

---

## Definition of Done Checklist

- [ ] Timeline readable with 4 frames in correct chronological order
- [ ] Past frames visibly recede (opacity/weight decrease per DoF class)
- [ ] Hover/focus on any frame restores full density (opacity 1, weight 400, dust color)
- [ ] No `filter: blur()` used anywhere
- [ ] Stack panel shows 9 tags with correct brass highlighting on bracketed labels
- [ ] `$ current --stack` header visible above tags
- [ ] Header anchor `#blueprint` works from SiteHeader
- [ ] Each frame is keyboard-focusable (`tabindex="0"`)
- [ ] Mobile ≤768px: sprockets hidden, DoF maintained, tap-focus works
- [ ] `npm run build` passes

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| DoF opacity too subtle on low-contrast displays | LOW | Test on multiple monitors; values are from spec |
| Hover transition feels laggy | LOW | Keep at 0.2s; pure CSS transition |
| Stack tags wrap awkwardly on narrow screens | LOW | `flex-wrap: wrap` + `gap: 6px` handles this naturally |

---

## Agent Prompt (single execution)

```
Implement Milestone M4 (Blueprint section) per plan/M4-blueprint.md.

Create:
1. src/data/timeline.ts — full TimelineEntry data (4 frames)
2. src/components/ContactSheet.tsx + .module.css — film strip timeline with DoF
3. src/components/StackPanel.tsx + .module.css — tech tag panel

Wire into page.tsx replacing the blueprint stub section.

Spec rules:
- DoF via opacity/weight ONLY (no blur)
- Brass tags: only [LLM AGENTS] and [AGENTIC SDLC]
- Sprocket holes hidden on mobile ≤768px
- All frames tabindex="0" with :hover/:focus-visible full-density override
- Use existing .tag utility class from globals.css
- CSS Modules only, no inline styles

Verify: npm run build && npm run lint pass.
```

---

## Commit Message

```
feat(v3.3): blueprint timeline contact sheet and stack panel
```
