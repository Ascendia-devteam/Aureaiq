import { site } from '@/config/site';
import { SmoothLink } from '@/components/ui/SmoothLink';

interface WordmarkProps {
  href?: string;
  'aria-label'?: string;
}

/** The logotype: name, gold point, and the endorsement line beneath. */
export function Wordmark({ href = '#top', ...rest }: WordmarkProps) {
  return (
    <SmoothLink href={href} className="wordmark" {...rest}>
      <span className="wordmark__name">
        {site.shortName.toUpperCase()}
        <span className="wordmark__dot">·</span>
      </span>
      <span className="wordmark__by">{site.endorsement}</span>
    </SmoothLink>
  );
}
