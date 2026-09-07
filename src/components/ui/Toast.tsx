import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-[#1E824C] dark:text-[#48BB78] shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-[#C53030] dark:text-[#FC8181] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#B7791F] dark:text-[#F6AD55] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#123B35] dark:text-[#B8D96B] shrink-0" />,
  };

  const borderMap = {
    success: 'border-s-4 border-s-[#1E824C]',
    error: 'border-s-4 border-s-[#C53030]',
    warning: 'border-s-4 border-s-[#B7791F]',
    info: 'border-s-4 border-s-[#B8D96B]',
  };

  return (
    <div
      role="alert"
      className={`
        flex items-start justify-between gap-3 p-3.5 rounded-xl bg-surface border border-theme shadow-lg
        text-primary transition-all duration-200 animate-in fade-in slide-in-from-bottom-2
        ${borderMap[toast.type]}
      `}
    >
      <div className="flex items-start gap-3">
        {iconMap[toast.type]}
        <div className="flex flex-col">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.message && <p className="text-xs text-secondary mt-0.5">{toast.message}</p>}
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-1 rounded-lg text-muted hover:text-primary hover:bg-surface-elevated transition shrink-0"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
