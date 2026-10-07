import { Component } from "react";

/**
 * ErrorBoundary - catches JavaScript errors in child components.
 * Prevents white-screen crashes by showing a fallback UI with glassmorphism.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Log to error reporting service in production
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 grid-pattern">
          <div className="rounded-2xl bg-brand-surface/80 backdrop-blur-xl border border-white/10 p-8 text-center max-w-md w-full shadow-2xl shadow-black/30">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500/20 to-rose-600/20 border border-rose-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L18.203 10.5a2.25 2.25 0 00-1.948-1.125H6.744a2.25 2.25 0 00-1.948 1.125L2.697 19.8z" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-white mb-2">Something went wrong</h1>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              An unexpected error occurred. Don't worry, your data is safe.
            </p>

            {this.state.error && (
              <details className="text-left rounded-xl bg-brand-surface/50 border border-white/5 p-4 mb-4 text-xs overflow-hidden">
                <summary className="cursor-pointer font-medium text-slate-300 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m-4 8l4-4m0 0l4 4m-4-4h18" />
                  </svg>
                  Error details
                </summary>
                <pre className="mt-3 whitespace-pre-wrap text-rose-300 font-mono text-[10px] overflow-auto max-h-40 leading-relaxed">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-md shadow-violet-600/30 transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-.001h4.992M4.031 14.978a8.946 8.946 0 012.784-8.015 9.002 9.002 0 0110.37-.042 8.947 8.947 0 012.786 8.059 8.996 8.996 0 01-.391 2.71 8.946 8.946 0 01-2.78 8.02 8.965 8.965 0 01-10.402.177 8.926 8.926 0 01-2.847-8.02z" />
                </svg>
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-semibold transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
