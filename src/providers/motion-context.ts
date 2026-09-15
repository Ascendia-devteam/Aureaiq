import { createContext } from 'react';

// `gsap` and `ScrollTrigger` are ambient type namespaces declared by the
// gsap package, so they are referenced here without an import.

/**
 * How much animation this visit gets.
 *
 * - `full` — everything: smooth scroll, scrubbed parallax, magnetic
 *   buttons, the custom cursor.
 * - `lite` — reveals and layout only. Entered when the device reports
 *   low capability, or when the frame rate actually drops.
 * - `none` — the visitor asked for reduced motion. Content is shown
 *   immediately; nothing is hidden waiting for a trigger.
 *
 * The tier only ever moves downward, so the page never oscillates
 * between two behaviours while someone is reading it.
 */
export type MotionTier = 'full' | 'lite' | 'none';

export interface MotionValue {
  tier: MotionTier;
  /** True for `lite` and `none` — the common "skip the heavy work" test. */
  isLite: boolean;
  /** True only for `none`. */
  isReducedMotion: boolean;
  /** True when a real pointer can hover, so pointer effects are worth wiring. */
  hasPointer: boolean;
  /**
   * Registers a reveal so the watchdog can force it visible if its
   * ScrollTrigger never fires. Returns the tween for chaining.
   */
  registerReveal: <T extends gsap.core.Animation>(tween: T) => T;
  /** Called by the first reveal that actually fires. Stops the watchdog. */
  reportRevealFired: () => void;
}

export const MotionContext = createContext<MotionValue | null>(null);
