import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollSmoother } from '@/lib/gsap';
import { smoothScroll } from '@/config/motion';
import { useMotion } from '@/hooks/useMotion';
import { SmoothScrollContext, type SmoothScrollValue } from './smooth-scroll-context';

/**
 * Wraps the page in ScrollSmoother's required two-element scaffold and
 * exposes a `scrollTo` that works on every tier.
 *
 * The smoother is only created on the full tier. If the frame-rate
 * watchdog later drops us to lite, `useGSAP`'s cleanup kills it and the
 * page falls back to native scrolling without a reload — the content
 * wrapper is inert markup once the smoother is gone.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const { tier } = useMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  /* State, not a ref: consumers need to re-render when the smoother
     appears or is killed, because `scrollTo` behaves differently. */
  const [smoother, setSmoother] = useState<ScrollSmoother | null>(null);

  useGSAP(
    () => {
      if (tier !== 'full') return;

      const instance = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        ...smoothScroll,
      });
      setSmoother(instance);

      return () => {
        // Hand the native scroller back the position the smoother was at,
        // so a downgrade mid-page does not jump the visitor to the top.
        const position = instance.scrollTop();
        instance.kill();
        setSmoother(null);
        window.scrollTo(0, position);
      };
    },
    { dependencies: [tier], revertOnUpdate: true, scope: wrapperRef },
  );

  const scrollTo = useCallback(
    (target: Element | null) => {
      const headerHeight = document.getElementById('masthead')?.offsetHeight ?? 0;

      if (smoother) {
        if (target) smoother.scrollTo(target, true, `top ${headerHeight}px`);
        else smoother.scrollTo(0, true);
        return;
      }

      const top = target ? target.getBoundingClientRect().top + window.scrollY - headerHeight : 0;
      window.scrollTo({ top, behavior: 'smooth' });
    },
    [smoother],
  );

  const value = useMemo<SmoothScrollValue>(() => ({ smoother, scrollTo }), [smoother, scrollTo]);

  return (
    <SmoothScrollContext.Provider value={value}>
      <div id="smooth-wrapper" ref={wrapperRef}>
        <div id="smooth-content">{children}</div>
      </div>
    </SmoothScrollContext.Provider>
  );
}
