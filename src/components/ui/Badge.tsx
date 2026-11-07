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
    pistachio: 'bg-accent text-ink font-semibold',
    mineral: 'bg-ink text-paper',
    success: 'bg-success-bg text-success',
    warning: 'bg-warn-bg text-warn',
    error: 'bg-danger-bg text-danger',
    neutral: 'bg-surface-elevated text-secondary border border-theme',
    outline: 'bg-transparent text-primary border border-theme',
  };

  const dotColor = {
    pistachio: 'bg-ink',
    mineral: 'bg-accent',
    success: 'bg-[#1E824C]',
    warning: 'bg-[#B7791F]',
    error: 'bg-[#C53030]',
    neutral: 'bg-muted',
    outline: 'bg-ink',
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
