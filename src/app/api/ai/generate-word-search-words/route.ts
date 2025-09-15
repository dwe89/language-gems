import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { 
      prompt, 
      category, 
      subcategory, 
      language = 'spanish',
      curriculumLevel = 'KS3',
      wordCount = 12 
    } = await request.json();

    if (!prompt && !category) {
      return NextResponse.json(
        { error: 'Either prompt or category is required' },
        { status: 400 }
      );
    }

    // Create language-specific prompts
    const languageMap: { [key: string]: { name: string; example: string } } = {
      'es': { name: 'Spanish', example: 'CASA, PERRO, GATO' },
      'fr': { name: 'French', example: 'MAISON, CHIEN, CHAT' },
      'de': { name: 'German', example: 'HAUS, HUND, KATZE' },
      'en': { name: 'English', example: 'HOUSE, DOG, CAT' }
    };

    const langInfo = languageMap[language] || languageMap['es'];

    const systemPrompt = `You are a ${langInfo.name} language teacher creating word search puzzles for ${curriculumLevel} students.

Generate ${wordCount} ${langInfo.name} words suitable for a word search puzzle.

Requirements:
- Words should be 3-12 letters long
- Words should be single words (no spaces, hyphens, or special characters)
- Use only letters from the ${langInfo.name} alphabet
- Words should be appropriate for ${curriculumLevel} level students
- Mix of word lengths for better puzzle generation
- Include common vocabulary that students would recognize
- Avoid proper nouns unless specifically requested
- Make words educational and relevant to the topic

Return ONLY a JSON object with this exact structure:
{
  "words": ["WORD1", "WORD2", "WORD3"],
  "language": "${language}",
  "topic": "topic name"
}`;

    let userPrompt = '';
    if (category) {
      const categoryName = category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
      const subcategoryText = subcategory ? ` (specifically ${subcategory.replace(/_/g, ' ')})` : '';
      userPrompt = `Generate ${wordCount} ${langInfo.name} words for the vocabulary category: "${categoryName}"${subcategoryText}

The words should be suitable for ${curriculumLevel} students learning ${langInfo.name}.`;
    } else {
      userPrompt = `Generate ${wordCount} ${langInfo.name} words for: "${prompt}"

The words should be suitable for ${curriculumLevel} students learning ${langInfo.name}.`;
    }

    console.log('Generating word search words with prompt:', userPrompt);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from AI');
    }

    console.log('AI Response:', content);

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the response structure
    if (!parsedResponse.words || !Array.isArray(parsedResponse.words)) {
      throw new Error('Invalid response structure from AI');
    }

    // Validate and clean each word
    const validWords = parsedResponse.words
      .filter((word: any) => 
        word && 
        typeof word === 'string'
      )
      .map((word: string) => word.toUpperCase().replace(/[^A-ZÁÉÍÓÚÜÑÇ]/g, ''))
      .filter((word: string) => 
        word.length >= 3 && 
        word.length <= 15
      );

    if (validWords.length < 5) {
      throw new Error('Not enough valid words generated');
    }

    const topicName = category ? 
      category.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 
      (prompt || 'Custom Vocabulary');

    return NextResponse.json({
      words: validWords.slice(0, wordCount),
      language: langInfo.name,
      languageCode: language,
      topic: topicName,
      category,
      subcategory,
      count: validWords.length
    });

  } catch (error: any) {
    console.error('Error generating word search words:', error);
    
    // Return a fallback set of words based on language
    const fallbackWords: { [key: string]: string[] } = {
      'es': ['CASA', 'PERRO', 'GATO', 'AGUA', 'COMIDA', 'FAMILIA', 'ESCUELA', 'LIBRO', 'AMIGO', 'TIEMPO'],
      'fr': ['MAISON', 'CHIEN', 'CHAT', 'EAU', 'NOURRITURE', 'FAMILLE', 'ECOLE', 'LIVRE', 'AMI', 'TEMPS'],
      'de': ['HAUS', 'HUND', 'KATZE', 'WASSER', 'ESSEN', 'FAMILIE', 'SCHULE', 'BUCH', 'FREUND', 'ZEIT'],
      'en': ['HOUSE', 'DOG', 'CAT', 'WATER', 'FOOD', 'FAMILY', 'SCHOOL', 'BOOK', 'FRIEND', 'TIME']
    };

    const languageMap: { [key: string]: string } = {
      'es': 'Spanish',
      'fr': 'French', 
      'de': 'German',
      'en': 'English'
    };

    const fallback = fallbackWords[language] || fallbackWords['es'];
    const langName = languageMap[language] || 'Spanish';

    return NextResponse.json({
      words: fallback,
      language: langName,
      languageCode: language,
      topic: 'Basic Vocabulary',
      count: fallback.length,
      fallback: true,
      error: 'AI generation failed, using fallback words'
    });
  }
}
