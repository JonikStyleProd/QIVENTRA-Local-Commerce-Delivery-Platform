import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string;
}

/** Square outlined icon button: 44px, the same in the header, dialogs and the chat. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({ icon, className = '', ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={`chip-tilt relative grid place-items-center w-11 h-11 shrink-0 bg-card text-ink border-2 border-ink rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {icon}
  </button>
));

IconButton.displayName = 'IconButton';
