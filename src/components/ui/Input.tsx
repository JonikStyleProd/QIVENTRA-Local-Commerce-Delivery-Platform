import React, { InputHTMLAttributes, forwardRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

/** Outlined field. The icon uses logical insets, so it follows the reading direction. */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="w-full flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-extrabold">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <span aria-hidden="true" className="absolute start-3 flex text-ink-3 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={`w-full min-h-11 ${leftIcon ? 'ps-10' : 'ps-3'} pe-3 bg-card text-ink border-2 rounded-xl font-bold placeholder:text-ink-3 placeholder:font-semibold disabled:opacity-50 ${
              error ? 'border-danger' : 'border-ink'
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="flex items-center gap-1 text-sm font-bold text-danger">
            <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
