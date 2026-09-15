import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { preloader } from '@/config/motion';
import { PreloaderContext, type PreloaderValue } from './preloader-context';

/**
 * Tracks real loading work — every image on the page plus the webfonts —
 * and hands over to the rest of the site when it is done.
 *
 * Deliberately independent of GSAP. This is the one screen that covers
 * everything, so a failure anywhere in the animation layer must not be
 * able to leave the curtain stuck over the page. Whatever happens, it
 * lets go after `holdMaxMs`.
 */
export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    let released = false;
    /* Progress only ever moves forward, so a late-arriving asset cannot
       make the bar appear to go backwards. */
    let shown = 0;

    const tasks: { done: boolean }[] = [];
    const cleanups: (() => void)[] = [];

    const ratio = () => {
      if (!tasks.length) return 1;
      return tasks.filter((task) => task.done).length / tasks.length;
    };

    const paint = () => {
      shown = Math.max(shown, ratio());
      setProgress(shown);
      if (shown >= 1) release();
    };

    /* --- images --- */
    Array.from(document.images).forEach((img) => {
      if (img.complete) return;
      const task = { done: false };
      tasks.push(task);

      const settle = () => {
        task.done = true;
        paint();
      };
      img.addEventListener('load', settle, { once: true });
      img.addEventListener('error', settle, { once: true });
      cleanups.push(() => {
        img.removeEventListener('load', settle);
        img.removeEventListener('error', settle);
      });
    });

    /* --- webfonts --- */
    const fontTask = { done: false };
    tasks.push(fontTask);
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        fontTask.done = true;
        paint();
      });
    } else {
      fontTask.done = true;
    }

    /* --- creeping progress, so the bar never sits frozen --- */
    const creep = window.setInterval(() => {
      const real = ratio();
      if (shown < real) {
        paint();
        return;
      }
      if (shown < preloader.creepCeiling) {
        shown = Math.min(preloader.creepCeiling, shown + preloader.creepStep);
        paint();
      }
    }, preloader.creepIntervalMs);

    let holdTimer = 0;

    function release() {
      if (released) return;
      released = true;
      window.clearInterval(creep);
      setProgress(1);

      const wait = Math.max(0, preloader.holdMinMs - (Date.now() - startedAt));
      holdTimer = window.setTimeout(() => setIsReady(true), wait);
    }

    const failsafe = window.setTimeout(release, preloader.holdMaxMs);
    paint();

    return () => {
      window.clearInterval(creep);
      window.clearTimeout(failsafe);
      window.clearTimeout(holdTimer);
      cleanups.forEach((off) => off());
    };
  }, []);

  const value = useMemo<PreloaderValue>(() => ({ progress, isReady }), [progress, isReady]);

  return <PreloaderContext.Provider value={value}>{children}</PreloaderContext.Provider>;
}
