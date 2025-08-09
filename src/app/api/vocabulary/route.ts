import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'gems/lib/supabase-server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
import { 
  CentralizedVocabularyService, 
  CentralizedVocabularyWord, 
  VocabularyQuery as CentralizedQuery 
} from 'gems/services/centralizedVocabularyService';

// Legacy interface for backwards compatibility
export interface VocabularyWord {
  id: number;
  theme?: string;
  topic?: string;
  part_of_speech?: string;
  spanish?: string;
  english?: string;
  gem_type?: string;
  gem_color?: string;
  frequency_score?: number;
  difficulty_level?: string;
}

// Legacy query interface
export interface LegacyVocabularyQuery {
  theme?: string;
  topic?: string;
  difficulty_level?: string;
  gem_type?: string;
  limit?: number;
  offset?: number;
  part_of_speech?: string;
  search?: string;
  language_pair?: 'spanish_english' | 'french_english' | 'german_english';
}

// Modern interface for centralized vocabulary
export interface ModernVocabularyQuery {
  language?: string; // 'es', 'fr', 'de'
  category?: string;
  difficulty_level?: string;
  limit?: number;
  offset?: number;
  part_of_speech?: string;
  search?: string;
  randomize?: boolean;
  hasAudio?: boolean;
  // KS4-specific parameters
  curriculumLevel?: string;
  examBoard?: string;
  tier?: string;
  themeName?: string;
  unitName?: string;
  subcategory?: string;
}

async function handleLegacyRequest(supabase: any, searchParams: URLSearchParams) {
  // Extract query parameters for legacy vocabulary table
  const query: LegacyVocabularyQuery = {
    theme: searchParams.get('theme') || undefined,
    topic: searchParams.get('topic') || undefined,
    difficulty_level: searchParams.get('difficulty_level') || undefined,
    gem_type: searchParams.get('gem_type') || undefined,
    limit: parseInt(searchParams.get('limit') || '20'),
    offset: parseInt(searchParams.get('offset') || '0'),
    part_of_speech: searchParams.get('part_of_speech') || undefined,
    search: searchParams.get('search') || undefined,
    language_pair: (searchParams.get('language_pair') as LegacyVocabularyQuery['language_pair']) || 'spanish_english'
  };

  // Build the query for old vocabulary table
  let supabaseQuery = supabase
    .from('vocabulary')
    .select('*');

  // Apply filters
  if (query.theme) {
    supabaseQuery = supabaseQuery.eq('theme', query.theme);
  }
  
  if (query.topic) {
    supabaseQuery = supabaseQuery.eq('topic', query.topic);
  }
  
  if (query.difficulty_level) {
    supabaseQuery = supabaseQuery.eq('difficulty_level', query.difficulty_level);
  }
  
  if (query.gem_type) {
    supabaseQuery = supabaseQuery.eq('gem_type', query.gem_type);
  }
  
  if (query.part_of_speech) {
    supabaseQuery = supabaseQuery.eq('part_of_speech', query.part_of_speech);
  }
  
  if (query.search) {
    // Search in both Spanish and English words
    supabaseQuery = supabaseQuery.or(
      `spanish.ilike.%${query.search}%,english.ilike.%${query.search}%`
    );
  }

  // Apply pagination
  supabaseQuery = supabaseQuery
    .range(query.offset || 0, (query.offset || 0) + (query.limit || 20) - 1);

  const { data: vocabulary, error } = await supabaseQuery;

  if (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legacy vocabulary' },
      { status: 500 }
    );
  }

  return NextResponse.json({
    vocabulary,
    pagination: {
      limit: query.limit,
      offset: query.offset,
      count: vocabulary?.length || 0
    },
    meta: {
      type: 'legacy'
    }
  });
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    // Check if this is a legacy request or modern request
    const isLegacy = searchParams.has('theme') || searchParams.has('topic') || searchParams.has('gem_type');
    
    if (isLegacy) {
      // Handle legacy requests to old vocabulary table
      return handleLegacyRequest(supabase, searchParams);
    }
    
    // Handle modern centralized vocabulary requests
    const vocabularyService = new CentralizedVocabularyService(supabase);
    
    // Extract query parameters
    const curriculumLevel = searchParams.get('curriculumLevel');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');

    // Map KS4 category IDs to theme names or use direct theme/unit names
    let themeName: string | undefined = searchParams.get('themeName') || undefined;
    let unitName: string | undefined = searchParams.get('unitName') || undefined;

    // If no direct theme/unit names provided, try to map from category IDs
    if (curriculumLevel === 'KS4' && category && !themeName) {
      const themeMapping: Record<string, string> = {
        'aqa_general': 'General',
        'aqa_communication': 'Communication and the world around us',
        'aqa_people_lifestyle': 'People and lifestyle',
        'aqa_popular_culture': 'Popular culture',
        'aqa_cultural_items': 'Cultural items',
        'edexcel_general': 'General',
        'edexcel_personal_world': 'My personal world',
        'edexcel_neighborhood': 'My neighborhood',
        'edexcel_studying_future': 'Studying and my future',
        'edexcel_travel_tourism': 'Travel and tourism',
        'edexcel_media_technology': 'Media and technology'
      };

      themeName = themeMapping[category] || category;
      unitName = subcategory; // For KS4, subcategory is the unit name
    }

    const query: CentralizedQuery = {
      language: searchParams.get('language') || 'es',
      category: curriculumLevel === 'KS4' ? undefined : category, // Don't use category for KS4
      subcategory: curriculumLevel === 'KS4' ? undefined : subcategory, // Don't use subcategory for KS4
      difficulty_level: searchParams.get('difficulty_level') || undefined,
      limit: parseInt(searchParams.get('limit') || '20'),
      offset: parseInt(searchParams.get('offset') || '0'),
      part_of_speech: searchParams.get('part_of_speech') || undefined,
      search: searchParams.get('search') || undefined,
      randomize: searchParams.get('randomize') === 'true',
      hasAudio: searchParams.has('hasAudio') ? searchParams.get('hasAudio') === 'true' : undefined,
      // KS4-specific parameters
      curriculumLevel: curriculumLevel || undefined,
      examBoard: searchParams.get('examBoard') || undefined,
      tier: searchParams.get('tier') || undefined,
      themeName: themeName,
      unitName: unitName
    };

    console.log('🔍 API Vocabulary Query:', query);
    const vocabulary = await vocabularyService.getVocabulary(query);
    console.log('📊 API Vocabulary Result:', { count: vocabulary?.length || 0, firstItem: vocabulary?.[0] });

    return NextResponse.json({
      vocabulary,
      pagination: {
        limit: query.limit,
        offset: query.offset,
        count: vocabulary?.length || 0
      },
      meta: {
        type: 'centralized',
        language: query.language,
        category: query.category
      }
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    
    // Check if this is legacy format or modern format
    const isLegacy = 'spanish' in body || 'english' in body;
    
    if (isLegacy) {
      // Handle legacy vocabulary creation
      const { data: newWord, error } = await supabase
        .from('vocabulary')
        .insert([body])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json(
          { error: 'Failed to create legacy vocabulary word' },
          { status: 500 }
        );
      }

      return NextResponse.json(newWord, { status: 201 });
    } else {
      // Handle modern centralized vocabulary creation
      const vocabularyService = new CentralizedVocabularyService(supabase);
      
      const newWord = await vocabularyService.upsertVocabulary(body);
      
      return NextResponse.json(newWord, { status: 201 });
    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
