import React from 'react';

/** Placeholder sheet while something loads. The pulse stops for reduced motion. */
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-paper-dot rounded-2xl ${className}`} aria-hidden="true" />
);
