'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
        onClick={onClose}
        style={{ margin: 0, padding: '1rem' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
          style={{ margin: 'auto' }}
        >
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Choose Your Path</h2>
                <p className="text-sm md:text-base text-gray-600 mt-1">Select the option that best describes you</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="p-4 md:p-6 space-y-3 md:space-y-4">
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
                <div className="p-4 md:p-6">
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r ${option.color} flex items-center justify-center flex-shrink-0`}>
                      <option.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1 md:mb-2">
                        {option.title}
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                        {option.description}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {option.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-xs md:text-sm text-gray-700">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                            <span className="truncate">{feature}</span>
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
          <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
              <div className="text-xs md:text-sm text-gray-600 text-center md:text-left">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </div>
              <div className="flex space-x-3 w-full md:w-auto">
                <button
                  onClick={onClose}
                  className="flex-1 md:flex-none px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm md:text-base"
                >
                  Cancel
                </button>
                {selectedType && (
                  <Link
                    href={signupOptions.find(opt => opt.id === selectedType)?.href || '/auth/signup'}
                    onClick={onClose}
                    className={`flex-1 md:flex-none px-4 md:px-6 py-2 bg-gradient-to-r ${
                      signupOptions.find(opt => opt.id === selectedType)?.color
                    } text-white rounded-lg font-medium hover:shadow-lg transition-all text-center text-sm md:text-base`}
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

  return createPortal(modalContent, document.body);
}
