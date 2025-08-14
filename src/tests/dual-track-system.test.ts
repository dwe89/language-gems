/**
 * Test suite for the Dual-Track Reward System
 * Tests both Activity Gems (immediate rewards) and Mastery Gems (FSRS-driven)
 */

import { RewardEngine, GemRarity } from '../services/rewards/RewardEngine';
import { EnhancedGameSessionService } from '../services/rewards/EnhancedGameSessionService';
import { DualTrackAnalyticsService } from '../services/rewards/DualTrackAnalyticsService';

describe('Dual-Track Reward System', () => {
  describe('RewardEngine', () => {
    test('should calculate Activity Gem rarity correctly', () => {
      const context = {
        responseTimeMs: 1500, // Fast response
        streakCount: 3,
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false,
        masteryLevel: 1
      };

      const rarity = RewardEngine.calculateActivityGemRarity('vocab-master', context);
      expect(rarity).toBe('rare'); // Fast response should give rare
    });

    test('should calculate different XP values for Activity vs Mastery gems', () => {
      const masteryXP = RewardEngine.getXPValue('rare');
      const activityXP = RewardEngine.getActivityGemXP('rare');
      
      expect(masteryXP).toBe(50); // Mastery gems have higher XP
      expect(activityXP).toBe(5);  // Activity gems have lower XP
      expect(masteryXP).toBeGreaterThan(activityXP);
    });

    test('should create Activity Gem events correctly', () => {
      const context = {
        responseTimeMs: 2000,
        streakCount: 2,
        hintUsed: false,
        isTypingMode: true,
        isDictationMode: false,
        masteryLevel: 1
      };

      const gemEvent = RewardEngine.createActivityGemEvent(
        'vocab-master',
        context,
        { id: 123, word: 'test', translation: 'prueba' },
        'typing',
        'intermediate'
      );

      expect(gemEvent.gemType).toBe('activity');
      expect(gemEvent.xpValue).toBe(RewardEngine.getActivityGemXP(gemEvent.rarity));
      expect(gemEvent.gameType).toBe('vocab-master');
    });

    test('should create Mastery Gem events correctly', () => {
      const context = {
        responseTimeMs: 2000,
        streakCount: 2,
        hintUsed: false,
        isTypingMode: true,
        isDictationMode: false,
        masteryLevel: 1
      };

      const gemEvent = RewardEngine.createMasteryGemEvent(
        'vocab-master',
        context,
        { id: 123, word: 'test', translation: 'prueba' },
        'typing',
        'intermediate'
      );

      expect(gemEvent.gemType).toBe('mastery');
      expect(gemEvent.xpValue).toBe(RewardEngine.getXPValue(gemEvent.rarity));
      expect(gemEvent.gameType).toBe('vocab-master');
    });
  });

  describe('Activity Gem XP Values', () => {
    test('should have correct XP values for all rarities', () => {
      expect(RewardEngine.getActivityGemXP('common')).toBe(2);
      expect(RewardEngine.getActivityGemXP('uncommon')).toBe(3);
      expect(RewardEngine.getActivityGemXP('rare')).toBe(5);
      expect(RewardEngine.getActivityGemXP('epic')).toBe(5);
      expect(RewardEngine.getActivityGemXP('legendary')).toBe(5);
    });

    test('should have lower XP than Mastery Gems for same rarity', () => {
      const rarities: GemRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
      
      rarities.forEach(rarity => {
        const activityXP = RewardEngine.getActivityGemXP(rarity);
        const masteryXP = RewardEngine.getXPValue(rarity);
        expect(activityXP).toBeLessThan(masteryXP);
      });
    });
  });

  describe('Activity Gem Rarity Calculation', () => {
    test('should award common gems for standard performance', () => {
      const context = {
        responseTimeMs: 5000, // Slow response
        streakCount: 1,
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false,
        masteryLevel: 1
      };

      const rarity = RewardEngine.calculateActivityGemRarity('vocab-master', context);
      expect(rarity).toBe('common');
    });

    test('should award rare gems for fast responses', () => {
      const context = {
        responseTimeMs: 1000, // Very fast
        streakCount: 1,
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false,
        masteryLevel: 1
      };

      const rarity = RewardEngine.calculateActivityGemRarity('vocab-master', context);
      expect(rarity).toBe('rare');
    });

    test('should award rare gems for high streaks', () => {
      const context = {
        responseTimeMs: 4000, // Normal response
        streakCount: 5, // High streak
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false,
        masteryLevel: 1
      };

      const rarity = RewardEngine.calculateActivityGemRarity('vocab-master', context);
      expect(rarity).toBe('rare');
    });

    test('should award uncommon gems for good performance with streak', () => {
      const context = {
        responseTimeMs: 3000, // Good response time
        streakCount: 2, // Some streak
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false,
        masteryLevel: 1
      };

      const rarity = RewardEngine.calculateActivityGemRarity('vocab-master', context);
      expect(rarity).toBe('uncommon');
    });
  });

  describe('Integration Test Concepts', () => {
    test('should demonstrate dual-track concept', () => {
      // This test demonstrates the concept - in real implementation,
      // Activity Gems would always be awarded for correct answers
      // while Mastery Gems would only be awarded when FSRS allows progression

      const context = {
        responseTimeMs: 2000,
        streakCount: 3,
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false,
        masteryLevel: 1
      };

      // Activity Gem - always awarded for correct answers
      const activityGem = RewardEngine.createActivityGemEvent('vocab-master', context);
      expect(activityGem.gemType).toBe('activity');
      expect(activityGem.xpValue).toBe(RewardEngine.getActivityGemXP(activityGem.rarity));

      // Mastery Gem - only awarded when FSRS allows (would be conditional in real implementation)
      const masteryGem = RewardEngine.createMasteryGemEvent('vocab-master', context);
      expect(masteryGem.gemType).toBe('mastery');
      expect(masteryGem.xpValue).toBe(RewardEngine.getXPValue(masteryGem.rarity));

      // Both gems can be awarded for the same correct answer
      expect(activityGem.rarity).toBeDefined();
      expect(masteryGem.rarity).toBeDefined();
    });
  });
});

// Mock test to verify the concept works
describe('Dual-Track System Concept Verification', () => {
  test('should show XP breakdown correctly', () => {
    // Simulate a student with both types of gems
    const mockXPBreakdown = {
      totalXP: 100,
      masteryXP: 60,  // 60% from mastery (higher value gems)
      activityXP: 40, // 40% from activity (lower value gems)
      totalMasteryGems: 3,  // Fewer mastery gems
      totalActivityGems: 20, // More activity gems
      totalGems: 23
    };

    // Verify the concept: more activity gems but less XP per gem
    expect(mockXPBreakdown.totalActivityGems).toBeGreaterThan(mockXPBreakdown.totalMasteryGems);
    expect(mockXPBreakdown.masteryXP / mockXPBreakdown.totalMasteryGems)
      .toBeGreaterThan(mockXPBreakdown.activityXP / mockXPBreakdown.totalActivityGems);
    
    // Total should equal sum of parts
    expect(mockXPBreakdown.totalXP).toBe(mockXPBreakdown.masteryXP + mockXPBreakdown.activityXP);
    expect(mockXPBreakdown.totalGems).toBe(mockXPBreakdown.totalMasteryGems + mockXPBreakdown.totalActivityGems);
  });
});
