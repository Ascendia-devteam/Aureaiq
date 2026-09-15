import { useGSAP } from '@gsap/react';
import { useState } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

/**
 * Reports which section hash is currently under the middle of the
 * viewport, so the nav can mark it.
 *
 * Returned as state rather than written to the DOM directly: the nav
 * links are React's to render, and a class toggled behind its back is
 * the kind of thing that silently disappears on the next re-render.
 */
export function useActiveSection(hashes: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);

  useGSAP(
    () => {
      const triggers = hashes
        .map((hash) => {
          const section = document.querySelector(hash);
          if (!section) return null;

          return ScrollTrigger.create({
            trigger: section,
            start: 'top 45%',
            end: 'bottom 45%',
            onToggle: (self) => setActive((current) => (self.isActive ? hash : current === hash ? null : current)),
          });
        })
        .filter((trigger): trigger is ScrollTrigger => trigger !== null);

      return () => triggers.forEach((trigger) => trigger.kill());
    },
    { dependencies: [hashes], revertOnUpdate: true },
  );

  return active;
}
