import { useEffect } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * Re-measures every trigger once the images have landed.
 *
 * Each image that arrives can shift everything below it, so the first
 * measurement is never the final word. Debounced, so five images do not
 * mean five full refreshes.
 */
export function useScrollTriggerRefresh(delayMs = 120) {
  useEffect(() => {
    let pending = 0;

    const remeasure = () => {
      window.clearTimeout(pending);
      pending = window.setTimeout(() => ScrollTrigger.refresh(), delayMs);
    };

    const pendingImages = Array.from(document.images).filter((img) => !img.complete);
    pendingImages.forEach((img) => {
      img.addEventListener('load', remeasure, { once: true });
      img.addEventListener('error', remeasure, { once: true });
    });
    window.addEventListener('load', remeasure);

    return () => {
      window.clearTimeout(pending);
      pendingImages.forEach((img) => {
        img.removeEventListener('load', remeasure);
        img.removeEventListener('error', remeasure);
      });
      window.removeEventListener('load', remeasure);
    };
  }, [delayMs]);
}
