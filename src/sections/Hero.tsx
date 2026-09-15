import { useRef } from 'react';
import { hero } from '@/content/hero';
import { useOpeningSequence } from '@/hooks/animations';
import { DawnMark } from '@/components/brand/DawnMark';
import { CtaLink } from '@/components/ui/Cta';
import { EmphasisedText } from '@/components/ui/EmphasisedText';
import { Shell } from '@/components/layout/Shell';

/**
 * The opening screen.
 *
 * The `data-hero` attributes are the opening timeline's handles. They
 * are attributes rather than refs because the sequence choreographs
 * five elements plus the masthead, and five more refs threaded through
 * one hook would obscure more than they document.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useOpeningSequence(ref);

  return (
    <section className="hero" ref={ref}>
      <Shell className="hero__inner">
        <div className="hero__copy">
          <p className="hero__kicker" data-hero="kicker">
            {hero.kicker}
          </p>
          <h1 data-hero="headline">
            <EmphasisedText {...hero.headline} />
          </h1>
          <p className="lede" data-hero="lede">
            {hero.lede}
          </p>
          <div className="hero__actions" data-hero="actions">
            <CtaLink href={hero.actions.primary.href}>{hero.actions.primary.label}</CtaLink>
            <CtaLink href={hero.actions.secondary.href} variant="quiet">
              {hero.actions.secondary.label}
            </CtaLink>
          </div>
        </div>
        <DawnMark />
      </Shell>
    </section>
  );
}
