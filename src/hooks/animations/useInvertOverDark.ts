import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

/** Sections the masthead has to invert over. */
export const DARK_SECTION_SELECTOR = '.band--ink, .colophon';

/**
 * Inverts the masthead while it overlaps an Ink section.
 *
 * The start and end are functions rather than fixed strings so they are
 * re-read on every refresh — the bar's own height changes when it
 * condenses, and a stale value leaves the inversion firing a few pixels
 * late.
 */
export function useInvertOverDark(ref: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const element = ref.current;
    if (!element) return;

    const triggers = Array.from(document.querySelectorAll(DARK_SECTION_SELECTOR)).map((section) =>
      ScrollTrigger.create({
        trigger: section,
        start: () => `top ${element.offsetHeight}px`,
        end: () => `bottom ${element.offsetHeight}px`,
        onToggle: (self) => element.classList.toggle('is-inverted', self.isActive),
      }),
    );

    return () => triggers.forEach((trigger) => trigger.kill());
  });
}
