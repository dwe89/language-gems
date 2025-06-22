import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { POST as sentencesHandler } from '../../app/api/games/gem-collector/sentences/route';
import { POST as sessionsHandler, GET as getSessionsHandler } from '../../app/api/games/gem-collector/sessions/route';

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn()
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
        limit: vi.fn(),
        order: vi.fn(() => ({
          limit: vi.fn()
        }))
      })),
      in: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn()
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      upsert: vi.fn()
    }))
  }))
};

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => mockSupabase)
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({}))
}));

describe('Gem Collector API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Sentences API', () => {
    it('should fetch sentences for free play mode', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSentences = [
        {
          id: 'sentence-1',
          english_sentence: 'I like to go to the cinema',
          target_language: 'spanish',
          target_sentence: 'Me gusta ir al cine',
          difficulty_level: 'beginner',
          sentence_segments: [
            {
              id: 'segment-1',
              segment_order: 1,
              english_segment: 'I like',
              target_segment: 'Me gusta',
              sentence_segment_options: [
                { id: 'opt-1', option_text: 'Me gusta', is_correct: true, distractor_type: 'correct' },
                { id: 'opt-2', option_text: 'Me encanta', is_correct: false, distractor_type: 'semantic' }
              ]
            }
          ]
        }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: mockSentences, error: null })
            })
          })
        })
      });

      const { req, res } = createMocks({
        method: 'POST',
        body: {
          mode: 'freeplay',
          language: 'spanish',
          difficulty: 'beginner',
          count: 10
        }
      });

      await sentencesHandler(req as any);

      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('sentence_translations');
    });

    it('should handle assignment mode with proper access control', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockAssignment = {
        id: 'assignment-1',
        class_id: 'class-1',
        game_config: { difficulty: 'intermediate' }
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
      
      // Mock assignment access check
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'assignments') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockAssignment, error: null })
              })
            })
          };
        }
        if (table === 'class_students') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: { id: 'student-1' }, error: null })
                })
              })
            })
          };
        }
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({ data: [], error: null })
              })
            })
          })
        };
      });

      const { req } = createMocks({
        method: 'POST',
        body: {
          mode: 'assignment',
          assignmentId: 'assignment-1',
          language: 'spanish',
          count: 10
        }
      });

      await sentencesHandler(req as any);

      expect(mockSupabase.from).toHaveBeenCalledWith('assignments');
      expect(mockSupabase.from).toHaveBeenCalledWith('class_students');
    });

    it('should return 401 for unauthenticated requests', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } });

      const { req } = createMocks({
        method: 'POST',
        body: { mode: 'freeplay' }
      });

      const response = await sentencesHandler(req as any);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.error).toBe('Unauthorized');
    });
  });

  describe('Sessions API', () => {
    it('should save game session with analytics data', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSession = { id: 'session-1' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockSession, error: null })
          })
        })
      });

      const sessionData = {
        sessionId: 'test-session-123',
        sessionType: 'free_play',
        languagePair: 'english_spanish',
        difficultyLevel: 'beginner',
        totalSentences: 5,
        completedSentences: 3,
        totalSegments: 15,
        correctSegments: 12,
        incorrectSegments: 3,
        finalScore: 1200,
        gemsCollected: 24,
        speedBoostsUsed: 2,
        segmentAttempts: [
          {
            segmentId: 'segment-1',
            selectedOptionId: 'option-1',
            isCorrect: true,
            responseTime: 1500,
            gemsEarned: 2
          }
        ],
        endedAt: new Date().toISOString()
      };

      const { req } = createMocks({
        method: 'POST',
        body: sessionData
      });

      const response = await sessionsHandler(req as any);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith('gem_collector_sessions');
    });

    it('should retrieve session history', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSessions = [
        {
          id: 'session-1',
          student_id: 'user-123',
          final_score: 1200,
          created_at: new Date().toISOString()
        }
      ];

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
      mockSupabase.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue({ data: mockSessions, error: null })
            })
          })
        })
      });

      const { req } = createMocks({
        method: 'GET',
        query: { limit: '10' }
      });

      const response = await getSessionsHandler(req as any);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.sessions).toEqual(mockSessions);
    });

    it('should handle database errors gracefully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
      mockSupabase.from.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } })
          })
        })
      });

      const { req } = createMocks({
        method: 'POST',
        body: {
          sessionId: 'test-session',
          sessionType: 'free_play',
          languagePair: 'english_spanish',
          difficultyLevel: 'beginner',
          totalSentences: 1,
          completedSentences: 1,
          totalSegments: 1,
          correctSegments: 1,
          incorrectSegments: 0,
          finalScore: 100,
          gemsCollected: 2,
          speedBoostsUsed: 0,
          segmentAttempts: [],
          endedAt: new Date().toISOString()
        }
      });

      const response = await sessionsHandler(req as any);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.error).toBe('Failed to save session');
    });
  });
});
