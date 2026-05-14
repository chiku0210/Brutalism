"use client";

import React, { useEffect, useState } from 'react';
import { motion, useAnimate } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Phase = 'blurred' | 'focused' | 'done';

// ── WarpLayer — wraps ONLY page content, applies scale+blur ──
// Nav and fixed instruments (ApertureRing, Cursor, etc.) must live OUTSIDE
// this component in layout.tsx so they are never affected by filter.
export const WarpLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduced = useReducedMotion();
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (reduced) return;

    const el = scope.current;
    if (!el) return;

    // Paint initial blurred/zoomed state synchronously before browser commits
    el.style.transform = 'scale(1.055)';
    el.style.filter = 'blur(10px) brightness(0.65)';
    el.style.willChange = 'transform, filter';

    // One rAF ensures the initial state is committed to the compositor
    // before we start animating — prevents flash-of-sharp-content
    const raf = requestAnimationFrame(() => {
      animate(
        el,
        { scale: 1, filter: 'blur(0px) brightness(1)' },
        { duration: 1.1, ease: [0.22, 1, 0.36, 1] }
      ).then(() => {
        el.style.willChange = 'auto';
      });
    });

    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  return (
    <div
      ref={scope}
      style={{
        transformOrigin: 'center center',
        overflow: 'visible',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  );
};

// ── ViewfinderHUD — fixed crosshair + corner brackets, always sharp ──
export const ViewfinderHUD: React.FC = () => {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>('blurred');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (reduced) { setPhase('done'); return; }
    const t1 = setTimeout(() => setPhase('focused'), 1100);
    const t2 = setTimeout(() => setPhase('done'), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [reduced]);

  if (!mounted) return null;

  const isFocused = phase === 'focused' || phase === 'done';
  const isAmbient = phase === 'done';
  const bracketColor = isAmbient ? 'var(--brass-dim)' : 'var(--brass)';
  const B = 20;

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
      {/* Centre crosshair */}
      <motion.div
        initial={{ opacity: 0, scale: 1.3 }}
        animate={{ opacity: isFocused ? (isAmbient ? 0.22 : 1) : 0, scale: isFocused ? 1 : 1.3 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          x: '-50%',
          y: '-50%',
          width: '32px',
          height: '32px',
        }}
      >
        {/* Horizontal arm */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '24px', height: '1px',
          backgroundColor: bracketColor,
        }} />
        {/* Vertical arm */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '1px', height: '24px',
          backgroundColor: bracketColor,
        }} />
        {/* Centre dot — glows on focus-acquire only */}
        <motion.div
          animate={{
            opacity: isAmbient ? 0 : (isFocused ? 1 : 0),
          }}
          transition={{ duration: 0.4 }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '4px', height: '4px',
            borderRadius: '50%',
            backgroundColor: 'var(--brass)',
            boxShadow: '0 0 6px var(--brass)',
          }}
        />
      </motion.div>

      {/* Corner brackets — slide in from outside */}
      <Bracket pos={{ top: '22px', left: '22px' }}  border="tl" color={bracketColor} show={isFocused} ambient={isAmbient} delay={0.05}  offset={[-7,-7]} size={B} />
      <Bracket pos={{ top: '22px', right: '22px' }} border="tr" color={bracketColor} show={isFocused} ambient={isAmbient} delay={0.10} offset={[7,-7]}  size={B} />
      <Bracket pos={{ bottom: '22px', left: '22px' }}  border="bl" color={bracketColor} show={isFocused} ambient={isAmbient} delay={0.15} offset={[-7,7]}  size={B} />
      <Bracket pos={{ bottom: '22px', right: '22px' }} border="br" color={bracketColor} show={isFocused} ambient={isAmbient} delay={0.20} offset={[7,7]}   size={B} />

      {/* AF metadata — top-right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? (isAmbient ? 0.18 : 0.8) : 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          position: 'absolute', top: '48px', right: '48px',
          fontFamily: 'var(--font-mono)', fontSize: '8px',
          color: 'var(--brass)', letterSpacing: '0.12em',
          lineHeight: 2, textAlign: 'right',
        }}
      >
        <div>AF ● LOCK</div>
        <div style={{ color: 'var(--brass-dim)', fontSize: '7px' }}>f/1.4 · ISO 100</div>
      </motion.div>

      {/* Build tag — bottom-left */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isFocused ? (isAmbient ? 0.12 : 0.5) : 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          position: 'absolute', bottom: '48px', left: '48px',
          fontFamily: 'var(--font-mono)', fontSize: '7px',
          color: 'var(--muted2)', letterSpacing: '0.1em', lineHeight: 2,
        }}
      >
        <div>NIELLESS.COM</div>
        <div>v4.0.0</div>
      </motion.div>
    </div>
  );
};

// ── Bracket sub-component ──
interface BracketProps {
  pos:     { top?: string; bottom?: string; left?: string; right?: string };
  border:  'tl' | 'tr' | 'bl' | 'br';
  color:   string;
  show:    boolean;
  ambient: boolean;
  delay:   number;
  offset:  [number, number];
  size:    number;
}

const Bracket: React.FC<BracketProps> = ({ pos, border, color, show, ambient, delay, offset, size }) => {
  const borderStyle: React.CSSProperties = {
    borderTop:    (border === 'tl' || border === 'tr') ? `1px solid ${color}` : undefined,
    borderBottom: (border === 'bl' || border === 'br') ? `1px solid ${color}` : undefined,
    borderLeft:   (border === 'tl' || border === 'bl') ? `1px solid ${color}` : undefined,
    borderRight:  (border === 'tr' || border === 'br') ? `1px solid ${color}` : undefined,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: offset[0], y: offset[1] }}
      animate={{
        opacity: show ? (ambient ? 0.28 : 1) : 0,
        x: show ? 0 : offset[0],
        y: show ? 0 : offset[1],
      }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        ...pos,
        ...borderStyle,
      }}
    />
  );
};
