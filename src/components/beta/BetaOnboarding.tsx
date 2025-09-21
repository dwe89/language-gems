'use client';

import React, { useState } from 'react';
import {
  Gamepad2,
  BookOpen,
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Play,
  Mail,
  MessageSquare,
  X,
  Target,
  Brain,
  Zap,
  Search,
  Swords,
  Building,
  Pickaxe
} from 'lucide-react';
import { useFeatureFlags } from '../../lib/feature-flags';

interface BetaOnboardingProps {
  onComplete?: () => void;
  onSkip?: () => void;
  userType?: 'teacher' | 'student';
}

export default function BetaOnboarding({ 
  onComplete, 
  onSkip, 
  userType = 'teacher' 
}: BetaOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { betaConfig } = useFeatureFlags();

  const steps = [
    {
      title: "Welcome to LanguageGems Beta!",
      subtitle: "You're among the first to experience our revolutionary language learning platform",
      content: (
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-6 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">11+ Games Ready</h3>
              <p className="text-sm text-gray-600">All interactive games are fully functional and ready to use</p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg">
              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Complete Assessments</h3>
              <p className="text-sm text-gray-600">AQA & Edexcel assessments available now</p>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-lg">
              <Users className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Teacher & Student Access</h3>
              <p className="text-sm text-gray-600">Full authentication system working</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "What's Available Right Now",
      subtitle: "Everything you need to start using LanguageGems with your students",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border-2 border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="font-semibold text-gray-900">Ready to Use</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• All 11+ interactive games</li>
                <li>• Complete assessment system</li>
                <li>• Teacher and student accounts</li>
                <li>• Basic assignment creation</li>
                <li>• Progress tracking</li>
                <li>• Audio pronunciation</li>
              </ul>
            </div>
            
            <div className="p-6 bg-white border-2 border-orange-200 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Coming Soon</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Advanced analytics dashboard</li>
                <li>• Comprehensive assignment management</li>
                <li>• Enhanced class management</li>
                <li>• Detailed progress reports</li>
                <li>• School admin features</li>
                <li>• Subscription billing</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Get Started with Games",
      subtitle: "The heart of LanguageGems - try our interactive games now",
      content: (
        <div className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { name: "VocabMaster", icon: "Target" },
              { name: "Memory Match", icon: "Brain" },
              { name: "Word Blast", icon: "Zap" },
              { name: "Detective Listening", icon: "Search" },
              { name: "Conjugation Duel", icon: "Swords" },
              { name: "Lava Temple", icon: "Building" },
              { name: "Speed Builder", icon: "Zap" },
              { name: "Vocab Mining", icon: "Pickaxe" }
            ].map((game, index) => {
              const IconComponent = {
                Target,
                Brain,
                Zap,
                Search,
                Swords,
                Building,
                Pickaxe
              }[game.icon] || Target;

              return (
                <div key={index} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                  <IconComponent className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-sm font-medium text-gray-700">{game.name}</div>
                </div>
              );
            })}
          </div>
          
          <a
            href="/games"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all"
          >
            <Play className="h-5 w-5" />
            Try Games Now
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      )
    },
    {
      title: "Help Us Improve",
      subtitle: "Your feedback shapes the future of LanguageGems",
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Stay Updated</h3>
            <p className="text-gray-600 mb-4">
              Get notified when new features launch and receive exclusive beta updates.
            </p>
            
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={async () => {
                  if (email) {
                    setIsSubmitting(true);
                    try {
                      await fetch('/api/beta/email-capture', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          email, 
                          source: 'onboarding',
                          priority: 'high'
                        })
                      });
                    } catch (error) {
                      console.error('Email capture error:', error);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }
                }}
                disabled={!email || isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Mail className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Feedback</h3>
            <p className="text-gray-600 mb-4">
              What would you most like to see in the full launch?
            </p>
            
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Your thoughts and suggestions..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
            />
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (feedback) {
      try {
        await fetch('/api/beta/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            feedback, 
            source: 'onboarding',
            userType 
          })
        });
      } catch (error) {
        console.error('Feedback submission error:', error);
      }
    }
    
    // Store onboarding completion
    localStorage.setItem('beta-onboarding-completed', 'true');
    onComplete?.();
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{currentStepData.title}</h2>
                <p className="text-gray-600">{currentStepData.subtitle}</p>
              </div>
            </div>
            
            {onSkip && (
              <button
                onClick={onSkip}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
