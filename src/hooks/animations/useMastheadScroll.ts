import { useGSAP } from '@gsap/react';
import { useRef, type RefObject } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { masthead as thresholds } from '@/config/motion';
import { useMotion } from '@/hooks/useMotion';

/**
 * Condenses the masthead once the page has moved, and slides it out of
 * the way while the visitor is scrolling down — it comes straight back
 * on the first upward gesture.
 *
 * The bar stays put while the overlay menu is open; hiding the control
 * that closes the menu would strand anyone using it. That state is read
 * through a ref rather than taken as a dependency, so opening the menu
 * does not tear down and rebuild a scroll trigger.
 */
export function useMastheadScroll(ref: RefObject<HTMLElement | null>, isMenuOpen: boolean) {
  const { tier } = useMotion();
  const isMenuOpenRef = useRef(isMenuOpen);
  isMenuOpenRef.current = isMenuOpen;

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      // On the reduced tier the bar still condenses, but it never moves.
      const moveTo =
        tier === 'none' ? null : gsap.quickTo(element, 'y', { duration: 0.5, ease: 'power3' });

      let height = element.offsetHeight;

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onRefresh: () => {
          height = element.offsetHeight;
        },
        onUpdate: (self) => {
          const y = self.scroll();
          element.classList.toggle('is-condensed', y > thresholds.condenseAtPx);

          if (!moveTo) return;
          if (isMenuOpenRef.current || y < thresholds.hideBelowPx) {
            moveTo(0);
            return;
          }
          moveTo(self.direction === 1 ? -height - 4 : 0);
        },
      });
    },
    { dependencies: [tier], revertOnUpdate: true },
  );
}
