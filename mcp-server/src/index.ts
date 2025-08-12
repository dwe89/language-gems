#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
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
const tools: Tool[] = [
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
  {
    name: 'create_aqa_reading_assignment',
    description: 'Create an AQA Reading Assessment assignment for students',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Assignment title' },
        teacher_id: { type: 'string', description: 'Teacher UUID' },
        class_id: { type: 'string', description: 'Class UUID (optional)' },
        student_id: { type: 'string', description: 'Student UUID (for individual assignments)' },
        assessment_level: { type: 'string', enum: ['foundation', 'higher'], description: 'Assessment difficulty level' },
        due_date: { type: 'string', description: 'Due date (ISO string)' },
        custom_time_limit: { type: 'number', description: 'Custom time limit in minutes (optional)' },
        custom_instructions: { type: 'string', description: 'Custom instructions (optional)' },
      },
      required: ['title', 'teacher_id', 'assessment_level'],
    },
  },
  {
    name: 'get_aqa_reading_results',
    description: 'Get AQA Reading Assessment results for analysis',
    inputSchema: {
      type: 'object',
      properties: {
        teacher_id: { type: 'string', description: 'Teacher UUID' },
        class_id: { type: 'string', description: 'Filter by class UUID (optional)' },
        student_id: { type: 'string', description: 'Filter by student UUID (optional)' },
        assessment_level: { type: 'string', enum: ['foundation', 'higher'], description: 'Filter by level (optional)' },
        date_from: { type: 'string', description: 'Filter results from date (ISO string, optional)' },
        date_to: { type: 'string', description: 'Filter results to date (ISO string, optional)' },
      },
      required: ['teacher_id'],
    },
  },
  {
    name: 'get_aqa_reading_analytics',
    description: 'Get detailed analytics for AQA Reading Assessment performance',
    inputSchema: {
      type: 'object',
      properties: {
        teacher_id: { type: 'string', description: 'Teacher UUID' },
        class_id: { type: 'string', description: 'Class UUID (optional)' },
        student_id: { type: 'string', description: 'Student UUID (optional)' },
        assessment_level: { type: 'string', enum: ['foundation', 'higher'], description: 'Assessment level (optional)' },
        group_by: { type: 'string', enum: ['question_type', 'theme', 'topic', 'student'], description: 'Group analytics by category' },
      },
      required: ['teacher_id', 'group_by'],
    },
  },
  {
    name: 'create_reading_comprehension_task',
    description: 'Create a reading comprehension task with content and questions',
    inputSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Task title' },
        language: { type: 'string', enum: ['spanish', 'french', 'german'], description: 'Task language' },
        curriculum_level: { type: 'string', enum: ['ks3', 'ks4'], description: 'Curriculum level' },
        exam_board: { type: 'string', enum: ['aqa', 'edexcel'], description: 'Exam board (for KS4)' },
        theme_topic: { type: 'string', description: 'AQA theme/topic (for AQA)' },
        category: { type: 'string', description: 'Content category' },
        subcategory: { type: 'string', description: 'Content subcategory' },
        difficulty: { type: 'string', enum: ['foundation', 'intermediate', 'higher'], description: 'Difficulty level' },
        content: { type: 'string', description: 'Reading text content' },
        word_count: { type: 'number', description: 'Word count of the text' },
        estimated_reading_time: { type: 'number', description: 'Estimated reading time in minutes' },
        questions: {
          type: 'array',
          description: 'Comprehension questions',
          items: {
            type: 'object',
            properties: {
              question: { type: 'string', description: 'Question text' },
              type: { type: 'string', enum: ['multiple-choice', 'true-false', 'short-answer', 'gap-fill'], description: 'Question type' },
              options: { type: 'array', items: { type: 'string' }, description: 'Options for multiple choice' },
              correct_answer: { type: ['string', 'array'], description: 'Correct answer(s)' },
              points: { type: 'number', description: 'Points for this question' },
              explanation: { type: 'string', description: 'Explanation for the answer' },
            },
            required: ['question', 'type', 'correct_answer', 'points'],
          },
        },
        created_by: { type: 'string', description: 'Creator UUID' },
      },
      required: ['title', 'language', 'difficulty', 'content', 'questions', 'created_by'],
    },
  },
  {
    name: 'get_reading_comprehension_tasks',
    description: 'Get reading comprehension tasks with filtering options',
    inputSchema: {
      type: 'object',
      properties: {
        language: { type: 'string', enum: ['spanish', 'french', 'german'], description: 'Filter by language' },
        curriculum_level: { type: 'string', enum: ['ks3', 'ks4'], description: 'Filter by curriculum level' },
        exam_board: { type: 'string', enum: ['aqa', 'edexcel'], description: 'Filter by exam board' },
        category: { type: 'string', description: 'Filter by category' },
        subcategory: { type: 'string', description: 'Filter by subcategory' },
        difficulty: { type: 'string', enum: ['foundation', 'intermediate', 'higher'], description: 'Filter by difficulty' },
        theme_topic: { type: 'string', description: 'Filter by AQA theme/topic' },
        limit: { type: 'number', description: 'Limit number of results' },
        random: { type: 'boolean', description: 'Return random selection' },
      },
    },
  },
  {
    name: 'save_reading_comprehension_result',
    description: 'Save reading comprehension task results',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: { type: 'string', description: 'Task UUID' },
        student_id: { type: 'string', description: 'Student UUID' },
        assignment_id: { type: 'string', description: 'Assignment UUID (optional)' },
        total_questions: { type: 'number', description: 'Total number of questions' },
        correct_answers: { type: 'number', description: 'Number of correct answers' },
        score_percentage: { type: 'number', description: 'Score as percentage' },
        time_spent_seconds: { type: 'number', description: 'Time spent in seconds' },
        passed: { type: 'boolean', description: 'Whether the task was passed' },
        question_results: {
          type: 'array',
          description: 'Individual question results',
          items: {
            type: 'object',
            properties: {
              question_id: { type: 'string', description: 'Question identifier' },
              user_answer: { type: ['string', 'array'], description: 'User\'s answer' },
              correct_answer: { type: ['string', 'array'], description: 'Correct answer' },
              is_correct: { type: 'boolean', description: 'Whether answer was correct' },
              points_earned: { type: 'number', description: 'Points earned for this question' },
              time_spent: { type: 'number', description: 'Time spent on this question' },
            },
            required: ['question_id', 'user_answer', 'correct_answer', 'is_correct', 'points_earned'],
          },
        },
      },
      required: ['task_id', 'student_id', 'total_questions', 'correct_answers', 'score_percentage', 'time_spent_seconds', 'passed', 'question_results'],
    },
  },
  {
    name: 'get_reading_comprehension_analytics',
    description: 'Get analytics for reading comprehension performance',
    inputSchema: {
      type: 'object',
      properties: {
        student_id: { type: 'string', description: 'Student UUID (optional)' },
        class_id: { type: 'string', description: 'Class UUID (optional)' },
        teacher_id: { type: 'string', description: 'Teacher UUID (optional)' },
        language: { type: 'string', enum: ['spanish', 'french', 'german'], description: 'Filter by language' },
        difficulty: { type: 'string', enum: ['foundation', 'intermediate', 'higher'], description: 'Filter by difficulty' },
        date_from: { type: 'string', description: 'Filter from date (ISO string)' },
        date_to: { type: 'string', description: 'Filter to date (ISO string)' },
        group_by: { type: 'string', enum: ['student', 'difficulty', 'category', 'language'], description: 'Group results by' },
      },
    },
  },
];

