import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Tape } from '../collage/Tape';
import { useDialogFocus } from '../collage/useDialogFocus';
import { IconButton } from './IconButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  /** Short handwritten note above the title. */
  note?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const MAX_WIDTH = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

/**
 * Sheet taped over the dimmed page. Rendered in a portal because many callers sit inside tilted
 * cards, where a transform would otherwise trap fixed positioning.
 */
export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, note, subtitle, children, maxWidth = 'md' }) => {
  const { t } = useLanguage();
  const titleId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);

  useDialogFocus(sheetRef, isOpen);

  useEffect(() => {
    if (!isOpen) return;
    // Capture phase, so Escape closes only this dialog when it opens over another one (the chat).
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end desk:items-center justify-center p-3 desk:p-6">
      <div className="fixed inset-0 bg-[rgba(30,30,30,0.6)]" onClick={onClose} aria-hidden="true" />

      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        className={`anim-drop relative w-full ${MAX_WIDTH[maxWidth]} mb-[env(safe-area-inset-bottom,0px)] bg-card text-ink border-[3px] border-ink rounded-3xl shadow-hard-6 max-h-[88dvh] flex flex-col`}
      >
        <Tape tone="yellow" />
        <div className="flex items-start justify-between gap-3 px-4 pt-4 desk:px-6 desk:pt-6 shrink-0">
          <div className="min-w-0">
            {note && <p className="hand text-2xl leading-none text-action">{note}</p>}
            {title && (
              <h2 id={titleId} className="text-2xl desk:text-[28px] font-black tracking-tight leading-tight">
                {title}
              </h2>
            )}
            {subtitle && <p className="mt-1 text-sm font-bold text-ink-2">{subtitle}</p>}
          </div>
          <IconButton
            icon={<X aria-hidden="true" className="w-5 h-5" />}
            onClick={onClose}
            aria-label={t.screens.common.close}
          />
        </div>

        <div className="mt-3 px-4 pb-4 desk:px-6 desk:pb-6 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>,
    document.body
  );
};
