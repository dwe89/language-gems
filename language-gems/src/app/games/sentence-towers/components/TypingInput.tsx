'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, RotateCcw } from 'lucide-react';

interface TypingInputProps {
  expectedAnswer: string;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
  disabled: boolean;
}

export const TypingInput: React.FC<TypingInputProps> = ({ 
  expectedAnswer, 
  onCorrectAnswer, 
  onIncorrectAnswer, 
  disabled 
}) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input when component mounts or is re-enabled
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Reset input when expected answer changes
  useEffect(() => {
    setInput('');
    setError(false);
  }, [expectedAnswer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (disabled) return;
    
    const normalizedInput = input.trim().toLowerCase();
    const normalizedExpected = expectedAnswer.trim().toLowerCase();
    
    // Allow for minor typing errors (80% similarity is considered correct)
    if (normalizedInput === normalizedExpected || isCloseEnough(normalizedInput, normalizedExpected)) {
      onCorrectAnswer();
      setInput('');
      setError(false);
    } else {
      setError(true);
      onIncorrectAnswer();
      
      // Clear error after a while
      setTimeout(() => {
        setError(false);
      }, 1500);
    }
  };
  
  // Basic function to check if strings are close enough (could be improved with better algorithms)
  const isCloseEnough = (a: string, b: string) => {
    // Simple check for typos - allowing one character difference for words < 5 chars
    // and two character differences for longer words
    const maxDiff = b.length < 5 ? 1 : 2;
    let differences = 0;
    
    // If lengths are too different, it's not close enough
    if (Math.abs(a.length - b.length) > maxDiff) {
      return false;
    }
    
    // For short answers, just check if one string contains the other
    if (b.length < 4 && (a.includes(b) || b.includes(a))) {
      return true;
    }
    
    // For longer answers, simple character comparison
    // This is a very basic implementation and could be improved
    const longer = a.length >= b.length ? a : b;
    const shorter = a.length >= b.length ? b : a;
    
    let j = 0;
    for (let i = 0; i < longer.length && j < shorter.length; i++) {
      if (longer[i] === shorter[j]) {
        j++;
      } else {
        differences++;
        if (differences > maxDiff) return false;
      }
    }
    
    // Add remaining length differences
    differences += longer.length - shorter.length;
    
    return differences <= maxDiff;
  };
  
  const handleReset = () => {
    setInput('');
    setError(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Type your answer here..."
          className={`w-full px-4 py-3 rounded-lg bg-slate-700 text-white border ${
            error ? 'border-red-500 animate-shake' : 'border-slate-600'
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
          {input && (
            <button
              type="button"
              onClick={handleReset}
              disabled={disabled}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-full"
            >
              <RotateCcw size={16} />
            </button>
          )}
          
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className={`p-2 rounded-full ${
              !input.trim() || disabled
                ? 'text-slate-500 cursor-not-allowed'
                : 'text-indigo-400 hover:text-indigo-300'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
      
      {error && (
        <motion.p 
          className="text-red-400 text-sm mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Incorrect. Try again.
        </motion.p>
      )}
    </motion.form>
  );
}; 