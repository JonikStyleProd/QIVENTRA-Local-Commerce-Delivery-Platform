import React from 'react';

interface CategoryChipProps {
  label: string;
  isActive: boolean;
  tintClassName?: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

/** Category or filter chip: tinted when idle, inverted when active. */
export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  isActive,
  tintClassName = 'bg-white',
  onClick,
  icon,
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={isActive}
    className={`chip-tilt inline-flex items-center gap-1.5 shrink-0 min-h-11 desk:min-h-[46px] px-3.5 desk:px-[18px] border-2 border-ink rounded-xl desk:rounded-[14px] shadow-hard-2 desk:shadow-hard-3 text-sm desk:text-base font-extrabold cursor-pointer whitespace-nowrap ${
      isActive ? 'bg-ink text-white' : `${tintClassName} text-ink`
    }`}
  >
    {icon}
    {label}
  </button>
);
