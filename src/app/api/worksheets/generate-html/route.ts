import { NextRequest, NextResponse } from 'next/server';
import { generateReadingComprehensionHTML } from './generators/reading-comprehension';
import { generateVocabularyPracticeHTML } from './generators/vocabulary-practice';
import { generateCrosswordHTML } from './generators/crossword';
import { generateWorksheetHTML } from './generators/standard-worksheet';
import { generateGrammarExercisesHTML } from './generators/grammar-exercises';

// Optimize serverless function bundle size
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 [HTML API] POST request received');
    const { worksheet, options = {} } = await request.json();

    if (!worksheet) {
      console.error('❌ [HTML API] No worksheet data provided');
      return NextResponse.json(
        { error: 'Worksheet data is required' },
        { status: 400 }
      );
    }

    console.log('📋 [HTML API] Received worksheet for HTML generation');
    console.log('📋 [HTML API] Canva-friendly mode:', options.canvaFriendly || false);
    console.log('📋 [HTML API] Worksheet keys:', Object.keys(worksheet));
    console.log('📋 [HTML API] Worksheet ID:', worksheet.id);
    console.log('📋 [HTML API] Worksheet title:', worksheet.title);
    console.log('📋 [HTML API] Template ID:', worksheet.template_id);
    console.log('📋 [HTML API] Subject:', worksheet.subject);
    console.log('📋 [HTML API] Has content:', !!worksheet.content);
    console.log('📋 [HTML API] Has rawContent:', !!worksheet.rawContent);
    console.log('📋 [HTML API] Has metadata:', !!worksheet.metadata);

    // Log detailed structure for vocabulary practice
    if (worksheet.template_id === 'vocabulary_practice' || worksheet.metadata?.template === 'vocabulary_practice') {
      console.log('🎯 [VOCAB PRACTICE API] Detected vocabulary practice worksheet');
      console.log('🎯 [VOCAB PRACTICE API] Content structure:', {
        contentKeys: Object.keys(worksheet.content || {}),
        rawContentKeys: Object.keys(worksheet.rawContent || {}),
        hasVocabularyItems: !!(worksheet.content?.vocabulary_items || worksheet.rawContent?.vocabulary_items),
        hasExercises: !!(worksheet.content?.exercises || worksheet.rawContent?.exercises),
        hasWordBank: !!(worksheet.content?.word_bank || worksheet.rawContent?.word_bank)
      });
    }

    // Check if this is a reading comprehension worksheet
    const templateId = worksheet.template_id;
    const metadataTemplate = worksheet.metadata?.template;
    const hasRawContent = !!worksheet.rawContent || !!(worksheet.content?.rawContent);

    console.log('🔍 [HTML API] Template detection:');
    console.log('   - template_id:', templateId);
    console.log('   - metadata?.template:', metadataTemplate);
    console.log('   - worksheet.rawContent exists:', !!worksheet.rawContent);
    console.log('   - worksheet.content?.rawContent exists:', !!(worksheet.content?.rawContent));
    console.log('   - hasRawContent (combined):', hasRawContent);
    console.log('   - templateId === "reading_comprehension":', templateId === 'reading_comprehension');
    console.log('   - metadataTemplate === "reading_comprehension":', metadataTemplate === 'reading_comprehension');

    if (templateId === 'reading_comprehension' || metadataTemplate === 'reading_comprehension') {
      console.log('✅ [HTML API] Using reading comprehension HTML generator');
      const html = generateReadingComprehensionHTML(worksheet, options);
      console.log('✅ [HTML API] Reading comprehension HTML generated, length:', html.length);
      return NextResponse.json({ html });
    }

    if (templateId === 'vocabulary_practice' || metadataTemplate === 'vocabulary_practice') {
      console.log('✅ [HTML API] Using vocabulary practice HTML generator');
      const html = await generateVocabularyPracticeHTML(worksheet, options);
      console.log('✅ [HTML API] Vocabulary practice HTML generated, length:', html.length);
      return NextResponse.json({ html });
    }

    if (templateId === 'grammar_exercises' || metadataTemplate === 'grammar_exercises') {
      console.log('✅ [HTML API] Using grammar exercises HTML generator');
      console.log('📊 [HTML API] worksheet.content:', typeof worksheet.content);
      console.log('📊 [HTML API] worksheet.content.rawContent:', typeof worksheet.content?.rawContent);
      console.log('📊 [HTML API] worksheet.rawContent:', typeof worksheet.rawContent);
      if (worksheet.content) {
        console.log('📊 [HTML API] content keys:', Object.keys(worksheet.content));
        if (worksheet.content.rawContent) {
          console.log('📊 [HTML API] content.rawContent keys:', Object.keys(worksheet.content.rawContent));
          console.log('📊 [HTML API] content.rawContent.exercises:', Array.isArray(worksheet.content.rawContent.exercises), worksheet.content.rawContent.exercises?.length || 0);
        }
      }
      const html = generateGrammarExercisesHTML(worksheet, options);
      console.log('✅ [HTML API] Grammar exercises HTML generated, length:', html.length);
      return NextResponse.json({ html });
    }

    if (templateId === 'vocabulary_crossword' || templateId === 'vocabulary_wordsearch' ||
        templateId === 'crossword' || templateId === 'word_search' ||
        metadataTemplate === 'vocabulary_crossword' || metadataTemplate === 'vocabulary_wordsearch' ||
        metadataTemplate === 'crossword' || metadataTemplate === 'word_search') {
      console.log('✅ [HTML API] Using crossword HTML generator');
      const html = generateCrosswordHTML(worksheet, options);
      console.log('✅ [HTML API] Crossword HTML generated, length:', html.length);
      return NextResponse.json({ html });
    }

    console.log('📝 [HTML API] Using standard worksheet HTML generator');
    // Generate HTML from worksheet content
    const html = generateWorksheetHTML(worksheet, options);
    console.log('✅ [HTML API] Standard HTML generated, length:', html.length);

    return NextResponse.json({ html });
  } catch (error) {
    console.error('💥 [HTML API] Error generating HTML:', error);
    return NextResponse.json(
      { error: 'Failed to generate HTML' },
      { status: 500 }
    );
  }
}