/** Config accepted by every reveal in this folder. */
export interface RevealTriggerOptions {
  trigger: Element | string;
  /** ScrollTrigger start string, e.g. `'top 82%'`. */
  start: string;
  end?: string;
  /** `true` plays once; a number scrubs with that much smoothing. */
  scrub?: boolean | number;
  once?: boolean;
}

/**
 * Builds a ScrollTrigger config that reports back the first time it
 * fires, so MotionProvider's reveal watchdog can tell the difference
 * between "nothing has scrolled into view yet" and "triggers are not
 * working at all".
 */
export function buildRevealTrigger(
  options: RevealTriggerOptions,
  onFired: () => void,
): ScrollTrigger.Vars {
  return { ...options, onEnter: onFired };
}
