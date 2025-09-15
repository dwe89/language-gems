import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface SentenceBuilderColumn {
  title: string;
  items: Array<{
    text: string;
    translation: string;
    group?: 'MASCULINE_SINGULAR' | 'FEMININE_SINGULAR' | 'MASCULINE_PLURAL' | 'FEMININE_PLURAL' | string;
  }>;
}

interface SentenceBuilderWorksheet {
  title: string;
  instructions: string;
  subject: string;
  language: string;
  topic: string;
  columns: SentenceBuilderColumn[];
  exampleSentences: string[];
  difficulty: string;
  estimatedTime: string;
}

// Validation functions
function validateColumnCount(worksheet: SentenceBuilderWorksheet, expectedCount: number): boolean {
  return worksheet.columns.length === expectedCount;
}

function standardizeGroupNames(worksheet: SentenceBuilderWorksheet): SentenceBuilderWorksheet {
  const groupMappings: { [key: string]: string } = {
    'masculine singular': 'MASCULINE_SINGULAR',
    'feminine singular': 'FEMININE_SINGULAR',
    'masculine plural': 'MASCULINE_PLURAL',
    'feminine plural': 'FEMININE_PLURAL',
    'plural': 'PLURAL',
    'singular': 'INVARIABLE',
    'invariable': 'INVARIABLE',
    'gender neutral': 'INVARIABLE'
  };

  worksheet.columns.forEach(column => {
    column.items.forEach(item => {
      if ((item as any).group) {
        const group = (item as any).group.toLowerCase();
        if (groupMappings[group]) {
          (item as any).group = groupMappings[group];
        }
      }
    });
  });

  return worksheet;
}

function validateGenderGroups(worksheet: SentenceBuilderWorksheet): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  const validGroups = ['MASCULINE_SINGULAR', 'FEMININE_SINGULAR', 'MASCULINE_PLURAL', 'FEMININE_PLURAL', 'INVARIABLE', 'PLURAL'];

  // Common gendered words that should have groups
  const genderedWords = ['camisa', 'pantalón', 'falda', 'chaqueta', 'zapatos', 'rojo', 'roja', 'bonito', 'bonita'];

  worksheet.columns.forEach((column, colIndex) => {
    column.items.forEach((item, itemIndex) => {
      const group = (item as any).group;

      // Check if gendered word is missing group
      if (genderedWords.some(word => item.text.includes(word)) && !group) {
        issues.push(`Column ${colIndex + 1}, item ${itemIndex + 1}: "${item.text}" appears to be gendered but missing group`);
      }

      // Check if group format is valid
      if (group && !validGroups.includes(group)) {
        issues.push(`Column ${colIndex + 1}, item ${itemIndex + 1}: Invalid group "${group}" for "${item.text}"`);
      }
    });
  });

  return { isValid: issues.length === 0, issues };
}

function organizeItemsByGender(worksheet: SentenceBuilderWorksheet): SentenceBuilderWorksheet {
  const genderOrder = ['MASCULINE_SINGULAR', 'FEMININE_SINGULAR', 'MASCULINE_PLURAL', 'FEMININE_PLURAL', 'INVARIABLE', 'PLURAL'];

  worksheet.columns.forEach(column => {
    // Sort items by gender group
    column.items.sort((a, b) => {
      const groupA = (a as any).group || 'INVARIABLE';
      const groupB = (b as any).group || 'INVARIABLE';

      const indexA = genderOrder.indexOf(groupA);
      const indexB = genderOrder.indexOf(groupB);

      // If group not found, put at end
      const orderA = indexA === -1 ? 999 : indexA;
      const orderB = indexB === -1 ? 999 : indexB;

      return orderA - orderB;
    });
  });

  return worksheet;
}

