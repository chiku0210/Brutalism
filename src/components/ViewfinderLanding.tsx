"use client";

/**
 * ViewfinderLanding
 * 
 * Simulates pointing a vintage DSLR at a scene and pulling focus:
 *   Phase 0 — void black (0ms)
 *   Phase 1 — content fades in, slightly zoomed (1.06×) and blurred (8px) → "out of focus"
 *   Phase 2 — zoom eases back to 1× and blur dissolves → "focus acquired"
 *   Phase 3 — overlay disappears, site is live
 * 
 * The centre crosshair (+) reticle persists permanently as the viewfinder
 * focus point indicator. It fades from full brass on focus-acquire to
 * a dim ambient presence.
 * 
 * No animation libraries — pure CSS keyframes + a single useEffect timer.
 * Respects prefers-reduced-motion: skips directly to focused state.
 */

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Phase = 'void' | 'blurred' | 'focused' | 'done';

export const ViewfinderLanding: React.FC = () => {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('void');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (reduced) {
      setPhase('done');
      return;
    }

    // Phase timeline:
    // 0ms    : void (black)
    // 80ms   : blurred (content visible but out of focus + zoomed)
    // 1000ms : focused (zoom snaps back, blur dissolves)
    // 2200ms : done (overlay removed, reticle settles to ambient)
    const t1 = setTimeout(() => setPhase('blurred'),  80);
    const t2 = setTimeout(() => setPhase('focused'),  1000);
    const t3 = setTimeout(() => setPhase('done'),     2200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [reduced]);

  if (!mounted) return null;

  const overlayVisible = phase === 'void' || phase === 'blurred' || phase === 'focused';

  return (
    <>
      {/* ── Content warp layer
            Sits between the page content and the overlay.
            Applies the zoom + blur to the ENTIRE page via a wrapper.
            Uses a portal-style fixed cover so layout is unaffected. */}
      <style>{`
        /* Warp layer applied to root container during focus-pull */
        @keyframes vf-zoom-blur {
          0%   { transform: scale(1.06); filter: blur(8px) brightness(0.7); }
          100% { transform: scale(1);    filter: blur(0px) brightness(1);   }
        }
        @keyframes vf-focus-confirm {
          0%   { opacity: 0; }
          30%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0.18; }
        }
        @keyframes vf-reticle-in {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(1.4); }
          40%  { opacity: 1; transform: translate(-50%, -50%) scale(1.0); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1.0); }
        }
        @keyframes vf-bracket-slide-tl {
          0%   { transform: translate(-6px, -6px); opacity: 0; }
          100% { transform: translate(0, 0);       opacity: 1; }
        }
        @keyframes vf-bracket-slide-tr {
          0%   { transform: translate(6px, -6px);  opacity: 0; }
          100% { transform: translate(0, 0);       opacity: 1; }
        }
        @keyframes vf-bracket-slide-bl {
          0%   { transform: translate(-6px, 6px);  opacity: 0; }
          100% { transform: translate(0, 0);       opacity: 1; }
        }
        @keyframes vf-bracket-slide-br {
          0%   { transform: translate(6px, 6px);   opacity: 0; }
          100% { transform: translate(0, 0);       opacity: 1; }
        }

        /* Applied to #root-container during blurred phase */
        .vf-phase-blurred #root-container {
          animation: vf-zoom-blur 1120ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        /* Transition preserved after focused */
        .vf-phase-focused #root-container,
        .vf-phase-done #root-container {
          transform: scale(1);
          filter: blur(0px) brightness(1);
        }
      `}</style>

      {/* Phase class on body for CSS targeting */}
      {mounted && (
        <PhaseClassApplicator phase={phase} />
      )}

      {/* ── Void black overlay — fades out as blur kicks in ── */}
      {overlayVisible && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 8000,
            backgroundColor: 'var(--void)',
            pointerEvents: phase === 'void' ? 'auto' : 'none',
            opacity: phase === 'void' ? 1 : 0,
            transition: 'opacity 120ms ease',
          }}
        />
      )}

      {/* ── Viewfinder HUD overlay ── */}
      {(phase === 'blurred' || phase === 'focused' || phase === 'done') && (
        <ViewfinderHUD phase={phase} />
      )}
    </>
  );
};

/* Applies phase class to <html> so CSS can target #root-container */
const PhaseClassApplicator: React.FC<{ phase: Phase }> = ({ phase }) => {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('vf-phase-void', 'vf-phase-blurred', 'vf-phase-focused', 'vf-phase-done');
    html.classList.add(`vf-phase-${phase}`);
  }, [phase]);
  return null;
};

