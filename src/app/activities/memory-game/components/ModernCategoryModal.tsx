'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { VOCABULARY_CATEGORIES } from '../../../../components/games/ModernCategorySelector';

interface ModernCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategorySelect: (categoryId: string, subcategoryId?: string) => void;
  selectedCategory?: string;
  selectedSubcategory?: string;
}

export default function ModernCategoryModal({
  isOpen,
  onClose,
  onCategorySelect,
  selectedCategory,
  selectedSubcategory
}: ModernCategoryModalProps) {
  const [categoryView, setCategoryView] = useState<'categories' | 'subcategories'>('categories');
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<any>(null);

  const getCategoryById = (id: string) => {
    return VOCABULARY_CATEGORIES.find(cat => cat.id === id);
  };

  const handleCategoryChange = (categoryId: string) => {
    onCategorySelect(categoryId);
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    onCategorySelect(selectedCategoryForModal?.id || '', subcategoryId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-2xl text-white max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {categoryView === 'categories' ? (
              <>
                <h2 className="text-3xl font-bold text-center mb-8">Choose Learning Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                  {VOCABULARY_CATEGORIES.map((item) => (
                    <motion.div
                      key={item.id}
                      onClick={() => {
                        if (item.subcategories.length > 0) {
                          setSelectedCategoryForModal(item);
                          setCategoryView('subcategories');
                        } else {
                          handleCategoryChange(item.id);
                          onClose();
                        }
                      }}
                      className={`
                        cursor-pointer text-center p-4 rounded-xl border-2 transition-all
                        ${selectedCategory === item.id
                          ? 'bg-white/25 border-white/60 text-white shadow-lg ring-2 ring-white/40'
                          : 'bg-white/5 border-white/20 hover:bg-white/15 hover:border-white/40'}
                      `}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-3xl mb-2">{item.icon}</div>
                      <div className="font-medium text-sm">{item.displayName}</div>
                      <div className="text-xs mt-1 opacity-75">
                        {item.subcategories.length > 0 ? `${item.subcategories.length} topics` : 'Ready to play'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <button
                    onClick={() => {
                      setCategoryView('categories');
                    }}
                    className="flex items-center text-white/80 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Categories
                  </button>
                  <h2 className="text-3xl font-bold text-center">Choose Topic</h2>
                  <div className="w-24"></div>
                </div>

                {selectedCategoryForModal && (
                  <>
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-2">{selectedCategoryForModal.icon}</div>
                      <h3 className="text-xl font-semibold">{selectedCategoryForModal.displayName}</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                      {selectedCategoryForModal.subcategories.map((subcategory: any) => (
                        <motion.div
                          key={subcategory.id}
                          onClick={() => {
                            handleCategoryChange(selectedCategoryForModal.id);
                            handleSubcategoryChange(subcategory.id);
                            onClose();
                            setCategoryView('categories');
                            setSelectedCategoryForModal(null);
                          }}
                          className={`
                            cursor-pointer text-center p-4 rounded-xl border-2 transition-all
                            ${selectedSubcategory === subcategory.id
                              ? 'bg-white/25 border-white/60 text-white shadow-lg ring-2 ring-white/40'
                              : 'bg-white/5 border-white/20 hover:bg-white/15 hover:border-white/40'}
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <div className="text-2xl mb-2">{subcategory.icon || '📝'}</div>
                          <div className="font-medium text-sm">{subcategory.displayName}</div>
                          <div className="text-xs mt-1 opacity-75">Ready to play</div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            <div className="flex justify-center mt-6">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl border border-white/30 hover:border-white/50 transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
