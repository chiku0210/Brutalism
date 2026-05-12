"use client";

/**
 * ViewfinderLanding
 *
 * On mount, wraps page content in a Framer Motion div that:
 *   1. Starts at scale(1.06) + blur(10px) + brightness(0.65)  — "out of focus"
 *   2. Animates to scale(1) + blur(0) + brightness(1)          — "focus acquired"
 *
 * A fixed HUD layer (crosshair + corner brackets) sits OUTSIDE the warp
 * so it is never blurred itself.
 *
 * Architecture:
 *   layout.tsx renders:
 *     <WarpLayer>          ← this component drives scale+filter
 *       <PageContent />    ← only this is blurred/zoomed
 *     </WarpLayer>
 *     <ViewfinderHUD />    ← fixed, always sharp, persists after done
 *
 * Why NOT CSS class on #root-container:
 *   - filter on a containing block breaks position:fixed for all children
 *     (Nav, ApertureRing, Cursor would get trapped in the stacking context)
 *   - JS hydration timing means class is applied AFTER the animation window
 *
 * Instead: <motion.div> wraps ONLY <PageTransition>{children}</PageTransition>
 * so Nav + fixed instruments are untouched.
 */

import React, { useEffect, useState, createContext, useContext } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// ── Context so WarpLayer & HUD can share phase state ──
type Phase = 'blurred' | 'focused' | 'done';
interface VFCtx { phase: Phase }
const VFContext = createContext<VFCtx>({ phase: 'done' });

// ── Hook for child consumers (e.g. HeroBoot delay) ──
export const useViewfinderPhase = () => useContext(VFContext);

// ── WarpLayer — wraps ONLY page content ──
export const WarpLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduced = useReducedMotion();
  const controls = useAnimation();
  const [phase, setPhase] = useState<Phase>('blurred');

  useEffect(() => {
    if (reduced) {
      setPhase('done');
      return;
    }

    // Start: zoomed in + blurred
    controls.set({ scale: 1.055, filter: 'blur(10px) brightness(0.65)' });

    // After a single rAF to ensure the initial state is painted,
    // animate to sharp focus over 1.1s with a custom spring curve
    const raf = requestAnimationFrame(() => {
      controls.start({
        scale: 1,
        filter: 'blur(0px) brightness(1)',
        transition: {
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1], // custom ease-out-expo — snappy focus snap
        },
      }).then(() => {
        setPhase('focused');
        setTimeout(() => setPhase('done'), 800);
      });
    });

    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <VFContext.Provider value={{ phase }}>
      <motion.div
        animate={controls}
        style={{
          // Initial state set via controls.set — no flash of un-animated state
          transformOrigin: 'center center',
          willChange: phase === 'blurred' ? 'transform, filter' : 'auto',
          // Ensure this wrapper never clips fixed children that happen to be
          // inside — it doesn't contain any, but defensive
          overflow: 'visible',
          minHeight: '100vh',
        }}
      >
        {children}
      </motion.div>
    </VFContext.Provider>
  );
};

