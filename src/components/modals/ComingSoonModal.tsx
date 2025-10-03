"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  Sparkles,
  Target,
  BookOpen,
  Gamepad2,
  Music,
  FileText,
  BarChart3,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComingSoonModal({ isOpen, onClose }: ComingSoonModalProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/coming-soon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          source: 'coming-soon-modal'
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        // Auto-close after 3 seconds
        setTimeout(() => {
          if (onClose) {
            onClose();
          }
          // Reset form state
          setIsSuccess(false);
          setEmail('');
          setFirstName('');
          setLastName('');
        }, 3000);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: Target,
      title: 'AI-Powered Analytics',
      description: 'Know exactly which words and topics your students struggle with'
    },
    {
      icon: Gamepad2,
      title: '15+ Dynamic Games',
      description: 'Conjugation Duel, Detective Listening, and more engaging activities'
    },
    {
      icon: BarChart3,
      title: 'Real-time Insights',
      description: 'Track student progress with detailed mastery indicators'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="coming-soon-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Success State */}
            {isSuccess ? (
              <div className="p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">You're on the list!</h3>
                  <p className="text-gray-600">We'll notify you as soon as LanguageGems launches.</p>
                </motion.div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-6 text-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center justify-center mb-3"
                  >
                    <Sparkles className="w-7 h-7 mr-2" />
                    <h2 className="text-2xl md:text-3xl font-bold">
                      LanguageGems: Coming Soon!
                    </h2>
                  </motion.div>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-blue-100"
                  >
                    The Ultimate Language Toolkit is almost here
                  </motion.p>
                </div>

                <div className="p-6">
                  {/* Signup Form - Now First */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        Get Early Access
                      </h3>
                      <p className="text-sm text-gray-600">
                        Be the first to know when we launch
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3" noValidate>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          disabled={isSubmitting}
                          required
                        />
                        <input
                          type="text"
                          name="lastName"
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          disabled={isSubmitting}
                          required
                        />
                      </div>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        disabled={isSubmitting}
                      />

                      {error && (
                        <p className="text-red-600 text-sm text-center">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          <>
                            <Mail className="w-5 h-5 mr-2" />
                            Notify Me When It Launches
                          </>
                        )}
                      </button>
                    </form>

                    <p className="text-xs text-gray-500 text-center mt-3">
                      We'll only email you about LanguageGems updates. No spam, ever.
                    </p>
                  </div>

                  {/* Features Grid - Now Below */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="text-center p-3"
                      >
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">{feature.title}</h4>
                        <p className="text-xs text-gray-600">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
