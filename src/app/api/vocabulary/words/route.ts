import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'es';
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const curriculumLevel = searchParams.get('curriculumLevel') || 'KS3';
    const examBoard = searchParams.get('examBoard');
    const tier = searchParams.get('tier');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    console.log('Fetching vocabulary words:', {
      language,
      category,
      subcategory,
      curriculumLevel,
      examBoard,
      tier,
      limit
    });

    // Build the query based on curriculum level
    let query = supabase
      .from('vocabulary')
      .select('id, target_word, english_translation, category, subcategory')
      .eq('language', language)
      .eq('category', category)
      .limit(limit);

    // Add subcategory filter if provided
    if (subcategory) {
      query = query.eq('subcategory', subcategory);
    }

    // Add curriculum level specific filters
    if (curriculumLevel === 'KS4' && examBoard) {
      query = query.eq('exam_board_code', examBoard.toLowerCase());
      
      if (tier) {
        query = query.eq('tier', tier);
      }
    } else {
      // For non-KS4 levels, filter by curriculum level
      query = query.eq('curriculum_level', curriculumLevel);
    }

    const { data: vocabularyData, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    if (!vocabularyData || vocabularyData.length === 0) {
      console.log('No vocabulary found, returning fallback words');
      
      // Return fallback words based on language
      const fallbackWords = getFallbackWords(language, category);
      
      return NextResponse.json({
        success: true,
        words: fallbackWords,
        count: fallbackWords.length,
        fallback: true,
        message: 'No vocabulary found in database, using fallback words'
      });
    }

    // Transform the data for word search use
    const words = vocabularyData.map(item => ({
      word: item.target_word.toUpperCase(),
      translation: item.english_translation,
      category: item.category,
      subcategory: item.subcategory
    }));

    console.log(`Found ${words.length} vocabulary words`);

    return NextResponse.json({
      success: true,
      words,
      count: words.length,
      category,
      subcategory,
      language,
      curriculumLevel
    });

  } catch (error: any) {
    console.error('Error fetching vocabulary words:', error);
    
    // Return fallback words on error
    const fallbackWords = getFallbackWords('es', 'family_friends');
    
    return NextResponse.json({
      success: true,
      words: fallbackWords,
      count: fallbackWords.length,
      fallback: true,
      error: 'Failed to fetch vocabulary, using fallback words'
    });
  }
}

function getFallbackWords(language: string, category: string): Array<{word: string, translation: string}> {
  const fallbackSets: { [key: string]: { [key: string]: Array<{word: string, translation: string}> } } = {
    'es': {
      'family_friends': [
        { word: 'MADRE', translation: 'mother' },
        { word: 'PADRE', translation: 'father' },
        { word: 'HERMANO', translation: 'brother' },
        { word: 'HERMANA', translation: 'sister' },
        { word: 'ABUELO', translation: 'grandfather' },
        { word: 'ABUELA', translation: 'grandmother' },
        { word: 'PRIMO', translation: 'cousin (male)' },
        { word: 'PRIMA', translation: 'cousin (female)' },
        { word: 'AMIGO', translation: 'friend (male)' },
        { word: 'AMIGA', translation: 'friend (female)' }
      ],
      'colours': [
        { word: 'ROJO', translation: 'red' },
        { word: 'AZUL', translation: 'blue' },
        { word: 'VERDE', translation: 'green' },
        { word: 'AMARILLO', translation: 'yellow' },
        { word: 'NEGRO', translation: 'black' },
        { word: 'BLANCO', translation: 'white' },
        { word: 'ROSA', translation: 'pink' },
        { word: 'MORADO', translation: 'purple' }
      ],
      'default': [
        { word: 'CASA', translation: 'house' },
        { word: 'PERRO', translation: 'dog' },
        { word: 'GATO', translation: 'cat' },
        { word: 'AGUA', translation: 'water' },
        { word: 'COMIDA', translation: 'food' },
        { word: 'ESCUELA', translation: 'school' },
        { word: 'LIBRO', translation: 'book' },
        { word: 'TIEMPO', translation: 'time' }
      ]
    },
    'fr': {
      'family_friends': [
        { word: 'MERE', translation: 'mother' },
        { word: 'PERE', translation: 'father' },
        { word: 'FRERE', translation: 'brother' },
        { word: 'SOEUR', translation: 'sister' },
        { word: 'GRANDPERE', translation: 'grandfather' },
        { word: 'GRANDMERE', translation: 'grandmother' },
        { word: 'COUSIN', translation: 'cousin' },
        { word: 'AMI', translation: 'friend' }
      ],
      'default': [
        { word: 'MAISON', translation: 'house' },
        { word: 'CHIEN', translation: 'dog' },
        { word: 'CHAT', translation: 'cat' },
        { word: 'EAU', translation: 'water' },
        { word: 'NOURRITURE', translation: 'food' },
        { word: 'ECOLE', translation: 'school' },
        { word: 'LIVRE', translation: 'book' },
        { word: 'TEMPS', translation: 'time' }
      ]
    }
  };

  const languageSet = fallbackSets[language] || fallbackSets['es'];
  return languageSet[category] || languageSet['default'];
}
