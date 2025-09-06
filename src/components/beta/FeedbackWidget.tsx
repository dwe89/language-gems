'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Star,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Bug
} from 'lucide-react';
import { useFeatureFlags } from '../../lib/feature-flags';

interface FeedbackWidgetProps {
  source?: string;
  category?: string;
  position?: 'bottom-right' | 'bottom-left' | 'inline';
  size?: 'small' | 'medium' | 'large';
}

export default function FeedbackWidget({ 
  source = 'general',
  category,
  position = 'bottom-right',
  size = 'medium'
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { isBetaLaunch } = useFeatureFlags();

  if (!isBetaLaunch) {
    return null;
  }

  const categories = [
    { id: 'feature-request', label: 'Feature Request', icon: Lightbulb, color: 'text-yellow-500' },
    { id: 'bug-report', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
    { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'text-blue-500' },
    { id: 'improvement', label: 'Improvement', icon: AlertCircle, color: 'text-orange-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/beta/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback: feedback.trim(),
          source,
          category: selectedCategory,
          rating: rating || undefined,
          email: email || undefined,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFeedback('');
        setRating(0);
        setEmail('');
        
        // Auto-close after success
        setTimeout(() => {
          setIsOpen(false);
          setIsSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6 z-50',
    'bottom-left': 'fixed bottom-6 left-6 z-50',
    'inline': 'relative'
  };

  const sizeClasses = {
    small: 'w-80',
    medium: 'w-96',
    large: 'w-[28rem]'
  };

  if (position === 'inline') {
    return (
      <div className={`bg-white rounded-lg shadow-lg border ${sizeClasses[size]}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Share Your Feedback</h3>
              <p className="text-sm text-gray-600">Help us improve LanguageGems</p>
            </div>
          </div>
          
          <FeedbackForm
            feedback={feedback}
            setFeedback={setFeedback}
            rating={rating}
            setRating={setRating}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            email={email}
            setEmail={setEmail}
            categories={categories}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={positionClasses[position]}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Feedback Panel */}
      {isOpen && (
        <div className={`bg-white rounded-lg shadow-2xl border ${sizeClasses[size]} animate-in slide-in-from-bottom duration-300`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Beta Feedback</h3>
                  <p className="text-sm text-gray-600">Help shape the future</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <FeedbackForm
              feedback={feedback}
              setFeedback={setFeedback}
              rating={rating}
              setRating={setRating}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              email={email}
              setEmail={setEmail}
              categories={categories}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Separate form component for reusability
function FeedbackForm({
  feedback,
  setFeedback,
  rating,
  setRating,
  selectedCategory,
  setSelectedCategory,
  email,
  setEmail,
  categories,
  onSubmit,
  isSubmitting,
  isSubmitted
}: any) {
  if (isSubmitted) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-900 mb-2">Thank you!</h3>
        <p className="text-gray-600 text-sm">Your feedback helps us build a better platform.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What type of feedback is this?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedCategory === cat.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <cat.icon className={`h-4 w-4 ${cat.color}`} />
                <span className="text-sm font-medium">{cat.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How would you rate your experience? (optional)
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1"
            >
              <Star
                className={`h-5 w-5 ${
                  star <= rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your feedback
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what you think, what you'd like to see improved, or any issues you've encountered..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          required
        />
      </div>

      {/* Email (optional) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email (optional - for follow-up)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!feedback.trim() || isSubmitting}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Feedback
          </>
        )}
      </button>
    </form>
  );
}
