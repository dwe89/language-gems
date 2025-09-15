import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a crossword puzzle creator. Generate 8-12 words and clues for a crossword puzzle based on the given topic.

Requirements:
- Words should be 3-12 letters long
- Words should be single words (no spaces, hyphens, or special characters)
- Clues should be clear, concise, and educational
- Mix of word lengths for better crossword generation
- Include a variety of common letters (E, T, A, O, I, N, S, H, R)
- Avoid proper nouns unless specifically requested
- Make clues appropriate for educational use

Return ONLY a JSON object with this exact structure:
{
  "words": [
    {"word": "EXAMPLE", "clue": "A sample or illustration"},
    {"word": "ANOTHER", "clue": "One more; additional"}
  ]
}`;

    const userPrompt = `Generate crossword words and clues for the topic: "${prompt}"

Focus on vocabulary that would be useful for language learning or educational purposes. Make sure the words have good letter variety for crossword intersections.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      throw new Error('Invalid JSON response from AI');
    }

    // Validate the response structure
    if (!parsedResponse.words || !Array.isArray(parsedResponse.words)) {
      throw new Error('Invalid response structure from AI');
    }

    // Validate and clean each word
    const validWords = parsedResponse.words
      .filter((item: any) => 
        item.word && 
        item.clue && 
        typeof item.word === 'string' && 
        typeof item.clue === 'string'
      )
      .map((item: any) => ({
        word: item.word.toUpperCase().replace(/[^A-Z]/g, ''),
        clue: item.clue.trim()
      }))
      .filter((item: any) => 
        item.word.length >= 3 && 
        item.word.length <= 15 && 
        item.clue.length > 0
      );

    if (validWords.length < 5) {
      throw new Error('Not enough valid words generated');
    }

    return NextResponse.json({
      words: validWords,
      topic: prompt,
      count: validWords.length
    });

  } catch (error: any) {
    console.error('Error generating crossword words:', error);
    
    // Return a fallback set of words if AI fails
    const fallbackWords = [
      { word: 'LEARN', clue: 'To acquire knowledge or skill' },
      { word: 'STUDY', clue: 'To examine carefully' },
      { word: 'TEACH', clue: 'To give instruction' },
      { word: 'SCHOOL', clue: 'Place of education' },
      { word: 'BOOK', clue: 'Written work for reading' },
      { word: 'READ', clue: 'To look at and understand text' },
      { word: 'WRITE', clue: 'To form letters or words' },
      { word: 'THINK', clue: 'To use one\'s mind' },
    ];

    return NextResponse.json({
      words: fallbackWords,
      topic: prompt,
      count: fallbackWords.length,
      fallback: true,
      error: 'AI generation failed, using fallback words'
    });
  }
}

// Handle preflight requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