// Create server instance
const server = new Server(
  {
    name: 'language-gems-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

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
      case 'create_aqa_reading_assignment':
        return await handleCreateAQAReadingAssignment(args);
      case 'get_aqa_reading_results':
        return await handleGetAQAReadingResults(args);
      case 'get_aqa_reading_analytics':
        return await handleGetAQAReadingAnalytics(args);
      case 'create_reading_comprehension_task':
        return await handleCreateReadingComprehensionTask(args);
      case 'get_reading_comprehension_tasks':
        return await handleGetReadingComprehensionTasks(args);
      case 'save_reading_comprehension_result':
        return await handleSaveReadingComprehensionResult(args);
      case 'get_reading_comprehension_analytics':
        return await handleGetReadingComprehensionAnalytics(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
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
async function handleCreateAssignment(args: any) {
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

  if (assignmentError) throw assignmentError;

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
      best_score: 0,
      best_accuracy: 0,
      total_time_spent: 0,
      attempts_count: 0,
    }));

    await supabase
      .from('enhanced_assignment_progress')
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

async function handleGetAssignment(args: any) {
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

  if (error) throw error;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ assignment }, null, 2),
      },
    ],
  };
}

async function handleUpdateAssignmentProgress(args: any) {
  const validatedArgs = UpdateProgressSchema.parse(args);
  
  const { data, error } = await supabase
    .from('enhanced_assignment_progress')
    .upsert({
      assignment_id: validatedArgs.assignment_id,
      student_id: validatedArgs.student_id,
      best_score: validatedArgs.score,
      best_accuracy: validatedArgs.accuracy,
      total_time_spent: validatedArgs.time_spent,
      status: validatedArgs.completed ? 'completed' : 'in_progress',
      progress_data: validatedArgs.session_data,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'assignment_id,student_id'
    })
    .select()
    .single();

  if (error) throw error;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ success: true, progress: data }, null, 2),
      },
    ],
  };
}

