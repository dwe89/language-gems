import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Helper function to generate school code components dynamically from any school name
function generateSchoolCodeComponents(schoolName: string) {
  const cleanedName = schoolName.toUpperCase().replace(/[^A-Z0-9\s]/g, ''); // Remove special chars, keep spaces
  const words = cleanedName.split(/\s+/).filter(Boolean); // Split by spaces, remove empty strings

  let initials = '';
  if (words.length > 0) {
    initials = words.map(word => word[0]).join('');
  }
  
  let firstThreeLetters = '';
  if (words.length > 0) {
    firstThreeLetters = words[0].substring(0, Math.min(words[0].length, 3));
  }

  let combinedLetters = '';
  if (words.length > 0) {
    if (words.length === 1) {
      combinedLetters = words[0].substring(0, Math.min(words[0].length, 8)); // Max 8 chars for single word
    } else {
      for (const word of words) {
        combinedLetters += word.substring(0, Math.min(word.length, 3)); // Take up to 3 letters from each word
      }
      combinedLetters = combinedLetters.substring(0, Math.min(combinedLetters.length, 8)); // Ensure max 8 chars
    }
  }

  // More advanced combination for a stronger secondary abbreviation (e.g., SIXVI, BOGCOM)
  let advancedCombination = '';
  if (words.length >= 2) {
      advancedCombination += words[0].substring(0, Math.min(words[0].length, 3)); // First 3 from first word
      advancedCombination += words[1].substring(0, Math.min(words[1].length, 2)); // First 2 from second word
      if (words.length >= 3) { // If there's a third word, take a couple letters
          advancedCombination += words[2].substring(0, Math.min(words[2].length, 2));
      }
      advancedCombination = advancedCombination.toUpperCase();
  }

  // New component: First two words combined without spaces (e.g., SIXVILLAGES)
  let firstTwoWordsCombined = '';
  if (words.length >= 2) {
      firstTwoWordsCombined = (words[0] + words[1]).toUpperCase();
  }

  return { initials, firstThreeLetters, combinedLetters, cleanedName, advancedCombination, firstTwoWordsCombined };
}

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

    let finalSuggestions: { suggestion: string; is_available: boolean }[] = [];
    const currentYear = new Date().getFullYear();

    // Generate components for school name
    const { initials, firstThreeLetters, combinedLetters, cleanedName, advancedCombination, firstTwoWordsCombined } = generateSchoolCodeComponents(schoolName);

    // 1. Define custom priority suggestions based on generated components
    // Ordered from most desired to less desired for general applicability.
    const customSuggestions = [
      initials, // 1. SVA, BCCA, HHS (most concise initialism)
      firstTwoWordsCombined, // **2. SIXVILLAGES** (for "Six Villages Academy"), or a similar strong combination for other schools
      `${initials}${currentYear}`, // 3. SVA2025, BCCA2025 (initialism with current year)
      
      advancedCombination, // e.g., SIXVI, BOGCOM (more intelligent combined abbreviation)
      `${advancedCombination}${currentYear}`, // e.g., SIXVI2025

      // Platform-specific/Themed suggestions (using initials for relevance)
      `${initials}ONLINE`, 
      `${initials}LEARN`, 

      // Longer, descriptive abbreviations or parts of the name
      cleanedName.substring(0, Math.min(cleanedName.length, 10)).replace(/\s/g, ''), // e.g., SIXVILLAGE, BOGNORREGI (first part of cleaned name)
      cleanedName.replace(/\s/g, ''), // Full cleaned name (useful if all short ones are taken)
      
      // Generic first word / three letters
      firstThreeLetters, // e.g., SIX, BOG, HAP (first three letters of first word)
      `${firstThreeLetters}${currentYear}`, // e.g., SIX2025, BOG2025
      
      // The `combinedLetters` from the helper, if it generates something unique not covered above
      combinedLetters, 
      `${combinedLetters}${currentYear}`,

    ].filter(s => s && s.length > 0 && s.length <= 20); // Filter out empty strings and overly long suggestions (max 20 chars)

    // Remove duplicates from customSuggestions while maintaining order
    const uniqueCustomSuggestions = Array.from(new Set(customSuggestions));

    // 2. Check availability of unique custom suggestions and add them to finalSuggestions
    for (const suggestion of uniqueCustomSuggestions) {
      if (finalSuggestions.length >= 5) break; // Limit the number of initial suggestions displayed
      
      const { data: exists } = await supabase
        .from('school_codes')
        .select('code')
        .eq('code', suggestion)
        .single();

      if (!exists) {
        finalSuggestions.push({
          suggestion: suggestion,
          is_available: true
        });
      }
    }

    // 3. Get suggestions from the Supabase RPC, filter for availability and remove duplicates
    // This integrates suggestions generated by your database function.
    const { data: rpcSuggestions, error: rpcError } = await supabase.rpc('get_available_school_codes', {
      school_name: schoolName
    });

    if (rpcError) {
      console.error('Error getting school code suggestions from RPC:', rpcError);
      // Log the error but continue, relying on custom suggestions if RPC fails.
    } else if (rpcSuggestions) {
      const existingSuggestions = new Set(finalSuggestions.map(s => s.suggestion));
      for (const rpcSugg of rpcSuggestions) {
        if (finalSuggestions.length >= 5) break; // Limit total suggestions displayed
        // Only add if available and not already in our list
        if (rpcSugg.is_available && !existingSuggestions.has(rpcSugg.suggestion)) {
          finalSuggestions.push({
            suggestion: rpcSugg.suggestion,
            is_available: true
          });
          existingSuggestions.add(rpcSugg.suggestion); // Add to set to prevent future duplicates
        }
      }
    }

    // 4. If still not enough suggestions, generate numbered alternatives (existing fallback logic)
    // This ensures there are always some options, even if common abbreviations are taken.
    if (finalSuggestions.length === 0) { // Only if no suggestions were found at all from previous steps
        const baseSuggestions = await supabase.rpc('generate_school_code_suggestions', {
            school_name: schoolName
        });
        
        if (baseSuggestions.data && baseSuggestions.data.length > 0) {
            const baseCode = baseSuggestions.data[0]; // Take the first generated code as base for numbering
            
            for (let i = 1; i <= 10; i++) { // Try up to 10 numbered variations
                const numberedCode = `${baseCode.substring(0, Math.min(baseCode.length, 8))}${i.toString().padStart(2, '0')}`;
                const { data: exists } = await supabase
                    .from('school_codes')
                    .select('code')
                    .eq('code', numberedCode)
                    .single();
                
                if (!exists) {
                    finalSuggestions.push({
                        suggestion: numberedCode,
                        is_available: true
                    });
                    
                    if (finalSuggestions.length >= 3) break; // Ensure at least 3 numbered suggestions if possible
                }
            }
        }
    }
    
    return NextResponse.json({
      success: true,
      suggestions: finalSuggestions,
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

// GET endpoint to check if a specific code is available (no changes needed)
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