'use client';

import React, { useState } from 'react';
import LanguageTopicSelector from './components/LanguageTopicSelector';
import MemoryGameMain from './components/MemoryGameMain';
import CustomWordsModal from './components/CustomWordsModal';
import { WordPair } from './components/CustomWordsModal';
import './styles.css';

export default function MemoryGamePage() {
  const [stage, setStage] = useState<'selector' | 'game'>('selector');
  const [gameOptions, setGameOptions] = useState({
    language: '',
    topic: '',
    difficulty: ''
  });
  const [customWords, setCustomWords] = useState<WordPair[]>([]);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const handleStartGame = (language: string, topic: string, difficulty: string) => {
    setGameOptions({
      language,
      topic,
      difficulty
    });

    if (topic.toLowerCase() === 'custom') {
      setShowCustomModal(true);
    } else {
      setStage('game');
    }
  };

  const handleCustomWordsStart = (wordPairs: WordPair[]) => {
    setCustomWords(wordPairs);
    setStage('game');
  };

  const handleBackToSettings = () => {
    setStage('selector');
    setCustomWords([]);
  };

  return (
    <div className="memory-game-container">
      {stage === 'selector' ? (
        <LanguageTopicSelector onStartGame={handleStartGame} />
      ) : (
        <MemoryGameMain 
          language={gameOptions.language} 
          topic={gameOptions.topic} 
          difficulty={gameOptions.difficulty}
          onBackToSettings={handleBackToSettings}
          customWords={customWords.length > 0 ? customWords : undefined}
        />
      )}

      <CustomWordsModal 
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onStartGame={handleCustomWordsStart}
      />
    </div>
  );
} 