/**
 * Media queries the animation layer branches on.
 *
 * Read through `matchMedia` rather than window size so they stay
 * correct on hybrid devices — a touchscreen laptop matches neither a
 * phone's width nor a desktop's pointer.
 */
export const MEDIA = {
  /** A real pointer that can hover: mice and trackpads, not touch. */
  finePointer: '(hover: hover) and (pointer: fine)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  /** Reported by devices that cannot repaint smoothly, e.g. e-ink. */
  slowUpdate: '(update: slow)',
} as const;

export function matches(query: string): boolean {
  return typeof window !== 'undefined' && window.matchMedia(query).matches;
}

export const prefersReducedMotion = () => matches(MEDIA.reducedMotion);
export const hasFinePointer = () => matches(MEDIA.finePointer);
