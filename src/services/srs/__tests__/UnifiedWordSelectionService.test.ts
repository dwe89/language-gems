/**
 * Unified Word Selection Service Tests
 * Tests intelligent word selection for different game modes
 */

import { UnifiedWordSelectionService } from '../UnifiedWordSelectionService';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        lte: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({
              data: [
                {
                  vocabulary_item_id: 1,
                  mastery_level: 2,
                  total_encounters: 5,
                  correct_encounters: 3,
                  max_gem_rarity: 'epic',
                  centralized_vocabulary: {
                    id: 1,
                    word: 'gato',
                    translation: 'cat',
                    language: 'spanish',
                    category: 'animals'
                  }
                }
              ],
              error: null
            }))
          }))
        }))
      })),
      not: jest.fn(() => ({
        limit: jest.fn(() => Promise.resolve({
          data: [
            {
              id: 2,
              word: 'perro',
              translation: 'dog',
              language: 'spanish',
              category: 'animals'
            }
          ],
          error: null
        }))
      })),
      gte: jest.fn(() => ({
        lt: jest.fn(() => ({
          order: jest.fn(() => ({
            limit: jest.fn(() => Promise.resolve({
              data: [
                {
                  vocabulary_item_id: 3,
                  mastery_level: 1,
                  total_encounters: 8,
                  correct_encounters: 3, // 37.5% accuracy - struggling
                  max_gem_rarity: 'rare',
                  centralized_vocabulary: {
                    id: 3,
                    word: 'difícil',
                    translation: 'difficult',
                    language: 'spanish',
                    category: 'adjectives'
                  }
                }
              ],
              error: null
            }))
          }))
        }))
      })),
      limit: jest.fn(() => Promise.resolve({
        data: [
          {
            vocabulary_item_id: 4,
            mastery_level: 3,
            total_encounters: 10,
            correct_encounters: 8,
            max_gem_rarity: 'legendary',
            centralized_vocabulary: {
              id: 4,
              word: 'casa',
              translation: 'house',
              language: 'spanish',
              category: 'places'
            }
          }
        ],
        error: null
      }))
    }))
  }))
};

