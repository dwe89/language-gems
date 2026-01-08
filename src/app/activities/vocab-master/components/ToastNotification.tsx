import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

interface ToastNotificationProps {
  show: boolean;
  isCorrect: boolean;
  message?: string;
  correctAnswer?: string;
  onComplete: () => void;
  duration?: number;
  isAdventureMode?: boolean;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  show,
  isCorrect,
  message,
  correctAnswer,
  onComplete,
  duration = 2000,
  isAdventureMode = false
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  const getToastStyles = () => {
    if (isCorrect) {
      return isAdventureMode
        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-400/50'
        : 'bg-gradient-to-r from-green-500 to-green-600 text-white';
    } else {
      return isAdventureMode
        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-400/50'
        : 'bg-gradient-to-r from-red-500 to-red-600 text-white';
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-xl ${getToastStyles()} ${
            isAdventureMode ? 'border backdrop-blur-xl' : ''
          }`}
        >
          <div className="flex items-center space-x-3">
            {isCorrect ? (
              <CheckCircle className="h-6 w-6 text-white" />
            ) : (
              <XCircle className="h-6 w-6 text-white" />
            )}
            
            <div>
              <div className="font-semibold text-lg">
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </div>
              
              {message && (
                <div className="text-sm opacity-90 mt-1">
                  {message}
                </div>
              )}
              
              {!isCorrect && correctAnswer && (
                <div className="text-sm opacity-90 mt-1">
                  Answer: <span className="font-semibold">{correctAnswer}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
