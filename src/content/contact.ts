import { site } from '@/config/site';
import type { EmphasisedHeading, EnquiryTopic, ReachGroup } from '@/types/content';

export const contact = {
  heading: {
    before: 'Start with a ',
    accent: 'conversation',
    after: '.',
  } satisfies EmphasisedHeading,
  lede: "Tell us what you're trying to move. If we're not the right practice for it, we'll say so on the first call.",
  formNote: 'We reply within two business days.',
  submitLabel: 'Send request',
  submittedLabel: 'Request sent',
} as const;

export const reachGroups: ReachGroup[] = [
  {
    id: 'email',
    label: 'Email',
    icon: 'email',
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: 'phone',
    value: site.phone,
    href: site.phoneHref,
  },
  {
    id: 'office',
    label: 'Office',
    icon: 'location',
    value: site.location,
  },
  {
    id: 'elsewhere',
    label: 'Elsewhere',
    /** PLACEHOLDER — point these at the real profiles. */
    links: [
      { label: 'Instagram', href: '#' },
      { label: 'LinkedIn', href: '#' },
      { label: 'WhatsApp', href: '#' },
    ],
  },
];

export const enquiryTopics: EnquiryTopic[] = [
  { value: 'unsure', label: "Not sure yet — let's talk" },
  { value: 'ai', label: 'AI solutions' },
  { value: 'consultancy', label: 'Consultancy' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'multiple', label: 'More than one of these' },
];
