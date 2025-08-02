'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface LanguageTopicSelectorProps {
  onStartGame: (
    language: string, 
    topic: string, 
    difficulty: string,
    customPairs?: Array<{ term: string, translation: string }>
  ) => void;
}

// Available languages and topics
const LANGUAGES = [
  { code: 'spanish', name: 'Spanish', color: 'bg-red-100 border-red-300 text-red-700' },
  { code: 'french', name: 'French', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { code: 'german', name: 'German', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },

];

// Category structure with hierarchical organization
const CATEGORY_GROUPS = [
  {
    id: 'basics',
    name: 'Basics',
    categories: [
      { code: 'numbers', name: 'Numbers', emoji: '🔢', bgColor: 'bg-blue-50' },
      { code: 'colors', name: 'Colors', emoji: '🎨', bgColor: 'bg-green-50' },
      { code: 'days', name: 'Days of the Week', emoji: '📅', bgColor: 'bg-yellow-50' },
      { code: 'months', name: 'Months & Seasons', emoji: '🍂', bgColor: 'bg-orange-50' },
      { code: 'greetings', name: 'Greetings & Introductions', emoji: '👋', bgColor: 'bg-purple-50' },
      { code: 'phrases', name: 'Common Phrases', emoji: '💬', bgColor: 'bg-indigo-50' },
    ]
  },
  {
    id: 'people',
    name: 'People & Relationships',
    categories: [
      { code: 'family', name: 'Family Members', emoji: '👪', bgColor: 'bg-pink-50' },
      { code: 'physicaltraits', name: 'Physical Traits', emoji: '👤', bgColor: 'bg-amber-50' },
      { code: 'personality', name: 'Personality Traits', emoji: '😊', bgColor: 'bg-teal-50' },
      { code: 'professions', name: 'Professions & Jobs', emoji: '👨‍⚕️', bgColor: 'bg-emerald-50' },
    ]
  },
  {
    id: 'daily',
    name: 'Home & Daily Life',
    categories: [
      { code: 'household', name: 'Household Items', emoji: '🏠', bgColor: 'bg-red-50' },
      { code: 'rooms', name: 'Rooms in a House', emoji: '🛋️', bgColor: 'bg-blue-50' },
      { code: 'routines', name: 'Daily Routines & Chores', emoji: '🧹', bgColor: 'bg-green-50' },
    ]
  },
  {
    id: 'food',
    name: 'Food & Drinks',
    categories: [
      { code: 'foods', name: 'Common Foods', emoji: '🍔', bgColor: 'bg-yellow-50' },
      { code: 'drinks', name: 'Drinks & Beverages', emoji: '🥤', bgColor: 'bg-purple-50' },
      { code: 'fruitsveg', name: 'Fruits & Vegetables', emoji: '🍎', bgColor: 'bg-indigo-50' },
      { code: 'restaurant', name: 'Restaurant & Ordering Food', emoji: '🍽️', bgColor: 'bg-pink-50' },
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Transportation',
    categories: [
      { code: 'countries', name: 'Countries & Nationalities', emoji: '🌎', bgColor: 'bg-amber-50' },
      { code: 'directions', name: 'Directions & Places', emoji: '🧭', bgColor: 'bg-teal-50' },
      { code: 'transport', name: 'Methods of Transport', emoji: '🚆', bgColor: 'bg-emerald-50' },
    ]
  },
  {
    id: 'nature',
    name: 'Nature & Environment',
    categories: [
      { code: 'weather', name: 'Weather', emoji: '☀️', bgColor: 'bg-blue-50' },
      { code: 'animals', name: 'Animals', emoji: '🐾', bgColor: 'bg-green-50' },
      { code: 'plants', name: 'Plants & Trees', emoji: '🌳', bgColor: 'bg-yellow-50' },
    ]
  },
  {
    id: 'other',
    name: 'Other',
    categories: [
      { code: 'custom', name: 'Custom Words', emoji: '✏️', bgColor: 'bg-purple-50' },
    ]
  }
];

// Original topics for backwards compatibility
const TOPICS = [
  { code: 'animals', name: 'Animals', emoji: '🐾', bgColor: 'bg-blue-50' },
  { code: 'colors', name: 'Colors', emoji: '🎨', bgColor: 'bg-green-50' },
  { code: 'food', name: 'Food', emoji: '🍔', bgColor: 'bg-yellow-50' },
  { code: 'countries', name: 'Countries', emoji: '🌎', bgColor: 'bg-red-50' },
  { code: 'numbers', name: 'Numbers', emoji: '🔢', bgColor: 'bg-purple-50' },
  { code: 'custom', name: 'Custom', emoji: '✏️', bgColor: 'bg-indigo-50' }
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
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string | null>(null);
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [tempCategory, setTempCategory] = useState('');
  const [tempCategoryWords, setTempCategoryWords] = useState('');
  const [customPairs, setCustomPairs] = useState<Array<{ term: string, translation: string }>>([]);

  // Handle language selection
  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setStep('topic');
  };

  // Handle topic selection with category groups
  const handleTopicSelect = (topicCode: string) => {
    if (topicCode === 'custom') {
      setSelectedTopic(topicCode);
      // For custom topic, skip difficulty selection
      onStartGame(selectedLanguage, topicCode, 'custom');
    } else {
      setSelectedTopic(topicCode);
      setStep('difficulty');
    }
  };

  // Handle difficulty selection
  const handleDifficultySelect = (difficultyCode: string) => {
    setSelectedDifficulty(difficultyCode);
    onStartGame(selectedLanguage, selectedTopic, difficultyCode);
  };

  // Handle temporary category submission
  const handleTempCategorySubmit = () => {
    if (tempCategory && tempCategoryWords) {
      // Parse the comma-separated words into pairs
      const lines = tempCategoryWords.split('\n');
      const pairs = lines.map(line => {
        const [term, translation] = line.split(',').map(item => item.trim());
        return { term, translation };
      }).filter(pair => pair.term && pair.translation);

      if (pairs.length >= 3) {
        setCustomPairs(pairs);
        setSelectedTopic('custom');
        onStartGame(selectedLanguage, 'custom', 'custom', pairs);
        setShowAddCategoryModal(false);
      }
    }
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
          <div className="selection-grid language-grid">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                className={`language-button ${language.color}`}
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
          
          {/* Show category groups if no group is selected */}
          {!selectedCategoryGroup && (
            <>
              <div className="category-groups-grid">
                {CATEGORY_GROUPS.map((group) => (
                  <button
                    key={group.id}
                    className="category-group-button"
                    onClick={() => setSelectedCategoryGroup(group.id)}
                  >
                    <span className="group-name">{group.name}</span>
                    <span className="group-arrow">→</span>
                  </button>
                ))}
              </div>
              
              <div className="custom-options">
                <button
                  className="custom-option-button"
                  onClick={() => setShowAddCategoryModal(true)}
                >
                  Add Temporary Category
                </button>
              </div>
            </>
          )}
          
          {/* Show categories within a group if a group is selected */}
          {selectedCategoryGroup && (
            <>
              <div className="back-to-groups">
                <button 
                  className="back-to-groups-button"
                  onClick={() => setSelectedCategoryGroup(null)}
                >
                  ← Back to Categories
                </button>
                <h3 className="group-title">
                  {CATEGORY_GROUPS.find(g => g.id === selectedCategoryGroup)?.name}
                </h3>
              </div>
              
              <div className="categories-grid">
                {CATEGORY_GROUPS
                  .find(g => g.id === selectedCategoryGroup)
                  ?.categories.map((category) => (
                    <button
                      key={category.code}
                      className={`category-button ${category.bgColor}`}
                      onClick={() => handleTopicSelect(category.code)}
                    >
                      <span className="category-emoji">{category.emoji}</span>
                      <span className="category-name">{category.name}</span>
                    </button>
                  ))}
              </div>
            </>
          )}
          
          {/* Add Category Modal */}
          {showAddCategoryModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Add Temporary Category</h3>
                <div className="modal-form">
                  <div className="form-group">
                    <label>Category Name</label>
                    <input
                      type="text"
                      value={tempCategory}
                      onChange={(e) => setTempCategory(e.target.value)}
                      placeholder="e.g., Medical Terms"
                    />
                  </div>
                  <div className="form-group">
                    <label>Word Pairs (one pair per line, comma separated)</label>
                    <textarea
                      value={tempCategoryWords}
                      onChange={(e) => setTempCategoryWords(e.target.value)}
                      placeholder="doctor, médico
nurse, enfermera
hospital, hospital"
                      rows={6}
                    ></textarea>
                  </div>
                  <div className="modal-actions">
                    <button 
                      className="cancel-button"
                      onClick={() => setShowAddCategoryModal(false)}
                    >
                      Cancel
                    </button>
                    <button 
                      className="submit-button"
                      onClick={handleTempCategorySubmit}
                    >
                      Add Category
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
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

        .language-grid {
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        }
        
        .language-button {
          padding: 15px;
          font-size: 16px;
          border-radius: 10px;
          border: 2px solid transparent;
          transition: all 0.3s ease;
          font-weight: 500;
          text-align: center;
        }
        
        .category-groups-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }
        
        .category-group-button {
          background-color: #f0f0f0;
          border: 2px solid #e0e0e0;
          border-radius: 10px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
        }
        
        .category-group-button:hover {
          border-color: #9c27b0;
          background-color: #f3e5f5;
        }
        
        .group-name {
          font-weight: 500;
          font-size: 16px;
          color: #333;
        }
        
        .group-arrow {
          color: #9c27b0;
          font-weight: bold;
        }
        
        .back-to-groups {
          margin-bottom: 20px;
        }
        
        .back-to-groups-button {
          background: none;
          border: none;
          color: #9c27b0;
          font-weight: 500;
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 5px 0;
          margin-bottom: 10px;
        }
        
        .group-title {
          font-size: 18px;
          color: #333;
          margin-bottom: 15px;
        }
        
        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }
        
        .category-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          border-radius: 10px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .category-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .category-emoji {
          font-size: 30px;
          margin-bottom: 10px;
        }
        
        .category-name {
          font-weight: 500;
          text-align: center;
          font-size: 14px;
        }
        
        .custom-options {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        
        .custom-option-button {
          background-color: #e0f7fa;
          border: 2px solid #80deea;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 500;
          color: #00838f;
          transition: all 0.3s ease;
        }
        
        .custom-option-button:hover {
          background-color: #b2ebf2;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: white;
          padding: 25px;
          border-radius: 15px;
          width: 90%;
          max-width: 500px;
          color: #333;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .modal-content h3 {
          margin-top: 0;
          color: #333;
          font-size: 20px;
          margin-bottom: 20px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #555;
        }
        
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        .cancel-button {
          background-color: #e0e0e0;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          font-weight: 500;
        }
        
        .submit-button {
          background-color: #4caf50;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
} 