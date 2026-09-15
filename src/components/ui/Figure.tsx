import { useRef } from 'react';
import { useFigureReveal } from '@/hooks/animations';
import type { ImageAsset } from '@/types/content';

interface FigureProps {
  image: ImageAsset;
  /** Extra class for the figure's size — height is always set by the caller. */
  className?: string;
  /** ScrollSmoother parallax factor. Below 1 the figure lags the page. */
  speed?: number;
  caption?: string;
}

/**
 * A treated photograph: duotone, wiped open on entry, relaxing out of
 * its over-scale on hover. The treatment is in `figure.css`; the motion
 * is in `useFigureReveal`.
 */
export function Figure({ image, className, speed, caption }: FigureProps) {
  const ref = useRef<HTMLElement>(null);
  useFigureReveal(ref);

  return (
    <figure
      ref={ref}
      className={['fig', className].filter(Boolean).join(' ')}
      data-speed={speed}
    >
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        decoding="async"
        fetchPriority="low"
      />
      {caption && <figcaption className="fig__caption">{caption}</figcaption>}
    </figure>
  );
}
