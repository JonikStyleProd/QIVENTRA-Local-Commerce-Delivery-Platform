import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'right' | 'bottom';
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  width?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'right',
  title,
  subtitle,
  children,
  width = 'max-w-md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isBottom = position === 'bottom';

  return (
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container with CSS Logical Properties */}
      <div
        className={`
          relative z-10 bg-surface border-theme shadow-2xl flex flex-col
          transition-transform duration-300 ease-out
          ${
            isBottom
              ? 'mt-auto w-full max-h-[85vh] rounded-t-3xl border-t animate-in slide-in-from-bottom'
              : `ms-auto h-full w-full ${width} border-s animate-in slide-in-from-end`
          }
        `}
      >
        {/* Handle for bottom sheet */}
        {isBottom && (
          <div className="w-12 h-1.5 bg-muted/40 rounded-full mx-auto mt-3 mb-1" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-theme shrink-0">
          <div>
            {title && (
              <h3 className="text-lg font-bold tracking-tight text-primary">{title}</h3>
            )}
            {subtitle && (
              <p className="text-xs text-secondary mt-0.5">{subtitle}</p>
            )}
          </div>
          <IconButton
            size="sm"
            variant="ghost"
            icon={<X className="w-4 h-4" />}
            onClick={onClose}
            aria-label="Close"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
};