async function handleGetAssignmentAnalytics(args: any) {
  const { assignment_id } = args;

  // Get assignment details
  const { data: assignment } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', assignment_id)
    .single();

  // Get progress data
  const { data: progress } = await supabase
    .from('enhanced_assignment_progress')
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

async function handleCreateVocabularyList(args: any) {
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

  if (listError) throw listError;

  // Create vocabulary items
  const itemsWithListId = validatedArgs.items.map(item => ({
    ...item,
    list_id: list.id,
  }));

  const { data: items, error: itemsError } = await supabase
    .from('enhanced_vocabulary_items')
    .insert(itemsWithListId)
    .select();

  if (itemsError) throw itemsError;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ success: true, list: { ...list, items } }, null, 2),
      },
    ],
  };
}

async function handleGetVocabularyLists(args: any) {
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
  if (error) throw error;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ lists }, null, 2),
      },
    ],
  };
}

async function handleGetVocabularyForGame(args: any) {
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

  if (error) throw error;

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

  const compatibility = gameCompatibility[game_type as keyof typeof gameCompatibility];
  if (!compatibility) {
    throw new Error(`Unknown game type: ${game_type}`);
  }

  // Filter items based on game compatibility
  let items = list.enhanced_vocabulary_items || [];

  if (!compatibility.supports_sentences) {
    items = items.filter((item: any) => item.type !== 'sentence');
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

async function handleStartGameSession(args: any) {
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

  if (error) throw error;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ success: true, session_id: session.id }, null, 2),
      },
    ],
  };
}

async function handleEndGameSession(args: any) {
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

  if (error) throw error;

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

async function updateStudentProfile(studentId: string, stats: any) {
  // student_game_profiles table removed - skip profile updates
  // Profile data is now calculated dynamically from gems system
  console.log('Student profile update skipped - using gems-first system');

  const updateData: any = {
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

async function handleGetCrossGameLeaderboard(args: any) {
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
  if (error) throw error;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ leaderboard, time_period, class_id }, null, 2),
      },
    ],
  };
}

async function handleGetStudentAnalytics(args: any) {
  const { student_id, time_period = 'all_time' } = args;

  // student_game_profiles table removed - calculate profile from gems system
  const profile = null; // Will be calculated from gem_events and enhanced_game_sessions

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
  const gameStats: any = {};
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
  Object.values(gameStats).forEach((stats: any) => {
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

async function handleGetClassAnalytics(args: any) {
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

  // student_game_profiles table removed - skip profile queries
  const profiles = []; // Profiles will be calculated from gems system

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
  const gameBreakdown: any = {};
  sessions?.forEach(session => {
    const gameType = session.game_type;
    if (!gameBreakdown[gameType]) {
      gameBreakdown[gameType] = { count: 0, total_score: 0, total_accuracy: 0 };
    }
    gameBreakdown[gameType].count += 1;
    gameBreakdown[gameType].total_score += session.final_score || 0;
    gameBreakdown[gameType].total_accuracy += session.accuracy_percentage || 0;
  });

  Object.values(gameBreakdown).forEach((stats: any) => {
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

async function handleCreateCompetition(args: any) {
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

  if (error) throw error;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ success: true, competition }, null, 2),
      },
    ],
  };
}

async function handleGetActiveCompetitions(args: any) {
  let query = supabase
    .from('competitions')
    .select('*')
    .eq('status', 'active')
    .order('end_date', { ascending: true });

  if (args.class_id) {
    query = query.or(`class_id.eq.${args.class_id},is_public.eq.true`);
  } else {
    query = query.eq('is_public', true);
  }

  const { data: competitions, error } = await query;
  if (error) throw error;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ competitions }, null, 2),
      },
    ],
  };
}

