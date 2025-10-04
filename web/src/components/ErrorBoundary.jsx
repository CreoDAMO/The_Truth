
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 text-white p-4">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-md w-full">
            <div className="text-5xl mb-4 text-center">⚠️</div>
            <h2 className="text-2xl font-bold mb-4 text-center">Something went wrong</h2>
            <p className="text-gray-300 mb-6 text-center">
              We encountered an error. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
