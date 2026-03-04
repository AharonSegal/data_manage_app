import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-6">
          <div className="max-w-md w-full text-center space-y-5">
            <div className="flex justify-center">
              <div className="h-14 w-14 rounded-full bg-[var(--color-error)]/10 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-[var(--color-error)]" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
                Something went wrong
              </h1>
              <p className="text-sm text-[var(--color-text-secondary)]">
                An unexpected error occurred. Try refreshing the page.
              </p>
              {this.state.error && (
                <pre className="mt-3 text-left text-xs bg-[var(--color-sidebar-bg)] border border-[var(--color-border)] rounded-md p-3 overflow-x-auto text-[var(--color-text-secondary)]">
                  {this.state.error.message}
                </pre>
              )}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-brand)] text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm font-medium hover:bg-[var(--color-sidebar-hover)] transition-colors"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
