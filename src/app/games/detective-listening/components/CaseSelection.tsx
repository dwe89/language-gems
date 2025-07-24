'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';
import { VOCABULARY_CATEGORIES } from '../../../../components/games/ModernCategorySelector';

interface CaseSelectionProps {
  onCaseSelect: (categoryId: string, subcategoryId: string | null) => void;
}

export default function CaseSelection({ onCaseSelect }: CaseSelectionProps) {
  const [hoveredCase, setHoveredCase] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-800 to-red-900 relative overflow-hidden">
      {/* Detective Room Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-24 bg-amber-700 rounded-lg shadow-2xl transform -rotate-12"></div>
        <div className="absolute top-32 right-20 w-28 h-20 bg-orange-700 rounded-lg shadow-2xl transform rotate-6"></div>
        <div className="absolute bottom-40 left-20 w-36 h-28 bg-red-700 rounded-lg shadow-2xl transform -rotate-6"></div>
        <div className="absolute bottom-20 right-32 w-24 h-32 bg-amber-600 rounded-lg shadow-2xl transform rotate-12"></div>
      </div>

      {/* Desk Surface */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-amber-800 to-amber-700 shadow-inner"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl">
              <FileText className="h-10 w-10 text-amber-900" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-amber-100 mb-4">
            Detective, Choose Your Case
          </h1>
          <p className="text-xl text-amber-200 max-w-2xl mx-auto">
            Select a case file to begin your investigation. Each case contains evidence that needs to be identified through radio transmissions.
          </p>
        </motion.div>

        {/* Category Selection */}
        {!showSubcategories ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {VOCABULARY_CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                whileTap={{ scale: 0.95 }}
                className="relative perspective-1000"
                onMouseEnter={() => setHoveredCase(category.id)}
                onMouseLeave={() => setHoveredCase(null)}
              >
                <button
                  onClick={() => {
                    if (category.subcategories.length > 0) {
                      setSelectedCategory(category);
                      setShowSubcategories(true);
                    } else {
                      onCaseSelect(category.id, null);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (category.subcategories.length > 0) {
                        setSelectedCategory(category);
                        setShowSubcategories(true);
                      } else {
                        onCaseSelect(category.id, null);
                      }
                    }
                  }}
                  aria-label={`Select ${category.displayName} case`}
                  className={`
                    relative cursor-pointer bg-gradient-to-br from-amber-500 to-orange-600
                    rounded-2xl p-8 shadow-2xl border-4 border-amber-200/30
                    transform transition-all duration-300 hover:shadow-3xl
                    focus:outline-none focus:ring-4 focus:ring-amber-400/50
                    ${hoveredCase === category.id ? 'shadow-amber-400/50' : ''}
                    w-full h-full
                  `}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Case File Tab */}
                  <div className="absolute -top-4 left-6 bg-amber-100 px-4 py-2 rounded-t-lg shadow-lg">
                    <span className="text-amber-900 font-bold text-sm">CASE #{index + 1}</span>
                  </div>

                  {/* Case Icon */}
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4 transform hover:scale-110 transition-transform">
                      🕵️
                    </div>
                    <div className="w-16 h-1 bg-white/30 mx-auto rounded-full"></div>
                  </div>

                  {/* Case Details */}
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-3">{category.displayName} Case</h3>
                    <p className="text-white/90 text-sm mb-6 leading-relaxed">
                      Investigate {category.displayName.toLowerCase()} evidence through radio transmissions
                    </p>

                    {/* Evidence Count Badge */}
                    <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                      <span className="text-sm font-medium">
                        {category.subcategories.length > 0 ? `${category.subcategories.length} Topics` : 'Multiple Evidence Pieces'}
                      </span>
                    </div>
                  </div>

                  {/* Select Button */}
                  <div className="flex items-center justify-center">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-semibold"
                    >
                      <span>{category.subcategories.length > 0 ? 'View Topics' : 'Open Case'}</span>
                      <ChevronRight className="h-4 w-4" />
                    </motion.div>
                  </div>

                  {/* Hover Glow Effect */}
                  {hoveredCase === category.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-white/10 rounded-2xl pointer-events-none"
                  />
                )}
              </button>

              {/* Case File Shadow */}
              <div className="absolute inset-0 bg-black/20 rounded-2xl transform translate-y-2 translate-x-2 -z-10"></div>
            </motion.div>
            ))}
          </div>
        ) : (
          /* Subcategory Selection */
          <div className="space-y-8">
            {/* Back Button */}
            <motion.button
              onClick={() => setShowSubcategories(false)}
              className="flex items-center space-x-2 text-amber-100 hover:text-white transition-colors mb-8"
              whileHover={{ x: -5 }}
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
              <span>Back to Categories</span>
            </motion.button>

            {/* Selected Category Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-amber-100 mb-4">
                {selectedCategory?.displayName} Case Topics
              </h2>
              <p className="text-xl text-amber-200/80 max-w-2xl mx-auto">
                Choose a specific topic to investigate. Each topic contains unique evidence to uncover.
              </p>
            </motion.div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCategory?.subcategories.map((subcategory: any, index: number) => (
                <motion.button
                  key={subcategory.id}
                  onClick={() => onCaseSelect(selectedCategory.id, subcategory.id)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 shadow-xl border-2 border-amber-200/30 hover:border-amber-200/60 transition-all text-white text-left"
                >
                  <div className="text-3xl mb-3">🔍</div>
                  <h3 className="text-xl font-bold mb-2">{subcategory.displayName}</h3>
                  <p className="text-amber-100 text-sm">
                    Investigate {subcategory.displayName.toLowerCase()} evidence
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Evidence Available</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Detective Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex items-center bg-amber-100/10 backdrop-blur-sm rounded-full px-8 py-4 border border-amber-200/30">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mr-4">
              <span className="text-amber-900 font-bold text-lg">🕵️</span>
            </div>
            <div className="text-left">
              <div className="text-amber-100 font-bold">Detective Badge</div>
              <div className="text-amber-200 text-sm">Language Investigation Unit</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ambient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-300/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
