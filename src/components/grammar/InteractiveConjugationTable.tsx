'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  Eye, 
  EyeOff, 
  Info, 
  Star,
  CheckCircle,
  Play
} from 'lucide-react';
import { GemCard } from '../ui/GemTheme';

interface ConjugationData {
  person: string;
  form: string;
  translation: string;
  audio_url?: string;
}

interface ConjugationTableData {
  verb: string;
  translation: string;
  stem: string;
  conjugations: ConjugationData[];
}

interface InteractiveConjugationTableProps {
  data: ConjugationTableData;
  showTranslations?: boolean;
  highlightPattern?: boolean;
  onConjugationClick?: (conjugation: ConjugationData) => void;
  className?: string;
}

export default function InteractiveConjugationTable({
  data,
  showTranslations = true,
  highlightPattern = true,
  onConjugationClick,
  className = ''
}: InteractiveConjugationTableProps) {
  const [hoveredConjugation, setHoveredConjugation] = useState<string | null>(null);
  const [showAllTranslations, setShowAllTranslations] = useState(showTranslations);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const playAudio = async (audioUrl: string, conjugationForm: string) => {
    if (!audioUrl) return;
    
    try {
      setPlayingAudio(conjugationForm);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setPlayingAudio(null);
      audio.onerror = () => setPlayingAudio(null);
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setPlayingAudio(null);
    }
  };

  const getPersonColor = (person: string) => {
    const colors = {
      'yo': 'bg-blue-500',
      'tú': 'bg-green-500', 
      'él/ella/usted': 'bg-purple-500',
      'nosotros': 'bg-orange-500',
      'vosotros': 'bg-pink-500',
      'ellos/ellas/ustedes': 'bg-red-500'
    };
    return colors[person as keyof typeof colors] || 'bg-gray-500';
  };

  const getEndingHighlight = (form: string, stem: string) => {
    if (!highlightPattern) return form;
    
    const ending = form.replace(stem, '');
    return (
      <>
        <span className="text-gray-700">{stem}</span>
        <span className="font-bold text-purple-600 bg-purple-100 px-1 rounded">
          {ending}
        </span>
      </>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
            <span>{data.verb}</span>
            <span className="text-gray-500">({data.translation})</span>
          </h3>
          <p className="text-sm text-gray-600">
            Stem: <span className="font-mono font-semibold text-purple-600">{data.stem}</span>
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAllTranslations(!showAllTranslations)}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
          >
            {showAllTranslations ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Hide Translations</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Show Translations</span>
              </>
            )}
          </button>
          
          {highlightPattern && (
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Info className="w-3 h-3" />
              <span>Endings highlighted</span>
            </div>
          )}
        </div>
      </div>

      {/* Conjugation Grid */}
      <GemCard className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
          {data.conjugations.map((conjugation, index) => (
            <motion.div
              key={conjugation.person}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                ${hoveredConjugation === conjugation.form 
                  ? 'border-purple-400 bg-purple-50 shadow-lg scale-105' 
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }
              `}
              onMouseEnter={() => setHoveredConjugation(conjugation.form)}
              onMouseLeave={() => setHoveredConjugation(null)}
              onClick={() => onConjugationClick?.(conjugation)}
            >
              {/* Person Label */}
              <div className="flex items-center justify-between mb-2">
                <span className={`
                  px-2 py-1 rounded-full text-white text-xs font-semibold
                  ${getPersonColor(conjugation.person)}
                `}>
                  {conjugation.person}
                </span>
                
                {conjugation.audio_url && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(conjugation.audio_url!, conjugation.form);
                    }}
                    className={`
                      p-1 rounded-full transition-colors
                      ${playingAudio === conjugation.form 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }
                    `}
                    disabled={playingAudio === conjugation.form}
                  >
                    {playingAudio === conjugation.form ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Play className="w-3 h-3" />
                      </motion.div>
                    ) : (
                      <Volume2 className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>

              {/* Conjugated Form */}
              <div className="text-lg font-semibold text-gray-900 mb-1">
                {highlightPattern ? getEndingHighlight(conjugation.form, data.stem) : conjugation.form}
              </div>

              {/* Translation */}
              <AnimatePresence>
                {showAllTranslations && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm text-gray-600 italic"
                  >
                    {conjugation.translation}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hover Effect Indicator */}
              <AnimatePresence>
                {hoveredConjugation === conjugation.form && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute top-2 right-2"
                  >
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Pattern Summary */}
        {highlightPattern && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Conjugation Pattern:</h4>
            <div className="flex flex-wrap gap-2">
              {data.conjugations.map((conjugation) => {
                const ending = conjugation.form.replace(data.stem, '');
                return (
                  <span
                    key={conjugation.person}
                    className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-mono"
                  >
                    {conjugation.person}: -{ending}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </GemCard>

      {/* Interactive Feedback */}
      <AnimatePresence>
        {hoveredConjugation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-3"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                Click to practice this conjugation or hear pronunciation
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
