
import {
    FRENCH_VOCABULARY,
    SPANISH_VOCABULARY,
    GERMAN_VOCABULARY,
    DEMO_CLASSES,
    DEMO_STUDENTS
} from './demoData';

// =====================================================
// ENHANCED WORD ANALYSIS DATA
// =====================================================

export interface EnhancedWordDetail {
    id: string;
    word: string;
    translation: string;
    category: string;
    language: string;

    // Core Stats
    accuracy: number;
    totalAttempts: number;
    avgResponseTime: number; // ms

    // Skill Breakdown
    skills: {
        reading: number; // accuracy %
        writing: number;
        listening: number;
        speaking: number;
    };

    // Error Analysis
    commonMistakes: Array<{
        mistake: string;
        count: number;
        type: 'spelling' | 'grammar' | 'semantic' | 'accent';
    }>;
    confusedWith: Array<{
        word: string;
        count: number;
    }>;

    // Engagement
    strugglingStudentsCount: number;
    lastPracticed: string;
}

const generateMistakes = (word: string, translation: string): EnhancedWordDetail['commonMistakes'] => {
    return [
        { mistake: word.replace(/[aeiou]/, 'a'), count: Math.floor(Math.random() * 15) + 5, type: 'spelling' },
        { mistake: word.slice(0, -1), count: Math.floor(Math.random() * 10) + 2, type: 'grammar' },
        { mistake: `The ${translation}`, count: Math.floor(Math.random() * 5) + 1, type: 'semantic' }
    ];
};

export const DEMO_ENHANCED_WORD_DETAILS: EnhancedWordDetail[] = [
    ...FRENCH_VOCABULARY.map((v, i) => ({ ...v, lang: 'French', id: `fr-${i}` })),
    ...SPANISH_VOCABULARY.map((v, i) => ({ ...v, lang: 'Spanish', id: `sp-${i}` })),
    ...GERMAN_VOCABULARY.map((v, i) => ({ ...v, lang: 'German', id: `de-${i}` }))
].map(item => ({
    id: item.id,
    word: item.word,
    translation: item.translation,
    category: item.category,
    language: item.lang,
    accuracy: 40 + Math.floor(Math.random() * 55),
    totalAttempts: 100 + Math.floor(Math.random() * 500),
    avgResponseTime: 1200 + Math.floor(Math.random() * 2000),
    skills: {
        reading: 60 + Math.floor(Math.random() * 35),
        writing: 50 + Math.floor(Math.random() * 40),
        listening: 55 + Math.floor(Math.random() * 35),
        speaking: 40 + Math.floor(Math.random() * 40),
    },
    commonMistakes: generateMistakes(item.word, item.translation),
    confusedWith: [
        { word: 'Similar Word A', count: Math.floor(Math.random() * 10) },
        { word: 'False Friend B', count: Math.floor(Math.random() * 8) }
    ],
    strugglingStudentsCount: Math.floor(Math.random() * 10),
    lastPracticed: new Date(Date.now() - Math.floor(Math.random() * 5 * 24 * 60 * 60 * 1000)).toISOString()
}));


// =====================================================
// CONTENT MANAGER DATA
// =====================================================

export interface ContentSet {
    id: string;
    title: string;
    language: string;
    wordCount: number;
    author: string;
    lastModified: string;
    status: 'published' | 'draft';
    tags: string[];
    downloads: number;
    rating: number;
}

