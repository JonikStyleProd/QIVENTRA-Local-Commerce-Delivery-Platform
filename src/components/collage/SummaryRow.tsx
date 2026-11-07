import React from 'react';

interface SummaryRowProps {
  label: React.ReactNode;
  value: React.ReactNode;
  isTotal?: boolean;
}

/** One line of a yellow total panel. The total line gets a rule above and a bigger price. */
export const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, isTotal = false }) => (
  <div
    className={`grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3 ${
      isTotal ? 'mt-2.5 pt-2.5 border-t-2 border-ink text-lg font-black' : 'py-1 font-extrabold'
    }`}
  >
    <span>{label}</span>
    <span className={`tabular-nums whitespace-nowrap ${isTotal ? 'text-[26px]' : ''}`}>{value}</span>
  </div>
);
