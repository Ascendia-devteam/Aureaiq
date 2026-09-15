import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useMagneticPointer } from '@/hooks/animations';
import { SmoothLink } from './SmoothLink';

type Variant = 'solid' | 'quiet';

const VARIANT_CLASS: Record<Variant, string> = {
  solid: 'cta',
  quiet: 'cta cta--quiet',
};

interface CtaLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  onNavigate?: () => void;
}

/** The primary call to action, as an in-page link. */
export function CtaLink({ href, children, variant = 'solid', onNavigate }: CtaLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagneticPointer(ref);

  return (
    <SmoothLink ref={ref} href={href} className={VARIANT_CLASS[variant]} onNavigate={onNavigate}>
      {children}
    </SmoothLink>
  );
}

interface CtaButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: Variant;
}

/** The same object as a real button, for form submission. */
export function CtaButton({ children, variant = 'solid', ...rest }: CtaButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  useMagneticPointer(ref);

  return (
    <button ref={ref} className={VARIANT_CLASS[variant]} {...rest}>
      {children}
    </button>
  );
}
