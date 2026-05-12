"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const HeroBoot = ({ onCompile }: { onCompile: () => void }) => {
  const { playSound, resumeContext } = useAudio();
  const reduced = useReducedMotion();
  const [lines, setLines] = useState<string[]>([]);
  const [showHeadline, setShowHeadline] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  // Spec §03 — exact boot terminal lines
  const terminalLines = [
    "NIELLESS OPTICAL SYSTEMS",
    "SENSOR: 35MM FULL-FRAME · MOUNT: AI-NATIVE",
    "APERTURE: f/LOGIC · ISO: MINIMUM",
    "SHUTTER: ARMED",
  ];

  // Boot sequence timing per spec:
  // 0ms void, 200ms line1, 400ms line2, 600ms line3 (armed), 800ms headline
  useEffect(() => {
    if (reduced) {
      setLines(terminalLines);
      setShowHeadline(true);
      return;
    }

    const delays = [200, 400, 600, 800];
    const timers: ReturnType<typeof setTimeout>[] = [];

    terminalLines.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (i === terminalLines.length - 1) {
          timers.push(setTimeout(() => setShowHeadline(true), 200));
        }
      }, delays[i]));
    });

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const handleRelease = async () => {
    if (isCompiling) return;
    await resumeContext();
    playSound("thud");
    setIsCompiling(true);
    // 180ms shutter curtain + 200ms mechanical delay = 380ms before route
    setTimeout(() => onCompile(), 380);
  };

  const lineColor = (i: number) => {
    if (i === 3) return 'var(--signal)'; // SHUTTER: ARMED
    if (i === 1 || i === 2) return 'var(--brass)';
    return 'var(--muted2)';
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '0 var(--page-padding)',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'var(--void)'
    }}>

      {/* Right-edge tech ticker (ambient, pointer-events none) */}
      <div style={{
        position: 'absolute',
        right: 'var(--page-padding)',
        top: '50%',
        transform: 'translateY(-50%)',
        opacity: 0.08,
        pointerEvents: 'none',
        overflow: 'hidden',
        height: '300px'
      }} className="hidden lg:block">
        {!reduced && (
          <motion.div
            animate={{ y: [0, -200] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'var(--muted)'
            }}
          >
            {['Node.js', 'PostgreSQL', 'TypeScript', 'AWS', 'Next.js', 'LLM Agents', 'Docker', 'React', 'Python', 'Go'].map(t => (
              <div key={t}>{t}</div>
            ))}
            {['Node.js', 'PostgreSQL', 'TypeScript', 'AWS', 'Next.js', 'LLM Agents', 'Docker', 'React', 'Python', 'Go'].map(t => (
              <div key={t + '_2'}>{t}</div>
            ))}
          </motion.div>
        )}
      </div>

      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>

        {/* Boot terminal */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '48px', minHeight: '88px' }}>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={reduced ? { opacity: 1 } : { opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ color: lineColor(i), lineHeight: 2.2 }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showHeadline && (
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduced ? 0 : 0.8 }}
            >
              {/* Headline — spec: ORDER. / LOGIC. / AMOR FATI. */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 8vw, 62px)',
                lineHeight: 0.95,
                marginBottom: '20px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                {[
                  { text: 'ORDER.', color: 'var(--dust)' },
                  { text: 'LOGIC.', color: 'var(--dust)' },
                  { text: 'AMOR FATI.', color: 'var(--brass)' },
                ].map(({ text, color }, i) => (
                  <motion.span
                    key={text}
                    initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reduced ? 0 : 0.2 + i * 0.2, duration: 0.5 }}
                    style={{ display: 'block', color }}
                  >
                    {text}
                  </motion.span>
                ))}
              </h1>

              {/* Subtext — Crimson Pro italic */}
              <motion.p
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 1, duration: 0.8 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontStyle: 'italic',
                  color: 'var(--muted)',
                  fontSize: '15px',
                  maxWidth: '400px',
                  marginBottom: '36px',
                  lineHeight: 1.8
                }}
              >
                Full-Stack Engineer. AI-native builder. Backend-first. Systems that hold under load — or are rebuilt until they do.
              </motion.p>

              {/* Hot Shoe CTA — spec: [ RELEASE SHUTTER ] */}
              <motion.button
                initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduced ? 0 : 1.2, duration: 0.5 }}
                onMouseEnter={() => playSound('solenoid')}
                onClick={handleRelease}
                aria-label="Release shutter and enter portfolio"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--brass-dim)',
                  padding: '12px 28px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'border-color 0.12s ease'
                }}
                onMouseOver={e => (e.currentTarget.style.borderColor = 'var(--brass-bright)')}
                onMouseOut={e => (e.currentTarget.style.borderColor = 'var(--brass-dim)')}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  color: 'var(--brass)',
                  textTransform: 'uppercase'
                }}>
                  [ RELEASE SHUTTER ]
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Shutter wipe — void black, scaleX from left, per spec */}
      <AnimatePresence>
        {isCompiling && (
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'var(--void)',
              zIndex: 1000,
              transformOrigin: 'left center'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