async function handleCreateAQAReadingAssignment(args: any) {
  const {
    title,
    teacher_id,
    class_id,
    student_id,
    assessment_level,
    due_date,
    custom_time_limit,
    custom_instructions
  } = args;

  // Get the assessment ID for the specified level
  const { data: assessment, error: assessmentError } = await supabase
    .from('aqa_reading_assessments')
    .select('id')
    .eq('level', assessment_level)
    .eq('is_active', true)
    .single();

  if (assessmentError || !assessment) {
    throw new Error(`No active AQA reading assessment found for level: ${assessment_level}`);
  }

  // Create the main assignment record
  const { data: assignment, error: assignmentError } = await supabase
    .from('assignments')
    .insert({
      title,
      description: `AQA Reading Assessment - ${assessment_level.charAt(0).toUpperCase() + assessment_level.slice(1)}`,
      teacher_id,
      class_id,
      game_type: 'aqa_reading_assessment',
      due_date,
      time_limit: custom_time_limit || (assessment_level === 'foundation' ? 45 : 60),
    })
    .select()
    .single();

  if (assignmentError) throw assignmentError;

  // Create the AQA-specific assignment record
  const { data: aqaAssignment, error: aqaError } = await supabase
    .from('aqa_reading_assignments')
    .insert({
      assignment_id: assignment.id,
      assessment_id: assessment.id,
      teacher_id,
      class_id,
      student_id,
      due_date,
      custom_time_limit,
      custom_instructions,
    })
    .select()
    .single();

  if (aqaError) throw aqaError;

  // Create progress records for students
  let studentIds = [];
  if (student_id) {
    studentIds = [student_id];
  } else if (class_id) {
    const { data: classStudents } = await supabase
      .from('class_students')
      .select('student_id')
      .eq('class_id', class_id);
    studentIds = classStudents?.map(cs => cs.student_id) || [];
  }

  if (studentIds.length > 0) {
    const progressRecords = studentIds.map(sid => ({
      assignment_id: assignment.id,
      student_id: sid,
      status: 'not_started',
      best_score: 0,
      best_accuracy: 0,
      total_time_spent: 0,
      attempts_count: 0,
    }));

    await supabase
      .from('enhanced_assignment_progress')
      .insert(progressRecords);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: true,
          assignment,
          aqa_assignment: aqaAssignment,
          students_assigned: studentIds.length
        }, null, 2),
      },
    ],
  };
}

async function handleGetAQAReadingResults(args: any) {
  const { teacher_id, class_id, student_id, assessment_level, date_from, date_to } = args;

  let query = supabase
    .from('aqa_reading_results')
    .select(`
      *,
      aqa_reading_assignments!inner(
        teacher_id,
        class_id,
        aqa_reading_assessments(title, level)
      ),
      user_profiles!student_id(display_name, first_name, last_name)
    `)
    .eq('aqa_reading_assignments.teacher_id', teacher_id);

  // Apply filters
  if (class_id) {
    query = query.eq('aqa_reading_assignments.class_id', class_id);
  }
  if (student_id) {
    query = query.eq('student_id', student_id);
  }
  if (assessment_level) {
    query = query.eq('aqa_reading_assignments.aqa_reading_assessments.level', assessment_level);
  }
  if (date_from) {
    query = query.gte('submission_date', date_from);
  }
  if (date_to) {
    query = query.lte('submission_date', date_to);
  }

  query = query.order('submission_date', { ascending: false });

  const { data: results, error } = await query;
  if (error) throw error;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ results }, null, 2),
      },
    ],
  };
}

