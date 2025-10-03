'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface BlogSubscriptionSimpleProps {
  className?: string;
  variant?: 'compact' | 'banner' | 'inline';
  placeholder?: string;
  buttonText?: string;
}

export default function BlogSubscriptionSimple({ 
  className = '',
  variant = 'inline',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe'
}: BlogSubscriptionSimpleProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage('Email is required');
      setIsSuccess(false);
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/blog/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        if (!data.isExisting) {
          setEmail('');
        }
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Compact variant - single line with button
  if (variant === 'compact') {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            required
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <button
            type="submit"
            disabled={isSubmitting || !email.trim()}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              isSubmitting || !email.trim()
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                {buttonText}
              </>
            )}
          </button>
        </form>
        {message && (
          <p className={`text-xs mt-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    );
  }

  // Banner variant - full width with centered content
  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-indigo-600 ${className}`}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">
                Get Weekly Language Teaching Tips
              </h3>
              <p className="text-blue-100">
                Join 1,000+ teachers receiving our newsletter
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                required
                className="flex-1 md:w-64 px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-white text-slate-900"
              />
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
                  isSubmitting || !email.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
                ) : (
                  <>
                    {buttonText}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          {message && (
            <div className={`mt-4 p-3 rounded-lg flex items-center ${
              isSuccess 
                ? 'bg-green-500/20 text-white border border-green-400' 
                : 'bg-red-500/20 text-white border border-red-400'
            }`}>
              {isSuccess ? (
                <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              )}
              <span className="text-sm">{message}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Inline variant - card style (default)
  return (
    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-shrink-0 bg-blue-600 rounded-lg p-3">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Never Miss an Update
          </h3>
          <p className="text-sm text-slate-600">
            Get our latest articles delivered to your inbox
          </p>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center ${
          isSuccess 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {isSuccess ? (
            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
          )}
          <span className="text-sm">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        
        <button
          type="submit"
          disabled={isSubmitting || !email.trim()}
          className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
            isSubmitting || !email.trim()
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Subscribing...
            </>
          ) : (
            <>
              <Mail className="h-5 w-5 mr-2" />
              {buttonText}
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 text-center">
          Free forever. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}

