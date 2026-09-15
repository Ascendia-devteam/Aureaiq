import type { ImageAsset, Sector } from '@/types/content';

export const audience = {
  heading: 'Who we build for.',
  lede: 'Four kinds of business, and the specific thing each one usually needs fixed first.',
  /** PLACEHOLDER — replace with real Baghdad / client photography. */
  image: {
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&sat=-45&w=900&q=70',
    alt: '',
    width: 900,
    height: 1200,
  } satisfies ImageAsset,
} as const;

export const sectors: Sector[] = [
  {
    id: 'real-estate',
    term: 'Real estate',
    description:
      'Developers and brokers selling to buyers who are comparing them against Dubai and Amman.',
  },
  {
    id: 'smes',
    term: 'Emerging SMEs',
    description:
      "Businesses past the stage where the founder does everything, and not yet structured for what's next.",
  },
  {
    id: 'hospitality',
    term: 'Hospitality',
    description:
      'Hotels, restaurants, coffee houses and lounges — where the first impression is made online, long before anyone arrives.',
  },
  {
    id: 'consumer-goods',
    term: 'Consumer goods',
    description:
      'Brands and distributors whose product is ready for the shelf, and whose packaging, positioning and route to market are not.',
  },
];
