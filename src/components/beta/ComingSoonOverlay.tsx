'use client';

import React, { useState } from 'react';
import { 
  Rocket, 
  Mail, 
  CheckCircle, 
  Clock, 
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';

interface ComingSoonOverlayProps {
  title: string;
  description: string;
  features?: string[];
  estimatedLaunch?: string;
  priority?: 'high' | 'medium' | 'low';
  showEmailCapture?: boolean;
  onClose?: () => void;
  className?: string;
}

export default function ComingSoonOverlay({
  title,
  description,
  features = [],
  estimatedLaunch = "Q2 2025",
  priority = 'medium',
  showEmailCapture = true,
  onClose,
  className = ""
}: ComingSoonOverlayProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    try {
      // Submit to email capture API
      const response = await fetch('/api/beta/email-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          feature: title,
          priority,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Email capture error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityConfig = {
    high: {
      color: 'from-purple-500 to-pink-500',
      badge: 'HIGH PRIORITY',
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    medium: {
      color: 'from-blue-500 to-cyan-500',
      badge: 'COMING SOON',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    low: {
      color: 'from-gray-500 to-slate-500',
      badge: 'PLANNED',
      badgeColor: 'bg-gray-100 text-gray-800',
    },
  };

  const config = priorityConfig[priority];

  return (
    <div className={`relative bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      )}

      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${config.color} p-6 text-white relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Rocket className="h-6 w-6" />
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badgeColor} text-gray-800`}>
              {config.badge}
            </span>
          </div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-white/90 text-lg">{description}</p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Features list */}
        {features.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              What's Coming
            </h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Timeline */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3 text-gray-700">
            <Clock className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Estimated Launch:</span>
            <span className="font-semibold text-blue-600">{estimatedLaunch}</span>
          </div>
        </div>

        {/* Email capture */}
        {showEmailCapture && !isSubmitted && (
          <div className="border-t pt-6">
            <h4 className="font-semibold text-gray-900 mb-2">Get Notified When It's Ready</h4>
            <p className="text-gray-600 mb-4">
              Be the first to know when this feature launches. We'll send you early access.
            </p>
            
            <form onSubmit={handleEmailSubmit} className="flex gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-gradient-to-r ${config.color} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50`}
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Mail className="h-5 w-5" />
                    Notify Me
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Success message */}
        {isSubmitted && (
          <div className="border-t pt-6">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-semibold text-green-900">You're on the list!</h4>
                <p className="text-green-700">We'll notify you as soon as this feature is ready.</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA for current features */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">While You Wait...</h4>
          <p className="text-blue-700 mb-3">
            Explore our complete collection of interactive language learning games - available now!
          </p>
          <a
            href="/activities"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Try Our Games
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