// ── ViewfinderHUD — fixed overlay, always sharp ──
export const ViewfinderHUD: React.FC = () => {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('blurred');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (reduced) { setPhase('done'); return; }

    // Mirror the WarpLayer timeline
    const t1 = setTimeout(() => setPhase('focused'), 1100);
    const t2 = setTimeout(() => setPhase('done'),    1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [reduced]);

  if (!mounted) return null;

  const isFocused = phase === 'focused' || phase === 'done';
  const isAmbient = phase === 'done';
  const B = 20; // bracket arm length px
  const bracketColor = isAmbient ? 'var(--brass-dim)' : 'var(--brass)';
  const bracketOpacity = isAmbient ? 0.28 : 1;

  // Bracket slide-in animation configs
  const slideVariants = {
    hidden: (offset: [number, number]) => ({
      opacity: 0,
      x: offset[0],
      y: offset[1],
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
    ambient: {
      opacity: bracketOpacity,
      x: 0,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const bracketStyle = (pos: { top?: string; bottom?: string; left?: string; right?: string }) => ({
    position: 'absolute' as const,
    width: `${B}px`,
    height: `${B}px`,
    ...pos,
  });

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 7998,
        pointerEvents: 'none',
      }}
    >
      {/* ── Centre crosshair ── */}
      <motion.div
        initial={{ opacity: 0, scale: 1.3 }}
        animate={isFocused ? {
          opacity: isAmbient ? 0.22 : 1,
          scale: 1,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        } : { opacity: 0, scale: 1.3 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '32px',
          height: '32px',
        }}
      >
        {/* Horizontal arm */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '24px', height: '1px',
          backgroundColor: bracketColor,
        }} />
        {/* Vertical arm */}
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1px', height: '24px',
          backgroundColor: bracketColor,
        }} />
        {/* Centre dot — glows on focus-acquire, gone when ambient */}
        <motion.div
          animate={{
            opacity: isAmbient ? 0 : isFocused ? 1 : 0,
            boxShadow: isAmbient ? 'none' : '0 0 6px var(--brass)',
          }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '4px', height: '4px',
            borderRadius: '50%',
            backgroundColor: 'var(--brass)',
          }}
        />
      </motion.div>

      {/* ── Corner brackets ── */}
      {/* Top-left */}
      <motion.div
        custom={[-7, -7]}
        variants={slideVariants}
        initial="hidden"
        animate={isFocused ? (isAmbient ? 'ambient' : 'visible') : 'hidden'}
        transition={{ delay: 0.05 }}
        style={{ ...bracketStyle({ top: '22px', left: '22px' }),
          borderTop: `1px solid ${bracketColor}`,
          borderLeft: `1px solid ${bracketColor}`,
        }}
      />
      {/* Top-right */}
      <motion.div
        custom={[7, -7]}
        variants={slideVariants}
        initial="hidden"
        animate={isFocused ? (isAmbient ? 'ambient' : 'visible') : 'hidden'}
        transition={{ delay: 0.1 }}
        style={{ ...bracketStyle({ top: '22px', right: '22px' }),
          borderTop: `1px solid ${bracketColor}`,
          borderRight: `1px solid ${bracketColor}`,
        }}
      />
      {/* Bottom-left */}
      <motion.div
        custom={[-7, 7]}
        variants={slideVariants}
        initial="hidden"
        animate={isFocused ? (isAmbient ? 'ambient' : 'visible') : 'hidden'}
        transition={{ delay: 0.15 }}
        style={{ ...bracketStyle({ bottom: '22px', left: '22px' }),
          borderBottom: `1px solid ${bracketColor}`,
          borderLeft: `1px solid ${bracketColor}`,
        }}
      />
      {/* Bottom-right */}
      <motion.div
        custom={[7, 7]}
        variants={slideVariants}
        initial="hidden"
        animate={isFocused ? (isAmbient ? 'ambient' : 'visible') : 'hidden'}
        transition={{ delay: 0.2 }}
        style={{ ...bracketStyle({ bottom: '22px', right: '22px' }),
          borderBottom: `1px solid ${bracketColor}`,
          borderRight: `1px solid ${bracketColor}`,
        }}
      />

      {/* ── AF metadata — top-right, inside bracket ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? (isAmbient ? 0.18 : 0.8) : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          position: 'absolute',
          top: '48px', right: '48px',
          fontFamily: 'var(--font-mono)',
          fontSize: '8px',
          color: 'var(--brass)',
          letterSpacing: '0.12em',
          lineHeight: 2,
          textAlign: 'right',
        }}
      >
        <div>AF ● LOCK</div>
        <div style={{ color: 'var(--brass-dim)', fontSize: '7px' }}>f/1.4 · ISO 100</div>
      </motion.div>

      {/* ── Build tag — bottom-left, inside bracket ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? (isAmbient ? 0.12 : 0.5) : 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          position: 'absolute',
          bottom: '48px', left: '48px',
          fontFamily: 'var(--font-mono)',
          fontSize: '7px',
          color: 'var(--muted2)',
          letterSpacing: '0.1em',
          lineHeight: 2,
        }}
      >
        <div>NIELLESS.COM</div>
        <div>v4.0.0</div>
      </motion.div>
    </div>
  );
};
