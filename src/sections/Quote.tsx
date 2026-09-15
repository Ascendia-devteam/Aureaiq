import { useRef } from 'react';
import { quote } from '@/content/quote';
import { useFadeReveal, useQuoteReveal } from '@/hooks/animations';
import { usePreloader } from '@/hooks/usePreloader';
import { DawnField } from '@/components/brand/DawnField';

/** The pull-quote, over the Dawn Field. */
export function Quote() {
  const bandRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const captionRef = useRef<HTMLElement>(null);
  const { isReady } = usePreloader();

  useQuoteReveal(bandRef, quoteRef, isReady);
  useFadeReveal(captionRef, isReady);

  return (
    <section className="band band--ink quote-band" id="quote" ref={bandRef}>
      <DawnField />
      <figure className="shell quote">
        <blockquote ref={quoteRef}>{quote.text}</blockquote>
        <figcaption ref={captionRef}>{quote.attribution}</figcaption>
      </figure>
    </section>
  );
}
