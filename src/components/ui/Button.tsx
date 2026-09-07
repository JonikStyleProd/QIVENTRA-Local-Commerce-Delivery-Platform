import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

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
      ...props
    },
    ref
  ) => {
    // Base styles: padding math (2x horizontal), min 44px touch, smooth micro-interactions
    const baseStyles =
      'relative inline-flex items-center justify-center font-medium select-none whitespace-nowrap rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8D96B] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

    const sizeStyles = {
      sm: 'text-xs h-9 px-4 min-h-[36px] gap-1.5',
      md: 'text-sm h-11 px-5 min-h-[44px] gap-2',
      lg: 'text-base h-13 px-6 min-h-[52px] gap-2.5',
    };

    const variantStyles = {
      primary:
        'bg-[#123B35] text-[#F3F1EA] hover:bg-[#0E2E29] shadow-sm hover:shadow active:bg-[#091F1C] border border-[#16463F]',
      accent:
        'bg-[#B8D96B] text-[#151817] hover:bg-[#A6C958] font-semibold shadow-sm hover:shadow active:bg-[#97BA4A] border border-[#A4C756]',
      secondary:
        'bg-surface-elevated text-primary hover:bg-[#EDE9DE] dark:hover:bg-[#252E2B] border border-theme active:bg-[#E3DFD2]',
      outline:
        'bg-transparent text-primary hover:bg-surface-elevated border border-theme active:bg-surface-elevated',
      ghost:
        'bg-transparent text-primary hover:bg-surface-elevated border border-transparent active:bg-surface',
      danger:
        'bg-[#C53030] text-white hover:bg-[#B02828] active:bg-[#992222] border border-[#A82626]',
    };

    const errorStyles = isError
      ? 'border-[#C53030] ring-1 ring-[#C53030] bg-[#FDECEB] dark:bg-[#3D1919] text-[#C53030]'
      : '';

    return (
      <button
        ref={ref}
        id={id}
        disabled={disabled || isLoading}
        className={`
          ${baseStyles}
          ${sizeStyles[size]}
          ${errorStyles || variantStyles[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>Загрузка...</span>
          </>
        ) : isError ? (
          <>
            <AlertCircle className="w-4 h-4 text-current" />
            <span>{children || 'Ошибка'}</span>
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
