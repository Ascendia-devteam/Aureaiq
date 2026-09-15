import { useRef } from 'react';
import { method, methodSteps } from '@/content/method';
import { staggerItem, staggerRule, useStaggerReveal } from '@/hooks/animations';
import { usePreloader } from '@/hooks/usePreloader';
import { SectionHead } from '@/components/ui/SectionHead';
import { Shell } from '@/components/layout/Shell';

/** How an engagement runs — the one place numbers earn their keep. */
export function Method() {
  const stepsRef = useRef<HTMLDivElement>(null);
  const { isReady } = usePreloader();
  useStaggerReveal(stepsRef, isReady);

  return (
    // The top padding is dropped so this reads as a continuation of the
    // practice stack above it rather than as a new subject.
    <section className="band" id="method" style={{ paddingTop: 0 }}>
      <Shell>
        <SectionHead heading={method.heading} lede={method.lede} />

        <div className="method" ref={stepsRef}>
          {methodSteps.map((step) => (
            <article className="step" key={step.id} {...staggerItem}>
              <span className="step__rule" {...staggerRule} />
              <span className="step__n">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </Shell>
    </section>
  );
}
