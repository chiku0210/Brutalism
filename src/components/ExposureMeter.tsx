"use client";

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Exposure meter — scroll depth indicator.
 *
 * Desktop: 2px-wide vertical brass bar, fixed adjacent to aperture ring.
 * Mobile: 4px × 32px horizontal bar fixed to bottom-center.
 *
 * Height (desktop) / width (mobile) scales 0→100% with scroll progress.
 * At section boundaries the bar briefly flashes to full opacity.
 */
export const ExposureMeter: React.FC = () => {
  const reduced = useReducedMotion();
  const barRef = useRef<HTMLDivElement>(null);
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduced) return;
    const bar = barRef.current;
    if (!bar) return;

    let lastSection = -1;

    function getSection() {
      const sections = document.querySelectorAll('section[id]');
      const mid = window.innerHeight / 2;
      let current = -1;
      sections.forEach((s, i) => {
        const rect = s.getBoundingClientRect();
        if (rect.top <= mid) current = i;
      });
      return current;
    }

    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

      const isMobile = window.innerWidth < 1024;
      if (isMobile) {
        bar!.style.width = `${progress * 100}%`;
        bar!.style.height = '4px';
      } else {
        bar!.style.height = `${progress * 100}%`;
        bar!.style.width = '2px';
      }

      const section = getSection();
      if (section !== lastSection) {
        lastSection = section;
        bar!.style.opacity = '1';
        if (flashTimeout.current) clearTimeout(flashTimeout.current);
        flashTimeout.current = setTimeout(() => {
          if (bar) bar.style.opacity = '0.4';
        }, 100);
      }
    }

    const onScroll = () => requestAnimationFrame(update);
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (flashTimeout.current) clearTimeout(flashTimeout.current);
    };
  }, [reduced]);

  return (
    <>
      {/* Desktop: vertical bar next to aperture ring */}
      <div
        aria-hidden="true"
        className="hidden lg:block"
        style={{
          position: 'fixed',
          left: '68px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '2px',
          height: '120px',
          backgroundColor: 'var(--border)',
          zIndex: 90,
        }}
      >
        <div
          ref={barRef}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '0%',
            backgroundColor: 'var(--brass)',
            opacity: reduced ? 1 : 0.4,
            transition: reduced ? 'none' : 'opacity 0.1s ease',
            transformOrigin: 'bottom',
          }}
        />
      </div>

      {/* Mobile: horizontal bottom bar */}
      <div
        aria-hidden="true"
        className="lg:hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '4px',
          backgroundColor: 'var(--border)',
          zIndex: 90,
          overflow: 'hidden',
        }}
      >
        <div
          ref={barRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '0%',
            backgroundColor: 'var(--brass)',
            opacity: reduced ? 1 : 0.4,
            transition: reduced ? 'none' : 'opacity 0.1s ease',
          }}
        />
      </div>
    </>
  );
};