async function handleGetAQAReadingAnalytics(args: any) {
  const { teacher_id, class_id, student_id, assessment_level, group_by } = args;

  // Base query for getting results
  let query = supabase
    .from('aqa_reading_results')
    .select(`
      *,
      aqa_reading_assignments!inner(
        teacher_id,
        class_id,
        aqa_reading_assessments(title, level)
      ),
      user_profiles!student_id(display_name, first_name, last_name),
      aqa_reading_question_responses(*)
    `)
    .eq('aqa_reading_assignments.teacher_id', teacher_id)
    .eq('status', 'completed');

  // Apply filters
  if (class_id) {
    query = query.eq('aqa_reading_assignments.class_id', class_id);
  }
  if (student_id) {
    query = query.eq('student_id', student_id);
  }
  if (assessment_level) {
    query = query.eq('aqa_reading_assignments.aqa_reading_assessments.level', assessment_level);
  }

  const { data: results, error } = await query;
  if (error) throw error;

  // Process analytics based on group_by parameter
  let analytics: any = {};

  switch (group_by) {
    case 'question_type':
      analytics = processAnalyticsByQuestionType(results);
      break;
    case 'theme':
      analytics = processAnalyticsByTheme(results);
      break;
    case 'topic':
      analytics = processAnalyticsByTopic(results);
      break;
    case 'student':
      analytics = processAnalyticsByStudent(results);
      break;
    default:
      throw new Error(`Invalid group_by parameter: ${group_by}`);
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          analytics,
          group_by,
          total_results: results?.length || 0
        }, null, 2),
      },
    ],
  };
}

function processAnalyticsByQuestionType(results: any[]) {
  const typeStats: any = {};

  results?.forEach(result => {
    Object.entries(result.performance_by_question_type || {}).forEach(([type, stats]: [string, any]) => {
      if (!typeStats[type]) {
        typeStats[type] = {
          total_questions: 0,
          total_correct: 0,
          total_time: 0,
          student_count: 0,
          scores: []
        };
      }

      typeStats[type].total_questions += stats.total || 0;
      typeStats[type].total_correct += stats.correct || 0;
      typeStats[type].total_time += stats.averageTimeSeconds * (stats.total || 0);
      typeStats[type].student_count += 1;
      typeStats[type].scores.push(stats.scorePercentage || 0);
    });
  });

  // Calculate averages
  Object.values(typeStats).forEach((stats: any) => {
    stats.accuracy_percentage = stats.total_questions > 0
      ? (stats.total_correct / stats.total_questions) * 100
      : 0;
    stats.average_time_seconds = stats.total_questions > 0
      ? stats.total_time / stats.total_questions
      : 0;
    stats.average_score = stats.scores.length > 0
      ? stats.scores.reduce((sum: number, score: number) => sum + score, 0) / stats.scores.length
      : 0;
  });

  return typeStats;
}

function processAnalyticsByTheme(results: any[]) {
  const themeStats: any = {};

  results?.forEach(result => {
    Object.entries(result.performance_by_theme || {}).forEach(([theme, stats]: [string, any]) => {
      if (!themeStats[theme]) {
        themeStats[theme] = {
          total_questions: 0,
          total_correct: 0,
          total_time: 0,
          student_count: 0,
          scores: []
        };
      }

      themeStats[theme].total_questions += stats.total || 0;
      themeStats[theme].total_correct += stats.correct || 0;
      themeStats[theme].total_time += stats.averageTimeSeconds * (stats.total || 0);
      themeStats[theme].student_count += 1;
      themeStats[theme].scores.push(stats.scorePercentage || 0);
    });
  });

  // Calculate averages
  Object.values(themeStats).forEach((stats: any) => {
    stats.accuracy_percentage = stats.total_questions > 0
      ? (stats.total_correct / stats.total_questions) * 100
      : 0;
    stats.average_time_seconds = stats.total_questions > 0
      ? stats.total_time / stats.total_questions
      : 0;
    stats.average_score = stats.scores.length > 0
      ? stats.scores.reduce((sum: number, score: number) => sum + score, 0) / stats.scores.length
      : 0;
  });

  return themeStats;
}

