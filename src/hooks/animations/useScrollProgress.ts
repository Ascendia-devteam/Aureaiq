import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { useMotion } from '@/hooks/useMotion';

/** Scrubs a hairline from 0 to full width across the length of the page. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const { tier } = useMotion();

  useGSAP(
    () => {
      const element = ref.current;
      if (tier === 'none' || !element) return;

      gsap.to(element, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
      });
    },
    { dependencies: [tier], revertOnUpdate: true },
  );
}
