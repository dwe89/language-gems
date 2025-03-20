'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LanguageTopicSelectorProps {
  onStartGame: (language: string, topic: string, difficulty: string) => void;
}

// Available languages and topics
const LANGUAGES = [
  { code: 'english', name: 'English' },
  { code: 'spanish', name: 'Spanish' },
  { code: 'french', name: 'French' },
  { code: 'german', name: 'German' },
  { code: 'italian', name: 'Italian' },
  { code: 'portuguese', name: 'Portuguese' },
  { code: 'chinese', name: 'Chinese' },
  { code: 'japanese', name: 'Japanese' },
  { code: 'korean', name: 'Korean' },
  { code: 'arabic', name: 'Arabic' },
  { code: 'russian', name: 'Russian' }
];

const TOPICS = [
  { code: 'animals', name: 'Animals' },
  { code: 'colors', name: 'Colors' },
  { code: 'food', name: 'Food' },
  { code: 'countries', name: 'Countries' },
  { code: 'numbers', name: 'Numbers' },
  { code: 'custom', name: 'Custom' }
];

const DIFFICULTIES = [
  { code: 'easy-1', name: 'Easy (3×2)', pairs: 3, grid: '3x2' },
  { code: 'easy-2', name: 'Easy (4×2)', pairs: 4, grid: '4x2' },
  { code: 'medium-1', name: 'Medium (5×2)', pairs: 5, grid: '5x2' },
  { code: 'medium-2', name: 'Medium (4×3)', pairs: 6, grid: '4x3' },
  { code: 'hard-2', name: 'Hard (4×4)', pairs: 8, grid: '4x4' },
  { code: 'expert', name: 'Expert (5×4)', pairs: 10, grid: '5x4' }
];

