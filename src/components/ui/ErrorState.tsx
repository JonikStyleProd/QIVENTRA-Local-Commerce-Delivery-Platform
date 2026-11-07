import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

/** Sticky note for a failure: what happened and one way out. Takes its text from the caller. */
export const ErrorState: React.FC<ErrorStateProps> = ({ title, message, retryLabel, onRetry, className = '' }) => (
  <div
    role="alert"
    className={`anim-in max-w-[520px] mx-auto px-[18px] py-7 desk:px-7 desk:py-10 text-center bg-tint-food border-[3px] border-ink rounded-[20px] desk:rounded-3xl shadow-hard-5 desk:shadow-hard-6 ${className}`}
    style={{ rotate: '-1deg' }}
  >
    <h1 className="hand mb-1 text-[40px] leading-tight text-action-text">{title}</h1>
    <p className="mb-4 desk:mb-5 font-bold">{message}</p>
    {onRetry && retryLabel && (
      <Button variant="secondary" size="md" leftIcon={<RotateCcw aria-hidden="true" className="w-4 h-4" />} onClick={onRetry}>
        {retryLabel}
      </Button>
    )}
  </div>
);
