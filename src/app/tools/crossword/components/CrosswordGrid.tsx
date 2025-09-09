'use client';

import React, { useState, useCallback } from 'react';
import { CrosswordData } from '../types/crossword';
import { cn } from '../../../../lib/utils';

interface CrosswordGridProps {
  data: CrosswordData;
  showAnswers?: boolean;
  interactive?: boolean;
  className?: string;
  onCellClick?: (row: number, col: number) => void;
  selectedCell?: { row: number; col: number } | null;
}

export function CrosswordGrid({ 
  data, 
  showAnswers = false, 
  interactive = false,
  className,
  onCellClick,
  selectedCell
}: CrosswordGridProps) {
  const [userInput, setUserInput] = useState<Record<string, string>>({});

  const handleCellClick = useCallback((row: number, col: number) => {
    if (!interactive || data.grid[row][col].isBlack) return;
    onCellClick?.(row, col);
  }, [interactive, data.grid, onCellClick]);

  const handleInputChange = useCallback((row: number, col: number, value: string) => {
    if (!interactive) return;
    
    const key = `${row}-${col}`;
    const upperValue = value.toUpperCase().replace(/[^A-Z]/g, '');
    
    setUserInput(prev => ({
      ...prev,
      [key]: upperValue.slice(0, 1) // Only allow single character
    }));
  }, [interactive]);

  const getCellContent = (row: number, col: number) => {
    const cell = data.grid[row][col];
    const key = `${row}-${col}`;

    if (cell.isBlack) return '';

    if (showAnswers) {
      return cell.letter;
    }

    if (interactive) {
      return userInput[key] || '';
    }

    return ''; // Empty for puzzle mode
  };

  const getCellClasses = (row: number, col: number) => {
    const cell = data.grid[row][col];
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;

    return cn(
      'relative border border-slate-400 font-mono font-bold text-center select-none transition-colors duration-150',
      {
        'bg-slate-900 border-slate-900': cell.isBlack,
        'bg-white hover:bg-slate-50 border-slate-300': !cell.isBlack && interactive,
        'bg-slate-50 border-slate-200': !cell.isBlack && !interactive,
        'cursor-pointer': !cell.isBlack && interactive,
        'ring-2 ring-blue-500 ring-inset shadow-md': isSelected,
        'text-blue-700': showAnswers,
        'text-slate-800': !showAnswers,
      }
    );
  };

  // Calculate cell size based on grid dimensions
  const maxDimension = Math.max(data.gridSize.rows, data.gridSize.cols);
  const cellSize = maxDimension <= 15 ? 'w-10 h-10 text-base' :
                   maxDimension <= 20 ? 'w-8 h-8 text-sm' :
                   'w-7 h-7 text-xs';

  return (
    <div className={cn('inline-block bg-white p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700', className)}>
      <div
        className="grid gap-0 border-3 border-slate-600 rounded-lg overflow-hidden shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${data.gridSize.cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${data.gridSize.rows}, minmax(0, 1fr))`,
        }}
      >
        {data.grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cn(cellSize, getCellClasses(rowIndex, colIndex))}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {!cell.isBlack && (
                <>
                  {/* Cell number */}
                  {cell.number && (
                    <div className="absolute top-0 left-0 text-xs font-normal text-gray-600 leading-none p-0.5">
                      {cell.number}
                    </div>
                  )}
                  
                  {/* Cell content */}
                  {interactive ? (
                    <input
                      type="text"
                      value={getCellContent(rowIndex, colIndex)}
                      onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                      className="w-full h-full bg-transparent border-none outline-none text-center font-mono font-bold text-sm p-0 m-0"
                      maxLength={1}
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      {getCellContent(rowIndex, colIndex)}
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
      
      {/* Grid statistics */}
      <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
        <div>
          {data.stats.placedWords} words • {data.stats.intersections} intersections
        </div>
        <div>
          Grid: {data.gridSize.rows} × {data.gridSize.cols}
        </div>
      </div>
      
      {/* Print styles */}
      <style jsx>{`
        @media print {
          .grid {
            break-inside: avoid;
          }
          
          .grid > div {
            border: 1px solid #000 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
          
          .grid > div.bg-black {
            background-color: #000 !important;
          }
          
          .grid > div:not(.bg-black) {
            background-color: #fff !important;
          }
          
          input {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

// Interactive crossword player component
interface CrosswordPlayerProps {
  data: CrosswordData;
  onComplete?: (completed: boolean) => void;
  className?: string;
}

export function CrosswordPlayer({ data, onComplete, className }: CrosswordPlayerProps) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedWord, setSelectedWord] = useState<{ number: number; direction: 'across' | 'down' } | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());

  const handleCellClick = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
    
    // Find which word(s) this cell belongs to
    const cell = data.grid[row][col];
    if (cell.belongsToWords && cell.belongsToWords.length > 0) {
      // If multiple words, cycle through them or pick the first one
      const wordNumber = cell.belongsToWords[0];
      const word = data.placedWords.find(w => w.number === wordNumber);
      if (word) {
        setSelectedWord({ number: wordNumber, direction: word.direction });
      }
    }
  }, [data]);

  const checkWordCompletion = useCallback((wordNumber: number) => {
    const word = data.placedWords.find(w => w.number === wordNumber);
    if (!word) return false;

    let isComplete = true;
    for (let i = 0; i < word.word.length; i++) {
      const row = word.startRow + (word.direction === 'down' ? i : 0);
      const col = word.startCol + (word.direction === 'across' ? i : 0);
      const key = `${row}-${col}`;
      
      if (userAnswers[key] !== word.word[i]) {
        isComplete = false;
        break;
      }
    }

    if (isComplete && !completedWords.has(wordNumber)) {
      setCompletedWords(prev => new Set([...prev, wordNumber]));
    } else if (!isComplete && completedWords.has(wordNumber)) {
      setCompletedWords(prev => {
        const newSet = new Set(prev);
        newSet.delete(wordNumber);
        return newSet;
      });
    }

    return isComplete;
  }, [data.placedWords, userAnswers, completedWords]);

  const handleInputChange = useCallback((row: number, col: number, value: string) => {
    const key = `${row}-${col}`;
    const upperValue = value.toUpperCase().replace(/[^A-Z]/g, '');
    
    setUserAnswers(prev => ({
      ...prev,
      [key]: upperValue.slice(0, 1)
    }));

    // Check completion for all words that contain this cell
    const cell = data.grid[row][col];
    if (cell.belongsToWords) {
      cell.belongsToWords.forEach(wordNumber => {
        checkWordCompletion(wordNumber);
      });
    }

    // Check overall completion
    const totalWords = data.placedWords.length;
    const completedCount = completedWords.size;
    if (completedCount === totalWords) {
      onComplete?.(true);
    }
  }, [data.grid, data.placedWords.length, completedWords.size, checkWordCompletion, onComplete]);

  return (
    <div className={className}>
      <CrosswordGrid
        data={data}
        interactive={true}
        selectedCell={selectedCell}
        onCellClick={handleCellClick}
      />
      
      {/* Progress indicator */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-600">
          Progress: {completedWords.size} / {data.placedWords.length} words completed
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedWords.size / data.placedWords.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