/* The viewfinder HUD: centre crosshair + corner brackets + metadata */
const ViewfinderHUD: React.FC<{ phase: Phase }> = ({ phase }) => {
  const isFocused  = phase === 'focused' || phase === 'done';
  const isAmbient  = phase === 'done';

  // Corner bracket size
  const B = 22;
  const STROKE = '1px';
  const COLOR_ACTIVE  = 'var(--brass)';
  const COLOR_AMBIENT = 'var(--brass-dim)';
  const bracketColor  = isAmbient ? COLOR_AMBIENT : COLOR_ACTIVE;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 7999,
        pointerEvents: 'none',
        // Fade the whole HUD to low opacity once the site is live
        opacity: isAmbient ? 0.35 : 1,
        transition: 'opacity 800ms ease',
      }}
    >
      {/* ── Centre crosshair (the focus point) ── */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        animation: isFocused ? 'vf-reticle-in 600ms cubic-bezier(0.22,1,0.36,1) forwards' : undefined,
        opacity: isFocused ? undefined : 0,
      }}>
        {/* Horizontal bar */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '1px',
          backgroundColor: bracketColor,
          opacity: 0.9,
        }} />
        {/* Vertical bar */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1px',
          height: '20px',
          backgroundColor: bracketColor,
          opacity: 0.9,
        }} />
        {/* Centre dot */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          backgroundColor: isFocused && !isAmbient ? 'var(--brass)' : 'transparent',
          boxShadow: isFocused && !isAmbient ? '0 0 8px var(--brass)' : 'none',
          transition: 'all 400ms ease',
        }} />
      </div>

      {/* ── Corner viewfinder brackets ── */}
      {/* Top-left */}
      <div style={{
        position: 'absolute',
        top: '24px', left: '24px',
        width: `${B}px`, height: `${B}px`,
        borderTop: `${STROKE} solid ${bracketColor}`,
        borderLeft: `${STROKE} solid ${bracketColor}`,
        animation: isFocused ? 'vf-bracket-slide-tl 500ms 100ms cubic-bezier(0.22,1,0.36,1) both' : undefined,
        opacity: isFocused ? undefined : 0,
      }} />
      {/* Top-right */}
      <div style={{
        position: 'absolute',
        top: '24px', right: '24px',
        width: `${B}px`, height: `${B}px`,
        borderTop: `${STROKE} solid ${bracketColor}`,
        borderRight: `${STROKE} solid ${bracketColor}`,
        animation: isFocused ? 'vf-bracket-slide-tr 500ms 150ms cubic-bezier(0.22,1,0.36,1) both' : undefined,
        opacity: isFocused ? undefined : 0,
      }} />
      {/* Bottom-left */}
      <div style={{
        position: 'absolute',
        bottom: '24px', left: '24px',
        width: `${B}px`, height: `${B}px`,
        borderBottom: `${STROKE} solid ${bracketColor}`,
        borderLeft: `${STROKE} solid ${bracketColor}`,
        animation: isFocused ? 'vf-bracket-slide-bl 500ms 200ms cubic-bezier(0.22,1,0.36,1) both' : undefined,
        opacity: isFocused ? undefined : 0,
      }} />
      {/* Bottom-right */}
      <div style={{
        position: 'absolute',
        bottom: '24px', right: '24px',
        width: `${B}px`, height: `${B}px`,
        borderBottom: `${STROKE} solid ${bracketColor}`,
        borderRight: `${STROKE} solid ${bracketColor}`,
        animation: isFocused ? 'vf-bracket-slide-br 500ms 250ms cubic-bezier(0.22,1,0.36,1) both' : undefined,
        opacity: isFocused ? undefined : 0,
      }} />

      {/* ── Focus confirm metadata strip (top-right corner, inside bracket) ── */}
      {isFocused && (
        <div style={{
          position: 'absolute',
          top: '52px',
          right: '52px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: isAmbient ? 'var(--muted2)' : 'var(--brass)',
          letterSpacing: '0.12em',
          lineHeight: 1.8,
          textAlign: 'right',
          opacity: isAmbient ? 0.6 : 1,
          transition: 'color 600ms ease, opacity 600ms ease',
          animation: 'vf-focus-confirm 1200ms ease forwards',
        }}>
          <div>AF ● LOCK</div>
          <div style={{ color: isAmbient ? 'var(--muted2)' : 'var(--brass-dim)', fontSize: '8px' }}>f/1.4 · ISO 100</div>
        </div>
      )}

      {/* ── Focus confirm metadata strip (bottom-left, inside bracket) ── */}
      {isFocused && (
        <div style={{
          position: 'absolute',
          bottom: '52px',
          left: '52px',
          fontFamily: 'var(--font-mono)',
          fontSize: '8px',
          color: isAmbient ? 'var(--muted2)' : 'var(--muted)',
          letterSpacing: '0.1em',
          lineHeight: 1.8,
          opacity: isAmbient ? 0.4 : 0.7,
          transition: 'opacity 600ms ease',
          animation: 'vf-focus-confirm 1200ms 200ms ease forwards',
        }}>
          <div>NIELLESS.COM</div>
          <div>v4.0.0-production</div>
        </div>
      )}
    </div>
  );
};
