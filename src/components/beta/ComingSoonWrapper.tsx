'use client';

import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Construction, Lock, Mail, Calendar, Sparkles } from 'lucide-react';

interface ComingSoonWrapperProps {
  children: React.ReactNode;
  feature: 'worksheets' | 'assessments';
  adminEmail?: string;
}

const ComingSoonWrapper: React.FC<ComingSoonWrapperProps> = ({
  children,
  feature,
  adminEmail = 'danieletienne89@gmail.com'
}) => {
  const { user, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  
  // Allow access for admin user
  if (user?.email === adminEmail || isAdmin) {
    return <>{children}</>;
  }
  
  // Show coming soon overlay for regular users
  const featureConfig = {
    worksheets: {
      title: 'AI Worksheet Generator',
      description: 'Create custom worksheets with AI-powered content generation',
      icon: Sparkles,
      features: [
        'AI-generated vocabulary exercises',
        'Reading comprehension passages',
        'Grammar practice worksheets',
        'Crossword puzzles and word games',
        'Customizable difficulty levels',
        'Curriculum-aligned content'
      ],
      estimatedLaunch: 'Q2 2025'
    },
    assessments: {
      title: 'Assessment System',
      description: 'Comprehensive assessment tools for language learning',
      icon: Lock,
      features: [
        'AQA & Edexcel exam-style questions',
        'Reading comprehension tests',
        'Listening assessments',
        'Four skills evaluation',
        'Automated grading',
        'Detailed progress reports'
      ],
      estimatedLaunch: 'Q2 2025'
    }
  };
  
  const config = featureConfig[feature];
  const IconComponent = config.icon;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/beta/email-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          feature
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('Thanks! We\'ll notify you when it\'s ready.');
        setEmail('');
      } else {
        setSubmitMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Coming Soon Banner */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-6">
              <Construction className="w-4 h-4 mr-2" />
              Coming Soon
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {config.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {config.description}
            </p>
            
            <div className="flex items-center justify-center text-gray-500 mb-12">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Expected Launch: {config.estimatedLaunch}</span>
            </div>
          </div>
          
          {/* Feature Preview */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                What's Coming
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {config.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Email Signup */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <Mail className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">
              Get Notified When It's Ready
            </h3>
            <p className="text-blue-100 mb-6">
              Be the first to know when {config.title.toLowerCase()} launches. We'll send you early access and exclusive updates.
            </p>
            
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3 mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Notify Me'}
                </button>
              </div>
              {submitMessage && (
                <p className={`text-sm text-center ${submitMessage.includes('Thanks') ? 'text-blue-100' : 'text-red-200'}`}>
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
          
          {/* Admin Notice (only visible to non-admin users) */}
          {user && !isAdmin && user.email !== adminEmail && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> You're seeing this coming soon page because you're not logged in as the admin user. 
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComingSoonWrapper;
