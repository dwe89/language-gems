'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, ChevronRight } from 'lucide-react';
import { caseTypes } from '../data/gameData';
import { CaseType } from '../types';

interface CaseSelectionProps {
  onCaseSelect: (caseType: string) => void;
}

export default function CaseSelection({ onCaseSelect }: CaseSelectionProps) {
  const [hoveredCase, setHoveredCase] = useState<string | null>(null);

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

        {/* Case Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {caseTypes.map((caseType, index) => (
            <motion.div
              key={caseType.id}
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
              onMouseEnter={() => setHoveredCase(caseType.id)}
              onMouseLeave={() => setHoveredCase(null)}
            >
              <button
                onClick={() => onCaseSelect(caseType.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onCaseSelect(caseType.id);
                  }
                }}
                aria-label={`Select ${caseType.name}: ${caseType.description}`}
                className={`
                  relative cursor-pointer bg-gradient-to-br ${caseType.color}
                  rounded-2xl p-8 shadow-2xl border-4 border-amber-200/30
                  transform transition-all duration-300 hover:shadow-3xl
                  focus:outline-none focus:ring-4 focus:ring-amber-400/50
                  ${hoveredCase === caseType.id ? 'shadow-amber-400/50' : ''}
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
                    {caseType.icon}
                  </div>
                  <div className="w-16 h-1 bg-white/30 mx-auto rounded-full"></div>
                </div>

                {/* Case Details */}
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-3">{caseType.name}</h3>
                  <p className="text-white/90 text-sm mb-6 leading-relaxed">
                    {caseType.description}
                  </p>
                  
                  {/* Evidence Count Badge */}
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                    <span className="text-sm font-medium">10+ Evidence Pieces</span>
                  </div>
                </div>

                {/* Select Button */}
                <div className="flex items-center justify-center">
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-semibold"
                  >
                    <span>Open Case</span>
                    <ChevronRight className="h-4 w-4" />
                  </motion.div>
                </div>

                {/* Hover Glow Effect */}
                {hoveredCase === caseType.id && (
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
