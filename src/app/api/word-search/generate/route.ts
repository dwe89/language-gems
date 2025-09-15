import { NextRequest, NextResponse } from 'next/server';
import { generateWordSearch, WordSearchOptions } from '@/utils/wordSearchGenerator';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const {
      title,
      subject,
      language,
      words,
      settings,
      vocabularyConfig,
      instructions
    } = await request.json();

    // Validate required fields
    if (!words || !Array.isArray(words) || words.length === 0) {
      return NextResponse.json(
        { error: 'Words array is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (!title || !subject) {
      return NextResponse.json(
        { error: 'Title and subject are required' },
        { status: 400 }
      );
    }

    // Prepare word search options
    const wordSearchOptions: WordSearchOptions = {
      words: words.slice(0, 20), // Limit to 20 words for performance
      gridSize: settings?.gridSize || 15,
      maxWords: Math.min(words.length, 20),
      difficulty: 'medium' // We'll map from settings later if needed
    };

    console.log('Generating word search with options:', wordSearchOptions);

    // Generate the word search puzzle
    const wordSearchData = generateWordSearch(wordSearchOptions);

    if (!wordSearchData || !wordSearchData.grid) {
      throw new Error('Failed to generate word search puzzle');
    }

    // Calculate estimated completion time (rough estimate)
    const estimatedTime = Math.max(5, Math.min(30, words.length * 1.5));

    // Determine difficulty based on settings
    let difficulty = 'Intermediate';
    if (settings?.directions) {
      const enabledDirections = Object.values(settings.directions).filter(Boolean).length;
      if (enabledDirections <= 2) difficulty = 'Easy';
      else if (enabledDirections >= 4) difficulty = 'Hard';
    }

    // Prepare the complete puzzle data
    const puzzleData = {
      id: `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      subject,
      language: language || 'spanish',
      level: vocabularyConfig?.curriculumLevel || 'KS3',
      gridSize: wordSearchOptions.gridSize,
      words: wordSearchData.words.map(w => w.word),
      grid: wordSearchData.grid,
      instructions: instructions || 'Find all the hidden words in the puzzle below.',
      estimatedTime,
      difficulty,
      settings: {
        ...settings,
        actualWordsPlaced: wordSearchData.words.length
      },
      vocabularyConfig,
      createdAt: new Date().toISOString(),
      wordPositions: wordSearchData.words.map(w => ({
        word: w.word,
        path: w.path
      }))
    };

    console.log(`Generated word search puzzle with ${wordSearchData.words.length} words`);

    // Optionally save to database (for sharing/persistence)
    let savedPuzzleId = null;
    try {
      const { data, error } = await supabase
        .from('worksheets')
        .insert({
          title: puzzleData.title,
          subject: puzzleData.subject || 'spanish',
          topic: puzzleData.vocabularyConfig?.categoryId || 'word_search',
          difficulty: puzzleData.difficulty || 'intermediate',
          template_id: 'word_search',
          content: {
            puzzle_data: puzzleData,
            words: puzzleData.words,
            grid: puzzleData.grid,
            instructions: puzzleData.instructions,
            settings: puzzleData.settings
          },
          user_id: null, // For now, allow anonymous saves
          generation_params: {
            gridSize: puzzleData.gridSize,
            language: puzzleData.language,
            vocabularyConfig: puzzleData.vocabularyConfig
          }
        })
        .select('id')
        .single();

      if (!error && data) {
        savedPuzzleId = data.id;
        console.log('Puzzle saved with ID:', savedPuzzleId);
      }
    } catch (saveError) {
      console.warn('Failed to save puzzle to database:', saveError);
      // Continue without saving - not critical
    }

    return NextResponse.json({
      success: true,
      puzzle: {
        ...puzzleData,
        savedId: savedPuzzleId
      },
      stats: {
        requestedWords: words.length,
        placedWords: wordSearchData.words.length,
        gridSize: wordSearchOptions.gridSize,
        estimatedTime,
        difficulty
      }
    });

  } catch (error: any) {
    console.error('Error generating word search:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate word search puzzle',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving saved puzzles (for future use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const puzzleId = searchParams.get('id');

    if (!puzzleId) {
      return NextResponse.json(
        { error: 'Puzzle ID is required' },
        { status: 400 }
      );
    }

    // For now, return a placeholder response
    // In the future, this would fetch from database
    return NextResponse.json({
      success: false,
      error: 'Puzzle retrieval not yet implemented'
    });

  } catch (error: any) {
    console.error('Error retrieving word search:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve word search puzzle',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
