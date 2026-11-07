import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useLanguage } from '../../context/LanguageContext';

/** Small note above the phone tabs (or in the desktop corner) while there is no connection. */
export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="anim-drop fixed bottom-[calc(env(safe-area-inset-bottom,0px)+80px)] desk:bottom-5 start-3 desk:start-5 end-3 desk:end-auto z-50 flex items-center gap-2 px-3 py-2 bg-accent text-ink border-2 border-ink rounded-xl shadow-hard-3 text-sm font-extrabold"
    >
      <WifiOff aria-hidden="true" className="w-4 h-4 shrink-0" />
      <span className="min-w-0">{t.screens.offline.message}</span>
    </div>
  );
};