function processAnalyticsByTopic(results: any[]) {
  const topicStats: any = {};

  results?.forEach(result => {
    Object.entries(result.performance_by_topic || {}).forEach(([topic, stats]: [string, any]) => {
      if (!topicStats[topic]) {
        topicStats[topic] = {
          total_questions: 0,
          total_correct: 0,
          total_time: 0,
          student_count: 0,
          scores: []
        };
      }

      topicStats[topic].total_questions += stats.total || 0;
      topicStats[topic].total_correct += stats.correct || 0;
      topicStats[topic].total_time += stats.averageTimeSeconds * (stats.total || 0);
      topicStats[topic].student_count += 1;
      topicStats[topic].scores.push(stats.scorePercentage || 0);
    });
  });

  // Calculate averages
  Object.values(topicStats).forEach((stats: any) => {
    stats.accuracy_percentage = stats.total_questions > 0
      ? (stats.total_correct / stats.total_questions) * 100
      : 0;
    stats.average_time_seconds = stats.total_questions > 0
      ? stats.total_time / stats.total_questions
      : 0;
    stats.average_score = stats.scores.length > 0
      ? stats.scores.reduce((sum: number, score: number) => sum + score, 0) / stats.scores.length
      : 0;
  });

  return topicStats;
}

function processAnalyticsByStudent(results: any[]) {
  const studentStats: any = {};

  results?.forEach(result => {
    const studentId = result.student_id;
    const studentName = result.user_profiles?.display_name ||
                       `${result.user_profiles?.first_name || ''} ${result.user_profiles?.last_name || ''}`.trim() ||
                       'Unknown Student';

    if (!studentStats[studentId]) {
      studentStats[studentId] = {
        name: studentName,
        attempts: 0,
        total_score: 0,
        total_time: 0,
        best_score: 0,
        latest_attempt: null,
        question_type_performance: {},
        theme_performance: {},
        topic_performance: {}
      };
    }

    const stats = studentStats[studentId];
    stats.attempts += 1;
    stats.total_score += result.percentage_score || 0;
    stats.total_time += result.total_time_seconds || 0;
    stats.best_score = Math.max(stats.best_score, result.percentage_score || 0);

    if (!stats.latest_attempt || new Date(result.submission_date) > new Date(stats.latest_attempt)) {
      stats.latest_attempt = result.submission_date;
    }

    // Merge performance data
    stats.question_type_performance = { ...stats.question_type_performance, ...result.performance_by_question_type };
    stats.theme_performance = { ...stats.theme_performance, ...result.performance_by_theme };
    stats.topic_performance = { ...stats.topic_performance, ...result.performance_by_topic };
  });

  // Calculate averages
  Object.values(studentStats).forEach((stats: any) => {
    stats.average_score = stats.attempts > 0 ? stats.total_score / stats.attempts : 0;
    stats.average_time_minutes = stats.attempts > 0 ? (stats.total_time / stats.attempts) / 60 : 0;
  });

  return studentStats;
}

// Reading Comprehension handlers
async function handleCreateReadingComprehensionTask(args: any) {
  const {
    title,
    language,
    curriculum_level,
    exam_board,
    theme_topic,
    category,
    subcategory,
    difficulty,
    content,
    word_count,
    estimated_reading_time,
    questions,
    created_by
  } = args;

  // Create the reading task
  const { data: task, error: taskError } = await supabase
    .from('reading_comprehension_tasks')
    .insert({
      title,
      language,
      curriculum_level,
      exam_board,
      theme_topic,
      category,
      subcategory,
      difficulty,
      content,
      word_count: word_count || content.split(' ').length,
      estimated_reading_time: estimated_reading_time || Math.ceil(content.split(' ').length / 200),
      created_by,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (taskError) throw taskError;

  // Create questions
  const questionsWithTaskId = questions.map((q: any, index: number) => ({
    task_id: task.id,
    question_number: index + 1,
    question: q.question,
    type: q.type,
    options: q.options || null,
    correct_answer: q.correct_answer,
    points: q.points,
    explanation: q.explanation || null,
  }));

  const { data: createdQuestions, error: questionsError } = await supabase
    .from('reading_comprehension_questions')
    .insert(questionsWithTaskId)
    .select();

  if (questionsError) throw questionsError;

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ 
          success: true, 
          task: { ...task, questions: createdQuestions } 
        }, null, 2),
      },
    ],
  };
}

