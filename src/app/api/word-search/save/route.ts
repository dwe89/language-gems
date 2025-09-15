import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const puzzleData = await request.json();

    // Validate required fields
    if (!puzzleData.title || !puzzleData.words || !puzzleData.grid) {
      return NextResponse.json(
        { error: 'Missing required puzzle data' },
        { status: 400 }
      );
    }

    // For now, we'll store in worksheets table with a special template_id
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
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to save puzzle: ${error.message}`);
    }

    console.log('Saved word search puzzle:', data.id);

    return NextResponse.json({
      success: true,
      puzzleId: data.id,
      shareUrl: `/worksheets/view/${data.id}`,
      message: 'Puzzle saved successfully'
    });

  } catch (error: any) {
    console.error('Error saving word search puzzle:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to save puzzle',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

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

    const { data, error } = await supabase
      .from('worksheets')
      .select('*')
      .eq('id', puzzleId)
      .eq('template_id', 'word_search')
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to retrieve puzzle: ${error.message}`);
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Puzzle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      puzzle: data.content.puzzle_data,
      metadata: {
        id: data.id,
        title: data.title,
        subject: data.subject,
        topic: data.topic,
        difficulty: data.difficulty,
        created_at: data.created_at
      }
    });

  } catch (error: any) {
    console.error('Error retrieving word search puzzle:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve puzzle',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
