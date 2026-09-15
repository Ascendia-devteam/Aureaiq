import { useEffect, useState } from 'react';
import { preloader } from '@/config/motion';
import { usePreloader } from '@/hooks/usePreloader';
import { site } from '@/config/site';

/**
 * The opening curtain.
 *
 * Renders nothing once it is gone, so it can never intercept a click.
 * Unmounting is driven by a timer rather than by `transitionend`: that
 * event does not fire if the transition is disabled, which is exactly
 * what happens under reduced motion.
 */
export function Preloader() {
  const { progress, isReady } = usePreloader();
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    const timer = window.setTimeout(() => setIsMounted(false), preloader.exitMs);
    return () => window.clearTimeout(timer);
  }, [isReady]);

  if (!isMounted) return null;

  return (
    <div
      className={`overture${isReady ? ' is-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="overture__mark">
        {site.shortName.toUpperCase()}
        <span>·</span>
      </div>
      <div className="overture__bar">
        <span className="overture__fill" style={{ transform: `scaleX(${progress})` }} />
      </div>
      <div className="overture__pct">
        <span>{Math.round(progress * 100)}</span>%
      </div>
    </div>
  );
}
