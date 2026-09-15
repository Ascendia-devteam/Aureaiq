import type { EmphasisedHeading } from '@/types/content';

export const hero = {
  kicker: 'Aurea Professional Services — Baghdad',
  headline: {
    accent: 'Clarity',
    after: ', applied to what your business does next.',
  } satisfies EmphasisedHeading,
  lede: 'AI solutions, consultancy and marketing in a single engagement — an American operating standard, built around how business actually moves in Iraq.',
  actions: {
    primary: { label: 'Book a consultation', href: '#contact' },
    secondary: { label: 'See what we do', href: '#practice' },
  },
} as const;
