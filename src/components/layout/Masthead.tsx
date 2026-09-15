import { useMemo, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { navLinks } from '@/content/navigation';
import { hero } from '@/content/hero';
import {
  useActiveSection,
  useInvertOverDark,
  useMastheadScroll,
  useScrollProgress,
} from '@/hooks/animations';
import { useMotion } from '@/hooks/useMotion';
import { Wordmark } from '@/components/brand/Wordmark';
import { Icon } from '@/components/ui/Icon';
import { SmoothLink } from '@/components/ui/SmoothLink';
import { NavLinkRoll } from './NavLinkRoll';

interface MastheadProps {
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  menuId: string;
}

/**
 * The fixed bar. It lives outside the smoothed content, so it is the
 * one element whose position is not driven by ScrollSmoother.
 *
 * Its three scroll behaviours are one hook each, and each is testable
 * on its own: condense-and-hide, invert over Ink, mark the section in
 * view. The progress hairline is a fourth.
 */
export function Masthead({ isMenuOpen, onToggleMenu, menuId }: MastheadProps) {
  const ref = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const { tier } = useMotion();

  const hashes = useMemo(() => navLinks.map((link) => link.href), []);
  const activeHash = useActiveSection(hashes);

  useMastheadScroll(ref, isMenuOpen);
  useInvertOverDark(ref);
  useScrollProgress(progressRef);

  /* The burger crossfades between two icons stacked in the same grid
     cell, so neither reflows the other as they swap. */
  useGSAP(
    () => {
      const icons = burgerRef.current?.children;
      if (!icons || icons.length !== 2) return;

      if (tier === 'none') {
        gsap.set(icons[0], { opacity: isMenuOpen ? 0 : 1 });
        gsap.set(icons[1], { opacity: isMenuOpen ? 1 : 0 });
        return;
      }

      gsap.to(icons[0], { opacity: isMenuOpen ? 0 : 1, rotate: isMenuOpen ? 90 : 0, duration: 0.3 });
      gsap.to(icons[1], { opacity: isMenuOpen ? 1 : 0, rotate: isMenuOpen ? 0 : -90, duration: 0.3 });
    },
    { dependencies: [isMenuOpen, tier] },
  );

  return (
    <header className="masthead" id="masthead" ref={ref}>
      <div className="shell masthead__inner">
        <Wordmark aria-label={`Aurea, by Ascendia — home`} />

        <nav className="menu" aria-label="Primary">
          {navLinks.map((link) => (
            <NavLinkRoll key={link.href} link={link} isActive={activeHash === link.href} />
          ))}
        </nav>

        <SmoothLink className="book" href={hero.actions.primary.href}>
          <span>{hero.actions.primary.label}</span>
        </SmoothLink>

        <button
          className="burger"
          ref={burgerRef}
          onClick={onToggleMenu}
          aria-expanded={isMenuOpen}
          aria-controls={menuId}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <Icon name="menu" />
          <Icon name="close" />
        </button>
      </div>
      <span className="masthead__progress" ref={progressRef} />
    </header>
  );
}
