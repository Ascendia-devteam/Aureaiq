import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { navLinks } from '@/content/navigation';
import { site } from '@/config/site';
import { useMotion } from '@/hooks/useMotion';
import { SmoothLink } from '@/components/ui/SmoothLink';

interface OverlayMenuProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * The full-screen menu, shown below the masthead's breakpoint.
 *
 * The open and close states are one paused timeline played forward and
 * backward rather than two timelines, so interrupting a half-finished
 * open reverses from where it is instead of jumping.
 */
export function OverlayMenu({ id, isOpen, onClose }: OverlayMenuProps) {
  const ref = useRef<HTMLElement>(null);
  const timelineRef = useRef<ReturnType<typeof gsap.timeline> | null>(null);
  const { tier } = useMotion();

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      // Under reduced motion there is no timeline at all; the effect
      // below sets the clip path directly instead.
      if (tier === 'none') {
        timelineRef.current = null;
        return;
      }

      const labels = element.querySelectorAll(':scope > a > span');
      gsap.set(labels, { yPercent: 110 });
      gsap.set('.overlay-menu__foot', { opacity: 0, y: 14 });

      timelineRef.current = gsap
        .timeline({ paused: true })
        .to(element, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' })
        .to(labels, { yPercent: 0, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, '-=.4')
        .to('.overlay-menu__foot', { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=.35');

      return () => {
        timelineRef.current = null;
      };
    },
    { dependencies: [tier], revertOnUpdate: true, scope: ref },
  );

  /* Play or reverse on every change of state. `is-open` gates pointer
     events, and is removed only once the reverse has finished — dropped
     any earlier, the menu would stop accepting clicks while still
     visibly on screen. */
  useEffect(() => {
    const element = ref.current;
    const timeline = timelineRef.current;
    if (!element) return;

    if (isOpen) {
      element.classList.add('is-open');
      if (timeline) timeline.play();
      else element.style.clipPath = 'inset(0 0 0% 0)';
      return;
    }

    if (timeline) {
      timeline.reverse().eventCallback('onReverseComplete', () => {
        element.classList.remove('is-open');
      });
    } else {
      element.classList.remove('is-open');
      element.style.clipPath = 'inset(0 0 100% 0)';
    }
  }, [isOpen]);

  /* Escape closes, and the page behind does not scroll while it is up. */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <nav className="overlay-menu" id={id} ref={ref} aria-label="Menu" aria-hidden={!isOpen}>
      {navLinks.map((link) => (
        <SmoothLink key={link.href} href={link.href} onNavigate={onClose} tabIndex={isOpen ? undefined : -1}>
          <span>{link.label}</span>
        </SmoothLink>
      ))}
      <div className="overlay-menu__foot">
        <span>{site.location}</span>
        <a href={`mailto:${site.email}`}>{site.email}</a>
      </div>
    </nav>
  );
}
