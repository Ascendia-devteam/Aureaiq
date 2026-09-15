import { useGSAP } from '@gsap/react';
import { useRef, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { useMotion } from '@/hooks/useMotion';
import { buildRevealTrigger } from './revealTrigger';

/** The image sits slightly over-scaled so the hover has somewhere to go. */
const RESTING_SCALE = 1.08;

/**
 * Wipes a figure open and settles its image out of an over-scale, then —
 * on the full tier only — lets the image relax to 1:1 on hover.
 *
 * The two are separate effects on purpose. The reveal should happen once
 * and stay done; the hover has to be torn down and rebuilt whenever the
 * tier changes, and reverting the reveal along with it would wipe the
 * figure open a second time in front of the reader.
 */
export function useFigureReveal(ref: RefObject<HTMLElement | null>) {
  const { tier, hasPointer, registerReveal, reportRevealFired } = useMotion();

  // The reveal runs once, so it reads the tier through a ref rather than
  // taking it as a dependency.
  const tierRef = useRef(tier);
  tierRef.current = tier;

  useGSAP(
    () => {
      const figure = ref.current;
      const image = figure?.querySelector('img');
      if (tierRef.current === 'none' || !figure || !image) return;

      gsap.set(image, { scale: RESTING_SCALE });

      registerReveal(
        gsap
          .timeline({
            scrollTrigger: buildRevealTrigger(
              { trigger: figure, start: 'top 90%', once: true },
              reportRevealFired,
            ),
          })
          .from(figure, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.2, ease: 'expo.out' }, 0)
          .fromTo(image, { scale: 1.3 }, { scale: RESTING_SCALE, duration: 1.6, ease: 'expo.out' }, 0),
      );
    },
    { scope: ref },
  );

  useGSAP(
    () => {
      const figure = ref.current;
      const image = figure?.querySelector('img');
      if (tier !== 'full' || !hasPointer || !figure || !image) return;

      const enter = () => gsap.to(image, { scale: 1, duration: 0.9, ease: 'power3.out' });
      const leave = () =>
        gsap.to(image, { scale: RESTING_SCALE, duration: 0.9, ease: 'power3.out' });

      figure.addEventListener('mouseenter', enter);
      figure.addEventListener('mouseleave', leave);

      return () => {
        figure.removeEventListener('mouseenter', enter);
        figure.removeEventListener('mouseleave', leave);
        gsap.set(image, { scale: RESTING_SCALE });
      };
    },
    { dependencies: [tier, hasPointer], revertOnUpdate: true, scope: ref },
  );
}
