import React from 'react';
import { MadeByView } from '../components/collage/MadeBy';
import { ErrorState } from '../components/ui/ErrorState';
import { useLanguage } from '../context/LanguageContext';

/** A screen that failed to render or load. Its code may be from an older build, so reload is the way out. */
export const RouteError: React.FC = () => {
  const { t } = useLanguage();
  const copy = t.screens;

  return (
    <div className="paper-dots min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-paper text-ink">
      <ErrorState
        title={copy.error.title}
        message={copy.error.message}
        retryLabel={copy.error.retry}
        onRetry={() => window.location.reload()}
      />
      <MadeByView copy={copy.madeBy} className="justify-center text-center" />
    </div>
  );
};
