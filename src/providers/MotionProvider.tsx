import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { prefersLiteExperience } from '@/lib/device';
import { hasFinePointer, prefersReducedMotion } from '@/lib/media';
import { frameWatchdog, revealWatchdog } from '@/config/motion';
import { MotionContext, type MotionTier, type MotionValue } from './motion-context';

/**
 * Owns the performance tier and the safety nets around it.
 *
 * Two watchdogs run here:
 *
 * 1. Frame rate. Two consecutive seconds under the threshold means the
 *    machine cannot keep up right now — throttled, on battery, or busy
 *    elsewhere. We drop to `lite`, and every animation hook that
 *    depends on the tier tears its own work down on the re-render.
 *
 * 2. Reveals. Each reveal hides its target and waits for a
 *    ScrollTrigger. If that association ever breaks — one stray
 *    `overflow` on an ancestor is enough to do it — the wait never ends
 *    and every section below the fold stays blank. A blank page is
 *    never an acceptable outcome, so: if the visitor has scrolled a
 *    real distance and not one trigger has fired, we drop the animation
 *    and show the content.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<MotionTier>(() => {
    if (prefersReducedMotion()) return 'none';
    return prefersLiteExperience() ? 'lite' : 'full';
  });

  // Read once: a pointer does not change mid-session, and re-reading it
  // on every render would churn every hook that depends on it.
  const hasPointer = useMemo(hasFinePointer, []);

  const revealsRef = useRef<gsap.core.Animation[]>([]);
  const anyRevealFiredRef = useRef(false);

  const registerReveal = useCallback(<T extends gsap.core.Animation>(tween: T): T => {
    revealsRef.current.push(tween);
    return tween;
  }, []);

  const reportRevealFired = useCallback(() => {
    anyRevealFiredRef.current = true;
  }, []);

  /* ---------- the tier as a class on <html>, for the CSS ---------- */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('lite', tier !== 'full');
    root.classList.toggle('no-motion', tier === 'none');
  }, [tier]);

  /* ---------- frame-rate watchdog ---------- */
  useEffect(() => {
    if (tier !== 'full') return;

    let frames = 0;
    let windowStart = 0;
    let lowStreak = 0;

    const sample = () => {
      const now = performance.now();
      if (!windowStart) {
        windowStart = now;
        return;
      }

      frames += 1;
      const elapsed = now - windowStart;
      if (elapsed < frameWatchdog.sampleWindowMs) return;

      const fps = (frames * 1000) / elapsed;
      frames = 0;
      windowStart = now;
      lowStreak = fps < frameWatchdog.minFps ? lowStreak + 1 : 0;

      if (lowStreak >= frameWatchdog.lowStreakLimit) setTier('lite');
    };

    gsap.ticker.add(sample);
    return () => gsap.ticker.remove(sample);
  }, [tier]);

  /* ---------- reveal watchdog ---------- */
  useEffect(() => {
    if (tier === 'none') return;

    const showEverything = () => {
      revealsRef.current.forEach((tween) => {
        tween.scrollTrigger?.kill(false);
        tween.progress(1);
      });
      revealsRef.current = [];
      ScrollTrigger.refresh();
    };

    const poll = window.setInterval(() => {
      if (anyRevealFiredRef.current) {
        window.clearInterval(poll);
        return;
      }
      if (window.scrollY > revealWatchdog.scrollThresholdPx) {
        window.clearInterval(poll);
        showEverything();
      }
    }, revealWatchdog.pollIntervalMs);

    const giveUp = window.setTimeout(
      () => window.clearInterval(poll),
      revealWatchdog.giveUpMs,
    );

    return () => {
      window.clearInterval(poll);
      window.clearTimeout(giveUp);
    };
  }, [tier]);

  const value = useMemo<MotionValue>(
    () => ({
      tier,
      isLite: tier !== 'full',
      isReducedMotion: tier === 'none',
      hasPointer,
      registerReveal,
      reportRevealFired,
    }),
    [tier, hasPointer, registerReveal, reportRevealFired],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