async function handleGetReadingComprehensionTasks(args: any) {
  let query = supabase
    .from('reading_comprehension_tasks')
    .select(`
      *,
      reading_comprehension_questions(*)
    `);

  // Apply filters
  if (args.language) query = query.eq('language', args.language);
  if (args.curriculum_level) query = query.eq('curriculum_level', args.curriculum_level);
  if (args.exam_board) query = query.eq('exam_board', args.exam_board);
  if (args.category) query = query.eq('category', args.category);
  if (args.subcategory) query = query.eq('subcategory', args.subcategory);
  if (args.difficulty) query = query.eq('difficulty', args.difficulty);
  if (args.theme_topic) query = query.eq('theme_topic', args.theme_topic);

  // Order and limit
  if (args.random) {
    // For random selection, we'll order by a random function
    query = query.order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  if (args.limit) query = query.limit(args.limit);

  const { data: tasks, error } = await query;
  if (error) throw error;

  // If random is requested and we have results, shuffle them
  let finalTasks = tasks || [];
  if (args.random && finalTasks.length > 0) {
    finalTasks = finalTasks.sort(() => Math.random() - 0.5);
    if (args.limit) {
      finalTasks = finalTasks.slice(0, args.limit);
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ tasks: finalTasks }, null, 2),
      },
    ],
  };
}

async function handleSaveReadingComprehensionResult(args: any) {
  const {
    task_id,
    student_id,
    assignment_id,
    total_questions,
    correct_answers,
    score_percentage,
    time_spent_seconds,
    passed,
    question_results
  } = args;

  // Save the main result
  const { data: result, error: resultError } = await supabase
    .from('reading_comprehension_results')
    .insert({
      task_id,
      student_id,
      assignment_id,
      total_questions,
      correct_answers,
      score_percentage,
      time_spent_seconds,
      passed,
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (resultError) throw resultError;

  // Save individual question results
  const questionResultsWithId = question_results.map((qr: any) => ({
    result_id: result.id,
    question_id: qr.question_id,
    user_answer: qr.user_answer,
    correct_answer: qr.correct_answer,
    is_correct: qr.is_correct,
    points_earned: qr.points_earned,
    time_spent: qr.time_spent || 0,
  }));

  const { error: questionResultsError } = await supabase
    .from('reading_comprehension_question_results')
    .insert(questionResultsWithId);

  if (questionResultsError) throw questionResultsError;

  // Update assignment progress if this was part of an assignment
  if (assignment_id) {
    await supabase
      .from('enhanced_assignment_progress')
      .upsert({
        assignment_id,
        student_id,
        best_score: score_percentage,
        best_accuracy: (correct_answers / total_questions) * 100,
        total_time_spent: time_spent_seconds,
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'assignment_id,student_id'
      });
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ success: true, result_id: result.id }, null, 2),
      },
    ],
  };
}

async function handleGetReadingComprehensionAnalytics(args: any) {
  const {
    student_id,
    class_id,
    teacher_id,
    language,
    difficulty,
    date_from,
    date_to,
    group_by = 'student'
  } = args;

  let query = supabase
    .from('reading_comprehension_results')
    .select(`
      *,
      reading_comprehension_tasks(*),
      user_profiles!student_id(first_name, last_name)
    `);

  // Apply filters
  if (student_id) query = query.eq('student_id', student_id);
  if (language) query = query.eq('reading_comprehension_tasks.language', language);
  if (difficulty) query = query.eq('reading_comprehension_tasks.difficulty', difficulty);
  if (date_from) query = query.gte('completed_at', date_from);
  if (date_to) query = query.lte('completed_at', date_to);

  // Handle class filtering (requires join with student_classes)
  if (class_id) {
    const { data: classStudents } = await supabase
      .from('student_classes')
      .select('student_id')
      .eq('class_id', class_id);
    
    if (classStudents) {
      const studentIds = classStudents.map(cs => cs.student_id);
      query = query.in('student_id', studentIds);
    }
  }

  const { data: results, error } = await query;
  if (error) throw error;

  // Process analytics based on group_by parameter
  let analytics: any = {};

  switch (group_by) {
    case 'student':
      analytics = processStudentAnalytics(results || []);
      break;
    case 'difficulty':
      analytics = processDifficultyAnalytics(results || []);
      break;
    case 'category':
      analytics = processCategoryAnalytics(results || []);
      break;
    case 'language':
      analytics = processLanguageAnalytics(results || []);
      break;
    default:
      analytics = { error: 'Invalid group_by parameter' };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ analytics }, null, 2),
      },
    ],
  };
}

