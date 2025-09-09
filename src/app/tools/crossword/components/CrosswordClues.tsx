'use client';

import React from 'react';
import { CrosswordData, CrosswordClue } from '../types/crossword';
import { cn } from '../../../../lib/utils';

interface CrosswordCluesProps {
  data: CrosswordData;
  selectedWord?: { number: number; direction: 'across' | 'down' } | null;
  onClueClick?: (number: number, direction: 'across' | 'down') => void;
  showAnswers?: boolean;
  className?: string;
}

export function CrosswordClues({ 
  data, 
  selectedWord, 
  onClueClick, 
  showAnswers = false,
  className 
}: CrosswordCluesProps) {
  const handleClueClick = (number: number, direction: 'across' | 'down') => {
    onClueClick?.(number, direction);
  };

  const renderClueSection = (title: string, clues: CrosswordClue[], direction: 'across' | 'down') => {
    if (clues.length === 0) return null;

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b-2 border-slate-200 dark:border-slate-700 flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-3 ${
            direction === 'across' ? 'bg-blue-500' : 'bg-green-500'
          }`}></span>
          {title} ({clues.length})
        </h3>
        <div className="space-y-3">
          {clues.map((clue) => {
            const isSelected = selectedWord?.number === clue.number && selectedWord?.direction === direction;

            return (
              <div
                key={`${direction}-${clue.number}`}
                className={cn(
                  'p-4 rounded-xl cursor-pointer transition-all duration-200 border',
                  {
                    'bg-blue-50 border-blue-200 shadow-md': isSelected,
                    'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600': !isSelected && onClueClick,
                    'cursor-default': !onClueClick,
                  }
                )}
                onClick={() => handleClueClick(clue.number, direction)}
              >
                <div className="flex items-start space-x-4">
                  <span className="font-bold text-lg text-slate-700 dark:text-slate-300 min-w-[2.5rem] text-right bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                    {clue.number}.
                  </span>
                  <div className="flex-1">
                    <span className="text-slate-800 dark:text-slate-200 leading-relaxed text-base">
                      {clue.clue}
                    </span>
                    {showAnswers && (
                      <div className="mt-3">
                        <span className="inline-flex items-center px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg font-mono font-bold text-sm">
                          <span className="mr-2">✓</span>
                          {clue.answer}
                        </span>
                      </div>
                    )}
                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      {clue.answer.length} letters
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn('bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6', className)}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center">
          <span className="mr-3">📝</span>
          Clues
        </h2>
        <div className="text-slate-600 dark:text-slate-400 flex items-center space-x-4">
          <span className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            {data.acrossClues.length} Across
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            {data.downClues.length} Down
          </span>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-6 pr-2">
        {renderClueSection('Across', data.acrossClues, 'across')}
        {renderClueSection('Down', data.downClues, 'down')}
      </div>
    </div>
  );
}

// Compact clues component for smaller spaces
interface CompactCrosswordCluesProps {
  data: CrosswordData;
  showAnswers?: boolean;
  className?: string;
}

export function CompactCrosswordClues({ 
  data, 
  showAnswers = false, 
  className 
}: CompactCrosswordCluesProps) {
  return (
    <div className={cn('bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4', className)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Across Clues */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 pb-2 border-b border-slate-200 dark:border-slate-600 flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            Across
          </h3>
          <div className="space-y-2">
            {data.acrossClues.map((clue) => (
              <div key={`across-${clue.number}`} className="flex items-start space-x-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 min-w-[2rem] text-sm">
                  {clue.number}.
                </span>
                <div className="flex-1">
                  <span className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                    {clue.clue}
                  </span>
                  {showAnswers && (
                    <div className="mt-1">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                        {clue.answer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Down Clues */}
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 pb-2 border-b border-slate-200 dark:border-slate-600 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Down
          </h3>
          <div className="space-y-2">
            {data.downClues.map((clue) => (
              <div key={`down-${clue.number}`} className="flex items-start space-x-2">
                <span className="font-bold text-slate-700 dark:text-slate-300 min-w-[2rem] text-sm">
                  {clue.number}.
                </span>
                <div className="flex-1">
                  <span className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                    {clue.clue}
                  </span>
                  {showAnswers && (
                    <div className="mt-1">
                      <span className="text-xs font-mono font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-md">
                        {clue.answer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Clues list for mobile/narrow screens
interface MobileCrosswordCluesProps {
  data: CrosswordData;
  selectedWord?: { number: number; direction: 'across' | 'down' } | null;
  onClueClick?: (number: number, direction: 'across' | 'down') => void;
  showAnswers?: boolean;
  className?: string;
}

export function MobileCrosswordClues({ 
  data, 
  selectedWord, 
  onClueClick, 
  showAnswers = false,
  className 
}: MobileCrosswordCluesProps) {
  const allClues = [
    ...data.acrossClues.map(clue => ({ ...clue, direction: 'across' as const })),
    ...data.downClues.map(clue => ({ ...clue, direction: 'down' as const }))
  ].sort((a, b) => a.number - b.number);

  return (
    <div className={cn('bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700', className)}>
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center">
          <span className="mr-3">📝</span>
          All Clues ({allClues.length})
        </h2>
        <div className="text-slate-600 dark:text-slate-400 flex items-center space-x-4 mt-1">
          <span className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            {data.acrossClues.length} Across
          </span>
          <span className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            {data.downClues.length} Down
          </span>
        </div>
      </div>
      
      <div className="max-h-80 overflow-y-auto">
        {allClues.map((clue) => {
          const isSelected = selectedWord?.number === clue.number && selectedWord?.direction === clue.direction;
          
          return (
            <div
              key={`${clue.direction}-${clue.number}`}
              className={cn(
                'p-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition-colors',
                {
                  'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500': isSelected,
                  'hover:bg-slate-50 dark:hover:bg-slate-700/50 active:bg-slate-100 dark:active:bg-slate-600': onClueClick,
                }
              )}
              onClick={() => onClueClick?.(clue.number, clue.direction)}
            >
              <div className="flex items-start space-x-3">
                <span className="font-bold text-slate-700 dark:text-slate-300 min-w-[2.5rem] text-sm flex items-center">
                  {clue.number}
                  <span className={cn('ml-1 text-xs font-medium px-1.5 py-0.5 rounded-full', {
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300': clue.direction === 'across',
                    'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300': clue.direction === 'down'
                  })}>
                    {clue.direction === 'across' ? 'A' : 'D'}
                  </span>
                </span>
                <div className="flex-1">
                  <span className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                    {clue.clue}
                  </span>
                  {showAnswers && (
                    <div className="mt-2">
                      <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-md">
                        {clue.answer}
                      </span>
                    </div>
                  )}
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center">
                    <span>{clue.answer.length} letters</span>
                    <span className="mx-2">•</span>
                    <span className={cn('capitalize', {
                      'text-blue-600 dark:text-blue-400': clue.direction === 'across',
                      'text-green-600 dark:text-green-400': clue.direction === 'down'
                    })}>
                      {clue.direction}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
