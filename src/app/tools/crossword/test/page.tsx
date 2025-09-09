'use client';

import React, { useState } from 'react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { CrosswordGrid, CrosswordPlayer } from '../components/CrosswordGrid';
import { CrosswordClues, CompactCrosswordClues } from '../components/CrosswordClues';
import { generateCrosswordLayout } from '../utils/crosswordGenerator';
import { CrosswordData, WordEntry } from '../types/crossword';

const sampleWords: WordEntry[] = [
  { id: '1', word: 'HELLO', clue: 'Common greeting' },
  { id: '2', word: 'WORLD', clue: 'The Earth and all its inhabitants' },
  { id: '3', word: 'REACT', clue: 'JavaScript library for building user interfaces' },
  { id: '4', word: 'NEXT', clue: 'React framework for production' },
  { id: '5', word: 'CODE', clue: 'Instructions for a computer' },
  { id: '6', word: 'LEARN', clue: 'To acquire knowledge' },
  { id: '7', word: 'TEACH', clue: 'To give instruction' },
  { id: '8', word: 'STUDY', clue: 'To examine carefully' },
];

export default function CrosswordTestPage() {
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [selectedWord, setSelectedWord] = useState<{ number: number; direction: 'across' | 'down' } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const data = await generateCrosswordLayout(sampleWords);
      setCrosswordData(data);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClueClick = (number: number, direction: 'across' | 'down') => {
    setSelectedWord({ number, direction });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Crossword Generator Test</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : 'Generate Test Crossword'}
            </Button>
            
            {crosswordData && (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowAnswers(!showAnswers)}
                >
                  {showAnswers ? 'Hide' : 'Show'} Answers
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setSelectedWord(null)}
                >
                  Clear Selection
                </Button>
              </>
            )}
          </div>

          {/* Sample Words */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Sample Words:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {sampleWords.map(word => (
                <div key={word.id} className="p-2 bg-gray-100 rounded">
                  <div className="font-mono font-bold">{word.word}</div>
                  <div className="text-gray-600 text-xs">{word.clue}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Crossword Display */}
          {crosswordData ? (
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Generation Results:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="font-medium">Total Words</div>
                    <div>{crosswordData.stats.totalWords}</div>
                  </div>
                  <div>
                    <div className="font-medium">Placed Words</div>
                    <div>{crosswordData.stats.placedWords}</div>
                  </div>
                  <div>
                    <div className="font-medium">Intersections</div>
                    <div>{crosswordData.stats.intersections}</div>
                  </div>
                  <div>
                    <div className="font-medium">Grid Size</div>
                    <div>{crosswordData.gridSize.rows} × {crosswordData.gridSize.cols}</div>
                  </div>
                </div>
              </div>

              {/* Grid and Clues */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <CrosswordGrid 
                    data={crosswordData} 
                    showAnswers={showAnswers}
                    className="mx-auto"
                  />
                </div>
                <div>
                  <CrosswordClues 
                    data={crosswordData}
                    selectedWord={selectedWord}
                    onClueClick={handleClueClick}
                    showAnswers={showAnswers}
                  />
                </div>
              </div>

              {/* Compact Clues Test */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Compact Clues View:</h3>
                <CompactCrosswordClues 
                  data={crosswordData}
                  showAnswers={showAnswers}
                />
              </div>

              {/* Interactive Player Test */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Interactive Player:</h3>
                <CrosswordPlayer 
                  data={crosswordData}
                  onComplete={(completed) => {
                    if (completed) {
                      alert('Congratulations! You completed the crossword!');
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Click "Generate Test Crossword" to see the crossword generator in action.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
