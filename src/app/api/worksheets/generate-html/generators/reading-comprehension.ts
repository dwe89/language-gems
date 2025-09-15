import { getBaseStyles } from '../shared/base-styles';
import { generateWordSearch, renderWordSearchHTML, generateWordSearchCSS } from '../../../../../utils/wordSearchGenerator';

export function generateReadingComprehensionHTML(worksheet: any): string {
  console.log('🎨 [HTML GENERATOR] Generating reading comprehension HTML for worksheet:', worksheet.title);
  
  // Get raw content from either location
  const rawContent = worksheet.rawContent || worksheet.content?.rawContent;
  
  console.log('🎨 [HTML GENERATOR] Raw content found at worksheet.rawContent:', !!worksheet.rawContent);
  console.log('🎨 [HTML GENERATOR] Raw content found at worksheet.content.rawContent:', !!(worksheet.content?.rawContent));
  console.log('🎨 [HTML GENERATOR] Using rawContent:', !!rawContent);
  
  if (!rawContent) {
    console.error('❌ [HTML GENERATOR] No raw content found for reading comprehension worksheet');
    return createFallbackHTML(worksheet);
  }

  console.log('🎨 [HTML GENERATOR] Raw content keys:', Object.keys(rawContent));

  const { title, subject, topic, difficulty, estimated_time_minutes } = worksheet;
  const instructions = worksheet.content?.instructions || worksheet.instructions || 'Read the text and complete all activities.';

  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        ${getBaseStyles()}
        ${generateWordSearchCSS()}
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${title}</div>
        <div class="subtitle">${subject} • ${topic}</div>
        <div class="meta-info">
            <span>Difficulty: <strong>${difficulty}</strong></span>
            <span>Time: <strong>${estimated_time_minutes || 30} minutes</strong></span>
            <span>Date: <strong>_____________</strong></span>
        </div>
    </div>

    <div class="instructions">
        <strong>Instructions:</strong> ${instructions}
    </div>
`;

  // Add reading passage
  if (rawContent.article_paragraphs_html) {
    html += `
    <div class="section">
        <div class="section-title">${rawContent.article_title || 'Reading Passage'}</div>
        <div class="reading-passage">
            ${rawContent.article_paragraphs_html}
        </div>
    </div>
`;
  }

  // Add multiple choice questions
  if (rawContent.multiple_choice_questions && rawContent.multiple_choice_questions.length > 0) {
    html += generateMultipleChoiceSection(rawContent.multiple_choice_questions);
  }

  // Add true/false questions
  if (rawContent.true_false_questions && rawContent.true_false_questions.length > 0) {
    html += generateTrueFalseSection(rawContent.true_false_questions);
  }

  // Add word hunt
  if (rawContent.word_hunt_words && rawContent.word_hunt_words.length > 0) {
    html += generateWordHuntSection(rawContent.word_hunt_words);
  }

  // Add word search puzzle
  if (rawContent.word_search_words && rawContent.word_search_words.length > 0) {
    html += generateWordSearchSection(rawContent.word_search_words, rawContent.word_search_difficulty || 'medium');
  }

  // Add vocabulary writing
  if (rawContent.vocabulary_writing && rawContent.vocabulary_writing.length > 0) {
    html += generateVocabularyWritingSection(rawContent.vocabulary_writing);
  }

  // Add sentence unscramble
  if (rawContent.unscramble_sentences && rawContent.unscramble_sentences.length > 0) {
    html += generateSentenceUnscrambleSection(rawContent.unscramble_sentences);
  }

  // Add translation sentences
  if (rawContent.translation_sentences && rawContent.translation_sentences.length > 0) {
    html += generateTranslationSection(rawContent.translation_sentences);
  }

  // Add tense detective
  if (rawContent.tense_detective_prompt) {
    html += generateTenseDetectiveSection(rawContent.tense_detective_prompt);
  }

  html += `
</body>
</html>`;

  return html;
}

function generateWordSearchSection(words: string[], difficulty: 'easy' | 'medium' | 'hard' = 'medium'): string {
  try {
    // Generate word search puzzle
    const wordSearch = generateWordSearch({
      words: words.slice(0, 15), // Limit to 15 words for readability
      gridSize: 15,
      maxWords: Math.min(words.length, 15),
      difficulty
    });

    const wordSearchHTML = renderWordSearchHTML(wordSearch);

    return `
    <div class="section">
        <div class="section-title">Word Search</div>
        <p><em>Find the hidden words in the grid below. Words can be horizontal, vertical, or diagonal.</em></p>
        ${wordSearchHTML}
    </div>
`;
  } catch (error) {
    console.error('Error generating word search:', error);
    return `
    <div class="section">
        <div class="section-title">Word Search</div>
        <p><em>Word search puzzle could not be generated. Words to find: ${words.join(', ')}</em></p>
    </div>
`;
  }
}

function generateMultipleChoiceSection(questions: any[]): string {
  let html = `
    <div class="section">
        <h2 class="section-title">Multiple Choice Questions</h2>
        <div class="multiple-choice-grid">
`;

  questions.forEach((question, index) => {
    html += `
            <div class="question">
                <p class="question-number">Question ${index + 1}</p>
                <p class="question-text">${question.question}</p>
                <ul class="options">
`;

    question.options.forEach((option: any) => {
      html += `
                    <li>
                        <input type="checkbox" id="mc_${question.id}_${option.letter}" name="mc_${question.id}" value="${option.letter}">
                        <label for="mc_${question.id}_${option.letter}">${option.letter}. ${option.text}</label>
                    </li>
`;
    });

    html += `
                </ul>
            </div>
`;
  });

  // Add empty question divs if needed for grid layout
  const remainingSlots = 4 - (questions.length % 4);
  if (remainingSlots < 4 && questions.length > 0) {
    for (let i = 0; i < remainingSlots; i++) {
      html += `
            <div class="question">
            </div>
`;
    }
  }

  html += `
        </div>
    </div>
`;

  return html;
}

function generateTrueFalseSection(questions: any[]): string {
  let html = `
    <div class="section">
        <div class="section-title">True or False</div>
        <p><em>Mark each statement as True (T) or False (F).</em></p>
        <div class="true-false-grid">
`;

  questions.forEach((question, index) => {
    html += `
            <div class="question-compact">
                <div class="question-number">${index + 1}.</div>
                <div class="question-text">${question.statement}</div>
                <div class="tf-options">
                    <input type="checkbox" id="tf_${question.id}_true" name="tf_${question.id}" value="true">
                    <label for="tf_${question.id}_true">True</label>
                    <input type="checkbox" id="tf_${question.id}_false" name="tf_${question.id}" value="false">
                    <label for="tf_${question.id}_false">False</label>
                </div>
            </div>
`;
  });

  html += `
        </div>
    </div>
`;

  return html;
}

function generateWordHuntSection(words: any[]): string {
  let html = `
    <div class="section">
        <div class="section-title">Word Hunt</div>
        <p><em>Find the Spanish/French word that matches each English description.</em></p>
        <div class="vocabulary-grid">
`;

  words.forEach((wordItem, index) => {
    html += `
        <div class="matching-item">
            <span>${index + 1}. ${wordItem.word}</span>
            <div class="answer-space"></div>
        </div>
`;
  });

  html += `
        </div>
    </div>
`;

  return html;
}

function generateVocabularyWritingSection(vocabulary: any[]): string {
  let html = `
    <div class="section">
        <div class="section-title">Vocabulary Practice</div>
        <p><em>Write the English meaning for each word.</em></p>
        <div class="vocabulary-grid">
`;

  vocabulary.forEach((vocabItem, index) => {
    html += `
        <div class="matching-item">
            <span>${index + 1}. ${vocabItem.word}</span>
            <div class="answer-space"></div>
        </div>
`;
  });

  html += `
        </div>
    </div>
`;

  return html;
}

function generateSentenceUnscrambleSection(sentences: any[]): string {
  let html = `
    <div class="section">
        <div class="section-title">Sentence Unscramble</div>
        <p><em>Unscramble the words to form correct sentences.</em></p>
`;

  sentences.forEach((sentence, index) => {
    html += `
        <div class="question-compact">
            <div class="question-number">${index + 1}.</div>
            <div class="question-text"><strong>Words:</strong> ${sentence.jumbled_sentence}</div>
            <div class="answer-space" style="min-height: 25px; margin-top: 6px;"></div>
        </div>
`;
  });

  html += `
    </div>
`;

  return html;
}

function generateTranslationSection(sentences: any[]): string {
  let html = `
    <div class="section">
        <div class="section-title">Translation</div>
        <p><em>Translate the following sentences into English.</em></p>
`;

  sentences.forEach((sentence, index) => {
    html += `
        <div class="question-compact">
            <div class="question-number">${index + 1}.</div>
            <div class="question-text">${sentence.sentence}</div>
            <div class="answer-space" style="min-height: 25px; margin-top: 6px;"></div>
        </div>
`;
  });

  html += `
    </div>
`;

  return html;
}

function generateTenseDetectiveSection(prompt: string): string {
  return `
    <div class="section">
        <div class="section-title">Tense Detective</div>
        <div class="question-compact">
            <div class="question-text">${prompt}</div>
            <div class="answer-space" style="min-height: 35px; margin-top: 6px;"></div>
        </div>
    </div>
`;
}

function createFallbackHTML(worksheet: any): string {
  const { title, subject, topic, difficulty, estimated_time_minutes } = worksheet;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        ${getBaseStyles()}
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${title}</div>
        <div class="subtitle">${subject} • ${topic}</div>
        <div class="meta-info">
            <span>Difficulty: <strong>${difficulty}</strong></span>
            <span>Time: <strong>${estimated_time_minutes || 30} minutes</strong></span>
            <span>Date: <strong>_____________</strong></span>
        </div>
    </div>

    <div class="instructions">
        <strong>Instructions:</strong> Complete all activities below.
    </div>

    <div class="section">
        <div class="section-title">Worksheet Content</div>
        <p><em>This worksheet is being generated. Please refresh the page in a moment.</em></p>
    </div>
</body>
</html>`;
}
