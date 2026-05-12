"use client";

import React, { useEffect, useRef } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Fixed left-edge aperture ring.
 * 36px SVG — scroll drives clockwise rotation via CSS custom property.
 * aria-hidden: purely ambient, no interactive targets.
 * On mobile (< 1024px) hidden; replaced by ExposureMeter bottom bar.
 */
export const ApertureRing: React.FC = () => {
  useScrollProgress();
  const reduced = useReducedMotion();
  const ringRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (reduced) return;
    const ring = ringRef.current;
    if (!ring) return;

    function updateRotation() {
      const deg = getComputedStyle(document.documentElement)
        .getPropertyValue('--scroll-deg')
        .trim() || '0deg';
      ring!.style.transform = `rotate(${deg})`;
      requestAnimationFrame(updateRotation);
    }
    const raf = requestAnimationFrame(updateRotation);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '36px',
        height: '36px',
        zIndex: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className="hidden lg:flex"
    >
      <svg
        ref={ringRef}
        viewBox="0 0 36 36"
        fill="none"
        width="36"
        height="36"
        style={{ overflow: 'visible', transition: reduced ? 'none' : undefined }}
      >
        {/* Outer ring */}
        <circle cx="18" cy="18" r="16" stroke="var(--brass-dim)" strokeWidth="1.5" />
        {/* Aperture blades — 8 cross lines */}
        <line x1="18" y1="2"  x2="18" y2="10" stroke="var(--brass)" strokeWidth="0.8" opacity="0.7" />
        <line x1="18" y1="26" x2="18" y2="34" stroke="var(--brass)" strokeWidth="0.8" opacity="0.7" />
        <line x1="2"  y1="18" x2="10" y2="18" stroke="var(--brass)" strokeWidth="0.8" opacity="0.7" />
        <line x1="26" y1="18" x2="34" y2="18" stroke="var(--brass)" strokeWidth="0.8" opacity="0.7" />
        {/* Diagonal blades */}
        <line x1="7"  y1="7"  x2="12" y2="12" stroke="var(--brass)" strokeWidth="0.6" opacity="0.4" />
        <line x1="24" y1="24" x2="29" y2="29" stroke="var(--brass)" strokeWidth="0.6" opacity="0.4" />
        <line x1="29" y1="7"  x2="24" y2="12" stroke="var(--brass)" strokeWidth="0.6" opacity="0.4" />
        <line x1="7"  y1="29" x2="12" y2="24" stroke="var(--brass)" strokeWidth="0.6" opacity="0.4" />
        {/* Center dot */}
        <circle cx="18" cy="18" r="2" fill="var(--brass-dim)" />
      </svg>
    </div>
  );
};
