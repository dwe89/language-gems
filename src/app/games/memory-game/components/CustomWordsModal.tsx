'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface CustomWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartGame: (wordPairs: WordPair[]) => void;
}

export interface WordPair {
  id?: string;
  term: string;
  translation: string;
  type: 'word' | 'image';
  category?: string;
  subcategory?: string;
}

export default function CustomWordsModal({ isOpen, onClose, onStartGame }: CustomWordsModalProps) {
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [pairType, setPairType] = useState<'word' | 'image'>('word');
  const [vocabInput, setVocabInput] = useState('');
  const [wordInput, setWordInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setWordInput('');
      setSelectedImage(null);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Add word pairs from text input
  const handleAddWordPairs = () => {
    if (pairType === 'word' && vocabInput.trim()) {
      const pairs = vocabInput
        .split('\n')
        .map(line => {
          const [term, translation] = line.split(/[,\t]/).map(word => word.trim());
          if (term && translation) {
            return { term, translation, type: 'word' as const };
          }
          return null;
        })
        .filter((pair): pair is NonNullable<typeof pair> => pair !== null);

      if (pairs.length > 0) {
        setWordPairs([...wordPairs, ...pairs]);
        setVocabInput('');
      }
    } else if (pairType === 'image' && wordInput.trim() && selectedImage) {
      const newPair: WordPair = {
        term: wordInput.trim(),
        translation: selectedImage,
        type: 'image'
      };
      setWordPairs([...wordPairs, newPair]);
      setWordInput('');
      setSelectedImage(null);
    }
  };

  // Remove a word pair
  const removeWordPair = (index: number) => {
    const newPairs = [...wordPairs];
    newPairs.splice(index, 1);
    setWordPairs(newPairs);
  };

  // Search for images using Pixabay API
  const searchImages = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const PIXABAY_API_KEY = '48227900-ec6e3d762c2e05db2ab8112f5';
      const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&per_page=12&safesearch=true`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.hits && data.hits.length > 0) {
        setSearchResults(data.hits.map((image: any) => ({
          url: image.webformatURL,
          previewUrl: image.previewURL,
          user: image.user,
          pageUrl: image.pageURL
        })));
      } else {
        setSearchResults([]);
        alert('No images found. Try a different search term.');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      alert('Failed to fetch images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSelectedImage(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Start the game with collected word pairs
  const handleStartGame = () => {
    if (wordPairs.length >= 2) {
      onStartGame(wordPairs);
      onClose();
    } else {
      alert('Please add at least 2 word pairs to start the game.');
    }
  };

  // Show the image search modal
  const openImageSearch = () => {
    if (!wordInput.trim()) {
      alert('Please enter a word first');
      return;
    }
    setSearchQuery(wordInput);
    setShowImageSearch(true);
    searchImages();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="modal-overlay" onClick={() => {
        if (wordPairs.length > 0) {
          if (confirm('Are you sure you want to close? Your word pairs will be lost.')) {
            onClose();
          }
        } else {
          onClose();
        }
      }}></div>
      <div className="modal" id="customWordsModal">
        <div className="modal-content">
          <h2 className="modal-title">Create Your Word Pairs</h2>
          
          <div className="word-pair-inputs">
            <select 
              id="pairType" 
              className="select-style"
              value={pairType}
              onChange={(e) => setPairType(e.target.value as 'word' | 'image')}
            >
              <option value="word">Match words</option>
              <option value="image">Match word to Image</option>
            </select>
            
            <div className="input-group">
              {pairType === 'word' ? (
                <>
                  <p className="input-label">Enter one word pair per line (format: term, translation)</p>
                  <textarea 
                    id="vocabInput" 
                    placeholder="Example:&#10;dog, perro&#10;cat, gato&#10;house, casa" 
                    className="textarea-style"
                    value={vocabInput}
                    onChange={(e) => setVocabInput(e.target.value)}
                  />
                </>
              ) : (
                <div className="word-entry">
                  <input 
                    type="text" 
                    id="spanishWord" 
                    placeholder="Enter word" 
                    className="input-style"
                    value={wordInput}
                    onChange={(e) => setWordInput(e.target.value)}
                  />
                  <button 
                    id="imageSearchTrigger" 
                    className="image-search-btn"
                    onClick={openImageSearch}
                  >
                    🔍
                  </button>
                  <button 
                    id="uploadImageBtn" 
                    className="image-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📤
                  </button>
                  <input 
                    type="file" 
                    id="customImageInput" 
                    accept="image/*" 
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </div>
              )}
            </div>
            
            <button 
              id="addWordPair" 
              className="btn btn-add"
              onClick={handleAddWordPairs}
            >
              Add Pair
            </button>
          </div>
          
          <div className="word-pairs-list-container">
            <h3 className="section-title">Your Word Pairs ({wordPairs.length})</h3>
            {wordPairs.length === 0 ? (
              <div className="empty-state">No word pairs added yet. Add some pairs above.</div>
            ) : (
              <div className="word-pairs-list" id="wordPairsList">
                {wordPairs.map((pair, index) => (
                  <div className="word-pair" key={index}>
                    <div className="word-content">
                      {pair.type === 'image' ? (
                        <img src={pair.translation} alt={pair.term} />
                      ) : (
                        <span>{pair.translation}</span>
                      )}
                      <span>{pair.term}</span>
                    </div>
                    <button 
                      className="delete-btn" 
                      onClick={() => removeWordPair(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="modal-buttons">
            <button 
              id="closeCustomWordsBtn" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              id="startGame" 
              className="btn btn-primary"
              onClick={handleStartGame}
              disabled={wordPairs.length < 2}
            >
              Start Game ({wordPairs.length}/2 pairs minimum)
            </button>
          </div>
        </div>
      </div>

      {/* Image Search Modal */}
      {showImageSearch && (
        <>
          <div className="modal-overlay" onClick={() => setShowImageSearch(false)}></div>
          <div className="modal" id="imageSearchModal">
            <div className="modal-content">
              <h3>Search Images</h3>
              <div className="search-controls">
                <input 
                  type="text" 
                  id="imageSearchInput" 
                  placeholder="Search for images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchImages()}
                />
                <button 
                  className="btn btn-primary" 
                  id="searchImagesBtn"
                  onClick={searchImages}
                >
                  Search
                </button>
              </div>
              
              <div className="image-results" id="imageSearchResults">
                {isLoading && (
                  <div id="imageSearchLoading" className="loading-spinner">
                    Searching...
                  </div>
                )}
                
                {!isLoading && searchResults.length === 0 && searchQuery && (
                  <div className="no-results">No images found. Try a different search term.</div>
                )}
                
                {searchResults.length > 0 && (
                  <>
                    <div className="pixabay-attribution">
                      Images provided by <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer">Pixabay</a>
                    </div>
                    
                    <div className="image-grid">
                      {searchResults.map((image, index) => (
                        <div className="image-result-container" key={index}>
                          <img 
                            src={image.url} 
                            alt="" 
                            className="image-result"
                            onClick={() => {
                              setSelectedImage(image.url);
                              setShowImageSearch(false);
                            }}
                          />
                          <div className="image-credit">
                            by <a href={image.pageUrl} target="_blank" rel="noopener noreferrer">{image.user}</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              <div className="modal-buttons">
                <button 
                  className="btn btn-secondary" 
                  id="closeImageSearch"
                  onClick={() => setShowImageSearch(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .word-pair-inputs {
          width: 100%;
          margin-bottom: 20px;
          background-color: #f5f8ff;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e0e7ff;
        }
        
        .select-style {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: 1px solid #ccd0e1;
          font-size: 1rem;
          background-color: white;
          cursor: pointer;
        }
        
        .input-group {
          margin-bottom: 15px;
        }
        
        .input-label {
          margin-bottom: 8px;
          font-size: 0.9rem;
          color: #4a5568;
        }
        
        .textarea-style {
          width: 100%;
          min-height: 120px;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccd0e1;
          font-size: 1rem;
          resize: vertical;
          font-family: inherit;
        }
        
        .word-entry {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .input-style {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccd0e1;
          font-size: 1rem;
        }
        
        .image-search-btn,
        .image-upload-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 8px;
          border: 1px solid #ccd0e1;
          background-color: white;
          font-size: 1.2rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .image-search-btn:hover,
        .image-upload-btn:hover {
          background-color: #f5f8ff;
        }
        
        .btn {
          padding: 12px 20px;
          border-radius: 8px;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .btn-add {
          background-color: #4f46e5;
          color: white;
          width: 100%;
        }
        
        .btn-add:hover {
          background-color: #4338ca;
        }
        
        .btn-primary {
          background-color: #4f46e5;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #4338ca;
        }
        
        .btn-primary:disabled {
          background-color: #a5b4fc;
          cursor: not-allowed;
        }
        
        .btn-secondary {
          background-color: #e5e7eb;
          color: #4b5563;
        }
        
        .btn-secondary:hover {
          background-color: #d1d5db;
        }
        
        .section-title {
          font-size: 1.1rem;
          margin-bottom: 10px;
          color: #4a5568;
        }
        
        .word-pairs-list-container {
          width: 100%;
          margin-bottom: 20px;
        }
        
        .empty-state {
          padding: 20px;
          text-align: center;
          color: #6b7280;
          background-color: #f9fafb;
          border-radius: 8px;
          border: 1px dashed #d1d5db;
        }
        
        .word-pairs-list {
          width: 100%;
          max-height: 250px;
          overflow-y: auto;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          padding: 5px;
          background-color: white;
        }
        
        .word-pair {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          border-bottom: 1px solid #e5e7eb;
          background-color: white;
        }
        
        .word-pair:last-child {
          border-bottom: none;
        }
        
        .word-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .word-content img {
          max-width: 60px;
          max-height: 60px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }
        
        .delete-btn {
          background: none;
          border: none;
          color: #ef4444;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0 8px;
        }
        
        .delete-btn:hover {
          color: #dc2626;
        }
        
        .modal-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          gap: 10px;
        }
        
        .search-controls {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          width: 100%;
        }
        
        .search-controls input {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccd0e1;
          font-size: 1rem;
        }
        
        .image-results {
          width: 100%;
          max-height: 400px;
          overflow-y: auto;
          margin-bottom: 15px;
        }
        
        .no-results {
          padding: 20px;
          text-align: center;
          color: #6b7280;
          background-color: #f9fafb;
          border-radius: 8px;
          border: 1px dashed #d1d5db;
        }
        
        .pixabay-attribution {
          margin-bottom: 10px;
          font-size: 0.9rem;
          text-align: center;
          color: #6b7280;
        }
        
        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
        }
        
        .image-result-container {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s;
          border: 1px solid #e5e7eb;
        }
        
        .image-result-container:hover {
          transform: scale(1.05);
        }
        
        .image-result {
          width: 100%;
          aspect-ratio: 1;
          object-fit: cover;
        }
        
        .image-credit {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 3px 5px;
          font-size: 0.7rem;
          text-align: center;
        }
        
        .image-credit a {
          color: #93c5fd;
          text-decoration: none;
        }
        
        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 30px;
          font-style: italic;
          color: #6b7280;
        }
      `}</style>
    </>,
    document.body
  );
} 