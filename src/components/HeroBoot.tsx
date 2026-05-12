"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// How long the WarpLayer focus-pull takes before content should appear.
// Must match the duration in ViewfinderLanding WarpLayer (1100ms).
const FOCUS_PULL_MS = 1100;

export const HeroBoot = ({ onCompile }: { onCompile: () => void }) => {
  const { playSound, resumeContext } = useAudio();
  const reduced = useReducedMotion();
  const [lines, setLines] = useState<string[]>([]);
  const [showHeadline, setShowHeadline] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);

  const terminalLines = [
    "NIELLESS OPTICAL SYSTEMS",
    "SENSOR: 35MM FULL-FRAME \u00b7 MOUNT: AI-NATIVE",
    "APERTURE: f/LOGIC \u00b7 ISO: MINIMUM",
    "SHUTTER: ARMED",
  ];

  useEffect(() => {
    if (reduced) {
      setLines(terminalLines);
      setShowHeadline(true);
      return;
    }

    // Each line fires AFTER the focus-pull completes.
    // FOCUS_PULL_MS + stagger: 0 / 160 / 320 / 480ms
    // Then headline 200ms after last line.
    const base = FOCUS_PULL_MS;
    const stagger = 160;
    const timers: ReturnType<typeof setTimeout>[] = [];

    terminalLines.forEach((line, i) => {
      timers.push(setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (i === terminalLines.length - 1) {
          timers.push(setTimeout(() => setShowHeadline(true), 200));
        }
      }, base + i * stagger));
    });

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const handleRelease = async () => {
    if (isCompiling) return;
    await resumeContext();
    playSound("thud");
    setIsCompiling(true);
    setTimeout(() => onCompile(), 380);
  };

  const lineColor = (i: number) => {
    if (i === 3) return 'var(--signal)';
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

      {/* Right-edge ambient tech ticker */}
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
            {['Node.js','PostgreSQL','TypeScript','AWS','Next.js','LLM Agents','Docker','React','Python','Go'].map(t => (
              <div key={t}>{t}</div>
            ))}
            {['Node.js','PostgreSQL','TypeScript','AWS','Next.js','LLM Agents','Docker','React','Python','Go'].map(t => (
              <div key={t+'_2'}>{t}</div>
            ))}
          </motion.div>
        )}
      </div>

      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>

        {/* Boot terminal lines */}
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', marginBottom: '48px', minHeight: '88px' }}>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              style={{ color: lineColor(i), lineHeight: 2.2 }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showHeadline && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Headline — each word snaps up into view */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 8vw, 62px)',
                lineHeight: 0.95,
                marginBottom: '20px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                {[
                  { text: 'ORDER.',     color: 'var(--dust)' },
                  { text: 'LOGIC.',     color: 'var(--dust)' },
                  { text: 'AMOR FATI.', color: 'var(--brass)' },
                ].map(({ text, color }, i) => (
                  <motion.span
                    key={text}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'block', color }}
                  >
                    {text}
                  </motion.span>
                ))}
              </h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6 }}
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

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5 }}
                onMouseEnter={() => playSound('solenoid')}
                onClick={handleRelease}
                aria-label="Release shutter and enter portfolio"
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid var(--brass-dim)',
                  padding: '12px 28px',
                  cursor: 'pointer',
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

      {/* Shutter wipe out */}
      <AnimatePresence>
        {isCompiling && (
          <motion.div
            aria-hidden="true"
            initial={{ scaleX: 0 }}
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
