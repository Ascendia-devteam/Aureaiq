import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { useMotion } from '@/hooks/useMotion';
import { buildRevealTrigger } from './revealTrigger';

/** Lifts a single element into place. The quietest reveal in the set. */
export function useFadeReveal(ref: RefObject<HTMLElement | null>, enabled = true) {
  const { tier, registerReveal, reportRevealFired } = useMotion();

  useGSAP(
    () => {
      if (tier === 'none' || !enabled || !ref.current) return;

      const element = ref.current;
      registerReveal(
        gsap.from(element, {
          y: 20,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: buildRevealTrigger(
            { trigger: element, start: 'top 88%', once: true },
            reportRevealFired,
          ),
        }),
      );
    },
    { dependencies: [tier, enabled], revertOnUpdate: true, scope: ref },
  );
}
