/**
 * Site-wide facts. Anything that appears in more than one place —
 * the email address, the office, the legal line — lives here so it is
 * changed once.
 */
export const site = {
  name: 'Aurea Professional Services',
  shortName: 'Aurea',
  endorsement: 'By Ascendia',
  tagline: 'AI, Consultancy & Marketing, Baghdad',
  email: 'hello@aurea.iq',
  /** Placeholder — replace with the real number before launch. */
  phone: '+964 000 000 0000',
  phoneHref: 'tel:+9640000000000',
  location: 'Baghdad, Iraq',
  foundedYear: 2026,
} as const;

/** Rendered in the footer. */
export const copyright = `© ${site.foundedYear} ${site.name} · Baghdad`;