export const DEMO_CONTENT_SETS: ContentSet[] = [
    {
        id: 'set-1',
        title: 'GCSE French Core: Family & Relationships',
        language: 'French',
        wordCount: 124,
        author: 'Sarah Mitchell',
        lastModified: '2 days ago',
        status: 'published',
        tags: ['GCSE', 'AQA', 'Module 1'],
        downloads: 45,
        rating: 4.8
    },
    {
        id: 'set-2',
        title: 'Spanish Holidays & Travel',
        language: 'Spanish',
        wordCount: 85,
        author: 'Sarah Mitchell',
        lastModified: '1 week ago',
        status: 'published',
        tags: ['Holidays', 'Vocabulary'],
        downloads: 32,
        rating: 4.5
    },
    {
        id: 'set-3',
        title: 'German Modal Verbs',
        language: 'German',
        wordCount: 25,
        author: 'Sarah Mitchell',
        lastModified: '3 weeks ago',
        status: 'draft',
        tags: ['Grammar', 'Verbs'],
        downloads: 0,
        rating: 0
    },
    {
        id: 'set-4',
        title: 'Advanced French Adjectives',
        language: 'French',
        wordCount: 150,
        author: 'Language Gems Team',
        lastModified: '1 month ago',
        status: 'published',
        tags: ['Adjectives', 'Higher Tier'],
        downloads: 120,
        rating: 4.9
    }
];

// =====================================================
// ASSESSMENTS DATA
// =====================================================

export interface Assessment {
    id: string;
    title: string;
    type: 'quiz' | 'exam' | 'speaking' | 'listening';
    classId: string;
    className: string;
    dueDate: string;
    status: 'scheduled' | 'active' | 'grading' | 'completed';
    submittedCount: number;
    totalStudents: number;
    avgScore?: number;
}

export const DEMO_ASSESSMENTS: Assessment[] = [
    {
        id: 'assess-1',
        title: 'End of Term Mock Exam',
        type: 'exam',
        classId: DEMO_CLASSES[0].id,
        className: DEMO_CLASSES[0].name,
        dueDate: 'Tomorrow, 15:00',
        status: 'active',
        submittedCount: 12,
        totalStudents: 28,
        avgScore: undefined
    },
    {
        id: 'assess-2',
        title: 'Weekly Vocab Quiz: Food',
        type: 'quiz',
        classId: DEMO_CLASSES[1].id,
        className: DEMO_CLASSES[1].name,
        dueDate: 'Yesterday',
        status: 'grading',
        submittedCount: 24,
        totalStudents: 24,
        avgScore: 78
    },
    {
        id: 'assess-3',
        title: 'Speaking Practice: Roleplay',
        type: 'speaking',
        classId: DEMO_CLASSES[0].id,
        className: DEMO_CLASSES[0].name,
        dueDate: 'In 3 days',
        status: 'scheduled',
        submittedCount: 0,
        totalStudents: 28,
        avgScore: undefined
    }
];

// =====================================================
// COMPETITIONS DATA
// =====================================================

export interface Competition {
    id: string;
    title: string;
    type: 'leaderboard' | 'team_battle' | 'streak_challenge';
    scope: 'class' | 'school' | 'global';
    participants: number;
    endsIn: string; // e.g., "2 days"
    topPrize: string;
    status: 'active' | 'upcoming' | 'ended';
    leaders: Array<{ name: string; score: number; avatar: string }>;
}

export const DEMO_COMPETITIONS: Competition[] = [
    {
        id: 'comp-1',
        title: 'The Great Gem Heist',
        type: 'leaderboard',
        scope: 'school',
        participants: 142,
        endsIn: '2 days 4h',
        topPrize: 'Legendary Gem Chest',
        status: 'active',
        leaders: [
            { name: 'Emma S.', score: 12500, avatar: '🦊' },
            { name: 'Liam J.', score: 11200, avatar: '🦁' },
            { name: 'Sophia G.', score: 10800, avatar: '🐼' }
        ]
    },
    {
        id: 'comp-2',
        title: 'Class 10-FR vs 10-DE',
        type: 'team_battle',
        scope: 'school',
        participants: 50,
        endsIn: '5 hours',
        topPrize: 'Pizza Party',
        status: 'active',
        leaders: [
            { name: 'Year 10 French', score: 45000, avatar: '🇫🇷' },
            { name: 'Year 10 German', score: 43200, avatar: '🇩🇪' }
        ]
    }
];
