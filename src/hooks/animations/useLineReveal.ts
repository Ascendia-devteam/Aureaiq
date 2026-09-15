import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { gsap, splitLines } from '@/lib/gsap';
import { useMotion } from '@/hooks/useMotion';
import { buildRevealTrigger } from './revealTrigger';

/**
 * Reveals a heading line by line, each line rising out of its own mask.
 *
 * Only run this once the webfonts have settled. Split earlier and
 * SplitText measures lines against fallback-font metrics and bakes them
 * at the wrong widths — see the `isReady` gate on the section that owns
 * the element.
 */
export function useLineReveal(ref: RefObject<HTMLElement | null>, enabled = true) {
  const { tier, registerReveal, reportRevealFired } = useMotion();

  useGSAP(
    () => {
      if (tier === 'none' || !enabled || !ref.current) return;

      const element = ref.current;
      registerReveal(
        gsap.from(splitLines(element), {
          yPercent: 110,
          duration: 1,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: buildRevealTrigger(
            { trigger: element, start: 'top 82%', once: true },
            reportRevealFired,
          ),
        }),
      );
    },
    { dependencies: [tier, enabled], revertOnUpdate: true, scope: ref },
  );
}
