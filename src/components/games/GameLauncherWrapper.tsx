'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import ModernCategorySelector from './ModernCategorySelector';
import { useCategorySelection } from '../../hooks/useCategorySelection';

interface GameLauncherWrapperProps {
  gameName: string;
  selectedLanguage: string;
  onCategorySelect: (categoryId: string, subcategoryId: string | null) => void;
  children: React.ReactNode;
}

export default function GameLauncherWrapper({
  gameName,
  selectedLanguage,
  onCategorySelect,
  children
}: GameLauncherWrapperProps) {
  const {
    showCategorySelector,
    setShowCategorySelector,
    handleCategorySelect
  } = useCategorySelection();

  const handleCategorySelection = (categoryId: string, subcategoryId: string | null) => {
    handleCategorySelect(categoryId, subcategoryId);
    onCategorySelect(categoryId, subcategoryId);
  };

  return (
    <>
      {children}
      
      {/* Category Selection Modal */}
      <AnimatePresence>
        {showCategorySelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">
                  Choose Category for {gameName}
                </h2>
                <button
                  onClick={() => setShowCategorySelector(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <ModernCategorySelector 
                onCategorySelect={handleCategorySelection}
                selectedLanguage={selectedLanguage}
                gameName={gameName}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
