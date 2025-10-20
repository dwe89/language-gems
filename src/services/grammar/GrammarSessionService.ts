/**
 * Grammar Session Service
 * Manages grammar practice and test sessions with assignment tracking
 * Similar to EnhancedGameSessionService but for grammar activities
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface GrammarSessionData {
  student_id: string;
  assignment_id?: string;
  topic_id: string;
  content_id: string;
  session_type: 'practice' | 'test' | 'lesson';
  session_mode: 'free_play' | 'assignment' | 'practice' | 'challenge';
  practice_mode?: 'quick' | 'standard' | 'mastery'; // 10, 15, or 30 questions
  total_questions: number;
}

export interface GrammarQuestionAttempt {
  question_id?: string;
  question_text: string;
  question_type: string;
  student_answer: string;
  correct_answer: string;
  is_correct: boolean;
  response_time_ms: number;
  hint_used: boolean;
  difficulty_level?: string;
}

export interface GrammarSessionCompletion {
  questions_attempted: number;
  questions_correct: number;
  accuracy_percentage: number;
  final_score: number;
  duration_seconds: number;
  average_response_time_ms: number;
  hints_used: number;
  streak_count: number;
  session_data?: any;
}

export class GrammarSessionService {
  private supabase: SupabaseClient<any>;
  private currentSessionId: string | null = null;
  private questionAttempts: GrammarQuestionAttempt[] = [];
  
  constructor(supabaseClient?: SupabaseClient<any>) {
    this.supabase = supabaseClient || createBrowserClient<any>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    );
  }
  
  /**
   * Start a new grammar session
   */
  async startSession(sessionData: GrammarSessionData): Promise<string> {
    try {
      console.log('🎓 [GRAMMAR SESSION] Starting session:', sessionData);

      // First check if there's already an active session for this student and content
      const { data: existingSession } = await this.supabase
        .from('grammar_assignment_sessions')
        .select('id')
        .eq('student_id', sessionData.student_id)
        .eq('content_id', sessionData.content_id)
        .eq('completion_status', 'in_progress')
        .maybeSingle();

      // If an active session exists, return it instead of creating a new one
      if (existingSession) {
        console.log('♻️ [GRAMMAR SESSION] Resuming existing session:', existingSession.id);
        this.currentSessionId = existingSession.id;
        return existingSession.id;
      }

      // Create new session
      const { data, error } = await this.supabase
        .from('grammar_assignment_sessions')
        .insert({
          student_id: sessionData.student_id,
          assignment_id: sessionData.assignment_id,
          topic_id: sessionData.topic_id,
          content_id: sessionData.content_id,
          session_type: sessionData.session_type,
          session_mode: sessionData.session_mode,
          practice_mode: sessionData.practice_mode,
          total_questions: sessionData.total_questions,
          started_at: new Date().toISOString(),
          completion_status: 'in_progress',
          max_score_possible: sessionData.total_questions * 10 // 10 points per question
        })
        .select('id')
        .single();

      if (error) throw error;

      this.currentSessionId = data.id;
      this.questionAttempts = [];

      console.log('✅ [GRAMMAR SESSION] Session started:', data.id);
      return data.id;
    } catch (error) {
      console.error('❌ [GRAMMAR SESSION] Error starting session:', error);
      throw error;
    }
  }
  
  /**
   * Record a question attempt
   */
  async recordQuestionAttempt(
    sessionId: string,
    attempt: GrammarQuestionAttempt
  ): Promise<void> {
    try {
      // Store attempt in memory for session summary
      this.questionAttempts.push(attempt);
      
      // Optionally record individual attempts to grammar_practice_attempts table
      // This is useful for detailed analytics
      if (attempt.question_type === 'conjugation') {
        // Record conjugation-specific data
        // This integrates with existing grammar analytics
        console.log('📝 [GRAMMAR SESSION] Recording conjugation attempt');
      }
      
      console.log('✅ [GRAMMAR SESSION] Question attempt recorded');
    } catch (error) {
      console.error('❌ [GRAMMAR SESSION] Error recording attempt:', error);
    }
  }
  
  /**
   * End grammar session with final statistics
   */
  async endSession(
    sessionId: string,
    completionData: GrammarSessionCompletion
  ): Promise<void> {
    try {
      console.log('🏁 [GRAMMAR SESSION] Ending session:', sessionId);

      // Get session data including student_id and practice_mode for gem events
      const { data: sessionData } = await this.supabase
        .from('grammar_assignment_sessions')
        .select('session_type, student_id, practice_mode')
        .eq('id', sessionId)
        .single();

      if (!sessionData) {
        throw new Error('Session not found');
      }

      const sessionType = sessionData.session_type === 'test' ? 'test' : 'practice';

      // Calculate gems and XP
      const gemsEarned = this.calculateGems(completionData, sessionType);
      const xpEarned = gemsEarned; // 1:1 ratio for now

      // Update session with final data
      const { error } = await this.supabase
        .from('grammar_assignment_sessions')
        .update({
          ended_at: new Date().toISOString(),
          duration_seconds: completionData.duration_seconds,
          questions_attempted: completionData.questions_attempted,
          questions_correct: completionData.questions_correct,
          accuracy_percentage: completionData.accuracy_percentage,
          final_score: completionData.final_score,
          average_response_time_ms: completionData.average_response_time_ms,
          hints_used: completionData.hints_used,
          streak_count: completionData.streak_count,
          completion_status: 'completed',
          completion_percentage: 100,
          gems_earned: gemsEarned,
          xp_earned: xpEarned,
          session_data: {
            ...completionData.session_data,
            question_attempts: this.questionAttempts
          }
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Create gem events for dashboard tracking
      if (gemsEarned > 0) {
        await this.createGrammarGemEvents(
          sessionData.student_id,
          sessionId,
          gemsEarned,
          xpEarned,
          sessionType,
          sessionData.practice_mode || 'standard'
        );
      }

      // Update assignment progress if this is an assignment session
      await this.updateAssignmentProgress(sessionId);

      console.log('✅ [GRAMMAR SESSION] Session ended successfully');

      // Clear session state
      this.currentSessionId = null;
      this.questionAttempts = [];
    } catch (error) {
      console.error('❌ [GRAMMAR SESSION] Error ending session:', error);
      throw error;
    }
  }

  /**
   * Create gem events for grammar session completion
   * This ensures grammar gems show up in the student dashboard
   */
  private async createGrammarGemEvents(
    studentId: string,
    sessionId: string,
    gemsEarned: number,
    xpEarned: number,
    sessionType: 'practice' | 'test',
    practiceMode: string
  ): Promise<void> {
    try {
      console.log('💎 [GRAMMAR SESSION] Creating gem events:', { gemsEarned, xpEarned, sessionType, practiceMode });

      // Determine game_type based on session type
      const gameType = sessionType === 'test'
        ? 'grammar-test'
        : `grammar-practice-${practiceMode}`;

      // Create individual gem events (all as 'common' rarity for grammar)
      const gemEvents = [];
      for (let i = 0; i < gemsEarned; i++) {
        gemEvents.push({
          student_id: studentId,
          session_id: sessionId,
          gem_type: 'grammar',
          gem_rarity: 'common',
          game_type: gameType,
          xp_value: Math.floor(xpEarned / gemsEarned), // Distribute XP evenly
          created_at: new Date().toISOString()
        });
      }

      if (gemEvents.length > 0) {
        const { error } = await this.supabase
          .from('gem_events')
          .insert(gemEvents);

        if (error) {
          console.error('❌ [GRAMMAR SESSION] Error creating gem events:', error);
        } else {
          console.log('✅ [GRAMMAR SESSION] Created', gemEvents.length, 'gem events');
        }
      }
    } catch (error) {
      console.error('❌ [GRAMMAR SESSION] Error in createGrammarGemEvents:', error);
      // Don't throw - gem events are nice-to-have, not critical
    }
  }

  /**
   * Calculate gems earned based on performance
   * Grammar Practice: 2-5 gems per question (activity gems)
   * Grammar Test: 5-10 gems per question (higher stakes)
   */
  private calculateGems(completionData: GrammarSessionCompletion, sessionType: 'practice' | 'test' = 'practice'): number {
    const { questions_correct, questions_attempted, accuracy_percentage, hints_used } = completionData;

    // Base gems per correct answer
    const baseGemsPerQuestion = sessionType === 'test' ? 5 : 2;
    let gems = questions_correct * baseGemsPerQuestion;

    // Accuracy bonus (higher for tests)
    if (accuracy_percentage >= 90) {
      const bonusMultiplier = sessionType === 'test' ? 1.0 : 0.5; // 100% bonus for tests, 50% for practice
      gems += Math.floor(questions_correct * bonusMultiplier);
    } else if (accuracy_percentage >= 75) {
      const bonusMultiplier = sessionType === 'test' ? 0.5 : 0.25; // 50% bonus for tests, 25% for practice
      gems += Math.floor(questions_correct * bonusMultiplier);
    }

    // Perfect score bonus
    if (questions_attempted > 0 && questions_correct === questions_attempted) {
      gems += sessionType === 'test' ? 10 : 5; // Perfect score bonus
    }

    // Penalty for excessive hints (only in practice mode)
    if (sessionType === 'practice' && hints_used > 5) {
      gems = Math.max(1, gems - Math.floor(hints_used * 0.5));
    }

    return Math.max(1, gems); // Minimum 1 gem
  }
  
  /**
   * Update assignment progress after session completion
   */
  private async updateAssignmentProgress(sessionId: string): Promise<void> {
    try {
      // Get session data
      const { data: session, error: sessionError } = await this.supabase
        .from('grammar_assignment_sessions')
        .select('assignment_id, student_id, topic_id, accuracy_percentage, questions_attempted, questions_correct')
        .eq('id', sessionId)
        .single();
      
      if (sessionError || !session || !session.assignment_id) {
        return; // Not an assignment session
      }
      
      console.log('📊 [GRAMMAR SESSION] Updating assignment progress');

      // First, get current progress
      const { data: currentProgress } = await this.supabase
        .from('enhanced_assignment_progress')
        .select('grammar_sessions_completed, grammar_topics_practiced, grammar_total_questions, grammar_correct_answers')
        .eq('assignment_id', session.assignment_id)
        .eq('student_id', session.student_id)
        .single();

      if (currentProgress) {
        // Update with incremented values
        const topicsPracticed = currentProgress.grammar_topics_practiced || [];
        if (!topicsPracticed.includes(session.topic_id)) {
          topicsPracticed.push(session.topic_id);
        }

        const { error: progressError } = await this.supabase
          .from('enhanced_assignment_progress')
          .update({
            grammar_sessions_completed: (currentProgress.grammar_sessions_completed || 0) + 1,
            grammar_topics_practiced: topicsPracticed,
            grammar_total_questions: (currentProgress.grammar_total_questions || 0) + session.questions_attempted,
            grammar_correct_answers: (currentProgress.grammar_correct_answers || 0) + session.questions_correct,
            updated_at: new Date().toISOString()
          })
          .eq('assignment_id', session.assignment_id)
          .eq('student_id', session.student_id);

        if (progressError) {
          console.warn('⚠️ [GRAMMAR SESSION] Error updating assignment progress:', progressError);
        }
      }
      
      // Check if assignment is complete
      await this.checkAssignmentCompletion(session.assignment_id, session.student_id);
      
    } catch (error) {
      console.error('❌ [GRAMMAR SESSION] Error updating assignment progress:', error);
    }
  }
  
  /**
   * Check if grammar assignment is complete
   */
  private async checkAssignmentCompletion(
    assignmentId: string,
    studentId: string
  ): Promise<void> {
    try {
      // Get assignment requirements
      const { data: assignment } = await this.supabase
        .from('assignments')
        .select('game_config')
        .eq('id', assignmentId)
        .single();
      
      if (!assignment) return;
      
      // Get required topics from assignment config
      const skillsConfig = assignment.game_config?.skillsConfig;
      const requiredTopicIds = skillsConfig?.selectedSkills?.[0]?.instanceConfig?.topicIds || [];
      
      if (requiredTopicIds.length === 0) return;
      
      // Get completed topics
      const { data: sessions } = await this.supabase
        .from('grammar_assignment_sessions')
        .select('topic_id')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId)
        .eq('completion_status', 'completed');
      
      const completedTopicIds = [...new Set(sessions?.map(s => s.topic_id) || [])];
      
      // Check if all required topics are completed
      const isComplete = requiredTopicIds.every((topicId: string) => 
        completedTopicIds.includes(topicId)
      );
      
      if (isComplete) {
        console.log('🎉 [GRAMMAR SESSION] Assignment completed!');
        
        // Update assignment progress status
        await this.supabase
          .from('enhanced_assignment_progress')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('assignment_id', assignmentId)
          .eq('student_id', studentId);
      }
    } catch (error) {
      console.error('❌ [GRAMMAR SESSION] Error checking assignment completion:', error);
    }
  }
  
  /**
   * Get session statistics
   */
  async getSessionStats(sessionId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from('grammar_assignment_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ [GRAMMAR SESSION] Error getting session stats:', error);
      return null;
    }
  }
  
  /**
   * Get assignment progress for a student
   */
  async getAssignmentProgress(
    assignmentId: string,
    studentId: string
  ): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .rpc('get_grammar_assignment_completion', {
          p_assignment_id: assignmentId,
          p_student_id: studentId
        });
      
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('❌ [GRAMMAR SESSION] Error getting assignment progress:', error);
      return null;
    }
  }
}

export default GrammarSessionService;

