import { useEffect, useRef } from 'react';

/**
 * Throttled scroll progress hook.
 * Writes --scroll-progress (0..1) and --scroll-deg (0..360) as CSS custom
 * properties on the documentElement so the aperture ring and exposure meter
 * can be driven purely from CSS without React re-renders.
 */
export function useScrollProgress() {
  const rafRef = useRef<number | null>(null);
  const lastTick = useRef<number>(0);
  const MIN_INTERVAL = 16; // ~60fps throttle

  useEffect(() => {
    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;

      document.documentElement.style.setProperty('--scroll-progress', String(progress));
      document.documentElement.style.setProperty('--scroll-deg', `${progress * 360}deg`);
    }

    function onScroll() {
      const now = Date.now();
      if (now - lastTick.current < MIN_INTERVAL) return;
      lastTick.current = now;

      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    update(); // initial paint
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);
}
