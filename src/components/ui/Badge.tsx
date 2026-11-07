import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pistachio' | 'mineral' | 'success' | 'warning' | 'error' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 font-medium rounded-full',
    md: 'text-xs px-3 py-1 font-medium rounded-full',
  };

  const variantStyles = {
    pistachio: 'bg-[#FFD84D] text-[#1E1E1E] font-semibold',
    mineral: 'bg-[#1E1E1E] text-[#FFF8EC]',
    success: 'bg-[#E8F5EE] text-[#1E824C] dark:bg-[#132E20] dark:text-[#48BB78]',
    warning: 'bg-[#FEF8E7] text-[#B7791F] dark:bg-[#332612] dark:text-[#F6AD55]',
    error: 'bg-[#FDECEB] text-[#C53030] dark:bg-[#3D1919] dark:text-[#FC8181]',
    neutral: 'bg-surface-elevated text-secondary border border-theme',
    outline: 'bg-transparent text-primary border border-theme',
  };

  const dotColor = {
    pistachio: 'bg-[#1E1E1E]',
    mineral: 'bg-[#FFD84D]',
    success: 'bg-[#1E824C] dark:bg-[#48BB78]',
    warning: 'bg-[#B7791F] dark:bg-[#F6AD55]',
    error: 'bg-[#C53030] dark:bg-[#FC8181]',
    neutral: 'bg-muted',
    outline: 'bg-[#1E1E1E]',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 whitespace-nowrap select-none transition-colors
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor[variant]}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export * from './CardBadges';
