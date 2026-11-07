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
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FFF8EC] text-[#1E1E1E]">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white shadow-xl border border-[#E9DFCB] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#1E1E1E] text-[#FFD84D] flex items-center justify-center mx-auto text-xl font-bold">
              Q
            </div>
            <h1 className="text-xl font-extrabold text-[#1E1E1E]">
              Что-то пошло не так
            </h1>
            <p className="text-xs text-[#5A554C] leading-relaxed">
              Произошла непредвиденная ошибка при отображении страницы. Нажмите кнопку ниже для перезагрузки.
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-[#1E1E1E] hover:bg-[#1E1E1E] text-[#FFF8EC] font-bold text-xs transition active:scale-98 shadow-sm cursor-pointer"
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
