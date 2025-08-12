'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock } from 'lucide-react';

interface AssignmentLoadingScreenProps {
  message?: string;
  className?: string;
}

export default function AssignmentLoadingScreen({ 
  message = "Loading assignment...",
  className = ""
}: AssignmentLoadingScreenProps) {
  return (
    <div className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md mx-auto px-6"
      >
        {/* Animated Icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-blue-400/30"
        >
          <FileText className="h-8 w-8 text-blue-300" />
        </motion.div>

        {/* Loading Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-300/30 border-t-blue-300 rounded-full mx-auto mb-6"
        />

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-3">
          {message}
        </h2>

        {/* Description */}
        <p className="text-blue-200 mb-6">
          Please wait while we prepare your assignment...
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-blue-400 rounded-full"
            />
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex items-center justify-center text-blue-300/70 text-sm"
        >
          <Clock className="h-4 w-4 mr-2" />
          <span>This usually takes just a few seconds</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