export default function LanguageTopicSelector({ onStartGame }: LanguageTopicSelectorProps) {
  // State for selection step, language, and topic
  const [step, setStep] = useState<'language' | 'topic' | 'difficulty'>('language');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');

  // Handle language selection
  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setStep('topic');
  };

  // Handle topic selection
  const handleTopicSelect = (topicCode: string) => {
    setSelectedTopic(topicCode);
    if (topicCode.toLowerCase() === 'custom') {
      // For custom topic, skip difficulty selection
      onStartGame(selectedLanguage, topicCode, 'custom');
    } else {
      setStep('difficulty');
    }
  };

  // Handle difficulty selection
  const handleDifficultySelect = (difficultyCode: string) => {
    setSelectedDifficulty(difficultyCode);
    onStartGame(selectedLanguage, selectedTopic, difficultyCode);
  };

  // Go back to previous step
  const goBack = () => {
    if (step === 'topic') {
      setStep('language');
    } else if (step === 'difficulty') {
      setStep('topic');
    }
  };

  return (
    <div className="selector-container">
      <div className="selector-header">
        <Link href="/games" className="back-button">
          <i className="fas fa-arrow-left"></i> Back to Games
        </Link>
        <h1>Memory Match Game</h1>
        <div className="progress-indicator">
          <div className={`step ${step === 'language' ? 'active' : (step === 'topic' || step === 'difficulty') ? 'completed' : ''}`}>1</div>
          <div className="connector"></div>
          <div className={`step ${step === 'topic' ? 'active' : step === 'difficulty' ? 'completed' : ''}`}>2</div>
          <div className="connector"></div>
          <div className={`step ${step === 'difficulty' ? 'active' : ''}`}>3</div>
        </div>
      </div>

      {step === 'language' && (
        <div className="selection-step">
          <h2>Choose a Language</h2>
          <div className="selection-grid">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                className="selection-button"
                onClick={() => handleLanguageSelect(language.code)}
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'topic' && (
        <div className="selection-step">
          <h2>Choose a Topic</h2>
          <div className="selection-grid">
            {TOPICS.map((topic) => (
              <button
                key={topic.code}
                className="selection-button"
                onClick={() => handleTopicSelect(topic.code)}
              >
                {topic.name}
              </button>
            ))}
          </div>
          <button className="back-button-secondary" onClick={goBack}>
            <i className="fas fa-arrow-left"></i> Back to Languages
          </button>
        </div>
      )}

      {step === 'difficulty' && (
        <div className="selection-step">
          <h2>Choose Difficulty</h2>
          <div className="difficulty-grid">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty.code}
                className="difficulty-button"
                onClick={() => handleDifficultySelect(difficulty.code)}
              >
                <div className="difficulty-info">
                  <span className="difficulty-name">{difficulty.name}</span>
                  <span className="difficulty-detail">{difficulty.pairs} pairs</span>
                  <span className="difficulty-grid">{difficulty.grid} grid</span>
                </div>
                <div className="grid-preview">
                  {difficulty.code === 'easy-1' && (
                    <div className="preview-grid grid-3x2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="preview-card"></div>
                      ))}
                    </div>
                  )}
                  {difficulty.code === 'easy-2' && (
                    <div className="preview-grid grid-4x2">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="preview-card"></div>
                      ))}
                    </div>
                  )}
                  {difficulty.code === 'medium-1' && (
                    <div className="preview-grid grid-5x2">
                      {[...Array(10)].map((_, i) => (
                        <div key={i} className="preview-card"></div>
                      ))}
                    </div>
                  )}
                  {difficulty.code === 'medium-2' && (
                    <div className="preview-grid grid-4x3">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="preview-card"></div>
                      ))}
                    </div>
                  )}
                  {difficulty.code === 'hard-2' && (
                    <div className="preview-grid grid-4x4">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="preview-card"></div>
                      ))}
                    </div>
                  )}
                  {difficulty.code === 'expert' && (
                    <div className="preview-grid grid-5x4">
                      {[...Array(20)].map((_, i) => (
                        <div key={i} className="preview-card"></div>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
          <button className="back-button-secondary" onClick={goBack}>
            <i className="fas fa-arrow-left"></i> Back to Topics
          </button>
        </div>
      )}

      {/* Add Font Awesome */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
      />

      <style jsx>{`
        .selector-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
          padding: 20px;
          color: white;
        }

        .selector-header {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: center;
          margin-bottom: 30px;
          position: relative;
        }

        .selector-header h1 {
          font-size: 2.5rem;
          margin: 15px 0;
          text-align: center;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .progress-indicator {
          display: flex;
          align-items: center;
          margin-top: 15px;
        }

        .step {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          transition: all 0.3s ease;
        }

        .step.active {
          background-color: white;
          color: #d76d77;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
          transform: scale(1.1);
        }

        .step.completed {
          background-color: #86efac;
          color: #065f46;
        }

        .connector {
          width: 40px;
          height: 3px;
          background-color: rgba(255, 255, 255, 0.2);
        }

        .back-button {
          position: absolute;
          top: 10px;
          left: 10px;
          color: white;
          text-decoration: none;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 15px;
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 20px;
          transition: background-color 0.3s;
        }

        .back-button:hover {
          background-color: rgba(0, 0, 0, 0.4);
        }

        .back-button-secondary {
          margin-top: 20px;
          color: white;
          text-decoration: none;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 15px;
          background-color: rgba(0, 0, 0, 0.2);
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .back-button-secondary:hover {
          background-color: rgba(0, 0, 0, 0.4);
        }

        .selection-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 800px;
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .selection-step h2 {
          font-size: 1.8rem;
          margin-bottom: 20px;
          text-align: center;
          text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.2);
        }

        .selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
          width: 100%;
        }

        .difficulty-options {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 100%;
          max-width: 600px;
        }

        .difficulty-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          width: 100%;
          max-width: 800px;
        }

        .difficulty-button {
          display: flex;
          flex-direction: column;
          background-color: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 15px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          width: 100%;
        }

        .difficulty-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
          margin-bottom: 10px;
        }

        .difficulty-name {
          font-size: 1.3rem;
          font-weight: 600;
        }

        .difficulty-detail, .difficulty-grid {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .grid-preview {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 8px;
          width: 100%;
        }

        .preview-grid {
          display: grid;
          gap: 4px;
          width: 100%;
          aspect-ratio: var(--aspect-ratio, 1);
        }

        .grid-3x2 {
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(2, 1fr);
          --aspect-ratio: 3/2;
        }

        .grid-4x2 {
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, 1fr);
          --aspect-ratio: 2/1;
        }

        .grid-5x2 {
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(2, 1fr);
          --aspect-ratio: 5/2;
        }

        .grid-4x3 {
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          --aspect-ratio: 4/3;
        }

        .grid-4x4 {
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(4, 1fr);
          --aspect-ratio: 1/1;
        }

        .grid-5x4 {
          grid-template-columns: repeat(5, 1fr);
          grid-template-rows: repeat(4, 1fr);
          --aspect-ratio: 5/4;
        }

        .preview-card {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          width: 100%;
          height: 100%;
          min-height: 15px;
        }

        .difficulty-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-3px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 800px) {
          .difficulty-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 1200px) {
          .difficulty-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 600px) {
          .selector-header h1 {
            font-size: 1.8rem;
          }

          .selection-step {
            padding: 20px 15px;
          }

          .selection-grid {
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 10px;
          }
          
          .difficulty-button {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

          .grid-preview {
            width: 100%;
            margin-top: 10px;
          }
          
          .step {
            width: 30px;
            height: 30px;
            font-size: 0.9rem;
          }
          
          .connector {
            width: 25px;
          }
        }
      `}</style>
    </div>
  );
} 