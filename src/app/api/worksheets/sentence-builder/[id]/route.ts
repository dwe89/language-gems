import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const worksheetId = params.id;

    if (!worksheetId) {
      return NextResponse.json(
        { success: false, error: 'Worksheet ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching sentence builder worksheet:', worksheetId);

    // Fetch the worksheet from the database
    const { data: worksheet, error } = await supabase
      .from('worksheets')
      .select('*')
      .eq('id', worksheetId)
      .eq('template_id', 'sentence_builder')
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Worksheet not found' },
        { status: 404 }
      );
    }

    if (!worksheet) {
      return NextResponse.json(
        { success: false, error: 'Worksheet not found' },
        { status: 404 }
      );
    }

    console.log('Found sentence builder worksheet:', worksheet.title);

    // Return the worksheet data
    return NextResponse.json({
      success: true,
      worksheet: worksheet.content,
      metadata: {
        id: worksheet.id,
        title: worksheet.title,
        subject: worksheet.subject,
        topic: worksheet.topic,
        difficulty: worksheet.difficulty || 'intermediate',
        template_id: worksheet.template_id,
        created_at: worksheet.created_at,
        updated_at: worksheet.updated_at
      }
    });

  } catch (error) {
    console.error('Error fetching sentence builder worksheet:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const worksheetId = params.id;
    const body = await request.json();

    if (!worksheetId) {
      return NextResponse.json(
        { success: false, error: 'Worksheet ID is required' },
        { status: 400 }
      );
    }

    console.log('Updating sentence builder worksheet:', worksheetId);

    // Update the worksheet in the database
    const { data: worksheet, error } = await supabase
      .from('worksheets')
      .update({
        title: body.title,
        content: body.content,
        subject: body.subject,
        topic: body.topic,
        difficulty: body.difficulty,
        updated_at: new Date().toISOString()
      })
      .eq('id', worksheetId)
      .eq('template_id', 'sentence_builder')
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update worksheet' },
        { status: 500 }
      );
    }

    console.log('Updated sentence builder worksheet:', worksheet.title);

    return NextResponse.json({
      success: true,
      worksheet: worksheet.content,
      metadata: {
        id: worksheet.id,
        title: worksheet.title,
        subject: worksheet.subject,
        topic: worksheet.topic,
        difficulty: worksheet.difficulty || 'intermediate',
        template_id: worksheet.template_id,
        created_at: worksheet.created_at,
        updated_at: worksheet.updated_at
      }
    });

  } catch (error) {
    console.error('Error updating sentence builder worksheet:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const worksheetId = params.id;

    if (!worksheetId) {
      return NextResponse.json(
        { success: false, error: 'Worksheet ID is required' },
        { status: 400 }
      );
    }

    console.log('Deleting sentence builder worksheet:', worksheetId);

    // Delete the worksheet from the database
    const { error } = await supabase
      .from('worksheets')
      .delete()
      .eq('id', worksheetId)
      .eq('template_id', 'sentence_builder');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete worksheet' },
        { status: 500 }
      );
    }

    console.log('Deleted sentence builder worksheet:', worksheetId);

    return NextResponse.json({
      success: true,
      message: 'Worksheet deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting sentence builder worksheet:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
