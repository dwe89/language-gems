'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Crown, Sparkles, ArrowRight, X, Check } from 'lucide-react';
import Link from 'next/link';

interface DemoUpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  restrictedFeature?: string;
  benefits?: string[];
}

export default function DemoUpgradePrompt({
  isOpen,
  onClose,
  title = "Unlock Full Access",
  description = "This feature is not available in demo mode. Sign up to access all categories, languages, and advanced features!",
  restrictedFeature = "Premium Feature",
  benefits = [
    "Access to 14+ vocabulary categories",
    "Support for Spanish, French, German & Italian",
    "Unlimited vocabulary practice",
    "Progress tracking and analytics",
    "Audio pronunciation for all words",
    "Spaced repetition learning system"
  ]
}: DemoUpgradePromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-purple-100 text-sm">
                {restrictedFeature} • Demo Mode
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            {description}
          </p>

          {/* Benefits List */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center">
              <Crown className="h-4 w-4 text-yellow-500 mr-2" />
              What you'll get with full access:
            </h3>
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/auth/signup"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="h-5 w-5" />
              <span>Sign Up Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <Link
              href="/auth/login"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
            >
              Already have an account? Sign In
            </Link>
          </div>

          {/* Demo Stats */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 text-sm mb-2">Demo Limitations:</h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
              <div>
                <span className="font-medium">Categories:</span> 1 of 14+
              </div>
              <div>
                <span className="font-medium">Languages:</span> 3 of 4
              </div>
              <div>
                <span className="font-medium">Words/Session:</span> 25 max
              </div>
              <div>
                <span className="font-medium">Progress:</span> Not saved
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Specialized upgrade prompts for specific contexts
export function CategoryUpgradePrompt({ 
  isOpen, 
  onClose, 
  categoryName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  categoryName: string; 
}) {
  return (
    <DemoUpgradePrompt
      isOpen={isOpen}
      onClose={onClose}
      title={`Unlock "${categoryName}" Category`}
      description={`The "${categoryName}" category is not available in demo mode. Sign up to access all vocabulary categories and advanced learning features!`}
      restrictedFeature={`${categoryName} Category`}
    />
  );
}

export function LanguageUpgradePrompt({ 
  isOpen, 
  onClose, 
  languageName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  languageName: string; 
}) {
  return (
    <DemoUpgradePrompt
      isOpen={isOpen}
      onClose={onClose}
      title={`Unlock ${languageName} Language`}
      description={`${languageName} language support is not available in demo mode. Sign up to access all supported languages!`}
      restrictedFeature={`${languageName} Language`}
      benefits={[
        `Full ${languageName} vocabulary collection`,
        "Native speaker audio pronunciation",
        "Cultural context and examples",
        "Grammar-specific vocabulary sets",
        "Progress tracking per language",
        "Spaced repetition optimization"
      ]}
    />
  );
}

export function FeatureUpgradePrompt({ 
  isOpen, 
  onClose, 
  featureName 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  featureName: string; 
}) {
  return (
    <DemoUpgradePrompt
      isOpen={isOpen}
      onClose={onClose}
      title={`Unlock ${featureName}`}
      description={`${featureName} is a premium feature not available in demo mode. Sign up to access all advanced learning tools!`}
      restrictedFeature={featureName}
    />
  );
}