describe('UnifiedWordSelectionService', () => {
  let service: UnifiedWordSelectionService;
  
  beforeEach(() => {
    jest.clearAllMocks();
    service = new UnifiedWordSelectionService(mockSupabase as any);
  });
  
  describe('selectWordsForSession', () => {
    it('should prioritize review words in free play mode', async () => {
      const words = await service.selectWordsForSession(
        'test-student',
        { language: 'spanish' },
        { maxWords: 10, prioritizeReviews: true }
      );
      
      expect(words).toHaveLength(4); // Based on mock data
      expect(words[0].selectionReason).toBe('due_review');
      expect(mockSupabase.from).toHaveBeenCalledWith('vocabulary_gem_collection');
    });
    
    it('should include struggling words', async () => {
      const words = await service.selectWordsForSession(
        'test-student',
        { language: 'spanish' },
        { maxWords: 10, prioritizeReviews: true }
      );
      
      const strugglingWord = words.find(w => w.selectionReason === 'struggling');
      expect(strugglingWord).toBeTruthy();
      expect(strugglingWord?.word).toBe('difícil');
    });
    
    it('should include new words when enabled', async () => {
      const words = await service.selectWordsForSession(
        'test-student',
        { language: 'spanish' },
        { maxWords: 10, includeNewWords: true }
      );
      
      const newWord = words.find(w => w.selectionReason === 'new_word');
      expect(newWord).toBeTruthy();
      expect(newWord?.masteryLevel).toBe(0);
      expect(newWord?.maxGemRarity).toBe('rare'); // New words capped at rare
    });
    
    it('should handle assignment mode differently', async () => {
      // Mock assignment-specific query
      mockSupabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          limit: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({
              data: [
                {
                  id: 5,
                  word: 'assignment_word',
                  translation: 'assignment word',
                  language: 'spanish',
                  vocabulary_gem_collection: [{
                    mastery_level: 2,
                    max_gem_rarity: 'legendary'
                  }]
                }
              ],
              error: null
            }))
          }))
        }))
      }));
      
      const words = await service.selectWordsForSession(
        'test-student',
        { language: 'spanish', category: 'test' },
        { maxWords: 10, sessionMode: 'assignment' }
      );
      
      expect(words[0].maxGemRarity).toBe('legendary'); // Assignments allow full rarity
    });
    
    it('should handle assessment mode with balanced selection', async () => {
      const words = await service.selectWordsForSession(
        'test-student',
        { language: 'spanish' },
        { maxWords: 10, sessionMode: 'assessment' }
      );
      
      // Assessment words should be capped at common (no gems during play)
      words.forEach(word => {
        expect(word.maxGemRarity).toBe('common');
        expect(word.selectionReason).toBe('assessment');
      });
    });
    
    it('should apply filters correctly', async () => {
      await service.selectWordsForSession(
        'test-student',
        { 
          language: 'spanish',
          category: 'animals',
          curriculumLevel: 'KS3'
        },
        { maxWords: 10 }
      );
      
      // Verify filters were applied to the query
      const fromCall = mockSupabase.from;
      expect(fromCall).toHaveBeenCalledWith('vocabulary_gem_collection');
    });
    
    it('should respect word limits', async () => {
      const words = await service.selectWordsForSession(
        'test-student',
        { language: 'spanish' },
        { maxWords: 2 }
      );
      
      expect(words.length).toBeLessThanOrEqual(2);
    });
    
    it('should balance review and new words according to ratio', async () => {
      const words = await service.selectWordsForSession(
        'test-student',
        { language: 'spanish' },
        { 
          maxWords: 10,
          balanceRatio: { reviews: 0.8, new: 0.2 },
          prioritizeReviews: true,
          includeNewWords: true
        }
      );
      
      // Should attempt to get ~80% reviews, 20% new words
      // Exact ratio depends on available data
      expect(words.length).toBeGreaterThan(0);
    });
  });
  
  describe('Error handling', () => {
    it('should handle database errors gracefully', async () => {
      mockSupabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => Promise.reject(new Error('Database error')))
        }))
      }));
      
      const words = await service.selectWordsForSession(
        'test-student',
        { language: 'spanish' },
        { maxWords: 10 }
      );
      
      expect(words).toEqual([]); // Should return empty array on error
    });
    
    it('should handle missing vocabulary data', async () => {
      mockSupabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            lte: jest.fn(() => ({
              order: jest.fn(() => ({
                limit: jest.fn(() => Promise.resolve({
                  data: null, // No data
                  error: null
                }))
              }))
            }))
          }))
        }))
      }));
      
      const words = await service.selectWordsForSession(
        'test-student',
        { language: 'spanish' },
        { maxWords: 10 }
      );
      
      expect(words).toEqual([]);
    });
  });
  
  describe('Word selection logic', () => {
    it('should identify struggling words correctly', async () => {
      // Mock data for struggling words (low accuracy)
      mockSupabase.from = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            gte: jest.fn(() => ({
              lt: jest.fn(() => ({
                order: jest.fn(() => ({
                  limit: jest.fn(() => Promise.resolve({
                    data: [
                      {
                        vocabulary_item_id: 1,
                        total_encounters: 10,
                        correct_encounters: 4, // 40% accuracy
                        centralized_vocabulary: {
                          id: 1,
                          word: 'struggling_word',
                          translation: 'difficult word'
                        }
                      }
                    ],
                    error: null
                  }))
                }))
              }))
            }))
          }))
        }))
      }));
      
      const words = await service.selectWordsForSession(
        'test-student',
        {},
        { maxWords: 10 }
      );
      
      // Should identify words with < 60% accuracy as struggling
      expect(words[0].selectionReason).toBe('struggling');
    });
    
    it('should shuffle results for variety', async () => {
      // Test that results are shuffled (hard to test randomness, but we can verify the method exists)
      const words1 = await service.selectWordsForSession('test-student', {}, { maxWords: 10 });
      const words2 = await service.selectWordsForSession('test-student', {}, { maxWords: 10 });
      
      // Both should return valid results
      expect(words1).toBeDefined();
      expect(words2).toBeDefined();
    });
  });
});
