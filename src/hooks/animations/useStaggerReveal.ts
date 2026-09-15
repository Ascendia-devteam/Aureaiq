import { useGSAP } from '@gsap/react';
import type { RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { useMotion } from '@/hooks/useMotion';
import { buildRevealTrigger } from './revealTrigger';

const ITEM_ATTR = 'data-stagger-item';
const RULE_ATTR = 'data-stagger-rule';

/** Spread onto a child that should be part of the stagger. */
export const staggerItem = { [ITEM_ATTR]: '' } as const;
/** Spread onto the hairline inside an item, drawn open alongside it. */
export const staggerRule = { [RULE_ATTR]: '' } as const;

/**
 * Reveals a group of sibling cards as one sequence, keyed off the first
 * item rather than off each card — a row of four should arrive as a row,
 * not as four independent events.
 */
export function useStaggerReveal(ref: RefObject<HTMLElement | null>, enabled = true) {
  const { tier, registerReveal, reportRevealFired } = useMotion();

  useGSAP(
    () => {
      if (tier === 'none' || !enabled || !ref.current) return;

      const items = gsap.utils.toArray<HTMLElement>(`[${ITEM_ATTR}]`, ref.current);
      if (!items.length) return;

      const rules = gsap.utils.toArray<HTMLElement>(`[${RULE_ATTR}]`, ref.current);

      const timeline = gsap.timeline({
        scrollTrigger: buildRevealTrigger(
          { trigger: items[0], start: 'top 85%', once: true },
          reportRevealFired,
        ),
      });

      timeline.from(items, {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.09,
        ease: 'power3.out',
      });

      if (rules.length) {
        timeline.from(rules, { scaleX: 0, duration: 1, stagger: 0.09, ease: 'power3.inOut' }, 0);
      }

      registerReveal(timeline);
    },
    { dependencies: [tier, enabled], revertOnUpdate: true, scope: ref },
  );
}
