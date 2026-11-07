import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isError?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      isError = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      id,
      onClick,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'btn-tilt relative inline-flex items-center justify-center text-center select-none rounded-[14px] border-2 border-ink cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

    // Every size keeps the 44px minimum. "lg" is the 19px bold that white on #E8473B needs for contrast.
    const sizeStyles = {
      sm: 'text-sm font-extrabold min-h-11 px-4 gap-1.5',
      md: 'text-base font-extrabold min-h-11 px-5 gap-2',
      lg: 'text-[19px] font-black min-h-[52px] px-6 py-2 gap-2.5',
    };

    const variantStyles = {
      primary: `${size === 'lg' ? 'bg-action' : 'bg-action-strong'} text-white shadow-hard-3`,
      accent: 'bg-accent text-ink shadow-hard-3',
      secondary: 'bg-link text-white shadow-hard-3',
      outline: 'bg-card text-ink',
      ghost: 'bg-transparent text-ink border-transparent hover:bg-paper-dot/40',
      danger: 'bg-[#C53030] text-white shadow-hard-3',
    };

    const errorStyles = isError ? 'border-danger bg-tint-food text-danger' : '';

    return (
      <button
        ref={ref}
        id={id}
        disabled={disabled}
        aria-busy={isLoading || undefined}
        onClick={isLoading ? undefined : onClick}
        className={`${baseStyles} ${sizeStyles[size]} ${errorStyles || variantStyles[variant]} ${
          fullWidth ? 'w-full' : ''
        } ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <span
              aria-hidden="true"
              className="anim-spin w-[18px] h-[18px] shrink-0 rounded-full border-[3px] border-current border-t-transparent"
            />
            <span>{children}</span>
          </>
        ) : isError ? (
          <>
            <AlertCircle className="w-4 h-4 text-current" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
