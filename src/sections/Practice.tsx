import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { disciplines, practice } from '@/content/practice';
import { staggerItem, useStaggerReveal } from '@/hooks/animations';
import { useMotion } from '@/hooks/useMotion';
import { usePreloader } from '@/hooks/usePreloader';
import { EmphasisedText } from '@/components/ui/EmphasisedText';
import { Figure } from '@/components/ui/Figure';
import { SectionHead } from '@/components/ui/SectionHead';
import { Shell } from '@/components/layout/Shell';
import type { Discipline as DisciplineData } from '@/types/content';

/** Matches the `grid-template-rows` transition in `practice.css`. */
const PANEL_TRANSITION_MS = 560;

interface DisciplineProps {
  discipline: DisciplineData;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * One service in the stack.
 *
 * The panel's height is animated in CSS by going from `0fr` to `1fr` on
 * a grid row, so nothing has to measure it in JavaScript. GSAP only
 * animates the contents in, and only when opening.
 */
function Discipline({ discipline, isOpen, onToggle }: DisciplineProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { tier } = useMotion();
  const panelId = `discipline-${discipline.id}`;

  useGSAP(
    () => {
      if (!isOpen || tier === 'none' || !panelRef.current) return;

      gsap.fromTo(
        panelRef.current.querySelectorAll('li, p, .fig'),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.045, ease: 'power2.out', delay: 0.12 },
      );
    },
    { dependencies: [isOpen, tier], scope: panelRef },
  );

  /* Opening pushes everything below it down, so every trigger further
     down the page is measuring a stale position until this settles. */
  useEffect(() => {
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), PANEL_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  return (
    <div className="discipline" {...staggerItem}>
      <button className="discipline__head" onClick={onToggle} aria-expanded={isOpen} aria-controls={panelId}>
        <span className="discipline__name">
          {discipline.name}
          <span className="discipline__claim">{discipline.claim}</span>
        </span>
        <span className="discipline__sign" aria-hidden="true" />
      </button>

      <div className="discipline__panel" id={panelId} data-open={isOpen} ref={panelRef}>
        <div>
          <div className="discipline__body">
            <p>{discipline.summary}</p>
            <ul>
              {discipline.deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Figure image={discipline.image} className="discipline__figure" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The three disciplines, held in one stack and deliberately unnumbered:
 * the brand sells them as one thing.
 *
 * One panel at a time. Opening a second while the first is still open
 * would push the page around under the reader twice over.
 */
export function Practice() {
  const stackRef = useRef<HTMLDivElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const { isReady } = usePreloader();
  useStaggerReveal(stackRef, isReady);

  return (
    <section className="band" id="practice">
      <Shell>
        <SectionHead heading={<EmphasisedText {...practice.heading} />} lede={practice.lede} />

        <div className="practice" ref={stackRef}>
          {disciplines.map((discipline) => (
            <Discipline
              key={discipline.id}
              discipline={discipline}
              isOpen={openId === discipline.id}
              onToggle={() => setOpenId((current) => (current === discipline.id ? null : discipline.id))}
            />
          ))}
        </div>
      </Shell>
    </section>
  );
}
