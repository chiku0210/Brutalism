"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./AudioProvider";

export const HeroBoot = ({ onCompile }: { onCompile: () => void }) => {
  const { playSound, resumeContext } = useAudio();
  const [lines, setLines] = useState<string[]>([]);
  const [showHeadline, setShowHeadline] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  
  const terminalLines = [
    "[BOOT] nielless.com — v4.0.0-production",
    "▸ Loading systems...",
    "▸ All systems nominal.",
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < terminalLines.length) {
        setLines(prev => [...prev, terminalLines[currentLine]]);
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowHeadline(true), 500);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleCompile = async () => {
    await resumeContext();
    setIsCompiling(true);
    playSound("thud");
    // Wipe duration is 180ms according to spec
    setTimeout(() => {
      onCompile();
    }, 400);
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
      {/* Tech Stack Ticker */}
      <div style={{
          position: 'absolute',
          right: 'var(--page-padding)',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.1,
          pointerEvents: 'none',
          overflow: 'hidden',
          height: '300px'
      }} className="hidden lg:block">
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
            {['Node.js', 'PostgreSQL', 'TypeScript', 'AWS', 'Next.js', 'LLM Agents', 'Docker', 'React', 'Python', 'Go'].map((tech) => (
                <div key={tech}>{tech}</div>
            ))}
            {['Node.js', 'PostgreSQL', 'TypeScript', 'AWS', 'Next.js', 'LLM Agents', 'Docker', 'React', 'Python', 'Go'].map((tech) => (
                <div key={tech + "_2"}>{tech}</div>
            ))}
        </motion.div>
      </div>

      <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', marginBottom: '48px', height: '80px' }}>
          {lines.map((line, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ color: i === 2 ? 'var(--signal)' : 'var(--muted2)' }}
            >
              {line}
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showHeadline && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
              <h1 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(40px, 8vw, 72px)',
                  lineHeight: 0.95,
                  marginBottom: '20px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
              }}>
                <motion.span 
                  initial={{ opacity: 0, y: 12 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{ display: 'block' }}
                >
                  Order.
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 12 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{ display: 'block' }}
                >
                  Logic.
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, y: 12 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.6, duration: 0.5 }}
                  style={{ display: 'block', color: 'var(--brass)' }}
                >
                  Amor Fati.
                </motion.span>
              </h1>
              
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 1, duration: 0.8 }}
                style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--muted)',
                    fontSize: '15px',
                    maxWidth: '440px',
                    marginBottom: '36px',
                    lineHeight: 1.8
                }}
              >
                Backend-heavy Full-Stack Engineer and AI-first builder. I don't sugarcoat and I don't stall — I build systems that hold under load and scale with logic.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                onMouseEnter={() => playSound("solenoid")}
                onClick={handleCompile}
                style={{
                    backgroundColor: 'transparent',
                    border: '1px solid var(--brass-dim)',
                    padding: '12px 28px',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s ease'
                }}
                className="group"
              >
                <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    color: 'var(--brass)',
                    textTransform: 'uppercase'
                }}>
                  [ Compile → ]
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen Brass Wipe */}
      <AnimatePresence>
        {isCompiling && (
          <motion.div 
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 1, originX: 1, x: "100%" }}
            transition={{ duration: 0.18, ease: [0.7, 0, 0.3, 1] }}
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'var(--brass)',
                zIndex: 1000
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
