// SVG filter defs for crayon effects — rendered once at app root.
// Three turbulence seeds let CSS cycle filters for a hand-drawn "boil" wobble.
export default function CrayonDefs() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: "absolute" }}
      aria-hidden="true"
    >
      <defs>
        {[1, 2, 3].map((n) => (
          <filter
            key={n}
            id={`crayon-rough-${n}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="1"
              seed={n * 7}
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
