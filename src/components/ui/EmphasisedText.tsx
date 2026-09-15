import type { EmphasisedHeading } from '@/types/content';

/**
 * Renders a headline whose keyword is picked out in the accent colour.
 *
 * Content stays as data — `{ before, accent, after }` — rather than as
 * a string with markup in it, so a copy edit never means editing HTML.
 */
export function EmphasisedText({ before, accent, after }: EmphasisedHeading) {
  return (
    <>
      {before}
      {accent && <span className="hl">{accent}</span>}
      {after}
    </>
  );
}
