/**
 * The Dawn Field — repeated arcs at hairline weight, from the identity
 * spec. It sits behind a pull-quote and never behind body text.
 *
 * The paths are drawn on by `useQuoteReveal`, which measures each one's
 * length at runtime.
 */
export function DawnField() {
  return (
    <svg className="dawn-field" viewBox="0 0 1200 460" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d="M-100 120 Q600 -60 1300 120" />
      <path d="M-100 190 Q600 10 1300 190" />
      <path d="M-100 260 Q600 80 1300 260" />
      <path d="M-100 330 Q600 150 1300 330" />
      <path d="M-100 400 Q600 220 1300 400" />
      <path d="M-100 470 Q600 290 1300 470" />
    </svg>
  );
}
