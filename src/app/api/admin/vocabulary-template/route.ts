import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create CSV template with headers and example data
    const headers = [
      'word', 'translation', 'language', 'category', 'subcategory',
      'part_of_speech', 'difficulty_level', 'curriculum_level',
      'example_sentence', 'example_translation', 'phonetic',
      'gender', 'irregular_forms', 'synonyms', 'antonyms', 'tags',
      'article', 'base_word'
    ];

    const exampleRows = [
      [
        'bonjour', 'hello', 'fr', 'greetings', 'basic_greetings',
        'interjection', 'beginner', 'KS3,GCSE_Foundation',
        'Bonjour madame!', 'Hello madam!', '/bon.ˈʒuʁ/',
        '', '', 'salut', 'au revoir', 'greeting,basic,polite',
        '', 'bonjour'
      ],
      [
        'le chat', 'cat', 'fr', 'animals', 'pets',
        'noun', 'beginner', 'KS3,GCSE_Foundation',
        'Le chat est mignon.', 'The cat is cute.', '/ʃa/',
        'masculine', 'chats (plural)', 'félin', 'chien', 'animals,pets,basic',
        'le', 'chat'
      ],
      [
        'el perro', 'dog', 'es', 'animals', 'pets',
        'noun', 'beginner', 'KS3,GCSE_Foundation',
        'El perro es muy amigable.', 'The dog is very friendly.', '/ˈpe.ro/',
        'masculine', 'perros (plural)', 'can', 'gato', 'animals,pets,basic',
        'el', 'perro'
      ],
      [
        'estudiar', 'to study', 'es', 'education', 'school_activities',
        'verb', 'intermediate', 'GCSE_Foundation,GCSE_Higher',
        'Necesito estudiar para el examen.', 'I need to study for the exam.', '/es.tu.ˈdjar/',
        '', 'estudio, estudias, estudia...', 'aprender', 'ignorar', 'education,verb,school',
        '', 'estudiar'
      ],
      [
        'das Haus', 'house', 'de', 'home', 'dwelling',
        'noun', 'beginner', 'KS3,GCSE_Foundation',
        'Das ist mein Haus.', 'That is my house.', '/haʊs/',
        'neuter', 'Häuser (plural)', 'Gebäude', 'Straße', 'home,building,basic',
        'das', 'Haus'
      ]
    ];

    // Create CSV content
    const csvLines = [
      headers.join(','),
      ...exampleRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ];

    const csvContent = csvLines.join('\n');

    // Create response with appropriate headers for file download
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="vocabulary_template.csv"',
      },
    });

    return response;

  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    );
  }
}
