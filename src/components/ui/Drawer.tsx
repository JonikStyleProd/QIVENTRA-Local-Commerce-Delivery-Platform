import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useDialogFocus } from '../collage/useDialogFocus';
import { IconButton } from './IconButton';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

/** Side sheet on the inline-end edge; full width on a phone. */
export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, subtitle, children }) => {
  const { t } = useLanguage();
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);

  useDialogFocus(sheetRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-[rgba(30,30,30,0.6)]" onClick={onClose} aria-hidden="true" />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className="anim-in relative ms-auto flex flex-col w-full max-w-md h-[100dvh] paper-dots bg-paper text-ink border-s-[3px] border-ink"
      >
        <div className="flex items-start justify-between gap-3 px-4 py-3 desk:px-5 bg-card border-b-[3px] border-ink shrink-0">
          <div className="min-w-0">
            {title && (
              <h2 id={titleId} className="text-xl font-black tracking-tight leading-tight">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-sm font-bold text-ink-2">{subtitle}</p>}
          </div>
          <IconButton
            icon={<X aria-hidden="true" className="w-5 h-5" />}
            onClick={onClose}
            aria-label={t.screens.common.close}
          />
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 desk:p-5">{children}</div>
      </div>
    </div>,
    document.body
  );
};
