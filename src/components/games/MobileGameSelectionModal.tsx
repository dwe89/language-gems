'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gamepad2 } from 'lucide-react';
import GameSelectionSidebar, { SelectionState } from './FilterSidebar'; // Import the sidebar component

interface MobileGameSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectionComplete: (selection: SelectionState) => void;
  selectedGame: { id: string; name: string; supportsThemes?: boolean } | null;
}

export default function MobileGameSelectionModal({
  isOpen,
  onClose,
  onSelectionComplete,
  selectedGame,
}: MobileGameSelectionModalProps) {
  const [currentSelection, setCurrentSelection] = useState<SelectionState>({
    language: null,
    curriculumLevel: null,
    categoryId: null,
    subcategoryId: null,
    theme: null
  });

  // Reset selection state when the modal opens with a new game
  useEffect(() => {
    if (isOpen) {
      setCurrentSelection({
        language: null,
        curriculumLevel: null,
        categoryId: null,
        subcategoryId: null,
        theme: null
      });
    }
  }, [isOpen, selectedGame]);


  // Handle selection from the sidebar and close the modal when complete
  const handleCompleteAndClose = (selection: SelectionState) => {
    onSelectionComplete(selection);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-y-0 right-0 w-full sm:w-2/3 md:w-1/2 bg-white rounded-l-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedGame ? `Setup ${selectedGame.name}` : 'Select Game Content'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Content - The GameSelectionSidebar component handles all the logic */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedGame ? (
                <GameSelectionSidebar
                  onSelectionComplete={handleCompleteAndClose}
                  selectedGame={{
                    id: selectedGame.id,
                    name: selectedGame.name,
                    supportsThemes: selectedGame.id.includes('vocab-blast')
                  }}
                  onSelectionChange={setCurrentSelection}
                />
              ) : (
                <div className="text-center py-12">
                  <Gamepad2 className="mx-auto h-14 w-14 text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No Game Selected
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Please return to the main page and choose a game first.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Back to Games
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
