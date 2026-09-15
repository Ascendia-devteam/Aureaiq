import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { gsap, splitLines } from '@/lib/gsap';
import { useMotion } from '@/hooks/useMotion';
import { buildRevealTrigger } from './revealTrigger';

/**
 * The quote band: the Dawn Field draws itself in behind the pull-quote,
 * and on the full tier the quote itself lifts out of grey line by line
 * as the visitor scrolls past it.
 *
 * On the lite tier the scrubbed version is replaced by a single fade.
 * Scrubbing re-renders text on every scroll frame, which is exactly the
 * work a throttled machine cannot spare.
 */
export function useQuoteReveal(
  bandRef: RefObject<HTMLElement | null>,
  quoteRef: RefObject<HTMLElement | null>,
  enabled = true,
) {
  const { tier, registerReveal, reportRevealFired } = useMotion();

  useGSAP(
    () => {
      const band = bandRef.current;
      const quote = quoteRef.current;
      if (tier === 'none' || !enabled || !band || !quote) return;

      /* ---------- the arcs draw themselves ---------- */
      const paths = gsap.utils.toArray<SVGPathElement>('.dawn-field path', band);
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      });

      registerReveal(
        gsap.to(paths, {
          strokeDashoffset: 0,
          duration: 2,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: buildRevealTrigger(
            { trigger: band, start: 'top 75%', once: true },
            reportRevealFired,
          ),
        }),
      );

      if (tier !== 'full') {
        registerReveal(
          gsap.from(quote, {
            opacity: 0,
            y: 18,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: buildRevealTrigger(
              { trigger: band, start: 'top 78%', once: true },
              reportRevealFired,
            ),
          }),
        );
        return;
      }

      /* ---------- full tier: parallax field, scrubbed quote ---------- */
      gsap.to('.dawn-field', {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: buildRevealTrigger(
          { trigger: band, start: 'top bottom', end: 'bottom top', scrub: true },
          reportRevealFired,
        ),
      });

      registerReveal(
        gsap.from(splitLines(quote), {
          opacity: 0.15,
          duration: 0.6,
          stagger: 0.3,
          ease: 'none',
          scrollTrigger: buildRevealTrigger(
            { trigger: quote, start: 'top 82%', end: 'bottom 58%', scrub: 0.6 },
            reportRevealFired,
          ),
        }),
      );
    },
    { dependencies: [tier, enabled], revertOnUpdate: true, scope: bandRef },
  );
}
