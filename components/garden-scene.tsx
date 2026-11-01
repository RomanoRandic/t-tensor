import { ButterflyShape } from "@/components/butterfly";

type Flower = { x: number; y: number; kind: "daisy" | "tulip"; color: string; center?: string; leaf: "left" | "right" };

// One flower per week the person logged; the bud is this week.
const FLOWERS: Flower[] = [
  { x: 480, y: 168, kind: "daisy", color: "#E98AA6", leaf: "left" },
  { x: 570, y: 150, kind: "tulip", color: "#B48BE0", leaf: "right" },
  { x: 660, y: 176, kind: "daisy", color: "#F4F1E8", leaf: "left" },
  { x: 750, y: 158, kind: "tulip", color: "#EF8354", leaf: "right" },
  { x: 840, y: 172, kind: "daisy", color: "#F2B84B", center: "#5B2A86", leaf: "left" },
  { x: 930, y: 154, kind: "daisy", color: "#E98AA6", leaf: "right" },
  { x: 1020, y: 180, kind: "tulip", color: "#B48BE0", leaf: "left" },
];

const PETALS: [number, number][] = [
  [0, -14],
  [13.3, -4.3],
  [8.2, 11.3],
  [-8.2, 11.3],
  [-13.3, -4.3],
];

const GROUND = 330;

function FlowerShape({ flower }: { flower: Flower }) {
  const stem = GROUND - flower.y;
  const leafY = stem * 0.42;
  const leaf =
    flower.leaf === "left"
      ? `M0 ${leafY} C -16 ${leafY - 12} -26 ${leafY - 6} -28 ${leafY + 4} C -18 ${leafY + 10} -8 ${leafY + 8} 0 ${leafY} Z`
      : `M0 ${leafY} C 16 ${leafY - 12} 26 ${leafY - 6} 28 ${leafY + 4} C 18 ${leafY + 10} 8 ${leafY + 8} 0 ${leafY} Z`;

  return (
    <g transform={`translate(${flower.x} ${flower.y})`}>
      <path d={`M0 0 L0 ${stem}`} stroke="#3F7A4F" strokeWidth="4" strokeLinecap="round" />
      <path d={leaf} fill="#5E9E6A" />
      {flower.kind === "daisy" ? (
        <>
          {PETALS.map(([cx, cy]) => (
            <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="11" fill={flower.color} />
          ))}
          <circle r="8" fill={flower.center ?? "#F2B84B"} />
        </>
      ) : (
        <path d="M -16 -4 C -16 -28 -7 -32 0 -20 C 7 -32 16 -28 16 -4 C 16 12 -16 12 -16 -4 Z" fill={flower.color} />
      )}
    </g>
  );
}

export function GardenScene() {
  return (
    <svg
      className="g-scene"
      viewBox="0 0 1440 380"
      preserveAspectRatio="xMinYMax slice"
      role="img"
      aria-label="A purple butterfly flies over a hill with seven flowers, one for each week of check-ins, and a bud for this week."
    >
      <circle cx="1220" cy="110" r="54" fill="#F2B84B" />
      {[
        [180, 60],
        [760, 40],
        [980, 96],
        [1380, 44],
        [660, 104],
      ].map(([cx, cy]) => (
        <circle key={cx} cx={cx} cy={cy} r="2" fill="#F4F1E8" opacity="0.5" />
      ))}

      <rect x="1196" y="186" width="9" height="50" fill="#6B4B3A" />
      <circle cx="1200" cy="176" r="30" fill="#5E9E6A" />
      <path d="M0 250 C 220 170 460 190 700 220 C 940 250 1180 170 1440 200 L1440 380 L0 380 Z" fill="#2F5A44" />

      {FLOWERS.map((flower) => (
        <FlowerShape key={flower.x} flower={flower} />
      ))}
      <g transform="translate(1110 214)">
        <path d={`M0 0 L0 ${GROUND - 214}`} stroke="#3F7A4F" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="0" cy="-6" rx="7" ry="12" fill="#B48BE0" />
      </g>

      <path d="M0 300 C 300 240 600 255 820 272 C 1040 290 1260 245 1440 262 L1440 380 L0 380 Z" fill="#E9EEDF" />

      {FLOWERS.map((flower, index) => (
        <text key={flower.x} x={flower.x} y="304" className="g-scene-label" textAnchor="middle">
          wk {index + 1}
        </text>
      ))}
      <text x="1110" y="304" className="g-scene-label now" textAnchor="middle">
        this week
      </text>

      <path
        d="M 110 262 C 160 206 214 276 262 226 S 318 196 336 190"
        fill="none"
        stroke="#F4F1E8"
        strokeOpacity="0.45"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1 9"
      />
      <g transform="translate(372 168) scale(1.3)">
        <g className="bfly-float">
          <ButterflyShape flap />
        </g>
      </g>

      <g transform="translate(300 32)">
        <path d="M 58 46 L 70 76 L 98 48 Z" fill="#F4F1E8" />
        <rect width="232" height="50" rx="25" fill="#F4F1E8" />
        <text x="116" y="32" className="g-bubble-text" textAnchor="middle">
          Morning! Pill taken?
        </text>
      </g>
    </svg>
  );
}
