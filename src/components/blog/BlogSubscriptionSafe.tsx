'use client';

import { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface BlogSubscriptionSafeProps {
  className?: string;
  variant?: 'inline' | 'card' | 'modal';
}

export default function BlogSubscriptionSafe({ 
  className = '', 
  variant = 'card' 
}: BlogSubscriptionSafeProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setIsSuccess(true);
        if (!data.isExisting) {
          setEmail('');
          setFirstName('');
          setLastName('');
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

  const baseClasses = "transition-all duration-200";
  
  const variantClasses = {
    inline: "bg-transparent",
    card: "bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100",
    modal: "bg-white rounded-lg p-6 shadow-lg"
  };

  // Show loading skeleton during SSR and initial hydration
  if (!isMounted) {
    return (
      <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Stay Updated
          </h3>
          <p className="text-slate-600">
            Get notified when we publish new language learning insights and teaching strategies.
          </p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 bg-slate-200 rounded-lg"></div>
            <div className="h-10 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="h-10 bg-slate-200 rounded-lg"></div>
          <div className="h-12 bg-slate-200 rounded-lg"></div>
        </div>
        <p className="text-xs text-slate-500 mt-4 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <Mail className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Stay Updated
        </h3>
        <p className="text-slate-600">
          Get notified when we publish new language learning insights and teaching strategies.
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="John"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="john@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !email.trim()}
          className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${
            isSubmitting || !email.trim()
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Subscribing...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              Subscribe to Updates
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-slate-500 mt-4 text-center">
        We respect your privacy. Unsubscribe at any time.
      </p>
    </div>
  );
}
