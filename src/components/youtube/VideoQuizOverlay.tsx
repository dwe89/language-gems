'use client';

import React, { useState, useEffect } from 'react';
import { VideoPlayerHandle } from './VideoPlayer';

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizPoint {
  id: number;
  timestamp: number; // Timestamp in seconds when the quiz should appear
  question: string;
  options: QuizOption[];
  explanation?: string;
}

interface VideoQuizOverlayProps {
  videoPlayerRef: React.RefObject<VideoPlayerHandle | null>;
  quizPoints: QuizPoint[];
  isActive: boolean;
  onQuizComplete: (quizPointId: number, isCorrect: boolean) => void;
  onClose: () => void;
  currentTimestamp?: number;
}

const VideoQuizOverlay: React.FC<VideoQuizOverlayProps> = ({
  videoPlayerRef,
  quizPoints,
  isActive,
  onQuizComplete,
  onClose,
  currentTimestamp = 0,
}) => {
  const [currentQuiz, setCurrentQuiz] = useState<QuizPoint | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // Find the current quiz based on timestamp
  useEffect(() => {
    if (!isActive || !currentTimestamp) return;

    // Find the quiz point that should be shown at the current timestamp
    // We show a quiz if we're within 2 seconds after its timestamp
    const quizToShow = quizPoints.find(
      quiz => currentTimestamp >= quiz.timestamp && 
              currentTimestamp <= quiz.timestamp + 2
    );

    if (quizToShow && quizToShow !== currentQuiz) {
      setCurrentQuiz(quizToShow);
      setSelectedOption(null);
      setShowFeedback(false);
      // Pause the video when a quiz appears
      if (videoPlayerRef.current) {
        const playerState = videoPlayerRef.current.getPlayerState();
        if (playerState === 1) { // YT.PlayerState.PLAYING
          videoPlayerRef.current.seekTo(quizToShow.timestamp);
          // Short delay to ensure the video pauses at the right spot
          setTimeout(() => {
            if (videoPlayerRef.current) {
              videoPlayerRef.current.pauseVideo();
            }
          }, 100);
        }
      }
    }
  }, [currentTimestamp, isActive, quizPoints, currentQuiz, videoPlayerRef]);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || !currentQuiz) return;
    
    // Check if the selected answer is correct
    const correct = currentQuiz.options[selectedOption].isCorrect;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Notify parent component about quiz completion
    onQuizComplete(currentQuiz.id, correct);
  };

  const handleContinue = () => {
    // Reset quiz state
    setSelectedOption(null);
    setShowFeedback(false);
    setCurrentQuiz(null);
    
    // Resume video playback
    if (videoPlayerRef.current) {
      videoPlayerRef.current.playVideo();
    }
    
    onClose();
  };

  if (!isActive || !currentQuiz) return null;

  return (
    <div className="video-quiz-overlay">
      <div className="quiz-container">
        {!showFeedback ? (
          <>
            <h3 className="quiz-question">{currentQuiz.question}</h3>
            <div className="quiz-options">
              {currentQuiz.options.map((option, index) => (
                <button
                  key={index}
                  className={`quiz-option ${selectedOption === index ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(index)}
                >
                  {option.text}
                </button>
              ))}
            </div>
            <div className="quiz-controls">
              <button 
                className="submit-button" 
                onClick={handleSubmit}
                disabled={selectedOption === null}
              >
                Submit
              </button>
              <button className="skip-button" onClick={handleContinue}>
                Skip
              </button>
            </div>
          </>
        ) : (
          <div className={`quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            <h3>{isCorrect ? 'Correct!' : 'Incorrect'}</h3>
            {currentQuiz.explanation && <p>{currentQuiz.explanation}</p>}
            <button className="continue-button" onClick={handleContinue}>
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoQuizOverlay; 