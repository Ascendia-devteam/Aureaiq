import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';

interface SmoothLinkProps extends ComponentPropsWithRef<'a'> {
  href: string;
  children: ReactNode;
  /** Called after a successful in-page navigation — used to close menus. */
  onNavigate?: () => void;
}

/**
 * An in-page anchor that routes through the scroll layer, so it lands
 * clear of the fixed masthead and animates with ScrollSmoother when one
 * exists.
 *
 * Anything that is not a resolvable `#hash` falls through to the
 * browser untouched: an external link is still an external link.
 */
export function SmoothLink({ href, children, onNavigate, onClick, ...rest }: SmoothLinkProps) {
  const { scrollTo } = useSmoothScroll();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || !href.startsWith('#')) return;

    const isTop = href === '#' || href === '#top';
    const target = isTop ? null : document.querySelector(href);
    if (!isTop && !target) return;

    event.preventDefault();
    scrollTo(target);
    onNavigate?.();
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
