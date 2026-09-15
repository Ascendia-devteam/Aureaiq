/**
 * Shapes for everything under `src/content`.
 *
 * Content is data, not markup: a copy change should never require
 * touching a component. Every section reads a typed array from here, so
 * adding a fourth discipline or a fifth method step is a one-line edit
 * that the compiler checks for you.
 */

/** A link that scrolls to a section of this page (`#practice`). */
export interface NavLink {
  label: string;
  href: `#${string}`;
}

/** A headline split into a plain part and a gold-emphasised keyword. */
export interface EmphasisedHeading {
  /** Text before the emphasised keyword. */
  before?: string;
  /** The keyword rendered in the accent colour. */
  accent?: string;
  /** Text after the emphasised keyword. */
  after?: string;
}

export interface ImageAsset {
  src: string;
  /** Empty string marks the image as decorative. */
  alt: string;
  width?: number;
  height?: number;
}

/** One row of the "who we build for" list. */
export interface Sector {
  id: string;
  term: string;
  description: string;
}

/** One of the three claims under the About section. */
export interface Pillar {
  id: string;
  title: string;
  description: string;
}

/** One collapsible service in the Practice accordion. */
export interface Discipline {
  id: string;
  name: string;
  claim: string;
  summary: string;
  deliverables: string[];
  image: ImageAsset;
}

/** One numbered stage of an engagement. */
export interface MethodStep {
  id: string;
  /** Displayed as-is, so it keeps its leading zero. */
  number: string;
  title: string;
  description: string;
}

/** Icons the contact block can render next to a label. */
export type ReachIcon = 'email' | 'phone' | 'location';

/** One contact channel: either a single value or a row of links. */
export interface ReachGroup {
  id: string;
  label: string;
  icon?: ReachIcon;
  /** The displayed value. Omitted when `links` is used instead. */
  value?: string;
  /** `mailto:` / `tel:` target for `value`. Omit for plain text. */
  href?: string;
  /** Used by the "Elsewhere" group in place of a single value. */
  links?: { label: string; href: string }[];
}

/** One option in the enquiry form's "what do you need" select. */
export interface EnquiryTopic {
  value: string;
  label: string;
}
