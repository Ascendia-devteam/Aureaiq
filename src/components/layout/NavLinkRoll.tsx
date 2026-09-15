import { useRef } from 'react';
import { useRollHover } from '@/hooks/animations';
import { SmoothLink } from '@/components/ui/SmoothLink';
import type { NavLink } from '@/types/content';

interface NavLinkRollProps {
  link: NavLink;
  isActive: boolean;
}

/**
 * A masthead nav link. The label is rendered twice: the visible one
 * rolls up on hover and its twin rolls in behind it. The second copy is
 * `aria-hidden`, so the link still reads as one name.
 */
export function NavLinkRoll({ link, isActive }: NavLinkRollProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  useRollHover(ref);

  return (
    <SmoothLink ref={ref} href={link.href} aria-current={isActive ? 'true' : undefined}>
      <span className="roll">
        <span className="roll__a">{link.label}</span>
        <span className="roll__b" aria-hidden="true">
          {link.label}
        </span>
      </span>
    </SmoothLink>
  );
}
