/**
 * Example integration of the Dual-Track Reward System
 * Shows how to use Activity Gem feedback and consolidated XP display
 */

'use client';

import React, { useState } from 'react';
import { RewardEngine, GemRarity } from '../services/rewards/RewardEngine';
import ActivityGemFeedback, { useActivityGemFeedback } from '../components/rewards/ActivityGemFeedback';
import ConsolidatedXPDisplay from '../components/rewards/ConsolidatedXPDisplay';

// Mock XP data for demonstration
const mockXPData = {
  totalXP: 1250,
  masteryXP: 575,   // 46% from mastery gems (higher value)
  activityXP: 675,  // 54% from activity gems (lower value each)
  totalMasteryGems: 15,   // Fewer mastery gems
  totalActivityGems: 135, // Many more activity gems
  totalGems: 150
};

export default function DualTrackIntegrationExample() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const { feedback, showActivityGem, hideActivityGem } = useActivityGemFeedback();

  // Simulate answering a question correctly
  const handleCorrectAnswer = (responseTime: number) => {
    // This simulates what happens in a real game
    const context = {
      responseTimeMs: responseTime,
      streakCount: streak + 1,
      hintUsed: false,
      isTypingMode: false,
      isDictationMode: false,
      masteryLevel: 1
    };

    // 🎮 ACTIVITY GEM: Always awarded for correct answers
    const activityGem = RewardEngine.createActivityGemEvent('vocab-master', context);
    const activityXP = RewardEngine.getActivityGemXP(activityGem.rarity);
    
    // Show immediate feedback
    showActivityGem(activityGem.rarity, activityXP);
    
    // Update game state
    setScore(prev => prev + activityXP);
    setStreak(prev => prev + 1);

    // 💎 MASTERY GEM: Would be conditionally awarded based on FSRS
    // In real implementation, this would check if FSRS allows progression
    const shouldAwardMasteryGem = Math.random() > 0.7; // 30% chance (simulating FSRS gating)
    
    if (shouldAwardMasteryGem) {
      const masteryGem = RewardEngine.createMasteryGemEvent('vocab-master', context);
      const masteryXP = RewardEngine.getXPValue(masteryGem.rarity);
      
      console.log('💎 Mastery Gem awarded!', {
        rarity: masteryGem.rarity,
        xp: masteryXP,
        reason: 'FSRS allowed progression'
      });
      
      // In real implementation, this would be stored separately
      // and shown in the vocabulary collection dashboard
    } else {
      console.log('⏰ Mastery Gem blocked by FSRS - word not due for review');
    }
  };

  const handleWrongAnswer = () => {
    setStreak(0);
    // No gems awarded for incorrect answers
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Dual-Track Reward System Demo
        </h1>

        {/* Consolidated XP Display */}
        <div className="mb-8">
          <ConsolidatedXPDisplay xpData={mockXPData} />
        </div>

        {/* Game Simulation */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Game Simulation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Current Game State */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Current Session</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Score (Activity XP):</span>
                  <span className="text-green-400 font-bold">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Streak:</span>
                  <span className="text-blue-400 font-bold">{streak}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Simulate Answers</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleCorrectAnswer(1500)}
                  className="w-full bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Fast Correct Answer (1.5s)
                </button>
                <button
                  onClick={() => handleCorrectAnswer(4000)}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Normal Correct Answer (4s)
                </button>
                <button
                  onClick={handleWrongAnswer}
                  className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Wrong Answer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* System Explanation */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">How the Dual-Track System Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Activity Gems */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded"></div>
                <h3 className="font-semibold text-green-300">Activity Gems</h3>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Always awarded for correct answers</li>
                <li>• Immediate engagement reward</li>
                <li>• Lower XP values (2-5 XP)</li>
                <li>• Performance-based rarity</li>
                <li>• Encourages active practice</li>
              </ul>
            </div>

            {/* Mastery Gems */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded"></div>
                <h3 className="font-semibold text-purple-300">Mastery Gems</h3>
              </div>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Only when FSRS allows progression</li>
                <li>• Vocabulary collection reward</li>
                <li>• Higher XP values (5-200 XP)</li>
                <li>• Prevents cramming abuse</li>
                <li>• Ensures genuine learning</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="font-semibold mb-2">Key Benefits:</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• <strong>Immediate Engagement:</strong> Activity Gems provide instant gratification</li>
              <li>• <strong>Long-term Learning:</strong> Mastery Gems ensure spaced repetition integrity</li>
              <li>• <strong>Balanced Progression:</strong> Both tracks contribute to overall XP</li>
              <li>• <strong>Prevents Gaming:</strong> FSRS gating stops cramming for Mastery Gems</li>
            </ul>
          </div>
        </div>

        {/* Activity Gem Feedback Component */}
        <ActivityGemFeedback
          show={feedback.show}
          rarity={feedback.rarity}
          xpValue={feedback.xpValue}
          onComplete={hideActivityGem}
        />
      </div>
    </div>
  );
}
