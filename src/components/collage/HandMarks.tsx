import React from 'react';

/** Handwritten underline under a heading word. Never mirrored in RTL (per the design README). */
export const HandUnderline: React.FC<{ delay?: string; compact?: boolean }> = ({
  delay = '0.8s',
  compact = false,
}) => (
  <svg
    aria-hidden="true"
    viewBox={compact ? '0 0 200 30' : '0 0 300 40'}
    preserveAspectRatio="none"
    className={`absolute start-[-4%] w-[108%] pointer-events-none ${
      compact ? '-bottom-2.5 h-[18px]' : '-bottom-3.5 h-7'
    }`}
  >
    <path
      className="anim-draw"
      d={compact ? 'M3 20 C 50 6, 100 26, 140 12 S 190 14, 197 8' : 'M4 26 C 60 8, 140 34, 200 14 S 280 20, 296 10'}
      fill="none"
      stroke="#E8473B"
      strokeWidth={compact ? 6 : 7}
      strokeLinecap="round"
      style={{ animationDelay: delay, '--dash': 600 } as React.CSSProperties}
    />
  </svg>
);

/** Handwritten red ring around the selected polaroid. */
export const HandCircle: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 300 300"
    preserveAspectRatio="none"
    className="absolute -inset-3 desk:-inset-[18px] w-[calc(100%+24px)] h-[calc(100%+24px)] desk:w-[calc(100%+36px)] desk:h-[calc(100%+36px)] max-w-none pointer-events-none"
  >
    <path
      className="anim-draw"
      d="M150 8 C 250 3, 292 10, 295 66 C 299 150, 298 226, 289 268 C 280 297, 190 296, 140 295 C 70 297, 13 297, 7 262 C 1 200, 1 110, 7 48 C 12 10, 70 5, 170 11"
      fill="none"
      stroke="#E8473B"
      strokeWidth="4"
      strokeLinecap="round"
      vectorEffect="non-scaling-stroke"
      style={{ '--draw-time': '0.7s' } as React.CSSProperties}
    />
  </svg>
);

/** The check that draws itself in a delivery slot box. */
export const HandCheck: React.FC = () => (
  <svg aria-hidden="true" viewBox="0 0 30 30" className="absolute -inset-1.5 w-[38px] h-[38px] max-w-none">
    <path
      className="anim-check"
      d="M5 15 L12 23 L27 4"
      fill="none"
      stroke="#E8473B"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/** Handwritten arrow in the landing hero. Mirrored in RTL. */
export const HandArrow: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className = '', style }) => (
  <svg aria-hidden="true" viewBox="0 0 200 120" className={`rtl-flip ${className}`} style={style}>
    <path
      className="anim-draw"
      d="M10 100 C 60 20, 120 120, 180 30"
      fill="none"
      stroke="#1E1E1E"
      strokeWidth="3"
      strokeLinecap="round"
      style={{ animationDelay: '1.4s', '--dash': 600 } as React.CSSProperties}
    />
    <path
      className="anim-draw"
      d="M165 28 L182 28 L178 46"
      fill="none"
      stroke="#1E1E1E"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ animationDelay: '2s', '--dash': 600 } as React.CSSProperties}
    />
  </svg>
);
