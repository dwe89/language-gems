/**
 * Enhanced Game Session Service Integration Tests
 * Tests the complete flow of session management with gems tracking
 */

import { EnhancedGameSessionService } from '../EnhancedGameSessionService';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({
          data: { id: 'test-session-id' },
          error: null
        }))
      }))
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({
        data: null,
        error: null
      }))
    })),
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({
          data: { student_id: 'test-student-id', gems_total: 5, gem_events_count: 5 },
          error: null
        }))
      }))
    }))
  }))
};

// Mock the imports
jest.mock('../../../services/spacedRepetitionService', () => ({
  spacedRepetitionService: {
    updateProgress: jest.fn(() => Promise.resolve())
  }
}));

jest.mock('../../../services/enhancedGameService', () => ({
  enhancedGameService: {
    addXPToStudent: jest.fn(() => Promise.resolve())
  }
}));

describe('EnhancedGameSessionService', () => {
  let service: EnhancedGameSessionService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    service = new EnhancedGameSessionService(mockSupabase as any);
  });
  
  describe('startGameSession', () => {
    it('should create a new session with gems tracking initialized', async () => {
      const sessionData = {
        student_id: 'test-student',
        game_type: 'vocab-master',
        session_mode: 'free_play' as const
      };
      
      const sessionId = await service.startGameSession(sessionData);
      
      expect(sessionId).toBe('test-session-id');
      expect(mockSupabase.from).toHaveBeenCalledWith('enhanced_game_sessions');
      
      // Verify gems tracking is initialized
      const insertCall = mockSupabase.from().insert;
      expect(insertCall).toHaveBeenCalledWith(
        expect.objectContaining({
          student_id: 'test-student',
          game_type: 'vocab-master',
          session_mode: 'free_play',
          gems_total: 0,
          gems_by_rarity: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
          gem_events_count: 0
        })
      );
    });
  });
  
  describe('recordWordAttempt', () => {
    it('should record correct attempts and award gems', async () => {
      const attempt = {
        vocabularyId: 123,
        wordText: 'gato',
        translationText: 'cat',
        responseTimeMs: 2000,
        wasCorrect: true,
        hintUsed: false,
        streakCount: 3,
        masteryLevel: 2,
        maxGemRarity: 'epic' as const,
        gameMode: 'multiple-choice',
        difficultyLevel: 'medium'
      };
      
      const gemEvent = await service.recordWordAttempt('test-session', 'vocab-master', attempt);
      
      expect(gemEvent).toBeTruthy();
      expect(gemEvent?.rarity).toBe('uncommon'); // Based on response time and streak
      expect(gemEvent?.xpValue).toBe(25); // Uncommon gem value
      expect(gemEvent?.vocabularyId).toBe(123);
      expect(gemEvent?.wordText).toBe('gato');
      
      // Verify gem event was inserted
      expect(mockSupabase.from).toHaveBeenCalledWith('gem_events');
    });
    
    it('should not award gems for incorrect attempts', async () => {
      const attempt = {
        vocabularyId: 123,
        wordText: 'gato',
        translationText: 'cat',
        responseTimeMs: 2000,
        wasCorrect: false, // Incorrect
        hintUsed: false,
        streakCount: 0,
        gameMode: 'multiple-choice'
      };
      
      const gemEvent = await service.recordWordAttempt('test-session', 'vocab-master', attempt);
      
      expect(gemEvent).toBeNull();
    });
    
    it('should cap gem rarity based on mastery level', async () => {
      const attempt = {
        vocabularyId: 123,
        wordText: 'gato',
        translationText: 'cat',
        responseTimeMs: 500, // Very fast - would normally be rare
        wasCorrect: true,
        hintUsed: false,
        streakCount: 10, // High streak - would normally be legendary
        masteryLevel: 1, // Low mastery
        maxGemRarity: 'uncommon' as const, // Capped
        gameMode: 'multiple-choice'
      };
      
      const gemEvent = await service.recordWordAttempt('test-session', 'vocab-master', attempt);
      
      expect(gemEvent?.rarity).toBe('uncommon'); // Should be capped, not legendary
    });
    
    it('should handle hint usage correctly', async () => {
      const attempt = {
        vocabularyId: 123,
        wordText: 'gato',
        translationText: 'cat',
        responseTimeMs: 1000, // Fast
        wasCorrect: true,
        hintUsed: true, // Hint was used
        streakCount: 5,
        gameMode: 'multiple-choice'
      };
      
      const gemEvent = await service.recordWordAttempt('test-session', 'vocab-master', attempt);
      
      expect(gemEvent?.rarity).toBe('common'); // Should be capped at common due to hint
    });
  });
  
  describe('endGameSession', () => {
    it('should finalize session with calculated XP from gems', async () => {
      const finalData = {
        student_id: 'test-student',
        game_type: 'vocab-master',
        session_mode: 'free_play' as const,
        final_score: 85,
        accuracy_percentage: 85,
        completion_percentage: 100,
        words_attempted: 10,
        words_correct: 8,
        unique_words_practiced: 8,
        duration_seconds: 300,
        average_response_time_ms: 2500
      };
      
      // Mock XP calculation from gems
      mockSupabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: { gems_total: 8, gem_events_count: 8 },
              error: null
            }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => Promise.resolve({ error: null }))
        }))
      }));
      
      await service.endGameSession('test-session', finalData);
      
      // Verify session was updated
      expect(mockSupabase.from).toHaveBeenCalledWith('enhanced_game_sessions');
      
      const updateCall = mockSupabase.from().update;
      expect(updateCall).toHaveBeenCalledWith(
        expect.objectContaining({
          ended_at: expect.any(String),
          duration_seconds: 300,
          final_score: 85,
          accuracy_percentage: 85,
          words_attempted: 10,
          words_correct: 8
        })
      );
    });
  });
  
  describe('awardBonusGem', () => {
    it('should award bonus gems for milestones', async () => {
      await service.awardBonusGem(
        'test-session',
        'vocab-master',
        'epic',
        'Quest Completed',
        'test-student'
      );
      
      expect(mockSupabase.from).toHaveBeenCalledWith('gem_events');
      
      const insertCall = mockSupabase.from().insert;
      expect(insertCall).toHaveBeenCalledWith(
        expect.objectContaining({
          session_id: 'test-session',
          student_id: 'test-student',
          gem_rarity: 'epic',
          xp_value: 100, // Epic gem value
          word_text: 'Bonus: Quest Completed',
          game_type: 'vocab-master',
          game_mode: 'bonus'
        })
      );
    });
  });
  
  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      // Mock database error
      mockSupabase.from = jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({
              data: null,
              error: { message: 'Database error' }
            }))
          }))
        }))
      }));
      
      await expect(service.startGameSession({
        student_id: 'test-student',
        game_type: 'vocab-master'
      })).rejects.toThrow();
    });
    
    it('should continue functioning when SRS update fails', async () => {
      // Mock SRS service failure
      const { spacedRepetitionService } = require('../../../services/spacedRepetitionService');
      spacedRepetitionService.updateProgress.mockRejectedValue(new Error('SRS error'));
      
      const attempt = {
        vocabularyId: 123,
        wordText: 'gato',
        translationText: 'cat',
        responseTimeMs: 2000,
        wasCorrect: true,
        hintUsed: false,
        streakCount: 3
      };
      
      // Should not throw, even if SRS update fails
      const gemEvent = await service.recordWordAttempt('test-session', 'vocab-master', attempt);
      expect(gemEvent).toBeTruthy();
    });
  });
});
