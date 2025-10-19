import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/aqa-listening/list
 * List all AQA listening papers with optional filters
 * Admin only endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { searchParams } = new URL(request.url);
    
    const language = searchParams.get('language');
    const tier = searchParams.get('tier');

    let query = supabase
      .from('aqa_listening_assessments')
      .select('*')
      .order('language')
      .order('level')
      .order('identifier');

    if (language) {
      query = query.eq('language', language);
    }

    if (tier) {
      query = query.eq('level', tier);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching papers:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch papers', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      papers: data || [],
    });
  } catch (error: any) {
    console.error('Error in list endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