function getTopicGenderRequirements(topic: string): string {
  const requirements: { [key: string]: string } = {
    'school_education': 'MANDATORY: Include gendered school supplies (la mochila, el cuaderno, las tijeras, los lápices), subjects (las matemáticas, el inglés, la historia), classroom objects (la pizarra, el escritorio), and descriptive adjectives with ALL gender forms.',
    'sports_activities': 'MANDATORY: Include gendered sports equipment (la pelota, el balón, las zapatillas, los guantes), clothing (la camiseta, el pantalón, las medias), sports venues (la piscina, el gimnasio), and descriptive adjectives with ALL gender forms.',
    'weather_seasons': 'MANDATORY: Include seasonal clothing (la chaqueta, el abrigo, las botas, los guantes), weather phenomena (la lluvia, el viento, las nubes), seasonal activities (la natación, el esquí), and descriptive adjectives with ALL gender forms.',
    'food_cooking': 'MANDATORY: Include gendered food items (la manzana, el pollo, las verduras, los huevos), cooking utensils (la sartén, el cuchillo, las cucharas), and descriptive adjectives with ALL gender forms.',
    'clothing_appearance': 'MANDATORY: Include clothing items with articles (una camisa, un pantalón, unas faldas, unos zapatos), colors with ALL gender forms (rojo/roja/rojos/rojas), and descriptive adjectives with ALL gender forms.',
    'house_home': 'MANDATORY: Include rooms and furniture (la cocina, el dormitorio, las ventanas, los muebles), household items (la mesa, el sofá, las cortinas), and descriptive adjectives with ALL gender forms.',
    'family_relationships': 'MANDATORY: Include family members (la madre, el padre, las hermanas, los abuelos), relationship descriptors (la esposa, el marido), and descriptive adjectives with ALL gender forms.',
    'travel_transportation': 'MANDATORY: Include vehicles (la bicicleta, el coche, las motos, los autobuses), destinations (la playa, el hotel, las montañas), and descriptive adjectives with ALL gender forms.',
    'animals_pets': 'MANDATORY: Include animals (la gata, el perro, las vacas, los pájaros), animal features (la cola, el pelo, las patas), and descriptive adjectives with ALL gender forms.',
    'colors_descriptions': 'MANDATORY: Include objects to describe (la casa, el coche, las flores, los libros), colors with ALL gender forms (azul/azules, rojo/roja/rojos/rojas), and descriptive adjectives with ALL gender forms.'
  };

  return requirements[topic] || 'Include a variety of gendered nouns and adjectives with proper gender agreement forms.';
}

function getTopicSpecificExample(topic: string): string {
  const examples: { [key: string]: string } = {
    'clothing_appearance': `For CLOTHING topic - ALL FEMININE SINGULAR:
Column 1: "una camisa", "una falda", "una chaqueta" (all feminine singular)
Column 2: "roja", "azul", "negra" (all feminine singular to match)
Column 3: "bonita", "elegante", "nueva" (all feminine singular to match)
Result: "una camisa roja bonita" ✅`,

    'food_cooking': `For FOOD topic - ALL FEMININE SINGULAR:
Column 1: "la pizza", "la manzana", "la ensalada" (all feminine singular)
Column 2: "está", "parece", "sabe" (verbs work with all)
Column 3: "deliciosa", "fresca", "sabrosa" (all feminine singular to match)
Result: "la pizza está deliciosa" ✅`,

    'school_education': `For SCHOOL topic - ALL FEMININE SINGULAR:
Column 1: "la clase", "la tarea", "la escuela" (all feminine singular)
Column 2: "es", "está", "parece" (verbs work with all)
Column 3: "difícil", "interesante", "importante" (invariable adjectives)
Result: "la clase es difícil" ✅`,

    'sports_activities': `For SPORTS topic - ALL MASCULINE SINGULAR:
Column 1: "el fútbol", "el tenis", "el baloncesto" (all masculine singular)
Column 2: "es", "está", "parece" (verbs work with all)
Column 3: "divertido", "difícil", "popular" (all masculine singular to match)
Result: "el fútbol es divertido" ✅`,

    'house_home': `For HOME topic - ALL FEMININE SINGULAR:
Column 1: "la casa", "la cocina", "la habitación" (all feminine singular)
Column 2: "es", "está", "parece" (verbs work with all)
Column 3: "grande", "pequeña", "bonita" (grande invariable, others feminine)
Result: "la casa es grande" ✅`,

    'family_relationships': `For FAMILY topic - MIXED WITH INVARIABLE ADJECTIVES:
Column 1: "mi madre", "mi padre", "mi hermana" (mixed genders OK)
Column 2: "es", "está", "parece" (verbs work with all)
Column 3: "inteligente", "amable", "divertido/a" (use invariable only)
Result: "mi madre es inteligente" ✅`
  };

  return examples[topic] || `For ${topic.toUpperCase()} topic - ALL FEMININE SINGULAR:
Column 1: Choose feminine singular nouns related to ${topic}
Column 2: Use verbs or invariable words
Column 3: Use feminine singular adjectives to match Column 1
Result: Every combination will work grammatically ✅`;
}

