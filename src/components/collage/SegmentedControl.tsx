import React from 'react';

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: React.ReactNode; icon?: React.ReactNode }[];
  onChange: (value: T) => void;
  className?: string;
}

/** Outlined one-of-many switch: the look of the language switcher, for any set of options. */
export const SegmentedControl = <T extends string>({
  label,
  value,
  options,
  onChange,
  className = '',
}: SegmentedControlProps<T>) => (
  <div
    role="group"
    aria-label={label}
    className={`seg-group inline-flex max-w-full bg-card border-2 border-ink rounded-xl overflow-hidden ${className}`}
  >
    {options.map((option) => {
      const isActive = option.value === value;
      return (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={isActive}
          className={`inline-flex flex-1 items-center justify-center gap-1.5 min-h-11 min-w-11 px-2.5 text-sm font-extrabold cursor-pointer transition-colors duration-200 ${
            isActive ? 'bg-ink text-paper' : 'bg-card text-ink'
          }`}
        >
          {option.icon}
          {option.label}
        </button>
      );
    })}
  </div>
);
