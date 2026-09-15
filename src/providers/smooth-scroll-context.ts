import { createContext } from 'react';
import type { ScrollSmoother } from '@/lib/gsap';

export interface SmoothScrollValue {
  /** Null on the lite and reduced tiers, where native scrolling is used. */
  smoother: ScrollSmoother | null;
  /** Scrolls to an element, or to the top when given null. */
  scrollTo: (target: Element | null) => void;
}

export const SmoothScrollContext = createContext<SmoothScrollValue>({
  smoother: null,
  scrollTo: () => {},
});
