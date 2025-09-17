'use client';

import React, { useState, useEffect, useCallback } from 'react';

export interface LyricLine {
  id: number;
  timestamp: number; // Timestamp in seconds
  text: string; // Original lyrics line
  translation?: string; // Optional translation
}

export interface LyricsGap {
  lineId: number;
  word: string;
  index: number; // Position of the word in the line
}

interface VideoLyricsOverlayProps {
  lyrics: LyricLine[];
  isActive: boolean;
  onGapFilled: (lineId: number, word: string, isCorrect: boolean) => void;
  currentTimestamp?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

const VideoLyricsOverlay: React.FC<VideoLyricsOverlayProps> = ({
  lyrics,
  isActive,
  onGapFilled,
  currentTimestamp = 0,
  difficulty = 'medium'
}) => {
  const [currentLines, setCurrentLines] = useState<LyricLine[]>([]);
  // Create gaps in lyrics based on difficulty
  const createGapsForLines = useCallback((lines: LyricLine[]) => {
    const newGaps: LyricsGap[] = [];
    const gapFrequency = difficulty === 'easy' ? 0.15 : difficulty === 'medium' ? 0.25 : 0.4;

    lines.forEach(line => {
      const words = line.text.split(' ');
      
      // Create a list of candidate indices for gaps (exclude very short words)
      const candidates = words
        .map((word, idx) => ({ word, idx }))
        .filter(({ word }) => word.length > 2) // Only make gaps for words longer than 2 characters
        .map(({ idx }) => idx);
      
      // Shuffle candidates and choose a subset based on difficulty
      const shuffled = [...candidates].sort(() => 0.5 - Math.random());
      const selectedIndices = shuffled.slice(0, Math.ceil(words.length * gapFrequency));
      
      // Create gap objects for the selected words
      selectedIndices.forEach(index => {
        newGaps.push({
          lineId: line.id,
          word: words[index],
          index
        });
      });
    });

    setGaps(prev => [...prev, ...newGaps]);
  }, [difficulty]);

  const [gaps, setGaps] = useState<LyricsGap[]>([]);
  const [selectedGap, setSelectedGap] = useState<LyricsGap | null>(null);
  const [userAnswers, setUserAnswers] = useState<{[key: string]: string}>({});
  const [score, setScore] = useState(0);

  // Create a unique key for a gap
  const getGapKey = (gap: LyricsGap) => `${gap.lineId}-${gap.index}`;

  // Find current lyric lines based on timestamp
  useEffect(() => {
    if (!isActive || lyrics.length === 0) return;

    // Find the current and next line based on timestamp
    const currentIndex = lyrics.findIndex(
      line => currentTimestamp >= line.timestamp && 
              (lyrics[lyrics.indexOf(line) + 1] 
                ? currentTimestamp < lyrics[lyrics.indexOf(line) + 1].timestamp 
                : true)
    );

    if (currentIndex !== -1) {
      // Get current line and a few next lines to display
      const linesToShow = lyrics.slice(currentIndex, currentIndex + 3);
      setCurrentLines(linesToShow);
      
      // Create gaps for the current line if not already created
      if (linesToShow.length > 0 && gaps.filter(g => g.lineId === linesToShow[0].id).length === 0) {
        createGapsForLines(linesToShow);
      }
    }
  }, [currentTimestamp, isActive, lyrics, gaps, createGapsForLines]);

  // Select a gap to fill
  const handleGapClick = (gap: LyricsGap) => {
    setSelectedGap(gap);
  };

  // Handle word selection from options
  const handleWordSelect = (word: string) => {
    if (!selectedGap) return;
    
    const gapKey = getGapKey(selectedGap);
    const isCorrect = word.toLowerCase() === selectedGap.word.toLowerCase();
    
    // Update user answers
    setUserAnswers(prev => ({
      ...prev,
      [gapKey]: word
    }));
    
    // Update score
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Notify parent component
    onGapFilled(selectedGap.lineId, word, isCorrect);
    
    // Clear selected gap
    setSelectedGap(null);
  };

  // Get display text for a line with gaps
  const getLineDisplay = (line: LyricLine) => {
    const words = line.text.split(' ');
    
    return words.map((word, index) => {
      const gap = gaps.find(g => g.lineId === line.id && g.index === index);
      
      if (gap) {
        const gapKey = getGapKey(gap);
        const userAnswer = userAnswers[gapKey];
        
        if (userAnswer) {
          const isCorrect = userAnswer.toLowerCase() === gap.word.toLowerCase();
          return (
            <span 
              key={`word-${line.id}-${index}`}
              className={`video-lyrics-word ${isCorrect ? 'correct' : 'incorrect'}`}
            >
              {userAnswer}
            </span>
          );
        }
        
        return (
          <span 
            key={`gap-${line.id}-${index}`}
            className="video-lyrics-gap"
            onClick={() => handleGapClick(gap)}
          >
            {selectedGap && getGapKey(selectedGap) === gapKey ? '🔵' : '___'}
          </span>
        );
      }
      
      return (
        <span 
          key={`word-${line.id}-${index}`}
          className="video-lyrics-word"
        >
          {word}
        </span>
      );
    });
  };

  // Get options for the selected gap
  const getOptions = () => {
    if (!selectedGap) return [];
    
    // Include the correct word and random words from other gaps
    const correctWord = selectedGap.word;
    const otherWords = gaps
      .filter(g => g.word.toLowerCase() !== correctWord.toLowerCase())
      .map(g => g.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    // Combine and shuffle
    return [...otherWords, correctWord].sort(() => 0.5 - Math.random());
  };

  if (!isActive || currentLines.length === 0) return null;

  return (
    <div className="video-lyrics-overlay">
      <div className="score-display">Score: {score}</div>
      
      {currentLines.map(line => (
        <div key={`line-${line.id}`} className="video-lyrics-line">
          {getLineDisplay(line)}
        </div>
      ))}
      
      {selectedGap && (
        <div className="video-lyrics-options">
          {getOptions().map((word, index) => (
            <button
              key={`option-${index}`}
              className="video-lyrics-option"
              onClick={() => handleWordSelect(word)}
            >
              {word}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoLyricsOverlay; 