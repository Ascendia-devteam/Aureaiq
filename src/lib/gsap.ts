/**
 * The one place GSAP is imported and its plugins registered.
 *
 * Registering in a module means it happens exactly once, before any
 * component renders, no matter which hook imports GSAP first. Every
 * other file imports from here rather than from `gsap` directly, so
 * there is a single place to swap or drop a plugin.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

export { gsap, ScrollTrigger, ScrollSmoother, SplitText };

/**
 * Splits an element into masked lines and returns them as tween targets.
 *
 * Falls back to the element itself if SplitText cannot measure it — a
 * reveal that animates one block instead of four lines is a small loss;
 * a reveal that throws leaves the section hidden forever.
 */
export function splitLines(element: Element | null): Element[] {
  if (!element) return [];
  try {
    return SplitText.create(element, { type: 'lines', mask: 'lines' }).lines;
  } catch {
    return [element];
  }
}
