import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { useMotion } from '@/hooks/useMotion';

/**
 * The nav-link roll: the visible label slides up and out while an
 * identical copy slides in behind it.
 *
 * Bound to focus as well as hover, so the effect is not invisible to
 * anyone navigating by keyboard.
 */
export function useRollHover(ref: RefObject<HTMLElement | null>) {
  const { tier } = useMotion();

  useGSAP(
    () => {
      const element = ref.current;
      if (tier === 'none' || !element) return;

      const top = element.querySelector('.roll__a');
      const under = element.querySelector('.roll__b');
      if (!top || !under) return;

      gsap.set(under, { yPercent: 100 });

      const timeline = gsap
        .timeline({ paused: true })
        .to(top, { yPercent: -100, duration: 0.45, ease: 'power3.inOut' }, 0)
        .to(under, { yPercent: 0, duration: 0.45, ease: 'power3.inOut' }, 0);

      const play = () => timeline.play();
      const reverse = () => timeline.reverse();

      element.addEventListener('mouseenter', play);
      element.addEventListener('mouseleave', reverse);
      element.addEventListener('focus', play);
      element.addEventListener('blur', reverse);

      return () => {
        element.removeEventListener('mouseenter', play);
        element.removeEventListener('mouseleave', reverse);
        element.removeEventListener('focus', play);
        element.removeEventListener('blur', reverse);
      };
    },
    { dependencies: [tier], revertOnUpdate: true, scope: ref },
  );
}
