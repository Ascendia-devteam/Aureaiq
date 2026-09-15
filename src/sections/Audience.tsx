import { useRef } from 'react';
import { audience, sectors } from '@/content/audience';
import { staggerItem, useStaggerReveal } from '@/hooks/animations';
import { usePreloader } from '@/hooks/usePreloader';
import { Figure } from '@/components/ui/Figure';
import { SectionHead } from '@/components/ui/SectionHead';
import { Shell } from '@/components/layout/Shell';

/** Who the practice builds for — a photograph supporting a real list. */
export function Audience() {
  const listRef = useRef<HTMLDListElement>(null);
  const { isReady } = usePreloader();
  useStaggerReveal(listRef, isReady);

  return (
    <section className="band audience">
      <Shell className="audience__inner">
        <Figure image={audience.image} className="audience__figure" speed={0.94} />

        <div>
          <SectionHead heading={audience.heading} lede={audience.lede} />

          <dl className="sector-list" ref={listRef}>
            {sectors.map((sector) => (
              <div className="sector" key={sector.id} {...staggerItem}>
                <dt>{sector.term}</dt>
                <dd>{sector.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Shell>
    </section>
  );
}
