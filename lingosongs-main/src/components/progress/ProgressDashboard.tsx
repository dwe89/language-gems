'use client';

import React from 'react';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useProgress } from '@/components/progress/ProgressContext';

interface ProgressDashboardProps {
  language?: string;
}

export default function ProgressDashboard({ language = 'spanish' }: ProgressDashboardProps) {
  const { stats: vocabStats, loading: vocabLoading } = useVocabulary();
  const { progress, isLoading: progressLoading } = useProgress();
  
  if (vocabLoading || progressLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Get language-specific progress
  const languageProgress = progress.languageProgress[language] || 0;
  
  // Get completed videos count
  const completedVideos = Object.entries(progress.videoProgress)
    .filter(([_, percentage]) => percentage >= 90)
    .length;
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Learning Progress</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {/* Words Learned */}
        <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg text-white flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold mb-1">{vocabStats.wordsLearned}</div>
          <div className="text-xs uppercase tracking-wide opacity-80">Words Learned</div>
        </div>
        
        {/* Quiz Accuracy */}
        <div className="p-4 bg-gradient-to-br from-green-500 to-green-700 rounded-lg text-white flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold mb-1">
            {Math.round(Object.values(progress.quizScores).reduce((sum, score) => sum + score, 0) / 
              (Object.values(progress.quizScores).length || 1))}%
          </div>
          <div className="text-xs uppercase tracking-wide opacity-80">Quiz Accuracy</div>
        </div>
        
        {/* Minutes Practiced */}
        <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg text-white flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold mb-1">{vocabStats.minutesPracticed}</div>
          <div className="text-xs uppercase tracking-wide opacity-80">Minutes Practiced</div>
        </div>
        
        {/* Day Streak */}
        <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-lg text-white flex flex-col items-center justify-center text-center">
          <div className="text-3xl font-bold mb-1">{vocabStats.dayStreak}</div>
          <div className="text-xs uppercase tracking-wide opacity-80">Day Streak</div>
        </div>
      </div>
      
      {/* Progress Bars */}
      <div className="space-y-6">
        {/* Language Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Language Progress</h3>
            <span className="text-sm text-gray-500">{languageProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${languageProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Videos Completed */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Videos Completed</h3>
            <span className="text-sm text-gray-500">{completedVideos}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, completedVideos * 5)}%` }}
            ></div>
          </div>
        </div>
        
        {/* Words to Review */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">Words Due for Review</h3>
            <span className="text-sm text-gray-500">{vocabStats.wordsToReview}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-yellow-500 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, vocabStats.wordsToReview * 5)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
} 