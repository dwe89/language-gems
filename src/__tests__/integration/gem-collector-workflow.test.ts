import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMocks } from 'node-mocks-http';

// Mock Supabase client
const mockSupabase = {
  auth: {
    getUser: vi.fn()
  },
  from: vi.fn()
};

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => mockSupabase)
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({}))
}));

describe('Gem Collector Workflow Integration', () => {
  const mockUser = { id: 'user-123', email: 'teacher@example.com' };
  const mockStudent = { id: 'student-456', email: 'student@example.com' };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
  });

  describe('Complete Assignment Workflow', () => {
    it('should handle complete assignment creation to completion workflow', async () => {
      // Step 1: Teacher creates assignment
      const mockClass = { id: 'class-1', teacher_id: mockUser.id };
      const mockAssignment = {
        id: 'assignment-1',
        title: 'Spanish Sentence Translation',
        type: 'gem-collector',
        class_id: 'class-1',
        config: {
          language: 'spanish',
          difficulty: 'beginner',
          sentenceCount: 5,
          livesCount: 3
        }
      };

      // Mock assignment creation
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'classes') {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: mockClass, error: null })
              })
            })
          };
        }
        if (table === 'assignments') {
          return {
            insert: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: mockAssignment, error: null })
              })
            })
          };
        }
        return { select: () => ({}) };
      });

      // Step 2: Student accesses assignment
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockStudent } });
      
      const mockSentences = [
        {
          id: 'sentence-1',
          english_sentence: 'I like to go to the cinema',
          target_sentence: 'Me gusta ir al cine',
          difficulty_level: 'beginner',
          sentence_segments: [
            {
              id: 'segment-1',
              segment_order: 1,
              english_segment: 'I like',
              target_segment: 'Me gusta',
              sentence_segment_options: [
                { id: 'opt-1', option_text: 'Me gusta', is_correct: true },
                { id: 'opt-2', option_text: 'Me encanta', is_correct: false }
              ]
            }
          ]
        }
      ];

      // Mock sentence fetching for assignment
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'assignments') {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({ data: mockAssignment, error: null })
              })
            })
          };
        }
        if (table === 'class_students') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  single: () => Promise.resolve({ data: { id: 'student-1' }, error: null })
                })
              })
            })
          };
        }
        if (table === 'sentence_translations') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  eq: () => ({
                    order: () => ({
                      limit: () => Promise.resolve({ data: mockSentences, error: null })
                    })
                  })
                })
              })
            })
          };
        }
        return { select: () => ({}) };
      });

      // Import and test sentences API
      const { POST: sentencesHandler } = await import('../../app/api/games/gem-collector/sentences/route');
      
      const { req: sentencesReq } = createMocks({
        method: 'POST',
        body: {
          mode: 'assignment',
          assignmentId: 'assignment-1',
          language: 'spanish',
          difficulty: 'beginner'
        }
      });

      const sentencesResponse = await sentencesHandler(sentencesReq as any);
      const sentencesData = await sentencesResponse.json();

      expect(sentencesResponse.status).toBe(200);
      expect(sentencesData.sentences).toBeDefined();

      // Step 3: Student completes game session
      const mockSession = { id: 'session-1' };
      
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'gem_collector_sessions') {
          return {
            insert: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: mockSession, error: null })
              })
            })
          };
        }
        if (table === 'gem_collector_segment_attempts') {
          return {
            insert: () => Promise.resolve({ error: null })
          };
        }
        if (table === 'assignment_progress') {
          return {
            upsert: () => Promise.resolve({ error: null })
          };
        }
        return { select: () => ({}) };
      });

      const { POST: sessionsHandler } = await import('../../app/api/games/gem-collector/sessions/route');

      const sessionData = {
        sessionId: 'test-session-123',
        assignmentId: 'assignment-1',
        sessionType: 'assignment',
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
        segmentAttempts: [
          {
            segmentId: 'segment-1',
            selectedOptionId: 'opt-1',
            isCorrect: true,
            responseTime: 1500,
            gemsEarned: 2
          }
        ],
        endedAt: new Date().toISOString()
      };

      const { req: sessionReq } = createMocks({
        method: 'POST',
        body: sessionData
      });

      const sessionResponse = await sessionsHandler(sessionReq as any);
      const sessionResponseData = await sessionResponse.json();

      expect(sessionResponse.status).toBe(200);
      expect(sessionResponseData.success).toBe(true);

      // Step 4: Teacher views analytics
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockUser } });
      
      const mockAnalyticsData = {
        sessions: [mockSession],
        analytics: {
          totalSessions: 1,
          averageScore: 100,
          averageAccuracy: 100,
          totalStudents: 1
        },
        studentPerformance: [
          {
            studentId: mockStudent.id,
            averageScore: 100,
            accuracy: 100
          }
        ]
      };

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'classes') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  single: () => Promise.resolve({ data: mockClass, error: null })
                })
              })
            })
          };
        }
        if (table === 'gem_collector_sessions') {
          return {
            select: () => ({
              order: () => ({
                limit: () => Promise.resolve({ data: [mockSession], error: null })
              })
            })
          };
        }
        return { select: () => ({}) };
      });

      const { GET: analyticsHandler } = await import('../../app/api/analytics/gem-collector/route');

      const { req: analyticsReq } = createMocks({
        method: 'GET',
        query: { classId: 'class-1' }
      });

      const analyticsResponse = await analyticsHandler(analyticsReq as any);
      const analyticsData = await analyticsResponse.json();

      expect(analyticsResponse.status).toBe(200);
      expect(analyticsData.sessions).toBeDefined();
      expect(analyticsData.analytics).toBeDefined();
    });

    it('should handle vocabulary mining integration', async () => {
      const mockVocabularyItems = [
        {
          id: 'vocab-1',
          term: 'gusta',
          translation: 'like',
          gem_type: 'common',
          gem_color: '#60a5fa'
        }
      ];

      const mockGemCollection = {
        id: 'gem-1',
        student_id: mockStudent.id,
        vocabulary_item_id: 'vocab-1',
        gem_level: 1,
        mastery_level: 0
      };

      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: mockStudent } });
      
      mockSupabase.from.mockImplementation((table) => {
        if (table === 'sentence_segments') {
          return {
            select: () => ({
              in: () => Promise.resolve({
                data: [
                  {
                    id: 'segment-1',
                    target_segment: 'Me gusta',
                    sentence_translations: {
                      target_language: 'spanish',
                      theme: 'Leisure'
                    }
                  }
                ],
                error: null
              })
            })
          };
        }
        if (table === 'vocabulary_items') {
          return {
            select: () => ({
              or: () => ({
                limit: () => Promise.resolve({ data: mockVocabularyItems, error: null })
              })
            })
          };
        }
        if (table === 'vocabulary_gem_collection') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  single: () => Promise.resolve({ data: null, error: null })
                })
              })
            }),
            insert: () => Promise.resolve({ error: null })
          };
        }
        if (table === 'vocabulary_mining_sessions') {
          return {
            insert: () => Promise.resolve({ error: null })
          };
        }
        return { select: () => ({}) };
      });

      const { POST: sessionsHandler } = await import('../../app/api/games/gem-collector/sessions/route');

      const sessionData = {
        sessionId: 'test-session-vocab',
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
        segmentAttempts: [
          {
            segmentId: 'segment-1',
            selectedOptionId: 'opt-1',
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
      
      // Verify vocabulary mining integration was called
      expect(mockSupabase.from).toHaveBeenCalledWith('vocabulary_items');
      expect(mockSupabase.from).toHaveBeenCalledWith('vocabulary_gem_collection');
    });

    it('should handle error scenarios gracefully', async () => {
      // Test database error handling
      mockSupabase.from.mockReturnValue({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: null, error: { message: 'Database error' } })
          })
        })
      });

      const { POST: sentencesHandler } = await import('../../app/api/games/gem-collector/sentences/route');
      
      const { req } = createMocks({
        method: 'POST',
        body: {
          mode: 'assignment',
          assignmentId: 'invalid-assignment'
        }
      });

      const response = await sentencesHandler(req as any);
      
      expect(response.status).toBe(404);
    });

    it('should enforce proper access control', async () => {
      // Test unauthorized access to assignment
      const unauthorizedUser = { id: 'unauthorized-user', email: 'unauthorized@example.com' };
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: unauthorizedUser } });

      mockSupabase.from.mockImplementation((table) => {
        if (table === 'assignments') {
          return {
            select: () => ({
              eq: () => ({
                single: () => Promise.resolve({
                  data: { id: 'assignment-1', class_id: 'class-1' },
                  error: null
                })
              })
            })
          };
        }
        if (table === 'class_students') {
          return {
            select: () => ({
              eq: () => ({
                eq: () => ({
                  single: () => Promise.resolve({ data: null, error: null })
                })
              })
            })
          };
        }
        return { select: () => ({}) };
      });

      const { POST: sentencesHandler } = await import('../../app/api/games/gem-collector/sentences/route');
      
      const { req } = createMocks({
        method: 'POST',
        body: {
          mode: 'assignment',
          assignmentId: 'assignment-1'
        }
      });

      const response = await sentencesHandler(req as any);
      
      expect(response.status).toBe(403);
    });
  });
});
