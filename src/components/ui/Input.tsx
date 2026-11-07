import React, { InputHTMLAttributes, forwardRef } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leftIcon,
      rightIcon,
      isLoading = false,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold uppercase tracking-wider text-secondary"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-muted">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled || isLoading}
            className={`
              w-full h-11 rounded-xl bg-surface border text-primary text-sm placeholder:text-muted/60
              transition-all duration-150
              focus:outline-none focus:border-ink focus:ring-2 focus:ring-accent/30
              disabled:opacity-50 disabled:bg-surface-elevated disabled:cursor-not-allowed
              ${leftIcon ? 'pl-10' : 'pl-3.5'}
              ${rightIcon || isLoading || error ? 'pr-10' : 'pr-3.5'}
              ${error ? 'border-danger focus:border-danger focus:ring-danger/20' : 'border-theme'}
              ${className}
            `}
            {...props}
          />

          <div className="absolute right-3.5 flex items-center gap-1.5 pointer-events-none">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted" />}
            {error && !isLoading && <AlertCircle className="w-4 h-4 text-danger" />}
            {rightIcon && !isLoading && !error && (
              <span className="text-muted">{rightIcon}</span>
            )}
          </div>
        </div>

        {error ? (
          <p className="text-xs text-danger font-medium flex items-center gap-1">
            {error}
          </p>
        ) : hint ? (
          <p className="text-xs text-muted">{hint}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
