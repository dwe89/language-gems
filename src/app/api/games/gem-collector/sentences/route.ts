import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export interface SentenceSegment {
  id: string;
  segmentOrder: number;
  englishSegment: string;
  targetSegment: string;
  segmentType: 'word' | 'phrase' | 'article' | 'conjunction';
  grammarNote?: string;
  options: SentenceSegmentOption[];
}

export interface SentenceSegmentOption {
  id: string;
  optionText: string;
  isCorrect: boolean;
  distractorType: 'semantic' | 'grammatical' | 'phonetic' | 'random';
  explanation?: string;
}

export interface SentenceTranslation {
  id: string;
  englishSentence: string;
  targetLanguage: string;
  targetSentence: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  theme?: string;
  topic?: string;
  grammarFocus?: string;
  curriculumTier: 'Foundation' | 'Higher';
  wordCount: number;
  complexityScore: number;
  segments: SentenceSegment[];
}

interface SentenceRequest {
  mode: 'assignment' | 'freeplay';
  assignmentId?: string;
  language?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  theme?: string;
  topic?: string;
  count?: number;
  curriculumTier?: 'Foundation' | 'Higher';
}

export async function POST(request: NextRequest) {
  try {
    // Create Supabase client with service role for server-side operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // For now, we'll use a test UUID for development
    // In production, you'd want to verify the user's session
    const user = { id: '00000000-0000-0000-0000-000000000001' };

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: SentenceRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Invalid JSON in request body:', parseError);
      return NextResponse.json({ error: 'Invalid request format' }, { status: 400 });
    }

    // Validate required fields
    if (!body.mode || !['assignment', 'freeplay'].includes(body.mode)) {
      return NextResponse.json({ error: 'Invalid or missing mode' }, { status: 400 });
    }

    if (body.mode === 'assignment' && !body.assignmentId) {
      return NextResponse.json({ error: 'Assignment ID required for assignment mode' }, { status: 400 });
    }
    const { 
      mode, 
      assignmentId, 
      language = 'spanish', 
      difficulty = 'beginner', 
      theme, 
      topic, 
      count = 10,
      curriculumTier = 'Foundation'
    } = body;

    let sentences: SentenceTranslation[] = [];

    if (mode === 'assignment' && assignmentId) {
      // Get assignment details and associated vocabulary/sentences
      const { data: assignment, error: assignmentError } = await supabase
        .from('assignments')
        .select(`
          *,
          vocabulary_assignment_lists (
            *,
            vocabulary_assignment_items (
              vocabulary (*)
            )
          )
        `)
        .eq('id', assignmentId)
        .single();

      if (assignmentError) {
        console.error('Assignment fetch error:', assignmentError);
        return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
      }

      // Check if user has access to this assignment
      const { data: classAccess } = await supabase
        .from('class_students')
        .select('*')
        .eq('class_id', assignment.class_id)
        .eq('student_id', user.id)
        .single();

      if (!classAccess) {
        return NextResponse.json({ error: 'Access denied to this assignment' }, { status: 403 });
      }

      // Get sentences based on assignment configuration
      let sentenceQuery = supabase
        .from('sentence_translations')
        .select(`
          *,
          sentence_segments (
            *,
            sentence_segment_options (*)
          )
        `)
        .eq('target_language', language)
        .eq('curriculum_tier', curriculumTier)
        .order('complexity_score', { ascending: true });

      // Apply assignment-specific filters
      if (assignment.game_config?.difficulty) {
        sentenceQuery = sentenceQuery.eq('difficulty_level', assignment.game_config.difficulty);
      } else {
        sentenceQuery = sentenceQuery.eq('difficulty_level', difficulty);
      }

      if (assignment.game_config?.theme) {
        sentenceQuery = sentenceQuery.eq('theme', assignment.game_config.theme);
      } else if (theme) {
        sentenceQuery = sentenceQuery.eq('theme', theme);
      }

      if (assignment.game_config?.topic) {
        sentenceQuery = sentenceQuery.eq('topic', assignment.game_config.topic);
      } else if (topic) {
        sentenceQuery = sentenceQuery.eq('topic', topic);
      }

      const { data: sentenceData, error: sentenceError } = await sentenceQuery.limit(count);

      if (sentenceError) {
        console.error('Sentence fetch error:', sentenceError);
        return NextResponse.json({ error: 'Failed to fetch sentences' }, { status: 500 });
      }

      sentences = sentenceData?.map(transformSentenceData) || [];

    } else {
      // Free play mode - get sentences based on user preferences
      let sentenceQuery = supabase
        .from('sentence_translations')
        .select(`
          *,
          sentence_segments (
            *,
            sentence_segment_options (*)
          )
        `)
        .eq('target_language', language)
        .eq('difficulty_level', difficulty)
        .eq('curriculum_tier', curriculumTier)
        .eq('is_public', true)
        .order('complexity_score', { ascending: true });

      if (theme) {
        sentenceQuery = sentenceQuery.eq('theme', theme);
      }

      if (topic) {
        sentenceQuery = sentenceQuery.eq('topic', topic);
      }

      const { data: sentenceData, error: sentenceError } = await sentenceQuery.limit(count);

      if (sentenceError) {
        console.error('Sentence fetch error:', sentenceError);
        return NextResponse.json({ error: 'Failed to fetch sentences' }, { status: 500 });
      }

      sentences = sentenceData?.map(transformSentenceData) || [];
    }

    // If no sentences found, provide fallback
    if (sentences.length === 0) {
      sentences = getFallbackSentences(language, difficulty);
    }

    return NextResponse.json({ 
      sentences,
      metadata: {
        mode,
        assignmentId,
        language,
        difficulty,
        theme,
        topic,
        count: sentences.length
      }
    });

  } catch (error) {
    console.error('Error fetching sentences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function transformSentenceData(data: any): SentenceTranslation {
  return {
    id: data.id,
    englishSentence: data.english_sentence,
    targetLanguage: data.target_language,
    targetSentence: data.target_sentence,
    difficultyLevel: data.difficulty_level,
    theme: data.theme,
    topic: data.topic,
    grammarFocus: data.grammar_focus,
    curriculumTier: data.curriculum_tier,
    wordCount: data.word_count,
    complexityScore: data.complexity_score,
    segments: data.sentence_segments
      ?.sort((a: any, b: any) => a.segment_order - b.segment_order)
      ?.map((segment: any) => ({
        id: segment.id,
        segmentOrder: segment.segment_order,
        englishSegment: segment.english_segment,
        targetSegment: segment.target_segment,
        segmentType: segment.segment_type,
        grammarNote: segment.grammar_note,
        options: segment.sentence_segment_options?.map((option: any) => ({
          id: option.id,
          optionText: option.option_text,
          isCorrect: option.is_correct,
          distractorType: option.distractor_type,
          explanation: option.explanation
        })) || []
      })) || []
  };
}

function getFallbackSentences(language: string, difficulty: string): SentenceTranslation[] {
  // Provide basic fallback sentences if database is empty
  return [
    {
      id: 'fallback-1',
      englishSentence: 'I like to go to the cinema',
      targetLanguage: language,
      targetSentence: 'Me gusta ir al cine',
      difficultyLevel: difficulty as any,
      theme: 'Leisure and entertainment',
      topic: 'Free time activities',
      grammarFocus: 'gustar-verb',
      curriculumTier: 'Foundation',
      wordCount: 6,
      complexityScore: 30,
      segments: [
        {
          id: 'fallback-seg-1',
          segmentOrder: 1,
          englishSegment: 'I like',
          targetSegment: 'Me gusta',
          segmentType: 'phrase',
          grammarNote: 'Gustar construction',
          options: [
            { id: 'opt-1', optionText: 'Me gusta', isCorrect: true, distractorType: 'correct' },
            { id: 'opt-2', optionText: 'Me encanta', isCorrect: false, distractorType: 'semantic' },
            { id: 'opt-3', optionText: 'Odio', isCorrect: false, distractorType: 'semantic' }
          ]
        },
        {
          id: 'fallback-seg-2',
          segmentOrder: 2,
          englishSegment: 'to go',
          targetSegment: 'ir',
          segmentType: 'word',
          options: [
            { id: 'opt-4', optionText: 'ir', isCorrect: true, distractorType: 'correct' },
            { id: 'opt-5', optionText: 'venir', isCorrect: false, distractorType: 'semantic' },
            { id: 'opt-6', optionText: 'estar', isCorrect: false, distractorType: 'grammatical' }
          ]
        },
        {
          id: 'fallback-seg-3',
          segmentOrder: 3,
          englishSegment: 'to the cinema',
          targetSegment: 'al cine',
          segmentType: 'phrase',
          grammarNote: 'Contraction al = a + el',
          options: [
            { id: 'opt-7', optionText: 'al cine', isCorrect: true, distractorType: 'correct' },
            { id: 'opt-8', optionText: 'del cine', isCorrect: false, distractorType: 'grammatical' },
            { id: 'opt-9', optionText: 'en cine', isCorrect: false, distractorType: 'grammatical' }
          ]
        }
      ]
    }
  ];
}
