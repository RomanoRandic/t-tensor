// Thyra's companion. The wings echo the thyroid's butterfly shape.
export function ButterflyShape({ flap = false }: { flap?: boolean }) {
  return (
    <g className={flap ? "bfly flap" : "bfly"}>
      <g className="bfly-wing bfly-left">
        <path d="M -4 -6 C -20 -40 -58 -46 -56 -18 C -54 4 -30 10 -4 4 Z" fill="#8E5CC9" />
        <path d="M -4 4 C -26 8 -46 22 -38 38 C -30 50 -12 40 -4 18 Z" fill="#B48BE0" />
        <circle cx="-34" cy="-20" r="6.5" fill="#F2B84B" />
        <circle cx="-24" cy="26" r="4" fill="#F4F1E8" opacity="0.85" />
      </g>
      <g className="bfly-wing bfly-right">
        <path d="M 4 -6 C 20 -40 58 -46 56 -18 C 54 4 30 10 4 4 Z" fill="#8E5CC9" />
        <path d="M 4 4 C 26 8 46 22 38 38 C 30 50 12 40 4 18 Z" fill="#B48BE0" />
        <circle cx="34" cy="-20" r="6.5" fill="#F2B84B" />
        <circle cx="24" cy="26" r="4" fill="#F4F1E8" opacity="0.85" />
      </g>
      <path d="M -4 -27 C -8 -40 -14 -46 -20 -48" stroke="#4A1A6B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 4 -27 C 8 -40 14 -46 20 -48" stroke="#4A1A6B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="-21" cy="-49" r="3.6" fill="#F2A06A" />
      <circle cx="21" cy="-49" r="3.6" fill="#F2A06A" />
      <rect x="-6" y="-8" width="12" height="44" rx="6" fill="#4A1A6B" />
      <circle cx="0" cy="-16" r="13" fill="#5B2A86" />
      <circle cx="-5" cy="-17" r="4.2" fill="#FFFFFF" />
      <circle cx="5" cy="-17" r="4.2" fill="#FFFFFF" />
      <circle cx="-4.2" cy="-16.3" r="2.2" fill="#1B241F" />
      <circle cx="5.8" cy="-16.3" r="2.2" fill="#1B241F" />
      <ellipse cx="-8.5" cy="-10" rx="2.6" ry="1.6" fill="#E98AA6" />
      <ellipse cx="8.5" cy="-10" rx="2.6" ry="1.6" fill="#E98AA6" />
      <path d="M -3 -9.5 Q 0 -6.5 3 -9.5" stroke="#1B241F" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </g>
  );
}

export function Butterfly({ className, flap = false }: { className?: string; flap?: boolean }) {
  return (
    <svg className={className} viewBox="-62 -56 124 110" aria-hidden="true">
      <ButterflyShape flap={flap} />
    </svg>
  );
}
