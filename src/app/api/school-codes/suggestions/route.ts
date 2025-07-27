import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { schoolName } = await request.json();
    
    if (!schoolName || typeof schoolName !== 'string') {
      return NextResponse.json({ error: 'School name is required' }, { status: 400 });
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get available school code suggestions
    const { data: suggestions, error } = await supabase.rpc('get_available_school_codes', {
      school_name: schoolName
    });

    if (error) {
      console.error('Error getting school code suggestions:', error);
      return NextResponse.json(
        { error: 'Failed to generate school code suggestions' },
        { status: 500 }
      );
    }

    // Filter to only available suggestions and add fallbacks if needed
    const availableSuggestions = suggestions.filter((s: any) => s.is_available);
    
    // If no suggestions are available, generate numbered alternatives
    if (availableSuggestions.length === 0) {
      const baseSuggestions = await supabase.rpc('generate_school_code_suggestions', {
        school_name: schoolName
      });
      
      if (baseSuggestions.data && baseSuggestions.data.length > 0) {
        const baseCode = baseSuggestions.data[0];
        const numberedSuggestions = [];
        
        // Try numbered versions until we find available ones
        for (let i = 1; i <= 10; i++) {
          const numberedCode = `${baseCode.substring(0, 8)}${i.toString().padStart(2, '0')}`;
          const { data: exists } = await supabase
            .from('school_codes')
            .select('code')
            .eq('code', numberedCode)
            .single();
          
          if (!exists) {
            numberedSuggestions.push({
              suggestion: numberedCode,
              is_available: true
            });
            
            if (numberedSuggestions.length >= 3) break;
          }
        }
        
        return NextResponse.json({
          success: true,
          suggestions: numberedSuggestions,
          schoolName
        });
      }
    }

    return NextResponse.json({
      success: true,
      suggestions: availableSuggestions,
      schoolName
    });

  } catch (error: any) {
    console.error('School code suggestions error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to check if a specific code is available
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'Code parameter is required' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { data: existing, error } = await supabase
      .from('school_codes')
      .select('code')
      .eq('code', code.toUpperCase())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" which is what we want
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({
      code: code.toUpperCase(),
      available: !existing
    });

  } catch (error: any) {
    console.error('School code check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
