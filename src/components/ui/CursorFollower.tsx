import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { useMotion } from '@/hooks/useMotion';

/** Elements the ring grows over. */
const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select';

/**
 * A thin gold ring that trails the pointer, with a dot that keeps up
 * with it exactly. Full tier and real pointers only — it is hidden
 * outright on touch by `cursor.css`.
 *
 * Both elements are driven by `quickTo`, so a mousemove sets a value
 * instead of creating a tween. Creating one tween per event is what
 * makes a custom cursor stutter.
 */
export function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const { tier, hasPointer } = useMotion();

  useGSAP(
    () => {
      const ring = ringRef.current;
      const dot = dotRef.current;
      if (tier !== 'full' || !hasPointer || !ring || !dot) return;

      const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3' });
      const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3' });
      const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3' });
      const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3' });

      let revealed = false;
      const track = (event: MouseEvent) => {
        if (!revealed) {
          gsap.to([ring, dot], { opacity: 1, duration: 0.4 });
          revealed = true;
        }
        ringX(event.clientX);
        ringY(event.clientY);
        dotX(event.clientX);
        dotY(event.clientY);
      };

      const grow = () => gsap.to(ring, { scale: 1.9, opacity: 0.5, duration: 0.3 });
      const shrink = () => gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 });

      window.addEventListener('mousemove', track, { passive: true });
      const targets = Array.from(document.querySelectorAll(INTERACTIVE_SELECTOR));
      targets.forEach((element) => {
        element.addEventListener('mouseenter', grow, { passive: true });
        element.addEventListener('mouseleave', shrink, { passive: true });
      });

      return () => {
        window.removeEventListener('mousemove', track);
        targets.forEach((element) => {
          element.removeEventListener('mouseenter', grow);
          element.removeEventListener('mouseleave', shrink);
        });
        gsap.set([ring, dot], { opacity: 0 });
      };
    },
    { dependencies: [tier, hasPointer], revertOnUpdate: true },
  );

  if (tier !== 'full' || !hasPointer) return null;

  return (
    <>
      <div className="cursor" ref={ringRef} aria-hidden="true" />
      <div className="cursor cursor--dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
