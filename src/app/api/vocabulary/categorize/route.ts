import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { vocabularyCategorizationService } from '@/services/VocabularyCategorizationService';

interface VocabularyItem {
  term: string;
  translation: string;
  part_of_speech?: string;
  context_sentence?: string;
}

interface CategorizationRequest {
  items: VocabularyItem[];
  language?: 'spanish' | 'french' | 'german';
  use_ai?: boolean;
}

// Rate limiting: max 100 items per request, max 10 requests per minute per user
const RATE_LIMITS = {
  MAX_ITEMS_PER_REQUEST: 100,
  MAX_REQUESTS_PER_MINUTE: 10
};

// Simple in-memory rate limiting (in production, use Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitMap.get(userId);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(userId, { count: 1, resetTime: now + 60000 }); // 1 minute
    return true;
  }

  if (userLimit.count >= RATE_LIMITS.MAX_REQUESTS_PER_MINUTE) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check rate limiting
    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before making more requests.' },
        { status: 429 }
      );
    }

    const body: CategorizationRequest = await request.json();
    const { items, language = 'spanish', use_ai = true } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Invalid items array' },
        { status: 400 }
      );
    }

    if (items.length > RATE_LIMITS.MAX_ITEMS_PER_REQUEST) {
      return NextResponse.json(
        { error: `Too many items. Maximum ${RATE_LIMITS.MAX_ITEMS_PER_REQUEST} items per request.` },
        { status: 400 }
      );
    }

    console.log('🤖 [API] Starting categorization for', items.length, 'items, user:', user.id);

    // Use the categorization service
    const results = await vocabularyCategorizationService.categorizeVocabulary(items);

    // If AI is enabled and we have low confidence results, enhance with external AI
    if (use_ai) {
      const lowConfidenceItems = results
        .map((result, index) => ({ result, index, item: items[index] }))
        .filter(({ result }) => result.category_confidence < 0.7);

      if (lowConfidenceItems.length > 0) {
        console.log('🧠 [API] Enhancing', lowConfidenceItems.length, 'items with AI');
        
        for (const { result, index, item } of lowConfidenceItems) {
          try {
            const aiResult = await enhanceWithExternalAI(item, language);
            if (aiResult) {
              results[index] = {
                ...result,
                predicted_category: aiResult.category,
                predicted_subcategory: aiResult.subcategory,
                category_confidence: aiResult.confidence
              };
            }
          } catch (error) {
            console.error('🚨 [API] AI enhancement failed for item:', item.term, error);
            // Continue with original result
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      results,
      metadata: {
        total_items: items.length,
        ai_enhanced: use_ai,
        language
      }
    });

  } catch (error) {
    console.error('🚨 [API] Categorization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Enhance categorization with GPT-5 Nano AI service
 */
async function enhanceWithExternalAI(
  item: VocabularyItem,
  language: string
): Promise<{ category: string; subcategory: string; confidence: number } | null> {
  // Check if AI categorization is enabled
  if (!process.env.OPENAI_API_KEY) {
    console.log('🤖 [AI] OpenAI API key not configured, using rule-based categorization');
    return enhancedRuleBasedCategorization(item, language);
  }

  try {
    console.log('🧠 [AI] Calling GPT-5 Nano for vocabulary categorization:', item.term);

    const prompt = `Categorize this Spanish vocabulary word using our existing categories:

Word: ${item.term}
Translation: ${item.translation}

Choose the BEST match from these exact categories:
- school_jobs_future/classroom_objects (school supplies, books, pens, etc.)
- home_local_area/house_rooms (doors, windows, rooms, building parts)
- home_local_area/furniture (chairs, tables, beds, etc.)
- identity_personal_life/family_friends (people, relationships)
- food_drink/food_drink_vocabulary (food, drinks, meals)
- nature_environment/plants (flowers, trees, plants)
- free_time_leisure/hobbies_interests (games, activities, sports)
- basics_core_language/colours (colors, basic words)

For example:
- "la papelera" (wastebasket) → school_jobs_future/classroom_objects
- "el diccionario" (dictionary) → school_jobs_future/classroom_objects
- "el pasillo" (hallway) → home_local_area/house_rooms

Return JSON only:
{"category":"exact_category_name","subcategory":"exact_subcategory_name","confidence":0.9}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-nano-2025-08-07',
        messages: [{ role: 'user', content: prompt }],
        max_completion_tokens: 1000, // Give it plenty of room
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('🚨 [AI] OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔍 [AI] Raw GPT-5 Nano response:', JSON.stringify(data, null, 2));

    const result = JSON.parse(data.choices[0].message.content || '{}');
    console.log('🔍 [AI] Parsed result:', JSON.stringify(result, null, 2));

    console.log('✅ [AI] GPT-5 Nano categorization result:', {
      term: item.term,
      category: result.category,
      subcategory: result.subcategory,
      confidence: result.confidence
    });

    return {
      category: result.category || 'General',
      subcategory: result.subcategory || 'Uncategorized',
      confidence: Math.min(result.confidence || 0.8, 0.95) // Cap AI confidence at 95%
    };

  } catch (error) {
    console.error('🚨 [AI] Error calling GPT-5 Nano:', error);

    // Fallback to enhanced rule-based categorization
    console.log('🔄 [AI] Falling back to rule-based categorization');
    return enhancedRuleBasedCategorization(item, language);
  }
}

/**
 * Enhanced rule-based categorization with higher confidence
 */
function enhancedRuleBasedCategorization(
  item: VocabularyItem,
  language: string
): { category: string; subcategory: string; confidence: number } {
  const word = item.term.toLowerCase();
  const translation = item.translation.toLowerCase();
  const context = (item.context_sentence || '').toLowerCase();
  
  // Enhanced keyword matching with context
  const categories = [
    {
      category: 'Food and Drink',
      subcategory: 'Food Items',
      keywords: ['comida', 'alimento', 'comer', 'food', 'eat', 'meal', 'dish', 'cuisine'],
      confidence: 0.85
    },
    {
      category: 'Food and Drink', 
      subcategory: 'Beverages',
      keywords: ['bebida', 'beber', 'agua', 'vino', 'cerveza', 'drink', 'water', 'wine', 'beer', 'juice'],
      confidence: 0.9
    },
    {
      category: 'Family and Relationships',
      subcategory: 'Family Members', 
      keywords: ['familia', 'padre', 'madre', 'hijo', 'hija', 'hermano', 'hermana', 'family', 'father', 'mother', 'son', 'daughter', 'brother', 'sister', 'parent'],
      confidence: 0.9
    },
    {
      category: 'Home and Living',
      subcategory: 'House Parts',
      keywords: ['casa', 'hogar', 'habitación', 'cocina', 'baño', 'house', 'home', 'room', 'kitchen', 'bathroom', 'bedroom'],
      confidence: 0.85
    },
    {
      category: 'Descriptions',
      subcategory: 'Colors',
      keywords: ['color', 'rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'red', 'blue', 'green', 'yellow', 'black', 'white', 'pink', 'purple'],
      confidence: 0.95
    },
    {
      category: 'Numbers and Time',
      subcategory: 'Numbers',
      keywords: ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
      confidence: 0.95
    },
    {
      category: 'Numbers and Time',
      subcategory: 'Time',
      keywords: ['tiempo', 'hora', 'día', 'semana', 'mes', 'año', 'time', 'hour', 'day', 'week', 'month', 'year', 'morning', 'afternoon', 'evening'],
      confidence: 0.9
    },
    {
      category: 'Travel and Transport',
      subcategory: 'Vehicles',
      keywords: ['coche', 'carro', 'autobús', 'tren', 'avión', 'car', 'bus', 'train', 'plane', 'vehicle', 'transport'],
      confidence: 0.9
    },
    {
      category: 'Actions and Verbs',
      subcategory: 'Common Actions',
      keywords: ['hacer', 'ir', 'venir', 'ver', 'hablar', 'comer', 'beber', 'do', 'go', 'come', 'see', 'speak', 'talk', 'eat', 'drink'],
      confidence: 0.8
    }
  ];

  // Check for matches
  for (const cat of categories) {
    const matches = cat.keywords.some(keyword => 
      word.includes(keyword) || 
      translation.includes(keyword) || 
      context.includes(keyword)
    );
    
    if (matches) {
      return {
        category: cat.category,
        subcategory: cat.subcategory,
        confidence: cat.confidence
      };
    }
  }

  // Check if it's a number
  if (/^\d+$/.test(word) || /^(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)$/i.test(translation)) {
    return {
      category: 'Numbers and Time',
      subcategory: 'Numbers',
      confidence: 0.95
    };
  }

  // Part of speech based categorization
  if (item.part_of_speech) {
    switch (item.part_of_speech.toLowerCase()) {
      case 'verb':
        return {
          category: 'Actions and Verbs',
          subcategory: 'General Verbs',
          confidence: 0.7
        };
      case 'adjective':
        return {
          category: 'Descriptions',
          subcategory: 'Adjectives',
          confidence: 0.7
        };
      case 'noun':
        return {
          category: 'General',
          subcategory: 'Nouns',
          confidence: 0.6
        };
    }
  }

  // Default fallback
  return {
    category: 'General',
    subcategory: 'Uncategorized',
    confidence: 0.4
  };
}
