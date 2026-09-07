import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Suppress when already installed as standalone
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="inline-flex items-center gap-2 rounded-xl bg-[#B8D96B] px-3.5 py-2 text-xs font-semibold text-[#151817] shadow-xs hover:bg-[#A6C958] transition-all active:scale-95 select-none"
        aria-label="Установить приложение QIVENTRA"
      >
        <Download className="w-4 h-4 text-[#151817]" />
        <span>Установить PWA</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-theme bg-surface-elevated px-3 py-1.5 text-xs font-medium text-primary hover:bg-surface transition select-none"
          aria-label="Установить на iPhone"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#123B35] dark:text-[#B8D96B]" />
          <span>Установить на iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-3xl bg-surface p-6 shadow-2xl border border-theme text-left animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#123B35] text-[#F3F1EA] flex items-center justify-center font-bold text-sm">
                    Q
                  </div>
                  <h3 className="text-base font-bold text-primary">Установка на iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-muted hover:text-primary transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-secondary leading-relaxed">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-elevated border border-theme">
                  <Share className="w-4 h-4 text-[#123B35] dark:text-[#B8D96B] shrink-0 mt-0.5" />
                  <p>1. Нажмите кнопку <strong>«Поделиться»</strong> в нижней панели Safari.</p>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-surface-elevated border border-theme">
                  <PlusSquare className="w-4 h-4 text-[#123B35] dark:text-[#B8D96B] shrink-0 mt-0.5" />
                  <p>2. Прокрутите список и выберите <strong>«На экран "Домой"»</strong>.</p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#123B35] text-[#F3F1EA] py-2.5 text-xs font-semibold hover:bg-[#0E2E29] transition"
              >
                Понятно
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
