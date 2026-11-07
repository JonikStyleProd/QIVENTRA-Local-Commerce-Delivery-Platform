import React from 'react';
import { useLanguage } from '../context/LanguageContext';

/** Shown once, while the first screen's code is on its way. */
export const RouteLoading: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div role="status" className="paper-dots grid place-items-center min-h-screen p-6 bg-paper text-ink">
      <p className="hand text-[34px] text-action">{t.demo.loading}</p>
    </div>
  );
};
