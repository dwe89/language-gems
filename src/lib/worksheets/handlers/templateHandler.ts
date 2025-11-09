import { OpenAI } from 'openai';
import { WorksheetHandler } from '../core/baseHandler';
import { WorksheetRequest, WorksheetResponse, Worksheet } from '../core/types';
import { CentralizedVocabularyService } from '@/services/centralizedVocabularyService';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export class TemplateHandler extends WorksheetHandler {
  private vocabularyService: CentralizedVocabularyService;

  constructor(openai: OpenAI) {
    super(openai);
    
    // Initialize Supabase client for vocabulary service
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    this.vocabularyService = new CentralizedVocabularyService(supabase);
  }

  async generateWorksheet(request: WorksheetRequest): Promise<WorksheetResponse> {
    const jobId = request.jobId;
    if (!jobId) {
      throw new Error('Job ID is required for template-based generation');
    }

    this.updateJobProgress(jobId, 'promptGeneration', 20, 'Processing template configuration');

    const templateId = request.template;
    if (!templateId) {
      throw new Error('Template ID is required for template-based generation');
    }

    // Get vocabulary if needed for language subjects (NOT for grammar_exercises)
    let vocabularyWords: any[] = [];
    console.log(`[TemplateHandler] Checking if ${request.subject} is a language subject: ${this.isLanguageSubject(request.subject)}`);
    console.log(`[TemplateHandler] Template ID: ${templateId}`);
    console.log(`[TemplateHandler] Custom vocabulary provided: ${!!request.customVocabulary}`);
    
    if (this.isLanguageSubject(request.subject) && !request.customVocabulary && templateId !== 'grammar_exercises') {
      console.log(`[TemplateHandler] Fetching vocabulary for ${request.subject} (original: ${request.originalSubject})`);
      vocabularyWords = await this.getVocabularyForTemplate(request);
      console.log(`[TemplateHandler] Retrieved ${vocabularyWords.length} vocabulary words`);
    }

    this.updateJobProgress(jobId, 'promptGeneration', 30, 'Building template-specific prompt');

    // Generate template-specific prompt
    const prompt = this.buildTemplatePrompt(request, templateId, vocabularyWords);

    this.updateJobProgress(jobId, 'aiProcessing', 50, 'Generating worksheet with AI');

    try {
      console.log('Sending request to OpenAI with prompt length:', prompt.length);
      console.log('System prompt:', this.getSystemPrompt(templateId).substring(0, 200) + '...');

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4.1-nano', 
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(templateId)
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_completion_tokens: 8000
      });

      console.log('OpenAI response:', {
        choices: completion.choices?.length,
        firstChoice: completion.choices[0]?.message?.content?.substring(0, 200) + '...',
        finishReason: completion.choices[0]?.finish_reason,
        usage: completion.usage
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        console.error('Empty response from OpenAI:', {
          message: completion.choices[0]?.message,
          finishReason: completion.choices[0]?.finish_reason,
          usage: completion.usage
        });
        throw new Error('No content received from OpenAI');
      }

      // Parse the JSON response robustly. Models sometimes return prose + JSON or
      // include trailing commas / code fences. Try multiple heuristics before
      // failing so generation is more resilient.
      let worksheetData;
      const rawAIContent = content;
      try {
        worksheetData = JSON.parse(rawAIContent);
      } catch (initialParseError) {
        console.warn('Initial JSON.parse failed; attempting to extract JSON block from AI response.');
        console.warn('Raw AI content (truncated 1k):', rawAIContent.substring(0, 1000));

        // 1) Try to extract fenced JSON ```json ... ``` blocks
        const fencedMatch = rawAIContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        let candidate: string | null = fencedMatch && fencedMatch[1] ? fencedMatch[1].trim() : null;

        // 2) If no fenced block, try to extract the first { ... } JSON-like substring
        if (!candidate) {
          const firstBrace = rawAIContent.indexOf('{');
          const lastBrace = rawAIContent.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            candidate = rawAIContent.substring(firstBrace, lastBrace + 1);
          }
        }

        // 3) If we found a candidate, try to clean common issues (trailing commas, comments)
        if (candidate) {
          let cleaned = candidate
            // Remove single-line comments (// ...)
            .replace(/\/\/[^\n]*/g, '')
            // Remove multi-line comments (/* ... */)
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // Remove trailing commas before } or ]
            .replace(/,\s*(?=[}\]])/g, '');
          
          try {
            worksheetData = JSON.parse(cleaned);
            console.log('Parsed AI JSON after extraction/cleanup.');
          } catch (secondParseError) {
            console.warn('Failed to parse cleaned candidate JSON:', secondParseError);
            console.warn('Candidate (truncated 1k):', candidate.substring(0, 1000));
            throw new Error('Invalid JSON response from AI');
          }
        } else {
          // No candidate JSON found, rethrow a helpful error for telemetry
          console.error('No JSON block found in AI response.');
          throw new Error('Invalid JSON response from AI');
        }
      }

      this.updateJobProgress(jobId, 'formatting', 80, 'Formatting worksheet content');

      // Convert to our worksheet format
      const worksheet = this.convertToWorksheetWithTemplate(worksheetData, request, templateId);
      
      return {
        worksheet,
        markdown: this.convertToMarkdown(worksheet),
        usage: completion.usage
      };
    } catch (error) {
      console.error('Error generating template-based worksheet:', error);
      throw error;
    }
  }

  private isLanguageSubject(subject: string): boolean {
    const languageSubjects = ['spanish', 'french', 'german', 'italian', 'languages'];
    return languageSubjects.includes(subject.toLowerCase());
  }

  private async getVocabularyForTemplate(request: WorksheetRequest): Promise<any[]> {
    try {
      const query: any = {
        language: this.getLanguageCode(request.originalSubject || request.subject),
        limit: request.targetQuestionCount || 20
      };

      console.log(`[TemplateHandler] Query parameters:`, JSON.stringify(query, null, 2));

      // Add curriculum-specific filters
      if (request.curriculumLevel === 'KS4') {
        query.curriculumLevel = 'KS4';
        if (request.examBoard) {
          query.examBoard = request.examBoard;
        }
        if (request.tier) {
          query.tier = request.tier;
        }
      } else {
        // Default to KS3
        query.curriculumLevel = 'KS3';
        if (request.category) {
          query.category = request.category;
        }
        if (request.subcategory) {
          query.subcategory = request.subcategory;
        }
      }

      console.log(`[TemplateHandler] Final query with filters:`, JSON.stringify(query, null, 2));

      const vocabulary = await this.vocabularyService.getVocabulary(query);
      console.log(`[TemplateHandler] Retrieved ${vocabulary.length} vocabulary words for ${request.subject}`);
      
      return vocabulary;
    } catch (error) {
      console.error('Error fetching vocabulary:', error);
      return [];
    }
  }

  private getLanguageCode(subject: string): string {
    const languageMap: { [key: string]: string } = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'italian': 'it',
      'languages': 'es' // Default to Spanish for the generic "Languages" subject
    };
    return languageMap[subject.toLowerCase()] || 'es';
  }

  private getSystemPrompt(templateId: string): string {
    const basePrompt = 'You are an expert educator creating high-quality worksheets. Always respond with valid JSON only - no comments, no explanations, no markdown code blocks, just pure JSON.';
    
    const templateSpecificPrompts: { [key: string]: string } = {
      vocabulary_builder: `${basePrompt} You specialize in creating vocabulary worksheets with mixed activities including matching, fill-in-the-blank, and translation exercises.`,
  vocabulary_practice: `${basePrompt} You specialize in creating vocabulary practice worksheets with matching, fill-in-the-blank, translation, word bank, word search, and crossword exercises using specific vocabulary words.`,
  grammar_exercises: `${basePrompt} You specialize in creating engaging grammar practice packs that combine clear explanations, worked examples, and varied activity types (conjugation tables, sentence completion, transformations, error correction). Always respond with well-structured JSON that includes rich instructional content and complete answer keys.`,
      verb_conjugation: `${basePrompt} You specialize in creating verb conjugation practice worksheets with contextual sentences and blanks for students to fill in correct verb forms.`,
      sentence_builder: `${basePrompt} You specialize in creating sentence unscrambling activities where students must put jumbled words back in the correct order.`,
      reading_comprehension: `${basePrompt} You specialize in creating reading comprehension worksheets with level-appropriate texts and comprehension activities. CRITICAL: For reading comprehension templates, you MUST use a special JSON format with fields like "topic_title", "article_paragraphs_html", "true_false_questions", etc. Do NOT use the standard worksheet format with "sections".`,
      guided_reading: `${basePrompt} You specialize in creating cloze activities where key words are removed from texts for students to fill in.`,
      word_search: `${basePrompt} You specialize in creating word search puzzles from vocabulary lists with clear grids and word lists.`,
      crossword: `${basePrompt} You specialize in creating crossword puzzles with clues based on vocabulary definitions and clear numbered grids.`,
      vocabulary_crossword: `${basePrompt} You specialize in creating vocabulary-based crossword puzzles using specific vocabulary words with contextual clues.`,
      vocabulary_wordsearch: `${basePrompt} You specialize in creating vocabulary-based word search puzzles using specific vocabulary words with clear grids and instructions.`,
      revision_sheet: `${basePrompt} You specialize in creating comprehensive revision sheets that combine multiple activity types in a single worksheet.`
    };

    return templateSpecificPrompts[templateId] || basePrompt;
  }

  private buildTemplatePrompt(request: WorksheetRequest, templateId: string, vocabularyWords: any[]): string {
    const baseInfo = `Create a ${request.difficulty || 'medium'} difficulty ${request.subject} worksheet about "${request.topic || 'general concepts'}" for grade ${request.gradeLevel || 7} students.`;
    
    // Add vocabulary context if available
    let vocabularyContext = '';
    if (vocabularyWords.length > 0) {
      const vocabList = vocabularyWords.map(w => `${w.word} (${w.translation})`).join(', ');
      vocabularyContext = `\n\nUse these vocabulary words: ${vocabList}`;
    } else if (request.customVocabulary) {
      vocabularyContext = `\n\nUse these custom vocabulary words: ${request.customVocabulary}`;
    }

    const grammarExerciseSource = (() => {
      const advanced = request.advancedOptions?.grammarExerciseTypes;
      if (advanced && advanced.length > 0) {
        return advanced;
      }
      if (request.questionTypes && request.questionTypes.length > 0) {
        return request.questionTypes;
      }
      return [] as string[];
    })();

    const normalizeGrammarType = (value: string) => {
      if (!value) return value;
      const simplified = value.toLowerCase().replace(/[^a-z]/g, '');
      const map: Record<string, string> = {
        conjugation: 'conjugation',
        verbconjugation: 'conjugation',
        sentencecompletion: 'sentence-completion',
        sentencecompletionexercise: 'sentence-completion',
        transformation: 'transformation',
        sentencetransformation: 'transformation',
        errorcorrection: 'error-correction',
        proofreading: 'error-correction'
      };
      return map[simplified] || value.toLowerCase();
    };

    const grammarExerciseTypes = (() => {
      const normalized = Array.from(
        new Set(grammarExerciseSource.map(normalizeGrammarType).filter(Boolean))
      );
      if (normalized.length > 0) {
        return normalized;
      }
      return ['conjugation', 'sentence-completion', 'transformation', 'error-correction'];
    })();

    const grammarExerciseDescriptions = grammarExerciseTypes
      .map((type, index) => {
        const prefix = `${index + 1}.`;
        switch (type) {
          case 'conjugation':
            return `${prefix} **Verb Conjugation** – Include 2-3 verbs. Provide "verb", optional "tense", and a "pronouns" array (e.g. ["yo","tú","él/ella","nosotros","vosotros","ellos/ellas"]).`;
          case 'sentence-completion':
            return `${prefix} **Sentence Completion** – Contextual sentences with one blank. Each item needs "sentence" and "answer".`;
          case 'transformation':
            return `${prefix} **Sentence Transformation** – Supply "original", an "instruction", and the transformed "answer".`;
          case 'error-correction':
            return `${prefix} **Error Correction** – Provide "incorrect", the corrected sentence in "correction", plus an "explanation".`;
          default:
            return `${prefix} **${type}** – Include "instructions" and an "items" array with clear fields.`;
        }
      })
      .join('\n');

    const grammarFocusDescription = (() => {
      const focusValue = (request.advancedOptions as any)?.grammarFocus || request.subtopic || request.topic;
      if (!focusValue) return '';
      const focusArray = Array.isArray(focusValue) ? focusValue : [focusValue];
      const formatted = focusArray
        .map((entry: string) => entry)
        .filter(Boolean)
        .map((entry: string) => entry.replace(/[_-]/g, ' '))
        .map((entry: string) => entry.charAt(0).toUpperCase() + entry.slice(1));
      if (formatted.length === 0) return '';
      const focusText = formatted.join(', ');
      return `Focus specifically on ${focusText}.`;
    })();

    const templatePrompts: { [key: string]: string } = {
      vocabulary_builder: `${baseInfo}${vocabularyContext}

Create a vocabulary builder worksheet with:
- Section 1: Matching exercise (${Math.ceil((request.targetQuestionCount || 10) / 3)} items)
- Section 2: Fill in the blanks with articles/gender (${Math.ceil((request.targetQuestionCount || 10) / 3)} items)  
- Section 3: Translation exercises (${Math.floor((request.targetQuestionCount || 10) / 3)} items)

Include clear instructions for each section and provide answer keys.`,

      verb_conjugation: `${baseInfo}${vocabularyContext}

Create a verb conjugation drill worksheet with:
- ${request.targetQuestionCount || 10} practice sentences with blanks for verb conjugation
- Focus on ${request.topic || 'present tense'} 
- Include a variety of pronouns and contexts
- Provide the infinitive verb in parentheses as a hint
- Include answer key with correct conjugations`,

      sentence_builder: `${baseInfo}${vocabularyContext}

Create a sentence builder (unscrambling) worksheet with:
- ${request.targetQuestionCount || 10} jumbled sentences to unscramble
- Sentences should be appropriate for the topic and difficulty level
- Include word order hints if needed
- Provide answer key with correct sentence order`,

      reading_comprehension: `${baseInfo}${vocabularyContext}

IMPORTANT: You MUST respond with the exact JSON format specified below. Do NOT use the standard worksheet format with "sections". This is a special reading comprehension template.

Create a reading comprehension worksheet with:

1. **Article**: Generate a ${request.targetLanguage || 'French'} text passage (200-300 words) appropriate for ${request.curriculumLevel || 'intermediate'} level students about "${request.subtopic || request.topic || 'daily life'}".

2. **Activities**: Generate exactly these 7 activity types:
   - **True/False Questions**: 4-5 statements WRITTEN IN ENGLISH about the text content
   - **Multiple Choice**: 3-4 questions WRITTEN IN ENGLISH with 4 options each (A, B, C, D) WRITTEN IN ENGLISH
   - **Word Hunt**: 4-6 vocabulary words - provide English definitions and students find the ${request.targetLanguage || 'French'} word in the text
   - **Tense Detective**: 1 prompt asking students to find a specific tense/grammar structure
   - **Vocabulary Writing**: 4-5 ${request.targetLanguage || 'French'} words from the text with English definitions - students write the word
   - **Sentence Unscramble**: 2-3 properly scrambled sentences that can actually form correct ${request.targetLanguage || 'French'} sentences
CRITICAL REQUIREMENTS - READ CAREFULLY:
- True/False statements must be WRITTEN IN ENGLISH about the text content (NOT in ${request.targetLanguage || 'French'})
- Multiple choice questions and options must be WRITTEN IN ENGLISH (NOT in ${request.targetLanguage || 'French'})
- Word hunt: English definition → find ${request.targetLanguage || 'French'} word in text
- Vocabulary writing: ${request.targetLanguage || 'French'} word with English definition for students to write
- Sentence unscramble: Make sure scrambled words include ALL necessary words (articles, prepositions, etc.) to form a complete proper sentence
- Use "${request.targetLanguage || 'French'}" not "French" in instructions
- IMPORTANT: Questions should be in English so students can understand what they need to do

CRITICAL: You MUST return ONLY this exact JSON format (no other fields):
{
  "topic_title": "Topic name in ${request.targetLanguage || 'French'}",
  "article_title": "Article title in ${request.targetLanguage || 'French'}",
  "article_paragraphs_html": "Full HTML with <p> tags for each paragraph",
  "true_false_questions": [{"id": 1, "statement": "Students enjoy playing sports as a hobby", "answer": true}],
  "multiple_choice_questions": [{"id": 1, "question": "What hobby is mentioned in the text?", "options": [{"letter": "A", "text": "Reading books"}, {"letter": "B", "text": "Playing games"}, {"letter": "C", "text": "Watching TV"}, {"letter": "D", "text": "Sleeping"}], "answer": "A"}],
  "word_hunt_words": [{"word": "English definition", "answer": "${request.targetLanguage || 'French'} word from text"}],
  "tense_detective_prompt": "Find a sentence in the present tense",
  "vocabulary_writing": [{"word": "${request.targetLanguage || 'French'} word", "definition": "English definition"}],
  "unscramble_sentences": [{"id": 1, "jumbled_sentence": "properly scrambled words including ALL necessary words like prepositions and articles", "answer": "correct complete ${request.targetLanguage || 'French'} sentence with all words"}],
  "translation_sentences": [{"id": 1, "sentence": "${request.targetLanguage || 'French'} sentence", "answer": "English translation"}]
}

DO NOT include "title", "instructions", "sections", or any other fields. Use ONLY the format above.`,

      guided_reading: `${baseInfo}${vocabularyContext}

Create a guided reading (cloze) worksheet with:
- A text (200-300 words) with ${request.targetQuestionCount || 15} key words removed
- Provide a word bank with the missing words
- Focus on vocabulary related to the topic
- Include answer key showing correct word placement`,

      word_search: `${baseInfo}${vocabularyContext}

Create a word search puzzle with:
- A 15x15 grid containing ${request.targetQuestionCount || 15} hidden words
- Words should be related to the topic
- Include the word list for students to find
- Words can be horizontal, vertical, or diagonal
- Provide answer key showing word locations`,

      crossword: `${baseInfo}${vocabularyContext}

Create a crossword puzzle with:
- ${request.targetQuestionCount || 12} clues (mix of across and down)
- Clues should be definitions or hints for vocabulary words
- Include a properly sized grid
- Provide answer key with completed crossword`,

      vocabulary_practice: this.buildVocabularyPracticePrompt(request, baseInfo, vocabularyContext),

      vocabulary_crossword: `${baseInfo}${vocabularyContext}

Create a vocabulary crossword puzzle:
- Use the provided vocabulary words as answers
- Create contextual clues in English that help students identify the Spanish words
- Design a crossword grid (10x10 or 12x12) with numbered squares
- Include both Across and Down clues
- Provide a word bank if needed
- Include clear instructions and answer key`,

      vocabulary_wordsearch: `${baseInfo}${vocabularyContext}

Create a vocabulary word search puzzle:
- Use the provided vocabulary words (Spanish words only)
- Create a 15x15 letter grid with words hidden horizontally, vertically, and diagonally
- Include a clear word bank showing all vocabulary words to find
- Words can be forwards or backwards
- Fill remaining spaces with random letters
- Include clear instructions and answer key with words circled`,

      grammar_exercises: `${baseInfo}${vocabularyContext}

${grammarFocusDescription}

Design a grammar practice worksheet that combines explanation, examples, and these activity types:
${grammarExerciseDescriptions}

Respond with EXACTLY this JSON schema (no other fields):
{
  "title": "Worksheet title",
  "instructions": "Overall student instructions",
  "grammar_topic": "Headline for the grammar focus",
  "explanation": "Detailed explanation (HTML allowed)",
  "examples": [
    {"correct": "Correct model", "incorrect": "Optional incorrect model", "explanation": "Why"}
  ],
  "exercises": [
    {
      "type": "one of ${grammarExerciseTypes.join(', ')}",
      "title": "Section title",
      "instructions": "Activity-specific instructions",
      "items": []
    }
  ],
  "answerKey": {
    "exercise1": ["Answers listed in order"]
  }
}

For each exercise, include at least ${Math.max(4, Math.ceil((request.targetQuestionCount || 12) / grammarExerciseTypes.length))} items. Use these item templates by type:
- conjugation → {"verb": "hablar", "tense": "present", "pronouns": ["yo",...], "answers": {"yo": "hablo", ...}}
- sentence-completion → {"sentence": "Yo ____ al parque.", "answer": "voy"}
- transformation → {"original": "Veo la televisión.", "instruction": "Rewrite in the preterite", "answer": "Vi la televisión."}
- error-correction → {"incorrect": "Ellos va a la escuela.", "correction": "Ellos van a la escuela.", "explanation": "Plural agreement"}

Keep wording culturally neutral, reference the target language (${request.originalSubject || request.subject}), and make the answer key align exactly with provided items.`,

      revision_sheet: `${baseInfo}${vocabularyContext}

Create a comprehensive revision sheet with multiple sections:
- Section A: Vocabulary matching (${Math.ceil((request.targetQuestionCount || 15) / 3)} items)
- Section B: Grammar/verb practice (${Math.ceil((request.targetQuestionCount || 15) / 3)} items)
- Section C: Translation sentences (${Math.floor((request.targetQuestionCount || 15) / 3)} items)
- Include clear section headers and instructions
- Provide comprehensive answer key`
    };

    const templatePrompt = templatePrompts[templateId] || baseInfo;
    
    const appendStandardSchema = !['reading_comprehension', 'vocabulary_practice', 'grammar_exercises'].includes(templateId);

    return `${templatePrompt}

${request.customPrompt ? `Additional requirements: ${request.customPrompt}` : ''}

${appendStandardSchema ? `Respond with valid JSON in this format:
{
  "title": "Worksheet Title",
  "instructions": "General instructions for students",
  "sections": [
    {
      "title": "Section Title",
      "instructions": "Section-specific instructions",
      "questions": [
        {
          "text": "Question text",
          "type": "question_type",
          "options": ["A", "B", "C", "D"],
          "answer": "A",
          "marks": 1
        }
      ]
    }
  ],
  "answerKey": {
    "section1": ["answer1", "answer2"],
    "section2": ["answer1", "answer2"]
  }
}` : ''}

CRITICAL: Return ONLY valid JSON. Do NOT include:
- JavaScript comments (// or /* */)
- Markdown code blocks
- Explanatory text before or after the JSON
- Any content other than pure JSON`;
  }

  protected convertToWorksheetWithTemplate(data: any, request: WorksheetRequest, templateId: string): Worksheet {
    // For reading comprehension, preserve the raw AI response structure
    if (templateId === 'reading_comprehension') {
      return {
        id: uuidv4(),
        title: data.topic_title || data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
        subject: request.subject,
        topic: request.topic,
        difficulty: request.difficulty || 'medium',
        instructions: data.instructions || 'Read the text and complete all activities.',
        introduction: data.introduction || '',
        sections: [], // Keep empty for reading comprehension
        language: request.language || 'English',
        estimatedTimeMinutes: this.getEstimatedTime(templateId),
        tags: [request.subject.toLowerCase(), templateId, request.topic?.toLowerCase()].filter(Boolean) as string[],
        seo_description: `A ${request.difficulty || 'medium'} difficulty ${this.getTemplateDisplayName(templateId)} worksheet on ${request.topic || 'general concepts'}`,
        seo_keywords: [request.subject, templateId.replace('_', ' '), request.topic].filter(Boolean).join(', '),
        answerKey: data.answerKey || {},
        metadata: {
          title: data.topic_title || data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
          subject: request.subject,
          difficulty: request.difficulty || 'medium',
          template: templateId,
          vocabularySource: request.customVocabulary ? 'custom' : 'centralized',
          curriculumLevel: request.curriculumLevel,
          examBoard: request.examBoard,
          tier: request.tier
        },
        // Store the raw reading comprehension data
        rawContent: data
      };
    }

    // For vocabulary practice, preserve the new structure with vocabulary_items and exercises
    if (templateId === 'vocabulary_practice') {
      return {
        id: uuidv4(),
        title: data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
        subject: request.subject,
        topic: request.topic,
        difficulty: request.difficulty || 'medium',
        instructions: data.instructions || 'Complete all vocabulary exercises below.',
        introduction: data.introduction || '',
        sections: [], // Keep empty for vocabulary practice - content is in rawContent
        language: request.language || 'English',
        estimatedTimeMinutes: this.getEstimatedTime(templateId),
        tags: [request.subject.toLowerCase(), templateId, request.topic?.toLowerCase()].filter(Boolean) as string[],
        seo_description: `A ${request.difficulty || 'medium'} difficulty ${this.getTemplateDisplayName(templateId)} worksheet on ${request.topic || 'general concepts'}`,
        seo_keywords: [request.subject, templateId.replace('_', ' '), request.topic].filter(Boolean).join(', '),
        answerKey: data.answerKey || {},
        metadata: {
          title: data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
          subject: request.subject,
          difficulty: request.difficulty || 'medium',
          template: templateId,
          vocabularySource: request.customVocabulary ? 'custom' : 'centralized',
          curriculumLevel: request.curriculumLevel,
          examBoard: request.examBoard,
          tier: request.tier
        },
        // Store the raw vocabulary practice data with vocabulary_items and exercises
        rawContent: data
      };
    }

    if (templateId === 'grammar_exercises') {
      const grammarFocus = (request.advancedOptions as any)?.grammarFocus || request.subtopic || request.topic;
      const targetLanguage = request.targetLanguage || request.language || request.subject;
      return {
        id: uuidv4(),
        title: data.title || `${this.getTemplateDisplayName(templateId)} - ${grammarFocus || request.subject}`,
        subject: request.subject,
        topic: request.topic,
        difficulty: request.difficulty || 'medium',
        instructions: data.instructions || request.customPrompt || 'Complete the grammar exercises below.',
        introduction: data.introduction || '',
        sections: [],
        language: targetLanguage || 'English',
        estimatedTimeMinutes: this.getEstimatedTime(templateId),
        tags: [request.subject.toLowerCase(), templateId, grammarFocus?.toString().toLowerCase()].filter(Boolean) as string[],
        seo_description: `A ${request.difficulty || 'medium'} difficulty ${this.getTemplateDisplayName(templateId)} worksheet on ${grammarFocus || request.topic || 'core grammar skills'}`,
        seo_keywords: [request.subject, templateId.replace('_', ' '), grammarFocus || request.topic].filter(Boolean).join(', '),
        answerKey: data.answerKey || {},
        metadata: {
          title: data.title || `${this.getTemplateDisplayName(templateId)} - ${grammarFocus || request.subject}`,
          subject: request.subject,
          difficulty: request.difficulty || 'medium',
          template: templateId,
          grammarFocus,
          targetLanguage,
          curriculumLevel: request.curriculumLevel,
          examBoard: request.examBoard,
          tier: request.tier
        },
        rawContent: data
      };
    }

    // Default format for other templates
    return {
      id: uuidv4(),
      title: data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
      subject: request.subject,
      topic: request.topic,
      difficulty: request.difficulty || 'medium',
      instructions: data.instructions || 'Complete all sections carefully.',
      introduction: data.introduction || '',
      sections: data.sections || [],
      language: request.language || 'English',
      estimatedTimeMinutes: this.getEstimatedTime(templateId),
      tags: [request.subject.toLowerCase(), templateId, request.topic?.toLowerCase()].filter(Boolean) as string[],
      seo_description: `A ${request.difficulty || 'medium'} difficulty ${this.getTemplateDisplayName(templateId)} worksheet on ${request.topic || 'general concepts'}`,
      seo_keywords: [request.subject, templateId.replace('_', ' '), request.topic].filter(Boolean).join(', '),
      answerKey: data.answerKey || {},
      metadata: {
        title: data.title || `${this.getTemplateDisplayName(templateId)} - ${request.topic || request.subject}`,
        subject: request.subject,
        difficulty: request.difficulty || 'medium',
        template: templateId,
        vocabularySource: request.customVocabulary ? 'custom' : 'centralized',
        curriculumLevel: request.curriculumLevel,
        examBoard: request.examBoard,
        tier: request.tier
      }
    };
  }

  private getTemplateDisplayName(templateId: string): string {
    const displayNames: { [key: string]: string } = {
      vocabulary_builder: 'Vocabulary Builder',
      vocabulary_practice: 'Vocabulary Practice',
      vocabulary_crossword: 'Vocabulary Crossword',
      vocabulary_wordsearch: 'Vocabulary Word Search',
      verb_conjugation: 'Verb Conjugation Drill',
      sentence_builder: 'Sentence Builder',
      reading_comprehension: 'Reading Comprehension',
      guided_reading: 'Guided Reading',
      word_search: 'Word Search',
      crossword: 'Crossword Puzzle',
      grammar_exercises: 'Grammar Exercises',
      revision_sheet: 'Revision Sheet'
    };
    return displayNames[templateId] || 'Worksheet';
  }

  private buildVocabularyPracticePrompt(request: WorksheetRequest, baseInfo: string, vocabularyContext: string): string {
    const questionTypes = request.questionTypes || ['matching', 'fillBlanks', 'translations', 'definitions'];
    const exercisesPerType = Math.ceil((request.targetQuestionCount || 15) / questionTypes.length);
    
    // Determine the target language name
    const targetLanguage = request.originalSubject 
      ? request.originalSubject.charAt(0).toUpperCase() + request.originalSubject.slice(1)
      : (request.topic || 'target language');

    let exerciseTemplates = '';

    if (questionTypes.includes('matching')) {
      exerciseTemplates += `
    {
      "type": "matching",
      "title": "Matching Exercise",
      "instructions": "Match the ${targetLanguage} words with their English translations.",
      "items": [
        {"word": "${targetLanguage} word", "definition": "English translation"},
        // 10 items total (will display in 2 columns: 5 left, 5 right)
      ]
    },`;
    }

    if (questionTypes.includes('fillBlanks')) {
      exerciseTemplates += `
    {
      "type": "fill-in-blank",
      "title": "Fill in the Blanks",
      "instructions": "Complete each sentence with the correct ${targetLanguage} word.",
      "items": [
        {"sentence": "Example sentence with _____ blank.", "answer": "word"},
        // ${exercisesPerType} items total - create meaningful, contextual sentences using vocabulary words
        // Each sentence should have ONE blank marked with _____
        // IMPORTANT: Write sentences in ${targetLanguage}, not in English
        // Use as many vocabulary words as possible to create ${exercisesPerType} different sentences
      ]
    },`;
    }

    if (questionTypes.includes('translations')) {
      exerciseTemplates += `
    {
      "type": "translation",
      "title": "Translation Practice",
      "instructions": "Translate the following words from English to ${targetLanguage}.",
      "items": [
        {"source": "English word", "target": "${targetLanguage} translation"},
        // 10 items total
      ]
    },`;
    }

    if (questionTypes.includes('definitions')) {
      exerciseTemplates += `
    {
      "type": "definition",
      "title": "Multiple Choice",
      "instructions": "Choose the correct ${targetLanguage} word for each definition.",
      "items": [
        {"question": "What is the ${targetLanguage} word for 'example'?", "options": ["option1", "option2", "option3", "option4"], "answer": "option1"},
        // MAX 8 items (will display in 2 columns) - MUST NOT exceed 8 to fit on one page
        // IMPORTANT: Questions MUST be written in ENGLISH (e.g., "What is the French word for 'phone'?")
        // Options should be ${targetLanguage} words
      ]
    },`;
    }

    if (questionTypes.includes('unjumble')) {
      exerciseTemplates += `
    {
      "type": "unjumble",
      "title": "Word Unjumble",
      "instructions": "Unscramble the letters to form the correct ${targetLanguage} word.",
      "items": [
        {"scrambled": "ldemxbrae", "correct": "exambleword"},
        // 8 items total - scramble vocabulary words by mixing up letters
        // Use ${targetLanguage} words from the vocabulary list
      ]
    },`;
    }

    if (questionTypes.includes('wordsearch')) {
      exerciseTemplates += `
    {
      "type": "wordsearch",
      "title": "Word Search",
      "instructions": "Find all the ${targetLanguage} words hidden in the grid below.",
      "grid_size": 16,
      "words": [], // Will be populated with 14 ${targetLanguage} words from vocabulary_items (remove all spaces from multi-word terms)
      "grid": [] // Will be generated automatically
    },`;
    }

    if (questionTypes.includes('crossword')) {
      exerciseTemplates += `
    {
      "type": "crossword",
      "title": "Crossword Puzzle",
      "instructions": "Complete the crossword using the vocabulary words.",
      "clues": {
        "across": [
          {"number": 1, "clue": "A descriptive clue (e.g., 'A vehicle with two wheels, without a motor' for bicycle)", "answer": "${targetLanguage.toLowerCase()}_word", "position": [0, 0]}
          // Include 10-12 across clues total - use single words without spaces
          // IMPORTANT: Write descriptive, contextual clues that help students learn, NOT direct translations
          // Example good clues: "A place where students learn" (school), "An animal that says meow" (cat)
          // Avoid: "The ${targetLanguage} word for house" - instead write: "A building where a family lives"
          // Use ${targetLanguage} words as answers
        ],
        "down": [
          {"number": 2, "clue": "A descriptive clue (e.g., 'What you use to write on paper' for pen)", "answer": "${targetLanguage.toLowerCase()}_word", "position": [0, 1]}
          // Include 10-12 down clues total - use single words without spaces
          // IMPORTANT: Write descriptive, contextual clues that help students learn, NOT direct translations
          // Use ${targetLanguage} words as answers
        ]
      },
      "grid_size": 15
    },`;
    }

    // Remove trailing comma
    exerciseTemplates = exerciseTemplates.replace(/,$/, '');

    return `${baseInfo}${vocabularyContext}

Create a professional vocabulary practice worksheet using this EXACT JSON structure:

{
  "title": "Worksheet title here",
  "instructions": "Complete all vocabulary exercises below. Use the vocabulary list for reference.",
  "vocabulary_items": [
    {"word": "${targetLanguage} word", "translation": "English translation", "article": "el/la/los/las if applicable"},
    // Include ALL provided vocabulary words here
  ],
  "word_bank": ["word1", "word2", "word3"], // ${targetLanguage} words only for word bank exercises
  "exercises": [${exerciseTemplates}
  ]
}

CRITICAL INSTRUCTIONS:
1. Use ONLY the provided vocabulary words
2. ALL instructions, questions, and prompts MUST be written in ENGLISH
3. Only the vocabulary words, answers to blanks, and sentence content should be in ${targetLanguage}
4. For fill-in-the-blanks: Create AT LEAST ${exercisesPerType} sentences in ${targetLanguage} with blanks
5. For multiple choice: Questions MUST be in ENGLISH (e.g., "What is the French word for 'phone'?"), options in ${targetLanguage}
6. Never use "undefined" or duplicate numbering
7. Create meaningful, contextual sentences and questions`;
  }

  private getEstimatedTime(templateId: string): number {
    const timeEstimates: { [key: string]: number } = {
      vocabulary_builder: 25,
      vocabulary_practice: 30,
      vocabulary_crossword: 25,
      vocabulary_wordsearch: 20,
      verb_conjugation: 20,
      sentence_builder: 15,
      reading_comprehension: 30,
      guided_reading: 25,
      word_search: 20,
      crossword: 35,
      grammar_exercises: 30,
      revision_sheet: 45
    };
    return timeEstimates[templateId] || 30;
  }
}
