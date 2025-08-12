/**
 * RewardEngine Tests
 * Validates gem rarity calculation and XP conversion logic
 */

import { RewardEngine, GEM_TYPES } from '../RewardEngine';

describe('RewardEngine', () => {
  describe('calculateGemRarity', () => {
    it('should award common gems for basic performance', () => {
      const rarity = RewardEngine.calculateGemRarity('vocab-master', {
        responseTimeMs: 5000,
        streakCount: 0,
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false
      });
      
      expect(rarity).toBe('common');
    });
    
    it('should award uncommon gems for normal speed', () => {
      const rarity = RewardEngine.calculateGemRarity('vocab-master', {
        responseTimeMs: 3000, // Under normal threshold (4000)
        streakCount: 0,
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false
      });
      
      expect(rarity).toBe('uncommon');
    });
    
    it('should award rare gems for fast responses', () => {
      const rarity = RewardEngine.calculateGemRarity('vocab-master', {
        responseTimeMs: 1500, // Under fast threshold (2000)
        streakCount: 0,
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false
      });
      
      expect(rarity).toBe('rare');
    });
    
    it('should award epic gems for streak performance', () => {
      const rarity = RewardEngine.calculateGemRarity('vocab-master', {
        responseTimeMs: 5000,
        streakCount: 5, // Epic threshold
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false
      });
      
      expect(rarity).toBe('epic');
    });
    
    it('should award legendary gems for high streaks', () => {
      const rarity = RewardEngine.calculateGemRarity('vocab-master', {
        responseTimeMs: 5000,
        streakCount: 10, // Legendary threshold
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false
      });
      
      expect(rarity).toBe('legendary');
    });
    
    it('should cap at common when hint is used', () => {
      const rarity = RewardEngine.calculateGemRarity('vocab-master', {
        responseTimeMs: 1000, // Would normally be rare
        streakCount: 10, // Would normally be legendary
        hintUsed: true, // Should cap at common
        isTypingMode: false,
        isDictationMode: false
      });
      
      expect(rarity).toBe('common');
    });
    
    it('should upgrade rarity for typing mode', () => {
      const rarity = RewardEngine.calculateGemRarity('vocab-master', {
        responseTimeMs: 5000, // Would normally be common
        streakCount: 0,
        hintUsed: false,
        isTypingMode: true, // Should upgrade to uncommon
        isDictationMode: false
      });
      
      expect(rarity).toBe('uncommon');
    });
    
    it('should cap rarity based on mastery level', () => {
      const rarity = RewardEngine.calculateGemRarity('vocab-master', {
        responseTimeMs: 1000, // Would normally be rare
        streakCount: 10, // Would normally be legendary
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false,
        maxGemRarity: 'uncommon' // Should cap at uncommon
      });
      
      expect(rarity).toBe('uncommon');
    });
    
    it('should use game-specific thresholds', () => {
      // Memory game has faster thresholds
      const memoryRarity = RewardEngine.calculateGemRarity('memory-game', {
        responseTimeMs: 1500, // Under memory fast threshold (1000) but over normal (2000)
        streakCount: 0,
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false
      });
      
      expect(memoryRarity).toBe('uncommon');
      
      // Same time in vocab-master would be rare
      const vocabRarity = RewardEngine.calculateGemRarity('vocab-master', {
        responseTimeMs: 1500, // Under vocab fast threshold (2000)
        streakCount: 0,
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false
      });
      
      expect(vocabRarity).toBe('rare');
    });
  });
  
  describe('getXPValue', () => {
    it('should return correct XP values for each rarity', () => {
      expect(RewardEngine.getXPValue('common')).toBe(10);
      expect(RewardEngine.getXPValue('uncommon')).toBe(25);
      expect(RewardEngine.getXPValue('rare')).toBe(50);
      expect(RewardEngine.getXPValue('epic')).toBe(100);
      expect(RewardEngine.getXPValue('legendary')).toBe(200);
    });
  });
  
  describe('createGemEvent', () => {
    it('should create a complete gem event', () => {
      const event = RewardEngine.createGemEvent(
        'vocab-master',
        {
          responseTimeMs: 2500,
          streakCount: 3,
          hintUsed: false,
          isTypingMode: true,
          isDictationMode: false
        },
        {
          id: 123,
          word: 'gato',
          translation: 'cat'
        },
        'typing',
        'medium'
      );
      
      expect(event).toMatchObject({
        rarity: 'uncommon', // Typing mode upgrades from common
        xpValue: 25,
        vocabularyId: 123,
        wordText: 'gato',
        translationText: 'cat',
        responseTimeMs: 2500,
        streakCount: 3,
        hintUsed: false,
        gameType: 'vocab-master',
        gameMode: 'typing',
        difficultyLevel: 'medium'
      });
    });
  });
  
  describe('calculateTotalXP', () => {
    it('should sum XP from multiple gem events', () => {
      const events = [
        { rarity: 'common' as const, xpValue: 10 },
        { rarity: 'rare' as const, xpValue: 50 },
        { rarity: 'epic' as const, xpValue: 100 }
      ];
      
      const totalXP = RewardEngine.calculateTotalXP(events as any);
      expect(totalXP).toBe(160);
    });
  });
  
  describe('groupGemsByRarity', () => {
    it('should group gems by rarity correctly', () => {
      const events = [
        { rarity: 'common' as const },
        { rarity: 'common' as const },
        { rarity: 'rare' as const },
        { rarity: 'epic' as const }
      ];
      
      const grouped = RewardEngine.groupGemsByRarity(events as any);
      
      expect(grouped).toEqual({
        common: 2,
        uncommon: 0,
        rare: 1,
        epic: 1,
        legendary: 0
      });
    });
  });
  
  describe('getMaxGemRarityForMastery', () => {
    it('should return correct max rarity for mastery levels', () => {
      expect(RewardEngine.getMaxGemRarityForMastery(0)).toBe('rare');
      expect(RewardEngine.getMaxGemRarityForMastery(1)).toBe('rare');
      expect(RewardEngine.getMaxGemRarityForMastery(2)).toBe('epic');
      expect(RewardEngine.getMaxGemRarityForMastery(3)).toBe('epic');
      expect(RewardEngine.getMaxGemRarityForMastery(4)).toBe('legendary');
      expect(RewardEngine.getMaxGemRarityForMastery(5)).toBe('legendary');
    });
  });

  describe('Anti-grinding mechanics', () => {
    it('should prevent XP farming from already mastered words', () => {
      // High mastery word with hint used should be capped at common
      const rarity = RewardEngine.calculateGemRarity('vocab-master', {
        responseTimeMs: 500, // Very fast
        streakCount: 15, // High streak
        hintUsed: true, // But hint was used
        isTypingMode: true, // And typing mode
        isDictationMode: false,
        masteryLevel: 5, // Fully mastered
        maxGemRarity: 'legendary'
      });

      expect(rarity).toBe('common');
    });

    it('should cap gems for over-practiced words', () => {
      // Word with low mastery should be capped even with good performance
      const rarity = RewardEngine.calculateGemRarity('vocab-master', {
        responseTimeMs: 1000, // Fast response
        streakCount: 10, // High streak
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false,
        masteryLevel: 1,
        maxGemRarity: 'uncommon' // Capped due to low mastery
      });

      expect(rarity).toBe('uncommon'); // Should be capped, not legendary
    });
  });

  describe('Game-specific configurations', () => {
    it('should handle unknown game types gracefully', () => {
      const rarity = RewardEngine.calculateGemRarity('unknown-game', {
        responseTimeMs: 2000,
        streakCount: 5,
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false
      });

      // Should use default config
      expect(rarity).toBe('epic'); // Streak 5 = epic in default config
    });

    it('should apply different thresholds for different games', () => {
      // Same performance in different games should yield different results
      const context = {
        responseTimeMs: 1500,
        streakCount: 0,
        hintUsed: false,
        isTypingMode: false,
        isDictationMode: false
      };

      const memoryRarity = RewardEngine.calculateGemRarity('memory-game', context);
      const vocabRarity = RewardEngine.calculateGemRarity('vocab-master', context);
      const lavaRarity = RewardEngine.calculateGemRarity('lava-temple', context);

      // Memory game has fastest thresholds, lava temple has slowest
      expect(memoryRarity).toBe('uncommon'); // 1500ms is between 1000-2000 for memory
      expect(vocabRarity).toBe('rare'); // 1500ms is under 2000 for vocab
      expect(lavaRarity).toBe('common'); // 1500ms is very fast for lava temple
    });
  });
});
