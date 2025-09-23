"use client";

import { useState } from 'react';

export default function TestBrevoPage() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testBrevoIntegration = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/coming-soon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: 'Test',
          lastName: 'User',
          source: 'test-page'
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Network error', details: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Test Brevo Integration</h1>
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter test email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={testBrevoIntegration}
            disabled={loading || !email}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Brevo Integration'}
          </button>
        </div>

        {result && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-600">
          <p><strong>This page tests:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Supabase database insertion</li>
            <li>Brevo API contact creation</li>
            <li>Error handling</li>
          </ul>
          <p className="mt-4">
            <strong>Note:</strong> Remove this page before going to production!
          </p>
        </div>
      </div>
    </div>
  );
}
