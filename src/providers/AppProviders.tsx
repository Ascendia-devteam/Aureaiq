import type { ReactNode } from 'react';
import { MotionProvider } from './MotionProvider';
import { PreloaderProvider } from './PreloaderProvider';

/**
 * Composes the providers the whole app depends on, in dependency order:
 * motion first, because the preloader's consumers and the scroll layer
 * both branch on the tier.
 *
 * SmoothScrollProvider is not here — it renders DOM, so it belongs in
 * the layout next to the markup it wraps.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <MotionProvider>
      <PreloaderProvider>{children}</PreloaderProvider>
    </MotionProvider>
  );
}
