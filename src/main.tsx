import { StrictMode, Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical rendering error caught by RootErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07241B] text-[#FAF8F5] flex items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-[#0b3d2e] border border-[#C9A24A]/40 rounded-3xl p-8 shadow-2xl text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-[#C9A24A]/20 border border-[#C9A24A]/50 flex items-center justify-center text-3xl">
              🏔️
            </div>
            <h1 className="text-2xl font-bold font-serif text-[#C9A24A]">Cool J Expeditions</h1>
            <p className="text-sm text-gray-300">
              The expedition portal encountered a temporary rendering exception.
            </p>
            {this.state.error?.message && (
              <div className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-red-300 font-mono text-left overflow-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 bg-[#C9A24A] hover:bg-[#b89139] text-[#07241B] font-bold rounded-xl text-sm transition-colors cursor-pointer shadow-lg"
              >
                Reload Portal
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Global safety catch for unhandled exceptions
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    console.warn('Captured window error event:', event.message);
  });
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Captured unhandled promise rejection:', event.reason);
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  try {
    createRoot(rootElement).render(
      <RootErrorBoundary>
        <App />
      </RootErrorBoundary>
    );
    console.info("Cool J Expeditions mounted successfully.");
  } catch (err: any) {
    console.error("Mount error:", err);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #07241B; color: #FAF8F5; font-family: sans-serif; padding: 24px;">
        <div style="background-color: #0b3d2e; border: 1px solid #C9A24A; border-radius: 20px; padding: 32px; max-width: 500px; text-align: center;">
          <h2 style="color: #C9A24A; margin-bottom: 12px;">Portal Mount Notice</h2>
          <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 16px;">${err?.message || "Startup initialization error."}</p>
          <button onclick="window.location.reload()" style="background-color: #C9A24A; color: #07241B; border: none; padding: 10px 24px; font-weight: bold; border-radius: 12px; cursor: pointer;">Reload</button>
        </div>
      </div>
    `;
  }
}
