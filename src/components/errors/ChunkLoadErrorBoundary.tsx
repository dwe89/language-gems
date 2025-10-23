/**
 * ChunkLoadErrorBoundary
 * 
 * A specialized error boundary that catches ChunkLoadError and similar
 * webpack chunk loading failures. Provides automatic recovery via page reload.
 * 
 * This is especially useful for:
 * - Handling stale chunks after deployments
 * - Recovering from CDN/cache mismatches
 * - Platform-specific loading issues (e.g., Windows vs Mac)
 */

'use client';

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  isChunkError: boolean;
  reloadAttempted: boolean;
}

class ChunkLoadErrorBoundary extends Component<Props, State> {
  private reloadTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isChunkError: false,
      reloadAttempted: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Check if this is a chunk loading error
    const isChunkError = 
      error.name === 'ChunkLoadError' ||
      error.message.includes('Loading chunk') ||
      error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('ChunkLoadError');

    return {
      hasError: true,
      error,
      isChunkError,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ChunkLoadErrorBoundary] Caught error:', error, errorInfo);
    
    this.setState({ errorInfo });

    // If it's a chunk error and we haven't attempted reload yet
    if (this.state.isChunkError && !this.state.reloadAttempted) {
      const hasReloadedKey = 'chunk-error-boundary-reload';
      const hasReloaded = sessionStorage.getItem(hasReloadedKey);
      
      if (!hasReloaded) {
        console.log('[ChunkLoadErrorBoundary] Chunk load error detected, scheduling page reload...');
        
        // Set flag to prevent infinite reload loop
        sessionStorage.setItem(hasReloadedKey, Date.now().toString());
        this.setState({ reloadAttempted: true });
        
        // Wait a moment for any pending requests, then reload
        this.reloadTimeoutId = setTimeout(() => {
          console.log('[ChunkLoadErrorBoundary] Reloading page...');
          window.location.reload();
        }, 1500);
      } else {
        // Check if reload was attempted recently (within last 5 minutes)
        const reloadTime = parseInt(hasReloaded, 10);
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        
        if (reloadTime < fiveMinutesAgo) {
          // Old reload attempt, clear and try again
          sessionStorage.removeItem(hasReloadedKey);
        }
      }
    }

    // Log to external error tracking if available
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        contexts: {
          errorBoundary: {
            componentStack: errorInfo.componentStack,
            isChunkError: this.state.isChunkError,
          },
        },
      });
    }
  }

  componentWillUnmount() {
    if (this.reloadTimeoutId) {
      clearTimeout(this.reloadTimeoutId);
    }
  }

  handleManualReload = () => {
    sessionStorage.setItem('chunk-error-boundary-reload', Date.now().toString());
    window.location.reload();
  };

  handleClearCache = async () => {
    try {
      // Clear service worker cache
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      }
      
      // Clear cache storage
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }
      
      // Reload after cache clear
      this.handleManualReload();
    } catch (error) {
      console.error('Failed to clear cache:', error);
      this.handleManualReload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      if (this.state.isChunkError) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-100 rounded-full">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {this.state.reloadAttempted ? 'Updating...' : 'Update Required'}
                </h1>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-gray-600">
                  {this.state.reloadAttempted
                    ? 'We\'re refreshing the page to load the latest version...'
                    : 'A new version of this page is available. We need to reload to apply the updates.'}
                </p>
                
                {this.state.reloadAttempted && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>This will only take a moment...</span>
                  </div>
                )}
              </div>

              {!this.state.reloadAttempted && (
                <div className="space-y-3">
                  <button
                    onClick={this.handleManualReload}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Reload Page
                  </button>
                  
                  <button
                    onClick={this.handleClearCache}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    Clear Cache & Reload
                  </button>

                  <details className="mt-4">
                    <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                      Technical Details
                    </summary>
                    <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono text-gray-600 overflow-auto max-h-32">
                      {this.state.error?.message || 'No error message available'}
                    </div>
                  </details>
                </div>
              )}
            </div>
          </div>
        );
      }

      // Generic error fallback
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-900 via-pink-900 to-purple-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Something Went Wrong</h1>
            </div>

            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Reload Page
            </button>

            <details className="mt-4">
              <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                Error Details
              </summary>
              <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono text-gray-600 overflow-auto max-h-48">
                <div className="mb-2">
                  <strong>Error:</strong> {this.state.error?.message || 'Unknown error'}
                </div>
                {this.state.errorInfo?.componentStack && (
                  <div>
                    <strong>Component Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChunkLoadErrorBoundary;
