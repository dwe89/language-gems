
import {
    DEMO_CLASSES,
    DEMO_STUDENTS,
    ALL_DEMO_STUDENTS,
    DEMO_TEACHER,
    FRENCH_VOCABULARY,
    SPANISH_VOCABULARY,
    GERMAN_VOCABULARY
} from './demoData';
import {
    ClassSummaryData,
    TopMetrics,
    UrgentIntervention,
    ClassWeakness,
    RecentAssignment
} from '../../types/teacherAnalytics';
import {
    TeacherVocabularyAnalytics,
    StudentVocabularyProgress,
    TopicAnalysis,
    VocabularyTrend,
    ClassVocabularyStats,
    WordDetail,
    StudentWordDetail,
    ProficiencyLevel
} from '../../services/teacherVocabularyAnalytics';
import {
    TeacherGrammarAnalytics,
    TopicPerformance,
    StudentGrammarProgress
} from '../../services/teacherGrammarAnalytics';

// =====================================================
// CLASS SUMMARY DATA (TIER 1)
// =====================================================

const generateClassSummary = (classId: string): ClassSummaryData => {
    const students = DEMO_STUDENTS[classId] || [];
    const classData = DEMO_CLASSES.find(c => c.id === classId);

    // Calculate average score
    const avgScore = Math.round(students.reduce((sum, s) => sum + s.accuracy, 0) / students.length);

    // Create top metrics
    const topMetrics: TopMetrics = {
        averageScore: avgScore,
        assignmentsOverdue: Math.floor(Math.random() * 5),
        currentStreak: Math.floor(Math.random() * 10) + 2,
        trendPercentage: 5.2,
        trendDirection: 'up',
        activeStudents: Math.floor(students.length * 0.9),
        totalStudents: students.length,
        studentsNeverLoggedIn: Math.floor(students.length * 0.05)
    };

    // Generate urgent interventions
    const urgentInterventions: UrgentIntervention[] = students
        .filter(s => s.accuracy < 60)
        .slice(0, 5)
        .map(s => ({
            studentId: s.id,
            studentName: s.name,
            riskLevel: s.accuracy < 40 ? 'critical' : 'high',
            riskScore: 100 - s.accuracy,
            averageScore: s.accuracy,
            lastActive: new Date(s.lastActive),
            riskFactors: ['Low Accuracy', 'Declining Trend']
        }));

    // Students never logged in
    const studentsNeverLoggedIn: UrgentIntervention[] = students
        .filter(s => s.sessionsCompleted === 0)
        .map(s => ({
            studentId: s.id,
            studentName: s.name,
            riskLevel: 'critical',
            riskScore: 100,
            averageScore: 0,
            lastActive: null,
            riskFactors: ['Never Logged In']
        }));

    // Class weakness
    const topClassWeakness: ClassWeakness = {
        skillName: 'Subjunctive Mood',
        skillType: 'grammar',
        studentsAffected: Math.floor(students.length * 0.4),
        totalStudents: students.length,
        failureRate: 45,
        commonError: 'Incorrect conjugation in subordinate clauses',
        recentOccurrences: 3
    };

    // Recent assignments
    const recentAssignments: RecentAssignment[] = [
        {
            assignmentId: 'assign-1',
            assignmentName: 'Past Tense Review',
            averageScore: 78,
            efficacy: 'high',
            status: 'complete',
            completedCount: Math.floor(students.length * 0.9),
            totalStudents: students.length,
            dueDate: new Date(Date.now() - 86400000)
        },
        {
            assignmentId: 'assign-2',
            assignmentName: 'Vocabulary: Travel',
            averageScore: 82,
            efficacy: 'high',
            status: 'in-progress',
            completedCount: Math.floor(students.length * 0.6),
            totalStudents: students.length,
            dueDate: new Date(Date.now() + 86400000)
        }
    ];

    return {
        topMetrics,
        urgentInterventions,
        studentsNeverLoggedIn,
        topClassWeakness,
        recentAssignments
    };
};

export const DEMO_CLASS_SUMMARIES: Record<string, ClassSummaryData> = {
    [DEMO_CLASSES[0].id]: generateClassSummary(DEMO_CLASSES[0].id),
    [DEMO_CLASSES[1].id]: generateClassSummary(DEMO_CLASSES[1].id),
    [DEMO_CLASSES[2].id]: generateClassSummary(DEMO_CLASSES[2].id),
};

// =====================================================
// MULTI-CLASS OVERVIEW DATA
// =====================================================

export const DEMO_MULTI_CLASS_DATA = {
    totalStudents: ALL_DEMO_STUDENTS.length,
    totalActiveStudents: ALL_DEMO_STUDENTS.filter(s => new Date(s.lastActive).getTime() > Date.now() - 7 * 86400000).length,
    overallAverageScore: Math.round(ALL_DEMO_STUDENTS.reduce((sum, s) => sum + s.accuracy, 0) / ALL_DEMO_STUDENTS.length),
    overallCompletionRate: 85,
    totalStudentsNeverLoggedIn: ALL_DEMO_STUDENTS.filter(s => s.sessionsCompleted === 0).length,
    totalClassesWithIssues: 1,
    classes: DEMO_CLASSES.map(c => {
        const summary = DEMO_CLASS_SUMMARIES[c.id];
        return {
            classId: c.id,
            className: c.name,
            totalStudents: summary.topMetrics.totalStudents!,
            activeStudents: summary.topMetrics.activeStudents!,
            averageScore: summary.topMetrics.averageScore,
            completionRate: 88, // hardcoded for demo
            studentsNeverLoggedIn: summary.studentsNeverLoggedIn.length,
            status: (summary.topMetrics.averageScore < 70 ? 'warning' : 'healthy') as 'warning' | 'healthy' | 'critical'
        };
    })
};

// =====================================================
// VOCABULARY ANALYTICS DATA
// =====================================================

const generateDetailedWordAnalytics = (classId: string, language: string): WordDetail[] => {
    let vocabularyList = FRENCH_VOCABULARY;
    if (language === 'Spanish') vocabularyList = SPANISH_VOCABULARY;
    if (language === 'German') vocabularyList = GERMAN_VOCABULARY;

    return vocabularyList.map(item => {
        const accuracy = 40 + Math.floor(Math.random() * 55); // 40-95%
        const totalEncounters = 50 + Math.floor(Math.random() * 200);
        const studentsStruggling = Math.floor(Math.random() * 10);

        let proficiencyLevel: ProficiencyLevel = 'learning';
        if (accuracy > 85) proficiencyLevel = 'proficient';
        if (accuracy < 60) proficiencyLevel = 'struggling';

        return {
            ...item,
            subcategory: null,
            language,
            totalEncounters,
            correctEncounters: Math.floor(totalEncounters * (accuracy / 100)),
            accuracy,
            masteryLevel: proficiencyLevel === 'proficient' ? 4.5 : proficiencyLevel === 'learning' ? 3.0 : 1.5,
            proficiencyLevel,
            studentsStruggling,
            studentsProficient: Math.floor(Math.random() * 15),
            studentsLearning: Math.floor(Math.random() * 10),
            commonErrors: ['Wrong gender', 'Incorrect spelling', 'False friend'],
            strugglingCount: studentsStruggling,
            mistakeCount: Math.floor(totalEncounters * ((100 - accuracy) / 100))
        };
    });
};

const generateStudentWordDetails = (classId: string, language: string): StudentWordDetail[] => {
    const students = DEMO_STUDENTS[classId] || [];
    let vocabularyList = FRENCH_VOCABULARY;
    if (language === 'Spanish') vocabularyList = SPANISH_VOCABULARY;
    if (language === 'German') vocabularyList = GERMAN_VOCABULARY;

    return students.map(student => {
        // Randomly assign strong and weak words for each student
        const shuffledVocab = [...vocabularyList].sort(() => Math.random() - 0.5);
        const strongWords = shuffledVocab.slice(0, 5).map(w => ({
            word: w.word,
            translation: w.translation,
            accuracy: 85 + Math.floor(Math.random() * 15),
            proficiencyLevel: 'proficient' as ProficiencyLevel,
            category: w.category
        }));

        const weakWords = shuffledVocab.slice(5, 10).map(w => ({
            word: w.word,
            translation: w.translation,
            accuracy: 30 + Math.floor(Math.random() * 40),
            totalEncounters: 5 + Math.floor(Math.random() * 10),
            category: w.category,
            errorPattern: Math.random() > 0.5 ? 'Spelling mismatch' : 'Gender error' // Only if we assume it exists on interface? 
            // StudentWordDetail in service definition: errorPattern?: string
        }));

        const recentProgress = shuffledVocab.slice(0, 3).map(w => ({
            word: w.word,
            beforeAccuracy: 50 + Math.floor(Math.random() * 20),
            afterAccuracy: 75 + Math.floor(Math.random() * 20),
            improvement: 15 + Math.floor(Math.random() * 15)
        }));

        return {
            studentId: student.id,
            studentName: student.name,
            strongWords,
            weakWords,
            recentProgress
        };
    });
};

const generateVocabularyAnalytics = (classId: string): TeacherVocabularyAnalytics => {
    const students = DEMO_STUDENTS[classId] || [];
    const language = DEMO_CLASSES.find(c => c.id === classId)?.language || 'French';

    // Student Progress
    const studentProgress: StudentVocabularyProgress[] = students.map(s => ({
        studentId: s.id,
        studentName: s.name,
        totalWords: s.wordsLearned,
        proficientWords: Math.floor(s.wordsLearned * 0.4),
        learningWords: Math.floor(s.wordsLearned * 0.4),
        strugglingWords: Math.floor(s.wordsLearned * 0.2),
        overdueWords: Math.floor(Math.random() * 10),
        averageAccuracy: s.accuracy,
        memoryStrength: 75 + Math.floor(Math.random() * 20),
        wordsReadyForReview: Math.floor(Math.random() * 15),
        lastActivity: s.lastActive,
        classId: classId,
        className: DEMO_CLASSES.find(c => c.id === classId)?.name || 'Class'
    }));

    // Class Stats
    const classStats: ClassVocabularyStats = {
        totalStudents: students.length,
        totalWords: studentProgress.reduce((sum, s) => sum + s.totalWords, 0),
        proficientWords: studentProgress.reduce((sum, s) => sum + s.proficientWords, 0),
        learningWords: studentProgress.reduce((sum, s) => sum + s.learningWords, 0),
        strugglingWords: studentProgress.reduce((sum, s) => sum + s.strugglingWords, 0),
        averageAccuracy: Math.round(studentProgress.reduce((sum, s) => sum + s.averageAccuracy, 0) / students.length),
        studentsWithOverdueWords: studentProgress.filter(s => s.overdueWords > 0).length,
        activeStudentsLast7Days: Math.floor(students.length * 0.8),
        topPerformingStudents: studentProgress.sort((a, b) => b.averageAccuracy - a.averageAccuracy).slice(0, 5),
        strugglingStudents: studentProgress.sort((a, b) => a.averageAccuracy - b.averageAccuracy).slice(0, 5),
        totalWordsReadyForReview: studentProgress.reduce((sum, s) => sum + s.wordsReadyForReview, 0)
    };

    // Topic Analysis
    const topics = ['Family', 'Food', 'Travel', 'School', 'Hobbies'];
    const topicAnalysis: TopicAnalysis[] = topics.map(topic => ({
        category: topic,
        subcategory: null,
        theme: 'General',
        language,
        curriculumLevel: 'GCSE',
        totalStudents: students.length,
        studentsEngaged: Math.floor(students.length * 0.9),
        averageAccuracy: 70 + Math.floor(Math.random() * 25),
        totalWords: 50,
        proficientWords: 20,
        learningWords: 20,
        strugglingWords: 10,
        isWeakTopic: Math.random() < 0.2,
        isStrongTopic: Math.random() > 0.8,
        recommendedAction: 'Practice more'
    }));

    // Trends
    const trends: VocabularyTrend[] = Array.from({ length: 7 }).map((_, i) => ({
        date: new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0],
        totalWords: 1000 + i * 50,
        proficientWords: 400 + i * 20,
        learningWords: 400 + i * 10,
        strugglingWords: 200 - i * 5,
        averageAccuracy: 75 + i,
        activeStudents: Math.floor(students.length * (0.7 + Math.random() * 0.2)),
        wordsLearned: 50 + Math.floor(Math.random() * 20)
    }));

    return {
        classStats,
        studentProgress,
        topicAnalysis,
        trends,
        insights: {
            weakestTopics: topicAnalysis.filter(t => t.averageAccuracy < 75).slice(0, 3),
            strongestTopics: topicAnalysis.filter(t => t.averageAccuracy >= 85).slice(0, 3),
            studentsNeedingAttention: studentProgress.filter(s => s.averageAccuracy < 60).slice(0, 5),
            classRecommendations: ['Review "Past Tense" verbs', 'Focus on "Travel" vocabulary']
        },
        detailedWordAnalytics: generateDetailedWordAnalytics(classId, language),
        studentWordDetails: generateStudentWordDetails(classId, language)
    };
};

export const DEMO_VOCAB_ANALYTICS: Record<string, TeacherVocabularyAnalytics> = {
    [DEMO_CLASSES[0].id]: generateVocabularyAnalytics(DEMO_CLASSES[0].id),
    [DEMO_CLASSES[1].id]: generateVocabularyAnalytics(DEMO_CLASSES[1].id),
    [DEMO_CLASSES[2].id]: generateVocabularyAnalytics(DEMO_CLASSES[2].id),
};

// =====================================================
// GRAMMAR ANALYTICS DATA
// =====================================================

const generateGrammarAnalytics = (classId: string): TeacherGrammarAnalytics => {
    const students = DEMO_STUDENTS[classId] || [];

    // Topics
    const grammarTopics = ['Present Tense', 'Past Tense', 'Future Tense', 'Adjectives', 'Pronouns'];

    const topicPerformance: TopicPerformance[] = grammarTopics.map((topic, i) => ({
        topicId: `topic-${i}`,
        topicTitle: topic,
        totalAttempts: 150 + Math.floor(Math.random() * 100),
        correctAttempts: 100 + Math.floor(Math.random() * 50),
        accuracyPercentage: 65 + Math.floor(Math.random() * 30),
        studentsAttempted: Math.floor(students.length * 0.8),
        averageResponseTime: 3000
    }));

    const studentProgress: StudentGrammarProgress[] = students.map(s => ({
        studentId: s.id,
        studentName: s.name,
        totalAttempts: 50 + Math.floor(Math.random() * 50),
        correctAttempts: 30 + Math.floor(Math.random() * 30),
        accuracyPercentage: s.accuracy,
        topicsMastered: Math.floor(Math.random() * 3),
        topicsInProgress: 2,
        tensesMastered: Math.floor(Math.random() * 3),
        tensesInProgress: 2,
        lastActive: new Date(s.lastActive),
        topicBreakdown: grammarTopics.map((t, i) => ({
            topicId: `topic-${i}`,
            topicTitle: t,
            attempts: 10,
            correct: 7,
            accuracy: 70
        })),
        tenseBreakdown: []
    }));

    return {
        classStats: {
            totalStudents: students.length,
            totalAttempts: studentProgress.reduce((sum, s) => sum + s.totalAttempts, 0),
            averageAccuracy: 72,
            totalTopicsTracked: grammarTopics.length,
            activeStudentsLast7Days: Math.floor(students.length * 0.7)
        },
        topicPerformance,
        studentProgress,
        insights: {
            studentsNeedingAttention: studentProgress.filter(s => s.accuracyPercentage < 60).map(s => ({
                studentId: s.studentId,
                studentName: s.studentName,
                accuracy: s.accuracyPercentage,
                attemptsCount: s.totalAttempts,
                weakestTopic: 'Past Tense'
            })).slice(0, 5),
            strongestTopics: ['Present Tense'],
            weakestTopics: ['Past Tense'],
            recentTrend: 'improving'
        }
    };
};

export const DEMO_GRAMMAR_ANALYTICS: Record<string, TeacherGrammarAnalytics> = {
    [DEMO_CLASSES[0].id]: generateGrammarAnalytics(DEMO_CLASSES[0].id),
    [DEMO_CLASSES[1].id]: generateGrammarAnalytics(DEMO_CLASSES[1].id),
    [DEMO_CLASSES[2].id]: generateGrammarAnalytics(DEMO_CLASSES[2].id),
};
