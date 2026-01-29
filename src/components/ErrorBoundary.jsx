// src/components/ErrorBoundary.jsx
import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    
    // Log error to console (in production, send to error tracking service)
    console.error("Error caught by boundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page or go back home.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="bg-gray-100 rounded-xl p-4 mb-6 text-left overflow-auto max-h-40">
                <p className="text-red-600 font-mono text-sm">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-xs text-gray-600 mt-2">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold transition"
              >
                <RefreshCw size={18} />
                Reload Page
              </button>
              
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-white border-2 border-pink-500 text-pink-600 hover:bg-pink-50 px-6 py-3 rounded-full font-semibold transition"
              >
                <Home size={18} />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
