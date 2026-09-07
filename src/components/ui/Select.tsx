import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, hint, disabled, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold uppercase tracking-wider text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            className={`
              w-full h-11 appearance-none rounded-xl bg-surface border text-primary text-sm pl-3.5 pr-10
              transition-all duration-150 cursor-pointer
              focus:outline-none focus:border-[#123B35] focus:ring-2 focus:ring-[#B8D96B]/30
              dark:focus:border-[#B8D96B] dark:focus:ring-[#B8D96B]/20
              disabled:opacity-50 disabled:bg-surface-elevated disabled:cursor-not-allowed
              ${error ? 'border-[#C53030]' : 'border-theme'}
              ${className}
            `}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface text-primary">
                {opt.label}
              </option>
            ))}
          </select>

          <div className="absolute right-3.5 flex items-center pointer-events-none text-muted">
            {error ? (
              <AlertCircle className="w-4 h-4 text-[#C53030]" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>

        {error ? (
          <p className="text-xs text-[#C53030] font-medium">{error}</p>
        ) : hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
