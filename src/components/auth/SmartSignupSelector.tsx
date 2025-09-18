'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, User, GraduationCap, BookOpen, X } from 'lucide-react';

interface SmartSignupSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement>;
}

export default function SmartSignupSelector({ isOpen, onClose, triggerRef }: SmartSignupSelectorProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const signupOptions = [
    {
      id: 'teacher',
      title: 'For Teachers & Schools',
      description: 'Create assignments, track student progress, and access powerful analytics',
      icon: GraduationCap,
      href: '/auth/signup',
      color: 'from-blue-600 to-indigo-600',
      features: ['Student management', 'Assignment creation', 'Progress analytics', 'GCSE curriculum']
    },
    {
      id: 'learner',
      title: 'For Individual Learners',
      description: 'Learn languages independently with games, songs, and personalized progress',
      icon: User,
      href: '/auth/signup-learner',
      color: 'from-emerald-600 to-green-600',
      features: ['Interactive games', 'Song-based learning', 'Personal progress', 'Vocabulary building']
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Choose Your Path</h2>
                <p className="text-gray-600 mt-1">Select the option that best describes you</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="p-6 space-y-4">
            {signupOptions.map((option) => (
              <motion.div
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-xl border-2 transition-all cursor-pointer ${
                  selectedType === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => setSelectedType(option.id)}
              >
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center flex-shrink-0`}>
                      <option.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {option.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selection indicator */}
                {selectedType === option.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                {selectedType && (
                  <Link
                    href={signupOptions.find(opt => opt.id === selectedType)?.href || '/auth/signup'}
                    onClick={onClose}
                    className={`px-6 py-2 bg-gradient-to-r ${
                      signupOptions.find(opt => opt.id === selectedType)?.color
                    } text-white rounded-lg font-medium hover:shadow-lg transition-all`}
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
