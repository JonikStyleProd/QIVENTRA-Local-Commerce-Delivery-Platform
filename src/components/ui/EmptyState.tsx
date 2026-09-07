import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

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
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-surface border border-theme ${className}`}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-surface-elevated text-secondary mb-4 border border-theme">
        {icon || <PackageOpen className="w-8 h-8 text-muted" />}
      </div>
      <h3 className="text-lg font-bold text-primary mb-1.5">{title}</h3>
      <p className="text-sm text-secondary max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
