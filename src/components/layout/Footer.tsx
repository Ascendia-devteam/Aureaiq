import { navLinks } from '@/content/navigation';
import { copyright } from '@/config/site';
import { Wordmark } from '@/components/brand/Wordmark';
import { SmoothLink } from '@/components/ui/SmoothLink';

export function Footer() {
  return (
    <footer className="colophon">
      <div className="shell colophon__row">
        <Wordmark />
        <nav className="colophon__links" aria-label="Footer">
          {navLinks.map((link) => (
            <SmoothLink key={link.href} href={link.href}>
              {link.label}
            </SmoothLink>
          ))}
        </nav>
        <p className="colophon__meta">{copyright}</p>
      </div>
    </footer>
  );
}
