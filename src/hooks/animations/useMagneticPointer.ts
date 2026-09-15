import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { magnetic } from '@/config/motion';
import { useMotion } from '@/hooks/useMotion';

/**
 * Pulls an element gently toward the cursor while it is over it.
 *
 * The bounding rect is read once on enter. Reading
 * `getBoundingClientRect` on every mousemove forces a synchronous
 * layout on each event, which is what makes magnetic buttons feel heavy
 * on a slow machine.
 */
export function useMagneticPointer(ref: RefObject<HTMLElement | null>) {
  const { tier, hasPointer } = useMotion();

  useGSAP(
    () => {
      const element = ref.current;
      if (tier !== 'full' || !hasPointer || !element) return;

      const xTo = gsap.quickTo(element, 'x', { duration: magnetic.durationSec, ease: 'power3' });
      const yTo = gsap.quickTo(element, 'y', { duration: magnetic.durationSec, ease: 'power3' });
      let rect: DOMRect | null = null;

      const enter = () => {
        rect = element.getBoundingClientRect();
      };
      const move = (event: MouseEvent) => {
        if (!rect) return;
        xTo((event.clientX - rect.left - rect.width / 2) * magnetic.x);
        yTo((event.clientY - rect.top - rect.height / 2) * magnetic.y);
      };
      const leave = () => {
        rect = null;
        xTo(0);
        yTo(0);
      };

      element.addEventListener('mouseenter', enter, { passive: true });
      element.addEventListener('mousemove', move, { passive: true });
      element.addEventListener('mouseleave', leave, { passive: true });

      return () => {
        element.removeEventListener('mouseenter', enter);
        element.removeEventListener('mousemove', move);
        element.removeEventListener('mouseleave', leave);
        gsap.set(element, { x: 0, y: 0 });
      };
    },
    { dependencies: [tier, hasPointer], revertOnUpdate: true, scope: ref },
  );
}
