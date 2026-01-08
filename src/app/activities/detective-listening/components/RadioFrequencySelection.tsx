'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Radio, Volume2, Zap } from 'lucide-react';
import { languages } from '../data/gameData';
import { getCaseTypeById } from '../data/gameData';
import { useRadioEffects } from '../hooks/useAudioManager';

interface RadioFrequencySelectionProps {
  selectedCase: string;
  onFrequencySelect: (language: string) => void;
  onBack: () => void;
}

export default function RadioFrequencySelection({ 
  selectedCase, 
  onFrequencySelect, 
  onBack 
}: RadioFrequencySelectionProps) {
  const [selectedFrequency, setSelectedFrequency] = useState<string | null>(null);
  const [tuningFrequency, setTuningFrequency] = useState<string | null>(null);
  const { playStatic, stopStatic, staticPlaying } = useRadioEffects();
  
  const caseType = getCaseTypeById(selectedCase);

  const handleFrequencyHover = (languageId: string) => {
    setTuningFrequency(languageId);
    playStatic();
  };

  const handleFrequencyLeave = () => {
    setTuningFrequency(null);
    stopStatic();
  };

  const handleFrequencySelect = (languageId: string) => {
    setSelectedFrequency(languageId);
    stopStatic();
    
    // Brief delay for radio tuning effect
    setTimeout(() => {
      onFrequencySelect(languageId);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 relative overflow-hidden">
      {/* Detective Room Background */}
      <div className="absolute inset-0 opacity-30">
        {/* Desk */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-amber-900 to-amber-800"></div>
        
        {/* Filing Cabinet */}
        <div className="absolute bottom-80 right-20 w-32 h-64 bg-gray-700 rounded-t-lg shadow-2xl">
          <div className="w-full h-8 bg-gray-600 rounded-t-lg"></div>
          <div className="w-full h-8 bg-gray-600 mt-2"></div>
          <div className="w-full h-8 bg-gray-600 mt-2"></div>
        </div>

        {/* Lamp */}
        <div className="absolute bottom-80 left-20 w-16 h-32 bg-gray-600 rounded-full shadow-xl">
          <div className="w-20 h-20 bg-yellow-300 rounded-full -mt-4 -ml-2 opacity-60 blur-sm"></div>
        </div>
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="absolute top-8 left-8 z-20 flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm text-slate-200 px-4 py-2 rounded-lg hover:bg-slate-700/80 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Cases</span>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl">
              <Radio className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-100 mb-4">
            Choose Radio Frequency
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">
            Tune into the right frequency to receive evidence transmissions for the{' '}
            <span className="text-amber-400 font-semibold">{caseType?.name}</span>
          </p>
        </motion.div>

        {/* Radio Interface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-12 shadow-2xl border border-gray-700 mb-8"
        >
          {/* Radio Display */}
          <div className="bg-black rounded-2xl p-6 mb-8 border-2 border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-mono text-sm">RECEIVING</span>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-gray-400" />
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-4 rounded-full ${
                        staticPlaying && i < 3 ? 'bg-green-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-mono text-green-400 mb-2">
                {tuningFrequency 
                  ? languages.find(l => l.id === tuningFrequency)?.frequency || 'TUNING...'
                  : 'SELECT FREQUENCY'
                }
              </div>
              <div className="text-sm text-gray-500">
                {tuningFrequency ? 'SIGNAL DETECTED' : 'NO SIGNAL'}
              </div>
            </div>
          </div>

          {/* Frequency Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {languages.map((language, index) => (
              <motion.div
                key={language.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => handleFrequencyHover(language.id)}
                  onMouseLeave={handleFrequencyLeave}
                  onClick={() => handleFrequencySelect(language.id)}
                  disabled={selectedFrequency !== null}
                  className={`
                    w-full p-8 rounded-2xl border-2 transition-all duration-300
                    ${tuningFrequency === language.id
                      ? 'bg-blue-600/20 border-blue-400 shadow-lg shadow-blue-400/20'
                      : selectedFrequency === language.id
                      ? 'bg-green-600/20 border-green-400 shadow-lg shadow-green-400/20'
                      : 'bg-gray-700/50 border-gray-600 hover:border-gray-500'
                    }
                    ${selectedFrequency !== null && selectedFrequency !== language.id ? 'opacity-50' : ''}
                  `}
                >
                  {/* Flag and Frequency */}
                  <div className="text-center">
                    <div className="text-4xl mb-4">{language.flag}</div>
                    <h3 className="text-xl font-bold text-slate-100 mb-2">
                      {language.name}
                    </h3>
                    <div className="text-lg font-mono text-blue-400 mb-4">
                      {language.frequency}
                    </div>
                    
                    {/* Signal Strength Indicator */}
                    <div className="flex justify-center space-x-1 mb-4">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 rounded-full transition-all duration-300 ${
                            tuningFrequency === language.id
                              ? `h-${2 + i * 2} bg-blue-400`
                              : selectedFrequency === language.id
                              ? `h-${2 + i * 2} bg-green-400`
                              : 'h-2 bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Status */}
                    <div className="text-sm">
                      {selectedFrequency === language.id ? (
                        <span className="text-green-400 flex items-center justify-center">
                          <Zap className="h-4 w-4 mr-1" />
                          CONNECTED
                        </span>
                      ) : tuningFrequency === language.id ? (
                        <span className="text-blue-400">TUNING...</span>
                      ) : (
                        <span className="text-gray-500">AVAILABLE</span>
                      )}
                    </div>
                  </div>
                </motion.button>

                {/* Selection Animation */}
                <AnimatePresence>
                  {selectedFrequency === language.id && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 bg-green-400/20 rounded-2xl border-2 border-green-400 pointer-events-none"
                    >
                      <div className="absolute inset-0 bg-green-400/10 rounded-2xl animate-pulse"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-slate-400"
        >
          <p className="text-sm">
            🎧 Hover over a frequency to test the signal, then click to connect
          </p>
        </motion.div>
      </div>

      {/* Connection Animation */}
      <AnimatePresence>
        {selectedFrequency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-800 rounded-2xl p-8 text-center border border-green-400"
            >
              <div className="w-16 h-16 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Radio className="h-8 w-8 text-slate-900" />
              </div>
              <h3 className="text-xl font-bold text-green-400 mb-2">
                Frequency Locked
              </h3>
              <p className="text-slate-300">
                Connecting to {languages.find(l => l.id === selectedFrequency)?.name}...
              </p>
              <div className="flex justify-center mt-4">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-green-400 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
