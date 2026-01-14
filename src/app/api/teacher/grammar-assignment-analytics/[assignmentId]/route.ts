import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role for bypassing RLS
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TopicStepProgress {
    topic_id: string;
    topic_name: string;
    lesson_completed: boolean;
    lesson_completed_at?: string;
    practice_completed: boolean;
    practice_best_accuracy: number;
    practice_attempts: number;
    test_completed: boolean;
    test_best_accuracy: number;
    test_passed: boolean;
    topic_mastery_level: string;
    total_gems_earned: number;
}

interface StudentGrammarProgress {
    student_id: string;
    student_name: string;
    avatar_url?: string;
    topics_progress: TopicStepProgress[];
    overall_completion: number;
    average_accuracy: number;
    total_time_spent: number;
    total_gems_earned: number;
    mastery_level: string;
    last_activity: string;
}

export async function GET(
    request: NextRequest,
    { params }: { params: { assignmentId: string } }
) {
    try {
        const assignmentId = params.assignmentId;

        if (!assignmentId) {
            return NextResponse.json({ error: 'Assignment ID required' }, { status: 400 });
        }

        // Fetch assignment details
        const { data: assignment, error: assignmentError } = await supabase
            .from('assignments')
            .select('id, title, created_by, class_id, game_config')
            .eq('id', assignmentId)
            .single();

        if (assignmentError || !assignment) {
            return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
        }

        // Get topic IDs from skills config
        const skillsConfig = assignment.game_config?.skillsConfig;
        const selectedSkills = skillsConfig?.selectedSkills || [];
        const allTopicIds: string[] = [];

        selectedSkills.forEach((skill: any) => {
            const topicIds = skill.instanceConfig?.topicIds || [];
            allTopicIds.push(...topicIds);
        });

        // Fetch topic details
        const { data: topics } = await supabase
            .from('grammar_topics')
            .select('id, title, category')
            .in('id', allTopicIds);

        const topicsData = (topics || []).map(t => ({
            id: t.id,
            name: t.title,
            category: t.category
        }));

        // Get students enrolled in this class
        const { data: enrollments } = await supabase
            .from('class_enrollments')
            .select('student_id')
            .eq('class_id', assignment.class_id)
            .eq('status', 'active');

        const studentIds = (enrollments || []).map((e: any) => e.student_id);

        let students: any[] = [];

        if (studentIds.length > 0) {
            // Fetch profiles separately (more reliable than join on non-FK)
            const { data: profiles } = await supabase
                .from('user_profiles')
                .select('user_id, display_name')
                .in('user_id', studentIds);

            students = (profiles || []).map((p: any) => ({
                id: p.user_id,
                name: p.display_name || 'Unknown Student',
                avatar_url: null
            }));

            // Add any students who have enrollment but no profile (fallback)
            const profileIds = new Set(students.map(s => s.id));
            studentIds.forEach(id => {
                if (!profileIds.has(id)) {
                    students.push({
                        id: id,
                        name: 'Unknown Student',
                        avatar_url: null
                    });
                }
            });
        }

        // Fetch step progress for all students
        const { data: stepProgress } = await supabase
            .from('grammar_topic_step_progress')
            .select('*')
            .eq('assignment_id', assignmentId);

        // Also fetch from grammar_assignment_sessions for backwards compatibility
        const { data: sessions } = await supabase
            .from('grammar_assignment_sessions')
            .select('*')
            .eq('assignment_id', assignmentId)
            .eq('completion_status', 'completed');

        // Build progress map per student
        const studentProgressMap = new Map<string, TopicStepProgress[]>();
        const studentStatsMap = new Map<string, {
            totalGems: number;
            totalTime: number;
            lastActivity: string;
            accuracies: number[];
        }>();

        // Initialize for all enrolled students
        students.forEach((s: any) => {
            studentProgressMap.set(s.id, []);
            studentStatsMap.set(s.id, {
                totalGems: 0,
                totalTime: 0,
                lastActivity: new Date(0).toISOString(),
                accuracies: []
            });
        });

        // Process step progress data
        (stepProgress || []).forEach((progress: any) => {
            const existing = studentProgressMap.get(progress.student_id) || [];

            const topicInfo = topicsData.find(t => t.id === progress.topic_id);

            existing.push({
                topic_id: progress.topic_id,
                topic_name: topicInfo?.name || 'Unknown Topic',
                lesson_completed: progress.lesson_completed || false,
                lesson_completed_at: progress.lesson_completed_at,
                practice_completed: progress.practice_completed || false,
                practice_best_accuracy: progress.practice_best_accuracy || 0,
                practice_attempts: progress.practice_attempts || 0,
                test_completed: progress.test_completed || false,
                test_best_accuracy: progress.test_best_accuracy || 0,
                test_passed: progress.test_passed || false,
                topic_mastery_level: progress.topic_mastery_level || 'not_started',
                total_gems_earned: progress.total_gems_earned || 0
            });

            studentProgressMap.set(progress.student_id, existing);

            // Update stats
            const stats = studentStatsMap.get(progress.student_id);
            if (stats) {
                stats.totalGems += progress.total_gems_earned || 0;
                stats.totalTime += (progress.lesson_time_spent_seconds || 0) + (progress.practice_total_time_seconds || 0);
                if (progress.updated_at > stats.lastActivity) {
                    stats.lastActivity = progress.updated_at;
                }
                if (progress.practice_best_accuracy > 0) {
                    stats.accuracies.push(progress.practice_best_accuracy);
                }
                if (progress.test_best_accuracy > 0) {
                    stats.accuracies.push(progress.test_best_accuracy);
                }
            }
        });

        // Also process sessions for students without step progress
        (sessions || []).forEach((session: any) => {
            const stats = studentStatsMap.get(session.student_id);
            if (stats) {
                if (!stats.totalGems) {
                    stats.totalGems += session.gems_earned || 0;
                }
                if (!stats.totalTime) {
                    stats.totalTime += session.duration_seconds || 0;
                }
                if (session.ended_at && session.ended_at > stats.lastActivity) {
                    stats.lastActivity = session.ended_at;
                }
                if (session.accuracy_percentage > 0 && stats.accuracies.length === 0) {
                    stats.accuracies.push(session.accuracy_percentage);
                }
            }
        });

        // Calculate completion stats
        let lessonsCompleted = 0;
        let practiceCompleted = 0;
        let testsCompleted = 0;
        let fullyMastered = 0;

        // Build student progress list
        const studentsProgress: StudentGrammarProgress[] = students.map((student: any) => {
            const topicsProgress = studentProgressMap.get(student.id) || [];
            const stats = studentStatsMap.get(student.id)!;

            // Count completions per topic for this student
            const hasLesson = topicsProgress.some(t => t.lesson_completed);
            const hasPractice = topicsProgress.some(t => t.practice_completed);
            const hasTest = topicsProgress.some(t => t.test_completed && t.test_passed);
            const isMastered = topicsProgress.length > 0 &&
                topicsProgress.every(t => t.topic_mastery_level === 'mastered');

            if (hasLesson) lessonsCompleted++;
            if (hasPractice) practiceCompleted++;
            if (hasTest) testsCompleted++;
            if (isMastered) fullyMastered++;

            // Calculate overall completion (0-100%)
            const totalSteps = allTopicIds.length * 3; // lesson + practice + test per topic
            const completedSteps = topicsProgress.reduce((acc, t) => {
                return acc +
                    (t.lesson_completed ? 1 : 0) +
                    (t.practice_completed ? 1 : 0) +
                    (t.test_completed && t.test_passed ? 1 : 0);
            }, 0);

            const completion = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

            // Calculate average accuracy
            const avgAccuracy = stats.accuracies.length > 0
                ? stats.accuracies.reduce((a, b) => a + b, 0) / stats.accuracies.length
                : 0;

            // Determine overall mastery level
            let masteryLevel = 'not_started';
            if (isMastered) masteryLevel = 'mastered';
            else if (hasTest) masteryLevel = 'testing';
            else if (hasPractice) masteryLevel = 'practicing';
            else if (hasLesson) masteryLevel = 'in_progress';

            return {
                student_id: student.id,
                student_name: student.name,
                avatar_url: student.avatar_url,
                topics_progress: topicsProgress,
                overall_completion: completion,
                average_accuracy: avgAccuracy,
                total_time_spent: stats.totalTime,
                total_gems_earned: stats.totalGems,
                mastery_level: masteryLevel,
                last_activity: stats.lastActivity
            };
        });

        // Find highest performer and those needing attention
        const sortedByAccuracy = [...studentsProgress]
            .filter(s => s.average_accuracy > 0)
            .sort((a, b) => b.average_accuracy - a.average_accuracy);

        const highestPerformer = sortedByAccuracy[0]?.student_name || null;
        const needsAttention = studentsProgress
            .filter(s => s.average_accuracy > 0 && s.average_accuracy < 60)
            .map(s => s.student_name);

        // Calculate totals
        const totalSessions = sessions?.length || 0;
        const totalTimeMinutes = studentsProgress.reduce((acc, s) => acc + s.total_time_spent, 0) / 60;
        const totalGemsAwarded = studentsProgress.reduce((acc, s) => acc + s.total_gems_earned, 0);

        // Calculate average accuracies
        const practiceAccuracies = (stepProgress || [])
            .map((p: any) => p.practice_best_accuracy)
            .filter((a: number) => a > 0);
        const testAccuracies = (stepProgress || [])
            .map((p: any) => p.test_best_accuracy)
            .filter((a: number) => a > 0);

        const avgPracticeAccuracy = practiceAccuracies.length > 0
            ? practiceAccuracies.reduce((a: number, b: number) => a + b, 0) / practiceAccuracies.length
            : 0;
        const avgTestAccuracy = testAccuracies.length > 0
            ? testAccuracies.reduce((a: number, b: number) => a + b, 0) / testAccuracies.length
            : 0;

        // Identify common mistakes
        const mistakeMap = new Map<string, {
            count: number;
            attempts: number;
            type: string;
            question: string;
        }>();

        (sessions || []).forEach((session: any) => {
            if (session.session_data && session.session_data.question_attempts) {
                const attempts = session.session_data.question_attempts;
                attempts.forEach((attempt: any) => {
                    const qText = attempt.question_text;
                    if (!qText) return;

                    // Normalize key
                    const key = qText.trim();
                    const current = mistakeMap.get(key) || {
                        count: 0,
                        attempts: 0,
                        type: attempt.question_type || 'unknown',
                        question: qText
                    };

                    current.attempts++;
                    if (!attempt.is_correct) {
                        current.count++;
                    }
                    mistakeMap.set(key, current);
                });
            }
        });

        // Convert to array and sort by failure count
        const commonMistakes = Array.from(mistakeMap.values())
            .filter(m => m.count > 0) // Only questions with failures
            .map(m => ({
                question: m.question,
                type: m.type,
                incorrect_count: m.count,
                total_attempts: m.attempts,
                fail_rate: m.attempts > 0 ? (m.count / m.attempts) * 100 : 0
            }))
            .sort((a, b) => b.incorrect_count - a.incorrect_count)
            .slice(0, 5); // Top 5 mistakes

        const response = {
            assignment_id: assignmentId,
            assignment_title: assignment.title,
            total_students: students.length,
            topics: topicsData,
            completion_stats: {
                lessons_completed: lessonsCompleted,
                practice_completed: practiceCompleted,
                tests_completed: testsCompleted,
                fully_mastered: fullyMastered
            },
            accuracy_stats: {
                average_practice_accuracy: avgPracticeAccuracy,
                average_test_accuracy: avgTestAccuracy,
                highest_performer: highestPerformer,
                needs_attention: needsAttention
            },
            engagement_stats: {
                total_sessions: totalSessions,
                total_time_minutes: totalTimeMinutes,
                total_gems_awarded: totalGemsAwarded,
                average_attempts_per_topic: allTopicIds.length > 0
                    ? totalSessions / (students.length * allTopicIds.length)
                    : 0
            },
            students: studentsProgress,
            common_mistakes: commonMistakes
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching grammar assignment analytics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}
