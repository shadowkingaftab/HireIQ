import { Component } from "react";

/**
 * Top-level render guard. Mounted in main.jsx above all providers.
 * Keeps the original class-based API ({children}) unchanged.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.error("[ProofHire] Uncaught render error:", error);
    }
  }
  handleReload = () => window.location.reload();

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-canvas px-6 text-center">
          <div
            className="h-10 w-10 rounded-full border-2 border-line-strong"
            aria-hidden="true"
          />
          <div>
            <h1 className="text-section">Something went wrong</h1>
            <p className="mt-1 max-w-sm text-body-sm text-ink-muted">
              The interface hit an unexpected error. Reloading usually resolves it.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReload}
            className="rounded-lg bg-intel px-4 py-2 text-body-sm font-medium text-intel-contrast transition-colors hover:bg-intel-firm"
          >
            Reload ProofHire
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
