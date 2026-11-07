import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

const ICON = {
  success: <CheckCircle2 aria-hidden="true" className="w-5 h-5 text-success shrink-0" />,
  error: <AlertCircle aria-hidden="true" className="w-5 h-5 text-danger shrink-0" />,
  warning: <AlertTriangle aria-hidden="true" className="w-5 h-5 text-warn shrink-0" />,
  info: <Info aria-hidden="true" className="w-5 h-5 text-link-text shrink-0" />,
};

const TINT = {
  success: 'bg-success-bg',
  error: 'bg-danger-bg',
  warning: 'bg-warn-bg',
  info: 'bg-tint-health',
};

/** Note stuck to the corner of the screen. */
export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { t } = useLanguage();
  return (
    <div
      role="alert"
      className={`anim-drop flex items-start justify-between gap-2 p-2.5 ps-3 text-ink border-2 border-ink rounded-2xl shadow-hard-3 ${TINT[toast.type]}`}
    >
      <div className="flex items-start gap-2.5 min-w-0 pt-1.5">
        {ICON[toast.type]}
        <div className="min-w-0">
          <p className="font-black leading-snug break-words">{toast.title}</p>
          {toast.message && <p className="mt-0.5 text-sm font-bold text-ink-2 break-words">{toast.message}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={t.screens.common.close}
        className="grid place-items-center w-11 h-11 shrink-0 rounded-xl cursor-pointer"
      >
        <X aria-hidden="true" className="w-4 h-4" />
      </button>
    </div>
  );
};
