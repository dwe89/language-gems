import { NextRequest, NextResponse } from 'next/server';
import { generateReadingComprehensionHTML } from './generators/reading-comprehension';
import { generateVocabularyPracticeHTML } from './generators/vocabulary-practice';
import { generateCrosswordHTML } from './generators/crossword';
import { generateWordSearchHTML } from './generators/word-search';
import { generateWorksheetHTML } from './generators/standard-worksheet';
import { generateGrammarExercisesHTML } from './generators/grammar-exercises';

// Optimize serverless function bundle size
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const phaseMarks: Array<{ label: string; elapsed: number }> = [];
  const markPhase = (label: string) => {
    const elapsed = Date.now() - startTime;
    phaseMarks.push({ label, elapsed });
    console.log(`⏱️ [HTML API] ${label} @ ${elapsed}ms`);
  };
  const logTimeline = () => {
    console.log('⏱️ [HTML API] Timeline snapshot:', phaseMarks);
  };
  let worksheet: any;
  try {
    console.log('🚀 [HTML API] POST request received at', new Date().toISOString());
    const requestData = await request.json();
    worksheet = requestData.worksheet;
    markPhase('request parsed');
    const options = requestData.options || {};

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
    // Normalize rawContent: in some production environments Postgres/clients may
    // return JSON columns as strings (e.g., text '"{...}"') which breaks
    // the generators that expect an object. Attempt to parse any stringified
    // JSON here and log if parsing occurred.
    if (worksheet?.rawContent && typeof worksheet.rawContent === 'string') {
      console.warn('📌 [HTML API] Normalizing: worksheet.rawContent is a string (stringified JSON). Attempting to JSON.parse it...');
      try {
        worksheet.rawContent = JSON.parse(worksheet.rawContent);
        console.log('📌 [HTML API] Successfully parsed worksheet.rawContent to object');
      } catch (parseError) {
        console.warn('⚠️ [HTML API] Failed to parse worksheet.rawContent string - continuing with original string', parseError);
      }
    }
    if (worksheet?.content?.rawContent && typeof worksheet.content.rawContent === 'string') {
      console.warn('📌 [HTML API] Normalizing: worksheet.content.rawContent is a string. Attempting to JSON.parse it...');
      try {
        worksheet.content.rawContent = JSON.parse(worksheet.content.rawContent);
        console.log('📌 [HTML API] Successfully parsed worksheet.content.rawContent to object');
      } catch (parseError) {
        console.warn('⚠️ [HTML API] Failed to parse worksheet.content.rawContent string - continuing with original string', parseError);
      }
    }

    const hasRawContent = !!worksheet.rawContent || !!(worksheet.content?.rawContent);
    markPhase('normalization complete');

    console.log('🔍 [HTML API] Template detection:');
    console.log('   - template_id:', templateId);
    console.log('   - metadata?.template:', metadataTemplate);
    console.log('   - worksheet.rawContent exists:', !!worksheet.rawContent);
    console.log('   - worksheet.content?.rawContent exists:', !!(worksheet.content?.rawContent));
    console.log('   - hasRawContent (combined):', hasRawContent);
    console.log('   - templateId === "reading_comprehension":', templateId === 'reading_comprehension');
    console.log('   - metadataTemplate === "reading_comprehension":', metadataTemplate === 'reading_comprehension');

    markPhase('template detection logged');

    if (templateId === 'reading_comprehension' || metadataTemplate === 'reading_comprehension') {
      console.log('✅ [HTML API] Using reading comprehension HTML generator');
      markPhase('reading generator start');
      const html = generateReadingComprehensionHTML(worksheet, options);
      const duration = Date.now() - startTime;
      console.log('✅ [HTML API] Reading comprehension HTML generated, length:', html.length, 'in', duration + 'ms');
      markPhase('reading generator complete');
      markPhase('response ready');
      logTimeline();
      return NextResponse.json({ html, generationTime: duration });
    }

    if (templateId === 'vocabulary_practice' || metadataTemplate === 'vocabulary_practice') {
      console.log('✅ [HTML API] Using vocabulary practice HTML generator');
      markPhase('vocab generator start');
      const html = await generateVocabularyPracticeHTML(worksheet, options);
      const duration = Date.now() - startTime;
      console.log('✅ [HTML API] Vocabulary practice HTML generated, length:', html.length, 'in', duration + 'ms');
      markPhase('vocab generator complete');
      markPhase('response ready');
      logTimeline();
      return NextResponse.json({ html, generationTime: duration });
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
      markPhase('grammar generator start');
      const html = generateGrammarExercisesHTML(worksheet, options);
      const duration = Date.now() - startTime;
      console.log('✅ [HTML API] Grammar exercises HTML generated, length:', html.length, 'in', duration + 'ms');
      markPhase('grammar generator complete');
      markPhase('response ready');
      logTimeline();
      return NextResponse.json({ html, generationTime: duration });
    }

    if (templateId === 'word-search' || templateId === 'word_search' || templateId === 'vocabulary_wordsearch' ||
        metadataTemplate === 'word-search' || metadataTemplate === 'word_search' || metadataTemplate === 'vocabulary_wordsearch') {
      console.log('✅ [HTML API] Using word search HTML generator');
      markPhase('word-search generator start');
      const html = generateWordSearchHTML(worksheet, options);
      const duration = Date.now() - startTime;
      console.log('✅ [HTML API] Word search HTML generated, length:', html.length, 'in', duration + 'ms');
      markPhase('word-search generator complete');
      markPhase('response ready');
      logTimeline();
      return NextResponse.json({ html, generationTime: duration });
    }

    if (templateId === 'vocabulary_crossword' || templateId === 'crossword' ||
        metadataTemplate === 'vocabulary_crossword' || metadataTemplate === 'crossword') {
      console.log('✅ [HTML API] Using crossword HTML generator');
      markPhase('crossword generator start');
      const html = generateCrosswordHTML(worksheet, options);
      const duration = Date.now() - startTime;
      console.log('✅ [HTML API] Crossword HTML generated, length:', html.length, 'in', duration + 'ms');
      markPhase('crossword generator complete');
      markPhase('response ready');
      logTimeline();
      return NextResponse.json({ html, generationTime: duration });
    }

    console.log('📝 [HTML API] Using standard worksheet HTML generator');
    // Generate HTML from worksheet content
    markPhase('standard generator start');
    const html = generateWorksheetHTML(worksheet, options);
    const duration = Date.now() - startTime;
    console.log('✅ [HTML API] Standard HTML generated, length:', html.length, 'in', duration + 'ms');
    markPhase('standard generator complete');
    markPhase('response ready');
    logTimeline();

    return NextResponse.json({ html, generationTime: duration });
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('💥 [HTML API] Error generating HTML:', error);
    console.error('💥 [HTML API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('💥 [HTML API] Error details:', {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      worksheetId: worksheet?.id,
      templateId: worksheet?.template_id,
      hasContent: !!worksheet?.content,
      hasRawContent: !!worksheet?.rawContent,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      phaseMarks,
    });
    markPhase('error response ready');
    logTimeline();
    
    return NextResponse.json(
      { 
        error: 'Failed to generate HTML',
        details: error instanceof Error ? error.message : String(error),
        worksheetId: worksheet?.id,
        duration: `${duration}ms`,
      },
      { status: 500 }
    );
  }
}