function generatePatternBasedPrompt(selectedPattern: any, settings: any, topic: string, language: string): string {
  const columnCount = settings.columnCount || selectedPattern.columns.length;

  return `Create a Spanish sentence builder worksheet about ${topic}.

IGNORE the database pattern - use this EXACT structure instead:

Column 1 Title: "Subject/Object"
Column 1 Items: ONLY "Me gusta", "Te gusta", "Le gusta", "Nos gusta", "Os gusta", "Les gusta"

Column 2 Title: "Activity/Object"
Column 2 Items: ONLY infinitive verbs or nouns that work after "gusta" and relate to ${topic}

Column 3 Title: "Reason/Time"
Column 3 Items: ONLY phrases that work at the end: "mucho", "poco", "por la mañana", "los fines de semana", "en casa", "con amigos"

This creates sentences like:
- "Me gusta [activity] mucho" ✅
- "Te gusta [activity] por la mañana" ✅
- "Nos gusta [activity] los fines de semana" ✅

EVERY combination will work because:
- "gusta" works with any subject (me/te/le/nos/os/les)
- Infinitives and nouns work after "gusta"
- Time/reason phrases work at the end

Adapt the vocabulary in columns 2 and 3 to match ${topic}, but keep the "Me gusta" structure in column 1.

Format as JSON with this structure:
{
  "title": "${topic} preferences",
  "instructions": "Use words from each column to build complete sentences about your preferences.",
  "columns": [
    {
      "title": "column name",
      "items": [
        {
          "text": "Spanish text",
          "translation": "English translation",
          "group": "INVARIABLE"
        }
      ]
    }
  ],
  "exampleSentences": ["Me gusta [example] mucho", "Te gusta [example] por la mañana"],
  "difficulty": "intermediate",
  "estimatedTime": "20-30 minutes"
}`;
}

