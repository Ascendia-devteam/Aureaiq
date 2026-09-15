import type { ElementType, ReactNode } from 'react';

interface ShellProps {
  children: ReactNode;
  className?: string;
  /** Defaults to a div; pass 'section' or 'div' when the semantics differ. */
  as?: ElementType;
}

/**
 * The measure. Everything on the page is centred and gutter-padded by
 * this one element, so the site has a single column width to change.
 */
export function Shell({ children, className, as: Tag = 'div' }: ShellProps) {
  return <Tag className={['shell', className].filter(Boolean).join(' ')}>{children}</Tag>;
}
