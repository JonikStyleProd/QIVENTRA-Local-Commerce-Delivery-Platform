import React, { SelectHTMLAttributes, useId } from 'react';
import { AlertCircle } from 'lucide-react';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  /** Shown as an empty first choice. */
  placeholder?: string;
  error?: string;
}

/** Outlined native select with a label and an error under it, matching Input. */
export const SelectField: React.FC<SelectFieldProps> = ({ label, options, placeholder, error, className = '', ...props }) => {
  const id = useId();
  const errorId = `${id}-error`;
  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-extrabold">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full min-h-11 px-2 bg-card text-ink border-2 rounded-xl font-bold cursor-pointer ${
          error ? 'border-danger' : 'border-ink'
        }`}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="flex items-center gap-1 text-sm font-bold text-danger">
          <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};
