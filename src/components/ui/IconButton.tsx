import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const sizeMap = {
      sm: 'w-9 h-9 min-w-[36px] min-h-[36px]',
      md: 'w-11 h-11 min-w-[44px] min-h-[44px]',
      lg: 'w-13 h-13 min-w-[52px] min-h-[52px]',
    };

    const variantStyles = {
      primary: 'bg-[#123B35] text-[#F3F1EA] hover:bg-[#0E2E29] border border-[#16463F]',
      accent: 'bg-[#B8D96B] text-[#151817] hover:bg-[#A6C958] border border-[#A4C756]',
      secondary: 'bg-surface-elevated text-primary hover:bg-[#EDE9DE] dark:hover:bg-[#252E2B] border border-theme',
      outline: 'bg-transparent text-primary hover:bg-surface-elevated border border-theme',
      ghost: 'bg-transparent text-primary hover:bg-surface-elevated border border-transparent',
    };

    return (
      <button
        ref={ref}
        id={id}
        disabled={disabled || isLoading}
        className={`
          relative inline-flex items-center justify-center rounded-xl transition-all duration-150 select-none
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8D96B] focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed active:scale-95
          ${sizeMap[size]}
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          icon
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
