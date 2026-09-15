import { useGSAP } from '@gsap/react';
import { useRef, type RefObject } from 'react';
import { gsap, splitLines } from '@/lib/gsap';
import { useMotion } from '@/hooks/useMotion';
import { usePreloader } from '@/hooks/usePreloader';

/**
 * The page's opening choreography: the bar arrives, the headline rises
 * line by line, the dawn spiral draws itself, and the supporting copy
 * follows it in.
 *
 * The curtain belongs to the preloader, not to this timeline — that is
 * the whole point of the split. This only animates the page.
 *
 * It runs in two passes, keyed on `isReady`:
 *   1. on mount — hide everything the timeline will animate, so nothing
 *      can flash in at its final position behind the curtain;
 *   2. on hand-off — play.
 *
 * The headline is split once, in pass 1, and the lines are kept in a
 * ref. Splitting again in pass 2 would split the line boxes produced by
 * the first pass, nesting them one level deeper each time.
 */
export function useOpeningSequence(heroRef: RefObject<HTMLElement | null>) {
  const { tier } = useMotion();
  const { isReady } = usePreloader();
  const headlineLinesRef = useRef<Element[]>([]);

  useGSAP(
    () => {
      const hero = heroRef.current;
      if (tier === 'none' || !hero) return;

      const arc = hero.querySelector<SVGPathElement>('#dawnArc');
      // Resolved against the document, not the hero: the masthead is a
      // fixed element outside this subtree, and passing a ref across two
      // unrelated components to choreograph one timeline costs more than
      // it explains.
      const bar = document.querySelectorAll('#masthead .masthead__inner > *');

      if (!headlineLinesRef.current.length) {
        headlineLinesRef.current = splitLines(hero.querySelector('[data-hero="headline"]'));
      }
      const headlineLines = headlineLinesRef.current;

      /* Runs when the context is reverted, which undoes the split along
         with everything else. Holding on to the old line boxes would
         leave pass 2 animating elements no longer in the document. */
      const forgetSplit = () => {
        headlineLinesRef.current = [];
      };

      /* ---------- pass 1: hide, while the curtain is still up ---------- */
      if (!isReady) {
        if (arc) {
          const length = arc.getTotalLength();
          gsap.set(arc, { strokeDasharray: length, strokeDashoffset: length });
        }
        gsap.set('.dawn__glow, .dawn__cells, .dawn__grid, .dawn__eyewrap', { opacity: 0 });
        gsap.set('[data-hero="lede"], [data-hero="actions"]', { y: 22, opacity: 0 });
        gsap.set('[data-hero="kicker"]', { opacity: 0 });
        gsap.set(headlineLines, { yPercent: 115 });
        gsap.set(bar, { y: -14, opacity: 0 });
        return forgetSplit;
      }

      /* ---------- pass 2: play ---------- */
      const timeline = gsap.timeline();
      timeline
        .to(bar, { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power3.out' })
        .to('[data-hero="kicker"]', { opacity: 1, duration: 0.5 }, '-=.55')
        .to(headlineLines, { yPercent: 0, duration: 1, stagger: 0.08, ease: 'expo.out' }, '-=.45');

      if (arc) {
        timeline
          .to(arc, { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }, '-=.9')
          .to(
            ['.dawn__glow', '.dawn__cells'],
            { opacity: 1, duration: 1.4, ease: 'power2.out' },
            '-=1.4',
          )
          .to('.dawn__grid', { opacity: 0.34, duration: 1.1, ease: 'power2.out' }, '-=1.1')
          .to('.dawn__eyewrap', { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=.3');
      }

      timeline.to(
        ['[data-hero="lede"]', '[data-hero="actions"]'],
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.09, ease: 'power3.out' },
        arc ? '-=1.3' : '-=.3',
      );

      return forgetSplit;
    },
    // No `revertOnUpdate` here, deliberately: pass 1's hidden states have
    // to survive into pass 2, which animates out of them.
    { dependencies: [tier, isReady], scope: heroRef },
  );
}
