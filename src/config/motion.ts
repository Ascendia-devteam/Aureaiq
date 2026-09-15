/**
 * Every timing, threshold and easing the animation layer depends on.
 *
 * Pulled out of the hooks so the feel of the site can be tuned without
 * reading any animation code, and so two hooks can never drift apart on
 * a shared value.
 */

/** Preloader. */
export const preloader = {
  /** Minimum time on screen, so a cached reload does not just flash. */
  holdMinMs: 700,
  /** Nothing may hold the page longer than this. */
  holdMaxMs: 7000,
  /** Matches the CSS transition on `.overture.is-out`, plus a margin. */
  exitMs: 950,
  /** How often the bar creeps forward while waiting on real assets. */
  creepIntervalMs: 120,
  /** The bar never creeps past this on its own. */
  creepCeiling: 0.9,
  creepStep: 0.012,
} as const;

/** Frame-rate watchdog that drops the page to lite mode. */
export const frameWatchdog = {
  /** Below this, for `lowStreakLimit` consecutive seconds, we downgrade. */
  minFps: 45,
  lowStreakLimit: 2,
  sampleWindowMs: 1000,
} as const;

/** Safety net for reveals whose ScrollTrigger never fires. */
export const revealWatchdog = {
  pollIntervalMs: 350,
  /** Scroll distance past which a silent trigger is treated as broken. */
  scrollThresholdPx: 400,
  /** Stop watching after this long; by then the page is what it is. */
  giveUpMs: 40_000,
} as const;

/** ScrollSmoother. Only created on the full performance tier. */
export const smoothScroll = {
  smooth: 0.7,
  effects: true,
  normalizeScroll: false,
  ignoreMobileResize: true,
} as const;

/** Scroll positions at which the masthead changes behaviour. */
export const masthead = {
  condenseAtPx: 80,
  /** Below this the bar never hides, so the hero keeps its frame. */
  hideBelowPx: 260,
} as const;

/** Strength of the magnetic pull on buttons, as a fraction of offset. */
export const magnetic = {
  x: 0.28,
  y: 0.38,
  durationSec: 0.5,
} as const;

/** Latest possible hand-off, if the preloader never calls back. */
export const bootFallbackMs = 9000;
