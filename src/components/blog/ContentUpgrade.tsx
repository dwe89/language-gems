'use client';

import { useState } from 'react';
import { Download, CheckCircle, Loader } from 'lucide-react';

interface ContentUpgradeProps {
  title: string;
  description: string;
  downloadUrl?: string;
  resourceName: string;
}

export default function ContentUpgrade({ 
  title, 
  description, 
  downloadUrl,
  resourceName 
}: ContentUpgradeProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Subscribe to blog
      await fetch('/api/blog/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      setIsSuccess(true);
      
      // Trigger download if URL provided
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 text-center mb-2">
          Check Your Email!
        </h3>
        <p className="text-green-700 text-center">
          We've sent you the {resourceName}. Check your inbox (and spam folder) for the download link.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg my-12">
      <div className="flex items-start mb-6">
        <div className="flex-shrink-0 bg-blue-600 rounded-full p-3 mr-4">
          <Download className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {title}
          </h3>
          <p className="text-slate-700">
            {description}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="upgrade-email" className="block text-sm font-medium text-slate-700 mb-2">
            Enter your email to download:
          </label>
          <input
            id="upgrade-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teacher@school.com"
            required
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Download className="h-5 w-5 mr-2" />
              Get Free {resourceName}
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 text-center">
          We'll also send you helpful language teaching tips. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
