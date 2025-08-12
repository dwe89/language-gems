'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface AssignmentErrorScreenProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
}

export default function AssignmentErrorScreen({ 
  title = "Assignment Error",
  message = "We encountered an error while loading your assignment. Please try again.",
  onRetry,
  onBack,
  className = ""
}: AssignmentErrorScreenProps) {
  return (
    <div className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 to-orange-900 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto px-6"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-red-400/30"
        >
          <AlertTriangle className="h-8 w-8 text-red-300" />
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3">
          {title}
        </h2>

        {/* Error Message */}
        <p className="text-red-200 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {onRetry && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetry}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </motion.button>
          )}

          {onBack && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Go Back</span>
            </motion.button>
          )}
        </div>

        {/* Help Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-red-300/70 text-sm"
        >
          <p>If this problem persists, please contact your teacher for assistance.</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
