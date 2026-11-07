import React from 'react';
import { tiltFor } from '../../data/collageCatalog';

interface StatStickerProps {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tint?: 'food' | 'health' | 'gift' | 'tech' | 'pets';
}

const TINT = {
  food: 'bg-tint-food',
  health: 'bg-tint-health',
  gift: 'bg-tint-gift',
  tech: 'bg-tint-tech',
  pets: 'bg-tint-pets',
};

/** Portal figure on a tinted sticker. These figures are examples; see DemoFiguresNote. */
export const StatSticker: React.FC<StatStickerProps> = ({ label, value, hint, tint = 'gift' }) => (
  <div
    className={`card-tilt min-w-0 p-3 desk:p-4 border-2 border-ink rounded-2xl shadow-hard-3 ${TINT[tint]}`}
    style={{ '--tilt': tiltFor(label) } as React.CSSProperties}
  >
    <p className="text-[13px] font-extrabold text-ink-2 leading-snug">{label}</p>
    <p className="mt-1 text-[22px] desk:text-[30px] font-black leading-none tabular-nums break-words">{value}</p>
    {hint && <p className="mt-1 text-xs font-bold text-ink-2">{hint}</p>}
  </div>
);

/** Handwritten reminder above portal figures: they are not real numbers. */
export const DemoFiguresNote: React.FC<{ text: string }> = ({ text }) => (
  <p className="hand mb-2 text-[26px] leading-none text-action -rotate-1">{text}</p>
);
