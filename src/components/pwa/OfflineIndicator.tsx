import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 md:bottom-5 left-4 z-50 flex items-center gap-2 rounded-xl bg-ink text-paper px-3.5 py-2 text-xs font-medium shadow-xl border border-[#2B3532] animate-bounce"
    >
      <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
      <WifiOff className="w-3.5 h-3.5 text-accent-on-ink" />
      <span>Офлайн режим — используются сохраненные данные каталога</span>
    </div>
  );
};
