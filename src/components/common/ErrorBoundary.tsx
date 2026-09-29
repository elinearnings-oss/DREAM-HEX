import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in VELORA app:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      // Clear app state keys in case of corrupted local storage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('velora_')) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090b0e] text-slate-200 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0e131b] border border-[#232e40] rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-4 font-mono font-bold text-xl">
              !
            </div>
            <h2 className="text-xl font-bold text-white mb-2 font-mono">
              VELORA Experience Recovered
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              A temporary interface issue occurred. You can safely reload the application or reset stored preferences to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-rose-600/20"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2.5 bg-[#171f2b] hover:bg-[#202b3c] text-slate-300 text-sm font-medium rounded-lg border border-[#2a374c] transition-colors"
              >
                Reset App Data
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
