import { useRef, type ReactNode } from 'react';
import { useFadeReveal, useLineReveal } from '@/hooks/animations';
import { usePreloader } from '@/hooks/usePreloader';

interface SectionHeadProps {
  heading: ReactNode;
  lede?: ReactNode;
  /** Set on the first heading of a section that is not the page title. */
  id?: string;
}

/**
 * The heading-plus-lede pair that opens every section.
 *
 * Both reveals wait on the preloader's hand-off. Split before the
 * webfonts have settled and SplitText bakes the lines at fallback-font
 * widths; build a ScrollTrigger from a layout that is about to move and
 * a start point can end up above where it was measured, in which case
 * the trigger never fires and the section stays blank.
 */
export function SectionHead({ heading, lede, id }: SectionHeadProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const { isReady } = usePreloader();

  useLineReveal(headingRef, isReady);
  useFadeReveal(ledeRef, isReady);

  return (
    <div className="section-head">
      <h2 id={id} ref={headingRef}>
        {heading}
      </h2>
      {lede && (
        <p className="lede" ref={ledeRef}>
          {lede}
        </p>
      )}
    </div>
  );
}
