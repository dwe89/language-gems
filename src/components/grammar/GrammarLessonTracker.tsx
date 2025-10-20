'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase-client';
import { useAuth } from '@/components/auth/AuthProvider';

interface GrammarLessonTrackerProps {
  topicId: string;
  contentId: string;
}

/**
 * Client component to track grammar lesson completion in assignment mode
 * This component is invisible and only handles tracking logic
 */
export default function GrammarLessonTracker({ topicId, contentId }: GrammarLessonTrackerProps) {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const hasTrackedRef = useRef(false);
  
  const assignmentId = searchParams.get('assignment');
  const mode = searchParams.get('mode');
  const isAssignmentMode = assignmentId && mode === 'assignment';

  useEffect(() => {
    if (!isAssignmentMode || !user || !topicId || !contentId || hasTrackedRef.current) {
      return;
    }

    const trackLessonView = async () => {
      try {
        const supabase = createBrowserClient();
        
        console.log('📖 [GRAMMAR LESSON] Tracking lesson view for assignment:', assignmentId);
        
        // Check if there's already an active session
        const { data: existingSession } = await supabase
          .from('grammar_assignment_sessions')
          .select('id')
          .eq('student_id', user.id)
          .eq('content_id', contentId)
          .eq('completion_status', 'in_progress')
          .maybeSingle();
        
        if (existingSession) {
          console.log('♻️ [GRAMMAR LESSON] Resuming existing session:', existingSession.id);
          setSessionId(existingSession.id);
          hasTrackedRef.current = true;
          return;
        }
        
        // Create new session for lesson view
        const { data: newSession, error } = await supabase
          .from('grammar_assignment_sessions')
          .insert({
            student_id: user.id,
            assignment_id: assignmentId,
            topic_id: topicId,
            content_id: contentId,
            session_type: 'lesson',
            session_mode: 'assignment',
            started_at: new Date().toISOString(),
            completion_status: 'in_progress',
            total_questions: 0, // Lessons don't have questions
            max_score_possible: 0
          })
          .select('id')
          .single();
        
        if (error) {
          console.error('❌ [GRAMMAR LESSON] Error creating session:', error);
          return;
        }
        
        setSessionId(newSession.id);
        hasTrackedRef.current = true;
        console.log('✅ [GRAMMAR LESSON] Session created:', newSession.id);
        
      } catch (error) {
        console.error('❌ [GRAMMAR LESSON] Error tracking lesson:', error);
      }
    };

    trackLessonView();
  }, [isAssignmentMode, user, topicId, contentId, assignmentId]);

  // Track lesson completion when user leaves or after a certain time
  useEffect(() => {
    if (!sessionId || !isAssignmentMode) {
      return;
    }

    const completeLessonSession = async () => {
      try {
        const supabase = createBrowserClient();
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        
        // Only complete if user spent at least 30 seconds on the lesson
        if (timeSpent < 30) {
          console.log('⏱️ [GRAMMAR LESSON] Not enough time spent, not marking as complete');
          return;
        }
        
        console.log('🏁 [GRAMMAR LESSON] Completing lesson session:', sessionId);

        // Calculate gems based on time spent (1 gem per minute, max 10)
        const gemsEarned = Math.min(10, Math.floor(timeSpent / 60));
        const xpEarned = gemsEarned * 5; // 5 XP per gem

        const { error } = await supabase
          .from('grammar_assignment_sessions')
          .update({
            completion_status: 'completed',
            ended_at: new Date().toISOString(),
            duration_seconds: timeSpent,
            gems_earned: gemsEarned,
            xp_earned: xpEarned,
            final_score: 100, // Lessons are always "complete" if viewed
            accuracy_percentage: 100,
            questions_attempted: 0,
            questions_correct: 0
          })
          .eq('id', sessionId);

        if (error) {
          console.error('❌ [GRAMMAR LESSON] Error completing session:', error);
          return;
        }

        // Create gem events for dashboard tracking
        if (gemsEarned > 0) {
          const gemEvents = [];
          for (let i = 0; i < gemsEarned; i++) {
            gemEvents.push({
              student_id: user!.id,
              session_id: sessionId,
              gem_type: 'grammar',
              gem_rarity: 'common',
              game_type: 'grammar-lesson', // Required field
              xp_value: Math.floor(xpEarned / gemsEarned),
              created_at: new Date().toISOString()
            });
          }

          const { error: gemError } = await supabase
            .from('gem_events')
            .insert(gemEvents);

          if (gemError) {
            console.error('❌ [GRAMMAR LESSON] Error creating gem events:', gemError);
          } else {
            console.log('✅ [GRAMMAR LESSON] Created', gemEvents.length, 'gem events');
          }
        }

        console.log('✅ [GRAMMAR LESSON] Session completed successfully');

        // Update assignment progress
        await updateAssignmentProgress(supabase, assignmentId!, user!.id, topicId);
        
      } catch (error) {
        console.error('❌ [GRAMMAR LESSON] Error completing lesson:', error);
      }
    };

    // Complete session when user leaves the page
    const handleBeforeUnload = () => {
      completeLessonSession();
    };

    // Also complete after 2 minutes of viewing
    const timer = setTimeout(() => {
      completeLessonSession();
    }, 120000); // 2 minutes

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(timer);
      // Complete session on unmount if not already completed
      completeLessonSession();
    };
  }, [sessionId, isAssignmentMode, startTime, assignmentId, user, topicId]);

  // This component doesn't render anything
  return null;
}

async function updateAssignmentProgress(
  supabase: any,
  assignmentId: string,
  studentId: string,
  topicId: string
) {
  try {
    console.log('📊 [GRAMMAR LESSON] Updating assignment progress');
    
    // Get current progress
    const { data: currentProgress } = await supabase
      .from('enhanced_assignment_progress')
      .select('grammar_sessions_completed, grammar_topics_practiced, grammar_total_questions, grammar_correct_answers')
      .eq('assignment_id', assignmentId)
      .eq('student_id', studentId)
      .single();
    
    if (currentProgress) {
      // Update with incremented values
      const topicsPracticed = currentProgress.grammar_topics_practiced || [];
      if (!topicsPracticed.includes(topicId)) {
        topicsPracticed.push(topicId);
      }
      
      const { error: progressError } = await supabase
        .from('enhanced_assignment_progress')
        .update({
          grammar_sessions_completed: (currentProgress.grammar_sessions_completed || 0) + 1,
          grammar_topics_practiced: topicsPracticed,
          updated_at: new Date().toISOString()
        })
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);
      
      if (progressError) {
        console.warn('⚠️ [GRAMMAR LESSON] Error updating assignment progress:', progressError);
      } else {
        console.log('✅ [GRAMMAR LESSON] Assignment progress updated');
      }
    }
  } catch (error) {
    console.error('❌ [GRAMMAR LESSON] Error updating assignment progress:', error);
  }
}

