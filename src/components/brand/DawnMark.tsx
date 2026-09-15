/**
 * The Dawn Mark — a golden-section construction: the Fibonacci square
 * tiling and the spiral it generates.
 *
 * "Aurea" is the sectio aurea, so the hero draws its own name. The
 * geometry is fixed; only its placement is responsive, and that lives
 * in `dawn-mark.css`.
 *
 * The arc carries `id="dawnArc"` because the opening sequence measures
 * its path length to draw it on. Renaming it means updating
 * `useOpeningSequence` too.
 */
export function DawnMark() {
  return (
    <svg
      className="dawn"
      viewBox="-7 -7 624 391"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="dawnStroke" x1="0" y1="377" x2="520" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B8933F" stopOpacity=".28" />
          <stop offset=".5" stopColor="#B8933F" stopOpacity=".85" />
          <stop offset="1" stopColor="#96731F" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="dawnGlow" cx="437" cy="272" r="340" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B8933F" stopOpacity=".18" />
          <stop offset=".5" stopColor="#B8933F" stopOpacity=".055" />
          <stop offset="1" stopColor="#B8933F" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect className="dawn__glow" x="-7" y="-7" width="624" height="391" fill="url(#dawnGlow)" />

      {/* Fibonacci squares, tinted more strongly as they converge. */}
      <g className="dawn__cells">
        <path className="t1" d="M0 0h377v377H0z" />
        <path className="t2" d="M466 233h144v144H466z" />
        <path className="t2" d="M377 233h55v55H377z" />
        <path className="t3" d="M445 267h21v21H445z" />
      </g>

      {/* The construction lines the squares sit on. */}
      <g className="dawn__grid">
        <path d="M0 0h610v377H0z" />
        <path d="M377 0V377" />
        <path d="M377 233H610" />
        <path d="M466 233V377" />
        <path d="M377 288H466" />
        <path d="M432 233V288" />
        <path d="M432 267H466" />
        <path d="M445 267V288" />
        <path d="M432 275H445" />
      </g>

      <path
        className="dawn__arc"
        id="dawnArc"
        d="M0 377A377 377 0 0 1 377 0A233 233 0 0 1 610 233A144 144 0 0 1 466 377A89 89 0 0 1 377 288A55 55 0 0 1 432 233A34 34 0 0 1 466 267A21 21 0 0 1 445 288A13 13 0 0 1 432 275"
      />

      {/* The eye of the spiral, and the halo that breathes around it. */}
      <g className="dawn__eyewrap">
        <circle className="dawn__halo" cx="437" cy="272" r="11" />
        <circle className="dawn__eye" cx="437" cy="272" r="3.2" />
      </g>
    </svg>
  );
}