function generateFallbackPrompt(settings: any, topic: string, language: string, title?: string, instructions?: string, customPrompt?: string): string {
  return `Create a Spanish sentence builder worksheet about ${topic}.

Use this EXACT structure - do not change the pattern:

Column 1 Title: "Subject/Object"
Column 1 Items: ONLY "Me gusta", "Te gusta", "Le gusta", "Nos gusta", "Os gusta", "Les gusta"

Column 2 Title: "Activity/Object"
Column 2 Items: ONLY infinitive verbs or nouns that work after "gusta": "leer", "estudiar", "jugar", "cocinar", "la música", "el deporte"

Column 3 Title: "Reason/Time"
Column 3 Items: ONLY phrases that work at the end: "mucho", "poco", "por la mañana", "los fines de semana", "en casa", "con amigos"

This creates sentences like:
- "Me gusta leer mucho" ✅
- "Te gusta la música por la mañana" ✅
- "Nos gusta cocinar los fines de semana" ✅

EVERY combination will work because:
- "gusta" works with any subject (me/te/le/nos/os/les)
- Infinitives and nouns work after "gusta"
- Time/reason phrases work at the end

Adapt the vocabulary in columns 2 and 3 to match ${topic}, but keep the "Me gusta" structure in column 1.

🔥 DESIGN STRATEGIES:

**Strategy 1: Same Gender/Number Throughout**
- All nouns masculine singular → all adjectives masculine singular
- All nouns feminine plural → all adjectives feminine plural

**Strategy 2: Use Invariable Adjectives**
- Nouns: "una camisa", "un pantalón" (mixed genders)
- Adjectives: "elegante", "interesante", "grande" (work with any gender)

**Strategy 3: Separate Sentence Structures**
- Column 1: "Me gusta" (I like)
- Column 2: "la pizza", "el chocolate" (mixed genders OK after "gusta")
- Column 3: "porque es", "cuando está"
- Column 4: "deliciosa", "caliente" (context makes gender clear)

**NEVER MIX INCOMPATIBLE GENDERS IN THE SAME SENTENCE STRUCTURE**

🚨 CRITICAL REQUIREMENT #2: EXACT COLUMN COUNT
Create EXACTLY ${settings.columnCount || 4} columns - no more, no less.

🚨 CRITICAL REQUIREMENT #3: COMPATIBLE GENDER STRATEGY
Choose ONE of these strategies and stick to it:

**FOR CLOTHING TOPIC - USE STRATEGY A (Same Gender Throughout):**

❌ WRONG - DO NOT DO THIS:
Column 1: "una camisa" (fem), "un pantalón" (masc)
Column 2: "roja" (fem), "rojo" (masc)
Result: Students can pick "una camisa rojo" ❌

✅ CORRECT - DO THIS INSTEAD:
Column 1: "una camisa", "una falda", "una chaqueta" (ALL feminine singular)
Column 2: "roja", "azul", "negra" (ALL feminine singular to match Column 1)
Column 3: "bonita", "elegante", "nueva" (ALL feminine singular to match)
Result: ANY combination works: "una camisa roja bonita" ✅

**OR use Strategy B (Invariable Adjectives):**
Column 1: "una camisa", "un pantalón", "unos zapatos" (mixed genders OK)
Column 2: "elegante", "grande", "pequeño" (invariable or context-appropriate)
Column 3: "muy", "bastante", "poco" (adverbs work with anything)

**CRITICAL: Pick ONE strategy and stick to it. Do not mix strategies.**

🎯 SENTENCE STRUCTURE EXAMPLES FOR ${topic}:

For 3 columns: [Subject/Time] + [Verb + Object] + [Description/Location]
For 4 columns: [Subject] + [Verb] + [Object] + [Description/Time]
For 5 columns: [Time] + [Subject] + [Verb] + [Object] + [Description/Location]

🎯 TOPIC-SPECIFIC REQUIREMENTS:
${getTopicGenderRequirements(topic)}

🚨 MANDATORY VALIDATION CHECKLIST:
1. Pick ANY item from Column 1 + ANY item from Column 2 + ANY item from Column 3 + ANY item from Column 4
2. Does this combination create a grammatically correct sentence? ✅
3. Test at least 5 random combinations - do they ALL work? ✅
4. Are there NO gender mismatches (like "una camisa rojo")? ✅
5. Does every sentence make logical sense for the topic? ✅

**If ANY combination fails, redesign the columns using one of the strategies above**

${customPrompt ? `ADDITIONAL INSTRUCTIONS: ${customPrompt}` : ''}

Format as JSON with this structure:
{
  "title": "worksheet title",
  "instructions": "student instructions",
  "columns": [
    {
      "title": "column name",
      "items": [
        {
          "text": "Spanish text",
          "translation": "English translation",
          "group": "MASCULINE_SINGULAR|FEMININE_SINGULAR|MASCULINE_PLURAL|FEMININE_PLURAL|INVARIABLE"
        }
      ]
    }
  ],
  "exampleSentences": ["3-4 example sentences showing valid combinations"],
  "difficulty": "intermediate",
  "estimatedTime": "20-30 minutes"
}`;
}

