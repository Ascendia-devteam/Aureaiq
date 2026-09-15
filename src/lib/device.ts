import { MEDIA, matches } from './media';

/**
 * Parts of the platform API that are widely shipped but not in the DOM
 * typings, or not on every browser. Declared narrowly rather than
 * reaching for `any` at each call site.
 */
interface NetworkInformation {
  saveData?: boolean;
}

interface DeviceNavigator extends Navigator {
  connection?: NetworkInformation;
  deviceMemory?: number;
}

/**
 * Whether this device should start on the lite tier.
 *
 * Static capability flags catch weak hardware, but they do not catch a
 * good laptop that is throttled on battery or heat — which looks
 * identical to a fast one in `navigator.*`. So these flags only set the
 * starting tier; the frame-rate watchdog in usePerformanceTier can drop
 * us to lite at any point afterwards.
 */
export function prefersLiteExperience(): boolean {
  if (typeof navigator === 'undefined') return true;

  const nav = navigator as DeviceNavigator;
  const cores = nav.hardwareConcurrency ?? 0;
  const memory = nav.deviceMemory ?? 0;

  return (
    matches(MEDIA.reducedMotion) ||
    (cores > 0 && cores <= 4) ||
    (memory > 0 && memory <= 4) ||
    nav.connection?.saveData === true ||
    matches(MEDIA.slowUpdate) ||
    !matches(MEDIA.finePointer)
  );
}
