import type { MethodStep } from '@/types/content';

export const method = {
  heading: 'How an engagement runs.',
  lede: 'Four stages, in order. You know at every point what is being decided and what you get at the end of it.',
} as const;

export const methodSteps: MethodStep[] = [
  {
    id: 'assess',
    number: '01',
    title: 'Assess',
    description:
      'We start inside the business: how work moves, where time and revenue leak, and what the market already believes about you.',
  },
  {
    id: 'decide',
    number: '02',
    title: 'Decide',
    description:
      "We agree what to build and in what order. Every recommendation carries the result it's meant to produce.",
  },
  {
    id: 'build',
    number: '03',
    title: 'Build',
    description:
      'We implement across whichever disciplines the work needs — usually more than one. You see working output, not decks.',
  },
  {
    id: 'hand-over',
    number: '04',
    title: 'Hand over',
    description:
      'Your team runs it without us. We document the systems, train the people, and stay reachable.',
  },
];