// Helper functions for analytics processing
function processStudentAnalytics(results: any[]) {
  const studentStats = results.reduce((acc, result) => {
    const studentId = result.student_id;
    if (!acc[studentId]) {
      acc[studentId] = {
        student_name: `${result.user_profiles?.first_name || ''} ${result.user_profiles?.last_name || ''}`.trim(),
        total_attempts: 0,
        total_score: 0,
        total_time: 0,
        passed_count: 0,
        average_score: 0,
        pass_rate: 0,
      };
    }
    
    acc[studentId].total_attempts++;
    acc[studentId].total_score += result.score_percentage;
    acc[studentId].total_time += result.time_spent_seconds;
    if (result.passed) acc[studentId].passed_count++;
    
    return acc;
  }, {});

  // Calculate averages
  Object.keys(studentStats).forEach(studentId => {
    const stats = studentStats[studentId];
    stats.average_score = Math.round(stats.total_score / stats.total_attempts);
    stats.pass_rate = Math.round((stats.passed_count / stats.total_attempts) * 100);
    stats.average_time = Math.round(stats.total_time / stats.total_attempts);
  });

  return { by_student: studentStats };
}

function processDifficultyAnalytics(results: any[]) {
  const difficultyStats = results.reduce((acc, result) => {
    const difficulty = result.reading_comprehension_tasks?.difficulty || 'unknown';
    if (!acc[difficulty]) {
      acc[difficulty] = {
        total_attempts: 0,
        total_score: 0,
        passed_count: 0,
        average_score: 0,
        pass_rate: 0,
      };
    }
    
    acc[difficulty].total_attempts++;
    acc[difficulty].total_score += result.score_percentage;
    if (result.passed) acc[difficulty].passed_count++;
    
    return acc;
  }, {});

  // Calculate averages
  Object.keys(difficultyStats).forEach(difficulty => {
    const stats = difficultyStats[difficulty];
    stats.average_score = Math.round(stats.total_score / stats.total_attempts);
    stats.pass_rate = Math.round((stats.passed_count / stats.total_attempts) * 100);
  });

  return { by_difficulty: difficultyStats };
}

function processCategoryAnalytics(results: any[]) {
  const categoryStats = results.reduce((acc, result) => {
    const category = result.reading_comprehension_tasks?.category || 'unknown';
    if (!acc[category]) {
      acc[category] = {
        total_attempts: 0,
        total_score: 0,
        passed_count: 0,
        average_score: 0,
        pass_rate: 0,
      };
    }
    
    acc[category].total_attempts++;
    acc[category].total_score += result.score_percentage;
    if (result.passed) acc[category].passed_count++;
    
    return acc;
  }, {});

  // Calculate averages
  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    stats.average_score = Math.round(stats.total_score / stats.total_attempts);
    stats.pass_rate = Math.round((stats.passed_count / stats.total_attempts) * 100);
  });

  return { by_category: categoryStats };
}

function processLanguageAnalytics(results: any[]) {
  const languageStats = results.reduce((acc, result) => {
    const language = result.reading_comprehension_tasks?.language || 'unknown';
    if (!acc[language]) {
      acc[language] = {
        total_attempts: 0,
        total_score: 0,
        passed_count: 0,
        average_score: 0,
        pass_rate: 0,
      };
    }
    
    acc[language].total_attempts++;
    acc[language].total_score += result.score_percentage;
    if (result.passed) acc[language].passed_count++;
    
    return acc;
  }, {});

  // Calculate averages
  Object.keys(languageStats).forEach(language => {
    const stats = languageStats[language];
    stats.average_score = Math.round(stats.total_score / stats.total_attempts);
    stats.pass_rate = Math.round((stats.passed_count / stats.total_attempts) * 100);
  });

  return { by_language: languageStats };
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
