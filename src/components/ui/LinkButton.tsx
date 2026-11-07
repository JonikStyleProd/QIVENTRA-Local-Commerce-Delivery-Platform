import React from 'react';
import { Link, LinkProps } from 'react-router';
import { ButtonSize, ButtonVariant, buttonClasses } from './Button';

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
}

/** A real link that looks like a button: it opens in a new tab and shows its address. */
export const LinkButton: React.FC<LinkButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  className = '',
  children,
  ...props
}) => (
  <Link {...props} className={`${buttonClasses(variant, size, fullWidth)} no-underline ${className}`}>
    {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
    <span>{children}</span>
  </Link>
);
