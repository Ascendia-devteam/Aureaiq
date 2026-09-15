import type { EmphasisedHeading, ImageAsset, Pillar } from '@/types/content';

export const about = {
  heading: {
    before: 'An American practice, built for the ',
    accent: 'Iraqi market',
    after: '.',
  } satisfies EmphasisedHeading,
  lede: 'Aurea is the Baghdad sister company of an American firm. We exist to close the gap between where Iraqi businesses are today and where global capital, partners and customers expect them to be — without waiting for the infrastructure to catch up first.',
  /** PLACEHOLDER. */
  image: {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&sat=-45&w=900&q=70',
    alt: 'Consultants in discussion',
  } satisfies ImageAsset,
} as const;

export const pillars: Pillar[] = [
  {
    id: 'american-standard',
    title: 'American standard',
    description:
      'The operating discipline of a U.S. sister practice, applied here without dilution.',
  },
  {
    id: 'iraqi-fluency',
    title: 'Iraqi fluency',
    description: 'Built on the ground in Baghdad, for how business actually gets done here.',
  },
  {
    id: 'scoped-to-fit',
    title: 'Scoped to fit',
    description:
      'Take one discipline or all three. The scope follows the problem, not a package we need to sell.',
  },
];
