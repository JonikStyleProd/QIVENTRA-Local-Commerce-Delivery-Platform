import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

/** Sticky note with a short handwritten title, a plain explanation and one way out. */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`anim-in max-w-[520px] mx-auto px-[18px] py-7 desk:px-7 desk:py-10 text-center bg-white border-[3px] border-ink rounded-[20px] desk:rounded-3xl shadow-hard-5 desk:shadow-hard-6 ${className}`}
      style={{ rotate: '-1deg' }}
    >
      {icon && <div className="flex justify-center mb-2 text-ink-3">{icon}</div>}
      <h2 className="hand mb-1 text-[34px] desk:text-[40px] leading-tight text-action">{title}</h2>
      <p className="mb-4 desk:mb-5 font-bold">{description}</p>
      {actionText && onAction && (
        <Button variant="secondary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
