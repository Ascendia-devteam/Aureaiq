import type { Discipline, EmphasisedHeading } from '@/types/content';

export const practice = {
  heading: {
    before: 'Three disciplines, ',
    accent: 'one engagement',
    after: '.',
  } satisfies EmphasisedHeading,
  lede: 'Most problems worth solving sit across more than one of these. We scope them together, so the strategy, the systems and the story are built by the same people.',
} as const;

export const disciplines: Discipline[] = [
  {
    id: 'ai',
    name: 'AI Solutions',
    claim: "Automation that runs the parts of your business that shouldn't need you.",
    summary:
      'We design AI-powered systems for booking, customer response and daily operations — built on tools your team can keep using after we leave, not a platform you\'ll abandon in six months.',
    deliverables: [
      'Booking and intake automation',
      'Customer response, Arabic and English',
      'Operational reporting',
      'Team training on what we install',
    ],
    /** PLACEHOLDER. */
    image: {
      src: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&sat=-45&w=700&q=70',
      alt: '',
    },
  },
  {
    id: 'consultancy',
    name: 'Consultancy',
    claim: 'Strategy built for how business gets done in Iraq.',
    summary:
      'From investor-ready concept development to operational structuring, we advise founders and institutions on the decisions that determine whether a business scales or stalls.',
    deliverables: [
      'Concept development and feasibility',
      'Investor and partner documentation',
      'Operational and org structuring',
      'Market entry for foreign partners',
    ],
    /** PLACEHOLDER. */
    image: {
      src: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&sat=-45&w=700&q=70',
      alt: '',
    },
  },
  {
    id: 'marketing',
    name: 'Marketing',
    claim: 'Brand and content built to earn trust in a crowded market.',
    summary:
      'Visual identity, positioning and bilingual content systems, produced to hold up across a launch and the year after it — not just a single campaign.',
    deliverables: [
      'Identity and brand systems',
      'Positioning and messaging',
      'Bilingual content production',
      'Launch and campaign management',
    ],
    /** PLACEHOLDER. */
    image: {
      src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&sat=-45&w=700&q=70',
      alt: '',
    },
  },
];
