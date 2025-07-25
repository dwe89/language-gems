#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}
// Initialize Supabase client with service role key for full access
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
// Validation schemas
const CreateAssignmentSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    teacher_id: z.string().uuid(),
    class_id: z.string().uuid(),
    game_type: z.string(),
    vocabulary_list_id: z.string().uuid().optional(),
    vocabulary_selection: z.object({
        type: z.enum(['all', 'random', 'manual']),
        count: z.number().optional(),
        word_ids: z.array(z.string().uuid()).optional(),
    }),
    game_settings: z.record(z.any()),
    due_date: z.string().optional(),
    time_limit: z.number().optional(),
});
const UpdateProgressSchema = z.object({
    assignment_id: z.string().uuid(),
    student_id: z.string().uuid(),
    score: z.number(),
    accuracy: z.number(),
    time_spent: z.number(),
    completed: z.boolean(),
    session_data: z.record(z.any()).optional(),
});
const CreateVocabularyListSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    teacher_id: z.string().uuid(),
    language: z.enum(['spanish', 'french', 'german', 'italian']),
    content_type: z.enum(['words', 'sentences', 'mixed']),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
    is_public: z.boolean().default(false),
    items: z.array(z.object({
        type: z.enum(['word', 'sentence', 'phrase']),
        term: z.string(),
        translation: z.string(),
        part_of_speech: z.string().optional(),
        context_sentence: z.string().optional(),
        context_translation: z.string().optional(),
        difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
        notes: z.string().optional(),
    })),
});
const GameSessionSchema = z.object({
    student_id: z.string().uuid(),
    assignment_id: z.string().uuid().optional(),
    game_type: z.string(),
    session_mode: z.enum(['assignment', 'free_play']),
    max_score_possible: z.number(),
    session_data: z.record(z.any()).optional(),
});
const EndGameSessionSchema = z.object({
    session_id: z.string().uuid(),
    student_id: z.string().uuid(),
    final_score: z.number(),
    accuracy_percentage: z.number(),
    completion_percentage: z.number(),
    words_attempted: z.number(),
    words_correct: z.number(),
    unique_words_practiced: z.number(),
    duration_seconds: z.number(),
    session_data: z.record(z.any()).optional(),
});
// Define available tools
const tools = [
    // Assignment Management
    {
        name: 'create_assignment',
        description: 'Create a new assignment for students',
        inputSchema: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'Assignment title' },
                description: { type: 'string', description: 'Assignment description' },
                teacher_id: { type: 'string', description: 'Teacher UUID' },
                class_id: { type: 'string', description: 'Class UUID' },
                game_type: { type: 'string', description: 'Type of game for the assignment' },
                vocabulary_list_id: { type: 'string', description: 'Vocabulary list UUID (optional)' },
                vocabulary_selection: {
                    type: 'object',
                    description: 'Vocabulary selection configuration',
                    properties: {
                        type: { type: 'string', enum: ['all', 'random', 'manual'] },
                        count: { type: 'number', description: 'Number of words for random selection' },
                        word_ids: { type: 'array', items: { type: 'string' }, description: 'Specific word IDs for manual selection' },
                    },
                    required: ['type'],
                },
                game_settings: { type: 'object', description: 'Game-specific settings' },
                due_date: { type: 'string', description: 'Due date (ISO string)' },
                time_limit: { type: 'number', description: 'Time limit in minutes' },
            },
            required: ['title', 'teacher_id', 'class_id', 'game_type', 'vocabulary_selection', 'game_settings'],
        },
    },
    {
        name: 'get_assignment',
        description: 'Get assignment details by ID',
        inputSchema: {
            type: 'object',
            properties: {
                assignment_id: { type: 'string', description: 'Assignment UUID' },
            },
            required: ['assignment_id'],
        },
    },
    {
        name: 'update_assignment_progress',
        description: 'Update student progress on an assignment',
        inputSchema: {
            type: 'object',
            properties: {
                assignment_id: { type: 'string', description: 'Assignment UUID' },
                student_id: { type: 'string', description: 'Student UUID' },
                score: { type: 'number', description: 'Score achieved' },
                accuracy: { type: 'number', description: 'Accuracy percentage' },
                time_spent: { type: 'number', description: 'Time spent in seconds' },
                completed: { type: 'boolean', description: 'Whether assignment is completed' },
                session_data: { type: 'object', description: 'Additional session data' },
            },
            required: ['assignment_id', 'student_id', 'score', 'accuracy', 'time_spent', 'completed'],
        },
    },
    {
        name: 'get_assignment_analytics',
        description: 'Get analytics for an assignment',
        inputSchema: {
            type: 'object',
            properties: {
                assignment_id: { type: 'string', description: 'Assignment UUID' },
            },
            required: ['assignment_id'],
        },
    },
    // Vocabulary Management
    {
        name: 'create_vocabulary_list',
        description: 'Create a new enhanced vocabulary list',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'List name' },
                description: { type: 'string', description: 'List description' },
                teacher_id: { type: 'string', description: 'Teacher UUID' },
                language: { type: 'string', enum: ['spanish', 'french', 'german', 'italian'] },
                content_type: { type: 'string', enum: ['words', 'sentences', 'mixed'] },
                difficulty_level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
                is_public: { type: 'boolean', description: 'Whether list is public' },
                items: {
                    type: 'array',
                    description: 'Vocabulary items',
                    items: {
                        type: 'object',
                        properties: {
                            type: { type: 'string', enum: ['word', 'sentence', 'phrase'] },
                            term: { type: 'string' },
                            translation: { type: 'string' },
                            part_of_speech: { type: 'string' },
                            context_sentence: { type: 'string' },
                            context_translation: { type: 'string' },
                            difficulty_level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
                            notes: { type: 'string' },
                        },
                        required: ['type', 'term', 'translation', 'difficulty_level'],
                    },
                },
            },
            required: ['name', 'teacher_id', 'language', 'content_type', 'difficulty_level', 'items'],
        },
    },
    {
        name: 'get_vocabulary_lists',
        description: 'Get vocabulary lists with optional filtering',
        inputSchema: {
            type: 'object',
            properties: {
                teacher_id: { type: 'string', description: 'Filter by teacher UUID' },
                language: { type: 'string', description: 'Filter by language' },
                content_type: { type: 'string', description: 'Filter by content type' },
                is_public: { type: 'boolean', description: 'Filter by public status' },
                limit: { type: 'number', description: 'Limit number of results' },
            },
        },
    },
    {
        name: 'get_vocabulary_for_game',
        description: 'Get vocabulary items formatted for a specific game',
        inputSchema: {
            type: 'object',
            properties: {
                list_id: { type: 'string', description: 'Vocabulary list UUID' },
                game_type: { type: 'string', description: 'Game type for compatibility check' },
                limit: { type: 'number', description: 'Maximum number of items' },
                randomize: { type: 'boolean', description: 'Whether to randomize order' },
            },
            required: ['list_id', 'game_type'],
        },
    },
    // Game Session Management
    {
        name: 'start_game_session',
        description: 'Start a new game session',
        inputSchema: {
            type: 'object',
            properties: {
                student_id: { type: 'string', description: 'Student UUID' },
                assignment_id: { type: 'string', description: 'Assignment UUID (optional)' },
                game_type: { type: 'string', description: 'Type of game' },
                session_mode: { type: 'string', enum: ['assignment', 'free_play'] },
                max_score_possible: { type: 'number', description: 'Maximum possible score' },
                session_data: { type: 'object', description: 'Additional session data' },
            },
            required: ['student_id', 'game_type', 'session_mode', 'max_score_possible'],
        },
    },
    {
        name: 'end_game_session',
        description: 'End a game session and record results',
        inputSchema: {
            type: 'object',
            properties: {
                session_id: { type: 'string', description: 'Game session UUID' },
                student_id: { type: 'string', description: 'Student UUID' },
                final_score: { type: 'number', description: 'Final score achieved' },
                accuracy_percentage: { type: 'number', description: 'Accuracy percentage' },
                completion_percentage: { type: 'number', description: 'Completion percentage' },
                words_attempted: { type: 'number', description: 'Number of words attempted' },
                words_correct: { type: 'number', description: 'Number of words correct' },
                unique_words_practiced: { type: 'number', description: 'Number of unique words practiced' },
                duration_seconds: { type: 'number', description: 'Session duration in seconds' },
                session_data: { type: 'object', description: 'Additional session data' },
            },
            required: [
                'session_id', 'student_id', 'final_score', 'accuracy_percentage',
                'completion_percentage', 'words_attempted', 'words_correct',
                'unique_words_practiced', 'duration_seconds'
            ],
        },
    },
    // Analytics and Leaderboards
    {
        name: 'get_cross_game_leaderboard',
        description: 'Get cross-game leaderboard data',
        inputSchema: {
            type: 'object',
            properties: {
                class_id: { type: 'string', description: 'Filter by class UUID' },
                time_period: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'all_time'] },
                limit: { type: 'number', description: 'Maximum number of entries' },
            },
        },
    },
    {
        name: 'get_student_analytics',
        description: 'Get comprehensive analytics for a student',
        inputSchema: {
            type: 'object',
            properties: {
                student_id: { type: 'string', description: 'Student UUID' },
                time_period: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'all_time'] },
            },
            required: ['student_id'],
        },
    },
    {
        name: 'get_class_analytics',
        description: 'Get analytics for a class',
        inputSchema: {
            type: 'object',
            properties: {
                class_id: { type: 'string', description: 'Class UUID' },
                time_period: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'all_time'] },
            },
            required: ['class_id'],
        },
    },
    // Competition Management
    {
        name: 'create_competition',
        description: 'Create a new competition',
        inputSchema: {
            type: 'object',
            properties: {
                title: { type: 'string', description: 'Competition title' },
                description: { type: 'string', description: 'Competition description' },
                type: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'special'] },
                start_date: { type: 'string', description: 'Start date (ISO string)' },
                end_date: { type: 'string', description: 'End date (ISO string)' },
                game_types: { type: 'array', items: { type: 'string' }, description: 'Allowed game types' },
                scoring_method: { type: 'string', enum: ['total_points', 'best_score', 'average_score', 'improvement'] },
                min_games_required: { type: 'number', description: 'Minimum games required' },
                class_id: { type: 'string', description: 'Class UUID (optional)' },
                is_public: { type: 'boolean', description: 'Whether competition is public' },
                created_by: { type: 'string', description: 'Creator UUID' },
            },
            required: ['title', 'type', 'start_date', 'end_date', 'game_types', 'scoring_method', 'created_by'],
        },
    },
    {
        name: 'get_active_competitions',
        description: 'Get active competitions',
        inputSchema: {
            type: 'object',
            properties: {
                class_id: { type: 'string', description: 'Filter by class UUID' },
            },
        },
    },
];
// Create server instance
const server = new Server({
    name: 'language-gems-mcp-server',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
});
// Tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'create_assignment':
                return await handleCreateAssignment(args);
            case 'get_assignment':
                return await handleGetAssignment(args);
            case 'update_assignment_progress':
                return await handleUpdateAssignmentProgress(args);
            case 'get_assignment_analytics':
                return await handleGetAssignmentAnalytics(args);
            case 'create_vocabulary_list':
                return await handleCreateVocabularyList(args);
            case 'get_vocabulary_lists':
                return await handleGetVocabularyLists(args);
            case 'get_vocabulary_for_game':
                return await handleGetVocabularyForGame(args);
            case 'start_game_session':
                return await handleStartGameSession(args);
            case 'end_game_session':
                return await handleEndGameSession(args);
            case 'get_cross_game_leaderboard':
                return await handleGetCrossGameLeaderboard(args);
            case 'get_student_analytics':
                return await handleGetStudentAnalytics(args);
            case 'get_class_analytics':
                return await handleGetClassAnalytics(args);
            case 'create_competition':
                return await handleCreateCompetition(args);
            case 'get_active_competitions':
                return await handleGetActiveCompetitions(args);
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error executing ${name}: ${error instanceof Error ? error.message : String(error)}`,
                },
            ],
            isError: true,
        };
    }
});
// Tool implementation functions
async function handleCreateAssignment(args) {
    const validatedArgs = CreateAssignmentSchema.parse(args);
    // Create assignment
    const { data: assignment, error: assignmentError } = await supabase
        .from('assignments')
        .insert({
        title: validatedArgs.title,
        description: validatedArgs.description,
        teacher_id: validatedArgs.teacher_id,
        class_id: validatedArgs.class_id,
        game_type: validatedArgs.game_type,
        vocabulary_list_id: validatedArgs.vocabulary_list_id,
        vocabulary_selection: validatedArgs.vocabulary_selection,
        game_settings: validatedArgs.game_settings,
        due_date: validatedArgs.due_date,
        time_limit: validatedArgs.time_limit,
    })
        .select()
        .single();
    if (assignmentError)
        throw assignmentError;
    // Create progress records for all students in the class
    const { data: students } = await supabase
        .from('student_classes')
        .select('student_id')
        .eq('class_id', validatedArgs.class_id);
    if (students && students.length > 0) {
        const progressRecords = students.map(student => ({
            assignment_id: assignment.id,
            student_id: student.student_id,
            status: 'not_started',
            score: 0,
            accuracy: 0,
            time_spent: 0,
            completed: false,
        }));
        await supabase
            .from('assignment_progress')
            .insert(progressRecords);
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ success: true, assignment }, null, 2),
            },
        ],
    };
}
async function handleGetAssignment(args) {
    const { assignment_id } = args;
    const { data: assignment, error } = await supabase
        .from('assignments')
        .select(`
      *,
      classes(name),
      vocabulary_assignment_lists(
        vocabulary_assignment_items(
          vocabulary(*)
        )
      )
    `)
        .eq('id', assignment_id)
        .single();
    if (error)
        throw error;
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ assignment }, null, 2),
            },
        ],
    };
}
async function handleUpdateAssignmentProgress(args) {
    const validatedArgs = UpdateProgressSchema.parse(args);
    const { data, error } = await supabase
        .from('assignment_progress')
        .upsert({
        assignment_id: validatedArgs.assignment_id,
        student_id: validatedArgs.student_id,
        score: validatedArgs.score,
        accuracy: validatedArgs.accuracy,
        time_spent: validatedArgs.time_spent,
        completed: validatedArgs.completed,
        session_data: validatedArgs.session_data,
        updated_at: new Date().toISOString(),
    })
        .select()
        .single();
    if (error)
        throw error;
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ success: true, progress: data }, null, 2),
            },
        ],
    };
}
async function handleGetAssignmentAnalytics(args) {
    const { assignment_id } = args;
    // Get assignment details
    const { data: assignment } = await supabase
        .from('assignments')
        .select('*')
        .eq('id', assignment_id)
        .single();
    // Get progress data
    const { data: progress } = await supabase
        .from('assignment_progress')
        .select(`
      *,
      user_profiles!student_id(first_name, last_name)
    `)
        .eq('assignment_id', assignment_id);
    // Calculate analytics
    const totalStudents = progress?.length || 0;
    const completedStudents = progress?.filter(p => p.completed).length || 0;
    const averageScore = progress?.reduce((sum, p) => sum + p.score, 0) / totalStudents || 0;
    const averageAccuracy = progress?.reduce((sum, p) => sum + p.accuracy, 0) / totalStudents || 0;
    const analytics = {
        assignment,
        totalStudents,
        completedStudents,
        completionRate: (completedStudents / totalStudents) * 100,
        averageScore,
        averageAccuracy,
        progress,
    };
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ analytics }, null, 2),
            },
        ],
    };
}
async function handleCreateVocabularyList(args) {
    const validatedArgs = CreateVocabularyListSchema.parse(args);
    // Create vocabulary list
    const { data: list, error: listError } = await supabase
        .from('enhanced_vocabulary_lists')
        .insert({
        name: validatedArgs.name,
        description: validatedArgs.description,
        teacher_id: validatedArgs.teacher_id,
        language: validatedArgs.language,
        content_type: validatedArgs.content_type,
        difficulty_level: validatedArgs.difficulty_level,
        is_public: validatedArgs.is_public,
        word_count: validatedArgs.items.length,
    })
        .select()
        .single();
    if (listError)
        throw listError;
    // Create vocabulary items
    const itemsWithListId = validatedArgs.items.map(item => ({
        ...item,
        list_id: list.id,
    }));
    const { data: items, error: itemsError } = await supabase
        .from('enhanced_vocabulary_items')
        .insert(itemsWithListId)
        .select();
    if (itemsError)
        throw itemsError;
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ success: true, list: { ...list, items } }, null, 2),
            },
        ],
    };
}
async function handleGetVocabularyLists(args) {
    let query = supabase
        .from('enhanced_vocabulary_lists')
        .select(`
      *,
      enhanced_vocabulary_items(*)
    `);
    // Apply filters
    if (args.teacher_id) {
        query = query.eq('teacher_id', args.teacher_id);
    }
    if (args.language) {
        query = query.eq('language', args.language);
    }
    if (args.content_type) {
        query = query.eq('content_type', args.content_type);
    }
    if (args.is_public !== undefined) {
        query = query.eq('is_public', args.is_public);
    }
    if (args.limit) {
        query = query.limit(args.limit);
    }
    query = query.order('created_at', { ascending: false });
    const { data: lists, error } = await query;
    if (error)
        throw error;
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ lists }, null, 2),
            },
        ],
    };
}
async function handleGetVocabularyForGame(args) {
    const { list_id, game_type, limit, randomize } = args;
    // Get vocabulary list with items
    const { data: list, error } = await supabase
        .from('enhanced_vocabulary_lists')
        .select(`
      *,
      enhanced_vocabulary_items(*)
    `)
        .eq('id', list_id)
        .single();
    if (error)
        throw error;
    // Game compatibility check
    const gameCompatibility = {
        'noughts-and-crosses': { supports_words: true, supports_sentences: false, max_items: 50 },
        'memory-game': { supports_words: true, supports_sentences: false, max_items: 20 },
        'hangman': { supports_words: true, supports_sentences: false, max_items: 100 },
        'word-scramble': { supports_words: true, supports_sentences: false, max_items: 50 },
        'word-guesser': { supports_words: true, supports_sentences: false, max_items: 100 },
        'vocab-blast': { supports_words: true, supports_sentences: false, max_items: 100 },
        'speed-builder': { supports_words: true, supports_sentences: true, max_items: 50 },
        'sentence-towers': { supports_words: true, supports_sentences: true, max_items: 100 },
    };
    const compatibility = gameCompatibility[game_type];
    if (!compatibility) {
        throw new Error(`Unknown game type: ${game_type}`);
    }
    // Filter items based on game compatibility
    let items = list.enhanced_vocabulary_items || [];
    if (!compatibility.supports_sentences) {
        items = items.filter((item) => item.type !== 'sentence');
    }
    // Randomize if requested
    if (randomize) {
        items = items.sort(() => Math.random() - 0.5);
    }
    // Apply limit
    if (limit) {
        items = items.slice(0, limit);
    }
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    list: { ...list, items },
                    compatibility,
                    filtered_count: items.length
                }, null, 2),
            },
        ],
    };
}
async function handleStartGameSession(args) {
    const validatedArgs = GameSessionSchema.parse(args);
    const { data: session, error } = await supabase
        .from('enhanced_game_sessions')
        .insert({
        student_id: validatedArgs.student_id,
        assignment_id: validatedArgs.assignment_id,
        game_type: validatedArgs.game_type,
        session_mode: validatedArgs.session_mode,
        max_score_possible: validatedArgs.max_score_possible,
        session_data: validatedArgs.session_data,
        started_at: new Date().toISOString(),
    })
        .select()
        .single();
    if (error)
        throw error;
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ success: true, session_id: session.id }, null, 2),
            },
        ],
    };
}
async function handleEndGameSession(args) {
    const validatedArgs = EndGameSessionSchema.parse(args);
    const { data: session, error } = await supabase
        .from('enhanced_game_sessions')
        .update({
        final_score: validatedArgs.final_score,
        accuracy_percentage: validatedArgs.accuracy_percentage,
        completion_percentage: validatedArgs.completion_percentage,
        words_attempted: validatedArgs.words_attempted,
        words_correct: validatedArgs.words_correct,
        unique_words_practiced: validatedArgs.unique_words_practiced,
        duration_seconds: validatedArgs.duration_seconds,
        session_data: validatedArgs.session_data,
        ended_at: new Date().toISOString(),
    })
        .eq('id', validatedArgs.session_id)
        .eq('student_id', validatedArgs.student_id)
        .select()
        .single();
    if (error)
        throw error;
    // Update student profile with XP and achievements
    await updateStudentProfile(validatedArgs.student_id, {
        xp_gained: Math.floor(validatedArgs.final_score / 10),
        words_practiced: validatedArgs.unique_words_practiced,
        accuracy: validatedArgs.accuracy_percentage,
        time_played: validatedArgs.duration_seconds,
    });
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ success: true, session }, null, 2),
            },
        ],
    };
}
async function updateStudentProfile(studentId, stats) {
    // Update or create student game profile
    const { data: profile } = await supabase
        .from('student_game_profiles')
        .select('*')
        .eq('student_id', studentId)
        .single();
    const updateData = {
        student_id: studentId,
        total_xp: (profile?.total_xp || 0) + stats.xp_gained,
        total_games_played: (profile?.total_games_played || 0) + 1,
        words_learned: (profile?.words_learned || 0) + stats.words_practiced,
        total_time_played: (profile?.total_time_played || 0) + stats.time_played,
        accuracy_average: profile
            ? ((profile.accuracy_average * profile.total_games_played) + stats.accuracy) / (profile.total_games_played + 1)
            : stats.accuracy,
        last_activity_date: new Date().toISOString(),
    };
    // Calculate level based on XP
    updateData.current_level = Math.floor(updateData.total_xp / 1000) + 1;
    updateData.xp_to_next_level = 1000 - (updateData.total_xp % 1000);
    await supabase
        .from('student_game_profiles')
        .upsert(updateData);
}
async function handleGetCrossGameLeaderboard(args) {
    const { class_id, time_period = 'all_time', limit = 50 } = args;
    // Calculate date range for time period
    const now = new Date();
    let startDate = new Date('2024-01-01');
    switch (time_period) {
        case 'daily':
            startDate = new Date(now);
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'weekly':
            startDate = new Date(now);
            startDate.setDate(now.getDate() - now.getDay());
            startDate.setHours(0, 0, 0, 0);
            break;
        case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
    }
    let query = supabase
        .from('cross_game_leaderboard')
        .select('*')
        .limit(limit);
    // Filter by class if specified
    if (class_id) {
        const { data: classStudents } = await supabase
            .from('student_classes')
            .select('student_id')
            .eq('class_id', class_id);
        const studentIds = classStudents?.map(cs => cs.student_id) || [];
        if (studentIds.length > 0) {
            query = query.in('student_id', studentIds);
        }
    }
    const { data: leaderboard, error } = await query;
    if (error)
        throw error;
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ leaderboard, time_period, class_id }, null, 2),
            },
        ],
    };
}
async function handleGetStudentAnalytics(args) {
    const { student_id, time_period = 'all_time' } = args;
    // Get student profile
    const { data: profile } = await supabase
        .from('student_game_profiles')
        .select('*')
        .eq('student_id', student_id)
        .single();
    // Get recent game sessions
    const { data: sessions } = await supabase
        .from('enhanced_game_sessions')
        .select('*')
        .eq('student_id', student_id)
        .not('ended_at', 'is', null)
        .order('ended_at', { ascending: false })
        .limit(20);
    // Get achievements
    const { data: achievements } = await supabase
        .from('student_achievements')
        .select('*')
        .eq('student_id', student_id)
        .order('earned_at', { ascending: false });
    // Calculate game-specific statistics
    const gameStats = {};
    sessions?.forEach(session => {
        const gameType = session.game_type;
        if (!gameStats[gameType]) {
            gameStats[gameType] = {
                games_played: 0,
                total_score: 0,
                total_accuracy: 0,
                best_score: 0,
                total_time: 0,
            };
        }
        const stats = gameStats[gameType];
        stats.games_played += 1;
        stats.total_score += session.final_score || 0;
        stats.total_accuracy += session.accuracy_percentage || 0;
        stats.best_score = Math.max(stats.best_score, session.final_score || 0);
        stats.total_time += session.duration_seconds || 0;
    });
    // Calculate averages
    Object.values(gameStats).forEach((stats) => {
        stats.average_score = stats.total_score / stats.games_played;
        stats.average_accuracy = stats.total_accuracy / stats.games_played;
    });
    const analytics = {
        profile,
        sessions,
        achievements,
        gameStats,
        summary: {
            total_games: sessions?.length || 0,
            total_xp: profile?.total_xp || 0,
            current_level: profile?.current_level || 1,
            total_achievements: achievements?.length || 0,
        },
    };
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ analytics }, null, 2),
            },
        ],
    };
}
async function handleGetClassAnalytics(args) {
    const { class_id, time_period = 'all_time' } = args;
    // Get class details
    const { data: classInfo } = await supabase
        .from('classes')
        .select('*')
        .eq('id', class_id)
        .single();
    // Get students in class
    const { data: classStudents } = await supabase
        .from('student_classes')
        .select(`
      student_id,
      user_profiles(display_name)
    `)
        .eq('class_id', class_id);
    const studentIds = classStudents?.map(cs => cs.student_id) || [];
    // Get student profiles
    const { data: profiles } = await supabase
        .from('student_game_profiles')
        .select('*')
        .in('student_id', studentIds);
    // Get recent game sessions
    const { data: sessions } = await supabase
        .from('enhanced_game_sessions')
        .select('*')
        .in('student_id', studentIds)
        .not('ended_at', 'is', null)
        .order('ended_at', { ascending: false });
    // Calculate class statistics
    const totalStudents = studentIds.length;
    const activeStudents = profiles?.length || 0;
    const totalGames = sessions?.length || 0;
    const averageXP = profiles?.reduce((sum, p) => sum + (p.total_xp || 0), 0) / activeStudents || 0;
    const averageAccuracy = profiles?.reduce((sum, p) => sum + (p.accuracy_average || 0), 0) / activeStudents || 0;
    // Game type breakdown
    const gameBreakdown = {};
    sessions?.forEach(session => {
        const gameType = session.game_type;
        if (!gameBreakdown[gameType]) {
            gameBreakdown[gameType] = { count: 0, total_score: 0, total_accuracy: 0 };
        }
        gameBreakdown[gameType].count += 1;
        gameBreakdown[gameType].total_score += session.final_score || 0;
        gameBreakdown[gameType].total_accuracy += session.accuracy_percentage || 0;
    });
    Object.values(gameBreakdown).forEach((stats) => {
        stats.average_score = stats.total_score / stats.count;
        stats.average_accuracy = stats.total_accuracy / stats.count;
    });
    const analytics = {
        classInfo,
        totalStudents,
        activeStudents,
        totalGames,
        averageXP,
        averageAccuracy,
        gameBreakdown,
        studentProfiles: profiles,
        recentSessions: sessions?.slice(0, 10),
    };
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ analytics }, null, 2),
            },
        ],
    };
}
async function handleCreateCompetition(args) {
    const { data: competition, error } = await supabase
        .from('competitions')
        .insert({
        title: args.title,
        description: args.description,
        type: args.type,
        start_date: args.start_date,
        end_date: args.end_date,
        game_types: args.game_types,
        scoring_method: args.scoring_method,
        min_games_required: args.min_games_required,
        class_id: args.class_id,
        is_public: args.is_public,
        created_by: args.created_by,
    })
        .select()
        .single();
    if (error)
        throw error;
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ success: true, competition }, null, 2),
            },
        ],
    };
}
async function handleGetActiveCompetitions(args) {
    let query = supabase
        .from('competitions')
        .select('*')
        .eq('status', 'active')
        .order('end_date', { ascending: true });
    if (args.class_id) {
        query = query.or(`class_id.eq.${args.class_id},is_public.eq.true`);
    }
    else {
        query = query.eq('is_public', true);
    }
    const { data: competitions, error } = await query;
    if (error)
        throw error;
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({ competitions }, null, 2),
            },
        ],
    };
}
// Start the server
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Language Gems MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
});
