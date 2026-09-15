import { useContext } from 'react';
import { SmoothScrollContext, type SmoothScrollValue } from '@/providers/smooth-scroll-context';

/** Access to the ScrollSmoother instance and a tier-agnostic `scrollTo`. */
export function useSmoothScroll(): SmoothScrollValue {
  return useContext(SmoothScrollContext);
}
