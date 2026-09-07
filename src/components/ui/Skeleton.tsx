import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    rect: 'rounded-2xl',
    circle: 'rounded-full',
  };

  return (
    <div
      className={`animate-pulse bg-surface-elevated/80 dark:bg-[#252E2B]/60 ${variantStyles[variant]} ${className}`}
      aria-hidden="true"
    />
  );
};