function fixSpanishContractions(worksheet: SentenceBuilderWorksheet): SentenceBuilderWorksheet {
  worksheet.columns.forEach(column => {
    column.items.forEach(item => {
      // Fix "a el" -> "al"
      item.text = item.text.replace(/\ba el\b/g, 'al');
      // Fix "de el" -> "del"
      item.text = item.text.replace(/\bde el\b/g, 'del');
    });
  });

  // Also fix example sentences
  worksheet.exampleSentences = worksheet.exampleSentences.map(sentence =>
    sentence.replace(/\ba el\b/g, 'al').replace(/\bde el\b/g, 'del')
  );

  return worksheet;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received sentence builder request:', body);

    const {
      subject = 'spanish',
      title = 'Sentence Builder Worksheet',
      instructions = 'Use the words and phrases from each column to build complete sentences.',
      topic = 'General',
      customVocabulary = '',
      customPrompt = '',
      curriculumLevel = 'KS3',
      examBoard,
      tier,
      category,
      subcategory,
      settings = {},
      language = 'es'
    } = body;

    // Get vocabulary words if a category is selected
    let vocabularyWords: string[] = [];
    if (category) {
      try {
        const vocabResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('/rest/v1', '')}/api/vocabulary/words?curriculumLevel=${curriculumLevel}&categoryId=${category}&subcategoryId=${subcategory || ''}&examBoard=${examBoard || ''}&tier=${tier || ''}`, {
          method: 'GET',
        });
        
        if (vocabResponse.ok) {
          const vocabResult = await vocabResponse.json();
          vocabularyWords = vocabResult.words || [];
          console.log(`Retrieved ${vocabularyWords.length} vocabulary words for category: ${category}`);
        }
      } catch (error) {
        console.warn('Failed to fetch vocabulary words:', error);
      }
    }

    // Prepare the AI prompt
    const languageNames: { [key: string]: string } = {
      'es': 'Spanish',
      'fr': 'French', 
      'de': 'German',
      'en': 'English'
    };

    const languageName = languageNames[language] || 'Spanish';
    const vocabularyContext = vocabularyWords.length > 0 
      ? `Use vocabulary from this list: ${vocabularyWords.slice(0, 30).join(', ')}`
      : customVocabulary 
        ? `Use this custom vocabulary: ${customVocabulary}`
        : `Use vocabulary related to: ${topic}`;

    // This section is now handled by the new hybrid system below

    // PHASE 1: Check for database pattern first
    console.log('Checking for database pattern for topic:', topic);
    let selectedPattern = null;
    let useAIFallback = true;

    try {
      const { data: patterns, error } = await supabase
        .from('sentence_patterns')
        .select('pattern_name, columns_json, example_sentences')
        .eq('topic', topic)
        .eq('language_code', language);

      if (error) {
        console.error('Error fetching patterns from Supabase:', error);
      } else if (patterns && patterns.length > 0) {
        // Found database pattern(s) - select one randomly for variety
        const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
        selectedPattern = {
          name: randomPattern.pattern_name,
          columns: randomPattern.columns_json,
          examples: randomPattern.example_sentences || []
        };
        useAIFallback = false;
        console.log('✅ Found database pattern:', selectedPattern.name);
      } else {
        console.log('⚠️ No database pattern found for topic:', topic, '- using AI fallback');
      }
    } catch (patternError) {
      console.error('Error in pattern lookup:', patternError);
      console.log('Continuing with AI fallback...');
    }

    // PHASE 2: Generate AI prompt based on pattern or fallback
    const promptContent = selectedPattern
      ? generatePatternBasedPrompt(selectedPattern, settings, topic, language)
      : generateFallbackPrompt(settings, topic, language, title, instructions, customPrompt);

    console.log('Sending request to OpenAI...');

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: 'You are an expert language teacher creating educational worksheets. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: promptContent
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI response received, parsing...');
    
    let worksheetData: SentenceBuilderWorksheet;
    try {
      worksheetData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Invalid JSON response from AI');
    }

    // Enhance the worksheet data
    let enhancedWorksheet: SentenceBuilderWorksheet = {
      title: title || worksheetData.title,
      instructions: instructions || worksheetData.instructions,
      subject: subject,
      language: language,
      topic: topic,
      columns: worksheetData.columns || [],
      exampleSentences: worksheetData.exampleSentences || [],
      difficulty: settings.sentenceComplexity || 'intermediate',
      estimatedTime: worksheetData.estimatedTime || '15-20 minutes'
    };

    // PHASE 2: POST-PROCESSING VALIDATION & FIXES
    console.log('Applying post-processing validation...');

    // 1. Validate column count - STRICT ENFORCEMENT
    const expectedColumnCount = settings.columnCount || 4;
    if (!validateColumnCount(enhancedWorksheet, expectedColumnCount)) {
      console.error(`🚨 CRITICAL: Column count mismatch! Expected ${expectedColumnCount}, got ${enhancedWorksheet.columns.length}`);
      console.error('AI ignored column count constraint. This is a validation failure.');

      // For now, we'll continue but log the error prominently
      // In a future version, we could retry the AI call or return an error
      console.error(`🔧 WORKAROUND: Truncating to first ${expectedColumnCount} columns`);
      enhancedWorksheet.columns = enhancedWorksheet.columns.slice(0, expectedColumnCount);
    }

    // 2. Standardize group names
    enhancedWorksheet = standardizeGroupNames(enhancedWorksheet);

    // 3. Organize items by gender groups within columns
    enhancedWorksheet = organizeItemsByGender(enhancedWorksheet);

    // 4. Validate gender groups
    const genderValidation = validateGenderGroups(enhancedWorksheet);
    if (!genderValidation.isValid) {
      console.warn('Gender group validation issues:', genderValidation.issues);
      // Log issues but continue - the standardization above should fix most problems
    }

    // 5. Fix Spanish contractions
    enhancedWorksheet = fixSpanishContractions(enhancedWorksheet);

    console.log('Post-processing complete. Final column count:', enhancedWorksheet.columns.length);

    // Save to database
    let savedWorksheetId = null;
    try {
      const { data, error } = await supabase
        .from('worksheets')
        .insert({
          title: enhancedWorksheet.title,
          subject: subject,
          topic: topic,
          difficulty: enhancedWorksheet.difficulty,
          template_id: 'sentence_builder',
          content: {
            worksheet_data: enhancedWorksheet,
            columns: enhancedWorksheet.columns,
            instructions: enhancedWorksheet.instructions,
            example_sentences: enhancedWorksheet.exampleSentences
          },
          user_id: null, // For now, allow anonymous saves
          generation_params: {
            curriculumLevel,
            examBoard,
            tier,
            category,
            subcategory,
            settings,
            language
          }
        })
        .select('id')
        .single();

      if (!error && data) {
        savedWorksheetId = data.id;
        console.log('Sentence builder worksheet saved with ID:', savedWorksheetId);
      }
    } catch (saveError) {
      console.warn('Failed to save worksheet to database:', saveError);
      // Continue without saving - not critical
    }

    console.log(`Generated sentence builder worksheet with ${enhancedWorksheet.columns.length} columns`);

    return NextResponse.json({
      success: true,
      worksheet: enhancedWorksheet,
      worksheetId: savedWorksheetId,
      topic: topic,
      pattern_used: selectedPattern ? selectedPattern.name : 'AI_FALLBACK',
      stats: {
        columnCount: enhancedWorksheet.columns.length,
        totalItems: enhancedWorksheet.columns.reduce((sum, col) => sum + col.items.length, 0),
        difficulty: enhancedWorksheet.difficulty,
        estimatedTime: enhancedWorksheet.estimatedTime,
        genderGroups: [...new Set(enhancedWorksheet.columns.flatMap((col: any) => col.items.map((item: any) => item.group || 'none')))]
      }
    });

  } catch (error: any) {
    console.error('Error generating sentence builder worksheet:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate sentence builder worksheet',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
