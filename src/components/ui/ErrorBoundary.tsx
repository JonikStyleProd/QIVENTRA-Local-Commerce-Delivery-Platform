import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

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
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-paper text-ink">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-card shadow-xl border border-paper-dot text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-ink text-accent-on-ink flex items-center justify-center mx-auto text-xl font-bold">
              Q
            </div>
            <h1 className="text-xl font-extrabold text-ink">
              Что-то пошло не так
            </h1>
            <p className="text-xs text-ink-2 leading-relaxed">
              Произошла непредвиденная ошибка при отображении страницы. Нажмите кнопку ниже для перезагрузки.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-ink hover:bg-ink text-paper font-bold text-xs transition active:scale-98 shadow-sm cursor-pointer"
            >
              Перезагрузить приложение
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
