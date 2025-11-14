import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * GET /api/admin/aqa-reading/get-next-identifier
 * Get the next available paper identifier for a given language and tier
 * This prevents accidental overwrites by auto-suggesting the next sequential number
 * Admin only endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language');
    const tier = searchParams.get('tier');

    if (!language || !tier) {
      return NextResponse.json(
        { error: 'Missing required parameters: language and tier' },
        { status: 400 }
      );
    }

    // Get all existing identifiers for this language/tier combination
    const { data, error } = await supabase
      .from('aqa_reading_assessments')
      .select('identifier')
      .eq('language', language)
      .eq('level', tier)
      .order('identifier', { ascending: false });

    if (error) {
      console.error('Error fetching existing identifiers:', error);
      return NextResponse.json(
        { error: 'Failed to fetch existing identifiers', details: error.message },
        { status: 500 }
      );
    }

    // Extract paper numbers from identifiers (e.g., "paper-1" -> 1)
    const existingNumbers = (data || [])
      .map(item => {
        const match = item.identifier.match(/paper-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0);

    // Find the highest number and suggest the next one
    const highestNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
    const nextNumber = highestNumber + 1;
    const nextIdentifier = `paper-${nextNumber}`;

    return NextResponse.json({
      success: true,
      next_identifier: nextIdentifier,
      next_number: nextNumber,
      existing_count: existingNumbers.length,
      existing_identifiers: data?.map(item => item.identifier) || []
    });

  } catch (error: any) {
    console.error('Error in GET /api/admin/aqa-reading/get-next-identifier:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

