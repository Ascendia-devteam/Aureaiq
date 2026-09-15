import { useRef } from 'react';
import { about, pillars } from '@/content/about';
import { staggerItem, staggerRule, useStaggerReveal } from '@/hooks/animations';
import { usePreloader } from '@/hooks/usePreloader';
import { EmphasisedText } from '@/components/ui/EmphasisedText';
import { Figure } from '@/components/ui/Figure';
import { SectionHead } from '@/components/ui/SectionHead';
import { Shell } from '@/components/layout/Shell';

/**
 * The practice itself, on Ink. `band--ink` is what the masthead's
 * inversion trigger looks for, so the class is load-bearing.
 */
export function About() {
  const pillarsRef = useRef<HTMLDivElement>(null);
  const { isReady } = usePreloader();
  useStaggerReveal(pillarsRef, isReady);

  return (
    <section className="band band--ink" id="about">
      <Shell>
        <div className="about">
          <div>
            <SectionHead heading={<EmphasisedText {...about.heading} />} lede={about.lede} />
          </div>
          <Figure image={about.image} className="about__figure" speed={0.92} />
        </div>

        <div className="pillars" ref={pillarsRef}>
          {pillars.map((pillar) => (
            <article className="pillar" key={pillar.id} {...staggerItem}>
              <span className="pillar__rule" {...staggerRule} />
              <h3>{pillar.title}</h3>
              <p>{pillar.description}</p>
            </article>
          ))}
        </div>
      </Shell>
    </section>
  );
}
