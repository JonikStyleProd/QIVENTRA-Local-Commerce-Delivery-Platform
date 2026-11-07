import React, { ErrorInfo, ReactNode } from 'react';
import { translations, Language } from '../../i18n/translations';
import { MadeByView } from '../collage/MadeBy';
import { ErrorState } from './ErrorState';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/** This screen sits outside every provider, so it reads the saved language itself. */
const savedLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('qiventra_language');
    if (saved === 'en' || saved === 'he' || saved === 'ru') return saved;
  } catch {
    // Without storage the default language is fine.
  }
  return 'ru';
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[QIVENTRA] Uncaught UI error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      const copy = translations[savedLanguage()].screens;
      return (
        <div className="paper-dots min-h-screen flex flex-col items-center justify-center gap-8 p-6 bg-paper text-ink">
          <ErrorState
            title={copy.error.title}
            message={copy.error.message}
            retryLabel={copy.error.retry}
            onRetry={this.handleReset}
          />
          <MadeByView copy={copy.madeBy} className="justify-center text-center" />
        </div>
      );
    }

    return this.props.children;
  }
}
