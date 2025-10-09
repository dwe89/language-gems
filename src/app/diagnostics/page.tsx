'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runDiagnostics = () => {
      const results: any = {
        timestamp: new Date().toISOString(),
        browser: {},
        features: {},
        network: {},
        errors: []
      };

      try {
        // Browser information
        results.browser = {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          cookiesEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
          vendor: navigator.vendor,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          windowSize: `${window.innerWidth}x${window.innerHeight}`,
          colorDepth: window.screen.colorDepth,
          pixelRatio: window.devicePixelRatio
        };

        // Feature detection
        results.features = {
          localStorage: typeof localStorage !== 'undefined',
          sessionStorage: typeof sessionStorage !== 'undefined',
          indexedDB: typeof indexedDB !== 'undefined',
          serviceWorker: 'serviceWorker' in navigator,
          webGL: (() => {
            try {
              const canvas = document.createElement('canvas');
              return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
            } catch (e) {
              return false;
            }
          })(),
          webAudio: typeof AudioContext !== 'undefined' || typeof (window as any).webkitAudioContext !== 'undefined',
          fetch: typeof fetch !== 'undefined',
          promises: typeof Promise !== 'undefined',
          es6: (() => {
            try {
              eval('const test = () => {};');
              return true;
            } catch (e) {
              return false;
            }
          })()
        };

        // Network information
        const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
        if (connection) {
          results.network = {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData
          };
        }

        // Test localStorage
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
        } catch (e) {
          results.errors.push({
            type: 'localStorage',
            message: e instanceof Error ? e.message : 'Unknown error'
          });
        }

        // Test sessionStorage
        try {
          sessionStorage.setItem('test', 'test');
          sessionStorage.removeItem('test');
        } catch (e) {
          results.errors.push({
            type: 'sessionStorage',
            message: e instanceof Error ? e.message : 'Unknown error'
          });
        }

        // Check for common issues
        if (!results.browser.cookiesEnabled) {
          results.errors.push({
            type: 'cookies',
            message: 'Cookies are disabled. This may prevent login and game progress tracking.'
          });
        }

        if (!results.features.localStorage) {
          results.errors.push({
            type: 'localStorage',
            message: 'localStorage is not available. This may prevent game settings from being saved.'
          });
        }

      } catch (error) {
        results.errors.push({
          type: 'general',
          message: error instanceof Error ? error.message : 'Unknown error during diagnostics'
        });
      }

      setDiagnostics(results);
      setLoading(false);

      // Log to console for debugging
      console.log('🔍 [DIAGNOSTICS] Full report:', results);
    };

    runDiagnostics();
  }, []);

  const getStatusIcon = (value: boolean) => {
    return value ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Running diagnostics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">System Diagnostics</h1>
          <p className="text-gray-600 mb-6">
            This page helps identify browser compatibility issues
          </p>

          {/* Errors Section */}
          {diagnostics?.errors && diagnostics.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h2 className="font-semibold text-red-800 mb-2">Issues Detected</h2>
                  <ul className="space-y-2">
                    {diagnostics.errors.map((error: any, index: number) => (
                      <li key={index} className="text-sm text-red-700">
                        <strong>{error.type}:</strong> {error.message}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Browser Information */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Browser Information</h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><strong>Platform:</strong> {diagnostics?.browser.platform}</div>
                <div><strong>Language:</strong> {diagnostics?.browser.language}</div>
                <div><strong>Screen:</strong> {diagnostics?.browser.screenResolution}</div>
                <div><strong>Window:</strong> {diagnostics?.browser.windowSize}</div>
                <div><strong>Pixel Ratio:</strong> {diagnostics?.browser.pixelRatio}</div>
                <div><strong>Color Depth:</strong> {diagnostics?.browser.colorDepth}-bit</div>
              </div>
              <div className="mt-4">
                <strong>User Agent:</strong>
                <div className="text-xs font-mono bg-white p-2 rounded mt-1 break-all">
                  {diagnostics?.browser.userAgent}
                </div>
              </div>
            </div>
          </div>

          {/* Feature Support */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Feature Support</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(diagnostics?.features || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    {getStatusIcon(value as boolean)}
                    <span className="text-sm">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Network Information */}
          {diagnostics?.network && Object.keys(diagnostics.network).length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Network Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(diagnostics.network).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {String(value)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Refresh Diagnostics
            </button>
            <button
              onClick={() => {
                const dataStr = JSON.stringify(diagnostics, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `diagnostics-${new Date().toISOString()}.json`;
                link.click();
              }}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Download Report
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Timestamp: {diagnostics?.timestamp}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

