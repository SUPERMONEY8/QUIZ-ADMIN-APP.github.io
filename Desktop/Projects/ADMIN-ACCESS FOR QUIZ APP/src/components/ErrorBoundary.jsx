import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Check if it's a Supabase config error
      const isSupabaseError = this.state.error?.message?.includes('Supabase') || 
                             this.state.error?.message?.includes('VITE_SUPABASE');

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Application Error
            </h2>
            {isSupabaseError ? (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Supabase configuration is missing. Please set up your environment variables.
                </p>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4">
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                    Required Environment Variables:
                  </p>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• VITE_SUPABASE_URL</li>
                    <li>• VITE_SUPABASE_ANON_KEY</li>
                  </ul>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-3">
                    <strong>For Netlify:</strong> Site settings → Environment variables → Add variables
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    <strong>For Vercel:</strong> Project settings → Environment variables → Add variables
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Something went wrong. Please refresh the page or contact support.
                </p>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Error Details
                  </summary>
                  <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 rounded overflow-auto max-h-40">
                    {this.state.error?.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

